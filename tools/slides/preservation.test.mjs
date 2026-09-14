import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { orderedFrames } from './model.mjs';
const digest = data => createHash('sha256').update(data).digest('hex');
for (const n of Array.from({ length: 12 }, (_, i) => i + 1)) {
  test(`Lecture ${n} retains its source data and has a current complete export`, async () => {
    const manifest = JSON.parse(await readFile(`slides/lecture-${n}.json`));
    const original = gunzipSync(await readFile(`slides/archive/Lecture ${n}.excalidraw.gz`));
    assert.equal(digest(original), manifest.originalSha256);
    const raw = await readFile(`slides/${manifest.source}`);
    const source = JSON.parse(raw);
    if (n > 1) {
      assert.equal(manifest.publication, "unpublished");
      assert.ok(manifest.output.startsWith("slides/unpublished/"));
    }
    const baseline = JSON.parse(original);
    for (const element of baseline.elements) assert.ok(source.elements.some(e => e.id === element.id), `Lost original element ${element.id}`);
    // Images may only leave a source through a recorded rights decision, which
    // has to name a real original and actually drop its bytes.
    const removed = manifest.removedImages ?? { fileIds: [] };
    if (removed.fileIds.length) assert.ok(removed.reason && removed.reviewed, 'Removed images need a reason and a review date');
    for (const id of removed.fileIds) {
      assert.ok(id in baseline.files, `Removal lists an unknown image ${id}`);
      assert.equal(source.files[id], undefined, `Removed image ${id} is still embedded`);
    }
    for (const [id, file] of Object.entries(baseline.files)) {
      if (removed.fileIds.includes(id)) continue;
      assert.deepEqual(source.files[id], file, `Lost original image ${id}`);
    }
    const ordered = orderedFrames(source, manifest);
    const exported = JSON.parse(await readFile(`${manifest.output}/index.json`));
    assert.equal(exported.sourceSha256, digest(raw), 'Scene changed: run npm run slides:render');
    assert.deepEqual(exported.slides.map(s => s.frameId), ordered.map(s => s.frame.id));
    assert.deepEqual(exported.slides.map(s => s.title), ordered.map(s => s.title));
    for (const slide of exported.slides) {
      const svg = await readFile(`${manifest.output}/${slide.file}`, 'utf8');
      assert.equal(digest(svg), slide.sha256);
      assert.ok(!svg.includes('<script'));
      assert.ok(!svg.includes('<foreignObject'));
      assert.equal(slide.elements, source.elements.filter(e => !e.isDeleted && e.frameId === slide.frameId).length);
      // Only a slide that still shows mathematical notation needs the font.
      if (source.elements.some(e => !e.isDeleted && e.frameId === slide.frameId && e.fontFamily === 8)) assert.match(svg, /Comic Shanns/);
    }
  });
}
