---
title: Reveal.js fixture
author: Test fixture
weight: 990
layout: 'reveal_slides'
summary: 'A sample deck for the framework tests.'
params:
  chapter: sat
  id: sli-reveal-fixture
  license: 'CC-BY-4.0'
---

{{< slide title="Goals" >}}
## What this deck exercises

{{< callout type="objectives" >}}
- Plain Markdown: lists, *emphasis*, `code` and $p ∧ ¬q$
- A glossary {{< term "satisfiability" "satisfiable" >}} term
- A book drawing, a definition and an inference
{{< /callout >}}

{{< slide >}}
## A definition from the chapter

{{< callout type="definition" title="Satisfiability" >}}
A propositional formula is {{< term "satisfiability" "satisfiable" >}} {{< term
"iff" "iff" >}} there is a Boolean valuation under which it is true.
{{< /callout >}}

$$
(SUN ∨ RAIN) ∧ (SUN ∨ WIND) ∧ (WARM ∨ RAIN) ∧ (WARM ∨ WIND)
$$

{{< slide layout="split" title="Split with an inference" >}}
## Two columns

{{< column >}}

{{< inference layout="stacked" >}}
$If it is sunny, then ∀I is cycling$
$It is sunny$
---
$∀I is cycling$
{{< /inference >}}

{{< column >}}

{{< img src="/img/drawings/sat_ai_verification.svg" width="220px" alt="The course mascot compares a circuit against its blueprint." >}}

{{< slide layout="app" >}}
## Resolution

{{< logic-app name="sat" kind="resolution" formula="(SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN" >}}

{{< slide layout="app" >}}
## A circuit

{{< logic-app name="boolean" kind="circuit" preset="nand" input-labels="INPUT₁,INPUT₂" examples="inputs" >}}

{{< slide >}}
## Code and a tree

```python
if num % 2 == 0 and not num < 10:
    num += 1
```

{{< syntax-tree caption="" >}}
{"label":"→","step":1,"children":[{"label":"∧","step":2,"children":[{"label":"p","step":3}, {"label":"q","step":3}]},{"label":"¬","step":4,"children":[{"label":"r","step":5}]}]}
{{< /syntax-tree >}}

{{< slide layout="center" title="Fragments" >}}
## One step at a time

<p class="fragment">First this.</p>
<p class="fragment">Then this.</p>

{{< slide layout="section" >}}
## The end
