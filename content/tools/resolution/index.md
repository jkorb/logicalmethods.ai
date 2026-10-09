---
title: Resolution
weight: 60
aliases:
  - /tools/first-order-resolution/
params:
  id: tls-resolution
  group: Automated reasoning
  teaser: 'Search for refutations in propositional and first-order logic, or choose first-order resolution steps yourself.'
---

# Resolution

Enter formulas to test satisfiability, or premises and a conclusion separated
by `∴` to test validity. For an inference, the search adds the negated conclusion
to the premises and tries to derive the empty clause.

**Scope.** Propositional and first-order resolution. Each calculation begins by
converting the input to clauses.

## Propositional resolution

The search resolves complementary literals until it derives `⊥` or reaches
saturation. Saturation establishes satisfiability without constructing a model;
use [truth tables](../truth-tables/) to find a satisfying valuation.

{{< logic-app name="sat" kind="resolution" title="Propositional resolution" >}}

### Choose the inferences

Select complementary literals in two clauses, then Resolve. The input is
converted to CNF before you begin. Undo and Restart let you revise your choices;
Saturated? checks whether every clause pair and pivot has been tried.

{{< logic-app name="sat-practice" kind="resolution" title="Propositional resolution workspace" >}}

## First-order resolution

Use closed formulas with explicit argument brackets. This calculus supports
predicates and functions; identity requires additional rules.
The search stops after at most 16 inferences. A stopped search without `⊥`
leaves validity undecided.

{{< logic-app name="sat" language="fol" kind="resolution" title="First-order resolution search" >}}

### Choose the inferences

Select two opposite-sign literals and choose Resolve. For Factor, select two
same-sign literals in one clause. The unifier applies to the entire resulting
clause. Undo removes the last inference; Restart returns to the input clauses.
The workspace allows up to 80 clauses.

{{< logic-app name="sat-practice" language="fol" kind="resolution" title="First-order resolution workspace" >}}

## Using it

Separate premises with semicolons and put `∴` before the conclusion. Omit the
conclusion to test satisfiability. Start the calculation, then use the step
arrows to follow the search. The pencil unlocks the input for a new problem.
Fullscreen makes room for wider first-order derivations.

Use [normal forms](../normal-forms/), [Skolemization](../skolemization/), and
[unification](../unification/) to inspect the supporting calculations.

## In the book

- {{< chapter_ref chapter="sat" id="resolution" >}}Propositional resolution{{< /chapter_ref >}}
  introduces the rule and the empty clause.
- {{< chapter_ref chapter="sat" id="searching-for-a-refutation" >}}Searching for a refutation{{< /chapter_ref >}}
  explains why the propositional search finishes.
- {{< chapter_ref chapter="FOL-inference" id="fol-resolution" >}}FOL resolution{{< /chapter_ref >}}
  adds unification and factoring.
