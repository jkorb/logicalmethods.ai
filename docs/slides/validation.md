# Validation

Select checks by the change; this is not a checklist to run after every edit.
Batch edits and follow [Efficient slide work](agent-workflow.md) for visual review.

| Change | Validation after the batch |
| --- | --- |
| Released deck content or narration | `npm run check`, then the target lecture's tests in `slides.spec.mjs`. |
| Staged deck content or narration | Target lecture's preview test; normal-site checks do not inspect staged content. |
| Scene preservation or image removal | Target lecture's preservation test, when its local archive is available. |
| Editor or save code | `npm run slides:test`. |
| Shared exporter/model code | Relevant unit tests, regenerate affected decks, then their viewer/preview and preservation checks. |
| Viewer, shortcode or shared slide styles | Build, then full `slides` and `privacy` browser specs. |
| Publication state | `npm run check` and full `slides` and `privacy` browser specs; follow [Publishing](publishing.md). |

For example, after building a released deck, or with a staged deck and its local
archive present:

```sh
npm run test:browser -- tests/browser/slides.spec.mjs --grep 'logic-and-ai:'
npm run slides:test:preview -- --grep 'Lecture 6:'
node --test --test-name-pattern '^Lecture 6 ' tools/slides/preservation.test.mjs
```

These are separate examples, not three checks for every lecture. Update affected
test expectations when intentionally changing counts, order or described content.
Run the full `npm test` before pushing; do not rerun `check` separately then.

## Related

- [Slide test coverage](test-coverage.md) — editor, preview and preservation details.
- [Browser suites](../testing/browser-suites.md) — what `slides.spec.mjs` covers.
