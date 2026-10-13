---
title: Many-valued Logic
author: Johannes Korbmacher
weight: 100
layout: 'reveal_slides'
summary: 'Lecture 10: Kleene logic for missing information and SQL NULL, fuzzy predicates and degree-preserving consequence, and fuzzy controllers.'
params:
  chapter: many-valued
  id: sli-fol-mv
  license: 'CC-BY-4.0'
---

{{< slide title="Learning goals" >}}
## What you'll be able to do

{{< callout type="objectives" >}}
After this lecture and chapter 10, you will be able to:

- Distinguish missing information from graded membership. *(analyse)*
- Calculate Kleene truth-values and explain SQL queries involving `NULL`. *(apply, understand)*
- Use Kleene models to test inferences and construct natural deduction proofs. *(apply, create)*
- Calculate and modify fuzzy predicate interpretations, and test fuzzy inferences. *(apply)*
- Check fuzzy rules and calculate the output of a simple fuzzy controller. *(evaluate, apply)*
{{< /callout >}}

{{< slide layout="split" title="Bivalence" >}}
## Bivalence

Every formula has value $0$ or $1$.

{{< column >}}

{{< img src="/img/drawings/mv_db_understand.svg" width="240px" alt="A database says: it's me again; turns out you also need 3-valued logic to understand me." >}}

Missing information: no language recorded for Zimbabwe.

{{< column >}}

{{< img src="/img/drawings/mv_ai_warm.svg" width="140px" alt="The course mascot under a shining sun, holding a thermometer." >}}

Vagueness: is 20°C warm? And 19.999°C?

{{< slide layout="app" title="Missing values" >}}
## Missing values

{{< sql-app title="Comparing a missing value" setup="kleene-countries" >}}
SELECT country FROM LanguageOf
WHERE (language = 'Dutch');

SELECT country FROM LanguageOf
WHERE NOT (language = 'Dutch');
{{< /sql-app >}}

{{< slide title="The Kleene functions" >}}
## The Kleene functions

{{< callout type="definition" title="Strong Kleene operations" >}}
With $ω = 1/2$:

$$
~!NOT!~ X = 1 - X,   X ~!AND!~ Y = min(X,Y),   X ~!OR!~ Y = max(X,Y)
$$
{{< /callout >}}

<div class="function-tables kleene-tables">

{{< function-table name="NOT" >}}
{"rows":["0","ω","1"],"columns":[""],"values":[["1"],["ω"],["0"]]}
{{< /function-table >}}

{{< function-table name="AND" >}}
{"rows":["0","ω","1"],"columns":["0","ω","1"],"values":[["0","0","0"],["0","ω","ω"],["0","ω","1"]]}
{{< /function-table >}}

{{< function-table name="OR" >}}
{"rows":["0","ω","1"],"columns":["0","ω","1"],"values":[["0","ω","1"],["ω","ω","1"],["1","1","1"]]}
{{< /function-table >}}

</div>

{{< slide layout="split" title="K₃ consequence" >}}
## K₃ consequence

{{< column >}}

{{< callout type="definition" title="K₃ models and consequence" >}}
A {{< term "kleene-model" "K₃ model" >}} gives each variable $0$, $ω$ or $1$.

$Γ ⊨ C$ iff every K₃ model that gives all of $Γ$ value $1$ gives $C$ value $1$.
{{< /callout >}}

$1$ is the only {{< term "designated-value" "designated value" >}} here.

{{< column >}}

{{< img src="/img/drawings/mv_kleene-space.svg" width="300px" alt="The nine K₃ models for SUN and RAIN: each of SUN and RAIN is true, false or unknown." >}}

$3² = 9$ information states for $SUN$ and $RAIN$.

{{< slide layout="app" title="The Kleene model space" >}}
## The Kleene model space

{{< logic-app name="many-valued" kind="models" title="Disjunctive syllogism in the Kleene model space" >}}

{{< slide layout="split" class="slide--centred" title="Excluded middle and explosion" >}}
## Excluded middle and explosion

{{< column >}}

$v(SUN) = ω$:

$$
v(SUN ∨ ¬SUN) = ω
$$

All $ω$ gives $ω$: no tautologies in $¬$, $∧$, $∨$.

{{< column >}}

{{< inference rule="Explosion" >}}
$A$
$¬A$
---
$C$
{{< /inference >}}

No model gives $A$ and $¬A$ both value $1$.

{{< img src="/img/drawings/ai_paniek.svg" width="110px" alt="The course mascot clutches its head and says: Panik???" >}}

{{< slide title="Natural deduction for K₃" >}}
## Natural deduction for K₃

{{< inference-rules caption="Classical rules that fail in K₃" >}}
[
 {"name":"Conditional introduction","premises":["$[A]$","$⋮$","$B$"],"conclusion":"$A → B$","invalid":true,"explanation":"$A → A$ has value $ω$ when $A$ does."},
 {"name":"Negation introduction","premises":["$[A]$","$⋮$","$B ∧ ¬B$"],"conclusion":"$¬A$","invalid":true,"explanation":"$¬(B ∧ ¬B)$ has value $ω$ when $B$ does."},
 {"name":"Classical reductio","premises":["$[¬A]$","$⋮$","$B ∧ ¬B$"],"conclusion":"$A$","invalid":true,"explanation":"It would prove $C ∨ ¬C$, even when $C$ is unknown."}
]
{{< /inference-rules >}}

{{< slide layout="app" title="K₃ derivations" >}}
## K₃ derivations

{{< logic-app name="deduction" kind="worked" logic="k3" example="k3-ds" title="Disjunctive syllogism in K₃, by cases and explosion" >}}

{{< slide layout="app" title="Countermodels in SQL" >}}
## Countermodels in SQL

Premises `IS TRUE`, conclusion `IS NOT TRUE`: a row is a countermodel.

{{< sql-app title="Kleene countermodels to affirming the consequent" setup="kleene-values" >}}
-- SUN → RAIN, RAIN ∴ SUN
SELECT SUN, RAIN FROM Valuations
WHERE (NOT SUN OR RAIN) IS TRUE
  AND RAIN IS TRUE
  AND SUN IS NOT TRUE;
{{< /sql-app >}}

{{< slide layout="app" title="Fuzzy predicates" >}}
## Fuzzy predicates

$⟦IsWarm⟧ : ℝ → [0,1]$, &emsp; $v(IsWarm(15°C)) = ⟦IsWarm⟧(15°C)$

{{< logic-app name="many-valued" kind="memberships" title="Membership curves for IsCold, IsWarm and IsHot" >}}

{{< slide layout="app" title="Combining degrees" >}}
## Combining degrees

{{< logic-app name="many-valued" kind="predicates" title="Fuzzy predicate interpretations" >}}

{{< slide title="Fuzzy logic" >}}
## Fuzzy logic

{{< callout type="definition" title="Degree-preserving consequence" >}}
$P₁, …, Pₙ ⊨ C$ iff $min(v(P₁), …, v(Pₙ)) ≤ v(C)$ in every fuzzy model.
{{< /callout >}}

{{< inference-rules caption="Invalid with v(A) = 0.5 and v(B) = 0" >}}
[
 {"name":"Explosion","premises":["$A$","$¬A$"],"conclusion":"$B$","invalid":true,"explanation":"$v(A) = v(¬A) = 0.5 > 0 = v(B)$"},
 {"name":"Disjunctive syllogism","premises":["$A ∨ B$","$¬A$"],"conclusion":"$B$","invalid":true,"explanation":"$v(A ∨ B) = v(¬A) = 0.5 > 0 = v(B)$"}
]
{{< /inference-rules >}}

{{< slide layout="app" title="Fuzzy rules" >}}
## Fuzzy rules

{{< img src="/img/drawings/snow_flake.svg" width="60px" class="deck-corner" alt="A snowflake." >}}

{{< callout type="definition" title="Fuzzy rule" >}}
$A(x) ⟹ B(x)$ holds iff $v(A(x)) ≤ v(B(x))$ for every $x$.
{{< /callout >}}

{{< logic-app name="many-valued" kind="rules" title="Checking a fuzzy heating rule" >}}

{{< slide layout="split" title="Sugeno controllers" >}}
## Sugeno controllers

{{< callout type="definition" title="Sugeno controller" >}}
Rules $Aᵢ(x) ↦ cᵢ$ recommend outputs $cᵢ$ with weights $wᵢ = v(Aᵢ(T))$; the
output is their {{< term "weighted-average" "weighted average" >}} at $T$:

$$
h = (w₁c₁ + … + wₙcₙ)/(w₁ + … + wₙ)
$$
{{< /callout >}}

{{< column >}}

- $IsCold(x) ↦ 1$
- $IsWarm(x) ↦ 0$
- $IsHot(x) ↦ 0$

Weights $0.4$, $0.6$, $0$: 40% power.

{{< column >}}

{{< img src="/img/drawings/proof_ai_radiator.svg" width="220px" alt="The course mascot by a rainy window, next to a heater labelled Heater 2000." >}}

{{< slide layout="app" title="A Sugeno heating controller" >}}
## A Sugeno heating controller

{{< logic-app name="many-valued" kind="controller" title="A Sugeno heating controller" >}}

{{< slide title="Mamdani controllers" >}}
## Mamdani controllers

{{< img src="/img/drawings/sun.svg" width="70px" class="deck-corner" alt="A shining sun." >}}

{{< callout type="definition" title="Mamdani controller" >}}
Rules recommend fuzzy outputs $μᵢ$, as in $IsHot(x) ↦ High$. Clipped at their
weights, they combine to

$$
μ(p) = maxᵢ min(wᵢ, μᵢ(p)).
$$

The output is the {{< term "centroid" "centroid" >}} of the area under $μ$.
{{< /callout >}}

{{< slide layout="app" title="Defuzzification" >}}
## Defuzzification

{{< logic-app name="many-valued" kind="defuzzify" title="Clipping, combining and the centroid" >}}

{{< slide layout="app" title="Cooling a humid room" >}}
## Cooling a humid room

{{< logic-app name="many-valued" kind="aircon" title="Sugeno and Mamdani controllers for temperature and humidity" >}}
