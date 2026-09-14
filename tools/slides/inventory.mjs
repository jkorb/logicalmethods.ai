import fs from 'node:fs/promises';
import path from 'node:path';
import { root, loadDeck, hash, startRuntime, deckIds } from './runtime.mjs';
import { orderedFrames } from './model.mjs';

const imageDir = path.resolve(process.argv[2] || path.join(root, 'tmp/excalidraw_workspace_export/img'));
const files = [];
for (const name of await fs.readdir(imageDir)) {
  const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml' }[path.extname(name).toLowerCase()];
  if (!mime) continue;
  const bytes = await fs.readFile(path.join(imageDir, name));
  files.push({ name, sha256: await hash(bytes), dataURL: `data:${mime};base64,${bytes.toString('base64')}` });
}
const previous = JSON.parse(await fs.readFile(path.join(root, 'slides/image-inventory.json'), 'utf8'));
const reviewed = new Map(previous.images.map(image => [image.fileId, image]));
const records = new Map();
for (const id of await deckIds()) {
  const { scene, manifest } = await loadDeck(id);
  const slides = orderedFrames(scene, manifest);
  for (const [fileId, file] of Object.entries(scene.files)) {
    if (!records.has(fileId)) records.set(fileId, { fileId, mimeType: file.mimeType, sha256: await hash(Buffer.from(file.dataURL.split(',')[1], 'base64')), dataURL: file.dataURL, uses: [], reviewStatus: 'unverified', sourceURL: null, license: null });
    const record = records.get(fileId);
    slides.forEach((s, i) => {
      const ids = scene.elements.filter(e => !e.isDeleted && e.type === 'image' && e.fileId === fileId && e.frameId === s.frameId).map(e => e.id);
      if (ids.length) record.uses.push({ lecture: id, slide: i + 1, title: s.title, elementIds: ids });
    });
  }
}
// Exported embedded images can be recompressed. A thumbnail match is only a
// filename candidate, never evidence of authorship or licensing.
const runtime = await startRuntime();
const browser = await runtime.chromium.launch();
try {
  const page = await browser.newPage(); await page.goto(runtime.url);
  const fingerprints = await page.evaluate(async items => {
    const result = [];
    for (const { key, dataURL } of items) {
      try {
        const image = new Image(); image.src = dataURL; await image.decode();
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 16;
        const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 16, 16); ctx.drawImage(image, 0, 0, 16, 16);
        result.push({ key, aspect: image.naturalWidth / image.naturalHeight, pixels: [...ctx.getImageData(0, 0, 16, 16).data] });
      } catch { /* An unsupported original is recorded without a candidate. */ }
    }
    return result;
  }, [...files.map(f => ({ key: f.name, dataURL: f.dataURL })), ...[...records.values()].map(r => ({ key: r.fileId, dataURL: r.dataURL }))]);
  const byKey = new Map(fingerprints.map(f => [f.key, f]));
  for (const record of records.values()) {
    const exact = files.find(f => f.sha256 === record.sha256);
    if (exact) record.workspaceMatch = { filename: exact.name, method: 'identical bytes' };
    else {
      const target = byKey.get(record.fileId);
      const candidates = files.map(f => {
        const other = byKey.get(f.name);
        if (!target || !other || Math.abs(target.aspect - other.aspect) > .08) return { filename: f.name, error: Infinity };
        return { filename: f.name, error: Math.sqrt(target.pixels.reduce((sum, x, i) => sum + (x - other.pixels[i]) ** 2, 0) / target.pixels.length) };
      }).sort((a, b) => a.error - b.error);
      if (candidates[0]?.error < 12) record.workspaceMatch = { filename: candidates[0].filename, method: 'visual candidate; verify manually', rmsDifference: Number(candidates[0].error.toFixed(2)) };
      else record.workspaceMatch = null;
    }
    const prior = reviewed.get(record.fileId);
    if (prior && prior.sha256 === record.sha256) {
      for (const [key, value] of Object.entries(prior)) if (!['fileId', 'mimeType', 'sha256', 'uses', 'dataURL', 'imagePath'].includes(key)) record[key] = value;
    }
    const extension = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' }[record.mimeType];
    if (!extension) throw Error(`Unsupported image type: ${record.mimeType}`);
    record.imagePath = `slides/images/${record.sha256}.${extension}`;
    await fs.mkdir(path.join(root, 'slides/images'), { recursive: true });
    await fs.writeFile(path.join(root, record.imagePath), Buffer.from(record.dataURL.split(',')[1], 'base64'));
    delete record.dataURL;
  }
  const result = { policy: 'Review image sources and licences before publication; matching a workspace filename does not establish rights. Lecture 1 is cleared: every embedded image without a rights record was removed, and the decision is recorded in slides/lecture-1.json. Lectures 2-12 keep their images visible at the maintainer request and are still unreviewed.', images: [...records.values()] };
  await fs.writeFile(path.join(root, 'slides/image-inventory.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(`${records.size} embedded images inventoried; ${[...records.values()].filter(r => r.workspaceMatch).length} workspace matches/candidates.`);
} finally { await browser.close(); await new Promise(resolve => runtime.server.close(resolve)); }
