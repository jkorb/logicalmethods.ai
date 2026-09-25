import test from 'node:test';
import assert from 'node:assert/strict';
import { readRules, forwardTrace, backwardTrace, scanForwardTrace } from '../../assets/js/logic/conditionals.js';
import { plan, blockFrames, monkeyFrames, solveCNF, blockArrangements } from '../../assets/js/logic/planning.js';
import { readProblem, truthTable } from '../../assets/js/logic/sat.js';

test('Horn decisions agree with exhaustive Boolean semantics for every two-atom clause combination',()=>{
  const clauses=['p','q','¬p','¬q','¬p ∨ q','¬q ∨ p','¬p ∨ ¬q'];
  for(let mask=1;mask<128;mask++) {
    const chosen=clauses.filter((_,i)=>mask & (1<<i));
    const kb=readRules(chosen.join('\n'),{constraints:true});
    assert.equal(forwardTrace(kb,'',true).at(-1).result,truthTable(readProblem(chosen.join(','))).satisfiable?'sat':'unsat');
  }
  assert.equal(forwardTrace(readRules('⊥',{constraints:true}),'',true).at(-1).result,'unsat');
  assert.equal(forwardTrace(readRules('(p ∧ p) → q\np\nq → ⊥',{constraints:true}),'',true).at(-1).result,'unsat');
});
test('backward alternatives and branch cycles agree with forward closure',()=>{
  const rules=['p','q','p → q','q → p','(p ∧ q) → r','r → p','r → r'];
  for(let mask=1;mask<128;mask++) {
    const kb=readRules(rules.filter((_,i)=>mask&(1<<i)).join('\n'));
    for(const goal of ['p','q','r']) assert.equal(backwardTrace(kb,goal).at(-1).result,forwardTrace(kb,goal).at(-1).result);
  }
  const kb=readRules('CLOUDS → HUMID\nHUMID → CLOUDS\nRAIN → CLOUDS\nRAIN');
  assert.equal(backwardTrace(kb,'HUMID').at(-1).result,'proved');
  assert.ok(backwardTrace(kb,'HUMID').some(e=>e.message.includes('circular')));
});
test('rule parsing enforces the advertised restriction and supports conventional input',()=>{
  assert.throws(()=>readRules('p → (q ∨ r)'),/one atom/);
  assert.throws(()=>readRules('p ∨ q',{constraints:true}),/at most one/);
  assert.throws(()=>readRules('¬p'),/constraints/);
  assert.throws(()=>readRules(''),/one to forty/);
  assert.equal(readRules('(p & q) -> r').rules[0].head,'r');
  assert.equal(readRules('p -> ⊥',{constraints:true}).rules[0].head,'⊥');
});
test('DPLL agrees with exhaustive assignments and distinguishes exhaustion',()=>{
  const candidates=[[1],[-1],[2],[-2],[1,2],[-1,2],[1,-2],[-1,-2]];
  for(let mask=0;mask<256;mask++) {
    const clauses=candidates.filter((_,i)=>mask&(1<<i));
    const satisfiable=[0,1,2,3].some(v=>clauses.every(c=>c.some(l=>Boolean(v&(1<<(Math.abs(l)-1)))===(l>0))));
    const r=solveCNF(clauses,2);
    assert.equal(Boolean(r.model),satisfiable);
    if(r.model)assert.ok(clauses.every(c=>c.some(l=>r.model[Math.abs(l)]===(l>0?1:-1))));
  }
  assert.equal(solveCNF([[]],0).model,null);
  assert.throws(()=>solveCNF([[1]],1,[],0),/No satisfiability verdict/);
});
test('planning frames exclude miracle models and every returned assignment satisfies its CNF',()=>{
  for(const example of ['two','three','monkey']) {
    const absent=plan({example});
    assert.equal(absent.status,'sat');assert.ok(absent.miracles.length);
    assert.ok(absent.states.slice(0,-1).every(s=>s.action==='Wait'));
    const full=plan({example,frames:example==='monkey'?monkeyFrames:blockFrames});
    assert.equal(full.status,'sat');assert.equal(full.miracles.length,0);
    assert.ok(full.cnf.every(c=>c.some(l=>full.model[Math.abs(l)]===(l>0?1:-1))));
  }
  assert.deepEqual(plan({frames:blockFrames}).states.slice(0,-1).map(s=>s.action),['Unstack(G,R)','Stack(R,G)']);
  assert.deepEqual(plan({example:'three',frames:blockFrames}).states.slice(0,-1).map(s=>s.action),['Unstack(G,B)','Unstack(B,R)','Stack(G,R)','Stack(B,G)']);
  assert.deepEqual(plan({example:'monkey',frames:monkeyFrames}).states.slice(0,-1).map(s=>s.action),['PushBox','Climb','TakeBanana']);
});
test('bounded failure, inconsistent states, malformed frames, and alternate goals',()=>{
  assert.equal(plan({horizon:1,frames:blockFrames}).status,'unsat');
  assert.equal(plan({example:'three',horizon:3,frames:blockFrames}).status,'unsat');
  assert.equal(plan({example:'monkey',horizon:2,frames:monkeyFrames}).status,'unsat');
  assert.equal(plan({initial:'On(R,G), On(G,R)',frames:blockFrames}).status,'unsat');
  assert.equal(plan({example:'three',initial:'On(R,G), On(G,B), On(B,R)',frames:blockFrames}).status,'unsat');
  assert.equal(plan({initial:'On(G,R), ¬On(G,R)',frames:blockFrames}).status,'unsat');
  assert.equal(plan({goal:'¬On(G,R), ¬On(R,G)',frames:blockFrames,horizon:1}).states[1].true.length,0);
  assert.throws(()=>plan({frames:['On(X,Y,t) → MYSTERY','']}),/Unknown name/);
  assert.throws(()=>plan({initial:'On(R,R)'}),/state atoms/);
  assert.throws(()=>plan({horizon:8}),/1 to 6/);
  assert.throws(()=>plan({frames:['V999999','']}),/named fluents/);
});

test('scan and breadth-first forward searches agree with closure, with different proof depths',()=>{
  const kb=readRules('RAIN\nSNOW\nHUMID → CLOUDS\nRAIN → CLOUDS\nRAIN → PUDDLES\nPUDDLES → HUMID\nRAIN → WET_GROUND\nSNOW → COLD\n(CLOUDS ∧ SNOW) → STORM');
  for(const goal of ['CLOUDS','HUMID','STORM','WIND']) for(const breadth of [false,true]) assert.equal(scanForwardTrace(kb,goal,breadth).at(-1).result,forwardTrace(kb,goal).at(-1).result);
  const depth=t=>t.children.length?1+Math.max(...t.children.map(depth)):0;
  assert.equal(depth(scanForwardTrace(kb,'STORM',true).at(-1).tree),2);
  assert.equal(depth(backwardTrace(kb,'STORM').at(-1).tree),4);
  assert.ok(scanForwardTrace(kb,'STORM',true).at(-1).proofs.length>backwardTrace(kb,'STORM').at(-1).proofs.length);
});
test('partial initial descriptions are existential and display worlds obey block constraints',()=>{
  const result=plan({initial:'',completeInitial:false,horizon:1,frames:blockFrames});
  assert.equal(result.status,'sat');assert.equal(result.miracles.length,0);
  assert.equal(blockArrangements(['R','G']).length,3);assert.equal(blockArrangements(['R','G','B']).length,13);
  assert.equal(plan({initial:'On(G,R), On(R,G)',completeInitial:false,frames:blockFrames}).status,'unsat');
});

test('explicit monkey frames, incomplete frames and trailing punctuation',()=>{
  const complete=plan({example:'monkey',frames:monkeyFrames.map(f=>f+'.')});
  assert.equal(complete.miracles.length,0);
  assert.equal(plan({example:'monkey',frames:monkeyFrames,horizon:2}).status,'unsat');
  const incomplete=plan({example:'monkey',frames:[monkeyFrames[0],monkeyFrames[1].split('\n').slice(0,2).join('; ')]});
  assert.ok(incomplete.miracles.some(m=>m.fluent==='HasBanana'));
  const legacy=plan({example:'monkey',initial:'none',goal:'HasBanana',frames:['F(t) ∧ ¬Remove(F,t) → F(t+1)','¬F(t) ∧ ¬Add(F,t) → ¬F(t+1).']});
  assert.equal(legacy.miracles.length,0);
  assert.deepEqual(legacy.states,complete.states);
  assert.throws(()=>plan({example:'monkey',frames:['OnBox(t) → Climb(t+1)','']}),/Actions/);
});
