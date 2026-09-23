---
title: Truth tables
weight: 40
params:
  id: tls-truth-tables
  group: Semantics
  teaser: 'Calculate a Boolean truth table row by row, or search it for a countermodel.'
---

# Truth tables

A truth table is the brute-force answer to every question Boolean logic can
ask. Write down all $2ⁿ$ valuations of the $n$ variables, calculate each
formula's value in each one, and read the answer off the finished table: a
formula is satisfiable if some row gives it $1$, valid if every row does, and
an inference is valid unless some row makes every premise $1$ and the
conclusion $0$. The method always terminates and always decides, which is what
makes it the reference point for every faster method that follows.

**Scope.** Propositional formulas under Boolean semantics, up to six
variables — 64 rows. The method is the same for any finite number of variables;
the app stops well before the arithmetic does.

Calculate a single formula, or enter an inference with $∴$ and look for a
counterexample row.

{{< logic-app name="sat" kind="truth-table" formula="p ∨ q, ¬p ∴ q" >}}

## Using it

Separate formulas with commas, semicolons or new lines, and introduce a
conclusion with `∴` or `⊨`. For an inference, the app conjoins the premises
and the negation of the conclusion. It prints this SAT formula above the
table. The columns show variables, the formulas being conjoined, and the
final SAT value. Next evaluates one subformula at a time beside the table;
"Row calculations" records the intermediate values. Row buttons jump to a
valuation. A marked row with SAT value $1$ is a countermodel.

The cost is the point: each extra variable doubles the table. Eight variables
already mean 256 rows, which is why the chapter goes looking for something
better.

## In the book

- {{< chapter_ref chapter="sat" id="truth-tables" >}}Truth tables{{< /chapter_ref >}}
  sets out the method and what it guarantees.
- {{< chapter_ref chapter="sat" id="searching-the-table" >}}Searching the table{{< /chapter_ref >}}
  treats validity as a search for one bad row.
- {{< chapter_ref chapter="boolean" id="boolean-models" >}}Boolean models{{< /chapter_ref >}}
  supplies the valuations the rows enumerate.
