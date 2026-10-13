# K₃ natural deduction

Use `logic-app name="deduction" logic="k3"` with `kind="rules"`, `worked`,
`canvas`, `practice`, or `sandbox`. Classical logic remains the default.
K₃ cannot be combined with `language="fol"` or the Lean modes.

The rules follow §§3 and 6 of Graham Priest’s *Natural Deduction Systems for
Logics in the FDE Family*: [author manuscript](https://grahampriest.net/?ddownload=3082),
[published chapter](https://doi.org/10.1007/978-3-030-31136-0_16).
They comprise ordinary ∧/∨ introduction and elimination, double negation and
both De Morgan equivalences in both directions, and Explosion from separate premises A and ¬A to C, in either order.
There are no ⊥/⊤ or primitive conditional rules. Write A → B as ¬A ∨ B.

`assets/js/logic/deduction-k3.js` supplies rule schemata and nine examples:
disjunctive syllogism (`k3-ds`), negated disjunction (`k3-negative`), double
negation (`k3-dn`), reverse De Morgan (`k3-demorgan`), nested negation
(`k3-swap`), material modus ponens (`k3-mp`), and negated conjunction
(`k3-negative-cases`), material contraposition (`k3-contraposition`), and
negated negative conjunction (`k3-negative-disjunction`). `example` selects one; `deck="examples"` or
`deck="exercises"` exposes the grouped picker. Practice uses the usual checked
completion, draft retention, and feedback.

The shared proof checker enforces the selected logic, including on imported
proofs, lemmas, deleted-step reconstruction, and backward goals. K₃ version-1
proofs carry `logic: "k3"`; a missing marker means classical. Cross-logic imports
are rejected. Cases retain branch-local discharge. PNG, LaTeX, reset, fullscreen,
and workspace downloads use the existing canvas controls.

Unit tests check all examples against all nine SUN/RAIN states, rule shapes,
mode boundaries, and backward plans. Browser tests cover the rule menu,
construction, exercises, and workspace loading.
