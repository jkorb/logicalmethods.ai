# Set diagrams

Use `{{< set-diagram scene="overlap" >}}` for a finite set demonstration.
Scenes in `data/set-diagrams.json` supply stable set and member IDs, display
labels, SVG contour paths, and each member's explicit `sets` membership list.
Set perimeters are regular rounded rectangles. Object centres follow a shared,
invisible grid: columns `80, 190, 300, 410, 520` and rows `90, 180, 270` in the
600 × 360 viewBox. Choose overlapping or nested rectangles to illustrate the
required memberships; do not add regions merely to complete a Venn diagram.
Membership is authoritative. Browser tests check it against the actual SVG
paths and verify containment in valid examples. Keep pictures, model labels,
and selection rings clear of contour edges and set labels.

The current scenes are `membership`, `subset`, `overlap`, `consequence`,
`countermodel`, `single`, `single-countermodel`, `union`, and `difference`. Model scenes also specify
`premises` and `conclusion` as set IDs. A point's `image` names an existing book
illustration; `icon: "world"` draws a model using the shared `model-world.svg`
artwork. Numeric elements stay mathematical text. Each step supplies a title,
explanatory text, a query (`view`), and lists of contours to `include`
(intersection) and `exclude` (difference). SVG clips and masks shade the selected
region using those same contour paths. A step with `union: ["S", "T"]` clips
to the combined contours; `view: "union"` selects members of any set in the scene. Set-member references such as `@{jimmy}`
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
intersection, union, difference, subset and countermodel queries. Exercise mode reuses these queries for grading; moving objects or drawing new
contours is not implemented.
Geometric area is not probability, and sampled models cannot establish validity
in an entire language's model space.

## Exercises

Use `{{< set-diagram exercise="abstraction" >}}` for a sequence of levels.
Exercise banks live in `data/set-exercises.json`. The bank supplies a default
`scene`; individual questions may supply their own. `levels: true` presents
Previous/Next buttons and a level counter. Each level retains its answer when
revisited. Without levels, questions remain directly selectable by name.
Current banks are `abstraction`, `relations`, `intersections`, and `countermodels`.

Each question has an ID, label, prompt, and explanation. There are two tasks:

- Object selection: a `view` uses the existing set queries. Alternatively, a
  `predicate` checks the `traits` of each object, using `all`, `any`, and `none`
  lists. Its `formula` displays the set abstraction. Empty selections are allowed.
- True/False: a `statement` displays one claim, with pictures for member markers
  such as `@{jimmy}`. A semantic `claim` determines the answer from membership.
  The two answer buttons give immediate explanatory feedback.

The `objects` scene uses a populated grid without set contours, so the drawing
does not reveal a predicate's answer. `separate` supplies disjoint sets alongside
the existing overlapping and nested scenes. Keep depicted traits and prose
assumptions consistent; these are finite teaching examples, not an image classifier.

Selection questions have Check, Clear, and Show answer. Check reports missing
and extra choices; Show answer selects and explains the correct answer. There
is no persistent score or forced progression. Picture selection works by mouse,
touch, or Tab and Enter/Space, with pressed states and live feedback. All pictured
objects form the universe for non-member questions. Text alternatives remain
available. Without JavaScript, every level's diagram, prompt, and expandable
answer is readable. The shared renderer supplies each level's SVG and unique IDs.

## Related

- [Finite set diagrams](../../design/set-diagrams.md) — the visual treatment.
- [Sets with pictures](sets.md) — the non-interactive set notation.
