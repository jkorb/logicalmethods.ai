# Design language

The site is a squared exercise book. The course material began as handwritten
lecture notes, so the site is built to look like the notebook a student carries out
of the lecture: warm paper, a faint 5&nbsp;mm grid, a red margin rule, and the
lecturer's own drawings on top of it.

Two rules hold the whole thing together:

1. **The chrome stays quiet so the drawings read as the design.** Furniture is
   paper, hairlines and small type. Color and hand-drawn strokes are reserved for
   content and for the mascot.
2. **Nothing ships that a keyboard or a screen reader cannot use.** Accessibility
   is enforced by tests, not by review; see [testing](testing.md).

## Foundations: `assets/css/tokens.css`

Everything else builds on this file. It loads after Bootstrap so its values win.
Do not hard-code a color, size or font anywhere else — add or reuse a token.

### Color

Each accent exists twice. `--<hue>-ink` is safe for text (AA 4.5:1); `--<hue>-gfx`
is for strokes, borders and fills (3:1). Using `-gfx` for body-size text is a bug.

 | Token                           | Light                 | Dark                  | Role                              |
 | ---                             | ---                   | ---                   | ---                               |
 | `--paper`                       | `#FCFBF7`             | `#15171B`             | the page                          |
 | `--paper-raised`                | `#FFFFFF`             | `#1B1E23`             | cards, dialogs, rails             |
 | `--paper-sunken`                | `#F2EFE7`             | `#101216`             | code, wells                       |
 | `--grid`                        | `#EDEAE0`             | `#1E2127`             | the 5&nbsp;mm squares             |
 | `--margin-rule`                 | `#E3A7AC`             | `#6E4245`             | the red margin line               |
 | `--ink` / `--ink-muted`         | `#23262B` / `#5A6068` | `#E9E7E1` / `#A8AEB8` | text                              |
 | `--blue-ink` / `--blue-gfx`     | `#1263AE` / `#1971C2` | `#4E9BE0`             | Boolean notation, links           |
 | `--red-ink` / `--red-gfx`       | `#C42B2B` / `#E03131` | `#F07272`             | Kleene notation, current position |
 | `--green-ink` / `--green-gfx`   | `#20762F` / `#2F9E44` | `#37B04D`             | solutions, confirmation           |
 | `--orange-ink` / `--orange-gfx` | `#8F5300` / `#D37B00` | `#E39B2B`             | notes, warnings                   |

The strictest case is text sitting on a **grid line**, not on bare paper. Every
value above was measured against that case; the worst accent scores 4.68:1. If you
change `--grid` or `--paper`, re-check the accents before shipping.

Tinted callout surfaces (`--surf-*`) sit at roughly 1.1:1 against paper. They are
invisible on their own, so a callout **must** also carry its 3&nbsp;px left rule.

Color is never the only signal. `.Boolean` and `.Kleene` mark two different formal
languages, so they differ in underline style as well as hue (solid vs dotted).

### Typography

All three faces are self-hosted and openly licensed. **The site makes no
third-party requests** — no font CDN, no analytics, no embeds beyond the slide
decks. Keep it that way; it is a stated project principle and the About page
claims it.

 | Role                         | Face                  | License                         |
 | ---                          | ---                   | ---                             |
 | Prose                        | Atkinson Hyperlegible | SIL OFL 1.1 (Braille Institute) |
 | Headings, notation, the mark | Excalifont            | SIL OFL 1.1 (Excalidraw)        |
 | Code, eyebrows, metadata     | Comic Shanns          | MIT                             |

Atkinson Hyperlegible was drawn for low vision and separates characters that
matter in a logic course — `I`/`l`/`1`, `O`/`0`. Licenses live beside the fonts in
`assets/fonts/`.

Sizes come from the `--step--2` … `--step-4` scale, never from a raw `rem`. **Never
pick a heading level for its size** — level carries document structure, the scale
carries size. Body text runs at `--measure` (65ch); the old layout ran at ~118
characters per line.

### Focus, motion, contrast

- Focus is a **two-tone ring** (dark inner, yellow outer). No single hue clears 3:1
  on both paper and dark ink, so both are drawn and one always shows.
- `prefers-reduced-motion` disables transitions, collapse animations and smooth
  scrolling.
- `prefers-contrast: more` drops the grid to plain paper.
- `forced-colors: active` flattens hand-drawn borders to `CanvasText`.

### Dark mode

Three states, not two. The bare `:root` carries the full light palette;
`@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`
handles the system default; `:root[data-theme="dark"]` handles the explicit toggle.
An inline script in `<head>` applies the stored choice before first paint.
**Never define a color only inside a media or `[data-theme]` block** — it will not
apply in the un-stamped state.

## Layout

`.shell` centers content at `--width-shell` with `--gutter` padding. Inside it:

- `--width-content` (46rem) is the column;
- `--measure` (65ch) caps prose lines;
- `--width-wide` (64rem) is where tables, code and figures may break out.

A chapter page is `rail | article` at ≥75rem and a single column below, where the
rail folds into the offcanvas panel. **`.chapter` sets `inline-size: 100%`
deliberately**: as a bare grid item it resolves wider than its own track once
content carries an intrinsic width, and that pushes the whole page sideways on a
phone.

Three things must scroll inside themselves rather than widening the page:
`div.highlight` (Chroma emits line numbers as a table), `.table-scroll` (from the
table render hook) and display formulas. This is enforced by
`tests/browser/reflow.spec.mjs` at 320&nbsp;px.

## The mascot

∀I is not decoration; it does wayfinding. The poses live in `assets/img/mascot/`
as inline SVG with `currentColor` strokes and tokenized fills, so they recolor
with the theme. They were exported from the Excalidraw scene that produced the
original PNGs — see [technical setup](technical.md#regenerating-the-mascot).

 | Asset         | Used for                               |
 | ---           | ---                                    |
 | `mark.svg`    | the header brand                       |
 | `heart.svg`   | home hero                              |
 | `reading.svg` | textbook section, learning outcomes    |
 | `board.svg`   | slides section                         |
 | `bulb.svg`    | exercises section, the solution button |
 | `sign.svg`    | assignments section                    |
 | `wave.svg`    | about section                          |

Render with the partial, not a raw `<img>`:

```go-html-template
{{ partial "shared/mascot.html" (dict "name" "reading" "class" "mascot-lg" "label" "…") }}
```

Omit `label` for decorative use and the SVG stays `aria-hidden`.

## Components

 | Component             | Where                                                              | Notes                                                                       |
 | ---                   | ---                                                                | ---                                                                         |
 | Header                | `partials/baseof/navbar.html`                                      | text brand, section links, theme toggle, chapter-tree button                |
 | Course panel          | `partials/baseof/offcanvas-nav.html`                               | full chapter tree; `aria-current` marks position                            |
 | Breadcrumb            | `partials/single/breadcrumb.html`                                  | replaces the old unreachable house icon                                     |
 | Chapter rail          | `partials/single/chapter-rail.html`                                | sticky, ≥75rem                                                              |
 | On this page          | `partials/single/on-this-page.html`                                | `IntersectionObserver` marks the current section; degrades to plain anchors |
 | Prev / next           | `partials/single/nav-bot.html`                                     | derived from **weight**, since `PrevInSection` runs the other way           |
 | Callout               | `shortcodes/callout.html`                                          | `definition`, `example`, `theorem`, `warning`, `note`, `objectives`         |
 | Chapter / route cards | `partials/list/toc.html`, `layouts/index.html`                     | whole card is the target                                                    |
 | Solution disclosure   | `exercises/_markup/render-heading.html` + `assets/js/exercises.js` | see below                                                                   |

### Callouts

```go-html-template
{{< callout type="definition" title="Valid inference" >}}
An inference is valid iff …
{{< /callout >}}
```

The type is always spelled out in the visible label, so it never depends on color.

### Solution disclosure

The lightbulb button carries a visible *Show solution* label and a real
`aria-expanded` that flips on toggle. Focus returns to the button when the dialog
closes. Unlocking one solution unlocks the rest of that sheet.

This is **staged disclosure, not access control**: the passwords and the solution
markup are both delivered to the browser. Do not describe it as security.

## Render hooks

Chapter contents list main sections (`h2`) only. Hugo's
`markup.tableOfContents` settings omit subsection links; subsection headings and
their anchors remain available in the chapter.

| Hook | Does |
| --- | --- |
| `_default/_markup/render-link.html` | external-link icon **inside** the anchor, `rel="noopener noreferrer"`, a visually-hidden "(opens in a new tab)" |
| `_default/_markup/render-table.html` | wraps tables in a uniquely-named, focusable scroll region; empty header cells become `<td>` |
| `textbook/_markup/render-heading.html` | level 1 emits the chapter eyebrow, `h1`, metadata and contents; all levels get a self-link |
| `exercises/_markup/render-heading.html` | questions are `h2`, sub-parts and solutions `h3`; numbering is CSS counters |

The exercise hook closes the previous block and opens a new one, so each question
becomes its own container and the wrapper opened by the template balances the final
close. **The question counter therefore lives on `.exercises`, not
`.exercises__body`** — the body element is closed at the first question.

## Notation

Four kinds of text appear in this book, and each has one face. The rule is by
**content**, not by position on the page.

 | Role                 | What it is                                                            | Face                   | How it is written                  |
 | ---                  | ---                                                                   | ---                    | ---                                |
 | Prose                | the book's own voice                                                  | Atkinson Hyperlegible  | plain Markdown                     |
 | Display and headings | titles, whiteboard asides, emphasis                                   | Excalifont             | `$…$`, `$$…$$`, headings           |
 | **Object language**  | expressions *of* the formal languages being studied, symbols included | **Comic Shanns Logic** | backticks, `%…%`, `!!…!!`, `~!…!~` |
 | Source code          | Python, SQL, Lean                                                     | JetBrains Mono         | fenced code blocks                 |

### Why the object language is one face

A formula is a single run of text: `Human x → Mortal x` is Latin identifiers and
a logic symbol side by side. If the identifiers come from one font and the
symbols from somewhere else, the seam is visible in every formula in the book.
That seam is what produced the original PNG symbols, and it is why the fix was
to put the symbols **into the font** rather than to keep composing formulas from
two sources.

`assets/fonts/ComicShanns/comic-shanns-logic.woff2` is Comic Shanns with twenty
logic glyphs added: `∀ ∃ ∧ ∨ ↔ ⟹ ⊨ ⊭ ⊢ ⊬ ⊆ ∈ ∉ ∩ ∪ ⟦ ⟧ ∴ ⊥`. The outlines are
the course's own hand-drawn symbols, traced from the original artwork, so they
carry the same stroke and slant as the letters beside them. Comic Shanns is MIT
licensed, which permits this; the notice travels with the font.

Rebuild it with:

```sh
python3 scripts/build-notation-font.py     # needs fonttools and brotli
```

It reads `assets/img/sym/*.svg` — **keep those files, they are the glyph
source** — and writes the patched font. `--sym-scale` in each SVG records the
symbol's size relative to the original drawing and sets the glyph's height, so
relative sizes stay true to the artwork.

### What this bought

Formulas are now ordinary text. They can be selected, copied, searched and read
aloud; a screen reader announces each symbol by its Unicode name, which is more
accurate than any alt text we would have written. One chapter page carries over
300 logic symbols that were previously 300 images.

`{{< approx >}}` is the one exception: "approximately models" is a bespoke
notation with no Unicode character, so it stays an inline SVG via
`partials/shared/sym.html`.

### Figures

Figures are Excalidraw drawings exported to SVG (`scripts/excalidraw-svg.mjs`).
The `img` shortcode prefers an `.svg` sibling and **inlines** it rather than
linking it, so the figure uses the page's own fonts — an `<img>` cannot — and no
copy of Excalifont has to be embedded per file. Excalidraw exports carry no ids
or internal references, so several on one page cannot collide.

A diagram's colours assume a light ground: ink arrows, pale fills. Rather than
distort them in dark mode, the figure sits on its own sheet of paper — the same
treatment the remaining raster figures get, and consistent with the notebook
metaphor.

### Tables

Ruled the way you would rule a table by hand: one stroke between the columns and
one under the header, and nothing else — no row lines, no header fill, no box.
The strokes are SVG masks (`--rule-hand-v`, `--rule-hand-h`), so one asset takes
any colour and stretches to any cell height. Each path starts and ends at the
same offset, so the segments drawn by adjacent cells meet instead of stepping.

**Only tables with a header get ruled.** Every headless table in this book is a
layout grid aligning a formula with its name, and ruling those is noise; the
render hook marks them `.table--headless`. It also drops the empty `<thead>`
Markdown always emits, which would otherwise draw a header rule under nothing.

Scoped to `.table-scroll`, because Chroma renders line numbers as a table too and
that must not be ruled.

One caution for the render hook: Hugo replaces shortcodes with placeholder tokens
before Markdown runs and substitutes the rendered markup back *after* the
template has finished. A header cell containing a figure therefore looks like
plain letters inside the hook, and its `<img>` lands in the `aria-label`
afterwards — unescaped, terminating the attribute. The token is stripped while it
is still a token.

### Further readings

The closing section of a chapter is an appendix, not part of the argument, so it
is *calmed* rather than highlighted: smaller type, muted colour, no section
number, a hairline above it. Mark it in Markdown with
`## Further readings {.readings .nocount}`. It is always the last section, which
is what makes the sibling selector in `textbook.css` safe.

### Source code is deliberately not in the hand

Comic Shanns slants. That is charming for a formula inside a sentence and it
costs comprehension in a twenty-line proof, where code is read character by
character and copied out. Code blocks therefore use JetBrains Mono, which was
drawn for the job. Inline formal notation keeps Comic Shanns Logic.

Chroma has no usable Lean lexer — it marks tactics as plain names — so
`layouts/_default/_markup/render-codeblock.html` applies a keyword pass for Lean
and tags every block with its language. Authors no longer need to place a
language logo beside a code block; if you find one in the content, delete it.

## Excluded from the redesign

`layouts/tutoraat/` and `layouts/verdiepingspakketten/` keep their own shells and
were deliberately left alone; they are due to be migrated elsewhere. They still
carry known issues (`lang=""`, no `main` landmark, small touch targets) and are
therefore not covered by `tests/browser/a11y.spec.mjs`.

## When you change something

Reuse a token; put section-specific rules in that section's stylesheet; keep shared
page furniture in `pages.css`. Then run `npm test` — the accessibility, keyboard and
reflow suites will catch a regression that a visual check will not.
