---
title: FOL inference
author: Johannes Korbmacher
weight: 9
params: 
  id: exc-finf
  math: true
---

# Natural deduction {.homework .solved}

_Exercises 2.,4.,6. are homework_

Show the following in natural deduction for FOL:

1. $\forall x\mathsf{Happy}(x)\land \forall x\mathsf{Fulfilled}(x)\vdash \forall x(\mathsf{Happy}(x)\land \mathsf{Fulfilled}(x))$
2. $\exists x(\mathsf{Happy}(x)\lor \mathsf{Fulfilled}(x))\vdash \exists x\mathsf{Happy}(x)\lor\exists x\mathsf{Fulfilled}(x)$
3. $\forall x\neg\mathsf{Happy}(x)\vdash \neg \exists x\mathsf{Happy}(x)$
4. $\exists x\forall y\mathsf{Friend}(x,y)\vdash \forall y\exists x\mathsf{Friend}(x,y)$
5. $\neg\exists x\mathsf{Happy}(x)\vdash \forall x\neg \mathsf{Happy}(x)$
6. $\neg\forall x\mathsf{Sad}(x)\vdash \exists x\neg \mathsf{Sad}(x)$

## Solution {.solution #natural-deductionSolution }

{{< img src="img/nd-1.png" class="img-thumbnail mx-auto d-block my-4" >}}
{{< img src="img/nd-2.png" class="img-thumbnail mx-auto d-block my-4" >}}
{{< img src="img/nd-3.png" class="img-thumbnail mx-auto d-block my-4" >}}
{{< img src="img/nd-4.png" class="img-thumbnail mx-auto d-block my-4" >}}
{{< img src="img/nd-5.png" class="img-thumbnail mx-auto d-block my-4" >}}
{{< img src="img/nd-6.png" class="img-thumbnail mx-auto d-block my-4" >}}



# Unification {.solved}

For the following pairs of formulas, determine whether there are unifications.
If there is one, give it, if there is not explain why not.

1. $\mathsf{Between}(Munich,y,z)$ and $\mathsf{Between}(x,Milan,Rome)$
2. $\mathsf{Between}(x,Rome,Rome)$ and $\mathsf{Between}(Rome,y,x)$
3. $\mathsf{Knows}(Mary,x)\land \neg\mathsf{Happy}(x)$ and $\mathsf{Knows}(x,x)\land\neg\mathsf{Happy}(Jane)$
4. $\neg\mathsf{Happy}(x)\lor \mathsf{Knows}(Mary,x)$ and $\mathsf{Knows}(x,x)\land\neg\mathsf{Happy}(Mary)$

## Solution {.solution #unificationSolution}

**1.**

$[x\mapsto Munich,y\mapsto Milan, z\mapsto Rome]$

**2.**

$[x\mapsto Rome,y\mapsto Rome, z\mapsto Rome]$


**3.**

Not possible. With $[x\mapsto Mary]$ we have $\neg\mathsf{Happy}(Mary)$ on one
side and $\neg\mathsf{Happy}(Jane)$ on the other side. With $[x\mapsto Jane]$
we have $\mathsf{Knows}(Mary, Jane)$ on one side and
$\mathsf{Knows}(Jane,Jane)$ on the other side.

**4.**

Not possible. The logical form of the two sentences would be different
regardless of how we substitute terms. The main connective on the left is
disjunction and on the right is conjunction.

# CNF {.homework .solved}

_Exercises 2.,4. are homework_

Transform the following formulas into FOL CNF. Give your step-by-step
transformation (you may perform several similar transformations in a single
step).

1. $\forall x\exists y (\mathsf{Friend}(x,y)\to \exists z\neg (\mathsf{Happy}(z)\land\mathsf{Fulfilled}(z)))$ 
2. $\forall x(\forall y \mathsf{Friend}(x,y)\to \forall z\neg (\mathsf{Happy}(z)\land\mathsf{Fulfilled}(z)))$ 
3. $\mathsf{Happy}(x)\to \neg\forall x(\mathsf{Friend}(x,y)\land \neg\mathsf{Friend}(y,x))$
4. $\neg \exists x(\mathsf{Happy}(x)\land(\neg\mathsf{Fulfilled}(x)\land\mathsf{Knows}(x,x)))$

## Solution {.solution #cnfSolution}

**1.**

+ Start here:
$\forall x\exists y(\mathsf{Friend}(x,y)\to\exists z\neg(\mathsf{Happy}(z)\land\mathsf{Fulfilled}(z)))$
+ Convert the conditional:
$\forall x\exists y(\neg\mathsf{Friend}(x,y)\lor\exists z\neg(\mathsf{Happy}(z)\land\mathsf{Fulfilled}(z)))$
+ Use de Morgan rule on the right:
$\forall x\exists y(\neg\mathsf{Friend}(x,y)\lor\exists z(\neg\mathsf{Happy}(z)\lor\neg\mathsf{Fulfilled}(z)))$
+ Skolemize the inner existential:
$\forall x\exists y(\neg\mathsf{Friend}(x,y)\lor(\neg\mathsf{Happy}(f(x))\lor\neg\mathsf{Fulfilled}(f(x))))$
+ Skolemize the outer existential:
$\forall x(\neg\mathsf{Friend}(x,g(x))\lor(\neg\mathsf{Happy}(f(x))\lor\neg\mathsf{Fulfilled}(f(x))))$
+ Drop the universal:
$\neg\mathsf{Friend}(x,g(x))\lor\neg\mathsf{Happy}(f(x))\lor\neg\mathsf{Fulfilled}(f(x))$

<br>

**2.**

+ Start here:
$\forall x(\forall y\mathsf{Friend}(x,y)\to\forall z\neg(\mathsf{Happy}(z)\land\mathsf{Fulfilled}(z)))$
+ Convert the conditional:
$\forall x(\neg\forall y\mathsf{Friend}(x,y)\lor\forall z\neg(\mathsf{Happy}(z)\land\mathsf{Fulfilled}(z)))$
+ Use de Morgan rule on the right:
$\forall x(\neg\forall y\mathsf{Friend}(x,y)\lor\forall z(\neg\mathsf{Happy}(z)\lor\neg\mathsf{Fulfilled}(z)))$
+ Convert negated universal on the left:
$\forall x(\exists y\neg\mathsf{Friend}(x,y)\lor\forall z(\neg\mathsf{Happy}(z)\lor\neg\mathsf{Fulfilled}(z)))$
+ Skolemize the existential:
$\forall x(\neg\mathsf{Friend}(x,f(x))\lor\forall z(\neg\mathsf{Happy}(z)\lor\neg\mathsf{Fulfilled}(z)))$
+ Drop the universal quantifiers:
$\neg\mathsf{Friend}(x,f(x))\lor\neg\mathsf{Happy}(z)\lor\neg\mathsf{Fulfilled}(z)$

<br>

**3.**

+ Start here:
$\mathsf{Happy}(x)\to\neg\forall x(\mathsf{Friend}(x,y)\land\neg\mathsf{Friend}(y,x))$
+ Relabel variable on the left:
$\mathsf{Happy}(z)\to\neg\forall x(\mathsf{Friend}(x,y)\land\neg\mathsf{Friend}(y,x))$
+ Convert the conditional:
$\neg\mathsf{Happy}(z)\lor\neg\forall x(\mathsf{Friend}(x,y)\land\neg\mathsf{Friend}(y,x))$
+ Convert negated universal:
$\neg\mathsf{Happy}(z)\lor\exists x\neg(\mathsf{Friend}(x,y)\land\neg\mathsf{Friend}(y,x))$
+ Use de Morgan rule on the right:
$\neg\mathsf{Happy}(z)\lor\exists x(\neg\mathsf{Friend}(x,y)\lor\neg\neg\mathsf{Friend}(y,x))$
+ Remove double negation:
$\neg\mathsf{Happy}(z)\lor\exists x(\neg\mathsf{Friend}(x,y)\lor\mathsf{Friend}(y,x))$
+ Skolemize the existential:
$\neg\mathsf{Happy}(z)\lor\neg\mathsf{Friend}(f,y)\lor\mathsf{Friend}(y,f)$

<br>

**4.**

+ Start here:
$\neg\exists x(\mathsf{Happy}(x)\land(\neg\mathsf{Fulfilled}(x)\land\mathsf{Knows}(x,x)))$
+ Convert negated existential:
$\forall x\neg(\mathsf{Happy}(x)\land(\neg\mathsf{Fulfilled}(x)\land\mathsf{Knows}(x,x)))$
+ Use de Morgan rule:
$\forall x(\neg\mathsf{Happy}(x)\lor\neg(\neg\mathsf{Fulfilled}(x)\land\mathsf{Knows}(x,x)))$
+ Use de Morgan again:
$\forall x(\neg\mathsf{Happy}(x)\lor(\neg\neg\mathsf{Fulfilled}(x)\lor\neg\mathsf{Knows}(x,x)))$
+ Remove double negation:
$\forall x(\neg\mathsf{Happy}(x)\lor(\mathsf{Fulfilled}(x)\lor\neg\mathsf{Knows}(x,x)))$
+ Drop the universal quantifier:
$\neg\mathsf{Happy}(x)\lor\mathsf{Fulfilled}(x)\lor\neg\mathsf{Knows}(x,x)$


# Resolution {.solved}

Use the resolution rule to justify the following inferences:

1. $\forall x(\mathsf{Lord}(x)\to \mathsf{Happy}(x)),\neg\mathsf{Happy}(Byron)\vDash \neg\mathsf{Lord}(Byron)$
2. $\neg\exists x(\mathsf{Lord}(x)\land \mathsf{Happy}(x)),\forall x\exists y(\mathsf{Friend}(x,y)\to \mathsf{Happy}(x))\vDash \neg\exists x(\mathsf{Lord}(x)\land \exists y(\mathsf{Friend}(x,y)))$

## Solution {.solution #resolutionSolution }

{{< img src="img/resolution-1.png" class="img-thumbnail mx-auto d-block my-4" >}}
{{< img src="img/resolution-2.png" class="img-thumbnail mx-auto d-block my-4" >}}


# Research {.homework}

## a)

How can we handle the equality $=$ in natural deduction for FOL? Give an simple
sample derivation in the system, which shows how the rules work.

## b)

What are the corresponding rules in resolution systems called? 

# Discussion

Some researchers, especially those interested in the conceptual foundations of
logic, argue that resolution-based proof systems are not "really" proof systems
because they don't directly model human-style reasoning. Do you agree or
disagree? Substantiate your answer with an argument. 
