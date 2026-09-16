# Introductory exercise apps

`notation-practice` checks conversion in both directions, preserving the exact
AST. Its two modes are always-visible buttons; switching mode clears the current
answer and keeps the same example. Conventional answers must omit every redundant pair of brackets; mere
logical equivalence does not count. `shunting-yard` shows immutable input,
stack, and output snapshots. Both use the chapter parser's priorities and
require explicit grouping for repeated equivalences. `reasoning-practice`
presents twelve cases from `data/reasoning-practice.json`, distinguishing a
deductive guarantee, inductive support, and insufficient support. It records
first answers for the current round, explains each case, and permits review
and restart. Its no-JavaScript version includes expandable feedback.

Self-checking app exercises do not need duplicate solution blocks. Retain
written solutions when an exercise also asks for explanations or an algorithm.

The preamble exercises use Unicode math in Comic Shanns, including HTML sub/sup
tags where needed; literal LaTeX solutions remain in code spans. They no longer
enable KaTeX.

## Related

- [The formula builder](formula-builder.md) — `variables="plain"` for exercise targets.
- [Solutions and passwords](../solutions.md).
