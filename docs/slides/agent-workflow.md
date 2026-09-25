# Efficient slide work

> **Deprecated.** This note covers the Excalidraw deck format, which Lectures 1
> to 4 keep for the current course run and every other deck keeps until it is
> migrated. New and migrated decks use [Reveal.js](reveal/README.md).

Apply this policy when creating or revising decks. Keep the existing editor,
exporter, preservation rules and publication checks.

## Read for the requested change

- Start with the target lecture's manifest, narration and relevant chapter
  sections. For a full chapter-to-deck revision, read that chapter once and keep
  a short coverage outline in `tmp/slides-review/`.
- Parse scene and library JSON locally; return only needed frame IDs, text,
  geometry and asset metadata. Do not dump whole scenes, embedded image data,
  SVG font payloads or the entire icon library into agent context.
- Reuse established slide layouts and known book drawings. Inspect candidate
  assets as needed; do not survey every lecture or illustration for a local edit.
- Open pipeline internals only for an export failure or a requested tool change.

## Batch and review

- For a new deck or substantial redesign, settle the outline and representative
  layouts first; inspect a representative frame before repeating a new layout.
- Batch related scene edits, then synchronize narration for the affected frames.
  Render only the target lecture after the batch; narration-only edits need no
  Excalidraw export. See [Rendering](rendering.md).
- For a local revision, visually inspect each changed frame. Include other frames
  only when a shared layout, asset or ordering change could affect them.
- For a new or substantially revised deck, make one complete visual pass after
  the batch. Use a contact sheet for sequence and consistency, then readable
  frame views for text, mathematics and diagrams that thumbnails cannot resolve.
- Collect concrete defects before making a correction batch. Re-export the
  lecture, then reinspect corrected frames and anything affected by the fixes.
  Do not repeat the full visual pass or explore cosmetic alternatives after the
  requested result is readable, correct and consistent with the course style.
- Reuse review artifacts while their source is unchanged. Record reviewed frames,
  remaining defects and validation results briefly in `tmp/slides-review/` for
  long tasks; do not reread the full deck after a context handoff.

Run the checks selected by [Validation](validation.md), then finish. Test-created
screenshots are artifacts, not an instruction to inspect every image. A local
edit does not reopen unchanged image-rights decisions; new or replaced images
and publication still require [image review](image-review.md).
