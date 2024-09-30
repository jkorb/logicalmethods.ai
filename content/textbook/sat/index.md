---
title: Boolean satisfiability
author: Johannes Korbmacher
weight: 5
params: 
  date: 24/09/2024
  last_edited: 24/09/2024
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

The [DPLL algorithm](https://en.wikipedia.org/wiki/DPLL_algorithm) is the basis
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

$$P_1,P_2,\dots\vDash C\Leftrightarrow \Set{P_1,P_2,\dots, \neg C}\text{ is
\emph{un}satisfiable}$$

The idea is simply that $\Set{P_1,P_2,\dots, \neg C}$ is
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

+ $\nu_1(\neg\mathsf{RAIN})=0,\nu_1(\neg\mathsf{BIKE})=0,$ and $\nu_1(\mathsf{RAIN}\lor\mathsf{BIKE})=1$
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
+ If all rows have value $0$, the inference is valid.

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
disjunctions ($\lor$) of propositional variables ($p,q,r,\dots$) or their
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
+ $\mathsf{RAIN}\lor \neg(\mathsf{SUN}\land \neg \mathsf{BIKE})\leadsto
\mathsf{RAIN}\lor (\neg \mathsf{SUN}\lor \mathsf{BIKE})$
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

Before we move to the DPLL algorithm, we need to talk about what CNF formulas
look like _in general_. Above, we defined a CNF as a conjunction of disjunctions
of propositional variables or their negations. First, some terminology:

+ A _literal_ is a propositional variable or its negation. In BNF:

$$\langle lit\rangle ::= \langle prop\rangle\mid \neg\langle prop\rangle$$

+ A _clause_ is a set of literals. That is, a clause is: $$\Set{l_1,\dots,
l_n},$$ where $l_1, \dots, l_n$ are literals.

A convenient way of talking about CNFs is simply as sets of sets of literals. So
we write: $$\Set{\Set{l_1^1,\dots,l_{n_1}^1},\dots \Set{l_1^k,\dots,l_{n_k}^k}}$$
instead of $$(l_1^1\lor\dots\lor l_{n_1}^1)\land\dots\land(l_1^k\lor\dots\lor
l_{n_k}^k).$$

That is, there are $1,\dots,k$ clauses:

$$\Set{l_1^1,\dots,l_{n_1}^1}$$
$$\vdots$$
$$\Set{l_1^k,\dots,l_{n_k}^k}.$$

The first clause has length $n_1$, the second one length $n_2$..., and the last,
the $k$-th one has length $n_k$.

This is obviously criminally abstract (though unfortunately necessary), but
looking at a concrete example hopefully helps understand this quicker. The idea
is simply that instead of instead of  $$(\mathsf{RAIN}\lor
\neg\mathsf{SUN})\land (\mathsf{RAIN}\lor \mathsf{BIKE}),$$ we just write:
$$\Set{\Set{\mathsf{RAIN},\neg\mathsf{SUN}},\Set{\mathsf{RAIN},\mathsf{BIKE}}}$$

## DPLL

The DPLL algorithm determines whether a given formula in CNF is satisfiable,
i.e. whether there's a Boolean valuation that makes the entire formula true. 

Using the notation from before, we assume that our formula looks as follows:
$$\Set{\Set{l_1^1,\dots,l_{n_1}^1},\dots \Set{l_1^k,\dots,l_{n_k}^k}}$$

The crucial thing to understand is that in order to make the corresponding
formula true, it's sufficient to make one literal from each clause true. 

Let's start with the "criminally abstract" way of saying what that means: we
simply need to find a sequence:
$$l_{i_1}^1\in \Set{l_1^1m\dots, l_{n_1}^1}$$
$$\vdots$$
$$l_{i_k}^1\in \Set{l_k^1m\dots, l_{n_k}^k}$$
of literals with a valuation $\nu$ such that 
$$\nu(l_{i_1})=1$$
$$\vdots$$
$$\nu(l_{i_k})=1$$

The DPLL algorithm is, essentially, a smart way of making this search easier
than just going "brute force" through all the possibilities. In some cases, we
still need to search through some possibilities, but by thinking about the
problem, we can often cut down the search space significantly.

We do so, with the following **rules**, which we'll introduce using less
abstract examples:

+ **Pure literal elimination**. Take the following CNF

  $$\Set{\Set{\mathsf{RAIN},\neg\mathsf{SUN}},\Set{\mathsf{RAIN},\mathsf{BIKE}},
  \Set{\neg \mathsf{SUN},\mathsf{BIKE}},\Set{\neg\mathsf{SUN},\neg\mathsf{BIKE}}}$$

  Note that $\mathsf{RAIN}$ only occurs "positively" in the formula, we never
  have $\neg\mathsf{RAIN}$ anywhere. This means that if we set
  $\nu(\mathsf{RAIN})=1$, we automagically make any clause that contains
  $\mathsf{RAIN}$ true and we can focus on the others (remember that clauses are
  just disjunctions).

  So, realizing this, we can just focus on satisfying 
  $$\Set{\Set{\neg \mathsf{SUN},\mathsf{BIKE}},\Set{\neg\mathsf{SUN},\neg\mathsf{BIKE}}}$$

  But here both $\neg\mathsf{SUN}$ has a similar property as $\mathsf{RAIN}$
  before: it only "negatively" (there's never $\mathsf{SUN}$).

  So, we can just set $\nu(\mathsf{SUN})=0$ to get $\nu(\neg \mathsf{SUN})=1$ as
  desired, and we satisfy both  $\Set{\neg \mathsf{SUN},\mathsf{BIKE}}$ and
  $\Set{\neg\mathsf{SUN},\neg\mathsf{BIKE}}$ at the same time.

  At this stage, what remains after eliminating all the clauses we've satisfied
  is the empty set $$\Set{},$$ as we've found a "truthmaker" for each clause.

  Now, it's easy to check that our valuation $\nu$ with 

  $$\nu(\mathsf{RAIN})=1$$
  $$\nu(\mathsf{SUN})=0$$ 

  indeed makes the formula
  $$(\mathsf{RAIN}\lor\neg\mathsf{SUN})\land(\mathsf{RAIN}\lor\mathsf{BIKE})\land
  (\neg \mathsf{SUN}\lor\mathsf{BIKE})\land(\neg\mathsf{SUN}\lor\neg\mathsf{BIKE})$$

  true, no matter what the value of
  $\nu(\mathsf{BIKE})$ is.

  The rule of **pure literal elimination** says that whenever a literal occurs only
  positively or negatively, we can set its truth-value as desired and eliminate
  every clause that contains the literal from the search altogether.

  Note that instead of $2^3=8$ rows of a truth-table with several formulas
  involved, it only took us 2 applications of pure literal elimination to find a
  satisfying valuation.

+ **Unit propagation**. Another insight concerns so-called _unit clauses_, which
are clauses that contain only a single literal, such as the clause
$\Set{\mathsf{BIKE}}$ in
$$\Set{\Set{\mathsf{RAIN},\neg\mathsf{SUN}},\Set{\mathsf{RAIN},\neg\mathsf{BIKE}},
\Set{\neg \mathsf{SUN}},\Set{\mathsf{BIKE}}}$$ The point is that the _only_ way
to make a member of $\Set{\mathsf{BIKE}}$ true is to make $\mathsf{BIKE}$ true.
We thus need to set $\nu(\mathsf{BIKE})=1$ and can eliminate
$\Set{\mathsf{BIKE}}$ from the search.

  This also means that we _can't_ make $$\Set{\mathsf{RAIN},\neg
  \mathsf{BIKE}}$$ true by making $\neg\mathsf{BIKE}$ true. That would require
  $\mathsf{BIKE}$ to be false. As a result, we need to satisfy the following
  modified formula:
  $$\Set{\Set{\mathsf{RAIN},\neg\mathsf{SUN}},\Set{\mathsf{RAIN}},
  \Set{\neg \mathsf{SUN}}}$$

  At this point, we can continue with the same reasoning and unit clause
  $\Set{\mathsf{RAIN}}$. We infer that $\nu(\mathsf{RAIN})=1$ and get:[^doubling]

  $$\Set{\Set{\neg \mathsf{SUN}}}$$

  A last application of the same principle gives us $\nu(\mathsf{SUN})=0$ and we
  have a solution with the valuation:

  $$\nu(\mathsf{BIKE})=1$$
  $$\nu(\mathsf{RAIN})=1$$
  $$\nu(\mathsf{SUN})=0$$ 

  In general, the rule of **unit propagation** says that when there's a unit clause
  $\Set{l}$ in the CNF, we need to set the truth-value accordingly and can
  ignore that clause in further search, _and_ we need to eliminate any
  "complement" clause of $l$ (i.e. $\neg p$ if $l$ is $p$, and $p$ if $l$ is
  $p$) from any other clause.

  An important thing to note here is that applying unit propagation, we can end
  up with an **empty clause**. For example, applying unit propagation to:
  $$\Set{\Set{\mathsf{RAIN}},\Set{\neg\mathsf{RAIN}}}$$
  gives us $$\Set{\Set{}}.$$ If this happens, it tells us that the CNF is
  **unsatisfiable**. This is because we still need to find a way of making the
  remaining clause true and there are no options. 

  In this case, this makes a lot of sense, since the CNF
  $\Set{\Set{\mathsf{RAIN}},\Set{\neg\mathsf{RAIN}}}$ corresponds to the formula
  $$\mathsf{RAIN}\land \neg\mathsf{RAIN},$$ which is obviously unsatisfiable.

+ **Splitting rule**. The two previous rules, **unit propagation** and **pure
literal elimination** don't cover all the possibilities. There are situations,
where we can't apply either, such as the following CNF:
$$\Set{\Set{\mathsf{RAIN},\mathsf{BIKE}},\Set{\neg\mathsf{RAIN},\neg\mathsf{BIKE}}}.$$

  At this point, we have to **guess**. Simply pick a literal and test if you can
  make it true. We pick $\mathsf{RAIN}$ and assume $\nu(\mathsf{RAIN})=1$. This
  will make the first clause true and what remains to be checked is
  $$\Set{\Set{\neg\mathsf{BIKE}}}.$$ Note that $\neg\mathsf{RAIN}$ has
  disappeared from the clause since we can no longer make that true.

  Now, we can apply unit propagation to give us $\nu(\mathsf{BIKE})=0$ and we
  have the satisfying valuation: $$\nu(\mathsf{RAIN})=1$$
  $$\nu(\mathsf{BIKE})=0$$

  Sometimes the first guess doesn't work. Consider:

  $$\Set{\Set{\mathsf{RAIN},\neg\mathsf{BIKE}},\Set{\neg\mathsf{RAIN},\neg\mathsf{BIKE}},\Set{\neg\mathsf{RAIN},\mathsf{BIKE}}}.$$

  If we guess $\nu(\mathsf{RAIN})=1$ in order to make the first clause true,
  what we end up with is:

  $$\Set{\Set{\neg\mathsf{BIKE}},\Set{\mathsf{BIKE}}}.$$

  By unit propagation, this results in $$\Set{\Set{}}$$ meaning the procedure
  fails.

  But fear not! We haven't tried $\nu(\mathsf{RAIN})=0$. What we do now, is we
  **backtrack** to the last choice and try the opposite choice. That is we go
  back to the CNF
  $$\Set{\Set{\mathsf{RAIN},\neg\mathsf{BIKE}},\Set{\neg\mathsf{RAIN},\neg\mathsf{BIKE}},\Set{\neg\mathsf{RAIN},\mathsf{BIKE}}}$$
  and see if we can proceed with the assumption that $\nu(\mathsf{RAIN})=0$. 

  What we end up with then, is 
  $$\Set{\Set{\neg\mathsf{BIKE}}}.$$ But now we get our satisfying valuation via
  unit propagation and $\nu(\mathsf{BIKE})=0$. 

  So, the final outcome is 
  $$\nu(\mathsf{RAIN})=0$$
  $$\nu(\mathsf{BIKE})=0$$
  which clearly satisfies the corresponding formula
  $$(\mathsf{RAIN}\lor\neg\mathsf{BIKE})\land(\neg\mathsf{RAIN}\lor\neg\mathsf{BIKE})\land(\neg\mathsf{RAIN}\lor\mathsf{BIKE})$$

  The **splitting rule**, in general, says that we should pick the first
  unassigned literal and try all unit propagation and pure literal elimination
  for  both possible truth-values of our picked literal. This means that we try
  the rules on two, simpler CNFs: 

  + one where we eliminate all clauses containing our picked literal and
  removing all its complements, 

  + one where eliminate all clauses containing the negation of our picked
  literal and removing the literal from all remaining clauses.

  Applying unit propagation and pure literal elimination in both cases could
  lead to a solution: if one gives us a valuation, we're done and the formula is
  satisfiable; if both fail, we know the formula is unsatisfiable. 

  There's just one remaining possibility: at some stage, we might have to pick
  _again_ because neither unit propagation nor pure literal elimination work.
  The crucial point here is that the splitting rule is a **recursive rule**. It
  basically breaks down the problem into simpler problems _which we try to solve
  with the same procedure_. But this can be repeated until we've got such a
  simple problem that we easily get a solution. So, we simply guess again, apply
  our rules, backtrack if necessary, until we've tried all the possibilities.

Now we have all the ingredients to describe the DPLL algorithm in general:

+ The **input** is a CNF and we're trying to determine whether its satisfiable.
+ First, we apply **unit propagation** and **pure literal elimination** as many times
as possible.  
+ We check the **termination conditions**:

  + If we end up with an empty CNF $\Set{}$, we've satisfied the formula
  + If we end up with an empty clause somewhere among our clauses $C_1,\dots, C_n$, 
    $$\Set{C_1,\dots,\Set{},\dots C_n},$$ the CNF is unsatisfiable.

+ **Recursion**: If we can apply neither unit propagation nor pure literal
elimination, we use the **splitting rule**, which applies the whole algorithm to
the two CNFs that result setting the value of the first literal as true and
false respectively.

+ **Output**: The output is a yes/no answer about the satisfiability of the
formula, and if we keep track of the valuation along the way, we also get the
satisfying valuation in case of satisfiability.

It's a mathematical fact that this algorithm always terminates and gives the
correct answer: a valuation that satisfies the formula (we find an empty CNF
along the way) or the answer that its unsatisfiable (all CNFs along the way end
up with an empty clause).

## Applications

The [Boolean satisfiability problem
(SAT)](https://en.wikipedia.org/wiki/Boolean_satisfiability_problem) is one of
the most important technical concepts in AI. It's lies at the core of **automated
reasoning techniques** ("theorem proving"), as well as things like [automated planning
and
scheduling](https://en.wikipedia.org/wiki/Automated_planning_and_scheduling).

You've effectively already seen how automated reasoning can work:

+ If you wonder whether $P_1,P_2,\dots\vDash C$, transform it into a SAT problem
for $\Set{P_1,P_2,\dots,\neg C}$.
+ Apply a SAT solving algorithm, like DPLL, to get the answer to the SAT problem.

This is, at the very core, how many [automated reasoning
programs](https://en.wikipedia.org/wiki/Automated_theorem_proving), like
[Prover9](https://en.wikipedia.org/wiki/Prover9),
[Z3](https://en.wikipedia.org/wiki/Z3_Theorem_Prover), and
[Vampire](https://en.wikipedia.org/wiki/Vampire_theorem_prover), work.

In the exercises for this chapter, you'll learn a bit more about the "planning"
applications.

## Further readings

**To be added**

**Notes:**

[^valuations]: In general, if there are $n$ propositional variables, there are
$2^n$ possible Boolean valuations.  
[^doubling]: Note that $\Set{\Set{\neg
\mathsf{SUN}},\Set{\neg\mathsf{SUN}}}=\Set{\Set{\neg \mathsf{SUN}}}$.
