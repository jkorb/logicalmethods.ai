# Chapter apps

The `logic-app` shortcode loads page-local interactive tools in an open notebook
layout. Some older tools retain bordered internal controls and status panels.
App CSS is loaded only on pages containing that shortcode, uses the site's
color and font tokens, and stays scoped to `.logic-app`. Formula inputs and
SVG tree labels use `--font-formal`. A dashed outline marks the current tree
node; color is supplementary. Trees scroll inside their panel when they grow,
with a keyboard-focusable scroll region and a nested text equivalent.
Navigation uses named native buttons, and explanations use a polite live region.

Parser panels center the input and tree. Native icon navigation sits above the
step explanation, followed by the growing tree, so the controls stay in place.
The explanation uses a two-column definition list for “Current part” and “Next
step”, followed by prose. The formula input keeps its accessible name without
a visible label. During parsing it is read-only, with a muted paper background;
the inline pencil enables editing. An accessibility icon in the panel's lower
right switches to the text tree. A separate checkbox switches between operators
and full formulas at nodes, without changing the parsing history.

On desktop viewports at least 60rem wide, the parser places its scrollable tree
and current-step explanation side by side below the controls. Smaller viewports
stack them.

## Input and edit controls

Formula fields use `logic-app__input-wrap` with an inline `logic-app__edit`
pencil at the right edge. Parser, SAT, FOL satisfaction, and exercise binding
fields hide that pencil while editing and restore it after submission. Query
fields remain editable. Conditional knowledge bases place their pencil inside
the displayed knowledge base; it also unlocks the goal. Planning uses one form
control for its multiple inputs. SQL and Lean retain their code-block pencils.

## Static syntax trees

Static `syntax-tree` figures use nested HTML lists and CSS edges, with the
same formal font and theme tokens. Their stylesheet is page-local and scoped
to `.syntax-tree` and `.ast-comparison`. They require no JavaScript.

## Related

- [Interactive chapter apps](../authoring/apps/README.md) — the shortcodes and their options.
- [Display mathematics](display-math.md), [Pickers and compact tools](pickers.md).

- [Boolean apps](../authoring/apps/boolean.md) — derivations, evaluation, model spaces, and circuits use open displays.

## Input height and SAT tables

Textareas throughout the site use content sizing: one line for short input,
growing for wrapping and explicit line breaks, and shrinking when text is removed.
A shared fallback handles input, width changes, and newly revealed controls in
browsers without native content sizing. Formula bars use compact textareas; frozen fields cannot receive pointer or
keyboard focus. The in-field pencil enables editing. Their shared helper also
resizes programmatic example changes and handles Enter submission for former
single-line inputs.

SAT tables rule the boundary between valuation columns and formula columns.
Three-variable or long-formula examples use numbered formula keys with a visible
legend beside the table. Values retain their normal font size; large custom tables
can scroll internally. Row numbers are quiet native buttons, with keyboard focus
and selected state. Current rows and rewrite lines use the Boolean derivation's
blue wash, rounded ends, and left-edge stroke; the current value has an underline.
