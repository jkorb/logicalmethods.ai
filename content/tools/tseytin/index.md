---
title: Tseytin transformation
weight: 70
params:
  id: tls-tseytin
  group: Automated reasoning
  teaser: 'Convert a propositional formula to an equisatisfiable CNF using fresh variables.'
---

# Tseytin transformation

Give each compound subformula a fresh name and constrain that name with
short clauses. Asserting the name of the whole formula gives a CNF that
is satisfiable iff the input is satisfiable, without distributing large
subformulas over one another.

**Scope.** One propositional formula under Boolean semantics, with at most
512 characters and eight input variables. Fresh names are introduced by
the algorithm. This tool constructs the CNF; it does not solve it.

{{< logic-app name="sat" kind="tseytin" formula="(p ∧ q) ∨ r" >}}

## Using it

Choose an example or use the pencil to enter a formula. Next names a
connective after its children and adds the clauses constraining its value.
The final step asserts the root. The displayed clauses form one conjunction.

## In the book

- {{< chapter_ref chapter="sat" id="tseytin-example" >}}Tseytin transformation{{< /chapter_ref >}}
  explains equisatisfiability, the local constraints, and the procedure.
