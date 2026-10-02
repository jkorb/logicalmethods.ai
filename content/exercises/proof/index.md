---
title: Logical proofs
author: Johannes Korbmacher
locked: false
weight: 70
params:
  id: exc-proof
---

# Natural deduction {.solved}

Construct a derivation for each inference in the app. The tabs group the
exercises by connective; the numbered buttons select the inference. Your
work is kept when you move between levels. Use Save to keep it for another
visit.

For each derivation, identify its open assumptions and note whether it uses
the classical rule $¬⊥$. Try to avoid that rule when you can.

{{< logic-app name="deduction" kind="practice" deck="exercises" title="Natural deduction exercises" >}}

## Solution {#natural-deductionSolution .solution}

The app below shows one derivation for each inference. Other derivations may
work too. Before stepping through a solution, look at the main connective of
the conclusion and decide which introduction rule might finish the proof.

{{< logic-app name="deduction" kind="worked" deck="exercises" title="Natural deduction solutions" >}}

The distribution laws can be proved by extracting conjuncts and considering
both cases of a disjunction. In each case split, check that both branches
reach the same conclusion before discharging their assumptions.

Of the negation exercises, $¬¬A ⊢ A$ and $¬(A ∧ B) ⊢ ¬A ∨ ¬B$ require
classical reasoning. The others can be proved with the intuitionistic rules.
For $A ⊢ ¬¬A$, for example, assume $¬A$, derive $⊥$ using the given $A$,
and discharge $¬A$. The given assumption $A$ remains open.

Of the conditional exercises, $A → B ⊢ ¬A ∨ B$, $(¬A → A) ⊢ A$, and
$(¬B → ¬A) ⊢ (A → B)$ require classical reasoning. For the last one, assume
$A$, then temporarily assume $¬B$. The premise gives $¬A$, contradicting
$A$. Discharge $¬B$ by the classical rule to obtain $B$, then discharge
$A$ by $→ Intro$.

The solutions adapt the Lean proofs contributed by Alexander Apers.

# Assumptions and discharge {.solved #proof-systems}

1. Someone argues as follows: “Assume $A ∨ B$. In the first case, assume $A$
   and derive $A$. In the second case, assume $B$ and use the $A$ we obtained
   in the first case. Both cases give $A$, so $A ∨ B ⊢ A$.” Where does this
   go wrong? Give a countermodel to the claimed inference.
2. From an assumption $A$, we temporarily assume $B$, repeat $A$, and use
   $→ Intro$ to conclude $B → A$. Which assumption remains open? What
   would we need to do to obtain a formula with no open assumptions?
3. Can a checked proof have a false conclusion? Explain how your answer
   depends on its open assumptions.

## Solution {.solution #proof-systemsSolution}

1. The $A$ in the first case depends on that case's assumption. It is not
   available as a given fact in the second case. Using it there leaves an
   extra $A$ open, so the argument has not derived $A$ from $A ∨ B$ alone.
   Set $v(A)=0$ and $v(B)=1$: the premise is true and the conclusion false.
2. $A$ remains open. Discharging $B$ is permitted even though we never used
   it: this is {{< term "vacuous-discharge" "vacuous discharge" >}}. Discharge
   $A$ in a second application of $→ Intro$ to obtain $A → (B → A)$.
3. Yes, when its open assumptions are false. A proof establishes that the
   conclusion follows from the assumptions. For example, $RAIN$ follows
   from the assumption $RAIN$ even on a sunny day when it isn't raining.
   In a sound system, true open assumptions cannot lead to a false
   conclusion. A proof with no open assumptions establishes a logically
   valid formula.

# Derived rules {.solved}

1. Derive $B$ from $A ∨ B$ and $¬A$. Save the derivation as a rule named
   “Disjunctive syllogism”. Its open assumptions become its premises.
2. Use your saved rule to derive $SNOW$ from $(RAIN ∧ WIND) ∨ SNOW$ and
   $¬(RAIN ∧ WIND)$. Which formulas replace the
   {{< term "metavariable" "metavariables" >}} $A$ and $B$?
3. Save the workspace, restart, and load its lemmas into a fresh workspace.
   Does reusing the rule introduce any new open assumptions beyond the
   premises you supply?

{{< logic-app name="deduction" kind="sandbox" title="Proving and reusing derived rules" >}}

## Solution {.solution #derived-rulesSolution}

1. Split $A ∨ B$ into two cases. Under $A$, use $¬A$ to obtain $⊥$,
   then use $Ex falso$ to obtain $B$. Under $B$, the conclusion is already
   available. Apply $∨ Elim$ and discharge both case assumptions. The
   original $A ∨ B$ and $¬A$ remain open. Select the final $B$ and save it.
2. Here $A$ is replaced by $RAIN ∧ WIND$, and $B$ by $SNOW$. Add the two
   premises, select them in the saved rule's order, and click its button.
   The app substitutes these formulas throughout the checked derivation.
3. No. The rule's two premises are supplied by the selected derivations.
   Their open assumptions are the only assumptions that can remain open.
   The temporary assumptions inside the saved proof are still discharged.
   “Load lemmas” imports the proved rules without replacing your current
   canvas.

# Lean verification {.solved}

For this exercise, you verify your natural deduction inferences using Lean.
Below are templates for the code to use. Each $sorry$ marks an admitted hole,
not a checked proof. Replace every one before submitting your work.

Some proofs use classical reasoning. You can call $Classical.byContradiction$
explicitly, or write $open Classical$ to use its shorter name. Which proofs
actually need the classical principle?

In your proofs, you can use previous theorems using $apply$. Note that theorems
like $distribution_one_rtl$ need to be passed a proof term $h$.

## Conjunction and Disjunction

{{< lean_logo >}}
```lean
  variable (A B C : Prop)

  theorem distribution_one_ltr (h : (A ∧ (B ∨ C))) : (A ∧ B) ∨ (A ∧ C) := by
    sorry

  theorem distribution_one_rtl (h : (A ∧ B) ∨ (A ∧ C) ) : (A ∧ (B ∨ C)) := by
    sorry

  theorem distribution_two_ltr (h : (A ∨ (B ∧ C))) : (A ∨ B) ∧ (A ∨ C) := by
    sorry

  theorem distribution_two_rtl (h : (A ∨ B) ∧ (A ∨ C) ) : (A ∨ (B ∧ C)) := by
    sorry

```
## Negation:

{{< lean_logo >}}
```lean
  variable (A B : Prop)

  theorem double_negation_ltr (h: ¬¬ A) : A := by
    sorry

  theorem double_negation_rtl (h : A) : ¬¬ A := by
    sorry

  theorem de_morgan_one_ltr (h : ¬(A ∧ B)) : (¬ A ∨ ¬ B) := by
    sorry

  theorem de_morgan_one_rtl (h : (¬ A ∨ ¬ B)) : ¬(A ∧ B) := by
    sorry

  theorem de_morgan_two_ltr (h : ¬(A ∨ B)) : (¬ A ∧ ¬ B) := by
    sorry

  theorem de_morgan_two_rtl (h : (¬ A ∧ ¬ B)) :  ¬(A ∨ B) := by
    sorry

```
## Conditionals

{{< lean_logo >}}
```lean
  variable (A B : Prop)

  theorem cond_def_ltr (h : ¬A ∨ B) : A → B := by
    sorry

  theorem cond_def_rtl (h : A → B ) : ¬A ∨ B  := by
    sorry

  theorem consequentia_mirabilis (h : ¬ A → A) : A := by
    sorry

  theorem contrapos_ltr (h : A → B) : ¬B → ¬A := by
    sorry

  theorem contrapos_rtl (h: ¬B → ¬A) : A → B := by
    sorry

```

## Solution {.solution #lean-verificationSolution}

Select each inference. “Lean → ND” draws its proof as a derivation;
“Open in Lean” sends the code to the playground for checking by Lean itself.
The translator accepts the small propositional language used in the chapter.

{{< logic-app name="deduction" kind="lean" deck="exercises" title="Lean exercise solutions" >}}

For contraposition, assume $¬B$, then assume $A$. Apply the given conditional
to obtain $B$, which contradicts $¬B$. Discharging $A$ gives $¬A$; discharging
$¬B$ gives the required conditional. The Lean proof is:

```lean
variable (A B : Prop)

example (h : A → B) : ¬B → ¬A := by
  intro not_b
  intro a
  exact not_b (h a)
```

# Interpreting Lean {.solved}

Translate these proofs into natural deduction. Work through them yourself first;
afterwards, you can check with the Lean correspondence app in the chapter. For each $intro$, identify
where the assumption is discharged. Then explain how the conclusion is
obtained from the assumptions.

```lean
variable (A B : Prop)

example : (A ∧ (A ∨ B)) → A := by
  intro h
  exact And.left h

example : A → (A ∧ (A ∨ B)) := by
  intro a
  apply And.intro
  · exact a
  · exact Or.inl a
```

```lean
variable (A B C : Prop)

example : A → (B → A) := by
  intro a
  intro b
  exact a

example (h : A ∨ B) (f : A → C) (g : B → C) : C := by
  apply Or.elim h
  · intro a
    exact f a
  · intro b
    exact g b

example (h : ¬¬A) : A := by
  apply Classical.byContradiction
  intro not_a
  exact h not_a
```

## Solution {#interpreting-leanSolution .solution}

In the first proof, assume $A ∧ (A ∨ B)$. Use $∧ Elim$ to obtain $A$,
then discharge the assumption with $→ Intro$. The Lean proof extracts the first conjunct from the assumed conjunction.

In the second, assume $A$. Use $∨ Intro$ to obtain $A ∨ B$, combine this
with $A$ using $∧ Intro$, and discharge $A$ with $→ Intro$. The proof
uses the assumption twice: once as the first part of the conjunction, and once
to introduce the disjunction in the second part. There is one assumption
label, whose uses are discharged together.

The first two completed derivations have no open assumptions.

In the third proof, assume $A$, then $B$. Repeat $A$ and discharge $B$
vacuously to get $B → A$. Discharge $A$ to finish. The proof assumes both formulas, but only uses the first.

In the fourth, split $A ∨ B$ into cases. Under $A$, apply $A → C$; under
$B$, apply $B → C$. Both give $C$, so discharge the two case assumptions.
The three given premises remain open. In each case, the proof uses the conditional whose antecedent matches
the case assumption.

In the fifth, assume $¬A$. Applying $¬¬A$ gives $⊥$. Discharge $¬A$ by the
classical rule to conclude $A$. The given $¬¬A$ remains open. This proof uses
$Classical.byContradiction$ in addition to the introduction and elimination
operations.

# Classical reasoning {.solved}

1. In the solution of $¬¬A ⊢ A$, locate the classical step. What would
   $¬ Intro$ give us from the same contradiction instead?
2. Derive $¬¬A ⊢ ¬¬¬¬A$ without the classical rule. Compare the two proofs:
   what changed about the assumption you discharged and the conclusion?
3. Would failing to find a proof without the classical rule establish that
   no such proof exists? Explain.

## Solution {.solution #classical-reasoningSolution}

1. After assuming $¬A$ and deriving $⊥$, the classical rule concludes $A$.
   $¬ Intro$ would instead conclude $¬¬A$, repeating the premise. The two
   rules discharge the same assumption here, but have different conclusions.
2. Assume $¬¬¬A$. This contradicts the given $¬¬A$. Discharge $¬¬¬A$ by
   $¬ Intro$ to obtain $¬¬¬¬A$. We have introduced a negation, rather than
   removed two negations from the premise.
3. No. We might simply have missed a proof. Showing that an inference
   cannot be derived with a collection of rules requires a mathematical
   argument about those rules. A failed attempt does not provide one.
