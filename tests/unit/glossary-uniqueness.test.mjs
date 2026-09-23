import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('glossary keys and displayed terms are unique', async () => {
  const source = await readFile(new URL('../../data/glossary.json', import.meta.url), 'utf8');
  const keys = [...source.matchAll(/^  "([^"]+)": \{/gm)].map(m => m[1]);
  assert.equal(new Set(keys).size, keys.length, 'Duplicate top-level JSON keys');
  const entries = JSON.parse(source);
  const names = Object.values(entries).map(e => e.term.toLowerCase().replace(/[-–—]/g,' ').replace(/\s+/g,' ').trim());
  assert.equal(new Set(names).size, names.length, 'Duplicate displayed glossary terms');
  assert.ok(entries.xai);
  assert.equal(entries['explainable-ai'], undefined);
});
