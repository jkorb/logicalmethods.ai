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
