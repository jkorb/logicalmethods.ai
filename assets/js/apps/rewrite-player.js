// Reusable presentation of formula/explanation traces; independent of rewrite rules.
import { el, formula, navigation } from './boolean-ui.js';
export function mountRewriteTrace(root, steps, finish) {
  const work = root.querySelector('[data-work]'), status = root.querySelector('[role="status"]');
  navigation(root, steps.length, index => {
    const list = el('ol', { class: 'sat-rewrites' });
    steps.slice(0, index + 1).forEach((step, i) => {
      const line = el('li', i === index ? { 'aria-current': 'step', class: 'is-current' } : {});
      line.append(formula(step.formula)); list.append(line);
    });
    work.replaceChildren(list);
    work.scrollTop = work.scrollHeight;
    status.textContent = steps[index].explanation + (index === steps.length - 1 ? ' ' + finish : '');
  });
}
