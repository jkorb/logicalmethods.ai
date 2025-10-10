---
title: Valid inference
author: Colin Caret, Annefleur de Haan, Johannes Korbmacher
locked: false
weight: 30
params: 
  id: exc-val
  math: true
---

# Material and logical validity {.solved}

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

## Solutions {.solution #material-and-logical-validitySolution}

1. This inference is only materially valid. It's form is something like: $$c's P's are Q, so c is Q.$$ But suppose that $c$ is little Jimmy, his $P$'s are his favorite socks, and $Q$ is being blue. Then the inference becomes clearly invalid: $Little Jimmy's favorite socks are blue, so Jimmy is blue$.

    If you add the premise that children of U.S. citizens are also U.S. citizens, the inference becomes deductively valid.

2. This inference is logically valid. As it has the same form as the Socrates inference.

3. This inference is only materially valid. It's form is something like:

   $$c is not P. Thus c is Q$$

   But if $c$ is little Jimmy, P is hungry, and $Q$ thirsty, the inference becomes: $Little Jimmy is not hungry. So, Little Jimmy is thirsty$, which is clearly invalid.


   We need to add the premise that a sentence is false if and only if it's not
   true as a further premise to make this inference valid. This premise is
   false, for example, in many-valued logic.

4. This inference is only materially valid, as it has the form $c is P. Therefore c is Q$. Most $c$'s, $P$s and $Q$s are counterexamples, but let's take $c$ to be little Jimmy, $P$ having a blue hat, and $Q$ being an adult. The inference becomes: $Little Jimmy has a blue hat. Therefore, he's an adult$.

    We need to add the premise that only thinking things exist.

5. This inference is (interestingly) deductively valid. It is an instance of $"modus tolens"$: $All A's are B's and you're not a B. Therefore, you're not an A$.

# Reasoning mistakes {.solved}

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

## Solution {.solution #reasoning-mistakesSolution}

1. The mistake is to forget that there are other unis in the UK that Mr. Sir
   could have gone to, such as St Andrews for example. In the possibility that
he did, the premise is true (he neither went to Oxford nor Cambridge, but the
conclusion isn't—St Andrews is in Scotland, thus the U.K.).

2. The mistake is to miss that there could be New Yorkers, like little Jimmy, who aren't Yankees fans. So, if we assume that he is from NY but not a Yankees fan, it could still be the case that only New Yorkers are Yankees fans.

3. The inference only ever has a chance of being inductively valid, its not even that. The mistake is that the sampling size, though large, is biased. It could be that East Coast burger joints are biased against vegetarians, while the East Coast ones are more open minded. In such a possible situation, the truth of the premise doesn't make the conclusion likely at all.

4. The mistake is to forget that systems could be hybrid, that is both
   statistics-based and logic-based. So, in a possible situation, where there
are only the two paradigms (statistics and logic-based), but {{<logo>}} is a
hybrid AI system, the premise is true but the conclusion isn't.

5. This is another inductive fallacy, known as the [Gambler's
   fallacy](https://en.wikipedia.org/wiki/Gambler%27s_fallacy). The mistake is
to forget that each spin of the wheel is an independent event, the outcome of
any former spin: the chance remains untouched, it still is 1/2 even in
situations, where the wheel has spun black many, many times. 

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

# Sets {.solved}

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

## Solutions {.solution #setsSolution}

1. {{< img src="img/set_solution_1.png" class="inert-img" height="50px" style="vertical-align: middle;" >}}
2. {{< img src="img/set_solution_2.png" class="inert-img" height="50px" style="vertical-align: middle;" >}} 
3. ${2, 4, 6, 8 }$ or simply ${ n : n is an even integer between 1 and 10 }$
4. ${ }$. This is the _empty_ set again, which has no members, whatsoever.
5. {{< img src="img/set_solution_5.png" class="inert-img" height="80px" style="vertical-align: middle;" >}} 
6. This claim is false. In fact, we have that {{< img src="img/set_solution_6.png" class="inert-img" height="50px" style="vertical-align: middle;" >}} since the only members of the first set, Mr. Sir and little Jimmy, are both members of the second set as well.
7. This claim is true, since both members of the first set—my beer and the number one—are members of the second set. In fact, both sets are the same!
8. This claim is very importantly **false**. The empty set, ${ }$, cannot fail to be a subset of {{< img src="img/set_solution_8.png" class="inert-img" height="40px" style="vertical-align: middle;" >}} or any set for that matter. Because for that to be the case, there would have to be a member of ${ }$, which fails to be a member of {{< img src="img/set_solution_8.png" class="inert-img" height="40px" style="vertical-align: middle;" >}}. But which member of ${ }$ could that be, as there are none.
9. Since both the soda and the beer are sparkling beverages, they are members of the set ${ x : x is a sparkling beverage }$
10. There is a total of 8 subsets. Note that the empty set, ${  }$, is among them, according to number 8.:

    {{< img src="img/set_solution_10.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="350px">}}


# Monotonicity of deductive inference {.solved }

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

## Solutions {.solution #monotonicity-of-deductive-inferenceSolution}

1. Formally, we can state the claim as follows:

   {{< img src="img/monotonicity_claim.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="400px">}}

2. Applying the definition of deductive consequence in terms of subset and intersection, gives us:

   {{< img src="img/monotonicity_set_theory.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

3. To show the theorem, we can proceed as follows:

    - We assume that {{< img src="img/s_subseteq_t.png" class="inert-img"
    height="24px" style="vertical-align: middle;" >}}, since we want to show
    that if this is true, then {{< img src="img/ss_subseteq_t.png"
    class="inert-img" height="30px" style="vertical-align: middle;" >}} is true.

    - To show that {{< img src="img/ss_subseteq_t.png"
    class="inert-img" height="30px" style="vertical-align: middle;" >}}, we think about what a member of {{< img src="img/intersection_s_sprime.png"
    class="inert-img" height="30px" style="vertical-align: middle;" >}} can look like. As we'll see, just by looking at the definition of {{< img src="img/intersection_s_sprime.png"
    class="inert-img" height="30px" style="vertical-align: middle;" >}}, we can see that all elements of this set need to be in $T$.

    - By definition, {{< img src="img/def_cap.png" class="inert-img"
    height="30px" style="vertical-align: middle;" >}}. That means that any
    member of {{< img src="img/intersection_s_sprime.png" class="inert-img"
    height="20px" style="vertical-align: middle;" >}} is both a member of $S$ and of $S'$.

    - But we've assumed that {{< img src="img/s_subseteq_t.png"
    class="inert-img" height="24px" style="vertical-align: middle;" >}}, which
    means that every member of $S$ is a member of $T$. And any member of {{<
    img src="img/intersection_s_sprime.png" class="inert-img" height="30px"
    style="vertical-align: middle;" >}} is a member of $S$. _So_, every member of {{< img src="img/intersection_s_sprime.png"
    class="inert-img" height="30px" style="vertical-align: middle;" >}} is a member of $T$.

    - But that just means that {{< img src="img/ss_subseteq_t.png"
    class="inert-img" height="25px" style="vertical-align: middle;" >}}. So, if
    we assume that {{< img src="img/s_subseteq_t.png" class="inert-img"
    height="25px" style="vertical-align: middle;" >}}, {{< img
    src="img/s_subseteq_t.png" class="inert-img" height="25px"
    style="vertical-align: middle;" >}}, get {{< img
    src="img/ss_subseteq_t.png" class="inert-img" height="25px"
    style="vertical-align: middle;" >}}, which is the content of our theorem.

4. The monotonicity of deductive inference is a {{< abbr title="consequence of, typically easy or straight-forward to derive" >}}corollary{{</abbr>}} of our
theorem. Just interpret $S,S',$ and $T$ as follows:

   {{< img src="img/application.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

   From this observation, our main claim directly follows.

# Failure of inductive monotonicity {.solved}

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

## Solution {#failure-of-inductive-monotonicitySolution .solution}

1. Here's the calculation:
  
    {{< img src="img/confirmation_calculation_1.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="600px">}}

2. In this case, something interesting happens:

    {{< img src="img/failure_prob.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="900px">}}

    Note that the intersection of $[2]$ and $[EVEN] ∩ [>3]$ is _empty_: the result being two is incompatible with being an even result bigger than $3$. This is why the result of the calculation is $0$.


3. The definition of inductive validity requires that for each assignment of
   probabilities, the probability of the conclusion to go _up_ conditional on
the premises. But here's a probability assignment, where the probability of the
conclusion goes _down_: $Pr([2] | [EVEN] ∩ [>3]) = 0$, which is less than
$Pr([2]) = 1/6$. So the inference is inductively invalid.

4. What's going on here is that we've added additional information that
   contradicts our conclusion. That this can happen is characteristic of
inductive inference: we can have evidence, which makes our conclusion more
likely but is not conclusive, in the sense it still allows for the conclusion
to be false. 

    This generalizes to all inductively valid inferences, which are not also
    deductively valid. We can always take information that contradicts our conclusion—if you're hard pressed to find something contradictory, just take the negation of the conclusion—and add it to the premises, and we'll have lowered the conditional probability of the conclusion given these premises to $0$. Whatever the probability of the conclusion was before, if it was at all possible (meaning $≥ 0$), it's now smaller.
