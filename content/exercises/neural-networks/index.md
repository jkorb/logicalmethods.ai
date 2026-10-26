---
title: Logic and neural networks
author: Johannes Korbmacher
weight: 120
draft: true
locked: false
params:
  id: exc-ann
  last_edited: "26/10/2026"
---

# Perceptrons and networks {#implementations .solved}

Choose weights and biases that implement each truth-function. As in the
{{< chapter_ref chapter="neural-networks" >}}chapter{{< /chapter_ref >}},
$step(z)$ is $1$ when $z > 0$ and $0$ otherwise.

1. NAND: $¬(P ∧ Q)$, using one perceptron.
2. NOR: $¬(P ∨ Q)$, using one perceptron.
3. ANDNOT: $P ∧ ¬Q$, using one perceptron.
4. Majority: at least two of $P, Q, R$ are $1$, using one perceptron.
5. Exactly one: exactly one of $P, Q, R$ is $1$, using two hidden
   perceptrons and an output perceptron.

Use **Test input** to fill the table. Explain why your weights and biases work.

{{< logic-app name="perceptron" kind="practice" exercise="implement" title="Implementing truth-functions" >}}

## Solution {#implementationsSolution .solution}

One choice of weights and biases for the first four functions is:

| Level | $w<sub>P</sub>$ | $w<sub>Q</sub>$ | $w<sub>R</sub>$ | $b$ |
| --- | --- | --- | --- | --- |
| NAND | $−1$ | $−1$ | — | $1.5$ |
| NOR | $−1$ | $−1$ | — | $0.5$ |
| ANDNOT | $1$ | $−1$ | — | $−0.5$ |
| Majority | $1$ | $1$ | $1$ | $−1.5$ |

For NAND, the score $1.5 − P − Q$ is negative exactly when both inputs are
$1$. Lowering the bias to $0.5$ gives NOR: the score is positive only when
both inputs are $0$.

For ANDNOT, the score $P − Q − 0.5$ is positive only at $(P, Q) = (1, 0)$.
For majority, the sum $P + Q + R$ exceeds $1.5$ exactly when at least two
inputs are $1$.

For exactly one of three, let $h₁$ detect at least one active input and
$h₂$ detect at least two:

$$
h₁ = step(P + Q + R − 0.5),
h₂ = step(P + Q + R − 1.5),
y = step(h₁ − h₂ − 0.5).
$$

Both hidden units have incoming weights $(1, 1, 1)$. Their biases are $−0.5$
and $−1.5$. The output weights are $(1, −1)$ and its bias is $−0.5$.
With no active inputs, the hidden outputs are $(0, 0)$; with one they are
$(1, 0)$; with two or three they are $(1, 1)$. Only $(1, 0)$ makes the output
score positive.

The resulting tables are:

| $P$ | $Q$ | NAND | NOR | ANDNOT |
| --- | --- | --- | --- | --- |
| $0$ | $0$ | $1$ | $1$ | $0$ |
| $0$ | $1$ | $1$ | $0$ | $0$ |
| $1$ | $0$ | $1$ | $0$ | $1$ |
| $1$ | $1$ | $0$ | $0$ | $0$ |

| $P$ | $Q$ | $R$ | Majority | Exactly one |
| --- | --- | --- | --- | --- |
| $0$ | $0$ | $0$ | $0$ | $0$ |
| $0$ | $0$ | $1$ | $0$ | $1$ |
| $0$ | $1$ | $0$ | $0$ | $1$ |
| $0$ | $1$ | $1$ | $1$ | $0$ |
| $1$ | $0$ | $0$ | $0$ | $1$ |
| $1$ | $0$ | $1$ | $1$ | $0$ |
| $1$ | $1$ | $0$ | $1$ | $0$ |
| $1$ | $1$ | $1$ | $1$ | $0$ |

# Linear separability {#separability .solved}

A single step-activation perceptron can implement a truth-function exactly
when it is **linearly separable**: a straight line (two inputs) or a plane
(three inputs) puts all the $1$-points on one side and all the $0$-points
on the other. Points on the boundary count as $0$.

1. Label the points from the truth-table.
2. Separate the $0$- and $1$-points, or choose **Not separable**.
3. Give your weights and bias, or explain why separation is impossible.

Drag the line or plane to move it, and its handles to turn it. Drag empty
space to rotate the cube.

{{< logic-app name="perceptron" kind="practice" exercise="separate" title="Plotting and separating truth-functions" >}}

## Solution {#separabilitySolution .solution}

1. **NAND is separable.** The $0$-point is $(1, 1)$; the other three
   points are $1$. The line $P + Q = 1.5$ cuts off the $(1, 1)$ corner.
   Weights $(−1, −1)$ and bias $1.5$ give the correct orientation: the
   three $1$-points have positive score.
2. **Table A is separable.** Its output is $P$, regardless of $Q$.
   The vertical line $P = 0.5$ separates the two values. Use weights
   $(1, 0)$ and bias $−0.5$.
3. **Table B is not separable.** This is XOR: the two $1$-points occupy
   opposite corners, as do the two $0$-points. Their joining segments
   cross at $(0.5, 0.5)$, so no line separates the pairs.
4. **Table C is separable.** Its output is $Q → P$; only $(0, 1)$ is $0$.
   The line $P − Q = −0.5$ cuts off that corner. Use weights $(1, −1)$
   and bias $0.5$.
5. **All equal is not separable.** Only $000$ and $111$ have output $1$.
   The segment joining them passes through the centre of the cube,
   $(0.5, 0.5, 0.5)$. So does the segment joining the $0$-points $001$
   and $110$. Each side of a plane containing both ends of a segment
   contains that whole segment. The shared centre therefore prevents
   these two pairs from lying on opposite sides.
6. **Majority is separable.** The $1$-points are $011, 101, 110, 111$.
   The plane $P + Q + R = 1.5$ separates them from $000, 001, 010, 100$.
   Use weights $(1, 1, 1)$ and bias $−1.5$.
7. **Exactly one is not separable.** The $1$-points are $001, 010, 100$.
   On the face $R = 0$, the points $010$ and $100$ are $1$, while $000$
   and $110$ are $0$. The segments joining equal values cross at the
   centre of this face. No line separates them on that face, so
   no plane separates the whole cube.

# Black boxes {#black-boxes .solved}

Test every input of each black box and find a formula for its output.
Then build a network with the same truth-table.

{{< logic-app name="perceptron" kind="practice" exercise="blackbox" title="Identifying and rebuilding black-box functions" >}}

## Solution {#black-boxesSolution .solution}

1. Only $(P, Q) = (0, 0)$ gives output $1$. One formula is $¬P ∧ ¬Q$,
   so $Y ↔ (¬P ∧ ¬Q)$. Use one perceptron with weights $(−1, −1)$ and
   bias $0.5$.
2. Only $(P, Q) = (1, 0)$ gives output $0$. This is $P → Q$, giving
   $Y ↔ (P → Q)$. Use weights $(−1, 1)$ and bias $0.5$.
3. The positive rows are $011, 101, 110, 111$. These are the inputs with
   at least two ones, so
   $Y ↔ ((P ∧ Q) ∨ (P ∧ R) ∨ (Q ∧ R))$.
   Use weights $(1, 1, 1)$ and bias $−1.5$.
4. The positive rows are $001$ and $111$: $P$ and $Q$ agree, and $R = 1$.
   Thus $Y ↔ ((P ↔ Q) ∧ R)$. Use a hidden unit for each positive row:

   $$
   h₁ = step(−P − Q + R − 0.5),
   h₂ = step(P + Q + R − 2.5),
   y = step(h₁ + h₂ − 0.5).
   $$

   The first hidden unit fires only on $001$, and the second only on
   $111$. The output takes their disjunction. One perceptron cannot
   implement this function: on the face $R = 1$, it would have to
   implement XNOR.
