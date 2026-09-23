# Temporary files

`tmp/` holds two unrelated things: output the tooling regenerates, and the
review notes and scratch files [AGENTS.md](../../AGENTS.md) asks you to keep
there. To reclaim the first kind:

```sh
npm run clean              # builds, reports, test output, leftover fixtures
npm run clean:all          # also Chromium, Vale and the other downloads
node scripts/clean.mjs --dry-run
```

The script removes an allowlist, never the whole directory, and reports what it
kept. Every entry names the script, config or test that writes it; check that
the writer still exists before adding one.

`tmp/logs/` holds the full output of each check from the last `npm run check` or
`npm test`, one file per check, written whether it passed or failed. That is
where a one-line summary sends you when you want the detail; see
[Test output](output.md). It is regenerated output, so `npm run clean` reclaims
it.

## Related

- [Test output](output.md) — what the per-check logs contain.
- [Temporary working files](../technical/temporary-files.md).
