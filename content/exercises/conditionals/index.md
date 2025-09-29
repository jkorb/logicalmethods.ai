---
title: Logical conditionals
author: Johannes Korbmacher
locked: false
weight: 60
params: 
  id: exc-if
  math: true
---

# Boolean conditional

We've interpreted the conditional symbol {{< to >}} using the Booleans !!NOT!!
and !!OR!!. But we could also have directly defined a Boolean function !!IF!!
with the following truth-table:

{{< img src="img/if_table.png" class="mx-auto d-block rounded inert-img img-fluid" width="200px">}}

Note that ``X !!IF!! Y`` is the conditional from the value of `X` to the value
of `Y` to make the reading of the Boolean align with its natural reading.

Find a representation of this Boolean function using only !!NOT!! and !!AND!!. That is find a Boolean expression `exp` in the two variables `X` and `Y`, which contains only the Boolean functions !!NOT!! and !!AND!!, and which meets the specification that for all values of `X` and `Y`, we have:

```
exp = X !!IF!! Y.
```

Verify your work! That is don't just provide an expression, but show that for all values of `X` and `Y` the above equation holds.

# Equivalence

Remember the truth-table for $XNOR$ from the last exercises set:

{{< img src="img/xnor_table.png" class="mx-auto d-block rounded inert-img img-fluid" width="200px">}}

Find a formula representation of this Boolean truth-function using only the
propositional variables $p$ and $q$ and the connectives ${{< land >}}$ and ${{<
to >}}$! That is, find such formula satisfying these constraints, which meets
the assignments $v$ of truth-values to $p$ and $q$, we have:

$$v(A) = v(p) !!XNOR!! v(q).$$

Verify your work! That is don't just provide a
formula, but show that for each assignment the above
equation holds.

# Conditional inferences


{{< img src="img/sun.png" class="rounded  float-start inert-img img-fluid m-2" width="100px" >}} 

Check the following conditional inferences for deductive validity using
`SAT`-solving. You can use truth-tables or resolution, as you prefer.

1. $(RAIN{{< to >}}WIND), {{< neg >}}RAIN {{< therefore >}} {{< neg >}}WIND$ 

2. $(RAIN{{< to >}}WIND)  {{< therefore >}}({{< neg >}}WIND {{< to >}} {{< neg >}}RAIN)$

3. $({{< neg >}} RAIN{{< to >}} RAIN)  {{< therefore >}}RAIN$

4. $(RAIN {{< to >}}( SUN {{< to >}} RAINBOW)) {{< therefore >}} ((RAIN {{< land >}} SUN) {{< to >}} RAINBOW)$

5. ${{< neg >}} (RAIN {{< to >}} WIND) {{< therefore >}} RAIN $

{{< img src="img/rain_wind.png" class="rounded  float-end inert-img img-fluid m-2" width="100px" >}} 
Document your work carefully, that is explain each step you're carrying out,
and why the work you did shows that the inference in question is valid or invalid.

# Valid inference and conditionals

There's a deep connection between deductively valid inference in Boolean logic
and material conditionals, which is given by the following important
equivalence:

$$P₁, P₂, … {{< vDash >}} C&emsp; if and only if &emsp; <span class="dark-red shanns">not-SAT</span>{{{< neg >}}((P₁{{< land >}} P₂ {{< land >}}… ){{< to >}} C)}$$

1. A logical formula $A$ is called a **logical truth** iff for all assignments $v$ of truth-values to its propositional variables, the formula is true, i.e. $v(A) = 1$. Verify that the simple formula $$(RAIN {{< lor >}} {{< neg >}}RAIN)$$ is a logical truth in this sense.

2. Rephrase the right-hand side of above equivalence in terms of the logical truth rather than unsatisfiability.

3. Give an argument that the above equivalence is true. 

    _Hint_: To do so, you need to use the general form of the reduction of valid inference to unsatisfiability, which we've discussed in the lecture $$P₁, P₂, … {{< vDash >}} C&emsp; if and only if &emsp; <span class="dark-red shanns">not-SAT</span> { P₁, P₂, … , {{< neg >}}C }$$ Think about what the latter condition means for the truth of the corresponding conditional.

# Chaining

Consider the following {{< abbr title="knowledge base">}}KB{{< /abbr>}}:

- $RAIN {{< to >}} CLOUDS$
- $(CLOUDS {{< land >}} SNOW) {{< to >}} STORM$
- $RAIN {{< to >}} PUDDLES$
- $PUDDLES {{< to >}} HUMID$
- $HUMID {{< to >}} CLOUDS$
- $SUN {{< to >}} DRY$
- $(WIND {{< land >}} SNOW) {{< to >}} DRIFTING$

We add to this {{< abbr title="knowledge base">}}KB{{< /abbr>}} the following two facts:

$$RAIN, SNOW$$

1. Run the forward-chaining and the backward-chaining algorithm to show that we can derive $STORM$ from the KB. That is, describe the steps you'd take for each algorithm one-by-one, and why at some point you hit the termination condition.

2. Use the example to illustrate how forward-chaining can find shorter derivations than backward-chaining. 

3. Use both forward and backward-chaining to show that we can't derive $DRIFTING$ from the KB using the facts. Does one algorithm outperform the other?

# Planning

We've made things a more difficult for {{< logo >}}&ThinSpace; by introducing a third block into the puzzle:

{{< img src="img/planning_3.png" class="mx-auto d-block rounded inert-img img-fluid" width="400px">}}

Adjust our planning solution to accommodate the more complicated setup. That is:

1. Determine how we need to adjust the language to accommodate the third block.

2. Which rules do we need to add to our a KB to accommodate the third block.

3. Represent the initial setup state and the goal state in the language.

4. Find a model that satisfies the KB, as well as the setup and goal state. Then read off a course o action. You don't need to do this formally—using resolution or chaining—but just find such a model using _human_ intelligence.

# Discussion

Check out the [Wason selection
task](https://en.wikipedia.org/wiki/Wason_selection_task) on Wikipedia.

Some researchers have argued that the experiment shows that people don't reason with
the material conditional in this case. Do you agree? Why?
