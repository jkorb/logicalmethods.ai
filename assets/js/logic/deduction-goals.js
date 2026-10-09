// A proof plan is separate from a checked proof. Holes never enter the kernel.
import {formula,ast,same,printFormula,addAssumption,infer,validateProof,RULES} from './deduction.js';
import {substND,freeND} from './deduction-fol.js';
import {parseInference} from './fol-inference.js';
import {isVariable} from './fol-parser.js';
import {leanPrint} from './fol-lean.js';
import {toLean,renderLeanDraft} from './deduction-lean.js';
const requireThat=(ok,message)=>{if(!ok)throw Error(message);};
export function newGoal(source,context=[]){return {formula:typeof source==='string'?formula(source):formula(printFormula(source)),context:[...context],rule:null,children:[],discharge:[],extra:''};}
export function goalAt(plan,path){return path.reduce((g,i)=>g.children[i],plan);}
export function matchingProof(proof,goal){return proof.nodes.find(n=>same(n.formula,goal.formula)&&n.open.every(id=>goal.context.includes(id)))?.id;}
export function backwardRules(goal){const op=goal.formula.label;return [...(op.startsWith('∀')?['forallI']:op.startsWith('∃')?['existsI']:[]),'forallE','existsE',...({ '∧':['andI'],'∨':['orL','orR'],'→':['impI'],'¬':['notI'],'↔':['iffI'],'⊤':['trueI'],'⊥':['notE']}[op]||[]),'impE','andL','andR','orE','iffL','iffR','falseE','raa'];}
export function expandGoal(data,plan,path,rule,extra=''){
  let proof=data;const out=structuredClone(plan),g=goalAt(out,path),f=g.formula;
  requireThat(!g.rule,'This goal already has a proposed rule.');requireThat(backwardRules(g).includes(rule),'This rule cannot produce the selected goal.');
  const sub=(f,context=g.context)=>newGoal(f,context),other=()=>formula(extra),assume=f=>{const id=proof.nodes.length;proof=addAssumption(proof,f);g.discharge.push(id);return id;};
  g.rule=rule;g.parameter=extra;g.extra='';
  switch(rule){
    case 'forallI':{const v=f.label.slice(1);requireThat(g.context.every(id=>!freeND(proof.nodes[id].formula).includes(v)),'The arbitrary variable is free in an available assumption. Rename the goal binder first.');g.variable=v;g.children=[sub(f.children[0])];break;}
    case 'existsI':g.term=extra;g.extra=printFormula(f);g.children=[sub(substND(f.children[0],f.label.slice(1),parseInference(extra,'term')))];break;
    case 'forallE':{const [source,witness]=extra.split(';').map(s=>s.trim());const universal=formula(source);requireThat(universal.label.startsWith('∀'),'Supply a universal formula, then a semicolon and its instance term.');requireThat(same(substND(universal.children[0],universal.label.slice(1),parseInference(witness,'term')),f),'That instance does not match the goal.');g.term=witness;g.children=[sub(universal)];break;}
    case 'existsE':{const [source,v]=extra.split(';').map(s=>s.trim()),existential=formula(source);requireThat(existential.label.startsWith('∃')&&isVariable(v||''),'Supply an existential formula, then a semicolon and a fresh variable.');requireThat(!freeND(f).includes(v)&&!freeND(existential).includes(v)&&g.context.every(id=>!freeND(proof.nodes[id].formula).includes(v)),'The witness variable must be fresh for this goal and its assumptions.');g.variable=v;const id=assume(substND(existential.children[0],existential.label.slice(1),parseInference(v,'term')));g.children=[sub(existential),sub(f,[...g.context,id])];break;}

    case 'andI':g.children=f.children.map(c=>sub(c));break;
    case 'orL':case 'orR':{const i=rule==='orL'?0:1;g.children=[sub(f.children[i])];g.extra=printFormula(f.children[1-i]);break;}
    case 'impI':case 'notI':{const id=assume(f.children[0]);g.children=[sub(rule==='impI'?f.children[1]:ast('⊥'),[...g.context,id])];break;}
    case 'raa':{const id=assume(ast('¬',f));g.children=[sub(ast('⊥'),[...g.context,id])];break;}
    case 'impE':{const a=other();g.children=[sub(ast('→',a,f)),sub(a)];break;}
    case 'notE':{const a=other();g.children=[sub(ast('¬',a)),sub(a)];break;}
    case 'andL':g.children=[sub(ast('∧',f,other()))];break;
    case 'andR':g.children=[sub(ast('∧',other(),f))];break;
    case 'iffL':case 'iffR':requireThat(f.label==='→','Select a conditional goal.');g.children=[sub(ast('↔',...(rule==='iffL'?f.children:[...f.children].reverse())))];break;
    case 'iffI':g.children=[sub(ast('→',...f.children)),sub(ast('→',...[...f.children].reverse()))];break;
    case 'orE':{const disjunction=other();requireThat(disjunction.label==='∨','Supply the disjunction for the two cases.');g.children=[sub(disjunction),...disjunction.children.map(c=>{const id=assume(c);return sub(f,[...g.context,id]);})];break;}
    case 'falseE':g.children=[sub(ast('⊥'))];g.extra=printFormula(f);break;
    case 'trueI':break;
  }
  return {proof,plan:out};
}
// Resolve only within each goal's scope, then replay the proposed rule in the kernel.
export function settleGoals(data,plans){
  let proof=data;const result=structuredClone(plans);
  function visit(g){
    const match=matchingProof(proof,g);if(match!==undefined){g.solved=match;return match;}
    delete g.solved;if(!g.rule)return undefined;
    const parents=g.children.map(visit);if(parents.some(i=>i===undefined))return undefined;
    proof=infer(proof,g.rule,parents,{formula:g.extra,term:g.term,variable:g.variable,discharge:g.discharge});
    const n=proof.nodes.at(-1);requireThat(same(n.formula,g.formula)&&n.open.every(i=>g.context.includes(i)),'The proposed rule does not prove this goal in its scope.');g.solved=n.id;return n.id;
  }
  result.forEach(visit);return {proof,plans:result};
}
export function validateGoals(proof,plans){
  requireThat(Array.isArray(plans)&&plans.length<=30,'Use at most 30 goal trees.');let count=0;
  function read(g,parentContext){
    requireThat(++count<=200&&g&&Array.isArray(g.context)&&Array.isArray(g.children),'Invalid goal tree.');
    requireThat(g.context.every(id=>Number.isInteger(id)&&proof.nodes[id]?.rule==='assumption'),'Unknown goal assumption.');
    const clean=newGoal(g.formula,g.context);
    if(parentContext)requireThat(clean.context.length===parentContext.length&&clean.context.every((id,i)=>id===parentContext[i]),'A subgoal has an invalid assumption scope.');
    if(!g.rule){requireThat(!g.children.length,'A goal without a rule cannot have subgoals.');return clean;}
    // Reconstruct the rule shape with fresh hypotheses, then compare the stored scopes.
    const expanded=expandGoal(proof,clean,[],g.rule,g.parameter||''),expected=expanded.plan;
    requireThat(Array.isArray(g.discharge)&&g.discharge.length===expected.discharge.length&&new Set(g.discharge).size===g.discharge.length,'Invalid discharge plan.');
    const ids=new Map(expected.discharge.map((id,i)=>[id,g.discharge[i]]));
    expected.discharge.forEach((id,i)=>{const old=g.discharge[i];requireThat(proof.nodes[old]?.rule==='assumption'&&!g.context.includes(old)&&same(proof.nodes[old].formula,expanded.proof.nodes[id].formula),'Invalid local assumption.');});
    requireThat(g.children.length===expected.children.length,'Invalid subgoals.');
    clean.rule=g.rule;clean.extra=expected.extra;clean.term=expected.term;clean.variable=expected.variable;clean.parameter=g.parameter||'';clean.discharge=[...g.discharge];
    clean.children=expected.children.map((c,i)=>{requireThat(same(c.formula,formula(printFormula(g.children[i].formula))),'Wrong subgoal formula.');return read(g.children[i],c.context.map(id=>ids.get(id)??id));});return clean;
  }
  return plans.map(g=>read(g));
}
export function goalHint(proof,g){
  if(matchingProof(proof,g)!==undefined)return 'This goal already has a derivation from the assumptions available here.';
  if(g.rule)return 'Select an unfinished subgoal above this proposed inference.';
  if(g.formula.label.startsWith('∀'))return '∀ Intro: prove the body for its arbitrary variable. Check that it is absent from open assumptions.';
  if(g.formula.label.startsWith('∃'))return '∃ Intro: choose a witness term, then prove the formula for that witness. An existential premise can supply an unknown witness through ∃ Elim.';
  const names={'∧':'∧ Intro: prove both conjuncts.','∨':'∨ Intro: choose a disjunct to prove.','→':'→ Intro: assume the antecedent and prove the consequent.','¬':'¬ Intro: assume the unnegated formula and derive ⊥.','↔':'↔ Intro: prove both conditionals.','⊤':'⊤ Intro needs no premises.','⊥':'¬ Elim: find a formula and its negation.'};
  const conditional=proof.nodes.find(n=>n.formula.label==='→'&&same(n.formula.children[1],g.formula)&&n.open.every(i=>g.context.includes(i)));
  return conditional?'Use → Elim backwards with '+printFormula(conditional.formula)+'. The remaining goal is '+printFormula(conditional.formula.children[0])+'.':names[g.formula.label]||'Look for a conditional with this conclusion, or a conjunction containing it. You can also try proof by contradiction.';
}
export function goalToLean(data,plan){
  const proof=validateProof(data),checked=validateGoals(proof,[plan])[0];let holes=false;
  // Keep partial plans separate from checked proof data. In particular, an open
  // quantified body is a hole, not an assumption eligible for generalization.
  function build(g){const match=matchingProof(proof,g);if(match!==undefined)return match;
    const parents=g.children.map(build),id=proof.nodes.length;
    if(!g.rule)holes=true;
    proof.nodes.push({id,rule:g.rule||'hole',formula:g.formula,parents,discharge:g.discharge,extra:g.extra,term:g.term,variable:g.variable,open:g.context});return id;
  }
  const id=build(checked);return holes?renderLeanDraft(proof,id):toLean(proof,id);
}

// Replay an authored proof as backwards choices, using exactly its inference rules.
export function strategyFrames(example,solution){
  let proof=example.premises.reduce((p,f)=>addAssumption(p,f),{version:1,nodes:[]}),plans=[newGoal(example.goal,proof.nodes.map(n=>n.id))];
  const frames=[],record=text=>frames.push({proof:structuredClone(proof),plans:structuredClone(plans),text});
  record('Start with the goal '+example.goal+'.');
  function visit(id,path){const g=goalAt(plans[0],path),n=solution.proof.nodes[id];if(g.solved!==undefined||matchingProof(proof,g)!==undefined)return;
    if(n.rule==='assumption')throw Error('The example needs an assumption outside this goal’s scope.');
    const fs=n.parents.map(i=>solution.proof.nodes[i].formula);let parameter='';
    if(n.rule==='impE')parameter=printFormula(fs[1]);if(n.rule==='notE')parameter=printFormula(fs[1]);
    if(n.rule==='andL'||n.rule==='andR')parameter=printFormula(fs[0].children[n.rule==='andL'?1:0]);
    if(n.rule==='orE')parameter=printFormula(fs[0]);
    const out=expandGoal(proof,plans[0],path,n.rule,parameter);proof=out.proof;plans=[out.plan];
    const settled=settleGoals(proof,plans);proof=settled.proof;plans=settled.plans;
    record('Work backwards from '+printFormula(g.formula)+' using '+RULES[n.rule][0]+'. '+(n.rule==='raa'?'Assume its negation and seek a contradiction.':'The premises of this rule become subgoals; available proofs close matching goals.'));
    n.parents.forEach((parent,i)=>visit(parent,[...path,i]));
  }
  visit(solution.root,[]);const out=settleGoals(proof,plans);proof=out.proof;plans=out.plans;record('All goals have derivations. The proposed inferences are now checked proof steps.');return frames;
}
