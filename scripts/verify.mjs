/* The one place that runs the suite and decides what reaches the terminal.

   A passing run is the common case, and it should cost one line per check. The
   detail still exists — every step's full output is written to tmp/logs/ — but
   nobody, person or agent, needs to read forty lines of "✔ test passed" to
   learn that the tests passed. A failing run prints the failing step's output
   and nothing else, because that is the only part anyone is going to read.

   `--verbose` streams every step live instead, for when the summary is not
   enough. Individual checks stay runnable on their own (`npm run check:site`);
   this runner adds ordering, dependency skipping and the summary, not new
   behaviour. See docs/testing/output.md. */

import { spawn } from 'node:child_process';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const LOG_DIR = path.join('tmp', 'logs');

const argv = process.argv.slice(2);
const has = (...flags) => flags.some(f => argv.includes(f));
const valueOf = name => argv.find(a => a.startsWith(`${name}=`))?.slice(name.length + 1);

const verbose = has('--verbose', '-v') || process.env.VERBOSE === '1';
const withBrowser = has('--browser', '--all');
const only = valueOf('--only')?.split(',').map(s => s.trim()).filter(Boolean);

/* Colour only for a human at a terminal. An agent, a pipe and a CI log all get
   plain text, so nothing pays for escape codes it cannot render. */
const tty = process.stdout.isTTY && !process.env.CI;
const paint = (code, text) => tty ? `\u001b[${code}m${text}\u001b[0m` : text;
const green = t => paint('32', t);
const red = t => paint('31', t);
const yellow = t => paint('33', t);
const dim = t => paint('2', t);

const PASS = green('✓');
const FAIL = red('✗');
const SKIP = yellow('–');

const node = process.execPath;

// Hugo prints a fixed stats block; one line of it is the part worth keeping.
const pagesBuilt = out => out.match(/^Build: (.+)$/m)?.[1];

const steps = [
  {
    name: 'unit',
    title: 'Unit tests',
    rerun: 'npm run test:unit',
    command: async () => {
      const dir = 'tests/unit';
      const found = (await readdir(dir)).filter(f => f.endsWith('.test.mjs')).sort();
      return [node, ['--test', '--test-reporter=dot', ...found.map(f => path.join(dir, f))]];
    },
    // The dot reporter prints one character per test and nothing else.
    summary: out => {
      const dots = (out.match(/[.X]/g) ?? []).length;
      return dots ? `${dots} tests` : '';
    }
  },
  {
    name: 'build',
    title: 'Hugo build',
    rerun: 'npm run build:test',
    command: () => [node, ['scripts/build.mjs']],
    summary: pagesBuilt
  },
  {
    name: 'content',
    title: 'Content conventions',
    rerun: 'npm run check:content',
    command: () => [node, ['scripts/check-content.mjs']]
  },
  {
    name: 'site',
    title: 'Generated site',
    rerun: 'npm run check:site',
    needs: 'build',
    command: () => [node, ['scripts/check-site.mjs']],
    summary: out => out.match(/^Known site findings: (\d+)/m)?.[1]
      ? `${out.match(/^Known site findings: (\d+)/m)[1]} known exceptions`
      : ''
  },
  {
    name: 'docs',
    title: 'Documentation vault',
    rerun: 'npm run check:docs',
    command: () => [node, ['scripts/check-docs.mjs']]
  },
  {
    name: 'markdown',
    title: 'Markdown',
    rerun: 'npm run lint:markdown',
    // The package's own entry point, not npx: npx would try to download
    // markdownlint-cli2 if node_modules were incomplete, turning a missing
    // install into a network call in the middle of a check.
    command: () => [node, ['node_modules/markdownlint-cli2/markdownlint-cli2-bin.mjs']],
    summary: out => {
      const files = out.match(/^Linting: (\d+) files?/m)?.[1];
      return files ? `${files} files` : '';
    }
  },
  {
    name: 'browser',
    title: 'Browser suites',
    rerun: 'npm run test:browser',
    needs: 'build',
    optional: true,          // runs for `npm test`, not for `npm run check`
    command: () => [node, ['scripts/playwright.mjs', 'test', ...(has('--desktop') ? ['--project=desktop'] : [])]],
    summary: out => {
      const parts = [];
      for (const label of ['passed', 'flaky', 'skipped', 'failed']) {
        const n = out.match(new RegExp(`(\\d+) ${label}`))?.[1];
        if (n && n !== '0') parts.push(`${n} ${label}`);
      }
      return parts.join(', ');
    }
  }
];

function selected() {
  const wanted = steps.filter(s => (only ? only.includes(s.name) : !s.optional || withBrowser));
  const unknown = only?.filter(n => !steps.some(s => s.name === n)) ?? [];
  if (unknown.length) {
    console.error(`Unknown check: ${unknown.join(', ')}`);
    console.error(`Available: ${steps.map(s => s.name).join(', ')}`);
    process.exit(2);
  }
  return wanted;
}

function execute(command, args) {
  return new Promise(resolve => {
    const started = Date.now();
    const child = spawn(command, args, {
      stdio: verbose ? 'inherit' : ['ignore', 'pipe', 'pipe'],
      // Captured output is read as text and stored as a log, so strip the
      // escape codes that would otherwise fill both.
      env: { ...process.env, FORCE_COLOR: verbose ? (process.env.FORCE_COLOR ?? '1') : '0' }
    });
    let output = '';
    child.stdout?.on('data', chunk => { output += chunk; });
    child.stderr?.on('data', chunk => { output += chunk; });
    child.on('error', error => resolve({ ok: false, output: `${output}${error.message}\n`, ms: Date.now() - started }));
    child.on('close', (code, signal) => resolve({
      ok: code === 0,
      output,
      ms: Date.now() - started,
      note: signal ? `killed by ${signal}` : code === 0 ? '' : `exit ${code}`
    }));
  });
}

const EXCERPT = 60;

/* Failure output is worth printing in full up to a point; past that it is a
   transcript, and the log file is the better place for it. */
function excerpt(output, logPath) {
  const lines = output.replace(/\s+$/, '').split('\n');
  while (lines.length && /^[\s.·X°±]*$/.test(lines[0])) lines.shift();   // progress marks
  if (lines.length <= EXCERPT) return lines;
  return [dim(`… ${lines.length - EXCERPT} earlier lines in ${logPath}`), ...lines.slice(-EXCERPT)];
}

const duration = ms => ms >= 60_000
  ? `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`
  : ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;

function progress(title) {
  if (tty && !verbose) process.stdout.write(`${dim('⋯')} ${title}`);
}
function clearProgress() {
  if (tty && !verbose) process.stdout.write('\r\u001b[2K');
}

await mkdir(LOG_DIR, { recursive: true });

const chosen = selected();
const started = Date.now();
const results = [];
const failed = new Set();

for (const step of chosen) {
  if (step.needs && failed.has(step.needs)) {
    console.log(`${SKIP} ${step.title.padEnd(22)} ${dim(`skipped — ${step.needs} failed`)}`);
    results.push({ step, state: 'skipped' });
    continue;
  }

  progress(step.title);
  const [command, args] = await step.command();
  const { ok, output, ms, note } = await execute(command, args);
  clearProgress();

  const logPath = path.join(LOG_DIR, `${step.name}.log`);
  if (!verbose) await writeFile(logPath, output);

  if (ok) {
    const detail = step.summary?.(output) ?? '';
    console.log(`${PASS} ${step.title.padEnd(22)} ${detail.padEnd(22)} ${dim(duration(ms))}`);
    results.push({ step, state: 'passed' });
    continue;
  }

  failed.add(step.name);
  results.push({ step, state: 'failed' });
  console.log(`${FAIL} ${step.title.padEnd(22)} ${red(note || 'failed').padEnd(22)} ${dim(duration(ms))}`);
  if (!verbose) {
    console.log('');
    for (const line of excerpt(output, logPath)) console.log(`  ${line}`);
    console.log('');
    console.log(dim(`  full output: ${logPath}`));
    console.log(dim(`  re-run only this check: ${step.rerun}`));
    console.log('');
  }
}

const passed = results.filter(r => r.state === 'passed').length;
const skipped = results.filter(r => r.state === 'skipped').length;
const failures = results.filter(r => r.state === 'failed');

console.log(dim('─'.repeat(56)));
if (!failures.length) {
  const label = passed === 1 ? 'check' : 'checks';
  console.log(`${green('All checks passed')} ${dim(`— ${passed} ${label} in ${duration(Date.now() - started)}`)}`);
} else {
  const tally = [`${passed} passed`, `${failures.length} failed`, skipped ? `${skipped} skipped` : '']
    .filter(Boolean).join(', ');
  console.log(`${red('Checks failed')} ${dim(`— ${tally} in ${duration(Date.now() - started)}`)}`);
  console.log(dim(`Failed: ${failures.map(f => f.step.name).join(', ')}`));
}

process.exit(failures.length ? 1 : 0);
