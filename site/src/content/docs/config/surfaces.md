---
title: Surfaces
description: Declare bars, popups and widgets, and place them.
---

A surface is a web page winshell shows on screen. Declare it in `surfaces`:

```jsonc
"surfaces": [
  // A 36 px bar on top of every monitor, reserving its space.
  { "id": "my-bar", "layer": "bar", "edge": "top", "size": { "height": 36 }, "monitor": "all",
    "url": "app://shell/myshell/bar.html" },

  // A popup the bar opens (shell.surface.toggle("my-calendar")).
  { "id": "my-calendar", "popup": true, "size": { "width": 320, "height": 360 },
    "url": "app://shell/myshell/calendar.html" },

  // A clock on the desktop, bottom right, behind windows.
  { "id": "clock", "layer": "background", "anchor": ["bottom", "right"],
    "margin": { "bottom": 24, "right": 24 }, "size": { "width": 260, "height": 120 },
    "url": "app://user/clock.html" },
]
```

## URLs

| URL | Loads from |
|---|---|
| `app://shell/<name>/…` | `%LOCALAPPDATA%\Programs\winshell\shells\<name>\` |
| `app://user/…` | `%APPDATA%\winshell\surfaces\` |
| `http://localhost:…` | Only in dev mode (`host.dev_url` set) |

## Layers

| `layer` | Is | For |
|---|---|---|
| `bar` | Docked to an edge; reserves space so maximized windows stay clear | Bars, docks |
| `overlay` (default) | Always on top | OSDs, overlays |
| `bottom` | Behind all windows | Widgets |
| `background` | Part of the desktop, in front of the icons; `"below_icons": true` puts it behind them (no clicks) | Desktop widgets, live wallpapers |

Popups (`"popup": true`) ignore the layer: they open next to the element
that opened them and close on Escape or a click outside.

## Keys

| Key | Default | |
|---|---|---|
| `id`, `url` | required | |
| `layer` | `"overlay"` | see above |
| `edge` | `"top"` for bars | `top`, `bottom`, `left`, `right` |
| `anchor` | centered | Edges to pin to: `["top", "right"]`; two opposite edges without a size stretch |
| `position` | — | `{ x, y }` from the work area's top left |
| `size` | 400 × 300 (bars: height 40) | `{ width, height }` |
| `margin` | 0 | `{ top, right, bottom, left }`, px or `"10%"` |
| `monitor` | `"primary"` | `"all"`, an index `0`, an id `"\\\\.\\DISPLAY1"` or a name (`winshellctl monitors`) |
| `exclusive_zone` | `true` | Bars: reserve their space |
| `focusable` | `false` | Can take keyboard focus (popups always can) |
| `hide_on_fullscreen` | `true` | Go behind fullscreen apps; `false` for an FPS overlay |
| `scale` | `1` | Extra UI scale for this surface |
| `popup` | `false` | Open on demand; one instance. With `anchor` it's pinned to those screen edges instead of its opener: `"anchor": ["top", "right", "bottom"], "size": { "width": 420 }` is a full-height side sheet |
| `preload` | `false` | Popups: load hidden at start, so the first open is instant |
| `passive` | `false` | Popups: never take focus or close on outside clicks (hover previews, tooltips) |

All sizes are logical pixels: they follow Windows' display scaling and
`host.scale`. The page doesn't need to care.
