import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const version = (await readFile('.vale-version', 'utf8')).trim();
const platform = { darwin: 'macOS', linux: 'Linux' }[process.platform];
const arch = { arm64: 'arm64', x64: '64-bit' }[process.arch];
if (!platform || !arch) throw new Error('Use the Vale release page for your platform; see docs/testing.md.');
const name = `vale_${version}_${platform}_${arch}.tar.gz`;
const base = `https://github.com/vale-cli/vale/releases/download/v${version}`;
async function download(name) {
  const response = await fetch(`${base}/${name}`, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`Download ${name}: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}
const [archive, checksums] = await Promise.all([download(name), download(`vale_${version}_checksums.txt`)]);
const expected = checksums.toString().split('\n').find(line => line.trim().endsWith(` ${name}`))?.split(/\s+/)[0];
if (!expected || createHash('sha256').update(archive).digest('hex') !== expected) throw new Error('Vale archive checksum mismatch');
await mkdir('tmp/bin', { recursive: true });
await writeFile('tmp/vale.tar.gz', archive);
execFileSync('tar', ['-xzf', 'tmp/vale.tar.gz', '-C', 'tmp/bin', 'vale'], { stdio: 'inherit' });
execFileSync('tmp/bin/vale', ['--version'], { stdio: 'inherit' });
