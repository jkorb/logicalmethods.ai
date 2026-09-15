# Render hooks

Reference pages marked with `params.appendix` use “Appendix” and a letter in
place of numbered chapter labels. They retain their paths and weight ordering.

Chapter contents list main sections (`h2`) only. Hugo's
`markup.tableOfContents` settings omit subsection links; subsection headings and
their anchors remain available in the chapter.

| Hook | Does |
| --- | --- |
| `_default/_markup/render-link.html` | external-link icon **inside** the anchor, `rel="noopener noreferrer"`, a visually-hidden "(opens in a new tab)" |
| `_default/_markup/render-table.html` | wraps tables in a uniquely-named, focusable scroll region; empty header cells become `<td>` |
| `textbook/_markup/render-heading.html` | level 1 emits the chapter eyebrow, `h1`, metadata and contents; all levels get a self-link |
| `exercises/_markup/render-heading.html` | questions are `h2`, sub-parts and solutions `h3`; numbering is CSS counters |

The exercise hook closes the previous block and opens a new one, so each question
becomes its own container and the wrapper opened by the template balances the final
close. **The question counter therefore lives on `.exercises`, not
`.exercises__body`** — the body element is closed at the first question.

## Related

- [Tables](tables.md) — one caution about shortcode placeholder tokens in the table hook.
- [Code blocks](code-blocks.md) — the codeblock hook.
