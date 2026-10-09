# FOL exercises

`logic-app name="fol-practice"` offers a formula builder, model and SQL tasks,
extension selection, and substitution gaps. Leveled tasks have a labeled strip, written feedback, the shared success confetti,
and the shared retry shake (both respect reduced motion).

| `exercise` | Other parameters | Task |
| --- | --- | --- |
| `builder` | none | Construct terms and formulas using typed formation rules |
| `model` | `model="people-relations" kind="model" view="tables"` | Modify a model to meet a truth-value target, or identify an impossible target |
| `validity` | `model="finf-reasoning" kind="model" editable="false"` | Unfold truth conditions in a partial model to explore whether a countermodel is possible |
| `countermodel` | `model="people-relations" kind="model" view="tables"` | Make all inference premises true and the conclusion false |
| `initialize` | `model="world"` | Create the displayed tables and insert their rows |
| `extensions` | `model="family"` | Select satisfying objects or ordered tuples in the displayed domain |
| `substitution` | none | Complete capture-avoiding substitution pseudocode with named operations |
| `query` | `model="world"` | Write SQL for an open formula against a seeded database |

Chapter 8 levels live in `assets/js/apps/fol-practice-levels.js`. Chapter 9
countermodel levels and their checker live in `assets/js/logic/fol-countermodels.js`.
The nested model fills the exercise width. Fullscreen includes the level strip,
prompt, Check button, and feedback. View-button styles target buttons only.
Model-reasoning levels live in `assets/js/logic/fol-inference-exercises.js`.
Students select true/false formula requirements and unfold their semantic
conditions. Alternatives create separate cases; quantifier conditions introduce
witnesses or instantiate at pictured objects. Undo and levels retain work.
The shared model canvas shows established positive facts and known exclusions.
Set views place only known nonmembers outside a contour; graph labels distinguish
nonmembership from unknown membership. All requirements remain in the formula
panel.
A contradiction closes a case. All cases closed establishes validity; an open,
fully unfolded case is accepted only if the complete finite model passes the
shared evaluator on every premise and the negated conclusion. Unfinished cases
remain undecided. This bounded exercise is not a decision procedure for FOL.
Countermodel feedback identifies a false premise or a still-true conclusion;
success requires a complete, valid model satisfying all premises and falsifying
the conclusion. The same model editor, level strip, and completion feedback are used. Model levels specify a
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
