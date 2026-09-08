import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { files, finish } from './lib.mjs';

export function inspectContent(source, file, passwords = {}) {
  const errors = [];
  const fail = message => errors.push(`${file}: ${message}`);
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return [`${file}: missing YAML front matter`];
  let data;
  try { data = parse(match[1]); } catch (error) { return [`${file}: ${error.message}`]; }
  if (!['content/tutoraat/_index.md', 'content/unlock/_index.md', 'content/verdiepingspakketten/_index.md'].includes(file) && (!data || typeof data.title !== 'string' || !data.title.trim())) fail('title must be a nonempty string');
  for (const key of ['draft', 'locked', 'hidden']) if (data?.[key] !== undefined && typeof data[key] !== 'boolean') fail(`${key} must be boolean`);
  if (data?.params?.math !== undefined && typeof data.params.math !== 'boolean') fail('params.math must be boolean');
  if (data?.build?.render !== 'never' && /content\/(textbook|exercises|slides)\/[^/]+\/index.md$/.test(file)) {
    if (!Number.isInteger(data?.weight)) fail('weight must be an integer');
    if (typeof data?.params?.id !== 'string' || !data.params.id.trim()) fail('params.id must be a nonempty string');
  }
  if (file.startsWith('content/exercises/') && file.endsWith('/index.md')) {
    if (/\.solved\b/.test(source) && typeof passwords[data?.params?.id] !== 'string') fail(`missing password lookup for ${data?.params?.id}`);
  }
  return errors;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Evaluate only the literal password table, never the browser script.
  const script = await readFile('assets/js/exercises.js', 'utf8');
  const table = script.match(/const passwords = (\{[\s\S]*?\});/);
  if (!table) throw new Error('Cannot locate exercise password table');
  const passwords = vm.runInNewContext(`(${table[1]})`, Object.create(null), { timeout: 1000 });
  const errors = [];
  const ids = new Map();
  for (const file of (await files('content')).filter(f => /(?:^|\/)_?index\.md$/.test(f))) {
    const source = await readFile(file, 'utf8');
    errors.push(...inspectContent(source, file, passwords));
    try {
      const data = parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || '');
      const id = data?.params?.id;
      if (id && ids.has(id)) errors.push(`${file}: duplicate params.id ${id} (${ids.get(id)})`);
      if (id) ids.set(id, file);
    } catch { /* Parse diagnostics already emitted above. */ }
  }
  finish(errors, 'Content conventions');
}
