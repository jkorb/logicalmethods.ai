---
title: Horn satisfiability
weight: 100
params:
  id: tls-horn-satisfiability
  group: Automated reasoning
  teaser: "Check a propositional Horn knowledge base using premise counters and an agenda."
---

# Horn satisfiability

Check whether a collection of Horn clauses is satisfiable. The trace shows
which facts enter the agenda and when a rule's premises have all been met.

**Scope.** Propositional Horn clauses: facts, definite rules, and clauses
with no positive literal. A rule may have `⊥` as its head.

{{< logic-app name="conditionals" kind="horn" title="Horn satisfiability" >}}

## Using it

Enter one fact, rule, or clause per line. For example,
`RAIN`, `RAIN → WET`, and `WET → ⊥` form an unsatisfiable knowledge base.
Start the calculation and step through the counters and agenda. The result
reports whether a contradiction was reached.

Use [chaining](../chaining/) to follow a particular atomic query.

## In the book

- {{< chapter_ref chapter="conditionals" id="horn-clauses-and-sat" >}}Horn clauses and SAT{{< /chapter_ref >}}
  introduces Horn clauses and the satisfiability algorithm.
