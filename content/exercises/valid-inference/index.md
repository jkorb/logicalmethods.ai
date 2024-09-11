---
title: Valid inference
author: Colin Caret
weight: 2
params: 
  id: exc-val
  math: true
---

# Deduction and Induction

Give an example of one for each of the following:

## a) {.homework}

A deductively valid inference

## b) 

A deductively invalid inference

## c) 

An inductively valid inference

## d) {.homework}

An inductively invalid inference

# Monotonicity

## a) Deduction

Give an argument that if an inference is deductively valid, then adding
additional premises doesn’t cancel the validity of the inference.

## b) Induction {.homework}

Why does this argument fail for inductive logic?

# Validity {.homework}

For every invalid inference, it’s possible to add one or more premises to make it
valid. Why? 

# Truth-Preservation

Which of the following is possible? Make your answer clear and precise, by
showing how the definition of deductive validity and the definition of inductive
validity/strength relate to these questions.

## a) 

Can an inference be deductively valid and have a false premise?

## b) 

Can an inference be deductively valid and have a false conclusion?

## c) 

Can an inference be deductively valid, have true premises, and have a false conclusion?

## d) 

Can an inference be deductively valid but inductively invalid?

## e) 

Can an inference be inductively valid and have a false premise?

## f) 

Can an inference be inductively valid and have a false conclusion?

## g) 

Can an inference be inductively valid, have true premises, and have a false conclusion?

## h) 

Can an inference be inductively valid but deductively invalid?

# Semantic tools

Explain the following facts:

## a) 

The subset relation, defined in {{< chapter_ref chapter="valid-inference" id="semantic-methods-for-deduction" >}}
2.3.1 {{< /chapter_ref >}}, has the following property:

+ If $X\subseteq Y$ and $Y\subseteq Z$, then $X\subseteq Z$.

_Note_: This property is called "transitivity".

## b) {.homework}

Remember that the intersection $X\cap Y$ of two sets $X,Y$ is the overlapping
part of those two sets. We have that $X\cap Y\subseteq X$ and $X\cap Y\subseteq
Y$.

# Research

Note: These questions _require_ you to research the answer yourself using reliable academic sources. You need to reference your sources!

**Reasoning**

Are all forms of "good" reasoning either deductive or inductive?

# Discussion

Inductive logic in general is non-monotonic because new (premise) information can turn a valid inference into an invalid inference. But what if we know something about _how_ a new piece of information _relates_ to our old premises? Some versions of inductive logic support 'limited' versions of monotonicity based on situations where new information (the '$B$' premises in these examples) comes from the right place. Do you think these limited forms of monotonicity are correct? Explain your answer.

a) Cautious Monotonicity: If $A \mid\approx C$ and $A \mid\approx B$, then $ A\land B \mid\approx C $

b) Rational Monotonicity: If $A \mid\approx C$ and not $A \mid\approx \neg B$, then $ A\land B \mid\approx C $
