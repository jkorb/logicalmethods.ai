---
title: Logic and AI
author: Johannes Korbmacher
weight: 1
resources:
  - src: img/inferences.png
    name: inferences
params: 
  date: 31/08/2024        
  last_edited: 01/09/2024 
  id: txt-laa
  math: true
---

# Logic and AI

In this chapter, you'll learn about what logic is and what it has to do with AI.

First, you'll make acquaintance with some basic concepts of logical theory:

+ [inference](#inference)
+ [validity](#validity), and
+ [logical systems](#logical-systems).

Then, you'll learn about three ways in which logic is relevant for AI:

+ [foundationally](#as-a-foundation),
+ [methodologically](#as-a-methodology), and
+ [instrumentally](#as-a-tool). 

## What is logic?

On the most general level, **logic** is the study of _valid inference_. To
understand this definition better, let's discuss inferences and validity in
turn. 

### Inference

The basic concept of logic is that of an **inference**,[^inference] a simple
piece of reasoning like the following:

1) Given that [Ada](https://en.wikipedia.org/wiki/Ada_Lovelace) is either on the
_Philosopher's Walk_ or in the study, and she's not in the study, she therefore
must be on the _Philosopher's Walk_.

2) If [Alan](https://en.wikipedia.org/wiki/Alan_Turing) can’t crack the code,
then nobody else can. Alan can crack the code. So nobody else can. [**AdH_comment**: I understand that this example is used to illustrate an invalid argument. However, it might be better to introduce this chapter with examples of valid reasoning first. Later on, the original example could be modified into an invalid argument in order to clarify the difference in meaning between valid and invalid arguments. It feels unnatural to start the second example with a falsity. Another option is to introduce this set of examples with a warning that no all reasonings are _right_. Instead of this example, I would use: "If Alan can't crack the code, then nobody else can. Alan can't crack the code. So nobody else can." or: "If Alan can crack the code, then nobody else can. Alan can crack the code. So nobody else can."]

3) [Blondie24](https://en.wikipedia.org/wiki/Blondie24) is a neural
network-based AI system that struggled to reach world-class checkers
performance. [Deep
Blue](https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)), instead, is a
logic-based AI system that beat the [world
champion](https://en.wikipedia.org/wiki/Garry_Kasparov) in chess. This shows
that logic-based AI systems are inherently better than neural network-based
systems at games. [**AdH_comment:** Maybe this is an example of a hasty generalization, as the argument draws a general conclusion about AI system types based on two unrelated cases: one concerning checkers (Blondie24) and the other chess (Deep Blue). The two premises focus on different games and contexts, and therefore do not provide a logical basis for the conclusion that logic-based AI systems are inherently better than neural network-based systems at games. A different or more consistent set of premises and conclusion would better support the theory, for example: "[Blondie24](https://en.wikipedia.org/wiki/Blondie24) is a neural
network-based AI system that struggled to reach world-class checkers
performance. [Deep
Blue](https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)), instead, is a
logic-based AI system that beat the [world
champion](https://en.wikipedia.org/wiki/Garry_Kasparov) in chess. This shows
that logic-based AI systems are inherently better at winning a chess game than neural network-based systems are at checkers."].

4) Since [Watson](https://en.wikipedia.org/wiki/IBM_Watson) is a logic-based AI
system that beat [_Jeopardy!_](https://en.wikipedia.org/wiki/Jeopardy!), we can
conclude that some logic-based AI systems are capable of beating game shows.

5) [GPT-4](https://en.wikipedia.org/wiki/GPT-4) improved upon
[GPT-3](https://en.wikipedia.org/wiki/GPT-3), which improved upon
[GPT-2](https://en.wikipedia.org/wiki/GPT-2), which, in turn, improved upon
[GPT-1](https://en.wikipedia.org/wiki/GPT-1) in terms of coherence and
relevance. Therefore, the next generation of GPT models will further improve in
this respect.

[**AdH_comment:** The original structure of this section is: inference indicators related to the conclusion, an explanation of the conclusion, an explanation of the premises, premise indicators and general explanation of inferences. However, this order seems a bit disorganized to me. A clearer structure of this part would be: explanation of inferences, explanation of the conclusions and premises, then the indicators (both inference and premise), because they structure the argument, but they aren't the main part of an argument. Below is an example version of the revised text.]

[**AdH_addtext:** 

**Caveat**: Our topic is _not_ how people actually reason (psychology of
reasoning), how to use arguments to convince others (rhetoric), or anything of
that sort. These things are good to know, of course, but they are not our main
interest. As logicians, we are interested in the structure of inferences.

**Inferences** are the primary subject of logical theory. Note that in logic,
"inference" is a **technical term**, which does not necessarily have its
everyday meaning. An inference is a linguistic entity, consisting of premises
and a conclusion---_and nothing else_. It is not, for example, the psychological
process of drawing a conclusion from premises.

Before we go ahead and look more closely at the quality of these inferences,
let's introduce some important terminology.

These inferences, arguments, consist of a **conclusion** that is supported by the **premises** and indicators to dituiguish the conclusions and premises.

The **conclusion**[^conclusion] of an inference is what's being inferred or
established based on the preceding arguments. It's the statement that logically follows from a set of sentences that support the conclusion. In 4., for example, the conclusion is that some logic-based AI systems are capable of beating game shows. The examples above all end with the conclusion. However, the conclusion can occur in any position. For example:

&nbsp;&nbsp;&nbsp;&nbsp;1<sup>*</sup>. Ada is not in the study. Thus she must be on the _Philosopher's Walk_, because she is either there or in the study.

The **premises** of an inference are its assumptions or hypotheses, they are what the conclusion is based on. These statements provide support for the conclusion. They serve as the basis or evidence from whcih the conclusion is logically derived. Thus, the conclusion is drawn from the premises. In 4., for example, the premise is that Watson is a logic-based AI system that beat _Jeopardy!_

An inference can have any number of premises. While inference 4. has only one premise, inference 1. has _two_: that Ada is either on the _Philosopher's Walk_ or in the study, and that she's not in the study. In logical theory, we also consider the limit cases of having _no_ premises and of having _infinitely many_ premises. More about that later.

Besides, **indicators** are used to structure the argument. They are used to clarify the structure of an argument by distinguishing conclusions from the supporting statements, i.e., the premises. 

We call phrases like "therefore", "so", and "we can conclude that" **inference indicators**, because they introduce the conclusion. In 5., the inference indicator "therefore" introduces the conclusion _the next generation of GPT models will further improve in this respect_. 

**Premise indicators** signalate that the following sentence is a premise. Examples of premise indicators are "since", "because" and "given that". These phrases show the parts of the inference that provide the support of the conclusion.


Logical theory is interested in whether an conclusion is supported by the premises. Inferences come with the expectation that the conclusion does, in fact, _follow from_ the premises, that the premises _support_ the conclusion in this way. In logical terminology, we want our inferences to be **valid**.[^valid] We'll turn to what that means in the next section.

**Original text below:**]

Before we go ahead and look more closely at the quality of these inferences,
let's introduce some important terminology.

We call phrases like "therefore", "so", and "we can conclude that" **inference
indicators**. 

The **conclusion**[^conclusion] of an inference is what's being inferred or
established. In 4., for example, the conclusion is that some logic-based AI
systems are capable of beating game shows.

The conclusion often follows the inference indicator, but it can also be the
other way around. [**AdH_comment:** I don't think this is correct, regarding the example. The function of the indicator "since" in this example is to indicate the premise _Watson is a logic-based AI system that beat Jeopardy!_, instead of the conclusion as mentioned here. The sentence is a reason to accept the conclusion _We know some logic-based AI systems are capable of beating game shows_. I think the explanation (The conclusion ... way around) is meant to explain that the conclusion not always closes the inference. However, this is a bit unclear. See "AdH_addtext" for a changed explanation.]

6) We know that some logic-based AI systems are capable of beating game shows,
since [Watson](https://en.wikipedia.org/wiki/IBM_Watson) is a logic-based AI
system that beat [_Jeopardy!_](https://en.wikipedia.org/wiki/Jeopardy!).

The **premises** of an inference are its assumptions or hypotheses, they are
what the conclusion is based on. In 4., for example, the premise is that
Watson is a logic-based AI system that beat _Jeopardy!_

An inference can have any number of premises. While inference 4. has only one
premise, inference 1. has _two_: that Ada is either on the _Philosopher's
Walk_ or in the study, and that she's not in the study. In logical theory, we
also consider the limit cases of having _no_ premises and of having _infinitely
many_ premises. More about that later.

Phrases like "given that" in 1. are called **premise indicators**.

Inferences are the primary subject of logical theory. Note that in logic,
"inference" is a **technical term**, which does not necessarily have its
everyday meaning. An inference is a linguistic entity, consisting of premises
and a conclusion---_and nothing else_. It is not, for example, the psychological
process of drawing a conclusion from premises. [**AdH_comment**: I think it is better to start the section with this paragraph, beacuse it explains why it is important to understand this section.]

Inferences come with the expectation that the conclusion does, in fact, _follow
from_ the premises, that the premises _support_ the conclusion in this way. In
logical terminology, we want our inferences to be **valid**.[^valid] We'll turn
to what that means next.

**Caveat**: Our topic is _not_ how people actually reason (psychology of
reasoning), how to use arguments to convince others (rhetoric), or anything of
that sort. These things are good to know, of course, but they are not our main
interest.

### Validity
[**AdH_addtext:** In the previous section, we have looked at the basic concepts of an inference, i.e., arguments as a collection of premises, by which the conclusion is derived. This suggets that Validity is one of the key concepts within logic. Finish this ]

Consider inference 1) again:

1) Given that Ada is either on the _Philosopher's Walk_ or in the study, and
she's not in the study, she therefore must be on the _Philosopher's Walk_.

This looks like a pretty solid inference: if it's indeed the case what the
premises say, it _must_ be the case what the conclusion says.

In logic, we call an inference like that, where the premises _necessitate_ the
conclusion, **deductively valid**. Deductive inferences are the
traditional topic of most logical theory. They are often associated with
mathematical reasoning.

An inference that's not valid is called **invalid**. Take 2.:

2) If Alan can’t crack the code, then nobody else can. Alan can crack the code.
So nobody else can.

This inference seems pretty hopeless: obviously, other people might still be
able to crack the code even if Alan did---it might just not have been very hard.

Flawed inferences like this are also called **fallacies**. Frequently committed
fallacies often have names. This one is called "denying the
antecedent."[^fallacies]

What about 5.?

5. GPT-4 improved upon GPT-3 which in turn improved upon GPT-2 and GPT-1 in
terms of coherence and relevance. Therefore, the next generation of GPT models
will further improve in this respect.

This inference is clearly not deductively valid: it _could_ happen that the next
generation of GPT models shows serious performance regression.

But given the evidence, such a scenario is not very _likely_: we've seen GPT
models consistently improve with each new generation, so why should the next
generation be any different?

An inference like this, where the premises make the conclusion (more) _likely_ is
known as an **inductively valid** inference. Inductive inferences play an
important role in the sciences. They are often associated with statistics and
probability theory.

An important difference between deductive and inductive inferences is that
validity for deductive validity is all or nothing, while inductive validity
comes in _degrees_. What we mean by this is that when it comes to deductive
validity, an inference is either valid or not: the premises either necessitate
the conclusion or they don't---there's nothing in between. With inductive
inferences, instead, there are more options.

Consider the following two (hypothetical) inferences, for example:

6. Out of 200 randomly sampled voters, around 40% support strict AI laws.
Therefore, one in two members of the general voting population supports strict
AI laws.

7. Strict AI laws have a support of around 80% in a randomly selected sample of
20.000 voters. Therefore, support for strict AI laws in the general public is
around 80%.

Neither inference seems inductively invalid---assuming the sampling was done
randomly and with sufficient care, in both inferences the premise would seem to
support the conclusion. 

But clearly, the second inference 7. is much _stronger_ than the first one
6.: given that the sample size is orders of magnitude larger than in the first
inference, the sample is likely more representative of the actual population by
making different forms of [selection
bias](https://en.wikipedia.org/wiki/Selection_bias) less likely.

We end up with something like the following picture:

{{< img src="img/inferences.jpeg" alt="Inference Image" class="img-thumbnail" >}}

That is, on the first level, we classify inferences into valid (good) and
invalid (bad) ones. Then, on the second level, we distinguish between
deductively and inductively valid inferences. And finally, on the third level,
we distinguish between strong and weak inductive inferences.

This concludes our overview of the _subject_ of logical theory: logicians study
the different forms of valid and invalid inference. We'll delve further into the
conceptual background of logical theory in the next chapter, where you'll learn
foundations of the concept of validity. For now, we'll turn to the _way_ in
which logicians study this subject, we'll look at **logical systems**.

### Logical systems

Logicians approach the study of valid inference the way most scientists approach
their subject matter: using [mathematical
models](https://en.wikipedia.org/wiki/Mathematical_model). We call the
models that logicians use to study valid inference **_logical systems_**.

A logical system typically has three components:

+ a **syntax**, which is a model of the _language_ of the inferences,
+ a **semantics**, which is model of the _meaning_ of the premises and
conclusions, 
+ and a **proof theory**, which is a model of _stepwise valid
inference_.

[**AdH_comment**: Maybe it is an idea to introduce the Chinese room experiment of Searle here. The Chines room makes clear what the difference between syntx and semantics is. For example:

To understand the difference between syntax and semantic better, we look at the [Chinese Room](https://en.wikipedia.org/wiki/Chinese_room) argument of the American philosopher John Searle. According to Searle, computers can't think properly, because a computer only has syntax, instead of semantics too. Suppose a closed room. In the room, there is a person (or a computer) surrounded by multiple books. These books consist of translation rules. The person in the room recieves cards with Chinese questions. However, the person doesn't master Chinese. With the books the person is capable to manipualte the signs on the cards to answer the questions in Chinese, without understanding the meaning of either the questions and the answers. The person outside of the room, receives the manipulated answers in perfect Chinese. This person would think the person inside the room is a native Chinese speaker. This is the same case as with a computer. The computer's syntax, manipulation of symbols by applying rules, is like what happens inside the room. The semantics is the understanding of the symbols' meaning, by the one outside the room. According to Searle, the person inside the room or the computer is not capable of semantics, meaning, but only of syntax.

]

Together, these three components provide a mathematical model of valid
inference. Throughout the course, you'll learn more about syntax, semantics, and
proof theory by studying how they are used in different AI applications. By the
end, you'll have a good idea of what the different components of logical systems
do, and how they work together to provide a comprehensive model of valid
inference.

In essence, logical systems are not all that different from the mathematical
models used by physicists, for example. To illustrate, think about how a
physicist would approach the question of how far our little robot ```SYS-2```
can throw its ball: 

{{< img src="img/reality.jpeg" alt="Inference Image" class="img-thumbnail" >}}

The physicist uses [Newtonian
mechanics](https://en.wikipedia.org/wiki/Classical_mechanics) to predict how far
the ball will fly, but they don't apply the laws of mechanics _directly_ to the
real world. First, they build a mathematical model of the situation, which looks
something like this: 

{{< img src="img/model.jpeg" alt="Inference Image" class="img-thumbnail" >}}

In this model, the physicist assigns a mass to the ball, represents the ball
as a point in 2-dimensional [Euclidian
space](https://en.wikipedia.org/wiki/Euclidean_space), and treats the forces
acting on the ball as [vectors](https://en.wikipedia.org/wiki/Euclidean_vector).
Assuming that there's no air resistance, it's a high-school level exercise to
calculate where the ball will land using the laws of classical mechanics (can you still do it?). 

What's characteristic of mathematical models is that they _abstract away_ from
irrelevant features of reality (ignoring the trees, for example), they
_idealize_ the situation (by treating the ball as a point-mass, for example),
and they introduce _simplifying assumptions_ (such as no air resistance, for
example). Ultimately, this is what makes it possible to apply exact mathematical
calculations to a real-world scenario like ours.

Logical systems work in just the same way as our physicist's model:
they involve abstractions, idealizations, and simplifying assumptions in order
to allow us to make exact mathematical calculations about valid inference:

+ Syntax introduces the ideas of a **formal language** and of **logical
formulas**, which are abstract representations of the logically relevant
structure of premises and conclusions. This is roughly analogous to the way the
physicist represents the ball as a point-mass.

+ Semantics introduces the idea of **formal models**, which are representations
of meaning, spelled out in the context of formal languages. These models allow
us to study **logical laws**, which are roughly analogous to the laws of
mechanics, such as: $$F=ma$$ Interestingly, formal models often involve
simplifying assumptions, such as that every sentence has a determinate
truth-value from either true or false.[^bivalence]

+ Finally, proof theory introduces the idea of **formal derivations**, which are
a model of stepwise valid inference. Just like the physical model calculates
where the ball will land using the laws of mechanics, these derivations
calculate valid inferences from the basic laws of logic.

Developing and studying logical systems is the core business of logical theory
and has lead to rich body of logical knowledge, which you'll familiarize
yourself with during this course.

One last thing to note about logical systems is that there are _many_ of them.
In this course, you'll learn about a wide range of logical systems and how they
are used in AI. So, be prepared for a **logical diversity**!

There are different ways of classifying logical systems, but let's just just
look at two to get the point of logical diversity across.

One natural way of classifying logical systems is by the kind of inferences they
deal with. For example, there are systems that deal with:

+ [grammatical
conjunctions](https://en.wikipedia.org/wiki/Conjunction_(grammar)), viz. 
[propositional logic](https://en.wikipedia.org/wiki/Propositional_calculus),
+ [quantifiers](https://en.wikipedia.org/wiki/Generalized_quantifier), viz. 
[predicate logic](https://en.wikipedia.org/wiki/First-order_logic),
+ [modals](https://en.wikipedia.org/wiki/Modality_(semantics)), viz. [modal
logic](https://en.wikipedia.org/wiki/Modal_logic).

Another way of classifying logical systems is by their background
assumptions/philosophies. For example, there's:

+ [classical logic](https://en.wikipedia.org/wiki/Classical_logic), which
assumes (among other things) that every sentence is either true or false,
+ [intuitionistic logic](https://en.wikipedia.org/wiki/Intuitionistic_logic),
which assumes that truth needs to be "constructed",
+ [paracomplete and paraconsistent
logics](https://en.wikipedia.org/wiki/Paraconsistent_logic), which allow for
exceptions to certain classical logical laws, such as that there's no true
contradiction.

As you'll see different systems are useful in different contexts. 

## Logic in AI

Now you have a first idea of what the science of logic is all about.[^logic] But
before we can talk about the role of logic in AI, we need a working definition
of AI.

{{< definition term="AI" id="ai-160620250933" >}}{{< /definition >}}

In this course, we take **AI** to be the study of the models and replication of
_intelligent behavior_. Here we're understand "intelligent behavior" in a rather
inclusive way, counting such diverse activities as behavior of [switching
circuits](https://en.wikipedia.org/wiki/A_Symbolic_Analysis_of_Relay_and_Switching_Circuits),
[spam filters](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering), and
[self-driving cars](https://en.wikipedia.org/wiki/Vehicular_automation) as
intelligent behavior.

There are at least **three ways**, in which logic is relevant to AI understood
in this way. We'll go through them in turn.

### As a foundation

The first way in which logic is relevant to AI is the most direct one: valid inference simply _is_ paradigmatic intelligent behavior. So, logical systems
directly target what we're trying to model in AI---logical systems are models of
intelligent behavior. So, by our definition, logical systems are part of AI.
This makes logic a **subdiscipline** of AI.

The relevance of logic in this sense is primarily **foundational**, meaning that
logic contributes to the understanding of (one of) the basic concepts of AI. A
part of logical theory that's particularly relevant here is
[**metalogic**](https://en.wikipedia.org/wiki/Metalogic), which deals with the
limits and possibilities of logical systems _in principle_.

Here are two famous metalogical results that (some) people think are highly
relevant to AI research:

+ Gödel's [**(first) incompleteness
theorem**](https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems),
which implies that for every logical system that is free of internal
contradictions and models basic mathematical reasoning, there is a mathematical
statement that is _undecidable_ in the system, meaning that the statement can
neither be proven nor refuted in that system.

  Many researchers, including Gödel himself, have thought that this has deep
  implications for AI. The arguments here are rather subtle and without going
  into the very technical details of Gödel's result it is _very_ easy to make
  mistakes, but a _very_ rough version of the argument runs as follows:

  _Since the human mind is consistent and capable of mathematical reasoning, but
  there is no in principle undecidable mathematical fact for the human mind,
  Gödel's result shows that the human mind cannot be modeled or replicated by a
  logical system._

  If this is correct, it dooms a wide range of approaches to AI, including the
  logic-based approaches discussed [below](#as-a-methodology).

+ Turing's [**undecidability
theorem**](https://en.wikipedia.org/wiki/Decidability_(logic)), which states
that validity in the standard system of predicate logic is _(algorithmically)
undecidable_, meaning that  there is no algorithm and there can never be an
algorithm that correctly determines in finitely many steps whether any given
inference in the system of predicate logic is valid. 

    This result seems to show directly that we cannot "fully automate" validity
    checking using AI and maintain absolute reliability.

The relevance of logic to AI in this sense is hard to deny. At the same time, a
young engineer setting out to change the world with AI, _might_ think of logic
in this sense as _just theory_ with little practical relevance. Although logic
in this sense _is_ used for some AI applications (e.g. [formal
verification](https://en.wikipedia.org/wiki/Formal_verification)), it's true
that logical theory is a somewhat theoretical endeavor (which doesn't make it
any less exciting, of course 🤓). Next, we'll turn to a much more practical
relevance of logic to AI.

### As a methodology

The second way in which logic is relevant to AI is that its the basis for an
entire approach to AI itself, which is known as **logic-based** or [**_symbolic
AI_**](https://en.wikipedia.org/wiki/Symbolic_artificial_intelligence). Its hard
to overstate the influence that logic has had on the development of AI as a
discipline: among other things, logic has influenced programming languages
([LISP](https://en.wikipedia.org/wiki/Lisp_(programming_language))), the way we
store knowledge (see [Knowledge Representation and
Reasoning](https://en.wikipedia.org/wiki/Knowledge_representation_and_reasoning)
or **KRR** for short), and advanced AI-technologies (such as
[WolframAlpha](https://en.wikipedia.org/wiki/WolframAlpha)).[^history] It is
also the approach that ultimately underpins amazing AIs such as [IBM's
Watson](https://en.wikipedia.org/wiki/IBM_Watson) and [Deep
Blue](https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)) (from above).
For a while, there was even the (not _completely_ unreasonable) hope that logic
could provide a complete foundation for AI, in the sense that everything you
want to do in AI could be done using logical methods.

In the course, you'll learn more about logic-based AI, but you should know right
off the start that symbolic AI is no longer the predominant approach to AI.
There are complex reasons for that, but its possible to get an idea why without
knowing _too_ much about logic and AI to begin with.

An good example of symbolic AI technologies are so-called [**expert
systems**](https://en.wikipedia.org/wiki/Expert_system), which are computer
systems designed to behave like human experts at certain reasoning or decision
making tasks, such as [medical diagnosis](https://en.wikipedia.org/wiki/Mycin)
or [selecting computer parts](https://en.wikipedia.org/wiki/Xcon) for your new
gaming PC.

Expert systems typically have two components: a _knowledge base_ and an
_inference engine_. The **knowledge base (KB)** stores the expert information and the
**inference engine** derives new information from known facts using valid inference
and the expert information.

The expert information typically takes the form of **if-then rules**.
The expert information in the KB of an expert system for medical diagnosis, for
example, could include the following:

[**AdH_comment:** maybe the difference between antecedent and consequent could be mentioned shortly.]

+ _If_ the patient has a runny nose, a sore throat, and a mild fever, _then_ the
patient likely has the common cold.

If we present the system with the known fact that our patient does have a runny
nose, a sore throat, and a mild fever, the inference engine could easily derive
that the patient likely has a common cold.[^implementation] If some symptom is
missing, say the patient doesn't have a fever, the engine can no longer validly
infer that the patient has a cold---it could be something else.

This is roughly how expert systems work. By the way, this example makes it also
easy to explain why expert systems (and for similar reasons other logic-based AI
technologies) are also called **symbolic AI**: the rules and inference mechanism
of an expert system are completely transparent, human-readable, and, in this
sense, _symbolic_. Importantly, one can tell why an expert system makes a
certain prediction by looking at how the inference engine arrived at the
conclusion, which inference patterns it used and which pieces of expert
information it relied on. This is of utmost importance for what's known today
as [**explainable
AI**](https://en.wikipedia.org/wiki/Explainable_artificial_intelligence) or
**XAI** for short.

To illustrate the problem with expert systems, let's consider an ancient
anecdote reported by
[Laërtius](https://en.wikipedia.org/wiki/Diogenes_Laertius). According to the
anecdote, [Plato](https://en.wikipedia.org/wiki/Plato) once defined a human as a
featherless biped, much to the approval of everybody in the agora at the time
(which is where the cool kids hung out). Along came history's first punk,
[Diogenes](https://en.wikipedia.org/wiki/Diogenes), and presented Plato with a
plucked chicken, remarking "Behold, Plato's human."

What this example shows is the following. Plato's definition seems to give us
the following if-then rule:

+ _If_ something's a featherless biped, _then_ this is a human.

Diogenes presents us with an object that satisfies the two conditions
in the if-part of the rule, but not the condition in the then-part. He found a
_counterexample_ to Plato's definition.

The point of the anecdote, for us anyways, is that it is _incredibly hard_ to
formulate expert knowledge as if-then rules. Obviously, Plato knew how to
distinguish a human from a plucked chicken, but turning this ability into an
if-then clause caused even the philosophical giant to stumble. Finding correct
if-then rules often requires _a lot_ of effort, trial-and-error, etc. and then
maintenance, bug-fixing, and so on. This is one of the main issues that stalled
the advancement of symbolic AI---ultimately leading to the (second) [AI
winter](https://en.wikipedia.org/wiki/AI_winter) and "downfall" of symbolic AI.

It turns out that statistics-based approaches, using **neural networks** and
**machine learning** instead of knowledge bases and inference engines, are _much
more_ efficient at many tasks that people tried to solve using expert systems.

IBM's [Deep Blue](https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)),
which beat world chess champion Gary Kasparov in the 1990s using a rule-based
expert system is a success story of symbolic AI. It shows how super-human
performance can be achieved using expert systems. At the same time, "beating" games like
[Go](https://en.wikipedia.org/wiki/Go_(game)) in the same sense eluded expert systems
for a long time. It just seemed that the complexities of the game are too high
to capture in a knowledge base, even after years of trying.

This changed with DeepMind's [AlphaGo](https://en.wikipedia.org/wiki/AlphaGo),
which is a neural network-based AI that's been trained using statistical machine
learning methods on large sets of game data. In a series of highly publicized
events in the mid 2010s, AlphaGo managed to beat professional Go players at the
highest level, suggesting the superiority of neural networks over expert systems
for beating games.

Success stories like this have lead to the rise of what's known as
**subsymbolic AI**, which many take to be the predominant approach to AI today.
Subsymbolic AI prefers conditional probabilities and inductive inference over
if-then rules and deductive inference, and it prefers statistical models
generated from **big data** over knowledge bases generated by experts. As a
consequence, the information stored in a subsymbolic AI system, especially when
it comes in the form of a neural network, is often _opaque_ and hard for humans
to understand.[^XAI] The systems seem to operate on a "lower level", much like the
neurons in the brain are on a "lower level" as compared to our thoughts and
ideas---whence the name _subsymbolic AI_.

But if subsymbolic AI seems to dominate symbolic AI, what's the place for logic
in AI today?

### As a tool

The third way in which logic is relevant to AI (partially) answers this
question: logical theory provides is extremely sharp powerful _tools_ for many
different tasks in AI research and development. These tools are ultimately what
the course is about.

We should note that while subsymbolic AI outperforms symbolic AI in many tasks,
there are still areas where symbolic AI reigns supreme. One of these is the way
we store important factual knowledge in AI systems, which is what **Knowledge
Representation and Reasoning (KRR)** is all about.

While subsymbolic systems, especially [**generative AI
systems**](https://en.wikipedia.org/wiki/Generative_artificial_intelligence) like
ChatGPT, _can_ store factual information, they are---at least in the current
state of the art---fairly unreliable with
[**hallucinations**](https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence))
being one of the main issues. If we want to have 100% recall of the stored
information (think: your bank account, passwords, ...), we need to use
[**databases**](https://en.wikipedia.org/wiki/Database). Roughly, the difference
between using a subsymbolic model to store information and using a symbolic
model is the difference between trying to remember the information and writing
it down.

The connection between databases and logic is very deep: [Codd's
theorem](https://en.wikipedia.org/wiki/Codd%27s_theorem) shows that **querying**
a database is, in many cases, essentially just a special way of evaluating the
formulas of the logical system of predicate logic. KRR is just one example of
where a logical tool is useful outside the scope of expert systems, and symbolic
AI in the narrow sense of using logic as the sole foundation for AI. In the
course, you'll see that logical tools and methods are (almost) _everywhere_ in
AI, ranging from the way the transistors work that our computers are build from
to the way neural network models "think".

It is important to note that even subsymbolic AI systems still typically
ultimately rely on inference, just statistical _inductive_ inference and not the
deductive inference that's typically used in symbolic AI systems. In the course,
we'll pay special attention to the tight connections between logical systems and
probability theory and statistics---as we'll see they are two sides of the same
coin.

Finally, there's **cutting edge research**. The last years have seen the
meteoric rise of generative AI systems, and especially [**large language models
(LLMs)**](https://en.wikipedia.org/wiki/Large_language_model). These are
subsymbolic AI systems that are essentially large-scale probabilistic models of
natural language. Under the hood, LLMs are neural networks with billions of
parameters that are trained on huge sets of textual data using advanced
machine-learning technologies. These neural networks approximate textual
probabilities which estimate the likelihood of an expression being the next
expression given a sequence of previously processed expressions.

LLMs have the impressive ability to mimic human language behavior. LLMs are the
underlying technology of chatbots, like ChatGPT, who interact with humans by
generating text responses to prompts—questions, instructions, descriptions, and
the like. These responses are generated by repeatedly outputting the most likely
next expression given the prompt and output generated so far. ChatGPT is so good
at human-style interaction that it can [fool you into thinking you're talking to
a human](https://en.wikipedia.org/wiki/Turing_test).

But despite their awesome performance on many linguistic tasks, when it comes to
precise, exact reasoning, mathematical calculations, and the like, the
performance of LLMs is rather poor. Many leading researchers frame the issue in
terms of a distinction that's been popularized by [Daniel
Kahneman](https://en.wikipedia.org/wiki/Daniel_Kahneman) in his famous popular
science book [Thinking, Fast and Slow](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow). 

In the book, Kahneman describes the distinction between two kinds of reasoning
activities regularly performed by human agents:

+ **System 1 thinking**, which is fast, automatic, intuitive, unconscious,
associative, and the like. Examples:

  + recognizing a face,
  + telling if one object is taller than another,
  + performing simple calculations, like $5+7$,
  + ...

+ **System 2 thinking**, which is slow, deliberate, conscious, logical,
calculating, and the like. Examples:

  + counting the number of A's in a text,
  + solving a logic puzzle,
  + performing complex calculations, like $432\times 441$,
  + ...

The diagnosis of the problem with LLMS shared promoted, e.g., by [Andrej
Karpathy](https://en.wikipedia.org/wiki/Andrej_Karpathy) is that LLMs are really
good at system 1 thinking, but are lacking in system 2 capabilities. Symbolic
systems, like expert systems, instead, are really good at system 2 thinking, but
have little to no system 1 capabilities. There are different ways of tackling
this problem, but one promising way that's being explored by companies like
[OpenAI](https://en.wikipedia.org/wiki/OpenAI) at the moment is to create
**hybrid systems**, which both have symbolic and subsymbolic components. Think
of teaching ChaptGPT to use calculator rather than letting it try to solve a
calculation "in its head".

This is where symbolic AI methods, especially logical methods, are once more
coming to the forefront of AI research: building powerful, state-of-the-art
hybrid AI systems requires a solid background in logical methods for AI---which
is what you'll acquire in this course.

## Further readings

A good first introduction into the world of logic is [Graham
Priest's](https://en.wikipedia.org/wiki/Graham_Priest) 2017 book:

+ [Logic. A Very Short Introduction. Oxford University
Press.](https://global.oup.com/academic/product/logic-a-very-short-introduction-9780198811701).

The present textbook is neither a standard logic textbook nor a general AI
textbook. It might be advisable, though is by no means necessary, to consult one
of each from time to time. I recommend:

+ [Halbach. 2010. _The Logic Manual_. Oxford University Press](https://global.oup.com/ushe/product/the-logic-manual-9780199587841?cc=us&lang=en&) 

+ [Russel and Norvig. 2021. Artificial Intelligence: A Modern Approach. 4th
Edition. Pearson](https://elibrary.pearson.de/book/99.150005/9781292401171).

If you're interested in some history and an interesting narrative about the
current direction of AI research and development, I recommend:

+ [Domingos. 2015. The Master Algorithm: How the Quest for the Ultimate Learning
Machine Will Remake Our
World. Penguin](https://en.wikipedia.org/wiki/The_Master_Algorithm).

In general, I recommend to use the internet to keep up to date on logic and AI
developments. Read, Learn, Improve!

## List of definitions

There need to be done some technical things to make this useful on the website, I curious how to do it. 

### Logic
### Inference
### Indicators
### Premise
### Conclusion
### Validity
### Syntax
### Semantics
### Proof theory
### Formal language
### Logical formulas
### Formal models
### Logical laws
### Formal derivations
### Classical logic
### Intuitionistic Logic
### Paracomplete and paraconsistent logics
### AI
### Metalogic
### (First) incompleteness theorem
### Undecidability theorem
### Symbolic AI
### Subsymbolic AI
### If-then rules
### Machine learning
### Knowledge Representation and Reasoning
### Large language models
### System 1 thinking
### System 2 thinking

**Notes:**

[^inference]: Another common term for the same concept is "argument". 

[^conclusion]: Also sometimes called "consequence".

[^valid]: We'll also sometimes say "correct", but never "true".

[^fallacies]: You'll learn some more names for fallacies in this book, but just
as a curiosity.

[^logic]: You'll have a much better idea at the end of this book.

[^propositional]: This important system will be a recurring topic throughout the
course.

[^bivalence]: Why is this a simplifying assumption?

[^history]: The history of symbolic AI is an intriguing but complex topic. We
don't have the space here to get into it too much. Check out some of the
suggestions in the [references](#further-readings).

[^implementation]: Don't worry too much about how knowledge bases and
inference engines are implemented for now. You'll learn this in other courses
later.

[^XAI]: This is, of course, a problem for XAI, as many scandals, like the [Dutch
childcare benefits
scandal](https://en.wikipedia.org/wiki/Dutch_childcare_benefits_scandal) have
shown.
