import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

export const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(import.meta.url);
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(root, 'tmp/playwright-browsers');
export const slidesDir = path.resolve(process.env.SLIDES_DATA_DIR || path.join(root, 'slides'));
export const hash = async data => (await import('node:crypto')).createHash('sha256').update(data).digest('hex');
export async function deckIds() {
  const names = (await fs.readdir(slidesDir)).filter(name => /^lecture-\d+\.json$/.test(name));
  const available = [];
  for (const name of names) {
    const manifest = JSON.parse(await fs.readFile(path.join(slidesDir, name), 'utf8'));
    try { await fs.access(path.join(slidesDir, manifest.source)); }
    catch (error) { if (error.code === 'ENOENT' && manifest.publication === 'unpublished') continue; throw error; }
    available.push(name.slice(0, -5));
  }
  return available.sort((a, b) => Number(a.slice(8)) - Number(b.slice(8)));
}
export async function loadDeck(id) {
  if (!/^lecture-\d+$/.test(id)) throw new Error('Invalid deck ID');
  const manifest = JSON.parse(await fs.readFile(path.join(slidesDir, `${id}.json`), 'utf8'));
  const source = path.resolve(slidesDir, manifest.source);
  if (!source.startsWith(path.join(slidesDir, 'sources/'))) throw new Error('Source outside slides/sources');
  const raw = await fs.readFile(source, 'utf8');
  return { manifest, source, raw, scene: JSON.parse(raw), revision: await hash(raw) };
}

export async function startRuntime({ editor = false, port = 0, handler } = {}) {
  const esbuild = require('esbuild');
  const packageEntry = require.resolve('@excalidraw/excalidraw');
  const dist = path.dirname(packageEntry);
  // Each process owns its bundle: tests/rendering must not change a running editor.
  await fs.mkdir(path.join(root, 'tmp/slides-runtime'), { recursive: true });
  const work = await fs.mkdtemp(path.join(root, 'tmp/slides-runtime', editor ? 'editor-' : 'export-'));
  let adaptedFonts = false;
  await esbuild.build({
    entryPoints: [path.join(root, 'tools/slides', editor ? 'editor.jsx' : 'export.js')],
    bundle: true, outdir: work, entryNames: editor ? 'editor' : 'export',
    format: 'esm', splitting: true, logLevel: 'warning', conditions: ['development'],
    loader: { '.woff2': 'file' },
    define: { 'process.env.NODE_ENV': '"production"' },
    // Excalidraw 0.18.1 has no public font registry API. Adapt its bundled
    // descriptor at build time, leaving node_modules unchanged. One full-range
    // font is essential: its shipped subsets don't cover the course symbols.
    plugins: [{ name: 'course-math-font', setup(build) {
      build.onLoad({ filter: /chunk-.*\.js$/ }, async args => {
        if (!args.path.includes('/@excalidraw/excalidraw/')) return;
        let contents = await fs.readFile(args.path, 'utf8');
        if (!contents.includes('var ComicShannsFontFaces = [')) return;
        const expression = /var ComicShannsFontFaces = \[[\s\S]*?\n\];/;
        if (!expression.test(contents)) throw new Error('Excalidraw font adapter needs review');
        contents = contents.replace(expression, 'var ComicShannsFontFaces = [{uri: "./fonts/course-math.woff2"}];');
        const fallback = 'urls.push(new URL(assetUrl, _ExcalidrawFontFace.ASSETS_FALLBACK_URL));';
        if (!contents.includes(fallback)) throw new Error('Excalidraw local-font adapter needs review');
        contents = contents.replace(fallback, '/* All fonts are served locally; no CDN fallback. */');
        adaptedFonts = true;
        return { contents, loader: 'js' };
      });
    } }],
  });
  if (!adaptedFonts) throw new Error('Excalidraw font adapter was not applied; review the pinned dependency before continuing.');
  const types = { '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.json': 'application/json' };
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      if (handler && await handler(req, res, url)) return;
      if (req.method !== 'GET') { res.writeHead(405); return res.end(); }
      if (url.pathname === '/') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Security-Policy', "default-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self'; frame-src 'none'");
        return res.end(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Logical methods — local slide editor</title>${editor ? '<link rel="stylesheet" href="/editor.css">' : ''}<body><div id="root"></div><script>window.EXCALIDRAW_ASSET_PATH="/excalidraw/";</script><script type="module" src="/${editor ? 'editor' : 'export'}.js"></script></body></html>`);
      }
      let base = work;
      let relative = decodeURIComponent(url.pathname.slice(1));
      if (url.pathname.startsWith('/excalidraw/')) { base = dist; relative = relative.slice('excalidraw/'.length); }
      if (url.pathname === '/excalidraw/fonts/course-math.woff2') {
        base = path.join(root, 'assets/fonts/ComicShanns'); relative = 'comic-shanns-logic.woff2';
      }
      const file = path.resolve(base, relative);
      if (!file.startsWith(base + path.sep)) { res.writeHead(403); return res.end(); }
      const data = await fs.readFile(file);
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    } catch (error) { res.writeHead(error.code === 'ENOENT' ? 404 : 500); res.end(error.message); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return { server, url: `http://127.0.0.1:${server.address().port}`, chromium: require('playwright').chromium };
}
