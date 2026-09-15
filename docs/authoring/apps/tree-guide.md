# The tree terminology gadget

Use `{{</* tree-guide */>}}` for the inline animal-labelled tree and its
terminology definitions, as in Formal Languages after the parser and AST
introduction. It covers nodes, roots, edges, parents, children, siblings,
leaves, internal nodes, paths and branches (here, complete root-to-leaf paths).
The shortcode owns the fixed example; update its diagram, text alternative and
highlight targets together. It is independent of `logic-app`.

The shared shell loads `css/tree-guide.css` and `js/tree-guide.js` only where
this shortcode occurs. The gadget has no visible title. Definitions start
collapsed; clicking a term or pressing Enter/Space expands it and highlights
the tree, closing any other definition. Clicking again or pressing Escape
collapses it. Hover or keyboard focus previews highlights without expanding
definitions. Highlights use dashed strokes as well as color. Definitions and an
SVG text alternative remain available without JavaScript; buttons are added only
when the script runs. The diagram stays visible while scrolling definitions.

## Related

- [Static abstract syntax trees](syntax-trees.md), [Set diagrams](set-diagrams.md).
