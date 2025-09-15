---
title: Valid inference
author: Colin Caret, Annefleur de Haan, Johannes Korbmacher
locked: false
weight: 30
params: 
  id: exc-val
  math: true
---

# Material and logical validity

For each of the following inferences, determine whether it is logically or only materially valid:

1. Little Jimmy's parents are U.S. citizens, so he's a U.S. citizen.

2. Every logician knows this proof and little Jimmy is a logician. Therefore little
   Jimmy knows the proof.

3. The sentence "snow is white" is not true. Thus, the sentence is false.

4. I think, therefore I am.

5. Courage requires fear and you're not afraid. So, you're not courageous.

**Show your work!** That is: identify the schematic logical form of each
inference and check whether there are invalid inferences of this form.

For the materially valid inferences, identify a premise you could add to turn
the inference into a logically valid inference.

# Reasoning mistakes

The following inferences contain reasoning mistakes.

1. If you went to Oxford or Cambridge, then you went to university in the UK.
   Mr. Sir neither went to Oxford nor Cambridge, so he didn't go to university
in the UK.

2. Only New Yorkers are Yankees fans and little Jimmy is not a Yankees fan. So,
   little Jimmy is not a New Yorker.

3. I've tried over 10.000 burger places on the East Coast and almost none of
   them had vegetarian options. So, it's unlikely that this burger place on the
West Coast will have any veggie options either.

4. An AI system must be logic-based or statistics-based, and {{< logo >}} is
   logic-based. So, {{< logo >}} is not statistics-based.

5. The roulette wheel spun black 42 times. So, the next time it's more likely to
   spin red.

**Show your work!** That is: apply the criterion of truth-preservation by
showing that there's a hypothetical reasoning situation where the premises are
true and the conclusion isn't.

Does it make a difference whether we take the inference in question to be
inductive or deductive?

# Inferences in LLMs

Log in to your favorite chatbot, be it [ChatGPT](https://chatgpt.com/),
[Claude](https://claude.ai/), [DeepSeek](https://www.deepseek.com/en), or any
other. A free account is fine for this exercise.

If you have access to a [reasoning language
model](https://en.wikipedia.org/wiki/Reasoning_language_model), like
[o4-mini](https://en.wikipedia.org/wiki/OpenAI_o4-mini), DeepSeek-R1, or the
like, use it for this exercise.

1. Write a prompt that requires your chatbot to reason. Here are a few
   strategies for doing so:

   - Write a clear set up with relevant pieces of information. Like (but maybe
   not exactly):

     _Example prompt_:&nbsp;&nbsp;``When I was 10, my sister was twice my age. Now I'm 24.``

   - Clearly ask for the information you want the chatbot to infer:

     _Example prompt_: ``How old is my sister now? Answer with a number.``

   - Explicitly ask the chatbot to think "step by step".

     _Example prompt_:&nbsp;&nbsp;``When determining your answer, think step-by-step.``

     This is called *chain of thought (COT) prompting*.

   - Ask the chatbot _not_ to use tools, such as Python.

     _Example prompt_:&nbsp;&nbsp;``Please don't use tools, such as Python.``

2. Determine whether the resulting reasoning is valid of invalid, material or
   logical, deductive or inductive. 

3. Test how "fragile" these properties are. Can you add additional information
   to your prompt which makes the answer be valid, invalid, material or logical?

   - One strategy that can prompt mistakes is adding "distracting" information
   or to suggest false answers, such as: 

      _Example prompt_:&nbsp;&nbsp;``When I was 10, my sister was twice my age. Now I'm 24. How old is my
    sister now? Think step-by-step without any tools. But the answer is 48,
    right?``

4. Document your work in a file called something like ``chatbot_reasoning_2025-09-15.txt``. Write to different strategies you tried, what the inputs and output where, what you did or didn't like about an answer (scientifically speaking), etc.

5. Finally, evaluate your work. What does this tell you about reasoning in LLMs?

{{<abbr title="Nota bene=note carefully/well" >}}<strong>NB</strong>{{</abbr>}}:

- For this exercise, we explicitly asked you to use {{< abbr title="generative AI" >}}genAI{{</abbr>}}. There are other exercises where we _don't_. This usually means you shouldn't use GenAI for these exercises.

- The benefits and drawbacks of GenAI-use in learning is not very well
understood. It should be clear that just having ChatGPT do your homework will
not help you. But even just having the assistance of GenAI can hurt your
understanding. Sometimes, you just got to do the tough work yourself to get the
reward (understanding).

- Documenting your use of GenAI is good practice (step 4). It allows you to
demonstrate what's your work and what's the contribution of the LLM. But it's
also helpful for your own learning journey, for example, to look back at what
you did and learn from it.

- **Watch out**: In academic contexts, the use of GenAI is a sensitive topic! There
  are contexts, where it is strictly forbidden. For example, when you're supposed
  to demonstrate _your own_ understanding of a topic in an exam, thesis, or the
like. This is a question of academic integrity.

- If you're a university student or academic, make sure you're absolutely clear
  on what the relevant standards are.

If want to know more about prompt engineering, you can check out [Lee Boonstra's](https://www.leeboonstra.dev/) amazing whitepaper, [here](https://www.kaggle.com/whitepaper-prompt-engineering).

# Sets

Calculate the results of the following set theoretic operations:

1. {{< img src="img/set_1.png" class="inert-img" height="100px" style="vertical-align: middle;" >}} 
2. {{< img src="img/set_2.png" class="inert-img" height="100px" style="vertical-align: middle;" >}}
3. {{< img src="img/set_3.png" class="inert-img" height="50px" style="vertical-align: middle;" >}}
4. {{< img src="img/set_4.png" class="inert-img" height="150px" style="vertical-align: middle;" >}}
5. {{< img src="img/set_5.png" class="inert-img" height="100px" style="vertical-align: middle;" >}}

Which of the following claims are true? Explain your answer in terms of the
definition of the subset relation:

6. {{< img src="img/subset_1.png" class="inert-img" height="100px" style="vertical-align: middle;" >}} 
7. {{< img src="img/subset_2.png" class="inert-img" height="75px" style="vertical-align: middle;" >}}
8. {{< img src="img/subset_3.png" class="inert-img" height="150px" style="vertical-align: middle;" >}}
9. {{< img src="img/subset_4.png" class="inert-img" height="100px" style="vertical-align: middle;" >}}

Find all the subsets of the following set:

10. {{< img src="img/set_ex.png" class="inert-img" height="100px" style="vertical-align: middle;" >}}

# Monotonicity of deductive inference

An important fact about deductive inference is that it's *monotone*, which means
that adding further premises to a deductively valid inference can never turn
that inference invalid. In this exercise you will _prove_ this fact using
mathematical reasoning:

1. Formally state the property of monotonicity by writing out the claim that if
   an inference with premises {{< img src="img/pi_premises.png" class="inert-img" height="30px" style="vertical-align: middle;" >}} and conclusion {{<excalifont>}}C{{</excalifont>}} is valid, then the inference with premises {{< img src="img/q_premises.png" class="inert-img" height="30px" style="vertical-align: middle;" >}} and conclusion {{<excalifont>}}C{{</excalifont>}} is valid, where {{<excalifont>}}Q{{</excalifont>}} is any new statement. Use the symbol {{< img src="img/models.png" class="inert-img" height="30px" style="vertical-align: middle;" >}} for this.

2. Apply the definition of {{< img src="img/models.png" class="inert-img"
   height="30px" style="vertical-align: middle;" >}} in terms of the
propositions {{< img src="img/propositions.png" class="inert-img" height="30px"
style="vertical-align: middle;" >}}, the operation {{< img src="img/cap.png"
class="inert-img" height="30px" style="vertical-align: middle;" >}}, and
relation {{< img src="img/subseteq.png" class="inert-img" height="30px"
style="vertical-align: middle;" >}} to transform the claim it into a set
theoretic claim.

3. Suppose that {{<excalifont>}}S,S',T{{</excalifont>}} are arbitrary sets. Show
   the following set-theoretic {{<excalifont>}}<strong>Theorem</strong>{{</excalifont>}}:

   {{< img src="img/monotonicity.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="400px">}}

   _Hint_: Apply the definitions of 
   {{< img src="img/cap.png" class="inert-img" height="30px" style="vertical-align: middle;" >}} and
   {{< img src="img/subseteq.png" class="inert-img" height="30px" style="vertical-align: middle;" >}}, and
   reason step-by-step:

   - {{< img src="img/def_cap.png" class="inert-img" height="30px" style="vertical-align: middle;" >}} 
   - {{< img src="img/def_subseteq.png" class="inert-img" height="25px" style="vertical-align: middle;" >}} 
   - {{< img src="img/def_subseteq_2.png" class="inert-img" height="30px" style="vertical-align: middle;" >}} 
   - Assume that the if-part, {{< img src="img/s_subseteq_t.png" class="inert-img" height="25px" style="vertical-align: middle;" >}},
   holds, try to reason to the then-part, {{< img src="img/ss_subseteq_t.png" class="inert-img" height="25px" style="vertical-align: middle;" >}} .
   - That is, suppose that you have a member of {{< img
   src="img/intersection_s_sprime.png" class="inert-img" height="25px"
   style="vertical-align: middle;" >}}, what can it look like?
   - Use the assumption that {{< img src="img/s_subseteq_t.png" class="inert-img" height="25px" style="vertical-align: middle;" >}},
   what can you say about the members of {{< img
   src="img/intersection_s_sprime.png" class="inert-img" height="25px"
   style="vertical-align: middle;" >}}?

4. Conclude that the monotonicity property holds. 

   _Hint_: Note that {{< img src="img/long_intersect.png" class="inert-img" height="30px" style="vertical-align: middle;" >}}
is a single set.

5. Illustrate the theorem with an example. Take a deductively valid inference and add an
   arbitrary new premise. In natural language, go through the reasoning, which shows that the new
inference is still deductively valid.

# Failure of inductive monotonicity

In contrast to deductive inference, *in*ductive inference is not monotonic. That
is, we can have an inference with premises {{< img src="img/pi_premises.png"
class="inert-img" height="30px" style="vertical-align: middle;" >}} and
conclusion {{<excalifont>}}C{{</excalifont>}} which is inductively valid, but
the inference with premises {{< img src="img/q_premises.png" class="inert-img"
height="30px" style="vertical-align: middle;" >}} and conclusion
{{<excalifont>}}C{{</excalifont>}} is inductively *in*valid.

We'll show this by looking at our die example again. Here are the relevant
probabilities for a fair die:

{{< img src="img/die_setup.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="900px">}}

Note the crucial fact that {{<excalifont>}}P({ })=0{{</excalifont>}}, where
{{<excalifont>}}{ }{{</excalifont>}} is the _empty_ set with no elements, which
corresponds to an impossible situation. The laws of probability theory dictate
that {{<excalifont>}}{ }{{</excalifont>}} has probability 0.

We've also added the proposition {{<excalifont>}}[>3]{{</excalifont>}}, which
states that the outcome is higher than a 3. We use this to give a counterexample
to the monotonicity of inductive inference:

1. In the textbook, we claimed that the inference from
   {{<excalifont>}}EVEN{{</excalifont>}} to {{<excalifont>}}2{{</excalifont>}}
   is inductively valid. Check that this claim conforms with the example by
   calculating and comparing the probabilities {{<excalifont>}}Pr([2] |
     [EVEN]){{</excalifont>}} and {{<excalifont>}}Pr([2]){{</excalifont>}}.

2. Calculate the conditional probability {{<excalifont>}}P([2] | [EVEN] ∩ [>3]){{</excalifont>}}. 

3. Apply the general definition of inductively valid inference to infer that the
   inference from {{<excalifont>}}EVEN{{</excalifont>}} and
   {{<excalifont>}}>3{{</excalifont>}} to the conclusion that
   {{<excalifont>}}2{{</excalifont>}} is inductively *in*valid.

4. What is happening? Interpret the result in general terms by abstracting from
   the case of the die and describing the situation in terms of arbitrary
formulas {{<excalifont>}}A,B,C{{</excalifont>}}. Can you generalize this example
to other inductively valid inferences? Take at least one example and add a
premise following the pattern, such that the inference becomes invalid.
