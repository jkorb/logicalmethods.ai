# Perceptron exercises

`logic-app name="perceptron" kind="practice"` reuses the
[chapter app](perceptron.md) in the [chapter 12 exercises](../../../content/exercises/neural-networks/index.md).
Set `exercise` to `implement`, `separate`, or `blackbox`, with a unique accessible `title`.

Construction has five levels: NAND, NOR, ANDNOT, three-input majority, and
exactly one of three. Exactly one supplies two hidden units. All parameters
start at zero. Test input records only the selected row; parameter edits clear
the recorded outputs. Check requires a complete table. All three exercises keep
each level's work and completion mark when switching levels while the page is
open. Reset clears only the current level.

Separation supplies truth-tables and unlabelled points for NAND, three unnamed
two-input functions (P, XOR, and Q → P), All equal, majority, and exactly one.
All equal is 1 only at 000 and 111. Returning to a level restores its labels,
separator, cube view, and feedback.
Students cycle point labels with a click, Enter, or Space. Correct labels unlock
a draggable line or plane with rotation handles, sliders, and number inputs.
Dragging works with mouse or touch; arrow keys move focused handles. All three
input methods update the same coefficients. Shading marks output 0 in red and
output 1 in green across a domain larger than the Boolean square or cube.
Cube rotation and tilt both wrap through 360°, using sliders, number fields,
or dragging empty graph space. Arrow keys also rotate the focused cube view.
Rotation preserves labels, parameters, and completion; visible shaded faces
and point depth order follow the view. Check separator uses the strict step
convention; Not separable checks the level's classification.
Written solutions explain the geometry. The SVG uses accessible point buttons.

Black-box levels require both a formula and a matching network. Queried outputs
remain fixed when switching to Your network, changing its parameters, or choosing
one perceptron or two hidden units. The formula checker accepts any equivalent
formula over the displayed atoms, including LaTeX input. A correct formula
unlocks construction; the completion mark requires testing the constructed
network on every row. Test input sits beneath the diagram; the structure choices
sit beneath Your network. Parameter edits clear only the constructed network's
observations. Formula edits lock construction until the new answer is checked.
Switching network structures also preserves each structure's parameters and
tested outputs. Reset clears both structures for the current level.

Level data and checks live in [`perceptron-practice.js`](../../../assets/js/logic/perceptron-practice.js);
the coordinate workspace is [`perceptron-separation.js`](../../../assets/js/apps/perceptron-separation.js).
Chapter demonstration modes retain automatic tables and rule extraction.

Run `npm run check`, then `npm run test:browser -- tests/browser/perceptron.spec.mjs tests/browser/perceptron-practice.spec.mjs tests/browser/a11y.spec.mjs`.
