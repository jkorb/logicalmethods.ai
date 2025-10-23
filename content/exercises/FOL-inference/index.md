---
title: FOL inference
author: Johannes Korbmacher
weight: 90
params: 
  id: exc-finf
  math: true
---

# Unification {.solved}

For each of the following pairs of terms determine whether they can be unified. If so, provide the unifier:

1. `LiesBetween Munich y z ` and `LiesBetween x Milan Rome `
2. `SitsBeween Mary x x ` and `SitsBetween x Jane y`
3. `Between x Rome Rome ` and `{{< neg >}}Between Rome y x `
4. `{{< neg >}}BornIn fatherOf motherOf x London` and `{{< neg >}}BornIn fatherOf y x`
5. `{{< neg >}}Human x` and `{{< neg >}}Human fatherOf x`
6. `Human fatherOf y x` and `Human x fatherOf y`

## Solution {#unificationSolution .solution}

1. Unifiable with `[x / Munich, y / Milan, z / Rome]`.
2. Not unifiable since `x` would need to be both `Mary` and `Jane`, which is impossible.
3. Not unifiable since one formula is a negation and the other isn't.
4. Unifiable with `[x / London, y / motherOf London]`
5. Not unifiable since whatever `x` would be it can't give you `fatherOf x`.
6. Unifiable by `[x / fatherOf y]`

# Robinson's Algorithm {.solved}

The first algorithms for unification is due to [John Alan Robinson](https://en.wikipedia.org/wiki/John_Alan_Robinson), the father of resolution.

To check whether two FOL literals can be unified, the algorithm proceeds as follows:

1. Check if either both formulas begin with a negation or neither does. If so, proceed. Otherwise, the formulas are not unifiable.

2. Check if the predicate in both formulas is the same. If it is, continue. If it is not, the formulas are not unifiable.

3. We can assume, at this point, that the form of the formulas is covered by one of the two cases:

    + `Pⁿ s₁ ... sₙ` and `Pⁿ t₁ ... tₙ`

    + `{{< neg >}}Pⁿ s₁ ... sₙ` and `{{< neg >}}Pⁿ t₁ ... tₙ`

    In both cases, to unify the formulas, we need to find a substitution
    $σ$, such that $s₁σ = t₁σ$, ..., $sₙσ = tₙσ$, that is the result of
    substituting within these terms must make each pair identical. 

    To express this requirement, we make a list of these pairs:

    ```
    Eq = [ [s₁, t₁], ..., [sₙ, tₙ] ]
    ```

    The algorithm aims to step-wise construct the desired substitution $σ$. We
    start with the empty substitution `σ = [ ]`, and go through each pair `[sᵢ,
    tᵢ]` of our list. We distinguish the following cases:

    - Case 1: `sᵢ = tᵢ`. The terms are already identical, we can remove them
    from `Eq`.

    - Case 2. `sᵢ ≠ tᵢ` and `sᵢ` is some variable, while `tᵢ` is not. First,
    check if `sᵢ` occurs in `tᵢ`. If so, like when `sᵢ = x` and `tᵢ = fatherOf
    x`, then we can stop the entire procedure since no unification is possible.
    Otherwise, we apply the substitution `[sᵢ / tᵢ]` to all other pairs, add it to
    `σ`, and remove the pair `[sᵢ, tᵢ]` from the set.

    - Case 3. `sᵢ ≠ tᵢ` and `tᵢ` is some variable, while `sᵢ` is not. Again, we
    first check if `tᵢ` occurs within `sᵢ` and terminate the entire algorithm
    if it does. Otherwise, we apply the substitution `[tᵢ / sᵢ]` to all other
    pairs, add it to `σ`, and remove the pair `[sᵢ, tᵢ]` from the set.

    - Case 4. `sᵢ ≠ tᵢ` and neither  `sᵢ` nor `tᵢ` is a variable. Then we check
    the form of `sᵢ` and `tᵢ`. Only if they are of the following forms, we
    continue:

    ```
     sᵢ = fᵐ s₁' … sₘ'  &emsp; and &emsp; tᵢ = fᵐ t₁' … tₘ'
    ```

    That is, both terms are the result of applying the same function term to a
    sequence of terms. If they are not, unification is impossible and we can
    terminate the algorithm. If they _are_ of this form, we add all the
    following corresponding pairs to `Eq`:

    ```
    [ [s₁', s₂'], ..., [sₙ', tₙ'] ]
    ```

4. By going through all the pairs, deleting pairs when substitutions are
   possible or trivial (Cases 1—3), and recursively adding new pairs (Case 4),
one of two things will happen:

    - Either we hit a termination condition in one of the cases and conclude
    that unification isn't possible.

    - Or we end up with an empty list and a full list of substitutions `σ` to
    apply. In that case, `σ` is a unifier and the terms and thus literals are
    indeed unifiable.
    
Apply this algorithm to check your work in Exercise 1.

## Solution {#robinsons-algorithmSolution .solution}


1. Steps 1. & 2. of the algorithm all succeed with no difficulty. So, we check the pairs:
    ```
    E = {[Munich, y],[y, Milan], [z, Rome]
    ```

    Applying cases 2. and 3. gives us the substitution: 

    ```
    [x / Munich, y / Milan, z / Rome]
    ```

2. Steps 1. & 2. of the algorithm all succeed with no difficulty. So, we check the pairs:
    ```
    E = {[Mary, x], [x, Jane], [x, y]}
    ```

    Applying Case 3. with `[Mary, x]` gives us:

    ```
    {[Mary, Jane], [Mary, y]}
    ```

    Case 4. tells us to stop when we reach `[Mary, Jane]`. There is no substitution possible.

3. Check 1. already fails, the two aren't unifiable.

4. Steps 1. & 2. of the algorithm all succeed with no difficulty. So, we check the pairs:

    ```
    E = {[fatherOf motherOf x, fatherOf y], [London, x]}
    ```

    Step 4 gives us for `[fatherOf motherOf x, fatherOf y]`:

    ```
    E = {[motherOf x, y], [London, x]}
    ```

    Applying rule 3. and 4. gives us the substitution:

    ```
    [x / London, y / motherOf x]
    ```

    which unifies the two formulas.

6. Steps 1. & 2. of the algorithm all succeed with no difficulty. So, we check the pairs:

    ```
    E = { [fatherOf y, x], [x, fatherOf y]}
    ```

    which gives us by rule 3 the set

    ```
    E = { [fatherOf y, fatherOf y] }
    ```
    
    with substitution `[x / fatherOf y]`, which terminates the algorithm.


# Skolemization {.solved}

Skolemize the following formulas:

1. $({{< exists >}}y₁ Human y₁ {{< land >}} {{< forall >}}x₁ Mortal x₁)$

2. ${{< forall >}}x₁({{< forall >}}x₂{{< exists >}}y₁(IsFriendOf x₁ y₁ {{< land >}} IsFriendOf x₂ y₁) {{< lor >}} {{< exists >}}y₂{{< neg >}}IsFriendOf x₁ y₂)$

3. ${{< exists >}}y₁{{< exists >}}y₂ IsFriendOf y₁ y₂$

## Solution {#skolemizationSolution .solution}

1. $(Human `skolem₁` {{< land >}} {{< forall >}}x₁ Mortal x₁)$

2. ${{< forall >}}x₁({{< forall >}}x₂(IsFriendOf x₁ `skolem₁` x₁ x₂ {{< land >}} IsFriendOf x₂ `skolem₁` x₁ x₂) {{< lor >}} {{< neg >}}IsFriendOf x₁ `skolem₂` x₁)$

3. $ IsFriendOf `skolem₁` `skolem₂`$

# Drinker Paradox {.solved}

Consider the following inference:

$${{< exists >}}x InPub x {{< therefore >}}{{< exists >}}x (InPub x {{< land >}}(IsDrinking x {{< to >}}{{< forall >}}x(InPub x{{< to >}}IsDrinking x)))$$

In natural language: There's somebody in the pub, so there's somebody in the
pub, such that if they are drinking, then everybody in the pub is drinking.
This is known as the [drinker
paradox](https://en.wikipedia.org/wiki/Drinker_paradox).

Use the method of resolution to show that this inference is deductively valid
in FOL. That is:

1. Form the set of the premise and negation of conclusion.

2. Transform all formulas into
   [equisatisfiable](https://en.wikipedia.org/wiki/Equisatisfiability) CNF.
Note that the Skolemization of an existential that doesn't depend on any
universals is just a constant `skolem`. It's important to document your work,
which transformations you're applying, but you can apply several steps
simultaneously.

3. Apply resolution with unification to derive the empty sequent ${ }$. And
   conclude that the initial set is unsatisfiable and the inference thus
valid.

## Solution {#drinker-paradoxSolution .solution}

1. The set is:

    $${{{< exists >}}x InPub x, {{< neg >}}{{< exists >}}x (InPub x {{< land >}}(IsDrinking x {{< to >}}{{< forall >}}x(InPub x{{< to >}}IsDrinking x)))}$$

2. Here are the results of the procedure:

    - The transformation of ${{< exists >}}x InPub x$ just involves one step (Skolemization), which immediately gives us: 

        $$InPub `skolem₁`$$

    - The other formula requires some more steps:

        - ${{< neg >}}{{< exists >}}x (InPub x {{< land >}}(IsDrinking x {{< to >}}{{< forall >}}x(InPub x{{< to >}}IsDrinking x)))}$


        - Two applications of $r₀$ give: 

            $${{< neg >}}{{< exists >}}x (InPub x {{< lor >}}({{< neg >}} IsDrinking x {{< lor >}}{{< forall >}}x({{< neg >}} InPub x{{< lor >}}IsDrinking x)))$$

        - Then we push negations inwards with $r₁-r₃$ and $r₆$:

            $${{< forall >}}x ({{< neg >}}InPub x {{< land >}}(IsDrinking x {{< land >}}{{< exists >}}x (InPub x{{< land >}}{{< neg >}}IsDrinking x)))$$

        - Next we make the variables unique:

            $${{< forall >}}x₁ ({{< neg >}}InPub x₁ {{< land >}}(IsDrinking x₁ {{< land >}}{{< exists >}}y₁ (InPub y₁{{< land >}}{{< neg >}}IsDrinking y₁)))$$

        - Then we Skolemize:


            $${{< forall >}}x₁ ({{< neg >}}InPub x₁ {{< land >}}(IsDrinking x₁ {{< land >}} (InPub `skolem₂` x₁{{< land >}}{{< neg >}}IsDrinking `skolem₂` x₁)))$$

        - And drop the universal:

            $$({{< neg >}}InPub x₁ {{< land >}}(IsDrinking x₁ {{< land >}} (InPub `skolem₂` x₁{{< land >}}{{< neg >}}IsDrinking `skolem₂` x₁)))$$

         - Finally, repeated distribution gives us:

            $$({{< neg >}}InPub x₁ {{< lor >}}IsDrinking x) {{< land >}}({{< neg >}}InPub x{{< lor >}}InPub `skolem₂ x`){{< land >}}({{< neg >}}InPub x{{< lor >}}{{< neg >}}IsDrinking `skolem₂ x`))$$

    - For the resolution, we therefore work with the sets:

        $${InPub `skolem₁`} &emsp; {{{< neg >}}InPub x₁ , IsDrinking x₁}$$
        $${{{< neg >}}InPub x₁, InPub `skolem₂ x`} &emsp; {{{< neg >}}InPub x₁, {{< neg >}}IsDrinking `skolem₂ x₁`}$$

        Here's a derivation of ${ }$ from this using resolution:

        {{< img src="img/resolution.png" class="mx-auto rounded d-block inert-img img-fluid" width="800px">}}


# Natural deduction

Find logical proofs in FOL natural deduction for the following logical
laws. Note that some of these require `<span class="dark-blue">open</span> Classical`.

## Duality Laws

1. ${{< neg >}}{{< forall >}}xA(x){{< v_dash >}}{{< exists >}}x{{< neg >}}A(x)$
2. ${{< exists >}}x{{< neg >}}A(x){{< v_dash >}}{{< neg >}}{{< forall >}}xA(x)$
3. ${{< neg >}}{{< exists >}}xA(x){{< v_dash >}}{{< forall >}}x{{< neg >}}A(x)$
4. ${{< forall >}}x{{< neg >}}A(x){{< v_dash >}}{{< neg >}}{{< exists >}}xA(x)$

## Distribution Laws

1. ${{< forall >}}x(A(x) {{< land >}} B(x)) {{< v_dash >}}{{< forall >}}xA(x) {{< land >}} {{< forall >}}xB(x)$
2. ${{< forall >}}xA(x) {{< land >}} {{< forall >}}xB(x){{< v_dash >}} {{< forall >}}x (A(x) {{< land >}} B(x))$
3. ${{< exists >}}x(A(x) {{< lor >}} B(x)) {{< v_dash >}}{{< exists >}}xA(x) {{< lor >}} {{< exists >}}xB(x)$
4. ${{< exists >}}x A(x) {{< lor >}} {{< exists >}}x B(x) {{< v_dash >}}{{< exists >}}x(A(x) {{< lor >}} B(x))$

## Interaction Laws

1. ${{< forall >}}xA(x){{< v_dash >}}{{< exists >}}xA(x)$
2. ${{< exists >}}x{{< forall >}}yR(x,y){{< v_dash >}}{{< forall >}}y{{< exists >}}xR(x,y)$
3. ${{< exists >}}xA(x){{< to >}}C{{< v_dash >}}{{< forall >}}x(A(x){{< to >}}C)$, assuming that $x$ is not free in $C$
4. ${{< forall >}}xA(x){{< to >}}C{{< v_dash >}}{{< exists >}}x(A(x){{< to >}}C)$, assuming that $x$ is not free in $C$.

# Lean

Verify your work from the previous exercise in Lean. Here's a template for the
work. You can follow the link below to work in the interactive environment.

{{< lean_logo >}}
~~~lean4
variable (Term : Type) (A B : Term → Prop) (R : Term → Term → Prop) (C : Prop)

/-! Duality Laws -/

theorem duality_one_ltr (h : ¬∀x, A x) : ∃x, ¬A x := by
  sorry

theorem duality_one_rtl (h : ∃x, ¬A x) : ¬∀x, A x := by
  sorry

theorem duality_two_ltr (h : ¬∃x, A x) : ∀x, ¬A x := by
  sorry

theorem duality_two_rtl (h : ∀x, ¬A x) : ¬∃x, A x := by
  sorry

/-! Duality Laws -/

theorem all_over_and_rtl (h: ∀x, A x ∧ B x) : ∀x, A x ∧ ∀x, B x := by
  sorry

theorem all_over_and_ltr (h: ∀x, A x ∧ ∀x, B x) : ∀x, A x ∧  B x := by
  sorry

theorem exists_over_or_rtl (h: ∃x, A x ∨ B x) : ∃x, A x ∨ ∃x, B x := by
  sorry

theorem exists_over_or_ltr (h: ∃x, A x ∨ ∃x, B x) : ∃x, A x ∨ Bx := by
  sorry

/-! Interaction Laws -/

theorem existential_import (h: ∀x, A x) : ∃x, A x := by
  sorry

theorem switcheroo (h : ∃x, ∀y, R x y) : ∀y, ∃x, R x y := by
  sorry

theorem exists_to_forall (h: ∃x, A x → C) : ∀x, A x → C := by
  sorry

theorem forall_to_exists (h: ∀x, A x → C) : ∃x, A x → C := by
  sorry
~~~

Follow this [link](https://live.lean-lang.org/#codez=G4QwTgliBGA2CmACAFAFXmAtogXI1AngA7wCUKAgogEK74baBJhIgApgD2R5yASnelkTMBTVhy4oAwnTadSAKHkB6ALQBCRABEAriFgQALgUQAZEAHcAzohVLFBgBbx2YeNgAmu/UYD67AHbwPrAGYCgOdAA1gABEAB4ANIhUseR4gMBECYiRybgAvIjQBPKIiJYuYEXyjs6uHl6GBH6BPmAGsOF0GYnZiClRcYk5OPmFxaXlldUuboieeg0+BubswaEdeJFdSb2piANZQyNFJWVgFfZO03Xzvksrre3IEXj7PX0bW4cFx+NnlaoaHQ3YxmKw2OxVS61RB6WB+YAYHwgfzuFptcIvTI5QDkRDQdnR9ji9plaLE8t8xqdzpCajNYfDEcjUSEwk9MYNeohcftSbtCZzcXiycMKScJhdadh4LEIJYDJYGWA/EqHhjEJ9OYAKIiFuw1ZO1W1J5NGYr+EquiGlsvliuVq1ZDnSWK16pJ+KdHP1NGFR0p4uU6kQAEl/AYMCAAMYGCABUwWay2c3Qq1y+ChqBwiCYIguAxq/nvV2e40/KmTKEzSzmQwRpwcdjrIt7AiJPhkgh8ltNtuIYwik2/alTZMyuUKgwrABmLlhar1QkQkj5zrJzGk/dL/uHM2nYHpE58Kfl+ZXC6XnVPa5Lfr+QA) to work in the digital playground.
