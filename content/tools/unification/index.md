---
title: First-order unification
weight: 180
params:
  id: tls-unification
  group: Automated reasoning
  teaser: "Find a most general unifier and inspect each step of Robinson’s algorithm."
---

# First-order unification

Find a substitution that makes two terms or atoms identical. The trace records
the equations still to solve and the substitution accumulated so far.

**Scope.** Finite first-order terms and atoms, with an occurs check. Use explicit
argument brackets. Applied names beginning with capitals are predicates;
lowercase applied names are functions. Variables are `x`, `y`, `z`, `u`, `v`,
and `w`, optionally indexed; other bare names are constants.

## Step through

{{< logic-app name="fol-inference" kind="unify" title="Unify two first-order expressions" >}}

## Work it yourself

{{< logic-app name="fol-inference" kind="unify" mode="practice" title="Unification workspace" >}}

## Using it

Enter the two expressions and press the question mark. In Step through, the
arrows show decomposition, variable elimination, and the other operations.
The last frame gives a most general unifier or the reason unification fails.

In Work it yourself, select an equation and apply an operation. Use Done when
no equations remain. Undo removes the last operation; Restart starts the same
problem again. LaTeX commands and numeric subscripts convert as you type.

For resolution, enter the two atoms whose literals have opposite signs.

## In the book

- {{< chapter_ref chapter="FOL-inference" id="unification" >}}Unification{{< /chapter_ref >}}
  explains why first-order inference needs substitutions.
- {{< chapter_ref chapter="FOL-inference" id="robinsons-algorithm" >}}Robinson's algorithm{{< /chapter_ref >}}
  gives the steps used here.
