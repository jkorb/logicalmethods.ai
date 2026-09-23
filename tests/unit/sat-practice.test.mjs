import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { tableExercise, checkNormalForm, checkVariables, checkParse, checkMystery, createResolutionSession, resolutionChoices, applyResolutionChoice, resolutionOutcome } from '../../assets/js/logic/sat-practice.js';
import { parseBoolean, circuitPreset, evaluateCircuit } from '../../assets/js/logic/boolean.js';
import { printFormula } from '../../assets/js/logic/sat.js';
const levels=JSON.parse(fs.readFileSync(new URL('../../data/sat-practice.json',import.meta.url)));
test('tables preserve independent answer cells and require variables, row count and grouping',()=>{
  for(const item of [...levels.table,...levels.gaps]) {
    const m=tableExercise(item.formula);
    assert.ok(checkVariables(m,m.problem.names.join(', '),m.rows.length));
    assert.ok(!checkVariables(m,m.problem.names.join(', '),m.rows.length+1));
    assert.ok(checkParse(m.problem.conjunction,printFormula(m.problem.conjunction)));
    assert.ok(!checkParse(m.problem.conjunction,'SUN'));
    assert.equal(m.rows.length,2**m.problem.names.length);
  }
  assert.ok(!checkVariables(tableExercise('SUN ∧ RAIN'),'SUN,SUN',4));
});
test('mystery checking accepts equivalent formulas and reports real counterexamples',()=>{
  for(const item of levels.mystery)assert.equal(checkMystery(item.formula,parseBoolean(item.formula).tree,item.names).correct,true);
  const target=parseBoolean('SUN ∨ ¬WIND').tree;
  assert.ok(checkMystery('¬(¬SUN ∧ WIND)',target,['RAIN','SUN','WIND']).correct);
  assert.ok(checkMystery('SUN',target,['RAIN','SUN','WIND']).counterexample);
  assert.throws(()=>checkMystery('SNOW',target,['RAIN','SUN','WIND']),/only the variables/);
});
test('interactive resolution is sound, exhaustive and immutable on every exercise',()=>{
  for(const item of levels.resolution) {
    let state=createResolutionSession(item.formula), steps=0;
    while(resolutionOutcome(state)==='unfinished') {
      const a=resolutionChoices(state).find(a=>!a.checked), before=JSON.stringify(state);
      const next=applyResolutionChoice(state,a.second,a.first,a.pivot);
      assert.equal(JSON.stringify(state),before);
      state=next;assert.ok(++steps<200);
    }
    assert.equal(resolutionOutcome(state),tableExercise(item.formula).satisfiable?'satisfiable':'unsatisfiable');
  }
});
test('resolution rejects premature claims, invalid pivots, repetitions, non-CNF and bounded additions',()=>{
  let s=createResolutionSession('(SUN ∨ RAIN) ∧ (¬SUN ∨ ¬RAIN)');
  assert.equal(resolutionOutcome(s),'unfinished');
  assert.throws(()=>applyResolutionChoice(s,1,2,'WIND'),/no complementary/);
  s=applyResolutionChoice(s,1,2,'SUN');assert.equal(s.clauses.length,2);
  assert.equal(resolutionOutcome(s),'unfinished');
  assert.throws(()=>applyResolutionChoice(s,1,2,'SUN'),/already/);
  s=applyResolutionChoice(s,1,2,'RAIN');assert.equal(resolutionOutcome(s),'satisfiable');
  assert.throws(()=>createResolutionSession('SUN ∨ (RAIN ∧ WIND)'),/CNF/);
  assert.equal(createResolutionSession('SUN, SUN, SUN ∨ ¬SUN').clauses.length,1);
  const bounded=createResolutionSession('SUN, ¬SUN');bounded.limit=2;
  assert.throws(()=>applyResolutionChoice(bounded,1,2,'SUN'),/limit/);
});
test('negated-input relay circuit agrees with its written description',()=>{
  for(const X of [0,1])for(const Y of [0,1])assert.equal(evaluateCircuit(circuitPreset('negated-input'),{X,Y}).get('out'),(1-X)&Y);
});

test('every circuit level computes its stated formula on every input',()=>{
  for(const item of levels.circuit) {
    const model=tableExercise(item.formula), nodes=circuitPreset(item.preset);
    for(const row of model.rows) assert.equal(evaluateCircuit(nodes,{X:row.valuation['INPUT₁'],Y:row.valuation['INPUT₂'],Z:row.valuation['INPUT₃']}).get('out'),row.cells.at(-1).value,item.preset);
  }
});
test('equivalence tasks distinguish changed inputs and three-way agreement',()=>{
  const answers=['(SUN ∧ ¬RAIN) ∨ (¬SUN ∧ RAIN)','¬SUN ↔ ¬RAIN','(SUN ∧ RAIN ∧ WIND) ∨ (¬SUN ∧ ¬RAIN ∧ ¬WIND)'];
  levels.equivalence.forEach((item,i)=>assert.ok(checkMystery(answers[i],parseBoolean(item.formula).tree,item.names).correct));
  const item=levels.equivalence[2];assert.ok(!checkMystery('(SUN ↔ RAIN) ↔ WIND',parseBoolean(item.formula).tree,item.names).correct);
});

test('function descriptions require both equivalence and the requested normal form',()=>{
  const target=parseBoolean('INPUT₁ ∧ INPUT₂').tree;
  assert.deepEqual(checkNormalForm('(INPUT₁ ∧ INPUT₂)',target,'DNF'),{correct:true,counterexample:undefined,normal:true});
  assert.ok(checkNormalForm('INPUT₁ ∧ INPUT₂',target,'CNF').correct);
  assert.equal(checkNormalForm('¬(¬INPUT₁ ∨ ¬INPUT₂)',target,'CNF').normal,false);
  assert.equal(checkNormalForm('INPUT₁ ∨ INPUT₂',target,'DNF').correct,false);
});
