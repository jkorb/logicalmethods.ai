---
title: Forward and backward chaining
weight: 90
params:
  id: tls-chaining
  group: Automated reasoning
  teaser: "Derive atomic consequences from your own definite-clause knowledge base."
---

# Forward and backward chaining

Enter facts, rules, and a query, then follow how forward or backward chaining
tries to establish the query. Compare the facts each search visits.

**Scope.** Propositional definite clauses and an atomic query. Rule bodies may
contain conjunctions; each rule has one positive atomic head.

## Choose a direction

{{< logic-app name="conditionals" kind="chaining" title="Chaining with your own knowledge base" >}}

## Compare searches

{{< logic-app name="conditionals" kind="comparison" title="Compare forward and backward searches" >}}

## Using it

Enter one fact or rule per line, such as `RAIN` or
`(RAIN ∧ SUN) → RAINBOW`, and an atom in the query field. Start the search,
then use the arrows to inspect its steps. The comparison has separate step
controls for forward rounds and backward depth-first search.

For Horn clauses that can express contradictions, use
[Horn satisfiability](../horn-satisfiability/).

## In the book

- {{< chapter_ref chapter="conditionals" id="conditional-reasoning" >}}Forward and backward chaining{{< /chapter_ref >}}
  explains the algorithms and their search orders.
