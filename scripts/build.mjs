import { readFileSync, rmSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const version = readFileSync('.hugo-version', 'utf8').trim();
const installed = execFileSync('hugo', ['version'], { encoding: 'utf8' });
if (!installed.includes(`v${version} `) && !installed.includes(`v${version}+`)) {
  throw new Error(`Use Hugo ${version} (see .hugo-version). Found: ${installed.trim()}`);
}
// Only this dedicated, ignored output directory is removed.
rmSync('tmp/site', { recursive: true, force: true });
mkdirSync('tmp/site', { recursive: true });
execFileSync('hugo', ['-D', '--panicOnWarning', '--destination', 'tmp/site'], { stdio: 'inherit' });
