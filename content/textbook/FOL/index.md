---
title: FOL
author: Johannes Korbmacher
locked: false
weight: 80
params: 
  last_edited: 08/10/2025
  id: txt-fol
  math: true
---

# First-Order Logic

{{< img src="img/ai_talking_fol.png" class="rounded  float-end inert-img img-fluid m-2" width="200px" >}} 
[First-order logic (FOL)](https://en.wikipedia.org/wiki/First-order_logic) is
one of the most powerful logical systems in common use today. Part of its
strength derives from its [expressive
power](https://en.wikipedia.org/wiki/Expressive_power_(computer_science)): it's
ability to express complex ideas in syntactically straightforward and logically
tractable ways. In fact, FOL-style syntax is the effective paradigm in which
most of modern mathematics, physics, economics, and other formal theories are
formulated.

This makes reasoning in FOL a natural target for AI research into automated
reasoning techniques, proof verification, etc. And, in fact, we'll be looking at
these topics in the _next_ chapter. In this chapter, we'll explore an even
deeper connection between FOL and AI, which has to do with the way we formalize
and store knowledge. We've already explored the idea of {{< abbr
title="knowledge bases">}}KBs{{< /abbr >}}, which are sets of formulas that we
use to represent knowledge about the world. When we're using propositional
logic, these representations are typically rather simplistic, which has to do
with the lack of expressive power in propositional logic.

For example, propositional logic doesn't have the expressive power to properly
capture the content of "all humans are mortal" from our paradigmatic deductive
inference:
$$All humans are mortal, Socrates is human {{< therefore >}} Socrates is
mortal$$

What we *can* write in propositional logic is something like 

$$HUMAN {{< to >}}MORTAL$$ 

which expresses a rule-like connection between being human and being mortal.
But what's lacking here is the idea that this is a connection that holds for
_all_ humans, and so Socrates in particular. FOL has syntactic devices to
express this kind of generality, the so-called "quantifiers", 
{{< forall >}}&ThinSpace; (read: "for all") and 
{{< exists >}}&ThinSpace; (read "exists").
The standard way to represent the claim that all humans are mortal in FOL is
something like the following formula:

$${{< forall >}}x(Human x {{< to >}}Mortal x)$$

This formula says that any arbitrary object, $x$, if it has the property of
being human, then it has the property of being mortal. This general formula we
can particularize to Socrates by taking it's instance:

$$Human(Socrates) {{< to >}}Mortal(Socrates)$$

Then, adding the additional premise that $Mortal(Socrates)$, we can perform our
desired inference using MP. Crucially, however, we can do this for _anything_
whatsoever: 
+ $All humans are mortal, Ada Lovelace is human {{< therefore >}}Ada
Lovelace is mortal$
+ $All humans are mortal, Alan Turing is human {{< therefore >}}Alan Turing is mortal$ 
+ …

When analyzed in FOL these inferences use the same representation of the fact
that all humans are mortal, viz.: ${{< forall >}}x(Human x {{< to >}}Mortal x)$.

{{< img src="img/db_wisdom.png" class="rounded  float-start inert-img img-fluid m-2" width="200px" >}} 
The increase in expressive power from propositional logic to FOL is immense. In
fact, FOL can express almost _any_ kind of fact about the world we'd want to
include in our KB in a straight-forward and logically tractable fashion.
Historically, the need for the expressive power was first noticed in
mathematics, where it became apparent in the 19th century that the rigorous,
axiomatic treatment of basic concepts like
[continuity](https://en.wikipedia.org/wiki/Continuous_function) required
quantifiers. But today, we make use of this expressive powers in virtually all
contexts where we have to store information in databases. As it turns out, FOL
is the logical foundation for [database theory](https://en.wikipedia.org/wiki/Database_theory).

That is, from a logical perspective, we can look at [databases
(DBs)](https://en.wikipedia.org/wiki/Database) as a special form of FOL models,
where [querying](https://en.wikipedia.org/wiki/Query_language) a
database—automatically retrieving information from it—ultimately boils down to
interpreting FOL formulas in DBs. This is, effectively, the content [Codd's
theorem](https://en.wikipedia.org/wiki/Codd%27s_theorem), which makes FOL one of
the most important logical tools for AI: it's the way we interact with KBs and,
more generally, DBs. And this is not only an academic curiosity. As you'll see
in this chapter, FOL is the ultimate logical basis for some of the most
important and widely used query languages, such as [SQL](https://en.wikipedia.org/wiki/SQL). 

At the end of this chapter, you will be able to:

+ define FOL languages and parse FOL formulas
+ explain the concept of an FOL model 
+ determine the objects satisfying a formula in an FOL model
+ represent databases to FOL models
+ query databases using FOL formulas

## Syntax

The language of FOL is a formal language. So, we need to provide an alphabet and
a grammar. As a motivating example, let's take our representation of "all humans
are mortal":

$${{< forall >}}x(Human x {{< to >}}Mortal x)$$

There are a few new kinds of symbols in this formula. The first is the
[**quantifier**](https://en.wikipedia.org/wiki/Quantifier_(logic)) 
${{< forall >}}$, which we read simply as "all". This quantifier
is followed by the
[**variable**](https://en.wikipedia.org/wiki/Variable_(mathematics)) $x$, to
indicate that we're saying something about all things $x$. In general, variables
stand for unspecified objects. They are sometimes likened to
[pronouns](https://en.wikipedia.org/wiki/Pronoun), like "he", "she", "it", or
the singular "they", which stand for concrete but unspecified (by the term)
objects. What follows is a formula involving that variable $x$, which here takes
the form: $$(Human x {{< to >}}Mortal x)$$ What this formula says is that if $x$
is human, then $x$ is mortal. The use of the conditional {{< to >}} should be
clear, but what's crucial is the use of the two
[**predicates**](https://en.wikipedia.org/wiki/Predicate_(logic)) $Human x$ and
$Mortal x$. These are formal expressions that express properties: $Human x$
says that the object $x$ is human, and likewise $Mortal x$ says that $x$ is
mortal. More generally, predicates can also express
[relations](https://en.wikipedia.org/wiki/Relation_(mathematics)), such as the
relation of being bigger than. To say that $x$ is bigger than $y$, for example,
we might use the predicate $BiggerThan xy$ or, in the case of numbers,
sometimes expressions like $x ≥ y$ (which uses [infix
notation](https://en.wikipedia.org/wiki/Infix_notation), rather than the [prefix
notation](https://en.wikipedia.org/wiki/Polish_notation) of $BiggerThan xy$.

There are a few other kinds of symbols worth discussing. If we want to say that
Socrates is human, we use the formula $$Human(Socrates)$$ Here, $Socrates$ is a
[**constant**](https://en.wikipedia.org/wiki/Constant_(mathematics)), which is a
term that stands for one concrete object, like a proper name. If we have an
object (or a sequence of objects), and we want to talk about an object that's
uniquely determined for this object (or group of objects), we use [**function
symbols**](https://en.wikipedia.org/wiki/Function_symbol). For example, if we want
to say that [Socrates' wife](https://en.wikipedia.org/wiki/Xanthippe) is a
midwife, we can use the formula: $$Midwife(wifeOf(Socrates))$$ 

Having multiple objects be related to something is common in mathematics, where
we want to talk, for example, about the
[product](https://en.wikipedia.org/wiki/Product_(mathematics)) of two numbers,
which we can do using infix notation and write $x × y$ or prefix notation like
$×(x,&nbsp;y)$.

In FoL, there's also a special predicate $=$ that allows us to say that two things
are identical, such as: $$wifeOf(Socrates) = Xanthippe$$ Typically, this is used
in infix notation, but we can also use prefix, as in: $$×(2,2) = 4$$ 

We haven't mentioned yet the other quantifier ${{< exists >}}$, which we read as
"exists" or "there is". So, to say that for every number there's a bigger
number, we might use the formula: $${{< forall >}}x {{< exists >}}y
BiggerThan yx$$

The ability to have these kind of **nested** quantifiers is one of the strengths
of FOL, and the need for them in mathematics—for example in the definition of
[continuity](https://en.wikipedia.org/wiki/Continuous_function)—was one of the
reasons FOL was discovered.

Oh, and the usual propositional connectives {{< neg >}}, {{< land >}}, 
{{< lor >}}, and {{< to >}} are also part of FOL, of course.

So, in general, the alphabet of FOL looks something like this:

{{< img src="img/alphabet.png" class="mx-auto rounded d-block inert-img img-fluid" width="900px">}}

Here, we use abstract placeholders or
[metavariables](https://en.wikipedia.org/wiki/Metavariable) to talk about
variables, constants, function symbols, and predicates. In concrete knowledge
engineering situations, however, these expressions will typically be mnemonic,
like $fatherOf x$, $distanceBetween xy$, $Human$, $BiggerThan$, etc.

For the function symbols and predicates, especially when using metavariables, we
need to indicate their [**arity**](https://en.wikipedia.org/wiki/Arity), that is,
how many terms can "legally" follow them. For example, $fatherOf$ function
symbol is _unary_, since we can write $fatherOf Socrates$ but $fatherOf x y$
makes no sense if $x$ and $y$ aren't related. The function $distanceBetween xy$,
instead, is _binary_ since distance is defined between two points. Etc.
Similarly, for predicates, we can write $Human x$,  but not $Human xy$. 

We sometimes indicate a terms arity using superscripts, like $fatherOf¹$,
$distanceBetween²$, $Human¹$, $BiggerThan²$, etc. But often, the arity of a term
is clear from the context, and then we leave it out.

Defining a grammar which generates all the formulas we've mentioned so-far in a
precise, recursive fashion is more difficult than, for example, in the case of
propositional logic. 

First, we need to define the notion of a
[**term**](https://en.wikipedia.org/wiki/Term_(logic)), which is a possibly
complex expression for an object. Examples of terms are the variable $x$, the
constant $Socrates$, but also complex expressions like

$$fatherOf motherOf Xanthippe$$

The following {{< abbr title="Backus-Naur-Form">}}BNF{{< /abbr>}} covers all
these cases:

$$t ::= a ∣ x ∣ fⁿ t₁…tₙ$$

That is, a term is a constant, a variable, or an $n$-ary function symbol
followed by $n$ terms. Even though our syntax doesn't officially require
parentheses in function symbol applications, we sometimes include them to
increase legibility. For example, instead of 

$$distanceBetween birthplaceOf Socrates capitalOf x$$

we also write something like

$$distanceBetween(birthplaceOf (Socrates), capitalOf(x))$$

This grammar gives us the following rewrite rules:

+ $r₀: t {{< longrightarrow >}} c$
+ $r₁: t {{< longrightarrow >}} x$
+ $r₂: t {{< longrightarrow >}} ft₁…tₙ$

Let's apply these rules to generate the parsing tree for our term
These rules generate the following parsing tree for the term:

$$distanceBetween(birthplaceOf (Socrates), capitalOf(x))$$

We get:

{{< img src="img/term-parsing.png" class="mx-auto rounded d-block inert-img img-fluid" width="400px">}}

There exists a special class of terms that will be important later, which are
called [**ground terms**](https://en.wikipedia.org/wiki/Ground_expression).
These are basically terms without variables, such as:
$$distanceBetween(birthplaceOf (Socrates), capitalOf(Greece))$$

Their grammar, however, is easy: we just drop variables from the general
grammar and obtain the BNF:

$$t ::= a ∣ fⁿ t₁…tₙ$$

with corresponding re-write rules $r₀$ and $r₂$.

This gives us the grammar for terms, which can fill the argument places of
function symbols and predicates. We use the notion of a term in the
specification of the grammar for FOL formulas. In BNF, the grammar is:

$$ A::= Pⁿt₁…tₙ ∣ t₁ = t₂ ∣  {{< neg >}}A ∣ (A{{< land >}}A) ∣ (A{{< lor >}}A)∣ (A{{< to >}}A) ∣ {{< forall >}}xA ∣ {{< exists >}}xA$$

Formulas of the form $Pⁿt₁…tₙ$ and $t₁ = t₂$ are also called [atomic
formulas](https://en.wikipedia.org/wiki/Atomic_formula), which express basic
facts like $Human(Socrates)$, $Mortal(fatherOf(x))$. The grammar, then,
generates the FOL formulas much like in propositional logic, just with more
operations. 

We obtain the following re-write rules:

+ $r₃: A {{< longrightarrow >}} Pⁿt₁…tₙ$
+ $r₄: A {{< longrightarrow >}} t₁ = t₂$
+ $r₅: A {{< longrightarrow >}} {{< neg >}}A$
+ $r₆: A {{< longrightarrow >}} (A{{< land >}}A)$
+ $r₇: A {{< longrightarrow >}} (A{{< lor >}}A)$
+ $r₈: A {{< longrightarrow >}} (A{{< to >}}A)$
+ $r₉: A {{< longrightarrow >}} {{< forall >}}x A$
+ $r₁₀: A {{< longrightarrow >}} {{< exists >}}x A$

We can combine these rules with the term rewriting rules to parse an entire
formula and its terms at the same time. For example, for the formula,

$${{< forall >}} x (Human x {{< to >}} {{< exists >}}y (Human y {{< land >}} motherOf x = y))$$

we get:

{{< img src="img/formula-parsing.png" class="mx-auto rounded d-block inert-img img-fluid" width="400px">}}

As you can see, the grammar of FOL formulas can get rather complex.

Before we move on to working with FOL formulas, we need to discuss one important
syntactic issue. To illustrate the idea, consider the following formula

$$Human x$$

So far, we've paraphrased it as saying that $x$ is human. But what is $x$? Well,
we don't know. If there would be a quantifier at the beginning of the formula,
as in

$${{< exists>}}x Human x$$

We'd be saying that there is a human or, a bit closer to the surface syntax of
the formula, there exists an object such that it is human. But without the
quantifier expression to "act" on the variable, the $x$ is a term that stands
for a some unspecified object.

A formula like $Human(x)$, where some variable isn't "captured" by any
quantifier— where some variable is
[**free**](https://en.wikipedia.org/wiki/Free_variables_and_bound_variables)—is
called an [**open formula**](https://en.wikipedia.org/wiki/Open_formula). In
contrast, a formula like ${{< exists>}}x Human x$, where all variables are
captured by some quantifier expression is called a **closed formula** or
[**sentence**](https://en.wikipedia.org/wiki/Sentence_(mathematical_logic)).
Open formulas play a crucial role in database theory, so let's look at them a
bit more closely. 

It turns out that saying _precisely_ and rigorously under which condition a
variable is free and under which condition it is bound (in such a way that a
computer could answer the question by parsing) is a rather subtle logical issue.
We won't go into the full details, but it's important to be aware of the
stumbling blocks.

At first glance, the way variable binding works might seem rather obvious. Take
our formula from above, for example:

$${{< forall >}} x (Human x {{< to >}} {{< exists >}}y (Human y {{< land >}} motherOf x = y))$$

Here it seems rather clear which variable quantifier pairs belong together. We
can illustrate this, for example, in the following "wire diagram":

{{< img src="img/binding.png" class="mx-auto rounded d-block inert-img img-fluid" width="400px">}}

The idea is, roughly, that a variable is bound by a quantifier just in case the
variable "comes after" the quantifier in the formula and the variable is the
same as the one that directly follows the quantifier—we say that its the
variable that the quantifier _ranges_ over.

{{< img src="img/scope.png" class="rounded  float-start inert-img img-fluid m-2" width="150px" >}} 
In logical terminology, the idea that a variable "comes after" a quantifier in a
formula is expressed by saying that the variable is in the quantifier's
[**scope**](https://en.wikipedia.org/wiki/Scope_(logic)). More generally, the
scope of a quantifier is the formula that directly follows it in the recursive
parsing of the expression. That is, in our example, the scope of the 
${{< forall>}}x$ is the open (!) formula:

$$Human x {{< to >}} {{< exists >}}y (Human y {{< land >}} motherOf x = y)$$

We might be tempted to think that that's all there is to say about binding: a
variable is bound by a quantifier just in case the variable is the one the
quantifier ranges over and the variable is in the quantifier's scope. But look
at the following FOL formula:

$${{< exists >}}x (Human x {{< land >}} {{< forall >}}x (Human x {{< to >}}
Mortal x))$$

This is a perfectly fine FOL formula. It parses and has the content that there
exists a human such that all humans are mortal. _But_ we've used the same
variable twice in nested quantifications. While this is not illegal, it creates
issues when we think about binding. 

The following diagram indicates the correct bindings in the formula:

{{< img src="img/capture.png" class="mx-auto rounded d-block inert-img img-fluid" width="400px">}}

That is, even though the red $<span class="dark-red">x</span>$'s are in the
scope of the existential ${{< exists >}}x$, they are not bound by it. They are
bound by the later universal ${{< forall >}}x$, which is "closer" to them and
binds them "first". It's possible to formulate a mathematically precise
condition to exclude such cases, but for us the bottom line is that we've got to
be careful: variables bind to the _first_ quantifier that scopes them.

Open formulas are at the center of database theory. We can think of them as
expressing properties of objects. They can be simple, like $Human(x)$, which
expresses the property of being human. Or they can be complex, like 
$$Human x {{< land >}} {{< exists >}}y (Human y {{< land >}} motherOf x = y)$$
which expresses the property of being a human that has a human mother.

We can also "apply" open formulas to terms, as it were. For example, to apply
the open formula

$$Human x {{< land >}} {{< exists >}}y (Human y {{< land >}} motherOf x = y)$$

to the term $Socrates$, for example, we simply replace the unbound $x$'s with
$Socrates$ to obtain

$$Human Socrates {{< land >}} {{< exists >}}y (Human y {{< land >}} motherOf Socrates = y)$$

This sentence then says that Socrates is human, as is his mother.

The operation that we've applied here is called
[**substitution**](https://en.wikipedia.org/wiki/Substitution_(logic)#First-order_logic):
we've substituted the free variable $x$ with the constant $Socrates$. For an
arbitrary formula $A$, free variable $x$, and term $t$, we denote this operation by
writing $A[x/t]$. That is:

$$(Human x {{< land >}} {{< exists >}}y (Human y {{< land >}} motherOf x =
y))[x/Socrates]$$
$$=$$
$$Human Socrates {{< land >}} {{< exists >}}y (Human y {{< land >}} motherOf Socrates = y)$$

As you'll see, substitution plays a crucial role in FOL reasoning. The only very
important caveat here is that the operation does not apply to bound variables.
That is, for example:

$$(Human x {{< land >}} {{< forall >}}x (Human x {{< to >}}
Mortal x))[x/Socrates]$$
$$=$$
$$Human Socrates {{< land >}} {{< forall >}}x (Human x {{< to >}} Mortal x)$$
And not:
$$Human Socrates {{< land >}} {{< forall >}}x (Human <span class="dark-red">Socrates</span> {{< to >}} Mortal <span class="dark-red">Socrates</span>)$$

## Models 

A model for a formal language, remember, is a representation of a possible
reasoning scenario. In propositional logic, we could identify models with simple
0/1 assignments to the basic propositional formulas, the propositional
variables. From this, we could determine all the other truth-values using
Boolean functions. While Boolean functions still play a role in the semantics
for FOL, the simple approach no longer works here.

When we consider a formula like ${{< forall >}}x (Human x {{< to >}} Mortal x)$,
we're saying something about _all things_. To determine whether such a statement
is true in a given reasoning scenario, we need to know which things exist in the
scenario. This is determined by providing what's called a [**domain of
discourse**](https://en.wikipedia.org/wiki/Domain_of_discourse) or simply
**domain** for our language.

A domain is simply put just a (non-empty) set of objects. So, it could be, for
example:

{{< img src="img/domain_big.png" class="mx-auto rounded d-block inert-img img-fluid" width="900px">}}

This domain is very populated, it contains many of our old friends: little
Jimmy, Mr Sir, and Granny Smith, but also the numbers $1,2,3$ and the Mighty Box
from when {{< logo >}}&ThinSpace;tried magic in chapter 2. And many other
things. Specifying a domain is the first step towards providing a model for FOL.
We typically denote the domain of a model by $D$.

But simply knowing what's in the domain is not enough to determine the
truth-values of our formula. We also need to know what the constants, function
symbols, and predicates of our language express over this domain. We indicate
the interpretation of a term over a model using so-called **semantic brackets**
${{< llbracket >}}$&ThinSpace;and&ThinSpace;${{< rrbracket >}}$. That is ${{<
llbracket >}}a{{< rrbracket>}}$ is the interpretation of the constant $a$, also
called its **denotation**, ${{< llbracket >}}f{{< rrbracket >}}$ is the
interpretation of the function symbol $f$, and ${{< llbracket >}}R{{<
rrbracket>}}$ is the interpretation of the predicate symbol $R$, also called its
[**extension**](https://en.wikipedia.org/wiki/Extension_(predicate_logic)).

Let's look at the constants first. These are expressions like $Socrates$ and
$Xanthippe$, or, depending on our language, names like $littleJimmy$ and
$MrSir$. The idea is that constants are proper names, that is, they denote
objects. So, ${{< llbracket >}}Socrates{{< rrbracket >}}$ is simply going to be
a member of the domain, the thing that is called $Socrates$ in that model. So in
the model that corresponds to reality, we would have, for example:

{{< img src="img/socrates_name.png" class="mx-auto rounded d-block inert-img img-fluid" width="200px">}}

But there are, of course, reasoning scenarios where $Socrates$ denotes little Jimmy:

{{< img src="img/socrates_jimmy.png" class="mx-auto rounded d-block inert-img img-fluid" width="200px">}}

We might even call the light bulb $Socrates$:
{{< img src="img/socrates_bulb.png" class="mx-auto rounded d-block inert-img img-fluid" width="200px">}}

Next, there are function symbols, like $fatherOf$, $birthplaceOf$,
$distanceBetween$, etc. While the idea for how to interpret them is
straightforward, they also present some difficulties. Function symbols stand for
functions, so we interpret them as such: as [mathematical
functions](https://en.wikipedia.org/wiki/Function_(mathematics)) which are
defined on the domain. 

The easiest way of specifying such an interpretation is by means of a function
table, like we used for the truth-functions in Boolean algebra. In the case of a
unary function symbol, like $fatherOf$, we could have:

{{< img src="img/fatherOf.png" class="mx-auto rounded d-block inert-img img-fluid" width="250px">}}

That is, we say that Mr Sir is the father of both little Jimmy and Linus,
Mad Man is the father of Mr Sir, Socrates is the father of Granny Smith, and so
on. 

{{< img src="img/ai_father.png" class="rounded  float-start inert-img img-fluid m-2" width="200px" >}} 
But now the issues begin. In classical FOL, the function symbols need to denote
**total** functions, that is, functions which give an output for _every_ input.
This creates some obvious problems with $fatherOf$. Which value should we assign
to the light bulb, to the Mighty Box, or to the number one? In fact, if our
domain only contains finitely many things there will be a family "loop", where
someone is their own grandⁿ-father. 

We could use [partial
functions](https://en.wikipedia.org/wiki/Function_(mathematics))—functions that
are sometimes *undefined*—to solve the issue, but that would mean we'd move out
of the realm of classical logic. If the father of Socrates would be undefined,
which truth-value should we assign to the claim that his father is human?
Neither $0$ nor $1$ are good options, so we seem to want to say that it's
_undefined_ as well. But handling undefined truth-values requires different
techniques, so we'll postpone that to later.

For now, we basically treat these resulting oddities as a side-effect of our
modeling: they are simplifying assumptions, which we know not to be adequate,
but which we can handle if we are aware of them. For example, we use a function
symbol like $fatherOf$ only in a language that talks exclusively about humans,
perhaps we introduce an idealized first human who's their own father, and so on.

In fact, these kind of issues persist on various levels. For example, the
following is, from a logical perspective, a perfectly valid interpretation of
the $distanceBetween$ function symbol:
{{< img src="img/distanceBetween.png" class="mx-auto rounded d-block inert-img img-fluid" width="700px">}}

_Any_ object in the domain is a valid output for the function. What it means to
say that the distance between little Jimmy and himself is a soda I don't know—
but it _can_ happen in an FOL model. You need to be aware of such issues when
you're knowledge engineering with FOL.

One thing that will be important is that once we've interpreted the constants
and function symbols, we can recursively calculate the denotation of
all—possibly complex—{{< abbr title="terms without variables">}}ground terms
{{</abbr>}}. Take the term
$$distanceBetween(birthplaceOf (Socrates), capitalOf(Greece))$$
for example. It's denotation is given by the following simple calculation:
$${{< llbracket >}}distanceBetween(birthplaceOf (Socrates), capitalOf(Greece)){{< rrbracket >}}$$
$$=$$
$${{< llbracket >}}distanceBetween{{< rrbracket >}}({{< llbracket >}}birthplaceOf{{< rrbracket >}}({{< llbracket >}}Socrates{{< rrbracket >}}), {{< llbracket >}}capitalOf{{< rrbracket >}}({{< llbracket >}}Greece{{< rrbracket >}})){{< rrbracket >}}$$
That is, to calculate the distance between Socrates' birthplace and the capital
of Greece in a model, we check which functions $distanceBetween$, $birthplaceOf$, and
$capitalOf$ express in the model and what the denotation of the constants
$Socrates$ and $Greece$ is and then we just apply these functions to find out
the value. More generally, we have the following recursive equation:

$${{< llbracket >}}f t₁…tₙ{{< rrbracket >}} = {{< llbracket >}}f{{< rrbracket >}}({{< llbracket >}}t₁{{< rrbracket >}}, …, {{< llbracket >}}tₙ{{< rrbracket >}})$$

This leaves only the predicates uninterpreted. We begin with _unary_
predicates—that is, predicates with one place, like $Human$ and $Mortal$ from
our formula ${{< forall >}}x (Human x {{< to >}} Mortal x)$. The idea is that we
the interpretation in a model is simply the set of objects from the domain,
which, according to the model, have the property expressed by the predicate.
Here's an example of what such an interpretation could work out:

{{< img src="img/extensions_1.png" class="mx-auto rounded d-block inert-img img-fluid" width="800px">}}

This is, in a sense, the most natural interpretation of the predicates: $Human$
applies to all the things that we normally think of as humans, and $Mortal$ to
all the things we normally take to be mortal. Humans and animals are mortal,
boxes, numbers, and beers are not. As you can probably tell already, in this
model ${{< forall >}}x (Human x {{< to >}} Mortal x)$ will turn out to be true.

It's important to remark, though, that other interpretations are possible. We're
modeling possible reasoning situations—hypotheticals. So, we could have a model
where, for example, little Jimmy, Mr Sir, and {{< there_is >}}&ThinSpace;aren't
mortal, but the rabbit and lamp are human:
{{< img src="img/extensions_weird.png" class="mx-auto rounded d-block inert-img img-fluid" width="800px">}}

This is a perfectly valid FOL model. And as you can probably tell already, in
this model ${{< forall >}}x (Human x {{< to >}} Mortal x)$ will turn out to be
false since little Jimmy is human but immortal.

To generalize this idea to predicates with more than one place, like the binary
$BiggerThan$ or the ternary $LiesBetween$. In order to interpret them, we use
[**tuples**](https://en.wikipedia.org/wiki/Tuple) of objects in the domain. A
tuple is essentially an ordered
[list](https://en.wikipedia.org/wiki/List_(abstract_data_type) of objects of
finite length. Here are a few examples of tuples over our domain with their
respective lengths using Python-style list notation: {{< img src="img/lists.png"
class="mx-auto rounded d-block inert-img img-fluid" width="700px">}}

Note that with lists, order and multiplicity matters: although both lists have
length 2, the list with Granny Smith in first and Linus in second place is
different from the list with Linus in first and Granny Smith in second place.
And the list with the Ace of Spades in place 1 and 3 still has length 3.

The idea is that we can interpret predicates _in general_ as sets of lists:
the lists of objects that satisfy the predicate. So, for example, the
interpretation of $BiggerThan$, will be the set of lists of length 2 such that
the first element of any list is bigger than the second thing in the list.
Here's an example of how this could work over our domain:

{{< img src="img/BiggerThan.png" class="mx-auto rounded d-block inert-img img-fluid" width="700px">}}

This would mean that Linus is bigger than little Jimmy, Mr Sir is bigger than
Linus and little Jimmy, little Jimmy is bigger than the Mighty Box, and so on.
As in the unary case, the interpretation of $BiggerThan$ can be natural as in
the example, or "weird" as in the following:

{{< img src="img/BiggerThan_weird.png" class="mx-auto rounded d-block inert-img img-fluid" width="700px">}}

Here the Mighty Box is bigger than *everything*—including itself.

Note that, in contrast to function symbols, the interpretations of predicates
don't need to be _total_: not everything needs to be related to everything. For
example, if we have the binary predicate $Sibling$ to say that two things are
siblings, the following is a perfectly fine interpretation:

{{< img src="img/Siblings.png" class="mx-auto rounded d-block inert-img img-fluid" width="500px">}}

That is, it's fine to say that Linus and little Jimmy are each other's siblings
and no one else in the domain is thusly related. Note that this doesn't create
_undefined_ values, as any pair that's not in the set is simply _not_ related,
which means $0$ and not _undefined_.

This idea, then, generalizes to ternary predicates like $LiesBetween$, where
$[LiesBetween]$ will be a set of lists of length 3, where the first item in
every list lies between the second and the third item. 

In fact, the idea generalizes to _all_ predicates. We can say, in general, that
the interpretation of an $n$-ary predicate—a predicate with $n$ places—is a set
of lists of length $n$. Note that this even works in the case of unary
predicates, like $Human$ and $Mortal$. We can just think of sets of objects
equivalently as sets of lists of length 1. That is, we don't really need to
distinguish:

{{< img src="img/set_of_objects.png" class="mx-auto rounded d-block inert-img img-fluid" width="500px">}}
$$vs.$$
{{< img src="img/set_of_lists.png" class="mx-auto rounded d-block inert-img img-fluid" width="600px">}}

There are two ways of representing the interpretations of the predicates that
are very common in computer science and AI contexts. First, if we're dealing
with unary and binary predicates only, we can straightforwardly represent the
interpretation of using
[**graphs**](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)). Here's
how this works:

{{< img src="img/knowledge_graph.png" class="mx-auto rounded d-block inert-img img-fluid" width="900px">}}

What's going on here is that we interpretations of unary predicates are
represented as sets and we're using arrows to indicate that a relation holds
between two objects with the arrow pointing from the first 
{{< abbr title="thing that is related">}}relatum{{< /abbr >}} to the second.

This way of representing models makes them special cases of so-called
[**knowledge graphs**](https://en.wikipedia.org/wiki/Knowledge_graph), which are
an important technology that's been used by search engines like
[Google](https://www.google.com) and others to structure data.

The other way of representing the information in a model is crucial for
[database theory](https://en.wikipedia.org/wiki/Database_theory). The idea is
that we can alternatively write a set of lists as a
[table](https://en.wikipedia.org/wiki/Table_(information)). Here's how this
plays out with our interpretations for $Human$, $BiggerThan$, and $Sibling$ from
before:

{{< img src="img/tables.png" class="mx-auto rounded d-block inert-img img-fluid" width="900px">}}

In these tables, each row corresponds to a list and in this way represents a
basic relational fact. The first table is basically just a list of humans. The
second table gives us the interpretation of $BiggerThan$ with the bigger thing
occupying the first column and the smaller object the second, as suggested by
their headers. The `bigger` and `smaller` in the header go by different names:
"attributes", "identifiers", ... but what's important here is that this naming
is "internal" to the table and not officially part of the interpretation. It
just clarifies what the table does. 

This gives us the basic ingredients for an FOL model:

+ a (non-empty) **domain** $D$,

+ a **denotation** ${{< llbracket >}}a{{< rrbracket >}} {{< in >}} D$ for each constant $a$,

+ a **mathmetical function** ${{< llbracket >}}f{{< rrbracket >}}$ for each function symbol $f$, which maps
inputs from the domain to outputs from the domain,

+ an **extension** ${{< llbracket >}}R{{< rrbracket >}}$ for each predicate symbol.

When we're dealing with different models, we often name them, like $M$ and $N$
or $M₁$ and $M₂$ etc., and we superscript the domains and interpretations by
that name. So $Dᴹ$ is the domain of model $M$ and $Dᴺ$ the domain of model $N$,
${{< llbracket >}}Socrates{{< rrbracket >}}ᴹ$ is the denotation of $Socrates$ in
model $M$ and ${{< llbracket >}}Socrates{{< rrbracket >}}ᴺ$ is the denotation of
$Socrates$ in model $N$, and so on.

## Truth and Satisfaction

It's time to turn to _truth_. The information provided by an FOL model is enough
to calculate the truth-values for all the formulas in its language. Let's figure
out how.

In FOL, we typically write 

$$M{{< vDash >}} A$$

to say that the formula $A$ is true according to the model $M$. If we want to
directly talk about the truth-value of a formula, we denote it by  ${{<
llbracket >}}A{{< rrbracket >}}$. Since we're working in classical logic, we'll
assume that ${{< llbracket >}}A{{< rrbracket >}}{{< in >}}{ 0, 1}$. The two
notations are related by the following equivalence: 
$$M{{< vDash >}} A &emsp; if and only if &emsp; {{< llbracket >}}A{{< rrbracket >}} = 1$$

Our aim right now is to define $M{{< vDash >}} A$ for all formulas $A$.

The simplest case are the so-called [ground
formulas](https://en.wikipedia.org/wiki/Ground_expression), which are atomic
formulas—a predicate applied to terms—without any variables in them. Take the
ground formula $Human LittleJimmy$, for example. The natural thought is that
this sentence ought to be true in a model just in case the denotation of
$LittleJimmy$ is in the extension of $Human$ in that model. This gives us the
first basic truth-condition:
$$M{{< vDash >}} Human LittleJimmy &emsp; if and only if &emsp; {{< llbracket >}}LittleJimmy{{< rrbracket >}} {{< in >}} {{< llbracket >}}Human{{< rrbracket >}}$$

{{< img src="img/SirSocrates.png" class="rounded  float-end inert-img img-fluid m-2" width="100px" >}} 
This idea generalizes quite straightforwardly to binary predicates and ground
expressions involving complex ground terms. For the formula $$BiggerThan
Socrates fatherOf LittleJimmy$$ which says that Socrates is bigger than little
Jimmy's father, we get:
$$M{{< vDash >}} BiggerThan Socrates fatherOf LittleJimmy$$
$$if and only if$$
$$[ {{< llbracket >}} Socrates{{< rrbracket >}}, {{< llbracket >}}fatherOf{{<
rrbracket>}}({{< llbracket >}}LittleJimmy {{< rrbracket >}})] {{< in >}} {{< llbracket >}}BiggerThan{{<
rrbracket >}}$$
That is, the formula is true if the list containing the value of $Socrates$ in first place and the value of $fatherOf
LittleJimmy$ in second place is part of the lists of objects such that the first
is bigger than the second according to the model.

As a general formula, we get:

$$M {{< vDash >}} P t₁…tₙ &emsp; if and only if &emsp;  [ {{< llbracket >}}t₁{{< rrbracket >}}, … , {{< llbracket >}}tₙ{{< rrbracket >}}] {{< in >}} {{< llbracket >}}P{{< rrbracket >}}$$

{{< img src="img/jimmySir.png" class="rounded  float-start inert-img img-fluid m-2" width="100px" >}} 
The case of identity claims with ground terms is equally straight-forward. Take,
for example, the formula: $$MrSir = fatherOf LittleJimmy$$ This formula should
be true just in case the denotation of $MrSir$ in the model _is_ the value of
the $fatherOf$-function applied to the denotation of $LittleJimmy$—in other
words: if _according to the model_ Mr Sir is the father of Little Jimmy.
Expressed formally, this becomes:

$$M {{< vDash >}} Socrates = fatherOf LittleJimmy$$
$$if and only if$$
$${{< llbracket >}}Socrates{{< rrbracket >}} `=` {{< llbracket >}}fatherOf{{<
rrbracket>}}({{< llbracket >}}LittleJimmy{{< rrbracket >}})$$

Note that the $=$ in the formula and the `=` in the condition are different uses
of =: the first is a formal symbol, which we interpret using the "real" identity
relation `=`.

Once we've calculated the truth-values of the basic formulas, we can calculate
the truth-values of their truth-functional combinations—formulas constructed
using ${{< neg >}}, {{< land >}}, {{< lor >}}, {{< to >}}$—in the familiar recursive
fashion we know from Boolean logic:

| | | |
|-|-|-|
|$M {{< vDash >}} {{< neg >}}A$ | &emsp; &emsp; if and only if &emsp; &emsp;  | $!!NOT!! {{< llbracket >}}A{{< rrbracket >}} = 1$| 
|$M {{< vDash >}}(A {{< land >}} B )$ | &emsp; &emsp; if and only if &emsp; &emsp;  | ${{< llbracket >}}A{{< rrbracket >}} !!AND!! {{< llbracket >}}B{{< rrbracket >}} = 1$| 
|$M {{< vDash >}}(A {{< lor >}} B )$ | &emsp; &emsp; if and only if &emsp; &emsp;  | ${{< llbracket >}}A{{< rrbracket >}} !!OR!! {{< llbracket >}}B{{< rrbracket >}} = 1$| 
|$M {{< vDash >}}(A {{< to >}} B )$ | &emsp; &emsp; if and only if &emsp; &emsp;  | $((!!NOT!! {{< llbracket >}}A{{< rrbracket >}}) !!OR!! {{< llbracket >}}B{{< rrbracket >}}) = 1$| 
| &nbsp; | |

In fact, by some simple Boolean reasoning, we can directly give a recursive
definition of $M {{< vDAsh >}}A$ as follows:

| | | |
|-|-|-|
|$M {{< vDash >}} {{< neg >}}A$ | &emsp; &emsp; if and only if &emsp; &emsp;  | $M {{< nvDash >}} {{< neg >}}A$| 
|$M {{< vDash >}}(A {{< land >}} B )$ | &emsp; &emsp; if and only if &emsp; &emsp;  | $M {{< vDash >}}A$ and $M {{< vDash >}}B$|
|$M {{< vDash >}}(A {{< lor >}} B )$ | &emsp; &emsp; if and only if &emsp; &emsp;  |$M {{< vDash >}}A$ or $M {{< vDash >}}B$ |
|$M {{< vDash >}}(A {{< to >}} B )$ | &emsp; &emsp; if and only if &emsp; &emsp;  |$M {{< nvDash >}}A$ or $M {{< vDash >}}B$ |
| &nbsp; | |


In this sense, what we're doing in FOL is an _extension_ of the framework of
Boolean algebra.

The main question is how to interpret quantifiers ${{< forall >}}$ and ${{<
exists >}}$. But before we can do that, we need to talk about variables the  $x,
y, z, …$. Logical theory knows different ways of handling the variables of FOL.
There are approaches that take them to be denoting terms, which requires the use
of so-called **variable assignments**. These work in a similar way as variable
assignments in programming language, where you can set the values of `x, y, z`
to something like so:
~~~python3 {lineNos = false }
x = socrates
Y = little_jimmy
z = mr_sir
~~~
And then, later, you can set the values to something else:
~~~python3 {lineNos = false }
x = little_jimmy
Y = little_jimmy
z = little_jimmy
~~~
Working with assignments has a series of advantages from a logical perspective.
Most importantly, it allows us to assign truth-values to open formulas like
$$(Human x {{< land >}} Mortal x)$$ and directly involve them in deductive reasoning. But from an
algorithmic AI perspective, assignments are not great to work with, which is why
we'll work with an alternative approach that uses specialized constants instead
to interpret the quantifiers.

Here's how this works. We've already mentioned the idea that an open formula
like $(Human x {{< land >}} Mortal x)$ expresses a property—in this case the
complex property of being human and mortal. Another way of putting the idea is
to say that open formulas express **conditions** that objects can satisfy: any
object in our domain either is or isn't a mortal human. 

A natural idea, therefore, is that the semantic value 
${{< llbracket >}}(Human x {{< land >}} Mortal x){{< rrbracket >}}$
of the open formula $(Human x {{< land >}} Mortal x)$ is not a truth-value but a
_set of objects_: those objects that satisfy in the model the condition
expressed by it. Let's work this idea out in some more detail.

Suppose we have some object $d {{< in >}}D$, which lives in our domain. To check
whether the object satisfies $(Human x {{< land >}} Mortal x)$ what we can do is
to add a new constant `d` to our language with the stipulation that: 

$${{< llbracket >}} `d`{{< rrbracket >}} = 1$$ 

{{< img src="img/immortal_jimmy.png" class="rounded  float-start inert-img img-fluid m-2" width="100px" >}} 
That is, we give the object an *ad hoc* name, which makes it possible for us to
talk about $d$ in our formulas. Then, we can say that $d$ *satisfies* the open
formula $(Human x {{< land >}} Mortal x)$ just in case replacing $x$ with the
new term for $d$ gives us a true formula, that is:

$$M {{< vDash >}}(Human x {{< land >}} Mortal x)[x/`d`]$$

The _crucial_ point here is that if we replace the $x$ with `d`, we obtain a
**ground formula**—here $(Human `d` {{< land >}}Mortal `d`)$— whose truth we can
determine using the methods we're already familiar with.

In practice, we sometimes use the object itself as a constant that denotes
itself. So, we write things like:

{{< img src="img/constant_jimmy.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

The truth-conditions then work out to:

{{< img src="img/valuation_jimmy.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

That is, in our normal model, where all humans are mortal, little Jimmy
satisfies the open formula, in the model with immortal Jimmy, he doesn't.

It's worth remarking that this approach, though common in AI practice, is on
shaky logical footing and requires a lot of technical care to be worked out
rigorously—it can be done, but we won't go into the logical details. When it
comes to DB's, however, we'll see a non-shaky version of it.

The idea of satisfaction allows us also to define the very useful notion of the
**extension** of an open formula: the set of objects satisfying a predicate. In
the case of $(Human x {{< land >}} Mortal x)$, for example, this works out to:

$${{< llbracket >}}(Human x {{< land >}} Mortal x){{< rrbracket >}} = { d {{< in >}} D | M {{< vDash >}} (Human x {{< land >}} Mortal x)[x / `d`] } $$

More generally, if $A(x)$ is _any_ open formula with exactly one free variable, we can define:

$${{< llbracket >}}A(x){{< rrbracket >}} = { d {{< in >}} D | M {{< vDash >}} A[x / `d`] } $$

This approach can also be generalized to open formulas with more than one
free variable. Take the following formula, for example:  

$$BiggerThan x y {{< land >}}Human x$$

This formula is not satisfied by a single object, but by a _list_ of objects
from the domain $[d, e]$ satisfies the formula just in case 

$$M {{< vDash >}}(BiggerThan x y {{< land >}}Human x)[x /`d`, y /`e`]$$
$$ if and only if $$
$$M {{< vDash >}}(BiggerThan `d` `e` {{< land >}}Human `d`)$$

where we give *ad hoc* names to both $d$ and $e$ and substitute them in for $x$
and $y$ in our free formula. This gives us the notion of an extension for this
formula as well:

$${{< llbracket >}}(BiggerThan x y {{< land >}}Human x){{< rrbracket >}}$$
$$=$$
$${ [d, e] | M {{< vDash >}}(BiggerThan x y {{< land >}}Human x)[x / `d`, y / `e`]}$$

A crucial observation that we'll refer back to later is that just like the
interpretations of predicates, we can represent the extensions of open formulas
as tables. The extension of open formulas with one variable is just a table with
one column, like this table, which gives the extension of 
$Human x {{< land >}}Mortal x$ in the model with immortal Jimmy:

{{< img src="img/extension_mortal_human.png" class="mx-auto rounded d-block inert-img img-fluid" width="200px">}}

Note that little Jimmy is immortal in this model and thus not in the extension
of the predicate.

And for binary predicates, we get tables with multiple columns. Here's (part of)
the table for ${{< llbracket >}}(BiggerThan x y {{< land >}}Human x){{<
rrbracket >}}$ in the model we've described earlier:

{{< img src="img/extension_BiggerThan_Human.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

What's going on here is that we've eliminated all the rows where the first
column had a non-human in it, like Mighty Box.

This notion of **satisfaction** of an open formula by objects in a model is a
core notion in database theory and is what ultimately underpins database
queries.

But before we go into this, we need to talk about the truth-conditions for
quantifiers. But the notion of satisfaction makes quick work of this. Let's take
again our formula: $${{< forall >}}x (Human x {{< to >}} Mortal x)$$ The idea is that
this formula is true in a model just in case _all_ objects in the domain satisfy
the open formula  $(Human x {{< to >}} Mortal x)$. In other words:
$$M {{< vDash >}}{{< forall >}}x (Human x {{< to >}} Mortal x) &emsp;
if and only if &emsp;{{< llbracket >}}(Human x {{< to >}} Mortal x){{< rrbracket >}} = D$$

This idea generalizes rather nicely. If $A$ is a formula with precisely one free
variable, we can also write $A(x)$ to indicate this. We can then write our
clause as follows:
$$M {{< vDash >}}{{< forall >}}x A(x) &emsp;
if and only if &emsp; {{< llbracket >}}A(x){{< rrbracket >}} = { d {{< in >}} D | M {{< vDash >}} (A(x))[x/`d`] } = D$$

This works exactly analogously for the existential quantifier {{< exists >}}&ThinSpace;.
Take the formula $${{< exists >}}x (Human x {{< land >}}{{< neg >}} Mortal x)$$
This formula says that there is some immortal human. So, it should be true just
in case the extension ${{< llbracket >}}(Human x {{< land >}}{{< neg >}} Mortal
x){{< rrbracket>}}$ of the open formula $(Human x {{< land >}}{{< neg >}} Mortal
x)$ has at least one element, just in case it's _non-empty_, that is: 
$$M {{< vdash >}}{{< exists >}}x (Human x {{< land >}}{{< neg >}} Mortal
x)$$ 
$$if and only if$$
$${{< llbracket >}}(Human x {{< land >}}{{< neg >}} Mortal
x){{< rrbracket>}} `≠ ` { }$$
We can generalize this to the case of a formula ${{< exists >}}x A(x)$, where
$A(x)$ has precisely one free variable just like in the case of the universal
quantifier. We get:
$$M {{< vDash >}}{{< exists >}}x A(x) &emsp;
if and only if &emsp; {{< llbracket >}}A(x){{< rrbracket >}} `≠` { }$$

For the recursive evaluation of formulas, it's helpful to slightly rewrite the
resulting clauses. To see how this works, think about under which conditions we
have that ${{< llbracket >}}A(x){{< rrbracket >}} = D$, and under which ${{<
llbracket >}}A(x){{< rrbracket >}} `≠` { }$. For concreteness sake, let's take
the formula $Mortal x$ as $A(x)$. For ${{< llbracket >}}Mortal x{{< rrbracket >}} =
D$, what needs to be the case is that for _all_ objects $d{{< in >}}D$, we have
that $M{{< vDash >}}Mortal `d`$, that is, we have to have: 
$$M{{< vdash >}}Mortal {{< little_jimmy >}} and M {{< vdash >}}Mortal{{< mr_sir>}} and …$$
Analogously, ${{< llbracket >}}Mortal x{{< rrbracket >}} `≠` { }$ means that
there exists _some_ $d{{< in >}}D$, such that $M{{< vDash >}}Mortal `d`$, that
is:$$M{{< vdash >}}Mortal {{< little_jimmy >}} or M {{< vdash >}}Mortal{{< mr_sir>}} or …$$

This gives us two very clearly recursive clauses for the truth of quantified sentences:

| | | |
|-|-|-|
|$M {{< vDash >}} {{< exists >}}x A$ | &emsp; &emsp; if and only if &emsp; &emsp;  | for some $d{{< in>}}D$, $M {{< vDash >}} A[x/d]$| 
|$M {{< vDash >}} {{< forall >}}x A$ | &emsp; &emsp; if and only if &emsp; &emsp;  | for every $d{{< in>}}D$, $M {{< vDash >}} A[x/d]$| 
| &nbsp; | |


This gives us the concepts of a model and truth in a model for FOL. We are now
in a position to investigate how valid inference in FOL works. But given its
unique combination of practical importance—in math, science, and AI—with
technical … trickiness, we dedicate an entire chapter to this. What we'll look
at now is a connection of FOL models to AI research that is on a much lower
level: the relation to databases—the way we store knowledge and _any_ kind of
data in complex computer systems.

## Databases and FOL

{{< img src="img/db_proceed.png" class="rounded  float-start inert-img img-fluid m-2" width="200px" >}} 
Roughly speaking a [**database (DB)**](https://en.wikipedia.org/wiki/Database)
is an organized collection of
[data](https://en.wikipedia.org/wiki/Data_(computer_science)). Data can be
essentially be _any_ sequence of symbols, but we'll look at data that is a bit
more structured. Our running example will involve information about the capitals
of different countries, in which part of the world they are located, which
language are spoken there. 

We'll store this data as plain text in a
[SQL](https://en.wikipedia.org/wiki/SQL) database, which is by far the most
widely used database system. If you've ever heard of someone professionally
using a database, chances are it was some form of a SQL database. SQL is a
[domain-specific programming
language](https://en.wikipedia.org/wiki/Domain-specific_language), which in
contrast to general purpose programming languages, is used for one specific
purpose: to interact with data.

In SQL, data is stored in **tables**. Before we can put data in those tables, we
need to `<span class="dark-blue">CREATE</span>` them. Here's some SQL code that
sets up three tables, one for storing information about the capitals of
countries, one for storing information about where those countries are located,
and one for the language spoken in the country:

{{< sql_logo >}}
~~~sql
CREATE TABLE CapitalOf (
  country TEXT PRIMARY KEY,
  capital TEXT NOT NULL
);

CREATE TABLE LocatedIn (
  country TEXT PRIMARY KEY,
  continent TEXT NOT NULL
);

CREATE TABLE Language (
  country TEXT,
  language TEXT
);
~~~

Don't worry, you don't need to install anything. In the moment, there will be a
link that allows you to interactively execute the code in the browser.

In any case, running this code doesn't do much, it just sets up the three
tables. Next, we need to populate them, we need to `<span
class="dark-blue">INSERT</span>` data `<span class="dark-blue">INTO</span>` the
tables. Here's how that goes:

{{< sql_logo >}}
~~~sql{linenostart=15}

INSERT INTO CapitalOf VALUES
  ('United States', 'Washington D.C.'),
  ('Netherlands',   'Amsterdam'),
  ('Germany',       'Berlin'),
  ('Italy',         'Rome'),
  ('Japan',         'Tokyo');

INSERT INTO LocatedIn VALUES
  ('United States', 'North America'),
  ('Netherlands',   'Europe'),
  ('Germany',       'Europe'),
  ('Italy',         'Europe'),
  ('Japan',         'Asia');

INSERT INTO LanguageOf VALUES
  ('United States', 'English'),
  ('Netherlands', 'Dutch'),
  ('Germany', 'German'),
  ('Italy', 'Italian'),
  ('Japan', 'Japanese');
~~~

Running _this_ code also doesn't return anything (other than some success
message), it just populates our tables with data. This data is now ready to be
interacted with: we can store it, update it, or _query_ it, which is to ask the
DB for information.

Here's a very simple `<span class="dark-blue">QUERY</span>`, which returns
all the data in our table:

{{< sql_logo >}}
~~~sql

SELECT * FROM CapitalOf;
SELECT * FROM LocatedIn;
SELECT * FROM LanguageOf;
~~~

To run this code click `RUN` after following this [link](https://www.db-fiddle.com/f/bTqC7rED8PrABxDyhN766d/2).

The output looks something like this:

{{< img src="img/db_tables.png" class="mx-auto rounded d-block inert-img img-fluid" width="900px">}}

But wait a second, that looks suspiciously like the specification of an FOL
model using tables! In fact, it _is_ a model for language with three binary
predicates: 

```
CapitalOf², LocatedIn², LanguageOf²
```

It turns out that this is not by chance. On the low level, there is a very deep
correspondence between FOL syntax and models and the way SQL databases work. In
fact, SQL was originally developed on the basis of [relational
algebra](https://en.wikipedia.org/wiki/Relational_algebra), which [Codd's
theorem](https://en.wikipedia.org/wiki/Codd%27s_theorem) proves to be
"essentially equivalent" to FOL. This result is analogous to the relationship
between logical proofs and computer programs, which we've observed in the [Curry
Howard
Correspondence](https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence)
and which is the basis for proof assistants like Lean. In an analogous way, FOL
is the basis for DB theory. Let's explore this idea a bit further by looking at
a more complicated query:

{{< sql_logo >}}
~~~sql

SELECT country
FROM LocatedIn
WHERE continent = 'Europe';
~~~

If you copy-paste this code into the Query field of our
[db-fiddle](https://www.db-fiddle.com/f/bTqC7rED8PrABxDyhN766d/2), you'll get a
table like this:

{{< img src="img/db_query_1.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

But hang on, the similarities continue. Suppose that our language had constants
for the countries (`UnitedStates, Netherlands, Germany, Italy,Japan`),
continents (`NorthAmerica, Europe, Asia`), and languages (`English, Dutch,
German, Italian, and Japanese`), with the stipulation that these constants
indeed denote the corresponding countries, this table gives the extension of the
open formula:

```sql
LocatedIn(x, Europe)
```

We can carry this idea _much_ further:

 {{< sql_logo >}}
~~~sql
SELECT CapitalOf.capital
FROM CapitalOf
JOIN LocatedIn ON CapitalOf.country = LocatedIn.country
WHERE LocatedIn.continent = 'Europe';
~~~

This returns: 

{{< img src="img/db_query_2.png" class="mx-auto rounded d-block inert-img img-fluid" width="300px">}}

But this is just the extension of 

```
{{< exists >}}x (CapitalOf(x,y) {{< land >}} LocatedIn(x,Europe))
```

If we systematically explore these observations, we find that there is a direct
correspondence between SQL queries and open FOL formulas: this is a core idea of
Codd's theorem. This correspondence carries on to a very low level: the
algorithms SQL implementations use to return data for queries _are_ algorithms
for FOL model checking. Much more could be said about this, but that's the
content of a course on DB theory. What the take home message is for today is
that the way we store knowledge in computer systems and query that knowledge is
intimately related to FOL, making it one of the core logical methods for AI.
