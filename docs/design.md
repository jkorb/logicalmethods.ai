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

Every face is self-hosted and openly licensed — Merriweather too, which the
Dutch pages fetched from Google Fonts until September 2026 and now comes from
`assets/fonts/Merriweather/`. **Opening a page contacts nobody but this
domain**: no font CDN, no analytics, and the slide decks stay a button until
the reader presses it. Keep it that way. It is a stated project principle, the
About page and the footer claim it, and
[`tests/browser/privacy.spec.mjs`](../tests/browser/privacy.spec.mjs) fails the
build if a page reaches off-site on load.

 | Role                         | Face                  | License                         |
 | ---                          | ---                   | ---                             |
 | Prose                        | Atkinson Hyperlegible | SIL OFL 1.1 (Braille Institute) |
 | Headings, highlights, the mark | Excalifont            | SIL OFL 1.1 (Excalidraw)        |
 | Mathematics, formal notation, metadata | Comic Shanns Logic | MIT |
 | Source code | JetBrains Mono | SIL OFL 1.1 |

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

Reference pages marked with `params.appendix` use “Appendix” and a letter in
place of numbered chapter labels. They retain their paths and weight ordering.

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
 | Display and headings | titles, whiteboard asides, emphasis                                   | Excalifont             | headings, `excalifont` shortcode           |
 | **Mathematical notation** | formulas, sets, alphabets, metavariables and expressions of formal languages | **Comic Shanns Logic** | `$…$`, `$$…$$` |
 | Source code          | Python, SQL, Lean                                                     | JetBrains Mono         | backticks and fenced code blocks   |

### Why the object language is one face

A formula is a single run of text: `Human x → Mortal x` is Latin identifiers and
a logic symbol side by side. If the identifiers come from one font and the
symbols from somewhere else, the seam is visible in every formula in the book.
That seam is what produced the original PNG symbols, and it is why the fix was
to put the symbols **into the font** rather than to keep composing formulas from
two sources.

`assets/fonts/ComicShanns/comic-shanns-logic.woff2` is Comic Shanns with twenty
logic glyphs added: `∀ ∃ ∧ ∨ ↔ ⟹ ⊨ ⊭ ⊢ ⊬ ⊆ ∈ ∉ ∩ ∪ ⟦ ⟧ ∴ ⊥`. Most added outlines come from the course's own hand-drawn symbols. The
biconditional `↔` combines the native `→` with its reflection, keeping the
conditional's stroke and height, with a slightly longer shaft between the heads. It remains the single Unicode character
U+2194, rather than two adjacent arrows. Comic Shanns is MIT
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
copy of Excalifont has to be embedded per file. Excalidraw exports carry no IDs
or internal references in some older exports; newer exports can contain them.
The shared `drawing` shortcode prefixes these IDs per use to prevent collisions.

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

## Glossary interaction

Glossary terms use a bold dotted-underlined link, with a shared definition preview
on hover or keyboard focus. The preview stays within the viewport, can itself be
hovered, and closes on Escape. Clicking opens the anchored glossary entry in a
new tab, as announced in the link's accessible name. Native link titles provide
a fallback when JavaScript is unavailable.

The glossary search filters the existing entries and announces the result count.
It is shown only when JavaScript is available; the full glossary is readable
without it. Styles are in `assets/css/glossary.css` and interaction code is in
`assets/js/glossary.js`, both loaded by the shared page shell.


### Focus

Two treatments, and the split is deliberate. Buttons, links and other controls
can end up on any ground, so they take the two-tone ring — a dark outline
inside a yellow halo — which survives whatever is behind it. A text field always
sits on paper or on a raised card, so it takes a single blue ring
(`--blue-ink`, 5.9:1 on paper and 5.6:1 on a dark card): the halo swelled the
field's own box and read as an error state. `tests/browser/keyboard.spec.mjs`
checks both, and that every tab stop still has some visible indicator.

### Code blocks

A fenced block is wrapped by `layouts/_default/_markup/render-codeblock.html`
in a `.code-block` shell that exists only to hold the language badge: Chroma
supplies the `.highlight` box itself (see `wrapperClass` in `hugo.toml`), so the
shell must not carry that class too. Nesting them gave a double border, a stray
margin, a badge the inner box painted over, and `font-size: .92em` applied
twice. The shell does not scroll, so the badge stays put while long lines move
under it, and it carries the block's own ground so they are masked cleanly.
Vertical room for the badge is made on the scroller, the one box both Chroma
shapes share. `tests/browser/site.spec.mjs` fails if a block scrolls sideways
at a desktop width or if the badge covers the first line.

### Chapter apps

The `logic-app` shortcode places interactive tools in a bordered paper panel.
App CSS is loaded only on pages containing that shortcode, uses the site's
color and font tokens, and stays scoped to `.logic-app`. Formula inputs and
SVG tree labels use `--font-formal`. A dashed outline marks the current tree
node; color is supplementary. Trees scroll inside their panel when they grow,
with a keyboard-focusable scroll region and a nested text equivalent.
Navigation uses named native buttons, and explanations use a polite live region.


Parser panels center the input and tree. Native icon navigation sits above the
step explanation, followed by the growing tree, so the controls stay in place.
The explanation uses a two-column definition list for “Current part” and “Next
step”, followed by prose. The formula input keeps its accessible name without
a visible label. During parsing it is read-only, with a muted paper background;
the inline pencil enables editing. An accessibility icon in the panel's lower
right switches to the text tree. A separate checkbox switches between operators
and full formulas at nodes, without changing the parsing history.

Static `syntax-tree` figures use nested HTML lists and CSS edges, with the
same formal font and theme tokens. Their stylesheet is page-local and scoped
to `.syntax-tree` and `.ast-comparison`. They require no JavaScript.


Excalifont remains the heading and highlight face. New mathematical notation,
including sets and metavariables, uses Comic Shanns Logic via dollar math.
Backticks are reserved for literal source code in JetBrains Mono.
Display notation preserves internal line breaks but trims the opening and
closing delimiter newlines. It uses a regular weight, a size close to the prose and
compact margins; source-code fences still use JetBrains Mono. Use spaces around binary operators, after commas and around `=` and `:`;
keep negation and brackets attached to their operands.

Stacked inferences use `inference layout="stacked"`: centered premises,
a solid horizontal rule, and the conclusion below, all in the formal font.
Blockquotes retain their left rule but discard their first and last children's
outer margins, so the rule ends with the quoted text.

Book images use `.book-figure`, with floats and dimensions on its wrapper.
The original ink and fills sit on `--figure-paper` in dark mode. Nested set
figures use the formal font for braces, commas and text and can include drawings
as members. Larger sets fit to the column, with scrolling as a fallback.


Formal displays (`.math-display`) and illustrated sets (`.set-figure`) share the
same type size, regular weight and vertical rhythm. Picture members are 1.6em
high and braces 1.45em, relative to the surrounding set text. An illustrated
set should read as an expression, rather than as a large diagram.

`assets/js/display-math.js` measures each display at its normal font size and
reduces that size only when its widest line exceeds the column. It remeasures
after shrinking to account for glyph rounding, tab stops and fixed spacing,
with a bounded number of corrections before the scroll fallback. It refits after
fonts load, column resizing and hidden exercise solutions becoming visible,
and restores the normal size when space permits. It never changes source-code
blocks or formula text. The scroll container remains a fallback without
JavaScript or for legacy fixed-size images. Authors should still break very
long derivations into meaningful lines rather than rely on extreme shrinking.

Example sentences use the `sentence` shortcode: a quiet sunken-paper surface,
Comic Shanns Logic, no quote bar, label or icon. Genuine quotations remain
blockquotes; definitions and theorems retain their named callouts.

The `img` shortcode and the set renderer share `figures/image.html`. Bundle and
shared assets get the same wrapper, spacing, width clamp and dark paper; SVGs
and remaining PNGs do not have separate layout rules. See the authoring guide
for export and migration instructions.

The Notation appendix uses one reference table with left-aligned readings.
LaTeX commands have their own cheat sheet. Its `.notation-reference` wrapper keeps a prose-measure minimum
inside the shared table scroll region, so phone layouts scroll horizontally
instead of squeezing explanations into narrow columns.
