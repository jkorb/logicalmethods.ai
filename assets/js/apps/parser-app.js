import { renderTree } from './tree-renderer.js';
import { traceParse } from '../logic/parser.js';
import { traceFOL } from '../logic/fol-parser.js';
import { enableLatexInput, convertInput } from './latex-input.js';
import { treeToLatex } from '../logic/tree-latex.js';
import { downloadText } from './download-text.js';
export function mountParser(root) {
  const input = root.querySelector('.logic-app__input');
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
  let treeSizes = [];
  const scale = root.dataset.language === 'fol' ? .72 : 1;
  const nodeLabel = node => formulaLabels.getAttribute('aria-pressed') === 'true' ? node.text || '?' : node.label;
  function sizeCanvas() {
    const width = viewport.clientWidth;
    if (!width || !treeSizes.length) return;
    // Reserve the largest step at the current width before the walkthrough starts.
    const height = Math.max(...treeSizes.map(([w, h]) => h * Math.min(scale, width / w)));
    viewport.style.minBlockSize = `${Math.ceil(height)}px`;
  }
  function measureTrace() {
    treeSizes = result.steps.filter(step => step.tree).map(step => {
      const drawing = renderTree(step.tree, { nodeLabel });
      return [Number(drawing.getAttribute('width')), Number(drawing.getAttribute('height'))];
    });
    sizeCanvas();
  }
  new ResizeObserver(sizeCanvas).observe(viewport);
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
    const drawing = renderTree(step.tree, { active: step.active, nodeLabel });
    drawing.style.width = `${Number(drawing.getAttribute('width')) * scale}px`; drawing.style.maxInlineSize = '100%';
    viewport.append(drawing);
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
  root.querySelector('[data-export-latex]').addEventListener('click', () => {
    const tree = result?.steps[index]?.tree;
    if (!dirty && tree) downloadText('parsing-tree.tex', treeToLatex(tree, formulaLabels.getAttribute('aria-pressed') === 'true'));
  });
  function start() {
    convertInput(input);
    dirty = false;
    root.querySelector('[data-export-latex]').disabled = false;
    input.readOnly = true;
    use.hidden = true;
    edit.hidden = false;
    result = root.dataset.language === 'fol'
      ? traceFOL(input.value, { mode: root.dataset.mode, kind: root.dataset.kind, language: root.querySelector("[data-fol-language]") ? JSON.parse(root.querySelector("[data-fol-language]").textContent) : undefined })
      : traceParse(input.value, { mode: root.dataset.mode });
    index = 0;
    measureTrace();
    render();
  }
  function edited() {
    dirty = true;
    treeSizes = []; viewport.style.minBlockSize = '';
    root.querySelector('[data-export-latex]').disabled = true;
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
  formulaLabels.addEventListener('click', () => {
    const on = formulaLabels.getAttribute('aria-pressed') !== 'true';
    formulaLabels.setAttribute('aria-pressed', String(on));
    formulaLabels.title = on ? 'Show abstract syntax tree' : 'Show formulas at nodes';
    if (!dirty) { measureTrace(); render(); }
  });
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
  root.querySelectorAll('button, input, textarea').forEach(el => { el.disabled = false; });
  start();
  root.querySelector('[data-app-fallback]')?.remove();
}
