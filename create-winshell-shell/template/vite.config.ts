import { defineConfig, type Plugin } from "vite";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, sep } from "node:path";

const name = "__NAME__";

// Every page is its own surface, so each HTML file is an entry.
const pages = { bar: "bar.html", calendar: "calendar.html" };

export default defineConfig(({ command }) => ({
  // In dev, winshell asks for /<name>/bar.html (host.dev_url + the app://shell/ path).
  // Built pages are served from app://shell/<name>/, so assets are relative.
  base: command === "serve" ? `/${name}/` : "./",
  plugins: [installedShells()],
  server: { port: 5180, strictPort: true },
  build: { target: "chrome120", rollupOptions: { input: pages } },
}));

/**
 * With host.dev_url pointing here, winshell loads *every* app://shell/ page
 * from this server, Aurora's too. Paths that aren't this shell's are served
 * from the installed shells folder, so the rest of your desktop keeps working.
 */
function installedShells(): Plugin {
  const root = join(process.env.LOCALAPPDATA ?? "", "Programs", "winshell", "shells");
  const types: Record<string, string> = {
    ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
    ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".woff": "font/woff",
  };
  return {
    name: "winshell-installed-shells",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = decodeURIComponent((req.url ?? "/").split("?")[0]);
        if (path.startsWith(`/${name}/`) || path.startsWith("/@") || path.startsWith("/node_modules/")) return next();
        const file = normalize(join(root, path));
        if (!file.startsWith(root + sep) || !existsSync(file) || !statSync(file).isFile()) return next();
        res.setHeader("Content-Type", types[extname(file)] ?? "application/octet-stream");
        createReadStream(file).pipe(res);
      });
    },
  };
}
