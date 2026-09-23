# Chapter standards

What a revised textbook chapter has to look like. Chapters 1 to 4 —
[`logic-and-ai`](../../content/textbook/logic-and-ai/index.md),
[`formal-languages`](../../content/textbook/formal-languages/index.md),
[`valid-inference`](../../content/textbook/valid-inference/index.md),
[`boolean`](../../content/textbook/boolean/index.md) — are the worked examples.
Open the nearest one when a rule below needs a model; do not read all four.

## The through-line

A chapter answers **one question** about logic and AI. State it in the opening,
in the chapter's own terms, before the learning goals. Pick it up at every
section boundary: say what the previous section settled and what is still
missing, as Boolean algebra does at Boolean models — "So far, we've used Boolean
algebra to describe circuits and arithmetic. But …". Answer it by the end of the
last content section.

Where the line of thought has named stages, carry it in the headings the way
Valid Inference does: Correctness, Hypothetically, _Formally_, _Always_,
_Mostly_. A section that does not move the question forward has to earn its
place as a prerequisite, or go.

## Opening and learning goals

Motivate before defining: one to four paragraphs on the problem the chapter
solves, usually with a chapter drawing or the mascot. Close the opening with the
goals callout, before the first `##`:

```go-html-template
{{< callout type="objectives" >}}
After studying this chapter, you will be able to:

- Use Boolean laws to reason about Boolean functions and circuits.
{{< /callout >}}
```

- Four to six goals, one line each, one observable verb each: explain, define,
  describe, apply, use, compare, assess, represent, implement.
- General enough to survive a rewrite of the chapter, specific enough that no
  other chapter could carry the same goal. "Use Boolean laws to reason about
  Boolean functions and circuits" is the level; "Understand logic" and "Know
  what a Boolean function is" are not.
- Goals cover the chapter's through-line, not its every section.
- The lecture repeats these goals; see [Lecture standards](../slides/lecture-standards.md).

## Definitions

Core definitions get a `definition` callout: the ones the rest of the chapter,
the exercises, or a later chapter build on. Local or minor definitions stay in
the running text with the term marked by `term`. Chapters 1 to 4 carry 3, 10, 13
and 14 callouts — the count follows the chapter's machinery, not a quota.

A definition callout contains the definition and nothing else. No motivation, no
example, no contrast with a neighboring notion, no reassurance about why it
matters. Explanation and examples belong in the paragraphs around the callout;
see [House voice](voice.md) for the phrasings that belong nowhere.

Concise but precise. The callout has to stand alone: name what is defined, name
what it depends on ("for a propositional language", "under $v$"), and use
wording the rest of the chapter can quote verbatim. Title the callout with the
term, and mark the term with `term` inside the callout at its first use.

## Theorems

A named result gets a `theorem` callout, stated exactly, and is normally **not**
proved — Formal Languages states unique readability in three lines and moves on.
Give the idea of the proof in a sentence or two of running text where it helps,
or send the reader to Further readings. Prove in full only where the proof is
itself the thing being taught.

## Glosses

Every important technical term has an entry in `data/glossary.json`, and its
first substantial occurrence in the chapter is marked with `term`. Revised
chapters carry 24 to 37 entries; well under twenty is a sign the chapter is
under-glossed, not a license to pad.

- A gloss never disagrees with the chapter. Where a `definition` callout exists,
  the gloss is that definition compressed to one or two sentences.
- A gloss is a lookup, not a lesson: the standard short definition where there is
  one, otherwise enough to let a reader carry on reading. No examples.
- `chapter` names the bundle that defines the term, not the first mention.

Mechanics — keys, anchors, return links — are in [Glossary and notation](glossary.md).

## Algorithms

Use the [pseudocode standard](pseudocode.md): Python-like notation, highlighted
as Python, with unfamiliar helpers explained in the surrounding text.

## Mathematics and figures

- All mathematics is dollar math in the source: `$A ∧ B$`, displays between
  `$$` lines. Never a picture of a formula. See [Notation](notation.md).
- **Mathematics comes out of the drawings.** A drawing that carries a formula, a
  truth table, a syntax tree or an inference gets rebuilt: the mathematics
  becomes text or a shortcode, the illustration stays a drawing.
- Prefer code to pictures for anything mathematical: `inference`,
  `syntax-tree`, `set`, `set-diagram`, `annotated-math`, function tables,
  `inference-rules`, and the [chapter apps](apps/README.md).
- Illustrations are SVG with an Excalidraw source. No new PNGs; convert the
  chapter's remaining PNGs as part of revising it, and delete only the files
  that chapter used. See [Figures](figures.md).

## Closing and after

The last section is `## Further readings {.readings .nocount}` — specific AIMA
fourth-edition chapters or Open Logic books, each with a clause saying what it
is good for. Update `params.last_edited`. Revise the chapter's exercises and
lecture in the same pass, or note explicitly that they still lag.

## Checklist

1. One question, stated in the opening, picked up between sections, answered.
2. Goals callout closes the opening: four to six specific, observable goals.
3. Core definitions in `definition` callouts; definition only, nothing else.
4. Named results in `theorem` callouts, stated not proved.
5. Every important term marked with `term` and glossed, gloss agreeing with the
   callout.
6. No mathematics inside an image; no PNGs left in the bundle.
7. `params.last_edited` current; `npm run check` clean.

## Prompting an agent

The standard is the prompt. Name the chapter and this file, and let the agent
read it once:

> Revise `content/textbook/sat/index.md` to `docs/authoring/chapter-standards.md`.
> Chapter 4 (`boolean`) is the reference. Report gaps you did not close.

## Related

- [House voice](voice.md) — the phrasings to avoid everywhere.
- [Lecture standards](../slides/lecture-standards.md) — the matching deck.
- [Checking your work](checking-your-work.md), [Editorial direction](../project/editorial-direction.md).
