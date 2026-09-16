---
title: Tools
author: Johannes Korbmacher
weight: 150
locked: false
params:
  appendix: C
  id: txt-tools
---

# Tools

Here are the book's apps in one place. Use them to try your own examples or
check your work. The links take you back to the chapters for the explanations.

## Formal languages

### Parsing with full brackets

Start with the grammar from the
{{< chapter_ref chapter="formal-languages" id="parsing" >}}parsing section{{< /chapter_ref >}}.
Click through the steps to see how the formula breaks down into its parts,
or use the pencil to enter a formula of your own.

{{< logic-app name="parser" formula="((p ∧ q) → ¬r)" title="Parsing with full brackets" >}}

### Parsing with bracket conventions

This version uses the
{{< chapter_ref chapter="formal-languages" id="conventional-notation" >}}conventions for omitting brackets{{< /chapter_ref >}}.
Try the same expression in both apps. Which brackets can you leave out here?
The [exercise on omitted brackets](/exercises/formal-languages/#omitting-brackets)
practices translating between the two notations. The
[guided grammar exercise](/exercises/formal-languages/#conventional-grammar)
then develops a parser for conventional notation.

{{< logic-app name="parser" mode="conventional" formula="p ∧ q → ¬r" title="Parsing with bracket conventions" >}}

### Shunting yard

Convert infix formulas to postfix notation, watching the operator stack and
output at each step. The [shunting-yard exercises](/exercises/formal-languages/#shunting-yard)
explain the rules and provide worked examples.

{{< logic-app name="shunting-yard" formula="p ∨ q ∧ r" >}}

## Sets and valid inference

Explore [set membership](/textbook/formal-languages/#sets), then use intersections
to test [deductive consequence](/textbook/valid-inference/#always--deductive-validity).
The buttons highlight regions and explain the same finite sets.

{{< set-diagram scene="overlap" >}}
{{< set-diagram scene="countermodel" >}}
