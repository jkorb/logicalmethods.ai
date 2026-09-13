import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFormula, traceParse, printFormula, tokenize } from '../../assets/js/logic/parser.js';
import { latexToUnicode } from '../../assets/js/apps/latex-input.js';
const shape = n => [n.label, ...n.children.map(shape)];
test('strict grammar preserves negation scope and left/right order', () => {
  assert.deepEqual(shape(parseFormula('¬(p ∧ q)')), ['¬', ['∧', ['p'], ['q']]]);
  assert.deepEqual(shape(parseFormula('(¬p ∧ q)')), ['∧', ['¬', ['p']], ['q']]);
  assert.deepEqual(shape(parseFormula('(¬(p ∨ q) ∧ r)')), ['∧', ['¬', ['∨', ['p'], ['q']]], ['r']]);
  assert.equal(printFormula(parseFormula('(p₁ → ¬p₂)')), '(p₁ → ¬p₂)');
  assert.deepEqual(tokenize('p₁ ∧ p₂'), ['p₁', '∧', 'p₂']);
});
test('strict parser rejects malformed and abbreviated strings', () => {
  for (const input of ['', '()', '(p)', 'p q', 'pq', 'p∧q', '¬p∧q', '(p∧)', '(∧q)', '(p∧q∨r)', '(p∧q', 'p)', 'p₀', '<script>', 'p_1']) {
    assert.throws(() => parseFormula(input), undefined, input);
    assert.equal(traceParse(input).steps.at(-1).state, 'error');
  }
});
test('conventions expand to the intended fully bracketed formula', () => {
  for (const [input, output] of [
    ['¬p ∧ q', '(¬p ∧ q)'], ['p ∨ q ∧ r', '(p ∨ (q ∧ r))'],
    ['p ∧ q ∧ r', '((p ∧ q) ∧ r)'], ['p → q → r', '(p → (q → r))'],
    ['p ↔ q → r', '(p ↔ (q → r))'], ['(p → q) → r', '((p → q) → r)'],
    ['¬(p ∧ q)', '¬(p ∧ q)'], ['((p))', 'p'], ['p ↔ (q ↔ r)', '(p ↔ (q ↔ r))']
  ]) assert.equal(printFormula(parseFormula(input, { mode: 'conventional' })), output);
  for (const input of ['p ↔ q ↔ r', 'p q', '¬', 'p →', '(p ∧ q', '()']) assert.throws(() => parseFormula(input, { mode: 'conventional' }));
});
test('generated strict formulas round trip and have the same conventional tree', () => {
  let formulas = ['p', 'q', 'r', 'p₁'];
  for (let round = 0; round < 3; round++) {
    const previous = formulas.slice(-12);
    formulas.push(...previous.map(f => `¬${f}`));
    for (let i = 0; i < previous.length; i++) for (const op of ['∧', '∨', '→', '↔']) formulas.push(`(${previous[i]} ${op} ${previous[(i + 1) % previous.length]})`);
  }
  for (const formula of formulas) {
    const tree = parseFormula(formula);
    assert.equal(printFormula(tree), formula);
    assert.deepEqual(shape(parseFormula(formula, { mode: 'conventional' })), shape(tree));
  }
});
test('trace snapshots are independent and errors retain partial progress', () => {
  const { steps, ast } = traceParse('¬(p ∧ q)');
  assert.equal(steps[0].tree.label, '?');
  assert.equal(steps[1].tree.label, '¬');
  assert.equal(steps[1].tree.children[0].label, '?');
  assert.equal(steps.at(-1).state, 'success');
  assert.equal(ast.complete, true);
  const failed = traceParse('(p ∧ )');
  assert.equal(failed.ast, null);
  assert.equal(failed.steps.at(-1).tree.children[0].label, 'p');
  assert.match(traceParse('¬'.repeat(130) + 'p').error, /128/);
});
test('author latex aliases, complete-command boundaries, and subscripts', () => {
  assert.equal(latexToUnicode(String.raw`\neg(p\_1 \land q) \leftrightarrow r`), '¬(p₁ ∧ q) ↔ r');
  assert.equal(latexToUnicode(String.raw`\forall \exists \lnot \lor \vee \wedge \to \rightarrow \iff`), '∀ ∃ ¬ ∨ ∨ ∧ → → ↔');
  assert.equal(latexToUnicode(String.raw`\orange \unknown`), String.raw`\orange \unknown`);
});

test('cheat sheet commands and standard numeric subscripts convert', () => {
  assert.equal(latexToUnicode(String.raw`\neg(p_1 \land p_{12})`), '¬(p₁ ∧ p₁₂)');
  assert.equal(latexToUnicode(String.raw`\not\models \models \nvdash \therefore`), '⊭ ⊨ ⊬ ∴');
  assert.equal(latexToUnicode(String.raw`\Gamma \subseteq \emptyset \cap \cup`), 'Γ ⊆ ∅ ∩ ∪');
});
