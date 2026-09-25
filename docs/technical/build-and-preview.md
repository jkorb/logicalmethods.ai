# Build and preview

The site is built with Hugo and custom templates in `layouts/`. Install the
version in [`.hugo-version`](../../.hugo-version) and Node from
[`.nvmrc`](../../.nvmrc), then run these commands from the repository root:

```sh
npm ci
hugo version
hugo server -D
```

Hugo bundles the app JavaScript using npm dependencies, including `html-to-image`
for PNG exports, and bundles the lecture decks' JavaScript and CSS from the
pinned `reveal.js` package (`js.Build` and `css.Build`). Run `npm ci` in each checkout or worktree before its first build,
and again after `package-lock.json` changes. Installing dependencies in another
worktree does not install them here.

Use the preview URL printed by Hugo (normally `http://localhost:1313/`). Run
`hugo -D` to build the site into `public/`. `-D` includes draft content. A plain
`hugo` build excludes drafts and therefore does not reproduce the current
deployment behavior.

## Related

- [First-time setup](../testing/first-time-setup.md) — Node and Chromium for tests.
- [Slides](../slides/README.md) — `npm run slides:preview` uses a separate config.
