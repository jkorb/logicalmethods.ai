---
title: Valid inference
subtitle: test
author: Annefleur de Haan
weight: 2
params: 
  id: exc-val
  math: true
---

# Multiple choice questions to test your knowledge

## Validity { .solved }
**What is true about validity?**
- [ ] The following inference is valid: If it rains, I take an umbrella. It rains. So, I take an umbrella.
- [ ] In invalid inference, the premises don't support the conclusion. 
- [ ] An inference is valid if the conclusion follows from the premises. 
- [ ] It is valid to say that Turing is immortal, if humans are immortal, and if Turing is a human. 
- [X] All answers correct.
- [ ] All answers incorrect.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('validitySolution','exc-val')">
  Show explanation
</button>

<div id="validitySolution" class="collapse">
  <p><em>The following inference is valid: If it rains, I take an umbrella. It rains. So, I take an umbrella.</em> This inference consists of two premises and a conclusion. The first premise: If it rains, then I take an umbrella, this is an implication. The second premise, "It rains", affirms the antecedent. Therefore, the conclusion, "I take an umbrella", follows logically from the premises. This proves the validity of the inference.</p>

  <p><em>In invalid inference, the premises don't support the conclusion. </em> To say that an inference is invalid means that the logical form of the argument fails to guarantee the truth of the conclusion, even if the premises are true. In other words, the premises are all true, but the conclusion is false.</p>

  <p><em>An inference is valid if the conclusion follows from the premises.</em> In formal logic, validity is a semantic property which states that the conclusion is supported by the premises. It is the logical entailment: if the truth is assumed to be true, then the truth of the conclusion is a logical necessity. </p>

  <p><em>It is valid to say that Turing is immortal, if all humans are immortal, and if Turing is a human.</em> Let's consider whether the conclusion follows from the premises. The first premise is "all humans are immortal" and the second premise is "Turing is human". The conclusion is "Turing is immortal". In other words, if Turing is human, then he is immortal, since all humans are immortal. This is a valid inference, even though humans are mortal in reality.</p>
</div>

## Fallacies { .solved }
**What is true about fallacies?**
- [X] The following is an example of the fallacy of denying the antecedent: If Alan can’t crack the code, then nobody else can. Alan can crack the code. So nobody else can.
- [ ] The following is an example of a fallacy of hasty generalization: ∀`I` is not human. All not-humans are flowers. ∀`I` is a flower.
- [ ] A fallacy is an inference that is not true.
- [ ] A fallacy of bagging the question can be solved by adding one premise.
- [ ] All answers correct.
- [ ] All answers incorrect.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('fallaciesSolution','exc-val')">
  Show explanation
</button>

<div id="fallaciesSolution" class="collapse">
  <p><em>The following is an example of the fallacy of denying the antecedent: If Alan can’t crack the code, then nobody else can. Alan can crack the code. So nobody else can.</em> True, this inference is invalid, since the conclusion doesn't follow from the premises. Because the truth of whether anyone else can crack the code depend only on Alan cracking the code being true. Formalized: $P \rightarrow Q$, and $\neg P$, one cannot validily infer $\neg Q$. There might be other ways for $Q$ to be true even if $P$ is false. The conditional $P \rightarrow Q$ says: if $P$ is true, then $Q$ must follow, but it says nothing about what happens if $P$ is false. This inference mistakenly assumes that since the antecedent is false, the consequent must be true. But a conditional statement only guarantees the consequent when the antecedent is true.</p>
  
  <p><em>The following is an example of a fallacy of hasty generalization: ∀`I` is not human. All non-humans are flowers. ∀`I` is a flower.</em> False, this is a valid inference, since the fact that ∀`I` is a flower, can be concluded from the premises that all non-humans are flowers and ∀`I` is a non-human. This valid inference is not a fallacy, though not all non-humans are flowers in reality.</p>
  
  <p><em>A fallacy is an inference that is not true.</em> False, fallacies are about invalid reasoning, not about truth. An inference can be fallacious even if the conclusion is true. What makes it a fallacy is that the conclusion does not logically follow from the premises. Fallacies concern the form of the argument, not the truth value of the conclusion.</p>

  <p><em>A fallacy of bagging the question can be solved by adding one premise.</em> False, in bagging the question, or circle reasoning, the conclusion is already assumed in the premises. Adding another premise doesn't remove that circularity.</p>
</div>

## Correctness { .solved }
**Which of the following statements best captures the role of correctness in logical inferences?**
- [ ] Correctness in an inference refers to how well an argument persuades an audience.
- [ ] Correctness in inference means that the argument avoids fallacies and uses technical language.
- [X] Correctness in inference refers to whether the form of the reasoning ensures that truth is preserved from premises to conclusion.
- [ ] Correctness in inference is the same as having all true premises and a true conclusion.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('correctnessSolution','exc-val')">
  Show explanation
</button>

<div id="correctnessSolution" class="collapse">
  <p><em>Correctness in inference refers to whether the form of the reasoning ensures that truth is preserved from premises to conclusion.</em> Validity is a kind of standard for correctness in logic: a valid inference is one that preserves truth from premises to conclusion.</p>
  
  <p><em>Correctness in an inference refers to how well an argument persuades an audience.</em> False, logic is with rhetoric confused.</p>
  
  <p><em>Correctness in inference means that the argument avoids fallacies and uses technical language.</em> False, this focusses on surface features rather than logical form.</p>

  <p><em>Correctness in inference is the same as having all true premises and a true conclusion.</em> This answer mistakes truth for validity. An inference can be valid even if its premises or conclusion are false, as long as the conclusion would be true if the premises are true.</p>
</div>

## Truth preservation { .solved }
**Which of the following is possible?**
- [X] An inference can be deductively valid and have a false premise.
- [X] An inference can be deductively valid and have a false conclusion.
- [ ] An inference can be deductively valid, have true premises, and have a false conclusion.
- [ ] An inference can be deductively valid but inductively invalid.
- [X] An inference can be inductively valid and have a false premise.
- [X] An inference can be inductively valid and have a false conclusion.
- [X] An inference can be inductively valid, have true premises, and have a false conclusion.
- [X] An inference can be inductively valid but deductively invalid.
- [ ] All answers correct.
- [ ] All answers incorrect.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('xSolution','exc-val')">
  Show explanation
</button>

<div id="xSolution" class="collapse">
  <p><em>An inference can be deductively valid and have a false premise.</em> True, deductive validity depends only on logical form, not on the actual truth of the premises. Just fill in any valid logical form with a false premise. For example: all pigs can fly, Maddy is a pig, thus, Maggy can fly. This is deductively valid (modus ponens), but has a false premise. Validity doesn't require true premises, only that if the premises are true, the conclusion must be.</p>
  
  <p><em>An inference can be deductively valid and have a false conclusion.</em> True, a deductively valid inference can have a false conclusion if at least one premise is false. Validity just preserves truth when the premises are true. It doesn't guarantee the conclusion is true unless the premises are. Just fill in any valid logical form with a false conclusion.</p>
  
  <p><em>An inference can be deductively valid, have true premises, and have a false conclusion.</em> False, a deductively valid inference preserves truth from premises to conclusion. So: if the inference is valid, and the premises are true, then the conclusion must also be true. If the conclusion is false, the inference cannot be valid if the premises are true. This contradicts the definition of validity.</p>

  <p><em>An inference can be deductively valid but inductively invalid. </em>False, deductive validity is a stronger standard than inductive validity. Every deductively valid inference is trivially inductively valid. Possible is: an inference that is inductively valid but not deductively valid (i.e., it’s defeasible, not truth-preserving). But the reverse, deductively valid but inductively invalid, is not coherent. Deductive validity implies truth preservation in all models, which is a stronger condition than inductive support.</p>

  <p><em>An inference can be inductively valid and have a false premise.</em> True, inductive validity concerns probabilistic support, not truth preservation. You can inductively support a conclusion from a false premise, e.g.: most birds fly, penguins are birds, therefore penguins probably fly. This inference is inductively valid in form, even though the major premise is false. It captures a common generalization, even if factually flawed, just take any strong conditional probability with a false condition.</p>
  
  <p><em>An inference can be inductively valid and have a false conclusion.</em> True, since inductive reasoning is non-monotonic and not truth-preserving, even an inductively valid inference with true premises can have a false conclusion. It's about probability increase, not guarantee. Take any strong conditional probability with a false outcome. </p>

  <p><em>An inference can be inductively valid, have true premises, and have a false conclusion.</em> True, the premises make the conclusion likely, not certain. For example: 85% of students passed the exam. Sam is a student. Thus, Sam probably passed the exam. Even if the premises are true, it's still possible that Sam failed. The conclusion is plausible, not certain. Inductive validity is not necessary.</p>
  
  <p><em>An inference can be inductively valid but deductively invalid.</em> For example: All observed swans are white. Therefore, all swans are white. This inference is inductively valid, since it generalizes from evidence, but deductively invalid because the conclusion does not follow necessarily from the premises. There could exist a non-white swan not yet observed.</p>
</div>

## Always { .solved }
**Which of the following statements is deductively valid?**
- [X] All robots programmed to teach math can solve quadratic equations. ∀`I` is programmed to teach math. Therefore, this robot can solve quadratic equations.
- [X] Since no robot without a magnetic fields sensor can measure magnetic flux and ∀`I` is not equipped with a magnetic field sensor, it cannot measure magnetic flux. 
- [ ] Every robot assistant we've tested so far has increased customer satisfaction in shops. The next robot assistant is likely to do the same.
- [ ] If a robot fails, it must reboot. ∀`I` did not reboot, because it did not fail.
- [ ] All answers correct.
- [ ] All answers incorrect.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('alwaysSolution','exc-val')">
  Show explanation
</button>

<div id="alwaysSolution" class="collapse">
  <p><em>All robots programmed to teach math can solve quadratic equations. ∀`I` is programmed to teach math. Therefore, this robot can solve quadratic equations.</em> Deductively valid inference, modus ponens. The specific is concluded from the general.</p>
  
  <p><em>Since no robot without a magnetic fields sensor can measure magnetic flux and ∀`I` is not equipped with a magnetic field sensor, it cannot measure magnetic flux. </em>Deductively valid inference. P1: no robot without a magnetic fields sensor can measure magnetic flux. P2: ∀`I` is not equipped with a magnetic field sensor. C: it cannot measure magnetic flux. The conclusion follows from the premises.</p>
  
  <p><em>Every robot assistant we've tested so far has increased customer satisfaction in shops. The next robot assistant is likely to do the same.</em> Inductive valid inference, the conclusion is probable, not necessary given the premises.</p>

  <p><em>If a robot fails, it must reboot. ∀`I` did not reboot, because it did not fail.</em> Deductively invalid inference, since it is a fallacy of denying the antecedent. Just because the robot didn’t fail, doesn’t mean it didn’t reboot. It might reboot for other reasons.</p>
</div>

## Mostly { .solved }
**Which of the following statements is inductively strong?**
- [ ] If a robot is equipped with surgical precision tools, it can perform microsurgery. ∀`I` is equipped with surgical precision tools. Therefore, it can perform microsurgery.
- [X] In 95% of observed cases, robots that perform diagnostics reduce error rates. ∀`I` performs diagnostics. It will likely reduce error rates.
- [X] ∀`I` has successfully helped over 10,000 students improve their test scores. The robot is likely effective in educational settings.
- [ ] ∀`I` performed well in one physics experiment. Therefore, it will perform well in all physics domains.
- [ ] All answers correct.
- [ ] All answers incorrect.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('mostlySolution','exc-val')">
  Show explanation
</button>

<div id="mostlySolution" class="collapse">
  <p><em>If a robot is equipped with surgical precision tools, it can perform microsurgery. ∀`I` is equipped with surgical precision tools. Therefore, it can perform microsurgery.</em> Deductive valid inference, the inference relies on logical form alone to guarantee the truth of the conclusion, with no room for probability or uncertainty.</p>
  
  <p><em>In 95% of observed cases, robots that perform diagnostics reduce error rates. ∀`I` performs diagnostics. It will likely reduce error rates.</em>Inductively strong inference, it uses a large statistical base (95%) to generalize probabilistically about a new instance.</p>
  
  <p><em>∀`I` has successfully helped over 10,000 students improve their test scores. The robot is likely effective in educational settings.</em>Inductively strong, from a large number of successes, we generalize that the robot is effective in that domain. It's not deductively certain, but it's probable.</p>

  <p><em>∀`I` performed well in one physics experiment. Therefore, it will perform well in all physics domains.</em> Inductively weak, it generalizes from a single instance to all physics domains, which is far too broad given the evidence. That makes it inductively invalid (weak).</p>
</div>

## Formalization { .solved }
**Why is formalization used in logic?**
- [ ] To make arguments more emotionally persuasive in natural language.
- [X] To precisely represent patterns of reasoning using symbols and rules.
- [X] To identify the shared logical form of different inferences.
- [ ] To implement mathematics in logic.
- [ ] All answers correct.
- [ ] All answers incorrect.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('formalizationSolution','exc-val')">
  Show explanation
</button>

<div id="formalizationSolution" class="collapse">
  <p><em>To make arguments more emotionally persuasive in natural language.</em> False, this describes rhetoric, not logic. Formalization explicitly removes emotional or stylistic language to focus on logical form.
  The goal is clarity and neutrality, not persuasion.</p>
  
  <p><em>To precisely represent patterns of reasoning using symbols and rules.</em> True, by converting reasoning into a formal language, we eliminate ambiguity and can evaluate logical validity mechanically and systematically.</p>
  
  <p><em>To identify the shared logical form of different inferences.</em> True, one of the benefits of formalization is recognizing when seemingly different arguments have the same logical form. This lets us prove validity for entire classes of reasoning at once.</p>

  <p><em>To implement mathematics in logic.</em> False, this reverses the direction. Logic is used to formalize mathematics, not the other way around. Formalization helps represent reasoning (including mathematical reasoning) in symbolic terms, but its primary goal is not to “implement mathematics in logic,” which is conceptually confused.</p>
</div>

## Semantics for deduction { .solved }
**What does it mean, in semantic terms, for an inference of the form $A \land B  ⊨ A$ to be valid?**
- [ ] Every model that makes $A \land B$ true also makes $A$ false.
- [ ] The truth of $A \land B$ depends only on the truth of $A$.
- [X] The set of models in which $A \land B$ is true is a subset of the set in which $A$ id true.
- [ ] If $A \land B$ is false, then $B$ must be true.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('semantics-for-deductionSolution','exc-val')">
  Show explanation
</button>

<div id="semantics-for-deductionSolution" class="collapse">
  <p><em>The set of models in which $A \land B$ is true is a subset of the set in which $A$ id true.</em> The definition of deductive validity in semantic terms is: $A ⊨ B$ if and only if $[A]\subseteq[B]$. So in case of $A \land B$, we know: $[A \land B] = [A]\cap[B]\subseteq[B]$ because the intersection of two sets is always a subset of each set.</p>
</div>

## Semantics for induction { .solved }
**What does the failure of monotonicity in inductive reasoning mean?**
- [ ] If an inference is inductively valid, it remains so even when new premises are added.
- [ ] The conclusion of an inductive inference is always guaranteed if the premises are true.
- [X] Adding new premises can make a previously inductively strong inference no longer valid.
- [ ] Inductive reasoning always depends on a fixed set of axioms, like in mathematics.
- [ ] All answers correct.
- [ ] All answers incorrect.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('semantics-for-inductionSolution','exc-val')">
  Show explanation
</button>

<div id="semantics-for-inductionSolution" class="collapse">
  <p><em>Adding new premises can make a previously inductively strong inference no longer valid.</em> Inductive reasoning is non-monotonic, meaning that adding new information can defeat or override earlier inferences. This contrasts with deductive logic, which is monotonic: once something is validly inferred from certain premises, it remains valid even if more premises are added. Hence, inductive conclusions are defeasible. They may need to be retracted in light of new evidence.</p>
</div>

# Multiple choice questions for self study
## Valid inferences { .solved }
**Which of the following inferences are valid**
- [X] All robots that learn autonomously are intelligent. ∀`I` is an autonomously learning robot. Therefore, ∀`I` is intelligent.
- [ ] If ∀`I` detects danger, it activates its shield. ∀`I` does not detect danger. So it does not activate its shield.
- [ ] A part in ∀`I`'s arm is lightweight. So ∀`I`'s arm is lightweight.
- [X] All robots are artificial beings. Some artificial beings are programmed for healthcare. Thus, some robots may be programmed for healthcare.
- [ ] All answers correct.
- [ ] All answers incorrect.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('valid-inferencesSolution','exc-val')">
  Show explanation
</button>

<div id="valid-inferencesSolution" class="collapse">
  <p><em>All robots that learn autonomously are intelligent. ∀`I` is an autonomously learning robot. Therefore, ∀`I` is intelligent.</em> True, this is a valid inference, since it has the traditional form of a universal instantiation and a modus ponens. First, the inference states that ∀`I` is a robot that learn autonomously. Because autonomously learning robots are intelligent, ∀`I` is intelligent.</p>

  <p><em>If ∀`I` detects danger, it activates its shield. ∀`I` does not detect danger. So it does not activate its shield.</em> False, this is an invalid inference, since it commits the fallacy of denying the antecedent. The antecedent, "∀`I` detects danger", is denied. But that doesn't mean that the consequent is false as well. A counter example is possible, e.g., suppose ∀`I` doesn't detect danger, but it activates its shield anyway. The conditional only tells what happens if the antecedent is true, not what happens if it is false.</p>

  <p><em>A part in ∀`I`'s arm is lightweight. So ∀`I`'s arm is lightweight.</em> This is a fallacy of composition, because properties of parts do not necessarily apply to the whole. The fact that a part of ∀`I`'s arm is lightweighted, doesn't imply that the entire arm is lightweighted.</p>

  <p><em>All robots are artificial beings. Some artificial beings are programmed for healthcare. Thus, some robots may be programmed for healthcare.</em> Knowing that all robots are artificial beings, so any artificial being could potentially be a robot and knowing that some artificial beings are programmed for healthcare, some of those healthcare-programmed artificial beings could be robots. There is no contradiction between the premises and the possibility that at least one robot is a healthcare-programmed artificial being. Therefore, the conclusion is consistent with the premises and therefore this a valid inference</p>
</div>

## Invalid inferences { .solved }
**Which of the following inferences are not valid**
- [ ] The robot &forall;`I` rides towards entering of the supermarket. The supermarket's automatic sliding doors open, when someone stands in front of the sensor. The sensor detects &forall;`I`. Therefore, the supermarket's automatic doors open.
- [X] The robot &forall;`I` rides towards entering of the supermarket. If &forall;`I` stands in front of the sensor, the doors open. The doors open. Thus, &forall;`I` stood in front of the sensor
- [X] The robot ∀I is moving toward the supermarket. The supermarket doors open when a customer is in front of the sensor. Therefore, ∀I is a customer.
- [X] The robot &forall;`I` rides towards entering of the supermarket. ∀I stood in front of the sensor, and the doors opened. Therefore, any entity that stands in front of the sensor will cause the doors to open.
- [ ] All answers correct.
- [ ] All answers incorrect.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('invalid-inferencesSolution','exc-val')">
  Show explanation
</button>

<div id="invalid-inferencesSolution" class="collapse">
  <p><em>The robot &forall;`I` rides towards entering of the supermarket. The supermarket's automatic sliding doors open, when someone stands in front of the sensor. The sensor detects &forall;`I`. Therefore, the supermarket's automatic doors open. </em> This inference is valid, because of the assumption that the sensor triggers the doors and that the sensor detecting someone implies they are standing in front of it. This inference has a modus ponens structure. If ∀I is detected by the sensor, and the doors open for those detected, then the conclusion follows.</p>

  <p><em>The robot &forall;`I` rides towards entering of the supermarket. If &forall;`I` stands in front of the sensor, the doors open. The doors open. Thus, &forall;`I` stood in front of the sensor</em> This is an invalid inference, since it affirms the consequent. From "if ∀I stands in front of the sensor, the doors open" and observing that the doors opened, we cannot infer that ∀I must have been the one in front. There could be other causes for the doors opening. This commits the affirming the consequent fallacy.</p>

  <p><em>The robot ∀I is moving toward the supermarket. The supermarket doors open when a customer is in front of the sensor. Therefore, ∀I is a customer.</em> This is an invalid inference. The door opening when a customer stands in front does not mean that only customers trigger it. The premises don't exclude the possibility that non-customers can also trigger it. Even, we don't know whether ∀I can count as a customer. A category label is inferred from behavior without support. Thus, the conclusion does not logically follow.</p>

  <p><em>The robot &forall;`I` rides towards entering of the supermarket. ∀I stood in front of the sensor, and the doors opened. Therefore, any entity that stands in front of the sensor will cause the doors to open.</em> This is an invalid inference, since it makes a universal generalization ("any entity") based on a single instance ("∀I"). This is a hasty generalization. There might be entities that the sensor doesn't detect. So this conclusion does not logically follow from the premises.</p>
</div>

## Deductive inferences { .solved }
**Which of the following statements is true about deductive inferences?**
- [ ] If the premises are true, the conclusion is true.
- [ ] Validity depends on the logical form.
- [ ] If the inference is valid, there is no uncertainty in the transition from premises to conclusion.
- [ ] Deductive inferences often move from a general rule to a specific case (though not always).
- [X] All answers correct.
- [ ] All answers incorrect.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('deductive-inferencesSolution','exc-val')">
  Show explanation
</button>

<div id="deductive-inferencesSolution" class="collapse">
  <p><em>If the premises are true, the conclusion is true.</em> True, this describes truth preservation, which is the main point of deductive validity. If the inference is valid, and the premises are true, then the conclusion must be true. While the statement omits the word "valid," it implicitly assumes we are speaking of valid deductive inferences, so it is acceptable as shorthand in this context.</p>
  
  <p><em>Validity depends on the logical form.</em> True, deductive validity is formal: it depends on the structure of the argument, not the specific content of the premises. An invalid form (e.g., affirming the consequent) remains invalid even if the conclusion happens to be true.</p>
  
  <p><em>If the inference is valid, there is no uncertainty in the transition from premises to conclusion.</em> True, in a valid deductive inference, the move from premises to conclusion is logically necessary. There is no probability or approximation involved: the conclusion must follow.</p>

  <p><em>Deductive inferences often move from a general rule to a specific case (though not always).</em> True, this describes a common pattern in deductive reasoning, known as subsumption. However, some valid deductive inferences go from specific to specific, or from general to general. The qualifier “though not always” makes the statement carefully accurate.</p>
</div>

## Inductive inferences { .solved }
**Which of the following statements is true about inductive inferences?**
- [X] The conclusion is plausible given the premises, but not guaranteed to be true.
- [X] Inductive inferences generalize observations to rules.
- [ ] The same as deductive inference, logical form is central to inductive inferences.
- [ ] If an inference is not valid, the conclusion will not follow from the premises. 
- [ ] All answers correct.
- [ ] All answers incorrect.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('inductive-inferencesSolution','exc-val')">
  Show explanation
</button>

<div id="inductive-inferencesSolution" class="collapse">
  <p><em>The conclusion is plausible given the premises, but not guaranteed to be true.</em> True, inductive inferences are non-deductive: they do not guarantee the conclusion, even if the premises are all true. Instead, they aim for plausibility or probability. The conclusion is likely given the evidence.</p>
  
  <p><em>Inductive inferences generalize observations to rules. </em>True, from specific observations (e.g., “these swans are white”), we form a general rule (“all swans are white”). This is called enumerative induction and is foundational to scientific reasoning.</p>
  
  <p><em>The same as deductive inference, logical form is central to inductive inferences.</em> False, in deductive logic, validity is defined entirely by logical form (e.g., modus ponens, modus tollens). In inductive logic, the focus is on evidential support, frequency, analogy, or statistical strength, not strict formal structure. Two inductive inferences with the same form can differ in strength, depending on the content and context.</p>

  <p><em>If an inference is not valid, the conclusion will not follow from the premises. </em>False, this applies to deductive validity only. In inductive reasoning, even if an inference is not valid in the deductive sense, the conclusion can still plausibly follow from the premises. Validity is not the criterion for inductive strength. Instead, we assess how likely the conclusion is, given the premises.</p>
</div>

## Formal logical form { .solved }
**Which of the following inferences is translated correctly?**

$F$: ∀I is able to give feedback on a student's work.
$S$: Students like using ∀I.
$T$: Teachers like using ∀I.
$E$: ∀I is an application used in education.
$N$: ∀I is not an application used in education.

- [X] $E \rightarrow F$, $E$ ⊢ $F$ means: if ∀I is an application used in education, then it is able to give feedback on a student's work. Thus, ∀I is able to give feedback on a student's work.
- [X] $E \land (S \land T) \rightarrow F$, $E$, $S$, $T$ ⊢ $F$: if ∀I is an application used in education and if both students and teachers like using ∀I, it is able to give feedback on a student's work.
- [ ] $\neg (S \rightarrow N)$: if students don't like using ∀I, then it is not an application used in education.
- [X] $S$, $T$, $E$ ⊨ $F$: Students and teachers both like using ∀I, and ∀I is currently used in education. Therefore, it is likely that ∀I is able to give feedback on a student's work.
- [ ] All answers correct.
- [ ] All answers incorrect.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('formal-logical-formSolution','exc-val')">
  Show explanation
</button>

<div id="formal-logical-formSolution" class="collapse">
  <p><em>$E \rightarrow F$, $E$ ⊢ $F$: if ∀I is used in education, then it is able to give feedback on a student's work. Thus, ∀I is able to give feedback on a student's work.</em> True, this is a modus ponens, a deductive valid inference. This inference is deductively valid because it is truth-preserving by form: if $E \rightarrow F$ is true (i.e., whenever $E$ is true, $F$ must also be true), and $E$ is indeed true, then it is impossible for $F$ to be false without contradicting the implication.</p>
  
  <p><em>$E \land (S \land T) \rightarrow F$, $E$, $S$, $T$ ⊢ $F$: if ∀I is an application used in education and if both students and teachers like using ∀I, it is able to give feedback on a student's work.</em> True, this is a modus ponens.</p>
  
  <p><em>$\neg (S \rightarrow N)$: if students don't like using ∀I, then it is not an application used in education.</em> False, this translation neglects the negation symbol in front of the parentheses. The correct translation is: It is not the case that if students like using ∀I, then ∀I is not an application used in education. Or: Students liking ∀I does not imply that ∀I is not used in education.</p>

  <p><em>$S$, $T$, $E$ ⊨ $F$: Students and teachers both like using ∀I, and ∀I is currently used in education. Therefore, it is likely that ∀I is able to give feedback on a student's work.</em> True, this is an inductive inference, because the conclusion is not guaranteed by the premises. It is probabilistic: we infer that ∀I probably has feedback functionality based on indirect evidence.</p>
</div>

## Preserving truth { .solved }
**What does it mean to say that a valid inference preserves truth?**
- [ ] If the conclusion is true, then at least one of the premises must be true.
- [X] If the premises are true, then the conclusion must also be true.
- [ ] A valid inference cannot contain any false statements.
- [ ] A valid inference guarantees that both the premises and the conclusion are factually accurate.
- [ ] All answers correct.
- [ ] All answers incorrect.

<button type="button"
        class="btn btn-link"
        onclick="showPasswordModal('preserving-truthSolution','exc-val')">
  Show explanation
</button>

<div id="preserving-truthSolution" class="collapse">
  <p><em>If the conclusion is true, then at least one of the premises must be true.</em> False, the direction of inference goes from premises to conclusion, not the reverse.</p>
  
  <p><em>If the premises are true, then the conclusion must also be true.</em> True, valid inferences preserve truth from premises to conclusion. This means that truth cannot be lost in the inferential step: if all the premises are true, then the conclusion must be true.</p>
  
  <p><em>A valid inference cannot contain any false statements.</em> False, a valid inference can contain false statements (e.g., false premises), so long as the logical structure is sound.</p>

  <p><em>A valid inference guarantees that both the premises and the conclusion are factually accurate. </em>False, validity (a formal property) is confused with empirical truth; logic doesn't require factual accuracy, only the correct relationship between truth values.</p>
</div>