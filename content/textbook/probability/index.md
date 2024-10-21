---
title: Logic and probability
author: Johannes Korbmacher
weight: 11
params: 
  date: 21/10/2024
  last_edited: 21/10/2024
  id: txt-prob
  math: true
---

# Logic and probability

In Chapters {{< chapter_ref chapter="logic-and-ai" >}} 1. Logic and AI{{<
/chapter_ref >}} and {{< chapter_ref chapter="valid-inference" >}} 2. Valid
inference{{< /chapter_ref >}}, we've distinguished between **deductive** inference
(the truth of the premises guarantees the truth of the conclusion) and
**inductive** inference (the truth of the premises makes the truth of the
conclusion more likely). So far, we've only focused on models of deductive
inference. In this chapter, you'll learn more about how to model inductive
inference.

We'll begin by looking at how to [model probabilities](#models-of-probability)
in a logical setting. We'll then go through a useful method for calculating
probabilities using [probability truth-tables](#probability-truth-tables). After
this, we turn to [conditional probabilities](#conditional-probabilities), which
then allow us to discuss a simple model of [inductive
validity](#inductive-validity). To conclude the chapter, we look at some
examples of valid and invalid inductive inferences in our model.

## Models of probability

The probability of an event describes the **how likely it is** that the event
occurs. Think, for example, of how likely it is that you roll a 3 on a 6
sided-die, or how likely it is that it rains tomorrow. 

What this _really_ means is actually a matter of substantial debate. There
different schools of thought on the interpretation of probability:

+ Objectivists argue that the likelihood we're talking about here is an
objective feature of reality, sometimes called _objective chance_. An example of
this are [frequentist](https://en.wikipedia.org/wiki/Frequentist_probability)
interpretations of probability, which think of probabilities as a measure of how
often an event would occur if we repeated the circumstances.

+ Subjectivists argue that the likelihood in question is a subjective, epistemic
feature of world. An example of this are
[Bayesian](https://en.wikipedia.org/wiki/Bayesian_probability) interpretations
of probability, which think of probabilities as a measure of our _degree of
belief_ in an event occurring.

Here, we won't take sides in this debate. We'll work with a pre-theoretic notion
of probability and focus on the formalism.

Probabilities play many important roles in AI research. On the one hand, they
are the basis for the statistical methods used in modern subsymbolic [machine
learning](https://en.wikipedia.org/wiki/Machine_learning) methods.  On the other
hand, probabilities are the main method for dealing with inductive inference and
uncertainty in symbolic settings, such as expert systems.

Different applications of probabilities in AI use different (though equivalent)
ways of developing the formalism. Here, we'll develop a **symbolic approach to
probabilities**, which models probabilities as real numbers assigned to formulas
in formal languages. 

But you should be aware of the fact that [mathematical probability
theory](https://en.wikipedia.org/wiki/Probability_theory), in general, is a
broader theory that can be applied in many different, symbolic and subsymbolic
settings.

## Probability truth-tables

## Conditional probabilities

## Inductive validity

## Validities and fallacies
