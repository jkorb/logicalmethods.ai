---
title: Resolution
weight: 60
params:
  id: tls-resolution
  group: Automated reasoning
  teaser: 'Refute a propositional clause set, and read validity off the empty clause.'
---

# Resolution

Resolution replaces the search through all $2ⁿ$ valuations with a search for a
contradiction. Two clauses containing complementary literals can be
combined into a third by resolving on that variable; derive the empty clause and the
set is unsatisfiable. To test an inference, negate its conclusion and add it to
the premises: a refutation of the result is a proof that no model makes the
premises true and the conclusion false, which is validity. Failing that, the
search saturates and the inference is invalid.

**Scope.** Propositional resolution. First-order resolution needs unification
to work out which literals can be resolved against each other, and is not
covered here.

Enter formulas to test satisfiability, or an inference with $∴$ to test
validity.

{{< logic-app name="sat" kind="resolution" formula="p ∨ q, ¬p ∴ q" >}}

## Using it

The app converts every target to conjunctive normal form first, then checks
pairs of clauses, giving priority to unit clauses and shorter parents.
It skips tautologies and duplicates. The walkthrough starts with the prepared
CNF clauses and shows resolution inferences. Use the [rewriting app](../normal-forms/)
to examine the preliminary conversion separately. The ledger numbers each
clause and records its parents and pivot; the diagram shows the current
inference. Expand the checked-pairs history to review the search.

A finished search decides satisfiability, but it does not hand you a model: a
refutation shows that no model exists, and saturation shows that one does
without constructing it. Use the [truth table](../truth-tables/) when you want
the witness itself.

## In the book

- {{< chapter_ref chapter="sat" id="resolution" >}}Resolution{{< /chapter_ref >}}
  introduces the rule and the empty clause.
- {{< chapter_ref chapter="sat" id="searching-for-a-refutation" >}}Searching for a refutation{{< /chapter_ref >}}
  turns the rule into a decision procedure and explains why it finishes.
- {{< chapter_ref chapter="sat" id="normal-forms" >}}Normal forms{{< /chapter_ref >}}
  is the shape the search needs its input in.
