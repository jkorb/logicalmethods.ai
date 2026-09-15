# Pages and front matter

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
[`textbook/_index.md`](../../content/textbook/_index.md). `hidden` removes a
section from the usual navigation, and `locked` disables a page's section-list
link. Neither makes content private.

## `last_edited`

For textbook pages with `params.last_edited`, use a quoted `DD/MM/YYYY` string
and update it when editing the chapter, including its notation or illustrations.
The chapter heading displays this value verbatim; it is not derived from Git.
When auditing stale tags, check the page’s Git history and any uncommitted
content changes. Do not advance the date for a date-only correction or a change
to shared site templates. File modification times alone are not reliable evidence
of an edit, since checkouts can reset them.

## Appendices

Reference pages can set `params.appendix: A` (or another letter). Their weight
still controls ordering, but headings, breadcrumbs, contents cards and the
chapter rail use the appendix letter instead of a chapter number.

## Related

- [Front matter, IDs, passwords](../testing/while-editing.md) — `npm run check:content`.
- [Render hooks](../design/render-hooks.md) — how the appendix label is emitted.
