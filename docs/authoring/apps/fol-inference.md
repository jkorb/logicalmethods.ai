# First-order inference apps

Chapter 9 shares chapter 8's typed parser trees. Pure operations live in
`assets/js/logic/fol-inference.js`; the browser mount owns only its app root.

The default is a chapter demonstration. Skolemization uses the SAT rewrite player;
unification shows the current equations and substitution with current/next-step
explanations. Both use first/previous/next/last navigation.
Each frame explains one change. Applied input has an in-field pencil, as in SAT. Unification has two input
fields on one row with a question-mark submit button between them; its navigation
sits below. Other inputs retain the compact SAT formula bar.

- `name="fol-inference" kind="unify"` shows equations and accumulated bindings.
- `name="fol-inference" kind="skolem"` shows local rewrites, binder renaming,
  and fresh witnesses with their dependencies.
- Add `mode="practice"` to either for exercises. Students select an equation
  or click the main connective/quantifier of a subformula, then apply an
  operation. The selected scope is outlined. Replacement needs one inline
  field: a fresh variable or a complete witness term such as `sk₁(x)`.
  Invalid moves retain the selection and state; Undo restores the previous
  state. Levels retain drafts and completion marks during the session.
- `name="fol-inference" kind="unify-quiz"` gives six single-choice levels.
  Incorrect choices give a retry prompt; explanations appear after a correct
  choice. Completion marks remain when moving between levels.
- `name="sat" language="fol" kind="resolution"` shows checked resolution and
  factoring steps in the shared proof renderer, highlighting the used pivots.
- `name="sat-practice" language="fol" kind="resolution"` lets students select
  two literal occurrences in the clause box and resolve or factor them.
  Same-clause resolution uses two fresh copies. Factoring uses one clause.
  Undo retains input clauses. Resolve and Factor have visible text labels.
  `deck="exercises"` selects five formalized tasks (two library inferences,
  ancestry, an existential witness, and alternative access rules). An explicit
  `formula` without a deck shows only that problem; chapter examples are the default
  when neither is supplied.

Selection uses native buttons, as in the chapter 2 formula builder. Operation
buttons use icons or mathematical symbols, with accessible names and titles.
There are no equation, subformula, operation, or pivot dropdowns. Short operation
labels follow the chapter order. Undo retains the calculation history internally;
no separate accepted-steps list is shown.

`formula` supplies initial input. Separate formulas or unification partners
with semicolons. `∴` introduces a conclusion, negated before clausification.
Inputs use explicit argument brackets: `P(x)`, `f(x)`, `R(x, y)`. The app infers
arities from brackets, treats capitalized applied symbols as predicates,
lowercase applied symbols as functions, and other bare names as constants.
Variables follow the chapter 8 parser's `x`–`w` convention with optional indices.
This input convention belongs to the teaching tools, not to FOL itself.

Generated Skolem symbols use subscripts (`sk₁`, `sk₂`, …), independently of
bound-variable renaming. The parser and witness field accept these symbols;
ASCII names such as `sk1` remain valid input. Both the formula editor and the
inline witness/renaming field use the shared live LaTeX converter, including
subscripts such as `sk_{1}`.

Resolution requires closed, equality-free input. Skolem symbols are fresh across
all input formulas; witnesses depend on universal binders in lexical scope.
Every resolution use renames both parents apart, including self-resolution.
The whole resolvent receives the MGU. Factoring uses same-sign literals.
Clauses display as disjunctions, with $⊥$ for the empty clause. Preprocessing
runs before the displayed trace; the chapter explains the transformations. The
canvas shows the current inference and renamed parents without history disclosures.
Resolution demonstrations and exercises give the derivation the full app width;
explanations and exercise operations sit underneath at every viewport size.
A fullscreen button sits beside the camera in the derivation corner. Both
chapter demonstrations and exercises retain their state when entering or leaving
fullscreen; F toggles it and Escape exits. Browsers without native fullscreen
use the same fixed overlay as the proof canvases.
`kind="resolution-rule"` renders the resolution and factoring schemas side by
side, wrapping one under the other when the column is narrow.
The practice transition checks live in `logic/fol-practice.js`; rejected moves
leave the state unchanged. Completion must be selected by the student.
Resolution practice stops at 80 clauses, demonstrations at 16 inferences (four for Growing terms), and
distribution at 128 clauses; a stopped search is undecided. It does not extract countermodels. The step chooser is a bounded
teaching search, not an unrestricted fair proof procedure.

Quantifier proofs use the [natural deduction canvas](deduction.md) with
`language="fol"`. All chapter derivations use its renderer. New `finf_` SVGs
retain the author's source diagrams as references; mathematical derivations
are rendered from checked data instead of those images.

## Related

- [App index](README.md), [FOL parser](parser.md), [SAT apps](sat.md).

On tool pages, demonstration and practice instances both start with blank
editable fields and no example or level picker. Unification uses the same two
partner fields in both modes; practice checks the reader's selected operations.
