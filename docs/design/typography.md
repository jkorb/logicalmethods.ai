# Typography

Every face is self-hosted and openly licensed — Merriweather too, which the
Dutch pages fetched from Google Fonts until September 2026 and now comes from
`assets/fonts/Merriweather/`. **Opening a page contacts nobody but this
domain**: no font CDN, no analytics, and the slide decks stay a button until
the reader presses it. Keep it that way. It is a stated project principle, the
About page and the footer claim it, and
[`tests/browser/privacy.spec.mjs`](../../tests/browser/privacy.spec.mjs) fails the
build if a page reaches off-site on load.

 | Role                                   | Face                  | License                         |
 | ---                                    | ---                   | ---                             |
 | Prose                                  | Atkinson Hyperlegible | SIL OFL 1.1 (Braille Institute) |
 | Headings, highlights, the mark         | Excalifont            | SIL OFL 1.1 (Excalidraw)        |
 | Mathematics, formal notation, metadata | Comic Shanns Logic    | MIT                             |
 | Source code                            | JetBrains Mono        | SIL OFL 1.1                     |

Atkinson Hyperlegible was drawn for low vision and separates characters that
matter in a logic course — `I`/`l`/`1`, `O`/`0`. Licenses live beside the fonts in
`assets/fonts/`.

Sizes come from the `--step--2` … `--step-4` scale, never from a raw `rem`. **Never
pick a heading level for its size** — level carries document structure, the scale
carries size. Body text runs at `--measure` (65ch); the old layout ran at ~118
characters per line.

## Related

- [Notation](notation.md) — which face each kind of content gets.
- [The notation font](notation-font.md) — why the logic glyphs are in the font.
