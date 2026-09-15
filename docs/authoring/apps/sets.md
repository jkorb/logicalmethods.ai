# Sets with pictures

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

## Illustrated set expressions

The same shortcode accepts `expression=true`. Its JSON array then composes sets,
picture members and operators without adding outer braces:

```text
{{< set expression=true alt="The set containing Little Jimmy is a subset of the set containing Little Jimmy and a beer." >}}
[{"set":[{"image":"gimmick_little_jimmy"}]}, {"op":"⊆"}, {"set":[{"image":"gimmick_little_jimmy"}, {"image":"gimmick_beer"}]}]
{{< /set >}}
```

Use `inline=true` for a picture or set inside a sentence. The same recursive
renderer handles nested braces. Operators remain Unicode text. Picture members
use transparent backgrounds and theme-aware ink; white parts follow the paper
color so dice pips and facial details stay visible in dark mode. The original
artwork's colored fills remain intact. Do not replace these pictures with letter
aliases merely to compose an equation. Always supply a complete accessible
description.

## Related

- [Set diagrams](set-diagrams.md) — the interactive finite-set applet.
- [Display mathematics](../../design/display-math.md) — the shared type rhythm.
