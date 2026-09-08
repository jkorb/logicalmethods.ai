# Testing

Run the tests before pushing changes:

```sh
npm test
```

This builds the website, checks its content and links, and opens representative
pages in desktop and mobile Chromium. GitHub runs the same tests on pull requests
and pushes to `main`. Deployment waits for them to pass.

## First-time setup

Install the Hugo version listed in [`.hugo-version`](../.hugo-version) from
[Hugo releases](https://github.com/gohugoio/hugo/releases). Use the extended
edition to match GitHub Actions. The Node version is listed in
[`.nvmrc`](../.nvmrc); with nvm installed, run `nvm install` to select it.

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
For browser failures, open the report:

```sh
npx playwright show-report tmp/playwright-report
```

The report includes screenshots and traces. All local reports and temporary
builds live under the Git-ignored `tmp/` directory.

You can also run individual checks:

| Command | Checks |
| --- | --- |
| `npm run build:test` | Hugo version and a clean build with drafts. |
| `npm run check:content` | Front matter, page IDs, and exercise password lookups. |
| `npm run check:site` | Links, anchors, resources, HTML IDs, and solution controls. |
| `npm run lint:markdown` | Markdown in course content, documentation, and the README. |
| `npm run test:browser` | Page loading, navigation, solutions, notation, and fonts. |
| `npm run test:unit` | The validators themselves, using small test documents. |

`check:site` and `test:browser` use the last build. Run `npm run build:test`
first if you have edited the site since building it.

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

Markdown rules are configured in
[`.markdownlint-cli2.jsonc`](../.markdownlint-cli2.jsonc). Raw HTML, multiple
chapter headings, and the site's custom code notation are allowed. For a local
exception, use a rule-specific comment and explain why it is needed.

For a temporary site-check exception, add the exact diagnostic and a reason to
[`tests/site-exceptions.json`](../tests/site-exceptions.json). Remove the entry
once the problem is fixed; obsolete entries fail the check.

When updating tools, change `.hugo-version`, `.nvmrc`, or `.vale-version` as
appropriate. Commit `package-lock.json` with Node dependency updates. Run the
full suite after upgrades and the prose tests after Vale changes.

## GitHub Actions

The [build and deployment workflow](../.github/workflows/build-and-deploy.yaml)
has a `verify` job that runs `npm test`. The `deploy` job requires `verify` to
succeed, then publishes the tested files. Only pushes to `main` deploy;
pull requests and manual runs just check the site. The README badge links to
this workflow and shows its status on `main`.

The `prose` job runs separately and uploads its report. The
[external-link workflow](../.github/workflows/external-links.yaml) runs on Mondays
or on request. Neither report is a deployment prerequisite. In GitHub Actions,
open a run and look under **Artifacts** for reports and browser diagnostics.
