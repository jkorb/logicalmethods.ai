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

## Related

- [Temporary working files](../technical/temporary-files.md).
