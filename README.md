# winshell docs

Documentation, MCP server and shell starter for
[winshell](https://betterflow-club.github.io/winshell-docs/).

| Folder | What |
|---|---|
| [`site/`](site) | The docs website (Astro Starlight). Pages are Markdown in [`site/src/content/docs`](site/src/content/docs) and read fine on GitHub too |
| [`mcp/`](mcp) | `@winshell/docs-mcp`: an MCP server that lets an AI assistant search and read these docs |
| [`create-winshell-shell/`](create-winshell-shell) | `npm create winshell-shell`: a new shell (Vite + TypeScript + `@winshell/sdk`) with a bar and a popup |

The SDK itself, [`@winshell/sdk`](https://www.npmjs.com/package/@winshell/sdk),
is published to npm with its TypeScript sources; winshell itself is closed
source.

```bash
npm install
npm run dev      # docs site on http://localhost:4321
npm run build    # site/dist + mcp/dist
```

## Writing docs

- One task per page. Lead with an example, then the rules.
- Short sentences, tables for options, no history ("we used to…").
- When winshell changes, update the page here in the same go.
