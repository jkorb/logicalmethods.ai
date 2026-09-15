# Code blocks

A fenced block is wrapped by `layouts/_default/_markup/render-codeblock.html`
in a `.code-block` shell that exists only to hold the language badge: Chroma
supplies the `.highlight` box itself (see `wrapperClass` in `hugo.toml`), so the
shell must not carry that class too. Nesting them gave a double border, a stray
margin, a badge the inner box painted over, and `font-size: .92em` applied
twice. The shell does not scroll, so the badge stays put while long lines move
under it, and it carries the block's own ground so they are masked cleanly.
Vertical room for the badge is made on the scroller, the one box both Chroma
shapes share. `tests/browser/site.spec.mjs` fails if a block scrolls sideways
at a desktop width or if the badge covers the first line.

Chroma has no usable Lean lexer — it marks tactics as plain names — so
`layouts/_default/_markup/render-codeblock.html` applies a keyword pass for Lean
and tags every block with its language. Authors no longer need to place a
language logo beside a code block; if you find one in the content, delete it.

## Related

- [The notation font](notation-font.md) — why code is not in the hand.
