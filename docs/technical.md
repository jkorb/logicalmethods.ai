# Technical setup

## Build and preview

This is a static Hugo site with custom templates in `layouts/`; no external Hugo
theme or root-level Node build is configured. Git and Hugo are sufficient for
the site build using the checked-in assets.

From the repository root:

```sh
hugo version
hugo server -D
```

Use the preview URL printed by Hugo (normally `http://localhost:1313/`). To match
the CI build, run `hugo -D`; output goes to the ignored `public/` directory.
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
Although [`.gitmodules`](../.gitmodules) declares the first three and CI requests
recursive submodule checkout, this baseline tracks their files directly and
`git submodule status` returns no entries. Do not assume a submodule update will
upgrade them. Package manifests inside these libraries belong to those upstream
projects; ordinary site work does not require running their package installers.

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

Goldmark allows raw HTML (`unsafe = true`). Textbook and exercise templates
preprocess `.RawContent` before calling `.RenderString`; this changes the meaning
of normal Markdown math and code delimiters. Read [authoring](authoring.md) before
editing notation. Syntax highlighting emits CSS classes styled by
[`syntax_hl.css`](../assets/css/syntax_hl.css).

The shared shell loads Bootstrap and helper scripts, optionally loads KaTeX when
`.Param "math"` is true, and loads asset paths listed in `params.js` as JavaScript
modules. Section templates can add scripts, such as exercise interactions.

## Deployment

[`build-and-deploy.yaml`](../.github/workflows/build-and-deploy.yaml) runs on pull
requests and pushes to `main`, uses Ubuntu 22.04, installs Hugo `latest`, and runs
`hugo -D`. The deployment step runs only for `refs/heads/main` and publishes
`public/` through `peaceiris/actions-gh-pages@v4` with `logicalmethods.ai` as the
custom domain. A push to `main` can therefore publish changes automatically.

## Validation and known caveats

For site changes, run `hugo -D`, then preview the affected routes. Template or CSS
changes warrant checking the home page, section lists, a textbook chapter,
exercises, and slides at narrow and wide viewport sizes. Check navigation, image
and font loading, notation, and any changed browser interactions. The build does
not verify visual layout, external embeds, or mathematical correctness. No
project-level automated test suite is configured; bundled library tests are not
site tests.

The baseline build passed with Hugo v0.165.0+extended+withdeploy on 2026-09-07
(64 pages). It warned that `languageCode` is deprecated in favor of `locale`.
This is an observed warning, not a migration implemented by this documentation.
CI's unpinned `latest` can change compatibility; no minimum Hugo version is
declared, and the successful extended build does not establish an extended-only
requirement.

`hidden` filters navigation, while `locked` disables links in the list partial.
Neither prevents page generation or direct access. Exercise passwords and
solutions are delivered to the browser; their purpose is staged disclosure, not
authentication. Drafts are also published by the current CI command.
