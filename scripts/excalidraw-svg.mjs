#!/usr/bin/env node
/*
 * Excalidraw -> SVG
 * -----------------
 * Renders figures from .excalidraw sources so the book can stop carrying PNG
 * screenshots. Vector figures scale, print, stay legible in dark mode, and diff
 * as text.
 *
 *   node scripts/excalidraw-svg.mjs <source.excalidraw> <output-dir> [--frames]
 *
 * With --frames, every *named* frame in the scene is exported as
 * <frame-name>.svg. Name a frame after the figure you want and it becomes that
 * file. Without --frames, the whole scene is exported as one SVG named after
 * the source file.
 *
 * This is an authoring tool, not part of the build or the test run. It needs
 * two heavy packages that are deliberately not repo dependencies:
 *
 *   npm i --no-save @excalidraw/excalidraw react react-dom esbuild playwright
 *
 * See docs/authoring.md, "Figures".
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const [src, outDir, ...flags] = process.argv.slice(2);
const BY_FRAME = flags.includes('--frames');

if (!src || !outDir) {
  console.error('usage: node scripts/excalidraw-svg.mjs <source.excalidraw> <output-dir> [--frames]');
  process.exit(1);
}
for (const dep of ['@excalidraw/excalidraw', 'esbuild', 'playwright']) {
  try { require.resolve(dep); }
  catch {
    console.error(`Missing ${dep}. Install the authoring tools first:\n` +
      '  npm i --no-save @excalidraw/excalidraw react react-dom esbuild playwright');
    process.exit(1);
  }
}
const { chromium } = require('playwright');
const esbuild = require('esbuild');

const scene = JSON.parse(fs.readFileSync(src, 'utf8'));
const all = scene.elements.filter(e => !e.isDeleted);
fs.mkdirSync(outDir, { recursive: true });

// Excalidraw's exporter needs a DOM, so it is bundled and driven in a browser.
const work = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'exc-'));
// resolve the package absolutely: the entry lives in a temp dir, so esbuild
// cannot find it by name from there
const excalidrawEntry = require.resolve('@excalidraw/excalidraw');
fs.writeFileSync(path.join(work, 'entry.js'),
  `import { exportToSvg } from ${JSON.stringify(excalidrawEntry)}; window.exportToSvg = exportToSvg;`);
esbuild.buildSync({
  entryPoints: [path.join(work, 'entry.js')],
  bundle: true, outfile: path.join(work, 'bundle.js'), format: 'iife', logLevel: 'error',
  absWorkingDir: path.dirname(excalidrawEntry),
  nodePaths: (process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean),
  define: { 'process.env.NODE_ENV': '"production"' },
});
fs.writeFileSync(path.join(work, 'page.html'),
  '<!doctype html><meta charset="utf-8"><body><script src="bundle.js"></script>');

const server = http.createServer((req, res) => {
  const f = path.join(work, req.url === '/' ? 'page.html' : decodeURIComponent(req.url));
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': f.endsWith('.js') ? 'text/javascript' : 'text/html' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

/* Post-processing. The exporter embeds the whole Excalifont as a data URI and
   writes six decimal places; the site already serves the font, and one decimal
   is past the limit of what the drawing encodes. */
function tidy(svg, title) {
  return svg
    .replace(/<style class="style-fonts">[\s\S]*?<\/style>/g, '')
    .replace(/<!-- svg-source:excalidraw -->|<metadata>\s*<\/metadata>/g, '')
    .replace(/\s(?:width|height)="[\d.]+"/g, '')
    .replace(/<svg /, '<svg class="figure-svg" role="img" ')
    .replace(/(<svg[^>]*>)/, `$1<title>${title.replace(/[<&]/g, '')}</title>`)
    .replace(/>\s+</g, '><')
    .replace(/-?\d+\.\d+/g, m => (+m).toFixed(1).replace(/\.0$/, ''))
    .trim();
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });

const jobs = [];
if (BY_FRAME) {
  const frames = all.filter(e => e.type === 'frame' && e.name);
  if (!frames.length) {
    console.error('No named frames in this scene. Name your frames in Excalidraw, ' +
                  'or drop --frames to export the whole scene.');
    await browser.close(); server.close(); process.exit(1);
  }
  for (const f of frames) {
    // export the frame's contents, not the frame itself: including the frame
    // element makes the exporter clip everything to it and emit a blank box
    const members = all.filter(e => e.frameId === f.id).map(e => ({ ...e, frameId: null }));
    jobs.push({ name: f.name.trim().replace(/[^\w.-]+/g, '_').toLowerCase(), els: members, title: f.name.trim() });
  }
} else {
  jobs.push({ name: path.basename(src, '.excalidraw').replace(/[^\w.-]+/g, '_').toLowerCase(),
              els: all, title: path.basename(src, '.excalidraw') });
}

for (const job of jobs) {
  if (!job.els.length) { console.log(`${job.name}: empty, skipped`); continue; }
  const svg = await page.evaluate(async ({ els, files }) => (await window.exportToSvg({
    elements: els,
    appState: { exportBackground: false, exportWithDarkMode: false, exportEmbedScene: false, exportPadding: 8 },
    files: files || {},
  })).outerHTML, { els: job.els, files: scene.files || {} });
  const out = path.join(outDir, `${job.name}.svg`);
  fs.writeFileSync(out, tidy(svg, job.title));
  console.log(`${job.name.padEnd(28)} ${job.els.length.toString().padStart(4)} elements  ` +
              `${(fs.statSync(out).size / 1024).toFixed(0)}KB  ${path.relative(process.cwd(), out)}`);
}

await browser.close();
server.close();
fs.rmSync(work, { recursive: true, force: true });
