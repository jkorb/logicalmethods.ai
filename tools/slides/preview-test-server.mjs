import { spawnSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { root } from './runtime.mjs';
const directory = path.join(root, 'tmp/slides-preview-build');
const build = spawnSync('hugo', ['-D', '--config', 'hugo.toml,hugo.slides-preview.toml', '--destination', directory], { cwd: root, stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status || 1);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff' };
http.createServer(async (req, res) => {
  try {
    let name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (name.endsWith('/')) name += 'index.html';
    const file = path.resolve(directory, '.' + name);
    if (!file.startsWith(directory + path.sep)) throw Error('Outside preview');
    const data = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4186, '127.0.0.1');
