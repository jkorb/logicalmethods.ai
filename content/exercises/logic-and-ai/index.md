---
title: Logic and AI
subtitle: test
locked: true
author: Johannes Korbmacher
weight: 10
params: 
  id: exc-laa
---

# Definitions

_Note_: A definition needs to fully explain the meaning of a concept. This is
typically done by saying under which precise conditions the concept applies.
That is, the answer should have the form like "A valid inference is an inference
such that..." or "An inference is valid just in case ...".

## a.) Inference

Give a definition of inference. Include examples (where your definition applies)
and non-examples (where it does not). Make sure to explain why your definition
applies or not.

## b.) Validity {.homework}

Give a definition of deductive and inductive inference. Include examples 
and non-examples with explanations. 

# Indicators { .solved }

Give at least 5 additional examples of:

## a.)  

premise indicators,

## b.) 

inference indicators.

## Solution {#indicatorsSolution .solution}

a.) Since, because, since, for, whereas, as.

b.) It follows that, thus, hence, consequently, we know that.

# Validity { .solved }

Which of the following inferences is valid? Specify whether the inference is
deductively or inductively valid.

## a.) 

Every attempt so far has failed. So the next attempt will also fail.

## b.) 

Well, I didn’t not cause the bug. So, I caused the bug.

## c.) 

If you did _that_, pigs can fly. So, you didn't do it.

## d.)

All software has bugs. So, this software has bugs, too.

## e.)

A thinking computer is not a computer anymore. So it's impossible to teach a
computer how to think.

## Solution {#validitySolution .solution}

**a.)** This argument is deductively _in_valid: it's possible that all attempts have failed but the next one succeeds. The argument _may_ be inductively valid if, for example, there were sufficiently many previous attempts, and we tried all different angles.

**b.)** This argument is deductively valid: not not doing something is the same as doing it. 

**c.)** Without any additional premises the argument is not deductively valid, since it is logically possible that you did it and pigs fly. One might argue that the argument is inductively valid given the probabilistic information we already have available, viz. the probability of pigs flying is low.

**d.)** This inference is deductively valid: if everything is so and so, any thing you can talk about also is so and so.

**e.)** An argument could be made that the argument is deductively valid: if a thinking computer is not a computer, then there cannot be a thinking computer, since this would lead to a contradiction (something which both is and isn't a computer). 

# Deductive and inductive inference

Provide an argument that every deductively valid inference is also
inductively valid. Does the converse also hold?

# Thinking, Fast and Slow 

Give at least 3 new examples of: 

## a.)

System 1

## b.)

System 2

# Research { .research }

_Note_: These questions require you to do your own research, using reliable
academic sources. You need to reference your sources!

## Decidability 

Are _all_ logical systems undecidable?

## Symbolic AI { .homework }

Give 2 examples of existing expert systems, one that "failed" and one that's
still in use today. Explain why the first one failed.

# Discussion {.discussion}

_Note_: The following questions require argumentative writing, i.e. you're asked
to take an informed view on the question, clearly state your position, and the
reasons for it.

## a.) Logic and system 2

Is all logical thinking system 2 thinking?

## b.) Minds and machines { .homework }

Does Gödel's theorem show that we cannot build a logic-based AGI?
