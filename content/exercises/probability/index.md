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

## c)

$$Pr(\mathsf{HEADS})=0.7\quad Pr(\mathsf{TAILS})=0.3\qquad
Pr(\mathsf{HEADS}\land\mathsf{TAILS})=0$$

## d)

$$Pr(\mathsf{HEADS}\land\mathsf{TAILS})=1$$

## e)

$$Pr(\mathsf{HEADS})=0\qquad Pr(\mathsf{HEADS}\land\mathsf{TAILS})=0$$

# Probability truth-tables


# Inductive validity

# Research 



# Discussion


