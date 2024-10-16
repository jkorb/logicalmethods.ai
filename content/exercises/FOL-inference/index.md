---
title: FOL inference
author: Johannes Korbmacher
weight: 9
params: 
  id: exc-finf
  math: true
---

# Natural deduction {.homework}

_Exercises 2.,4.,6. are homework_

Show the following in natural deduction for FOL:

1. $\forall x\mathsf{Happy}(x)\land \forall x\mathsf{Fulfilled}(x)\vdash \forall x(\mathsf{Happy}(x)\land \mathsf{Fulfilled}(x))$
2. $\exists x(\mathsf{Happy}(x)\lor \mathsf{Fulfilled}(x))\vdash \exists x\mathsf{Happy}(x)\lor\exists x\mathsf{Fulfilled}(x)$
3. $\forall x\neg\mathsf{Happy}(x)\vdash \exists x\neg \mathsf{Happy}(x)$
4. $\exists x\forall y\mathsf{Friend}(x,y)\vdash \forall y\exists x\mathsf{Friend}(x,y)$
5. $\neg\exists x\mathsf{Happy}(x)\vdash \forall x\neg \mathsf{Happy}(x)$
6. $\neg\forall x\mathsf{Sad}(x)\vdash \exists x\neg \mathsf{Sad}(x)$


# Unification

For the following pairs of formulas, determine whether there are unifications.
If there is one, give it, if there is not explain why not.

1. $\mathsf{Between}(Munich,y,z)$ and $\mathsf{Between}(x,Milan,Rome)$
2. $\mathsf{Between}(x,Rome,Rome)$ and $\mathsf{Between}(Rome,y,x)$
3. $\mathsf{Knows}(Mary,x)\land \neg\mathsf{Happy}(x)$ and $\mathsf{Knows}(x,x)\land\neg\mathsf{Happy}(Jane)$
4. $\neg\mathsf{Happy}(x)\lor \mathsf{Knows}(Mary,x)$ and $\mathsf{Knows}(x,x)\land\neg\mathsf{Happy}(Mary)$

# CNF {.homework}

_Exercises 2.,4. are homework_

Transform the following formulas into FOL CNF. Give your step-by-step
transformation (you may perform several similar transformations in a single
step).

1. $\forall x\exists y (\mathsf{Friend}(x,y)\to \exists z\neg (\mathsf{Happy}(z)\land\mathsf{Fulfilled}(z)))$ 
2. $\forall x(\forall y \mathsf{Friend}(x,y)\to \forall z\neg (\mathsf{Happy}(z)\land\mathsf{Fulfilled}(z)))$ 
3. $\mathsf{Happy}(x)\to \neg\forall x(\mathsf{Friend}(x,y)\land \neg\mathsf{Friend}(y,x))$
4. $\neg \exists x(\mathsf{Happy}(x)\land(\neg\mathsf{Fulfilled}(x)\land\mathsf{Knows}(x,x)))$

# Resolution

Use the resolution rule to justify the following inferences:

1. $\forall x(\mathsf{Lord}(x)\to \mathsf{Happy}(x)),\neg\mathsf{Happy}(Byron)\vDash \neg\mathsf{Lord}(Byron)$
2. $\neg\exists x(\mathsf{Lord}(x)\land \mathsf{Happy}(x)),\forall x\exists y(\mathsf{Friend}(x,y)\to \neg\mathsf{Happy}(x))\vDash \neg\exists x(\mathsf{Lord}(x)\land \exists y(\mathsf{Friend}(x,y)))$

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
