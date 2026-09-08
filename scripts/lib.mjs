import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';

export const siteDir = path.resolve('tmp/site');
export const origin = 'https://logicalmethods.ai';
export async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? files(path.join(dir, e.name)) : path.join(dir, e.name)))).flat().sort();
}
export function pageURL(file, root = siteDir) {
  return new URL('/' + path.relative(root, file).split(path.sep).map(encodeURIComponent).join('/').replace(/index\.html$/, ''), origin);
}
export function internal(url) {
  return ['http:', 'https:'].includes(url.protocol) && ['logicalmethods.ai', 'www.logicalmethods.ai', '127.0.0.1', 'localhost'].includes(url.hostname);
}
export async function targetFile(url, root = siteDir) {
  const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  if (file !== root && !file.startsWith(root + path.sep)) return null;
  try { return (await stat(file)).isDirectory() ? ((await stat(path.join(file, 'index.html'))).isFile() ? path.join(file, 'index.html') : null) : file; }
  catch { return null; }
}
export async function documents(root = siteDir) {
  const docs = new Map();
  for (const file of (await files(root)).filter(f => f.endsWith('.html'))) {
    const html = await readFile(file, 'utf8');
    docs.set(file, { html, $: load(html), url: pageURL(file, root) });
  }
  if (!docs.size) throw new Error('No generated HTML found. Run npm run build:test first.');
  return docs;
}
export function references($) {
  const refs = [];
  $('a[href], link[href], script[src], img[src], iframe[src], source[src], video[src], audio[src], video[poster]').each((_, el) => {
    for (const attr of ['href', 'src', 'poster']) if (el.attribs[attr]) refs.push(el.attribs[attr]);
  });
  // Commas in data URLs are not srcset separators; embedded data requires no file lookup.
  $('[srcset]').each((_, el) => {
    if (!el.attribs.srcset.includes('data:')) refs.push(...el.attribs.srcset.split(',').map(s => s.trim().split(/\s+/)[0]));
  });
  $('[style]').each((_, el) => refs.push(...cssReferences(el.attribs.style)));
  $('style').each((_, el) => refs.push(...cssReferences($(el).text())));
  return refs;
}
export function cssReferences(css) {
  return [...css.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)|@import\s+['"]([^'"]+)['"]/g)].map(m => m[1] || m[2]);
}
export function finish(errors, label) {
  if (errors.length) { console.error(errors.join('\n')); console.error(`${label}: ${errors.length} failure(s)`); process.exitCode = 1; }
  else console.log(`${label}: passed`);
}
