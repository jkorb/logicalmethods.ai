# Focus, motion and contrast

- Focus uses a **blue outline** (`--blue-ink`) in both themes, without a yellow halo.
- `prefers-reduced-motion` disables transitions, collapse animations and smooth
  scrolling.
- `prefers-contrast: more` drops the grid to plain paper.
- `forced-colors: active` flattens hand-drawn borders to `CanvasText`.

## Focus rings in detail

All keyboard targets use a blue outline (`--blue-ink`), including links,
buttons, summaries, checkboxes, radios, and text fields. The token adapts to the
active theme. Text fields use a tighter offset. Bootstrap button shadows are
suppressed so they cannot introduce a different focus colour. Forced-colour
mode retains the system Highlight outline. `tests/browser/keyboard.spec.mjs`
checks blue focus and visible tab stops.

## Related

- [Browser suites](../testing/browser-suites.md) — what the keyboard suite guards.
