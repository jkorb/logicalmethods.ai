---
title: FOL
author: Johannes Korbmacher
locked: true
weight: 80
params: 
  id: exc-fol
  math: true
---

# Models {.homework .solved}

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

## Solution {.solution #modelsSolution }

**1.**
$a^M\in P^M$ so $\nu(P(a))=1$ and $b^M\in P^M$ so $\nu(P(b))=1$.
Then for the full formula we have $\nu(P(a)\land P(b))=\nu(P(a))\times\nu(P(b))=1\times 1=1$

**2.**
On any assignment $\alpha$ we have $\nu_\alpha(P(\mathbf{o_3}))=0$.
Then for the full formula we have $\nu_\alpha(\forall xP(x))=\Pi_{\mathbf{o}\in D}(P(\mathbf{o}))=0$

**3.**
On any assignment $\alpha$ we have $\nu_\alpha(P(\mathbf{o_1}))=1$ and so for the quantified formula $\nu_\alpha(\exists xP(x))=\Sigma_{\mathbf{o}\in D}(P(\mathbf{o}))=1$. Similarly we have $\nu_\alpha(\neg P(\mathbf{o_3}))=-\nu_\alpha(P(\mathbf{o_3}))=-0=1$ and so for the quantified formula $\nu_\alpha(\exists x\neg P(x))=\Sigma_{\mathbf{o}\in D}(\neg P(\mathbf{o}))=1$.
Then for the full formula we have $\nu_\alpha(\exists xP(x)\land \exists x\neg P(x)=1)$

**4.**
$\forall x\exists yR(x,y)$

The formula is true.

Here's the calculation:

We know:

$$\nu(\forall x\exists yR(x,y))=
\nu(\exists yR(\mathbf{o_1},y))
\times
\nu(\exists yR(\mathbf{o_2},y))
\times
\nu(\exists yR(\mathbf{o_3},y))$$

For each $i=1,2,3$, we have:
$\nu(\exists yR(\mathbf{o_i},y))=
\nu(R(\mathbf{o_i},{o_1}))
+\nu(R(\mathbf{o_i},{o_2}))
+\nu(R(\mathbf{o_i},{o_3}))$

And for each $i$, one of the summands here is true: for $i=1$, we have 
$\nu(R(\mathbf{o_1},\mathbf{o_2})=1$, for $i=2$, we have $\nu(R(\mathbf{o_2},\mathbf{o_3})=1$, and for $i=3$, we have $\nu(R(\mathbf{o_3},\mathbf{o_3})=1$. Hence:
$\nu(\exists yR(\mathbf{o_i},y))=
\nu(R(\mathbf{o_i},{o_1}))
+\nu(R(\mathbf{o_i},{o_2}))
+\nu(R(\mathbf{o_i},{o_3}))=1$.

And so the big product is $1$, too.

**5.**
$\forall x\forall y((P(x)\land R(x,y))\to P(y))$

The formula is false: $\mathbf{o_2}$ and $\mathbf{o_3}$ provide the counterexample:

$$\nu(P(\mathbf{o_2}))=1$$
$$\nu(R(\mathbf{o_2},\mathbf{o_3}))=1$$
$$\nu(\mathsf{P}(\mathbf{o_3}))=0$$

Hence $$\nu(P(\mathbf{o_2})\land R(\mathbf{o_2},\mathbf{o_3})\to P(\mathbf{o_3}))=0$$

This makes any $\prod$-product involving this value $0$ as well.

**6.**
We will observe a fact about the left object $\mathbf{o_1}$. On any assignment, if we choose any object $\mathbf{o}$ at all, we have $\nu_\alpha(R(\mathbf{o},\mathbf{o_1})=0$ and so $\nu_\alpha(R(\mathbf{o},\mathbf{o_1}\times P(\mathbf{o}))=0$. That means, if we sum over all objects in the $\mathbf{o}$ position we have $\Sigma_{\mathbf{o}\in D}(\nu_\alpha(R(\mathbf{o},\mathbf{o_1}))\times\nu_\alpha(P(\mathbf{o})))=0$. Since this sum comes out false for the particular object $\mathbf{o_1}$, if we then do a product calculation over all objects $\mathbf{o'}$ in that same position we get $\Pi_{\mathbf{o'}\in D}\Sigma_{\mathbf{o}\in D}(\nu_\alpha(R(\mathbf{o},\mathbf{o'}))\times\nu_\alpha(P(\mathbf{o})))=0$.
And that is precisely how to calculate the value of our formula $\nu_\alpha(\forall x\exists y(R(y,x)\land P(y)))=0$.


# Knowledge engineering {.solved}

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


## Solution {.solution #knowledge-engineeringSolution}

**BNF:** We use 'left' and 'right' as names of the lamps on each side, and use numeric terms as names of infinitely many points in time going forward. This comes with a built-in operation of '+1' to refer to the next moment in time. Notice that predicates are restricted. They can only be combined with a lamp term in the first position and a time term in the second position.

$$ \langle{var}\rangle ::= x \mid y \mid z $$

$$ \langle{const\_side}\rangle ::= \mathsf{left} \mid \mathsf{right} $$

$$ \langle{const\_time}\rangle ::= n\in\mathbb{N} $$

$$ \langle{term\_side}\rangle ::= \langle{var}\rangle \mid \langle{const\_side}\rangle $$

$$ \langle{term\_time}\rangle ::= \langle{var}\rangle \mid \langle{const\_time}\rangle $$

$$ \langle{unop}\rangle ::= \neg $$

$$ \langle{binop}\rangle ::= \land \mid \lor \mid \rightarrow \mid \leftrightarrow $$

$$ \langle{quant}\rangle ::= \forall \mid \exists $$

$$ \langle{pred}\rangle^2 ::= \mathsf{On} \mid \mathsf{Off} \mid \mathsf{Switch} $$

$$ \langle{atom}\rangle ::= \langle{pred}\rangle^2(\langle{term\_side}\rangle,\langle{term\_time}\rangle) $$

$$ \langle{fml}\rangle ::= \langle{atom}\rangle \mid \langle{unop}\rangle\langle{fml}\rangle \mid (\langle{fml}\rangle\langle{binop}\rangle\langle{fml}\rangle) \mid \langle{quant}\rangle\langle{var}\rangle\langle{fml}\rangle $$

<br>

**Task:** Formalization

Setup

+ $\mathsf{On}(\mathsf{left},1)$
+ $\mathsf{Off}(\mathsf{right},1)$

Goals

+ $\exists x\mathsf{Off}(\mathsf{left},x)$
+ $\exists x\mathsf{On}(\mathsf{right},x)$

Rules

+ $\forall x\forall y(\mathsf{Off}(x,y)\leftrightarrow\neg\mathsf{On}(x,y))$
+ $\forall x\forall y((\mathsf{On}(x,y)\land\mathsf{Switch}(x,y))\to\mathsf{Off}(x,y+1))$
+ $\forall x\forall y((\mathsf{Off}(x,y)\land\mathsf{Switch}(x,y))\to\mathsf{On}(x,y+1))$

Frames

+ $\forall x\forall y((\mathsf{On}(x,y)\land\neg\mathsf{Switch}(x,y))\to\mathsf{On}(x,y+1))$
+ $\forall x\forall y((\mathsf{Off}(x,y)\land\neg\mathsf{Switch}(x,y))\to\mathsf{Off}(x,y+1))$

# Consequence {.solved}

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

## Solution {.solution #consequenceSolution}


**a)**
$x+(y_1\times y_2\times\ldots)=(x+ y_1)\times(x+ y_2)\times\ldots$ follows from n-many applications of the Boolean law of absorption

relation to logical law???

**b)**
First of all, this principle follows from repeated applications of the Boolean law of distributivity:
$x\times(y_1+ y_2+\ldots)=(x\times y_1)+(x\times y_2)+\ldots$

Now, we can use this to verify the following inference.

$$\mathsf{Blue}(a)\land\exists x\mathsf{Round}(x)\vDash \exists x(\mathsf{Blue}(a)\land \mathsf{Round}(x))$$

Consider any model with assignment $\alpha$ where the premise is true:

$$\nu_\alpha(\mathsf{Blue}(a)\land\exists x\mathsf{Round}(x))=1$$

If we break down this calculation it is equivalent to:

$$\nu_\alpha(\mathsf{Blue}(a))\times\Sigma_{\mathbf{o}\in D} \nu_\alpha(\mathsf{Round}(\mathbf{o}))=1$$

The 'big' summation over all objects in the domain is equivalent to a list of individual sums over each object $\mathbf{o_i}$ in the domain:

$$\nu_\alpha(\mathsf{Blue}(a))\times(\nu_\alpha(\mathsf{Round}(\mathbf{o_1})+\nu_\alpha(\mathsf{Round}(\mathbf{o_2})+\ldots)=1$$

If we apply the Boolean principle that we started with, we get:

$$(\nu_\alpha(\mathsf{Blue}(a))\times\nu_\alpha(\mathsf{Round}(\mathbf{o_1}))+(\nu_\alpha(\mathsf{Blue}(a))\times\nu_\alpha(\mathsf{Round}(\mathbf{o_2}))+\ldots=1$$

This is equivalent to the following 'big' summation over all objects:

$$\Sigma_{\mathbf{o}\in D}(\nu_\alpha(\mathsf{Blue}(a))\times\nu_\alpha(\mathsf{Round}(\mathbf{o}))=1$$

Finally, the calculation above is the truth-value of our conclusion formula:

$$\nu_\alpha(\exists x(\mathsf{Blue}(a)\land\mathsf{Round}(x)))=1$$

We have shown that $[\mathsf{Blue}(a)\land\exists x\mathsf{Round}(x)]\subseteq[\exists x(\mathsf{Blue}(a)\land \mathsf{Round}(x))]$.

# Counter-models {.solved}

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

## Solution {.solution #counter-modelsSolution}


**a)**
We need a set of swimmers $\mathsf{CanSwim}^M$ and a set of flyers $\mathsf{CanFly}^M$. We need one person/object that only belongs to the first set $a^M\in \mathsf{CanSwim}^M$ and $a^M\notin \mathsf{CanFly}^M$. Then we need another person/object that only belongs to the second set $b^M\notin \mathsf{CanSwim}^M$ and $b^M\in \mathsf{CanFly}^M$.

**b)**
We construct a model with a domain with just two animals in it $D=\{ \mathbf{a_1,a_2} \}$. One animal swims $\mathbf{a_1}\in \mathsf{CanSwim}^M$ but can't fly $\mathbf{a_1}\notin \mathsf{CanFly}^M$. The other animal can't swim $\mathbf{a_2}\notin \mathsf{CanSwim}^M$ but does fly $\mathbf{a_2}\in \mathsf{CanFly}^M$. Let $\alpha$ be any assignment in this model. 

This universal formula is false in this model $\nu_\alpha(\forall x(\mathsf{CanSwim}(x))=\Pi_{\mathbf{o}\in D}\nu_\alpha(\mathsf{CanSwim}(\mathbf{o}))=0$ because of the properties of the second animal $\mathbf{a_2}\notin \mathsf{CanSwim}^M$. This universal formula is false in this model $\nu_\alpha(\forall x(\mathsf{CanFly}(x))=\Pi_{\mathbf{o}\in D}\nu_\alpha(\mathsf{CanSwim}(\mathbf{o}))=0$ because of the properties of the first animal $\mathbf{a_1}\notin \mathsf{CanFly}^M$. That means that $\nu_\alpha(\forall x(\mathsf{CanSwim}(x)\lor\forall x(\mathsf{CanFly}(x))=0$.

However, we always get $\nu_\alpha(\mathsf{CanSwim}(\mathbf{o})\lor\mathsf{CanFly}(\mathbf{o}))=1$ no matter which object we test it on, so we have $\nu_\alpha(\forall x(\mathsf{CanSwim}(x)\lor\mathsf{CanFly}(x))=\Pi_{\mathbf{o}\in D}\nu_\alpha(\mathsf{CanSwim}(\mathbf{o})\lor\mathsf{CanSwim}(\mathbf{o}))=1$.
This makes it a counter-model to the intended inference.

# Research {.homework .solved }

In class, we said that FOL is _very_ expressive. But there are several
limitations of FOL, which are things that you _can't_ formalize in FOL.
Research at least two kinds of claims that FOL can't formalize and explain why.

## Solution {.solution #researchSolution}

Here are two phenomena that FOL can't handle well:

1. Higher-order quantification: Statements like "Ada has all the properties of a good student", which should be something like $$\forall F(\forall x(\mathsf{GoodStudent}(x)\to F(x))\to F(Ada)))$$

  But this formula is not proper FOL syntax. A system that can handle this is [second-order logic](https://en.wikipedia.org/wiki/Second-order_logic).

2. FOL lacks devices to handle many natural language phenomena, such as adverbial constructions: John failed _badly_. 

  We might be tempted to formalize this as $\mathsf{FailedBadly}(John)$, but then it doesn't follow that John failed since $\mathsf{FailedBadly}(John)\nvDash\mathsf{Failed}(John).$

  [This paper](https://philarchive.org/archive/HAZFLW-3v4) develops an extension of FOL that can deal with adverbs.

# Discussion

When we use modern subsymbolic AIs, such as LLMs, for [reasoning](https://arxiv.org/abs/2312.11562), these AIs turn out to be _inconsistent_: they sometimes say one thing and sometimes the opposite. Does this mean that the problem posed by Gödel's theorem for mathematical AIs doesn't affect subsymbolic AIs?
