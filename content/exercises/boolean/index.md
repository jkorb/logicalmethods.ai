---
title: Boolean algebra
author: Johannes Korbmacher
locked: false
weight: 40
params: 
  id: exc-bool
  math: true
---

# Relay logic

In the chapter you've learned about **relay logic**, that is the implementation
of the Boolean functions using the $default "off"$ and $default "on"$ relay:

{{< img src="img/relays.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="400px">}}

We showed how to make circuits which behave just like !!NOT!! and !!AND!! using these relays. As a reminder, here are the concrete implementations:

<div class="text-center">
{{< img src="img/conjunction_impl.png" class="rounded mx-auto inert-img img-fluid my-4" width="400px">}}
{{< img src="img/negation_impl.png" class="rounded mx-auto inert-img img-fluid my-4" width="400px">}}
</div>

Note that we've depicted all possible configurations of the relay to
demonstrate that the circuit behaves "according to spec", that is: just like
the corresponding Boolean truth-function.

For this exercise, you'll implement some more Boolean truth-functions using
relays. You can draw the diagrams in whatever way works and clearly illustrates
the idea. To show what I mean, here's one way to simplify the diagram for the
!!AND!!-circuit (in the configuration for both inputs being $1$):

{{< img src="img/simplified_circuit.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="200px">}}

Make sure that to verify that your circuit is according to spec! Note that you may need both kinds of relays for the implementations.

1. Implement !!OR!!. 

{{< img src="img/or_table.png" class="rounded mx-auto d-block inert-img img-fluid " width="200px">}}

2. Implement !!XOR!!

{{< img src="img/xor_table.png" class="rounded mx-auto d-block inert-img img-fluid " width="200px">}}

3. Implement !!NAND!!

{{< img src="img/nand_table.png" class="rounded mx-auto d-block inert-img img-fluid " width="200px">}}



# Defining functions

We've mentioned the idea of truth-functional completeness: we can express _all_
truth-functions purely in terms of !!NOT!!, !!AND!!, and !!OR!!. 

To illustrate what this means, here's how we express !!OR!! in terms of !!NOT!! and !!AND!!. First, we write !!OR!! as a Boolean expression with two variables, which represent the two inputs:

```

```

Using the function table for !!OR!!, we can calculate the value of this expression for all values of `X` and `Y`. The representation of !!OR!! in terms of !!NOT!! and !!AND!! is, then, the following Boolean expression:

```
!!NOT!! ((!!NOT!! X) !!AND!! (!!NOT!! Y))
```

We (by which I mean you 😉), we can verify this by going through the possible values for `X` and `Y` and check that for each such value, we have that:

```
X !!OR!! Y = !!NOT!! ((!!NOT!! X) !!AND!! (!!NOT!! Y))
```

1. Verify this equation for all values of `X` and `Y`.

2. Represent !!XOR!! in terms of !!NOT!!, !!AND!!, and !!OR!!.

3. Represent !!NAND!! in terms of !!NOT!! and !!AND!!.

4. Here's an interesting one: represent !!NOT!! in terms of !!XOR!!.

# Boolean laws 

Use the laws of Boolean algebra to derive the following equation:

```
X !!AND!! (Y !!OR!! Z) = X !!OR!! (Y !!AND!! Z)
```

# Addition

We've studied how you can add two numbers in binary. We'll use this to verify the equation: $$5 + 7 = 12.$$

1. Transform the summands 5 and 7 into binary notation. The result will be 3-bit
   binary numbers.

2. Calculate each bit of the sum step by step using the Boolean functions for
   the full adder (note that you must initialize the carry to `0` for the first
calculation to work). 

# Models

Suppose that we have a language $L$ with three propositional variables $RED$, $BLUE$, and $GREEN$, which we use to reason about the color of a pixel in the [RGB color model](https://en.wikipedia.org/wiki/RGB_color_model).

1. Determine all the valuations for that language. 

2. If we change our language $RED₁$, $BLUE₁$, and $GREEN₁$ to talk about the
   color of a first pixel, and $RED₂$, $BLUE₂$, and $GREEN₂$ to talk about the
color of a second pixel, what happens to the number of valuations?

3. How many valuations are there in the language that has a propositional variable for each RGB-value of each pixel on a [4K-resolution screen](https://en.wikipedia.org/wiki/4K_resolution). (You can't actually calculate that value, but you can write an expression that represents it.)

# Deductive inference

{{< img src="img/jimmy_inference.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

1. Translate the inference into a suitable formal language.

2. Determine whether the formal inference is valid using Boolean logic.

# Logical laws

So far, we've only shown of _particular_ inferences (about the weather or
little Jimmy) that they are valid or invalid. For this exercise, you'll show
that _all_ inferences of a certain form are valid, regardless what they're
about. 

For this, we'll focus on _disjunctive syllogism_, which we take to be the
following inference schema, where $A$ and $B$ can be _any_ two formulas whatsoever:

{{< img src="img/disjunctive_syllogism.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="175px">}}

To show that this inference is valid, following the definition of deductive
validity, we need to show that:

{{< img src="img/ds_validity_condition.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="200px">}}

This means, according to the definition of $⊆$, that we need to show that any
valuation $v$:

{{< img src="img/ds_if_then.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="400px">}}

This is the claim, we'll set out to show:

1. Assume that $v$ is an arbitrary valuation, meaning you don't know anything
   about, such as which values it assigns to which formula. Assume further that {{< img src="img/in_set_inline.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}. Apply the definition of 
   $$[A] = { v : v(A) = 1},$$ 
   as well as the definition of intersection as 
   {{< img src="img/intersection_definition.png" class="rounded mx-auto d-block inert-img img-fluid my-2" width="300px">}}

   to infer what this means for the values of $A v B$ and $¬A$ under $v$.

2. Using the general clauses for calculating the values under an assignment,

   {{< img src="img/clauses.png" class="rounded mx-auto d-block inert-img img-fluid my-2" width="300px">}}

   to transform the result of a last step into two Boolean equations.

3. "Solve" this Boolean equation for the value $v(B)$ of $B$, that is infer
   what that value must be. Conclude from this that {{< img src="img/ds_then.png" class="inert-img" height="38px" style="vertical-align: middle;" >}} and the inference is valid.
