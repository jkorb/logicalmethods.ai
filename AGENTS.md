# Working on logicalmethods.ai

[`docs/`](docs/README.md) is an Obsidian vault: many small, single-topic notes,
linked with ordinary relative Markdown links. **Read the folder index, then open
only the note you need.** Do not load a whole area to answer one question.
Begin with the requested files; expand reading only to resolve a specific
dependency or uncertainty.

| Area | Index | For |
| --- | --- | --- |
| [Project](docs/project/README.md) | [project/](docs/project/README.md) | Purpose, audience, curriculum, licensing. |
| [Technical](docs/technical/README.md) | [technical/](docs/technical/README.md) | Hugo, source layout, build, deployment. |
| [Design](docs/design/README.md) | [design/](docs/design/README.md) | Tokens, layout, notation, components, interaction. |
| [Authoring](docs/authoring/README.md) | [authoring/](docs/authoring/README.md) | Front matter, notation, figures, shortcodes, apps. |
| [Slides](docs/slides/README.md) | [slides/](docs/slides/README.md) | Self-hosted lectures, the local editor, image review. |
| [Testing](docs/testing/README.md) | [testing/](docs/testing/README.md) | Running checks, prose, CI, maintaining the suites. |

Revising a chapter or a lecture has a written standard:
[Chapter standards](docs/authoring/chapter-standards.md) and
[Lecture standards](docs/slides/lecture-standards.md). Read the one that matches
the task; it replaces a long prompt.

Edit source files, not generated `public/` output. Preserve existing page paths,
anchors, and IDs unless the task calls for changing them. Treat bundled libraries
as dependencies; prefer project CSS, JavaScript, and templates for site changes.

CI includes drafts in the published site. `hidden`, `locked`, and exercise
passwords do not provide access control.

## Work scope and validation

- Batch related edits before validation. Run the narrowest checks in the
  [change-to-suite map](docs/testing/targeted-runs.md).
- For prose-only edits, run `npm run check` once after the batch. Browser and
  screenshot review require a concrete rendering concern.
- For rendering changes, inspect the changed component on representative affected
  pages. For interaction changes, run the relevant browser specs.
- `npm run check` includes the `hugo -D` build; `npm test` includes `check`.
  Avoid duplicate runs on unchanged source. Run the full `npm test` before pushing.
- After required checks pass, finish. Repeat or broaden validation only because
  of further edits, a failure, or a named unresolved concern.
- Both commands print one line per check and stay under about twenty lines, even
  with a failure. Prefer them over the individual scripts: a failure reports the
  assertion plus the command that re-runs that check alone. Iterate with that
  command, not the whole suite.
- Do not pass `--verbose`, and do not read `tmp/logs/*.log`, unless a summary has
  already proven insufficient for a specific failure. Never read the whole-page
  `error-context.md` dumps under `tmp/test-results/`.
- Invoke named npm scripts directly so command-prefix approvals can match; avoid
  shell wrappers and redirection when requesting test execution outside the
  sandbox. The runner already keeps full output in `tmp/logs/`, so redirection
  buys nothing.
- Never make a browser test wait for a duration. `waitForTimeout` is absent from
  `tests/browser/` by design; wait for the condition, and import `budget` from
  `tests/browser/budget.mjs` where a test needs its own ceiling. A test that
  depends on machine speed fails on GitHub runners and not here.

[Test output](docs/testing/output.md) and [Matching CI locally](docs/testing/ci-parity.md)
cover both rules in full.

## Commits

When asked to commit, include only this task's changes and necessary supporting
files. A dirty worktree is expected; do not ask whether to include unrelated work.
Stage specific files or hunks, preserve other edits and staged work, and review
the staged diff. Follow [Commit scope and messages](docs/technical/commits.md).

## Keeping the vault current

When you change documented behavior, update the note that covers it, not a
general guide. If a note grows past roughly one screen, or starts covering two
topics, split it and add the new note to its folder index. Every folder needs a
`README.md` index; every note must be linked from one.

Use relative Markdown links (`[Text](../folder/note.md)`), never wikilinks —
`[[note]]` does not render on GitHub. `npm run check:docs` enforces both rules,
plus link and anchor resolution, and runs as part of `npm run check`.

Record facts supported by the repository; distinguish proposed improvements from
implemented features. Keep this file a short entry point.

## Scratch files

Keep temporary review checklists, scratch notes, and validation artifacts in the
Git-ignored root `tmp/` directory. Do not commit these files unless the user
explicitly asks to retain them in the repository. Use `docs/` for lasting project
guidance. `npm run clean` reclaims regenerated build and test output from `tmp/`
and leaves those notes alone.
