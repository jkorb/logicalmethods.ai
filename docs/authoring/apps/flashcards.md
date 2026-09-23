# The flashcards app

`{{< logic-app name="flashcards" >}}`, used once, on
[the study section's flashcards page](../../../content/study/flashcards/index.md).
It takes no parameters: the deck is chosen by the reader, not the author.

## Where the cards come from

The fronts are the glossary. The partial inlines `data/glossary.json` as
`term`, `definition` and `chapter` per entry (about 30&nbsp;KB, on one page),
plus a chapter list built from the textbook pages, so the picker can show
"4. Boolean algebra" and the card can name its chapter. Cards therefore follow
the glossary: a corrected definition reaches the decks with the next build, and
no separate card file has to be kept in step.

Two decks share those fronts. **The book's definition** puts the glossary
wording on the back. **A definition I write myself** leaves the back blank until
the reader writes it, which is the deck the page recommends. Readers can also
add fronts of their own.

## Screens

The app is one framed panel showing a single screen at a time — `menu`,
`settings`, `study`, `boxes` — because the full set of controls at once ran
longer than the page. `show(name)` toggles `[data-screen]` panels, changes the bar title
and reveals the back button; the deck line in the bar is the only state
visible from every screen. Keep new controls inside a screen rather than adding
a fifth column to the panel.

Chapters that are `locked: true` in the textbook are rendered disabled, and the
mount deliberately re-disables anything carrying `data-locked` after enabling
the rest. **All unlocked chapters** is a separate checkbox, never a select-all
that would tick the locked ones. The card boxes on the `boxes` screen are three
instances of the book's `gimmick_box` drawing, one hue-rotate apart.

The frame itself is the full-screen element, toggled by its button or by **F**,
following `assets/js/slides.js`: the key handler ignores modifiers, anything
typed inside a field — a definition with an `f` in it must not throw the reader
into full screen — and the app being off screen.

The optional time per card lives in the settings as one of `TIMES`. When it runs
out the app checks the answer as it stands, which is why `checkAnswer` takes
`{ timedOut }`: an empty answer is refused when the reader submits it and
accepted when the clock does.

## Rules that live in the logic module

`assets/js/logic/flashcards.js` holds everything testable: answer
normalization, the four Leitner boxes and their draw weights, `move` (one box up
on a match, back to the first on a miss), the weighted `draw` that avoids an
immediate repeat, and `readState`, which validates an uploaded file and throws a
message meant for a student rather than a developer. The app layer owns
rendering, `localStorage` and the download.

Answers are compared after stripping case, accents, punctuation and repeated
spaces. **This is a hint, not a mark**, and the app says so beside every
verdict: the reader files the card, so a differently worded but correct answer
is theirs to accept. Keep that framing in any copy you add — there is no
grading, no review and no server.

## State and the saved file

State lives in `localStorage` under `lm-flashcards-v1` and nowhere else.
`Save to a file` downloads `logic-flashcards-<date>.json`, holding the
chosen chapters, the deck mode, and each card's own definition, box and removal.
`Load a file` restores it. Book cards are stored by glossary key and
rejoined with the current definitions on load, so progress survives an edit to
the glossary.

The page must keep telling readers to save the file; browser storage is cleared
by ordinary housekeeping, and there is no other copy.

## Related

- [The study section](../study-section.md) — the section this app belongs to.
- [Glossary and notation](../glossary.md) — the data the fronts come from.
