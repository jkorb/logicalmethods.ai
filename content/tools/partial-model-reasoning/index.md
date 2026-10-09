---
title: Reasoning from partial models
weight: 170
params:
  id: tls-partial-model-reasoning
  group: Models and semantics
  teaser: "Enter premises and a conclusion, then follow reasoning from partial model information."
---

# Reasoning from partial models

Enter an inference to investigate. The picture records established facts;
the explanation shows how each step follows from the premises.

**Scope.** A bounded fragment of first-order reasoning with custom premises and
conclusions. An undetermined result means the search found no proof of the
conclusion or its negation.

{{< logic-app name="fol-model" kind="consequence" title="Reasoning from your premises" >}}

## Using it

Separate premises with semicolons and put `∴` before the conclusion. Use closed
formulas with explicit argument brackets. Capitalized applied names are
predicates, lowercase applied names are functions. Variables are `x`, `y`, `z`,
`u`, `v`, or `w`, optionally indexed; other bare names are constants.

Check the inference, then step through the reasoning. Premise buttons let you
omit information and check again. View switches between graph, sets, and tables.
The displayed objects form a fragment of a model; unspecified memberships
remain unknown. For complete finite interpretations, use
[first-order models and evaluation](../first-order-models/).

## In the book

- {{< chapter_ref chapter="FOL-inference" id="valid-inference" >}}Valid inference{{< /chapter_ref >}}
  uses arbitrary models to explain first-order consequence.
