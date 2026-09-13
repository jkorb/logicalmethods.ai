import { traceShunting } from '../logic/notation.js';
import { enableLatexInput } from './latex-input.js';
export function mountShuntingYard(root) {
  const input = root.querySelector('input'), status = root.querySelector('[role="status"]');
  const back = root.querySelector('[data-back]'), forward = root.querySelector('[data-forward]');
  let steps = [], index = 0;
  const draw = () => {
    const step = steps[index];
    for (const key of ['input', 'stack', 'output']) root.querySelector(`[data-${key}]`).textContent = step[key].join(' ') || '—';
    status.textContent = `Step ${index + 1} of ${steps.length}. ${step.message}`;
    back.disabled = index === 0; forward.disabled = index === steps.length - 1;
  };
  const start = () => {
    try { steps = traceShunting(input.value); index = 0; delete status.dataset.state; draw(); }
    catch (e) {
      steps = []; back.disabled = forward.disabled = true;
      for (const key of ['input', 'stack', 'output']) root.querySelector(`[data-${key}]`).textContent = '—';
      status.textContent = e.message; status.dataset.state = 'error';
    }
  };
  root.querySelectorAll('button, input').forEach(el => { el.disabled = false; });
  enableLatexInput(input, () => { steps = []; back.disabled = forward.disabled = true; for (const key of ['input', 'stack', 'output']) root.querySelector(`[data-${key}]`).textContent = '—'; status.textContent = 'Press Start to trace the edited formula.'; delete status.dataset.state; });
  root.querySelector('form').addEventListener('submit', e => { e.preventDefault(); start(); });
  back.addEventListener('click', () => { if(index > 0) { index--; draw(); } });
  forward.addEventListener('click', () => { if(index < steps.length - 1) { index++; draw(); } });
  start();
}
