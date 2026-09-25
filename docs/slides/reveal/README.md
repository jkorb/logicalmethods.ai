# Reveal.js decks

The current lecture format. A deck is Markdown in the lecture's page bundle,
cut into slides by the `slide` shortcode, rendered by Hugo with the book's own
shortcodes, and presented by [Reveal.js](https://revealjs.com/) in an
Excalidraw-styled theme. A definition, an inference, a syntax tree or a chapter
app appears on a slide exactly as it does in the chapter, because it is the
same shortcode rendered by the same templates.

Lectures 1 to 4 stay [Excalidraw decks](../README.md) for the current course
run. Lecture 5 onward move to this format one deck at a time; until a deck is
migrated, its Excalidraw version stays in place and published. See
[Migrating a deck](migrating.md).

## How a deck is built

1. `content/slides/<topic>/index.md` sets `layout: reveal_slides`. Its body is
   the deck: each `{{< slide >}}` starts a slide that runs to the next one.
2. Hugo renders the body like a chapter's, so every shortcode behaves as it
   does in the book. `{{< slide >}}` and `{{< column >}}` leave only an
   `<hr data-deck-…>` marker.
3. `layouts/partials/slides/reveal-deck.html` cuts the rendered page at those
   markers into `<section id="slide-N">` elements, adds a title slide, and turns
   every other `<section>` (apps render as sections) into a `<div>`. It fails
   the build where a cut would lose content or break the HTML, where slide 2
   lacks the learning goals, or where a picture is not the course's own.
4. `assets/js/slides-reveal.js` starts Reveal.js on that markup, after the app
   scripts have mounted the apps, and adds the toolbar, keys and `#slide-N`
   URLs. It fits each slide to its canvas, and builds the text view of every
   slide below the deck.
5. `assets/css/slides-reveal.css` is the theme. `css.Build` bundles it with
   Reveal.js's core CSS from the pinned `reveal.js` npm package.

## Files

| Location | Purpose |
| --- | --- |
| `layouts/slides/reveal_slides.html` | The lecture page: same furniture as the Excalidraw layout. |
| `layouts/partials/slides/reveal-deck.html` | Cuts the page into slides; checks the cuts. |
| `layouts/shortcodes/slide.html`, `column.html` | The slide and column markers. |
| `layouts/slides/_markup/render-heading.html` | Slide headings: no anchors; `#` is refused. |
| `assets/js/slides-reveal.js` | Reveal.js setup and deck navigation. |
| `assets/css/slides-reveal.css` | The Excalidraw theme and the deck's frame. |
| `archetypes/slides/index.md` | `hugo new content slides/<topic>` starts a deck. |
| `tests/fixtures/reveal-deck/` | The sample deck that the tests build; never deployed. |

## Notes

- [Writing a deck](authoring.md) — the shortcodes, layouts and rules.
- [The Excalidraw theme](theme.md) — canvas, faces, layouts, app sizing.
- [Teaching with a deck](teaching.md) — keys, full screen, known limits.
- [Migrating a deck](migrating.md) — from Excalidraw, one lecture at a time.
- [Testing the framework](testing.md) — the fixture deck and what to run.

The content standard is shared with the Excalidraw decks:
[Lecture standards](../lecture-standards.md).
