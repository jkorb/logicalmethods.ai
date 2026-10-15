# Probability tables and classifiers

`logic-app name="probability"` supports four kinds:

| Kind | Content |
| --- | --- |
| `table` (default) | SUN/RAIN models, weighted truth-table and a cumulative calculation. |
| `dice` | Six one-hot valuations of D₁–D₆, depicted by die faces. |
| `support` | Premises and conclusion, editable table, measure cards and probability sliders. |
| `bayes` | Editable email alongside marker likelihoods, calculation and verdict. |

Use `formula`, `condition`, `preset`, and `title` to configure an instance.
Weather presets are `uniform`, `sunny`, and `dependent`. Support also accepts
`preset="sender" formula="Unknown ∴ SPAM"`. Dice start with the fair die;
EVEN, HIGH and TWO abbreviate D₂ ∨ D₄ ∨ D₆, D₄ ∨ D₅ ∨ D₆ and D₂.
Fields accept conventional formulas and the shared LaTeX input commands.

Table masses accept decimals or fractions. Invalid sums suppress calculations;
Normalize rescales nonnegative weights. Navigation or selecting a model steps
through the sum. The final probability appears after the last model. Weather
pictures use the Boolean chapter's model-space artwork and proposition renderer.
A zero-probability condition leaves the conditional probability undefined.

Support cards can select several measures together. All graphs have posterior
probability on the horizontal axis. Sliders change prior, evidence probability
and posterior within their feasible ranges, preserving logically empty regions.
The prior and evidence sliders rescale the models inside and outside the selected
proposition. If a set had zero mass, its starting proportions are restored
(uniformly when its starting mass was also zero). The posterior slider keeps the
prior and evidence probability fixed and redistributes the four joint regions.
Shading marks infeasible posterior ranges; open curve ends mark infinite limits.
The card values are accessible readouts for the plotted current points. Logs use
natural logarithms, written log; infinite limits are reported separately.

The Bernoulli classifier detects “urgent” in the subject, exclamation marks and
money words (`money`, `invest`, `investment`, `cash`, `prize`) or currency symbols
anywhere, plus a manually specified known sender. Classify freezes the email and
highlights detected strings; the edit icon reopens it. Absent features contribute
complement likelihoods. Editable priors, likelihoods and threshold are in the
Probabilities and threshold disclosure. Editing clears the old verdict. Both
zero scores leave the posterior undefined.

Calculations are in `assets/js/logic/probability.js`; UI code is in
`assets/js/apps/probability.js`. Tests live in `tests/unit/probability.test.mjs`
and `tests/browser/probability.spec.mjs`.

## Related

- [Probability exercises](probability-practice.md)

- [Chapter apps](README.md)
- [Chapter app design](../../design/chapter-apps.md)
