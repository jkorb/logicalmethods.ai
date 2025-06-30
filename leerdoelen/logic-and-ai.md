# Leerdoelen analysis

**Logical Methods**  
*Stage, Logische methoden voor KI*  
*Filosofie, Universiteit Utrecht*  
**Annefleur de Haan (s7328893)**  
*Version 16 June 2025*

---

## Table of contents

1. [Leerdoelen](#leerdoelen)  
2. [Bloom's Taxonomy](#blooms-taxonomy)  
3. [Chapter 1: Logic and AI](#chapter-1-logic-and-ai)  
4. [Chapter 2: Valid inference](#chapter-2-valid-inference)  


---

## Chapter 1: Logic and AI

In the first chapter of *Logical methods*, [Logic and AI](https://logicalmethods.ai/textbook/logic-and-ai/), students are introduced with some important concepts in logic, such as premises and conclusions, and in AI, like symbolic AI and some tools.

### Textbook *leerdoelen* and Bloom's taxonomy

In the first chapter, the first, second and third *leerdoel* are introduced.

*Leerdoel 1*  
To begin with, the learning goal to gain a broad overview of the logical methods used in AI research is directly fulfilled by the entire structure of the chapter. The chapter introduces foundational concepts such as inference, validity, deductive and inductive logic, and logical systems (syntax, semantics, proof theory). It systematically explains different logical systems (e.g., propositional logic, predicate logic, modal logic) and their philosophical basis. The three-fold role of logic in AI (foundational, methodological, and instrumental) provides a framing schema for understanding the breadth of applications across the discipline. This corresponds to the cognitive level of knowledge and comprehension: acquiring and classifying concepts, understanding relationships between systems, and forming a structured overview of logical methodologies.

*Leerdoel 2*  
The learning goal to understand how and why these methods work and what their limitations are, is addressed with both conceptual depth and critical analysis throughout the chapter. In the section on validity, the distinction between deductive and inductive inference is not only stated but also motivated with examples, showing why deductive validity is “all or nothing”, whereas inductive validity admits degrees. This deepens understanding of how the methods function.  
The examples of fallacious reasoning (e.g., “denying the antecedent”) illustrate where logic fails and hence reveal methodological limitations.  
The section on logical systems explains their internal architecture (syntax, semantics, proof theory), showing how logical inference is formalized. Crucially, the foundational discussion (Gödel’s incompleteness theorem and Turing’s undecidability result) addresses theoretical boundaries of what logic can and cannot achieve within AI. These are limiting results. This corresponds to Bloom’s level of comprehension and analysis. The chapter encourages students not only to describe logical methods, but also to reason about their functioning and limitations.

*Leerdoel 3*  
The learning goal to learn how to apply these methods in specific problem domains within AI, is met primarily through the chapter’s contextualization of logic within concrete AI applications. For example, “Logic as Methodology” explains the role of logic in symbolic AI, including examples such as expert systems and knowledge representation. These are direct illustrations of logical methods applied to real-world AI tasks. Furthermore, “Logic as a Tool” provides further application contexts. Here, the link between logical formalism and practical computational function is emphasized. Moreover, the chapter distinguishes symbolic versus subsymbolic AI, explaining where logical methods remain operationally relevant, in hybrid AI systems, and in interpreting neural systems through logical approximations. By presenting logic as instrumentally relevant, the chapter shows how logical methods are selectively deployed to solve specific problem domains, such as formal verification, rule-based decision-making, and transparent AI modeling. This satisfies Bloom’s application level: the student is shown how to use abstract logical structures in domain-specific scenarios.

### Exercises

I analyse [the exercises](https://logicalmethods.ai/exercises/logic-and-ai/) of the first chapter related to the *leerdoelen* and Bloom's taxonomy.

| Bloom's taxonomy | Ex. 1 | Ex. 2 | Ex. 3 | Ex. 4 | Ex. 5 | Ex. 6 | Ex. 7 | Ex. 8 | Ex. 9 |
|------------------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| Remembering      |   +   |   +   |   +   |   +   |   +   |   +   |   +   |   -   |  +/-  |
| Understanding    |   +   |   +   |   +   |   +   |   +   |   +   |   +   |   +   |  +/-  |
| Applying         |   -   |   -   |   -   |   +   |   +   |   +   |   +   |   -   |  +/-  |
| Analyzing        |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   +   |  +/-  |
| Evaluating       |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   +   |  +/-  |
| Creating         |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   +   |  +/-  |

#### Exercise 1. Test your knowledge

This is a multiple choice question via which students can check their basic understanding of the chapter. Not all important concepts are asked, but some of the important are. This exercise provides a general insight for the students whether he remembers the concepts correctly. Students must recognize and reproduce the core definitions. The answers are findable in the text, but formulated in different ways in the exercise. Since this exercise is focused on reproduction and recalling of information, it is at the first level of Bloom's taxonomy: remembering.

Moreover, the exercise is at the understanding level in the sense that students should check whether a proposed description matches that concept. They distinguish the correct from the incorrect formulations.

#### Exercise 2. Definitions

This exercise should be described later, when it is determined of which concepts the students should provide a definition. However, the exercise is at the level of remembering and understanding.

#### Exercise 3. Examples of indicators

This exercise focuses as well on the first and second level: remembering and understanding. because indicators are used as general concepts that structure the logical methods. Giving examples of the indicators concerns the comprehension of the student about the difference between the premise and inference. Students supply additional premise‐indicator and inference‐indicator words. They need to recall typical indicator vocabulary and show they understand why each word signals a premise or a conclusion. This draws on basic comprehension of indicator function plus simple retrieval.

#### Exercise 4. Recognizing indicators

The exercise demands students to recognize the inference indicators and categorize them, given a paragraph. This requires breaking the text into its argumentative components and classifying terms by function. Because the used inference indicators are simple, this is a very basic question. This means that students should remember what indicators are, understand how they work and finally apply this to the sentences of the paragraph to call the indicators correctly. Although not very prominent, the application level fits this question as well.

#### Exercise 5. Inferences

Each problem presents a mini‐scenario containing an argument. Students must parse out all premises and pinpoint the conclusion. That is essentially a decomposition task: isolate statements, recognize their roles, and reconstruct the argument’s structure. Therefore, students should remember how an inference is built, they should comprehend the different functions of premises and the conclusion, and they should apply this knowledge to the paragraphs to determine the premises and conclusions.

#### Exercise 6. Symbolic or subsymbolic

Descriptions of various AI systems are given. For each one, students decide whether it is symbolic or subsymbolic and justify that choice by referring to defining characteristics. They must understand each description to extract the basic mechanism (rules vs. statistical/probabilistic model) and then decide whether that mechanism matches one category or the other. Thus, this exercise concerns four levels: mostly remembering and understanding what symbolic and subsymbolic systems are, and applying this information to new examples.

#### Exercise 7. Thinking, fast and slow

Students generate entirely new examples of System 1 (fast, intuitive) and System 2 (slow, deliberate) thinking. By inventing new examples and explaining why each qualifies, they apply their conceptual knowledge of the distinction between the two forms. Therefore, this exercise is at the level of remembering the definitions of the two systems, understanding their differences and applying this knowledge to new examples.

#### Exercise 8. Research

These open‐ended questions require independent literature review, critical comparison of sources, and synthesis of a coherent answer. Therefore this exercise is mostly focused on understanding, analyzing, evaluating and maybe creating.

#### Exercise 9. Discussion

The discussion-question can be considered as a combination of multiple levels, depending on in what depth the questions are discussed.
