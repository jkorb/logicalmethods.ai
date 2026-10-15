# Probability exercises

The probability app supplies these exercise modes:

| Shortcode options | Task |
| --- | --- |
| `kind="practice" exercise="weights"` | Set four model weights to satisfy simultaneous probability constraints. |
| `kind="practice" exercise="calculate"` | Select true rows in an eight-model SUN/RAIN/WIND table and enter their total probability. |
| `kind="practice" exercise="independence"` | Identify independence or construct a distribution with the requested dependence. |
| `kind="bayes" exercise="trick"` | Change permitted classifier probabilities to send a fixed spam email to the inbox. |

Use `name="probability"` and a descriptive `title` for all modes. The table
exercises share the chapter's number parsing, probability calculations, and
model images. The eight-model exercise uses the Boolean three-atom artwork;
selecting a table row and selecting a pictured world update the same set.
The displayed sum lists the selected weights without calculating the answer.
Checks require every true row, including rows of weight zero, and the correct
numeric answer. Fractions and decimals are accepted with tolerance 0.000001.

Levels retain drafts during the page visit and mark completed tasks. Reset
restores the current level. Shared level feedback supplies confetti and
reduced-motion-aware error shaking. Every task has a highlighted panel;
checks report separately whether the distribution, constraints, row selection,
or arithmetic needs correction.

The spam levels reuse the chapter's classifier. Email, detected markers, and
threshold are fixed. Level 1 permits only the prior to change; level 2 fixes
the prior and permits likelihoods between 0.05 and 0.95. Classify also checks
the task. Reset and level changes clear the previous verdict.

Pure levels and graders: `assets/js/logic/probability-practice.js`.
UI: `assets/js/apps/probability-practice.js`, with classifier integration in
`probability.js`. Tests cover witnesses for all levels, rejected answers,
boundaries, drafts, keyboard selection, accessibility, and mobile layout.

## Related

- [Probability chapter apps](probability.md)
- [Solution disclosure](../solutions.md)
