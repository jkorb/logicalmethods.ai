# Exporting from Excalidraw

Place SVG exports from Excalidraw in `assets/img/drawings/`. Keep their editable
`.excalidraw` sources in `assets/img/drawings/sources/`.

The renderer accepts ordinary Excalidraw exports: it removes fixed root
sizes, supplies accessible metadata, and strips the embedded `style-fonts`
block from the published inline SVG so it uses the site's fonts. Child
geometry and the viewBox remain intact. Disable embedded fonts in the export
when possible to keep the source SVG small too. Excalifont is supplied by the
site; an SVG opened on its own needs that font installed for identical labels.

Alternatively, use the optional authoring exporter:

```sh
node scripts/excalidraw-svg.mjs path/to/scene.excalidraw assets/img/drawings --keep-sources
node scripts/excalidraw-svg.mjs path/to/scenes assets/img/drawings --keep-sources
```

Add `--frames` to export named frames separately. The script accepts
`.excalidraw` and `.excaldraw`, normalizes the suffix and gimmick spelling,
removes embedded fonts and root dimensions, and rounds geometry coordinates.
It needs Excalidraw, React, React DOM, esbuild and Playwright; see
[Authoring tools](../technical/authoring-tools.md). Hugo only needs the saved
SVGs. Review exports before replacing existing figures.

## Related

- [Validation and known caveats](../technical/caveats.md) — installing its dependencies under `tmp/`.
