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

# Monotonicity {.solved}

## a) Deduction

Give an argument that if an inference is deductively valid, then adding
additional premises doesn’t cancel the validity of the inference.

## b) Induction {.homework}

Why does this argument fail for inductive logic?


## Solution {#monotonicitySolution .solution}

**a)**

Deductive validity is necessary. Suppose $A\vDash C$. Necessarily, if $A$ is
true, $C$ is true. If we consider any possibility where $A\land B$ is true, it
also makes $A$ true, which means that is has to make $C$ true (based on what we
just observed). So $A\land B\vDash C$.

**b)**

Inductive validity isn't necessary. $A\mid\!\approx C$ only tells us that when
$A$ is true, *it is likely* that $C$ is true. This does not guarantee that when
$A\land B$ is true, *it is equally likely* that $C$ is true. Sometimes new
information $B$ lowers or cancels out the probability of $C$. 

# Validity {.homework .solved}

For every invalid inference, it’s possible to add one or more premises to make it
valid. Why? 

## Solution {#validitySolution .solution}

If you have an invalid inference $P_1,\ldots, P_n\nvDash C$ you can just add $C$ on the premise side and you get a valid inference $C,P_1,\ldots, P_n\vDash C$.

# Truth-Preservation {.solved}

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

## Solution {#truth-preservationSolution .solution}


**a)**

Yes. Just fill in any valid logical form with a false premise. Maddy the pig
example.

**b)**

Yes. Just fill in any valid logical form with a false conclusion.

**c)**

No. That contradicts the definition of validity.

**d)**

No. If an inference preserves truth always, then it preserves truth most of the
time. You can illustrate with standard 'definitional' rules for the logical
connectives, which are easily seen to be inductively valid. $A\land B\vDash A$
and $A\vDash A\lor B$ etc.

**e)** z Yes. Take any strong conditional probability with a false condition.
The moon is made of cheese, so its probably delicious.

**f)**

Yes. Take any strong conditional probability with a false outcome.

**g)**

Yes. Because inductive validity is not necessary.

**h)**

Yes. For example, any strong, statistical reasoning.


# Semantic tools {.solved}

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

## Solution {#semantic-toolsSolution .solution}


**a)**

$X\subseteq Y$ means all elements of set $X$ are elements of set $Y$.
$Y\subseteq Z$ means all elements of set $Y$ are elements of set $Z$. Then it
must be true that all elements of set $X$ are elements of set $Z$.

**b)**

The intersection $X\cap Y$ is the overlapping part of $X$ and $Y$. So the
elements of $X\cap Y$ have to be elements of $X$. That means $X\cap Y\subseteq
X$. And the elements of $X\cap Y$ have to be elements of $Y$. That means $X\cap
Y\subseteq Y$.

# Research {.solved}

Note: These questions _require_ you to research the answer yourself using reliable academic sources. You need to reference your sources!

**Reasoning**

Are all forms of "good" reasoning either deductive or inductive?

## Solution {#researchSolution .solution}

Try to give positive feedback on any interesting answer that shows some work.
Here is one possible answer. 

We defined induction by probablistic support. That is pretty much the broadest
notion of truth-preservation we can define. If truth is all that matters then
all good reasoning would have to be deductive or inductive. But there are
theories of reasoning that say that some reasoning methods are good for other
reasons apart from tracking truth. For example, some people think that
*inference to the best explanation* is a good reasoning strategy, but the notion
of "best" explanation depends on contingent scientific values of a community.

# Discussion {.solved}

Inductive logic in general is non-monotonic because new (premise) information
can turn a valid inference into an invalid inference. But what if we know
something about _how_ a new piece of information _relates_ to our old premises?
Some versions of inductive logic support 'limited' versions of monotonicity
based on situations where new information (the '$B$' premises in these examples)
comes from the right place. Do you think these limited forms of monotonicity are
correct? Explain your answer.

a) Cautious Monotonicity: If $A \mid\approx C$ and $A \mid\approx B$, then $
A\land B \mid\approx C $

b) Rational Monotonicity: If $A \mid\approx C$ and not $A \mid\approx \neg B$,
then $ A\land B \mid\approx C $

## Solution {.solution #discussionSolution}

There are theoretical assumptions behind the concept of inductive support. So
the student can try to explain some assumptions that *verify* these rules. They
can also try to explain why the rules *fail* for standard conditional
probabilities.

Here an example for **Cautious Monotonicity**. You have a population of toys in
different shapes: monsters, aliens, dinosaurs. Every toy is red, blue, green,
purple, or yellow. Almost all toys are yellow. The few green toys are all
dinosaurs, and the few red toys are all dinosaurs. There are a lot of yellow
dinosaurs too. With $A=$ dinosaur, $B=$ red, $C=$ green, we could have
probabilities like this.

$P(B|A)=0.2$ greater than $P(B)=0.1$

$P(C|A)=0.2$ greater than $P(C)=0.1$

$P(C|A\land B)=0$ becuase no green toy is a red dinosaur toy.
