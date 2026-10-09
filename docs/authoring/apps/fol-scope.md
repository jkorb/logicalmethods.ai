# Scope and binding

`logic-app name="fol-scope" formula="…"` renders quantifier-to-occurrence
arrows. Chapter instances default to `mode="display"`: all binding arrows and
free-occurrence marks are visible, with no input or practice controls.

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
changes through ResizeObserver.

## Related

- [Parser](parser.md), [chapter apps](README.md), [static binding diagrams](binding-diagrams.md).
