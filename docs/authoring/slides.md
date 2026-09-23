# Slides

The local slide tools render available Excalidraw scenes in `slides/sources/`.
Use `npm run slides:edit` to edit and **Save library** to retain icon-library edits.
`npm run slides:render` regenerates decks whose sources are present. A lecture can
carry a hand-written `narration.yaml` beside its `index.md` describing every slide,
including its drawings; the viewer uses it for image `alt` text and for the reading
view. Keep it in step with the scene. Illustrate slides from the book's own scenes in
`assets/img/drawings/sources/` and from the icon library, which is where new
course drawings belong too. Only Lecture 1 is released. Lectures 2–12
are staged locally in ignored `slides/unpublished/` and stay outside normal
builds, including `hugo -D`. Unreviewed sources, image extracts and archives
are also Git-ignored, not distributed with a fresh clone.
`npm run slides:preview` mounts them for local review.

See [Slides](../slides/README.md) for preservation, image locations and
publication steps.

## Related

- [Lecture standards](../slides/lecture-standards.md) — length, shape and images of a revised deck.
- [Sources and generated files](../slides/files.md), [Image review](../slides/image-review.md).
- [References and links](references-and-links.md) — the `iframe` shortcode for external embeds.
