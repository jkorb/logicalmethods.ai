import { PRACTICE_FORMULAS, notationQuestion, checkNotation } from '../logic/notation.js';
import { enableLatexInput } from './latex-input.js';
export function mountNotationPractice(root) {
  const input = root.querySelector('input');
  const picker = root.querySelector('[data-notation-picker]');
  const choices = [...picker.querySelectorAll('[data-notation-mode]')];
  let mode = 'full';
  const status = root.querySelector('[role="status"]');
  const prompt = root.querySelector('[data-prompt]');
  let index = 0;
  const question = () => notationQuestion(index, mode);
  const show = () => {
    prompt.textContent = question().prompt;
    root.querySelector('[data-count]').textContent = `Example ${index + 1} of ${PRACTICE_FORMULAS.length}`;
    input.value = ''; status.textContent = mode === 'full' ? 'Add the brackets required by the grammar.' : 'Remove every unnecessary pair of brackets, preserving the tree.';
    delete status.dataset.state;
  };
  root.querySelectorAll('button, input, select').forEach(el => { el.disabled = false; });
  enableLatexInput(input);
  root.querySelector('form').addEventListener('submit', e => {
    e.preventDefault(); const result = checkNotation(input.value, question(), mode);
    status.textContent = result.message; status.dataset.state = result.correct ? 'success' : 'error';
  });
  root.querySelector('[data-answer]').addEventListener('click', () => {
    status.replaceChildren(document.createTextNode('Answer: '));
    const formula = document.createElement('span'); formula.className = 'math-inline'; formula.textContent = question().answer;
    status.append(formula); delete status.dataset.state;
  });
  root.querySelector('[data-next]').addEventListener('click', () => { index = (index + 1) % PRACTICE_FORMULAS.length; show(); input.focus(); });
  choices.forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.notationMode;
    choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
    root.querySelector('[data-notation-current]').textContent = button.textContent;
    picker.open = false; picker.querySelector('summary').focus(); show();
  }));
  document.addEventListener('click', event => { if (!picker.contains(event.target)) picker.open = false; });
  picker.addEventListener('keydown', event => {
    if (event.key === 'Escape') { picker.open = false; picker.querySelector('summary').focus(); event.preventDefault(); }
  });
  show();
}
