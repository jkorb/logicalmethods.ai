# Many-valued exercises

`logic-app name="mv-practice" exercise="…" title="…"` supplies six leveled
exercises on `/exercises/many-valued/`:

| `exercise` | Student task |
| --- | --- |
| `inference` | Write a K₃ countermodel query, then choose ⊨ or ⊭. |
| `laws` | Write a query comparing the displayed Kleene identity's sides. |
| `curves` | Drag Fast/Slow memberships to satisfy endpoint and gray-band constraints. |
| `rules` | Modify the same memberships to satisfy fuzzy rules everywhere. |
| `counterexamples` | Choose degrees that refute a degree-preserving inference. |
| `braking` | Choose Sugeno outputs or Mamdani output sets for three speed checkpoints. |

The shared level strip retains drafts during the page visit and marks completed
levels. Checks use the standard celebration and reduced-motion-aware error
feedback. Reset restores the current task; fullscreen enlarges the workspace.
Each level has a highlighted task. Grabbing a curve adjusts its neighboring
supports on the fixed speed grid (0, 40, 80, 120 km/h); it never inserts a new
point. Only task-specific checkpoints are drawn as dots. Curve keyboard controls
use left/right to choose a speed and up/down to change its degree; numeric
speed and degree inputs offer the same operation. Predicate tasks check their
stated endpoints and monotonicity; rule tasks impose only the listed rules
and degree bounds.

SQL uses the [local SQLite worker](sql.md) with a fresh 27-row table per run.
Assessment compares the complete result with independently calculated
countermodels; inference levels require a matching query before classification.
The worker rejects writes during these query tasks. It checks returned rows,
not the student's chosen SQL syntax.

Pure data and graders live in `assets/js/logic/many-valued-practice.js`.
Curve checks include all corners, so the inequalities hold between them too.
The `braking` exercise models requested power while a train braking signal is
active. It supplies overlapping Slow/Moderate/Fast interpretations on 0–120 km/h.
Slow and Fast are complements; Moderate adds a triangular peak at 60 km/h.
The total weight varies from 1 to 2, so normalization produces curved output.
Membership degrees determine the rule weights, as in the chapter; there are no
extra strength multipliers. Two Sugeno levels ask for recommended outputs, a third adds a smoothness
condition, and the fourth asks for Mamdani output sets. All power values use the 0–1 scale. Three
speed checkpoints are graded. Mamdani clips the three output curves, combines
them by maximum, and calculates the exact centroid, including overlapping sets.
The Medium triangle extends 0.2 to either side of its adjustable peak.
A speed slider (or a click on the response graph) selects a Mamdani calculation.
The output diagram shows dashed original sets, solid clipped sets, their shaded
pointwise maximum, and the centroid's power coordinate. The same output is
marked on the response graph. Inspection preserves feedback and output settings;
its speed is retained with the level draft and restored to 60 km/h by Reset.

[K₃ derivations](deduction-k3.md) use the shared proof canvas separately.
Unit tests compare SQL with SQLite and Mamdani output with polygon centroids;
browser tests cover levels, feedback, input, accessibility, and responsive layout.

## Smooth controller output

Level 3 of `braking` reuses the supplied memberships and the three Sugeno
output controls. Endpoint targets exclude constant
power. The grader compares the exact one-sided slopes at 60 km/h, the only
possible interior corner; dashed tangent guides make their directions visible.
The join is smooth exactly when the Moderate output is the mean of the other
two outputs. Students adjust values and use Check without calculating derivatives.

## Static diagram

`fuzzy-diagrams kind="inputs"` displays the supplied Slow/Moderate/Fast
interpretations. It renders without JavaScript and has a screen-reader
description. Its stylesheet loads only on pages using the shortcode.
