---
title: Logic and AI
subtitle: test
locked: false
author: Johannes Korbmacher
weight: 10
params:
  id: exc-laa
---
# Definitions { .solved }

_Note_: A definition needs to fully explain the meaning of a concept. This is
typically done by saying under which precise conditions the concept applies.
That is, the answer should have the form like "An {{< term "inference" "inference" >}} is ... and consists of..." or "An AI system is symbolic just in case ...".

1. *Inference.*

   Give a definition of inference. Include examples (where your definition applies)
   and non-examples (where it does not). Make sure to explain why your definition
   applies or not.

2. *Symbolic AI.*

   Give a definition of symbolic AI. Include examples and non-examples with explanations.

## Solution {#definitionsSolution .solution}
These are examples of good answers.

1. An inference is a piece of reasoning in which one or more statements,
   the {{< term "premise" "premises" >}}, are put forward as reasons for accepting another statement, the
   {{< term "conclusion" "conclusion" >}}. An inference can be {{< term "validity" "valid or invalid" >}}: what makes it an inference
   is that the premises are offered in support of the conclusion, whether or not
   they actually support it.

   For example: all humans are mortal; Socrates is human; so Socrates is mortal.
   This is a deductively valid inference: the premises cannot be true while the
   conclusion is false.

   An example of {{< term "inductive-support" "inductive" >}} inference is: the last hundred swans observed in this
   region were white; so the next swan observed here will also be white. The
   observations are offered as evidence for the prediction, but they do not
   guarantee it.

   “The moon shines at night, so Socrates is a philosopher” is also an inference,
   although the premise gives no reason to accept the conclusion. A non-example
   would be the list “The moon shines at night. Socrates is a philosopher.” when
   these statements are simply reported, with neither offered as a reason for
   the other.

2. A symbolic AI system represents information with explicit symbols
   and processes those representations using rules. The symbols and rules have
   an interpretation: for example, a symbol may stand for a person, and a rule
   may express a condition for admitting them to a building.

   A rule-based expert system is an example. It stores facts and rules and
   uses an inference engine to draw conclusions from them. A pattern-matching
   chatbot is another example; a separate {{< term "knowledge-base" "knowledge base" >}} isn't required for
   every symbolic system.

   A neural network that learns to classify pictures from numerical weights is
   a subsymbolic example. Its learned representation needn't consist of explicit
   facts and inference rules. A system can also combine both approaches: a
   network might recognize an object and pass that result to a symbolic planner.

# Examples of indicators { .solved }

Give at least 5 examples of:

1. {{< term "premise-indicator" "premise indicators" >}},


2. {{< term "inference-indicator" "inference indicators" >}}.


## Solution {#examples-of-indicatorsSolution .solution}

1. Because, since, given that, assuming that, on the grounds that.
   These can introduce premises; their role depends on the sentence. For example,
   "since Monday" gives a time, not a reason.

2. It follows that, thus, hence, consequently, we know that, therefore, so, accordingly, then, as a result, this implies that.


# Recognizing indicators { .solved }
Name the premise and inference indicators in the following paragraphs.

1. Because $∀I$ knows the location of every book in the library, and the student asks for a specific title, it follows that $∀I$ can guide the user directly to the book's shelf.


2. If $∀I$ detects that a student struggles with mathematics, then it recommends extra practice problems. Since the student's last test scores were low, $∀I$ suggests additional exercises.


3. $∀I$ thinks that he recognizes the face of a student entering the classroom. When a face is recognized by $∀I$, then it marks attendance automatically in the specific class. $∀I$ remembers the face of the student, but the student is actually in another class. Consequently, the attendance is not recorded.


4. <span id="e"></span>If $∀I$ detects pronunciation errors in a student's speech, it will provide corrective feedback. Given that the student is practicing regularly, the student improves their pronunciation over time.


## Solution {#recognizing-indicatorsSolution .solution}

1. Premise indicator: because. Conclusion indicator: it follows that.
   The word "and" joins parts of a premise.

2. Premise indicator: since. There is no explicit conclusion indicator.
   "If ... then ..." expresses a conditional within a premise.

3. Conclusion indicator: consequently. There is no explicit premise indicator.
   "When ... then ..." expresses a conditional within a premise.

4. Premise indicator: given that. There is no explicit conclusion indicator.
   "If" introduces a conditional within a premise.

# Inferences { .solved }
Identify the premises and conclusion of each inference. Some passages contain
more than one inference: distinguish intermediate conclusions from the final
conclusion. Identifying an inference does not establish that it is valid.

1. The robot $∀I$ rides towards the entrance of the supermarket. The supermarket's automatic sliding doors open, when someone stands in front of the sensor. The sensor detects $∀I$. Therefore, the supermarket's automatic doors open.


2. Since the robot $∀I$ nests itself in the phone, it is able to take over the function of Face ID. If $∀I$ recognizes the face, it will unlock the phone. A phone's user, $∃n$, picks up the phone and tries to unlock it by showing its face to the phone. However, $∀I$ doesn't know $∃n$, so the phone stays locked.


3. If $∀I$ notices that the milk is running low, it directly orders new milk. The ordered milk will arrive tomorrow, because $∃n$ delivers milk the day after the order is made by $∀I$.


4. $∀I$ (in the personality of an autonomous driving car), at a red traffic light either brakes or chooses an alternative route. Since $∀I$ isn't braking, it must currently be still driving. Thus, it should have chosen another route.


5. If $∀I$ notices that energy consumption is low at night, it turns off devices, and if $∀I$ detects peak consumption, it shifts usage to cheaper hours. But energy consumption is now either low or there is peak consumption. So, $∀I$ either turns off devices or shifts usage to cheaper hours.


6. If $∀I$ detects plagiarism in an assignment, the teacher is alerted. The teacher was not alerted. Consequently, $∀I$ did not detect plagiarism.


7. $∀I$ is a useful additional teacher to students, because $∀I$ carefully analyzes the submitted homework to spot areas where the student struggles. Since $∀I$ can identify these specific weaknesses, it knows exactly what advice to give to help the student improve. Moreover, thanks to the help of $∀I$, the teacher can focus on more structural or analytical explanations.


## Solution {#inferencesSolution .solution}

1. The door opens when its sensor detects someone, and the sensor detects
   $∀I$. These are the premises for the conclusion that the door opens.
   $∀I$'s approach to the supermarket supplies background.

2. There are three linked inferences. From being installed on the phone,
   $∀I$ is said to be able to take over Face ID. The conditional says that
   recognizing a face is sufficient for unlocking. Finally, the passage concludes
   that the phone stays locked because $∀I$ doesn't know $∃n$.
   That last inference needs an additional assumption: unlocking requires
   recognition, and $∀I$ does not recognize this user. The stated conditional
   alone does not say what happens without recognition.

3. The conclusion is that the milk will arrive tomorrow. The explicit
   premise is that $∃n$ delivers on the day after an order. A further premise is
   needed: an order was made today. The first conditional doesn't by itself
   establish that $∀I$ noticed a shortage or placed an order.

4. The main premises are that $∀I$ either brakes or chooses another
   route, and that $∀I$ isn't braking. The final conclusion is that $∀I$ chose
   another route. The passage also infers that $∀I$ is still driving from its
   not braking; that intermediate inference needs further assumptions.

5. The premises are the two conditionals and the statement that
   consumption is either low or at its peak. The conclusion is that $∀I$
   either turns off devices or shifts their use to cheaper hours.

6. The premises are that detecting plagiarism triggers an alert, and
   that there was no alert. The conclusion is that $∀I$ did not detect plagiarism.

7. The main conclusion is that $∀I$ is a useful additional teacher.
   Its analysis of homework, its identification of weaknesses, and the time
   it frees for the teacher are offered in support. There is also an intermediate
   inference: because $∀I$ identifies weaknesses, it knows what advice to give.
   Identifying weaknesses alone doesn't guarantee that advice will be useful.

# Symbolic or subsymbolic { .solved }

Below are technical descriptions of different AI systems taken from Wikipedia. In each case, classify the system as either symbolic or sub-symbolic system based on the description. Justify your answer by referencing the relevant aspects.

1. {{< blockquote author="MYCIN, Wikipedia" id="MYCIN-quote" >}}
   [MYCIN](https://en.wikipedia.org/wiki/Mycin) was an early backward chaining expert system that used artificial intelligence to identify bacteria causing severe infections, such as bacteremia and meningitis, and to recommend antibiotics, with the dosage adjusted for patient's body weight. MYCIN operated using a fairly simple inference engine and a knowledge base of ~600 rules by obtaining individual inferential facts identified by experts and encoding such facts as individual production rules. No other AI program at the time contained as much domain-specific knowledge clearly separated from its inference procedures as MYCIN. It would query the physician running the program via a long series of simple yes/no or textual questions. At the end, it provided a list of possible culprit bacteria ranked from high to low based on the probability of each diagnosis, its confidence in each diagnosis' probability, the reasoning behind each diagnosis (that is, MYCIN would also list the questions and rules which led it to rank a diagnosis a particular way), and its recommended course of drug treatment.
   {{< /blockquote >}}

2. {{< blockquote author="Vampire, Wikipedia" id="Vampire-quote" >}}
   [Vampire](https://en.wikipedia.org/wiki/Vampire_(theorem_prover)) is an automatic theorem prover for first-order classical logic developed in the Department of Computer Science at the University of Manchester. Vampire's kernel implements the calculi of ordered binary resolution and superposition (for handling equality). The splitting rule and negative equality splitting can be simulated by the introduction of new predicate definitions and dynamic folding of such definitions. A DPLL-style algorithm splitting is also supported. A number of standard redundancy criteria and simplification techniques are used for pruning the search space: tautology deletion, subsumption resolution, rewriting by ordered unit equalities, basicness restrictions and irreducibility of substitution terms. The reduction ordering on terms is the standard Knuth–Bendix ordering.
   {{< /blockquote >}}

3. {{< blockquote author="SOFM, Wikipedia" id="SOFM-quote" >}}
   A [self-organizing map](https://en.wikipedia.org/wiki/Self-organizing_map) (SOM) or self-organizing feature map (SOFM) is an unsupervised machine learning technique used to produce a low-dimensional (typically two-dimensional) representation of a higher-dimensional data set while preserving the topological structure of the data. For example, a data set with p variables measured in n observations could be represented as clusters of observations with similar values for the variables. These clusters then could be visualized as a two-dimensional "map" such that observations in proximal clusters have more similar values than observations in distal clusters. This can make high-dimensional data easier to visualize and analyze.
   {{< /blockquote >}}

4. {{< blockquote author="ELIZA, Wikipedia" id="ELIZA-quote" >}}
   [ELIZA](https://en.wikipedia.org/wiki/ELIZA) is an early natural language processing computer program developed from 1964 to 1967 at MIT by Joseph Weizenbaum. Created to explore communication between humans and machines, ELIZA simulated conversation by using a pattern matching and substitution methodology that gave users an illusion of understanding on the part of the program, but had no representation that could be considered really understanding what was being said by either party. ELIZA itself examined the text for keywords, applied values to said keywords, and transformed the input into an output; the script that ELIZA ran determined the keywords, set the values of keywords, and set the rules of transformation for the output.
   {{< /blockquote >}}

5. {{< blockquote author="LDA, Wikipedia" id="LDA-quote" >}}
   In natural language processing, [latent Dirichlet allocation](https://en.wikipedia.org/wiki/Latent_Dirichlet_allocation#Inference) (LDA) is a Bayesian network (and, therefore, a generative statistical model) for modeling automatically extracted topics in textual corpora. The LDA is an example of a Bayesian topic model. In this, observations (e.g., words) are collected into documents, and each word's presence is attributable to one of the document's topics. Each document will contain a small number of topics. Documents are represented as random mixtures over latent topics, where each topic is characterized by a distribution over all the words.
   {{< /blockquote >}}

6. {{< blockquote author="SVM, Wikipedia" id="SVM-quote" >}}
   In machine learning, [support vector machines](https://en.wikipedia.org/wiki/Support_vector_machine) (SVMs, also support vector networks) are supervised max-margin models with associated learning algorithms that analyze data for classification and regression analysis. SVMs can efficiently perform non-linear classification using the kernel trick, representing the data only through a set of pairwise similarity comparisons between the original data points using a kernel function, which transforms them into coordinates in a higher-dimensional feature space. Thus, SVMs use the kernel trick to implicitly map their inputs into high-dimensional feature spaces, where linear classification can be performed.
   {{< /blockquote >}}

## Solution {#symbolic-or-subsymbolicSolution .solution}

1. MYCIN is symbolic: it stores explicit rules and applies them through
   an inference engine. Its use of numerical certainty factors does not change
   that classification. These factors should not simply be identified with
   probabilities, as the quoted description suggests.

2. Vampire is symbolic: it represents formulas explicitly and applies
   formal proof rules to them.

3. A self-organizing map is subsymbolic: its learned representation
   consists of weight vectors arranged through numerical training.

4. ELIZA is symbolic: it matches patterns and transforms strings
   according to explicit rules. Symbolic processing needn't amount to understanding.

5. LDA fits the subsymbolic side of this comparison: it learns numerical
   distributions over topics and words. Its mathematical description includes
   explicit variables, but the learned topics aren't a set of logical inference
   rules. The symbolic/subsymbolic distinction is a broad classification, and
   probabilistic models needn't fit it as neatly as the other examples.

6. An SVM is subsymbolic: its learned decision function uses numerical
   parameters and similarities between examples, rather than an explicit set of
   logical rules. A soft-margin SVM can allow classification errors; its training
   data needn't be perfectly separable.

# Thinking, fast and slow { .solved }

Give at least 3 examples of system 1 and system 2 thinking and explain why.

1. {{< term "system-1" "System 1" >}}


2. {{< term "system-2" "System 2" >}}


## Solution {#thinking-fast-and-slowSolution .solution}

These are possible examples. Whether a task requires deliberate attention
also depends on the person's experience.

1. System 1:

   - Recognizing a familiar friend's face, without comparing features deliberately.
   - Understanding a simple sentence in your native language as you hear it.
   - Immediately answering "four" when asked for two plus two, through familiarity.

2. System 2:

   - Multiplying two unfamiliar three-digit numbers by working through the steps.
   - Comparing two travel plans by calculating their costs and checking connections.
   - Checking an argument by identifying its premises and looking for a counterexample.

   The distinction describes human cognitive processes. Applying it to AI is
   an analogy; an application's speed alone doesn't establish how it reasons.

# Following a chain of reasons {.solved #chain-of-reasons}

$∀I$ uses these rules at a library:

- Every registered student may borrow books.
- Anyone who may borrow books may reserve a book.
- Ada is a registered student.

1. What can $∀I$ conclude about Ada? Give the reasoning in steps.
2. Bob may reserve a book. Must Bob be a registered student?
3. A camera incorrectly identifies a visitor as Ada. Can correct application
   of the rules guarantee that the visitor may borrow books? Explain.

## Solution {.solution #chain-of-reasonsSolution}

1. Ada may borrow books, by the first rule and the fact about her registration.
   From that intermediate conclusion and the second rule, she may reserve a book.
2. No. The rules give sufficient conditions, not necessary ones. Bob might have
   permission through a staff account without being a registered student.
3. No. The reasoning depends on the accuracy of the identification as well as
   the rules. Correct reasoning from a mistaken premise needn't yield a true conclusion.

# What follows? {#what-follows}

An inference may guarantee its conclusion, give us a reason to expect it,
or offer too little support. For each case, take the premises as given and
choose the strongest assessment they warrant:

1. *Deductive guarantee*: the conclusion cannot be false if the premises are true.
2. *Inductive support*: the premises give a reason to expect the conclusion,
   but leave room for error.
3. *Insufficient support*: the premises give no adequate reason to accept
   this conclusion; they may even count against it.

Here we're assessing inductive support informally, using the information in
the example. Don't add unstated assumptions about how a system usually works.
Before choosing, explain your answer to a partner. Then compare your reasons
with the app's feedback.

{{< logic-app name="reasoning-practice" >}}

# Combining approaches {.solved #combining-approaches}

A delivery robot uses a neural network trained on photographs to detect doors.
A separate component uses a map and explicit rules about accessible routes
to plan a delivery.

1. Which component is subsymbolic and which is symbolic? Explain.
2. Give an error that could arise in each component.
3. Suggest one check that could help detect each error.

## Solution {.solution #combining-approachesSolution}

1. The detector is subsymbolic: recognition depends on learned numerical weights.
   The planner is symbolic: it processes explicit locations and route rules.
2. The detector could mistake a poster for a door. The planner could use an
   outdated rule saying a locked corridor is accessible.
3. A second sensor or a human could check the detected door. Comparing the map
   with current access information could reveal the outdated rule. These checks
   can reduce errors; neither guarantees that all information is correct.

# Research { .solved }

_Note_: These questions require you to do your own research, using reliable
academic sources. You need to reference your sources!

1. *Decidability.*

   Are _all_ logical systems undecidable?

2. *Symbolic AI.*

   Give 2 examples of existing expert systems, one that "failed" and one that's
   still in use today. Explain why the first one failed.

## Solution {#researchSolution .solution}
These are examples of possible answers.

1. No. For example, classical propositional validity is {{< term "decidable" "decidable" >}}.
   Each formula contains only finitely many variables, even though the language
   has infinitely many available. We can check all truth assignments to the
   variables in that formula. It is valid exactly when every assignment makes
   it true. The procedure always terminates.

   Classical first-order validity is undecidable: no algorithm decides validity
   for every first-order formula. Be precise about the problem being decided;
   checking whether a string is well formed is a different problem from checking
   validity. See the [Open Logic Project's *Sets, Logic, Computation*](https://slc.openlogicproject.org/),
   which covers both truth tables and undecidability.

2. An example of an expert system that failed is MYCIN, which was focused on diagnosis and treatment of bacterial infections. It used an explicit collection of diagnostic and treatment rules. Moreover, it used certainty factors to handle uncertainty. Despite outperforming some human doctors in limited tests, MYCIN was never put into routine clinical use. It could explain which rules
   it had used, but good performance and rule explanations alone did not ensure
   that physicians would adopt it. Its developers reported difficulties with the
   consultation interface and with fitting the system into clinical practice.
   See Buchanan and Shortliffe, [*Rule-Based Expert Systems*, Chapter 36,
   sections 36.2.7–36.2.8](https://www.shortliffe.net/Buchanan-Shortliffe-1984/Chapter-36.pdf).

   For a current example, Cyc combines a knowledge base with a symbolic
   reasoning engine. Its developer describes healthcare products using that
   platform and reports hospital deployments. This supports its use as a current
   example, though the developer's performance claims would need independent
   assessment. See [Cyc's product overview](https://cyc.com/) and
   [description of the platform](https://cyc.com/about-us/). State when you
   checked a source when answering a question about current use.

# Discussion {.solved}

_Note_: The following questions require argumentative writing, i.e. you're asked
to take an informed view on the question, clearly state your position, and the
reasons for it.

1. *Logic and system 2.*

   Is all logical thinking system 2 thinking?

2. *Minds and machines.*

   Does Gödel's theorem show that we cannot build a logic-based AGI?

## Solution {#discussionSolution .solution}

1. No. An experienced reasoner may immediately recognize a familiar
   inference pattern. Checking an unfamiliar argument step by step usually
   requires deliberate attention. The distinction concerns how someone reasons,
   not whether the resulting inference is logical or correct.

2. No such conclusion follows from Gödel's theorem alone. The first
   incompleteness theorem applies to consistent, effectively axiomatized theories
   strong enough to express elementary arithmetic. See the Open Logic Project's
   [*Incompleteness and Computability*](https://ic.openlogicproject.org/ic-print.pdf) (PDF). Such a theory cannot decide
   every arithmetic sentence by proving it or its negation.

   An argument against logic-based AGI would need further premises: for example,
   that intelligence requires settling every arithmetic question, and that humans
   can do so correctly. Gödel's theorem establishes neither claim. Extending a
   theory may settle some previously undecided questions, but an effective,
   consistent extension of sufficient strength is subject to the theorem too.

