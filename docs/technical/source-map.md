# Source map

 | Path                                                                       | Responsibility                                                          |
 | ---                                                                        | ---                                                                     |
 | [`hugo.toml`](../../hugo.toml)                                             | Base URL, Markdown rendering, syntax highlighting, resource mounts.     |
 | [`content/`](../../content/)                                               | Markdown pages and page-bundle resources.                               |
 | [`archetypes/`](../../archetypes/)                                         | Starter front matter; the slide archetype needs placeholders filled in. |
 | [`layouts/`](../../layouts/)                                               | Base layouts, section templates, partials, shortcodes, render hooks.    |
 | [`assets/css/`](../../assets/css/), [`assets/js/`](../../assets/js/)       | Project styling and browser behavior.                                   |
 | [`assets/img/`](../../assets/img/), [`assets/fonts/`](../../assets/fonts/) | Shared graphics and fonts.                                              |
 | [`static/`](../../static/)                                                 | Files copied directly, including `CNAME`.                               |
 | [`docs/`](../README.md)                                                    | Contributor knowledge base; not part of the generated site.             |

Bootstrap, Bootstrap Icons, Reveal.js, and KaTeX are bundled under `assets/`.
Their files are checked into the repository, even though `.gitmodules` lists
some of them. Package manifests inside these directories belong to the libraries;
you do not need to install their dependencies to work on the site.
