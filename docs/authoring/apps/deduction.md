# Natural deduction and Lean

`logic-app name="deduction"` uses these modes:

- `kind="rules"`: compact rule reference, grouped by connective.
- `kind="worked"`: centered, read-only derivations with stepping above the tree. Without a deck, only the selected example
  is shown; `display="full"` opens the entire proof without step controls.
- `kind="canvas"` (default), `kind="practice"`: checked construction for examples
  or exercise levels. The solution must use only the task's allowed premises.
- `kind="sandbox"`: empty scratchpad with no target.
- `kind="lean"`: construction canvas and bidirectional Lean translation.
- `kind="lean-walkthrough"`: follow the heating tactics through their goals and
  the checked derivation. `code="previous"` copies the preceding Lean block into the app and highlights
  the copy, leaving the original code and its link in the text;
  otherwise the app supplies its code. Also available on the Lean tool page.

`example` selects a starting example. `deck="exercises"` uses the fifteen
exercise targets, grouped into tabs; `deck="strategies"` uses the author's
worked-out derivation advice. Data live in `deduction-examples.js` and
`deduction-exercises.js`. `title` supplies the accessible region name.
The reusable tools have pages under `/tools/`; the canvas page also includes
the rule reference. Worked examples stay in the chapter and solutions.

## Controls and data

The Rules button sits over the upper-right corner of the vertically resizable
canvas and opens its movable menu. Click a rule to apply it. Lemma save/load
controls use icons with accessible names and tooltips. Selection badges show premise order for order-sensitive rules such as conjunction introduction. Conditional and negation elimination identify premise roles; case elimination matches the selected case assumptions. Applying a rule (including Assumption or a
saved lemma) clears the selection. Formula spans in menus and prompts use the
formal font. Rule previews use top-layer popovers, positioned within the viewport
so the scrollable rules menu cannot clip them. Positioning follows scrolling
and resizing; Escape and leaving the rule dismiss the preview. Additional formulas use
a compact in-canvas panel; discharge choices are made by clicking assumption nodes.
For → Intro, Vacuous discharge accepts an unused antecedent without selecting
a node. It records and discharges a fresh assumption, preserving all existing
dependencies, even when an open assumption has the same formula.
Panels and the rules menu move by dragging their headings (or using arrow keys
with the heading focused). Hint opens a panel too. Right-clicking a formula offers
rules applicable to the current selection; the ordinary menu remains available.
A green plus follows the pointer over blank canvas space. All selections supply
the conclusions of premise derivations, including rules with discharge. Assumption is the first rule; clicking blank space on an interactive canvas opens
it too. Selected nodes have a delete control which also removes dependents. ×2 repeats
the last selected premise, allowing two uses of the same assumption.
Worked displays never expose editing controls. Open dependencies appear below the
canvas as the union of dependencies of all displayed derivations, including
independent scratch work; text alternatives use the shared accessibility icon.

Save downloads the proof, level drafts and saved lemmas. Load rechecks the data;
Load lemmas imports only rules. Save lemma records the selected derivation as a
proved rule, whose open assumptions become premises. Single capital letters
are metavariables, matched consistently against selected inputs. Other atoms
are literal. Missing substitutions are requested. Rule application substitutes
and replays the proof with the supplied derivations in place of its open
assumptions. Local discharge labels are fresh and branch-scoped, so they cannot
discharge assumptions inside supplied derivations. No conditional-introduction
or elimination steps are added around the saved proof.

`logic/deduction.js` is the DOM-independent checker. Version 1 JSON records
formula ASTs, rules, earlier parents and discharge IDs. Import replays every
step and recomputes dependencies. Discharge is branch-local for cases; equal
formulas with distinct labels remain distinct assumptions. Quantifier support
will require substitution and freshness checks before UI controls are added.

The camera uses the shared PNG exporter. LaTeX exports the selected derivation
as a standalone document using `proof.sty`. Tests do not capture screenshots.

## Lean boundary

`deduction-lean.js` emits Lean 4 and reads one propositional `example`, declared
variables, named assumptions, `intro`, `apply`, `exact`, constructor terms,
function applications and `fun h => term`. Unsupported syntax, axioms and holes
are rejected. The browser runs the ND checker, not Lean's kernel. Generated code
uses the standard Lean code box and badge; its floating pencil exposes the source. Open in Lean
passes the current code in a URL fragment, only on explicit navigation.

The chapter and exercises also link each Lean block to its populated playground.
Arithmetic, Mathlib imports and general Lean elaboration remain outside the
translator. The math example reproduces Mathlib's proof of Euclid's theorem.

## Validation

`tests/unit/deduction.test.mjs` checks scope, derived substitutions, deletion,
imports, exercise solutions, Lean round trips and LaTeX structure.
`tests/browser/deduction.spec.mjs` checks interactions, file transfers,
accessibility, level progress and populated playground links without images.

See [Goals and canvas layout](deduction-goals.md) for backward plans, fullscreen,
and unfinished Lean exports.
