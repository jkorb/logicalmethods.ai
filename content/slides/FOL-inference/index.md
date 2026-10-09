---
title: FOL Inference
author: Johannes Korbmacher
weight: 90
layout: 'reveal_slides'
summary: 'Lecture 9: FOL consequence and its limits, unification, clause form and resolution, and quantifier proofs in natural deduction and Lean.'
params:
  chapter: FOL-inference
  id: sli-fol-inference
  license: 'CC-BY-4.0'
---

{{< slide title="Learning goals" >}}
## What you'll be able to do

{{< callout type="objectives" >}}
After this lecture and chapter 9, you will be able to:

- Define FOL consequence and explain its decidability issues. *(remember, understand)*
- Apply Robinson's unification algorithm. *(apply)*
- Transform FOL sentences into equisatisfiable clause form. *(apply)*
- Use FOL resolution and factoring to construct refutations. *(apply)*
- Construct natural deduction proofs with the quantifier rules and their side conditions. *(apply, create)*
- Verify quantified inferences and a Boolean algebra argument in Lean. *(apply)*
{{< /callout >}}

{{< slide layout="center" class="slide--centred" title="FOL inference" >}}

{{< img src="/img/drawings/fol_socrates.svg" width="70px" class="deck-corner" alt="Socrates." >}}

## FOL inference

{{< inference >}}
$∀x (Human(x) → Mortal(x))$
$Human(Socrates)$
---
$Mortal(Socrates)$
{{< /inference >}}

&emsp;

{{< inference >}}
$∀x (x < S(x))$
---
$∀x ∃y (x < y)$
{{< /inference >}}

- True in every model of the premises?
- How can a computer establish this?

{{< slide layout="split" class="slide--wide-right" title="FOL consequence" >}}

## FOL consequence

{{< column >}}

{{< callout type="definition" title="FOL consequence" >}}
$Γ ⊨ A$ iff for every $M$ and $v$: if $M, v ⊨ B$ for all $B ∈ Γ$, then
$M, v ⊨ A$.
{{< /callout >}}

{{< column >}}

{{< logic-app name="fol-model" kind="consequence" model="finf-socrates" title="Socrates in an arbitrary model" >}}

{{< slide layout="app" class="slide--snug" title="Countermodels" >}}
## Countermodels

A {{< term "countermodel" "countermodel" >}} makes the premises true and the
conclusion false:
$∀x (Human(x) → Mortal(x)), Mortal(Socrates) ⊭ Human(Socrates)$

{{< logic-app name="fol-model" model="finf-countermodel" kind="evaluate" editable="false" view="sets" formula="((∀x (Human(x) → Mortal(x)) ∧ Mortal(Socrates)) ∧ ¬Human(Socrates))" title="A countermodel to the reversed Socrates inference" >}}

{{< slide layout="split" title="Deciding consequence" >}}

## Deciding consequence

{{< column >}}

{{< callout type="theorem" title="Undecidability" >}}
Consequence is {{< term "undecidable" "undecidable" >}} in FOL:
no algorithm always terminates and correctly decides $Γ ⊨ C$.
{{< /callout >}}

{{< callout type="theorem" title="Semidecidability" >}}
Consequence is {{< term "semidecidability" "semidecidable" >}} in FOL:
an algorithm can confirm every valid inference and accept no invalid
one. On invalid inputs it may run forever.
{{< /callout >}}

{{< column >}}

{{< img src="/img/drawings/finf_turing.svg" width="280px" alt="A Turing machine asks whether it will ever stop." >}}

The {{< term "halting-problem" "halting problem" >}} can be encoded in
FOL inference.

{{< slide title="Unifiers" >}}
## Unifiers

{{< callout type="definition" title="Unifier" >}}
$σ$ is a {{< term "unifier" "unifier" >}} of $A$ and $B$ iff $Aσ$ and $Bσ$ are
the same expression. A {{< term "most-general-unifier" "most general unifier" >}} (MGU)
gives every other unifier by further substitution.
{{< /callout >}}

**Examples**:

- $A = Human(x)$ and $B = Human(Socrates)$. Unifier: $[x/Socrates]$

- $A = R(x, y)$ and $B = R(z, z)$. Unifier $[x/a, y/a, z/a]$, but MGU = $[x/z, y/z]$

- $A = Human(a)$, $B = Mortal(a)$. **No unifier!**

{{< slide layout="app" title="Robinson's algorithm" >}}
## Robinson's algorithm

{{< logic-app name="fol-inference" kind="unify" formula="LiesBetween(Munich, y, z); LiesBetween(x, Milan, Rome)" title="Robinson's algorithm on LiesBetween(Munich, y, z) and LiesBetween(x, Milan, Rome)" >}}

{{< slide title="Clause form" >}}
## Clause form

{{< callout type="definition" title="FOL CNF" >}}
- A {{< term "fol-literal" "literal" >}} is an atomic formula or its negation.
- A {{< term "fol-clause" "clause" >}} $L₁ ∨ … ∨ Lₙ$ reads its variables universally; the empty clause is $⊥$.
- A {{< term "fol-cnf" "FOL CNF" >}} is a conjunction $C₁ ∧ … ∧ Cₘ$ of clauses.
{{< /callout >}}

**Examples:**

- $∀x (Human(x) → Mortal(x))$: the clause $(¬Human(x) ∨ Mortal(x))$
- $∃x Human(x)$: replacing it by $Human(a)$ claims more.

{{< slide layout="split" title="Equisatisfiability" >}}
## Equisatisfiability

{{< callout type="definition" title="Equisatisfiability" >}}
$A$ and $B$ are {{< term "equisatisfiable" "equisatisfiable" >}} iff both have a
model or neither has one.
{{< /callout >}}

{{< column >}}

$∃x Human(x)$ and $Human(sk₁)$, for a fresh $sk₁$:

- A human exists: interpret $sk₁$ as one.
- $Human(sk₁)$ is true: a human exists.

{{< column >}}

{{< img src="/img/drawings/gimmick_mouse.svg" width="90px" alt="A grey cartoon mouse with round ears and a pink-tipped tail." >}}

Not equivalent: with a human in $D$ and $⟦sk₁⟧$ the mouse, $∃x Human(x)$ is
true and $Human(sk₁)$ false.

{{< slide layout="split" title="Skolemization" >}}
## Skolemization

{{< callout type="definition" title="Skolemization rule" >}}
In negation normal form with distinct bound variables, for $∃y B$ within
$∀x₁, …, ∀xₙ$ and a fresh {{< term "skolem-function" "Skolem function" >}} $skᵢ$
(a {{< term "skolem-constant" "Skolem constant" >}} if $n = 0$):

$$
∃y B ⟹ B[y/skᵢ(x₁, …, xₙ)]
$$
{{< /callout >}}

**Rewriting:**

{{< column >}}

- $∀x∃y R(x,y) ⟹ ∀x R(x,sk₁(x))$
- $∃y∀x R(x,y) ⟹ ∀x R(x,sk₁)$

{{< column >}}

{{< img src="/img/drawings/finf_ai_quantifier_elimination.svg" width="200px" alt="A robot ushers the quantifiers out." >}}

{{< slide layout="app" title="Skolemization, step by step" >}}
## Skolemization, step by step

{{< logic-app name="fol-inference" kind="skolem" title="Skolemization, one rewrite at a time" >}}

{{< slide layout="app" class="slide--snug" title="FOL resolution" >}}
## FOL resolution

{{< callout type="definition" title="Reduction of FOL consequence" >}}

$P₁, …, Pₙ ⊨ C$ iff ${P₁, …, Pₙ, ¬C}$ is FOL unsatisfiable.

{{< /callout >}}

{{< logic-app name="fol-inference" kind="resolution-rule" title="Resolution and factoring rules" >}}

{{< slide layout="app" title="Refutations" >}}
## Refutations

{{< logic-app name="sat" language="fol" kind="resolution" title="FOL resolution: Socrates and PolyphemOS" >}}

{{< slide title="Refutation completeness" >}}
## Refutation completeness

{{< callout type="theorem" title="Refutation completeness" >}}
For equality-free clauses, resolution with MGUs,
{{< term "standardizing-apart" "standardizing apart" >}} and
{{< term "factoring" "factoring" >}} is sound and refutation-complete: every
unsatisfiable finite clause set has a derivation of $⊥$.
{{< /callout >}}

- Standardizing apart: $¬P(f(x))$, renamed $¬P(f(y))$, resolves with $P(x)$ by $[x/f(y)]$.
- Factoring: $(P(x) ∨ P(y))$ becomes $P(y)$ by $[x/y]$.
- {{< term "fair-search" "Fair search" >}} finds a refutation if there is one, and may run forever on $P(a)$, $P(f(a))$, …

{{< slide layout="app" class="slide--snug" title="Quantifier rules" >}}
## Quantifier rules

{{< callout type="theorem" title="FOL completeness" >}}
Classical natural deduction with the quantifier and identity rules is sound
and complete:
$Γ ⊢ A$ iff $Γ ⊨ A$.
{{< /callout >}}

{{< logic-app name="deduction" language="fol" kind="rules" title="Quantifier and identity rules" >}}

{{< slide title="Side conditions" >}}
## Side conditions

{{< inference-rules caption="Blocked by a side condition" >}}
[
  {"name":"$∀ Intro$", "invalid":true, "premises":["$x < z$"], "conclusion":"$∀x (x < z)$", "explanation":"$x$ must not be free in an open assumption."},
  {"name":"$∀ Elim$", "invalid":true, "premises":["$∀x∃y (x < y)$"], "conclusion":"$∃y (y < y)$", "explanation":"The term must be free for $x$: here $∃y$ captures $y$. $∃ Intro$ has the same condition."},
  {"name":"$∃ Elim$", "invalid":true, "premises":["$∃y (x < y)$", "$[x < z]$"], "conclusion":"$x < z$", "explanation":"The witness $z$ must be fresh: not free in the conclusion, in the existential premise, or in an open assumption."}
]
{{< /inference-rules >}}

{{< slide layout="app" title="Two quantifiers" >}}
## Two quantifiers

{{< logic-app name="deduction" language="fol" kind="worked" example="switcheroo" title="Plan a proof with two quantifiers" >}}

{{< slide layout="app" title="Quantifiers in Lean" >}}
## Quantifiers in Lean

{{< logic-app name="deduction" language="fol" kind="lean-walkthrough" example="witness" code="previous" title="Lean and an unknown existential witness" >}}

{{< slide title="A Boolean law in Lean" >}}
## A Boolean law in Lean

```lean
example : ∀ x : Bool, (!!x) = x := by
  intro x
  have step_1 : (!!x) = (!!x) := by
    rfl
  have step_2 : (!!x) = ((!!x) && true) := by
    exact Eq.subst (Eq.symm (Bool.and_true (!!x))) step_1
  -- steps 3 to 12: distributivity, complementation, identity, commutativity
  have step_13 : (!!x) = x := by
    exact Eq.subst (Eq.symm step_12) step_6
  exact step_13
```

- Each `have` states and proves one step of the derivation of $!!NOT!! !!NOT!! X = X$.
- `by simp` finds a proof; Lean's kernel checks it.

{{< lean-playground text="Open the full proof in" >}}
example : ∀ x : Bool, (!!x) = x := by
  intro x
  have step_1 : (!!x) = (!!x) := by
    rfl
  have step_2 : (!!x) = ((!!x) && true) := by
    exact Eq.subst (Eq.symm (Bool.and_true (!!x))) step_1
  have step_3 : (!!x) = ((!!x) && (x || !x)) := by
    exact Eq.subst (congrArg (Bool.and (!!x)) (Eq.symm (Bool.or_not_self x))) step_2
  have step_4 : (!!x) = (((!!x) && x) || ((!!x) && !x)) := by
    exact Eq.subst (Bool.and_or_distrib_left (!!x) x (!x)) step_3
  have step_5 : (!!x) = (((!!x) && x) || false) := by
    exact Eq.subst (congrArg (Bool.or ((!!x) && x)) (Bool.not_and_self (!x))) step_4
  have step_6 : (!!x) = ((!!x) && x) := by
    exact Eq.subst (Bool.or_false ((!!x) && x)) step_5
  have step_7 : x = (x && true) := by
    exact Eq.symm (Bool.and_true x)
  have step_8 : x = (x && ((!!x) || !x)) := by
    exact Eq.subst (congrArg (Bool.and x) (Eq.symm (Bool.not_or_self (!x)))) step_7
  have step_9 : x = ((x && (!!x)) || (x && !x)) := by
    exact Eq.subst (Bool.and_or_distrib_left x (!!x) (!x)) step_8
  have step_10 : x = ((x && (!!x)) || false) := by
    exact Eq.subst (congrArg (Bool.or (x && (!!x))) (Bool.and_not_self x)) step_9
  have step_11 : x = (x && (!!x)) := by
    exact Eq.subst (Bool.or_false (x && (!!x))) step_10
  have step_12 : x = ((!!x) && x) := by
    exact Eq.subst (Bool.and_comm x (!!x)) step_11
  have step_13 : (!!x) = x := by
    exact Eq.subst (Eq.symm step_12) step_6
  exact step_13
{{< /lean-playground >}}
