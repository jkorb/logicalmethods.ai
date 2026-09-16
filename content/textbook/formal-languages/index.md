---
title: Formal languages
author: Rick Nouwen and Johannes Korbmacher
locked: false
weight: 20
params:
  date: 09/09/2024
  last_edited: "15/09/2026"
  id: txt-lang
---

# Formal languages

{{< img src="/img/drawings/fl_ai_language.svg" class="rounded  float-start inert-img img-fluid m-2" width="350px">}}
When we develop AI systems, we immediately run into an issue: computers, which
are the basis for any modern AI technology, "speak" a different language than
we do. They speak in the proverbial 1's and 0's.

That is, even if we understand what intelligent behavior is and we manage to
break it down into instructions that a computer can, in principle, follow (two
big _ifs_), we still need to express these instructions in an unambiguous
language that the computer can _understand_ (i.e. execute).
{{< img src="/img/drawings/fl_ai_understand.svg" class="rounded  float-end inert-img img-fluid m-2" width="350px">}}
We need to write *code*.

Moreover, since intelligent behavior involves knowledge about the world and
acting on the basis of such knowledge, we need to be able to communicate such
knowledge to any prospective AI system. That is, we need a way to *represent*
our knowledge about the world.

The solution to the first problem is—of course—*programming languages*, which
are precisely defined, rule-based systems for expressing unambiguous
instructions in a language that we can understand, but which we can
automatically transform into instructions that a computer can understand. The
solution to the second problem is *knowledge representation languages*, which
are systems of precisely defined expressions that can represent various facts
about the world.

It turns out that, fundamentally, both programming languages and knowledge
representation languages are instances of the same kind of mathematical
structure: they are *formal languages*.

Formal languages have deep roots in the study of valid inference. Today,
they are used throughout logic, computer science, and AI.

In this chapter, we'll study formal languages, how they are defined
mathematically, and how they are used in logical theory and AI.

{{< callout type="objectives" >}}
- Explain why formal languages are useful in logic and AI.
- Define formal languages using alphabets and grammars.
- Apply parsing algorithms to logical formulas.
- Interpret simple algorithms written in pseudocode.
- Represent simple information in a formal language.
{{< /callout >}}

## Natural vs. formal languages {#formal-vs-natural-languages}

_English_, _[St̓át̓imcets](https://en.wikipedia.org/wiki/Lillooet_language)_ and
_[Ripuarian](https://en.wikipedia.org/wiki/Ripuarian_language)_ are examples of
natural languages. _Python_, _propositional logic_ and _[algebraic chess
notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess))_ are
examples of formal languages. What makes a language a natural language and what
makes it a formal one?

We all speak at least one natural language and many of us speak multiple. A
natural language is a naturally evolved system that you learn spontaneously, for
instance by interacting with your parents and other people around you when you
are very young. Native speakers of English, St̓át̓imcets or Ripuarian didn't learn
their native language at school or by studying grammar books, but simply by
being in an environment where the language was used. Because natural languages
are acquired in this way, they are also very susceptible to change. They
constantly evolve, just by being used and passed on to next generations.

{{< img src="/img/drawings/ai_learning_language.svg" class="rounded float-start inert-img img-fluid mx-2 my-1" width="450px">}}
In contrast, nobody learns Python, propositional logic or algebraic chess
notation simply by interacting with their parents. Also, these languages clearly
didn't evolve naturally and while the conventions of these languages may change
over time, they do not do so spontaneously, but rather because a community of
users explicitly decides to make a certain change.

Having command of a natural language is an extremely powerful skill. It allows
you to communicate with others about your desires, your thoughts, your
observations, your plans. It allows you to learn things in school, to teach
other people what you have learned, to enjoy art in the form of literature,
poetry and song lyrics, to laugh at jokes, to persuade others to change their
actions, etc. etc.

Language models make use of the fact that natural language is such a pervasive
part of our lives. Because language is everywhere, it creates
an enormous wealth of data about many facets of human existence and human
cognition, ready as input for machine learning. Given this, why don't we just
use natural language for everything in AI? What do we need formal languages for?

There are many different reasons formal languages are important in general and
for AI in particular. One reason that is relatively quick to appreciate is that
powerful large language models trained on natural language are developed using
programming languages, which are formal languages. Even when we describe the
system we want in natural language and have code generated for us, the
implementation still needs precisely specified computational operations.
So even sub-symbolic approaches to AI rely on formal languages.

More generally, natural languages have a property that complicates their use
in logic, maths, and the precise storage of knowledge: they are _ambiguous_.
Statements formulated in a natural language can often be interpreted in
multiple ways. As a consequence, if we choose to use natural language as a
basis for drawing inferences, we can't always be sure that rules or facts
that we would want an AI system to benefit from are understood in the
appropriate way.

### Ambiguity

Imagine that we want to build an AI system that gives out safety advice on
eating foraged mushrooms. We have access to a lot of expert knowledge about
mushrooms. One idea could be to feed this knowledge to the AI system in the form
of natural language statements. For instance, we could give the system lots of
English language sentences that together make up all our knowledge. Say, these
sentences include the following:

$$
(S) If a mushroom has red spots and gills, then it's not poisonous.
$$

Also, we prompt the AI system with another English language sentence:

$$
(T) The mushroom in front of me has red spots and gills.
$$

It may seem straightforward how the AI system can prepare some advice on the basis
of the knowledge captured in $S$ and the information in the user
prompt $T$.

We may think that all the AI system needs to do is recognise that it can apply
the following deductive inference pattern:

{{< callout type="definition" title="Modus ponens" >}}
{{< term "modus-ponens" "Modus ponens (MP)" >}} is the rule that licenses the
inference from an if-then statement together with its if-part to its then-part.
{{< /callout >}}

So, for example, MP licenses the inference from "if the door is open, you can
come in" and "the door is open" to "you can come in". Generally,
modus ponens licenses all inferences of the following form, where $A$ and $B$
are *any* two statements:

{{< inference layout="stacked" >}}
  If A, then B
  A
  ---
  B
{{< /inference >}}

Applying this principle, then, you would expect that from the two statements
above the AI system should infer that the mushroom in question is not poisonous.

{{< img src="/img/drawings/gimmick_mushroom.svg" class="rounded float-start inert-img img-fluid m-4" width="150px">}}

The problem, however, is that "the mushroom in front of me has red spots and
gills" is ambiguous. It could either mean that the mushroom has red spots and
red gills, or it could state that it has red spots and that it has gills (of
whatever colour). Because of this we cannot be sure what either of these
statements is saying exactly. It is not clear what the rule is that $S$ is
intended to capture, nor is it clear what observation the user is describing
with $T$. And because of all that uncertainty, we cannot be sure whether modus
ponens applies. For instance, perhaps $S$ is intended to mean that mushrooms
that have red spots and red gills are not poisonous, while $T$ is intended to
mean that the mushroom in question has gills (gray ones, in fact) and red
spots. In that case, modus ponens would not apply. In other words, if our AI
system accidentally interprets these sentences not as they were intended, it
could end up applying modus ponens and cause the users to poison themselves.

A related problem concerns the words "if" and "then" in languages like English.
Say, I remove the ambiguity in $S$ above and instead use the following
sentence:

$$
(S') If a mushroom has red spots and red gills, then it's not poisonous.
$$

It is now clear what this means. It tells us what is the case when a mushroom
has the features that are mentioned. Does this tell us anything about mushrooms
that do not have red spots and red gills? For most people, the intuition is
that it does not: on the basis of just $S′$ I cannot conclude anything about a
mushroom with black gills and no spots.

In conversation, however, we sometimes take "if" and "then" to suggest more.
Imagine yourself saying this to a child (or adult 🍨):

$$
(U) If you behave well, I will buy you an ice-cream.
$$

This clearly tells the child (via MP) what happens when they are
well-behaved. However, in this case the child may also form an expectation
about what happens when they do _not_ behave well. $U$ seems to suggest that if
the child does _not_ behave well, then there _won't_ be any ice-cream.

This example raises a slightly different issue from the one involving red spots
and gills. The child may take the promise to mean more than it literally says.
But an expectation about what somebody means isn't automatically a valid
inference from what they said. When we represent knowledge, we need to decide
which information we want to capture: the promise itself, or the further
condition that the child takes it to suggest. A formal language lets us state
that choice explicitly. It doesn't make the choice for us.

Ambiguity is extremely common. Whenever we want to represent knowledge and
rules precisely, we need to make clear which interpretation we intend. The
point of using a formal language is to give expressions a **precisely defined,
unambiguous meaning**. We specify how expressions are built and how their
meaning depends on their parts. First we'll look at the rules for building
expressions; the rules for their meaning come later. As we'll see when we
return to ambiguity in the section on [unique readability](#unique-readability),
we need to design those rules carefully.


## Sets

So far, you've only had a glimpse of what a formal language looks like. We have
not properly specified one yet. Before we can go ahead and give the
mathematical definition of what a formal language is, we need to talk about
_sets_. Formal languages _are_ sets. So, we need to know what sets are before
we can talk about formal languages.

Here's an informal definition of what a set is:

{{< callout type="definition" title="Set" >}}
A {{< term "set" "set" >}} is an _abstract_ collection of objects.
{{< /callout >}}

If some object $x$ is in a set, we say that $x$ is one of its **{{< term
"set-membership" "elements" >}}** or **members**. Elements of a set are also
said to _belong to_ the set or to _be contained in_ the set.

What we mean when we say that sets are _abstract_ collections of objects is
that a set is specified _completely_ by its members. All that matters to a set
is which objects belong to it---beyond that nothing can be said about it. So,
for example, sets don't have locations. But, for instance, there is also no
order to the elements in a set and an object is either in the set or not - it
cannot be in a set multiple times.

It can sometimes be helpful (but also sometimes hurtful!) to think of a set as a
"bag" of objects from an ambient "space". Consider the following illustration:

{{< set-diagram scene="membership" >}}

The rectangle is our ambient space of objects. The outline groups the members
of $S$: Little Jimmy, my beer, the number 1, and a rabbit. Select **Belongs to S** to highlight its members, or **Outside S** to see
which objects do not belong. The text view describes the same picture.
This is a visualization aid: sets have no physical shape or location, and the
picture represents only which objects belong to the set.

A set may contain any kind of object: numbers, symbols, people, or even other
sets. For $S$ a set and $a$ an object, we write $$a ∈ S$$ to say that $a$ is an
element of $S$, and we write $$a ∉ S$$ to say that $a$ is _not_ an element of
$S$. If we have many objects $a₁, …, aₙ$, then we also write $$a₁, …, aₙ ∈ S$$ to
say that $a₁ ∈ S$, $a₂ ∈ S$, …, and $aₙ ∈ S$.

If the elements of a set are precisely $a₁, …, aₙ$, then we can
denote the set by
$${a₁, …, aₙ}$$
This is called an **{{< term "extensional-definition" "extensional definition" >}}**
of the set. So, for example, the set
{{< set alt="The set containing Little Jimmy and the set containing 1 and a beer." >}}
[{"image":"gimmick_little_jimmy"}, {"set":["1", {"image":"gimmick_beer"}]}]
{{< /set >}}
contains precisely little Jimmy and the set that contains the number 1 and my
beer as elements. The set has *two* elements: little Jimmy and another set. The
number of elements of a set is known as its
**{{< term "cardinality" "cardinality" >}}**.

For most interesting sets, however, we cannot give an extensional definition.
One reason for this could be that we do not know exactly what the elements are.
Think for example of the set of solutions to a complex mathematical equation.
Or it could be that there are simply too many members to list, like in the set
$ℝ$ of [real numbers](https://en.wikipedia.org/wiki/Real_number). In such
cases, we typically use another technique to denote the set in question.

To illustrate the idea, think of the set of numbers that satisfy the equation
$$x² = 2$$ You'll probably remember that there are _two_ such numbers, namely
$x = √2$ and $x = -√2$. So, we can denote the set we have in mind as
$${√2, -√2}$$
But pretend for a moment that you _don't_ remember this basic math fact.
Then, there's still another way of denoting the set in question. The idea is to
write $${ x ∣ x² = 2}$$ to denote the set of all $x$, such that $x² = 2$. This
method is **{{< term "set-abstraction" "set abstraction" >}}**.

More generally speaking, if the elements of a set are precisely the objects
satisfying condition $Φ$---in our case being such that the square is two---then
we can denote the set by:

$$
{x : Φ(x)}
$$

Here, $x$ ranges over a specified set of possible objects; in our example,
the real numbers. The condition picks out the members of our new set from
that domain.

An object---let's call it $a$---is a member of the set ${x : Φ(x)}$ just in
case the object satisfies the property $Φ(x)$, which we write $Φ(a)$. So, in the case
of our set ${ x ∣ x² = 2}$, we know that $$√2 ∈ { x ∣ x² = 2}$$ since $(√2)² =
2$. But also the other way around, we know that $$√3 ∉ { x ∣ x² = 2}$$ since
$(√3)² = 3 ≠ 2$. For these examples, squaring the number lets us check
membership directly. In general, a condition can define a set even when we
have no procedure that always settles whether a given object belongs to it.

An important reason why non-extensional definitions are handy is because many
of the kinds of sets we want to study are typically infinite. For example,
$$
P = {x : x is a prime number}
$$
is the set that contains all and only the [prime
numbers](https://en.wikipedia.org/wiki/Prime_number). So, we have $3 ∈ P$, but
$4 ∉ P$. But by [Euclid's
theorem](https://en.wikipedia.org/wiki/Euclid%27s_theorem), there are
infinitely many prime numbers. We can therefore never finish listing them.[^primes]
We can write
$$
P = {2, 3, 5, 7, …}
$$
but the dots rely on our understanding that the list continues through all
the primes. Set abstraction states the membership condition explicitly.

## Formal languages

So what exactly _is_ a formal language?

{{< callout type="definition" title="Alphabet and formal language" >}}
 A {{< term "formal-language" "formal language" >}} is a
{{< term "set" "set" >}} of finite {{< term "string" "strings" >}} of symbols,
which are recruited from a background set known as the language's
{{< term "alphabet" "alphabet">}}.
{{< /callout >}}

The alphabet of a language gives us its building blocks, its _grammar_ tells us
how they can be combined to form expressions---which strings belong to the
language.

### Alphabets

Sequences of symbols are recruited from an alphabet. We usually write $Σ$ to
denote the alphabet of a language.

It's important to note that the alphabet can be _any_ set. So, e.g., the set of
all the digits 0--9,

$$
Σ = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
$$

is a perfectly fine alphabet. We can use it to define the language of the
_{{< term "numeral" "numerals" >}}_, which are terms for natural numbers. Let's go!

A first thought might be this: Can't we just take any sequence of digits and we'll
always have a numeral? To make this idea precise, we can use the so-called
{{< term "kleene-star" "Kleene star" >}}, named after the American mathematician
[Stephen Kleene](https://en.wikipedia.org/wiki/Stephen_Cole_Kleene) and written as an
asterisk $*$. The set $Σ*$ is the set of all sequences that you can build with
the elements of $Σ$. This set is a formal language in the technical sense and
it includes sequences such as $15935304888$, $249583$, and simply $2$. But
importantly, this is _not_ the set of what we normally consider to be the
numerals, though. Certainly, any numeral is a sequence of digits and so in
$Σ*$, but conversely, not every element of $Σ*$ is a numeral. For example, $Σ*$
includes sequences like $000000001$ and $000881$, which we exclude from our
language of numerals by adopting the convention that only $0$ itself may start
with zero.

Note that, here, we understand "sequence" to mean a **finite**
{{< term "string" "string" >}}, including the notorious
{{< term "empty-string" "empty string" >}}, which is denoted $ε$.
The empty string belongs to $Σ*$ but for most of what we're doing, it is more
of a theoretical artifact that we'll have to occasionally handle, but doesn't
play an important role.

The Kleene star gives us the set of all sequences made from an alphabet, but
most formal languages we are interested in will be a smaller subset of
$Σ*$---just like the numerals. To specify them, we need a _grammar_.

### Grammar

{{< callout type="definition" title="Grammar" >}}
A {{< term "grammar" "(formal) grammar" >}} is a collection of _rules_ for
generating the strings of a formal language.
{{< /callout >}}

These rules can take different forms, but in the case of the formal languages
of logic, grammars typically use a technique known as **inductive definition**:

{{< callout type="definition" title="Inductive definition" >}}
An {{< term "inductive-definition" "inductive definition" >}} defines a set by:
- The _base case_, which specifies the _initial elements_ of the set.
- The _induction step_, which gives _constructions_ that form new elements from old ones.
- The _closure condition_, which states that _nothing else_ is an element.
{{< /callout >}}
The closure condition effectively states that the members of the set are all
and only the objects that can be obtained from repeatedly applying the
constructions to the members of the set.

Inductive definitions are an _incredibly_ powerful mathematical tool. Here is
an example of how we can use definition by induction to define the set of all
numerals. We say that:

1. Each of $0,1,2,3,4,5,6,7,8,9$ is a numeral (base case).
2. If $N$ is a numeral other than the single string $0$, then appending any
   digit gives another numeral: $N0,N1,…,N9$ (induction steps).
3. Nothing else is a numeral (closure condition).

Here's how this definition works: the first step gives us all single-digit
numerals, including $0$. The second lets us append digits to a numeral that
doesn't start with zero. For example, the definition shows that $120$ is a
numeral:

$$
(Step 1):  1 is a numeral
(Step 2):  12 is a numeral
(Step 3):  120 is a numeral
$$

Using this inductive definition, there is no way to show that $01$ is a
numeral. Given the final line of the definition, we must conclude that it is
therefore not a numeral.[^mp]

The language of numerals is a very simple example of a language, but it already
illustrates the power of induction very well. Note that there are _infinitely
many_ numerals---one for every natural number. As we've observed before, this
means that we can't write the set of numerals in a finite list, that is give an
**{{< term "extensional-definition" "extensional definition" >}}** of the set.
We might try to give a definition using
**{{< term "set-abstraction" "set abstraction" >}}**
and consider the set $$N = {x ∣ x is a numeral},$$ but then we face the obvious
question: _When is a string a numeral?_ The inductive definition gives us a
precise answer to this question: a string is a numeral if and only if it can be
constructed following the above inductive definition of the numerals.

{{< img src="/img/mascot/bulb.svg" width="70px" class="float-end ms-3" >}}
In this way, an inductive definition lets us describe an infinite set with
a few rules. It also tells us how to construct its members step by step.
An object belongs to the set exactly when it has such a construction.
Searching for one, however, needn't always settle membership: if none exists,
a search might keep going without ever establishing that there is none.

For our numeral language, we can decide membership: check that the string
contains at least one digit, only digits, and no leading zero unless the
string is $0$. We'll return to the question of deciding membership when we
discuss parsing.

## Propositional Languages {#the-language-of-logic}

{{< img src="/img/drawings/logic_abc.svg" class="rounded  float-end inert-img img-fluid m-2" width="450px">}}
Just like the language of numerals we just explored, the languages of logic are
also sets of sequences of symbols. We often refer to these sequences as
**{{< term "formula" "formulas" >}}**, so a logical language is a formal language
consisting of formulas. In order to specify such a
language, we will want to specify an alphabet and a grammar so that the formulas
that make up the formal language are well-formed sequences that are useful for
the study of valid inference. Here, we will define the **language of
propositional logic**.

Starting with the alphabet, we should first note that, in logic, not all
elements of the alphabet play the same role. (Similarly, in the case of the
language of numbers we saw that 0 played a different role than the other
digits). For propositional logic, the alphabet consists of three kinds of
symbols:

+ {{< term "propositional-variable" "propositional variables" >}} or **atoms**:
symbols that stand for simple propositions
+ {{< term "logical-operator" "operators" >}}: symbols that operate on or connect propositions to make complex propositions
+ {{< term "auxiliary-symbol" "auxiliaries" >}}: symbols that indicate how parts of a formula combine

The standard alphabet for the language of propositional logic is:

{{< annotated-math prefix="Σ = {" suffix="}" title="The propositional alphabet" >}}
[
  {"symbols":"p₁, p₂, p₃, …", "label":"variables (atoms)", "position":"below", "color":"red"},
  {"symbols":"¬, ∧, ∨, →, ↔", "label":"operators", "position":"above", "color":"blue"},
  {"symbols":"(, )", "label":"auxiliaries", "position":"below", "color":"green"}
]
{{< /annotated-math >}}

Here:

- $p₁, p₂, p₃, …$ are the _(propositional) variables_ or _atoms_,
- $¬, ∧, ∨, →, ↔$ are the _operators_, and
- $(, )$ are the auxiliaries.

The index $i$ in $pᵢ$ can be any positive integer. So, $p₁₃₈$ is a member of
the alphabet. It's the 138th propositional variable. In practice,
however---especially in _logical_ practice---we often write $p$, $q$, $r$, …
for arbitrary fixed propositional variables. This makes our life much easier,
as we won't get confused by all the different subscripts. In AI practice,
instead, we often use descriptive names like $RAIN$ or $WIND$ for propositional
variables. This, instead, will make working with the propositional variables
easier, since we'll always know what they're supposed to _mean_.

The operators have the following conventional names and readings:

| **Operator**   | **Name**                                     | **Reading**        |
| -------------- | ----------                                   | -------------      |
| $¬$            | {{< term "negation" "Negation" >}}           | not …              |
| $∧$            | {{< term "conjunction" "Conjunction" >}}     | … and …            |
| $∨$            | {{< term "disjunction" "Disjunction" >}}     | … or …             |
| $→$            | {{< term "conditional" "Conditional" >}}     | if …, then …       |
| $↔$            | {{< term "biconditional" "Biconditional" >}} | … if and only if … |


{{< callout type="note" title="Modelling assumption: simplifying linguistic structure" >}}
As in [Chapter 1](../logic-and-ai/#logical-systems), our model involves
**abstraction**. We use one standard symbol and reading for each connective,
setting aside differences between ordinary uses of “and”, “or”, “if”, and so
on. We also treat the claims represented by atoms as units, ignoring their
internal structure. We assume these omitted distinctions do not matter for
the inference at hand; otherwise, we need a richer model.
{{< /callout >}}

The Kleene star of the alphabet, $Σ*$, provides us with all the sequences that we
can build using these symbols. $Σ*$ contains well-formed expressions like:

$$
((p₁ ∧ p₃) → ¬p₂)
$$

but also lots of expressions that are not well-formed for propositional logic,
like:

$$
)p₁¬∧((→
$$

To distinguish the well-formed expressions from the non-well-formed ones, the
_formulas_ from the non-formulas, we give an inductive definition of the
language. We call the set of formulas $L$:

{{< callout type="definition" title="The language of propositional logic" >}}
The set $L$ is defined by saying that:

+ $pᵢ ∈ L$ for each positive integer $i$, and

+ if $A ∈ L$, then $¬A ∈ L$, as well as

+ if $A, B ∈ L$, then $(A ∧ B), (A ∨ B), (A → B), (A ↔ B) ∈ L$.

{{< /callout >}}

As before, crucially, we assume in addition that nothing else is in $L$, but
from now on, we will leave this "closure condition" implicit. The members of
$L$ are exactly the strings obtained by finitely many applications of these
clauses.

We can now easily see that $((p₁ ∧ p₃) → ¬p₂)$ is a
member of $L$. To see this, we simply perform the construction:

1. We know that $p₁$ and $p₃$ are formulas (by the first clause of the inductive definition).
2. So, we know that $(p₁ ∧ p₃)$ is a formula (by the third clause and 1.).
3. We know that $p₂$ is a formula (by the first clause).
4. So, we know that $¬p₂$ is a formula (by the second clause and 3.).
5. So, we know that $((p₁ ∧ p₃) → ¬p₂)$ is a formula (by the third clause and 2. and 4.).

But we can also see that $)p₁¬∧((→$ is _not_ a formula, since no rule ever
allows for $→$ to occur in a formula without being followed by a formula—but at
the end of this expression, this is precisely what happens.

To get a _feel_ for how this works, try it yourself in the following
interactive app. Add the propositional variables you need by typing them into
the input field (using LaTeX notation) and clicking "Add". To construct a
complex formula from simpler ones, first select the existing formulas by
clicking them (in the right order) and then select the corresponding operator
button. Give it a try!

{{< logic-app name="builder" target="((p₁ ∧ p₃) → ¬p₂)" title="Build a formula" >}}

The app only does the given example, but in the exercises you'll build some
more formulas.

When we're talking about formulas, we typically use the letters $A$, $B$, $C$,
… to stand for arbitrary *formulas*, which may themselves contain several
operators and variables. These are so-called **{{< term "metavariable"
"metavariables" >}}** for formulas. They belong to the language we use to talk
*about* formulas, not to the alphabet of propositional logic. So, for example,
$(A ∧ B)$ is not itself a formula, but by replacing $A$ with $(p → q)$ and $B$
with $¬r$, we get $((p → q) ∧ ¬r)$, which _is_ a formula, a formula of the
_form_ $(A ∧ B)$.

While the inductive definition we've given above is the conceptual foundation
of the grammar of propositional logic, there are different ways of writing down
the grammar, which are useful in different contexts. A widespread notation
that significantly simplifies the above rules is the so-called
**{{< term "bnf" "Backus–Naur Form (BNF)" >}}**.
In BNF, instead of all of the above, we can simply write the following to
define the same language $L$:

$$
A ::= pᵢ | ¬A | (A ∧ A) | (A ∨ A) | (A → A) | (A ↔ A)
$$

Here, we read the $|$ as an "or". And so this reads: a formula is either a
propositional variable, or the negation of a formula, or the conjunction of two
formulas, or ....

Another perspective is given by
_{{< term "rewrite-rule" "rewrite rules" >}}_: we generate a formula by
replacing symbols step by step. For example, the BNF allows us to replace $A$
with $¬A$, then the remaining $A$ with a propositional variable, say $p$:

$$
A ⟹ ¬A ⟹ ¬p
$$

Here, $⟹$ means "may be replaced by". We start with the placeholder $A$ and
finish with a formula containing only symbols of our language. Each
alternative in the BNF gives a rewrite rule:

$$
(Rule 1)  A ⟹ pᵢ
(Rule 2)  A ⟹ ¬A
(Rule 3)  A ⟹ (A ∧ A)
(Rule 4)  A ⟹ (A ∨ A)
(Rule 5)  A ⟹ (A → A)
(Rule 6)  A ⟹ (A ↔ A)
$$

At each step, we replace one occurrence of $A$. Different occurrences can be
replaced differently. So, $(A ∧ A)$ can become $(p ∧ q)$. In rule 1, $i$ can be
any positive integer. Our formulas are exactly the strings generated from
$A$ by finitely many replacements, with no $A$ left over.

We can generate $((p ∧ q) → ¬r)$ using these rules as follows:

$$
(1)  A
(2)  (A → A)	by rule 5
(3)  ((A ∧ A) → A)	by rule 3
(4)  ((p ∧ A) → A)	by rule 1†
(5)  ((p ∧ q) → A)	by rule 1†
(6)  ((p ∧ q) → ¬A)	by rule 2
(7)  ((p ∧ q) → ¬r)	by rule 1†
$$

_$†$: Remember that $p, q, r$ stand for some arbitrary propositional variables._

[BNFs](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) and rewrite
rules give us alternative ways to present grammars. BNF is common in computer
science, especially for specifying programming languages. Rewrite rules are
used in [generative grammars](https://en.wikipedia.org/wiki/Generative_grammar).
Both have their place in logic, and you'll encounter them in different
contexts throughout your studies. Here are some examples of grammars to
check out:

+ Pick your favorite programming language (if you have one):
[Python](https://docs.Python.org/3/reference/grammar.html) we mentioned above,
[C](https://cs.wmich.edu/~gupta/teaching/cs4850/sumII06/The%20syntax%20of%20C%20in%20Backus-Naur%20form.htm)
is a popular low-level language,
[Prolog](http://tau-prolog.org/files/doc/grammar-specification.pdf) is a
logic-based language.

+ The [RFC](https://datatracker.ietf.org/doc/html/rfc5322) for emails uses
Augmented BNF (ABNF) to specify the syntax of email addresses. Check it out 🤓

## Parsing

{{< img src="/img/drawings/fl_ai_confused.svg" class="rounded  float-start inert-img img-fluid m-2" width="200px" >}}
We've seen how to build formulas from propositional variables using the
clauses of an inductive definition. Now suppose we're given a string of
symbols: how can we work out whether it's a formula, and how its parts fit
together? This is the task of {{< term "parsing" "parsing" >}}. We start with
the expression and try to reconstruct its grammatical structure.

<div class="clearfix"></div>

{{< callout type="definition" title="Parsing" >}}
{{< term "parsing" "Parsing" >}} is the reconstruction of the grammatical
structure of a string: figuring out how it was built according to the grammar of
its language.
{{< /callout >}}

Parsing tells us how the parts of an expression fit together. It doesn't yet
tell us what they _mean_, but it gives us the structure we need to assign
meaning to the whole expression. We'll return to this when we study
{{< term "semantics" "semantics" >}}.

To see how this works, let's go through the procedure step by step with our
formula $((p ∧ q) → ¬r)$ as a concrete example:

1. First, write down the whole expression, $((p ∧ q) → ¬r)$.
2. Then, we ask which inductive construction could have produced the formula.
   Here, the expression has the form $(A → B)$, so it must have been formed by
   joining two formulas with a conditional. We write $→$ in place of the
   expression, and draw two lines down to its parts $A$ and $B$, $(p ∧ q)$ on the
   left and $¬r$ on the right. These are the expressions still to work out.
3. We begin by working on the left part, $(p ∧ q)$. It must have been built by joining two
   formulas with a conjunction. So, we replace it with $∧$ and draw two lines down
   to $p$ and $q$. Each is a propositional variable, so the base case applies
   and there's nothing further to unpack there.
4. Then, we return to the right part, $¬r$. It must have been built by negating a
   formula. Replace it with $¬$ and draw one line down to $r$. This is
   another propositional variable, so we're done.

At each step, we're unwinding the inductive construction: we identify the
construction that could have produced the expression and work backwards to
its smaller parts. If every part eventually leads to propositional variables,
we've reached the base case throughout and successfully parsed the formula.

If a part is neither a variable nor an expression that fits a construction
rule, parsing fails. For our grammar, this tells us that the original string
isn't a formula. So parsing always gives us a yes-no answer to whether a string
belongs to our language or not.

To understand how the procedure works, you can play through it in the app below.
It keeps track of the parts still to be worked out with a $?$ and fills in
their operators or variables as you go. Some steps return to a part after
finishing the parts below it. Switch to full-formula labels to follow which
expression each position stands for. Go forward and backward and make sure you
understand every step along the way.

{{< logic-app name="parser" formula="((p ∧ q) → ¬r)" >}}

Once you've worked through $((p ∧ q) → ¬r)$, use the edit button to try an
expression of your own. Try some non-formulas, too, and see where parsing fails.

When parsing succeeds, the result is an _abstract syntax tree_, a data
structure used to represent expressions in logic, AI, and programming:

{{< callout type="definition" title="Abstract syntax tree" >}}
An {{< term "abstract-syntax-tree" "abstract syntax tree (AST)" >}} is a
tree-like diagram representing the inductive structure of an expression
according to its grammar.
{{< /callout >}}

An AST is an example of a more general mathematical structure that
we'll encounter in various places throughout the book: a
**{{< term "rooted-tree" "rooted tree" >}}**. It consists of points called
_nodes_, joined by _edges_, with a distinguished node called the _root_ and
exactly one path from the root to every other node. We draw the root at the
top, so our trees grow downwards!

The labels needn't be logical symbols. This tree uses animals instead.
Explore the definitions alongside it to get familiar with the terminology.

{{< tree-guide >}}

Take our AST for $((p ∧ q) → ¬r)$, for example:

{{< syntax-tree caption="" >}}
{"label":"→","children":[{"label":"∧","children":[{"label":"p"}, {"label":"q"}]},{"label":"¬", "children":[{"label":"r"}]}]}
{{< /syntax-tree >}}

Here, "$→$" labels the root; its children are labelled "$∧$" and "$¬$". The
leaves are labelled "$p$", "$q$", and "$r$". The order matters: the left part
of a conditional is its if-part, and the right part is its then-part. The tree
is called _abstract_ because it leaves out details such as brackets: the
connections already record which parts belong together.

### Algorithms and pseudocode {#algorithms-and-pseudocode}

{{< img src="/img/drawings/gimmick_mouse.svg" width="70px" class="float-end ms-3" >}}

The parsing procedure is our first example of an algorithm. We've seen what
it does; now let's make its instructions precise.

{{< callout type="definition" title="Algorithm" >}}
An {{< term "algorithm" "algorithm" >}} is a precise, step-by-step procedure
that takes an _input_ and produces an _output_ in finitely many steps.
{{< /callout >}}

The input is what we give the procedure to work on; the output is its result.
For our parser, the input is a string of symbols. The output is its AST, or a
report that the string isn't a formula.

We'll write the instructions in what's known as
_{{< term "pseudocode" "pseudocode" >}}_:
a mixture of ordinary language and programming notation,
which precisely describes an algorithm in a human-readable way without assuming
familiarity with the details of any specific programming language. Ours will
look like Python, but you don't need to know Python to read it. Let's introduce
only what we need:

- `def parse(expression):` names the procedure `parse` and calls its input
  `expression`.
- `if` introduces a condition. The indented lines below it say what to do
  when that condition holds. Otherwise, we move on to the next case.
- `=` gives a name to a result. For example, `child = parse(smaller)` means:
  parse the smaller expression, then call the resulting tree `child`.
- `return` gives back the output and finishes the current use of the procedure.

Names followed by parentheses refer to operations. For example,
`is_variable(expression)` checks whether the whole expression is a
propositional variable. Assume we've already implemented these helper
operations; their names describe their jobs. This lets us concentrate on how
the parsing steps fit together:

```python
def parse(expression):
    if is_variable(expression):
        return single_node(expression)

    if begins_with_negation(expression):
        smaller = remove_initial_negation(expression)
        child = parse(smaller)
        return negation_tree(child)

    if has_binary_form(expression):
        left = left_part(expression)
        right = right_part(expression)
        operator = main_operator(expression)
        left_tree = parse(left)
        right_tree = parse(right)
        return binary_tree(operator, left_tree, right_tree)

    fail("Not a formula")
```

The tree-building operations do just what we did by hand: `single_node`
creates a leaf labelled with the variable; `negation_tree` puts a root labelled
$¬$ above its child; `binary_tree` puts the given operator above the two
children, in left-to-right order. If any step fails, `fail` stops the whole
parse and reports that the original string isn't a formula. This includes
failure while parsing a smaller part.

One helper needs a closer look: `has_binary_form(expression)`. It checks that
all brackets match, that an outer pair encloses the whole expression, and
that there is exactly one binary operator outside any further brackets, with
a nonempty part on each side. For example,
in $(p ∧ (q ∨ r))$, this operator is $∧$: $∨$ is inside another pair of
brackets. The helpers `left_part`, `right_part`, and `main_operator` pick out
$p$, $(q ∨ r)$, and $∧$, respectively. The check doesn't yet tell us whether
the two parts are formulas—that's what parsing them will determine.

We read the input as symbols, ignoring spaces; $p₁$, for example, is one
variable symbol. An empty string fits none of the three cases and fails.
This is pseudocode: the helper operations have been described, but we'd still
need to implement them to run it as a Python program.

Notice that `parse` uses _itself_ to deal with smaller expressions. This is
**{{< term "recursion" "recursion" >}}**. For example, when parsing $¬p$:

1. We remove the initial $¬$ and ask the same procedure to parse $p$.
2. That smaller task reaches the variable case and gives back a single node
   labelled $p$.
3. We resume the original task, put a $¬$ node above it, and give back the
   completed tree for $¬p$.

This follows our inductive definition in reverse. The definition starts with
variables and builds larger formulas from smaller ones. Parsing starts with
the expression and works back to those smaller parts. The _base case_ of the
definition tells us when to stop: a variable needs no further parsing. Each
_inductive construction_ tells us which smaller parts to parse. As their
results come back, we join their trees together. These are the steps down and
back up that you saw in the app.

Will this always finish? Each time `parse` uses itself, its input is shorter.
Eventually we must reach a variable or a string that fails the checks. This
is our argument for **{{< term "termination" "termination" >}}**.

And why is the answer right? A variable gives a valid leaf. Each larger tree
is built only after its parts have been successfully parsed, using a
construction allowed by the grammar. Conversely, every construction in the
grammar has a corresponding case in the procedure. This explains the
algorithm's **{{< term "algorithm-correctness" "correctness" >}}**: it
produces the AST of every formula and rejects every non-formula. We'll return
to termination and correctness when we meet other algorithms.

### Unique readability

Remember the ambiguity of "red spots and gills"? Our grammar should let us
read each expression in exactly one way. A grammar has
**{{< term "unique-readability" "unique readability" >}}** if every expression
it generates has exactly one grammatical structure.
A grammar is _{{< term "ambiguous-grammar" "ambiguous" >}}_ if it generates an
expression with more than one grammatical structure.

{{< callout type="theorem" title="Unique readability" >}}
Our fully bracketed grammar for propositional logic has unique readability:
every formula it generates has exactly one abstract syntax tree.
{{< /callout >}}

Different orders of applying rewrite rules can still produce the same tree.
For example, we can expand the left part of a conjunction before the right,
or the right before the left. Unique readability concerns the resulting
structure. We won't prove the theorem here, but we can see how the choice of
grammar affects it by leaving out the brackets around conjunctions:

$$
A ::= pᵢ | ¬A | A ∧ A
$$

This grammar generates $¬p ∧ q$ with two different structures: we can form
a conjunction whose left part is $¬p$, or negate the conjunction $p ∧ q$.
The two readings give these trees:

<div class="ast-comparison">

{{< syntax-tree caption="Reading 1: (¬p ∧ q)" >}}
{"label":"∧","children":[{"label":"¬","children":[{"label":"p"}]},{"label":"q"}]}
{{< /syntax-tree >}}

{{< syntax-tree caption="Reading 2: ¬(p ∧ q)" >}}
{"label":"¬","children":[{"label":"∧","children":[{"label":"p"},{"label":"q"}]}]}
{{< /syntax-tree >}}

</div>

Imagine an AI system controlling a railway crossing. Let $p$ mean that cars
have a green light and $q$ that trains have a green light. We want a safety
rule saying that they cannot both have a green light at once.

Reading 2 expresses that rule. But with the unbracketed grammar, writing
$¬p ∧ q$ also allows reading 1, which demands that trains have a green light
and cars do not. That is a stronger requirement: it rules out letting cars
through even when trains are stopped. Ambiguity might just have created a
huge traffic jam!

The unbracketed grammar is therefore ambiguous. In our fully bracketed
grammar, the two readings are written $(¬p ∧ q)$ and $¬(p ∧ q)$. The brackets
let us specify which structure we intend.

{{< callout type="note" title="Modelling assumption: a fixed reading" >}}
Our grammar removes structural ambiguity. Using it to model a claim assumes
that we have chosen one intended reading and will keep it fixed. This is an
**idealization** that gives formal checking a definite interpretation to work
with. The brackets record our choice; they do not establish that it captures
what the speaker meant.
{{< /callout >}}

### Conventional notation

Brackets let us specify how the parts of a formula fit together, but writing
all of them gets tedious fast. Just look at $(((p ∧ q) ∧ r) ∧ s)$!
We'd much rather write $p ∧ q ∧ r ∧ s$. To do this, we need conventions
that tell us how to put the omitted brackets back. Otherwise, we're back to
the ambiguity of $¬p ∧ q$.

We'll use the following conventions:

- We may omit the outermost pair of brackets: $(p ∧ q)$ becomes $p ∧ q$.
- Operators have a **{{< term "operator-precedence" "priority" >}}**:
  from highest to lowest, $¬$, $∧$, $∨$, $→$, $↔$. An operator with higher
  priority binds more tightly to the expressions around it. For example,
  $p ∨ q ∧ r$ abbreviates $(p ∨ (q ∧ r))$, since $∧$ has higher priority
  than $∨$.
- Repeated $∧$ and repeated $∨$ group to the left: $p ∧ q ∧ r$ abbreviates
  $((p ∧ q) ∧ r)$. Repeated $→$ groups to the right: $p → q → r$
  abbreviates $(p → (q → r))$.
- For repeated $↔$, we specify the grouping with brackets. We also keep
  brackets whenever we want to override the conventions above.

Take our ambiguous formula $¬p ∧ q$ from before. In our conventional notation,
it unambiguously abbreviates $(¬p ∧ q)$, since $¬$ has the highest priority. To
negate the whole conjunction, we must write $¬(p ∧ q)$. Similarly, $(p ∨ q) ∧
r$ needs its inner brackets to group the disjunction together before forming
the conjunction.

Here are some more examples to illustrate the idea:

| Fully bracketed notation | Conventional notation |
| ---                      | ---                   |
| $(((p ∧ q) ∧ r) ∧ s)$    | $p ∧ q ∧ r ∧ s$       |
| $(p ∧ (q ∧ r))$          | $p ∧ (q ∧ r)$         |
| $((p ∨ q) ∧ r)$          | $(p ∨ q) ∧ r$         |
| $((p → q) → r)$          | $(p → q) → r$         |
| $((p ↔ q) ↔ r)$          | $(p ↔ q) ↔ r$         |

These are conventions for abbreviating formulas of our original grammar.
Other books and programming languages may use different priorities or
grouping rules, so it's worth checking which conventions they follow.

Our parsing algorithm follows the original grammar, so it won't accept every
expression written in conventional notation. Try $p ∧ q$ in the app: which
check fails? We can also give conventional notation its own grammar, encoding
the priorities and grouping rules, and adapt our parser to accept it. You'll
explore both tasks in the exercises.

## Knowledge representation

When we interact with a language model, ambiguity in our instructions can
affect how it responds. Applications that require precision can use formal
representations and explicit checks to constrain or verify a model's output.
We still need to choose the right interpretation of the instructions and
check that our formalization captures it.

We've already seen how programming languages let us specify instructions for
a computer. Formal languages also let us represent information that a system
can reason with. Let's look more closely at that use.

In {{< chapter_ref chapter="logic-and-ai" >}} Chapter 1. Logic and AI{{<
/chapter_ref >}}, we introduced so-called _expert systems_. These are systems
where vast bodies of 'expertise' in a certain domain have been translated
into databases of formalised statements and (if-then) rules, in order to solve
complex problems concerning the domain in question. In such systems, there are
so many rules and facts that it is impossible for the human expert to keep track
of everything.

Designing expert systems involves translating existing expert knowledge into a
formal language that the AI expert system can work with. The process of
translating such information is called formalization.

{{< callout type="definition" title="Formalization" >}}
{{< term "formalization" "Formalization" >}} is the process of representing information from natural language in a formal language.
{{< /callout >}}

This is a large part of the broader field known as
**{{< term "knowledge-representation-and-reasoning" "knowledge representation" >}}**.

The idea is that we can represent basic facts about the world using logical
formulas of a suitable language and rules as if-then statements between such
statements. To illustrate, let's consider a toy example. Suppose that our friend
`∀I` is looking for an important letter, which should be somewhere
around this desk with two drawers:

{{< img src="/img/drawings/fl_ai_drawers.svg" class="rounded  float-start inert-img img-fluid m-2" width="350px">}}

Suppose we have some information that we want to pass on to `∀I`, who
understands the language of propositional logic. Here are a few claims in
natural language that we might want to convey, both in natural language and in
the formal language of propositional logic, where we stipulate that $LEFT$ is a
propositional variable, which states that the letter is in the left drawer, and
$RIGHT$ is a propositional variable, which states that the letter is in the
right drawer:

| Natural language                                                        | Formula representation               |
| ------------                                                            | ---------                            |
| The letter isn't in the left drawer                                     | $¬LEFT$                              |
| It's not the case that the letter is in the right drawer                | $¬RIGHT$                             |
| The letter is not in the left drawer, but also not in the right one     | $(¬LEFT ∧ ¬RIGHT)$                   |
| The letter is in the left or the right drawer                           | $(LEFT ∨ RIGHT)$                     |
| The letter is in either the left or the right drawer, but not both      | $((LEFT ∨ RIGHT) ∧ ¬(LEFT ∧ RIGHT))$ |
| The letter is neither in the left nor the right drawer                  | $(¬LEFT ∧ ¬RIGHT)$                   |
|                                                                         | $¬(LEFT ∨ RIGHT)$                    |
| If the letter is in the left drawer, then it's not in the right drawer  | $(LEFT → ¬RIGHT)$                    |
| The letter is in the left drawer only if it's not in the right one      | $(LEFT → ¬RIGHT)$                    |
| The letter is in the left drawer just in case it's not in the right one | $(LEFT ↔ ¬RIGHT)$                    |

These examples can be a helpful guideline, but it's important to keep in mind
that formalization and knowledge representation are more of an **engineering
problem** than a mathematical problem: there is not always an absolutely right or
wrong answer (even though some cases are clearly right/wrong), it depends on the
purpose of the formalization, on the reasoning context, and other factors what
is a good or bad formalization.

Remember the ice-cream promise from before? If we want to represent just what
was promised, one conditional will do. If we also want to capture the child's
expectation about bad behaviour, we need to state that further condition.
Formalization makes these choices explicit.

Already the choice of language can be a difficult decision. We need to evaluate
a language's expressive power against the additional complexity that comes with
that. Sometimes, simple languages, like the language of propositional logic, are
the right choice, sometimes we need more complex languages.

Once we've formalized our claims in a suitable formal language, we collect our
formalized knowledge in what's known as a
**{{< term "knowledge-base" "knowledge base (KB)" >}}**. Generally
speaking, a KB is a way of storing formalized knowledge in such a way that any
agent—artificial or otherwise—can both **ask** the KB what is already known and
**tell** the KB new facts. From a logical perspective, we can
then think of a KB as simply a set of formulas of a suitable language.

An expert system can derive further consequences of its knowledge base using
modus ponens and other rules of valid inference. For a query, it may find a
derivation of the claim or of its negation; sometimes the stored information
settles neither. If it supports both, we have a consistency problem to
investigate. Searching for a derivation also needn't always terminate; that
depends on the language and inference procedure.

A derivation shows what follows from the KB. Whether the conclusion is true
of the world also depends on the assumptions and information we put into it,
just as we saw in chapter 1.

The concept of a KB is one of the fundamental concepts of the AI discipline
known as **Knowledge Representation and Reasoning**, and will accompany us
throughout the course.

Rule-based systems can be relatively cheap to build when the relevant rules
are already available. They can also show which facts and rules produced an answer. That's
a useful kind of explanation, though understanding a long trace may still take
work. And a trace won't tell us whether the rules themselves are appropriate.

With a learned system, explaining an answer may require different methods.
The text a generative model gives as its explanation needn't describe the
process that produced the answer. But we can still check an answer against
explicit rules or ask for a formal proof. This brings us back to the role of
verification from chapter 1: judge the proposed result using a specification
we can inspect.

## Further readings {.readings .nocount}

- Richard Zach, [*Sets, Logic, Computation*
(PDF)](https://slc.openlogicproject.org/slc-screen.pdf), chapter 1, for sets,
and chapter 6, especially §§6.2–6.4, for languages, formulas, and unique
readability.

**Notes:**

[^primes]: Prime numbers can be recognized and enumerated by algorithms, such
    as a sieve. The point is that a set description tells us which objects belong
    without requiring us to list an infinite collection explicitly.

[^mp]: The driving force behind this definition is actually an application of
modus ponens. One instance of step 2 in the definition is: If $1$ is a numeral,
then so is $12$. Now, since step 1 tells us that $1$ is indeed a numeral it
follows by modus ponens that $12$ is also a numeral.
