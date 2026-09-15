# Rendering

After saving:

```sh
npm run slides:render
hugo -D
```

Refresh the Hugo preview to see the regenerated slides. Rendering is explicit,
not automatic on save. To render just one deck, use
`npm run slides:render -- lecture-2`. To use a different editor port, run
`SLIDES_PORT=4180 npm run slides:edit`. Stop with **Stop editor** in the browser
or Ctrl+C in the terminal. Neither action renders; rendering is always a separate
command. The stop button warns about unsaved changes and waits for active saves.
Restart the server after tool changes, then reload its page. Each server builds
into its own temporary directory, so tests and rendering cannot overwrite the
browser code of an already-running editor.

Dependencies are pinned separately in `tools/slides/package-lock.json`; they do
not enlarge the site or the regular Hugo/CI toolchain. Builds need only the
checked-in SVG exports. Installation needs network access; editing and rendering
do not. The rendering browser uses `tmp/playwright-browsers/` by default, or the
`PLAYWRIGHT_BROWSERS_PATH` override.

The viewer uses labelled icon buttons and a keyboard-accessible gray slide picker.
Its boxed reading view shows the lecture's authored `narration.yaml` where there
is one, and is otherwise labelled as an automatically generated preview: text is
extracted from scene elements, without an AI model, and its spatial reading order
can be confusing. Either view remains available without JavaScript.

## Related

- [The export pipeline](export-pipeline.md) — what the exporter checks and rejects.
