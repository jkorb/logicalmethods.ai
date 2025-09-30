---
title: Boolean satisfiability
author: Johannes Korbmacher
locked: false
weight: 50
params: 
  id: exc-sat
  math: true
---

# Truth-function representations {.solved}

We looked at how to read off a Boolean expression from a truth-table. Apply the
method to the following:

<div class="text-center">

| | | |
| - | - | -|
|{{< img src="img/and_table.png" class="rounded inert-img img-fluid" width="300px">}} | | {{< img src="img/xor_table.png" class="rounded inert-img img-fluid" width="300px">}}|
| | {{< img src="img/xnor_table.png" class="mx-auto d-block rounded inert-img img-fluid" width="300px">}} | |

</div>

Inspect the resulting Boolean expressions. Can you simplify them while
remaining in DNF?

## Solution {.solution #truth-function-representationsSolution}

1. !!AND!! gives us `X !!AND!! Y`, which cannot be simplified further.

2. !!XOR!! gives us `(X !!AND!! (!!NOT!! Y)) !!OR!! ((!!NOT!! X) !!AND!! Y)`, which cannot be simplified further.

2. !!XNOR!! gives us `((!!NOT!! X) !!AND!! (!!NOT!! Y)) !!OR!! (X !!AND!! Y)`, which cannot be simplified further.

# Circuit representations {.solved}

We've observed that our relay circuits are essentially build up from relay
implementations of !!NOT!! ($default "on"$) and !!AND!! ($default "off"$). Use
the idea to represent the following circuits as Boolean expressions:

|   | |  |
| - | - | - |
| {{< img src="img/or_impl.png" class="rounded inert-img img-fluid" width="300px">}} | &emsp;&emsp;&emsp; |{{< img src="img/xor_impl.png" class="rounded inert-img img-fluid" width="400px">}} |

Are the resulting formulas in normal form (CNF or DNF)?

## Solution {.solution #circuit-representationsSolution}

1. The first circuit consist of two !!NOT!!'s which are combined with an !!AND!! and the output fed into a !!NOT!!. That is: 

    ```
    !!NOT!!((!!NOT!! X) !!AND!! (!!NOT!! Y))
    ```

    This is an implementation of !!OR!!. In fact, the representation is neither in DNF nor CNF and if you transform it, you end up with 

    ```
    X !!OR!! Y
    ```

    after an application of the $De Morgan Identities$ and the law of $Double Negation$. This is both the DNF and CNF of the representation.

2. The second circuit is a bit more complex. On the right-hand side, we feed both inputs into an !!AND!! and apply !!NOT!! to the output, 

    ```
    !!NOT!!(X !!AND!! Y)
    ```

    The right-hand side is actually the first, circuit, which we know corresponds to 

    ```
    !!NOT!!((!!NOT!! X) !!AND!! (!!NOT!! Y))
    ```

    The outputs of these two circuits are fed into an !!AND!!, which gives us the final representation:

    ```
    (!!NOT!!(X !!AND!! Y)) !!AND!! (!!NOT!!((!!NOT!! X) !!AND!! (!!NOT!! Y)))
    ```

    This formula can be simplified in various ways. One route is via the observation that the first circuit boils down to `X !!OR!! Y`. This means our circuit is just:

    ```
    (!!NOT!!(X !!AND!! Y)) !!AND!! (X !!OR!! Y)
    ```

    Maybe you can already see that this is the !!XOR!! function.

    Applying $De Morgan$, we can transform this into the CNF:

    ```
    ((!!NOT!! X) !!OR!! (!!NOT!! Y)) !!AND!! (X !!OR!! Y)
    ```

    To bring it into DNF, we need to apply $Distributivity$ a bunch of times, but eventually, we can obtain:

    ```
    (X !!AND!! (!!NOT!! Y)) !!OR!! ((!!NOT!! X) !!AND!! Y)
    ```


# Equivalence {.solved}

The !!XNOR!! function is special: it expresses that `X` and `Y` have the same value—just check the table! 

1. Find the simplest representation of !!XNOR!! in terms of !!NOT!! and !!XOR!!. 

    _Hint_: Inspect !!XNOR!! and !!XOR!!'s function tables, how are they related?

2. Use this implementation to reduce the verification problem for a relay circuit from two `SAT` problems for different sets (as in the text) to a single `SAT` problem for a single expression. 

    _Hint_: Think about when `X !!XNOR!! Y` is true and when `X !!XOR!! Y` is true.

## Solution {.solution #equivalenceSolution}

1. The simplest representation is 

    ```
    !!NOT!!(X !!XOR!! Y),```

    that is !!XNOR!! is the negation of !!XOR!!. You can see this in the table by observing that everywhere the table of !!XOR!! has a `1`, the table for !!XNOR!! has a `0`, and everywhere !!XOR!! is `0`, !!XNOR!! is `1`. The values are just switched, using !!NOT!!.

    Note that this formula is neither in CNF nor DNF, of course.

2. Suppose we have two Boolean expressions `A` and `B`, which may be
   complex and use various variables, Boolean operations, etc. We can
then check whether `A` and `B` are equivalent by checking whether 

    ```
    A !!XOR!! B
    ``` 

    is `SAT`. Because by the function table for !!XOR!!, 

    ```
    A !!XOR!! B = 1
    ```
  
    just in case `A = 1` and `B = 0` or `A = 0` and `B = 1`, that is, just in case the values of `A` and `B` are different.

# Truth tables {.solved}

Use the truth-table method to check whether the following claims are true:

1. The set of expressions `((!!NOT!! X) !!OR!! (!!NOT!! Y))` and `(X !!AND!! Y)` is `SAT`.

2. The set formulas ${ {{< neg >}} RAIN, (RAIN {{< lor >}} ({{< neg >}}WIND {{< land >}} RAIN) ) }$ is `SAT`.

## Solution {.solution #truth-tablesSolution}

1. Here is the complete truth-table:

    {{< img src="img/sat_table.png" class="mx-auto d-block rounded inert-img img-fluid" width="400px">}}

    Since there is no row where both expressions have the value `1`, the two formulas are not jointly satisfiable.

2. Here's the complete truth-table:

    {{< img src="img/sat_table_2.png" class="mx-auto d-block rounded inert-img img-fluid" width="400px">}}

    Again, since there is no row where both expressions have the value `1`, the two formulas are not jointly satisfiable.


# Mystery formula {.solved}

Determine the following $"mystery formula"$ form its truth-table:

{{< img src="img/mystery_table.png" class="mx-auto d-block rounded inert-img img-fluid" width="400px">}}

What's the shortest representation of the formula you can find?


## Solution {#mystery-formulaSolution .solution}

The "brute force" DNF method yields the following monstrosity:

$$({{< neg >}} SUN {{< land >}} {{< neg >}} RAIN  {{< land >}} {{< neg >}} WIND ) {{< lor >}} ({{< neg >}} SUN {{< land >}} RAIN  {{< land >}} {{< neg >}} WIND ) {{< lor >}} ...$$
$$... (SUN {{< land >}} {{< neg >}} RAIN  {{< land >}} {{< neg >}} WIND ) {{< lor >}} (SUN {{< land >}} {{< neg >}} RAIN  {{< land >}}  WIND ) {{< lor >}} ...$$
$$... (SUN {{< land >}} RAIN  {{< land >}} {{< neg >}} WIND ) {{< lor >}} (SUN {{< land >}}  RAIN  {{< land >}}  WIND )$$

But if you analyze the truth-table a bit more carefully, then you can notice that in each case where $SUN$ is true, the entire formula is true. And the only other cases where $SUN$ is false and the formula is true are the two cases where $WIND$ is false.

This means that we can equivalently write the formula as:

$$SUN {{< lor >}} {{< neg >}}WIND$$

There are various algorithms for doing these kind of simplifications, an important one of them is to use the [Karnaugh map](https://en.wikipedia.org/wiki/Karnaugh_map), which is closely related to the [Quine-McCluskey algorithm](https://en.wikipedia.org/wiki/Quine%E2%80%93McCluskey_algorithm).

# Normal Forms {.solved}

Transform the following formulas into DNF and CNF:

  1. $(RAIN{{< land >}} {{< neg >}}(SUN{{< lor >}}{{< neg >}}RAIN))$
  1. $({{< neg >}}RAIN{{< lor >}} {{< neg >}}({{< neg >}} RAIN{{< lor >}}WIND))$
  1. $(RAIN{{< land >}} {{< neg >}}SUN){{< lor >}} ({{< neg >}}RAIN{{< land >}} {{< neg >}}SUN)$

## Solution {.solution #normal-formsSolution}

1. If you apply the rewrite rule $r₃$ to this formula, you obtain $$RAIN {{< land >}} {{< neg >}}SUN {{< land >}} {{<neg>}}{{<neg>}}RAIN,$$ which after one application of $r₁$ becomes $$RAIN {{< land >}} {{< neg >}}SUN {{< land >}} RAIN.$$ This is both the DNF and the CNF of the formula.

2. Here, applying $r₃$ yields: $${{< neg >}}RAIN{{< lor >}} ({{< neg >}}{{< neg >}} RAIN{{< land >}} {{< neg >}}WIND).$$ An application of $r₁$ gives $${{< neg >}}RAIN{{< lor >}} (RAIN{{< land >}} {{< neg >}}WIND).$$ This is the DNF of the formula. To transform it into CNF, we need to apply $r₄$ to obtain: 
$$({{< neg >}}RAIN{{< lor >}} RAIN){{< land >}} ({{< neg >}}RAIN{{< lor >}} {{< neg >}}WIND).$$ 

3. This formula is in DNF. We need to apply distribution to get it into CNF. First, with $r₄$ we get: $$((RAIN{{< land >}} {{< neg >}}SUN){{< lor >}} {{< neg >}}RAIN) {{< land >}} ((RAIN{{< land >}} {{< neg >}}SUN){{< lor >}}{{< neg >}}SUN).$$ Then, applying $r₄'$ twice, we get:$$(RAIN{{< lor >}} {{< neg >}}RAIN){{< land >}}  ({{< neg >}}SUN{{< lor >}} {{< neg >}}RAIN) {{< land >}} (RAIN{{< lor >}}{{< neg >}}SUN) {{< land >}} ({{< neg >}}SUN{{< land >}}{{< neg >}}SUN),$$ which is the formula's CNF.



# Resolution {.solved}

Use the resolution method to determine whether the following formulas are
satisfiable:

1. $(SUN{{< lor >}} RAIN{{< lor >}} {{< neg >}} WIND){{< land >}} (SUN{{< lor >}}{{< neg >}} RAIN{{< lor >}} {{< neg >}} WIND)$
2. ${{< neg >}}(SUN{{< land >}} RAIN){{< lor >}} (WIND{{< land >}} {{< neg >}} WIND)$
3. $(SUN{{< lor >}} RAIN){{< land >}} (SUN{{< lor >}} {{< neg >}} RAIN){{< land >}} ({{< neg >}} SUN{{< lor >}} RAIN){{< land >}} ({{< neg >}} SUN{{< lor >}} {{< neg >}} RAIN)$
4. $(SUN{{< land >}} (SUN{{< lor >}} RAIN)){{< land >}} (RAIN{{< land >}} (RAIN{{< lor >}} SUN))$

## Solution {.solution #resolutionSolution}

1. The formula is already in CNF, so we can directly transform it into sets to obtain: $${ SUN, RAIN, {{< neg >}}WIND }&emsp;{  SUN, {{< neg>}} RAIN, {{< neg >}} WIND }.$$ There is one possible application of resolution (eliminating $RAIN$ and ${{< neg >}}RAIN$), which yields $${ SUN, {{< neg >}}WIND }.$$ Since there are no more resolutions possible and we haven't derived ${ }$, we conclude that the formula is satisfiable. E.g. by setting $v(SUN) = 1$.

2. This formula, we need to transform into CNF first. Applying $r₂$, we obtain: $$({{< neg >}}SUN{{< lor >}} {{< neg >}}RAIN) {{< lor >}} (WIND{{< land >}} {{< neg >}} WIND).$$ An application of $r₄$ gives us from that: $$({{< neg >}}SUN{{< lor >}} {{< neg >}}RAIN {{< lor >}} WIND){{< land >}} ({{< neg >}}SUN{{< lor >}} {{< neg >}}RAIN {{< lor >}}{{< neg >}} WIND).$$ Now, we can translate to sets to get: $${{{< neg >}}SUN, {{< neg >}}RAIN , WIND} &emsp; { {{< neg >}}SUN, {{< neg >}}RAIN, {{< neg >}} WIND}.$$ But just one resolution is possible, which eliminates $WIND$ and ${{< neg >}}WIND$ to give us: $${{{< neg >}}SUN, {{< neg >}}RAIN }.$$ Since there are no more resolutions possible and we haven't derived ${ }$, we conclude that the formula is satisfiable. E.g. by setting $v(SUN) = 0$.

3. This formula is in CNF, so we directly go to the sets: $${ SUN, RAIN }&emsp; {SUN, {{< neg >}} RAIN}&emsp; {{{< neg >}} SUN, RAIN}&emsp; {{{< neg >}} SUN, {{< neg >}} RAIN}.$$ The following is a derivation of ${ }$ from these using resolution:

    {{< img src="img/sun_resolution.png" class="mx-auto d-block rounded inert-img img-fluid" width="400px">}}

    Note that we needed to use ${ SUN }$, which was the result of the first resolution _again_ in the last resolution. This is why it's important to _recursively_ resolve, meaning adding the results of the resolutions to our base and keep resolving until we can't anymore.

    The conclusion is that the formula is unsatisfiable.

4. This formula is in CNF, so we can directly go to the sets: $${ SUN }&emsp; { SUN, RAIN }&emsp; { RAIN }&emsp; { RAIN, SUN }$$ But since there are no ${{< neg >}}$'s in this, we can not resolve and conclude that the formula is satisfiable, simply by setting $v(SUN) = v(RAIN) = 1$.

# Valid inference {.solved}

Determine whether the following inferences are valid using both the truth-table and the resolution method. Which one is faster?

1. ${{< neg >}}RAIN{{< therefore >}}RAIN{{< lor >}} ({{< neg >}}RAIN{{< land >}}
SUN)$

2. $RAIN{{< lor >}} (RAIN{{< land >}} WIND){{< therefore >}}
RAIN{{< lor >}}SUN$

## Solution {.solution #valid-inferenceSolution}

1. To check whether the inference is valid, we need to check whether $$`SAT` {{{< neg >}}RAIN, {{< neg >}}(RAIN{{< lor >}} ({{< neg >}}RAIN{{< land >}} SUN))}.$$ Here's how the truth-table method shows that the set is `SAT`:

    {{< img src="img/tt_counter.png" class="mx-auto d-block rounded inert-img img-fluid" width="400px">}}

    The red row shows that there's a model where the premise is true and the
    conclusion false, thus the inference is invalid.

    To apply the resolution method, we first need to bring both formulas into CNF. ${{< neg >}}RAIN$ already is in CNF, so we focus on ${{< neg >}}(RAIN{{< lor >}} ({{< neg >}}RAIN{{< land >}} SUN))$ and apply $r₃$ to obtain:
    $${{< neg >}}RAIN{{< land >}} {{< neg >}}({{< neg >}}RAIN{{< land >}} SUN)).$$ A following application of $r₂$ yields: $${{< neg >}}RAIN{{< land >}} ({{< neg >}}{{< neg >}}RAIN{{< lor >}} {{< neg >}}SUN)).$$ Finally, applying $r₁$ gives us the CNF: $${{< neg >}}RAIN{{< land >}} (RAIN{{< lor >}} {{< neg >}}SUN)).$$

    We obtain the sets: $${ {{< neg >}}RAIN }&emsp;{ RAIN, {{< neg >}}SUN }$$
    Note that ${ {{< neg >}}RAIN }$ is already there. One application of
    resolution eliminates $RAIN$ and ${{< neg >}} RAIN$, giving us the set
    ${{{< neg >}}SUN}$. Since we cannot resolve any further, we conclude the
    set is satisfiable and the inference thus invalid. We can read off the same
    counter-model as before, if we so desire.

    Comparison in terms of speed on this abstract level are tricky, but one way
    to compare the two is how many operations we needed to carry out. The
    truth-table method required us to generate $4$ valuations and carry out $7$
    Boolean calculations each. That is a total $4 + (4 x 7) = = 32$ operations.
    We were lucky that the first row yielded the correct answer, so we only
    needed to carry out $32 + 1 = 33$ operations to obtain the correct result.

    For the resolution method, the main bottle neck is the transformation into
    CNF. Here, it took $3$ steps. Add to this the single resolution step and
    $2$ checks for possible further resolutions, this leaves us with a grand
    total of $3 + 1 + 2 = 6$ steps.

    Of course, a real comparison in terms of speed depends on a lot of
    implementation details: how we enumerate the valuations, calculate the
    Boolean operations, recursively re-write formulas, check for resolvability,
    etc. In fact, we can imagine a smarter implementation of the truth-table
    method, where rather than first generating all the rows and columns and
    then checking, we first generate each row and then check whether it's a
    countermodel and only continue if it isn't. In this case, this would
    provide a speed-up, where we only need to generate one row, carry out $7$
    Boolean calculations, and do a final check. Since Boolean operations are
    fairly "low-level"—certainly lower level than recursive rewrites—it's
    plausible that this smarter truth-table algorithm could outperform
    resolution in real world use-cases. In fact, there are various smarter ways
    of implementing truth-tables.

    But note that this depends on the counter-example occurring "early" in our
    truth-table, here in the first row. If the counter-example happens later in
    the table, or not at all because the inference is valid, resolution has a
    good chance to outperform truth-tables.

2. To check whether the inference is valid, we need to check whether $$`SAT` {
   RAIN{{< lor >}} (RAIN{{< land >}} WIND), {{< neg >}}(RAIN{{< lor >}}SUN)}$$
Here's the truth-table showing the unsatisfiability of the set: 

    {{< img src="img/tt_unsat.png" class="mx-auto d-block rounded inert-img img-fluid" width="600px">}}

    Note that we need to generate the full truth-table to see that there are no
    counter-examples.

    Resolution, instead, is much faster. First, we bring both formulas into CNF:

    + $RAIN{{< lor >}} (RAIN{{< land >}} WIND)$ requires one distribution $r₄$
    to become $(RAIN{{< lor >}} RAIN ){{< land >}} (RAIN {{< lor >}} WIND)$.

    + ${{< neg >}}(RAIN{{< lor >}}SUN)$ requires one De Morgan re-write using
    $r₂$, giving us the CNF ${{< neg >}}RAIN {{< land >}}{{< neg >}}SUN$

    The resulting set clauses are: $${ RAIN } &emsp; { RAIN, WIND
    }&emsp;{{{< neg >}} RAIN}&emsp;{{{< neg >}} SUN}.$$ A single application
    of resolution on ${ RAIN }$ and ${{{< neg >}} RAIN}$ derives the empty
    set ${ }$, showing the unsatisfiability of the set, and thus validity of
    the inference.
