# Publishing a lecture

To publish a reviewed lecture, move its staged page, deck and any
`narration.yaml` into the corresponding `content/slides/<topic>/` bundle,
replacing the review-notice page: drop the notice and `locked`, and add
`params.selfHosted: true`, as on Lecture 1. Change its manifest `output` to that
bundle, remove `publication: unpublished`, and update the source/deck allowlists
in `.gitignore` only after checking the scene and every SVG for unreviewed
embedded images. Remove the staged copy so the preview overlay cannot shadow
future changes. Then adjust the publication tests — the released-lecture list and
the still-unpublished range in `tests/unit/slides.test.mjs`, the same range in
`tools/slides/preservation.test.mjs`, and the deck and review-notice lists in
`tests/browser/slides.spec.mjs` — render, and check the normal Hugo build.
Publication is a separate decision; do not deploy the preview overlay as a
shortcut.

## Related

- [Image review](image-review.md) — clearance is a precondition.
- [Content review](content-review.md), [Validation](validation.md).
- [Staged release](../authoring/staged-release.md) — the matching chapter state.
