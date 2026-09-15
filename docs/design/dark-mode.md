# Dark mode

Three states, not two. The bare `:root` carries the full light palette;
`@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`
handles the system default; `:root[data-theme="dark"]` handles the explicit toggle.
An inline script in `<head>` applies the stored choice before first paint.
**Never define a color only inside a media or `[data-theme]` block** — it will not
apply in the un-stamped state.

## Related

- [Color](color.md) — the light and dark values for every token.
- [Figures](figures.md) — why drawings keep a light ground in dark mode.
