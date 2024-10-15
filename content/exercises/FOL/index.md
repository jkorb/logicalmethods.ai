---
title: FOL
author: Johannes Korbmacher
weight: 8
params: 
  id: exc-fol
  math: true
---

# Models {.homework}

_Only 3. and 6. are homework_

Suppose we're dealing with a FOL language with:

+ constants $a,b$
+ a unary predicate $P$ 
+ a binary predicate $R$

Consider the model given by the following diagram:

{{< img src="img/model.jpeg" class="img-thumbnail" >}}

To be clear: 

+ the objects may be called $o_1,o_2,o_3$ (from left to right)
+ the denotations $a^\mathcal{M}, b^\mathcal{M}$ are given by the subscripts
+ the interpretation of $P^\mathcal{M}$ is given by the red square
+ the interpretation of $R^\mathcal{M}$ is given by the arrows (an arrow from
one node to another means that the first node stands in the relation to the
other in the model).

Determine the truth-value of the following formulas in the model:

1. $P(a)\land P(b)$
2. $\forall x P(x)$
3. $\exists x P(x)\land \exists x\neg P(x)$
4. $\forall x\exists yR(x,y)$
5. $\forall x\forall y((P(x)\land R(x,y))\to P(y))$
6. $\forall x\exists y(R(y,x)\land P(y))$

Don't just give the truth-value but provide a justification with reference to
the recursive clauses. Ideally but not necessarily, this would be a
calculation.

# Knowledge engineering

[Russel and Norvig](https://elibrary.pearson.de/book/99.150005/9781292401171)
(p. 290) define a 7-step process of **knowledge engineering** in FOL. We'll only
focus on a part of this, viz.:

+ Deciding on a suitable vocabulary (constants, function symbols, and
predicates)

+ Encoding general knowledge about the domain.

We'll practice the idea by doing. Remember our setup from Exercise 4 for Chapter
5 (the planning exercise):

> **Setup**: We've got a robot that sits in front of two switches, one on the
> left and one on the right. Each switch controls a lamp, the left switch
> controls the left lamp and the right switch the right lamp. The switches work
> as follows: 
> 
> + If a lamp is on and you operate the switch, the lamp turns off.
> + If a lamp is off and you operate the switch, the lamp turns on.
> 
> The left lamp is currently on and the right one is off. The robot can operate
> the switches and has the following goal:
> 
> + Turn the left lamp off and the right one on.
> 
> + We think of the situation as made up of
>   [discrete](https://en.wikipedia.org/wiki/Discrete) time points,
>   $1,2,\dots,n$.
>
> We include the  [frame
> conditions](https://en.wikipedia.org/wiki/Frame_problem) to avoid "weird"
> behavior like lamps switching on/off by themselves:
>
>  + If a lamp is on at a given time and the corresponding switch is _not_
>    flipped, the light is still on at the ext time.
>
>  + If a lamp is off at a given time and the corresponding switch is _not_
>    flipped, the light is still off at the next time.

**Choose an appropriate FOL vocabulary and encode our knowledge about the
domain.**


# Consequence

This exercise is about how logical laws follow from Boolean laws. Each of the
following two parts contains a Boolean law and a corresponding logical law/valid
inference that follows from it. In both cases: first, (i) provide an argument that
the Boolean law holds and then, (ii) show that the logical law follows from
that. 

## a)


$$\text{Boolean law}: x+(y_1\times y_2\times \dots)=(x+y_1)\times (x+y_2)\times \dots$$

$$\text{Logical law}: \mathsf{Blue}(a)\lor \forall x \mathsf{Round}(x)\vDash \forall x(\mathsf{Blue}(a) \lor\mathsf{Round}(x))$$

## b) {.homework}

$$\text{Boolean law}: x\times (y_1+ y_2+ \dots)=(x\times y_1)+ (x\times y_2)+ \dots$$

$$\text{Logical law}: \mathsf{Blue}(a)\land \exists x \mathsf{Round}(x)\vDash
\exists x(\mathsf{Blue}(a)\land \mathsf{Round}(x)) $$



# Counter-models

The following inferences are _in_valid in FOL. For each, describe a
**counter-model**, where the premises are true but the conclusion is false. You
may use a diagram as in Exercise 1 to give your model.

## a) 

$$\exists x\mathsf{CanSwim}(x)\land \exists y\mathsf{CanFly}(y)\nvDash \exists x(\mathsf{CanSwim}(x)\land\mathsf{CanFly}(x))$$

## b) {.homework}

$$\forall x(\mathsf{CanSwim}(x)\lor \mathsf{CanFly}(x))\nvDash \forall x\mathsf{CanSwim}(x)\lor\forall y\mathsf{CanFly}(y)$$


## c) 

$$\forall x(\mathsf{Tresspasses}(x)\to \mathsf{IsProsecuted}(x))\nvDash \exists x(\mathsf{Tresspasses}(x)\land \mathsf{IsProsecuted}(x)$$

## d) 

$$\forall x\exists y\mathsf{BiggerThan}(y,x)\nvDash\exists y\forall x \mathsf{BiggerThan}(y,x)$$

_Hint_: A model can be **infinite**, which you indicate with "..." notation.

In each case, justify your answer, by explaining why the premises are true in the model and the conclusion is false.

# Research {.homework}

In class, we said that FOL is _very_ expressive. But there are several
limitations of FOL, which are things that you _can't_ formalize in FOL.
Research at least two kinds of claims that FOL can't formalize and explain why.

# Discussion

When we use modern subsymbolic AIs, such as LLMs, for [reasoning](https://arxiv.org/abs/2312.11562), these AIs turn out to be _inconsistent_: they sometimes say one thing and sometimes the opposite. Does this mean that the problem posed by Gödel's theorem for mathematical AIs doesn't affect subsymbolic AIs?
