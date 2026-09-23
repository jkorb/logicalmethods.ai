---
title: Valid Inference
author: Colin Caret and Johannes Korbmacher
locked: false
weight: 30
params:
  last_edited: "16/09/2026"
  id: txt-val
---

# Valid inference

Inference is everywhere in AI. We've seen how deductive inference occurs on the
level of circuits using Shannon's interpretation, we've mentioned that large
language models (LLMs) use a form of inductive inference to predict pieces of
text, and, of course, any [artificial general intelligence
(AGI)](https://en.wikipedia.org/wiki/Artificial_General_Intelligence) would
need to be able to perform valid inferences, like our first example:

{{< inference layout="stacked">}}
$All humans are mortal$
$Socrates is human$
---
$Socrates is mortal$
{{< /inference >}}

So what precisely makes an inference valid? What distinguishes good from bad
inferences, both in deductive and inductive reasoning?—In this chapter, we'll
develop the logical theory of valid inference.

{{< callout type="objectives" >}}
After studying this chapter, you will be able to:

- Explain what makes an inference valid, and distinguish validity from the
  truth of its premises and conclusion;
- Distinguish deductive from inductive reasoning, and logical from material
  validity;
- Assess simple inferences using valid reasoning patterns, fallacies, and
  counterexamples;
- Explain how models help us represent reasoning situations and give a precise
  account of valid inference;
- Explain how probability can be used to study inductive support, and how
  assumptions about a situation affect that support.
{{< /callout >}}

## Correctness

When we talk about validity, we are talking about a _good feature_ of
inferences, but this is not the only good feature an inference can have. For
example, it is good for inferences to be simple, clear, precise, economical,
etc. Logic does not deal with all of these topics. Most of these topics are
part of **rhetoric**, the study of persuasive writing style. Logic deals with
_validity_.

Validity is a standard of **correctness** for inferences. To really fix this
concept, it might help to think about it from the other direction. What happens
if an inference _lacks_ validity, when it is **invalid**? Well, that shows us
that something went wrong. The inference made a _mistake_. Some of these
logical mistakes or {{< term "fallacy" "fallacies" >}} are so famous that they
have their own names.

Here is an example of a fallacy called {{< term "affirming-the-consequent" "affirming the consequent" >}}:

<div class="d-flex flex-wrap align-items-center justify-content-center gap-3">
{{< inference layout="stacked" >}}
$If it is sunny, then ∀I is cycling$
$∀I is cycling$
---
$It is sunny$
{{< /inference >}}
{{< img src="/img/drawings/ai_biking_rain.svg" class="rounded float-start inert-img img-fluid mx-4 my-1" width="150px">}}
</div>

The mistake should be clear. The conditional premise says that sun leads to
sport. However, the other premise of this inference is not _about_ sunny
weather, so those two premises don't really "add up" to anything useful. They
do not guarantee that it is sunny: ∀I could also cycle in the rain. Whether
cycling provides inductive evidence of sun is a separate question.

Contrast this with the following valid inference:

<div class="d-flex flex-wrap align-items-center justify-content-center gap-3">
{{< img src="/img/drawings/ai_bikin_sun.svg" class="rounded float-start inert-img img-fluid mx-4 my-1" width="150px">}}
{{< inference layout="stacked" >}}
$If it is sunny, then ∀I is cycling$
$It is sunny$
---
$∀I is cycling$
{{< /inference >}}
</div>

This inference involves a premise about sunny weather, which connects with the
conditional premise in the right way. This inference is valid because its
premises cannot both be true while its conclusion is false. These two examples
show that it can be easy to confuse valid and invalid inferences if we don't
pay attention to the details. At a glance, the two inferences look pretty
similar.

This is why logic aims for a _systematic_ definition of validity. This notion
should be applicable not only to humans but to any information-processing
system. It can tell us what counts as _intelligent_ behavior. Without a
definition of correct reasoning, how do we even know what we want AI to achieve?

So, we would like to say, in general, what _makes_ an inference valid or
invalid. The standard idea is that valid inferences **preserve truth** from
their premises to their conclusion.

## Hypothetically

To test whether an inference is valid, we ask if the conclusion is true _when_
the premises are true. This is a **hypothetical** question. Answering this
question does not require us to know that the premises really _are_ true. In
fact, we can make a stronger point: it is possible to have an inference that is
valid even though it has false premises. Here is an example.

<div class="d-flex flex-wrap align-items-center justify-content-center gap-3">
{{< inference layout="stacked" >}}
$All cats can fly$
$∃I is a cat$
---
$∃I can fly$
{{< /inference >}}
{{< img src="/img/drawings/val_flying_cat.svg" class="rounded float-start inert-img img-fluid mx-4 my-1" width="150px">}}
</div>

The _reasoning_ behind this inference is perfectly correct. The conclusion
follows from the premises. That makes the inference valid. But we obviously know
that this inference also involves some false premises. Cats can't really fly.

{{< callout type="definition" title="Sound argument" >}}
A {{< term "sound-argument" "sound argument" >}} is a deductively valid argument
whose premises are actually true. Its conclusion must therefore be true.
{{< /callout >}}

The important point is that validity is not determined by the actual truth or
falsity of statements. What we care about is the _connections between_
statements.

When we test for validity, we do not look at the actual truth of premises and
conclusion, instead we look for a **relationship** between their truth-values.
You can think about it like this: imagine that the premises are true and think
about whether the conclusion is true _under this assumption_.

Think about the inference this way. When we do this, we imagine a world that is
slightly different from the actual world, a world where cats do fly. In that
kind of world, it has to be true that ∃I flies.

This is the basic idea of truth-preservation:

{{< callout type="definition" title="Validity (truth preservation)" >}}
  An inference is deductively valid {{< term "iff" "iff" >}} the
  conclusion is true under the (hypothetical) assumption that all the premises
  are true.
{{</callout>}}

Now, we can ask a series of follow-up questions. How tight is the
truth-preservation relationship? How often does it have to hold? How reliable
does an inference need to be in order to call it "valid"? Different answers to
these questions take us in two directions: deductive and inductive logic.

## _Formally_ -- Logical validity

Take our first example again:

{{< inference layout="stacked">}}
$All humans are mortal$
$Socrates is human$
---
$Socrates is mortal$
{{< /inference >}}

This is, of course, a valid inference: under the assumption that the premises
are true, so is the conclusion. But note that for this, it doesn't matter that
we're talking about Socrates or mortality. If we change the term $ Socrates$
to, say, $Alan Turing$, and we change the predicates $human$ and $mortal$ to,
say, $mathematician$ and $smart$, we'd get the following inference, which is
also valid:

{{< inference layout="stacked">}}
$All mathematicians are smart$
$Alan Turing is a mathematician$
---
$Alan Turing is smart$
{{< /inference >}}

Also our example from above about ∃I being able to fly is the result of
changing $Socrates$ to ∃I, $human$ to $cat$, and $mortal$ to $can fly$. In
fact, for _every_ way of replacing terms and predicates like this, the
inference remains valid.

In logical theory, we say that the argument is valid _in virtue of its logical
form_. We can express the shared {{< term "logical-form" "logical form" >}} of the inferences in question
as follows:
{{< inference layout="stacked" >}}
$All As are B$
$c is A$
---
$c is B$
{{< /inference >}}
Here, the $A$ and $B$ are placeholders for arbitrary predicates, and the
lower-case $c$ is an arbitrary term. The idea is that whichever expressions we
put in for $A,B$ and $c$, as long as they're of the right grammatical category,
we'll get a valid inference. By representing the logical form of our inference
in this way, we're _abstracting away_ from the logically irrelevant predicates
and terms and obtain an abstract representation of the logical form.

So far, we've discussed the idea of logical form in natural language. But as
we've discussed in the previous chapter, for the purposes of AI research, we
need to work in _formal_ languages. We haven't encountered a formal language
yet that is expressive enough to represent our inference about Socrates, but we
can illustrate the point with relation to MP, which is the following inference
schema, introduced in the previous chapter:

{{< inference layout="stacked" >}}
$If A, then B$
$A$
---
$B$
{{< /inference >}}

In the language of propositional logic, we can express this logical form more
precisely using the logical operators we've introduced in the previous chapter.
Remember that $→$ represents the natural language "if …, then …". In formal
languages, we let letters like $A,B$ represent
arbitrary formulas, like in the schema we wrote before. So, in purely formal
terms, we can write the inference as:

{{< inference layout="stacked" >}}
$(A → B)$
$A$
---
$B$
{{< /inference >}}

To be able to write this in one line, we also use the symbol $∴$ (read
"therefore") in place of the inference line like so: $A, (A → B) ∴ B$.

To express the logical claim that MP is valid we use the logical symbol $⊨$,
which is called the "double turnstile" or "models" (for reasons we'll get into
later). So, we write the validity of MP in purely formal notation as $A, (A →
B) ⊨ B$.

By the way, it's important to distinguish between the inference $A, (A → B) ∴
B$ and its validity $A, (A → B) ⊨ B$: there are logical systems where MP is
_not_ valid. In those contexts, an AI system might still—fallaciously—reason
according to MP, i.e. it might apply $A, (A → B) ∴ B$ even though, in this
context, $A, (A → B) ⊭ B$.

Validity in virtue of logical form, as just discussed, is known as {{< term "consequence" "logical consequence" >}}. But, importantly, not *all* valid inferences are logically
valid—valid in virtue of their logical form. Consider the following inference,
for example:

{{< inference layout="stacked" >}}
$Σ is the brother of ∀I's mother$
---
$Σ is ∀I's uncle$
{{< /inference >}}

Following the truth-preservation criterion, this inference is certainly valid.
Under the assumption that $Σ is the brother of ∀I's mother$ it's true that $Σ
is ∀I's uncle$ using “uncle” here in the sense of a parent's male sibling.

But if we replace $brother$ with $sister$, for example, we get the following *in*valid inference:
{{< inference layout="stacked" >}}
$Σ is the sister of ∀I's mother$
---
$Σ is ∀I's uncle$
{{< /inference >}}
If we assume that $Σ$ is $∀I$'s mother's
sister, $Σ$ is $∀I$'s aunt and not their
uncle. This shows that the inference is not valid in virtue of its form, which
is something like:
{{< inference layout="stacked" >}}
$c is the R of d's e$
---
$c is the S of d$
{{< /inference >}}
But the inference _is_ valid … in a sense. The validity of the inference
depends on the concrete predicates involved—the meanings of $brother$,
$mother$, and $uncle$. In logical theory, we also call inferences like this,
which are valid, but not in virtue of their logical form, **materially valid**.
While logical validity—validity in virtue of logical form—is
**domain-general**, material validity is **domain-specific**. As we've seen,
for the validity of our inference about Socrates it doesn't matter that we're
talking about Socrates, being human, or being mortal, but for the validity of
our inference about $∀I$'s uncle, it does matter that we're talking about his
mother's brother and not sister.

{{< callout type="definition" title="Logical and material validity" >}}
An inference is {{< term "logical-validity" "logically valid" >}} when its
truth preservation depends on logical form, with the logical vocabulary fixed.
An inference is {{< term "material-validity" "materially valid" >}} when its
correctness depends on domain-specific meanings, facts, or assumptions.
{{< /callout >}}

Mathematical reasoning is a prime example of material deduction. From
$n is divisible by 4$ we infer $n is even$ because of what these mathematical
concepts mean. Replacing “divisible by 4” with “greater than 4” destroys the
guarantee. Mathematical proofs combine such domain-specific definitions and
axioms with logically valid steps.

This distinction also matters for AI. Evidence suggests that LLMs often reason
more successfully when familiar content supports the answer than when a task
requires following form through unfamiliar or unbelievable premises. Familiar
mathematical or everyday content can help a model reach the right answer, but
success there need not transfer to reasoning from logical form alone.

There is a close connection between logical and material validity. Some
logicians, like [Rudolf Carnap](https://de.wikipedia.org/wiki/Rudolf_Carnap),
have suggested that we can *reduce* material validity to a special case of
logical validity under additional assumptions, so-called "meaning postulates".
His idea is based on the observation that the material validity of the
inference about $∀I$'s uncle can be expressed in the *logical* validity of the
following inference:

{{< inference layout="stacked" >}}
$Σ is the brother of ∀I's mother$
$The brother of a person's mother is their uncle$
---
$Σ is ∀I's uncle$
{{< /inference >}}

Here the statement $the brother of a person's mother is their uncle$ is a
{{< term "meaning-postulate" "meaning postulate" >}}, which captures (part of) the meaning of the term $uncle$.
While the original inference depends on the meaning of $uncle$, the expanded
inference makes that connection explicit as an additional premise. Once we add
the meaning postulate, the conclusion follows by logical form: anyone who is
the brother of someone's mother is their uncle; $Σ$ is the brother of $∀I$'s
mother; so $Σ$ is $∀I$'s uncle. We can thus study this materially valid
inference as a logically valid inference with an extra premise. The meaning
postulate supplies the connection between the terms; logic tells us what
follows from it.

## _Always_ -- Deductive validity

We've previously defined a deductively valid inference to be one where the
premises _necessitate_ the conclusion. We can think of this as stipulating that
truth-preservation _always_ holds. In deductive inferences, we want 100%
reliability in all situations whatsoever. No exceptions allowed. _Necessarily_,
in any situation where the premises are true, the conclusion is true as well.
Otherwise, if there's a situation where the premises are true and the
conclusion isn't, the inference is deductively *in*valid. This is a high
standard we are asking for but it is very useful when we can identify this kind
of air-tight reasoning.

{{< img src="/img/drawings/val_ai_asteroid.svg" class="rounded  float-start inert-img img-fluid mx-3" width="200px">}}
Deductive reasoning is characteristic of **mathematical inference**, which we
encounter not only in pure math, but also in applications of mathematics in
physics and the natural sciences. When we make predictions, for example, about
the trajectory of an asteroid heading towards earth, this involves a lot of
deductive, mathematical reasoning. We start with some empirical observations
and apply physical laws, but the actual calculation is deductive. That means
that, assuming the calculations are carried out correctly, the result is as
certain as the observation: the only reason why the prediction could be wrong
is that the assumptions—the laws or observations—are wrong.

Within a fixed semantics, deductive consequence is {{< term "indefeasible" "indefeasible" >}}:
adding premises cannot create a countermodel to an already valid inference.
This supports **belief accumulation**. We can still discover that a premise
was false, or revise the model assumptions; validity alone does not protect
our starting beliefs from correction.

The optimal way of using deduction is to take a set of existing beliefs (or
knowledge) and then add more beliefs (or knowledge) by applying logical rules.
A common, real world _implementation_ of deductive reasoning occurs whenever we
apply some general pattern to a specific case. For example,
[vixens](https://en.wikipedia.org/wiki/Fox) are female foxes. That is the
definition of the concept _vixen_. Suppose you know this and you hear someone
say "there is a vixen living in the forest!". In that case, you might use
deduction to infer that there is a fox living in the forest.—This kind of
deductive inference should be carried out by any reasoning AI system, such as
expert systems, but also reasoning LLMs, used for mathematical problem solving.

Moreover, many **programming languages** are essentially formal languages with
deductive rules. This is a perfect way to apply logical methods. Consider the
code snippet below. This simple Python snippet is supposed to take an input
that is a whole number and identify whether it is a positive number or not:

```python
num = int(input('Enter a whole number: '))
if num > 0:
    print(f'{num} is positive.')
else:
    print(f'{num} is not positive.')
```

This example assumes the input can be converted to an integer. The output
reports whether it is positive, and the program then terminates.

Imagine what would happen if the computer did, effectively, not obey deductive
rules like "modus ponens". We would have no idea what to expect when we run this
program. Sometimes when you ran the program and entered the number 1, you might
get the correct answer that 1 is a positive number, but other times you might get no answer at all. That would be useless and frustrating. In order to
make the behavior of programs predictable, we want them to effectively follow
deductive rules of reasoning.

We've already encountered some examples of deductively valid inferences, like
the one concerning Socrates' mortality. Here are some further examples of
{{< term "inference-schema" "inference schemas" >}}. In classical propositional
logic, these include {{< term "modus-ponens" "modus ponens" >}},
{{< term "modus-tollens" "modus tollens" >}}, and
{{< term "disjunctive-syllogism" "disjunctive syllogism" >}}:

{{< inference-rules caption="Valid rules in classical propositional logic" >}}
[
  {
    "name": "Modus ponens (MP)",
    "premises": [
      "$(A → B)$",
      "$A$"
    ],
    "conclusion": "$B$",
    "explanation": "If A implies B and A is true, B must be true."
  },
  {
    "name": "Modus tollens (MT)",
    "premises": [
      "$(A → B)$",
      "$¬B$"
    ],
    "conclusion": "$¬A$",
    "explanation": "If B is false, A cannot be true while the conditional remains true."
  },
  {
    "name": "Disjunctive syllogism (DS)",
    "premises": [
      "$(A ∨ B)$",
      "$¬A$"
    ],
    "conclusion": "$B$",
    "explanation": "At least one disjunct is true. With A false, B must be true."
  }
]
{{< /inference-rules >}}

Similarly, we've seen some inference patterns that may seem deductively valid,
but are invalid in classical propositional logic. Alongside affirming the
consequent, these include {{< term "denying-the-antecedent" "denying the antecedent" >}}
and {{< term "affirming-a-disjunct" "affirming a disjunct" >}}:

{{< inference-rules caption="Fallacies in classical propositional logic" >}}
[
  {
    "name": "Affirming the consequent",
    "premises": [
      "$(A → B)$",
      "$B$"
    ],
    "conclusion": "$A$",
    "explanation": "Counterexample: A false, B true."
  },
  {
    "name": "Denying the antecedent",
    "premises": [
      "$(A → B)$",
      "$¬A$"
    ],
    "conclusion": "$¬B$",
    "explanation": "Counterexample: A false, B true."
  },
  {
    "name": "Affirming a disjunct",
    "premises": [
      "$(A ∨ B)$",
      "$A$"
    ],
    "conclusion": "$¬B$",
    "explanation": "Counterexample: A and B both true. Here ∨ is inclusive: both may hold."
  }
]
{{< /inference-rules >}}

{{< img src="/img/drawings/val_there_is_wants.svg" class="rounded  float-end inert-img img-fluid mx-3" width="200px">}}
One of the central aims of deductive logic is to provide a **theory of
deductively valid inference** which can account for the apparent deductive
validity and invalidity of the above inference schemas.

The standard approach to developing such an account is the **semantic
approach**.

<div class="clearfix"></div>

{{< callout type="definition" title="Semantic model" >}}
A {{< term "model" "semantic model" >}} is a mathematical representation of a
possible reasoning scenario, with rules determining which formulas are true in it.
{{< /callout >}}

A model is like a picture of a possible reasoning scenario. Think for example
of the scenario we considered above, where all cats—and thus $∃I$—could fly. If
we look at a model, we can ask whether a specific sentence $A$ is true or not
in that model. Every model gives an answer. It assigns a definite truth-value
to each sentence. If we take the sentence $∃I can fly$ and consider the
scenario, where cats can fly, we get the answer that the sentence is _true_.
But if we evaluate the sentence relative to the way things actually are, the
answer is that it's not _true_.

In logical theory, semantic models are defined relative to a formal language
and the concrete definition of a model depends on the specifics of the language
under consideration. In fact, as we'll see a lot of work goes into defining the
notion of a model with mathematical precision. So, we'll have to postpone this
to later lessons. But what we _can_ talk about is the general pattern that all
semantic definitions of deductively valid inference follow.

{{< callout type="note" title="Modeling assumptions: our semantic starting point" >}}
For now, assume that a language $L$ has a specified collection of models and
that each formula is either true or false in each model. We have not yet
constructed these models. Later chapters supply concrete semantics, including
alternatives to this classical two-valued starting point. Restricting the
models to those satisfying domain assumptions makes consequence relative to
those assumptions.
{{< /callout >}}

{{< callout type="definition" title="Logical space and propositions" >}}
The {{< term "logical-space" "logical space" >}} is the collection of models
under consideration. The {{< term "proposition" "proposition" >}} expressed by
$A$ is its set of models:

$$[A] = { M : M is a model in which A is true }.$$
{{< /callout >}}

For several premises, we need the models where **all** premises are true
together. Two set-theoretic ideas let us say this precisely.

{{< callout type="definition" title="Subset" >}}
$S$ is a {{< term "subset" "subset" >}} of $T$, written $S ⊆ T$, {{< term "iff" "iff" >}} every
member of $S$ is a member of $T$. We write $S ⊈ T$ if some member of $S$ does
not belong to $T$. Equality is allowed: every set is a subset of itself.
{{< /callout >}}

Recall the distinction between an element and a set containing that element.
The following set has three elements, one of which is itself a set:

{{< set expression=true alt="The set containing Little Jimmy, the set containing 1 and a beer, and Mr. Sir." >}}
[{"set": [{"image": "gimmick_little_jimmy"}, {"set": ["1", {"image": "gimmick_beer"}]}, {"image": "gimmick_mr_sir"}]}]
{{< /set >}}

Both members of the set on the left also belong to the set on the right:

{{< set expression=true alt="The set containing Little Jimmy and Mr. Sir is a subset of the set containing Little Jimmy, the set containing 1 and a beer, and Mr. Sir." >}}
[{"set": [{"image": "gimmick_little_jimmy"}, {"image": "gimmick_mr_sir"}]}, {"op": "⊆"}, {"set": [{"image": "gimmick_little_jimmy"}, {"set": ["1", {"image": "gimmick_beer"}]}, {"image": "gimmick_mr_sir"}]}]
{{< /set >}}

But replacing {{< set expression=true inline=true alt="Little Jimmy" >}}[{"image":"gimmick_little_jimmy"}]{{< /set >}} with
{{< set expression=true inline=true alt="the beer" >}}[{"image":"gimmick_beer"}]{{< /set >}} breaks the subset relation:

{{< set expression=true alt="The set containing Mr. Sir and a beer is not a subset of the larger set." >}}
[{"set": [{"image": "gimmick_mr_sir"}, {"image": "gimmick_beer"}]}, {"op": "⊈"}, {"set": [{"image": "gimmick_little_jimmy"}, {"set": ["1", {"image": "gimmick_beer"}]}, {"image": "gimmick_mr_sir"}]}]
{{< /set >}}

{{< set expression=true inline=true alt="The beer" >}}[{"image":"gimmick_beer"}]{{< /set >}} is not itself an element of the larger set:

{{< set expression=true alt="The beer is not an element of the larger set." >}}
[{"image": "gimmick_beer"}, {"op": "∉"}, {"set": [{"image": "gimmick_little_jimmy"}, {"set": ["1", {"image": "gimmick_beer"}]}, {"image": "gimmick_mr_sir"}]}]
{{< /set >}}

The **set containing** the number 1 and the beer is an element:

{{< set expression=true alt="The set containing 1 and the beer is an element of the larger set." >}}
[{"set": ["1", {"image": "gimmick_beer"}]}, {"op": "∈"}, {"set": [{"image": "gimmick_little_jimmy"}, {"set": ["1", {"image": "gimmick_beer"}]}, {"image": "gimmick_mr_sir"}]}]
{{< /set >}}

Membership does not pass through nested braces. The picture
{{< set expression=true inline=true alt="a beer" >}}
[{"image": "gimmick_beer"}]
{{< /set >}} names an object; putting braces around objects names a set.

We can also picture the subset relation by drawing one set inside another.
Explore the diagram and its explanations to see why every member of $S$
also belongs to $T$.

{{< set-diagram scene="subset" >}}

{{< callout type="definition" title="Intersection" >}}
The {{< term "intersection" "intersection" >}} $S ∩ T$ contains exactly the
elements belonging to both sets:

$$S ∩ T = { a : a ∈ S and a ∈ T }.$$
{{< /callout >}}

For example, the following two sets have just
{{< set expression=true inline=true alt="Little Jimmy" >}}[{"image":"gimmick_little_jimmy"}]{{< /set >}} in common:

{{< set expression=true alt="The intersection of the set containing Little Jimmy and Mr. Sir with the set containing Little Jimmy and 1 is the set containing Little Jimmy." >}}
[{"set": [{"image": "gimmick_little_jimmy"}, {"image": "gimmick_mr_sir"}]}, {"op": "∩"}, {"set": [{"image": "gimmick_little_jimmy"}, "1"]}, {"op": "="}, {"set": [{"image": "gimmick_little_jimmy"}]}]
{{< /set >}}

In a diagram, the intersection is where the two sets overlap. Explore the
sets below to see what they have in common, and why having a common member
does not make one set a subset of the other.

{{< set-diagram scene="overlap" >}}

Intersecting more sets means retaining just the elements that belong to every
one of them. Thus the models where $P₁, …, Pₙ$ are **all** true form the set
$E = [P₁] ∩ … ∩ [Pₙ]$. We call $E$ the **joint premise region**.

{{< callout type="definition" title="Deductive consequence" >}}
$C$ is a {{< term "deductive-validity" "deductive consequence" >}} of premises
$P₁, …, Pₙ$ {{< term "iff" "iff" >}} every model in which all premises are true also makes $C$ true:

$$P₁, …, Pₙ ⊨ C {{< term "iff" "iff" >}} [P₁] ∩ … ∩ [Pₙ] ⊆ [C].$$

This relation is also called {{< term "entailment" "entailment" >}}.

A {{< term "countermodel" "countermodel" >}} makes **every premise true** and
the conclusion false. One countermodel suffices for invalidity, written
$P₁, …, Pₙ ⊭ C$.
{{< /callout >}}

Notice that we test the **intersection**, not each premise separately. A model
satisfying only one premise cannot refute an inference with two premises.
In the diagrams below, each little world
{{< set expression=true inline=true alt="a model represented as a little world" >}}[{"image": "model-world"}]{{< /set >}}
represents one model: one possible reasoning situation. Labels such as $M₁$
and $M₂$ let us refer to particular models. A world inside $[P]$ is a model
in which $P$ is true.

Explore the premise and conclusion regions in this example. Neither premise
alone guarantees $C$, but together they do: every world in their intersection
also belongs to $[C]$.

{{< set-diagram scene="consequence" >}}

The next diagram shows what goes wrong in an invalid inference. Look for a
world where both premises are true but the conclusion is false. Here $M₂$
is just such a countermodel:

{{< set-diagram scene="countermodel" >}}

With just one premise, this reduces to $P ⊨ C$ {{< term "iff" "iff" >}} $[P] ⊆ [C]$: every model
of $P$ must also be a model of $C$.

{{< callout type="note" title="Modeling assumptions: reading the diagrams" >}}
Each diagram specifies a complete **finite example** of a model space; every
model is a little world. The outlines group those models. An empty patch of
paper is not an additional model, and geometric area is not probability.
These diagrams illustrate the definition. To establish an actual consequence
claim in a language, we must check all models allowed by its semantics, not
just a sample of convenient cases.
{{< /callout >}}

Two boundary cases are worth noticing. If no model satisfies all premises,
the joint region is empty and is a subset of every conclusion region. Such
premises deductively entail every conclusion under this definition. If there
are no premises, we take the joint region to be the whole logical space:
$⊨ C$ says that $C$ is true in every model.

This is, in abstract terms, the standard logical theory of deductive inference.
But it is *truly* abstract: we haven't defined yet what a model really is. To
obtain a workable definition for a concrete language—like the language of
propositional logic—we need to supply the notion of a model for that language.
What we have is a sort of **blueprint** for deductive validity: for any
language, if we supply a definition of a model for that language and say what it
means for a formula to be true in such a model, we obtain the notion of
deductively valid inference in that language.

So, if we want to show that disjunctive syllogism is deductively valid in
propositional logic, for example, we need to show that:

$$[(A ∨ B)] ∩ [¬A] ⊆ [B]$$

That is, we need to show that in all models where $(A ∨ B)$ and $¬A$ are both
true, $B$ is true as well.

Similarly, if we want to show that denying the antecedent is invalid, we need to show that:

$$[(A → B)] ∩ [¬A] ⊈ [¬B]$$

That is we need to show that there's a model where $(A → B)$ and $¬A$ are true,
but $¬B$ is not.

To be able to do this, we need the notion of a model for the language of
propositional logic and conditions when negations, disjunctions, conditionals,
and so on are true in them—providing this is the core task of semantic theory.

The concept of deductive validity is specialized. It makes sense to use
deductive reasoning for specific tasks: reasoning in mathematics or other
specific theories, reasoning with precisely defined concepts or patterns that
are truly general. Notice how this air-tight reasoning is not quite the same
thing as what Sherlock Holmes calls "doing a deduction":

{{< blockquote author="A study in scarlet, 1887">}}
“From a drop of water... a logician could infer the possibility of an Atlantic
or a Niagara without having seen or heard of one or the other. So all life is
a great chain, the nature of which is known whenever we are shown a single
link of it. Like all other arts, the Science of Deduction and Analysis is one
which can only be acquired by long and patient study..."
{{< /blockquote >}}

Sherlock uses the word "deduction" for any reasoning that is careful,
systematic, and reliable. However, the examples in this passage sound a lot
like inductive reasoning. Take a small sample and make an educated guess about
the larger collection that it belongs to. That kind of reasoning is not
indefeasible, it does not make a necessary connection. _We_ do not call that
deduction.

## _Mostly_ -- Inductive validity

The word "induction" has two uses in logical practice, and it's important not
to confuse them. An inductive _definition_, as in the chapter on formal
languages, specifies a set through base cases and construction rules. Inductive
_inference_, instead, concerns how the premises can support a conclusion
without guaranteeing it.

When thinking about inductive support, we need to clearly distinguish two
questions: **How probable is the conclusion given the premises?** and **How
much do the premises increase the probability of the conclusion?**

Note, for example, that a conclusion can become made more probable by the
premises while still being unlikely. Conversely, the conclusion may be very
probable already, with the premises adding little to nothing to it. In
inductive logic, we make both questions precise using probabilities. Crucially,
inductive inference is not air-tight. There is a chance of going from truth to
falsity, but that is a risk we have to take when we are dealing with uncertain
information.

{{< img src="/img/drawings/val_smoke_fire.svg" class="rounded mx-4 float-start inert-img img-fluid" width="200px">}}
The study of induction also has roots in ancient philosophy and psychology. The
Buddhist scholars, and brothers, [Asaṅga and
Vasubandhu](https://plato.stanford.edu/entries/logic-india/) focused on
inferences like "where there is smoke, there is fire". They considered
associative thinking, tracking regularities in experience, and drawing
structural analogies to be the cornerstones of real human belief-forming
practices. This was an attempt to describe how the mind really functions to help
us navigate a world where evidence is imperfect.

Inductive reasoning is characteristic of **scientific inference**, especially
in disciplines where statistical, empirical research plays an important role.
For example, we commonly use [randomized control
trials](https://en.wikipedia.org/wiki/Randomized_controlled_trial) in medical
research to determine whether a drug is effective. Very roughly, the idea is
that we randomly allocate participants a drug or placebo (or the like) and see
if one group (drug or placebo) has significantly better outcomes. Along the
way, we control for various confounding factors. If the group with the drug has
better outcomes than the other, we conclude that the drug is effective. This
is, ultimately, a form of inductive inference: we infer that a drug works from
the fact that it has worked in many cases, which have been well-sampled. -- The
complete story is, of course, much more complicated (how *do* we guarantee that
we sample well, what does "significantly better" mean, …), but at the heart of
this lies inductive inference.

{{< img src="/img/drawings/val_ai_rct.svg" class="rounded float-end inert-img img-fluid mx-4 my-1"
width="200px">}} Since inductive reasoning is
{{< term "defeasible" "defeasible" >}} -- it can be overturned by further
evidence -- it is well-suited to **belief modulation**: to change our beliefs in
light of new evidence. Take the case of smoke means fire, for example. If $∀I$
sees smoke coming up behind the trees, it might think that there's an illegal
open camp-fire burning in the woods. But if $∀I$ learns that Mr. Sir often
smokes his pipe in the forest, he might change his conclusions. Even though the
original evidence didn't go away, it's been further supplemented by additional
information, which changes the conclusions we draw. In this way, inductive
logic is closely related to **learning from evidence**, which is a core concept
of AI research.

Similarly, inductive reasoning plays a central role in **prediction**. We make
predictions when we don't know what's going to happen: the weather, what the
stock market will look like tomorrow, and so on. In fact, we've already
discussed how next-word-prediction is essentially the core concept underlying
recent AI LLMs

{{< img src="/img/drawings/val_text_prediction.svg" class="rounded float-end inert-img img-fluid mx-4 my-1" width="400px">}}

The examples we used to motivate the idea of logical form were all deductive
inferences. But *in*ductive logic also deals with logical form. Let's revisit
some examples. First, take the inference about swans, perhaps the most
traditional example of an inductive inference:

{{< inference layout="stacked" >}}
$All swans we have observed so far were white$
---
$All swans are white$
{{< /inference >}}

In light of the well-known fact that there are black swans, we've slightly
modified the example to a case where $∀I$ draws marbles from a jar:

{{< inference layout="stacked" >}}
$All marbles we have observed so far were white$
---
$All marbles are white$
{{< /inference >}}

The two inferences share a pattern, just as the examples about Socrates shared
a pattern. We will see that this pattern guarantees a weak form of logical
inductive support: the observations cannot lower the probability of the
universal conclusion. This does not by itself make the conclusion probable.
Observing selected white marbles can still tell us very little about the rest
of the jar.

{{< callout type="definition" title="Enumerative induction" >}}
{{< term "enumerative-induction" "Enumerative induction" >}} generalizes from
observed instances to a whole population. How much support the observations
provide, and how probable the conclusion becomes, depend on the probability
function, including assumptions about how the instances were selected and how
they relate to the population.
{{< /callout >}}

The underlying pattern is:

{{< inference layout="stacked" >}}
$All As we have observed so far were B$
---
$All As are B$
{{< /inference >}}

There are different ways in which enumerative induction is represented. Taking
$a$, $b$, $c$, … to name observed As, we can also write:

{{< inference layout="stacked" >}}
$a is B$
$b is B$
$c is B$
$⋮$
---
$All As are B$
{{< /inference >}}

Here we hold fixed that $a$, $b$, $c$, … are As. The universal conclusion
therefore entails each observed instance. A large sample does not by itself
make the conclusion probable; size alone does not remove selection bias.

Just like in deductive logic, we can use formal languages to mathematically
represent inductive inferences. Unfortunately, however, to express inference
schemas like enumerative induction, we need more expressive languages than
propositional logic, so this will have to wait. But what we _can_ talk about
now, is how inductive validity is defined in formal languages *in general*, just
like we did for deductive validity.

For inductive consequence we use the notation $P₁, …, Pₙ$ {{< approx >}} $C$.
Unlike deductive consequence, its precise meaning requires choosing a criterion
of support. We will specify one below rather than treating “strong” as an
absolute label.

There are different approaches to obtain a semantic definition of inductive
validity, but the most prominent approach involves probability theory, which we
use to spell out the idea of the premises making the conclusion more likely.

A straightforward way for implementing probabilities for the formal languages
of logic "piggy-backs" on the notion of a model, which we've used in deductive
logic to define validity. So, we'll be working with a logical space, in which
each formula $A$ has an associated set
$[A]$ of models where it is true.

In inductive logic, we think of these models as ways the world could turn out to
be. If we roll a 6-sided die, for example, there are six ways the world could
turn out to be: it can come up 1, 2, 3, 4, 5, or 6. Each of these corresponds to
a model:


{{< set expression=true alt="Omega is the set of the six possible die outcomes." >}}["Ω =", {"set": [{"image": "d6_1"}, {"image": "d6_2"}, {"image": "d6_3"}, {"image": "d6_4"}, {"image": "d6_5"}, {"image": "d6_6"}]}]{{< /set >}}


If in our language we have formulas $EVEN$ and $ODD$, for example, to say that the outcome will be even or odd, then these would correspond to the following propositions:


{{< set expression=true alt="EVEN is the set of outcomes two, four and six." >}}["[EVEN] =", {"set": [{"image": "d6_2"}, {"image": "d6_4"}, {"image": "d6_6"}]}]{{< /set >}}

{{< set expression=true alt="ODD is the set of outcomes one, three and five." >}}["[ODD] =", {"set": [{"image": "d6_1"}, {"image": "d6_3"}, {"image": "d6_5"}]}]{{< /set >}}


In standard [probability
theory](https://en.wikipedia.org/wiki/Probability_space), such a logical space
is also known as a {{< term "sample-space" "sample space" >}}, whose members represent different possible
outcomes. In *logical* theory, however, the outcomes are just models: possible
reasoning scenarios. The sets of models which we associate with our formulas,
the *propositions*,  are called {{< term "event" "events" >}} in standard probability theory. From
the perspective of logical theory, however, they are just the semantic content
of formulas.

{{< callout type="definition" title="Probability function" >}}
A {{< term "probability-function" "probability function" >}} assigns to each
proposition a real number between 0 and 1—its {{< term "probability" "probability" >}}.
In a finite space, the probabilities of individual outcomes are nonnegative
and sum to 1; an event's probability is the sum over its outcomes.
Thus $Pr(Ω) = 1$ and $Pr(∅) = 0$.
{{< /callout >}}

We will study the general laws of probability in a later chapter. For now,
a finite example is enough to explain the main ideas.

In our toy example of a die roll, here's one way the probabilities could work
out:

{{< set expression=true alt="The probability of each of the six die outcomes is one sixth." >}}["Pr(", {"set": [{"image": "d6_1"}]}, ") = … = Pr(", {"set": [{"image": "d6_6"}]}, ") = 1/6"]{{< /set >}}

This probability distribution corresponds to the assumption that our die is
_fair_, i.e. each outcome is equally likely.

But this is not the only way the probabilities could work out. For example, if
we assume that the die we're dealing with is _loaded_, say much more likely to
roll a six, the probabilities could look like this:

{{< set expression=true alt="Each of the outcomes one through five has probability one tenth." >}}["Pr(", {"set": [{"image": "d6_1"}]}, ") = … = Pr(", {"set": [{"image": "d6_5"}]}, ") = 1/10"]{{< /set >}}

{{< set expression=true alt="The outcome six has probability one half." >}}["Pr(", {"set": [{"image": "d6_6"}]}, ") = 1/2"]{{< /set >}}

We can use probabilities to mathematically spell out the idea that a conclusion
is _likely_ true on the hypothesis that the premises are. For this, we use the
concept of **conditional probabilities**.

Formally, we write $Pr([A] | [B])$ to denote the so-called _conditional
probability_ of $A$ being true under the hypothesis that $B$. The standard
definition of this is given by the following formula:

{{< callout type="definition" title="Conditional probability" >}}
The {{< term "conditional-probability" "conditional probability" >}} of $A$
given $B$ is

$$Pr([A] | [B]) = Pr([A] ∩ [B]) / Pr([B]),$$

provided $Pr([B]) > 0$.
{{< /callout >}}

Here, we crucially need to assume that $Pr([B]) ≠ 0$ to avoid [division by
zero](https://en.wikipedia.org/wiki/Division_by_zero). What this formula says
is that the conditional probability  $Pr([A] | [B])$ of $A$ given $B$ is the
"part" of $B$'s probability that is an $A$-probability—a measure of the
proportion of $B$ scenarios that are $A$ scenarios.

Here's how this plays out in our previous two distributions if we ask ourselves
what's the probability of the roll being a two given that/under the hypothesis
that it's even:

| Distribution | {{< set expression=true inline=true alt="Probability of rolling two" >}}["Pr(", {"set": [{"image": "d6_2"}]}, ")"]{{< /set >}} | $Pr([EVEN])$ | {{< set expression=true inline=true alt="Probability of rolling two given an even outcome" >}}["Pr(", {"set": [{"image": "d6_2"}]}, "∣ [EVEN])"]{{< /set >}} |
| --- | --- | --- | --- |
| Fair die | $1/6$ | $3/6$ | $(1/6) / (3/6) = 1/3$ |
| Loaded die | $1/10$ | $7/10$ | $(1/10) / (7/10) = 1/7$ |

What we can see here is that the probability of the roll being a two _goes up_
under the hypothesis that it's even: from $1/6$ to $1/3$ in the case of the
fair die, and from $1/10$ to $1/7$ in the case of the loaded die. In this
sense, the hypothesis that the roll is even *supports* the conclusion.

Does the hypothesis raise the probability under *every* distribution? Almost,
but we need to be careful about the boundary cases. If a two is impossible --
meaning it has probability 0 -- learning that the roll is even won't make a two
possible (positive) of a sudden.  And if an even result was certain anyway --
meaning it has probability 1 -- we haven't learned anything new.

Here's what holds in general: provided the conclusion is possible (has positive
probability), learning that the roll is even can never *lower* the probability
of a two. The probability goes up, if rolling a two has _positive_ probability
_and_ an even result wasn't already certain. We'll prove this fact in the
chapter on probability and inductive logic.

### Support relative to a distribution

Now let's talk about {{< term "inductive-strength" "inductive support" >}}.
When we first discussed inductive inference, we said that they are either weak
or strong. We can make this idea more precise using probabilities. For this
purpose, let $E = [P₁] ∩ … ∩ [Pₙ]$ again. Additionally, we fix a probability
function $Pr$ and assume $Pr(E) > 0$.

{{< callout type="definition" title="Probability-raising support" >}}
The {{< term "probability-raising" "probability-raising measure" >}} of support is given by increase in the
conclusion's probability when conditioning on the premises:

$$d(C, E) = Pr([C] | E) − Pr([C]).$$

A positive value means that there's _positive support_, a value of zero means
the premises are _irrelevant_, and a negative value means the premises count
against the conclusion. “Stronger” here simply means a larger increase,
relative to a distribution and this measure.
{{< /callout >}}

For our fair die, the increase is $1/3 − 1/6 = 1/6$. For the loaded die,
it is $1/7 − 1/10 = 3/70$. By this measure the premise gives more support
under the fair distribution. Even there, the probability of a two is only
$1/3$: more likely than before does not mean likely!

{{< callout type="note" title="Modeling assumptions: probabilities and statistics" >}}
The fair and loaded distributions are assumptions about our die. Determining
which distribution fits a real die requires observation and statistical
inference, together with assumptions about sampling and stability. Once a
distribution is given, probability theory determines what follows from it.
Logic alone does not tell us which physical die we have.
{{< /callout >}}

Support relative to a particular probability function is a(n inductive) form of
**material validity** in that it depends on substantive assumptions about the
situation. It's crucial to separate the task of **specifying or estimating the
probability function** (central to statistics) from **determining which
inferences it supports** (central to logic).

### Alternative measures of support

Probability increase is one, but not the only possible measure of inductive
support. Suppose that $C$ already has probability $0.99$. Its probability
can increase by at most $0.01$, even if the premises make it certain! The
probability-raising measure leaves little room for strong support when the
conclusion is already very likely.

Another approach compares how likely the evidence is _if the conclusion is
true_ with how likely it is _if the conclusion is false_. We write $¬C$ for
the negation of $C$, so $[¬C]$ is the proposition that $C$ is false. Suppose
that $Pr(E | [C]) = 0.8$ and $Pr(E | [¬C]) = 0.08$. The evidence is ten
times as likely when $C$ is true, whether $C$ was already likely or not.
The {{< term "likelihood-ratio" "likelihood ratio" >}} is then $0.8 / 0.08 = 10$.

This ratio already measures support, but its scale is awkward. Neutral
evidence gives a ratio of $1$, support against $C$ falls between $0$ and $1$,
and support in favor can give very large numbers. We'd like a more convenient
scale, with zero for neutral evidence and positive and negative scores for
support in favor and against.

The [**logarithm**](https://en.wikipedia.org/wiki/Logarithm), written $log$,
gives us such a scale. You don't need its formal definition here. The important
properties are:

- $log(1) = 0$, so neutral evidence gets a score of zero.
- Ratios above $1$ get positive scores; ratios below $1$ get negative scores.
- As the ratio grows, its logarithm also grows, but more slowly. This
  "squeezes" large ratios into a more manageable scale without changing
  which counts as stronger support.

{{< img src="/img/drawings/logarithm.svg" width="560px" alt="Graph of y = log(x) on ordinary, evenly spaced axes. The curve rises through (1, 0), is negative below 1 and positive above 1, and becomes progressively flatter as x increases." >}}

Taking the logarithm of the ratio gives the
{{< term "log-likelihood-ratio" "log-likelihood ratio" >}}
measure of support:

$$l(C, E) = log(Pr(E | [C]) / Pr(E | [¬C])).$$

For now, we assume that both $[C]$ and $[¬C]$, and the evidence under each,
have positive probability, so the formula is well-defined. In our example,
the score is $log(10)$: positive support, regardless of whether $C$ started
out likely or unlikely. The logarithm is simply a mathematical tool for
putting the likelihood ratio on a convenient scale.

There are further measures of support, and they can give different comparisons
of strength. This is a form of plurality in inductive logic: to say how
strongly premises support a conclusion, we need to say which measure we
are using.

### Inductive logic

Finally, we arrive at **logical** inductive support. Recall the distinction
between material and logical validity. A materially valid inference depends on
the particular subject matter; a logically valid inference depends on its
logical form. In deductive logic, we tested this by replacing terms and
predicates while keeping the form fixed.

In inductive logic, the particular probability function describes the subject
matter: a fair die, a loaded die, or some other situation. Support under that
function is {{< term "material-support" "material support" >}}. For {{< term "logical-support" "logical support" >}}, we ask whether the premises
support the conclusion **whatever the probability function**. We keep the
logical relationships between the propositions fixed and vary the probabilities.

Using probability raising, we obtain the following definition. We allow the
probability to stay the same, covering such cases as a conclusion that was
already certain. This is why we call the resulting notion _weak_ logical
inductive validity.

{{< callout type="definition" title="Weak logical inductive consequence" >}}
An inference is {{< term "inductive-validity" "(weakly) logically inductively valid" >}},
written $P₁, …, Pₙ$ {{< approx >}} $C$, {{< term "iff" "iff" >}}, for _every_ probability function
$Pr$ on the model space with $Pr(E) > 0$,

$$Pr([C] | E) ≥ Pr([C]),    where E = [P₁] ∩ … ∩ [Pₙ].$$

{{< /callout >}}

In the die example, {{< set expression=true inline=true alt="The singleton outcome two is a subset of EVEN." >}}[{"set": [{"image": "d6_2"}]}, "⊆ [EVEN]"]{{< /set >}}. Consequently, whenever $Pr([EVEN]) > 0$,
we have

{{< set expression=true alt="The conditional probability of two given EVEN equals the probability of two divided by the probability of EVEN." >}}["Pr(", {"set": [{"image": "d6_2"}]}, "∣ [EVEN]) = Pr(", {"set": [{"image": "d6_2"}]}, ") / Pr([EVEN])"]{{< /set >}}

and this is at least {{< set expression=true inline=true alt="the probability of rolling two" >}}["Pr(", {"set": [{"image": "d6_2"}]}, ")"]{{< /set >}}. This proves the
weak logical claim across **all** distributions. The increase is strict only
when {{< set expression=true inline=true alt="The probability of rolling two is positive." >}}["Pr(", {"set": [{"image": "d6_2"}]}, ") > 0"]{{< /set >}} and $Pr([EVEN]) < 1$.

The die example shows why this is a logical relationship. We did not need to
know whether the die was fair or loaded. What mattered was that every outcome
of two is an even outcome. That relation between the propositions stays the
same when we change their probabilities.

The same reasoning applies to enumerative induction. Let $C$ say that all
marbles in the jar are white, and let $E$ say that the marbles we have observed
from it are white. The universal claim entails each of these instances and
hence their conjunction: $[C] ⊆ E$. Just as in the die example, conditioning
on $E$ cannot lower the probability of $C$, whenever $Pr(E) > 0$. This is
**weak logical support**, independent of the particular probability function.
The increase is strict when $Pr([C]) > 0$ and $Pr(E) < 1$. How much the
probability increases, or how probable the universal claim becomes, still
depends on the distribution.

For an example of support that does depend on the distribution, let $HIGH$
say that a die's outcome is greater than three. With a fair die,
$Pr([HIGH]) = 1/2$. Given $EVEN$, two of the three remaining outcomes are
greater than three, so $Pr([HIGH] | [EVEN]) = 2/3$. Thus $EVEN$ supports
$HIGH$ under this distribution.

Now keep the same outcomes and propositions, but change their probabilities.
Suppose two and five each have probability $1/3$, and each other outcome has
probability $1/12$. We still have $Pr([HIGH]) = 1/2$, but now
$Pr([HIGH] | [EVEN]) = 1/3$: the premise lowers the conclusion's probability!
The support under the fair distribution is **material**. It is not weak
logical support, since the required relationship fails under another
probability function on the same model space.

There is one restriction in the definition to keep in mind: $Pr(E) > 0$. Our
formula for conditional probability divides by $Pr(E)$, so we cannot use it
when the premises have probability zero. We therefore test only probability
functions that give the premises positive probability. If no model makes all
the premises true, no such function exists; there is then no case to test.

We now have a general account of inductive inference. Given a probability
function, we can calculate how strongly the premises support a conclusion. That
is material support. To establish logical support, we show that the required
relationship holds for every probability function. Finding the probability
function that fits a particular situation is a further task, for which we need
statistics and knowledge of that situation. In later chapters, we will study
the probability laws that let us carry out these calculations and prove logical
relationships like the one in our die example.

## Further readings {.readings .nocount}

- Audrey Yap and Richard Zach, [*What If?* (PDF)](https://builds.openlogicproject.org/courses/what-if/wi-screen.pdf), chapter 1, especially §§1.5–1.6, for valuations and semantic consequence.

- Russell and Norvig, [*Artificial Intelligence: A Modern Approach*, 4th edition](https://www.pearson.com/en-us/subject-catalog/p/Russell-Lecture-Power-Points-for-Artificial-Intelligence-A-Modern-Approach-4th-Edition/P200000003500/9780137505135), chapter 12, for the probability theory behind inductive inference.
