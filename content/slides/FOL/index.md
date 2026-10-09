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

{{< slide layout="center" class="slide--centred" title="All humans are mortal" >}}

{{< img src="/img/drawings/fol_ai_talking_fol.svg" width="150px" class="deck-corner" alt="Two course mascots talk in first-order formulas: one says for all x and y, F(x, y) = −F(y, x); the other answers with the epsilon-delta definition of continuity." >}}

## All humans are mortal

{{< inference >}}
All humans are mortal
Socrates is human
---
Socrates is mortal
{{< /inference >}}

- Propositional logic: $HUMAN₁ → MORTAL₁$, $HUMAN₂ → MORTAL₂$, …
- First-order logic: $∀x (Human(x) → Mortal(x))$

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

{{< slide layout="app" class="slide--snug" title="Terms" >}}
## Terms

{{< callout type="definition" title="Term" >}}
A {{< term "term" "term" >}} is a variable, a constant, or $f(t₁, …, tₙ)$ for an
$n$-ary function symbol $f$ and terms $t₁, …, tₙ$.
{{< /callout >}}

{{< logic-app name="parser" language="fol" kind="term" formula="distanceBetween(birthplaceOf(Socrates), capitalOf(x))" title="Parsing distanceBetween(birthplaceOf(Socrates), capitalOf(x))" >}}

{{< slide layout="center" class="slide--centred" title="Formulas" >}}
## Formulas

{{< callout type="definition" title="Formula" >}}
{{< annotated-math prefix="A ::=" separator="∣" stack=true title="The grammar of first-order formulas" >}}
[
  {"symbols": "P(t₁, …, tₙ) ∣ t₁ = t₂", "label": "atomic", "color": "violet"},
  {"symbols": "¬A ∣ (A ∧ A) ∣ (A ∨ A) ∣ (A → A) ∣ (A ↔ A)", "label": "connectives", "color": "orange"},
  {"symbols": "∀x A ∣ ∃x A", "label": "quantifiers", "color": "teal"}
]
{{< /annotated-math >}}
{{< /callout >}}

- Atomic: $Human(Socrates)$, $motherOf(x) = y$
- Quantified: $∀x (Human(x) → Mortal(x))$
- A term, not a formula: $fatherOf(Socrates)$

{{< slide layout="app" title="Scope and binding" >}}
## Scope and binding

{{< callout type="definition" title="Scope and binding" >}}
The {{< term "quantifier-scope" "scope" >}} of a quantifier is its formula child
in the syntax tree. A {{< term "bound-variable" "bound occurrence" >}} of a
variable belongs to the nearest enclosing quantifier for that variable. A
{{< term "free-variable" "free occurrence" >}} has no such enclosing quantifier.
{{< /callout >}}

{{< logic-app name="fol-scope" mode="explore" formulas="∀x (Human(x) → ∃y (Human(y) ∧ motherOf(x) = y)) | (Human(x) ∧ ∀x Mortal(x))" labels="Sentence | Open formula" title="Scope and binding in a sentence and in an open formula" >}}

{{< slide layout="center" title="Models" >}}
## Models

{{< fol-worlds >}}

{{< slide layout="app" class="slide--snug" title="First-order models" >}}
## First-order models

{{< logic-app name="fol-model" model="people" view="graph" title="A first-order model of people and a box" >}}

{{< slide layout="split" title="Domain and interpretation" >}}
## Domain and interpretation

{{< column >}}

{{< callout type="definition" title="First-order model" >}}
A {{< term "fol-model" "model" >}} $M$: a nonempty {{< term "domain" "domain" >}} $D$ and
an {{< term "interpretation" "interpretation" >}}

- $⟦a⟧ᴹ ∈ D$ for each constant $a$
- $⟦f⟧ᴹ: Dⁿ → D$ for each function symbol $f$
- $⟦R⟧ᴹ ⊆ Dⁿ$ for each predicate $R$
{{< /callout >}}

{{< column >}}

{{< img src="/img/drawings/fol_domain_big.svg" width="300px" alt="A domain drawn as a yellow card full of objects: people, a rabbit, a box, playing cards, numbers, a can of soda." >}}

Classical FOL assumes **nonempty domains**, **a referent for every name**,
**total functions** and **a truth-value for every atom**: idealizations.

{{< slide layout="app" title="Denotation" >}}
## Denotation

{{< logic-app name="fol-model" model="people" kind="term" editable="false" view="tables" formula="fatherOf(fatherOf(x))" title="Calculating the denotation of fatherOf(fatherOf(x))" >}}

{{< slide title="Assignments and denotation" >}}
## Assignments and denotation

{{< callout type="definition" title="Variable assignment" >}}
A {{< term "variable-assignment" "variable assignment" >}} $v$ in a model with
domain $D$ assigns an object of $D$ to each variable.
{{< /callout >}}

{{< callout type="definition" title="Denotation under an assignment" >}}
In a model $M$ under an assignment $v$, the
{{< term "denotation" "denotation" >}} $⟦t⟧ᴹᵥ$ of a term $t$ is defined recursively:

$$
⟦x⟧ᴹᵥ = v(x)
⟦a⟧ᴹᵥ = ⟦a⟧ᴹ
⟦f(t₁, …, tₙ)⟧ᴹᵥ = ⟦f⟧ᴹ(⟦t₁⟧ᴹᵥ, …, ⟦tₙ⟧ᴹᵥ)
$$
{{< /callout >}}

{{< slide layout="app" title="Model checking" >}}
## Model checking

{{< logic-app name="fol-model" model="people-relations" kind="evaluate" view="sets" formula="∀x (Human(x) → Mortal(x))" title="Checking ∀x (Human(x) → Mortal(x)) in a finite model" >}}

{{< slide title="Satisfaction" >}}
## Satisfaction

{{< callout type="definition" title="Satisfaction" >}}
$M, v ⊨ A$ ({{< term "satisfaction" "satisfaction" >}}) is defined by:

- $M, v ⊨ P(t₁, …, tₙ)$ iff $[⟦t₁⟧ᴹᵥ, …, ⟦tₙ⟧ᴹᵥ] ∈ ⟦P⟧ᴹ$.
- $M, v ⊨ t₁ = t₂$ iff $⟦t₁⟧ᴹᵥ = ⟦t₂⟧ᴹᵥ$.
- $M, v ⊨ ¬A$ iff $M, v ⊭ A$.
- $M, v ⊨ (A ∧ B)$ iff $M, v ⊨ A$ and $M, v ⊨ B$.
- $M, v ⊨ (A ∨ B)$ iff $M, v ⊨ A$ or $M, v ⊨ B$.
- $M, v ⊨ (A → B)$ iff $M, v ⊭ A$ or $M, v ⊨ B$.
- $M, v ⊨ (A ↔ B)$ iff ($M, v ⊨ A$ iff $M, v ⊨ B$).
{{< /callout >}}

{{< slide layout="split" title="Quantifiers" >}}
## Quantifiers

{{< callout type="definition" title="Assignment variant" >}}
The {{< term "assignment-variant" "assignment variant" >}} $v[x ↦ d]$ assigns
$d ∈ D$ to $x$ and agrees with $v$ on every other variable.
{{< /callout >}}

{{< callout type="definition" title="Quantifier clauses" >}}
- $M, v ⊨ ∃x A$ iff $M, v[x ↦ d] ⊨ A$ for some $d ∈ D$.
- $M, v ⊨ ∀x A$ iff $M, v[x ↦ d] ⊨ A$ for every $d ∈ D$.
{{< /callout >}}

{{< column >}}

- $∃x$: one witness is enough.
- $∀x$: one counterexample refutes it.

{{< column >}}

{{< img src="/img/drawings/gimmick_mouse.svg" width="90px" alt="A grey cartoon mouse with round ears and a pink-tipped tail." >}}

{{< slide layout="app" class="slide--snug" title="Extensions" >}}
## Extensions

{{< callout type="definition" title="Extension" >}}
$M ⊨ A(d₁, …, dₙ)$ iff $M, [x₁ ↦ d₁, …, xₙ ↦ dₙ] ⊨ A(x₁, …, xₙ)$\
$⟦A(x₁, …, xₙ)⟧ᴹ = {[d₁, …, dₙ] ∈ Dⁿ | M ⊨ A(d₁, …, dₙ)}$
{{< /callout >}}

{{< logic-app name="fol-model" model="people-relations" kind="query" editable="false" view="domain" formula="(BiggerThan(x, y) ∧ Human(x))" title="The extension of (BiggerThan(x, y) ∧ Human(x))" >}}

{{< slide layout="split" title="Models as databases" >}}
## Models as databases

{{< column >}}

{{< logic-app name="fol-model" model="people-relations" view="tables" title="The people model as tables" >}}

{{< column >}}

```sql
CREATE TABLE BiggerThan (
  bigger TEXT NOT NULL,
  smaller TEXT NOT NULL,
  PRIMARY KEY (bigger, smaller)
);
INSERT INTO BiggerThan VALUES
  ('sir', 'jimmy'),
  ('jimmy', 'box'),
  ('sir', 'box');
```

An extension becomes a table; a tuple, a row.

{{< slide layout="app" title="Queries as open formulas" >}}
## Queries as open formulas

{{< logic-app name="fol-model" model="world" kind="query" editable="false" view="domain" formula="LocatedIn(x, Europe)" title="Querying LocatedIn(x, Europe)" >}}

{{< slide title="Formulas to SQL" >}}
## Formulas to SQL

Each free variable ranges over `Domain`; `query(A)` is the condition for $A$.

| FOL | SQL condition |
| --- | --- |
| $LocatedIn(x, Europe)$ | {{< sql-condition "EXISTS (SELECT 1 FROM LocatedIn AS r WHERE r.country = d.value AND r.continent = 'Europe')" >}} |
| $¬A$ | {{< sql-condition "NOT (query(A))" >}} |
| $A ∧ B$ | {{< sql-condition "(query(A)) AND (query(B))" >}} |
| $A ∨ B$ | {{< sql-condition "(query(A)) OR (query(B))" >}} |
| $∃y A$ | {{< sql-condition "EXISTS (SELECT 1 FROM Domain AS e WHERE query(A))" >}} |
| $∀y A$ | {{< sql-condition "NOT EXISTS (SELECT 1 FROM Domain AS e WHERE NOT (query(A)))" >}} |

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
