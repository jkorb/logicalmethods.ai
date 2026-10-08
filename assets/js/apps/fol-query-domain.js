import { el } from './fol-views.js';

// A bounded window into D^n follows the current query step, without changing
// the traversal order or displaying results of candidates not yet reached.
export function queryDomain({ result, index, picture, label, choose }) {
  const domain = el('div', undefined, 'fol-candidate-domain');
  domain.setAttribute('role', 'group');
  domain.setAttribute('aria-label', 'Query candidate domain');
  if (!result) { domain.append(el('p', 'Run the query to show its candidate domain.')); return domain; }
  const arity = result.variables.length;
  const power = arity === 1 ? '' : String(arity).replace(/[0-9]/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
  const size = arity > 2 ? 12 : 30;
  const start = Math.floor(index / size) * size, end = Math.min(start + size, result.steps.length);
  const heading = el('div', undefined, 'fol-domain-heading');
  heading.append(el('span', result.skipped ? `Candidates ⊆ D${power}` : `D${power}`, 'fol-domain-power'));
  const variables = result.variables.join(', ');
  heading.append(el('span', variables ? `(${variables})` : 'Empty tuple'));
  if (result.steps.length > size) heading.append(el('small', `${start + 1}–${end} of ${result.steps.length}`, 'fol-domain-window'));
  domain.append(heading);
  if (result.skipped) domain.append(el('small', `${result.skipped} tuples ruled out by the positive atoms.`, 'fol-pruned-note'));
  const grid = el('div', undefined, 'fol-candidate-grid');
  grid.style.setProperty('--candidate-width', arity > 2 ? '8rem' : arity === 1 ? '3rem' : '4.2rem');
  for (let i = start; i < end; i++) {
    const step = result.steps[i], candidate = el('button', undefined, 'fol-domain-candidate');
    candidate.type = 'button'; candidate.dataset.queryIndex = i;
    candidate.dataset.tuple = JSON.stringify(step.tuple);
    const state = i > index ? 'not yet checked' : step.value ? 'kept' : 'discarded';
    candidate.setAttribute('aria-label', `Candidate ${i + 1}: ${step.tuple.map(label).join(', ') || 'empty tuple'}; ${state}`);
    if (i === index) candidate.setAttribute('aria-current', 'step');
    const tuple = el('span', undefined, 'fol-domain-tuple');
    if (arity !== 1) tuple.append('[');
    step.tuple.forEach((id, j) => { if (j) tuple.append(', '); tuple.append(picture(id)); });
    if (arity !== 1) tuple.append(']');
    candidate.append(tuple);
    const mark = el('span', i > index ? '' : step.value ? '✓' : '×', 'fol-candidate-mark');
    mark.setAttribute('aria-hidden', 'true'); candidate.append(mark);
    candidate.addEventListener('click', () => choose(i));
    grid.append(candidate);
  }
  domain.append(grid);
  return domain;
}
