---
title: Boolean satisfiability
author: Johannes Korbmacher
locked: false
weight: 50
params: 
  id: exc-sat
  math: true
---

# Truth-function representations

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


# Circuit representations

We've observed that our relay circuits are essentially build up from relay
implementations of !!NOT!! ($default "on"$) and !!AND!! ($default "off"$). Use
the idea to represent the following circuits as Boolean expressions:

|   | |  |
| - | - | - |
| {{< img src="img/or_impl.png" class="rounded inert-img img-fluid" width="300px">}} | &emsp;&emsp;&emsp; |{{< img src="img/xor_impl.png" class="rounded inert-img img-fluid" width="400px">}} |

Are the resulting formulas in normal form (CNF or DNF)?

# Equivalence

The !!XNOR!! function is special: it expresses that `X` and `Y` have the same value—just check the table! 

1. Find the simplest representation of !!XNOR!! in terms of !!NOT!! and !!XOR!!. 

    _Hint_: Inspect !!XNOR!! and !!XOR!!'s function tables, how are they related?

2. Use this implementation to reduce the verification problem for a relay circuit from two `SAT` problems for different sets (as in the text) to a single `SAT` problem for a single expression. 

    _Hint_: Think about when `X !!XNOR!! Y` is true and when `X !!XOR!! Y` is true.

# Truth tables

Use the truth-table method to check whether the following claims are true:

1. The set of expressions `((!!NOT!! X) !!OR!! (!!NOT!! Y))` and `(X !!AND!! Y)` is `SAT`.

2. The set formulas ${ {{< neg >}} RAIN, (RAIN {{< lor >}} ({{< neg >}}WIND {{< land >}} RAIN) }$ is `SAT`.

# Mystery formula

Determine the following $"mystery formula"$ form its truth-table:

{{< img src="img/mystery_table.png" class="mx-auto d-block rounded inert-img img-fluid" width="400px">}}

What's the shortest representation of the formula you can find?


# Normal Forms

Transform the following formulas into DNF and CNF:

  1. $(RAIN{{< land >}} {{< neg >}}(SUN{{< lor >}}{{< neg >}}RAIN))$
  1. $({{< neg >}}RAIN{{< lor >}} {{< neg >}}({{< neg >}} RAIN{{< lor >}}WIND))$
  1. $(RAIN{{< land >}} {{< neg >}}SUN){{< lor >}} ({{< neg >}}RAIN{{< land >}} {{< neg >}}SUN)$

# Resolution

Use the resolution method to determine whether the following formulas are
satisfiable:

1. $(SUN{{< lor >}} RAIN{{< lor >}} {{< neg >}} WIND){{< land >}} (SUN{{< lor >}}{{< neg >}} RAIN{{< lor >}} {{< neg >}} WIND)$
2. ${{< neg >}}(SUN{{< land >}} RAIN){{< lor >}} (WIND{{< land >}} {{< neg >}} WIND)$
3. $(SUN{{< lor >}} RAIN){{< land >}} (SUN{{< lor >}} {{< neg >}} RAIN){{< land >}} ({{< neg >}} SUN{{< lor >}} RAIN){{< land >}} ({{< neg >}} SUN{{< lor >}} {{< neg >}} RAIN)$
4. $(SUN{{< land >}} (SUN{{< lor >}} RAIN)){{< land >}} (RAIN{{< land >}} (RAIN{{< lor >}} SUN))$

# Valid inference 

Determine whether the following inferences are valid using both the truth-table and the resolution method. Which one is faster?

1. ${{< neg >}}RAIN{{< therefore >}}RAIN{{< lor >}} ({{< neg >}}RAIN{{< land >}}
SUN)$

2. $RAIN{{< lor >}} (RAIN{{< land >}} WIND){{< therefore >}}
RAIN{{< lor >}}SUN$

