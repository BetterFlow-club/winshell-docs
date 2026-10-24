---
title: SDK
description: The @winshell/sdk API.
---

```bash
npm install @winshell/sdk
```

```ts
import { shell, ShellError } from "@winshell/sdk";
```

Everything is typed: topic names, their state, command results.

## State

```ts
const off = shell.subscribe("media", (m) => render(m));   // now (if known) + every change
shell.get("media");                                       // cached state, or undefined
off();                                                    // last listener gone → unsubscribed
```

States are replaced, never mutated, so `===` tells you something changed.
Topics: [Topics & commands](../topics/).

```ts
shell.onEvent("hotkeys", (op, data) => {                  // raw events, e.g. hotkey presses
  if (op === "pressed" && data.id === "launcher") openLauncher();
});
```

## Commands

```ts
await shell.invoke("audio.setVolume", { value: 0.4 });
const { mime, data } = await shell.invoke<{ mime: string; data: string }>("apps.icon", { id, size: 32 });

try { await shell.invoke("wifi.connect", { ssid, password }); }
catch (e) { if (e instanceof ShellError) toast(e.message); }   // e.code: "invalid_args", "internal", …
```

## This surface: `shell.surface`

| | |
|---|---|
| `info` | `{ id, key, layer, edge, popup, monitor }` |
| `open(id, opts?)`, `toggle(id, opts?)`, `close(id?)` | Popups. `opts`: `{ anchor: Element, data, gap }`. `toggle` with other `data` than the open popup has switches it instead of closing |
| `onOpen(fn)`, `onClose(fn)` | In a popup |
| `resize(w, h)`, `move(x, y)`, `pin(edges, margins)`, `configure({…})` | Change own placement (logical px) |
| `fitContent(el)`, `autoSize(el) → stop` | Size the window to an element |
| `onGeometry(fn)`, `geometry` | Window rect in physical px |
| `onHide(fn, ms)`, `onShow(fn)` | Animate hiding and showing |
| `onCovered(fn)`, `covered`, `peek(ms?)` | Fullscreen apps |
| `setRegion(rects \| null)` | Click-through outside the rects |
| `thumbnail(id, hwnd, el)`, `trackThumbnail(…) → stop`, `removeThumbnail(id?)` | Live window previews |

## Other APIs

```ts
// Storage that survives restarts and is shared by all pages
await shell.storage.set("my-shell.pins", ["Spotify"]);
const pins = await shell.storage.get<string[]>("my-shell.pins");
shell.storage.watch<string[]>("my-shell.pins", (v) => render(v ?? []));

// Hotkeys owned by this page (gone when it unloads)
const unregister = await shell.hotkeys.register("Win+Alt+L", () => openLauncher());

// Notifications
const id = await shell.notifications.post(
  { title: "Export done", body: "report.pdf", actions: [{ id: "open", label: "Open" }] },
  (action) => action === "open" && shell.invoke("apps.open", { target: "C:\\out\\report.pdf" }),
);

// Surfaces added at runtime (removed with this page unless detached)
await shell.surfaces.add({ id: "osd", url: "app://shell/my-shell/osd.html", anchor: ["bottom"], margin: { bottom: 80 } });
```

## Outside winshell

In a normal browser `shell.connected` is `false`: subscriptions never fire
and `invoke` rejects with code `offline`. Use that to show mock data while
designing.

```ts
if (!shell.connected) render(mockMedia);
```

## React

```tsx
function useTopic<K extends Topic>(topic: K) {
  const [state, setState] = useState(() => shell.get(topic));
  useEffect(() => shell.subscribe(topic, setState), [topic]);
  return state;
}

function Cpu() {
  const stats = useTopic("stats");
  return <span>CPU {stats ? Math.round(stats.cpu.usage * 100) : "–"}%</span>;
}
```
