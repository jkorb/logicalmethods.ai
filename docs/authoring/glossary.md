# Glossary and notation

The glossary definitions live in `data/glossary.json`. Each entry has a stable
key, `term`, `definition` (plain text), and `chapter` (textbook bundle name).
Keep the key stable: chapter links and external links use it as an anchor.
Glossary return links go to the first `term` shortcode for that key in the
entry's `chapter`. Term-link IDs normally use `term-<key>-<ordinal>`. Repeated
`iff` links also include parent shortcode ordinals, so occurrences in different
callouts have distinct IDs. Glossary return links resolve either form.
An optional `anchor` field overrides this with a heading or other existing ID
(without `#`), for example when the definition has no marked term yet. Prefer
the section that explains the concept over an incidental early mention.
A missing chapter or missing return target configuration fails the build;
check rendered fragment destinations after changing an explicit anchor.

`content/textbook/glossary/index.md` renders the collection with the `glossary`
shortcode; the preceding Notation appendix combines symbols, readings, and
glossary links in one table, ordered from sets and syntax through semantics
and proofs to uncertainty and learning. Its separate LaTeX cheat sheet gives
app commands, complete parser inputs, and instructions for LaTeX documents.
Keep its typing notes consistent with the commands supported by
`assets/js/apps/latex-input.js`; the cheat sheet distinguishes app-supported
commands from commands for LaTeX documents.

## Marking a term

At the first substantial introduction of a concept, use:

```go-html-template
{{< term "countermodel" "countermodel" >}}
```

The second argument is optional and preserves the wording or inflection needed
in the sentence. The link previews the definition on hover or keyboard focus
and opens the glossary entry in a new tab. Do not wrap it in another Markdown
link. Without JavaScript, the ordinary link and native title remain available;
all glossary entries remain readable. Search matches words in terms and their
definitions. A direct fragment link reveals the entry even after filtering.

## Algorithms and further readings

The Python-style pseudocode introduction is in Formal Languages, after parsing.
It reconstructs the recursive algorithm demonstrated by the parsing app.
Distinguish executable examples from templates or fragments, and state the input,
intended output, and termination conditions of an algorithm.

Further readings refer to specific AIMA fourth-edition chapters or Open Logic
books; label PDF links and distinguish publisher pages from freely available PDFs.

## Related

- [Chapter standards](chapter-standards.md) — what a gloss says, and how it relates to the chapter's definition.
- [Glossary interaction](../design/glossary.md), [Further readings](../design/further-readings.md).
- [Staged release](staged-release.md) — which entries the released glossary contains.
