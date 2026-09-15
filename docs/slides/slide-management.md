# Slide management

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

Lecture order is explicit in manifests until saved editor frame metadata supplies
it; all frames are retained in the imported vertical order.

## Related

- [Install the local authoring tools](authoring-setup.md), [The icon library](icon-library.md).
