# Design language

The site is a squared exercise book. The course material began as handwritten
lecture notes, so the site is built to look like the notebook a student carries out
of the lecture: warm paper, a faint 5&nbsp;mm grid, a red margin rule, and the
lecturer's own drawings on top of it.

Two rules hold the whole thing together:

1. **The chrome stays quiet so the drawings read as the design.** Furniture is
   paper, hairlines and small type. Color and hand-drawn strokes are reserved for
   content and for the mascot.
2. **Nothing ships that a keyboard or a screen reader cannot use.** Accessibility
   is enforced by tests, not by review; see [Testing](../testing/README.md).

## Foundations

Everything builds on `assets/css/tokens.css`. It loads after Bootstrap so its
values win. Do not hard-code a color, size or font anywhere else — add or reuse
a token.

- [Color](color.md) — the two-tier accent palette and its contrast budget.
- [Typography](typography.md) — the four faces, the size scale, self-hosting.
- [Focus, motion and contrast](focus-and-motion.md) — user-preference modes.
- [Dark mode](dark-mode.md) — the three theme states.

## Structure

- [Layout](layout.md) — the shell, the column widths, what must scroll.
- [Components](components.md) — the furniture and which partial owns it.
- [Render hooks](render-hooks.md) — what each Markdown hook emits.
- [The mascot](mascot.md) — the poses and what they do.

## Content surfaces

- [Notation](notation.md) — which face each kind of text gets, and why.
- [The notation font](notation-font.md) — Comic Shanns Logic and what it bought.
- [Figures](figures.md) — inlined SVG, the `.book-figure` wrapper, dark mode.
- [Tables](tables.md) — hand-ruled tables and the notation reference.
- [Code blocks](code-blocks.md) — the badge shell and the Lean keyword pass.
- [Display mathematics](display-math.md) — fitting formulas to the column.
- [Further readings](further-readings.md) — the calmed closing section.

## Interaction

- [Chapter apps](chapter-apps.md) — the `logic-app` panel and static trees.
- [Glossary](glossary.md) — term links, previews, and search.
- [Reveal.js deck theme](../slides/reveal/theme.md) — lecture slides in the book's style.
- [Local slide viewer](slide-viewer.md) — the deprecated Excalidraw viewer.
- [Pickers and compact tools](pickers.md).
- [Finite set diagrams](set-diagrams.md).

## Scope

- [Excluded from the redesign](exclusions.md).
- [When you change something](changing-things.md).
