import { PRACTICE_FORMULAS, notationQuestion, checkNotation } from '../logic/notation.js';
import { enableLatexInput } from './latex-input.js';
export function mountNotationPractice(root) {
  const input = root.querySelector('input'), select = root.querySelector('select');
  const status = root.querySelector('[role="status"]');
  const prompt = root.querySelector('[data-prompt]');
  let index = 0;
  const question = () => notationQuestion(index, select.value);
  const show = () => {
    prompt.textContent = question().prompt;
    root.querySelector('[data-count]').textContent = `Example ${index + 1} of ${PRACTICE_FORMULAS.length}`;
    input.value = ''; status.textContent = select.value === 'full' ? 'Add the brackets required by the grammar.' : 'Remove every unnecessary pair of brackets, preserving the tree.';
    delete status.dataset.state;
  };
  root.querySelectorAll('button, input, select').forEach(el => { el.disabled = false; });
  enableLatexInput(input);
  root.querySelector('form').addEventListener('submit', e => {
    e.preventDefault(); const result = checkNotation(input.value, question(), select.value);
    status.textContent = result.message; status.dataset.state = result.correct ? 'success' : 'error';
  });
  root.querySelector('[data-answer]').addEventListener('click', () => {
    status.replaceChildren(document.createTextNode('Answer: '));
    const formula = document.createElement('span'); formula.className = 'math-inline'; formula.textContent = question().answer;
    status.append(formula); delete status.dataset.state;
  });
  root.querySelector('[data-next]').addEventListener('click', () => { index = (index + 1) % PRACTICE_FORMULAS.length; show(); input.focus(); });
  select.addEventListener('change', show); show();
}
