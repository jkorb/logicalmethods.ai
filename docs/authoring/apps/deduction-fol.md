# First-order proof teaching

Use `name="deduction" language="fol"` for quantifier and identity rules.
`kind="rules"` shows only ∀, ∃, and identity, starting on ∀. Proof canvases
put those groups first and keep the propositional rules available.
Chapter 9 uses read-only worked examples and Lean walkthroughs; proof
construction and translation practice are in the exercises.
The examples include Socrates, quantifier distribution, existential witnesses,
classical duality, nonemptiness, identity substitution, and symmetry.
`deck="exercises"` uses the twelve laws in `deduction-fol-exercises.js`, grouped
into duality, distribution, and interaction. Practice, worked solutions, and
Lean translation share the same checked data.

## Semantic declarations in Lean

Exports use `Domain : Type`, predicates of type `Domain → Prop`, functions
between domain objects, and named objects. The reader also accepts `Term` in
older saved examples. `[Inhabited Domain]` makes `default` available as an
object; export includes it when the proof uses `default`. Ordinary named
objects and bound witnesses do not require that declaration.

The teaching reader accepts `intro`, `apply`, `exact`, typed `have` subproofs,
`Exists.intro`, `Exists.elim`, and `Classical.byContradiction`. Identity uses
`rfl` and `Eq.subst`. A named local predicate (`let property (x : Domain) :
Prop := …`) records the substitution formula when only selected occurrences
change. Export uses tactic subproofs, including for quantifier
elimination and proof by cases, without anonymous function notation.

Identity elimination stores a substitution formula and a placeholder variable.
The checker verifies its left instance against the premise and forms its right
instance, rejecting capture. Lean import reconstructs that formula from the
source and expected target. Save/load, deletion, and lemma replay recheck it.

Compact atoms such as `Rxy` and `Px` are displayed as `R(x, y)` and `P(x)`;
a single capital predicate letter is followed by one to three variable arguments.
Capture is rejected, without changing the requested witness term or the proof.

Walkthroughs highlight the commands for Socrates, witness elimination,
nonemptiness, classical duality, and identity substitution. The browser checks
natural deduction; Open in Lean delegates kernel checking to Lean itself.
General Lean elaboration, arbitrary typeclasses, and Mathlib remain unsupported.
The final Boolean verification section instead links complete native Lean code
to the playground: typed `have step_n` subproofs use `rfl`, `Eq.subst`, and the
library congruence theorem `congrArg`, first proved from `Eq.subst` and `rfl`. It has no ND translation. Its concluding
`simp` example introduces further reading on automation. The exercise sheet
provides independent Lean templates and solutions for all twelve ND levels,
empty-type counterexamples, and the advanced Boolean verification tasks.

## Related

- [Natural deduction and Lean](deduction.md)
- [Goals and canvas layout](deduction-goals.md)
- [First-order inference](fol-inference.md)
