# Conditional exercises

Use `logic-app name="conditional-practice" kind="chaining|horn|wason|equivalence"`.
The activities have keyboard-operable selections, written feedback and the
shared reduced-motion-aware confetti. Incorrect attempts preserve the work.

Chaining offers Storm, Blizzard and Circular rules, with separately labelled Levels and Algorithm buttons. Known facts remain visible
in both directions; the backward action is labelled “Reason backwards”.
Optional `kb="…"` (semicolon-separated rules) and `goal="…"` provide a custom task.
Students select a conditional and exactly its known antecedent facts to apply
MP. Derived facts become selectable buttons; selection clears after each step.
In backward mode they select an open goal and a matching rule
for backward search. Given facts close goals; failed attempts return to the
parent for another rule. Choices tried on a branch are remembered. Undo restores
the previous state; changing direction or query restarts. The centered ASK query identifies the task; a ruled panel contains the proof.
The accessibility button at the end reveals the full text derivation and step
history. Labels use the prose font. The app permits either
subgoal order; the exercise explains how to follow depth-first search.
`assets/js/logic/conditional-practice.js` owns the immutable sessions separately
from the UI. This is proof construction, not playback of the chapter trace.

`part="selection"` and `part="examples"` place the two Horn interactions
separately beneath their questions. Horn selection asks about equivalence to a conjunction of Horn clauses. The
formula checker exhaustively tests intersection closure over RAIN, SUN and
SNOW. Three fields collect semantically distinct non-Horn-definable answers; one
centered Check button validates them together and marks incorrect or repeated
entries. It reports the result without requiring students to use the intersection-closure proof.
It does not reject a formula merely because its written form is not Horn.

Wason has two levels using `wason.svg` and `wason_domain.svg`. Four labelled
selection buttons overlay each drawing. Checking requires exactly the two cards
that could hide a violation; no hidden card faces are invented. Selected captions
carry the highlight; the card hit areas remain transparent.

The equivalence checker accepts any DNF over RAIN and SUN with the truth-table
of their biconditional, including reordered terms and conventional notation.

## Related

- [Conditional reasoning](conditionals.md), [planning](conditional-planning.md).
- [SAT exercises](sat-practice.md), [chapter app design](../../design/chapter-apps.md).
