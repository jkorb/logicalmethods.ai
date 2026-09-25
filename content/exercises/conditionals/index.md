---
title: Logical conditionals
author: Johannes Korbmacher
locked: false
weight: 60
params:
  last_edited: 25/09/2026
  id: exc-if
---

# Boolean conditional {.solved}

Implement the illustrated truth-functions using only the allowed gates.
_Hint for level 4_: For $!!XNOR!!$, combine two $!!IF!!$ circuits, one in each direction.

{{< logic-app name="boolean" kind="workbench" preset="conditionals" title="Conditional circuits" >}}

## Solution {.solution #boolean-conditionalSolution}

1. The conditional is false just when $X=1$ and $Y=0$. Feed $Y$ through
   $!!NOT!!$, combine that output with $X$ using $!!AND!!$, and negate the
   result:

   $$
   X !!IF!! Y = !!NOT!!(X !!AND!! (!!NOT!! Y)).
   $$

2. A NAND box with both inputs connected to $Y$ computes $!!NOT!! Y$.
   Feed this output and $X$ into another NAND box:

   $$
   X !!IF!! Y = X !!NAND!! (Y !!NAND!! Y).
   $$

3. First compute $X !!XOR!! Y$, then feed it and the power source $1$
   into a second XOR box. XOR with $1$ reverses the output, so
   $(X !!XOR!! Y) !!XOR!! 1 = X !!XNOR!! Y$.

4. Build $A=X !!IF!! Y$ and $B=Y !!IF!! X$. The output $A !!AND!! B$
   is true when both inputs are $0$ or both are $1$. When they differ,
   one of the two conditionals is false. Build each conditional with
   two NAND boxes, as in level 2, then join their outputs to an AND box.

   | $X$ | $Y$ | $A$ | $B$ | $A !!AND!! B$ |
   | --- | --- | --- | --- | --- |
   | $0$ | $0$ | $1$ | $1$ | $1$ |
   | $0$ | $1$ | $1$ | $0$ | $0$ |
   | $1$ | $0$ | $0$ | $1$ | $0$ |
   | $1$ | $1$ | $1$ | $1$ | $1$ |

# Equivalence {.solved}

The circuits suggest that $RAIN ↔ SUN$ is equivalent to
$(RAIN → SUN) ∧ (SUN → RAIN)$.

1. Rewrite the latter formula into {{< term "disjunctive-normal-form" "DNF" >}} and explain its two disjuncts.

{{< logic-app name="conditional-practice" kind="equivalence" >}}

2. Is $(RAIN → SUN) ∨ (SUN → RAIN)$ equivalent to it too? Explain.

## Solution {#equivalenceSolution .solution}

1. Eliminate the two arrows and distribute:

   $$
   (¬RAIN ∨ SUN) ∧ (¬SUN ∨ RAIN)
   ≡ (¬RAIN ∧ ¬SUN) ∨ (¬RAIN ∧ RAIN) ∨ (SUN ∧ ¬SUN) ∨ (SUN ∧ RAIN).
   $$

   The middle two conjunctions are always false. We are left with
   $(¬RAIN ∧ ¬SUN) ∨ (SUN ∧ RAIN)$: either neither phenomenon occurs,
   or both occur. This is exactly when the biconditional is true.
2. No. The disjunction rewrites to $¬RAIN ∨ SUN ∨ ¬SUN ∨ RAIN$,
   which is always true because it contains $SUN ∨ ¬SUN$.
   For example, with rain but no sun, one conditional is false and the
   other true. Their disjunction is true, but their conjunction is false.

# Conditional inferences {.solved}

Use {{< term "resolution" "resolution" >}} to check the five inferences in the app.
For each one, first write the formula whose unsatisfiability would establish
validity. Enter it in the app, which converts it to
{{< term "conjunctive-normal-form" "CNF" >}}. Select two clauses and a
{{< term "resolution-pivot" "pivot" >}} for each resolution.
For an invalid inference, check every remaining resolution and give a {{< term "countermodel" "countermodel" >}}.
Record your derivation and explain its result.

{{< logic-app name="sat-practice" kind="resolution" deck="conditional-inference" >}}


## Solution {#conditional-inferencesSolution .solution}

1. Invalid. The premises and negated conclusion give the CNF
   $(¬RAIN ∨ WIND) ∧ ¬RAIN ∧ WIND$. Set $RAIN$ false and $WIND$ true:
   both premises are true and the conclusion is false. None of these three
   clauses has a complementary literal in another clause, so there is no
   resolution to perform: this input is already saturated.

2. Valid. The negated conclusion $¬(¬WIND → ¬RAIN)$ is equivalent to
   $¬WIND ∧ RAIN$. The SAT formula is therefore
   $(¬RAIN ∨ WIND) ∧ ¬WIND ∧ RAIN$. Resolve the first clause with $RAIN$
   to derive $WIND$, then with $¬WIND$ to derive $⊥$.

3. Valid. Resolve $RAIN ∨ RAIN$ with $¬RAIN$ on $RAIN$ to obtain $⊥$.
   Both copies of the pivot are removed. $¬RAIN → RAIN$ is equivalent to
   $¬¬RAIN ∨ RAIN$, which has the
   same truth-values as $RAIN$. The SAT formula is false on both rows:

   | $RAIN$ | $¬RAIN → RAIN$ | $¬RAIN$ | $(¬RAIN → RAIN) ∧ ¬RAIN$ |
   | --- | --- | --- | --- |
   | $1$ | $1$ | $0$ | $0$ |
   | $0$ | $0$ | $1$ | $0$ |

4. Valid. Rewriting the premise gives $¬RAIN ∨ ¬SUN ∨ RAINBOW$.
   Rewriting the negated conclusion gives $RAIN ∧ SUN ∧ ¬RAINBOW$.
   Resolve the first clause successively with $RAIN$, $SUN$, and
   $¬RAINBOW$. The results are $¬SUN ∨ RAINBOW$, $RAINBOW$, and $⊥$.

5. Valid. $¬(RAIN → WIND)$ is equivalent to $RAIN ∧ ¬WIND$. The SAT
   formula is $RAIN ∧ ¬WIND ∧ ¬RAIN$, which is unsatisfiable: resolve
   $RAIN$ with $¬RAIN$ to derive $⊥$.

# Valid inference and conditionals {.solved}

A {{< term "tautology" "logical truth" >}} is true under every valuation.
Prove the following equivalence using rewriting and the reduction to SAT:

$$
P₁,…,Pₙ ⊨ C &emsp; iff &emsp; (P₁ ∧ … ∧ Pₙ) → C is a logical truth.
$$

1. Write the SAT problem that tests the inference on the left.
2. Negate the conditional on the right. Eliminate → and move the negation
   inward. Compare the resulting formula with your answer to task 1.
3. Explain why unsatisfiability of this formula establishes both sides.
4. Do the premises or conclusion have to be Horn formulas? Does being able
   to rewrite the problem as a conditional make Horn-SAT applicable?

## Solution {#valid-inference-and-conditionalsSolution .solution}

1. Test $P₁ ∧ … ∧ Pₙ ∧ ¬C$ for satisfiability. A satisfying valuation
   would make all premises true and the conclusion false.
2. Write $A$ temporarily for the conjunction of premises. Then:

   $$
   ¬(A → C) ≡ ¬(¬A ∨ C) ≡ ¬¬A ∧ ¬C ≡ A ∧ ¬C.
   $$

   The steps use the conditional rewrite, De Morgan, and double negation.
   Putting the conjunction back in place of $A$ gives the formula in task 1.
3. If this formula is unsatisfiable, there is no countermodel to the
   inference. There is also no valuation making the conditional false,
   so it is a logical truth. Conversely, a satisfying valuation would
   falsify the conditional and be a countermodel to the inference.
4. No Horn assumption is needed for any of these equivalences. $Pᵢ$ and $C$
   may be arbitrary propositional formulas. An arrow alone does not make
   a formula Horn: $RAIN → (SUN ∨ SNOW)$ is a counterexample. Horn-SAT
   applies when the complete SAT input can be given as a Horn formula.

# Chaining {.solved}

The KB in the app describes a little weather system. $RAIN$ and $SNOW$ are
known. There are two routes to $CLOUDS$, a circular pair of rules, and some
rules for which we lack the required facts.

Complete each level in both directions. Compare the proofs you obtain,
and explain any failed or circular attempts.

{{< logic-app name="conditional-practice" kind="chaining" >}}

## Solution {#chainingSolution .solution}

1. _Storm._ Forward: $RAIN$ gives $PUDDLES$, which gives $HUMID$, which gives
   $CLOUDS$. Together with the given $SNOW$, this gives $STORM$.
   Backward: to prove $STORM$, prove $CLOUDS$ and $SNOW$. The latter is
   given. Reduce $CLOUDS$ to $HUMID$, then to $PUDDLES$, then to $RAIN$,
   which is also given. Reading these steps back supplies the same proof.
   The shorter proof uses $RAIN → CLOUDS$ directly, then
   $(CLOUDS ∧ SNOW) → STORM$. The app allows either order of the two
   subgoals; to follow {{< term "depth-first-search" "depth-first search" >}}, finish one branch before the other.
2. _A circular attempt._ Trying $CLOUDS → HUMID$ while proving
   $CLOUDS$ via $HUMID → CLOUDS$ asks for $CLOUDS$ while we are already trying to prove
   $CLOUDS$ on that branch. Mark the repeated goal as a failed attempt.
   Back at $HUMID$, try $PUDDLES → HUMID$. This route ends at the given
   $RAIN$. A circular attempt is not a proof, but it need not be the only attempt.
3. _Blizzard._ Forward chaining derives $PUDDLES,HUMID,CLOUDS,STORM$ in addition to
   the two given facts. No remaining rule adds anything. Backward chaining
   needs both $STORM$ and $WIND$; there is no fact or rule for $WIND$.
   Neither search proves $¬BLIZZARD$. The KB has models with $WIND$ and
   $BLIZZARD$ true, and models with both false.
4. _Circular rules._ There is no fact from which to apply MP. Backward chaining returns to
   its initial goal along the same branch. Changing the order supplies no
   new premise, so it does not help.

# Horn clauses {.solved}

1. Select every formula in the app that is equivalent to a
   {{< term "horn-formula" "Horn formula" >}} over the same atoms. For each
   selected formula, write a conjunction of {{< term "horn-clause" "Horn clauses" >}} on paper.
{{< logic-app name="conditional-practice" kind="horn" part="selection" >}}

2. Find three formulas over $RAIN,SUN,SNOW$ that are _not_ equivalent to
   any Horn formula.

{{< logic-app name="conditional-practice" kind="horn" part="examples" >}}

3. Why does the {{< term "horn-sat" "Horn-SAT" >}} algorithm set all underived atoms to $0$?
   Explain why the same strategy fails for $RAIN ∨ SUN$.

## Solution {#horn-clausesSolution .solution}

1. Select formulas 1, 2, 4, 5, 7 and 8. Horn forms are:

   | Formula | Horn form |
   | --- | --- |
   | $(RAIN ∧ SUN) → SNOW$ | $¬RAIN ∨ ¬SUN ∨ SNOW$ |
   | $RAIN → (SUN ∧ SNOW)$ | $(¬RAIN ∨ SUN) ∧ (¬RAIN ∨ SNOW)$ |
   | $¬(RAIN ∧ SUN ∧ SNOW)$ | $¬RAIN ∨ ¬SUN ∨ ¬SNOW$ |
   | $RAIN ↔ SUN$ | $(¬RAIN ∨ SUN) ∧ (¬SUN ∨ RAIN)$ |
   | $(RAIN → SUN) ∧ (SUN → SNOW) ∧ ¬SNOW$ | $(¬RAIN ∨ SUN) ∧ (¬SUN ∨ SNOW) ∧ ¬SNOW$ |
   | $(RAIN ∨ SUN) ∧ ¬RAIN$ | $SUN ∧ ¬RAIN$ |

   Formula 8 forces $RAIN$ false, so its disjunction forces $SUN$ true.
   Formula 3 rewrites to $¬RAIN ∨ SUN ∨ SNOW$, and formula 6 is
   $RAIN ∨ SUN$. Both require a choice between positive literals that
   cannot be expressed by Horn clauses over the same atoms.
2. Examples are $RAIN ∨ SUN$, $RAIN ∨ SNOW$, and $SUN ∨ SNOW$.
   Each has two positive literals. The app checks that none has an
   equivalent Horn formula. Their tables differ: making only $RAIN$
   true satisfies the first two but not the third; making only $SUN$
   true satisfies the first and third but not the second.
3. At termination, whenever all premises of a rule are true its conclusion
   has already been derived. Other rules have a false antecedent, and no
   constraint has all its premises true. Setting the remaining atoms false
   therefore gives a model. For $RAIN ∨ SUN$, neither atom is forced on
   its own, but setting both false violates the clause.

# Missing facts {.solved}

A weather KB contains $RAIN → WET$ and no facts about rain.

1. Does $ASK(KB, RAIN)$ succeed? Does $KB ⊨ ¬RAIN$?
2. Give two models that justify your answers.
3. If we add $RAIN$, what can {{< term "forward-chaining" "forward chaining" >}} now derive? Have we
   contradicted anything in the original KB?

## Solution {.solution #missing-factsSolution}

1. Chaining cannot derive $RAIN$. But the KB does not entail $¬RAIN$ either.
2. One model makes both $RAIN$ and $WET$ true; another makes both false.
   Each satisfies the rule. The first rules out entailment of $¬RAIN$;
   the second rules out entailment of $RAIN$.
3. We now derive $WET$. This contradicts nothing: the original KB left
   the truth of $RAIN$ open. Absence from the KB is not the same as falsity.

# Pseudocode {.solved}

Complete the gaps. Then work through the questions below on paper.

{{< logic-app name="pseudocode-practice" deck="conditionals" >}}

1. Trace your completed `process` with `RAIN, CLOUDS, RAIN` in the
   agenda and no known facts. Which entries are removed, and which are
   reported? What happens if `take_first` doesn't remove its item?
2. A rule has two premises and concludes $STORM$. Trace `process_premise`
   after each premise becomes known. What changes if $STORM$ is already
   known? What goes wrong if the same premise is counted twice?
3. Suppose `rules_for` returns $CLOUDS → WIND$ before $RAIN → WIND$,
   and only $RAIN$ is a fact. Explain why returning `False` inside the
   `for` loop after its first failed attempt would give the wrong answer.
4. Why must `extend(active, goal)` make a separate branch list?

## Solution {#pseudocodeSolution .solution}

The completed conditions and arguments are:

| Level | Gaps, in order |
| --- | --- |
| Process each fact once | `not is_empty(agenda)`; `not contains(known, fact)`; `known`; `fact` |
| A premise counter | `remaining - 1`; `remaining == 0`; `not contains(known, fact)`; `agenda`; `fact` |
| Try another rule | `True`; `False`; `active`; `goal`; `branch`; `True`; `False` |

1. Remove the first $RAIN$, add it to the known facts and report it.
   Do the same for $CLOUDS$. Remove the second $RAIN$ but don't report
   it again: it is already known. The agenda is now empty. Without
   removal, the loop would keep inspecting its first entry forever.
2. The counter goes from $2$ to $1$, then to $0$. Only at $0$ do we
   add $STORM$ to the known facts and agenda. If it is already known,
   we add nothing. Counting a premise twice could reduce the counter to
   $0$ before the other premise is known, allowing an unjustified conclusion.
3. Failing to prove $CLOUDS$ rules out the first attempt, but the next
   rule succeeds using the given $RAIN$. Only after every matching rule
   has failed may the procedure return `False`.
4. The list records goals on the current branch. A goal that occurred in
   a failed attempt may still have a proof by a different rule. A permanent
   list of all visited goals would wrongly block such alternatives.

# Planning {.solved}

We've added a blue block to the chapter's two-block world. The pictures
show the starting configuration and the required goal. Use four action steps.

1. We already have $On(R,G,t)$ and $On(G,R,t)$. Which additional basic
   propositions do we need? List the missing ones in the language field,
   with time variable $t$. The checker also accepts names without the index.
2. Translate the two pictures into initial and goal conditions. Use $R,G,B$
   for red, green and blue. Use time $0$ for the initial state and $4$ for the goal.
   Unlisted initial atoms are false. An omitted index means the time shown
   by that field; spaces, commas and semicolons can separate propositions.
3. Which state constraints and action preconditions must be extended for
   three blocks? Are additional frame conditions needed, or do the two
   chapter schemata suffice? Enter your frame conditions yourself.
4. Find a plan and record the true state facts at each time. The app already
   includes the state constraints and action rules; it checks your language
   and state descriptions before looking for a model.
5. Set the horizon to $2$. If the app finds no two-step plan, could a
   longer plan still work? Explain using your four-step plan.

{{< logic-app name="conditionals" kind="planning" example="three" exercise="true" title="Three-block planning exercise" >}}

## Solution {#planningSolution .solution}

1. Add $On(R,B,t)$, $On(G,B,t)$, $On(B,R,t)$ and $On(B,G,t)$.
   Together with the two existing atoms, these describe every ordered
   pair of distinct blocks. Use times $0,…,4$ for states and $0,…,3$
   for actions.
2. Initially $On(G,B,0)$ and $On(B,R,0)$ are true; all other $On$ facts
   are false. Require $On(B,G,4) ∧ On(G,R,4)$ as the goal.
3. Exclude three-block cycles as well as two-block cycles and self-stacking.
   No block may rest directly on two blocks or have two blocks directly
   on it. A moving block and its destination must be clear; stacking also
   requires that the moving block is on the table. These conditions now
   range over all three blocks. The two frame schemata still suffice:
   they have more instances, since $X,Y$ can now also involve $B$, but
   we need no new kind of frame condition.
4. Enter the same two frame conditions as in the chapter. They now apply
   to all distinct pairs of the three blocks:

   $$
   On(X,Y,t) ∧ ¬Unstack(X,Y,t) → On(X,Y,t+1)
   $$

   $$
   ¬On(X,Y,t) ∧ ¬Stack(X,Y,t) → ¬On(X,Y,t+1).
   $$

   One plan is:

   | Time | True state facts | Action |
   | --- | --- | --- |
   | $0$ | $On(G,B,0), On(B,R,0)$ | $Unstack(G,B,0)$ |
   | $1$ | $On(B,R,1)$ | $Unstack(B,R,1)$ |
   | $2$ | None | $Stack(G,R,2)$ |
   | $3$ | $On(G,R,3)$ | $Stack(B,G,3)$ |
   | $4$ | $On(B,G,4), On(G,R,4)$ | — |

   All unlisted state facts are false. Each moved block and each stacking
   destination is clear at the relevant time.
5. Unsatisfiability rules out histories of the chosen length. The four-step
   plan above still exists. To rule out all plans would require a further
   argument covering every possible length.

# Wason selection task {.solved #discussion}

Try both card tasks before reading the solution. Each card gives one half
of the information needed to test the rule; its other side is hidden.
Select exactly the cards you would need to turn over.

{{< logic-app name="conditional-practice" kind="wason" >}}

1. Explain each of your selections. What would have to be on the other
   side to violate the rule? Why are the other cards unnecessary?
2. Read the [Wason selection task](https://en.wikipedia.org/wiki/Wason_selection_task)
   article, especially its discussion of social rules. Write both tasks
   as $A → B$. Do they have the same logical form?
3. Did one version seem easier? Describe one explanation discussed in the
   article. Does a difference in performance establish that people use
   different logics in the two cases?

## Solution {#discussionSolution .solution}

1. In the number task, turn over $8$ and the red card. The $8$ could have
   red on its back; the red card could have an even number. Either would
   violate the rule. An odd number is unrestricted, and blue is allowed
   with either kind of number. In the social task, inspect the beer and
   $16$ cards. Beer could be paired with an age below $18$, and $16$ with
   beer. Soda and $25$ cannot reveal a violation of the stated rule.
2. For the first task, $A$ says the number is even and $B$ says the colour
   is blue. For the second, $A$ says the drink is beer and $B$ says the age
   is at least $18$. Both ask us to look for $A$ true and $B$ false.
3. Answers about personal experience will differ. One proposed explanation
   is that a familiar social rule makes violations easier to identify.
   That does not establish a different logic: understanding the task,
   interpreting its rule, and deciding what information is relevant can
   all affect the choices. The article discusses competing explanations;
   one small classroom comparison cannot decide between them.

# Monkey and banana {.solved}

A monkey wants a banana hanging from the ceiling. It can reach it only
by standing on a box beneath it. Initially, the monkey stands beside the box. The pictures show the initial situation
and the goal: possession of the banana, with other facts left unrestricted.

1. Choose three state atoms from this vocabulary:
   $BoxUnderBanana$, $OnBox$, $HasBanana$, $BananaOnBox$, $BoxOpen$.
   Which three describe the facts needed for this problem? Explain their
   meanings, list them in the app, and translate the initial and goal states.
   Use time $0$ for the initial state and the horizon for the goal.
   Write `none` if no initial atom is true. Missing indices are accepted
   with the same meaning as in the block exercise.
2. Find a model with both frame fields empty. Explain why its actions
   need not constitute an executable plan.
3. Write frame conditions for each of the three state atoms. Once a fact
   becomes true, it stays true: none of the actions undoes it. And a
   false fact stays false unless its action occurs. For example, which
   action can change $HasBanana$ from false to true?
   Put the three conditions preserving true facts in the positive frame
   box and the three preserving false facts in the negative frame box,
   one per line. Use $t$ and $t+1$ for consecutive times, and write actions
   with a time too, for example $TakeBanana(t)$.
4. Find a plan with the corrected encoding. What is the shortest horizon?
   Explain why fewer steps cannot suffice.

The app includes the following actions. Only one occurs at a time; waiting
is also allowed. The monkey stays with the box. There is no action for climbing down, moving
the box back or dropping the banana.

| Action | Required situation | Result |
| --- | --- | --- |
| $PushBox$ | On the floor; box away from banana | Box under banana |
| $Climb$ | On the floor; box under banana | On the box |
| $TakeBanana$ | On the box beneath the banana | Has banana |

{{< logic-app name="conditionals" kind="planning" example="monkey" exercise="true" title="Monkey and banana planning exercise" >}}

## Solution {#monkey-and-bananaSolution .solution}

1. Use $BoxUnderBanana$ (box beneath the banana),
   $OnBox$ (standing on the box), and $HasBanana$ (holding the banana).
   All three are initially false. The goal requires just $HasBanana$.
   Whether the box is open and whether a banana rests on it play no role.
2. The model can choose $Wait$ at every time and make $HasBanana$ true at
   the end. The action rules say what must happen _if_ an action occurs.
   Alone, they don't require an action to explain a change.
3. The positive frame conditions are:

   $$
   BoxUnderBanana(t) → BoxUnderBanana(t+1)
   $$
   $$
   OnBox(t) → OnBox(t+1)
   $$
   $$
   HasBanana(t) → HasBanana(t+1).
   $$

   The negative frame conditions are:

   $$
   ¬BoxUnderBanana(t) ∧ ¬PushBox(t) → ¬BoxUnderBanana(t+1)
   $$
   $$
   ¬OnBox(t) ∧ ¬Climb(t) → ¬OnBox(t+1)
   $$
   $$
   ¬HasBanana(t) ∧ ¬TakeBanana(t) → ¬HasBanana(t+1).
   $$

   For example, the last condition says: if the monkey doesn't have the
   banana and doesn't take it, it still won't have it at the next time.
   Each line applies at every action time.
4. $PushBox$, $Climb$, $TakeBanana$, in that order. After
   each step, one more of the three fluents is true. The shortest horizon is
   three: taking requires climbing, and climbing requires first pushing the
   box beneath the banana. The one-action
   condition prevents combining these steps.
