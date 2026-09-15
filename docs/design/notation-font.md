# The notation font

## Why the object language is one face

A formula is a single run of text: `Human x → Mortal x` is Latin identifiers and
a logic symbol side by side. If the identifiers come from one font and the
symbols from somewhere else, the seam is visible in every formula in the book.
That seam is what produced the original PNG symbols, and it is why the fix was
to put the symbols **into the font** rather than to keep composing formulas from
two sources.

`assets/fonts/ComicShanns/comic-shanns-logic.woff2` is Comic Shanns with twenty
logic glyphs added: `∀ ∃ ∧ ∨ ↔ ⟹ ⊨ ⊭ ⊢ ⊬ ⊆ ∈ ∉ ∩ ∪ ⟦ ⟧ ∴ ⊥`. Most added outlines
come from the course's own hand-drawn symbols. The biconditional `↔` combines the
native `→` with its reflection, keeping the conditional's stroke and height, with
a slightly longer shaft between the heads. It remains the single Unicode character
U+2194, rather than two adjacent arrows. Comic Shanns is MIT licensed, which
permits this; the notice travels with the font.

Rebuild it with:

```sh
python3 scripts/build-notation-font.py     # needs fonttools and brotli
```

It reads `assets/img/sym/*.svg` — **keep those files, they are the glyph
source** — and writes the patched font. `--sym-scale` in each SVG records the
symbol's size relative to the original drawing and sets the glyph's height, so
relative sizes stay true to the artwork.

## What this bought

Formulas are now ordinary text. They can be selected, copied, searched and read
aloud; a screen reader announces each symbol by its Unicode name, which is more
accurate than any alt text we would have written. One chapter page carries over
300 logic symbols that were previously 300 images.

`{{< approx >}}` is the one exception: "approximately models" is a bespoke
notation with no Unicode character, so it stays an inline SVG via
`partials/shared/sym.html`.

## Source code is deliberately not in the hand

Comic Shanns slants. That is charming for a formula inside a sentence and it
costs comprehension in a twenty-line proof, where code is read character by
character and copied out. Code blocks therefore use JetBrains Mono, which was
drawn for the job. Inline formal notation keeps Comic Shanns Logic.

## Related

- [Code blocks](code-blocks.md) — the Lean keyword pass and language badge.
- [Authoring tools](../technical/authoring-tools.md) — what the font build needs.
