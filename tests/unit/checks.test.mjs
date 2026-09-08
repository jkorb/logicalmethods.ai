import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { inspectSite } from '../../scripts/check-site.mjs';
import { inspectContent } from '../../scripts/check-content.mjs';
import { proseText } from '../../scripts/prose-text.mjs';

test('site checker catches broken resources, fragments, IDs and solution wiring', async t => {
  await mkdir('tmp', { recursive: true });
  const root = await mkdtemp(path.resolve('tmp/check-fixture-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(path.join(root, 'index.html'), '<a href="https://logicalmethods.ai/chapter/#good">Good</a><a href="/chapter/#bad">Bad</a><img src="missing.png"><div id="dup"></div><div id="dup"></div><link href="/style.css" rel="stylesheet">');
  await mkdir(path.join(root, 'chapter'));
  await writeFile(path.join(root, 'chapter/index.html'), '<h1 id="good">Chapter</h1>');
  await writeFile(path.join(root, 'style.css'), '@font-face { src: url(missing.woff2); }');
  await mkdir(path.join(root, 'exercises'));
  await writeFile(path.join(root, 'exercises/index.html'), '<div class="solved" id="question"></div><button aria-controls="questionSolution"></button>');
  const errors = await inspectSite(root);
  assert(errors.some(e => e.includes('missing.png')));
  assert(errors.some(e => e.includes('missing.woff2')));
  assert(errors.some(e => e.includes('missing fragment /chapter/#bad')));
  assert(errors.some(e => e.includes('duplicate id dup')));
  assert(errors.some(e => e.includes('missing collapsible solution questionSolution')));
  assert(!errors.some(e => e.includes('#good')));
});

test('content schemas distinguish lessons and resource bundles', () => {
  const valid = '---\ntitle: Test\nweight: 10\nparams:\n  id: exc-test\n---\n# Question {.solved}\n';
  assert.deepEqual(inspectContent(valid, 'content/exercises/test/index.md', { 'exc-test': 'test' }), []);
  assert(inspectContent(valid, 'content/exercises/test/index.md').some(e => e.includes('password')));
  assert(inspectContent(valid.replace('weight: 10', 'weight: wrong'), 'content/textbook/test/index.md').some(e => e.includes('weight')));
  assert.deepEqual(inspectContent('---\ntitle: Resources\nbuild:\n  render: never\n---\n', 'content/textbook/resources/index.md'), []);
});

test('prose preprocessing preserves paired shortcode prose and source line positions', () => {
  const source = '---\ntitle: IgnoreMe\n---\n# Title {#IgnoreId}\n{{< abbr title="IgnoreAttribute" >}}Keep this prose{{< /abbr >}}\n$IgnoreMath$ !!IgnoreBoolean!! ~!IgnoreKleene!~ %IgnoreCode%\n~~~lean\nIgnoreBlock\n~~~\nA deliberate mispelling.\n';
  const result = proseText(source);
  assert(result.includes('Keep this prose'));
  assert(result.includes('A deliberate mispelling.'));
  assert(!result.includes('Ignore'));
  assert.equal(source.split('\n').length, result.split('\n').length);
  assert.equal(source.indexOf('A deliberate'), result.indexOf('A deliberate'));
});

test('Hugo fails on missing image and chapter shortcodes with source locations', async t => {
  const { execFileSync } = await import('node:child_process');
  const { copyFile } = await import('node:fs/promises');
  const root = await mkdtemp(path.resolve('tmp/hugo-fixture-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'content'), { recursive: true });
  await mkdir(path.join(root, 'layouts/shortcodes'), { recursive: true });
  await writeFile(path.join(root, 'hugo.toml'), "baseURL = 'https://example.test/'\n");
  await writeFile(path.join(root, 'layouts/index.html'), '{{ .Content }}');
  for (const name of ['img', 'chapter_ref']) await copyFile(`layouts/shortcodes/${name}.html`, path.join(root, `layouts/shortcodes/${name}.html`));
  for (const [shortcode, message] of [['{{< img src="absent.png" >}}', 'Image not found: absent.png'], ['{{< chapter_ref chapter="absent" >}}text{{< /chapter_ref >}}', 'Chapter not found: absent']]) {
    await writeFile(path.join(root, 'content/_index.md'), `---\ntitle: Fixture\n---\n${shortcode}`);
    assert.throws(() => execFileSync('hugo', ['-D', '--source', root], { encoding: 'utf8', stdio: 'pipe' }), error => {
      const output = `${error.stdout}${error.stderr}`;
      return output.includes(message) && output.includes('_index.md');
    });
  }
});
