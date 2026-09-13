# Technical setup

## Build and preview

The site is built with Hugo and custom templates in `layouts/`. Install the
version in [`.hugo-version`](../.hugo-version), then run these commands from the
repository root:

```sh
hugo version
hugo server -D
```

Use the preview URL printed by Hugo (normally `http://localhost:1313/`). Run `hugo -D` to build the site into `public/`.
`-D` includes draft content. A plain `hugo` build excludes drafts and therefore
does not reproduce the current deployment behavior.

## Source map

 | Path                                                                 | Responsibility                                                          |
 | ---                                                                  | ---                                                                     |
 | [`hugo.toml`](../hugo.toml)                                          | Base URL, Markdown rendering, syntax highlighting, resource mounts.     |
 | [`content/`](../content/)                                            | Markdown pages and page-bundle resources.                               |
 | [`archetypes/`](../archetypes/)                                      | Starter front matter; the slide archetype needs placeholders filled in. |
 | [`layouts/`](../layouts/)                                            | Base layouts, section templates, partials, shortcodes, render hooks.    |
 | [`assets/css/`](../assets/css/), [`assets/js/`](../assets/js/)       | Project styling and browser behavior.                                   |
 | [`assets/img/`](../assets/img/), [`assets/fonts/`](../assets/fonts/) | Shared graphics and fonts.                                              |
 | [`static/`](../static/)                                              | Files copied directly, including `CNAME`.                               |
 | [`docs/`](./)                                                        | Contributor knowledge base; not part of the generated site.             |

Bootstrap, Bootstrap Icons, Reveal.js, and KaTeX are bundled under `assets/`.
Their files are checked into the repository, even though `.gitmodules` lists
some of them. Package manifests inside these directories belong to the libraries;
you do not need to install their dependencies to work on the site.

## Regenerating the mascot

The mascot poses in `assets/img/mascot/` are exported from the Excalidraw scene
that also produced the original title PNGs. To change or add one:

1. Open the scene (`scratch.excalidraw` in the course Excalidraw library) and
   select the group you want.
2. Export it to SVG with `@excalidraw/excalidraw`'s `exportToSvg`. It needs a DOM,
   so bundle a small entry with esbuild and drive it from a headless browser.
3. Post-process the result before committing it:
   - drop the embedded `@font-face` block — the site already serves Excalifont;
   - map Excalidraw's palette onto tokens: `#1e1e1e` and `#000000` become
     `currentColor`, the rest become `var(--mascot-*, <original>)`;
   - remove the fixed `width`/`height` and keep the `viewBox`;
   - add `class="mascot" role="img" aria-hidden="true" focusable="false"`;
   - round coordinates to one decimal (roughly 20% smaller, no visible change).

Keep the strokes on `currentColor`. A black-stroked asset is invisible in dark
mode, which is why the original PNGs could not be used.

Excalidraw scenes are plain JSON and this same pipeline is what will let the slide
decks be self-hosted instead of embedded from `link.excalidraw.com`.

## Weight

**KaTeX is opt-in.** Only `params.latex: true` pages load it.
No current exercise page enables it. Elsewhere Hugo's passthrough render hook
renders Unicode dollar math directly in Comic Shanns Logic. Markdown itself
protects source-code spans and fences; the textbook/exercise/assignment templates no longer
preprocess `.RawContent` with regular expressions for revised pages. Unrevised
chapters opt into the legacy compatibility renderer; see
[authoring](authoring.md#staged-release).

**Reveal.js is gone.** Every deck uses the Excalidraw layout, so the reveal
template, theme, logo and the 6.8&nbsp;MB submodule were dead.

**Bootstrap Icons are subsetted.** The upstream font ships ~2,000 icons; this
site uses about 35. `scripts/subset-icons.py` keeps only those, taking
223&nbsp;KB of font and CSS down to 5&nbsp;KB, with every existing
`<i class="bi bi-…">` unchanged. Rebuild it after adding an icon. The subsetter reads templates, content, scripts
and stylesheets, because some icons only ever appear at runtime: scanning HTML
alone once dropped `bi-sun` and `bi-moon-stars`, and the theme toggle rendered an
empty box as soon as it was clicked. `tests/browser/icons.spec.mjs` covers both
cases — every icon on a page, and the toggle through all three of its states.

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
is only an authoring convenience. See [authoring](authoring.md#figures).

## Authoring tools

Two scripts are for authoring, not for the build or the test run. Neither is
wired into `npm test`, and their dependencies are deliberately not repo
dependencies.

| Script | Does | Needs |
| --- | --- | --- |
| `scripts/build-notation-font.py` | Rebuilds Comic Shanns Logic from `assets/img/sym/*.svg` | `pip install fonttools brotli` |
| `scripts/excalidraw-svg.mjs` | Exports figures from `.excalidraw` sources | `npm i --no-save @excalidraw/excalidraw react react-dom esbuild playwright` |

`tmp/assignment-pdfs/make-pdfs.mjs` turns the hidden Assignments section into
PDFs; see the README beside it.

## Temporary working files

Keep screenshots, test reports, and scratch files in `tmp/`. Git ignores this
directory, and Hugo does not publish it. Use `docs/` for contributor documentation
that belongs in the repository.

## Rendering and assets

[`layouts/_default/baseof.html`](../layouts/_default/baseof.html) provides the
shared shell and `head`, `style`, `header`, `main`, and `footer` blocks. Section
templates specialize lists and individual pages. `tutoraat` and
`verdiepingspakketten` have their own base layouts, so shared-shell changes need
separate consideration there.

Templates use `resources.Get` for global assets and page resources for bundled
images. Explicit mounts in `hugo.toml` publish KaTeX fonts, icon fonts, Bootstrap
distribution files, and project fonts as static resources. Preserve these URL
relationships when moving assets. Several paths are rooted at `/`, so deploying
under a URL subdirectory would require an audit.

Goldmark allows raw HTML (`unsafe = true`). Textbook, exercise and assignment templates
render `.Content`; the shared passthrough hook renders dollar math, including
in callouts and other shortcodes that use `.RenderString`. Read
[authoring](authoring.md) before editing notation. Syntax highlighting emits CSS classes styled by
[`syntax_hl.css`](../assets/css/syntax_hl.css).

The shared shell loads Bootstrap and helper scripts, optionally loads KaTeX when
`.Param "latex"` is true, and loads asset paths listed in `params.js` as JavaScript
modules. Section templates can add scripts, such as exercise interactions.

## Deployment

Pushing to `main` runs the [build and deployment workflow](../.github/workflows/build-and-deploy.yaml).
Its test job must pass before the deployment job can publish to GitHub Pages.
The deployment uses the files produced and checked by that run. Pull requests
run the same tests without publishing.

The workflow uploads `tmp/site/` with `actions/upload-pages-artifact` and publishes
it with `actions/deploy-pages` to the `github-pages` environment. Generated files
are stored in a Pages artifact rather than committed to a deployment branch.
Manual workflow runs on `main` also deploy after tests pass; runs on other
branches only check the site. Active runs on `main` finish before the next run
starts, so a new push does not interrupt publication.

For repository setup or migration, select **Settings → Pages → Build and
deployment → Source → GitHub Actions**. Keep the custom domain set to
`logicalmethods.ai` in Pages settings; the workflow no longer sets it through
the branch-publishing action. Allow `main` to deploy to the `github-pages`
environment. The deployment job needs `pages: write` and `id-token: write`.
The old deployment branch and its history can be retained; this workflow does
not update them.

Actions run names include the commit message, PR title, or manual-run details.
The deployment job includes the domain, branch, and run number, and its
environment links to the published site. The environment keeps the stable name
`github-pages` so deployment history stays together.

See [testing](testing.md) for local setup and commands. Spelling suggestions and
external-link reports are available separately and do not block deployment.

## Validation and known caveats

Run `npm test` before pushing. For a quick build check, use `hugo -D`.
Preview the pages you change, including their small-screen layout, formulas,
and interactive controls. Automated tests complement this review; they cannot
judge whether an explanation or a mathematical argument is correct.

`hidden` filters navigation, while `locked` disables links in the list partial.
Neither prevents page generation or direct access. Exercise passwords and
solutions are delivered to the browser; their purpose is staged disclosure, not
authentication. Drafts are also published by the current CI command.

The Excalidraw exporter also accepts a directory and `--keep-sources`; shared
exports live in `assets/img/drawings/`. It uses one browser for a batch, serves
Excalidraw font assets locally and blocks external requests. Dependencies can be
installed under `tmp/excalidraw-tools` and resolved using `NODE_PATH`, leaving the
site's package manifest unchanged. Set `PLAYWRIGHT_BROWSERS_PATH` to the matching
local browser cache when needed. The regular Hugo build uses the checked-in SVGs
and patched font; it does not need either authoring toolchain.
