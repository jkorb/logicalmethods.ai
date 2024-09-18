---
title: Formal languages
author: Johannes Korbmacher
weight: 3
params: 
  id: exc-for
  math: true
---

# BNFs {.solved}

## a) {.homework}

Consider the following propositional language, described informally:

{{< blockquote >}}

We have three propositional variables $BLUE$, $GREEN$, and $RED$. Further, we
have the propositional connectives $\neg,\land, \lor$, which work as usual, i.e.
$\neg$ can be written in front of a formula to negate it, $\land$ can be written
between two formulas flanked by parentheses to conjoin them, and similarly for
$\lor$. Additionally, we have two unary modal operators $\square,\lozenge$, which can be
written in front of a formula to form a new formula.

{{< /blockquote >}}

Determine the BNF of this language.

## b) 

Consider the following BNF for FOL. Describe the grammar of this language using
induction, i.e. using clauses like in {{< chapter_ref chapter="formal-languages"
id="grammar" >}} Section 3.2.2{{< /chapter_ref >}}:

$$\langle const\rangle ::= a_1 \mid \dots \mid a_n$$  

$$\qquad\langle var\rangle ::= x_1 \mid \dots \mid x_n$$

$$\langle unop\rangle ::= \neg$$

$$\qquad\langle binop\rangle ::=\land\mid\lor\mid\to\mid\leftrightarrow$$

$$\langle quant\rangle ::= \forall\mid\exists$$

$$\langle func\rangle^n ::= f_1^n\mid \dots \mid f_{k_n}^n$$

$$\langle pred\rangle^n ::= P_1^n \mid \dots \mid P_{l_n}^n $$

for $n=1,2,\dots$. This means that for each number $n=1,2,\dots$ there is a
certain number $k_n$ of $n$-ary function symbols and another number $l_n$ of
$n$-ary predicates. So, e.g., if $n=2$, then there are $k_2$-many functions that
take $2$ arguments.

$$\langle term\rangle::= \langle const\rangle\mid\langle variable\rangle\mid
\langle func\rangle^n(\langle term\rangle_1,\dots,\langle term\rangle_n)$$

$$\langle atom\rangle::= \langle pred\rangle^n(\langle term\rangle_1,\dots\langle term\rangle_n)$$

$$\langle fml\rangle::=\langle atom\rangle\mid\langle unop\rangle\langle fml\rangle\mid
(\langle fml\rangle\langle binop\rangle \langle fml\rangle)\mid \langle quant\rangle \langle
var\rangle\langle fml\rangle$$

_Hint_: You need to define more than just the set $\mathcal{L}$ by induction.
You also need to define the _auxiliary_ sets of terms.

## c)

Consider the following formulas:

$$p, q,(\neg p), (p\supseteq q), (p\mid\mid r), ((p\supseteq r)\\&\\&(\neg q))$$

Determine a BNF, such that these are well-formed formulas according to the
corresponding grammar. 

_Note_: There are, of course, many different possible answers. Try to find the
most "natural" one.

## d) {.homework}

Determine the BNF for the fragment of FOL, subject to the following constraints:

+ We only have two unary predicates $RED,ROUND$ and one binary predicate
$BIGGER$.

+ There are no function symbols or constants.

+ A quantifier ($\forall, \exists)$ can only occur when it's followed by a
variable $\alpha=x,y,z,\dots$ and then a formula of the form $(P(\alpha)\to B)$,
where $P$ is a unary predicate.

## Solution {.solution #bnfsSolution}

**a)**

$$ A::= BLUE, GREEN, RED \mid \neg A \mid \Box A \mid \Diamond A \mid (A\land A) \mid (A\lor A) $$

**b)** 

+ If $a_i$ is a constant, then $a_i\in\mathcal{T}$
+ If $x_i$ is a variable, then $x_i\in\mathcal{T}$
+ If $f^n_i$ is an $n$-place function sign and $t_1,\ldots,t_n\in\mathcal{T}$, then $f^n_i(t_1,\ldots,t_n)\in\mathcal{T}$
+ If $P^n_i$ is an $n$-place predicate and $t_1,\ldots,t_n\in\mathcal{T}$, then $P^n_i(t_1,\ldots,t_n)\in\mathcal{L}$
+ If $A\in\mathcal{L}$, then $\neg A\in\mathcal{L}$
+ If $A,B\in\mathcal{L}$, then $(A\land B), (A\lor B), (A\rightarrow B), (A\leftrightarrow B)\in\mathcal{L}$
+ If $A\in\mathcal{L}$ and $x_i$ is a variable, then $\forall x_i A, \exists x_i A\in\mathcal{L}$

**c)**

$$ A::= p,q,r \mid \neg A \mid (A\supseteq A) \mid (A||A) \mid (A\\&\\&A) $$

**d)**

$$ \langle{var}\rangle ::= x_1 \mid \ldots \mid x_n $$

$$ \langle{unop}\rangle ::= \neg $$

$$ \langle{binop}\rangle ::= \land \mid \lor \mid \rightarrow \mid \leftrightarrow $$

$$ \langle{quant}\rangle ::= \forall \mid \exists $$

$$ \langle{pred}\rangle^1 ::= RED \mid ROUND $$

$$ \langle{pred}\rangle^2 ::= BIGGER $$

$$ \langle{atom}\rangle ::= \langle{pred}\rangle^n(\langle{var}\rangle_1,\ldots,\langle{var}\rangle_n) $$

$$ \langle{fml}\rangle ::= \langle{atom}\rangle \mid
\langle{unop}\rangle\langle{fml}\rangle \mid
(\langle{fml}\rangle\langle{binop}\rangle\langle{fml}\rangle)$$
$$\mid \langle{quant}\rangle\langle{var}\rangle(\langle{pred}\rangle^1(\langle{var}\rangle)\rightarrow\langle{fml}\rangle) $$

# Formalization {.solved}

## a) 

You arrive at an uninhabited planet and find an old space rover that some
ancient civilization that still used expert systems for AI used to explore the
planet. You inspect its knowledge base and find the following code:

+ $(RAIN\to SEEK\\_COVER)$

+ $(SUN\to CHARGE\\_BATTERIES)$

+ $((\neg CHARGE\\_BATTERIES\land SUN)\to REQUEST\\_REPAIR)$

+ $(\neg(SUN\lor RAIN)\to INSPECT\\_SENSORS)$

+ $(SHUT\\_DOWN\leftrightarrow ((REQUEST\\_REPAIR\land\neg REPAIR)\lor
(INSPECT\\_SENSORS\land FAULTY)))$

Explain these rules in natural language.

## b) 

Consider the following natural language claims. Translate them into a suitable
propositional or FOL language:

+ Alan Turing built the first computer but Ada Lovelace invented the first
computer algorithm.
                                                                                             
+ Only if Alan Turing built the first computer, it's Monday today.
                                                                                             
+ Either Alan Turing or Ada Lovelace is your favorite computer scientist.
                                                                                             
+ Today is Monday if and only if both yesterday was Tuesday and tomorrow is
Saturday.

- A number that is greater than every even number is odd.

- Every number is greater than at least one number.

- There is an even number that is smaller than an odd number that is greater
than another odd number.

- There is no number that is greater than every number.

- No number is greater than itself.

- Every odd number is greater than 0.

- Every odd number is greater than an even number.

## c) {.homework}

We're thinking of a scenario where there's a factory that makes balls. We want
to create a robot that ultimately sorts balls by color and material. But we're not
there yet, for now we need to represent the following knowledge claims about the
factory to the robot:

{{< blockquote >}}

The balls we make have one of three colors, blue, red, and green. The blue balls
are all made from rubber, but the red and green balls can be made of leather or
rubber. Rubber balls are cheaper, but the leather balls are more durable than
the rubber balls. 

{{< /blockquote >}}

Devise a suitable FOL-language and represent the knowledge claims in the above
paragraph into a knowledge base $\mathbf{KB}$.

## Solutions {.solution #formalizationSolution}

**a)**

+ If it is rainy, then seek cover.
+ If it is sunny, then charge batteries.
+ If batteries do not charge and it is sunny, then request repair.
+ If it is neither rainy nor sunny, then inspect the sensors.
+ Shut down if, and only if, you request repair and don't get it or you inspect the sensors and they are faulty.

**b)**

+ $BUILT(alan) \land INVENTED(ada)$
+ $MON(today) \rightarrow BUILT(alan)$
+ $FAVORITE(alan) \lor FAVORITE(ada)$
+ $MON(today) \leftrightarrow (TUES(yesterday)\land SAT(tomorrow))$
+ $\forall x((NUM(x)\land\forall y(EVEN(y)\rightarrow GREAT(x,y)))\rightarrow ODD(x))$
+ $\forall x(NUM(x)\rightarrow\exists yGREATER(x,y))$
+ $\exists x((NUM(x) \land EVEN(x)) \land \exists y(SMALL(x,y) \land((NUM(y) \land ODD(y)) \land \exists z(y\neq z \land NUM(z)\land ODD(z) \land GREAT(y,z)))))$
+ $\neg\exists x(NUM(x) \land \forall y(NUM(y)\rightarrow GREAT(x,y)))$
+ $\neg\exists x(NUM(x) \land GREAT(x,x))$
+ $\forall x((NUM(x) \land ODD(x))\rightarrow GREAT(x,0))$
+ $\forall x((NUM(x) \land ODD(x))\rightarrow \exists y(NUM(y)\land EVEN(y)\land GREAT(x,y)))$

**c)**

$$ \langle{var}\rangle ::= x \mid y $$

$$ \langle{unop}\rangle ::= \neg $$

$$ \langle{binop}\rangle ::= \land \mid \lor \mid \rightarrow \mid \leftrightarrow $$

$$ \langle{quant}\rangle ::= \forall \mid \exists $$

$$ \langle{pred}\rangle^1 ::= BLUE \mid RED \mid GREEN $$

$$ \langle{pred}\rangle^2 ::= CHEAPER \mid DURABLE $$

$$ \langle{atom}\rangle ::= \langle{pred}\rangle^n(\langle{var}\rangle_1,\ldots,\langle{var}\rangle_n) $$

$$ \langle{fml}\rangle ::= \langle{atom}\rangle \mid \langle{unop}\rangle\langle{fml}\rangle \mid (\langle{fml}\rangle\langle{binop}\rangle\langle{fml}\rangle) \mid \langle{quant}\rangle\langle{var}\rangle\langle{fml}\rangle $$

KB entries:

+ $\forall x(BLUE(x) \lor RED(x) \lor GREEN(x))$

+ $\forall x (BLUE(x) \rightarrow RUBBER(x))$

+ $\forall x (RED(x) \rightarrow (LEATHER(x) \lor RUBBER(x)))$

+ $\forall x (GREEN(x) \rightarrow (LEATHER(x) \lor RUBBER(x)))$

+ $\forall x \forall y ((RUBBER(x) \land LEATHER(y)) \rightarrow CHEAPER(x,y))$

+ $\forall x \forall y ((LEATHER(x) \land RUBBER(y)) \rightarrow DURABLE(x,y))$

# Parsing

## a) {.homework}

Parse the following formulas according to the BNF for propositional logic:


+ $(\neg p\to \neg p)$

+ $(p\leftrightarrow (\neg r\land q))$

+ $((q\land s)\to (p\lor r))$

+ $(((p\land q)\lor (r\land s))\land \neg ((p\land q\land r\land s)))$

## b) 

Parse the following formulas according to the BNF for FOL:

+ $ \exists  x S(x,p)$

+ $\forall x (  \exists y G(x,y) \rightarrow   \exists  y S(x,y))$

+ $\lnot  \exists x G(p,x) \wedge   \lnot  \exists  y S(y,p)$

+ $\forall x  (B(x) \rightarrow   \exists y G(y,x))$

# Research {.homework}

Can the grammar of _every_ formal language be given by a BNF? If so, explain
why, if not give a counterexample and explain why it is, indeed, a
counterexample.

# Discussion

Some AI researchers thought that everything that can be said can be said in FOL.
Doing some necessary research, do you agree? Support your answer with arguments
and/or examples.
