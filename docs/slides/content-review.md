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
carries the first `narration.yaml`. Lecture 2 still has a course-team slide with
the same unreviewed staff photographs.

Lectures 3–12 were copied byte-for-byte, without automatic font or notation
replacement. Lecture 2 has local migration adjustments, but remains unreleased.
Review them against the book, including historical staff/attendance information,
terminology, proof examples, screenshots and image rights. Lecture 3 retains two
“Todo” frames; Lecture 7 also has an unfinished note on its proof-systems slide.
Lecture 9 ends with the Lean Game Server screenshot. Blank-looking, closing and
unnumbered frames were kept. Lecture 2 has 18 frames despite its original
numbering ending at 16.

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
