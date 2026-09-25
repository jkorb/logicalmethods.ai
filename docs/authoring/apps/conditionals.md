# Conditional reasoning apps

Use `logic-app name="conditionals"` with `kind="chaining"`, `kind="comparison"`,
`kind="horn"`, or [planning](conditional-planning.md). `title` gives the app its
accessible name. Each instance owns its inputs and trace.

Chaining accepts one fact, definite rule, or definite clause per line and an
atomic ASK query. `method="forward"` or `method="backward"` fixes the procedure;
omitting it shows an always-enabled algorithm selector. Start/Edit and step navigation share a control row; the comparison retains
separate step controls for its two searches. **Edit** enables KB
and query changes. Supply `kb="…"` (semicolon-separated entries) and `goal="…"`
for an authored exercise. Otherwise `example="rainbow"`, `"alternatives"`,
`"cycle"`, or `"missing"` chooses a preset.

Forward mode follows the chapter's repeated-scan pseudocode. Backward mode uses
depth-first search and branch-local cycle detection. `kind="comparison"` places
breadth-first forward rounds beside depth-first backward search, with independent
step controls and records of derived facts. Direction and search order are
separate choices; the comparison is specifically configured to illustrate both.

Proofs use premises above an inference line, including the applied conditional,
and a conclusion below. Pending backward inferences have dashed lines and the
label “to prove”. Long proofs abbreviate earlier derivations after four levels;
the accessibility button below the app reveals the full text proof.
Single-player proof histories accompany that alternative; the comparison keeps
its histories visible for comparing the searches. A ruled panel frames the tree. Trees use the available width,
shrink no further than 14px, then wrap premise groups. Frozen KB inputs display
as a grid of formulas; Edit restores the one-entry-per-line textarea. The current-step explanation uses the blue active-step wash and left rule,
with the pseudocode line on a quieter paper surface. Instruction labels connect steps
to the pseudocode; these are not executable-code debuggers.

Horn mode additionally accepts negative-only clauses and `⊥` heads. It uses
indexed premise counters and a FIFO agenda. Its examples are `sat`, `unsat`,
and `refutation`. Pure algorithms and trace data live in
`assets/js/logic/conditionals.js`, separately from the display.

The `pseudocode-practice` app accepts `deck="conditionals"` for agendas and
`prove_all`. Its three levels now require complete conditions and arguments for duplicate
filtering, premise counters and alternative-rule search. They list helper
meanings without giving an answer bank. Written exercises ask students to trace
duplicate entries and explain premature returns and counter updates.

## Related

- [Planning app](conditional-planning.md).
- [Chapter app design](../../design/chapter-apps.md).
- [SAT apps](sat.md), [Pseudocode](../pseudocode.md).
