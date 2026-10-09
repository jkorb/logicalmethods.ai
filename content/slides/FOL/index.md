---
title: FOL
author: Johannes Korbmacher
weight: 80
layout: 'reveal_slides'
summary: 'Lecture 8: first-order syntax, models as knowledge bases, truth in a model, and querying databases with formulas.'
params:
  chapter: FOL
  id: sli-fol
  license: 'CC-BY-4.0'
---

{{< slide title="Learning goals" >}}
## What you'll be able to do

{{< callout type="objectives" >}}
After this lecture and chapter 8, you will be able to:

- Parse first-order terms and formulas, including quantifier scopes and free variables. *(apply)*
- Represent general claims and dependencies using quantified formulas. *(apply)*
- Construct first-order models using sets, tables, and knowledge graphs. *(apply, create)*
- Determine the truth of sentences and the extensions of open formulas in a finite model. *(apply)*
- Compare finite and infinite models as representations of knowledge. *(analyse)*
- Use the correspondence between FOL and SQL to query a relational database. *(apply)*
{{< /callout >}}

{{< slide layout="split" title="All humans are mortal" >}}
## All humans are mortal

{{< column >}}

{{< inference >}}
All humans are mortal
Socrates is human
---
Socrates is mortal
{{< /inference >}}

- Propositional: $HUMAN → MORTAL$, then $HUMAN₂ → MORTAL₂$, …
- First-order, once for every object:

$$
∀x (Human(x) → Mortal(x))
$$

{{< column >}}

{{< img src="/img/drawings/fol_ai_talking_fol.svg" width="240px" alt="Two course mascots talk in first-order formulas: one says for all x and y, F(x, y) = −F(y, x); the other answers with the epsilon-delta definition of continuity." >}}

{{< slide title="Alphabet" >}}
## Alphabet

{{< annotated-math prefix="Σ = {" suffix="}" wrap=true title="A first-order alphabet" >}}
[
  {"symbols": "x, y, z, …", "label": "variables", "position": "below", "color": "blue"},
  {"symbols": "a, b, c, …", "label": "constants", "position": "above", "color": "red"},
  {"symbols": "f¹, g², …", "label": "functions", "position": "below", "color": "green"},
  {"symbols": "P¹, R², …", "label": "predicates", "position": "above", "color": "violet"},
  {"symbols": "¬, ∧, ∨, →, ↔", "label": "connectives", "position": "below", "color": "orange"},
  {"symbols": "∀, ∃", "label": "quantifiers", "position": "above", "color": "teal"},
  {"symbols": "=", "label": "identity", "position": "below", "color": "olive"},
  {"symbols": "(, ), ,", "label": "punctuation", "position": "above", "color": "pink"}
]
{{< /annotated-math >}}

{{< callout type="definition" title="First-order signature" >}}
A {{< term "signature" "first-order signature" >}} specifies the constant,
function, and predicate symbols of a language, with a fixed arity for each
function and predicate symbol.
{{< /callout >}}

{{< slide layout="app" title="Terms" >}}
## Terms

{{< callout type="definition" title="Term" >}}
A {{< term "term" "term" >}} of a first-order language is a variable, a constant,
or an expression $f(t₁, …, tₙ)$, where $f$ is an $n$-ary function symbol and each
$tᵢ$ is a term.
{{< /callout >}}

{{< logic-app name="parser" language="fol" kind="term" formula="distanceBetween(birthplaceOf(Socrates), capitalOf(x))" title="Parsing distanceBetween(birthplaceOf(Socrates), capitalOf(x))" >}}

{{< slide title="Formulas" >}}
## Formulas

$$
A ::= P(t₁, …, tₙ) ∣ t₁ = t₂ ∣ ¬A ∣ (A ∧ A) ∣ (A ∨ A)
∣ (A → A) ∣ (A ↔ A) ∣ ∀x A ∣ ∃x A
$$

{{< callout type="definition" title="Atomic formula" >}}
An {{< term "fol-atomic-formula" "atomic formula" >}} of a first-order language
is $P(t₁, …, tₙ)$, where $P$ is an $n$-ary predicate and its arguments are terms,
or an identity $t₁ = t₂$ between terms.
{{< /callout >}}

$Human(Socrates)$ and $motherOf(x) = y$ are atomic; $fatherOf(Socrates)$ is a term.

{{< slide layout="app" title="Scope and binding" >}}
## Scope and binding

{{< callout type="definition" title="Scope and binding" >}}
The {{< term "quantifier-scope" "scope" >}} of a quantifier is its formula child
in the syntax tree. A {{< term "bound-variable" "bound occurrence" >}} of a
variable belongs to the nearest enclosing quantifier for that variable. A
{{< term "free-variable" "free occurrence" >}} has no such enclosing quantifier.
{{< /callout >}}

{{< logic-app name="fol-scope" formula="∀x (Human(x) → ∃y (Human(y) ∧ motherOf(x) = y))" title="Quantifiers and their bound occurrences" >}}

{{< slide layout="app" title="Open formulas" >}}
## Open formulas

{{< callout type="definition" title="Open formula and sentence" >}}
An {{< term "open-formula" "open formula" >}} has at least one free variable
occurrence. A {{< term "sentence" "sentence" >}}, or closed formula, has none.
{{< /callout >}}

{{< logic-app name="fol-scope" formula="(Human(x) ∧ ∀x Mortal(x))" title="Free and bound occurrences of x together" >}}

{{< slide layout="split" title="Iterated quantifiers" >}}
## Iterated quantifiers

Over $ℕ = {0, 1, 2, …}$:

{{< column >}}

$$
∀x ∃y (x < y)
$$

True: for $x ↦ n$, take $y ↦ n + 1$. The witness depends on $x$.

{{< column >}}

$$
∃y ∀x (x < y)
$$

False: no single $y$ beats every $x$.

{{< slide layout="center" title="Models" >}}
## Models

{{< fol-worlds >}}

A scenario: which objects there are, what names denote, which properties and
relations the objects have.

{{< slide title="First-order model" >}}
## First-order model

{{< callout type="definition" title="First-order model" >}}
A {{< term "fol-model" "first-order model" >}} $M$ for a signature consists of
a nonempty {{< term "domain" "domain" >}} $D$ and an
{{< term "interpretation" "interpretation" >}} assigning:

- an object $⟦a⟧ᴹ ∈ D$ to each constant $a$;
- a total function $⟦f⟧ᴹ: Dⁿ → D$ to each $n$-ary function symbol $f$;
- a relation $⟦R⟧ᴹ ⊆ Dⁿ$ to each $n$-ary predicate symbol $R$.
{{< /callout >}}

{{< slide layout="app" title="Models as knowledge bases" >}}
## Models as knowledge bases

Sets, tables, a knowledge graph: one model, many displays.

{{< logic-app name="fol-model" model="people" view="sets" title="The people model, shown as sets" >}}

{{< slide title="Modeling assumptions" >}}
## Modeling assumptions

| Classical FOL assumes | So |
| --- | --- |
| A nonempty domain | If everything is $P$, something is $P$. |
| Every name denotes | No empty names, even in fiction. |
| Total functions | $fatherOf$ needs a value for the box. |
| Bivalence | An absent tuple is false, not unknown. |

{{< slide layout="app" title="Denotation" >}}
## Denotation

A {{< term "variable-assignment" "variable assignment" >}} $v$ gives each variable an object; $v(x)$ = Jimmy.

{{< logic-app name="fol-model" model="people" kind="term" editable="false" view="tables" formula="fatherOf(fatherOf(x))" title="Calculating the denotation of fatherOf(fatherOf(x))" >}}

{{< slide title="Satisfaction" >}}
## Satisfaction

{{< callout type="definition" title="Satisfaction" >}}
An assignment $v$ {{< term "satisfaction" "satisfies" >}} a formula $A$ in $M$,
written $M, v ⊨ A$, according to the following recursive clauses:

- $M, v ⊨ P(t₁, …, tₙ)$ iff $[⟦t₁⟧ᴹᵥ, …, ⟦tₙ⟧ᴹᵥ] ∈ ⟦P⟧ᴹ$.
- $M, v ⊨ t₁ = t₂$ iff $⟦t₁⟧ᴹᵥ = ⟦t₂⟧ᴹᵥ$.
- $M, v ⊨ ¬A$ iff $M, v ⊭ A$.
- $M, v ⊨ (A ∧ B)$ iff $M, v ⊨ A$ and $M, v ⊨ B$.
- $M, v ⊨ (A ∨ B)$ iff $M, v ⊨ A$ or $M, v ⊨ B$.
- $M, v ⊨ (A → B)$ iff $M, v ⊭ A$ or $M, v ⊨ B$.
- $M, v ⊨ (A ↔ B)$ iff ($M, v ⊨ A$ iff $M, v ⊨ B$).
{{< /callout >}}

{{< slide layout="app" title="Extensions" >}}
## Extensions

$⟦A(x₁, …, xₙ)⟧ᴹ$: the tuples that satisfy $A$.

{{< logic-app name="fol-model" model="people-relations" kind="query" editable="false" view="domain" formula="(BiggerThan(x, y) ∧ Human(x))" title="The extension of (BiggerThan(x, y) ∧ Human(x))" >}}

{{< slide layout="app" title="Quantifiers" >}}
## Quantifiers

$M ⊨ ∀x A(x)$ iff $⟦A(x)⟧ᴹ = D$; $M ⊨ ∃x A(x)$ iff $⟦A(x)⟧ᴹ ≠ ∅$.

{{< logic-app name="fol-model" model="people-relations" kind="evaluate" view="sets" formula="∀x (Human(x) → Mortal(x))" title="Checking ∀x (Human(x) → Mortal(x)) in a finite model" >}}

{{< slide layout="split" title="Finite and infinite models" >}}
## Finite and infinite models

{{< column >}}

### Finite

- Databases, registers, maps.
- {{< term "model-checking" "Model checking" >}}: every search finishes.

{{< column >}}

### Infinite

- $ℕ$ makes $∀x ∃y (x < y)$ true; no finite ordering does.
- No search through all objects: we may need a proof.

{{< slide layout="split" title="Queries and Codd's theorem" >}}
## Queries and Codd's theorem

{{< column >}}

{{< callout type="definition" title="Relational query" >}}
A {{< term "relational-query" "relational query" >}} specified by a formula
returns the tuples of domain objects that satisfy the formula when assigned
to its free variables, in the specified order.
{{< /callout >}}

{{< img src="/img/drawings/gimmick_database.svg" width="90px" alt="A database, drawn as a blue cylinder." >}}

{{< column >}}

{{< callout type="theorem" title="Codd's theorem" >}}
The domain-independent queries expressible by FOL formulas are exactly the
queries computable from relation tables by selecting rows, projecting columns,
renaming columns, taking products and unions, and subtracting one set of rows
from another.
{{< /callout >}}

{{< slide layout="app" title="Worked-out example: European countries" >}}
## Worked-out example: European countries

{{< logic-app name="fol-model" model="world" kind="sql" editable="false" view="domain" formula="LocatedIn(x, Europe)" title="LocatedIn(x, Europe) as a formula and as SQL" >}}
