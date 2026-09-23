---
title: Flashcards
weight: 20
params:
  id: stg-cards
  teaser: 'The concepts of the book on one side, your definition on the other.'
---

# Flashcards

A flashcard has a concept on the front and its definition on the back, and the
rule is that you answer before you turn it over. That makes it a small machine
for active recall, which is why we've built one into the site.

**Read the instructions below before you start.** What you get out of the app
depends on how you use it: why you should write your own cards, and what the
check does and doesn't tell you.

Pick your chapters in the settings, then start a round. Press **F** for full
screen, and set a time per card in the settings if you want to work under a
clock. Nothing you write leaves your browser.

{{< logic-app name="flashcards" >}}

## Writing your own cards

There are two decks. One puts our definition — the glossary entry — on the back
of each card. The other leaves the back blank for you to fill in.

Use the second one. Writing the card sends you back to the chapter to find the
concept, to decide what belongs in the definition and what is commentary, and to
put it in your own words. That is already most of the work, and it's worth more
than the round that follows. You can rewrite a card later, and you should, once
a round shows you that your first attempt was vague.

You can also add concepts of your own, for anything the glossary doesn't cover:
a rule you keep misapplying, a distinction from the lecture, a step of an
algorithm you always forget.

## The check

When you submit an answer, the app compares your text with the back of the card,
ignoring case, punctuation and spacing. Take that as a hint and nothing more. A
correct definition can be worded quite differently from ours, and a nearly
identical wording can still miss the point. Nobody marks your answers and
nothing is graded: you see the back, you decide whether you had it, and that
judgement is part of the exercise.

## The boxes

After you've judged an answer, you file the card in one of three boxes: *keep
practising*, *getting there* and *known*. Cards in the lower boxes come up more
often, so you spend your time on the ones you keep missing. This is the
[Leitner system](https://en.wikipedia.org/wiki/Leitner_system), and it's the
reason a deck beats a list.

The app suggests a box — one up if your wording matched, back to the first if it
didn't — and you can put the card wherever you think it belongs instead.

## Saving your cards

{{< callout type="warning" title="The cards live in this browser only" >}}
There's no account and no server. Your cards are stored in this browser's local
storage, which is deleted when you clear your browsing data, and which doesn't
follow you to another computer.
{{< /callout >}}

In the settings there's a button to save everything to a `.json` file: your
cards, your definitions and the boxes they're in. The same screen loads such a
file back, here or on another machine. Do that at the end of a session where you
wrote cards worth keeping.
