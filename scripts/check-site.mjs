import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { documents, files, references, cssReferences, internal, targetFile, pageURL, siteDir, finish } from './lib.mjs';

export async function inspectSite(root = siteDir) {
  const allFiles = await files(root);
  const fileSet = new Set(allFiles);
  const docs = await documents(root);
  const errors = [];
  async function check(ref, base, source) {
    let url;
    try { url = new URL(ref, base); } catch { errors.push(`${source}: invalid URL ${ref}`); return; }
    if (!internal(url)) return;
    let file;
    try { file = await targetFile(url, root); } catch { errors.push(`${source}: invalid path ${ref}`); return; }
    if (!file || !fileSet.has(file)) { errors.push(`${source}: missing target ${ref}`); return; }
    if (url.hash && docs.has(file)) {
      let id;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch { errors.push(`${source}: invalid fragment ${ref}`); return; }
      // Browser text fragments do not require a matching element ID.
      id = id.split(':~:text=')[0];
      if (id && !docs.get(file).$('[id], a[name]').toArray().some(el => el.attribs.id === id || el.attribs.name === id)) errors.push(`${source}: missing fragment ${ref}`);
    }
  }
  for (const [file, { $, url }] of docs) {
    const source = path.relative(root, file);
    const ids = new Set();
    $('[id]').each((_, el) => { const id = el.attribs.id; if (ids.has(id)) errors.push(`${source}: duplicate id ${id}`); ids.add(id); });
    if (/Image not found:|\{\{[<%]/.test($('body').text())) errors.push(`${source}: unresolved image or shortcode`);
    for (const ref of references($)) await check(ref, url, source);
    if (source.startsWith('exercises/')) {
      $('.solved[id]').each((_, el) => {
        const solution = $('[id]').toArray().find(s => s.attribs.id === `${el.attribs.id}Solution`);
        if (!solution || !$(solution).hasClass('solution') || !$(solution).hasClass('collapse')) errors.push(`${source}: missing collapsible solution ${el.attribs.id}Solution`);
      });
      $('.solution[id]').each((_, el) => {
        const id = el.attribs.id.replace(/Solution$/, '');
        if (!$('.solved[id]').toArray().some(q => q.attribs.id === id)) errors.push(`${source}: orphan solution ${el.attribs.id}`);
      });
    }
    $('[aria-controls]').each((_, el) => {
      for (const id of el.attribs['aria-controls'].split(/\s+/)) if (id && !ids.has(id)) errors.push(`${source}: missing aria-controls target ${id}`);
    });
  }
  for (const file of allFiles.filter(f => f.endsWith('.css'))) {
    for (const ref of cssReferences(await readFile(file, 'utf8'))) await check(ref, pageURL(file, root), path.relative(root, file));
  }
  return [...new Set(errors)].sort();
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = await inspectSite();
  const exceptions = JSON.parse(await readFile('tests/site-exceptions.json', 'utf8'));
  const remaining = errors.filter(e => !exceptions.some(x => x.error === e && x.reason));
  for (const exception of exceptions) {
    if (!exception.reason || !errors.includes(exception.error)) remaining.push(`Stale or unexplained site exception: ${exception.error}`);
  }
  if (exceptions.length) console.log(`Known site findings: ${exceptions.length} exact exceptions (tests/site-exceptions.json)`);
  finish(remaining, 'Generated site');
}
