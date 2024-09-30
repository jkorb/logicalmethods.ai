---
title: Logical conditionals
author: Johannes Korbmacher
weight: 6
params: 
  id: exc-if
  math: true
---

# Equivalences

For each of the following pairs of formulas, show that they are _equivalent_ in
the sense that they have the same truth-value under each valuation.

## a)

$A\to B$ and $\neg A\lor B$

## b) {.homework}

$A\to B$ and $\neg(A\land\neg B)$

## c) 

$A$ and $\neg A\to A$
([Clavius](https://en.wikipedia.org/wiki/Christopher_Clavius)'s law)

## d) {.homework}

$A\to B$ and $\neg B\to \neg A$ (the law of contraposition)

## e) 

$A\to (B\to C)$ and $(A\land B)\to C$

# Boolean laws

Formulate the equivalences from Exercise 1 as Boolean laws. For example, a)
becomes $$x\Rightarrow y=-x+y.$$

# Validities

Check the validity of the following inferences using a suitable method
(DPLL, truth-tables, ...).

## a)

$\mathsf{RAIN}\to \mathsf{CAR}\vDash (\mathsf{RAIN}\land \mathsf{WARM})\to
\mathsf{CAR}$

## b) 

$\mathsf{RAIN}\to \mathsf{CAR}, \mathsf{CAR}\to \mathsf{KEYS}\vDash \mathsf{RAIN}\to
\mathsf{KEYS}$

## c) 

$\mathsf{RAIN}\to \mathsf{CAR},\mathsf{CAR}\vDash \mathsf{RAIN}$

## d) {.homework}

$\mathsf{SUN}\to \mathsf{BIKE},\neg\mathsf{SUN}\vDash \neg \mathsf{BIKE}$

# Horn clauses

Remember that a _literal_ is a propositional variable or its negation. A [Horn
clause](https://en.wikipedia.org/wiki/Horn_clause) is a disjunction of literals,
where _at most_ one literal is _positive_ meaning it doesn't contain a negation.
This means that a Horn clause has the form: $$\neg p_1\lor \neg p_2\lor
\dots\lor q,$$ where $p_1,p_2,\dots,q$ are propositional variables.

## a) {.homework}

Provide an argument that every Horn clause is equivalent to (=always has the same
truth-value as) a conditional of the
form: $$p_1\land p_2\land\dots \to q.$$ 

_Hint_: There are different routes to this result, but you'll need to use
Boolean laws/corresponding logical equivalences. Here are some candidates to use
in your argument:

$$x\Rightarrow y = -x+y$$

$$x\Rightarrow (y\Rightarrow z)=(x\times y)\Rightarrow z$$

$$-x+-y+\dots=-(x\times y\times \dots)$$

## b)

Can every formula equivalently be written as a Horn clause?

# Resolution

A disjunction of literals, we call a _(disjunctive) clause_. 

The resolution rule says that if you have two clauses ($l_i,k_j$ are literals)

$$l_1\lor l_2\lor \dots\lor p \qquad \qquad \neg p\lor k_1\lor k_2\lor\dots$$

you can infer: 

$$l_1\lor l_2\lor \dots k_1\lor k_2\lor\dots$$

So, for example, from

$$\neg\mathsf{RAIN}\lor\neg\mathsf{SUN}\lor\mathsf{BIKE}\qquad
\neg\mathsf{BIKE}\lor\mathsf{HELMET}$$
you can infer
$$\neg\mathsf{RAIN}\lor\neg\mathsf{SUN}\lor\mathsf{HELMET}$$

## a) {.homework}

Show that the example inference is valid using a suitable method (truth-tables,
DPLL, ...).

## b)

Use the resolution rule to show that the following inference is valid:

$$\mathsf{RAIN}\lor\mathsf{BIKE},\neg\mathsf{RAIN}\vDash \mathsf{BIKE}$$

Which rule of the DPLL algorithm does this correspond to?

## c)

We can use the resolution to define a general inference method:

+ To test whether $P_1,P_2,\dots\vDash C$ we bring $P_1\land P_2\land \dots\land
\neg C$ into CNF (see {{< chapter_ref chapter="sat" id="normal-forms">}}
Chapter 5.3{{< /chapter_ref >}}).

+ We then recursively apply the resolution rule to all possible combinations of
clauses (and the results of those applications, the results of the results, ...).

+ Outcome:

  + If any application of the resolution rule results in an empty clause
  $\Set{}$, the inference is _in_valid.

  + If we arrive at a point where no more applications are possible and no empty
  clause has been derived, the inference is valid.

Use this method to show that the following inference is valid:

$$\mathsf{RAIN}\vDash \mathsf{RAIN}\land (\mathsf{RAIN}\lor \mathsf{SUN})$$



## d) {.homework}

The result of applying the resolution rule to two Horn clauses always results in a
Horn clause. Why?

## e)

Use the resolution rule (together with Exercise 1 a)) to show that the following
inference is valid:

$$\mathsf{RAIN}\to \mathsf{CAR}, \mathsf{CAR}\to \mathsf{KEYS}\vDash \mathsf{RAIN}\to
\mathsf{KEYS}$$

## f)

The inference pattern $$A\to B,B\to C\vDash A\to C$$ is known as "transitivity"
for the logical conditional. 

Use the reasoning from e) together with Exercise 4 a) to show that the
application of the resolution rule to Horn clauses is essentially just an
application of the transitivity principle.

What does this have to do with the forward and backward chaining methods?

# Discussion

Remember the [Wason selection
task](https://en.wikipedia.org/wiki/Wason_selection_task) from the teaser
lecture (if you're not a first-year AI student or missed the intro day lecture,
check out the description on Wikipedia).

Some researchers have argued that the experiment shows that people don't reason with
the material/logical conditional in this case. Do you agree? Why?
