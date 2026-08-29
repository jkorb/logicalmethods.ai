---
title: Logic and AI
subtitle: test
author: Annefleur de Haan
weight: 1
params: 
  id: exc-laa
---
# Multiple choice questions to test your knowledge
## Inferences { .solved }
**Which of the following statements is true about inferences?**
- [ ] An inference is simply any collection of sentences.
- [X] An inference consists of one or more premises and a conclusion, with their indicators, together forming an argument for a claim. 
- [ ] An inference combines multiple conclusions to produce a single premise for later reasoning.
- [ ] An inference always requires numerical data or statistical evidence to support the conclusion.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('inferencesSolution','exc-laa')">
  Show explanation
</button>

<div id="inferencesSolution" class="collapse">
  <p><em>An inference consists of one or more premises and a conclusion, with their indicators, together forming an argument for a claim.</em></p>
  <p>An inference by definition links explicit premises (with indicators like “since” and “because”) to a conclusion. The other options either omit premises or mischaracterize how conclusions are formed.</p>
</div>

## Logical systems 1 { .solved }
**What is a logical system?**
- [X] A logical system is a system that consists of a component that is responsible for determination whether an inference is valid, the language of the inferences, and the meaning of the premises and conclusions.
- [ ] A logical system is a software library that contains precompiled proofs but has no formal rules for deriving new conclusions.
- [ ] A logical system is a set of inference rules only, where the meaning of symbols and the language of expressions are considered not relevant.
- [ ] A logical system is defined solely by its semantics (interpretations of symbols), with no corresponding syntactic rules or proof theory.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('logical-systems-1Solution','exc-laa')">
  Show explanation
</button>

<div id="logical-systems-1Solution" class="collapse">
  <p>Correct answer: <em>A logical system is a system that consists of a component that is responsible for determination whether an inference is valid, the language of the inferences, and the meaning of the premises and conclusions.</em></p>
  <p>A logical system has three parts: syntax (language of the inference), semantics (meaning), and proof theory (validity checking). The incorrect options each leave out one of these crucial components.</p>
</div>


## Logical systems 2 { .solved}
**Which of the following statements is true about logical systems?**
- [X] A category of a logical system is one that assumes that every sentence is true or false, which is called classical logic.
- [ ] Propositional logic is a logical system that is classified by the background assumptions. 
- [ ] Quantifiers are used in modal logic.
- [X] A way of classifying logical systems is by the kind of inferences they deal with.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('logical-systems-2Solution','exc-laa')">
  Show explanation
</button>

<div id="logical-systems-2Solution" class="collapse">
  <p>Correct answers: <em>A category of a logical system is one that assumes that every sentence is true or false, which is called classical logic.

  A way of classifying logical systems is by the kind of inferences they deal with.</em></p>
  <p>Both are true, because classical logic’s hallmark is bivalence (“true or false”) and logical systems differ (e.g., propositional vs. predicate) by the inference rules they support. The distractors confuse systems (“quantifiers in modal logic” is false, “propositional logic classified by background assumptions” is garbled).</p>
</div>

# AI { .solved}
**What is AI?**
- [ ] AI is the worldwide network of webcams that observes human behavior and predicts human actions.
- [ ] AI is the technology to program computers, to make sure that they function without human interaction.
- [X] Models and replication of "intelligent behavior", in the broad sense of the emulation of human abilities with a computer system, is studied by AI.
- [ ] Models and replications of "intelligent behavior" are studied by AI via MRI scans and neurological research.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('aiSolution','exc-laa')">
  Show explanation
</button>

<div id="aiSolution" class="collapse">
  <p>Correct answer: <em>Models and replication of "intelligent behavior", in the broad sense of the emulation of human abilities with a computer system, is studied by AI.</em></p>
  <p>AI studies how to build models that emulate human-like intelligent tasks. The false options describe surveillance, generic automation, or neuroscience research rather than modeling intelligence.</p>
</div>


# Logic and AI { .solved}
**Why is logic considered a foundational subdiscipline of AI?**
- [ ] Because logical systems are practical tools for automating all AI applications in industry.
- [X] Because valid inference is paradigmatic intelligent behavior, so logical systems model what AI aims to replicate.
- [ ] Because logic's primary aim is to optimize machine learning algorithms for speed and efficiency.
- [ ] Because logic deals exclusively with hardware design, which underlies AI systems.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('logic-and-aiSolution','exc-laa')">
  Show explanation
</button>

<div id="logic-and-aiSolution" class="collapse">
  <p>Correct answer: <em>Because valid inference is paradigmatic intelligent behavior, so logical systems model what AI aims to replicate.</em></p>
  <p>Valid inference is paradigmatic intelligent behavior. What we call intelligent, namely drawing valid conclusions based on known facts, is formalized in logical systems. Logic therefore forms a foundation for AI, because the formalization of valid reasoning precisely matches what AI models.</p>
</div>

# Expert systems { .solved}
**Which of the following best explains why expert systems (symbolic AI) struggled to scale and ultimately contributed to the decline of symbolic approaches?**
- [ ] They required neural networks to process if-then rules, which dramatically increased hardware costs.
- [ ] Expert systems could only be written in LISP, limiting their applicability to modern programming environments.
- [X] It was extremely difficult and time-consuming to encode comprehensive expert knowledge into correct if-then rules, making upkeep and expansion impractical.
- [ ] They relied on subsymbolic (statistical) methods that produced opaque models, undermining explainability.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('expert-systemsSolution','exc-laa')">
  Show explanation
</button>

<div id="expert-systemsSolution" class="collapse">
  <p>Correct answer: <em>It was extremely difficult and time-consuming to encode comprehensive expert knowledge into correct if-then rules, making upkeep and expansion impractical.</em></p>
  <p>Expert systems require manually crafting and maintaining large rule sets. The wrong answers wrongly blame hardware costs, programming language choice, or subsymbolic methods.</p>
</div>


# Subsymbolic and symbolic AI { .solved}
**Which statement most accurately contrasts subsymbolic AI with symbolic (logic-based) AI?**
- [X] Subsymbolic AI relies on statistical models and inductive inference from data, whereas symbolic AI relies on explicit knowledge bases and deductive reasoning via logical inference engines.
- [ ] Subsymbolic AI models are always fully transparent in their decision process, while symbolic AI models are inherently opaque.
- [ ] Subsymbolic AI emerged first in the 1950s, whereas symbolic AI was a later development spurred by deep learning breakthroughs.
- [ ] Subsymbolic AI stores knowledge as human-readable if-then rules, whereas symbolic AI uses neural networks trained on large datasets.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('subsymbolic-and-symbolic-aiSolution','exc-laa')">
  Show explanation
</button>

<div id="subsymbolic-and-symbolic-aiSolution" class="collapse">
  <p>Correct answer: <em>Subsymbolic AI relies on statistical models and inductive inference from data, whereas symbolic AI relies on explicit knowledge bases and deductive reasoning via logical inference engines.</em></p>
  <p>Subsymbolic (e.g., neural nets) infer patterns from data; symbolic systems use hand‐crafted rules and logic. The wrong choices reverse transparency or timeline.</p>
</div>


# Limits of subsymbolic AI { .solved}
**Why are subsymbolic AI systems often considered less explainable than symbolic AI systems like expert systems?**
- [ ] Subsymbolic AI systems use if-then rules that are too numerous for humans to inspect, whereas symbolic AI uses simple equations.
- [ ] Subsymbolic AI relies on Gödel’s incompleteness theorem to handle undecidable statements, which inherently prevents explanations.
- [ ] Subsymbolic AI systems do not perform any inference at all, so there is nothing to explain, whereas symbolic AI performs inference.
- [X] Subsymbolic AI models (e.g., neural networks) learn statistical representations from data, making their internal decision processes opaque, while symbolic AI uses transparent, human-readable rules and inference steps.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('limits-of-subsymbolic-aiSolution','exc-laa')">
  Show explanation
</button>

<div id="limits-of-subsymbolic-aiSolution" class="collapse">
  <p>Correct answer: <em>Subsymbolic AI models (e.g., neural networks) learn statistical representations from data, making their internal decision processes opaque, while symbolic AI uses transparent, human-readable rules and inference steps.</em></p>
  <p>Neural nets learned weights aren’t easily interpretable; expert systems’ if-then rules can be directly inspected. The false options misattribute rule usage or Gödel’s theorem.</p>
</div>

# Storing factual knowledge { .solved}
**Which statement best describes the distinction between storing factual knowledge in subsymbolic AI models (e.g., LLMs) versus symbolic AI systems (e.g., databases)?**
- [ ] Subsymbolic models guarantee 100% recall of stored facts, whereas symbolic databases may occasionally lose information.
- [ ] Subsymbolic models cannot store any factual information, whereas symbolic databases can only store numerical data.
- [X] Subsymbolic models store information implicitly in learned parameters and can hallucinate; symbolic databases store facts explicitly and allow precise retrieval.
- [ ] Subsymbolic models use predicate logic for queries, while symbolic databases rely solely on neural network inference.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('storing-factual-knowledgeSolution','exc-laa')">
  Show explanation
</button>

<div id="storing-factual-knowledgeSolution" class="collapse">
  <p>Correct answer: <em>Subsymbolic models store information implicitly in learned parameters and can hallucinate; symbolic databases store facts explicitly and allow precise retrieval.</em></p>
  <p>LLMs encode facts in weights (prone to error), whereas databases record exact entries. The distractors misunderstand recall, data types, or querying.</p>
</div>

# Codd's theorem { .solved}
**What does Codd’s theorem imply about the relationship between databases and logic?**
- [ ] That logical systems are irrelevant for understanding how databases retrieve data.
- [X] That querying a relational database can often be viewed as evaluating formulas in predicate logic.
- [ ] That databases cannot represent any logical formulas unless they are converted to expert systems.
- [ ] That every database must be implemented in LISP to support logical inference.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('codd-s-theoremSolution','exc-laa')">
  Show explanation
</button>

<div id="codd-s-theoremSolution" class="collapse">
  <p>Correct answer: <em>That querying a relational database can often be viewed as evaluating formulas in predicate logic.</em></p>
  <p>Codd showed SQL-like queries correspond to predicate logic statements. The other statements falsely assert irrelevance of logic or mandate LISP.</p>
</div>

# System 1 and 2 { .solved}
**According to the excerpt’s discussion of Kahneman’s System 1 and System 2, why do large language models (LLMs) struggle with precise logical reasoning compared to symbolic systems?**
- [ ] LLMs excel at conscious, deliberate System 2 thinking but lack fast, intuitive System 1 capabilities.
- [ ] LLMs are not trained on any textual data, making them unable to perform even simple associative tasks.
- [X] LLMs are strong at fast, pattern‐based System 1 thinking (e.g., language mimicry) but have weak System 2 abilities (e.g., exact calculations), whereas symbolic systems excel at System 2.
- [ ] LLMs rely exclusively on explicit if-then rules, which prevents them from performing any intuitive reasoning.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('system-1-and-2Solution','exc-laa')">
  Show explanation
</button>

<div id="system-1-and-2Solution" class="collapse">
  <p>Correct answer: <em>LLMs are strong at fast, pattern‐based System 1 thinking (e.g., language mimicry) but have weak System 2 abilities (e.g., exact calculations), whereas symbolic systems excel at System 2.</em></p>
  <p>LLMs predict next-word patterns (fast, intuitive), but lack reliable step-by-step reasoning; symbolic AIs handle deliberate, logical tasks well. The wrong options misstate LLM capabilities or rule usage.</p>
</div>

# Multiple choice questions for self study**

# Inference { .solved }
**What is true about an inference?**

- [ ] Psychological processes to form a conclusion are not relevant to an inference as a technical term.
- [ ] The following proposition consists of three indicators: "Something is immortal, because it is not human, and since AI is not human, we can conclude that AI is immortal." 
- [ ] Premises, as an element of an inference, is a proposition that can be either true or false.
- [ ] Inferences are valid if and only if the conclusion follows from the premises. 
- [X] All of the above
- [ ] None of the above

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('inferenceSolution','exc-laa')">
  Show explanation
</button>

<div id="inferenceSolution" class="collapse">
  <p>Correct answer: <em>All of the above</em></p>
  <p> 
  An inference is a technical term, which means that it has not the everyday meaning. An inference is just the combination of premises and a conclusion, without paying attention to phycological processes of drawing a conclusion from premises.

  The three indicators are: _because_ is a premise indicator, _since_ is a premise indicator, and _we can conclude that_ is the inference indicator. The structure word _and_ is not an indicator, because it only put two sentences together, instead of having a functional role in the inference.

  A premise is the starting point of an argument or inference. This proposition (statement) can be either true or false and whose truth you assume in order to reach a conclusion.

  If the conclusion can be drawn from the premises, the inference (consisting of a combination of premises and a conclusion) is valid.</p>
</div>

# Logical systems 3 { .solved }
**Which of the following is a logical systems?**

- [X] Propositional logic, that consists of variables, connectives and rules for inferences
- [X] Predicate logic (first order-logic), that uses rules to formalize relations between objects denoted by predicate symbols, functions, variables and quantors.
- [ ] Grammatical system, that uses grammar rules to construct correct sentences.
- [X] λ-calculus, that uses reduction rules to apply in mathematical functions.
- [ ] All of the above
- [ ] None of the above

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('logical-systems-3Solution','exc-laa')">
  Show explanation
</button>

<div id="logical-systems-3Solution" class="collapse">
  <p>Correct answers: <em>A logical system consists of three key elements: syntax, semantics and proof theory.</em> Propositional logic is an example of a logical system, since the syntax is the specified symbols, the logical connectives and the formation rules for well-formed formulas. In addition, the semantics of this system is the truth-value of every proposition. The connectives are interpreted by truth tables. Lastly, it is a proof theory, because it captures semantic entailment by using a deductive system.</p>

  <em>Predicate logic (first order-logic), that uses rules to formalize relations between objects denoted by predicate symbols, functions, variables and quantors.</em> Predicate logic (first order-logic) is an example of a logical system, because it extends propositional syntax with predicates, quantifiers, function symbols, variables and formation rules for terms and formulas. Moreover, the semantics are the interpretation structures assigning each predicate a relation over a domain and each function symbol a function on that domain. Finally, via predicate logic it is possible to proof the validity of inferences.</p>

  <em>λ-calculus, that uses reduction rules to apply in mathematical functions.</em> Lambda calculus is an example of a logical system, since the syntax is exactly defined by expressions built from variables, abstraction and application rules. The semantics of this system are visible in the rules for reduction. These rules for reduction are part of proof theory.</p>

  <em>Grammatical system, that uses grammar rules to construct correct sentences.</em> A grammatical system is not a logical system, although the grammatical system has syntax in the sense of rules for well-formed sentences. However, in grammar, there is no formal specified semantics. Indeed, the meaning of a sentences depends on the context etc. Moreover, there is no proof theory by which one can derive the true sentences of a language; grammaticality judgments are empirical, not deductive.</p>
</div>

# Formal systems { .solved }

**Which of the following is true about formal systems?**
- [ ] They use only syntax and semantics.
- [X] They use formal language which is a set of well-formed formulates. These formulas are strings of symbols formed by a formal grammar.
- [ ] They use inductive systems to provide conclusions by drawing generalizations from single cases.
- [X] They use deductive systems or proof systems, which has rules of inference that take axioms and infers theorems. 
- [ ] All of the above
- [ ] None of the above

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('formal-systemsSolution','exc-laa')">
  Show explanation
</button>

<div id="formal-systemsSolution" class="collapse">
  <p><em>They use only syntax and semantics.</em> False, formal systems do use syntax and semantics as central aspects of formal languages. However, a formal system has a deductive system as well. </p>
  <p><em>They use formal language which is a set of well-formed formulates. These formulas are strings of symbols formed by a formal grammar.</em> True, the formal language is used to define symbols, and the formal grammar determines how the symbols are connected to reach well-formed formulas. These formulas are strings of symbols that correspond with the rules of the grammar.</p>
  <p><em>They use inductive systems to provide conclusions by drawing generalizations from single cases. </em>False, formal systems are deductive, they guarantee the truth of conclusions if the premises are true. Inductive systems reason derives conclusions from specific observations, while deductive systems reason from the general to the specific. </p>
  <p><em>They use deductive systems or proof systems, which has rules of inference that take axioms and infers theorems. </em>True, formal systems start with axioms, which are defined propositions that are accepted without proof. The formal systems use a proof system or rules of inference (like modus ponens). Via these rules, the theorems are derived.</p>
  </div>

# Incompleteness theorem { .solved }
**What is not true about Gödel's first incompleteness theorem?**
- [ ] Gödel's first incompleteness theorem states that no consistent system of axioms is capable of proving all truths about the arithmetic of natural numbers.
- [ ] In any consistent formal system that includes basic arithmetic, there will be true statements about natural numbers that are unprovable within that system.
- [ ] Some have argued that Gödel’s theorem suggests limits to replicating human reasoning with logical systems, but this interpretation remains philosophically debated.
- [ ] All of the above
- [X] None of the above

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('incompleteness-theoremSolution','exc-laa')">
  Show explanation
</button>

<div id="incompleteness-theoremSolution" class="collapse">
  <p><em>Gödel's first incompleteness theorem states that no consistent system of axioms is capable of proving all truths about the arithmetic of natural numbers.</em> True, even though the system may be sound (i.e., only proves true statements), it cannot prove all truths about the natural numbers. There will always be some arithmetical truths that elude formal proof within the system. This confirms the statement's correctness. </p>
  <p><em>In any consistent formal system that includes basic arithmetic, there will be true statements about natural numbers that are unprovable within that system.</em> True, this is essentially a restatement of statement a but phrased more explicitly in terms of natural numbers and basic arithmetic. The truth of the Gödel sentence G is model-theoretic: in the standard model of the natural numbers N, G is indeed true, but unprovable. Therefore, the theorem shows that: if a system F is consistent and F is sufficiently expressive, then there exists a true-but-unprovable statement in F. This is not contingent, it is guaranteed.</p>
  <p><em>Some have argued that Gödel’s theorem suggests limits to replicating human reasoning with logical systems, but this interpretation remains philosophically debated. </em>True, thinkers like Roger Penrose have argued that Gödel’s theorem shows the human mind cannot be fully captured by formal systems, because humans can supposedly “see” the truth of unprovable Gödel sentences. However, this is not a mathematical consequence of Gödel’s theorem. It is a philosophical interpretation built on additional assumptions (e.g., human consistency, insight into truth, etc.). </p>
</div>


# Undecidability theorem { .solved }
**Which of the following statements is not true about Turing's undecidability theorem?**
- [ ] Turing's undecidability theorem shows that there are problems no algorithm can solve for all possible inputs.
- [ ] The Halting Problem is undecidable: there is no general procedure that can determine whether arbitrary programs halt or run forever.
- [ ] Some have argued that undecidability places limits on automation, but this depends on whether real-world problems can be reduced to undecidable cases.
- [X] All of the above
- [ ] None of the above

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('undecidability-theoremSolution','exc-laa')">
  Show explanation
</button>

<div id="undecidability-theoremSolution" class="collapse">
  <p><em>Turing's undecidability theorem shows that there are problems no algorithm can solve for all possible inputs.</em> While it’s broadly accurate that Turing’s theorem shows the existence of algorithmically unsolvable problems, the phrase "no algorithm can solve for all possible inputs" is too general. Many undecidable problems can be semi-decided or solved on some inputs. The undecidability claim refers to decidability in the general case, not impossibility of solving any instance. </p>
  <p><em>The Halting Problem is undecidable: there is no general procedure that can determine whether arbitrary programs halt or run forever.</em> The Halting Problem is indeed undecidable, but the statement should be more precise. There is no algorithm that solves the Halting Problem for all possible programs and inputs. The way it’s stated could mislead a reader into thinking no termination analysis is ever possible, which is false—partial solutions exist.</p>
  <p><em>Some have argued that undecidability places limits on automation, but this depends on whether real-world problems can be reduced to undecidable cases. </em>This statement blends a correct observation (that undecidability has implications for automation) with a speculative generalization. It is true that undecidable problems limit what formal procedures can accomplish, but whether this constrains all practical automation is a matter of engineering context, not a direct consequence of the theorem. </p>
  </div>  

# If-then rules { .solved}
**Which of the following statements is true about if-then rules?**
- [ ] If-then rules are used in knowledge based expert systems.
- [ ] If-then rules make AI systems fully autonomous and capable of learning from experience.
- [ ] If-then rules ensure that AI systems never produce incorrect outputs.
- [ ] If-then rules are inherently unsuitable for explainable AI.
- [ ] All of the above
- [X] None of the above

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('if-then-rulesSolution','exc-laa')">
  Show explanation
</button>

<div id="if-then-rulesSolution" class="collapse">
  <p><em>If-then rules are used in knowledge based expert systems.</em> False, this statement is incomplete but true. While if-then rules are used in expert systems (as stated), it's only one part of the picture. The question asks for a true statement overall, and the rest of the options are clearly false or misleading, making “None of the above” the correct aggregate. </p>
  <p><em>If-then rules make AI systems fully autonomous and capable of learning from experience.</em> False, if-then rules do not enable learning from experience. They are hand-crafted and static unless modified manually. Symbolic AI lacks general learning capabilities found in subsymbolic AI.</p>
  <p><em>If-then rules ensure that AI systems never produce incorrect outputs. </em>False, incorrect rules or incomplete knowledge bases can lead to incorrect outputs, especially in edge cases or when input data are noisy or ambiguous. </p>
  <p><em>If-then rules are inherently unsuitable for explainable AI. </em>False, quite the opposite: if-then rules are central to explainable AI, since they allow tracing exactly why a system made a given inference.</p>
  </div>

# Logic as a tool { .solved}
**What is true about logic as a tool in AI?**
- [X] The similarity between subsymbolic and symbolic AI is that they both use inferences in some way.
- [ ] LLMS are capable of system 2 thinking.
- [X] Using a symbolic model is like writing information down in a structured, retrievable form, whereas using a subsymbolic model is like trying to remember everything.
- [X] Fuctual knowledge is stored in AI systems by rules and inference mechanisms that are transparent.
- [ ] All of the above
- [ ] None of the above

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('logic-as-toolSolution','exc-laa')">
  Show explanation
</button>

<div id="logic-as-toolSolution" class="collapse">
  <p><em>The similarity between subsymbolic and symbolic AI is that they both use inferences in some way.</em> True, although of a different type, both symbolic and subsymbolic rely on inference. Where symbolic AI uses the deductive inference, subsymbolic AI relies ond statistical inductive inference. </p>
  <p><em>LLMS are capable of system 2 thinking.</em> False, LLM inference is formally classified as System 1: the model applies its Transformer layers once over the input and directly emits tokens, without generating or checking intermediate reasoning steps.</p>
  <p><em>Using a symbolic model is like writing information down in a structured, retrievable form, whereas using a subsymbolic model is like trying to remember everything. </em>True, the difference between using a subsymbolic model to store information and using a symbolic model is the difference between trying to remember the information and writing it down. </p>
  <p><em>Fuctual knowledge is stored in AI systems by rules and inference mechanisms that are transparent.</em>True, factual knowledge is stored in symbolic AI systems using explicit rules and inference mechanisms, which are transparent because each element has a interpretable meaning. This allows humans to see the reasoning process step by step.</p>
</div>

