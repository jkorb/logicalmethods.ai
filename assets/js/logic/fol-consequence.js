// Bounded proof search from partial information. Displayed objects never close the domain.
import {parseFOL, printFOL, freeVariables} from './fol-parser.js';
import {node, substitute, allNames} from './fol-inference.js';
const same=(a,b)=>printFOL(a)===printFOL(b);
const neg=a=>a.name==='¬'?a.children[0]:node('connective','¬',[a]);
export function consequenceTrace(premises,goal,language,{budget=600,depth=10}={}) {
  const read=s=>parseFOL(s,{language,mode:'conventional'});
  const assumptions=premises.map(read),target=read(goal);
  if(assumptions.some(a=>freeVariables(a).length)||freeVariables(target).length)throw Error('Use sentences: bind each free variable with a quantifier.');
  const names=new Set([...assumptions,target].flatMap(allNames));let fresh=0,calls=0;
  const arbitrary=()=>{let name;do{name='d'+fresh++;}while(names.has(name));names.add(name);return node('constant',name);};
  const entry=(formula,reason,children=[],extra={})=>({formula,reason,children,...extra});
  function terms(context,objects){
    const out=new Map(objects.map(t=>[printFOL(t),t]));
    for(const name of language.constants)out.set(name,node('constant',name));
    const collect=t=>{if(['constant','function'].includes(t.kind)&&!freeVariables(t).length)out.set(printFOL(t),t);t.children.forEach(collect);};
    context.forEach(collect);
    if(!out.size){const d=arbitrary();out.set(d.name,d);}
    const seeds=[...out.values()];
    for(const [name,arity] of Object.entries(language.functions)){
      let tuples=[[]];for(let i=0;i<arity;i++)tuples=tuples.flatMap(row=>seeds.slice(0,6).map(t=>[...row,t])).slice(0,24);
      for(const row of tuples){const t=node('function',name,row);out.set(printFOL(t),t);}
    }
    return [...out.values()].slice(0,48);
  }
  function match(pattern,value,variables,bindings={}){
    if(pattern.kind==='variable'&&variables.has(pattern.name)){
      if(bindings[pattern.name])return same(bindings[pattern.name],value)?bindings:null;
      return {...bindings,[pattern.name]:value};
    }
    if(pattern.kind!==value.kind||pattern.name!==value.name||pattern.children.length!==value.children.length)return null;
    let result=bindings;for(let i=0;i<pattern.children.length;i++){result=match(pattern.children[i],value.children[i],variables,result);if(!result)return null;}return result;
  }
  function prove(wanted,context,objects,remaining,seen=new Set()){
    if(++calls>budget||!remaining)return null;
    const key=printFOL(wanted);if(seen.has(key))return null;const path=new Set([...seen,key]);
    if(context.some(a=>same(a,wanted)))return entry(wanted,'Given.');
    if(wanted.kind==='identity'&&same(...wanted.children))return entry(wanted,'Both terms denote the same object.');
    if(wanted.name==='∧'){
      const children=wanted.children.map(a=>prove(a,context,objects,remaining-1,path));
      if(children.every(Boolean))return entry(wanted,'Both conjuncts hold.',children);
    }
    if(wanted.name==='∨')for(const part of wanted.children){const p=prove(part,context,objects,remaining-1,path);if(p)return entry(wanted,'One true disjunct is enough.',[p]);}
    if(wanted.name==='→'){
      const p=prove(wanted.children[1],[...context,wanted.children[0]],objects,remaining-1,new Set());
      if(p)return entry(wanted,'The consequent holds whenever the antecedent does.',[p],{hypothesis:wanted.children[0]});
    }
    if(wanted.kind==='quantifier'&&wanted.name==='∀'){
      const d=arbitrary(),scope=substitute(wanted.children[0],{[wanted.variable]:d});
      const p=prove(scope,context,[...objects,d],remaining-1,new Set());
      if(p)return entry(wanted,'The chosen object was arbitrary, so every object satisfies the scope.',[p],{arbitrary:d});
    }
    if(wanted.kind==='quantifier'&&wanted.name==='∃')for(const t of terms(context,objects)){
      const p=prove(substitute(wanted.children[0],{[wanted.variable]:t}),context,objects,remaining-1,path);
      if(p)return entry(wanted,`Use ${printFOL(t)} as the witness.`,[p]);
    }
    for(const premise of context){
      let scope=premise;const variables=new Set();
      while(scope.kind==='quantifier'&&scope.name==='∀'){variables.add(scope.variable);scope=scope.children[0];}
      // Shadowed binders require alpha-renaming, outside this small search fragment.
      if(scope.kind==='quantifier')continue;
      const consequent=scope.name==='→'?scope.children[1]:scope;
      if(!['predicate','identity'].includes(consequent.kind)&&!(consequent.name==='¬'&&['predicate','identity'].includes(consequent.children[0].kind)))continue;
      let bindings=match(consequent,wanted,variables);if(!bindings)continue;
      let choices=[bindings];
      for(const v of variables)if(!bindings[v])choices=choices.flatMap(b=>terms(context,objects).map(t=>({...b,[v]:t}))).slice(0,48);
      for(const b of choices){
        let instance;try{instance=substitute(scope,b);}catch{continue;}
        const used=variables.size?[entry(instance,`The universal premise applies with ${[...variables].map(v=>v+' = '+printFOL(b[v])).join(', ')}.`,[entry(premise,'Given.')])]:[];
        if(scope.name!=='→')return entry(wanted,'This is the required instance.',used);
        const p=prove(instance.children[0],context,objects,remaining-1,path);
        if(p)return entry(wanted,'The antecedent is true; the given conditional therefore requires its consequent.',[...used,p]);
      }
    }
    // Only eliminate conjunctions actually known to be true.
    const expanded=context.flatMap(a=>a.name==='∧'?a.children:[]).filter(a=>!context.some(b=>same(a,b)));
    if(expanded.length)return prove(wanted,[...context,...expanded],objects,remaining-1,new Set());
    return null;
  }
  const positive=prove(target,assumptions,[],depth),negative=prove(neg(target),assumptions,[],depth);
  const result=positive&&negative?'inconsistent':positive?'true':negative?'false':'unknown';
  const proof=positive||negative,steps=[];
  const seen=new Set();
  function visit(p,hypothetical=false){
    if(p.arbitrary)steps.push({formula:`Let ${p.arbitrary.name} be any object of D.`,explanation:'No property of this object is assumed.',arbitrary:p.arbitrary.name,hypothetical});
    if(p.hypothesis)steps.push({formula:printFOL(p.hypothesis),explanation:'Assume this temporarily to check the conditional.',hypothetical:true});
    p.children.forEach(child=>visit(child,hypothetical||!!p.hypothesis));
    const formula=printFOL(p.formula),key=String(hypothetical)+':'+formula;
    if(seen.has(key))return;seen.add(key);
    const explanation=hypothetical?'Under the temporary assumption: '+(p.reason==='Given.'?'available in this argument.':p.reason):p.reason;
    steps.push({formula,ast:p.formula,explanation,hypothetical});
  }
  if(proof)visit(proof);
  const message={true:'True in every model of the selected premises.',false:'False in every model of the selected premises.',unknown:'Undetermined by this search. No proof of the formula or its negation was found.',inconsistent:'The selected premises yield both the formula and its negation.'}[result];
  steps.push({formula:printFOL(target),explanation:message,result});
  return {result,steps};
}

// Collect only asserted atomic facts, never the atoms inside an unproved conditional.
// This is display data, not a finite model supplied to the evaluator.
export function partialInterpretation(config,premises,steps){
  const model={domain:[],constants:{},functions:Object.fromEntries(Object.keys(config.language.functions).map(f=>[f,{}])),predicates:Object.fromEntries(Object.keys(config.language.predicates).map(p=>[p,[]]))};
  const objects=new Map();
  function term(t){
    if(!['constant','function'].includes(t.kind))return null;
    const args=t.children.map(term);if(args.some(x=>x===null))return null;
    const label=printFOL(t),id=config.model.constants[label]||label;
    if(!objects.has(id)){objects.set(id,{id,label});model.domain.push(id);}
    if(t.kind==='constant'&&config.language.constants.includes(t.name))model.constants[t.name]=id;
    if(t.kind==='function')model.functions[t.name][JSON.stringify(args)]=id;
    return id;
  }
  function fact(ast){
    if(ast.name==='∧'){ast.children.forEach(fact);return;}
    if(ast.kind!=='predicate')return;
    const args=ast.children.map(term);if(args.some(x=>x===null))return;
    const rows=model.predicates[ast.name];if(!rows.some(row=>JSON.stringify(row)===JSON.stringify(args)))rows.push(args);
  }
  // Named objects have denotations even when their predicate memberships are unknown.
  for(const name of config.language.constants)term(node('constant',name));
  premises.forEach(s=>fact(parseFOL(s,{language:config.language,mode:'conventional'})));
  for(const step of steps){
    if(step.hypothetical)continue;
    if(step.arbitrary)term(node('constant',step.arbitrary));
    if(step.ast)fact(step.ast);
    (step.known||[]).forEach(fact);
  }
  return {model,objects:[...objects.values()]};
}
