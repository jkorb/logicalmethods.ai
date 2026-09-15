# Display mathematics

Formal displays (`.math-display`) and illustrated sets (`.set-figure`) share the
same type size, regular weight and vertical rhythm. Picture members are 1.6em
high and braces 1.45em, relative to the surrounding set text. An illustrated
set should read as an expression, rather than as a large diagram.

`assets/js/display-math.js` measures each display at its normal font size and
reduces that size only when its widest line exceeds the column. It remeasures
after shrinking to account for glyph rounding, tab stops and fixed spacing,
with a bounded number of corrections before the scroll fallback. It refits after
fonts load, column resizing and hidden exercise solutions becoming visible,
and restores the normal size when space permits. It never changes source-code
blocks or formula text. The scroll container remains a fallback without
JavaScript or for legacy fixed-size images. Authors should still break very
long derivations into meaningful lines rather than rely on extreme shrinking.

## Related

- [Notation](notation.md) — the display conventions authors follow.
- [Browser suites](../testing/browser-suites.md) — `display-math.spec.mjs`.
