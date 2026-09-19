---
title: Boolean algebra
author: Johannes Korbmacher
locked: false
weight: 40
params:
  id: exc-bool
---

# Relay logic {.solved}

Use default-off and default-on relays to implement these truth-functions:

1. $!!NAND!!$ reverses the output of $!!AND!!$.
2. $!!XOR!!$ outputs $1$ exactly when one input is $1$.
3. $!!XNOR!!$ outputs $1$ exactly when the inputs agree.

Each relay has two inputs: the magnet on the lower left and the signal supply
on the lower right. Its output is at the top. A default-off relay passes the
supply when the magnet is on; a default-on relay passes it when the magnet is
off. Use POWER when a relay needs a constant supply of $1$.

Add relays, connect their ports, and test the resulting function table. To put
branches in parallel, connect their outputs to the same input or lamp. That
connection has power when at least one branch supplies it.

To connect two components, select an output dot, then an input dot. Drag a
component to move it. Select a component or a connected input dot to show its
removal button. The connection controls below the canvas provide the same
operations as buttons; you can also move a focused component with the arrow keys.

{{< logic-app name="boolean" kind="workbench" preset="relays" >}}

## Solution {.solution #relay-logicSolution}

1. Connect $X$ to the magnet of a default-off relay and $Y$ to its supply.
   Its output is $X !!AND!! Y$. Use that output to control a default-on relay
   supplied by POWER. The lamp then shows $!!NOT!! (X !!AND!! Y)$.
2. Use two default-on relays. Connect the first with magnet $X$ and supply
   $Y$, and the second with magnet $Y$ and supply $X$. Join their outputs
   at the lamp. The two parallel branches give:

   $$
   ( (!!NOT!! X) !!AND!! Y ) !!OR!! ( (!!NOT!! Y) !!AND!! X ) = X !!XOR!! Y
   $$

3. Join the two XOR branches at the magnet input of a third default-on relay.
   Supply it with POWER and connect its output to the lamp. This reverses
   XOR, giving $X !!XNOR!! Y$.

# Defining functions {.solved}

A function may have several different implementations. The canvas below
restricts which boxes you can use in each task. You may connect the same signal
to both inputs of a box.

1. Define $!!OR!!$ using only $!!NOT!!$ and $!!AND!!$.
2. Define $!!NOT!!$ using only $!!NAND!!$.
3. Define $!!AND!!$ using only $!!NAND!!$.
4. Define $!!OR!!$ using only $!!NAND!!$.

The aim is to **write a formula** for each function using only the permitted
operations. First build and check a circuit. Then work backward from the output:
replace each box by its operation, with the formulas for its inputs as arguments.
If a wire branches, repeat its formula wherever it is used. Finally, read your
formula from the inside out to reconstruct the circuit.

Write down the four formulas. What do tasks 2–4 tell
us about the truth-functional completeness of $!!NAND!!$?

To connect two components, select an output dot, then an input dot. Drag a
component to move it. Select a component or a connected input dot to show its
removal button. The connection controls below the canvas provide the same
operations as buttons; you can also move a focused component with the arrow keys.

{{< logic-app name="boolean" kind="workbench" preset="definitions" >}}

## Solution {.solution #defining-functionsSolution}

1. $X !!OR!! Y = !!NOT!! ((!!NOT!! X) !!AND!! (!!NOT!! Y))$, by De Morgan and double negation.
2. $!!NOT!! X = X !!NAND!! X$: join $X$ to both inputs of one NAND box.
3. If $A = X !!NAND!! Y$, then $A !!NAND!! A = !!NOT!! A = X !!AND!! Y$.
4. $(X !!NAND!! X) !!NAND!! (Y !!NAND!! Y) = !!NOT!! ((!!NOT!! X) !!AND!! (!!NOT!! Y)) = X !!OR!! Y$.

We can build NOT, AND, and OR from NAND alone. Since these three functions are
jointly complete, NAND alone is truth-functionally complete too.

# Boolean laws {.solved}

Derive the following identities using the laws in the chapter. Name the law
used at each step. For tasks 2 and 3, derive idempotence from the listed laws
rather than assuming it.

1. $X !!AND!! (X !!OR!! Y) = X !!OR!! (X !!AND!! Y)$.
2. $X !!OR!! X = X$.
3. $X !!AND!! X = X$.
4. $(X !!AND!! Y) !!OR!! (X !!AND!! !!NOT!! Y) = X$.
5. $X !!AND!! (!!NOT!! X !!OR!! Y) = X !!AND!! Y$.
6. $!!NOT!! (X !!AND!! (!!NOT!! X !!OR!! Y)) = !!NOT!! X !!OR!! !!NOT!! Y$.

## Solution {.solution #boolean-lawsSolution}

1. Both sides equal $X$ by absorption.

2. Use identity and absorption:

   $$
   X !!OR!! X = X !!OR!! (X !!AND!! 1) = X
   $$

3. Similarly, using the other identity and absorption laws:

   $$
   X !!AND!! X = X !!AND!! (X !!OR!! 0) = X
   $$

4. Factor out $X$ by distributivity, then use complementation and identity:

   $$
   (X !!AND!! Y) !!OR!! (X !!AND!! !!NOT!! Y)
   = X !!AND!! (Y !!OR!! !!NOT!! Y)
   = X !!AND!! 1
   = X
   $$

5. Distribute $X$, then use complementation and identity:

   $$
   X !!AND!! (!!NOT!! X !!OR!! Y)
   = (X !!AND!! !!NOT!! X) !!OR!! (X !!AND!! Y)
   = 0 !!OR!! (X !!AND!! Y)
   = X !!AND!! Y
   $$

6. Substitute the result of task 5 inside the negation, then apply De Morgan:

   $$
   !!NOT!! (X !!AND!! (!!NOT!! X !!OR!! Y))
   = !!NOT!! (X !!AND!! Y)
   = !!NOT!! X !!OR!! !!NOT!! Y
   $$

# Addition {.solved}

Use Boolean calculations to verify $5 + 7 = 12$.

1. Write $5$ and $7$ as three-bit binary numbers.
2. Starting at the rightmost column, calculate the sum and carry using
   $S = (X !!XOR!! Y) !!XOR!! C$ and
   $D = (X !!AND!! Y) !!OR!! (C !!AND!! (X !!XOR!! Y))$.
   The first incoming carry is $0$. Show the calculation for each column.
3. Convert your result back to decimal.

Once you've finished, open the circuit and enter your two summands to check
both the answer and the carries.

<details class="boolean-checker">
<summary>Check with a three-bit adder</summary>

{{< logic-app name="boolean" kind="ripple-adder" bits="3" >}}

</details>

## Solution {.solution #additionSolution}

The summands are $(101)₂ = 5$ and $(111)₂ = 7$.

| Position | $X$ | $Y$ | Incoming $C$ | Sum $S$ | Outgoing $D$ |
| --- | --- | --- | --- | --- | --- |
| $0$ | $1$ | $1$ | $0$ | $0$ | $1$ |
| $1$ | $0$ | $1$ | $1$ | $0$ | $1$ |
| $2$ | $1$ | $1$ | $1$ | $1$ | $1$ |

For example, in position $1$:

$$
S = (0 !!XOR!! 1) !!XOR!! 1 = 1 !!XOR!! 1 = 0
D = (0 !!AND!! 1) !!OR!! (1 !!AND!! (0 !!XOR!! 1)) = 0 !!OR!! 1 = 1
$$

Keep the final carry as position $3$. The answer is $(1100)₂ = 8 + 4 = 12$.

# Circuit construction {.solved}

Now build more complex functions using **only NAND**. The constructions from
“Defining functions” will be useful, but here every blue box must be a NAND box.

1. Implement $!!NOR!!$, the negation of $!!OR!!$.
2. Implement $!!XOR!!$ with four NAND boxes.
3. Implement $!!XNOR!!$ with five NAND boxes.
4. Could you instead implement $!!OR!!$ with XOR boxes alone? Explain your answer.

To connect two components, select an output dot, then an input dot. Drag a
component to move it. Select a component or a connected input dot to show its
removal button. The connection controls below the canvas provide the same
operations as buttons; you can also move a focused component with the arrow keys.

{{< logic-app name="boolean" kind="workbench" preset="nand-circuits" >}}

## Solution {.solution #circuit-constructionSolution}

1. Build $A = (X !!NAND!! X) !!NAND!! (Y !!NAND!! Y)$, then connect $A$ to both
   inputs of another NAND box. Since $A = X !!OR!! Y$, this gives NOR.
2. Let $N = X !!NAND!! Y$, $P = X !!NAND!! N$, and $Q = Y !!NAND!! N$.
   Then $P !!NAND!! Q = X !!XOR!! Y$.
3. Connect the XOR output from task 2 to both inputs of one more NAND box.
4. An XOR-only circuit computes a parity of its input occurrences. Repeated
   occurrences cancel because $X !!XOR!! X = 0$. With inputs $X$ and $Y$, it
   can produce only $0$, $X$, $Y$, or $X !!XOR!! Y$. None is OR. Even allowing
   a constant $1$ adds only their complements, which still exclude OR.

# Models {.solved}

A pixel in the [RGB color model](https://en.wikipedia.org/wiki/RGB_color_model)
combines red, green, and blue light. Consider a simplified pixel whose three
channels can each be fully on or fully off. Let $RED$, $GREEN$, and $BLUE$
express that the respective channel is on.

1. List all valuations of this language. What color does each represent?
   Use the pixel below to check your list, recording each valuation once.
2. Suppose we describe two pixels with variables $RED₁$, $GREEN₁$, $BLUE₁$,
   $RED₂$, $GREEN₂$, and $BLUE₂$. How many valuations are there now? Explain
   without listing them all.
3. How many valuations describe a 3840×2160-pixel screen in this simplified
   language? Give an exact expression; you needn't expand it in decimal.
4. An ordinary RGB pixel has 256 intensities per channel. Which distinctions
   between actual colors does our simplified language leave out?

{{< logic-app name="boolean" kind="models" preset="rgb" >}}

## Solution {#modelsSolution .solution}

1. There are $2³ = 8$ valuations:

   | $v(RED)$ | $v(GREEN)$ | $v(BLUE)$ | Color |
   | --- | --- | --- | --- |
   | $1$ | $1$ | $1$ | White |
   | $1$ | $1$ | $0$ | Yellow |
   | $1$ | $0$ | $1$ | Magenta |
   | $1$ | $0$ | $0$ | Red |
   | $0$ | $1$ | $1$ | Cyan |
   | $0$ | $1$ | $0$ | Green |
   | $0$ | $0$ | $1$ | Blue |
   | $0$ | $0$ | $0$ | Black |

2. Each of the eight first-pixel valuations combines with any of the eight
   second-pixel valuations: $8 × 8 = 64 = 2⁶$.
3. There are $3 × 3840 × 2160 = 24,883,200$ propositional variables,
   so $2²⁴⁸⁸³²⁰⁰$ valuations.
4. Our variables distinguish only on from off. They cannot express intermediate
   intensities or distinguish two shades with the same on/off description.
   The granularity of the language determines the granularity of these models.

# Following an evaluation {.solved}

For each case, **draw the parsing tree and evaluate it on paper first**. Write
the assigned values at the leaves, then work toward the root. Mark one base
case and one recursive step in each calculation.

1. $SUN ∨ (RAIN ∧ ¬SUN)$, with $v(SUN) = 0$ and $v(RAIN) = 1$.
2. $¬(SUN ∨ RAIN)$, with $v(SUN) = v(RAIN) = 0$.
3. $(SUN ∨ RAIN) ∧ ¬(SUN ∧ RAIN)$, with $v(SUN) = v(RAIN) = 1$.
4. $(SUN ∧ WIND) ∨ RAIN$, with $v(SUN) = 1$, $v(WIND) = v(RAIN) = 0$.

Then open the evaluator and choose the corresponding example to check each
step. Under “Your formula”, try a formula and valuation of your own.

<details class="boolean-checker">
<summary>Check the evaluations</summary>

{{< logic-app name="boolean" kind="evaluation" preset="practice" >}}

</details>

## Solution {.solution #following-an-evaluationSolution}

1. $!!NOT!! 0 = 1$, then $1 !!AND!! 1 = 1$, and finally $0 !!OR!! 1 = 1$.
2. $0 !!OR!! 0 = 0$, then $!!NOT!! 0 = 1$.
3. The two children of the root have values $1 !!OR!! 1 = 1$ and
   $!!NOT!! (1 !!AND!! 1) = 0$. Their conjunction has value $0$.
4. $1 !!AND!! 0 = 0$, then $0 !!OR!! 0 = 0$.

Reading a variable's value is a base case. Applying a truth-function to the
values returned by its children is a recursive step.

# Finding countermodels {.solved}

For each inference, select **all and only** the worlds with true premises and
a false conclusion. Check your selection, then explain why those worlds refute
the inference.

{{< logic-app name="boolean" kind="model-exercise" >}}

## Solution {.solution #finding-countermodelsSolution}

The countermodel sets are ${M₁}$, ${M₃}$, and ${M₂}$, respectively. In the
first task, $v₁(SUN) = v₁(RAIN) = 1$: both premises are true, while $¬RAIN$
is false. One countermodel already suffices to show invalidity.

# Deductive inference {.solved}

{{< inference layout="stacked" >}}
Little Jimmy is not both at school and not at home.
Little Jimmy is not at home.
---
Little Jimmy is at school.
{{< /inference >}}

1. Translate the inference into a suitable formal language.
2. Determine whether the formal inference is valid using Boolean logic.

## Solution {#deductive-inferenceSolution .solution}

1. Use $SCHOOL$ for “Jimmy is at school” and $HOME$ for “Jimmy is at home”:

   {{< inference layout="stacked" >}}
   $¬(SCHOOL ∧ ¬HOME)$
   $¬HOME$
   ---
   $SCHOOL$
   {{< /inference >}}

2. Apply $v(¬HOME) = !!NOT!! v(HOME)$ and
   $v(¬(SCHOOL ∧ ¬HOME)) = !!NOT!! (v(SCHOOL) !!AND!! (!!NOT!! v(HOME)))$:

   | Valuation | $SCHOOL$ | $HOME$ | $¬(SCHOOL ∧ ¬HOME)$ | $¬HOME$ |
   | --- | --- | --- | --- | --- |
   | $v₁$ | $1$ | $1$ | $1$ | $0$ |
   | $v₂$ | $1$ | $0$ | $0$ | $1$ |
   | $v₃$ | $0$ | $1$ | $1$ | $0$ |
   | $v₄$ | $0$ | $0$ | $1$ | $1$ |

   Both premises are true at $v₄$, while the conclusion $SCHOOL$ is false.
   Thus $v₄$ is a countermodel: Jimmy could be neither at school nor at home.

   $$
   [¬(SCHOOL ∧ ¬HOME)] ∩ [¬HOME] = {v₄} ⊈ {v₁, v₂} = [SCHOOL]
   ¬(SCHOOL ∧ ¬HOME), ¬HOME ⊭ SCHOOL
   $$

# Models with 3 Atoms {.solved #adding-wind}

Now use $SUN$, $RAIN$, and $WIND$. The eight pictured worlds cover all
combinations. Select the propositions requested in the first two tasks, then
find all countermodels for the next two inferences. Explain why adding the
third atom doubles the number of worlds.

{{< logic-app name="boolean" kind="model-exercise" variables="3" >}}

## Solution {.solution #adding-windSolution}

1. $[SUN ∧ WIND] = {M₁, M₃}$.
2. $[RAIN ∨ ¬WIND] = {M₁, M₂, M₄, M₅, M₆, M₈}$.
3. Only $M₅$ has true premises and a false conclusion.
4. Both $M₁$ and $M₃$ are countermodels.

Every assignment to $SUN$ and $RAIN$ extends in two ways: with $v(WIND) = 0$
or with $v(WIND) = 1$. Thus there are $4 × 2 = 8$ worlds.

# Testing your own inferences {.solved}

Write premises on separate lines and put $∴$ before the conclusion. You may
use $SUN$, $RAIN$, and $WIND$.

1. Write an invalid inference with exactly two countermodels. Select them and check.
2. Write a valid inference. Which worlds should you select as countermodels?
3. Make the premises inconsistent, for example by including both $SUN$ and
   $¬SUN$. Can any conclusion have a countermodel now? Explain.

{{< logic-app name="boolean" kind="model-exercise" variables="3" preset="custom" >}}

## Solution {.solution #testing-your-own-inferencesSolution}

1. For example, $SUN ∨ RAIN, SUN ∴ ¬RAIN$ has countermodels $M₁$ and $M₂$.
   Both are sunny and rainy, differing only on wind.
2. For example, $SUN ∨ RAIN, ¬SUN ∴ RAIN$ is valid. Select no worlds.
3. No valuation satisfies both $SUN$ and $¬SUN$. There can be no world with
   true premises and a false conclusion, regardless of the conclusion.

# Logical laws {.solved}

So far, we've tested particular inferences. Now show that **every** instance
of disjunctive syllogism is valid, whatever formulas $A$ and $B$ stand for:

$$
A ∨ B, ¬A ∴ B
$$

1. Let $v$ be any valuation in $[A ∨ B] ∩ [¬A]$. Use the definitions of
   intersection and $[C] = {v : v(C) = 1}$ to state the values of $A ∨ B$ and $¬A$.
2. Apply the Boolean evaluation clauses to obtain two equations involving
   $v(A)$ and $v(B)$.
3. Determine $v(A)$, then $v(B)$. Explain why this establishes
   $[A ∨ B] ∩ [¬A] ⊆ [B]$.

## Solution {.solution #logical-lawsSolution}

1. $v(A ∨ B) = 1$ and $v(¬A) = 1$.
2. $v(A) !!OR!! v(B) = 1$ and $!!NOT!! v(A) = 1$.
3. The second equation forces $v(A) = 0$. The first becomes
   $0 !!OR!! v(B) = 1$, which forces $v(B) = 1$. Thus $v ∈ [B]$.
   Since $v$ was any member of the intersection, every such member belongs
   to $[B]$. This proves the required subset relation.
