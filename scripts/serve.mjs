import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { targetFile, siteDir } from './lib.mjs';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.pdf': 'application/pdf' };
// The deployed site, or with --fixture the fixture site that adds the sample
// Reveal.js deck (see scripts/build.mjs). Each is its own Playwright web server.
const [port, root] = process.argv.includes('--fixture') ? [4174, path.resolve('tmp/fixture-site')] : [4173, siteDir];
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    const file = await targetFile(url, root);
    if (!file) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(400); res.end('Bad request'); }
}).listen(port, '127.0.0.1', () => console.log(`Test site: http://127.0.0.1:${port}`));
