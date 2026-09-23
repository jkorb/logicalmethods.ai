---
title: Learning with LLMs
weight: 10
params:
  id: stg-llms
  teaser: 'What a chatbot is good for while studying, and what to keep for yourself.'
---

# Learning with LLMs

Chatbots are good at explaining things, at any hour and at whatever level you
ask for. They're also very good at producing a finished answer, which is the
part you have to be careful about.

## What not to do

Having someone else do the work for you doesn't help you learn. The same has
always been true of the classmate who hands you their solved exercise sheet.
Most of what an exercise teaches happens while you're stuck: you go back to the
definition, try something that doesn't work, and find out what the definition
was for. If the answer arrives before any of that, you've skipped the lesson and
kept the homework.

Two prompts to stay away from:

{{< sentence >}}
Solve question 3 of this week's exercise sheet.
{{< /sentence >}}

{{< sentence >}}
What's the best way to approach this problem?
{{< /sentence >}}

The first one is obvious. The second looks harmless and is nearly as damaging:
working out which method a question calls for — a truth table, a countermodel, a
derivation, an induction — is a large part of what this course teaches, and it's
what the exam asks you to do. Hand that over, and you can end up following every
step of a solution you would never have found.

And when you're completely stuck, a chatbot is the wrong place to go. Not
knowing what to do means you haven't understood the material well enough yet, so
go back to it: reread the section, work through the example in the chapter,
check the definition you're supposed to be using. Being stuck tells you what to
study.

So think about what you want back before you send a prompt. Explanations,
questions to answer and comments on your own attempt all help you along. The
finished solution doesn't.

## Roles and level

A chatbot has no idea who it's talking to, and it defaults to a mush of
everything it's ever read. Fix that in the prompt. Say who you are, and say who
it should be:

{{< sentence >}}
I'm a first-year AI student, halfway through a course on logic. You're my logic
teacher. Explain what a countermodel is.
{{< /sentence >}}

Then set the level, and vary it:

{{< sentence >}}
Now explain it as if I were in elementary school. Now explain it to a
specialist.
{{< /sentence >}}

Read the three answers next to each other. The elementary one gives you the
picture, the specialist one gives you the machinery, and whatever appears
between them is the material you still have to learn. If the specialist version
is noise to you, you've found the next thing to work on.

## Context

The chatbot also doesn't know which book you're reading. Our notation, our
definitions and our conventions are choices, and other courses make different
ones. Paste the section you're working on, or say which chapter you're in, and
ask it to stay inside that. Otherwise you'll get $⊢$ where we write $⊨$,
connectives you haven't met, and a definition of validity from another
tradition.

## Quizzing

The most useful thing you can do with a chatbot is turn it into a tutor who asks
the questions:

{{< sentence >}}
Here's the chapter I'm studying. Ask me one question at a time about it, wait
for my answer, and tell me what I got wrong. Don't give me the answer until
I've tried.
{{< /sentence >}}

That's active recall with a partner. You can do the same with your own attempts:
write the proof, the parse or the countermodel yourself, then paste it in and
ask where the first mistake is, without being told how to fix it.

## Checking answers

LLMs sound the same whether they're right or wrong, and in logic wrong is easy
to produce and hard to spot: a derivation with one illegal step, a truth table
with a flipped row, a "countermodel" that isn't one.

Logic is a formal subject, so you can check mechanically:

- a countermodel either makes the premises true and the conclusion false or it
  doesn't — use the [truth tables](/tools/truth-tables/) or the
  [Boolean evaluation](/tools/boolean-evaluation/) tool;
- a formula either parses or it doesn't — use the
  [propositional parser](/tools/propositional-parser/);
- a definition either matches ours or it doesn't — look it up in the glossary.

Checking is quick, and it's revision in its own right. What you shouldn't do is
believe an answer because it was fluent.

We use these tools ourselves in making this course; the
[AI disclosure](/ai-disclosure/) says where, and who's responsible for the
result.
