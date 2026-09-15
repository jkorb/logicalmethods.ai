# Publishing a lecture

To publish a reviewed lecture, move its staged page/deck into the corresponding
`content/slides/<topic>/` bundle, replacing the review-notice page. Change its
manifest `output` to that bundle, remove `publication: unpublished`, set
`locked: false`, and update the source/deck allowlists in `.gitignore` only
after checking the scene and every SVG for unreviewed embedded images. Remove
the staged copy so the preview overlay cannot shadow future changes. Adjust the
publication tests, render, and check the normal Hugo build. Publication is a
separate decision; do not deploy the preview overlay as a shortcut.

## Related

- [Image review](image-review.md) — clearance is a precondition.
- [Content review](content-review.md), [Validation](validation.md).
- [Staged release](../authoring/staged-release.md) — the matching chapter state.
