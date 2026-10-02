// Proof data are independent of the canvas. Only this kernel creates steps.
// Formula ASTs follow the shared parser; later quantifier rules can extend the registry.
import { parseBoolean, printFormula } from './boolean.js';
export { printFormula };
export const ast = (label, ...children) => ({label, children});
export function formula(source) {
  const text=source.replace(/<->/g,'↔').replace(/->/g,'→').replace(/[~!]/g,'¬').replace(/&/g,'∧').replace(/\|/g,'∨').replace(/\bFalse\b|⊥/g,'BOTTOM').replace(/\bTrue\b|⊤/g,'TOP');
  const tree=parseBoolean(text).tree;
  function clean(t){return ast(t.label==='BOTTOM'?'⊥':t.label==='TOP'?'⊤':t.label,...t.children.map(clean));}
  return clean(tree);
}
export const same=(a,b)=>printFormula(a)===printFormula(b);
const insist=(ok,message)=>{if(!ok)throw Error(message);};
export function emptyProof(){return {version:1,nodes:[]};}
export const RULES={
  andI:['∧ Intro',2],andL:['∧ Elim · left',1],andR:['∧ Elim · right',1],
  orL:['∨ Intro · left',1],orR:['∨ Intro · right',1],orE:['∨ Elim',3],
  impI:['→ Intro',1],impE:['→ Elim',2],notI:['¬ Intro',1],notE:['¬ Elim',2],
  falseE:['Ex falso',1],raa:['¬⊥ · classical',1],trueI:['⊤ Intro',0],
  iffI:['↔ Intro',2],iffL:['↔ Elim · →',1],iffR:['↔ Elim · ←',1]
};
export function addAssumption(proof,source){
  insist(proof.nodes.length<200,'Use at most 200 steps in this canvas.');
  const id=proof.nodes.length,tree=typeof source==='string'?formula(source):formula(printFormula(source));
  return {...proof,nodes:[...proof.nodes,{id,rule:'assumption',formula:tree,parents:[],discharge:[],open:[id]}]};
}
export function infer(proof,rule,parents=[],options={}) {
  insist(proof.nodes.length<200,'Use at most 200 steps in this canvas.');
  insist(RULES[rule] && parents.length===RULES[rule][1],`Select ${RULES[rule]?.[1]??'the required'} premise(s) for this rule.`);
  if(['impE','notE'].includes(rule)&&parents.length===2){const [a,b]=parents.map(id=>proof.nodes[id]?.formula),op=rule==='impE'?'→':'¬';if(b?.label===op&&a&&same(b.children[0],a)&&!(a.label===op&&same(a.children[0],b)))parents=[parents[1],parents[0]];}
  if(rule==='orE'&&parents.length===3&&options.discharge?.length===2){
    const [left,right]=options.discharge,lh=proof.nodes[left]?.formula,rh=proof.nodes[right]?.formula;
    const candidates=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]].map(order=>order.map(i=>parents[i])).filter(ids=>{const [a,b,c]=ids.map(i=>proof.nodes[i]);return a?.formula.label==='∨'&&b&&c&&lh&&rh&&same(a.formula.children[0],lh)&&same(a.formula.children[1],rh)&&same(b.formula,c.formula);});
    const cost=ids=>new Set([...proof.nodes[ids[0]].open,...proof.nodes[ids[1]].open.filter(i=>i!==left),...proof.nodes[ids[2]].open.filter(i=>i!==right)]).size;
    if(candidates.length)parents=candidates.sort((a,b)=>cost(a)-cost(b))[0];
  }
  const ps=parents.map(id=>{const n=proof.nodes[id];insist(n && n.id===id,'Unknown premise.');return n;});
  const fs=ps.map(n=>n.formula),op=(i,label)=>insist(fs[i]?.label===label,`Premise ${i+1} must have ${label} as its main connective.`);
  const extra=()=>{insist(options.formula,'Supply the additional formula.');return formula(options.formula);};
  const dis=options.discharge||[];
  let result,open=[...new Set(ps.flatMap(n=>n.open))];
  function hypothesis(i){const h=proof.nodes[dis[i]];insist(h?.rule==='assumption','Choose an assumption to discharge.');return h.formula;}
  function discharge(n){insist(dis.length===n,'Choose the required assumption(s) to discharge.');}
  switch(rule){
    case 'andI':result=ast('∧',...fs);break;
    case 'andL':case 'andR':op(0,'∧');result=fs[0].children[rule==='andL'?0:1];break;
    case 'orL':result=ast('∨',fs[0],extra());break;
    case 'orR':result=ast('∨',extra(),fs[0]);break;
    case 'impE':op(0,'→');insist(same(fs[0].children[0],fs[1]),'The second premise must match the antecedent.');result=fs[0].children[1];break;
    case 'impI':discharge(1);result=ast('→',hypothesis(0),fs[0]);open=open.filter(id=>!dis.includes(id));break;
    case 'notI':discharge(1);op(0,'⊥');result=ast('¬',hypothesis(0));open=open.filter(id=>!dis.includes(id));break;
    case 'notE':op(0,'¬');insist(same(fs[0].children[0],fs[1]),'Select a formula and its negation.');result=ast('⊥');break;
    case 'falseE':op(0,'⊥');result=extra();break;
    case 'raa':discharge(1);op(0,'⊥');insist(hypothesis(0).label==='¬','Discharge a negated assumption for the classical rule.');result=hypothesis(0).children[0];open=open.filter(id=>!dis.includes(id));break;
    case 'orE': {
      discharge(2);op(0,'∨');insist(dis[0]!==dis[1],'Use two distinct case assumptions.');
      insist(same(hypothesis(0),fs[0].children[0]) && same(hypothesis(1),fs[0].children[1]),'Match the left and right case assumptions to the disjunction.');
      insist(same(fs[1],fs[2]),'Both cases must derive the same conclusion.');result=fs[1];
      // Each discharge is LOCAL to its case: no assumptions disappear from the other case or the disjunction.
      open=[...new Set([...ps[0].open,...ps[1].open.filter(id=>id!==dis[0]),...ps[2].open.filter(id=>id!==dis[1])])];break;
    }
    case 'trueI':result=ast('⊤');break;
    case 'iffI':op(0,'→');op(1,'→');insist(same(fs[0].children[0],fs[1].children[1])&&same(fs[0].children[1],fs[1].children[0]),'Use conditionals in opposite directions.');result=ast('↔',...fs[0].children);break;
    case 'iffL':case 'iffR':op(0,'↔');result=ast('→',... (rule==='iffL'?fs[0].children:[...fs[0].children].reverse()));break;
    default:throw Error('Unknown rule.');
  }
  if(!['impI','notI','raa','orE'].includes(rule))insist(!dis.length,'This rule does not discharge assumptions.');
  const id=proof.nodes.length;
  return {...proof,nodes:[...proof.nodes,{id,rule,formula:result,parents:[...parents],discharge:[...dis],extra:options.formula||'',open}]};
}
// Imported data are replayed, never trusted. No stored dependencies or conclusions bypass checking.
export function validateProof(data){
  insist(data?.version===1 && Array.isArray(data.nodes),'Unknown proof format.');
  let proof=emptyProof();
  for(const n of data.nodes){
    insist(n.id===proof.nodes.length,'Steps must be in dependency order.');
    proof=n.rule==='assumption'?addAssumption(proof,printFormula(n.formula)):infer(proof,n.rule,n.parents,{formula:n.extra,discharge:n.discharge});
    insist(same(proof.nodes.at(-1).formula,n.formula),'A recorded conclusion does not follow by this rule.');
  }
  return proof;
}
export function proves(proof,id,premises,goal){
  const n=proof.nodes[id];return !!n && same(n.formula,formula(goal)) && n.open.every(h=>premises.some(p=>same(formula(p),proof.nodes[h].formula)));
}
export function reuseLemma(proof,lemma){
  const checked=validateProof(lemma.proof),root=checked.nodes[lemma.root];
  insist(root && root.open.length===0,'Save a closed derivation as a lemma. Discharge its assumptions first.');
  const offset=proof.nodes.length;let out=proof;
  for(const n of checked.nodes)out=n.rule==='assumption'?addAssumption(out,printFormula(n.formula)):infer(out,n.rule,n.parents.map(id=>id+offset),{formula:n.extra,discharge:n.discharge.map(id=>id+offset)});
  return {proof:out,root:offset+root.id};
}
export function extractProof(proof,root){
  const needed=new Set();function visit(id){if(needed.has(id))return;needed.add(id);const n=proof.nodes[id];[...n.parents,...n.discharge].forEach(visit);}visit(root);
  let out=emptyProof();const ids=new Map();for(const n of proof.nodes){if(!needed.has(n.id))continue;ids.set(n.id,out.nodes.length);out=n.rule==='assumption'?addAssumption(out,printFormula(n.formula)):infer(out,n.rule,n.parents.map(i=>ids.get(i)),{formula:n.extra,discharge:n.discharge.map(i=>ids.get(i))});}
  return {proof:out,root:ids.get(root)};
}
