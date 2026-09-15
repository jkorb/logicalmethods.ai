# Chapter apps

The `logic-app` shortcode places interactive tools in a bordered paper panel.
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

## Static syntax trees

Static `syntax-tree` figures use nested HTML lists and CSS edges, with the
same formal font and theme tokens. Their stylesheet is page-local and scoped
to `.syntax-tree` and `.ast-comparison`. They require no JavaScript.

## Related

- [Interactive chapter apps](../authoring/apps/README.md) — the shortcodes and their options.
- [Display mathematics](display-math.md), [Pickers and compact tools](pickers.md).
