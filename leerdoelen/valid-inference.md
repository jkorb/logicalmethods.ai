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
## Chapter 2: Valid inference

In the second chapter of the textbook, [Valid inferences](https://logicalmethods.ai/textbook/valid-inference/), students are introduced with validity of inferences.

## Textbook *leerdoelen* 

In this chapter of the textbook, the second and fourth *leerdoel* are emphasized. The first and third aren't.

*Leerdoel 2*  
To begin with the second *leerdoel*, students learn how the logical methods function and briefly what their limitations are. For instance, they need to understand what deductive and inductive validity entails, how valid inference are distinguishable from invalid inferences, and what semantics is used for valid inferences. In addition, the limitations of deduction and induction are briefly discussed, e.g., limited applicability to everyday reasoning. However, it might be good to provide a clearer explanation of the reasons why induction and deduction are useful and what their function exactly is in AI.

*Leerdoel 4*  
The other *leerdoel* that is prominent in this chapter is the last *leerdoel* concerning the general logical skills to evaluate inferences. The student learn to recognize the differences between deductive (in)valid and inductive (in)valid inferences. Secondly, the chapter introduces the formal notation and discusses how the logical form of an inference can be evaluated. Finally, the semantic models show how truth-preservation is tested and used. On the other hand, the sections about semantic methods could be expanded to falsification. The section on semantic models currently focuses primarily on confirming validity. It would be beneficial to add an explicit discussion of how the models can also be used to demonstrate invalidity, for example by constituting a countermodel in which the premises are true but the conclusion is false.

*Leerdoel 1*  
This textbook chapter doesn't provide a systematic explanation of the `probleemgebieden' in AI. Therefore, the first *leerdoel* doesn't fit the chapter.

*Leerdoel 3*  
Since the chapter contains of the fundamental, philosophical parts of logic, it doesn't provide a broad overview of how the logical methods are applied in AI studies (*leerdoel* 3). If there is more attention for the connection between logical methods and AI, this *leerdoel* could be more prominent.

## Textbook Bloom's taxonomy

Bloom's taxonomy can be applied to this chapter.

*Knowledge*  
To begin with the level of remembering, students need to memorize different concepts. First, students should remember the definition of an inference, which is discussed in the previous chapter. In addition, they learn new concepts, such as validity, symbols used in the models, deduction and induction.

*Comprehension*  
The second level of Bloom's taxonomy, focused on understanding, is important in this chapter, since students should understand the difference between valid and invalid, between deduction and induction, and other abstract concepts.

*Application*  
Due to the examples in the textbook, students see how the concepts are applied to different cases. However, it is not asked to apply concepts by themselves (this is more like the exercises).

*Analysis, synthesis and creation*  
The levels of analyzing, evaluating and creating are not prominent in the chapter. The main focus of the chapter is remembering and understanding.

## Exercises

I analyze the exercises of the [second chapter](https://logicalmethods.ai/exercises/valid-inference/) related to the *leerdoelen* and Bloom's taxonomy. Every exercise demands knowledge and comprehension. Most exercises' aims are on the level of analysis as well. However, the level of application lacks in this chapter, which might be beneficial for additional exercises.

| **Bloom's Taxonomy** | **Ex. 1** | **Ex. 2** | **Ex. 3** | **Ex. 4** | **Ex. 5** | **Ex. 6** | **Ex. 7** | **Ex. 8** |
|----------------------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| Remembering          | +         | +         | +         | +         | +         | +         | ±         | +         |
| Understanding        | +         | +         | +         | +         | +         | +         | ±         | +         |
| Applying             | +         | --        | --        | +         | +         | --        | ±         | --        |
| Analyzing            | --        | +         | +         | +         | -         | +         | ±         | +         |
| Evaluating           | --        | +         | --        | --        | --        | --        | ±         | --        |
| Creating             | --        | --        | --        | --        | --        | --        | ±         | --        |

### Exercise 1 Deduction and induction

In this questions, students should remember the meaning of deduction, induction, validity and inferences. They should recognize and understand what makes an inference valid or not and how the form of the inference looks like, depending on induction or deduction. This involves knowledge, comprehension of the concepts and application of the knowledge to new examples. Therefore, the remembering, understand and application levels of Bloom's taxonomy are used.

### Exercise 2 Monotonicity

First, students are asked to analyse the structural principle of monotonicity and explain why this is logical demanding within a deductive system. This requires insight in the relation between premises and the conclusion for deductive validity. Thus, this question is on the understanding and analysing level.

Secondly, students should analyse why the principle of monotonicity fails in inductive logic, concerning the probabilistic structure of induction. This requires understanding, analysis and evaluation of the differences.

### Exercise 3 Validity

The question about validity demands a certain level of knowledge and understanding of the concepts. Moreover, the students should reflect on the possibility of making the inference valid by adding a premise. This requires judgements about conditions for validity. Consequently, this is a question at the level over remembering, understanding and analyzing.

### Exercise 4 Truth-Preservation

This exercise asks students to apply concepts such as truth-preservation to various hypothetical scenarios (involving true or false premises and conclusions), and to analyze the structural conditions under which deductive or inductive validity is preserved. To do this, a certain level of knowledge and comprehension is needed, in addition to the ability to apply and analyse the concepts.

### Exercise 5 Malfunctioning systems

In this exercise, students are asked to explain why the systems result in the wrong outcome. They need to understand that the system makes an invalid inference and therefore concludes the wrong thing. To explain this, students need to understand the difference between valid en invalid inferences. They should recognize the parts that determinate the invalidity of the inference and hopefully they can come up with a method to fix the inference. The examples mentioned in the exercise are all symbolic AI systems, this recalls knowledge from the previous chapter.

### Exercise 6 Semantic tools

Firstly, the students should remember the subset relation and its property. The symbols should be a part of the student's knowledge in order to understand the symbols and their meaning. The understanding of transitivity is required. Therefore this question is at the level of knowledge, comprehension and analysis.

The second part is an understanding question, since students are expected to demonstrate that they understand the basic concept of set intersection and can relate it to logical conjunction. The focus here is on the comprehension.

### Exercise 7 Research

The research question might be at all levels of the taxonomy, depending on how serious the students take this exercise. The students should, with the help of academic sources, form a judgement about whether deductive and inductive logic exhaust all forms of `good' reasoning as a classification system. If students go further and propose alternative classifications or develop integrative perspectives, they may reach the level of creation.

### Exercise 8 Discussion

The discussion question requires a well-considered view about specific forms of limited monotonicity in inductive logic. It involves weighing arguments, assessing plausibility, and taking a position within a theoretical framework. Therefore, decent knowledge, comprehension and analysis is needed.
