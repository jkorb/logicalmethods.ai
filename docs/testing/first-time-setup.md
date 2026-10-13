# First-time setup

Install the Hugo version listed in [`.hugo-version`](../../.hugo-version) from
[Hugo releases](https://github.com/gohugoio/hugo/releases). Use the extended
edition to match GitHub Actions. The Node version is listed in
[`.nvmrc`](../../.nvmrc); with nvm installed, run `nvm install` to select it.

The build checks the exact Hugo release number, accepting both official builds
with a commit hash and packaged builds such as Homebrew's. On macOS, if Homebrew
has upgraded the default executable, the test build also looks for the pinned
release in its Cellar and verifies that executable's version. This does not
change the system-wide Hugo selection or download a missing release.

Then, from the repository root:

```sh
npm ci
npm run setup:browsers
npm test
```

On Linux, use `npm run setup:browsers -- --with-deps` to install Chromium's
system dependencies too. Browser downloads are kept in `tmp/playwright-browsers/`.
Hugo alone is enough to preview the site; Node and Chromium are needed for tests.

## Related

- [Build and preview](../technical/build-and-preview.md) — the Hugo preview server.
- [Spelling and style](prose.md) — installing Vale separately.
