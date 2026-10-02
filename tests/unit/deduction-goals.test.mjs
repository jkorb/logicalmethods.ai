import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptyProof,addAssumption,infer,proves,validateProof,printFormula} from '../../assets/js/logic/deduction.js';
import {newGoal,expandGoal,settleGoals,validateGoals,goalToLean,strategyFrames} from '../../assets/js/logic/deduction-goals.js';
import {STRATEGIES,exampleProof} from '../../assets/js/logic/deduction-examples.js';
import {fromLean} from '../../assets/js/logic/deduction-lean.js';
const start=(...fs)=>fs.reduce((p,f)=>addAssumption(p,f),emptyProof());
test('elimination infers premise roles without changing conjunction order',()=>{
  const p=start('A','A → B','¬A');
  assert.equal(printFormula(infer(p,'impE',[0,1]).nodes.at(-1).formula),'B');
  assert.equal(printFormula(infer(p,'notE',[0,2]).nodes.at(-1).formula),'⊥');
  assert.notEqual(printFormula(infer(p,'andI',[0,1]).nodes.at(-1).formula),printFormula(infer(p,'andI',[1,0]).nodes.at(-1).formula));
});
test('backwards conditional discharges its local assumption; goals never count as proofs',()=>{
  const plan=newGoal('A → A'),out=expandGoal(emptyProof(),plan,[],'impI');
  assert.equal(out.proof.nodes.length,1);assert.equal(plan.rule,null);
  const done=settleGoals(out.proof,[out.plan]);assert.ok(proves(done.proof,done.plans[0].solved,[],'A → A'));
  assert.deepEqual(validateProof(done.proof),done.proof);
});
test('a proof in one case cannot close a goal in a different scope',()=>{
  let p=start('A ∨ B');const out=expandGoal(p,newGoal('A',[0]),[],'orE','A ∨ B');
  const done=settleGoals(out.proof,[out.plan]);assert.equal(done.plans[0].children[1].solved,1);assert.equal(done.plans[0].children[2].solved,undefined);assert.equal(done.plans[0].solved,undefined);
  const forged=structuredClone(out.plan);forged.children[2].context.push(1);assert.throws(()=>validateGoals(out.proof,[forged]),/scope/);
});
test('forward results meet backward subgoals and produce a checked conclusion',()=>{
  let p=start('A ∧ B'),out=expandGoal(p,newGoal('B ∧ A',[0]),[],'andI');
  p=infer(out.proof,'andL',[0]);p=infer(p,'andR',[0]);const done=settleGoals(p,[out.plan]);
  assert.ok(proves(done.proof,done.plans[0].solved,['A ∧ B'],'B ∧ A'));
});
test('partial plans export typed sorry holes without treating them as established premises',()=>{
  const out=expandGoal(emptyProof(),newGoal('A → (A ∧ B)'),[],'impI');
  const next=expandGoal(out.proof,out.plan,[0],'andI');const code=goalToLean(next.proof,next.plan);
  assert.match(code,/intro h0/);assert.match(code,/show B from sorry/);assert.doesNotMatch(code,/example \(h\d+ : B\)/);
  assert.throws(()=>fromLean(code),/Holes/);
});
test('all authored strategy plans finish and round-trip through checked Lean',()=>{
  for(const e of STRATEGIES){const frames=strategyFrames(e,exampleProof(e)),last=frames.at(-1);assert.ok(proves(last.proof,last.plans[0].solved,e.premises,e.goal));
    for(const frame of frames)assert.doesNotThrow(()=>validateGoals(frame.proof,frame.plans));
    const code=goalToLean(last.proof,last.plans[0]);assert.doesNotMatch(code,/sorry/);assert.doesNotThrow(()=>fromLean(code));
  }
});
test('case elimination finds the disjunction and case roles in shuffled selections',()=>{
  const p=start('A ∨ B','A','B');let q=infer(p,'orL',[1],{formula:'B'});q=infer(q,'orR',[2],{formula:'A'});
  const out=infer(q,'orE',[4,0,3],{discharge:[1,2]});assert.deepEqual(out.nodes.at(-1).parents,[0,3,4]);assert.deepEqual(out.nodes.at(-1).open,[0]);
});
