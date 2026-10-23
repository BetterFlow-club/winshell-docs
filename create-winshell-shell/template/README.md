# __NAME__

A [winshell](https://betterflow-club.github.io/winshell-docs/) shell: a top bar
(focused window, clock, volume) and a calendar popup.

| Command | |
|---|---|
| `npm run deploy` | Build and copy into winshell's shells folder (`app://shell/__NAME__/`) |
| `npm run try` / `untry` | Show / remove the surfaces now, without editing your config |
| `npm run dev` | Dev server with hot reload (below) |

**Keep it:** paste the entries of `surfaces.json` into `"surfaces"` in your
config (`notepad (winshellctl config-path)`). Remove Aurora's
`aurora-bar` there if this bar replaces it.

## Hot reload

1. `npm run dev` (port 5180).
2. In the config: `"host": { "dev_url": "http://localhost:5180" }`.
3. `winshellctl restart`.

Your pages now load from the dev server and update as you save; F12 opens
dev tools. Other shells (Aurora) keep loading their installed files. Remove
`dev_url` when you're done.

## Layout

| File | |
|---|---|
| `bar.html`, `src/bar.ts` | The bar. Each surface is its own page |
| `calendar.html`, `src/calendar.ts` | The popup the clock opens |
| `src/style.css` | Shared styles. Surfaces are transparent: draw only what shows |
| `surfaces.json` | The surface declarations |
| `vite.config.ts` | Pages to build; dev server |

Add a page: create `x.html` + `src/x.ts`, add it to `pages` in
`vite.config.ts` and a declaration to `surfaces.json`.

Docs: SDK, topics and recipes in the winshell documentation.
