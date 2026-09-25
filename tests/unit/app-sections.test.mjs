import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

/* Reveal.js takes every <section> inside a lecture deck for a slide, and makes
   it inert or hides it. The deck partial turns the sections apps render in
   Hugo into divs, but it cannot see elements an app's script creates, so apps
   build their regions as <div role="region"> instead. See
   docs/slides/reveal/theme.md. */
test('no app script creates a <section> element', async () => {
  const dir = 'assets/js/apps';
  const offenders = [];
  for (const file of (await readdir(dir)).filter(name => name.endsWith('.js'))) {
    const source = await readFile(`${dir}/${file}`, 'utf8');
    if (/createElement\(\s*['"]section['"]|\bel\(\s*['"]section['"]|<section[\s>]/.test(source)) offenders.push(file);
  }
  assert.deepEqual(offenders, []);
});
