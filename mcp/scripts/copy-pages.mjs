// Copies the site's pages into mcp/pages, so the published server carries
// the docs it serves (one source: site/src/content/docs).
import { cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const from = join(here, "..", "..", "site", "src", "content", "docs");
const to = join(here, "..", "pages");
rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true, filter: (p) => !/\.(png|jpe?g|svg|webp)$/i.test(p) });
