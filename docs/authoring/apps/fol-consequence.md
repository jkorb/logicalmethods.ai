# Partial model reasoning

`logic-app name="fol-model" kind="consequence" model="finf-socrates"` adds a
chapter 9 mode to the model canvas. `finf-successor` supplies the mathematical
example. `finf-distribution` and `finf-shared-witness` supply the worked model
arguments in the chapter 9 exercises. Chapter 8's complete-model modes are unchanged.

The configuration supplies `language`, `objects`, `model` (display data only),
`premises`, `goal`, and optionally an authored `walkthrough`. Each authored step
has a `formula`, `explanation`, and optional `known` atomic formulas or an
`arbitrary` object name. Its last step supplies the result. These examples are
mathematical arguments written by the author, not outputs of finite model checking.

This mode uses the ordinary model/evaluation shell, including facts, tables,
graph, sets, zoom, fullscreen, and the explanation column. Completeness validation
is skipped only here. Its partial renderer shows known tuples without interpreting
missing tuples as false, and unknown function values as `?`. Sets show known
members only; unknown members are never placed outside a contour. The depicted
domain is open. Different term labels need not denote different objects.

Premise buttons select known information. With all premises and the original
goal, navigation follows the authored argument and adds its established facts
to the picture. Editing the conclusion or removing a premise uses the bounded
search below. Hypothetical subproof facts do not enter the model picture.

`logic/fol-consequence.js` checks closed formulas in a fixed signature. Its
bounded backward search instantiates universal atomic or Horn premises, uses
conjunctions, and introduces implications and quantifiers. Universal goals use
fresh arbitrary objects; existential goals try available terms and one layer
of function applications. It also searches for the goal's negation. Results are
true, false, unknown, or inconsistent information. Unknown is a search outcome,
not a third FOL truth-value or proof that the premises fail to entail the goal.
Limits are 600 recursive calls, depth 10, and at most 48 candidate terms/bindings.
It does not eliminate existential premises or implement general FOL proof search.

The finite countermodel uses ordinary `kind="evaluate"` with a complete model,
checking the premises together with the negated conclusion. It is distinct
from the arbitrary-model fragment used in a validity argument.

The exercise mode `fol-practice exercise="validity"` reuses this partial renderer
with student-selected truth-condition unfolding. Its `folModel.set(model,
{partial, negative})` call supplies known exclusions and switches to a complete interpretation only after a countermodel
has been checked. See [FOL exercises](fol-practice.md).

On tool pages, the same shortcode starts with an empty inference field. Readers
supply semicolon-separated premises and a conclusion after `∴`. The tool infers
the signature using the inference parser's naming convention, then mounts the
partial model display and bounded search for that input. There is no authored
walkthrough or preselected chapter example.

## Related

- [Model canvas](fol.md), [model data](fol-data.md), [FOL inference](fol-inference.md).
