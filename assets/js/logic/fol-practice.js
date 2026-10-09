import {parseInference,signature,printFOL,freeVariables,substitute,allNames,node,variable,printBindings,skolemName} from './fol-inference.js';
import {isVariable} from './fol-parser.js';
const requireThat=(ok,message)=>{if(!ok)throw Error(message);};
const same=(a,b)=>printFOL(a)===printFOL(b);
const term=t=>['variable','constant','function'].includes(t.kind);
export function startUnification(source){
  const parts=source.split(';').map(s=>s.trim());requireThat(parts.length===2,'Enter two expressions separated by a semicolon.');
  const language=signature(source),read=s=>{try{return parseInference(s,'term',language);}catch{return parseInference(s,'formula',language);}};
  let [a,b]=parts.map(read);
  const negative=t=>t.name==='¬';
  requireThat(negative(a)===negative(b),'These literals have different signs. They cannot be made identical by substitution.');
  if(negative(a)){a=a.children[0];b=b.children[0];}
  requireThat([a,b].every(t=>term(t)||t.kind==='predicate'||t.kind==='identity'),'Use terms, atoms, or literals.');
  requireThat(term(a)===term(b),'Compare two terms or two atoms.');
  return {pending:[[a,b]],bindings:{},done:false,message:'Select an equation and the operation to perform.'};
}
export function unificationStep(state,index,rule,binding=''){
  requireThat(!state.done,'This calculation is complete. Restart to try again.');
  const out=structuredClone(state),pair=out.pending[index];
  if(rule==='finish'){requireThat(!out.pending.length,'Equations remain. Solve them before declaring success.');out.done=true;out.message='Most general unifier: '+printBindings(out.bindings);return out;}
  requireThat(pair,'Select an equation.');const [a,b]=pair;
  if(rule==='delete'){requireThat(same(a,b),'Delete applies only to syntactically identical expressions.');out.pending.splice(index,1);}
  else if(rule==='orient'){requireThat(b.kind==='variable'&&a.kind!=='variable','Orient requires a variable on the right and a nonvariable term on the left.');requireThat(term(a),'A variable can only be replaced by a term.');out.pending[index]=[b,a];}
  else if(rule==='eliminate'){
    requireThat(a.kind==='variable'&&term(b),'Eliminate requires a variable on the left and a term on the right.');
    requireThat(!same(a,b),'Delete this identical pair.');requireThat(!freeVariables(b).includes(a.name),'The variable occurs in its replacement. Use occurs-check failure.');
    const chosen=parseInference(binding,'term');requireThat(same(chosen,b),'The replacement must be the right-hand term of the selected equation.');
    const one={[a.name]:b};out.pending.splice(index,1);out.pending=out.pending.map(p=>p.map(t=>substitute(t,one)));
    out.bindings=Object.fromEntries(Object.entries(out.bindings).map(([v,t])=>[v,substitute(t,one)]));out.bindings[a.name]=b;
  }else if(rule==='decompose'){
    requireThat(a.kind===b.kind&&a.name===b.name&&a.children.length===b.children.length&&a.children.length>0,'Decompose requires the same outer symbol and arity.');
    out.pending.splice(index,1,...a.children.map((t,i)=>[t,b.children[i]]));
  }else if(rule==='occurs'){
    requireThat(a.kind==='variable'&&term(b)&&!same(a,b)&&freeVariables(b).includes(a.name),'Occurs-check failure requires a variable to occur as a proper part of its replacement.');out.done=true;out.message='No unifier: the occurs check rules out a finite replacement term.';
  }else if(rule==='clash'){
    requireThat(a.kind!=='variable'&&b.kind!=='variable'&&(a.kind!==b.kind||a.name!==b.name||a.children.length!==b.children.length),'A symbol clash requires different fixed outer symbols or arities.');out.done=true;out.message='No unifier: substitution cannot change fixed symbols.';
  }else throw Error('Choose an operation.');
  if(!out.done)out.message=out.pending.length?'Step accepted. Choose the next equation and operation.':'No equations remain. Declare success to finish.';
  return out;
}
export const UNIFICATION_LEVELS=[
 ['Socrates','Human(x); Human(Socrates)'],['Composition','R(x, y); R(a, f(x))'],['Occurs check','x; f(x)'],['Late occurs check','Related(x, fatherOf(x)); Related(fatherOf(y), y)'],['Symbol clash','f(x); g(x)'],
 ['Cities','LiesBetween(Munich, y, z); LiesBetween(x, Milan, Rome)'],['Repeated variable','SitsBetween(Mary, x, x); SitsBetween(x, Jane, y)'],
 ['Nested functions','¬BornIn(fatherOf(motherOf(x)), London); ¬BornIn(fatherOf(y), x)'],['An identity','Related(fatherOf(y), x); Related(x, fatherOf(y))']
];
export const SKOLEM_LEVELS=[
 ['A constant','∃x Human(x)'],['Dependent witnesses','∀x ∃y R(x, y)'],['One shared witness','∃y ∀x R(x, y)'],
 ['Separate witnesses','∀x (∃y R(x, y) ∧ ∃z R(z, x))'],['Two dependencies','∀x ∀y ∃z R(x, y, z)'],
 ['Separate scopes','∀x ((∀y R(x, y)) ∨ ∃z R(x, z))'],['Nested negation','∀x ((∀y BiggerThan(x, y)) → Giant(x))'],
 ['Rename a binder','(∃x Human(x)) ∧ (∀x Mortal(x))'],
 ['Friends','∀x (∀y ∃z (IsFriendOf(x, z) ∧ IsFriendOf(y, z)) ∨ ∃w ¬IsFriendOf(x, w))'],
 ['Two constants','∃x ∃y IsFriendOf(x, y)']
];
export function occurrences(tree,path=[],universals=[],existentials=[]){
  const here={tree,path,universals,existentials};
  return [here,...tree.children.flatMap((c,i)=>occurrences(c,[...path,i],tree.kind==='quantifier'&&tree.name==='∀'?[...universals,tree.variable]:universals,tree.kind==='quantifier'&&tree.name==='∃'?[...existentials,tree.variable]:existentials))];
}
const replace=(tree,path,value)=>path.length?{...tree,children:tree.children.map((c,i)=>i===path[0]?replace(c,path.slice(1),value):c)}:value;
const connective=(name,...children)=>node('connective',name,children);
export function startSkolemization(source){const tree=parseInference(source);requireThat(!freeVariables(tree).length,'Close free variables with quantifiers before Skolemization.');return {tree,used:allNames(tree),done:false,message:'Select a subformula and choose a transformation.'};}
export function skolemStep(state,path,rule,name='',argumentsText=''){
  requireThat(!state.done,'This calculation is complete. Restart to try again.');
  const nodes=occurrences(state.tree),at=nodes.find(n=>JSON.stringify(n.path)===JSON.stringify(path));requireThat(at,'Select a subformula.');
  const t=at.tree,[a,b]=t.children,neg=x=>connective('¬',x),out=structuredClone(state);let value;
  const normal=nodes.every(({tree:n})=>!['→','↔'].includes(n.name)&&!(n.name==='¬'&&['quantifier','connective'].includes(n.children[0].kind)));
  const binders=nodes.filter(n=>n.tree.kind==='quantifier').map(n=>n.tree.variable),distinct=new Set(binders).size===binders.length;
  if(rule==='arrow'){requireThat(t.name==='→','Select a conditional.');value=connective('∨',neg(a),b);}
  else if(rule==='iff'){requireThat(t.name==='↔','Select a biconditional.');value=connective('∧',connective('→',a,b),connective('→',b,a));}
  else if(rule==='double-negation'){requireThat(t.name==='¬'&&a.name==='¬','Select a double negation.');value=a.children[0];}
  else if(rule==='de-morgan'){requireThat(t.name==='¬'&&['∧','∨'].includes(a.name),'Select a negated conjunction or disjunction.');value=connective(a.name==='∧'?'∨':'∧',...a.children.map(neg));}
  else if(rule==='negated-quantifier'){requireThat(t.name==='¬'&&a.kind==='quantifier','Select a negated quantifier.');value={...a,name:a.name==='∀'?'∃':'∀',children:[neg(a.children[0])]};}
  else if(rule==='rename'){
    requireThat(t.kind==='quantifier','Select a quantified subformula.');requireThat(isVariable(name)&&!state.used.includes(name),'Choose a fresh variable, such as x1.');
    value={...t,variable:name,children:[substitute(a,{[t.variable]:variable(name)})]};out.used.push(name);
  }else if(rule==='skolem'){
    requireThat(normal,'First eliminate arrows and move negations to atoms.');requireThat(distinct,'Give repeated binders distinct variable names first.');
    requireThat(t.kind==='quantifier'&&t.name==='∃','Select an existential quantifier.');requireThat(!at.existentials.length,'Eliminate the enclosing existential quantifier first.');
    requireThat(/^[a-z][A-Za-z0-9_₀₁₂₃₄₅₆₇₈₉]*$/u.test(name)&&!isVariable(name)&&!state.used.includes(name),'Choose a fresh lowercase constant or function name, such as sk₁.');
    const args=argumentsText.trim()?argumentsText.split(',').map(s=>s.trim()):[];
    requireThat(args.length===at.universals.length&&args.every((v,i)=>v===at.universals[i]),'Use exactly the universal variables in scope, in outer-to-inner order. Leave arguments empty for a constant.');
    const witness=node(args.length?'function':'constant',name,args.map(variable));value=substitute(a,{[t.variable]:witness});out.used.push(name);
  }else if(rule==='finish'){
    requireThat(normal&&distinct&&!nodes.some(n=>n.tree.kind==='quantifier'&&n.tree.name==='∃'),'Finish the normal-form, renaming, and existential steps first.');out.done=true;out.message='Skolemization complete. The result is equisatisfiable with the original formula in the expanded language.';return out;
  }else throw Error('Choose a transformation.');
  out.tree=replace(state.tree,path,value);out.message=rule==='skolem'?'Fresh witness substituted. Satisfiability is preserved in the expanded language.':'Equivalent rewrite accepted.';return out;
}

// The demonstration follows the same checked rewrites, one local change per frame.
export function skolemTrace(source){
  let state=startSkolemization(source);const serial={x:0,sk:0};
  const steps=[{formula:printFOL(state.tree),explanation:'First remove arrows and move negations to atoms. Then rename repeated binders and replace existential quantifiers.'}];
  const fresh=prefix=>{let name;do{name=prefix==='sk'?skolemName(++serial.sk):prefix+(++serial.x);}while(state.used.includes(name));return name;};
  for(let count=0;count<512;count++){
    const nodes=occurrences(state.tree);let at,rule,name='',args='';
    for(const n of nodes){const t=n.tree,a=t.children[0];
      const candidate=t.name==='→'?'arrow':t.name==='↔'?'iff':t.name==='¬'&&a.name==='¬'?'double-negation':t.name==='¬'&&['∧','∨'].includes(a.name)?'de-morgan':t.name==='¬'&&a.kind==='quantifier'?'negated-quantifier':null;
      if(candidate){at=n;rule=candidate;break;}
    }
    if(!at){const seen=new Set();at=nodes.find(n=>{if(n.tree.kind!=='quantifier')return false;if(seen.has(n.tree.variable))return true;seen.add(n.tree.variable);return false;});if(at){rule='rename';name=fresh('x');}}
    if(!at){at=nodes.find(n=>n.tree.kind==='quantifier'&&n.tree.name==='∃');if(at){rule='skolem';name=fresh('sk');args=at.universals.join(',');}}
    if(!at){state=skolemStep(state,[],'finish');steps.at(-1).explanation+=' '+state.message;return steps;}
    const before=printFOL(at.tree),labels={'arrow':'Eliminate the conditional','iff':'Eliminate the biconditional','double-negation':'Remove double negation','de-morgan':'Apply De Morgan’s law','negated-quantifier':'Move negation through the quantifier','rename':`Rename the binder to ${name}`,'skolem':`Use the fresh witness ${name}${args?'('+args+')':''}`};
    state=skolemStep(state,at.path,rule,name,args);
    steps.push({formula:printFOL(state.tree),explanation:`${labels[rule]} in ${before}. ${rule==='skolem'?(args?'The witness depends on '+args+'. ':'No universal binder is in scope; use a constant. '):''}${state.message}`});
  }
  throw Error('Skolemization exceeded the demonstration limit.');
}
