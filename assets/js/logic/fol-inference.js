// First-order inference uses the same typed trees as chapter 8.
import {parseFOL, printFOL, freeVariables, isVariable} from './fol-parser.js';
export {printFOL, freeVariables};
export const node=(kind,name,children=[],extra={})=>({kind,name,label:name,children,...extra});
export const variable=name=>node('variable',name);
export const skolemName=index=>'sk'+String(index).replace(/[0-9]/g,d=>'₀₁₂₃₄₅₆₇₈₉'[Number(d)]);
const con=(name,...children)=>node('connective',name,children);
const equal=(a,b)=>printFOL(a)===printFOL(b);
const check=(ok,message)=>{if(!ok)throw Error(message);};
export function signature(source){
  // Teaching input convention: capitalized predicates, lowercase functions,
  // explicit argument brackets. Constants may use either case.
  const functions={},predicates={},constants=new Set();
  const names=[...source.matchAll(/[A-Za-z][A-Za-z0-9_₀₁₂₃₄₅₆₇₈₉]*/gu)];
  for(const m of names){const name=m[0];if(isVariable(name))continue;
    let i=m.index+name.length;while(/\s/.test(source[i]||'')&&i<source.length)i++;
    if(source[i]==='('){let depth=1,arity=1,j=i+1;for(;j<source.length&&depth;j++){if(source[j]==='(')depth++;if(source[j]===')')depth--;if(source[j]===','&&depth===1)arity++;}
      check(!depth,'Unmatched argument brackets.');const table=/^[A-Z]/.test(name)?predicates:functions;
      check(!table[name]||table[name]===arity,`Use one arity for ${name}.`);table[name]=arity;
    }else constants.add(name);
  }
  for(const name of [...Object.keys(functions),...Object.keys(predicates)])check(!constants.has(name),`Use arguments consistently for ${name}.`);
  return {constants:[...constants],functions,predicates};
}
export function parseInference(source,kind='formula',language=signature(source)){
  return parseFOL(source,{kind,language,mode:'conventional'});
}
export function allNames(t){return [t.name,...(t.variable?[t.variable]:[]),...t.children.flatMap(allNames)];}
export function substitute(t,bindings){
  if(t.kind==='variable')return bindings[t.name]||t;
  if(t.kind==='quantifier'){
    const rest={...bindings};delete rest[t.variable];
    for(const name of freeVariables(t.children[0]))if(rest[name]&&freeVariables(rest[name]).includes(t.variable))throw Error(`Substitution would capture ${t.variable}; rename the bound variable first.`);
    return {...t,children:[substitute(t.children[0],rest)]};
  }
  return {...t,children:t.children.map(c=>substitute(c,bindings))};
}
export function unify(pairs){
  check(pairs.every(pair=>pair.length===2&&pair.every(t=>['variable','constant','function','predicate','identity'].includes(t.kind))),'Unify terms or atoms; remove quantifier binders and literal signs first.');
  let pending=pairs.map(p=>[...p]),bindings={};const steps=[];
  const record=explanation=>steps.push({pending:structuredClone(pending),formula:pending.map(([a,b])=>`${printFOL(a)} ≐ ${printFOL(b)}`).join('; ')||'No equations remain',explanation,bindings:structuredClone(bindings)});
  record('Find a substitution that makes each pair syntactically identical.');
  for(let count=0;pending.length;count++){
    check(count<512,'Unification exceeded the demonstration limit.');
    let [a,b]=pending.shift();
    if(equal(a,b)){record('Delete an identical pair.');continue;}
    if(b.kind==='variable'&&a.kind!=='variable'){[a,b]=[b,a];pending.unshift([a,b]);record('Orient the variable to the left.');continue;}
    if(a.kind==='variable'){
      if(!['variable','constant','function'].includes(b.kind)||freeVariables(b).includes(a.name))return {ok:false,bindings,steps:[...steps,{pending:[[a,b]],bindings:structuredClone(bindings),formula:`${printFOL(a)} ≐ ${printFOL(b)}`,explanation:'Occurs check failed: no finite term can contain itself as a proper part.'}]};
      const one={[a.name]:b};pending=pending.map(p=>p.map(t=>substitute(t,one)));
      bindings=Object.fromEntries(Object.entries(bindings).map(([k,v])=>[k,substitute(v,one)]));bindings[a.name]=b;record(`Eliminate ${a.name}: substitute ${printFOL(b)} in the remaining equations and compose the substitution.`);continue;
    }
    if(a.kind!==b.kind||a.name!==b.name||a.children.length!==b.children.length||!['function','predicate','identity','constant'].includes(a.kind))return {ok:false,bindings,steps:[...steps,{pending:[[a,b]],bindings:structuredClone(bindings),formula:`${printFOL(a)} ≐ ${printFOL(b)}`,explanation:'Symbol clash: these expressions cannot be unified.'}]};
    pending.unshift(...a.children.map((c,i)=>[c,b.children[i]]));record(`Decompose matching ${a.name} symbols into argument pairs.`);
  }
  return {ok:true,bindings,steps};
}
export const printBindings=b=>'['+Object.entries(b).map(([v,t])=>`${v}/${printFOL(t)}`).join(', ')+']';
let normalizationBudget=0;
function nnf(t,neg=false){
  check(++normalizationBudget<=4096,'Normalization exceeds the demonstration limit.');
  if(t.kind==='quantifier')return {...t,name:neg?(t.name==='∀'?'∃':'∀'):t.name,children:[nnf(t.children[0],neg)]};
  if(t.kind!=='connective')return neg?con('¬',t):t;
  const [a,b]=t.children;
  if(t.name==='¬')return nnf(a,!neg);
  if(t.name==='→')return nnf(con('∨',con('¬',a),b),neg);
  if(t.name==='↔')return nnf(con('∧',con('→',a,b),con('→',b,a)),neg);
  return con(neg?(t.name==='∧'?'∨':'∧'):t.name,nnf(a,neg),nnf(b,neg));
}
export function clausify(inputs){
  check(inputs.length>0&&inputs.length<=9,'Use between one and nine formulas.');
  inputs.forEach(t=>check(freeVariables(t).length===0,'Close free variables with quantifiers before converting to clauses.'));
  normalizationBudget=0;
  const used=new Set(inputs.flatMap(allNames));let v=0,s=0;const steps=[];
  const fresh=prefix=>{let name;do{name=prefix==='x'?prefix+(++v):skolemName(++s);}while(used.has(name));used.add(name);return name;};
  function rename(t,env={}){
    if(t.kind==='variable')return env[t.name]||t;
    if(t.kind==='quantifier'){const name=fresh('x');return {...t,variable:name,children:[rename(t.children[0],{...env,[t.variable]:variable(name)})]};}
    return {...t,children:t.children.map(c=>rename(c,env))};
  }
  let trees=inputs.map(t=>rename(nnf(t)));
  steps.push({formula:trees.map(printFOL).join('; '),explanation:'Eliminate arrows, push negations inward, and give every binder a fresh variable.'});
  function firstExistential(t,path=[],deps=[]){
    if(t.kind==='quantifier'&&t.name==='∃')return {path,t,deps};
    const next=t.kind==='quantifier'?[...deps,t.variable]:deps;
    for(let i=0;i<t.children.length;i++){const found=firstExistential(t.children[i],[...path,i],next);if(found)return found;}
  }
  const replace=(t,path,value)=>path.length?{...t,children:t.children.map((c,i)=>i===path[0]?replace(c,path.slice(1),value):c)}:value;
  for(let i=0;i<trees.length;i++){
    let found;while((found=firstExistential(trees[i]))){const {path,t,deps}=found,name=fresh('sk'),witness=node(deps.length?'function':'constant',name,deps.map(variable));
      trees[i]=replace(trees[i],path,substitute(t.children[0],{[t.variable]:witness}));
      steps.push({formula:trees.map(printFOL).join('; '),explanation:`Replace ∃${t.variable} by the fresh witness ${printFOL(witness)}. Dependencies: ${deps.join(', ')||'none; use a constant'}. Satisfiability is preserved in the expanded language.`});
    }
  }
  const skolemized=trees;
  function clauses(t){
    if(t.kind==='quantifier')return clauses(t.children[0]);
    if(t.name==='∧')return [...clauses(t.children[0]),...clauses(t.children[1])];
    if(t.name==='∨'){const a=clauses(t.children[0]),b=clauses(t.children[1]);check(a.length*b.length<=128,'Distribution exceeds 128 clauses.');return a.flatMap(x=>b.map(y=>[...x,...y]));}
    check(t.kind==='predicate'||t.name==='¬'&&t.children[0].kind==='predicate','Resolution in this app is equality-free.');return [[t]];
  }
  const result=trees.flatMap(clauses).map(unique);check(result.every(c=>c.length<=24),'Use at most 24 literals per clause.');check(result.length<=128,'Use at most 128 clauses.');
  steps.push({formula:result.map(printClause).join('; '),explanation:'Distribute disjunction over conjunction. Read each clause as universally closed; its variables belong to that clause.'});
  return {clauses:result,skolemized,steps};
}
const unique=xs=>[...new Map(xs.map(t=>[printFOL(t),t])).values()];
export const printClause=c=>c.length?c.map(printFOL).join(' ∨ '):'⊥';
const atom=t=>t.name==='¬'?t.children[0]:t;
const negative=t=>t.name==='¬';
function renameClause(c,start){const b={};let i=start;for(const v of new Set(c.flatMap(t=>freeVariables(t))))b[v]=variable('x'+i++);return {clause:c.map(t=>substitute(t,b)),next:i,bindings:b};}
export function resolveClauses(left,right,i,j){
  const a=renameClause(left,1),b=renameClause(right,a.next),l=a.clause[i],r=b.clause[j];
  check(l&&r&&negative(l)!==negative(r),'Select opposite-polarity literals.');
  const u=unify([[atom(l),atom(r)]]);check(u.ok,'The selected pivot atoms do not unify.');
  return {clause:unique([...a.clause.filter((_,k)=>k!==i),...b.clause.filter((_,k)=>k!==j)].map(t=>substitute(t,u.bindings))),bindings:u.bindings,parents:[a.clause,b.clause],pivot:[l,r]};
}
export function factorClause(c,i,j){
  check(i!==j&&c[i]&&c[j]&&negative(c[i])===negative(c[j]),'Select distinct literals of the same polarity.');
  const u=unify([[atom(c[i]),atom(c[j])]]);check(u.ok,'These literals do not unify.');
  return {clause:unique(c.filter((_,k)=>k!==j).map(t=>substitute(t,u.bindings))),bindings:u.bindings,parents:[c],pivot:[c[i],c[j]]};
}
export function readFOLProblem(source){
  check(source.length<=4608,'Use at most 4608 characters.');const split=source.split(/∴|⊨/u);check(split.length<=2,'Use one conclusion.');
  const premises=split[0].split(/[;\n]/).map(s=>s.trim()).filter(Boolean),conclusion=split[1]?.trim();
  check(split.length===1||conclusion,'Supply a conclusion.');const language=signature(source);
  const inputs=premises.map(s=>parseInference(s,'formula',language));if(conclusion)inputs.push(con('¬',parseInference(conclusion,'formula',language)));
  return {...clausify(inputs),conclusion};
}
export function resolutionOptions(clauses){
  const options=[];let attempts=0;const bounded=()=>check(++attempts<=20000,'Step selection stopped at 20,000 candidates; the result is undecided.');
  for(let a=0;a<clauses.length;a++){
    for(let i=0;i<clauses[a].length;i++)for(let j=i+1;j<clauses[a].length;j++)try{bounded();options.push({kind:'factor',a,i,j,...factorClause(clauses[a],i,j)});}catch(error){if(attempts>20000)throw error;}
    for(let b=a;b<clauses.length;b++)for(let i=0;i<clauses[a].length;i++)for(let j=0;j<clauses[b].length;j++)try{bounded();options.push({kind:'resolve',a,b,i,j,...resolveClauses(clauses[a],clauses[b],i,j)});}catch(error){if(attempts>20000)throw error;}
  }
  return options;
}
export function clauseKey(c){return printClause(renameClause(c,1).clause);}
export function nextResolution(clauses){
  check(clauses.length<80,'Search stopped at 80 clauses; the result is undecided.');const known=new Set(clauses.map(clauseKey));
  return resolutionOptions(clauses).filter(o=>!known.has(clauseKey(o.clause))).sort((a,b)=>a.clause.length-b.clause.length)[0];
}
