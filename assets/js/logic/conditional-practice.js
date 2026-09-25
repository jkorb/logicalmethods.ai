import { planningAtoms } from './planning-input.js';
import { parseBoolean, evaluateTrace } from './boolean.js';
import { valuations } from './sat.js';
import { conditionalNotation } from './conditionals.js';

// Horn-definable sets of valuations are exactly those closed under intersection.
export function hornWitness(source, names=['RAIN','SUN','SNOW']) {
  if(source.length>512)throw new Error('Use at most 512 characters.');
  const parsed=parseBoolean(conditionalNotation(source));
  if(parsed.names.some(n=>!names.includes(n)))throw new Error('Use only '+names.join(', ')+'.');
  const rows=valuations(names),values=rows.map(v=>evaluateTrace(parsed.tree,v).at(-1).value);
  const models=rows.filter((_,i)=>values[i]);
  for(const first of models)for(const second of models) {
    const intersection=Object.fromEntries(names.map(n=>[n,first[n]&second[n]]));
    if(!evaluateTrace(parsed.tree,intersection).at(-1).value)return {horn:false,first,second,intersection,signature:values.join('')};
  }
  return {horn:true,signature:values.join('')};
}
export function startChaining(kb,goal,method) {
  const facts=kb.rules.filter(r=>!r.body.length).map(r=>r.head);
  return {method,goal,known:[...new Set(facts)],proofs:Object.fromEntries(facts.map(f=>[f,{label:f,children:[]}])),nodes:[{id:0,label:goal,parent:null,children:[],tried:[],status:'open'}],log:[]};
}
export function chainStep(kb,previous,action) {
  const state=structuredClone(previous);
  if(state.method==='forward') {
    if(action.type==='finish') {
      if(kb.rules.some(r=>!state.known.includes(r.head)&&r.body.every(p=>state.known.includes(p))))throw new Error('A rule can still add a fact.');
      state.finished=true;state.log.push('No rule can add a new fact.');return state;
    }
    const r=kb.rules[action.rule];
    if(!r || !r.body.every(p=>state.known.includes(p)))throw new Error('First derive every premise of this rule.');
    const selected=action.premises || [];
    if(selected.length!==r.body.length || new Set(selected).size!==selected.length || !r.body.every(p=>selected.includes(p)))throw new Error('Select exactly the known premises of this conditional.');
    if(state.known.includes(r.head))throw new Error('This fact is already known. Choose a rule that adds a fact.');
    state.known.push(r.head);state.proofs[r.head]={label:r.head,text:r.text,children:r.body.map(p=>state.proofs[p])};state.log.push('Derive '+r.head+' using '+r.text);return state;
  }
  const node=state.nodes[action.node];
  if(!node || node.status!=='open')throw new Error('Select an open goal.');
  const ancestors=[];let parent=node.parent;while(parent!==null){ancestors.push(state.nodes[parent].label);parent=state.nodes[parent].parent;}
  const circular=ancestors.includes(node.label);
  if(action.type==='fact') {
    if(!state.known.includes(node.label))throw new Error('This goal is not a given fact.');
    node.status='proved';state.log.push(node.label+' is given.');
  } else if(action.type==='fail') {
    if(state.known.includes(node.label)||!circular&&kb.rules.some((r,i)=>r.head===node.label&&!node.tried.includes(i)))throw new Error('There is still a fact or an untried rule for this goal.');
    node.status='failed';state.log.push(circular?'The goal '+node.label+' repeats on this branch.':'No remaining rule proves '+node.label+'.');
  } else {
    const r=kb.rules[action.rule];
    if(circular)throw new Error('This goal already occurs on the active branch. Mark this attempt as failed.');
    if(!r || r.head!==node.label || !r.body.length)throw new Error('Choose a rule whose conclusion is the selected goal, or use Given fact.');
    if(node.tried.includes(action.rule))throw new Error('This rule has already been tried for this goal.');
    node.tried.push(action.rule);node.rule=action.rule;node.status='waiting';
    node.children=r.body.map(label=>{const id=state.nodes.length;state.nodes.push({id,label,parent:node.id,children:[],tried:[],status:'open'});return id;});
    state.log.push('To prove '+node.label+', prove '+r.body.join(' and ')+'.');
  }
  // Return from completed branches; retain failed choices so another rule can be tried.
  for(let i=state.nodes.length-1;i>=0;i--) {
    const n=state.nodes[i];if(n.status!=='waiting')continue;
    if(n.children.some(id=>state.nodes[id].status==='failed')) {
      const abandon=id=>{state.nodes[id].status='abandoned';state.nodes[id].children.forEach(abandon);};
      n.children.forEach(abandon);n.children=[];n.status='open';state.log.push('Return to '+n.label+' and try another rule.');
    } else if(n.children.every(id=>state.nodes[id].status==='proved'))n.status='proved';
  }
  return state;
}
export function studentProof(kb,state,id=0) {
  const n=state.nodes[id];return {label:n.label,pending:n.status!=='proved',text:n.rule===undefined?'':kb.rules[n.rule].text,children:n.children.map(child=>studentProof(kb,state,child))};
}

export function checkPlanningLanguage(source,example) {
  let parts;try {parts=planningAtoms(source);}catch {return false;}
  const expected=example==='three'?['On(R,B)','On(G,B)','On(B,R)','On(B,G)']:['BoxUnderBanana','OnBox','HasBanana'];
  return parts.length===expected.length && new Set(parts).size===parts.length && expected.every(s=>parts.includes(s));
}
