# Chapter 10 release: proof fitting and pointer boundaries

[Run 38482116467](https://github.com/jkorb/logicalmethods.ai/actions/runs/38482116467)
tested `27f16729` on Ubuntu 24.04: 535 browser tests passed, three failed, and one
passed on retry. The verification job finished in about twelve minutes, within
its thirty-minute limit. Increasing timeouts would not address these failures.

## Evidence from the artifacts

Both attempts of the Lean walkthrough test reported persistent horizontal
overflow: four CSS pixels on desktop, six on mobile. The proof-deck traversal
also found a scrollbar in slide 17's `.nd-board`. The screenshots and retry
traces show the loaded proof at its default fit, before manual magnification.
The fitter estimated a proportional scale without checking the rendered result.

The tree-guide screenshot shows all descriptions closed after Escape, with
Internal node highlighted instead of the focused Branch button. The hover
handler accepted pointer-entry events after layout changes. A regression that
dispatches that boundary event reproduces the unwanted highlight; the failing
first attempt had no event trace, so its exact event sequence remains inferred.

## Corrections and checks

Proof fitting now remeasures the canvas and corrects remaining overflow before
applying manual zoom. A bordered proof provides a portable regression for an
underestimated rendered width. It fails on the old code and passes with the
correction; it does not reproduce Ubuntu's precise font/layout calculation.

The guide previews on pointer movement on hover-capable devices. A boundary
event alone cannot undo Escape. Existing keyboard, selection, and hover checks
remain in place. Both regressions fail on the old code in both viewports; the
45 targeted slide and tree-guide checks pass with the fixes.

The original release passed all 539 local browser tests and a focused CPU-throttled
run. Neither reproduced these Ubuntu failures. CPU throttling tests timing
tolerance, not operating-system layout or pointer-event behavior. Local checks
of the correction do not establish a successful Linux CI run; that remains
pending until the corrected commit is tested on GitHub.

The first full local run of the corrections also exposed an FOL contrast audit
that passed on retry. Button text switched themes immediately while its
background animated through a low-contrast intermediate color. App buttons now
switch both together; the FOL test checks the first computed background after a
theme change, before the accessibility audit.

See [CI failure diagnosis](../ci-failures.md).
