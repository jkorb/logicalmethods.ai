import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { orderedFrames, mergeScene, validateScene } from '../../tools/slides/model.mjs';
const digest = data => createHash('sha256').update(data).digest('hex');
const scene = { type: 'excalidraw', elements: [{ id: 'a', type: 'frame' }, { id: 'b', type: 'frame' }, { id: 'text', type: 'text', frameId: 'a' }], files: {} };
test('slide order is explicit; missing, duplicate and orphaned frames fail', () => {
  assert.deepEqual(orderedFrames(scene, { slides: [{ frameId: 'b' }, { frameId: 'a' }] }).map(s => s.frame.id), ['b', 'a']);
  assert.throws(() => orderedFrames(scene, { slides: [{ frameId: 'a' }] }), /every live frame/);
  assert.throws(() => orderedFrames(scene, { slides: [{ frameId: 'a' }, { frameId: 'a' }] }), /every live frame/);
  assert.throws(() => orderedFrames({ ...scene, elements: [...scene.elements, { id: 'orphan', type: 'text' }] }, { slides: [{ frameId: 'a' }, { frameId: 'b' }] }), /outside slide frames/);
});
test('missing images and remote image records cannot silently enter an export', () => {
  assert.throws(() => validateScene({ ...scene, elements: [{ id: 'image', type: 'image', fileId: 'missing' }] }), /Missing image/);
  assert.throws(() => validateScene({ ...scene, files: { remote: { dataURL: 'https://example.com/image.png' } } }), /must be embedded/);
});
test('saving preserves metadata, unused files and removed elements as deleted history', () => {
  const original = { ...scene, metadata: { workspace: 'original' }, files: { unused: { dataURL: 'data:image/png;base64,AA==' } } };
  const saved = mergeScene(original, { ...scene, elements: scene.elements.slice(0, 2), metadata: {} });
  assert.deepEqual(saved.metadata, original.metadata);
  assert.deepEqual(saved.files, original.files);
  assert.equal(saved.elements.find(e => e.id === 'text').isDeleted, true);
});
for (const n of [1, 2]) test(`released Lecture ${n} has a current complete export`, async () => {
  const manifest = JSON.parse(await readFile(`slides/lecture-${n}.json`));
  const raw = await readFile(`slides/${manifest.source}`);
  const source = JSON.parse(raw);
  validateScene(source);
  assert.deepEqual(source.files, {}, "Released lecture must not embed unreviewed images");
  assert.ok(!source.elements.some(e => e.type === "image" && !e.isDeleted));
  const ordered = orderedFrames(source, manifest);
  const exported = JSON.parse(await readFile(`${manifest.output}/index.json`));
  assert.equal(exported.sourceSha256, digest(raw), 'Scene changed: run npm run slides:render');
  assert.deepEqual(exported.slides.map(s => s.frameId), ordered.map(s => s.frame.id));
  assert.deepEqual(exported.slides.map(s => s.title), ordered.map(s => s.title));
  for (const slide of exported.slides) {
    const svg = await readFile(`${manifest.output}/${slide.file}`, 'utf8');
    assert.equal(digest(svg), slide.sha256);
    assert.ok(!/<(?:script|foreignObject)\b/.test(svg));
    assert.ok(!/(?:href|src)=["']https?:/.test(svg));
    assert.equal(slide.elements, source.elements.filter(e => !e.isDeleted && e.frameId === slide.frameId).length);
    if (source.elements.some(e => !e.isDeleted && e.frameId === slide.frameId && e.fontFamily === 8)) assert.match(svg, /Comic Shanns/);
  }
});

test('unreviewed slide originals and exports cannot enter the Git release', async () => {
  const { execFileSync } = await import('node:child_process');
  const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
  const released = ['slides/sources/Lecture 1.excalidraw', 'slides/sources/Lecture 2.excalidraw'];
  const releasedDecks = ['content/slides/logic-and-ai/deck/', 'content/slides/formal-languages/deck/'];
  const excluded = name => /^slides\/(archive|images|unpublished)\//.test(name)
    || (name.startsWith('slides/sources/') && !released.includes(name))
    || (/^content\/slides\/[^/]+\/deck\//.test(name) && !releasedDecks.some(deck => name.startsWith(deck)));
  assert.deepEqual(tracked.filter(excluded), []);
  for (let n = 3; n <= 12; n++) {
    const manifest = JSON.parse(await readFile(`slides/lecture-${n}.json`));
    assert.equal(manifest.publication, 'unpublished');
    assert.ok(manifest.output.startsWith('slides/unpublished/'));
    for (const file of [`slides/${manifest.source}`, `${manifest.output}/slide-01.svg`, `slides/archive/Lecture ${n}.excalidraw.gz`]) {
      assert.equal(execFileSync('git', ['check-ignore', '--no-index', file], { encoding: 'utf8' }).trim(), file);
    }
  }
  for (const file of ['slides/images/example.png', 'slides/archive/Lecture 1.excalidraw.gz', 'content/slides/valid-inference/deck/slide-01.svg']) {
    assert.equal(execFileSync('git', ['check-ignore', '--no-index', file], { encoding: 'utf8' }).trim(), file);
  }
});

test('presentation metadata supports reordered, added and deleted frames', async () => {
  const { slideEntries, orderedFrames } = await import('../../tools/slides/model.mjs');
  const scene = { type: 'excalidraw', files: {}, elements: [
    { id: 'first', type: 'frame', name: 'First', customData: { courseSlideOrder: 1 } },
    { id: 'second', type: 'frame', name: 'Second', customData: { courseSlideOrder: 0 } },
    { id: 'removed', type: 'frame', isDeleted: true },
    { id: 'native-new', type: 'frame', name: 'Added in canvas' },
  ] };
  const manifest = { slides: [{ frameId: 'first', title: 'First' }, { frameId: 'removed', title: 'Removed' }] };
  assert.deepEqual(slideEntries(scene, manifest).map(s => s.frameId), ['second', 'first', 'native-new']);
  assert.equal(orderedFrames(scene, manifest).length, 3);
});
