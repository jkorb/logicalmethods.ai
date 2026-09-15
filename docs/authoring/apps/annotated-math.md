# Annotated symbol groups

Use `annotated-math` for selectable mathematical text with braces and labels
above or below symbol groups, as in the propositional alphabet in Chapter 2:

```text
{{< annotated-math prefix="Σ = {" suffix="}" title="An alphabet" >}}
[
  {"symbols":"p₁, p₂, …", "label":"variables", "position":"below"},
  {"symbols":"¬, ∧, ∨", "label":"operators", "position":"above"}
]
{{< /annotated-math >}}
```

Supply literal Unicode symbols, without dollar delimiters, in a JSON array.
Each group requires `symbols`; `label` is optional and `position` defaults to
`below`. `prefix`, `suffix`, and `title` are optional; `separator` defaults to
comma-space. Mathematical text uses Comic Shanns Logic and labels use the course
handwriting face. A small decorative SVG brace stretches to the group width.
The figure exposes a complete labelled description to assistive technology and
can scroll horizontally on narrow screens. It works without JavaScript and
needs no Excalidraw export. Its stylesheet loads only on pages using the
shortcode.
