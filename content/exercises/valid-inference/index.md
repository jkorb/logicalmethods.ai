---
title: Valid inference
author: Colin Caret
weight: 2
params: 
  id: exc-val
  math: true
---

# Deduction and Induction {.homework .solved}

Give an example of one for each of the following:

## a) {.homework}

A deductively valid inference, about ∀I as a musician.

## b)

A deductively invalid inference, about ∀I as an author of a book.

## c)

An inductively valid inference, about ∀I as a sport professional.

## d) {.homework}

An inductively invalid inference, about ∀I as a doctor.

## Solution {#deduction-and-inductionSolution .solution}

**a.)** Deductively valid inference if the conclusion follows necessarily from the premises. If both premises are true, the conclusion must be true in every model. For example:

If ∀I composes music, then ∀I is a musician. ∀I compose music. Therefore, ∀I is a musician.

**b.)** Deductively invalid inference: the conclusion does not follow logically. The premises could be true while the conclusion is false.

If ∀I is an author, then ∀I has written a book. ∀I has written a book. Therefore, ∀I is an author.

**c.)** Inductively valid inference (strong): The conclusion is plausible and supported by statistical generalization. It's not certain (as deductive validity would require), but it reflects a high conditional probability. For example:

In 95% of cases, characters with elite physical performance and competitive records are professional athletes. ∀I has elite physical performance and competitive records. Therefore, ∀I is probably a professional athlete.

**d.)** Inductively invalid inference (weak): the inference fails as an inductive generalization. It gives the illusion of support, but the premises don't meaningfully raise the probability of the conclusion. For example:

∀I wears a white coat. Most doctors wear white coats. Therefore, ∀I is probably a doctor.

# Monotonicity {.solved}

## a) Deduction

Suppose ∀I is a street-crossing scenario. Give an argument that if an inference that ∀I makes, is deductively valid, then adding
additional premises doesn’t cancel the validity of the inference.

## b) Induction {.homework}

Why does this argument fail for inductive logic?

## Solution {#monotonicitySolution .solution}

**a)**

Deductive validity is necessary. Suppose $A\vDash C$. Necessarily, if $A$ is
true, $C$ is true. If we consider any possibility where $A\land B$ is true, it
also makes $A$ true, which means that is has to make $C$ true (based on what we
just observed). So $A\land B\vDash C$.

For example: ∀I thinks "If the light is green, then it's safe to cross." The light turns green. So, it's safe to cross. Suddenly, ∀I's friend ∃n runs up and says: "Wait, you have to check whether there are cars coming or not." Luckily, no cars. Thus, it remains safe to cross the street.

**b)**

Inductive validity isn't necessary. $A\mid\!\approx C$ only tells us that when
$A$ is true, *it is likely* that $C$ is true. This does not guarantee that when
$A\land B$ is true, *it is equally likely* that $C$ is true. Sometimes new
information $B$ lowers or cancels out the probability of $C$. 

# Validity {.homework .solved}

For every invalid inference, it’s possible to add one or more premises to make it
valid. Why? 

## Solution {#validitySolution .solution}

If you have an invalid inference $P_1,\ldots, P_n\nvDash C$ you can just add $C$ on the premise side and you get a valid inference $C,P_1,\ldots, P_n\vDash C$.

# Semantic tools {.solved}

Explain the following facts:

## a)

The subset relation, defined in {{< chapter_ref chapter="valid-inference" id="semantic-methods-for-deduction" >}}
2.3.1 {{< /chapter_ref >}}, has the following property:

+ If $X\subseteq Y$ and $Y\subseteq Z$, then $X\subseteq Z$.

_Note_: This property is called "transitivity".

## b) {.homework}

Remember that the intersection $X\cap Y$ of two sets $X,Y$ is the overlapping
part of those two sets. We have that $X\cap Y\subseteq X$ and $X\cap Y\subseteq
Y$.

## Solution {#semantic-toolsSolution .solution}

**a)**

$X\subseteq Y$ means all elements of set $X$ are elements of set $Y$.
$Y\subseteq Z$ means all elements of set $Y$ are elements of set $Z$. Then it
must be true that all elements of set $X$ are elements of set $Z$.

**b)**

The intersection $X\cap Y$ is the overlapping part of $X$ and $Y$. So the
elements of $X\cap Y$ have to be elements of $X$. That means $X\cap Y\subseteq
X$. And the elements of $X\cap Y$ have to be elements of $Y$. That means $X\cap
Y\subseteq Y$.


# Malfunctioning systems { .solved}
The following logic-based systems, symbolic AI, use inferences to perform a task. However, in some cases something went wrong. Discover the part in the inference where the AI system makes a mistake and explain how the system can infer the right conclusion. 

## a.)
{{< blockquote id="Chemestry-test-quote" >}} 
∀I is symbolic AI system that encodes knowledge from chemistry into rules and structures to generate chemists hypotheses. Suppose a student analyzes a liquid. The student knows that both ethanol and dimethyl ether have a molecular mass of 46 u and produce a peak at m/z=31. The student wants the ∀I system to show what compound the liquid is. 

The student uses ∀I and provides the following input: "The compound has a molecular mass of 46 u. There is a peak in the spectrum at 31 m/z. What is the likely chemical structure?"

∀I applies a heuristic rule based on domain knowledge: "if a compound is ethanol, then a peak at 31 will appear." Second, "A peak at 31 is present." Finally: "If (peak-at 31) then (suggest-structure ethanol)." The output ∀I shows is: "The unknown compound is ethanol."
{{< /blockquote >}}

## b.) 
{{< blockquote id="Physics-test-quote" >}} 
Now, ∀I is symbolic AI system that encodes knowledge from physics into rules and structures to generate conclusions about observations. Suppose a student runs a physics experiment where an object is launched and follows a parabolic trajectory. 

The student uses ∀I and provides the following input: "An object moves along a parabolic arc. There is no visible propulsion after launch. What is the likely force acting on the object?"

∀I applies a rule based on domain knowledge: "If an object follows a parabolic path, then it was likely subject to gravitational force alone after launch." Second, "The student reports parabolic motion." Finally: "(if (parabolic-path) then (suggest-force "gravity-only"))." The output ∀I shows is: "The force acting on the object is gravity only."
{{< /blockquote >}}

## c.)
{{< blockquote id="Linguistics-test-quote" >}} 
∀I is a symbolic AI system that encodes knowledge from linguistics into rules and structures to generate syntactic and semantic analyses of sentences. Suppose a student studies sentence structure and provides ∀I with the sentence: "The chicken is ready to eat. What does this sentence mean?" The student knows this sentence is used in a context about eating chicken for dinner.

∀I applies the following rule based on linguistic heuristics: "If a sentence follows the pattern 'NP is ready to VP', then the NP is the agent of the action."
Next, ∀I identifies the syntactic patterns: "The chicken (NP)" and "is ready to eat (copular + infinitive)". ∀I then concludes: (if (pattern "NP is ready to VP") then (interpret-as agent(NP, VP))). So it outputs: “The sentence means the chicken is ready to perform the action of eating.”
{{< /blockquote >}}

## d.) 
{{< blockquote id="Art-test-quote" >}} 
∀I is a symbolic AI system that operates via a knowledge base and a set of inference rules that relate visual features and symbolic content to art historical categories. 

Suppose ∀I is given a painting featuring the following symbolic elements: A stormy seascape with a lone figure gazing toward the horizon, high contrast between light and dark areas.

∀I infers the following: "If a painting contains mythological subjects and dramatic contrast in lighting, then it is likely Baroque", then "the painting has no mythological subjects", therefore "This painting is not Baroque."
{{< /blockquote >}}

## e.)
{{< blockquote id="Art-test-quote" >}} 
∀I is a symbolic AI system that is tasked with proving the following statement in number theory: "Theorem T: every even integer greater than 2 is the sum of two primes (Goldbach-compliant)."

Now imagine that, somewhere in the system’s formal environment, a definition or lemma has been introduced, perhaps during preprocessing, or imported from a library—stating: "Definition D1: An even number greater than 2 is Goldbach-compliant if it is the sum of two primes."

And then, possibly innocently: "Lemma L1: All even integers greater than 2 are Goldbach-compliant."

∀I parses the claim, checks known lemmas and finds L1. 

{{< /blockquote >}}

## Solution {#malfunctioning-systemsSolution .solution}

**a.)** This symbolic AI system used in chemistry, ∀I, makes a mistake in the logic of the inference. It is an example of the fallacy of affirming the consequent. While "ethanol" is the result that ∀I prints, this might not be the only option. The student knows that also dimethyl ether has a molecular mass of 46 and can fragment in ways that produce a peak at 31. Thus, the peak at 31 is not unique to ethanol. The system should use a different strategy to reach a valid inference. For instance, use the rule: "(if (peak-at 31) then (suggest-structures "ethanol" "dimethyl ether" "propanal")). Then, the system may prompt the student for more information: "Are there other peaks at m/z=45 or 29?" to conclude which specific compound the liquid is.

**b.)** The inference ∀I makes is invalid, since it fails due to a hidden assumption of ceteris paribus (all else being equal) that does not hold in this case. Suppose the object is inside a moving train: the train is moving at a constant velocity, and the object is launched vertically inside the train. Due to Galilean relativity, the object follows a parabolic arc relative to the ground, but from the train's frame it appears to go straight up and down. In this case, the object is also subject to inertial frame effects. the observation (parabolic motion) does not uniquely imply that only gravity is at play. Relative motion of the observer is essential context. To make the inference valid, the symbolic AI system ∀I must explicitly condition its inference on the assumptions required for the rule to hold. That means, instead of drawing conclusions directly from observations, it must embed contextual constraints, especially about reference frames, initial conditions, and background forces—within its inference rules. New decision rule: "if parabolic trajectory observed, and object is in an inertial frame, and no other forces after launch, and air resistance is negligible, then gravity is the only acting force."

**c.)** This inference fails due to a semantic ambiguity in natural language, and the system’s failure to account for multiple possible syntactic roles of the noun phrase (NP). In this case, the sentence "The chicken is ready to eat" is structurally ambiguous: via agent reading, the chicken will eat (as ∀I assumes), but via patient reading, the chicken will be eaten. The structure “ready to eat” is ambiguous between control and raising constructions, and ∀I chooses one without disambiguating context or probabilistic support. To make the inference linguistically valid, ∀I must recognize the structural ambiguity and generate multiple interpretations, like agent(chicken, eat), patient(chicken, eat) and to return a disjunctive interpretation.

**d.)** This inference is invalid, since this inference attempts to move from part of the antecedent of a conditional statement to the negation of the consequent. This is a variant of a classic logical fallacy: non sequitur. The conditional involves conjunction. Indeed, the implication only holds when both conditions, mythological subjects and dramatic contrast, are present. Second, only one part of the antecedent is known. From this, a conclusion is drawn about the negation of the consequent, which does not logically follow. To avoid this fallacy, we can add more information about the painting, or we can use a contrapositive form of the conditional. 

**e.)** Because L1 essentially restates the theorem T, the prover accepts it as a valid inference path. ∀I proceeds as follows: first, lookup is n Goldbach-compliant? Second, by L1 yes. Finally, T is true. The system declares the theorem proven, having merely restated it under another name. This is a circular reasoning, because the conclusion is assumed via a reformulation, and the lemma L1 smuggles in the conclusion. This inference can be solved by breaking the circle by grounding recursive definitions in base axioms.

# Research {.solved}

Note: These questions _require_ you to research the answer yourself using reliable academic sources. You need to reference your sources!

**Reasoning**

Are all forms of "good" reasoning either deductive or inductive?

## Solution {#researchSolution .solution}

Try to give positive feedback on any interesting answer that shows some work.
Here is one possible answer. 

We defined induction by probabilistic support. That is pretty much the broadest
notion of truth-preservation we can define. If truth is all that matters, then
all good reasoning would have to be deductive or inductive. But there are
theories of reasoning that say that some reasoning methods are good for other
reasons apart from tracking truth. For example, some people think that
*inference to the best explanation* is a good reasoning strategy, but the notion
of "best" explanation depends on contingent scientific values of a community.

# Discussion {.solved}

Inductive logic in general is non-monotonic because new (premise) information
can turn a valid inference into an invalid inference. But what if we know
something about _how_ a new piece of information _relates_ to our old premises?
Some versions of inductive logic support 'limited' versions of monotonicity
based on situations where new information (the '$B$' premises in these examples)
comes from the right place. Do you think these limited forms of monotonicity are
correct? Explain your answer.

a) Cautious Monotonicity: If $A \mid\approx C$ and $A \mid\approx B$, then $
A\land B \mid\approx C $

b) Rational Monotonicity: If $A \mid\approx C$ and not $A \mid\approx \neg B$,
then $ A\land B \mid\approx C $

## Solution {.solution #discussionSolution}

There are theoretical assumptions behind the concept of inductive support. So
the student can try to explain some assumptions that *verify* these rules. They
can also try to explain why the rules *fail* for standard conditional
probabilities.

Here an example for **Cautious Monotonicity**. You have a population of toys in
different shapes: monsters, aliens, dinosaurs. Every toy is red, blue, green,
purple, or yellow. Almost all toys are yellow. The few green toys are all
dinosaurs, and the few red toys are all dinosaurs. There are a lot of yellow
dinosaurs too. With $A=$ dinosaur, $B=$ red, $C=$ green, we could have
probabilities like this.

$P(B|A)=0.2$ greater than $P(B)=0.1$

$P(C|A)=0.2$ greater than $P(C)=0.1$

$P(C|A\land B)=0$ because no green toy is a red dinosaur toy.
