// Checks the `docs/` Obsidian vault: every relative link resolves, every heading
// anchor exists, every note is reachable from its folder index, and no note uses
// wikilinks. The vault is many small files, so a rename that silently orphans a
// note is the failure mode worth catching.
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { files, finish } from './lib.mjs';

// Fenced blocks and code spans document syntax; they are not links.
export function stripCode(source) {
  return source.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}

export function linksIn(source) {
  return [...stripCode(source).matchAll(/(?<!!)\[(?:[^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map(m => m[1]);
}

// GitHub's heading slug, plus any explicit `{#id}` the page supplies.
export function anchorsIn(source) {
  const ids = new Set();
  for (const line of stripCode(source).split('\n')) {
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    if (!heading) continue;
    const title = heading[1].trim();
    const explicit = title.match(/\{#([^}\s]+)[^}]*\}$/);
    if (explicit) { ids.add(explicit[1]); continue; }
    ids.add(title.replace(/\{[^}]*\}/g, '').trim().toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-'));
  }
  return ids;
}

async function exists(target) {
  try { await stat(target); return true; } catch { return false; }
}

export async function inspectVault(root) {
  const notes = (await files(root)).filter(f => f.endsWith('.md') && !f.split(path.sep).includes('.obsidian'));
  const errors = [];
  const linked = new Set();
  const anchors = new Map();
  const sources = new Map();
  for (const note of notes) {
    const source = await readFile(note, 'utf8');
    sources.set(note, source);
    anchors.set(note, anchorsIn(source));
  }

  for (const note of notes) {
    const source = sources.get(note);
    if (/\[\[[^\]]+\]\]/.test(stripCode(source))) {
      errors.push(`${note}: wikilink syntax does not render on GitHub; use [Text](path.md)`);
    }
    for (const link of linksIn(source)) {
      if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(link)) continue;   // external, protocol or same-page
      const [target, fragment] = link.split('#');
      if (!target) continue;
      const resolved = path.normalize(path.join(path.dirname(note), decodeURIComponent(target)));
      if (!(await exists(resolved))) { errors.push(`${note}: broken link ${link}`); continue; }
      if (!anchors.has(resolved)) continue;                          // outside the vault; path already checked
      linked.add(resolved);
      if (fragment && !anchors.get(resolved).has(fragment)) {
        errors.push(`${note}: missing anchor #${fragment} in ${target}`);
      }
    }
  }

  // Every note except the vault entry point must be reachable by a link.
  for (const note of notes) {
    if (note === path.join(root, 'README.md')) continue;
    if (!linked.has(note)) errors.push(`${note}: not linked from any note; add it to its folder index`);
  }

  // Every folder needs an index, so a reader can find a note without listing the folder.
  for (const dir of new Set(notes.map(n => path.dirname(n)))) {
    if (!notes.includes(path.join(dir, 'README.md'))) errors.push(`${dir}: missing README.md index`);
  }

  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  finish(await inspectVault('docs'), 'Documentation vault');
}
