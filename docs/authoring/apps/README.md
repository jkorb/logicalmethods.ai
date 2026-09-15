# Interactive chapter apps

Shortcode-driven components used in textbook pages and exercise solutions.

## The `logic-app` family

- [The parser](parser.md) — `name="parser"`, strict and conventional grammars.
- [The LaTeX drill](latex-game.md) — `name="latex-game"`.
- [The formula builder](formula-builder.md) — `name="builder"`.
- [Introductory exercise apps](exercise-apps.md) — notation practice, shunting yard, reasoning practice.

## Standalone shortcodes

- [Static syntax trees](syntax-trees.md) — `syntax-tree`.
- [Sets with pictures](sets.md) — `set`, including `expression=true`.
- [The tree terminology gadget](tree-guide.md) — `tree-guide`.
- [Annotated symbol groups](annotated-math.md) — `annotated-math`.
- [Set diagrams](set-diagrams.md) — `set-diagram`.
- [Inference overviews](inference-rules.md) — `inference-rules`.

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
