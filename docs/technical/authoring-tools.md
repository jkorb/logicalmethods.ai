# Authoring tools

The figure/font scripts are optional authoring tools. The slide editor and
renderer have separately pinned dependencies under `tools/slides/`; see
[Slides](../slides/README.md). A regular Hugo build needs none of these
authoring tools.

| Script | Does | Needs |
| --- | --- | --- |
| `scripts/build-notation-font.py` | Rebuilds Comic Shanns Logic from `assets/img/sym/*.svg` | `pip install fonttools brotli` |
| `scripts/excalidraw-svg.mjs` | Exports figures from `.excalidraw` sources | `npm i --no-save @excalidraw/excalidraw react react-dom esbuild playwright` |

Annual assignments are maintained outside Git in `../2026-2027/assignments/`.
Run `python3 build.py --check` from that directory to build its three student PDFs
and separate TA PDF with Pandoc/XeLaTeX. See its README for requirements and
archived originals. This replaces the former hidden Hugo Assignments section;
a fresh website build does not publish assignment pages.

## Related

- [Exporting from Excalidraw](../authoring/excalidraw-export.md) — how to call the exporter.
- [The notation font](../design/notation-font.md) — what the font build reads.
