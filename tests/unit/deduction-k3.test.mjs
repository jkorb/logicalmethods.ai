import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyProof,formula,addAssumption,infer,validateProof,proves,printFormula,rulesFor} from '../../assets/js/logic/deduction.js';
import {K3_EXAMPLES,k3ExampleProof} from '../../assets/js/logic/deduction-k3.js';
import {deleteStep,makeLemma,applyLemma,loadWorkspace,toProofSty} from '../../assets/js/logic/deduction-tools.js';
import {newGoal,expandGoal,settleGoals,validateGoals} from '../../assets/js/logic/deduction-goals.js';
import {toLean} from '../../assets/js/logic/deduction-lean.js';
import {parseBoolean,evaluateTrace} from '../../assets/js/logic/boolean.js';
const truth=(tree,v)=>evaluateTrace(parseBoolean(printFormula(tree)).tree,v,'k3').at(-1).value;
test('every Priest example is checked and preserves 1 in all nine weather states',()=>{
 for(const e of K3_EXAMPLES){const {proof,root}=k3ExampleProof(e);assert.equal(proves(proof,root,e.premises,e.goal),true);
  for(const SUN of [0,.5,1])for(const RAIN of [0,.5,1])for(const n of proof.nodes){const v={SUN,RAIN};if(n.open.every(h=>truth(proof.nodes[h].formula,v)===1))assert.equal(truth(n.formula,v),1);}
  assert.deepEqual(validateProof(JSON.parse(JSON.stringify(proof)),'k3'),proof);assert.match(toProofSty(proof,root),/\\infer/);
 }
});
test('K3 rejects classical discharge rules and unsupported formulas, including on import',()=>{
 let p=addAssumption(emptyProof('k3'),'A');
 for(const rule of ['impI','notI','raa','trueI','notE'])assert.throws(()=>infer(p,rule,[0],{discharge:[0]}),/unavailable/);
 for(const f of ['A → A','⊤','∀x P(x)'])assert.throws(()=>addAssumption(p,f),/K₃ canvas/);
 const classical=infer(addAssumption(emptyProof(),'A'),'impI',[0],{discharge:[0]});
 assert.throws(()=>validateProof({...classical,logic:'k3'}),/unavailable/);
 assert.throws(()=>loadWorkspace({format:'logicalmethods-nd',version:1,proof:classical,lemmas:[]},'k3'),/different logic/);
 assert.throws(()=>validateProof({...p,logic:'invented'}),/Unknown proof logic/);
 assert.throws(()=>toLean(p),/separate formalization/);
});
test('De Morgan and double negation check shape and are reversible',()=>{
 for(const [f,forward,backward] of [['¬(A ∧ B)','dmAnd','dmAndBack'],['¬(A ∨ B)','dmOr','dmOrBack'],['A','dnI','dnE']]){
  let p=addAssumption(emptyProof('k3'),f);p=infer(p,forward,[0]);p=infer(p,backward,[1]);assert.equal(printFormula(p.nodes[2].formula),printFormula(formula(f)));
 }
 assert.throws(()=>infer(addAssumption(emptyProof('k3'),'A ∨ B'),'dmAndBack',[0]),/negations/);
 assert.throws(()=>infer(addAssumption(emptyProof('k3'),'A ∧ ¬B'),'k3Explosion',[0],{formula:'C'}),/Select 2/);
});
test('K3 scope is local to each case and persists across deletion and lemmas',()=>{
 const e=K3_EXAMPLES[0],{proof,root}=k3ExampleProof(e);assert.deepEqual(proof.nodes[root].open,[0,1]);
 const deleted=deleteStep(proof,3);assert.equal(deleted.logic,'k3');assert.ok(!deleted.nodes.some(n=>n.rule==='orE'));
 const saved=makeLemma(proof,root,'DS');const result=applyLemma(proof,saved,[0,1]);assert.equal(result.proof.logic,'k3');
 assert.deepEqual(result.proof.nodes[result.root].open,[0,1]);
 assert.throws(()=>applyLemma(emptyProof(),saved,[]),/same logic/);
});
test('K3 backward plans settle and round trip using only Priest rules',()=>{
 let p=addAssumption(emptyProof('k3'),'¬(A ∨ B)');
 let plan=newGoal('¬A ∧ ¬B',[0]);({proof:p,plan}=expandGoal(p,plan,[],'dmOr'));
 const out=settleGoals(p,[plan]);assert.equal(out.proof.logic,'k3');assert.ok(Number.isInteger(out.plans[0].solved));validateGoals(out.proof,out.plans);
 assert.throws(()=>expandGoal(p,newGoal('¬A',[0]),[],'notI'),/cannot produce/);
 assert.ok(!rulesFor('k3').includes('raa'));
});

test('explosion accepts two complementary premises in either order, including compounds',()=>{
 let p=addAssumption(addAssumption(emptyProof('k3'),'A ∨ B'),'¬(A ∨ B)');
 for(const order of [[0,1],[1,0]])assert.equal(proves(infer(p,'k3Explosion',order,{formula:'C'}),2,['A ∨ B','¬(A ∨ B)'],'C'),true);
 p=addAssumption(p,'¬A');assert.throws(()=>infer(p,'k3Explosion',[0,2],{formula:'C'}),/either order/);
 let plan=newGoal('C',[0,1]);({proof:p,plan}=expandGoal(p,plan,[],'k3Explosion','A ∨ B'));
 assert.equal(plan.children.length,2);const out=settleGoals(p,[plan]);assert.ok(Number.isInteger(out.plans[0].solved));validateGoals(out.proof,out.plans);
});
