---
title: Skolemization
weight: 190
params:
  id: tls-skolemization
  group: Normal forms
  teaser: "Rewrite quantifiers and introduce Skolem witnesses with the required dependencies."
---

# Skolemization

Follow the preprocessing that replaces existentially quantified variables with
fresh witness terms. The result preserves satisfiability, which lets resolution
work with the transformed input.

**Scope.** First-order formulas with explicit argument brackets. The trace
removes implications, pushes negations inward, renames binders, and Skolemizes.
Universal quantifiers remain visible; full clause conversion happens in the
[first-order resolution tool](../resolution/#first-order-resolution).

## Step through

{{< logic-app name="fol-inference" kind="skolem" title="Skolemize a first-order formula" >}}

## Work it yourself

{{< logic-app name="fol-inference" kind="skolem" mode="practice" title="Skolemization workspace" >}}

## Using it

Enter a formula and start. In Step through, the arrows show each rewrite and
its affected scope. Generated witnesses are named `sk₁`, `sk₂`, and so on.

In Work it yourself, select a connective or quantifier and apply a rewrite.
For a witness or binder renaming, enter the replacement in the field that
opens. Undo removes the last operation; Restart starts the same problem again.

Use capitalized predicate names, lowercase function names, and variables
`x`, `y`, `z`, `u`, `v`, or `w`, optionally indexed. Other bare names are constants.

## In the book

- {{< chapter_ref chapter="FOL-inference" id="fol-normal-forms" >}}Normal forms{{< /chapter_ref >}}
  explains equisatisfiability and the full preprocessing procedure.
- {{< chapter_ref chapter="FOL-inference" id="skolemization" >}}Skolemization{{< /chapter_ref >}}
  gives the witness rule and its dependencies.
