# Migrating a deck

Decks move from Excalidraw to Reveal.js one lecture at a time. **Lectures 1 to 4
stay Excalidraw decks for the current course run.** Lecture 5 onward are
migrated as they are prepared.

Nothing of the Excalidraw version is deleted during the migration: the scene in
`slides/sources/`, the manifest `slides/lecture-N.json`, the exports in
`content/slides/<topic>/deck/`, `narration.yaml`, the staged copy in
`slides/unpublished/`, the `.gitignore` allowlists and the preservation tests
all stay until the whole Excalidraw format is retired. A migrated page simply
stops using them. The exports stay published at their old URLs.

## Steps

1. Read the textbook chapter and the Excalidraw deck's `narration.yaml`, which
   says in words what every slide shows. Plan the deck to the
   [Lecture standards](../lecture-standards.md).
2. In `content/slides/<topic>/index.md`, set `layout: 'reveal_slides'` and
   remove `params.selfHosted`. For Lectures 6 to 12, also drop `locked` and the
   review notice. Keep `title`, `weight`, `params.id`, `params.chapter` and
   `params.highlights`.
3. Write the deck in the body: see [Writing a deck](authoring.md). Slide 2 is
   the learning goals, in the chapter's `objectives` callout with Bloom levels.
   Take definitions, examples and apps from the chapter's source, not from the
   old slides, and redraw an Excalidraw-only diagram as the book's drawing, a
   `syntax-tree`, a circuit app or a table. Leave out every picture that is not
   one of the course's own drawings. Give each drawing an `alt` — the old
   `narration.yaml` often has the words — and each app a `title`.
4. Preview with `hugo server -D` and check every slide at full screen. The
   `npm run slides:preview` overlay still shows a staged Excalidraw copy for
   Lectures 6 to 12, since that copy shadows the page there.
5. Update the tests that assert the Excalidraw format for this lecture:
   - `tests/browser/slides.spec.mjs`: remove the slug from the deck list at the
     top and from the authored-description list at the bottom, and, for Lectures
     6 to 12, from the review-notice list.
   - `tests/browser/privacy.spec.mjs`: remove the slug from the released-slides
     list. Its review-notice check uses `conditionals`; when Lecture 6 is
     migrated, point it at a lecture that still has the notice.
   - Leave `tests/unit/slides.test.mjs` and
     `tools/slides/preservation.test.mjs`: the files they check are kept.
   - `tests/browser/slides-reveal.spec.mjs` finds the new deck by its layout;
     every slide must fit its canvas at desktop width.
6. Run `npm run check`, then
   `npm run test:browser -- tests/browser/slides-reveal.spec.mjs tests/browser/slides.spec.mjs tests/browser/privacy.spec.mjs`.
   Record the migration in [Content review](../content-review.md).

## Retiring the Excalidraw format

Only when every deck is migrated, and in a change of its own: remove the
`deck/` exports, `narration.yaml` files, `slides/` sources and manifests, the
editor under `tools/slides/`, `excalidraw_slides.html`, `slides-viewer.html`,
`slides.css`, `slides.js`, the `slides:*` npm scripts, their tests and the
deprecated notes, and update the `.gitignore` allowlists.

## Prompting an agent

> Migrate Lecture 6 (`conditionals`) to the Reveal.js format, following
> `docs/slides/reveal/migrating.md` and `docs/slides/lecture-standards.md`,
> against `content/textbook/conditionals/index.md`. Keep every Excalidraw file.
> Report what you cut.

## Related

- [Writing a deck](authoring.md), [Testing the framework](testing.md).
- [Publishing a lecture](../publishing.md) — the Excalidraw release steps this replaces.
