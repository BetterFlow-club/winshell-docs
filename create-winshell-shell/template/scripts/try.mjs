// npm run try / untry: add or remove the surfaces in surfaces.json at runtime,
// without touching your config. They stay until winshell restarts.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const add = process.argv[2] !== "remove";
const surfaces = JSON.parse(readFileSync("surfaces.json", "utf8"));
let failed = false;

for (const surface of surfaces) {
  const args = add
    ? ["cmd", "surfaces.add", JSON.stringify({ surface, detached: true })]
    : ["cmd", "surfaces.remove", JSON.stringify({ id: surface.id })];
  const r = spawnSync("winshellctl", args, { encoding: "utf8" });
  if (r.error) {
    console.error("winshellctl not found: install winshell, then open a new terminal.");
    process.exit(1);
  }
  const ok = r.status === 0;
  failed ||= !ok;
  console.log(`${ok ? "✓" : "✗"} ${add ? "add" : "remove"} ${surface.id}${ok ? "" : `: ${(r.stdout || r.stderr).trim()}`}`);
}
if (add && !failed) console.log("Run npm run untry to remove them, or paste surfaces.json into your config to keep them.");
process.exit(failed ? 1 : 0);
