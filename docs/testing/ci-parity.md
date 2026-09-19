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

## Geometry during scrolling

Measure related element rectangles in a single browser `evaluate` call. Separate
`boundingBox()` calls can observe different frames during smooth scrolling,
especially after keyboard focus. The 19 September CI adder failures compared
positions thousands of pixels apart for that reason. Waiting for fonts and reading
both rectangles together retains the clipping assertion without depending on
runner speed. `CI=true` on macOS does not reproduce Linux timing or rendering.

## Parser accessibility checks

Routine browser tests capture review images only when `REVIEW_SCREENSHOTS=1`.
Use `reviewScreenshot` from `tests/browser/review-screenshot.mjs` for those images;
a unit guard rejects unconditional review captures. Failure screenshots and traces
remain enabled in CI. Pixel comparisons that detect damaged artwork, and app PNG
export tests, still run normally.

The 19 September GitHub trace showed the mobile parser's optional formula-label
screenshot taking 27.075 seconds, exhausting the 30-second test budget during the
following accessibility audit. This was the same class of failure seen on
16 September. Review capture is now opt-in across all browser specs, rather than
removed from individual failing tests. Assertions and timeouts are unchanged.

For an intentional visual review after building:

```sh
REVIEW_SCREENSHOTS=1 npm run test:browser -- tests/browser/parser-app.spec.mjs
```

## Slide tests

Regular slide tests verify each released source, frame manifest and SVG hashes.
The optional `npm run slides:test:preservation` compares all twelve local
archives and sources; it requires the ignored original imports.
`tests/browser/slides.spec.mjs` checks all 40 published frames, local resources,
clicker/keyboard navigation, direct links, full screen, no-JavaScript reading,
dark-mode control contrast and mobile reflow. The optional `npm run slides:test`
checks actual Excalidraw editing and backup saves using temporary source copies;
see [Validation](../slides/validation.md).
