// The chapter's set-valued SELECT fragment. This is a parser, not SQL execution.
import { freeVariables, parseFOL, printFOL } from './fol-parser.js';
const node = (kind, name, children = [], extra = {}) => ({ kind, name, label: name, children, ...extra });
const variable = name => node('variable', name);
const connective = (name, ...children) => node('connective', name, children);
const equality = (a, b) => node('identity', '=', [a, b]);
const truth = () => node('quantifier', '∀', [equality(variable('x₉₉₉'), variable('x₉₉₉'))], { variable: 'x₉₉₉', label: '∀x₉₉₉' });
const and = nodes => nodes.length ? nodes.reduce((a, b) => connective('∧', a, b)) : truth();
const replace = (ast, name, term) => ast.kind === 'variable' && ast.name === name ? term : { ...ast, children: ast.children.map(c => replace(c, name, term)) };
const conjuncts = n => n.name === '∧' ? n.children.flatMap(conjuncts) : [n];
// Eliminate a locally quantified variable pinned down by a conjunctive equality.
function exists(name, body) {
  const parts = conjuncts(body);
  const at = parts.findIndex(n => n.kind === 'identity' && n.children.some((t, i) => t.kind === 'variable' && t.name === name && !freeVariables(n.children[1 - i]).includes(name)));
  if (at >= 0) {
    const [a, b] = parts[at].children; const t = a.kind === 'variable' && a.name === name ? b : a;
    const rest = parts.filter((_, i) => i !== at).map(n => replace(n, name, t));
    return rest.length ? and(rest) : equality(t, t);
  }
  return freeVariables(body).includes(name) ? node('quantifier', '∃', [body], { variable: name, label: `∃${name}` }) : body;
}
export function sqlToFOL(source, language, model, columns = {}) {
  if (source.length > 12000) throw Error('Use at most 12,000 SQL characters.');
  const tokens = []; const re = /\s+|--[^\n]*|'(?:[^']|'')*'|"(?:[^"]|"")*"|[A-Za-z_][A-Za-z_0-9]*|[0-9]+|[(),.;=*]/uy;
  let pos = 0;
  while (pos < source.length) {
    re.lastIndex = pos; const m = re.exec(source);
    if (!m) throw Error(`Unsupported SQL at character ${pos + 1}.`);
    if (!/^\s|^--/.test(m[0])) tokens.push(m[0]); pos = re.lastIndex;
  }
  if (tokens.length > 2000) throw Error('This SQL query is too large for the demonstration.');
  let i = 0, depth = 0;
  const peek = s => tokens[i]?.toUpperCase() === s;
  const take = s => { if (peek(s)) { i++; return true; } return false; };
  const need = s => { if (!take(s)) throw Error(`Expected ${s}; found ${tokens[i] || 'end of SQL'}.`); };
  const identifier = () => {
    const t = tokens[i++]; if (!t || !/^(?:[A-Za-z_][A-Za-z_0-9]*|"(?:[^"]|"")*")$/.test(t)) throw Error('Expected an SQL identifier.');
    return t.startsWith('"') ? t.slice(1, -1).replaceAll('""', '"') : t;
  };
  function value() {
    const t = tokens[i];
    if (t?.startsWith("'")) { i++; return { type: 'literal', value: t.slice(1, -1).replaceAll("''", "'") }; }
    const first = identifier(); return take('.') ? { type: 'column', alias: first, column: identifier() } : { type: 'column', column: first };
  }
  function primary() {
    if (++depth > 48) throw Error('Use fewer nested SQL conditions.');
    let out;
    if (take('EXISTS')) { need('('); out = { type: 'exists', query: select(true) }; need(')'); }
    else if (take('(')) { out = condition(); need(')'); }
    else out = value();
    depth--; return out;
  }
  function comparison() { const left = primary(); return take('=') ? { type: 'eq', left, right: primary() } : left; }
  function negation() { return take('NOT') ? { type: 'not', child: negation() } : comparison(); }
  function conjunction() { let out = negation(); while (take('AND')) out = { type: 'and', left: out, right: negation() }; return out; }
  function condition() { let out = conjunction(); while (take('OR')) out = { type: 'or', left: out, right: conjunction() }; return out; }
  const reserved = new Set(['WHERE', 'JOIN', 'INNER', 'CROSS', 'ON', 'AND', 'OR']);
  function relation() {
    const table = identifier(); let alias = table;
    if (take('AS')) alias = identifier();
    else if (/^[A-Za-z_]/.test(tokens[i] || '') && !reserved.has(tokens[i].toUpperCase())) alias = identifier();
    return { table, alias };
  }
  function select(nested = false) {
    need('SELECT'); const distinct = take('DISTINCT');
    if (nested) { need('1'); } // EXISTS does not use its projection.
    const projections = [];
    if (!nested) {
      do { const expression = condition(); let alias; if (take('AS')) alias = identifier(); projections.push({ expression, alias }); } while (take(','));
    }
    const from = []; const filters = [];
    if (take('FROM')) {
      from.push(relation());
      while (peek('JOIN') || peek('INNER') || peek('CROSS') || peek(',')) {
        if (take(',')) { from.push(relation()); continue; }
        const cross = take('CROSS'); if (!cross) take('INNER'); need('JOIN'); from.push(relation());
        if (!cross) { need('ON'); filters.push(condition()); }
      }
    }
    if (take('WHERE')) filters.push(condition());
    if (!nested && from.length && !distinct) throw Error('Use SELECT DISTINCT for set-valued query answers.');
    if (nested && !from.length) throw Error('EXISTS needs a FROM table in this fragment.');
    return { projections, from, filters };
  }
  const sql = select(); take(';'); if (i !== tokens.length) throw Error(`Unsupported SQL clause: ${tokens[i]}.`);
  const subscript = n => String(n).replace(/[0-9]/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
  let fresh = 1; const output = []; const used = new Set();
  for (const [j, p] of sql.projections.entries()) {
    const name = /^[xyzuvw](?:[0-9₀₁₂₃₄₅₆₇₈₉]+)?$/.test(p.alias || '') ? subscript(p.alias) : j === 0 ? 'x' : `x${subscript(j)}`;
    if (used.has(name)) throw Error('Give projected columns distinct aliases.'); used.add(name); output.push(name);
  }
  const freshVariable = () => { while (used.has(`z${subscript(fresh)}`)) fresh++; const name = `z${subscript(fresh++)}`; used.add(name); return variable(name); };
  const symbol = table => Object.keys(language.predicates).find(r => r.toLowerCase() === table.toLowerCase());
  function compile(query, outer = {}, top = false) {
    const env = { ...outer }; const local = []; const predicates = []; const aliases = new Set();
    for (const { table, alias } of query.from) {
      const key = alias.toLowerCase(); if (aliases.has(key)) throw Error(`Duplicate alias ${alias}.`); aliases.add(key);
      const r = symbol(table); const domain = table.toLowerCase() === 'domain';
      if (!domain && !r) throw Error(`Unknown table ${table}.`);
      const arity = domain ? 1 : language.predicates[r]; const terms = Array.from({ length: arity }, freshVariable); local.push(...terms.map(t => t.name));
      const names = domain ? ['value'] : columns[r] || terms.map((_, k) => `arg${k + 1}`);
      env[key] = Object.fromEntries(terms.flatMap((t, k) => [[names[k].toLowerCase(), t], ...(!domain ? [[`arg${k + 1}`, t]] : [])]));
      if (!domain) predicates.push(node('predicate', r, terms));
    }
    function term(e) {
      if (e.type === 'literal') {
        const c = language.constants.find(c => model.constants[c] === e.value);
        if (!c) throw Error(`No constant denotes '${e.value}' in this language.`);
        return node('constant', c);
      }
      if (e.type !== 'column') throw Error('Expected a column or a quoted object identifier.');
      if (e.alias) { const t = env[e.alias.toLowerCase()]?.[e.column.toLowerCase()]; if (!t) throw Error(`Unknown column ${e.alias}.${e.column}.`); return t; }
      const localMatches = [...aliases].map(a => env[a][e.column.toLowerCase()]).filter(Boolean);
      const matches = localMatches.length ? localMatches : Object.values(outer).map(cols => cols[e.column.toLowerCase()]).filter(Boolean);
      if (matches.length !== 1) throw Error(`Qualify the unknown or ambiguous column ${e.column}.`); return matches[0];
    }
    function formula(e) {
      if (e.type === 'exists') return compile(e.query, env);
      if (e.type === 'not') return connective('¬', formula(e.child));
      if (e.type === 'and' || e.type === 'or') return connective(e.type === 'and' ? '∧' : '∨', formula(e.left), formula(e.right));
      if (e.type === 'eq') {
        const isTerm = n => ['column', 'literal'].includes(n.type);
        if (isTerm(e.left) && isTerm(e.right)) return equality(term(e.left), term(e.right));
        if (!isTerm(e.left) && !isTerm(e.right)) return connective('↔', formula(e.left), formula(e.right));
      }
      throw Error('Expected equality, EXISTS, or a Boolean SQL condition.');
    }
    if (top && !query.from.length) {
      if (query.projections.length !== 1) throw Error('A Boolean SELECT must have one condition.');
      return formula(query.projections[0].expression);
    }
    const parts = [...predicates, ...query.filters.map(formula)];
    if (top) query.projections.forEach((p, j) => parts.push(equality(variable(output[j]), term(p.expression))));
    let body = and(parts);
    const pending = [];
    for (const name of local) {
      const reduced = exists(name, body);
      if (reduced.kind === 'quantifier' && reduced.variable === name) pending.push(name);
      else body = reduced;
    }
    for (const name of pending.toReversed()) body = exists(name, body);
    return body;
  }
  let ast = compile(sql, {}, true);
  if (sql.from.length) for (const name of output) if (!freeVariables(ast).includes(name)) ast = and([ast, equality(variable(name), variable(name))]);
  const formula = printFOL(ast);
  // Keep the accepted formula within the shared parser/evaluator limits.
  ast = parseFOL(formula, { language });
  return { ast, formula, variables: sql.from.length ? output : [] };
}
