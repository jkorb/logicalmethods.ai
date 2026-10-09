import test from 'node:test';
import assert from 'node:assert/strict';
import {MODEL_REASONING_LEVELS} from '../../assets/js/logic/fol-inference-exercises.js';
import {startModelReasoning,canUnfold,availableObjects,unfoldTruthCondition,checkModelReasoning,conflict} from '../../assets/js/logic/fol-model-reasoning.js';
import {printFOL} from '../../assets/js/logic/fol-parser.js';
const language={constants:[],functions:{},predicates:{Human:1,Mortal:1,Sibling:2}};
function explore(problem,reverse=false){
 let state=startModelReasoning(problem,language);
 for(let i=0;i<100&&checkModelReasoning(state).result==='unfinished';i++){
  const cases=[...state.branches.entries()];if(reverse)cases.reverse();let found=false;
  for(const [bi,b] of cases){const entries=[...b.entries.entries()];if(reverse)entries.reverse();const next=entries.find(([,e])=>canUnfold(b,e));if(!next)continue;state=unfoldTruthCondition(state,bi,next[0],availableObjects(b,next[1])[0]);found=true;break;}
  if(!found)break;
 }
 return checkModelReasoning(state);
}
test('different student expansion orders establish the six inferences using semantics',()=>{
 for(const reverse of [false,true])for(const [i,p] of MODEL_REASONING_LEVELS.entries())assert.equal(explore(p,reverse).result,i<3?'valid':'invalid');
});
test('one closed alternative does not establish validity, and unfinished cases are not countermodels',()=>{
 let s=startModelReasoning({premises:['Human(a) ∨ Mortal(a)','¬Human(a)','¬Mortal(a)'],goal:'Sibling(a,a)'},{...language,constants:['a']});
 assert.equal(checkModelReasoning(s).result,'unfinished');s=unfoldTruthCondition(s,0,0);s=unfoldTruthCondition(s,0,1);
 assert.ok(conflict(s.branches[0]));assert.equal(checkModelReasoning(s).result,'unfinished');
 s=unfoldTruthCondition(s,1,2);assert.equal(checkModelReasoning(s).result,'valid');
});
test('universal conditions must be instantiated again after a fresh witness appears',()=>{
 let s=startModelReasoning(MODEL_REASONING_LEVELS[0],language);s=unfoldTruthCondition(s,0,0,'a');s=unfoldTruthCondition(s,0,1);
 assert.deepEqual(availableObjects(s.branches[0],s.branches[0].entries[0]),['b']);
 s=unfoldTruthCondition(s,0,0,'b');assert.ok(s.branches[0].entries.some(e=>printFOL(e.ast)==='(Human(b) → Mortal(b))'));
 assert.throws(()=>unfoldTruthCondition(s,0,0,'b'),/unexpanded/);
});
