# Inference figures

```go-html-template
{{</* inference rule="MP" */>}}
$A → B$
$A$
---
$B$
{{</* /inference */>}}
```

Lines above the `---` are premises, one per line; the line below is the
conclusion. `rule` is optional. Add `layout="stacked"` to put premises
underneath one another, followed by a solid rule and the conclusion. Each
line is centered, in the same size and face as display mathematics. Without
that option, the existing side-by-side presentation is retained. The figure gets
a sentence as its accessible name ("From …, and …, infer …"), so a screen reader
hears the inference rather than three loose fragments.

## Related

- [Inference overviews](apps/inference-rules.md) — several rules in one display.
- [Components](../design/components.md) — stacked inference styling.
