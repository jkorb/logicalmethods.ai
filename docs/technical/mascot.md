# Regenerating the mascot

The mascot poses in `assets/img/mascot/` are exported from the Excalidraw scene
that also produced the original title PNGs. To change or add one:

1. Open the scene (`scratch.excalidraw` in the course Excalidraw library) and
   select the group you want.
2. Export it to SVG with `@excalidraw/excalidraw`'s `exportToSvg`. It needs a DOM,
   so bundle a small entry with esbuild and drive it from a headless browser.
3. Post-process the result before committing it:
   - drop the embedded `@font-face` block — the site already serves Excalifont;
   - map Excalidraw's palette onto tokens: `#1e1e1e` and `#000000` become
     `currentColor`, the rest become `var(--mascot-*, <original>)`;
   - remove the fixed `width`/`height` and keep the `viewBox`;
   - add `class="mascot" role="img" aria-hidden="true" focusable="false"`;
   - round coordinates to one decimal (roughly 20% smaller, no visible change).

Keep the strokes on `currentColor`. A black-stroked asset is invisible in dark
mode, which is why the original PNGs could not be used.

All twelve lectures now use a separate frame exporter and local viewer;
Lectures 2–12 remain outside normal builds and Git until reviewed. Their editable
scenes, image inventories and local Excalidraw editor are described in
[Slides](../slides/README.md).

## Related

- [The mascot](../design/mascot.md) — which pose is used where, and the partial.
