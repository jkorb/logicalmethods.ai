# Page weight

**KaTeX is opt-in.** Only `params.latex: true` pages load it. No current exercise
page enables it. Elsewhere Hugo's passthrough render hook renders Unicode dollar
math directly in Comic Shanns Logic. Markdown itself protects source-code spans
and fences; the textbook/exercise templates no longer preprocess `.RawContent`
with regular expressions for revised pages. Unrevised chapters opt into the
legacy compatibility renderer; see [Staged release](../authoring/staged-release.md).

**Reveal.js is gone.** Every deck uses the Excalidraw layout (Lecture 1 is
in the normal site; Lectures 2–12 use a local-only preview overlay), so the reveal
template, theme, logo and the 6.8&nbsp;MB submodule were dead.

**Bootstrap Icons are subsetted.** The upstream font ships ~2,000 icons; this
site uses about 35. `scripts/subset-icons.py` keeps only those, taking
223&nbsp;KB of font and CSS down to 5&nbsp;KB, with every existing
`<i class="bi bi-…">` unchanged. Rebuild it after adding an icon. The subsetter
reads templates, content, scripts and stylesheets, because some icons only ever
appear at runtime: scanning HTML alone once dropped `bi-sun` and `bi-moon-stars`,
and the theme toggle rendered an empty box as soon as it was clicked.
`tests/browser/icons.spec.mjs` covers both cases — every icon on a page, and the
toggle through all three of its states.

The generated `@font-face` carries the font's content hash as a `?v=` cache key.
Hugo fingerprints the subset CSS filename but serves the font from a fixed static
path, so without it a regenerated subset reached browsers still holding the old
font: the new rules resolved to codepoints that font lacked, and each newly added
icon drew as a tofu box with its codepoint inside. `tests/unit/icon-subset.test.mjs`
fails if the key stops matching the shipped font.

**Bootstrap's own CSS is the remaining bulk.** Measured with Chromium coverage
across nine routes, 227&nbsp;KB ships and about 3% of it matches anything. What
the site actually needs is a couple of dozen spacing and image utilities (many of
them written into content markdown), plus the modal and collapse components.
Subsetting it means building a custom bundle from the vendored SCSS with Hugo's
Sass support, or filtering the compiled CSS against the built HTML. Both are
verifiable against the screenshot and test suites, and neither has been done:
the design currently rests on that file and the saving is not worth a silent
regression.

**Figures are the page weight.** PNGs are being replaced by SVGs as chapters
are revised. `img` handles both formats through one shared renderer; remaining
rasters have lazy loading and intrinsic dimensions. Shared illustrations live
in `assets/img/drawings/`, and bundle-local SVGs work identically. The renderer
normalizes direct Excalidraw exports at build time; the optional export script
is only an authoring convenience. See [Figures](../authoring/figures.md).
