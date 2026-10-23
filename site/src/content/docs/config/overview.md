---
title: The config file
description: Where the config is, how it reloads, and what's in it.
---

One file: `%APPDATA%\winshell\config.jsonc`. JSON with comments and
trailing commas.

```bash
notepad (winshellctl config-path)
```

- **Saved changes apply at once.** No restart.
- **An invalid file is ignored:** the last good config stays, and the error
  (with line and column) goes to the log.
- **Unknown keys are kept** and passed to pages, so a shell can keep its own
  settings here.

## Shape

```jsonc
{
  "daemon":   { "autostart": true, "log_level": "info" },
  "taskbar":  { "hide_native": true, "disable_shell_hotkeys": "SAQNWTBK" },
  "snap":     { "layouts_on_drag": false },
  "hotkeys":  [ { "id": "launcher", "keys": "Win+Space", "action": { "event": "aurora.launcher" } } ],
  "host":     { "scale": { "Dell AW3821DW": 1.2 } },
  "surfaces": [ { "id": "aurora-bar", "layer": "bar", "edge": "top", "size": { "height": 32 },
                  "monitor": "all", "url": "app://shell/aurora/bar.html" } ],
  "aurora":   { "colors": "wallpaper", "bar": { "margin": "22%" } }
}
```

| Section | For | Page |
|---|---|---|
| `hotkeys` | Global keys: open panels, run apps, manage windows | [Hotkeys](../hotkeys/) |
| `surfaces` | Bars, popups, widgets and where they go | [Surfaces](../surfaces/) |
| `daemon`, `services`, `taskbar`, `snap`, `host`, `aurora` | Everything else | [Reference](../reference/) |

Start over: delete the file (or rename it) and run `winshellctl restart`. A
fresh default is written.
