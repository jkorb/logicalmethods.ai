---
title: Boolean algebra
author: Johannes Korbmacher
locked: false
weight: 40
params:
  date: "13/09/2024"
  last_edited: "17/09/2026"
  id: txt-bool
---

# Boolean algebra

{{< img src="/img/drawings/bool_low_level.svg" class="rounded  float-end inert-img img-fluid mx-3" width="300px">}}
Boolean algebra – the logic of 0's and 1's – is the foundation of all modern
computer systems, and by extension *all* AI systems. The study of Boolean logic
has its roots in the work of [George
Boole](https://en.wikipedia.org/wiki/George_Boole) from the mid-19th century.
But it wasn't until AI pioneer [Claude
Shannon](https://en.wikipedia.org/wiki/Claude_Shannon) connected the theory to
the basic workings of electronic circuits that the importance of Boolean
algebra for the development of information technologies became apparent. While
Shannon was investigating [relays](https://en.wikipedia.org/wiki/Relay) –
essentially electronically operated switches – and not
[semiconductors](https://en.wikipedia.org/wiki/Semiconductor), which are the
actual technology used to implement computers today, the fundamental principles
are the same. Boolean algebra is the logic of low-level computing, and the way
that computers add, subtract, multiply, etc. is ultimately grounded in Boolean
logic.

But the importance of Boolean algebra to AI is not restricted to the low level.
Propositional reasoning on all levels follows the laws of Boolean algebra.
[Conditionals](https://en.wikipedia.org/wiki/Conditional_(computer_programming))
in most programming languages, such as C, Python, or Java, rely on Boolean
connectives:

```python
if num % 2 == 0 and not num < 10:
    num += 1
```

Here `num` is an integer. The condition combines two tests with `and` and `not`.
To write good conditionals and understand code that others have written, you
need a solid understanding of Boolean logic.

Even on the highest level, deductive reasoning with propositional information stored in
{{<abbr title="knowledge bases">}}KBs{{</abbr>}} follows the laws of Boolean
algebra:

{{< img src="/img/drawings/bool_mp_kb.svg" class="rounded mx-auto d-block inert-img img-fluid my-4" width="400px">}}

{{< callout type="objectives" >}}
After studying this chapter, you will be able to:

- Explain the basic ideas of Boolean algebra and their role in computing.
- Use Boolean laws to reason about Boolean functions and circuits.
- Explain and implement binary addition using Boolean circuits.
- Use Boolean models to assess propositional inferences.

{{< /callout >}}


## Boolean values

{{< callout type="definition" title="Boolean values" >}}
The {{< term "boolean-value" "Boolean values" >}} are $1$ and $0$.
{{< /callout >}}

The Boolean values have many different possible interpretations: true and
false, on and off, yes and no, … But in logic, the true/false interpretation is
the most common. According to this interpretation, the Boolean values are {{<
term "truth-value" "truth-values" >}}, which we can use to represent facts in a
model.

For example, if $SUN$ expresses that the sun is shining,
assigning $1$ to $SUN$ means that it is sunny, and assigning $0$
means that it is not.


| World | Description | Boolean model |
| --- | --- | --- |
| {{< img inline=true src="/img/drawings/sun.svg" height="48px" alt="Sunshine" >}} | The sun is shining | $SUN$ $↦$ 1 |
| {{< img inline=true src="/img/drawings/no_sun.svg" height="48px" alt="No sunshine" >}} | The sun isn't shining | $SUN$ $↦$  0 |

In Boolean logic, we typically assume that the Boolean values are the _only_
truth values:

{{< callout type="note" title="Modelling assumptions: bivalence" >}}
{{< term "bivalence" "Bivalence" >}} is the assumption that every sentence is
either true or false and never both.
{{< /callout >}}

This is one of the central assumptions of
{{< term "classical-logic" "classical logic" >}}. It is an _idealization_, not
an obvious fact. Future events, borderline cases, and some quantum phenomena
challenge the assumption that every statement is either true or false.

## Boolean functions

{{< callout type="definition" title="Boolean function" >}}
A {{< term "boolean-function" "Boolean function" >}} is a function that
takes a fixed number of Boolean values as inputs and returns one Boolean value
as the output.
{{< /callout >}}

We'll begin by studying the Boolean functions $!!NOT!!$, $!!AND!!$, and
$!!OR!!$, the functions most often used as the basis for propositional logic.
Computer circuits, though, often use other Boolean functions such as $!!NAND!!$
and $!!XOR!!$ as their basis, which we'll encounter below.

Our Boolean functions are given by the following function tables. For
$!!NOT!!$, which has only one input, just read the table from left (input) to
right (output). For the binary functions $!!AND!!$ and $!!OR!!$, look up the
first input in the left-hand column and the second input in the top row. Where
their row and column meet, you find the output.

<div class="function-tables">

{{< function-table name="NOT" >}}
{"rows": ["0", "1"], "columns": [""], "values": [[1], [0]]}
{{< /function-table >}}

{{< function-table name="AND" >}}
{"rows": ["0", "1"], "columns": ["0", "1"], "values": [[0, 0], [0, 1]]}
{{< /function-table >}}

{{< function-table name="OR" >}}
{"rows": ["0", "1"], "columns": ["0", "1"], "values": [[0, 1], [1, 1]]}
{{< /function-table >}}

</div>

So, for example: $$!!NOT!! 0 = 1$$
$$1 !!OR!! 0 = 1$$

Our three functions have an important property:

{{< callout type="definition" title="Truth-functional completeness" >}}
The Boolean functions $!!NOT!!$, $!!AND!!$, and $!!OR!!$ are sufficient to
express every Boolean function with one or more inputs. This mathematical fact
is known as the joint
{{< term "functional-completeness" "truth-functional completeness" >}} of these
operators.
{{< /callout >}}

$!!NOT!!$, $!!AND!!$, and $!!OR!!$ are not the only collection of functions
with this property, not even the smallest one. But especially in logical
contexts, they are the most commonly used ones, since they let us describe
many important concepts and algorithms with relative ease.

## Implementing Booleans

Today we normally implement Boolean functions using
[semiconductors](https://en.wikipedia.org/wiki/Semiconductor), typically
[MOSFETs](https://en.wikipedia.org/wiki/MOSFET): tiny electronic devices that
can act as non-mechanical "switches" by virtue of how they conduct electricity.
But to understand the basic ideas of implementing Booleans, we don't need to go
into semiconductor physics. It's easier to look at an older, mechanical
implementation using **relay switches**, which Shannon studied in his [master's
thesis](https://en.wikipedia.org/wiki/A_Symbolic_Analysis_of_Relay_and_Switching_Circuits)
showing their relation to logic. The physical mechanisms differ between
semiconductors and relays, but the underlying Boolean principles are the same.

A [relay](https://en.wikipedia.org/wiki/Relay) is a mechanical
[ferromagnetic](https://en.wikipedia.org/wiki/Ferromagnetism) switch operated
by an [electromagnet](https://en.wikipedia.org/wiki/Electromagnet). A relay has
two inputs: one that powers the magnet, and another that supplies a signal
that the switch can pass on to the output. When the magnet receives power, it
attracts the (ferromagnetic) switch, thereby either opening or closing the
connection to the output, depending on the configuration of the relay. There
are two basic configurations:

+ A **default off** relay has an open contact when its magnet is off. Powering
the magnet closes the contact, allowing the signal through. Try both switches
to see how $X$ controls the magnet and $Y$ supplies the signal.

  {{< logic-app name="boolean" kind="circuit" preset="relay-off" >}}

+ A **default on** relay works in the opposite way. Its contact conducts when
  the magnet is off and opens when the magnet receives power. Try for yourself:

  {{< logic-app name="boolean" kind="circuit" preset="relay-on" >}}

When we're describing relays like this, we make some assumptions:
{{< callout type="note" title="Modelling assumptions: ideal circuits" >}}
We ignore delays, resistance, and contact bounce.
{{< /callout >}}
This is an _idealization_: [electronics
engineering](https://en.wikipedia.org/wiki/Electronics_engineering) rarely
deals with crisp 0/1 values.

To implement $!!NOT!!$, connect constant power to the signal input of a default
on relay. If $X$ is off, the contact is closed and the lamp is on. Powering $X$
opens the contact and turns the lamp off. That's precisely the behavior of
$!!NOT!!$.

For $!!AND!!$, use a default off relay instead, with $X$ controlling the magnet
and $Y$ supplying the signal. The lamp is on only if the contact is closed
**and** the signal receives power: both inputs must be on.

For $!!OR!!$, put two default off relays in parallel, each with a constant
power supply. One is controlled by $X$, the other by $Y$. Either closed contact
can supply power to the lamp. If both are closed, the lamp is still on.

Check out the implementations in the following diagram:

{{< logic-app name="boolean" kind="circuit" preset="implementations" >}}

Compare the three circuits with their function tables. The exercises leave
you some more functions to implement.

## Boolean laws

{{< img src="/img/drawings/bool_laws_of_logic.svg" class="rounded  float-end inert-img img-fluid mx-3" width="300px">}}

The behavior of the Boolean functions is governed by a series of {{< term
"boolean-identity" "algebraic laws" >}}, that is, _identities_ describing their
interaction. These identities are formulated using **Boolean variables**
$X,Y,…$, which can take arbitrary values from the set ${0, 1}$.

{{< callout type="definition" title="Boolean laws" >}}
A Boolean law is an equation between expressions built from Boolean variables,
the values $0$ and $1$, and Boolean functions, which holds for every assignment
of Boolean values to its variables.
{{< /callout >}}

Take, for example, the *Boolean equation*:

$$
(X !!AND!! Y) = (Y !!AND!! X)
$$

This equation says that for any pair of values $X,Y$ from ${0, 1}$, the result
of applying $!!AND!!$ with $X$ as the first input and $Y$ as the second is the
same as applying $!!AND!!$ with $Y$ as the first input and $X$ as the second.

You can verify this law by inspecting the function table for $!!AND!!$ and
going through all possible values for $X$ and $Y$. Here are the corresponding
calculations:

<div class="text-center my-4">

$(0 !!AND!! 0) &nbsp; = &nbsp; (0 !!AND!! 0)$

$(0 !!AND!! 1) = 0 = (1 !!AND!! 0)$

$(1 !!AND!! 0) = 0 = (0 !!AND!! 1)$

$(1 !!AND!! 1) &nbsp; = &nbsp; (1 !!AND!! 1)$

</div>

Only the second and third lines are "interesting" calculations; the first and
last are "trivial".

This law is called the law of $Commutativity$ for $!!AND!!$, which states that
for $!!AND!!$, the order of its inputs doesn't matter. Many laws of Boolean
algebra have such names.

Here are the most important laws and their names:

| Law | Identities |
| --- | --- |
| Associativity | $X !!OR!! (Y !!OR!! Z) = (X !!OR!! Y) !!OR!! Z$<br>$X !!AND!! (Y !!AND!! Z) = (X !!AND!! Y) !!AND!! Z$ |
| Commutativity | $X !!OR!! Y = Y !!OR!! X$<br>$X !!AND!! Y = Y !!AND!! X$ |
| Absorption | $X !!OR!! (X !!AND!! Y) = X$<br>$X !!AND!! (X !!OR!! Y) = X$ |
| Distributivity | $X !!OR!! (Y !!AND!! Z) = (X !!OR!! Y) !!AND!! (X !!OR!! Z)$<br>$X !!AND!! (Y !!OR!! Z) = (X !!AND!! Y) !!OR!! (X !!AND!! Z)$ |
| Complementation | $X !!OR!! !!NOT!! X = 1$<br>$X !!AND!! !!NOT!! X = 0$ |
| Identity | $X !!OR!! 0 = X$<br>$X !!AND!! 1 = X$ |
| Domination | $X !!AND!! 0 = 0$<br>$X !!OR!! 1 = 1$ |

You can (and should!) verify all these laws, just like we did for
$Commutativity$. Knowing them can be incredibly helpful in showing facts about
Boolean algebras.

In particular, you can use these laws to derive other laws in an algebraic way,
that is by manipulating equations. For example, you can derive the following
important family of laws known as the {{< term "de-morgan-laws" "De Morgan laws" >}},
and the law of double negation:

| Law | Identities |
| --- | --- |
| De Morgan | $!!NOT!! (X !!OR!! Y) = (!!NOT!! X) !!AND!! (!!NOT!! Y)$<br>$!!NOT!! (X !!AND!! Y) = (!!NOT!! X) !!OR!! (!!NOT!! Y)$ |
| Double negation | $!!NOT!! !!NOT!! X = X$ |

An identity says that two expressions always have the same value. We may
therefore replace either expression with the other, including inside a larger
expression. For example, $X !!OR!! !!NOT!! X = 1$ lets us replace the bracketed
part in $Y !!AND!! (X !!OR!! !!NOT!! X)$ by $1$, giving $Y !!AND!! 1$.
We can also use an identity from right to left.

To derive double negation, first transform $!!NOT!! !!NOT!! X$ into
$(!!NOT!! !!NOT!! X) !!AND!! X$. Then transform $X$ into the same expression.
Each step below names the law that justifies the transformation. You can go
back a step to compare the two expressions.

{{< logic-app name="boolean" kind="derivation" >}}

The key equalities are:

$$
!!NOT!! !!NOT!! X = ( !!NOT!! !!NOT!! X ) !!AND!! X
X = X !!AND!! ( !!NOT!! !!NOT!! X )
$$

Commutativity identifies the right-hand sides, so $!!NOT!! !!NOT!! X = X$.

This derivation may seem a bit tedious – especially since we can prove the fact
that $!!NOT!! !!NOT!! X = X$ by simply inspecting
the function tables: $!!NOT!! !!NOT!! 1 = 1$ and $!!NOT!! !!NOT!! 0 = 0$.

But there are also questions where the laws are much more efficient at giving
you the answer than inspecting the tables. Take, for example, the Boolean
expression:

  $$
  X !!AND!! ((Y !!AND!! Z) !!OR!! !!NOT!! (Y !!AND!! Z))
  $$

It turns out that this expression reduces to simply
$X$. To see this by truth-table inspection, we
need to go through $2³&nbsp;=&nbsp;8$ different
combinations of truth-values for $X, Y, Z$ and evaluate the expression for
each combination. That's a lot of calculations.

Using the laws of Boolean algebra, however, we can recognize that

  $$
  ((Y !!AND!! Z) !!OR!! !!NOT!! (Y !!AND!! Z))
  $$

  is of the form

  $$
  [something] !!OR!! !!NOT!! [something],
  $$

where $[something] = (Y !!AND!! Z)$. So, by
$"Complementation"$, we can reduce

  $$
  X !!AND!! ((Y !!AND!! Z) !!OR!! !!NOT!! (Y !!AND!! Z))
  $$

down to

  $$
  X !!AND!! 1,
  $$

which by $"Identity"$ is just $X$.

{{< img src="/img/drawings/ai_tools.svg" class="rounded  float-end inert-img img-fluid mx-3" width="100px">}}
The derivation also illustrates an important point: the above laws of Boolean
algebra allow us to derive further laws that don't look like they're covered by
the initial list. In fact, we can derive _all_ valid identities of Boolean
algebra from these laws. The list of laws is **complete** in this sense. Having
a complete list of laws for a subject matter is an incredible feat: _every
valid Boolean identity follows from these laws_. And as the example of
$$X !!AND!! ((Y !!AND!! Z) !!OR!! !!NOT!! (Y !!AND!! Z))$$
shows, this can be a handy tool in the toolbox of any AI researcher.

There are other complete collections of laws, including collections with just
one identity. For example, McCune and colleagues proved that the following
single equation axiomatizes Boolean algebra using $!!NOT!!$ and $!!OR!!$.
Their proof used automated deduction – an application of AI to logic itself.
See [*Short Single Axioms for Boolean Algebra* (PDF)](https://www.cs.unm.edu/~mccune/papers/basax/v12.pdf), equation DN1.

$$
!!NOT!! (!!NOT!! (!!NOT!! (X !!OR!! Y) !!OR!! Z) !!OR!! !!NOT!! (X !!OR!! !!NOT!! (!!NOT!! Z !!OR!! !!NOT!! (Z !!OR!! U)))) = Z
$$

But that's a story for another day.

## Adders

{{< img src="/img/drawings/bool_ai_calculating.svg" class="float-end inert-img img-fluid mx-3" width="250px" >}}
To illustrate the usefulness of Boolean algebra, let's look at how a computer
adds numbers. The algorithm is closely related to the one you already know:
write the numbers underneath one another, add a column, and carry over when
necessary. The difference is that we have only two digits to work with.

First, we need to see how those two digits can represent numbers larger than one.
In ordinary decimal notation, the position of a digit tells us whether it counts
ones, tens, hundreds, and so on. For example, $13$ means one ten and three ones.
In binary notation, the places count ones, twos, fours, eights, and so on:
each place is worth **twice** the one to its right.

So the binary string $1101$ means one eight, one four, no twos, and one one.
Adding those contributions gives us $13$:

$$ (1 × 2³) + (1 × 2²) + (0 × 2¹) + (1 × 2⁰) $$
$$ = $$
$$ 8 + 4 + 0 + 1 = 13$$

The digits $0$ and $1$ are called **bits**, short for “binary digits”. We'll
number their positions from right to left, starting at $0$. So position $0$
is the rightmost position, position $1$ is the next one, and so on:

{{< annotated-math separator=" " title="Bits of 1101, labelled by position" >}}
[
  {"symbols":"…", "label":"…"},
  {"symbols":"1", "label":"3-position"},
  {"symbols":"1", "label":"2-position"},
  {"symbols":"0", "label":"1-position"},
  {"symbols":"1", "label":"0-position"}
]
{{< /annotated-math >}}

{{< callout type="definition" title="Bits and binary representation" >}}
A {{< term "bit" "bit" >}} is a binary digit, $0$ or $1$.
In {{< term "binary-representation" "binary representation" >}}, the bit in
position $n$ counts $2ⁿ$s. For example, position $0$ counts $2⁰ = 1$s and
position $3$ counts $2³ = 8$s.
{{< /callout >}}

We sometimes add a subscript $2$ to avoid confusing binary and decimal notation:
$(1101)₂ = 13$. With just two bits, we can represent the numbers from zero to three:

| Decimal | Binary |
| --- | --- |
| $0$ | $00$ |
| $1$ | $01$ |
| $2$ | $10$ |
| $3$ | $11$ |

Now for addition. In decimal notation, if a column adds up to ten, you write
$0$ and carry $1$ to the next column. In binary, you do that as soon as the
column adds up to **two**. That's because the next column counts twos, rather
than tens. Thus $1 + 1$ gives a written digit $0$ and a carry $1$: the binary
number $10$.

Here's our example, thirteen plus nine, written in columns:

{{< column-addition top="1101" bottom="1001" result="10110" carries="1  1 " >}}

The small red $1$s beside the second summand are the carries into those
columns. We leave the place blank when there is no carry.

Start on the right. The two $1$s make two, so write $0$ and carry $1$.
In the next column, we have $0 + 0$, **plus the carried $1$**, giving $1$.
The next column gives $1 + 0 = 1$. Finally, the leftmost column gives
$1 + 1$: write $0$ and carry $1$ into a new column. Reading the result from
left to right gives $10110$, which is $16 + 4 + 2 = 22$.

What does this have to do with Boolean algebra? Take just the rightmost column.
It has two input bits, which we'll call $X$ and $Y$. We need two outputs:
the digit to write down and the carry to pass to the next column.

The digit is $1$ if exactly one input is $1$. If both inputs are $0$, we write
$0$; if both are $1$, we also write $0$, but now with a carry. The function
for the written digit is {{< term "exclusive-or" "exclusive or" >}}, or $!!XOR!!$.
The carry is $1$ only when both inputs are $1$, so its function is $!!AND!!$.
Here are their tables:

<div class="function-tables">

{{< function-table name="XOR" >}}
{"rows": ["0", "1"], "columns": ["0", "1"], "values": [[0, 1], [1, 0]]}
{{< /function-table >}}

{{< function-table name="AND" >}}
{"rows": ["0", "1"], "columns": ["0", "1"], "values": [[0, 0], [0, 1]]}
{{< /function-table >}}

</div>

Writing $SUM(X, Y)$ for the written digit and $CARRY(X, Y)$ for the carry:

$$
SUM(X, Y) = X !!XOR!! Y
CARRY(X, Y) = X !!AND!! Y
$$

{{< callout type="definition" title="Half adder" >}}
An {{< term "adder" "adder" >}} is a circuit that adds binary numbers.
A {{< term "half-adder" "half adder" >}} adds two bits. It outputs the digit
to write in the current column and the carry for the next column.
{{< /callout >}}

{{< img src="/img/drawings/bool_ai_half_adder.svg" class="float-start inert-img img-fluid mx-3" width="100px" >}}
We can implement this with two blue boxes, one for $!!XOR!!$ and one for
$!!AND!!$. Each takes the same two inputs, but calculates a different output.
Try $X = Y = 1$: the sum lamp is off and the carry lamp is on. This is the
$10$ that we need when we add one and one.

{{< logic-app name="boolean" kind="circuit" preset="half" >}}

The next column of our example has an extra input: the carry from the first
column. So now we must add **three** bits. There are four possibilities:

| Number of 1s | Binary total | Write | Carry |
| --- | --- | --- | --- |
| None | $00$ | $0$ | $0$ |
| One | $01$ | $1$ | $0$ |
| Two | $10$ | $0$ | $1$ |
| Three | $11$ | $1$ | $1$ |

The last row is the only new case: $1 + 1 + 1$ is three, or $11$ in binary.
We write $1$ in this column and carry $1$ into the next.

{{< callout type="definition" title="Full adder" >}}
A {{< term "full-adder" "full adder" >}} adds two bits **and an incoming carry**.
Like a half adder, it outputs a digit for the current column and a carry for
the next column.
{{< /callout >}}

Let's call the two bits $X$ and $Y$, and the incoming carry $C$. To calculate
the written digit, first combine $X$ and $Y$ with $!!XOR!!$, then combine that
result with $C$ using another $!!XOR!!$. This gives $1$ when there is either
one $1$ or three $1$s among the inputs:

$$
SUM(X, Y, C) = (X !!XOR!! Y) !!XOR!! C
$$

For the carry, either $X$ and $Y$ already supply two $1$s, or exactly one of
them is $1$ and $C$ supplies the other. These are the two ways of making a carry:

$$
CARRY(X, Y, C) = (X !!AND!! Y) !!OR!! (C !!AND!! (X !!XOR!! Y))
$$

Here is the implementation. Each gate has two input contacts at the bottom
and one output at the top. A dot marks a connection; a small bridge means that
two wires cross without connecting.

{{< logic-app name="boolean" kind="circuit" preset="full" >}}

You can also see two half adders in this circuit: the first adds $X$ and $Y$;
the second adds the first sum to $C$. An $!!OR!!$ gate combines their carries:

{{< img src="/img/drawings/bool_ai_two_half.svg" class="mx-auto d-block inert-img img-fluid my-4" width="600px" alt="Two half adders supply the stages of a full adder." >}}

Finally, we connect full adders to perform a whole addition. Each column gets
one adder, and its carry goes into the adder for the next column. The first
column receives no incoming carry, so we give it $0$.

Let's keep the circuit small and add two-bit numbers: $00$, $01$, $10$, and
$11$. For example, adding $11$ and $01$ means adding three and one. On the
right, $1 + 1$ gives $0$ with a carry. On the left, $1 + 0$ plus that carry
again gives $0$ with a carry. The result is $100$, or four. We need a third
output bit to keep that final carry.

The two full adders below carry out exactly this algorithm. Change the four
input switches to add different numbers. When your inputs are ready, press
“Record this sum” to fill that cell of the table. Can you complete all sixteen
cells? The column calculation uses the same red carry notation as above.
“Decimal table” changes only the table’s notation, so you can compare the
binary additions with familiar decimal sums.

{{< logic-app name="boolean" kind="two-bit" >}}

With four adders we could perform our original $1101 + 1001$
calculation in exactly the same way. More generally, adding two
$k$-bit numbers may require $k + 1$ bits for the answer. If we
throw away the final carry, we lose that part of the result. The
circuit-building exercises let you try implementing other Boolean
functions from the same simple components.


## Boolean models

So far, we've used Boolean algebra to describe circuits and arithmetic. But as
we noted at the start, its importance goes well beyond low-level computing:
it also describes reasoning with propositional information. Let's see how the
Boolean functions connect our formulas to the logical spaces and propositions
from {{< chapter_ref chapter="valid-inference" >}}Valid inference{{< /chapter_ref >}}.

{{< img src="/img/drawings/bool_ai_key.svg" class="mx-auto d-block inert-img img-fluid my-4" width="600px" >}}

Suppose we want to reason about the weather. As before, let $SUN$ say that it
is sunny and $RAIN$ that it is raining. From a logical perspective, we have
four relevant possibilities: sunny and rainy, sunny but not rainy, rainy but
not sunny, and neither.

We want to describe these possibilities using Boolean values. To say that it
is sunny, we assign $1$ to $SUN$; to say that it is not sunny, we assign $0$:

| Situation | Assignment |
| --- | --- |
| {{< img inline=true src="/img/drawings/sun.svg" height="48px" alt="Sunshine" >}} | $v(SUN) = 1$ |
| {{< img inline=true src="/img/drawings/no_sun.svg" height="48px" alt="No sunshine" >}} | $v(SUN) = 0$ |

The letter $v$ names the assignment. The notation $v(SUN)$ means “the value
that $v$ assigns to $SUN$”. Notice the difference: $SUN$ is a formula,
whereas $v(SUN)$ is its truth-value under this assignment.

We do the same for rain:

| Situation | Assignment |
| --- | --- |
| {{< img inline=true src="/img/drawings/rain.svg" height="48px" alt="Rain" >}} | $v(RAIN) = 1$ |
| {{< img inline=true src="/img/drawings/no_rain.svg" height="48px" alt="No rain" >}} | $v(RAIN) = 0$ |

Now combine the choices. An assignment with $v(SUN) = 1$ and $v(RAIN) = 0$
describes a sunny situation without rain. An assignment with both values $1$
describes sunshine and rain together. Different assignments describe different
reasoning situations.

{{< callout type="definition" title="Boolean valuation" >}}
A {{< term "valuation" "Boolean valuation" >}} for a propositional language is
a function that assigns precisely one Boolean value to every propositional
variable of the language.
{{< /callout >}}

When we discuss several valuations at once, we give them subscripts. Here are
all four for our weather language:

| Valuation | $v(SUN)$ | $v(RAIN)$ | Situation |
| --- | --- | --- | --- |
| $v₁$ | $1$ | $1$ | Sunny and rainy |
| $v₂$ | $1$ | $0$ | Sunny, not rainy |
| $v₃$ | $0$ | $1$ | Rainy, not sunny |
| $v₄$ | $0$ | $0$ | Neither sunny nor rainy |

Why are there precisely four valuations? Here's an argument: Generally
speaking, for each propositional variable – $SUN$ or $RAIN$ – we assign one of
the two Boolean values, $1$ or $0$. And these assignments are _independent_ of each
other: the value of $SUN$ doesn't determine the value of $RAIN$ and
_vice versa_. So, if we start assigning values and begin with $SUN$, there are
two choices: either we assign it $1$ or we assign it $0$. And since the value
of $SUN$ doesn't determine the value of $RAIN$, for each of the two choices for
$SUN$, there are again two choices of values for $RAIN$: either we assign it
value $1$ or $0$. So, for each of the two choices there are again two choices,
giving us $2 × 2 = 4$ ways of assigning values in total.

The argument easily generalizes if we have more variables. If we also have
$WIND$, for example, it gets either the value $1$ or $0$ independently of the
other values. So, for each of our four ways of assigning values to $SUN$ and
$RAIN$, we get two ways of assigning values to $WIND$, giving us $4 × 2 = 8$
ways of assigning Boolean values to $SUN$, $RAIN$, and $WIND$. In general, if
there are $n$ variables, we multiply $n$ factors of $2$, giving us
$2ⁿ$ options. This is, in essence, the [multiplication
principle](https://en.wikipedia.org/wiki/Rule_of_product) from combinatorics.

Each valuation now tells us everything about a reasoning situation that our
language can express. So, from a logical perspective, we can identify the
models for our propositional language with Boolean valuations:

{{< callout type="definition" title="Boolean model" >}}
A {{< term "boolean-model" "Boolean model" >}} for a propositional language is a
valuation of its propositional variables.
{{< /callout >}}

In the case of our language with just $SUN$ and $RAIN$, we'll call the
corresponding models $M₁$, $M₂$, $M₃$, and $M₄$. Thus $M₂$, for example, is the
model given by $v₂$: sunshine without rain.

{{< callout type="note" title="Modelling assumptions: the granularity of the language" >}}
Our language determines which differences a model can represent. A valuation
of $SUN$ and $RAIN$ describes sunshine and rain, but says nothing about wind,
temperature, or location. Two weather situations that agree about sunshine and
rain have the same valuation, however much they differ in other respects.
There is no fact about temperature within such a model: the language has no
formula expressing it. To represent finer distinctions, we need a richer language.
{{< /callout >}}

{{< callout type="note" title="Modelling assumptions: the reasoning space" >}}
We allow every combination of values for $SUN$ and $RAIN$, including sunshine
and rain together. Bivalence does not make these two variables mutually
exclusive, even if in natural language we sometimes treat them as such. Any
constraint excluding a combination must be stated as an additional premise or a
restriction on the model space.
{{< /callout >}}

### Boolean evaluations

A valuation settles the _basic_ facts of a reasoning scenario. For example,
$v(SUN) = 1$ and $v(RAIN) = 0$ describe a situation where the sun is shining
and it isn't raining. But what about a complex formula like $SUN ∧ ¬RAIN$?
We want its value to follow from the values we've already assigned to $SUN$
and $RAIN$, using the meanings of $∧$ and $¬$.

This is where the Boolean functions come in. Since $v(RAIN) = 0$, applying
$!!NOT!!$ gives $v(¬RAIN) = 1$. Both parts of $SUN ∧ ¬RAIN$ now have value $1$,
so applying $!!AND!!$ gives the whole formula value $1$ too. Here, we'll focus
on formulas containing only the connectives $¬$, $∧$, and $∨$. The general
rules are:

{{< callout type="definition" title="Boolean evaluation" >}}
Let $v$ be a Boolean valuation for a propositional language with connectives
$¬$, $∧$, and $∨$. The **Boolean value** $v(A)$ of a formula $A$ under $v$
is determined as follows: for a propositional variable, use the value assigned
by $v$; for a complex formula, use these equations, which hold for all formulas
$A$ and $B$:

$$
v(¬A) = !!NOT!! v(A)
v(A ∧ B) = v(A) !!AND!! v(B)
v(A ∨ B) = v(A) !!OR!! v(B)
$$

The resulting function on all formulas is the {{< term "boolean-evaluation"
"Boolean evaluation" >}} determined by $v$.
{{< /callout >}}

We use the same letter $v$ for the original valuation and its extension to
complex formulas. Once the values of the variables are fixed, these rules
leave no further choices: every formula gets precisely one Boolean value.

The semantic idea is simple:

  - A {{< term "negation" "negation" >}} is true exactly when its argument is
  false.
  - A {{< term "conjunction" "conjunction" >}} is true exactly when both
  conjuncts are true.
  - A {{< term "disjunction" "disjunction" >}} is true exactly when *at least one* of
  its disjuncts is true (including when both are true).

The calculation rules above give us precisely this.

### Parsing and valuations

The clauses tell us how to evaluate a compound formula once we know the values
of its immediate parts. This is {{< term "recursion" "recursion" >}}: solve a problem by
applying the same procedure to smaller instances of that problem.

Here the {{< term "base-case" "base case" >}} is a propositional variable: read its value from the
valuation. In a {{< term "recursive-case" "recursive case" >}}, evaluate the immediate subformulas and apply
the truth-function for their connective. Every call concerns a smaller formula,
so the process eventually reaches variables and terminates.

For $SUN ∨ (RAIN ∧ ¬SUN)$, the parser identifies $∨$ as the root, with children
$SUN$ and $RAIN ∧ ¬SUN$. Evaluating the second child requires evaluating $RAIN$
and $¬SUN$; evaluating $¬SUN$ first requires the value of $SUN$. The tree fixes
which operation receives which inputs. Repeated occurrences of $SUN$ are
separate leaves, but the valuation gives them the same value.

{{< logic-app name="boolean" kind="evaluation" formula="SUN ∨ (RAIN ∧ ¬SUN)" >}}

The annotations below the nodes give their values. At an internal node,
$v(…)$ refers to the whole subformula rooted there; the explanation beside
the tree writes that subformula out.

This is how parsing connects to computation. As we saw in
{{< chapter_ref chapter="formal-languages" >}}Formal languages{{< /chapter_ref >}},
a computer needs to work out the structure of an expression before it can
calculate its value. The parsing tree tells it which operations to perform
and how their results fit together. In our example, we first calculate
$!!NOT!! v(SUN)$, combine that result with $v(RAIN)$ using $!!AND!!$, and
finally apply $!!OR!!$ to the result and $v(SUN)$. The same idea applies to
expressions in programming languages: parsing gives us the structure that
guides the calculation.

### Propositions

{{< callout type="definition" title="The proposition expressed by a formula" >}}
The {{< term "proposition" "proposition" >}} expressed by $A$ is its set of satisfying models:

$$
[A] = {v : v(A) = 1}
$$

We write $v ⊨ A$ when $v(A) = 1$: the model satisfies the formula.
{{< /callout >}}

For example, $[SUN] = {M₁, M₂}$ and $[RAIN] = {M₁, M₃}$. To see how the evaluation
clauses translate into operations on these sets, we need two more set operations.
We've already used intersection: $S ∩ T$ keeps the members common to both sets.

{{< callout type="definition" title="Union" >}}
The {{< term "set-union" "union" >}} of $S$ and $T$, written $S ∪ T$, contains everything
that belongs to **at least one** of them. This includes objects belonging to both:

$$
S ∪ T = {x : x ∈ S or x ∈ T}
$$
{{< /callout >}}

In the familiar example below, take everyone and everything inside either
outline. Little Jimmy belongs to both sets, but we don't count him twice:
a set either contains an object or it doesn't.

{{< set-diagram scene="union" >}}

{{< callout type="definition" title="Set difference" >}}
The {{< term "set-difference" "difference" >}} $S ∖ T$ contains the members of $S$
that do **not** belong to $T$:

$$
S ∖ T = {x : x ∈ S and x ∉ T}
$$
{{< /callout >}}

Start with $S$ and remove any members it shares with $T$. The order matters:
$S ∖ T$ and $T ∖ S$ need not be the same set. If we start with the entire
space $W$, then $W ∖ S$ contains everything outside $S$. We call this the
{{< term "set-complement" "complement" >}} of $S$ relative to $W$.

{{< set-diagram scene="difference" >}}

Now let $W$ be our whole logical space. The Boolean clauses give us these
operations on propositions:

| Formula operation | Operation on propositions |
| --- | --- |
| Negation | $[¬A] = W ∖ [A]$ |
| Conjunction | $[A ∧ B] = [A] ∩ [B]$ |
| Disjunction | $[A ∨ B] = [A] ∪ [B]$ |

Choose a formula below to see the proposition it expresses. For a complex
formula, the lighter outlines show the propositions we combine to calculate it.
The four pictured worlds are the members of this finite space; empty areas
between them do not represent additional valuations.

{{< logic-app name="boolean" kind="models" >}}

The complex example now has a set calculation as well as a tree calculation:

$$
[RAIN ∧ ¬SUN] = {M₁, M₃} ∩ {M₃, M₄} = {M₃}
[SUN ∨ (RAIN ∧ ¬SUN)] = {M₁, M₂} ∪ {M₃} = {M₁, M₂, M₃}
$$

Evaluation finds a formula's value at **one** valuation. Its proposition collects
**all** valuations where that value is $1$. In the next chapter, truth-tables
organize these calculations across valuations.

### Testing inferences

{{< callout type="definition" title="Validity and countermodels" >}}
The inference from $A₁, …, Aₙ$ to $B$ is deductively valid in Boolean semantics,
written $A₁, …, Aₙ ⊨ B$, exactly when every valuation making all premises true
also makes the conclusion true:

$$
[A₁] ∩ … ∩ [Aₙ] ⊆ [B]
$$

A {{< term "countermodel" "countermodel" >}} makes every premise true and the conclusion
false. One countermodel suffices to show invalidity.
{{< /callout >}}

Consider this instance of disjunctive syllogism:

{{< inference layout="stacked" rule="DS" >}}
$SUN ∨ RAIN$
$¬SUN$
---
$RAIN$
{{< /inference >}}

The first premise permits $M₁$, $M₂$, and $M₃$. The second permits $M₃$ and
$M₄$. Their intersection contains only $M₃$, where $RAIN$ is true:

{{< logic-app name="boolean" kind="models" preset="ds" >}}

$$
[SUN ∨ RAIN] ∩ [¬SUN] = {M₃} ⊆ [RAIN]
SUN ∨ RAIN, ¬SUN ⊨ RAIN
$$

There is no countermodel: the inference is valid. Now consider affirming a
disjunct:

{{< inference layout="stacked" >}}
$SUN ∨ RAIN$
$SUN$
---
$¬RAIN$
{{< /inference >}}

The premises allow $M₁$ and $M₂$, but the conclusion excludes $M₁$. At $M₁$
it is both sunny and rainy: both premises are true while $¬RAIN$ is false.

{{< logic-app name="boolean" kind="models" preset="fallacy" >}}

$$
M₁ ∈ [SUN ∨ RAIN] ∩ [SUN],   M₁ ∉ [¬RAIN]
SUN ∨ RAIN, SUN ⊭ ¬RAIN
$$

The exercises ask you to find all the countermodels of an inference and to
test inferences of your own. An inference whose premises have no common model
is valid vacuously: there is no world with true premises and a false conclusion.

The invalidity of affirming a disjunct depends on the inclusive interpretation
of $∨$. An exclusive disjunction would rule out $M₁$; the exercises explore
this difference.


## Further readings {.readings .nocount}

- Audrey Yap and Richard Zach, [*What If?* (PDF)](https://builds.openlogicproject.org/courses/what-if/wi-screen.pdf), chapter 1, for propositional syntax and semantics.

- Russell and Norvig, [*Artificial Intelligence: A Modern Approach*, 4th edition](https://www.pearson.com/en-us/subject-catalog/p/Russell-Lecture-Power-Points-for-Artificial-Intelligence-A-Modern-Approach-4th-Edition/P200000003500/9780137505135), chapter 7, for propositional reasoning by an agent.
