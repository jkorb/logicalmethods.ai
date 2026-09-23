# Maintaining the tests

The test code is in [`tests/`](../../tests/) and the supporting commands are in
[`scripts/`](../../scripts/). Add browser tests when adding an interaction. Keep
checking the changed pages yourself, especially at narrow widths: the automated
tests do not cover every layout, browser, or accessibility requirement.

A browser spec imports `test` and `expect` from
[`tests/browser/fixtures.mjs`](../../tests/browser/fixtures.mjs), not from
`@playwright/test`. That fixture points production absolute URLs at the local
build and stubs everything off-site, so a new spec needs no routing of its own.
Import `routeToTestSite` directly where a test builds its own context, or pass
`{ offsite: 'abort' }` where a third-party request must fail rather than
resolve. `privacy.spec.mjs` is the deliberate exception: it records and aborts
off-site requests to prove the site makes none.

A new spec must not wait for a duration. `waitForTimeout` appears nowhere in
`tests/browser/` and should not be added: a fixed sleep fails whenever the
machine needs one millisecond longer than the number you guessed. Wait for the
condition instead — `expect(locator)` and `expect.poll` retry until it holds.
Where a test needs its own ceiling, import `budget` from
[`tests/browser/budget.mjs`](../../tests/browser/budget.mjs) rather than writing
a number, so it scales on a slow runner. [Matching CI locally](ci-parity.md)
gives the worked examples.

Browser tests must route production-domain asset requests to the local test
server, as the parser and site suites do. The normal Hugo test build retains
production absolute URLs. A preview built with a localhost base URL can mask
missing request routing; verify new browser tests against the normal build.
Third-party resources are stubbed, with availability checked separately.

## Manual review

For drawing changes, inspect SVG contact sheets and chapter figures in light and
dark themes; compare exports with their retained Excalidraw sources. The shared
inference/set shortcodes and blockquote spacing also need a visual check at
320 pixels. Font changes require reviewing actual glyphs in formulas as well
as running the font-loading tests. When changing static trees, inspect both
ambiguity readings on narrow screens and without JavaScript.

## Exceptions and configuration

Markdown rules are configured in
[`.markdownlint-cli2.jsonc`](../../.markdownlint-cli2.jsonc). Raw HTML, multiple
chapter headings, and the site's dollar math notation are allowed. For a local
exception, use a rule-specific comment and explain why it is needed.

`tests/browser/release.spec.mjs` guards staged publication, which is temporary.
It reads `locked` from chapter front matter rather than listing chapters, so
releasing one needs no test edit; delete the file when the `locked` parameter
goes. `keyboard.spec.mjs` derives chapter neighbors the same way, because
navigation skips what is still locked.

For a temporary site-check exception, add the exact diagnostic and a reason to
[`tests/site-exceptions.json`](../../tests/site-exceptions.json). Remove the entry
once the problem is fixed; obsolete entries fail the check.

When updating tools, change `.hugo-version`, `.nvmrc`, or `.vale-version` as
appropriate. Commit `package-lock.json` with Node dependency updates. Run the
full suite after upgrades and the prose tests after Vale changes.

## Related

- [Browser suites](browser-suites.md), [Staged release](../authoring/staged-release.md).
- [Matching CI locally](ci-parity.md) — writing a spec that does not depend on machine speed.
- [Test output](output.md) — how the runner reports a check you add.
