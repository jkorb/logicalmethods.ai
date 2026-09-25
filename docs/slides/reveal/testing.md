# Testing the framework

No released deck used the Reveal.js format when it was added, so the framework
is tested against a sample deck, `tests/fixtures/reveal-deck/index.md`. It
exercises every layout, columns, fragments, a callout, a glossary term, an
inference, a book drawing, code, a syntax tree, and the SAT resolution and
circuit apps.

`npm run build:test` builds it into a second site: `hugo.reveal-fixture.toml`
mounts it at `/slides/reveal-fixture/`, and the output goes to
`tmp/fixture-site/`. That site is never deployed; CI uploads `tmp/site/` only.
Playwright serves it at `http://127.0.0.1:4174` (`npm run serve:test -- --fixture`).

## The checks

| File | Guards |
| --- | --- |
| `tests/unit/reveal-deck.test.mjs` | The cut: numbering, attributes, columns, the title slide's mascot, sections turned into `div`s, apps' HTML left intact, and every build error in [Writing a deck](authoring.md). |
| `tests/browser/slides-reveal.spec.mjs` | On the fixture: rendering, apps mounted, keys, clicker, menu and URLs, fragments, app key handling, fitting every slide, app chrome hidden, mascot and goals, the text view, axe in both themes and in full screen, a 320px page, no JavaScript. |
| the same spec, per real deck | Every page with `layout: reveal_slides` loads without errors or offsite requests, mounts its apps, carries a text entry per slide, fits each slide in its canvas, and shows no scrollbar before anything unfolds, on desktop and phone. |

The suites run in Chromium only. Zoom and text layout differ slightly in
WebKit (Safari), which is where phantom scrollbars and an overflowing text
column first showed; after a change to fitting, run this spec once in WebKit
too, with a Playwright config whose project sets `browserName: 'webkit'`.

## What to run

| You changed | Run |
| --- | --- |
| A deck's content | `npm run check`, then `npm run test:browser -- tests/browser/slides-reveal.spec.mjs` |
| The deck partial or the shortcodes | `npm run test:unit`, then the spec |
| The theme or `slides-reveal.js` | `npm run build:test`, the spec, then `a11y` and `keyboard` |
| The fixture deck | the spec; keep slide numbers the spec names in step |

Set `REVIEW_SCREENSHOTS=1` to save the spec's screenshots of the deck in both
themes and in full screen under `tmp/test-results/`.

## Related

- [Targeted runs](../../testing/targeted-runs.md), [Browser suites](../../testing/browser-suites.md).
