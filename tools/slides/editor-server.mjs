import fs from 'node:fs/promises';
import path from 'node:path';
import { startRuntime, loadDeck, root, hash, slidesDir, deckIds } from './runtime.mjs';
import { mergeScene, validateScene } from './model.mjs';

const saving = new Set();
const port = Number(process.env.SLIDES_PORT || 4174);
const runtime = await startRuntime({ editor: true, port, handler: async (req, res, url) => {
  if (!url.pathname.startsWith('/api/')) return false;
  const reply = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); };
  try {
    if (url.pathname === '/api/stop') {
      if (req.method !== 'POST') { reply(405, { error: 'Method not allowed' }); return true; }
      if (![ `http://127.0.0.1:${port}`, `http://localhost:${port}` ].includes(req.headers.origin)) { reply(403, { error: 'Stop must come from the local editor.' }); return true; }
      if (saving.size) { reply(409, { error: 'A save is in progress. Wait for it to finish before stopping.' }); return true; }
      reply(200, { stopped: true });
      runtime.server.close(() => { console.log('Editor stopped. No rendering was run.'); });
      runtime.server.closeIdleConnections();
      return true;
    }
    if (url.pathname === '/api/decks' && req.method === 'GET') {
      const names = await deckIds();
      const decks = await Promise.all(names.map(async n => { const { manifest } = await loadDeck(n); return { id: manifest.id, title: manifest.title }; }));
      reply(200, decks); return true;
    }
    if (url.pathname === '/api/library') {
      const file = path.join(slidesDir, 'library.excalidrawlib');
      if (req.method === 'GET') {
        let raw;
        try { raw = await fs.readFile(file, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; raw = JSON.stringify({ type: 'excalidrawlib', version: 2, libraryItems: [] }); }
        reply(200, { library: JSON.parse(raw), revision: await hash(raw) }); return true;
      }
      if (req.method !== 'PUT') { reply(405, { error: 'Method not allowed' }); return true; }
      if (![ `http://127.0.0.1:${port}`, `http://localhost:${port}` ].includes(req.headers.origin)) { reply(403, { error: 'Saves must come from the local editor.' }); return true; }
      if (saving.has('library')) { reply(409, { error: 'Library save in progress.' }); return true; }
      saving.add('library');
      try {
        const chunks = []; let bytes = 0;
        for await (const chunk of req) { bytes += chunk.length; if (bytes > 40 * 1024 * 1024) throw Error('Library exceeds 40 MB'); chunks.push(chunk); }
        const update = JSON.parse(Buffer.concat(chunks).toString());
        const raw = await fs.readFile(file, 'utf8');
        if (update.revision !== await hash(raw)) { reply(409, { error: 'Library changed on disk. Download your library before reloading.' }); return true; }
        const library = update.library;
        if (library?.type !== 'excalidrawlib' || library.version !== 2 || !Array.isArray(library.libraryItems) || library.libraryItems.some(item => !item.id || !Array.isArray(item.elements)) || new Set(library.libraryItems.map(i => i.id)).size !== library.libraryItems.length) throw Error('Invalid Excalidraw library');
        const backupDir = path.join(root, 'tmp/slides-backups/library');
        await fs.mkdir(backupDir, { recursive: true });
        await fs.writeFile(path.join(backupDir, `${Date.now()}.excalidrawlib`), raw, { flag: 'wx' });
        const next = JSON.stringify(library, null, 2) + '\n';
        await fs.writeFile(file + '.saving', next); await fs.rename(file + '.saving', file);
        reply(200, { revision: await hash(next) });
      } finally { saving.delete('library'); }
      return true;
    }
    const match = url.pathname.match(/^\/api\/decks\/(lecture-\d+)$/);
    if (!match) { reply(404, { error: 'Unknown deck' }); return true; }
    const id = match[1];
    if (req.method === 'GET') {
      const { scene, revision, manifest } = await loadDeck(id);
      reply(200, { scene, revision, manifest }); return true;
    }
    if (req.method !== 'PUT') { reply(405, { error: 'Method not allowed' }); return true; }
    if (req.headers.origin !== `http://127.0.0.1:${port}` && req.headers.origin !== `http://localhost:${port}`) {
      reply(403, { error: 'Saves must come from the local editor.' }); return true;
    }
    if (saving.has(id)) { reply(409, { error: 'A save is already in progress. Try again.' }); return true; }
    saving.add(id);
    try {
      let body = ''; let bytes = 0;
      for await (const chunk of req) {
        bytes += chunk.length;
        if (bytes > 40 * 1024 * 1024) throw new Error('Scene exceeds the 40 MB save limit');
        body += chunk;
      }
      const update = JSON.parse(body);
      const current = await loadDeck(id);
      if (update.revision !== current.revision) { reply(409, { error: 'The source changed on disk. Download your edits before reloading to avoid overwriting someone else’s work.' }); return true; }
      const merged = mergeScene(current.scene, update.scene);
      validateScene(merged);
      const backupDir = path.join(root, 'tmp/slides-backups', id);
      await fs.mkdir(backupDir, { recursive: true });
      const backup = path.join(backupDir, `${Date.now()}-${current.revision.slice(0, 12)}.excalidraw`);
      await fs.writeFile(backup, current.raw, { flag: 'wx' });
      const raw = JSON.stringify(merged, null, 2) + '\n';
      const temporary = current.source + '.saving';
      await fs.writeFile(temporary, raw);
      await fs.rename(temporary, current.source);
      reply(200, { revision: await hash(raw), backup: path.relative(root, backup) });
    } finally { saving.delete(id); }
  } catch (error) { reply(error.code === 'ENOENT' ? 404 : 400, { error: error.message }); }
  return true;
} });
console.log(`Local Excalidraw editor: ${runtime.url}`);
console.log('Save writes slides/sources; every save first backs up to tmp/slides-backups.');
console.log('Stop with Ctrl+C or the Stop editor button. Stopping never renders.');
console.log('To update the website separately, run npm run slides:render.');
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
  runtime.server.close(() => { console.log('Editor stopped. No rendering was run.'); });
  runtime.server.closeIdleConnections();
});
