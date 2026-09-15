# Testing

Run the tests before pushing changes:

```sh
npm test
```

This builds the website, checks its content and links, and opens representative
pages in desktop and mobile Chromium. GitHub runs the same tests on pull requests
and pushes to `main`. Deployment waits for them to pass.

## Notes

- [First-time setup](first-time-setup.md) — Hugo, Node, Chromium.
- [While editing](while-editing.md) — `npm run check`, reading a failure, individual commands.
- [Running only what your change affects](targeted-runs.md) — the change-to-suite map.
- [Browser suites](browser-suites.md) — what each spec guards.
- [Spelling and style](prose.md) — Vale setup and the course vocabulary.
- [External links](external-links.md) — the weekly network check.
- [Maintaining the tests](maintaining.md) — fixtures, exceptions, tool versions.
- [GitHub Actions](github-actions.md) — the workflows and their artifacts.
- [Matching CI locally](ci-parity.md) — path case, timeouts, slide tests.
- [Temporary files](temporary-files.md) — what `npm run clean` reclaims.
