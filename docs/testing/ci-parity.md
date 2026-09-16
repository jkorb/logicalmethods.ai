# Matching CI locally

Use the published URL spelling in browser tests: Hugo emits `/textbook/fol/`
even though the source bundle is named `FOL`. The test server and link checker
require exact path case on macOS as well as Linux, and page audits assert HTTP
200 before checking accessibility or layout. This prevents a missing page from
passing a reflow check or appearing as an unrelated accessibility failure.

The reasoning-practice scenario has a 90-second timeout because it completes
all twelve cases, checks review and restart, and runs an accessibility audit.
Other tests retain their default timeout; no retries mask failures. Formula
fitting diagnostics report the overflowing expression and measured widths.

## Slide tests

Regular slide tests verify each released source, frame manifest and SVG hashes.
The optional `npm run slides:test:preservation` compares all twelve local
archives and sources; it requires the ignored original imports.
`tests/browser/slides.spec.mjs` checks all 40 published frames, local resources,
clicker/keyboard navigation, direct links, full screen, no-JavaScript reading,
dark-mode control contrast and mobile reflow. The optional `npm run slides:test`
checks actual Excalidraw editing and backup saves using temporary source copies;
see [Validation](../slides/validation.md).
