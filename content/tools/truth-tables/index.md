---
title: Truth tables
weight: 40
params:
  id: tls-truth-tables
  group: Models and semantics
  teaser: 'Calculate a Boolean truth table row by row, or search it for a countermodel.'
---

# Truth tables

Evaluate formulas under all Boolean valuations. A satisfying row witnesses
satisfiability; a row that makes the premises true and the conclusion false
is a countermodel to an inference.

**Scope.** Propositional formulas under Boolean semantics, up to six
variables — 64 rows. The method is the same for any finite number of variables;
the app stops well before the arithmetic does.

## Calculate

Calculate a single formula, or enter an inference with $∴$ and look for a
counterexample row.

{{< logic-app name="sat" kind="truth-table" >}}

## Work it yourself

{{< logic-app name="sat-practice" kind="table" >}}

## Using it

Separate formulas with commas, semicolons or new lines, and introduce a
conclusion with `∴` or `⊨`. For an inference, the app conjoins the premises
and the negation of the conclusion. It prints this SAT formula above the
table. The columns show variables, the formulas being conjoined, and the
final SAT value. Next evaluates one subformula at a time beside the table;
"Row calculations" records the intermediate values. Row buttons jump to a
valuation. A marked row with SAT value $1$ is a countermodel.

In Work it yourself, enter a formula or inference, identify its variables and
row count, and match compound tree nodes to the table columns. Fill in the
truth-values and Check. Incorrect entries remain editable.

## In the book

- {{< chapter_ref chapter="sat" id="truth-tables" >}}Truth tables{{< /chapter_ref >}}
  sets out the method and what it guarantees.
- {{< chapter_ref chapter="sat" id="searching-the-table" >}}Searching the table{{< /chapter_ref >}}
  treats validity as a search for one bad row.
- {{< chapter_ref chapter="boolean" id="boolean-models" >}}Boolean models{{< /chapter_ref >}}
  supplies the valuations the rows enumerate.
