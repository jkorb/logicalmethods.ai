import { el } from './fol-views.js';
import { celebrate } from './celebrate.js';
export function levels(root, items, load) {
  const strip = root.querySelector('[data-levels]'), status = root.querySelector('[data-practice-feedback]');
  strip.append(el('span', 'Levels', 'fol-level-label'));
  const done = new Set(); let current = 0;
  const buttons = items.map((item, i) => {
    const button = el('button', String(i + 1), 'builder__level'); button.type = 'button';
    button.setAttribute('aria-label', `Level ${i + 1}`);
    button.addEventListener('click', () => select(i)); strip.append(button); return button;
  });
  function mark() { buttons.forEach((b,i) => { b.setAttribute('aria-current', String(i === current)); b.dataset.done = String(done.has(i)); }); }
  function select(i) { current = i; status.textContent = ''; delete status.dataset.feedback; mark(); load(items[i], i); }
  function feedback(ok, message) {
    status.textContent = message; status.dataset.feedback = ok ? 'correct' : 'incorrect';
    if (ok) { if (!done.has(current)) celebrate(root); done.add(current); mark(); }
    else { root.classList.remove('is-shaking'); void root.offsetWidth; root.classList.add('is-shaking'); }
  }
  return { start: () => select(0), feedback, clear: () => { status.textContent = ''; delete status.dataset.feedback; } };
}
