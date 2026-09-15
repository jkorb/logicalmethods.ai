# Validation and known caveats

Run `npm test` before pushing. For a quick build check, use `hugo -D`.
Preview the pages you change, including their small-screen layout, formulas,
and interactive controls. Automated tests complement this review; they cannot
judge whether an explanation or a mathematical argument is correct.

`hidden` filters navigation, while `locked` disables links in the list partial.
Neither prevents page generation or direct access. Exercise password hashes and
solutions are delivered to the browser; their purpose is staged disclosure, not
authentication. Drafts are also published by the current CI command. See
[Solutions](../authoring/solutions.md).

The Excalidraw exporter also accepts a directory and `--keep-sources`; shared
exports live in `assets/img/drawings/`. It uses one browser for a batch, serves
Excalidraw font assets locally and blocks external requests. Dependencies can be
installed under `tmp/excalidraw-tools` and resolved using `NODE_PATH`, leaving the
site's package manifest unchanged. Set `PLAYWRIGHT_BROWSERS_PATH` to the matching
local browser cache when needed. The regular Hugo build uses the checked-in SVGs
and patched font; it does not need either authoring toolchain.

Shared page CSS and JavaScript use local, fingerprinted URLs so a Hugo preview
loads its own current assets. Disclosure pickers share `assets/css/pickers.css`,
including the local editor lecture picker; native selects have a matching fallback.
