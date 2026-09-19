# Sources, preservation and generated files

| Location                                 | Purpose                                                                                                        |
| ---                                      | ---                                                                                                            |
| `slides/sources/Lecture N.excalidraw`    | Canonical editable scenes, including their embedded image data.                                                |
| `slides/archive/Lecture N.excalidraw.gz` | Byte-for-byte original imports for all 12 lectures, compressed without timestamp variation.                    |
| `slides/lecture-N.json`                  | Explicit frame order, titles, source, output directory, and original checksum.                                 |
| `slides/initial-adjustments.json`        | Element IDs and before/after values for the initial notation/font/typo adjustments.                            |
| `slides/workspace-inventory.json`        | Frame counts, image counts, original checksums and candidate spatial order for all 12 lectures.                |
| `slides/workspace-files.sha256`          | Checksums for every file in the supplied workspace export, including illustration sources and image originals. |
| `slides/image-inventory.json`            | Embedded image IDs, usage locations, filename candidates, and unresolved rights fields.                        |
| `slides/library.excalidrawlib`           | Saved editable icon library, separate from scenes and outside the published site.                              |
| `slides/images/`                         | Exact extracted embedded-image bytes for local review; mapped by the image inventory.                          |
| `slides/unpublished/<topic>/`            | Staged Lectures 5–12: page metadata, any narration, plus rendered decks; mounted only by the local preview overlay. |
| `content/slides/<topic>/narration.yaml`  | Authored per-slide description, when a lecture has one. Hand-written; not generated. Lives beside the staged page until the lecture is published. |
| `content/slides/<topic>/deck/`           | Generated SVGs and `index.json`, consumed by Hugo. Do not hand-edit these.                                     |
| `tools/slides/`                          | Local editor, exporter, validation, image inventory, and tests.                                                |

`slides/` is outside Hugo's content/assets/static roots, but that alone does
not keep files out of Git. `.gitignore` excludes `slides/archive/`,
`slides/images/`, `slides/local-originals/`, every source except the reviewed
Lecture 1 to 4 scenes, all `slides/unpublished/` files, and every
normal-site deck except Lectures 1 to 4. These originals remain on the maintainer's disk
and in backups; a fresh clone does not contain them. Never force-add them. The supplied
`tmp/excalidraw_workspace_export/` remains untouched. Keep that workspace export
backed up separately: all lecture scenes now have archives, but the book
illustration scenes and the workspace image directory are still only in that
original export. Each lecture source embeds all its own image data.
