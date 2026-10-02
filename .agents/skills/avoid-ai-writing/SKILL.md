---
name: avoid-ai-writing
description: Write prose that doesn't read as machine-generated. Use when drafting or editing articles, docs, emails, posts, READMEs, commit messages, or any text a person will read, and when asked to "humanize", de-AI, or check text for AI tells. Based on Wikipedia's "Signs of AI writing" field guide.
---

# Avoid AI writing

Wikipedia editors keep a field guide to the patterns that give away LLM text
(https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing). This skill turns
that guide into writing rules. Follow them when you write, and use the checklist
at the end to revise a draft.

The root problem is regression to the mean. A model reaches for the most
statistically likely phrasing, so specific, unusual facts get smoothed into
generic praise that could describe anything. "Inventor of the first train-coupling
device" becomes "a revolutionary titan of industry." Almost every rule below is a
version of one instruction: **say the specific thing, plainly, and stop.**

## Content

**Don't inflate significance.** Don't tell the reader that something "stands as a
testament to", "plays a pivotal role in", "marks a key turning point", "reflects
broader trends", "sets the stage for", "leaves an indelible mark", or is "deeply
rooted". Don't place a mundane fact inside a larger "evolving landscape" or
"ongoing debate". If something mattered, show it with a fact (a date, a number, a
consequence) and let the reader judge.

**No tacked-on analysis.** Watch for sentences that end in a participle clause
passing judgment on what came before: "..., highlighting its importance",
"..., underscoring the need for", "..., reflecting the region's rich heritage",
"..., ensuring", "..., fostering", "..., contributing to". Delete the clause. If
the point is real, give it its own sentence with evidence behind it.

**No promotional tone.** Avoid travel-brochure and press-release words: *boasts,
vibrant, rich, profound, nestled, in the heart of, groundbreaking, renowned,
showcasing, exemplifies, commitment to, diverse array, natural beauty, seamless,
breathtaking*. Describe things neutrally, even things you admire.

**Don't argue for notability.** Don't list the outlets something was "featured in"
or say it has "garnered significant attention", "independent coverage", or "an
active social media presence". If a source says something, report what it says.

**No vague attributions.** Don't write "experts argue", "observers note",
"industry reports suggest", "some critics say", or "researchers have described".
Name the source or drop the claim. Don't present one source's view as widely
held, and don't put "such as" in front of a list that is actually complete.

**Say how things are connected.** Don't write "X is associated with Y" or "X was
connected to Y" when you know the relationship. Write "X was CEO of Y" or "X
taught at Y".

**No formula ending.** Don't close with a "Challenges" or "Future outlook" section
that opens "Despite its..., X faces several challenges" and ends on vague optimism
("continues to thrive", "poised for growth"). Don't end paragraphs or documents
by restating what you just said ("In summary", "Overall", "In conclusion"). End
when the information ends.

**Don't fill gaps with speculation.** If you don't know something, say nothing or
say plainly that you don't know. Don't write "while specific details are
limited..." and then guess what those details "likely" are. Never mention
training cutoffs or "available sources".

## Word choice

**Watch the AI vocabulary.** Studies have measured these words as heavily
overused in LLM output. Use them only when they are the plainest word available:

> additionally (especially at the start of a sentence), align with, boasts
> (meaning "has"), bolstered, crucial, deep dive, delve, emphasizing, enduring,
> enhance, fostering, garner, highlight (figurative), interplay,
> intricate/intricacies, key (as an adjective), landscape (figurative),
> meticulous/meticulously, pivotal, robust, showcase, tapestry, testament,
> underscore (figurative), valuable, vibrant

Also watch *notably, furthermore, moreover, seamless, leverage, navigate
(figurative), realm, multifaceted, nuanced, comprehensive, holistic, resonate,
elevate, empower, embark, unlock, journey (figurative)*.

Don't just swap in a fancier synonym. That produces the next tell. Rewrite the
sentence so it states a fact.

**Use "is" and "has".** LLMs avoid plain copulas. Write "The gallery is the
association's exhibition space," not "The gallery serves as...". Replace *serves
as, stands as, functions as, acts as, represents, marks, features, offers,
maintains, holds the distinction of being* with *is* or *has* wherever the
meaning survives.

**Prefer plain verbs.** *Wrote* not *authored*, *used* not *utilized*, *moved*
not *relocated*, *tried* not *attempted*, *died* not *passed away*, *start* not
*embark on*.

**Repeat the right word.** If the subject is "the Soviet regime", call it that
again. Don't cycle through "the constraints of state-imposed norms", "the
challenging climate", and "the confines of socialist realism" to avoid repeating
yourself. Elegant variation is a tell.

## Sentence patterns

**Avoid negative parallelisms.** They pretend to correct a misconception nobody
had:
- "It's not just X, it's Y." / "Not only X, but also Y."
- "This isn't X. It's Y." / "Not a mirror, but a portal."
- "No X, no Y, just Z."
- "Rather than X, it Y."

State Y directly. Keep the contrast only when a reader really would assume X.

**Break the rule of three.** LLMs group things in threes by reflex: "fast,
reliable, and scalable"; "drywall, plywood, and other materials"; "clarity,
correction, and critique". List as many items as actually exist. Two is fine. One
is fine.

**Vary rhythm naturally.** Don't stack sentences of the same length and shape,
and don't end sections on a punchy aphorism ("And that makes all the
difference.").

**Use em dashes sparingly.** One now and then is fine. Several per paragraph,
especially to set up a dramatic reveal ("the answer is simple — speed"), reads as
AI. Use commas, parentheses, colons, or a new sentence.

**Hedges and superlatives are fine when they are true.** Human writers say
"perhaps", "very", "tends to", "one of the best", "was the first". Don't sand
these out in pursuit of neutrality. Just don't stack hedges ("could potentially
possibly").

## Formatting

Match the medium. Prose that people read should look like prose.

- **Don't bold as a reflex.** Bold at most a term being defined, not every key
  phrase, and never in a "key takeaways" pattern.
- **Avoid inline-header lists.** The shape `- **Label:** sentence about label`
  repeated five times is one of the strongest tells. Write a paragraph, or a plain
  list without the bolded labels.
- **Use sentence case in headings** ("Early life and career", not "Early Life
  and Career").
- **Don't over-structure.** No headings that only contain other headings, no
  headings for three-sentence documents, no skipped heading levels, no
  horizontal rules between every section, no title heading repeating the
  document's name.
- **No emoji as bullets or heading decoration.**
- **No tables for two or three facts.** A sentence holds them fine.
- **Straight quotes** (`"` and `'`) unless the target style requires curly ones.
  Never mix the two.
- **Use the target markup.** Don't write Markdown into a wiki, email, or plain
  text field. Never leave citation artifacts (`oaicite`, `contentReference`,
  `turn0search0`, `[cite: 1]`, `【】` brackets) in output.
- **No section summaries** ("Overall, this section showed...").

## Talking to the reader

When the output is a deliverable (an article, a doc, an email body), it must
contain only the deliverable.

- No chatbot framing inside the text: "Certainly!", "Here is a...", "I hope this
  helps", "Let me know if you'd like...", "Would you like me to...".
- No sycophancy: "Great question!", "You're absolutely right!".
- No leftover placeholders like `[Insert source here]` or `[Your Name]`. Fill
  them in or ask for the information.
- No meta-commentary about the rules being followed ("written in a neutral,
  encyclopedic tone", "all information has been preserved").
- No didactic disclaimers: "It's important to note...", "It's worth
  remembering...", "Results may vary". If a caveat matters, state it as a fact.
- No "In this section, we will explore..." signposting. Just start.

## What to aim for

Things that are more common in human writing and worth keeping:

- Concrete, checkable detail: names, numbers, dates, quotes, places.
- Plain *is/has/there is* constructions.
- Short common words over long rare ones.
- Some unevenness: a short paragraph, a sentence fragment, a tangent that
  earns its place.
- Opinions owned by a named person, or by the writer.
- A consistent voice and English variety from start to finish.

Don't overcorrect. Perfect grammar, formal register, correct formatting, and
transition words are not AI tells on their own. The goal is specificity and
plainness, not quirkiness. Don't add fake typos, slang, or forced casualness.

## Revision checklist

Before handing back text, scan for each of these and rewrite what you find:

1. Sentences claiming importance, legacy, or broader significance without a fact
   behind them.
2. Trailing "-ing" clauses that editorialize (*highlighting, underscoring,
   reflecting, ensuring, fostering, showcasing*).
3. Words from the AI vocabulary list above.
4. *Serves as / stands as / represents / boasts* where *is / has* works.
5. "Not X, but Y" and "not only... but also" constructions.
6. Lists of exactly three that could be two or four.
7. Unnamed "experts", "critics", or "observers".
8. Promotional adjectives (*vibrant, rich, renowned, nestled, groundbreaking*).
9. A "challenges / future outlook" ending, or a closing summary.
10. More than one or two em dashes in a paragraph.
11. Bolded inline-header lists, excess bold, emoji, Title Case headings,
    unnecessary tables.
12. Chatbot phrases, disclaimers, placeholders, or citation artifacts.

Ask of each sentence: could this sentence appear unchanged in an article about a
different subject? If yes, it's filler. Make it specific or cut it.

## Example

Before:

> Nestled in the heart of the valley, Millbrook stands as a vibrant testament to
> the region's rich agricultural heritage. The town boasts a diverse array of
> local businesses, fostering a strong sense of community. It's not just a place
> to live — it's a way of life. Despite its charm, Millbrook faces several
> challenges, including population decline and limited infrastructure. However,
> ongoing initiatives are poised to shape its future.

After:

> Millbrook is a town of about 4,200 people in the Sauk Valley. Most of its
> economy depends on dairy farming and a cheese plant that opened in 1931. The
> population has fallen by about a fifth since 1990, and the county voted in 2023
> to fund a new water main after two winters of pipe failures.

The rewrite is shorter and has no adjectives of praise, and every sentence says
something checkable. When you don't have the facts to write the "after" version,
ask for them instead of padding.
