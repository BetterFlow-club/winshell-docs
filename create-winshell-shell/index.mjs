#!/usr/bin/env node
// npm create winshell-shell [name]
// Copies template/ into ./<name>, with __NAME__ replaced by the name.

import { cpSync, existsSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const name = process.argv[2] ?? "my-shell";
if (!/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error(`"${name}" won't work as a shell name: use lowercase letters, digits and dashes (it becomes app://shell/${name}/).`);
  process.exit(2);
}
const target = resolve(name);
if (existsSync(target) && readdirSync(target).length > 0) {
  console.error(`${target} already exists and isn't empty.`);
  process.exit(1);
}

const template = join(dirname(fileURLToPath(import.meta.url)), "template");
cpSync(template, target, { recursive: true });
// npm drops .gitignore from published packages, so it ships as _gitignore.
renameSync(join(target, "_gitignore"), join(target, ".gitignore"));

const text = /\.(json|jsonc|ts|mjs|html|css|md)$/;
(function fill(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) fill(p);
    else if (text.test(entry) || entry === ".gitignore") writeFileSync(p, readFileSync(p, "utf8").replaceAll("__NAME__", name));
  }
})(target);

console.log(`
Created ${name}/ (served as app://shell/${name}/).

  cd ${name}
  npm install
  npm run deploy     build and copy it into winshell's shells folder
  npm run try        show its bar and popup now (until winshell restarts)

Then keep it: paste surfaces.json into "surfaces" in your config
(notepad (winshellctl config-path)). Hot reload: see README.md.
`);
