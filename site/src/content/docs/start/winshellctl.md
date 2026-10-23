---
title: winshellctl
description: The command line client. Start, stop, inspect and script winshell.
---

```bash
winshellctl restart          # after a hang, or to load a new build
winshellctl hotkeys          # what every key does
notepad (winshellctl config-path)
```

## Commands

| Command | Does |
|---|---|
| `start` / `stop` / `restart` | Start winshell, stop it (waits; terminates after 10 s and restores the taskbar), or both |
| `status` | Version, uptime, running services, host state |
| `config` | The active config, indented |
| `config-path` | Where the config file is |
| `reload` | Re-read the config now (it also reloads on save) |
| `hotkeys [--json]` | Table of hotkeys and the Windows shortcuts turned off |
| `windows` / `monitors` | Tracked windows / monitors (ids and names for the config) |
| `sub [TOPIC…]` | Print live events as JSON lines until Ctrl+C |
| `cmd NAME [JSON]` | Run any [command](../../shells/topics/) |
| `quit` | Ask winshell to quit, without waiting |
| `restore-taskbar` | Show the Windows taskbar again (no daemon needed) |

Running `winshellctl` alone lists them.

## Scripting

Output is JSON (except `hotkeys`, `config-path` and the start/stop
messages), one object per line:

```bash
winshellctl cmd audio.setVolume '{"value":0.3}'
winshellctl cmd apps.run '{"target":"default:browser"}'
winshellctl cmd notifications.post '{"title":"Build done","body":"0 errors"}'
winshellctl sub media | jq -c '.data.sessions[0].title'
```

In PowerShell 7 pass JSON in single quotes as above. Exit codes: `0` ok,
`1` the command failed, `2` usage, `3` winshell isn't running.
