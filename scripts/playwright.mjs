import { spawnSync } from 'node:child_process';
import path from 'node:path';
// Keep browser binaries with other ignored test artifacts, on macOS and CI alike.
const result = spawnSync(process.execPath, ['node_modules/@playwright/test/cli.js', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || path.resolve('tmp/playwright-browsers') }
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
