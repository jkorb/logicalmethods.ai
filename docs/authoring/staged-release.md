# Staged release

Textbook chapters and exercises through Valid Inference are unlocked. Later
chapters and exercises are marked `locked: true`: navigation is grayed out,
while direct URLs still work. Slides have a separate review and release schedule;
the Valid Inference slides are still locked.
Unrevised textbook and exercise sources use `params.legacy-notation: true` and
the compatibility renderer in `layouts/partials/legacy-content.html`.
Remove that parameter when converting a page to the current notation format.

The released glossary contains only entries referenced by the released material,
including the complete Notation appendix. Return links point to introductions
in chapters 1–3 or that appendix. Keep unreleased definitions local until the
corresponding revisions are ready.

## Related

- [Overview](../slides/README.md) — which lectures are released.
- [Maintaining the tests](../testing/maintaining.md) — `release.spec.mjs` reads `locked` directly.
- [Page weight](../technical/page-weight.md) — the legacy renderer's cost.
