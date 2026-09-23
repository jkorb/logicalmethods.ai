# Test output

`npm run check` and `npm test` go through [`scripts/verify.mjs`](../../scripts/verify.mjs),
which runs each check, keeps its output, and prints one line per check:

```text
✓ Unit tests             59 tests               1.4s
✓ Hugo build             63 pages in 650 ms     801ms
✓ Content conventions                           121ms
✓ Generated site                                997ms
✓ Documentation vault                           106ms
✓ Markdown               153 files              770ms
✓ Browser suites         324 passed, 2 skipped  1m 32s
────────────────────────────────────────────────────────
All checks passed — 7 checks in 1m 36s
```

A passing run is the common case and costs about ten lines. Nothing is hidden:
every check's full output is written to `tmp/logs/<check>.log` whether it passed
or failed, so the detail is one `cat` away when it is wanted.

## When a check fails

Only the failing check prints, and it prints its own output rather than a
pointer to somewhere else:

```text
✗ Generated site         exit 1                 997ms

  textbook/sat/index.html: duplicate id sat
  Generated site: 1 failure(s)

  full output: tmp/logs/site.log
  re-run only this check: npm run check:site
```

Three things follow from that last line. The named command re-runs that check
alone, so a fix is verified in a second instead of four minutes. Checks that
depend on a failed one are skipped and say so — a failed build marks `Generated
site` and `Browser suites` as skipped rather than reporting them as broken.
Checks that do not depend on it still run, so one run finds everything.

Failure output longer than 60 lines is trimmed to its last 60, with a count of
what was dropped and the path to the whole thing. Long output is nearly always a
transcript with the assertion at the end.

## Seeing more

| Want | Run |
| --- | --- |
| Everything, live, unbuffered | `npm run check -- --verbose` |
| One check, or a few | `npm run check -- --only=site,docs` |
| The browser suites too | `npm test` |
| Desktop viewport only, in half the time | `npm test -- --desktop` |
| What a check printed last time | `cat tmp/logs/<check>.log` |

Check names are `unit`, `build`, `content`, `site`, `docs`, `markdown` and
`browser`. `VERBOSE=1` does the same as `--verbose` for tools that call the
scripts directly.

Every check is still its own command — `npm run check:site`, `npm run test:unit`
and the rest all work on their own and print the same terse result. The runner
adds ordering, dependency skipping and the summary, not new behaviour. The
individual commands are listed in [While editing](while-editing.md).

## Notes for agents

Reading test output costs tokens, and a green run has nothing to say. Prefer
`npm run check` and `npm test` over the individual commands: they return roughly
ten lines instead of a hundred, and on failure they return the assertion and the
re-run command rather than a transcript.

- Do not pass `--verbose` speculatively. Use it only after a summary has proven
  insufficient for a specific failure.
- Do not read `tmp/logs/*.log` when the check passed. It contains exactly what
  the one-line summary already reported.
- Do not read the `error-context.md` files under `tmp/test-results/`. They are
  whole-page accessibility snapshots, up to a hundred kilobytes each, and they
  repeat what the assertion said. This is also covered in
  [While editing](while-editing.md).
- Re-run the named check, not the whole suite, while iterating on one failure.
- Invoke the named npm scripts directly rather than wrapping them in a shell
  pipeline, so command-prefix approvals match. The runner already writes logs to
  `tmp/`, so redirection is not needed to keep output out of the transcript.

## Related

- [While editing](while-editing.md) — the individual checks and reading a failure.
- [Running only what your change affects](targeted-runs.md) — the change-to-suite map.
- [Matching CI locally](ci-parity.md) — why a check that passes here passes there.
- [Temporary files](temporary-files.md) — what `npm run clean` reclaims from `tmp/`.
