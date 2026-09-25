# Rendering and assets

[`layouts/_default/baseof.html`](../../layouts/_default/baseof.html) provides the
shared shell and `head`, `style`, `header`, `main`, and `footer` blocks. Section
templates specialize lists and individual pages. `tutoraat` and
`verdiepingspakketten` have their own base layouts, so shared-shell changes need
separate consideration there.

Templates use `resources.Get` for global assets and page resources for bundled
images. Explicit mounts in `hugo.toml` publish KaTeX fonts, icon fonts, Bootstrap
distribution files, and project fonts as static resources. The two config
overlays, `hugo.slides-preview.toml` and the test-only `hugo.reveal-fixture.toml`,
repeat those mounts and add one of their own. Preserve these URL
relationships when moving assets. Several paths are rooted at `/`, so deploying
under a URL subdirectory would require an audit.

Goldmark allows raw HTML (`unsafe = true`). Textbook and exercise templates
render `.Content`; the shared passthrough hook renders dollar math, including
in callouts and other shortcodes that use `.RenderString`. Read
[Notation](../authoring/notation.md) before editing notation. Syntax highlighting
emits CSS classes styled by
[`syntax_hl.css`](../../assets/css/syntax_hl.css).

The shared shell loads Bootstrap and helper scripts, optionally loads KaTeX when
`.Param "latex"` is true, and loads asset paths listed in `params.js` as JavaScript
modules. Section templates can add scripts, such as exercise interactions.
The exercise script uses a relative URL with a content fingerprint, so previews
load their own password hashes and password changes invalidate cached scripts.

## Related

- [Render hooks](../design/render-hooks.md) — what each hook emits.
- [Components](../design/components.md) — which partial owns which piece of furniture.
