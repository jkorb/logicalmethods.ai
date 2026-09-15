# Working on logicalmethods.ai

[`docs/`](docs/README.md) is an Obsidian vault: many small, single-topic notes,
linked with ordinary relative Markdown links. **Read the folder index, then open
only the note you need.** Do not load a whole area to answer one question.

| Area | Index | For |
| --- | --- | --- |
| [Project](docs/project/README.md) | [project/](docs/project/README.md) | Purpose, audience, curriculum, licensing. |
| [Technical](docs/technical/README.md) | [technical/](docs/technical/README.md) | Hugo, source layout, build, deployment. |
| [Design](docs/design/README.md) | [design/](docs/design/README.md) | Tokens, layout, notation, components, interaction. |
| [Authoring](docs/authoring/README.md) | [authoring/](docs/authoring/README.md) | Front matter, notation, figures, shortcodes, apps. |
| [Slides](docs/slides/README.md) | [slides/](docs/slides/README.md) | Self-hosted lectures, the local editor, image review. |
| [Testing](docs/testing/README.md) | [testing/](docs/testing/README.md) | Running checks, prose, CI, maintaining the suites. |

Edit source files, not generated `public/` output. Preserve existing page paths,
anchors, and IDs unless the task calls for changing them. Treat bundled libraries
as dependencies; prefer project CSS, JavaScript, and templates for site changes.

Validate site changes with `hugo -D` and inspect affected pages when rendering or
interaction changes. CI includes drafts in the published site. `hidden`, `locked`,
and exercise passwords do not provide access control.

Run the narrowest check that covers your change — `npm run check` for content,
one spec for one interaction — and the full `npm test` before pushing. The
change-to-suite map and the targeted-run syntax are in
[Running only what your change affects](docs/testing/targeted-runs.md). Read a
browser failure from the assertion and code frame it prints; the
`error-context.md` files under `tmp/test-results/` are whole-page dumps and are
not worth opening.

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
