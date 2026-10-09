---
title: Normal forms
weight: 50
params:
  id: tls-normal-forms
  group: Normal forms
  teaser: 'Rewrite a propositional formula into conjunctive or disjunctive normal form.'
---

# Normal forms

Rewrite a propositional formula into a conjunction of disjunctions of literals
(CNF) or a disjunction of conjunctions of literals (DNF). Each rewrite preserves
equivalence.

**Scope.** One propositional formula at a time. For first-order preprocessing,
see [Skolemization](../skolemization/).

## Step through

{{< logic-app name="sat" kind="rewrite" >}}

## Work it yourself

{{< logic-app name="sat-practice" kind="normal-form" >}}

## Using it

Choose CNF or DNF and step through the local rewrites. Rewriting proceeds from
the root outwards, left to right. Repeated terms remain visible.

In Work it yourself, enter the formula, then supply an equivalent DNF and CNF.
Check verifies their shape and truth-values. A failed equivalence check gives
a valuation where the formulas differ.

## In the book

- {{< chapter_ref chapter="sat" id="normal-forms" >}}Normal forms{{< /chapter_ref >}}
  defines the two shapes and the literals they are built from.
- {{< chapter_ref chapter="sat" id="rewriting-a-formula" >}}Rewriting a formula{{< /chapter_ref >}}
  gives the equivalences and the order to apply them in.
- {{< chapter_ref chapter="boolean" id="boolean-laws" >}}Boolean laws{{< /chapter_ref >}}
  is where those equivalences come from.
