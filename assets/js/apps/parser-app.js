import { renderTree } from './tree-renderer.js';
import { traceParse } from '../logic/parser.js';
import { enableLatexInput, convertInput } from './latex-input.js';
export function mountParser(root) {
  const input = root.querySelector('input');
  const status = root.querySelector('[role="status"]');
  const viewport = root.querySelector('.logic-app__tree');
  const count = root.querySelector('.logic-app__count');
  const edit = root.querySelector('.logic-app__edit');
  const use = root.querySelector('.logic-app__use');
  const textToggle = root.querySelector('.logic-app__text-toggle');
  const formulaLabels = root.querySelector('[data-formula-labels]');
  const textView = root.querySelector('.logic-app__text');
  const controls = Object.fromEntries([...root.querySelectorAll('[data-action]')].map(b => [b.dataset.action, b]));
  let result;
  let index = 0;
  let dirty = false;
  function render() {
    const step = result.steps[index];
    count.textContent = `${index + 1} / ${result.steps.length}`;
    status.replaceChildren();
    const heading = document.createElement('strong');
    heading.textContent = step.state === 'error' ? 'Cannot parse this formula' : step.state === 'success' ? 'Tree complete' : `Step ${index + 1}`;
    heading.className = 'logic-app__step-title';
    status.append(heading);
    const findActive = node => node?.id === step.active ? node : node?.children.map(findActive).find(Boolean);
    const active = findActive(step.tree);
    const details = document.createElement('dl');
    details.className = 'logic-app__details';
    for (const [label, value] of [['Current part', active?.text || '(empty string)'], ['Next step', step.next]]) {
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      if (label === 'Current part') dd.className = 'logic-app__formula';
      details.append(dt, dd);
    }
    const explanation = document.createElement('p');
    explanation.textContent = step.message;
    explanation.className = 'logic-app__explanation';
    status.append(details, explanation);
    status.dataset.state = step.state;
    controls.first.disabled = controls.previous.disabled = index === 0;
    controls.next.disabled = controls.last.disabled = index === result.steps.length - 1;
    viewport.replaceChildren();
    const textTree = root.querySelector('.logic-app__text > div');
    textTree.replaceChildren();
    if (!step.tree) return;
    const nodeLabel = node => formulaLabels.checked ? node.text || '?' : node.label;
    viewport.append(renderTree(step.tree, { active: step.active, nodeLabel }));
    function describe(node) {
      const li = document.createElement('li');
      li.textContent = `${node.id === step.active ? 'Current: ' : ''}${node.label === '?' ? `Not yet parsed: ${node.text || 'empty string'}` : nodeLabel(node)}${node.complete ? ' (complete)' : ''}`;
      if (node.children.length) {
        const ul = document.createElement('ul');
        node.children.forEach(n => ul.append(describe(n)));
        li.append(ul);
      }
      return li;
    }
    const ul = document.createElement('ul');
    ul.append(describe(step.tree));
    textTree.append(ul);
  }
  function start() {
    convertInput(input);
    dirty = false;
    input.readOnly = true;
    use.hidden = true;
    edit.hidden = false;
    result = traceParse(input.value, { mode: root.dataset.mode });
    index = 0;
    render();
  }
  function edited() {
    dirty = true;
    for (const button of Object.values(controls)) button.disabled = true;
    viewport.replaceChildren();
    root.querySelector('.logic-app__text > div').replaceChildren();
    count.textContent = '';
    status.textContent = 'Edit the formula, then choose Start parsing to build a new tree.';
    delete status.dataset.state;
  }
  root.querySelector('form').addEventListener('submit', event => { event.preventDefault(); if (!input.readOnly) { start(); controls.next.disabled ? edit.focus() : controls.next.focus(); } });
  enableLatexInput(input, edited);
  edit.addEventListener('click', () => {
    input.readOnly = false;
    use.hidden = false;
    edit.hidden = true;
    edited();
    input.focus();
  });
  formulaLabels.addEventListener('change', () => { if (!dirty) render(); });
  textToggle.addEventListener('click', () => {
    const showText = textView.hidden;
    textView.hidden = !showText;
    viewport.hidden = showText;
    textToggle.setAttribute('aria-expanded', String(showText));
    const label = showText ? 'Show tree as diagram' : 'Show tree as text';
    textToggle.setAttribute('aria-label', label);
    textToggle.title = label;
  });
  for (const [action, button] of Object.entries(controls)) button.addEventListener('click', () => {
    if (dirty) return;
    index = action === 'first' ? 0 : action === 'last' ? result.steps.length - 1 : index + (action === 'next' ? 1 : -1);
    render();
  });
  root.querySelectorAll('button, input').forEach(el => { el.disabled = false; });
  start();
  root.querySelector('[data-app-fallback]')?.remove();
}
