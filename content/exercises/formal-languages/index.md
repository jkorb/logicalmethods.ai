---
title: Formal languages
author: Johannes Korbmacher
weight: 20
locked: false
params: 
  id: exc-for
  math: true
---

# Ambiguity

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

# Over-expressiveness

Consider the following inference:

{{< img src="img/presupposition.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="550px">}}

The inference is deductively invalid. Show this by providing a scenario in which
the premise is true and the conclusion isn't. Explain how the
over-expressiveness of natural language is responsible for the inference seeming
to be valid.

# Sets 

Describe the following sets using set notation:

1. the set containing no object whatsoever—the so-called _empty_ set

2. the set containing {{< logo >}}, Utrecht University, and the set containing
{{< logo >}} and nothing else.

3. the set of all even numbers between 1 and 10

4. the set of all even numbers 

5. the set of all non-empty sets that contain only the numbers 1, 2, and 3

# Parsing

Parse the following formulas according to the grammar of propositional logic.
You can either do this by giving the rewrite sequence or the parsing tree.

+ $(\neg p\to \neg p)$

+ $(p\leftrightarrow (\neg r\land q))$

+ $((q\land s)\to (p\lor r))$

+ $(((p\land q)\lor (r\land s))\land \neg ((p\land q\land r\land s)))$

# Polish notation

In the lesson on formal languages, we explained the need for parentheses in
order to avoid ambiguity in the language for propositional logic. 

But it turns out that there's another way, which is known as [Polish notation](https://en.wikipedia.org/wiki/Polish_notation),
in honor of the Polish logician [Jan
Łukasiewicz](https://en.wikipedia.org/wiki/Jan_%C5%81ukasiewicz), who pioneered
it.

We'll look at a simple proposition language in Polish notation, with the
following alphabet:

{{< excalifont display=true >}}Σ = { p, q, r, N, K, A, C, B }{{< /excalifont >}}

The letters {{<excalifont>}}p,q,r{{</excalifont>}} are propositional variables,
and {{<excalifont>}}N{{</excalifont>}} stands for negation {{< img
src="img/negation.png" class="inert-img" height="18px" style="vertical-align: middle;" >}}, {{<excalifont>}}K{{</excalifont>}} for conjunction  {{< img
src="img/conjunction.png" class="inert-img" height="18px" style="vertical-align: middle;" >}}, {{<excalifont>}}K{{</excalifont>}} for disjunction {{< img
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

# Knowledge representation

{{< logo >}}&nbsp; has taken up {{< abbr title="state-sanctioned piracy, nothing illegal going on here...">}}privateering{{</abbr>}}. Now, he's got a treasure of numerous Bitcoin, rare computer chips, and Alan Turing's old {{< abbr title="knowledge base">}}KB{{< /abbr >}}.

{{< img src="img/ai_piracy.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="550px">}}

{{< logo >}}&nbsp; hid the treasure on some remote disk-world and now he's trying to
write instructions on how to find the treasure. Since he's an AI system, he
does so using propositional logic.

First, he divided the disk-world into 4 quadrants, indicating in the following coordinate system: 

{{< img src="img/map.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="550px">}}

He then devised a formal language with propositional variables {{< excalifont >}}T(i,j){{</excalifont>}} to say that the treasure is at coordinate {{< excalifont >}}(i,j){{</excalifont>}} with the first component being the {{<excalifont>}}x{{</excalifont>}}-axis and the second the {{<excalifont>}}y{{</excalifont>}}-axis.

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


# Knowledge extraction 

You arrive at an uninhabited planet and find an old space rover that some
ancient civilization, which still used expert systems for AI, used to explore
the planet. 

{{< img src="img/rover.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="750px">}}

You inspect its {{< abbr title="knowledge base" >}}KB{{</abbr>}} and find the
following:

{{< img src="img/rover_kb.png" class="rounded mx-auto my-4 d-block inert-img img-fluid" width="750px">}}

Explain these instructions in natural language. Can you tell why the robot shut
down?

# Research

Can the grammar of _every_ formal language be given by a BNF? If so, explain
why, if not give a counterexample and explain why it is, indeed, a
counterexample.
