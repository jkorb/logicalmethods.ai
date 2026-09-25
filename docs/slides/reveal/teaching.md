# Teaching with a deck

Navigation matches the [Excalidraw viewer](../teaching.md): select **Full
screen**, then use the arrow keys, Page Up / Page Down (what a presentation
clicker sends), or Space / Shift+Space. Home and End select the first and last
slide; F toggles full screen and Escape leaves it. The toolbar's buttons and
slide menu do the same. Navigation stops at the ends rather than wrapping.
A slide with fragments reveals them one step at a time before moving on.

Every slide has a `#slide-N` URL, numbered from the title slide. Opening or
reloading one selects that slide. Keys act while the deck is in view and leave
text fields alone.

## Working in an app

While focus is inside an app, its keys are its own: arrows move a gate, Space
toggles an input, letters type. Only Page Up / Page Down change the slide, so a
clicker keeps working while you demonstrate. Click the slide outside the app, or
use the toolbar, to get the arrow keys back. Swipes that start on an app do not
change the slide.

An app on a slide shows only what a walk-through needs; its help texts, text
alternative, export and animation switch are in the chapter. An app is fitted to
the slide as it grows, so stepping through a long resolution may shrink it a
little, down to 60%; past that the slide scrolls. It does not grow back until
you return to the slide.

## Reading the slides as text

In the deck only the current slide can be read, by eye or by screen reader. The
Excalidraw decks had a hand-written `narration.yaml` for this, since their slides
were pictures. A Reveal.js slide is already text, so the page builds the same
reading view from the slides themselves: **What is on the slides**, below the
deck, lists every slide in order, with each drawing replaced by its `alt` and
each app by its `title`, and each entry linking back to its slide. Without
JavaScript the slides are shown in sequence instead.

## Known limits

- **On the page the deck is a preview.** It keeps the old viewer's width, so the
  canvas is scaled down, and an app's buttons can be smaller than the 24px WCAG
  minimum. Full screen has no such problem; the chapter has every app at full size.
- **Apps follow the browser's width, not the canvas's.** On a phone an app takes
  its narrow layout; fitting zooms it to the slide, so it may be small there.
- **No speaker view or notes.** Reveal.js's speaker view would load the whole
  page into its preview frames.
- **Printing is untested.** Reveal.js's print styles are bundled but have not
  been checked with this theme.

## Related

- [Writing a deck](authoring.md), [The Excalidraw theme](theme.md).
