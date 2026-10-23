#!/usr/bin/env node
// winshell docs over MCP (stdio). Three tools:
//   list_pages   every page with its description
//   search_docs  best-matching sections for a question
//   get_page     a page, or one section of it ("shells/sdk#storage")
// The pages are the docs site's Markdown, copied into ../pages at build.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadPages, search, section, type Page } from "./pages.js";

const pages: Page[] = loadPages(new URL("../pages/", import.meta.url));
const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });

const server = new McpServer(
  { name: "winshell-docs", version: "0.1.0" },
  {
    instructions:
      "Documentation for winshell, a programmable Windows shell: installing it, winshellctl, the config file " +
      "(hotkeys, surfaces), and building shells as web pages with @winshell/sdk (topics, commands, popups). " +
      "Search first, then read the page you need. Prefer the docs' examples over guessing APIs.",
  },
);

server.registerTool(
  "list_pages",
  { title: "List pages", description: "All winshell docs pages: slug, title and what each covers." },
  async () => text(pages.map((p) => `${p.slug}: ${p.title} (${p.description})`).join("\n")),
);

server.registerTool(
  "search_docs",
  {
    title: "Search docs",
    description: "Find the docs sections that answer a question, e.g. 'open a popup from the bar' or 'run app on hotkey'.",
    inputSchema: { query: z.string().describe("What you want to know"), limit: z.number().int().min(1).max(20).optional() },
  },
  async ({ query, limit }) => {
    const hits = search(pages, query, limit ?? 6);
    if (hits.length === 0) return text(`No matches for "${query}". list_pages shows what's there.`);
    return text(hits.map((h) => `## ${h.ref} (${h.page.title}${h.heading ? " › " + h.heading : ""})\n${h.body.trim()}`).join("\n\n---\n\n"));
  },
);

server.registerTool(
  "get_page",
  {
    title: "Read a page",
    description: "A whole docs page as Markdown, or one section with 'slug#heading' (from search_docs or list_pages).",
    inputSchema: { slug: z.string().describe("e.g. 'shells/sdk' or 'config/hotkeys#actions'") },
  },
  async ({ slug }) => {
    const [name, anchor] = slug.replace(/^\/|\/$/g, "").split("#");
    const page = pages.find((p) => p.slug === name);
    if (!page) return text(`No page "${name}". Pages: ${pages.map((p) => p.slug).join(", ")}`);
    if (anchor) {
      const s = section(page, anchor);
      if (s) return text(`# ${page.title} › ${s.heading}\n\n${s.body.trim()}`);
    }
    return text(`# ${page.title}\n\n${page.description}\n\n${page.body.trim()}`);
  },
);

await server.connect(new StdioServerTransport());
