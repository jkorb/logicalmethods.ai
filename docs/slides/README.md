# Self-hosted lecture slides

All 12 lectures are migrated to self-hosted Excalidraw: **217 slide frames**.
Lectures 1 to 4 (80 frames) are reviewed and released, and use the normal
website viewer. Lectures 5–12 (137 frames) are staged locally outside Hugo's
published content in ignored `slides/unpublished/`, awaiting content and image
review. Their normal website paths show a short review notice; no Excalidraw Pro
embed remains. `locked` and `draft` are not publication barriers because CI
builds with `-D`.

With the ignored local sources and staged exports present, use
`npm run slides:preview` to review **all twelve** decks at
`http://localhost:1315/slides/`. This uses the explicitly opt-in
`hugo.slides-preview.toml` mount overlay. Staged pages are unlocked in this
local overlay so the slide index links to every lecture. Do not add that overlay
to CI or deploy its build output. Preview output goes to `tmp/slides-preview-site/`,
separate from the normal build. Ordinary `hugo -D` excludes the staged deck files.

| Lecture | Frames | Slide path |
| --- | --- | --- |
| 1 | 20 | `/slides/logic-and-ai/` |
| 2 | 20 | `/slides/formal-languages/` |
| 3 | 20 | `/slides/valid-inference/` |
| 4 | 20 | `/slides/boolean/` |
| 5 | 19 | `/slides/sat/` |
| 6 | 17 | `/slides/conditionals/` |
| 7 | 18 | `/slides/proof/` |
| 8 | 20 | `/slides/FOL/` |
| 9 | 16 | `/slides/FOL-inference/` |
| 10 | 15 | `/slides/many-valued/` |
| 11 | 19 | `/slides/probability/` |
| 12 | 14 | `/slides/anns/` |

## Notes

- [Lecture standards](lecture-standards.md) — what a revised deck has to look like.

- [Efficient slide work](agent-workflow.md) — scope reading, edits and visual review.
- [Teach and read](teaching.md) — navigation, `narration.yaml`, no-JavaScript.
- [Install the local authoring tools](authoring-setup.md) — the editor and saving.
- [Slide management](slide-management.md) — adding, reordering, renumbering.
- [The icon library](icon-library.md) — importing, saving, style.
- [Rendering](rendering.md) — turning saved sources into decks.
- [Sources and generated files](files.md) — what lives where and what Git ignores.
- [The export pipeline](export-pipeline.md) — how a frame becomes an SVG.
- [Image review](image-review.md) — licence clearance before release.
- [Content review](content-review.md) — what each lecture still needs.
- [Publishing a lecture](publishing.md) — the release checklist.
- [Validation](validation.md) — select checks for the changed lecture or tool.
- [Slide test coverage](test-coverage.md) — what the optional suites exercise.
