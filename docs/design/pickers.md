# Pickers and compact teaching tools

All course pickers share `assets/css/pickers.css`: slides, notation practice and
the local editor lecture picker use the same rounded gray surface
(`--picker-surface`) with native disclosure keyboard access. Native selects
receive a matching baseline style. Shared assets use fingerprinted relative URLs
so local previews cannot accidentally load an older live-site stylesheet.

## Related

- [Chapter apps](chapter-apps.md) — the parser's side-by-side desktop layout.
- [Local slide viewer](slide-viewer.md).

Use visible buttons for chapter-app choices, as in bracket practice, Boolean
apps and set diagrams. The slide viewer keeps its picker for its longer list
of slides.

## Exercise controls

Short lists of modes use labelled buttons, with `aria-pressed` and the blue
selection wash. Conditional exercise checkboxes use paper backgrounds, ink
borders and a blue check mark; native black control surfaces must not leak into
the app. Their forced-colours fallback restores native checkboxes. Remaining
selects use an explicit chevron, paper/ink colours and themed options.

Selection over a drawing must leave the drawing visible: keep the hit area
transparent in normal, hover, focus and selected states. Put the selection wash
on a caption or use an outline. Wason's SVG strokes retain a fixed screen width
so shrinking the drawing does not turn its lines into faint hairlines.
