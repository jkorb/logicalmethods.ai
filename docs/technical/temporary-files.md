# Temporary working files

Keep screenshots, test reports, and scratch files in `tmp/`. Git ignores this
directory, and Hugo does not publish it. Use [`docs/`](../README.md) for
contributor documentation that belongs in the repository.

`tmp/` holds two unrelated things: output the tooling regenerates, and review
notes and scratch files. [Temporary files](../testing/temporary-files.md)
describes `npm run clean`, which reclaims the first kind and leaves the second
alone.
