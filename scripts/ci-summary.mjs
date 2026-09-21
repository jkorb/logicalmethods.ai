/* Turns the Playwright JSON report into the short account of a CI run that a
   person or an agent actually reads: what failed, what only passed on a retry,
   and where the artifacts are. Without it, understanding a red run means
   downloading the HTML report or scrolling a log; with it, the answer is on the
   run's summary page, and `gh run view` prints it.

   Writes GitHub's job summary when $GITHUB_STEP_SUMMARY is set, and the same
   text to stdout otherwise, so it is testable locally:

       CI=1 npm run test:browser ; npm run report:ci

   Never fails the job: the tests decide that. See docs/testing/github-actions.md. */

import { readFile, appendFile } from 'node:fs/promises';

const REPORT = 'tmp/playwright-results.json';

const report = await readFile(REPORT, 'utf8').then(JSON.parse).catch(() => null);
if (!report) {
  console.log(`No browser report at ${REPORT}; nothing to summarise.`);
  process.exit(0);
}

/* The JSON report nests suites by file and by project, so flatten to the one
   thing worth reporting: a test, its outcome, and where it lives. */
function* walk(suites, file = '') {
  for (const suite of suites ?? []) {
    const where = suite.file ?? file;
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        yield {
          title: spec.title,
          file: where,
          line: spec.line,
          project: test.projectName ?? '',
          status: test.status,                       // expected | unexpected | flaky | skipped
          attempts: test.results?.length ?? 0,
          error: test.results?.at(-1)?.error?.message ?? test.results?.find(r => r.error)?.error?.message ?? ''
        };
      }
    }
    yield* walk(suite.suites, where);
  }
}

const tests = [...walk(report.suites)];
const failed = tests.filter(t => t.status === 'unexpected');
const flaky = tests.filter(t => t.status === 'flaky');
const skipped = tests.filter(t => t.status === 'skipped');
const passed = tests.filter(t => t.status === 'expected');

const seconds = ms => `${(ms / 1000).toFixed(1)}s`;
const where = t => `${t.file}:${t.line}${t.project ? ` · ${t.project}` : ''}`;
// A Playwright message carries the code frame and ANSI codes; the first line is
// the assertion, which is the part that belongs in a summary.
const firstLine = text => text.replace(/\u001b\[[0-9;]*m/g, '').split('\n').find(l => l.trim()) ?? '';

const lines = [];
lines.push('## Browser suites');
lines.push('');

const tally = [
  `**${passed.length}** passed`,
  failed.length ? `**${failed.length}** failed` : '',
  flaky.length ? `**${flaky.length}** flaky` : '',
  skipped.length ? `${skipped.length} skipped` : ''
].filter(Boolean).join(' · ');
lines.push(`${failed.length ? '❌' : flaky.length ? '⚠️' : '✅'} ${tally} — ${seconds(report.stats?.duration ?? 0)}`);
lines.push('');

if (failed.length) {
  lines.push('### Failed');
  lines.push('');
  for (const t of failed) {
    lines.push(`- **${t.title}**  \`${where(t)}\``);
    if (t.error) lines.push(`  <br><sub>${firstLine(t.error).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</sub>`);
  }
  lines.push('');
}

if (flaky.length) {
  lines.push('### Flaky — passed on a retry');
  lines.push('');
  lines.push('CI retries once so a stalled runner cannot fail a deploy. A test listed here');
  lines.push('still needs fixing: it depends on how fast the machine was, not on the site.');
  // A job summary is rendered outside the repository tree, where a relative
  // link does not resolve; name the note instead of linking to it.
  lines.push('See `docs/testing/ci-parity.md`.');
  lines.push('');
  for (const t of flaky) lines.push(`- **${t.title}**  \`${where(t)}\` — passed on attempt ${t.attempts}`);
  lines.push('');
}

if (failed.length || flaky.length) {
  lines.push('Traces and failure screenshots are in the **browser-diagnostics** artifact.');
  lines.push('');
}

const summary = lines.join('\n');

if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
else console.log(summary);

/* Flaky tests are not annotated by Playwright's github reporter as warnings the
   job surfaces at the top, so raise them here. Failures already carry file and
   line annotations from that reporter. */
if (process.env.GITHUB_ACTIONS) {
  for (const t of flaky) {
    console.log(`::warning file=${t.file},line=${t.line},title=Flaky test::${t.title} (${t.project}) passed only on attempt ${t.attempts}`);
  }
}
