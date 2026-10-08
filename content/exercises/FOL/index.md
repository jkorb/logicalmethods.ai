---
title: FOL
author: Johannes Korbmacher
weight: 80
params:
  last_edited: "07/10/2026"
  id: exc-fol
---

# Building formulas {#building-formulas}

Build each target from terms and formulas using the formation rules. Select
arguments in order before choosing a function, predicate, or connective.
For quantification, select a formula and the variable to bind. The first level
asks for a term; the remaining levels ask for formulas.

{{< logic-app name="fol-practice" exercise="builder" title="Building FOL formulas" >}}

# Scope and binding {#scope-and-binding}

Mark every quantifier's bindings. Select a quantifier, then the variable
occurrences it binds; select another quantifier to continue. Leave free
occurrences unconnected. Visit a vacuous quantifier too, but give it no arrows.
Check the completed diagram.

{{< logic-app name="fol-scope" mode="practice" title="Scope and binding practice" >}}

# Decoding FOL {.solved}

Paraphrase the following FOL formulas in natural language:

1. $∃x (FatherOf(x, brotherOf(jimmy)) ∧ ¬FatherOf(x, jimmy))$

2. $∀x (Fish(x) → ∃y (Fish(y) ∧ BiggerThan(y, x)))$

3. $(∃x Sibling(jimmy, x) → ∃x (Sibling(jimmy, x) ∧ ∀y (Sibling(x, y) → YoungerThan(y, x))))$

4. $∃x ∃y (Thief(x) ∧ Thief(y) ∧ x ≠ y)$

5. $∃y ∀x Likes(x, y)$

6. $∀x ∃y Likes(x, y)$

7. $∃x (Key(x) ∧ Opens(x, door) ∧ ∀y ((Key(y) ∧ Opens(y, door)) → y = x))$

8. $¬∃x (Human(x) ∧ ∀y Knows(x, y))$

9. $∀x (Sibling(x, jimmy) → x ≠ jimmy)$

## Solution { #decoding-folSolution .solution }

1. There is a person who's the father of Jimmy's brother but not Jimmy's father.

2. For each fish, there's a bigger fish.

3. If Jimmy has a sibling at all, then one of Jimmy's siblings is older than all of their siblings.

4. There are at least two different thieves.
5. There is someone whom everyone likes.
6. Everyone likes someone, possibly a different person in each case.
7. Exactly one key opens the door.
8. No human knows everyone.
9. None of Jimmy's siblings is Jimmy himself.

# Substitution {.solved}

Substitution replaces the **free** occurrences of a variable by a term.
Let's work out its recursive definition. Write $E[t/x]$ for replacing $x$
by $t$ in a term or formula $E$.

1. Parse $R(g(x, a), f(x))$. Replace $x$ by $f(y)$ at the leaves and
   rebuild the tree upward. What happens at a variable different from $x$?
   At a constant?

    {{< logic-app name="parser" language="fol" formula="R(g(x, a), f(x))" title="Following a substitution" >}}

2. Write recursive clauses for variables, constants, function applications,
   predicate applications, identity, and the propositional connectives.
   Which clauses have the same pattern?
3. Consider $(P(x) ∧ ∀x Q(x))[a/x]$. Which occurrence changes, and why must
   substitution stop at the quantifier?
4. Now try $(∃y R(x, y))[y/x]$. Blind replacement gives $∃y R(y, y)$.
   Why is this wrong? Compare “the object assigned to $y$ relates to
   something” with “something relates to itself”. Rename the bound $y$
   to a fresh $z$ before substituting. What condition tells us that such
   renaming is needed?
5. Combine your clauses in the algorithm below. Here an *application* includes
   function and predicate applications and identity; `rebuild` keeps the
   original operator and uses the new children. `free_variables` applies to
   both terms and formulas. `rename_free(B, y, z)` renames the free occurrences
   of $y$ in $B$, stopping at inner quantifiers that bind $y$.
   `fresh_variable(E, t, x)` chooses a variable absent from $E$ and $t$ and
   different from $x$. Why is no renaming needed when $x$ is not free in $B$?

{{< logic-app name="fol-practice" exercise="substitution" title="Substitution pseudocode" >}}

## Solution {#substitutionSolution .solution}

1. The result is $R(g(f(y), a), f(f(y)))$. Replace a variable equal to $x$
   by $t$; leave other variables and constants alone.
2. Substitute recursively in every immediate child, then rebuild the
   application or connective with those children. For example,

    $$
    f(u₁, …, uₙ)[t/x] = f(u₁[t/x], …, uₙ[t/x])
    (A ∧ B)[t/x] = (A[t/x] ∧ B[t/x]).
    $$

3. Only the first occurrence is free, so the result is $(P(a) ∧ ∀x Q(x))$.
4. The inserted $y$ must remain free. Rename the existential binder first,
   obtaining $∃z R(x, z)$, then substitute to get $∃z R(y, z)$.
   Renaming is needed when substitution reaches a quantifier whose variable
   is free in the replacement term.
5. For $Q ∈ {∀, ∃}$, leave $Qy B$ unchanged when $y = x$ or $x$ is not free
   in $B$. Otherwise, if $y$ is free in $t$, first rename its bound
   occurrences to a fresh variable. Then substitute in the scope and
   restore the quantifier. If $x$ is absent, nothing is inserted, so nothing
   can be captured.

# Knowledge Engineering in FOL {.solved}

[Knowledge engineering](https://en.wikipedia.org/wiki/Knowledge_engineering) is
the complex process of developing a framework in which to encode knowledge about
a specific domain. There are different approaches to this problem, but here
we'll try out an FOL-based approach.

The problem we're tackling is to represent information about a given setup using
FOL formulas. The first step in the approach is to decide on a suitable
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
whether we can reduce some properties to others to have a simpler language. For
example, should we have a separate predicate for $Uncle²$ or should we define it
using $Male¹$, $Sibling²$, and $Parent²$, where rather than $Uncle(x, y)$ we use:

$$
Male(y) ∧ ∃z (Parent(z, x) ∧ Sibling(y, z))
$$

$Uncle(x, y)$ is much simpler, but the previous formula contains more information.
There is a trade-off that needs to be weighed carefully for every proposed
knowledge engineering solution.

The second step in FOL knowledge engineering is to take the given information
and to encode it with FOL formulas. Here, the main challenge is adequacy: we
need to find formulas whose FOL truth-conditions resemble the given information
as closely as possible, while remaining within the confines of FOL.

For a concrete knowledge engineering problem, let's consider the following
marketing information about {{< logo >}}&ThinSpace; provided by its developer:

{{< img src="img/competition.png" class="rounded  float-start inert-img img-fluid m-2" width="200px" >}} 
*Our {{< logo >}}&ThinSpace;is the top-of-the-line AI system from AI-Labs. It is
a hybrid system that has both symbolic and sub-symbolic sub-routines. This means
that {{< logo >}}&ThinSpace;is both capable of carrying out all traditional
reasoning tasks, such as natural deduction or $SAT$ solving, as well as
different learned tasks, such as image and voice recognition. This is in
contrast to its predecessor model $KnowIt∀$, which only had symbolic routines
and could only carry out reasoning tasks. It also makes {{<logo>}} superior to
the competition's model, $DeepL$, which is a purely sub-symbolic AI-system and
while able to carry out all learned tasks, can only carry out some simple
reasoning tasks.*

1. Devise a suitable FOL language for encoding the information about the three
   AI-systems. Justify your design choices.

2. Encode as much information as possible from the advert as FOL formulas. Is
   there information you chose not to include? If so, why?

3. What assumptions would a total function $makerOf$ impose? Compare it with
   a binary relation $IsMakerOf$. Which suits the information given?

## Solution {#knowledge-engineering-in-folSolution .solution}

1. There are different ways of doing this. One way to go is this:

    - Constants: $AllAI$, $KnowItAll$, $DeepL$, $imageRecognition$, $voiceRecognition$, $naturalDeduction$, $satSolving$

    - Predicates: $IsSymbolic¹$, $IsSubSymbolic¹$, $IsReasoningTask¹$, $IsLearnedTask¹$, $IsCapableOf²$

    This language has _names_ for certain tasks, like voice recognition or
    natural deduction, which means that it includes them in its ontology. This
    means, for example, that in models of that language these tasks will be
    objects in the domain. An alternative approach would be to include
    corresponding properties, like $IsCapableOfNaturalDeduction¹$, which however
    leads to a proliferation of predicates.

2. Using $AllAI$ and $KnowItAll$ as constants for the advertised systems, we can write:

    - $IsSymbolic(AllAI) ∧ IsSubSymbolic(AllAI)$
    - $∀x (IsReasoningTask(x) → IsCapableOf(AllAI, x))$
    - $∃x (IsLearnedTask(x) ∧ IsCapableOf(AllAI, x))$
    - $IsCapableOf(AllAI, naturalDeduction)$, $IsCapableOf(AllAI, satSolving)$
    - $IsCapableOf(AllAI, voiceRecognition)$, $IsCapableOf(AllAI, imageRecognition)$
    - $IsSymbolic(KnowItAll) ∧ ¬IsSubSymbolic(KnowItAll)$
    - $∀x (IsCapableOf(KnowItAll, x) → IsReasoningTask(x))$
    - $¬IsSymbolic(DeepL) ∧ IsSubSymbolic(DeepL)$
    - $∀x (IsLearnedTask(x) → IsCapableOf(DeepL, x))$
    - $∃x (IsReasoningTask(x) ∧ IsCapableOf(DeepL, x))$
    
    Reading “some” as “some but not all” adds: $∃x (IsReasoningTask(x) ∧ ¬IsCapableOf(DeepL, x))$

3. We might add a constant $aiLabs$ and a predicate $IsMakerOf²$ to the
   language to say that:

    - $IsMakerOf(aiLabs, AllAI)$

    The alternative of adding a function symbol $makerOf$ and writing $makerOf(AllAI) = aiLabs$ requires exactly one maker for *every* object in the domain, including
    $aiLabs$ itself. That's a modeling assumption, not a mistake in the
    syntax. If objects can have no maker or several makers, the binary relation
    is a better fit. A suitably restricted domain could make the function
    appropriate.

# Knowledge Representation with FOL Models {.solved}

For this exercise, we are working with an FOL language with the following vocabulary:

+ Constants: $jimmy$, $linus$, $sir$, $lady$, $gran$, $ny$, $london$, $soccer$

+ Predicates: $Loves²$, $IsFrom²$, $ParentOf²$, $LivesIn²$

Now consider the following facts about our protagonist, little Jimmy:

*Little Jimmy and his brother, Linus, are the children of Mr Sir and Lady Dame.
The family lives in New York, where Lady Dame is from. But both Jimmy and his
brother were born in London, where their father is from. The children's paternal
grandmother is Granny Smith, who still lives in London, where she was born. The
children and their grandmother love soccer, unlike their parents.*

1. Represent the information as a FOL model. Specify the model in set-theoretic
   terms, as a knowledge graph, and in table form. Make sure to include the
information about which constant denotes which object.

2. Write the SQL statements that create and populate the relation tables.
   Use the same column order as your model. The DB initialization exercise
   below lets you practice this step with automatic feedback.

3. In logic, there is the concept of a
   [diagram](https://en.wikipedia.org/wiki/Diagram_(mathematical_logic)), which
is, essentially, the idea of collecting all the true atomic sentences and true
negations of atomic sentences in the model. The _positive_ diagram is the set of
only the true atomic sentences, without the true negated ones. Determine the
positive diagram of the model we've just described. Is this essentially
different from any of the other methods of representing the model?

## Solution {#knowledge-representation-with-fol-modelsSolution .solution}

1. These presentations specify the same model. An absent tuple is false;
   this completes the information supplied by the description.

    {{< logic-app name="fol-model" model="family" kind="model" editable="false" view="tables" title="Jimmy's family model" >}}

2. Create one table for each of $Loves$, $IsFrom$, $LivesIn$, and $ParentOf$,
   with two text columns and a composite primary key. Insert the rows shown
   above. Add $Domain(value)$ if queries should range over all eight objects.
   For example:

    {{< sql-app model="family" empty="true" title="Storing the loves relation" >}}
    CREATE TABLE Loves (
        person TEXT NOT NULL,
        object TEXT NOT NULL,
        PRIMARY KEY (person, object)
    );
    INSERT INTO Loves (person, object) VALUES
        ('jimmy', 'soccer'),
        ('linus', 'soccer'),
        ('gran', 'soccer');
    {{< /sql-app >}}

3. It's not really different from any of the previous methods. Here's what we
   get:

    - $Loves(jimmy, soccer)$
    - $Loves(linus, soccer)$
    - $Loves(gran, soccer)$
    - $IsFrom(jimmy, london)$
    - $IsFrom(linus, london)$
    - $IsFrom(sir, london)$
    - $IsFrom(lady, ny)$
    - $IsFrom(gran, london)$
    - $LivesIn(jimmy, ny)$
    - $LivesIn(linus, ny)$
    - $LivesIn(sir, ny)$
    - $LivesIn(lady, ny)$
    - $LivesIn(gran, london)$
    - $ParentOf(sir, jimmy)$
    - $ParentOf(sir, linus)$
    - $ParentOf(lady, jimmy)$
    - $ParentOf(lady, linus)$
    - $ParentOf(gran, sir)$

    Identity contributes $c = c$ for each of the eight constants $c$.
    Distinct constants denote distinct objects in this model.

    The full atomic diagram is much larger, since there are
    plenty of false atoms, like $ParentOf(soccer, ny)$, so their negations
    are all true, including $¬ParentOf(soccer, ny)$.

# Denotation {.solved}

Suppose that we're working with an FOL language that has the single constant
$null$, as well as the function symbols $succ¹$ and $prod²$.

Consider the model whose domain $D = { 0, 1, 2, … }$ is the set of natural
numbers and where:

+ $⟦null⟧ = 0$
+ $⟦succ⟧$ is defined by the equation $⟦succ⟧(n) = n + 1$ for all $n ∈ { 0, 1, 2, … }$.
+ $⟦prod⟧$ is defined by the equation $⟦prod⟧(n, m) = n × m$ for all $n, m ∈ { 0, 1, 2, … }$.

In this model, determine:

$$
⟦prod(succ(null), prod(succ(succ(null)), succ(null)))⟧
$$

Parse the term, then calculate its value from the leaves upward.

## Solution {#denotationSolution .solution}

{{< logic-app name="parser" language="fol" signature="arithmetic" kind="term" formula="prod(succ(null), prod(succ(succ(null)), succ(null)))" title="Parsing the arithmetic term" >}}

The calculation follows the same tree:

| Term $t$ | Value $⟦t⟧$ |
| --- | --- |
| $null$ | $0$ |
| $succ(null)$ | $0 + 1 = 1$ |
| $succ(succ(null))$ | $1 + 1 = 2$ |
| $prod(succ(succ(null)), succ(null))$ | $2 × 1 = 2$ |
| $prod(succ(null), prod(succ(succ(null)), succ(null)))$ | $1 × 2 = 2$ |

# Building models {#building-models}

Build a model in which the formula has the requested truth value. The pictures
identify objects; you choose the constants' denotations and predicate
extensions. An object's appearance imposes no further conditions on the model.
If no model can have the requested truth value, choose Impossible and explain
why. You may use loops in $BiggerThan$: the name alone imposes no restrictions.

{{< logic-app name="fol-practice" exercise="model" model="people-relations" kind="model" view="tables" title="Building FOL models" >}}

# Extensions {#satisfaction}

Select the extension of each formula in Jimmy's family model. The model's
tables show the relevant information; the selection canvas contains the
domain or its product. A selected pair is ordered: its first object supplies
the value of $x$, its second the value of $y$.

{{< logic-app name="fol-practice" exercise="extensions" model="family" title="Selecting extensions" >}}

<span id="satisfactionSolution"></span>

# Extensions and set operations {.solved}

Suppose $A(x)$ and $B(x)$ each have just $x$ free. Prove the following using
the satisfaction clauses. Start with an arbitrary $d ∈ D$ and ask when it
belongs to each side.

1. $⟦A(x) ∧ B(x)⟧ᴹ = ⟦A(x)⟧ᴹ ∩ ⟦B(x)⟧ᴹ$.
2. $⟦A(x) ∨ B(x)⟧ᴹ = ⟦A(x)⟧ᴹ ∪ ⟦B(x)⟧ᴹ$.
3. $⟦¬A(x)⟧ᴹ = D ∖ ⟦A(x)⟧ᴹ$.

## Solution {#extensions-and-set-operationsSolution .solution}

For conjunction, $d ∈ ⟦A(x) ∧ B(x)⟧ᴹ$ iff $M ⊨ A(d) ∧ B(d)$, iff both
$M ⊨ A(d)$ and $M ⊨ B(d)$, iff $d$ belongs to both extensions. This is
membership in their intersection. For disjunction, replace “both” by
“at least one”, giving the union. For negation, $d$ satisfies $¬A$ exactly
when it does not satisfy $A$, giving the complement within $D$.

# DB initialization {#db-initialization}

Create the tables shown in each level and insert exactly their rows. Use the
displayed table and column names, with text identifiers for the objects.
The first levels ask for one relation; the last asks for the whole database,
including $Domain(value)$. Run checks the resulting tables.

{{< logic-app name="fol-practice" exercise="initialize" model="world" title="DB initialization practice" >}}

# SQL queries {#sql-queries .solved}

Translate each formula into a query returning its extension. The database is
already initialized. Quantifiers and free variables range over all 18 objects
in $Domain$, including cities, continents, and languages. Follow the displayed
column order and return each tuple only once.

The levels progress from atoms through the connectives and quantifiers to
compound queries. Work recursively: translate the immediate parts of the
formula, then combine their conditions using the rule for the main operator.
Run checks your answer on this database.

{{< logic-app name="fol-practice" exercise="query" model="world" title="SQL query practice" >}}

## Solution {#sql-queriesSolution .solution}

For $LocatedIn(x, Europe)$, one solution is:

```sql
SELECT DISTINCT d.value AS x
FROM Domain AS d
WHERE EXISTS (
    SELECT 1 FROM LocatedIn AS r
    WHERE r.country = d.value AND r.continent = 'Europe'
);
```

This returns France, the United Kingdom, and Greece. For $x = Japan$, replace
the condition by `d.value = 'Japan'`. To negate an atom, put `NOT` before its
`EXISTS` test. Translate conjunction and disjunction by combining the complete
conditions with `AND` and `OR`; use `(NOT a) OR b` for implication and
`(a AND b) OR ((NOT a) AND (NOT b))` for the biconditional.

For $∃y CapitalOf(y, x)$, search for a value of $y$:

```sql
SELECT DISTINCT d.value AS x
FROM Domain AS d
WHERE EXISTS (
    SELECT 1 FROM Domain AS e
    WHERE EXISTS (
        SELECT 1 FROM CapitalOf AS c
        WHERE c.country = e.value AND c.capital = d.value
    )
);
```

The answer contains the five capitals. For a universal quantifier, search for
a counterexample with `NOT EXISTS (... WHERE NOT (...))`. Each further
quantifier adds its own domain alias. The worked universal query and the
nested European-capital query in the textbook illustrate the remaining steps.

A successful run establishes agreement on the displayed database. A correct
translation must return the formula's extension in every database with this
language and these conventions; explain why your construction does so.

# Queries with JOIN {.solved}

SQL offers shorter ways to express some queries. In the country database,
use `JOIN LocatedIn ON CapitalOf.country = LocatedIn.country` to combine
rows that agree on the country. Add a `WHERE` condition to return just
the European capitals. Compare the result with the recursive translation
of $∃y (CapitalOf(y, x) ∧ LocatedIn(y, Europe))$.

{{< sql-app model="world" title="Trying a join" >}}
SELECT DISTINCT CapitalOf.capital
FROM CapitalOf;
{{< /sql-app >}}

## Solution {#queries-with-joinSolution .solution}

The join supplies the shared country; the condition restricts its continent:

{{< sql-app model="world" title="Joining countries and capitals" >}}
SELECT DISTINCT CapitalOf.capital
FROM CapitalOf
JOIN LocatedIn ON CapitalOf.country = LocatedIn.country
WHERE LocatedIn.continent = 'Europe';
{{< /sql-app >}}


# Requiring an infinite model {#requiring-an-infinite-model .solved}

Use a language with one binary predicate $<$, written between its arguments.
Its interpretation need not be the usual less-than relation.

1. In the standard number model, $D = ℕ$ and $⟦<⟧$ is the usual less-than
   relation. Explain why $∀x ∃y (x < y)$ is true. Given a value $n$ for $x$,
   which value can you choose for $y$?
2. Find a *finite* model of the same sentence. Try one object first. Which
   ordered pairs must belong to $⟦<⟧$? Why does the predicate's name not
   prevent this interpretation?
3. Add the requirement that $<$ is **irreflexive**: nothing is related to
   itself. Write it as a formula. Can two objects still give a finite model
   of both sentences? Draw its arrows.
4. Also require **transitivity**: if $x < y$ and $y < z$, then $x < z$.
   Write this as a formula. What does transitivity do to a cycle of arrows?
   Why does irreflexivity then rule the cycle out?
5. Collect your three sentences into a knowledge base. Explain why it has
   an infinite model but no finite model. Hint: keep following the witnesses
   supplied by the first sentence. What must happen in a finite domain?

## Solution {#requiring-an-infinite-modelSolution .solution}

1. For each $n ∈ ℕ$, choose $n + 1$. This gives a witness for the existential
   quantifier, whatever value the universal quantifier supplies.
2. Take $D = {d}$ and $⟦<⟧ = {[d, d]}$. The only object supplies its own
   witness. FOL imposes no ordering conditions on a predicate just because
   we write it as $<$.
3. Irreflexivity is $∀x ¬(x < x)$. The two-object model with
   $⟦<⟧ = {[d, e], [e, d]}$ satisfies this and $∀x ∃y (x < y)$.
   Each object has a successor, and neither is related to itself.
4. Transitivity is $∀x ∀y ∀z ((x < y ∧ y < z) → x < z)$.
   Repeatedly applying it to a cycle gives a relation from its starting
   object back to itself, contradicting irreflexivity.
5. The knowledge base is:

    $$
    {∀x ∃y (x < y), ∀x ¬(x < x), ∀x ∀y ∀z ((x < y ∧ y < z) → x < z)}.
    $$

    The standard number model satisfies all three sentences. In a finite
    nonempty domain, repeatedly choosing a successor eventually revisits
    an object. That creates a cycle, which the other two sentences exclude.
    So every model of this knowledge base is infinite.
