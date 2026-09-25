# SAT exercises

Use `logic-app name="sat-practice" kind="table|gaps|mystery|resolution|circuit|normal-form"`.
Levels come from `data/sat-practice.json`; `deck="…"` selects another deck for
that interaction. For table, gaps, or resolution, `formula="…"` supplies one
custom exercise. Selecting a level restarts its work. Completed levels retain
a green check mark during the page visit; success uses the shared confetti.
Written solutions remain on the sheet.

- Normal-form checking has separate DNF and CNF fields for each function table.
  Answers must be equivalent and in the requested form, using INPUT₁ and INPUT₂.
  Both official bracketing and conventional precedence are accepted.
- Table construction checks comma-separated variable names and row count.
  Students match compound nodes in the supplied parse tree to column headings,
  then enter the values. Selecting a cell highlights its subtree and annotates
  the leaves with that row's assignment. Formula buttons supply the task list.
- Gap tables use the same columns and keyed answers, with a deterministic subset
  of compound cells left editable. Assigned variable values remain given.
- Mystery formulas are entered in the final table heading. Semantic checking
  accepts equivalent spellings and omitted irrelevant variables, and supplies
  counterexamples. The `equivalence` deck adds prompts about changed XNOR inputs
  and three-way agreement; an optional `allowed` array restricts connectives.
- Circuit levels reuse fixed Boolean relay presets. Answers may use only the
  circuit's displayed INPUT₁, INPUT₂, … variables, negation and conjunction. Checking compares the
  formula with the actual circuit on every assignment.
- Resolution starts with CNF. Its numbered clauses wrap into compact columns;
  the labelled pivot, Resolve and Saturated? controls sit above Undo and Restart. Select two clause buttons and a pivot. Parents
  remain; derived clauses record ancestry. Undo restores the previous state.
  Tautological resolvents remain visible as muted, non-selectable entries labelled
  “Discarded: tautology”, with parent and pivot references. Undo removes them.
  History includes duplicate and tautological resolvents. Saturation requires
  checking every pair/pivot choice, including choices involving new clauses.
- The `inference` resolution deck first asks for CNF clauses, separated by commas
  or conjoined. It checks their equivalence to premises plus negated conclusion
  before starting the proof. The `conditional-inference` deck instead accepts
  the SAT formula and converts it to CNF automatically before displaying the
  clauses. The resulting CNF stays visible above the clause choices until Edit
  is selected. Both check the student's reduction before starting. The field stays
  read-only until Edit is selected.

## Reuse

`assets/js/logic/sat-practice.js` exports pure table validation, semantic answer
checking, and immutable resolution sessions. Sessions store clauses, checked
pair/pivot keys, and derivation history. The UI owns selection, undo and levels;
later knowledge-base tools can use sessions independently. Tautological inputs
and duplicates are discarded. Non-CNF input is rejected, and the 160-clause
limit reports an unfinished task rather than satisfiability.

Tables reuse the SAT engine's stable row IDs and formula keys; student entries
remain separate from answers. Tree selection uses the optional `onSelect` and
`nodeDescription` options of the shared renderer, with keyboard activation.
Inputs, concise icon buttons, blue selection, and reduced-motion feedback follow
[app design](../../design/chapter-apps.md). Incorrect cells retain their values
and are marked with `aria-invalid`.

## Related

- [SAT demonstrations](sat.md), [app index](README.md).
