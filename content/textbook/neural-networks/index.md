---
title: Logic and neural networks
author: Johannes Korbmacher
weight: 120
locked: false
params:
  last_edited: "21/10/2026"
  id: txt-ann
---

# Logic and neural networks

{{< img src="/img/drawings/la_ai_ann.svg" class="rounded float-end inert-img img-fluid m-2" width="230px" alt="∀I with a network of connected artificial neurons." >}}
In {{< chapter_ref chapter="logic-and-ai" >}}Logic and AI{{< /chapter_ref >}},
we spoke about the role of artificial neural networks (ANNs) in
statistics-based AI. But it turns out there is actually a close connection
between ANNs and logic-based AI as well. This connection goes back to early
work on artificial neurons. [Warren
McCulloch](https://en.wikipedia.org/wiki/Warren_Sturgis_McCulloch) and [Walter
Pitts](https://en.wikipedia.org/wiki/Walter_Pitts) used propositional logic
to describe how networks of simple artificial neurons behave.

In this chapter, you'll learn about _perceptrons_, which were introduced by
[Frank Rosenblatt](https://en.wikipedia.org/wiki/Frank_Rosenblatt). These are
simple artificial neurons that we can connect into [feedforward neural
networks](https://en.wikipedia.org/wiki/Feedforward_neural_network). Just like
the relay circuits we studied in {{< chapter_ref chapter="boolean" >}}Boolean
algebra{{< /chapter_ref >}}, networks of perceptrons can implement Boolean
truth-functions. We can build neural versions of our logical gates and combine
them to implement more complex formulas or even entire
{{< term "knowledge-base" "knowledge bases" >}}.

Our Boolean networks will be simple examples of how ANNs can represent
knowledge. Much of modern AI uses them for the statistical approach we
studied in {{< chapter_ref chapter="probability" >}}Probability and inductive logic{{< /chapter_ref >}}.
There, we use conditional probabilities to make inductive inferences. In the
logic-based approach, we typically specify strict if–then rules and draw
deductive consequences from them. The statistical approach allows us to
learn more flexible patterns from examples.

For this, neural networks can also produce numerical outputs, including
probability estimates. We often model these estimates as continuous functions
of numerical inputs: a small change in the input gives a small change in the
estimate. The [universal approximation theorem](https://en.wikipedia.org/wiki/Universal_approximation_theorem)
tells us that suitable networks can approximate any continuous function as
closely as we want on a fixed input range such as $[0, 1]ⁿ$. This extends their use
well beyond Boolean truth-functions. To find suitable weights, we can train
a network on examples. We'll only sketch how this learning works here.

But learning also gives us a problem. When we hand-code a network to
implement a Boolean function, we know why we chose each weight. Learned
weights can be much more _intransparent_: knowing that training produced
them and that the network performs well doesn't tell us what each weight
represents. Some large networks have billions of these parameters. We can
then treat the network as a [black box](https://en.wikipedia.org/wiki/Black_box)
and investigate how it responds to different inputs. We'll finish by using
logical conditionals to describe what we find, again using small Boolean
networks to illustrate the idea.

{{< callout type="objectives" >}}
After studying this chapter, you will be able to:

- Calculate the output of a perceptron from its inputs, weights, and bias.
- Implement linearly separable Boolean functions with perceptrons.
- Explain how a hidden layer permits the representation of every Boolean truth-function.
- Represent a finite propositional knowledge base with a network of perceptrons.
- Distinguish constructing a logical network from learning its parameters.
- Extract conditional rules from the observed behavior of a Boolean network.
{{< /callout >}}

## Perceptrons {#perceptrons}

The brain is itself a network of [neurons](https://en.wikipedia.org/wiki/Neuron).
Each neuron receives signals from others, and whether it fires depends on
these signals and its own state. There are many
[mathematical models of this behavior](https://en.wikipedia.org/wiki/Biological_neuron_model).
We'll use a particularly simple one: multiply each input by the strength of
its connection, add the results, and check whether the sum exceeds a threshold.

{{< callout type="note" title="Modeling assumptions: artificial neurons" >}}
We represent signals and connection strengths by numbers and reduce firing
to a threshold test. This leaves out much of the biology, including the
timing of signals. It lets us study what networks of such units can compute.
{{< /callout >}}

An {{< term "artificial-neural-network" "artificial neural network" >}} consists
of connected computational units, or artificial neurons. Each unit calculates
an output, which can become an input to another unit. This gives the
calculation a direction. In principle, a signal could feed back into a unit
that contributed to it. In a
{{< term "feedforward-network" "feedforward network" >}}, we exclude this:
signals pass from the inputs towards the outputs without feeding back.
We'll start with a single unit.

<span id="weights-bias-and-activation"></span>
Write the numerical inputs as $x₁, …, xₙ$. Each input $xᵢ$ has an associated
{{< term "network-weight" "weight" >}} $wᵢ$, which we multiply it by. We also
add a so-called {{< term "network-bias" "bias" >}} $b$. This gives the
{{< term "weighted-input-sum" "weighted input sum" >}}, including the bias:

$$
z = w₁x₁ + … + wₙxₙ + b.
$$

The weights and bias can be positive, negative, or zero. A positive weight
makes increasing that input raise $z$; a negative weight makes it lower $z$.
An input with weight $0$ has no effect. Increasing the bias raises the score
for every input combination.

Finally, an {{< term "activation-function" "activation function" >}} turns this
score into the unit's output. For a Boolean output, we use a _step function_:

{{< callout type="definition" title="Step function" >}}
A {{< term "step-function" "step function" >}} is a function that is constant
on each of a sequence of intervals. Our Boolean step function is defined by

$$
step(z) = <span class="perceptron-cases"><svg class="perceptron-case-brace" viewBox="0 0 16 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M15 1 C7 1 7 5 7 12 V40 C7 47 6 49 1 50 C6 51 7 53 7 60 V88 C7 95 7 99 15 99" vector-effect="non-scaling-stroke"/></svg><span class="perceptron-case-rows"><span>1</span><span>if z > 0,</span><span>0</span><span>if z ≤ 0.</span></span></span>
$$
{{< /callout >}}

Step functions are called that because their graphs take steps. Ours has
one step, at $0$:

{{< logic-app name="perceptron" kind="step" >}}

At $z = 0$, we take the output to be $0$. Some presentations use $1$ at the
boundary; either convention works with a suitable choice of weights and bias.
We can now define our simple artificial neurons, called _perceptrons_.

{{< callout type="definition" title="Perceptron" >}}
A {{< term "perceptron" "perceptron" >}} with real weights $w₁, …, wₙ$ and
bias $b$ computes

$$
y = step(w₁x₁ + … + wₙxₙ + b).
$$
{{< /callout >}}

So, mathematically, a perceptron is a _function_. To see what it can do, we'll
use {{< term "boolean-value" "Boolean values" >}} as inputs and try to implement
our truth-functions. The output is $1$ when the weighted inputs add up to
more than $−b$. We call $−b$ the
{{< term "perceptron-threshold" "threshold" >}}. For example, with weights
$1, 1$ and bias $−1.5$, the two inputs have to add up to more than $1.5$:

{{< logic-app name="perceptron" kind="unit" title="Calculate a perceptron" >}}

Checking the inputs and outputs, we can see that this perceptron computes
conjunction. Different parameter values work, too: changing the bias to
$−1.25$ gives the same truth-table, as do weights $2, 2$ with bias $−3$.

## Implementations {#boolean-functions}

We've implemented $!!AND!!$ with a perceptron. What about the other
{{< term "boolean-function" "Boolean functions" >}}? We need to find weights
and a bias that produce the right output on every row of their truth-tables.

### Boolean gates {#conjunction-disjunction-and-negation}

For conjunction, give both inputs weight $1$ and use bias $−1.5$:

$$
x₁ !!AND!! x₂ = step(x₁ + x₂ − 1.5).
$$

The sum $x₁ + x₂$ is $2$ when both inputs are $1$, and at most $1$ otherwise.
Subtracting $1.5$ therefore leaves a positive score exactly in the row where
conjunction is true. For {{< term "disjunction" "disjunction" >}}, we want
either input to be enough. Keep the weights and change the bias to $−0.5$:

$$
x₁ !!OR!! x₂ = step(x₁ + x₂ − 0.5).
$$

For {{< term "negation" "negation" >}}, the output must fall when the input
rises. Use weight $−1$ and bias $0.5$:

$$
!!NOT!! x₁ = step(−x₁ + 0.5).
$$

In a diagram with two inputs, we can ignore $x₂$ by giving it weight $0$.
Changing that input then leaves the output unchanged.

{{< logic-app name="perceptron" kind="gates" title="Boolean gates as perceptrons" >}}

The {{< term "conditional" "material conditional" >}} can also be
implemented by one perceptron:

$$
x₁ !!IF!! x₂ = step(−x₁ + x₂ + 0.5).
$$

When $x₁ = 1$ and $x₂ = 0$, the score is $−0.5$; in the other three rows it is
positive. This computes the truth-value of the whole conditional, including
the rows where its antecedent is false. To infer its consequent using
{{< term "modus-ponens" "modus ponens" >}}, we would also need the antecedent
and the conditional as premises.

### Linear separability

We've now implemented our usual gates with single perceptrons. But can we
implement _every_ Boolean function this way? It turns out that we can't.
The standard counterexample is $!!XOR!!$, which gives $1$ exactly when its
inputs differ. To see why, we can look at our perceptrons geometrically.

Take conjunction again. We can draw each pair of inputs as a point in the
plane: $x₁$ gives its horizontal position, and $x₂$ its vertical position.
The point $(1, 1)$ should give output $1$; the other three points should give
$0$. A straight line separates these two groups:

{{< logic-app name="perceptron" kind="separating-line" >}}

The separating line is $x₁ + x₂ = 1.5$. Above and to the right of it, the
sum exceeds $1.5$, so our perceptron returns $1$. Below and to the left,
it returns $0$. This is the geometric idea behind _linear separability_:
we can put the inputs with output $1$ on one side of a straight line, and
those with output $0$ on the other.

More generally, the perceptron's
{{< term "decision-boundary" "decision boundary" >}} is the line

$$
w₁x₁ + w₂x₂ + b = 0.
$$

Positive scores lie on one side and negative scores on the other. On the
line itself, the score is $0$, so our step function returns $0$.

{{< callout type="definition" title="Linearly separable truth-function" >}}
A Boolean function $f : {0, 1}ⁿ → {0, 1}$ is
{{< term "linear-separability" "linearly separable" >}} iff there are real
weights $w₁, …, wₙ$ and a bias $b$ such that, for every Boolean input,

$$
f(x₁, …, xₙ) = 1 iff w₁x₁ + … + wₙxₙ + b > 0.
$$
{{< /callout >}}

For three inputs the boundary is a plane. In more dimensions, the
corresponding object is called a hyperplane. The definition also includes the
constant functions: zero weights and bias $1$ give constant $1$, while zero
weights and bias $−1$ give constant $0$.

The connection to perceptrons follows from their definition. A Boolean
truth-function can be implemented by a single perceptron exactly when it is
linearly separable. Conjunction, disjunction, negation, and the material
conditional all pass this test. There are truth-functions that don't.

<span id="hidden-layers"></span>
Consider {{< term "exclusive-or" "exclusive disjunction" >}}, or $!!XOR!!$.
Its output is $1$ exactly when its two inputs differ. The positive points
$0, 1$ and $1, 0$ lie at opposite corners of the square; the other two corners
have output $0$.

{{< logic-app name="perceptron" kind="separation" title="Try to separate XOR" >}}

No straight line separates the two positive corners from the two negative
corners. A line that gives the right answer on three rows must get the fourth
one wrong.

We can also see the problem in the required inequalities:

| Input | Required output | Requirement on the score |
| --- | --- | --- |
| $0, 0$ | $0$ | $b ≤ 0$ |
| $0, 1$ | $1$ | $w₂ + b > 0$ |
| $1, 0$ | $1$ | $w₁ + b > 0$ |
| $1, 1$ | $0$ | $w₁ + w₂ + b ≤ 0$ |

The middle two inequalities imply $w₁ + w₂ + 2b > 0$. Since $b ≤ 0$, this makes
$w₁ + w₂ + b > 0$ as well, contradicting the last requirement. The failure is a
limit of what one perceptron can represent. No choice of its parameters will
compute XOR on all four rows.

### Hidden layers {#adding-a-hidden-layer}

Does this mean we can't implement XOR with a neural network? Of course not!
We know that we can express it by combining $!!NOT!!$, $!!AND!!$, and $!!OR!!$:

$$
x₁ !!XOR!! x₂ = (x₁ !!OR!! x₂) !!AND!! !!NOT!!(x₁ !!AND!! x₂).
$$

We can combine perceptrons in the same way: compute the disjunction and
conjunction in parallel, then use their outputs
as inputs to another perceptron. The intermediate values are

$$
h₁ = step(x₁ + x₂ − 0.5),
h₂ = step(x₁ + x₂ − 1.5).
$$

The output should be $1$ when $h₁ = 1$ and $h₂ = 0$. We can implement that
condition with weights $1, −1$ and bias $−0.5$:

$$
y = step(h₁ − h₂ − 0.5).
$$

Mathematically, this is [function composition](https://en.wikipedia.org/wiki/Function_composition):
we use the outputs of some functions as inputs to another. The units
calculating $h₁$ and $h₂$ form a
{{< term "hidden-layer" "hidden layer" >}}. Their outputs are intermediate
values, passed to a later unit in the network.

{{< callout type="definition" title="Two-layer perceptron network" >}}
A {{< term "two-layer-perceptron-network" "two-layer perceptron network" >}}
is a feedforward network with one hidden layer of perceptrons and an output
layer of perceptrons. The inputs themselves are not counted as a computational
layer.
{{< /callout >}}

{{< logic-app name="perceptron" kind="layers" title="XOR with a hidden layer" >}}

The resulting network computes XOR using three perceptrons in two layers.

### Universal representation {#boolean-universality}

So, a hidden layer lets us implement XOR. What about the other Boolean
functions? Recall from
{{< chapter_ref chapter="sat" id="normal-forms" >}}Boolean SAT{{< /chapter_ref >}}
that we can describe any truth-table in
{{< term "disjunctive-normal-form" "disjunctive normal form" >}}: one conjunction
for each row with output $1$, joined by disjunctions.

We can read a network off this description. Each hidden unit checks one
conjunction, returning $1$ just on that row. The output unit computes OR:
it returns $1$ if any hidden unit returns $1$. So the network accepts exactly
the rows that our truth-table marks as true. This gives us the following
[mathematical theorem](https://en.wikipedia.org/wiki/Theorem):

{{< callout type="theorem" title="Universal representation of Boolean truth-functions" >}}
For every positive integer $n$ and every function $f : {0, 1}ⁿ → {0, 1}$, there
is a feedforward network with one hidden layer of step-activation perceptrons
and one output perceptron that computes $f$ exactly on every Boolean input.
At most $2ⁿ$ hidden units suffice.
{{< /callout >}}

Here the network computes the function exactly. We'll later encounter a
related theorem about approximating continuous functions.

<span id="a-perceptron-for-one-row"></span>
Take the row $1, 0, 1$. It corresponds to the conjunction $P ∧ ¬Q ∧ R$.
Give a positive {{< term "literal" "literal" >}} weight $1$ and a negated
literal weight $−1$. Here that gives

$$
h = step(x₁ − x₂ + x₃ − 1.5).
$$

At $1, 0, 1$, the score is $0.5$. Changing any one input away from that row
lowers the score by $1$, so the unit returns $0$ on every other row.
In general, if a target row contains $k$ ones, use weight $1$ at those
positions, weight $−1$ at its zero positions, and bias $0.5 − k$.

The output unit takes their disjunction, with weight $1$ for each hidden
output and bias $−0.5$. If there are no positive rows, the negative bias
alone keeps the output at $0$.

{{< logic-app name="perceptron" kind="table" title="Build a network from a truth-table" >}}

For XOR, this construction uses units for the rows $0, 1$ and $1, 0$.
It computes the same function as our earlier network, with different
intermediate calculations.

<span id="expressiveness-and-size"></span>
A truth-table has $2ⁿ$ rows, so this construction can produce a large network.
Often there are simpler implementations: constant $1$, for example, needs
only a single unit with positive bias. We use that shortcut for the constant
truth-functions above. Additional layers also let us reuse
intermediate calculations, just as we did with circuits.

### Knowledge bases {#knowledge-bases}

Every formula over finitely many propositional variables determines a
truth-function. We can therefore implement its truth conditions with
perceptrons. For a finite
{{< term "knowledge-base" "knowledge base" >}} $KB = {A₁, …, Aₘ}$, we implement
the conjunction $A₁ ∧ … ∧ Aₘ$.
The network returns $1$ exactly on the
{{< term "boolean-model" "Boolean models" >}} of $KB$.

Suppose we want to represent two ways in which a garden gets wet. Let $R$
mean "it rains", $S$ mean "the sprinkler is on", and $W$ mean "the ground
is wet". Our rules are

$$
KB = {R → W, S → W}.
$$

Each rule says that its condition is sufficient for wet ground. To represent
the whole knowledge base, we take their conjunction. The two rules have the
same consequent, so we can combine them into one conditional:

$$
(R → W) ∧ (S → W) ≡ (R ∨ S) → W.
$$

In words: if it rains _or_ the sprinkler is on, the ground is wet. This
conditional is false exactly when at least one of $R$ and $S$ is true but
$W$ is false. We can implement it with weights $−1, −1, 2$ and bias $0.5$:

$$
y = step(−x<sub>R</sub> − x<sub>S</sub> + 2x<sub>W</sub> + 0.5).
$$

If $W$ is true, its weight makes the score positive even when both other
inputs are true. If $W$ is false, either $R$ or $S$ makes the score negative.
When all three are false, the score is positive: neither rule is violated.

{{< logic-app name="perceptron" kind="kb" title="A network for a knowledge base" >}}

The inputs describe a complete {{< term "valuation" "valuation" >}}: a
possible scenario. The network checks whether that scenario satisfies both
rules. This is {{< term "model-checking" "model checking" >}}.

For {{< term "consequence" "logical consequence" >}}, we compare scenarios.
Our rules alone don't entail $W$: dry ground with no rain and no sprinkler
is a {{< term "countermodel" "countermodel" >}}. If we add $R ∨ S$ as a fact,
every remaining model has wet ground, so

$$
KB, R ∨ S ⊨ W.
$$

Representing premises in a network doesn't make the search for countermodels
efficient in general. We may still have to examine every input combination.

## Learning {#learning}

So far, we've chosen every weight and bias from a logical description of
what the network should do. But we can also _learn_ these values from examples.
In {{< term "supervised-learning" "supervised learning" >}}, each training
example pairs an input with a target output. For a spam classifier, these
could be email markers paired with labels supplied by people. Training
adjusts the network's {{< term "network-parameter" "parameters" >}}, including
its weights and biases, to reduce mistakes on these examples.

<span id="the-perceptron-learning-rule"></span>
For a single perceptron, the idea is simple. If the output is too low, we
increase the weights of active Boolean inputs and raise the bias. If it's
too high, we decrease them. A {{< term "learning-rate" "learning rate" >}}
controls the size of these changes. Repeating this process can teach a
perceptron to separate the positive and negative examples, provided they
are linearly separable. No amount of training will make a single perceptron
compute XOR.

Why put so much effort into learning? In his essay
[The Bitter Lesson (2019)](https://en.wikipedia.org/wiki/Bitter_lesson),
Richard Sutton argues that AI has repeatedly advanced through general methods
of search and learning that can use increasing amounts of computation.
Attempts to build in our own understanding of a task have often been overtaken
by these methods. The lesson is "bitter" because researchers had invested so
much in that understanding. For our purposes, this raises a question we'll
return to: how can we understand what a network has learned?

<span id="real-valued-networks"></span>
For numerical outputs, we can replace the step function with another
activation. A common choice is the
{{< term "sigmoid-function" "sigmoid function" >}}. Its graph has an S-shape,
rising gradually from values close to $0$ to values close to $1$:

{{< logic-app name="perceptron" kind="sigmoid" >}}

At $z = 0$, its output is $0.5$. Negative inputs give lower outputs, and
positive inputs give higher ones. The function approaches $0$ and $1$
without reaching them. Its formula is

$$
sigmoid(z) = {{< frac "1" "1 + e⁻ᶻ" >}}.
$$

Here $e$ is a mathematical constant, approximately $2.718$, and $e⁻ᶻ$ uses the
[exponential function](https://en.wikipedia.org/wiki/Exponential_function).
As $z$ increases, $e⁻ᶻ$ decreases, so the fraction gets closer to $1$.
The gradual change in output lets us represent intermediate values,
including probability estimates.

For example, suppose we want to estimate the probability of rain from cloud
cover $x$, where $0$ means a clear sky and $1$ means fully overcast. Take the
five marked probabilities below as invented examples. We write $Pr(RAIN ∣ x)$
for the probability of rain given this cloud cover. A neuron with a sigmoid
activation can approximate these probabilities:

{{< logic-app name="perceptron" kind="probability" title="Estimating rain probability" >}}

With weight $5$ and bias $−2.5$, cloud cover $0.75$ gives an estimate of about
$0.777$, close to the example probability $0.775$. Changing the weight and bias
changes the fit. A sigmoid output is always between $0$ and $1$, but that alone
doesn't make it an accurate probability estimate. Nor can a single sigmoid
neuron fit every possible pattern of probabilities.

How much can networks with numerical outputs represent? We have a result
similar to our theorem about Boolean functions, called the
{{< term "universal-approximation" "universal approximation theorem" >}}.
We'll only state the idea here:

{{< callout type="theorem" title="Universal approximation (informally)" >}}
A neural network with suitable activation functions and enough units can
approximate any continuous function as closely as we want, when each input
is restricted to a fixed interval including its endpoints.
{{< /callout >}}

To approximate a function is to give outputs close to its outputs. Suppose
we want to estimate a probability from some numerical inputs. If that
probability varies continuously with the inputs, we can make the network's
estimates differ from it by less than $0.01$ throughout the chosen range.
We could ask for a smaller error, too, though we may need a larger network.

The theorem tells us that suitable parameters exist. Finding them is a
learning problem, and we also need to check
{{< term "generalization" "generalization" >}}: how well the trained network
performs on new examples. These are topics for machine learning. Our question
here is how to describe the resulting network's behavior using logic.

## Interpretability {#interpretability}

So far, we have started with logical conditions and constructed networks
that implement them. Suppose instead that we have a network whose weights
we don't inspect. We can submit inputs and observe outputs. Can we recover
a logical description of its behavior?

{{< callout type="definition" title="Boolean black box" >}}
A {{< term "boolean-black-box" "Boolean black box" >}} is a system treated
as a fixed function $f : {0, 1}ⁿ → {0, 1}$ whose behavior we investigate through
input-output queries, without using its internal structure.
{{< /callout >}}

For two inputs, there are only four possible queries. Each observation fills
one row of a {{< term "truth-table" "truth-table" >}}. Once all four rows
are known, we know the function on its entire Boolean input domain. This
works for a single perceptron and for a network of many units.

<span id="reading-conditionals-off-a-truth-table"></span>
Let $P$ and $Q$ describe the two input bits, and let $Y$ mean that the output
is $1$. If input $1, 0$ gives output $1$, we can record

$$
(P ∧ ¬Q) → Y.
$$

If input $1, 1$ gives output $0$, we record

$$
(P ∧ Q) → ¬Y.
$$

Each antecedent describes the complete input row. We can state the
corresponding rule after one query because the black box is assumed to be
fixed and deterministic. An untested row remains unknown. In particular,
the first observation alone doesn't justify $P → Y$: it tells us nothing
about input $1, 1$.

{{< logic-app name="perceptron" kind="blackbox" title="Extract rules from a black box" >}}

Once we have tested all four inputs, we can combine the positive rows into
a single condition:

$$
Y ↔ ((¬P ∧ Q) ∨ (P ∧ ¬Q)).
$$

The black box computes XOR. This biconditional tells us exactly when it
returns $1$. It leaves open how the network computes that answer: we've
already built two different networks with this truth-table.

<div id="rule-extraction-and-explainable-ai"></div>

{{< callout type="definition" title="Rule extraction" >}}
{{< term "rule-extraction" "Rule extraction" >}} is the derivation of
symbolic rules describing a model's input-output behavior, either exactly
on a specified domain or approximately under a stated evaluation criterion.
{{< /callout >}}

The rules can give us an interpretable account of a network's decisions.
For example, a rule using named email markers lets us check whether the
classifier requires both an unknown sender and an urgent subject, or only
one of them. That account depends on what the inputs mean. A formula over
thousands of unnamed pixel positions may be exact and still be difficult
for a person to use.

Rule extraction is one approach to {{< term "xai" "explainable AI" >}}.
For example, we can use a network's answers to construct a decision tree
that approximates its behavior. A path through that tree can be read as a
conditional rule. The resulting tree is a
{{< term "surrogate-model" "surrogate model" >}}: a separate model used to
describe the original network.

With numerical inputs or too many Boolean inputs to test them all, extraction
methods often work with a selection of examples. We then need to assess
{{< term "explanation-fidelity" "fidelity" >}}: how well the extracted rules
agree with the network on the inputs we're interested in.

An extracted rule can faithfully reproduce a classifier's mistakes, so we
still have to check its predictions against the world. And the number of
queries soon becomes impractical: with $n$ Boolean inputs, there are $2ⁿ$
possible rows. Our small networks let us see the idea in full. We started
with formulas and built networks that implement them; by querying a network,
we can also work back to a logical description of its behavior.

## Further readings {.readings .nocount}

- Russell and Norvig, *Artificial Intelligence: A Modern Approach*, 4th edition, chapter 19 for perceptrons and their learning rule; chapter 21 for neural networks, activation functions, and training.
