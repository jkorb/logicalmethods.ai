# References and links

Use the `img` shortcode for both page-bundle images and shared SVGs; see
[Figures](figures.md) for paths, spacing and exports.

For textbook references,
[`chapter_ref`](../../layouts/shortcodes/chapter_ref.html) looks up a topic under
`/textbook/` and accepts an optional heading `id`. A missing chapter fails the
build:

```go-html-template
{{< chapter_ref chapter="logic-and-ai" >}}Logic and AI{{< /chapter_ref >}}
```

Preserve existing heading anchors when editing titles, or update incoming links.

## External embeds

New external embeds must use the `iframe` shortcode, which contacts the named
host only on request. No lecture currently relies on an external slide embed.

## Related

- [Solutions and passwords](solutions.md) — the heading-ID convention for exercises.
- [Render hooks](../design/render-hooks.md) — what the link hook adds to anchors.

## Chapter labels

Cross-chapter links made with `chapter_ref` or root-relative Markdown links
under `/textbook/` display “Chapter N ·” (or “Appendix X ·”) before the
authored text. Existing text that names the chapter number is not prefixed
again. Links within the current chapter keep their ordinary Markdown label.
The number comes from the chapter weight, and appendix letters from front matter.
Use a section anchor when the reference concerns a particular concept.
