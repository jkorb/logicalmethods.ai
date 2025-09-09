---
title: Logic and AI
author: Johannes Korbmacher
weight: 10
locked: false
resources:
  - src: img/inferences.png
    name: inferences
params: 
  date: 31/08/2024        
  last_edited: 09/05/2025 
  id: txt-laa
  math: true
---

# Logic and AI

Logic and AI are intimately connected. In this chapter you'll learn how.

At the end of the chapter, you'll be able to:

- define logic and artificial intelligence as scientific disciplines, 
- explain the three main ways in which the two disciplines are related, and 
- give some examples of uses of logical methods in AI and distinguish them from
  non-logical methods.

By the way, meet {{< logo >}}&nbsp; (read: "for all I")!

{{< img src="img/ai_welcome.png" class="rounded mx-auto d-block inert-img img-fluid" width="200px">}}

It is our friendly course mascot, and will feature in many of the examples and
exercises.

## What is AI?

The term "artificial intelligence" (AI) is used in different ways. Sometimes we
mean by it intelligence which is artificial. That is, we think of AI as an
ability that computational systems (≈computers) can have or not. This is, for
example, how [Wikipedia](https://en.wikipedia.org/wiki/Artificial_intelligence)
defines AI in the first place (read the first sentence of the article). In this
sense of the term we can ask, for example, whether "true" AI is possible.

Sometimes, by AI we mean a specific technology or set of technologies. In recent
societal discourse especially, "artificial intelligence" has become virtually
synonymous with [generative
AI](https://en.wikipedia.org/wiki/Generative_artificial_intelligence) (GenAI)
and its various applications. This is the sense of AI in which
[ChatGPT](https://en.wikipedia.org/wiki/ChatGPT),
[Copilot](https://en.wikipedia.org/wiki/Microsoft_Copilot),
[Gemini](https://en.wikipedia.org/wiki/Gemini_(chatbot)),
[Claude](https://en.wikipedia.org/wiki/Claude_(language_model)),
[Grok](https://en.wikipedia.org/wiki/Grok_(chatbot)),
[Llama](https://en.wikipedia.org/wiki/Llama_(language_model)) and
[DeepSeek](https://en.wikipedia.org/wiki/DeepSeek_(chatbot)) are AIs. In this
sense of the term, AI is not only possible but real: these technologies exist
(obviously)!

{{< img src="img/ai_is.png" class="rounded mx-auto d-block inert-img img-fluid" width="200px">}}

There is also a sense of AI as
[AI-engineering](https://en.wikipedia.org/wiki/Artificial_intelligence_engineering),
which is concerned with the practical details of designing, optimizing, and
realizing AI technologies. This is the sense of AI when somebody says that they
"work in AI".

In yet another sense of the word, AI is a *scientific discipline*. It is not
easy to define this discipline in simple terms—when you think about it, most
scientific disciplines are actually quite hard to define—but as a first shot we
can say that AI aims to understand, artificially replicate, and possibly improve
intelligent behavior. 

AI in this sense is a rather multifaceted discipline. Clearly, [computer
science](https://en.wikipedia.org/wiki/Computer_science) plays an important role
in AI as it studies computation and automation and the main (and perhaps only?)
method for artificially replicating intelligent behavior is by automated,
computational models—i.e. computer programs.

But AI is not only computer science. Understanding intelligent behavior is also
a core objective of [psychology](https://en.wikipedia.org/wiki/Psychology).
Thinking about what it means to have (artificial) intelligence (in the
capability sense of the word), whether it's possible to have true artificial
intelligence, and so on are important questions in
[philosophy](https://en.wikipedia.org/wiki/Philosophy), especially the
[philosophy of mind](https://en.wikipedia.org/wiki/Philosophy_of_mind).

The special role of language for thought—illustrated, for example, by Fodor's
[language of thought
hypothesis](https://en.wikipedia.org/wiki/Language_of_thought_hypothesis) —shows
that also [linguistics](https://en.wikipedia.org/wiki/Linguistics) plays a role
in AI.—In short, AI is highly *interdisciplinary* field of study.

All of these senses of AI will play a role in this course. For example, we'll
look at the role that logic plays in intelligent behavior, the role of logic in
AI technologies, and the relationship between logic as a discipline and AI.

## What is logic?

So, what is logic, then? Well, as a discipline, logic is the study of _valid
reasoning_. Let's talk about what that means.

The basic concept of logic is that of an _inference_ (sometimes "argument"),
which is a simple piece of reasoning like the following:

+ All humans are mortal and Socrates is human. So, Socrates is mortal.

+ All swans we've observed so far were white. Therefore, all swans are white.

You've almost certainly come across these examples if you had any contact with
philosophy or argumentation theory or the like.

To talk about logic and validity, it's helpful to introduce some technical
terminology. In an inference:

- The **conclusion** (sometimes "consequence") is what's being inferred. 
- The **premises** are the assumptions or hypotheses that the conclusion is
based on.

So, in the first inference, all humans being mortal and Socrates being human are
the premises, and Socrates being mortal is the conclusion. In the second
inference, all swans observed so far being white is the premise, and all swans
being white is the conclusion.

Typically, there are some linguistic hints that allow you to identify premises
and conclusions. Phrases like "so" and "therefore" are **inference indicators**.
The conclusion typically follows them, though it can be the other way around.
Take the inference indicator "since", for example, and look at how we use it in
the following inference:

- The ground is wet since it's raining and if it's raining, the ground
is wet.

Similarly, the premises typically precede any inference indicators, but as in
our example can also come after. There are also **premise indicators**, like the
"given that" in the following mathematical inference:

- Given that this figure is a triangle and the sum of all angles in a triangle
is 180°, we can conclude that the sum of all angles in this figure is 180°.

By the way, here "we can conclude that" is the conclusion indicator.

Once we've identified the logical structure of an inference, we often represent
it in a visually clear way. For example, {{< logo >}}&nbsp; uses the so-called
**inference line** to indicate the inferential structure here:

{{< img src="img/ai_inference.png" class="rounded mx-auto d-block inert-img img-fluid" width="200px">}}

There are many different notations. For example, in mathematics, we often use
the turnstile $\vdash$ to indicate a (valid) inference and commas to separate
the premises, like so:
{{< img src="img/there_is_turnstile.png" class="rounded mx-auto d-block inert-img img-fluid" width="500px">}}

The robot cat next to the inference is {{< there_is >}}&nbsp; (read: "there is"), which
is {{< logo >}}'s pet.

With an inference comes the expectation that the premises _support_ the
conclusion, that the conclusion _follows from_ the premises. An inference where
this is the case is a **valid** inference. 

The first inference—the one about Socrates' mortality—looks pretty solid. If all
humans are mortal and Socrates is human, then he _must_ be mortal. In logic, we
call an inference like that, where the premises _necessitate_ the conclusion,
**deductively valid**. Deductive inferences are the traditional topic of most
logical theory. They are often associated with mathematical reasoning.

But what about the second inference—the one about the swans. Even if all the
swans we've observed were white, it's certainly possible that there's a
non-white (robot?) swan—just that we haven't seen it yet. {{< img src="img/robot_swan.png" class="rounded  float-start inert-img img-fluid" width="150px">}}
So, the inference from all previously observed swans being white to all swans
being white is *not* deductively valid—it is deductively *in*valid. 

But isn't there a sense in which the fact that all the swans we've observed were
white *does* support the claim that all swans are white? Now, we know that there
are black swans, so let's take slightly modified inference. Suppose that there
are a hundred marbles in this bowl. We can't see inside the bowl and we can only
take the marbles out one by one. We keep taking out marbles and they are all
white. We've sampled the marbles randomly, we've taken them from the bottom of
the bag, from the top, and so on. They're always white. 

After some time of sampling—but before we've sampled them all—it would seem
reasonable to conclude that _all_ marbles are white. {{< img
src="img/ai_induction.png" class="rounded  float-end inert-img img-fluid" width="150px">}}
It might be debatable when exactly this point is—after 50, 70, 80 white
marbles—but it seems rather clear that at some point, we can reasonably conclude
that all marbles are white. Not with certainty—a black marble might still be in
there somewhere—but with reasonable _confidence_.

The point is that for some number of marbles, for argument's sake let's say 70,
the fact that we've samples 70 white marbles together with the assumption that
we've sampled well (to avoid [selection
bias](https://en.wikipedia.org/wiki/Selection_bias) and the like), supports the
conclusion that all marbles are white by making it _more likely_. An inference
like this—where the premises make the conclusion more likely—is called an
**inductively strong** inference. In this context, the strength of the inference
is determined by _how much_ more likely the conclusion is given the premises:
the inference from 90 white marbles is stronger than the one from 70 white
marbles.

So, this is, in essence, what logicians study: different notions of "good"
inference, ways in which the premises can support a conclusion. We've already
seen a kind of classification emerging, which we'll study in more detail in {{<
chapter_ref chapter="valid-inference" id="valid-inference">}} Chapter 3. Valid
inference{{< /chapter_ref >}}:

{{< img src="img/classification.png" class="rounded mx-auto mb-2 d-block inert-img img-fluid" width="500px">}}

Note that logicians *don't* (qua logicians) study how people actually reason
(psychology of reasoning), or how to use arguments to convince others
(rhetoric), or things of that sort. These are all good to know, of course, but
they are not the main interest of logicians.

Just like with the term "artificial intelligence", the term "logic" is used with
different meanings. What we've looked at so far is the academic *discipline* of
logic (and we'll soon be looking at its relation to AI). In this context, we
might say that an inference is "logical" and mean that it's valid (or
inductively strong). This is in contrast saying something like "it's logical
that I was scared", which means something like "it's *understandable* that I was
scared".

## Logical systems

There's also a common way of speaking of "someone's logic", as in "according to
your logic, we should go home". This points to an important aspect of logical
theory, which we'll need to talk about before we can move to the relationship
between logic and AI: the existence of different logical _systems_. 

What we mean when we say that "according to your logic we should do the thing"
is something like "according to the system of premises and inferences you
accept, we should do the thing". It turns out that this sense of logic, we also
find in logical theory.

Logicians approach the study of valid inference the way most scientists approach
their subject matter: using [mathematical
models](https://en.wikipedia.org/wiki/Mathematical_model). We call the models
that logicians use to study valid inference **_logical systems_**.

A logical system typically has three components:

+ a **syntax**, which is a model of the _language_ of the inferences,
+ a **semantics**, which is model of the _meaning_ of the premises and
conclusions, 
+ and a **proof theory**, which is a model of _stepwise inference_.

Together, these three components provide a mathematical model of valid
inference. Throughout the course, you'll learn more about syntax, semantics, and
proof theory by studying how they are used in different AI applications. By the
end, you'll have a good idea of what the different components of logical systems
do, and how they work together to provide a comprehensive model of valid
inference.

In essence, logical systems are not all that different from the mathematical
models used by physicists, for example. To illustrate, think about how a
physicist would approach the question of how far {{< logo >}}&nbsp;
can throw its ball: 

{{< img src="img/reality.png" class="rounded mx-auto mb-2 d-block inert-img img-fluid" width="500px">}}

The physicist might use [Newtonian
mechanics](https://en.wikipedia.org/wiki/Classical_mechanics) to predict how far
the ball will fly, but they wouldn't apply the laws of mechanics _directly_ to
the real world. First, they'd build a mathematical model of the situation, which
looks something like this: 

{{< img src="img/model.png" class="rounded mx-auto mb-2 d-block inert-img img-fluid" width="500px">}}


In this model, the physicist would assign a mass to the ball, represents the
ball as a point in 2-dimensional [Euclidian
space](https://en.wikipedia.org/wiki/Euclidean_space), and treats the forces
acting on the ball as [vectors](https://en.wikipedia.org/wiki/Euclidean_vector).
Assuming that there's no air resistance, it's a high-school level exercise to
calculate where the ball will land using the laws of classical mechanics (can
you still do it?). 

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
and has lead to rich body of logical knowledge.

One last thing to note about logical systems is that there are _many_ of them.
In this course, you'll learn about a wide range of logical systems and how they
are used in AI. So, there's what we might call **logical diversity**!

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

As you'll see different systems are useful in different contexts. {{< img src="img/mouse.png" class="rounded  float-end inert-img img-fluid" width="50px">}}


## Logic and AI

Logic plays a special role in AI since its inception as an academic discipline
in the second half of the 20th century. One event that is often mentioned as a
"beginning" of AI is the 1956 [Dartmouth Summer Research Project on Artificial
Intelligence](https://en.wikipedia.org/wiki/Dartmouth_workshop), which was
organized by [Claude Shannon](https://en.wikipedia.org/wiki/Claude_Shannon),
[John
McCarthy](https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)),
[Nathaniel
Rochester](https://en.wikipedia.org/wiki/Nathaniel_Rochester_(computer_scientist)),
and [Marvin Minsky](https://en.wikipedia.org/wiki/Marvin_Minsky) and who are
therefore considered by some the "founding fathers". The research proposal
contains for the event one of the first documented uses of the term "artificial
intelligence" to refer to an academic discipline. 

The naming of the discipline is typically attributed to McCarthy, who thought
that logic is the path to achieving human-level artificial intelligence (in the
ability sense of the term). But we don't need to think about *human*-level
intelligence to understand the relevance of logic to AI research. An insight
typically attributed to Claude Shannon in [his master's
thesis](https://en.wikipedia.org/wiki/A_Symbolic_Analysis_of_Relay_and_Switching_Circuits)
is that we can think of the behavior of electrical circuits (specifically
[relays](https://en.wikipedia.org/wiki/Relay)) in logical terms. 

To illustrate the idea, take this simple circuit with two switches, A and B:

{{< img src="img/shannon_circuit.png" class="rounded mx-auto mb-2 d-block inert-img img-fluid" width="500px">}}

If—and *only if*—both A and B are flipped, the light turns on. Shannon realized
that this is effectively the operation of [logical
conjunction](https://en.wikipedia.org/wiki/Logical_conjunction) from [Boolean
logic](https://en.wikipedia.org/wiki/Boolean_algebra): Think of a switch being
flipped "on" as 1 and it being switched "off" as 0. Similarly, take the light
turning "on" to be 1 and it being "off" as 0. Then the behavior of the circuit
is to return 1 just in case both A and B are 1 and 0 otherwise—which is just the
operation of logical conjunction from Boolean logic.

This relates logic to circuits, but what does this have to do with AI? One way
of making the connection is to widen our understanding of "intelligent behavior"
from human intelligence to something that allows us to think of a circuit like
the one above as a reasoning, intelligent agent. The idea is that we can
reconstruct the behavior of the circuit as an inference from two statements—A
and B, which we take to mean that the respective switches are "on"—to an action
being carried out—turning on the light, which we can think of as yet another
statement, L. So the circuit *in a sense* performs an inference: it infers L
from both A and B.

Widening our understanding of intelligence like this allows us to study the
behavior of sliding doors, AC systems, self-driving cars, and much more as AI
systems using logic. This is a very powerful idea.

The thought that logic is the path to achieving human-level artificial
intelligence is the paradigm of **logic-based AI**, which was the dominant
paradigm for AI research from the 1950 until at least the late 1980s. Around
this time, probability theory and statistics slowly started to take over as the
main approach to the problems of AI, putting the focus on ideas like [machine
learning](https://en.wikipedia.org/wiki/Machine_learning) and [big
data](https://en.wikipedia.org/wiki/Big_data).

The success of this approach is not in small part due to [artificial neural
networks (ANNs)](https://en.wikipedia.org/wiki/Neural_network), which are,
effectively, statistical models of data, obtained through machine learning on an
architecture that is inspired by the structure of the human brain. {{< img
src="img/ai_ann.png" class="rounded  float-end inert-img img-fluid"
width="150px">}} Today, **statistics-based AI** using ANNs is, by far, the
dominant paradigm in AI research. This is the approach that led to the recent
developments in GenAI.

The full story of this shift is nuanced and complicated, but looking at it from
a certain angle can help us understand the role of logic in AI—both in the past
and in the future. We'll do this by looking at three different roles that logic
plays in AI research.

### As a foundation

The first way in which logic is relevant to AI is the most direct one: valid
inference simply _is_ paradigmatic intelligent behavior. So, logical systems
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

+ _If_ the patient has a runny nose, a sore throat, and a mild fever, _then_ the
patient likely has the common cold.

If we present the system with the known fact that our patient does have a runny
nose, a sore throat, and a mild fever, the inference engine could easily derive
that the patient likely has a common cold. If some symptom is missing, say the
patient doesn't have a fever, the engine can no longer validly infer that the
patient has a cold---it could be something else.

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

Success stories like this have lead to the rise of what's known as **subsymbolic
AI**, which many take to be the predominant approach to AI today. Subsymbolic AI
prefers conditional probabilities and inductive inference over if-then rules and
deductive inference, and it prefers statistical models generated from big data
over knowledge bases generated by experts. As a consequence, the information
stored in a subsymbolic AI system, especially when it comes in the form of a
neural network, is often _opaque_ and hard for humans to understand.[^XAI] The
systems seem to operate on a "lower level", much like the neurons in the brain
are on a "lower level" as compared to our thoughts and ideas---whence the name
_subsymbolic AI_.

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

Finally, there's **recent research**. The last years have seen the meteoric rise
of GenAI systems, and especially [**large language models
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
textbook. It might be advisable—though is by no means necessary—to consult one
of each from time to time. I recommend:

+ [Halbach. 2010. _The Logic Manual_. Oxford University Press.](https://global.oup.com/ushe/product/the-logic-manual-9780199587841?cc=us&lang=en&) 

+ [Russel and Norvig. 2021. Artificial Intelligence: A Modern Approach. 4th
Edition. Pearson](https://elibrary.pearson.de/book/99.150005/9781292401171).

In general, I recommend to use the internet to keep up to date on logic and AI
developments. Read, Learn, Improve!

**Notes:**

[^bivalence]: Why is this a simplifying assumption?

[^history]: The history of symbolic AI is an intriguing but complex topic. We
don't have the space here to get into it too much. Check out some of the
suggestions in the [references](#further-readings).

[^XAI]: This is, of course, a problem for XAI, as many scandals, like the [Dutch
childcare benefits
scandal](https://en.wikipedia.org/wiki/Dutch_childcare_benefits_scandal) have
shown.
