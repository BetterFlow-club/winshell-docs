---
title: Quickstart
description: Make your own shell in five minutes.
---

A shell is a folder of web pages. Each page is a **surface**: a bar, a
popup, a widget.

```bash
npm create winshell-shell my-shell
cd my-shell
npm install
npm run deploy     # build, copy to winshell's shells folder
npm run try        # show it now
```

A second bar appears at the top of every monitor: the focused window's
title, a clock that opens a calendar popup, and the volume (click to mute,
scroll to change). `npm run untry` removes it.

## Keep it

`try` lasts until winshell restarts. To keep the shell, add its
declarations (in `surfaces.json`) to your config:

```jsonc
"surfaces": [
  { "id": "my-shell-bar", "layer": "bar", "edge": "top", "size": { "height": 36 }, "monitor": "all",
    "url": "app://shell/my-shell/bar.html" },
  { "id": "my-shell-calendar", "popup": true, "size": { "width": 296, "height": 312 },
    "url": "app://shell/my-shell/calendar.html" },
]
```

Remove `aurora-bar` if yours replaces it.

## Develop with hot reload

1. `npm run dev` (serves on port 5180)
2. Config: `"host": { "dev_url": "http://localhost:5180" }`
3. `winshellctl restart`

Your pages now load from the dev server and update on save. **F12** opens
dev tools in any surface. Aurora keeps working (the dev server hands it its
installed files). Remove `dev_url` when done.

## What's in the project

```
bar.html + src/bar.ts            the bar
calendar.html + src/calendar.ts  the popup
src/style.css                    transparent background, rounded panels
surfaces.json                    declarations for try / your config
vite.config.ts                   one entry per page
```

The bar in full:

```ts
import { shell } from "@winshell/sdk";

shell.subscribe("windows", ({ windows, focused }) => {
  title.textContent = windows.find((w) => w.hwnd === focused)?.title ?? "";
});

shell.subscribe("audio", ({ output }) => {
  volume.textContent = output ? `${Math.round(output.volume * 100)}%` : "–";
});
volume.onclick = () => shell.invoke("audio.toggleMute");

clock.onclick = () => shell.surface.toggle("my-shell-calendar", { anchor: clock });
```

That's the whole model: **subscribe** to state, **invoke** commands,
**open** popups. Next: [surfaces](../surfaces/), the [SDK](../sdk/), and
[recipes](../recipes/).

:::tip[Any framework]
Pages are plain web pages. React, Svelte, Vue or none: anything that
builds to static files. Aurora, the default shell, is React.
:::
