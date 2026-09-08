import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { files } from './lib.mjs';
import { proseText } from './prose-text.mjs';
const version = (await readFile('.vale-version', 'utf8')).trim();
const bin = process.env.VALE_BIN || 'vale';
const installed = spawnSync(bin, ['--version'], { encoding: 'utf8' });
if (installed.error || installed.status !== 0 || !installed.stdout.includes(` ${version}`)) {
  console.error(`Install Vale ${version} (see docs/testing.md), or set VALE_BIN to its executable.`);
  process.exit(1);
}
const paths = process.argv.slice(2);
const inputs = paths.length ? paths : [...await files('content'), ...await files('docs'), 'README.md', 'AGENTS.md'];
await rm('tmp/prose', { recursive: true, force: true });
for (const file of inputs.filter(f => f.endsWith('.md'))) {
  if (path.isAbsolute(file) || file.split(/[\\/]/).includes('..')) throw new Error('Use repository-relative Markdown paths');
  const out = path.join('tmp/prose', file);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, proseText(await readFile(file, 'utf8'), file.startsWith('content/')));
}
const result = spawnSync(bin, ['--config=.vale.ini', '--no-exit', '--output=JSON', 'tmp/prose'], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
if (result.error || result.status !== 0) {
  console.error(result.error || result.stderr || result.stdout); process.exit(1);
}
const report = JSON.parse(result.stdout || '{}');
await writeFile('tmp/prose-report.json', JSON.stringify(report, null, 2) + '\n');
let count = 0;
for (const [file, findings] of Object.entries(report)) for (const finding of findings) {
  console.log(`${file.replace(/^tmp\/prose\//, '')}:${finding.Line}:${finding.Span[0]} ${finding.Check}: ${finding.Message}`); count++;
}
console.log(`Prose: ${count} advisory finding(s). Report: tmp/prose-report.json`);
