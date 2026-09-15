# Running only what your change affects

The browser suite is the slow and noisy part: over 200 tests across two viewports.
Everything after `--` goes to Playwright, so a targeted run is one command:

```sh
npm run test:browser -- tests/browser/icons.spec.mjs --project=desktop
npm run test:browser -- --grep "glossary"
```

Start from the suite that guards what you changed, and run the whole thing
before pushing:

| What you changed | Run |
| --- | --- |
| Chapter or exercise prose | `npm run check` |
| Front matter, IDs, passwords | `npm run check:content` |
| Links, anchors, images | `npm run build:test && npm run check:site` |
| Documentation notes under `docs/` | `npm run check:docs` |
| Styles or page furniture | `a11y`, `keyboard`, `reflow`, `display-math` |
| An interactive app | its own spec, then `a11y` |
| Slide decks or the deck shortcode | `slides`, `privacy` |
| Release state: unlocking a chapter | `release`, `keyboard` |
| The route stub or a shared fixture | the whole browser suite |

The local reporter prints one character per passing test and the full failure
block for each failure; `CI=1` restores the per-test listing, traces and
failure screenshots that GitHub Actions uploads. The test server is reused
between local runs, so leaving one up costs nothing.

## Related

- [Browser suites](browser-suites.md) — what each named suite guards.
- [While editing](while-editing.md) — the individual check commands.
