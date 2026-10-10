import assert from "node:assert/strict";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const hostedRoot = join(packageRoot, "plugins", "unpitch");
const codeRoot = join(packageRoot, "plugins", "unpitch-claude-code");
const endpoint = "https://api.unpitch.ai/mcp";
const codeClientId = "ae21983d-3072-43ab-ad47-d5feae975afc";
const commandNames = ["check.md", "context.md", "readers.md", "simulate.md"];
const canonicalToolNames = [
  "get_workspace_context",
  "list_documents",
  "get_document",
  "search_knowledge",
  "list_personas",
  "get_run",
  "create_document",
  "update_document",
  "run_quality_check",
  "quote_simulation",
  "run_simulation",
];
const expectedSkills = [
  "check-outreach",
  "choose-unpitch-reader",
  "setup-unpitch",
  "simulate-outreach",
  "unpitch-context",
  "use-unpitch",
];
const skillFiles = expectedSkills.flatMap((skill) => [
  `skills/${skill}/SKILL.md`,
  `skills/${skill}/agents/openai.yaml`,
]);
const hostedPackageFiles = [
  ".claude-plugin/plugin.json",
  ".mcp.json",
  "README.md",
  "mcp.json",
  "plugin.json",
  ...commandNames.map((name) => `commands/${name}`),
  ...skillFiles,
].sort();
const codePackageFiles = [
  ".claude-plugin/plugin.json",
  "README.md",
  ...commandNames.map((name) => `commands/${name}`),
  ...skillFiles,
].sort();

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function filesBelow(root) {
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      const stats = lstatSync(path);
      assert.equal(stats.isSymbolicLink(), false, `Plugin packages cannot contain symlinks: ${path}`);
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile()) files.push(relative(root, path));
    }
  };
  visit(root);
  return files.sort();
}

function assertPackageFiles(root, expected, label) {
  assert.deepEqual(
    filesBelow(root),
    expected,
    `${label} contains a missing or unexpected public package file`,
  );
}

function assertMirrored(subpath) {
  const hostedFiles = filesBelow(join(hostedRoot, subpath));
  const codeFiles = filesBelow(join(codeRoot, subpath));
  assert.deepEqual(codeFiles, hostedFiles, `${subpath} file lists differ between plugin variants`);
  for (const file of hostedFiles) {
    assert.deepEqual(
      readFileSync(join(codeRoot, subpath, file)),
      readFileSync(join(hostedRoot, subpath, file)),
      `${subpath}/${file} differs between plugin variants`,
    );
  }
}

function assertExactToolRegistry(tools, label) {
  assert.equal(new Set(tools).size, tools.length, `${label} contains a duplicate tool name`);
  assert.deepEqual(
    [...tools].sort(),
    [...canonicalToolNames].sort(),
    `${label} must contain the exact 11-tool Unpitch registry`,
  );
}

function readToolTable(path) {
  const text = readFileSync(path, "utf8");
  return [...text.matchAll(/^\|\s*`([a-z][a-z0-9_]*)`\s*\|/gm)].map((match) => match[1]);
}

function readAllowedTools(path) {
  const text = readFileSync(path, "utf8");
  const declarations = text.match(/^allowed-tools:.*$/gm) ?? [];
  assert.equal(declarations.length, 1, `${path} must declare allowed-tools exactly once`);
  const raw = declarations[0].slice("allowed-tools:".length).trim();
  assert.notEqual(raw, "", `${path} has an empty allowed-tools declaration`);
  const tools = raw.split(",").map((token) => token.trim());
  assert.equal(tools.every(Boolean), true, `${path} has an empty allowed-tools token`);
  for (const tool of tools) {
    assert.match(tool, /^mcp__[A-Za-z0-9_-]+__[A-Za-z0-9_]+$/, `${path} has malformed tool ${tool}`);
  }
  assert.equal(new Set(tools).size, tools.length, `${path} has a duplicate allowed-tools token`);
  return { text, tools };
}

function assertCommandTools(root, label, prefix, expectedByCommand) {
  const union = new Set();
  const declarations = [];
  for (const command of commandNames) {
    const path = join(root, command);
    const { tools } = readAllowedTools(path);
    for (const tool of tools) {
      assert.equal(tool.startsWith(prefix), true, `${path} has a tool with the wrong ${label} prefix: ${tool}`);
      union.add(tool.slice(prefix.length));
    }
    declarations.push({ command, path, tools });
  }
  assertExactToolRegistry([...union], `${label} command allowed-tools union`);
  for (const { command, path, tools } of declarations) {
    const expected = expectedByCommand[command].map((suffix) => `${prefix}${suffix}`);
    assert.deepEqual(
      [...tools].sort(),
      [...expected].sort(),
      `${path} allowed-tools differ from the canonical ${command} tool set`,
    );
  }
}

function assertTitlePagination(text, label) {
  const normalized = text.replace(/\s+/g, " ");
  assert.match(
    normalized,
    /Follow every returned `nextCursor` unchanged as `cursor` in `list_documents` until `nextCursor` is `null`, collecting exact-title matches across all pages\./,
    `${label} must follow every document cursor through the final page`,
  );
  assert.match(
    normalized,
    /Do not conclude no exact match or one exact match before pagination completes\./,
    `${label} must defer absent or unique title conclusions until pagination completes`,
  );
  assert.match(
    normalized,
    /If pagination fails or cannot complete, stop before any create or update and ask for the exact Document public short ID\./,
    `${label} must stop writes and request a public short ID when pagination cannot complete`,
  );
  assert.match(
    normalized,
    /For multiple exact-title matches across any pages, ask the user to choose a public short ID before any write\./,
    `${label} must require a public short ID choice for duplicate titles across pages`,
  );
}

assertPackageFiles(hostedRoot, hostedPackageFiles, "Hosted plugin");
assertPackageFiles(codeRoot, codePackageFiles, "Claude Code plugin");

const portableManifest = readJson(join(hostedRoot, "plugin.json"));
assert.equal(portableManifest.$schema, "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json");
assert.equal(portableManifest.name, "unpitch-hosted");
assert.equal(portableManifest.version, "0.2.0");
assert.equal(
  portableManifest.extensions?.["com.openai"]?.onboardingSkill,
  "./skills/setup-unpitch/SKILL.md",
);

const portableMcp = readJson(join(hostedRoot, "mcp.json"));
assert.equal(portableMcp.$schema, "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json");
assert.deepEqual(portableMcp.mcpServers?.unpitch, {
  type: "streamable-http",
  url: endpoint,
});

const hostedClaudeManifest = readJson(join(hostedRoot, ".claude-plugin", "plugin.json"));
assert.equal(hostedClaudeManifest.name, "unpitch-hosted");
assert.equal(hostedClaudeManifest.displayName, "Unpitch");
assert.equal(hostedClaudeManifest.version, portableManifest.version);

const hostedClaudeMcp = readJson(join(hostedRoot, ".mcp.json"));
assert.deepEqual(hostedClaudeMcp.mcpServers?.unpitch, {
  type: "http",
  url: endpoint,
});

const codeManifest = readJson(join(codeRoot, ".claude-plugin", "plugin.json"));
assert.equal(codeManifest.name, "unpitch");
assert.equal(codeManifest.displayName, "Unpitch for Claude Code");
assert.equal(codeManifest.version, portableManifest.version);
assert.equal(
  existsSync(join(codeRoot, ".mcp.json")),
  false,
  "Claude Code compatibility package must preserve the manual unpitch MCP connection",
);

for (const file of filesBelow(hostedRoot)) {
  const text = readFileSync(join(hostedRoot, file), "utf8");
  assert.equal(text.includes(codeClientId), false, `Hosted plugin leaks the Claude Code client ID: ${file}`);
  assert.equal(text.includes("callbackPort"), false, `Hosted plugin pins an OAuth callback: ${file}`);
}

const claudeMarketplace = readJson(join(packageRoot, ".claude-plugin", "marketplace.json"));
assert.equal(claudeMarketplace.name, "unpitch");
assert.deepEqual(
  claudeMarketplace.plugins.map(({ name, source }) => ({ name, source })),
  [
    { name: "unpitch", source: "./plugins/unpitch-claude-code" },
    { name: "unpitch-hosted", source: "./plugins/unpitch" },
  ],
);

const openAiMarketplace = readJson(join(packageRoot, ".agents", "plugins", "marketplace.json"));
assert.equal(openAiMarketplace.name, "unpitch");
assert.deepEqual(openAiMarketplace.plugins.map((plugin) => plugin.name), ["unpitch-hosted"]);
assert.equal(openAiMarketplace.plugins[0].source.path, "./plugins/unpitch");
assert.equal(openAiMarketplace.plugins[0].policy.authentication, "ON_INSTALL");

assertMirrored("skills");

const skillDirectories = readdirSync(join(hostedRoot, "skills"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
assert.deepEqual(
  skillDirectories,
  expectedSkills,
  "Hosted skill inventory differs from the canonical six-skill package",
);

for (const skillName of expectedSkills) {
  const skill = readFileSync(join(hostedRoot, "skills", skillName, "SKILL.md"), "utf8");
  assert.match(
    skill,
    new RegExp(`^---\\nname: ${skillName}\\ndescription: .+\\n---\\n`),
    `${skillName} has invalid skill frontmatter`,
  );
  const openAi = readFileSync(join(hostedRoot, "skills", skillName, "agents", "openai.yaml"), "utf8");
  assert.match(openAi, new RegExp(`default_prompt: .*\\$${skillName}`), `${skillName} lacks its default prompt`);
  assert.match(openAi, /value: "unpitch"/, `${skillName} lacks the Unpitch MCP dependency`);
  assert.match(openAi, /transport: "streamable_http"/, `${skillName} has the wrong MCP transport`);
  assert.match(
    openAi,
    new RegExp(`url: "${endpoint.replaceAll(".", "\\.")}"`),
    `${skillName} has the wrong MCP endpoint`,
  );
}

const checkSkill = readFileSync(join(hostedRoot, "skills", "check-outreach", "SKILL.md"), "utf8");
assertTitlePagination(checkSkill, "check-outreach");
assert.match(checkSkill, /explicit yes tied to that displayed quote/);
assert.match(checkSkill, /returned run short\s+ID/);
assert.match(checkSkill, /Never display internal principle IDs/);
const setupSkill = readFileSync(join(hostedRoot, "skills", "setup-unpitch", "SKILL.md"), "utf8");
assert.match(setupSkill, /Settings > Integrations/);
assert.match(setupSkill, /install from the marketplace and prepare or reuse the\s+existing `unpitch` server/);
assert.match(setupSkill, /Do not offer a ZIP or raw command as\s+an alternative setup path/);
assert.doesNotMatch(setupSkill, /claude mcp add|--client-id/);
const simulationSkill = readFileSync(join(hostedRoot, "skills", "simulate-outreach", "SKILL.md"), "utf8");
assert.match(simulationSkill, /One confirmation authorizes one Simulation/);
assert.match(simulationSkill, /returned run short\s+ID/);
assert.match(simulationSkill, /Never display internal UUIDs, principle/);
const generalSkillPath = join(hostedRoot, "skills", "use-unpitch", "SKILL.md");
const generalSkill = readFileSync(generalSkillPath, "utf8");
assertExactToolRegistry(readToolTable(generalSkillPath), "use-unpitch tool registry");
assertTitlePagination(generalSkill, "use-unpitch");
const normalizedGeneralSkill = generalSkill.replace(/\s+/g, " ");
assert.match(
  normalizedGeneralSkill,
  /Optional fields, including `recipientContext`, may be sent only when supported by the live advertised input schema; preserve supported values from returned typed content\./,
  "use-unpitch must condition optional content fields on live schemas",
);
assert.match(
  normalizedGeneralSkill,
  /If the user supplies context that the live schema does not support, explicitly tell them it cannot be saved in this Document\./,
  "use-unpitch must report unsupported context",
);
assert.match(
  normalizedGeneralSkill,
  /Never silently drop that context, claim it was saved, or fold it into the exact `body` without explicit permission\./,
  "use-unpitch must prevent silent context loss or unapproved body edits",
);
assert.match(
  normalizedGeneralSkill,
  /wait for their choice before writing\./,
  "use-unpitch must wait for a choice before saving without unsupported context",
);
assert.match(generalSkill, /only when the user clearly asked to save, create, move,/);
assert.match(generalSkill, /exact public short ID, revision, content hash, and update timestamp/);
assert.match(generalSkill, /Never overwrite through a conflict or create a\s+duplicate/);
assert.match(generalSkill, /one confirmation for one run/);
assert.match(generalSkill, /Never expose internal UUIDs, principle IDs, principle\s+numbers/);

assertExactToolRegistry(
  readToolTable(join(packageRoot, "docs", "tools.md")),
  "docs/tools.md registry",
);

const expectedCommandTools = {
  "check.md": [
    "get_workspace_context",
    "list_documents",
    "get_document",
    "create_document",
    "update_document",
    "run_quality_check",
    "get_run",
  ],
  "context.md": [
    "get_workspace_context",
    "list_documents",
    "get_document",
    "search_knowledge",
    "list_personas",
    "get_run",
  ],
  "readers.md": ["list_personas"],
  "simulate.md": [
    "get_workspace_context",
    "list_documents",
    "get_document",
    "list_personas",
    "quote_simulation",
    "run_simulation",
    "get_run",
  ],
};
assertCommandTools(join(packageRoot, "commands"), "manual", "mcp__unpitch__", expectedCommandTools);
assertCommandTools(
  join(hostedRoot, "commands"),
  "hosted plugin",
  "mcp__plugin_unpitch-hosted_unpitch__",
  expectedCommandTools,
);
assertCommandTools(join(codeRoot, "commands"), "manual", "mcp__unpitch__", expectedCommandTools);

const normalizeCommand = (text) => text.replace(/^allowed-tools: .*$/m, "allowed-tools: <variant>");
for (const command of commandNames) {
  const legacy = readFileSync(join(packageRoot, "commands", command), "utf8");
  const hosted = readFileSync(join(hostedRoot, "commands", command), "utf8");
  const code = readFileSync(join(codeRoot, "commands", command), "utf8");
  if (command === "check.md") {
    assertTitlePagination(legacy, "commands/check.md");
    assertTitlePagination(hosted, "hosted commands/check.md");
    assertTitlePagination(code, "Claude Code commands/check.md");
  }
  assert.equal(
    normalizeCommand(hosted),
    normalizeCommand(legacy),
    `Hosted commands/${command} differs from the legacy workflow`,
  );
  assert.equal(
    normalizeCommand(code),
    normalizeCommand(legacy),
    `Claude Code commands/${command} differs from the legacy workflow`,
  );
}

const maintainerRelease = readFileSync(join(packageRoot, "docs", "maintainer-release.md"), "utf8");
assert.match(
  maintainerRelease,
  /Do not\npublish, sync, or announce it as a working hosted connection until/,
);
assert.match(maintainerRelease, /registration_endpoint/);
assert.match(maintainerRelease, /must not add a `\.mcp\.json`/);

const readme = readFileSync(join(packageRoot, "README.md"), "utf8");
assert.match(readme, /Installing a plugin and connecting an Unpitch account are separate steps/);
assert.match(
  readme,
  /Connection verification pending/,
  "README must retain the pending connection verification warning",
);
assert.doesNotMatch(
  readme,
  /live server does not\s+(?:>\s*)?support it yet/i,
  "README must not claim the live server lacks Dynamic Client Registration",
);
assert.match(readme, /Customize > Plugins/);
assert.match(readme, /Add from a repository/);
assert.match(readme, /select \*\*Sync\*\*/);
assert.match(readme, /Plugins/);
assert.match(readme, /Add a marketplace/);
assert.match(readme, /https:\/\/github\.com\/unpitch\/unpitch-mcp/);
assert.match(readme, /Open \*\*Settings > Integrations\*\* in Unpitch/);
assert.match(readme, /setup instructions and paste them into Claude Code/);
assert.match(readme, /installs Unpitch from this\n\s+marketplace and prepares or reuses your existing connection/);
assert.match(readme, /Existing users keep the `unpitch@unpitch` plugin, the same connection/);
assert.match(readme, /do\nnot need to enter an API key or client secret/);
const customerReadme = readme.split("## Package layout and validation")[0];
assert.doesNotMatch(
  customerReadme,
  /claude mcp add|claude plugin install|--client-id|download (?:a )?zip/i,
  "Customer README must keep marketplace setup as the one installation path",
);

console.log(
  `Package validation passed (${hostedPackageFiles.length + codePackageFiles.length} plugin files).`,
);
