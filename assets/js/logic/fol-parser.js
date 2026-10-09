// Typed FOL trees shared by parsing, finite models, and future inference tools.
const own = (o, k) => Object.hasOwn(o, k);
export const isVariable = name => /^[xyzuvw](?:[0-9₀₁₂₃₄₅₆₇₈₉]+)?$/u.test(name);
export const syntaxLanguage = {
  constants: ['Socrates', 'Xanthippe', 'Greece', 'LittleJimmy', 'MrSir', 'a', 'b', 'c'],
  functions: { fatherOf: 1, motherOf: 1, birthplaceOf: 1, capitalOf: 1, distanceBetween: 2, f: 1, g: 2 },
  predicates: { Human: 1, Mortal: 1, BiggerThan: 2, Sibling: 2, P: 1, Q: 1, R: 2 }
};
export function validateLanguage(language) {
  const names = [...language.constants, ...Object.keys(language.functions), ...Object.keys(language.predicates)];
  if (new Set(names).size !== names.length || names.some(n => !/^[A-Za-z][A-Za-z0-9_₀₁₂₃₄₅₆₇₈₉]*$/u.test(n) || isVariable(n))) throw Error('Use distinct nonlogical names, separate from variables.');
  if ([...Object.values(language.functions), ...Object.values(language.predicates)].some(n => !Number.isInteger(n) || n < 1 || n > 3)) throw Error('This app supports arities 1 to 3.');
}
export function printFOL(n) {
  if (['variable', 'constant'].includes(n.kind)) return n.name;
  if (['function', 'predicate'].includes(n.kind)) return `${n.name}(${n.children.map(printFOL).join(', ')})`;
  if (n.kind === 'quantifier') return `${n.name}${n.variable} ${printFOL(n.children[0])}`;
  if (n.kind === 'identity') return `${printFOL(n.children[0])} = ${printFOL(n.children[1])}`;
  if (n.name === '¬') return `¬${printFOL(n.children[0])}`;
  return `(${printFOL(n.children[0])} ${n.name} ${printFOL(n.children[1])})`;
}
function tokens(source) {
  if (source.length > 512) throw Error('Use at most 512 characters in this demonstration.');
  const result = []; const re = /\s+|[A-Za-z][A-Za-z0-9_₀₁₂₃₄₅₆₇₈₉]*|[∀∃¬∧∨→↔=≠(),]/uy;
  let i = 0;
  while (i < source.length) {
    re.lastIndex = i; const match = re.exec(source);
    if (!match) throw Error(`Unrecognized symbol at position ${i + 1}.`);
    if (match[0].trim()) result.push(match[0]);
    i = re.lastIndex;
  }
  if (result.length > 128) throw Error('Use at most 128 symbols in this demonstration.');
  return result;
}
export function parseFOL(source, { language = syntaxLanguage, kind = 'formula', mode = 'strict' } = {}) {
  validateLanguage(language);
  if (!['term', 'formula'].includes(kind) || !['strict', 'conventional'].includes(mode)) throw Error('Unknown parsing mode.');
  const ts = tokens(source); let id = 0;
  const node = (kind, name, children = [], extra = {}) => ({ kind, name, label: name, children, id: id++, ...extra });
  function term(list, cursor, depth = 0) {
    if (depth > 48) throw Error('Use at most 48 nested terms.');
    const name = list[cursor.i++];
    if (isVariable(name)) return node('variable', name);
    if (language.constants.includes(name)) return node('constant', name);
    if (!own(language.functions, name)) throw Error(`Expected a term; ${name || 'end of input'} is not a variable, constant, or function in this language.`);
    return node('function', name, args(list, cursor, language.functions[name], depth));
  }
  function args(list, cursor, arity, depth) {
    const bracketed = list[cursor.i] === '('; if (bracketed) cursor.i++;
    const children = [];
    for (let j = 0; j < arity; j++) {
      if (bracketed && j && list[cursor.i++] !== ',') throw Error(`Expected a comma between the ${arity} arguments.`);
      children.push(term(list, cursor, depth + 1));
    }
    if (bracketed && list[cursor.i++] !== ')') throw Error(`Expected a closing bracket after ${arity} arguments.`);
    return children;
  }
  function inspect(list) {
    let level = 0; let encloses = list[0] === '('; const ops = [];
    list.forEach((t, i) => {
      if (t === '(') level++;
      if (t === ')') { level--; if (level === 0 && i < list.length - 1) encloses = false; }
      if (level < 0) throw Error('Unmatched closing bracket.');
      if (!level && ['∧', '∨', '→', '↔'].includes(t)) ops.push(i);
    });
    if (level) throw Error('Unmatched opening bracket.');
    return { encloses, ops };
  }
  function formula(list, depth = 0) {
    if (depth > 48) throw Error('Use at most 48 nested formulas.');
    if (!list.length) throw Error('A formula is missing.');
    const { encloses, ops } = inspect(list);
    const binary = i => node('connective', list[i], [formula(list.slice(0, i), depth + 1), formula(list.slice(i + 1), depth + 1)]);
    if (mode === 'conventional') {
      for (const op of ['↔', '→', '∨', '∧']) {
        const positions = ops.filter(i => list[i] === op);
        if (op === '↔' && positions.length > 1) throw Error('Bracket repeated ↔ explicitly.');
        if (positions.length) return binary(op === '→' ? positions[0] : positions.at(-1));
      }
    }
    if (encloses) {
      if (mode === 'conventional') return formula(list.slice(1, -1), depth + 1);
      const inner = list.slice(1, -1); const positions = inspect(inner).ops;
      if (positions.length !== 1) throw Error('Full brackets enclose exactly one binary connective.');
      const i = positions[0];
      return node('connective', inner[i], [formula(inner.slice(0, i), depth + 1), formula(inner.slice(i + 1), depth + 1)]);
    }
    if (ops.length) throw Error('A binary formula needs its own outer brackets.');
    if (list[0] === '¬') return node('connective', '¬', [formula(list.slice(1), depth + 1)]);
    if (['∀', '∃'].includes(list[0])) {
      if (!isVariable(list[1])) throw Error('A quantifier must be followed by a variable.');
      return node('quantifier', list[0], [formula(list.slice(2), depth + 1)], { variable: list[1], label: list[0] + list[1] });
    }
    const cursor = { i: 0 }; let out;
    if (own(language.predicates, list[0])) {
      const name = list[cursor.i++]; out = node('predicate', name, args(list, cursor, language.predicates[name], depth));
    } else {
      const left = term(list, cursor, depth);
      const equality = list[cursor.i++];
      if (!['=', '≠'].includes(equality)) throw Error('A term alone is not a formula. Use a predicate or an identity.');
      out = node('identity', '=', [left, term(list, cursor, depth)]);
      if (equality === '≠') out = node('connective', '¬', [out]);
    }
    if (cursor.i !== list.length) throw Error('Unexpected extra arguments or symbols. Check the declared arities.');
    return out;
  }
  let ast;
  if (kind === 'term') {
    const cursor = { i: 0 }; ast = term(ts, cursor);
    if (cursor.i !== ts.length) throw Error('Unexpected symbols after the term.');
  } else ast = formula(ts);
  const decorate = n => { n.text = printFOL(n); n.complete = true; n.children.forEach(decorate); };
  decorate(ast); return ast;
}
export function freeVariables(ast, bound = new Set()) {
  if (ast.kind === 'variable') return bound.has(ast.name) ? [] : [ast.name];
  const next = ast.kind === 'quantifier' ? new Set([...bound, ast.variable]) : bound;
  return [...new Set(ast.children.flatMap(n => freeVariables(n, next)))];
}
export function traceFOL(source, options = {}) {
  const steps = [];
  try {
    const ast = parseFOL(source, options);
    const pending = n => ({ ...n, label: '?', children: [], complete: false });
    const tree = pending(ast);
    const record = (active, message, state = 'working', next = '') => steps.push({ tree: structuredClone(tree), active, message, next, state });
    record(ast.id, 'Start with the whole expression. Which grammar rule built it?', 'working', 'Identify the outermost symbol or construction.');
    function reveal(n, target) {
      target.label = n.label; target.children = n.children.map(pending);
      const rules = { variable: 'A variable is a term.', constant: 'A constant is a term.', function: `The function ${n.name} takes ${n.children.length} term arguments.`, predicate: `The predicate ${n.name} takes ${n.children.length} term arguments; the result is a formula.`, identity: 'Identity compares two terms.', quantifier: `The quantifier ${n.name}${n.variable} has one formula as its scope.`, connective: `The connective ${n.name} joins ${n.children.length === 1 ? 'one formula' : 'two formulas'}.` };
      target.complete = !n.children.length; record(n.id, rules[n.kind], 'working', n.children.length ? `Parse the first ${['function', 'predicate', 'identity'].includes(n.kind) ? 'term' : 'formula'} child: ${n.children[0].text}.` : 'This leaf is complete. Continue with the next unfinished part.');
      n.children.forEach((child, i) => reveal(child, target.children[i]));
      target.complete = true;
      if (n.children.length) record(n.id, `All parts of ${n.text} have been parsed.`, 'working', n.id === ast.id ? 'Finish the tree.' : 'Return to the parent and continue with its remaining children.');
    }
    reveal(ast, tree); record(ast.id, `Parsing finished: ${printFOL(ast)}.`, 'success', 'Every branch ends in a variable or constant.');
    return { ast, steps, error: null };
  } catch (error) {
    return { ast: null, error: error.message, steps: [{ tree: null, message: error.message, next: 'Edit the expression and start again.', state: 'error' }] };
  }
}
