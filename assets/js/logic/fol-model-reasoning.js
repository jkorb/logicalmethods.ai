// Student-controlled unfolding of truth conditions. Open cases are checked as
// finite countermodels; unfinished cases never establish invalidity.
import {parseFOL,printFOL} from './fol-parser.js';
import {node,substitute} from './fol-inference.js';
import {evaluateFOL} from './fol-model.js';
const key=e=>`${e.value}:${printFOL(e.ast)}`;
const universal=e=>e.ast.kind==='quantifier'&&(e.ast.name==='∀')===e.value;
const compound=e=>e.ast.kind==='quantifier'||e.ast.kind==='connective';
function add(branch,ast,value){
 const entry={ast,value,used:[],done:false};
 if(!branch.entries.some(e=>key(e)===key(entry)))branch.entries.push(entry);
}
export function startModelReasoning(problem,language){
 const read=s=>parseFOL(s,{language,mode:'conventional'}),branch={entries:[],objects:[...language.constants],message:'Select a formula to unfold its truth conditions.'};
 problem.premises.forEach(s=>add(branch,read(s),true));add(branch,read(problem.goal),false);
 return {problem,language,branches:[branch]};
}
export function conflict(branch){
 for(const e of branch.entries)if(branch.entries.some(other=>other.value!==e.value&&printFOL(other.ast)===printFOL(e.ast)))return printFOL(e.ast);
 return null;
}
export function availableObjects(branch,entry){return universal(entry)?(branch.objects.length?branch.objects:['a']).filter(t=>!entry.used.includes(t)):[];}
export function canUnfold(branch,entry){return !conflict(branch)&&compound(entry)&&(universal(entry)?availableObjects(branch,entry).length>0:!entry.done);}
export function truthCondition(entry){
 const {ast:a,value:t}=entry,word=t?'true':'false';
 if(a.kind==='predicate')return `This requires the tuple to ${t?'belong':'not belong'} to the predicate’s extension.`;
 if(a.name==='¬')return `For a negation to be ${word}, its scope must be ${t?'false':'true'}.`;
 if(a.name==='∧')return t?'Both conjuncts must be true.':'At least one conjunct must be false. Consider both possibilities.';
 if(a.name==='∨')return t?'At least one disjunct must be true. Consider both possibilities.':'Both disjuncts must be false.';
 if(a.name==='→')return t?'Either the antecedent is false or the consequent is true. Consider both possibilities.':'The antecedent must be true and the consequent false.';
 if(a.kind==='quantifier')return universal(entry)?`The scope must be ${word} at every object. Choose an object to instantiate it.`:`Choose a witness where the scope is ${word}. Its name is fresh; it need not denote a different object.`;
 throw Error('This exercise supports predicates, negation, conjunction, disjunction, conditionals, and quantifiers.');
}
export function unfoldTruthCondition(state,caseIndex,entryIndex,object){
 const next=structuredClone(state),b=next.branches[caseIndex],e=b.entries[entryIndex],a=e.ast,t=e.value;
 if(!canUnfold(b,e))throw Error('Choose an unexpanded truth condition.');
 if(next.branches.length>64||b.entries.length>128)throw Error('This exploration has reached its limit. Undo or restart; no verdict has been established.');
 b.message=truthCondition(e);
 if(a.kind==='quantifier'){
  let term=object;
  if(universal(e)){
   if(!availableObjects(b,e).includes(term))throw Error('Choose an available object.');
   e.used.push(term);
  }else{let i=0;do{term=i<3?'abc'[i]:'d'+i;i++;}while(b.objects.includes(term));e.done=true;}
  if(!b.objects.includes(term))b.objects.push(term);
  add(b,substitute(a.children[0],{[a.variable]:node('constant',term)}),t);
  b.message+=` Here ${a.variable} is assigned to ${term}.`;
 }else{
  e.done=true;const [left,right]=a.children;
  if(a.name==='¬')add(b,left,!t);
  else if(a.name==='∧'&&t||a.name==='∨'&&!t){add(b,left,t);add(b,right,t);}
  else if(a.name==='→'&&!t){add(b,left,true);add(b,right,false);}
  else{
   const other=structuredClone(b);add(b,left,a.name==='→'?false:t);add(other,right,t);
   next.branches.splice(caseIndex+1,0,other);
  }
 }
 return next;
}
export function picturedModel(state,branch){
 const {language}=state;
 const model={domain:[...branch.objects],constants:Object.fromEntries(language.constants.map(c=>[c,c])),functions:{},predicates:Object.fromEntries(Object.keys(language.predicates).map(p=>[p,[]]))};
 for(const e of branch.entries)if(e.value&&e.ast.kind==='predicate'){
  const tuple=e.ast.children.map(t=>t.name),rows=model.predicates[e.ast.name];
  if(!rows.some(row=>JSON.stringify(row)===JSON.stringify(tuple)))rows.push(tuple);
 }
 return model;
}
export function checkModelReasoning(state){
 if(state.branches.every(conflict))return {result:'valid',message:'Every case requires a formula to be both true and false. No countermodel is possible: the inference is valid.'};
 for(const [index,b] of state.branches.entries()){
  if(conflict(b)||b.entries.some(e=>canUnfold(b,e)))continue;
  const model=picturedModel(state,b);if(!model.domain.length)model.domain.push('a');
  const value=s=>evaluateFOL(parseFOL(s,{language:state.language,mode:'conventional'}),state.language,model,{}).value;
  if(state.problem.premises.every(value)&&!value(state.problem.goal))return {result:'invalid',caseIndex:index,model,message:'This model makes every premise true and the conclusion false. The inference is invalid. Unlisted predicate tuples are false in this completed model.'};
 }
 return {result:'unfinished',message:'Continue unfolding the remaining truth conditions. An unfinished case does not yet establish a countermodel.'};
}
