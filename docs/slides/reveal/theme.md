# The Excalidraw theme

`assets/css/slides-reveal.css` makes a Reveal.js deck look like a flip chart
standing on a page of the course: plain sheets, hand-lettered titles underlined
with the site's squiggle, the chapter's faces, and the course's own drawings. Every colour and face comes from
[tokens.css](../../design/README.md), so the deck follows the reader's light or
dark theme and an app on a slide is styled exactly as in its chapter.

## Canvas

Reveal.js lays each slide out on a **960 × 540** canvas and scales it to fit the
stage, which is the old viewer's width on the page and the whole screen in full
screen. Sizes inside a slide are therefore canvas pixels.

The page around the deck is squared paper, so a slide is not: it is a plain
sheet (`--paper-raised`), with a dotted perforation below its top edge, where a
flip-chart sheet tears off, and the edges of two more sheets showing under it.
The deck reads as a pad standing on the page rather than more of the page.
Keep patterns off the sheet: a grid or dots on it clash with the page's squares.

## Type

| Element | Face | Size on the canvas |
| --- | --- | --- |
| Slide title (`##`) | Excalifont, blue squiggle under it | 40px |
| `###`, `####` | Excalifont | 30px, 24px |
| Body, lists, callouts | Atkinson Hyperlegible | 22px |
| Notation (`$…$`, `.Boolean`) | Comic Shanns Logic | as in the chapter |
| Code | JetBrains Mono | 16px |
| Book drawings (`img`) | as in the chapter | at most 320px tall |
| Apps, set figures, tree guides | the chapter's own sizes | `--step-0`, scaled with the canvas |

## Layouts

| `layout` | Looks like |
| --- | --- |
| none | Title at the top left; content below. |
| `title` | Kicker, a 64px title and metadata beside the mascot at the board. The generated title slide. |
| `section` | A 56px title alone, centred vertically: a divider. |
| `center` | Ordinary content, centred vertically. |
| `split` | Two or more equal columns under a full-width title. |
| `app` | A smaller title and margins, to leave the app the room. |

## Fitting

`slides-reveal.js` fits each slide to the canvas when it is shown, when the
window changes size, when fonts arrive, and when an app grows as you step
through it. On a slide with an app it zooms only the apps, from 40% to 150%, so
the text keeps the deck's size and the app fills the room; on other slides it
zooms what follows the title, down only. It tries two ways and keeps whichever
allows the larger zoom: *reflow* keeps the full width and lets text and tables
re-lay out; *shrink* also narrows and centres the content, for a drawing whose
height follows its width. Zoom alone widens an element's layout, so such a
drawing would not shrink under reflow. If zooming the apps cannot make a slide
fit, because its text is what overflows, everything after the title is zoomed
instead.

When an app grows as you step through it, only the app is shrunk to fit
again, and not below 60% (or the zoom it was shown at, if lower): past that
the slide scrolls, which reads better than text too small to see. It is not
grown back until the slide is shown again.

A slide scrolls only once an app's content unfolds past the canvas. Zoom
rounds sizes to whole pixels, so a region inside an app can end up a pixel or
two short of its content; such a region is clipped until its content really
grows, and draws no scrollbar. A scrollbar that does appear is thin and in the
sheet's colours: the deck sets its own `color-scheme` and `scrollbar-color`,
where the browser would otherwise draw one for the system theme, black on a
light sheet.

Display mathematics fits formulas to their column (`display-math.js`); it
measures them in the canvas's own pixels, so the canvas's scaling, in full
screen above all, does not shrink them.

## Apps on a slide

An app on a slide is centred, and keeps what a lecture walks through: its
input, examples, steps, results and status. It drops what serves a reader
working alone: input help, example descriptions, table captions, the text
alternative, the PNG export and the animation switch. The chapter keeps them
all. A relay circuit's side panel holds only its status there, so it goes under
the drawing, which is capped at 300px tall like a book drawing and centred.

## Collisions it guards against

- Reveal.js puts its transition's name on the deck as a class, and Bootstrap's
  `.fade` hides it. The deck therefore uses no transition, as the Excalidraw
  viewer did. Do not set one.
- Bootstrap also styles `.progress`; the theme resets it for Reveal.js's bar.
- The Excalidraw viewer's `slides.css` sizes every `svg` in `.slide-deck` to
  22px. The Reveal.js deck uses its own `reveal-deck` names and never loads it.
- Reveal.js treats every `<section>` under `.slides` as a slide, and would make
  an app's `<section>` inert or hide it. The deck partial turns those Hugo
  renders into `<div>`s, keeping `role="region"` where the section had a name.
  It cannot see elements an app's script creates, so apps build their regions
  as `<div role="region">`; `tests/unit/app-sections.test.mjs` checks this.

## Without JavaScript

The slides stay a sequence of bordered cards in reading order, with fragments
shown, and the toolbar and text view are hidden.

## Changing the theme

Keep selectors under `.deck-canvas.reveal` so they reach only initialized decks,
and use tokens, never raw colours. After a change, run the checks in
[Testing the framework](testing.md) and look at the fixture deck in both themes.
