---
title: Logic and AI
subtitle: test
author: Johannes Korbmacher
weight: 1
params: 
  id: exc-laa
---

# Test your knowledge { .solved }
## a.) Which of the following statements is true about inferences?
- [ ] An inference is simply a list of multiple premises and conclusions.
- [X] An inference consists of one or more premises and a conclusion, with their indicators, together forming an argument for a claim. 
- [ ] An inference combines multiple conclusions to produce a single premise for later reasoning.
- [ ] An inference always requires numerical data or statistical evidence to support the conclusion.

## b.) What is a logical system?
- [X] A logical system is a system that consists of a component that is responsible for determination wheter an inference is valid, the language of the inferences, and the meaning of the premises and conclusions.
- [ ] A logical system is a software library that contains precompiled proofs, but has no formal rules for deriving new conclusions.
- [ ] A logical system is a set of inference rules only, where the meaning of symbols and the language of expressions are considered not relevant.
- [ ] A logical system is defined solely by its semantics (interpretations of symbols), with no corresponding syntactic rules or proof theory.

## c.) Which of the following statements is true about logical systems?
- [X] A category of a logical system is one that assumes that every sentence is true or false, which is called classical logic.
- [ ] Propositional logic is a logical system that is classified by the backgrooud assumptions. 
- [ ] Quatifiers are used in modal logic.
- [X] A way of classifying logical systems is by the kind of inferences they deal with

## d.) What is AI?
- [ ] AI is the worldwide network of webcams that observes human behavior and predicts human actions.
- [ ] AI is the technology to program computers, to make sure that they function without human interaction.
- [X] Models and replication of "intelligent behaviour", in the broad sense of the emulation of human abilities with a computer system, is studied by AI
- [ ] Models and replications of "intelligent behaviour" are studied by AI via MRI scans and neurological resaerch.

## e.) Why is logic considered a foundational subdiscipline of AI?
- [ ] Because logical systems are practical tools for automating all AI applications in industry.
- [X] Because valid inference is paradigmatic intelligent behavior, so logical systems model what AI aims to replicate.
- [ ] Because logic's primary aim is to optimize machine learning algorithms for speed ans efficiency.
- [ ] Because logic deals exclusively with hardware design, which underlies AI systems.

## f.) Which of the following best explains why expert systems (symbolic AI) struggled to scale and ultimately contributed to the decline of symbolic approaches?

- [ ] They required neural networks to process if-then rules, which dramatically increased hardware costs.
- [ ] Expert systems could only be written in LISP, limiting their applicability to modern programming environments.
- [X] It was extremely difficult and time-consuming to encode comprehensive expert knowledge into correct if-then rules, making upkeep and expansion impractical.
- [ ] They relied on subsymbolic (statistical) methods that produced opaque models, undermining explainability.

## g.) Which statement most accurately contrasts subsymbolic AI with symbolic (logic-based) AI?
- [X] Subsymbolic AI relies on statistical models and inductive inference from data, whereas symbolic AI relies on explicit knowledge bases and deductive reasoning via logical inference engines.
- [ ] Subsymbolic AI models are always fully transparent in their decision process, while symbolic AI models are inherently opaque.
- [ ] Subsymbolic AI emerged first in the 1950s, whereas symbolic AI was a later development spurred by deep learning breakthroughs.
- [ ] Subsymbolic AI stores knowledge as human-readable if-then rules, whereas symbolic AI uses neural networks trained on large datasets.

## h.) Why are subsymbolic AI systems often considered less explainable than symbolic AI systems like expert systems?
- [ ] Subsymbolic AI systems use if-then rules that are too numerous for humans to inspect, whereas symbolic AI uses simple equations.
- [ ] Subsymbolic AI relies on Gödel’s incompleteness theorem to handle undecidable statements, which inherently prevents explanations.
- [ ] Subsymbolic AI systems do not perform any inference at all, so there is nothing to explain, whereas symbolic AI performs inference.
- [X] Subsymbolic AI models (e.g., neural networks) learn statistical representations from data, making their internal decision processes opaque, while symbolic AI uses transparent, human-readable rules and inference steps.

## i.) Which statement best describes the distinction between storing factual knowledge in subsymbolic AI models (e.g., LLMs) versus symbolic AI systems (e.g., databases)?
- [ ] Subsymbolic models guarantee 100% recall of stored facts, whereas symbolic databases may occasionally lose information.
- [ ] Subsymbolic models cannot store any factual information, whereas symbolic databases can only store numerical data.
- [X] Subsymbolic models store information implicitly in learned parameters and can hallucinate; symbolic databases store facts explicitly and allow precise retrieval.
- [ ] Subsymbolic models use predicate logic for queries, while symbolic databases rely solely on neural network inference.

## j.) What does Codd’s theorem imply about the relationship between databases and logic?
- [ ] That logical systems are irrelevant for understanding how databases retrieve data.
- [X] That querying a relational database can often be viewed as evaluating formulas in predicate logic.
- [ ] That databases cannot represent any logical formulas unless they are converted to expert systems.
- [ ] That every database must be implemented in LISP to support logical inference.

## k.) According to the excerpt’s discussion of Kahneman’s System 1 and System 2, why do large language models (LLMs) struggle with precise logical reasoning compared to symbolic systems?
- [ ] LLMs excel at conscious, deliberate System 2 thinking but lack fast, intuitive System 1 capabilities.
- [ ] LLMs are not trained on any textual data, making them unable to perform even simple associative tasks.
- [X] LLMs are strong at fast, pattern‐based System 1 thinking (e.g., language mimicry) but have weak System 2 abilities (e.g., exact calculations), whereas symbolic systems excel at System 2.
- [ ] LLMs rely exclusively on explicit if-then rules, which prevents them from performing any intuitive reasoning.

## Solution {#test-your-knowledgeSolution .solution}
**a.)** B, an inference by definition links explicit premises (with indicators like "since" and "because") to a conclusion. The other options either omit premises or mischaracterize how conclusions are formed.

**b.)** A, a logical system has three parts: syntax (language of the inference), semantics (meaning), and proof theory (validity checking). The incorrect options each leave out one of these crucial components.

**c.)** Both A and D are true, because A) classical logic’s hallmark is bivalence (“true or false”) and D) logical systems differ (e.g., propositional vs. predicate) by the inference rules they support. The distractors confuse systems (“quantifiers in modal logic” is false, “propositional logic classified by background assumptions” is garbled).

**d.)** C, AI studies how to build models that emulate human-like intelligent tasks. The false options describe surveillance, generic automation, or neuroscience research rather than modeling intelligence.

**e.)** B, valid inference is paradigmatic intelligent behavior. What we call intelligent, namely drwaing valid conclusions based on known facts, is formalized in logical systems. Logic therefore forms a foundation for AI, because the formalization of valid reasoning precisely matches what AI models.

**f.)** C, expert systems require manually crafting and maintaining large rule sets. The wrong answers wrongly blame hardware costs, programming language choice, or subsymbolic methods.

**g.)** A, subsymbolic (e.g., neural nets) infer patterns from data; symbolic systems use hand‐crafted rules and logic. The wrong choices reverse transparency or timeline.

**h.)** D, neural nets’ learned weights aren’t easily interpretable; expert systems’ if-then rules can be directly inspected. The false options misattribute rule usage or Gödel’s theorem.

**i.)** C, LLMs encode facts in weights (prone to error), whereas databases record exact entries. The distractors misunderstand recall, data types, or querying.

**j.)** B, Codd showed SQL-like queries correspond to predicate logic statements. The other statements falsely assert irrelevance of logic or mandate LISP.

**k.)** C, LLMs predict next-word patterns (fast, intuitive), but lack reliable step-by-step reasoning; symbolic AIs handle deliberate, logical tasks well. The wrong options misstate LLM capabilities or rule usage.


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


# Examples of indicators { .solved }

Give at least 5 additional examples of:

## a.)  

premise indicators,

## b.) 
 
inference indicators.

## Solution {#examples-of-indicatorsSolution .solution}

a.) Since, because, for, whereas, as, given that, assuming that, considering that, due to. 

b.) It follows that, thus, hence, consequently, we know that, therefore, so, accordingly, then, as a result, this implies that.

# Recognizing indicators { .solved }
Name the premise and inference indicators in the following paragraphs.

## a.) 
Because &forall;`I` knows that location of every book in the libary, and the student asks for a specific title, it follows that forall;`I`can guide the user directly to the book's shelf.

## b.)
If &forall;`I`detects that a student struggles with mathematics, then it recommends extra practice problems. Since the student's last test scores were low, so &forall;`I` suggest additional exercises.

## c.)
&forall;`I` thinks that he recognizes the face of a student entering the classroom. When a face is recognized by &forall;`I`, then it marks attendance automatically in the specific class. &forall;`I` remembers the face of the student, but the student is actually in another class. Consequently, &forall;`I` the attendance is not recorded.

## e.)
If &forall;`I` detects pronunciation errors in a student's speech, it will provide corrective feedback. Given that the student is practicing regularly, therefore &forall;`I` improves their pronunciation over time.


## Solution {#recognizing-indicatorsSolution .solution}

a.) Premise indicators: because, and. 
Conclusion indicator: it follows that.

b.) Premise indicators: if, then, since. Conclusion indicator: so.

c.) Premise indicators: when, then. Conclusion indicator: consequently.

d.) Premise indicators: if, given that. Conclusion indicator: therefore.

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

# Symbolic or subsymbolic { .solved }

Below are technical descriptions of different AI systems taken from Wikipedia. In each case, classify the system as either symbolic or sub-symbolic system based on the description. Justify your answer by referencing the relevant aspects.

## a.) 
{{< blockquote author="MYCIN, Wikipedia" id="MYCIN-quote" >}}
[MYCIN](https://en.wikipedia.org/wiki/Mycin) was an early backward chaining expert system that used artificial intelligence to identify bacteria causing severe infections, such as bacteremia and meningitis, and to recommend antibiotics, with the dosage adjusted for patient's body weight. MYCIN operated using a fairly simple inference engine and a knowledge base of ~600 rules by obtaining individual inferential facts identified by experts and encoding such facts as individual production rules. No other AI program at the time contained as much domain-specific knowledge clearly separated from its inference procedures as MYCIN. It would query the physician running the program via a long series of simple yes/no or textual questions. At the end, it provided a list of possible culprit bacteria ranked from high to low based on the probability of each diagnosis, its confidence in each diagnosis' probability, the reasoning behind each diagnosis (that is, MYCIN would also list the questions and rules which led it to rank a diagnosis a particular way), and its recommended course of drug treatment. 
{{< /blockquote >}}

## b.) 
{{< blockquote author="Vampire, Wikipedia" id="Vampire-quote" >}}
[Vampire](https://en.wikipedia.org/wiki/Vampire_(theorem_prover)) is an automatic theorem prover for first-order classical logic developed in the Department of Computer Science at the University of Manchester. Vampire's kernel implements the calculi of ordered binary resolution and superposition (for handling equality). The splitting rule and negative equality splitting can be simulated by the introduction of new predicate definitions and dynamic folding of such definitions. A DPLL-style algorithm splitting is also supported. A number of standard redundancy criteria and simplification techniques are used for pruning the search space: tautology deletion, subsumption resolution, rewriting by ordered unit equalities, basicness restrictions and irreducibility of substitution terms. The reduction ordering on terms is the standard Knuth–Bendix ordering.
{{< /blockquote >}}

## c.) 
{{< blockquote author="SOFM, Wikipedia" id="SOFM-quote" >}}
A [self-organizing map](https://en.wikipedia.org/wiki/Self-organizing_map) (SOM) or self-organizing feature map (SOFM) is an unsupervised machine learning technique used to produce a low-dimensional (typically two-dimensional) representation of a higher-dimensional data set while preserving the topological structure of the data. For example, a data set with p variables measured in n observations could be represented as clusters of observations with similar values for the variables. These clusters then could be visualized as a two-dimensional "map" such that observations in proximal clusters have more similar values than observations in distal clusters. This can make high-dimensional data easier to visualize and analyze.
{{< /blockquote >}}

## d.)
{{< blockquote author="ELIZA, Wikipedia" id="ELIZA-quote" >}}
[ELIZA](https://en.wikipedia.org/wiki/ELIZA) is an early natural language processing computer program developed from 1964 to 1967 at MIT by Joseph Weizenbaum. Created to explore communication between humans and machines, ELIZA simulated conversation by using a pattern matching and substitution methodology that gave users an illusion of understanding on the part of the program, but had no representation that could be considered really understanding what was being said by either party. ELIZA itself examined the text for keywords, applied values to said keywords, and transformed the input into an output; the script that ELIZA ran determined the keywords, set the values of keywords, and set the rules of transformation for the output.
{{< /blockquote >}}

## e.) 
{{< blockquote author="LDA, Wikipedia" id="LDA-quote" >}}
In natural language processing, [latent Dirichlet allocation](https://en.wikipedia.org/wiki/Latent_Dirichlet_allocation#Inference) (LDA) is a Bayesian network (and, therefore, a generative statistical model) for modeling automatically extracted topics in textual corpora. The LDA is an example of a Bayesian topic model. In this, observations (e.g., words) are collected into documents, and each word's presence is attributable to one of the document's topics. Each document will contain a small number of topics. Documents are represented as random mixtures over latent topics, where each topic is characterized by a distribution over all the words. 
{{< /blockquote >}}

## f.)
{{< blockquote author="SVM, Wikipedia" id="SVM-quote" >}}
In machine learning, [support vector machines](https://en.wikipedia.org/wiki/Support_vector_machine) (SVMs, also support vector networks) are supervised max-margin models with associated learning algorithms that analyze data for classification and regression analysis. SVMs can efficiently perform non-linear classification using the kernel trick, representing the data only through a set of pairwise similarity comparisons between the original data points using a kernel function, which transforms them into coordinates in a higher-dimensional feature space. Thus, SVMs use the kernel trick to implicitly map their inputs into high-dimensional feature spaces, where linear classification can be performed.
{{< /blockquote >}}

## Solution {#symbolic-or-subsymbolicSolution .solution}

**a.)** MYCIN is a _symbolic system_, because its knoweldge is encoded explicitly as about 600 rules, each of which has a claer antecedent (if-condition) and consequent (then-condition) structure: "if [symptom/criteria], then [diagnostic or treatment fact]. During a consultation, MYCIN's inference engine performs backward chaining over those rules: it strats from a hypothesis and works backward, asking the user yes/no or textual questions to verify which rules' conditions hold. At the end of a session, MYCIN prints out exactly which questions it asked, which rules fired, how it computed confidence scores, and why it ranked bacteria in a certain order. Because everything is represented as discrete symbols, and because the inference mechanism manipulates those symbols according to logic production rules, MYCIN is one of the typical symbolic AI systems.

**b.)** Vampire is a _symblic system_, since it is an automatic theorem prover for first-oreder classical logic, and it operates entirely by manipulating symbolic clauses. Its core kernel implements ordered binary resolution and superposition, both of which are pure logical inference methods over symbolic expressions. When Vampire searches for a proof, it treats every proposition as a structure of function symbols, predicate symbols, and variables. It applies resolution rules to thoses literals, tries to unify terms symbolically, and prunes search branches using well-defined redundancy criteria (e.g., subsumption, tautology deletion, rewrite rules). All of these operations occur on discrete symbols rather than on numeric vecters or statistical parameters. Because Vampire's entire "knowledge" is the set of logical axioms and conjectures expressed symbolically, and because its inference mechanism is purely rule-based symbol manipulation, Vampire is a symbolic system.

**c.)** SOFM is an example of a _subsymbolic system_, because the computations the system makes are governed by continuous weight vectors and iterative adjustment via a neighborhood function. There is no explicit, human-readable rule like "if [some symbolic condition] then [assign to cluster X]". Instead, each neuron in the map has a weight vector, and during training the network iteratively adjusts those weights so that nearby neurons in the two-dimensional lattice come to represent similar input patterns. Since the system's knowledge is embedded in continuous numeric parameters and the learning algorithm is based on iterative numeric adjustments rather than symbolic rules, SOFMs are subsymbolic.

**d.)** ELIZA contains no numeric learning or statistical modeling, but relies entirely on a set of pattern-matching rules, which makes it a _symbolic system_. Each rule consists of patterns (literal strings) and associated response templates. For example, if the user's input matches the pattern "I am feeling X", ELIZA might respond by transforming "I am feeling X" into "Why are you feeling X?" or "Do you often feel X?" All transformations are simple text substitutions based on pattern matching. Altough the output often gives an illusion of understanding, under the hood of ELIZA never computes any numeric score or probabilistic weight, it just looks for matching keywords and applies the corresponding transformation rules. Since all its behavior comes from explicit scripts, and because there is no hidden continous state, ELIZA is purely symbolic. 

**e.)** LDA is an example of a _subsymbolic system_ which is a generative probaliistic model in which topics are latent (hidden) variables, and documents are assumed to be mixtures over those topics. The core of LDA is a graphical (Bayesian) network in which each document has a probability distribution over K topics, and each topic is itself a probability distribution over the vocabulary. Although topics are sometimes describes in words, those are numeric porbability vectors. There are no explicit it-then-rules. Instead, topics are soft distributions over words. Since LDA's behavior is entirely driven by numeric latent variables, and it lacks any explicit discrete rule set, it is subsymbolic.

**f.)** SVMs is a _subsymbolic system_, because it relies on continuous parameters learned via optimalization, and because knowledge is hidden in support-vector coefficients rather than expressed as logical rules. SVMs are supervised learning models that learn a decision boundary (hyperplane) by solving a convex quadratic optimalization problem. Each training instance is mapped into a feature space, and the algorithm finds the maximum-margin hyperplane that seperates classes. Because SVM is a maximum-margin numeric classifier, it is a typical example of a symbolic system.

# Thinking, fast and slow { .solved }

Give at least 3 new examples of system 1 and system 2 thinking and explain why. 

## a.)

System 1

## b.)

System 2

## Solution {#thinking-fast-and-slowSolution .solution}

**a.)** [System 1](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow) thinking, which is fast, automatic, intuitive, unconscious, associative. For example:

*  To localize the source of a specific sound is a typical example of System 1 thinking, since the process happens unconsious and automatic. The brains registers auditory stimili and, within a fraction of a second, converts them into a rough spatial estimate (e.g., "it sounds like it's behind me"). This happens without any conscious analysis of frequencies or time differences.Actually, it is largely a reflective, evolutionarily conditioned reaction that helps one detect danger or other relevant cues quickly.
* The understanding of simple sentences in a native language is an example of System 1 thinking if one masters the language fluently. Then, one recognizes the structures of sentences, word order and semantics so quickly that one doesn't need to consciously think about them. A sentence like "The book is on the table" is understood almost immediately, without any explicit grammatical analysis. However, if the sentences is grammatically complex, ambiguous or new, one would use System 2 thinking to break it down, even though the sentence is in someone's native language.
* Reaching out to grab something that falls, is a reflexive motor pattern. As soon as one sees that something is about to fall, visual and proprioceptive signals send information to your hand-eye coordination System, causing one to reach out. There is no time or space for conscious thought, this happens unconsciously in a split second.
* Forming the mental image associated with the word "book" is an example of System 1 thinking, because, when one hears or reads the word "book", the brain instantly and automatically triggers a visual and semantic schema which creates the image of a cover, pages, printed or written text and ensambles this to an image of a book. This requires almost no conscious or rational interpretation, since it comes from automated, associative memory links. On the other hand, one might object that forming a mental image could be a form of System 2 thinking as well. For instance, if one reflects on which specific book is meant and how that book looks like, then one needs a deliberate step-by-step mental construction.
* An AI System for facial recognition on a phone recognizes faces automatically without “thinking” about what a face looks like. This is a System 1 kind of thinking for the user of the phone. The phone unlocks almost instantly when on's face is detected, without one thinks consciously about what exactly constitutes a "face". The algorithm processes facial features rapidly via trained neural networks: the associations between pixel patterns and facial characteristics occur largely unconsciously. 
* Algorithms that recommended content based on viewing history, without explenation why this is recommended, is an example of System 1 thinking. For the user, it fells like an immediate suggestion that catches one's eye without needing to think about the why or how. The algorithm itself relies on generated correlations and patterns from datasets, which are performed quickly. So the recommendation pops up right away. 
* Voice assistent like Siri or Alexa use System 1 thinking: the voice assistent instantly interprets and responds to a simple command like "What time is it?" When one speaks a phrase to the voice assistent, almost immediately the answer appears. Siri or Alexa doesn't think about it. The process of speech recognition, intent interpretation and responce generation runs in an optimized and automated sequence. For the user, there is no slow, conscious analysis. Instead, it feels intuitive and instantaneous. 
* AI model that detects spam in emails uses System 1 thinking: based on pattern recognition and prior data, it  automatically classifies a message as spam. As soom as an email arrives, it seamlessly passes through a pretained classification model and ends up in the spam folder or inbox without setting explicit rules. Thinking about wheter something is spam, is not necessary, the system recognizes it unconsciously.
* Simple chatbots, such as ChatGPT-3.5 that react fast and do not reason much, which make them an example of System 1 thinking. A user asks a simple question and almost immediately receives a (hopefully) coherent answer. The chatbot relies mostly on automatic, subsymbolic processes to generate text, withou reasoning about the content. Besides, the user doesn't see the internal logic or reasoning steps. However, the boundary is blurry: when the chatbot has to perform multilayered reasoning, it begins to use System 2 thinking. 


**b.)** [System 2](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow) thinking, which is slow, deliberate, conscious, logical, calculating. For example:

* Solving a complex arithmetic calculation requires focused attention, step-by-step reasoning and memory. These are aspects that indicate System 2 thinking, because one needs to deliberately apply arithmetic rules and keep track of intermediate steps. However, for some people who are really capable of mathemtics, these complex caluculation can be System 1 thinking as well. They can perform complex arithemtic rapidly and seemingly effortlessly, often without needing to go through conscious, step-by-step logic each time. Indeed, they may use mental shortcuts or visual strategies that bypass traditional calculation steps or their working and long-term memory for numbers and patterns are highly trained. 
* Finding the solution for a multi-criteria optimalization problem is typically System 2 thinking. These problems involve evaluating trade-offs between competing variables, oten using algorithms or logical reasoning. Optimalization requires listing out each criterion, assigning relative weights and then comparing all alternatives systematically. This approach is slow, deliberate and explicitly logical.
* Trying to identify the source of an unfamiliar sound or analyze a musical chord structure are examples of System 2 thinking, because it involves methodical processes withut memorizing. Breaking down a chord means consciously naming each pitch, recognizing interval relationships, and mapping it back onto music theory. Both tasks demand focused attention, conscious comparison to mental templates and step-wise inference. On the other hand, an experiences mechanic or audiophile often instantly knows that a ratcheting click at a perticular frequency means a loose piston pin. Likewise, a trained musician or ear-trainer can identify a complex chord by ear almost reflexively. Years of exposure have bundled the steps into an automatic pattern match, now functioning like System 1.
* Count the number of A's in a certain text requires full concentration. One must consciously move letter by letter, keep an accurate count, perhaps use pen-and-paper, and maintain vigilance to avoid losing track.
* Determine the price/quality ratio of two phones is an example of System 2 thinking, because it demands conscious, logical and caluculating thinking. If one determines the ratio, one first gatters the important information and relevant specification that determine the quality of the phone. Then one should normalize the specification, to make sure all variables are converted to a common scale. One makes use of its mental competences and step-by-step logic, while computing the price/quality ratio. The last step is the interpreation of those ratios which requires conscious consideration. This all is System 2 thinking, one actively reflects on what is or is not relevant to the context.
* To determine the validity of a complex logical reasoning, one should consciously map premises, consider contrapositives, check for fallacies, possibly draw a truth table, and ensure that each inference follows logically. This conscious, logical proof is typically System 2 thinking. 
* AI model that can play chess, like [AlphaZero](https://en.wikipedia.org/wiki/AlphaZero), that analyzes all possible moves and learns every strategy, can be considered as an example of System 2 thinking. When a human grandmaster faces a novel position, he might engage in complex "tree search", calculating forcing variation, evaluating material imbalances, and computing candidate lines many moves deep. This exhaustive mental process matches the description of System 2, as it is a slower, effortful and rule-based analysis. AI models like AlphaZero use a neural network that doesn't litteraly "reason" move-by-move as humans do, but it uses a learned value network to evaluate positions quickly. The algorithm searches subtrees.
* [ChatGPT-4](https://en.wikipedia.org/wiki/GPT-4) is able to use resoning for functional programming, which van be considered as System 2 thinking. If one prompts GPT-4 to write a Python function that finds all prime factors of a large integer, it stimulates internally, step-by-step, the algorithm: trial division, recursion, memoization of known primes. It assembles correct code tokens based on logical patterns. This chain-of-thought that GPT-4 deploys, especially when it is asked for explanation, resembles System 2: deliberate, token-by-token reasoning about how to structure, map, filter and recursion.
* AI models like [WolframAlpha](https://en.wikipedia.org/wiki/WolframAlpha) are used to solve complex mathematical problems and analyze data, which is an example of System 2 thinking. WolframAlpha frequently shows a stepwise solution. Each intermediate, applying intergration by parts, simplifying each term, substituting limits, is askin to System 2 reasoning. It explicitly follows mathematical rules and apllies formulae. 


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

