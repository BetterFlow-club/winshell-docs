---
title: MCP server
description: Let Claude Code and other AI assistants read these docs.
---

`@winshell/docs-mcp` serves these docs over the
[Model Context Protocol](https://modelcontextprotocol.io). An assistant
with it can answer "how do I open a popup from my bar?" from the real
docs instead of guessing.

## Add it

**Claude Code:**

```bash
claude mcp add winshell-docs -- npx -y @winshell/docs-mcp
```

**Claude Desktop, Cursor, VS Code** and other clients, in their MCP config:

```json
{
  "mcpServers": {
    "winshell-docs": { "command": "npx", "args": ["-y", "@winshell/docs-mcp"] }
  }
}
```

From a checkout of the docs repo instead: `npm install && npm run build -w mcp`,
then use `"command": "node", "args": ["<repo>/mcp/dist/index.js"]`.

## Tools

| Tool | Does |
|---|---|
| `search_docs { query, limit? }` | The best-matching sections, with their text |
| `get_page { slug }` | A page (`shells/sdk`) or one section (`config/hotkeys#actions`) |
| `list_pages` | Every page and what it covers |

## Good prompts

- "Using the winshell docs, make me a bar with a clock and battery."
- "Add a hotkey that opens WezTerm centered."
- "Why does my popup close when I click the bar?"

Pair it with `winshellctl` in the assistant's terminal: it can
`winshellctl sub <topic>` to see real data and `winshellctl hotkeys` to check
bindings.
