/* Build a formula the way the inductive definition says you may: start from
   atoms, and put formulas you already have together with an operator. A
   formula that has been used is spent — it becomes part of the bigger one.

   Adapted from the canvas prototype on the `tools` branch. The interaction is
   the same; the drawing is not. Nodes are real buttons in a DOM tree, so the
   board is reachable by keyboard and readable by a screen reader, the lines
   between them are drawn in CSS, and the colours come from the site's tokens
   rather than being baked in. */
import { isAtom, parseFormula, printFormula } from '../logic/parser.js';
import { enableLatexInput } from './latex-input.js';

/* Ten rungs, from one operator to six. Every target is checked against the
   chapter's own grammar by the unit tests, so a typo here cannot ship. */
export const LEVELS = [
  '¬p',
  '(p ∧ q)',
  '(p → ¬q)',
  '¬(p ∨ q)',
  '((p ∧ q) → r)',
  '(¬p ∨ ¬q)',
  '((p₁ ∧ p₃) → ¬p₂)',
  '((p₁ ↔ p₂) ∨ ¬p₃)',
  '¬((p → q) ∧ (q → p))',
  '(((p ∧ q) ∨ r) → ¬(p ↔ q))',
  '((¬p₁ ∨ p₂) ↔ (p₃ → ¬p₄))',
  '¬(¬(p₁ → p₂) ∧ ¬¬p₃)'
];

export const PLAIN_LEVELS = LEVELS.map(formula => formula.replaceAll('p₁', 'p').replaceAll('p₂', 'q').replaceAll('p₃', 'r').replaceAll('p₄', 'p'));

const UNARY = '¬';
const BINARY = ['∧', '∨', '→', '↔'];
const DONE_KEY = 'lm-builder-done';

const readDone = () => {
  try { return new Set(JSON.parse(localStorage.getItem(DONE_KEY)) ?? []); } catch { return new Set(); }
};
const writeDone = done => {
  try { localStorage.setItem(DONE_KEY, JSON.stringify([...done])); } catch { /* no store */ }
};

// The board speaks the grammar's own spelling, so a target can be compared as text.
export const normalise = source => printFormula(parseFormula(source));

export function mountFormulaBuilder(root) {
  const find = selector => root.querySelector(selector);
  const board = find('[data-builder-board]');
  const status = find('[role="status"]');
  const goal = find('[data-builder-goal]');
  const strip = find('[data-builder-levels]');
  const atomInput = find('[data-builder-atom]');
  const atomForm = find('.builder__atom');
  const undoButton = find('[data-builder-undo]');
  const clearButton = find('[data-builder-clear]');
  const operators = [...root.querySelectorAll('[data-op]')];

  const levelled = root.dataset.levels === 'true';
  const targets = levelled ? (root.dataset.variables === 'plain' ? PLAIN_LEVELS : LEVELS) : [root.dataset.target].filter(Boolean);
  const done = readDone();
  let current = 0;
  let nodes = [];
  let selected = [];
  let counter = 0;

  const node = id => nodes.find(item => item.id === id);
  const roots = () => nodes.filter(item => item.parent === null);
  const target = () => targets[current] ?? '';
  const say = message => { status.textContent = message; };

  /* Say what happened before building, never after: drawing runs the goal
     check, and reaching the goal is the more important thing to announce. */
  function build(label, children) {
    const made = { id: ++counter, label, children, parent: null };
    for (const id of children) node(id).parent = made.id;
    nodes.push(made);
    selected = [];
    draw();
    return made;
  }

  function addAtom(label) {
    if (!isAtom(label)) {
      say(`"${label}" is not an atom. The atoms are p, q, r and p with a subscript, like p₁.`);
      return false;
    }
    say(`Added ${label}.`);
    build(label, []);
    return true;
  }

  function apply(operator) {
    const needed = operator === UNARY ? 1 : 2;
    if (selected.length !== needed) {
      say(needed === 1
        ? `Select one formula, then press ${operator}.`
        : `Select two formulas, then press ${operator}. Order matters: the first one goes on the left.`);
      return;
    }
    const parts = selected.map(node);
    const label = operator === UNARY
      ? `${UNARY}${parts[0].label}`
      : `(${parts[0].label} ${operator} ${parts[1].label})`;
    say(`Built ${label}.`);
    build(label, parts.map(part => part.id));
  }

  function toggle(id) {
    selected = selected.includes(id) ? selected.filter(other => other !== id) : [...selected, id];
    draw();
    const chosen = selected.map(item => node(item).label);
    say(chosen.length ? `Selected ${chosen.join(' and ')}.` : 'Nothing selected.');
  }

  function undo() {
    const last = nodes.pop();
    if (!last) return say('There is nothing to undo.');
    for (const id of last.children) node(id).parent = null;
    selected = [];
    draw();
    say(`Took back ${last.label}.`);
  }

  function clear() {
    nodes = [];
    selected = [];
    counter = 0;
    draw();
    say('Board cleared.');
  }

  // one <div> per subtree: the node itself, then a row for its children
  function subtree(item) {
    const tree = document.createElement('div');
    tree.className = 'builder__tree';
    const used = item.parent !== null;
    const box = document.createElement(used ? 'div' : 'button');
    box.className = 'builder__node';
    box.textContent = item.label;
    if (used) {
      box.classList.add('is-used');
    } else {
      box.type = 'button';
      box.setAttribute('aria-pressed', String(selected.includes(item.id)));
      box.addEventListener('click', () => toggle(item.id));
    }
    tree.append(box);
    if (item.children.length) {
      const children = document.createElement('div');
      children.className = 'builder__children';
      children.append(...item.children.map(id => subtree(node(id))));
      tree.append(children);
    }
    return tree;
  }

  function draw() {
    board.replaceChildren(...roots().map(subtree));
    board.dataset.empty = String(!nodes.length);
    for (const button of operators) {
      button.disabled = selected.length !== (button.dataset.op === UNARY ? 1 : 2);
    }
    undoButton.disabled = !nodes.length;
    clearButton.disabled = !nodes.length;
    check();
  }

  function check() {
    const wanted = target();
    if (!wanted) return;
    const hit = roots().some(item => item.label === wanted);
    goal.dataset.state = hit ? 'done' : '';
    if (!hit || done.has(wanted)) return;
    done.add(wanted);
    writeDone(done);
    if (levelled) {
      markStrip();
      const next = targets.findIndex(item => !done.has(item));
      say(next === -1
        ? `That is ${wanted}. Every level is done.`
        : `That is ${wanted}. Pick the next level when you are ready.`);
    } else {
      say(`That is ${wanted} — built exactly as the definition allows.`);
    }
  }

  function showGoal() {
    goal.replaceChildren();
    const wanted = target();
    if (!wanted) return;
    const label = document.createElement('span');
    label.className = 'builder__goal-label';
    label.textContent = wanted;
    goal.append(label);
    goal.dataset.state = '';
  }

  function markStrip() {
    if (!strip) return;
    for (const [index, button] of [...strip.querySelectorAll('button')].entries()) {
      button.setAttribute('aria-current', String(index === current));
      button.dataset.done = String(done.has(targets[index]));
    }
  }

  if (levelled && strip) {
    strip.replaceChildren(...targets.map((formula, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'builder__level';
      button.textContent = String(index + 1);
      button.setAttribute('aria-label', `Level ${index + 1}: ${formula}`);
      button.addEventListener('click', () => {
        current = index;
        clear();
        showGoal();
        markStrip();
        say(`Level ${index + 1}. Build ${formula}.`);
      });
      return button;
    }));
    markStrip();
  }

  atomForm.addEventListener('submit', event => {
    event.preventDefault();
    const label = atomInput.value.trim();
    if (!label) return say('Type an atom first, like p₁.');
    if (addAtom(label)) atomInput.value = '';
    atomInput.focus();
  });
  for (const button of operators) button.addEventListener('click', () => apply(button.dataset.op));
  undoButton.addEventListener('click', undo);
  clearButton.addEventListener('click', clear);
  enableLatexInput(atomInput);

  for (const element of root.querySelectorAll('button, input')) element.disabled = false;
  showGoal();
  draw();
  root.querySelector('[data-app-fallback]')?.remove();
}
