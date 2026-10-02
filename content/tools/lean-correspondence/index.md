---
title: Natural deduction and Lean
weight: 100
params:
  id: tls-lean-correspondence
  group: Automated reasoning
  teaser: 'Translate between propositional proof trees and a small Lean tactic language.'
---

# Natural deduction and Lean

Translate a natural deduction derivation into Lean, or turn a Lean proof into
a proof tree. The two presentations use the same checked derivation data.

**Scope.** Propositional proofs using the chapter's `intro`, `apply`, `exact`
and constructor terms. This is a small teaching translator, not the Lean
compiler. It rejects unsupported syntax and only imports completed proofs. Arithmetic,
Mathlib imports, and quantifiers are outside its scope.

{{< logic-app name="deduction" kind="lean" title="Natural deduction and Lean translator" >}}

## Using it

Construct a proof on the canvas and select its conclusion, then choose
the down arrow. The code appears with syntax highlighting. The pencil inside the code box lets you
change it; the up arrow checks and draws the resulting derivation. The external $L∃∀N$ link
opens the current code in the playground, where Lean's kernel can check it.

“Goals” lets you work backwards too. Exporting an unfinished plan puts
`sorry` in place of each open goal. These placeholders still need proofs;
the reverse translator will reject them.

Use one `variable (... : Prop)` declaration and one `example` per translation.
The canvas also supports proof downloads, saved derived rules, and LaTeX export.

## Following a Lean proof

Step through the heating argument. Each $apply$ first highlights the chosen
inference rule, then the premise still needed to complete that inference.

{{< logic-app name="deduction" kind="lean-walkthrough" title="Following a Lean proof" >}}

## In the book

- {{< chapter_ref chapter="proofs" id="proof-assistants-lean" >}}Lean{{< /chapter_ref >}}
  introduces the supported proof constructions.
- {{< chapter_ref chapter="proofs" id="concrete-curryhoward-correspondence" >}}Curry–Howard correspondence{{< /chapter_ref >}}
  explains the relationship between proofs and typed terms.
