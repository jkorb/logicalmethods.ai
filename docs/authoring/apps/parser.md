# The parser app

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

The parser accepts `variables="plain"` for its input hint; its underlying
accepted language is unchanged.

## LaTeX input

Each instance has its own input, trace and controls. Complete LaTeX commands
convert immediately in these opt-in fields. A known continuation can extend a
converted command: typing `p` immediately after `\to` produces `⊤` (`\top`).
Composition input is converted only when composition ends. The converter extends
the aliases from the `tools` branch with the commands in the notation appendix
and standard numeric subscripts (`p_1`, `p_{12}`); legacy `p\_1` also works.
It is a symbol converter, not a LaTeX renderer. There are no symbol buttons.

## Controls

The input and tree use Comic Shanns Logic. A text version of the tree, named
controls, and live step explanations accompany the SVG. With JavaScript disabled
the explanatory text remains and controls stay disabled. Keep a worked example in
the surrounding prose, too.

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

## Related

- [Chapter apps](../../design/chapter-apps.md), [Browser suites](../../testing/browser-suites.md).
