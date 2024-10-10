---
title: Boolean satisfiability
author: Johannes Korbmacher
weight: 5
params: 
  id: exc-sat
  math: true
---

# Truth tables {.solved}

Use the truth-table method to determine the validity of the following
inferences:

## a) {.homework}

$$\neg\mathsf{RAIN}\lor\mathsf{BIKE}, \mathsf{BIKE}\vDash\neg\mathsf{RAIN}$$

## b) 

$$\neg\mathsf{RAIN}\lor\mathsf{BIKE}, \mathsf{RAIN}\vDash\mathsf{RAIN}$$

## c)

$$\neg\mathsf{RAIN}\vDash\mathsf{RAIN}\lor (\neg\mathsf{RAIN}\land
\mathsf{BIKE})$$

## d) {.homework}

$$\mathsf{RAIN}\lor (\mathsf{BIKE}\land \mathsf{SUN})\vDash
\mathsf{RAIN}\lor\mathsf{BIKE}$$

## Solution {.solution #truth-tablesSolution}

{{< img src="img/1a.png" class="img-thumbnail" >}}
{{< img src="img/1b.png" class="img-thumbnail" >}}
{{< img src="img/1c.png" class="img-thumbnail" >}}
{{< img src="img/1d.png" class="img-thumbnail" >}}

# CNFs {.latex .solved}

Transform the following formulas into CNF.

## a)

$$\neg(\mathsf{RAIN}\lor \mathsf{SUN})\land
\neg\neg(\mathsf{SUN}\lor\neg\mathsf{RAIN})$$

## b)

$$(\mathsf{RAIN})\land (\mathsf{SUN}\lor\neg\mathsf{BIKE})$$

## c) {.homework}

$$(\mathsf{RAIN}\land \mathsf{SUN}\land \neg\mathsf{SUN})\lor
(\neg\mathsf{RAIN}\land \neg\mathsf{SUN}\land \mathsf{SUN})$$

## d) 

$$\neg(\mathsf{RAIN}\lor (\mathsf{SUN}\lor \neg\mathsf{SUN}))\land
\neg((\neg\mathsf{RAIN}\lor \neg\mathsf{SUN})\lor \mathsf{SUN})$$

{{< latex >}}

\begin{itemize}
  \item  $\neg(\mathsf{RAIN}\lor \mathsf{SUN})\land
\neg\neg(\mathsf{SUN}\lor\neg\mathsf{RAIN})\leadsto$
  \item $(\mathsf{RAIN})\land (\mathsf{SUN}\lor\neg\mathsf{BIKE})$
  \item $(\mathsf{RAIN}\land \mathsf{SUN}\land \neg\mathsf{SUN})\lor
(\neg\mathsf{RAIN}\land \neg\mathsf{SUN}\land \mathsf{SUN})$
  \item $\neg(\mathsf{RAIN}\lor (\mathsf{SUN}\lor \neg\mathsf{SUN})\land
\neg((\neg\mathsf{RAIN}\lor \neg\mathsf{SUN})\lor \mathsf{SUN})$
\end{itemize}

{{< /latex >}}

## Solution {.solution #cnfsSolution}


**a)**

Conversion steps:

$$\neg(\mathsf{RAIN}\lor\mathsf{SUN})\land\neg\neg(\mathsf{SUN}\lor\neg\mathsf{RAIN})$$

$$\leadsto(\neg\mathsf{RAIN}\land\neg\mathsf{SUN})\land(\mathsf{SUN}\lor\neg\mathsf{RAIN})$$


**b)**

This is already in CNF, we don't have to convert anything.

$$\mathsf{RAIN}\land(\mathsf{SUN}\lor\neg\mathsf{BIKE})$$

**c)**

Conversion steps:

$$(\mathsf{RAIN}\land\mathsf{SUN}\land\neg\mathsf{SUN})\lor(\neg\mathsf{RAIN}\land
\neg\mathsf{SUN}\land\mathsf{SUN})$$

$$\leadsto((\mathsf{RAIN}\land\mathsf{SUN}\land\neg\mathsf{SUN})\lor
\neg\mathsf{RAIN})\land((\mathsf{RAIN}\land\mathsf{SUN}\land\neg\mathsf{SUN})\lor
\neg\mathsf{SUN})$$
$$\qquad \land(\mathsf{RAIN}\land\mathsf{SUN}\land\neg\mathsf{SUN})\lor\mathsf{SUN})$$

$$\leadsto(\mathsf{RAIN}\lor\neg\mathsf{RAIN})\land(\mathsf{SUN}\lor\neg\mathsf{RAIN})\land(\neg\mathsf{SUN}\lor\neg\mathsf{RAIN})\land(\mathsf{RAIN}\lor\neg\mathsf{SUN})$$

$$\qquad\land(\mathsf{SUN}\lor\neg\mathsf{SUN})\land(\neg\mathsf{SUN}\lor\neg\mathsf{SUN})\land(\mathsf{RAIN}\lor\mathsf{SUN})$$
$$\qquad\land(\mathsf{SUN}\lor\mathsf{SUN})\land(\neg\mathsf{SUN}\lor\mathsf{SUN})$$

**d)**

Conversion steps:

$$\neg(\mathsf{RAIN}\lor(\mathsf{SUN}\lor\neg\mathsf{SUN}))\land\neg((\neg\mathsf{RAIN}\lor\neg\mathsf{SUN})\lor\mathsf{SUN})$$

$$\leadsto(\neg\mathsf{RAIN}\land\neg(\mathsf{SUN}\lor\neg\mathsf{SUN}))\land(\neg(\neg\mathsf{RAIN}\lor\neg\mathsf{SUN})\land\neg\mathsf{SUN})$$

$$\leadsto(\neg\mathsf{RAIN}\land\neg\mathsf{SUN}\land\neg\neg\mathsf{SUN})\land(\neg\neg\mathsf{RAIN}\land\neg\neg\mathsf{SUN}\land\neg\mathsf{SUN})$$

$$\leadsto(\neg\mathsf{RAIN}\land\neg\mathsf{SUN}\land\mathsf{SUN})\land(\mathsf{RAIN}\land\mathsf{SUN}\land\neg\mathsf{SUN})$$

# DPLL {.solved}

## a)

Redo exercise 1 using the DPLL algorithm instead of truth-tables.

## b) 

Use the DPLL algorithm to determine whether the following formulas are
satisfiable. If necessary, first bring the formula into CNF.

1. $(p\lor q\lor \neg r)\land (p\lor\neg q\lor \neg r)$

2. $\neg(p\land q)\lor (r\land \neg r)$

3. $(p\lor q)\land (p\lor \neg q)\land (\neg p\lor q)\land (\neg p\lor \neg q)$

4. $(p\land (p\lor q))\land (q\land (q\lor p))$

## Solution {.solution #dpllSolution}

**Exercise 1(a)**

+ CNF formula:
$(\neg\mathsf{RAIN}\lor\mathsf{BIKE})\land(\mathsf{BIKE}\land\mathsf{RAIN})$
+ CNF set:
$\Set{\Set{\neg\mathsf{RAIN},\mathsf{BIKE}},\Set{\mathsf{BIKE}},\Set{\mathsf{RAIN}}}$
+ By pure literal elimination on $\mathsf{BIKE}$ we get
$\Set{\Set{\mathsf{RAIN}}}$ and $\nu(\mathsf{BIKE})=1$.
+ By unit propogation on $\mathsf{RAIN}$ we get $\Set{}$ and
$\nu(\mathsf{BIKE})=1$ and $\nu(\mathsf{RAIN})=1$.
+ This valuation does satisfy the CNF formula.

**Exercise 1(b)**

+ CNF formula: $(\neg\mathsf{RAIN}\lor\mathsf{BIKE})\land(\mathsf{RAIN}\land\neg\mathsf{RAIN})$
+ CNF set: $\Set{\Set{\neg\mathsf{RAIN},\mathsf{BIKE}},\Set{\mathsf{RAIN}},\Set{\neg\mathsf{RAIN}}}$
+ By pure literal elimination on $\mathsf{BIKE}$ we get
$\Set{\Set{\mathsf{RAIN}},\Set{\neg\mathsf{RAIN}}}$ and $\nu(\mathsf{BIKE})=1$.
+ By unit propogation on $\mathsf{RAIN}$ we get $\Set{\Set{}}$, which shows that
the set is unsatisfiable.

**Exercise 1(c)**

+ CNF formula:
$(\neg\text{RAIN}\land\neg\text{RAIN})\land(\text{RAIN}\lor\neg\text{BIKE})$
+ CNF set: $\Set{\Set{\neg\text{RAIN}},\Set{\text{RAIN},\neg\text{BIKE}}}$
+ By pure literal elimination on $\neg\mathsf{BIKE}$ we get
$\Set{\Set{\neg\text{RAIN}}}$ and $\nu(\mathsf{BIKE})=0$.
+ By pure literal elimination on $\neg\mathsf{RAIN}$ we get $\Set{}$ and
$\nu(\mathsf{BIKE})=0$ and $\nu(\mathsf{RAIN})=0$.
+ This valuation does satisfy the CNF formula.

**Exercise 1(d)**

+ CNF formula:
$((\text{RAIN}\lor\text{BIKE})\land(\text{RAIN}\lor\text{SUN}))\land(\neg\text{RAIN}\land\neg\text{BIKE})$ 
+ CNF set:
$\Set{\Set{\text{RAIN},\text{BIKE}},\Set{\text{RAIN},\text{SUN}},\Set{\neg\text{RAIN}},\Set{\neg\text{BIKE}}}$ 
+ By pure literal elimination on $\mathsf{SUN}$ we get
$\Set{\Set{\text{RAIN},\text{BIKE}},\Set{\neg\text{RAIN}},\Set{\neg\text{BIKE}}}$  and $\nu(\mathsf{SUN})=1$.
+ By unit propogation on $\neg\mathsf{BIKE}$ we get $\Set{\Set{\text{RAIN}},\Set{\neg\text{RAIN}}}$ and $\nu(\mathsf{BIKE})=0$ and $\nu(\mathsf{SUN})=1$.
+ By unit propogation on $\mathsf{RAIN}$ we get $\Set{\Set{}}$, which shows that the set is unsatisfiable.

# Planning {.solved}

One of the main applications of SAT-solving (via truth-tables, DPLL, or
otherwise) is _automated planning_. This exercise goes through a simplified example to
show how this works.

**Setup**: We've got a robot that sits in front of two switches, one on the left
and one on the right. Each switch controls a lamp, the left switch controls the
left lamp and the right switch the right lamp. The switches work as follows: 

+ If a lamp is on and you operate the switch, the lamp turns off.
+ If a lamp is off and you operate the switch, the lamp turns on.

The left lamp is currently on and the right one is off. The robot can operate
the switches and has the following goal:

+ Turn the left lamp off and the right one on.

It needs to devise a simple **plan** to achieve that.

The **idea** is to use SAT solving to devise such a plan. For that, we need to
first translate the problem into propositional logic.

## a) Translation

Our first step is to devise an appropriate language. Here's the idea:

+ We think of the situation as made up of
[discrete](https://en.wikipedia.org/wiki/Discrete) time points, $1,2,\dots,n$.
For simplicity, we only assume times $1$ and $2$.

+ For each state that our setup can be in at a given time, we devise a
propositional variable that describes the state. For example, we could have
$L\\_Lamp\\_1$ to say that the left lamp is on at time $1$, and $\neg
L\\_Lamp\\_2$
to say that the lamp at $2$ is off. 

+ For each action the robot can perform, we also have a propositional variable.
For example, we have $L\\_SWITCH\\_1$ to say that the robot switches the left
switch at time $1$, etc. 

+ We have the usual Boolean connectives $\neg,\land,\lor$.

**Task**: Determine the BNF of the language. 

## b) Formalize

Once we have a suitable language, we need to translate the setup into formulas:

+ We need to describe the set-up: 

  + the left lamp is on at time $1$
  + the right lamp is off at time $1$. 

+ We need to formalize the system rules:$^\dagger$

  + If a lamp is on at a given time and the corresponding switch is flipped, the
  lamp is off at the next time.
  + If a lamp is off at a given time and the corresponding switch is flipped, the
  lamp is on at the next time.


+ We need to formalize the goals: 

  + the left lamp is off at time $2$
  + the right lamp is on at time $2$. 

+ We need to formalize [frame
conditions](https://en.wikipedia.org/wiki/Frame_problem) to avoid "weird"
behavior like lamps switching on/off by themselves:

  + If a lamp is on at a given time and the corresponding switch is _not_
  flipped, the light is still on at the ext time.

  + If a lamp is off at a given time and the corresponding switch is _not_
  flipped, the light is still off at the next time.

$\dagger$: We don't have $A\to B$ in our language, because we haven't dealt with
conditionals yet. Instead of $(A\land B)\to C$ you can, equivalently, write
$\neg (A\land B)\lor C$. This we'll discuss in more detail in the next chapter.

**Task**: Formalize the setup.

## c) Planning

The planning problem reduces to the question whether the set containing:

+ the setup
+ the rules and frame conditions
+ the goals

is satisfiable. A valuation that makes all of these true will tell the robot
which actions to carry out. If there's more than one, it can chose.

**Task**: Use the DPLL algorithm to find a course of action for the robot. 

## Solution {.solution #planningSolution}

**Task:** BNF, using "LL" to say the left lamp is on, "LS" to describe moving the left switch, etc.

$$ \langle{var}\rangle ::= LL1 \mid LL2 \mid LS1 \mid RL1 \mid RL2 \mid RS1 $$

$$ \langle{unop}\rangle ::= \neg $$

$$ \langle{binop}\rangle ::= \land \mid \lor $$

$$ \langle{fml}\rangle ::= \langle{unop}\rangle\langle{fml}\rangle \mid (\langle{fml}\rangle\langle{binop}\rangle\langle{fml}\rangle) $$

<br/>

**Task:** Formalization

Setup

+ $LL1$
+ $\neg RL1$

Goals

+ $\neg LL2$
+ $RL2$

Rules

+ $\neg(LL1\land LS1)\lor\neg LL2$
+ $\neg(\neg LL1\land LS1)\lor LL2$
+ $\neg(RL1\land RS1)\lor\neg RL2$
+ $\neg(\neg RL1\land RS1)\lor RL2$

Frames

+ $\neg(LL1\land\neg LS1)\lor LL2$
+ $\neg(\neg LL1\land\neg LS1)\lor\neg LL2$
+ $\neg(RL1\land\neg RS1)\lor RL2$
+ $\neg(\neg RL1\land\neg RS1)\lor\neg RL2$

<br/>

**Task:** DPLL

Convert the rules into CNF.

+ $\neg LL1\lor\neg LS1\lor\neg LL2$
+ $LL1\lor\neg LS1\lor LL2$
+ $\neg RL1\lor\neg RS1\lor\neg RL2$
+ $RL1\lor\neg RS1\lor RL2$

Convert the frames into CNF.

+ $\neg LL1\lor LS1\lor LL2$
+ $LL1\lor LS1\lor\neg LL2$
+ $\neg RL1\lor RS1\lor RL2$
+ $RL1\lor RS1\lor\neg RL2$

<br/>

Combine with the setup and goal formulas to get the following set of conditions.

$$\lbrace\Set{ LL1 } , \Set{ \neg RL1 } , \Set{ \neg LL2 } , \Set{ RL2 } ,$$

$$\Set{ \neg LL1 , \neg LS1 , \neg LL2 } , \Set{ LL1 , \neg LS1 , LL2 } , \Set{
\neg RL1 , \neg RS1 , \neg RL2 } ,$$
$$\Set{ RL1 , \neg RS1 , RL2 } ,$$

$$\Set{ \neg LL1 , LS1 , LL2 } , \Set{ LL1 , LS1 , \neg LL2 } , \Set{ \neg RL1 ,
RS1 , RL2 }, $$
$$\Set{ RL1 , RS1 , \neg RL2 }\rbrace$$

<br/>

By unit propogation, first on $LL1$ and then on $RL2$, we get:

$$\lbrace\Set{ \neg RL1 } , \Set{ \neg LL2 } , \Set{ \neg LS1 , \neg LL2 } , \Set{ \neg
RL1 , \neg RS1 } ,$$
$$\Set{ LS1 , LL2 } , \Set{ RL1 , RS1 }\rbrace$$

<br/>

By unit propogation, next on $\neg RL1$ and then on $\neg LL2$, we get:

$$\Set{\Set{ LS1 } , \Set{ RS1 }}$$

<br/>

By unit propogation on $LS1$ and $RS1$ we get a solution.

$\nu(LL1)=1, \nu(LL2)=0, \nu(RL1)=0,\nu(RL2)=1, \nu(LS1)=1, \nu(RS1)=1$

# Research {.homework}

Find out about [Disjunctive Normal
Forms (DNFs)](https://en.wikipedia.org/wiki/Disjunctive_normal_form).

## a)

Determine the algorithm for rewriting formulas equivalently in DNF.

_Hint_: The algorithm is _very_ similar to the rewriting into CNF, there's just
two minor differences.

## b) 

Does the DPLL algorithm work to solve the SAT problem for formulas in DNF?

# Discussion { .latex }

As a motivation for discussing DPLL, we've mentioned combinatorial explosion.
Doesn't DPLL suffer from the same problem? Transforming a formula into CNF can
be very resource intensive. Also: what if I cannot apply unit propagation and
pure literal elimination efficiently?

{{< latex >}}

% Just write your answer text in \LaTeX. It's a good exercise to write even
normal, non-formal text here.

{{< /latex >}}
