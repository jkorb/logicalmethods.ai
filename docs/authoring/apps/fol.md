# First-order model canvas

`logic-app name="fol-model"` displays an independent finite model. The default
`kind="model"` has no formula or evaluation controls. Use `kind="evaluate"`
for satisfaction, `kind="query"` for extensions, or `kind="sql"` for the
[SQL correspondence](fol-sql.md). Configurations are described in
[Model data](fol-data.md).

```go-html-template
{{</* logic-app name="fol-model" model="people-constants" view="graph" */>}}
{{</* logic-app name="fol-model" model="people-relations" kind="evaluate" formula="∀x (Human(x) → Mortal(x))" */>}}
```

The pencil opens collapsible Domain, Constants, Function terms, and Predicates
groups. Available objects carry a green plus; the configured domain palette can
include more objects than the starting model. Semantic brackets identify the
interpretation buttons. Choosing one highlights its interpretation in the
canvas, then accepts object clicks in order. Functions take a final click for
their value; repeating a predicate tuple removes it. A selected predicate table
shows a plus row with pending argument slots, and each set has an add button.
The canvas prompts for the next object. Escape cancels the pending
selection. Reset restores the configured model. Selected objects and tuples
have delete controls; right-click or Shift+F10 opens context actions. Removing
an object clears its incident tuples and denotations.

The eye opens four compact presentation choices: semantic facts, ruled tables,
knowledge graph, and sets. Set and function extensions have tabs on the canvas.
Set drawings reuse transparent SVG artwork with theme-aware strokes. Graphs
grow to fit without an internal scrollbar and use colored arrows with fixed
line and arrowhead sizes, including during selection. Overlapping labels on
opposite arrows of the same relation share one printed name; different names
are offset. Each arrow keeps its own accessible label and selection target.
Predicate and function interpretation labels use semantic brackets, including
graph arrows and relation nodes of higher arity. Optional object groups
arrange larger graphs in columns.
A Together tab shows both unary extensions when the signature has exactly two
unary predicates. Objects occupy the intersection, one set only, or neither;
binary relations retain their ordered-tuple views. Zoom ranges from 50% to 100%. Fullscreen uses the browser API with a fixed
canvas fallback, the F shortcut, and Escape to leave the fallback.

Evaluation requires a complete model. Satisfaction fields freeze after checking;
the inline pencil unlocks editing. Check and Query sit beside their input
fields. Query fields also freeze after running; the pencil clears the previous answer and enables editing. Open formulas have pictured assignment choices.
The explanation sits beside the canvas on desktop and below it on phones.
`fol-trace.js` groups a quantified scope's checks by domain object. Query mode
highlights the tuples found so far and lists the growing answer in the explanation column. Navigation sits below the
model/explanation pair. Each candidate is
numbered and shows the candidate objects in free-variable order. The walkthrough
ranges over domain tuples; stepping backward also rolls back the answer. Quantified queries offer an inline
Why this tuple? disclosure with the evaluation details. The ⟦A⟧ button hides or
shows the extension found so far. `view="domain"` shows constant denotations and tables for the functions and predicates in
the query above the candidate domain
D, D², or a higher product, in free-variable order. The current objects are marked in those tables, and the current tuple has a blue
border; checks and crosses mark visited tuples, and kept tuples are green.
Clicking a tuple moves the walkthrough to that point. Larger products show a
numbered window that follows the current step (30 candidates, or 12 for arity
above two). The full answer still accumulates across windows. Editing the query
clears the old domain. The eye menu keeps the model presentations available.
Emoji tables use compact rows and grow to
fit their contents without a nested vertical scrollbar.

`kind="term"` reuses the model canvas and assignment choices for recursive
term evaluation. Its trace visits variables, constants, and function applications
from the leaves upward. The tree on the right annotates visited nodes with their
denoted objects; function tables highlight the current input in the argument
column only. Assignment choices sit beside their v(x) labels. Formula inputs
accept conventional notation and ≠; a closed formula needs no assignment choices.

Query walkthroughs prune candidates excluded by necessary positive atoms.
Conjunction combines restrictions; disjunction and existential projection retain
a safe overestimate. Negation, implication, universal quantification, and function
terms fall back to unrestricted candidates where needed. The canvas labels a
reduced candidate set and gives the skipped count; zero candidates yield an empty
extension. Unit tests compare pruned and exhaustive answers across small models.

## Related

- [Model data](fol-data.md), [parser](parser.md), [chapter apps](README.md).
