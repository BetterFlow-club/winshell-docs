---
title: Hotkeys
description: Bind keys to panels, apps, commands and window actions.
---

```jsonc
"hotkeys": [
  { "id": "launcher",  "keys": "Win+Space", "action": { "event": "aurora.launcher" } },
  { "id": "terminal",  "keys": "Win+Enter", "action": { "run": "WezTerm", "place": "center" } },
  { "id": "browser",   "keys": "Win+W",     "action": { "run": "default:browser" } },
  { "id": "code",      "keys": "Ctrl+Alt+E", "action": { "run": "code.exe", "args": "--new-window" } },
  { "id": "vol-up",    "keys": "VolumeUp",  "action": { "cmd": "audio.adjustVolume", "args": { "delta": 0.02 } } },
  { "id": "close",     "keys": "Win+Q",     "action": { "cmd": "windows.close" } },
]
```

Check the result with `winshellctl hotkeys`.

## Actions

| Action | Does |
|---|---|
| `{ "run": target, "args"?, "place"? }` | Start an app or open something (below) |
| `{ "cmd": name, "args"? }` | Run any [command](../../shells/topics/) |
| `{ "event": name }` | Nothing itself; pages react to it (Aurora's panels) |
| `{ "popup": id }` | Toggle a popup surface |

**`run` targets:**

| Target | Starts |
|---|---|
| `"Spotify"`, `"WezTerm"` | An app by its Start menu name |
| `"code.exe"`, `"notepad"` | An exe or a command on the `PATH` |
| `"%APPDATA%"`, `"https://…"` | A folder, file or URL |
| `"default:browser"` / `"default:editor"` / `"default:terminal"` | The user's default browser, what opens `.txt` files, Windows Terminal (else `cmd`) |

**`place`:** `"center"` opens the app's window in the middle of the
monitor the mouse is on, `"cursor"` centered on the mouse. Without it the app
decides.

**Window commands** act on the active window: `windows.close`,
`windows.kill`, `windows.toggleMaximize`, `windows.toggleFullscreen`,
`windows.minimize`.

**Aurora events:** `aurora.launcher`, `aurora.control-center`,
`aurora.control-center.<tab>` (`audio`, `network`, `bluetooth`,
`notifications`, …), `aurora.session` (power menu), `aurora.peek`.

## Keys

`Ctrl`, `Alt`, `Shift`, `Win` plus one key: a letter or digit, `F1`–`F24`,
`Space`, `Enter`, `Tab`, `Esc`, `Backspace`, `Delete`, arrows, `Home`,
`End`, `PageUp`, `PageDown`, `PrintScreen`, punctuation (`,` `.` `-` …),
`Numpad0`–`9`, media keys (`VolumeUp`, `MediaPlayPause`, …). Case doesn't
matter.

- `"Win"` alone works (fires on release, Start stays closed).
- Windows' own Win combos (`Win+C`, `Win+A`, …) can be taken over.
- `Win+L` can't.
- A combination another app registered first can't be used; `winshellctl
  hotkeys` shows it as not active.
