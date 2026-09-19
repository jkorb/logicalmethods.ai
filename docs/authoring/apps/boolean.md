# Boolean chapter apps

Use `logic-app name="boolean"` with a `kind`. These open displays have no visible
heading or enclosing border. Selectors use buttons, navigation uses icons, and
an icon reveals a text alternative. Introduce the activity in surrounding prose.

| Kind | Parameters and behavior |
| --- | --- |
| `derivation` | `preset="double-negation"` (default). Numbered lines unfold cumulatively with current-line emphasis and sticky navigation. |
| `evaluation` | `formula="SUN ∨ (RAIN ∧ ¬SUN)"`. Named atoms and conventional precedence, with 0/1 valuation buttons. `preset="practice"` loads examples from `data/boolean-evaluations.json`. |
| `models` | `preset="propositions"` (default), `ds`, or `fallacy`: separate four-world walkthroughs placed beside their explanations. |
| `model-exercise` | Select all required worlds, then check. `variables="3"` adds WIND using `bool_three_valued_models.svg`; model numbers run left to right, M₁–M₄ above M₅–M₈. `preset="custom"` provides a separate inference-writing activity. |
| `circuit`, `two-bit`, `ripple-adder`, `workbench` | See [circuits and the workbench](boolean-circuits.md). |

The proposition explorer starts with the unselected space; only individual propositions
have selection buttons. Model demonstrations use selectors without step navigation.
The selected proposition has a blue rounded boundary; its immediate component
propositions have lighter dashed gray boundaries. The explanation displays the
corresponding union, intersection or complement calculation. World membership uses
static dashed blue rings; countermodels use red rings. Intersections of premises
have their own outline and set-notation selector.

Derivations use formula/justification pairs in `data/boolean-derivations.json`;
the complete derivation also renders without JavaScript. Evaluation shares the
parser's grammar and `tree-renderer.js`: node labels remain syntactic symbols,
while valuations appear outside the nodes. A postorder trace calculates children
before parents. Editing a formula clears stale output; valuation changes restart
the calculation. Explanations and navigation sit beside the tree.

The four worlds are M₁=(1,1), M₂=(1,0), M₃=(0,1), M₄=(0,0), in SUN/RAIN order.
The three-variable exercise repeats this order with WIND=0, then WIND=1 (M₅–M₈).
In the supplied eight-world artwork, the rows vary SUN and the columns vary
WIND/RAIN: (1,1), (0,1), (1,0), (0,0). The four-world space outlines
SUN, RAIN, their complements and selected compound propositions.
Worlds render fixed cells of the intact source SVG through local clip paths and
`use` references. Never regroup its strokes using live bounding boxes: individual
icon fragments must keep their original transforms and paint order.
Membership comes from evaluation, never coordinates. Inference calculations reuse
the set-diagram intersection and countermodel queries.

Exercises check exact selections, including an empty set. Custom inferences use
one textarea: premises on separate lines and a final `∴` conclusion. They accept
up to eight premises and only the variables in the displayed space. The applied inference is the read-only textarea itself, unlocked by an edit
icon. Editing disables checking until the new inference is applied. Curated
exercise selectors show formulas/inferences and retain a checkmark after success.
Correct answers receive a persistent green check and the shared brief confetti
burst; reduced-motion users receive the static feedback only.

`kind="models" preset="rgb"` explores the eight binary RGB valuations, with a
color swatch and an explicitly recorded valuation table.

Pure semantics live in `assets/js/logic/boolean.js`. App state is local to each
root, with no saved browser state. Without JavaScript, the chapter's definitions,
worked calculations and valuation table remain available.
