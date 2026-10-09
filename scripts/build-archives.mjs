import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(packageRoot, "dist");
const validation = spawnSync(process.execPath, [join(packageRoot, "scripts", "validate-package.mjs")], {
  cwd: packageRoot,
  encoding: "utf8",
});

if (validation.status !== 0) {
  process.stderr.write(validation.stdout);
  process.stderr.write(validation.stderr);
  process.exit(validation.status ?? 1);
}

process.stdout.write(validation.stdout);
mkdirSync(distRoot, { recursive: true });

const packages = [
  {
    name: "unpitch-hosted",
    root: join(packageRoot, "plugins", "unpitch"),
    manifest: join(packageRoot, "plugins", "unpitch", "plugin.json"),
  },
  {
    name: "unpitch",
    root: join(packageRoot, "plugins", "unpitch-claude-code"),
    manifest: join(packageRoot, "plugins", "unpitch-claude-code", ".claude-plugin", "plugin.json"),
  },
];

const checksums = [];
for (const plugin of packages) {
  const version = JSON.parse(readFileSync(plugin.manifest, "utf8")).version;
  const archive = join(distRoot, `${plugin.name}-${version}.zip`);
  if (existsSync(archive)) rmSync(archive);

  const zip = spawnSync("zip", ["-q", "-X", "-r", archive, ".", "-x", "*.DS_Store"], {
    cwd: plugin.root,
    encoding: "utf8",
  });
  if (zip.status !== 0) {
    process.stderr.write(zip.stdout);
    process.stderr.write(zip.stderr);
    process.exit(zip.status ?? 1);
  }

  const integrity = spawnSync("unzip", ["-tqq", archive], { encoding: "utf8" });
  if (integrity.status !== 0) {
    process.stderr.write(integrity.stdout);
    process.stderr.write(integrity.stderr);
    process.exit(integrity.status ?? 1);
  }

  const digest = createHash("sha256").update(readFileSync(archive)).digest("hex");
  checksums.push(`${digest}  ${archive.slice(distRoot.length + 1)}`);
  console.log(`Built ${archive.slice(packageRoot.length + 1)}`);
}

writeFileSync(join(distRoot, "SHA256SUMS"), `${checksums.join("\n")}\n`);
console.log("Wrote dist/SHA256SUMS");
