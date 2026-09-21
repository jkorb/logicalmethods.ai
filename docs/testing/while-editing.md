# While editing

For content edits, batch related changes and run `npm run check` once. It runs
unit tests, the build, content checks, link checks, documentation checks, and the
Markdown linter without opening a browser. For templates, styles, or interactive
features, use the [change-to-suite map](targeted-runs.md). Run `npm test` before
pushing.

Both commands build from scratch into `tmp/site/`, including draft pages.
Build warnings count as failures. Neither command changes your source files.
`check` includes the `hugo -D` build, and `test` includes `check`; do not run them
again on unchanged source. After required checks pass, finish unless further
edits, a failure, or a named unresolved concern justify more validation.
The browser tests use port 4173, so you can leave a Hugo preview running on 1313.

## Reading a failure

A passing check prints one line. A failing check prints its own output, the path
to its full log, and the command that re-runs it alone:

```text
✗ Generated site         exit 1                 997ms

  textbook/sat/index.html: duplicate id sat
  Generated site: 1 failure(s)

  full output: tmp/logs/site.log
  re-run only this check: npm run check:site
```

Iterate with that narrow command, not the whole suite. Checks that depend on a
failed one are skipped and labelled; independent ones still run, so a single run
finds everything. A browser failure prints the assertion, the call log and the
code frame, which is normally enough. For more, open the report:

```sh
npx playwright show-report tmp/playwright-report
```

`npm run check -- --verbose` streams every check live when a summary is not
enough. Full output is kept in `tmp/logs/<check>.log` either way, so there is no
need to re-run a check to see what it said. [Test output](output.md) covers the
rest. CI reports include failure screenshots and traces; automatic local capture
is off by default, though individual tests may save screenshots explicitly. All
local reports and temporary builds live under `tmp/`.

Do not read the `error-context.md` files a failure leaves in
`tmp/test-results/`. They are whole-page accessibility snapshots, up to a
hundred kilobytes each, and they repeat what the assertion already said. Open
them in the report, where they are navigable, or not at all.

## Individual checks

| Command | Checks |
| --- | --- |
| `npm run build:test` | Hugo version and a clean build with drafts. |
| `npm run check:content` | Front matter, page IDs, and exercise password lookups. |
| `npm run check:site` | Links, anchors, resources, HTML IDs, and solution controls. |
| `npm run check:docs` | Relative links between the documentation notes and repository files. |
| `npm run lint:markdown` | Markdown in course content, documentation, and the README. |
| `npm run test:browser` | Page loading, navigation, solutions, notation, and fonts. |
| `npm run test:browser:desktop` | The same suite at desktop width only, in half the time. |
| `npm run test:unit` | The validators themselves, using small test documents. |

Each prints a single line when it passes. `npm run check -- --only=site,docs`
runs a named subset through the runner instead, keeping the summary and the
dependency skipping.

`check:site` and `test:browser` use the last build. Run `npm run build:test`
first if you have edited the site since building it.

## Related

- [Test output](output.md) — quiet runs, `--verbose`, and notes for agents.
- [Running only what your change affects](targeted-runs.md).
