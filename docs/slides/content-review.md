# Content review

Migration is complete. **Lecture 1 has been revised** against textbook
chapter 1 and now runs to 20 slides, sized for a 90-minute lecture. Its learning
goals open the deck, tagged with the levels of Bloom's revised taxonomy. The
gaps against the chapter are filled: inference indicators and notation, expert
systems, the Diogenes counterexample, search and learning, knowledge
representation, system 1 and system 2, logic-checking and proof assistants. The
deck summarizes rather than reproducing the chapter, so not every topic in it
gets a slide. The course-team and attendance slides are gone, so anyone can
teach from the deck, and every image is removed. Slides are illustrated from
the book's own drawings in `assets/img/drawings/sources/` and from the icon
library; keep using those two sources rather than importing pictures. It also
carries the first `narration.yaml`.

**Lecture 2 has been revised and released** the same way against chapter 2, and
now runs to 20 slides, the same length as Lecture 1. Learning goals open it, the course-team and attendance slides are
gone, and all six images are removed, so nothing in it is unreviewed
third-party work. The gaps against the chapter are filled: the ice-cream
conditional, extensional definition and set abstraction, the empty string,
inductive definitions labelled by base case, induction step and closure, the
two modelling-assumption notes, metavariables, rewrite rules and a derivation,
abstract syntax trees and the vocabulary of rooted trees, the parsing algorithm
in pseudocode, the level-crossing reading of `¬p ∧ q`, and the bracketing
conventions. It carries the deck's second `narration.yaml`. The mushroom and
flag drawings are the only artwork kept from the original scene; the rest comes
from `assets/img/drawings/sources/`, the icon library and Lecture 1's mascot.
The ice cream for the promise example is a new book drawing,
`gimmick_ice_cream`. Its pseudocode slide is the first use of font family 3,
Cascadia, which the exporter embeds like the other faces.

A book drawing placed on a slide has to be scaled **with its stroke widths**, the
way a browser scales the chapter's SVG. Scaling the geometry alone leaves a
shrunken figure wearing its full-size lines, which is what makes a reused drawing
look wrong beside the same figure in the chapter.

A **scaled** copy also has to drop to `roughness: 0`. rough.js displaces each
point by an absolute amount — `maxRandomnessOffset` of 2, times the element's
`roughness` — so a drawing shrunk to a third of its size keeps full-size wobble
on a third-size figure and reads as sketchy beside the same drawing in the book,
which the browser scales whole. A copy placed at natural size keeps its own
`roughness`, and only the deck's own furniture uses the clean stroke style.

**Lecture 3 has been revised and released** the same way against chapter 3,
and now runs to 20 slides, the same length as Lectures 1 and 2. Learning
goals open it; the two “Todo” frames and the duplicated “Deductive validity”
and “Inductive validity” titles are gone. The gaps against the chapter are
filled: correctness and the named fallacies, truth preservation and the
hypothetical test, soundness beside validity, logical form with `∴` and `⊨`,
material validity and Carnap's meaning postulate, indefeasibility, deduction in
a Python program, the six schemas and fallacies side by side, models and the
logical space, subsets and intersections in picture sets, deductive consequence
and countermodels as set diagrams, the blueprint and its boundary cases,
defeasible inference, enumerative induction, the die distributions, conditional
probability and both support notions. All eight images — a portrait, two
screenshots of AI mathematics results, one unidentified picture and four
product logos — are removed and recorded in the manifest's `removedImages`
block. Its artwork comes from `assets/img/drawings/sources/` and from Lecture 2's
title card, `∀` glyph, check marks and lightbulb mascot. It carries the deck's
third `narration.yaml`. The set diagrams use the book's own set-diagram palette
from `assets/css/tokens.css`, and the little worlds are drawn, since
`model-world.svg` has no Excalidraw source. Only Comic Shanns Logic carries the
logic symbols, so every formula and example inference is set in it; it has no
Greek, which is why the chapter's `Σ` becomes a plain name on the slides.

**Lecture 4 has been revised and released** the same way against chapter 4,
and now runs to 20 slides. Learning goals open it; the unfinished closing frame
is gone. The gaps against the chapter are filled: why the algebra matters at
both levels, the Boolean values and bivalence, the three function tables and
truth-functional completeness, both relay configurations and the three
implementations, the laws with commutativity worked through, De Morgan and the
derivation that beats a truth table, binary notation, column addition, the half
and full adder, Boolean valuations and the count of models, the evaluation
clauses on a parse tree, propositions with union and difference, and both
inference tests. All five images — portraits of Boole, Post, Shannon and De
Morgan, and a scan of Shannon's thesis — are removed and recorded in the
manifest's `removedImages` block. Its artwork is the chapter's own `bool_*`
drawings plus Lecture 2's title furniture. Boolean operators are set in the
book's blue, `--blue-ink`, as `.Boolean` does on the web. It carries the deck's
fourth `narration.yaml`. The manifest's two `nonSlideElements` rectangles are
untouched, and remain outside every frame as deleted history.

**Lecture 5 has been revised and released** the same way against chapter 5,
and now runs to 20 slides. Learning goals open it, and the attendance slide is
gone. The deck
follows the chapter's two lines of thought. First the reduction: satisfiability
and joint satisfiability, the SAT problem, circuit verification through
`¬(S ↔ C)`, and validity as unsatisfiability. Then the cost: truth-tables as
brute force, `O(2ⁿ(m + 1))` and combinatorial explosion, normal forms and the
rewrite rules, distribution's exponential blow-up, resolution with its
two-step refutation, and the Tseytin transformation's linear growth. The
chapter's five central algorithms are on the slides as pseudocode —
`evaluate`, `truth_table_sat`, `normal_form`, `resolution_sat` and `tseytin` —
set in Cascadia, with their `¬ ∧ ∨` glyphs placed in Comic Shanns Logic inside
their own monospace cells, since Cascadia carries no `∧` or `∨`. The closing
slide is a worked case: the NAND circuit refuted in two resolution steps, and
the faulty circuit that saturates instead. Both images — an attendance QR code
and an imported "all the things" meme — are removed and recorded in the
manifest's `removedImages` block. Its artwork is the chapter's own `sat_*`
drawings plus `gimmick_mouse` and Lecture 4's title card and lightbulb mascot.
It carries the deck's fifth `narration.yaml`.

A second pass lightened it: the prose is down to about 50 words a slide, boxes
are sized to their contents rather than to a fixed width, the scaled book
drawings are flattened to `roughness: 0`, and two diagrams were added in the
deck's own clean style — the chapter's NAND circuit, drawn as the default-off
relay feeding the default-on one and again with the lamp wired before the
second relay, and the parse tree for `SUN ∨ (¬RAIN ∧ ¬WIND)` with an arrow up
it. The book's own three-variable truth-table drawing replaced a hand-built
table.

Comic Shanns Logic has no subscript or superscript digits, so `INPUT₁`, `A₁`,
`2ⁿ` and `3ⁿ` are set as separate smaller runs, lifted or dropped from the
baseline, rather than as inline characters that would fall back to the reader's
own font. Virgil carries no logic symbols at all: prose containing `∧`, `↔`,
`⊥` or `∴` is laid out as alternating prose and Comic Shanns runs on one
baseline.

**Lecture 5 was then migrated to Reveal.js.** It keeps the Excalidraw deck's
order and its 20 slides, with the title slide and its mascot generated and the
learning goals in the chapter's objectives callout. Definitions, the theorem
boxes, inferences and rewrite rules are the chapter's own shortcodes. Apps
replace drawn diagrams where they show the step better: the NAND circuit on the
circuit-verification slide, truth-table search, normal-form rewriting and
resolution, and the closing worked-out example, which is the resolution app on the
circuit's `¬(S ↔ C)`; its "Faulty circuit" example gives the saturating case.
`evaluate` stays as pseudocode; `truth_table_sat`, `normal_form`,
`resolution_sat` and `tseytin` are left to the chapter, since code and app
together do not fit a slide. The evaluated parse tree and the coin drawing are
cut. The Excalidraw scene, exports and `narration.yaml` remain.

**Lecture 6 was written in Reveal.js** against the revised chapter 6, following
the order of the staged Excalidraw draft: 20 slides, with the goals and their
Bloom levels, the material conditional, rewriting, modus ponens and the
counterfactual caveat, the weather knowledge base, forward and backward
chaining, direction against order, Horn clauses, Horn SAT, and planning with
its miracle model and frame conditions. The chapter's apps carry the steps:
rewriting, forward and backward chaining, the side-by-side search comparison,
Horn SAT with counters, and the closing worked-out example, the two-block plan. The
`forward`, `backward` and `horn_sat` pseudocode is left to the chapter, whose
apps name each instruction as it runs. The Excalidraw source and staged copy are
untouched.

Lectures 6–12 were copied byte-for-byte, without automatic font or notation
replacement. Review them against the book, including historical
staff/attendance information, terminology, proof examples, screenshots and
image rights. Lecture 7 has an
unfinished note on its proof-systems slide. Lecture 9 ends with the Lean Game
Server screenshot. Blank-looking, closing and unnumbered frames were kept.

Lecture 4's two loose rectangles sit outside every frame. They remain unchanged
in the source and archive, and are explicitly recorded in the manifest's
`nonSlideElements`; they are not silently attached to unrelated slides. New
unframed elements still fail rendering unless explicitly accounted for.

Lecture 7 contains four links to Lean examples. The source retains them; the
viewer presents their destinations below the appropriate slide. Export removes
only SVG anchor wrappers, preserving their visible contents. No linked site is
fetched during rendering or viewing.

## Notation in slides

Do not replace every font automatically. Independently positioned mathematical
symbols, subscripts, operators and prose may lose alignment. Use Comic Shanns
Logic for revised formulas, and inspect each affected frame. Preserve the
AST/grammar-tree distinction and the book's definitions and grouping conventions.

Chapter mappings differ for Lecture 7 (`proof` slides, `proofs` textbook) and
Lecture 12 (`anns` slides, `learning` textbook). Keep existing paths and IDs.

## Related

- [Image review](image-review.md), [Publishing a lecture](publishing.md).
- [Notation](../authoring/notation.md).
