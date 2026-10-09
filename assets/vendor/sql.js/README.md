# sql.js 1.14.2

Unmodified production artifacts from the npm tarball:
https://registry.npmjs.org/sql.js/-/sql.js-1.14.2.tgz

Upstream: https://github.com/sql-js/sql.js/tree/v1.14.2
License: MIT, with bundled notices in LICENSE and the upstream AUTHORS list.
The app’s “Powered by sql.js” link publishes both notices together.

SHA-256:

- sql-wasm.js: `f1c84000dbc856c9d87f4f3aabc4d3654bd436165db4be3da13751db3a9c20d7`
- sql-wasm.wasm: `38c14f6e379210bc942bdc4ebca44e7bfdb4318ecc1c72ca666a28fdce96670a`

Keep the JavaScript loader and WASM binary from the same release. Hugo publishes
fingerprinted URLs through `layouts/partials/apps/sql-runtime.html`; the runtime
fetches them only when a student runs SQL. No CDN is used.
