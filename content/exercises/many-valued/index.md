---
title: Many-valued logics
author: Johannes Korbmacher
weight: 100
params: 
  id: exc-mv
  math: true
---

# $K3$-Sat Solving {.solved}

In class, we've implemented a counter-model searcher for $K3$ inferences using
SQL in [db-fiddle](https://www.db-fiddle.com/f/ixfKDFBJaxNfSSysEQvpgk/6). Use
the machinery to check whether the following inferences are $K3$ valid or not:

1. $(RAIN {{< lor >}}(RAIN {{< land >}}SUN)){{< therefore >}} SUN$
1. $SUN {{< therefore >}} RAIN {{< land >}}{{< neg >}} RAIN$
1. $SUN, {{< neg >}}SUN {{< therefore >}} RAIN$
1. $RAIN {{< land >}}{{< neg >}}SUN {{< therefore >}} {{< neg >}}({{< neg >}}RAIN {{< lor >}} SUN)$
1. $WIND {{< therefore >}} {{< neg >}}(RAIN {{< land >}} {{< neg >}}RAIN)$
1. $RAIN {{< therefore >}} RAIN {{< lor >}} {{< neg >}}RAIN$

## Solution {#k3-sat-solvingSolution .solution}

The following [db-fiddle](https://www.db-fiddle.com/f/ixfKDFBJaxNfSSysEQvpgk/12) contains queries for each of the above inferences. The ones that return non-empty tables have countermodels, which are given by the return values. The annotations explain how to interpret the tables.

# $K3$-Laws {.solved}

In fact, you can use a similar method to verify the laws of Kleene algebra using SQL.

Here are, for example, the queries to verify the commutativity of ~!OR!~ and ~!AND!~:

{{< sql_logo >}}
~~~sql
 SELECT * 
 FROM ValuePairs
 WHERE
	(X OR Y) != (Y OR X)
  OR
	(X AND Y) != (Y AND X);
~~~

Verify the remaining Kleene laws like this.

Note that for the laws with 3 variables, you need to create a table `ValueTriples` for the method to work.

## Solution {#k3-lawsSolution .solution}

The following [db-fiddle](https://www.db-fiddle.com/f/wawYXVNo3K6QWMyQYHkHeB/0)
contains code that verifies all laws. There are three queries, one for the laws
with one variables, one for laws with two variables, and one for laws with
three variables. The queries are structured such that it would return a
valuation iff at least one of the laws fails. They don't return anything so the
laws hold.

# Łukasiewicz conditionals {.solved}

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

## Solution {#łukasiewicz-conditionalsSolution .solution}

1. Consider the $K3$-model where $v(RAIN) = ω$. In this model, we have 

    $$v(RAIN {{< to >}}RAIN) = (~!NOT!~ v(RAIN)) ~!OR!~ v(RAIN) = (~!NOT!~ ω) ~!OR!~ ω = ω$$

    And since $ω ≠ 1$, this is a model where the formula isn't true.

2.  we have that $v(RAIN {{< to >}}RAIN) = v(RAIN) ~!Ł!~ v(RAIN)$. That is,
    we're dealing with an expression of the form `X ~!Ł!~ X`. If we go to the
table for ~!Ł!~, we note that for identical inputs, the values (on the
diagonal) are always `1`. In other words, the formula is true in all models.

3. Suppose that $v(A) = 1$ and $v(A {{< to >}}B) = 1$. Inspecting the table for
   ~!Ł!~, we can see that there is one and only one configuration of values
that makes this possible, namely the one where $v(B) = 1$. 

    
    {{< img src="img/luk_table.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

# Fuzz Predicates

Suppose we've got a language with predicates `Fast¹` and `Slow¹`, which
describe the speed of a car and apply to terms for speed (like `10
km/h`). 

1. Describe a model for these predicates by means of a diagram, in which there
   is a "gray area" between fast and slow.

2. Add to the language two fuzzy constants `break` and `accelerate`. Formulate
   a system of fuzzy rules that keep the car in the gray area between fast and
slow, while avoiding breaking and accelerating simultaneously.

# Fuzzy Logic {.solved}

In class, we've seen that in fuzzy logic, disjunctive syllogism fails:
there are formulas $A,B$, such that $${{< neg >}}A, A{{< lor >}}B{{<
nvDash >}}B$$

Modify the example to show that in fuzzy logic, also the [principle of explosion](https://en.wikipedia.org/wiki/Principle_of_explosion) fails, that is there are formulas $A,B$, such that $$A,{{< neg >}}A{{<
nvDash >}}B$$

## Soltution {#fuzzy-logicSolution .solution}

Let's take for $A$ a statement which, in a suitable model, is both "half-true",
that is, has value 0.5. For example, `Fast 45km/h` could be such that `{{<
llbracket >}}Fast 45km/h{{< rrbracket>}} = 0.5`. It follows by the semantics
for ${{< neg >}}$ that also `{{< llbracket >}}{{< neg >}}Fast 45km/h{{<
rrbracket>}} = 0.5`. That means that 

```
min({{< llbracket >}}Fast 45km/h{{< rrbracket>}}, {{< llbracket >}}{{< neg >}}Fast 45km/h{{< rrbracket>}}) = 0.5
```

If we then take a statement for $B$, which is certainly false, such as `Fast 0kmh`, meaning `{{< llbracket >}}Fast 0km/h{{< rrbracket>}} = 0`, we have a clear countermodel:

```
min({{< llbracket >}}Fast 45km/h{{< rrbracket>}}, {{< llbracket >}}{{< neg >}}Fast 45km/h{{< rrbracket>}}) = 0.5 ≥ 0 = {{< llbracket >}}Fast 0km/h{{< rrbracket>}}
```

So the inference $$A,{{< neg >}}A{{< nvDash >}}B$$ is invalid.

