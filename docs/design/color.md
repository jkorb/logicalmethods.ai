# Color

Each accent exists twice. `--<hue>-ink` is safe for text (AA 4.5:1); `--<hue>-gfx`
is for strokes, borders and fills (3:1). Using `-gfx` for body-size text is a bug.

 | Token                           | Light                 | Dark                  | Role                              |
 | ---                             | ---                   | ---                   | ---                               |
 | `--paper`                       | `#FCFBF7`             | `#15171B`             | the page                          |
 | `--paper-raised`                | `#FFFFFF`             | `#1B1E23`             | cards, dialogs, rails             |
 | `--paper-sunken`                | `#F2EFE7`             | `#101216`             | code, wells                       |
 | `--grid`                        | `#EDEAE0`             | `#1E2127`             | the 5&nbsp;mm squares             |
 | `--margin-rule`                 | `#E3A7AC`             | `#6E4245`             | the red margin line               |
 | `--ink` / `--ink-muted`         | `#23262B` / `#5A6068` | `#E9E7E1` / `#A8AEB8` | text                              |
 | `--blue-ink` / `--blue-gfx`     | `#1263AE` / `#1971C2` | `#4E9BE0`             | Boolean notation, links           |
 | `--red-ink` / `--red-gfx`       | `#C42B2B` / `#E03131` | `#F07272`             | Kleene notation, current position |
 | `--green-ink` / `--green-gfx`   | `#20762F` / `#2F9E44` | `#37B04D`             | solutions, confirmation           |
 | `--orange-ink` / `--orange-gfx` | `#8F5300` / `#D37B00` | `#E39B2B`             | notes, warnings                   |

The strictest case is text sitting on a **grid line**, not on bare paper. Every
value above was measured against that case; the worst accent scores 4.68:1. If you
change `--grid` or `--paper`, re-check the accents before shipping.

Tinted callout surfaces (`--surf-*`) sit at roughly 1.1:1 against paper. They are
invisible on their own, so a callout **must** also carry its 3&nbsp;px left rule.

Color is never the only signal. `.Boolean` and `.Kleene` mark two different formal
languages, so they differ in underline style as well as hue (solid vs dotted).

## Related

- [Dark mode](dark-mode.md) — where these values are redefined.
- [Components](components.md) — the callout rule that carries the meaning.
