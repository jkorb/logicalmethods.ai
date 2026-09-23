---
title: Normal forms
weight: 50
params:
  id: tls-normal-forms
  group: Automated reasoning
  teaser: 'Rewrite a propositional formula into conjunctive or disjunctive normal form.'
---

# Normal forms

Every formula is equivalent to one in a standard shape: a disjunction of
conjunctions of literals, or a conjunction of disjunctions of them. Getting
there costs nothing in meaning, because each rewrite — double negation, De
Morgan, distribution — replaces a subformula with an equivalent one. It buys a
great deal in method: algorithms that would be awkward on arbitrary formulas
become straightforward once every formula has the same shape, which is why
resolution asks for conjunctive normal form first.

**Scope.** One propositional formula at a time. First-order normal forms need
the quantifiers moved and Skolem functions introduced, which this app does not
do.

Step through the rewrites and watch which law applies where.

{{< logic-app name="sat" kind="rewrite" formula="¬¬p ∨ ¬(q ∨ ¬p)" >}}

## Using it

Rewriting takes one formula at a time. The app applies local replacements from
the root outwards, left to right, then removes repetitions. Brackets separate
compound clauses or terms; associative chains have no internal brackets.
Equivalent formulas can finish in different normal forms. The app does not
absorb redundant clauses or expand every component to a full truth-table row.

## In the book

- {{< chapter_ref chapter="sat" id="normal-forms" >}}Normal forms{{< /chapter_ref >}}
  defines the two shapes and the literals they are built from.
- {{< chapter_ref chapter="sat" id="rewriting-a-formula" >}}Rewriting a formula{{< /chapter_ref >}}
  gives the equivalences and the order to apply them in.
- {{< chapter_ref chapter="boolean" id="boolean-laws" >}}Boolean laws{{< /chapter_ref >}}
  is where those equivalences come from.
