# The study section

`content/study/` is a top-level section about studying the course rather than
about logic: the learning goals, active recall, chatbots and the flashcards app.

The short advice lives on the section index itself — how the goals map onto
[Bloom's taxonomy](https://en.wikipedia.org/wiki/Bloom%27s_taxonomy), and what
active recall is. Only what needs room gets a page of its own, which today
means chatbots and the flashcards. It declares no `params.groups`, so the
listing stays a numbered sequence. It shares
`layouts/partials/single/guide.html` and `assets/css/guide.css` with
[the tools section](tools-section.md): one prose column, a breadcrumb, previous
and next, and none of the chapter furniture.

## What belongs here

Advice on how to study, that would survive a rewrite of the chapters. Keep it
short, and keep the claims to what is well established — retrieval practice,
spacing, the levels of the taxonomy. Link an external explanation rather than
writing an essay here; a page in this section earns its place by being used,
not by being thorough.

Two things to watch in the writing, both of which have gone wrong here before:

- **No slogans.** The course tests knowledge as well as skill, and it tests it
  by asking you to do something. Lines of the form "logic is a skill, not a body
  of knowledge" are false as well as glib, and "X is not Y" phrasing is a tic
  worth removing on sight; see [House voice](voice.md).
- **Section headings name their subject.** "Learning goals", "Checking the
  answer", "The boxes" — as in the chapters, not "The one rule".

The section also carries the course's position on chatbots: useful for
explaining at a level you choose, for quizzing you, and for marking an attempt;
not useful for producing the answer, which was the work. Prompt advice belongs
there too, including saying who you are and who the model should be. Keep
[the AI disclosure](../../content/ai-disclosure/_index.md) linked, since the
course holds itself to the same standard.

## Related

- [The flashcards app](apps/flashcards.md) — the section's one interactive page.
- [The tools section](tools-section.md) — the other reference section.
