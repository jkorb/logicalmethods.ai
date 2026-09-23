# Callouts

Mark definitions, examples and warnings with the callout shortcode rather than
plain paragraphs:

```go-html-template
{{< callout type="definition" title="Valid inference" >}}
An inference is valid iff it is impossible for the premises to be true and the
conclusion false.
{{< /callout >}}
```

`type` is one of `definition`, `example`, `theorem`, `warning`, `note` or
`objectives`. The type name is always rendered as visible text, so the meaning
never depends on color alone.

Use `callout type="note"` with a title beginning “Modeling assumptions” to flag
choices of domain, idealization, evidence model, or action policy. Explain what
those choices let us conclude in the terminology of chapter 1.

## Example sentences

For an example sentence without a callout heading or quotation bar, use:

```go-html-template
{{</* sentence */>}}
If a mushroom has red spots and gills, then it's not poisonous.
{{</* /sentence */>}}
```

It uses Comic Shanns Logic on a quiet paper surface. Its body supports Markdown,
including dollar math. Use blockquotes for actual quotations and code fences
for programs, not as substitutes for example sentences.

## Related

- [Chapter standards](chapter-standards.md) — which definitions get a callout, and what may go in one.
- [Components](../design/components.md) — the surfaces these render onto.
