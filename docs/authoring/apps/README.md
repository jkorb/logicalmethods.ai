# Interactive chapter apps

Shortcode-driven components used in textbook pages and exercise solutions.

## The `logic-app` family

- [The parser](parser.md) — `name="parser"`, strict and conventional grammars.
- [The LaTeX drill](latex-game.md) — `name="latex-game"`.
- [The formula builder](formula-builder.md) — `name="builder"`.
- [Introductory exercise apps](exercise-apps.md) — notation practice, pseudocode, shunting yard, reasoning practice.

- [SAT exercises](sat-practice.md) — table construction, gaps, mystery formulas, and student-controlled resolution.
- [SAT apps](sat.md) — truth-tables, normal-form rewriting, formula-based resolution, Tseytin conversion.
- [Boolean chapter apps](boolean.md) — derivations, evaluation trees, model spaces.
- [Boolean circuits and workbench](boolean-circuits.md) — relays, adders, circuit construction.

## Standalone shortcodes

- [Static syntax trees](syntax-trees.md) — `syntax-tree`.
- [Sets with pictures](sets.md) — `set`, including `expression=true`.
- [The tree terminology gadget](tree-guide.md) — `tree-guide`.
- [Annotated symbol groups](annotated-math.md) — `annotated-math`.
- [Set diagrams](set-diagrams.md) — `set-diagram`.
- [Function tables](function-tables.md) — finite operation tables and written addition.
- [Inference overviews](inference-rules.md) — `inference-rules`.

## PNG downloads

Boolean, parser, formula-builder and shunting-yard apps have a camera button
to download their current rendered state as a PNG at twice the displayed
resolution. `export-image.js` uses the pinned `html-to-image` dependency to
capture the diagram area, excluding surrounding controls and feedback. Apps
without a separate diagram area capture their working area. Hidden content, utility
controls and confetti are omitted. Capture runs locally without changing
the live app. PNGs are images, not editable app saves.

## Adding an app

The shortcode triggers page-local CSS and a Hugo-bundled JavaScript entry.
Register new apps in `assets/js/apps/index.js`, add their markup as
`layouts/partials/apps/<name>.html`, and extend the shortcode's supported
names. App code must be scoped to its root element; it must not
claim document-wide IDs or change other fields. Pure logical operations live
in `assets/js/logic/`; `parseFormula`, `traceParse`, and `printFormula` are
exported from `parser.js` for reuse without a browser. The trace and the app
use the same parsing implementation.

## Related

- [Chapter apps](../../design/chapter-apps.md) — the panel, its layout and tokens.
- [Tools appendix](../tools-appendix.md) — which apps belong in Appendix C.
