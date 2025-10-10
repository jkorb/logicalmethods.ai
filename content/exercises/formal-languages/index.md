---
title: Formal languages
author: Johannes Korbmacher
weight: 20
locked: false
params: 
  id: exc-for
  math: true
---

# Ambiguity {.solved}

Which of the following statements in natural language are 
{{< abbr title="i.e. has two or more readings" >}}ambiguous{{< /abbr >}}? If
you find an ambiguous statement, paraphrase the different readings to bring out
the ambiguity. Try to find an inference, whose validity depends on the
ambiguity, in the sense that it's valid under one reading and invalid under the
other.

1. I see his goose.

2. I see her duck.

3. He thanked her children, Alan and Ada. 

4. They greeted their parents, Bob, and Betty. 

5. I see a man with my binoculars.

6. There's the woman with my telescope.

7. A friendly dog walker.

8. I'm happy I'm here, and so is she.

9. The priest married my uncle.

10. They fed her dog food.

## Solution {.solution #ambiguitySolution}

1. This statement is (relatively) unambiguous.

2. There are at least two ways of reading this: 

    - I see her perform the action of ducking (lowering the head or body quickly).

    - I see an animal of the species [duck](https://en.wikipedia.org/wiki/Duck), which belongs to her.

    On the first reading, you might for example infer (deductively) that she is
    now in a crouching position or (inductively) that she tried to avoid getting
    hit by something. On the second reading, you could infer (deductively) that
    she owns an animal. Neither inference is valid on the other reading.

3. Many people consider this ambiguous between:

    - He thanked her two children, called "Alan" and "Ada".

    - He thanked her children, whoever they are, and two people called "Alan" and "Ada".

    On the first reading, you can infer that Alan is her child, while you cannot n the second reading.

4. This statement instead uses the [serial
   comma](https://en.wikipedia.org/wiki/Serial_comma) to avoid the previous
ambiguity.

5. This statement is ambiguous between:

    - I see a man who has my binoculars.

    - I see a man through my binoculars.

    On the first reading, you can infer that the speaker does not currently have their binoculars in their possession, while on the second reading you can.

 6. This statement is (relatively) unambiguous.

 7. This phrase has the following two readings:

    - Someone who walks dogs and is friendly.

    - Someone who walks (only?) friendly dogs.

    On the first reading, you can infer that the person is friendly, on the second you can't.

 8. There are two readings:

    - I am happy that I am here and she is happy that I'm here.

    - I am happy that I'm here and she is also here.

    On the second reading you can, for example, infer that she is here, while on the second one you can't.

 9. This statement is ambiguous between:

    - The priest officiated my uncle's wedding.

    - The priest got married to my uncle.

    On the second reading, you can infer that the priest is now the speakers uncle in law, while on the first one you can't.

 10. Also this statement is ambiguous:

   - They fed her food for dogs

   - They fed food to her dog.

   On the second reading, you can infer that she owns a dog, while on the first one you can't.

# Over-expressiveness {.solved}

Consider the following inference:

{{< img src="img/presupposition.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="550px">}}

The inference is deductively invalid. Show this by providing a scenario in which
the premise is true and the conclusion isn't. Explain how the
over-expressiveness of natural language is responsible for the inference seeming
to be valid.

## Solution {.solution #over-expressivenessSolution}

We don't know whether John smokes or not, but we can consider a situation,
where he never smoked. In such a situation, he never stopped smoking, so the
premise is true. But he's not a smoker, so the conclusion isn't true. This makes the inference invalid.

In natural language, we often convey meaning that goes beyond the literal
meaning of statements, for example by means of
[implicature](https://en.wikipedia.org/wiki/Implicature). In this case, we're
dealing with a seeming
[presupposition](https://en.wikipedia.org/wiki/Presupposition), where the first
statement seems to have the implicit presupposition that John did smoke. This might make the inference seem valid, even though it isn't. 

# Sets {.solved}

Describe the following sets using set notation:

1. the set containing no object whatsoever—the so-called _empty_ set

2. the set containing {{< logo >}}, Utrecht University, and the set containing
{{< logo >}} and nothing else.

3. the set of all even numbers between 1 and 10

4. the set of all even numbers 

5. the set of all non-empty sets that contain only the numbers 1, 2, and 3

## Solution {.solution #setsSolution}

1. ${ }$, with nothing written between the curly brackets. There is also the set-theoretic symbol $∅$.

2. ${ {{< logo >}}, UU, {{{< logo >}}} }$

3. ${ 2, 4, 6, 8 }$ or ${ n : n is an even number between 1 and 10}$

4. ${ n : n is an even natural number }$

5. ${ {1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3} }$ or: $${ x : x is a non-empty set with only member from {1, 2, 3} }$$

# Parsing {.solved}

Parse the following formulas according to the grammar of propositional logic.
You can either do this by giving the rewrite sequence or the parsing tree.

1. {{< img src="img/neg_p_to_neg_q.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}

2. {{< img src="img/fml_2.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}


3. {{< img src="img/fml_3.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}

4. {{< img src="img/fml_4.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}


## Solutions {.solution #parsingSolution}

1. Here's the parse tree:

    {{< img src="img/parsing_tree_1.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="350px">}}

2. Here's the parse tree:

    {{< img src="img/tree_2.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="350px">}}

3. Here's the parse tree:

    {{< img src="img/tree_3.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="350px">}}

4. Here's the parse tree:

    {{< img src="img/tree_4.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="450px">}}


# Polish notation {.solved}

In the lesson on formal languages, we explained the need for parentheses in
order to avoid ambiguity in the language for propositional logic. 

But it turns out that there's another way, which is known as [Polish notation](https://en.wikipedia.org/wiki/Polish_notation),
in honor of the Polish logician [Jan
Łukasiewicz](https://en.wikipedia.org/wiki/Jan_%C5%81ukasiewicz), who pioneered
it.

We'll look at a simple proposition language in Polish notation, with the
following alphabet:

The letters {{<excalifont>}}p,q,r{{</excalifont>}} are propositional variables,
and {{<excalifont>}}N{{</excalifont>}} stands for negation {{< img
src="img/negation.png" class="inert-img" height="18px" style="vertical-align: middle;" >}}, {{<excalifont>}}K{{</excalifont>}} for conjunction  {{< img
src="img/conjunction.png" class="inert-img" height="18px" style="vertical-align: middle;" >}}, {{<excalifont>}}A{{</excalifont>}} for disjunction {{< img
src="img/disjunction.png" class="inert-img" height="18px" style="vertical-align: middle;" >}}, {{<excalifont>}}C{{</excalifont>}} for the conditional {{< img
src="img/conditional.png" class="inert-img" height="18px" style="vertical-align: middle;" >}}, and {{<excalifont>}}B{{</excalifont>}} for the bi-conditional  {{< img
src="img/bi-conditional.png" class="inert-img" height="18px" style="vertical-align: middle;" >}}, 

Polish notation is a _prefix_ notation as compared to the usual _infix_
notation. That is, instead of writing {{< img src="img/formula.png" class="inert-img" height="24px" style="vertical-align: middle;" >}}, for example, we write {{< excalifont >}}CKpCpqNq{{< /excalifont >}}.

1. Determine the grammar of Polish notation both in terms of recursive clauses
   and as a BNF.

2. Determine the corresponding re-write rules and generate the parsing tree for 
{{< excalifont >}}CKpCpqNq{{< /excalifont >}}.

3. Give an argument why {{< excalifont >}}pCpqNqCpr{{< /excalifont >}} is _not_ a
   formula in Polish notation.

4. Go back to the example from the textbook which illustrated the need for
   parentheses when using infix notation and write the corresponding formulas in
   Polish notation. Explain with the example why we no longer need parentheses
in Polish notation.

## Solution {.solution #polish-notationSolution}

1. I'm using $ϕ$ as the variable in the form, rather than $A$ as before to avoid confusion with the symbol for disjunction:

  $$φ ::= p | q | Nφ | Kφφ | Aφφ | Cφφ | Bφφ$$

2. Here are the rewrite rules:

  {{< img src="img/polish_rewrite.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="350px">}}

  And here's the tree:

  {{< img src="img/polish_tree.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="350px">}}

3. $pCpqNqCpr$ can't be a formula in Polish notation since there are only two
   options: either a formula starts with an operator from $N,K,A,C,B$ or it is
a propositional variable. But this formula starts with a propositional variable and then continues. There is no rule, which can generate such a formula, so it isn't one.


4. The formula was {{< img src="img/neg_p_and_q.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}. If we write this in Polish notation, it becomes $NKpq$. But this formula now has a unique reading, given by the following parse tree:


    {{< img src="img/parse_ambi.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="250px">}}

    If we wanted to give it "the other" reading, we would need to write $KNpq$.

# Knowledge representation {.solved}

{{< logo >}}&nbsp; has taken up {{< abbr title="state-sanctioned piracy, nothing illegal going on here...">}}privateering{{</abbr>}}. Now, he's got a treasure of numerous Bitcoin, rare computer chips, and Alan Turing's old {{< abbr title="knowledge base">}}KB{{< /abbr >}}.

{{< img src="img/ai_piracy.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="550px">}}

{{< logo >}}&nbsp; hid the treasure on some remote disk-world and now he's trying to
write instructions on how to find the treasure. Since he's an AI system, he
does so using propositional logic.

First, he divided the disk-world into 4 quadrants, indicating in the following coordinate system: 

{{< img src="img/map.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="550px">}}

He then devised a formal language with propositional variables {{< excalifont >}}T(i,j){{</excalifont>}} to say that the treasure is at coordinate {{< excalifont >}}(<span style="color: #2f9e44;">i</span>,<span style="color: #e03131;">j</span>){{</excalifont>}} with the first component being the {{<excalifont>}}<span style="color: #2f9e44;">x</span>{{</excalifont>}}-axis and the second the {{<excalifont>}}<span style="color: #e03131;">y</span>{{</excalifont>}}-axis.

Correspondingly, the BNF of his language is:

{{< img src="img/bnf_treasure.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="750px">}}


Help {{< logo >}}&nbsp; to represent the following hints about the treasure's location in the resulting language:

1. The treasure is in the upper right quadrant and in none of the other
   quadrants.

2. The treasure is in exactly one quadrant, that is, it is either in the upper
   left, upper right, lower left, or lower right quadrant, but not in any two
   quadrants at the same time.

3. If the treasure is not in the lower right quadrant, then it's in the upper
   left quadrant, but only if it's not in the lower left quadrant.

4. The treasure is only in the upper right quadrant, if it is not in the lower
   right quadrant.

5. The treasure is in any of the right quadrants just in case it is not in the
   upper left quadrant.

6. The treasure is nowhere on the disk-world.

7. The treasure is somewhere on the disk-world.

8. The treasure is everywhere on the disk-world.


## Solution {.solution #knowledge-representationSolution}

1. A straight-forward representation is {{< img src="img/representation1.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}. But an equally valid alternative is: {{< img src="img/representation1a.png" class="inert-img" height="32px" style="vertical-align: middle;" >}}.
2. This one is trickier than it might seem at first. I've attached a paraphrase to facilitate reading:

  {{< img src="img/representation2.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="750px">}}

3. This one has at least two readings in natural language. The most straight-forwardly intended one is {{< img src="img/representation3.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}, which reads as if the treasure is not in the lower right and not in the lower left, then it's in the upper left. But if we take the "only if" parlance seriously, and read the statement as "if the treasure is not in the lower right, then it's only in the upper left, if it's not in the lower left," we get this formula: {{< img src="img/representation3a.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}.
4. This is then just the consequence of the second reading from 3.: {{< img src="img/representation4.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}
5. {{< img src="img/representation5.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}
6. {{< img src="img/representation6.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}
7. A very straight-forward reading is this: {{< img src="img/representation7.png" class="inert-img" height="38px" style="vertical-align: middle;" >}} ("the treasure is not here, not here, not here, and not here"), but an equivalent statement is just the negation of 6.: {{< img src="img/representation7a.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}. 
8. {{< img src="img/representation8.png" class="inert-img" height="38px" style="vertical-align: middle;" >}}

As you can see, in knowledge representation, we have to handle natural language ambiguity, there are often more than one solution, and things that sound easy in natural language, can be hard to formalize.

# Knowledge extraction  {.solved}

You arrive at an uninhabited planet and find an old space rover that some
ancient civilization, which still used expert systems for AI, used to explore
the planet. 

{{< img src="img/rover.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="750px">}}

You inspect its {{< abbr title="knowledge base" >}}KB{{</abbr>}} and find the
following:

{{< img src="img/rover_kb.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="750px">}}

Explain these instructions in natural language. Can you tell why the robot shut
down?

## Solution 

1. If you detect rain, then seek cover.

2. If your battery level is low and you detect sun, then charge your batteries.

3. You detect rain just in case you don't detect sun.

4. If you're charging your batteries and your battery is not charging, then request assistance.

5. If you either detect rain and the battery is low or you detect sun and the battery is not charging, then shut down.

The robot shut down because it's both sunny and rainy, so what its sensors are
telling it is in contradiction to 3., which says that the robot can only ever
detect one of the two. Introducing hidden or unexpected contradictions is a
grave danger in knowledge representation and great care must be taken to avoid
it. This is because in propositional logic, from a contradiction _everything_
follows, which is an issue we'll discuss more later.

# Research

Can the grammar of _every_ formal language be given by a BNF? If so, explain
why, if not give a counterexample and explain why it is, indeed, a
counterexample.
