---
title: FOL inference
author: Johannes Korbmacher
locked: false
weight: 90
params:
  last_edited: "09/10/2026"
  id: txt-finf
---

# FOL Inference

In {{< chapter_ref chapter="fol" >}}FOL{{< /chapter_ref >}}, we introduced the
concept of an FOL model and studied it as a form of knowledge representation. A
model specifies which objects there are, what their properties are, and which
relations they stand in. In this way, we can think of the models as storing
information about the world. As we've seen, this information can be "queried"
using FOL formulas.

We now turn to the _logical_ purpose of FOL models: to define valid FOL
inference. Following the definition pattern from {{< chapter_ref
chapter="valid-inference" >}}Valid inference{{< /chapter_ref >}}, we ask: Does
every model that makes our premises true also make the conclusion true? To
illustrate, consider Socrates again:

{{< img src="/img/drawings/fol_socrates.svg" class="float-end ms-3" width="55px" alt="Socrates." >}}

$$
∀x (Human(x) → Mortal(x)), Human(Socrates) ∴ Mortal(Socrates).
$$

The premises tell us that Socrates is human and that all humans are mortal.
Whatever else a model contains, those two facts require Socrates to be mortal.
The same kind of reasoning appears in mathematics. If every number is smaller
than its successor $S(x)$, then every number has a larger number:

$$
∀x (x < S(x)) ∴ ∀x ∃y (x < y).
$$

How can a computer establish such inferences? Having defined validity for FOL
inference, we quickly meet a _fundamental_ computational limit: as a matter of
mathematical fact, no algorithm can decide every case. Yet FOL remains a
standard for rigorous reasoning in mathematics and AI. So, we need methods for
finding and checking proofs --- even if they cannot settle _every_ question. In
this chapter, we will extend the resolution algorithm to FOL, we'll extend
natural deduction and Lean to quantifiers, and we'll use Lean to verify a _bona
fide_ mathematical argument from Boolean algebra.

{{< callout type="objectives" >}}
After studying this chapter, you will be able to:

- Define first-order consequence and explain the limits of deciding it.
- Apply Robinson's algorithm to find a most general unifier or detect failure.
- Transform first-order sentences into equisatisfiable clause form.
- Use first-order resolution and factoring to construct refutations.
- Construct natural deduction proofs with the quantifier rules and their side conditions.
- Verify quantified inferences and a Boolean algebra argument in Lean.
{{< /callout >}}

## Valid inference {#valid-inference}

Our definition pattern for valid inference is the one from {{< chapter_ref
chapter="valid-inference" id="always--deductive-validity" >}}Valid inference{{<
/chapter_ref >}}: whenever the premises are true, the conclusion must be true
too. {{< chapter_ref chapter="fol" >}}FOL{{< /chapter_ref >}} supplied the
definition of FOL models and the truth conditions for FOL formulas in a model
under a variable assignment. We get:

{{< callout type="definition" title="First-order consequence" >}}
$A$ is a {{< term "fol-consequence" "first-order consequence" >}} of premises
$Γ$, written $Γ ⊨ A$, iff every model and variable assignment satisfying
all formulas in $Γ$ also satisfies $A$. Formally, for every $M$ and $v$:

$$
If M,v ⊨ B for all B ∈ Γ, then M,v ⊨ A.
$$
{{< /callout >}}

Note that for sentences, we can omit the assignment: every model of the
premises must make the conclusion true. As in {{< chapter_ref
chapter="valid-inference" >}}Valid inference{{< /chapter_ref >}}, the symbol
$∴$ indicates an inference, while the symbol $⊨$ asserts that it is valid.

<span id="socrates-in-any-model"></span>

To illustrate, take any model that makes the premises of our Socrates
inference true. This means that in the model, all humans are mortal, and the
object named $Socrates$ is among its humans. So that object is mortal. Inspect
the diagram below to convince yourself of the fact that our definitions give
us precisely this result. Note that in the model there may be other objects,
and $Socrates$ may denote a different object in another model; the argument
still works.

{{< logic-app name="fol-model" kind="consequence" model="finf-socrates" title="Socrates in an arbitrary model" >}}

The diagram shows only what the premises tell us about an arbitrary model.

A {{< term "countermodel" "countermodel" >}} makes the premises true and the
conclusion false. Reverse the Socrates inference:

$$
∀x (Human(x) → Mortal(x)), Mortal(Socrates) ⊭ Human(Socrates).
$$

Here is a complete countermodel with one mortal object and no humans: a model
where the premises of the inference are true but the conclusion is false.

{{< logic-app name="fol-model" model="finf-countermodel" kind="evaluate" editable="false" view="sets" formula="((∀x (Human(x) → Mortal(x)) ∧ Mortal(Socrates)) ∧ ¬Human(Socrates))" title="A countermodel to the reversed Socrates inference" >}}

<span id="a-mathematical-example"></span>

Our mathematical example uses the same method. In any model of
$∀x (x < S(x))$, take an arbitrary object $d$. The premise says that
$d < S(d)$, so $S(d)$ supplies the existential witness. This works for
every object $d ∈ D$:

$$
∀x (x < S(x)) ⊨ ∀x ∃y (x < y).
$$

{{< logic-app name="fol-model" kind="consequence" model="finf-successor" title="A witness for each arbitrary object" >}}

As in {{< chapter_ref chapter="fol" >}}FOL{{< /chapter_ref >}}, we write $LessThan(x, y)$ for $x < y$.
Interpreting $S(n)$ as $n + 1$ and $<$ as the usual ordering gives our
natural-number example. The inference itself needs only the stated premise.
Neither symbol has its intended mathematical meaning built into FOL.

We cannot exchange the quantifiers in the conclusion. On the natural numbers,
each $x$ has a larger number, but no one number is larger than them all:

$$
∀x ∃y (x < y) ⊭ ∃y ∀x (x < y).
$$

The witness may depend on $x$. We'll return to this restriction when we
introduce the quantifier rules.

<span id="why-brute-force-does-not-suffice"></span>

{{< img src="/img/drawings/finf_infinities.svg" class="float-end ms-3" width="180px" alt="Models with finite, countably infinite, and uncountable domains." >}}
Could we automate validity by checking models? In propositional logic, a
truth-table lists all assignments to the finitely many variables. FOL has
models of arbitrarily large finite size, and infinite models too.


Checking size one, then two, and so on never reaches an infinite model.
Some FOL sentences have only infinite models, as we saw in {{< chapter_ref chapter="fol" id="finite-models" >}}FOL{{< /chapter_ref >}}.
Their negations hold in every finite model but can still fail in an infinite
one. Finite testing can therefore miss a countermodel altogether.

{{< callout type="theorem" title="Undecidability of first-order inference" >}}
First-order consequence is {{< term "undecidable" "undecidable" >}}:
no algorithm always terminates and correctly decides whether $Γ ⊨ C$
for an arbitrary finite list of FOL premises $Γ$ and conclusion $C$.
{{< /callout >}}

{{< img src="/img/drawings/finf_turing.svg" class="float-start me-3" width="210px" alt="A Turing machine asks whether it will ever stop." >}}

This is the limit established by Church and Turing's work on the
[decision problem](https://en.wikipedia.org/wiki/Entscheidungsproblem).
The {{< term "halting-problem" "halting problem" >}} can be encoded in
first-order inference: a general decision procedure for these inferences
would also decide whether any given program stops. Turing showed that no
algorithm can do that. See Wikipedia's
[halting problem article](https://en.wikipedia.org/wiki/Halting_problem).

<span id="searching-for-proofs"></span>

Proofs still give us a way to automate inference. They are finite, and checking
their steps can be mechanical. A complete calculus guarantees a proof for
every valid inference. Searching all candidate proofs will eventually find it.

{{< callout type="theorem" title="Semidecidability" >}}
First-order consequence is {{< term "semidecidability" "semidecidable" >}}:
an algorithm can confirm every valid inference from finitely many premises,
while never accepting an invalid one. On invalid inputs it may run forever.
{{< /callout >}}

We will study resolution for automated proof search, then natural deduction
and Lean for constructing and checking proofs. Both need to handle the
objects inside our formulas. Even Socrates's inference requires matching the
general claim about $Human(x)$ with the particular fact $Human(Socrates)$.
Finding such substitutions is our first computational task.

## Unification

To apply modus ponens to the Socrates premises, we first instantiate the bound
variable in the universal premise with the {{< term "constant" "constant" >}} $Socrates$. That gives us
$Human(Socrates) → Mortal(Socrates)$, to which we can apply modus ponens.

{{< logic-app name="deduction" language="fol" kind="worked" display="full" example="socrates" title="Socrates by universal instantiation and modus ponens" >}}

The choice of term came from matching $Human(x)$ with $Human(Socrates)$.
We want an algorithm to find such matches even when the terms contain functions
or several variables.

{{< callout type="definition" title="Unifier" >}}
A {{< term "unifier" "unifier" >}} of expressions $A$ and $B$ is a
substitution $σ$ such that $Aσ$ and $Bσ$ are syntactically identical.
{{< /callout >}}

Here $σ = [x/Socrates]$. We use the
{{< term "substitution" "substitution" >}} convention from {{< chapter_ref chapter="fol" id="substitution" >}}FOL{{< /chapter_ref >}}:
$[x/t]$ replaces free occurrences of $x$ by the {{< term "term" "term" >}}
$t$. It must not capture variables. For unification, we'll initially work with
terms and atomic formulas, which contain no quantifier binders.

A substitution can replace several variables simultaneously. For example,
$R(x,y)$ and $R(a,f(a))$ have the unifier $[x/a,y/f(a)]$. Constants and
{{< term "function-symbol" "function symbols" >}} remain fixed. We can't
unify $Human(a)$ with $Mortal(a)$ by replacing the predicate $Human$.

{{< callout type="definition" title="Most general unifier" >}}
A {{< term "most-general-unifier" "most general unifier" >}} (MGU) of two
expressions is a unifier from which every other unifier can be obtained by
further substitution.
{{< /callout >}}

For $R(x,y)$ and $R(z,z)$, the substitution $[x/z,y/z]$ is an MGU. The
substitution $[x/a,y/a,z/a]$ also unifies them, but makes an additional choice
-- viz. $[z/a]$. An MGU leaves such a choice available for later inference
steps.

### Robinson's algorithm {#robinsons-algorithm}

The first algorithm for {{< term "unification" "unification" >}} is due to
[John Alan Robinson](https://en.wikipedia.org/wiki/John_Alan_Robinson), who
also developed the resolution method we'll study next. The algorithm builds
a substitution by comparing the expressions a pair of terms at a time.

Suppose we want to unify $LiesBetween(Munich, y, z)$ and
$LiesBetween(x, Milan, Rome)$. Before comparing their arguments, we check:

1. **Do the signs agree?** Both literals are positive. A positive literal
   and a negative one, such as $Human(x)$ and $¬Human(Socrates)$, cannot
   become identical by substituting terms.
2. **Do the predicates agree?** Both use the three-place predicate
   $LiesBetween$. Substitution cannot change a predicate symbol or its arity;
   for example, it cannot turn $Human(x)$ into $Mortal(x)$.

Our two literals pass both checks.
We need to make the corresponding arguments agree too: $Munich$ with $x$,
$y$ with $Milan$, and $z$ with $Rome$. Record these requirements in a list:

$$
Eq = [Munich ≐ x, y ≐ Milan, z ≐ Rome].
$$

Here $s ≐ t$ asks for a substitution that makes $s$ and $t$ syntactically
identical. $≐$ records a syntactic matching requirement; $=$ expresses identity
between objects in a model. We start with the empty substitution $σ = []$
and go through the pairs in $Eq$.

For each pair $s ≐ t$, distinguish the following cases:

- **Delete.** If $s$ and $t$ are already identical, delete the pair. There is nothing
  to do for $x ≐ x$ or $Munich ≐ Munich$.
- **Occurs check / Eliminate.** If only $s$ is a variable, say $x$, check whether it occurs in $t$. If it
  does, stop: no unifier exists. This is called the
  {{< term "occurs-check" "occurs check" >}}. If the occurs check passes,
  replace $x$ by $t$ in all other pairs and in the terms already recorded in
  $σ$. Add $[x/t]$ to $σ$ and delete the pair $s ≐ t$ from $Eq$.
- **Eliminate.** If $s$ and $t$ are distinct variables, say $x ≐ y$, replace $x$ by $y$
  throughout the other pairs and the terms already recorded in $σ$.
  Add $[x/y]$ to $σ$ and remove the pair from $Eq$.
- **Orient.** If only $t$ is a variable, swap the sides and use the case where the first term
  is a variable. Our pair $Munich ≐ x$, for example, becomes $x ≐ Munich$.
- **Clash / Decompose.** If neither term is a variable, compare their outer symbols and arities. A
  constant counts as a symbol with no arguments. If the symbols or arities
  differ, stop --- they cannot be unified. If they agree, replace
  the pair by its corresponding argument pairs. For example, $fatherOf(x) ≐
  fatherOf(y)$ becomes $x ≐ y$.
- Distinct constants, such as $Munich$ and $Milan$, also give a symbol clash.

Repeat this procedure until a failure occurs or the list is empty. In our
example, we successively record $[x/Munich]$, $[y/Milan]$, and $[z/Rome]$. No
pairs remain, so their combination unifies the original literals. In general,
successful termination gives a most general unifier.

{{< logic-app name="fol-inference" kind="unify" formula="LiesBetween(Munich, y, z); LiesBetween(x, Milan, Rome)" title="Robinson's algorithm" >}}

Decompose compares the arguments of the two expressions. The remaining
equations and the substitution $σ$ record what still needs to be matched
and what we have established so far.

The {{< term "occurs-check" "occurs check" >}} prevents a variable from
being replaced by a term containing that same variable. Try $x$ and $fatherOf(x)$.
Whatever finite term replaces $x$, the right side still has an extra
$fatherOf$ around it. They cannot become identical. We delete $x ≐ x$
before this check because identical terms need no replacement.
Wikipedia's [occurs check](https://en.wikipedia.org/wiki/Occurs_check)
article explains the consequences of omitting it.

Updating earlier replacements is called *composition*. In Nested functions,
we first record $[y/motherOf(x)]$, then discover $[x/London]$. The final
substitution must send $y$ directly to $motherOf(London)$.

For resolution, we want opposite-sign literals with *matching atoms*.
We therefore apply the algorithm to those atoms, leaving their signs alone.
The term comparisons are exactly the same.

Here is the algorithm in the Python-like
{{< chapter_ref chapter="formal-languages" id="algorithms-and-pseudocode" >}}pseudocode{{< /chapter_ref >}}
introduced in {{< chapter_ref chapter="formal-languages" >}}Formal languages{{< /chapter_ref >}}. `take_equation` removes the first equation; `left` and
`right` read its two sides. `substitute_all` replaces the variable throughout
the remaining equations. `compose` makes the same replacement in recorded
terms and adds the new binding. `argument_equations` supplies the pairs of
arguments, and `prepend` puts them at the front of the list.

```python
def unify(equations):
    substitution = empty_substitution()
    while not is_empty(equations):
        equation = take_equation(equations)
        first = left(equation)
        second = right(equation)
        if first == second:
            continue
        if is_variable(second) and not is_variable(first):
            equation = reverse(equation)
            first = left(equation)
            second = right(equation)
        if is_variable(first):
            if occurs(first, second):
                return failure
            equations = substitute_all(equations, first, second)
            substitution = compose(substitution, first, second)
        else:
            if not matching_heads(first, second):
                return failure
            equations = prepend(argument_equations(first, second), equations)
    return substitution
```

`matching_heads` checks the fixed symbol, its kind, and its arity. Each
elimination removes a variable from the unsolved equations. Between eliminations,
decomposition reduces the expressions to their parts. Thus the algorithm
terminates. Its steps preserve the possible solutions, and successful
termination supplies an MGU. Unification itself is decidable even though
unrestricted first-order validity is not.

Wikipedia's [unification article](https://en.wikipedia.org/wiki/Unification_(computer_science)#Unification_algorithms)
compares Robinson's procedure with later algorithms.

<span id="where-instantiation-applies"></span>

Universally quantified rules such as
$∀x∀y (Sibling(x,y) → Sibling(y,x))$ can be used by instantiating both
variables. A match with $Sibling(a,b)$ supplies $[x/a,y/b]$ and gives
$Sibling(b,a)$ by modus ponens. This supports first-order forward and backward
chaining on suitable rule sets.

We cannot delete quantifiers wherever they occur. Consider:

$$
∀x ((∀y BiggerThan(x,y)) → Giant(x)).
$$

This says that anyone bigger than everything is a giant. Together with
$∀y BiggerThan(PolyphemOS,y)$, it entails $Giant(PolyphemOS)$.
The single fact $BiggerThan(PolyphemOS,tinymouse)$ does not suffice.
A domain with two objects $p,m$, with $BiggerThan$ true only of $(p,m)$ and
$Giant$ true of nothing, gives a countermodel to that second inference.
Interpret $PolyphemOS$ as $p$ and $tinymouse$ as $m$.

The inner universal occurs in a conditional antecedent. Rewriting the
conditional exposes its role:

$$
∀x ((∀y BiggerThan(x,y)) → Giant(x))
≡ ∀x ((∃y ¬BiggerThan(x,y)) ∨ Giant(x)).
$$

The rewritten formula contains an existential quantifier. Before applying
resolution, we need to replace it in a way that preserves satisfiability.

## Normal forms {#fol-normal-forms}

Resolution, like the other algorithms we've studied, expects its input in a
particular form. In {{< chapter_ref chapter="sat" >}}Boolean SAT{{< /chapter_ref >}},
that form was CNF: a conjunction of clauses. First-order resolution also works
with clauses, but their atoms can now contain predicates, variables, and
function terms. The clauses have no written quantifiers; their variables
are understood as universally quantified.

{{< callout type="definition" title="First-order CNF" >}}
A {{< term "fol-literal" "first-order literal" >}} is an atomic FOL formula
or its negation. A {{< term "fol-clause" "first-order clause" >}} is a finite
disjunction of such literals, with all free variables understood as universally
quantified. A single literal is a clause; the empty disjunction is $⊥$.
A {{< term "fol-cnf" "first-order CNF" >}} is a conjunction of these clauses.
{{< /callout >}}

How do we put a quantified formula into this form? In propositional logic,
we could use equivalent rewrites throughout. In FOL, we cannot generally
eliminate existential quantifiers that way. For example, $∃x Human(x)$ says
that there is a human, but does not name one. Replacing it with $Human(a)$
would make a claim about a particular object, which might not be human.
We need a different guarantee for this preprocessing step.

Other first-order normal forms organize quantifiers differently.
[Prenex normal form](https://en.wikipedia.org/wiki/Prenex_normal_form), for
example, puts all quantifiers at the front. We won't study those forms here;
our aim is the clause form required by resolution.

### Equisatisfiability {#equisatisfiability}

For a satisfiability test, we need to preserve whether a model exists.
We met this requirement in the optional discussion of Tseytin conversion in
{{< chapter_ref chapter="sat" >}}Boolean SAT{{< /chapter_ref >}}:

{{< callout type="definition" title="Equisatisfiability" >}}
Two formulas are {{< term "equisatisfiable" "equisatisfiable" >}} if either
both have a model or neither has a model. Their languages may differ.
{{< /callout >}}

{{< term "equivalence" "Logical equivalence" >}} requires the same truth-value
in every model. Equisatisfiability requires only agreement on whether there
is a model at all. That is enough for a refutation: if the rewritten input
has no model, neither does the original input.

Consider $∃x Human(x)$ again. This time, introduce a *fresh* constant $sk₁$
and replace the sentence by $Human(sk₁)$. If there is a human, we can
interpret $sk₁$ as that human. Conversely, if $Human(sk₁)$ is true, there
is a human. The two sentences are therefore equisatisfiable.

They are not equivalent. In a model containing a human and a nonhuman,
$∃x Human(x)$ is true. Interpreting $sk₁$ as the nonhuman makes
$Human(sk₁)$ false. We can make it true by choosing the human instead.

Freshness lets us make this choice without changing the interpretation of
any symbol in the original input. Thus we can preserve satisfiability of
the premises *together with* the negated conclusion, which is what a
refutation needs. For example, if we also have $¬Human(a)$, using $a$ as
the witness would introduce a contradiction; a fresh $sk₁$ can name
someone else.

### Skolemization {#skolemization}

The trick for eliminating existential quantifiers is called
{{< term "skolemization" "Skolemization" >}}. We give each existential a
fresh name for its witness. The result is equisatisfiable with the original
formula, which is enough for testing satisfiability and consequence.
When a witness depends on another object, its name must be a function term.

{{< img src="/img/drawings/finf_ai_quantifier_elimination.svg" width="180px" class="float-end ms-3" alt="A robot ushers the quantifiers out." >}}

We prepare the formula and eliminate its existentials in this order:

1. **Eliminate $→$ and $↔$.** Use the same equivalences as in propositional
   CNF conversion, starting with $A → B ≡ ¬A ∨ B$.
2. **Move negations to atoms.** Use De Morgan's laws, remove double negations,
   and rewrite $¬∀x A$ as $∃x¬A$ and $¬∃x A$ as $∀x¬A$.
   This gives {{< term "negation-normal-form" "negation normal form" >}}:
   negations apply only to atoms. A negated universal has now become an
   existential, so it too needs a witness.
3. **Give distinct quantifiers distinct variables.** This is
   {{< term "alpha-renaming" "α-renaming" >}}. For example,
   $∃x(Human(x) ∧ ∀x Mortal(x))$ becomes
   $∃x(Human(x) ∧ ∀y Mortal(y))$. Choose names unused elsewhere in the input.
   The renamed occurrences still belong to the same quantifiers.
4. **Replace each existential by a fresh witness.** Work from the outside in.
   List the universal variables whose scopes contain that existential; they
   become the arguments of its witness function. If there are none, use a
   constant. Apply the following rule until no existential quantifiers remain.

{{< callout type="definition" title="Skolemization rule" >}}
In a sentence in negation normal form with distinct bound variables, let
$∃y B$ have no enclosing existential and lie in the scopes of
$∀x₁, …, ∀xₙ$. Replace this occurrence by

$$
∃y B ⟹ B[y/skᵢ(x₁, …, xₙ)],
$$

where $skᵢ$ is a fresh function symbol. If $n = 0$, use a fresh constant
$skᵢ$ and replace $∃y B$ by $B[y/skᵢ]$.
{{< /callout >}}

Here $⟹$ marks an equisatisfiable transformation of the whole sentence.
The substitution replaces the free occurrences of $y$ in $B$; the new
symbol must be unused throughout the input. The first three preparation
steps preserve equivalence. The witness replacement preserves satisfiability.

For $∀x∃y R(x,y)$, the witness for $y$ may depend on $x$. A fresh
{{< term "skolem-function" "Skolem function" >}} $sk₁$ records that choice:

$$
∀x∃y R(x,y) ⟹ ∀x R(x,sk₁(x)).
$$

For $∃y∀x R(x,y)$, we must choose one witness before considering $x$.
In this separate example, $sk₁$ is a fresh
{{< term "skolem-constant" "Skolem constant" >}}:

$$
∃y∀x R(x,y) ⟹ ∀x R(x,sk₁).
$$

The difference is visible in a two-object model where $R$ is identity.
Every object is related to itself, so the first sentence is true. No one
object is related to both objects, so the second is false. Using a constant
for the first sentence would incorrectly require a shared witness.

Each existential gets its own fresh symbol. For example,
$∀x(∃y R(x,y) ∧ ∃z R(z,x))$ becomes
$∀x(R(x,sk₁(x)) ∧ R(sk₂(x),x))$. Different symbols allow different choices;
$sk₁(d)$ and $sk₂(d)$ may still denote the same object. Only enclosing
universal quantifiers supply arguments: in
$∀x((∀y R(x,y)) ∨ ∃z R(x,z))$, the witness for $z$ is $sk₁(x)$.
The quantifier $∀y$ belongs to the other branch.

The following examples show the four steps, one rewrite at a time:

{{< logic-app name="fol-inference" kind="skolem" title="Skolemization, one rewrite at a time" >}}

### CNF conversion {#clause-form}

Skolemization leaves us with universal quantifiers and a formula built from
literals using $∧$ and $∨$. We still need a conjunction of clauses.
The full conversion procedure is:

1. Eliminate arrows, move negations inward, rename bound variables, and
   Skolemize, following the four steps above.
2. Leave the remaining universal quantifiers implicit. Since their variables
   are distinct and only $∧$ and $∨$ connect their scopes, we can read all
   remaining variables as universally quantified.
3. Distribute $∨$ over $∧$, using the propositional CNF equivalences.
4. Take each conjunct as a clause. Its
   {{< term "universal-closure" "universal closure" >}} quantifies all its
   free variables; each clause has its own variable scope.

For example, start with:

$$
∀x∃y (R(x,y) ∨ (P(x) ∧ Q(y))).
$$

There are no arrows or negations to change, and the bound variables are
already distinct. Skolemization gives:

$$
∀x (R(x,sk₁(x)) ∨ (P(x) ∧ Q(sk₁(x)))).
$$

Leave $∀x$ implicit and distribute the disjunction. The resulting CNF is:

$$
(R(x,sk₁(x)) ∨ P(x)) ∧ (R(x,sk₁(x)) ∨ Q(sk₁(x))).
$$

Both clauses are understood as universally closed. The conjunction is
satisfiable exactly when the original sentence is. We can now pass these
clauses to resolution.

<span id="resolution-and-factoring"></span>

## FOL resolution {#fol-resolution}

With the input in clause form, we can use unification to extend resolution
to FOL. As in {{< chapter_ref chapter="sat" >}}Boolean SAT{{< /chapter_ref >}},
we test an inference by looking for a contradiction in its premises together
with the negated conclusion.

{{< callout type="definition" title="First-order satisfiability" >}}
A set of FOL sentences is {{< term "fol-satisfiability" "satisfiable" >}} iff some
first-order model makes them all true. The {{< term "fol-sat" "FOL SAT problem" >}} asks whether
a given finite set of FOL sentences is satisfiable.
{{< /callout >}}

For an inference, add the negation of the conclusion to the premises:

$$
P₁, …, Pₙ ⊨ C  iff  {P₁, …, Pₙ, ¬C} is unsatisfiable.
$$

A model of these sentences would be a countermodel to the inference.
A {{< term "refutation" "refutation" >}} rules out such a model. This is
the same reduction we used in {{< chapter_ref chapter="sat" >}}SAT{{<
/chapter_ref >}}, now over FOL models. The undecidability result rules out a
general decision procedure for FOL SAT too.

For Socrates, the premises and negated conclusion have the clause form:

$$
(¬Human(x) ∨ Mortal(x));&emsp; Human(Socrates);&emsp; ¬Mortal(Socrates).
$$

The semicolons separate conjuncts. The first clause means
$∀x(¬Human(x) ∨ Mortal(x))$. As in
{{< chapter_ref chapter="conditionals" >}}Conditionals{{< /chapter_ref >}},
associativity, commutativity, and idempotence let us ignore brackets, order,
and repeated identical literals within a clause. The
{{< term "empty-clause" "empty clause" >}} $⊥$ is false in every model;
deriving it establishes that the clauses cannot all be true.

In {{< chapter_ref chapter="sat" >}}SAT{{< /chapter_ref >}}, resolution cancelled an atom against its negation. In FOL,
we first use unification to make the selected atoms match. For instance,
$Human(x)$ matches $Human(Socrates)$ under $[x/Socrates]$.

The rule for {{< term "fol-resolution" "first-order resolution" >}} is:

{{< logic-app name="fol-inference" kind="resolution-rule" title="Resolution and factoring rules" >}}

In Resolution, $B$ and $D$ are atoms, and $σ$ is their MGU. The other
literals form $C$ and $E$; either part can be empty. Remove the two
opposite-sign literals, join what remains, and apply $σ$ throughout.
The Factoring rule beneath it combines matching literals of the same sign
within one clause. We'll use that rule shortly.

The selected opposite-sign literals are the
{{< term "resolution-pivot" "pivots" >}}. Their atoms must unify. Apply the
substitution to *every* remaining literal in both clauses. Resolving
$(¬Human(x) ∨ Mortal(x))$ with $Human(Socrates)$ therefore gives
$Mortal(Socrates)$. Resolving that with $¬Mortal(Socrates)$ gives the
empty clause.

{{< logic-app name="sat" language="fol" kind="resolution" title="First-order resolution: Socrates and PolyphemOS" >}}

Each use of a clause needs fresh variables. This is called
{{< term "standardizing-apart" "standardizing apart" >}}. For example,
$P(x)$ and $¬P(f(x))$ have separate universal scopes. Renaming the second
variable to $y$ permits the unifier $[x/f(y)]$ and an empty resolvent.
Treating the two printed occurrences of $x$ as one variable would incorrectly
make the occurs check block that inference.

{{< term "factoring" "Factoring" >}} unifies two same-sign literals in one
clause, applies the unifier to the whole clause, and retains one copy of the
resulting duplicate literal.

The clauses $(P(x) ∨ P(y))$ and $(¬P(u) ∨ ¬P(v))$ are jointly unsatisfiable.
Factoring gives the unit clauses $P(y)$ and $¬P(v)$, which resolve to the
empty clause. Binary resolution alone is insufficient for completeness;
factoring supplies the required same-clause inferences.

{{< logic-app name="sat" language="fol" kind="resolution" formula="∀x ∀y (P(x) ∨ P(y)); ∀x ∀y (¬P(x) ∨ ¬P(y))" title="Resolution with factoring" >}}

<span id="resolution-workflow"></span>

Return to our inference about PolyphemOS: it is bigger than everything, and
anyone bigger than everything is a giant. To show that $Giant(PolyphemOS)$
follows, we prepare a refutation:

The premises are $∀x((∀y BiggerThan(x,y)) → Giant(x))$ and
$∀z BiggerThan(PolyphemOS,z)$; add $¬Giant(PolyphemOS)$.
Our normal-form procedure gives these three clauses:

$$
(¬BiggerThan(x,sk₁(x)) ∨ Giant(x));&emsp; BiggerThan(PolyphemOS,z);&emsp; ¬Giant(PolyphemOS).
$$

The first premise's inner $∀y$ became an existential when we moved its
negation inward. Its fresh witness $sk₁(x)$ depends on $x$.

Resolve the first two clauses on $BiggerThan$. Their atoms require
$[x/PolyphemOS,z/sk₁(PolyphemOS)]$; the remaining clause is $Giant(PolyphemOS)$.
Resolving it with the negated conclusion gives $⊥$.

Since the prepared clauses are unsatisfiable, the premises together with the
negated conclusion are unsatisfiable too. Thus the conclusion follows in every
model of the original premises. The Skolem function was an auxiliary symbol
used in the refutation. Knowing only that PolyphemOS is bigger than tinymouse
would not supply the needed instance $BiggerThan(PolyphemOS,sk₁(PolyphemOS))$.

{{< callout type="theorem" title="Refutation completeness" >}}
For equality-free first-order clauses, resolution with most general unifiers,
standardizing apart, and factoring is sound and refutation-complete: every
unsatisfiable finite clause set has a finite derivation of the empty clause.
{{< /callout >}}

{{< term "fair-search" "Fair search" >}} eventually considers every eligible
inference, so it eventually finds such a refutation. A satisfiable input may
keep generating clauses such as $P(a), P(f(a)), P(f(f(a))), …$. Stopping
after a fixed number of steps leaves the answer undecided.

With identity, we need rules that respect its fixed interpretation. For
example, $a=b$ and $P(a)$ entail $P(b)$. Treating $=$ as an arbitrary predicate
would miss this. Equality axioms can be added, while automated provers commonly
use specialized equality inferences such as paramodulation or superposition.

## Natural deduction {#natural-deduction-and-lean}

Resolution supplies refutations. To build proofs directly from quantified
premises, we extend the natural deduction rules from
{{< chapter_ref chapter="proofs" >}}Proofs{{< /chapter_ref >}}. The propositional
rules still apply. Four quantifier rules control when we may introduce an
arbitrary object, instantiate a general claim, supply a witness, or reason
from an unknown witness.

{{< logic-app name="deduction" language="fol" kind="rules" title="Quantifier and identity rules" >}}

### Quantifier rules {#universal-introduction-and-elimination}

*Universal introduction* lets us infer $∀x A$ from a derivation of $A$, provided $x$
is not free in any undischarged assumption on which the derivation depends.

The variable $x$ stands for an arbitrary object. Such a variable is often
called an {{< term "eigenvariable" "eigenvariable" >}}. The side condition
ensures that our argument has not assumed anything special about that object.
For example, from the open assumption $x < z$, we cannot infer $∀x (x < z)$:
$x$ is free in an assumption on which the conclusion depends. In the natural
numbers, assigning $0$ to $x$ and $1$ to $z$ makes the assumption true, but
$∀x (x < z)$ is false. In particular, $1$ is not smaller than itself.

This blocks the attempted quantifier swap from our earlier example.
From $∀x∃y (x < y)$, we may instantiate at $x$ and reason temporarily with
$x < z$, where $z$ names a witness larger than $x$. We may not generalize
that temporary assumption to $∀x (x < z)$. The assumption $x < z$ is still
open, so the chosen witness may depend on $x$. Calling $x$ arbitrary does not
remove that dependence.

Once an assumption has been discharged, it no longer restricts universal
introduction. The next proof first discharges $Human(x)$ to obtain
$Human(x) → Human(x)$. No open assumption contains $x$, so generalization
is then allowed:

{{< logic-app name="deduction" language="fol" kind="worked" example="universal" title="Generalize after discharging the assumption" >}}

*Universal elimination* lets us infer $A[x/t]$ from $∀x A$, provided the term $t$ is
free for $x$ in $A$.

{{< term "free-for" "Free for" >}} means that no variable in the replacing
term becomes bound when we substitute it for a free occurrence of $x$ in $A$.
Consider $∀x∃y (x < y)$. If we replace $x$ by $y$ in its displayed scope
without checking this condition, we get $∃y (y < y)$. The original sentence
is true in the natural numbers, but this supposed instance is false: no number
is smaller than itself. The inserted $y$ was captured by the existential
quantifier.

We can use $y$ as the term after renaming the conflicting binder. Write the
premise as $∀x∃z (x < z)$; universal elimination now gives $∃z (y < z)$.
Here $y$ remains free, and the conclusion says that the object assigned to it
has a larger object.

Together, these rules let us distribute the universal quantifier over a
conjunction. Instantiate the premise at an arbitrary $x$, project each
conjunct, and generalize each result:

{{< logic-app name="deduction" language="fol" kind="worked" example="distribution" title="Universal quantification distributes over conjunction" >}}

<span id="existential-introduction-and-elimination"></span>

*Existential introduction* lets us infer $∃x A$ from $A[x/t]$, provided $t$ is free
for $x$ in $A$.

The term $t$ supplies a {{< term "existential-witness" "witness" >}}.
The free-for condition is the same as for universal elimination. For a
counterexample, take $A$ to be $∀y (x = y)$ and try to use $y$ as the term
replacing $x$. Substituting without renaming would give $∀y (y = y)$.
The resulting inference is invalid:

$$
∀y (y = y) ⊭ ∃x∀y (x = y).
$$

The left sentence is true in every model. The right sentence says that one
object is identical to every object, which is false in any domain with at
least two objects. The attempted substitution captured $y$. After renaming
the bound variable, the required instance would be $∀z (y = z)$, which the
reflexivity sentence does not give us.

For example, from $Human(Socrates)$ we obtain $∃x Human(x)$ using $Socrates$:

{{< logic-app name="deduction" language="fol" kind="worked" display="full" example="existential" title="Socrates supplies an existential witness" >}}

*Existential elimination* uses $∃x A$ and a derivation of $C$ under the
temporary assumption $A[x/z]$. It infers $C$ and discharges that assumption. The witness
variable $z$ must be free for $x$ in $A$ and must not occur free in $C$, in
$∃x A$, or in any remaining undischarged assumption of the inference.

The temporary assumption lets us reason about a witness without knowing which
object it is. Discharging that assumption must leave a conclusion independent
of the name we chose. Each freshness condition prevents a different mistake:

- The witness variable must not be free in the conclusion $C$. From
  $∃y (x < y)$, we can open a subproof with $x < z$, but we cannot export
  $x < z$ as its conclusion. The premise is true in the natural numbers;
  $x < z$ is false when both free variables are assigned $0$. The premise
  promises a larger object, without saying that an independently chosen $z$
  names it.
- The witness variable must not be free in another assumption that remains
  open. Suppose we also assume $¬(x < z)$. Using this same $z$ as the witness
  for $∃y (x < y)$ would produce a contradiction from $x < z$ and
  $¬(x < z)$. But both original premises are true when $x$ and $z$ are
  assigned $0$: there is a number larger than $0$, and $0$ is not larger
  than itself. A fresh witness variable avoids that false identification.
- The witness variable must not be free in the existential premise itself.
  From $∃y (z < y)$, choosing $z$ as the witness for $y$ would give the
  temporary assumption $z < z$. The premise is true in the natural numbers,
  while that assumption is impossible there. We must give the witness a
  fresh name.

The substitution $A[x/z]$ must also be free of capture. Rename any conflicting
bound variables before opening the subproof. Then discharge the witness
assumption when applying existential elimination; any other assumptions used
by the subproof remain open.

For example, $∃x Black(x)$ lets us establish
$∃x(Black(x) ∨ White(x))$. The temporary witness proves the disjunction, and
we existentially quantify it before closing the subproof. The final conclusion
contains no free occurrence of its name:

{{< logic-app name="deduction" language="fol" kind="worked" example="witness" title="Reason from an unknown witness and discharge its assumption" >}}

<span id="quantifier-proof-strategy"></span>

The {{< chapter_ref chapter="proofs" >}}proof strategies{{< /chapter_ref >}}
extend to quantified goals. A universal goal suggests introducing an arbitrary
object. An existential goal asks for a witness and a proof of its instance.
The premises help determine which object to use: a universal premise can be
instantiated at a useful term, while an existential premise opens a temporary
subproof with an unknown witness.

For example, from $∃x∀y R(x,y)$ we want $∀y∃x R(x,y)$. Start with the
universal goal and take an arbitrary $y$. The existential premise supplies
an unknown $x$ together with $∀y R(x,y)$. Instantiate that assumption at our
chosen $y$, then use $x$ as the witness for $∃x R(x,y)$. This conclusion has
no free $x$, so we can close the witness subproof and generalize $y$.
The reverse inference would require one witness that works for every $y$;
separate witnesses do not guarantee that. For a countermodel to the reverse
inference, interpret $R(x,y)$ as $y < x$ in the natural numbers, as in our
[earlier example](#a-mathematical-example).

{{< logic-app name="deduction" language="fol" kind="worked" example="switcheroo" title="Plan a proof with two quantifiers" >}}

The [natural deduction exercises](/exercises/fol-inference/#natural-deduction)
let you construct these proofs, with the quantifier side conditions checked
at each step.

<span id="classical-quantifiers"></span>

The four quantifier rules can be used together with either intuitionistic or
classical propositional rules. Here we use the classical rule
from {{< chapter_ref chapter="proofs" >}}Logical proofs{{< /chapter_ref >}}.
One place we need it is the inference from $¬∀x A(x)$ to $∃x¬A(x)$.

Assume temporarily that $∃x¬A(x)$ is false. For an arbitrary $x$, the
assumption $¬A(x)$ would provide exactly such a witness and lead to a
contradiction. Classical reasoning gives $A(x)$. Generalizing gives $∀x A(x)$,
contradicting the premise. A second classical step discharges the temporary
assumption and establishes the existential conclusion.

{{< logic-app name="deduction" language="fol" kind="worked" example="duality-one-ltr" title="Classical quantifier duality" >}}

The converse, from $∃x¬A(x)$ to $¬∀x A(x)$, needs no classical step: an
unknown counterexample contradicts a universal claim instantiated there.
Both directions between $¬∃x A(x)$ and $∀x¬A(x)$ also have intuitionistic
proofs. In the exercises, identify which rule closes each contradiction;
negation introduction and the classical rule have different conclusions.

### Identity {#equality-inference}

{{< chapter_ref chapter="fol" id="truth-and-satisfaction" >}}FOL{{< /chapter_ref >}} interprets {{< term "identity" "identity" >}} as sameness of domain
objects. If $a=b$ and $Human(a)$, then $Human(b)$: the two names denote one
object. Reflexivity and substitution express this interpretation in proofs.

Identity introduction infers $t=t$ without premises. Identity elimination
infers $A[x/t]$ from $s=t$ and $A[x/s]$, provided both substitutions are free
for $x$ in $A$.

The free-for condition applies to identity substitution too. Suppose we have
$a = y$ and $∀y R(a,y)$. Replacing $a$ directly by $y$ would give
$∀y R(y,y)$, capturing the free variable from the identity. Rename the bound
variable first: from $∀z R(a,z)$ we obtain $∀z R(y,z)$. The free $y$
continues to denote the object identified with $a$.

{{< logic-app name="deduction" language="fol" kind="worked" example="equality" title="Substitute identical objects" >}}

Identity elimination can replace selected occurrences. From $a=b$ and
$R(a,a)$, using $R(a,x)$ as the substitution formula gives $R(a,b)$.
You can try this in the [identity exercises](/exercises/fol-inference/#identity-exercises).

With these rules, natural deduction covers FOL with identity. Resolution
requires the additional equality rules discussed above.
Unification compares syntactic expressions, so distinct constants $a$ and $b$
still fail to unify even when an assumption states $a=b$.

{{< callout type="theorem" title="First-order completeness" >}}
Classical natural deduction with the quantifier and identity rules is sound
and complete for first-order logic with identity: $Γ ⊢ A$ if and only if $Γ ⊨ A$.
{{< /callout >}}

This is Gödel's completeness theorem. Every first-order consequence has a proof,
but completeness gives us no algorithm that always decides whether a proof exists.
This is the distinction between semidecidability and decidability from the
[opening section](#searching-for-proofs).

## Lean {#quantifiers-in-lean}

We can also write these proofs in Lean, as in {{< chapter_ref chapter="proofs" >}}Logical proofs{{< /chapter_ref >}}. There we
represented propositions by Lean types in `Prop`. For FOL we also need a type
of objects and predicates on those objects:

```lean
variable (Domain : Type)
variable (Human Mortal : Domain → Prop)
variable (Socrates : Domain)
```

These declarations mirror the semantic values we assign in a structure.
`Domain` represents its domain $D$; `Socrates : Domain` supplies the object
interpreting the constant $Socrates$. `Human : Domain → Prop` represents the
predicate interpretation: `Human d` is the proposition that the object `d`
belongs to its extension. A function symbol would have a declaration such as
`fatherOf : Domain → Domain`, representing its total function on domain objects.

FOL terms are syntactic expressions denoting those objects. The Lean variables
here supply their semantic interpretations. A declaration `x : Domain` gives
an object; a declaration `hx : Human x` gives a proof of a proposition about
that object. The quantifier rules use both kinds of declaration.

A binary predicate such as $LessThan(x, y)$ takes two objects. We can supply
these one at a time: after choosing $x$, we have the unary predicate
"is greater than $x$", waiting for its argument $y$. For example, fixing
$x$ at $3$ gives the property of being greater than $3$.

This way of representing a function of two arguments is called
{{< term "currying" "currying" >}}, after
[Haskell Curry](https://en.wikipedia.org/wiki/Haskell_Curry). The curried
function takes the first object and returns a unary function that takes the
second. For a predicate `R`, we therefore write
`R : Domain → (Domain → Prop)`. Lean allows us to omit these brackets:
`R : Domain → Domain → Prop`. Given `a : Domain`, `R a` is the unary
predicate waiting for its second object; `R a b` supplies that object and
expresses the proposition $R(a, b)$.

Let's use this to express an inference with $∀x∃y R(x,y)$. If every object
is related to some object, then the particular object $a$ is related to
some object. With $R$ interpreted as $<$, this says: if every number has
a larger number, then $a$ has a larger number.

```lean
variable (Domain : Type)
variable (R : Domain → Domain → Prop) (a : Domain)

example (h : ∀ x, ∃ y, R x y) : ∃ y, R a y := by
  exact h a
```

Open this code in Lean. The premise `h` supplies a proof of `∃ y, R x y`
for any object `x`; `h a` supplies it for `a`. We don't need to choose the
witness ourselves. Try changing the conclusion to `∃ y, ∀ x, R x y`:
`h a` no longer proves it. The premise allows a different witness for each
object, whereas the changed conclusion requires one witness for them all.

To prove a universal claim, introduce an arbitrary object. To use one, apply
its proof to an object. The Socrates proof has two applications:

```lean
variable (Domain : Type) (Human Mortal : Domain → Prop)
variable (Socrates : Domain)

example (h : ∀ x, Human x → Mortal x) (hs : Human Socrates) : Mortal Socrates := by
  apply h Socrates
  exact hs
```

`h Socrates` has type `Human Socrates → Mortal Socrates`. Applying that proof
to `hs` gives the conclusion. These are universal and conditional elimination.

{{< logic-app name="deduction" language="fol" kind="lean-walkthrough" example="socrates" code="previous" title="Lean and the Socrates derivation" >}}

For existential elimination, introduce an object and assume that it has the
required property. To introduce an existential, give a witness and a proof
that the property holds of it:

```lean
variable (Domain : Type) (Black White : Domain → Prop)

example (h : ∃ x, Black x) : ∃ x, Black x ∨ White x := by
  apply Exists.elim h
  intro z hz
  apply Exists.intro z
  apply Or.inl
  exact hz
```

After `intro z hz`, `z : Domain` is the unknown witness and `hz : Black z` is
the assumption about it. `Exists.intro z` leaves the goal `Black z ∨ White z`.
`Or.inl` selects its left disjunct, which `hz` proves. The exported conclusion
contains no free occurrence of `z`.

{{< logic-app name="deduction" language="fol" kind="lean-walkthrough" example="witness" code="previous" title="Lean and an unknown existential witness" >}}

Our FOL models have {{< chapter_ref chapter="fol" id="nonempty-domains" >}}nonempty
domains{{< /chapter_ref >}}. Lean allows empty
types, so `Domain : Type` alone does not impose this modelling assumption.
We supply it with `[Inhabited Domain]`, placed after the domain declaration:

```lean
variable (Domain : Type) [Inhabited Domain]
variable (A : Domain → Prop)

example (h : ∀ x, A x) : ∃ x, A x := by
  apply Exists.intro (default : Domain)
  exact h default
```

`[Inhabited Domain]` is an assumption supplying a selected object of `Domain`.
Lean retrieves that object with `default`; `(default : Domain)` states its
type explicitly. We do not need to know which object was supplied. Since `h`
applies to every object, `h default` proves the required instance. The first
command chooses the witness and the second proves that it has $A$.

{{< logic-app name="deduction" language="fol" kind="lean-walkthrough" example="nonempty" code="previous" title="Supply the nonempty-domain assumption" >}}

This is the convention used in the Lean exercises. It includes a choice of
object as well as nonemptiness. The Socrates example already has a named object,
and an existential premise supplies a witness inside its subproof; those
particular proofs can proceed without using `default`.

Classical reasoning appears explicitly in Lean as `apply Classical.byContradiction`.
For quantifier duality, we use proof by contradiction twice:

```lean
variable (Domain : Type)
variable (A : Domain → Prop)

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
```

{{< logic-app name="deduction" language="fol" kind="lean-walkthrough" example="duality-one-ltr" code="previous" title="Locate the classical steps in Lean" >}}

As in {{< chapter_ref chapter="proofs" >}}Logical proofs{{< /chapter_ref >}}, `open Classical` only allows names from that namespace to be
written without their prefix. The command `classical` supplies classical
decidability where needed. In this proof, the two applications of
`Classical.byContradiction` identify the classical inferences themselves.

Lean also checks the identity rules. The tactic `rfl` proves reflexivity:

```lean
example (Domain : Type) (a : Domain) : a = a := by
  rfl
```

Both sides are the same term, so no premise is needed. `Eq.subst` uses an
identity to transport a proof to the corresponding instance:

```lean
variable (Domain : Type)
variable (Human : Domain → Prop) (a b : Domain)

example (heq : a = b) (ha : Human a) : Human b := by
  exact Eq.subst heq ha
```

{{< logic-app name="deduction" language="fol" kind="lean-walkthrough" example="equality" code="previous" title="Identity elimination in Lean" >}}

### Curry–Howard {#fol-curry-howard}

The {{< term "curry-howard" "Curry–Howard correspondence" >}} extends to these
quantifier rules. A proof of $∀x A(x)$ takes an object $x$ and returns a proof
of $A(x)$. The return type depends on the input, so this is a
{{< term "dependent-function" "dependent function" >}}.

| Logical construction | Lean proof construction |
| --- | --- |
| Introduce $∀x A(x)$ | `intro x`, then prove the instance for arbitrary `x`. |
| Use $∀x A(x)$ at $t$ | Apply its proof `h` to `t`, as in `exact h t`. |
| Introduce $∃x A(x)$ | `apply Exists.intro t`, then prove the witness instance. |
| Use $∃x A(x)$ | `apply Exists.elim h`, then `intro x hx` to open the witness subproof. |

The witness supplied to existential introduction is an object of `Domain`;
the accompanying proof inhabits a proposition about it. Existential elimination
opens both parts within a subproof whose conclusion is independent of the
witness. Lean's `Exists` belongs to `Prop`, so this logical use of a witness
does not provide unrestricted extraction of computational data.

The [Lean exercises](/exercises/fol-inference/#lean) let you construct
quantifier proofs and compare them with the natural deduction rules.

{{< img src="/img/drawings/finf_hybrid.svg" width="100px" alt="A neural system and an expert system working together." >}}

A hybrid AI system can propose proof steps with a learned model and check them
with a formal prover. In mathematics, this requires stating the definitions
and assumptions on which the proposed theorem depends. Our example with $<$
used $∀x (x < S(x))$ as a premise; a checker would need it to justify
choosing $S(x)$ as the witness. A checked proof establishes the formal conclusion
from the formal assumptions. We must also check that those formulas express the
mathematical claim we intended.

### Example: Boolean Law {#verifying-boolean-algebra}

We now know enough Lean to verify a mathematical argument. Take our 13-line
derivation of $!!NOT!! !!NOT!! X = X$ in
{{< chapter_ref chapter="boolean" >}}Boolean algebra{{< /chapter_ref >}}.
An AI could have proposed this argument. We can check that every step is
justified by the Boolean laws.

Lean supplies the type `Bool` and its Boolean operations. Our notation
corresponds to Lean as follows:

| Boolean notation | Lean expression |
| --- | --- |
| $0$ | `false` |
| $1$ | `true` |
| $X$ | `x : Bool` |
| $!!NOT!! X$ | `!x` |
| $X !!AND!! Y$ | `x && y` |
| $X !!OR!! Y$ | `x ∣∣ y` |
| $!!NOT!! !!NOT!! X = X$ | `(!!x) = x` |

A Boolean value belongs to `Bool`; an equation between Boolean values is a
proposition in `Prop`. We state the law with an explicit quantifier:
`∀ x : Bool, (!!x) = x`.

We can split a proof into subproofs using `have`. Writing
`have step_1 : (!!x) = (!!x) := by` opens a proof of that identity.
The indented `rfl` proves it. Afterward, `step_1` names the result, so later
steps can use it. Each numbered subproof below states its identity before
proving it; the numbers follow our original derivation.

We use Lean's [Boolean laws](https://lean-lang.org/doc/api/Init/Data/Bool.html)
by instantiation: `Bool.and_true x`, for example, proves `(x && true) = x`.
`Eq.symm` reverses an equality.

<span id="boolean-laws-in-lean"></span>

Here are the laws from
{{< chapter_ref chapter="boolean" id="boolean-laws" >}}Boolean algebra{{< /chapter_ref >}}
in Lean. The last column gives a proof of the displayed identity for
`x y z : Bool`; use it after `exact` or as an argument to `Eq.subst`.
Lean states associativity in the reverse direction, so those entries use
`Eq.symm`. For absorption, `orAbsorption` and `andAbsorption` are the names
of the premises supplied in the [verification exercises](/exercises/fol-inference/#verify-boolean-derivations),
not library theorem names.

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

The derivation below also uses complementation with the negated input first:
`Bool.not_or_self x` proves `(!x || x) = true`, and `Bool.not_and_self x`
proves `(!x && x) = false`. In the exercises, use only the laws allowed by
the task: quoting the theorem you are asked to derive would skip the argument.

Some steps replace an expression inside AND or OR. We can justify this
using the equality rules we already know: if `a = b`, then `f a = f b`.
Here is the proof for functions on Boolean values:

```lean
example (f : Bool → Bool) (a b : Bool) (h : a = b) : f a = f b := by
  apply Eq.subst h
  rfl
```

`apply Eq.subst h` reduces the goal `f a = f b` to `f a = f a`.
Then `rfl` finishes the proof. This use of substitution is called
*congruence*. Lean's library supplies the same result under the name
`congrArg`: `congrArg f h` proves `f a = f b`. We can use that name because
we have just proved the fact it expresses.

For example, `Bool.and (!!x)` is the function that takes a Boolean value
and ANDs it with `!!x`. Applying congruence to
`Eq.symm (Bool.or_not_self x)` gives
`((!!x) && true) = ((!!x) && (x || !x))`. In `step_3` below, `Eq.subst`
uses this equality to replace the right-hand side of `step_2`.

```lean
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
```

`step_6` and `step_12` have the same right-hand side. The final subproof
substitutes `x` for that expression in `step_6`, giving `step_13`.
`exact step_13` finishes the proof. Open the code in Lean and try replacing
one Boolean law with an inappropriate one: Lean will reject the step.

Here we have taken a **meta-perspective** on Boolean logic: we quantify over
truth-values and prove an identity between the functions that interpret its
connectives. Those truth-values are now the objects of our mathematical
argument. Lean makes the move between syntax and semantics explicit through
types. It supports valid FOL reasoning within a richer type theory, in which
we can also define formal languages, their models, and their proof systems
and reason mathematically about them. The same proof-checking machinery
applies to other mathematics.

Lean can also find a proof of our law automatically:

```lean
example : ∀ x : Bool, (!!x) = x := by simp
```

The `simp` tactic uses registered simplification laws to construct a proof,
which the kernel checks. Understanding how to guide this automation is a
next step in learning Lean. Continue with
[*Theorem Proving in Lean 4*](https://lean-lang.org/theorem_proving_in_lean4/),
especially its [chapter on tactics](https://lean-lang.org/theorem_proving_in_lean4/Tactics/).
We have seen how inference rules become checked proofs; that gives us a basis
for studying Lean's more powerful methods of finding them.

## Further readings {.readings .nocount}

- Russell and Norvig, [*Artificial Intelligence: A Modern Approach*, 4th edition](https://www.pearson.com/en-us/subject-catalog/p/Russell-Lecture-Power-Points-for-Artificial-Intelligence-A-Modern-Approach-4th-Edition/P200000003500/9780137505135), chapter 9, for unification, chaining, and first-order resolution.
- Richard Zach, [*Sets, Logic, Computation* (PDF)](https://slc.openlogicproject.org/slc-screen.pdf), §§11.3 and 11.6 for quantifier derivations, and chapter 12 for completeness.
- [*Theorem Proving in Lean 4*, Quantifiers and Equality](https://lean-lang.org/theorem_proving_in_lean4/Quantifiers-and-Equality/), for dependent functions, existential proofs, and equality in Lean.
