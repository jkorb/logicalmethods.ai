import { mountSetExercise, mountSetLevels } from './set-exercise.js';
import { selectPoints } from './set-diagram-model.js';
export function mountSetDiagram(root) {
  const scene = JSON.parse(root.querySelector('[data-scene]').textContent);
  if (root.hasAttribute('data-set-exercise')) { mountSetExercise(root, scene); return; }
  const buttons = [...root.querySelectorAll('[data-step]')];
  const result = root.querySelector('[data-result]');
  let selected = scene.steps[0].id;
  let preview = null;
  function render(announce = false) {
    const active = preview || selected;
    const step = scene.steps.find(step => step.id === active);
    const points = selectPoints(scene, step.view);
    const ids = new Set(points.map(point => point.id));
    for (const node of root.querySelectorAll('[data-point]')) {
      node.classList.toggle('is-selected', step.view !== 'all' && ids.has(node.dataset.point));
      node.classList.toggle('is-muted', step.view !== 'all' && ids.size > 0 && !ids.has(node.dataset.point));
    }
    for (const region of root.querySelectorAll('[data-region]')) region.style.display = region.dataset.region === active ? '' : 'none';
    for (const contour of root.querySelectorAll('[data-set]')) contour.classList.toggle('is-relevant', [...step.include,...(step.union||[])].includes(contour.dataset.set));
    for (const explanation of root.querySelectorAll('[data-explanation]')) explanation.hidden = explanation.dataset.explanation !== active;
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.step === active));
    const plainText = step.text.replace(/@\{([^}]+)\}/g, (_, id) => scene.points.find(point => point.id === id)?.label || id);
    if (announce) result.textContent = `${step.title}. ${plainText} Highlighted: ${points.length ? points.map(point => point.label).join(', ') : 'none'}.`;
  }
  for (const button of buttons) {
    button.addEventListener('click', () => { selected = button.dataset.step; preview = null; render(true); });
    button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { preview = button.dataset.step; render(); } });
    button.addEventListener('pointerleave', () => { preview = null; render(); });
    button.addEventListener('focus', () => { preview = button.dataset.step; render(); });
    button.addEventListener('blur', () => { preview = null; render(); });
    button.addEventListener('keydown', event => { if (event.key === 'Escape') { preview = null; render(); } });
  }
  render();
  root.querySelector('.set-diagram__controls').hidden = false;
}
for (const root of document.querySelectorAll('[data-set-diagram]')) mountSetDiagram(root);

for (const root of document.querySelectorAll('[data-set-levels]')) mountSetLevels(root);
