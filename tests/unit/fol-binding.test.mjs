import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFOL } from '../../assets/js/logic/fol-parser.js';
import { bindingTokens } from '../../assets/js/logic/fol-binding.js';
test('binding arrows respect shadowing, free occurrences and variables in terms',()=>{
  const {tokens,quantifiers,free}=bindingTokens(parseFOL('(Human(x) ∧ ∃x (Human(x) ∧ ∀x motherOf(x) = x))'));
  assert.equal(free.length,1);
  assert.deepEqual(quantifiers.map(q=>tokens.filter(t=>t.binder===q.id).length),[1,2]);
  assert.equal(tokens.map(t=>t.text).join(''),'(Human(x) ∧ ∃x (Human(x) ∧ ∀x motherOf(x) = x))');
  const vacuous=bindingTokens(parseFOL('∀x Human(y)'));assert.equal(vacuous.tokens.filter(t=>t.binder===vacuous.quantifiers[0].id).length,0);
});
test('a quantifier records where its scope ends',()=>{
  const {tokens,quantifiers}=bindingTokens(parseFOL('∀x (Human(x) → ∃y (Human(y) ∧ motherOf(x) = y))'));
  const scope=q=>tokens.slice(q.id+1,q.scopeEnd+1).map(t=>t.text).join('').trim();
  assert.equal(scope(quantifiers[0]),'(Human(x) → ∃y (Human(y) ∧ motherOf(x) = y))');
  assert.equal(scope(quantifiers[1]),'(Human(y) ∧ motherOf(x) = y)');
});
