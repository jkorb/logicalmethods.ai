# Fuzzy controller diagrams

`logic-app name="many-valued" kind="aircon"` displays a room controller.
Its predicates interpret real numbers: x measures temperature in °C, and y
measures relative humidity in percent. The displayed ranges are [16,36] and
[0,100].
Temperature and relative-humidity sliders feed two membership plots, three
rule-weight cards, and an output plot joined by arrows. The diagram stacks on
narrow screens. Reset restores 26°C, 70% humidity, both original rule sets, and Sugeno mode; fullscreen
uses the existing app control.

The initial rules recommend medium cooling for Warm ∧ Humid, high cooling for
Hot, and low cooling for ¬Hot ∧ ¬(Warm ∧ Humid). `airconCurves` in
`assets/js/logic/fuzzy.js` defines the input memberships. Every state activates
at least one initial rule. Edited rules may leave gaps; both modes fall back
to zero cooling when no rule applies.

- **Sugeno:** initially recommends 0.7, 1, and 0. The plot displays their rule weights;
  the dashed line marks the weighted average.
- **Mamdani:** `coolingSets` defines low, medium, and high power curves. Each is
  clipped by its rule weight, then aggregated by maximum. The dashed line marks
  the centroid of the aggregate area.

The formula field uses the course's frozen input, Edit, and Check controls.
Students can edit one to eight rule conditions using IsWarm(x), IsHot(x),
IsHumid(y), ¬, ∧, and ∨. Sugeno consequents are numbers in [0,1]; Mamdani
consequents are Low, Medium, or High. Each mode retains its own rules and
unfinished draft when switching. The diagram always uses the last checked
rules, and marks pending changes. `parseAirconRules` validates the syntax
and measurement variables before a change reaches the calculation.

`combineCurves` includes intersections introduced by min/max. `centroid`
integrates each linear segment analytically, including its first moment;
calculation does not depend on display sampling. Zero area returns zero.
The browser app lives in `assets/js/apps/aircon-controller.js`. Unit tests
check known centroids, input combinations, coverage, and output bounds; browser
tests exercise both modes, sliders, reset, accessibility, and responsive layout.

The controller methods follow the [MathWorks inference description](https://www.mathworks.com/help/fuzzy/types-of-fuzzy-inference-systems.html).
The membership curves and recommended settings are course examples, not a
calibrated controller for a physical AC unit.

See [many-valued apps](many-valued.md) for the editable one-input heater.
