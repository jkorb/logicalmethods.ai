# Scope and binding

`logic-app name="fol-scope" formula="…"` renders quantifier-to-occurrence
arrows. Chapter instances default to `mode="display"`: all binding arrows and
free-occurrence marks are visible, with no input or practice controls.

Use `mode="explore"` on lecture slides. It is practice without levels, checking
or feedback: the lecturer selects a quantifier, which tints its scope, then
selects occurrences to draw or remove its arrows. Selecting the quantifier again
releases it; **Clear** removes every arrow. Nothing is marked free and no
verdict is shown, so the room can answer first. `formulas` takes several
formulas separated by `|`, shown as tabs named by `labels` (also `|`-separated);
`formula` alone gives one formula without tabs.

Use `mode="practice"` in exercises. A single app presents levels from
`fol-practice-levels.js`, including vacuous binding, shadowing, separate scopes,
and variables within function terms. Formulas are fixed tasks without editors.
Selecting another quantifier retains earlier selections; each occurrence can
have at most one chosen binder. Check evaluates all bindings together. Students
visit a vacuous quantifier but leave its selection empty. Written feedback,
retry shake, and success confetti follow the shared exercise conventions.

`fol-binding.js` derives occurrence identities and lexical binding from the
shared AST, so shadowed names and variables inside function terms are handled
without authored arrow lists. All choices work with keyboard buttons. Vacuous quantifiers reserve no arrow space when no arrows are drawn. The
formula scrolls horizontally on narrow displays; arrows follow font/layout
changes through ResizeObserver. Arrow ends are measured on screen, from the
centre of each symbol's top edge, and divided by the drawing's rendered scale,
so an arrow joins its quantifier to its occurrence when a slide zooms or scales
the app; browsers disagree on how SVG transforms and markers follow CSS zoom,
so neither is used. Each head is its own triangle in its wire's colour, its
tip on the symbol. Wires are solid: blue, red and green by quantifier. `fol-binding.js` also records where each quantifier's
scope ends (`scopeEnd`).

## Related

- [Parser](parser.md), [chapter apps](README.md), [static binding diagrams](binding-diagrams.md).
