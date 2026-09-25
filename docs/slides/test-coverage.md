# Slide test coverage

> **Deprecated.** This note covers the Excalidraw deck format, which Lectures 1
> to 4 keep for the current course run and every other deck keeps until it is
> migrated. New and migrated decks use [Reveal.js](reveal/README.md).

For selecting checks by change, see [Validation](validation.md).

`slides:test` needs the optional authoring tools. It runs an actual browser edit
and save against temporary copies of the cleared Lecture 1 scene, checks the
backup, preserves original metadata/images/elements, rejects a stale revision and
a foreign-origin save, and checks that the editor contacts no external host. It
binds port 4184; `SLIDES_DATA_DIR` points its server at the test copies. The real
sources are not modified. Regular `npm test` includes released-source/export
integrity, Git exclusion and viewer checks, without requiring private original
archives.

Unfiltered `slides:test:preview` builds the isolated review overlay, checks all
available decks for local image loading and navigation, and produces a contact sheet
per lecture. Use the lecture filter for local edits; reserve an unfiltered run
for overlay changes or a requested review of all decks. The filter scopes tests,
not the overlay build.
Some slide tests explicitly save screenshots even when automatic Playwright
capture is off. Review them only when needed to assess the change or a failure.
Normal browser tests also verify that unreleased lectures expose no deck assets in a
regular build.

Review screenshots belong in `tmp/slides-review/`, never in the source archive.
Original/final contact sheets from the initial migration are there for local
comparison. Those temporary review artifacts are not part of the published site.
