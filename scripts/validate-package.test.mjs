import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixtureEntries = [
  ".agents",
  ".claude-plugin",
  "commands",
  "docs",
  "plugins",
  "scripts",
  "README.md",
];

function makeFixture() {
  const fixture = mkdtempSync(join(tmpdir(), "unpitch-package-validator-"));
  for (const entry of fixtureEntries) {
    cpSync(join(packageRoot, entry), join(fixture, entry), { recursive: true });
  }
  return fixture;
}

function runScript(root, script) {
  return spawnSync(process.execPath, [join(root, "scripts", script)], {
    cwd: root,
    encoding: "utf8",
  });
}

function outputOf(result) {
  return `${result.stdout ?? ""}${result.stderr ?? ""}`;
}

function mutateAllowedTools(root, transform, command = "check.md", packageDirectory = "plugins/unpitch") {
  const path = join(root, packageDirectory, "commands", command);
  const text = readFileSync(path, "utf8");
  const next = text.replace(/^allowed-tools: (.+)$/m, (_line, declaration) => {
    const tools = declaration.split(",").map((tool) => tool.trim());
    return `allowed-tools: ${transform(tools).join(", ")}`;
  });
  assert.notEqual(next, text, "test mutation did not change the allowed-tools declaration");
  writeFileSync(path, next);
}

function mutateTextFile(path, transform) {
  const text = readFileSync(path, "utf8");
  const next = transform(text);
  assert.notEqual(next, text, `test mutation did not change ${path}`);
  writeFileSync(path, next);
}

function mutateMirroredSkill(root, skill, transform) {
  for (const packageDirectory of ["unpitch", "unpitch-claude-code"]) {
    mutateTextFile(join(root, "plugins", packageDirectory, "skills", skill, "SKILL.md"), transform);
  }
}

function mutateCheckCommands(root, transform) {
  for (const directory of ["commands", "plugins/unpitch/commands", "plugins/unpitch-claude-code/commands"]) {
    mutateTextFile(join(root, directory, "check.md"), transform);
  }
}

function expectValidatorFailure(name, mutate, messagePattern) {
  const fixture = makeFixture();
  try {
    mutate(fixture);
    const result = runScript(fixture, "validate-package.mjs");
    assert.notEqual(result.status, 0, `${name} unexpectedly passed validation`);
    assert.match(outputOf(result), messagePattern, `${name} failed for an unexpected reason`);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

const baseline = runScript(packageRoot, "validate-package.mjs");
assert.equal(baseline.status, 0, outputOf(baseline));

expectValidatorFailure(
  "later wrong-prefix token",
  (root) => mutateAllowedTools(root, (tools) => {
    tools[1] = tools[1].replace("mcp__plugin_unpitch-hosted_unpitch__", "mcp__unpitch__");
    return tools;
  }),
  /wrong hosted plugin prefix/,
);

expectValidatorFailure(
  "missing token",
  (root) => mutateAllowedTools(root, (tools) => tools.slice(0, -1)),
  /allowed-tools differ from the canonical/,
);

expectValidatorFailure(
  "extra token",
  (root) => mutateAllowedTools(root, (tools) => [
    ...tools,
    "mcp__plugin_unpitch-hosted_unpitch__search_knowledge",
  ]),
  /allowed-tools differ from the canonical/,
);

expectValidatorFailure(
  "duplicate token",
  (root) => mutateAllowedTools(root, (tools) => [...tools, tools[0]]),
  /duplicate allowed-tools token/,
);

expectValidatorFailure(
  "malformed token",
  (root) => mutateAllowedTools(root, (tools) => {
    tools[1] = "not-an-mcp-tool";
    return tools;
  }),
  /malformed tool/,
);

expectValidatorFailure(
  "incomplete command tool union",
  (root) => mutateAllowedTools(
    root,
    (tools) => tools.filter((tool) => !tool.endsWith("__search_knowledge")),
    "context.md",
    ".",
  ),
  /command allowed-tools union must contain the exact 11-tool Unpitch registry/,
);

expectValidatorFailure(
  "incomplete documented tool registry",
  (root) => mutateTextFile(join(root, "docs", "tools.md"), (text) =>
    text.replace(/^\| `search_knowledge`.*\n/m, "")),
  /docs\/tools\.md registry must contain the exact 11-tool Unpitch registry/,
);

expectValidatorFailure(
  "incomplete general skill tool registry",
  (root) => {
    for (const packageDirectory of ["unpitch", "unpitch-claude-code"]) {
      mutateTextFile(
        join(root, "plugins", packageDirectory, "skills", "use-unpitch", "SKILL.md"),
        (text) => text.replace(/^\| `search_knowledge`.*\n/m, ""),
      );
    }
  },
  /use-unpitch tool registry must contain the exact 11-tool Unpitch registry/,
);

expectValidatorFailure(
  "general skill missing OpenAI MCP dependency",
  (root) => {
    for (const packageDirectory of ["unpitch", "unpitch-claude-code"]) {
      mutateTextFile(
        join(root, "plugins", packageDirectory, "skills", "use-unpitch", "agents", "openai.yaml"),
        (text) => text.replace('value: "unpitch"', 'value: "not-unpitch"'),
      );
    }
  },
  /use-unpitch lacks the Unpitch MCP dependency/,
);

expectValidatorFailure(
  "Code-only unsupported optional content field promise",
  (root) => mutateTextFile(
    join(root, "plugins", "unpitch-claude-code", "skills", "use-unpitch", "SKILL.md"),
    (text) => text.replace(
      /may\s+be sent only when supported by the live advertised input schema/,
      "may always be sent",
    ),
  ),
  /skills\/use-unpitch\/SKILL\.md differs between plugin variants/,
);

expectValidatorFailure(
  "unsupported optional content field promise",
  (root) => mutateMirroredSkill(root, "use-unpitch", (text) => text.replace(
    /may\s+be sent only when supported by the live advertised input schema/,
    "may always be sent",
  )),
  /must condition optional content fields on live schemas/,
);

expectValidatorFailure(
  "unsupported context is not reported",
  (root) => mutateMirroredSkill(root, "use-unpitch", (text) => text.replace(
    /explicitly tell them it cannot\s+be saved in this Document\./,
    "proceed with the supported fields.",
  )),
  /must report unsupported context/,
);

expectValidatorFailure(
  "unapproved context merge into exact body",
  (root) => mutateMirroredSkill(root, "use-unpitch", (text) => text.replace(
    /Never silently drop that context, claim it was saved, or fold it into the\s+exact `body` without explicit permission\./,
    "Fold that context into the exact `body`.",
  )),
  /must prevent silent context loss or unapproved body edits/,
);

expectValidatorFailure(
  "save without unsupported context before user choice",
  (root) => mutateMirroredSkill(root, "use-unpitch", (text) => text.replace(
    "wait for their choice before writing",
    "proceed with writing",
  )),
  /must wait for a choice before saving without unsupported context/,
);

expectValidatorFailure(
  "general title lookup stops at the first page",
  (root) => mutateMirroredSkill(root, "use-unpitch", (text) => text.replace(
    /Follow every\s+returned `nextCursor` unchanged as `cursor` in `list_documents` until `nextCursor` is `null`,\s+collecting exact-title matches across all pages\./,
    "Use only the first returned page.",
  )),
  /use-unpitch must follow every document cursor through the final page/,
);

expectValidatorFailure(
  "Quality Check concludes no or unique match before the final page",
  (root) => mutateMirroredSkill(root, "check-outreach", (text) => text.replace(
    /Do not conclude no\s+exact match or one exact match before pagination completes\./,
    "Conclude no exact match or one exact match after the first page.",
  )),
  /check-outreach must defer absent or unique title conclusions until pagination completes/,
);

expectValidatorFailure(
  "Quality Check writes after incomplete pagination",
  (root) => mutateMirroredSkill(root, "check-outreach", (text) => text.replace(
    /If pagination fails or cannot\s+complete, stop before any create or update and ask for the exact Document public short ID\./,
    "If pagination fails, create or update using the matches already returned.",
  )),
  /check-outreach must stop writes and request a public short ID when pagination cannot complete/,
);

expectValidatorFailure(
  "command chooses among duplicate titles without selection",
  (root) => mutateCheckCommands(root, (text) => text.replace(
    /For multiple exact-title matches across any pages, ask the user to\s+choose a public short ID before any write\./,
    "For multiple exact-title matches, choose the first public short ID.",
  )),
  /commands\/check\.md must require a public short ID choice for duplicate titles across pages/,
);

expectValidatorFailure(
  "command title lookup stops at the first page",
  (root) => mutateCheckCommands(root, (text) => text.replace(
    /Follow every returned `nextCursor` unchanged as\s+`cursor` in `list_documents` until `nextCursor` is `null`, collecting exact-title matches across\s+all pages\./,
    "Use only the first returned page.",
  )),
  /commands\/check\.md must follow every document cursor through the final page/,
);

expectValidatorFailure(
  "unexpected skill inventory entry",
  (root) => {
    mkdirSync(join(root, "plugins", "unpitch", "skills", "unexpected-skill"));
    mkdirSync(join(root, "plugins", "unpitch-claude-code", "skills", "unexpected-skill"));
  },
  /skill inventory differs from the canonical six-skill package/,
);

expectValidatorFailure(
  "missing connection verification warning",
  (root) => mutateTextFile(join(root, "README.md"), (text) =>
    text.replace(/^>.*\n/gm, "")),
  /README must retain the pending connection verification warning/,
);

expectValidatorFailure(
  "obsolete live DCR unavailability claim",
  (root) => mutateTextFile(join(root, "README.md"), (text) =>
    text.replace(
      "Installing a plugin and connecting an Unpitch account are separate steps.",
      "> The hosted package expects Dynamic Client Registration, but the live server does not\n> support it yet.\n\nInstalling a plugin and connecting an Unpitch account are separate steps.",
    )),
  /README must not claim the live server lacks Dynamic Client Registration/,
);

expectValidatorFailure(
  "customer raw CLI setup alternative",
  (root) => mutateTextFile(join(root, "README.md"), (text) =>
    text.replace(
      "## What you can ask",
      "Run `claude mcp add --client-id public-client unpitch https://api.unpitch.ai/mcp`.\n\n## What you can ask",
    )),
  /Customer README must keep marketplace setup as the one installation path/,
);

for (const pluginDirectory of ["unpitch", "unpitch-claude-code"]) {
  const fixture = makeFixture();
  try {
    writeFileSync(join(fixture, "plugins", pluginDirectory, ".env"), "FAKE_SECRET=not-a-secret\n");
    const result = runScript(fixture, "build-archives.mjs");
    assert.notEqual(result.status, 0, `${pluginDirectory} archive accepted an unexpected .env file`);
    assert.match(outputOf(result), /missing or unexpected public package file/);
    assert.equal(existsSync(join(fixture, "dist")), false, "archive output was created after rejection");
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

for (const pluginDirectory of ["unpitch", "unpitch-claude-code"]) {
  const fixture = makeFixture();
  let canaryDirectory;
  try {
    canaryDirectory = mkdtempSync(join(tmpdir(), "unpitch-package-external-canary-"));
    const canary = join(canaryDirectory, "external-canary.md");
    writeFileSync(canary, "Unpitch package test canary: harmless external file.\n");
    const packageReadme = join(fixture, "plugins", pluginDirectory, "README.md");
    rmSync(packageReadme);
    symlinkSync(canary, packageReadme, "file");

    const result = runScript(fixture, "build-archives.mjs");
    assert.notEqual(result.status, 0, `${pluginDirectory} archive accepted an external symlink`);
    assert.match(outputOf(result), /Plugin packages cannot contain symlinks:/);
    assert.equal(existsSync(join(fixture, "dist")), false, "archive output was created after symlink rejection");
  } finally {
    rmSync(fixture, { recursive: true, force: true });
    if (canaryDirectory) rmSync(canaryDirectory, { recursive: true, force: true });
  }
}

console.log("Package validator mutation tests passed (27 negative cases).");
