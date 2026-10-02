# Goals and canvas layout

The “Goals” toggle, before the fullscreen icon, adds the target as a separate proof plan. “+ Goal” adds another plan.
Dashed formulas are unproved goals. Select one to use the ordinary rule menu
backwards, or right-click it for the applicable backward rules; the menu heading and border indicate that direction. Temporary
assumptions belong to their subgoal's scope. Forward proofs close matching goals
only within that scope; completed planned steps pass through the same kernel.
Hints inspect the selected goal and available conditionals. The strategies deck
replays its authored proofs backwards through these plans.

Save/Load includes plans and per-example drafts. Undo restores both proof and
plans. Deleting a proof node clears the plans because their assumption IDs may
change. Completed targets freeze inference controls until Restart or a different
example. Lemmas can still be saved from the completed proof.

Fullscreen is available from the canvas icon and F while focused (except in text
inputs). Wide trees fit down to 72% scale, then scroll on the canvas. Branches can
be folded to a vertical ellipsis at their conclusions. Native fullscreen falls back to a page overlay
where unavailable. The Lean walkthrough places code and derivation together;
small screens stack the two within the same app. Each `apply` has a rule-selection
step and a remaining-goal step, with different highlights.

Exporting a plan to Lean uses typed `sorry` holes for open goals, with an explicit
unfinished-proof comment. These are never imported as valid derivations: the
reverse translator still requires a completed proof in its supported fragment.

See [Natural deduction and Lean](deduction.md) for the proof checker and app modes.
