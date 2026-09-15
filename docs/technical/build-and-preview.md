# Build and preview

The site is built with Hugo and custom templates in `layouts/`. Install the
version in [`.hugo-version`](../../.hugo-version), then run these commands from
the repository root:

```sh
hugo version
hugo server -D
```

Use the preview URL printed by Hugo (normally `http://localhost:1313/`). Run
`hugo -D` to build the site into `public/`. `-D` includes draft content. A plain
`hugo` build excludes drafts and therefore does not reproduce the current
deployment behavior.

## Related

- [First-time setup](../testing/first-time-setup.md) — Node and Chromium for tests.
- [Slides](../slides/README.md) — `npm run slides:preview` uses a separate config.
