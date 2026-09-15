# Tables

Ruled the way you would rule a table by hand: one stroke between the columns and
one under the header, and nothing else — no row lines, no header fill, no box.
The strokes are SVG masks (`--rule-hand-v`, `--rule-hand-h`), so one asset takes
any colour and stretches to any cell height. Each path starts and ends at the
same offset, so the segments drawn by adjacent cells meet instead of stepping.

**Only tables with a header get ruled.** Every headless table in this book is a
layout grid aligning a formula with its name, and ruling those is noise; the
render hook marks them `.table--headless`. It also drops the empty `<thead>`
Markdown always emits, which would otherwise draw a header rule under nothing.

Scoped to `.table-scroll`, because Chroma renders line numbers as a table too and
that must not be ruled.

One caution for the render hook: Hugo replaces shortcodes with placeholder tokens
before Markdown runs and substitutes the rendered markup back *after* the
template has finished. A header cell containing a figure therefore looks like
plain letters inside the hook, and its `<img>` lands in the `aria-label`
afterwards — unescaped, terminating the attribute. The token is stripped while it
is still a token.

## The notation reference

The Notation appendix uses one reference table with left-aligned readings.
LaTeX commands have their own cheat sheet. Its `.notation-reference` wrapper keeps
a prose-measure minimum inside the shared table scroll region, so phone layouts
scroll horizontally instead of squeezing explanations into narrow columns.

## Related

- [Glossary and notation](../authoring/glossary.md) — what the appendix contains.
