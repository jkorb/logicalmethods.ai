# The icon library

The supplied icon library (219 items at import, 225 now) is copied to
`slides/library.excalidrawlib` and loaded automatically. **Open icon library**
opens Excalidraw's library panel. Use **Import / update icons** to merge another
`.excalidrawlib` by item ID (matching IDs are updated; other existing icons
remain). Native library actions can add or remove items. **Save library**
persists the current library separately from the lecture, with a revision check
and backups in `tmp/slides-backups/library/`. Restart the editor after replacing
the library file externally. To revise an icon, place it on the canvas, edit it,
add the updated selection to the library and remove the obsolete item if desired.
Then click **Save library**; **Save source** alone does not save library changes.

The icon library holds course drawings for reuse in slides — Socrates and the
product marks from Lecture 1, the two crossing signals from Lecture 2 — and only
those that no chapter uses. A drawing a chapter also shows belongs in
[`assets/img/drawings/`](../authoring/figures.md) instead, where the slide build
loads it from. Match the course's clean stroke style (`roughness: 0`, the Architect
setting). Lecture 1 uses plain text names for ChatGPT, Claude and DeepSeek;
the official logo files were excluded from this release because redistribution
permission was not established. Original copies are preserved in ignored local
backups. Do not reintroduce those image bytes when saving or rendering.

A library load failure shows an error and disables library saving while allowing
lecture editing to continue.

## Related

- [Image review](image-review.md) — why logo assets were removed.
- [Figures](../authoring/figures.md) — the book's own drawing sources.
