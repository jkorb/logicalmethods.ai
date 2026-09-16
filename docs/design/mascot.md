# The mascot

∀I is not decoration; it does wayfinding. The poses live in `assets/img/mascot/`
as inline SVG with `currentColor` strokes and tokenized fills, so they recolor
with the theme. Most were exported from the Excalidraw scene that produced the
original PNGs — see [Regenerating the mascot](../technical/mascot.md).

`ann.svg` is the exception: it was adapted from the chapter drawing
`assets/img/drawings/la_ai_ann.svg` by rewriting only the root `<svg>` metadata
to the mascot conventions, leaving its geometry and Excalidraw palette intact.
It therefore relies on the `mascot--figure` invert filter for dark mode rather
than on `currentColor`, as `board`, `bulb`, `goals`, `heart`, `reading` and
`wave` also do.

 | Asset         | Used for                                    |
 | ---           | ---                                         |
 | `mark.svg`    | the header brand                            |
 | `heart.svg`   | home hero                                   |
 | `reading.svg` | textbook section, learning outcomes         |
 | `board.svg`   | slides section                              |
 | `bulb.svg`    | exercises section, the solution button      |
 | `sign.svg`    | former assignments section (retained asset) |
 | `wave.svg`    | about section                               |
 | `ann.svg`     | AI disclosure page                          |

Render with the partial, not a raw `<img>`:

```go-html-template
{{ partial "shared/mascot.html" (dict "name" "reading" "class" "mascot-lg" "label" "…") }}
```

Omit `label` for decorative use and the SVG stays `aria-hidden`.

The landing page's heart mascot and learning-goals bulb use half their previous
width; route-card and other miniature icons keep their existing sizes.
