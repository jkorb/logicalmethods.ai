# First-time setup

Install the Hugo version listed in [`.hugo-version`](../../.hugo-version) from
[Hugo releases](https://github.com/gohugoio/hugo/releases). Use the extended
edition to match GitHub Actions. The Node version is listed in
[`.nvmrc`](../../.nvmrc); with nvm installed, run `nvm install` to select it.

The npm setup commands below install Node dependencies and Chromium. They do
not install Hugo. A newer Hugo release, including Homebrew's current version,
does not satisfy the version pin.

To keep the required Hugo alongside a different system version, copy the
downloaded extended executable into this worktree (macOS/Linux):

```sh
hugo_dir="tmp/bin/hugo/$(cat .hugo-version)"
mkdir -p "$hugo_dir"
cp /path/to/extracted/hugo "$hugo_dir/hugo"
chmod +x "$hugo_dir/hugo"
```

On Windows, put `hugo.exe` in the corresponding version directory.
The test build checks PATH, this local copy, then retained Homebrew releases
on macOS. Every candidate must match `.hugo-version`. No PATH changes are
needed for `npm test` or `npm run build:test`. Repeat the local installation
in each worktree. `npm ci` and `npm run clean` preserve it; `npm run clean:all`
removes it along with the other downloaded tools.

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
