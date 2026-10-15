---
title: Probability and inductive logic
author: Johannes Korbmacher
weight: 110
layout: 'reveal_slides'
summary: 'Lecture 11: probabilities from weighted truth-tables, conditional probability and Bayes'' rule, measures of inductive support, naive Bayes spam filters, and logical inductive support.'
params:
  chapter: probability
  id: sli-prob
  license: 'CC-BY-4.0'
---

{{< slide title="Learning goals" >}}
## What you'll be able to do

{{< callout type="objectives" >}}
After this lecture and chapter 11, you will be able to:

- Represent a finite probability distribution using weighted truth-tables. *(apply)*
- Calculate probabilities of formulas and conditional probabilities. *(apply)*
- Apply probability laws and Bayes' rule. *(apply)*
- Compare measures of inductive support under a given distribution. *(analyse)*
- Explain how a naive Bayes classifier combines evidence. *(understand)*
- Distinguish support under a distribution from logical inductive support. *(analyse)*
{{< /callout >}}

{{< slide title="Next-token prediction" >}}
## Next-token prediction

{{< inference >}}
$t₁ = Lo, t₂ = g, t₃ = ic, t₄ = is$
---
$t₅ = a$
{{< /inference >}}

{{< img src="/img/drawings/prob_llm_example.svg" width="560px" alt="Colored tokens in Logic is lead to possible continuations with different probabilities." >}}

- Each continuation has a probability.
- The inference is probable, not certain.

{{< slide layout="app" title="Weighted truth-tables" >}}
## Weighted truth-tables

{{< logic-app name="probability" title="Probabilities of formulas" formula="SUN ∨ ¬RAIN" >}}

{{< slide title="Probabilities" >}}
## Probabilities

{{< callout type="definition" title="Mass and probability" >}}
A {{< term "probability-mass-function" "mass function" >}} $p : Ω → [0, 1]$ and the
{{< term "formula-probability" "probability" >}} of a sentence $A$:

$$
∑<sub>M ∈ Ω</sub> p(M) = 1
Pr(A) = ∑<sub>M ∈ Ω, M ⊨ A</sub> p(M)
$$
{{< /callout >}}

{{< img src="/img/drawings/prob_weather_space.svg" width="400px" alt="The weather models: sun and rain, sun without rain, rain without sun, and neither." >}}

**Examples:**

- Uniform, ${{< frac "1" "4" >}}$ each: $Pr(SUN ∨ ¬RAIN) = {{< frac "3" "4" >}}$
- Sun certain, ${{< frac "1" "2" >}}$ on each sunny model: $Pr(SUN ∨ ¬RAIN) = 1$

{{< slide layout="app" title="Conditioning" >}}
## Conditioning

$EVEN = D₂ ∨ D₄ ∨ D₆$, &emsp; $TWO = D₂$

{{< logic-app name="probability" kind="dice" title="Conditioning on an even roll" formula="TWO" condition="EVEN" >}}

{{< slide layout="split" title="Conditional probability" >}}
## Conditional probability

{{< column >}}

{{< callout type="definition" title="Conditional probability" >}}
For $Pr(B) > 0$:

$$
Pr(A | B) = {{< frac "Pr(A ∧ B)" "Pr(B)" >}}
$$
{{< /callout >}}

**Examples:** $Pr(TWO | EVEN)$

- Fair die: ${{< frac "1" "3" >}}$
- Six loaded to ${{< frac "1" "2" >}}$: ${{< frac "1" "7" >}}$

{{< column >}}

{{< img src="/img/drawings/prob_die_space.svg" width="380px" alt="The course mascot holds a die beside the six die models." >}}

{{< slide layout="split" class="slide--wide-right" title="Independence" >}}
## Independence

{{< column >}}

{{< img src="/img/drawings/ai_bikin_sun.svg" width="220px" alt="The course mascot cycles in the sunshine." >}}

{{< column >}}

{{< callout type="definition" title="Independence" >}}
$$
Pr(A ∧ B) = Pr(A) × Pr(B)
$$

For $Pr(B) > 0$: $Pr(A | B) = Pr(A)$.
{{< /callout >}}

**Examples:** $Pr(RAIN | SUN)$ and $Pr(RAIN)$

- Uniform: ${{< frac "1" "2" >}} = {{< frac "1" "2" >}}$, independent
- Dependent: ${{< frac "1" "3" >}} < {{< frac "3" "8" >}}$, sun lowers rain

{{< slide layout="split" class="slide--wide-right" title="Probability laws" >}}
## Probability laws

{{< column >}}

{{< img src="/img/drawings/prob_laws.svg" width="260px" alt="The course mascot weighs Pr(A) against 1 − Pr(A) on a pair of scales." >}}

{{< column >}}

{{< callout type="definition" title="Kolmogorov axioms" >}}
1. $Pr(A) ≥ 0$
2. $Pr(A) = 1$ if $⊨ A$
3. $Pr(A ∨ B) = Pr(A) + Pr(B)$ if $⊨ ¬(A ∧ B)$
{{< /callout >}}

- Every weighted truth-table obeys them.
- Finitely many variables: the converse holds.
- Laws follow without a table, even in FOL.

{{< slide layout="app" title="Negation" >}}
## Negation

$Pr(¬A) = 1 − Pr(A)$

{{< logic-app name="boolean" kind="derivation" logic="probability" preset="negation" title="Deriving the probability of a negation" >}}

{{< slide layout="app" title="Disjunction" >}}
## Disjunction

$Pr(A ∨ B) = Pr(A) + Pr(B) − Pr(A ∧ B)$

{{< logic-app name="boolean" kind="derivation" logic="probability" preset="disjunction" title="Deriving the probability of a disjunction" >}}

{{< slide layout="split" class="slide--wide-right" title="Bayes' rule" >}}
## Bayes' rule

{{< column >}}

{{< img src="/img/drawings/ai_doctor.svg" width="170px" alt="The course mascot as a doctor." >}}

{{< column >}}

{{< callout type="theorem" title="Bayes' rule" >}}
$$
Pr(C | E) = {{< frac "Pr(E | C) × Pr(C)" "Pr(E)" >}}
$$
{{< /callout >}}

Turns $Pr(E | C)$ into $Pr(C | E)$:

- {{< term "prior" "Prior" >}} $Pr(C)$: before the evidence
- {{< term "likelihood" "Likelihood" >}} $Pr(E | C)$: the evidence, if $C$
- {{< term "posterior" "Posterior" >}} $Pr(C | E)$: after the evidence
- {{< term "law-total-probability" "Total probability" >}} gives the denominator:

$$
Pr(E) = Pr(E | C) × Pr(C) + Pr(E | ¬C) × Pr(¬C)
$$

{{< slide layout="split" class="slide--wide-right" title="Measures of support" >}}
## Measures of support

{{< callout type="definition" title="Positive support" >}}
$E$ {{< term "inductive-support" "supports" >}} $C$ iff $Pr(C | E) > Pr(C)$.
{{< /callout >}}

- Increase of firmness: $d(C, E) = Pr(C | E) − Pr(C)$
- Log probability ratio: $r(C, E) = log({{< frac "Pr(C | E)" "Pr(C)" >}})$
- Log-likelihood ratio: $l(C, E) = log({{< frac "Pr(E | C)" "Pr(E | ¬C)" >}})$

{{< column >}}

{{< img src="/img/drawings/logarithm.svg" width="240px" alt="Graph of y = log(x): the curve rises through (1, 0), is negative below 1 and positive above 1, and becomes flatter as x increases." >}}

{{< column >}}

- Ratio above $1$: $log > 0$, support
- Ratio $1$: $log(1) = 0$, irrelevance
- Ratio below $1$: $log < 0$, counter-evidence

{{< slide layout="app" title="Comparing the measures" >}}
## Comparing the measures

{{< logic-app name="probability" kind="support" title="Compare measures of support" preset="dependent" formula="SUN ∴ RAIN" >}}

{{< slide layout="split" class="slide--wide-right" title="Spam filters" >}}
## Spam filters

{{< column >}}

{{< img src="/img/drawings/prob_ai_spam.svg" width="130px" alt="The course mascot holds a suspicious email marked definitely not SPAM." >}}

{{< column >}}

{{< img src="/img/drawings/prob_ai_non_spam.svg" width="440px" alt="A birthday message from Jim's new address has an urgent subject, exclamation marks, and the phrase right on the money." >}}

- Markers: $Unknown$, $Urgent$, $Exclamation$, $Money$
- Rule: $(Urgent ∧ Money) → SPAM$
- Jim's birthday wishes: spam!

{{< slide title="Naive Bayes classifiers" >}}
## Naive Bayes classifiers

{{< callout type="definition" title="Naive Bayes" >}}
Features are {{< term "conditional-independence" "independent" >}} given each class $K$:

$$
Pr(L₁ ∧ … ∧ Lₙ | K) = ∏<sub>i = 1</sub><sup>n</sup> Pr(Lᵢ | K)
$$
{{< /callout >}}

- Score each class: $score(K) = Pr(K) × ∏<sub>i = 1</sub><sup>n</sup> Pr(Lᵢ | K)$
- Normalize: $Pr(SPAM | E) = {{< frac "score(SPAM)" "score(SPAM) + score(¬SPAM)" >}}$

{{< slide layout="app" title="A spam filter" >}}
## A spam filter

{{< logic-app name="probability" kind="bayes" title="Naive Bayes spam filter" >}}

{{< slide title="Logical inductive support" >}}
## Logical inductive support

{{< callout type="definition" title="Weak logical inductive consequence" >}}
$P₁, …, Pₙ$ {{< approx >}} $C$ iff $Pr(C | E) ≥ Pr(C)$ for every $Pr$ with $Pr(E) > 0$,

where $E = P₁ ∧ … ∧ Pₙ$.
{{< /callout >}}

{{< callout type="theorem" title="Deduction implies inductive support" >}}
If $P₁, …, Pₙ ⊨ C$, then $Pr(C | E) = 1$ whenever $Pr(E) > 0$.
{{< /callout >}}

{{< slide layout="split" class="slide--wide-right" title="Confirmation by consequence" >}}
## Confirmation by consequence

{{< callout type="theorem" title="Confirmation by deductive consequence" >}}
If $C ⊨ E$ and $Pr(E) > 0$, then $Pr(C | E) ≥ Pr(C)$.
{{< /callout >}}

{{< column >}}

{{< img src="/img/drawings/con_ai_detective.svg" width="190px" alt="The course mascot inspects evidence with a magnifying glass." >}}

{{< column >}}

**Example:**

- $TWO ⊨ EVEN$
- $Pr(TWO | EVEN) = {{< frac "Pr(TWO)" "Pr(EVEN)" >}} ≥ Pr(TWO)$
- Fair die: from ${{< frac "1" "6" >}}$ to ${{< frac "1" "3" >}}$

{{< slide layout="split" class="slide--wide-right" title="Enumerative induction" >}}
## Enumerative induction

{{< column >}}

{{< img src="/img/drawings/la_ai_induction.svg" width="230px" alt="The course mascot reaches into a jar of marbles and says: They're all white!!" >}}

{{< column >}}

{{< callout type="theorem" title="Enumerative induction" >}}
For $E = A(c₁) ∧ … ∧ A(cₙ)$ with $Pr(E) > 0$:

$$
Pr(∀x A(x) | E) ≥ Pr(∀x A(x))
$$
{{< /callout >}}

**Example:** 100 marbles, each white with chance ${{< frac "1" "2" >}}$

- 70 drawn, all white
- Prior: $Pr(∀x White(x)) = 2<sup>−100</sup>$
- Posterior: $Pr(∀x White(x) | E) = 2<sup>−30</sup>$
- A huge increase, and still tiny.
