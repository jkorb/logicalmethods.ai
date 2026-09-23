---
title: Propositional parser
weight: 10
params:
  id: tls-propositional-parser
  group: Syntax
  teaser: 'Break a propositional formula into its parts, under either bracket convention.'
---

# Propositional parser

A formula is not a string of symbols but a structure, and the parser finds that
structure. Working through the formula symbol by symbol, it builds the syntax
tree: which connective is the main one, what its immediate parts are, and what
each bracket is doing. Everything later depends on that reading. A valuation, a
truth table and a proof all follow the structure the parser finds, which is why
an ambiguous formula is useless to a logician and to a compiler alike.

**Scope.** The propositional language of chapter 2: the variables `p`, `q` and
`r`, or `p` with a subscript index. Quantifiers, predicates and terms are not
part of that language, so a first-order parser will be its own tool rather than
a mode of this one.

## Full brackets

Strict mode follows the fully bracketed grammar, in which every connective
carries its own pair of brackets and no formula needs a precedence rule. Click
through the steps, or use the pencil to enter a formula of your own.

{{< logic-app name="parser" formula="((p ∧ q) → ¬r)" title="Parsing with full brackets" >}}

## Bracket conventions

Conventional mode reads formulas written the way people actually write them,
with the brackets that precedence already determines left out. Try the same
formula in both apps: the trees agree, and the brackets you dropped are the
ones the convention puts back.

{{< logic-app name="parser" mode="conventional" formula="p ∧ q → ¬r" title="Parsing with bracket conventions" >}}

## Using it

Both modes accept `p`, `q` and `r`, and `p` with a subscript index. Type
mathematical symbols directly, or write LaTeX commands such as `\land` and
`\neg`, which convert as you type. The pencil button unlocks the input and
clears the previous trace; **Start parsing** freezes it and builds a new one.
The text button swaps the diagram for a nested list of the same tree.

## In the book

- {{< chapter_ref chapter="formal-languages" id="parsing" >}}Parsing{{< /chapter_ref >}}
  develops the algorithm this app runs, and explains why it terminates.
- {{< chapter_ref chapter="formal-languages" id="conventional-notation" >}}Conventional notation{{< /chapter_ref >}}
  gives the precedence and grouping rules behind the second mode.
- The [exercise on omitted brackets](/exercises/formal-languages/#omitting-brackets)
  practices translating between the two notations, and the
  [guided grammar exercise](/exercises/formal-languages/#conventional-grammar)
  builds a parser for conventional notation.
