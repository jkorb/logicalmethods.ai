import { planningAtoms } from './planning-input.js';
// Bounded planning encoded as CNF, then solved by DPLL with unit propagation.
// A missing frame formula really leaves the corresponding transitions unconstrained.
import { conditionalNotation } from './conditionals.js';
import { parseBoolean } from './boolean.js';
export const blockFrames = ['On(X,Y,t) ∧ ¬Unstack(X,Y,t) → On(X,Y,t+1)', '¬On(X,Y,t) ∧ ¬Stack(X,Y,t) → ¬On(X,Y,t+1)'];
export const monkeyFrames = [
  ['BoxUnderBanana','OnBox','HasBanana'].map(f=>`${f}(t) → ${f}(t+1)`).join('\n'),
  [['BoxUnderBanana','PushBox'],['OnBox','Climb'],['HasBanana','TakeBanana']].map(([f,a])=>`¬${f}(t) ∧ ¬${a}(t) → ¬${f}(t+1)`).join('\n')
];
export const planningExamples = {
  two: { label:'Two blocks', blocks:['R','G'], initial:'On(G,R)', goal:'On(R,G)', horizon:2 },
  three: { label:'Three blocks', blocks:['R','G','B'], initial:'On(G,B), On(B,R)', goal:'On(B,G), On(G,R)', horizon:4 },
  monkey: { label:'Monkey and banana', initial:'', goal:'HasBanana', horizon:3 }
};
const node = (label,...children) => ({label,children});
const or = xs => xs.length ? xs.reduce((a,b)=>node('∨',a,b)) : node('FALSE');
export function solveCNF(clauses, count, preferred = [], limit = 200000) {
  let work = 0;
  function search(values) {
    let changed = true;
    while (changed) {
      changed = false;
      for (const clause of clauses) {
        if (++work > limit) throw new Error('The solver reached its work limit. No satisfiability verdict has been reached.');
        let satisfied = false, free = 0, last = 0;
        for (const lit of clause) {
          if (values[Math.abs(lit)] === (lit > 0 ? 1 : -1)) { satisfied = true; break; }
          if (!values[Math.abs(lit)]) { free++; last = lit; }
        }
        if (satisfied) continue;
        if (!free) return null;
        if (free === 1) { values[Math.abs(last)] = last > 0 ? 1 : -1; changed = true; }
      }
    }
    const open = clauses.filter(c => !c.some(l => values[Math.abs(l)] === (l > 0 ? 1 : -1)));
    if (!open.length) return values;
    let choice = preferred.find(l => !values[Math.abs(l)] && open.some(c => c.some(x => Math.abs(x) === Math.abs(l))));
    if (!choice) { const shortest = open.reduce((a,c) => c.filter(l=>!values[Math.abs(l)]).length < a.filter(l=>!values[Math.abs(l)]).length ? c : a); choice = shortest.find(l=>!values[Math.abs(l)]); }
    for (const lit of [choice,-choice]) { const next = values.slice(); next[Math.abs(lit)] = lit > 0 ? 1 : -1; const result = search(next); if (result) return result; }
    return null;
  }
  const model = search(new Int8Array(count+1));
  return { model, work };
}
function world(example) {
  if (!example.blocks) return {
    fluents:['BoxUnderBanana','OnBox','HasBanana'],
    actions:[
      {name:'PushBox',pre:['¬OnBox','¬BoxUnderBanana'],add:['BoxUnderBanana'],remove:[]},
      {name:'Climb',pre:['BoxUnderBanana','¬OnBox'],add:['OnBox'],remove:[]},
      {name:'TakeBanana',pre:['OnBox','BoxUnderBanana'],add:['HasBanana'],remove:[]},
      {name:'Wait',pre:[],add:[],remove:[]}
    ], constraints:[]
  };
  const blocks = example.blocks, fluents = blocks.flatMap(x=>blocks.filter(y=>y!==x).map(y=>`On(${x},${y})`));
  const actions = [];
  for (const x of blocks) for (const y of blocks.filter(y=>y!==x)) {
    actions.push({name:`Stack(${x},${y})`,pre:[...blocks.filter(z=>z!==x).map(z=>`¬On(${x},${z})`),...blocks.filter(z=>z!==x).map(z=>`¬On(${z},${x})`),...blocks.filter(z=>z!==y).map(z=>`¬On(${z},${y})`)],add:[`On(${x},${y})`],remove:[]});
    actions.push({name:`Unstack(${x},${y})`,pre:[`On(${x},${y})`,...blocks.filter(z=>z!==x).map(z=>`¬On(${z},${x})`)],add:[],remove:[`On(${x},${y})`]});
  }
  actions.push({name:'Wait',pre:[],add:[],remove:[]});
  const constraints = [];
  for (let i=0;i<fluents.length;i++) for(let j=i+1;j<fluents.length;j++) {
    const a=fluents[i].match(/On\((.),(.)\)/u),b=fluents[j].match(/On\((.),(.)\)/u);
    if(a[1]===b[1] || a[2]===b[2] || (a[1]===b[2] && a[2]===b[1])) constraints.push([`¬${fluents[i]}`,`¬${fluents[j]}`]);
  }
  if(blocks.length===3) { const [x,y,z]=blocks; constraints.push([`¬On(${x},${y})`,`¬On(${y},${z})`,`¬On(${z},${x})`],[`¬On(${x},${z})`,`¬On(${z},${y})`,`¬On(${y},${x})`]); }
  return {fluents,actions,constraints};
}
export function plan(options) {
  const example = planningExamples[options.example || 'two'];
  if(!example) throw new Error('Choose a planning example.');
  const horizon = Number(options.horizon ?? example.horizon);
  if(!Number.isInteger(horizon) || horizon<1 || horizon>6) throw new Error('Use a horizon from 1 to 6.');
  const domain=world(example), ids=new Map(), names=[];
  const id=name=>{ if(!ids.has(name)) { names.push(name); ids.set(name,names.length); } return ids.get(name); };
  const lit=(name,t)=> name.startsWith('¬') ? -id(`${name.slice(1)}@${t}`) : id(`${name}@${t}`);
  const clauses=[];
  const add=c=>clauses.push([...new Set(c)]);
  // The initial state is complete; a goal may leave some fluents unspecified.
  function entries(text,time) {
    if(text.length>1000) throw new Error('Use a shorter state description.');
    const parts=planningAtoms(text,time);
    if(parts.some(p=>!domain.fluents.includes(p.replace(/^¬/u,'')))) throw new Error(`Use these state atoms: ${domain.fluents.join(', ')}. Prefix a false atom with ¬.`);
    return parts;
  }
  const initial=entries(options.initial ?? example.initial,0), goal=entries(options.goal ?? example.goal,horizon);
  if(!goal.length) throw new Error('Enter at least one goal.');
  if(options.completeInitial !== false) for(const f of domain.fluents) add([lit(initial.includes(f)?f:`¬${f}`,0)]);
  for(const f of initial) add([lit(f,0)]);
  for(const f of goal) add([lit(f,horizon)]);
  for(let t=0;t<=horizon;t++) {
    domain.fluents.forEach(f=>id(`${f}@${t}`));
    domain.constraints.forEach(c=>add(c.map(f=>lit(f,t))));
  }
  const preferred=[];
  for(let t=0;t<horizon;t++) {
    const actions=domain.actions.map(a=>lit(a.name,t));
    add(actions);
    for(let i=0;i<actions.length;i++) for(let j=i+1;j<actions.length;j++) add([-actions[i],-actions[j]]);
    preferred.push(lit('Wait',t),...domain.actions.filter(a=>a.name!=='Wait').map(a=>lit(a.name,t)));
    for(const a of domain.actions) {
      const action=lit(a.name,t);
      a.pre.forEach(f=>add([-action,lit(f,t)]));
      a.add.forEach(f=>add([-action,lit(f,t+1)]));
      a.remove.forEach(f=>add([-action,lit(`¬${f}`,t+1)]));
    }
  }
  // Tseytin encoding of the editable, instantiated frame formulas.
  let auxiliary=0;
  function encode(tree) {
    if(!tree.children.length) {
      if(tree.label==='TRUE'||tree.label==='FALSE') {const v=id(`constant-${tree.label}`);add([tree.label==='TRUE'?v:-v]);return v;}
      if(!/^V\d+$/u.test(tree.label)) throw new Error(`Unknown name ${tree.label} in frame formula.`);
      return Number(tree.label.slice(1));
    }
    const a=encode(tree.children[0]); if(tree.label==='¬') return -a;
    const b=encode(tree.children[1]),p=id(`aux-${++auxiliary}`);
    if(tree.label==='∧') {add([-p,a]);add([-p,b]);add([p,-a,-b]);}
    else if(tree.label==='∨') {add([p,-a]);add([p,-b]);add([-p,a,b]);}
    else if(tree.label==='→') {add([p,a]);add([p,-b]);add([-p,-a,b]);}
    else if(tree.label==='↔') {add([-p,-a,b]);add([-p,a,-b]);add([p,a,b]);add([p,-a,-b]);}
    else throw new Error('Use ¬, ∧, ∨, → or ↔ in frame formulas.');
    return p;
  }
  const frames=options.frames || ['', ''];
  for(const field of frames) {
    if(field.length>2000)throw new Error('Use at most 2000 characters per frame box.');
    for(const source of field.split(/[\n;]+/u).map(line=>line.trim().replace(/[.。]+$/u,''))) {
    if(!source.trim()) continue;
    if(source.length>500) throw new Error('Use at most 500 characters per frame formula.');
    if(/\bV\d+\b/u.test(source)) throw new Error('Use the named fluents and actions in the frame formula.');
    for(let t=0;t<horizon;t++) for(const f of example.blocks || /\bF\s*\(/u.test(source) ? domain.fluents : [null]) {
      let text=conditionalNotation(source);
      if(example.blocks) {
        const match=f.match(/On\((.),(.)\)/u);
        text=text.replace(/\bX\b/gu,match[1]).replace(/\bY\b/gu,match[2]);
        text=text.replace(/(On|Stack|Unstack)\s*\(\s*([RGB])\s*,?\s*([RGB])\s*,?\s*t\s*(\+\s*1)?\s*\)/gu,(_,op,x,y,next)=>{
          const name=`${op}(${x},${y})`, time=t+(next?1:0);
          if(![...domain.fluents,...domain.actions.map(a=>a.name)].includes(name) || (op!=='On' && time>=horizon)) throw new Error('A frame formula refers to an unavailable fluent or action.');
          return `V${id(`${name}@${time}`)}`;
        });
      } else {
        text=text.replace(/\b(BoxUnderBanana|OnBox|HasBanana|PushBox|Climb|TakeBanana|Wait)\s*\(\s*t\s*(\+\s*1)?\s*\)/gu,(_,name,next)=>{
          if(next && !domain.fluents.includes(name))throw new Error('Actions in frame conditions occur at t; state atoms may use t or t+1.');
          return `V${lit(name,t+(next?1:0))}`;
        });
        const changes=kind=>or(domain.actions.filter(a=>a[kind].includes(f)).map(a=>node(`V${lit(a.name,t)}`)));
        // Replace Add/Remove with placeholder atoms, then expand their AST nodes.
        if(f!==null)text=text.replace(/Remove\(\s*F\s*,?\s*t\s*\)/gu,'REMOVE').replace(/Add\(\s*F\s*,?\s*t\s*\)/gu,'ADD').replace(/F\(\s*t\s*\+\s*1\s*\)/gu,`V${lit(f,t+1)}`).replace(/F\(\s*t\s*\)/gu,`V${lit(f,t)}`);
        const expand=tree=>tree.label==='REMOVE'?changes('remove'):tree.label==='ADD'?changes('add'):{...tree,children:tree.children.map(expand)};
        add([encode(expand(parseBoolean(text).tree))]); continue;
      }
      add([encode(parseBoolean(text).tree)]);
    }
  }
  }
  const solved=solveCNF(clauses,names.length,preferred,3000000);
  if(!solved.model) return {status:'unsat',horizon,variables:names.length,clauses:clauses.length};
  const value=(name,t)=>solved.model[id(`${name}@${t}`)]===1;
  const states=Array.from({length:horizon+1},(_,t)=>({time:t,true:domain.fluents.filter(f=>value(f,t)),action:t<horizon?domain.actions.find(a=>value(a.name,t))?.name:null}));
  const miracles=[];
  for(let t=0;t<horizon;t++) {
    const a=domain.actions.find(a=>a.name===states[t].action);
    for(const f of domain.fluents) if(value(f,t)!==value(f,t+1) && !(value(f,t+1)?a.add:a.remove).includes(f)) miracles.push({time:t+1,fluent:f});
  }
  return {status:'sat',states,miracles,horizon,variables:names.length,clauses:clauses.length,model:solved.model,cnf:clauses};
}

// Enumerate only the small display worlds; SAT solving still determines plans.
export function blockArrangements(blocks) {
  const states=[];
  function choose(index,below) {
    if(index===blocks.length) {
      const supports=[...below.values()];if(new Set(supports).size!==supports.length)return;
      for(const block of blocks) {const seen=new Set();let next=block;while(below.has(next)){if(seen.has(next))return;seen.add(next);next=below.get(next);}}
      states.push([...below].map(([a,b])=>`On(${a},${b})`));return;
    }
    const block=blocks[index];choose(index+1,below);
    for(const support of blocks.filter(b=>b!==block)){below.set(block,support);choose(index+1,below);below.delete(block);}
  }
  choose(0,new Map());return states;
}

// Check a student's state description against the depicted task, not against spelling.
export function checkPlanningStates(exampleName, initialText, goalText, complete=true, horizon=planningExamples[exampleName].horizon) {
  const example=planningExamples[exampleName],domain=world(example);
  const entries=planningAtoms;
  const initial=entries(initialText,0),goal=entries(goalText,horizon);
  if([...initial,...goal].some(p=>!domain.fluents.includes(p.replace(/^¬/u,''))))throw new Error('Use only the state atoms in your language.');
  const states=example.blocks?blockArrangements(example.blocks):Array.from({length:2**domain.fluents.length},(_,i)=>domain.fluents.filter((_,j)=>i&(1<<j)));
  const satisfies=(state,conditions,closed)=>conditions.every(f=>f.startsWith('¬')?!state.includes(f.slice(1)):state.includes(f))&&(!closed||state.every(f=>conditions.includes(f)));
  const same=(submitted,expected,closed)=>states.every(state=>satisfies(state,submitted,closed)===satisfies(state,expected,closed));
  // The pictured initial configuration specifies the complete state; goals may be partial.
  const initialCorrect=states.every(state=>satisfies(state,initial,complete)===satisfies(state,entries(example.initial),true));
  return {initial:initialCorrect,goal:same(goal,entries(example.goal),false)};
}
