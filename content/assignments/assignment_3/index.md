---
title: Assignment 3 (due 24/10/2025)
author: Johannes Korbmacher
weight: 30
params: 
  id: ass-2
  math: true
---

Submission via Brightspace in $LaTeX$ generated PDF. GenAI-use not allowed.

# Natural deduction and Lean

Pick one of the following two natural deduction facts:

- ${{< v_dash >}} (p {{< lor >}}{{< neg >}} p)$ <span class="right-justified">(difficulty: medium)</span>
- ${{< v_dash >}} (p {{< to >}}q) {{< lor >}}(q {{< to >}}r)$ <span class="right-justified">(difficulty: hard)</span>

Both formulas are provable without any assumptions.

1. Provide a natural deduction derivation for your chosen fact. (2 points)

2. Verify your proof in Lean. (2 points)

**Notes**:

- Really try to do this by yourself, without the help of the internet or GenAI.
It's easy to find solutions for this derivation online, but finding it yourself is not only incredibly rewarding, it's also an excellent way of learning natural deduction techniques.

- If you want to typeset your derivation in $LateX$, rather than including a picture, you can use the package
[proof.sty](https://www.logicmatters.net/resources/ndexamples/proofsty.html). Simply include `\usepackage{proof}` in the preamble of your document and follow the instructions from the link to typeset your proofs.

- For the Lean code, the easiest way of sharing it is to use the [Lean
playground](https://live.lean-lang.org/) to write your code and once your code
works copy-paste the url into your document. This works because the URL will
look like this `https://live.lean-lang.org/#codez=<alphanumericstring>`, where
the alphanumeric string encodes your code.

- You can use the `\url{<url>}` command in $LaTeX$ to make your code 'clickable' if you have `\usepackage{hyperref}` in your preamble.

# FOL Models

In class, we discussed that the following set of FOL formulas is satisfiable,
but has no finite models:

- ${{< forall >}}x{{< exists >}}y x ≤ y$
- ${{< forall >}}x{{< neg >}} (x ≤ x)$
- ${{< forall >}}x{{< forall >}}y{{< forall >}}z((x ≤ y {{< land >}} y ≤ z) {{<
   to >}}x ≤ z)$

We'll work towards showing this fact in this question:

1. Show that there can't be model of the formulas with just one element. You do
   this by showing that if you had such a model, where the domain contains
$d{{< in >}}D$ as its one and only element, this would lead to a contradiction.
The contradiction, you can derive from the truth-conditions for the formulas. (2 points)

    _Hint_: For this case, you only need to think about the first two formulas.
    Think about what it means for $d₁$ that the first formula is true, then
    involve the second.

2. Next, consider a model with precisely two elements, $d₁, d₂{{< in >}}D$. You
   can arrive at a contradiction as well here, but you need to think about the
third formula. The argument is more involved, though: It starts by thinking
about what the first formula says about the first object and what that means
for the relation between the first and the second object. Then you need to
think about the second object and it's relation to the first. Then you need to
think about the third formula and use the second to arrive at a contradiction.
(2 points)

3. **Bonus**: Can you generalize this argument to a model with $n$ elements
   $d₁, …, dₙ{{< in >}}D$? (2 bonus points)

# FOL and SQL

We return to our country DB. 

1. Which FOL formula corresponds to the following query? 

    {{< sql_logo >}}
    ~~~sql
    SELECT L1.country AS x, L2.country AS y
    FROM LocatedIn AS L1,
         LocatedIn AS L2
    WHERE EXISTS (
      SELECT 1
      FROM LocatedIn AS Z
      WHERE EXISTS (
              SELECT 1
              FROM LocatedIn AS Zx
              WHERE Zx.country = L1.country
                AND Zx.continent = Z.continent
            )
        AND EXISTS (
              SELECT 1
              FROM LocatedIn AS Zy
              WHERE Zy.country = L2.country
                AND Zy.continent = Z.continent
            )
    );
    ~~~

    You can open it under [db-fiddle](https://www.db-fiddle.com/f/bTqC7rED8PrABxDyhN766d/12). (2 points)

2. Formulate a SQL query for the following formula:

    ```
    LanguageOf x dutch {{< land >}} LocatedIn y europe
    ```
    
    Verify your work using db-fiddle. (2 points)
