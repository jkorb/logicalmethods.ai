// Boolean semantics uses the chapter parser; names are mapped to its atoms.
import { parseFormula, printFormula } from './parser.js';
export { printFormula };
const subs = n => String(n).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
export function parseBoolean(source) {
  if (source.length > 512) throw new Error('Use at most 512 characters.');
  const names = [];
  const mapped = source.replace(/[A-Za-z][A-Za-z0-9_₀₁₂₃₄₅₆₇₈₉]*/gu, name => {
    if (!names.includes(name)) names.push(name);
    return `p${subs(names.indexOf(name) + 1)}`;
  });
  const tree = parseFormula(mapped, { mode: 'conventional' });
  function restore(node) {
    if (!node.children.length) node.label = names[Number(node.label.slice(1).replace(/[₀₁₂₃₄₅₆₇₈₉]/gu, d => '₀₁₂₃₄₅₆₇₈₉'.indexOf(d))) - 1];
    node.children.forEach(restore);
  }
  restore(tree);
  return { tree, names };
}
export const OPERATIONS = {
  'RELAY-OFF': {arity:2, label:'Default-off relay', run:(magnet,power)=>magnet & power},
  'RELAY-ON': {arity:2, label:'Default-on relay', run:(magnet,power)=>(1-magnet) & power},
  POWER: {arity:0,run:()=>1},
  NOT: { arity: 1, run: a => 1 - a },
  AND: { arity: 2, run: (a, b) => a & b },
  OR: { arity: 2, run: (a, b) => a | b },
  XNOR: { arity: 2, run: (a, b) => Number(a === b) },
  XOR: { arity: 2, run: (a, b) => a ^ b },
  NAND: { arity: 2, run: (a, b) => 1 - (a & b) },
  NOR: { arity: 2, run: (a, b) => 1 - (a | b) },
  OUTPUT: { arity: 1, run: a => a }
};
const connectives = { '¬': 'NOT', '∧': 'AND', '∨': 'OR' };
export function evaluateTrace(tree, valuation) {
  const steps = [];
  function visit(node) {
    const args = node.children.map(visit);
    let value;
    if (!args.length) {
      value = valuation[node.label];
      if (value !== 0 && value !== 1) throw new Error(`Assign 0 or 1 to ${node.label}.`);
    } else if (node.label === '→') value = (1 - args[0]) | args[1];
    else if (node.label === '↔') value = Number(args[0] === args[1]);
    else value = OPERATIONS[connectives[node.label]].run(...args);
    const calculation = !args.length ? `v(${node.label}) = ${value}` : `${node.label === '¬' ? `NOT ${args[0]}` : `${args[0]} ${connectives[node.label] || node.label} ${args[1]}`} = ${value}`;
    steps.push({ id: node.id, formula: printFormula(node), value, calculation,
      explanation: !args.length ? 'This is a leaf. Read its value from the valuation: this is the base case.' : 'The children have returned their values. Apply the truth-function at this node, then return the result to its parent.' });
    return value;
  }
  visit(tree);
  return steps;
}
export const WORLDS = [
  { id: 'M₁', SUN: 1, RAIN: 1, image: 'world_sun_rain' },
  { id: 'M₂', SUN: 1, RAIN: 0, image: 'world_sun_no_rain' },
  { id: 'M₃', SUN: 0, RAIN: 1, image: 'world_no_sun_rain' },
  { id: 'M₄', SUN: 0, RAIN: 0, image: 'world_no_sun_no_rain' }
];
export function worldsFor(variables = 2) {
  if (variables === 2) return WORLDS;
  if (variables !== 3) throw new Error('Use a two- or three-variable space.');
  return [1,0].flatMap(SUN => [1,0].flatMap(RAIN => [1,0].map(WIND => ({SUN,RAIN,WIND})))).map((w,i)=>({...w,id:`M${subs(i+1)}`}));
}
export function proposition(source, variables = 2) {
  const { tree, names } = parseBoolean(source);
  const allowed = variables === 3 ? ['SUN', 'RAIN', 'WIND'] : ['SUN', 'RAIN'];
  if (names.some(name => !allowed.includes(name))) throw new Error(`Use only ${allowed.join(', ')} in this space.`);
  return worldsFor(variables).filter(w => evaluateTrace(tree, w).at(-1).value === 1).map(w => w.id);
}
// Acyclic, combinational circuits. Missing inputs remain unknown, never zero.
export function evaluateCircuit(nodes, inputs = {}) {
  const values = new Map();
  const visiting = new Set();
  const byId = new Map(nodes.map(n => [n.id, n]));
  function visit(id) {
    if (values.has(id)) return values.get(id);
    if (visiting.has(id)) throw new Error('Feedback loop: use an acyclic circuit.');
    const n = byId.get(id);
    if (!n) return null;
    visiting.add(id);
    let value;
    if (n.type === 'INPUT') value = inputs[n.id] ?? n.value ?? 0;
    else {
      const op = OPERATIONS[n.type];
      if (!op) throw new Error(`Unknown gate: ${n.type}`);
      const args = Array.from({ length: op.arity }, (_, i) => signal(n.inputs[i]));
      value = args.includes(null) ? null : op.run(...args);
    }
    visiting.delete(id);
    values.set(id, value);
    return value;
  }
  function signal(input) {
    if(!Array.isArray(input))return visit(input);
    if(!input.length)return null;
    const branches=input.map(visit);
    return branches.includes(1)?1:branches.includes(null)?null:0;
  }
  nodes.forEach(n => visit(n.id));
  return values;
}
export function circuitPreset(kind) {
  const n = (id, type, x, y, inputs = [], label = id) => ({ id, type, x, y, inputs, label, value: 0 });
  const inputs = [n('X', 'INPUT', 100, 410), n('Y', 'INPUT', 270, 410)];
  if (kind === 'sat-three') return [n('X','INPUT',60,530),n('Y','INPUT',210,530),n('Z','INPUT',440,530),n('POWER','POWER',550,530),n('a','RELAY-OFF',130,390,['X','Y']),n('b','RELAY-ON',200,260,['a','POWER']),n('c','RELAY-OFF',340,130,['b','Z']),n('out','OUTPUT',340,20,['c'],'output')];
  if (kind === 'sat-branch') return [n('X','INPUT',60,620),n('Y','INPUT',270,620),n('Z','INPUT',460,620),n('POWER','POWER',550,620),n('a','RELAY-OFF',130,450,['X','Y']),n('b','RELAY-OFF',380,450,['Y','Z']),n('c','RELAY-ON',130,300,['a','POWER']),n('d','RELAY-ON',380,300,['b','POWER']),n('e','RELAY-OFF',270,150,['c','d']),n('out','OUTPUT',270,30,['e'],'output')];
  if (kind === 'negated-input') return [...inputs, n('POWER','POWER',480,410), n('not','RELAY-ON',100,280,['X','POWER']), n('and','RELAY-OFF',270,160,['not','Y']), n('out','OUTPUT',270,40,['and'],'output')];
  if (kind === 'nand-faulty') return [...inputs, n('and','RELAY-OFF',180,280,['X','Y']), n('out','OUTPUT',180,110,['and'],'output')];
  if (kind === 'nand') return [...inputs,
    n('POWER', 'POWER', 480, 410),
    n('and', 'RELAY-OFF', 180, 280, ['X', 'Y']),
    n('not', 'RELAY-ON', 290, 165, ['and', 'POWER']),
    n('out', 'OUTPUT', 290, 45, ['not'], 'NAND')];

  if (kind === 'half') return [...inputs, n('xor', 'XOR', 100, 225, ['X', 'Y']), n('and', 'AND', 340, 225, ['X', 'Y']), n('sum', 'OUTPUT', 100, 65, ['xor'], 'sum'), n('carry', 'OUTPUT', 340, 65, ['and'], 'carry')];
  if (kind === 'full') return [n('X','INPUT',80,440),n('Y','INPUT',250,440),n('C','INPUT',500,440),n('xor1','XOR',160,325,['X','Y']),n('and1','AND',370,325,['X','Y']),n('xor2','XOR',110,195,['xor1','C']),n('and2','AND',300,195,['xor1','C']),n('or','OR',420,95,['and1','and2']),n('sum','OUTPUT',110,65,['xor2'],'sum'),n('carry','OUTPUT',420,15,['or'],'carry')];
  return [...inputs, n('out', 'OUTPUT', 280, 65, [], 'output')];
}

// Adapt semantic propositions to the same finite-set queries as chapter 3.
export function inferenceScene(premises, conclusion, variables = 2) {
  const sources = [...premises, conclusion];
  const sets = sources.map((formula, i) => ({ id: `P${i}`, formula, members: proposition(formula, variables) }));
  return {
    sets,
    points: worldsFor(variables).map(world => ({ ...world, sets: sets.filter(s => s.members.includes(world.id)).map(s => s.id) })),
    premises: sets.slice(0, -1).map(s => s.id),
    conclusion: sets.at(-1).id
  };
}

export function readInference(source) {
  const lines = source.trim().split('\n').map(s => s.trim()).filter(Boolean);
  if (lines.length > 9) throw new Error('Use at most eight premises.');
  const markers = lines.filter(s => s.includes('∴'));
  if (markers.length !== 1 || !lines.at(-1)?.startsWith('∴')) throw new Error('Put the conclusion on the final line, after ∴.');
  const conclusion = lines.at(-1).slice(1).trim();
  if (!conclusion || conclusion.includes('∴')) throw new Error('Write one formula after ∴.');
  return { premises: lines.slice(0, -1), conclusion };
}
export const CIRCUIT_TASKS = ['XOR', 'NAND', 'NOR', 'XNOR'];
export function checkCircuit(nodes, target) {
  const rows = [0,1].flatMap(X => [0,1].map(Y => ({ X, Y, actual: evaluateCircuit(nodes, { X,Y }).get('out'), expected: OPERATIONS[target].run(X,Y) })));
  return { rows, correct: rows.every(r => r.actual === r.expected) };
}
export function twoBitSum(X, Y) {
  const x0=X&1, y0=Y&1, x1=(X>>1)&1, y1=(Y>>1)&1;
  const low = evaluateCircuit(circuitPreset('full'), { X:x0, Y:y0, C:0 });
  const high = evaluateCircuit(circuitPreset('full'), { X:x1, Y:y1, C:low.get('carry') });
  return { s0:low.get('sum'), c0:low.get('carry'), s1:high.get('sum'), c1:high.get('carry'), bits:`${high.get('carry')}${high.get('sum')}${low.get('sum')}` };
}


export function rippleSum(X, Y, width = 2) {
  if (![2,3].includes(width) || ![X,Y].every(n=>Number.isInteger(n)&&n>=0&&n<2**width)) throw new Error('Use two- or three-bit unsigned inputs.');
  let carry=0;const stages=[];
  for(let bit=0;bit<width;bit++) {
    const x=(X>>bit)&1,y=(Y>>bit)&1,incoming=carry;
    const values=evaluateCircuit(circuitPreset('full'),{X:x,Y:y,C:incoming});
    carry=values.get('carry');stages.push({x,y,incoming,sum:values.get('sum'),carry});
  }
  return {stages,bits:String(carry)+stages.map(s=>s.sum).reverse().join('')};
}
