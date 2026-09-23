---
title: Circuit sandbox
weight: 70
params:
  id: tls-circuit-sandbox
  group: Circuits
  teaser: 'An open canvas of gates and relays, with a running table of what you built.'
---

# Circuit sandbox

Since $!!NOT!!$, $!!AND!!$ and $!!OR!!$ are truth-functionally complete, every
Boolean function has a circuit — and usually many, which is where the
engineering starts. A function can be built from relays or from gates, with more
components or fewer, and the sandbox is where you find out which of your
attempts actually computes what you wanted.

**Scope.** Two inputs, one output, and at most twenty components, all
combinational: no clock, no memory and no feedback.

Add components, wire an output dot to an input dot, and flip the switches. The
table beside the canvas reports the function your circuit computes, for all four
combinations of $X$ and $Y$, and updates as you wire.

{{< logic-app name="boolean" kind="workbench" preset="sandbox" >}}

## Using it

Every component is available from the start: the seven gates, and both relays
with the fixed power supply below them. Drag a component to move it, or nudge a
selected one with the arrow keys; Escape cancels a wire you started by mistake.
An input can take several sources at once, which puts them in parallel — the
relay reading of $!!OR!!$. Unconnected inputs leave the output unknown, shown as
`?` in the table, and feedback loops are rejected: these circuits are
combinational, with no memory of earlier inputs.

Nothing is saved when you leave the page, so copy anything you want to keep.

## In the book

- {{< chapter_ref chapter="boolean" id="implementing-booleans" >}}Implementing Booleans{{< /chapter_ref >}}
  builds the three operators out of relays.
- {{< chapter_ref chapter="boolean" id="adders" >}}Adders{{< /chapter_ref >}}
  chains them into binary addition.
- {{< chapter_ref chapter="sat" id="checking-a-circuit" >}}Checking a circuit{{< /chapter_ref >}}
  turns a finished circuit back into a satisfiability question.
