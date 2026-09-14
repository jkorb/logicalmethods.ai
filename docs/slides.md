# Self-hosted lecture slides

All 12 lectures are migrated to self-hosted Excalidraw: **214 slide frames**.
Lecture 1 (20 frames) uses the normal website viewer. Lectures 2–12 (194 frames)
are staged locally outside Hugo's published content in ignored `slides/unpublished/`, awaiting
content and image review. Their normal website paths show a short review notice;
no Excalidraw Pro embed remains. `locked` and `draft` are not publication barriers
because CI builds with `-D`.

With the ignored local sources and staged exports present, use
`npm run slides:preview` to review **all twelve** decks at
`http://localhost:1315/slides/`. This uses the explicitly opt-in
`hugo.slides-preview.toml` mount overlay. Staged pages are unlocked in this
local overlay so the slide index links to every lecture. Do not add that overlay to CI or deploy
its build output. Preview output goes to `tmp/slides-preview-site/`, separate
from the normal build. Ordinary `hugo -D` excludes the staged deck files.

| Lecture | Frames | Slide path |
| --- | --- | --- |
| 1 | 20 | `/slides/logic-and-ai/` |
| 2 | 18 | `/slides/formal-languages/` |
| 3 | 19 | `/slides/valid-inference/` |
| 4 | 19 | `/slides/boolean/` |
| 5 | 19 | `/slides/sat/` |
| 6 | 17 | `/slides/conditionals/` |
| 7 | 18 | `/slides/proof/` |
| 8 | 20 | `/slides/FOL/` |
| 9 | 16 | `/slides/FOL-inference/` |
| 10 | 15 | `/slides/many-valued/` |
| 11 | 19 | `/slides/probability/` |
| 12 | 14 | `/slides/anns/` |

## Teach and read

Open a lecture page and select **Full screen**. Use arrow keys, Page Up / Page
Down (including clickers that send those keys), or Space / Shift+Space. Home and
End select the first and last slide. F toggles full screen; Escape leaves it.
The visible buttons and slide selector offer the same navigation. At the first
and last slide, navigation stops rather than wrapping around.

Every slide has a `#slide-N` URL; reloading or opening that link selects the
same slide. Students browse their own copy; this is not live synchronization
with the lecturer. Keyboard navigation acts when the viewer is in view, and
leaves text fields and native control activation alone.

Without JavaScript, all slides appear as a vertical sequence. No editor,
account, CDN, or Excalidraw server is involved in viewing these decks.

A lecture can carry a written description of every slide in `narration.yaml`
beside its `index.md`. Each entry has a `number`, a one-sentence `alt` that
becomes the slide image's accessible name, and a `body` whose blank-line-separated
paragraphs say what the slide shows, drawings and diagrams included. Where that
file exists, the viewer uses it in place of the extracted text and links each
image to its description with `aria-describedby`; Lecture 1 has one. Without it
the expandable text extraction is used instead, which helps search and copy but
is **not** a transcript: its reading order interleaves columns, and hand-drawn
operators and diagram relationships stay graphical. Either way the linked
textbook chapter supplies the full written explanation. Keep a description in
step with the scene whenever you edit the slides.

## Install the local authoring tools

From the repository root, with the project's Node version installed:

```sh
npm run slides:setup
npm run setup:browsers
npm run slides:edit
```

Open `http://127.0.0.1:4174`. The editor binds to the local machine only. Choose
a lecture in the top bar and a slide in the sidebar, then use the normal Excalidraw drawing,
selection, text, image, frame, and undo tools. Use Excalifont for headings/prose
and **Comic Shanns** for mathematical text; in this editor, the latter uses the
same patched Comic Shanns Logic font as the book. Existing drawn logic symbols
remain editable drawings rather than being flattened into screenshots.

**Save source** writes the selected scene in `slides/sources/`. Every save first
copies the previous file to `tmp/slides-backups/lecture-N/`, then replaces the
source atomically. Metadata, unused images, and deleted-element history survive
saves. A source revision check rejects stale saves from another tab or after an
external edit. **Download copy** offers an independent `.excalidraw` backup.
The editor warns before leaving with unsaved changes. These backups are local
and Git-ignored; they are not a substitute for normal project backups.

The local editor's own menu exports are for personal copies. Its **Save source**
button is the authoritative workflow for the course. It deliberately does not
open an unrelated file over a selected lecture; import additional lectures by
creating a source copy and a manifest. A fresh clone lists only Lecture 1; manifests for deferred lectures become
available in the editor when their ignored local source files are present.

### Slide management and icon library

The sidebar adds, removes, renames and reorders slides using Excalidraw's frame
and scene APIs. Select a slide, then use **Move up** / **Move down**. Presentation
order is independent of the frames' physical canvas positions. Order is stored
in each frame's `customData.courseSlideOrder`; the renderer reads it directly.
Old scenes without this metadata still use the migration manifest. Frame names
supply navigation titles; renaming does not replace drawn title text.

**Remove slide** marks its frame and contents deleted; **Save source** retains
these elements and all image data. Native canvas undo/redo also applies to slide
manager operations. **Renumber footers** is explicit: it updates a single numeric
text element in the bottom-right footer area, adds a footer when absent, and
leaves ambiguous cases untouched. Review the result before saving. It numbers
all live slides, including staff/attendance slides. Mathematical numerals outside
that footer area are unchanged. New slides use the first frame's dimensions.

The supplied icon library (219 items at import, 223 now) is copied to
`slides/library.excalidrawlib` and loaded automatically. **Open icon library** opens Excalidraw's library panel.
Use **Import / update icons** to merge another `.excalidrawlib` by item ID
(matching IDs are updated; other existing icons remain). Native library actions
can add or remove items. **Save library** persists the current library separately
from the lecture, with a revision check and backups in
`tmp/slides-backups/library/`. Restart the editor after replacing the library
file externally. To revise an icon, place it on the canvas, edit it, add the
updated selection to the library and remove the obsolete item if desired. Then
click **Save library**; **Save source** alone does not save library changes.

The icon library contains course drawings, including Socrates, for reuse in
slides. Match the course's clean stroke style (`roughness: 0`, the Architect
setting). Lecture 1 uses plain text names for ChatGPT, Claude and DeepSeek;
the official logo files were excluded from this release because redistribution
permission was not established. Original copies are preserved in ignored local
backups. Do not reintroduce those image bytes when saving or rendering.

The viewer uses labelled icon buttons and a keyboard-accessible gray slide picker.
Its boxed reading view shows the lecture's authored `narration.yaml` where there
is one, and is otherwise labelled as an automatically generated preview: text is
extracted from scene elements, without an AI model, and its spatial reading order
can be confusing. Either view remains available without JavaScript.

After saving:

```sh
npm run slides:render
hugo -D
```

Refresh the Hugo preview to see the regenerated slides. Rendering is explicit,
not automatic on save. To render just one deck, use
`npm run slides:render -- lecture-2`. To use a different editor port, run
`SLIDES_PORT=4180 npm run slides:edit`. Stop with **Stop editor** in the browser
or Ctrl+C in the terminal. Neither action renders; rendering is always a separate
command. The stop button warns about unsaved changes and waits for active saves.
Restart the server after tool changes, then reload its page. Each server builds
into its own temporary directory, so tests and rendering cannot overwrite the
browser code of an already-running editor. A library load failure shows an error
and disables library saving while allowing lecture editing to continue.

Dependencies are pinned separately in `tools/slides/package-lock.json`; they do
not enlarge the site or the regular Hugo/CI toolchain. Builds need only the
checked-in SVG exports. Installation needs network access; editing and rendering
do not. The rendering browser uses `tmp/playwright-browsers/` by default, or the
`PLAYWRIGHT_BROWSERS_PATH` override.

## Sources, preservation and generated files

| Location                                 | Purpose                                                                                                        |
| ---                                      | ---                                                                                                            |
| `slides/sources/Lecture N.excalidraw`    | Canonical editable scenes, including their embedded image data.                                                |
| `slides/archive/Lecture N.excalidraw.gz` | Byte-for-byte original imports for all 12 lectures, compressed without timestamp variation.                   |
| `slides/lecture-N.json`                  | Explicit frame order, titles, source, output directory, and original checksum.                                 |
| `slides/initial-adjustments.json`        | Element IDs and before/after values for the initial notation/font/typo adjustments.                            |
| `slides/workspace-inventory.json`        | Frame counts, image counts, original checksums and candidate spatial order for all 12 lectures.                |
| `slides/workspace-files.sha256`          | Checksums for every file in the supplied workspace export, including illustration sources and image originals. |
| `slides/image-inventory.json`            | Embedded image IDs, usage locations, filename candidates, and unresolved rights fields.                        |
| `slides/library.excalidrawlib` | Saved editable icon library, separate from scenes and outside the published site. |
| `slides/images/` | Exact extracted embedded-image bytes for local review; mapped by the image inventory. |
| `slides/unpublished/<topic>/` | Staged Lectures 2–12: page metadata plus rendered decks; mounted only by the local preview overlay. |
| `content/slides/<topic>/narration.yaml` | Authored per-slide description, when a lecture has one. Hand-written; not generated. |
| `content/slides/<topic>/deck/`           | Generated SVGs and `index.json`, consumed by Hugo. Do not hand-edit these.                                     |
| `tools/slides/`                          | Local editor, exporter, validation, image inventory, and tests.                                                |

`slides/` is outside Hugo's content/assets/static roots, but that alone does
not keep files out of Git. `.gitignore` excludes `slides/archive/`,
`slides/images/`, `slides/local-originals/`, every source except the reviewed
Lecture 1 scene, all `slides/unpublished/` files, and every normal-site deck
except Lecture 1. These originals remain on the maintainer's disk and in
backups; a fresh clone does not contain them. Never force-add them. The supplied
`tmp/excalidraw_workspace_export/` remains untouched. Keep that workspace export
backed up separately: all lecture scenes now have archives, but the book
illustration scenes and the workspace image directory are still only in that
original export. Each lecture source embeds all its own image data.

Each export renders one explicit frame through Excalidraw's `exportToSvg`, with
the frame's original dimensions, clipping, background, element order and image
files. Fonts and images are embedded in the SVG, so it renders independently
inside an HTML image. Hugo fingerprints SVG, CSS and JavaScript URLs and uses
relative paths, including in previews. Large decks load their images lazily;
the viewer preloads the next slide.

The exporter rejects missing/duplicate legacy manifest frames, unframed live objects,
missing images, remote image records, active SVG elements and external SVG
resource links. It records the source hash and per-frame counts/hashes. Unit
checks detect lost imported element/image data and stale exports. Export work
is staged in `tmp/`; failed rendering leaves the previous deck intact.

Excalidraw 0.18.1 has no public font-registration interface. The esbuild adapter
in `runtime.mjs` replaces the bundled Comic Shanns descriptor with the course
font and removes its CDN fallback. It does not edit dependency files. Review
this small version-specific adapter when upgrading Excalidraw. Upstream:
[installation and local fonts](https://github.com/excalidraw/excalidraw/blob/master/dev-docs/docs/%40excalidraw/excalidraw/installation.mdx),
[export utilities](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/utils/export).

## Images and publication review

**Lecture 1 is cleared; Lectures 2–12 are not.** Every embedded image in
Lecture 1 was removed on 14 September 2026, because no creator, source or licence
could be established for any of them and the course publishes under CC BY 4.0,
which cannot cover third-party work. Its manifest's `removedImages` block records
their original file IDs and the removal decision. The separate
`releaseImageReview` block records the four subsequently added official logo
assets removed for this release. The image elements remain in the
scene marked deleted, so the editor keeps their history, and
`slides/archive/Lecture 1.excalidraw.gz` still holds the byte-for-byte original.
The optional local preservation test enforces this route: an original image may only leave a source
through a `removedImages` entry that names it and actually drops its bytes.

For the other eleven lectures the maintainer asked that imported images stay
visible for now, and **none of them has been marked licence-cleared**.
`slides/image-inventory.json` now covers 78 image records across Lectures 2–12,
including unused embedded records. Each record lists slide usages, an `imagePath` pointing to its exact
extracted file under `slides/images/`, source/licence fields and review status.
The canonical image bytes remain embedded in each `.excalidraw` source's `files`
object and its archive. Editing an extracted review image does not update a slide;
replace it in Excalidraw, save the source, and render again.

Removing an image from a source may leave a review copy under
`slides/images/`. Keep it ignored for preservation; do not stage it for release.

Original workspace image files remain in `tmp/excalidraw_workspace_export/img/`.
Workspace filename matches are candidates only, not evidence of authorship or
permission. Rendering embeds the images in each SVG: ignored staged SVGs for Lectures 2–12. Lecture 1 no longer has any. No separate remote
image host is used.

Before releasing each deferred lecture, review the inventory, locate original source
pages, record creator/source/licence and any required attribution, or replace
images where needed. Preserve original image bytes only in ignored local sources/archives when
replacing them; the reviewed source committed to Git must not embed them. Do not assume educational use settles the question.
Portraits, film imagery, logos, article/book screenshots, the AI history montage,
and memes all need individual review. Course-staff photographs and attendance
QR codes also need a check for current relevance and intended distribution.

To regenerate **candidates** from a workspace export:

```sh
node tools/slides/inventory.mjs tmp/excalidraw_workspace_export/img
```

The inventory command refreshes usages and extracted review files across all
manifests. It retains existing review fields for unchanged file IDs and hashes.
Keep review findings in the inventory; do not infer licensing from a match.

## Content review and eventual publication

Migration is complete. **Lecture 1 has been revised** against textbook
chapter 1 and now runs to 20 slides, sized for a 90-minute lecture. Its learning
goals open the deck, tagged with the levels of Bloom's revised taxonomy. The
gaps against the chapter are filled: inference indicators and notation, expert
systems, the Diogenes counterexample, search and learning, knowledge
representation, system 1 and system 2, logic-checking and proof assistants. The
deck summarizes rather than reproducing the chapter, so not every topic in it
gets a slide. The course-team and attendance slides are gone, so anyone can
teach from the deck, and every image is removed. Slides are illustrated from
the book's own drawings in `assets/img/drawings/sources/` and from the icon
library; keep using those two sources rather than importing pictures. It also
carries the first `narration.yaml`. Lecture 2 still has a course-team slide with
the same unreviewed staff photographs.

Lectures 3–12 were copied byte-for-byte, without automatic font or notation
replacement. Lecture 2 has local migration adjustments, but remains unreleased. Review them
against the book, including historical staff/attendance information, terminology,
proof examples, screenshots and image rights. Lecture 3 retains two “Todo”
frames; Lecture 7 also has an unfinished note on its proof-systems slide.
Lecture 9 ends with the Lean Game Server screenshot. Blank-looking, closing and
unnumbered frames were kept. Lecture 2 has 18 frames despite its original numbering ending at 16.

Lecture 4's two loose rectangles sit outside every frame. They remain unchanged
in the source and archive, and are explicitly recorded in the manifest's
`nonSlideElements`; they are not silently attached to unrelated slides. New
unframed elements still fail rendering unless explicitly accounted for.

Lecture 7 contains four links to Lean examples. The source retains them; the
viewer presents their destinations below the appropriate slide. Export removes
only SVG anchor wrappers, preserving their visible contents. No linked site is
fetched during rendering or viewing.

Do not replace every font automatically. Independently positioned mathematical
symbols, subscripts, operators and prose may lose alignment. Use Comic Shanns
Logic for revised formulas, and inspect each affected frame. Preserve the
AST/grammar-tree distinction and the book's definitions and grouping conventions.
Lecture order is explicit in manifests until saved editor frame metadata supplies
it; all frames are retained in the imported vertical order.

Chapter mappings differ for Lecture 7 (`proof` slides, `proofs` textbook) and
Lecture 12 (`anns` slides, `learning` textbook). Keep existing paths and IDs.

To publish a reviewed lecture, move its staged page/deck into the corresponding
`content/slides/<topic>/` bundle, replacing the review-notice page. Change its
manifest `output` to that bundle, remove `publication: unpublished`, set
`locked: false`, and update the source/deck allowlists in `.gitignore` only
after checking the scene and every SVG for unreviewed embedded images. Remove
the staged copy so the preview overlay cannot shadow future changes. Adjust the
publication tests, render, and check the normal Hugo build. Publication is a
separate decision; do not deploy the preview overlay as a shortcut.

## Validation

```sh
npm run check
npm run test:browser -- tests/browser/slides.spec.mjs
npm run slides:test
# With the ignored local archives and all twelve sources present:
npm run slides:test:preservation
npm run slides:test:preview
```

`slides:test` needs the optional authoring tools. It runs an actual browser edit
and save against temporary copies of the cleared Lecture 1 scene, checks the backup, preserves
original metadata/images/elements, rejects a stale revision and a foreign-origin
save, and checks that the editor contacts no external host. It binds port 4184;
`SLIDES_DATA_DIR` points its server at the test copies. The real sources are not
modified. Regular `npm test` includes released-source/export integrity, Git exclusion
and viewer checks, without requiring private original archives.

`slides:test:preview` builds the isolated review overlay, checks all 214 frames
for local image loading and navigation, and produces a contact sheet per lecture.
Normal browser tests also verify that Lectures 2–12 expose no deck assets in a
regular build.

Review screenshots belong in `tmp/slides-review/`, never in the source archive.
Original/final contact sheets from the initial migration are there for local
comparison. Those temporary review artifacts are not part of the published site.
