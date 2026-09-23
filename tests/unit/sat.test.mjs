import test from 'node:test';
import assert from 'node:assert/strict';
import { readProblem, truthTable, rewriteTrace, resolutionTrace, tseytinTrace, valuations, flatten, formatFormula, printFormula } from '../../assets/js/logic/sat.js';
import { evaluateTrace, parseBoolean, circuitPreset, evaluateCircuit } from '../../assets/js/logic/boolean.js';
const value = (tree, v) => evaluateTrace(tree, v).at(-1).value;

test('tables distinguish premises from negated conclusions and preserve independent answer cells', () => {
  const valid = truthTable(readProblem('SUN ∨ RAIN, ¬SUN ∴ RAIN'));
  assert.equal(valid.satisfiable, false);
  const invalid = truthTable(readProblem('SUN ∨ RAIN, SUN ∴ ¬RAIN'));
  assert.equal(invalid.rows.filter(r => r.witness).length, 1);
  assert.deepEqual(invalid.rows.find(r => r.witness).valuation, { RAIN: 1, SUN: 1 });
  assert.equal(truthTable(readProblem('p ∨ ¬p')).rows.every(r => r.witness), true);
  assert.equal(truthTable(readProblem('p ∧ ¬p')).satisfiable, false);
  assert.equal(truthTable(readProblem('∴ p ∨ ¬p')).satisfiable, false);
  assert.equal(truthTable(readProblem('p → q')).satisfiable, true);
  assert.throws(() => readProblem('p ∴'), /conclusion/);
  assert.throws(() => truthTable(readProblem('a ∨ b ∨ c ∨ d ∨ e ∨ f ∨ g')), /six variables/);
});
const literal = t => !t.children.length || t.label === '¬' && !t.children[0].children.length;
function checkShape(tree, target) {
  const outer = target === 'CNF' ? '∧' : '∨', inner = target === 'CNF' ? '∨' : '∧';
  assert.ok(flatten(tree, outer).every(t => flatten(t, inner).every(literal)));
}
test('rewriting preserves every row at every step and produces both normal forms', () => {
  const formulas = ['p ↔ q', '¬(p ↔ (q → r))', '¬¬SUN ∨ ¬(RAIN ∨ ¬SUN)', '¬(p ∧ (q ∨ ¬r))', '(p ∧ q) ∨ (r ∧ ¬p)', '(p ∨ q) ∧ (r ∨ ¬p)', 'p ∨ p ∨ q', '¬(p ∨ ¬p)'];
  for (const source of formulas) for (const target of ['CNF', 'DNF']) {
    const { tree, names } = parseBoolean(source), result = rewriteTrace(tree, target);
    assert.equal(result.complete, true); checkShape(result.tree, target);
    for (const v of valuations(names)) for (const step of result.steps) assert.equal(value(step.tree, v), value(tree, v), source);
    assert.equal(rewriteTrace(result.tree, target).steps.length, 1);
  }
  assert.equal(printFormula(rewriteTrace(parseBoolean('(q ∨ p) ∧ (p ∨ q) ∧ p').tree).tree), '(((q ∨ p) ∧ (p ∨ q)) ∧ p)');
});
test('resolution agrees with exhaustive semantics, including all two-variable clause combinations', () => {
  const clauses = ['p', '¬p', 'q', '¬q', 'p ∨ q', 'p ∨ ¬q', '¬p ∨ q', '¬p ∨ ¬q'];
  for (let mask = 1; mask < 256; mask++) {
    const problem = readProblem(clauses.filter((_, i) => mask & (1 << i)).join(','));
    const result = resolutionTrace(problem);
    assert.equal(result.outcome, truthTable(problem).satisfiable ? 'satisfiable' : 'unsatisfiable', mask);
    for (const c of result.clauses.filter(c => c.parents)) {
      const parents = c.parents.map(id => result.clauses[id - 1]);
      for (const v of valuations(problem.names)) {
        const holds = clause => clause.literals.some(t => value(t, v) === 1);
        if (parents.every(holds)) assert.equal(holds(c), true);
      }
    }
  }
  for (const source of ['¬(p ∧ q), p, q', 'p ∨ q, p ∴ ¬q', 'p ∨ ¬p', '¬(p ∨ q) ∨ r, p, ¬r', 'p ∨ q, ¬p ∨ ¬q']) {
    const p = readProblem(source);
    assert.equal(resolutionTrace(p).outcome, truthTable(p).satisfiable ? 'satisfiable' : 'unsatisfiable');
  }
});
test('limits never certify incomplete searches', () => {
  assert.equal(rewriteTrace(parseBoolean('p ∨ (q ∧ r)').tree, 'CNF', {maxSteps: 1}).complete, false);
  assert.equal(resolutionTrace(readProblem('p, ¬p'), { maxClauses: 1 }).outcome, 'unknown');
  assert.equal(resolutionTrace(readProblem('p, ¬p'), { maxPairs: 0 }).outcome, 'unknown');
  assert.equal(resolutionTrace(readProblem('p ∨ (q ∧ r)'), { rewriteOptions: {maxSteps: 1} }).outcome, 'unknown');
});
test('the reused relay circuit implements the NAND specification on all inputs', () => {
  for (const X of [0, 1]) for (const Y of [0, 1]) assert.equal(evaluateCircuit(circuitPreset('nand'), {X,Y}).get('out'), 1-(X&Y));
});

test('inferences become one conjunction and resolution exposes its CNF preparation', () => {
  const p = readProblem('(p ∧ r) ∨ (q ∧ r) ∴ p ∨ q');
  assert.equal(printFormula(p.conjunction), '(((p ∧ r) ∨ (q ∧ r)) ∧ ¬(p ∨ q))');
  const result = resolutionTrace(p);
  assert.equal(result.outcome, 'unsatisfiable');
  assert.ok(result.steps.some(s => s.formula && s.explanation.includes('De Morgan')));
  assert.ok(result.steps.some(s => s.formula && s.explanation.includes('Distribute')));
  const indexed = readProblem('p₁₀ ∨ p₂ ∨ p₁');
  assert.deepEqual(indexed.names, ['p₁', 'p₂', 'p₁₀']);
});

test('Tseytin examples preserve models by extension and restriction', () => {
  const examples = [
    ['¬p', '(¬u ∨ ¬p) ∧ (u ∨ p) ∧ u'],
    ['p ∧ q', '(¬u ∨ p) ∧ (¬u ∨ q) ∧ (u ∨ ¬p ∨ ¬q) ∧ u'],
    ['p ∨ q', '(u ∨ ¬p) ∧ (u ∨ ¬q) ∧ (¬u ∨ p ∨ q) ∧ u'],
    ['(p ∧ q) ∨ r', '(¬u ∨ p) ∧ (¬u ∨ q) ∧ (u ∨ ¬p ∨ ¬q) ∧ (u ∨ r)'],
    ['¬(p ∧ q) ∨ (r ∧ p)', '(¬u₁ ∨ p) ∧ (¬u₁ ∨ q) ∧ (u₁ ∨ ¬p ∨ ¬q) ∧ (¬u₂ ∨ ¬u₁) ∧ (u₂ ∨ u₁) ∧ (¬u₃ ∨ r) ∧ (¬u₃ ∨ p) ∧ (u₃ ∨ ¬r ∨ ¬p) ∧ (u₄ ∨ ¬u₂) ∧ (u₄ ∨ ¬u₃) ∧ (¬u₄ ∨ u₂ ∨ u₃) ∧ u₄'],
    ['p ∧ ¬p', '(¬u₁ ∨ ¬p) ∧ (u₁ ∨ p) ∧ (¬u₂ ∨ p) ∧ (¬u₂ ∨ u₁) ∧ (u₂ ∨ ¬p ∨ ¬u₁) ∧ u₂']
  ];
  for (const [source, encoding] of examples) {
    const a = parseBoolean(source), b = parseBoolean(encoding);
    const extra = b.names.filter(n => !a.names.includes(n));
    for (const v of valuations(a.names)) {
      const extensions = valuations(extra).filter(w => value(b.tree, {...v,...w}));
      assert.equal(extensions.length, value(a.tree, v), source);
    }
  }
});


test('generated Tseytin encodings have exactly one extension per satisfying input', () => {
  for(const source of ['p','¬p','p ∧ q','p ∨ q','p → q','p ↔ q','(p ∧ q) ∨ r','u₁ ∧ ¬p','p ∧ ¬p']) {
    const input=parseBoolean(source),result=tseytinTrace(input.tree);
    checkShape(result.tree,'CNF');
    assert.equal(new Set(result.bindings.map(b=>b.name)).size,result.bindings.length);
    assert.ok(result.bindings.every(b=>!input.names.includes(b.name)));
    assert.ok(result.clauses.length<=4*result.bindings.length+1);
    for(const v of valuations(input.names)) {
      const extensions=valuations(result.bindings.map(b=>b.name)).filter(w=>value(result.tree,{...v,...w}));
      assert.equal(extensions.length,value(input.tree,v),source);
    }
  }
});

test('the circuit presets agree across SAT algorithms and track checked pairs', async () => {
  const {readFile}=await import('node:fs/promises');
  const presets=JSON.parse(await readFile(new URL('../../data/sat-examples.json',import.meta.url)));
  for(const example of presets.resolution) {
    const p=readProblem(example.formula), result=resolutionTrace(p);
    assert.equal(result.outcome,truthTable(p).satisfiable?'satisfiable':'unsatisfiable');
    assert.ok(result.steps.some(s=>s.initialClauses));
    if(result.outcome==='satisfiable') {
      const pairs=result.steps.filter(s=>s.checkedPair);
      assert.equal(pairs.length,Math.max(0,result.clauses.length*(result.clauses.length-1)/2));
      assert.equal(new Set(pairs.map(s=>s.checkedPair.join(','))).size,pairs.length);
    }
  }
});


test('tables include the full SAT conjunction and short-clause resolution refutes the circuit quickly',async()=>{
  const problem=readProblem('SUN ∨ RAIN, ¬SUN ∴ RAIN');
  const table=truthTable(problem), key=printFormula(problem.conjunction);
  assert.equal(table.columns.at(-1).key,key);
  assert.ok(table.rows.every(r=>r.cells.at(-1).value===0));
  const {readFile}=await import('node:fs/promises');
  const examples=JSON.parse(await readFile(new URL('../../data/sat-examples.json',import.meta.url)));
  const result=resolutionTrace(readProblem(examples.resolution[2].formula));
  assert.equal(result.outcome,'unsatisfiable');
  assert.equal(result.clauses.filter(c=>c.parents).length,2);
});

test('display grouping preserves formulas and faulty wiring implements AND', () => {
  assert.equal(formatFormula(parseBoolean('(p ∧ q) ∨ (¬p ∧ r ∧ ¬s)').tree), '(p ∧ q) ∨ (¬p ∧ r ∧ ¬s)');
  for (const source of ['p → (q → r)', '(p ↔ q) ↔ r', '¬(p ∨ q)', '(p ∧ q) ∨ (¬p ∧ r)']) {
    const {tree,names}=parseBoolean(source), displayed=parseBoolean(formatFormula(tree)).tree;
    for(const v of valuations(names)) assert.equal(value(tree,v),value(displayed,v));
  }
  for(const X of [0,1]) for(const Y of [0,1]) assert.equal(evaluateCircuit(circuitPreset('nand-faulty'),{X,Y}).get('out'),X&Y);
});

test('normal-form rewriting retains repetitions for resolution to handle',()=>{
  for(const target of ['CNF','DNF']) {
    const source='(SUN ∧ SUN) ∨ (SUN ∧ SUN)', tree=parseBoolean(source).tree;
    const result=rewriteTrace(tree,target);
    assert.ok(result.complete);
    assert.ok(!result.steps.some(s=>/idempoten|repeated|repetition/i.test(s.explanation)));
    assert.ok(printFormula(result.tree).split('SUN').length>=5);
  }
});
