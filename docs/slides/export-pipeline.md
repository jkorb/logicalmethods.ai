# The export pipeline

> **Deprecated.** This note covers the Excalidraw deck format, which Lectures 1
> to 4 keep for the current course run and every other deck keeps until it is
> migrated. New and migrated decks use [Reveal.js](reveal/README.md).

Each export renders one explicit frame through Excalidraw's `exportToSvg`, with
the frame's original dimensions, clipping, background, element order and image
files. Fonts and images are embedded in the SVG, so it renders independently
inside an HTML image. Hugo fingerprints SVG, CSS and JavaScript URLs and uses
relative paths, including in previews. Large decks load their images lazily;
the viewer preloads the next slide.

The exporter rejects missing/duplicate legacy manifest frames, unframed live objects,
missing images, remote image records, active SVG elements and external SVG
resource links. It records the source hash and per-frame counts/hashes. Unit
checks detect lost imported element/image data and stale exports. Export work
is staged in `tmp/`; failed rendering leaves the previous deck intact.

## The font adapter

Excalidraw 0.18.1 has no public font-registration interface. The esbuild adapter
in `runtime.mjs` replaces the bundled Comic Shanns descriptor with the course
font and removes its CDN fallback. It does not edit dependency files. Review
this small version-specific adapter when upgrading Excalidraw. Upstream:
[installation and local fonts](https://github.com/excalidraw/excalidraw/blob/master/dev-docs/docs/%40excalidraw/excalidraw/installation.mdx),
[export utilities](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/utils/export).

## Related

- [Rendering](rendering.md), [Validation](validation.md).
