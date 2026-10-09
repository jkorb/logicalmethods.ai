# Browser coverage

`npm test` runs every browser scenario on desktop. Tests tagged `@mobile` also
run at phone width with touch support. These include whole-page accessibility,
keyboard navigation, responsive app layouts, dialogs, canvas controls, and
representative exercise interactions.

Content, algorithm results, persistence, and downloads usually need one browser
run. A test that sets its own viewport already checks that width. Repeating it
in the mobile project often adds the same work twice.

## Adding a check

- Keep algorithm cases and exercise answer sets in unit tests where possible.
- Use browser tests for editing, selection, feedback, navigation, and rendering.
- Add `{ tag: '@mobile' }` to a test when the narrow layout or touch controls
  need separate coverage. Check an actual interaction as well as overflow.
- Audit the component whose state changed. The page accessibility suite checks
  the surrounding page; a menu test need not scan every unrelated app again.
- Compare artwork pixels at meaningful states: initial, selected, and cleared.
  Membership tests cover individual world selections.

## Full matrix

Run every scenario in both viewports, including every SQL exercise answer and
intermediate artwork selection:

```sh
npm run test:browser:full
npm run test:browser:full -- tests/browser/fol-practice.spec.mjs
```

Build first if site source changed. Use the full matrix for changes to shared
input handling, touch behavior, browser fixtures, or a cross-device regression.
The Build and deploy workflow also offers `full` on manual runs. Routine pushes
and pull requests use the standard selection.

CI keeps failure screenshots and records a trace on the first retry. Passing
tests do not record traces. The browser summary lists the five most expensive
suites by total worker time, including retries; parallel work means this is
different from elapsed time.

## Related

- [Browser suites](browser-suites.md) — the assertions each suite owns.
- [Targeted runs](targeted-runs.md) — choosing checks for a change.
