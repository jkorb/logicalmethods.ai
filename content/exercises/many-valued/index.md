---
title: Many-valued logics
author: Johannes Korbmacher
weight: 100
params: 
  id: exc-mv
  math: true
---

# $K3$-Sat Solving

In class, we've implemented a counter-model searcher for $K3$ inferences using
SQL in [db-fiddle](https://www.db-fiddle.com/f/ixfKDFBJaxNfSSysEQvpgk/6). Use
the machinery to check whether the following inferences are $K3$ valid or not:

1. $(RAIN {{< lor >}}(RAIN {{< land >}}SUN)){{< therefore >}} SUN$
1. $SUN {{< therefore >}} RAIN {{< land >}}{{< neg >}} RAIN$
1. $SUN, {{< neg >}}SUN {{< therefore >}} RAIN$
1. $RAIN {{< land >}}{{< neg >}}SUN {{< therefore >}} {{< neg >}}({{< neg >}}RAIN {{< lor >}} SUN)$
1. $WIND {{< therefore >}} {{< neg >}}(RAIN {{< land >}} {{< neg >}}RAIN)$
1. $RAIN {{< therefore >}} RAIN {{< lor >}} {{< neg >}}RAIN$

# $K3$-Laws

In fact, you can use a similar method to verify the laws of Kleene algebra using SQL.

Here are, for example, the queries to verify the commutativity of ~!OR!~ and ~!AND!~:

{{< sql_logo >}}
~~~sql
 SELECT * 
 FROM ValuePairs
 WHERE
	(X OR Y) != (Y OR X);
    
 SELECT * 
 FROM ValuePairs
 WHERE
	(X AND Y) != (Y AND X);
~~~

Verify the remaining Kleene laws like this.

Note that for the laws with 3 variables, you need to create a table `ValueTriples` for the method to work.

# Łukasiewicz conditionals

In $K3$, we've defined a semantics for conditionals by saying that $$v(A{{< to
>}}B) = (~!NOT!~ A) ~!OR!~ B$$

This gives rise to the Kleene logic $K3$. But interestingly, in this logic,
it's not a logical law that $RAIN {{< to >}}RAIN$—there are countermodels,
where this statement isn't true.

But there's an alternative system of $3$-valued logic, which is defined just
like Kleene logic, except that it uses the following truth-table to interpret
the conditional:

{{< img src="img/luk.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

That is, in this system,

$$v(A{{< to >}}B) = A ~!Ł!~ B$$

This logic is called Łukasiewicz logic, $Ł$.

1. Verify that there exists a $K3$ model, where $RAIN {{< to >}}RAIN$ is not true.

2. Verify that there $RAIN{{< to >}}RAIN$ is true in all $Ł$ models.

3. Is MP valid in $Ł$-logic?

# Fuzz Predicates

Suppose we've got a language with predicates `Fast¹` and `Slow¹`, which
describe the speed of a car and apply to terms for speed (like `10
km/h`). 

1. Describe a model for these predicates by means of a diagram, in which there
   is a "gray area" between fast and slow.

2. Add to the language two fuzzy constants `break` and `accelerate`. Formulate
   a system of fuzzy rules that keep the car in the gray area between fast and
slow, while avoiding breaking and accelerating simultaneously.

# Fuzzy Logic

In class, we've seen that in fuzzy logic, disjunctive syllogism fails:
there are formulas $A,B$, such that $${{< neg >}}A, A{{< lor >}}B{{<
nvDash >}}B$$

Modify the example to show that in fuzzy logic, also the [principle of explosion](https://en.wikipedia.org/wiki/Principle_of_explosion) fails, that is there are formulas $A,B$, such that $$A,{{< neg >}}A{{<
nvDash >}}B$$

