---
title: Logical conditionals
author: Johannes Korbmacher
date: 24/09/2024
last_edited: 24/09/2024
weight: 6
params: 
  id: txt-if
  math: true
---

# Logical conditionals

In our discussion of {{< chapter_ref chapter="boolean" >}}
Boolean algebra{{< /chapter_ref >}} so far, we've avoided dealing with
**conditionals**: "_if_ ..., _then_ ..."-statements which we formalize as $$A\to
B.$$ In this chapter, you'll learn about how conditionals are defined and used
in propositional logic. 

First, you'll learn about the truth-functional way of thinking about if-then
statements, the so-called 

+ [material conditional](#the-material-conditional). 

Then, we move on to inference patterns that are important for AI applications,
in particular:

+ [forward chaining](#forward-chaining),
+ [backward chaining](#backward-chaining).

We conclude with an outlook and remarks on [non-material
conditionals](#non-material-conditionals).

## The material conditional

How should we treat statements like $$\mathsf{RAIN}\to \mathsf{WET}$$ in Boolean
algebra? This, it turns out, is not an easy question. 

The easy part is this:

+ If $\nu(\mathsf{RAIN})=1$ and $\nu(\mathsf{WET})=1$, we want $\nu(\mathsf{RAIN}\to
\mathsf{WET})=1$.

+ If $\nu(\mathsf{RAIN})=1$ and $\nu(\mathsf{WET})=0$, we want, $\nu(\mathsf{RAIN}\to \mathsf{WET})=0$.

But this only gives us a partial table for the truth-function
$\Rightarrow:\Set{0,1}^2\to \Set{0,1}$ which interprets
$\to$:

{{< img src="img/tt-partial.png" class="img-thumbnail" >}}

So, what do we do if $\nu(\mathsf{RAIN})=0$? It turns out that we want to say
$\nu(\mathsf{RAIN}\to \mathsf{WET})=1$ _regardless_ of the truth-value of
$\mathsf{WET}$. 

One of the reasons for this is the connection between valid inference and the
conditional. To understand, we need the concept of a **tautology** or **logical
truth**. 

In Boolean algebra, a _tautology_ is any formula that is true under all
valuations. Consider, for example, $\mathsf{RAIN}\lor\mathsf{SUN}$—it's
either raining or not raining. No matter the value $\nu(\mathsf{RAIN})$ of
$\mathsf{RAIN}$, we have $\nu(\mathsf{RAIN}\lor\mathsf{SUN})=1$:

+ If $\nu(\mathsf{RAIN})=1$, then $\nu(\mathsf{RAIN}\lor\mathsf{SUN})=1+0=1$
+ If $\nu(\mathsf{RAIN})=0$, then $\nu(\mathsf{RAIN}\lor\mathsf{SUN})=0+1=1$

If a formula $A$, like $\mathsf{RAIN}\lor\mathsf{SUN}$, is a logical truth
we write $\vDash A$ to indicate this. So, what we've just shown is that
$$\vDash\mathsf{RAIN}\lor\mathsf{SUN}.$$

Now the thing is that if we say that that $\nu(A\to B)=1$ whenever $\nu(A)=0$,
we get the following beautiful connection between validity and the conditional:
$$P_1, P_2, \dots\vDash C\Leftrightarrow\ \vDash (P_1\land P_2\land \dots)\to
C$$ In words, an inference is valid if and only if the conditional formed from
taking the conjunction of the premises as the if-part and the conclusion as the
then-part is logically valid.

The truth-function that's given by the following table is known as the
**material conditional**:

{{< img src="img/tt.png" class="img-thumbnail" >}}

Our first motivation for treating $\to$ as a material conditional is the above
connection between valid inference and the conditional, which is also known as
the [deduction theorem](https://en.wikipedia.org/wiki/Deduction_theorem). One
interesting implication of the deduction theorem is that it gives us an
interesting variant of the truth-table method. 

The idea is that in order to test whether $P_1,P_2, \dots\vDash C$ we can also
just test whether the formula $(P_1\land P_2\land \dots)\to C$ gets value 1
under each valuation. Take our example from the {{< chapter_ref chapter="sat" id="validity-and-satisfiability" >}}
previous chapter{{< /chapter_ref >}} again:
$$(\mathsf{RAIN}\lor \mathsf{BIKE}),\neg\mathsf{RAIN}\vDash\mathsf{BIKE}$$
We can test this inference by doing the truth-table for the following formula:
$$(\mathsf{RAIN}\lor \mathsf{BIKE})\land\neg\mathsf{RAIN}\to\mathsf{BIKE}$$

{{< img src="img/tt-2.png" class="img-thumbnail" >}}

Since the formula in question receives value 1 under all valuations, it is a
logical truth. This means that the inference in question is valid. The deduction
theorem has many further logical implications, but we won't focus on those here.



An additional justification comes from the foundations of programming, which is
a foundational topic for AI, as we've seen in {{< chapter_ref
chapter="formal-languages" >}}
Chapter 3. Formal languages{{< /chapter_ref >}}. Consider the following [pseudo
code](https://en.wikipedia.org/wiki/Pseudocode):

```
  for n in range(1,10)
    if n is divisible by 2:
      print "Even!"
```

This program loops through all the numbers from 0 to 10 and for the even ones
(2,4,6,8,10) it prints even.  How should we think about happens "under the hood"
when the program evaluates the following expression?

```
  if 1 is divisible by 2:
      print "Even!"
```

While we don't want the computer to print "Even!", we also don't want to think
of the whole expression as _false_ or _erroneous_. 

Next, you'll learn about inference patterns involving conditionals which are
important in AI applications.

## Forward chaining

The **forward chaining** method is, essentially, a series of applications of the
reasoning pattern known in logical theory as **modus ponens (MP)**. It's an
important method for [automated theorem
proving](https://en.wikipedia.org/wiki/Automated_theorem_proving), which deals
with automating valid inference.

MP is following inference pattern: $$A,A\to B\vDash B$$ So, for example,
$$\mathsf{RAIN},\mathsf{RAIN}\to\mathsf{WET}\vDash \mathsf{WET}$$ This pattern
is perhaps the most paradigmatic _logical_ reasoning pattern out there. 

There are different ways in which we can justify the pattern, but let's use a
truth-table for a particularly comprehensive explanation:

{{< img src="img/tt-3.png" class="img-thumbnail" >}}

Having established that MP works, let's talk about forward chaining. The idea of
forward chaining is to repeatedly use MP 

Let's look at a toy example to illustrate. We're at home it's rainy and not warm
(logician for: cold) outside. We're wondering what to do. Our setup is as
follows:

+ We have a _knowledge base_ that contains a series of conditional rules:
  1. $\mathsf{SUN}\to \mathsf{BIKE}$
  2. $\mathsf{RAIN}\to \mathsf{CAR}$
  3. $\mathsf{WARM}\to \mathsf{SHIRT}$
  4. $\mathsf{COLD}\to \mathsf{COAT}$
  5. $\mathsf{BIKE}\to \mathsf{HELMET}$
  6. $\mathsf{CAR}\to \mathsf{KEYS}$

+ Additionally, we have some _known facts_:
  + $\mathsf{RAIN}$
  + $\mathsf{COLD}$

The forward chaining method checks through our knowledge base to see whether the
antecedents (if-part) of any of our conditional rules contains a known fact.

We find for example, the rule:

  2. $\mathsf{RAIN}\to \mathsf{CAR}$

Since $\mathsf{RAIN}$ is among our known facts, we can reason as follows:

$$\mathsf{RAIN},\mathsf{RAIN}\to \mathsf{CAR}\vDash\mathsf{CAR}$$

As a result, we add $\mathsf{CAR}$ to our known facts. This makes the following
rule applicable:

  6. $\mathsf{CAR}\to \mathsf{KEYS}$

Again, using MP-style reasoning, we proceed:

$$\mathsf{CAR},\mathsf{CAR}\to \mathsf{KEYS}\vDash\mathsf{KEYS}$$

We thus add $\mathsf{KEYS}$ to our known facts. In a similar fashion, we add
$\mathsf{COAT}$ and $\neg\mathsf{HELMET}$ to our known facts arriving at the
final known facts:
  + $\mathsf{RAIN}$
  + $\mathsf{COLD}$
  + $\mathsf{CAR}$
  + $\mathsf{KEYS}$
  + $\mathsf{COAT}$

This is all we can get "out" of our known facts using our knowledge base.
AI researchers typically think of forward-chaining as a **data driven**
inference method: we start with some known facts and try to see what else we can
derive from the known facts. We don't have **goal** in mind. This is different
with the following method.

## Backward chaining

The **backward chaining** method is, as the name suggests, forward chaining "the
other way around". Instead of starting from the data and extracting new
information from it, backward chaining starts with a goal, a question we're
trying to answer. This makes backward chaining a **goal directed** method.

We can explain how backward chaining works using our same example as above:

+ Our _knowledge base_ contains:
  1. $\mathsf{SUN}\to \mathsf{BIKE}$
  2. $\mathsf{RAIN}\to \mathsf{CAR}$
  3. $\mathsf{WARM}\to \mathsf{SHIRT}$
  4. $\mathsf{COLD}\to \mathsf{COAT}$
  5. $\mathsf{BIKE}\to \mathsf{HELMET}$
  6. $\mathsf{CAR}\to \mathsf{KEYS}$

+ Our _known facts_ are:
  + $\mathsf{RAIN}$
  + $\mathsf{COLD}$

But instead of just wondering what we can derive, we're specifically asking the
question whether we should take our helmet. That is, we have a set of **goals**
that contains: $$\mathsf{HELMET}$$

With this specific question in mind, we go through the rules and see whether
there's a rule that would allow us to infer $\mathsf{HELMET}$. We find:

  5. $\mathsf{BIKE}\to \mathsf{HELMET}$

If we would know that $\mathsf{BIKE}$, we could infer $\mathsf{HELMET}$. So we
temporarily add $\mathsf{BIKE}$ to our goals. Again, we check whether we find a
corresponding rule:

  1. $\mathsf{SUN}\to \mathsf{BIKE}$

We now add $\mathsf{SUN}$ to our temporary goals. But at this point our
search terminates. We can't find any rule that gives us $\mathsf{SUN}$. We
couldn't reach our goals

Now suppose, instead, we ask whether we should take our keys and add
$\mathsf{KEYS}$ to our goals. We can then backwards chain the rules:

  2. $\mathsf{RAIN}\to \mathsf{CAR}$
  6. $\mathsf{CAR}\to \mathsf{KEYS}$

We arrive at a goal that's among our known facts, viz. $\mathsf{RAIN}$. This
means that using a series of MP's and rules 2 and 6, we can derive our ultimate
goal: $\mathsf{KEYS}$. Our KB has settled the question.

But wait a moment, have we established yet that we _shouldn't_ take a helmet?
It turns out that this is not such an easy question. We've shown that our
knowledge base doesn't settle the question. But there a lot of questions it
doesn't settle, should we treat them all as false?

The so-called [closed-world assumption
(CWA)](https://en.wikipedia.org/wiki/Closed-world_assumption) in AI says yes. In
short, the CWA tells us to treat non-derivable statements as false, meaning we'd
conclude $\neg\mathsf{HELMET}$ from the fact that we can't derive
$\mathsf{HELMET}$. The CWA plays a fundamental role in knowledge representation.

## Conditionals in programming

Before we move to the limitations of the logical conditional, let's briefly talk
about conditionals in programming. 

If you've ever written a computer program, you've very likely written something
like this:

```
  if CONDITION:
    EFFECT-1
  elif: 
    EFFECT-2
  else:
    EFFECT-3
```

For example, a solution to the  famous [fizz
buzz](https://en.wikipedia.org/wiki/Fizz_buzz) programming exercise looks
something like this:

```
  for n in range(1,101):
    if n is divisible by 3 and n is divisible by 5:
      print("FizzBuzz")
    elif n is divisible by 3:
      print("Fizz")
    elif n is divisble by 5:
      print("Buzz")
    else:
      print(n)
```
This program loops through all the numbers from 1 to 100 and tests for each
number whether it's divisible by both 3 and 5, in which case it prints
"FizzBuzz", if that's not the case but the number is divisible by 3, the program
prints "Fizz", if that's also not the case but the number is divisible by 5, the
program prints "Buzz", and if all else fails, it prints the number.

This results in a sequence that begins like this:

$$1,2,Fizz,4,Buzz,Fizz,7,8,Fizz,Buzz,\dots$$

The material conditional can help us understand what's going on here. Each of
the conditions is a Boolean condition: it evaluates either to true false. The
"if-then-else" statements can therefore be modelled by the following material
conditionals:

+ $\mathsf{DIV\\\_3}\land \mathsf{DIV\\\_5}\to \mathsf{PRINT\\_FIZZBUZZ}$
+ $\mathsf{DIV\\\_3}\land \neg\mathsf{DIV\\\_5}\to \mathsf{PRINT\\_FIZZ}$
+ $\neg\mathsf{DIV\\\_3}\land \mathsf{DIV\\\_5}\to \mathsf{PRINT\\_BUZZ}$
+ $\neg\mathsf{DIV\\\_3}\land \neg\mathsf{DIV\\\_5}\to \mathsf{PRINT\\_NUMBER}$

These are, essentially, a knowledge base. If we change the known facts
corresponding to the actual divisibility facts of the number, we can derive what
to print using standard inference techniques, such as forward/backward chaining.

[Conditionals](https://en.wikipedia.org/wiki/Conditional_(computer_programming))
are a fundamental reason for the expressive power of programming languages and
at their very heart lies the behavior of the material conditional.

## Non-material conditionals

Before we conclude the chapter, we should talk about the **limitations** of the
logical conditional. 

The most important limitation is that $\Rightarrow$ is not a good model of many
uses of the phrase "if ..., then ..." in natural language. For example,
typically, people think that conditionals like "If the moon is made of cheese,
then pigs can fly" are false. The reason is, arguably, that the material of the
moon has nothing to do with the abilities of pigs. But if we treat if-then as
the truth-function $\Rightarrow$, since the moon is _not_ made of green cheese,
the conditional would need to get the value $0\Rightarrow 0=1$.

This and similar phenomena have lead to the development of various **conditional
logics**, which aim to provide a more adequate formalization of various if-then
clauses. Of these logics, especially the logic of [counterfactual
conditionals](https://en.wikipedia.org/wiki/Counterfactual_conditional), which
are conditionals that talk about what _would have been_, play an important role
in the representation of causal knowledge and in [XAI](https://en.wikipedia.org/wiki/Explainable_artificial_intelligence).

## Further readings

You can find a more detailed discussion of algorithmic implementations of forward and
backward chaining in Ch. 7.5 of Russel and Norvig's "Artificial Intelligence. A
Modern Approach." (see the detailed reference in {{< chapter_ref
chapter="boolean" id="further-readings">}}Chapter 1. Logic and AI{{<
/chapter_ref >}}). 

**Notes:**

[^tertium]: Historically, this assumption is known as _tertium non datur_, which
is Latin for "a third (truth-value) is not given".
