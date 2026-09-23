# Boolean circuits and workbench

Use `logic-app name="boolean" kind="circuit" preset="…"` for a fixed circuit.
Presets are `relay-off`, `relay-on`, `not`, `and`, `or`, `implementations`, `half`,
`full`, `nand`, `nand-faulty`, `negated-input`, `sat-three`, and `sat-branch`.
The SAT presets compute ¬(X ∧ Y) ∧ Z and ¬(X ∧ Y) ∧ ¬(Y ∧ Z); their
canvas height includes the lower inputs. `negated-input` combines a
powered default-on relay with a default-off relay to compute ¬X ∧ Y. The faulty NAND preset connects the lamp
directly to the default-off relay, implementing AND. The NAND preset connects a default-off relay to a
powered default-on relay, with the same rendering and input switches. `implementations` provides NOT/AND/OR buttons. Relay diagrams show
magnetic arcs only while the magnet is powered; the normally closed contact
opens toward the magnet.

Use `title="Circuit A"` to give repeated circuit panels distinct accessible names.
Fixed circuits accept `input-labels="INPUT₁,INPUT₂"` to relabel their input
switches. For the NAND illustration, `examples="inputs"` adds buttons for
the four assignments. Internal circuit identifiers are unchanged.

Signals travel upward, function boxes are blue, and powered lamps gain rays.
Powered wires are green with moving dashes; unpowered wires are solid red.
The supply below a manual switch stays powered. Every switch has a pivot and a
fixed contact, supports keyboard activation, and reports its state. A labelled Pause/Play
button controls motion; with reduced motion it is disabled and labelled “Motion off”.

`kind="two-bit"` connects two full adders. Four switches select the two input
numbers, grouped by operand (X₁, X₀, Y₁, Y₀). Only “Record this sum” fills a cell in the 4×4 addition table; changing inputs
does not record intermediate configurations. The column calculation and table
sit alongside each other. Carries of 1 are small red subscripts at the lower right of the second summand
in their destination columns; zero carries remain blank. “Decimal table” switches table notation
without changing the circuit or calculation. The result has three bits,
including the final carry. Reloading resets discoveries.

`kind="ripple-adder" bits="3"` reuses the same circuit renderer for a three-bit
checker, without the discovery table. Exercise checkers may sit inside native
`<details>` so readers calculate first. Switch updates preserve the viewport.

`kind="workbench"` is an exercise in acyclic combinational circuits with two
inputs X/Y (or X for a unary target), one output, and up to twenty gates.
Task profiles in `data/boolean-exercises.json` define targets, allowed gates, and
whether successful checks unlock new gates/tasks. The presets `relays`,
`definitions` and `nand-circuits` select these profiles; without a preset the
original progressive XOR/NAND/NOR/XNOR sequence applies. Each target has a
function table. Checking shows the circuit's function table with incorrect
outputs red and underlined. Task switching retains circuits during the page visit.

Readers add and drag boxes, connect output dots to input dots, or open the connection controls below the canvas.
Selected gates and connected input dots expose small removal controls; removing
an input connection clears all parallel branches at that port. Pins and attached wires follow boxes during dragging. Arrow keys move a focused gate; Escape cancels a
pending wire. Input connection ports sit above the switch hit areas, joined by a short wire.
Fan-out and repeated inputs are supported. Feedback is rejected;
unconnected inputs propagate unknown values. Deleting a gate clears its outgoing
connections. Edits clear previous check results. There is no persistence, editable circuit import/export, or support for sequential circuits.
The canvas has more internal room for relays and grows with new rows. Its rendered
height fits within 60% of the viewport; the target table sits beside it on wider
screens. The palette has component previews; Check and Clear share a control row.
Check feedback has a separate green or red panel; its function table is not repeated
in the live output message.

## Related

- [Boolean chapter apps](boolean.md) — evaluation, derivations, model spaces.

The relay profile offers only default-off/on relays, with separate magnet and
signal-supply ports, plus a fixed POWER source. A relay input may join several
source wires in parallel (Boolean OR); ordinary gate profiles retain one source
per input. Clicking a connected source in the inspector disconnects that branch.
All branches participate in cycle detection. The tasks remain NAND, XOR and XNOR.
