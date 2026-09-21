# Matching CI locally

**Machine speed is not under test.** A check that passes on a developer laptop
and fails on a shared GitHub runner has reported on the runner, not on the site.
Everything below exists so that the suite answers "is the site correct", never
"how fast was the machine today".

Use the published URL spelling in browser tests: Hugo emits `/textbook/fol/`
even though the source bundle is named `FOL`. The test server and link checker
require exact path case on macOS as well as Linux, and page audits assert HTTP
200 before checking accessibility or layout. This prevents a missing page from
passing a reflow check or appearing as an unrelated accessibility failure.

## Timing budgets

[`tests/browser/budget.mjs`](../../tests/browser/budget.mjs) holds one number:
how much slower a GitHub runner is than the laptop the suite was written on. It
measured about three times slower, under two workers and a cold page cache, so
`SLOW` is 3 under CI and 1 everywhere else.

Every timeout is written at laptop speed and scaled through `budget(ms)`:

| Budget | Local | CI |
| --- | --- | --- |
| Per test | 30 s | 90 s |
| `expect` assertion | 5 s | 15 s |
| Action (click, fill) | 10 s | 30 s |
| Navigation | 30 s | 90 s |
| Test server startup | 60 s | 180 s |

A budget is a ceiling, not a delay. Raising it costs nothing on a run that
passes and only changes how long a genuine hang takes to report. `test.slow()`
multiplies the per-test budget by three, so the reasoning-practice scenario —
twelve cases, review, restart and an accessibility audit — gets 90 s locally and
270 s on CI.

A test that needs its own ceiling imports `budget` rather than writing a number:

```js
import { budget } from './budget.mjs';
test.setTimeout(budget(120000));      // 120 s here, 360 s on a runner
```

## Never wait for a duration

Scaling budgets stops a slow runner from failing a correct test. It does not fix
a test that waits a fixed number of milliseconds for something to happen, which
fails whenever the machine needs one millisecond longer. **Wait for the
condition, not for the clock.** `waitForTimeout` does not appear anywhere in
`tests/browser/`, and should not be added.

Two examples of the replacement, both from real fixes:

```js
// Not this: the theme repaints in about 120 ms on a laptop.
await toggle.click();
await page.waitForTimeout(120);

// This: the toggle records its mode synchronously in #theme-state.
await toggle.click();
await expect(page.locator('#theme-state')).toHaveText('dark');
```

```js
// Not this: celebrate.js removes the burst on a 1200 ms timer.
await page.waitForTimeout(1300);

// This: wait for the burst to actually be gone.
await expect(app.locator('.logic-app__confetti')).toHaveCount(0);
```

Playwright's web-first assertions (`expect(locator)`, `expect.poll`) retry until
the assertion holds or the budget runs out, so they are already the right tool.
A plain `expect(await ...)` reads the page once and cannot wait; prefer the
locator form wherever the value can change.

## Geometry during scrolling

Measure related element rectangles in a single browser `evaluate` call. Separate
`boundingBox()` calls can observe different frames during smooth scrolling,
especially after keyboard focus. The 19 September CI adder failures compared
positions thousands of pixels apart for that reason. Waiting for fonts and
reading both rectangles together retains the clipping assertion without
depending on runner speed. `CI=true` on macOS does not reproduce Linux timing or
rendering.

## One retry, reported as a defect

CI retries a failed browser test once; local runs never retry. A runner that
stalls once should not block a deploy.

A test that passes only on the second attempt is still a defect, so it is not
allowed to pass quietly. Playwright records it as **flaky**,
[`scripts/ci-summary.mjs`](../../scripts/ci-summary.mjs) names it in the job
summary with its file and line, and it is raised as a warning annotation on the
run. Treat that list as work: it names a test that depends on the machine rather
than on the site, and the fix is almost always the condition-wait above.

## Parser accessibility checks

Routine browser tests capture review images only when `REVIEW_SCREENSHOTS=1`.
Use `reviewScreenshot` from `tests/browser/review-screenshot.mjs` for those
images; a unit guard rejects unconditional review captures. Failure screenshots
and traces remain enabled in CI. Pixel comparisons that detect damaged artwork,
and app PNG export tests, still run normally.

The 19 September GitHub trace showed the mobile parser's optional formula-label
screenshot taking 27.075 seconds, exhausting the then 30-second test budget
during the following accessibility audit. This was the same class of failure seen
on 16 September. Review capture is now opt-in across all browser specs, rather
than removed from individual failing tests, and the CI budget for that test is
now 90 seconds.

For an intentional visual review after building:

```sh
REVIEW_SCREENSHOTS=1 npm run test:browser -- tests/browser/parser-app.spec.mjs
```

## Reproducing a CI run locally

`CI=1` switches on every CI-only behaviour at once — scaled budgets, one retry,
the JSON report and the GitHub annotations — but it cannot reproduce Linux
timing or font rendering on macOS:

```sh
CI=1 npm run test:browser
npm run report:ci          # the job summary, printed to the terminal
```

Use it to check that a change to the config or the summary works, not to predict
whether a runner will be fast enough.

## Slide tests

Regular slide tests verify each released source, frame manifest and SVG hashes.
The optional `npm run slides:test:preservation` compares all twelve local
archives and sources; it requires the ignored original imports.
`tests/browser/slides.spec.mjs` checks all 40 published frames, local resources,
clicker/keyboard navigation, direct links, full screen, no-JavaScript reading,
dark-mode control contrast and mobile reflow. The optional `npm run slides:test`
checks actual Excalidraw editing and backup saves using temporary source copies;
see [Validation](../slides/validation.md).

## Related

- [GitHub Actions](github-actions.md) — the workflows, the job summary and the artifacts.
- [Test output](output.md) — what a run prints locally.
- [Maintaining the tests](maintaining.md) — writing a spec that stays speed-independent.
