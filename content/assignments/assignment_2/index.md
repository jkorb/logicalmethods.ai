---
title: Assignment 2 (due 03/10/2025)
author: Johannes Korbmacher
locked: false
weight: 20
params: 
  id: ass-2
  math: true
---

Submission via Brightspace in $LaTeX$ generated PDF. GenAI-use not allowed.

# The Material Conditional

In the exercises, we've defined the Boolean truth-function !!IF!!. 

1. Implement this function using relays.

    *Note*: To include the diagram of your relay, you can:

    - draw a diagram with pen and paper and include it in your $LaTeX$ document using `\includegraphics`. See <https://docs.overleaf.com/writing-and-editing/inserting-images>;

    - use more advanced $LaTeX$-tools, like <https://ctan.org/pkg/tikz-relay?lang=en>.

2. Verify your work by translating the circuit and specification to formulas and show that they are equivalent.

    *Hint*: Remember what !!XOR!! does with relation to equivalence!

# Planning

Solve the following planning problem using `Satplan`:

{{< img src="img/banana.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="550px">}}

There's a banana dangling from the ceiling. {{< logo >}}&ThinSpace;loves
bananas! But the banana is out of reach. Luckily, there's a stick that would
allow {{< logo>}}&ThinSpace;to reach the banana. 

1. Describe the propositional language, including fluents and actions. Try to
   be as simple as possible. 

    _Hint_: A single fluent and two actions are enough!

2. Give the $KB$ with all necessary principles governing possibilities,
   the interaction of actions and fluents, as well as persistence
conditions.

    _Hint_: You can be rather simplistic about the effects of actions. For
    example,  knocking the banana results in having it next time-stamp.


3. Describe the planning problem as a `SAT`-problem.


4. Find a model (manually, but not necessarily algorithmically—use your
   human intelligence) and read off a plan.


