---
title: Probability and inductive logic
author: Johannes Korbmacher
weight: 110
params:
  date: 21/10/2024
  last_edited: "15/10/2026"
  id: txt-prob
---

# Probability and inductive logic

{{< img src="/img/drawings/prob_llm_example.svg" class="float-start inert-img img-fluid m-2" width="340px" alt="Colored tokens in Logic is lead to possible continuations with different probabilities." >}}

Inductive inference plays a crucial role in AI technologies both on the low
level and on the high level. On the low level, inductive inference is, importantly, the logical foundation for [large language models
(LLMs)](https://en.wikipedia.org/wiki/Large_language_model), which in turn give
us [chatbots](https://en.wikipedia.org/wiki/Chatbot) and other modern AI
technologies. In essence, an LLM is (an approximation of) a [probability
distribution](https://en.wikipedia.org/wiki/Probability_distribution) over
[tokens](https://en.wikipedia.org/wiki/Large_language_model#Tokenization)—small-ish
sequences of characters that make up words. The idea is that we can use the
[conditional probability](https://en.wikipedia.org/wiki/Conditional_probability)
of one token given a sequence of others to predict what the _next_
token in the sequence should be. The perhaps surprising fact is that this
"next-token prediction" allows us to develop AI agents with human-like
abilities.

{{< inference layout="stacked" >}}
$t₁ = Lo, t₂ = g, t₃ = ic, t₄ = is$
---
$t₅ = a$
{{< /inference >}}

LLMs, and the technologies that they are based on, are the state of the art of
statistics-based AI: they are not based on hand-written if-then rules and
automated deductive inference, but on statistical models of large-scale
datasets, which are developed using advanced [machine learning
methods](https://en.wikipedia.org/wiki/Machine_learning), such as [gradient
descent](https://en.wikipedia.org/wiki/Gradient_descent). But the fact that LLMs
aren't
[logic-based](https://en.wikipedia.org/wiki/Symbolic_artificial_intelligence)
doesn't mean that they have nothing to do with logic. In fact, next-token
prediction is a form of _(inductive) inference_: $t₁, ..., tₙ$ are the previous
tokens, therefore $s$ is the next token. If we want to have any hope at all
of understanding how LLMs work on the low level, we need to study inductive
logic.

In this sense, what we call "inference" when running an LLM is indeed an
inductive inference. The preceding tokens are the evidence, and the proposed
next token is the conclusion. The evidence can make that continuation more
probable without making it the only possible continuation. Choosing a token
from the predicted distribution turns that assessment into an output.

{{< img src="/img/drawings/prob_ai_spam.svg" class="rounded float-end inert-img img-fluid m-2" width="150px" alt="∀I holds a suspicious email marked definitely not SPAM." >}}
In fact, inference that involves prediction is typically inductive—we can hardly
ever make predictions with certainty. In this chapter, we'll focus on predictive
inference on the higher, propositional level. As an example of an AI-technology
that features inductive inference we'll look at [$SPAM$
filters](https://en.wikipedia.org/wiki/Email_filtering).

There are different approaches to inductive logic in AI-research. In the
logic-based tradition, there are systems which aim to assimilate inductive logic
to deductive logic:  they work just like the systems we know from deductive logic
in terms of syntax, semantics, and proof-theory, except that their consequence
relation is inductive: it allows for the premises to be true and the conclusion
to be false. The results are systems of [non-monotonic
logic](https://en.wikipedia.org/wiki/Non-monotonic_logic), such as
[autoepistemic logic](https://en.wikipedia.org/wiki/Autoepistemic_logic) and
[default logic](https://en.wikipedia.org/wiki/Default_logic), which have a solid
place in logic-based AI research.

But in broader terms, [probability
theory](https://en.wikipedia.org/wiki/Probability_theory) is the most widely
used framework for inductive logic. In this chapter, we'll look at probability
through the lens of logical theory. As you'll see, we can develop the standard
theory of [finite, discrete probability
distributions](https://en.wikipedia.org/wiki/Probability_distribution#Discrete_probability_distribution)
using the truth-tables we're familiar with from Boolean logic. This allows us to
develop the standard theory of inductive inference in the same setting as the
standard theory of deductive inference—which in turn makes it possible to
compare the two.

{{< callout type="objectives" >}}
After studying this chapter, you will be able to:

- Represent a finite probability distribution using weighted truth-tables;
- Calculate probabilities of formulas and conditional probabilities;
- Apply probability laws and Bayes' rule;
- Compare measures of inductive support under a given distribution;
- Explain how a naive Bayes classifier combines evidence;
- Distinguish support under a distribution from logical inductive support.
{{< /callout >}}

## Probabilities

In {{< chapter_ref chapter="valid-inference" >}}Valid inference{{< /chapter_ref >}},
we began our account of induction with models: possible reasoning scenarios. We
will now assign _probabilities_ to those models, which in some lose sense tell us how likely it is that a given model corresponds to the way things "really" are. So, the logical space of models we studied in {{< chapter_ref chapter="boolean" >}}Boolean algebra{{< /chapter_ref >}} and {{< chapter_ref chapter="fol" >}}FOL{{< /chapter_ref >}} is our starting point. Each element of logical space --- each model --- will be assigned a numeric value --- its _weight_ --- to represent its intrinsic probability.

As we already discussed at length, which models there are depends on which
language we chose for a given reasoning scenario. Restricting ourselves for the
moment to propositional languages, if our only atoms are $SUN$ and $RAIN$, for
example, we know that there are $2² = 4$ Boolean models. They are the same, in
essence, the four weather scenarios we used in {{< chapter_ref
chapter="boolean" >}}Boolean algebra{{< /chapter_ref >}}.

What we're ultimately interested for inductive inference are the probabilities
of _propositions_, i.e. sets of models. Remember that formula picks out a
proposition: the models in which it is true. So, in our weather language, we work with the following logical space:

{{< logic-app name="boolean" kind="models" preset="propositions" title="Weather models and propositions" >}}

In {{< chapter_ref chapter="valid-inference" >}}Valid inference{{< /chapter_ref >}},
we talked about probabilities in terms of
{{< term "sample-space" "sample spaces" >}} and  {{< term "event" "event" >}} --- the set of _all_ possible
outcomes and individual, restricted sets of outcomes. This way of speaking is
common when developing probability theory in general, possibly non-logical
contexts. For our study of inductive logic, we'll make the sample space
concrete as a _logical space_ and the events as _propositions_. Mathematically
speaking, there's little difference between these two ways of speaking, but to
help us understand what's going on from a logical perspective, this focus on
logical concepts goes a long way.

### Probability masses

Suppose now that we're thinking about the probability of different weather
scenarios in our langauge. Our logical space tells us which scenarios there are
and which propositions are true in which of those scenarios. But our model so far doesn't tell us anything about how likely any of these scenarios is. To model this extra information, we use the concept of a
{{< term "probability-mass" "probability mass" >}}:

{{< callout type="definition" title="Probability mass function" >}}
Let $Ω$ be a nonempty finite set of models for a language. A {{< term
"probability-mass-function" "probability mass function" >}} on $Ω$ is a
function $p : Ω → [0, 1]$ such that

$$ ∑<sub>M ∈ Ω</sub> p(M) = 1. $$
{{< /callout >}}

That is, $p$ assigns to each model a [real
number](https://en.wikipedia.org/wiki/Real_number) between 0 and 1, which
intuitively represents the information how likely the model is. Here, the set
$[0, 1]$ is the so-called [unit
interval](https://en.wikipedia.org/wiki/Unit_interval), which includes every
number between 0 and 1 inclusive, i.e. $$[0, 1] = { x ∈ ℝ ∣ 0 ≤ x ≤ 1}.$$ The
weights are subject to the condition that the weights over all the models sum
up to one. Here, the sum symbol $∑$ is used to represent sums of undetermined
length. If our model space is the $Ω = {M₁, M₂, M₃, M₄}$ from our weather
scenario, then the expression $∑<sub>M ∈ Ω</sub> p(M) = 1$ says that
$$p(M₁) + p(M₂) + p(M₃) + p(M₄) = 1$$ The underlying idea  is that the number
$1$ represents certainty and adding the weights of models is a way of obtaining
the chance that at least one of the models whose weights we're adding up
corresponds to reality. So, $p(M₁) + p(M₂) + p(M₃) + p(M₄) = 1$ says that at
least one of the models $M₁, M₂, M₃, M₄$ adequately represents reality. The
different models divide up the certainty represented by $1$ among each other,
but together they make up all the possibilities.

Importantly, there is more than one way of assigning weights to models,
corresponding to different information scenarios. In our weather scenario, for
example, we can represent absolute uncertainty by assigning each model the mass
$$p(Mᵢ) = {{< frac "1" "4" >}}.$$ This is the unique way of assigning the same weight to
each of our models --- just solve the equation system $x₁ + x₂ + x₃ + x₄ = 1$
and $xᵢ = xⱼ$ for $i, j ∈ [0, 1]$. Another way would be to assign mass ${{< frac
"1" "2" >}}$ to each sunny model and $0$ to the others, that is: $$p(M₁) = {{<
frac "1" "2" >}}, p(M₂) = {{< frac "1" "2" >}}, p(M₃) = 0, p(M₄) = 0.$$ This
assignment satisfies out constraint that $p(M₁) + p(M₂) + p(M₃) + p(M₄) = 1$
and is thus a perfectly valid probability mass. It represents the information
that its certain that it's going to be sunny, since the sum of all models where
it's sunny works out to $1$, $$p(M₁) + p(M₂) = 1.$$ Bottom line: there is no
"logical" way of determining probability weights. Which weights we should
assign to our models depends on our modelling situation, which information is
available.

There are different ways of spelling out what the information "how likely a
model is" means conceptually.
[Bayesians](https://en.wikipedia.org/wiki/Bayesian_probability), for example,
think of probability as a form of reasonable subjective expectation.
[Frequentists](https://en.wikipedia.org/wiki/Frequentist_probability), instead,
think of probability representing in terms of how often something would happen
in an idealized, repeated experiment. In this chapter, we'll try to avoid these
philosophical complications and think of probabilities conceptually in an
intuitive way, using terms like "chance", "likelihood", etc. assuming "you know
what we mean."

### Probabilities of sentences {#probability-tables}

Having assigned weights to the models, we can assign probabilities to
propositions --- and therefore formulas. The idea is already contained in
our discussion: a proposition is a set of models, and its probability is the
sum of their weights. To find the probability of a formula, then, we add the
weights of precisely those models in which it is true.

For example, $SUN ∨ ¬RAIN$ is true in three of our four weather models.
Under the uniform distribution, we get

$$
Pr(SUN ∨ ¬RAIN) = {{< frac "1" "4" >}} + {{< frac "1" "4" >}} + {{< frac "1" "4" >}} = {{< frac "3" "4" >}}.
$$

{{< callout type="definition" title="Probability of a sentence" >}}
Given a mass function $p$ on finite $Ω$, the
{{< term "probability-function" "probability function" >}} assigns to each
sentence $A$ the {{< term "formula-probability" "probability" >}}

$$
Pr(A) = ∑<sub>M ∈ Ω, M ⊨ A</sub> p(M).
$$
{{< /callout >}}

The condition $M ⊨ A$ underneath the sum tells us which weights to include.
So $Pr(A) = Pr([A])$: the probability of $A$ is the probability of the
{{< term "proposition" "proposition" >}} it expresses. We can calculate it
using a {{< term "probabilistic-truth-table" "probabilistic truth-table" >}}:
our familiar truth-table, with an extra column for the model weights.

{{< logic-app name="probability" title="Probabilities of formulas" formula="SUN ∨ ¬RAIN" >}}

The truth-table tells us which models to count; the weights tell us how much
each contributes. Changing the weights can therefore change the probability
of a formula while leaving its truth-table exactly as it was. Under the
"Sun certain" distribution, for example, $SUN ∨ ¬RAIN$ has probability $1$:
all the weight belongs to sunny models, and each of them makes it true.

### The die models

The same idea applies to the die from
{{< chapter_ref chapter="valid-inference" >}}Valid inference{{< /chapter_ref >}}.
Here, we first need a language for describing the possible outcomes. Let's
use six propositional variables $D₁, …, D₆$, interpreting $Dᵢ$ as the claim
that the die shows $i$. There are $2⁶ = 64$ Boolean models of this language.
But most of them don't describe a possible roll: a die can't show both two
and six, for example. Our intended scenario has just six models. In $Mᵢ$,
$Dᵢ$ is true and all the other variables are false. We can depict each of
these models by the corresponding die face.

{{< callout type="note" title="Modeling assumptions: the die" >}}
The die shows exactly one of its six faces. We restrict the model space to
the six valuations that satisfy this assumption. Equivalently, we can keep
all 64 valuations and give the other 58 mass $0$. Fairness is a further
assumption: it gives each of the six admissible models mass ${{< frac "1" "6" >}}$.
{{< /callout >}}

We can now describe more complex propositions using formulas. We'll use
three abbreviations:

$$
EVEN = D₂ ∨ D₄ ∨ D₆
HIGH = D₄ ∨ D₅ ∨ D₆
TWO = D₂.
$$

Given our interpretation, $EVEN$ is true in precisely $M₂$, $M₄$, and $M₆$.
Its probability is therefore the sum of their weights. If the die is fair,

$$
Pr(EVEN) = p(M₂) + p(M₄) + p(M₆)
 = {{< frac "1" "6" >}} + {{< frac "1" "6" >}} + {{< frac "1" "6" >}} = {{< frac "1" "2" >}}.
$$

If it's loaded, we need different weights. Suppose six has mass
${{< frac "1" "2" >}}$ and each other face has mass ${{< frac "1" "10" >}}$. Then

$$
Pr(EVEN) = {{< frac "1" "10" >}} + {{< frac "1" "10" >}} + {{< frac "1" "2" >}} = {{< frac "7" "10" >}}.
$$

{{< logic-app name="probability" kind="dice" title="Die probabilities" formula="EVEN" >}}

As with the weather, the interpretation stays fixed while the weights change.
We can even put all the mass on a single model. Under "Certain", only $M₁$
has positive mass. The other five outcomes are still possible rolls; our
weights represent certainty about which one will occur. Probability $0$
under a particular distribution therefore doesn't imply logical impossibility,
just as probability $1$ doesn't imply logical truth.

## Conditional probabilities {#conditional-probabilities}

So far, we've assigned probabilities before learning which outcome occurred.
What changes if we learn something about it? Suppose we know that the die
showed an even number. Only two, four, and six remain relevant. Their masses
now have to be compared with the total mass of $EVEN$.

Conditional probabilities are the logical engine of inductive inference.
The premises give us information, and we ask how probable the conclusion is
given that information. This is the calculation we will use throughout the
rest of the chapter to assess inductive inferences.

{{< callout type="definition" title="Conditional probability" >}}
For sentences $A, B$ with $Pr(B) > 0$, the
{{< term "conditional-probability" "conditional probability" >}} of $A$ given
$B$ is

$$
Pr(A | B) = {{< frac "Pr(A ∧ B)" "Pr(B)" >}}.
$$
{{< /callout >}}

The numerator counts the mass satisfying both claims; the denominator counts
all the mass satisfying the condition. Dividing rescales the remaining mass
to a total of $1$. Under the fair distribution, the probability of two given
an even result is

$$
Pr(TWO | EVEN) = {{< frac "1/6" "1/2" >}} = {{< frac "1" "3" >}}.
$$

Under the loaded distribution, it is

$$
Pr(TWO | EVEN) = {{< frac "1/10" "7/10" >}} = {{< frac "1" "7" >}}.
$$

{{< logic-app name="probability" kind="dice" title="Conditioning on an even roll" formula="TWO" condition="EVEN" >}}

If the condition has probability $0$, this definition gives no answer. We
cannot divide by zero. It would be a mistake to report a conditional
probability of $0$ in that case: the conditional probability is undefined.

### Independence

Does learning that the sun is shining tell us anything about the rain?
Under the uniform weather distribution,

$$
Pr(RAIN | SUN) = {{< frac "1/4" "1/2" >}} = {{< frac "1" "2" >}} = Pr(RAIN).
$$

The information leaves the probability unchanged. Now try the dependent
distribution below. It assigns masses ${{< frac "1" "4" >}}, {{< frac "1" "2" >}}, {{< frac "1" "8" >}}, {{< frac "1" "8" >}}$ to the rows in
order. Then $Pr(SUN) = {{< frac "3" "4" >}}$ and $Pr(RAIN) = {{< frac "3" "8" >}}$, but

$$
Pr(RAIN | SUN) = {{< frac "1/4" "3/4" >}} = {{< frac "1" "3" >}}.
$$

Here, learning that it's sunny lowers the probability of rain.

{{< logic-app name="probability" title="Independence and conditioning" preset="dependent" formula="RAIN" condition="SUN" >}}

{{< callout type="definition" title="Probabilistic independence" >}}
Formulas $A$ and $B$ are
{{< term "independence" "probabilistically independent" >}} under $Pr$ iff

$$
Pr(A ∧ B) = Pr(A) × Pr(B).
$$

When $Pr(B) > 0$, this is equivalent to $Pr(A | B) = Pr(A)$.
{{< /callout >}}

The product equation is symmetric in $A$ and $B$. If both have positive
probability, independence also means $Pr(B | A) = Pr(B)$. It is a property of
the distribution: our two tables give different answers for the same formulas.

Without independence, the definition of conditional probability still gives
us the product rule:

$$
Pr(A ∧ B) = Pr(A | B) × Pr(B), provided Pr(B) > 0.
$$

To use this rule, we need the conditional probability as well as $Pr(B)$.
Replacing it with $Pr(A)$ assumes independence, which we must establish or
include among our modeling assumptions.

## Probability laws

We've defined probabilities by assigning weights to models and adding them
up. There is also an axiomatic approach: we assign probabilities directly
to sentences and specify the laws they must obey. This is much like defining
Boolean algebras in
{{< chapter_ref chapter="boolean" >}}Boolean algebra{{< /chapter_ref >}}
and Kleene algebras in
{{< chapter_ref chapter="many-valued" >}}Many-valued logics{{< /chapter_ref >}}.
The axioms let us reason about probabilities without constructing a table
of all the models first.

{{< callout type="definition" title="Kolmogorov axioms" >}}
A {{< term "probability-measure" "probability measure" >}} on a propositional
or first-order language with its usual two-valued semantics assigns a real
number $Pr(A)$ to each sentence $A$ and satisfies:

1. $Pr(A) ≥ 0$ for every $A$;
2. $Pr(A) = 1$ whenever $⊨ A$;
3. $Pr(A ∨ B) = Pr(A) + Pr(B)$ whenever $⊨ ¬(A ∧ B)$.
{{< /callout >}}

These are the finite-additivity form of the
{{< term "kolmogorov-axioms" "Kolmogorov axioms" >}}, written directly for
our language. The third axiom lets us add probabilities when the two
sentences cannot both be true. It prevents counting their shared models twice.
For a restricted model space, such as our die models, we understand validity
here relative to the modeling assumptions.

Our weighted truth-tables satisfy all three axioms. Nonnegative weights give
nonnegative probabilities; a tautology is true in every model, so its
probability is the sum of all the weights, namely $1$; and incompatible
formulas pick out disjoint sets of models, whose weights we can add.
Conversely, for a finite propositional vocabulary, every probability measure
satisfying the axioms comes from a weighted truth-table. Each row has a
formula describing exactly that model, such as $SUN ∧ ¬RAIN$. Its probability
supplies the row's weight.

So we can go both ways: work from the models, or reason directly with the
axioms. The axiomatic approach is particularly useful for FOL, where there
are infinitely many models. We can calculate with probabilities of sentences
without listing all those models. A treatment using an infinite model space
requires more general probability measures than our finite mass functions;
we'll return to this distinction in the final section.

### Negation {#negation-and-disjunction}

Every model makes exactly one of $A$ and $¬A$ true. Their probabilities
must therefore add up to $1$.

{{< callout type="theorem" title="Probability of a negation" >}}
For every probability measure,

$$
Pr(¬A) = 1 − Pr(A).
$$
{{< /callout >}}

We can derive this directly from the axioms:

{{< logic-app name="boolean" kind="derivation" logic="probability" preset="negation" title="Deriving the probability of a negation" >}}

The last step is ordinary algebra: subtract the same number from both sides.
Since axiom 1 gives $Pr(¬A) ≥ 0$, the equation also shows that $Pr(A) ≤ 1$.
A contradiction has probability $0$, since its negation is a tautology.

Logically equivalent formulas have the same probability under every measure:
they are true in exactly the same models. The axioms also give us this result.
If $A$ and $B$ are equivalent, both $A ∨ ¬B$ and $B ∨ ¬B$ are tautologies
with incompatible disjuncts. Hence

$$
Pr(A) + Pr(¬B) = 1 = Pr(B) + Pr(¬B).
$$

Subtracting $Pr(¬B)$ gives $Pr(A) = Pr(B)$. We can therefore use logical
equivalences inside probability calculations.

### Disjunction

For a disjunction $A ∨ B$, adding $Pr(A)$ and $Pr(B)$ counts the models in
which both are true twice. We need to subtract their probability once.

{{< callout type="theorem" title="Probability of a disjunction" >}}
For every probability measure,

$$
Pr(A ∨ B) = Pr(A) + Pr(B) − Pr(A ∧ B).
$$
{{< /callout >}}

To derive the law, split $B$ into the cases where $A$ is true and where
$A$ is false. Each addition below concerns incompatible formulas:

{{< logic-app name="boolean" kind="derivation" logic="probability" preset="disjunction" title="Deriving the probability of a disjunction" >}}

Under the uniform weather distribution, this gives

$$
Pr(SUN ∨ RAIN) = {{< frac "1" "2" >}} + {{< frac "1" "2" >}} − {{< frac "1" "4" >}} = {{< frac "3" "4" >}}.
$$

If $A$ and $B$ are
{{< term "mutually-exclusive" "mutually exclusive" >}}, their conjunction has
probability $0$, so we recover axiom 3.

### Deduction and probability

If $A ⊨ B$, every model counted for $Pr(A)$ is also counted for $Pr(B)$.
Since all masses are nonnegative, we obtain:

{{< callout type="theorem" title="Monotonicity" >}}
If $A ⊨ B$, then $Pr(A) ≤ Pr(B)$ under every probability measure.
{{< /callout >}}

Axiomatically, $B$ is equivalent to $A ∨ (B ∧ ¬A)$ in this case. Additivity
therefore gives $Pr(B) = Pr(A) + Pr(B ∧ ¬A) ≥ Pr(A)$.

The converse of our observation about tautologies requires care. A formula
with probability $1$ under one distribution can still have countermodels of
mass $0$. For example, $SUN$ is certain in our "Sun certain" table, but it
is not a tautology.

### Bayes' rule

The product rule can be applied in either direction:

$$
Pr(C ∧ E) = Pr(E | C) × Pr(C) = Pr(C | E) × Pr(E).
$$

This lets us calculate how probable a conclusion is given evidence from how
probable the evidence is given that conclusion.

{{< callout type="theorem" title="Bayes' rule" >}}
For $Pr(C) > 0$ and $Pr(E) > 0$,

$$
Pr(C | E) = {{< frac "Pr(E | C) × Pr(C)" "Pr(E)" >}}.
$$
{{< /callout >}}

Here, $Pr(C)$ is the {{< term "prior" "prior probability" >}}, and
$Pr(C | E)$ is the {{< term "posterior" "posterior probability" >}}.
$Pr(E | C)$ is the {{< term "likelihood" "likelihood" >}} of the evidence
under the hypothesis $C$. $Pr(E)$ is the
{{< term "marginal-likelihood" "marginal probability of the evidence" >}}.

The {{< term "law-total-probability" "law of total probability" >}} supplies
that denominator. When $0 < Pr(C) < 1$, split the evidence into cases where
$C$ holds and cases where it doesn't:

$$
Pr(E) = Pr(E | C) × Pr(C) + Pr(E | ¬C) × Pr(¬C).
$$

Every evidence row belongs to exactly one of those cases. Substituting this
sum into Bayes' rule gives an alternative form:

$$
Pr(C | E) = {{< frac "Pr(E | C) × Pr(C)" "Pr(E | C) × Pr(C) + Pr(E | ¬C) × Pr(¬C)" >}}.
$$

This form is useful when we know how likely the evidence is under $C$ and
under $¬C$, but don't know its overall probability yet. Both cases contribute
to that overall probability. We'll use this calculation for spam classification.

For example, take $C = RAIN$ and $E = SUN$ in our dependent weather table.
Of the rain's total mass ${{< frac "3" "8" >}}$, the sunny-and-rainy model
contributes ${{< frac "1" "4" >}}$. So $Pr(SUN | RAIN) = {{< frac "2" "3" >}}$.
Bayes' rule reverses this conditional:

$$
Pr(RAIN | SUN) = {{< frac "2" "3" >}} × {{< frac "3" "8" >}} × {{< frac "4" "3" >}} = {{< frac "1" "3" >}}.
$$

We can also recover the denominator from the two cases. In the nonrainy
models, the chance of sunshine is ${{< frac "4" "5" >}}$, giving

$$
Pr(SUN) = {{< frac "2" "3" >}} × {{< frac "3" "8" >}} + {{< frac "4" "5" >}} × {{< frac "5" "8" >}} = {{< frac "3" "4" >}}.
$$

## Measures of inductive support {#measures-of-support}

Bayes' rule gives us a posterior. To assess an inference, we also need to
compare it with what we thought before seeing the evidence. In
{{< chapter_ref chapter="valid-inference" id="support-relative-to-a-distribution" >}}Valid inference{{< /chapter_ref >}},
we called this {{< term "material-support" "material support" >}}: support
relative to a probability distribution. Write $C$ for the conclusion and $E$
for the conjunction of the premises. For one premise, $E$ is that premise.

{{< callout type="definition" title="Positive support" >}}
Evidence $E$ gives
{{< term "inductive-support" "positive inductive support" >}} to $C$ under $Pr$ iff

$$
Pr(C | E) > Pr(C), where Pr(E) > 0.
$$
{{< /callout >}}

Equality means the evidence is irrelevant to $C$ under this distribution;
a decrease means it counts against $C$. But how much support is there?
We'll consider three measures from our earlier discussion:

1. Increase of firmness: how much the probability rises;
2. Log probability ratio: by what factor the probability changes, on a log scale;
3. Log-likelihood ratio: how much more likely the evidence is under the
   conclusion than under its negation, also on a log scale.

### Increase of firmness

The natural first thought is to measure support by how much the evidence
raises the conclusion's probability. This gives the
{{< term "increase-of-firmness" "increase of firmness" >}}, the
{{< term "probability-raising" "probability-raising measure" >}} we used before:

$$
d(C, E) = Pr(C | E) − Pr(C).
$$

A change from $0.2$ to $0.3$ gives an increase of $0.1$. A change from
$0.8$ to $0.9$ gives the same increase. This measure tracks the difference
between the two probabilities. Its available range depends on the prior:
if $Pr(C) = 0.99$, the largest possible increase is $0.01$. So if the
conclusion is already factively likely, even evidence that settles it with
certainty receives a small score. The measure makes every supporting
inference weak in that situation, simply because there is little room left
for the probability to rise.

### Probability ratios

One response is to measure a relative increase: compare the posterior with
the prior by division. For
$Pr(C) > 0$, the {{< term "probability-ratio" "probability ratio" >}} is
${{< frac "Pr(C | E)" "Pr(C)" >}}$. Moving from $0.2$ to $0.3$ multiplies the probability by
$1.5$; moving from $0.8$ to $0.9$ multiplies it by $1.125$. This distinguishes
changes that increase of firmness counts as equal. It doesn't fully solve
the high-prior problem, though: from $0.99$ the probability can grow by a
factor of at most ${{< frac "1" "0.99" >}}$. Likelihood ratios, below, let us
compare the evidence under competing hypotheses instead.

Recall the [logarithm](https://en.wikipedia.org/wiki/Logarithm), written
$log$, from {{< chapter_ref chapter="valid-inference" >}}Valid inference{{< /chapter_ref >}}.
Taking a logarithm is a technical convenience; confirmation has no intrinsic
connection to logarithms. We could use the ratios themselves. The logarithm
gives them a scale centered on $0$: $log(1) = 0$, ratios above $1$ have
positive logs, and ratios between $0$ and $1$ have negative logs. Larger
ratios still get larger scores, but the curve becomes flatter as they grow.

A useful further property is $log(ab) = log(a) + log(b)$. Two successive
doublings multiply by $2 × 2 = 4$; on the log scale they add two equal amounts:
$log(4) = 2log(2)$. Likewise, $log({{< frac "1" "a" >}}) = −log(a)$, so halving and doubling get
opposite scores. The app uses natural logarithms, for which $log(2) ≈ 0.693$.
Choosing a different base greater than $1$ multiplies all scores by a positive
constant; it doesn't change which is larger or whether support is positive.

{{< callout type="definition" title="Log probability ratio" >}}
For $Pr(E) > 0$, $Pr(C) > 0$, and $Pr(C | E) > 0$, the
{{< term "log-probability-ratio" "log probability ratio" >}} is

$$
r(C, E) = log({{< frac "Pr(C | E)" "Pr(C)" >}}).
$$
{{< /callout >}}

### Likelihood ratios

A further comparison asks how likely the evidence is if $C$ is true and if
$C$ is false. This is the
{{< term "likelihood-ratio" "likelihood ratio" >}} from our earlier discussion, ${{< frac "Pr(E | C)" "Pr(E | ¬C)" >}}$. If the evidence is ten times as
likely under $C$, the ratio is $10$. Taking its logarithm gives:

{{< callout type="definition" title="Log-likelihood ratio" >}}
For $0 < Pr(C) < 1$ and positive $Pr(E | C)$ and $Pr(E | ¬C)$, the
{{< term "log-likelihood-ratio" "log-likelihood ratio" >}} is

$$
l(C, E) = log({{< frac "Pr(E | C)" "Pr(E | ¬C)" >}}).
$$
{{< /callout >}}

This compares the evidence under two hypotheses. The log probability ratio
compares the conclusion's posterior and prior. Bayes' rule relates the two,
but they generally give different scores. One way to see the distinction is
through {{< term "odds" "odds" >}}: the odds of $C$ are ${{< frac "Pr(C)" "Pr(¬C)" >}}$.
Bayes' rule says

$$
{{< frac "Pr(C | E)" "Pr(¬C | E)" >}}
 = ({{< frac "Pr(E | C)" "Pr(E | ¬C)" >}}) × ({{< frac "Pr(C)" "Pr(¬C)" >}}).
$$

The likelihood ratio multiplies the prior odds to give the posterior odds.
Its logarithm measures the change in log odds. A large likelihood ratio can
still leave $C$ unlikely when its prior is small.

### Comparison {#comparing-the-measures}

For the uniform weather distribution, $SUN$ gives no support to $RAIN$:
all three scores are $0$. Under the dependent distribution, learning $SUN$
lowers the probability of $RAIN$ from ${{< frac "3" "8" >}}$ to ${{< frac "1" "3" >}}$. All three scores are
negative. They agree on the direction of support wherever they are defined,
but need not agree on comparisons of strength between different cases.

{{< logic-app name="probability" kind="support" title="Compare measures of support" preset="dependent" formula="SUN ∴ RAIN" >}}

The graphs compare the measures as the posterior $Pr(C | E)$ changes.
For a fixed prior, increase of firmness is a straight line. The slope of the
log probability ratio decreases as the posterior increases. The log-likelihood
ratio grows steeply near posterior
$0$ and $1$. Select several measures to compare their curves; the dots show
the values for the current table.

Not every choice of probabilities fits together. For example,
$Pr(C ∧ E) = Pr(C | E)Pr(E)$ cannot exceed $Pr(C)$. The sliders respect these
constraints and the logical relations between the formulas. At a boundary,
a conditional probability may be undefined; a logarithm can tend to infinity.
Neither case supplies an ordinary finite score. The graphs are functions on
the ranges where the measures are defined. Shaded regions exclude impossible
combinations; open ends mark undefined limits. In particular, logarithmic
ratios require positive probabilities, and no probability can exceed $1$.

## Naive Bayes classifiers

We can now put these calculations to work. Suppose {{< logo >}} receives an
email from an unknown sender, with an urgent subject and a promise of money.
We represent four markers by the atoms

$$
Unknown, Urgent, Exclamation, Money.
$$

A deductive rule such as $(Urgent ∧ Money) → SPAM$ would classify
every email with those two features as spam. But a harmless message might
have them too:

{{< img src="/img/drawings/prob_ai_non_spam.svg" width="500px" alt="A birthday message from Jim's new address has an urgent subject, exclamation marks, and the phrase right on the money." >}}

These markers are fallible evidence. We want to calculate $Pr(SPAM | E)$,
where $E$ describes the markers present and absent in the email. A
{{< term "classification-threshold" "classification threshold" >}} then
turns that probability into a decision. With equal costs for the two kinds
of mistake, $0.5$ is a natural threshold. If hiding wanted mail is more costly,
we can require a higher probability before sending a message to spam.

### A single marker

Suppose we estimate $Pr(SPAM) = 0.2$,
$Pr(Unknown) = 0.3$, and $Pr(Unknown | SPAM) = 0.4$.
Bayes' rule gives

$$
Pr(SPAM | Unknown) = {{< frac "0.4 × 0.2" "0.3" >}} = {{< frac "4" "15" >}} ≈ 0.2667.
$$

The unknown sender raises the probability, but the message is still more
likely to be nonspam. The increase of firmness is

$$
d = {{< frac "4" "15" >}} − {{< frac "1" "5" >}} = {{< frac "1" "15" >}}.
$$

The probability ratio is ${{< frac "4" "3" >}}$. With natural logarithms, $r ≈ 0.2877$. The nonspam
likelihood is $0.275$, giving

$$
l = log({{< frac "0.4" "0.275" >}}) ≈ 0.3747.
$$

{{< logic-app name="probability" kind="support" title="Evidence from an unknown sender" preset="sender" formula="Unknown ∴ SPAM" >}}

In practice, we estimate a prior from labeled emails: the fraction labeled
spam. For a likelihood such as $Pr(Unknown | SPAM)$, we count unknown
senders among the spam messages and divide by the number of spam messages.
These estimates depend on the data and on whether it resembles the messages
our filter will encounter.

### Combining markers

An unknown sender alone wasn't enough to classify the email as spam. The
other markers can occur in harmless messages too. We need to combine them.
Our suspicious email has all four, so its evidence is

$$
E = Unknown ∧ Urgent ∧ Exclamation ∧ Money.
$$

To find $Pr(E | SPAM)$ without an independence assumption, we apply the
product rule repeatedly (assuming the conditioning probabilities are positive):

$$
Pr(E | SPAM)
 = Pr(Unknown | SPAM)
 × Pr(Urgent | Unknown ∧ SPAM)
 × Pr(Exclamation | Unknown ∧ Urgent ∧ SPAM)
 × Pr(Money | Unknown ∧ Urgent ∧ Exclamation ∧ SPAM).
$$

Each new marker is conditioned on all the preceding markers as well as
$SPAM$. For the last factor, for example, we need to know how often money
comes up among spam emails that already have an unknown sender, an urgent
subject, and exclamation marks. Four binary markers give $2⁴ = 16$ complete
presence/absence patterns; with more markers, estimating all these combinations
soon becomes difficult. The "naive" assumption simplifies these conditions.

{{< callout type="definition" title="Naive Bayes classifier" >}}
A {{< term "naive-bayes" "naive Bayes classifier" >}} computes class
probabilities using Bayes' rule and assumes that its features are jointly
{{< term "conditional-independence" "conditionally independent" >}} given
each class. For a class $K$ and observed feature literals $L₁, …, Lₙ$,

$$
Pr(L₁ ∧ … ∧ Lₙ | K) = ∏<sub>i = 1</sub><sup>n</sup> Pr(Lᵢ | K).
$$
{{< /callout >}}

The large $∏$ is a product sign. It works like the sum sign $∑$, except
that we multiply instead of adding. The index starts at $i = 1$ and runs up
to $i = n$, so the right-hand side means

$$
Pr(L₁ | K) × Pr(L₂ | K) × … × Pr(Lₙ | K).
$$

For our suspicious email, all four markers are present. The assumption gives

$$
Pr(Unknown ∧ Urgent
   ∧ Exclamation ∧ Money | SPAM)
 = Pr(Unknown | SPAM)
 × Pr(Urgent | SPAM)
 × Pr(Exclamation | SPAM)
 × Pr(Money | SPAM).
$$

We can estimate each of these four factors by
counting how often the marker occurs among spam emails. The assumption lets
us use those estimates without separately estimating the frequency of the
whole combination. We make the same assumption within the nonspam class.
The markers can remain dependent in the inbox as a whole.

A literal $Lᵢ$ is a marker when it is present and its negation when it is
absent. So the same calculation also handles emails with only some markers.

Suppose our data gives these probabilities:

| Marker $X$ | $Pr(X)$ | $Pr(X ∣ SPAM)$ | $Pr(X ∣ ¬SPAM)$ |
| --- | --- | --- | --- |
| $Unknown$ | $0.3$ | $0.4$ | $0.275$ |
| $Urgent$ | $0.4$ | $0.6$ | $0.35$ |
| $Exclamation$ | $0.6$ | $0.7$ | $0.575$ |
| $Money$ | $0.3$ | $0.6$ | $0.225$ |

The nonspam column follows from the total probability equation. For example,

$$
0.3 = 0.4 × 0.2 + Pr(Unknown | ¬SPAM) × 0.8,
$$

giving $Pr(Unknown | ¬SPAM) = 0.275$.
For an email with all markers present, compute one score per class:

$$
score(SPAM) = 0.2 × 0.4 × 0.6 × 0.7 × 0.6 = 0.02016,
score(¬SPAM) = 0.8 × 0.275 × 0.35 × 0.575 × 0.225 = 0.009961875.
$$

The first score is $Pr(E | SPAM) × Pr(SPAM)$; the second is
$Pr(E | ¬SPAM) × Pr(¬SPAM)$. These are exactly the two terms in the
denominator of our alternative Bayes formula. Every email with evidence $E$
is either spam or nonspam, so adding the scores gives $Pr(E)$. Dividing each
score by their sum makes the two resulting class probabilities add up to $1$.
This is the {{< term "normalization" "normalization" >}} step:

$$
Pr(SPAM | E) = {{< frac "score(SPAM)" "score(SPAM) + score(¬SPAM)" >}} ≈ 0.6693.
$$

At threshold $0.5$, the filter classifies the email as spam. A threshold of
$0.8$ would leave it in the inbox. An email's classification therefore depends
on both the probability model and the decision threshold.

{{< logic-app name="probability" kind="bayes" title="Naive Bayes spam filter" >}}

Our filter checks four markers: "urgent" in the subject,
exclamation marks anywhere, and money words or currency symbols anywhere.
The sender is unknown unless marked as known. That explains why Jim's birthday
message can fool this filter: all four markers occur, despite its harmless
content. Editing the email changes its evidence; editing a likelihood changes
the model used to assess that evidence.

When a marker is absent, we use its complement likelihood. For example,
$Pr(¬Exclamation | SPAM) = 1 − 0.7 = 0.3$. Keeping the other three markers present
then gives a posterior of about $0.5399$. For an unchecked marker, we omit
its factor. Presence/absence
features give this version the name Bernoulli naive Bayes; classifiers based
on word counts use a different probability model.

{{< callout type="note" title="Modeling assumptions: email classification" >}}
The example likelihoods are stipulated numbers. We assume independence of the
markers within each class, although urgent subjects and exclamation marks
may still be associated within spam. The posterior is conditional on these
assumptions. Whether it predicts spam well requires testing on labeled emails
not used to estimate the probabilities.
{{< /callout >}}

## Inductive logic

Our spam filter assesses an inference in a propositional language. The
axiomatic account also applies to FOL sentences, using first-order validity
for $⊨$. We can therefore ask how probable a generalization like
$∀x White(x)$ is, given information about particular objects.

For a finite collection of FOL models, we can again assign masses and add
them over the models satisfying a sentence. The internal structure of a
model determines whether the sentence is true; its mass determines what it
contributes to the probability. A model can have an infinite domain even
when we assign weights to just a finite collection of models. For an infinite
model space, the general theory uses measures on sets of models and countable
additivity. The finite-additivity axioms above suffice for our calculations
with sentences.

For inductive logic, we need the distinction from
{{< chapter_ref chapter="valid-inference" id="inductive-logic" >}}Valid inference{{< /chapter_ref >}}.
Our spam inference gives
{{< term "material-support" "material support" >}} under an estimated distribution. For {{< term "logical-support" "logical support" >}},
we keep the logical relationships fixed and ask what holds under every
probability measure.

{{< callout type="definition" title="Weak logical inductive consequence" >}}
Write $E = P₁ ∧ … ∧ Pₙ$. An inference $P₁, …, Pₙ ∴ C$ is
{{< term "inductive-validity" "weakly logically inductively valid" >}}, written
$P₁, …, Pₙ$ {{< approx >}} $C$, iff every probability measure on its language
with $Pr(E) > 0$ satisfies

$$
Pr(C | E) ≥ Pr(C).
$$
{{< /callout >}}

The premises must never lower the conclusion's probability. "Weak" allows
equality: a conclusion that was already certain has no room to become more
probable. The definition applies to propositional and first-order languages
alike.

### Deductive validity and inductive support

Suppose the inference is deductively valid. Every model of the premises is
then a model of the conclusion. Once we restrict attention to the premises,
all the remaining weight belongs to models of the conclusion.

{{< callout type="theorem" title="Deduction implies inductive support" >}}
If $P₁, …, Pₙ ⊨ C$, then $P₁, …, Pₙ$ {{< approx >}} $C$.
More precisely, whenever $Pr(P₁ ∧ … ∧ Pₙ) > 0$,

$$
Pr(C | P₁ ∧ … ∧ Pₙ) = 1.
$$
{{< /callout >}}

Since $Pr(C) ≤ 1$, making the conclusion certain cannot lower its probability.
Every deductive law therefore gives a law of weak inductive support. For
example:

{{< inference-rules caption="Some laws of weak inductive support" >}}
[
 {"name":"Conjunction elimination","premises":["A ∧ B"],"conclusion":"A"},
 {"name":"Modus ponens","premises":["A → B","A"],"conclusion":"B"},
 {"name":"Universal instantiation","premises":["∀x A(x)"],"conclusion":"A(c)"}
]
{{< /inference-rules >}}

These laws concern the conjunction of all the premises. In modus ponens,
for example, neither $A$ alone nor $A → B$ alone need make $B$ more likely.
Together they make it certain, provided their conjunction has positive
probability. Universal instantiation assumes that $c$ is a constant and
$A(c)$ is the usual capture-free substitution.

### Confirmation by deductive consequence

Inductive support also goes in the other direction. Our die example has
$TWO ⊨ EVEN$: showing two entails showing an even number. Yet learning
$EVEN$ supports $TWO$ under every distribution where $Pr(EVEN) > 0$:

$$
Pr(TWO | EVEN) = {{< frac "Pr(TWO)" "Pr(EVEN)" >}} ≥ Pr(TWO).
$$

The denominator is at most $1$. The same argument gives a general result.

{{< callout type="theorem" title="Confirmation by deductive consequence" >}}
If $C ⊨ E$ and $Pr(E) > 0$, then $Pr(C | E) ≥ Pr(C)$.
The inequality is strict when $Pr(C) > 0$ and $Pr(E) < 1$.
{{< /callout >}}

The theorem guarantees an increase or equality. The size of that increase
depends on the probabilities: if $E$ was already nearly certain, dividing
by $Pr(E)$ changes very little. If $C$ had a tiny prior, its posterior can
remain tiny even after a substantial increase. To assess the strength of
support, we need a measure and a distribution.

For the die, entailment is relative to our assumption that exactly one face
is showing. The corresponding result applies to every distribution concentrated
on those admissible models. In an unrestricted language, we state the theorem
using logical entailment, or include the modeling assumptions as premises.

### Enumerative induction

Now consider the marble inference from
{{< chapter_ref chapter="valid-inference" >}}Valid inference{{< /chapter_ref >}}:

{{< inference layout="stacked" >}}
$White(m₁)$
$⋮$
$White(mₙ)$
---
$∀x White(x)$
{{< /inference >}}

If every marble is white, each observed marble is white. The conclusion
entails the conjunction of the premises, so the preceding theorem applies.

{{< callout type="theorem" title="Enumerative induction" >}}
For constants $c₁, …, cₙ$ and a formula $A(x)$ with $x$ as its only free
variable, let $E = A(c₁) ∧ … ∧ A(cₙ)$. Whenever $Pr(E) > 0$,

$$
Pr(∀x A(x) | E) ≥ Pr(∀x A(x)).
$$
{{< /callout >}}

Again, this is a weak guarantee. Suppose the jar contains 100 marbles, each
independently white or black with equal probability. We inspect 70 different
marbles, and all are white. The prior that every marble is white was
$2⁻¹⁰⁰$; the posterior is $2⁻³⁰$, since the remaining 30 must still all be
white. It has increased enormously as a ratio, but it is still very small.
A model in which jars tend to contain only one color gives a different answer.

Repeating the same observation adds no new information. Sampling only from
a specially selected part of the jar can also affect what we should expect
of the rest. Our predictions depend on these assumptions
about the observations and the weights of the models.

We can therefore use the same logical languages for deductive and inductive
reasoning. Deduction asks whether every model of the premises sustains the
conclusion. Induction also considers the weights of those models and asks how
the premises change the conclusion's probability. That is the calculation
behind our spam filter and, at a different scale, next-token prediction.

## Further readings {.readings .nocount}

- Russell and Norvig, [*Artificial Intelligence: A Modern Approach*, 4th edition](https://www.pearson.com/en-us/subject-catalog/p/Russell-Lecture-Power-Points-for-Artificial-Intelligence-A-Modern-Approach-4th-Edition/P200000003500/9780137505135), chapter 12, for probability laws and Bayes' rule, and chapter 20, for learning probabilistic models, including naive Bayes.
