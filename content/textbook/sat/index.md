---
title: Boolean SAT
author: Johannes Korbmacher
locked: false
weight: 50
params:
  last_edited: "25/09/2026"
  id: txt-sat
---

# Boolean SAT

{{< img src="/img/drawings/sat_ai_boolean.svg" class="rounded float-start inert-img img-fluid m-2" width="200px" >}}
In {{< chapter_ref chapter="boolean" >}}Boolean algebra{{< /chapter_ref >}}, we checked whether the inference $$(SUN ∨ RAIN), ¬SUN ∴ RAIN$$ is
valid by looking through Boolean models. But we had to do all the hard work
ourselves: determine models, calculate truth-values, find countermodels …
Wouldn't it be great if we could automate all of this? That's the aim of
[automated reasoning](https://en.wikipedia.org/wiki/Automated_reasoning).

A powerful approach to automated reasoning is based on {{< term "sat-solving"
"SAT solving" >}}, which describes a family of techniques for algorithmically
checking whether a given set of formulas can be _satisfied_ – meaning jointly
made true by a single assignment of Boolean values. In this chapter, you'll
learn about how this technique can be used for automated reasoning and even
verifying circuit design.

{{< callout type="objectives" >}}
After studying this chapter, you will be able to:

- Represent validity and circuit verification as satisfiability problems.
- Apply the truth-table algorithm to formulas and inferences.
- Convert propositional formulas into CNF and DNF.
- Apply formula-based resolution to decide satisfiability.
- Compare the costs and explanatory outputs of SAT algorithms.
{{< /callout >}}

## SAT {#sat}

Consider the formula: $$SUN ∧ ¬RAIN$$ Can we find a Boolean valuation
under which it is true? -- Sure! Setting $v(SUN) = 1$ and $v(RAIN) = 0$ does the
trick. To check, just calculate using what we learned in the last chapter:

$$v(SUN ∧ ¬RAIN) = v(SUN) !!AND!! (!!NOT!! v(RAIN)) = … $$
$$… = 1 !!AND!! (!!NOT!! 0) = 1 !!AND!! 1 = 1$$

The formula is what's called _satisfiable_. Next, consider the formula:
$$SUN ∧ ¬SUN$$
This formula is _false_ under every Boolean valuation. We have:
$$v(SUN ∧ ¬SUN) = v(SUN) !!AND!! (!!NOT!! v(SUN))$$

So:

+ If $v(SUN) = 1$, then:
$$v(SUN ∧ ¬SUN) = 1 !!AND!! (!!NOT!! 1) = 1 !!AND!! 0 = 0$$

+ If $v(SUN) = 0$, then:
$$v(SUN ∧ ¬SUN) = 0 !!AND!! (!!NOT!! 0) = 0 !!AND!! 1 = 0$$

Since, by the {{< term "bivalence" "principle of bivalence" >}} of Boolean logic,
one of the two has to be the case -- either $v(SUN) = 1$ or $v(SUN) = 0$ -- we
know that our
formula is false under _every_ Boolean valuation. The formula is said to be
*unsatisfiable*.[^algebraic-sat]

{{< callout type="definition" title="Satisfiability" >}}
A propositional formula is {{< term "satisfiability" "satisfiable" >}} {{< term
"iff" "iff" >}} there is a Boolean valuation under which it is true. It is {{<
term "unsatisfiable" "unsatisfiable" >}} {{< term "iff" "iff" >}} there is no such valuation.
{{< /callout >}}

[^algebraic-sat]: We can also ask satisfiability questions about Boolean
_expressions_, where we say that an expression is satisfiable
{{< term "iff" "iff" >}} there is a way of
assigning values to its variables, such that it works out to $1$; and it is
unsatisfiable {{< term "iff" "iff" >}} it works out to $0$ for every way of
assigning values to its variables. Everything we do in this chapter -- every
algorithm and definition -- can equally well be spelled out for Boolean
expressions and is sometimes spelled out like this in the literature. But
understanding one approach is understanding the other, so we focus on the
formula based approach for simplicity.

We can also ask about the satisfiability of a _collection_ of formulas (like a
set, list, …). Take $SUN ∨ RAIN$ and $¬SUN$, for example. Can we make *both*
true with a single valuation? -- Yes! Set $v(SUN) = 0$ and $v(RAIN) = 1$. Then

$$
v(SUN ∨ RAIN) = 0 !!OR!! 1 = 1,
$$

and $v(¬SUN) = !!NOT!! 0 = 1$. The two formulas are *jointly satisfiable*.

Now add $¬RAIN$. To make $¬SUN$ and $¬RAIN$ true, we need
$v(SUN) = v(RAIN) = 0$. But then $SUN ∨ RAIN$ is false. So the three
formulas are jointly *un*satisfiable, even though each can be satisfied
individually. The requirement is that *one and the same* valuation makes
all of the formulas in question true.

For finitely many formulas, conjunction expresses exactly this requirement.
Our three formulas can all be true {{< term "iff" "iff" >}}

$$
(SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN
$$

can be true. This gives us the joint version of our definition:

{{< callout type="definition" title="Joint satisfiability" >}}
A finite set or list of propositional formulas $A₁, …, Aₙ$ is
*jointly satisfiable* {{< term "iff" "iff" >}}  its conjunction $A₁ ∧ … ∧ Aₙ$
is satisfiable. It is *jointly unsatisfiable* iff that conjunction is
unsatisfiable.
{{< /callout >}}

We also say that the set or list is *satisfiable*, leaving "jointly"
understood. For an empty list or set of formulas, we use the special symbol $⊤$
-- read "verum" or "top" -- to denote its conjunction. We postulate that $v(⊤)
= 1$ for every Boolean valuation and so, by definition, the empty list or set
is satisfiable.

{{< callout type="definition" title="The SAT problem" >}}
A {{< term "sat-problem" "Boolean satisfiability problem" >}}, or ``SAT``,
asks whether a given propositional formula, or a finite set of propositional
formulas, is satisfiable.
{{< /callout >}}

It turns out that several important automated reasoning problems reduce to
`SAT` problems. Here, we'll look at two of them: 1) checking whether an
electronic circuit -- or a computer program with finite inputs and a fixed
bound on its execution --
satisfies a list of specifications, and 2) checking whether a given inference
is deductively valid.

### Circuit verification {#checking-a-circuit}

{{< img src="/img/drawings/sat_ai_verification.svg" width="180px" class="float-end ms-3" >}}

A particularly interesting application of `SAT` is {{< term
"hardware-verification" "hardware verification" >}}: checking whether a circuit
meets its specification. Let's return to the $!!NAND!!$ function from the
[Boolean relay exercises](/exercises/boolean/#relay-logic) for an instructive
example. Its output is $0$ when both inputs are $1$, and $1$ otherwise:

{{< function-table name="NAND" >}}
{"rows":["0","1"],"columns":["0","1"],"values":[["1","1"],["1","0"]]}
{{< /function-table >}}

This table is our *specification*. It describes the output we want for
each combination of inputs. We can find the following relay implementation:

{{< logic-app name="boolean" kind="circuit" preset="nand" input-labels="INPUT₁,INPUT₂" examples="inputs" >}}

Try the four input combinations. In each case, the lamp gives the output
required by the table. That verifies this small circuit by inspection.

But for a larger circuit, we'd like to automate this procedure. To illustrate
how this works, we carry out the procedure in our simple, toy example circuit
from above. As a first step, we introduce two atoms, $INPUT₁$ and $INPUT₂$,
saying that the first and second input are on. A valuation of these atoms
describes an input to the circuit.

Now analyze the circuit. A default-off relay combines its magnet input and its
supply input using $!!AND!!$. We describe its output by $INPUT₁ ∧ INPUT₂$. This
output controls a default-on relay whose supply is always $1$, so the second
relay negates it. Reading the connections from the inputs to the output gives
us the formula:

$$
C = ¬(INPUT₁ ∧ INPUT₂).
$$

That is, $C$ is a formula describing the behavior of the circuit. We've
obtained it by analyzing the wiring and the known behavior of the components
and expressing it in the language of propositional logic. For any acyclic
circuit like ours, a program can carry out the same procedure: assign atoms to
the inputs, then build the formula for each component from the formulas at its
incoming connections.

Next, translate the specification table into a formula. There are different
ways of doing this automatically. Which one we pick depends on the algorithm
we want to employ. We'll use both of the following methods.

First, describe the inputs on which the output should be $1$. For each such
row, write a conjunction: use the atom where the row assigns $1$, and its
negation where it assigns $0$.

| $INPUT₁$ | $INPUT₂$ | Required output | Conjunction describing this row |
| --- | --- | --- | --- |
| $0$ | $0$ | $1$ | $¬INPUT₁ ∧ ¬INPUT₂$ |
| $0$ | $1$ | $1$ | $¬INPUT₁ ∧ INPUT₂$ |
| $1$ | $0$ | $1$ | $INPUT₁ ∧ ¬INPUT₂$ |

{{< term "disjunction" "Disjoin" >}} these descriptions. The result is true
precisely on the inputs where we want the lamp to be on:

$$
S₁ = (¬INPUT₁ ∧ ¬INPUT₂) ∨ (¬INPUT₁ ∧ INPUT₂) ∨ (INPUT₁ ∧ ¬INPUT₂).
$$

Each part describes a row we'll recognize when we're applying the so-called
truth-table algorithm for `SAT` solving. This form is called *disjunctive
normal form* or DNF -- we'll define it in general below.

Alternatively, exclude the inputs on which the output should be $0$.
For each such row, write a disjunction which is false exactly on that row:
use the atom where the row assigns $0$, and its negation where it assigns $1$.

| $INPUT₁$ | $INPUT₂$ | Required output | Clause excluding this row |
| --- | --- | --- | --- |
| $1$ | $1$ | $0$ | $¬INPUT₁ ∨ ¬INPUT₂$ |

{{< term "conjunction" "Conjoin" >}} these clauses. Here there is only one, so
our specification is:

$$
S₂ = ¬INPUT₁ ∨ ¬INPUT₂.
$$

This formula is false on the excluded input and true on all the others, just as
the specification requires. A program can carry out this translation: select
the rows with output $0$, construct a clause for each, and conjoin them. This
gives *conjunctive normal form*, or CNF, which we'll define precisely later on.
It works very well for the so-called resolution algorithm for `SAT` solving.
But logically speaking, $S₁$ and $S₂$ express the same specification. Either
works with all our algorithms. The difference is one of convenience: the row
descriptions in $S₁$ help us follow the calculation in the truth-table
algorithm, while $S₂$ is already in the shape we need for the resolution algorithm,
saving us a rewriting step. For now, either form will do, and we simply
use $S$ to ambiguously refer to either $S₁$ or $S₂$.

We now have two independently obtained formulas: $S$ says when the circuit
*should* output $1$, and $C$ says when the given circuit *does* output $1$.

To compare them, we use the so-called
{{< term "biconditional" "biconditional" >}} $↔$, which we interpret using
the Boolean function $!!XNOR!!$. This function, recall, returns $1$ {{< term "iff" "iff" >}} its two inputs agree:

{{< function-table name="XNOR" >}}
{"rows":["0","1"],"columns":["0","1"],"values":[["1","0"],["0","1"]]}
{{< /function-table >}}

$$
v(A ↔ B) = v(A) !!XNOR!! v(B).
$$

Thus $S ↔ C$ is true under a valuation {{< term "iff" "iff" >}} the specified
and actual outputs agree on that input. We want them to agree on *every* input.
A SAT solver can test whether there is an exception by testing whether the
following formula is satisfiable:

$$
¬(S ↔ C).
$$

A satisfying valuation gives an input on which the outputs differ.
If this formula is unsatisfiable, instead, there is no such input: the circuit
implements the specification correctly.

We've reduced circuit verification to a SAT problem. The translations describe
the circuit and its specification. A SAT solver then answers the satisfiability
question -- and with it the correctness question of our circuit.

What would a faulty circuit look like? Suppose we connect the lamp directly
to the first relay, before the default-on relay negates its output:

{{< logic-app name="boolean" kind="circuit" preset="nand-faulty" input-labels="INPUT₁,INPUT₂" examples="inputs" >}}

The specification remains $S = ¬INPUT₁ ∨ ¬INPUT₂$, but reading the wiring
now gives $C′ = INPUT₁ ∧ INPUT₂$. With both inputs off, for example, the
specification requires the lamp to be on, while this circuit leaves it off.
So $¬(S ↔ C′)$ is satisfiable. We'll use both circuits to try out our SAT
algorithms below.

### Inference checking {#checking-an-inference}

It turns out that the problem of checking a propositional inference has very
much the same mathematical structure. Remember that an inference is valid iff
it has no countermodel. So to check validity, we look for a valuation that
makes all premises true and the conclusion false. For our weather inference,
the premises are $SUN ∨ RAIN$ and $¬SUN$, and the conclusion is $RAIN$:

{{< inference >}}
$SUN ∨ RAIN$
$¬SUN$
---
$RAIN$
{{< /inference >}}

We'll compare it with the inference whose premises are $SUN ∨ RAIN$
and $SUN$, and whose conclusion is $¬RAIN$:

{{< inference >}}
$SUN ∨ RAIN$
$SUN$
---
$¬RAIN$
{{< /inference >}}

As we've seen, the first inference is valid: if one of $SUN$ and $RAIN$ is true
and $SUN$ is false, $RAIN$ must be true. The second is invalid: it could be
both sunny and rainy. The example buttons below select these two inferences.
Within each example, compare the premises, their intersection, and the
conclusion; "Countermodels" selects the worlds where the premises are true and
the conclusion is false.

{{< logic-app name="boolean" kind="models" preset="ds" examples="inferences" >}}

A {{< term "countermodel" "countermodel" >}} would make $SUN ∨ RAIN$ and
$¬SUN$ true while making $RAIN$ false. Since $v(¬RAIN) = !!NOT!! v(RAIN)$,
we can ask whether the following formula is satisfiable:

$$
(SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN.
$$


There is no such valuation. This conjunction is unsatisfiable, so the inference is
valid. It turns out that this works for _any_ finite list of premises, which is the content of the following {{< term "theorem" "mathematical theorem" >}}:

{{< callout type="theorem" title="Validity as unsatisfiability" >}}
An inference $A₁, …, Aₙ ∴ B$ is deductively valid iff
$(A₁ ∧ … ∧ Aₙ) ∧ ¬B$ is unsatisfiable.
{{< /callout >}}

{{< img src="/img/drawings/sat_ai_two_sides.svg" width="180px" class="float-start me-3" >}}
For the second inference, the search succeeds:

$$
SUN ∨ RAIN, &emsp; SUN &emsp; ∴ &emsp; ¬RAIN.
$$

Select Invalid inference in the model app above to see its countermodels.

Negating the conclusion gives us $¬¬RAIN$. We therefore test

$$
(SUN ∨ RAIN) ∧ SUN ∧ ¬¬RAIN.
$$

The valuation with $v(SUN) = v(RAIN) = 1$ makes this conjunction true.
It is a countermodel to the inference. Keep track of that extra negation:
the SAT input contains the *negation* of the proposed conclusion, even when
the conclusion already begins with $¬$.

In this way, we've reduced the question of the validity of an inference to a
`SAT` problem -- just like in the case of circuit verification. Now it's time
to look into algorithms for _solving_ `SAT` problems.

## Truth-tables {#truth-tables}

What we've achieved so far is that we've reduced circuit verification and
inference checking to a question about satisfiability -- to a `SAT` problem of
the form: Can this formula be true? It turns out that there are many different
kinds of {{< term "algorithm" "algorithms" >}} for solving `SAT` problems. The
first we'll look at is a [brute
force](https://en.wikipedia.org/wiki/Brute-force_search) approach, which simply
searches through every possible assignment to find one that satisfies our
formula. It's known as the _truth-table method_.

{{< callout type="definition" title="Truth-table" >}}
A {{< term "truth-table" "truth-table" >}} lists the value of one or more
propositional formulas under every assignment to the variables occurring
in them.
{{< /callout >}}

In the last chapter, we've seen that for $n$ variables, each taking one of two
values, there are $2ⁿ$ assignments. To list them without missing or repeating
one, simply count from $0$ to $2ⁿ − 1$ in binary. With two variables, for
example, we get:

| $SUN$ | $RAIN$ |
| --- | --- |
| $0$ | $0$ |
| $0$ | $1$ |
| $1$ | $0$ |
| $1$ | $1$ |

With three variables, instead, the binary strings are $000$, $001$, $010$, $011$,
$100$, $101$, $110$, and $111$. Each gives one row in the table, like so:

| $SUN$ | $RAIN$ | $WIND$ |
| --- | --- | -----------|
| $0$ | $0$ | $0$ |
| $0$ | $0$ | $1$ |
| $0$ | $1$ | $0$ |
| $0$ | $1$ | $1$ |
| $1$ | $0$ | $0$ |
| $1$ | $0$ | $1$ |
| $1$ | $1$ | $0$ |
| $1$ | $1$ | $1$ |


### Row evaluation {#calculating-a-row}

Having counted all the possible evaluations we need to look at, next we parse
the formulas and calculate their values, starting at the leaves of their {{<
term "abstract-syntax-tree" "parse trees" >}}. The recursive clauses from {{<
chapter_ref chapter="boolean" >}}Boolean algebra{{< /chapter_ref >}} tell us
which operation to apply at each parent:

$$
v(¬A) = !!NOT!! v(A)
$$

$$
v(A ∧ B) = v(A) !!AND!! v(B)
$$

$$
v(A ∨ B) = v(A) !!OR!! v(B).
$$

For $SUN ∨ (¬RAIN ∧ ¬WIND)$, first read the assigned values of the variables.
Then calculate $¬RAIN$ and $¬WIND$, their conjunction, and finally the outer
disjunction. Each calculation uses values already obtained below it.

To make this idea a bit more precise, we can write this as {{< term
"pseudocode" "pseudocode" >}} in the style of the parsing algorithm in
{{< chapter_ref chapter="formal-languages" id="algorithms-and-pseudocode" >}}Formal languages{{< /chapter_ref >}}.
The input to `evaluate` is a parsed formula and a
valuation $v$; its output is the formula's value.

We use the same Python-style pseudocode: `def` names a procedure, `=` gives
a name to a result, and `return` gives back the answer. Here we also need
`==`, which tests whether two values are equal. The indented lines after
`if` run when its condition holds. Names followed by parentheses call
operations; `v(A)` reads the value assigned to $A$. The helper operations
are described by their names, rather than implemented as Python code.

```python
def evaluate(tree, v):
    if is_variable(tree):
        return v(variable(tree))

    if operator(tree) == "¬":
        return NOT(evaluate(child(tree), v))

    left_value = evaluate(left_child(tree), v)
    right_value = evaluate(right_child(tree), v)
    if operator(tree) == "∧":
        return AND(left_value, right_value)
    if operator(tree) == "∨":
        return OR(left_value, right_value)
    return XNOR(left_value, right_value)
```

Most programming languages provide Boolean operations as basic operations.
For example, Python has `not`, `and`, and `or`. Applied to Boolean values,
these implement $!!NOT!!$, $!!AND!!$, and $!!OR!!$. The circuits we studied in
{{< chapter_ref chapter="boolean" >}}Boolean algebra{{< /chapter_ref >}}
provide the hardware operations on which their implementation ultimately
depends. In our pseudocode, `NOT`, `AND`, and `OR` refer to these Boolean
functions, with inputs and outputs written as $0$ and $1$. The final line covers $↔$; we use `XNOR` for equality of Boolean values.
Our input language here contains variables, $¬$, $∧$, $∨$, and $↔$. Every recursive call uses a smaller tree, so evaluation
terminates.

### Truth-table search {#searching-the-table}

To tackle a `SAT` problem using truth-tables, we simply repeat that calculation
for every row until we find one where the input formula is true:

```python
def truth_table_sat(formula):
    tree = parse(formula)
    names = variables_in(tree)
    for v in binary_assignments(names):
        if evaluate(tree, v) == 1:
            return ("satisfiable", v)
    return "unsatisfiable"
```

`for v in …` repeats the indented instructions for each assignment,
calling that assignment `v`. Here, `variables_in` lists the distinct variables in a fixed order, and
`binary_assignments` counts through the binary strings of that length. A
satisfying valuation is enough to finish the search, so this version can stop
before filling the whole table. In practice, when hand-writing truth-tables,
it's often a good idea to first write out all the rows of the table, and then
check for satisfiability with the full table in plain view.

To check an inference using this method, we take as input to this procedure the
conjunction of its premises and the {{< term "negation" "negation" >}} of its
conclusion. For the valid weather inference, for instance, the SAT formula is
$$(SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN$$ Its completed table comes out to:

<div class="truth-table-example">

| $SUN$ | $RAIN$ | $SUN ∨ RAIN$ | $¬SUN$ | $¬RAIN$ | $(SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN$ |
| --- | --- | --- | --- | --- | --- |
| $0$ | $0$ | $0$ | $1$ | $1$ | $0$ |
| $0$ | $1$ | $1$ | $1$ | $0$ | $0$ |
| $1$ | $0$ | $1$ | $0$ | $1$ | $0$ |
| $1$ | $1$ | $1$ | $0$ | $0$ | $0$ |

</div>

The last column conjoins the preceding three formula columns. It is $0$ in
every row: no valuation makes all three formulas true. The SAT input is
unsatisfiable, and the inference is valid.

The app below builds this same table step by step, allowing you to step through
the calculation to solidify your understanding of the procedure. The app
displays the premises and conclusion of an inference, then forms the SAT
formula by negating the conclusion and {{< term "conjunction" "conjoining" >}}
it with the premises. The table shows the assigned values, the formulas being
conjoined, and their conjunction in the final column. The calculation beside it
evaluates one subformula at a time, working upward through the parse tree. That
subformula is highlighted in the SAT formula above the table. Open "Row
calculations" to review the intermediate values for the current row.

Select a row number to work on that assignment. "Last step" completes
the table; a $1$ in the SAT column gives a countermodel. The app finishes
every row so that we can inspect the whole table, whereas the pseudocode
can stop at its first satisfying valuation. Indexed variables are sorted
by index, other names alphabetically, so the app lists $RAIN$ before $SUN$.

{{< logic-app name="sat" kind="truth-table" formula="SUN ∨ RAIN, ¬SUN ∴ RAIN" >}}

Use the example buttons to compare the valid and invalid weather inferences.
The Circuit verification example tests $¬(S ↔ C)$ with both abbreviations
expanded. Circuit: DNF specification uses $S₁$ instead. Both must give
the same final column, though their intermediate calculations differ.
There are still only four rows, but more intermediate calculations. The
final column is $0$ throughout: the circuit meets the specification on
every input. The faulty-circuit example replaces $C$ by $INPUT₁ ∧ INPUT₂$;
its satisfying rows identify inputs on which that circuit fails.

### Decision procedures {#what-the-algorithm-guarantees}

Truth-tables give us what's called a _decision procedure_ for SAT problems:

{{< callout type="definition" title="Decision procedure" >}}
A {{< term "decision-procedure" "decision procedure" >}} is an algorithm that
terminates on every allowed input with the correct yes-or-no answer. A problem
with such a procedure is called {{< term "decidable" "decidable" >}}. A problem is {{<
term "algorithmic-undecidability" "undecidable" >}} {{< term "iff" "iff" >}} no
decision procedure exists for it.
{{< /callout >}}


Since every input formula has finitely many variables and finitely many
connectives, there are therefore finitely many calculations to perform when
making the truth-table. As a consequence, the search _must_ finish. Moreover,
if the search returns a valuation, that valuation makes the formula true --
giving us a countermodel to the inference. If, instead, the search returns
"unsatisfiable", it has checked every valuation and found none that does. The
inference _has_ to be valid. So its answer is correct in either case.

Relatedly, a completed truth-table also tells us whether a formula is a _tautology_ or a
_contradiction_:

{{< callout type="definition" title="Tautology and contradiction" >}}
A {{< term "tautology" "tautology" >}} is a propositional formula true under
every Boolean valuation. A {{< term "contradiction" "contradiction" >}} is a
propositional formula false under every Boolean valuation.
{{< /callout >}}

Simply inspect the columns of the table and check whether they're all $1$s or
all $0$s. In the former case, we're dealing with a tautology, in the latter
case with a contradiction. If we find neither -- that is there are both $1$s
and $0$s in the column -- the formula is what's called _contingent_: it can be
both true and false, depending on the circumstances.

{{< img src="/img/drawings/sat_exponential.svg" width="230px" class="float-end ms-3" >}}

While the truth-table method works as a brute force decision procedure, it
turns out that it has a major downside concerning its [computational
complexity](https://en.wikipedia.org/wiki/Computational_complexity). The
_computational cost_ of the algorithm -- the amount of resources required to
run it -- depends on the number of rows. For $n$ variables and
$m$ operators, the straightforward `SAT` search using truth-tables has
[worst-case](https://en.wikipedia.org/wiki/Worst-case_complexity) {{< term
"time-complexity" "time complexity" >}} $O(2ⁿ(m + 1))$.

Here, the so-called [big-O
notation](https://en.wikipedia.org/wiki/Big_O_notation) $O(2ⁿ(m + 1))$ describes an
upper bound on how the running time grows with the size of the input. Up to a
constant factor, there are at most $2ⁿ$ rows to check and $m + 1$ steps
per row. The extra $1$ accounts for reading a variable even when the
formula has no operators. Importantly, this analysis does not tell us the number of
seconds the algorithm runs: that also depends on the computer and
implementation. Instead, it tells us abstractly _how_ the compute time depends
on the size of the input. And for truth-tables, this is expensive: the number
of rows doubles every time we add a variable to the input, so the growth is
[exponential](https://en.wikipedia.org/wiki/Exponential_growth).

While evaluating the formula given values for the variables takes time linear
in $m + 1$, we may need to calculate every row to get the correct answer. This is
an example of what's known as
{{< term "combinatorial-explosion" "combinatorial explosion" >}}: adding one
variable _doubles_ the number of assignments.

From a computational perspective, we'd like to do better. So, can we avoid
writing out all these rows? Well, sometimes. _Resolution_, our next SAT
algorithm, works by automatically deriving consequences of the input formulas.
And this can be implemented in such a way that only a few derivation steps
settle a problem that would need a large truth-table to calculate. But to apply
the resolution algorithm, we first need to put our formulas into a suitable
_shape_. We need to do a kind of [data
pre-processing](https://en.wikipedia.org/wiki/Data_preprocessing).

## Normal Forms {#normal-forms}



Resolution looks for a contradiction among clauses: disjunctions of
variables and their negations. We therefore want to express our SAT input
as a conjunction of such clauses. This is the preprocessing stage of our
resolution algorithm: we prepare the input before searching for a refutation.
Rewriting lets us change the shape of
a formula while preserving its truth-value under every valuation.

{{< callout type="definition" title="Logical equivalence" >}}
Two propositional formulas are {{< term "equivalence" "logically equivalent" >}} iff they have the same truth-value under every Boolean valuation. We write $A ≡ B$ for this relation.
{{< /callout >}}

The Boolean laws give us equivalent formulas. For example, $¬(SUN ∧ RAIN)$
and $¬SUN ∨ ¬RAIN$ are equivalent by De Morgan's law from
{{< chapter_ref chapter="boolean" id="boolean-laws" >}}Boolean algebra{{< /chapter_ref >}}. Repeated applications
of these laws can put a formula into a {{< term "normal-form" "normal form" >}},
a prescribed syntactic shape.

### DNF and CNF

The pieces we'll use are variables and their negations:

{{< callout type="definition" title="Literal" >}}
A {{< term "literal" "literal" >}} is a propositional variable or the negation
of a propositional variable.
{{< /callout >}}

Thus $SUN$ and $¬RAIN$ are literals, while $¬¬SUN$ and $¬(SUN ∧ RAIN)$
are not. An unnegated variable such as $SUN$ is a
{{< term "positive-literal" "positive literal" >}}; a negated variable such as
$¬RAIN$ is a {{< term "negative-literal" "negative literal" >}}. Either can be
true or false, depending on the valuation. A variable and its negation, such as
$SUN$ and $¬SUN$, are
{{< term "complementary-literals" "complementary literals" >}}: making
one true makes the other false.

We can also describe $!!NAND!!$ by listing the inputs on which its output
is $1$:

$$
(¬INPUT₁ ∧ ¬INPUT₂) ∨ (¬INPUT₁ ∧ INPUT₂) ∨ (INPUT₁ ∧ ¬INPUT₂).
$$

This is a list of possibilities for making the formula true, joined by
$∨$. Each possibility specifies conditions that must hold together, joined
by $∧$. The first asks for both inputs to be off, the second for only the
second input to be on, and the third for only the first input to be on.
Satisfying any one of these possibilities satisfies the whole formula.

{{< callout type="definition" title="Disjunctive normal form" >}}
A formula is in
{{< term "disjunctive-normal-form" "disjunctive normal form" >}} (DNF) iff it
is a disjunction of conjunctions of literals.
{{< /callout >}}

{{< callout type="definition" title="Clauses" >}}
A {{< term "conjunctive-clause" "conjunctive clause" >}} is a conjunction of literals.
A {{< term "clause" "disjunctive clause" >}} is a disjunction of literals.
A single literal counts as a clause of either kind.
{{< /callout >}}

Each disjunct of a DNF is a conjunctive clause, also called a *term*: in the
example, the first term is $¬INPUT₁ ∧ ¬INPUT₂$. A term may contain just
one literal, as $SUN$ does in $SUN ∨ (RAIN ∧ WIND)$. The whole DNF may
also have just one term, as in $SUN ∧ ¬RAIN$.

A DNF is satisfiable iff at least one term contains no complementary
literals. To satisfy that term, assign $1$ to its positive literals and
$0$ to the variables that occur negated. These assignments are compatible
precisely when no variable is required to have both values. For example,
$(SUN ∧ ¬SUN) ∨ RAIN$ is satisfiable through its second term.

Now consider the other arrangement:

$$
(SUN ∨ ¬RAIN) ∧ (RAIN ∨ ¬WIND).
$$

Here we have a menu of requirements. From the first bracket, choose at
least one literal to make true; do the same for the second bracket.
Choosing $SUN$ and $¬WIND$ works. Choosing $¬RAIN$ and $¬WIND$ also
works. But choosing $¬RAIN$ and $RAIN$ asks for incompatible values.
The choices have to fit one valuation.

{{< callout type="definition" title="Conjunctive normal form" >}}
A formula is in
{{< term "conjunctive-normal-form" "conjunctive normal form" >}} (CNF) iff it
is a conjunction of disjunctive clauses.
{{< /callout >}}

From now on, when we say *clause* without qualification, we mean a
disjunctive clause. A clause with one literal is called a {{< term "unit-clause" "unit clause" >}}.
So $SUN$ is a clause, as is $SUN ∨ ¬RAIN$.
A CNF may consist of one clause. We leave out brackets along a chain of
the same connective, using associativity as in the Boolean chapter.

| Formula | Conjunctive clause? | Disjunctive clause? | DNF? | CNF? |
| --- | --- | --- | --- | --- |
| $SUN$ | yes | yes | yes | yes |
| $SUN ∨ ¬RAIN$ | no | yes | yes | yes |
| $SUN ∧ ¬RAIN$ | yes | no | yes | yes |
| $SUN ∨ (RAIN ∧ WIND)$ | no | no | yes | no |
| $(SUN ∨ RAIN) ∧ WIND$ | no | no | no | yes |
| $¬(SUN ∧ RAIN)$ | no | no | no | no |

Essentially, a DNF lists alternative ways to satisfy the whole formula, while a
CNF lists requirements that must all be met. Both arrangements can express the
same truth-conditions, which is the content of the following
{{< term "theorem" "mathematical theorem" >}}:

{{< callout type="theorem" title="Normal form theorem" >}}
Every propositional formula built from variables using $¬$, $∧$, and $∨$
has an equivalent formula in CNF and an equivalent formula in DNF.
{{< /callout >}}

Which normal form we use depends on our needs. Resolution needs CNF.
DNF makes satisfying assignments easy to read off: choose a term with no
complementary literals and make its literals true. Truth-tables work directly
with any formula, so we need not convert to DNF before calculating one.

### Normal-form rewriting {#rewriting-a-formula}

But the above mathematical theorem only tells us that an equivalent normal form
_exists_. To _get_ one, which we can use for resolution, for example, we need a
procedure that actually constructs it -- a rewrite {{< term "algorithm"
"algorithm" >}}. The algorithm we'll discuss uses Boolean laws we studied in
the last chapter as rewrite rules, in a similar way as we used rewrite rules as
grammar rules in
{{< chapter_ref chapter="formal-languages" >}}Formal languages{{< /chapter_ref >}}.




A {{< term "rewrite-rule" "rewrite rule" >}} replaces a subformula by an
equivalent one. Both normal-form algorithms begin by pushing negations
toward the variables:

$$
r₁: ¬¬A ⟹ A
r₂: ¬(A ∧ B) ⟹ ¬A ∨ ¬B
r₃: ¬(A ∨ B) ⟹ ¬A ∧ ¬B
$$

Here $⟹$ marks a rewriting step. We can apply a rule anywhere in the
formula, including inside a larger subformula. Starting with our example,
we get:

$$
¬¬SUN ∨ ¬(RAIN ∨ ¬SUN)
⟹ SUN ∨ ¬(RAIN ∨ ¬SUN)
$$

$$
⟹ SUN ∨ (¬RAIN ∧ ¬¬SUN)
⟹ SUN ∨ (¬RAIN ∧ SUN).
$$

At this point, every negation applies to a variable. This shape is called
{{< term "negation-normal-form" "negation normal form" >}}.
What comes next depends on our target:

For CNF, distribute disjunction over conjunction:

$$
r₄: A ∨ (B ∧ C) ⟹ (A ∨ B) ∧ (A ∨ C)
r₅: (A ∧ B) ∨ C ⟹ (A ∨ C) ∧ (B ∨ C).
$$

For DNF, distribute conjunction over disjunction:

$$
r₆: A ∧ (B ∨ C) ⟹ (A ∧ B) ∨ (A ∧ C)
r₇: (A ∨ B) ∧ C ⟹ (A ∧ C) ∨ (B ∧ C).
$$

For CNF, our example continues as follows:

$$
SUN ∨ (¬RAIN ∧ SUN)
⟹ (SUN ∨ ¬RAIN) ∧ (SUN ∨ SUN).
$$

The result is a conjunction of disjunctive clauses. Idempotence lets us replace
$SUN ∨ SUN$ by $SUN$. Our rewritten CNF is therefore

$$
(SUN ∨ ¬RAIN) ∧ SUN.
$$

We leave out brackets within a clause and around the whole formula,
using associativity. Repeated literals or clauses can always be removed
by idempotence.

For our circuit comparison, we need an additional trick, as it contains $↔$.
Before applying the rules for $¬$, $∧$, and $∨$, we replace each biconditional
using

$$
(A ↔ B) ⟹ ((¬A ∨ B) ∧ (¬B ∨ A)).
$$

The right-hand side excludes precisely the two cases where $A$ and $B$
have different values. Repeatedly applying this rule removes every $↔$;
we can then use the procedure below. In
{{< chapter_ref chapter="conditionals" >}}Conditionals{{< /chapter_ref >}},
we'll add the corresponding rule for $→$. But the apps already accept it,
using $(A → B) ⟹  (¬A ∨ B)$ under the Boolean interpretation studied there.

Here is the whole procedure. It takes a parsed formula and a target,
either `"cnf"` or `"dnf"`, and returns an equivalent formula in that shape.

```python
def normal_form(formula, target):
    while contains_biconditional(formula):
        formula = rewrite_first_biconditional(formula)

    while has_negation_rewrite(formula):
        formula = rewrite_first_negation(formula)

    while has_distribution_rewrite(formula, target):
        formula = rewrite_first_distribution(formula, target)

    return formula
```

`while` repeats its indented instructions as long as the condition holds.
The helpers (the small functions used for the individual tasks) search the
tree from the root, then left to right. Each rewrite replaces the first
matching subformula. After eliminating $↔$, the negation loop uses only
$r₁$–$r₃$. For `target = "cnf"`, `rewrite_first_distribution` distributes
$∨$ over $∧$; for `target = "dnf"`, it distributes $∧$ over $∨$.
In each case, it uses the appropriate left or right distribution rule
above. `has_distribution_rewrite` checks for a match using those same rules.

Repetitions don't stop a formula from being in normal form. The app also
removes them using idempotence, but this simplification is optional.

The negation phase terminates because each rule reduces the number of
connectives lying within the scope of negations, counting each negation's
scope separately. After that, distribution combines finite lists of
clauses or terms. For example, distributing a disjunction between two
CNFs pairs each clause on the left with each clause on the right. There
are finitely many such pairs. Each rewrite preserves truth-values, so the
final formula is equivalent to the input.

Step through the example below, then switch to DNF. Once the negations have
been pushed inward, the formula is already a DNF; it needs no distribution
in that direction.

{{< logic-app name="sat" kind="rewrite" formula="¬¬SUN ∨ ¬(RAIN ∨ ¬SUN)" >}}

### Preprocessing {#ordering-and-canonical-forms}

We could obtain either normal form directly from a truth-table, as we did
for the circuit specification: use the true rows for DNF or the false rows
for CNF. But constructing that table is precisely the expense we
wanted to avoid. Rewriting works on the formula itself, without listing
all valuations.[^canonical]

[^canonical]: For a fixed variable list, describing each true row by a full
    conjunction and disjoining gives the {{< term "canonical-normal-form" "canonical DNF" >}}.
    Excluding each false row by a full clause and conjoining gives the canonical
    CNF. Write the literals in variable order and the components in binary row
    order. These forms are then uniquely determined by the truth-table.
    The exercises return to reading off DNF.

Still, preprocessing can be expensive. Distribution copies subformulas;
a compact input can produce exponentially many clauses. For example,

$$
(SUN ∧ WARM) ∨ (RAIN ∧ WIND)
$$

becomes

$$
(SUN ∨ RAIN) ∧ (SUN ∨ WIND) ∧ (WARM ∨ RAIN) ∧ (WARM ∨ WIND).
$$

Adding $SNOW ∧ COLD$ as another disjunct doubles the number of clauses
to eight: each existing clause must be paired with $SNOW$ and with $COLD$.
Each further pair doubles the number again. Before we have
applied a single resolution step, conversion may already have used more
time and space than we can afford. The Tseytin transformation at the end
of this chapter addresses this problem.

But for a {{< term "knowledge-base" "knowledge base" >}}, for example,  we can
do some of this work in advance. Its known facts can be converted to CNF when
we store them, and the clauses reused for different queries. Only the new
formulas -- arising from queries for example -- need conversion each time.
We'll investigate this use of SAT solving in the following chapter.

## Resolution {#resolution}

We now have a method for putting a formula into CNF. Resolution uses the
clauses of this CNF to derive further clauses. The idea is that if we can
derive a _contradiction_ from these clauses using our simple resolution rule,
we can conclude that the formula is unsatisfiable. And if instead we can't,
then we can conclude that the formula _is_ satisfiable. For this to work,
however, we have to devise the rule in a smart fashion -- and to understand it,
we need to think about what it does.

We first introduce the rule and its idea, then turn to the algorithm for
refutation search.

### The resolution rule {#resolving-two-clauses}

Start with our weather inference, again: $$SUN ∨ RAIN, ¬SUN ∴ RAIN$$ Conjoin
the premises and the negation of the conclusion. This is the formula we need to
test for satisfiability. Luckily, it is already in CNF:

$$
(SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN.
$$

Its conjuncts are the clauses $SUN ∨ RAIN$, $¬SUN$, and $¬RAIN$.
For the calculation, we write these on separate lines. All the lines
have to be true together: they represent the conjunction we started with.
To make the conjunction true, we need to choose at least one literal from
each disjunctive clause and make all our choices true together. Such a choice
gives a conjunctive clause. It cannot contain complementary literals.
For example, choosing $SUN$ from the first line and $¬SUN$ from the second
would require $SUN ∧ ¬SUN$. So that choice is ruled out: from the first
line, we must choose $RAIN$. This gives our first resolution step:

{{< inference rule="resolution" >}}
$SUN ∨ RAIN$
$¬SUN$
---
$RAIN$
{{< /inference >}}

If $SUN ∨ RAIN$ is true while $SUN$ is false, $RAIN$ must be true.
The same reasoning works when both clauses contain other literals:

{{< inference rule="resolution" >}}
$SUN ∨ RAIN$
$¬SUN ∨ ¬WIND$
---
$RAIN ∨ ¬WIND$
{{< /inference >}}

Again, we cannot choose both $SUN$ and $¬SUN$. At least one choice must
come from the remaining literals, so $RAIN ∨ ¬WIND$ must be true.
We haven't ruled out choosing $SUN$ together with $¬WIND$, or $RAIN$
together with $¬SUN$. It is the complementary pair that cannot be chosen
together. The resolvent records what every compatible choice must satisfy.

{{< callout type="definition" title="Resolution rule" >}}
Two literals are {{< term "complementary-literals" "complementary" >}} {{< term "iff" "iff" >}} one
is a variable and the other is its negation. The
{{< term "resolution" "resolution rule" >}} takes two clauses containing
complementary literals, removes that pair, and forms the disjunction of
the remaining literals. The result is their
{{< term "resolvent" "resolvent" >}} on the chosen
{{< term "resolution-pivot" "pivot" >}}, the variable of that pair.
{{< /callout >}}

In general, we can write the rule as follows:

{{< inference rule="resolution on p" >}}
$A ∨ p$
$¬p ∨ B$
---
$A ∨ B$
{{< /inference >}}

Here $p$ is a propositional variable, and $A$ and $B$ stand for the
disjunctions of the remaining literals. Either may have no literals.
The pivot literals can occur anywhere in their clauses; commutativity
lets us put them in the displayed positions.

We ignore the order and repetition of literals in a clause. Associativity,
commutativity, and idempotence justify this convention. In particular,
we can remove all copies of the chosen pivot literal from each parent.
For example, resolving $SUN ∨ RAIN$ with
$¬SUN ∨ RAIN$ gives $RAIN ∨ RAIN$, which we write as $RAIN$.

Note that we remove only *one* complementary pair at a time. For example,
resolving $SUN ∨ RAIN$ with $¬SUN ∨ ¬RAIN$ on $SUN$ gives $RAIN ∨ ¬RAIN$.
Removing both pairs would incorrectly produce a contradiction from two jointly
satisfiable clauses.

We write $⊥$ for a formula that is always false, just as $⊤$ stands for
one that is always true. For example, $RAIN ∧ ¬RAIN$ is equivalent to
$⊥$. A disjunction with no literals is also always false: there is no
literal which could make it true. In terms of our choices, an empty
clause asks us to choose a true literal where there are none. That is
impossible.

{{< callout type="definition" title="Empty clause" >}}
The {{< term "empty-clause" "empty clause" >}}, written $⊥$, is a
disjunction with no literals. Its value is $0$ under every valuation.
{{< /callout >}}

Resolving the unit clauses $RAIN$ and $¬RAIN$ leaves no literals. It gives
$⊥$. We can therefore finish our weather example with a second step:

{{< inference rule="resolution" >}}
$RAIN$
$¬RAIN$
---
$⊥$
{{< /inference >}}

We have derived a contradiction from the premises and negated conclusion.
Such a derivation is a {{< term "refutation" "refutation" >}}. Since each
step preserves truth, no valuation could make all the starting formulas
true. The original inference is valid.

### Refutation search {#searching-for-a-refutation}

We now know how to derive a new requirement from two known clauses. How do we
organize these steps into a search for a contradiction?

The idea is this: We take as input a single formula. We convert it to CNF,
and then we write its conjuncts on numbered lines. For example,

$$
(SUN ∨ ¬RAIN) ∧ SUN
$$

gives us two lines:

$$1. SUN ∨ ¬RAIN
2. SUN$$

The numbered list is a
convenient way to work with the conjunction. Its entries are still
formulas, and they must all be true under the same valuation.

A disjunctive clause containing complementary literals is always true:
one of the two literals must be true, whatever the valuation. For example,
$$SUN ∨ ¬SUN ∨ RAIN$$ is a {{< term "tautology" "tautology" >}} regardless
of the weather. We call it a {{< term "tautological-clause" "tautological clause" >}}.
Such a clause puts no restriction on our choices, so we
discard it. We also keep only one copy of each clause, ignoring order and
repetitions as agreed above.

Choose two lines with complementary literals, resolve on one pair, and
form their resolvent. If the result is new and not
tautological, add it to the end of the list. Keep the parent clauses:
they may be needed again. Adding a resolvent preserves the models of
the conjunction, since any valuation making the parents true already
makes their resolvent true.

To organize the search, keep track of the pairs of lines already checked.
Choose an unchecked pair and try each complementary pivot. We give priority
to pairs containing a unit clause; among ties, try the shorter parents first.
A new clause joins the list and creates new pairs to check. Every pair will
eventually be checked unless we derive $⊥$ first.

```python
def resolution_sat(formula):
    cnf = normal_form(formula, "cnf")
    clauses = conjuncts_without_tautologies(cnf)
    if contains_empty_clause(clauses):
        return "unsatisfiable"

    checked = empty_list()
    while has_unchecked_pair(clauses, checked):
        pair = shortest_unchecked_pair(clauses, checked)
        first = first_member(pair)
        second = second_member(pair)
        for pivot in complementary_pivots(first, second):
            new = resolve(first, second, pivot)
            new = remove_repetitions(new)
            if is_empty_clause(new):
                return "unsatisfiable"
            if not is_tautology(new) and new not in clauses:
                add(clauses, new)
        add(checked, pair)

    return "satisfiable"
```

`empty_list()` starts a list with no entries. `add(list, item)` puts an
item at the end of that list. `first_member(pair)` and
`second_member(pair)` return the two clauses of a pair, one at a time.
After checking them, we record the pair itself.

`conjuncts_without_tautologies` lists the conjuncts of our CNF,
omitting those that are always true. `shortest_unchecked_pair` first
compares the length of the shorter parent, then the total length of both
parents; ties follow line order. `complementary_pivots` lists variables
occurring with opposite signs. `resolve` removes the chosen pair of
literals and disjoins what remains.

The test `new not in clauses` uses our convention: clauses with the same
literals count as the same clause, regardless of order or repetitions.

The app performs CNF preprocessing before the first displayed step.
The numbered clause cards show the resulting clauses; Next then applies resolution.
Each new clause records its parents and pivot, and the diagram below the
clauses shows that inference. Open the checked-pairs list to see which pairs
have been examined, including those that produced no new clause. To
inspect the preprocessing itself, use the rewriting app above.

{{< logic-app name="sat" kind="resolution" formula="(SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN" >}}

For the invalid inference $SUN ∨ RAIN, SUN ∴ ¬RAIN$, we test

$$
(SUN ∨ RAIN) ∧ SUN ∧ ¬¬RAIN.
$$

Double-negation rewriting removes $¬¬$. The CNF is $$(SUN ∨ RAIN) ∧ SUN ∧ RAIN$$
There are no complementary literals between its clauses, so the search ends
without deriving $⊥$. Select Invalid inference in our app to investigate this
yourself.

Here we can read off a satisfying assignment: $v(SUN) = v(RAIN) = 1$.
A {{< term "unit-clause" "unit clause" >}} fixes the value of its variable. Use these values in the
remaining clauses: a true literal satisfies its clause, while a false literal
leaves the other literals to satisfy it. If no unit fixes the remaining values,
we may need to try a choice and change it if it leads to a conflict. Check the
completed valuation against every input clause. For an inference, also check
that it makes every premise true and the conclusion false. The truth-table app
can help with this last check. Merely stopping a search before it is saturated
doesn't establish that a countermodel exists.

For the circuit verification problem, select Circuit verification in
the same app. It expands $¬(S ↔ C)$, converts it to CNF, and lists the
conjuncts before checking clause pairs. The empty clause certifies that
there is no input on which the circuit and specification disagree.
Compare Faulty circuit, where saturation leaves a satisfiable formula.

For this circuit, preprocessing gives the following retained clauses:

$$
(¬INPUT₁ ∨ ¬INPUT₂) ∧ INPUT₁ ∧ (INPUT₁ ∨ INPUT₂) ∧ INPUT₂.
$$

Resolve the first clause with $INPUT₁$ to obtain $¬INPUT₂$. Resolving this
with $INPUT₂$ gives $⊥$. Just two resolution steps suffice; the clause
$INPUT₁ ∨ INPUT₂$ isn't needed. This is why we distinguish preprocessing
from refutation search: much of the work here lies in preparing the CNF.

### Termination {#why-the-search-finishes}

How do we know that our resolution algorithm {{< term "termination" "terminates" >}}?

{{< img src="/img/drawings/gimmick_mouse.svg" width="40px" class="float-end ms-3 mx-4" >}}

{{< callout type="definition" title="Saturation" >}}
A list of clauses is
{{< term "resolution-saturation" "saturated under resolution" >}} iff resolving
any two clauses on any complementary pivot produces either a tautology or a
clause already on the list, ignoring order and repetitions.
{{< /callout >}}

For $n$ variables, a non-tautological clause can contain each variable
positively, negatively, or not at all. We can see combinatorially that there
are at most $3ⁿ$ such clauses (including the empty clause). Since we never add a
duplicate, our list cannot grow indefinitely and each pair has finitely many
pivots. In other words, the search must terminate.

But does stopping without a contradiction mean that the input formula is
satisfiable? The answer depends on a property of resolution called {{< term
"refutation-completeness" "refutation completeness" >}}: every unsatisfiable
CNF has a resolution refutation, which is stated in the following important
{{< term "theorem" "mathematical theorem" >}}:

{{< callout type="theorem" title="Soundness and refutation completeness" >}}
A propositional formula in CNF is unsatisfiable {{< term "iff" "iff" >}} resolution
can derive the empty clause from its conjuncts.
{{< /callout >}}

So there are two ways for our search to end. If we derive $⊥$, the input
is unsatisfiable. If we reach saturation without $⊥$, the input is
satisfiable: an unsatisfiable input would have allowed us to derive $⊥$.
This makes exhaustive propositional resolution a decision procedure for SAT.

In our weather example, two resolution steps suffice for a refutation.
Other inputs require many more clauses. Both CNF conversion and resolution
can take exponential time. The apps limit formula growth and stored
clauses to keep the browser responsive. If a limit is reached, the result
is still undecided; the search has not reached saturation.

What does this mean for time complexity? Both methods have exponential
worst cases, but this doesn't give them the same running time. In practice,
resolution-based methods often settle a problem long before a truth-table
search would finish. Our short refutations show how that can happen.
Truth-table search can also be improved: for example, once a partial
assignment makes the formula false regardless of the remaining variables,
we can skip all rows extending it. General results about SAT do not establish
that every algorithm must take exponential time; whether SAT has a
polynomial-time algorithm remains open. The worst case leaves plenty of
room to improve how we solve the problems we encounter.

## Tseytin transformation {#tseytin-example}


{{< callout type="note" title="Advanced topic" >}}
Tseytin conversion is a standard technique in practical SAT solving.
It makes the preprocessing stage efficient by avoiding the distribution
steps which can make ordinary CNF rewriting so expensive. The subsequent
search for a satisfying valuation or refutation can still be difficult.
The fresh variables take some getting used to. You can first work through
truth-tables and resolution, then return to this section to see how SAT
software avoids the cost of distributing large formulas.
{{< /callout >}}

We can improve the search, but we can also improve the work that comes
before it. Preparing CNF by distribution can already take exponential
time. The Tseytin transformation changes this stage: it produces an
equisatisfiable CNF whose size grows only linearly with the input.
How can we do that without changing the answer to the SAT problem?

Recall the preprocessing example $(SUN ∧ WARM) ∨ (RAIN ∧ WIND)$.
Distribution gave four clauses, and adding $SNOW ∧ COLD$ doubled this
to eight. With $n$ such pairs of distinct atoms, we get $2ⁿ$ clauses,
each containing $n$ literals. Can we describe the same satisfiability
problem without copying all these parts?

A {{< term "tseytin-transformation" "Tseytin transformation" >}} avoids
this growth by giving subformulas fresh names and constraining their
values. We first try this on one subformula, then turn it into an algorithm.

Take $(SUN ∧ RAIN) ∨ WIND$. Introduce a fresh variable $u$ for the subformula
$SUN ∧ RAIN$. We want $u$ to have precisely the value of that conjunction.
We can require this without substituting the conjunction every time we
use $u$. Instead, add three clauses which connect its value to the
original atoms:

$$
(¬u ∨ SUN) ∧ (¬u ∨ RAIN) ∧ (u ∨ ¬SUN ∨ ¬RAIN).
$$

The first two say that if $u$ is true, then $SUN$ and $RAIN$ must both be
true. The third says that if $SUN$ and $RAIN$ are both true, then $u$ must
be true as well. Together, they make $u$ behave like $SUN ∧ RAIN$.

With that condition in place, we can use $u ∨ WIND$ for the original
formula. We get the CNF

$$
(¬u ∨ SUN) ∧ (¬u ∨ RAIN) ∧ (u ∨ ¬SUN ∨ ¬RAIN) ∧ (u ∨ WIND).
$$

For example, take $SUN = 1$, $RAIN = 0$, and $WIND = 1$. The original formula
is true. We can make the new CNF true too, by assigning $u = 0$.
Assigning $u = 1$ instead would make $¬u ∨ RAIN$ false. The new variable's
value is constrained by the formula it names.

To see what the new variable does, look just at the conjunction it names:

| $SUN$ | $RAIN$ | $SUN ∧ RAIN$ | Required value of $u$ |
| --- | --- | --- | --- |
| $0$ | $0$ | $0$ | $0$ |
| $0$ | $1$ | $0$ | $0$ |
| $1$ | $0$ | $0$ | $0$ |
| $1$ | $1$ | $1$ | $1$ |

In each row, the three naming clauses allow exactly the displayed value
of $u$. With that value, $u ∨ WIND$ has the same value as
$(SUN ∧ RAIN) ∨ WIND$, whatever value we assign to $WIND$.
So whenever the original formula is true, we can make the new CNF true
by choosing the required value of $u$. Conversely, if the new CNF is
true, its naming clauses force this choice, and the original formula
must be true as well.

This means the new CNF is not logically equivalent to the original
formula over the expanded vocabulary: the original formula puts no
restriction on $u$. But the two are *equisatisfiable*.

{{< callout type="definition" title="Equisatisfiability" >}}
Two formulas are {{< term "equisatisfiable" "equisatisfiable" >}} {{< term "iff" "iff" >}} they are either
both satisfiable or both unsatisfiable.
{{< /callout >}}

SAT only asks whether a satisfying assignment exists. So an
equisatisfiable CNF is enough for our purposes. If the solver finds a
model of this CNF, forgetting the value of $u$ gives a model of the
original formula. Conversely, every model of the original formula
extends to a model of the CNF by giving $u$ the value of $SUN ∧ RAIN$.

### Local constraints

To apply the method to any formula in our language, we need constraints
for each connective. We'll keep using $SUN$ and $RAIN$ to see what these
constraints say. In each example, $u$ is a fresh name for the formula
we are describing.

- For $¬SUN$, introduce a fresh name $u$ and add:

  $$
  (¬u ∨ ¬SUN) ∧ (u ∨ SUN).
  $$

  The first clause rules out $u = SUN = 1$; the second rules out
  $u = SUN = 0$. So $u$ and $SUN$ must have opposite values.

- For $SUN ∧ RAIN$, introduce a fresh name $u$ and add:

  $$
  (¬u ∨ SUN) ∧ (¬u ∨ RAIN) ∧ (u ∨ ¬SUN ∨ ¬RAIN).
  $$

  The first two clauses require $SUN$ and $RAIN$ to be true whenever
  $u$ is true. The third requires $u$ to be true whenever both
  $SUN$ and $RAIN$ are true. Together, they give $u$ exactly the
  value of the conjunction.

- For $SUN ∨ RAIN$, introduce a fresh name $u$ and add:

  $$
  (u ∨ ¬SUN) ∧ (u ∨ ¬RAIN) ∧ (¬u ∨ SUN ∨ RAIN).
  $$

  The first two clauses require $u$ to be true whenever $SUN$ or
  $RAIN$ is true. The third requires at least one of $SUN$ and $RAIN$
  to be true whenever $u$ is true.

- For $SUN ↔ RAIN$, introduce a fresh name $u$ and add:

  $$
  (¬u ∨ ¬SUN ∨ RAIN) ∧ (¬u ∨ SUN ∨ ¬RAIN)
  ∧ (u ∨ SUN ∨ RAIN) ∧ (u ∨ ¬SUN ∨ ¬RAIN).
  $$

  The first two clauses require $SUN$ and $RAIN$ to agree when $u = 1$;
  the last two require them to disagree when $u = 0$. Using these
  clauses directly avoids copying the parts of a biconditional
  during rewriting.

The same patterns work when the parts are larger formulas. Suppose we
have already named them $u₁$ and $u₂$. To name their disjunction, for
example, use the disjunction clauses above with $u₁$ in place of $SUN$
and $u₂$ in place of $RAIN$. We only need the values of the parts, so
we can use their names without copying the formulas they stand for.

### The procedure

Parse the input formula and work upward from the leaves. A variable
already has a name, so leave it as it is. At each connective node,
introduce a fresh variable and add the appropriate constraints from
above, using the names already assigned to its children. Finally,
add the name of the root as a unit clause. This last step requires
the whole original formula to be true.

```python
def tseytin(formula):
    tree = parse(formula)
    constraints = empty_list()

    for node in children_first(tree):
        if is_variable(node):
            record_name(node, variable(node))
        else:
            name = fresh_variable()
            record_name(node, name)
            clauses = local_clauses(node)
            add_all(constraints, clauses)

    add(constraints, name_of(root(tree)))
    return conjunction(constraints)
```

`children_first` lists the nodes with each child before its parent.
`record_name` keeps a name beside a node; `name_of` reads it back.
At a variable, we record the variable itself. Otherwise, the `else`
branch chooses a fresh name, different from every input variable and
previously chosen name.

`local_clauses` selects the constraints for the node's connective,
using its recorded name and the names of its children. Those names are
available because we have already visited the children. `add_all` adds
each clause to our list. Finally, we add the root's name, and
`conjunction` joins all the collected clauses with $∧$.

For a variable on its own, there are no local constraints: the result
is that variable as a unit clause. In general, the local constraints
alone can be satisfied for *any* input assignment by giving the fresh
variables the calculated values. We must assert the root to encode
satisfiability of the input formula.

### A worked-out transformation {#a-worked-transformation}

Return to $(SUN ∧ RAIN) ∨ WIND$. The full algorithm gives $SUN ∧ RAIN$ the name
$u₁$, then gives $u₁ ∨ WIND$ the name $u₂$. We obtain

$$
(¬u₁ ∨ SUN) ∧ (¬u₁ ∨ RAIN) ∧ (u₁ ∨ ¬SUN ∨ ¬RAIN)
$$

$$
∧ (u₂ ∨ ¬u₁) ∧ (u₂ ∨ ¬WIND) ∧ (¬u₂ ∨ u₁ ∨ WIND) ∧ u₂.
$$

There are two naming steps here. The first three clauses require $u₁$
to have the value of $SUN ∧ RAIN$. The next three require $u₂$ to have
the value of $u₁ ∨ WIND$. So far, we have only described how to calculate
the formula. The final clause $u₂$ requires the result to be true.
For $SUN = 1$, $RAIN = 0$, $WIND = 1$, the constraints give $u₁ = 0$ and
$u₂ = 1$, so every clause is true. With $WIND = 0$ instead, they force
$u₂ = 0$ and the final clause fails.

{{< logic-app name="sat" kind="tseytin" formula="(SUN ∧ RAIN) ∨ WIND" >}}

The app follows the pseudocode: each step names a connective after its
children and adds its local clauses. The last step asserts the root.
Try Distribution growth and compare the number of generated clauses
with the ordinary CNF rewrite. Circuit verification applies the same
procedure to our comparison formula, including its biconditional.

For an unsatisfiable example, take $SUN ∧ ¬SUN$. Give $¬SUN$ the name
$u₁$ and the whole conjunction the name $u₂$:

$$
(¬u₁ ∨ ¬SUN) ∧ (u₁ ∨ SUN)
∧ (¬u₂ ∨ SUN) ∧ (¬u₂ ∨ u₁)
∧ (u₂ ∨ ¬SUN ∨ ¬u₁) ∧ u₂.
$$

The last clause requires $u₂ = 1$, so the conjunction constraints
require both $SUN = 1$ and $u₁ = 1$. But $¬u₁ ∨ ¬SUN$ rules that out.
The encoding is unsatisfiable too. Select Contradiction in the transformation app to follow these steps.

Each connective contributes one fresh variable and at most four clauses
of at most three literals. Thus the number of clauses and literal
occurrences grows linearly with the input's parse tree. Distribution
can copy a large subformula many times; these local constraints refer
to its name instead. The SAT search may still be expensive, but this
conversion avoids the exponential growth caused by distribution.

Tseytin transformation remains part of state-of-the-art SAT solving. Its
linear growth makes it useful in practice: we can give the solver a compact
input without changing whether a satisfying valuation exists.

We've reduced two automated reasoning problems to SAT: a circuit fails
its specification {{< term "iff" "iff" >}} the comparison formula is satisfiable, and an
inference is invalid {{< term "iff" "iff" >}} its premises and negated conclusion are jointly
satisfiable. Truth-tables and resolution answer these questions
algorithmically. Tseytin conversion lets us prepare the input without
first expanding an exponentially large CNF.

These techniques can also power expert systems: represent facts and
rules as formulas, then test which conclusions follow. In the coming
chapters, we'll study this application alongside further questions about
conditionals and reasoning. The next step is to examine the rules
expressed by "if …, then …" in
{{< chapter_ref chapter="conditionals" >}}Conditionals{{< /chapter_ref >}}.

## Further readings {.readings .nocount}

- Russell and Norvig, [*Artificial Intelligence: A Modern Approach*, 4th edition](https://aima.cs.berkeley.edu/), chapter 7, for truth-tables, resolution, SAT solving, and propositional agents.
- Audrey Yap and Richard Zach, [*What If?* (PDF)](https://builds.openlogicproject.org/courses/what-if/wi-screen.pdf), chapter 1, for the propositional semantics underlying these satisfiability tests.
