# Install the local authoring tools

From the repository root, with the project's Node version installed:

```sh
npm run slides:setup
npm run setup:browsers
npm run slides:edit
```

Open `http://127.0.0.1:4174`. The editor binds to the local machine only. Choose
a lecture in the top bar and a slide in the sidebar, then use the normal Excalidraw
drawing, selection, text, image, frame, and undo tools. Use Excalifont for
headings/prose and **Comic Shanns** for mathematical text; in this editor, the
latter uses the same patched Comic Shanns Logic font as the book. Existing drawn
logic symbols remain editable drawings rather than being flattened into screenshots.

## Saving

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
creating a source copy and a manifest. A fresh clone lists only Lecture 1;
manifests for deferred lectures become available in the editor when their ignored
local source files are present.

## Related

- [Slide management](slide-management.md), [The icon library](icon-library.md), [Rendering](rendering.md).
