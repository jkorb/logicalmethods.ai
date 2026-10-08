# Formulas and SQL

Use `logic-app name="fol-model" kind="sql" model="world" editable="false"`
for the formula/SQL correspondence. Two panes show the formula and highlighted
SQL, with translation arrows and a fullscreen button above them. Pencils unlock
the fields. Query and SQL → Formula display the model walkthrough below the panes,
without a disclosure control. At desktop widths, fullscreen places that walkthrough below the
formula in the left pane, alongside the SQL. Run executes SQL separately using the
[local SQLite runtime](sql.md). Edits clear previous results.

`fol-sql.js` accepts set-valued `SELECT DISTINCT` projections, `FROM`, inner and
cross joins, `WHERE`, equality, `AND`, `OR`, `NOT`, and correlated
`EXISTS (SELECT 1 …)`. It also accepts Boolean `SELECT` queries emitted by the
forward translator. NULLs, aggregation, ordering, wildcard projections, and
mutations are excluded. SQL values must have constants in the fixed language.
The translator preserves projection order, resolves aliases with nested scope,
and rejects ambiguous column references. Generated variable indices use subscripts.
SQL input is limited to 12,000 characters and 2,000 tokens; its translated
formula must fit the shared parser's bounds.

The configured `columns` give the displayed and generated SQL schema; `arg1`,
`arg2`, … remain accepted position aliases. `Domain(value)` is the whole finite
domain. Models use non-NULL identifiers and set-valued relations. Unused domain
objects remain available to negation and quantification. This explicit-domain
translation includes queries outside Codd's domain-independent fragment.

Unit tests compare both translation directions with SQLite and vary relation
extensions to check that the result is preserved beyond the example database.

## Database initialization

`kind="database"` pairs the editable model canvas with its SQL initialization,
without formulas. Model → Database generates CREATE TABLE and INSERT statements.
Database → Model executes the edited initialization in an empty database and
reads its tables back into the canvas. Run does the same; the updated model
is its output.
Constant denotations are retained from the model; SQL comments do not assign them.
Model edits leave the SQL alone until the forward arrow is used.

The import requires the configured predicate tables and ordered columns, text identifiers, no NULLs or duplicates, and a valid interpretation.
If Domain(value) is present, it supplies the domain; otherwise the union of
all predicate column values supplies the active domain. The domain must be
nonempty. Constant denotations must belong to it; an explicit Domain must
include all predicate entries. It accepts
at most 32 domain objects and 1,000 rows per predicate for the canvas. Invalid
imports leave the model intact. Unknown object identifiers display as text.
Table tabs select Domain, Constants, or a predicate; the Modify menu edits their interpretations.

Both pairs offer copy/download of the SQL and fullscreen from the top toolbar.
The two panes stack on narrow screens. No external playground is required.

Correspondence directions use stacked arrow buttons between the pane labels.
Reset and fullscreen share a separate utility row. Reset restores the original
model, formula, and generated SQL, and clears the previous output.

## Related

- [Model canvas](fol.md), [chapter apps](README.md).
