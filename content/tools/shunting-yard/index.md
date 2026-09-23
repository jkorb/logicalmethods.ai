---
title: Propositional shunting yard
weight: 20
params:
  id: tls-shunting-yard
  group: Syntax
  teaser: 'Convert a propositional formula from infix to postfix, one symbol at a time.'
---

# Propositional shunting yard

Infix notation writes a binary connective between its two arguments, which is
why it needs brackets and precedence rules to stay unambiguous. Postfix
notation writes the connective after them and needs neither: the structure is
recoverable from the order alone. Dijkstra's shunting-yard algorithm converts
the first into the second with a single stack, which holds each connective back
until both of its arguments have been output.

**Scope.** Propositional formulas, under the precedence conventions of
chapter 2. The algorithm itself is general — it is the standard way to read
infix notation of any kind — but this implementation knows only the
connectives.

Step through the conversion and watch the two halves move: the operator stack
on one side, the growing output on the other. The formula below turns on
precedence, since $∧$ binds more tightly than $∨$.

{{< logic-app name="shunting-yard" formula="p ∨ q ∧ r" >}}

## Using it

The pencil unlocks the input for a formula of your own; the step buttons move
through the conversion one symbol at a time. Watching which symbol enters the
stack and which leaves it is the point — the final string is the least
interesting part of the run.

## In the book

- {{< chapter_ref chapter="formal-languages" id="parsing" >}}Parsing{{< /chapter_ref >}}
  explains why unique readability is what makes any such conversion possible.
- The [shunting-yard exercises](/exercises/formal-languages/#shunting-yard)
  state the rules and work through examples by hand.
