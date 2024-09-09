---
title: Valid Inference
author: Colin Caret
date: 09/09/2024
last_edited: 09/09/2024
weight: 2
resources:
  - src: img/probabilities.jpg
    name: probabilities
  - src: img/intersection.jpg
    name: intersection
params:
  id: txt-val
  math: true
---

# Valid inference

Remember from {{< chapter_ref chapter="logic-and-ai" >}}
Chapter 1. Logic and AI{{< /chapter_ref >}} 
that logic is the study of **valid inference**. In this
chapter, you'll learn more about the _concept_ of validity. 

In particular, we'll go into more details of what it means for an inference to
be [correct](#correctness), we'll describe [abstract methods](#formalisation)
for modeling valid inferences, and we'll dig into important differences
between [deductive](#deduction) and [inductive validity](#induction).

## Correctness

When we talk about validity, we are talking about a _good feature_ of inferences,
but this is not the only good feature an inference can have. For example, it is
good for inferences to be simple, clear, precise, economical, etc. Logic does
not deal with all of these topics. Most of these topics are part of **rhetoric**,
the study of persuasive writing style. Logic deals with _validity_.

Validity is a standard of **correctness** for inferences. To really fix this
concept, it might help to think about it from the other direction. What happens
if an inference _lacks_ validity, when it is **invalid**? Well, that shows us
that something went wrong. The inference made a _mistake_. As we mentioned in 
{{< chapter_ref chapter="logic-and-ai" id="validity">}}
Chapter 1.1.2 Validity{{< /chapter_ref >}}, some of these logical mistakes or
**fallacies** are so famous that they have their own names.

Here is an example of a fallacy called _affirming the consequent_:

1. If it is sunny, Jan is cycling. Jan is cycling. Therefore, it is sunny.

The mistake should be clear. The _conditional_ premise ("if..., then...") says
that sun leads to sport. However, the other premise of this inference is not
_about_ sunny weather, so those two premises don't really "add up" to anything
useful. They certainly do not support the conclusion that it is sunny today.

Here is an example of a valid inference called "modus ponens".

2. If it is sunny, Jan is cycling. It is sunny. Therefore, Jan is cycling.

This inference involves a premise about sunny weather, which connects with the
conditional premise in the right way. This inference is valid because it uses
all of its premises correctly. These two examples show that it can be easy to
confuse valid and invalid inferences if we don't pay attention to the details.
At a glance, the two inferences look pretty similar.

This is why logic aims for a _systematic_ definition of validity. This notion
should be applicable not only to humans but to any information-processing
system. It can tell us what counts as _intelligent_ behavior. Without a
definition of correct reasoning, how do we even know what we want AI to achieve?
So, we would like to say, in general, what _makes_ an inference valid or
invalid. The standard idea is that valid inferences **preserve truth** from
their premises to their conclusion.

### Hypothetically

To test whether an infernece is valid, we ask if the conclusion is true _when_
the premises are true. This is a **hypothetical** question. Answering this
question does not require us to know that the premises really _are_ true. In
fact, we can make a stronger point: it is possible to have an inference that is
valid even though it has false premises. Here is an example.

3. All pigs fly. Maddy is a pig. So, Maddy flies.

The _reasoning_ behind this inference is perfectly correct. The conclusion
follows from the premises. That makes the inference valid. But we obviously know
that this inference also involves some false premises. Pigs can't really fly.

The important point is that validity is not determined by the actual truth or
falsity of statements. What we care about is the _connections between_
statements.

When we test for validity, we do not look at the actual truth of premises and
conclusion, instead we look for a **relationship** between their truth-values.
You can think about it like this: imagine that the premises and true and think
about whether the conclusion is true _under this assumption_.

Think about inference (3) this way. When we do this, we imagine a world that is
slightly different from the actual world, a world where pigs do fly. In that
kind of world, it has to be true that Maddy flies.

This is the basic idea of truth-preservation.

+ **Valid Inference:** an inference whose conclusion is true under the
(hypothetical) assumption that all of the premises are true.

Now, we can ask a series of follow-up questions. How tight is the
truth-preservation relationship? How often does it have to hold? How reliable
does an inference need to be in order to call it "valid"? Different answers to
these questions take us in two directions: deductive and inductive logic.

### Always

With **deductively valid** inference, truth-preservation _always_ holds. We want
100% reliability in all situations whatsoever. No exceptions allowed.
_Necessarily_, if the premises are true, the conclusion is true. Otherwise, its
not deductively valid. This is a high standard we are asking for but it is very
nice when we can identify this kind of air-tight reasoning.

Here are some common examples of deductively valid inferences.

4. If this superintelligent AI system is dangerous, then it gives a lot of bad
advice. It does not give a lot of bad advice. So, this superintelligent AI
system is not dangerous.

5. Either it rained last night or the car is dry. The car is not dry. Thus, it
rained last night.

6. All dogs are friendly. Some dogs are chubby. So, some chubby animals are
friendly.

In deductive logic, we use the symbol 
$$\vDash$$
to stand for a deductively valid inference. So if we have a deductively valid
inference going from premise $P_1,P_2,\dots$ to conclusion $C$, we can
abbreviate this with symbols: 

$$P_1,P2,\mathellipsis \vDash C$$

In inference 5, for example, we have that $P_1$ is the sentence "Either it
rained last night or the car is dry", $P_2$ is "The car is not dry", and $C$ is
"It rained last night". So, we can write the inference as:

$$\text{Either it rained last night or the car is dry}, \text{The car is not
dry}\vDash \text{It rained last night}$$

### Mostly

With **inductively valid** inference, truth-preservation _mostly_ holds. If the
premises are true, the conclusion is _probably_ true. The likelihood could be
slightly increased (weak induction) or greatly increased (strong induction).
Either way, assuming that the premises are true gives us _some_ reason to
believe the conclusion is true. Inductive inference is not air-tight. There is a
chance of going from truth to falsity, but that is a risk we have to take when
we are dealing with uncertain information.

Here are some common examples of inductively valid inferences. In each of these
examples, the premises give us good reason to believe the conclusion, but _none_
of these 'risky' inferences qualifies as a deductively valid inference (all of
them are deductively invalid).

7. It looks like a duck. It quacks like a duck. So, it is a duck.

8. Strict AI laws have a support of around 80% in a randomly selected sample of
20.000 voters. Therefore, support for strict AI laws in the general public is
around 80%.

9. [GPT-4](https://en.wikipedia.org/wiki/GPT-4) improved upon
[GPT-3](https://en.wikipedia.org/wiki/GPT-3), which improved upon
[GPT-2](https://en.wikipedia.org/wiki/GPT-2), which, in turn, improved upon
[GPT-1](https://en.wikipedia.org/wiki/GPT-1) in terms of coherence and
relevance. Therefore, the next generation of GPT models will further improve in
this respect.

In inductive logic, we use the symbol 
\\[\mid\approx\\]
to stand for an
inductively valid inference, writing $$P_1, P_2, \dots\mid\approx C$$ to
say that the inference from premises $P_1, P_2, \mathellipsis$ to conclusion $C$
is inductively valid. To say that an inference is inductively _strong_, we write
a $!$ on top, like so: $$\stackrel{!}{\mid\approx}$$. 
So if we have a inductively strong inference going from premises $P_1, P_2,
\dots$ to conclusion $C$ we can abbreviate this with symbols:
$$P_1, P_2, \dots\stackrel{!}{\mid\approx} C.$$

## Formalization

By steps, we can make things even more precise. One of the steps we mentioned in
{{< chapter_ref chapter="logic-and-ai" >}}
Chapter 1. {{< /chapter_ref >}} is **formalization**. We can build
formal languages and study their properties. We can also develop theories about
how these kind of formal patterns map onto ordinary human communication and
thinking.

One powerful idea in logic is that different inferences have the same **logical
form**. This allows us to identify many valid inferences all at once, just by
studying their shared form. Reasoning that can be captured in a finite set of
symbols and rules can also be programmed into a computer. This was essentially
the idea that sparked the first wave of AI research in the 1950s. 

The next chapter will delve into more details of formal syntax and how to
interpret the logical forms of sentences. We will mention just a few examples of
formalisation that are useful for this chapter.

+ The symbol "$\neg$" can be read "not" in English. $\neg A$ says "Not $A$."

+ The symbol "$\land$" can be read "and" in English. $A\land B$ says "Both $A$
and $B$."

+ The symbol "$\rightarrow$" can be read "if, then" in English. $A\rightarrow B$
says "If $A$, then $B$".

Let"s see how this formalisation is used:

1) The inference form of "modus ponens" looks like this: $ A\rightarrow B,
A\vDash B$. This sequence of symbols says that whenever you put together two
separate pieces of information, a premise "If $A$, then $B$" and a premise $A$,
you can validly infer the conclusion $B$. We said that example 2. follows this
pattern. Here are some more examples. These are all instances of "modus ponens":

    10. If programming is difficult to learn, then some people cannot do it.
    Programming is difficult to learn. Therefore, some people cannot do it.
    
    11. If ELIZA ever beat GPT-3.5 in the Turing Test, then it is cutting-edge AI
    technology. [ELIZA did beat GPT-3.5](https://arxiv.org/abs/2310.20216) in the
    Turing Test. So, ELIZA is cutting-edge AI technology.
    
    12. If the sun will rise tomorrow, then you will win the lottery next week. The
    sun will rise tomorrow. So, you will win the lottery next week.

    In logic, we represent inferences 10.-12. the same way. They have the same
    form but different content. As we will show later, the form is enough to
    explain why all of these inferences are valid. Obviously, this does not
    guarantee that the conclusion is actually true!

2) The fallacy of "affirming the consequent" looks like this: $ A\rightarrow B,
B\nvDash A$. This sequence of symbols says that if you put together two separate
pieces of information, a premise "If $A$, then $B$" and a premise $B$, it is
invalid to infer the conclusion $A$. If you use this reasoning, you are making a
mistake. We said that example 1. commits this mistake. Here are some more
examples:

    13. If ZFC is consistent, it cannot settle the value of BB(8000). ZFC cannot
    [settle the value of BB(8000)](https://scottaaronson.blog/?p=2725). So, ZFC is
    consistent.
    
    14. If Strong AI is possible, then there is a flaw in the [Chinese Room thought
    experiment](https://plato.stanford.edu/entries/chinese-room/). There is a flaw
    in the Chinese Room thought experiment. Therefore, Strong AI is possible.
    
    15. If Topsy was an elephant, then Topsy had a trunk. Topsy had a trunk. So,
    [Topsy was an elephant](https://en.wikipedia.org/wiki/Topsy_(elephant)).
    
    Again, we can represent 13.-15. the same way and this common structure can
    explain why all of these inferences are invalid. This means that they use
    reasoning. It does not necessarily mean that all of these inferences have
    false conclusions! For example, the conclusion of 15. is true, but it would
    be a mistake if you came to believe this conclusion by using this fallacious
    reasoning.

We have now said a lot about the concept of validity. But what do the tools of
logical analysis look like? How do we use logical form to identify *whether an
inference is valid*? That is our next topic.

## Deduction

The study of deduction goes back to ancient philosophy and mathematics.
[Aristotle](https://plato.stanford.edu/entries/aristotle-logic/) considered it
to be the pinnacle of reasoning.
[Euclid](https://en.wikipedia.org/wiki/Euclidean_geometry) used deductive
reasoning to prove things about basic geometry. He also introduced the
**axiomatic method**. This method has two parts: axioms and rules. An axiom is
just a definition. 

The first Euclidan axiom says "between any two points there is a line", which
partly defines the abstract concepts of _point_ and _line_ by telling us how
these things relate to each other. The other part of this method is a set of
rules for reasoning. In other words: logic.

Rules for deductive logic are _indefeasible_ and suited to belief
_accumulation_. These rules do not vary between contexts. They do not require
special justification. There is nothing that can make these rules fail. Nothing
can defeat a deductively valid inference.

The optimal way of using deduction is to take a set of existing beliefs (or
knowledge) and then add more beliefs (or knowledge) by applying logical rules. A
common, real world _implementation_ of deductive reasoning occurs whenenever we
apply some general pattern to a specific case:

16. Vixens are female foxes. That is the definition of the concept _vixen_.
Suppose you know this and you hear someone say "there is a vixen living in the
forest!". In that case, you might use deduction to infer that there is a fox
living the forest.  

17. Suppose that you live in a village where the bus does not run on days when
there is a football match. You know about this policy. You also know that there
is a football match today. If you put together these existing beliefs, you might
use deduction to infer that there is no bus running today.

Like the examples of "modus ponens", we have here two examples of inferences
with the same logical form. It is actually closely related to "modus ponens" but
also involves the **quantifier** "all" or "every". In example 16. there is an
implicit premise "all vixens are female foxes". In example 17. there is an
implicit premise "all days with footbal are days without the bus".

Both of these inferences simply apply general pattern to a specific instance.
That reasoning is correct as long as the  word "all" _really_ means "all". If we
assume that a totally general pattern is true "all Ps are Qs" and "this is P" is
also true, it has to be true that "this is Q". The conclusion follows
necessarily.

The concept of deductive validity is specialized. It makes sense to use
deductive reasoning for specific tasks: reasoning in mathematics or other
axiomatic theories, reasoning with precisely defined concepts or pattern that
are truly general. Notice how this air-tight reasoning is not quite the same
thing as what Sherlock Holmes calls "doing a deduction":

{{< blockquote author="A study in scarlet, 1887">}}
“From a drop of water... a logician could infer the possibility of an Atlantic
or a Niagara without having seen or heard of one or the other. So all life is
a great chain, the nature of which is known whenever we are shown a single
link of it. Like all other arts, the Science of Deduction and Analysis is one
which can only be acquired by long and patient study..."
{{< /blockquote >}}

Sherlock uses the word "deduction" for any reasoning that is careful,
systematic, and reliable. However, the examples in this passage sounds a lot
like inductive reasoning. Take a small sample and make an educated guess about
the larger collection that it belongs to. That kind of reasoning is not
indefeasible, it does not make a necessary connection. _We_ do not call that
deduction.

Many **programming languages** are essentially formal languages with deductive
rules. This is a perfect way to apply logical methods. Consider the code snippet
below. This code is supposed to take an input that is a whole number and
identify whether it is a positive number or not:

```
num = int(input('Enter a whole number: '))

if num > 0:
     print(f'{num} is positive.')
else:
     print(f'{num} is not positive.')
```

Imagine what would happen if the computer did, effectively, not obey deductive
rules like "modus ponens". We would have no idea what to expect when we run this
program. Sometimes when you ran the program and entered the number 1, you might
get the correct answer that 1 is a positive number, but other times you might
you get no answer at all. That would be useless and frustrating. In order to
make the behavior of programs predictable, we want them to effectively follow
deductive rules of reasoning.

### Semantic methods for deduction

Let's now take a brief look at **semantics**. This is the part of logic where we
give a model of meaning and truth. A semantics for a language delineates which
inferences are deductively valid in that language. To keep things simple we will
talk about a stripped-down formal language that only represents the logical form
of "and" sentences like "$A$ and $B$", represented $A\land B$.

Even with a stripped-down formal language like this, we can learn a lot about
deductive logic. The basic tool we will use is called a **semantic model**. A
semantic model is like a picture of a possible reasoning scenario. If we look at
a model, we can ask whether a specific sentence $A$ is true or false in that
model. Every model gives an answer. It assigns a definite truth-value to each
snetence.

A formal language $\mathcal{L}$ has more than one model. Different models
assign different values to the same sentences. In one model perhaps $A$ is
true and $B$ is false. In another model $A$ is false and $B$ is
true. That variation allows models to picture different scenarios. Once we have
defined all possible models for a language $\mathcal{L}$, how do we use
them?[^allmodels]

For any sentence $A$ in our formal language, we will write $[A]$ to
refer to the set of models where that sentence is true. With this notation we
can talk about relations between sets of models $[A]$ and $[B]$ for any
two sentences $A$ and $B$. When the elements of one set are also
contained in another set, we say that there is a **subset** relation between
them. 

For example, the set of triangle is a subset of the set of figures. The set of
cats is a subset of the set of animals. All of the things in the first set are
also in the second set. If $[A]$ is a subset of $[B]$, we write
$[A]\subseteq[B]$.

This relation is a good first step to defining deductive validity:[^firststep]

$$A\vDash B \text{ if, and only if, } [A]\subseteq[B]$$

Why does this definition work? Let's analyze what this says. In the background
we assume that there is well-defined notion of all possible models for our
language. From there, we define $[A]$ and $[B]$ for any two sentences
$A$ and $B$. Suppose that $[A]\subseteq[B]$ holds. That means for
_absolutely any_ model $\mathcal{M}$ of our language, if $\mathcal{M}$
makes $A$ true, then $\mathcal{M}$ also makes $B$ true. That means
that an inference from premise $A$ to conclusion $B$ would preserve
truth in every possible scenario. It would _always_ preserves truth. It is
_necessarily_ truth-preserving. And that is exactly the concept of **deductive
validity** $\vDash$.

The approach we have just described is very abstract. It can be used for _any_
formal language. If we can explain how to define all possible models for a
language, the definition of deductive validity just 'falls out' of that
collection of semantic models.

To give an illustration of this method, let's look at some inferences with "and"
sentences. When we write $A\land B$ it is supposed to represent a single
complex sentence that combines two simpler thoughts. For example, we could
formalise English sentences like this.

+ $P$ formalises "Putnam is happy."

+ $Q$ formalises "Quine is happy."

+ $P\land Q$ formalises "Putnam and Quine are both happy."

If a person asserts $P$ and then asserts $Q$, they make two separate
statements. If a person asserts $P\land Q$, they make one single statement
that has a complex, inner structure made from a combination of simpler
statements with the logical word "and". Semantics can model the meaning of this
logical word as an operation on sets of models. The relevant operation is called
**set intersection**:

{{< img src="img/intersection.jpeg" alt="Intersection" class="img-thumbnail" >}}

In the diagram, we see that there is a set $X$ and there is a set $Y$.
Maybe these are sets of people or sets of numbers. It doesn't really matter. We
just want to see what the intersection of two sets refers to. The intersection
$X\cap Y$ is the overlapping part of those two sets. The elements of
$X\cap Y$ are all of the things that are shared in common between $X$
and $Y$. 

For example, if $F$ was the set of all fruits and $O$ was the set of all
orange things, then $F\cap O$ would be the set of orange fruits. This
intersection set contains mandarines, apricots, and mangoes but it does not
contain bananas (not orange) and it does not contain carrots (not fruits).

We can apply this operation to any two sets. What if we apply it to $[A]$
and $[B]$? What does $[A]\cap[B]$ refer to? For _absolutely any_ model
$\mathcal{M}$ in the intersection set $[A]\cap[B]$, that same model
$\mathcal{M}$ has to make $A$ true and $\mathcal{M}$ has to make
$B$ true. This operation essentially takes the models of two separate
sentences and cuts them down to the set of models that make both true at once.
It is natural to identify the meaning of "and" with this operation: $$[A\land
B] = [A]\cap[B].$$ This gives a very precise meaning to '$\land$' which we
call the **logical conjunction**.

Using these methods, we can establish some useful facts about valid inferences.
The way we verify these facts is to just think carefully about the definitions
of formal symbols like '$\land$' and '$\vDash$'. In other words, we are going to
put the axiomatic approach into action. We take definitions of basic concepts
and see where they lead. In this chapter, we will only sketch the explanations
or proofs of these facts.

+ $A\land B \vDash A$

Why is this form of inference valid? 

_Sketch of an Explanation_: $[A\land
B]=[A]\cap[B]$ and since the intersection of two sets has to be part of each
set, we know that $[A]\cap[B]\subseteq[A]$.

+ If $A \vDash B$ and $A \vDash C$, then $A \vDash B\land C$

This says that if there are two valid inferences using the same premises, you
can also use those premises to validly infer a conjunction of the previous
conclusions. 

_Sketch of an Explanation_: Assuming that $A \vDash B$ and $A
\vDash C$ hold we have $[A]\subseteq[B]$ and $[A]\subseteq[C]$. So if
any model $\mathcal{M}$ is in $[A]$, the same  model $\mathcal{M}$
also has to be in $[B]\cap[C]$. We have $[A]\subseteq[B]\cap[C]$.

+ If $A \vDash B$, then $A\land B \vDash C$

This principle says that if it is valid to infer a conclusion from some
premises, then it is valid to infer the exact same conclusion after 'adding new
information' to those premises. 

_Sketch of an Explanation_: We showed that $A\land B \vDash A$. So if we
asume $A \vDash B$ then we have both $[A\land B]\subseteq[A]$ and
$[A]\subseteq[C]$. This implies $[A\land B]\subseteq[C]$ because the
subset relation is **transitive**: if first set is part of second, and second
set is part of third, the first one has to be part of the third.

The last fact is called **monotonicity** and it gets to the heart of what makes
deduction special. If there is an element of your beliefs that implies a
conclusion, then as long as you hold on to that original element your beliefs
will always imply the same conclusion -- no matter how much new information you
aquire! This is why we say that deductive rules are _indefeasible_.

[John
McCarthy](https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)) was
famously optimistic about the power of logical methods. He even thought we could
use them to capture the kind of _commonsense reasoning_ that most adults are
capable of doing. This led to the field of **knowledge representation** where
engineers try to formalise vast amounts of information. These are like axioms of
a massively complicated theory, but the method has its limitations. 

## Induction

The study of induction also has roots in ancient philosophy and psychology. The
Buddhist scholars, and brothers, [Asaṅga and
Vasubandhu](https://plato.stanford.edu/entries/logic-india/) focused on
inferences like "where there is smoke, there is fire". They considered
associative thinking, tracking regularities in experience, and drawing
structural analogies to be the cornerstones of real human belief-forming
practices. This was an attempt to describe how the mind really functions to help
us navigate a world where evidence is imperfect.

Rules for inductive logic are **defeasible** and suited to **belief
modulation**. These rules can vary between contexts. They often require special
backing. These rules can fail, or perhaps a better way to put it is that an
inductive rule can be better in some environments, worse in others.

The early work on logic-based AI quickly shifted from deductive logic to
inductive logic. The main reason is that induction is immensely important to a
complete description of commonsense reasoning. 

Suppose that you agreed to meet Karl for lunch in a few minutes. Karl eats lunch
every day in the canteen and he always gets there early. You infer that Karl is
in the canteen now. This is inductively valid. However, as you are walking to
the canteen you see that the building is on fire and the occupants are standing
on the pavement watching the fire fighters put out the blaze. You _take back_
the inference and the conclusion you previously drew. Now, you infer that Karl
is not in the canteen (at least, you hope not). 

The optimal way of using induction is to take a set of existing beliefs (or
knowledge) and then tentatively entertain the beliefs (or knowledge) that are
most likely to be true based on your initial information. Some common, real
world _implementations_ of inductive reasoning occur when we use observations of
similarities to infer the existence of a general pattern, or we apply so-called
_generic_ information.

18. I tallied thousands of swans around the river Rhine. I tallied thousands of
swans around the IJsselmeer. Every swan that I observed was white. So, I infer
that all swans are white.

19. Birds fly. Tweety is a bird. Thus, tweety flies.

The example of Tweety is a famous example of perfectly good induction, but one
that obviously 'goes wrong' in some contexts. Generic information like "birds
fly" is very different from a truly general pattern. It is not talking about
_absolutely every_ bird. It means that most birds fly, typical birds fly. So if
you apply this generic information to Tweety, then your conclusion is probably
true. But this conclusion could be false if it turns out that Tweety is a
penguin or an ostrich.

### Semantic methods for induction

One way to approach semantics for inductive logic is to introduce
**probabilities** into the picture of semantic models for deductive logic. The
idea is that if we can talk about the probabilities of the premises and
conclusion in our semantics, we can directly translate the idea of the premises
making the conclusion (more) likely into our model. We will illustrate these
ideas by focusing on a stripped-down formal language that only represents the
logical form of "and" sentences. 

Assume that we have access to absolutely all possible models of our formal
language, just like before with deductive logic. Remember from section [2.3.1
Semantic methods for deduction](#semantic-methods-for-deduction) that for a
sentence $A$, the notation $[A]$ denotes the set of all the possible reasoning
scenarios where $A$ is true. Similarly, we have the same definition of logical
conjunction $$[A\land B] = [A]\cap[B]$$ within this background set of all
models.

In this setting, we introduce the probabilities as numeric measures of how likely it is
that a given sentence is actually true.[^probabilities] For a sentence $A$, we
write $$Pr(A)$$ to denote this measure. You can think of $Pr(A)$ as a
measure of how likely it is that the way things actually are is among the
possibilities $[A]$ according to which $A$ is true.

There are a number of laws that probabilities satisfy. For example, the value of
$Pr(A)$ must always be between $0$ and $1$ (inclusive): $$0\leq Pr(A)\leq
1.$$ We'll study these laws later in the book, when we return to probabilities
and inductive reasoning. For now, a simplified interpretation of the numbers
$Pr(A)$ works just fine. 

For now, you can think of $Pr(A)$ as measuring the proportion of all possible
scenarios that are $A$-scenarios. So, if $A$ is the sentence "Robots can fly",
$Pr(A)$ measures how many scenarios of all scenarios are ones where robots can
fly. Assuming that all scenarios are equally likely, then if robots can fly in
half of all scenarios, then $Pr(A)=0.5$. And if robots can fly in
$\frac{2}{3}$ of all possible scenarios, then $Pr(A)=0.75$. And so on.

Now that we have gotten some idea of probabilities in this way, we can talk
about **conditional probabilities**: how likely it is that something's true
_assuming that_ something else is true. Remember from [above](#hypothetically)
that validity if a hypothetical concept. So to properly capture inductive
validity, we need a notion of _hypothetical probability_. 

Mathematically, we write $Pr(B|A)$ for the conditional probability of $B$ given
$A$. Intuitively,  $Pr(B|A)$ is a measure of how likely it is that $B$ is true
assuming that the actual scenario is an $A$-scenario. That is, if $A$ is the
sentence "Pigs can fly", for example, and $B$ is "horses can fly", then
$Pr(B|A)$ asks how likely it is that horses can fly, assuming that pigs can fly.

But how should we define this mathematically? It turns out that assuming the
simplified interpretation of probabilities as proportion of scenarios from
before gives us a very natural answer. The idea is to say that :
$$Pr(B|A)=\frac{Pr(A\land B)}{Pr(A)}.$$ Basically, what this definition says is
that $Pr(B|A)$ is a measure of the proportion of $A$-scenarios that are
$B$-scenarios (look at the intersection diagram to see this immediately).

With this out of the way, we get a very natural model of inductive validity by
saying that: $$ P_1,P_2,\dots\mid\approx C \text{ if, and only if, }
Pr(C|P_1\land P_2\land \dots)\geq Pr(C)$$ In words, the inference from $P_1,P_2,
\dots$ to $C$ is inductively valid just in case the conditional probability of
$C$ given $P_1,P_2, \dots$ is higher than the probability of $C$ not assuming
the premises. [Rudolf Carnap](https://en.wikipedia.org/wiki/Rudolf_Carnap)
coined the term "increase of firmness" for this relation. 

In fact, in this model we can also measure _how much_ the premises raise the
probability the conclusion. This is simply $Pr(C|P_1\land P_2\land
\dots)-Pr(C)$. Using this idea, we can define a **strong inductive inference**
as one where the conditional probability of the conclusion given the premises is
_much_ larger ($\gg$) than that of the conclusion:
$$P_1, P_2, \dots\stackrel{!}{\mid\approx} C \text{just in case }Pr(C|P_1\land P_2\land
\dots) \gg Pr(C)$$

Let's think about this model for inductive validity. Using it, we can establish
some useful facts about inductive inferences. As before, we will only sketch the
explanations or proofs of these facts. We start off with some commonalities
between inductive and deductive logic.

For example, we can easily show that: 

+ $A\land B \mid\approx A$

_Sketch of an Explanation_: This is inductively valid because the proportion of
$A\land B$-scenarios which are $A$-scenarios is $1$: _all_ $A\land B$-scenarios
are $A$-scenarios. That is $Pr(A|A\land B)=1$. Since $0\leq Pr(A)\leq 1$, we
know that $Pr(A|A\land B)\geq Pr(A)$. 

_Question_: is the inference always inductively _strong_?

But, crucially, we get that:

+ It is possible to have $P_1,P_2,\dots \mid\approx C$, but not
$Q,P_1,P_2,\dots\mid\approx C$.

This says that **monotonicity fails for induction**. In other words, it can be valid
to infer a conclusion from certain premises, but invalid to infer the exact same
conclusion after "adding new information" to those premises. New information
changes the conclusion we can inductively infer.

_Sketch of an Explanation_: Suppose you live in a town with a few vegans. You
know that all those people ride bicycles, they do not own cars.
 
In the diagram below, $Pr(A)$ is the probability of being a cyclist, $Pr(B)$ is
the probability of eating meat, and $Pr(C)$ is the probability of being vegan:

{{< img src="img/probabilities.jpg" class="img-thumbnail" >}}

For a randomly chosen person, $Pr(C)$ is not very high since the proportion of
vegans, $C$, among the general population is low.
 
At the same time, $Pr(C|A)$ is relatively high, _of the cyclists_, $A$, a much
larger proportion is vegan than in the general population. This means that
$Pr(C|A) > P(C)$, and so $A\mid\approx C$. Or, in words, a randomly chosen
person being a cyclist is inductive evidence for that person being vegan.

But if we look at the proportion of bikers that are cyclist and meat eaters,
obviously, _none_ of them is a vegan--they're meat eaters, after all. This means
that $Pr(C| A\land B)=0$. But since $Pr(C)$ is positive---there are _some_
vegans, this means that $Pr(C| A\land B)\ngeq Pr(C)$ and so $A,B\mid\approx C$
fails.

The **non-monotonicity** of induction is very important. Perhaps a certain
element of your beliefs implies a conclusion at this moment, but if you acquire
new information then your _updated_ beliefs might not imply the same conclusion
anymore. This is why we say that inductive rules are _defeasible_. At one
moment, in one context, it might be inductively good to infer a conclusion based
on some limited information. At the next moment, based on new information, it is
no longer inductively good to infer that same conclusion. You have to 'take
back' the previous 'outcome' of your inferences.

## Further readings

A modern classic on the mathematical definition of deductive validity:

+ [A. Tarski. "Über den Begriff der logischen Folgerung". _Actes du Congrès
International de Philosophie Scientifique_. Hermann, Paris, 1936.](https://doi.org/10.2307/2267371)

Update of the Tarskian method, presented at an introductory level:

+ [G. Sher. _Logical Consequence_. Elements in Philosophy and Logic. Cambridge
University Press, 2022.](https://www.cambridge.org/core/books/logical-consequence/CCF10B5A87373CB40897424453D863A8)

Early work on AI implementations of inductive reasoning:

+ [J. McCarthy. "Circumscription: A form of non-monotonic reasoning”, _Artificial
Intelligence_, 13: 27–39.](https://doi.org/10.1016/0004-3702(80)90011-9)

The idea of using probability theory to model inductive validity is heavily
influenced by the work of Rudolf Carnap:

+ [R. Carnap. "On inductive logic", _Philosophy of Science_ 12(2): 72-97.](https://doi.org/10.1086/286851 )

Influential mathematical treatment of inductive validity:

+ [S. Kraus, D. Lehmann, & M. Magidor. "Nonmonotonic Reasoning, Preferential
Models and Cumulative Logics". _Artifical Intelligence_, 44: 167–207,
1990.](https://doi.org/10.1016/0004-3702(90)90101-5).

**Notes:**

[^allmodels]: If you stopped here and thought "yes, but _how do we_ define all
possible models for a language?" Don't worry. We will explain this in detail
later.

[^firststep]: Why only a "first step"? Well, the main reason is that we know it
is possible for an inference to use many premises. However, the way we are
setting up this definition of validity, it only applies to inferences that have
a single premise sentence. It is not a full definition.

[^probabilities]: In probability theory, there are many different ways of
thinking about what probabilities "really are": subjective estimates, objective
chances, frequencies, or something else altogether. Here we avoid this question and treat
probabilities intuitively. We return to the "nature" of probabilities later in
the book.
