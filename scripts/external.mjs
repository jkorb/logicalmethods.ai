import { writeFile } from 'node:fs/promises';
import { documents, references, internal } from './lib.mjs';
const urls = new Map();
for (const [file, { $, url: base }] of await documents()) for (const ref of references($)) {
  const url = new URL(ref, base);
  if (!['http:', 'https:'].includes(url.protocol) || internal(url)) continue;
  url.hash = '';
  if (!urls.has(url.href)) urls.set(url.href, new Set());
  urls.get(url.href).add(file);
}
const queue = [...urls.keys()];
const findings = [];
async function request(url, method) {
  const response = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(12000), headers: { 'User-Agent': 'logicalmethods.ai-link-check/1.0' } });
  await response.body?.cancel();
  return response.status;
}
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const url = queue.shift();
    try {
      let status = await request(url, 'HEAD');
      if (status >= 400) status = await request(url, 'GET');
      if (status >= 400) findings.push({ url, status, sources: [...urls.get(url)] });
    } catch (error) { findings.push({ url, error: error.message, sources: [...urls.get(url)] }); }
  }
}));
findings.sort((a, b) => a.url.localeCompare(b.url));
await writeFile('tmp/external-report.json', JSON.stringify(findings, null, 2) + '\n');
for (const finding of findings) console.log(`${finding.status || finding.error}: ${finding.url}`);
console.log(`External links: checked ${urls.size}; ${findings.length} advisory finding(s). See tmp/external-report.json. HTTP reachability does not validate remote fragments or embedded slide content.`);
