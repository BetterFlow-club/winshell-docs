// Copies dist/ to winshell's shells folder, where app://shell/__NAME__/ loads from.
// WINSHELL_SHELLS overrides the folder (e.g. a dev build's zig-out\shells).
import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const shells = process.env.WINSHELL_SHELLS ?? join(process.env.LOCALAPPDATA ?? "", "Programs", "winshell", "shells");
if (!existsSync(shells)) {
  console.error(`No winshell shells folder at ${shells}. Is winshell installed? (Set WINSHELL_SHELLS for a dev build.)`);
  process.exit(1);
}
const target = join(shells, "__NAME__");
rmSync(target, { recursive: true, force: true });
cpSync("dist", target, { recursive: true });
console.log(`Deployed to ${target}. Open surfaces reload on their next start; npm run try shows them now.`);
