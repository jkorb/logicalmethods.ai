---
title: First-order models and evaluation
weight: 150
params:
  id: tls-first-order-models
  group: Models and semantics
  teaser: "Edit finite models, evaluate terms and formulas, and find satisfying assignments."
---

# First-order models and evaluation

Change a model's interpretations and calculate what terms denote, whether
formulas are true, and which assignments satisfy an open formula.

**Scope.** Finite models over the supplied object palette and signature:
constants `LittleJimmy`, `MrSir`, and `Socrates`; the unary function `fatherOf`;
unary predicates `Human` and `Mortal`; binary predicates `BiggerThan` and
`Sibling`. Each canvas has its own model. Truth is evaluated in that model.

## Edit a model

{{< logic-app name="fol-model" model="people" view="graph" title="Edit a finite first-order model" >}}

## Evaluate a term

{{< logic-app name="fol-model" model="people" kind="term" view="tables" title="Evaluate a term in a finite model" >}}

## Evaluate a formula

{{< logic-app name="fol-model" model="people" kind="evaluate" view="sets" title="Evaluate a formula in a finite model" >}}

## Find satisfying assignments

{{< logic-app name="fol-model" model="people" kind="query" view="domain" title="Find satisfying assignments" >}}

## Using it

Modify opens the domain and interpretation controls. Choose a symbol, then
select objects in argument order; a function takes one further selection for
its value. View switches between facts, tables, graph, and sets.

Each canvas starts with an empty domain. Use Modify to add objects and assign
interpretations. Enter your term or formula,
then Check or Query. Open formulas have assignment choices. The step arrows
show how the result follows from the interpretation. Changing the model clears
the previous result; supply any missing interpretations before checking again.

## In the book

- {{< chapter_ref chapter="fol" id="models" >}}Models{{< /chapter_ref >}}
  introduces domains and interpretations.
- {{< chapter_ref chapter="fol" id="truth-and-satisfaction" >}}Truth and satisfaction{{< /chapter_ref >}}
  defines term denotation, truth, and formula extensions.
