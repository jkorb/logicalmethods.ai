import { readFileSync, rmSync, mkdirSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { matchesHugoVersion } from './hugo-version.mjs';

const version = readFileSync('.hugo-version', 'utf8').trim();
const installed = execFileSync('hugo', ['version'], { encoding: 'utf8' });
if (!matchesHugoVersion(installed, version)) {
  throw new Error(`Use Hugo ${version} (see .hugo-version). Found: ${installed.trim()}`);
}
// Only these dedicated, ignored output directories are removed.
for (const dir of ['tmp/site', 'tmp/fixture-site']) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

/* A successful build has one fact worth printing: it built, and how much. Hugo's
   stats table says the same thing in fifteen lines, so it is captured and kept
   for a failure, where every line of it matters. `--panicOnWarning` means a
   warning already exits non-zero, so nothing diagnostic is being swallowed. */
const verbose = process.argv.includes('--verbose') || process.env.VERBOSE === '1';
const hugo = args => {
  const result = spawnSync('hugo', ['-D', '--panicOnWarning', ...args], {
    encoding: 'utf8',
    stdio: verbose ? 'inherit' : ['ignore', 'pipe', 'pipe']
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (!verbose) process.stderr.write(`${result.stdout ?? ''}${result.stderr ?? ''}`);
    process.exit(result.status ?? 1);
  }
  return result;
};

// tmp/site is what CI deploys. The fixture site adds a sample Reveal.js deck
// for tests/browser/slides-reveal.spec.mjs, and is never deployed.
const build = hugo(['--destination', 'tmp/site']);
hugo(['--config', 'hugo.toml,hugo.reveal-fixture.toml', '--destination', 'tmp/fixture-site']);
if (!verbose) {
  const out = build.stdout ?? '';
  const pages = out.match(/^\s*Pages\s*│\s*(\d+)/m)?.[1];
  const ms = out.match(/^Total in (\d+) ms/m)?.[1];
  console.log(`Build: ${pages ?? '?'} pages${ms ? ` in ${ms} ms` : ''}`);
}
