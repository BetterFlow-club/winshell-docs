---
title: How surfaces behave
description: What a page needs to know about its window, popups, scaling and fullscreen.
---

Each surface is a borderless, **transparent** window with one page in it
(WebView2, Chromium). Draw only what should show; the rest of the window
is see-through.

```css
html, body { margin: 0; background: transparent; }
.bar { height: 100%; background: rgba(24, 24, 32, .88); border-radius: 0 0 12px 12px; }
```

Declaring them is in [config › surfaces](../../config/surfaces/).

## Instances

- A declaration with `"monitor": "all"` gets **one page per monitor**.
  `shell.surface.info.monitor` says which one you are.
- A **popup** has one page, created on first open and kept hidden after,
  so reopening is instant. Reset state in `onOpen`, not on load.
- Pages reload when their declaration changes.

## Pixels

CSS pixels are logical pixels: a 36 px bar is 36 px at 100% Windows
scaling, 54 px at 150%, and more with `host.scale`. Pages need no code for
DPI.

## Popups

```ts
// opener (a bar button)
button.onclick = () => shell.surface.toggle("my-volume", { anchor: button });

// in the popup
shell.surface.onOpen((data) => slider.focus());
shell.surface.onClose((reason) => {});   // "request" | "outside" | "blur"
```

- Placed next to the anchor, away from the bar's edge, kept on screen.
- `toggle` closes an open popup, unless the `data` differs: then the page
  gets `onOpen` again with the new data while it's showing (buttons that
  open different tabs of one panel).
  `gap` (default 6, `0` attached, negative overlaps) sets the distance.
- Closes on Escape, a click outside, or focus moving away.
- Size to content: `shell.surface.autoSize(panelElement)`.
- Animate: `shell.surface.onHide(async () => { await fadeOut() })` delays
  hiding until the promise settles (≤ 1 s); `onShow` for the way in.

## Fullscreen apps

On a monitor with a fullscreen game or video, surfaces go behind it and
come back after (`"hide_on_fullscreen": false` opts out).
`shell.surface.onCovered((covered) => …)` lets you pause or animate.
`shell.surface.peek()` brings a bar up over the game for a moment (what
the `Win` key does in Aurora).

## Click-through

A surface bigger than what it draws can let clicks through elsewhere:

```ts
shell.surface.setRegion([{ x: 0, y: 0, width: 600, height: 36 }]);   // only this part is there
```

## Rules for pages

- Loaded from `app://shell/<name>/` or `app://user/`; can't navigate
  elsewhere or open windows.
- Can use every command and topic: only install shells you trust.
- Each surface costs ~23 MB. Animate with CSS transforms; avoid timers that
  wake every second; subscribe only to what you show (subscribed services
  keep running).
