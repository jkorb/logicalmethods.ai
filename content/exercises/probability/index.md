---
title: Logic and probability
author: Johannes Korbmacher
weight: 11
params: 
  id: exc-prob
  math: true
---

# Probability functions

Suppose we're dealing with a coin-flip, which we analyze in a propositional
language with $\neg,\land,\lor$ and propositional variables:

$$\mathsf{HEADS}\mid \mathsf{TAILS}.$$

Our aim is to define a probability for each formula $A\in\mathcal{L}$. 
We're wondering whether a given set of conditions is sufficient for this
purpose.

Since the general question whether a given condition defines a total probability
function is a bit too complicated at this point, we'll work with the following
four formulas as our test cases:


1) $\neg\mathsf{HEADS}$
2) $\neg\mathsf{TAILS}$
3) $\mathsf{HEADS}\lor \mathsf{TAILS}$
4) $\mathsf{HEADS}\land\mathsf{TAILS}$

For each of the following sets of conditions, check whether they determine the
probabilities of all of the above formulas by calculating them using the
probabilistic laws. If there's information missing, say exactly which
information is missing and why you can't calculate the value of the given
formula.

## a) 

$$Pr(\mathsf{HEADS})=\frac{1}{2}\quad Pr(\mathsf{TAILS})=\frac{1}{2}$$


## b) 

$$Pr(\mathsf{HEADS}\lor\mathsf{TAILS})=\frac{1}{2} \qquad Pr(\mathsf{HEADS}\land\mathsf{TAILS})=\frac{1}{2}$$

## c) {.homework}

$$Pr(\mathsf{HEADS})=0.7\quad Pr(\mathsf{TAILS})=0.3\qquad
Pr(\mathsf{HEADS}\land\mathsf{TAILS})=0$$

## d)

$$Pr(\mathsf{HEADS}\land\mathsf{TAILS})=1$$

## e) {.homework}

$$Pr(\mathsf{HEADS})=0\qquad Pr(\mathsf{HEADS}\land\mathsf{TAILS})=0$$

# Probability laws

Derive the following laws for probabilities from the axioms:

## a)

$$Pr(A)\leq 1,\text{ for all }A\in\mathcal{L}$$


## b)

If $A\vDash B$, then $Pr(A)\leq Pr(B)$

_Hint_: Remember that if $A\vDash B$, then $\vDash\neg(A\land \neg B)$ and $B$
is equivalent to $A\lor B$.

## c)

$$Pr(A\lor B)=Pr(A)+Pr(B)-Pr(A\land B)$$

# Probability truth-tables

Remember our probability function for the fair die:

$$Pr_{\text{fair}}(\mathsf{RESULT}_i)=\frac{1}{6}\text{, for }i=1,\dots,6$$
$$Pr\_{\text{fair}}(\mathsf{RESULT}_i\land \mathsf{RESULT}_j)=0\text{, for all }i\neq
j$$
$$Pr\_{\text{fair}}(\neg\mathsf{RESULT}_1\land \dots\land\neg\mathsf{RESULT}_6)=0$$

_Note_: I had forgotten the third rule in the textbook, but it's necessary and
added there now, too.

## a)

Use the probability truth-table method to give a probability function for an
_un_fair die, where it's twice as likely that 6 comes up than any other number,
while still exactly one number comes up.

## b)

Making use of appropriate formalizations, calculate the probabilities of the
following claims according to the table:

1. The result is even.
2. The result is odd.
3. The result is neither even nor odd.
4. The result is divisible by 3.

# Inductive validity

Take the probability function for the unfair die in the previous exercise.
Using appropriate formalizations, determine whether the following inferences
are (weakly) inductively valid:

## a) {.homework}

The die came up odd, so it's likely a 3 or 5.

## b) 

The die came up odd, so it's likely a 6.

## b)

The die came up even, so it's likely a 2.

## c) {.homework}

The die came up even, so it's likely a 6.

# Measures of inductive strength

Inductive logicians have proposed different measures of the inductive strength
of an argument.

We've effectively seen:

$$Pr(C|P_1\land P_2\land\dots)-Pr(C)$$

A popular alternative measure is: 

$$\log\frac{Pr(C|P_1\land P_2\land\dots)}{Pr(C)}$$

Here $\log$ is the [logarithm
function](https://en.wikipedia.org/wiki/Logarithm) with basis $2$.

Using a suitable computer (for calculating the $\log$'s), compare the two
measures by plugging in values for:
$$Pr(C)$$
$$Pr(C|P_1\land P_2\land\dots)$$ 

What are the differences between the two measures, where do they work better,
where worse?

# Discussion {.homework}

Our notion of valid inductive inference has as a consequence that if
$$P_1,P_2,\dots\mid\approx C,$$ then $$P_1,P_2,\dots\mid\approx C\land D,$$ for
arbitrary $D$ (check you understand why!!). Some authors think that this is a
problem, because the $D$ might be completely irrelevant to the inference at
hand. Do you think this is a problem? Justify your answer in one or two
paragraphs, making use of an example.
