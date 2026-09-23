# Lecture standards

What a revised lecture deck has to look like. Lectures 1 to 4 are the worked
examples; [Content review](content-review.md) records what each revision
changed. This note is the forward-looking spec for Lectures 5 to 12.

## Length

**Twenty slides, maximum**, sized for a 90-minute lecture. Lectures 1 to 4 each
land on exactly twenty. That is roughly four minutes of talking per slide, which
is what a slide carrying one idea is worth. A deck that will not fit is a deck
whose chapter has not been compressed yet, not a deck that needs slide 21.

## Shape

| Slide | Carries |
| --- | --- |
| 1 | Title card: course, lecture number, chapter title. |
| 2 | The learning goals. |
| 3 | The chapter's motivating problem — why any of this matters. |
| 4 … | The chapter's line of thought, in the chapter's order. |
| last | A worked case, not a summary. |

The learning goals are the chapter's own, tagged with the levels of Bloom's
revised taxonomy. If the chapter's goals do not fit on one slide, the chapter's
goals need cutting, and the chapter is where that happens; see
[Chapter standards](../authoring/chapter-standards.md).

## The deck is the chapter's tl;dr

Students are expected to have read the chapter, so the lecture does not
reproduce it. The deck follows the chapter's **through-line** — the one question
it answers — and carries exactly what that line needs: the turns in the
argument, the definitions the argument uses, the diagram that makes a step
visible, one worked case per hard step. Everything else is in the book. Not
every topic in a chapter gets a slide, and that is the point.

Where the chapter's own headings name the stages of the argument, keep those
stages recognizable on the slides.

## What goes on a slide

One idea per slide: a claim, a definition, a diagram, a worked example, a table.
Phrases and formulas, not paragraphs — the sentences are spoken, not projected.
A definition on a slide is the chapter's definition, word for word where it
fits; slides do not invent a second wording for the same notion. Nothing on a
slide explains why the slide matters; see [House voice](../authoring/voice.md).

## Images

Illustrate only from the book's own scenes in `assets/img/drawings/sources/` and
from the [icon library](icon-library.md). **No imported pictures** — no
portraits, screenshots, logos, memes, or stock art. The course publishes under
CC BY 4.0, which cannot cover third-party work, and a picture whose creator,
source and license we cannot state does not go in a released deck. Removing one
is recorded in the manifest's `removedImages`; see [Image review](image-review.md).

Scale a reused book drawing **with its stroke widths**, the way a browser scales
the chapter's SVG. Copied drawings keep their own `roughness`; only the deck's
own furniture uses the clean stroke style.

## Notation

Formulas and example inferences are set in Comic Shanns Logic — it is the only
face carrying the logic symbols. Boolean operators use `--blue-ink`, as `.Boolean`
does on the web. Do not run a font replacement across a whole scene: independently
positioned symbols, subscripts and operators lose their alignment. See
[Notation in slides](content-review.md#notation-in-slides).

Prose set in Virgil and code set in Cascadia must not contain logic symbols
either face lacks: lay such a line out as alternating runs on one baseline,
with the symbol in Comic Shanns Logic. Comic Shanns Logic itself has no
subscript or superscript digits, so set those as smaller runs offset from the
baseline rather than as inline characters.

## Descriptions

A revised lecture carries a `narration.yaml` beside its `index.md`, with a
`number`, a one-sentence `alt` and a `body` for every slide. Update it in the
same batch as the scene edits; see [Teach and read](teaching.md).

## Checklist

1. Twenty slides or fewer; title, goals, motivation in the first three.
2. Goals match the chapter's and carry Bloom levels.
3. The deck's sequence is the chapter's through-line, compressed.
4. One idea per slide; no paragraphs; definitions quoted from the chapter.
5. No third-party image; removals recorded in `removedImages`.
6. Formulas in Comic Shanns Logic; reused drawings scaled with their strokes.
7. `narration.yaml` complete and in step; checks from [Validation](validation.md) pass.

## Prompting an agent

> Revise Lecture 6 (`conditionals`) to `docs/slides/lecture-standards.md`,
> against `content/textbook/conditionals/index.md`. Follow
> `docs/slides/agent-workflow.md` for how much to read and when to render.
> Report what you cut.

## Related

- [Efficient slide work](agent-workflow.md) — how much to read, when to render and review.
- [Slide management](slide-management.md), [Rendering](rendering.md), [Publishing a lecture](publishing.md).
- [Chapter standards](../authoring/chapter-standards.md) — the chapter the deck compresses.
