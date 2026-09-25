# Slides

A lecture deck is written like a chapter. The page
`content/slides/<topic>/index.md` sets `layout: 'reveal_slides'`, and its body
is Markdown in which each `{{< slide >}}` starts a slide. Every shortcode a
chapter uses — `callout`, `term`, `$…$`, `inference`, `img`, `logic-app` —
works on a slide and looks as it does in the chapter. `hugo new content
slides/<topic>` starts one. See [Writing a deck](../slides/reveal/authoring.md).

## The Excalidraw decks (deprecated)

Lectures 1 to 4 stay Excalidraw decks for the current course run, and every
other lecture keeps its Excalidraw deck until it is migrated; see
[Migrating a deck](../slides/reveal/migrating.md). Their local tools render the
Excalidraw scenes in `slides/sources/`: `npm run slides:edit` edits them,
`npm run slides:render` regenerates their SVG decks, and each carries a
hand-written `narration.yaml` describing every slide. Lectures 1 to 5 are
released; Lectures 6 to 12 are staged in ignored `slides/unpublished/`, which
`npm run slides:preview` mounts for local review. See
[Lecture slides](../slides/README.md) for preservation, image locations and
publication.

## Related

- [Lecture standards](../slides/lecture-standards.md) — length, shape and images of a revised deck.
- [Reveal.js decks](../slides/reveal/README.md) — how a deck is built, its theme and tests.
- [References and links](references-and-links.md) — the `iframe` shortcode for external embeds.
