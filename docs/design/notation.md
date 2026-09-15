# Notation

Four kinds of text appear in this book, and each has one face. The rule is by
**content**, not by position on the page.

 | Role                      | What it is                                                                   | Face                   | How it is written                |
 | ---                       | ---                                                                          | ---                    | ---                              |
 | Prose                     | the book's own voice                                                         | Atkinson Hyperlegible  | plain Markdown                   |
 | Display and headings      | titles, whiteboard asides, emphasis                                          | Excalifont             | headings, `excalifont` shortcode |
 | **Mathematical notation** | formulas, sets, alphabets, metavariables and expressions of formal languages | **Comic Shanns Logic** | `$…$`, `$$…$$`                   |
 | Source code               | Python, SQL, Lean                                                            | JetBrains Mono         | backticks and fenced code blocks |

Excalifont remains the heading and highlight face. New mathematical notation,
including sets and metavariables, uses Comic Shanns Logic via dollar math.
Backticks are reserved for literal source code in JetBrains Mono.

Display notation preserves internal line breaks but trims the opening and
closing delimiter newlines. It uses a regular weight, a size close to the prose and
compact margins; source-code fences still use JetBrains Mono. Use spaces around
binary operators, after commas and around `=` and `:`; keep negation and brackets
attached to their operands.

## Related

- [The notation font](notation-font.md) — why the symbols live in the font.
- [Notation](../authoring/notation.md) — the authoring rules for writing it.
- [Display mathematics](display-math.md) — how oversized displays are fitted.
