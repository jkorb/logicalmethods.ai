---
title: First-order models and SQL
weight: 160
params:
  id: tls-first-order-sql
  group: Models and semantics
  teaser: "Translate between finite models, formulas, and SQL over the world database."
---

# First-order models and SQL

Turn a model into database tables, or translate an open formula into a query.
Edit the SQL and run it locally to compare the database result with the logical
interpretation.

**Scope.** The supplied world signature and table schema. Formula translation
supports set-valued queries with `SELECT DISTINCT`, joins, Boolean conditions,
identity, and nested `EXISTS`. Use the displayed constants and table columns.
Aggregation, ordering, and NULL values are outside the translator's fragment.

## Models and tables

{{< logic-app name="fol-model" model="world" kind="database" view="tables" title="Models and database tables" >}}

## Formulas and queries

{{< logic-app name="fol-model" model="world" kind="sql" view="domain" title="First-order formulas and SQL queries" >}}

## Using it

In the first pair, modify the model and use Model → Database to generate table
creation and insertion statements. Edit those statements and choose Database →
Model to reconstruct the interpretation. Imported tables must retain the
configured schema and constant denotations.

In the second pair, build a model and enter a formula or SQL query. The arrows
translate in either direction; Run executes the SQL against the displayed
model. Query follows formula evaluation and shows satisfying assignments.
Copy and download preserve the SQL as text. Fullscreen opens more room for
both representations.

## In the book

- {{< chapter_ref chapter="fol" id="databases-and-fol" >}}Databases and FOL{{< /chapter_ref >}}
  connects interpretations with tables and formulas with queries.
