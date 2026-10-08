# Binding diagrams

`binding-diagram` renders formula text with arrows from quantifiers to their
bound occurrences. Its JSON body has `tokens` (unique `id` and Unicode `text`)
and `bindings` (`from` token ID and a `to` array). Supply an `alt` description
that states the binding structure. Tokens retain selectable text in the formal
font; solid and dashed arrow lanes distinguish nested binders without relying
on color alone. The whole diagram scales with the text column and needs no
JavaScript. Chapter 8 includes ordinary binding and repeated-variable examples.

## Related

- [Annotated symbols](annotated-math.md), [chapter apps](README.md).
