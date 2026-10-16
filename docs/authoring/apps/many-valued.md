# Many-valued chapter apps

`logic-app name="many-valued"` supports eight kinds:

- `models`: the nine SUN/RAIN information states, editable inferences, and
  countermodel checks. Values are 0, ω, and 1; only 1 is designated.
- `memberships`: editable predicate curves and membership readouts, before
  formula operations have been introduced.
- `policy`: a coldness curve driving heater power directly, with a temperature
  slider, linked output meter, and a short animated trace. Editing the curve
  changes the policy. The trace stops after four cycles and respects reduced motion.
- `predicates`: editable piecewise linear membership curves and formulas using
  unary predicates of x, negation, conjunction, and disjunction.
- `rules`: checks one to eight newline-separated A(x) ⇒ B(x) prescriptions
  throughout the temperature domain [0,30].
- `controller`: up to eight recommendations A(x) ↦ c with fixed outputs c in [0,1].
  Outputs are weighted averages, with zero as the no-rule fallback. Its examples
  are rule sets (off when warm, low when warm, cold only); its memberships are
  the chapter's and cannot be dragged, since the memberships app covers that.
- `aircon`: a [two-input controller diagram](fuzzy-controllers.md) comparing
  Sugeno outputs with Mamdani clipping, aggregation, and centroid defuzzification;
  both rule sets are editable.
- `defuzzify`: the last steps of a Mamdani controller. Sliders set the weights
  of the Low, Medium and High rules; the output sets are clipped at them and
  combined by maximum. Evenly spaced samples of the result are drawn as stems,
  a fulcrum marks their weighted average, and a dashed line the exact centroid;
  the sample spacing is chosen from 0.5 to 0.05. `defuzzify` in
  `assets/js/logic/fuzzy.js` computes both.

All use `title` for their accessible region name and support reset and
fullscreen; in fullscreen an app takes the page's paper, where the Boolean
apps' transparent background would show the browser's black backdrop. The `memberships`, `policy` and `defuzzify` kinds omit the formula field; the
other five kinds have editable formula or rule fields. Curve points support
pointer dragging, arrow keys, and numeric controls. Formula fields use the
shared conventional FOL parser and LaTeX input conversion. The predicate app
applies ¬/∧/∨ to the selected predicate, with a second predicate picker for
binary operations; a solid purple curve and shaded area distinguish
the selected combination from its component predicates.

K₃ extends the Boolean evaluator and world-space renderer. Existing Boolean
calls keep two-valued semantics; pure helpers accept an optional `logic='k3'`.
The algebra walkthrough uses `name="boolean" kind="derivation" logic="k3"
preset="absorption"`, with equations in `data/kleene-derivations.json`.
[Priest’s K₃ proof canvas](deduction-k3.md) extends the existing ND app.

Fuzzy semantics lives in `assets/js/logic/fuzzy.js`. Rule verification includes
all curve knots and intersections introduced by min/max, so it checks entire
piecewise linear interpretations rather than a sample of temperatures.
Controller curves are sampled for display; numeric outputs use the actual
membership functions. Controllers combine recommendations and do not enforce
the inequalities checked by the rule app.

## SQL presets

[Executable SQL](sql.md) accepts `setup="kleene-countries"`, `setup="kleene-languages"`, or
`setup="kleene-pairs"` / `setup="kleene-values"` to load SQL from `data/sql/<name>.json`. These presets
use ordinary tables and inserts, including all nine pairs of truth-values.
They contain actual SQL NULLs, which are not FOL objects. `initialize="true"`
displays the setup as the editable source; pair it with `empty="true"` to run
initialization. Otherwise the shortcode body supplies the editable query.
Every run starts afresh.
The languages preset is the countries preset's `LanguageOf` table alone, for
lecture 10's initialization/query switch; Zimbabwe has a NULL language.
