import { readFileSync, rmSync, mkdirSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { matchesHugoVersion } from './hugo-version.mjs';

const version = readFileSync('.hugo-version', 'utf8').trim();
const installed = execFileSync('hugo', ['version'], { encoding: 'utf8' });
if (!matchesHugoVersion(installed, version)) {
  throw new Error(`Use Hugo ${version} (see .hugo-version). Found: ${installed.trim()}`);
}
// Only this dedicated, ignored output directory is removed.
rmSync('tmp/site', { recursive: true, force: true });
mkdirSync('tmp/site', { recursive: true });

/* A successful build has one fact worth printing: it built, and how much. Hugo's
   stats table says the same thing in fifteen lines, so it is captured and kept
   for a failure, where every line of it matters. `--panicOnWarning` means a
   warning already exits non-zero, so nothing diagnostic is being swallowed. */
const verbose = process.argv.includes('--verbose') || process.env.VERBOSE === '1';
const build = spawnSync('hugo', ['-D', '--panicOnWarning', '--destination', 'tmp/site'], {
  encoding: 'utf8',
  stdio: verbose ? 'inherit' : ['ignore', 'pipe', 'pipe']
});

if (build.error) throw build.error;
if (build.status !== 0) {
  if (!verbose) process.stderr.write(`${build.stdout ?? ''}${build.stderr ?? ''}`);
  process.exit(build.status ?? 1);
}
if (!verbose) {
  const out = build.stdout ?? '';
  const pages = out.match(/^\s*Pages\s*│\s*(\d+)/m)?.[1];
  const ms = out.match(/^Total in (\d+) ms/m)?.[1];
  console.log(`Build: ${pages ?? '?'} pages${ms ? ` in ${ms} ms` : ''}`);
}
