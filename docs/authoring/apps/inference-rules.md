# Inference overviews

`inference-rules` accepts a JSON array with `name`, `premises` (an array of
Markdown strings), `conclusion`, and `explanation`. Give it a `caption`:

```text
{{< inference-rules caption="Classical rules" >}}
[{"name":"Modus ponens", "premises":["$(A → B)$", "$A$"], "conclusion":"$B$", "explanation":"A and its conditional imply B."}]
{{< /inference-rules >}}
```

The open display places each inference left of its name and explanation.
The inference line is its only ruling; there is no table grid. It uses
`partials/figures/inference.html`, shared with `inference`. This component
organizes schemas, not proof trees or derivation checking. State the intended
logic in the caption: a schema alone does not assert validity in every logic.

## Related

- [Inference figures](../inference-figures.md) — a single inference.
- [Finite set diagrams](../../design/set-diagrams.md) — the shared open-display treatment.
