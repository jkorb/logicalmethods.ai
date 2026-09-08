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

Goldmark allows raw HTML (`unsafe = true`). Textbook and exercise templates
preprocess `.RawContent` before calling `.RenderString`; this changes the meaning
of normal Markdown math and code delimiters. Read [authoring](authoring.md) before
editing notation. Syntax highlighting emits CSS classes styled by
[`syntax_hl.css`](../assets/css/syntax_hl.css).

The shared shell loads Bootstrap and helper scripts, optionally loads KaTeX when
`.Param "math"` is true, and loads asset paths listed in `params.js` as JavaScript
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
