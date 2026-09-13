// Chapter parser: pure functions, independent of the DOM and tree renderer.
// Atoms: p, q, r, or p with a positive Unicode subscript index.
export const BINARY = ['∧', '∨', '→', '↔'];
const formatTokens = tokens => tokens.join(' ').replace(/\( /g, '(').replace(/ \)/g, ')').replace(/¬ /g, '¬');
export const isAtom = s => /^(?:[pqr]|p[₁₂₃₄₅₆₇₈₉][₀₁₂₃₄₅₆₇₈₉]*)$/u.test(s);
export function tokenize(source) {
  const tokens = [];
  const pattern = /\s+|p[₀₁₂₃₄₅₆₇₈₉]+|[pqr¬∧∨→↔()]/uy;
  let i = 0;
  while (i < source.length) {
    pattern.lastIndex = i;
    const match = pattern.exec(source);
    if (!match) throw new Error(`Unrecognized symbol at position ${i + 1}: ${source[i]}. Use p, q, r, or p with a positive subscript index.`);
    if (!/^\s+$/u.test(match[0])) tokens.push(match[0]);
    i = pattern.lastIndex;
  }
  return tokens;
}
// Return the operators outside all brackets, and whether one pair encloses all.
function inspect(tokens) {
  let depth = 0;
  let encloses = tokens[0] === '(';
  const operators = [];
  tokens.forEach((t, i) => {
    if (t === '(') depth++;
    if (t === ')') {
      depth--;
      if (depth < 0) throw new Error('A closing bracket has no matching opening bracket.');
      if (depth === 0 && i < tokens.length - 1) encloses = false;
    }
    if (depth === 0 && BINARY.includes(t)) operators.push(i);
  });
  if (depth !== 0) throw new Error('An opening bracket has no matching closing bracket.');
  return { operators, encloses };
}
export function splitFormula(tokens, mode = 'strict') {
  if (!['strict', 'conventional'].includes(mode)) throw new Error('Unknown notation mode.');
  if (!tokens.length) throw new Error('A formula is missing here.');
  if (tokens.length === 1 && isAtom(tokens[0])) return { label: tokens[0], parts: [], rule: 'This is a propositional variable. The first grammar rule allows it on its own, so this branch ends here. There are no smaller formulas to look for.' };
  const info = inspect(tokens);
  if (mode === 'conventional') {
    if (info.encloses) return { group: tokens.slice(1, -1), rule: 'One matching pair encloses the whole formula. Remove that pair and continue with its contents.' };
    for (const op of ['↔', '→', '∨', '∧']) {
      const candidates = info.operators.filter(i => tokens[i] === op);
      if (!candidates.length) continue;
      if (op === '↔' && candidates.length > 1) throw new Error('Bracket repeated ↔ explicitly; our convention does not group it automatically.');
      const i = op === '→' ? candidates[0] : candidates.at(-1);
      const grouping = candidates.length > 1 ? (op === '→' ? ' Choose the first → so the chain groups to the right.' : ` Choose the last ${op} so the chain groups to the left.`) : '';
      return { label: op, parts: [tokens.slice(0, i), tokens.slice(i + 1)], rule: `Outside brackets, ${op} has the lowest priority here.${grouping} Parse its left part, then its right part.` };
    }
  }
  if (tokens[0] === '¬') return { label: '¬', parts: [tokens.slice(1)], rule: 'The formula begins with ¬. The rule A ⟹ ¬A could have built it by adding a negation. Put ¬ at this node, then work out how the remaining part was built. It will be the single child below ¬.' };
  if (mode === 'strict' && info.encloses) {
    const inside = tokens.slice(1, -1);
    const positions = inspect(inside).operators;
    if (positions.length === 1) {
      const i = positions[0];
      return { label: inside[i], parts: [inside.slice(0, i), inside.slice(i + 1)], rule: `Inside the outer brackets, ${inside[i]} is the only binary operator outside further brackets. It joins the two main parts of this formula, so it belongs at this node. The two ? nodes stand for its left and right parts; work out the left one first.` };
    }
    throw new Error('Inside the outer brackets, there must be exactly one binary operator outside further brackets.');
  }
  throw new Error(mode === 'strict' ? 'No grammar rule fits. A binary formula needs its own outer brackets.' : 'No rule fits this string. Check the variables, operators, and brackets.');
}
export function printFormula(node) {
  if (!node.children.length) return node.label;
  if (node.label === '¬') return `¬${printFormula(node.children[0])}`;
  return `(${printFormula(node.children[0])} ${node.label} ${printFormula(node.children[1])})`;
}
export function traceParse(source, { mode = 'strict' } = {}) {
  const steps = [];
  let root = null;
  let nextId = 0;
  const record = (active, message, next, state = 'working') => steps.push({ tree: structuredClone(root), active, message, next, state });
  try {
    if (source.length > 512) throw new Error('For this demonstration, use at most 512 characters.');
    const tokens = tokenize(source);
    if (tokens.length > 128) throw new Error('For this demonstration, use at most 128 symbols.');
    const pending = ts => ({ id: nextId++, label: '?', text: formatTokens(ts), children: [], complete: false });
    root = pending(tokens);
    record(root.id, 'Start with the whole formula. Which grammar rule could have built it? The ? stands for the structure we have not worked out yet. Each step will uncover a part of that structure.', 'Inspect the formula at the root.');
    function parse(ts, node, depth = 0) {
      if (depth > 48) throw new Error('For this demonstration, use at most 48 nested parsing calls.');
      let split;
      try { split = splitFormula(ts, mode); }
      catch (e) { record(node.id, e.message, 'Edit the formula and start again.', 'error'); throw e; }
      if (split.group) {
        record(node.id, split.rule, `Parse ${formatTokens(split.group)} at the same node.`);
        return parse(split.group, node, depth + 1);
      }
      node.label = split.label;
      node.children = split.parts.map(pending);
      node.complete = !split.parts.length;
      record(node.id, split.rule, node.children.length ? `Inspect ${node.children[0].text || 'the missing operand'} next.` : 'Return to the enclosing formula, if there is one.');
      split.parts.forEach((part, i) => parse(part, node.children[i], depth + 1));
      if (node.children.length) {
        node.complete = true;
        record(node.id, `All parts of ${node.text} have been parsed. This part of the tree is complete; we can return to the formula containing it, if there is one.`, 'Return to the enclosing formula, if there is one.');
      }
    }
    parse(tokens, root);
    record(root.id, `Parsing finished: ${printFormula(root)}.`, 'Try another formula, or go back through the steps.', 'success');
    return { ast: structuredClone(root), steps, error: null };
  } catch (e) {
    if (steps.at(-1)?.state !== 'error') record(root?.id, e.message, 'Edit the formula and start again.', 'error');
    return { ast: null, steps, error: e.message };
  }
}
export function parseFormula(source, options) {
  const result = traceParse(source, options);
  if (result.error) throw new Error(result.error);
  return result.ast;
}
