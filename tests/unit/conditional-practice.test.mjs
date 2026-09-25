import test from 'node:test';
import assert from 'node:assert/strict';
import { hornWitness, startChaining, chainStep, checkPlanningLanguage } from '../../assets/js/logic/conditional-practice.js';
import { readRules } from '../../assets/js/logic/conditionals.js';
import { checkPlanningStates } from '../../assets/js/logic/planning.js';
import { OPERATIONS } from '../../assets/js/logic/boolean.js';

test('semantic Horn checking agrees with all Horn implicates for every three-atom function',()=>{
  const names=['RAIN','SUN','SNOW'];
  // Every Horn clause over three atoms: a negative body, optionally one positive head.
  const clauses=[];
  for(let body=0;body<8;body++)for(let head=-1;head<3;head++) {
    if(head>=0&&(body&(1<<head)))continue;
    let models=0;
    for(let row=0;row<8;row++)if((row&body)!==body || head>=0&&(row&(1<<head)))models|=1<<row;
    clauses.push(models);
  }
  for(let truth=0;truth<256;truth++) {
    const terms=[];for(let row=0;row<8;row++)if(truth&(1<<row))terms.push('('+names.map((n,i)=>row&(1<<i)?n:'¬'+n).join(' ∧ ')+')');
    const source=terms.join(' ∨ ')||'RAIN ∧ ¬RAIN';
    const intersection=clauses.filter(models=>(truth&models)===truth).reduce((a,b)=>a&b,255);
    assert.equal(hornWitness(source).horn,intersection===truth,source);
  }
  assert.equal(hornWitness('(RAIN | SUN) & ~RAIN').horn,true);
  assert.equal(hornWitness('RAIN | SUN').signature,hornWitness('SUN | RAIN').signature);
  assert.throws(()=>hornWitness('WIND'),/Use only/);
});
test('forward practice checks MP prerequisites and saturation without mutating previous work',()=>{
  const kb=readRules('RAIN; RAIN → CLOUDS; CLOUDS → HUMID'),initial=startChaining(kb,'HUMID','forward');
  assert.throws(()=>chainStep(kb,initial,{rule:2}),/every premise/);
  assert.throws(()=>chainStep(kb,initial,{type:'finish'}),/still add/);
  const next=chainStep(kb,initial,{rule:1,premises:['RAIN']});assert.deepEqual(initial.known,['RAIN']);
  const final=chainStep(kb,next,{rule:2,premises:['CLOUDS']});assert.ok(final.known.includes('HUMID'));
  assert.equal(chainStep(kb,final,{type:'finish'}).finished,true);
});
test('backward practice returns from circular branches and accepts an alternative proof',()=>{
  const kb=readRules('RAIN; HUMID → CLOUDS; CLOUDS → HUMID; RAIN → HUMID');
  let s=startChaining(kb,'CLOUDS','backward');
  s=chainStep(kb,s,{node:0,rule:1});s=chainStep(kb,s,{node:1,rule:2});
  assert.throws(()=>chainStep(kb,s,{node:2,rule:1}),/already occurs/);
  s=chainStep(kb,s,{node:2,type:'fail'});assert.equal(s.nodes[1].status,'open');
  assert.throws(()=>chainStep(kb,s,{node:1,rule:2}),/already been tried/);
  s=chainStep(kb,s,{node:1,rule:3});s=chainStep(kb,s,{node:3,type:'fact'});assert.equal(s.nodes[0].status,'proved');
});
test('backward failure requires exhausting alternatives and cannot manufacture a fact',()=>{
  const kb=readRules('CLOUDS → HUMID; HUMID → CLOUDS');let s=startChaining(kb,'CLOUDS','backward');
  assert.throws(()=>chainStep(kb,s,{node:0,type:'fact'}),/not a given/);
  assert.throws(()=>chainStep(kb,s,{node:0,type:'fail'}),/untried rule/);
  s=chainStep(kb,s,{node:0,rule:1});s=chainStep(kb,s,{node:1,rule:0});s=chainStep(kb,s,{node:2,type:'fail'});
  s=chainStep(kb,s,{node:1,type:'fail'});s=chainStep(kb,s,{node:0,type:'fail'});assert.equal(s.nodes[0].status,'failed');
});
test('conditional circuit solutions implement IF and XNOR on all assignments',()=>{
  const nand=OPERATIONS.NAND.run;
  for(const x of [0,1])for(const y of [0,1]) {
    const a=nand(x,nand(y,y)),b=nand(y,nand(x,x)),n=nand(a,b);
    assert.equal(a,OPERATIONS.IF.run(x,y));assert.equal(nand(n,n),OPERATIONS.XNOR.run(x,y));
  }
});

test('MP needs exactly the selected antecedents as well as the conditional',()=>{
  const kb=readRules('RAIN; SUN; SNOW; (RAIN ∧ SUN) → RAINBOW');const s=startChaining(kb,'RAINBOW','forward');
  for(const premises of [[],['RAIN'],['RAIN','SUN','SNOW'],['RAIN','RAIN']])assert.throws(()=>chainStep(kb,s,{rule:3,premises}),/Select exactly/);
  assert.ok(chainStep(kb,s,{rule:3,premises:['SUN','RAIN']}).known.includes('RAINBOW'));
});
test('planning language and depicted states must be supplied by the student',()=>{
  assert.equal(checkPlanningLanguage('On(R,B,t); On(G,B,t); On(B,R,t); On(B,G,t)','three'),true);
  assert.equal(checkPlanningLanguage('On(R,B); On(G,B); On(B,R); On(B,R)','three'),false);
  assert.equal(checkPlanningLanguage('BoxUnderBanana, OnBox, HasBanana','monkey'),true);
  assert.equal(checkPlanningLanguage('BoxUnderBanana, OnBox, BoxOpen','monkey'),false);
  assert.deepEqual(checkPlanningStates('three','On(G,B), On(B,R)','On(B,G), On(G,R)'),{initial:true,goal:true});
  assert.deepEqual(checkPlanningStates('three','','On(B,G)'),{initial:false,goal:false});
  assert.deepEqual(checkPlanningStates('monkey','','HasBanana'),{initial:true,goal:true});
  assert.deepEqual(checkPlanningStates('monkey','','OnBox'),{initial:true,goal:false});
});

test('planning accepts indexed or contextual atoms and omitted list commas',()=>{
  assert.equal(checkPlanningLanguage('On(R B t) On(G B t) On(B R t) On(B G t)','three'),true);
  assert.deepEqual(checkPlanningStates('three','On(G B 0) On(B R 0)','On(B G 4) On(G R 4)'),{initial:true,goal:true});
  assert.throws(()=>checkPlanningStates('three','On(G,B,1) On(B,R,1)','On(B,G,4) On(G,R,4)'),/time 0/);
  assert.deepEqual(checkPlanningStates('monkey','none','HasBanana(3)'),{initial:true,goal:true});
});
