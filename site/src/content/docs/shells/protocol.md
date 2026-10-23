---
title: Protocol (any language)
description: Talk to winshell from scripts and tools without the SDK.
---

The SDK and `winshellctl` speak a small JSON protocol over a named pipe.
Use it from Python, Rust, AutoHotkey, anything that can open a file.

- **Pipe:** `\\.\pipe\winshell-<your user SID>` (`winshellctl status` prints it).
- **Framing:** one JSON object per line (`\n`).
- **First message:** `hello`.

```jsonc
→ { "id": 0, "type": "hello", "protocol": 1, "client": "my-tool" }
← { "id": 0, "type": "hello", "protocol": 1, "server": "winshelld", "version": "0.2.11" }

→ { "id": 1, "type": "cmd", "name": "audio.setVolume", "args": { "value": 0.3 } }
← { "id": 1, "type": "ok", "result": { "volume": 0.3 } }

→ { "id": 2, "type": "sub", "topics": ["media"] }
← { "id": 2, "type": "ok", "result": {} }
← { "type": "snapshot", "topic": "media", "data": { … } }
← { "type": "event", "topic": "media", "op": "update", "data": { … } }
```

Errors: `{ "id": 1, "type": "err", "code": "invalid_args", "message": "…" }`.
Codes: `bad_request`, `unknown_command`, `unknown_topic`, `invalid_args`,
`config_invalid`, `internal`.

## Python

```python
import json, subprocess

sid = subprocess.check_output(["whoami", "/user", "/fo", "csv", "/nh"], text=True).split(",")[1].strip().strip('"')
pipe = open(rf"\\.\pipe\winshell-{sid}", "r+b", buffering=0)

def send(msg): pipe.write((json.dumps(msg) + "\n").encode())
def recv(): return json.loads(pipe.readline())

send({"id": 0, "type": "hello", "protocol": 1, "client": "example"}); recv()
send({"id": 1, "type": "cmd", "name": "notifications.post", "args": {"title": "Hi from Python"}}); print(recv())
send({"id": 2, "type": "sub", "topics": ["windows"]})
while True:
    print(recv())
```

## Shell scripts

Often `winshellctl` is enough:

```bash
winshellctl cmd media.toggle
winshellctl sub windows | jq -c 'select(.op == "focus")'
```

## Rules

- Only your user (and SYSTEM) can open the pipe.
- Snapshots carry full state; events are `update` (full state again) or
  small deltas (`windows`: `add`, `update`, `remove`, `focus`; `audio`:
  `volume`). The SDK folds them for you.
- Lines are capped at 1 MiB. Heartbeats arrive every 2 s while subscribed.
