---
title: Many-valued logics
author: Johannes Korbmacher
weight: 100
params:
  last_edited: "13/10/2026"
  id: txt-mv
---

# Many-valued logics

{{< img src="/img/drawings/mv_ai_warm.svg" class="rounded float-end inert-img img-fluid m-2" width="130px" >}}
In classical logic, we assume that every formula is either true or false. This
is the principle of {{< term "bivalence" "bivalence" >}}. While it is a useful
assumption in many contexts, it is an
[idealization](https://en.wikipedia.org/wiki/Idealization_(philosophy_of_science))
in others. Think, for example, of vague concepts, like *warmth*. Is 25°C warm?
What about 21, 20, or 19°C? Is there a clear cut-off point? If it is at 20°C,
does that mean that 19.999°C is no longer warm? It seems more natural to say
that warmth comes in *degrees*.

Incomplete information gives us another reason to reconsider bivalence.
Suppose our database doesn't tell us which language is spoken in a country.
We can't conclude that Dutch is spoken there, but we can't conclude that it
isn't either. How should a query handle this? Examples like these motivate
{{< term "many-valued-logic" "many-valued logics" >}}, which abandon the {{< term "bivalence" "bivalence" >}} in of {{< chapter_ref chapter="boolean" >}}Boolean algebra{{< /chapter_ref >}} and allow additional truth-values to enter the picture.

In this chapter, we'll explore two such logics. The first system is so-called
*(Strong) Kleene logic*, which is a three-valued logic logic for handling
incomplete or missing information. As we'll see, Kleene logic describes
precisely what's going on in SQL queries when the underlying database is
incomplete. The second system is so-called *fuzzy logic*, which lets us reason
with degrees of truth, such as it being more or less warm, more or less humid,
and so forth. This logic, we'll see, is at work in some interesting [control
systems](https://en.wikipedia.org/wiki/Control_system). For example, we'll use
it to describe how a heater or an air conditioner should respond to its
measurements.

{{< callout type="objectives" >}}
After studying this chapter, you will be able to:

- Distinguish missing information from graded membership.
- Calculate Kleene truth-values and explain SQL queries involving `NULL`.
- Use Kleene models to test inferences and construct natural deduction proofs.
- Calculate and modify fuzzy predicate interpretations, and test fuzzy inferences.
- Check fuzzy rules and calculate the output of a simple fuzzy controller.

{{< /callout >}}

## Kleene algebra

To motivate Kleene's logic, let's think about databases again. A database's can
contain entities without including them in every table, without representing
_all_ information about them. SQL uses
[NULL](https://en.wikipedia.org/wiki/Null_(SQL)) for a missing value. To
illustrate, let's return to the country database from {{< chapter_ref
chapter="fol" >}}first-order logic{{< /chapter_ref >}}. Here we've added
Zimbabwe and its capital, Harare, but left the language entry empty. The
omission is in our data; it says nothing about Zimbabwe's actual languages.

{{< sql-app title="A database with a missing value" setup="kleene-countries" >}}
SELECT country, capital FROM CapitalOf;
SELECT country, continent FROM LocatedIn;
SELECT country, language FROM LanguageOf;
{{< /sql-app >}}

As you can see when running the above query, the query returns `NULL` for the
language of Zimbabwe.

Things get interesting, when we start querying the database using complex
queries. Suppose we ask which entries list Dutch as their language. As
expected, we obtain the Netherlands, but not Zimbabwe. Now negate the
condition: we look for entries whose language isn't Dutch. The Netherlands no
longer appears, but Zimbabwe still isn't there. Why?

{{< sql-app title="Comparing a missing value" setup="kleene-countries" >}}
SELECT country FROM LanguageOf
WHERE (language = 'Dutch');

SELECT country FROM LanguageOf
WHERE NOT (language = 'Dutch');
{{< /sql-app >}}

The information about Zimbabwe's language is missing. For that entry,
`language = 'Dutch'` returns `NULL`, and so does its negation. A `WHERE`
clause keeps only rows whose condition is true, so both queries leave out
Zimbabwe. Also, a row listing German tells us that *this entry* isn't Dutch.
It doesn't tell us that nobody in Germany speaks Dutch: a country can have
several languages.

### The Kleene functions

{{< img src="/img/drawings/mv_db_understand.svg" class="rounded float-end inert-img img-fluid m-2" width="170px" >}}
The truth-functions at work in SQL are due to [Stephen
Kleene](https://en.wikipedia.org/wiki/Stephen_Cole_Kleene) --- whence the name "Kleene logic". The idea is that in
order to model unknown information logically, we keep $0$ and $1$ from Boolean
algebra and add a third value $ω$, which we read "unknown". We treat it as an
undecided value: it could be $0$ or $1$, but we don't know which.

For negation, this is straightforward. If we don't know whether something is
the case, we don't know whether it isn't the case either. So negating an
unknown value leaves it unknown.

For conjunction, suppose one input is unknown. If the other is false, we
already know that the conjunction is false: both would have to be true.
If the other is true, the answer depends on the unknown input, so it remains
unknown. Two unknown inputs likewise give an unknown answer.

For disjunction, a true input settles the answer: at least one input is true,
whatever the other turns out to be. But a false input leaves the answer to
the unknown one. Again, two unknown inputs leave us without a settled answer.
We can write these choices using two familiar functions:
{{< term "minimum" "min" >}} picks the smaller input, and
{{< term "maximum" "max" >}} picks the larger. For example,
$min(0,1)=0$ and $max(0,1)=1$. With $ω$ placed between $0$ and $1$,
these functions give us the conjunction and disjunction tables:

{{< callout type="definition" title="Kleene operations" >}}
The {{< term "kleene-values" "Kleene values" >}} are $0$, $ω$, and $1$.
With the ordering $0 &lt; ω &lt; 1$, the
{{< term "kleene-operations" "strong Kleene operations" >}} are:

$$
~!NOT!~ 0 = 1,   ~!NOT!~ ω = ω,   ~!NOT!~ 1 = 0
$$

$$
X ~!AND!~ Y = min(X,Y),   X ~!OR!~ Y = max(X,Y).
$$
{{< /callout >}}

Here are their function tables:

<div class="function-tables kleene-tables">

{{< function-table name="NOT" >}}
{"rows":["0","ω","1"],"columns":[""],"values":[["1"],["ω"],["0"]]}
{{< /function-table >}}

{{< function-table name="AND" >}}
{"rows":["0","ω","1"],"columns":["0","ω","1"],"values":[["0","0","0"],["0","ω","ω"],["0","ω","1"]]}
{{< /function-table >}}

{{< function-table name="OR" >}}
{"rows":["0","ω","1"],"columns":["0","ω","1"],"values":[["0","ω","1"],["ω","ω","1"],["1","1","1"]]}
{{< /function-table >}}

</div>

Restrict the inputs to $0$ and $1$ and we recover the Boolean function tables.
For numerical calculations, we can represent $ω$ by $0.5$. The tables
then use the numbers $0$, $0.5$, and $1$, with negation given by
$~!NOT!~ X = 1 − X$, conjunction by $min$, and disjunction by $max$.
This gives unknown information a numerical label; it still means that
we don't know whether the claim is true.

In SQLite, we can calculate these operations using `0`, `NULL`, and `1`.
We first put the three values in a table. For operations with two inputs,
we also list their nine possible pairs:

{{< sql-app title="Initializing Kleene values" empty="true" >}}
CREATE TABLE TruthValues (value INTEGER);
INSERT INTO TruthValues VALUES (0), (NULL), (1);

CREATE TABLE ValuePairs (X INTEGER, Y INTEGER);
INSERT INTO ValuePairs VALUES
  (0, 0),    (0, NULL),    (0, 1),
  (NULL, 0), (NULL, NULL), (NULL, 1),
  (1, 0),    (1, NULL),    (1, 1);

SELECT X, Y FROM ValuePairs;
{{< /sql-app >}}

The following queries start with these tables already filled. Each calculates
one operation, placing the result alongside its inputs:

{{< sql-app title="Kleene truth-functions in SQL" setup="kleene-values" >}}
SELECT value AS X, NOT value AS "NOT X" FROM TruthValues;

SELECT X, Y, X AND Y AS "X AND Y" FROM ValuePairs;

SELECT X, Y, X OR Y AS "X OR Y" FROM ValuePairs;
{{< /sql-app >}}

### Absence and negation

This also explains a choice we made when translating FOL in
{{< chapter_ref chapter="fol" >}}first-order logic{{< /chapter_ref >}}.
We used `NOT EXISTS` to express negation. Why didn't we just negate the
condition with `NOT`? Consider the query for countries with no recorded
Dutch-language entry:

{{< sql-app title="No recorded match" setup="kleene-countries" >}}
SELECT country FROM CapitalOf AS c
WHERE NOT EXISTS (
  SELECT 1 FROM LanguageOf AS l
  WHERE l.country = c.country AND l.language = 'Dutch'
);
{{< /sql-app >}}

Zimbabwe now appears. `EXISTS` asks whether the inner query returns a row,
so its answer is always true or false, even when the database contains
`NULL`. The outer `NOT` therefore also gets a classical value. This is why
our translation used existence tests: they make membership in a query's
answer a bivalent matter. SQL's `NOT`, `AND`, and `OR` themselves follow
Kleene's tables. Applying them directly to comparisons with missing values
can give unknown answers, as our first queries showed.

In AI, there are two ways of thinking about negation, depending on how we
deal with incomplete data. Under the
{{< term "open-world-assumption" "open-world assumption" >}}, a missing fact
isn't automatically false. The world is "open" in the sense that our database
doesn't settle all the facts about it. Under the
{{< term "closed-world-assumption" "closed-world assumption" >}}, we treat
facts not recorded in the database as false. The query above uses this second
approach for recorded language facts: having no Dutch entry is enough to
qualify, even if the language entry is missing.

An open-world assumption doesn't require a particular logic. We can use
classical logic to consider several possible completions of our information,
or represent unknown information with K₃. The answers can differ: every
classical completion makes $A ∨ ¬A$ true, while K₃ gives it $ω$ when
$A$ is unknown.

### The Kleene laws

Many of the laws from {{< chapter_ref chapter="boolean" >}}Boolean
algebra{{< /chapter_ref >}} survive. We can still rearrange conjunctions and
disjunctions, distribute one over the other, cancel double negation, and use
De Morgan's laws. What fails is the Boolean step that settles an unknown input
by combining it with its negation:

$$
ω ~!OR!~ ~!NOT!~ ω = ω,   ω ~!AND!~ ~!NOT!~ ω = ω.
$$

Here are the algebraic laws we'll use. Swapping
$~!AND!~$ and $~!OR!~$ gives the companion law, with $0$ and $1$ swapped too.

| Law | Identity |
| --- | --- |
| Associativity | $X ~!AND!~ (Y ~!AND!~ Z) = (X ~!AND!~ Y) ~!AND!~ Z$ |
| Commutativity | $X ~!AND!~ Y = Y ~!AND!~ X$ |
| Absorption | $X ~!AND!~ (X ~!OR!~ Y) = X$ |
| Distributivity | $X ~!AND!~ (Y ~!OR!~ Z) = (X ~!AND!~ Y) ~!OR!~ (X ~!AND!~ Z)$ |
| Identity | $X ~!AND!~ 1 = X$ |
| Domination | $X ~!AND!~ 0 = 0$ |
| Involution | $~!NOT!~ ~!NOT!~ X = X$ |
| De Morgan | $~!NOT!~ (X ~!AND!~ Y) = (~!NOT!~ X) ~!OR!~ (~!NOT!~ Y)$ |
| Kleene condition | $(X ~!AND!~ ~!NOT!~ X) ~!AND!~ (Y ~!OR!~ ~!NOT!~ Y) = X ~!AND!~ ~!NOT!~ X$ |

For a short derivation, simplify $~!NOT!~ (X ~!AND!~ (X ~!OR!~ Y))$.
We could use absorption immediately, but pushing the negations inward gives
us another route to the same answer:

{{< logic-app name="boolean" kind="derivation" logic="k3" preset="absorption" title="A Kleene derivation" >}}

Each line is an equation. We start with De Morgan, then rewrite the
right-hand side using De Morgan again and absorption. These identities hold
for all inputs, including $ω$.

### SQL as a SAT solver

We can use SQL to search for a counterexample to an equation.
`ValuePairs` supplies all inputs, and `WHERE` selects the pairs at which
its two sides disagree. This is a satisfiability search: we ask whether any
row meets the condition that the two results differ.

In SQL, `<>` means "not equal". But `NULL <> 1` returns `NULL`, so
`WHERE` would discard that row. We use SQLite's `IS NOT` instead:
`NULL IS NOT 1` is true, while `NULL IS NOT NULL` is false. This lets
us compare unknown results as well as $0$ and $1$.

Here are two valid identities followed by two failed Boolean identities:

{{< sql-app title="Checking a Kleene identity" setup="kleene-values" >}}
-- Our derived identity
SELECT X, Y FROM ValuePairs
WHERE (NOT (X AND (X OR Y))) IS NOT (NOT X);

-- De Morgan
SELECT X, Y FROM ValuePairs
WHERE (NOT (X OR Y)) IS NOT ((NOT X) AND (NOT Y));

-- Excluded middle
SELECT value AS X FROM TruthValues
WHERE (value OR NOT value) IS NOT 1;

-- Complementation for AND
SELECT value AS X FROM TruthValues
WHERE (value AND NOT value) IS NOT 0;
{{< /sql-app >}}

The first two queries return no rows: the equations hold for every input.
Each of the last two returns `NULL`, our counterexample $X=ω$. So the same
method both verifies identities and shows us where a proposed identity fails.
Each input can take three values. So two inputs require $3²=9$ rows;
three inputs require $3³=27$. This is the same counting we used for
{{< chapter_ref chapter="sat" id="truth-tables" >}}truth-tables{{< /chapter_ref >}},
with three choices at each position instead of two.

## Kleene logic — K3 {#kleene-logic--k3}

So far, we've used Kleene algebra to calculate with missing information in
a database. Can we also use it to reason from incomplete information? As in
{{< chapter_ref chapter="boolean" >}}Boolean algebra{{< /chapter_ref >}},
we interpret formulas using our operations and ask which inferences preserve
truth. Think of a weather report that can confirm, rule out, or leave open
each of $SUN$ and $RAIN$. There are now $3²=9$ possible information states,
where the Boolean model space had four.

{{< callout type="definition" title="K₃ models and valuations" >}}
A {{< term "kleene-model" "K₃ model" >}} assigns each propositional variable
one of $0$, $ω$, and $1$. Its {{< term "valuation" "valuation" >}} extends
recursively to formulas:

$$
v(¬A) = ~!NOT!~ v(A)
$$

$$
v(A ∧ B) = v(A) ~!AND!~ v(B)
$$

$$
v(A ∨ B) = v(A) ~!OR!~ v(B).
$$
{{< /callout >}}

Only $1$ counts as true. We call it the
{{< term "designated-value" "designated value" >}}. A formula's
{{< term "proposition" "proposition" >}} is the set of models where it has that
value. An unknown formula belongs to neither its own proposition nor its
negation's proposition. So negation no longer corresponds to taking the
complement of a set of models.

{{< callout type="definition" title="K₃ consequence" >}}
An inference $P₁, …, Pₙ ⊨ C$ is valid exactly when every K₃ model that
assigns $1$ to all its premises also assigns $1$ to its conclusion.
A {{< term "countermodel" "countermodel" >}} assigns $1$ to all premises and
either $0$ or $ω$ to the conclusion.
{{< /callout >}}

Consider {{< term "disjunctive-syllogism" "disjunctive syllogism" >}}.
If $¬SUN$ has value $1$, then $SUN$ has value $0$. For $SUN ∨ RAIN$ to
have value $1$, $RAIN$ must therefore have value $1$. The inference survives.
The green worlds below satisfy the premises; red worlds are countermodels.

{{< logic-app name="many-valued" kind="models" title="Kleene model space" >}}

### Excluded middle and explosion

If $v(SUN) = ω$, then $v(SUN ∨ ¬SUN) = ω$. This is a countermodel to
[excluded middle](https://en.wikipedia.org/wiki/Law_of_excluded_middle). In fact, assigning $ω$ to
every variable gives $ω$ to every formula built using just $¬$, $∧$, and $∨$:
each operation returns $ω$ when all its inputs are $ω$. There are no
{{< term "tautology" "tautologies" >}} in that language. Adding truth constants
would change this claim: a constant $⊤$ interpreted as $1$ would be a tautology.

Nevertheless, {{< term "explosion" "explosion" >}} still holds:

{{< inference rule="Explosion" >}}
$A$
$¬A$
---
$C$
{{< /inference >}}

No valuation gives both premises $1$. Thus there cannot be a countermodel,
whatever $C$ says. Don't confuse this with claiming that $A ∧ ¬A$ always has
value $0$: it has value $ω$ when $A$ does. Validity only asks what happens
when *all premises have value $1$*.

We can also retain {{< term "modus-ponens" "modus ponens" >}} by defining
$A → B$ as $¬A ∨ B$. If $A$ and this conditional both have value $1$,
then $B$ must have value $1$. But $A → A$ is unknown when $A$ is unknown.
The truth-function by itself doesn't justify all the proof rules we previously
used for a conditional.

### Natural deduction for K₃

We can also reason in K₃ by constructing derivations. As in
{{< chapter_ref chapter="proofs" >}}natural deduction{{< /chapter_ref >}},
the idea is to start from assumptions and apply rules that preserve truth.
But we have to check those rules against the new semantics. For example,
conjunction introduction still works: if both conjuncts have value $1$, their
minimum is $1$ too. Conditional introduction is more problematic. We can
certainly derive $A$ from the assumption $A$, but discharging that assumption
to infer $A → A$ would give us a formula which is unknown when $A$ is unknown.

Here are the classical discharge rules that fail. In each diagram, the
bracketed formula is a temporary assumption, and $⋮$ stands for a derivation
under that assumption. The rule would discharge it:

{{< inference-rules caption="Classical rules that fail in K₃" >}}
[
 {"name":"Conditional introduction","premises":["$[A]$","$⋮$","$B$"],"conclusion":"$A → B$","invalid":true,"explanation":"Take $B = A$. The conclusion $A → A$ has value $ω$ when $A$ does."},
 {"name":"Negation introduction","premises":["$[A]$","$⋮$","$B ∧ ¬B$"],"conclusion":"$¬A$","invalid":true,"explanation":"Take $A = B ∧ ¬B$. Discharging it gives $¬(B ∧ ¬B)$, which has value $ω$ when $B$ does."},
 {"name":"Classical reductio","premises":["$[¬A]$","$⋮$","$B ∧ ¬B$"],"conclusion":"$A$","invalid":true,"explanation":"Let $A$ be $C ∨ ¬C$. Its negation gives $¬C ∧ ¬¬C$ by De Morgan. Reductio would infer excluded middle, even when $C$ is unknown."}
]
{{< /inference-rules >}}

For the language with $¬$, $∧$, and $∨$, we can use the following
rules. We keep conjunction
introduction and elimination, disjunction introduction, and proof by cases.
For negation, we use double negation and De Morgan's laws in both directions.
Finally, we can infer any formula from premises $A$ and $¬A$ by explosion,
in either order.

{{< logic-app name="deduction" kind="rules" logic="k3" title="K₃ rules" >}}

Double negation is particularly worth looking at. In our classical system,
we derived $A$ from $¬¬A$ using proof by contradiction. Here, DN permits
that step directly, as well as the reverse step from $A$ to $¬¬A$.
The semantics justifies both directions: negation exchanges $0$ and $1$ and
leaves $ω$ unchanged, so applying it twice brings us back to the value we
started with. De Morgan's rules likewise preserve the exact value of a formula.
For example, $¬(SUN ∨ RAIN)$ and $¬SUN ∧ ¬RAIN$ agree at all nine
points of our logical space.

To derive disjunctive syllogism, begin with $SUN ∨ RAIN$ and $¬SUN$.
The disjunction gives us two cases. In the $SUN$ case, we can infer $RAIN$ from $SUN$ and $¬SUN$ by explosion. In the $RAIN$ case,
we already have what we need. Disjunction elimination then discharges the
two case assumptions and gives us $RAIN$ from our original premises.

{{< logic-app name="deduction" kind="worked" logic="k3" example="k3-ds" deck="examples" title="K₃ derivations" >}}

The same strategy derives material modus ponens. Write its premises as
$¬SUN ∨ RAIN$ and $SUN$, and take cases on the disjunction. In one
branch, $SUN$ and $¬SUN$ give us explosion; in the other, we have $RAIN$
already. This lets us use a material conditional in a proof by expanding its
definition. You can construct these proofs in the
[derivation exercises](/exercises/many-valued/#k3-derivations).

{{< callout type="theorem" title="Soundness and completeness for K₃" >}}
For formulas built from propositional variables using $¬$, $∧$, and $∨$,
these rules derive $C$ from premises $Γ$ exactly when $Γ ⊨ C$.
{{< /callout >}}

So, we have the same correspondence between derivations and valid inferences
that we had classically, with a different set of rules. Lean can help check
these derivations too, provided we first define the K₃ truth-values and rules
in Lean. Its ordinary $Prop$ connectives have their usual meaning: Lean will
prove $A → A$, even without classical reasoning. Using Lean to study K₃
therefore requires us to state which logic we're formalizing.

### Finding countermodels with SQL

Recall the reduction from inference checking to `SAT` in
{{< chapter_ref chapter="sat" >}}SAT solving{{< /chapter_ref >}}: an inference
is valid if there is no model satisfying all premises while falsifying the
conclusion. Classically, we looked for a satisfying assignment for
$P₁ ∧ … ∧ Pₙ ∧ ¬C$.

In K₃, a countermodel can also make $C$ unknown. Then $¬C$ is unknown
too, so simply testing that conjunction for truth would miss it. Instead,
we search for rows where every premise *is true* and the conclusion
*is not true*. The SQL tests `IS TRUE` and `IS NOT TRUE` express exactly
these conditions. Checking consequence thus becomes a search for a row
satisfying a Boolean SQL condition.

We can run this search over a
{{< chapter_ref chapter="sat" id="truth-tables" >}}truth-table{{< /chapter_ref >}}.
Each row of `ValuePairs` supplies one of the nine K₃ assignments. We copy
these pairs into a table whose column names match our propositional variables:

{{< sql-app title="Initializing Kleene valuations" setup="kleene-pairs" >}}
CREATE TABLE Valuations (SUN INTEGER, RAIN INTEGER);
INSERT INTO Valuations
  SELECT X, Y FROM ValuePairs;

SELECT SUN, RAIN FROM Valuations;
{{< /sql-app >}}

Here `INSERT INTO … SELECT …` copies the selected rows into the new table.
Its two columns give $v(SUN)$ and $v(RAIN)$. The following queries start
with this table already filled. They search for countermodels to disjunctive
syllogism, excluded middle, affirming the consequent, and modus ponens:

{{< sql-app title="Kleene countermodels" setup="kleene-values" >}}
-- SUN ∨ RAIN, ¬SUN ∴ RAIN
SELECT SUN, RAIN FROM Valuations
WHERE (SUN OR RAIN) IS TRUE
  AND (NOT SUN) IS TRUE
  AND RAIN IS NOT TRUE;

-- ∴ SUN ∨ ¬SUN
SELECT SUN, RAIN FROM Valuations
WHERE (SUN OR NOT SUN) IS NOT TRUE;

-- SUN → RAIN, RAIN ∴ SUN
SELECT SUN, RAIN FROM Valuations
WHERE (NOT SUN OR RAIN) IS TRUE
  AND RAIN IS TRUE
  AND SUN IS NOT TRUE;

-- SUN → RAIN, SUN ∴ RAIN
SELECT SUN, RAIN FROM Valuations
WHERE (NOT SUN OR RAIN) IS TRUE
  AND SUN IS TRUE
  AND RAIN IS NOT TRUE;
{{< /sql-app >}}

The first and last queries return no rows, confirming the valid inferences.
Excluded middle fails at the three rows with $v(SUN)=ω$; affirming the
consequent fails when $RAIN$ is true and $SUN$ is false or unknown.

For satisfiability, we instead look for rows that make the formula true:
`SELECT * FROM Valuations WHERE (SUN AND NOT SUN) IS TRUE;` returns none.
This also verifies explosion: there is no model in which both $SUN$ and
$¬SUN$ are true, whatever conclusion we choose.

## Fuzzy predicates

Taking missing information as our reason to give up bivalence led us to K₃:
a formula can be true, false, or unknown. Now return to
[vagueness](https://en.wikipedia.org/wiki/Vagueness). We might know the exact
temperature of a room and still hesitate to call it warm. Knowing more won't
settle where warmth begins. A natural way of thinking about it is to say that
warmth comes in degrees,
which we can measure by a number between $0$—definitely not warm—and
$1$—definitely warm. A temperature with degree $0.75$ fits our idea of
warmth quite well, while one with degree $0.1$ barely qualifies.

If we take this idea seriously and work with three predicates $IsCold$,
$IsWarm$, and $IsHot$, we can assign them degrees when applied to a
temperature. This is the idea of
{{< term "fuzzy-predicate" "fuzzy predicates" >}}. The bivalent predicates
of classical FOL are also called {{< term "crisp-predicate" "crisp predicates" >}}:
an object either belongs to their extension or doesn't. A fuzzy interpretation
records how strongly the predicate applies to each object.

[Lotfi Zadeh](https://en.wikipedia.org/wiki/Lotfi_A._Zadeh) introduced
[fuzzy sets](https://en.wikipedia.org/wiki/Fuzzy_set) to describe this kind of
graded membership. They give us a way of representing properties such as
warmth, speed, or proximity without first choosing a sharp boundary. This is
useful in AI systems that need to work with descriptions like "the car is
moving fast" or "the room is a bit cold". A
[fuzzy control system](https://en.wikipedia.org/wiki/Fuzzy_control_system)
can use these descriptions to adjust a brake or a heater. We'll work through
the heater example, but first we need to say how to interpret the descriptions.

For this purpose, we'll use the language of FOL without quantifiers or
function symbols. We take the domain to be the
[real numbers](https://en.wikipedia.org/wiki/Real_number), written $ℝ$: the
numbers on the continuous number line, including whole numbers, fractions,
and numbers such as $√2$. For now, we interpret them as temperatures in °C.
Later, other predicates will use numbers as humidity levels or fractions of
full power. We can use one mathematical domain for all these measurements;
the predicate and its units tell us what a number measures.

An atomic sentence such as $IsWarm(15°C)$ names a temperature and describes
it. We can also form open formulas such as $IsWarm(x) ∨ IsCold(x)$.
The interpretations of the predicates will be functions over our domain.

{{< callout type="definition" title="Fuzzy interpretations" >}}
A {{< term "fuzzy-model" "fuzzy model" >}} has a nonempty domain $D$, a
denotation in $D$ for each constant, and a
{{< term "membership-function" "membership function" >}}
$⟦P⟧ : Dⁿ → [0,1]$ for each $n$-place predicate $P$.
For an atomic sentence:

$$
v(P(c₁,…,cₙ)) = ⟦P⟧(⟦c₁⟧,…,⟦cₙ⟧).
$$
{{< /callout >}}

For example, $⟦IsWarm⟧(15°C)=0.5$ says that 15°C is warm to degree
$0.5$ in this model. To find the value of $IsWarm(15°C)$, we look up
the temperature named by the constant and apply the membership function.
This follows the same pattern as the atomic satisfaction clause in
{{< chapter_ref chapter="fol" >}}first-order logic{{< /chapter_ref >}},
with a degree as the result. For open formulas, we assign values to the free
variables just as in FOL.

{{< callout type="note" title="Modeling assumptions: warmth" >}}
The diagram shows the interval from 0°C to 30°C. Beyond it, we keep the
endpoint degrees constant. The curves for $IsCold$,
$IsWarm$, and $IsHot$ are modeling choices. Their degrees describe how well a
temperature fits a predicate. The measured temperature itself is taken as
given. The predicates may overlap, and their degrees needn't add up to $1$.
{{< /callout >}}

The so-called *membership curve* makes these choices
visible: its horizontal ($x$-axis) axis runs
through the temperatures, and its height ($y$-axis)
gives the degree at each temperature. So, for
example, a plateau at height $1$ represents
temperatures that are fully cold. A slope describes
how coldness gradually falls off. We could choose a
steeper slope, move the plateau, or allow cold and
warm to overlap more. Those changes, then, give us
different models of the same vocabulary.

{{< logic-app name="many-valued" kind="memberships" title="Editing fuzzy memberships" >}}

### Combining degrees

How should we interpret a complex description such as "warm or cold"?
At each temperature, we already have a degree of warmth and a degree of
coldness. For the disjunction, we can take the larger of the two: the
temperature fits at least one description to that degree. For a conjunction,
we can take the smaller degree, since both descriptions must apply. For
negation, we subtract the degree from $1$.

These are often called the {{< term "zadeh-operations" "Zadeh operations" >}},
after their use in fuzzy set theory. The operations themselves were already
known in the many-valued logics of
[Łukasiewicz](https://en.wikipedia.org/wiki/%C5%81ukasiewicz_logic) and others.
They extend the Boolean operations to the whole interval $[0,1]$:

{{< callout type="definition" title="Zadeh operations" >}}
The Zadeh operations extend valuations to compound formulas by:

$$
v(¬A) = 1-v(A)
$$

$$
v(A ∧ B) = min(v(A),v(B))
$$

$$
v(A ∨ B) = max(v(A),v(B)).
$$
{{< /callout >}}

Suppose that, at a particular temperature, $IsWarm$ has degree $0.7$ and
$IsHot$ has degree $0.2$. Then $¬IsHot$ has degree $0.8$, and "warm
and not hot" has degree $min(0.7,0.8)=0.7$. We can carry out the same
calculation at every temperature. The result is another membership curve:
the interpretation of the complex open formula.

{{< logic-app name="many-valued" kind="predicates" title="Fuzzy predicate interpretations" >}}

Negation turns the height of each point into its distance from $1$.
Conjunction follows the lower of its two curves, and disjunction follows the
upper one. This also explains why $IsCold$ needn't agree with $¬IsWarm$.
The first has its own interpretation; the second is calculated from the
interpretation of $IsWarm$.

If we restrict the values to $0$ and $1$, we recover the Boolean tables.
Restricting them to $0$, $0.5$, and $1$ gives the same tables as K₃,
with $0.5$ in place of $ω$. But the interpretations of the intermediate
value differ: in our temperature model, $0.5$ tells us how well a measured
temperature fits a predicate. An unknown measurement would require us to
represent missing information as well.

## Fuzzy logic

Fuzzy predicates let us describe a room. Fuzzy logic asks what we can infer
from those descriptions. For example, if a temperature is cold to degree
$0.8$, it must be cold *or* warm to at least that degree: taking a maximum
can't lower the value. Similarly, a temperature which is cold *and* windy
to degree $0.6$ must be cold to at least degree $0.6$.

This suggests a notion of inference that preserves degrees. If all our
premises hold to some degree, our conclusion should hold to at least that
degree. With several premises, the lowest premise value gives the bound
we can guarantee.

{{< callout type="definition" title="Degree-preserving consequence" >}}
For finitely many premises, a
{{< term "degree-preserving-consequence" "degree-preserving inference" >}} $P₁,…,Pₙ ⊨ C$ is valid exactly when, in every fuzzy model and under every
assignment,

$$
min(v(P₁),…,v(Pₙ)) ≤ v(C).
$$

With no premises, the required lower bound is $1$.
{{< /callout >}}

We can relate this to our usual definition of validity. Pick any threshold
$r$ between $0$ and $1$. Whenever every premise reaches that threshold,
the conclusion must reach it too. The definition requires this for *every*
threshold, so an inference can't turn premises with value $0.8$ into a
conclusion with value $0.3$, even though neither value is fully true.

### Logical laws

Several familiar inferences work exactly as we'd hope. Conjunction
elimination is valid because $min(v(A),v(B)) ≤ v(A)$, and likewise for
$B$. Conjunction introduction is valid because the value of $A ∧ B$ is
exactly the minimum of its premises. Disjunction introduction is valid
because $v(A) ≤ max(v(A),v(B))$.

The algebraic laws of double negation, De Morgan, and distributivity also
hold for the Zadeh operations. For instance, applying negation twice gives
$1-(1-v(A))=v(A)$, and:

$$
1-max(v(A),v(B)) = min(1-v(A),1-v(B)).
$$

This identity tells us that $¬(A ∨ B)$ and $¬A ∧ ¬B$ always have the
same degree. Each therefore entails the other. We can use these equivalences
to simplify fuzzy descriptions, much as we simplified Boolean and Kleene
expressions earlier.

There are also failures. If $v(A)=0.5$, excluded middle has value
$max(0.5,0.5)=0.5$, so it isn't a logical truth. And unlike in K₃,
explosion fails. Take $v(A)=0.5$ and $v(B)=0$. Both premises $A$ and
$¬A$ have degree $0.5$, while $B$ has degree $0$:

$$
min(v(A),v(¬A)) = 0.5 > 0 = v(B).
$$

The same values give a counterexample to disjunctive syllogism. $¬A$ and
$A ∨ B$ both have degree $0.5$, but $B$ still has degree $0$. This is
why we have to check inference separately from the tables of the operations.
K₃ and our fuzzy models agree on the calculations with $0$, $0.5$, and
$1$; their consequence relations ask different things of those values.

### Łukasiewicz implication

There is a useful way to express the inequality in the consequence definition
inside the language. [Łukasiewicz implication](https://en.wikipedia.org/wiki/%C5%81ukasiewicz_logic)
assigns the conditional the value:

$$
v(A → B) = min(1, 1-v(A)+v(B)).
$$

This value is $1$ exactly when $v(A) ≤ v(B)$. If the antecedent exceeds
the consequent by $0.2$, the conditional has value $0.8$; if the consequent
meets or exceeds the antecedent, the conditional is fully true. So we can
express degree-preserving consequence by requiring
$(P₁ ∧ … ∧ Pₙ) → C$ to have value $1$ in every model.

Does modus ponens work for this conditional? Under our degree-preserving
consequence relation, it fails. Take $v(A)=0.6$ and $v(B)=0.3$. Then
$v(A → B)=0.7$, so both premises have degree at least $0.6$, while the
conclusion has degree $0.3$.

There is a useful restricted case: if the conditional has degree $1$, then
$v(A) ≤ v(B)$, so the conclusion holds at least as strongly as $A$.
In particular, fully true premises yield a fully true conclusion. Our rule
prescriptions below require precisely such fully satisfied conditionals.

Our conjunction is Zadeh's minimum.
Łukasiewicz logic also has a *strong conjunction*, with value
$max(0,v(A)+v(B)-1)$. Its implication above likewise differs from the
material conditional $¬A ∨ B$.

## Fuzzy rules

Let's return to the heater. Our aim is to use the degree to which the room is
cold to decide how much heating to supply. We can introduce a predicate
$HeatingOn$, whose degree gives the fraction of full heater power, and write:

$$
IsCold(x) ⟹ HeatingOn(x).
$$

The idea is that the heating should be on at least as strongly as the room
is cold. At coldness $0.8$, for example, we require at least 80% power.
This is a prescription for the behavior of the system. Like a specification
in programming, it states a condition the system should meet. We still have
to work out how to choose an output that meets it.

{{< callout type="definition" title="Satisfying a fuzzy rule" >}}
A fuzzy model satisfies the
{{< term "fuzzy-rule" "fuzzy rule" >}} $A(x) ⟹ B(x)$ exactly when $v(A(x)) ≤ v(B(x))$ for every value of $x$
in its domain.
{{< /callout >}}

The rule is fully satisfied when its corresponding Łukasiewicz conditional
$A(x) → B(x)$ has degree $1$ throughout the domain. This connects our
prescription to the semantics of fuzzy formulas. It also gives us a way to
check a proposed model: look for a temperature where the antecedent exceeds
the consequent.

{{< logic-app name="many-valued" kind="rules" title="Checking a fuzzy heating rule" >}}

The rule doesn't fix a unique heating curve. Full power at every temperature
satisfies it, because every coldness degree is at most $1$. But we'd probably
like to avoid heating an already hot room. We could add a second prescription:

$$
IsHot(x) ⟹ ¬HeatingOn(x).
$$

At a given temperature, write $c$ for its coldness, $q$ for its hotness,
and $h$ for the heater output. Our two rules require:

$$
c ≤ h,   q ≤ 1-h.
$$

Equivalently, we need $c ≤ h ≤ 1-q$. If coldness is $0.4$ and hotness
is $0.2$, every output between $0.4$ and $0.8$ meets both prescriptions.
If our membership curves instead give coldness $0.7$ and hotness $0.6$,
there is no acceptable output: we would need $h ≥ 0.7$ and $h ≤ 0.4$.
This is something we can discover by checking the rules before building
the controller.

### Fuzzy satisfiability

Finding suitable values is a form of
{{< term "fuzzy-satisfiability" "fuzzy satisfiability" >}}. As in
{{< chapter_ref chapter="sat" >}}SAT solving{{< /chapter_ref >}}, we seek
an assignment that satisfies the given formulas. Here the values range over
$[0,1]$, and satisfying a formula means giving it value $1$.
For a measured temperature, the coldness and hotness degrees are fixed;
the heater output is the value we need to find.

Our two rules amount to making both Łukasiewicz conditionals fully true.
For these particular formulas, solving the problem reduces to finding a
number in the interval $[c,1-q]$. More complicated rule sets can produce
larger systems of constraints. A satisfying assignment gives us acceptable
outputs; an unsatisfiable set tells us that the requirements can't all be met.

This is also why fuzzy inference and fuzzy rules belong together. Once we've
specified the rules, valid inferences tell us what every model satisfying
them must be like. Satisfiability asks whether there is such a model and,
if there is, helps us find one.

### A simple heating policy

Suppose we start with the single coldness rule. One possible
{{< term "control-policy" "control policy" >}} chooses the smallest output
which satisfies it. Write $T(t)$ for the temperature measured at time $t$.
Then our policy is:

$$
h(t) = ⟦IsCold⟧(T(t)).
$$

Here $h(t)$ is the fraction of available heating power. If the current
temperature has coldness $0.3$, the heater supplies 30% power. As the room
warms up and its coldness falls, the requested power falls with it. We
measure the temperature again, calculate its coldness again, and adjust the
heater. This is the basic feedback loop of our controller.

{{< logic-app name="many-valued" kind="policy" title="Coldness determines heating power" >}}

If we also require $IsHot(x) ⟹ ¬HeatingOn(x)$, we have to check that
our membership curves make $⟦IsCold⟧(T) ≤ 1-⟦IsHot⟧(T)$ at every
temperature. Where that holds, choosing the lower endpoint $h=c$ satisfies
both rules. Where it fails, changing the output alone won't solve the problem;
we need to reconsider the requirements or the temperature descriptions.

### Combining fuzzy rules

A {{< term "fuzzy-controller" "fuzzy controller" >}} uses fuzzy rules to
calculate an output from measurements. Our simple policy uses just one rule.
To combine several rules, imagine trying to implement the following advice:
in a cold room, use full power; in a warm room, switch off; in a hot room,
switch off. At temperatures that count partly as cold and partly as warm,
more than one piece of advice applies. We need to combine them into the
single number sent to the heater.

A [zero-order Sugeno controller](https://en.wikipedia.org/wiki/Fuzzy_control_system)
does this by attaching a fixed output to each condition. The output is what
that rule recommends, and the degree of the condition determines its weight.
We'll write $A(x) ↦ c$ for a recommendation of power $c$ under condition
$A(x)$:

| Controller rule | Weight at temperature $T$ | Recommended power |
| --- | --- | --- |
| $IsCold(x) ↦ 1$ | $w₁ = ⟦IsCold⟧(T)$ | Full power: $c₁=1$ |
| $IsWarm(x) ↦ 0$ | $w₂ = ⟦IsWarm⟧(T)$ | Off: $c₂=0$ |
| $IsHot(x) ↦ 0$ | $w₃ = ⟦IsHot⟧(T)$ | Off: $c₃=0$ |

If the room is fully cold and neither warm nor hot, the weights are $1,0,0$.
Only the first rule contributes, giving full power. If the room is fully
warm with weights $0,1,0$, only the second contributes, switching the
heater off. For an intermediate temperature, suppose the weights are
$0.4,0.6,0$. The first rule recommends full power with weight $0.4$;
the second recommends switching off with weight $0.6$. A
{{< term "weighted-average" "weighted average" >}} gives us:

$$
h = (w₁c₁+w₂c₂+w₃c₃)/(w₁+w₂+w₃)
  = (0.4×1+0.6×0+0×0)/(0.4+0.6+0) = 0.4.
$$

So the heater runs at 40% power. Dividing by the total weight keeps the result
on the scale of the recommended outputs, even when the membership degrees
don't add up to $1$. For weights $0.8,0.8,0$, the two active recommendations
have equal weight, and the output is $0.5$.

You might ask: *Why choose an average?* It gives us a compromise that takes
every active recommendation into account, with weaker conditions contributing
less and stronger conditions contributing more. Other choices are possible.
Sugeno's method is useful because this calculation is cheap enough to repeat
as measurements arrive. With continuous membership curves and a positive
total weight, the output also changes continuously: a small temperature
change won't suddenly switch the heater from off to full power.

{{< logic-app name="many-valued" kind="controller" title="A fuzzy heating controller" >}}

Changing the recommended output changes what a rule contributes. For example,
we might prefer a low maintenance setting of $0.2$ in a warm room. With
weights $0.4,0.6,0$, this gives
$(0.4×1+0.6×0.2)/(0.4+0.6)=0.52$, or 52% power. The membership
curves determine when and how strongly the rules apply; the recommended
outputs determine which settings they favor.

Notice what this means for our earlier prescription $c ≤ h$. With weights
$0.8,0.8,0$, averaging recommends $h=0.5$, which violates that
prescription. If $c ≤ h$ is a requirement of the system, we have to keep
it as a constraint on the final output. We might first determine the acceptable
interval and then choose the point in it closest to the weighted recommendation.
If the interval is empty, the requirements need revision. Combining weighted
preferences doesn't by itself resolve inconsistent requirements.

We also need to specify what happens when every weight is $0$. The average
would involve division by zero, so we choose a fallback. In this example,
the fallback is to switch the heater off.

{{< callout type="note" title="Modeling assumptions: the heater" >}}
The memberships, recommended outputs, and fallback are choices in our model.
They specify a response to the measured temperature. Whether the room becomes
comfortable, whether the response is stable, and how much energy it uses also
depend on the heater, heat loss, and measurement delays. These require a model
of the room and heater as well.
{{< /callout >}}

We can already verify a useful property of the output: with nonnegative weights
and recommendations in $[0,1]$, their weighted average stays in $[0,1]$.
Our fallback does too. So this controller never requests negative power or
more than full power. Whether it keeps the room comfortable is a harder
question: for that, we need the model of heat loss and temperature change
mentioned above.

### Cooling a humid room

An air conditioner gives us a reason to combine different measurements. A
room can be uncomfortable because it is hot, or because it is warm and very
humid. We might want cooling in either case, with more power for high heat.

We still use real numbers as our domain. The variable $x$ now gives the
temperature in °C, and $y$ gives the relative humidity in percent. Thus
$IsWarm(x)$ and $IsHumid(y)$ describe different measurements. Our diagram
shows temperatures from 16 to 36°C and humidity from 0 to 100%.

Consider these recommendations:

$$
IsWarm(x) ∧ IsHumid(y) ↦ 0.7
$$

$$
IsHot(x) ↦ 1
$$

$$
¬IsHot(x) ∧ ¬(IsWarm(x) ∧ IsHumid(y)) ↦ 0.
$$

The first recommends 70% cooling when the room is both warm and humid; the
second recommends full cooling when it is hot. The third recommends switching
off when neither condition applies. We calculate its weight using the same
negation and conjunction operations as before.

At 26°C and 70% humidity, our curves give warmth $0.8$, hotness $0$,
and humidity $0.75$. The first rule has weight $min(0.8,0.75)=0.75$;
the second has weight $0$; the third has weight $0.25$. Their weighted
recommendation is $0.75×0.7=0.525$, or 52.5% cooling. At 34°C and
20% humidity, the first rule has weight $0$, the hotness rule has weight
$0.8$, and the off rule has weight $0.2$, giving 80% cooling.

### Defuzzification

Our Sugeno rules require us to choose exact recommendations such as 70%
power. But someone who knows how to operate the AC might give the advice
"use medium power when it's warm and humid". We can represent that advice
using a fuzzy predicate $Medium(p)$ over power settings $p$. Several settings
can count as medium to different degrees, just as several temperatures can
count as warm. This lets us describe the desired output in the same terms
as the input.

A [Mamdani controller](https://en.wikipedia.org/wiki/Fuzzy_control_system)
works with such rules. For our AC, we let the warm-and-humid rule recommend
medium power, the hotness rule high power, and the remaining rule low power.
Each output predicate has a membership curve over $p ∈ [0,1]$.
There are three steps from these curves to the setting sent to the AC.

First, we adjust each output curve to how strongly its rule applies.
Suppose the warm-and-humid condition has degree $0.4$. Giving its full
medium-power curve the same influence as a fully active rule would ignore
that difference. Our Mamdani controller therefore *clips* the curve at
height $0.4$: heights below $0.4$ stay as they are, and heights above it
are lowered to $0.4$. No setting receives more support from this rule than
its condition warrants. For a rule with weight $wᵢ$ and output curve $μᵢ$,
the clipped height at $p$ is $min(wᵢ,μᵢ(p))$.

Clipping is a choice of this controller; it doesn't follow from our earlier
definition of fuzzy consequence. Another controller could scale the whole
curve down instead. Here, a rule with weight $0$ contributes nothing, while
a rule with weight $1$ contributes its original curve.

Second, we combine the rules' contributions. At each power setting, we take
the highest of the clipped curves. A setting then receives the strongest
support any rule gives it. This is another choice of our Mamdani controller:

$$
μ(p) = maxᵢ min(wᵢ,μᵢ(p)).
$$

Third, we need to choose one power setting. So far we have a curve describing
how strongly the rules support *each* setting. The AC needs a number such as
55% to send to its motor. Turning the curve into that number is called
{{< term "defuzzification" "defuzzification" >}}.

One method uses the {{< term "centroid" "centroid" >}}. Imagine cutting the
shaded area under the curve out of cardboard of uniform thickness. Its
centroid is the balance point. We take the horizontal position of this point
as our power setting: more area near high power pulls the answer upward,
while more area near low power pulls it downward. This takes the whole
combined curve into account. Simply choosing its highest point could leave
us with several equally high points, or make the answer jump between peaks.

To calculate an approximation, pick evenly spaced settings, say 0%, 10%,
20%, and so on up to 100%. At each setting, read the height of the curve.
Use these heights as weights in an average of the settings. Writing the
settings as $p₁,…,pₙ$, we get:

$$
p* ≈ (p₁μ(p₁)+…+pₙμ(pₙ))/(μ(p₁)+…+μ(pₙ)).
$$

For example, if the nonzero heights are $0.5$, $1$, and $0.5$ at 40%,
50%, and 60%, their weighted average is 50%. The lower and higher settings
balance each other. Picking points closer together gives a better
approximation to the balance point of the area. If the whole curve has
height zero, we use zero power as a fallback.

{{< logic-app name="many-valued" kind="aircon" title="Temperature and humidity controller" >}}

Sugeno and Mamdani are two important approaches among several kinds of
[fuzzy controller](https://en.wikipedia.org/wiki/Fuzzy_control_system).
They implement rules by calculating an action from the measured inputs.
Sugeno averages numerical recommendations; Mamdani first combines fuzzy
output descriptions and then chooses a number from the result. A fuzzy
"low power" recommendation can therefore produce a small positive setting
where an exact Sugeno recommendation of zero switches the AC off.

The rule conditions determine their weights. Changing $∧$ to $∨$ in
the first condition, for example, makes warmth or humidity enough to
activate it. We can also change the recommended outputs. These are design
choices about how the system should respond. Testing them gives us a way
to develop an AI controller from descriptions such as "warm and humid";
judging its effects still requires measurements or a model of the room.

## Further readings {.readings .nocount}

- Audrey Yap and Richard Zach, [*What If?* (PDF)](https://builds.openlogicproject.org/courses/what-if/wi-screen.pdf), chapters 4–5, for many-valued semantics and three-valued logics, and chapter 7, for infinite-valued logics.
- Graham Priest, ["Natural Deduction Systems for Logics in the FDE Family"](https://doi.org/10.1007/978-3-030-31136-0_16), for the K₃ rules and their relation to other many-valued proof systems.
