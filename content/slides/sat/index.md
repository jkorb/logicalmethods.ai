---
title: Boolean satisfiability
author: Johannes Korbmacher
weight: 50
layout: 'reveal_slides'
summary: 'Lecture 5: reducing reasoning problems to satisfiability, and deciding it by truth-tables and by resolution.'
params:
  chapter: sat
  id: sli-sat
  license: 'CC-BY-4.0'
---

{{< slide title="Learning goals" >}}
## What you'll be able to do

{{< callout type="objectives" >}}
After this lecture and chapter 5, you will be able to:

- Represent validity and circuit verification as satisfiability problems. *(understand, apply)*
- Apply the truth-table algorithm to formulas and inferences. *(apply)*
- Convert propositional formulas into CNF and DNF. *(apply)*
- Apply formula-based resolution to decide satisfiability. *(apply)*
- Compare the costs and explanatory outputs of SAT algorithms. *(analyse, evaluate)*
{{< /callout >}}

Read chapter 5 first; exercise sheet 5 comes after the lecture.

{{< slide layout="split" title="Automating the hard work" >}}
## Automating the hard work

{{< column >}}

In chapter 4 we did it all by hand: list the models, calculate the values,
hunt for a countermodel.

- Let the machine do it.
- SAT asks one question: can one valuation make all of these true?
- Two reasoning problems reduce to it.

**Reduce the problem to SAT, then run an algorithm on it.**

{{< column >}}

{{< img src="/img/drawings/sat_cpu_bug.svg" width="300px" alt="A processor labelled CPU takes in 2 + 2 = and puts out 5." >}}

{{< slide layout="split" >}}
## Satisfiability

{{< callout type="definition" title="Satisfiability" >}}
A propositional formula is {{< term "satisfiability" "satisfiable" >}} {{< term
"iff" "iff" >}} there is a Boolean valuation under which it is true. It is {{<
term "unsatisfiable" "unsatisfiable" >}} {{< term "iff" "iff" >}} there is no such valuation.
{{< /callout >}}

{{< column >}}

$SUN ∧ ¬RAIN$, with $v(SUN) = 1$, $v(RAIN) = 0$:

$$
1 !!AND!! (!!NOT!! 0) = 1
$$

**Satisfiable**: one valuation settles it.

{{< column >}}

$SUN ∧ ¬SUN$:

$$
1 !!AND!! (!!NOT!! 1) = 0
0 !!AND!! (!!NOT!! 0) = 0
$$

**Unsatisfiable**: every valuation must fail.

{{< slide title="The SAT problem" >}}
## The SAT problem

{{< callout type="definition" title="Joint satisfiability" >}}
A finite set or list of propositional formulas $A₁, …, Aₙ$ is
*jointly satisfiable* {{< term "iff" "iff" >}}  its conjunction $A₁ ∧ … ∧ Aₙ$
is satisfiable.
{{< /callout >}}

- $SUN ∨ RAIN$, $¬SUN$: satisfiable, by $v(SUN) = 0$, $v(RAIN) = 1$.
- Add $¬RAIN$: unsatisfiable — though each can be satisfied on its own.

{{< callout type="definition" title="The SAT problem" >}}
A {{< term "sat-problem" "Boolean satisfiability problem" >}}, or ``SAT``,
asks whether a given propositional formula, or a finite set of propositional
formulas, is satisfiable.
{{< /callout >}}

{{< slide layout="split" title="Reduction 1: circuit verification" >}}
## Reduction 1: circuit verification

{{< column >}}

{{< logic-app name="boolean" kind="circuit" preset="nand" input-labels="INPUT₁,INPUT₂" examples="inputs" title="The NAND relay circuit" >}}

{{< column >}}

What the circuit does:

$$
C = ¬(INPUT₁ ∧ INPUT₂)
$$

What it should do, excluding the row with output $0$:

$$
S = ¬INPUT₁ ∨ ¬INPUT₂
$$

Where do they disagree? **SAT? $¬(S ↔ C)$**

- Satisfiable: that valuation is an input where the circuit is wrong.
- Unsatisfiable: the circuit implements the specification.

{{< slide layout="split" title="Reduction 2: deductive validity" >}}
## Reduction 2: deductive validity

{{< callout type="theorem" title="Validity as unsatisfiability" >}}
An inference $A₁, …, Aₙ ∴ B$ is deductively valid iff
$(A₁ ∧ … ∧ Aₙ) ∧ ¬B$ is unsatisfiable.
{{< /callout >}}

{{< column >}}

{{< inference >}}
$SUN ∨ RAIN$
$¬SUN$
---
$RAIN$
{{< /inference >}}

$(SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN$: no countermodel, so **valid**.

{{< column >}}

{{< inference >}}
$SUN ∨ RAIN$
$SUN$
---
$¬RAIN$
{{< /inference >}}

$(SUN ∨ RAIN) ∧ SUN ∧ ¬¬RAIN$: $v(SUN) = v(RAIN) = 1$ is a countermodel, so **invalid**.

{{< slide layout="split" title="Truth-tables" >}}
## Truth-tables: brute force

{{< callout type="definition" title="Truth-table" >}}
A {{< term "truth-table" "truth-table" >}} lists the value of one or more
propositional formulas under every assignment to the variables occurring
in them.
{{< /callout >}}

{{< column >}}

- $n$ variables: $2ⁿ$ assignments.
- Count from $0$ in binary to list them all.
- Evaluate the formula in each row.
- No preparation: the formula goes in as it stands.

{{< column >}}

{{< img src="/img/drawings/sat_truth-table-3var.svg" width="150px" alt="The eight rows of a truth-table for SUN, RAIN and WIND, numbered 0 to 7." >}}

{{< slide title="Evaluating a row" >}}
## Evaluating a row

```python
def evaluate(tree, v):
    if is_variable(tree):
        return v(variable(tree))

    if operator(tree) == "¬":
        return NOT(evaluate(child(tree), v))

    left_value = evaluate(left_child(tree), v)
    right_value = evaluate(right_child(tree), v)
    if operator(tree) == "∧":
        return AND(left_value, right_value)
    if operator(tree) == "∨":
        return OR(left_value, right_value)
    return XNOR(left_value, right_value)
```

Every call gets a smaller tree, so evaluation terminates.

{{< slide layout="app" title="Searching the table" >}}
## Searching the table

{{< logic-app name="sat" kind="truth-table" formula="SUN ∨ RAIN, ¬SUN ∴ RAIN" title="Truth-table search for SUN ∨ RAIN, ¬SUN ∴ RAIN" >}}

{{< slide title="A decision procedure" >}}
## A decision procedure

{{< callout type="definition" title="Decision procedure" >}}
A {{< term "decision-procedure" "decision procedure" >}} is an algorithm that
terminates on every allowed input with the correct yes-or-no answer. A problem
with such a procedure is called {{< term "decidable" "decidable" >}}.
{{< /callout >}}

- Finitely many rows, so the search finishes.
- A returned valuation makes the formula true.
- "Unsatisfiable" means every valuation was checked.

So SAT is decidable. The finished table also shows a
{{< term "tautology" "tautology" >}} (all $1$s) or a
{{< term "contradiction" "contradiction" >}} (all $0$s).

{{< slide layout="split" title="The cost of brute force" >}}
## The cost of brute force

{{< column >}}

For $n$ variables and $m$ operators, worst-case
{{< term "time-complexity" "time complexity" >}}:

$$
O(2ⁿ(m + 1))
$$

| Variables | Rows |
| --- | --- |
| $3$ | $8$ |
| $10$ | $1 024$ |
| $20$ | $1 048 576$ |
| $40$ | over a trillion |

{{< column >}}

{{< img src="/img/drawings/sat_exponential.svg" width="260px" alt="An exponential curve: the number of valuations against the number of variables." >}}

{{< term "combinatorial-explosion" "Combinatorial explosion" >}}: one more
variable doubles the work.

{{< slide layout="split" title="Normal forms" >}}
## Normal forms

{{< column >}}

A {{< term "literal" "literal" >}} is a propositional variable or the negation
of a propositional variable.

{{< callout type="definition" title="Disjunctive normal form" >}}
A formula is in
{{< term "disjunctive-normal-form" "disjunctive normal form" >}} (DNF) iff it
is a disjunction of conjunctions of literals.
{{< /callout >}}

{{< callout type="definition" title="Conjunctive normal form" >}}
A formula is in
{{< term "conjunctive-normal-form" "conjunctive normal form" >}} (CNF) iff it
is a conjunction of disjunctive clauses.
{{< /callout >}}

{{< column >}}

| Formula | DNF? | CNF? |
| --- | --- | --- |
| $SUN ∨ ¬RAIN$ | yes | yes |
| $SUN ∧ ¬RAIN$ | yes | yes |
| $SUN ∨ (RAIN ∧ WIND)$ | yes | no |
| $(SUN ∨ RAIN) ∧ WIND$ | no | yes |
| $¬(SUN ∧ RAIN)$ | no | no |

A DNF lists alternatives; a CNF lists requirements. Resolution needs CNF.

{{< slide layout="split" title="Rewriting into normal form" >}}
## Rewriting into normal form

Each rule replaces a subformula by an equivalent one. First remove every $↔$:

$$
(A ↔ B) ⟹ ((¬A ∨ B) ∧ (¬B ∨ A))
$$

{{< column >}}

Push negations inward:

$$
r₁: ¬¬A ⟹ A
r₂: ¬(A ∧ B) ⟹ ¬A ∨ ¬B
r₃: ¬(A ∨ B) ⟹ ¬A ∧ ¬B
$$

The result is in {{< term "negation-normal-form" "negation normal form" >}}.

{{< column >}}

For CNF, distribute $∨$ over $∧$:

$$
r₄: A ∨ (B ∧ C) ⟹ (A ∨ B) ∧ (A ∨ C)
r₅: (A ∧ B) ∨ C ⟹ (A ∨ C) ∧ (B ∨ C)
$$

For DNF, distribute $∧$ over $∨$:

$$
r₆: A ∧ (B ∨ C) ⟹ (A ∧ B) ∨ (A ∧ C)
r₇: (A ∨ B) ∧ C ⟹ (A ∧ C) ∨ (B ∧ C)
$$

{{< slide layout="app" title="The rewriting algorithm" >}}
## The rewriting algorithm

Remove $↔$, push negations inward, then distribute — one rule at a time.

{{< logic-app name="sat" kind="rewrite" formula="¬¬SUN ∨ ¬(RAIN ∨ ¬SUN)" title="Rewriting ¬¬SUN ∨ ¬(RAIN ∨ ¬SUN) into normal form" >}}

{{< slide layout="split" title="Preprocessing is the expensive part" >}}
## Preprocessing is the expensive part

Distribution copies subformulas: a compact input can produce exponentially
many clauses.

{{< column >}}

$$
(SUN ∧ WARM) ∨ (RAIN ∧ WIND)
$$

becomes

$$
(SUN ∨ RAIN) ∧ (SUN ∨ WIND)
∧ (WARM ∨ RAIN) ∧ (WARM ∨ WIND)
$$

Each further pair doubles the clauses: $n$ pairs give $2ⁿ$.

{{< column >}}

{{< img src="/img/drawings/sat_naive_approach.svg" width="200px" alt="The course mascot speeding off in a small red car: the naive approach." >}}

Truth-tables pay at search time; resolution pays before the search starts.

{{< slide layout="split" title="The resolution rule" >}}
## The resolution rule

{{< callout type="definition" title="Resolution rule" >}}
The {{< term "resolution" "resolution rule" >}} takes two clauses containing
complementary literals, removes that pair, and forms the disjunction of
the remaining literals. The result is their
{{< term "resolvent" "resolvent" >}}.
{{< /callout >}}

{{< column >}}

{{< inference rule="resolution on p" >}}
$A ∨ p$
$¬p ∨ B$
---
$A ∨ B$
{{< /inference >}}

Remove only *one* complementary pair at a time.

The {{< term "empty-clause" "empty clause" >}} $⊥$ is false under every valuation.

{{< column >}}

{{< inference rule="resolution" >}}
$SUN ∨ RAIN$
$¬SUN$
---
$RAIN$
{{< /inference >}}

{{< inference rule="resolution" >}}
$RAIN$
$¬RAIN$
---
$⊥$
{{< /inference >}}

{{< slide layout="app" title="Refutation search" >}}
## Refutation search

{{< logic-app name="sat" kind="resolution" formula="(SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN" title="Resolution on (SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN" >}}

{{< callout type="theorem" title="Soundness and refutation completeness" >}}
A propositional formula in CNF is unsatisfiable {{< term "iff" "iff" >}} resolution
can derive the empty clause from its conjuncts.
{{< /callout >}}

{{< slide title="Tseytin: cheap preprocessing" >}}
## Tseytin: cheap preprocessing

Give each subformula a fresh name and constrain its value, instead of copying
it. Name $SUN ∧ RAIN$ by a fresh $u$:

$$
(¬u ∨ SUN) ∧ (¬u ∨ RAIN) ∧ (u ∨ ¬SUN ∨ ¬RAIN)
$$

One fresh variable and a few clauses per connective: the CNF grows linearly.

{{< callout type="definition" title="Equisatisfiability" >}}
Two formulas are {{< term "equisatisfiable" "equisatisfiable" >}} {{< term "iff" "iff" >}} they are either
both satisfiable or both unsatisfiable.
{{< /callout >}}

{{< slide layout="app" title="Worked-out example: the NAND circuit" >}}
## Worked-out example: the NAND circuit

{{< logic-app name="sat" kind="resolution" formula="¬((¬INPUT₁ ∨ ¬INPUT₂) ↔ ¬(INPUT₁ ∧ INPUT₂))" title="Verifying the NAND circuit" >}}
