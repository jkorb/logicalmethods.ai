# The formula builder

```go-html-template
{{</* logic-app name="builder" target="((p₁ ∧ p₃) → ¬p₂)" */>}}
{{</* logic-app name="builder" levels="true" */>}}
```

It only lets the reader do what the inductive definition allows: add an atom,
select one or two formulas already on the board, and apply an operator. A
formula that has been used is spent, so the only way to reach the target is to
construct it — there is no field to type a formula into. Give it either a
`target` (a chapter demonstration) or `levels="true"` (the twelve targets in
`assets/js/apps/formula-builder.js`, ordered by how many steps they take);
asking for both, or neither, is an error at build time. Targets are compared as
text against the labels the board builds, so they have to be spelled the way
`printFormula` spells a formula — the unit tests check every level against the
chapter's own grammar, and that each level's atoms are atoms. The chapter copy
sits right after the worked construction it mirrors; completed levels are
remembered in `localStorage`.

The builder accepts `variables="plain"` to display its twelve exercise targets
using p, q, and r.

It grew out of a canvas prototype on the `tools` branch. The interaction is
that prototype's; the drawing is not. Nodes are buttons in a DOM tree so the
board is reachable by keyboard and readable by a screen reader, the lines
between them are CSS borders rather than a measured overlay, and the colours
are tokens. The builder is not in the tools appendix: both copies carry a
target to reach, which makes them exercises rather than something to check your
own work with.
