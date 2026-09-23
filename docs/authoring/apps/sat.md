# SAT apps

Use `logic-app name="sat" kind="…" formula="…"`. Kinds are `truth-table`,
`rewrite`, `resolution`, and `tseytin`. Named variables and ¬/∧/∨/↔/→ use the shared Boolean
parser and conventional precedence. The shared LaTeX input conversions apply.
Separate formulas with commas, semicolons, or new lines; ∴ (or ⊨) introduces
one conclusion. Optional outer braces enclose a formula list. Rewriting takes
one formula in a single-line input, as does Tseytin conversion. Other fields grow with their content.
Constants ⊤/⊥ are output notation, not accepted input.

Preset buttons use `data/sat-examples.json`; choosing one replaces the input and
restarts the trace. Descriptions identify the inference or circuit being tested. The CNF circuit comparison is shared across the algorithms; the truth-table
app also offers its equivalent DNF specification. Tseytin examples use weather
atoms for the input and fresh indexed names for subformulas.

Use `blank="true"` to start with an empty, editable field (for exercise tools).
Otherwise apps start with applied, read-only input; the pencil clears the calculation
and enables editing. Native first/previous/next/last buttons navigate. Work is
on the left, controls and explanations on the right, stacked on mobile.
Internal scrolling contains wide tables and derivations. The truth-table's
current cell has an underline, and row buttons select assignments.
The tree has a nested text alternative. Resolution starts with the retained
CNF clauses, then shows one inference at a time beside a numbered clause ledger
with parent/pivot references. Preprocessing runs in the engine but is not part
of the displayed trace. An expandable history records fully checked pairs.
Inference summaries use ∴ during calculation and ⊨ or ⊭ at completion.

## Engine and reuse

`assets/js/logic/sat.js` exports pure parsing, valuation enumeration, table,
rewrite, resolution, and Tseytin operations. Tseytin conversion names each
connective occurrence after its children, emits local CNF constraints, and
asserts the root. It handles arrows directly (at most four clauses per node)
and skips names already in the input. The app lists local name definitions beside the cumulative clauses; long
name lists are expandable. Table rows have stable numeric IDs, a
valuation, and keyed answer cells; answers are independent of revelation state.
The [SAT exercises](sat-practice.md) keep editable and gap-table entries
separate from these answer cells. Tables evaluate the SAT conjunction, including
the negated conclusion for an inference. Visible columns show variables,
conjuncts, and the final SAT value. The full conjunction is printed above the
table; intermediate subformulas appear beside it, with expandable row history.
No numbered formula aliases are used.

`assets/js/apps/rewrite-player.js` accepts formula/explanation trace entries
without knowing the rewrite rules. Later transformations can supply their own
traces. CNF/DNF rewriting uses root-first, left-to-right local replacements,
first eliminating arrows, then pushing negations inward and distributing.
Repetitions remain in the normal form; resolution handles them under its
clause convention. Display notation brackets compound clauses or
terms, omitting outer brackets and brackets within associative chains. It does
not generate canonical forms or perform absorption. Resolution forms the
conjunction of premises and negated conclusion, converts it to CNF internally,
retains parents, skips tautologies and duplicates,
and checks every unordered pair and pivot before reporting saturation. It
prioritizes the shorter parent length, then combined length, then line order;
new unit clauses are considered promptly.

## Bounds

Input: nine formulas, 512 characters each, eight distinct variables; tables:
six variables and 80 distinct subformula columns. Rewriting: 256 trace entries
and 2048 nodes per intermediate formula. Resolution:
160 stored clauses and 20,000 tested pairs. An interrupted conversion/search
reports undecided, never satisfiable. A successful resolution search decides
satisfiability but does not extract a model. The table marks witnesses.

## Related

- [App index](README.md), [chapter-app design](../../design/chapter-apps.md).
- [Boolean apps](boolean.md), [Tools appendix](../tools-appendix.md).
