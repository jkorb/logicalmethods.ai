---
title: Valid inference
author: Colin Caret, Annefleur de Haan, Johannes Korbmacher
locked: false
weight: 30
params:
  id: exc-val
---

# Material and logical validity {.solved}

For each of the following inferences, determine whether it is {{< term "logical-validity" "logically valid" >}} or only {{< term "material-validity" "materially valid" >}}:

1. Little Jimmy's parents are members of the club, so he's a member. For this
   fictional club, assume that children of members are automatically members.

2. Every logician knows this proof and little Jimmy is a logician. Therefore little
   Jimmy knows the proof.

3. The sentence "snow is white" is not true. Thus, the sentence is false.

4. I think, therefore I am.

5. Courage requires fear and you're not afraid. So, you're not courageous.

**Show your work!** That is: identify the schematic {{< term "logical-form" "logical form" >}} of each
inference and check whether there are invalid inferences of this form.

For the materially valid inferences, identify a premise you could add to turn
the inference into a logically valid inference.

## Solutions {.solution #material-and-logical-validitySolution}

1. This inference is only materially valid. Its form is something like:

   $$
   c's P's are Q, so c is Q.
   $$

    But suppose that $c$ is little Jimmy, his $P$'s are his favorite socks, and $Q$ is being blue. Then the inference becomes clearly invalid: $Little Jimmy's favorite socks are blue, so Jimmy is blue$.

    If you add the premise that children of club members are also members, the inference becomes logically deductively valid.

2. This inference is logically valid, as it has the same form as the Socrates inference.

3. This inference is only materially valid. Its form is something like:

   $$
   c is not P. Thus c is Q
   $$

   But if $c$ is little Jimmy, P is hungry, and $Q$ thirsty, the inference becomes: $Little Jimmy is not hungry. So, Little Jimmy is thirsty$, which is clearly invalid.

   We need to add the premise that a sentence is false if and only if it's not
   true as a further premise to make this inference valid. This premise need not hold
   in a many-valued semantics. Here we assume the sentence has exactly one of
   the two truth-values, true and false.

4. This inference is only materially valid, as it has the form $c is P. Therefore c is Q$. Most $c$'s, $P$s and $Q$s are counterexamples, but let's take $c$ to be little Jimmy, $P$ having a blue hat, and $Q$ being an adult. The inference becomes: $Little Jimmy has a blue hat. Therefore, he's an adult$.

    On this reading, we need to add the premise that everything that thinks exists.
    We're treating existence as a predicate here. In standard FOL, names
    already denote objects, so expressing the philosophical argument requires
    care about what counts as an object in the model.

5. This inference is logically deductively valid. It is an instance of $"modus tollens"$: $All A's are B's and you're not a B. Therefore, you're not an A$.

# Reasoning mistakes {.solved}

{{< img src="/img/drawings/ai_wondering.svg" width="130px" class="float-end ms-3" >}}

For each inference, identify a possible reasoning mistake or an assumption
needed to support it. For the restaurant example, discuss sampling and transfer
from one population to another; a possible difference alone does not tell us
how probable the conclusion is.

1. If you went to Oxford or Cambridge, then you went to university in the UK.
   Mr. Sir neither went to Oxford nor Cambridge, so he didn't go to university
in the UK.

2. Only New Yorkers are Yankees fans and little Jimmy is not a Yankees fan. So,
   little Jimmy is not a New Yorker.

3. I've tried over 10,000 burger places on the East Coast and almost none of
   them had vegetarian options. So, it's unlikely that this burger place on the
West Coast will have any veggie options either.

4. An AI system must be logic-based or statistics-based, and {{< logo >}} is
   logic-based. So, {{< logo >}} is not statistics-based.

5. A wheel with equally likely red and black outcomes spun black 42 times.
   Its spins are independent. So, the next time it's more likely to spin red.

**Show your work!** For deductive readings, give a possible situation where
the premises are true and the conclusion is false. For inductive readings,
explain what probability or sampling assumptions are needed; a possible false
conclusion alone does not show that {{< term "inductive-support" "inductive support" >}} is weak.

Does it make a difference whether we take the inference in question to be
inductive or deductive?

## Solution {.solution #reasoning-mistakesSolution}

1. The mistake is to forget that there are other unis in the UK that Mr. Sir
   could have gone to, such as St Andrews for example. In the possibility that
he did, the premise is true (he neither went to Oxford nor Cambridge), but the
conclusion isn't—St Andrews is in Scotland, thus the U.K.

2. The mistake is to miss that there could be New Yorkers, like little Jimmy, who aren't Yankees fans. So, if we assume that he is from NY but not a Yankees fan, it could still be the case that only New Yorkers are Yankees fans.

3. This isn't deductively valid: the East Coast observations are compatible
   with the West Coast restaurant having vegetarian options. Its inductive
   strength depends on further assumptions. Were the sampled restaurants
   representative, and are the two populations similar in the relevant way?
   If menus differ systematically by region, the transfer may fail. The
   premise alone doesn't tell us how much support the conclusion receives.

4. The mistake is to forget that systems could be hybrid, that is both
   statistics-based and logic-based. So, in a possible situation, where there
are only the two paradigms (statistics and logic-based), but {{<logo>}} is a
hybrid AI system, the premise is true but the conclusion isn't.

5. This is another inductive {{< term "fallacy" "fallacy" >}}, known as the [Gambler's
   fallacy](https://en.wikipedia.org/wiki/Gambler%27s_fallacy). The mistake is
to overlook the stated independence assumption. Earlier spins do not change
the next spin's chance of red: it remains 1/2. Our wheel has only red and black
outcomes; an ordinary roulette wheel also has zero pockets.

# Inferences in LLMs {.solved}

When you rely on an LLM's answer, what do you need to check? Sometimes you
can compare a claim with a source. Sometimes you need to ask whether a
conclusion follows, whether a proposed solution works, or which assumptions
support a recommendation.

Work through the written questions yourself first. The live-model activity
below is optional. Assess the argument a model presents; its explanation
need not be a faithful report of how it produced the answer.

## What would count as checking?

Consider these four uses of an LLM:

1. It reports an application deadline from a document you supplied.
2. It decides whether an applicant qualifies for a scholarship by applying
   the stated eligibility rules to the applicant's details.
3. It proposes a timetable that should satisfy your list of constraints.
4. It predicts that a teaching method that worked in another class will
   improve results in yours.

For each case, answer:

- What could you establish by checking the facts against a source?
- What, if anything, would remain to be checked about the inference or answer?
- Describe a suitable check. Would you need to examine the argument, find a
  counterexample, test the proposed solution, or investigate assumptions?

Does checking an LLM's reasoning always require reading its explanation?
Use the timetable example to explain your answer.

## Every fact checks out

Consider this fictional LLM response:

{{< inference layout="stacked" >}}
$Every scholarship recipient is enrolled at the university$
$Sam is enrolled at the university$
---
$Sam receives a scholarship$
{{< /inference >}}

You check the university's records and discover that all three statements
are true: Sam really does receive a scholarship.

1. Have you established that the inference is logically valid? Identify its
   form and describe a counterexample to that form.
2. What have you established by checking the records?
3. Add a general premise that makes the inference logically valid.
4. Suppose the university wants to use this reasoning to assess other
   applicants. Why does the distinction between a true conclusion and a
   valid inference matter now?

## Can we reuse the reasoning? — optional live-model activity

A fictional laboratory has the following rules:

1. Anyone permitted to enter is safety-trained.
2. Anyone who is safety-trained, has a valid pass, and is not suspended is
   permitted to enter.
3. Anyone who is suspended is not permitted to enter.
4. Anyone who has completed the induction is safety-trained.

For this exercise, take the rules and the listed facts as true. Missing
information is **unknown**, not false. Classify each case as **permission
established**, **prohibition established**, or **neither established**.

| Person | Known facts |
| --- | --- |
| Ada | Has completed the induction, has a valid pass, and is not suspended. |
| Ben | Is safety-trained. |
| Cy | Is safety-trained, has a valid pass, and is suspended. |
| Dee | Is not safety-trained. |
| Eli | Has completed the induction and is not suspended. |

1. Classify the cases yourself and justify your answers using the rules.
   For an undecided case, describe two situations compatible with the rules
   and facts: one permitting entry and one prohibiting it.
2. Give an LLM the rules, facts, and task. Ask for a classification and a
   brief justification identifying the rules used. Compare its answers with
   yours. Check the reasoning even where the classifications agree.
3. Change one of Ada's facts: replace “is not suspended” with “is suspended.”
   Predict the correct answer before asking the model again. Then test a
   separate change: withhold the information about Ada's pass, keeping her
   other original facts. Explain why these two changes have different effects.
4. Record the model and date, your prompts, its answers, and your assessment.
   If it answers every case correctly, explain what your tests establish and
   what they leave open. You do not need to make it fail.

You can also complete this activity on paper by exchanging classifications
and justifications with another student. Using an LLM is part of this optional
activity; follow the course's rules for its use in other work.

## What assumption is doing the work?

Consider another fictional LLM response:

> Most students who used flashcards passed last year's exam. Therefore,
> using flashcards will probably help you pass your exam.

1. Suppose you have verified the reported observation. Does that establish
   the recommendation? Identify assumptions about the students, exams, and
   use of flashcards that could affect its support.
2. Describe two situations compatible with the observation: one in which
   it provides good grounds for the recommendation, and one in which it
   provides little support. Distinguish being likely to pass from becoming
   more likely to pass **because of** using flashcards.
3. Think of one way you use AI—or might use it—to study, plan, or make a
   decision. In about 150 words, identify a conclusion you would rely on,
   the facts and assumptions behind it, and how you would check its support.
   If you have used AI this way already, compare that plan with what you
   actually checked. Would agreement from a second chatbot settle the issue?

## Suggested answers {.solution #inferences-in-llmsSolution}

### What would count as checking?

1. **Deadline:** compare the answer with the relevant passage, including
   which application, year, and conditions it concerns. For a straightforward
   report, this may settle the question without inspecting an explanation.
2. **Eligibility:** verify the applicant's details and the applicable rules,
   then check whether the conclusion follows. Correct facts can still be
   combined incorrectly, for example by confusing necessary and sufficient
   conditions or overlooking an exception.
3. **Timetable:** check the proposed timetable against every stated constraint.
   If it satisfies them all, it is a solution, regardless of how the model
   found it. A further claim that it is the *best* timetable needs a separate
   justification, as do assumptions that the constraints adequately describe
   the real scheduling problem.
4. **Teaching method:** verify the report about the earlier class, then
   investigate what connects those results to your class. Differences between
   students, teaching conditions, or how success was measured may affect the
   inference. The future outcome cannot yet be checked against a record.

The appropriate check depends on the claim and what you need it for. Reading
an explanation can help expose an invalid step or a hidden assumption, but
checking a proposed solution directly can sometimes establish what you need.

### Every fact checks out

1. No. The inference has the form “All As are Bs; Sam is B; therefore Sam is
   A.” This reverses the direction of the first premise. An enrolled student
   without a scholarship is a counterexample. In conditional form, this is
   affirming the consequent.
2. You have independently established that the conclusion is true, along with
   the premises. That does not establish the validity of the presented inference.
3. Add “Every enrolled student receives a scholarship.” Together with Sam's
   enrollment, this entails the conclusion. Whether this new premise is true
   is a further question.
4. The same pattern could wrongly classify enrolled students who do not have
   scholarships. Success in Sam's case does not justify using it as a general
   decision rule. A particular answer can be correct even when the proposed
   reasoning would fail in other cases.

### Can we reuse the reasoning?

| Person | Classification | Justification |
| --- | --- | --- |
| Ada | Permission established | Rule 4 gives training; rule 2 then gives permission. |
| Ben | Neither established | Training is necessary, but alone is not sufficient to establish permission. |
| Cy | Prohibition established | Rule 3 applies. Rule 2 requires that Cy is not suspended. |
| Dee | Prohibition established | Rule 1 says permission requires training. With no training, permission is ruled out by modus tollens. |
| Eli | Neither established | Rule 4 gives training, but the information needed to apply rule 2 is incomplete. |

For Ben, one compatible situation gives him a valid pass and no suspension,
so rule 2 permits entry. Another makes him suspended, so rule 3 prohibits it.
For Eli, a valid pass would establish permission. With no valid pass, the
rules allow a situation in which he is not permitted to enter—but do not
require that outcome. Thus neither permission nor prohibition follows from
Eli's listed facts alone.

Replacing Ada's non-suspension with suspension establishes prohibition by
rule 3. Withholding her pass information instead leaves the case undecided:
failing to establish permission is different from establishing prohibition.

A model can reach the right classification with a mistaken justification.
For example, saying Ada may enter simply because she is trained would overlook
two conditions in rule 2. Correct classifications and valid justifications
across these cases are evidence of success on these tests, not a guarantee
for every possible rulebook or case.

### What assumption is doing the work?

The observation concerns a group of students who used flashcards. It does
not by itself establish that flashcards improved their chances, or that the
same recommendation applies to you.

In one situation, the exams and students are comparable to yours, and further
evidence shows that flashcard practice helped students learn the tested
material. In another, already well-prepared students chose flashcards, most
would have passed anyway, and your exam tests skills that their cards did not
address. The reported observation can be true in both situations, while the
case for the recommendation differs.

Your reflection should identify a particular use and a concrete check. For
example, if you use AI to plan exam preparation, verify what the exam covers
and assess whether the proposed activities actually practice those skills.
Another chatbot's agreement does not by itself settle either question: it
may repeat the same assumption or error. Explain what independent evidence
or reasoning would give you grounds to rely on the recommendation.

# Sets {.solved}

Calculate the intersections in 1–5. In 5, assume that only the rabbit among
the pictured objects is an animal with long ears. In 9, assume the soda and
beer are sparkling beverages.

1. {{< set expression=true inline=true alt="Intersect Jimmy, soda, and beer with Mr. Sir and beer." >}}[{"set": [{"image": "gimmick_little_jimmy"}, {"image": "gimmick_soda"}, {"image": "gimmick_beer"}]}, "∩", {"set": [{"image": "gimmick_mr_sir"}, {"image": "gimmick_beer"}]}]{{< /set >}}

2. {{< set expression=true inline=true alt="Intersect Jimmy and Mr. Sir with Mr. Sir and Jimmy." >}}[{"set": [{"image": "gimmick_little_jimmy"}, {"image": "gimmick_mr_sir"}]}, "∩", {"set": [{"image": "gimmick_mr_sir"}, {"image": "gimmick_little_jimmy"}]}]{{< /set >}}

3. ${ n : n is an integer and 1 < n < 10 } ∩ { n : n is an even integer }$

4. {{< set expression=true inline=true alt="Intersect Jimmy, Granny Smith, and AI with Mr. Sir and a rabbit." >}}[{"set": [{"image": "gimmick_little_jimmy"}, {"image": "gimmick_granny_smith"}, {"image": "ai_pointer"}]}, "∩", {"set": [{"image": "gimmick_mr_sir"}, {"image": "gimmick_rabbit"}]}]{{< /set >}}

5. {{< set expression=true inline=true alt="Intersect Jimmy, a rabbit, and Mr. Sir with the set of animals with long ears." >}}[{"set": [{"image": "gimmick_little_jimmy"}, {"image": "gimmick_rabbit"}, {"image": "gimmick_mr_sir"}]}, "∩ { x : x is an animal with long ears }"]{{< /set >}}

Which claims in 6–9 are true? Explain using the definition of {{< term "subset" "subset" >}}.

6. {{< set expression=true inline=true alt="Mr. Sir and Jimmy are not a subset of Jimmy, a rabbit, and Mr. Sir." >}}[{"set": [{"image": "gimmick_mr_sir"}, {"image": "gimmick_little_jimmy"}]}, "⊈", {"set": [{"image": "gimmick_little_jimmy"}, {"image": "gimmick_rabbit"}, {"image": "gimmick_mr_sir"}]}]{{< /set >}}

7. {{< set expression=true inline=true alt="One and beer are a subset of beer and one." >}}[{"set": ["1", {"image": "gimmick_beer"}]}, "⊆", {"set": [{"image": "gimmick_beer"}, "1"]}]{{< /set >}}

8. {{< set expression=true inline=true alt="The empty set is not a subset of Jimmy, Granny Smith, and AI." >}}[{"set": []}, "⊈", {"set": [{"image": "gimmick_little_jimmy"}, {"image": "gimmick_granny_smith"}, {"image": "ai_pointer"}]}]{{< /set >}}

9. {{< set expression=true inline=true alt="Soda and beer are a subset of sparkling beverages." >}}[{"set": [{"image": "gimmick_soda"}, {"image": "gimmick_beer"}]}, "⊆ { x : x is a sparkling beverage }"]{{< /set >}}

Find every subset of the set in 10.

10. {{< set expression=true inline=true alt="The set containing a rabbit, Granny Smith, and AI." >}}[{"set": [{"image": "gimmick_rabbit"}, {"image": "gimmick_granny_smith"}, {"image": "ai_pointer"}]}]{{< /set >}}

## Solutions {.solution #setsSolution}

1. {{< set expression=true inline=true alt="The set containing beer." >}}[{"set": [{"image": "gimmick_beer"}]}]{{< /set >}}

2. {{< set expression=true inline=true alt="The set containing Jimmy and Mr. Sir." >}}[{"set": [{"image": "gimmick_little_jimmy"}, {"image": "gimmick_mr_sir"}]}]{{< /set >}}

3. ${2, 4, 6, 8}$.

4. The empty set, $∅$: none of the pictured members occurs in both sets.

5. {{< set expression=true inline=true alt="The set containing the rabbit." >}}[{"set": [{"image": "gimmick_rabbit"}]}]{{< /set >}}

6. False. Both Mr. Sir and Jimmy belong to the set on the right, so the first set **is** a subset of it.

7. True. The two sets have exactly the same members; their order does not matter.

8. False. The empty set is a subset of every set: it has no member that could fail to belong to the other set.

9. True under the stated assumption: both objects are sparkling beverages.

10. There are eight subsets, including the empty set and the whole set:

    {{< set expression=true inline=true alt="The set containing no members." >}}[{"set": []}]{{< /set >}}

    {{< set expression=true inline=true alt="The set containing rabbit." >}}[{"set": [{"image": "gimmick_rabbit"}]}]{{< /set >}}

    {{< set expression=true inline=true alt="The set containing Granny Smith." >}}[{"set": [{"image": "gimmick_granny_smith"}]}]{{< /set >}}

    {{< set expression=true inline=true alt="The set containing AI." >}}[{"set": [{"image": "ai_pointer"}]}]{{< /set >}}

    {{< set expression=true inline=true alt="The set containing rabbit, Granny Smith." >}}[{"set": [{"image": "gimmick_rabbit"}, {"image": "gimmick_granny_smith"}]}]{{< /set >}}

    {{< set expression=true inline=true alt="The set containing rabbit, AI." >}}[{"set": [{"image": "gimmick_rabbit"}, {"image": "ai_pointer"}]}]{{< /set >}}

    {{< set expression=true inline=true alt="The set containing Granny Smith, AI." >}}[{"set": [{"image": "gimmick_granny_smith"}, {"image": "ai_pointer"}]}]{{< /set >}}

    {{< set expression=true inline=true alt="The set containing rabbit, Granny Smith, AI." >}}[{"set": [{"image": "gimmick_rabbit"}, {"image": "gimmick_granny_smith"}, {"image": "ai_pointer"}]}]{{< /set >}}

# Reading set diagrams

Each diagram shows all the members of its sets. Decide whether the statement
is true or false, and explain to yourself what in the diagram supports your
answer. The diagram changes between levels, so a statement that was true
before may become false.

{{< set-diagram exercise="relations" >}}

## Selecting intersections

Now find the objects shared by both sets. Select every member of $S ∩ T$,
then check your answer. Select a picture again to remove it; Tab and Enter or
Space work too. Remember that an {{< term "intersection" "intersection" >}} can be empty.

{{< set-diagram exercise="intersections" >}}

# Finding countermodels {.solved}

Treat the worlds shown here as the entire model space for this exercise.
First find where both premises are true; then look for a world where the
conclusion fails. Explain why a world with a false premise cannot be a
{{< term "countermodel" "countermodel" >}} to this inference.

{{< set-diagram scene="countermodel" exercise="countermodels" >}}

## Solution {.solution #finding-countermodelsSolution}

A countermodel must make **all** premises true and the conclusion false.
A false premise therefore disqualifies a world, even if the conclusion is false too.

# Monotonicity of deductive inference {.solved}

Deductive consequence is {{< term "monotonicity" "monotone" >}}: adding premises to a valid inference
cannot make it invalid, while the model space and meanings stay fixed.
Prove this using the set-theoretic definition of consequence.

1. State monotonicity using $⊨$, premises $P₁, …, Pₙ$, conclusion $C$, and
   an additional premise $Q$.
2. Translate the claim into a claim about intersections and subsets of the
   propositions $[P₁], …, [Pₙ], [Q]$, and $[C]$.
3. For arbitrary sets $S, S′, T$, prove: if $S ⊆ T$, then $S ∩ S′ ⊆ T$.
   _Hint_: Take any member of $S ∩ S′$ and apply the definitions of $∩$ and $⊆$.
4. Explain how this proves monotonicity. Which sets play the roles of $S$, $S′$, and $T$?
5. Give a valid inference, add a premise, and explain why it remains valid.

## Solutions {.solution #monotonicity-of-deductive-inferenceSolution}

1. If $P₁, …, Pₙ ⊨ C$, then $P₁, …, Pₙ, Q ⊨ C$.
2. If $[P₁] ∩ … ∩ [Pₙ] ⊆ [C]$, then $[P₁] ∩ … ∩ [Pₙ] ∩ [Q] ⊆ [C]$.
3. Suppose $S ⊆ T$. Let $x$ be any member of $S ∩ S′$. Then $x ∈ S$ and
   $x ∈ S′$. Since every member of $S$ belongs to $T$, we have $x ∈ T$.
   Thus every member of $S ∩ S′$ is in $T$, which means $S ∩ S′ ⊆ T$.
   This also covers an empty intersection: there is then no member that could
   fail to belong to $T$.
4. Put $S = [P₁] ∩ … ∩ [Pₙ]$, $S′ = [Q]$, and $T = [C]$. The theorem
   gives exactly the claim in 2. Adding a premise restricts the models where
   all premises are true; it cannot introduce a countermodel.
5. From “All humans are mortal” and “Socrates is human,” infer “Socrates is
   mortal.” Add “It is raining.” Every model of all three premises still
   satisfies the first two, and therefore still makes the conclusion true.

# Failure of inductive monotonicity {.solved}

Inductive support can be defeated by further information. We will show that
even a weakly logically inductively valid inference can become invalid when
we add a premise.

Consider a fair six-sided die. Write $TWO$ for “the outcome is two,” $EVEN$
for “the outcome is even,” and $HIGH$ for “the outcome is greater than three.”
Each outcome has probability $1/6$:

{{< set expression=true alt="TWO contains outcome two." >}}["[TWO] =", {"set": [{"image": "d6_2"}]}]{{< /set >}}

{{< set expression=true alt="EVEN contains outcomes two, four, and six." >}}["[EVEN] =", {"set": [{"image": "d6_2"}, {"image": "d6_4"}, {"image": "d6_6"}]}]{{< /set >}}

{{< set expression=true alt="HIGH contains outcomes four, five, and six." >}}["[HIGH] =", {"set": [{"image": "d6_4"}, {"image": "d6_5"}, {"image": "d6_6"}]}]{{< /set >}}

1. Calculate $Pr([TWO] | [EVEN])$ and compare it with $Pr([TWO])$.
2. Explain why $EVEN$ weakly logically supports $TWO$, even when the die
   is not fair. Consider every distribution with $Pr([EVEN]) > 0$.
3. Calculate $Pr([TWO] | [EVEN] ∩ [HIGH])$ for the fair die. What does this
   show about material support and logical inductive validity?
4. Describe what the additional premise does. Give another example in which
   new evidence defeats inductive support.

## Solution {#failure-of-inductive-monotonicitySolution .solution}

1. $Pr([TWO] | [EVEN]) = (1/6) / (3/6) = 1/3$, compared with
   $Pr([TWO]) = 1/6$. The premise raises the conclusion's probability.
2. Since $[TWO] ⊆ [EVEN]$, we have
   $Pr([TWO] | [EVEN]) = Pr([TWO]) / Pr([EVEN]) ≥ Pr([TWO])$ whenever
   $Pr([EVEN]) > 0$. Dividing a nonnegative number by a positive number
   at most $1$ cannot make it smaller. This establishes weak logical support
   across all the relevant distributions; the fair-die calculation alone would not.
3. The even outcomes greater than three are four and six. Neither is two, so
   $Pr([TWO] | [EVEN] ∩ [HIGH]) = 0 / (2/6) = 0 < 1/6$.
   Under this distribution, the enlarged premise set counts **against** the
   conclusion. This one distribution is also a counterexample to weak logical
   inductive validity, which requires non-decrease under every distribution.
4. The new premise rules out the conclusion while remaining compatible with
   the old premise. For another example, a card is drawn uniformly from cards
   numbered 1–4. Learning that its number is at most 2 raises the probability
   of 1 from $1/4$ to $1/2$. Learning in addition that it is even leaves only
   card 2, so the probability of 1 falls to zero.

# Comparing measures of support {.solved}

Consider two probability functions for evidence $E$ and conclusion $C$:

| Distribution | $Pr([C])$ | $Pr(E ∣ [C])$ | $Pr(E ∣ [¬C])$ | $Pr([C] ∣ E)$ |
| --- | --- | --- | --- | --- |
| A | $0.5$ | $0.8$ | $0.2$ | $0.8$ |
| B | $0.9$ | $0.8$ | $0.2$ | $36/37$ |

1. Calculate the probability increase and the {{< term "likelihood-ratio" "likelihood ratio" >}} for each row.
2. Which row gives stronger support by probability increase? What about
   log-likelihood support? You do not need to calculate a logarithm.
3. Do these two rows establish logical inductive support? Explain.
4. What further work would be needed to decide which distribution fits an actual situation?

## Solution {.solution #comparing-measures-of-supportSolution}

1. For A, the increase is $0.8 − 0.5 = 0.3$. For B, it is
   $36/37 − 0.9 = 27/370$, approximately $0.073$. Both likelihood ratios are
   $0.8 / 0.2 = 4$.
2. Probability increase ranks A higher. Log-likelihood support is $log(4)$
   in both, so it ranks them equally. The measures capture different aspects
   of support.
3. No. We have checked material support under two particular functions.
   Logical support requires the condition to hold under **every** admissible
   probability function, keeping the propositions' logical relationships fixed.
4. We need data and assumptions about the situation to estimate or justify
   a probability distribution. This is a statistical and subject-matter task,
   distinct from calculating support once a distribution is given.
