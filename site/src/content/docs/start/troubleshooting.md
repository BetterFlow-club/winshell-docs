---
title: Troubleshooting
description: What to do when something looks wrong.
---

| Problem | Fix |
|---|---|
| Something hangs or looks stuck | `winshellctl restart` |
| Maximized windows sit behind the bar (seen right after a first install) | `winshellctl restart`. winshell also moves them out on its own within a few seconds |
| Windows taskbar gone, winshell not running | `winshellctl restore-taskbar` |
| A config change does nothing | It was probably invalid: the last good config stays active. `winshellctl config` shows it; the log has the error with line and column |
| A hotkey doesn't work | `winshellctl hotkeys`: a binding another app owns is marked `[not active: …]` |
| Surfaces are too small or large | `"host": { "scale": { "<monitor name>": 1.2 } }` ([reference](../../config/reference/#host)) |
| An app started by a hotkey can't find a newly installed tool | Fixed automatically: winshell picks up `PATH` changes. Restart the app itself if it was already open |

## Where to look

```bash
winshellctl status
type "%LOCALAPPDATA%\winshell\logs\winshelld.log"
```

The log includes the host (surfaces) and every service start and stop.
Crash dumps land in the same folder.
