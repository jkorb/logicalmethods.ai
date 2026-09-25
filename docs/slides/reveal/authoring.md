# Writing a deck

What a deck should say is in [Lecture standards](../lecture-standards.md); this
note is how to write it.

## Front matter

```yaml
---
title: Boolean satisfiability
author: Johannes Korbmacher
weight: 50            # lecture 5; the title slide and heading use weight / 10
layout: 'reveal_slides'
summary: 'Lecture 5: reducing reasoning problems to satisfiability, and deciding it.'
params:
  chapter: sat        # the textbook chapter the deck compresses
  id: sli-sat
  license: 'CC-BY-4.0'
  highlights: [...]   # optional "Key points" below the deck, as before
---
```

A title slide (course, lecture number, title and the mascot at the board) is
generated as slide 1. It names no author, so anyone can teach from the deck;
`author` credits the page, not the slides. `params.mascot` picks another pose from
`assets/img/mascot/`; `params.titleSlide: false` lets you write your own.
`hugo new content slides/<topic>` starts a deck with its goals slide in place.

## Slides

Each `{{< slide >}}` starts a slide, which runs to the next one. Give the
shortcode a line of its own, followed by a blank line or a `##` heading:

```markdown
{{< slide title="Learning goals" >}}
## What you'll be able to do

{{< callout type="objectives" >}}
After this lecture and chapter 5, you will be able to:

- Convert propositional formulas into CNF and DNF. *(apply)*
{{< /callout >}}

{{< slide layout="app" >}}
## Refutation search

{{< logic-app name="sat" kind="resolution" formula="(SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN" title="Resolution on (SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN" >}}
```

| Parameter | Does |
| --- | --- |
| `title` | Names the slide in the slide menu. Defaults to its first heading. |
| `layout` | `title`, `section` (one large line), `center`, `split` (columns) or `app`. |
| `class` | Extra classes for the slide's `<section>`. |

Slide 2 must hold the learning goals in the `objectives` callout. Use `##` for
a slide title and `###` below it; the lecture title is the page's only `h1`.

Everything a chapter uses works on a slide, and the same way: `$…$`
notation, `!!AND!!`, callouts, `term`, `inference`, `syntax-tree`, `img` with
the course's drawings, code blocks, tables and every `logic-app`. Write them as
in the chapter; copy the chapter's definition word for word. Give every `img`
an `alt` and every `logic-app` a `title`: the text view below the deck reads
them out.

## Columns

With `layout="split"`, each `{{< column >}}` starts a column. What comes before
the first column spans the slide, which is where the title goes:

```markdown
{{< slide layout="split" >}}
## Two readings

{{< column >}}

{{< inference layout="stacked" >}}
…
{{< /inference >}}

{{< column >}}

{{< img src="/img/drawings/sat_ai_verification.svg" width="220px" alt="…" >}}
```

## Step-by-step reveals

Give an element the class `fragment` and it appears on the next click:

```markdown
<p class="fragment">First this.</p>

<div class="fragment">

- then a *Markdown* list

</div>
```

The blank lines inside the `div` are what make its content Markdown.

## Walking through a tree

Give the nodes of a `syntax-tree` a `"step"`, and on a slide they light up in
that order as you click Next: the current node filled, the ones before it
tinted. Nodes with the same step light up together, across every tree on the
slide, so two trees can show two search orders side by side, as in Lecture 6:

```markdown
{{< syntax-tree caption="" >}}
{"label":"A","step":1,"children":[{"label":"B","step":2},{"label":"C","step":3}]}
{{< /syntax-tree >}}
```

In the chapter, and without JavaScript, the steps change nothing.

## Fitting

The canvas is 960 × 540 and scales to the screen. Each slide is fitted to it
when it is shown: a slide with an app zooms only its apps, down to 40% or up to
150%, so the app fills the room the slide leaves it; any other slide zooms what
follows its title, down only. An app that grows while you step through it is
fitted again. There is nothing to set. A slide that still does not fit at 40%
scrolls, and the [real-deck test](testing.md) fails: cut it or split it. A
text slide that fits only when zoomed holds too much, by the
[Lecture standards](../lecture-standards.md).

## What the build refuses

The deck is cut out of the rendered page, so a misplaced marker would lose or
break content silently. `hugo` stops instead, naming the file and slide:

- Markdown before the first `{{< slide >}}`, or a deck with no slides.
- No `summary` in the front matter: Hugo's own summary of a deck, which the
  site's feeds show, would be raw slide markup.
- No `objectives` callout on slide 2.
- A picture from outside `assets/img/drawings/`, embedded video, audio or
  frames, or an `img` without `alt`.
- A `{{< slide >}}` or `{{< column >}}` inside a paragraph or list. This happens
  when text or another shortcode follows it on the next line: add a blank line.
- A `{{< column >}}` without `layout="split"`, or `split` without a column.
- An unknown `layout`, a `#` heading, or `scale`, which fitting replaced.
- A slide inside another shortcode, or on a page without `layout: reveal_slides`.

Do not wrap slides in `{{% … %}}`: Hugo would then run Markdown over the HTML
of the apps inside, and a blank line in an app's markup turns the rest of it
into a code block. That is why a slide is a separator, not a wrapper.

## Related

- [The Excalidraw theme](theme.md) — what each layout looks like.
- [Lecture standards](../lecture-standards.md) — what goes on a slide.
