---
title: Many-valued logics
author: Johannes Korbmacher
weight: 100
params:
  id: exc-mv
---

# K₃ SAT solving {.solved #k3-sat-solving}

Use SQL to decide whether each inference is valid in K₃. The table
`Valuations(SUN, RAIN, WIND)` is already filled with all $3³ = 27$ combinations
of `0`, `NULL`, and `1`. As in the chapter, `NULL` represents $ω$.

Write a query that returns all three columns for exactly the countermodels:
each premise `IS TRUE`, while the conclusion `IS NOT TRUE`. Run it, then
choose $⊨$ or $⊭$ to interpret the result.

{{< logic-app name="mv-practice" exercise="inference" title="K₃ inference queries" >}}

## Solution {#k3-sat-solvingSolution .solution}

For the first inference, we search for countermodels like this:

```sql
SELECT SUN, RAIN, WIND FROM Valuations
WHERE (RAIN OR (RAIN AND SUN)) IS TRUE
  AND SUN IS NOT TRUE;
```

Levels 1, 2, and 5 are invalid. Countermodels include, respectively,
$v(RAIN) = 1, v(SUN) = 0$; $v(SUN) = 1, v(RAIN) = 0$; and
$v(WIND) = 1, v(RAIN) = ω$. The unspecified values can be chosen freely.
Levels 3, 4, and 6 are valid: their queries return no rows.
For level 3, no valuation makes both premises true. For level 5, notice
that an unknown conclusion is enough for a countermodel.

# K₃ derivations {.solved #k3-derivations}

Use the K₃ rules to derive each conclusion from the displayed premises.
The negation levels include double negations inside compound formulas;
the case arguments combine De Morgan with disjunction elimination.
Identify which assumptions are temporary and discharge them. Write material
conditionals as $¬A ∨ B$.

Explosion takes two premises, $A$ and $¬A$, in either order, and lets us
infer any $C$. There is no need to conjoin the premises first.

{{< logic-app name="deduction" kind="practice" logic="k3" deck="exercises" example="k3-dn" title="K₃ derivation exercises" >}}

## Solution {#k3-derivationsSolution .solution}

{{< logic-app name="deduction" kind="worked" logic="k3" deck="exercises" example="k3-dn" title="Worked K₃ derivations" >}}

# K₃ laws {.solved #k3-laws}

Verify the Kleene laws one at a time. Each level displays an equation;
write a query returning exactly the rows where its two sides disagree.
The table `ValueTriples(X, Y, Z)` already contains all 27 combinations of
`0`, `NULL`, and `1`. Return all three columns, even when the equation
uses fewer variables.

Use `IS NOT` to compare the two sides. Ordinary `!=` returns `NULL` if
either side is `NULL`, and `WHERE` would discard that row. The last level
tests a proposed identity that fails: your query should find its counterexamples.

{{< logic-app name="mv-practice" exercise="laws" title="Kleene law queries" >}}

## Solution {#k3-lawsSolution .solution}

For associativity of $~!AND!~$, for example:

```sql
SELECT X, Y, Z FROM ValueTriples
WHERE (X AND (Y AND Z)) IS NOT ((X AND Y) AND Z);
```

All the Kleene laws return no rows. For the last level, use
`WHERE (X OR NOT X) IS NOT 1`. This returns the nine rows with `X = NULL`:
the result does not depend on `Y` or `Z`.

# Łukasiewicz conditionals {.solved #łukasiewicz-conditionals}

The chapter's fuzzy conditional has value $min(1, 1 − v(A) + v(B))$.
As in the chapter, write $0.5$ for the intermediate value $ω$.
Restricting the conditional to $0$, $0.5$, and $1$ gives this table:

{{< function-table name="→" >}}
{"rows":["0","0.5","1"],"columns":["0","0.5","1"],"values":[["1","1","1"],["0.5","1","1"],["0","0.5","1"]]}
{{< /function-table >}}

This gives us three-valued Łukasiewicz logic. Here, as in K₃, validity
means preserving the designated value $1$. Later in these exercises,
we return to the stronger, degree-preserving notion of fuzzy consequence.

1. Find a K₃ model where the material conditional $RAIN → RAIN$ is not true.
2. Verify that $RAIN → RAIN$ has value $1$ in every Łukasiewicz model.
3. Is modus ponens valid in three-valued Łukasiewicz logic?

## Solution {#łukasiewicz-conditionalsSolution .solution}

1. If $v(RAIN) = ω$, the K₃ material conditional has value
   $max(1 − 0.5, 0.5) = 0.5$, so it is not true.
2. Whatever $v(RAIN)$ is, $min(1, 1 − v(RAIN) + v(RAIN)) = 1$.
3. Yes. If $v(A) = 1$, then $v(A → B) = min(1, v(B)) = v(B)$.
   Thus, if both premises have value $1$, so does $B$.

# Fuzzy predicates {.solved #fuzzy-predicates}

Let's interpret $Fast¹$ and $Slow¹$ for speeds from $0$ to $120$ km/h.
In every level, require that $Fast$ never decreases as speed increases,
while $Slow$ never increases. At $0$ km/h the car is fully slow and not fast;
at $120$ km/h it is fully fast and not slow.

Select a predicate and pull its curve up or down. Dots mark the speeds
mentioned in the task. You can also choose a speed and enter its degree.
The levels compare overlapping descriptions with a gap between them.

{{< logic-app name="mv-practice" exercise="curves" title="Interpreting Fast and Slow" >}}

## Solution {#fuzzy-predicatesSolution .solution}

For the complement levels, choose the degree of $Fast$ at each point and
set $Slow$ to $1 − Fast$. An overlapping gray area can have both degrees
$0.5$ throughout $40$–$80$ km/h.

For the gap level, let $Slow$ reach $0$ by $40$ km/h and let $Fast$
remain $0$ until $80$ km/h. They cannot be complements in that interval:
both descriptions fail to apply.

# Fuzzy rules {.solved #fuzzy-rules}

Choose interpretations that make the displayed rules hold at every speed.
Here, only the rules and any stated degree bounds constrain your choices.
Recall that $A ⇒ B$ requires the degree of $A$ to be at most the degree of $B$.
After completing the levels, explain how the two rules together relate
$Fast$ and $Slow$.

{{< logic-app name="mv-practice" exercise="rules" title="Satisfying speed rules" >}}

## Solution {#fuzzy-rulesSolution .solution}

$Fast(x) ⇒ ¬Slow(x)$ requires $Fast(x) + Slow(x) ≤ 1$.
The reverse rule requires $Fast(x) + Slow(x) ≥ 1$.
Together they force $Fast(x) + Slow(x) = 1$: the predicates are complements.
Choosing complementary interpretations also solves the first two levels,
although neither rule by itself requires complementation. For the last level,
we can keep both degrees at $0.5$ throughout the gray band.

# Fuzzy counterexamples {.solved #fuzzy-logic}

Find a counterexample at each level. For degree-preserving consequence,
the conclusion must have at least the least degree of the premises.
To refute the inference, make its value strictly smaller. With no premises,
the required value is $1$.

Here $→$ is the Łukasiewicz conditional from the chapter:
$v(A → B) = min(1, 1 − v(A) + v(B))$. Compare the modus ponens level with the
three-valued exercise above: why do the two questions have different answers?

{{< logic-app name="mv-practice" exercise="counterexamples" title="Fuzzy counterexamples" >}}

## Solution {#fuzzy-logicSolution .solution}

For modus ponens, choose $v(A) = 0.6$ and $v(B) = 0.3$.
The conditional has value $0.7$, but $min(0.6, 0.7) = 0.6 > 0.3$.
This does not refute preservation of $1$: the premises aren't both $1$.

For both disjunctive syllogism and explosion, choose $v(A) = 0.5$ and $v(B) = 0$.
The least premise degree is $0.5$ and the conclusion has degree $0$.
For affirming the consequent, choose $v(A) = 0, v(B) = 1$; these same values
refute denying the antecedent. Excluded middle fails at $v(A) = 0.5$.

# Valid fuzzy inferences {.solved #valid-fuzzy-inferences}

Prove that the following inferences are valid for degree-preserving fuzzy
consequence. Your calculation needs to work for arbitrary degrees
$a = v(A)$ and $b = v(B)$. Compare the least premise degree with the
conclusion's degree using $min$ and $max$.

{{< inference-rules caption="Fuzzy inferences to prove" >}}
[
 {"name":"Conjunction elimination","explanation":"","premises":["$A ∧ B$"],"conclusion":"$A$"},
 {"name":"Conjunction introduction","explanation":"","premises":["$A$","$B$"],"conclusion":"$A ∧ B$"},
 {"name":"Disjunction introduction","explanation":"","premises":["$A$"],"conclusion":"$A ∨ B$"}
]
{{< /inference-rules >}}

## Solution {#valid-fuzzy-inferencesSolution .solution}

Let $a = v(A)$ and $b = v(B)$ be any values in $[0, 1]$.
For conjunction elimination, we have:

$$
v(A ∧ B) = min(a, b) ≤ a = v(A).
$$

For conjunction introduction, the least premise degree is exactly the
conclusion's degree:

$$
min(v(A), v(B)) = min(a, b) = v(A ∧ B).
$$

For disjunction introduction, we have:

$$
v(A) = a ≤ max(a, b) = v(A ∨ B).
$$

Each calculation holds for all $a$ and $b$, as required.

# Combining controller rules {.solved #a-braking-controller}

A train has received a braking signal. While the signal is active, our
controller uses the train's speed to choose braking power. We want stronger
braking at high speeds and gentler braking as the train slows down.
Use these interpretations of $Slow$, $Moderate$, and $Fast$:

{{< fuzzy-diagrams kind="inputs" >}}

These predicates overlap: at $60$ km/h, the speed is fully Moderate and
counts as both Slow and Fast to degree $0.5$. Their degrees need not add
up to $1$.

Power runs from $0$ (no braking) to $1$ (full braking); $0.5$ means
half power. Use this scale throughout.

For Sugeno, choose the recommended outputs $c₁$, $c₂$, and $c₃$ for
$Slow(x) ↦ c₁$, $Moderate(x) ↦ c₂$, and $Fast(x) ↦ c₃$.
Their weights come from the diagram:

$$
w₁ = ⟦Slow⟧(x), w₂ = ⟦Moderate⟧(x), w₃ = ⟦Fast⟧(x)
power = (w₁c₁ + w₂c₂ + w₃c₃) / (w₁ + w₂ + w₃).
$$

<span id="smooth-controller-output"></span>

Meet the power requirements at each level. Level 3 also asks for a smooth
join at $60$ km/h: the curve's direction should not change abruptly there.
The dashed guides and the check help you find suitable outputs.

The final level uses Mamdani:
choose the $Low$, $Medium$, and $High$ output sets shown in the app.
The $Medium$ triangle extends $0.2$ to either side of its peak.

{{< logic-app name="mv-practice" exercise="braking" title="Combining controller rules" >}}

Explain in words how different settings can meet the same requirements.
Which Sugeno output would you change to increase power at $60$ km/h
without changing it at $0$ or $120$ km/h? Why? What relationship between
the three outputs removes the corner in level 3?

## Solution {#a-braking-controllerSolution .solution}

For the first level, choose $(c₁, c₂, c₃) = (0.1, 0.5, 0.9)$.
The powers at $0$, $60$, and $120$ km/h are then $0.1$, $0.5$, and $0.9$.

For the second, choose $(c₁, c₂, c₃) = (0, 0.8, 1)$.
At $60$ km/h the weights are $0.5$, $1$, and $0.5$, so:

$$
power = (0.5×0 + 1×0.8 + 0.5×1) / (0.5 + 1 + 0.5) = 0.65.
$$

At $0$ and $120$ km/h, only Slow or Fast applies, giving powers $0$ and $1$.
The total weight changes from $1$ at the endpoints to $2$ at $60$ km/h.
Dividing by this changing total produces a curved response, even though
the membership curves consist of straight segments.

<span id="smooth-controller-outputSolution"></span>

For level 3, $(c₁, c₂, c₃) = (0.1, 0.5, 0.9)$ works. With these
interpretations, the Moderate output must be halfway between the other two:

$$
c₂ = (c₁ + c₃) / 2.
$$

For example, $(0, 0.4, 0.8)$ also works. Raising or lowering $c₂$ from
this midpoint introduces a corner. With the midpoint setting, the two
parts of the curved response meet without an abrupt change in direction.

For Mamdani, let $Low$ reach $0$ at power $0.2$, let $Medium$ peak at
$0.75$, and let $High$ start rising at $0.6$. The powers are approximately
$0.067$, $0.625$, and $0.867$ at the three speeds.

There are many solutions because the tasks specify ranges. For example,
$(0, 0.5, 0.8)$ also solves the first level. Raising any recommendation
increases power wherever its condition applies. Raising $c₂$ increases
power at $60$ km/h while leaving the endpoints unchanged, since Moderate
has degree $0$ at both endpoints. In Mamdani, we can move the centroid
by changing the output sets' shapes and positions.

# What does the intermediate value mean? {.solved}

Compare these four cases. What information is represented, and which of our
models would you consider using?

1. A database has no recorded age for little Jimmy.
2. A tank is half full.
3. The probability of rain tomorrow is 0.5.
4. Two reports conflict: one says it is raining, the other says it isn't.

## Solution {#what-does-the-intermediate-value-meanSolution .solution}

1. This is missing information. We could leave both an age claim and its
   negation unentailed in a classical KB, or use a SQL-style unknown value.
2. This is a measurement. We can represent the fraction directly as 0.5.
   A fuzzy predicate such as “full” needs a chosen membership function; its
   degree needn't equal the measured fraction.
3. This is uncertainty about an event. A probability of 0.5 does not mean
   that the event will be half true.
4. This is conflicting information. We might keep track of sources and
   revise a belief, or use a paraconsistent consequence relation. Calling
   K3's $ω$ “both” by itself doesn't change its designated values or give
   us a suitable treatment of the conflict.
