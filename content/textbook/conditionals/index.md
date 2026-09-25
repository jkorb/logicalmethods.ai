---
title: Logical conditionals
author: Johannes Korbmacher
locked: false
weight: 60
params:
  date: 25/09/2025
  last_edited: 25/09/2026
  id: txt-if
---

# Logical conditionals

{{< img src="/img/drawings/con_ai_wondering.svg" class="float-start me-3"
width="100px" >}} If it's raining, then there are clouds. If the skies are
clear and it's daytime, then the sun is out. -- Much of what we know takes the
form of _if-then_ statements, so-called _conditionals_.
To use this information, we need to reason with conditionals. This is what this chapter is about.

The idea is that conditionals are a kind of _rule_ that when combined with basic facts about a situation, allow us to infer what our previous knowledge entails about the situation. This idea is captured nicely in the {{< term "modus-ponens" "Modus Ponens" >}} rule of inference:

{{< inference layout="stacked" >}}
  A → B
  A
  ---
  B
{{< /inference >}}
It turns out that this is one of the most fundamental forms of logical inference, which is central for human and artificial reasoning alike.

{{< img src="/img/drawings/expert_system_mascot.svg" class="float-end ms-3" width="180px" >}}
In logic-based AI, conditionals are especially important for the
{{< term "expert-system" "expert systems" >}} we met in
{{< chapter_ref chapter="logic-and-ai" id="logic-and-ai" >}}Logic and AI{{< /chapter_ref >}}.
Their knowledge base stores rules and facts, and their inference engine uses
these to derive further information. For example, a simple meteorology KB
might contain the rule: if it rains and the sun is low, there's a rainbow.
If we tell the KB that it's raining and the sun is low, the inference engine
can apply MP to predict a rainbow. Further rules might let it derive that
the sun is low from what we know about the time of day.

In {{< chapter_ref chapter="sat" >}}SAT{{< /chapter_ref >}}, we've seen how to reduce questions about valid
inference to satisfiability problems, which we could then tackle with automated
reasoning techniques like truth-tables and resolution. With a bit of tweaking,
we can apply these techniques to conditional reasoning, too. But it turns out
that under certain assumptions about the form of our conditionals, we can even
improve upon the techniques from last chapter. To see how this
works, we'll first study the two most important algorithms for conditional
reasoning known as _forward chaining_ and _backward chaining_. Then, we'll
introduce a special form of conditionals -- which are common in many knowledge
representation scenarios -- and see that their SAT problem can be solved in
[linear time](https://en.wikipedia.org/wiki/Time_complexity#Linear_time), which
is a significant improvement over what we know about the general `SAT` problem.

Finally, we'll tie our Boolean insights together by discussing [automated
planning](https://en.wikipedia.org/wiki/Satplan). We can use conditionals to
describe what actions do, and we can use SAT solving to find a sequence of
actions that reaches a goal. But describing what an action changes is only part
of the task. We also need to say what stays unchanged. Our block-stacking
example will lead us to the _frame problem_, a difficulty that has accompanied
logic-based AI from its early days.

{{< callout type="objectives" >}}
After studying this chapter, you will be able to:

- Explain the Boolean interpretation of the material conditional.
- Apply forward and backward chaining to a propositional knowledge base.
- Compare depth-first and breadth-first search in conditional reasoning.
- Use the Horn-SAT algorithm to decide satisfiability.
- Represent a bounded planning problem using propositional formulas.
- Explain the role of frame conditions in SAT planning.
{{< /callout >}}

## Boolean conditionals {#boolean-if-then}

Our Boolean semantics began with $¬, ∧, ∨$. In the SAT chapter, we also used
rewriting to deal with arrows. Here, we'll look more closely at the conditional. At a bare minimum, what we want is a theory that validates {{< term "modus-ponens" "MP" >}}. But how do we get there?

It turns out that Boolean algebra already has the resources to interpret →
in a way that aligns with many of our expectations about if-then statements.
The idea is that we can interpret → using the Boolean functions $!!NOT!!$
and $!!OR!!$ in combination:

<div class="function-tables">
{{< function-table name="NOT" >}}
{"rows":["0","1"],"columns":["output"],"values":[["1"],["0"]]}
{{< /function-table >}}
{{< function-table name="OR" >}}
{"rows":["0","1"],"columns":["0","1"],"values":[["0","1"],["1","1"]]}
{{< /function-table >}}
</div>

{{< callout type="definition" title="Material conditional" >}}
Given a {{< term "valuation" "Boolean valuation" >}} $v$, we interpret
the {{< term "conditional" "material conditional" >}} $A → B$ using the recursive clause:

$$
v(A → B) = (!!NOT!! v(A)) !!OR!! v(B).
$$

{{< /callout >}}

Before we work through an example, we introduce two names for the syntactic
parts of a conditional. In $A → B$, the {{< term "antecedent" "antecedent" >}}
is $A$ and the {{< term "consequent" "consequent" >}} is $B$.
It is false {{< term "iff" >}} its antecedent is true and its consequent is false.

Using this clause, the truth-table for $RAIN → WIND$, for example, works out to:

| $RAIN$ | $WIND$ | $¬RAIN$ | $RAIN → WIND$ |
| --- | --- | --- | --- |
| $1$ | $1$ | $0$ | $1$ |
| $1$ | $0$ | $0$ | $0$ |
| $0$ | $1$ | $1$ | $1$ |
| $0$ | $0$ | $1$ | $1$ |

We can also display the proposition expressed by a conditional. In the app,
we use $RAIN → SUN$ so that we can reuse our sunny and rainy worlds. Select
$[RAIN → SUN]$: it contains every world except the rainy world without sun.

{{< logic-app name="boolean" kind="models" examples="conditionals" title="The proposition expressed by a conditional" >}}

Returning to the truth-table for $RAIN → WIND$ above, the rows where it's
raining, that is $v(RAIN)=1$, are in line with expectations. If it's raining and it's not windy, the situation
contradicts the conditional, so it is false. If it's raining and windy,
everything is like the conditional says, so it is true.

More curious are the rows where it's _not_ raining. Note that in all those
situations, the conditional is true. What gives? One way to make sense of this
is by thinking about a rule in a computer program:

```python
if day == "monday":
    number = 1
```

The rule requires the program to assign the number `1` when the day is
`"monday"`. It doesn't say what to do on Tuesday. Assigning `2` on Tuesday
wouldn't violate this rule; neither would assigning `1`. The material
conditional treats both situations as satisfying the rule. Of course, this
only checks a relation between the values: the formula doesn't execute an
assignment or describe the order in which a program runs.

We might call this the _default-true interpretation_ of the conditional: the
default truth-value is $1$, only a counterexample changes it to $0$. With only
two truth-values, these exhaust our options. In {{< chapter_ref chapter="many-valued" >}}Many-valued logic{{< /chapter_ref >}}, we'll consider alternatives.

### Conditional rewriting

Recall from our discussion of normal forms in {{< chapter_ref chapter="sat"
id="normal-forms" >}}Boolean SAT{{< /chapter_ref >}} that $A ≡ B$ means that
$A$ and $B$ have the same value under every Boolean valuation. Our
interpretation of the conditional immediately gives us:

$$
(A → B) ≡ (¬A ∨ B).
$$

We use the corresponding rewrite rule

$$
(A → B) ⟹ (¬A ∨ B)
$$

to eliminate conditionals before moving negations inward and distributing.
Since the rule introduces negation symbols, its place before the negation
rules is important. The rest is business as usual.

{{< logic-app name="sat" kind="rewrite" examples="conditionals" formula="(RAIN ∧ SUN) → RAINBOW" title="Rewriting a conditional" >}}

This also explains the biconditional rule from the previous chapter.
$A ↔ B$ requires both directions: $A → B$ and $B → A$. Thus

$$
(A ↔ B) ≡ ((A → B) ∧ (B → A)) ≡ ((¬A ∨ B) ∧ (¬B ∨ A)).
$$

Eliminating the two conditionals gives exactly the rule we used in normal-form
rewriting.

### Modus ponens

Our interpretation of the conditional does what we asked of it: it makes MP
a valid inference. We can therefore use it to formalize the rules of an
expert system. If we know the if-part of a rule expressed with
→, we can infer the then-part with deductive certainty:

{{< callout type="theorem" title="Modus ponens" >}}
For arbitrary Boolean formulas $A$ and $B$:

$$
A, (A → B) ⊨ B.
$$
{{< /callout >}}

The only way the conclusion could be false while $A$ is true would also make
$A → B$ false. So there is no countermodel. We can also check this using the
methods from the previous chapter. For example, to test

$$
RAIN, (RAIN → WIND) ∴ WIND,
$$

we ask whether $RAIN ∧ (RAIN → WIND) ∧ ¬WIND$ is satisfiable. Rewriting gives

$$
RAIN ∧ (¬RAIN ∨ WIND) ∧ ¬WIND.
$$

Resolve $RAIN$ with $¬RAIN ∨ WIND$ to derive $WIND$, then resolve $WIND$ with
$¬WIND$ to derive $⊥$. The formula is unsatisfiable, so the inference is valid.
Notice that the first resolution step is already an application of MP in
disguise: it combines $RAIN$ with the disjunctive form of $RAIN → WIND$.

The equivalence also makes MP a variant of {{< term "disjunctive-syllogism" "disjunctive syllogism" >}}.
Rewriting the conditional turns

$$
A, (A → B) ∴ B
$$

into

$$
A, ¬A ∨ B ∴ B.
$$

Replace the first $A$ with its equivalent $¬¬A$, and this is disjunctive
syllogism. Conversely, rewrite $¬A ∨ B$ as $A → B$ to recover MP. The two
principles allow the same reasoning under our Boolean interpretation.

{{< img src="/img/drawings/con_ai_counterfactual.svg" class="float-end ms-3" width="240px" >}}
It's important to point out that the material conditional is not the only way
to formalize natural-language "if …, then …" statements. Consider "if you'd
throw the ball at the window, then it would break", said to $∀I$ standing in
front of the window with his ball. Such a statement is called a {{< term "counterfactual-conditional" "counterfactual conditional" >}}. If $∀I$ (responsibly) doesn't throw the ball,
this doesn't mean that the conditional is automagically true—the ball might be
a soft, foam ball and the window double glazed. The counterfactual might be
false. With a hard ball and a fragile window, it might very well be true.

This is a caveat about the use of material conditionals in knowledge
representation: we need to make sure that we only treat conditionals as
material conditionals when it's adequate. Our weather rules below are
simplified examples of strict rules, not a complete theory of the weather.

## Forward and backward chaining {#conditional-reasoning}

Using the reduction of $A → B$ to $¬A ∨ B$, we can apply all the Boolean
reasoning methods we know. But applying those methods also brings the
computational costs we've discussed. For a common form of conditional
knowledge, we can follow the rules directly.

In {{< chapter_ref chapter="formal-languages" id="knowledge-representation" >}}Knowledge representation{{< /chapter_ref >}},
we introduced a {{< term "knowledge-base" "knowledge base (KB)" >}} as a set
of statements represented in a formal language. We can _TELL_ the KB new
information and _ASK_ it what follows from what it contains. We write $ASK(KB, A)$ for the query whether $A$ follows from $KB$, and
$TELL(KB, A)$ for adding $A$ to it. The chaining algorithms give us two ways
to answer these queries.

We use _generalized modus ponens_, or gen-MP:

{{< inference rule="gen-MP" >}}
A₁
…
Aₙ
(A₁ ∧ … ∧ Aₙ) → B
---
B
{{< /inference >}}

Like MP, this is valid for arbitrary formulas $A₁, …, Aₙ, B$. For example, we
can infer $SUN$ from $CLEAR$, $DAY$, and $(CLEAR ∧ DAY) → SUN$.
We must establish every part of the antecedent before the rule supplies its
consequent.

For our running example, we choose a simple kind of KB: its given
{{< term "fact" "facts" >}} are atoms, and its rules have conjunctions of
atoms as antecedents and a single atom as consequent. Every rule application
then supplies another atom that we can use immediately. No further analysis
of the conclusion is needed to continue the chain. We'll return to the
significance of this choice in the section on the so-called _Horn clauses_ below.

{{< img src="/img/drawings/gimmick_database.svg" class="float-end ms-3" width="110px" >}}
We'll use the following weather example to explain both algorithms.
Suppose $∀I$ has downloaded this simple meteorological KB:

$$
MORNING → DAY &emsp;&emsp; EVENING → DAY
$$

$$
(CLEAR ∧ DAY) → SUN
$$

$$
(MORNING ∧ SUN) → LOW_SUN &emsp;&emsp; (EVENING ∧ SUN) → LOW_SUN
$$

$$
(RAIN ∧ LOW_SUN) → RAINBOW.
$$

Suppose further that $∀I$ observes that it's morning, the skies
are (partially) clear, and it's starting to rain. This gives us three facts:

$$
MORNING, CLEAR, RAIN.
$$

We TELL the KB these observations and ASK whether $RAINBOW$ follows.
Let's see how $∀I$ can answer this query.

### Forward chaining

The first technique for answering our query is known as _forward chaining_:

{{< callout type="definition" title="Forward chaining" >}}
{{< term "forward-chaining" "Forward chaining" >}} starts with known facts
and repeatedly applies rules whose premises are known to derive new facts.
{{< /callout >}}

From $MORNING$ we derive $DAY$. Together with $CLEAR$, this gives us $SUN$.
From $MORNING$ and $SUN$ we derive $LOW_SUN$, and from $RAIN$ and $LOW_SUN$ we
finally derive $RAINBOW$. We add each conclusion to our known facts, making
further rules available. Lather-rinse-repeat, until we reach the goal or no
rule can add a new fact.

<div class="conditional-inference-chain">
{{< inference rule="MP" >}}
MORNING
MORNING → DAY
---
DAY
{{< /inference >}}
{{< inference rule="gen-MP" >}}
CLEAR
DAY
(CLEAR ∧ DAY) → SUN
---
SUN
{{< /inference >}}
{{< inference rule="gen-MP" >}}
MORNING
SUN
(MORNING ∧ SUN) → LOW_SUN
---
LOW_SUN
{{< /inference >}}
{{< inference rule="gen-MP" >}}
RAIN
LOW_SUN
(RAIN ∧ LOW_SUN) → RAINBOW
---
RAINBOW
{{< /inference >}}
</div>

Here is the procedure in {{< term "pseudocode" "pseudocode" >}}.
The input consists of a finite list of facts, a finite list of rules, and an
atomic goal. `copy` makes a separate list; `contains` tests membership; `add`
adds an item. The helpers `premises_of` and `conclusion_of` read the two parts
of a rule, and `all_known` checks whether every premise occurs among the known
facts:

```python
def forward(goal, facts, rules):
    known = copy(facts)
    changed = True
    while changed:
        if contains(known, goal):
            return True
        changed = False
        for rule in rules:
            head = conclusion_of(rule)
            if all_known(premises_of(rule), known):
                if not contains(known, head):
                    add(known, head)
                    changed = True
    return contains(known, goal)
```

The variable `changed` records whether this pass added a fact. An addition
can enable a rule we've already passed, so we go through the rules again.
Each successful addition gives us a previously unknown atom. There are only
finitely many atoms, so eventually the procedure stops. This version is easy
to follow, but repeatedly inspecting every rule does unnecessary work. In the
Horn-SAT section, we'll replace those inspections with counters.

The app follows this pseudocode. Each step either inspects a rule or adds a
new fact. The inference line includes the conditional we're applying; the
explanation names the corresponding instruction. We can also inspect the
derivations found so far.

{{< logic-app name="conditionals" kind="chaining" method="forward" title="Forward chaining" >}}

### Backward chaining

But $∀I$ can also begin with what we've asked for. To answer our query about
$RAINBOW$, it can look for a rule that would establish $RAINBOW$, then ASK
whether that rule's premises follow. This is _backward chaining_:

{{< callout type="definition" title="Backward chaining" >}}
{{< term "backward-chaining" "Backward chaining" >}} starts with a goal and
searches for rules whose premises would establish it, treating those premises
as further goals.
{{< /callout >}}

$∀I$ wants to know whether $RAINBOW$ follows. There is a rule
$(RAIN ∧ LOW_SUN) → RAINBOW$ in the KB, so it would suffice to prove $RAIN$
and $LOW_SUN$. The first is already a fact. To prove $LOW_SUN$, we can try the
rule $(MORNING ∧ SUN) → LOW_SUN$. Again, $MORNING$ is known, leaving $SUN$.
Continue backward through $CLEAR$ and $DAY$ until we reach $MORNING$ again,
which is a fact. All the required premises have now been established.

We can keep track of the outstanding queries like this. Each row replaces
one query by the premises needed to answer it; known facts are marked as known:

| Rule used backward | Remaining queries |
| --- | --- |
| Start | $RAINBOW$ |
| $(RAIN ∧ LOW_SUN) → RAINBOW$ | $LOW_SUN$; $RAIN$ is known |
| $(MORNING ∧ SUN) → LOW_SUN$ | $SUN$; $MORNING$ is known |
| $(CLEAR ∧ DAY) → SUN$ | $DAY$; $CLEAR$ is known |
| $MORNING → DAY$ | None; $MORNING$ is known |

The resulting proof uses the same inferences as the forward chain, but we
found them by working back from the query.

Sometimes there are several rules for a goal. We may need to abandon one
attempt and try another. `rules_for` selects rules with the requested
conclusion. The list `active` records the goals on the current branch; start
with an empty list. `extend` makes a new list containing its first argument's
items and the new item, leaving the old list unchanged.

```python
def backward(goal, facts, rules, active):
    if contains(facts, goal):
        return True
    if contains(active, goal):
        return False
    branch = extend(active, goal)
    for rule in rules_for(goal, rules):
        if prove_all(premises_of(rule), facts, rules, branch):
            return True
    return False
```

For a rule to establish our goal, we must prove every premise. The helper
`prove_all` uses the same backward search for each premise:

```python
def prove_all(goals, facts, rules, active):
    for goal in goals:
        if not backward(goal, facts, rules, active):
            return False
    return True
```

A failed premise makes `prove_all` return `False`, so `backward` tries the next
rule. If every premise succeeds, it returns `True` and the goal is proved.
The two procedures call each other: this is another use of
{{< term "recursion" "recursion" >}}. Each call keeps its own values of the parameters.

Keeping a separate branch list lets us abandon a failed attempt without
carrying its unfinished goals into the next attempt. It also stops circular
searches. With only $CLOUDS → HUMID$ and $HUMID → CLOUDS$, we can't establish
either atom by assuming the other. Each branch can pursue only finitely many
different atoms before it reaches a fact, runs out of rules, or repeats a
goal. With finitely many rules to try, the search therefore terminates.

In the app, an unfinished inference is marked _to prove_. Its premises are
queries, not yet established facts. Once all of them have proofs, the
inference is complete. The explanation follows the calls to `backward` and
`prove_all`, including failed attempts and the next rule tried.

{{< logic-app name="conditionals" kind="chaining" method="backward" title="Backward chaining" >}}

### Search order

Both algorithms can answer our ASK query. Why choose one over the other?
Forward chaining may derive facts we didn't ask for; backward chaining can
focus on the query but take a long route through the rules. Their search
order helps explain this difference.

{{< img src="/img/drawings/con_ai_detective.svg" class="float-end ms-3" width="100px" >}}
The backward procedure follows one attempted proof as far as it can before
trying another. This is {{< term "depth-first-search" "depth-first search" >}}.
A different strategy is {{< term "breadth-first-search" "breadth-first search" >}}:
explore the immediate possibilities first, then possibilities one level
deeper, and so on.

We can organize forward chaining in breadth-first rounds. In each round, use
only facts available at the start of that round. Our forecast then takes
four rounds: $DAY$, $SUN$, $LOW_SUN$, $RAINBOW$. The first proof found for an
atom has the least depth, measured by the longest chain of rule applications
from an initial fact. This needn't minimize the total number of applications
in a branching proof. The simple pseudocode above instead makes each new fact
available immediately; its order also depends on the order of the rules.

Forward and backward describe the _direction_ of reasoning. Depth-first and
breadth-first describe the _order_ of search. They aren't interchangeable
names: backward search can also explore its alternative attempts breadth
first. That requires remembering unfinished attempts while we explore others.

Compare the searches side by side below. Here we use breadth-first rounds
for forward chaining and depth-first attempts for backward chaining. Both
panels use the same KB and query. In _Alternatives_, the forward search finds
several short derivations; the backward search follows the first route to
$CLOUDS$ through $HUMID$ and $PUDDLES$ before reaching $RAIN$. The panels
record the proofs found and the current search, so we can compare the work
rather than just the final answer. A step is one rule inspection or search
event; it isn't a measure of running time.

{{< logic-app name="conditionals" kind="comparison" example="alternatives" title="Comparing chaining searches" >}}

{{< img src="/img/drawings/con_ai_night_rainbow.svg" class="float-end ms-3" width="240px" >}}
For these finite rule bases, both algorithms find a proof whenever one exists.
But suppose neither $MORNING$ nor $EVENING$ were known, and no rule established
them. We couldn't derive $RAINBOW$ by chaining. Would that mean we'd derived
$¬RAINBOW$? No. The KB leaves room for both possibilities. We'll return to
this distinction between false and unprovable in
{{< chapter_ref chapter="many-valued" >}}Many-valued logic{{< /chapter_ref >}}.

## Horn clauses and SAT

So far, we've used a simple class of conditionals to illustrate chaining.
That choice wasn't by chance. These conditionals belong to a common class
known as _Horn clauses_, for which we can make reasoning particularly
efficient. To see the connection, we rewrite one of our weather rules:

$$
(CLEAR ∧ DAY) → SUN ≡ ¬(CLEAR ∧ DAY) ∨ SUN ≡ ¬CLEAR ∨ ¬DAY ∨ SUN.
$$

The result is a {{< term "clause" "disjunctive clause" >}} with just one
{{< term "positive-literal" "positive literal" >}}. These are
the clauses that let us keep deriving single facts.

{{< img src="/img/drawings/con_ai_horn.svg" class="float-end ms-3" width="180px" >}}
{{< callout type="definition" title="Horn clauses" >}}
A {{< term "horn-clause" "Horn clause" >}} is a disjunctive clause containing
at most one positive literal. A
{{< term "definite-clause" "definite clause" >}} contains exactly one positive literal. A {{< term "horn-formula" "Horn formula" >}}, then, is a conjunction of Horn clauses.
{{< /callout >}}

Horn clauses are named after [Alfred Horn](https://en.wikipedia.org/wiki/Alfred_Horn) (nothing to do with horns). Written
as conditionals, they have the form

$$
(A₁ ∧ … ∧ Aₙ) → B,
$$

where the $Aᵢ$ are atoms and $B$ is either an atom or $⊥$. The antecedent is a
_conjunctive_ clause of positive literals; the equivalent Horn clause itself
is _disjunctive_. For example:

| Disjunctive form | Conditional form | Use |
| --- | --- | --- |
| $¬CLEAR ∨ ¬DAY ∨ SUN$ | $(CLEAR ∧ DAY) → SUN$ | Derive a fact |
| $SUN$ | $⊤ → SUN$ | Initial fact |
| $¬SUN ∨ ¬RAIN$ | $(SUN ∧ RAIN) → ⊥$ | Forbid a combination |
| $¬SUN$ | $SUN → ⊥$ | Forbid a fact |
| $⊥$ | $⊤ → ⊥$ | Impossible requirement |

We introduced $⊤$ and $⊥$ as special symbols in
{{< chapter_ref chapter="sat" id="resolving-two-clauses" >}}Resolution{{< /chapter_ref >}}.
Unlike atoms, they have fixed values: $v(⊤)=1$ and $v(⊥)=0$ under every
valuation. We can treat them as constant formulas, standing for a
{{< term "tautology" "tautology" >}} and a
{{< term "contradiction" "contradiction" >}}, respectively. A fact can therefore
be viewed as a rule with no premises: its antecedent is automatically true.
A clause without a positive literal is a {{< term "goal-clause" "goal clause" >}},
also called a _constraint_. It forbids all the atoms in its conditional
antecedent from being true together. We include the {{< term "empty-clause" "empty clause" >}} $⊥$.

Not every conditional has this form. For example, $RAIN → (WIND ∨ SNOW)$
rewrites to $¬RAIN ∨ WIND ∨ SNOW$, with two positive literals. Knowing $RAIN$
requires at least one of $WIND$ and $SNOW$ to be true, but doesn't tell us
which. Our chaining procedure has no single fact to add.

### Horn satisfiability

The advantage of the Horn restriction is computational. SAT problems in
this form are [tractable](https://en.wikipedia.org/wiki/Tractable_problem):
as we'll see, we can decide them in linear time.

{{< callout type="definition" title="Horn SAT" >}}
{{< term "horn-sat" "Horn SAT" >}} is the problem of deciding whether a
finite conjunction of Horn clauses is satisfiable.
{{< /callout >}}

We write the clauses in conditional form and start with their facts. Whenever
all premises of a rule are known, we add its conclusion. If this makes the
premises of a constraint true, we derive $⊥$ and answer _unsatisfiable_. If no
new fact can be added and no constraint has been violated, we answer
_satisfiable_: we assign $1$ to every derived atom and $0$ to all the others.

Why does this last assignment work? Every rule whose premises all have value
$1$ has already supplied its conclusion. Every other rule has a false
antecedent. And no constraint has all its premises true. So every clause is
satisfied. Moreover, the atoms we've derived must be true in _every_ model
of the input. This is the {{< term "least-model" "least model" >}}: it makes
no additional atoms true.

### Counters and an agenda

To avoid repeatedly searching the whole KB, we keep a counter of unmet premises
for each rule and an {{< term "agenda" "agenda" >}} of facts waiting to be processed.
For each atom, we also prepare a list of rules that use it as a premise. When we
process that atom, we only inspect the rules on its list, decreasing each
counter by one. A rule becomes available when its counter reaches zero.

The input to the following procedure is the list of rules, including facts
as rules with no premises and constraints as rules with conclusion $⊥$.
`prepare` creates the counters and premise lists just described. `ready_rules`
gives the rules with counter zero, and `uses` gives the rules on an atom's
premise list. `decrease` subtracts one from a rule's counter; `remaining`
reads it. We treat repeated premises of one rule as one requirement.

The helper `enqueue` adds a fact at the end of the agenda, while `take_first`
removes and returns the first item. This makes the agenda a
{{< term "queue" "queue" >}}: first in, first out. `record` marks a fact as known and
enqueues it, but only if it hasn't been recorded before. These helpers spare
us the bookkeeping in the pseudocode.

```python
def horn_sat(rules):
    prepare(rules)
    known = empty_list()
    agenda = empty_list()
    for rule in ready_rules(rules):
        head = conclusion_of(rule)
        if head == bottom:
            return False
        record(head, known, agenda)
    while not is_empty(agenda):
        fact = take_first(agenda)
        for rule in uses(fact):
            decrease(rule)
            if remaining(rule) == 0:
                head = conclusion_of(rule)
                if head == bottom:
                    return False
                record(head, known, agenda)
    return True
```

Here `bottom` stands for $⊥$, `False` means unsatisfiable, and `True` means
satisfiable. When the answer is `True`, `known` also describes the least
model. This is the counter implementation used by the forward-chaining app;
for a query, we can stop as soon as its goal has been derived. For
satisfiability, we continue until the agenda is empty or a constraint fails.

{{< logic-app name="conditionals" kind="horn" title="Horn satisfiability with counters" >}}

In the first example, $RAIN$ forces $CLOUDS$, but $SNOW$ is not forced. We can
satisfy the input by making just $RAIN$ and $CLOUDS$ true. Add $SNOW$ as a fact
in the second example and we derive $STORM$, violating $STORM → ⊥$.

### Resolution and complexity

Horn chaining is closely related to resolution. The rule
$(CLEAR ∧ DAY) → SUN$ corresponds to $¬CLEAR ∨ ¬DAY ∨ SUN$. Resolve this with
the fact $CLEAR$, then with $DAY$, and we derive $SUN$. Generalized MP has
combined these two resolution steps into one rule application.

To test our forecast by refutation, add $¬RAINBOW$, or equivalently
$RAINBOW → ⊥$, to the weather KB. Chaining derives $RAINBOW$, and the constraint
then gives us $⊥$. This is the same reduction to SAT used in the previous
chapter, but the Horn restriction lets us direct the search through facts
instead of considering every pair of clauses.

{{< callout type="theorem" title="Linear-time Horn SAT" >}}
Horn satisfiability can be decided in time $O(m+1)$, where $m$ is the total
number of literal occurrences in the input clauses.
{{< /callout >}}

The counter algorithm processes each fact once and each premise occurrence
once. Preparing the lists also takes linear time, using an indexed
representation of atoms and rules. Copying a whole proof for every step,
as a teaching app may do, is additional display work; it isn't needed for the
decision itself.[^horn-time]

[^horn-time]: Dowling and Gallier's [linear-time algorithms for propositional Horn formulas](https://www.seas.upenn.edu/~cis5110/Dowling-Gallier-Horn-sat.pdf) establish this bound. The representation numbers the distinct atoms so their associated lists can be accessed directly.

Here $O$ is [big-O notation](https://en.wikipedia.org/wiki/Big_O_notation),
as in the SAT chapter. Compare this with the $2ⁿ$ rows of a truth-table for $n$ atoms. No algorithm
with a polynomial worst-case bound is known for general SAT. Restricting our
KB to Horn clauses gives us a much stronger guarantee. The known rules can
also be prepared in advance; when new observations arrive, we can use their
premise lists immediately. This is one reason Horn rules are useful for
expert systems. Unfortunately, using non-Horn clauses cannot always be avoided.
Our planning example will illustrate why.

## SAT planning {#planning}

We've seen how the form of a conditional KB can make reasoning more efficient.
In the final section, we'll use conditionals to describe how actions change a
world. The task is to find actions that take us from an initial state to a goal.
This brings together our Boolean semantics, conditional rules, and SAT solving.

We begin by describing a very simple set-up: $∀I$ stands in
front of a table, on which there are two blocks, a red one and a green one. The
green block is stacked on top of the red one. There are instructions on the
wall, telling $∀I$ to invert the stacking:

{{< img src="/img/drawings/con_ai_plan_setup.svg" class="float-end ms-3" width="300px" alt="Green is on red; the instructions ask for red on green." >}}

It seems that $∀I$ needs to make a plan.

There is an AI approach to planning that involves $SAT$-solving and knowledge
representation using conditionals. The approach is known as [$Satplan$](https://en.wikipedia.org/wiki/Satplan) or "Planning as satisfaction."

The idea is to describe the planning situation using a suitable propositional
language. Here are the basic components of such a language for our problem:

{{< callout type="definition" title="Fluent" >}}
A {{< term "fluent" "fluent" >}} describes a feature of a world whose truth
may change over time. In a propositional planning language, a separate atom
represents its value at each time point.
{{< /callout >}}

For our blocks, for each combination of $X, Y ∈ { R, G}$ and for
each $t$ a time-stamp in $0, …, h$, up to a fixed horizon $h$, we have a different (!)
propositional variable:

$$
On(X, Y, t),
$$

which states that block $X$ is on top of block $Y$ at point $t$.

That is, we have a propositional variable $On(R, G, 1)$, which says that
the red block is on top of the green block at the first time-stamp. But
we also have a _different_ propositional variable $On(G, R, 1)$, which says
that the _green_ block is on top of the _red_ one at the first
time-stamp. Of course, in a realistic model, only one of the two can be
true at the same time, more on that later.

The actions are propositional variables whose truth expresses that $∀I$
carries out a specific action. Again for each combination of $X,Y ∈ { R,
G}$ and for each action time $t$ in $0,…,h−1$, we have the variable

$$
Stack(X, Y, t),
$$

 which expresses the action of stacking $X$ on top
of $Y$ at time-stamp $t$.

Similarly, we have for each $X, Y$ and each $t$ the action $$Unstack(X, Y, t), $$
which removes the block $X$ from the block $Y$ at time $t$.

Otherwise, our language is an ordinary propositional language with ¬,
∧, ∨, and → as operators.

For now, the variables are just ordinary propositional variables, nothing constrains our models from assigning them "weird" values that don't align with
our intended interpretation. For example, an assignment may very well assign
$On(R, G, 1)$ and $On(G, R, 1)$ both the value $1$, even though in the "real world" of
course they can't both be true.

We tackle this problem by implementing a {{< abbr title="knowledge base">}}KB{{</abbr>}}, 
which initially contains the following formulas:

- Principles about the way the world works "(meta-)physically", such as:

  $$
  ¬On(X, X, t)&emsp;&emsp;&emsp; On(X, Y, t) → ¬On(Y, X, t),
  $$

   for all $t$. These guarantee, for example, that no block can be on top of itself in a model or both one on top of the other and the other on top of the one, in some weird "wormhole"-style model.

- Principles that guarantee that our actions work as intended, like:

  $$
  Stack(X, Y, t) → On(X, Y, t+1)&emsp;&emsp;&emsp;Unstack(X, Y, t) → ¬On(X, Y, t+1),
  $$

   for all $X, Y, t$ as before. These express action principles like that if you stack at one time-stamp in the model, the action will succeed and the blocks will be indeed on top of each other at the next time-stamp.

    These action principles also need some plausibility rules, like
    $$
    Unstack(X, Y, t) → On(X, Y, t),
    $$

     for all $X, Y, t$ as before, which
    states that you can only unstack blocks that are actually stacked.

These principles constrain which histories our models can describe. We still
need to check whether they capture everything our intended interpretation
requires. Note that each model contains a "full history," by telling
us which statements are true at time-stamp $0, …, h$.

In this language, we can express our planning problem as follows:

- We take an initial state of our system, which is

  $$
  On(G, R, 0).
  $$

   We couple
  it with a goal state, which is

  $$
  On(R, G, 2).
  $$

- If our KB adequately describes the permitted histories, a model making the
  initial state and goal state true lets us read off a _plan_: it
will tell us which actions are true by assigning them value $1$, such as
$v(Unstack(G, R, 0)) = 1$, to say first, unstack green from red.

- To carry out the plan, we just "do" the corresponding actions in the real
world.

But that means that we can find a plan—we can *plan*—by $SAT$-solving,
provided our formulas describe the permitted histories adequately. The
individual principles written so far are Horn clauses. For example,
$Stack(X, Y, t) → On(X, Y, t+1)$ has one positive literal in its disjunctive form.
We can solve their conjunction efficiently. But we haven't yet finished
specifying the problem.

One model includes the following history. All unlisted $On$ facts and actions
are false:

| Time | True state facts | Action |
| --- | --- | --- |
| $0$ | $On(G, R, 0)$ | $Unstack(G, R, 0)$ |
| $1$ | None | $Stack(R, G, 1)$ |
| $2$ | $On(R, G, 2)$ | — |

The plan we can read off is the one where we first unstack the green from the
red block, and then just stack the red on the green. Of course, you could have
found that plan by yourself without any logic, but planning situations can get
quite complex.

Planning problems involving blocks are a mainstay in AI research. Another
famous example involves monkeys and bananas, which we'll meet in the
exercises. Of course, real-world planning situations can get much more
complex. SAT planning lets us use a solver to search the possible histories.

There is one hiccup, however. Also the following history is a model of our KB
so far:

| Time | True state facts | Action |
| --- | --- | --- |
| $0$ | $On(G, R, 0)$ | None |
| $1$ | $On(G, R, 1)$ | None |
| $2$ | $On(R, G, 2)$ | None |

In this model, which you can easily verify validates all our principles
so far, $∀I$ hesitates for a second and doesn't carry out any actions at
the action times, but the problem solves itself: the blocks magically
re-arrange themselves into the desired configuration.

Of course, this is a nonsense model, but how do we exclude it? It turns out
that the obvious solution has some undesirable properties. We need to describe what stays unchanged when an action occurs.

{{< callout type="definition" title="Frame condition" >}}
A {{< term "frame-condition" "frame condition" >}} is a formula specifying
when a fluent retains its value from one time point to the next.
{{< /callout >}}

A _positive frame condition_ says when a true fluent stays true; a
_negative frame condition_ says when a false fluent stays false. For all
distinct blocks $X, Y$ and action times $t$, postulate both of the following:

- If one block is on another and we don't unstack it, it stays there:

$$
On(X, Y, t) ∧ ¬Unstack(X, Y, t) → On(X, Y, t+1)
$$

- If one block is not on another and we don't stack it there, it stays off:

$$
¬On(X, Y, t) ∧ ¬Stack(X, Y, t) → ¬On(X, Y, t+1)
$$

These exclude the miracle model. But the first frame condition rewrites to

$$
¬On(X, Y, t) ∨ Unstack(X, Y, t) ∨ On(X, Y, t+1),
$$

which has two positive literals. The second also has two positive literals
in disjunctive form. The Horn-SAT guarantee therefore no longer applies.
Conditionals can express the required persistence, but they take us outside
the restricted kind of conditional we used for chaining.

Let's finish the encoding for our two-block example. Fix $h=2$, so there are
three states and two action times. Take the initial facts to be:

$$
On(G, R, 0) ∧ ¬On(R, G, 0) ∧ ¬On(R, R, 0) ∧ ¬On(G, G, 0).
$$

For distinct blocks $X, Y$, use the following preconditions at $t=0, 1$:

$$
Stack(X, Y, t) → (¬On(X, Y, t) ∧ ¬On(Y, X, t))
$$

$$
Unstack(X, Y, t) → On(X, Y, t).
$$

In this tiny world, two unstacked blocks are both on the table and available
for stacking. Unstacking puts the removed block on the table. We don't model
a gripper or the table as additional objects.

At each action time, choose exactly one of $Stack(R, G, t)$, $Stack(G, R, t)$,
$Unstack(R, G, t)$, $Unstack(G, R, t)$, and $Wait(t)$. To express this, add their
disjunction and, for every two distinct actions $A, B$ in this list, add
$¬(A ∧ B)$. $Wait$ changes nothing. The two frame formulas above preserve
both $On$ facts whenever no corresponding stack or unstack action occurs.
Keep the action effects and state constraints already given, and require the
goal $On(R, G, 2)$.

We can now give a precise definition of a plan for this encoding.

{{< callout type="definition" title="Plan" >}}
For a fixed horizon, a {{< term "plan" "plan" >}} is a model of the planning
KB together with the initial and goal conditions. It assigns truth-values
to the state and action atoms at each time point.
{{< /callout >}}

The course of action is read off from the true action atoms. With our complete
KB, a satisfying assignment gives us:
$Unstack(G, R, 0)$ followed by $Stack(R, G, 1)$. The miracle model fails the
frame formulas, stacking too early fails a precondition, and doing two things
at once fails the action constraints. The requirement to choose an action also contains several positive literals.
So the complete encoding leaves Horn SAT for two reasons: action choice and
the frame conditions.

### Models and plans

The app builds the two-block SAT problem just described. Both frame
conditions are entered already. Press _Plan!_ and follow the time points to
read off the actions. The framed picture in the background shows the goal.
We can edit the initial conditions, goal, horizon, or frame conditions and
solve again. To reproduce the miracle model, clear both frame boxes.

{{< logic-app name="conditionals" kind="planning" frames="chapter" title="Planning by SAT solving" >}}

There are several possible starting configurations. The buttons supply
examples, and the initial-condition field also accepts a partial description.
With _Complete initial state_ selected, every unlisted $On$ atom is false.
Without it, unlisted atoms are left open: more than one initial state may
satisfy the description. The solver then chooses one such state; it doesn't
find a course of action guaranteed to work from every possible initial state.

The goal conditions need only describe what must hold at the end. The horizon
specifies the number of action steps, with $Wait$ available to fill an unused
step. Failure to find a model means no plan satisfies these formulas _within
this horizon_. A longer plan may still exist. In the exercises, we'll extend
the encoding to three blocks.

{{< callout type="definition" title="Bounded SAT planning" >}}
{{< term "sat-planning" "Bounded SAT planning" >}} encodes an initial state,
a goal, and permitted transitions over a fixed finite horizon as a
propositional formula. A satisfying assignment describes a plan relative to
that encoding.
{{< /callout >}}

The underlying difficulty is known as the {{< term "frame-problem" "frame problem" >}}:
how do we represent what remains unchanged when an action occurs, without
having to describe every unaffected feature of the world over and over?
Our small model handles it with two schemata, instantiated for every pair of
blocks and every action time. Richer worlds require more work, both in choosing
an adequate representation and in reasoning with it.

With Horn rules, an expert system can derive facts efficiently by chaining.
Our planning problem needs more expressive formulas, but it still reduces to
SAT. Finding a model then depends both on the solver and on how carefully we
have described the world. Representing what actions leave unchanged without
making the reasoning unmanageable remains a fundamental challenge for
logic-based AI. This is an issue we won't solve today.

## Further readings {.readings .nocount}

- Russell and Norvig, [*Artificial Intelligence: A Modern Approach*, 4th edition](https://www.pearson.com/en-us/subject-catalog/p/Russell-Lecture-Power-Points-for-Artificial-Intelligence-A-Modern-Approach-4th-Edition/P200000003500/9780137505135), chapter 7, for Horn clauses and chaining, and chapter 11, for automated planning.
