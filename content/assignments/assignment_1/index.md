---
title: Assignment 1 (due 09/19/2025)
author: Johannes Korbmacher
locked: false
weight: 10
params: 
  id: ass-1
  math: true
---

Submission via Brightspace in $\LaTeX$ generated PDF. GenAI-use not allowed.

# Logic and AI

1. Give an example of a materially valid deductive inference (which has not
   occurred anywhere in the course yet). Show how it can be transformed into a logically valid inference by adding a premise. (1 point)

2. Give an example of an inductively strong inference (again, not from anywhere
   in the course). Show that it is deductively invalid by describing a
reasoning scenario, where its premises are true but the conclusion isn't. Then provide a (non-formal) argument that the premise nevertheless makes the conclusion (more) likely. (1 point)

3. For each of your examples, explain in one to two paragraphs why
   understanding this kind of inference is important to AI research and
development. (2 points)

# Reverse Polish notation

In the exercises for the chapter on formal languages, you encountered [Polish
notation](https://en.wikipedia.org/wiki/Polish_notation), which gets achieves
unique readability without parentheses. 

For this question, we'll consider a variant of Polish notation known as
[reverse Polish
notation](https://en.wikipedia.org/wiki/Reverse_Polish_notation), which rather
than writing logical operations before their operands in so-called "prefix
notation" of the Polish system, reverse Polish notation writes the operators
_after_ in so-called "postfix notation."

For simplicity, we'll use the ordinary symbols {{< img
src="img/negation.png" class="inert-img" height="18px" style="vertical-align: middle;" >}}, {{< img
src="img/conjunction.png" class="inert-img" height="18px" style="vertical-align: middle;" >}}, {{< img
src="img/disjunction.png" class="inert-img" height="18px" style="vertical-align: middle;" >}}, {{< img
src="img/conditional.png" class="inert-img" height="18px" style="vertical-align: middle;" >}},  {{< img
src="img/bi-conditional.png" class="inert-img" height="18px" style="vertical-align: middle;" >}}
rather than the Polish {{<excalifont>}}N, K, A, C, B{{</excalifont>}} for the logical operators. 

Our alphabet, thus is:

{{< img src="img/rpn_alphabet.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="550px">}}

Note the absence of parentheses.

1. Determine the grammar of reverse Polish notation in BNF. (1 point)

2. Determine the corresponding re-write rules and generate the parsing tree for the formula {{< img
src="img/rpn_formula.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}. (2 points)

3. Give an argument why {{< img
src="img/non_fml.png" class="inert-img" height="38px" style="vertical-align: middle;" >}} isn't a formula in reverse Polish notation. (1 point)

4. A very important parsing algorithm is the so-called [shunting yard
   algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm). This
algorithm can be used to transform formulas from ordinary infix notation into
reverse Polish notation. Here's a quick description of the algorithm:

    - We keep two separate areas, the **output queue** and the **stack**:

        - The queue constructs our re-written formula, step-by-step.
        - The [stack](https://en.wikipedia.org/wiki/Stack_(abstract_data_type))
        is processed first-to-last ("last in, first out" or LIFO). Writing an
        expression at the beginning of the stack is called "pushing onto" the
        stack. Removing an expression from the start of the stack is "pop" it
        off the stack.
    - We go through the symbols of our formula from left to right and apply the following rules to transform the expression:
      1. For a propositional variable, we write it directly to the output queue.
      2. For a left parenthesis {{<excalifont>}}({{</excalifont>}}, we push it onto the stack.
      3. For a right parenthesis {{<excalifont>}}){{</excalifont>}}, we pop operators from the stack to the queue until we either encounter a left parenthesis or the stack is empty. We discard the parenthesis pair.
      4. For a logical operator, we push it onto the stack.
      5. At the end, we pop any remaining operators to the output queue.

    Apply this algorithm step-by-step to transform the infix formula {{< img
src="img/formula_convert.png" class="inert-img" height="40px" style="vertical-align: middle;" >}} into reverse Polish notation. Write step-by-step what the ```QUEUE``` is and what the ```STACK``` is. (2 points)

# Transitivity of deductive inference

In the exercises for the chapter on valid inference, we showed that deductive
inference is monotone, that is, adding additional premises preserves validity.

For this question, you'll show that valid deductive inference is _transitive_.
That is, you'll show that if the inference from
{{<excalifont>}}P{{</excalifont>}} to {{<excalifont>}}Q{{</excalifont>}} is
deductively valid and the inference from {{<excalifont>}}Q{{</excalifont>}} to
{{<excalifont>}}C{{</excalifont>}} is valid, then the inference from
{{<excalifont>}}P{{</excalifont>}} to {{<excalifont>}}C{{</excalifont>}} is
valid.

1. Formally state the property of transitivity using the symbol {{< img src="img/models.png" class="inert-img" height="30px" style="vertical-align: middle;" >}}. (1 point)

2. Apply the definition of {{< img src="img/models.png" class="inert-img"
   height="30px" style="vertical-align: middle;" >}} in terms of the
propositions {{<excalifont>}}[P], [Q]{{</excalifont>}}, and {{<excalifont>}}[C]{{</excalifont>}}, the operation {{< img src="img/cap.png"
class="inert-img" height="30px" style="vertical-align: middle;" >}}, and
relation {{< img src="img/subseteq.png" class="inert-img" height="30px"
style="vertical-align: middle;" >}} to transform the claim it into a set
theoretic claim. (1 point)

3. Suppose that {{<excalifont>}}S, T{{</excalifont>}}, and {{<excalifont>}}U{{</excalifont>}} are arbitrary sets. Show
   the following set-theoretic {{<excalifont>}}<strong>Theorem</strong>{{</excalifont>}}:

   {{< img src="img/theorem.png" class="rounded mx-auto d-block inert-img img-fluid my-4" width="400px">}}

   _Hint_: Apply the definition of 
      {{< img src="img/subseteq.png" class="inert-img" height="30px" style="vertical-align: middle;" >}} and reason "step-by-step":
   
     - {{< img src="img/def_subseteq.png" class="inert-img" height="25px" style="vertical-align: middle;" >}} 
     - {{< img src="img/def_subseteq_1.png" class="inert-img" height="30px" style="vertical-align: middle;" >}} 
      - Assume you have an arbitrary member of {{<excalifont>}}S{{</excalifont>}}, why must it be a member of {{<excalifont>}}U{{</excalifont>}}?


      (2 points)


4. Conclude that the transitivity property holds. (1 point)


