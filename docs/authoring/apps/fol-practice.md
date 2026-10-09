# FOL exercises

`logic-app name="fol-practice"` offers a formula builder, model and SQL tasks,
extension selection, and substitution gaps. Leveled tasks have a labeled strip, written feedback, the shared success confetti,
and the shared retry shake (both respect reduced motion).

| `exercise` | Other parameters | Task |
| --- | --- | --- |
| `builder` | none | Construct terms and formulas using typed formation rules |
| `model` | `model="people-relations" kind="model" view="tables"` | Modify a model to meet a truth-value target, or identify an impossible target |
| `initialize` | `model="world"` | Create the displayed tables and insert their rows |
| `extensions` | `model="family"` | Select satisfying objects or ordered tuples in the displayed domain |
| `substitution` | none | Complete capture-avoiding substitution pseudocode with named operations |
| `query` | `model="world"` | Write SQL for an open formula against a seeded database |

Levels live in `assets/js/apps/fol-practice-levels.js`. Model levels specify a
closed formula, target truth value, and, where needed, an impossibility
explanation. The model canvas exposes `folModel.get()` and `.set(model)` so the
exercise can evaluate the current interpretation using the shared evaluator.
The supplied model levels use the people-relations signature; adapting them
to another language requires matching formulas and starting denotations too.

SQL exercises use the same worker and SQL editor as chapter examples. Query
runs begin with the configured model and enable SQLite's `query_only` pragma.
Answers are compared as complete rows, ignoring order but rejecting duplicates,
wrong column counts, and truncated output. This checks the displayed database,
not equivalence over all databases; the exercise text states that distinction.
Initialization runs begin empty. Table buttons switch the model display between
the relations requested in the level. Checks compare table names, column names and
order, and all rows. Equivalent CREATE/INSERT spellings are accepted; schema
constraint declarations are not graded. Displayed object labels are the text
identifiers students must use in SQL.

Exercise levels reset attempts and retain completion marks while the page stays
open. They do not write to local storage. [Scope practice](fol-scope.md) uses
its own level strip and checks all quantifier bindings together.

Extension levels and substitution gaps live in `fol-semantics-practice.js`.
Extension answers are checked against the shared evaluator without pruning
distractors. Substitution checks the specified helper expressions, ignoring
whitespace, and never executes student input.

## Related

- [SQL execution](sql.md), [FOL models](fol.md), [chapter apps](README.md).
