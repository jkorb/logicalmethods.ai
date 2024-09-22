---
title: Boolean satisfiability
author: Johannes Korbmacher
date: 20/09/2024
last_edited: 20/09/2024
weight: 5
params: 
  id: txt-sat
  math: true
---

# Boolean satisfiability

In the last chapter, you learned about {{< chapter_ref chapter="boolean" >}}
Boolean algebra{{< /chapter_ref >}} and its role as fundamental laws of
reasoning and computation. In this chapter, we'll further explore the
applications of Boolean algebra in AI.

In particular, you'll learn about how to efficiently test for valid inference in
Boolean algebra. First, we'll discuss the "naive" [truth-table
method](#truth-tables), which suffers from the problem of [combinatorial
explosion](https://en.wikipedia.org/wiki/Combinatorial_explosion). Then you'll
learn about a more efficient method for validity checking, which is known as the
[Davis–Putnam–Logemann–Loveland (DPLL)](#dpll) algorithm. This methods requires
you to know about [normal forms](#normal-forms), so we'll cover those, too.

The [DPPL algorithm](https://en.wikipedia.org/wiki/DPLL_algorithm) is the basis
for many modern AI applications, especially in planning and diagnosis. You'll
explore some of these applications in the exercises.

## Validity and Satisfiability

The problem that we're tackling is how to **computationally and efficiently**
test for valid inference. Why is this a problem?

Remember from {{< chapter_ref chapter="valid-inference"
id="semantic-methods-for-deduction">}} Chapter 2. Valid inference {{<
/chapter_ref >}} that valid inference is truth-preservation from premises to
conclusion: 

$$P_1,P_2,\dots\vDash C\Leftrightarrow [P_1]\cap [P_2]\cap \dots\subseteq [C]$$

In {{< chapter_ref chapter="boolean" id="validity">}}
Chapter 4.5 {{< /chapter_ref >}}, we implemented this definition in the context of
Boolean algebras. In this setting, the above condition is equivalent to saying
that:
$$P_1,P_2,\dots\vDash C\Leftrightarrow \text{ for all }\nu,\text{ if
}\nu(P_1)=1, \nu(P_2)=1\dots\text{, then }\nu(C)=1.$$

In words, this means that the inference is valid iff for all Boolean valuations,
where the premises are all true (have value 1), the conclusion is also true
(has value 1). Using this definition, we could formally calculate the validity
of an inference.

In {{< chapter_ref chapter="boolean" id="validity">}} Chapter 4.5 {{<
/chapter_ref >}}, we went through an example calculation to show that:

$$\mathsf{RAIN}\lor \mathsf{BIKE},\neg\mathsf{RAIN}\vDash\mathsf{BIKE}$$

The problem is that this was a "human-style" calculation. How can we teach a
(non-intelligent) computer system the necessary skills to test for valid
inference itself?

It turns out that for this purpose, it's useful to reformulate the question in
yet another, equivalent way using the concept of **Boolean satisfiability**.
Consider a set of (propositional) formulas $\Gamma\subseteq \mathcal{L}$. We say
that $\Gamma$ is _satisfiable_ just in case there exists a Boolean valuation
$\nu$ that makes all members of $\Gamma$ true, i.e. $\nu(A)=1$ for all $A\in
\Gamma$.

Take the set $\Gamma=\Set{\mathsf{RAIN}\lor \mathsf{SUN},\neg \mathsf{BIKE}}$, for example. If we set $\nu$ such that:

+ $\nu(\mathsf{RAIN})=1$
+ $\nu(\mathsf{SUN})=0$
+ $\nu(\mathsf{BIKE})=0$

We have:

+ $\nu(\mathsf{RAIN}\lor \mathsf{SUN})=\nu(\mathsf{RAIN})+\nu(\mathsf{SUN})=1+0=1$
+ $\nu(\neg \mathsf{BIKE})=-\nu(\mathsf{BIKE})=-0=1$

This valuation shows that the set $\Set{\mathsf{RAIN}\lor \mathsf{SUN},\neg BIKE}$ is
satisfiable.

A set that's _not_ satisfiable is called **unsatisfiable**. What does an
unsatisfiable set look like? Consider $\Gamma=\Set{\mathsf{RAIN},\neg \mathsf{RAIN},
\mathsf{SUN}\land\neg \mathsf{BIKE}}$. Any valuation that makes all members of $\Gamma$ true
will be such that:

+ $\nu(\mathsf{RAIN})=1$
+ $\nu(\neg \mathsf{RAIN})=1$

This is because both $\mathsf{RAIN},\neg \mathsf{RAIN}\in \Gamma$.

But if $\nu(\neg \mathsf{RAIN})=-\nu(\mathsf{RAIN})=1$, this means that $\nu(\mathsf{RAIN})=0$. So our
conditions give us that $\nu(\mathsf{RAIN})=1$ and _at the same time_ $\nu(\mathsf{RAIN})=0$. But
that's impossible, meaning that the set is unsatisfiable.

The reason why we're talking about satisfiability is that there's a test for
valid inference in terms of satisfiability, which looks as follows:

$$P_1,P_2,\dots\vDash C\Leftrightarrow \Set{P_1,P_2,\dots \neg C}\text{ is
\emph{un}satisfiable}$$

The idea is simply that $\Set{P_1,P_2,\dots \neg C}$ is
satisfiable just in case its possible to make all the premises $P_1,P_2,\dots$
true and _at the same time_ the conclusion $C$ false (since $\nu(\neg
C)=-\nu(C)=1$ just in case $\nu(C)=0$). To say that this is _not_ possible is to
say that we can't make the premises true and the conclusion false, which is just
another way of saying that whenever the premises are true, the conclusion is
false.

Take our example from {{< chapter_ref chapter="boolean" id="validity">}} Chapter
4.5 {{< /chapter_ref >}} again:

$$\mathsf{RAIN}\lor \mathsf{BIKE},\neg\mathsf{RAIN}\vDash\mathsf{BIKE}$$

We can show this using the previous test by checking whether the following set
is satisfiable:

$$\Set{\mathsf{RAIN}\lor \mathsf{BIKE},\neg\mathsf{RAIN},\neg \mathsf{BIKE}}$$

_We_ can quickly see that this set is unsatisfiable:

+ To make all formulas true, we need $\nu(\neg
\mathsf{RAIN})=-\nu(\mathsf{RAIN})=1$ and $\nu(\neg
\mathsf{BIKE})=-\nu(\mathsf{BIKE})=1$.

+ That just means that $\nu(\mathsf{RAIN})=0$ and $\nu(\mathsf{BIKE})=0$.

+ But we also need $\nu(\mathsf{RAIN}\lor \mathsf{BIKE})=$. Which means:

  $$\nu(\mathsf{RAIN}\lor \mathsf{BIKE})=\nu(\mathsf{RAIN})+\nu(\mathsf{BIKE})=1$$

  Since we know that $\nu(\mathsf{RAIN})=0$ and $\nu(\mathsf{BIKE})=0$, this is
  impossible ($0+0=1$) and so the set is unsatisfiable.

But that was again "human-style" thinking. How can we _computationally_
implement this in a step-by-step procedure that a computer could follow? That's
what the rest of the chapter is about.

## Truth-tables

The first method, we'll discuss is the "naive" way of simply going through all
relevant valuations by [brute
force](https://en.wikipedia.org/wiki/Brute-force_search).

Take our example from before:

$\Set{\mathsf{RAIN}\lor \mathsf{BIKE},\neg\mathsf{RAIN},\neg \mathsf{BIKE}}$

Since there are 2 propositional variables, there are $2^2=4$ relevant
valuations.[^valuations] They are:

+ $\nu_1(\mathsf{RAIN})=1$ and $\nu_1(\mathsf{BIKE})=1$
+ $\nu_2(\mathsf{RAIN})=1$ and $\nu_2(\mathsf{BIKE})=0$
+ $\nu_3(\mathsf{RAIN})=0$ and $\nu_3(\mathsf{BIKE})=1$
+ $\nu_4(\mathsf{RAIN})=0$ and $\nu_4(\mathsf{BIKE})=0$

Now, using the recursion rules from {{< chapter_ref chapter="boolean"
id="truth-functions">}} Chapter 4.4 {{< /chapter_ref >}}, we can simply
calculate the truth-values of all formulas in our set. We get:

+ $\nu_1(\neg\mathsf{RAIN})=0,\nu_1(\neg\mathsf{BIKE})=0,$ and $\nu_1(\mathsf{RAIN}\lor\mathsf{BIKE})=0$
+ $\nu_2(\neg\mathsf{RAIN})=0,\nu_2(\neg\mathsf{BIKE})=1,$ and $\nu_2(\mathsf{RAIN}\lor\mathsf{BIKE})=1$
+ $\nu_3(\neg\mathsf{RAIN})=1,\nu_3(\neg\mathsf{BIKE})=0,$ and $\nu_3(\mathsf{RAIN}\lor\mathsf{BIKE})=1$
+ $\nu_4(\neg\mathsf{RAIN})=1,\nu_4(\neg\mathsf{BIKE})=1,$ and $\nu_4(\mathsf{RAIN}\lor\mathsf{BIKE})=0$

A simple inspection shows that in none of these cases, we have all formulas of
our set true. Since we've inspected _all_ valuations, we can conclude that the
set is unsatisfiable.

A **truth-table** is a way to write down all the truth-values that a formula can
take. Here's how this works:

+ We determine all the propositional variables. 

+ We determine all the possible valuations.

+ We parse the formula.

+ We recursively calculate the value of the full-formula, keeping track of all
steps in a table.

Here's how this looks for the formula $(\mathsf{RAIN}\lor(\neg\mathsf{RAIN}\land
\mathsf{BIKE}))$:

+ The propositional variables are $\mathsf{RAIN}$ and $\mathsf{BIKE}$.

+ The possible valuations are:

  + $\nu_1(\mathsf{RAIN})=1$ and $\nu_1(\mathsf{BIKE})=1$
  + $\nu_2(\mathsf{RAIN})=1$ and $\nu_2(\mathsf{BIKE})=0$
  + $\nu_3(\mathsf{RAIN})=0$ and $\nu_3(\mathsf{BIKE})=1$
  + $\nu_4(\mathsf{RAIN})=0$ and $\nu_4(\mathsf{BIKE})=0$

+ The parsing tree for the formula is:

{{< img src="img/parsing-tree-1.png" class="img-thumbnail" >}}

+ The calculation leads to the following truth-table:

{{< img src="img/tt-1.png" class="img-thumbnail" >}}

The **truth-table method** for validity checking is to use the truth-table for
the formula: $$(((P_1\land P_2)\land \dots )\land \neg C)$$ 

+ If there is a row  with value $1$, the inference is invalid.
+ If all rows have value $0$, the inference is invalid.

For our example inference, we get:

+ The propositional variables are $\mathsf{RAIN}$ and $\mathsf{BIKE}$.

+ The possible valuations are:

  + $\nu_1(\mathsf{RAIN})=1$ and $\nu_1(\mathsf{BIKE})=1$
  + $\nu_2(\mathsf{RAIN})=1$ and $\nu_2(\mathsf{BIKE})=0$
  + $\nu_3(\mathsf{RAIN})=0$ and $\nu_3(\mathsf{BIKE})=1$
  + $\nu_4(\mathsf{RAIN})=0$ and $\nu_4(\mathsf{BIKE})=0$

+ The parsing tree for the relevant formula is:

{{< img src="img/parsing-tree-2.png" class="img-thumbnail" >}}

+ The calculation leads to the following truth-table:

{{< img src="img/tt-2.png" class="img-thumbnail" >}}

This shows that the formula in question is unsatisfiable and thus the
_inference_ is valid.

The truth-table method is a working method for computationally determining the
validity of inferences. So why doesn't the chapter end here?

The **problem** is that truth-tables suffer from what's known as [combinatorial
explosion](https://en.wikipedia.org/wiki/Combinatorial_explosion). The problem
is that the size of the necessary truth-table grows
[exponentially](https://en.wikipedia.org/wiki/Exponential_growth) with the
number of propositional variables in the formula, as in the following table:

|Propositional variables | Rows |
|----------------------------|----------|
| 1                          | 2        |
| 2                          | 4        |
| 3                          | 8        |
| 4                          | 16       |
| 5                          | 32       |
| 6                          | 64       |

Then, for each formula in the parsing tree, we need to calculate the truth-value
in a given row. This quickly becomes painfully slow, even with modern hardware
and for _relatively_ simple, but real world applications. 

We need a more efficient method.

## Normal forms

The method we'll be working with uses [normal
forms](https://en.wikipedia.org/wiki/Canonical_normal_form). Generally speaking,
a **normal form** is a special way of writing formulas such that every formula
can be re-written in this way. This is much better illustrated concretely, so
let's talk about **Conjunctive Normal Forms (CNF)**, which are what we're
ultimately interested in.

A formula $A$ is in CNF just in case it is a conjunction ($\land$) of
disjunction ($\lor$) of propositional variables ($p,q,r,\dots$) or their
negations ($\neg p,\neg q, \neg r,\dots$). This is
still quite abstract, but we can work with that using some examples.

The following formulas _are_ in CNF:

+ $\mathsf{RAIN}$
+ $\mathsf{RAIN}\land\neg\mathsf{BIKE}$
+ $\mathsf{RAIN}\lor\neg\mathsf{BIKE}$
+ $(\mathsf{RAIN}\lor\neg\mathsf{BIKE})\land
(\mathsf{SUN}\lor\mathsf{BIKE})$

The following formulas are _not_ in CNF:

+ $\neg\neg\mathsf{RAIN}$
+ $\mathsf{RAIN}\lor \neg(\mathsf{SUN}\land \neg \mathsf{BIKE})$
+ $\neg(\mathsf{RAIN}\land\neg\mathsf{BIKE})$
+ $\neg(\mathsf{RAIN}\lor\neg\mathsf{BIKE})$
+ $(\mathsf{RAIN}\land\neg\mathsf{BIKE})\lor
\mathsf{SUN}$

So, some formulas are and some formulas aren't in CNF. The crucial thing about
CNFs, though, which is what make them a normal form, is that _every_ formula can
equivalently be re-written in CNF. What we mean by that is that for each formula
$A$, there exists a formula $A_{CNF}$ such that for each valuation:
$$\nu(A)=\nu(A_{CNF}).$$ A formula that's equivalent in this way is equivalent
for all (logical and AI) intents and purposes.

Here are the equivalent formulas for the non-CNF formulas:

+ $\neg\neg\mathsf{RAIN}\leadsto\mathsf{RAIN}$
+ $\mathsf{RAIN}\lor \neg(\mathsf{SUN}\lor \neg \mathsf{BIKE})\leadsto
\mathsf{RAIN}\lor (\neg \mathsf{SUN}\lor \neg \mathsf{BIKE})$
+ $\neg(\mathsf{RAIN}\land\neg\mathsf{BIKE})\leadsto \neg \mathsf{RAIN}\lor
\mathsf{BIKE}$
+ $\neg(\mathsf{RAIN}\lor\neg\mathsf{BIKE})\leadsto
\neg\mathsf{RAIN}\land\mathsf{BIKE}$
+ $(\mathsf{RAIN}\land\neg\mathsf{BIKE})\lor \mathsf{SUN}\leadsto
(\mathsf{SUN}\lor\mathsf{RAIN})\land (\mathsf{SUN}\lor\neg\mathsf{BIKE})$

These are easily verified using a truth-table for the two formulas and checking
that they always have the same values. 

Here's one case:

+ $(\mathsf{RAIN}\land\neg\mathsf{BIKE})\lor \mathsf{SUN}$

{{< img src="img/tt-3.png" class="img-thumbnail" >}}

+ $(\mathsf{SUN}\lor\mathsf{RAIN})\land (\mathsf{SUN}\lor\neg\mathsf{BIKE})$

{{< img src="img/tt-4.png" class="img-thumbnail" >}}

As you can see in these two truth-tables: under each possible valuation, the two
formulas have exactly the same truth-table.

The fact that each formula can be re-written in CNF is known as the **CNF
theorem**. You'll not learn the details of the proof, but you'll learn _how_ to
transform formulas into CNFs. 

Basically, all you need to do is to apply the following rules as many times as
needed until your formula is in CNF:

+ $\neg\neg A\leadsto A$
+ $\neg (A\lor B)\leadsto \neg A\land \neg B$
+ $\neg (A\land B)\leadsto \neg A\lor \neg B$
+ $A\lor(B\land C)\leadsto (A\lor B)\land (A\lor C)$
+ $(A\land B)\lor C\leadsto (A\lor C)\land (B\lor C)$

The way to read these rules is that if you come across any of the left formulas
within a non-CNF formula, replace the occurrence with the right formula. 

Here's how the procedure looks like in practice:

$$\mathsf{RAIN}\lor \neg(\mathsf{SUN}\lor \neg \mathsf{BIKE})$$
$$\leadsto\mathsf{RAIN}\lor (\neg\mathsf{SUN}\land \neg\neg \mathsf{BIKE})$$
$$\leadsto(\mathsf{RAIN}\lor \neg\mathsf{SUN})\land (\mathsf{RAIN}\lor \neg\neg \mathsf{BIKE})$$
$$\leadsto(\mathsf{RAIN}\lor \neg\mathsf{SUN})\land (\mathsf{RAIN}\lor \mathsf{BIKE})$$

## DPLL

## Further readings

**To be added**

**Notes:**

[^valuations]: In general, if there are $n$ propositional variables, there are
$2^n$ possible Boolean valuations.  

