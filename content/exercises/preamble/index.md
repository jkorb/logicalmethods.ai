---
title: Preamble
author: Johannes Korbmacher
locked: false
weight: 1
params: 
  id: exc-latex
---

# Overleaf

- Go to <https://www.overleaf.com/> and make an account (if you don't have one already).

- Read through the tutorial [here](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes).

# Create project

- Set up a new (blank) project in your Overleaf. 

- Give it a suitable project name, like "Assignments logical methods".

- Share that project with at least one of your fellow students.

- Use `main.tex` to typeset the exercise below.

- Create at least one more `.tex` file in the project and typeset it.

# LaTeX gymnastics {#latex-gymnastics .solved}

Use the [LaTeX cheat sheet](/textbook/notation/#latex-cheat-sheet) for the
book's symbols.

Typeset the following in LaTeX. Use the tutorial and
[detexify](https://detexify.kirelabs.org/classify.html) to look up unfamiliar
commands. The fractions may be written with a horizontal fraction bar.

- $0 ∈ ℕ$, but $ω ∉ ℕ$ (here $ω$ is the first infinite ordinal).
- $ℕ = {0, 1, 2, …}$
- $e<sup>iπ</sup> + 1 = 0$
- $1/2 + 3/4 = 5/4$
- $f : ℝ → ℝ$, $x ↦ x + 2$
- $1 ≠ 0$
- $(x<sub>i</sub>)<sub>i ∈ ℕ</sub> = (x₀, x₁, x₂, …)$
- $□φ → φ$
- $f(x) = ∑<sub>i ∈ I</sub> f<sub>i</sub>(x)<sup>−1/2</sup>$
- The LaTeX logo.
- This is **boldface**, this is *italic*, this is <span style="font-family: sans-serif">sans</span>, and this is `code`.

## Solutions {.solution #latex-gymnasticsSolution}

These examples use `\usepackage{amssymb}` in the preamble. Several commands
have alternatives; the examples below give one answer for each item.

- `$0 \in \mathbb{N}$, but $\omega \notin \mathbb{N}$.`
- `$\mathbb{N} = \{0, 1, 2, \dots\}$`
- `$e^{i\pi} + 1 = 0$`
- `$\frac{1}{2} + \frac{3}{4} = \frac{5}{4}$`
- `$f : \mathbb{R} \to \mathbb{R}$, $x \mapsto x + 2$`
- `$1 \neq 0$`
- `$(x_i)_{i \in \mathbb{N}} = (x_0, x_1, x_2, \dots)$`
- `$\square\phi \to \phi$`
- `$f(x) = \sum_{i \in I} f_i(x)^{-\frac{1}{2}}$`
- `\LaTeX`
- `This is \textbf{boldface}, this is \textit{italic}, this is \textsf{sans}, and this is \texttt{code}.`

# LaTeX speed challenge {#symbol-drill}

How many symbols can you type in a minute? Start on easy and aim for ten
correct answers. Once the commands feel familiar, try combining them on
medium or tackling the longer expressions on hard.

Click the field to start, type the LaTeX for the symbol or expression shown,
and press Enter. Don't include dollar signs. For example, both `\land` and
`\wedge` count for $∧$. Spaces don't affect your score. Shift+Enter skips a
prompt; Escape ends the round.

Easy asks for individual symbols and subscripts. Medium combines symbols
into expressions and adds text formatting. Hard also includes fractions,
superscripts, and symbols such as $ℕ$. Keep the
[cheat sheet](/textbook/notation/#latex-cheat-sheet) handy for practice,
then try a round without looking anything up.

{{< logic-app name="latex-game" title="LaTeX speed challenge" >}}
