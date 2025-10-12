---
title: Logical proofs
author: Johannes Korbmacher
locked: false
weight: 70
params: 
  id: exc-proof
  math: true
---

# Proof systems {.solved}

Let's trial run the different proof systems. For each of the following, provide
a logical proof in our Hilbert calculus, sequent calculus, and tableaux.

1. $A {{< v_dash >}} A {{< lor >}}(A{{< land >}}B)$

2. $A {{< lor >}}(A{{< land >}}B) {{< v_dash >}}A$

## Solution {.solution #proof-systemsSolution}

1. Here we go:

    - Hilbert:
  
      1. $A$ <span class="right-justified">(Premise)</span>
      2. $A {{< to >}} (A {{< lor >}} (A {{< land >}} B))$ <span class="right-justified">(Axiom 6 with $B = A {{< land >}} B$)</span>
      3. $(A {{< lor >}} (A {{< land >}} B))$ <span class="right-justified">(1., 2., MP)</span>

    - Sequent:

      {{< img src="img/sequent_1.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

    - Tableaux:

      {{< img src="img/tableaux_1.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

2. Here we go:

    - Hilbert:

      1. $A {{< lor >}}(A {{< land >}} B)$ <span class="right-justified">(Premise)</span>
      2. $(A {{< to >}}A) {{< to >}} (((A {{< land >}} B) {{< to >}} A){{< to >}}((A {{< lor >}}(A {{< land >}} B)){{< to >}} A))$ <span class="right-justified">(Axiom 7.)</span>

      3. $(A {{< to >}}A)$ <span class="right-justified">(Theorem from textbook)</span>
      4. $((A {{< land >}} B) {{< to >}} A){{< to >}}((A {{< lor >}}(A {{< land >}} B)){{< to >}} A)$<span class="right-justified">(2., 3., MP)</span>
      5. $(A {{< land >}} B) {{< to >}} A)$ <span class="right-justified">(Axiom 5.)</span>
      6. $((A {{< lor >}}(A {{< land >}} B)){{< to >}} A)$<span class="right-justified">(4., 5., MP)</span>
      7. $A$ <span class="right-justified">(1., 6., MP)</span>

    - Sequent:

      {{< img src="img/sequent_2.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

    - Tableaux:

      {{< img src="img/tableaux_2.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

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

# Lean verification {.solved}

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

## Solution {.solution #lean-verificationSolution}

Credit: Alexander Apers

{{<lean_logo>}}
~~~~lean4
  variable (A B C : Prop)

  theorem distribution_one_ltr (h : (A ∧ (B ∨ C))) : (A ∧ B) ∨ (A ∧ C) := by
    apply Or.elim (And.right h)
    · intro b
      apply Or.inl
      apply And.intro
      · exact And.left h
      · exact b
    · intro c
      apply Or.inr
      apply And.intro
      · exact And.left h
      · exact c

  theorem distribution_one_rtl (h : (A ∧ B) ∨ (A ∧ C) ) : (A ∧ (B ∨ C)) := by
    apply And.intro
    apply Or.elim h
    · intro a_and_b
      apply And.left a_and_b
    · intro a_and_c
      apply And.left a_and_c
    apply Or.elim h
    · intro a_and_b
      apply Or.inl
      apply And.right a_and_b
    · intro a_and_c
      apply Or.inr
      apply And.right a_and_c

  theorem distribution_two_ltr (h : (A ∨ (B ∧ C))) : (A ∨ B) ∧ (A ∨ C) := by
    apply And.intro
    apply Or.elim h
    · intro a
      apply Or.inl a
    · intro b_and_c
      apply Or.inr
      · exact And.left b_and_c
    apply Or.elim h
    · intro a
      apply Or.inl a
    · intro b_and_c
      apply Or.inr
      · exact And.right b_and_c

  theorem distribution_two_rtl (h : (A ∨ B) ∧ (A ∨ C) ) : (A ∨ (B ∧ C)) := by
    apply Or.elim (And.left h)
    · intro a
      apply Or.inl a
    · intro b
      apply Or.elim (And.right h)
      · intro a
        apply Or.inl a
      · intro c
        apply Or.inr
        apply And.intro
        · exact b
        · exact c

  open Classical

  variable (A B : Prop)

  theorem double_negation_ltr (h: ¬¬ A) : A := by
    apply byContradiction
    apply h

  theorem double_negation_rtl (h : A) : ¬¬ A := by
    intro a
    apply a
    exact h

  theorem de_morgan_one_ltr (h : ¬(A ∧ B)) : (¬ A ∨ ¬ B) := by
    apply byContradiction
    intro neg_goal
    apply h
    apply And.intro
    apply byContradiction
    intro neg_a
    apply neg_goal
    apply Or.inl neg_a
    apply byContradiction
    intro neg_b
    apply neg_goal
    apply Or.inr neg_b

  theorem de_morgan_one_rtl (h : (¬ A ∨ ¬ B)) : ¬(A ∧ B) := by
    apply Or.elim h
    · intro neg_a
      · intro a_and_b
        apply neg_a
        apply And.left a_and_b
    · intro neg_b
      · intro a_and_b
        apply neg_b
        apply And.right a_and_b

  theorem de_morgan_two_ltr (h : ¬(A ∨ B)) : (¬ A ∧ ¬ B) := by
    apply And.intro
    · intro a
      apply h
      apply Or.inl a
    · intro b
      apply h
      apply Or.inr b

  theorem de_morgan_two_rtl (h : (¬ A ∧ ¬ B)) :  ¬(A ∨ B) := by
    intro a_or_b
    apply Or.elim a_or_b
    · intro a
      apply And.left h
      exact a
    · intro b
      apply And.right h
      exact b

  variable (A B : Prop)

  theorem cond_def_ltr (h : ¬A ∨ B) : A → B := by
    intro a
    apply Or.elim h
    · intro neg_a
      apply False.elim
      apply neg_a
      exact a
    · intro b
      exact b

  theorem cond_def_rtl (h : A → B ) : ¬A ∨ B  := by
    apply byContradiction
    intro neg_goal
    · apply neg_goal
      apply Or.inl
      · intro a
        apply neg_goal
        apply Or.inr
        apply h
        exact a

  theorem consequentia_mirabilis (h : ¬ A → A) : A := by
    apply byContradiction
    intro neg_a
    apply neg_a
    apply h
    apply neg_a

  theorem contrapos_ltr (h : A → B) : ¬B → ¬A := by
    intro neg_b
    · intro a
      apply neg_b
      apply h
      exact a

  theorem contrapos_rtl (h: ¬B → ¬A) : A → B := by
    intro a
    apply byContradiction
    · intro neg_b
      apply h
      apply neg_b
      exact a 
~~~~

You can review the code in the lean plaground by following this [link](https://live.lean-lang.org/#codez=AQNwhgTglmBGA2BTYAKAgsAQsAwsAXMAAoQD2ADgJQBQ1wwALgBaKkSIC2wAJlAM4NosAK4MopAHYB9SYinxBqJgVQZA5ESpsgCiJclPSvTANmSsB2GNOU/gC8wWAE869YGHLl4D4AHkIAOkR4KC50CW4/aABzJgZgJhoXYAB24CgJQVJ7Z0S3Dy9fPzT4bJdcz2A0MML0smAS+hTEAA8wAGNYyvCkADNY5Xrk4Ga22NgSlLSM4FaBsvz/NIhZ93LO6oyBxpb2iqqevs2h7diZ52ZWdi5eASFRcWlZKQgGeCUDdSxTcw+rYGtVIyaMy6ax2RwlOa7cKTMgQlbzAJBLhMcapGqZMBSMBhKRjRL0SFrfauLE4vEuCboknY7hSGb41zwqF+YmYml0uF5Hz+QLBOKomEY0m08k5JkFIrLLlrKIxalkgVUtk4+n4yESiRLBmEqqy2LK2mnejnNicHj8QRQERiSRSBgAd1I8kUKGUhEM5mwlj0/w9n0Bft+tnsTjF0qqgs55QKvORiqmYCl0YWEleicSlKmsGFHO14pTEDqDK2I2ZxOz7NVBPziL5KIzaITSYRRVc8dqFZVze51ULh2GOxlUGioxzRsYLFNVwttxt0gdTuer1d72BJgDGB0v19m6B3tBIajCNjqj2iF6cQSFMbtXTaprrbvDRvmVFpRrJ9C4T1l8OgrbDLVlyGppn+VJVvewEFgMQGrBGVIwYMA6jIhJY7BB9DOBQiASLg8BgHwfBQK0YDFIkzjgNAcBIAC2CECQFA0Gck6XDwpDCAgcgSIgkRgHOzqFq6hAADXCRU/wYMG4JhuUjg4JIghgLw7T3Ee/LMRcZrcOxnFSNxvH8UubyEGg/yiRUBBgqGLj/k+jJcnZyHqcaLFaXIHBsLxDzcQJxnAMJFifL6Ym7mJ65SdZsFeHJCkQEpxFziU/76VIkSkKRan1u+4bQghMnRQ48k1PFKmSElVIpXZkIpWlGX5T2raVWpMXFcpiWJMlPG4mpNXpWR2XJr2wApWMtAuZpVzuZ52IyD5Rkru6IXAmF+giYF4VWWpMZIvyDadZEWJgQmOZvvVTWAfZcFdOe+one2mQjUdt53Rd1VdadA1eEOI7yiKY0ThNPBTRAXl2o6vkLf5fomMFFkaCtlmHvVayRntSrdll9UgQB17/h9kKY59DWalk/0mqx3DA6DC5PC8fkoEt8NBSoUO7htSM2UqMgQN1WM8jtmJsLzuPo3mOUsjdu34k5dmZh23bfXKhP0E5o30JRMCcbRKgMVQZOuVwrSSLSlPdBDbr+WzEnAIASYRYIj0mc02fO1nGaNTOdkHlAAYqRfCIK7RZe14nuJDL91ZAyqu0BpU7TMbUim7Ty4WxgdvYGZbP0BFzWFbFJXtU7tS9XV15vQdtX9S7rZPRiiHl6lfX1w+JPN1yysuOHsesUbEj+wAjsIOFiJiHBQHFsBQEEfB+UtdumSokmbfVLWKW1qkdRVXVVUyoeXV4hMN4m3dmr3inkKQfDm4vtv+iJ2B28JS8c/Q+3C8+tndo9YvlB3XfjXHM+cUL5X3mkwe+t8n7W3Tg7SKL4cZRRDEVNeCUN4iw9u9DGQczqYKjscVwQA).


# Interpreting Lean {.solved}

Consider the following two Lean proofs. Translate them into natural deduction
proofs:

{{< lean_logo >}}
~~~lean4
  variable (A B : Prop)

  theorem absorption_one_ltr : (A ∧ (A ∨ B)) → A := by
    intro h
    apply And.left 
    exact h

  theorem absorption_one_rtl : A → (A ∧ (A ∨ B)) := by
    intro hA
    apply And.intro
    · exact hA
    · exact Or.inl hA

~~~
Click this
[link](https://live.lean-lang.org/#codez=ATBuEMCcEtwIwDYFNgAoCCwBCwBcwAFSAewAcBKAKEpABcALJYyJAW2HgGdnTbpiAdgH1BSIQlqQ8aTIHIiGcEAURNnLlggJMJgmXAF5gcAJ40QwaAMnFg9YyHClSCA1oEATAHTIAZrWA3gSAA9wAGMfa2MGJhZ2Lh4+QREBMUhaBGlMTQxgeSzlLFU8PUM/MwsrdD87Byd0VzdSkj8Adv8g0PLm1pCfAHlIeoE0+nQgA)
to open the browser playground. 

## Solution {#interpreting-leanSolution .solution}

{{< img src="img/lean_correspondence.png" class="mx-auto rounded d-block inert-img img-fluid" width="700px">}}
