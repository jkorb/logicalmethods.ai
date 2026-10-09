---
title: FOL
author: Johannes Korbmacher
locked: false
weight: 80
params:
  last_edited: "08/10/2026"
  id: txt-fol
---

# First-order logic


{{< img src="/img/drawings/fol_ai_talking_fol.svg" class="float-end ms-3" width="110px" alt="Socrates." >}}
{{< term "first-order-logic" "First-order logic (FOL)" >}} is the logic of relations
and {{< term "quantification" "quantification" >}} over objects.
In natural language, [quantifiers](https://en.wikipedia.org/wiki/Quantifier_(linguistics))
such as "all", "some", and "most" tell us how many individuals satisfy a condition.
FOL gives precise meanings to "all" and "some". It is a standard
framework for expressing the claims of science and mathematics in a
{{< term "formal-language" "formal language" >}}. Its roots lie in the work of
[Gottlob Frege](https://en.wikipedia.org/wiki/Gottlob_Frege) and
[Charles Sanders Peirce](https://en.wikipedia.org/wiki/Charles_Sanders_Peirce)
on logic and the foundations of mathematics. Today, it is also a language for
{{< term "knowledge-representation-and-reasoning" "KRR" >}} in AI. Our question
in this chapter is how FOL lets us represent knowledge about objects and their
relationships.

{{< img src="/img/drawings/fol_socrates.svg" class="float-start m-3" width="50px" alt="Socrates." >}}
Much of FOL's usefulness comes from its _expressive power_. Consider our
inference about Socrates:

{{< inference >}}
All humans are mortal
Socrates is human
---
Socrates is mortal
{{< /inference >}}

In propositional logic, we could use $HUMAN$ for 'Socrates is human' and
$MORTAL$ for 'Socrates is mortal'. Then $HUMAN → MORTAL$ says that if Socrates
is human, he is mortal. But the first premise says something about *all*
humans, including people we haven't named. Giving the premise its own
propositional variable would leave its connection to Socrates obscure.

If we wanted to add a premise like 'Xanthippe is human', we couldn't reuse
$HUMAN$, as it already stands for a claim about Socrates. We'd need a _new_
variable, say $HUMAN₂$, to say that Xanthippe is human, another one, $MORTAL₂$,
for 'Xanthippe is mortal', and another conditional, $HUMAN₂ → MORTAL₂$, to say
that if Xanthippe is human, she's mortal. The similar names don't tell
propositional logic that these claims concern the same properties. Of course,
we could list a conditional for each person in a fixed finite domain, but we'd
have to extend the list whenever we added another person to our model.

FOL solves this problem by making the underlying structure explicit:
$Human(Socrates)$ and $Human(Xanthippe)$ apply the same < gloss > predicate --
$Human$ -- to different objects -- $Socrates$ and $Xanthippe$ . In this way, we
can represent the general claim once, as:

$$
∀x (Human(x) → Mortal(x))
$$

Here the so-called _universal quantifier_ $∀x$ says that the condition that
follows applies to _every_ object. So, $∀x (Human(x) → Mortal(x))$ means that
every object -- every*thing* -- is such that if it is human, then it is mortal.
In other words, all humans are mortal.

By combining the universal quantifier with the existential quantifier
$\exists$, we can express complex mathematical claims in FOL, such as the fact
that for every number there exists a larger one. As a formula, this becomes
$$∀x∃y (x < y)$$ Mathematical concepts such as the [continuity of
functions](https://en.wikipedia.org/wiki/Continuous_function) use this kind of
_nested quantification_, and representing mathematical claims and concepts like
this is precisely the work required to check mathematical reasoning with(in) AI.

Additionally, FOL has a deep connection to knowledge representation and the way
of storing knowledge in a computer:
{{< term "relational-database" "relational databases" >}}. We will develop the
language first, then models that represent objects and their properties and
relations. Sets, tables, and knowledge graphs display this information;
formulas express conditions we can check against it. Database queries bring the
two together: [Codd's theorem](https://en.wikipedia.org/wiki/Codd%27s_theorem)
connects conditions written as formulas to operations on stored tables. This
chapter develops these ways of representing and querying knowledge. {{<
chapter_ref chapter="FOL-inference" >}}FOL Inference{{< /chapter_ref >}} takes
up reasoning: what follows from a knowledge base, and how we can prove it.

{{< callout type="objectives" >}}
After studying this chapter, you will be able to:

- Parse first-order terms and formulas, including quantifier scopes and free variables.
- Represent general claims and dependencies using quantified formulas.
- Construct first-order models using sets, tables, and knowledge graphs.
- Determine the truth of sentences and the extensions of open formulas in a finite model.
- Compare finite and infinite models as representations of knowledge.
- Use the correspondence between FOL and SQL to query a relational database.
{{< /callout >}}

## Syntax

To represent claims about objects, we need expressions for the objects and
for their properties and relations. Recall from
{{< chapter_ref chapter="formal-languages" >}}Formal Languages{{< /chapter_ref >}}
that we define a formal language by giving an alphabet and a grammar. In FOL,
the grammar distinguishes two kinds of expression: *terms* name objects, while
*formulas* make claims about them. We keep the propositional connectives and
add quantifiers to express claims about every object or at least one object.

### Alphabet

In $Human(Socrates)$, the {{< term "constant" "constant" >}} $Socrates$ names
an object and the {{< term "predicate" "predicate" >}} $Human$ expresses a
property. In $BiggerThan(MrSir, LittleJimmy)$, the predicate expresses a
relation between two objects. The order of the arguments is important here:
the formula says that Mr Sir is bigger than Little Jimmy, not that Little
Jimmy is bigger than Mr Sir.

A {{< term "function-symbol" "function symbol" >}} builds another expression
for an object. For example, $fatherOf(Socrates)$ names Socrates' father. The
term $distanceBetween(x, y)$, instead, names the distance between two objects
$x$ and $y$. The {{< term "arity" "arity" >}} of a function or predicate symbol
is the number of its argument places. The function symbols $fatherOf$ and
$Human$ are _unary_, while $distanceBetween$ and $BiggerThan$ are _binary_. We
sometimes indicate arity with a superscript, as in $Human¹$ or $BiggerThan²$.

A variable such as $x$ stands for _some_ object without specifying which one it is.
The {{< term "universal-quantifier" "universal quantifier" >}} $∀$ says that a
condition holds for every object. The
{{< term "existential-quantifier" "existential quantifier" >}} $∃$ says that a condition
holds for at least one object. So, for example,

$$
∀x ∃y BiggerThan(y, x)
$$

says that for every object there is (at least) a bigger one. Nested quantifiers
let us express dependencies of this kind: the choice of $y$ can depend on $x$.

Here are the kinds of symbols in our alphabet. The dots indicate that a
language can have more symbols of the indicated kind:

{{< annotated-math prefix="Σ = {" suffix="}" wrap=true title="A first-order alphabet" >}}
[
  {
    "symbols": "x, y, z, …",
    "label": "variables",
    "position": "below",
    "color": "blue"
  },
  {
    "symbols": "a, b, c, …",
    "label": "constants",
    "position": "above",
    "color": "red"
  },
  {
    "symbols": "f¹, g², …",
    "label": "functions",
    "position": "below",
    "color": "green"
  },
  {
    "symbols": "P¹, R², …",
    "label": "predicates",
    "position": "above",
    "color": "violet"
  },
  {
    "symbols": "¬, ∧, ∨, →, ↔",
    "label": "connectives",
    "position": "below",
    "color": "orange"
  },
  {
    "symbols": "∀, ∃",
    "label": "quantifiers",
    "position": "above",
    "color": "teal"
  },
  {
    "symbols": "=",
    "label": "identity",
    "position": "below",
    "color": "olive"
  },
  {
    "symbols": "(, ), ,",
    "label": "punctuation",
    "position": "above",
    "color": "pink"
  }
]
{{< /annotated-math >}}

The superscripts record arities; they needn't be typed in formulas. Names such
as $Human$ and $fatherOf$ make a language easier to read, but their spelling
will not force a particular interpretation.

{{< callout type="definition" title="First-order signature" >}}
A {{< term "signature" "first-order signature" >}} specifies the constant,
function, and predicate symbols of a language, with a fixed arity for each
function and predicate symbol.
{{< /callout >}}

Our language also has variables, the logical symbols listed above, and identity.
Different knowledge representation tasks can use different signatures. A
language for family relationships might include $ParentOf$; one for geography
might include $CapitalOf$. We fix the signature before interpreting its symbols.

### Terms and formulas

To define the grammar, we first need expressions for objects.

{{< callout type="definition" title="Term" >}}
A {{< term "term" "term" >}} of a first-order language is a variable, a constant,
or an expression $f(t₁, …, tₙ)$, where $f$ is an $n$-ary function symbol and each
$tᵢ$ is a term.
{{< /callout >}}

In BNF, with $a$ ranging over constants and $x$ over variables:

$$
t ::= a ∣ x ∣ f(t₁, …, tₙ)
$$

The last rule is recursive: function arguments can themselves contain function
applications. For example,

$$
distanceBetween(birthplaceOf(Socrates), capitalOf(x))
$$

is a term. It names the distance between Socrates' birthplace and the capital
of whatever object $x$ stands for. We can omit the application brackets and
commas if the arities are fixed and the symbol boundaries remain clear:

$$
distanceBetween birthplaceOf Socrates capitalOf x
$$

As in the propositional parser from
{{< chapter_ref chapter="formal-languages" >}}Formal Languages{{< /chapter_ref >}}, the grammar determines
the children of each node. At the root,
$distanceBetween$ requires two term children. The left child begins with the
unary function $birthplaceOf$ and ends at the constant $Socrates$. The right
child begins with $capitalOf$ and ends at the variable $x$. Each application of a grammar rule fixes the next children.

{{< logic-app name="parser" language="fol" kind="term" formula="distanceBetween(birthplaceOf(Socrates), capitalOf(x))" title="Parsing a first-order term" >}}

Replacing $x$ by $Greece$ removes the last variable from our term.
The model can then determine its denotation without any further values supplied.
We give such terms a name:

{{< callout type="definition" title="Ground term" >}}
A {{< term "ground-term" "ground term" >}} is a term containing no variables.
{{< /callout >}}

Terms fill the argument places in formulas. With $t₁, …, tₙ$ ranging over terms,
our formula grammar is:

$$
A ::= P(t₁, …, tₙ) ∣ t₁ = t₂ ∣ ¬A ∣ (A ∧ A) ∣ (A ∨ A) ∣ (A → A) ∣ (A ↔ A) ∣ ∀x A ∣ ∃x A
$$

{{< callout type="definition" title="Atomic formula" >}}
An {{< term "fol-atomic-formula" "atomic formula" >}} of a first-order language
is $P(t₁, …, tₙ)$, where $P$ is an $n$-ary predicate and its arguments are terms,
or an identity $t₁ = t₂$ between terms.
{{< /callout >}}

$Human(Socrates)$ and $motherOf(x) = y$ are atomic formulas.
We abbreviate $¬(t₁ = t₂)$ by $t₁ ≠ t₂$.
$fatherOf(Socrates)$ is a term, so it cannot occupy a formula's place after a
connective. Likewise, $Human(Socrates)$ cannot be an argument of $fatherOf$:
we need an object-denoting term there, not a claim.

Consider our example of a human mother:

$$
∀x (Human(x) → ∃y (Human(y) ∧ motherOf(x) = y))
$$

The root is $∀x$, with one formula child, its scope. That child's main
connective is $→$. Predicates and identity lead from the formula part of the
tree into its term parts. This is why the parser must keep track of whether
it expects a formula or a term.

{{< logic-app name="parser" language="fol" formula="∀x (Human(x) → ∃y (Human(y) ∧ motherOf(x) = y))" title="Parsing a first-order formula" >}}

Try removing an argument of $motherOf$ or adding a second one. The parser
rejects both strings because the signature fixes its arity at one. As in Formal
Languages, the fully bracketed grammar gives each binary connective its own
brackets. Parentheses around function and predicate arguments serve a different
purpose: they delimit a list of terms.

The language already gives us a way to represent knowledge: collect formulas
into a knowledge base, as we did with propositional logic. For example,
${Human(Socrates), ∀x (Human(x) → Mortal(x))}$ records a fact and a general
condition. The language can also express contradictory information, such as
$Human(Socrates)$ together with $¬Human(Socrates)$.

Before we can say when these formulas are true, we need to distinguish claims
about particular objects from conditions whose variables still need values.

## Scope and open formulas {#scope-binding-and-substitution}

$Human(x)$ expresses a condition on an object, but it does not say which object
$x$ stands for. In $∃x Human(x)$, the quantifier binds that occurrence of $x$.
We need to identify such bindings before we can evaluate a formula.

{{< callout type="definition" title="Scope and binding" >}}
The {{< term "quantifier-scope" "scope" >}} of a quantifier is its formula child
in the syntax tree. A {{< term "bound-variable" "bound occurrence" >}} of a
variable belongs to the nearest enclosing quantifier for that variable. A
{{< term "free-variable" "free occurrence" >}} has no such enclosing quantifier.
{{< /callout >}}

In our formula about human mothers, the two scopes are:

{{< logic-app name="fol-scope" formula="∀x (Human(x) → ∃y (Human(y) ∧ motherOf(x) = y))" title="Quantifiers and their bound occurrences" >}}

The arrows connect each quantifier with its bound occurrences. The scope of
$∀x$ is the whole conditional; the scope of $∃y$ is its right-hand conjunction.

The $x$ inside $motherOf(x)$ belongs to $∀x$, even though it also lies inside
the scope of $∃y$. Binding requires the *same* variable.

Reusing a variable can hide a different binding. In

{{< logic-app name="fol-scope" formula="∃x (Human(x) ∧ ∀x (Human(x) → Mortal(x)))" title="Nested binding" >}}

the first occurrence in $Human(x)$ belongs to $∃x$. The occurrences in the
inner conditional belong to $∀x$. Renaming the inner bound variable makes the
structure easier to see without changing what the formula says:

$$
∃x (Human(x) ∧ ∀y (Human(y) → Mortal(y)))
$$

{{< callout type="definition" title="Open formula and sentence" >}}
An {{< term "open-formula" "open formula" >}} has at least one free variable
occurrence. A {{< term "sentence" "sentence" >}}, or closed formula, has none.
{{< /callout >}}

An open formula acts as a complex predicate. $Human(x)$ expresses a property
of one object; $(Human(x) ∧ ¬Mortal(x))$ expresses the more specific property
of being human and immortal. $(BiggerThan(x, y) ∧ Human(x))$ expresses a
relation between two objects. The free variables mark the places whose
values are still needed. Quantifying a variable closes that place.

A variable can have free and bound occurrences in the same formula. For example,
$(Human(x) ∧ ∀x Mortal(x))$ is open because its first occurrence of $x$ is free.

{{< logic-app name="fol-scope" formula="(Human(x) ∧ ∀x Mortal(x))" title="Free and bound occurrences together" >}}

A quantifier cannot bind occurrences outside its scope. In the following
formula, the two quantifiers use the same variable name, but each binds only
the occurrence in its own conjunct:

{{< logic-app name="fol-scope" formula="(∀x Human(x) ∧ ∃x Mortal(x))" title="Separate scopes with the same variable" >}}

A quantifier can also be {{< term "vacuous-quantifier" "vacuous" >}}: its scope contains no free occurrence of
the variable it quantifies. In $∀x Human(y)$, there is no $x$ to bind, and
$y$ remains free. With our nonempty-domain convention, adding this quantifier
does not change the condition on $y$.

{{< logic-app name="fol-scope" formula="∀x Human(y)" title="Vacuous quantification" >}}


### Substitution

We can fill a free variable's place with a term. This lets us turn a condition
such as $Human(x)$ into the claim $Human(Socrates)$, or into another open
formula such as $Human(fatherOf(y))$.

{{< callout type="definition" title="Substitution" >}}
The {{< term "substitution" "substitution" >}} $A[x/t]$ replaces the free
occurrences of $x$ in $A$ by the term $t$, renaming bound variables when necessary
to prevent any variable in $t$ from becoming bound.
{{< /callout >}}

For instance,

$$
(Human(x) ∧ ∀x Mortal(x))[x/Socrates]
= (Human(Socrates) ∧ ∀x Mortal(x))
$$

The bound occurrences stay unchanged. There is a second precaution, needed for
{{< chapter_ref chapter="FOL-inference" >}}FOL Inference{{< /chapter_ref >}}: replacing $x$ by $y$ in $∃y BiggerThan(x, y)$ must not produce
$∃y BiggerThan(y, y)$. That would capture the newly inserted $y$. Rename the
bound variable to a fresh $z$ first:

$$
(∃y BiggerThan(x, y))[x/y] = ∃z BiggerThan(y, z)
$$

The resulting formula still has a free $y$. Binding and substitution are facts
about the syntax tree; they do not depend on a model.

### Iterated quantifiers {#iterated-quantifiers}

Some claims relate a choice for one variable to a choice for another.
We express these dependencies with {{< term "iterated-quantifiers" "iterated quantifiers" >}},
where one quantifier occurs within another's scope. Suppose we're talking about the natural
numbers $ℕ = {0, 1, 2, …}$. We use a binary predicate $LessThan$ for the usual
strict ordering and write
$x < y$ as shorthand for $LessThan(x, y)$. Then

$$
∀x ∃y (x < y)
$$

says that every number has a larger number. To check what it requires, take
any value $n$ for $x$. The inner existential asks for a value of $y$ larger
than $n$. We can always use $n + 1$: for $x$ assigned $0$, use $1$; for $x$
assigned $1$, use $2$; and so on. The witness for $y$ can depend on the value
of $x$.

Reversing the quantifiers changes that dependency:

$$
∃y ∀x (x < y)
$$

This says that there is a number larger than every number. Now we must choose
one value for $y$ that works for every value of $x$. No natural number does:
if we choose $n$ for $y$, assigning $n$ to $x$ already makes $x < y$ false.
For the natural numbers, the first sentence is true and the second is false.

Two universal quantifiers, as in $∀x ∀y A(x, y)$, require every pair of values
to work. Two existential quantifiers require at least one pair. Exchanging
quantifiers of the same kind preserves these conditions. With mixed
quantifiers, the order determines which choices may depend on which others.

No finite, nonempty set of numbers with its usual ordering makes
$∀x ∃y (x < y)$ true: its largest member has no larger member in the domain.
The choice of objects therefore affects which claims are true. We will return
to this example when we compare finite and infinite models.

Open formulas express properties and relations; sentences make claims with
no free places left to fill. Either way, writing a formula does not guarantee
that it describes a possible scenario. A knowledge base can describe one
scenario, many of them, or none. Models will give us a precise representation
of these scenarios.

## Models

In {{< chapter_ref chapter="valid-inference" >}}Valid inference{{< /chapter_ref >}},
we treated models as possible worlds without analyzing their contents.
{{< chapter_ref chapter="boolean" >}}Boolean algebra{{< /chapter_ref >}} then
represented a world's basic facts by truth-values. FOL lets us look further
inside: we distinguish objects and record their properties and relations.

{{< fol-worlds >}}

A model is a possible reasoning scenario. In propositional logic, a scenario
specifies which basic claims are true. A first-order scenario also tells us
which objects there are, what our names denote, and which properties and
relations those objects have.

Suppose Socrates is human. We can represent this information by placing him
inside a set labeled $Human$, listing him in a table of humans, or attaching
$Human$ to his node in a knowledge graph. For relational information, such as
Mr Sir being bigger than Jimmy, we can list an ordered pair or draw a labeled
arrow. These presentations record the same information. The mathematical
notion of a model collects what they have in common.

{{< callout type="definition" title="First-order model" >}}
A {{< term "fol-model" "first-order model" >}} $M$ for a signature consists of
a nonempty {{< term "domain" "domain" >}} $D$ and an
{{< term "interpretation" "interpretation" >}} assigning:

- an object $⟦a⟧ᴹ ∈ D$ to each constant $a$;
- a total function $⟦f⟧ᴹ: Dⁿ → D$ to each $n$-ary function symbol $f$;
- a relation $⟦R⟧ᴹ ⊆ Dⁿ$ to each $n$-ary predicate symbol $R$.
{{< /callout >}}

Here $Dⁿ$ contains the ordered $n$-tuples from $D$. The semantic brackets
$⟦…⟧ᴹ$ indicate interpretation in $M$; we omit the superscript when only one
model is under discussion.

For a finite model, we can record these interpretations in tables. This gives
us a relational database: a way of storing the scenario's information in a
computer. Constants and functions require tables too, with constraints that
ensure they pick out the right number of values. Later we will use formulas
to query that information.

{{< callout type="note" title="Modeling assumptions: classical FOL" >}}
As in {{< chapter_ref chapter="logic-and-ai" >}}Logic and AI{{< /chapter_ref >}},
our representation involves modeling assumptions. Classical FOL assumes a
nonempty domain, a denotation for every name, total functions, and a definite
truth-value for every predicate applied to domain objects. We will examine
these assumptions as we introduce the components.
{{< /callout >}}

### Domains {#nonempty-domains}

We first choose which objects our scenario contains. A model of a family
might contain people; a model of arithmetic might contain numbers. This set
of objects is the domain, and it fixes what our quantifiers range over.
We can also mix kinds of objects. Our
example contains Little Jimmy, Mr Sir, Granny Smith, Socrates, and a box:

{{< logic-app name="fol-model" model="people-domain" view="sets" title="Choose a domain" >}}

The pictures represent the objects themselves. The domain is a set, so its
order does not matter, and each object occurs only once. Which objects we
include is a modeling choice: leaving someone out means our claims about
*every object* will not range over that person.

{{< callout type="note" title="Modeling assumptions: a nonempty domain" >}}
We assume $D ≠ ∅$. This does not require every property to have an instance:
a domain can contain people even when its set of unicorns is empty. The
nonemptiness assumption also affects inference. If every object has a
property, there is an object with that property, because we have an object to
start with. We keep this convention in
{{< chapter_ref chapter="FOL-inference" >}}FOL Inference{{< /chapter_ref >}}.
{{< /callout >}}

Domains need not be finite. The natural numbers, integers, or real numbers can
be a domain. Arithmetic uses such infinite scenarios, and some first-order
theories can only be represented by infinite models. Our finite examples let
us display every object; they do not limit the definition of a model.

### Constants {#constants-and-functions}

Having chosen the objects, we can give them names. We might let $Socrates$
name the pictured Socrates. That object is the constant's
{{< term "denotation" "denotation" >}} in this scenario:

{{< set expression=true alt="Socrates denotes the pictured Socrates." >}}
[{"op":"⟦Socrates⟧ ="}, {"image":"fol_socrates"}]
{{< /set >}}

The labeled objects below show the denotations of our three constants. A table
can record the same assignments, one constant and its denotation per row.

{{< logic-app name="fol-model" model="people-constants" view="graph" title="Interpret constants" >}}

{{< callout type="note" title="Modeling assumptions: every name denotes" >}}
Every constant must denote exactly one domain object. Classical FOL has no
empty names: if our language includes $Socrates$, we must give it a denotation,
even in a fictional scenario. A different model can assign that name to Jimmy.
An object need not have a name, and two names may denote the same object. The
assumption that every name denotes is separate from the optional assumption
that different names denote different objects.
{{< /callout >}}

### Functions {#interpreting-functions}

We can also refer to an object through its relation to another: Jimmy's father,
for example. The term $fatherOf(LittleJimmy)$ does this by applying a function
to Jimmy. To interpret it, we need the denotation of $LittleJimmy$ and a
function on the domain.

{{< callout type="definition" title="Total function" >}}
A {{< term "total-function" "total function" >}} assigns exactly one output to
every input in its domain.
{{< /callout >}}

For a unary function, a table has one row for every domain object. An arrow
diagram gives each object exactly one outgoing arrow with the function's
label. Both represent the same function. In the example, the row beginning
with Jimmy ends with Mr Sir:

{{< logic-app name="fol-model" model="people-functions" view="tables" title="Interpret functions" >}}

{{< callout type="note" title="Modeling assumptions: total functions" >}}
FOL requires functions to be total. The table therefore needs a value for the
box, as well as for Socrates. This is awkward for $fatherOf$: a box has no
father, and our information about Socrates' father may be incomplete. Leaving
a row blank gives a partial interpretation, which is not yet a model of this
language. We must supply a value, change the domain, or use another way to
represent the information.
{{< /callout >}}

Our example assigns the box to itself and Socrates to himself. These choices
complete the function, but they do not fit the intended family story. Following
a unary function repeatedly in any finite domain eventually revisits an
object. An acyclic ancestry chain would require a different representation.
A binary predicate $ParentOf$ can record parent pairs without assigning every
object a parent. We will discuss what an absent pair means in the next section.

For a binary function, we need a value for every ordered pair in $D²$; for an
$n$-ary function, for every tuple in $Dⁿ$. Every value must also belong to $D$.
The name alone imposes no further constraint. In a domain containing Jimmy
and a soda, even this is allowed:

{{< set expression=true alt="The distanceBetween function applied to Little Jimmy twice returns a soda." >}}
[{"op":"⟦distanceBetween⟧("}, {"image":"gimmick_little_jimmy"}, {"op":","}, {"image":"gimmick_little_jimmy"}, {"op":") ="}, {"image":"gimmick_soda"}]
{{< /set >}}

We need additional conditions to rule out interpretations that disagree with
what we intend to represent.

### Predicates {#predicates-and-tuples}

We also need to record which objects are human. We collect Jimmy, Mr Sir,
Granny Smith, and Socrates in a set, leaving the box outside it. This is
$⟦Human⟧$, the {{< term "extension" "extension" >}} of $Human$: the set of
objects to which the predicate applies. A set diagram shows these
memberships spatially; a one-column table lists the members.

{{< callout type="note" title="Modeling assumptions: bivalence" >}}
For each object, there are exactly two possibilities: it belongs to the
extension or it does not. This is the
{{< term "bivalence" "bivalence" >}} assumption from {{< chapter_ref
chapter="boolean" >}}Boolean algebra{{< /chapter_ref >}}, now applied to claims
about objects.
{{< /callout >}}

Relational information needs more than a set of individual objects. To record
that Mr Sir is bigger than Jimmy, we must keep the two objects together and
remember their order. We use the fixed-length lists called tuples.

{{< callout type="definition" title="Tuple" >}}
An {{< term "tuple" "ordered tuple" >}} $[d₁, …, dₙ]$ is a sequence of $n$
objects, with order and repetitions retained.
{{< /callout >}}

The extension of a binary predicate is a set of ordered pairs. A table puts
each pair in a row, with its first object in the first column and its second
object in the second column. A graph draws an arrow from the first to the
second. Here $⟦BiggerThan⟧$ contains the pairs from Mr Sir to Jimmy, from Jimmy
to the box, and from Mr Sir to the box:

{{< logic-app name="fol-model" model="people-relations" view="tables" title="Interpret predicates" >}}

Reversing a pair changes its meaning. Including $[Jimmy, MrSir]$ in $⟦Sibling⟧$
does not automatically include $[MrSir, Jimmy]$. Symmetry is an additional
condition we might impose. The starting $Sibling$ extension is empty.

An $n$-ary predicate has a set of $n$-tuples as its extension, represented by a
table with $n$ columns. A ternary $LiesBetween$ needs three columns. We identify
unary extensions with sets of one-tuples when writing them as tables. Every
tuple is either in the extension or outside it. If we only have incomplete
information about a relation, a single complete model commits to more than
we know; a set of possible models can leave those choices open.

### Models as knowledge bases {#one-model-different-displays}

A complete model specifies the basic information about a scenario. That
information can serve as a knowledge base. We have several ways to present it:

1. **Semantic equations** specify the domain, denotations, function values,
   and predicate extensions using sets and functions.
2. **{{< term "set-diagram" "Set diagrams" >}}** place objects or tuples inside their extensions. Overlap
   shows shared membership, as in [Euler diagrams](https://en.wikipedia.org/wiki/Euler_diagram).
   A diagram of one extension shows one part of the model.
3. **Tables** store extensions as rows. Together with tables for the domain,
   constants, and functions, they encode a finite model as a
   {{< term "relational-database" "relational database" >}}
   ([Wikipedia](https://en.wikipedia.org/wiki/Relational_database)).
4. **{{< term "knowledge-graph" "Knowledge graphs" >}}** represent objects as
   nodes, with property labels and relation arrows
   ([Wikipedia](https://en.wikipedia.org/wiki/Knowledge_graph)). For relations
   with more than two places, we must also record the argument positions.
5. **Formulas** record the model's basic facts in an expanded language with a
   name for every object. We will describe this collection below.

These presentations must record the same domain and interpretations to
represent the same model. Changing a membership or denotation changes the
scenario itself.

{{< logic-app name="fol-model" model="people" view="graph" title="A model as a knowledge base" >}}

For the database presentation, predicate extensions become relation tables.
A function becomes a table of argument tuples followed by their values, with
exactly one value for each argument tuple. Constants require denotation
entries, and a domain table records all objects, including those absent from
every predicate extension. These tables encode the whole finite structure.
We will use the same representation for database queries below.

We can also describe a model syntactically. Give every object a name, adding
names if necessary, and record its basic facts as atomic formulas and negated
atomic formulas. For example, $Human(Socrates)$ records a membership and
$¬Sibling(Socrates, LittleJimmy)$ records a non-membership. Equations
such as $fatherOf(LittleJimmy) = MrSir$ record function values. Model theory
calls the full collection of true atomic and negated atomic sentences in this
expanded language the {{< term "model-diagram" "atomic diagram" >}} of the model.

The diagram includes identities and inequalities between names. To specify a
finite model exactly, we also say that every object is one of the named
objects; the atomic diagram alone does not exclude additional unnamed objects.
This is another way to represent the scenario's information with formulas.
A general knowledge base can leave some facts open, allowing several models.
A complete model settles them all. Satisfaction will tell us precisely how to
check a formula against such a scenario.

## Truth and satisfaction {#truth-and-satisfaction}

A knowledge base should help us answer questions. Once we have recorded who
is human, who is mortal, and who is bigger than whom, we can ask which humans
are mortal or which humans are bigger than the box. We need not store a
separate predicate for every question: open formulas express these complex
conditions using the information already in the model.

Before checking a formula, we need to know what its terms denote. A model
fixes $⟦LittleJimmy⟧$ and the function $⟦fatherOf⟧$, but it cannot tell us what
$fatherOf(x)$ denotes until we give $x$ a value.

{{< callout type="definition" title="Variable assignment" >}}
A {{< term "variable-assignment" "variable assignment" >}} $v$ in a model with
domain $D$ assigns an object of $D$ to each variable.
{{< /callout >}}

We use $v$, as for
{{< chapter_ref chapter="boolean" id="parsing-and-valuations" >}}Boolean valuations{{< /chapter_ref >}}.
Here, its values are objects.

With these values supplied, denotation follows the term's construction:

{{< callout type="definition" title="Denotation under an assignment" >}}
In a model $M$ under an assignment $v$, the {{< term "denotation" "denotation" >}}
$⟦t⟧ᴹᵥ$ of a term $t$ is defined recursively:

$$
⟦x⟧ᴹᵥ = v(x)
⟦a⟧ᴹᵥ = ⟦a⟧ᴹ
⟦f(t₁, …, tₙ)⟧ᴹᵥ = ⟦f⟧ᴹ(⟦t₁⟧ᴹᵥ, …, ⟦tₙ⟧ᴹᵥ)
$$

Here $x$ is a variable, $a$ a constant, and $f$ an $n$-ary function symbol.
{{< /callout >}}

For a ground term, no variable lookup is needed. Its denotation depends only
on $M$, so we omit $v$.

Start at the leaves: look up variables in $v$ and constants in $M$. Then
apply each function to the values of its arguments. If $v(x)$ is Jimmy,
$fatherOf(fatherOf(x))$ first gives Mr Sir, then Socrates in our example model.
Change the value of $x$ and follow the calculation:

{{< logic-app name="fol-model" model="people" kind="term" editable="false" view="tables" formula="fatherOf(fatherOf(x))" title="Calculating a term's denotation" >}}

### Atomic and compound formulas

Once we know what the terms denote, we can check a claim about those objects.
For $Human(Socrates)$, we look for Socrates in $⟦Human⟧$. For
$BiggerThan(MrSir, LittleJimmy)$, we look for the ordered pair in
$⟦BiggerThan⟧$. We then combine the answers using the same truth-functions
as in {{< chapter_ref chapter="boolean" >}}Boolean algebra{{< /chapter_ref >}}. Satisfaction records the result of these checks.

{{< callout type="definition" title="Satisfaction" >}}
An assignment $v$ {{< term "satisfaction" "satisfies" >}} a formula $A$ in $M$,
written $M, v ⊨ A$, according to the following recursive clauses:

- $M, v ⊨ P(t₁, …, tₙ)$ iff $[⟦t₁⟧ᴹᵥ, …, ⟦tₙ⟧ᴹᵥ] ∈ ⟦P⟧ᴹ$.
- $M, v ⊨ t₁ = t₂$ iff $⟦t₁⟧ᴹᵥ = ⟦t₂⟧ᴹᵥ$.
- $M, v ⊨ ¬A$ iff $M, v ⊭ A$.
- $M, v ⊨ (A ∧ B)$ iff $M, v ⊨ A$ and $M, v ⊨ B$.
- $M, v ⊨ (A ∨ B)$ iff $M, v ⊨ A$ or $M, v ⊨ B$.
- $M, v ⊨ (A → B)$ iff $M, v ⊭ A$ or $M, v ⊨ B$.
- $M, v ⊨ (A ↔ B)$ iff ($M, v ⊨ A$ iff $M, v ⊨ B$).
{{< /callout >}}

{{< term "identity" "Identity" >}} compares the objects denoted by two terms.
In our starting model, $$MrSir = fatherOf(LittleJimmy)$$ is true because both
terms denote Mr Sir. The names do not have to look alike. Conversely, a
predicate atom is true only when its whole ordered tuple belongs to the
predicate's extension.

A {{< term "ground-formula" "ground formula" >}} contains no variables. Take, for example:
$$(Human(LittleJimmy) ∧ Mortal(LittleJimmy))$$ This is an example of a non-atomic ground formula.
Every ground formula is a sentence, since it has no free variables. The
converse fails: $∀x Human(x)$ is a sentence containing a variable.

Recall that a sentence is a *closed formula*: it has no free variable
occurrences. An assignment affects satisfaction only through the values of
free variables. So for a closed $A$, any two assignments $v$ and $w$ agree
on whether it is satisfied:

$$
M, v ⊨ A  iff  M, w ⊨ A
$$

A closed formula is therefore satisfied under one assignment iff it is
satisfied under every assignment. Take $∀x Human(x)$: whatever $v(x)$ was,
the quantifier checks *every* object. The box makes this sentence false in
our model regardless of the starting assignment. For the open formula
$Human(x)$, by contrast, the choice of $v(x)$ matters.

{{< callout type="definition" title="Truth in a model" >}}
A sentence $A$ is {{< term "truth-in-a-model" "true in a model" >}} $M$, written
$M ⊨ A$, if $M, v ⊨ A$ for every variable assignment $v$ in $M$.
{{< /callout >}}

This is why we can omit the assignment for a sentence. For open formulas we
keep it explicit. The same convention will apply in
{{< chapter_ref chapter="FOL-inference" >}}FOL Inference{{< /chapter_ref >}}, where we
compare truth across models to study valid inference.

### Extensions of open formulas

An open formula defines a complex property or relation in a model. To find
its extension, we go through the possible values of its free variables and
keep the objects or tuples for which the formula is true.

Write $A(x₁, …, xₙ)$ to list all the free variables of $A$ in a chosen order.
An {{< term "assignment-prescription" "assignment prescription" >}} $[x₁ ↦ d₁, …, xₙ ↦ dₙ]$ gives each of them a
value. These are the only values satisfaction depends on.[^prescription]

{{< callout type="definition" title="Satisfying tuples and extensions" >}}
Let $x₁, …, xₙ$ be exactly the distinct free variables of $A$. In a model $M$
with domain $D$, the tuple $[d₁, …, dₙ] ∈ Dⁿ$ **satisfies** $A(x₁, …, xₙ)$,
written $M ⊨ A(d₁, …, dₙ)$, iff

$$
M, [x₁ ↦ d₁, …, xₙ ↦ dₙ] ⊨ A(x₁, …, xₙ).
$$

The {{< term "formula-extension" "extension of A" >}} is

$$
⟦A(x₁, …, xₙ)⟧ᴹ = {[d₁, …, dₙ] ∈ Dⁿ | M ⊨ A(d₁, …, dₙ)}.
$$
{{< /callout >}}

Here $A(d₁, …, dₙ)$ is semantic shorthand: the objects need not have names
in our language.

[^prescription]: Formally, complete the prescription to any assignment on all
    variables. Every completion gives the same result, since all free variables
    already have their values.

For one free variable, we identify a one-tuple $[d]$ with its object $d$.
For example, $⟦(Human(x) ∧ Mortal(x))⟧$ contains all four humans in the starting
model. If Jimmy becomes immortal, it contains only Mr Sir, Granny Smith,
and Socrates. For two free variables, we try the ordered pairs $[d, e] ∈ D²$,
assigning $d$ to $x$ and $e$ to $y$ for each check.

The extension of $(BiggerThan(x, y) ∧ Human(x))$ keeps the $BiggerThan$ rows
whose first object is human. There are three such pairs in our starting model:

{{< logic-app name="fol-model" model="people-relations" kind="query" editable="false" view="domain" formula="(BiggerThan(x, y) ∧ Human(x))" title="The extension of an open formula" >}}

These sets of satisfying tuples will become our database query answers.
A required positive atom lets us skip tuples absent from its relation; negation
and unrestricted formulas can still require the whole domain.

### Quantifiers and truth in a model

The extension makes the quantifiers easy to read. An existential claim says
that the extension has a member; a universal claim says it fills the domain.

For a formula with $x$ as its only free variable:

$$
M ⊨ ∀x A(x)  iff  ⟦A(x)⟧ᴹ = D
M ⊨ ∃x A(x)  iff  ⟦A(x)⟧ᴹ ≠ ∅
$$

In $∃y Sibling(x, y)$, we still need a value for $x$: whose siblings are
we asking about? The quantifier changes the value of $y$ while keeping $x$
fixed. We implement this by updating an assignment with a prescription:

{{< callout type="definition" title="Assignment variant" >}}
The {{< term "assignment-variant" "assignment variant" >}} $v[x ↦ d]$ assigns
$d ∈ D$ to $x$ and agrees with $v$ on every other variable. A prescription
with several distinct variables updates all their values at once.
{{< /callout >}}

{{< callout type="definition" title="Quantifier clauses" >}}
For a model $M$ with domain $D$ and an assignment $v$:

- $M, v ⊨ ∃x A$ iff $M, v[x ↦ d] ⊨ A$ for some $d ∈ D$.
- $M, v ⊨ ∀x A$ iff $M, v[x ↦ d] ⊨ A$ for every $d ∈ D$.
{{< /callout >}}


An existential quantifier tries possible values for its variable. One witness
is enough. A universal quantifier requires every value to work; one
counterexample is enough to refute it. In either case, the other variables keep
their current assignments.

In the model below, each human belongs to $⟦Mortal⟧$. For each object we
check the whole conditional $Human(x) → Mortal(x)$. A false antecedent makes
the conditional true; a human outside $⟦Mortal⟧$ would make it false. Once all
five objects pass this check, the universal sentence is true.

{{< logic-app name="fol-model" model="people-relations" kind="evaluate" view="sets" formula="∀x (Human(x) → Mortal(x))" title="Truth in a finite model" >}}

## Finite and infinite models {#finite-models}

Our examples use finite lists of objects, but FOL can also describe the whole
set of natural numbers. A {{< term "finite-model" "finite model" >}} has finitely
many domain objects; an {{< term "infinite-model" "infinite model" >}} has
infinitely many. Infinite models are indispensable in logic and mathematics. Some axioms even *require* an infinite model: a strict,
transitive ordering in which every object has a larger one cannot be finite.

Concrete databases, by contrast, contain finitely many records. Many AI tasks
also concern a finite collection of objects: people in a register, parts in a
warehouse, or countries on a map. The study of finite models is therefore
central to [database theory](https://en.wikipedia.org/wiki/Database_theory).

<span id="checking-a-finite-model"></span>
For a finite model, the satisfaction clauses give us an algorithm for
{{< term "model-checking" "model checking" >}}: evaluate atoms, combine their
truth-values using the connectives, and check domain objects for the quantifiers.
Every search finishes, though nested quantifiers can require many checks.
On an infinite domain, we cannot generally settle a quantified claim by
running through all the objects. We may need a proof instead.

## Databases and FOL {#databases-and-fol}

A finite model's predicate extensions can be stored as database tables. We
can then use formulas to ask questions about the stored information. Let's
build a database and see how this works.

### From a model to a database

{{< img src="/img/drawings/gimmick_database.svg" class="float-start me-3" width="140px" alt="A database." >}}
Suppose we want to record countries, their capitals, their continents, and
languages spoken there. We can describe this information as a model, then
store its relations as tables in a
{{< term "relational-database" "relational database" >}}. Our example uses a
small dataset; it does not attempt to list every language spoken in each country.
Choosing which objects and relations to represent is part of
{{< term "knowledge-engineering" "knowledge engineering" >}}.

We use the binary predicates $CapitalOf$, $CityIn$, $LocatedIn$, and $LanguageOf$.
$CapitalOf(country, capital)$ puts the country first. The domain consists of
18 objects, each identified by a distinct text value. Constants such as
$Europe$ and $Japan$ denote the corresponding objects. New York appears in
$CityIn$; Washington D.C. appears as the United States' capital.

Each predicate extension becomes a table with one column per argument place
and one row per tuple. For example, $[France, Paris] ∈ ⟦CapitalOf⟧$ gives a
row with `France` in the `country` column and `Paris` in the `capital` column.
SQL has no built-in table of all domain objects. When exporting a model, we
explicitly create $Domain(value)$, including objects absent from every relation.
Without this table, we read a database's domain as the union of the values in
its relation columns, its **active domain**. An empty union needs a nonempty
$Domain$ table to give a model in our sense. Constants must denote objects in
the chosen domain; there are no function symbols here.

The database needs both a table structure and its contents. In SQL,
`CREATE TABLE` declares the columns of an initially empty table; `INSERT INTO`
adds its rows. `TEXT` makes the entries text identifiers, and `NOT NULL`
requires a value in each column. A `PRIMARY KEY` covering all columns prevents
duplicate rows, so the table represents a set of tuples.

{{< logic-app name="fol-model" model="world" kind="database" view="tables" title="From a model to a database" >}}

With $Domain$ included, the round trip preserves otherwise unused objects.
Without it, the app uses the active domain. Constant denotations stay fixed.
Each SQL example starts from its own database.

### From formulas to queries {#asking-questions-of-the-database}

With the model stored, we can ask for the countries in Europe or their capitals.
An open formula specifies the condition, and its extension gives the answer.
This is the connection between the syntactic and semantic approaches to
knowledge representation: a formula picks out information in a stored model.

{{< callout type="definition" title="Relational query" >}}
A {{< term "relational-query" "relational query" >}} specified by a formula
returns the tuples of domain objects that satisfy the formula when assigned
to its free variables, in the specified order.
{{< /callout >}}

For instance, $LocatedIn(x, Europe)$ asks for the countries in Europe. Its
answer in our database is France, the United Kingdom, and Greece. The formula

$$
∃y (CapitalOf(y, x) ∧ LocatedIn(y, Europe))
$$

asks for their capitals. A candidate value of $x$ is kept when some $y$ relates
to it through $CapitalOf$ and also relates to $Europe$ through $LocatedIn$.
The answer is Paris, London, and Athens.

For $LocatedIn(x, Europe)$, consider France as a value of $x$. The
pair $[France, Europe]$ occurs in $⟦LocatedIn⟧$, so we keep France.
Japan fails the same test: its recorded continent is Asia. Each candidate is
checked against the stored relation, and the successful candidates form the
answer table.

{{< logic-app name="fol-model" model="world" kind="query" editable="false" view="domain" formula="LocatedIn(x, Europe)" title="Query a relational database" >}}

The negated query $¬LocatedIn(Japan, x)$ returns every domain object
except Asia, including objects that are not continents. Negation takes its
complement relative to the whole domain. If we want continents only, we must
express that further restriction.

<span id="formulas-to-sql"></span>

In SQL, we can retrieve the extension of $LocatedIn(x, Europe)$ as follows:

{{< sql-app model="world" title="Querying European countries" >}}
SELECT DISTINCT country
FROM LocatedIn
WHERE continent = 'Europe';
{{< /sql-app >}}

{{< callout type="note" title="Our database assumptions" >}}
Values are non-NULL text identifiers, one per object. Tables give complete
predicate extensions: an absent tuple is false in this model. Query answers
are sets, obtained in SQL with $DISTINCT$. Quantifiers range over the explicit
finite table $Domain(value)$, including objects absent from all relation
extensions.
{{< /callout >}}

#### Atomic queries

We now go through the syntactic operations one by one. Each rule translates
a formula using the translations of its immediate parts. The reverse problem,
finding a formula for a query built from table operations, leads to Codd's theorem.

The short query above reads $LocatedIn$ directly. For a recursive translation,
we use a uniform outer query: range over the possible values of
each free variable and test the formula as an SQL condition. For one free
variable $x$, the outer query has this form:

```sql
SELECT DISTINCT d.value AS x
FROM Domain AS d
WHERE /* condition for the formula */;
```

This is a template: the comment must be replaced by a condition. `d` is an
alias, a local name for a row of $Domain$. Its `value` column supplies the
current value of $x$. With two free variables $x, y$, we use two aliases:
`FROM Domain AS d CROSS JOIN Domain AS e`. The product visits every ordered
pair of domain values. `SELECT DISTINCT d.value AS x, e.value AS y` returns
the pairs that pass the condition, without repetitions.

A predicate atom asks whether a particular row exists. For $LocatedIn(x, Europe)$,
we search $LocatedIn$ for the current value of $x$ paired with Europe:

{{< sql-app model="world" title="An atomic row test" >}}
SELECT DISTINCT d.value AS x
FROM Domain AS d
WHERE EXISTS (
    SELECT 1 FROM LocatedIn AS r
    WHERE r.country = d.value
      AND r.continent = 'Europe'
);
{{< /sql-app >}}

`EXISTS` is true when its inner query returns at least one row. `SELECT 1`
puts a placeholder value in that row: here we only need to know whether a
matching row exists. A constant becomes its text identifier, such as
`'Europe'`; a variable becomes its current domain value, such as `d.value`.
Thus $x = Japan$ translates to `d.value = 'Japan'`. If a variable occurs twice,
both occurrences use the same value: $LocatedIn(x, x)$ requires both columns
of a relation row to equal `d.value`.

#### Propositional connectives

Suppose we have already translated $A$ and $B$ to SQL conditions. We combine
those conditions according to the main connective, just as in recursive
formula evaluation. Write `query(A)` for the SQL condition translating $A$, including any inner
queries:

| FOL | SQL condition |
| --- | --- |
| $¬A$ | {{< sql-condition "NOT (query(A))" >}} |
| $A ∧ B$ | {{< sql-condition "(query(A)) AND (query(B))" >}} |
| $A ∨ B$ | {{< sql-condition "(query(A)) OR (query(B))" >}} |
| $A → B$ | {{< sql-condition "(NOT (query(A))) OR (query(B))" >}} |

For example, $LocatedIn(x, Europe) ∧ ¬LanguageOf(x, English)$ has conjunction
as its main connective. Translate the two atoms first, negate the second
condition, and join them with `AND`:

{{< sql-app model="world" title="Conjunction and negation" >}}
SELECT DISTINCT d.value AS x
FROM Domain AS d
WHERE EXISTS (
    SELECT 1 FROM LocatedIn AS r
    WHERE r.country = d.value
      AND r.continent = 'Europe'
)
AND NOT EXISTS (
    SELECT 1 FROM LanguageOf AS l
    WHERE l.country = d.value
      AND l.language = 'English'
);
{{< /sql-app >}}

The answer is France and Greece. Replacing `AND` with `OR` changes the
formula's main connective and therefore its answer. Notice that `NOT` rejects
a candidate exactly when the condition inside it succeeds. Because candidates
come from $Domain$, negation can also retain cities, languages, and continents.
Restricting a variable to countries takes another condition; its name alone
doesn't restrict its range.

#### Quantifiers

An existential quantifier introduces another search over $Domain$. For each
current value of $x$, $∃y A(x, y)$ asks whether *some* value of $y$ makes $A$
true. Give $y$ a fresh domain alias, translate $A$ using that alias, and put
the condition inside `EXISTS`.

For $∃y (CapitalOf(y, x) ∧ LocatedIn(y, Europe))$, the recursion has three
steps: translate the two atoms, combine them with `AND`, then search for a
value of $y$ satisfying that conjunction. The outer alias `d` supplies $x$;
the inner alias `e` supplies $y$:

{{< sql-app model="world" title="An existential query" >}}
SELECT DISTINCT d.value AS x
FROM Domain AS d
WHERE EXISTS (
    SELECT 1 FROM Domain AS e
    WHERE EXISTS (
        SELECT 1 FROM CapitalOf AS c
        WHERE c.country = e.value
          AND c.capital = d.value
    )
    AND EXISTS (
        SELECT 1 FROM LocatedIn AS r
        WHERE r.country = e.value
          AND r.continent = 'Europe'
    )
);
{{< /sql-app >}}

Only $x$ appears in the result. The inner value of $y$ supplies a witness;
it isn't a free variable of the whole formula.

A universal quantifier asks whether every value passes. SQL can express this
by looking for a failure: $∀y A$ is true exactly when $∃y ¬A$ is false.
Translate $A$, negate its condition, search for such a value of $y$, and
negate the search result:

| FOL | SQL condition template |
| --- | --- |
| $∃y A$ | {{< sql-condition "EXISTS (SELECT 1 FROM Domain AS e WHERE query(A))" >}} |
| $∀y A$ | {{< sql-condition "NOT EXISTS (SELECT 1 FROM Domain AS e WHERE NOT (query(A)))" >}} |

Here `query(A)` uses `e.value` for $y$; the notation is a placeholder, not an SQL function.
For example, $∀y (LocatedIn(x, y) → y = Europe)$ asks for objects whose
recorded locations, if any, are all Europe. A counterexample would be a
location other than Europe:

{{< sql-app model="world" title="A universal query" >}}
SELECT DISTINCT d.value AS x
FROM Domain AS d
WHERE NOT EXISTS (
    SELECT 1 FROM Domain AS e
    WHERE EXISTS (
        SELECT 1 FROM LocatedIn AS r
        WHERE r.country = d.value
          AND r.continent = e.value
    )
    AND NOT (e.value = 'Europe')
);
{{< /sql-app >}}

France, the United Kingdom, and Greece pass. Objects with no recorded location
also pass: they supply no counterexample to the conditional. The United States
and Japan fail. To ask specifically for European countries, the earlier
positive atomic query is a better choice.

With iterated quantifiers, repeat the construction. Each quantifier gets a
fresh alias, and the scope is translated using that alias for its bound
variable. An inner quantifier for the same variable temporarily replaces its
outer alias; outside that scope, the outer alias still applies. The parse
tree determines where each translation step belongs. This gives us a procedure
for translating formulas of any depth in our relational language.

### Codd's theorem {#codd-and-curry-howard}

We can now translate a formula by translating its parts. Can we go back as
well, from a computation on tables to a formula? Codd's theorem gives us this
connection between logic and databases.

We need one qualification. A query is *domain-independent* if adding unused
objects to the domain, while leaving the stored relations and constant
denotations unchanged, leaves its answer unchanged. Asking for European
capitals has this property: adding an object to no relation cannot make it
a European capital.

{{< callout type="theorem" title="Codd's theorem" >}}
The domain-independent queries expressible by FOL formulas are exactly the
queries computable from relation tables by selecting rows, projecting columns,
renaming columns, taking products and unions, and subtracting one set of rows
from another.
{{< /callout >}}

Selecting rows tests their values; projecting columns keeps only the requested
columns. Products combine rows from two tables, and subtraction removes rows
found in the second table. These operations form
{{< term "relational-algebra" "relational algebra" >}}; describing queries
with FOL formulas is called {{< term "relational-calculus" "relational calculus" >}}.
We use SQL to write the table operations. Codd's theorem says that we can
translate between these computations and formulas without changing the answer
on any database.

Our negated query, $¬LocatedIn(Japan, x)$, explains the domain-independence
qualification: adding an unused object changes its answer. Our recursive
translation handles such formulas too because it explicitly queries $Domain$.
Codd's theorem concerns queries that need no such dependence on unused objects.

This recalls the {{< term "curry-howard" "Curry–Howard correspondence" >}} from
{{< chapter_ref chapter="proofs" id="concrete-curryhoward-correspondence" >}}Logical proofs{{< /chapter_ref >}}. There, a formula becomes a type, and a
proof becomes a program of that type. Here, a model becomes a database, and
an open formula becomes a query on that database:

| | Logical representation | Computational representation |
| --- | --- | --- |
| Curry–Howard | Formula | Type |
| | Proof of the formula | Program of that type |
| Databases and FOL | Model | Database |
| | Open formula evaluated in the model | Query evaluated on the database |

Both connections let us move between logical and computational representations.
A type specifies what a proof program must establish; an open formula
specifies which tuples a query must return. Codd's theorem tells us that the
table operations can compute exactly the relations specified by the
appropriate formulas. Unlike a proof, a query does not establish its formula
in general: its answer depends on the database we give it.

{{< logic-app name="fol-model" model="world" kind="sql" editable="false" view="domain" formula="∃y (CapitalOf(y, x) ∧ LocatedIn(y, Europe))" title="Formulas and SQL" >}}

Going back from SQL can introduce or rename bound variables. The resulting
formula needn't be spelled like the original; it must return the same relation.
SQL also has features outside this correspondence, such as duplicates, NULLs,
and aggregates. The translation here covers the FOL fragment.

A database query concerns one specified model. A knowledge base can describe
many possible models. {{< chapter_ref chapter="FOL-inference" >}}FOL Inference{{< /chapter_ref >}} asks which conclusions hold in every
model of its premises and develops inference rules for reasoning about them.

## Further readings {.readings .nocount}

- Richard Zach, [*Sets, Logic, Computation* (PDF)](https://slc.openlogicproject.org/slc-screen.pdf), chapters 6–7, for first-order syntax, structures, and variable assignments.
- Russell and Norvig, [*Artificial Intelligence: A Modern Approach*, 4th edition](https://www.pearson.com/en-us/subject-catalog/p/Russell-Lecture-Power-Points-for-Artificial-Intelligence-A-Modern-Approach-4th-Edition/P200000003500/9780137505135), chapter 8, for first-order knowledge representation.
