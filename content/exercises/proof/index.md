---
title: Logical proofs
author: Johannes Korbmacher
weight: 7
params: 
  id: exc-proof
  math: true
---

# Hilbert systems

Provide derivations in our Hilbert system for the following provability claims:

## a) Easier

1. $\neg p\to (p\to p)$
2. $\vdash q\to (p\lor q)$
3. $p\to q,q\to r\vdash p\to r$

## b) Harder

1. $\vdash \neg\neg p\to p$
2. $\vdash p\to (p\lor q)$
3. $\vdash (p\land q)\to p$

_Hint_: It's generally advisable to derive auxiliary laws along the way. You may
always use claims proved earlier, such as $\vdash p\to p$ in a derivation. 

_Advice_: These can be really hard, but perseverance is the key. If you can't
get them all, don't worry. We won't test your expertise with the Hilbert system.

# Natural deduction systems

Provide derivations in our natural system for the following provability claims:

## a) Easier {.homework}

Only 3.,5., and  6. as homework.

1. $p\vdash p\lor (p\land q)$
2. $p\lor (p\land q)\vdash p$
3. $p\lor q\vdash q\lor p$
4. $p\land q\vdash q\land p$
5. $\neg p,p\lor q\vdash q$
6. $\neg p\lor \neg q\vdash \neg(p\land q)$

## b) Harder

1. $\vdash p\lor\neg p$
2. $p\to q\vdash \neg p\lor q$
3. $\neg(p\land q)\vdash \neg p\lor\neg q$
 
# Lean

For this exercise, you can use the live Lean 4 environment, which is available
onlien [here](https://live.lean-lang.org/).

Lean is a full fledged programming language, so we can't reasonably learn it
completely in just one session. What I'd like you to do, though is to experiment
a bit with it. If you want to learn more and have some time, you can read more
details in [this fantastic
book](https://leanprover.github.io/theorem_proving_in_lean4/title_page.html),
especially [chapter 3](https://leanprover.github.io/theorem_proving_in_lean4/propositions_and_proofs.html) and [chapter 5](https://leanprover.github.io/theorem_proving_in_lean4/tactics.html).

Before we begin a bit of explanation. In the following, we'll provide
copy-paste-able code that you can run directly in the environment. 

Here is the first snippet, which declares $p,q,r$ as variables for propositions:

{{< lean >}}
variable {p : Prop}
variable {q : Prop}
variable {r : Prop}
{{< /lean >}}

This should be at the beginning of any piece of code you run from below.

Lean has several _modes_. We will only use the so-called "tactic" mode. It's a
simplified version of Lean that makes Lean-proofs work more like natural
deduction proofs.

This is easiest shown with an example. Consider the following natural deduction
proof showing that 

$$\vdash p\to p\land (p\lor q)$$

which is known as an absorption law:

{{< img src="img/nd-absorption.png" class="img-thumbnail" >}}

Effectively, we assume $p$ (twice) for $\to I$ and then we derive $p\lor q$ from
one assumption via $\lor I$ and then from this and the second assumption that
$p$ that $p\land (p\lor q)$ via $\land I$.

Here's how this proof in Lean:

{{< lean >}}
theorem absorption_conj : p → (p ∧ (p ∨ q)) := by
  intro hypothesis_p -- Hypothesis for conditional proof
  apply And.intro -- When this completes we have proven (p ∧ (p ∨ q))
  exact hypothesis_p -- This is (trivial proof of) p
  apply Or.inl hypothesis_p -- Here we prove (p ∨ q)
{{< /lean >}}

We first declare that we're proving a ```theorem``` and we call it
```absorption_conj```. Then comes the statement of the theorem. To obtain
$\to,\land,\lor$ in Lean, you can write ```\to```, ```\and```, ```\or```,
respectively.

We then apply the tactics: 

+ ```intro``` introduces an assumption for conditional proof ($\to I$), and we
call it ```hypothesis_p```.

+ ```And.intro``` is essentially $\land I$.  ```apply And.intro``` applies the
rule to the next two complete proofs.

+ ```exact hypothesis_p``` means to precisely apply the hypothesis that $p$,
which is the first input for the ```And.intro```.

+ ```Or.inl``` is the rule $p\vdash p\lor q$ and ```Or.inr``` the rule $q\vdash
  p\lor q$. Here we apply the rule to the assumption that $p$
```hypothesis_p```, which gives us what we need, viz. $p\lor q$.

This completes our proof. The result should look something like this in your
browser:

{{< img src="img/lean-absorption.png" class="img-thumbnail" >}}

No errors means we're good!

One more example for an important concept:

{{< lean >}}
theorem commutativity_or : (p ∨ q) → (q ∨ p) := by
  intro hypothesis_pORq
  apply Or.elim hypothesis_pORq
  · intro hypothesis_p
    apply Or.inr hypothesis_p
  · intro hypothesis_q
    apply Or.inl hypothesis_q
{{< /lean >}}

This is the following natural deduction proof:

{{< img src="img/commutativity.png" class="img-thumbnail" >}}

The $\bullet$ mark the two sub-proofs for the $\lor E$, where we derive $q\lor
p$ from the two assumptions $p$ and $q$. Note that each proof after
```Or.elim``` is a conditional proof: we first show that $p\to q\lor p$ and then
we show that $q\to q\lor p$. This allows us to infer $q\lor p$ from $p\lor q$.
You can write the bullet points in Lean as ```\.```.

Let's see if this is enough. It's your turn:

The basic tactics are:

+ ```intro``` (followed by hypothesis name)
+ ```And.intro``` (followed by two proofs for the conjuncts)
+ ```And.left``` (infers the left conjunct from the conjunction)
+ ```And.right``` (infers the right conjunct from the conjunction)
+ ```Or.inl``` (infers the disjunction from the left disjunct)
+ ```Or.inr``` (infers the disjunction from the right disjunct)
+ ```Or.elim``` (disjunction elimination is followed by two conditional proofs,
one for each disjunct)

## a)

Translate the following LEAN proof into natural deduction:

{{< lean >}}
theorem some_law : (p ∧ q) → (p ∨ q) := by
  intro h
  apply Or.inl
  exact And.left h
{{< /lean >}}

## b)

Which tactics should be used where I wrote ```???```?

{{< lean >}}
example (p q r : Prop) : p ∧ (q ∨ r) → (p ∧ q) ∨ (p ∧ r) := by
  ??? h
  apply Or.elim (And.right h)
  . intro hq
    apply Or.inl
    apply And.intro
    . exact ??? h
    . exact hq
  . intro hr
    apply Or.inr
    apply ??? 
    . exact And.left h
    . exact hr
{{< /lean >}}

## c) 

Give a Lean proof for $\vdash p\lor (p\land q)\to p$ (```absorption_disj```).

# Research

Are the basic tactics enough to prove classical laws, like $\vdash p\lor \neg
p$?

# Discussion

Recent LLM-technologies, like ```ChatGTP o1-preview```, have impressive
reasoning capabilities. So, these LLMs can directly produce mathematical proofs.
Does this show that neural theorem proving using tools like Lean is unnecessary?
