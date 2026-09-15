# Figures

Figures are Excalidraw drawings exported to SVG (`scripts/excalidraw-svg.mjs`).
The `img` shortcode prefers an `.svg` sibling and **inlines** it rather than
linking it, so the figure uses the page's own fonts — an `<img>` cannot — and no
copy of Excalifont has to be embedded per file. Excalidraw exports carry no IDs
or internal references in some older exports; newer exports can contain them.
The shared `drawing` shortcode prefixes these IDs per use to prevent collisions.

A diagram's colours assume a light ground: ink arrows, pale fills. Rather than
distort them in dark mode, the figure sits on its own sheet of paper — the same
treatment the remaining raster figures get, and consistent with the notebook
metaphor.

Book images use `.book-figure`, with floats and dimensions on its wrapper.
The original ink and fills sit on `--figure-paper` in dark mode. Nested set
figures use the formal font for braces, commas and text and can include drawings
as members. Larger sets fit to the column, with scrolling as a fallback.

The `img` shortcode and the set renderer share `figures/image.html`. Bundle and
shared assets get the same wrapper, spacing, width clamp and dark paper; SVGs
and remaining PNGs do not have separate layout rules. See
[Figures](../authoring/figures.md) for export and migration instructions.

## Related

- [Exporting from Excalidraw](../authoring/excalidraw-export.md).
- [Display mathematics](display-math.md) — illustrated sets share its rhythm.
