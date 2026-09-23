---
title: Boolean evaluation
weight: 30
params:
  id: tls-boolean-evaluation
  group: Semantics
  teaser: 'Set a Boolean valuation and watch a formula work out its own value.'
---

# Boolean evaluation

A Boolean valuation fixes a value for each variable, and the formula's own
value follows. It follows *compositionally*: the value of a complex formula is
determined by the values of its immediate parts and nothing else, so the
calculation climbs the parse tree from the variables to the main connective.
That single property is what makes the whole semantics work — it is why a
finite table can settle a formula with infinitely many possible readings behind
it, and why changing one variable changes exactly the branches above it.

**Scope.** Boolean semantics, in the chapter's own sense: two values, $1$ and
$0$, and the connectives of chapter 4. A many-valued valuation (chapter 10) and
a first-order model (chapter 8) both evaluate formulas differently, and neither
is covered here.

Type a formula, set a valuation with the $0$ and $1$ buttons, and step through
the calculation.

{{< logic-app name="boolean" kind="evaluation" formula="SUN ∨ (RAIN ∧ ¬SUN)" >}}

## Using it

Atoms are named, so `SUN` and `RAIN` work as well as `p` and `q`, and the usual
precedence applies: $¬$ binds tightest, then $∧$, then $∨$. Node labels stay
syntactic while the values sit outside them, so you can see the formula and its
valuation at once. Editing the formula clears the old calculation; changing a
value restarts it.

## In the book

- {{< chapter_ref chapter="boolean" id="boolean-evaluations" >}}Boolean evaluations{{< /chapter_ref >}}
  states the clauses this app applies.
- {{< chapter_ref chapter="boolean" id="parsing-and-valuations" >}}Parsing and valuations{{< /chapter_ref >}}
  runs them down a parse tree, as here.
- {{< chapter_ref chapter="formal-languages" id="parsing" >}}Parsing{{< /chapter_ref >}}
  is where the tree comes from.
