---
title: Natural deduction
weight: 120
aliases:
  - /tools/first-order-natural-deduction/
params:
  id: tls-natural-deduction
  group: Proof construction
  teaser: 'Construct checked proof trees, save derived rules, and export your derivations.'
---

# Natural deduction

Build a derivation from your own assumptions. Each rule application is checked,
including the scope of discharged assumptions. You can save a proved rule and
apply it in another derivation.

**Scope.** Classical and intuitionistic natural deduction, with propositional,
quantifier, and identity rules. Each canvas checks the steps you choose.

## Propositional logic

{{< logic-app name="deduction" kind="sandbox" title="Propositional proof canvas" >}}

## First-order logic

Terms and atoms use argument brackets. The rule menu starts with quantifiers
and identity; the propositional rules remain available. Rule checks include
variable capture and the conditions on arbitrary objects and witnesses.

{{< logic-app name="deduction" language="fol" kind="sandbox" title="First-order proof canvas" >}}

## Using it

Add formulas with the assumption rule or click blank space on the canvas. Select
premises, then click a rule. Their order matters for conjunction introduction. Open Rules to choose a rule. A panel on the canvas requests any additional
formula; click assumptions on the canvas to choose which to discharge. Drag
the lower corner of the canvas to make it taller. The × beside a selected formula deletes
that step and its dependent steps.

Use “+ Goal” to add a goal and select its dashed formula to work backwards.
The same rule menu then replaces the goal with the premises needed to prove
it. Forward proofs close matching goals within their assumption scope.
For wide derivations, use the fullscreen icon or F while the canvas has focus.
Branches can also be folded at their conclusions.

Save lemma turns the selected derivation into a reusable rule. Single capital
letters are metavariables; matching the selected premises determines their
substitutions. Any remaining substitutions are requested in a dialog.

Save and Load transfer checked workspaces as files. Load lemmas imports only
the saved rules. The camera downloads the displayed proof, and LaTeX exports
a selected derivation for the `proof.sty` package. Nothing is uploaded.

## Rule reference

### Propositional rules

{{< logic-app name="deduction" kind="rules" title="Propositional rule reference" >}}

### Quantifier and identity rules

{{< logic-app name="deduction" language="fol" kind="rules" title="First-order rule reference" >}}

For proof translation, use [natural deduction and Lean](../lean-correspondence/).

## In the book

- {{< chapter_ref chapter="proofs" id="natural-deduction" >}}Natural deduction{{< /chapter_ref >}}
  explains the rules and assumption discharge.
- {{< chapter_ref chapter="proofs" id="finding-a-derivation" >}}Finding a derivation{{< /chapter_ref >}}
  develops techniques through worked-out examples.
- {{< chapter_ref chapter="FOL-inference" id="natural-deduction-and-lean" >}}First-order natural deduction{{< /chapter_ref >}}
  explains quantifier rules and their side conditions.
- {{< chapter_ref chapter="FOL-inference" id="equality-inference" >}}Identity{{< /chapter_ref >}}
  adds reflexivity and substitution.
