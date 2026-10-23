# @winshell/docs-mcp

An [MCP](https://modelcontextprotocol.io) server with the
[winshell](https://betterflow-club.github.io/winshell-docs/) docs, so AI
assistants can look up how to configure winshell and build shells instead
of guessing.

```bash
claude mcp add winshell-docs -- npx -y @winshell/docs-mcp
```

Other clients (Claude Desktop, Cursor, VS Code):

```json
{ "mcpServers": { "winshell-docs": { "command": "npx", "args": ["-y", "@winshell/docs-mcp"] } } }
```

| Tool | Does |
|---|---|
| `search_docs { query, limit? }` | Best-matching sections, with their text |
| `get_page { slug }` | A page (`shells/sdk`) or a section (`config/hotkeys#actions`) |
| `list_pages` | Every page and what it covers |
