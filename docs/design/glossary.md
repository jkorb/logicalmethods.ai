# Glossary interaction

Glossary terms use a bold dotted-underlined link, with a shared definition preview
on hover or keyboard focus. The preview stays within the viewport, can itself be
hovered, and closes on Escape. Clicking opens the anchored glossary entry in a
new tab, as announced in the link's accessible name. Native link titles provide
a fallback when JavaScript is unavailable.

The glossary search filters the existing entries and announces the result count.
It is shown only when JavaScript is available; the full glossary is readable
without it. Styles are in `assets/css/glossary.css` and interaction code is in
`assets/js/glossary.js`, both loaded by the shared page shell.

## Related

- [Glossary and notation](../authoring/glossary.md) — the data file and the `term` shortcode.
- [Browser suites](../testing/browser-suites.md) — the persistent-hover test skips mobile.
