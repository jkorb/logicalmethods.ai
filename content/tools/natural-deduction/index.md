---
title: Propositional natural deduction
weight: 90
params:
  id: tls-natural-deduction
  group: Automated reasoning
  teaser: 'Construct checked proof trees, save derived rules, and export your derivations.'
---

# Propositional natural deduction

Build a derivation from your own assumptions. Each rule application is checked,
including the scope of discharged assumptions. You can save a proved rule and
apply it in another derivation.

**Scope.** Classical and intuitionistic propositional natural deduction.
Quantifier rules are not included. This canvas checks the steps you choose;
it does not search for a proof automatically.

{{< logic-app name="deduction" kind="sandbox" title="Propositional proof canvas" >}}

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

{{< logic-app name="deduction" kind="rules" title="Propositional rule reference" >}}

## In the book

- {{< chapter_ref chapter="proofs" id="natural-deduction" >}}Natural deduction{{< /chapter_ref >}}
  explains the rules and assumption discharge.
- {{< chapter_ref chapter="proofs" id="finding-a-derivation" >}}Finding a derivation{{< /chapter_ref >}}
  develops techniques through worked-out examples.
