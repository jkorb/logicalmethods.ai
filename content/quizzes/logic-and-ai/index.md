---
title: Logic and AI
subtitle: test
author: Annefleur de Haan
weight: 1
params: 
  id: exc-laa
---

# Inferences { .solved }

## What is true about inferences?

- [ ] Psychological processes to form a conclusion are not relevant to an inference as a technical term.
- [ ] The following proposition consists of three indicators: "Something is immortal, because it is not human, and since AI is not human, we can conclude that AI is immortal." 
- [ ] Premises, as an element of an inference, is a proposition that can be either true or false.
- [ ] Inferences are valid if and only if the conclusion follows from the premises. 
- [X] All of the above
- [ ] None of the above

### Solution {#inferencesSolution .solution}

All of the above are correct: 

**a.)** An inference is a technical term, which means that it has not the everyday meaning. An inference is just the combination of premises and a conclusion, without paying attention to phycological processes of drawing a conclusion from premises.

**b.)** The three indicators are: _because_ is a premise indicator, _since_ is a premise indicator, and _we can conclude that_ is the inference indicator. The structure word _and_ is not an indicator, because it only put two sentences together, instead of having a functional role in the inference.

**c.)** A premise is the starting point of an argument or inference. This proposition (statement) can be either true or false and whose truth you assume in order to reach a conclusion.

**d.)** If the conclusion can be drawn from the premises, the inference (consisting of a combination of premises and a conclusion) is valid.

# Logical systems 

## Which of the following is a logical systems?

- [X] Propositional logic, that consists of variables, connectives and rules for inferences
- [X] Predicate logic (first order-logic), that uses rules to formalize relations between objects denoted by predicate symbols, functions, variables and quantors.
- [ ] Grammatical system, that uses grammar rules to construct correct sentences.
- [X] λ-calculus, that uses reduction rules to apply in mathematical functions
- [ ] All of the above
- [ ] None of the above

### Solution {#logical-systemsSolution .solution}

A logical system consists of three key elements: syntax, semantics and proof theory.

**a.)** Propositional logic is an example of a logical system, since the syntax is the specified symbols, the logical connectives and the formation rules for well-formed formulas. In addition, the semantics of this system is the truth-value of every proposition. The connectives are interpreted by truth tables. Lastly, it is a proof theory, because it captures semantic entailment by using a deductive system.

**b.)** Predicate logic (first order-logic) is an example of a logical system, because it extends propositional syntax with predicates, quantifiers, function symbols, variables and formation rules for terms and formulas. Moreover, the semantics are the interpretation structures assigning each predicate a relation over a domain and each function symbol a function on that domain. Finally, via predicate logic it is possible to proof the validity of inferences.

**c.)** A grammatical system is not a logical system, although the grammatical system has syntax in the sense of rules for well-formed sentences. However, in grammar, there is no formal specified semantics. Indeed, the meaning of a sentences depends on the context etc. Moreover, there is no proof theory by which one can derive the true sentences of a language; grammaticality judgments are empirical, not deductive.

**d.)** Lambda calculus is an example of a logical system, since the syntax is exactly defined by expressions built from variables, abstraction and application rules. The semantics of this system are visible in the rules for reduction. These rules for reduction are part of proof theory.

# Formal systems { .solved }

## Which of the following is true about formal systems?
- [ ] They use only syntax and semantics.
- [X] They use formal language which is a set of well-formed formulates. These formulas are strings of symbols formed by a formal grammar.
- [ ] They use inductive systems to provide conclusions by drawing generalizations from single cases.
- [X] They use deductive systems or proof systems, which has rules of inference that take axioms and infers theorems. 
- [ ] All of the above
- [ ] None of the above

### Solution {#formal-systemsSolution .solution}
**a.)** False, formal systems do use syntax and semantics as central aspects of formal languages. However, a formal system has a deductive system as well. 

**b.)** True, the formal language is used to define symbols, and the formal grammar determines how the symbols are connected to reach well-formed formulas. These formulas are strings of symbols that correspond with the rules of the grammar.

**c.)** False, formal systems are deductive, they guarantee the truth of conclusions if the premises are true. Inductive systems reason derives conclusions from specific observations, while deductive systems reason from the general to the specific. 

**d.)** True, formal systems start with axioms, which are defined propositions that are accepted without proof. The formal systems use a proof system or rules of inference (like modus ponens). Via these rules, the theorems are derived.

# Incompleteness theorem { .solved }
## What is not true about Gödel's first incompleteness theorem? 
- [ ] Gödel's first incompleteness theorem states that no consistent system of axioms is capable of proving all truths about the arithmetic of natural numbers.
- [ ] In any consistent formal system that includes basic arithmetic, there will be true statements about natural numbers that are unprovable within that system.
- [ ] Some have argued that Gödel’s theorem suggests limits to replicating human reasoning with logical systems, but this interpretation remains philosophically debated.
- [ ] All of the above
- [X] None of the above

### Solution {#incompleteness-theoremSolution .solution}
None of the above is the correct answer, because:

**a.)** True, even though the system may be sound (i.e., only proves true statements), it cannot prove all truths about the natural numbers. There will always be some arithmetical truths that elude formal proof within the system. This confirms the statement's correctness.

**b.)** True, this is essentially a restatement of statement a but phrased more explicitly in terms of natural numbers and basic arithmetic. The truth of the Gödel sentence G is model-theoretic: in the standard model of the natural numbers N, G is indeed true, but unprovable. Therefore, the theorem shows that: if a system F is consistent and F is sufficiently expressive, then there exists a true-but-unprovable statement in F. This is not contingent, it is guaranteed.

**c.)** True, thinkers like Roger Penrose have argued that Gödel’s theorem shows the human mind cannot be fully captured by formal systems, because humans can supposedly “see” the truth of unprovable Gödel sentences. However, this is not a mathematical consequence of Gödel’s theorem. It is a philosophical interpretation built on additional assumptions (e.g., human consistency, insight into truth, etc.).


# Undecidability theorem { .solved }
## Which of the following statements is not true about Turing's undecidability theorem?
- [ ] Turing's undecidability theorem shows that there are problems no algorithm can solve for all possible inputs.
- [ ] The Halting Problem is undecidable: there is no general procedure that can determine whether arbitrary programs halt or run forever.
- [ ] Some have argued that undecidability places limits on automation, but this depends on whether real-world problems can be reduced to undecidable cases.
- [X] All of the above
- [ ] None of the above

### Solution {#undecidability-theoremSolution .solution}
The correct answer is: All of the above. Here is why each statement fails to accurately reflect Turing’s result:

**a.)** While it’s broadly accurate that Turing’s theorem shows the existence of algorithmically unsolvable problems, the phrase "no algorithm can solve for all possible inputs" is too general. Many undecidable problems can be semi-decided or solved on some inputs. The undecidability claim refers to decidability in the general case, not impossibility of solving any instance.

**b.)** The Halting Problem is indeed undecidable, but the statement should be more precise. There is no algorithm that solves the Halting Problem for all possible programs and inputs. The way it’s stated could mislead a reader into thinking no termination analysis is ever possible, which is false—partial solutions exist.

**c.)** This statement blends a correct observation (that undecidability has implications for automation) with a speculative generalization. It is true that undecidable problems limit what formal procedures can accomplish, but whether this constrains all practical automation is a matter of engineering context, not a direct consequence of the theorem.

# If-then rules { .solved}
## Which of the following statements is true about if-then rules?
- [ ] If-then rules are used in knowledge based expert systems.
- [ ] If-then rules make AI systems fully autonomous and capable of learning from experience.
- [ ] If-then rules ensure that AI systems never produce incorrect outputs.
- [ ] If-then rules are inherently unsuitable for explainable AI.
- [ ] All of the above
- [X] None of the above

### Solution {#if-then-rulesSolution .solution}
None of the statements is true, because:

**a.)** False, this statement is incomplete but true. While if-then rules are used in expert systems (as stated), it's only one part of the picture. The question asks for a true statement overall, and the rest of the options are clearly false or misleading, making “None of the above” the correct aggregate.

**b.)** False, if-then rules do not enable learning from experience. They are hand-crafted and static unless modified manually. Symbolic AI lacks general learning capabilities found in subsymbolic AI.

**c.)** False, incorrect rules or incomplete knowledge bases can lead to incorrect outputs, especially in edge cases or when input data are noisy or ambiguous.

**d.)** False, quite the opposite: if-then rules are central to explainable AI, since they allow tracing exactly why a system made a given inference.

# Logic as a tool { .solved}
## What is true about logic as a tool in AI?
- [X] The similarity between subsymbolic and symbolic AI is that they both use inferences in some way.
- [ ] LLMS are capable of system 2 thinking.
- [X] Using a symbolic model is like writing information down in a structured, retrievable form, whereas using a subsymbolic model is like trying to remember everything.
- [X] Fuctual knowledge is stored in AI systems by rules and inference mechanisms that are transparent.
- [ ] All of the above
- [ ] None of the above

### Solution {#logic-as-a-toolSolution .solution}
**a.)** True, although of a different type, both symbolic and subsymbolic rely on inference. Where symbolic AI uses the deductive inference, subsymbolic AI relies ond statistical inductive inference.

**b.)** False, LLMS lack the capabilities for system 2 thinking, because they do not possess mechanisms for deliberate, structured and conscious reasoning that is decoupled from patterns association ans statistical prediction.

**c.)** True, the difference between using a subsymbolic model to store information and using a symbolic model is the difference between trying to remember the information and writing it down.

**d.)** True, factual knowledge is stored in symbolic AI systems using explicit rules and inference mechanisms, which are transparent because each element has a interpretable meaning. This allows humans to see the reasoning process step by step.
