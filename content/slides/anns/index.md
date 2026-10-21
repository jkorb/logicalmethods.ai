---
title: Logic and neural networks
author: Johannes Korbmacher
weight: 120
layout: 'reveal_slides'
summary: 'Lecture 12: perceptrons, Boolean gates and linear separability, hidden layers and universal representation, knowledge bases as networks, learning, and rule extraction from black boxes.'
params:
  chapter: neural-networks
  id: sli-ann
  license: 'CC-BY-4.0'
---

{{< slide title="Learning goals" >}}
## What you'll be able to do

{{< callout type="objectives" >}}
After this lecture and chapter 12, you will be able to:

- Calculate the output of a perceptron from its inputs, weights, and bias. *(apply)*
- Implement linearly separable Boolean functions with perceptrons. *(apply)*
- Explain how a hidden layer permits the representation of every Boolean truth-function. *(understand)*
- Represent a finite propositional knowledge base with a network of perceptrons. *(apply)*
- Distinguish constructing a logical network from learning its parameters. *(analyse)*
- Extract conditional rules from the observed behavior of a Boolean network. *(apply)*
{{< /callout >}}

{{< slide layout="split" class="slide--wide-right" title="Neural networks" >}}
## Neural networks

{{< column >}}

{{< img src="/img/drawings/la_ai_ann.svg" width="250px" alt="The course mascot thinks of a network of connected artificial neurons." >}}

{{< column >}}

- Networks of simple units compute truth-functions.
- From formulas to networks: build them.
- From networks to formulas: query them.

{{< slide layout="split" title="Perceptrons" >}}
## Perceptrons

{{< callout type="definition" title="Perceptron" >}}
$$
y = step(w₁x₁ + … + wₙxₙ + b)
$$
{{< /callout >}}

{{< column >}}

- {{< term "network-weight" "Weights" >}} $w₁, …, wₙ$
- {{< term "network-bias" "Bias" >}} $b$, {{< term "perceptron-threshold" "threshold" >}} $−b$
- $step(z) = 1$ if $z > 0$, and $0$ if $z ≤ 0$

{{< column >}}

{{< logic-app name="perceptron" kind="step" title="The step function" >}}

{{< slide layout="app" title="Calculating a perceptron" >}}
## Calculating a perceptron

{{< logic-app name="perceptron" kind="unit" title="Calculate a perceptron" >}}

{{< slide layout="app" title="Boolean gates" >}}
## Boolean gates

{{< logic-app name="perceptron" kind="gates" title="Boolean gates as perceptrons" >}}

{{< slide layout="split" class="slide--wide-right" title="Linear separability" >}}
## Linear separability

{{< column >}}

{{< logic-app name="perceptron" kind="separating-line" title="A line separating the inputs of conjunction" >}}

{{< column >}}

{{< callout type="definition" title="Linearly separable" >}}
$f(x₁, …, xₙ) = 1$ iff $w₁x₁ + … + wₙxₙ + b > 0$
{{< /callout >}}

- {{< term "decision-boundary" "Decision boundary" >}}: $w₁x₁ + w₂x₂ + b = 0$
- One perceptron implements exactly these $f$.

{{< slide layout="app" title="Exclusive disjunction" >}}
## Exclusive disjunction

$w₁ + b > 0$, $w₂ + b > 0$ and $b ≤ 0$ give $w₁ + w₂ + b > 0$.

{{< logic-app name="perceptron" kind="separation" title="Try to separate XOR" >}}

{{< slide layout="app" title="Hidden layers" >}}
## Hidden layers

$x₁ !!XOR!! x₂ = (x₁ !!OR!! x₂) !!AND!! !!NOT!!(x₁ !!AND!! x₂)$

{{< logic-app name="perceptron" kind="layers" title="XOR with a hidden layer" >}}

{{< slide title="Universal representation" >}}
## Universal representation

{{< callout type="theorem" title="Universal representation" >}}
Every $f : {0, 1}ⁿ → {0, 1}$ is computed exactly by one hidden layer and one output perceptron, with at most $2ⁿ$ hidden units.
{{< /callout >}}

- One hidden unit for each row with output $1$
- Row $1, 0, 1$: $h = step(x₁ − x₂ + x₃ − 1.5)$
- Output unit: $y = step(h₁ + … + hₖ − 0.5)$

{{< slide layout="app" title="Networks from truth-tables" >}}
## Networks from truth-tables

{{< logic-app name="perceptron" kind="table" title="Build a network from a truth-table" >}}

{{< slide layout="app" title="Knowledge bases" >}}
## Knowledge bases

$KB = {R → W, S → W}$, &emsp; $(R → W) ∧ (S → W) ≡ (R ∨ S) → W$

{{< logic-app name="perceptron" kind="kb" title="A network for a knowledge base" >}}

{{< slide layout="split" class="slide--wide-right" title="Supervised learning" >}}
## Supervised learning

{{< column >}}

{{< img src="/img/drawings/ai_learning_language.svg" width="240px" alt="A bearded elder speaks a long string of ones and zeros; the course mascot answers with a simpler one." >}}

{{< column >}}

- Output too low: raise the active weights and the bias
- Output too high: lower them
- Linearly separable examples only: never XOR

{{< slide layout="split" class="slide--wide-right" title="The bitter lesson" >}}
## The bitter lesson

{{< column >}}

{{< img src="/img/drawings/ai_tools.svg" width="190px" alt="The course mascot holds a wrench and a hammer." >}}

{{< column >}}

- Sutton: search and learning scale with computation.
- They overtake the understanding we build in.
- So what has a network learned?

{{< slide layout="split" title="Universal approximation" >}}
## Universal approximation

{{< callout type="theorem" title="Universal approximation (informally)" >}}
With suitable activations and enough units, a network approximates any continuous function on closed intervals as closely as we want.
{{< /callout >}}

{{< column >}}

- $sigmoid(z) = {{< frac "1" "1 + e⁻ᶻ" >}}$
- Outputs as probability estimates
- Finding the parameters is learning.

{{< column >}}

{{< logic-app name="perceptron" kind="sigmoid" title="The sigmoid function" >}}

{{< slide layout="app" class="slide--snug" title="Rule extraction" >}}
## Rule extraction

{{< callout type="definition" title="Boolean black box" >}}
A fixed $f : {0, 1}ⁿ → {0, 1}$, investigated by input-output queries only.
{{< /callout >}}

{{< logic-app name="perceptron" kind="blackbox" title="Extract rules from a black box" >}}
