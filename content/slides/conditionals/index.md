---
title: Logical conditionals
author: Johannes Korbmacher
weight: 60
layout: 'reveal_slides'
summary: 'Lecture 6: the material conditional, forward and backward chaining, Horn SAT, and planning by SAT solving.'
params:
  chapter: conditionals
  id: sli-if
  license: 'CC-BY-4.0'
---

{{< slide title="Learning goals" >}}
## What you'll be able to do

{{< callout type="objectives" >}}
After this lecture and chapter 6, you will be able to:

- Explain the Boolean interpretation of the material conditional. *(understand)*
- Apply forward and backward chaining to a propositional knowledge base. *(apply)*
- Compare depth-first and breadth-first search in conditional reasoning. *(analyse)*
- Use the Horn-SAT algorithm to decide satisfiability. *(apply)*
- Represent a bounded planning problem using propositional formulas. *(apply, create)*
- Explain the role of frame conditions in SAT planning. *(understand, evaluate)*
{{< /callout >}}

Read chapter 6 first; exercise sheet 6 comes after the lecture.

{{< slide layout="split" title="Conditionals" >}}
## Conditionals

{{< column >}}

{{< inference layout="stacked" >}}
$A → B$
$A$
---
$B$
{{< /inference >}}

- Rules, applied to facts, tell us what our knowledge entails.
- An expert system: a KB of rules and facts, an inference engine.
- Rain and a low sun: a rainbow.

{{< column >}}

{{< img src="/img/drawings/expert_system_mascot.svg" width="260px" alt="The course mascot as an expert system: a database for a body and a chip labelled Expert System for a head." >}}

{{< slide layout="split" title="The material conditional" >}}
## The material conditional

{{< callout type="definition" title="Material conditional" >}}
Given a {{< term "valuation" "Boolean valuation" >}} $v$, we interpret
the {{< term "conditional" "material conditional" >}} $A → B$ using the recursive clause:

$$
v(A → B) = (!!NOT!! v(A)) !!OR!! v(B).
$$
{{< /callout >}}

{{< column >}}

| $RAIN$ | $WIND$ | $RAIN → WIND$ |
| --- | --- | --- |
| $1$ | $1$ | $1$ |
| $1$ | $0$ | $0$ |
| $0$ | $1$ | $1$ |
| $0$ | $0$ | $1$ |

{{< column >}}

False {{< term "iff" >}} the {{< term "antecedent" "antecedent" >}} is true
and the {{< term "consequent" "consequent" >}} is false.

{{< slide layout="split" title="Default-true" >}}
## Default-true

{{< column >}}

```python
if day == "monday":
    number = 1
```

On Tuesday, the rule says nothing: assigning `1` or `2` both satisfy it.

{{< column >}}

The default truth-value is $1$; only a counterexample changes it to $0$.

With two truth-values, there is no third option.

{{< slide layout="app" title="Conditional rewriting" >}}
## Conditional rewriting

$$
(A → B) ⟹ (¬A ∨ B)
$$

{{< logic-app name="sat" kind="rewrite" examples="conditionals" formula="(RAIN ∧ SUN) → RAINBOW" title="Rewriting (RAIN ∧ SUN) → RAINBOW" >}}

{{< slide layout="split" title="Modus ponens" >}}
## Modus ponens

{{< column >}}

{{< callout type="theorem" title="Modus ponens" >}}
For arbitrary Boolean formulas $A$ and $B$:

$$
A, (A → B) ⊨ B.
$$
{{< /callout >}}

By refutation:

$$
RAIN ∧ (¬RAIN ∨ WIND) ∧ ¬WIND
$$

resolves to $WIND$, then to $⊥$.

{{< column >}}

{{< img src="/img/drawings/con_ai_counterfactual.svg" width="240px" alt="The course mascot holds a red ball in front of a window." >}}

Not every *if* is material: "if you'd throw the ball at the window, then it
would break."

{{< slide layout="split" title="Knowledge bases" >}}
## Knowledge bases

{{< column >}}

$$
MORNING → DAY
EVENING → DAY
(CLEAR ∧ DAY) → SUN
(MORNING ∧ SUN) → LOW_SUN
(EVENING ∧ SUN) → LOW_SUN
(RAIN ∧ LOW_SUN) → RAINBOW
$$

TELL: $MORNING, CLEAR, RAIN$

ASK: $RAINBOW$?

{{< column >}}

{{< inference rule="gen-MP" >}}
$A₁$
$…$
$Aₙ$
$(A₁ ∧ … ∧ Aₙ) → B$
---
$B$
{{< /inference >}}

Every part of the antecedent first, then the consequent.

{{< slide title="Forward chaining" >}}
## Forward chaining

{{< callout type="definition" title="Forward chaining" >}}
{{< term "forward-chaining" "Forward chaining" >}} starts with known facts
and repeatedly applies rules whose premises are known to derive new facts.
{{< /callout >}}

<div class="conditional-inference-chain">
{{< inference rule="MP" >}}
MORNING
MORNING → DAY
---
DAY
{{< /inference >}}
{{< inference rule="gen-MP" >}}
CLEAR
DAY
(CLEAR ∧ DAY) → SUN
---
SUN
{{< /inference >}}
{{< inference rule="gen-MP" >}}
MORNING
SUN
(MORNING ∧ SUN) → LOW_SUN
---
LOW_SUN
{{< /inference >}}
{{< inference rule="gen-MP" >}}
RAIN
LOW_SUN
(RAIN ∧ LOW_SUN) → RAINBOW
---
RAINBOW
{{< /inference >}}
</div>

{{< slide layout="app" title="Forward chaining, step by step" >}}
## Forward chaining, step by step

Try “Rainbow”, then “Missing fact”: the same KB without $CLEAR$.

{{< logic-app name="conditionals" kind="chaining" method="forward" title="Forward chaining on the weather knowledge base" >}}

{{< slide title="Backward chaining" >}}
## Backward chaining

{{< callout type="definition" title="Backward chaining" >}}
{{< term "backward-chaining" "Backward chaining" >}} starts with a goal and
searches for rules whose premises would establish it, treating those premises
as further goals.
{{< /callout >}}

| Rule used backward | Remaining queries |
| --- | --- |
| Start | $RAINBOW$ |
| $(RAIN ∧ LOW_SUN) → RAINBOW$ | $LOW_SUN$; $RAIN$ is known |
| $(MORNING ∧ SUN) → LOW_SUN$ | $SUN$; $MORNING$ is known |
| $(CLEAR ∧ DAY) → SUN$ | $DAY$; $CLEAR$ is known |
| $MORNING → DAY$ | None; $MORNING$ is known |

{{< slide layout="app" title="Backward chaining, step by step" >}}
## Backward chaining, step by step

Try the same query without $CLEAR$. Where does the search get stuck?

{{< logic-app name="conditionals" kind="chaining" method="backward" title="Backward chaining on the weather knowledge base" >}}

{{< slide layout="split" title="Search order" >}}
## Search order

Forward and backward describe the *direction* of reasoning; depth first and
breadth first, the *order* of search.

{{< column >}}

### Depth first

{{< syntax-tree caption="" >}}
{"label":"A","step":1,"children":[{"label":"B","step":2,"children":[{"label":"D","step":3},{"label":"E","step":4}]},{"label":"C","step":5,"children":[{"label":"F","step":6},{"label":"G","step":7}]}]}
{{< /syntax-tree >}}

{{< column >}}

### Breadth first

{{< syntax-tree caption="" >}}
{"label":"A","step":1,"children":[{"label":"B","step":2,"children":[{"label":"D","step":4},{"label":"E","step":5}]},{"label":"C","step":3,"children":[{"label":"F","step":6},{"label":"G","step":7}]}]}
{{< /syntax-tree >}}

{{< slide title="Horn clauses" >}}
## Horn clauses

{{< callout type="definition" title="Horn clauses" >}}
A {{< term "horn-clause" "Horn clause" >}} is a disjunctive clause containing
at most one positive literal. A
{{< term "definite-clause" "definite clause" >}} contains exactly one positive literal. A {{< term "horn-formula" "Horn formula" >}}, then, is a conjunction of Horn clauses.
{{< /callout >}}

| Disjunctive form | Conditional form | Use |
| --- | --- | --- |
| $¬CLEAR ∨ ¬DAY ∨ SUN$ | $(CLEAR ∧ DAY) → SUN$ | Derive a fact |
| $SUN$ | $⊤ → SUN$ | Initial fact |
| $¬SUN ∨ ¬RAIN$ | $(SUN ∧ RAIN) → ⊥$ | Forbid a combination |

{{< slide layout="split" title="Horn SAT" >}}
## Horn SAT

{{< column >}}

{{< callout type="definition" title="Horn SAT" >}}
{{< term "horn-sat" "Horn SAT" >}} is the problem of deciding whether a
finite conjunction of Horn clauses is satisfiable.
{{< /callout >}}

Chain from the facts. A constraint reached: $⊥$, unsatisfiable. Otherwise the
derived atoms are the {{< term "least-model" "least model" >}}.

{{< column >}}

{{< callout type="theorem" title="Linear-time Horn SAT" >}}
Horn satisfiability can be decided in time $O(m+1)$, where $m$ is the total
number of literal occurrences in the input clauses.
{{< /callout >}}

Truth-tables: $2ⁿ$ rows. Will our planning formulas be Horn?

{{< slide layout="app" title="Counters and an agenda" >}}
## Counters and an agenda

A counter of unmet premises for each rule; an {{< term "agenda" "agenda" >}} of facts to process.

{{< logic-app name="conditionals" kind="horn" title="Horn satisfiability with counters" >}}

{{< slide layout="split" title="Planning problem" >}}
## Planning problem

{{< column >}}

{{< img src="/img/drawings/con_ai_plan_setup.svg" width="280px" alt="Green is on red; the instructions ask for red on green." >}}

Green on red $⟶$ red on green. Two action steps.

{{< column >}}

{{< callout type="definition" title="Fluent" >}}
A {{< term "fluent" "fluent" >}} describes a feature of a world whose truth
may change over time. In a propositional planning language, a separate atom
represents its value at each time point.
{{< /callout >}}

{{< callout type="definition" title="Action" >}}
An {{< term "planning-action" "action" >}} is an operation an agent can perform
in the world. An action atom states that a particular action occurs at a
particular time.
{{< /callout >}}

{{< slide layout="split" title="Formalization and SATPLAN" >}}
## Formalization and SATPLAN

{{< column >}}

{{< callout type="definition" title="SATPLAN" >}}
{{< term "sat-planning" "Bounded SAT planning" >}} encodes an initial state,
a goal, and permitted transitions over a fixed finite horizon as a
propositional formula. A satisfying assignment describes a plan relative to
that encoding.
{{< /callout >}}

### States

$$
¬On(X, X, t)
On(X, Y, t) → ¬On(Y, X, t)
$$

Initial and goal:

$$
I = On(G, R, 0) ∧ ¬On(R, G, 0)
G = On(R, G, 2)
$$

{{< column >}}

### Preconditions and effects

$$
Stack(X, Y, t) → ¬On(X, Y, t)
Stack(X, Y, t) → ¬On(Y, X, t)
Unstack(X, Y, t) → On(X, Y, t)
Stack(X, Y, t) → On(X, Y, t+1)
Unstack(X, Y, t) → ¬On(X, Y, t+1)
$$

{{< slide layout="app" title="Frame conditions and miracles" >}}
## Frame conditions and miracles

{{< callout type="definition" title="Frame condition" >}}
A {{< term "frame-condition" "frame condition" >}} is a formula specifying
when a fluent retains its value from one time point to the next.
{{< /callout >}}

{{< logic-app name="conditionals" kind="planning" view="frames" autostart="true" title="A miracle model, then the two frame conditions that exclude it" >}}

{{< slide layout="app" title="Frame problem" >}}
## Frame problem

How do we represent what stays unchanged?

$$
¬On(X, Y, t) ∨ Unstack(X, Y, t) ∨ On(X, Y, t+1)
$$

Two positive literals: this frame clause is non-Horn. The $O(m+1)$ guarantee
no longer applies.

{{< logic-app name="conditionals" kind="planning" frames="chapter" view="model" autostart="true" title="The complete encoding: unstack green, then stack red" >}}
