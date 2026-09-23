---
title: Boolean SAT
author: Johannes Korbmacher
locked: false
weight: 50
params:
  id: exc-sat
---

# Truth-function representations {.solved}

Apply both techniques from {{< chapter_ref chapter="sat" id="checking-a-circuit" >}}Boolean SAT{{< /chapter_ref >}} to each function below:

Use $INPUT₁$ for the input down the left and $INPUT₂$ for the input
across the top.

1. Describe each row with output $1$ by a conjunction, then disjoin the descriptions to obtain DNF.
2. Exclude each row with output $0$ by a disjunction, then conjoin these clauses to obtain CNF.
3. Simplify where possible. Explain why the two descriptions have the same truth-values.

<div class="function-tables">

{{< function-table name="AND" >}}
{"rows":["0","1"],"columns":["0","1"],"values":[["0","0"],["0","1"]]}
{{< /function-table >}}

{{< function-table name="XOR" >}}
{"rows":["0","1"],"columns":["0","1"],"values":[["0","1"],["1","0"]]}
{{< /function-table >}}

{{< function-table name="XNOR" >}}
{"rows":["0","1"],"columns":["0","1"],"values":[["1","0"],["0","1"]]}
{{< /function-table >}}

{{< function-table name="NOR" >}}
{"rows":["0","1"],"columns":["0","1"],"values":[["1","0"],["0","0"]]}
{{< /function-table >}}

</div>

Check your descriptions below. Both fully bracketed formulas and the
chapter's bracketing conventions are accepted. Equivalent answers count,
provided they are in the requested normal form.

{{< logic-app name="sat-practice" kind="normal-form" >}}

## Solution {.solution #truth-function-representationsSolution}

The descriptions read directly from the rows are:

| Function | DNF | CNF |
| --- | --- | --- |
| $!!AND!!$ | $INPUT₁ ∧ INPUT₂$ | $(INPUT₁ ∨ INPUT₂) ∧ (INPUT₁ ∨ ¬INPUT₂) ∧ (¬INPUT₁ ∨ INPUT₂)$ |
| $!!XOR!!$ | $(¬INPUT₁ ∧ INPUT₂) ∨ (INPUT₁ ∧ ¬INPUT₂)$ | $(INPUT₁ ∨ INPUT₂) ∧ (¬INPUT₁ ∨ ¬INPUT₂)$ |
| $!!XNOR!!$ | $(¬INPUT₁ ∧ ¬INPUT₂) ∨ (INPUT₁ ∧ INPUT₂)$ | $(INPUT₁ ∨ ¬INPUT₂) ∧ (¬INPUT₁ ∨ INPUT₂)$ |
| $!!NOR!!$ | $¬INPUT₁ ∧ ¬INPUT₂$ | $(INPUT₁ ∨ ¬INPUT₂) ∧ (¬INPUT₁ ∨ INPUT₂) ∧ (¬INPUT₁ ∨ ¬INPUT₂)$ |

The CNF for $!!AND!!$ simplifies to $INPUT₁ ∧ INPUT₂$; that for $!!NOR!!$ simplifies
to $¬INPUT₁ ∧ ¬INPUT₂$. Both are also DNFs. The XOR and XNOR descriptions already
have two clauses or terms. DNF includes exactly the rows requiring $1$;
CNF excludes exactly the rows requiring $0$. They therefore describe the
same function.

# Circuit representations {.solved}

Read each circuit from its inputs to its lamp. Write a formula using only
$¬$ and $∧$ to describe the lamp's output. A default-off relay conjoins
its magnet input and signal supply; a powered default-on relay negates
its magnet input. Treat the fixed supply as $1$.

Use the level buttons to move between the five circuits. Enter your
description above the circuit; Check compares it with the lamp on every
input. You can also try the switches yourself. Which descriptions are
already in DNF or CNF?

{{< logic-app name="sat-practice" kind="circuit" >}}

## Solution {.solution #circuit-representationsSolution}

1. The default-off relay gives $INPUT₁ ∧ INPUT₂$. This is both DNF and CNF.
2. The first relay gives $INPUT₁ ∧ INPUT₂$. The powered default-on relay negates it,
   giving $¬(INPUT₁ ∧ INPUT₂)$. This is neither normal form as written. De Morgan's
   law gives $¬INPUT₁ ∨ ¬INPUT₂$, which is both DNF and CNF.
3. The default-on relay gives $¬INPUT₁$. This becomes the magnet input of the
   default-off relay, whose signal supply is $INPUT₂$. The output is $¬INPUT₁ ∧ INPUT₂$,
   both DNF and CNF.

4. The first two relays give $¬(INPUT₁ ∧ INPUT₂)$. Conjoining this with $INPUT₃$
   gives $¬(INPUT₁ ∧ INPUT₂) ∧ INPUT₃$. De Morgan gives the CNF $(¬INPUT₁ ∨ ¬INPUT₂) ∧ INPUT₃$.
5. The two branches give $¬(INPUT₁ ∧ INPUT₂)$ and $¬(INPUT₂ ∧ INPUT₃)$. Their outputs
   feed the final default-off relay, giving $¬(INPUT₁ ∧ INPUT₂) ∧ ¬(INPUT₂ ∧ INPUT₃)$.
   De Morgan gives the CNF $(¬INPUT₁ ∨ ¬INPUT₂) ∧ (¬INPUT₂ ∨ ¬INPUT₃)$.

# Equivalence {.solved}

The $!!XNOR!!$ function returns $1$ iff its inputs agree. What happens
when we change the inputs, or use it to compare more than two values?

1. Negate one input of $SUN ↔ RAIN$. Describe the resulting function
   using $¬$, $∧$, and $∨$.
2. Negate both inputs. How does the resulting function compare with the
   original? Give a formula for it.
3. Find a formula which is true iff $SUN$, $RAIN$, and $WIND$ all have
   the same value. Does $(SUN ↔ RAIN) ↔ WIND$ do this? If not,
   give an assignment on which it fails.

The three levels show the required tables. Enter your formula in the final
column heading to check it. Explain your answers on paper as well.

{{< logic-app name="sat-practice" kind="mystery" deck="equivalence" >}}

## Solution {.solution #equivalenceSolution}

1. Negating one input switches agreement and disagreement. We obtain
   XOR, described by $(SUN ∧ ¬RAIN) ∨ (¬SUN ∧ RAIN)$.
2. Negating both preserves agreement: $¬SUN ↔ ¬RAIN$ is equivalent
   to $SUN ↔ RAIN$.
3. One answer is $(SUN ↔ RAIN) ∧ (RAIN ↔ WIND)$. If both comparisons
   hold, all three values agree. Another is
   $(SUN ∧ RAIN ∧ WIND) ∨ (¬SUN ∧ ¬RAIN ∧ ¬WIND)$.
   Chaining $↔$ does something different: when all three values are $0$,
   $(SUN ↔ RAIN) ↔ WIND$ evaluates to $1 ↔ 0$, hence $0$.
   The values agree, but the chained formula is false.

# Working with pseudocode {.solved #pseudocode}

The algorithms in this chapter use a few ideas beyond the first parsing
example. Practise them here before combining them in a SAT algorithm.

- `while condition:` repeats its indented instructions while the condition
  holds. Something in the loop must bring us closer to stopping.
- `empty_list()` creates a list with no entries. `add(list, item)` adds
  one item at its end; `add_all(list, items)` adds each supplied item.
- `first_member(pair)` and `second_member(pair)` return the two members
  of a pair, one at a time. For example, the members of `(1, 2)` are $1$ and $2$.
- `record_name(node, name)` keeps a name beside a tree node; `name_of(node)`
  reads it back. This lets later steps use an earlier result.

Remember: `=` assigns a value, while `==` tests equality. The app prompts
explain the helpers used in each example.

1. Complete the four examples. Explain what each takes as input and returns.

   {{< logic-app name="pseudocode-practice" deck="sat" >}}

2. Trace `count_down(3)` by writing down which calculation steps it performs.
   Include the value of `number` after each assignment.
   What happens with input $0$? What happens with input $3$ if we remove
   the assignment inside the loop?
3. Write a procedure `count_ones(values)` which returns the number of ones
   in a finite list of zeros and ones. Use a counter, `for`, and `if`.
   Trace it on `[0, 1, 1]` and on an empty list. Why does it finish?
4. Trace `check_pairs` on `[(1, 2), (1, 3)]`. What is in `checked`
   after each iteration? What would change if `return checked` were
   indented inside the loop?
5. Trace `name_parts` on $¬SUN ∨ RAIN$, visiting the left child before
   the right and using fresh names $u₁$, $u₂$, … . List the nodes in
   visit order and their names. Does naming them alone make the original
   formula true?

## Solution {.solution #pseudocodeSolution}

1. The gaps, in order, are:

   - Repeat while needed: `while`, `=`. It takes a nonnegative whole number
     and returns $0$.
   - Collect matching values: `empty_list`, `==`, `add`. It takes a list
     of zeros and ones and returns a list containing its ones.
   - Record checked pairs: `for`, `in`, `add`. It takes pairs of clause
     numbers, checks each, and returns the list of checked pairs.
   - Name the parts first: `for`, `if`, `else`. It takes a parse tree,
     records names for its nodes, and returns the root's name.

2. The successive values are $2$, $1$, and $0$. The procedure returns $0$.
   With input $0$, the loop is skipped. Without the assignment, input $3$
   keeps satisfying `number > 0`, so the procedure never finishes.
3. One solution is:

   ```python
   def count_ones(values):
       count = 0
       for value in values:
           if value == 1:
               count = count + 1
       return count
   ```

   The counter starts at $0$, then has values $0$, $1$, and $2$ after
   the three iterations. The answer is $2$. An empty list gives $0$.
   Each iteration handles one entry of a finite list.
4. The list is first `[(1, 2)]`, then `[(1, 2), (1, 3)]`. A `return`
   inside the loop would finish after the first pair, leaving the second
   unchecked. With an empty input, that misplaced `return` would never
   be reached.
5. The visit order and names are $SUN$: $SUN$; $¬SUN$: $u₁$;
   $RAIN$: $RAIN$; $¬SUN ∨ RAIN$: $u₂$. The procedure returns $u₂$.
   Names alone impose no truth-value requirements. Tseytin conversion
   must also add the local constraints and the root clause.

# Truth tables {.solved}

Use the app to construct a truth-table for each of the formulas shown
in its level buttons. First identify the distinct variables: enter their
names separated by commas, for example `SUN, RAIN`. How many rows do we need?

The app supplies these rows and the parse tree. Match each empty column
heading to a compound node in the tree, working from the smallest
subformulas upward. Then calculate the entries yourself. Selecting a cell
highlights its subformula and shows that row's variable values in the tree.
Which formulas are satisfiable? Which are tautologies?

{{< logic-app name="sat-practice" kind="table" >}}

## Solution {.solution #truth-tablesSolution}

There are four rows for levels 1–4 and 6, and eight for level 5. The
formulas in levels 1–5 are satisfiable; level 6 is unsatisfiable. None
is a tautology. Here are the completed tables, with variables in the
same alphabetical order as the app:

Level 1:

| $RAIN$ | $SUN$ | $¬RAIN$ | $SUN ∧ ¬RAIN$ |
| --- | --- | --- | --- |
| $0$ | $0$ | $1$ | $0$ |
| $0$ | $1$ | $1$ | $1$ |
| $1$ | $0$ | $0$ | $0$ |
| $1$ | $1$ | $0$ | $0$ |

Level 2:

| $RAIN$ | $SUN$ | $SUN ∧ RAIN$ | $¬(SUN ∧ RAIN)$ |
| --- | --- | --- | --- |
| $0$ | $0$ | $0$ | $1$ |
| $0$ | $1$ | $0$ | $1$ |
| $1$ | $0$ | $0$ | $1$ |
| $1$ | $1$ | $1$ | $0$ |

Level 3:

| $RAIN$ | $SUN$ | $SUN ∨ RAIN$ | $¬SUN$ | $(SUN ∨ RAIN) ∧ ¬SUN$ |
| --- | --- | --- | --- | --- |
| $0$ | $0$ | $0$ | $1$ | $0$ |
| $0$ | $1$ | $1$ | $0$ | $0$ |
| $1$ | $0$ | $1$ | $1$ | $1$ |
| $1$ | $1$ | $1$ | $0$ | $0$ |

Level 4:

| $RAIN$ | $SUN$ | $SUN ↔ RAIN$ |
| --- | --- | --- |
| $0$ | $0$ | $1$ |
| $0$ | $1$ | $0$ |
| $1$ | $0$ | $0$ |
| $1$ | $1$ | $1$ |

Level 5:

| $RAIN$ | $SUN$ | $WIND$ | $¬RAIN$ | $¬RAIN ∧ WIND$ | $SUN ∨ (¬RAIN ∧ WIND)$ |
| --- | --- | --- | --- | --- | --- |
| $0$ | $0$ | $0$ | $1$ | $0$ | $0$ |
| $0$ | $0$ | $1$ | $1$ | $1$ | $1$ |
| $0$ | $1$ | $0$ | $1$ | $0$ | $1$ |
| $0$ | $1$ | $1$ | $1$ | $1$ | $1$ |
| $1$ | $0$ | $0$ | $0$ | $0$ | $0$ |
| $1$ | $0$ | $1$ | $0$ | $0$ | $0$ |
| $1$ | $1$ | $0$ | $0$ | $0$ | $1$ |
| $1$ | $1$ | $1$ | $0$ | $0$ | $1$ |

Level 6:

| $RAIN$ | $SUN$ | $SUN ∨ RAIN$ | $¬SUN$ | $(SUN ∨ RAIN) ∧ ¬SUN$ | $¬RAIN$ | $(SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN$ |
| --- | --- | --- | --- | --- | --- | --- |
| $0$ | $0$ | $0$ | $1$ | $0$ | $1$ | $0$ |
| $0$ | $1$ | $1$ | $0$ | $0$ | $1$ | $0$ |
| $1$ | $0$ | $1$ | $1$ | $1$ | $0$ | $0$ |
| $1$ | $1$ | $1$ | $0$ | $0$ | $0$ | $0$ |

# Missing truth-values {.solved}

Complete the gaps. The given entries are correct. For each missing value,
identify the connective whose function table determines it.

{{< logic-app name="sat-practice" kind="gaps" >}}

Select a formula above the table to change levels. Selecting a missing
entry highlights the corresponding part of the parse tree.

## Solution {.solution #missing-truth-valuesSolution}

Negation switches $0$ and $1$. Conjunction gives $1$ iff both inputs are
$1$; disjunction gives $1$ iff at least one is $1$. The biconditional
gives $1$ iff its inputs agree. Applying these rules gives:

Level 1:

| $RAIN$ | $SUN$ | $SUN ∧ RAIN$ | $¬(SUN ∧ RAIN)$ |
| --- | --- | --- | --- |
| $0$ | $0$ | $0$ | $1$ |
| $0$ | $1$ | $0$ | $1$ |
| $1$ | $0$ | $0$ | $1$ |
| $1$ | $1$ | $1$ | $0$ |

Level 2:

| $RAIN$ | $SUN$ | $SUN ∨ RAIN$ | $¬SUN$ | $(SUN ∨ RAIN) ∧ ¬SUN$ |
| --- | --- | --- | --- | --- |
| $0$ | $0$ | $0$ | $1$ | $0$ |
| $0$ | $1$ | $1$ | $0$ | $0$ |
| $1$ | $0$ | $1$ | $1$ | $1$ |
| $1$ | $1$ | $1$ | $0$ | $0$ |

Level 3:

| $RAIN$ | $SUN$ | $¬RAIN$ | $SUN ↔ ¬RAIN$ |
| --- | --- | --- | --- |
| $0$ | $0$ | $1$ | $0$ |
| $0$ | $1$ | $1$ | $1$ |
| $1$ | $0$ | $0$ | $1$ |
| $1$ | $1$ | $0$ | $0$ |

Level 4:

| $RAIN$ | $SUN$ | $WIND$ | $SUN ∧ WIND$ | $¬RAIN$ | $(SUN ∧ WIND) ∨ ¬RAIN$ |
| --- | --- | --- | --- | --- | --- |
| $0$ | $0$ | $0$ | $0$ | $1$ | $1$ |
| $0$ | $0$ | $1$ | $0$ | $1$ | $1$ |
| $0$ | $1$ | $0$ | $0$ | $1$ | $1$ |
| $0$ | $1$ | $1$ | $1$ | $1$ | $1$ |
| $1$ | $0$ | $0$ | $0$ | $0$ | $0$ |
| $1$ | $0$ | $1$ | $0$ | $0$ | $0$ |
| $1$ | $1$ | $0$ | $0$ | $0$ | $0$ |
| $1$ | $1$ | $1$ | $1$ | $0$ | $1$ |

# Mystery formula {.solved}

Find a formula for each table. Any formula with the right truth-values
counts; different spellings can describe the same function. Try to find
a short one. You may leave out variables that do not affect the result.
Enter your formula in the final column heading. The app gives a
counterexample whenever it disagrees with the table.

{{< logic-app name="sat-practice" kind="mystery" >}}

## Solution {.solution #mystery-formulaSolution}

One answer for each level is:

1. $¬SUN$
2. $SUN ∧ RAIN$
3. $SUN ∨ RAIN$
4. $¬(SUN ∧ RAIN)$
5. $(SUN ∧ ¬RAIN) ∨ (¬SUN ∧ RAIN)$
6. $SUN ↔ RAIN$
7. $SUN ∨ ¬WIND$
8. $(SUN ∧ RAIN) ∨ WIND$

For level 7, changing $RAIN$ never changes the result. This is why it
need not occur in the answer. Reading off DNF or CNF gives an answer
for every level, though it need not be the shortest one.

# Normal Forms {.solved}

Rewrite each formula into DNF and CNF. Name the laws you use. You may
simplify repetitions, contradictions, and tautological clauses, but these
simplifications are not required merely to reach normal form.

1. $RAIN ∧ ¬(SUN ∨ ¬RAIN)$
2. $¬RAIN ∨ ¬(¬RAIN ∨ WIND)$
3. $(RAIN ∧ ¬SUN) ∨ (¬RAIN ∧ ¬SUN)$
4. $SUN ∨ (RAIN ∧ WIND)$
5. $(SUN ∨ RAIN) ∧ (¬SUN ∨ WIND)$
6. $¬(SUN ↔ RAIN)$

## Solution {.solution #normal-formsSolution}

1. De Morgan and double negation give $RAIN ∧ ¬SUN ∧ RAIN$.
   Idempotence gives $RAIN ∧ ¬SUN$, both DNF and CNF.
2. De Morgan and double negation give the DNF
   $¬RAIN ∨ (RAIN ∧ ¬WIND)$. Distribution gives the CNF
   $(¬RAIN ∨ RAIN) ∧ (¬RAIN ∨ ¬WIND)$. Its first clause is a
   tautology, so $¬RAIN ∨ ¬WIND$ is also an answer in both forms.
3. Factoring out $¬SUN$ gives $(RAIN ∨ ¬RAIN) ∧ ¬SUN$, equivalent
   to $¬SUN$. This is both DNF and CNF. The original is already a DNF.
4. The original is DNF. Distribution gives the CNF
   $(SUN ∨ RAIN) ∧ (SUN ∨ WIND)$.
5. The original is CNF. Distribution gives the DNF

   $$
   (SUN ∧ ¬SUN) ∨ (SUN ∧ WIND) ∨ (RAIN ∧ ¬SUN) ∨ (RAIN ∧ WIND).
   $$

   The first term can be removed because it is always false.
6. Eliminate $↔$, then push the negation inward. The result is the DNF
   $(SUN ∧ ¬RAIN) ∨ (¬SUN ∧ RAIN)$. Distribution gives four clauses;
   discard the two tautologies to obtain the CNF
   $(SUN ∨ RAIN) ∧ (¬SUN ∨ ¬RAIN)$.

# Resolution {.solved}

Each level starts with a CNF. Its conjuncts appear as numbered clauses.
Select two clauses, choose one pivot, and apply resolution. Keep going
until you derive $⊥$, or until every possible resolution has been checked.
In the latter case, use the Saturated? button. The app keeps the parents
and records checks which give tautologies or clauses already present.

{{< logic-app name="sat-practice" kind="resolution" >}}

For each satisfiable input, also give a satisfying valuation on paper.

## Solution {.solution #resolutionSolution}

1. Resolve $SUN ∨ RAIN$ with $¬SUN$ on $SUN$, obtaining $RAIN$.
   Resolve with $¬RAIN$ to derive $⊥$.
2. Resolve the two input clauses on $RAIN$, obtaining $SUN ∨ ¬WIND$.
   There are no further complementary pairs. A satisfying valuation is
   $SUN = 1$, $RAIN = 0$, $WIND = 0$.
3. Resolve on $WIND$, obtaining $¬SUN ∨ ¬RAIN$. There are no further
   complementary pairs. Take $SUN = RAIN = WIND = 0$.
4. Resolve the first two clauses on $RAIN$ to obtain $SUN$, and the
   last two on $RAIN$ to obtain $¬SUN$. Resolving these gives $⊥$.
5. No clauses contain complementary literals. The input is already
   saturated; take $SUN = RAIN = 1$.
6. Resolving on $SUN$ gives $RAIN ∨ ¬RAIN$; resolving on $RAIN$
   gives $SUN ∨ ¬SUN$. Both are tautologies and impose no new
   requirement. After both checks, the input is saturated. Take
   $SUN = 1$, $RAIN = 0$. Removing both complementary pairs in
   one step would be unsound.

7. The first two clauses have two possible pivots, but either choice
   gives a tautology. A shorter route uses the units: resolve
   $¬SUN ∨ ¬RAIN$ with $SUN$ to get $¬RAIN$, then with $RAIN$ to get $⊥$.
8. Resolve $¬WIND ∨ SNOW$ with $¬SNOW$ to get $¬WIND$. Resolving this
   with $¬SUN ∨ WIND$ and with $¬RAIN ∨ WIND$ gives $¬SUN$ and $¬RAIN$.
   Resolve $SUN ∨ RAIN$ with $¬SUN$ to get $RAIN$, then with $¬RAIN$
   to get $⊥$.

# Valid inference {.solved}

Check each inference shown in the app by truth-table and by resolution.
Decide which SAT problem will tell you whether the inference is valid. For an invalid inference, give a countermodel.

For resolution, convert your SAT formula to CNF and enter its clauses in
the input field. You can join them with $∧$, or separate them with commas.
For example, `(SUN ∨ RAIN), ¬SUN` supplies two clauses. The app checks
that your clauses express the right SAT problem; you then choose the
resolution steps yourself.

{{< logic-app name="sat-practice" kind="resolution" deck="inference" >}}

You may use the rewriting app below to help with conversion. Decide which
formula to put in before you start.

<details>
<summary>CNF rewriting</summary>

{{< logic-app name="sat" kind="rewrite" blank="true" >}}

</details>

## Solution {.solution #valid-inferenceSolution}

1. Test $¬RAIN ∧ ¬(RAIN ∨ (¬RAIN ∧ SUN))$. Its CNF simplifies to
   $¬RAIN ∧ (RAIN ∨ ¬SUN)$. Resolution gives $¬SUN$ and then
   saturates. The countermodel $RAIN = SUN = 0$ makes the premise
   true and conclusion false.
2. Test $(RAIN ∨ (RAIN ∧ WIND)) ∧ ¬(RAIN ∨ SUN)$. Its CNF is
   $RAIN ∧ (RAIN ∨ WIND) ∧ ¬RAIN ∧ ¬SUN$. Resolve $RAIN$ and
   $¬RAIN$ to obtain $⊥$. The inference is valid.

3. The SAT formula is already CNF:
   $(SUN ∨ RAIN) ∧ (¬SUN ∨ WIND) ∧ (¬RAIN ∨ WIND) ∧ ¬WIND$.
   Resolve the second and third clauses with $¬WIND$ to get $¬SUN$
   and $¬RAIN$. These refute the first clause. The inference is valid.
4. The CNF is $(SUN ∨ RAIN) ∧ (¬SUN ∨ WIND) ∧ ¬WIND$.
   Resolution gives $¬SUN$, then $RAIN$, and saturates. Take
   $SUN = WIND = 0$ and $RAIN = 1$: both premises are true, but
   the conclusion is false.
5. The CNF is $(SUN ∨ RAIN) ∧ (¬SUN ∨ WIND) ∧ (¬RAIN ∨ SNOW)
   ∧ ¬WIND ∧ ¬SNOW$. The last two clauses give $¬SUN$ and $¬RAIN$
   by resolution with the second and third. These refute $SUN ∨ RAIN$.
   The inference is valid.

For the truth-table check, the final columns of these two SAT formulas
are as follows. A $1$ marks a countermodel:

| $RAIN$ | $SUN$ | First SAT formula |
| --- | --- | --- |
| $0$ | $0$ | $1$ |
| $0$ | $1$ | $0$ |
| $1$ | $0$ | $0$ |
| $1$ | $1$ | $0$ |

The second SAT formula is $0$ on all eight assignments to $RAIN$, $SUN$,
and $WIND$: its first part requires $RAIN = 1$, while its second
requires $RAIN = 0$. The third and fifth SAT formulas are likewise always
$0$. The fourth has just one satisfying row: $RAIN = 1$, $SUN = WIND = 0$.

# Comparing the algorithms {.solved}

1. Does resolution always outperform truth-table search? Explain the
   difference between a worst-case bound and the work on a particular input.
2. Suppose truth-table search tries the all-zero assignment first.
   Compare it with resolution on $(¬SUN ∨ RAIN) ∧ (SUN ∨ ¬RAIN)$
   and on $¬SUN ∨ ¬RAIN$. Count rows examined and resolution steps
   separately. Is that enough to compare running times?
3. A formula has $10$ variables. How many rows does its full table have?
   What if we add $5$ variables? Must a SAT search always examine them all?
4. Why can an input with few symbols still be expensive to prepare for
   resolution? Use $(SUN ∧ WARM) ∨ (RAIN ∧ WIND)$ as a starting point.

## Solution {.solution #comparing-the-algorithmsSolution}

1. No. Both algorithms have expensive worst cases, but that does not
   determine which is faster on a given input. Resolution may find a
   short refutation; truth-table search may find a satisfying row early.
   General results about SAT do not give all algorithms identical costs.
2. For the first formula, $00$ already succeeds, so truth-table search
   examines one row. Resolution checks the two pivots; both
   resolvents are tautologies, so it saturates. For the second formula,
   the first row already satisfies it. Resolution has one clause and no
   pair to examine. Neither count includes all the work: parsing,
   evaluation, CNF preparation, and finding or checking clause pairs
   also take time. These examples give no universal speed ranking.
3. The tables have $2¹⁰ = 1024$ and $2¹⁵ = 32768$ rows, respectively.
   A SAT search can stop at a satisfying row. If none exists, the
   chapter's straightforward table search examines every row.
4. Distribution copies parts of formulas. The displayed input gives
   four CNF clauses. Adding another disjunct consisting of two fresh
   atoms doubles this to eight. With $n$ such pairs, there are $2ⁿ$
   clauses, although the input grows only by one pair at a time.

# Tseytin transformation {.solved}

Apply the chapter's algorithm to the formulas below. Work from the leaves
upward, visiting the left child before the right. Use fresh names $u₁$,
$u₂$, … in that order. Write the local constraints and the final clause
which requires the root to be true.

1. $¬(SUN ∧ RAIN)$
2. $(SUN ∨ RAIN) ∧ ¬WIND$
3. $(SUN ∧ RAIN) ∨ (¬SUN ∧ WIND)$
4. $(SUN ∧ RAIN) ∨ (WIND ∧ SNOW)$
5. $(SUN ∨ RAIN) ∧ (¬SUN ∧ ¬RAIN)$

For each satisfiable formula, extend one satisfying valuation to the
fresh variables. Explain why we cannot omit the final root clause, and
why the result is equisatisfiable rather than logically equivalent over
the expanded vocabulary. For formula 4, also compare the result with the
CNF obtained by distribution: which uses fewer clauses here? What if we
keep adding disjuncts consisting of two fresh atoms?

## Solution {.solution #tseytin-transformationSolution}

Each row below gives one naming step and its local constraints. Conjoin
all the constraints for that formula and add the stated root clause.

1. For $¬(SUN ∧ RAIN)$:

   | Name | Subformula, using earlier names | Local constraints |
   | --- | --- | --- |
   | $u₁$ | $SUN ∧ RAIN$ | $(¬u₁ ∨ SUN) ∧ (¬u₁ ∨ RAIN) ∧ (u₁ ∨ ¬SUN ∨ ¬RAIN)$ |
   | $u₂$ | $¬u₁$ | $(¬u₂ ∨ ¬u₁) ∧ (u₂ ∨ u₁)$ |

   Add the root clause $u₂$. Take $SUN = RAIN = 0$, $u₁ = 0$, and $u₂ = 1$.

2. For $(SUN ∨ RAIN) ∧ ¬WIND$:

   | Name | Subformula, using earlier names | Local constraints |
   | --- | --- | --- |
   | $u₁$ | $SUN ∨ RAIN$ | $(u₁ ∨ ¬SUN) ∧ (u₁ ∨ ¬RAIN) ∧ (¬u₁ ∨ SUN ∨ RAIN)$ |
   | $u₂$ | $¬WIND$ | $(¬u₂ ∨ ¬WIND) ∧ (u₂ ∨ WIND)$ |
   | $u₃$ | $u₁ ∧ u₂$ | $(¬u₃ ∨ u₁) ∧ (¬u₃ ∨ u₂) ∧ (u₃ ∨ ¬u₁ ∨ ¬u₂)$ |

   Add the root clause $u₃$. Take $SUN = 1$, $RAIN = WIND = 0$, and $u₁ = u₂ = u₃ = 1$.

3. For $(SUN ∧ RAIN) ∨ (¬SUN ∧ WIND)$:

   | Name | Subformula, using earlier names | Local constraints |
   | --- | --- | --- |
   | $u₁$ | $SUN ∧ RAIN$ | $(¬u₁ ∨ SUN) ∧ (¬u₁ ∨ RAIN) ∧ (u₁ ∨ ¬SUN ∨ ¬RAIN)$ |
   | $u₂$ | $¬SUN$ | $(¬u₂ ∨ ¬SUN) ∧ (u₂ ∨ SUN)$ |
   | $u₃$ | $u₂ ∧ WIND$ | $(¬u₃ ∨ u₂) ∧ (¬u₃ ∨ WIND) ∧ (u₃ ∨ ¬u₂ ∨ ¬WIND)$ |
   | $u₄$ | $u₁ ∨ u₃$ | $(u₄ ∨ ¬u₁) ∧ (u₄ ∨ ¬u₃) ∧ (¬u₄ ∨ u₁ ∨ u₃)$ |

   Add the root clause $u₄$. Take $SUN = RAIN = 0$, $WIND = 1$, $u₁ = 0$, and $u₂ = u₃ = u₄ = 1$.

4. For $(SUN ∧ RAIN) ∨ (WIND ∧ SNOW)$:

   | Name | Subformula, using earlier names | Local constraints |
   | --- | --- | --- |
   | $u₁$ | $SUN ∧ RAIN$ | $(¬u₁ ∨ SUN) ∧ (¬u₁ ∨ RAIN) ∧ (u₁ ∨ ¬SUN ∨ ¬RAIN)$ |
   | $u₂$ | $WIND ∧ SNOW$ | $(¬u₂ ∨ WIND) ∧ (¬u₂ ∨ SNOW) ∧ (u₂ ∨ ¬WIND ∨ ¬SNOW)$ |
   | $u₃$ | $u₁ ∨ u₂$ | $(u₃ ∨ ¬u₁) ∧ (u₃ ∨ ¬u₂) ∧ (¬u₃ ∨ u₁ ∨ u₂)$ |

   Add the root clause $u₃$. Take $SUN = RAIN = 1$, $WIND = SNOW = 0$, $u₁ = u₃ = 1$, and $u₂ = 0$.

5. For $(SUN ∨ RAIN) ∧ (¬SUN ∧ ¬RAIN)$:

   | Name | Subformula, using earlier names | Local constraints |
   | --- | --- | --- |
   | $u₁$ | $SUN ∨ RAIN$ | $(u₁ ∨ ¬SUN) ∧ (u₁ ∨ ¬RAIN) ∧ (¬u₁ ∨ SUN ∨ RAIN)$ |
   | $u₂$ | $¬SUN$ | $(¬u₂ ∨ ¬SUN) ∧ (u₂ ∨ SUN)$ |
   | $u₃$ | $¬RAIN$ | $(¬u₃ ∨ ¬RAIN) ∧ (u₃ ∨ RAIN)$ |
   | $u₄$ | $u₂ ∧ u₃$ | $(¬u₄ ∨ u₂) ∧ (¬u₄ ∨ u₃) ∧ (u₄ ∨ ¬u₂ ∨ ¬u₃)$ |
   | $u₅$ | $u₁ ∧ u₄$ | $(¬u₅ ∨ u₁) ∧ (¬u₅ ∨ u₄) ∧ (u₅ ∨ ¬u₁ ∨ ¬u₄)$ |

   Add the root clause $u₅$. The root requires both $u₁ = 1$ and $u₄ = 1$. The latter requires $u₂ = u₃ = 1$, hence $SUN = RAIN = 0$. But this makes $u₁ = 0$. There is no satisfying valuation.

For formula 4, distribution gives just four clauses:

$$
(SUN ∨ WIND) ∧ (SUN ∨ SNOW) ∧ (RAIN ∨ WIND) ∧ (RAIN ∨ SNOW).
$$

Tseytin uses ten clauses here, so it is not the shorter answer on this
input. With $n$ disjuncts each containing two fresh atoms, distribution
gives $2ⁿ$ clauses. Tseytin gives $3(2n - 1) + 1 = 6n - 2$ clauses:
three for each of the $n$ conjunctions and $n - 1$ disjunctions, plus
the root. The difference matters as $n$ grows.

Without the root clause, all five groups of local constraints are
satisfiable: assign each name the calculated value of its subformula,
even when the whole formula is false. The original formulas say nothing
about the fresh names, whereas the constraints restrict them. Every
satisfying valuation of the original can be extended to satisfy the
encoding; every model of the encoding restricts to a model of the original.
That gives equisatisfiability. For the first four formulas, arbitrary
values of the fresh variables can violate the encoding while the original
remains true, so they are not logically equivalent over the expanded
vocabulary. The fifth is a special case: both formulas are unsatisfiable,
and hence equivalent.
