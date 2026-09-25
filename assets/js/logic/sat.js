// Pure SAT operations. Traces and answer cells contain no presentation state.
import { parseBoolean, evaluateTrace, printFormula } from './boolean.js';
export { printFormula };
const node = (label, ...children) => ({ label, children });
const compare = (a, b) => {
  const index = name => /^p[₀₁₂₃₄₅₆₇₈₉]+$/u.test(name) ? BigInt(name.slice(1).replace(/[₀₁₂₃₄₅₆₇₈₉]/gu, d => '₀₁₂₃₄₅₆₇₈₉'.indexOf(d))) : null;
  const ai = index(a), bi = index(b);
  if (ai !== null && bi !== null) return ai < bi ? -1 : ai > bi ? 1 : 0;
  return a < b ? -1 : a > b ? 1 : 0;
};
export const flatten = (tree, op) => tree.label === op ? tree.children.flatMap(c => flatten(c, op)) : [tree];
const join = (parts, op) => parts.reduce((a, b) => node(op, a, b));
// Display convention: flatten associative chains and bracket their compound parts.
export function formatFormula(tree) {
  if (!tree.children.length) return tree.label;
  if (tree.label === '¬') {
    const child=tree.children[0], text=formatFormula(child);
    return '¬' + (child.children.length > 1 ? '(' + text + ')' : text);
  }
  const parts=['∧','∨'].includes(tree.label) ? flatten(tree,tree.label) : tree.children;
  return parts.map(child=>{
    const text=formatFormula(child);
    return child.children.length > 1 ? '(' + text + ')' : text;
  }).join(' '+tree.label+' ');
}

const size = tree => 1 + tree.children.reduce((total, child) => total + size(child), 0);
export function readProblem(source) {
  if (source.length > 4608) throw new Error('Use at most 4608 characters.');
  const sections = source.trim().replace(/^\{([\s\S]*)\}$/, '$1').split(/∴|⊨/u);
  if (sections.length > 2) throw new Error('Use one conclusion marker, ∴.');
  const sources = sections[0].split(/[,;\n]/u).map(s => s.trim()).filter(Boolean);
  const inference = sections.length === 2;
  if (inference) {
    if (!sections[1].trim()) throw new Error('Write a conclusion after ∴.');
    sources.push(sections[1].trim());
  }
  if (!sources.length || sources.length > 9) throw new Error('Enter one to nine formulas, separated by commas or new lines.');
  const parsed = sources.map(parseBoolean);
  const names = [...new Set(parsed.flatMap(p => p.names))].sort(compare);
  if (names.length > 8) throw new Error('Use at most eight variables in this teaching app.');
  const trees = parsed.map(p => p.tree);
  const targets = inference ? [...trees.slice(0, -1), node('¬', trees.at(-1))] : trees;
  return { sources, trees, targets, names, inference, conjunction: join(targets, '∧') };
}
export function valuations(names) {
  return Array.from({ length: 2 ** names.length }, (_, row) => Object.fromEntries(names.map((name, i) => [name, (row >> (names.length - 1 - i)) & 1])));
}
export function truthTable(problem) {
  if (problem.names.length > 6) throw new Error('Use at most six variables for the truth-table display (64 rows).');
  const columns = [], seen = new Set();
  function visit(tree) {
    tree.children.forEach(visit);
    const key = printFormula(tree);
    if (!seen.has(key)) { seen.add(key); columns.push({ key, tree }); }
  }
  problem.names.forEach(name => visit(node(name)));
  visit(problem.conjunction);
  if (columns.length > 80) throw new Error('Use fewer subformulas for this table (at most 80 columns).');
  const rows = valuations(problem.names).map((valuation, index) => {
    const cells = columns.map(c => ({ key: c.key, value: evaluateTrace(c.tree, valuation).at(-1).value }));
    const values = problem.trees.map(t => evaluateTrace(t, valuation).at(-1).value);
    const witness = problem.inference ? values.slice(0, -1).every(v => v === 1) && values.at(-1) === 0 : values.every(v => v === 1);
    return { id: index, valuation, cells, witness };
  });
  return { columns, rows, satisfiable: rows.some(r => r.witness) };
}
// One local replacement per step. Phase order prevents distribution cycles.
function localRewrite(t, phase, target) {
  const [a, b] = t.children;
  if (phase === 'arrows') {
    if (t.label === '→') return [node('∨', node('¬', a), b), 'Eliminate conditional'];
    if (t.label === '↔') return [node('∧', node('∨', node('¬', a), b), node('∨', node('¬', b), a)), 'Eliminate biconditional'];
  }
  if (phase === 'negation' && t.label === '¬') {
    if (a.label === '¬') return [a.children[0], 'Double negation'];
    if (['∧', '∨'].includes(a.label)) return [node(a.label === '∧' ? '∨' : '∧', ...a.children.map(c => node('¬', c))), 'De Morgan'];
  }
  const inner = target === 'CNF' ? '∨' : '∧', outer = target === 'CNF' ? '∧' : '∨';
  if (phase === 'distribution' && t.label === inner) {
    if (a.label === outer) return [node(outer, ...a.children.map(c => node(inner, c, b))), 'Distribute over the left part'];
    if (b.label === outer) return [node(outer, ...b.children.map(c => node(inner, a, c))), 'Distribute over the right part'];
  }
  return null;
}
function replaceFirst(t, phase, target) {
  const found = localRewrite(t, phase, target);
  if (found) return { tree: found[0], rule: found[1], before: printFormula(t), after: printFormula(found[0]) };
  for (let i = 0; i < t.children.length; i++) {
    const result = replaceFirst(t.children[i], phase, target);
    if (result) return { ...result, tree: node(t.label, ...t.children.map((c, j) => j === i ? result.tree : c)) };
  }
  return null;
}
const compareLiteral = (a, b) => {
  const nameA = a.label === '¬' ? a.children[0].label : a.label;
  const nameB = b.label === '¬' ? b.children[0].label : b.label;
  return compare(nameA, nameB) || Number(a.label === '¬') - Number(b.label === '¬');
};
export function orderedForm(tree, target) {
  const outer = target === 'CNF' ? '∧' : '∨', inner = target === 'CNF' ? '∨' : '∧';
  const groups = flatten(tree, outer).map(t =>
    [...new Map(flatten(t, inner).map(l => [printFormula(l), l])).values()].sort(compareLiteral));
  groups.sort((a, b) => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      const difference = compareLiteral(a[i], b[i]);
      if (difference) return difference;
    }
    return a.length - b.length;
  });
  return join([...new Map(groups.map(g => {
    const t = join(g, inner);
    return [printFormula(t), t];
  })).values()], outer);
}
export function rewriteTrace(tree, target = 'CNF', { maxSteps = 256, maxNodes = 2048 } = {}) {
  if (!['CNF', 'DNF'].includes(target)) throw new Error('Choose CNF or DNF.');
  const steps = [{ tree, formula: formatFormula(tree), explanation: 'Start with the input formula.' }];
  for (const phase of ['arrows', 'negation', 'distribution']) {
    let next;
    while ((next = replaceFirst(tree, phase, target))) {
      if (steps.length >= maxSteps || size(next.tree) > maxNodes) return { steps, complete: false, reason: 'Rewrite limit reached; no normal form has been certified.' };
      tree = next.tree;
      steps.push({ tree, formula: formatFormula(tree), explanation: next.rule + ': ' + next.before + ' becomes ' + next.after + '.' });
    }
  }
  return { steps, tree, complete: true };
}
const literalKey = t => printFormula(t);
const complement = t => t.label === '¬' ? t.children[0] : node('¬', t);
export function normalizeClause(tree) {
  const literals = [...new Map(flatten(tree, '∨').map(t => [literalKey(t), t])).values()];
  literals.sort(compareLiteral);
  const keys = literals.map(literalKey);
  return { literals, key: keys.join(' ∨ '), tautology: literals.some(t => keys.includes(literalKey(complement(t)))) };
}
// Check each unordered pair once, preferring unit clauses and shorter parents.
export function resolutionTrace(problem, { maxClauses = 160, maxPairs = 20000, rewriteOptions } = {}) {
  const clauses = [], steps = [], keys = new Set();
  const result = (outcome, reason) => ({ clauses, steps, outcome, reason });
  function add(clause, parents, pivot, source) {
    if (clause.tautology || keys.has(clause.key)) return false;
    if (clauses.length >= maxClauses) return null;
    keys.add(clause.key);
    clauses.push({ ...clause, id: clauses.length + 1, parents, pivot, source, formula: clause.key || '⊥' });
    steps.push({ count: clauses.length, pair: parents, clause: clauses.at(-1), explanation: parents ? 'Resolve lines ' + parents.join(' and ') + ' on ' + pivot + '. Keep both parents.' : 'Take this conjunct from the input CNF.' });
    return true;
  }
  for (const t of [problem.conjunction]) {
    steps.push({ count: 0, formula: printFormula(t), explanation: problem.inference ? 'Conjoin the premises with the negation of the conclusion.' : 'Test this single conjunction for satisfiability.' });
    const rewritten = rewriteTrace(t, 'CNF', rewriteOptions);
    for (const step of rewritten.steps.slice(1)) steps.push({ count: 0, formula: step.formula, explanation: step.explanation });
    if (!rewritten.complete) return result('unknown', rewritten.reason);
    steps.push({ count: 0, formula: printFormula(rewritten.tree), explanation: 'This is the ordered CNF. Write its conjuncts on numbered lines; their conjunction must be true.' });
    for (const c of flatten(rewritten.tree, '∧')) {
      const clause = normalizeClause(c);
      if (clause.tautology) steps.push({ count: clauses.length, explanation: 'Discard ' + clause.key + ': it contains complementary literals and is always true.' });
      else if (keys.has(clause.key)) steps.push({ count: clauses.length, explanation: 'Skip repeated clause ' + clause.key + '.' });
      else if (add(clause, null, null, printFormula(t)) === null) return result('unknown', 'Clause limit reached; the result is undecided.');
    }
  }
  const initialClauses = clauses.map(c => ({ id: c.id, formula: c.formula }));
  steps.push({ count: clauses.length, initialClauses, explanation: "These are all the retained conjuncts of the CNF. Next, check each pair for complementary literals." });
  let pairs = 0;
  const checkedPairs = new Set();
  while (true) {
    const pending = [];
    for (let j = 0; j < clauses.length; j++) for (let i = 0; i < j; i++) {
      if (!checkedPairs.has(i + ':' + j)) pending.push([i,j]);
    }
    if (!pending.length) break;
    // Unit clauses first; among ties prefer the smaller total parent size.
    pending.sort(([i,j],[k,l]) =>
      Math.min(clauses[i].literals.length,clauses[j].literals.length) - Math.min(clauses[k].literals.length,clauses[l].literals.length) ||
      clauses[i].literals.length + clauses[j].literals.length - clauses[k].literals.length - clauses[l].literals.length || j-l || i-k);
    const [i,j] = pending[0];
    if (++pairs > maxPairs) return result('unknown', 'Pair limit reached; the result is undecided.');
    checkedPairs.add(i + ':' + j);
    const a = clauses[i], b = clauses[j];
    steps.push({ count: clauses.length, pair: [a.id, b.id], checked: pairs - 1, explanation: 'Check lines ' + a.id + ' and ' + b.id + ' for complementary literals.' });
    for (const literal of a.literals) {
      const opposite = literalKey(complement(literal));
      if (!b.literals.some(t => literalKey(t) === opposite)) continue;
      const remaining = [...a.literals.filter(t => literalKey(t) !== literalKey(literal)), ...b.literals.filter(t => literalKey(t) !== opposite)];
      const clause = remaining.length ? normalizeClause(join(remaining, '∨')) : { literals: [], key: '', tautology: false };
      const added = add(clause, [a.id, b.id], literalKey(literal).replace(/^¬/, ''));
      if (added === null) return result('unknown', 'Clause limit reached; the result is undecided.');
      if (added === false) steps.push({ count: clauses.length, pair: [a.id, b.id], discarded: clause.tautology, resolvent: clause.key, explanation: clause.tautology ? 'The resolvent is a tautology; discard it.' : 'The ordered resolvent is already on the list; do not add it again.' });
      if (!clause.literals.length) return result('unsatisfiable', 'The empty clause ⊥ is false under every valuation.');
    }
    steps.push({ count: clauses.length, checkedPair: [a.id, b.id], checked: pairs, explanation: 'Finished checking lines ' + a.id + ' and ' + b.id + ': every complementary pivot has been considered.' });
  }
  return result('satisfiable', 'Every pair and complementary pivot has been checked. No new clause remains to add.');
}

// Name each connective occurrence after its children; assert the root last.
export function tseytinTrace(tree) {
  const used = new Set(), constraints = [], bindings = [];
  function collect(t) { if (!t.children.length) used.add(t.label); t.children.forEach(collect); }
  collect(tree);
  let serial = 0;
  const steps = [{ formula: printFormula(tree), explanation: 'Read the input tree. Variables already have names.', clauses: [], bindings: [] }];
  const neg = t => node('¬', t), clause = (...ts) => join(ts, '∨');
  function name(t) {
    if (!t.children.length) return t;
    const children = t.children.map(name);
    const [a, b] = children;
    let label;
    do { label = 'u' + String(++serial).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]); } while (used.has(label));
    used.add(label);
    const u = node(label);
    let local;
    if (t.label === '¬') local = [clause(neg(u), neg(a)), clause(u, a)];
    if (t.label === '∧') local = [clause(neg(u), a), clause(neg(u), b), clause(u, neg(a), neg(b))];
    if (t.label === '∨') local = [clause(u, neg(a)), clause(u, neg(b)), clause(neg(u), a, b)];
    if (t.label === '→') local = [clause(u, a), clause(u, neg(b)), clause(neg(u), neg(a), b)];
    if (t.label === '↔') local = [clause(neg(u), neg(a), b), clause(neg(u), a, neg(b)), clause(u, a, b), clause(u, neg(a), neg(b))];
    constraints.push(...local);
    bindings.push({ name: label, formula: printFormula(node(t.label, ...children)), tree: t });
    steps.push({ formula: printFormula(join(local, '∧')), clauses: constraints.map(printFormula), bindings: [...bindings], explanation: 'Name ' + printFormula(t) + ' with ' + label + '. Add its local constraints.' });
    return u;
  }
  const root = name(tree);
  constraints.push(root);
  const result = join(constraints, '∧');
  steps.push({ formula: printFormula(root), clauses: constraints.map(printFormula), bindings: [...bindings], explanation: 'Assert the root ' + root.label + '. The conjunction of these ' + constraints.length + ' clauses is equisatisfiable with the input.' });
  return { tree: result, steps, bindings, clauses: constraints, root };
}
