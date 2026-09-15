# Notation

Textbook and exercise pages use ordinary Markdown code and dollar-delimited
mathematics. Hugo's [passthrough render hook](https://gohugo.io/render-hooks/passthrough/)
handles math in `layouts/_default/_markup/render-passthrough.html`; there is no
page-template regex pass over the source.

| Source | Result |
| --- | --- |
| `$A ∧ B$` | Inline Comic Shanns Logic notation. |
| `$$` on separate lines around an expression | Centered Comic Shanns Logic display. |
| Single backticks | Literal inline source code in JetBrains Mono. |
| Backtick or tilde fences, optionally with a language | Source-code blocks; syntax highlighting when specified. |
| `$!!AND!!$`, `$X !!AND!! Y$` | Blue Boolean notation within math. |
| `$~!NOT!~$`, `$~!NOT!~ A$` | Red Kleene notation within math. |

Type Unicode symbols directly: dollar math selects a font, not a TeX engine.
Use spaces around binary operators and after commas; attach negation and
brackets to their operands. Internal line breaks in displays are retained.
Keep a display within one Markdown paragraph: no empty lines, list markers or
heading underlines inside it. Number calculation lines `(1)`, `(2)`, etc.
A tab before an annotation aligns it at the next 24-space tab stop.
Give headings containing math explicit IDs to preserve stable links and exercise
solution controls (for example, `## $SAT$ {#sat}`).
For a standalone equals sign use `&#61;` to avoid Markdown's heading syntax.
Use `&lt;` for a less-than sign adjacent to a letter, since inline HTML remains
available in math. Symbol shortcodes and author-supplied inline HTML still work.

Displays and illustrated sets share compact margins and regular-weight type.
Oversized displays shrink to fit; break very long expressions into meaningful
lines to keep them readable. Code blocks keep their font size and scroll.

Dollar signs inside code remain literal. Escape a literal dollar in prose as
`\$`. The former `%…%` source-code escape is retired. Keep genuine
whiteboard emphasis explicit with `excalifont`; it isn't math notation.

Prefer literal symbols to symbol shortcodes: `$∀x(Human x → Mortal x)$` is
readable in the source. The older symbol shortcodes still emit the same Unicode
characters. If a glyph is missing, add it to the patched font rather than use
an image; see [The notation font](../design/notation-font.md).

## TeX pages

The exception is `params.latex: true`, available for pages that explicitly request
TeX rendering: dollars retain TeX meaning there and the page loads the bundled
KaTeX renderer. Backticks still show literal source. No KaTeX is loaded on
ordinary book pages.

## Related

- [Notation](../design/notation.md) — the design rule behind the four faces.
- [Display mathematics](../design/display-math.md) — how oversized displays are fitted.
