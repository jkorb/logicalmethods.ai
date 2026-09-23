import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseBoolean, evaluateTrace, proposition, WORLDS, circuitPreset, evaluateCircuit, inferenceScene, worldsFor, readInference, twoBitSum, rippleSum, checkCircuit, circuitTable } from '../../assets/js/logic/boolean.js';
import { countermodels } from '../../assets/js/set-diagram-model.js';

test('Boolean evaluation follows parsed dependencies, with consistent repeated atoms', () => {
  const { tree, names } = parseBoolean('SUN ∨ (RAIN ∧ ¬SUN)');
  assert.deepEqual(names, ['SUN', 'RAIN']);
  for (const world of WORLDS) {
    const trace = evaluateTrace(tree, world), done = new Set();
    function node(id, n = tree) { return n.id === id ? n : n.children.map(c => node(id, c)).find(Boolean); }
    for (const step of trace) {
      assert.ok(node(step.id).children.every(c => done.has(c.id)));
      done.add(step.id);
    }
    assert.equal(trace.at(-1).value, world.SUN | world.RAIN);
    assert.deepEqual(trace.filter(s => s.formula === 'SUN').map(s => s.value), [world.SUN, world.SUN]);
  }
  assert.throws(() => evaluateTrace(tree, { SUN: 0 }), /Assign 0 or 1/);
  assert.throws(() => parseBoolean('SUN ∧'), /missing/i);
  assert.throws(() => parseBoolean('<script>alert(1)</script>'));
  assert.throws(() => parseBoolean('¬'.repeat(513) + 'SUN'), /512/);
  assert.equal(evaluateTrace(parseBoolean('p₁ → p₂').tree, { 'p₁': 1, 'p₂': 0 }).at(-1).value, 0);
});

test('model propositions and validity use all four valuations', () => {
  assert.deepEqual(proposition('SUN'), ['M₁', 'M₂']);
  assert.deepEqual(proposition('RAIN'), ['M₁', 'M₃']);
  assert.deepEqual(proposition('¬SUN'), ['M₃', 'M₄']);
  assert.deepEqual(proposition('SUN ∧ RAIN'), ['M₁']);
  assert.deepEqual(proposition('SUN ∨ (RAIN ∧ ¬SUN)'), ['M₁','M₂','M₃']);
  for (const [premises, conclusion, expected] of [
    [['SUN ∨ RAIN', '¬SUN'], 'RAIN', []],
    [['SUN ∨ RAIN', 'SUN'], '¬RAIN', ['M₁']],
    [['SUN', '¬SUN'], 'RAIN', []],
    [[], 'SUN', ['M₃','M₄']],
    [[], 'SUN ∨ ¬SUN', []]
  ]) {
    const scene = inferenceScene(premises, conclusion);
    assert.deepEqual(countermodels(scene, scene.premises, scene.conclusion).map(w => w.id), expected);
  }
  assert.throws(() => proposition('SNOW'), /only SUN, RAIN/);
});

test('half and full adders satisfy arithmetic specification for every input', () => {
  for (const kind of ['half', 'full']) for (const X of [0,1]) for (const Y of [0,1]) for (const C of kind === 'half' ? [0] : [0,1]) {
    const values = evaluateCircuit(circuitPreset(kind), { X, Y, C });
    assert.equal(values.get('sum') + 2 * values.get('carry'), X+Y+C);
  }
});

test('workbench supports NAND construction, fan-out, unknowns, and rejects feedback', () => {
  const nodes = circuitPreset('');
  nodes.push({ id:'a', type:'NAND', inputs:['X','X'] }, { id:'b', type:'NAND', inputs:['Y','Y'] }, { id:'c', type:'NAND', inputs:['a','b'] });
  nodes.find(n => n.id === 'out').inputs = ['c'];
  for (const X of [0,1]) for (const Y of [0,1]) assert.equal(evaluateCircuit(nodes, { X,Y }).get('out'), X|Y);
  nodes.find(n => n.id === 'a').inputs = ['missing', 'X'];
  assert.equal(evaluateCircuit(nodes).get('out'), null);
  nodes.find(n => n.id === 'a').inputs = ['c', 'X'];
  assert.throws(() => evaluateCircuit(nodes), /Feedback/);
});

test('double-negation derivation displays identities valid at both Boolean values', () => {
  const steps = JSON.parse(readFileSync('data/boolean-derivations.json', 'utf8'))['double-negation'];
  // Independent recursive interpreter for the displayed NOT/AND/OR notation.
  function value(source, X) {
    const ts = source.match(/NOT|AND|OR|X|[01()]|\S/g); let i=0;
    function atom() {
      const t=ts[i++]; if(t==='NOT') return 1-atom(); if(t==='X') return X;
      if(t==='0'||t==='1') return Number(t);
      if(t==='(') { const n=or(); assert.equal(ts[i++],')'); return n; }
      throw Error(t);
    }
    function and() { let n=atom(); while(ts[i]==='AND') { i++; n &= atom(); } return n; }
    function or() { let n=and(); while(ts[i]==='OR') { i++; n |= and(); } return n; }
    const n=or(); assert.equal(i,ts.length); return n;
  }
  for (const X of [0,1]) for (const [formula] of steps) for (const side of formula.split('=')) assert.equal(value(side,X),X,formula);
});


test('eight worlds double the four-world space and support wind inferences', () => {
  const worlds=worldsFor(3);
  assert.equal(new Set(worlds.map(w=>`${w.SUN}${w.RAIN}${w.WIND}`)).size,8);
  assert.deepEqual(proposition('SUN ∧ WIND',3),['M₁','M₃']);
  assert.deepEqual(proposition('RAIN ∨ ¬WIND',3),['M₁','M₂','M₄','M₅','M₆','M₈']);
  const {premises,conclusion}=readInference('SUN ∨ RAIN\nWIND\n∴ SUN');
  const scene=inferenceScene(premises,conclusion,3);
  assert.deepEqual(countermodels(scene,scene.premises,scene.conclusion).map(w=>w.id),['M₅']);
  assert.throws(()=>readInference('SUN\nRAIN'),/∴/);
  assert.throws(()=>readInference('∴ SUN\nRAIN'),/∴/);
});

test('ripple carry produces every two-bit sum including final overflow', () => {
  for(let x=0;x<4;x++)for(let y=0;y<4;y++)assert.equal(twoBitSum(x,y).bits,(x+y).toString(2).padStart(3,'0'));
});


test('three-bit ripple adder preserves all carries and all 64 totals',()=>{
 for(let x=0;x<8;x++)for(let y=0;y<8;y++){
  const result=rippleSum(x,y,3);assert.equal(result.bits,(x+y).toString(2).padStart(4,'0'));
  result.stages.forEach((s,i)=>{assert.equal(s.sum+2*s.carry,s.x+s.y+s.incoming);if(i)assert.equal(s.incoming,result.stages[i-1].carry);});
 }
 assert.deepEqual(rippleSum(5,7,3).stages.map(s=>s.carry),[1,1,1]);
});

test('exercise evaluations agree with their worked answers',()=>{
 const examples=JSON.parse(readFileSync('data/boolean-evaluations.json','utf8'));
 assert.deepEqual(examples.map(e=>evaluateTrace(parseBoolean(e.formula).tree,e.valuation).at(-1).value),[1,1,0,0]);
});

test('relay networks implement NAND, XOR and XNOR with parallel branches',()=>{
 const base=[{id:'X',type:'INPUT',inputs:[]},{id:'Y',type:'INPUT',inputs:[]},{id:'POWER',type:'POWER',inputs:[]}];
 const relay=(id,type,a,b)=>({id,type,inputs:[a,b]});
 const out=input=>({id:'out',type:'OUTPUT',inputs:[input]});
 const nand=[...base,relay('a','RELAY-OFF','X','Y'),relay('b','RELAY-ON','a','POWER'),out('b')];
 const branches=[...base,relay('a','RELAY-ON','X','Y'),relay('b','RELAY-ON','Y','X')];
 for(const [target,nodes]of [['NAND',nand],['XOR',[...branches,out(['a','b'])]],['XNOR',[...branches,relay('c','RELAY-ON',['a','b'],'POWER'),out('c')]]])assert.equal(checkCircuit(nodes,target).correct,true);
 assert.throws(()=>evaluateCircuit([...base,relay('a','RELAY-OFF',['X','a'],'POWER')]),/Feedback loop/);
});

test('the sandbox table reports what a circuit computes, and null where it cannot', () => {
  const base = circuitPreset('');
  // Nothing is wired to the output yet, so every entry is unknown.
  assert.deepEqual(circuitTable(base), [[null, null], [null, null]]);
  const wired = circuitPreset('').map(n => n.id === 'out' ? { ...n, inputs: ['and'] } : n);
  wired.push({ id: 'and', type: 'AND', x: 180, y: 260, inputs: ['X', 'Y'], label: 'and', value: 0 });
  assert.deepEqual(circuitTable(wired), [[0, 0], [0, 1]]);
});
