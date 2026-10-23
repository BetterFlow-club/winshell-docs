---
title: Install
description: Install, update and uninstall winshell.
---

1. Download **[winshell-setup.exe](../../winshell-setup.exe)** (version 0.2.12, 10 MB).
2. Run it. No admin rights needed.

:::note[“Windows protected your PC”]
The installer isn't code-signed yet, so SmartScreen may warn the first
time. Click **More info › Run anyway**. To check the download first:
`Get-FileHash winshell-setup.exe` should print
`DD4F4E88C1F5F5341B1ECB6B26AC2F4CDE0B8D34E0630FBA8AD62B7946F6ED19`.
:::

winshell starts right away and the Windows taskbar is replaced by **Aurora**,
the default shell. It also starts when you sign in.

| | |
|---|---|
| Installed to | `%LOCALAPPDATA%\Programs\winshell` (`bin\`, `shells\aurora\`) |
| Config | `%APPDATA%\winshell\config.jsonc`, written on first start |
| Logs | `%LOCALAPPDATA%\winshell\logs\winshelld.log` |
| On your `PATH` | `winshellctl` (open a **new** terminal) |

## Default keys

| Keys | Does |
|---|---|
| `Win+Space` | Launcher |
| `Win+X` | Control center |
| `Win+A` | Notifications |
| `Win+Alt+C` | Power menu |
| `Win` | Shows the bar over a fullscreen app for a moment |
| `Win+Enter` / `W` / `T` / `C` | Your default terminal, browser, editor; calculator |
| `Win+Q` / `Win+Esc` | Close the active window / end its process |
| `Win+D` / `Win+F` | Maximize / borderless fullscreen |

Change them in the [config](../../config/hotkeys/).

## Update

Run a newer `winshell-setup.exe`. It stops winshell, replaces `bin` and
`shells\aurora`, and starts it again. Your config, storage and own shells
stay.

## Uninstall

Settings › Apps › winshell, or:

```bash
"%LOCALAPPDATA%\Programs\winshell\uninstall.exe" --uninstall
```

The taskbar comes back. Your config and logs are kept.

Add `--quiet` to the setup or uninstaller for no dialogs.

## Taskbar didn't come back?

```bash
winshellctl restore-taskbar
```

Works without winshell running.
