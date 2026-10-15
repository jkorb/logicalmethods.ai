---
title: Probability and inductive logic
author: Johannes Korbmacher
weight: 110
params:
  id: exc-prob
  last_edited: "15/10/2026"
---

# Coin flips {.solved}

We flip two coins. Let $Heads₁$ say that the first coin lands heads and
$Heads₂$ that the second does. Assume the two outcomes are independent.

1. Write down the four Boolean models of this language.
2. Assign weights to the models for each of these scenarios:
   - Both coins are fair.
   - Each coin is twice as likely to land heads as tails.
3. Translate the following descriptions into formulas and calculate their
   probabilities under both distributions:
   - At least one coin lands heads.
   - Both coins land tails.
   - The first coin lands heads or the second lands tails.
   - Neither coin lands heads.
4. Given that at least one coin landed heads, how probable is it that both
   did? Calculate this under both distributions.

## Solution {#coin-flipsSolution .solution}

The models and their weights are:

| Model | $Heads₁$ | $Heads₂$ | Fair | Biased |
| --- | --- | --- | --- | --- |
| $M₁$ | $1$ | $1$ | ${{< frac "1" "4" >}}$ | ${{< frac "4" "9" >}}$ |
| $M₂$ | $1$ | $0$ | ${{< frac "1" "4" >}}$ | ${{< frac "2" "9" >}}$ |
| $M₃$ | $0$ | $1$ | ${{< frac "1" "4" >}}$ | ${{< frac "2" "9" >}}$ |
| $M₄$ | $0$ | $0$ | ${{< frac "1" "4" >}}$ | ${{< frac "1" "9" >}}$ |

For either biased coin, the two probabilities add up to $1$, and heads has
twice the probability of tails. Hence

$$
Pr(Headsᵢ) = {{< frac "2" "3" >}},    Pr(¬Headsᵢ) = {{< frac "1" "3" >}}.
$$

Independence gives each model's weight by multiplying the probabilities of
its two outcomes. For example,

$$
p(M₂) = Pr(Heads₁ ∧ ¬Heads₂)
= {{< frac "2" "3" >}} × {{< frac "1" "3" >}} = {{< frac "2" "9" >}}.
$$

For part 3, add the weights of the models satisfying each formula:

| Formula | Fair | Biased |
| --- | --- | --- |
| $Heads₁ ∨ Heads₂$ | ${{< frac "3" "4" >}}$ | ${{< frac "8" "9" >}}$ |
| $¬Heads₁ ∧ ¬Heads₂$ | ${{< frac "1" "4" >}}$ | ${{< frac "1" "9" >}}$ |
| $Heads₁ ∨ ¬Heads₂$ | ${{< frac "3" "4" >}}$ | ${{< frac "7" "9" >}}$ |
| $¬(Heads₁ ∨ Heads₂)$ | ${{< frac "1" "4" >}}$ | ${{< frac "1" "9" >}}$ |

The second and fourth descriptions express the same proposition. For part 4,
only the heads–heads model satisfies the conjunction. Conditioning on at
least one head gives

$$
Pr<sub>fair</sub>(Heads₁ ∧ Heads₂ | Heads₁ ∨ Heads₂)
= {{< frac "1/4" "3/4" >}} = {{< frac "1" "3" >}},
Pr<sub>biased</sub>(Heads₁ ∧ Heads₂ | Heads₁ ∨ Heads₂)
= {{< frac "4/9" "8/9" >}} = {{< frac "1" "2" >}}.
$$

# Assigning probabilities

Choose weights for the weather models to satisfy the conditions in each
level. Every weight must lie between $0$ and $1$, and together they must
sum to $1$. You can enter fractions such as $1/4$.

{{< logic-app name="probability" kind="practice" exercise="weights" title="Assigning probabilities" >}}

# Calculating probabilities

Our language now has three atoms: $SUN$, $RAIN$, and $WIND$. There are eight
Boolean models. For each formula, select its models in the table or the
picture, then add their weights. A model can satisfy the formula even when
its weight is $0$.

{{< logic-app name="probability" kind="practice" exercise="calculate" title="Calculating weather probabilities" >}}

# Independence {.solved}

Two formulas are independent under $Pr$ when

$$
Pr(A ∧ B) = Pr(A) × Pr(B).
$$

Some levels ask you to identify independence; others ask you to change the
weights to obtain it or to break it.

{{< logic-app name="probability" kind="practice" exercise="independence" title="Independence practice" >}}

Explain what happens in the last two levels. Can a conjunction be independent
of the corresponding disjunction? Can a formula be independent of its own
negation?

## Solution {#independenceSolution .solution}

Write $A = SUN ∧ RAIN$ and $B = SUN ∨ RAIN$. Since $A ⊨ B$, their
conjunction is equivalent to $A$. Independence therefore requires

$$
Pr(A) = Pr(A) × Pr(B).
$$

In level 5, $Pr(A) = {{< frac "1" "4" >}} > 0$, so we need $Pr(B) = 1$.
One solution assigns weights ${{< frac "1" "4" >}}, {{< frac "3" "8" >}},
{{< frac "3" "8" >}}, 0$ in table order. Logical dependence between formulas
can coexist with probabilistic independence under a particular distribution.

For a formula and its negation, their conjunction has probability $0$.
Independence requires

$$
0 = Pr(A) × (1 − Pr(A)).
$$

This holds exactly when $Pr(A)$ is $0$ or $1$. In the last level it is
${{< frac "1" "2" >}}$, so the formulas are dependent.

# Probability laws {.solved}

Derive the following laws from the Kolmogorov axioms and the laws proved in
{{< chapter_ref chapter="probability" id="probability-laws" >}}Probability and inductive logic{{< /chapter_ref >}}.
Give a reason for each step, as in the chapter's derivations.

1. $Pr(A ∧ ¬B) = Pr(A) − Pr(A ∧ B)$.
2. $Pr(A ∧ B) ≤ Pr(A)$.
3. $Pr(A ∨ B) ≤ Pr(A) + Pr(B)$.
4. If $Pr(B) > 0$, then $Pr(¬A | B) = 1 − Pr(A | B)$.
5. If $A$ and $B$ are independent, then $¬A$ and $B$ are independent.

## Solution {#probability-lawsSolution .solution}

1. Decompose $A$ into two incompatible cases:

   $$
   Pr(A) = Pr((A ∧ B) ∨ (A ∧ ¬B))
   = Pr(A ∧ B) + Pr(A ∧ ¬B).
   $$

   Subtract $Pr(A ∧ B)$ from both sides.

2. The preceding decomposition and nonnegativity give

   $$
   Pr(A) = Pr(A ∧ B) + Pr(A ∧ ¬B) ≥ Pr(A ∧ B).
   $$

3. Apply the disjunction law and nonnegativity:

   $$
   Pr(A ∨ B) = Pr(A) + Pr(B) − Pr(A ∧ B)
   ≤ Pr(A) + Pr(B).
   $$

4. Use part 1 with $B$ in place of $A$:

   $$
   Pr(¬A | B) = {{< frac "Pr(B ∧ ¬A)" "Pr(B)" >}}
   = {{< frac "Pr(B) − Pr(A ∧ B)" "Pr(B)" >}}
   = 1 − Pr(A | B).
   $$

5. Again using part 1, now substitute independence:

   $$
   Pr(¬A ∧ B) = Pr(B) − Pr(A ∧ B)
   = Pr(B) − Pr(A) × Pr(B)
   = (1 − Pr(A)) × Pr(B)
   = Pr(¬A) × Pr(B).
   $$

# Law of total probability {.solved}

For $0 < Pr(B) < 1$, derive

$$
Pr(A) = Pr(A | B) × Pr(B) + Pr(A | ¬B) × Pr(¬B).
$$

Use the equivalence of $A$ and $(A ∧ B) ∨ (A ∧ ¬B)$, additivity for
incompatible formulas, and the product rule. Why do we require both $Pr(B)$
and $Pr(¬B)$ to be positive?

## Solution {#law-of-total-probabilitySolution .solution}

The two disjuncts cannot both be true. Hence

$$
Pr(A) = Pr((A ∧ B) ∨ (A ∧ ¬B))
= Pr(A ∧ B) + Pr(A ∧ ¬B)
= Pr(A | B) × Pr(B) + Pr(A | ¬B) × Pr(¬B).
$$

The first step uses logical equivalence, the second additivity, and the
third the product rule. Both conditional probabilities must be defined.
A zero-probability condition would put $0$ in the denominator of the
corresponding conditional probability.

# Tricking a spam filter {.solved}

The email below is an obvious spam attempt. Change the permitted probabilities
so our naive Bayes classifier sends it to the inbox. The email, its four
markers, and the threshold stay fixed.

{{< logic-app name="probability" kind="bayes" exercise="trick" title="Tricking the spam filter" >}}

How did your changes affect the classification? What does the filter's mistake
tell us about the role of its probability estimates?

## Solution {#tricking-a-spam-filterSolution .solution}

In level 1, lowering the prior to $0.1$ is enough. The two scores become
$0.01008$ and approximately $0.0112071$, giving a spam posterior of about
$0.4735$, below the threshold $0.5$.

In level 2, one solution gives every marker likelihood $0.2$ in spam and
$0.8$ in nonspam. The filter then treats all four markers as evidence against
spam. Its posterior is

$$
{{< frac "0.2 × 0.2⁴" "0.2 × 0.2⁴ + 0.8 × 0.8⁴" >}}
= {{< frac "1" "1025" >}} ≈ 0.000976.
$$

The classifier follows the supplied probabilities. Changing them changes
what the markers count as evidence for. To use the filter on incoming mail,
we would need estimates from representative labeled emails and an evaluation
on further messages.

# Comparing support {.solved}

For each row, calculate increase of firmness $d$, log probability ratio $r$,
and log-likelihood ratio $l$. Use natural logarithms, as in the chapter.

| Distribution | $Pr(C)$ | $Pr(E)$ | $Pr(C ∣ E)$ |
| --- | --- | --- | --- |
| $Pr₁$ | $0.2$ | $0.4$ | $0.3$ |
| $Pr₂$ | $0.8$ | $0.4$ | $0.9$ |

1. Recover $Pr(C ∧ E)$, $Pr(E | C)$, and $Pr(E | ¬C)$ first.
2. Which distribution gives the stronger support under each measure?
3. If $Pr(C) = 0.99$, what is the largest possible increase of firmness?
   What is the largest possible probability ratio?

## Solution {#comparing-supportSolution .solution}

Use $Pr(C ∧ E) = Pr(C | E) × Pr(E)$ and the product rule:

| Distribution | $Pr(C ∧ E)$ | $Pr(E ∣ C)$ | $Pr(E ∣ ¬C)$ |
| --- | --- | --- | --- |
| $Pr₁$ | $0.12$ | $0.6$ | $0.35$ |
| $Pr₂$ | $0.36$ | $0.45$ | $0.2$ |

The support scores are:

| Distribution | $d$ | $r$ | $l$ |
| --- | --- | --- | --- |
| $Pr₁$ | $0.1$ | $log(1.5) ≈ 0.4055$ | $log({{< frac "12" "7" >}}) ≈ 0.5390$ |
| $Pr₂$ | $0.1$ | $log(1.125) ≈ 0.1178$ | $log(2.25) ≈ 0.8109$ |

Increase of firmness ties the two cases. The log probability ratio ranks
the first higher, while the log-likelihood ratio ranks the second higher.
For prior $0.99$, the largest increase is $0.01$ and the largest probability
ratio is ${{< frac "1" "0.99" >}} ≈ 1.0101$.

# Deductive and inductive inference {.solved}

Derive these laws of inductive support. Assume that every conditional
probability you use is defined.

1. If $A ⊨ B$, then $A$ {{< approx >}} $B$.
2. If $C ⊨ E$, then $E$ {{< approx >}} $C$. When is the increase strict?
3. Repeating a premise leaves the posterior unchanged:
   $Pr(C | E ∧ E) = Pr(C | E)$.
4. If $Pr(C) > 0$ and $Pr(E) > 0$, then $E$ positively supports $C$ iff
   $C$ positively supports $E$.
5. If $E$ positively supports $C$, it lowers the probability of $¬C$.

Finally, test the following claim: adding another premise always preserves
positive support. Find a counterexample using the weather language.

## Solution {#deductive-and-inductive-inferenceSolution .solution}

1. Since $A ⊨ B$, $A ∧ B$ is equivalent to $A$. Thus

   $$
   Pr(B | A) = {{< frac "Pr(B ∧ A)" "Pr(A)" >}}
   = {{< frac "Pr(A)" "Pr(A)" >}} = 1 ≥ Pr(B).
   $$

   This establishes weak inductive support. If $Pr(B) = 1$, equality holds.

2. Since $C ⊨ E$, $C ∧ E$ is equivalent to $C$. Hence

   $$
   Pr(C | E) = {{< frac "Pr(C)" "Pr(E)" >}} ≥ Pr(C).
   $$

   The denominator lies in $(0, 1]$. The increase is strict exactly when
   $Pr(C) > 0$ and $Pr(E) < 1$.

3. $E ∧ E$ and $E$ are logically equivalent, so both the numerator and the
   denominator of the conditional probability remain unchanged.

4. Multiplying by the positive denominators gives

   $$
   Pr(C | E) > Pr(C)
   ⇔ Pr(C ∧ E) > Pr(C) × Pr(E)
   ⇔ Pr(E | C) > Pr(E).
   $$

   Positive support is symmetric. The two conditional probabilities and
   numerical support scores can still differ.

5. By the conditional negation law,

   $$
   Pr(¬C | E) = 1 − Pr(C | E)
   < 1 − Pr(C) = Pr(¬C).
   $$

For the final claim, give the four weather models weights $0.4, 0.1, 0.1, 0.4$
in their usual order. Then $Pr(RAIN) = 0.5$ and $Pr(RAIN | SUN) = 0.8$.
Adding $¬RAIN$ to the premise gives $Pr(RAIN | SUN ∧ ¬RAIN) = 0$.
The new condition has positive probability $0.1$, so the counterexample
uses a defined conditional probability.

# Base-rate fallacy {.solved}

A fictional disease occurs in $0.01$ of a population. A test has sensitivity
$0.9$: it returns a positive result with probability $0.9$ when the person has
the disease. Its specificity is also $0.9$: it returns a negative result with
probability $0.9$ when the person does not have the disease.

1. Express this information using $HasDisease$ and $TestPositive$.
2. A randomly selected person tests positive. Calculate
   $Pr(HasDisease | TestPositive)$. Compare it with $0.9$.
3. Suppose successive test results are independent conditional on having the
   disease and conditional on not having it. Each test has the stated
   sensitivity and specificity. How many positive results are needed to
   exceed $0.5$? How many to exceed $0.9$?
4. Would three copies of the same positive report have the same effect?

For part 2, use the version of Bayes' rule whose denominator is given by the
law of total probability. The thresholds here are stipulated for the exercise.

## Solution {#base-rate-fallacySolution .solution}

The supplied probabilities are

$$
Pr(HasDisease) = 0.01,
Pr(TestPositive | HasDisease) = 0.9,
Pr(¬TestPositive | ¬HasDisease) = 0.9.
$$

Taking complements gives

$$
Pr(¬HasDisease) = 0.99,
Pr(TestPositive | ¬HasDisease) = 0.1.
$$

The law of total probability yields

$$
Pr(TestPositive) = 0.9 × 0.01 + 0.1 × 0.99 = 0.108.
$$

Bayes' rule then gives

$$
Pr(HasDisease | TestPositive)
= {{< frac "0.9 × 0.01" "0.108" >}} = {{< frac "1" "12" >}} ≈ 0.0833.
$$

The disease is rare: the non-diseased population contributes $0.099$ to the
positive results, while the diseased population contributes $0.009$. Treating
the test's sensitivity as the posterior would ignore this base rate.

Under the stated conditional-independence assumptions, each new positive
result multiplies the odds by ${{< frac "0.9" "0.1" >}} = 9$. The prior odds are
${{< frac "1" "99" >}}$. After $k$ positive results, the posterior is therefore

$$
{{< frac "9ᵏ" "99 + 9ᵏ" >}}.
$$

For $k = 1, 2, 3, 4$, this gives approximately $0.0833$, $0.45$, $0.8804$,
and $0.9851$. We exceed $0.5$ after three positives and $0.9$ after four.

Three copies of a report supply the same evidence $E$: the conjunction
$E ∧ E ∧ E$ is equivalent to $E$. The posterior stays at ${{< frac "1" "12" >}}$.
