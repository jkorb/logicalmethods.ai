# While editing

`npm run check` is the faster option for content edits. It runs the build,
content checks, link checks, documentation checks, and Markdown linter without
opening a browser. Use `npm test` before pushing, or whenever you change
templates, styles, or interactive features.

Both commands build from scratch into `tmp/site/`, including draft pages.
Build warnings count as failures. Neither command changes your source files.
The browser tests use port 4173, so you can leave a Hugo preview running on 1313.

## Reading a failure

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

`check:site` and `test:browser` use the last build. Run `npm run build:test`
first if you have edited the site since building it.

## Related

- [Running only what your change affects](targeted-runs.md).
