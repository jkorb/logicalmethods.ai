# Contributor knowledge base

This directory is an [Obsidian](https://obsidian.md/) vault: many small notes,
one topic each, linked with ordinary relative Markdown links so they work in
Obsidian, on GitHub, and for agents reading the files directly. Open the `docs/`
folder as a vault, or just read the Markdown.

Start with the folder index for the area you are working in, then open only the
note you need. Do not read the whole vault.

| Area | Start here | Covers |
| --- | --- | --- |
| Project | [project/](project/README.md) | The course, its audience, editorial direction, licensing. |
| Technical | [technical/](technical/README.md) | Hugo, source layout, page weight, build, deployment. |
| Design | [design/](design/README.md) | Tokens, layout, notation, components, interaction. |
| Authoring | [authoring/](authoring/README.md) | Front matter, notation, figures, shortcodes, apps. |
| Slides | [slides/](slides/README.md) | Self-hosted lectures, the local editor, image review. |
| Testing | [testing/](testing/README.md) | Running checks, prose, CI, maintaining the suites. |

## Common entry points

- Previewing the site: [Build and preview](technical/build-and-preview.md)
- Writing a chapter: [Pages and front matter](authoring/front-matter.md), [Notation](authoring/notation.md)
- Adding a figure: [Figures](authoring/figures.md)
- Adding an interactive component: [Interactive chapter apps](authoring/apps/README.md)
- Changing styles: [When you change something](design/changing-things.md)
- Before pushing: [Running only what your change affects](testing/targeted-runs.md)

## Conventions

- **One topic per note.** A note answers one question; anything larger becomes a
  folder with a `README.md` index.
- **Standard Markdown links, not wikilinks.** `[Text](../folder/note.md)` renders
  everywhere. Obsidian resolves it too; `[[note]]` does not render on GitHub.
- **Every folder has a `README.md`** listing its notes with a one-line summary.
  Add new notes to that index.
- **Links to files outside `docs/`** (templates, scripts, configuration) are
  correct relative paths and work on GitHub, but fall outside the vault, so
  Obsidian will not resolve them in its graph. That is expected.
- `npm run check:docs` verifies every relative link and flags notes missing from
  their folder index.

Update the relevant note when you change how the site works.
