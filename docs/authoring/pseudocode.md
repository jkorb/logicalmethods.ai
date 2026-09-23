# Pseudocode

The first introduction is [Formal Languages, Algorithms and pseudocode](../../content/textbook/formal-languages/index.md#algorithms-and-pseudocode).
Follow its Python-like notation throughout the book. This is pseudocode for
readers, not executable Python; `python` fences provide syntax highlighting.

## Conventions

- Write `def name(inputs):`, four-space indentation, and `return` for the result.
- Use `=` to name or update a result, and `==` to test equality. Do not switch
  to assignment arrows, `:=`, or `procedure` declarations.
- Use `if`, `else`, `for item in items`, and `while condition`, with colons.
  Write `and`, `or`, and `not`, not symbolic programming operators.
- Use descriptive helper calls such as `is_variable(expression)` or
  `add(clauses, new)`. Explain what each unfamiliar helper does nearby,
  including whether it changes a list or returns a new one.
- Avoid object methods (`clauses.append(new)`), classes, type annotations,
  implementation machinery, and unexplained shorthand. Use `empty_list()`
  when an empty list is needed; introduce pairs or other data notation locally.
- Assign one name at a time. Avoid tuple unpacking (`first, second = pair`).
  Use explained helpers such as `first_member(pair)` and `second_member(pair)`
  when the members need separate names.
- Keep the control flow Python-like. Put ordinary-language explanations outside
  the code, or in short `#` comments. Helpers can stand for operations whose
  implementation would distract from the algorithm.

Introduce only the notation needed at that point. Formal Languages explains
`def`, `if`, `=`, and `return`; later chapters briefly explain new notation and
link back. State inputs and outputs, and give the reason the procedure finishes
and produces the right answer. Do not require Python knowledge or claim that
syntax highlighting makes the pseudocode runnable.

## Exercises

When a chapter introduces new pseudocode notation or a new programming idea,
add practice to its exercise sheet in the style of [Formal Languages](../../content/exercises/formal-languages/index.md#pseudocode):
fill-in-the-gap examples, followed by small procedures to trace or write.
Explain the inputs and unfamiliar helpers, include an empty or boundary case,
and ask why a loop finishes where relevant. Supply solutions. The reusable
[pseudocode practice app](apps/exercise-apps.md#pseudocode-practice) supports
chapter-specific decks; practising syntax should not require solving the
chapter's whole algorithm at once.

## Enforcement

`tests/unit/pseudocode.test.mjs`, included in `npm run check`, checks fenced
procedure definitions across textbook chapters and exercises, including
completed gap-exercise decks. It catches wrong fence languages,
assignment arrows, tuple unpacking, non-Python declarations, object-method calls, single `=` in
conditions, and indentation or block-header mistakes. It also exercises the
checker against deliberately incorrect examples. It does not compile pseudocode
or verify its mathematics. Explanations of helpers still need editorial review.

## Related

- [Authoring index](README.md), [chapter standards](chapter-standards.md).
