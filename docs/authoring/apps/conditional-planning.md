# Conditional planning app

Use `logic-app name="conditionals" kind="planning"`. The default is a two-block
world with three initial-configuration buttons. `example="three"` and
`example="monkey"` select exercise worlds. `frames="chapter"` populates the two
frame boxes; otherwise they begin empty. Positive frames preserve true fluents;
negative frames preserve false ones. The boxes grow with their contents. All inputs remain editable. Changing
an input clears the previous result. Horizons are one to six action steps.

State fields display indexed atoms: time 0 initially and the horizon at the goal.
The shared planning parser also accepts unindexed atoms at the field’s time,
spaces/commas/semicolons between atoms, and missing commas in block arguments.
Explicit wrong time indices are rejected. This convention is visible beside the
fields; changing the horizon updates a valid goal’s displayed indices. With **Complete initial state**
selected, unlisted initial fluents are false. Without it, they are unconstrained:
the solver chooses one permitted starting state. Goal conditions are always
partial. This is existential bounded planning, not a plan guaranteed to succeed
from every permitted initial state.

`assets/js/logic/planning.js` encodes state constraints, action preconditions
and effects, exactly one action, and the instantiated frame formulas. Tseytin
encoding feeds bounded DPLL with unit propagation. Wait is preferred when
permitted, exposing missing frames. Unexplained state changes are marked in the
model. Resource exhaustion is distinct from unsatisfiability at a given horizon.

The model uses the supplied table, mascot and instruction-board SVGs. Table
and cube sizes follow the setup drawing's coordinate proportions, scaling together. Movable
cubes reuse the three groups forming the top cube in
`con_ai_plan_blocks_red_on_green.svg`; their path geometry stays unchanged,
and fills use the red, green and blue from the author's block drawings. The
framed goal depicts compatible block arrangements (up to three, then a count).
The monkey exercise uses the supplied `cond_ex_box_closed.svg` and
`cond_ex_banana.svg` drawings. A camera button downloads the currently displayed
model through the shared local PNG exporter. Neither renderer
changes the logical encoding.

## Exercise mode

`exercise="true"` starts the initial, goal and frame fields empty and omits the
frame-fill button. Separate initial/goal drawings carry no symbolic answers.
Students first check their vocabulary: the four additional ordered block-pair
atoms for the three-block task, or the three relevant atoms from the monkey
exercise's constrained vocabulary. Changing the vocabulary invalidates its check.

Before solving, the app compares the student's state descriptions with the task
semantically, over legal block arrangements or the monkey's eight Boolean states.
`none` explicitly describes an initially all-false state. Frame conditions remain
the student's responsibility: absent or insufficient frames can still permit
miracle models, which the exercise asks them to diagnose.

The monkey starts beside the box. Its three actions are PushBox, Climb and
TakeBanana, with a default horizon of three; Wait is also available.
The monkey exercise uses three explicit conditions in each frame box, one per
line (semicolons also separate conditions). State and action names take `t` or,
for the next state, `t+1`. Trailing full stops are accepted. The older
`F`/`Add`/`Remove` schemata remain accepted for compatibility, but the exercise
and solution use the named fluents and actions.

## Related

- [Conditional reasoning apps](conditionals.md).
- [Figures](../figures.md), [Chapter app design](../../design/chapter-apps.md).
