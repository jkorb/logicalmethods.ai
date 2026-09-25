// Finite propositional Horn rules. UI-independent traces for lessons and exercises.
import { parseBoolean } from './boolean.js';
import { flatten, formatFormula } from './sat.js';
export const conditionalNotation = source => source.replace(/<->|<=>/gu, '↔').replace(/->|=>/gu, '→').replace(/&&?|∧/gu, '∧').replace(/\|\|?/gu, '∨').replace(/~|!/gu, '¬');
const atom = t => t.children.length === 0;
export function readRules(source, { constraints = false } = {}) {
  if (source.length > 6000) throw new Error('Use at most 6000 characters.');
  const lines = conditionalNotation(source).split(/[;\n]/u).map(s => s.trim()).filter(Boolean);
  if (!lines.length || lines.length > 40) throw new Error('Enter one to forty facts or rules, one per line.');
  const rules = lines.flatMap(line => {
    // Bottom is permitted only as a rule head (or as the empty clause).
    if (line === '⊥') return [{ body: [], head: '⊥', text: line }];
    const bottom = /(?:→|->|=>)\s*⊥$/u.test(line);
    const parsed = parseBoolean(bottom ? line.replace(/⊥$/u, 'BOTTOM') : line).tree;
    const parts = parsed.label === '∧' ? flatten(parsed, '∧') : [parsed];
    return parts.map(t => {
      let body, head;
      if (t.label === '→') {
        const premises = flatten(t.children[0], '∧');
        if (!premises.every(atom) || !atom(t.children[1])) throw new Error('Use a conjunction of atoms before → and one atom after it.');
        body = premises.map(p => p.label); head = bottom ? '⊥' : t.children[1].label;
      } else {
        const literals = flatten(t, '∨');
        if (!literals.every(l => atom(l) || (l.label === '¬' && atom(l.children[0])))) throw new Error('Use Horn clauses or rules with atomic premises.');
        const positive = literals.filter(atom);
        if (positive.length > 1) throw new Error('A Horn clause has at most one positive literal.');
        body = literals.filter(l => l.label === '¬').map(l => l.children[0].label);
        head = positive[0]?.label || '⊥';
      }
      return { body: [...new Set(body)], head, text: bottom ? line : formatFormula(t) };
    });
  });
  if (!constraints && rules.some(r => r.head === '⊥')) throw new Error('For chaining use facts and rules with an atomic conclusion. Select Horn SAT for constraints.');
  const names = [...new Set(rules.flatMap(r => [...r.body, r.head]).filter(n => n !== '⊥'))];
  if (names.length > 30 || rules.length > 60) throw new Error('Use at most thirty atoms and sixty rules.');
  return { rules, names };
}
function proof(head, rule, proofs, path = '') {
  return { id: path + head, label: head, text: rule.text, children: rule.body.map(p => proofs.get(p)) };
}
export function forwardTrace(kb, goal = '', horn = false) {
  const known = new Set(), proofs = new Map(), agenda = [], remaining = kb.rules.map(r => r.body.length), uses = new Map();
  kb.rules.forEach((r,i) => r.body.forEach(p => { if (!uses.has(p)) uses.set(p, []); uses.get(p).push(i); }));
  const events = [];
  let cursor = 0;
  const emit = (message, rule = -1, tree = null, result = null) => events.push({message,rule,tree,known:[...known],remaining:[...remaining],agenda:agenda.slice(cursor),result});
  let contradiction = false;
  function fire(i) {
    const r = kb.rules[i];
    if (known.has(r.head)) return;
    const tree = proof(r.head,r,proofs);
    if (r.head === '⊥') { contradiction = true; emit('All premises of this constraint are true. We derive ⊥: the input is unsatisfiable.',i,tree,'unsat'); return; }
    known.add(r.head); proofs.set(r.head,tree); agenda.push(r.head);
    emit(r.body.length ? `All premises of ${r.text} are known. Add ${r.head}.` : `${r.head} is an initial fact. Add it to the agenda.`,i,tree);
  }
  emit('Start with no derived facts. Each counter records how many premises of its rule remain unprocessed.');
  for (let i = 0; i < kb.rules.length && !contradiction; i++) if (!remaining[i]) fire(i);
  while (!contradiction && cursor < agenda.length && (horn || !known.has(goal))) {
    const fact = agenda[cursor++];
    emit(`Take ${fact} from the agenda. Inspect only rules that use it as a premise.`,-1,proofs.get(fact));
    for (const i of uses.get(fact) || []) {
      remaining[i]--;
      emit(`Process ${fact} for ${kb.rules[i].text}: ${remaining[i]} premise(s) remain.`,i,proofs.get(fact));
      if (!remaining[i]) fire(i);
      if (contradiction) break;
    }
  }
  if (!contradiction) {
    const result = horn ? 'sat' : known.has(goal) ? 'proved' : 'unproved';
    const message = horn ? `Satisfiable. Give value 1 to ${[...known].join(', ') || 'no atoms'} and value 0 to every other atom. All rules and constraints are satisfied.` : known.has(goal) ? `${goal} has been derived.` : `No rule can add a new fact. ${goal} is not derivable. This does not derive ¬${goal}.`;
    emit(message,-1,proofs.get(goal) || null,result);
  }
  return events;
}
export function backwardTrace(kb, goal) {
  const facts = new Map(kb.rules.filter(r => !r.body.length).map(r => [r.head,r]));
  const events = []; let visits = 0;
  const completed=new Map();let path=[];
  const emit = (message, rule = -1, tree = null, result = null, code = '') => events.push({message,rule,tree,known:[...facts.keys()],result,code,path:[...path],proofs:[...completed.values()]});
  function search(g, active) {
    if (++visits > 1500) throw new Error('This search exceeds the demonstration limit. Try a smaller rule base. No verdict has been reached.');
    path=[...active,g];
    emit(`ASK whether ${g} follows. Try to prove it.`,-1,{id:g,label:g,children:[],pending:true},null,'backward(goal, facts, rules, active)');
    if (facts.has(g)) { const t = proof(g,facts.get(g),new Map()); emit(`${g} is a known fact.`,-1,t,null,'if contains(facts, goal): return True'); return t; }
    if (active.includes(g)) { emit(`${g} is already on this branch. Abandon this circular attempt.`,-1,null,null,'if contains(active, goal): return False'); return null; }
    for (let i = 0; i < kb.rules.length; i++) {
      const r = kb.rules[i]; if (r.head !== g || !r.body.length) continue;
      emit(`Try ${r.text}. We need all of ${r.body.join(', ')}.`,i,{id:g,label:g,text:r.text,pending:true,children:r.body.map((p,j)=>({id:`${j}-${p}`,label:p,children:[],pending:true}))},null,'prove_all(premises_of(rule), facts, rules, branch)');
      const proofs = new Map(); let failed = false;
      for (const p of r.body) { const t = search(p,[...active,g]); if (!t) { failed = true; break; } proofs.set(p,t); }
      if (!failed) { path=[...active,g];const t = proof(g,r,proofs);completed.set(g,t); emit(`All premises are proved. Derive ${g}.`,i,t,null,'return True'); return t; }
      path=[...active,g];emit(`This rule did not prove ${g}. Try another rule with that conclusion.`,i,null,null,'for rule in rules_for(goal, rules):');
    }
    path=[...active,g];emit(`No remaining rule proves ${g}.`,-1,null,null,'return False'); return null;
  }
  const tree = search(goal,[]);
  emit(tree ? `${goal} has been derived.` : `${goal} is not derivable. This does not derive ¬${goal}.`,-1,tree,tree ? 'proved' : 'unproved');
  return events;
}

// The introductory procedure scans rules. Comparison mode freezes known facts
// at the start of each round, giving breadth-first derivation depth.
export function scanForwardTrace(kb, goal, breadthFirst = false) {
  const known=new Set(), proofs=new Map(), events=[];
  kb.rules.filter(r=>!r.body.length).forEach(r=>{known.add(r.head);proofs.set(r.head,proof(r.head,r,proofs));});
  const emit=(message,code,rule=-1,tree=null,result=null)=>events.push({message,code,rule,tree,result,known:[...known],proofs:[...proofs.values()].filter(t=>t.children.length)});
  emit(`ASK(KB, ${goal}). Begin with the given facts.`, 'known = copy(facts)');
  let changed=true, round=0;
  while(changed && !known.has(goal)) {
    changed=false;round++;
    const available=breadthFirst?new Set(known):known;
    emit(breadthFirst?`Round ${round}: use only facts known at its start.`:`Pass ${round}: inspect the rules in order.`,breadthFirst?'available = copy(known)':'changed = False');
    for(let i=0;i<kb.rules.length;i++) {
      const r=kb.rules[i];if(!r.body.length)continue;
      const missing=r.body.filter(p=>!available.has(p));
      if(missing.length) {emit(`Cannot apply ${r.text} yet. Missing: ${missing.join(', ')}.`, 'all_known(premises_of(rule), known)',i);continue;}
      if(known.has(r.head)) {emit(`${r.head} is already known; do not add it again.`, 'not contains(known, head)',i);continue;}
      const tree=proof(r.head,r,proofs);known.add(r.head);proofs.set(r.head,tree);changed=true;
      emit(`Apply ${r.text}. Add ${r.head} to the known facts.`, 'add(known, head)',i,tree);
    }
  }
  emit(known.has(goal)?`ASK(KB, ${goal}): yes. ${goal} has been derived.`:`ASK(KB, ${goal}): not derivable. This does not derive ¬${goal}.`, 'return contains(known, goal)',-1,proofs.get(goal),known.has(goal)?'proved':'unproved');
  return events;
}
