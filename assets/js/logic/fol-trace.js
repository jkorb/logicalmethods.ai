import { printFOL } from './fol-parser.js';
// Keep the evaluator's semantic checks together. A quantified scope is one check
// per object; its internal facts explain that check rather than adding clicks.
export function explainEvaluation(ast, evaluation) {
  const target = ast.kind === 'quantifier' ? ast.children[0] : ast;
  const nodes = new Map();
  const walk = n => { nodes.set(n.id, n); n.children.forEach(walk); }; walk(ast);
  const steps = []; let details = [];
  for (const event of evaluation.steps) {
    if (event.value === null) continue;
    if (['predicate', 'identity', 'connective', 'function', 'quantifier'].includes(event.kind)) details.push({ ...event, node: nodes.get(event.nodeId) });
    if (event.nodeId === target.id) {
      steps.push({ ...event, details, node: target }); details = [];
    }
  }
  if (ast.kind === 'quantifier' || !steps.length || evaluation.steps.length > 2500) {
    steps.push({ expression: printFOL(ast), assignment: evaluation.steps.at(-1)?.assignment || {}, value: evaluation.value, node: ast, details: [], summary: true,
      explanation: evaluation.steps.at(-1)?.explanation || 'Evaluation complete.' });
  }
  return { ...evaluation, steps, ast };
}
