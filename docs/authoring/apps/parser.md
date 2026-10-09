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

## First-order syntax

Use `language="fol"` with `kind="formula"` (default) or `kind="term"`.
For example, `formula="∀x (Human(x) → Mortal(x))"` or
`kind="term" formula="fatherOf(Socrates)"`. Use `signature="arithmetic"` for the denotation exercise; named signatures
are in `data/fol_languages/`. Otherwise the fixed demonstration signature
is defined in `assets/js/logic/fol-parser.js`.
It accepts bracketed applications with commas and arity-directed prefix
applications with spaces. Formula nodes and term nodes have distinct kinds.
The same tree display, text view, and controls work for both languages.
Conventional mode gives quantifiers the same tight binding as negation;
parenthesize a compound scope.

FOL uses the same side-by-side tree and current-step explanation as the
propositional parser, stacking on narrow screens. Trees always scale down to fit their width. Before stepping, the app measures
every trace tree and reserves the greatest displayed height for the current
label mode. Resizing recalculates that height; no vertical height cap crops
the completed tree. The FOL instances omit introductory
language and notation hints already taught in the chapter.

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

FOL inputs default to conventional notation (including ≠); explicit strict mode remains available.

The example initializes automatically, with the input read-only. The pencil
button inside the field enables editing and clears the previous trace. Choosing
**Start parsing** (or pressing Enter) freezes the input and builds a new trace.
The four icon buttons select first, previous, next and last steps, with accessible
names and disabled states at the boundaries. The text-view button switches
between the SVG and a nested list; it exposes `aria-controls` and `aria-expanded`.
The controls sit above the explanation and growing tree. “Current part” and
“Next step” occupy a definition list; the explanation follows it. They update
together in a polite live region. The lower-right accessibility button switches
between diagram and text. A pressed-state tree-label button in the tree’s upper-right toolbar switches
between abstract and formula labels without changing the trace. The same
toolbar provides PNG and LaTeX downloads. The LaTeX file is a standalone Forest
document of the current step, including unfinished nodes and the current label
mode. Editing clears the tree and disables LaTeX export until parsing restarts. The input label and app title remain accessible names,
without visible headings.

## Related

- [Chapter apps](../../design/chapter-apps.md), [Browser suites](../../testing/browser-suites.md).
