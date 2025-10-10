---
title: Logical proofs
author: Johannes Korbmacher
locked: false
weight: 70
params: 
  id: exc-proof
  math: true
---

# Proof systems 

Let's trial run the different proof systems. For each of the following, provide
a logical proof in our Hilbert calculus, sequent calculus, and tableaux.

1. $A {{< v_dash >}} A {{< lor >}}(A{{< land >}}B)$

2. $A {{< lor >}}(A{{< land >}}B) {{< v_dash >}}A$

# Natural deduction { .solved }

For this exercise, you do a deep dive into natural deduction: below are a series
of laws to prove for arbitrary formulas $A,B,C$. Some require the rule 
{{< neg >}}{{< bot >}}, take note of which ones.

## Conjunction and Disjunction

1. $A {{< lor >}} (B {{< land >}} C) {{< v_dash >}} (A {{< lor >}} B){{< land >}}(A {{< lor >}} C)$

2. $(A {{< lor >}} B){{< land >}}(A {{< lor >}} C){{< v_dash >}} A {{< lor >}} (B {{< land >}} C) $

3. $A {{< land >}} (B {{< lor >}} C) {{< v_dash >}} (A {{< land >}} B){{< lor >}}(A {{< land >}} C)$

4. $(A {{< land >}} B){{< lor >}}(A {{< land >}} C){{< v_dash >}}  A{{< land >}} (B {{< lor >}} C) $

## Negation

1. $A {{< v_dash >}}{{< neg >}}{{< neg >}} A$

2. ${{< neg >}}{{< neg >}} A{{< v_dash >}} A$

3. ${{< neg >}}(A {{< land >}}B) {{< v_dash >}} {{< neg >}}A {{< lor >}}{{< neg >}}B$

4. $ {{< neg >}}A {{< lor >}}{{< neg >}}B {{< v_dash >}}  {{< neg >}}(A {{< land >}}B)$

5. ${{< neg >}}(A {{< lor >}}B) {{< v_dash >}} {{< neg >}}A {{< land >}}{{< neg >}}B$

6. ${{< neg >}}A {{< land >}}{{< neg >}}B {{< v_dash >}} {{< neg >}}(A {{< lor >}}B)$

## Conditionals

1. ${{< neg >}}A {{< lor >}} B{{< v_dash >}}A{{< to >}}B$

2. $A {{< to >}} B {{< v_dash >}}{{< neg >}}A {{< lor >}} B$

3. $({{< neg >}}A{{< to >}} A) {{< v_dash >}} A$

4. $(A{{< to >}}B){{< v_dash >}}({{< neg >}}B {{< to >}}{{< neg >}}A)$

5. (${{< neg >}}B {{< to >}}{{< neg >}}A){{< v_dash >}}(A {{< to >}} B)$

## Solution {#natural-deductionSolution .solution}

*Conjunction and Disjunction*

1. $A {{< lor >}} (B {{< land >}} C) {{< v_dash >}} (A {{< lor >}} B){{< land >}}(A {{< lor >}} C)$

    This solution is interactive! Click through the slides to get an explanation of how to find the derivation:

    {{<iframe src="https://link.excalidraw.com/p/readonly/foQADbq8hXxQlzw0Qznf" >}}

2. $(A {{< lor >}} B){{< land >}}(A {{< lor >}} C){{< v_dash >}} A {{< lor >}} (B {{< land >}} C) $

    {{< img src="img/distribution_two_rtl.png" class="mx-auto rounded d-block inert-img img-fluid" width="700px">}}

3. $A {{< land >}} (B {{< lor >}} C) {{< v_dash >}} (A {{< land >}} B){{< lor >}}(A {{< land >}} C)$

    This solution is interactive! Click through the slides to get an explanation of how to find the derivation:

    {{<iframe src="https://link.excalidraw.com/p/readonly/bI3TWrMYvvnheKW6gr2i" >}}


4. $(A {{< land >}} B){{< lor >}}(A {{< land >}} C){{< v_dash >}}  A{{< land >}} (B {{< lor >}} C) $

    {{< img src="img/distribution_one_rtl.png" class="mx-auto rounded d-block inert-img img-fluid" width="700px">}}

*Negation*

1. $A {{< v_dash >}}{{< neg >}}{{< neg >}} A$

    This solution is interactive! Click through the slides to get an explanation of how to find the derivation:

    {{<iframe src="https://link.excalidraw.com/p/readonly/zIdmhCzAWfvGW2H619CA" >}}

    This is perhaps the most difficult one of this set.


2. ${{< neg >}}{{< neg >}} A{{< v_dash >}} A$

    {{< img src="img/double_negation_rtl.png" class="mx-auto rounded d-block inert-img img-fluid" width="200px">}}

    Note that this derivation requires classicality.

3. ${{< neg >}}(A {{< land >}}B) {{< v_dash >}} {{< neg >}}A {{< lor >}}{{< neg >}}B$

    {{< img src="img/de_morgan_one_ltr.png" class="mx-auto rounded d-block inert-img img-fluid" width="500px">}}

4. $ {{< neg >}}A {{< lor >}}{{< neg >}}B {{< v_dash >}}  {{< neg >}}(A {{< land >}}B)$

    {{< img src="img/de_morgan_one_rtl.png" class="mx-auto rounded d-block inert-img img-fluid" width="500px">}}

5. ${{< neg >}}(A {{< lor >}}B) {{< v_dash >}} {{< neg >}}A {{< land >}}{{< neg >}}B$

    {{< img src="img/de_morgan_two_ltr.png" class="mx-auto rounded d-block inert-img img-fluid" width="500px">}}

6. ${{< neg >}}A {{< land >}}{{< neg >}}B {{< v_dash >}} {{< neg >}}(A {{< lor >}}B)$

    {{< img src="img/de_morgan_two_rtl.png" class="mx-auto rounded d-block inert-img img-fluid" width="500px">}}

*Conditionals*


1. ${{< neg >}}A {{< lor >}} B{{< v_dash >}}A{{< to >}}B$

    This solution is interactive! Click through the slides to get an explanation of how to find the derivation:

    {{<iframe src="https://link.excalidraw.com/p/readonly/kYgz1Qljtf4yMChwYvTk" >}}


2. $A {{< to >}} B {{< v_dash >}}{{< neg >}}A {{< lor >}} B$

    {{< img src="img/cond_def_rtl.png" class="mx-auto rounded d-block inert-img img-fluid" width="500px">}}

3. $({{< neg >}}A{{< to >}} A) {{< v_dash >}} A$

    {{< img src="img/consequentia_mirabilis.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

4. $(A{{< to >}}B){{< v_dash >}}({{< neg >}}B {{< to >}}{{< neg >}}A)$

    {{< img src="img/contrapos_ltr.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

5. (${{< neg >}}B {{< to >}}{{< neg >}}A){{< v_dash >}}(A {{< to >}} B)$

    {{< img src="img/contrapos_rtl.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

# Lean verification

For this exercise, you verify your natural deduction inferences using Lean.
Below are templates for the code to use. The proofs are replaced by `<span
class="dark-red">sorry</span>`, which makes Lean not complain about the missing
proof. The `sorry`-tactic is very useful when writing a proof, because it makes
Lean "shut up", while allowing you to type your proof. You need to replace each
`<span class="dark-red">sorry</span>` with the correct proof, of course.

Note that some of the proofs below require `<span class="dark-blue">open</span>
Classical`. Which ones?

In your proofs, you can use previous theorems using `apply`. Note that theorem's
like `distribution_one_rtl` require to be passed a proof term `h`. 

## Conjunction and Disjunction

{{< lean_logo >}}
~~~lean4
  variable (A B C : Prop)

  theorem distribution_one_ltr (h : (A ∧ (B ∨ C))) : (A ∧ B) ∨ (A ∧ C) := by
    sorry

  theorem distribution_one_rtl (h : (A ∧ B) ∨ (A ∧ C) ) : (A ∧ (B ∨ C)) := by
    sorry

  theorem distribution_two_ltr (h : (A ∨ (B ∧ C))) : (A ∨ B) ∧ (A ∨ C) := by
    sorry

  theorem distribution_two_rtl (h : (A ∨ B) ∧ (A ∨ C) ) : (A ∨ (B ∧ C)) := by
    sorry

~~~
Click this
[link](https://live.lean-lang.org/#codez=ATBuEMCcEtwIwDYFNgAoCCwBCwDCwAuYABUgHsAHASgCgaQAXACyTMiQFtgATaAZwYw4AVwbQyAOwD6kpFISC0TQmkyByIjQ5AFER4qelRmAasVYDsMbcpggF5gcAJ70QwPm0hPnzVuy68BQqLi0rJSkAwISgbq2KbmMVbA1qpGmma61naOziBukB50jCxsnDz8gtAiYpJSDADuZPKKqMpEhuY4lnrJ7bGpvYm29k4uru6eRT6l/hVVwbUNYRFRbZg6Jv1ruknR6aidGYRZIy55HkA)
to open the browser playground. 

## Negation:

{{< lean_logo >}}
~~~lean4
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

~~~
Click this
[link](https://live.lean-lang.org/#codez=ATBuEMCcEtwIwDYFNgAoCCwBCwBcwAFSAewAcBKAKEpABcALJYyJAW2ABNiBXRJAfQB2SAObha0YoP4JakNPXwAapcHTk8avAF5gcAJ40QwAM7NIhowyYt2XXsiGjxk6ZFoIFm9ZpVbcugZGIGaQFtR0jMxsnAKszGLSUgKy8qj0vhjAgORE2OQa+KiqmIAURMCqWAWBhsam5paRNjEccQngScL87p7pmkVaZRX5mZi5lTp6Ncah4VZRtrH88ZCJ/LQA7sQycl7KWWWVBWjFOeV5E0G1Mw3A1tF2rSvta5tdHrvHWrlDR+X75wFJsE6mF9EA)
to open the browser playground. 

## Conditionals

{{< lean_logo >}}
~~~lean4
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

~~~
Click this
[link](https://live.lean-lang.org/#codez=ATBuEMCcEtwIwDYFNgAoCCwBCwBcwAFSAewAcBKAKEpABcALJYyJAW2AGNiA7AEwH1eSAGb8EtSGnp5gAGsyAKImzkZmQEmE2PAF5gcAJ40QwAM7NIBwwyYt2XPoJH9ItBFNXANOFfnnAlObV0DIxMzCzpGZjZOHmMkAEcAVyRuWlh+VmhIeGgEaGM3H2B1Yu9iwP1DEFNIc2oI62i7CXBSYmMxCULyzzLZHA1fXB1KkJq6y0ibGNTsto7nV1R6HwG5dDKSnGGgqtDavSA)
to open the browser playground. 

# Interpreting Lean

Consider the following two Lean proofs. Translate them into natural deduction
proofs:

{{< lean_logo >}}
~~~lean4
  variable (A B : Prop)

  theorem absorption_one_ltr : (A ∧ (A ∨ B)) → A := by
    intro h
    exact h.left

  theorem absorption_one_rtl : A → (A ∧ (A ∨ B)) := by
    intro hA
    apply And.intro
    · exact hA
    · exact Or.inl hA

~~~
Click this
[link](https://live.lean-lang.org/#codez=AQNwhgTglmBGA2BTYAKAgsAQsAXMAChAPYAOAlAFAXDAAuAFokRIgLbBwDOzJtURAOwD6gxEPi0IuVBkDkRDOCAKIixkywQEmEwDDgC8wWAE9qNYFAGSiwesZqIAHmADGtKwDokAM1pUaDJi3YuHj5BEQExCFp4aQxNdGB5eOVMVVw9QxtTc2IrNEywEhJ4Ay0BABNXMwtMgHbgeycXejyTYDqG52AAeQhKgWjmiiA)
to open the browser playground. 
