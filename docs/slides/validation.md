# Validation

```sh
npm run check
npm run test:browser -- tests/browser/slides.spec.mjs
npm run slides:test
# With the ignored local archives and all twelve sources present:
npm run slides:test:preservation
npm run slides:test:preview
```

`slides:test` needs the optional authoring tools. It runs an actual browser edit
and save against temporary copies of the cleared Lecture 1 scene, checks the
backup, preserves original metadata/images/elements, rejects a stale revision and
a foreign-origin save, and checks that the editor contacts no external host. It
binds port 4184; `SLIDES_DATA_DIR` points its server at the test copies. The real
sources are not modified. Regular `npm test` includes released-source/export
integrity, Git exclusion and viewer checks, without requiring private original
archives.

`slides:test:preview` builds the isolated review overlay, checks all 214 frames
for local image loading and navigation, and produces a contact sheet per lecture.
Normal browser tests also verify that Lectures 2–12 expose no deck assets in a
regular build.

Review screenshots belong in `tmp/slides-review/`, never in the source archive.
Original/final contact sheets from the initial migration are there for local
comparison. Those temporary review artifacts are not part of the published site.

## Related

- [Browser suites](../testing/browser-suites.md) — what `slides.spec.mjs` covers.
