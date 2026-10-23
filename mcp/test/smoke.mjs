// Starts the built server over stdio and calls each tool once.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";

const server = fileURLToPath(new URL("../dist/index.js", import.meta.url));
const client = new Client({ name: "smoke", version: "0" });
await client.connect(new StdioClientTransport({ command: process.execPath, args: [server] }));

const tools = (await client.listTools()).tools.map((t) => t.name).sort();
console.log("tools:", tools.join(", "));
const call = async (name, args = {}) => (await client.callTool({ name, arguments: args })).content[0].text;

const list = await call("list_pages");
console.log(`list_pages: ${list.split("\n").length} pages`);
const hit = await call("search_docs", { query: "open a popup from the bar", limit: 3 });
console.log("search_docs:", hit.split("\n").filter((l) => l.startsWith("## ")).join(" | "));
const page = await call("get_page", { slug: "config/hotkeys#actions" });
console.log("get_page:", page.split("\n")[0]);

if (tools.join() !== "get_page,list_pages,search_docs" || !page.includes("place")) throw new Error("smoke test failed");
await client.close();
console.log("docs-mcp: ok");
