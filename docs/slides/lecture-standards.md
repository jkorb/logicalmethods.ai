# Lecture standards

What a lecture deck has to look like. It is the spec for every deck written or
migrated in the [Reveal.js format](reveal/README.md); Lecture 5 is the worked
example, and [Content review](content-review.md) records what each revision
changed. The rules that apply only to the deprecated Excalidraw decks are at
the end.

## Style: few words, drawn

The style borrows from the
[Takahashi method](https://en.wikipedia.org/wiki/Takahashi_method): very few
words, large, one idea at a time. The lecturer speaks the sentences; the slide
holds what the room has to see. Unlike Takahashi slides, ours are not bare text.
A slide is carried by the course's own material: a hand-lettered title, one of
the book's drawings, a formula, a definition quoted from the chapter, or an app
to work through live.

- **One idea per slide**: a claim, a definition, a diagram, a worked step.
- **The title is short**: a few words naming the slide's topic, as a chapter
  heading would — *Satisfiability*, *Horn clauses*, *Actions*, *"Miracles"*.
  A title is not a sentence, and never a contrast of the kind "X is not Y";
  see [House voice](../authoring/voice.md).
- **Phrases and formulas, not paragraphs.** At most three short bullets, or
  one definition, or one drawing with a line under it, or one app. The one
  paragraph a slide may carry is a definition quoted from the chapter.
- **A single statement is a slide.** `layout="section"` sets one large line
  alone: the purest Takahashi slide, and a good way to mark a turn.
- **Room is part of the design.** A text slide that has to be zoomed below full
  size to fit holds too much: cut it or split it.
- **No explanation of why a slide matters**; see [House voice](../authoring/voice.md).
- **No names, dates or course logistics** on a slide — no author, staff,
  schedule or attendance — so anyone can teach from the deck.

## Length

**Twenty slides, maximum**, title slide included, sized for a 90-minute
lecture. That is roughly four minutes of talking per slide, which is what a
slide carrying one idea is worth. A deck that will not fit is a deck whose
chapter has not been compressed yet, not a deck that needs slide 21.

## Shape

| Slide | Carries |
| --- | --- |
| 1 | Title card: course, lecture number, title and the mascot. Generated. |
| 2 | **The learning goals. Required.** |
| 3 | The chapter's motivating problem — why any of this matters. |
| 4 … | The chapter's line of thought, in the chapter's order. |
| last | A worked-out example, not a summary. |

The learning goals must be on slide 2, in the chapter's own callout,
`{{< callout type="objectives" >}}`; the build refuses a deck without them.
They are the chapter's goals, each tagged with its level in Bloom's revised
taxonomy, as in *(apply)*. If the chapter's goals do not fit on one slide, the
chapter's goals need cutting, and the chapter is where that happens; see
[Chapter standards](../authoring/chapter-standards.md).

## The deck is the chapter's tl;dr

Students are expected to have read the chapter, so the lecture does not
reproduce it. The deck follows the chapter's **through-line** — the one question
it answers — and carries exactly what that line needs: the turns in the
argument, the definitions the argument uses, the diagram or app that makes a
step visible, one worked-out example per hard step. Everything else is in the book.
Not every topic in a chapter gets a slide, and that is the point.

Where the chapter's own headings name the stages of the argument, keep those
stages recognizable on the slides. A definition on a slide is the chapter's
definition, word for word, in the chapter's callout; slides do not invent a
second wording for the same notion.

## Pictures: only the course's own

**Every picture on a slide is one of the course's own drawings**, from
`assets/img/drawings/`, or the mascot. No portraits, screenshots, logos,
memes, stock art, or any other picture made by someone else, whatever its
licence claims. The course publishes under CC BY 4.0, which cannot cover
third-party work. The build refuses an image from anywhere else and any
embedded video, audio or frame. A new drawing is made for the course and added
to `assets/img/drawings/` first; see [Figures](../authoring/figures.md).

Place a drawing with `{{< img >}}`, as the chapter does. Every drawing on a
slide needs an `alt` that says what it shows; the build refuses one without,
since the deck's text view reads it out.

Where a circuit, tree or table makes a step visible, show it: the chapter's
app, `syntax-tree`, `inference` or `function-table`, or a table. A slide that
only tells the room what the chapter's diagram showed is a slide missing its
diagram.

## Apps

Use a chapter app where the lecture walks through a step: evaluating a
circuit, searching a truth-table, rewriting, resolving. One app per slide.
Give each a `title` naming what it shows, such as
`title="Resolution on (SUN ∨ RAIN) ∧ ¬SUN ∧ ¬RAIN"`: the deck's text view and
screen readers use it. On a slide an app drops what serves a reader working
alone — input help, example descriptions, text alternative, PNG export,
animation switch — and is fitted to the canvas; see
[The Excalidraw theme](reveal/theme.md).

## Notation

Write notation as the chapter does — `$…$`, `!!AND!!`, `inference` — and the
theme sets it in Comic Shanns Logic, with Boolean operators in `--blue-ink`.

## Accessibility

A deck is HTML, so its slides are text a screen reader reads, and the page
carries a text view of every slide below the deck. That view is built from the
slides themselves: it names each app by its `title` and reads each drawing's
`alt`. Keep both meaningful.

## Checklist

1. Twenty slides or fewer; title, goals, motivation in the first three.
2. Goals on slide 2 in the objectives callout, matching the chapter's, with Bloom levels.
3. The deck's sequence is the chapter's through-line, compressed.
4. One idea per slide; short titles; phrases, not paragraphs; definitions quoted.
5. Only the course's own drawings, each with an `alt`.
6. Every app has a `title`; every slide fits its canvas without shrinking its text.
7. Checks from [Testing the framework](reveal/testing.md) pass.

## Prompting an agent

> Migrate Lecture 6 (`conditionals`) to the Reveal.js format, to
> `docs/slides/lecture-standards.md`, against
> `content/textbook/conditionals/index.md`. Follow
> `docs/slides/reveal/migrating.md`, and keep every Excalidraw file. Report
> what you cut.

## Excalidraw decks (deprecated)

These rules apply only to the Excalidraw decks, which Lectures 1 to 4 keep for
the current course run.

- **Images** come from the book's scenes in `assets/img/drawings/sources/` and
  the [icon library](icon-library.md). Removing an imported picture is recorded
  in the manifest's `removedImages`; see [Image review](image-review.md).
- **Scale a reused drawing with its stroke widths**, and flatten a scaled copy
  to `roughness: 0`: rough.js wobbles by an absolute amount. A copy at natural
  size keeps its own `roughness`; the deck's own furniture always uses the clean
  stroke style.
- **Notation** is set in Comic Shanns Logic, the only face carrying the logic
  symbols. Do not run a font replacement across a whole scene. Prose in Virgil
  and code in Cascadia must not contain symbols those faces lack: lay such a line
  out as alternating runs on one baseline. Comic Shanns Logic has no subscript
  or superscript digits; set those as smaller offset runs. See
  [Notation in slides](content-review.md#notation-in-slides).
- **Descriptions**: a deck carries a `narration.yaml` beside its `index.md`,
  with a `number`, a one-sentence `alt` and a `body` for every slide, updated in
  the same batch as the scene; see [Teach and read](teaching.md).
- **Checks**: [Validation](validation.md).

## Related

- [Writing a deck](reveal/authoring.md) — the shortcodes, layouts and rules the build enforces.
- [Chapter standards](../authoring/chapter-standards.md) — the chapter the deck compresses.
- [Efficient slide work](agent-workflow.md) — the Excalidraw workflow.
