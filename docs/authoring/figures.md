# Figures

**Use `img` for all book images.** The shortcode delegates to
`layouts/partials/figures/image.html`, also used by illustrated sets.
Reference the file you intend to publish:

```go-html-template
{{</* img src="/img/drawings/my-diagram.svg" width="600px" alt="Description of the diagram." */>}}
{{</* img src="/img/drawings/gimmick_mushroom.svg" width="150px" class="float-start me-3" */>}}
```

Store new SVGs in `assets/img/drawings/` and their editable sources in
`assets/img/drawings/sources/`; reference them with `/img/drawings/…`.
Relative paths remain supported for older page-bundle assets. A leading `/` resolves relative
to `assets/`, so `/img/drawings/tree.svg` is a shared drawing. Missing resources
fail the build with the calling page's source location. Supply `alt` for
informative images; an empty or omitted `alt` marks decoration.

Every image has a `.book-figure` wrapper. Width, height limits, floats and
spacing classes belong to that wrapper for both SVG and remaining raster
assets. Width is clamped to the available column; aspect ratio is preserved.
The default block margin is 1.4rem above and below. Utility classes override it.
Use `inline=true` with `height="1.5em"` for a picture within a sentence.
It has no block margins and scales to the given height.
Both formats use the same light paper surface in dark mode, with no extra
padding. Internal SVG IDs and references are prefixed for each occurrence.

SVG is the target format for all illustrations. Convert remaining PNGs chapter
by chapter, update references explicitly, and remove replaced files only from
the chapter being revised. Formal Languages and Valid Inference now have no textbook PNG assets.
The Valid Inference exercises also use source notation and shared SVGs; neither
Valid Inference bundle retains a local `img/` folder.

Brand mascots in the shared shell retain their dedicated token-colored
component. They are site furniture; chapter illustrations all use `img`.

## Related

- [Exporting from Excalidraw](excalidraw-export.md).
- [Figures](../design/figures.md) — why SVGs are inlined rather than linked.
