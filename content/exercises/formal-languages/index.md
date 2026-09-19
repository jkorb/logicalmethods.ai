---
title: Formal languages
author: Johannes Korbmacher
weight: 20
locked: false
params:
  id: exc-for
---

# Ambiguity {.solved}

Which of the following expressions in natural language are
{{< term "ambiguity" "ambiguous" >}}? If
you find an ambiguous expression, paraphrase the different readings to bring out
the ambiguity. For each ambiguous example, give a conclusion that follows on one reading
but needn't follow on another. Ordinary background assumptions about word
meanings are allowed; say which reading you are using.

1. I see his goose.

2. I see her duck.

3. He thanked her children, Alan and Ada.

4. They greeted their parents, Bob, and Betty.

5. I see a man with my binoculars.

6. There's the woman with my telescope.

7. A friendly dog walker.

8. I'm happy I'm here, and so is she.

9. The priest married my uncle.

10. They fed her dog food.

## Solution {.solution #ambiguitySolution}

These are possible readings, rather than an exhaustive list. Context and
intonation can make a reading more or less natural.

1. On the ordinary reading, the speaker sees a goose associated with him.
   There is no obvious grammatical ambiguity parallel to the next example.
2. The speaker sees her ducking, or sees a duck belonging to her. Only the
   second reading establishes that an animal is being seen. Ducking needn't
   involve crouching: lowering one's head can be enough.
3. Alan and Ada may name her children, or they may be two additional people
   thanked alongside her children. Only the first reading establishes that
   Alan is her child.
4. The natural list reading names three recipients: their parents, Bob, and
   Betty. The extra comma favors this reading, though punctuation alone
   doesn't settle every possible interpretation of a list.
5. The speaker may be using the binoculars, or the man may have them.
   Only the first reading establishes that the speaker is using binoculars.
   Neither reading settles who owns them beyond the speaker's word "my".
6. The natural reading identifies the woman as the one who has the telescope.
   In a suitable context, "with my telescope" could describe how the speaker
   locates her. Only that latter reading establishes that the speaker is
   using the telescope. The second reading is less natural than in item 5.
7. The walker may be friendly, or the dogs may be friendly. Only the first
   reading establishes that the walker is friendly.
8. She may also be happy that the speaker is here; she may be happy that she
   herself is here; or "so is she" may say that she is here too. The second
   and third readings establish her presence; the first needn't.
9. The priest may have officiated at the uncle's wedding or married the uncle.
   Only the second reading establishes that the priest was a spouse in that wedding.
10. They may have fed dog food to her, or fed food to her dog. Only the
    second reading establishes that a dog was fed.

# Interpreting a promise {#over-expressiveness .solved}

Suppose you tell a child:

$If you behave well, I will buy you an ice-cream.$

1. The child behaves well. What can they infer from your promise?
2. The child doesn't behave well. They conclude that they won't get an
   ice-cream. Does that follow from the promise alone? Explain your answer.
3. What further condition could you state to make that second inference valid?

## Solution {.solution #over-expressivenessSolution}

1. They can infer that you will buy them an ice-cream, by modus ponens.
2. No. You could still buy them an ice-cream without breaking the promise.
   The child may expect good behaviour to be a requirement, but the promise
   alone doesn't say that it is.
3. Add: "If you don't behave well, I won't buy you an ice-cream."
   With that further condition, the second inference also follows by
   modus ponens.

# Members and non-members

A set abstraction tells us which objects belong by describing a condition they
must satisfy. Work through the levels below: each gives a different condition
on the same collection of objects. Select all its members, then check your
answer. Select a picture again to remove it; Tab and Enter or Space work too.
The two boxes are different objects, so either or both may belong.

Here “alive” means biologically alive: the mushroom is a living fungus and
∀I is a machine. Later levels combine conditions; a set can have no members
at all.

{{< set-diagram exercise="abstraction" >}}

# Sets {.solved}

Describe the following sets using set notation:

1. the set containing no object whatsoever—the so-called _empty_ set

2. the set containing $∀I$, Utrecht University, and the set containing
$∀I$ and nothing else.

3. the set of all even integers strictly between 1 and 10

4. the set of all even integers

5. the set of all non-empty sets that contain only the numbers 1, 2, and 3

## Solution {.solution #setsSolution}

1. ${ }$, with nothing written between the curly brackets. There is also the set-theoretic symbol $∅$.

2. ${ ∀I, UU, {∀I} }$, where $UU$ names Utrecht University

3. ${ 2, 4, 6, 8 }$ or ${ n : n is an even number between 1 and 10}$

4. ${ n : n is an even integer }$

5. ${ {1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3} }$ or:

   $$
   { x : x is a non-empty set with only members from {1, 2, 3} }
   $$

# Building formulas {#building-formulas}

The inductive definition doesn't just say which strings are formulas — it says
how each one is *made*. This builder only lets you do what the definition
allows: start from atoms, then put formulas you already have together with an
operator. There is no way to type a formula directly, so the only way to reach
the target is to construct it.

Work through all twelve levels. Watch what happens as the targets get deeper:
the number of atoms you need, and the order you have to build the parts in.

{{< logic-app name="builder" levels="true" variables="plain" title="Build the formula" >}}

Two things are worth noticing as you go. A formula you have used is spent — it
becomes a part of the bigger formula, and you cannot use it twice, which is why
$(p ∧ p)$ needs *two* copies of $p$. And for the binary operators the order you
select in is the order you get, so $(p → q)$ and $(q → p)$ take the same two
atoms but different steps.

# Parsing {.solved}

Parse the following formulas according to the grammar of propositional logic.
Give an abstract syntax tree for each formula. For these four formulas,
use $p$, $q$, $r$, and $s$ as propositional variables.

1. $(¬p → ¬q)$

2. $(p ↔ (¬r ∧ q))$

3. $((q ∧ s) → (p ∨ r))$

4. $(((p ∧ q) ∨ (r ∧ s)) ∧ ¬(((p ∧ q) ∧ r) ∧ s))$

## Solutions {.solution #parsingSolution}

{{< syntax-tree caption="Formula 1" >}}
{"label":"→","children":[{"label":"¬","children":[{"label":"p"}]},{"label":"¬","children":[{"label":"q"}]}]}
{{< /syntax-tree >}}

{{< syntax-tree caption="Formula 2" >}}
{"label":"↔","children":[{"label":"p"},{"label":"∧","children":[{"label":"¬","children":[{"label":"r"}]},{"label":"q"}]}]}
{{< /syntax-tree >}}

{{< syntax-tree caption="Formula 3" >}}
{"label":"→","children":[{"label":"∧","children":[{"label":"q"},{"label":"s"}]},{"label":"∨","children":[{"label":"p"},{"label":"r"}]}]}
{{< /syntax-tree >}}

{{< syntax-tree caption="Formula 4" >}}
{"label":"∧","children":[{"label":"∨","children":[{"label":"∧","children":[{"label":"p"},{"label":"q"}]},{"label":"∧","children":[{"label":"r"},{"label":"s"}]}]},{"label":"¬","children":[{"label":"∧","children":[{"label":"∧","children":[{"label":"∧","children":[{"label":"p"},{"label":"q"}]},{"label":"r"}]},{"label":"s"}]}]}]}
{{< /syntax-tree >}}

# Working with pseudocode {.solved #pseudocode}

An algorithm is a list of instructions precise enough to follow without
having to guess what to do next. Let's practise with a few everyday examples.
You don't need to know Python: we'll use the notation introduced in the chapter,
plus two new instructions for choosing and repeating steps.

- `def` names a procedure and its inputs.
- `if` tests a condition; `else` says what to do if that condition is false.
- `return` gives back the result and ends the procedure.
- `for item in items:` repeats the indented instructions for each item in a
  finite list, in order. If the list is empty, it does nothing.
- `=` gives a name to a result; `==` tests whether two things are equal.

Indentation shows which instructions belong together. Words in quotation marks
are text, such as a name or a message. With text, `+` joins the pieces:
`"Hello, " + "Ada"` gives `"Hello, Ada"`. A helper such as `is_raining()` does the
job described by its name; we don't need to write its instructions ourselves.

1. Fill the gaps with keywords from the list above. Read each completed
   procedure aloud: what does it take as input, and what does it do?

   {{< logic-app name="pseudocode-practice" >}}

2. Write pseudocode for the following three procedures. Use the examples
   above as a guide. For each procedure, try the suggested inputs by hand
   and say why it finishes.

   - **Choosing a greeting.** The input is a person's name. If it is `"Ada"`,
     give back `"Welcome back, Ada!"`. For any other name, give back `"Hello!"`.
     Try `"Ada"` and `"Bob"`.
   - **Counting tickets.** The input is a finite list of tickets. Start a
     counter at zero, add one for each ticket, and give back the final count.
     Try a list with three tickets and an empty list.
   - **Finding a book.** The inputs are a book title and a finite list of
     titles on a shelf. Give back `"found"` as soon as you encounter the title,
     or `"not found"` after checking all titles. Try looking for `"Logic"`
     in `["Poetry", "Logic", "History"]`, and then in an empty list.

## Solution {.solution #pseudocodeSolution}

**1.** The app checks the missing keywords. Notice where each `return` occurs:
a `return` inside an `if` is reached only when its condition holds; a `return`
after the loop is reached when we have finished going through the list.

**2.** Here are possible solutions. Other names for the procedures and their
inputs work just as well.

```python
def greeting(name):
    if name == "Ada":
        return "Welcome back, Ada!"
    else:
        return "Hello!"
```

For `"Ada"`, we take the first branch; for `"Bob"`, we take the second.
There is one test and one result, so the procedure finishes in either case.

```python
def count_tickets(tickets):
    count = 0
    for ticket in tickets:
        count = count + 1
    return count
```

`count = count + 1` means: take the old count, add one, and use that as the
new count. With three tickets, the count goes from zero to one, two, and
three. With no tickets, the loop has no steps and the result is zero.
The list is finite and each ticket is counted once, so the procedure finishes.

```python
def find_book(title, shelf):
    for book in shelf:
        if book == title:
            return "found"
    return "not found"
```

In the suggested list, the first comparison fails and the second succeeds.
We return `"found"` without looking at `"History"`. With an empty list,
we go straight to `return "not found"`. In general, we check at most as many
titles as there are on the finite list, so the procedure finishes.

# Adding and removing brackets {#omitting-brackets}

Rewrite each formula in the other notation. When adding brackets, follow the
fully bracketed grammar. When removing them, leave only the brackets needed
to preserve the *same tree*. Don't rearrange parts or replace a formula with
another that merely says the same thing.

Work through the examples in both directions. Spaces don't matter. The app
checks your answer and can show the expected formula if you get stuck.

{{< logic-app name="notation-practice" >}}

# Polish notation {.solved}

In the lesson on formal languages, we explained the need for parentheses in
order to avoid ambiguity in the language for propositional logic.

But it turns out that there's another way, which is known as [Polish notation](https://en.wikipedia.org/wiki/Polish_notation),
in honor of the Polish logician [Jan
Łukasiewicz](https://en.wikipedia.org/wiki/Jan_%C5%81ukasiewicz), who pioneered
it.

Use $p$, $q$, and $r$ as variables. We'll keep the usual connective symbols
$¬$, $∧$, $∨$, $→$, and $↔$, changing only where they are written.

Polish notation puts each operator *before* its parts. For example,
$((p ∧ (p → q)) → ¬q)$ becomes $→∧p→pq¬q$.

1. Determine the grammar of Polish notation both in terms of recursive clauses
   and as a BNF.

2. Determine the corresponding re-write rules and generate the abstract syntax tree for
$→∧p→pq¬q$.

3. Give an argument why $p→pq¬q→pr$ is _not_ a
   formula in Polish notation.

4. Go back to the example from the textbook which illustrated the need for
   parentheses when using infix notation and write the corresponding formulas in
   Polish notation. Explain with the example why we no longer need parentheses
in Polish notation.

## Solution {.solution #polish-notationSolution}

**1.** The inductive clauses are:

- $p$, $q$, and $r$ are formulas.
- If $α$ is a formula, then $¬α$ is a formula.
- If $α$ and $β$ are formulas, then $∧αβ$, $∨αβ$, $→αβ$, and $↔αβ$ are formulas.
- Nothing else is a formula.

With $φ$ as the grammatical category, the BNF is:

$$
φ ::= p | q | r | ¬φ | ∧φφ | ∨φφ | →φφ | ↔φφ
$$

**2.** Each alternative gives a rewrite rule:

$$
φ ⟹ p, φ ⟹ q, φ ⟹ r, φ ⟹ ¬φ
φ ⟹ ∧φφ, φ ⟹ ∨φφ, φ ⟹ →φφ, φ ⟹ ↔φφ
$$

For example, always rewriting the leftmost remaining $φ$:

$$
φ ⟹ →φφ ⟹ →∧φφφ ⟹ →∧pφφ ⟹ →∧p→φφφ
  ⟹ →∧p→pφφ ⟹ →∧p→pqφ ⟹ →∧p→pq¬φ ⟹ →∧p→pq¬q
$$

{{< syntax-tree caption="→∧p→pq¬q" >}}
{"label":"→","children":[{"label":"∧","children":[{"label":"p"},{"label":"→","children":[{"label":"p"},{"label":"q"}]}]},{"label":"¬","children":[{"label":"q"}]}]}
{{< /syntax-tree >}}

**3.** A formula beginning with a variable consists of that variable alone.
$p→pq¬q→pr$ starts with $p$ but continues, so no grammar rule can generate it.

**4.** The two readings of the ambiguous string $¬p ∧ q$ are $¬(p ∧ q)$
and $(¬p ∧ q)$. They become $¬∧pq$ and $∧¬pq$, respectively.
In $¬∧pq$, $¬$ takes the whole $∧pq$ as its part; in $∧¬pq$, $∧$ takes
$¬p$ and $q$ as its two parts. Each operator has a fixed number of parts.
Reading a variable completes one part, while reading an operator specifies
how many further parts must be read. This determines where each part ends,
without brackets.

# A stack of operators {.solved #shunting-yard}

In *postfix* or *reverse Polish* notation, an operator comes after its parts:
$(p ∧ q)$ becomes $pq∧$, and $¬p$ becomes $p¬$. Keep the symbols $¬$, $∧$,
$∨$, $→$, and $↔$ for this exercise.

The shunting-yard algorithm converts infix to postfix notation. It reads the
input from left to right and keeps an output and a *stack* of waiting operators.
Think of a stack of plates: you add to the top and remove from the top.
Adding an item is called *pushing*; removing the top item is called *popping*.
Here we write the stack from left to right, with its top at the right.

For a well-formed input, use these rules:

- A variable goes straight to the end of the output.
- Push an opening bracket or a negation onto the stack.
- At a closing bracket, pop operators to the output until the opening bracket
  is on top, then discard that bracket.
- Before pushing a binary operator, pop any operator on top with higher
  priority. Also pop an operator of equal priority if the incoming operator
  is $∧$ or $∨$. Repeat until neither condition holds or a bracket is on top.
  Then push the incoming operator. Equal-priority arrows stay on the stack,
  giving right grouping. Repeated $↔$ must already be grouped with brackets.
- After reading the whole input, pop all remaining operators to the output.

1. Trace $p ∨ q ∧ r$ by hand. After each symbol, write down the output and
   stack. Include the final pops. Why isn't $∨$ moved to the output when
   $∧$ is read?
2. Check your trace in the app. Then predict the result for $(p ∨ q) ∧ r$
   before trying it. What do the brackets change?
3. Compare this with the formula builder in the chapter. How does the order
   of construction relate to the order of symbols in the postfix output?

{{< logic-app name="shunting-yard" formula="p ∨ q ∧ r" >}}

## Solution {.solution #shunting-yardSolution}

**1.** A dash marks an empty output or stack. The stack's top is at the right.

| Just read or performed | Output | Stack |
| --- | --- | --- |
| Start | — | — |
| $p$ | $p$ | — |
| $∨$ | $p$ | $∨$ |
| $q$ | $pq$ | $∨$ |
| $∧$ | $pq$ | $∨∧$ |
| $r$ | $pqr$ | $∨∧$ |
| Pop $∧$ | $pqr∧$ | $∨$ |
| Pop $∨$ | $pqr∧∨$ | — |

$∧$ has higher priority than $∨$. It must combine $q$ and $r$ before $∨$
combines that result with $p$, so $∨$ waits on the stack.

**2.** The output is $pq∨r∧$. Reading the closing bracket moves $∨$ to the
output before the later $∧$ is read. The disjunction is now the left part
of the conjunction.

**3.** In the formula builder, we construct both parts before applying a
binary operator. Postfix notation records precisely that order: left part,
right part, then their operator. A negation is written after its single part.

# Checking the shunting yard {.solved #checking-shunting-yard}

Use the same rules and app for these questions. Predict each answer first.

1. Convert $p ∧ q ∧ r$ and $p → q → r$ to postfix notation. Explain why the
   equal-priority operators are handled differently.
2. Convert $¬p ∧ q$, $¬(p ∧ q)$, and $¬¬p$. How does the output record the
   scope of each negation?
3. Someone simplifies the procedure to "push every operator and pop them
   all at the end." Find a formula without brackets for which this goes wrong.
4. The input is $p ↔ q ↔ r$. Why should the app reject it? Supply the two
   explicitly grouped alternatives and their postfix forms.

## Solution {.solution #checking-shunting-yardSolution}

1. $pq∧r∧$ and $pqr→→$. At the second $∧$, the first is popped, giving
   left grouping. At the second $→$, the first stays below it on the stack,
   giving right grouping.
2. $p¬q∧$, $pq∧¬$, and $p¬¬$. A negation follows exactly the part it
   negates. In the second example, it follows the whole conjunction.
3. For $p ∧ q ∨ r$, that procedure produces $pqr∨∧$, which represents
   $p ∧ (q ∨ r)$. The correct output is $pq∧r∨$. The $∧$ must be popped
   before the lower-priority $∨$ is pushed. $¬p ∧ q$ is another counterexample:
   delaying every operator would incorrectly give $pq∧¬$.
4. The chapter gives no automatic grouping for repeated $↔$.
   $(p ↔ q) ↔ r$ becomes $pq↔r↔$; $p ↔ (q ↔ r)$ becomes $pqr↔↔$.

# Knowledge representation {.solved}

$∀I$ has taken up privateering. Now, he's got a treasure of numerous Bitcoin,
RAM chips, and Alan Turing's old {{< abbr title="knowledge base">}}KB{{< /abbr
>}}.

{{< img src="/img/drawings/fl_ai_piracy.svg" class="rounded  float-end inert-img img-fluid m-4" width="200px">}}

$∀I$ hid the treasure on some remote disk-world and now he's trying to
write instructions on how to find the treasure. Since he's an AI system, he
does so using propositional logic.

First, he divided the disk-world into 4 quadrants, indicated in the following coordinate system:

{{< img src="/img/drawings/fl_map.svg" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="400px">}}

Use four propositional variables for the quadrants:

| Variable | The treasure is in … |
| --- | --- |
| $p$ | the upper left quadrant |
| $q$ | the upper right quadrant |
| $r$ | the lower left quadrant |
| $s$ | the lower right quadrant |

You may use conventional notation in your answers. Treat the four quadrants
as all the possible locations, and each hint as a separate claim. Don't assume
that the treasure is in exactly one quadrant unless the hint says so.

Help $∀I$ to represent the following hints about the treasure's location using ordinary propositional logic:

1. The treasure is in the upper right quadrant and in none of the other
   quadrants.

2. The treasure is in exactly one quadrant, that is, it is either in the upper
   left, upper right, lower left, or lower right quadrant, but not in any two
   quadrants at the same time.

3. If the treasure is not in the lower right quadrant, then it is in the
   upper left quadrant and not in the lower left quadrant.

4. The treasure is in the upper right quadrant only if it is not in the
   lower right quadrant.

5. The treasure is in at least one of the right quadrants just in case it is not in the
   upper left quadrant.

6. The treasure is nowhere on the disk-world.

7. The treasure is somewhere on the disk-world.

8. There is treasure in every quadrant of the disk-world.

## Solution {.solution #knowledge-representationSolution}

1. $q ∧ ¬p ∧ ¬r ∧ ¬s$
2. At least one quadrant contains treasure, and no pair of quadrants both do:

   $$
   (p ∨ q ∨ r ∨ s) ∧ ¬(p ∧ q) ∧ ¬(p ∧ r) ∧ ¬(p ∧ s)
     ∧ ¬(q ∧ r) ∧ ¬(q ∧ s) ∧ ¬(r ∧ s)
   $$

3. $¬s → (p ∧ ¬r)$
4. $q → ¬s$. "Only if" makes the second condition necessary for the first.
5. $(q ∨ s) ↔ ¬p$
6. $¬(p ∨ q ∨ r ∨ s)$, or $¬p ∧ ¬q ∧ ¬r ∧ ¬s$.
7. $p ∨ q ∨ r ∨ s$
8. $p ∧ q ∧ r ∧ s$

Different formulas can represent the same claim. The variables record only
which quadrants contain treasure; they cannot say where within a quadrant
it is, or whether it covers every point of the disk-world.

# Knowledge extraction  {.solved}

{{< img src="/img/drawings/fl_rover.svg" class="rounded  float-start inert-img img-fluid m-2" width="200px">}}
You arrive at an uninhabited planet and find an old space rover that some
ancient civilization, which still used expert systems for AI, used to explore
the planet.

The manual explains the variables as follows. Action variables describe
commands issued by the controller, rather than confirming that an action
succeeded.

| Variable | Meaning                                      |
| ---      | ---                                          |
| $p$      | Rain is detected.                            |
| $q$      | Sun is detected.                             |
| $r$      | The battery level is low.                    |
| $s$      | The battery is charging.                     |
| $t$      | The command to seek cover is issued.         |
| $u$      | The command to charge is issued.             |
| $v$      | The command to request assistance is issued. |
| $w$      | The command to shut down is issued.          |

The knowledge base contains these rules, in conventional notation:

$$
p → t
r ∧ q → u
p ↔ ¬q
u ∧ ¬s → v
(p ∧ r) ∨ (q ∧ ¬s) → w
$$

1. Translate each rule into natural language.
2. Do the rules alone tell us why the rover shut down? What information is missing?
3. The log records $q$ and $¬s$. Explain which rule supports a shutdown command.
4. Suppose instead that the sensors report both $p$ and $q$. Which rule
   conflicts with these readings? Does that establish the physical cause of a shutdown?

## Solution {#knowledge-extractionSolution .solution}

**1.** The rules say:

- If rain is detected, issue the command to seek cover.
- If the battery is low and sun is detected, issue the command to charge.
- Rain is detected if and only if sun is not detected.
- If a charging command is issued but the battery isn't charging, issue the
  command to request assistance.
- If rain is detected and the battery is low, or sun is detected and the
  battery isn't charging, issue the command to shut down.

**2.** No. We need sensor readings or an execution log to establish which
condition held and which command was issued. A physical failure is also
possible; a rule describing a command doesn't establish that it was executed.

**3.** $q$ and $¬s$ establish the second alternative in the last rule, so
that rule supports $w$, the shutdown command.

**4.** The readings conflict with $p ↔ ¬q$. Sun and rain can occur together;
the restriction in the knowledge base is a questionable modeling assumption.
In classical logic an inconsistent collection of premises entails every
formula, but this doesn't establish what physically happened or how a
particular controller handles conflicting information.

# Research {.solved}

Can the grammar of _every_ formal language be given by a BNF? If so, explain
why, if not give a counterexample and explain why it is, indeed, a
counterexample.

For a starting point, research context-free languages and the pumping lemma.

## Solution {.solution #researchSolution}

No. Ordinary BNF describes context-free grammars, and not every formal
language is context-free. For example, the language of strings consisting
of some number of $a$s, followed by the same number of $b$s, followed by the
same number of $c$s is not context-free. It includes the empty string,
$abc$, $aabbcc$, and $aaabbbccc$.

For a proof, use the [pumping lemma for context-free languages](https://web.stanford.edu/class/archive/cs/cs103/cs103.1132/reference/). If this
language were context-free, the lemma would give a length $n$ such that
$aⁿbⁿcⁿ$ could be split as $uvxyz$, with $vxy$ of length at most $n$ and
$vy$ nonempty, and with $uvⁱxyⁱz$ in the language for every nonnegative $i$.
The short segment $vxy$ cannot reach both an $a$ and a $c$. Removing $v$
and $y$ therefore changes at least one of the three counts and leaves at
least one unchanged. The counts are no longer all equal, a contradiction.
The pumping lemma is further material; it isn't needed for the other exercises.
# A grammar for conventional notation {.solved #conventional-grammar}

Let's build a grammar for conventional notation one level at a time. For
this exercise, use just the variables $p$, $q$, and $r$. The priority order
is $¬$, $∧$, $∨$, $→$, $↔$, from highest to lowest. Repeated $∧$ and $∨$
group left, repeated $→$ groups right, and repeated $↔$ needs brackets.

1. Start with the category $N$, for variables, negations, and bracketed
   formulas. Complete $N ::= p | q | r | … | …$, using $F$ for a whole formula.
2. Let $C$ be a conjunction of one or more $N$ expressions. Complete
   $C ::= N | … ∧ …$ so that repeated conjunctions group left.
   Hint: which side should allow a further $C$?
3. Add a category $D$ for disjunctions of $C$ expressions, with the same
   left grouping. Then add $I$ for conditionals, using $D → I$ to group right.
   Finally, let $F$ allow either an $I$ or a single equivalence between two
   $I$ expressions. Write all five rules together.
4. Show how the grammar groups $p ∨ q ∧ r$ and $p → q → r$.
   Explain how $(p ∨ q) ∧ r$ is possible, and why $p ↔ q ↔ r$ needs brackets.
5. Turn these conventions into a parser. First identify the root operator in
   $¬p ∧ q$, $p ∨ q ∧ r$, $p ∧ q ∧ r$, and $p → q → r$.
   Hint: look outside brackets for the *lowest* priority binary operator.
   If there is a tie, which occurrence gives the intended grouping?
6. Write Python-like pseudocode returning an AST, following the chapter's
   example. Handle a variable and enclosing brackets first. Then look for
   a binary operator; only after that check for initial negation.
   You may assume helpers that find the main operator and its left and right
   parts according to your answer to 5. State when these helpers must fail,
   and explain why the recursive calls terminate.

## Solution {.solution #conventional-grammarSolution}

**1–3.** With $F$ as the starting category:

$$
F ::= I | I ↔ I
I ::= D | D → I
D ::= C | D ∨ C
C ::= N | C ∧ N
N ::= p | q | r | ¬N | (F)
$$

These capital letters name grammatical categories; they aren't symbols of
the language. A conjunction can continue on its left through $C ∧ N$,
whereas a conditional can continue on its right through $D → I$.

**4.** To generate $p ∨ q ∧ r$, choose $F ⟹ I ⟹ D ⟹ D ∨ C$.
The left $D$ produces $p$; the right $C$ produces $q ∧ r$ through $C ∧ N$.
Its fully bracketed reading is $(p ∨ (q ∧ r))$.

For $p → q → r$, choose $F ⟹ I ⟹ D → I ⟹ D → D → I$.
The categories produce $p$, $q$, and $r$, respectively. The second arrow
belongs to the right-hand $I$, giving $(p → (q → r))$.

The rule $N ::= (F)$ allows a whole disjunction inside brackets to be a
conjunct, as in $(p ∨ q) ∧ r$. By contrast, $I$ cannot produce an unbracketed
$↔$. The rule $F ::= I ↔ I$ therefore permits only one at that level.

**5.** The roots are $∧$, $∨$, the last $∧$, and the first $→$, respectively.
Choose the lowest priority binary operator outside brackets. Among operators
of that priority, choose the last $∧$ or $∨$ for left grouping, and the first
$→$ for right grouping. Reject repeated unbracketed $↔$ at that level.

**6.** Use the chapter's tree-building helpers and the following helpers for
choosing the main operator and its parts:

```python
def parse_conventional(expression):
    if is_variable(expression):
        return single_node(expression)

    if has_matching_outer_brackets(expression):
        smaller = remove_outer_brackets(expression)
        return parse_conventional(smaller)

    if has_binary_operator_outside_brackets(expression):
        left = left_part_by_convention(expression)
        right = right_part_by_convention(expression)
        operator = main_operator_by_convention(expression)
        left_tree = parse_conventional(left)
        right_tree = parse_conventional(right)
        return binary_tree(operator, left_tree, right_tree)

    if begins_with_negation(expression):
        smaller = remove_initial_negation(expression)
        child = parse_conventional(smaller)
        return negation_tree(child)

    fail("Not a formula")
```

`has_matching_outer_brackets` checks whether one matching pair encloses the
whole expression. `has_binary_operator_outside_brackets` checks for an
operator outside all brackets. These checks report failure if brackets are
unmatched. The three helpers ending in `by_convention` all use the same
choice of main operator: lowest priority first, then the grouping rule for
repeated operators. They report a failure if the chosen operator has no
expression on one side, or if repeated $↔$ would require extra brackets.

Notice the order of the cases: we look for a binary operator before checking
for negation. So $¬p ∧ q$ is split into $¬p$ and $q$, and we only remove $¬$
when parsing the left part. As in the chapter, a failed child causes the
whole parse to fail. Try the four examples in the app, and compare $¬p ∧ q$
with $¬(p ∧ q)$.

{{< logic-app name="parser" mode="conventional" variables="plain" formula="¬p ∧ q" title="Parsing with bracket conventions" >}}


Each recursive call receives a shorter expression: it removes outer brackets
or a negation, or takes a proper part on one side of a binary operator.
An empty expression fails. Since the original input is finite, the calls
cannot continue indefinitely.
