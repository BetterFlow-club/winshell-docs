---
title: Config reference
description: Every other config section, with defaults.
---

## daemon

| Key | Default | |
|---|---|---|
| `autostart` | `true` | Start at sign-in (installed copies only) |
| `log_level` | `"info"` | `error`, `warn`, `info`, `debug` |
| `heartbeat_ms` | `2000` | Heartbeat to clients |

## services

| Key | Default | |
|---|---|---|
| `stats.interval_ms` | `2000` | Sampling of `stats`, `gpu`, `io` (250–60000) |
| `clipboard.enabled` | `false` | Text clipboard history, in memory only |
| `clipboard.history_size` | `50` | 1–1000 |
| `network.public_ip.enabled` | `false` | Look up the public IP (contacts api.ipify.org) |

## taskbar

| Key | Default | |
|---|---|---|
| `hide_native` | `true` | Hide the Windows taskbar while winshell runs. It always comes back: on quit, on a crash (watchdog), or with `winshellctl restore-taskbar` |
| `disable_shell_hotkeys` | `"SAQNWTBK"` | Windows shortcuts to swallow while running, by letter: Win+**S**/**Q** search, **A** quick settings, **N** notifications, **W** widgets, **T**/**B** taskbar focus, **K** cast. Your own hotkeys on the same keys win |

## snap

| Key | Default | |
|---|---|---|
| `layouts_on_drag` | unchanged | `false` hides the snap bar when dragging a window to the top. Saved in Windows; changing it restarts Explorer once |

## host

| Key | Default | |
|---|---|---|
| `enabled` | `true` | Draw surfaces at all |
| `scale` | `1` | UI scale on top of Windows' scaling: a number, or per monitor `{ "Dell AW3821DW": 1.2, "primary": 1, "default": 1 }` |
| `dev_url` | — | Load `app://shell/` from a dev server, with F12 dev tools ([quickstart](../../shells/quickstart/#develop-with-hot-reload)) |

## aurora

Settings of the default shell.

```jsonc
"aurora": {
  "bar": { "margin": "22%", "fill_when_maximized": true },
  "colors": "wallpaper",
  "wallpaper": { "seed": "auto", "scheme": "tonal-spot", "dark": true },
  "palette": { "primary": "#76aed6" },
  "weather": { "city": "Berlin" },
  "notifications": { "position": "top-right", "durations": { "low": 3, "normal": 8, "critical": 15 } },
}
```

| Key | |
|---|---|
| `bar.margin` | Free space at the bar's ends: px or `"10%"` |
| `bar.fill_when_maximized` | Stretch to the screen edges while a window is maximized |
| `colors` | `"wallpaper"` (generated, follows changes), `"noctalia"`, `"reference"` |
| `wallpaper.seed` | How the accent is picked: `auto`, `matugen`, `vibrant`, `faithful` |
| `wallpaper.scheme` | `tonal-spot`, `content`, `fidelity`, `vibrant`, `expressive`, `rainbow`, `fruit-salad`, `neutral`, `monochrome` |
| `wallpaper.color` | Candidate `0`–`3`, or a fixed seed `"#e84393"` |
| `wallpaper.dark` / `contrast` | `true`, `false`, `"auto"` / -1 … 1 |
| `palette` | Override single colors: `primary`, `surface`, `onSurface`, `outline`, … |
| `weather` | `{ "city": "Berlin" }` or `{ "latitude", "longitude", "name" }` |
| `notifications.position` | Where popups appear: `top-right` (default), `top-left`, `bottom-right`, `bottom-left`, `top`, `bottom` |
| `notifications.durations` | Seconds a popup stays, per urgency: `low` 3, `normal` 8, `critical` 15. Hovering pauses it |
| `tooltips` | `true` shows the shell's own tooltips on hover; off by default (the browser's native ones never show) |
| `notifications.enabled` | `false` turns the popups off (notifications still collect in the control center) |
