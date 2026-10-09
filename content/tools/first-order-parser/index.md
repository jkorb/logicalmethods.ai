---
title: First-order parser
weight: 140
params:
  id: tls-first-order-parser
  group: Syntax
  teaser: "Parse first-order terms and formulas into typed syntax trees."
---

# First-order parser

Enter a term or formula and follow the construction of its syntax tree.
The tree distinguishes objects named by terms from claims made by formulas.

**Scope.** The fixed signature below, with variables `x`, `y`, `z`, `u`, `v`,
and `w`, optionally indexed. Quantifiers, identity, and the propositional
connectives are supported. Both inputs use conventional bracket rules.

| Symbols | Names |
| --- | --- |
| Constants | `Socrates`, `Xanthippe`, `Greece`, `LittleJimmy`, `MrSir`, `a`, `b`, `c` |
| Unary functions | `fatherOf`, `motherOf`, `birthplaceOf`, `capitalOf`, `f` |
| Binary functions | `distanceBetween`, `g` |
| Unary predicates | `Human`, `Mortal`, `P`, `Q` |
| Binary predicates | `BiggerThan`, `Sibling`, `R` |

## Terms

{{< logic-app name="parser" language="fol" kind="term" title="Parse a first-order term" >}}

## Formulas

{{< logic-app name="parser" language="fol" title="Parse a first-order formula" >}}

## Using it

The pencil unlocks the input. Use argument brackets, as in `R(x,y)` or
`fatherOf(x)`, then choose Start parsing. LaTeX commands convert as you type.
Quantifiers bind tightly: bracket a compound scope, as in `∀x (P(x) → Q(x))`.
The arrows step through parsing; the tree controls change its labels and export
PNG or LaTeX. The accessibility button opens the text tree.

## In the book

- {{< chapter_ref chapter="fol" id="syntax" >}}First-order syntax{{< /chapter_ref >}}
  defines terms and formulas.
- {{< chapter_ref chapter="fol" id="scope-binding-and-substitution" >}}Scope and open formulas{{< /chapter_ref >}}
  explains variable binding.
