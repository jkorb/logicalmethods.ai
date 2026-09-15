# Accessibility, keyboard and reflow suites

Three browser suites guard the redesign. They run as part of `npm test`.

| File | Guards |
| --- | --- |
| `tests/browser/a11y.spec.mjs` | axe-core across ten routes at WCAG 2.2 AA, plus `/textbook/boolean/` in both light and dark mode. |
| `tests/browser/keyboard.spec.mjs` | The skip link is the first tab stop; chapter navigation is reachable; every tab stop has a name and a visible focus ring; prev/next point at the right neighbors. |
| `tests/browser/reflow.spec.mjs` | No horizontal scrollbar at 320&nbsp;px on eight routes (WCAG 1.4.10). |
| `tests/browser/privacy.spec.mjs` | No page contacts another host on load; the built HTML links nothing off-site; an embedded deck loads only when pressed; local storage holds only the keys the About page names, and no cookies are set. |

The keyboard and reflow checks exist because axe cannot see either problem, and
both were real defects before the redesign: chapter navigation carried
`tabindex="-1"`, and truth tables and code blocks pushed the page sideways.

Accepted axe findings go in `tests/a11y-exceptions.json` as
`{"id": "...", "reason": "..."}`. A finding without a written reason is not an
exception. `layouts/tutoraat/` and `layouts/verdiepingspakketten/` are out of scope
and are not audited.

## Suite coverage notes

Parser checks live in `tests/unit/parser.test.mjs` and
`tests/browser/parser-app.spec.mjs`. They cover strict and conventional syntax,
negation scope, precedence, grouping, invalid input, immutable trace snapshots,
LaTeX conversion, keyboard operation, exercise disclosure, no-JavaScript
fallback, reflow, and light/dark accessibility.

The parser browser tests also check read-only initialization, pencil editing,
resubmission, icon navigation, the text-tree toggle, and numeric LaTeX subscripts.
Parser tests cover immediate typing and paste conversion, including `\to` /
`\top` and multi-digit subscripts, as well as switching node labels without
losing the trace. Controls are checked for a stable position above the tree.
The notation appendix's cheat sheet should agree with
`assets/js/apps/latex-input.js`; unit checks cover its conversion examples.

The glossary's persistent-hover test intentionally skips the mobile project:
touch has no persistent hover. The other glossary checks run on both projects.

`tests/browser/display-math.spec.mjs` checks trimmed display boundaries, fitting
at desktop and mobile widths, restoration after widening, unchanged formula
text and source-code sizing, set proportions, and the parser accessibility
button's lower-right placement.

`tests/unit/rendering.test.mjs` builds an isolated Hugo fixture to check the
shared math hook, literal code, escaped dollars and color qualifiers, together
with direct SVG exports and repeated-image IDs. The app independence test uses
the two real instances in Appendix C. Accessibility and reflow checks include
Formal Languages, the Tools appendix and a representative assignment page.

## Related

- [Maintaining the tests](maintaining.md) — how to add a spec, and manual review.
- [Matching CI locally](ci-parity.md) — slide suites and timeouts.
