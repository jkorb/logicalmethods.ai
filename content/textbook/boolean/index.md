---
title: Boolean algebra
author: Johannes Korbmacher
locked: false
weight: 40
params: 
  date: "13/09/2024"
  last_edited: "13/09/2024"
  id: txt-bool
  math: true
---

# Boolean algebra

{{< img src="img/low_level.png" class="rounded  float-end inert-img img-fluid mx-3" width="300px">}} 
Boolean algebra—the logic of 0's, 1's, not, and, or, …—is the ultimate logical
foundation of modern computers, and by extension *all* AI systems. The study of
Boolean logic has its roots in the work of [George
Boole](https://en.wikipedia.org/wiki/George_Boole) from the mid 19th century.
But it wasn't until AI-pioneer [Claude
Shannon](https://en.wikipedia.org/wiki/Claude_Shannon) connected the theory to
the basic workings of electronic circuits that the importance of Boolean algebra
for the development of information technologies became apparent. While Shannon
was investigating [relays](https://en.wikipedia.org/wiki/Relay)—essentially
electronically operated switches—and not
[semiconductors](https://en.wikipedia.org/wiki/Semiconductor), which are the
actual technology used to implement computers today, the fundamental principles
are the same. Boolean algebra is the logic of low-level computing, and the way
that computers add, subtract, multiply, etc. are ultimately grounded in Boolean
logic.

But the importance of Boolean algebra to AI is not restricted to the low level.
Propositional reasoning on all levels follows the laws of Boolean algebra.
[Conditionals](https://en.wikipedia.org/wiki/Conditional_(computer_programming))
in most programming languages, such as C, Python, or Java, rely on Boolean
connectives:
{{< img src="img/python_snippet.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="400px">}}
To write good conditionals and understand code that others have written, you
need a solid understanding of Boolean logic. 

Even on the highest level, deductive reasoning with propositional information stored in
{{<abbr title="knowledge bases">}}KBs{{</abbr>}} follows the laws of Boolean
algebra:

{{< img src="img/mp_kb.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="400px">}}

In short, the importance of Boolean logic for AI can hardly be overstated.

At the end of this chapter, you'll be able to:

+ explain the basic principles of Boolean algebra

+ implement the Boolean truth-functions using simple circuits

+ derive logical laws from the Boolean laws

+ build and apply adders from Boolean circuits

+ test propositional inferences for deductive validity using Boolean models

## Boolean truth-values

Boolean algebra is the logic of the proverbial 0's and 1's. That is, the Boolean
truth-values are:

$${0, 1}$$

These values have many different interpretations depending on the reasoning
context we're in: on/off, high/low, true/false, …. 

In logic, the true/false interpretation is the most common. If we're dealing
with a propositional language that has a propositional letter
$SUN$ to express that the sun is shining,
assigning it the value 1 means that the sun is indeed shining, while assigning
$SUN$ the value 0 means that it is not.

{{< img src="img/sun_boolean.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="400px">}}

In Boolean logic, there is no _third_ truth-value for facts that are undecided,
unknown, indeterminate. From a logical perspective, this is a **modelling
assumption**, which means that Boolean logic is only applicable in situations,
where things are clear-cut, true or false. But luckily, there are many such
situations, ranging from the behavior of semiconductors to simple facts of
everyday life.

## Truth-functions

The basic operations of Boolean algebra are the so-called _truth-functions_.
These are [functions](https://en.wikipedia.org/wiki/Function_(mathematics)) in
the mathematical sense, which take one or more Boolean truth-values as input and
return exactly one Boolean truth-value as output.

For now, we'll restrict ourselves to the basic functions $!!NOT!!$, $!!AND!!$, and
$!!OR!!$. These are not the most fundamental truth-functions in any sense of the
word, but _are_ the most commonly used truth-functions in logical theory. In
computer science, instead, especially when we're thinking about basic
semiconductor circuits $!!XOR!!$ and especially when we're
thinking about basic semiconductor circuits $!!NAND!!$ are more commonly used as
basic functions.

The truth-functions are given by the following functional tables, where the
first input is in the first column and the second input in the first row. In the
case of the binary functions—the ones with two inputs—the output is read-off by
intersecting the two input columns:

{{< img src="img/function_tables.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="900px">}}

So, for example, $!!NOT!! 0 = 1$ and 
$1 !!OR!! 0 = 1$.

The truth-functions $!!NOT!!$, $!!AND!!$, and $!!OR!!$ are sufficient to express _any_
truth-function whatsoever. This mathematical fact is known as the joint
**truth-functional completeness** of these operators, and we'll investigate it
in the exercises. $!!NOT!!$, $!!AND!!$, and $!!OR!!$ are not the only collection of
truth-functions with this property, not even the smallest one. But especially
in logical contexts, they are the most commonly used ones, since using these
truth-functions, we can easily describe many different important concepts and
algorithms with relative ease.

To get a better understanding of how these truth-functions work, we'll look at
an implementation using
[relays](https://en.wikipedia.org/wiki/Relay)—essentially tracing some of
Shannon's ideas. A relay is, essentially, an electronically operated switch. For
our purposes, we'll work with the following two kinds of relays:

{{< img src="img/relays.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="900px">}}

Both relays have two inputs and one output. One input leads to an electromagnet,
which if it receives power exerts a magnetic force on the switch connected to
the other input and flips it. In the {{<excalifont>}}default
  "off"{{</excalifont>}} relay, this closes the circuit and the output receives
power in case the input does. With the {{<excalifont>}}default
  "on"{{</excalifont>}} relay, it's the other way around: if the electromagnet
receives power, the output gets disconnected from the input, breaking the
circuit.

So, if the $default  "on"$ circuit receives
constant power to the right circuit, this is how turning the power to the magnet
off and on affects the behavior of the circuit:

{{< img src="img/relay_behavior.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="900px">}}

The $default  "on"$ relay, of course, behaves
dually.

We can use these two relays to implement our three Boolean truth-functions. For
this, we assume that following set-up: 

{{< img src="img/implementation_setup.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

We have:

- a constant source of power $POWER$

- two switchable inputs, $X$ and $Y$

- a single output, which is connected to an indicator lamp 

We interpret $X$ being $off$ as the first input being $0$ and $X$ being $on$ as
the first input being $1$, and analogously for $Y$ and the second input. The
lamp represents the output in the same way: if it is $off$, the output is $0$,
if it is $on$ the output is $1$. So, the set-up is depicted in the configuration
for the first and second input both being $0$. Since we haven't implemented
anything yet, the output is also $0$.

We can implement the $!!NOT!!$ function with a single $default "on"$ relay:

{{< img src="img/negation_impl.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="900px">}}

Depicted are both states of the circuit: if the first input is $0$ ($X$ is
$off$), the output is $1$ (the lamp is $on$); and if the first input is $1$ ($X$
is $on$), the output is $0$ (the lamp is $off$). The second input doesn't
matter, of course.

We can implement $!!AND!!$ using the other kind of relay as follows:

{{< img src="img/conjunction_impl.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="900px">}}

There are four possible states of the circuits, but as you can see: only if both
inputs are $1$ the output is
$1$. In all other configurations, the output is
$0$—just like the
$!!AND!!$ function, requires.

Implementing the $!!OR!!$ function using the relays
is one of the exercises. If you want to try more, you can try the amazing
[nandgame](https://nandgame.com/), which allows you to implement an entire
computer "by hand".

## The Laws of Boolean algebra

{{< img src="img/laws_of_logic.png" class="rounded  float-end inert-img img-fluid mx-3" width="300px">}}
The behavior of the Boolean truth-functions is
governed by a series of **algebraic laws**, that is _identities_ describing
their interaction. These identities are formulated using **variables** $X,Y,…$,
which can assume arbitrary values from among the set ${0, 1}$. Take, for
example, the *Boolean equation*:

<div class="text-center my-4">
`(X !!AND!! Y) = (Y !!AND!! X)`
</div>

This equation says that for any pair of values $X,Y$ from {{<excalifont>}}{0,
  1}{{</excalifont>}}, the result of applying $!!AND!!$ with $X$ as the first
input and $Y$ as the second is the same as applying $!!AND!!$ with $Y$ as the
first input and $X$ as the second.

You can verify this law by inspecting the function table for $!!AND!!$ and
going through all possible values for $X$ and $Y$. Here are the corresponding
calculations:

<div class="text-center my-4">

`(0 !!AND!! 0) &nbsp; = &nbsp; (0 !!AND!! 0)`

`(0 !!AND!! 1) = 0 = (1 !!AND!! 0)`

`(1 !!AND!! 0) = 0 = (0 !!AND!! 1)`

`(1 !!AND!! 1) &nbsp; = &nbsp; (1 !!AND!! 1)`

</div>

Only the second and third line are "interesting" calculations, the first and
last are "trivial".

This law is called the law of $Commutativity$ for
$!!AND!!$, which states that for
$!!AND!!$, the order of its inputs doesn't matter.
Many laws of Boolean algebra have such names.

Here are the most important laws and their corresponding names:

|                                                                                                                                                              |               |                                                      |
| ----------------------------------------------------------------------------                                                                                 | -             | -----------------------------------------            |
| `(X !!OR!! (Y !!OR!! Z)) = ((X !!OR!! Y) !!OR!! Z)`<br>`(X !!AND!! (Y !!AND!! Z)) = ((X !!AND!! Y) !!AND!! Z)`                 | &emsp; &emsp; | $("Associativity")$   |
| &nbsp;                                                                                                                                                       |               |
| `(X !!OR!! Y) = (Y !!OR!! X)`<br>`(X !!AND!! Y) = (Y !!AND!! X)`                                               |               | $("Commutativity")$   |
| &nbsp;                                                                                                                                                       |               |
| `(X !!OR!! (X !!AND!! Y) = X `<br>`(X !!AND!! (X !!OR!! Y) = X `                                               |               | $("Absorption")$      |
| &nbsp;                                                                                                                                                       |               |
| `(X !!OR!! (Y !!AND!! Z)) = ((X !!OR!! Y) !!AND!! (X !!OR!! Z) ` <br>`(X !!AND!! (Y !!OR!! Z)) = ((X !!AND!! Y) !!OR!! (X !!AND!! Z) ` |               | $("Distributivity")$  |
| &nbsp;                                                                                                                                                       |               |
| `(X !!OR!! !!NOT!! X) = 1 ` <br>`(X !!AND!! !!NOT!! X) = 0 `                                                   |               | $("Complementation")$ |
| &nbsp;                                                                                                                                                       |               |
| `(X !!OR!! 0) = X ` <br> `(X !!AND!! 1) = X `                                                          |               | $("Identity")$        |
| &nbsp;                                                                                                                                                       |               |
| `(X !!AND!! 0) = 0 ` <br>`(X !!OR!! 1) = 1 `                                                           |               | $("Domination")$      |
| &nbsp;                                                                                                                                                       |               |

You can (and should!) verify all these laws, just like we did for
$Commutativity$. Don't worry, you don't need to
memorize all of these laws. But at the same time, knowing them can be incredibly
helpful in showing facts about Boolean algebras.

In particular, you can use these laws to derive other laws in an algebraic way,
that is by manipulating equations. For example, you can derive the following
important family of laws known as the **de Morgan laws**:

|                                                                                                                                                              |               |                                                      |
| ----------------------------------------------------------------------------                                                                                 | -             | -----------------------------------------            |
| `!!NOT!! (X !!OR!! Y) = (!!NOT!! X !!AND!! !!NOT!! Y)`<br>`!!NOT!! (X !!AND!! Y) = (!!NOT!! X !!OR!! !!NOT!! Y) `                 | &emsp; &emsp; | $("De Morgan Identities")$   |
| &nbsp;                                                                                                                                                       |               |
| `!!NOT!! !!NOT!! X = X `                                              |               | $("Double Negation")$   |
| &nbsp;                                                                                                                                                       |               |

Let's look at how to derive {{<excalifont>}}("Double
  Negation"){{</excalifont>}}:

1. We start with 

   ```
   !!NOT!! !!NOT!! X = ((!!NOT!! !!NOT!! X) !!AND!! 1),
   ```

    which we know by $"Identity"$.

2. We then apply the fact that `X !!OR!! !!NOT!! X = 1`, that is $"Complementation"$, which gives us that 
 
   ```
   !!NOT!! !!NOT!! X = ((!!NOT!! !!NOT!! X) !!AND!! (X !!OR!! !!NOT!! X)),
   ```

3. By $"Distributivity"$, we have 

   ```
   ((!!NOT!! !!NOT!! X) !!AND!! (X !!OR!! !!NOT!! X))= ((!!NOT!! !!NOT!! X) !!AND!! X) !!OR!! ((!!NOT!! !!NOT!! X) !!AND!! !!NOT!! X),
   ```

   so we can conclude that 

   ```
   !!NOT!! !!NOT!! X = ((!!NOT!! !!NOT!! X) !!AND!! X) !!OR!! ((!!NOT!! !!NOT!! X) !!AND!! !!NOT!! X).
   ```

4. Now, notice that  `((!!NOT!! !!NOT!! X) !!AND!! !!NOT!! X) = 0` by $"Complementation"$. So step 3. simplifies to:

   ```
    !!NOT!! !!NOT!! X = ((!!NOT!! !!NOT!! X) !!AND!! X) !!OR!! 0.
   ```

   which by $"Identity"$ simplifies further
   down to:

   ```
    !!NOT!! !!NOT!! X = (!!NOT!! !!NOT!! X) !!AND!! X.
   ```

5. Going a bit faster, we can see by analogous reasoning that

   ```
    X = X !!AND!! 1 = X !!AND!! ((!!NOT!! !!NOT!! X) !!OR!! !!NOT!! X),
   ```

   using $"Identity"$ and $"Complementation"$ like before.

6. Using $"Distributivity"$, this gives us

   ```
    X = (X !!AND!! !!NOT!! !!NOT!! X) !!OR!! (X !!AND!! !!NOT!! X).
   ```

7. But since `{{<excalifont >}}(X !!AND!! !!NOT!! X) = 0{{</excalifont>}}`, we now get 

   ```
    X = (X !!AND!! (!!NOT!! !!NOT!! X))
   ```
   
   using $"Identity"$ and $"Complementation"$.

8. But now we know that both: 

   ```
   !!NOT!! !!NOT!! X = (!!NOT!! !!NOT!! X) !!AND!! X
   ```

   ```
   X = (X !!AND!! (!!NOT!! !!NOT!! X)), 
   ```

  where the latter is just `X = (!!NOT!! !!NOT!! X) !!AND!!
   X,` using $"Commutativity"$ to reorder. So, we can conclude that: 

   ```
    !!NOT!! !!NOT!! X = X
   ```


This derivation may seem a bit tedious—especially since we can prove the fact
that $!!NOT!! !!NOT!! X = X$ fact by simply inspecting
the function tables: `!!NOT!! !!NOT!! 1 = 1$ and $!!NOT!! !!NOT!! 0 = 0`.

But there are also questions where the laws are much more efficient at giving
you the answer than inspecting the tables. Take for example the Boolean
expression:

  ```
  X !!AND!! ((Y !!AND!! Z) !!OR!! !!NOT!! (Y !!AND!! Z))
  ```

It turns out that this expression reduces to simply
$X$. To see this by truth-table inspection, we
need to go through $2³&nbsp;=&nbsp;8$ different
combinations of truth-values for $X, Y, Z$ and
for each combination, we need to calculate $5$ different operations. That's a
lot of calculations. 

Using the laws of Boolean algebra, however, we can recognize that 

  ```
  ((Y !!AND!! Z) !!OR!! !!NOT!! (Y !!AND!! Z))
  ```

  is of the form 

  ```
  [something] !!OR!! !!NOT!! [something], 
  ```

where `[something] = (Y !!AND!! Z)`. So, by
$"Complementation"$, we can reduce  

  ```
  X !!AND!! ((Y
  !!AND!! Z) !!OR!! !!NOT!! (Y
  !!AND!! Z))
  ```
down to 

  ```
  X !!AND!! 1, 
  ```

which by $"Identity"$ is just `X`.

{{< img src="img/ai_tools.png" class="rounded  float-end inert-img img-fluid mx-3" width="100px">}} 
The derivation also illustrates an important point: the above laws of Boolean
algebra allow us to derive further laws that don't look like they're covered by
the initial list. In fact, we can derive _all_ valid identities of Boolean
algebra from these laws. The list of laws is **complete** in this sense. 
Having a complete list of laws for a subject matter is an incredibly feat: _all
there is to know about Boolean algebras is encoded in these laws_. And as the
example of `X !!AND!! ((Y !!AND!! Z) !!OR!! !!NOT!! (Y !!AND!! Z))` shows, this
can be a handy tool in the toolbox of any AI researcher.

On a more historical note, the set of laws we've discussed are originally due to
[Alfred North Whitehead](https://en.wikipedia.org/wiki/Alfred_North_Whitehead).
But it is not the only collection of complete laws and certainly not the
[minimal one](https://en.wikipedia.org/wiki/Minimal_axioms_for_Boolean_algebra).
It turns out that the following single law is enough to derive all the other
laws of Boolean algebra (expressed using  only
$!!NOT!!$ and $!!OR!!$): 

```
!!NOT!! (!!NOT!! (!!NOT!! (X !!OR!! Y) !!OR!! Z) !!OR!! !!NOT!! (X !!OR!! !!NOT!! (!!NOT!! Z !!OR!! !!NOT!! (Z !!OR!! U)))) = Z
```

But that's a story for another day.

## Adders

To illustrate the usefulness of Boolean algebra, let's look an important
application: the implementation of addition via
[adders](https://en.wikipedia.org/wiki/Adder_(electronics)).

{{< img src="img/ai_calculating.png" class="rounded  float-end inert-img img-fluid mx-3" width="250px">}} 
An **adder** is a circuit that performs addition on numbers. We can implement
adders using Boolean truth-functions, but first, we need to translate the
numbers into something a Boolean function can understand. We need to talk about
**binary numbers**. 

The fundamental idea of [binary
numbers](https://en.wikipedia.org/wiki/Binary_number) is that we can represent
any natural number as a sequence of $0$'s and $1$'s. Here's how this works. Take
the string $$1101,$$ for example. This string is the binary representation of
the number $13$. Here's how this works:

{{< img src="img/binary_example.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

The $0$'s and $1$'s are also called
[bits](https://en.wikipedia.org/wiki/Bit)—short for binary digits—especially in
computer science contexts. For simplicity, we count the bits of a binary number
backwards from the end of the string (right-to-left rather than left-to-right).
You'll see in a second why. We also start counting at $0$, which might be
unusual at first, but is also common in computer science. So, the first bit of $1101$, for example, is what would normally be called "the second digit from the end", i.e. $0$:

{{< img src="img/bits_example.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="200px">}}

To calculate the number represented by a string, you go through the digits one.
Let's call the $n$th bit $dₙ$. So, in our example, we have: $$d₀ = 1, d₁ = 0,
d₂ = 1, d₃ = 1$$

Then you multiply the $n-th$ bit with the $n-th$ power of $2$, that is, you
calculate: $$(dₙ x 2ⁿ)$$
And then you sum up the results for all the digits:
$$(d₀ x 2⁰) + (d₁ x 2¹) + (d₂ x 2²) + …$$
This is the general formula for calculating the number represented by a binary
string. In our case of $1101$, this formula gives us precisely the calculation
from above. In more general mathematical notation, we can write this as:

{{< img src="img/representation_formula.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="200px">}}

But this is just "fancy notation"" to say exactly the same thing we just said.

The number $1101$ is what's called a $4$-bit number, since it represents a
number using four bits. Typically, we're dealing with binary numbers of a fixed
number of bits. In implementations, this restriction is enforced by hardware
limitations: while mathematicians are happy dealing with strings of infinite
length in their minds, it's slightly complicated to stuff them into a computer
chip. This is why we have [$64$-bit computing](https://en.wikipedia.org/wiki/64-bit_computing) and not "∞-bit computing".

But there are also practical advantages to have a fixed bit-size. For example,
if we have two binary numbers of the same length, they are incredibly easy to
add. Here's an example of how this works:

{{< img src="img/addition_example.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="500px">}}

Essentially, what we do here is to add the two numbers by adding their binary
components one by one, taking care along the way to "carry over" any overspill.
The way this works is that you start from the end again and you add the two
$0$th digits according to the following rules: 

+ If one digit is a $0$ and the other is a $1$, the result is $1$, since $$(0 x
2⁰) + (1 x 2⁰) = (1 x
2⁰) + (0 x 2⁰) = 1$$

+ If both digits are a $0$, then the result is $0$, since 
$$(0 x 2⁰) + (0 x 2⁰) = 0$$

+ If both digits are a $1$, then the result is $0$ with a **carry** of $1$ (this
is the little red number in the next column), since 

    {{< img src="img/half_adder_rule.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="500px">}}

Now you might already see that what's going on here is just Boolean
truth-functions being applied to the $0$th digit. Basically, what we have here
are two inputs: the $0$th digit of our first number and the $0$th digit of our
second number. Let's call them $d₀$ and $e₀$ respectively. What we need to
calculate are two things: the $0$th digit of our result, and any potential
carry.

According to the rules, the first output, the $0$th digit of our addition, is
$1$ just in case exactly one (and not both) of $d₀$ and $e₀$ is $1$. Otherwise, if
either $d₀ = e₀ = 0$ or $d₀ = e₀ = 1$, the output is $0$. This describes a
truth-function, which is known as $!!XOR!!$ ("exclusive or"), which has the
following function table:

{{< img src="img/xor_table.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="500px">}}

We can actually express this function using only $!!NOT!!, !!AND!!, !!OR!!$, but
using $!!XOR!!$ directly it's much easier.

The carry, instead, is $1$ just in case both $d₀$ and $e₀$ are $1$ and $0$
otherwise. But that's just the specification of $!!AND!!$. So, we can describe the
rule as follows using Boolean truth-functions:

+ the $0$th digit of our addition is $d₀ !!XOR!! e₀$

+ the carry is $d₀ !!AND!! e₀$

If we've implemented $!!XOR!!$ and $!!AND!!$ using relays or semiconductors, following
the ideas sketched above, we can implement this rule using the following
circuit known as a **half-adder**:

{{< img src="img/half_adder.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="500px">}}


{{< img src="img/ai_half_adder.png" class="rounded  float-start inert-img img-fluid mx-3" width="100px">}} 
The idea is that the blue boxes are implementations of $!!XOR!!$ and $!!AND!!$
respectively, which take two inputs and give two outputs. The input switches
represent $d₀$ and $e₀$ respectively, on meaning $1$ and off meaning $0$. The
two lamps stand for the results, the $0$th digit and the carry, respectively. A
lamp being on means the relevant output is $1$, otherwise its $0$. What's
depicted here is the configuration that corresponds to our example, i.e. $d₀ =
1$ and $e₀ = 1$. 

Now, let's return to the $1$st (meaning second from the end) digit of our
result:

{{< img src="img/calculation_focus.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="300px">}}

You might notice that here, we no longer have just two inputs, but *three*: the
$1$st digit of the first 
{{<abbr title="number to be added">}}summand{{</abbr>}} ($d₁$), the $1$st digit
of the second 
{{<abbr  title="number to be added">}}summand{{</abbr>}} ($e₀$), *plus* the
carry from the previous step (let's call it $c₀$). Like in the first step, we
need to calculate two outputs: the $1$st digit of our sum, and any potential
carry that might result.

The $1$st digit of our sum is rather straight-forward to calculate: it should
be $1$ just in case exactly one input is $1$ _or_ all three inputs are $1$. The
reasoning is like in the two input case from before:

+ If there's no $1$, we get:

    $$(0 x 2¹) + (0 x 2¹) + (0 x 2¹)$$
    {{< img src="img/addition_full_0.png" class="rounded mx-auto d-block inert-img img-fluid " width="150px">}}


+ If there's precisely one $1$, we have:

    $$(1 x 2¹) + (0 x 2¹) + (0 x 2¹)$$
    $$= (0 x 2¹) + (1 x 2¹) + (0 x 2¹)$$
    $$= (0 x 2¹) + (0 x 2¹) + (1 x 2¹)$$
    {{< img src="img/addition_full_1.png" class="rounded mx-auto d-block inert-img img-fluid " width="150px">}}

+ If there's exactly two $1$'s, we get:

    $$(1 x 2¹) + (1 x 2¹) + (0 x 2¹)$$
    $$= (1 x 2¹) + (0 x 2¹) + (1 x 2¹)$$
    $$= (0 x 2¹) + (1 x 2¹) + (1 x 2¹)$$
    {{< img src="img/addition_full_2.png" class="rounded mx-auto d-block inert-img img-fluid" width="300px">}}

    
+ And if there's three $1$'s, we have:

    $$= (1 x 2¹) + (1 x 2¹) + (1 x 2¹)$$
    {{< img src="img/addition_full_3.png" class="rounded mx-auto d-block inert-img img-fluid" width="300px">}}

The Boolean truth-function which gives us precisely the desired output for the
$1$st digit of our computation is:

$$(d₁ !!XOR!! e₁ ) !!XOR!! c₀$$

But what should the carry be? Inspecting the cases, we can see that we should
carry a $1$ in one of two scenarios: if there's exactly two $1$'s and if there's
precisely three. How can we express this in terms of truth-functions? While
there are different ways of doing this, here's a common one using $!!AND!!, !!OR!!,$ and
$!!XOR!!$:

$$(d₁ !!AND!! e₁ ) !!OR!! (c₀ !!AND!! (d₁ !!XOR!! e₁))$$

The reasoning is that we can analyze our two scenarios (exactly two $1$'s and
exactly three $1$'s) in a slightly different way: either both inputs are $1$ or
exactly one input is $1$ and the carry from before is $1$. You can—and—
should!—verify that this works.

It's a bit more tedious to implement this using circuits, but of course it can
be done:

{{< img src="img/full_adder.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

This circuit, here depicted in the configuration from our example, is called a
**full adder**, and can also be implemented using two half adders.
{{< img src="img/ai_two_half.png" class="rounded  float-start inert-img img-fluid mx-3" width="600px">}}

We can use full adders to implement full addition on fixed-bit integers: just
chain full adders to calculate the individual output bits, ensuring to always
carry over when necessary. 

This example shows that Boolean inference is at the very heart of computation
and its implementation: one of the—if not *the*—most basic mathematical
operations is implemented using Boolean logic. In fact, addition becomes a form
of Boolean inference.

## Models

Turning from low-level reasoning—viz. the implementation of arithmetic—to more
high-level reasoning, we look at deductive reasoning in propositional logic
next. This is the kind of inference that is involved in conditionals in
programming languages, but also in automated inference with 
{{<abbr title="knowledge  bases">}}KB{{</abbr>}}'s, for example in expert
systems. It is common in everyday reasoning, as well, when we make inferences
like:

{{< img src="img/ai_key.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

We can use Boolean algebra to define the notion of a _model_ for a propositional language. This will give us the notion of deductively valid inference using the schema:

{{< img src="img/deductive_inference.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

In essence what we need to do is very similar to the case of addition above:
before we could implement addition using Boolean algebra, we needed to
translate numbers into something that Boolean algebra can understand.
Essentially, we need to do the same thing for logic: before we can apply
Boolean algebra to inferences, we need to translate the formulas of our formal
language into something that Boolean algebra can work with—which turns out to
be truth-values.

Suppose that we have a propositional language, $L$, which has two propositional
variables $SUN$ and $RAIN$, which we interpret as saying that it's sunny and
that it's rainy, respectively. 

There are _four_ logically relevant reasoning scenarios for inference in this
language. It could be:

1. Sunny and rainy.

2. Sunny, but not rainy.

3. Not sunny, but rainy.

4. Neither sunny, nor rainy.

That is, our logical space should look something like this:

{{< img src="img/logical_space.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

Our aim is to implement a definition of a model for $L$ that adequately
reflects this idea. To achieve this goal, we'll use the thought mentioned
before that we can *assign* truth-values to propositional variables, where
assigning the value $1$ to $SUN$, say, means that $SUN$ is true (it's sunny),
and assigning it the value $0$ means that $SUN$ is not true (it's not sunny).

Mathematically, we typically express such an assignment of values using the function symbol $v$, like so:

{{< img src="img/assignments.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="900px">}}

When more than one assignment viewed as a model is under consideration at the
same time, we disambiguate with the use of subscripts. So, for example, there
is the assignment $v₁$, such that $v₁(SUN)=1$ and $v₁(RAIN)=1$, as well as the
assignment $v₂$, such that $v₂(SUN)=1$, but $v₂(RAIN)=0$.

Since there are two propositional variables ($SUN$ and $RAIN$), there are $2² =
4$ possible ways of assigning truth-values from among ${0, 1}$ in this way.
Each of these assignments corresponds to one of our reasoning situations. More
generally, if there are $n$ propositional variables, where $n$ is any number,
then there are $2ⁿ$ different ways of assigning truth-values from ${0, 1}$ to
the propositional variables. In our case, the relevant assignments and
corresponding scenarios are:

 |                                                                                                    |              |                                |   |                                                                                                    |              |                                |
 | -------------------------------------------------------------------------------------------------- | -            | -----------                    | - | -                                                                                                  | -            | -                              |
 | $M₁$: {{< img src="img/m1.png" class="inert-img" height="48px" style="vertical-align: middle;" >}} | &emsp;&emsp; | $v₁(RAIN) = 1$ and $v₁(SUN) = 1$ | &emsp;&emsp;  | $M₃$: {{< img src="img/m3.png" class="inert-img" height="48px" style="vertical-align: middle;" >}} | &emsp;&emsp; | $v₃(RAIN) = 0$ and $v₃(SUN) = 1$ |  |
 | &emsp;                                                                                             |              |                                |   | &emsp;                                                                                             |              |                                |  |
 | $M₂$: {{< img src="img/m2.png" class="inert-img" height="48px" style="vertical-align: middle;" >}} | &emsp;&emsp; | $v₂(RAIN) = 1$ and $v₂(SUN) = 0$ |   | $M₄$: {{< img src="img/m4.png" class="inert-img" height="48px" style="vertical-align: middle;" >}} | &emsp;&emsp; | $v₄(RAIN) = 1$ and $v₄(SUN) = 1$ |  |
 | &emsp;                                                                                             |              |                                |   |
 
The idea is to _identify_ the possible reasoning scenarios—from a logical
perspective—with these assignments. That is, we say that a **model** for the
language $L$ _is_ an assignment of Boolean truth-values to the propositional
variables. In short: $$Mᵢ = vᵢ$$

Each model tells us what the truth-values for the propositional variables are.
This allows as, for example, to determine the proposition $[SUN]$ as follows:

{{< img src="img/prop_sun.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="900px">}}

But to determine the truth-values of complex formulas, such as $SUN v
RAIN$, we first need to think about the connectives. For now, we'll focus on the connectives 
{{< img src="img/negation.png" class="inert-img" height="20px" style="vertical-align: middle;" >}} ("negation"), {{< img src="img/conjunction.png" class="inert-img" height="20px" style="vertical-align: middle;" >}} ("conjunction"), and {{< img src="img/disjunction.png" class="inert-img" height="20px" style="vertical-align: middle;" >}}. 

Let's start with negation. In which models should we say that 
{{< img src="img/neg_sun.png" class="inert-img" height="28px"
style="vertical-align: middle;" >}}, say, is true? A straight-forward answer
is: {{< img src="img/neg_sun.png" class="inert-img" height="28px"
style="vertical-align: middle;" >}} says that it's not sunny, so the formula
should be true in precisely those models, where $SUN$ is _not_ true: $$v({{< img src="img/neg_sun.png" class="inert-img" height="34px"
style="vertical-align: middle;" >}}) = 1 just in case v(SUN) = 0.$$

But do you recognize it? This is exactly what the Boolean truth-function $!!NOT!!$
does! That is, we can implement the proposal using $!!NOT!!$ as follows: $$v({{<
img src="img/neg_sun.png" class="inert-img" height="34px"
style="vertical-align: middle;" >}}) = !!NOT!! v(SUN)$$

This means that {{< img src="img/neg_sun.png" class="inert-img" height="34px"
style="vertical-align: middle;" >}} gets the following semantic content:

{{< img src="img/prop_neg_sun.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="900px">}}

Turning to conjunction, in which models is {{< img src="img/sun_and_rain.png"
class="inert-img" height="30px" style="vertical-align: middle;" >}} true? Since
the formula says that it's both sunny and raining, the answer is: precisely in
those models where both $SUN$ and $RAIN$ are true. In all other models, {{< img src="img/sun_and_rain.png"
class="inert-img" height="30px" style="vertical-align: middle;" >}} is false. That is:

{{< img src="img/condition_sun_and_rain.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="850px">}}

But that's just what $!!AND!!$ does! So, we can implement this by saying:

{{< img src="img/clause_and.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

Completely analogously, we can handle the case of disjunction. {{< img src="img/sun_and_rain.png"
class="inert-img" height="30px" style="vertical-align: middle;" >}} says that it's either sunny or rainy. So it should be true in all and only those models where at least one of them is the case.

{{< img src="img/condition_sun_or_rain.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="800px">}}

This we can implement using the Boolean $!!OR!!$ by saying that:

{{< img src="img/clause_or.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

In sum, {{< img src="img/sun_and_rain.png"
class="inert-img" height="30px" style="vertical-align: middle;" >}} and {{< img src="img/sun_or_rain.png"
class="inert-img" height="30px" style="vertical-align: middle;" >}} get the following semantic content:

{{< img src="img/prop_sun_and_or_rain.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="900px">}}

Using this idea, we can calculate the proposition $[A]$ expressed by any
formula $A$ of our language. Just apply the following clauses to calculate the
truth-values under an assignment:

{{< img src="img/clauses.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

For example, we can calculate the proposition expressed by {{< img src="img/complex_fml.png" class="inert-img" height="24px" style="vertical-align: middle;" >}} as follows:

{{< img src="img/complex_proposition.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="900px">}}

The most difficult part to work out in this example is, as you might have
noticed, for which $v$ we have $v(SUN) !!OR!! (v(RAIN) !!AND!! (!!NOT!! v(SUN))) =
1$. Basically, you need to go through all the valuations and calculate the
value of the Boolean expression. This is tedious work! In the next chapter,
we'll discuss methods for making our lives a bit easier using the method of
truth-tables for this. 

This is, in a nutshell, the standard implementation of the Boolean semantics
for propositional logic. Let's use it to check some inferences for deductive validity!

We'll do two examples: 

- We'll show that {{< img src="img/ds_inf.png" class="inert-img" height="38px" style="vertical-align: middle;" >}} is deductively valid, i.e. {{< img src="img/ds_val.png"
class="inert-img" height="38px" style="vertical-align: middle;" >}}

- We'll show that {{< img src="img/aff_inf.png" class="inert-img" height="38px" style="vertical-align: middle;" >}} is deductively invalid, i.e. {{< img src="img/aff_val.png"
class="inert-img" height="38px" style="vertical-align: middle;" >}}

The first inference is an instance of $Disjunctive Syllogism$, which we've
identified as a paradigmatic example of valid inference. Here, we'll show that
the concrete instance is valid. In the exercises, you'll show that the general
_schema_ is valid for all instances.

To test the inference for validity, what we need to do is to check whether the following condition is satisfied:

{{< img src="img/ds_condition.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

So, let's check in logical space:

{{< img src="img/ds_validity.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="800px">}}

Indeed! Once we've worked out the relevant propositions, we can see that the only member of {{< img src="img/proposition_intersection.png"
class="inert-img" height="32px" style="vertical-align: middle;" >}} is $M₄$, in which it is raining, i.e. $v₄(RAIN) = 1 $ and so $M₄ ∈ [RAIN]$. But that just means that our condition is satisfied:

{{< img src="img/ds_condition.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="500px">}}

We can conclude that, indeed, {{< img src="img/ds_val.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="500px">}}

The second inference is an instance of $Affirming a Disjunct$, which we've
identified as a traditional fallacy. Let's see. For the inference to be valid, the following would need to be the case:

{{< img src="img/aff_condition.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

When we check logical space, we find the following:

{{< img src="img/aff_countermodel.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="800px">}}

Once we've worked out the propositions, we can see that {{< img src="img/countermodel.png"
class="inert-img" height="40px" style="vertical-align: middle;" >}}. This makes $M₁$ a **countermodel** for the inference, which shows that 

{{< img src="img/aff_inval.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="500px">}}

This means that, indeed: {{< img src="img/aff_val.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="500px">}}

Note, however, that the invalidity crucially depends on us interpreting {{< img src="img/disjunction.png"
class="inert-img" height="32px" style="vertical-align: middle;" >}} using $!!OR!!$. If we read the operation as an $!!XOR!!$, the story changes—which you'll see in the exercises.

## Further readings

- George Boole's [The Laws of Thought](https://en.wikipedia.org/wiki/The_Laws_of_Thought) is an enticing _historical_ read.
