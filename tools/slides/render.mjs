import fs from 'node:fs/promises';
import path from 'node:path';
import { loadDeck, root, startRuntime, hash, deckIds } from './runtime.mjs';
import { orderedFrames } from './model.mjs';

const ids = process.argv.slice(2);
const decks = await Promise.all((ids.length ? ids : await deckIds()).map(loadDeck));
const runtime = await startRuntime();
let browser;
try {
  browser = await runtime.chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => errors.push(`Resource failed: ${request.url()}`));
  page.on('response', response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
  await page.route('**/*', route => new URL(route.request().url()).origin === runtime.url ? route.continue() : route.abort());
  await page.goto(runtime.url);
  await page.waitForFunction(() => typeof window.exportSlide === 'function');
  for (const { manifest, scene, revision } of decks) {
    const slides = orderedFrames(scene, manifest);
    const stage = path.join(root, 'tmp/slides-render', manifest.id);
    await fs.mkdir(stage, { recursive: true });
    const records = [];
    for (const [i, slide] of slides.entries()) {
      const svg = await page.evaluate(args => window.exportSlide(args), { scene, frame: slide.frame });
      if (/<(?:script|foreignObject)\b/.test(svg) || /(?:href|src)="https?:/.test(svg)) throw new Error('Slide contains active or external resources');
      const name = `slide-${String(i + 1).padStart(2, '0')}.svg`;
      await fs.writeFile(path.join(stage, name), svg);
      const members = scene.elements.filter(e => !e.isDeleted && e.frameId === slide.frame.id);
      records.push({ number: i + 1, frameId: slide.frame.id, title: slide.title,
        file: name, sha256: await hash(svg), width: slide.frame.width, height: slide.frame.height,
        links: members.filter(e => /^https?:\/\//.test(e.link || '')).map(e => ({ url: e.link, label: e.text || 'Open linked resource' })),
        elements: members.length, images: members.filter(e => e.type === 'image').length,
        text: members.filter(e => e.type === 'text').sort((a, b) => a.y - b.y || a.x - b.x).map(e => e.text).join('\n'),
      });
      console.log(`${manifest.id}: ${i + 1}/${slides.length} ${slide.title}`);
    }
    if (errors.length) throw new Error(errors.join('\n'));
    const output = path.resolve(root, manifest.output);
    const allowedRoot = manifest.publication === 'unpublished' ? 'slides/unpublished/' : 'content/slides/';
    if (!output.startsWith(path.join(root, allowedRoot))) throw new Error('Output outside designated slide bundles');
    await fs.mkdir(output, { recursive: true });
    // Only publish a complete export; keep prior exports if a frame failed.
    for (const slide of records) await fs.copyFile(path.join(stage, slide.file), path.join(output, slide.file));
    await fs.writeFile(path.join(output, 'index.json'), JSON.stringify({ title: manifest.title, sourceSha256: revision, slides: records }, null, 2) + '\n');
    const currentFiles = new Set(records.map(slide => slide.file));
    for (const name of await fs.readdir(output)) {
      if (/^slide-\d+\.svg$/.test(name) && !currentFiles.has(name)) await fs.unlink(path.join(output, name));
    }
  }
} finally { if (browser) await browser.close(); await new Promise(resolve => runtime.server.close(resolve)); }
