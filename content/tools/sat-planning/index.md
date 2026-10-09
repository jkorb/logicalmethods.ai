---
title: SAT planning
weight: 110
params:
  id: tls-sat-planning
  group: Automated reasoning
  teaser: "Find bounded plans from editable initial states, goals, and frame conditions."
---

# SAT planning

Describe an initial state and a goal, then look for a sequence of actions
connecting them. Inspect the resulting states to see what the frame conditions
require to stay unchanged.

**Scope.** The supplied two-block world, with its fixed fluents and actions.
Initial states, goals, frame conditions, and a horizon of one to six steps are
editable. A failed search at one horizon rules out plans of that length.

{{< logic-app name="conditionals" kind="planning" frames="chapter" title="Planning in the blocks world" >}}

## Using it

Set the initial facts, goal, and horizon. Enter positive and negative frame
conditions, or use Add frame conditions to load the supplied persistence rules.
Solve, then step through the model to inspect the actions and states.

With Complete initial state selected, unlisted initial fluents are false.
Otherwise the solver may choose their initial values. The goal specifies only
the facts that must hold at the final step. The solver reports resource limits
separately from an unsatisfiable planning problem.

## In the book

- {{< chapter_ref chapter="conditionals" id="planning" >}}SAT planning{{< /chapter_ref >}}
  explains the encoding and the role of frame conditions.
