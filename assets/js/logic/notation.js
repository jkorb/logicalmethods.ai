import { parseFormula, printFormula, tokenize, isAtom } from './parser.js';
import { latexToUnicode } from '../apps/latex-input.js';
export const PRIORITY = { '↔': 0, '→': 1, '∨': 2, '∧': 3, '¬': 4 };
const compact = text => text.replace(/\s+/g, '');
export function printConventional(node) {
  if (!node.children.length) return node.label;
  const part = (child, side) => {
    let text = printConventional(child);
    if (!child.children.length) return text;
    const lower = PRIORITY[child.label] < PRIORITY[node.label];
    const same = child.label === node.label;
    const brackets = lower || (same && (node.label === '↔' ||
      (node.label === '→' && side === 0) ||
      (['∧', '∨'].includes(node.label) && side === 1)));
    return brackets ? `(${text})` : text;
  };
  if (node.label === '¬') return `¬${part(node.children[0], 0)}`;
  return `${part(node.children[0], 0)} ${node.label} ${part(node.children[1], 1)}`;
}
export const PRACTICE_FORMULAS = [
  '(¬p ∧ q)', '(p ∨ (q ∧ r))', '(p → (q → r))', '¬(p ∧ q)',
  '((p ∧ q) ∨ r)', '(p ∧ (q ∨ r))', '((p → q) → r)', '((p ↔ q) ↔ r)',
  '(p ∧ (q ∧ r))', '((p ∧ q) ∧ r)', '(p ↔ (q ↔ r))',
  '((p ∧ (p → q)) → ¬q)'
];
export function notationQuestion(index, direction) {
  const tree = parseFormula(PRACTICE_FORMULAS[index]);
  const full = printFormula(tree), conventional = printConventional(tree);
  return direction === 'full' ? { prompt: conventional, answer: full } : { prompt: full, answer: conventional };
}
export function checkNotation(answer, question, direction) {
  try {
    const converted = latexToUnicode(answer);
    const tree = parseFormula(converted, { mode: direction === 'full' ? 'strict' : 'conventional' });
    const expected = parseFormula(question.answer, { mode: direction === 'full' ? 'strict' : 'conventional' });
    if (printFormula(tree) !== printFormula(expected)) return { correct: false, message: 'This changes the tree. Check the main operator and how its parts are grouped.' };
    if (compact(converted) !== compact(question.answer)) return { correct: false, message: 'The tree is right. Now remove the unnecessary brackets.' };
    return { correct: true, message: 'Correct. The notation changes and the tree stays the same.' };
  } catch (e) { return { correct: false, message: e.message }; }
}
// Adapted from the tools worktree's shunting_yard.js. Pure snapshots replace
// its global DOM state; syntax and ↔ grouping follow the chapter parser.
export function traceShunting(source) {
  parseFormula(source, { mode: 'conventional' });
  const input = tokenize(source), output = [], stack = [], steps = [];
  let next = 0;
  const record = message => steps.push({ input: input.slice(next), output: [...output], stack: [...stack], message });
  const pop = () => { const op = stack.pop(); output.push(op); record(`Move ${op} from the top of the stack to the output.`); };
  record('Start with an empty output and stack. Read the input from left to right.');
  while (next < input.length) {
    const token = input[next];
    if (isAtom(token)) { output.push(token); next++; record(`Read ${token}: append it to the output.`); }
    else if (token === '(' || token === '¬') { stack.push(token); next++; record(`Read ${token}: push it onto the stack.`); }
    else if (token === ')') {
      while (stack.at(-1) !== '(') pop();
      stack.pop(); next++; record('Read ): discard the matching opening bracket.');
    } else {
      while (stack.length && stack.at(-1) !== '(' &&
        (PRIORITY[stack.at(-1)] > PRIORITY[token] ||
         (PRIORITY[stack.at(-1)] === PRIORITY[token] && ['∧', '∨'].includes(token)))) pop();
      stack.push(token); next++; record(`Read ${token}: push it onto the stack.`);
    }
  }
  while (stack.length) pop();
  record('Finished. The output is the formula in postfix notation.');
  return steps;
}
export function postfix(node) {
  return [...node.children.flatMap(child => postfix(child)), node.label];
}
