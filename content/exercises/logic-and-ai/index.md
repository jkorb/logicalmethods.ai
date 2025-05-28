---
title: Logic and AI
subtitle: test
author: Johannes Korbmacher
weight: 1
params: 
  id: exc-laa
---

# Definitions

_Note_: A definition needs to fully explain the meaning of a concept. This is
typically done by saying under which precise conditions the concept applies.
That is, the answer should have the form like "A valid inference is an inference
such that..." or "An inference is valid just in case ...".

## a.) Inference 

Give a definition of inference. Include examples (where your definition applies)
and non-examples (where it does not). Make sure to explain why your definition
applies or not.


## b.) Validity {.homework}

Give a definition of deductive and inductive inference. Include examples 
and non-examples with explanations. 


# Indicators { .solved }

Give at least 5 additional examples of:

## a.)  

premise indicators,

## b.) 
 
inference indicators.

Name the premise and inference indicators in the following paragraphs.

## c.) 
Because &forall;`I` knows that location of every book in the libary, and the student asks for a specific title, it follows that forall;`I`can guide the user directly to the book's shelf.

## d.)
If &forall;`I`detects that a student struggles with mathematics, then it recommends extra practice problems. Since the student's last test scores were low, so &forall;`I` suggest additional exercises.

## e.)
&forall;`I` thinks that he recognizes the face of a student entering the classroom. When a face is recognized by &forall;`I`, then it marks attendance automatically in the specific class. &forall;`I` remembers the face of the student, but the student is actually in another class. Consequently, &forall;`I` the attendance is not recorded.

## f.)
If &forall;`I` detects pronunciation errors in a student's speech, it will provide corrective feedback. Given that the student is practicing regularly, therefore &forall;`I` improves their pronunciation over time.


## Solution {#indicatorsSolution .solution}

a.) Since, because, for, whereas, as, given that, assuming that, considering that, due to. 

b.) It follows that, thus, hence, consequently, we know that, therefore, so, accordingly, then, as a result, this implies that.

c.) Premise indicators: because, and. 
Conclusion indicator: it follows that.

d.) Premise indicators: if, then, since. Conclusion indicator: so.

e.) Premise indicators: when, then. Conclusion indicator: consequently.

f.) Premise indicators: if, given that. Conclusion indicator: therefore.

# Validity { .solved }

Which of the following inferences is valid? Specify whether the inference is
deductively or inductively valid.

## a.) 

Every attempt so far has failed. So the next attempt will also fail.

## b.) 

Well, I didn’t not cause the bug. So, I caused the bug.

## c.) 

If you did _that_, pigs can fly. So, you didn't do it.

## d.)

All software has bugs. So, this software has bugs, too.

## e.)

A thinking computer is not a computer anymore. So it's impossible to teach a
computer how to think.

## Solution {#validitySolution .solution}

**a.)** This argument is deductively _in_valid: it's possible that all attempts have failed but the next one succeeds. The argument _may_ be inductively valid if, for example, there were sufficiently many previous attempts, and we tried all different angles.

**b.)** This argument is deductively valid: not not doing something is the same as doing it. 

**c.)** Without any additional premises the argument is not deductively valid, since it is logically possible that you did it and pigs fly. One might argue that the argument is inductively valid given the probabilistic information we already have available, viz. the probability of pigs flying is low.

**d.)** This inference is deductively valid: if everything is so and so, any thing you can talk about also is so and so.

**e.)** An argument could be made that the argument is deductively valid: if a thinking computer is not a computer, then there cannot be a thinking computer, since this would lead to a contradiction (something which both is and isn't a computer). 

# Deductive and inductive inference

Provide an argument that every deductively valid inference is also
inductively valid. Does the converse also hold?

# System-Thinking { .solved }

Give at least 3 new examples of system 1 and system 2 thinking and explain why. 

## a.)

System 1

## b.)

System 2

## Solution {#system-thinkingSolution .solution}

**a.)** [System 1](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow) thinking, which is fast, automatic, intuitive, unconscious, associative. For example:

* Localize the source of a specific sound
* Understand simple sentences in a native language
* Reaching out to grab something that falls
* Forming the image associated with the word "book"
* An AI system for facial recognition on a phone recognizes faces automatically without “thinking” about what a face looks like.
* Algorithms that recommended content based on viewing history, without explenation why this is recommended.
* Voice assistent like Siri or Alexa: the voice assistent instantly interprets and responds to a simple command like "What time is it?" 
* AI model that detects spam in emails: based on pattern recognition and prior data, it  automatically classifies a message as spam.
* Simple chatbots, such as ChatGPT-3.5 that react fast and do not reason much.

**b.)** [System 2](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow) thinking, which is slow, deliberate, conscious, logical, alculating. For example:

* Solving a complex arithmetic calculation
* Finding the solution for a multi-criteria optimalization problem
* Trying to identify the source of an unfamiliar sound or analyze a musical chord structure
* Count the number of A's in a certain text
* Determine the price/quality ratio of two phones
* Determine the validity of a complex logical reasoning
* AI model that can play chess, like [AlphaZero](https://en.wikipedia.org/wiki/AlphaZero), that analyzes all possible moves and learns every strategy
* [ChatGPT-4](https://en.wikipedia.org/wiki/GPT-4) that is able to use resoning for functional programming.
* AI models like [WolframAlpha](https://en.wikipedia.org/wiki/WolframAlpha) that are used to solve complex mathematical problems and analyze data.


# Research { .research }

_Note_: These questions require you to do your own research, using reliable
academic sources. You need to reference your sources!

## Decidability 

Are _all_ logical systems undecidable?

## Symbolic AI { .homework }

Give 2 examples of existing expert systems, one that "failed" and one that's
still in use today. Explain why the first one failed.

# Discussion {.discussion}

_Note_: The following questions require argumentative writing, i.e. you're asked
to take an informed view on the question, clearly state your position, and the
reasons for it.

## a.) Logic and system 2

Is all logical thinking system 2 thinking?

## b.) Minds and machines { .homework }

Does Gödel's theorem show that we cannot build a logic-based AGI?

# Classification { .solved }

Below are technical descriptions of different AI systems taken from Wikipedia. In each case, classify the system as either symbolic or sub-symbolic system based on the description. Justify your answer by referencing the relevant aspects.

## a.) 

[MYCIN](https://en.wikipedia.org/wiki/Mycin) was an early backward chaining expert system that used artificial intelligence to identify bacteria causing severe infections, such as bacteremia and meningitis, and to recommend antibiotics, with the dosage adjusted for patient's body weight. MYCIN operated using a fairly simple inference engine and a knowledge base of ~600 rules by obtaining individual inferential facts identified by experts and encoding such facts as individual production rules. No other AI program at the time contained as much domain-specific knowledge clearly separated from its inference procedures as MYCIN. It would query the physician running the program via a long series of simple yes/no or textual questions. At the end, it provided a list of possible culprit bacteria ranked from high to low based on the probability of each diagnosis, its confidence in each diagnosis' probability, the reasoning behind each diagnosis (that is, MYCIN would also list the questions and rules which led it to rank a diagnosis a particular way), and its recommended course of drug treatment. 


## b.) 

[Vampire](https://en.wikipedia.org/wiki/Vampire_(theorem_prover)) is an automatic theorem prover for first-order classical logic developed in the Department of Computer Science at the University of Manchester. Vampire's kernel implements the calculi of ordered binary resolution and superposition (for handling equality). The splitting rule and negative equality splitting can be simulated by the introduction of new predicate definitions and dynamic folding of such definitions. A DPLL-style algorithm splitting is also supported. A number of standard redundancy criteria and simplification techniques are used for pruning the search space: tautology deletion, subsumption resolution, rewriting by ordered unit equalities, basicness restrictions and irreducibility of substitution terms. The reduction ordering on terms is the standard Knuth–Bendix ordering.

## c.) 

A [self-organizing map](https://en.wikipedia.org/wiki/Self-organizing_map) (SOM) or self-organizing feature map (SOFM) is an unsupervised machine learning technique used to produce a low-dimensional (typically two-dimensional) representation of a higher-dimensional data set while preserving the topological structure of the data. For example, a data set with p variables measured in n observations could be represented as clusters of observations with similar values for the variables. These clusters then could be visualized as a two-dimensional "map" such that observations in proximal clusters have more similar values than observations in distal clusters. This can make high-dimensional data easier to visualize and analyze.

## d.)

[ELIZA](https://en.wikipedia.org/wiki/ELIZA) is an early natural language processing computer program developed from 1964 to 1967 at MIT by Joseph Weizenbaum. Created to explore communication between humans and machines, ELIZA simulated conversation by using a pattern matching and substitution methodology that gave users an illusion of understanding on the part of the program, but had no representation that could be considered really understanding what was being said by either party. ELIZA itself examined the text for keywords, applied values to said keywords, and transformed the input into an output; the script that ELIZA ran determined the keywords, set the values of keywords, and set the rules of transformation for the output.


## e.) 

In natural language processing, [latent Dirichlet allocation](https://en.wikipedia.org/wiki/Latent_Dirichlet_allocation#Inference) (LDA) is a Bayesian network (and, therefore, a generative statistical model) for modeling automatically extracted topics in textual corpora. The LDA is an example of a Bayesian topic model. In this, observations (e.g., words) are collected into documents, and each word's presence is attributable to one of the document's topics. Each document will contain a small number of topics. Documents are represented as random mixtures over latent topics, where each topic is characterized by a distribution over all the words. 

## f.)

In machine learning, [support vector machines](https://en.wikipedia.org/wiki/Support_vector_machine) (SVMs, also support vector networks) are supervised max-margin models with associated learning algorithms that analyze data for classification and regression analysis. SVMs can efficiently perform non-linear classification using the kernel trick, representing the data only through a set of pairwise similarity comparisons between the original data points using a kernel function, which transforms them into coordinates in a higher-dimensional feature space. Thus, SVMs use the kernel trick to implicitly map their inputs into high-dimensional feature spaces, where linear classification can be performed.


## Solution {#classificationSolution .solution}

**a.)** Symbolic system

**b.)** Symblic system

**c.)** Subsymbolic system

**d.)** Symbolic system

**e.)** Subsymbolic system

**f.)** Subsymbolic system


# Inferences { .solved }
Define the premise(s) and conclusion of each of the following inferences.

## a.) 

The robot  &forall;`I` rides towards entering of the supermarket. The supermarket's automatic sliding doors open, when someone stands in front of the sensor. The sensor detects &forall;`I`. Therefore, the supermarket's automatic doors open.


## b.)

Since the robot &forall;`I` nests itself in the phone, is it able to take over the function of Face ID. If &forall;`I` recognizes the face, it will unlock the phone. A phone's user, ∃`n`, picks up the phone and tries to unlock it by showing its face to the phone. However, &forall;`I` doesn't know ∃`n`, so the phone stays unlocked.

## c.)

If &forall;`I` notices that the milk is running low, it directly orders new milk. The ordered milk will arrive tomorrow, because ∃`n` delivers milk the day after the order is made by &forall;`I`. 

## d.)

&forall;`I` (in the personality of an autonomous driving car), at a red traffic light either brakes or chooses an alternative route. Since &forall;`I` isn't braking, it must currently be still driving. Thus it should have chosen another route.

## e.) 

If &forall;`I` notices that energy consumption is low at night, it turns off devces, and if &forall;`I` detects peak consumption, it shifts usage to cheaper hours. But energy consumption is now either low or there is peak consumption. So, &forall;`I` either turns off devices or shifts usage to cheaper hours.

## f.)

If &forall;`I` detects plagiarism in an assignment, the teacher is alerted. The teacher was not alerted. Consequently, AI did not detect plagiarism.

## g.)
&forall;`I` is a usefull additional teacher to students, because &forall;`I`carefully analyzes the submitted homework to spot areas where the student struggles. Since &forall;`I` can identify these specific weaknesses, it knows exactly what advice to give to help the student improve. Moreover, thanks to the help of &forall;`I`, the teacher can focuss on more structural or analytical explanations.


## Solution {#inferencesSolution .solution}

**a.)** P1: The robot  &forall;`I` rides towards entering of the supermarket. 
P2: The supermarket's automatic sliding doors open, when someone stands in front of the sensor.
P3: The sensor detects &forall;`I`. 
C: the supermarket's automatic doors open.

**b.)** P1: Since the robot &forall;`I` nests itself in the phone, is it able to take over the function of Face ID.
P2: If &forall;`I` recognizes the face, it will unlock the phone. P3: A phone's user, ∃`n`, picks up the phone and tries to unlock it by showing its face to the phone. 
P4: &forall;`I` doesn't know ∃`n`
C: The phone stays unlocked.

**c.)** P1: If &forall;`I` notices that the milk is running low, it directly orders new milk. 
C: The ordered milk will arrive tomorrow.
P2: ∃`n` delivers milk the day after the order is made by &forall;`I`. 

**d.)** P1: &forall;`I` (in the personality of an autonomous driving car), at a red traffic light either brakes or chooses an alternative route. 
P2: Since &forall;`I` isn't braking, it must currently be still driving. 
C: It should have chosen another route.

**e.)** P1: If &forall;`I` notices that energy consumption is low at night, it turns off devces. 
P2: if &forall;`I` detects peak consumption, it shifts usage to cheaper hours. 
P3: Energy consumption is now either low or there is peak consumption. 
C: &forall;`I` either turns off devices or shifts usage to cheaper hours.

**f.)** P1: If &forall;`I` detects plagiarism in an assignment, the teacher is alerted. 
P2: The teacher was not alerted. 
C: &forall;`I` did not detect plagiarism.

**g.)** C: &forall;`I` is a usefull additional teacher to students.
P1: &forall;`I`carefully analyzes the submitted homework to spot areas where the student struggles. 
P2: &forall;`I` can identify these specific weaknesses, it knows exactly what advice to give to help the student improve. 
P3: thanks to the help of &forall;`I`, the teacher can focuss on more structural or analytical explainations.



