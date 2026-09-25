# Teach and read

> **Deprecated.** This note covers the Excalidraw deck format, which Lectures 1
> to 4 keep for the current course run and every other deck keeps until it is
> migrated. New and migrated decks use [Reveal.js](reveal/README.md).

Open a lecture page and select **Full screen**. Use arrow keys, Page Up / Page
Down (including clickers that send those keys), or Space / Shift+Space. Home and
End select the first and last slide. F toggles full screen; Escape leaves it.
The visible buttons and slide selector offer the same navigation. At the first
and last slide, navigation stops rather than wrapping around.

Every slide has a `#slide-N` URL; reloading or opening that link selects the
same slide. Students browse their own copy; this is not live synchronization
with the lecturer. Keyboard navigation acts when the viewer is in view, and
leaves text fields and native control activation alone.

Without JavaScript, all slides appear as a vertical sequence. No editor,
account, CDN, or Excalidraw server is involved in viewing these decks.

## Slide descriptions

A lecture can carry a written description of every slide in `narration.yaml`
beside its `index.md`. Each entry has a `number`, a one-sentence `alt` that
becomes the slide image's accessible name, and a `body` whose blank-line-separated
paragraphs say what the slide shows, drawings and diagrams included. Where that
file exists, the viewer uses it in place of the extracted text and links each
image to its description with `aria-describedby`; Lectures 1 to 5 have one.
Without it the expandable text extraction is used instead, which helps search
and copy but
is **not** a transcript: its reading order interleaves columns, and hand-drawn
operators and diagram relationships stay graphical. Either way the linked
textbook chapter supplies the full written explanation. Keep a description in
step with the scene whenever you edit the slides.

## Related

- [Local slide viewer](../design/slide-viewer.md) — the viewer's design.
