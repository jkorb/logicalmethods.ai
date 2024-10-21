---
title: Many-valued logics
author: Johannes Korbmacher
weight: 10
params: 
  id: exc-mv
  math: true
---

# 3-valued truth-tables

In {{< chapter_ref chapter="sat" >}} Ch. 5. Boolean satisfiability{{<
/chapter_ref >}}, we've described a truth-table method to test for valid
inference $P_1,P_2,\dots\vDash C$, which worked by testing whether $P_1\land
P_2\land \dots\to C$ is a logical truth in classical logic.

This method doesn't work in Kleene logic because there are _no_ logical truths
but there _are_ valid inferences. But there is an _adjusted_ truth-table method
that works for both Kleene and Łukasciewicz.

For this method, we need to have one row for each possible assignment of the
truth-values $0,i,1$ to the variables in the formula (for $2$ propositional
variables that already gives us $3\times 3=9$ rows). Then we recursively
calculate the truth-values of both $P_1\land P_2\land \dots$ and $C$ for each
row, and we check if in every row where $P_1\land P_2\land \dots$ has value 1,
$C$ also has value $1$. If so, the inference is valid, if not it isn't.

Use this adjusted truth-table method to to determine whether the following
inferences are valid in both Kleene and Łukasciewicz logic.

## a)

$\mathsf{HOT},\mathsf{HOT}\to \mathsf{HUMID}\vDash \mathsf{HUMID}$

## b) {.homework}

$\mathsf{HOT}\vDash \mathsf{RAIN}\to \mathsf{HOT}$

## c) 

$\mathsf{HOT}\lor \neg \mathsf{HUMID},\mathsf{HUMID}\lor \mathsf{DRY}\vDash
\mathsf{HOT}\lor\mathsf{DRY}$ 

## d) {.homework}

$\mathsf{HOT}\land \neg \mathsf{HOT}\vDash \mathsf{COLD}$

## e)

$\mathsf{HOT}\vDash \mathsf{HUMID}\to\mathsf{HUMID}$

## f) {.homework}

$\neg\mathsf{HOT}\vDash \mathsf{HOT}\to\mathsf{HOT}$

# Fuzzy logic

Test for each of the following inferences whether it's valid or not in the fuzzy
logic Ł. If the inference is valid, provide an argument, if the inference is
invalid provide a countermodel.

## a) {.homework}

$\mathsf{RAIN}\land\neg\mathsf{RAIN}\vDash \mathsf{HOT}$

## b) 

$\mathsf{HOT}\vDash \mathsf{HOT}\lor(\mathsf{RAIN}\land \mathsf{HOT})$

## c)  {.homework}

$\mathsf{HOT}\lor \neg \mathsf{HUMID},\mathsf{HUMID}\lor \mathsf{DRY}\vDash
\mathsf{HOT}\lor\mathsf{DRY}$ 

## d)

$\mathsf{HOT}\land \neg \mathsf{HOT}\vDash \mathsf{COLD}$

## e) {.homework}

$\mathsf{HOT}\vDash \mathsf{HUMID}\lor\neg\mathsf{HUMID}$

# Fuzzy rules

Remember that a fuzzy rule $$\textbf{IF } A \textbf{ THEN } B$$ means that $B$ holds
to the extend that $A$.

Imagine an
[HVAC](https://en.wikipedia.org/wiki/Heating,_ventilation,_and_air_conditioning)-system,
with a fuzzy control unit. We want the system to behave as follows:

+ If it's hot or humid, then power up the AC unit.
+ If it's cold or humid, then power up the heating unit.
+ If you power up the AC unit, power down the heating unit.
+ If you power up the heating unit, power down the AC unit.

## a) 

Using only the propositional variables 

$$\mathsf{HOT},\mathsf{HUMID},\mathsf{AC},\mathsf{HEAT}$$

formule fuzzy rules that represent our fuzzy control rules from above.

## b) {.homework}

Check whether the rules behave reasonably by going through what happens with
some concrete numerical values representing:

+ hot high, humidity high
+ hot medium, humidity high
+ hot low, humidity high
+ hot high, humidity medium
+ hot medium, humidity medium
+ hot low, humidity medium
+ hot high, humidity low
+ hot medium, humidity low
+ hot low, humidity low

Are there any problematic cases? If so, can we fix them?

# T-norms

The general theory of fuzzy logics uses the concept of a
[t-norm](https://en.wikipedia.org/wiki/T-norm), which is short for "triangular
norm." T-norms are used to define a fuzzy conditional that behaves in a natural
way as a "logical" conditional for fuzzy logic. These logical conditionals of
fuzzy find applications in fuzzy knowledge bases, where they allow the
application of chaining methods for example.

We'll not go into the details of the construction of the conditional here, but
rather focus on what the t-norm for Łukasiewicz fuzzy logic. 

## a) Strong conjunction

The t-norm for fuzzy logic can be expressed by introducing an extra connective
$\otimes$ ("strong conjunction") to the language with $\neg,\land,\lor$. This
connective uses the fuzzy truth-function: $$f_\otimes(x,y)=\max(0,x+y-1).$$
That is the recursive truth-values for $A\otimes B$ are calculated as follows:

$$\nu(A\otimes B)=\max(0,\nu(A)+\nu(B)-1).$$

Check that the following characteristic properties hold for the operation $f_\otimes$:

1) $f_\otimes(x,y)=f_\otimes(y,x)$
2) If $x\leq x'$ and $y\leq y'$, then $f_\otimes(x,y)\leq f_\otimes(x',y')$
3) $f_\otimes(x,f_\otimes(y,z))=f_\otimes(f_\otimes(x,y),z)$
4) $f_\otimes(x,1)=x$

_Hint_: Here you cannot check all possible cases, since $x,y,z\in\mathbb{R}$ can
take infinitely many values. Instead, you need to reason "algebraically" about
how the values hang together. Here are some tips on what to use:

+ For the first, you need to use the mathematical fact that $x+y=y+x$. 

+ For the second, you need to consider the cases where $f_\otimes(x,y)$ can be
$0$ and the mathematical fact that sums of bigger numbers are bigger. 

+ For the third, you need to use the fact that $x+(y+z)=(x+y)+z$.

+ For the fourth, you're on your own 😃

## b) Fuzzy logical conditional {.homework}

In Łukasiewicz's logic, the logical conditional $\to$ is interpreted by the
following truth-function:

$$f_\to(x,y)=\min(x,1-x+y)$$

That means that:

$$\nu(A\to B)=\min(x,1-\nu(A)+\nu(B))$$

Check that the following holds in Łukasiewicz's logic:

$$\mathsf{RAIN}\otimes (\mathsf{RAIN}\to \mathsf{WET})\vDash \mathsf{WET}$$


# Research 

Find out what fuzzy sets are. 

## a)

How are fuzzy sets related to fuzzy logic?

## b)

How are fuzzy sets used in AI?

# Discussion

Kleene logic has no logical laws/tautologies, as discussed in class. For
example, if we don't know whether it'll rain or now and model this by
$$\nu(\mathsf{RAIN})=i,$$ in Kleene's logic, we'll get the consequence that
$$\nu(\mathsf{RAIN}\lor\neg\mathsf{RAIN})=i.$$ In a sense, this is what we want
(we don't know whether it'll rain or not), but in a sense this is also
unsatisfactory: we know that _one_ of the two will happen, we just don't know
which. Is this a problem for applications of Kleene logic in AI-decision making
systems? Argue your answer in one or two paragraphs.


