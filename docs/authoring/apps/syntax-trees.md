# Static abstract syntax trees

Use `syntax-tree` for small trees that should also work without JavaScript:

```go-html-template
{{</* syntax-tree caption="Reading: ¬(p ∧ q)" */>}}
{"label":"¬","children":[{"label":"∧","children":[{"label":"p"},{"label":"q"}]}]}
{{</* /syntax-tree */>}}
```

The body is JSON: each node has a string `label` and an optional `children`
array in left-to-right order. Leaves omit `children`. The shortcode renders a
figure and nested lists through `partials/apps/tree-node.html`; CSS draws the
edges. Wrap two figures in `<div class="ast-comparison">` to compare readings.
The figures wrap on narrow screens. Larger trees scroll within their
keyboard-focusable figures. Their CSS loads only on pages containing
this shortcode. Use these ASTs for grammatical structure, with variables at
leaves and operators at internal nodes; omit brackets and grammar categories.

## Related

- [The tree terminology gadget](tree-guide.md) — the labelled example tree.
- [Chapter apps](../../design/chapter-apps.md).
