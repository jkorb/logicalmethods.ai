# Perceptron apps

`logic-app name="perceptron"` illustrates Boolean threshold networks in
[chapter 12](../../../content/textbook/neural-networks/index.md).
Every interactive Boolean unit uses `step(z) = 1` for `z > 0`, and `0` otherwise.

| `kind` | Interaction |
| --- | --- |
| `step` | Static graph, with an open point at `(0, 1)` and a filled point at `(0, 0)`. |
| `probability` | Change cloud cover and edit a sigmoid neuron’s weight and bias; compare its estimated rain probabilities with five invented reference values. |
| `sigmoid` | Static logistic curve, approaching 0 and 1 and passing through `(0, 0.5)`. |
| `separating-line` | Static conjunction plot with the separating line `x₁ + x₂ = 1.5`. |
| `unit` | Toggle input nodes; edit weights beside connections and bias beside the neuron. |
| `gates` | Choose AND, OR, NOT, or IF, then edit parameters. |
| `separation` | Try weights against XOR, with a boundary plot and row mismatches. |
| `layers` | Inspect and edit the OR/AND hidden-layer implementation of XOR. |
| `table` | Choose AND, OR, XOR, XNOR, or IF, or edit a two-input truth-table; construct one detector per positive row, with a single output unit for constants. |
| `kb` | Check `{R → W, S → W}`, equivalently `(R ∨ S) → W`, with one perceptron. |
| `blackbox` | Query a fixed XOR network; extract row rules and a complete DNF. |

For the exercise sheet, use [perceptron practice](perceptron-practice.md).

Use `title` for the accessible name; apps have no visible title. Each app has
its own inputs and reset. Native buttons and number fields share the SVG
diagram’s coordinate space. Weight fields have a blue fill and border and sit
beside connections, clear of wires and other controls. Editing a number keeps
focus, including while the field is empty.
All visible networks allow parameter edits. In networks with more than two
hidden units, select a hidden neuron to reveal its incoming weights.
Editing a target truth-table rebuilds the network from that table.

The output unit shows its weighted sum `z`, followed by an activation icon
and an arrow carrying `y`. Connections use the circuit apps’ signal convention:
active wires have green moving dashes; inactive wires are solid red. The pause
control and reduced-motion preference stop the animation.

Truth-tables fit their contents, with a header rule and a divider after the inputs.
The network and table stay side by side in a compact canvas. On narrow screens,
the canvas pans horizontally rather than stacking the two. Diagrams scale to
fit their column; the zoom button enlarges them for inspection and returns to fit.
Fullscreen uses the browser API, with a modal dialog fallback. Both keep edits
and restore the inline view on exit. Presets share one row, including All 0/All 1;
reset, animation, zoom and fullscreen form a separate aligned control group.
Unknown black-box rows remain `?` until queried. A biconditional appears
only when every input has been tested.

Calculations and truth-table compilation live in
[`assets/js/logic/perceptron.js`](../../../assets/js/logic/perceptron.js).
The Boolean app constructs fixed parameters from a table; it does not train a network.
The probability example also starts with chosen parameters (weight 5, bias −2.5).
It uses sigmoid activation, with a continuous input slider and a graph beside
the network. Reference probabilities are invented, not observations. Edits
change the estimate curve while the reference points stay fixed.
Constants use no hidden units: the output bias alone supplies 0 or 1.

Run `npm run check`, then
`npm run test:browser -- tests/browser/perceptron.spec.mjs tests/browser/a11y.spec.mjs`.
Unit tests check all two- and three-input truth-functions. Browser tests cover
edits, unknown rows, extraction, keyboard controls, themes, and narrow screens.
