---
title: Logical proofs
author: Johannes Korbmacher
locked: false
weight: 70
params:
  last_edited: "01/10/2026"
  id: txt-proof
---

# Logical proofs

{{< img src="/img/drawings/proof_euclid.svg" class="rounded float-start inert-img img-fluid m-2" width="180px" >}}

In {{< chapter_ref chapter="logic-and-ai" >}}Logic and AI{{< /chapter_ref >}},
we introduced proof theory as a model of stepwise inference. In this chapter,
we'll look at how so-called _proof systems_ make that model precise, how they
work, and how they are used in AI research.

Proof systems specify which inferences we may draw from a given set of
assumptions by means of clearly defined inference rules. In this way, proof
systems make valid reasoning both _explicit_ and _verifiable_ -- they force us
to explicitly justify our reasoning in terms of their rules, enabling us to
check whether the rules have been applied correctly. This approach to reasoning
has deep roots in mathematics: [Euclid’s
Elements](https://en.wikipedia.org/wiki/Euclid%27s_Elements) is an early and
influential example of deriving conclusions from stated assumptions through
explicit arguments. Since the nineteenth century, mathematicians have
explicitly studied formal proof systems to clarify the foundations of
mathematics, giving rise to the field of [proof
theory](https://en.wikipedia.org/wiki/Proof_theory).

{{< img src="/img/drawings/proof_ai_goedel.svg" class="rounded float-end inert-img img-fluid m-2" width="140px" >}}

The study of proofs as mathematical objects has led to a wealth of insights
into the foundations of human reasoning. But from a more practical perspective,
this chapter will highlight how explicitness and verifiability allow humans
and computers to reason together.

The precision of formal inference rules makes it possible to implement them
in a computer program. We've already seen this with
{{< chapter_ref chapter="sat" id="searching-for-a-refutation" >}}refutation search{{< /chapter_ref >}},
{{< chapter_ref chapter="conditionals" id="forward-chaining" >}}forward chaining{{< /chapter_ref >}},
and {{< chapter_ref chapter="conditionals" id="backward-chaining" >}}backward chaining{{< /chapter_ref >}}.
Once we've specified the problem and the permitted rules, a computer can search
for a proof on its own. A successful search gives us a record of how the
conclusion follows from the assumptions.

But computers can also help us construct proofs. A _proof assistant_ can keep
track of our assumptions, suggest a next step, or fill in parts of an argument.
It also forces us to be explicit: a step that we find obvious still needs to be
justified by the rules. Famous examples of [computer-assisted
proofs](https://en.wikipedia.org/wiki/Computer-assisted_proof) include the
[four color theorem](https://en.wikipedia.org/wiki/Four_color_theorem), about
the possible ways of coloring a map, and the [Kepler
conjecture](https://en.wikipedia.org/wiki/Kepler_conjecture), about the
possible packings of spheres. In both proofs, computers checked large
collections of cases that were impractical to check by hand. Both results were
later given fully formal, computer-checked proofs.

The interaction also goes in the other direction. When a computer produces a
proof -- like how chatbots can be used to generate natural language
mathematical proofs -- we want to know whether its reasoning is correct. An
explicit argument allows us to inspect the assumptions and follow the inference
steps. For a long proof, we can also use a proof checker to verify each
application of a rule. This is especially useful for AI-generated mathematics:
a generative AI model can propose an argument, which we then submit to formal
verification. We still need to check that the formal statement expresses the
mathematical claim we intended to prove.

[Lean](https://en.wikipedia.org/wiki/Lean_(proof_assistant)) has become a gold
standard for verifying AI-generated mathematical proofs. For example,
[AlphaProof](https://deepmind.google/blog/ai-solves-imo-problems-at-silver-medal-level/)
uses Lean to check the proofs it finds. This is why we'll look at Lean's basic
way of working in this chapter. We'll begin with natural deduction, a proof
system closely modeled on familiar reasoning with assumptions and cases.
Then we'll see how to express these proofs in Lean, and how checking a proof
is related to checking the type of a computer program.

{{< callout type="objectives" >}}
After studying this chapter, you will be able to:

- Explain how a proof system represents step-by-step reasoning.
- Distinguish proof search from proof checking.
- Construct natural deduction proofs with temporary assumptions and cases.
- Describe how types organize terms and their uses.
- Verify propositional arguments in Lean.
- Explain the Curry–Howard correspondence using a derivation and a typed term.
{{< /callout >}}

## Proof systems

In {{< chapter_ref chapter="logic-and-ai" >}}Logic and AI{{< /chapter_ref >}},
we introduced proof theory as a model of stepwise inference. That model builds
on our model of language from
{{< chapter_ref chapter="formal-languages" >}}Formal languages{{< /chapter_ref >}}:
proof systems operate on _formulas_. So, in this setting, an inference rule
tells us which formulas we may infer from which other formulas.

{{< img src="/img/drawings/proof_ai_radiator.svg" class="rounded float-end inert-img img-fluid m-2" width="130px" >}}

Take our robot's heating argument. We know that it rains, that rain or wind
makes the robot cold, and that a cold robot needs heating. We can work towards
the conclusion in small steps. First, from $RAIN$ we infer $RAIN ∨ WIND$:

{{< inference >}}
$RAIN$
---
$RAIN ∨ WIND$
{{< /inference >}}

Then we use the first conditional to infer $COLD$:

{{< inference >}}
$RAIN ∨ WIND$
$(RAIN ∨ WIND) → COLD$
---
$COLD$
{{< /inference >}}

Finally, we use the second conditional to infer $HEATING$:

{{< inference >}}
$COLD$
$COLD → HEATING$
---
$HEATING$
{{< /inference >}}

Each conclusion can be used in a later step. A proof system, also called a
_(proof_ calculus_, specifies the rules that justify these inference steps.

{{< callout type="definition" title="Proof system" >}}
A {{< term "proof-calculus" "proof system" >}} specifies the permitted starting
points and inference rules for constructing derivations in a formal language.
A {{< term "proof" "logical proof" >}} or
{{< term "proof" "derivation" >}} is a finite construction of formulas by these
rules, with its assumptions recorded.
{{< /callout >}}

There are many ways to organize proofs. That is: there are many different
_kinds_ of proof systems. Some of the important examples are:

- <span id="axiomatic-systems"></span>[Axiomatic systems](https://en.wikipedia.org/wiki/Hilbert_system), such as Hilbert systems,
  begin with {{< term "axiom" "axioms" >}} and use relatively few inference
  rules. They are useful for studying which principles suffice for a logic.
- <span id="sequent-calculi"></span>[Sequent calculi](https://en.wikipedia.org/wiki/Sequent_calculus) work with entire judgments
  about assumptions and conclusions. Their rules let us study the structure
  of proofs and organize proof search.
- <span id="algorithmic-systems"></span>Algorithmic systems, such as [tableaux](https://en.wikipedia.org/wiki/Method_of_analytic_tableaux)
  and [resolution](https://en.wikipedia.org/wiki/Resolution_(logic)), organize proofs around systematic search. We've used
  resolution to search for refutations in
  {{< chapter_ref chapter="sat" >}}SAT{{< /chapter_ref >}}.
- [Natural deduction](https://en.wikipedia.org/wiki/Natural_deduction) uses rules for introducing and using the connectives,
  including rules for reasoning under temporary assumptions. We'll concentrate
  on this system, since it closely follows familiar reasoning.

All these systems let us ask whether a conclusion can be derived from given
assumptions. We use a new symbol for this:

{{< callout type="definition" title="Derivability" >}}
$Γ ⊢ A$ means that there is a formal proof of $A$ from assumptions in $Γ$ in
the chosen proof system. This relation is called
{{< term "derivability" "derivability" >}}.
{{< /callout >}}

Here $Γ$ is a convenient name for a collection of assumptions. We already know
$Γ ⊨ A$: every model of $Γ$ makes $A$ true. We want our proofs to establish that their conclusions follow from their
assumptions in this semantic sense too.

{{< callout type="definition" title="Soundness and completeness" >}}
A proof system is called {{< term "soundness" "sound" >}} iff $Γ ⊨ A$ whenever
$Γ ⊢ A$. And a proof system is called {{< term "completeness" "complete" >}}
iff $Γ ⊢ A$ whenever $Γ ⊨ A$.
{{< /callout >}}

Soundness ensures that following the rules never takes us from true assumptions
to a false conclusion. Completeness ensures that all semantic consequences can
indeed be established by the rules. Note that _finding_ such a proof is another
question: even when we know that one exists,
{{< term "proof-search" "proof search" >}} may be still be -- and typically
_is_ -- hard.

## Natural deduction

The main proof system we'll be working with in this book is known as {{< term
"natural-deduction" "natural deduction" >}}. Historically, this system was
specifically developed with rigorous natural language inference as a target in
mind. The system has no axioms, only inference rules. And the idea is that each
rule corresponds to a basic natural language inference involving the
connectives. This makes natural deduction a good starting point for studying
formal proofs.

To illustrate, let's revisit our heating example. If it's rainy or windy, our
robot gets cold; if it gets cold, it needs heating. It is raining. So it needs
heating. So, our formal premises, then, are: $(RAIN ∨ WIND) → COLD$, $COLD →
HEATING$, and $RAIN$. Here is a derivation of $HEATING$ from these assumptions
using the rules of natural deduction:

{{< logic-app name="deduction" kind="worked" display="full" example="heating" title="A derivation of HEATING" >}}

Our assumptions are on the nodes at the top of this proof tree. The tree
applies natural deduction inference rules -- which we'll study in detail
momentarily --- until we reach the desired conclusion at the bottom. First, $∨
Intro$ lets us infer $RAIN ∨ WIND$ from $RAIN$. Then $→ Elim$ lets us infer
$COLD$ from that disjunction and $(RAIN ∨ WIND) → COLD$. . A second application
gives $HEATING$. By the way: the rule $→ Elim$ is just
{{< term "modus-ponens" "modus ponens" >}}, I'm sure you noticed 😃

### Rules

So, let's go through the rules of natural deduction in
detail. In the system, each connective has rules that
introduce it and rules that let us use a formula
containing it.

{{< callout type="definition" title="Introduction and elimination" >}}
An {{< term "introduction-rule" "introduction rule" >}} derives a formula
with the relevant connective as its main connective. An
{{< term "elimination-rule" "elimination rule" >}} uses a formula with that
main connective to derive a conclusion.
{{< /callout >}}

Here are the rules for our propositional system, grouped by connective. $A$,
$B$, and $C$ stand for arbitrary formulas. A vertical $⋮$ stands for a
derivation, which may contain several steps. Bracketed assumptions are
discharged at the rule carrying their number. In $∨ Elim$, for example, both
case assumptions are discharged.

{{< logic-app name="deduction" kind="rules" title="Natural deduction rules" >}}

We include $↔$ for convenience. Its rules express that $A ↔ B$ gives us both
$A → B$ and $B → A$, and that proving both conditionals establishes the
biconditional. $⊤ Intro$ has no premises: the always-true formula needs no
assumptions. The other rules require the premises shown above their lines.

Some rules require a bit more explanation to get the idea, while some rules are
relatively self-explanatory. For example, $∧ Intro$ says that you can infer $A
∧ B$ being true from both $A$ and $B$ being true. Sure. It's a bit more
complicated, though, to see what's going on in $→ Intro$, $∨ Elim$, and $Ex
falso$. So, let's go through these in turn. Take $→ Intro$ first. In this rule,
we temporarily assume $A$ and derive $B$. The rule then establishes $A → B$,
ending our dependence on that temporary assumption.

{{< callout type="definition" title="Discharge" >}}
An {{< term "open-assumption" "open assumption" >}} is an assumption on which
a derivation still depends. To {{< term "discharge" "discharge" >}} an
assumption is to remove that dependency by an application of a rule that
permits it. Discharge is marked in a natural deduction proof by surrounding the
assumption with brackets $[ ]$.
{{< /callout >}}

We use labels like $h0$, $h1$, and so on to keep track of and identify
assumptions. Note that two assumptions can have the same formula and different
labels. Discharging one removes that labeled assumption from the derivation in
question; any others remain open.

We may use an assumption more than once; discharging its label discharges
all those uses in the relevant subderivation. This is called {{< term "multiple-discharge" "multiple discharge" >}}. For
example, assume $RAIN$ with label $h$. Use it twice in $∧ Intro$ to obtain
$RAIN ∧ RAIN$, then discharge $h$ to obtain $RAIN → (RAIN ∧ RAIN)$. Both
occurrences carry the same label, so neither remains open.

### Temporary assumptions

Let's look at an example: Assume that it rains. From this we infer that it's
rainy or windy. So, even without the assumption, we know that *if* it rains,
then it's rainy or windy:

{{< logic-app name="deduction" kind="worked" example="conditional" title="Discharging an assumption" >}}

What this establishes is that $RAIN → (RAIN ∨ WIND)$ can be derived without
any open assumptions:

$$
⊢ RAIN → (RAIN ∨ WIND)
$$

We didn't claim that it rains; we established what would follow *if* it did.
Every other open assumption used in deriving the consequent would remain open.

There's one more stumbling block. We can derive $RAIN → (WIND → RAIN)$:
assume $RAIN$, temporarily assume $WIND$, and repeat $RAIN$. Discharge $WIND$
and then $RAIN$. The assumption $WIND$ was never needed. This is called
{{< term "vacuous-discharge" "vacuous discharge" >}}. The next derivation shows the steps. The conclusion says that if it rains, it rains
regardless of whether it is windy.

{{< logic-app name="deduction" kind="worked" example="vacuous" title="Vacuous discharge" >}}

Next, we turn to the $∨ Elim$ rule. This rule is a formal form of _reasoning by cases_. Let's look at an example.

### Reasoning by cases

In $∨ Elim$, hypothetical reasoning is taken a step further. Suppose we know
$SUN ∨ RAIN$ and $¬SUN$. The disjunction gives two possible cases, so we think
both through. In the first case, assume $SUN$. Together with $¬SUN$ this gives
$⊥$. The rule $Ex falso$ allows us to infer $RAIN$ from $⊥$. In the second
case, assume $RAIN$. That already gives the conclusion we need.

{{< logic-app name="deduction" kind="worked" example="cases" title="Disjunctive syllogism by cases" >}}

Both cases lead to $RAIN$, so we conclude $RAIN$ and discharge both case
assumptions. The original $SUN ∨ RAIN$ and $¬SUN$ remain open. We have shown

$$
SUN ∨ RAIN, ¬SUN ⊢ RAIN.
$$

We cannot infer $SUN$ from the disjunction by choosing the first case and
ignoring the second. $∨ Elim$ requires the same conclusion in both cases.

In this example, we already used reasoning with negation, which deserves a little bit more thought.

### Negation and classical reasoning

The rule $Ex falso$ is a formal form of the
{{< term "explosion" "principle of explosion" >}}: from $⊥$, any formula follows. In Boolean logic, no valuation makes $⊥$ true. So there cannot be a
countermodel with a true premise $⊥$ and a false conclusion. This explains why
the rule is sound. Logics designed to reason with inconsistent information
may handle contradictions differently; we'll return to that later.

The rule $¬⊥$ allows us to derive $A$ when a temporary assumption $¬A$ leads
to $⊥$. In particular, we can derive $RAIN$ from $¬¬RAIN$. The following derivation shows this argument. This is the rule for {{< term "classical-logic" "classical reasoning" >}} in our
calculus. If we leave it out, we get
{{< term "intuitionistic-logic" "intuitionistic propositional logic" >}},
where that inference is not generally available. The other rules, including
explosion, remain available.

{{< logic-app name="deduction" kind="worked" example="classical" title="Double-negation elimination" >}}

This concludes our overview of the rules. A particularly pleasing aspect of the natural deduction calculus is that for each connective, we have introduction and elimination rules that tell us how to reason with formulas involving this connective. It turns out that the calculus we've just discussed is -- in a precise mathematical sense -- enough for _all_ reasoning in classical Boolean logic. Because we can show:

{{< callout type="theorem" title="Soundness and completeness" >}}
The natural deduction system displayed here, including $¬⊥$, is sound and
complete for classical propositional logic: $Γ ⊢ A$ iff $Γ ⊨ A$.
{{< /callout >}}

 The claim concerns _all_ formulas and _all_ collections of assumptions, so
 checking a few derivations would not establish it. We won't prove it here, but
 rest assured that this is a this is a
 {{< term "theorem" "mathematical theorem" >}} about the system.

### Finding a derivation

Making good, small-step inferences is hard work, even in natural language. And
there simply is no shortcut around trying your own hands at it. _But_ there are
some helpful tricks and strategies, determined by the shape of the conclusion,
which often gives us a good starting point. The idea is that we can work
backwards: treat the conclusion as a _goal_ and ask which rule could give us
that goal. On this way of thinking, the premises of such a rule then become _smaller_ goals. More specifically, if your conclusion is …

- … a conjunction, work on each conjunct separately and then use $∧ Intro$.
- … a conditional, temporarily assume its antecedent and work towards its
  consequent. Finish with $→ Intro$.
- … a negation, temporarily assume the unnegated formula and work towards
  $⊥$. Finish with $¬ Intro$.

But you can look at the premises, too. A conjunction gives you two formulas to
use. A conditional suggests looking for its antecedent. A disjunction may
require a case split. The heating example combines these directions: starting
from the goal $HEATING$, we look for $COLD$; starting from the premise $RAIN$,
we derive $RAIN ∨ WIND$ and then $COLD$.

In the case of the conditional idea of these strategies is, in essence, what we
implemented algorithmically in the {{< term "forward-chaining"
"forward-chaining" >}} and {{< term "backward-chaining" "backward-chaining" >}}
we explored in {{< chapter_ref chapter="conditionals"
id="conditional-reasoning" >}}Logical conditionals{{< /chapter_ref >}}.


The following examples combine these moves. Dashed formulas are goals, not yet
established conclusions. Each backward step proposes an inference; once its
premises have proofs, we can carry out that inference. In the first, start with
the disjunctive premise and handle each case separately. Within each case, the
goal is a conjunction, so there are two intermediate goals.

{{< logic-app name="deduction" kind="worked" deck="strategies" example="distribution-cases" title="Finding a derivation: worked-out strategies" >}}

“Cases and discharge” combines a case split with conditional introduction.
In its second case, we already have the consequent. We use vacuous
discharge to obtain the conditional, without using its antecedent.

In “An indirect proof”, the premise $¬(A ∧ B)$ gives us no
conjuncts to extract. We assume the negation of the goal and try to obtain
$A ∧ B$, which would contradict the premise. To get its two conjuncts, we
use the classical rule again. For each conjunct, we temporarily assume its negation. These additional
assumptions let us derive the contradictions needed to establish both conjuncts.

Try these moves below. Select proved formulas and click a rule to reason
forwards. For $∧ Intro$, their order determines the order of the conjuncts;
for $→ Elim$, either selection order works. The ×2 button selects a formula a second
time when a rule uses it twice. If a formula or a discharge choice is needed,
a panel on the canvas asks for the formula, or lets you select the assumptions
to discharge directly in the derivation. The app
checks each step and records its open assumptions. A derivation counts as a
solution only if its conclusion is the goal and its remaining assumptions are
among the given premises.

Turn on “Goals” to put the conclusion on the canvas as a goal. Select
a dashed formula and use the same rule buttons to work backwards. For
example, $∧ Intro$ replaces a conjunctive goal with its two conjuncts;
$→ Intro$ introduces a temporary assumption and makes the consequent the
new goal. “+ Goal” adds another goal. A matching derivation closes a goal
only when it uses assumptions available in that branch. “Hint” suggests
a next move for the selected goal.

If a derivation becomes too wide, use the fullscreen button or press F
while the canvas has focus. You can also fold a branch at its conclusion
and unfold it again when you need the details.

{{< logic-app name="deduction" kind="canvas" example="swap" title="Construct a natural deduction proof" >}}

The assumption rule adds a formula to the canvas. Clicking an empty
part of the canvas opens the same dialog. Select a formula and use its × to
delete that step and any steps depending on it.

A {{< term "lemma" "lemma" >}} is a proved result used in another proof.
“Save lemma” adds the selected derivation as a reusable rule: its open
assumptions become the rule's premises. Single capital letters such as $A$,
$B$, and $C$ are treated as {{< term "metavariable" "metavariables" >}} in
saved rules, so we can substitute formulas for them. The app matches these to
the selected premises when applying the rule. Names such as $RAIN$ and $SUN$
keep their literal meaning. “Save” downloads your work and saved rules;
“Load” restores them, and “Load lemmas” imports only the proved rules.

But keep in mind that these are strategies and not foolproof methods or
algorithms. Choosing the wrong disjunct, for example, can leave us with a goal
that doesn't follow from our premises. This is where one last tip comes in
hand: If your attempts keep getting stuck, try proof by contradiction: assume
the negation of the goal and try to derive $⊥$. We still need judgment about
which rules and intermediate formulas to try. Other calculi, including sequent
calculi, organize the search so that we can specify an algorithm more directly.

The natural deduction rules we use are known as _Gentzen–Prawitz-style_ proof
trees. Other presentations, such as [Fitch-style
proofs](https://en.wikipedia.org/wiki/Fitch_notation), arrange assumptions and
inferences in different ways. But, while the layout changes, we still  record
where each assumption is used and where it is discharged. It's just a matter of notation.

## Theorem provers

There are different ways in which computers can help us prove things. Our
natural deduction canvas, for example, checks the steps we select and gives
hints about which rules to try. It is a simple
{{< term "proof-assistant" "proof assistant" >}}. Other examples are
[Lean](https://lean-lang.org/), [Rocq](https://rocq-prover.org/), and
[Isabelle](https://isabelle.in.tum.de/). They let us guide the construction of
a proof, supply intermediate claims, and choose methods for proving them.
And they support much more mathematics than propositional logic.

But computers can also search for proofs themselves.
{{< term "automated-theorem-prover" "Automated theorem provers" >}} try to
construct a proof from a stated problem. We've already studied one approach
in {{< chapter_ref chapter="sat" id="resolution" >}}SAT solving{{< /chapter_ref >}}:
add the negation of the conclusion to the premises and search for a
refutation. SAT solving and resolution are central techniques in automated
reasoning. Systems such as [Vampire](https://vprover.github.io/) extend
refutation search to richer languages and more complex problems.

A proof assistant can call an automated prover to fill in steps, so we can
combine guided proof construction with automated search. In this chapter,
though, we'll focus on proof assistants. Their ability to check proofs is
particularly useful when we want to verify mathematical reasoning produced
by an LLM. Once the claim and proposed proof are expressed in the assistant's
formal language, it can check whether the proof establishes that conclusion
from the given assumptions.

{{< img src="/img/drawings/proof_jimmy_pi.svg" class="rounded float-end inert-img img-fluid m-2" width="200px" >}}

Proof assistants can also provide the environment in which a neural network
learns to construct proofs. For example,
[AlphaProof](https://research.google/pubs/olympiad-level-formal-mathematical-reasoning-with-reinforcement-learning/)
learned to find mathematical proofs in Lean through reinforcement learning.
Here the AI system proposes formal proof steps, and Lean checks them. The
results of these checks guide the search and provide feedback for learning.
So proof assistants can help both with verifying AI-generated reasoning and
with training systems to produce it.

We'll learn how Lean works using the propositional natural deduction
arguments we've just learned to construct. Lean checks each proposed proof
using its {{< term "kernel" "kernel" >}}, a small part of the prover that
implements its basic checking rules. The same kernel checks the short
proofs we'll write here and proofs with thousands of steps. In Lean, proof checking is a form of _type
checking_. To understand how that works, we first need to talk about types
and terms.

## Types and type checking

“Let $n$ be a natural number.” You've probably seen this instruction in math.
It tells us what kind of object $n$ is, and what we can do with it. We can add
another natural number to $n$, for example. Many programming languages record
such information with types: an integer or a string has a type that
determines how it can be used.

{{< callout type="definition" title="Types and terms" >}}
A {{< term "type" "type" >}} classifies terms and determines which
constructions and operations are permitted on them. The judgment $t : A$
says that the {{< term "typed-term" "term" >}} $t$ has type $A$.
{{< /callout >}}

We can write $n : ℕ$ for “$n$ is a natural number”. An expression such as
$n + 1$ is also a term of type $ℕ$. Adding two natural numbers gives us another
natural number; trying to add a natural number to a string would require
some further convention.

A {{< term "constructor" "constructor" >}} tells us how to build a term of a
type. For natural numbers, we can start with $0$ and repeatedly add $1$.
In Lean, a proposition $A$ can itself be used as a type. A term $a : A$
is then a {{< term "proof-term" "proof term" >}}: a formal representation of
a proof of $A$. So proving $A$ means constructing a term of type $A$.
Assuming $A$ means assuming that we have such a term, which we can name $a$
and use in further constructions. Any proof we construct using this
assumption still depends on it until we discharge it, just as in natural
deduction.

For proofs, the constructors follow the introduction rules we've just studied:

- Given a proof of $A$ and a proof of $B$, we can combine them into a proof
  of $A ∧ B$. The combined proof contains both parts, and we can extract
  either one with an elimination rule.
- Given a proof of $A$, we can construct a proof of $A ∨ B$, recording that
  we have proved the left disjunct. A proof of $B$ works in the same way on
  the right. To use such a proof, we must handle both possible cases.
- To construct a proof of $A → B$, we describe how to obtain a proof of $B$
  from an assumed proof of $A$. We temporarily assume such a proof and
  use other proof constructions to obtain a proof of $B$. This is the
  construction corresponding to $→ Intro$.
- For a proof of $¬A$, we likewise assume a proof of $A$, but aim for a
  contradiction. Lean writes $False$ for $⊥$ and treats $¬A$ as
  $A → False$. So negation uses the same construction as a conditional,
  with $False$ as the conclusion. There is no introduction rule for
  $False$ itself.

For example, to prove $RAIN → (RAIN ∧ RAIN)$, assume a proof of $RAIN$
and use it twice to construct the conjunction. To prove
$RAIN → (WIND → RAIN)$, assume proofs of $RAIN$ and $WIND$, then repeat
the proof of $RAIN$. The second assumption is unused, just as in our example
of vacuous discharge.

{{< callout type="definition" title="Type checking" >}}
{{< term "type-checking" "Type checking" >}} checks whether a term has a
specified type according to the rules of the type system.
{{< /callout >}}

To check a constructed proof of a conjunction, we check that its two parts
prove the required conjuncts. When we use a proof of $A → B$ to obtain
a proof of $B$, we check that the accompanying proof really has type $A$. These
checks follow the structure of the term, much like the recursive calculations
we've already used for formulas.

To verify a proof of $A$, then, Lean checks that the term we've constructed
has type $A$, using the types of any assumed proofs. This is how type checking
implements proof checking. Lean's type theory also covers quantifiers and
much more mathematics. Here we'll stay with propositional proofs.

## Lean {#proof-assistants-lean}

So, let's look at how Lean works. For this, we return to our heating argument.
Here's what that argument looks like written in Lean 4 (styled $L∃∀N$):

```lean
variable (RAIN WIND COLD HEATING : Prop)

example (rain : RAIN)
    (if_rain_or_wind_then_cold : RAIN ∨ WIND → COLD)
    (if_cold_then_heating : COLD → HEATING) : HEATING := by
  apply if_cold_then_heating
  apply if_rain_or_wind_then_cold
  apply Or.inl
  exact rain
```

In this code, `Prop` is Lean's type of propositions. So the first line
declares `RAIN`, `WIND`, `COLD`, and `HEATING` as propositional variables.
This gives us propositions to reason about; it doesn't yet assume any of
them to be true.

Next, the keyword `example` indicates that we're providing an example proof.
Later, we'll see `theorem`, which lets us give a proof a name. The declarations
in parentheses after `example` express our assumptions. For example,
`(rain : RAIN)` assumes a proof of the proposition `RAIN` and calls it `rain`.
Likewise, `if_rain_or_wind_then_cold` names an assumed proof of
$RAIN ∨ WIND → COLD$, and `if_cold_then_heating` names an assumed proof of
$COLD → HEATING$. These are our three premises. We can use their named proofs
to construct further proofs.

The colon `:` after the assumptions introduces our conclusion, `HEATING`.
So we need to construct a term of this type from the assumed proofs.
The sequence `:=` introduces the proof, and `by` indicates that we'll use
{{< term "tactic" "tactics" >}}: instructions for constructing it.

The proof follows the backwards approach we tried on the canvas. Lean starts
with the goal `HEATING`. With `apply if_cold_then_heating`, we tell it to use
our proof of $COLD → HEATING$. To obtain a proof of $HEATING$ this way, we
still need a proof of $COLD$. Lean therefore makes `COLD` the new goal.
This is $→ Elim$ used backwards to find the missing premise.

Next, `apply if_rain_or_wind_then_cold` uses our other conditional in the
same way. The goal becomes `RAIN ∨ WIND`. With `apply Or.inl`, we choose
$∨ Intro$ on the left: we'll prove the disjunction by proving `RAIN`.
That leaves just one goal, and we already have the assumed proof `rain`.
The command `exact rain` supplies it and closes the goal.

All the missing premises have now been supplied. Lean can assemble a proof
of $RAIN ∨ WIND$, then of $COLD$, and finally of $HEATING$. Each step uses
one of our natural deduction rules. The app below follows the goals through
these steps and shows where each command belongs in the derivation.

Try this in the Lean playground using the link below the code. Move the
cursor through the proof, line by line, and watch the _Infoview_ beside the
editor. It shows the assumptions available at the cursor's position and
the current goal after $⊢$. Follow how the goal changes as each tactic is
applied, until there are no goals left.

You can also follow these steps alongside the natural deduction derivation:

{{< logic-app name="deduction" kind="lean-walkthrough" code="previous" title="Following the Lean heating proof" >}}

The tactics construct a proof term, which Lean checks against the required
type, `HEATING`. We can also supply the term directly with `exact`:

```lean
variable (RAIN WIND COLD HEATING : Prop)

example (rain : RAIN)
    (if_rain_or_wind_then_cold : RAIN ∨ WIND → COLD)
    (if_cold_then_heating : COLD → HEATING) : HEATING := by
  exact if_cold_then_heating
    (if_rain_or_wind_then_cold (Or.inl rain))
```

Here $Or.inl rain$ is a proof of $RAIN ∨ WIND$. We pass it to the first
conditional to obtain a proof of $COLD$, then pass that proof to the second
conditional to obtain a proof of $HEATING$. A proof of $A → B$ can be applied
to a proof of $A$: this is $→ Elim$ expressed as a construction of proof terms.

Lean is a very powerful proof proof checker with an extensive library of
established proofs. The community maintained
[Mathlib](https://leanprover-community.github.io/) contains definitions and
proofs for a wide range of core mathematical results. For example, here's
mathlib's proof of [Euclid's
theorem](https://leanprover-community.github.io/mathlib4_docs/Mathlib/Data/Nat/Prime/Infinite.html#Nat.exists_infinite_primes):
there are infinitely many primes. Its formulation says that for any natural
number $n$, there is a prime $p$ with $n ≤ p$. The proof below is taken from
[mathlib's
source](https://github.com/leanprover-community/mathlib4/blob/master/Mathlib/Data/Nat/Prime/Infinite.lean),
with the theorem declaration changed to an $example$ so we can run it
separately:

```lean
import Mathlib.Data.Nat.Prime.Infinite

open Nat

-- From mathlib, Mathlib/Data/Nat/Prime/Infinite.lean (Apache 2.0).
-- Authors: Leonardo de Moura, Jeremy Avigad, Mario Carneiro.
example (n : ℕ) : ∃ p, n ≤ p ∧ Prime p :=
  let p := minFac (n ! + 1)
  have f1 : n ! + 1 ≠ 1 := ne_of_gt <| succ_lt_succ <| factorial_pos _
  have pp : Prime p := minFac_prime f1
  have np : n ≤ p :=
    le_of_not_ge fun h =>
      have h₁ : p ∣ n ! := dvd_factorial (minFac_pos _) h
      have h₂ : p ∣ 1 := (Nat.dvd_add_iff_right h₁).2 (minFac_dvd _)
      pp.not_dvd_one h₂
  ⟨p, np, pp⟩
```

Don't worry, you don't need to work through this proof now. The point is that
Lean can express and verify all sorts of mathematical reasoning. In the
following, we'll focus on basic propositional reasoning to understand the basic
workings of the software. So let's look at how we construct Lean proofs more generally.

### Finding a proof in Lean

We can approach a Lean proof just as we approached a natural deduction
derivation: start with the goal, look at its main connective, and ask which
rule could establish it. $intro$ lets us assume the antecedent of a conditional;
$apply And.intro$ replaces a conjunctive goal by its two conjuncts.

While working on a proof, we can write $sorry$ for a part we haven't found
yet. Lean accepts this placeholder with a warning. It does not establish
the claim: every $sorry$ must eventually be replaced by a proof. For example,
we can begin a proof of $A → (B → (A ∧ B))$ like this:

```lean
variable (A B : Prop)

example : A → (B → (A ∧ B)) := by
  intro a
  intro b
  apply And.intro
  · sorry
  · sorry
```

The first command, $intro a$, assumes a proof $a : A$ and leaves the goal
$B → (A ∧ B)$. The second assumes $b : B$, leaving $A ∧ B$.
Now $apply And.intro$ asks for the two proofs needed to construct this
conjunction: one of $A$ and one of $B$. The dots begin the separate subproofs.
We can work on either one while leaving the other as $sorry$. Here our
assumptions already supply both proofs: replace the first $sorry$ by
$exact a$ and the second by $exact b$. This completes the construction
under the two temporary assumptions and establishes the original conditional.

The other strategies carry over too. Use the components of a conjunctive
assumption, consider both cases of a disjunction, or look for a conditional
whose consequent is your goal. If direct attempts keep getting stuck, try
proof by contradiction. We'll see the Lean commands for these moves below.

### Introducing and using conjunctions

In natural deduction, we prove $A ∧ B$ by proving $A$ and $B$ and applying
$∧ Intro$. In Lean, $And.intro$ combines the two proofs in the same way.
We can supply them directly with $exact And.intro a b$, or work backwards
with $apply And.intro$ to make the two conjuncts our goals. To use a proof
of a conjunction, $And.left$ and $And.right$ extract its components, just
as the two $∧ Elim$ rules do. Capitalization matters!

```lean
variable (A B : Prop)

example (a : A) (b : B) : A ∧ B := by
  exact And.intro a b

example (h : A ∧ B) : B ∧ A := by
  apply And.intro
  · exact And.right h
  · exact And.left h
```

In the first example, $a$ and $b$ name the assumed proofs. The term
$And.intro a b$ combines them and has type $A ∧ B$, so $exact$ closes the goal.

In the second, $h$ names an assumed proof of $A ∧ B$, while our goal is
$B ∧ A$. After $apply And.intro$, the first goal is therefore $B$.
$And.right h$ extracts the proof of $B$ from $h$, and $exact$ supplies it.
The second goal is $A$, which we obtain with $And.left h$. The dots keep
these two subproofs separate.

### Conditionals and temporary assumptions

In natural deduction, $→ Intro$ lets us establish $A → B$ by deriving
$B$ under a temporary assumption $A$. In Lean, if our goal is $A → B$,
$intro a$ introduces the assumed proof $a : A$ and changes the goal to
$B$. Completing that proof establishes the conditional.

```lean
variable (A B : Prop)

example : A → A ∨ B := by
  intro a
  exact Or.inl a
```

Here the example begins without any assumed proofs. Its goal is the
conditional $A → (A ∨ B)$. With $intro a$, we temporarily assume a proof
$a : A$ and try to construct a proof of $A ∨ B$. The term $Or.inl a$
does exactly that, so $exact Or.inl a$ finishes the proof.

Compare this with $→ Intro$ in natural deduction: the assumption $A$ is
discharged when we establish the conditional. Likewise, $a : A$ is local
to this construction. The completed proof of $A → (A ∨ B)$ has no open
assumptions.

### Disjunctions and cases

In natural deduction, either $∨ Intro$ rule can establish a disjunction:
we choose which disjunct to prove. In Lean, $apply Or.inl$ changes the goal
$A ∨ B$ to $A$, while $apply Or.inr$ changes it to $B$. If we already have
a proof $a : A$, we can finish directly with $exact Or.inl a$.

When using an assumed disjunction, we don't get to choose which disjunct
is true. Natural deduction uses $∨ Elim$ to handle both cases. Analogously,
$apply Or.elim h$ in Lean asks us to prove the goal under each of the two
case assumptions:

```lean
variable (A B : Prop)

example (h : A ∨ B) : B ∨ A := by
  apply Or.elim h
  · intro a
    exact Or.inr a
  · intro b
    exact Or.inl b
```

Here $h$ is our assumed proof of $A ∨ B$. The command $apply Or.elim h$
asks us to establish two conditionals: $A → (B ∨ A)$ and $B → (B ∨ A)$.
In the first branch, $intro a$ assumes a proof of $A$. Since $A$ is the
right disjunct of our goal, $Or.inr a$ supplies a proof of $B ∨ A$.
In the second branch, $intro b$ assumes a proof of $B$, and $Or.inl b$
proves the same disjunction using its left disjunct.

Each temporary assumption belongs to its own branch. Once both branches
are complete, we have proved $B ∨ A$ from $h$ alone. Both must establish
the same conclusion: proving $A$ from the temporary assumption $A$ would
not entitle us to infer $A$ from $A ∨ B$!

### Negation in Lean

In natural deduction, $¬ Intro$ establishes $¬A$ by deriving $⊥$ under
a temporary assumption $A$. Lean treats $¬A$ as $A → False$, so $intro a$
changes a negated goal to $False$ and gives us the assumption $a : A$.
To use a negation, combine it with a proof of $A$ to obtain $False$,
just as in $¬ Elim$.

```lean
variable (A B : Prop)

example (h : A → B) : ¬B → ¬A := by
  intro not_b
  intro a
  exact not_b (h a)

example (a : A) (not_a : ¬A) : B := by
  exact False.elim (not_a a)
```

In the first example, $h$ names an assumed proof of $A → B$.
The command $intro not_b$ assumes a proof of $¬B$, leaving the goal $¬A$.
Since this means $A → False$, another $intro$ assumes $a : A$ and leaves
$False$ as the goal. Now $h a$ gives us a proof of $B$. Combining it with
$not_b$ gives us $False$: the term $not_b (h a)$ has exactly the type we
need. This completes the proof of $¬B → ¬A$ under the original assumption $h$.

The second example starts with assumed proofs $a : A$ and $not_a : ¬A$.
Together they give the term $not_a a$ of type $False$. The constructor
$False.elim$ lets us obtain a proof of our goal $B$ from this contradiction.
This is explosion. Lean accepting the proof shows that $B$ follows from
the inconsistent assumptions; it doesn't show that those assumptions are true.

For double-negation elimination, we need the classical rule. In Lean,
we can use $Classical.byContradiction$:

```lean
variable (A : Prop)

example (h : ¬¬A) : A := by
  apply Classical.byContradiction
  intro not_a
  exact h not_a
```

Our goal is $A$, and $h$ is an assumed proof of $¬¬A$.
$apply Classical.byContradiction$ asks us to prove $False$ under the
additional assumption $¬A$. The command $intro not_a$ introduces that
assumed proof. Since $h$ proves the negation of $¬A$, combining it with
$not_a$ gives $False$. Thus $exact h not_a$ completes the contradiction,
and the classical rule establishes $A$.

This corresponds to the classical rule $¬⊥$ in our natural deduction calculus.
$open Classical$ merely lets us write names such as $byContradiction$ without
the prefix. It doesn't itself prove anything or add a new inference step.
The tactic $classical$ makes classical decidability available when a tactic
needs it; many of our proofs don't need it.

### Proof checking {#what-has-lean-verified}

Lean's kernel performs {{< term "proof-checking" "proof checking" >}} by
checking that the proof term has the stated proposition as its type. Our
tactics tell Lean how to construct that term. To finish a proof, we must
replace every $sorry$ with a proof of the corresponding goal.

We also need to check that the assumptions and conclusion express the
inference we intended. In the heating example, $HEATING$ must follow from
the three given premises. If we accidentally include $heating : HEATING$
among the assumptions, Lean will accept $exact heating$ as a proof.
That proof correctly derives $HEATING$ from itself. We still have to check
that we've asked Lean to prove the right claim.

## Curry–Howard {#concrete-curryhoward-correspondence}

We've now seen how Lean's tactics let us construct proofs using the same
steps as natural deduction. Introducing a conjunction combines two proofs;
introducing a conditional lets us work under a temporary assumption. Lean
records these constructions as terms, with the propositions they prove as
their types. We can also read such a term as a proof and its type as the
proposition proved.

This connection is called the
{{< term "curry-howard" "Curry–Howard correspondence" >}}
([Wikipedia](https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence)).
It connects logic with typed programming: propositions correspond to types,
and proofs correspond to programs of those types. A type tells us what a
program must produce. Read as a proposition, it tells us what the
corresponding proof must establish. In this sense, proofs and programs are
two sides of the same coin.

Take our proof of $A → (A ∧ A)$. We assume a proof of $A$ and use it twice
to construct a proof of $A ∧ A$. Viewed as a program, the same construction
takes an input of type $A$ and pairs it with itself. Viewed as a proof, it
establishes the conditional. The type records the construction in either
reading.

This is the foundation of theorem proving in Lean: constructing a proof
means constructing a term of the required type, and checking the proof
means checking that the term has that type. In computer science, the
correspondence guides the design of typed programming languages and methods
for verifying programs. In AI, it also lets us treat the search for a formal
proof as the task of generating a program whose type the prover can check.

For the propositional rules we've studied, the correspondence looks like this:

| Natural deduction | Proof construction | Lean command |
| --- | --- | --- |
| Infer $A ∧ B$ from $A$ and $B$. | Combine a proof of $A$ with a proof of $B$. | $exact And.intro a b$ |
| Infer either conjunct from $A ∧ B$. | Extract the proof of the chosen conjunct. | $exact And.left h$, $exact And.right h$ |
| Infer $A ∨ B$ from either $A$ or $B$. | Construct a proof of the disjunction from a proof of the chosen disjunct. | $exact Or.inl a$, $exact Or.inr b$ |
| Infer $C$ from $A ∨ B$ and derivations of $C$ under each case assumption, discharging those assumptions. | Prove the same conclusion in both cases. | $apply Or.elim h$, then prove both cases. |
| Infer $A → B$ from a derivation of $B$ under assumption $A$, discharging that assumption. | Assume a proof of $A$ and construct a proof of $B$. | $intro a$, then prove $B$. |
| Infer $B$ from $A → B$ and $A$. | Combine a proof of the conditional with a proof of its antecedent. | $exact f a$ |

Here $A$, $B$, and $C$ are formulas. In the Lean commands, $a$ and $b$
name proofs of $A$ and $B$, $h$ names a proof of the relevant conjunction
or disjunction, and $f$ names a proof of $A → B$. The commands construct
proof terms, which Lean checks against the stated proposition. We don't
need to write those terms out ourselves: $intro a$, for example, lets us
work under an assumed proof $a : A$, just as we worked under a temporary
assumption in natural deduction.

Negation fits too: $¬A$ is $A → False$. To prove $¬A$, we derive falsity under an assumed proof of $A$. Since there is no constructor of $False$, a closed
proof of it cannot be built from the intuitionistic rules. The classical
rule uses an additional principle, $Classical.byContradiction$; it is not
supplied by the conditional, conjunction, and disjunction constructions alone.

Use the app to translate a derivation into Lean, or edit the Lean proof and
translate it back. Both directions use the same natural deduction steps.
Try “Temporary assumption” first: $intro$ opens an assumption, and completing
the proof of the consequent discharges it. Then try “Two cases”. Each branch
has its own assumption, and both branches prove $RAIN$.

{{< logic-app name="deduction" kind="lean" example="conditional" title="Natural deduction and Lean" >}}

The translator accepts one $example$, propositional variables, named
assumptions, and the commands $intro$, $apply$, and $exact$. It accepts the
proof constructors used above, including nested applications. When
importing Lean, it rejects unfinished proofs and commands
outside this small language. It runs our natural deduction checker in the
browser; to have Lean's kernel check the generated code, paste it into the
[Lean playground](https://live.lean-lang.org/). The Euclid example uses
more of Lean and is outside the translator's scope.

When exporting a derivation with open goals, the app writes $sorry$ for
each missing proof. Lean accepts this as a placeholder and issues a warning.
It lets us work on one part of a proof while leaving another for later, but
a proof containing $sorry$ does not establish the theorem. Every placeholder
needs to be replaced by a proof. The reverse translator accepts completed
proofs in the supported fragment; it won't turn $sorry$ into a proved node.

Whether we construct the argument ourselves or ask an AI agent to do so, we
can submit the resulting proof term to Lean. Its type states the claim; the
kernel checks that the term proves it from the stated assumptions.

## Automated theorem proving in Lean

So far, we've told Lean which proof steps to take. But we've already
studied algorithms for finding proofs, too. Our resolution algorithm,
for example, searches for a refutation using the premises and the negation
of the conclusion. We can use automated methods in Lean as well.

One of Lean's tactics for automated reasoning is $grind$. In the heating
example, we can replace all our proof steps with this one command:

```lean
variable (RAIN WIND COLD HEATING : Prop)

example (rain : RAIN)
    (if_rain_or_wind_then_cold : RAIN ∨ WIND → COLD)
    (if_cold_then_heating : COLD → HEATING) : HEATING := by
  grind
```

We can do the same with the indirect proof we worked through earlier:

```lean
variable (A B : Prop)

example (h : ¬(A ∧ B)) : ¬A ∨ ¬B := by
  grind
```

$grind$ assumes the negation of the conclusion and searches for a
contradiction. In the heating example, it adds $¬HEATING$ to our three
premises. We can see why this leads to a contradiction: from $RAIN$ we
can infer $RAIN ∨ WIND$, then $COLD$, and finally $HEATING$. This
contradicts the added assumption $¬HEATING$.

The approach is familiar from
{{< chapter_ref chapter="sat" id="resolution" >}}SAT solving{{< /chapter_ref >}},
though $grind$ combines several methods. It draws consequences from the
available facts, splits the search into cases, and uses procedures for
equality and arithmetic. The
[Lean reference](https://lean-lang.org/doc/reference/latest/The--grind--tactic/)
describes these methods in detail. When $grind$ succeeds, it supplies a
proof term for the goal. Lean's kernel checks that term in the same way
as one constructed with our individual tactics.

$grind$ won't finish every proof for us. Its search can run out of
resources, and we may need to prove an intermediate claim before it can
proceed. Lean also has tactics for more specialized problems: $bv_decide$,
for example, uses an external SAT solver for Boolean and bit-vector
problems and checks the certificate it returns. We won't study these
further methods here, but they give us another way to use the SAT-solving
techniques from the earlier chapters.

## Further readings {.readings .nocount}

- Richard Zach, [*Sets, Logic, Computation* (PDF)](https://slc.openlogicproject.org/slc-screen.pdf), chapter 11, especially §§11.1–11.5, for natural deduction and worked-out derivations.
- Jeremy Avigad, Leonardo de Moura, Soonho Kong, and Sebastian Ullrich, [*Theorem Proving in Lean 4*](https://docs.lean-lang.org/theorem_proving_in_lean4/), chapters 2–5, for dependent type theory, propositions as types, and tactic proofs.
