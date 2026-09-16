# Running only what your change affects

The browser suite is the slow and noisy part: over 200 tests across two viewports.
Everything after `--` goes to Playwright, so a targeted run is one command:

```sh
npm run test:browser -- tests/browser/icons.spec.mjs --project=desktop
npm run test:browser -- --grep "glossary"
```

Use the last build if the site source is unchanged; otherwise run
`npm run build:test` before browser tests. `npm run check` already includes that
build. Start from the suite that guards what you changed, and run the whole thing
before pushing:

| What you changed | Run |
| --- | --- |
| Chapter or exercise prose | `npm run check` |
| Front matter, IDs, passwords | `npm run check:content` |
| Links, anchors, images | `npm run build:test && npm run check:site` |
| Documentation notes under `docs/` | `npm run check:docs` |
| Styles or page furniture | `a11y`, `keyboard`, `reflow`, `display-math` |
| An interactive app | its own spec, then `a11y` |
| Slide deck content or narration | Target lecture checks in [Slide validation](../slides/validation.md) |
| Slide viewer, deck shortcode or publication state | `slides`, `privacy` |
| Release state: unlocking a chapter | `release`, `keyboard` |
| The route stub or a shared fixture | the whole browser suite |

The local reporter prints one character per passing test and the full failure
block for each failure; `CI=1` restores the per-test listing, traces and
failure screenshots that GitHub Actions uploads. The test server is reused
between local runs, so leaving one up costs nothing.

Prose-only edits need browser or screenshot review only for a concrete rendering
concern. After required checks pass, stop unless further edits, a failure, or a
named unresolved concern justify another run.

For Codex command approvals, invoke named npm scripts directly. Shell wrappers,
environment assignments and log redirection can prevent a saved prefix approval
from matching; changing an approved wrapper's log filename can prompt again.
Keep verbose output in `tmp/` through the calling tool when supported. See
[Codex rules](https://learn.chatgpt.com/docs/agent-configuration/rules).

## Related

- [Browser suites](browser-suites.md) — what each named suite guards.
- [While editing](while-editing.md) — the individual check commands.
