import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, normalise } from '../../assets/js/apps/formula-builder.js';
import { parseFormula, isAtom } from '../../assets/js/logic/parser.js';

/* A target the builder cannot reach is an unwinnable level, so every one is
   checked against the same grammar the chapter defines. */
test('every level is a formula, spelled the way the builder spells one', () => {
  assert.ok(LEVELS.length >= 10, `only ${LEVELS.length} levels`);
  for (const level of LEVELS) {
    assert.equal(normalise(level), level, `${level} is not in the grammar's own spelling`);
  }
  assert.equal(new Set(LEVELS).size, LEVELS.length, 'a level is repeated');
});

test('the levels are ordered by how much construction they take', () => {
  const steps = formula => {
    const count = node => node.children.length ? 1 + node.children.reduce((n, c) => n + count(c), 0) : 0;
    return count(parseFormula(formula));
  };
  const sizes = LEVELS.map(steps);
  assert.deepEqual(sizes, [...sizes].sort((a, b) => a - b), `out of order: ${sizes}`);
  assert.ok(sizes.at(0) === 1 && sizes.at(-1) >= 5, `range is ${sizes.at(0)} to ${sizes.at(-1)}`);
});

test('every atom a level needs is one the builder accepts', () => {
  const atoms = node => node.children.length ? node.children.flatMap(atoms) : [node.label];
  for (const level of LEVELS) {
    for (const atom of atoms(parseFormula(level))) {
      assert.ok(isAtom(atom), `${level} needs ${atom}, which is not an atom`);
    }
  }
});

test('the chapter demonstrates the formula it asks the reader to build', () => {
  assert.equal(normalise('((p₁ ∧ p₃) → ¬p₂)'), '((p₁ ∧ p₃) → ¬p₂)');
  assert.ok(LEVELS.includes('((p₁ ∧ p₃) → ¬p₂)'), 'the chapter example is not a level');
});
