---
title: Logic and probability
author: Johannes Korbmacher
locked: true
weight: 110
params: 
  id: exc-prob
  math: true
---

# Probability functions {.solved}

Suppose we're dealing with a coin-flip, which we analyze in a propositional
language with $\neg,\land,\lor$ and propositional variables:

$$\mathsf{HEADS}\mid \mathsf{TAILS}.$$

Our aim is to define a probability for each formula $A\in\mathcal{L}$. 
We're wondering whether a given set of conditions is sufficient for this
purpose.

Since the general question whether a given condition defines a total probability
function is a bit too complicated at this point, we'll work with the following
four formulas as our test cases:


1) $\neg\mathsf{HEADS}$
2) $\neg\mathsf{TAILS}$
3) $\mathsf{HEADS}\lor \mathsf{TAILS}$
4) $\mathsf{HEADS}\land\mathsf{TAILS}$

For each of the following sets of conditions, check whether they determine the
probabilities of all of the above formulas by calculating them using the
probabilistic laws. If there's information missing, say exactly which
information is missing and why you can't calculate the value of the given
formula.

## a) 

$$Pr(\mathsf{HEADS})=\frac{1}{2}\quad Pr(\mathsf{TAILS})=\frac{1}{2}$$


## b) 

$$Pr(\mathsf{HEADS}\lor\mathsf{TAILS})=\frac{1}{2} \qquad Pr(\mathsf{HEADS}\land\mathsf{TAILS})=\frac{1}{2}$$

## c) {.homework}

$$Pr(\mathsf{HEADS})=0.7\quad Pr(\mathsf{TAILS})=0.3\qquad
Pr(\mathsf{HEADS}\land\mathsf{TAILS})=0$$

## d)

$$Pr(\mathsf{HEADS}\land\mathsf{TAILS})=1$$

## e) {.homework}

$$Pr(\mathsf{HEADS})=0\qquad Pr(\mathsf{HEADS}\land\mathsf{TAILS})=0$$

## Solution {.solution #probability-functionsSolution}


**(a)**

Solutions:

1. $Pr(\neg H) = 1-Pr(H) = 0.5$
2. $Pr(\neg T) = 1-Pr(T) = 0.5$
3. We could solve this if we could solve 4, but...
4. We don't have enough information to determine $Pr(H\land B)$.

<br>

**(b)**

Using inclusion-exclusion we have $Pr(H\lor T)=Pr(H)+Pr(T)-Pr(H\land T)$, plugging in the two values given in this case $0.5=Pr(H)+Pr(T)-0.5$ and so we have $1=Pr(H)+Pr(T)$.

1. $Pr(\neg H) = 1-Pr(H)$. From above $1-Pr(H)=Pr(T)$. So we can say $Pr(\neg H) = Pr(T)$ but that's about the best we can do. 
2. $Pr(\neg T) = 1-Pr(T)$. From above $1-Pr(T)=Pr(H)$. So we can say $Pr(\neg T) = Pr(H)$ but that's about the best we can do. 
3. The answer was given in the exercise.
4. The answer was given in the exercise.

<br>

**(c)**
Solutions:

1. $Pr(\neg H) = 1-Pr(H) = 0.3$
2. $Pr(\neg T) = 1-Pr(T) = 0.7$
3. Since $Pr(H\land T)=0$, we have $Pr(H\lor T)=Pr(H)+Pr(T)=1$ by the third axiom.
4. The answer was given in the exercise.

<br>

**(d)**
Solutions:

1. We don't have enough information to determine $Pr(H)$ or $Pr(\neg H)$.
2. We don't have enough information to determine $Pr(T)$ or $Pr(\neg T)$.
3. $Pr(H\lor T)=Pr(H)+Pr(T)-1$ using inclusion-exclusion but that is all we can say.
4. The answer was given in the exercise.

<br>

**(e)**

Solutions:

1. $Pr(\neg H) = 1-Pr(H) = 1$
2. We don't have enough information to determine $Pr(T)$ or $Pr(\neg T)$.
3. Since $Pr(H\land T)=0$, we have $Pr(H\lor T)=Pr(H)+Pr(T)=0+Pr(T)$ by the third axiom, but that is all we can say.
4. The answer was given in the exercise.

<br>

# Probability laws {.solved}

Derive the following laws for probabilities from the axioms:

## a)

$$Pr(A)\leq 1,\text{ for all }A\in\mathcal{L}$$


## b)

If $A\vDash B$, then $Pr(A)\leq Pr(B)$

_Hint_: Remember that if $A\vDash B$, then $\vDash\neg(A\land \neg B)$ and $B$
is equivalent to $A\lor B$.

## c)

$$Pr(A\lor B)=Pr(A)+Pr(B)-Pr(A\land B)$$

## Solution {.solution #probability-lawsSolution}


**(a)**

Solution:

+ Take any $A$. Consider its negation $\neg A$.
+ $0\leq Pr(\neg A)$ by the first axiom.
+ We know that $Pr(\neg A)= 1-Pr(A)$.
+ $0\leq 1-Pr(A)$ by substitution.
+ $Pr(A)\leq 1$ by adding $Pr(A)$ to each side.

<br>

**(b)**
Solution:

+ Assume that $A\vDash B$.
+ Our assumption implies that $\vDash\neg(A\land\neg B)$
+ So we have $Pr(A\lor\neg B)=Pr(A)+Pr(\neg B)$ by the third axiom.
+ We know that $Pr(\neg B)= 1-Pr(B)$.
+ So we have $Pr(A\lor\neg B)=Pr(A)+1-Pr(B)$.
+ We just proved that $Pr(A\lor\neg B)\leq 1$ holds for any formula.
+ So in this case we must have $Pr(A)+1-Pr(B)\leq 1$.
+ $Pr(A)+1\leq Pr(B)+1$ by adding $Pr(B)$ to each side.
+ $Pr(A)\leq Pr(B)$ by subtracting $1$ from each side.

<br>

**(c)**
This one is complicated.

Fact 1.

+ $A\lor(B\land\neg A)\vDash A\lor B$ and $A\lor B\vDash A\lor(B\land\neg A)$
+ You can check this with truth tables or natural deduction proofs
+ By exercise (b) these formulas must have the same probability
+ $Pr(A\lor B)=Pr(A\lor(B\land\neg A))$

Fact 2.

+ $\vDash\neg(A\land(B\land\neg A))$
+ That means we have independence of these events,
+ Using axiom three we calculate the disjunction as follows
+ $Pr(A\lor(B\land\neg A))=Pr(A)+Pr(B\land\neg A)$

Fact 3.

+ $Pr(A\land B)-Pr(A\land B)=0$
+ That means we can "add this" to any quantity
+ $Pr(A)+Pr(B\land\neg A)=Pr(A)+Pr(B\land\neg A)+Pr(A\land B)-Pr(A\land B)$

Fact 4.

+ $\vDash\neg((B\land\neg A)\land(A\land B))$
+ That means we have independence of our two middle quantities
+ $Pr(B\land\neg A)$ and $Pr(A\land B)$ determine the disjunction $Pr((B\land\neg A)\lor(A\land B))$
+ $Pr(A)+Pr(B\land\neg A)+Pr(A\land B)-Pr(A\land B)=Pr(A)+Pr((B\land\neg A)\lor(A\land B))-Pr(A\land B)$

Fact 5.

+ $B\vDash (B\land A)\lor(B\land\neg A)$ and $(B\land A)\lor(B\land\neg A)\vDash B$
+ You can check this with truth tables or natural deduction proofs
+ By exercise (b) these formulas must have the same probability
+ $Pr(B)=Pr((B\land A)\lor(B\land\neg A))$

Fact 6.

+ By combining the results from Fact 4 and 5 we get this
+ $Pr(A)+Pr((B\land\neg A)\lor(A\land B))-Pr(A\land B)=Pr(A)+Pr(B)-Pr(A\land B)$
+ And if we string together Facts 1-6 we have the inclusion-exclusion equation

<br>

# Probability truth-tables {.solved}

Remember our probability function for the fair die:

$$Pr_{\text{fair}}(\mathsf{RESULT}_i)=\frac{1}{6}\text{, for }i=1,\dots,6$$
$$Pr\_{\text{fair}}(\mathsf{RESULT}_i\land \mathsf{RESULT}_j)=0\text{, for all }i\neq
j$$
$$Pr\_{\text{fair}}(\neg\mathsf{RESULT}_1\land \dots\land\neg\mathsf{RESULT}_6)=0$$

_Note_: I had forgotten the third rule in the textbook, but it's necessary and
added there now, too.

## a)

Use the probability truth-table method to give a probability function for an
_un_fair die, where it's twice as likely that 6 comes up than any other number,
while still exactly one number comes up.

## b)

Making use of appropriate formalizations, calculate the probabilities of the
following claims according to the table:

1. The result is even.
2. The result is odd.
3. The result is neither even nor odd.
4. The result is divisible by 3.

## Solution {.solution #probability-truth-tablesSolution}


{{< img src="img/prob-table.png" class="img-thumbnail mx-auto d-block my-4" >}}

# Inductive validity {.solved}

Take the probability function for the unfair die in the previous exercise.
Using appropriate formalizations, determine whether the following inferences
are (weakly) inductively valid:

## a) {.homework}

The die came up odd, so it's likely a 3 or 5.

## b) 

The die came up odd, so it's likely a 6.

## b)

The die came up even, so it's likely a 2.

## c) {.homework}

The die came up even, so it's likely a 6.

## Solution {.solution #inductive-validitySolution}

**(a)**

The premise is $\mathsf{ODD}$ and we have $Pr(\mathsf{ODD})=\frac{3}{7}$. The conclusion is $\mathsf{RES}_3\lor\mathsf{RES}_5$ and we have $Pr(\mathsf{RES}_3\lor\mathsf{RES}_5)=\frac{2}{7}$. We also need the information $Pr(\mathsf{ODD}\land(\mathsf{RES}_3\lor\mathsf{RES}_5))=\frac{2}{7}$. Then we calculate conditional probability $Pr(\mathsf{RES}_3\lor\mathsf{RES}_5|\mathsf{ODD})=\frac{2}{7}/\frac{3}{7}=\frac{2}{3}$. Since this is higher than the conclusion by itself, the inference is (weakly) inductively valid.

<br>

**(b)**

The premise is $\mathsf{ODD}$ and we have $Pr(\mathsf{ODD})=\frac{3}{7}$. The conclusion is $\mathsf{RES}_6$ and we have $Pr(\mathsf{RES}_6)=\frac{2}{7}$. We also need the information $Pr(\mathsf{ODD}\land\mathsf{RES}_3)=0$. Then we calculate conditional probability $Pr(\mathsf{RES}_6|\mathsf{ODD})=0/\frac{3}{7}=0$. This is lower than the conclusion probability by itself. The inference is invalid.

<br>

**(c)**

The premise is $\mathsf{EVEN}$ and we have $Pr(\mathsf{EVEN})=\frac{4}{7}$. The conclusion is $\mathsf{RES}_2$ and we have $Pr(\mathsf{RES}_2)=\frac{1}{7}$. We also need the information $Pr(\mathsf{EVEN}\land\mathsf{RES}_2)=\frac{1}{7}$. Then we calculate conditional probability $Pr(\mathsf{RES}_2|\mathsf{EVEN})=\frac{1}{7}/\frac{4}{7}=\frac{1}{4}$. Since this is higher than the conclusion by itself, the inference is ((weakly) inductively valid.

<br>

**(d)**

The premise is $\mathsf{EVEN}$ and we have $Pr(\mathsf{EVEN})=\frac{4}{7}$. The conclusion is $\mathsf{RES}_6$ and we have $Pr(\mathsf{RES}_6)=\frac{2}{7}$. We also need the information $Pr(\mathsf{EVEN}\land\mathsf{RES}_6)=\frac{2}{7}$. Then we calculate conditional probability $Pr(\mathsf{RES}_6|\mathsf{EVEN})=\frac{2}{7}/\frac{4}{7}=\frac{1}{2}$. Since this is higher than the conclusion by itself, the inference is (weakly) inductively valid.

<br>

# Measures of inductive strength {.solved}

Inductive logicians have proposed different measures of the inductive strength
of an argument.

We've effectively seen:

$$Pr(C|P_1\land P_2\land\dots)-Pr(C)$$

A popular alternative measure is: 

$$\log\frac{Pr(C|P_1\land P_2\land\dots)}{Pr(C)}$$

Here $\log$ is the [logarithm
function](https://en.wikipedia.org/wiki/Logarithm) with basis $2$.

Using a suitable computer (for calculating the $\log$'s), compare the two
measures by plugging in values for:
$$Pr(C)$$
$$Pr(C|P_1\land P_2\land\dots)$$ 

What are the differences between the two measures, where do they work better,
where worse?

## Solution {.solution #measures-of-inductive-strengthSolution}

Consider the last two inferences we studied $\mathsf{EVEN} \mid\overset{!}{\approx} \mathsf{RES}_2$ and $\mathsf{EVEN} \mid\overset{!}{\approx} \mathsf{RES}_6$ about the unfair die. Just based on informal thinking, do you think one inference is stronger? 

Let's compare two formal measures of strength.

According to the measure we have been assuming, the strength of the first inference $\mathsf{EVEN} \mid\overset{!}{\approx} \mathsf{RES}_2$ is calculated by $Pr(\mathsf{RES}_2|\mathsf{EVEN})-Pr(\mathsf{RES}_2)=\frac{1}{4}-\frac{1}{7}\approx 0,107$. The strength of the second inference $\mathsf{EVEN} \mid\overset{!}{\approx} \mathsf{RES}_6$ is calculated by $Pr(\mathsf{RES}_6|\mathsf{EVEN})-Pr(\mathsf{RES}_6)=\frac{1}{2}-\frac{2}{7}\approx 0,214$. Neither inference is extremely strong but there is a big difference between them.

According to the logarithmic measure, the strength of the first inference $\mathsf{EVEN} \mid\overset{!}{\approx} \mathsf{RES}_2$ is calculated by $\mathrm{log}(Pr(\mathsf{RES}_2|\mathsf{EVEN})/Pr(\mathsf{RES}_2))=\mathrm{log}(\frac{1}{4}/\frac{1}{7})\approx 0.807$. The strength of the second inference $\mathsf{EVEN} \mid\overset{!}{\approx} \mathsf{RES}_6$ is calculated by $\mathrm{log}(Pr(\mathsf{RES}_6|\mathsf{EVEN})/Pr(\mathsf{RES}_6))=\mathrm{log}(\frac{1}{2}/\frac{2}{7})\approx 0.807$. This theory says that the strength is the same. Do you think that is the right way to model strength of reasoning? Or is the other measurement better?

# Discussion {.homework}

Our notion of valid inductive inference has as a consequence that if
$$P_1,P_2,\dots\mid\approx C,$$ then $$P_1,P_2,\dots\mid\approx C\land D,$$ for
arbitrary $D$ (check you understand why!!). Some authors think that this is a
problem, because the $D$ might be completely irrelevant to the inference at
hand. Do you think this is a problem? Justify your answer in one or two
paragraphs, making use of an example.
