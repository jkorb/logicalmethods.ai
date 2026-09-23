// Student-controlled SAT operations; no DOM, answer revelation, or level state.
import { readProblem, truthTable, flatten, normalizeClause, printFormula, valuations } from './sat.js';
import { parseBoolean, evaluateTrace } from './boolean.js';
const value = (tree, v) => evaluateTrace(tree, v).at(-1).value;
export function tableExercise(source) {
  const problem = readProblem(source);
  return { problem, ...truthTable(problem) };
}
export function checkVariables(model, source, rows) {
  const names = source.trim().split(/[\s,;]+/u).filter(Boolean);
  return names.length === model.problem.names.length && new Set(names).size === names.length &&
    names.every(n => model.problem.names.includes(n)) && Number(rows) === model.rows.length;
}
export function checkParse(tree, source) {
  // Full binary brackets make the student's grouping explicit; negation needs none.
  return source.replace(/\s/gu,'') === printFormula(tree).replace(/\s/gu,'');
}
export function checkMystery(source, target, names) {
  if(source.length>512) throw new Error('Use at most 512 characters.');
  const parsed = parseBoolean(source);
  if(parsed.names.some(n => !names.includes(n))) throw new Error('Use only the variables in the table. You may leave out variables you do not need.');
  const counterexample = valuations(names).find(v => value(parsed.tree,v) !== value(target,v));
  return { correct: !counterexample, counterexample };
}
export function createResolutionSession(source) {
  const problem = readProblem(source), clauses = [];
  if(problem.inference) throw new Error('Start with CNF clauses, not an inference.');
  for(const tree of flatten(problem.conjunction,'∧')) {
    if(!flatten(tree,'∨').every(t => !t.children.length || t.label==='¬' && !t.children[0].children.length)) throw new Error('Rewrite the input into CNF first.');
    const clause=normalizeClause(tree);
    if(!clause.tautology && !clauses.some(c=>c.key===clause.key)) clauses.push({...clause,id:clauses.length+1,formula:clause.key});
  }
  return { clauses, checked: [], history: [], limit:160 };
}
const actionKey = (a,b,p) => [Math.min(a,b),Math.max(a,b),p].join(':');
export function resolutionChoices(state) {
  const choices=[];
  for(let i=0;i<state.clauses.length;i++) for(let j=i+1;j<state.clauses.length;j++) {
    const a=state.clauses[i], b=state.clauses[j];
    for(const literal of a.literals) {
      const pivot=literal.label==='¬'?literal.children[0].label:literal.label;
      const opposite=literal.label==='¬'?pivot:'¬'+pivot;
      if(b.literals.some(t=>printFormula(t)===opposite)) {
        const key=actionKey(a.id,b.id,pivot);
        choices.push({first:a.id,second:b.id,pivot,key,checked:state.checked.includes(key)});
      }
    }
  }
  return choices;
}
export function resolutionOutcome(state) {
  if(state.clauses.some(c=>!c.literals.length)) return 'unsatisfiable';
  return resolutionChoices(state).every(a=>a.checked)?'satisfiable':'unfinished';
}
export function applyResolutionChoice(state, first, second, pivot) {
  if(resolutionOutcome(state)==='unsatisfiable') throw new Error('The empty clause has already been derived.');
  const action=resolutionChoices(state).find(a=>a.key===actionKey(first,second,pivot));
  if(!action) throw new Error('These clauses have no complementary pair on that variable.');
  if(action.checked) throw new Error('This pair and pivot have already been checked.');
  const parents=[state.clauses[first-1],state.clauses[second-1]];
  const remaining=parents.flatMap(c=>c.literals).filter(t=>(t.label==='¬'?t.children[0].label:t.label)!==pivot);
  const clause=remaining.length ? normalizeClause(remaining.reduce((a,b)=>({label:'∨',children:[a,b]}))) : {literals:[],key:'',tautology:false};
  const duplicate=state.clauses.find(c=>c.key===clause.key);
  if(!clause.tautology&&!duplicate&&state.clauses.length>=state.limit) throw new Error('The practice limit has been reached. This does not establish satisfiability.');
  const next=structuredClone(state), result=clause.key||'⊥';
  if(!clause.tautology&&!duplicate) next.clauses.push({...clause,id:next.clauses.length+1,formula:result,parents:[first,second],pivot});
  next.checked.push(action.key);
  next.history.push({first,second,pivot,result,discarded:clause.tautology,note:clause.tautology?'Tautology: no new requirement.':duplicate?'Already on line '+duplicate.id+'.':'Added line '+next.clauses.length+'.'});
  return next;
}

export function checkNormalForm(source, target, form) {
  const tree=parseBoolean(source).tree;
  const outer=form==='DNF'?'∨':'∧', inner=form==='DNF'?'∧':'∨';
  const literal=t=>!t.children.length||t.label==='¬'&&!t.children[0].children.length;
  const normal=flatten(tree,outer).every(group=>flatten(group,inner).every(literal));
  return {...checkMystery(source,target,['INPUT₁','INPUT₂']),normal};
}
