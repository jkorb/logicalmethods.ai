# Proof canvases on slides

Natural deduction canvases use 28px proof text before fitting, with rule labels
at 65% of that size. Each tree fits the available width and height of a 260px
canvas. The Lean walkthrough gives the derivation slightly more width than its
code pane. These overrides apply only inside a Reveal.js deck; chapters and
standalone tools keep their existing sizes and controls.

The canvas toolbar includes **− / Fit / +**. Zoom runs from 75% to 150% of the
fitted proof size in 25% steps. **Fit** restores the initial scale. Zoom changes
the proof inside the canvas, leaving the slide and toolbar sizes stable; an
enlarged proof can scroll inside the canvas. The setting survives proof edits,
walkthrough steps, and navigation away from and back to the slide.

`assets/js/slides-deduction.js` installs the controls and refits after a canvas
resize, a proof redraw, or font loading. The slide theme overrides the chapter
app's inline tree zoom so it cannot undo the presentation setting.
After estimating the scale, the fitter remeasures the canvas and corrects any
remaining overflow in a bounded loop. Manual magnification is applied afterward,
so **+** still permits scrolling and **Fit** restores the complete proof.

`tests/browser/slides-deduction.spec.mjs` checks readable default sizes, zoom
bounds, fitting, persistence, and the chapter boundary. It also checks proof
search and pointer alignment on desktop and mobile, inline and fullscreen.

See [The Excalidraw theme](theme.md) for fitting the whole slide and
[Testing the framework](testing.md) for validation commands.
