import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export interface Section {
  heading: string; // "" for the text before the first heading
  anchor: string;
  body: string;
}

export interface Page {
  slug: string; // "shells/sdk", "index"
  title: string;
  description: string;
  body: string;
  sections: Section[];
}

export interface Hit {
  ref: string; // "shells/sdk#storage"
  page: Page;
  heading: string;
  body: string;
  score: number;
}

export function loadPages(dir: URL): Page[] {
  const root = fileURLToPath(dir);
  const files: string[] = [];
  (function walk(d: string) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.mdx?$/.test(e)) files.push(p);
    }
  })(root);
  return files.map((f) => parse(relative(root, f).split(sep).join("/").replace(/\.mdx?$/, ""), readFileSync(f, "utf8"))).sort((a, b) => a.slug.localeCompare(b.slug));
}

function parse(slug: string, raw: string): Page {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(raw);
  const meta = fm?.[1] ?? "";
  const field = (k: string) => new RegExp(`^${k}:\\s*(.+)$`, "m").exec(meta)?.[1]?.trim().replace(/^["']|["']$/g, "") ?? "";
  let body = fm ? raw.slice(fm[0].length) : raw;
  // MDX: drop imports and component tags, keep their text.
  body = body.replace(/^import .*$/gm, "").replace(/<\/?[A-Z][^>]*>/g, "").replace(/\n{3,}/g, "\n\n");
  return { slug, title: field("title") || slug, description: field("description"), body, sections: split(body) };
}

function split(body: string): Section[] {
  const out: Section[] = [];
  let heading = "";
  let lines: string[] = [];
  let fence = false;
  const flush = () => {
    if (heading || lines.join("").trim()) out.push({ heading, anchor: anchorOf(heading), body: lines.join("\n") });
  };
  for (const line of body.split(/\r?\n/)) {
    if (line.startsWith("```")) fence = !fence;
    const m = !fence && /^#{2,3}\s+(.+)$/.exec(line);
    if (m) {
      flush();
      heading = m[1].replace(/`/g, "");
      lines = [];
    } else lines.push(line);
  }
  flush();
  return out;
}

const anchorOf = (h: string) => h.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-");

export function section(page: Page, anchor: string): Section | undefined {
  const a = anchorOf(anchor.replace(/-/g, " "));
  return page.sections.find((s) => s.anchor === a || s.anchor === anchor.toLowerCase());
}

/** Sections ranked by how often the query's words occur, headings and titles counting more. */
export function search(pages: Page[], query: string, limit: number): Hit[] {
  const terms = [...new Set(query.toLowerCase().split(/[^\p{L}\p{N}._+-]+/u).filter((t) => t.length > 1 && !stop.has(t)))];
  if (terms.length === 0) return [];
  const hits: Hit[] = [];
  for (const page of pages) {
    for (const s of page.sections) {
      const body = s.body.toLowerCase();
      const head = `${page.title} ${s.heading}`.toLowerCase();
      let score = 0;
      let matched = 0;
      for (const t of terms) {
        const n = count(body, t) + 4 * count(head, t) + 2 * count(page.description.toLowerCase(), t);
        if (n > 0) matched++;
        score += Math.min(n, 8);
      }
      if (score === 0) continue;
      score *= matched / terms.length; // sections matching more of the words first
      hits.push({ ref: s.anchor ? `${page.slug}#${s.anchor}` : page.slug, page, heading: s.heading, body: s.body, score });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

function count(hay: string, needle: string): number {
  let n = 0;
  for (let i = hay.indexOf(needle); i !== -1; i = hay.indexOf(needle, i + needle.length)) n++;
  return n;
}

const stop = new Set(["the", "a", "an", "to", "of", "in", "on", "and", "or", "is", "it", "how", "do", "i", "my", "can", "what", "with", "for", "from", "be"]);
