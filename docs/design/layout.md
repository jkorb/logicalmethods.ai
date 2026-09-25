# Layout

`.shell` centers content at `--width-shell` with `--gutter` padding. Inside it:

- `--width-content` (46rem) is the column;
- `--measure` (65ch) caps prose lines;
- `--width-wide` (64rem) is where tables, code and figures may break out.

A chapter page is `rail | article` at ≥75rem and a single column below, where the
rail folds into the offcanvas panel. **`.chapter` sets `inline-size: 100%`
deliberately**: as a bare grid item it resolves wider than its own track once
content carries an intrinsic width, and that pushes the whole page sideways on a
phone.

Three things must scroll inside themselves rather than widening the page:
`div.highlight` (Chroma emits line numbers as a table), `.table-scroll` (from the
table render hook) and display formulas. This is enforced by
`tests/browser/reflow.spec.mjs` at 320&nbsp;px.

Native scrollbars use muted ink on sunken paper throughout the site, including
app panels and code. `tokens.css` supplies standard scrollbar properties and a
WebKit fallback; forced-colors mode keeps the system colors and width.

## Related

- [Code blocks](code-blocks.md), [Tables](tables.md), [Display mathematics](display-math.md).
