# The LaTeX drill

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
a glyph in the box's font.

Skipping never reveals the answer, because the same prompt comes round again.
The field doubles as the start button, and the shortcuts are Shift+Enter to skip
and Escape to end; Tab is deliberately not bound, since it is how a keyboard user
leaves the field. A best score per difficulty is kept in `localStorage`. The brief confetti burst
uses `celebrate.js`, shared with Boolean exercises, and respects reduced motion.

## Related

- [The tools section](../tools-section.md) — why the drill has no page at `/tools/`.
- [Glossary and notation](../glossary.md) — the cheat sheet it must agree with.
