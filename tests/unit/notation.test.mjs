import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFormula, printFormula } from '../../assets/js/logic/parser.js';
import { printConventional, traceShunting, postfix, notationQuestion, checkNotation, PRACTICE_FORMULAS } from '../../assets/js/logic/notation.js';
import { PLAIN_LEVELS } from '../../assets/js/apps/formula-builder.js';
const atom = label => ({ label, children: [] });
const branch = (label, ...children) => ({ label, children });
const atoms = ['p', 'q', 'r'].map(atom);
function examples() {
  const small = [...atoms, ...atoms.map(a => branch('¬', a))];
  for (const op of ['∧', '∨', '→', '↔']) for(const a of atoms) for(const b of atoms) small.push(branch(op,a,b));
  const all = [...small];
  for (const a of small) {
    all.push(branch('¬',a));
    for (const b of small) for (const op of ['∧','∨','→','↔']) all.push(branch(op,a,b));
  }
  return all;
}
test('minimal conventional printing preserves every generated tree and every bracket is necessary', () => {
  for (const tree of examples()) {
    const full = printFormula(tree), text = printConventional(tree);
    assert.equal(printFormula(parseFormula(text, {mode:'conventional'})),full,text);
    const stack = [];
    for(let i=0;i<text.length;i++) {
      if(text[i]==='(') stack.push(i);
      if(text[i]===')') {
        const start=stack.pop(), less=text.slice(0,start)+text.slice(start+1,i)+text.slice(i+1);
        let parsed=null; try {parsed=printFormula(parseFormula(less,{mode:'conventional'}));} catch {}
        assert.notEqual(parsed,full,`Redundant brackets in ${text}`);
      }
    }
  }
});
test('shunting-yard output agrees with independent AST postorder, including grouping and negation', () => {
  for(const tree of examples()) for(const text of [printFormula(tree),printConventional(tree)]) {
    const steps=traceShunting(text), end=steps.at(-1);
    assert.deepEqual(end.output,postfix(tree),text);
    assert.deepEqual(end.stack,[]); assert.deepEqual(end.input,[]);
    assert.deepEqual(steps[0].output,[]); assert.deepEqual(steps[0].stack,[]);
  }
  for (const text of ['', 'p q', 'p¬q','p∧','(p','p)','p ↔ q ↔ r','¬','()']) assert.throws(()=>traceShunting(text));
});
test('notation marking accepts spelling variants but rejects changed structure and redundant brackets', () => {
  for(const direction of ['full','conventional']) for(let i=0;i<PRACTICE_FORMULAS.length;i++) {
    const q=notationQuestion(i,direction);
    assert.equal(checkNotation(q.answer,q,direction).correct,true);
    assert.equal(checkNotation(q.answer.replace(/ /g,''),q,direction).correct,true);
    assert.equal(checkNotation('p',q,direction).correct,false);
  }
  const q=notationQuestion(0,'conventional');
  assert.equal(checkNotation('\\neg p \\land q',q,'conventional').correct,true);
  assert.equal(checkNotation('(¬p ∧ q)',q,'conventional').correct,false);
  assert.equal(checkNotation('q ∧ ¬p',q,'conventional').correct,false);
});
test('all twelve plain builder targets use only unsubscripted p, q and r', () => {
  assert.equal(PLAIN_LEVELS.length,12);
  for(const text of PLAIN_LEVELS) { assert.doesNotMatch(text,/[₀-₉]/); assert.equal(printFormula(parseFormula(text)),text); }
});

import { readFileSync } from 'node:fs';
const exercise = readFileSync(new URL('../../content/exercises/formal-languages/index.md', import.meta.url), 'utf8');
test('the four printed parsing answers reconstruct exactly the requested formulas', () => {
  const section = exercise.split('# Parsing {.solved}')[1].split('# Adding and removing brackets')[0];
  const formulas = [...section.matchAll(/^\d\. \$(.*)\$/gm)].map(m=>m[1]);
  const trees = [...section.matchAll(/{{< syntax-tree[^\n]*>}}\n(.*?)\n{{< \/syntax-tree >}}/gs)].map(m=>JSON.parse(m[1]));
  assert.equal(formulas.length,4); assert.equal(trees.length,4);
  const withChildren = tree => ({ ...tree, children: (tree.children ?? []).map(withChildren) });
  trees.forEach((tree,i)=>assert.equal(printFormula(withChildren(tree)),formulas[i]));
});
test('treasure solutions have the requested truth conditions on all sixteen assignments', () => {
  const formulas = ['q ∧ ¬p ∧ ¬r ∧ ¬s', '(p ∨ q ∨ r ∨ s) ∧ ¬(p ∧ q) ∧ ¬(p ∧ r) ∧ ¬(p ∧ s) ∧ ¬(q ∧ r) ∧ ¬(q ∧ s) ∧ ¬(r ∧ s)', '¬s → (p ∧ ¬r)', 'q → ¬s', '(q ∨ s) ↔ ¬p', '¬(p ∨ q ∨ r ∨ s)', 'p ∨ q ∨ r ∨ s', 'p ∧ q ∧ r ∧ s'];
  const solution = exercise.split('## Solution {.solution #knowledge-representationSolution}')[1].split('# Knowledge extraction')[0].replace(/\s+/g,'');
  for (const formula of formulas) assert.ok(solution.includes(formula.replace(/\s+/g,'')), formula);
  const evaluate = (node,v) => {
    if(!node.children.length) return v[node.label];
    const [a,b]=node.children.map(c=>evaluate(c,v));
    return ({'¬':()=>!a,'∧':()=>a&&b,'∨':()=>a||b,'→':()=>!a||b,'↔':()=>a===b})[node.label]();
  };
  for(let mask=0;mask<16;mask++) {
    const [p,q,r,s]=[0,1,2,3].map(bit=>Boolean(mask&(1<<bit)));
    const v={p,q,r,'p₁':s}, count=[p,q,r,s].filter(Boolean).length;
    const expected=[q&&!p&&!r&&!s,count===1,s||(p&&!r),!q||!s,(q||s)===!p,count===0,count>0,count===4];
    formulas.forEach((f,i)=>assert.equal(evaluate(parseFormula(f.replaceAll('s','p₁'),{mode:'conventional'}),v),expected[i],`${i+1}: ${mask}`));
  }
});
