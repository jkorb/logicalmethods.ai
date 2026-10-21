# Staged release

Textbook chapters and slides through Logic and neural networks (chapter 12)
are released. Exercises are released through Probability and inductive logic
(chapter 11); chapter 12 exercises are still to be written. The later
Logic-based learning chapter and its exercises remain unlisted drafts, with
`build.list: never` and `locked: true`. Their direct URLs still render under
Hugo's `-D` build; the unfinished revisions are kept outside the release.
Unrevised textbook and exercise sources use `params.legacy-notation: true` and
the compatibility renderer in `layouts/partials/legacy-content.html`.
Remove that parameter when converting a page to the current notation format.

The released glossary contains only entries referenced by the released material,
including the complete Notation appendix. Return links point to introductions
in chapters 1–12 or that appendix. Keep unreleased definitions local until the
corresponding revisions are ready.

## Related

- [Overview](../slides/README.md) — which lectures are released.
- [Maintaining the tests](../testing/maintaining.md) — `release.spec.mjs` reads `locked` directly.
- [Page weight](../technical/page-weight.md) — the legacy renderer's cost.
