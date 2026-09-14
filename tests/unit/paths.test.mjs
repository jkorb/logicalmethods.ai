import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { targetFile } from '../../scripts/lib.mjs';

test('test server and link checks require the exact published URL case on every OS', async t => {
  await mkdir('tmp', { recursive: true });
  const root = await mkdtemp(path.resolve('tmp/path-fixture-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'textbook/fol'), { recursive: true });
  await writeFile(path.join(root, 'textbook/fol/index.html'), '<title>FOL</title>');
  await writeFile(path.join(root, 'Glyph.svg'), '<svg/>');
  const resolve = pathname => targetFile(new URL(pathname, 'https://logicalmethods.ai'), root);
  assert.equal(await resolve('/textbook/fol/'), path.join(root, 'textbook/fol/index.html'));
  assert.equal(await resolve('/Glyph.svg'), path.join(root, 'Glyph.svg'));
  assert.equal(await resolve('/textbook/FOL/'), null);
  assert.equal(await resolve('/glyph.svg'), null);
  assert.equal(await resolve('/missing/'), null);
});
