# Set diagrams

Use `{{< set-diagram scene="overlap" >}}` for a finite set demonstration.
Scenes in `data/set-diagrams.json` supply stable set and member IDs, display
labels, SVG contour paths, and each member's explicit `sets` membership list.
Contours in the current scenes were traced from the author's set and Lecture 3
Excalidraw drawings; each records its source file and element ID. Translations
and scaling, with light contour smoothing, adapt them to the app. Membership is
authoritative. Browser tests check it against the actual SVG paths and verify
containment in valid examples. Keep pictures clear of contour edges and labels.

The current scenes are `membership`, `subset`, `overlap`, `consequence`,
`countermodel`, `single`, and `single-countermodel`. Model scenes also specify
`premises` and `conclusion` as set IDs. A point's `image` names an existing book
illustration; `icon: "world"` draws a model using the shared `model-world.svg`
artwork. Numeric elements stay mathematical text. Each step supplies a title,
explanatory text, a query (`view`), and lists of contours to `include`
(intersection) and `exclude` (difference). SVG clips and masks shade the selected
region using those same contour paths. Set-member references such as `@{jimmy}`
in step prose render the corresponding picture with an accessible name; spoken
results resolve them to the member's name.

The shared `partials/figures/set-diagram.html` accepts a scene and unique ID.
It renders the diagram and explanations without JavaScript. The page-local module
adds buttons: hover or focus previews a step, clicking or Enter retains it,
and leaving a preview returns to the selection. The diagram sits left of its
explanation on desktop and above it on phones. There is no enclosing card or
visible app title. Introduce the mathematical idea in the surrounding prose,
as with the tree guide, rather than narrating button labels. Picture members
belong in the diagram and explanation sentences, not a separate selection row.

`assets/js/set-diagram-model.js` provides browser-independent membership,
intersection, difference, subset and countermodel queries. Future exercise
editors can reuse them; drawing controls and grading are not implemented yet.
Geometric area is not probability, and sampled models cannot establish validity
in an entire language's model space.

## Related

- [Finite set diagrams](../../design/set-diagrams.md) — the visual treatment.
- [Sets with pictures](sets.md) — the non-interactive set notation.
