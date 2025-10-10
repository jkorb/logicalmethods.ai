---
title: FOL
author: Johannes Korbmacher
weight: 80
params: 
  id: exc-fol
  math: true
---

# Decoding FOL

Paraphrase the following FOL formulas in natural language:

1. `{{< exists >}}x (FatherOf x brotherOf jimmy {{< land >}} {{< neg >}}
   FatherOf x jimmy)`

2. `{{< forall >}}x ( Fish x {{< to >}} {{< exists >}}y (Fish y {{< land >}}
   BiggerThan y x ))`

3. `{{< exists >}} x SiblingOf jimmy x {{< to >}} {{< exists >}} x( SiblingOf
   jimmy x {{< land >}} {{< forall >}}y ( Sibling x y {{< to >}} YoungerThan y
x))`

4. `{{< exists >}}x{{< exists >}}y (Thief x {{< land >}} Thief y {{< land >}} {{<
   neg >}} x = y)`

# Knowledge Engineering in FOL

[Knowledge engineering](https://en.wikipedia.org/wiki/Knowledge_engineering) is
the complex process of developing a framework in which to encode knowledge about
a specific domain. There are different approaches to this problem, but here
we'll try out an FOL-based approach.

The problem we're tackling is to represent information about a given setup using
FOL formulas. The first step on the approach is to decide on a suitable
vocabulary. Since we're working with FOL languages, this means that we need to
pick suitable constants, function symbols, and predicates to represent the
information. Picking the right vocabulary is crucial for success when dealing
with a knowledge engineering problem: choosing the wrong vocabulary can make
representations clunky and hard to work with, even if—in some sense—still
correct.

Picking the right language is closely related to finding a suitable
[ontology](https://en.wikipedia.org/wiki/Ontology_(information_science)) for the
problem. That is, we need to say which objects exist in the information, which
functions and properties are at play. We also need to answer questions like
whether we can reduce some properties to others do have a simpler language. For
example, should we have a separate predicate for `Uncle²` or should we define it
using `Male¹`, `Sibling²`, and `Parent²`, where rather than `Uncle x y` we use:

```
Male y {{< land >}} {{< exists >}}z (Parent z x {{< land >}} Sibling y z)
```

`Uncle x y` is much simpler, but the previous formula contains more information.
There is a trade-off that needs to be weighed carefully for every proposed
knowledge engineering solution.


The second step in FOL knowledge engineering is to take the given information
and to encode it with FOL formulas. Here, the main challenge is adequacy: we
need to find formulas whose FOL truth-conditions resemble the given information
as closely as possible, while remaining within the confines of FOL.

For a concrete knowledge engineering problem, lets consider the following
marketing information about {{< logo >}}&ThinSpace; provided by its developer:

{{< img src="img/competition.png" class="rounded  float-start inert-img img-fluid m-2" width="200px" >}} 
*Our {{< logo >}}&ThinSpace;is the top-of-the-line AI system from AI-Labs. It is
a hybrid system that has both symbolic and sub-symbolic sub-routines. This means
that {{< logo >}}&ThinSpace;is both capable of carrying out all traditional
reasoning tasks, such as natural deduction or `SAT` solving, as well as
different learned tasks, such as image and voice recognition. This is in
contrast to its predecessor model `KnowIt∀`, which only had symbolic routines
and could only carry out reasoning tasks. It also makes {{<logo>}} superior to
the competition's model, `DeepL`, which is a purely sub-symbolic AI-system and
while able to carry out all learned tasks, can only carry out some simple
reasoning tasks.*

1. Devise a suitable FOL language for encoding the information about the three
   AI-systems. Justify your design choices.

2. Encode as much information as possible from the advert as FOL formulas. Is
   there information you chose not to include? If so, why?

3. It's a bad idea to include a function symbol `makerOf` in this language.
   Explain why.

# Knowledge Representation with FOL Models

For this exercise, we are working with an FOL language with the following vocabulary:

+ Constants: `jimmy`, `linus`, `sir`, `sir`,`lady`, `gran`, `ny`, `london`, `soccer`

+ Predicates: `Loves²`, `IsFrom²`, `ParentOf²`, `LivesIn²` 

Now consider the following facts about our protagonist, little Jimmy:

*Little Jimmy and his brother, Linus, are the children of Mr Sir and Lady Dame.
They family lives in New York, where Lady Dame is from. But both Jimmy and his
brother were born in London, where their father is from. The children's paternal
grandmother is Granny Smith, who still lives in London, where she was born. The
children and their grandmother love soccer, unlike their parents.*

1. Represent the information as a FOL model. Specify the model in set-theoretic
   terms, as a knowledge graph, and in table form. Make sure to include the
information about which constant denotes which object.

2. Go to [https://www.db-fiddle.com/](https://www.db-fiddle.com/) and, taking
   the code from the textbook as a template, create a SQL database that
contains the information about the model. Make sure to select `SQLite v3.46` on
the top left for the language, otherwise the code won't run. Verify your code by running a query that prints all tables.

3. In logic, there is the concept of a
   [diagram](https://en.wikipedia.org/wiki/Diagram_(mathematical_logic)), which
is, essentially, the idea of collecting all the true atomic sentences and true
negations of atomic sentences in the model. The _positive_ diagram is the set of
only the true atomic sentences, without the true negated ones. Determine the
positive diagram of the model we've just described. Is this essentially
different from any of the other methods of representing the model?

# Denotation

Suppose that we're working with an FOL language that has the single constant
`null`, as well as the function symbols `succ¹` and `prod²`.

Consider the model whose domain $D = { 0, 1, 2, ... }$ is the set of natural
numbers and where:

+ `{{< llbracket >}}null{{< rrbracket >}} = 0`
+ `{{< llbracket >}}succ{{< rrbracket >}}` is defined by the equation `{{< llbracket >}}succ{{< rrbracket >}}(n) = n + 1` for all `n {{< in >}} { 0 , 1, 2, ... }`.
+ `{{< llbracket >}}prod  {{< rrbracket >}}` is defined by the equation `{{< llbracket >}}prod{{< rrbracket >}}(n,m) = n × m` for all `n, m {{< in >}} { 0 , 1, 2, ... }`.

In this model, determine: 

```
{{< llbracket >}} prod succ null  prod succ succ 0 succ 0{{< rrbracket >}}
```

For this purpose:

1. Parse the expression according to the grammar for FOL terms.

2. Recursively calculate the values of each term, following the terms parsing
   tree.

# Satisfaction

In the model you've characterized in exercise 3, determine the extensions of the
following open formulas. Give them in table form:

1. `Loves x soccer {{< land >}} IsFrom x ny`

2. `IsFrom x y {{< land >}} ParentOf x sir`

3. `{{< exists >}}y ParentOf y x {{< land >}} {{< exists >}} z ParentOf z y`

4. `IsFrom x y {{< land >}} LivesIn x y`

# SQL Queries

**Will you go online Friday afternoon**

<!-- We've mentioned that there is a one-to-one correspondence between SQL queries. -->
<!-- In this exercise, we'll explore this connection a bit more, by looking at how -->
<!-- the connectives {{< land >}} and {{< neg >}} are reflected in SQL queries. -->
<!---->
<!-- We return to our country DB from the textbook examples. You can open it on -->
<!-- [db-fiddle](https://www.db-fiddle.com/f/bTqC7rED8PrABxDyhN766d/2) again. -->
<!---->
<!-- Here's a query that asks for  -->
<!---->
<!-- {{< sql_logo >}} -->
<!-- ~~~sql -->
<!-- SELECT CapitalOf.country, CapitalOf.capital -->
<!-- FROM CapitalOf -->
<!-- JOIN LocatedIn ON CapitalOf.country = LocatedIn.country -->
<!-- WHERE LocatedIn.continent = 'Europe'; -->
<!-- ~~~ -->


