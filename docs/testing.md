# Testing

Run the tests before pushing changes:

```sh
npm test
```

This builds the website, checks its content and links, and opens representative
pages in desktop and mobile Chromium. GitHub runs the same tests on pull requests
and pushes to `main`. Deployment waits for them to pass.

## Accessibility, keyboard and reflow suites

Three browser suites guard the redesign. They run as part of `npm test`.

| File | Guards |
| --- | --- |
| `tests/browser/a11y.spec.mjs` | axe-core across ten routes at WCAG 2.2 AA, plus `/textbook/boolean/` in both light and dark mode. |
| `tests/browser/keyboard.spec.mjs` | The skip link is the first tab stop; chapter navigation is reachable; every tab stop has a name and a visible focus ring; prev/next point at the right neighbors. |
| `tests/browser/reflow.spec.mjs` | No horizontal scrollbar at 320&nbsp;px on eight routes (WCAG 1.4.10). |
| `tests/browser/privacy.spec.mjs` | No page contacts another host on load; the built HTML links nothing off-site; an embedded deck loads only when pressed; local storage holds only the keys the About page names, and no cookies are set. |

The keyboard and reflow checks exist because axe cannot see either problem, and
both were real defects before the redesign: chapter navigation carried
`tabindex="-1"`, and truth tables and code blocks pushed the page sideways.

Accepted axe findings go in `tests/a11y-exceptions.json` as
`{"id": "...", "reason": "..."}`. A finding without a written reason is not an
exception. `layouts/tutoraat/` and `layouts/verdiepingspakketten/` are out of scope
and are not audited.

## First-time setup

Install the Hugo version listed in [`.hugo-version`](../.hugo-version) from
[Hugo releases](https://github.com/gohugoio/hugo/releases). Use the extended
edition to match GitHub Actions. The Node version is listed in
[`.nvmrc`](../.nvmrc); with nvm installed, run `nvm install` to select it.

The build checks the exact Hugo release number, accepting both official builds
with a commit hash and packaged builds such as Homebrew's.

Then, from the repository root:

```sh
npm ci
npm run setup:browsers
npm test
```

On Linux, use `npm run setup:browsers -- --with-deps` to install Chromium's
system dependencies too. Browser downloads are kept in `tmp/playwright-browsers/`.
Hugo alone is enough to preview the site; Node and Chromium are needed for tests.

## While editing

`npm run check` is the faster option for content edits. It runs the build,
content checks, link checks, and Markdown linter without opening a browser.
Use `npm test` before pushing, or whenever you change templates, styles, or
interactive features.

Both commands build from scratch into `tmp/site/`, including draft pages.
Build warnings count as failures. Neither command changes your source files.
The browser tests use port 4173, so you can leave a Hugo preview running on 1313.

If a check fails, its output identifies the page, resource, or test to inspect.
A browser failure prints the assertion, the call log and the code frame, which
is normally enough. For more, open the report:

```sh
npx playwright show-report tmp/playwright-report
```

The report includes screenshots and traces. All local reports and temporary
builds live under the Git-ignored `tmp/` directory.

Do not read the `error-context.md` files a failure leaves in
`tmp/test-results/`. They are whole-page accessibility snapshots, up to a
hundred kilobytes each, and they repeat what the assertion already said. Open
them in the report, where they are navigable, or not at all.

You can also run individual checks:

| Command | Checks |
| --- | --- |
| `npm run build:test` | Hugo version and a clean build with drafts. |
| `npm run check:content` | Front matter, page IDs, and exercise password lookups. |
| `npm run check:site` | Links, anchors, resources, HTML IDs, and solution controls. |
| `npm run lint:markdown` | Markdown in course content, documentation, and the README. |
| `npm run test:browser` | Page loading, navigation, solutions, notation, and fonts. |
| `npm run test:browser:desktop` | The same suite at desktop width only, in half the time. |
| `npm run test:unit` | The validators themselves, using small test documents. |

`check:site` and `test:browser` use the last build. Run `npm run build:test`
first if you have edited the site since building it.

## Running only what your change affects

The browser suite is the slow and noisy part: over 200 tests across two viewports.
Everything after `--` goes to Playwright, so a targeted run is one command:

```sh
npm run test:browser -- tests/browser/icons.spec.mjs --project=desktop
npm run test:browser -- --grep "glossary"
```

Start from the suite that guards what you changed, and run the whole thing
before pushing:

| What you changed | Run |
| --- | --- |
| Chapter or exercise prose | `npm run check` |
| Front matter, IDs, passwords | `npm run check:content` |
| Links, anchors, images | `npm run build:test && npm run check:site` |
| Styles or page furniture | `a11y`, `keyboard`, `reflow`, `display-math` |
| An interactive app | its own spec, then `a11y` |
| Slide decks or the deck shortcode | `slides`, `privacy` |
| Release state: unlocking a chapter | `release`, `keyboard` |
| The route stub or a shared fixture | the whole browser suite |

The local reporter prints one character per passing test and the full failure
block for each failure; `CI=1` restores the per-test listing, traces and
failure screenshots that GitHub Actions uploads. The test server is reused
between local runs, so leaving one up costs nothing.

## Temporary files

`tmp/` holds two unrelated things: output the tooling regenerates, and the
review notes and scratch files [AGENTS.md](../AGENTS.md) asks you to keep
there. To reclaim the first kind:

```sh
npm run clean              # builds, reports, test output, leftover fixtures
npm run clean:all          # also Chromium, Vale and the other downloads
node scripts/clean.mjs --dry-run
```

The script removes an allowlist, never the whole directory, and reports what it
kept. Every entry names the script, config or test that writes it; check that
the writer still exists before adding one.

## Spelling and style

[Vale](https://docs.vale.sh/) checks spelling, repeated words, and terminology.
Its suggestions are for review and do not block deployment.

Install the project's Vale version on macOS or Linux:

```sh
npm run setup:prose
```

The installer downloads the version in [`.vale-version`](../.vale-version),
checks its checksum, and puts the executable in `tmp/bin/`. To review one chapter:

```sh
VALE_BIN=tmp/bin/vale npm run lint:prose -- content/textbook/boolean/index.md
```

Omit the filename to review all course content and documentation. If the same
Vale version is already on your PATH, you can omit `VALE_BIN=tmp/bin/vale` too.
Results appear in the terminal and in `tmp/prose-report.json`.

Add accepted names and technical terms to the
[course vocabulary](../.vale/styles/config/vocabularies/Course/accept.txt), one
entry per line in alphabetical order. This also covers acronyms, possessives,
and words in foreign-language bibliography titles. Check the word in context
before adding it; formatting problems and spelling errors should stay flagged.
The spelling dictionary is American English, with some British variants accepted.
English spelling and terminology checks are disabled for the Dutch study-track
section and the mixed-language tutoring guide. Repeated-word checks still apply.

Code, formulas, and shortcode tags are excluded; text inside paired shortcodes
is checked. Unusual notation may need a local exception. Vale supports
[comments for disabling a rule](https://docs.vale.sh/formats/markdown#comments)
around a passage. It does not check mathematical correctness or provide a full
grammar review.

After changing the Vale rules or notation handling, run:

```sh
VALE_BIN=tmp/bin/vale npm run test:prose
```

This checks that spelling mistakes are found and notation is ignored. A missing
tool or invalid configuration is reported as a failure, even though ordinary
editorial findings are advisory.

## External links

```sh
npm run check:external
```

This builds the site and checks external links and embeds over the network.
Results are saved to `tmp/external-report.json`. GitHub also runs this check
weekly and makes the report available in the workflow's artifacts.

Review each finding before replacing a link: some websites reject automated
requests or limit their frequency. The check tests whether a URL responds; it
does not inspect remote heading anchors or the contents of an embedded slide deck.
External-link findings do not block deployment.

## Maintaining the tests

The test code is in [`tests/`](../tests/) and the supporting commands are in
[`scripts/`](../scripts/). Add browser tests when adding an interaction. Keep
checking the changed pages yourself, especially at narrow widths: the automated
tests do not cover every layout, browser, or accessibility requirement.

A browser spec imports `test` and `expect` from
[`tests/browser/fixtures.mjs`](../tests/browser/fixtures.mjs), not from
`@playwright/test`. That fixture points production absolute URLs at the local
build and stubs everything off-site, so a new spec needs no routing of its own.
Import `routeToTestSite` directly where a test builds its own context, or pass
`{ offsite: 'abort' }` where a third-party request must fail rather than
resolve. `privacy.spec.mjs` is the deliberate exception: it records and aborts
off-site requests to prove the site makes none.

Markdown rules are configured in
[`.markdownlint-cli2.jsonc`](../.markdownlint-cli2.jsonc). Raw HTML, multiple
chapter headings, and the site's dollar math notation are allowed. For a local
exception, use a rule-specific comment and explain why it is needed.

`tests/browser/release.spec.mjs` guards staged publication, which is temporary.
It reads `locked` from chapter front matter rather than listing chapters, so
releasing one needs no test edit; delete the file when the `locked` parameter
goes. `keyboard.spec.mjs` derives chapter neighbors the same way, because
navigation skips what is still locked.

For a temporary site-check exception, add the exact diagnostic and a reason to
[`tests/site-exceptions.json`](../tests/site-exceptions.json). Remove the entry
once the problem is fixed; obsolete entries fail the check.

When updating tools, change `.hugo-version`, `.nvmrc`, or `.vale-version` as
appropriate. Commit `package-lock.json` with Node dependency updates. Run the
full suite after upgrades and the prose tests after Vale changes.

## GitHub Actions

The [build and deployment workflow](../.github/workflows/build-and-deploy.yaml)
has a `verify` job that runs `npm test`. The `deploy` job requires `verify` to
succeed, then publishes the tested files through GitHub's Pages artifact and
deployment actions. Pushes and manual runs on `main` deploy; pull requests and
manual runs on other branches just check the site. See the
[deployment setup](technical.md#deployment) for the required Pages settings.
The README badge links to
this workflow, using GitHub's native status badge for pushes to `main`. It shows
the overall build and deployment status, including tests. Badge images can lag
behind a run; follow the link for the current result.

The `prose` job runs separately and uploads its report. The
[external-link workflow](../.github/workflows/external-links.yaml) runs on Mondays
or on request. Neither report is a deployment prerequisite. In GitHub Actions,
open a run and look under **Artifacts** for reports and browser diagnostics.


Parser checks live in `tests/unit/parser.test.mjs` and
`tests/browser/parser-app.spec.mjs`. They cover strict and conventional syntax,
negation scope, precedence, grouping, invalid input, immutable trace snapshots,
LaTeX conversion, keyboard operation, exercise disclosure, no-JavaScript
fallback, reflow, and light/dark accessibility.


The parser browser tests also check read-only initialization, pencil editing,
resubmission, icon navigation, the text-tree toggle, and numeric LaTeX subscripts.
When changing static trees, inspect both ambiguity readings on narrow screens
and without JavaScript. The notation appendix's cheat sheet should agree with
`assets/js/apps/latex-input.js`; unit checks cover its conversion examples.


Browser tests must route production-domain asset requests to the local test
server, as the parser and site suites do. The normal Hugo test build retains
production absolute URLs. A preview built with a localhost base URL can mask
missing request routing; verify new browser tests against the normal build.
Third-party resources are stubbed, with availability checked separately.

The glossary's persistent-hover test intentionally skips the mobile project:
touch has no persistent hover. The other glossary checks run on both projects.


Parser tests cover immediate typing and paste conversion, including `\to` /
`\top` and multi-digit subscripts, as well as switching node labels without
losing the trace. Controls are checked for a stable position above the tree.
For drawing changes, inspect SVG contact sheets and chapter figures in light and
dark themes; compare exports with their retained Excalidraw sources. The shared
inference/set shortcodes and blockquote spacing also need a visual check at
320 pixels. Font changes require reviewing actual glyphs in formulas as well
as running the font-loading tests.


`tests/browser/display-math.spec.mjs` checks trimmed display boundaries, fitting
at desktop and mobile widths, restoration after widening, unchanged formula
text and source-code sizing, set proportions, and the parser accessibility
button's lower-right placement.

`tests/unit/rendering.test.mjs` builds an isolated Hugo fixture to check the
shared math hook, literal code, escaped dollars and color qualifiers, together
with direct SVG exports and repeated-image IDs. The app independence test uses
the two real instances in Appendix C. Accessibility and reflow checks include
Formal Languages, the Tools appendix and a representative assignment page.

## Matching CI locally

Use the published URL spelling in browser tests: Hugo emits `/textbook/fol/`
even though the source bundle is named `FOL`. The test server and link checker
require exact path case on macOS as well as Linux, and page audits assert HTTP
200 before checking accessibility or layout. This prevents a missing page from
passing a reflow check or appearing as an unrelated accessibility failure.

The reasoning-practice scenario has a 90-second timeout because it completes
all twelve cases, checks review and restart, and runs an accessibility audit.
Other tests retain their default timeout; no retries mask failures. Formula
fitting diagnostics report the overflowing expression and measured widths.

Regular slide tests verify the released source, frame manifest and SVG hashes.
The optional `npm run slides:test:preservation` compares all twelve local
archives and sources; it requires the ignored original imports. `tests/browser/slides.spec.mjs` checks all
20 published frames, local resources, clicker/keyboard navigation, direct links,
full screen, no-JavaScript reading, dark-mode control contrast and mobile reflow.
The optional `npm run slides:test` checks actual Excalidraw editing and backup
saves using temporary source copies; see [Slides](slides.md#validation).
