---
title: Logical learning
author: Johannes Korbmacher
weight: 12
params: 
  id: exc-learn
  math: true
---

For the last workgroup, we just have one exercise that illustrate an important
concepts about Bayesian learning. The rest of the workgroup you can use to ask
questions for the exam.

# Base-rate fallacy {.solved}

The [base-rate fallacy](https://en.wikipedia.org/wiki/Base_rate_fallacy) is 
about a common misestimation concerning conditional probabilities.

A simple example concerns diagnostic tests for rare diseases.

Suppose that a certain disease has a prevalence of 1% in the population. This is
already quite high, most "serious" infectious diseases have a way lower
prevalence in the general population.

Now suppose that we have a test for the disease, which is 90% accurate in the
following sense:

+ If you have the disease, the test is positive with 0.90 probability. This is
called the [test sensitivity](Sensitivity_and_specificity).

+ If you don't have the disease, the test is negative with 0.90 probability. This is
called the [test specificity](Sensitivity_and_specificity).

Note that test sensitivity and specificity can differ, but we assume both are
the same for simplicity.

## a)

Using a language with only the propositional variables
$$\mathsf{DISEASE},\mathsf{POSITIVE},$$ determine the probabilities given by the
above description (it's sufficient to determine the ones you need for b).

_Hint_: You can estimate the unconditional probability of the person having the
disease as the prevalence of the disease in the population.

## b)

Suppose we're administering the test to a randomly selected person from the
population. The test results positive. What is the probability that the person
has the disease given this outcome? 

_Hint_: Use the alternative formulation of Bayes theorem.

## c) 

Let's take the Netherlands with around 18 million people as sample population?
Interpreting probabilities as frequencies and work out what the numbers from
before mean. This may help understand the situation.

## Solution {.solution #base-rate-fallacySolution}

**a)**

The information we're given can be represented as follows:

+ $Pr(\mathsf{DISEASE})=0.01$
+ $Pr(\mathsf{POSITIVE}\mid\mathsf{DISEASE})=0.9$
+ $Pr(\neg\mathsf{POSITIVE}\mid\neg\mathsf{DISEASE})=0.9$

From this we can derive a few probabilities that will be useful for the
following question:

+ $Pr(\neg\mathsf{DISEASE})=0.99$
+ $Pr(\mathsf{POSITIVE}\mid\neg\mathsf{DISEASE})=0.1$

**b)**

We can use the following instance of the alternative Bayes theorem:


{{< span style="font-size:0.8em" >}}
$$Pr(\mathsf{DISEASE}\mid \mathsf{POSITIVE})=$$
$$\frac{Pr(\mathsf{POSITIVE}\mid \mathsf{DISEASE})\times Pr(\mathsf{DISEASE})}{Pr(\mathsf{POSITIVE}\mid \mathsf{DISEASE})\times
Pr(\mathsf{DISEASE})+Pr(\mathsf{POSITIVE}\mid\neg \mathsf{DISEASE})\times Pr(\neg \mathsf{DISEASE})}$$
{{< /span  >}}

Plugging in the values from above, we get:


$$Pr(\mathsf{DISEASE}\mid \mathsf{POSITIVE})=$$
$$\frac{0.9\times 0.01}{(0.9\times 0.01)+(0.1\times 0.99)}=0.08\bar{3}$$

That is, a positive test for a randomly picked person should raise your credence
in that person having the disease from 1% to about 8%. This may be surprising in
is nowhere _near_ the 90% reliability of the test.

