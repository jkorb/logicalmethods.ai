# The tools section

`content/tools/` is a top-level section with one page per app, listed in the
main navigation beside the textbook. It replaces Appendix C, which carried
every app on a single page.

**Every reusable app belongs here, and nothing else does.** The test is whether
the app takes the reader's own input:

- A **tool** runs on whatever you give it: a formula you typed, a valuation you
  set, a circuit you wired. It earns a page. The chapter keeps its own embedded
  instance — same shortcode, different parameters.
- An **illustration** runs on an example fixed by the author: a set-diagram
  scene, a walkthrough of one inference, a circuit with nothing to change but
  the switches. It belongs in the chapter that explains it, and nowhere else.
  Copying one here gives a reader a page they cannot use on their own problem.
- An **exercise** sets a target and marks the attempt. It belongs in the
  exercise sheets. Where an exercise app has a genuine open mode, the tools
  section takes that mode rather than the graded one: the circuit workbench
  appears here as `preset="sandbox"`, with no task and no Check button.

Drills and games stay out for the same reason — the LaTeX drill, the formula
builder and the practice apps score an attempt rather than answer a question.

## A tool page

`content/tools/<slug>/index.md` is a leaf bundle with a `weight`, a unique
`params.id` (`tls-…`) and a `params.teaser` for the section listing. Weights
run in tens, following the order in which the book introduces the tools. The
body keeps one shape:

1. An `#` heading, then a lead paragraph saying what the tool calculates and
   what the logical point of calculating it is.
2. A **Scope** line, in bold run-in: the language and the limits the app
   actually has, and what a reader might wrongly expect it to cover.
3. The app, under an `##` heading where the page carries more than one.
4. `## Using it` — how to drive it, and where its limits are.
5. `## In the book` — `chapter_ref` links to the sections that explain the idea.

Reuse the `logic-app` and `set-diagram` shortcodes with their parameters; never
copy app markup or JavaScript into a page. Several instances on one page are
fine, and the browser suites rely on the parser page carrying two.

**Name a page for the scope it has, not the one it suggests.** Every app here
is tied to one language, and the section will grow first-order tools beside the
propositional ones, so `Propositional parser` and `Boolean evaluation` are the
honest titles and `Parser` and `Formula evaluation` are not. Where the title is
already the name of an algorithm — `Resolution` — the teaser and the Scope
line carry the restriction instead.

The section sorts its pages into categories by the logical work they do —
syntax, semantics, automated reasoning, circuits — through `params.groups` on
the section and `params.group` on each page; see
[Pages and front matter](front-matter.md). Name a category after the logical
job, not the chapter, so that a first-order parser can join the syntax group
later without renaming anything.

These pages are not chapters. The section sets no `section-names`, so nothing is
labelled "Tool 3", and `layouts/tools/single.html` renders a single prose column
with no chapter rail and no progress bar.

## Related

- [Interactive chapter apps](apps/README.md) — every shortcode and its parameters.
- [Pages and front matter](front-matter.md) — bundles, weights and IDs.
