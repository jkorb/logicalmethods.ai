---
title: Logic and AI
author: Johannes Korbmacher
weight: 10
locked: false
params: 
  date: 31/08/2024        
  last_edited: 09/05/2025 
  id: txt-laa
---

# Logic and AI

Logic and AI are intimately connected. In this chapter you'll learn how.

{{< callout type="objectives" >}}
- Define logic and artificial intelligence as scientific disciplines.
- Describe how logical systems model valid inference.
- Explain the three main roles of logic in AI, using examples.
- Compare logic-based and statistics-based approaches to AI.
- Explain how logical tools help check AI-generated reasoning.
{{< /callout >}}

By the way, meet $∀I$ (read: "AI" --- The symbol $∀$ is the so-called _universal quantifier_, which reads "for all". You'll learn about it soon enough 😃)!

{{< img src="/img/drawings/la_ai_welcome.svg" class="rounded mx-auto d-block inert-img img-fluid" width="200px">}}

It is our course mascot, and will feature in many of the examples and
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

There is also a sense of AI as
[AI-engineering](https://en.wikipedia.org/wiki/Artificial_intelligence_engineering),
which is concerned with the practical details of designing, optimizing, and
realizing AI technologies. This is the sense of AI when somebody says that they
"work in AI".

In yet another sense of the word, AI is a *scientific discipline*. It is not
easy to define this discipline in simple terms—when you think about it, most
scientific disciplines are actually quite hard to define—but as a first shot we
can say the following:

{{< callout type="definition" title="Artificial intelligence (discipline)" >}}
_Artificial intelligence (AI)_ is the discipline that aims to understand, artificially replicate, and
possibly improve intelligent behavior. 
{{< /callout >}}

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
hypothesis](https://en.wikipedia.org/wiki/Language_of_thought_hypothesis)—shows
that also [linguistics](https://en.wikipedia.org/wiki/Linguistics) plays a role
in AI.—In short, AI is a highly *interdisciplinary* field of study.

All of these senses of AI will play a role in this course. For example, we'll
look at the role that logic plays in intelligent behavior, the role of logic in
AI technologies, and the relationship between logic as a discipline and AI.

## What is logic?

So, what is logic, then? Here is the standard definition:
{{< callout type="definition" title="Logic (discipline)" >}}
{{< term "logic" "Logic" >}} is the discipline that aims to define and understand valid inference.
{{< /callout >}}
Let's talk about what that means.

The basic concept of logic is that of an _{{< term "inference" "inference" >}}_ (sometimes: "argument"),
which is a simple piece of reasoning like the following:

+ All humans are mortal and Socrates is human. So, Socrates is mortal.

+ All swans we've observed so far were white. Therefore, all swans are white.

You've almost certainly come across these examples if you had any contact with
philosophy or argumentation theory or the like.

To talk about logic and validity, it's helpful to introduce some technical
terminology. In an inference:

- The **{{< term "conclusion" "conclusion" >}}** (sometimes "consequence") is what's being inferred. 
- The **{{< term "premise" "premises" >}}** are the assumptions or hypotheses that the conclusion is
based on.

So, in the first inference, all humans being mortal and Socrates being human are
the premises, and Socrates being mortal is the conclusion. In the second
inference, all swans observed so far being white is the premise, and all swans
being white is the conclusion.

Typically, there are some linguistic hints that allow you to identify premises
and conclusions. Phrases like "so" and "therefore" are **{{< term "inference-indicator" "inference indicators" >}}**.
The conclusion typically follows them, though it can be the other way around.
Take the inference indicator "since", for example, and look at how we use it in
the following inference:

- The ground is wet since it's raining and if it's raining, the ground
is wet.

Similarly, the premises typically precede any inference indicators, but as in
our example can also come after. There are also **{{< term "premise-indicator" "premise indicators" >}}**, like the
"given that" in the following mathematical inference:

- Given that this figure is a triangle and the sum of all angles in a triangle
is 180°, we can conclude that the sum of all angles in this figure is 180°.

By the way, here "we can conclude that" is the {{< term "conclusion-indicator" "conclusion indicator" >}}.

Once we've identified the logical structure of an inference, we often represent
it in a visually clear way. For example, $∀I$ uses the so-called
**{{< term "inference-line" "inference line" >}}** to indicate the inferential structure here:

{{< img src="/img/drawings/la_ai_inference.svg" class="rounded mx-auto d-block inert-img img-fluid" width="600px">}}

There are many different notations. For example, in mathematics, we often use
three dots $∴$ (read: "therefore") to indicate that an inference takes place,
and we use commas to separate the premises, like so:


$$All humans are mortal, Socrates is human ∴ Socrates is mortal$$

With an inference comes the expectation that the premises _support_ the
conclusion, that the conclusion _follows from_ the premises. An inference where
this is the case is a **{{< term "validity" "valid" >}}** inference. 

The first inference—the one about Socrates' mortality—looks pretty solid. If
all humans are mortal and Socrates is human, then he _must_ be mortal. In
logic, we call an inference like that, where the premises _necessitate_ the
conclusion, **{{< term "deductive-validity" "deductively valid" >}}**.
Deductive inferences are the traditional topic of most logical theory. They are
often associated with mathematical reasoning.

But what about the second inference—the one about the swans? Even if all the
swans we've observed were white, it's certainly possible that there's a
non-white (robot?) swan—just that we haven't seen it yet. 
{{< img src="/img/drawings/la_robot_swan.svg" class="rounded  float-start inert-img img-fluid" width="350px">}}
So, the inference from all previously observed swans being white to all swans
being white is *not* deductively valid—it is deductively *in*valid. 

But isn't there a sense in which the fact that all the swans we've observed were
white *does* support the claim that all swans are white? We know that there
are black swans, so let's take a slightly modified inference. Suppose that there
are a hundred marbles in some bowl. We can't see inside the bowl and we can only
take the marbles out one by one. We keep taking out marbles and they are all
white. We've sampled the marbles randomly, we've taken them from the bottom of
the bowl, from the top, and so on. They're always white.

{{< img src="/img/drawings/la_ai_induction.svg" class="rounded float-end inert-img img-fluid" width="350px">}}
After some time of sampling—but before we've sampled them all—it would seem
reasonable to conclude that *all* marbles are white. Not with certainty—a black
marble might still be in there somewhere—but with reasonable *confidence*.

Of course, whether this is reasonable depends on what else we know. If someone
told us that they'd hidden a black marble in the bowl, we shouldn't draw that
conclusion, however many white marbles we found. But under suitable
circumstances, observing enough white marbles can give us sufficiently strong
reasons to accept that they're all white.

Unlike deductive validity, {{< term "inductive-support" "inductive support" >}} comes in degrees. An inference can
be **{{< term "inductive-strength" "stronger" >}}** or **weaker**, depending on how much support the premises give
the conclusion. In our example, finding 90 white marbles would generally give
us stronger reasons to conclude that they're all white than finding just 10,
assuming we've sampled in the same way and our background information stays
the same.

The inference is still deductively invalid: the premises could be true while
the conclusion is false. But it can be **{{< term "inductive-validity-in-context" "inductively valid" >}}**: the premises
support the conclusion strongly enough to justify accepting it, even though
they don't make it certain.

This is, in essence, what logicians study: different notions of "good"
inference, ways in which the premises can support a conclusion. We've already
seen a kind of classification emerging, which we'll study in more detail:

{{< img src="/img/drawings/la_classification.svg" class="rounded mx-auto mb-2 d-block inert-img img-fluid" width="700px">}}

Note that logicians (qua logicians)  *don't* study how people actually reason
(psychology of reasoning), or how to use arguments to convince others
(rhetoric), or things of that sort. These are all good to know, of course, but
they are not the main interest of logicians.

### Logical systems

Just like with the term "artificial intelligence", the term "logic" is used
with different meanings. What we've looked at so far is the academic
*discipline* of logic. In this context, we might say that an inference is
"logical" and mean that it's valid (or inductively strong). This is in contrast to
saying something like "it's logical that I was scared", which means something
like "it's *understandable* that I was scared".

But there's also a common way of speaking of "someone's logic", as in "according to
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
that logicians use to study valid inference **_{{< term "logical-system" "logical systems" >}}_**.

A logical system typically has three components:

+ a {{< term "syntax" "syntax" >}}, which is a model of the _language_ of the inferences,
+ a {{< term "semantics" "semantics" >}}, which is a model of the _meaning_ of the premises and
conclusions, 
+ and a **{{< term "proof-theory" "proof theory" >}}**, which is a model of _stepwise inference_.

Together, these three components provide a mathematical model of valid
inference. Throughout the course, you'll learn more about syntax, semantics, and
proof theory by studying how they are used in different AI applications. By the
end, you'll have a good idea of what the different components of logical systems
do, and how they work together to provide a comprehensive model of valid
inference.

In essence, logical systems are not all that different from the mathematical
models used by physicists, for example. To illustrate, think about how a
physicist would approach the question of how far $∀I$ can throw its ball:

{{< img src="/img/drawings/la_reality.svg" class="rounded mx-auto mb-2 d-block inert-img img-fluid" width="500px">}}

The physicist might use [Newtonian
mechanics](https://en.wikipedia.org/wiki/Classical_mechanics) to predict how far
the ball will fly, but they wouldn't apply the laws of mechanics _directly_ to
the real world. First, they'd build a mathematical model of the situation, which
looks something like this: 

{{< img src="/img/drawings/la_model.svg" class="rounded mx-auto mb-2 d-block inert-img img-fluid" width="500px">}}

In this model, the physicist would assign a mass to the ball, represent the
ball as a point in 2-dimensional [Euclidean
space](https://en.wikipedia.org/wiki/Euclidean_space), and treat the forces
acting on the ball as [vectors](https://en.wikipedia.org/wiki/Euclidean_vector).
Assuming that there's no air resistance, it's a high-school level exercise to
calculate where the ball will land using the laws of classical mechanics (can
you still do it?). 

What's characteristic of mathematical models is that they 
_{{< term "abstraction" "abstract away" >}}_ from
irrelevant features of reality (ignoring the trees, for example), they
_{{< term "idealization" "idealize" >}}_ the situation (by treating the ball as
a point-mass, for example), and they introduce _simplifying assumptions_ (such
as no air resistance, for example). Ultimately, this is what makes it possible
to apply exact mathematical calculations to a real-world scenario like ours.

Throughout the books, we'll be dealing with different kinds of models, which
always involve abstractions, idealizations, and other modeling assumptions.
We'll try to be as explicit as possible about these assumptions, since a lot
depends on them in terms of the conclusions we can draw from results obtained
with those models.

Logical systems work in just the same way as our physicist's model:
they involve abstractions, idealizations, and simplifying assumptions in order
to allow us to make exact mathematical calculations about valid inference:

+ Syntax introduces the ideas of a 
{{< term "formal-language" "formal language" >}} and of 
**{{< term "formula" "logical formulas" >}}**, which are abstract representations of the logically relevant
structure of premises and conclusions. This is roughly analogous to the way the
physicist represents the ball as a point-mass in a coordinate system, and the forces acting on the ball as vectors, etc.

+ Semantics introduces the idea of **{{< term "model" "formal models" >}}**, 
which are representations of meaning, spelled out in the context of formal
languages. These models allow us to study 
**{{< term "logical-law" "logical laws" >}}**,
which are roughly analogous to the laws of mechanics, such as: 

  {{< excalifont display=true >}}F = m x a{{< /excalifont >}}

  Interestingly, formal models often involve
  simplifying assumptions, such as that every sentence has a determinate
  {{< term "truth-value" "truth-value" >}} from either true or false.[^bivalence]

+ Finally, proof theory introduces the idea of **{{< term "proof" "formal derivations" >}}**, which are
a model of stepwise valid inference. Just like the physical model calculates
where the ball will land using the laws of mechanics, these derivations
calculate valid inferences from the basic laws of logic.

Developing and studying logical systems is the core business of logical theory
and has led to a rich body of logical knowledge.

One last thing to note about logical systems is that there are _many_ of them.
In this course, you'll learn about a wide range of logical systems and how they
are used in AI. So, there's what we might call **logical diversity**!

There are different ways of classifying logical systems, but let's just
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
{{< img src="/img/drawings/gimmick_mouse.svg" class="rounded  float-end inert-img img-fluid" width="50px">}}

## Logic and AI

Logic has played a special role in AI since its inception as an academic
discipline in the second half of the 20th century. One event that is often
mentioned as a "beginning" of AI is the 1956 [Dartmouth Summer Research Project
on Artificial Intelligence](https://en.wikipedia.org/wiki/Dartmouth_workshop),
which was organized by [Claude
Shannon](https://en.wikipedia.org/wiki/Claude_Shannon), [John
McCarthy](https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)),
[Nathaniel
Rochester](https://en.wikipedia.org/wiki/Nathaniel_Rochester_(computer_scientist)),
and [Marvin Minsky](https://en.wikipedia.org/wiki/Marvin_Minsky) who are
therefore considered by some the "founding fathers". The research proposal for
the event contains one of the first documented uses of the term "artificial
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

{{< img src="/img/drawings/la_shannon_circuit.svg" class="rounded mx-auto mb-2 d-block inert-img img-fluid" width="500px">}}

If—and *only if*—both A and B are flipped, the light turns on. Shannon realized
that this is effectively the operation of [logical
conjunction](https://en.wikipedia.org/wiki/Logical_conjunction) from [Boolean
logic](https://en.wikipedia.org/wiki/Boolean_algebra): Think of a switch being
flipped "on" as 1 and it being switched "off" as 0. Similarly, take the light
turning "on" to be 1 and it being "off" as 0. Then the behavior of the circuit
is to return 1 just in case both A and B are 1 and 0 otherwise—which is just the
operation of logical conjunction from Boolean logic. We'll study Boolean logic
in detail later, but the idea is that a logical conjunction is true---value
$1$---just in case both conjuncts are true, and false otherwise. Under the
interpretation sketched here, this is precisely the behavior of our circuit!

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
paradigm for AI research from the 1950s until at least the late 1980s. Around
that time, probability theory and statistics slowly started to take over as the
main approach to the problems of AI, putting the focus on ideas like [machine
learning](https://en.wikipedia.org/wiki/Machine_learning) and [big
data](https://en.wikipedia.org/wiki/Big_data).

The success of this approach is not in small part due to [artificial neural
networks (ANNs)](https://en.wikipedia.org/wiki/Neural_network), which are,
effectively, statistical models of data, obtained through machine learning on an
architecture that is inspired by the structure of the human brain. {{< img
src="/img/drawings/la_ai_ann.svg" class="rounded  float-end inert-img img-fluid"
width="250px">}} Today, **statistics-based AI** is, by far, the dominant paradigm in
AI research. This is the approach that led to the recent developments in {{<
abbr title="generative AI" >}}GenAI{{< /abbr >}}.

To understand this shift, it's helpful to look at the various ways in which
logic and AI are related. On a very general level, we can distinguish three ways
in which logic is relevant for AI research: there is a _foundational_,
_methodological_, and _auxiliary_ entanglement between logic and AI research. As
we'll see, even though logic-based AI is no longer an important paradigm in AI
research, there are still many different ways in which logic is an important
framework for many fundamental tasks in AI research---and that's not likely to
change.

### Foundational

Valid inference simply _is_ paradigmatic intelligent behavior. So, logical
systems directly target what we're trying to model in AI—logical systems are
models of intelligent behavior. So, by our definition, logical systems are part
of AI. This makes logic part of AI and the results of logical research _qua_
logical research relevant to AI research.

{{< img src="/img/drawings/la_logic_math.svg" class="rounded  float-start inert-img img-fluid m-3" width="400px">}}
The relevance of logic in this sense is mainly
**foundational**, meaning that logic contributes to the understanding of (one
of) the basic concepts of AI. A part of logical theory that's particularly
relevant here is [**metalogic**](https://en.wikipedia.org/wiki/Metalogic), which
deals with the limits and possibilities of logical systems _in principle_.
What's particularly interesting about this is that metalogical research is, more
or less, research in _pure mathematics_, which turns out to be highly relevant
to practical questions in AI research.

Here are two famous metalogical results that (some) people think are highly
relevant to AI research:

+ Gödel's [**(first) incompleteness
theorem**](https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems),
in its Gödel–Rosser form, which implies that for every 
{{< term "consistency" "consistent" >}}, 
{{< term "effective-axiomatization" "effectively axiomatized" >}} 
theory strong enough to represent elementary arithmetic, there is a
mathematical statement that is 
_{{< term "undecidable-statement" "undecidable" >}}_ in the system, meaning
that the statement can neither be proven nor refuted in that system.

  Many researchers, including Gödel himself, have thought that this has deep
  implications for AI. The arguments here are rather subtle and without going
  into the very technical details of Gödel's result it is _very_ easy to make
  mistakes, but a _very_ rough version of the argument runs as follows:

  _Since the human mind is consistent and capable of mathematical reasoning, but
  there is no in principle undecidable mathematical fact for the human mind,
  Gödel's result shows that the human mind cannot be modeled or replicated by a
  logical system._

  If this is correct, it dooms a wide range of approaches to AI, including 
  the logic-based approaches we mentioned before.

+ Church and Turing's [**undecidability
theorem**](https://en.wikipedia.org/wiki/Halting_problem), which entails that
validity in the standard system of predicate logic is 
_{{< term "algorithmic-undecidability" "(algorithmically) undecidable" >}}_,
meaning that  there is no {{< term "algorithm" "algorithm" >}} and there can
never be an algorithm that correctly determines in finitely many steps whether
any given inference in the system of predicate logic is valid. 

    This result seems to show directly that we cannot "fully automate" validity
    checking using AI and maintain absolute reliability at the same time.

The relevance of logic to AI in this sense is hard to deny. At the same time, a
young engineer setting out to change the world with AI, _might_ think of logic
in this sense as _just theory_ with little practical relevance. But it's
important to keep in mind that it is essential to understand the foundations of
your field _before_ embarking on ground breaking research. Otherwise, one runs
the risk of fundamental mistakes, misunderstandings, or simply hitting the
limits of what's in principle possible---which would be a huge waste of effort.

### Methodological

Historically, perhaps the most lasting influence that logic has had on the
development of AI is via the logic-based AI paradigm, which is also known as
**symbolic AI** due to its use of transparent, human-readable methods.

The idea that logic is the path to achieving human-level artificial intelligence
has led to the development of many important technologies, both as abstract
designs and as concrete technologies, such as the
[LISP](https://en.wikipedia.org/wiki/Lisp_(programming_language)) programming
language.

The technologies which have had arguably the most influence within AI to come
from the logic-based paradigm are the so-called [**expert
systems**](https://en.wikipedia.org/wiki/Expert_system), which are computer
systems designed to behave like human experts at certain reasoning or decision
making tasks. Historical examples include
[Mycin](https://en.wikipedia.org/wiki/Mycin), a research system for medical
diagnosis, and [XCon](https://en.wikipedia.org/wiki/Xcon), which configured DEC
VAX computer systems. Today, this task roughly corresponds to picking the right
components for your new gaming PC build.

{{< img src="/img/drawings/la_expert_system.svg" class="rounded  float-start inert-img img-fluid mx-4" width="550px">}}
An expert system (typically) has two components: 

+ a _{{< term "knowledge-base" "knowledge base (KB)" >}}_, which stores the expert information and known facts,
and 

+ an _{{< term "inference-engine" "inference engine (IE)" >}}_, which derives new information/decisions from input
  using the {{< abbr title="knowledge base" >}}KB{{< /abbr >}} and valid inference.

Typically, the information in the {{< abbr title="knowledge base" >}}KB{{< /abbr >}} takes the form of **{{< term "conditional" "if-then rules" >}}**.
For a toy example, suppose we put the following diagnostic rule into our
expert system. We stipulate the rule for the example; it is not a medical claim:

$$
<strong>If</strong> the patient has a runny nose, a sore throat, and a mild fever,<br>  
 &nbsp;&nbsp;<strong>then</strong> the patient likely has a common cold. 
$$

If we present the system with the known fact that our patient does have a runny
nose, a sore throat, and a mild fever, the inference engine could easily derive
that the patient likely has a common cold. If some symptom is missing, say the
patient doesn't have a fever, this rule no longer supplies that prediction.
That doesn't establish that the patient has no cold; it just means we can't
use this rule to reach the conclusion.

{{< img src="/img/drawings/la_ai_sick.svg" class="rounded mx-auto d-block inert-img img-fluid" width="700px">}}

One major advantage of expert systems—especially in hindsight, compared to
modern statistics-based systems—is that their decisions, predictions,
recommendations, ... are _explainable_. In our case of the common cold, for
example, we can explain _why_ the system predicts that {{< logo >}} has the
common cold: because the robot presents the symptoms _and_ there is a
corresponding rule for the symptoms. With a large neural network, by contrast,
it may be difficult to say which features of the input led to a prediction.
This is often called the **black-box problem**. The field of 
{{< term "xai" "explainable AI (XAI)" >}} studies how to make the behavior of
AI systems understandable. XAI is not another name for neural or statistical
AI: it is a research aim that can concern different kinds of systems.

An explicit chain of rules helps, but it doesn't settle every explanatory
question either. We may still ask why those rules belong in the knowledge base,
whether the premises are reliable, or whether a long derivation is useful to
the person asking for an explanation. We'll return to the difference between
explaining a result and verifying it below.

So, why did the paradigm shift from logic-based AI to statistics-based AI?—The
full (hi)story of this shift is nuanced and complicated, but looking at aspects
of it in a slightly simplified fashion may still help us understand the rather
complex entanglement between logic and AI research.

We can identify at least two factors that contributed to the shift. One is the
failure of logic-based systems to deliver on their promises. And the second one is
the success of statistics-based systems with problems that logic-based systems
failed to solve.

The "failures" of logic-based systems are themselves a complex topic, but we can
illustrate at least some of the issues with an anecdote reported by
[Laërtius](https://en.wikipedia.org/wiki/Diogenes_Laertius). According to the
anecdote, [Plato](https://en.wikipedia.org/wiki/Plato) once defined a human as a
featherless biped, much to the approval of everybody in the agora at the time
(which is where the cool kids hung out). Along came history's first punk,
[Diogenes](https://en.wikipedia.org/wiki/Diogenes), and presented Plato with a
plucked chicken, remarking "Behold, Plato's human."
{{< img src="/img/drawings/la_featherless_biped.svg" class="rounded  float-end inert-img img-fluid m-3" width="500px">}}

This seemingly unrelated anecdote from the history of philosophy illustrates a
very relevant problem for logic-based AI systems: identifying the precise
conditions under which concepts apply can be incredibly hard—even in seemingly
simple cases (being a human) and even for clear experts (Plato was at the
forefront of scientific research in his time, and he certainly could identify
humans). 

Plato's definition seems to give us the following if-then rule:

{{< excalifont display=true >}}If something's a featherless biped, then it is human.{{< /excalifont >}}

Diogenes presents us with an object that satisfies the two conditions in the
if-part of the rule, but not the condition in the then-part. He found a
_{{< term "counterexample" "counterexample" >}}_ to Plato's definition. We can
easily imagine this kind of situation happening with expert systems, where the
expert knowledge is expressed in similar if-then rules and the AI-system makes
corresponding classification errors by rigidly applying these rules. Fixing
systems in light of such errors is a tedious process, which cannot easily be
automated and requires further expert input: finding correct if-then rules often
requires _a lot_ of effort, trial-and-error, fine-tuning, etc. and then
maintenance, bug-fixing, and so on.

Moreover, each problem (medical diagnostics, computer assembly, identifying
humans, ...) requires its own, separate expert knowledge and expert system.
Correspondingly, in general, we can't expect the solutions to problems for one
expert system to transfer to the problems of another.

These difficulties contributed to a change in focus of AI research, more and more away from logic-based AI and towards more statistics-based approaches. Importantly, however, they did _not_ bring an end to all work on symbolic systems. Search, knowledge representation, and automated reasoning continued to develop alongside
statistical learning.

A helpful example in the history of AI comes from dealing with _games_. It
turns out that games are a natural testing ground for AI technologies. They
give us clear rules and a way of checking how well a system performs: _Does it
follow the rules?_ _Does it win?_ _How does it perform compared to humans?_
With games, we can compare different approaches on the same task. The game
developer and AI researcher John Carmack makes the point concisely about
commercial video games specifically in his [2025 Upper Bound talk
notes](https://keenagi.com/research/upperbound25/notes.pdf#page=4): "Commercial
games are great because they are unbiased by researchers." The point is that
games provide natural, complex tasks that researchers didn't design to suit
their own approach to AI.

Logic-based AI has had some spectacular successes. In 1997, IBM's [**Deep
Blue**](https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)) defeated the
reigning world chess champion, Garry Kasparov. Deep Blue worked through
possible moves, the opponent's replies, its own responses, and so on. To judge
which moves were promising, it used explicitly programmed criteria developed
with the help of chess experts. If you're interested, you can read about the
details in [the technical
report](https://research.ibm.com/publications/deep-blue). This was a major
achievement of the symbolic approach: human expertise expressed in a form that
a computer could apply at enormous speed.

But this approach proved much harder to make work for the other board games,
for example the game [**Go**](https://en.wikipedia.org/wiki/Go_(game)). Like
chess, Go is a traditional strategy board game, originating in China some
thousands of years ago. In Go, however, there are typically far more possible
moves at each turn than in chess. Each move allows further replies, each reply
further responses, and so on—the possibilities quickly become overwhelming. To
get anywhere, we need good ways of deciding which moves are worth exploring. We
also need to judge whether a position is promising without working through the
rest of the game. For Go, both proved particularly difficult to capture in
explicitly programmed rules.

DeepMind's **AlphaGo** achieved a breakthrough using **artificial neural
networks (ANNs)**. Through training on human games and games played against
itself, it learned to identify promising moves and assess its chances of
winning from a position. It used these learned judgments to guide its
exploration of possible moves. Here, much of the expertise that programmers had
painstakingly encoded in Deep Blue was acquired through learning. The
[original AlphaGo paper](https://doi.org/10.1038/nature16961) explains how the
networks and search work together.

These developments are part of what Richard Sutton in his landmark 2019 paper
with the same name calls [**"The Bitter
Lesson"**](https://www.cs.utexas.edu/~eunsol/courses/data/bitter_lesson.pdf).
His argument is that, in the long run, general methods that make use of more
computing power tend to outperform methods built around human expertise. The
two methods he singles out are **search and learning**. This also puts Deep
Blue in an interesting position: it relied on human expertise, but its ability
to search through enormous numbers of possible moves is itself one of Sutton's
examples. The question is how much expertise we need to build into a system,
and how much it can acquire through search and learning.

The success of statistics-based systems like AlphaGo at solving problems that
logic-based systems have struggled with for a long time is another factor in
the paradigm shift from logic-based to statistics-based systems. The comparison
between Deep Blue and AlphaGo is instructive, but the success of
statistics-based AI really is "across the board": image recognition,
translation, text-generation, …. In fact, statistics-based methods are at the
heart of the recent developments of {{< abbr title="generative AI" >}}GenAI{{< /abbr >}}.{{< img src="/img/drawings/la_text_generation.svg" class="rounded  float-start inert-img img-fluid m-3" width="400px">}}

The statistics-based approach uses [machine
learning](https://en.wikipedia.org/wiki/Machine_learning) to train its systems.
In contrast to expert systems, we no longer need to hard-code the relations
between different facts, but the system learns these relations from the data.
Rather than if-then rules, statistics-based systems typically use **{{< term
"conditional-probability" "conditional probabilities" >}}** to make
predictions. For example, when a chatbot like ChatGPT or Claude answers a
prompt, its underlying model estimates how likely different pieces of text are
to come next, *given* the prompt and what's been written so far. These
probabilities are used to select the next piece of text. The process then
repeats, building up the answer piece by piece.

It's important to note, however, that it can be very hard to extract the learned
rules from a statistics-based model: the models are, generally speaking
*opaque*. This is in part because of the size of the models—the language models
that underpin chatbot-technologies have literally billions of parameters—and in
part because of the way the machine learning algorithms work.

### Auxiliary

While statistics-based methods are, at the moment, the state of the art, logic
still plays an important role in AI research. Logic-based research in AI has
sparked the development of extremely sharp and powerful _tools_ for different
tasks in AI development, which are still in use today.{{< img src="/img/drawings/ai_tools.svg" class="rounded  float-end inert-img img-fluid m-3" width="150px">}}

One big area where this is the case is what's known as 
**{{< term "knowledge-representation-and-reasoning" "Knowledge Representation and Reasoning (KRR)" >}}**.  While subsymbolic systems, especially
{{< abbr title="generative AI" >}}GenAI{{< /abbr >}}-systems
like ChatGPT, _can_ store factual information, they are---at least in the
current state of the art---fairly unreliable with
[**hallucinations**](https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence))
being one of the main issues. A useful comparison is with our own **imperfect
memory**. We might remember the general idea of something we've read, but get
the details wrong when we try to recall it. And feeling confident that we've
remembered correctly doesn't make it so!

For exact retrieval of stored records (think: an account balance or an order
number), we normally use
[**databases**](https://en.wikipedia.org/wiki/Database). Roughly, the difference
is between trying to remember the information and writing it down so we can
look it up later. A GenAI system can also use a database for this purpose.
Keeping the record there gives it something to consult when its own answer
would amount to relying on memory.

The connection between databases and logic is very deep: [Codd's
theorem](https://en.wikipedia.org/wiki/Codd%27s_theorem) shows that 
**{{< term "querying" "querying" >}}**
a database is, in many cases, essentially just a special way of evaluating the
formulas of the logical system of predicate logic. 

KRR is just one example of where a logical tool is useful outside the scope of
expert systems, and symbolic AI in the narrow sense of using logic as the sole
foundation for AI. During the course, you'll see logic is (almost) _everywhere_
in AI, ranging from low-level transistors via high-level programming languages
to the abstract study of AI's abilities—all of this has to do with logic. Logic
is, to this day, one of the main auxiliary disciplines of AI research.

## The way forward

This concludes our overview of the different ways in which logic is related to
AI research. We've seen that logic is a foundational discipline for AI since it
studies paradigmatic intelligent behavior, that there are logic-based paradigms
for AI research and development, and that logic provides useful tools for AI
research, especially for knowledge representation.

When AI researchers are skeptical of "logic", we need to ask which of these
roles they have in mind. For example, Geoffrey Hinton questions whether
intelligence requires an internal language of symbols. In a [2022 interview
with Stephen
Hanson](https://aihub.org/2022/02/02/what-is-ai-stephen-hanson-in-conversation-with-geoff-hinton/),
he puts his alternative like this: "what we need is vectors inside the head."
The idea is that neural networks can represent information through lists of
numbers, without translating it into logical formulas. This challenges the
logic-based approach to building AI. It leaves open the other roles of logic
we've discussed. And, as we'll see, even logic-based technologies are alive and
kicking. In the rest of this chapter, we'll have a look at some ways in which
logical methods feature in cutting-edge AI research, specifically in the area
of {{< abbr title="generative AI" >}}GenAI{{< /abbr >}}.

### System 1 and System 2

One influential way of framing the direction of this research is in
terms of a distinction that's been popularized by [Daniel
Kahneman](https://en.wikipedia.org/wiki/Daniel_Kahneman) in his famous popular
science book [Thinking, Fast and Slow](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow). 

In the book, Kahneman describes the distinction between two kinds of reasoning
activities regularly performed by human agents:

{{< callout type="definition" title="System 1 and system 2 thinking (Kahneman)" >}}
{{< term "system-1" "System 1 thinking" >}} is fast, automatic, intuitive,
and associative. It usually happens without conscious effort.

{{< term "system-2" "System 2 thinking" >}} is slow, deliberate, and
conscious. It involves working through a problem, calculating, or checking
whether a conclusion follows.
{{< /callout >}}

Here are some examples:

 | System 1                                      | System 2                                     |
 | ---                                           | ---                                          |
 | Recognizing a face                            | Counting the A's in a text                   |
 | Telling if one object is taller than another  | Solving a logic puzzle                       |
 | Performing a familiar calculation, like $5+7$ | Working out $432×441$                        |
 | Recalling an answer from memory               | Checking the answer against a written record |
 | ⋮                                             | ⋮                                            |

Think back to the comparison with imperfect memory. An answer can come to mind
immediately, without us working through how we know it. That's useful, but we
can misremember. When the answer matters, we might stop and check: did I really
read that? Does the calculation work? Does this conclusion follow from what I
know? These are system 2 activities.

One approach to AI takes this distinction as a guide to the division between
statistics-based and logic-based systems. On this view, GenAI is good at the
system 1 side: recognizing patterns and coming up with plausible answers.
Logic-based systems supply the system 2 side: working through explicit rules
and their consequences.

On a strong version of this view, GenAI on its own cannot provide reliable
system 2 thinking. The way forward is then to combine symbolic and subsymbolic
components in [**hybrid systems**](https://en.wikipedia.org/wiki/Hybrid_intelligent_system).
Think of teaching ChatGPT to use a calculator rather than letting it try to
solve a calculation "in its head". The same idea applies to memory: give the
system a database to consult, and to reasoning: give it logical tools for
working out what follows.

But this is one approach. Another is to think that system 2 abilities can
*emerge within* GenAI systems themselves. The system can learn to break a
problem into steps, try different approaches, and revise its answer. For
example, [research on reasoning
models](https://openai.com/index/learning-to-reason-with-llms/) has found
improvements from training models to reason and giving them more time to work
on a problem. On this approach, we try to develop the system's own ability to
reason deliberately. For a recent overview of how researchers try to develop
these abilities, see Zhang and colleagues' [*From System 1 to System 2: A
Survey of Reasoning Large Language
Models*](https://www.computer.org/csdl/journal/tp/2026/03/11267249/2bW5Ng1ygZW),
published in 2026.

The comparison with human thinking gives us a way to frame these approaches;
it doesn't settle which abilities an AI architecture can have. Nor do we have
to choose once and for all: a system that learns to reason can also use tools.
But even if GenAI develops excellent system 2 abilities, we still need a way to
check its reasoning. This gives logical methods a role in either approach.

### Logic-checking {#logic-for-verification}

You've probably seen a disclaimer like this underneath a chatbot's answers
(here taken from OpenAI's ChatGPT):

> ChatGPT can make mistakes. Check important info.

But how should we do the checking? If the answer gives us a date or an account
balance, we can look it up in a reliable source. If it gives us an argument,
there's a further question: do the premises actually support the conclusion?
Checking the facts alone won't settle that. We also need to check the
*reasoning*.

This is where logic comes into play. We can use logical methods for **{{< term
"verification" "verification" >}}**: checking whether a proposed result meets
the requirements we've set for it. Here, we want to check whether an inference
is valid. Asking another GenAI system to review the answer might help us spot a
mistake, but its reasoning needs checking too, of course. And we're off to the
races.

Remember that we introduced **{{< term "logical-system" "logical systems" >}}**
as mathematical models of valid inference. Consequently, they are the right
framework for answering the questions where asking here: is the AI-generated
reasoning logically sound. The important point is that we can use these methods
to check an AI's reasoning, in a theoretically well-founded way---regardless of
how the AI came up with the argument.

Take the inference “If it rains, the ground is wet; the ground is wet; so it
rains.” The ground could be wet because a sprinkler was running, even though
it hasn't rained. We've found a **{{< term "counterexample" "counterexample" >}}**:
the premises are true, but the conclusion is false. This shows that the
inference is deductively invalid. The {{< term "semantics" "semantics" >}} of a
logical system lets us make this kind of check mathematically precise, so
that a computer can help us find such cases.

Now consider “If it rains, the ground is wet; it rains; so the ground is wet.”
Here, the conclusion does follow. The {{< term "proof-theory" "proof theory" >}}
of a logical system gives us rules for making such steps explicit. By
following these rules, we can build a **{{< term "proof" "proof" >}}** of a
conclusion from its premises. A computer can then check whether each step
follows the rules. This is what makes logical tools so useful here: an AI can
suggest an argument, and we can check whether its steps establish the
conclusion. If a step fails the check, we need to repair the argument before
accepting it as a proof.

Of course, we still need to choose a suitable logical system and represent the
argument correctly in its {{< term "formal-language" "formal language" >}}. As
with our physicist's model of the ball, the assumptions we make matter here.
Checking the reasoning in our model doesn't by itself tell us whether we've
made the right modeling assumptions, or whether the premises are true. But it
lets us check what follows from them. That's what we need logical expertise and
tools for.

#### Checking AI-generated math

A hot topic in current AI research is using GenAI to solve mathematical
problems, including problems that have been open for decades. Like games,
mathematics gives AI researchers a way of testing and showcasing the abilities
of their systems. Can a system find a solution that requires many steps of
reasoning? Can it discover an argument that nobody has thought of before?
There is also a practical ambition here: to develop tools that help
mathematicians with their research. These aims feature in both DeepMind's
[work on AlphaProof](https://research.google/pubs/olympiad-level-formal-mathematical-reasoning-with-reinforcement-learning/)
and OpenAI's [work on open mathematical problems](https://openai.com/index/ten-advances-in-mathematics/).

But computer-generated proofs present us with a fundamental problem. GenAI is
very good at producing text that _looks_ and _sounds_ plausible. But
mathematical arguments need to be a _rigorous_, gap-free, and logically valid
piece of argumentation. And when an argument runs through pages of complicated
mathematics, checking this can take a great deal of expertise and work. This is
where an important logic-based technology comes into play: **{{< term
"proof-assistant" "proof assistants" >}}**. A proof assistant lets us express
mathematical statements in a formal language, construct proofs, and check
computationally that each step follows the rules.

A proof assistant that's seeing adoption in the mathematics community is
[**Lean**](https://lean-lang.org/). Mathematicians are increasingly using Lean
to write out their definitions and proofs in a form that a computer can check.
They also build on one another's work: Lean's mathematical library,
[**Mathlib**](https://mathlib.org/), collects definitions and checked proofs
that can be reused in further arguments. This makes Lean useful for organizing
mathematical knowledge and collaborating on proofs, as well as for checking
individual results. Interestingly, its applications also extend to [verifying
computer software](https://lean-lang.org/use-cases/), too.

These features make Lean useful for AI research as well. A system can propose
a proof, formalize it in Lean, and use the feedback to try again if a step fails.
DeepMind's **AlphaProof**, for example, learns to find proofs through repeated
attempts in Lean's formal environment. Lean provides the checks that tell the
system when it has succeeded. So logical tools can help with both learning to
prove and checking the resulting proofs.

This kind of work has produced intriguing results. In August 2026, OpenAI
[reported ten advances in mathematics and theoretical computer
science](https://openai.com/index/ten-advances-in-mathematics/), releasing
mathematical writeups alongside [Lean
proofs](https://github.com/openai/ten-proofs). On September 8, it [announced a
proposed solution to the Navier–Stokes
problem](https://openai.com/index/navier-stokes-solution/), a long-standing
problem about equations describing the motion of fluids, again accompanied by a
[Lean
formalization](https://github.com/openai/NavierStokesAndEuler).[^navier-stokes-controversy]
In these projects, Lean gives mathematicians a way to check the formal proofs
independently of the AI systems that produced them. The recent announcements
still require mathematical scrutiny, including whether the formal statements
capture the problems they claim to solve.

A complete proof checked by a proof assistant like Lean gives us a very high
standard of **{{< term "verification" "verification" >}}**. But mathematical
practice involves more than checking proofs. As Terence Tao explains in
["There's more to mathematics than rigour and proofs"](https://terrytao.wordpress.com/career-advice/theres-more-to-mathematics-than-rigour-and-proofs/),
rigorous reasoning and mathematical intuition need to work together. We also
want to understand _why_ a result holds, how it connects to other results, and
what we can learn from its proof. Lean helps secure the steps on which that
understanding rests. We'll learn how to use it ourselves later in the course.

## Further readings {.readings .nocount}

This textbook is what might be called a _didactic_ textbook. The aim is to
familiarize the reader with the basic concepts of logical theory and their role
in AI research. The focus lies on teaching with examples and illustrating
bigger ideas. In contrast, an _encyclopedic_ textbook focuses more on
providing an exhaustive discussion of the most important concepts in the field.

The distinction between didactic and encyclopedic textbooks is not strict and
not exhaustive, but the present textbook clearly falls into the former category.
This is why it's a good idea to supplement it with more encyclopedic textbooks.

The [Open Logic Project](https://openlogicproject.org/) develops open textbooks
collaboratively. Different books select and arrange material from its Open Logic
Text for different courses. *Sets, Logic, Computation*, for example, is Richard
Zach's remix of that shared material. Russell and Norvig's *Artificial
Intelligence: A Modern Approach* is a standard introduction to AI as a field of
academic research. I'll recommend specific chapters from these books as we go.

For this chapter:

- Russell and Norvig, [*Artificial Intelligence: A Modern Approach*, 4th edition](https://www.pearson.com/en-us/subject-catalog/p/Russell-Lecture-Power-Points-for-Artificial-Intelligence-A-Modern-Approach-4th-Edition/P200000003500/9780137505135), chapters 1–2, for the history of AI and the idea of an intelligent agent.

- Open Logic Project, [*Sets, Logic, Computation* (PDF)](https://slc.openlogicproject.org/slc-screen.pdf), remixed by Richard Zach from the Open Logic Text; chapter 5, for an overview of first-order logic.

The Open Logic links lead to freely downloadable PDFs. For AIMA, the
link leads to the publisher; the chapter numbers refer to the fourth edition.

**Notes:**

[^navier-stokes-controversy]: The announcement also sparked a dispute about
research credit and how AI companies should work with mathematicians.
[Tristan Buckmaster's account](https://cims.nyu.edu/~tristanb/statement.pdf)
raises concerns about OpenAI's response to his work with Levent Alpöge on
related fluid equations, including pressure over publication and authorship.
[OpenAI's account](https://openai.com/index/navier-stokes-solution/)
acknowledges that news of their progress prompted its effort, but says its
researchers and AI agents did not see their work before its public release.
The accounts differ, and questions about credit and research conduct remain
contested. This illustrates another limit of proof checking: Lean can check a
formal proof, but it cannot settle who deserves credit for the ideas or whether
the researchers were treated fairly.

[^bivalence]: Why is this a simplifying assumption?
