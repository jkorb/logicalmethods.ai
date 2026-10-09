---
title: FOL inference
author: Johannes Korbmacher
weight: 90
params:
  id: exc-finf
---

# Valid inference

Decide whether each inference is valid. Use the definition of
{{< chapter_ref chapter="FOL-inference" id="valid-inference" >}}first-order consequence{{< /chapter_ref >}}:
could the premises all be true while the conclusion is false? Select a formula
and unfold its truth conditions. The picture records the facts established so
far. If a truth condition allows two possibilities, investigate each case.
Look for conflicting requirements or a model that meets them all.

{{< logic-app name="fol-practice" exercise="validity" model="finf-reasoning" kind="model" editable="false" view="graph" title="Reason about the inference in models" >}}

<span id="valid-inferenceSolution"></span>

# Countermodels {#countermodels}

Show that the following FOL inferences are invalid by constructing a
countermodel. Make every premise true and the conclusion false. The levels
cover the converse fallacy, quantifier order, distribution, separate witnesses,
generalization, and negation.

Use Modify to change the domain and predicate interpretations. The predicate
names impose no conditions beyond the premises. Check tests your model;
change the interpretation and try again if a premise is false or the conclusion
is still true.

{{< logic-app name="fol-practice" exercise="countermodel" model="people-relations" kind="model" view="tables" title="Constructing countermodels" >}}

# Reasoning in models {.solved #reasoning-in-models}

These inferences are valid. Give a proof of each by reasoning in an arbitrary model of its
premises. State which objects you choose, which facts follow from the premises,
and why the conclusion holds. Your argument must apply to every domain size.

1. $∀x (Human(x) → Mortal(x)), Human(Socrates) ∴ Mortal(Socrates)$.
2. $∀x (Human(x) ∧ Mortal(x)) ∴ (∀x Human(x)) ∧ (∀x Mortal(x))$.
3. $∃x∀y Sibling(x,y) ∴ ∀y∃x Sibling(x,y)$.

## Solution {#reasoning-in-modelsSolution .solution}

1. In any model of the premises, the object named $Socrates$ is human.
   The universal premise makes that object mortal.

   {{< logic-app name="fol-model" kind="consequence" model="finf-socrates" title="Model reasoning: Socrates" >}}

2. Choose an arbitrary domain object. The premise makes it both human and
   mortal. Since the choice was arbitrary, every object is human and every
   object is mortal.

   {{< logic-app name="fol-model" kind="consequence" model="finf-distribution" title="Model reasoning: universal distribution" >}}

3. Choose a witness $a$ for the existential premise. Given any domain object
   $d$, the premise makes $Sibling(a,d)$ true. Thus $a$ witnesses the
   existential conclusion for every choice of $d$.

   {{< logic-app name="fol-model" kind="consequence" model="finf-shared-witness" title="Model reasoning: a shared witness" >}}

# Unification {.solved}

In each level, choose a most general unifier or the reason no unifier exists.
Check your choice before moving to the next level. The symbols $Munich$, $Milan$,
$Rome$, $Mary$, $Jane$, and $London$ are constants; $fatherOf$ and $motherOf$
are unary function symbols. Functions and predicates use argument brackets.

{{< logic-app name="fol-inference" kind="unify-quiz" title="Choose the most general unifier" >}}

## Solution {#unificationSolution .solution}

1. $[x/Munich,y/Milan,z/Rome]$ matches the three argument positions.
2. No unifier: the repeated $x$ would have to match both $Mary$ and $Jane$.
3. No unifier of the literals: their signs differ. Resolution instead unifies
   the atoms of opposite-sign literals.
4. $[x/London,y/motherOf(London)]$. Substitution is simultaneous, so leaving
   $x$ in the replacement for $y$ would not give a unifier.
5. No unifier: $x$ occurs as a proper part of $fatherOf(x)$.
6. $[x/fatherOf(y)]$. Fixing $y$ to a particular constant would give a less
   general unifier.

# Robinson's Algorithm {.solved}

Use {{< chapter_ref chapter="FOL-inference" id="robinsons-algorithm" >}}Robinson's algorithm{{< /chapter_ref >}}
to solve the levels below. Click an equation in the box, then apply an
operation. The buttons follow the cases in the chapter: Delete, Occurs,
Eliminate, Orient, Clash, and Decompose. Eliminate substitutes the right-hand
term for the variable on the left and updates the accumulated substitution.
Try another valid order using Undo.
For literals, first check their signs; then compare their atoms.

{{< logic-app name="fol-inference" kind="unify" mode="practice" title="Practise Robinson unification" >}}

As additional checks, explain the outcomes for $x ≐ y$, $f(x) ≐ f(y)$,
$x ≐ f(x)$, and $f(x) ≐ g(x)$.

Explain why deleting identical pairs before the occurs check is necessary.

## Solution {#robinsons-algorithmSolution .solution}

1. **Socrates:** decompose the atoms and record $[x/Socrates]$.
2. **Composition:** record $[y/f(x)]$, then $[x/a]$. Updating the earlier
   replacement gives $[x/a,y/f(a)]$.
3. **Occurs check:** $x ≐ f(x)$ fails because a finite term cannot contain
   itself as a proper part.
4. **Symbol clash:** $f$ and $g$ are different fixed symbols.
5. **Cities:** orient $Munich ≐ x$, then eliminate the variables to obtain
   $[x/Munich,y/Milan,z/Rome]$.
6. **Repeated variable:** matching the first arguments forces $x/Mary$;
   matching the second then requires $Mary ≐ Jane$, a symbol clash.
7. **Nested functions:** decompose, orient $motherOf(x) ≐ y$, and record
   $[y/motherOf(x)]$. The remaining pair gives $[x/London]$. Compose to obtain
   $[x/London,y/motherOf(London)]$.
8. **An identity:** record $[x/fatherOf(y)]$. The other pair becomes identical
   and can be deleted.

Delete $x ≐ x$ before the occurs check: the expressions already agree, so
no replacement is required.

# Skolemization {.solved}

Skolemize each formula. Start with a constant witness, then
work through dependencies, separate scopes, and nested negation. Choose each
subformula by clicking its main connective or quantifier, then apply an
operation to the highlighted scope. When replacing an existential, enter the
whole witness term, such as `sk₁` or `sk₁(x)`. Explain why each argument is in scope.

{{< logic-app name="fol-inference" kind="skolem" mode="practice" title="Skolemization exercises" >}}

For each result, explain why Skolemization preserves satisfiability. Give a
model showing why it need not preserve equivalence.

## Solution {#skolemizationSolution .solution}

For levels 8–10, one choice of fresh symbols gives:

1. $Human(sk₁) ∧ ∀y Mortal(y)$, after renaming the second binder.
2. $∀x(∀y(IsFriendOf(x,sk₁(x,y)) ∧ IsFriendOf(y,sk₁(x,y))) ∨ ¬IsFriendOf(x,sk₂(x)))$.
   The second existential is outside the scope of $∀y$.
3. $IsFriendOf(sk₁,sk₂)$, with two fresh constants. Their interpretations may coincide.

If a model satisfies $∃x Human(x)$, we can interpret the fresh constant $sk₁$
as one of its humans. Then it also satisfies $Human(sk₁)$. Conversely,
$Human(sk₁)$ guarantees a human exists. But if we instead interpret $sk₁$ as
a nonhuman, the original sentence stays true while the Skolemized one is false.

# A library knowledge base {.solved #resolution-knowledge-base}

A library uses these rules:

- A member may borrow an item they have reserved.
- A librarian may borrow an item they have approved.
- Anyone who may borrow an item can collect it.

Ada is a member and has reserved the Atlas. Emmy is a librarian and has
approved the Atlas. Use resolution to establish that Ada can collect the Atlas.
The first two levels use the following formalization, with Ada and Emmy as
the respective subjects of the conclusion:

| Premise | Formula |
| --- | --- |
| Members | $∀x∀y ((Member(x) ∧ Reserved(x,y)) → MayBorrow(x,y))$ |
| Librarians | $∀x∀y ((Librarian(x) ∧ Approved(x,y)) → MayBorrow(x,y))$ |
| Collection | $∀x∀y (MayBorrow(x,y) → CanCollect(x,y))$ |
| Ada | $Member(Ada)$; $Reserved(Ada,Atlas)$ |
| Emmy | $Librarian(Emmy)$; $Approved(Emmy,Atlas)$ |

The remaining levels ask you to derive an ancestry relation, the existence of
a research project, and access granted by either of two rules. Each inference
is already formalized. Derive the empty clause from its prepared clauses.

Select opposite-sign literals in two clauses and choose Resolve. Each
substitution must apply to the entire resulting clause.

{{< logic-app name="sat-practice" language="fol" kind="resolution" deck="exercises" formula="∀x ∀y ((Member(x) ∧ Reserved(x,y)) → MayBorrow(x,y)); ∀x ∀y ((Librarian(x) ∧ Approved(x,y)) → MayBorrow(x,y)); ∀x ∀y (MayBorrow(x,y) → CanCollect(x,y)); Member(Ada); Reserved(Ada,Atlas); Librarian(Emmy); Approved(Emmy,Atlas) ∴ CanCollect(Ada,Atlas)" title="Resolution: library permissions" >}}

## Solution {#resolution-knowledge-baseSolution .solution}

For Ada, resolve the membership rule with $Member(Ada)$, then with
$Reserved(Ada,Atlas)$, to obtain $MayBorrow(Ada,Atlas)$. The collection rule
gives $CanCollect(Ada,Atlas)$, which contradicts the negated conclusion.
For Emmy, use the librarian rule with $Librarian(Emmy)$ and
$Approved(Emmy,Atlas)$; the final two inferences are the same.

{{< logic-app name="sat" language="fol" kind="resolution" formula="∀x ∀y ((Member(x) ∧ Reserved(x,y)) → MayBorrow(x,y)); ∀x ∀y ((Librarian(x) ∧ Approved(x,y)) → MayBorrow(x,y)); ∀x ∀y (MayBorrow(x,y) → CanCollect(x,y)); Member(Ada); Reserved(Ada,Atlas); Librarian(Emmy); Approved(Emmy,Atlas) ∴ CanCollect(Ada,Atlas)" title="Library permissions: refutation" >}}

# Drinker Paradox {.solved}

Consider the following inference:

$$
∃x InPub(x) ∴ ∃x(InPub(x) ∧ (IsDrinking(x) → ∀y(InPub(y) → IsDrinking(y)))).
$$

There is somebody in the pub. Does it follow that there is somebody in the
pub such that, if they are drinking, everybody in the pub is drinking?

Negate the conclusion, move negations inward, and Skolemize. Write the
resulting clauses as disjunctions and derive $⊥$ using resolution. Compare your result
with the starting clauses below.

Select two literals directly in the clause box, then resolve them. For factoring,
select two same-sign literals in one clause. Undo takes back the last inference.

{{< logic-app name="sat-practice" language="fol" kind="resolution" formula="∃x InPub(x) ∴ ∃x (InPub(x) ∧ (IsDrinking(x) → ∀y (InPub(y) → IsDrinking(y))))" title="Refute the negation of the drinker conclusion" >}}

## Solution {#drinker-paradoxSolution .solution}

Write $P$ for $InPub$ and $D$ for $IsDrinking$. Negating the conclusion gives:

$$
∀x (¬P(x) ∨ (D(x) ∧ ∃y (P(y) ∧ ¬D(y)))).
$$

The premise supplies a fresh constant $sk₁$. In the negated conclusion, use
$sk₂(x)$ for the existential witness. After distribution, the clauses are:

1. $P(sk₁)$.
2. $¬P(x) ∨ D(x)$.
3. $¬P(x) ∨ P(sk₂(x))$.
4. $¬P(x) ∨ ¬D(sk₂(x))$.

Resolve the last two clauses with $P(sk₁)$ to obtain $P(sk₂(sk₁))$ and $¬D(sk₂(sk₁))$.
A fresh use of the second clause gives $D(sk₂(sk₁))$, which completes the
refutation. Follow the checked derivation on the canvas:

{{< logic-app name="sat" language="fol" kind="resolution" formula="∃x P(x) ∴ ∃x (P(x) ∧ (D(x) → ∀y (P(y) → D(y))))" title="Drinker refutation" >}}

The premise supplies the starting witness. If nobody is in the pub, the
existential conclusion is false, even though our domain itself is nonempty.

# Natural deduction {.solved}

Prove the laws below, as in
{{< chapter_ref chapter="proofs" >}}Logical proofs{{< /chapter_ref >}}. The levels are grouped
into duality, distribution, and interaction. Goals lets you plan backwards;
the rules menu also supports forward construction. Use Hint when you need a
suggested next move. The domain is nonempty throughout.

{{< logic-app name="deduction" language="fol" kind="practice" deck="exercises" title="First-order natural deduction exercises" >}}

Identify every use of the classical rule and every witness freshness condition.

<span id="duality-laws"></span>
<span id="distribution-laws"></span>
<span id="interaction-laws"></span>

## Solution {#natural-deductionSolution .solution}

{{< logic-app name="deduction" language="fol" kind="worked" deck="exercises" title="First-order natural deduction solutions" >}}

Duality 1 and Interaction 4 use classical reasoning. Interaction 1 and 4 use
nonemptiness to supply an object. In each existential elimination, check that
the temporary witness is absent from the conclusion and remaining assumptions.

# Lean {.solved}

Verify all twelve natural deduction inferences in Lean. Each block contains
its own declarations and can be copied or opened in Lean. Replace each
`sorry` with a proof using the commands from the chapter.

`Domain` represents the domain of a structure; `A`, `B`, and `R` represent
predicate interpretations. `[Inhabited Domain]` supplies
`default : Domain`. Identify where your proof uses this object and where
it uses `Classical.byContradiction`.

## Duality

```lean
variable (Domain : Type) [Inhabited Domain]
variable (A B : Domain → Prop) (R : Domain → Domain → Prop) (C : Prop)

-- Duality 1
example (h : ¬∀ x, A x) : ∃ x, ¬A x := by
  sorry

-- Duality 2
example (h : ∃ x, ¬A x) : ¬∀ x, A x := by
  sorry

-- Duality 3
example (h : ¬∃ x, A x) : ∀ x, ¬A x := by
  sorry

-- Duality 4
example (h : ∀ x, ¬A x) : ¬∃ x, A x := by
  sorry
```

## Distribution

```lean
variable (Domain : Type) [Inhabited Domain]
variable (A B : Domain → Prop) (R : Domain → Domain → Prop) (C : Prop)

-- Distribution 5
example (h : ∀ x, A x ∧ B x) : (∀ x, A x) ∧ (∀ x, B x) := by
  sorry

-- Distribution 6
example (h : (∀ x, A x) ∧ (∀ x, B x)) : ∀ x, A x ∧ B x := by
  sorry

-- Distribution 7
example (h : ∃ x, A x ∨ B x) : (∃ x, A x) ∨ (∃ x, B x) := by
  sorry

-- Distribution 8
example (h : (∃ x, A x) ∨ (∃ x, B x)) : ∃ x, A x ∨ B x := by
  sorry
```

## Interaction

```lean
variable (Domain : Type) [Inhabited Domain]
variable (A B : Domain → Prop) (R : Domain → Domain → Prop) (C : Prop)

-- Interaction 9
example (h : ∀ x, A x) : ∃ x, A x := by
  sorry

-- Interaction 10
example (h : ∃ x, ∀ y, R x y) : ∀ y, ∃ x, R x y := by
  sorry

-- Interaction 11
example (h : (∃ x, A x) → C) : ∀ x, A x → C := by
  sorry

-- Interaction 12
example (h : (∀ x, A x) → C) : ∃ x, A x → C := by
  sorry
```

## Solution {.solution #leanSolution}

Quantifier laws adapted from the exercise solutions by Alexander Apers.

```lean
variable (Domain : Type) [Inhabited Domain]
variable (A B : Domain → Prop) (R : Domain → Domain → Prop) (C : Prop)

-- Duality 1
example (h : ¬∀ x, A x) : ∃ x, ¬A x := by
  apply Classical.byContradiction
  intro hn
  apply h
  intro x
  apply Classical.byContradiction
  intro hx
  apply hn
  apply Exists.intro x
  exact hx

-- Duality 2
example (h : ∃ x, ¬A x) : ¬∀ x, A x := by
  intro all
  apply Exists.elim h
  intro x hx
  exact hx (all x)

-- Duality 3
example (h : ¬∃ x, A x) : ∀ x, ¬A x := by
  intro x
  intro hx
  apply h
  apply Exists.intro x
  exact hx

-- Duality 4
example (h : ∀ x, ¬A x) : ¬∃ x, A x := by
  intro ex
  apply Exists.elim ex
  intro x hx
  exact (h x) hx
```

```lean
variable (Domain : Type) [Inhabited Domain]
variable (A B : Domain → Prop) (R : Domain → Domain → Prop) (C : Prop)

-- Distribution 5
example (h : ∀ x, A x ∧ B x) : (∀ x, A x) ∧ (∀ x, B x) := by
  apply And.intro
  · intro x
    exact And.left (h x)
  · intro x
    exact And.right (h x)

-- Distribution 6
example (h : (∀ x, A x) ∧ (∀ x, B x)) : ∀ x, A x ∧ B x := by
  intro x
  apply And.intro
  · exact (And.left h) x
  · exact (And.right h) x

-- Distribution 7
example (h : ∃ x, A x ∨ B x) : (∃ x, A x) ∨ (∃ x, B x) := by
  apply Exists.elim h
  intro x hx
  apply Or.elim hx
  · intro ha
    apply Or.inl
    apply Exists.intro x
    exact ha
  · intro hb
    apply Or.inr
    apply Exists.intro x
    exact hb

-- Distribution 8
example (h : (∃ x, A x) ∨ (∃ x, B x)) : ∃ x, A x ∨ B x := by
  apply Or.elim h
  · intro ha
    apply Exists.elim ha
    intro x hx
    apply Exists.intro x
    apply Or.inl
    exact hx
  · intro hb
    apply Exists.elim hb
    intro x hx
    apply Exists.intro x
    apply Or.inr
    exact hx
```

```lean
variable (Domain : Type) [Inhabited Domain]
variable (A B : Domain → Prop) (R : Domain → Domain → Prop) (C : Prop)

-- Interaction 9
example (h : ∀ x, A x) : ∃ x, A x := by
  apply Exists.intro (default : Domain)
  exact h default

-- Interaction 10
example (h : ∃ x, ∀ y, R x y) : ∀ y, ∃ x, R x y := by
  intro y
  apply Exists.elim h
  intro x hx
  apply Exists.intro x
  exact hx y

-- Interaction 11
example (h : (∃ x, A x) → C) : ∀ x, A x → C := by
  intro x
  intro hx
  apply h
  apply Exists.intro x
  exact hx

-- Interaction 12
example (h : (∀ x, A x) → C) : ∃ x, A x → C := by
  apply Classical.byContradiction
  intro hn
  apply hn
  apply Exists.intro (default : Domain)
  intro hd
  apply h
  intro x
  apply Classical.byContradiction
  intro hx
  apply hn
  apply Exists.intro x
  intro ax
  apply False.elim
  exact hx ax
```

# Identity {.solved #identity-exercises}

From $a=b$ and $Human(a)$, derive $Human(b)$. Then try deriving $b=a$ from
$a=b$: first use identity introduction to prove $a=a$, and choose a
substitution formula that changes only its first occurrence of $a$.

{{< logic-app name="deduction" language="fol" kind="canvas" example="equality" title="Practise identity substitution" >}}

## Solution {.solution #identity-exercisesSolution}

Use $Human(x)$ for the first substitution and $x=a$ for the second. In each
case $x$ is the placeholder, $a$ is the left-hand term, and $b$ is the
right-hand term of the identity. The second result is $b=a$.

{{< logic-app name="deduction" language="fol" kind="worked" example="symmetry" title="Derive symmetry of identity" >}}

# What did the prover tell us? {.solved}

We ask whether a conclusion follows from some first-order premises. What can
we conclude in each case?

1. A prover returns a formal proof, and a sound proof checker accepts it.
2. A model finder returns a structure; checking it confirms that all premises
   are true and the conclusion is false.
3. Both programs time out without returning either result.

## Solution {#what-did-the-prover-tell-usSolution .solution}

1. The conclusion follows in the formal system, subject to the checked
   assumptions. We still need to check that the formalization fits our question.
2. The inference is invalid: we have a countermodel.
3. We don't yet know. A timeout is a fact about this search, not a proof of
   validity or invalidity.

# What if the type were empty? {.solved}

Lean's type `Empty` has no objects. If a subproof nevertheless supplies
`x : Empty`, `Empty.elim x` proves any proposition, just as `False.elim`
uses an impossible assumption.

Use this to show why the nonempty-domain assumption matters in the two
interaction laws. The code below takes `Domain` to be `Empty`, replaces
`A x` by `False`, and, in the second law, takes `C` to be `True`.
Prove that each instance of the proposed law is false.

```lean
example : ¬ ((∀ x : Empty, False) → ∃ x : Empty, False) := by
  sorry

example : ¬ (((∀ x : Empty, False) → True) → ∃ x : Empty, False → True) := by
  sorry
```


## Solution {#what-if-the-type-were-emptySolution .solution}

In the first instance, the universal antecedent is true because there are
no objects. The existential consequent is false. In the second, the
antecedent is true because its conclusion is `True`, but the existential
consequent still needs an object.

```lean
example : ¬ ((∀ x : Empty, False) → ∃ x : Empty, False) := by
  intro h
  have all : ∀ x : Empty, False := by
    intro x
    exact Empty.elim x
  apply Exists.elim (h all)
  intro x hx
  exact hx

example : ¬ (((∀ x : Empty, False) → True) → ∃ x : Empty, False → True) := by
  intro h
  have premise : (∀ x : Empty, False) → True := by
    intro all
    exact True.intro
  apply Exists.elim (h premise)
  intro x hx
  exact Empty.elim x
```


# Verify the Boolean derivations (advanced) {.solved #verify-boolean-derivations}

Return to the six tasks under [Boolean laws](/exercises/boolean/#boolean-laws).
Translate your derivations into Lean using Boolean laws and equality substitution, as in
the textbook's double-negation example. Keep the steps of your written
arguments visible instead of replacing them with a single automated proof.

1. Verify task 1 from the two absorption laws, supplied as premises.
2. Derive OR and AND idempotence for tasks 2 and 3, without using
   `Bool.or_self` or `Bool.and_self`. Again, take absorption as a premise.
3. Verify task 4 by factoring out `x`, then using complementation and identity.
4. Verify task 5 using distributivity, commutativity, complementation, and identity.
5. Give the result of task 5 a name and use it inside negation to verify task 6.
   Lean's `Bool.not_and` supplies the De Morgan law.

Run each proof in Lean. Then make one incorrect substitution and inspect the error.

Use these templates for the six tasks:

```lean
-- Task 1
example (x y : Bool)
    (andAbsorption : (x && (x || y)) = x)
    (orAbsorption : (x || (x && y)) = x) :
    (x && (x || y)) = (x || (x && y)) := by
  sorry

-- Task 2
example (x : Bool) (orAbsorption : (x || (x && true)) = x) : (x || x) = x := by
  sorry

-- Task 3
example (x : Bool) (andAbsorption : (x && (x || false)) = x) : (x && x) = x := by
  sorry

-- Task 4
example (x y : Bool) : ((x && y) || (x && !y)) = x := by
  sorry

-- Task 5
theorem booleanReduction (x y : Bool) : (x && (!x || y)) = (x && y) := by
  sorry

-- Task 6: use booleanReduction from task 5.
example (x y : Bool) : (!(x && (!x || y))) = (!x || !y) := by
  sorry
```

For reference, here are the notation and law tables from the chapter.
The absorption names refer to the supplied premises; `Eq.symm` reverses
an equality. Use only the laws permitted by each task.

| Boolean notation | Lean expression |
| --- | --- |
| $0$ | `false` |
| $1$ | `true` |
| $X$ | `x : Bool` |
| $!!NOT!! X$ | `!x` |
| $X !!AND!! Y$ | `x && y` |
| $X !!OR!! Y$ | `x ∣∣ y` |
| $!!NOT!! !!NOT!! X = X$ | `(!!x) = x` |

| Law | Boolean identity | Lean proof |
| --- | --- | --- |
| Associativity | $X !!OR!! (Y !!OR!! Z) = (X !!OR!! Y) !!OR!! Z$ | `Eq.symm (Bool.or_assoc x y z)` |
| Associativity | $X !!AND!! (Y !!AND!! Z) = (X !!AND!! Y) !!AND!! Z$ | `Eq.symm (Bool.and_assoc x y z)` |
| Commutativity | $X !!OR!! Y = Y !!OR!! X$ | `Bool.or_comm x y` |
| Commutativity | $X !!AND!! Y = Y !!AND!! X$ | `Bool.and_comm x y` |
| Absorption | $X !!OR!! (X !!AND!! Y) = X$ | `orAbsorption` |
| Absorption | $X !!AND!! (X !!OR!! Y) = X$ | `andAbsorption` |
| Distributivity | $X !!OR!! (Y !!AND!! Z) = (X !!OR!! Y) !!AND!! (X !!OR!! Z)$ | `Bool.or_and_distrib_left x y z` |
| Distributivity | $X !!AND!! (Y !!OR!! Z) = (X !!AND!! Y) !!OR!! (X !!AND!! Z)$ | `Bool.and_or_distrib_left x y z` |
| Complementation | $X !!OR!! !!NOT!! X = 1$ | `Bool.or_not_self x` |
| Complementation | $X !!AND!! !!NOT!! X = 0$ | `Bool.and_not_self x` |
| Identity | $X !!OR!! 0 = X$ | `Bool.or_false x` |
| Identity | $X !!AND!! 1 = X$ | `Bool.and_true x` |
| Domination | $X !!AND!! 0 = 0$ | `Bool.and_false x` |
| Domination | $X !!OR!! 1 = 1$ | `Bool.or_true x` |
| De Morgan | $!!NOT!! (X !!OR!! Y) = (!!NOT!! X) !!AND!! (!!NOT!! Y)$ | `Bool.not_or x y` |
| De Morgan | $!!NOT!! (X !!AND!! Y) = (!!NOT!! X) !!OR!! (!!NOT!! Y)$ | `Bool.not_and x y` |
| Double negation | $!!NOT!! !!NOT!! X = X$ | `Bool.not_not x` |

## Solution {.solution #verify-boolean-derivationsSolution}

For tasks 1–3, the absorption premises are instances of the laws from Boolean
algebra. The proofs check that the requested equations follow from those
premises. The remaining proofs use Lean's Boolean laws directly.
For substitution inside a function, use the congruence result proved with
`Eq.subst` and `rfl` in
{{< chapter_ref chapter="FOL-inference" id="verifying-boolean-algebra" >}}Verifying a Boolean derivation{{< /chapter_ref >}}.
Its library name is `congrArg`. In task 6, the function is `Bool.not`.

```lean
-- Task 1: both sides equal x, by the two absorption premises.
example (x y : Bool)
    (andAbsorption : (x && (x || y)) = x)
    (orAbsorption : (x || (x && y)) = x) :
    (x && (x || y)) = (x || (x && y)) := by
  exact Eq.subst (Eq.symm orAbsorption) andAbsorption

-- Tasks 2 and 3: identity, then absorption.
example (x : Bool) (orAbsorption : (x || (x && true)) = x) :
    (x || x) = x := by
  have step_1 : (x || x) = (x || (x && true)) := by
    exact Eq.symm (congrArg (Bool.or x) (Bool.and_true x))
  exact Eq.subst orAbsorption step_1

example (x : Bool) (andAbsorption : (x && (x || false)) = x) :
    (x && x) = x := by
  have step_1 : (x && x) = (x && (x || false)) := by
    exact Eq.symm (congrArg (Bool.and x) (Bool.or_false x))
  exact Eq.subst andAbsorption step_1

-- Task 4: distribute backwards, then use complementation and identity.
example (x y : Bool) : ((x && y) || (x && !y)) = x := by
  have step_1 : ((x && y) || (x && !y)) = (x && (y || !y)) := by
    exact Eq.symm (Bool.and_or_distrib_left x y (!y))
  have step_2 : ((x && y) || (x && !y)) = (x && true) := by
    exact Eq.subst (congrArg (Bool.and x) (Bool.or_not_self y)) step_1
  exact Eq.subst (Bool.and_true x) step_2

-- Task 5: distribute, put the complementary pair on the right, then cancel it.
theorem booleanReduction (x y : Bool) : (x && (!x || y)) = (x && y) := by
  have step_1 : (x && (!x || y)) = ((x && !x) || (x && y)) := by
    exact Bool.and_or_distrib_left x (!x) y
  have step_2 : (x && (!x || y)) = ((x && y) || (x && !x)) := by
    exact Eq.subst (Bool.or_comm (x && !x) (x && y)) step_1
  have step_3 : (x && (!x || y)) = ((x && y) || false) := by
    exact Eq.subst (congrArg (Bool.or (x && y)) (Bool.and_not_self x)) step_2
  exact Eq.subst (Bool.or_false (x && y)) step_3

-- Task 6: reuse task 5 inside negation, then apply De Morgan.
example (x y : Bool) : (!(x && (!x || y))) = (!x || !y) := by
  have step_1 : (!(x && (!x || y))) = (!(x && y)) := by
    exact congrArg Bool.not (booleanReduction x y)
  exact Eq.subst (Bool.not_and x y) step_1
```
