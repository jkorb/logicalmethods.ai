---
title: Notation
author: Johannes Korbmacher
weight: 130
locked: false
params:
  appendix: A
  id: txt-notation
---

# Notation

To type symbols in the apps, go to the [LaTeX cheat sheet](#latex-cheat-sheet).

Use this table to look up a symbol or read an expression. Related entries
sit together: sets and strings first, then formulas,
models and proofs, and finally uncertainty and learning. Linked terms open the
[glossary](/textbook/glossary/).

$A$, $B$, and $C$ stand for formulas; $Γ$ (capital gamma) stands for a set of
assumptions.

<div class="notation-reference">

| Notation | Reading and meaning |
| --- | --- |
| <span id="objects-sets-and-quantifiers"></span>$x ∈ S$, $x ∉ S$ | $x$ is, or is not, a member of the {{< term "set" "set" >}} $S$. |
| $S ⊆ T$ | $S$ is a subset of $T$: every member of $S$ belongs to $T$. Equality is allowed. |
| $∅$ | The empty set: a set with no members. |
| $S ∩ T$ | The intersection: members common to $S$ and $T$. |
| $S ∪ T$ | The union: members of $S$ or $T$, including those in both. |
| $Σ$, $Σ*$ | An {{< term "alphabet" "alphabet" >}} and the set of all finite strings over it, including the empty string. See {{< term "formal-language" "formal language" >}}. |
| <span id="formulas-and-reasoning"></span>$p₁$, $p₂$, … | {{< term "propositional-variable" "Propositional variables" >}}; the subscripts distinguish them. |
| $¬A$ | Not $A$ ({{< term "negation" "negation" >}}). |
| $A ∧ B$ | $A$ and $B$ ({{< term "conjunction" "conjunction" >}}). |
| $A ∨ B$ | $A$ or $B$, including both ({{< term "disjunction" "disjunction" >}}). |
| $A → B$ | If $A$, then $B$ ({{< term "conditional" "conditional" >}}). |
| $A ↔ B$ | $A$ if and only if $B$ ({{< term "equivalence" "equivalence" >}}). |
| $⊥$, $⊤$ | Falsity and truth constants; in classical logic, always false and always true, respectively. See {{< term "contradiction" "contradiction" >}} and {{< term "tautology" "tautology" >}}. |
| $∀x A(x)$ | For every object $x$ in the domain, $A(x)$ ({{< term "universal-quantifier" "universal quantifier" >}}). |
| $∃x A(x)$ | For some object $x$ in the domain, $A(x)$ ({{< term "existential-quantifier" "existential quantifier" >}}). |
| $a = b$ | The terms $a$ and $b$ denote the same object ({{< term "identity" "identity" >}}). |
| $A[x/t]$ | Substitute $t$ for the free occurrences of $x$ in $A$, avoiding variable capture ({{< term "substitution" "substitution" >}}). |
| $Aσ$ | Apply the substitution $σ$ to $A$, as in {{< term "unification" "unification" >}}. |
| $D$ | The {{< term "domain" "domain" >}} of a first-order model: its nonempty set of objects. |
| $v(A)$ | The truth-value of $A$ under the {{< term "valuation" "valuation" >}} $v$. |
| $⟦a⟧$, $⟦R⟧$, $⟦A⟧$ | The interpretation of a name, predicate, or formula; see [semantic brackets](#semantic-brackets) below. |
| $M ⊨ A$ | $A$ is true in model $M$; checking this is {{< term "model-checking" "model checking" >}}. |
| $M, s ⊨ A$ | $A$ is true in $M$ under assignment $s$, which supplies values for {{< term "free-variable" "free variables" >}}. |
| $Γ ⊨ A$ | Every model of all formulas in $Γ$ makes $A$ true ({{< term "entailment" "entailment" >}}). |
| $Γ ⊭ A$ | Some model of all formulas in $Γ$ does not make $A$ true: a {{< term "countermodel" "countermodel" >}}. |
| $Γ ⊢ A$ | There is a proof of $A$ from $Γ$ in the specified calculus ({{< term "derivability" "derivability" >}}). |
| $Γ ⊬ A$ | There is no {{< term "proof" "proof" >}} of $A$ from $Γ$ in the specified calculus. |
| $P₁, …, Pₙ ∴ C$ | Premises $P₁, …, Pₙ$; therefore $C$. Presents an {{< term "inference" "inference" >}} without asserting its validity. |
| <span id="uncertainty-and-learning"></span>$0$, $1$, $ω$ in K3 | False, true, and unknown. Only $1$ is a {{< term "designated-value" "designated value" >}}. |
| $μCold(T)$ | The degree to which temperature $T$ is cold ({{< term "fuzzy-predicate" "fuzzy predicate" >}}). |
| $Ω$, $ω ∈ Ω$ | A sample space and an outcome belonging to it ({{< term "probability" "probability" >}}). |
| $p(ω)$ | The probability mass assigned to outcome $ω$. |
| $Pr(A)$ | The probability of $A$. |
| $Pr(A &#124; B)$ | The {{< term "conditional-probability" "conditional probability" >}} of $A$ given $B$: $Pr(A ∧ B) / Pr(B)$, provided $Pr(B) > 0$. |
| $P₁, …, Pₙ {{< approx >}} C$ | {{< term "inductive-validity" "Inductive validity" >}}: the premises jointly weakly raise the probability of $C$ under every distribution where their conjunction has positive probability. |
| $Cn(K)$ | All logical consequences of the set $K$ ({{< term "deductive-closure" "deductive closure" >}}). |
| $KB + A$ | Expand the knowledge base $KB$ by $A$: $Cn(KB ∪ {A})$ ({{< term "expansion" "expansion" >}}). |
| $KB * A$ | Revise $KB$ in light of $A$ ({{< term "belief-revision" "belief revision" >}}). |

</div>

## Reading the notation

**Formulas, truth, and proofs.** $→$ is a connective *inside* a formula.
$⊨$ and $⊢$ belong to our language *about* formulas: they express semantic
and proof-theoretic claims, respectively. The expression to the left of $⊨$
matters: $M ⊨ A$ concerns one model, while $Γ ⊨ A$ concerns every model of
the assumptions. The symbol $∴$ presents an inference for consideration;
it does not certify validity.

<span id="semantic-brackets"></span>
**Semantic brackets.** Their meaning depends on what they enclose and the
chapter's definition. In first-order logic, $⟦a⟧$ is an object's
{{< term "denotation" "denotation" >}}, $⟦f⟧$ is a function, and $⟦R⟧$ is a
predicate's extension. For formulas, $⟦A⟧$ can be a truth-value or a set of
satisfying valuations. In the first-order database discussion, $⟦A(x)⟧$ is
the set of objects satisfying an open formula; in fuzzy logic, $⟦A⟧$ is a
numerical degree. Check the surrounding definition to see which is intended.

**Uncertainty.** The outcome symbol $ω$ is unrelated to the unknown truth-value
$ω$ in K3. A fuzzy degree of $0.5$ is not automatically a probability of $0.5$:
one measures degree of membership, the other probability. For the book's
inductive-inference symbol, “weakly raise” means
$Pr(C | E) ≥ Pr(C)$, where $E = P₁ ∧ … ∧ Pₙ$. The requirement is imposed
for every distribution with $Pr(E) > 0$; it does not require a strict increase.

## LaTeX cheat sheet {#latex-cheat-sheet}

### Typing in the apps

In the book's formula inputs, type a backslash `\` followed by a command:
`\neg` turns into $¬$ as you type. You can also paste a whole expression.
Don't include dollar signs (`$`). Ordinary letters and round brackets can be
typed directly; leave a space after a command before the next letter.

| To enter | Type | Meaning |
| --- | --- | --- |
| $¬$ | `\neg` | Not |
| $∧$ | `\land` | And |
| $∨$ | `\lor` | Or |
| $→$ | `\to` | If … then |
| $↔$ | `\leftrightarrow` | If and only if |
| $p₁$ | `p_1` | Variable with a subscript |
| $p₁₂$ | `p_{12}` | Use braces for a longer subscript |

The commands are case-sensitive. Alternatives are `\lnot` for $¬$,
`\wedge` for $∧$, `\vee` for $∨$, and `\rightarrow` for $→$.
You can also copy the symbols themselves into an input.

### Complete examples for the parsing app

Copy an entry from the left column into the
[parsing app](/textbook/formal-languages/#parsing):

| Type or paste | Result |
| --- | --- |
| `\neg p_1` | $¬p₁$ |
| `(p_1 \land p_2)` | $(p₁ ∧ p₂)$ |
| `\neg(p_1 \lor p_2)` | $¬(p₁ ∨ p₂)$ |
| `((p_1 \land p_2) \to \neg p_3)` | $((p₁ ∧ p₂) → ¬p₃)$ |
| `(p_1 \leftrightarrow p_2)` | $(p₁ ↔ p₂)$ |

The parser accepts $p₁$, $p₂$, … and the shorthand $p$, $q$, $r$.
In its fully bracketed mode, every two-place connective needs its own pair
of brackets: use `(p \land q)`, not `p \land q`. Negation needs no extra
pair: `\neg p` is fine. In the formula builder, the input takes a single
variable, such as `p_1`; the operator controls combine formulas for you.

### More symbols

These commands also convert in the apps' formula inputs. A converted symbol
still has to belong to the language of the app: the propositional parser,
for example, accepts neither quantifiers nor set symbols.

| To enter | Type | Meaning |
| --- | --- | --- |
| $⊥$, $⊤$ | `\bot`, `\top` | Falsity, truth |
| $∀$, $∃$ | `\forall`, `\exists` | For every, for some |
| $∈$, $∉$ | `\in`, `\notin` | Member, not a member |
| $⊆$ | `\subseteq` | Subset (possibly equal) |
| $∅$ | `\emptyset` | Empty set |
| $∩$, $∪$ | `\cap`, `\cup` | Intersection, union |
| $⊨$, $⊭$ | `\models`, `\not\models` | Entails, does not entail |
| $⊢$, $⊬$ | `\vdash`, `\nvdash` | Derivable, not derivable |
| $∴$ | `\therefore` | Therefore |
| $Γ$, $Σ$ | `\Gamma`, `\Sigma` | Capital gamma, capital sigma |
| $Ω$, $ω$ | `\Omega`, `\omega` | Capital omega, lowercase omega |
| $μ$ | `\mu` | Lowercase mu |

For the meanings of whole expressions, such as $M ⊨ A$ and $Γ ⊨ A$, see
the symbol lookup above.

### Writing a LaTeX document

In a LaTeX document, put formulas in *math mode* by surrounding them with
dollar signs. For example, write `$\neg(p_1 \land p_2)$` to produce
$¬(p₁ ∧ p₂)$. The dollar signs mark the formula; they aren't displayed.

An underscore introduces a subscript (`p_{12}`); a caret introduces a
superscript (`\Sigma^*`). Braces group the characters in a subscript or
superscript and aren't displayed. Some commands, including `\nvdash` and
`\therefore`, require `\usepackage{amssymb}` in the document's preamble.
For semantic brackets, use `\llbracket` and `\rrbracket` with
`\usepackage{stmaryrd}`. The book's custom inductive-inference symbol has
no standard LaTeX command.

The apps only convert a selection of commands to symbols. They don't process
general LaTeX, including `\sigma`, `\mid`, superscripts, or semantic-bracket
commands. In a LaTeX document, `\sigma` gives $σ$ and `\mid` gives the
vertical bar in $Pr(A | B)$.
