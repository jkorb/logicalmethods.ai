---
title: Logical proofs
author: Johannes Korbmacher
weight: 70
layout: 'reveal_slides'
summary: 'Lecture 7: proof systems, natural deduction, and checking proofs in Lean.'
params:
  chapter: proofs
  id: sli-proof
  license: 'CC-BY-4.0'
---

{{< slide title="Learning goals" >}}
## What you'll be able to do

{{< callout type="objectives" >}}
After this lecture and chapter 7, you will be able to:

- Explain how a proof system represents step-by-step reasoning. *(understand)*
- Distinguish proof search from proof checking. *(analyse)*
- Construct natural deduction proofs with temporary assumptions and cases. *(apply, create)*
- Describe how types organize terms and their uses. *(understand)*
- Verify propositional arguments in Lean. *(apply)*
- Explain the Curry–Howard correspondence using a derivation and a typed term. *(understand)*
{{< /callout >}}

{{< slide layout="split" title="Checking reasoning" >}}
## Checking reasoning

{{< column >}}

- A proof: every step explicit.
- A machine can search for a proof, or check one.
- An AI proposes a proof; Lean checks it.

{{< column >}}

{{< img src="/img/drawings/proof_jimmy_pi.svg" width="300px" alt="The invalid inference A ∨ B, A, therefore ¬B goes into a proof assistant, which answers: computer says no. A person in a propeller cap looks on." >}}

{{< slide layout="split" title="Step by step" >}}
## Step by step

{{< column >}}

{{< inference >}}
$RAIN$
---
$RAIN ∨ WIND$
{{< /inference >}}

{{< inference >}}
$RAIN ∨ WIND$
$(RAIN ∨ WIND) → COLD$
---
$COLD$
{{< /inference >}}

{{< inference >}}
$COLD$
$COLD → HEATING$
---
$HEATING$
{{< /inference >}}

{{< column >}}

{{< img src="/img/drawings/proof_ai_radiator.svg" width="200px" alt="The course mascot at a rainy window, beside a radiator." >}}

Each conclusion can be used in a later step.

{{< slide layout="split" title="Proof systems" >}}
## Proof systems

{{< callout type="definition" title="Proof system" >}}
A {{< term "proof-calculus" "proof system" >}} specifies the permitted starting
points and inference rules for constructing derivations in a formal language.
A {{< term "proof" "logical proof" >}} or
{{< term "proof" "derivation" >}} is a finite construction of formulas by these
rules, with its assumptions recorded.
{{< /callout >}}

{{< column >}}

- Axiomatic systems: {{< term "axiom" "axioms" >}}, few rules.
- Sequent calculi: judgments about assumptions and conclusions.
- Tableaux, resolution: systematic search.
- Natural deduction: rules for each connective.

{{< column >}}

{{< img src="/img/drawings/proof_euclid.svg" width="220px" alt="The course mascot as Euclid, bearded, at a blackboard showing that the angles of a triangle sum to 180°." >}}

{{< slide title="Derivability" >}}
## Derivability

{{< callout type="definition" title="Derivability" >}}
$Γ ⊢ A$ means that there is a formal proof of $A$ from assumptions in $Γ$ in
the chosen proof system. This relation is called
{{< term "derivability" "derivability" >}}.
{{< /callout >}}

{{< callout type="definition" title="Soundness and completeness" >}}
A proof system is called {{< term "soundness" "sound" >}} iff $Γ ⊨ A$ whenever
$Γ ⊢ A$. And a proof system is called {{< term "completeness" "complete" >}}
iff $Γ ⊢ A$ whenever $Γ ⊨ A$.
{{< /callout >}}

{{< slide layout="app" title="Natural deduction" >}}
## Natural deduction

$(RAIN ∨ WIND) → COLD$, $COLD → HEATING$, $RAIN ⊢ HEATING$

{{< logic-app name="deduction" kind="worked" display="full" example="heating" title="A natural deduction derivation of HEATING" >}}

{{< slide layout="app" title="Introduction and elimination" >}}
## Introduction and elimination

{{< callout type="definition" title="Introduction and elimination" >}}
An {{< term "introduction-rule" "introduction rule" >}} derives a formula
with the relevant connective as its main connective. An
{{< term "elimination-rule" "elimination rule" >}} uses a formula with that
main connective to derive a conclusion.
{{< /callout >}}

{{< logic-app name="deduction" kind="rules" title="Natural deduction rules" >}}

{{< slide layout="center" title="Discharge" >}}
## Discharge

{{< callout type="definition" title="Discharge" >}}
An {{< term "open-assumption" "open assumption" >}} is an assumption on which
a derivation still depends. To {{< term "discharge" "discharge" >}} an
assumption is to remove that dependency by an application of a rule that
permits it. Discharge is marked in a natural deduction proof by surrounding the
assumption with brackets $[ ]$.
{{< /callout >}}

$→ Intro$: assume $A$, derive $B$, conclude $A → B$ and discharge $[A]$.

{{< slide layout="app" title="Temporary assumptions" >}}
## Temporary assumptions

$⊢ RAIN → (RAIN ∨ WIND)$

{{< logic-app name="deduction" kind="worked" example="conditional" title="Discharging an assumption: ⊢ RAIN → (RAIN ∨ WIND)" >}}

{{< slide layout="app" title="Reasoning by cases" >}}
## Reasoning by cases

$SUN ∨ RAIN, ¬SUN ⊢ RAIN$

{{< logic-app name="deduction" kind="worked" example="cases" title="Disjunctive syllogism by cases" >}}

{{< slide layout="app" title="Classical reasoning" >}}
## Classical reasoning

$¬⊥$: a temporary assumption $¬A$ leads to $⊥$, so $A$. Without it: {{< term "intuitionistic-logic" "intuitionistic logic" >}}.

{{< logic-app name="deduction" kind="worked" example="classical" title="Double-negation elimination" >}}

{{< slide title="Finding a derivation" >}}
## Finding a derivation

{{< callout type="theorem" title="Soundness and completeness" >}}
The natural deduction system displayed here, including $¬⊥$, is sound and
complete for classical propositional logic: $Γ ⊢ A$ iff $Γ ⊨ A$.
{{< /callout >}}

A derivation exists; finding it is {{< term "proof-search" "proof search" >}}.
Work backwards from the goal:

- $A ∧ B$: prove each conjunct, then $∧ Intro$.
- $A → B$: assume $A$, prove $B$, then $→ Intro$.
- Stuck: assume the negation of the goal and derive $⊥$.

{{< slide layout="app" title="Construct a derivation" >}}
## Construct a derivation

{{< logic-app name="deduction" kind="canvas" example="swap" title="Construct a natural deduction proof" >}}

{{< slide layout="split" title="Theorem provers" >}}
## Theorem provers

{{< column >}}

### Proof assistants

A {{< term "proof-assistant" "proof assistant" >}}: we guide the construction;
it checks every step. Lean, Rocq, Isabelle.

{{< column >}}

### Automated provers

An {{< term "automated-theorem-prover" "automated theorem prover" >}} searches
for the proof itself: resolution, SAT solving.

{{< slide layout="split" title="Types and type checking" >}}
## Types and type checking

{{< column >}}

{{< callout type="definition" title="Types and terms" >}}
A {{< term "type" "type" >}} classifies terms and determines which
constructions and operations are permitted on them. The judgment $t : A$
says that the {{< term "typed-term" "term" >}} $t$ has type $A$.
{{< /callout >}}

- $n : ℕ$, and $n + 1 : ℕ$.
- $a : A$: a {{< term "proof-term" "proof term" >}} of the proposition $A$.

{{< column >}}

{{< callout type="definition" title="Type checking" >}}
{{< term "type-checking" "Type checking" >}} checks whether a term has a
specified type according to the rules of the type system.
{{< /callout >}}

Proving $A$: constructing a term of type $A$. Checking the proof: checking
its type.

{{< slide layout="app" title="The heating proof in Lean" >}}
## The heating proof in Lean

{{< logic-app name="deduction" kind="lean-walkthrough" title="Following the Lean heating proof through its goals" >}}

{{< slide title="Curry–Howard" >}}
## Curry–Howard

Propositions are types; proofs are programs: the
{{< term "curry-howard" "Curry–Howard correspondence" >}}.

| Natural deduction | Lean command |
| --- | --- |
| $∧ Intro$ | $exact And.intro a b$ |
| $∧ Elim$ | $exact And.left h$, $exact And.right h$ |
| $∨ Intro$ | $exact Or.inl a$, $exact Or.inr b$ |
| $∨ Elim$ | $apply Or.elim h$, then prove both cases |
| $→ Intro$ | $intro a$, then prove $B$ |
| $→ Elim$ | $exact f a$ |

{{< slide title="Automated proving in Lean" >}}
## Automated proving in Lean

```lean
variable (A B : Prop)

example (h : ¬(A ∧ B)) : ¬A ∨ ¬B := by
  grind
```

- $grind$ assumes the negation of the conclusion and searches for a
  contradiction.
- The kernel checks the proof term it finds.

{{< slide layout="app" title="Worked-out example: an indirect proof" >}}
## Worked-out example: an indirect proof

{{< logic-app name="deduction" kind="worked" deck="strategies" example="indirect" title="An indirect proof of ¬(A ∧ B) ⊢ ¬A ∨ ¬B" >}}
