---
title: Natural deduction and Lean
weight: 130
aliases:
  - /tools/first-order-lean/
params:
  id: tls-lean-correspondence
  group: Proof construction
  teaser: 'Translate propositional and first-order proofs between natural deduction and Lean.'
---

# Natural deduction and Lean

Construct a derivation and translate it to Lean, or enter a Lean proof to
reconstruct its natural deduction tree.

**Scope.** The book's teaching fragment: `intro`, `apply`, `exact`, and constructor
terms; the first-order translator also supports typed `have` subproofs,
quantifiers, `rfl`, and `Eq.subst`. General elaboration and Mathlib require Lean.

## Propositional proofs

Use one `variable (... : Prop)` declaration and one `example` per translation.

{{< logic-app name="deduction" kind="lean" title="Propositional proofs and Lean" >}}

## First-order proofs

Declare `Domain : Type` and the objects, predicates, and functions you use.
Use one `example` per translation.

{{< logic-app name="deduction" language="fol" kind="lean" title="First-order proofs and Lean" >}}

## Using it

Select a derivation's conclusion and choose the down arrow (ND → Lean).
Enter a completed Lean proof and choose the up arrow (Lean → ND) to check and
draw its derivation. The external Open in Lean link opens the current code
in the playground for kernel checking.

Goals lets you work backwards. Exporting an unfinished plan puts `sorry` at
open goals; complete those proofs before importing the code again.
The canvas also supports proof downloads, saved lemmas, and LaTeX export.

## In the book

- {{< chapter_ref chapter="proofs" id="proof-assistants-lean" >}}Lean{{< /chapter_ref >}}
  introduces the proof constructions.
- {{< chapter_ref chapter="proofs" id="concrete-curryhoward-correspondence" >}}Curry–Howard correspondence{{< /chapter_ref >}}
  relates proofs to typed terms.
- {{< chapter_ref chapter="FOL-inference" id="quantifiers-in-lean" >}}First-order proofs in Lean{{< /chapter_ref >}}
  introduces object types, predicates, and quantifiers.
