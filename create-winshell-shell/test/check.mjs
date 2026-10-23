// Scaffolds a shell into a temp folder and builds it, against the SDK in a
// winshell checkout (WINSHELL_SDK, default ../../winshell/sdk) so it works
// before @winshell/sdk is published.
import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sdk = resolve(process.env.WINSHELL_SDK ?? join(here, "..", "..", "..", "winshell", "sdk"));
if (!existsSync(join(sdk, "dist", "index.js"))) throw new Error(`Build the SDK first (npm run build in ${sdk})`);

const dir = mkdtempSync(join(tmpdir(), "winshell-shell-"));
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: "inherit" });
try {
  run(`node "${join(here, "..", "index.mjs")}" test-shell`, dir);
  const app = join(dir, "test-shell");
  const pkg = JSON.parse(readFileSync(join(app, "package.json"), "utf8"));
  pkg.dependencies["@winshell/sdk"] = `file:${sdk.replaceAll("\\", "/")}`;
  writeFileSync(join(app, "package.json"), JSON.stringify(pkg, null, 2));
  run("npm install --no-audit --no-fund --loglevel=error", app);
  run("npm run build", app);
  for (const f of ["bar.html", "calendar.html"]) if (!existsSync(join(app, "dist", f))) throw new Error(`dist/${f} missing`);
  const html = readFileSync(join(app, "dist", "bar.html"), "utf8");
  if (html.includes('src="/')) throw new Error("dist/bar.html has absolute asset URLs; app://shell/<name>/ needs relative ones");
  console.log("\ncreate-winshell-shell: ok");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
