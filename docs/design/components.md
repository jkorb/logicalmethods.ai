# Components

 | Component             | Where                                                              | Notes                                                                       |
 | ---                   | ---                                                                | ---                                                                         |
 | Header                | `partials/baseof/navbar.html`                                      | text brand, section links, home link, theme toggle, chapter-tree button     |
 | Course panel          | `partials/baseof/offcanvas-nav.html`                               | full chapter tree; `aria-current` marks position                            |
 | Breadcrumb            | `partials/single/breadcrumb.html`                                  | the trail back up; the header house is the one-hop way home                 |
 | Chapter rail          | `partials/single/chapter-rail.html`                                | sticky, ≥75rem                                                              |
 | On this page          | `partials/single/on-this-page.html`                                | `IntersectionObserver` marks the current section; degrades to plain anchors |
 | Reading bar           | `partials/single/reading-bar.html`                                 | under the header on chapters; how much chapter is left, at every width      |
 | Prev / next           | `partials/single/nav-bot.html`                                     | derived from **weight**, since `PrevInSection` runs the other way           |
 | Callout               | `shortcodes/callout.html`                                          | `definition`, `example`, `theorem`, `warning`, `note`, `objectives`         |
 | Chapter / route cards | `partials/list/toc.html`, `layouts/index.html`                     | whole card is the target                                                    |
 | Solution disclosure   | `exercises/_markup/render-heading.html` + `assets/js/exercises.js` | see below                                                                   |

## Callouts

```go-html-template
{{< callout type="definition" title="Valid inference" >}}
An inference is valid iff …
{{< /callout >}}
```

The type is always spelled out in the visible label, so it never depends on color.

## Solution disclosure

The lightbulb button carries a visible *Show solution* label and a real
`aria-expanded` that flips on toggle. Focus returns to the button when the dialog
closes. Unlocking one solution unlocks the rest of that sheet.

This is **staged disclosure, not access control**: the password hashes and the solution
markup are both delivered to the browser. Do not describe it as security.

## Example sentences

Example sentences use the `sentence` shortcode: a quiet sunken-paper surface,
Comic Shanns Logic, no quote bar, label or icon. Genuine quotations remain
blockquotes; definitions and theorems retain their named callouts.

## Inferences and blockquotes

Stacked inferences use `inference layout="stacked"`: centered premises,
a solid horizontal rule, and the conclusion below, all in the formal font.
Blockquotes retain their left rule but discard their first and last children's
outer margins, so the rule ends with the quoted text.

## Related

- [Callouts](../authoring/callouts.md) and [Inference figures](../authoring/inference-figures.md) — how to write them.
- [Solutions](../authoring/solutions.md) — the ID convention and password table.
