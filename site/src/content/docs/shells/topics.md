---
title: Topics & commands
description: Every topic you can subscribe to and every command you can invoke.
---

Subscribe with `shell.subscribe(topic, fn)`, run commands with
`shell.invoke(name, args)` (or `winshellctl cmd name '{…}'`). A service
runs only while subscribed, and starts briefly for a command. The full
types are in `@winshell/sdk`; try anything live with
`winshellctl sub <topic>`.

## Windows and the desktop

| Topic | State |
|---|---|
| `windows` | `{ windows: [{ hwnd, title, exe, path, pid, monitor, rect, minimized, maximized, … }], focused }` |
| `monitors` | `{ monitors: [{ id, name, index, primary, rect, work, dpi, scale }] }` |
| `screens` | Per monitor: `fullscreen`, `maximized` (and their `hwnd`) |
| `hotkeys` | `{ hotkeys }`; presses as `pressed` events (`shell.onEvent`) |
| `config` | `{ generation, path, value, error? }` |

| Command | Args |
|---|---|
| `windows.focus`, `toggle`, `minimize`, `maximize`, `restore`, `toggleMaximize`, `toggleFullscreen`, `close`, `kill` | `{ hwnd }` |
| `windows.icon` | `{ hwnd, size?: "big" \| "small" }` → `{ mime, data }` |
| `config.reload`, `config.get` | — |
| `hotkeys.register` / `unregister` / `list` | `{ id, keys }` / `{ id }` / — |
| `surfaces.add` / `remove` / `list` | `{ surface, detached? }` / `{ id }` / — |

## System

| Topic | State | Commands |
|---|---|---|
| `audio` | `{ output?, input?: { id, name, volume, muted }, devices }` | `setVolume { value, flow? }`, `adjustVolume { delta }`, `setMute { muted }`, `toggleMute`, `setDefault { id }` |
| `media` | `{ current?, sessions: [{ id, title, artist, album, status, position_ms, duration_ms, art_id?, shuffle, repeat, … }] }` | `play`, `pause`, `toggle`, `stop`, `next`, `previous` `{ session? }`; `seek { position_ms }`; `shuffle`; `repeat`; `art` → `{ mime, data }` |
| `spectrum` | `{ bands, idle }`: audio visualizer, ~60 updates/s while sound plays | — |
| `brightness` | `{ monitors: [{ id, name, supported, brightness? }] }` | `set { value: 0..100, monitor? }`, `adjust { delta }` |
| `display` | `{ dark: { apps, system }, transparency, accent?, night_light, wallpaper }` | `setDarkMode`, `setTransparency`, `setNightLight`, `setWallpaper { path, monitor? }`, `pixels`, `thumbnail` |
| `power` | `{ ac?, battery?: { percent, charging, seconds_left? }, saver, plan }` | — |
| `session` | `{ user, full_name?, locked, remote, capabilities }` | `lock`, `signOut`, `sleep`, `hibernate`, `restart`, `shutdown`, `avatar` |
| `input` | `{ layouts, current?, locks: { caps, num, scroll } }` | `setLayout { id }`, `nextLayout`, `setLock { key, on? }` |

## Network

| Topic | State | Commands |
|---|---|---|
| `network` | `{ connectivity, metered, primary?, interfaces, public? }` | `refreshPublicIp` |
| `wifi` | `{ radio, networks: [{ ssid, signal, secure, connected, band?, … }], saved, scanning }` | `scan`, `connect { ssid, password? }`, `disconnect`, `forget { ssid }`, `setRadio { enabled }` |
| `bluetooth` | `{ radio, devices: [{ id, name, kind, le, connected, battery? }] }` | `connect { id }`, `disconnect`, `forget`, `setRadio` |

## Apps and notifications

| Topic | State | Commands |
|---|---|---|
| `apps` | `{ apps: [{ id, name, kind, aumid?, path? }], updated_at }` (the Start menu) | `launch { id }`, `run { target, args?, place? }`, `open { target }`, `icon { id, size? }`, `jumplist { path }`, `reveal { path }`, `refresh` |
| `tray` | `{ icons: [{ id, tooltip, … }] }` | `icon { id }`, `click { id, button?, anchor? }` |
| `notifications` | `{ dnd, notifications: [...] }` | `post { title, body?, actions? }`, `dismiss { id }`, `invoke { id, action? }`, `clear`, `setDnd { enabled }` |
| `clipboard` | `{ enabled, history }` (off unless enabled in config) | `copy { text }`, `remove { id }`, `clear` |
| `storage` | `{ values }` | `get`, `set`, `delete { key }`, `list { prefix? }` (use `shell.storage`) |

## Hardware stats

Sampled every `services.stats.interval_ms` (2 s).

| Topic | State |
|---|---|
| `stats` | `{ info, cpu: { usage, cores_usage, mhz }, memory, commit, disk, drives, uptime_ms }` |
| `gpu` | `{ adapters: [{ name, usage, memory, … }] }` |
| `io` | `{ net: { rx_bps, tx_bps }, disks }` |

Every topic also answers `<topic>.get` with its current state.
