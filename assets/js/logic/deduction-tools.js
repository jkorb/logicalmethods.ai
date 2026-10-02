import {ast,formula,same,printFormula,emptyProof,addAssumption,infer,validateProof,extractProof} from './deduction.js';
const requireThat=(ok,message)=>{if(!ok)throw Error(message);};
// Delete the selected step and every step depending on it, including discharge references.
export function deleteStep(data,id){
  const proof=validateProof(data),removed=new Set([id]),mapping=new Map();let result=emptyProof();
  for(const n of proof.nodes){if(removed.has(n.id)||[...n.parents,...n.discharge].some(i=>removed.has(i))){removed.add(n.id);continue;}
    mapping.set(n.id,result.nodes.length);result=n.rule==='assumption'?addAssumption(result,n.formula):infer(result,n.rule,n.parents.map(i=>mapping.get(i)),{formula:n.extra,discharge:n.discharge.map(i=>mapping.get(i))});}
  return result;
}
const isMeta=t=>!t.children.length&&/^[A-Z]$/.test(t.label);
export function makeLemma(data,root,name='Lemma'){
  const out=extractProof(validateProof(data),root),metas=new Set();
  function scan(t){if(isMeta(t))metas.add(t.label);t.children.forEach(scan);}out.proof.nodes.forEach(n=>scan(n.formula));
  return {...out,name:String(name).slice(0,60)||'Lemma',metas:[...metas].sort()};
}
export function lemmaMatch(data,lemma,selected,provided={}){
  const saved=makeLemma(lemma.proof,lemma.root,lemma.name),node=saved.proof.nodes[saved.root],bindings={};
  requireThat(selected.length===node.open.length,`Select ${node.open.length} premise(s) for ${saved.name}, in the displayed order.`);
  for(const [k,v] of Object.entries(provided))if(saved.metas.includes(k))bindings[k]=typeof v==='string'?formula(v):formula(printFormula(v));
  function match(pattern,value){
    if(isMeta(pattern)){if(bindings[pattern.label])requireThat(same(bindings[pattern.label],value),`Use the same formula for ${pattern.label} throughout the rule.`);else bindings[pattern.label]=value;return;}
    requireThat(pattern.label===value.label&&pattern.children.length===value.children.length,'The selected premises do not match this derived rule.');pattern.children.forEach((t,i)=>match(t,value.children[i]));
  }
  node.open.forEach((id,i)=>{requireThat(data.nodes[selected[i]],'Unknown selected premise.');match(saved.proof.nodes[id].formula,data.nodes[selected[i]].formula);});
  return {saved,bindings,missing:saved.metas.filter(k=>!bindings[k])};
}
export function applyLemma(data,lemma,selected,provided={}){
  let proof=validateProof(data);const {saved,bindings,missing}=lemmaMatch(proof,lemma,selected,provided);
  requireThat(!missing.length,`Choose a formula for ${missing.join(', ')}.`);
  const substitute=t=>isMeta(t)?bindings[t.label]:ast(t.label,...t.children.map(substitute));
  // Substitute premise derivations directly. Each discharge gets a fresh local
  // assumption, scoped to its own branch; it cannot capture an input dependency.
  const inputs=new Map(saved.proof.nodes[saved.root].open.map((id,i)=>[id,selected[i]])),memo=new Map();
  function replay(id,bound=new Map()){
    const key=JSON.stringify([id,[...bound]]);if(memo.has(key))return memo.get(key);
    const n=saved.proof.nodes[id];
    if(n.rule==='assumption'){
      const mapped=bound.has(id)?bound.get(id):inputs.get(id);
      requireThat(mapped!==undefined,'A saved assumption is outside its discharge scope.');return mapped;
    }
    const discharge=n.discharge.map(old=>{const fresh=proof.nodes.length;proof=addAssumption(proof,substitute(saved.proof.nodes[old].formula));return fresh;});
    const parents=n.parents.map((parent,index)=>{const scope=new Map(bound);
      n.discharge.forEach((old,i)=>{if(n.rule!=='orE'||index===i+1)scope.set(old,discharge[i]);});
      return replay(parent,scope);
    });
    proof=infer(proof,n.rule,parents,{formula:n.extra?printFormula(substitute(formula(n.extra))):'',discharge});
    const result=proof.nodes.length-1;memo.set(key,result);return result;
  }
  const root=replay(saved.root);
  return {proof,root};
}
export function loadWorkspace(data){
  requireThat(data?.format==='logicalmethods-nd'&&data.version===1,'Choose a saved natural deduction workspace.');
  requireThat(Array.isArray(data.lemmas)&&data.lemmas.length<=30,'Use at most 30 saved rules.');
  return {proof:validateProof(data.proof),lemmas:data.lemmas.map(l=>makeLemma(l.proof,l.root,l.name))};
}
const texOps={'∧':'\\land','∨':'\\lor','→':'\\to','↔':'\\leftrightarrow','¬':'\\neg','⊥':'\\bot','⊤':'\\top'};
export function formulaTeX(t){
  if(!t.children.length){if(texOps[t.label])return texOps[t.label];const s=t.label.replace(/_/g,'\\_').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]);return s.length===1?s:`\\mathrm{${s}}`;}
  if(t.label==='¬')return '\\neg '+formulaTeX(t.children[0]);return '('+t.children.map(formulaTeX).join(' '+texOps[t.label]+' ')+')';
}
export function toProofSty(data,root=data.nodes.length-1){
  const proof=validateProof(data);requireThat(proof.nodes[root],'Select a conclusion to export.');let visits=0;
  const labels={andI:'\\land I',andL:'\\land E',andR:'\\land E',orL:'\\lor I',orR:'\\lor I',orE:'\\lor E',impI:'\\to I',impE:'\\to E',notI:'\\neg I',notE:'\\neg E',falseE:'\\bot E',raa:'\\mathrm{RAA}',trueI:'\\top I',iffI:'\\leftrightarrow I',iffL:'\\leftrightarrow E',iffR:'\\leftrightarrow E'};
  function tree(id,bound=new Set()){
    requireThat(++visits<4000,'Export a smaller derivation.');const n=proof.nodes[id],f=formulaTeX(n.formula);
    if(n.rule==='assumption')return (bound.has(id)?'['+f+']':f)+`^{h_{${id}}}`;
    const children=n.parents.map((p,i)=>tree(p,new Set([...bound,...(n.rule==='orE'?(i?[n.discharge[i-1]]:[]):n.discharge)])));
    return `\\infer[${labels[n.rule]}${n.discharge.length?', '+n.discharge.map(i=>`h_{${i}}`).join(', '):''}]{${f}}{${children.join(' & ')}}`;
  }
  return '\\documentclass{article}\n\\usepackage{amsmath,amssymb,proof}\n\\begin{document}\n\\[\n'+tree(root)+'\n\\]\n\\end{document}\n';
}
