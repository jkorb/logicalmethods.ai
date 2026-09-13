# Content authoring

## Pages and front matter

Sections use `content/<section>/_index.md`; most lessons are leaf bundles at
`content/<section>/<topic>/index.md`, with local images alongside them. Copy the
structure of a nearby page in the same section and inspect its template before
introducing new conventions. Keep existing path casing and anchor targets.

A typical new textbook page starts with:

```yaml
---
title: Example topic
author: Author Name
weight: 140
draft: true
locked: false
params:
  id: txt-example
---
```

Choose an appropriate unused weight and stable ID. Weights usually increase by
ten; list and textbook numbering use `weight / 10`, so weights affect displayed
numbers as well as order. IDs also connect controls and scripts: changing an
exercise's `params.id` can break its password lookup. `draft: true` is not a
publication barrier under the current CI build.

Section front matter supplies presentation metadata such as `emoji`, `icon`,
`teaser`, `title_img`, `section-names`, and `id`; see
[`textbook/_index.md`](../content/textbook/_index.md). `hidden` removes a section
from the usual navigation, and `locked` disables a page's section-list link.
Neither makes content private.

## Notation

Textbook, exercise and assignment pages use ordinary Markdown code and dollar-delimited
mathematics. Hugo's [passthrough render hook](https://gohugo.io/render-hooks/passthrough/)
handles math in `layouts/_default/_markup/render-passthrough.html`; there is no
page-template regex pass over the source.

| Source | Result |
| --- | --- |
| `$A ∧ B$` | Inline Comic Shanns Logic notation. |
| `$$` on separate lines around an expression | Centered Comic Shanns Logic display. |
| Single backticks | Literal inline source code in JetBrains Mono. |
| Backtick or tilde fences, optionally with a language | Source-code blocks; syntax highlighting when specified. |
| `$!!AND!!$`, `$X !!AND!! Y$` | Blue Boolean notation within math. |
| `$~!NOT!~$`, `$~!NOT!~ A$` | Red Kleene notation within math. |

Type Unicode symbols directly: dollar math selects a font, not a TeX engine.
Use spaces around binary operators and after commas; attach negation and
brackets to their operands. Internal line breaks in displays are retained.
Keep a display within one Markdown paragraph: no empty lines, list markers or
heading underlines inside it. Number calculation lines `(1)`, `(2)`, etc.
A tab before an annotation aligns it at the next 24-space tab stop.
Give headings containing math explicit IDs to preserve stable links and exercise
solution controls (for example, `## $SAT$ {#sat}`).
For a standalone equals sign use `&#61;` to avoid Markdown's heading syntax.
Use `&lt;` for a less-than sign adjacent to a letter, since inline HTML remains
available in math. Symbol shortcodes and author-supplied inline HTML still work.

Displays and illustrated sets share compact margins and regular-weight type.
Oversized displays shrink to fit; break very long expressions into meaningful
lines to keep them readable. Code blocks keep their font size and scroll.

Dollar signs inside code remain literal. Escape a literal dollar in prose as
`\$`. The former `%…%` source-code escape is retired. Keep genuine
whiteboard emphasis explicit with `excalifont`; it isn't math notation.

The exception is `params.latex: true`, available for pages that explicitly request TeX rendering:
dollars retain TeX meaning there and the page loads the bundled KaTeX renderer.
Backticks still show literal source. No KaTeX is loaded on ordinary book pages.

## Images, links, and solutions

Use the `img` shortcode for both page-bundle images and shared SVGs; see
[Figures](#figures) for paths, spacing and exports.

For textbook references, [`chapter_ref`](../layouts/shortcodes/chapter_ref.html)
looks up a topic under `/textbook/` and accepts an optional heading `id`.
A missing chapter fails the build:

```go-html-template
{{< chapter_ref chapter="logic-and-ai" >}}Logic and AI{{< /chapter_ref >}}
```

Preserve existing heading anchors when editing titles, or update incoming links.
Exercise solution controls connect a question ID to a solution ID:

```markdown
# Example question {#example .solved}

Question text.

## Solution {#exampleSolution .solution}

Solution text.
```

The [exercise heading hook](../layouts/exercises/_markup/render-heading.html)
and [`exercises.js`](../assets/js/exercises.js) connect the question ID plus
`Solution` to the solution block, and the page `params.id` to the password lookup.
Hugo generates a heading ID when none is supplied. Use an explicit ID to keep
solution controls working when you rename a question. Verify the modal and
collapse in a browser. Answers are present in delivered HTML.

## Slides

Existing slides such as
[`slides/logic-and-ai/index.md`](../content/slides/logic-and-ai/index.md) select
`layout: excalidraw_slides` and embed an externally hosted presentation with the
`iframe` shortcode. The default slide template instead initializes Reveal.js.
Editing an embed URL does not edit the external deck; review it separately.

The shortcode does not render an `<iframe>`. It renders a button naming the host
it would contact, and `assets/js/helpers.js` swaps the frame in when the reader
presses it, so opening a slide page sends nothing to anyone. Any new embed must
go through this shortcode for the same reason — and with JavaScript off, the
caption's link to the deck is still there.

Prefer literal symbols to symbol shortcodes: `$∀x(Human x → Mortal x)$` is
readable in the source. The older symbol shortcodes still emit the same Unicode
characters. If a glyph is missing, add it to the patched font rather than use
an image; see [design](design.md#notation).

## Inference figures

```go-html-template
{{</* inference rule="MP" */>}}
$A → B$
$A$
---
$B$
{{</* /inference */>}}
```

Lines above the `---` are premises, one per line; the line below is the
conclusion. `rule` is optional. Add `layout="stacked"` to put premises
underneath one another, followed by a solid rule and the conclusion. Each
line is centered, in the same size and face as display mathematics. Without
that option, the existing side-by-side presentation is retained. The figure gets a sentence as its accessible
name ("From …, and …, infer …"), so a screen reader hears the inference rather
than three loose fragments.

## Callouts

Mark definitions, examples and warnings with the callout shortcode rather than
plain paragraphs:

```go-html-template
{{< callout type="definition" title="Valid inference" >}}
An inference is valid iff it is impossible for the premises to be true and the
conclusion false.
{{< /callout >}}
```

`type` is one of `definition`, `example`, `theorem`, `warning`, `note` or
`objectives`. The type name is always rendered as visible text, so the meaning
never depends on color alone.

For an example sentence without a callout heading or quotation bar, use:

```go-html-template
{{</* sentence */>}}
If a mushroom has red spots and gills, then it's not poisonous.
{{</* /sentence */>}}
```

It uses Comic Shanns Logic on a quiet paper surface. Its body supports Markdown,
including dollar math. Use blockquotes for actual quotations and code fences
for programs, not as substitutes for example sentences.

## Figures

**Use `img` for all book images.** The shortcode delegates to
`layouts/partials/figures/image.html`, also used by illustrated sets.
Reference the file you intend to publish:

```go-html-template
{{</* img src="img/my-diagram.svg" width="600px" alt="Description of the diagram." */>}}
{{</* img src="/img/drawings/gimmick_mushroom.svg" width="150px" class="float-start me-3" */>}}
```

A relative path resolves in the page bundle. A leading `/` resolves relative
to `assets/`, so `/img/drawings/tree.svg` is a shared drawing. Missing resources
fail the build with the calling page's source location. Supply `alt` for
informative images; an empty or omitted `alt` marks decoration.

Every image has a `.book-figure` wrapper. Width, height limits, floats and
spacing classes belong to that wrapper for both SVG and remaining raster
assets. Width is clamped to the available column; aspect ratio is preserved.
The default block margin is 1.4rem above and below. Utility classes override it.
Use `inline=true` with `height="1.5em"` for a picture within a sentence.
It has no block margins and scales to the given height.
Both formats use the same light paper surface in dark mode, with no extra
padding. Internal SVG IDs and references are prefixed for each occurrence.

SVG is the target format for all illustrations. Convert remaining PNGs chapter
by chapter, update references explicitly, and remove replaced files only from
the chapter being revised. Formal Languages now has no PNG assets.

### Exporting from Excalidraw

Direct SVG exports from Excalidraw can be placed in the page bundle or in
`assets/img/drawings/`. Keep the editable `.excalidraw` source beside the image,
or under `assets/img/drawings/sources/` for the shared library.

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
[technical setup](technical.md#authoring-tools). Hugo only needs the saved SVGs.
Review exports before replacing existing figures.

Brand mascots in the shared shell retain their dedicated token-colored
component. They are site furniture; chapter illustrations all use `img`.

## Checking your work

Run `npm run check` after editing content, and `npm test` before pushing. Preview
the changed page and its section list. Check formulas, images, links, and any
solution controls. When revising a topic, also check its related textbook,
exercise, and slide pages for consistency.

For spelling and style suggestions, use `npm run lint:prose` after
[setting up Vale](testing.md#spelling-and-style). The [testing guide](testing.md)
explains the available checks and how to handle exceptions.

## Glossary and notation

Reference pages can set `params.appendix: A` (or another letter). Their weight
still controls ordering, but headings, breadcrumbs, contents cards and the
chapter rail use the appendix letter instead of a chapter number.


The glossary definitions live in `data/glossary.json`. Each entry has a stable
key, `term`, `definition` (plain text), and `chapter` (textbook bundle name).
Keep the key stable: chapter links and external links use it as an anchor.
Glossary return links go to the first `term` shortcode for that key in the
entry's `chapter`. The shortcode supplies a unique `term-<key>-<ordinal>` anchor.
An optional `anchor` field overrides this with a heading or other existing ID
(without `#`), for example when the definition has no marked term yet. Prefer
the section that explains the concept over an incidental early mention.
A missing chapter or missing return target configuration fails the build;
check rendered fragment destinations after changing an explicit anchor.
`content/textbook/glossary/index.md` renders the collection with the `glossary`
shortcode; the preceding Notation appendix combines symbols, readings, and glossary links
in one table, ordered from sets and syntax through semantics
and proofs to uncertainty and learning. Its separate LaTeX cheat sheet gives
app commands, complete parser inputs, and instructions for LaTeX documents.
Keep its typing notes consistent with
the commands supported by `assets/js/apps/latex-input.js`; the cheat sheet distinguishes app-supported commands from commands for
LaTeX documents.

At the first substantial introduction of a concept, use:

```go-html-template
{{< term "countermodel" "countermodel" >}}
```

The second argument is optional and preserves the wording or inflection needed
in the sentence. The link previews the definition on hover or keyboard focus
and opens the glossary entry in a new tab. Do not wrap it in another Markdown
link. Without JavaScript, the ordinary link and native title remain available;
all glossary entries remain readable. Search matches words in terms and their
definitions. A direct fragment link reveals the entry even after filtering.

Use `callout type="note"` with a title beginning “Modeling assumptions” to flag
choices of domain, idealization, evidence model, or action policy. Explain what
those choices let us conclude in the terminology of chapter 1.

The Python-style pseudocode introduction is in Formal Languages, after parsing.
It reconstructs the recursive algorithm demonstrated by the parsing app. Distinguish executable examples from templates or fragments,
and state the input, intended output, and termination conditions of an algorithm.
Further readings refer to specific AIMA fourth-edition chapters or Open Logic
books; label PDF links and distinguish publisher pages from freely available PDFs.


## Interactive chapter apps

Embed the parsing app in a textbook page or an exercise solution with:

```go-html-template
{{</* logic-app name="parser" formula="¬(p ∧ q)" */>}}
{{</* logic-app name="parser" mode="conventional" formula="¬p ∧ q" title="Parsing with bracket conventions" */>}}
```

The default mode is `strict`, following the chapter's fully bracketed grammar.
`conventional` uses the chapter's precedence and grouping rules. Both accept
`p` with a positive Unicode subscript index, and `p`, `q`, `r` as shorthand. Parser and
builder input hints state these supported names; other mathematical variable
names in the chapter are not accepted by these demonstrations. Whitespace
separates symbols but is otherwise ignored. Limits of 512 input characters,
128 symbols, and 48 nested parsing calls keep the demonstration responsive.
These are app limits, not restrictions on the mathematical language.

Each instance has its own input, trace and controls. Complete LaTeX commands
convert immediately in these opt-in fields. A known continuation can extend a
converted command: typing `p` immediately after `\to` produces `⊤` (`\top`).
Composition input is converted only when composition ends. The converter extends
the aliases from the `tools` branch with the commands in the notation appendix
and standard numeric subscripts (`p_1`, `p_{12}`); legacy `p\_1` also works.
It is a symbol converter, not a LaTeX renderer. There are no symbol buttons. The input and tree use Comic Shanns Logic. A text version of the
tree, named controls, and live step explanations accompany the SVG. With
JavaScript disabled the explanatory text remains and controls stay disabled.
Keep a worked example in the surrounding prose, too.

The LaTeX drill is the second app:

```go-html-template
{{</* logic-app name="latex-game" title="LaTeX speed challenge" */>}}
```

It shows a piece of notation and asks for the LaTeX that produces it, scored
over one minute. Easy asks for individual symbols and subscripts. Medium
combines symbols into expressions and adds text formatting. Hard adds
fractions, superscripts, and further mathematical notation.
Prompts live in `assets/js/apps/latex-game-prompts.js`, where families are
generated from a template rather than transcribed. Marking runs
the answer through the replacement rules in `assets/js/apps/latex-input.js`, so
every alias counts and spacing never matters, with a literal match for commands
the converter does not know. A prompt is a `[shown, accepted commands, name]`
triple; the unit tests check that every command listed is actually accepted,
that easy keeps up with the converter, and that prompts use only the tags the
box styles, and a browser test checks that every character in every prompt has
a glyph in the box's font. Skipping never reveals the
answer, because the same prompt comes round again. The field doubles as the
start button, and the shortcuts are Shift+Enter to skip and Escape to end;
Tab is deliberately not bound, since it is how a keyboard user leaves the field.
A best score per difficulty is kept in `localStorage`.

The formula builder is the third app:

```go-html-template
{{</* logic-app name="builder" target="((p₁ ∧ p₃) → ¬p₂)" */>}}
{{</* logic-app name="builder" levels="true" */>}}
```

It only lets the reader do what the inductive definition allows: add an atom,
select one or two formulas already on the board, and apply an operator. A
formula that has been used is spent, so the only way to reach the target is to
construct it — there is no field to type a formula into. Give it either a
`target` (a chapter demonstration) or `levels="true"` (the twelve targets in
`assets/js/apps/formula-builder.js`, ordered by how many steps they take);
asking for both, or neither, is an error at build time. Targets are compared as
text against the labels the board builds, so they have to be spelled the way
`printFormula` spells a formula — the unit tests check every level against the
chapter's own grammar, and that each level's atoms are atoms. The chapter copy
sits right after the worked construction it mirrors; completed levels are
remembered in `localStorage`.

It grew out of a canvas prototype on the `tools` branch. The interaction is
that prototype's; the drawing is not. Nodes are buttons in a DOM tree so the
board is reachable by keyboard and readable by a screen reader, the lines
between them are CSS borders rather than a measured overlay, and the colours
are tokens. The builder is not in the tools appendix: both copies carry a
target to reach, which makes them exercises rather than something to check your
own work with.

The shortcode triggers page-local CSS and a Hugo-bundled JavaScript entry.
Register new apps in `assets/js/apps/index.js`, add their markup as
`layouts/partials/apps/<name>.html`, and extend the shortcode's supported
names. App code must be scoped to its root element; it must not
claim document-wide IDs or change other fields. Pure logical operations live
in `assets/js/logic/`; `parseFormula`, `traceParse`, and `printFormula` are
exported from `parser.js` for reuse without a browser. The trace and the app
use the same parsing implementation.


The example initializes automatically, with the input read-only. The pencil
button inside the field enables editing and clears the previous trace. Choosing
**Start parsing** (or pressing Enter) freezes the input and builds a new trace.
The four icon buttons select first, previous, next and last steps, with accessible
names and disabled states at the boundaries. The text-view button switches
between the SVG and a nested list; it exposes `aria-controls` and `aria-expanded`.
The controls sit above the explanation and growing tree. “Current part” and
“Next step” occupy a definition list; the explanation follows it. They update
together in a polite live region. The lower-right accessibility button switches
between diagram and text. “Show formulas at nodes” switches labels without
changing the trace. Long formula labels increase node width and may require
horizontal scrolling. The input label and app title remain accessible names,
without visible headings.

### Static abstract syntax trees

Use `syntax-tree` for small trees that should also work without JavaScript:

```go-html-template
{{</* syntax-tree caption="Reading: ¬(p ∧ q)" */>}}
{"label":"¬","children":[{"label":"∧","children":[{"label":"p"},{"label":"q"}]}]}
{{</* /syntax-tree */>}}
```

The body is JSON: each node has a string `label` and an optional `children`
array in left-to-right order. Leaves omit `children`. The shortcode renders a
figure and nested lists through `partials/apps/tree-node.html`; CSS draws the
edges. Wrap two figures in `<div class="ast-comparison">` to compare readings.
The figures wrap on narrow screens. Larger trees scroll within their keyboard-focusable figures. Their CSS loads only on pages containing
this shortcode. Use these ASTs for grammatical structure, with variables at
leaves and operators at internal nodes; omit brackets and grammar categories.


### Sets with pictures

To combine text and pictures in extensional set notation:

```go-html-template
{{</* set alt="The set containing Little Jimmy and the set containing 1 and a beer." */>}}
[{"image":"gimmick_little_jimmy"}, {"set":["1", {"image":"gimmick_beer"}]}]
{{</* /set */>}}
```

The JSON body lists members. A string is text, `{"image":"name"}` is a drawing,
and `{"set":[...]}` is a nested set; an empty array gives the empty set. `alt`
is required and describes the whole expression. This shortcode formats an
extensional set expression, not a set-abstraction condition. Braces, commas and
text use Comic Shanns Logic; pictures remain SVG.

The image member name resolves to `/img/drawings/<name>.svg` through the same
image partial as `img`. Each occurrence receives its own SVG IDs. Picture
members are 1.6em high and braces 1.45em; both scale with the display text.

## Tools appendix

`content/textbook/tools/index.md` is Appendix C. Group apps by chapter, link to
the chapter's explanation and reuse `logic-app` with the appropriate parameters.
Add an entry here whenever a chapter gains a new app. Only implemented apps
belong in the appendix; currently these are the strict and conventional parsers.
The LaTeX drill stays out: it is an exercise with a target score, not a tool to
check your work with.
Do not copy app HTML or JavaScript into the appendix. Its two instances also
exercise independent input and history in the browser tests.


## Tree terminology gadget

Use `{{</* tree-guide */>}}` for the inline animal-labelled tree and its
terminology definitions, as in Formal Languages after the parser and AST
introduction. It covers nodes, roots, edges, parents, children, siblings,
leaves, internal nodes, paths and branches (here, complete root-to-leaf paths).
The shortcode owns the fixed example; update its diagram, text alternative and
highlight targets together. It is independent of `logic-app`.

The shared shell loads `css/tree-guide.css` and `js/tree-guide.js` only where
this shortcode occurs. The gadget has no visible title. Definitions start
collapsed; clicking a term or pressing Enter/Space expands it and highlights
the tree, closing any other definition. Clicking again or pressing Escape
collapses it. Hover or keyboard focus previews highlights without expanding
definitions. Highlights use dashed strokes as well as color. Definitions and an SVG
text alternative remain available without JavaScript; buttons are added only
when the script runs. The diagram stays visible while scrolling definitions.

### Introductory exercise apps

`notation-practice` checks conversion in both directions, preserving the exact
AST. Conventional answers must omit every redundant pair of brackets; mere
logical equivalence does not count. `shunting-yard` shows immutable input,
stack, and output snapshots. Both use the chapter parser's priorities and
require explicit grouping for repeated equivalences. `reasoning-practice`
presents twelve cases from `data/reasoning-practice.json`, distinguishing a
deductive guarantee, inductive support, and insufficient support. It records
first answers for the current round, explains each case, and permits review
and restart. Its no-JavaScript version includes expandable feedback.
Self-checking app exercises do not need duplicate solution blocks. Retain
written solutions when an exercise also asks for explanations or an algorithm.

The builder accepts `variables="plain"` to display its twelve exercise targets
using p, q, and r. The parser accepts the same option for its input hint;
its underlying accepted language is unchanged. The preamble exercises use
Unicode math in Comic Shanns, including HTML sub/sup tags where needed;
literal LaTeX solutions remain in code spans. They no longer enable KaTeX.

## Staged release

Chapters and exercises after Formal Languages, and their slide decks, are
marked `locked: true`: navigation is grayed out, while direct URLs still work.
Unrevised textbook and exercise sources use `params.legacy-notation:
true` and the compatibility renderer in `layouts/partials/legacy-content.html`.
Remove that parameter when converting a page to the current notation format.
The released glossary contains only entries referenced by the released material,
including the complete Notation appendix. Return links point to introductions
in chapters 1–2 or that appendix. Keep unreleased definitions local until the
corresponding revisions are ready.
