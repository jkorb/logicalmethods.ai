import { freeVariables, printFOL, validateLanguage } from './fol-parser.js';
export const tupleKey = tuple => JSON.stringify(tuple);
export function tuples(domain, arity) {
  if (domain.length ** arity > 10000) throw Error('This demonstration allows at most 10,000 candidate tuples.');
  let rows = [[]];
  for (let i = 0; i < arity; i++) rows = rows.flatMap(row => domain.map(d => [...row, d]));
  return rows;
}
export function validateModel(language, model) {
  validateLanguage(language);
  const errors = []; const d = model.domain;
  if (!d.length || d.length > 32 || new Set(d).size !== d.length) errors.push('The domain must contain 1 to 32 distinct objects.');
  for (const c of language.constants) if (!d.includes(model.constants[c])) errors.push(`Choose a denotation for ${c}.`);
  for (const [f, arity] of Object.entries(language.functions)) {
    for (const row of tuples(d, arity)) if (!d.includes(model.functions[f]?.[tupleKey(row)])) errors.push(`Choose ${f}(${row.join(', ')}).`);
    for (const key of Object.keys(model.functions[f] || {})) {
      const row = JSON.parse(key);
      if (row.length !== arity || row.some(x => !d.includes(x))) errors.push(`Invalid inputs for ${f}.`);
    }
  }
  for (const [r, arity] of Object.entries(language.predicates)) {
    const rows = model.predicates[r];
    if (!Array.isArray(rows)) { errors.push(`Missing extension for ${r}.`); continue; }
    for (const row of rows) if (row.length !== arity || row.some(x => !d.includes(x))) errors.push(`Invalid tuple for ${r}.`);
  }
  return errors;
}
// Validation happens before evaluation: incomplete functions are never false atoms.
export function evaluateFOL(ast, language, model, assignment = {}, { trace = true, budget = 50000 } = {}) {
  const errors = validateModel(language, model);
  if (errors.length) throw Error(`Incomplete model: ${errors.slice(0, 4).join(' ')}`);
  for (const v of freeVariables(ast)) if (!model.domain.includes(assignment[v])) throw Error(`Assign ${v} an object from the domain.`);
  const steps = []; let calls = 0;
  const record = (n, s, value, explanation) => {
    if (trace && steps.length < 2500) steps.push({ expression: printFOL(n), assignment: { ...s }, value, explanation, nodeId: n.id, kind: n.kind, symbol: n.name });
    return value;
  };
  function visit(n, s) {
    if (++calls > budget) throw Error('Evaluation limit reached. Try fewer objects or fewer nested quantifiers. No truth value has been returned.');
    const done = (v, text) => record(n, s, v, text);
    if (n.kind === 'variable') return done(s[n.name], `Look up ${n.name} in the current assignment.`);
    if (n.kind === 'constant') return done(model.constants[n.name], `Look up the denotation of ${n.name}.`);
    if (n.kind === 'quantifier') {
      const all = n.name === '∀';
      for (const d of model.domain) {
        const local = { ...s, [n.variable]: d };
        record(n, local, null, `Try ${n.variable} = ${d}; keep other assignments unchanged.`);
        const value = visit(n.children[0], local);
        if (value !== all) return done(!all, `${d} is ${all ? 'a counterexample' : 'a witness'}. Restore the enclosing assignment.`);
      }
      return done(all, all ? 'Every domain object satisfies the scope.' : 'No domain object satisfies the scope.');
    }
    if (!trace && n.kind === 'connective' && ['∧', '∨', '→'].includes(n.name)) {
      const left = visit(n.children[0], s);
      if (n.name === '∧' && !left) return false;
      if (n.name === '∨' && left || n.name === '→' && !left) return true;
      return visit(n.children[1], s);
    }
    const values = n.children.map(child => visit(child, s));
    if (n.kind === 'function') return done(model.functions[n.name][tupleKey(values)], `Read the output for the ordered inputs [${values.join(', ')}].`);
    if (n.kind === 'predicate') {
      const found = model.predicates[n.name].some(row => tupleKey(row) === tupleKey(values));
      return done(found, `[${values.join(', ')}] ${found ? 'belongs' : 'does not belong'} to the extension of ${n.name}.`);
    }
    if (n.kind === 'identity') return done(values[0] === values[1], 'Compare the two denoted objects.');
    const [a, b] = values;
    const operations = { '¬': () => !a, '∧': () => a && b, '∨': () => a || b, '→': () => !a || b, '↔': () => a === b };
    if (!operations[n.name]) throw Error('Unknown formula node.');
    return done(operations[n.name](), `Apply the truth condition for ${n.name}.`);
  }
  const value = visit(ast, assignment);
  if (trace && steps.length === 2500) steps.push({ expression: printFOL(ast), assignment, value, explanation: 'Evaluation complete. The display retained the first 2,500 calculation steps.' });
  return { value, steps, calls };
}
// A necessary condition only: unknown cases keep their candidates. In
// particular, absence from a positive relation never prunes a negated atom.
function possibleQueryCandidate(node, model, assignment) {
  if (node.kind === 'predicate' && node.children.every(t => ['variable', 'constant'].includes(t.kind))) {
    return model.predicates[node.name].some(row => {
      const env = { ...assignment };
      return node.children.every((t, i) => {
        if (t.kind === 'constant') return model.constants[t.name] === row[i];
        if (Object.hasOwn(env, t.name)) return env[t.name] === row[i];
        env[t.name] = row[i]; return true;
      });
    });
  }
  if (node.kind === 'connective' && node.name === '∧') return node.children.every(n => possibleQueryCandidate(n, model, assignment));
  if (node.kind === 'connective' && node.name === '∨') return node.children.some(n => possibleQueryCandidate(n, model, assignment));
  if (node.kind === 'quantifier' && node.name === '∃') {
    const env = { ...assignment }; delete env[node.variable];
    return possibleQueryCandidate(node.children[0], model, env);
  }
  return true;
}
export function queryFOL(ast, language, model, { variables = freeVariables(ast), prune = false } = {}) {
  if (new Set(variables).size !== variables.length || [...variables].sort().join() !== freeVariables(ast).sort().join()) throw Error('Query columns must list each free variable once.');
  const errors = validateModel(language, model); if (errors.length) throw Error(errors.join(' '));
  const all = tuples(model.domain, variables.length);
  const candidates = prune ? all.filter(tuple => possibleQueryCandidate(ast, model, Object.fromEntries(variables.map((v, i) => [v, tuple[i]])))) : all;
  let remaining = 100000; const rows = []; const steps = [];
  for (const tuple of candidates) {
    const assignment = Object.fromEntries(variables.map((v, i) => [v, tuple[i]]));
    const result = evaluateFOL(ast, language, model, assignment, { trace: false, budget: remaining });
    remaining -= result.calls;
    if (result.value) rows.push(tuple);
    steps.push({ assignment, value: result.value, tuple, explanation: result.value ? 'Keep this assignment in the answer.' : 'Discard this assignment.' });
  }
  return { variables, rows, steps, totalCandidates: all.length, skipped: all.length - candidates.length };
}
// Exact translation for finite relational models, set answers, and non-NULL IDs.
export function folToSQL(ast, language, model, columns = {}) {
  if (Object.keys(language.functions).length) throw Error('SQL translation here uses a language without function symbols.');
  const quote = s => `'${s.replaceAll("'", "''")}'`;
  const ident = s => `"${s.replaceAll('"', '""')}"`;
  const indent = text => text.split('\n').map(line => `  ${line}`).join('\n');
  const exists = (from, test, negative = false) => `${negative ? 'NOT ' : ''}EXISTS (\n  SELECT 1\n  FROM ${from}\n  WHERE\n${indent(indent(test))}\n)`;
  let nextAlias = 0;
  const variables = freeVariables(ast); const env = Object.fromEntries(variables.map((v, i) => [v, `d${i}.value`]));
  const term = (n, s) => n.kind === 'variable' ? s[n.name] : quote(model.constants[n.name]);
  function condition(n, s) {
    if (n.kind === 'predicate') {
      const a = `r${nextAlias++}`;
      return exists(`${ident(n.name)} AS ${a}`, n.children.map((t, i) => `${a}.${ident(columns[n.name]?.[i] || `arg${i + 1}`)} = ${term(t, s)}`).join('\nAND '));
    }
    if (n.kind === 'identity') return `${term(n.children[0], s)} = ${term(n.children[1], s)}`;
    if (n.kind === 'quantifier') {
      const a = `q${nextAlias++}`; const sub = condition(n.children[0], { ...s, [n.variable]: `${a}.value` });
      return exists(`Domain AS ${a}`, n.name === '∃' ? sub : `NOT (\n${indent(sub)}\n)`, n.name === '∀');
    }
    const [a, b] = n.children.map(c => condition(c, s));
    const left = `(\n${indent(a)}\n)`, right = b === undefined ? '' : `(\n${indent(b)}\n)`;
    return { '¬': `NOT ${left}`, '∧': `${left}\nAND ${right}`, '∨': `${left}\nOR ${right}`, '→': `(NOT ${left})\nOR ${right}`, '↔': `${left} = ${right}` }[n.name];
  }
  const test = condition(ast, env);
  return variables.length ? `SELECT DISTINCT ${variables.map(v => `${env[v]} AS ${ident(v)}`).join(', ')}\nFROM ${variables.map((v, i) => `Domain AS d${i}`).join('\nCROSS JOIN ')}\nWHERE\n${indent(test)};` : `SELECT (\n${indent(test)}\n) AS holds;`;
}
