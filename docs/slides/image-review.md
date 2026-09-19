# Images and publication review

**Lectures 1 to 4 are cleared; Lectures 5–12 are not.** Every embedded image in
Lecture 1 was removed on 14 September 2026, because no creator, source or licence
could be established for any of them and the course publishes under CC BY 4.0,
which cannot cover third-party work. Its manifest's `removedImages` block records
their original file IDs and the removal decision. The separate
`releaseImageReview` block records the four subsequently added official logo
assets removed for this release. Lecture 2's six images — a course photograph,
an attendance QR code, portraits of Kleene, Backus and Naur, and a screenshot of
the Python grammar — went the same way on 16 September 2026, recorded in the
same shape in `slides/lecture-2.json`. The image elements remain in the
scene marked deleted, so the editor keeps their history, and
`slides/archive/Lecture N.excalidraw.gz` still holds the byte-for-byte original.
The optional local preservation test enforces this route: an original image may
only leave a source through a `removedImages` entry that names it and actually
drops its bytes.

Lecture 3's eight images — a portrait, two screenshots of AI mathematics
results, one unidentified picture and four product logos — went the same way on
16 September 2026, recorded in `slides/lecture-3.json`.

Lecture 4's five images — portraits of Boole, Post, Shannon and De Morgan,
and a scan of Shannon's thesis — went the same way on 19 September 2026,
recorded in `slides/lecture-4.json`.

For the other eight lectures the maintainer asked that imported images stay
visible for now, and **none of them has been marked licence-cleared**.
`slides/image-inventory.json` covers 74 image records across Lectures 3–12,
including unused embedded records. Each record lists slide usages, an `imagePath`
pointing to its exact extracted file under `slides/images/`, source/licence fields
and review status. The canonical image bytes remain embedded in each
`.excalidraw` source's `files` object and its archive. Editing an extracted review
image does not update a slide; replace it in Excalidraw, save the source, and
render again.

Removing an image from a source may leave a review copy under
`slides/images/`. Keep it ignored for preservation; do not stage it for release.

Original workspace image files remain in `tmp/excalidraw_workspace_export/img/`.
Workspace filename matches are candidates only, not evidence of authorship or
permission. Rendering embeds the images in each SVG: ignored staged SVGs for
Lectures 5–12. Lectures 1 to 4 no longer have any. No separate remote image
host is used.

## Before releasing a lecture

Review the inventory, locate original source pages, record creator/source/licence
and any required attribution, or replace images where needed. Preserve original
image bytes only in ignored local sources/archives when replacing them; the
reviewed source committed to Git must not embed them. Do not assume educational
use settles the question. Portraits, film imagery, logos, article/book screenshots,
the AI history montage, and memes all need individual review. Course-staff
photographs and attendance QR codes also need a check for current relevance and
intended distribution.

To regenerate **candidates** from a workspace export:

```sh
node tools/slides/inventory.mjs tmp/excalidraw_workspace_export/img
```

The inventory command refreshes usages and extracted review files across all
manifests. It retains existing review fields for unchanged file IDs and hashes.
Keep review findings in the inventory; do not infer licensing from a match.

## Related

- [Licensing](../project/editorial-direction.md), [Publishing a lecture](publishing.md).
