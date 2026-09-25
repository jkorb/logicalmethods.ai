---
date: '{{ .Date }}'
draft: true
weight: n
author: "Author"
title: '{{ replace .File.ContentBaseName `-` ` ` | title }}'
layout: 'reveal_slides'
summary: 'Lecture N: one sentence on what the lecture does.'
params:
  id: sli-???
  chapter: ???
  license: 'CC-BY-4.0'
  highlights:
    - keyword: ""
      id: ""
---

{{ "{{< slide title=\"Learning goals\" >}}" }}
## What you'll be able to do

{{ "{{< callout type=\"objectives\" >}}" }}
After this lecture and chapter N, you will be able to:

- … *(Bloom level)*
{{ "{{< /callout >}}" }}

{{ "{{< slide >}}" }}
## Why this matters

…
