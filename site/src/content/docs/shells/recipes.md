---
title: Recipes
description: Copy-paste snippets for common shell pieces.
---

All snippets assume `import { shell } from "@winshell/sdk";`.

## Task list (this monitor's windows)

```ts
shell.subscribe("windows", ({ windows, focused }) => {
  const here = shell.surface.info?.monitor.id;
  list.replaceChildren(...windows.filter((w) => w.monitor === here).map((w) => {
    const b = document.createElement("button");
    b.textContent = w.title;
    b.classList.toggle("active", w.hwnd === focused);
    b.onclick = () => shell.invoke("windows.toggle", { hwnd: w.hwnd });   // focus, or minimize if active
    return b;
  }));
});
```

Icons: `shell.invoke("windows.icon", { hwnd })` → `{ mime, data }` (base64).
Cache them per window.

## Now playing

```ts
import { shell, mediaPosition } from "@winshell/sdk";

let session;
shell.subscribe("media", (m) => {
  session = m.sessions.find((s) => s.id === m.current);
  title.textContent = session ? `${session.artist} – ${session.title}` : "";
});
setInterval(() => session && (bar.value = mediaPosition(session) / session.duration_ms), 1000);
play.onclick = () => shell.invoke("media.toggle");
```

Cover art: `shell.invoke("media.art", { session: id })` → `{ mime, data }`;
refetch only when `session.art_id` changes.

## Battery and CPU

```ts
shell.subscribe("power", ({ battery, ac }) => {
  batt.textContent = battery ? `${Math.round(battery.percent)}%${ac ? " ⚡" : ""}` : "";
});
shell.subscribe("stats", ({ cpu, memory }) => {
  cpuEl.textContent = `CPU ${Math.round(cpu.usage * 100)}%`;
});
```

## Wi-Fi list

```ts
shell.subscribe("wifi", ({ networks }) => {
  list.replaceChildren(...networks.map((n) => {
    const b = document.createElement("button");
    b.textContent = `${n.ssid} ${n.signal}%${n.connected ? " ✓" : ""}`;
    b.onclick = () => shell.invoke("wifi.connect", { ssid: n.ssid });   // saved networks need no password
    return b;
  }));
});
shell.invoke("wifi.scan");
```

## Pinned apps that persist

```ts
const KEY = "my-shell.pins";
shell.storage.watch<string[]>(KEY, (pins = []) => {
  dock.replaceChildren(...pins.map((name) => {
    const b = document.createElement("button");
    b.textContent = name;
    b.onclick = () => shell.invoke("apps.run", { target: name, place: "center" });
    return b;
  }));
});
const pin = async (name: string) =>
  shell.storage.set(KEY, [...((await shell.storage.get<string[]>(KEY)) ?? []), name]);
```

## App launcher search

```ts
shell.subscribe("apps", ({ apps }) => (all = apps));
input.oninput = () => {
  const q = input.value.toLowerCase();
  results(all.filter((a) => a.name.toLowerCase().includes(q)).slice(0, 8));
};
open = (app) => shell.invoke("apps.launch", { id: app.id }).then(() => shell.surface.close());
```

## Open a panel from a hotkey

```jsonc
// config
{ "id": "my-launcher", "keys": "Win+Space", "action": { "event": "my-shell.launcher" } }
```

```ts
// in the bar
shell.onEvent("hotkeys", (op, data) => {
  if (op === "pressed" && data.id === "my-launcher") shell.surface.toggle("my-shell-launcher");
});
```

## Your own settings in the config

```ts
shell.subscribe("config", ({ value }) => {
  const opts = (value as any)["my-shell"] ?? {};   // "my-shell": { … } in config.jsonc
  applyTheme(opts.accent ?? "#89b4fa");
});
```

## Theme from Windows

```ts
shell.subscribe("display", ({ dark, accent }) => {
  document.documentElement.classList.toggle("light", !dark.apps);
  if (accent) document.documentElement.style.setProperty("--accent", accent);
});
```
