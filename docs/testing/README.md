# Testing

Run the tests before pushing changes:

```sh
npm test
```

This builds the website, checks its content and links, and opens representative
pages in desktop and mobile Chromium. GitHub runs the same tests on pull requests
and pushes to `main`. Deployment waits for them to pass.

A passing run prints one line per check and about ten lines in total; a failing
run prints the failure and the command that re-runs just that check. The full
output of every check is kept in `tmp/logs/`. See [Test output](output.md).

## Notes

- [First-time setup](first-time-setup.md) — Hugo, Node, Chromium.
- [Test output](output.md) — what a run prints, `--verbose`, `--only`, notes for agents.
- [While editing](while-editing.md) — `npm run check`, reading a failure, individual commands.
- [Running only what your change affects](targeted-runs.md) — the change-to-suite map.
- [Browser suites](browser-suites.md) — what each spec guards.
- [Spelling and style](prose.md) — Vale setup and the course vocabulary.
- [External links](external-links.md) — the weekly network check.
- [Maintaining the tests](maintaining.md) — fixtures, exceptions, tool versions.
- [GitHub Actions](github-actions.md) — the workflows and their artifacts.
- [Matching CI locally](ci-parity.md) — timing budgets, never waiting for a duration, retries.
- [Temporary files](temporary-files.md) — what `npm run clean` reclaims.
