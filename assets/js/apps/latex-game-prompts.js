/* The drill's questions: [what the box shows, the commands accepted, a name for
   screen readers]. The first command is the canonical one, shown back on a
   correct answer.

   Nothing is asked for here unless the book asks for it. The vocabulary is the
   cheat sheet in the notation appendix, the few symbols the chapters use in
   plain prose, and the LaTeX the gymnastics question sets — no wider. A
   first-year reader with no LaTeX before this book can look up every prompt in
   one table, and that is what keeps easy easy.

   This is a table, not behaviour, so it lives apart from the game. Families are
   generated from a template rather than transcribed: one loop gives a dozen
   prompts with no room for the box and the answer to drift apart. Commands the
   site's converter knows need no alternatives listed — marking runs the answer
   through it, so every alias and any spacing already counts.

   What the box shows is markup, not a user string. The tags are <em>, <strong>,
   <code>, <span class=sans>, <sup> and <sub>, and each is the thing drilled. */

const DIGITS = '0123456789';
const SUBSCRIPT = '₀₁₂₃₄₅₆₇₈₉';
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const sub = n => [...String(n)].map(d => SUBSCRIPT[DIGITS.indexOf(d)]).join('');
const spell = n => [...String(n)].map(d => WORDS[DIGITS.indexOf(d)]).join(' ');

/* ==========================================================================
   Easy — one command
   Every row of the cheat sheet, the comparisons the chapters use in prose, and
   an index on an atom, which the cheat sheet teaches in the same breath. That
   is the whole vocabulary: if it is not in that table, it is not in easy.
   ========================================================================== */
const SINGLE = [
  ['¬', ['\\neg'], 'negation'],
  ['∧', ['\\land', '\\wedge'], 'conjunction'],
  ['∨', ['\\lor', '\\vee'], 'disjunction'],
  ['→', ['\\to', '\\rightarrow'], 'conditional'],
  ['↔', ['\\leftrightarrow'], 'equivalence'],
  ['⊥', ['\\bot'], 'falsity'],
  ['⊤', ['\\top'], 'truth'],
  ['∀', ['\\forall'], 'universal quantifier'],
  ['∃', ['\\exists'], 'existential quantifier'],
  ['⊨', ['\\models', '\\vDash'], 'double turnstile'],
  ['⊭', ['\\not\\models', '\\nvDash', '\\not\\vDash'], 'negated double turnstile'],
  ['⊢', ['\\vdash'], 'turnstile'],
  ['⊬', ['\\nvdash', '\\not\\vdash'], 'negated turnstile'],
  ['∴', ['\\therefore'], 'therefore'],
  ['∈', ['\\in'], 'element of'],
  ['∉', ['\\notin'], 'not an element of'],
  ['⊆', ['\\subseteq'], 'subset of'],
  ['∅', ['\\emptyset'], 'empty set'],
  ['∩', ['\\cap'], 'intersection'],
  ['∪', ['\\cup'], 'union'],
  ['Γ', ['\\Gamma'], 'capital gamma'],
  ['Σ', ['\\Sigma'], 'capital sigma'],
  ['Ω', ['\\Omega'], 'capital omega'],
  ['ω', ['\\omega'], 'omega'],
  ['μ', ['\\mu'], 'mu'],
  // not on the cheat sheet, but the chapters use all four in plain prose
  ['≤', ['\\leq', '\\le'], 'less than or equal to'],
  ['≥', ['\\geq', '\\ge'], 'greater than or equal to'],
  ['≠', ['\\neq', '\\ne'], 'not equal to'],
  ['…', ['\\dots', '\\ldots', '\\mathellipsis'], 'and so on, an ellipsis']
];
/* "For subscripts, use an underscore: p_1 gives p₁" — still one command. A few
   variants keep it from feeling like the same card twice; many more would only
   pad the count, since every one of them teaches the same thing. */
for (const letter of ['p', 'q', 'A', 'x']) {
  for (const index of [1, 2, 3, 4]) {
    SINGLE.push([`${letter}${sub(index)}`, [`${letter}_${index}`, `${letter}_{${index}}`],
                 `${letter} subscript ${spell(index)}`]);
  }
}
for (const letter of ['p', 'x']) {
  SINGLE.push([`${letter}ₙ`, [`${letter}_n`, `${letter}_{n}`, `${letter}\\_n`], `${letter} subscript n`]);
}

/* ==========================================================================
   Medium — the same vocabulary, put together
   ========================================================================== */
const TEX = { 'Γ': '\\Gamma', 'Σ': '\\Sigma', 'Ω': '\\Omega', 'ω': '\\omega' };
const SAID = { 'Γ': 'gamma', 'Σ': 'sigma', 'Ω': 'capital omega', 'ω': 'omega' };
const tex = show => TEX[show] ?? show.replace(/([a-zA-Z])([₀-₉]+)/g,
  (_, letter, digits) => `${letter}_${[...digits].map(d => DIGITS[SUBSCRIPT.indexOf(d)]).join('')}`);
const said = show => SAID[show] ?? show.replace(/([₀-₉])/g, d => ` ${WORDS[SUBSCRIPT.indexOf(d)]}`);

const SEQUENCE = [];
const add = (show, answers, name) => { SEQUENCE.push([show, answers, name]); };

// negation
for (const inner of ['p', 'q', 'r', 'A', 'B', 'p₁', 'p₂']) {
  add(`¬${inner}`, [`\\neg ${tex(inner)}`], `not ${said(inner)}`);
}

// one connective between two things
const CONNECTIVE = [['∧', '\\land', 'and'], ['∨', '\\lor', 'or'],
                    ['→', '\\to', 'arrow'], ['↔', '\\leftrightarrow', 'double arrow']];
const OPERANDS = [['p', 'q'], ['q', 'r'], ['p', 'r'], ['A', 'B'],
                  ['B', 'C'], ['p₁', 'p₂'], ['p₂', 'p₃'], ['A', 'p']];
for (const [glyph, command, spoken] of CONNECTIVE) {
  for (const [left, right] of OPERANDS) {
    add(`${left} ${glyph} ${right}`, [`${tex(left)} ${command} ${tex(right)}`],
        `${said(left)} ${spoken} ${said(right)}`);
  }
}

// brackets, where the whole point is getting the scope right
for (const [glyph, command, spoken] of CONNECTIVE) {
  add(`¬(p ${glyph} q)`, [`\\neg(p ${command} q)`], `not, bracket, p ${spoken} q`);
}
add('(p ∧ q) → r', ['(p \\land q) \\to r'], 'bracket p and q, arrow r');
add('p → (q → r)', ['p \\to (q \\to r)'], 'p arrow, bracket q arrow r');
add('(p ∨ q) ∧ ¬r', ['(p \\lor q) \\land \\neg r'], 'bracket p or q, and not r');
add('(p → q) ∧ (q → p)', ['(p \\to q) \\land (q \\to p)'], 'bracket p arrow q, and bracket q arrow p');
add('¬(p ∧ ¬q)', ['\\neg(p \\land \\neg q)'], 'not, bracket, p and not q');
add('p ∨ ¬p', ['p \\lor \\neg p'], 'p or not p');

// claims about formulas, in both the semantic and the proof-theoretic voice
const TURNSTILE = [['⊢', '\\vdash', 'proves'], ['⊨', '\\models', 'entails'],
                   ['⊬', '\\nvdash', 'does not prove'], ['⊭', '\\not\\models', 'does not entail']];
for (const [glyph, command, spoken] of TURNSTILE) {
  for (const [left, right] of [['Γ', 'A'], ['Γ', 'B'], ['Σ', 'C'], ['p', 'q'], ['A', 'B']]) {
    add(`${left} ${glyph} ${right}`, [`${tex(left)} ${command} ${right}`],
        `${said(left)} ${spoken} ${right}`);
  }
}
add('Γ, A ⊢ B', ['\\Gamma, A \\vdash B'], 'gamma comma A proves B');
add('M ⊨ A', ['M \\models A'], 'M models A');
add('M, s ⊨ A', ['M, s \\models A'], 'M comma s models A');
add('⊢ A ∨ ¬A', ['\\vdash A \\lor \\neg A'], 'proves A or not A');
add('p, p → q ∴ q', ['p, p \\to q \\therefore q'], 'p, and p arrow q, therefore q');
add('A ∧ B ∴ A', ['A \\land B \\therefore A'], 'A and B, therefore A');

// quantifiers
for (const [glyph, command, spoken] of [['∀', '\\forall', 'for all'], ['∃', '\\exists', 'there is']]) {
  for (const [variable, predicate] of [['x', 'A'], ['y', 'B']]) {
    add(`${glyph}${variable} ${predicate}(${variable})`,
        [`${command} ${variable} ${predicate}(${variable})`],
        `${spoken} ${variable}, ${predicate} of ${variable}`);
  }
  add(`¬${glyph}x A(x)`, [`\\neg ${command} x A(x)`], `not ${spoken} x, A of x`);
  add(`${glyph}x ¬A(x)`, [`${command} x \\neg A(x)`], `${spoken} x, not A of x`);
}
add('∀x ∃y R(x,y)', ['\\forall x \\exists y R(x,y)'], 'for all x there is a y, R of x y');
add('∃x ∀y R(x,y)', ['\\exists x \\forall y R(x,y)'], 'there is an x for all y, R of x y');
add('∀x (P(x) → Q(x))', ['\\forall x (P(x) \\to Q(x))'], 'for all x, bracket P of x arrow Q of x');
add('∃x (P(x) ∧ Q(x))', ['\\exists x (P(x) \\land Q(x))'], 'there is an x, bracket P of x and Q of x');

// sets, with the symbols the cheat sheet carries
for (const [glyph, command, spoken] of [['∩', '\\cap', 'intersect'], ['∪', '\\cup', 'union'],
                                        ['⊆', '\\subseteq', 'is a subset of']]) {
  for (const [left, right] of [['A', 'B'], ['B', 'C'], ['X', 'Y']]) {
    add(`${left} ${glyph} ${right}`, [`${left} ${command} ${right}`], `${left} ${spoken} ${right}`);
  }
}
add('x ∈ A', ['x \\in A'], 'x is an element of A');
add('y ∈ B', ['y \\in B'], 'y is an element of B');
add('x ∉ A', ['x \\notin A'], 'x is not an element of A');
add('y ∉ B', ['y \\notin B'], 'y is not an element of B');
add('∅ ⊆ A', ['\\emptyset \\subseteq A'], 'the empty set is a subset of A');
add('A ∪ ∅', ['A \\cup \\emptyset'], 'A union the empty set');
add('A ∩ ∅', ['A \\cap \\emptyset'], 'A intersect the empty set');
add('A ∩ B ⊆ C', ['A \\cap B \\subseteq C'], 'A intersect B is a subset of C');
add('(A ∪ B) ∩ C', ['(A \\cup B) \\cap C'], 'bracket A union B, intersect C');
add('x ∈ A ∩ B', ['x \\in A \\cap B'], 'x is an element of A intersect B');

// the Greek the book uses, where it uses it
add('ω ∈ Ω', ['\\omega \\in \\Omega'], 'omega is an element of capital omega');
add('Γ ∪ Σ', ['\\Gamma \\cup \\Sigma'], 'gamma union sigma');
add('Γ ⊆ Σ', ['\\Gamma \\subseteq \\Sigma'], 'gamma is a subset of sigma');
add('μ(A)', ['\\mu(A)'], 'mu of A');
add('p(ω)', ['p(\\omega)'], 'p of omega');

// runs of dots, as the book writes them
add('p₁, …, pₙ', ['p_1, \\dots, p_n'], 'p one to p n');
add('(x₁, x₂, …)', ['(x_1, x_2, \\dots)'], 'the sequence x one, x two, and so on');
add('P₁, …, Pₙ ∴ C', ['P_1, \\dots, P_n \\therefore C'], 'P one to P n, therefore C');
add('p₁₂', ['p_{12}'], 'p subscript twelve');
add('x₁₀', ['x_{10}'], 'x subscript ten');

// the four text commands the gymnastics question asks for
add('<strong>bold</strong>', ['\\textbf{bold}'], 'the word bold, in boldface');
add('<em>italic</em>', ['\\textit{italic}', '\\emph{italic}'], 'the word italic, in italics');
add('<span class="latex-game__sans">sans</span>', ['\\textsf{sans}'], 'the word sans, in a sans-serif face');
add('<code>code</code>', ['\\texttt{code}'], 'the word code, in a typewriter face');

/* ==========================================================================
   Hard extras — the rest of the gymnastics question
   Superscripts, fractions, blackboard bold, and the handful of symbols that
   question sets. Still nothing the book does not ask you to typeset.
   ========================================================================== */
const EXTRA = [
  ['ℕ', ['\\mathbb{N}', '\\mathbb N'], 'the natural numbers, blackboard bold N'],
  ['ℤ', ['\\mathbb{Z}', '\\mathbb Z'], 'the integers, blackboard bold Z'],
  ['ℝ', ['\\mathbb{R}', '\\mathbb R'], 'the reals, blackboard bold R'],
  ['0 ∈ ℕ', ['0 \\in \\mathbb{N}', '0 \\in \\mathbb N'], 'zero is a natural number'],
  ['ω ∉ ℕ', ['\\omega \\notin \\mathbb{N}'], 'omega is not a natural number'],
  ['ℕ ⊆ ℤ', ['\\mathbb{N} \\subseteq \\mathbb{Z}'], 'the naturals are a subset of the integers'],
  ['{0,1,2,…}', ['\\{0,1,2,\\dots\\}', '\\{0,1,2,\\ldots\\}'], 'the set of zero, one, two, and so on'],

  ['½', ['\\frac{1}{2}', '\\frac12'], 'one half, as a fraction'],
  ['⅓', ['\\frac{1}{3}', '\\frac13'], 'one third, as a fraction'],
  ['¾', ['\\frac{3}{4}', '\\frac34'], 'three quarters, as a fraction'],
  ['<sup>a</sup>⁄<sub>b</sub>', ['\\frac{a}{b}'], 'a over b, as a fraction'],

  ['x<sup>2</sup>', ['x^2', 'x^{2}'], 'x squared'],
  ['x<sup>n</sup>', ['x^n', 'x^{n}'], 'x to the power n'],
  ['x<sup>-1</sup>', ['x^{-1}'], 'x to the power minus one'],
  ['2<sup>n</sup>', ['2^n', '2^{n}'], 'two to the power n'],
  ['f(x) = x<sup>2</sup>', ['f(x) = x^2', 'f(x) = x^{2}'], 'f of x equals x squared'],
  ['e<sup>iπ</sup>', ['e^{i\\pi}'], 'e to the power i pi'],
  ['e<sup>iπ</sup> + 1 = 0', ['e^{i\\pi} + 1 = 0'], 'e to the i pi, plus one, equals zero'],
  ['Σ<sup>*</sup>', ['\\Sigma^*', '\\Sigma^{*}'], 'sigma star, all finite strings'],
  ['(x<sub>i</sub>)<sub>i∈ℕ</sub>', ['(x_i)_{i \\in \\mathbb{N}}'], 'the family x i, for i in the naturals'],

  ['π', ['\\pi'], 'pi'],
  ['φ', ['\\phi', '\\varphi'], 'phi'],
  ['σ', ['\\sigma'], 'lowercase sigma'],
  ['α', ['\\alpha'], 'alpha'],
  ['≈', ['\\approx'], 'approximately equal to'],
  ['□', ['\\square'], 'open box, the necessity operator'],
  ['⊃', ['\\supset'], 'horseshoe'],
  ['↦', ['\\mapsto'], 'maps to'],

  ['□φ', ['\\square \\phi', '\\square \\varphi'], 'box phi'],
  ['□φ ⊃ φ', ['\\square \\phi \\supset \\phi'], 'box phi horseshoe phi'],
  ['x ↦ x+2', ['x \\mapsto x+2'], 'x maps to x plus two'],
  ['Aσ', ['A\\sigma'], 'A sigma, a substitution'],
  ['1 ≠ 0', ['1 \\neq 0'], 'one is not equal to zero'],
  ['0 ≤ x ≤ 1', ['0 \\leq x \\leq 1'], 'zero is at most x is at most one'],
  ['⟦A⟧', ['\\llbracket A \\rrbracket'], 'A in semantic brackets'],
  ['L<sup>a</sup>T<sub>e</sub>X', ['\\LaTeX'], 'the LaTeX logo']
];

/* Easy is the cheat sheet, one command at a time. Medium is the same
   vocabulary put together. Hard adds what the gymnastics question asks for and
   mixes all three, so you never know which kind is coming. */
export const POOLS = {
  easy: SINGLE,
  medium: SEQUENCE,
  hard: [...SINGLE, ...SEQUENCE, ...EXTRA]
};
