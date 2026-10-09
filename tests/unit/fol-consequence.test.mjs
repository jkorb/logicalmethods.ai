import test from 'node:test';
import assert from 'node:assert/strict';
import {consequenceTrace,partialInterpretation} from '../../assets/js/logic/fol-consequence.js';
import {parseFOL} from '../../assets/js/logic/fol-parser.js';
import {evaluateFOL} from '../../assets/js/logic/fol-model.js';
const language={constants:['a','b'],functions:{S:1},predicates:{P:1,Q:1,R:2}};
const check=(premises,goal,options)=>consequenceTrace(premises,goal,language,options);
test('partial information establishes Socrates and successor inferences',()=>{
 assert.equal(check(['∀x (P(x) → Q(x))','P(a)'],'Q(a)').result,'true');
 const trace=check(['∀x R(x, S(x))'],'∀x ∃y R(x, y)');
 assert.equal(trace.result,'true');assert.ok(trace.steps.some(s=>s.arbitrary));assert.ok(trace.steps.some(s=>s.explanation.includes('witness')));
});
test('missing information is unknown, not false; explicit negative facts can settle a goal',()=>{
 assert.equal(check(['∀x (P(x) → Q(x))'],'Q(a)').result,'unknown');
 assert.equal(check(['P(a)'],'Q(a)').result,'unknown');
 assert.equal(check(['¬Q(a)'],'Q(a)').result,'false');
 assert.equal(check(['Q(a)','¬Q(a)'],'Q(a)').result,'inconsistent');
 assert.equal(check(['P(a)'],'P(a)',{budget:0}).result,'unknown');
});
test('pictured or named objects cannot license generalization or witness escape',()=>{
 assert.equal(check(['P(a)','P(b)'],'∀x P(x)').result,'unknown');
 assert.equal(check(['∃x P(x)'],'P(a)').result,'unknown');
 assert.equal(check(['∀x ∃y R(x,y)'],'∃y ∀x R(x,y)').result,'unknown');
 assert.equal(check([],'a = b').result,'unknown');
 assert.equal(check([],'∃x x = x').result,'true');
 assert.throws(()=>check(['P(x)'],'P(a)'),/sentences/);
});
test('search conclusions agree with exhaustive two-object models',()=>{
 const cases=[
  [['∀x (P(x) → Q(x))','P(a)'],'Q(a)'],
  [['P(a)'],'∀x P(x)'],
  [['∀x P(x)'],'∃x P(x)'],
  [[], '∀x (P(x) → P(x))'],
  [['P(a) ∧ Q(b)'],'Q(b)'],
  [['¬Q(a)'],'Q(a)'],
  [['∀x (P(x) → Q(x))'],'P(a) → Q(a)'],
 ];
 const read=s=>parseFOL(s,{language,mode:'conventional'});
 for(const [premises,goal] of cases){
  const result=check(premises,goal).result;
  for(let mask=0;mask<16;mask++)for(const a of ['0','1'])for(const b of ['0','1']){
   const model={domain:['0','1'],constants:{a,b},functions:{S:{'["0"]':'1','["1"]':'0'}},predicates:{P:['0','1'].filter((_,i)=>mask&(1<<i)).map(x=>[x]),Q:['0','1'].filter((_,i)=>mask&(1<<(i+2))).map(x=>[x]),R:[]}};
   const value=s=>evaluateFOL(read(s),language,model).value;
   if(!premises.every(value))continue;
   if(result==='true')assert.equal(value(goal),true,goal);
   if(result==='false')assert.equal(value(goal),false,goal);
  }
 }
});

test('temporary assumptions stay local to a conditional proof',()=>{
 const trace=check([],'P(a) → P(a)');
 assert.equal(trace.result,'true');
 assert.ok(trace.steps.filter(s=>s.ast&&s.formula==='P(a)').every(s=>s.hypothetical));
 assert.ok(trace.steps.some(s=>s.ast&&s.formula.includes('→')&&!s.hypothetical));
});

test('partial pictures retain unknown function values and do not assert hypothetical atoms',()=>{
 const config={language,model:{constants:{a:'alice',b:'bob'}}};
 const ast=s=>parseFOL(s,{language,mode:'conventional'});
 const out=partialInterpretation(config,['P(a)'],[{ast:ast('Q(a)'),hypothetical:true},{known:[ast('R(a, S(a))')]}]);
 assert.deepEqual(out.model.predicates.P,[['alice']]);assert.deepEqual(out.model.predicates.Q,[]);
 assert.deepEqual(out.model.predicates.R,[['alice','S(a)']]);
 assert.equal(out.model.functions.S['["alice"]'],'S(a)');
 assert.equal(out.model.functions.S['["S(a)"]'],undefined);
});
