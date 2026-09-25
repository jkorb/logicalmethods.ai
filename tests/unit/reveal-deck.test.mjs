import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, copyFile, readFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { load } from 'cheerio';

/* The Reveal.js deck is cut out of the rendered page at the markers the slide
   and column shortcodes leave (layouts/partials/slides/reveal-deck.html). A
   cut in the wrong place loses content or breaks the HTML without a visible
   error, so the build refuses it; these cases pin that down. */
const LAYOUTS = ['layouts/partials/slides/reveal-deck.html', 'layouts/shortcodes/slide.html',
  'layouts/shortcodes/column.html', 'layouts/slides/_markup/render-heading.html',
  'layouts/partials/shared/mascot.html', 'assets/img/mascot/board.svg',
  'layouts/shortcodes/img.html', 'layouts/partials/figures/image.html', 'assets/img/drawings/sat_cpu_bug.svg'];
// Slide 2 must hold the learning goals, so every deck below starts with them.
const GOALS = '{{< slide title="Goals" >}}\n## Goals\n\n<aside class="callout callout--objectives">\n\n- A goal\n\n</aside>\n\n';

async function site(t) {
  await mkdir('tmp', { recursive: true });
  const root = await mkdtemp(path.resolve('tmp/reveal-fixture-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const dir of ['content/slides/deck', 'content/slides/page', 'layouts/partials/slides', 'layouts/partials/shared', 'layouts/shortcodes', 'layouts/slides/_markup', 'layouts/partials/figures', 'assets/img/mascot', 'assets/img/drawings']) {
    await mkdir(path.join(root, dir), { recursive: true });
  }
  for (const file of LAYOUTS) await copyFile(file, path.join(root, file));
  await writeFile(path.join(root, 'layouts/slides/reveal_slides.html'), '{{ partial "slides/reveal-deck.html" . }}');
  await writeFile(path.join(root, 'layouts/slides/single.html'), '{{ .Content }}');
  // An app renders as a labelled <section> with blank lines, as the real ones do.
  await writeFile(path.join(root, 'layouts/shortcodes/app.html'), '<section class="app" aria-label="An app">\n\n  <p>inside</p>\n\n</section>\n<section class="plain">x</section>');
  await writeFile(path.join(root, 'layouts/shortcodes/wrap.html'), '<div>{{ .Inner }}</div>');
  await writeFile(path.join(root, 'hugo.toml'), "baseURL = 'https://example.test/'\n[markup.goldmark.renderer]\nunsafe = true\n");
  return root;
}

async function build(t, body, { layout = 'reveal_slides', front = 'summary: A deck.\n' } = {}) {
  const root = await site(t);
  await writeFile(path.join(root, 'content/slides/deck/index.md'), `---\ntitle: Deck\nweight: 50\nlayout: ${layout}\n${front}---\n${body}`);
  const result = spawnSync('hugo', ['--source', root], { encoding: 'utf8' });
  const html = result.status === 0 ? await readFile(path.join(root, 'public/slides/deck/index.html'), 'utf8') : '';
  return { ok: result.status === 0, output: `${result.stdout}${result.stderr}`, $: load(html) };
}

test('slides are numbered after the title slide and keep their Markdown and apps intact', async t => {
  const { ok, output, $ } = await build(t, `${GOALS}
{{< slide title="First" class="extra" >}}
## One

Some *text*.

{{< slide layout="split" >}}
## Two

{{< column >}}

Left

{{< column >}}

{{< app >}}
`);
  assert.ok(ok, output);
  const slides = $('.slides > section');
  assert.deepEqual(slides.map((_, s) => $(s).attr('id')).get(), ['slide-1', 'slide-2', 'slide-3', 'slide-4']);
  assert.ok($('#slide-1').hasClass('slide--title'));
  assert.equal($('#slide-1 .slide__title').text(), 'Deck');
  assert.equal($('#slide-1 svg.mascot[data-pose="board"]').length, 1);
  assert.equal($('#slide-3').attr('class'), 'slide extra');
  assert.equal($('#slide-3').attr('data-title'), 'First');
  assert.equal($('#slide-3 .slide__body em').text(), 'text');
  assert.equal($('#slide-4').attr('class'), 'slide slide--split');
  assert.equal($('#slide-4 .slide__column').length, 2);
  assert.equal($('#slide-4 .slide__body > h2').text(), 'Two');
  // No marker survives, and only the slides are sections.
  assert.equal($('hr[data-deck-slide], hr[data-deck-column]').length, 0);
  assert.equal($('.slides section').length, 4);
  // The text view is filled in by the browser; the page carries its shell.
  assert.equal($('details.deck-text[hidden] [data-deck-text-slides]').length, 1);
  assert.equal($('.slide__column div[role="region"][aria-label="An app"].app > p').text(), 'inside');
  assert.equal($('.slide__column div.plain:not([role])').length, 1);
  assert.equal($('pre').length, 0, 'an app\'s blank lines must not turn its HTML into a code block');
});

test('a course drawing may appear on a slide', async t => {
  const { ok, output, $ } = await build(t, `${GOALS}{{< slide >}}\n## One\n\n{{< img src="/img/drawings/sat_cpu_bug.svg" alt="A processor" >}}\n\n<img src="/img/drawings/sat_cpu_bug.png" alt="A processor">\n`);
  assert.ok(ok, output);
  assert.equal($('#slide-3 svg[aria-label="A processor"]').length, 1);
});

test('titleSlide: false leaves the numbering to the authored slides', async t => {
  const { ok, output, $ } = await build(t, `{{< slide >}}\n## Own title\n\n${GOALS}`, { front: 'summary: A deck.\nparams:\n  titleSlide: false\n' });
  assert.ok(ok, output);
  assert.deepEqual($('.slides > section').map((_, s) => $(s).attr('id')).get(), ['slide-1', 'slide-2']);
  assert.equal($('.slide--title').length, 0);
});

for (const [name, body, message, options] of [
  ['a deck without slides', 'Just text.\n', /needs at least one/],
  ['Markdown before the first slide', `Stray.\n\n${GOALS}`, /before the first/],
  ['a deck without learning goals', '{{< slide >}}\n## One\n', /slide 2 must hold the learning goals/],
  ['learning goals after slide 2', `{{< slide >}}\n## One\n\n${GOALS}`, /slide 2 must hold the learning goals/],
  ['a slide marker inside a paragraph', `${GOALS}{{< slide >}}\nText\n{{< slide >}}\nMore\n`, /cuts through a <p>/],
  ['a column marker inside a list', `${GOALS}{{< slide layout="split" >}}\n- item\n{{< column >}}\n\ntext\n`, /cuts through a <(li|ul)>/],
  ['a column without layout="split"', `${GOALS}{{< slide >}}\n## One\n\n{{< column >}}\n\ntext\n`, /not layout="split"/],
  ['layout="split" without a column', `${GOALS}{{< slide layout="split" >}}\n## One\n`, /no \{\{< column >\}\}/],
  ['an unknown layout', `${GOALS}{{< slide layout="wide" >}}\n## One\n`, /unknown slide layout "wide"/],
  ['the retired scale parameter', `${GOALS}{{< slide scale="0.8" >}}\n## One\n`, /scale is gone/],
  ['a picture from outside the course drawings', `${GOALS}{{< slide >}}\n## One\n\n<img src="https://example.com/meme.png" alt="">\n`, /only the course's own drawings/],
  ['embedded video', `${GOALS}{{< slide >}}\n## One\n\n<video src="clip.mp4"></video>\n`, /embed no media/],
  ['a drawing without alt', `${GOALS}{{< slide >}}\n## One\n\n{{< img src="/img/drawings/sat_cpu_bug.svg" >}}\n`, /needs alt/],
  ['a deck without a summary', `${GOALS}`, /needs a summary/, { front: '' }],
  ['an h1 on a slide', `${GOALS}{{< slide >}}\n# One\n`, /use ## for a slide title/],
  ['a slide inside another shortcode', `${GOALS}{{< wrap >}}\n{{< slide >}}\n{{< /wrap >}}\n`, /cannot sit inside another shortcode/],
  ['a slide on a page of another layout', '{{< slide >}}\n## One\n', /only on a page with layout reveal_slides/, { layout: 'single' }],
]) test(`the build refuses ${name}`, async t => {
  const { ok, output } = await build(t, body, options);
  assert.equal(ok, false, `built ${name}`);
  assert.match(output, message);
});
