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
  math: true
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

## Notation is template-dependent

The [textbook](../layouts/textbook/single.html) and
[exercise](../layouts/exercises/single.html) templates transform the following
delimiters before Markdown rendering:

| Source notation | Result in these two templates |
| --- | --- |
| `$…$` / `$$…$$` | Inline / centered Excalifont text, not ordinary KaTeX dollar math. |
| Single / triple backticks | Custom inline / centered code markup. |
| `!!…!!` | Blue Boolean notation. |
| `~!…!~` | Red Kleene notation. |
| `%…%` | Converted to ordinary Markdown inline code after the custom pass. |
| Triple tildes | Converted to ordinary Markdown backtick fences after the custom pass. |

These substitutions use regular expressions: do not assume arbitrary nesting,
literal delimiter characters, or every multiline case will work. Preview any
changed formulas or code blocks. Other section templates have their own behavior;
do not apply this table globally.

The [shared KaTeX partial](../layouts/partials/shared/math.html), enabled with
`math: true`, recognizes dollar delimiters and `\(…\)` / `\[…\]` in the rendered
page. Dollar delimiters already removed by preprocessing cannot reach KaTeX.
Use an existing working example and check the final rendering when adding TeX.

## Images, links, and solutions

Use page-bundle images with the existing shortcode:

```go-html-template
{{< img src="img/example.png" alt="Description of the diagram" class="img-fluid" >}}
```

The [`img` shortcode](../layouts/shortcodes/img.html) looks only in the page's
resources and prints `Image not found` if lookup fails. Shared graphics live in
`assets/img/` and are accessed by templates or dedicated symbol shortcodes.
Editable diagram resources may accompany exports; preserve both when present.

For textbook references, [`chapter_ref`](../layouts/shortcodes/chapter_ref.html)
looks up a topic under `/textbook/` and accepts an optional heading `id`:

```go-html-template
{{< chapter_ref chapter="logic-and-ai" >}}Logic and AI{{< /chapter_ref >}}
```

Preserve existing heading anchors when editing titles, or update incoming links.
Exercise solution controls depend on matching explicit heading IDs:

```markdown
# Example question {#example .solved}

Question text.

## Solution {#exampleSolution .solution}

Solution text.
```

The [exercise heading hook](../layouts/exercises/_markup/render-heading.html)
and [`exercises.js`](../assets/js/exercises.js) connect the question ID plus
`Solution` to the solution block, and the page `params.id` to the password lookup.
A `.solved` class alone does not supply the explicit ID required by that hook.
Verify the modal and collapse in a browser. Answers are present in delivered HTML.

## Slides and completion checks

Existing slides such as
[`slides/logic-and-ai/index.md`](../content/slides/logic-and-ai/index.md) select
`layout: excalidraw_slides` and embed an externally hosted presentation with the
`iframe` shortcode. The default slide template instead initializes Reveal.js.
Editing an embed URL does not edit the external deck; review it separately.

Before finishing: run `hugo -D`, inspect the changed page and its section list,
check notation and resource loading, and test any affected anchors or controls.
For a topic revision, check related textbook, exercise, and slide pages for
consistency. Update these guides if the authoring conventions themselves change.
