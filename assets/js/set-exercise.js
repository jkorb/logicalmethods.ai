import { exerciseAnswer, checkSelection } from './set-diagram-model.js';

export function mountSetExercise(root, scene) {
  const exercise = JSON.parse(root.querySelector('[data-exercise]').textContent);
  const controls = root.querySelector('.set-diagram__controls');
  const canvas = root.querySelector('.set-diagram__canvas');
  const points = [...root.querySelectorAll('[data-point]')];
  const options = root.querySelector('[data-answer-options]');
  const feedback = root.querySelector('[data-feedback]');
  let current = 0, selected = new Set();
  const question = () => exercise.questions[current];
  const buttons = exercise.questions.map((q, i) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = q.label;
    button.addEventListener('click', () => { current = i; selected = new Set(); renderQuestion(); });
    controls.append(button); return button;
  });
  function renderSelection() {
    points.forEach(point => {
      const active = !question().claim && selected.has(point.dataset.point);
      point.classList.toggle('is-selected', active);
      if (!question().claim) point.setAttribute('aria-pressed', String(active));
    });
    options.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(selected.has(button.dataset.truth))));
  }
  function toggle(id) {
    selected.has(id) ? selected.delete(id) : selected.add(id);
    feedback.textContent = ''; renderSelection();
  }
  // Reuse the diagram's SVG symbols for pictures within option labels.
  function pictureText(text, parent) {
    for (const part of text.split(/(@\{[^}]+\})/g)) {
      const match = part.match(/^@\{([^}]+)\}$/);
      if (!match) { parent.append(document.createTextNode(part)); continue; }
      const point = scene.points.find(p => p.id === match[1]);
      const source = points.find(p => p.dataset.point === point.id);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '-32 -32 64 64'); svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', point.label); svg.classList.add('set-exercise__picture');
      const drawing = source.cloneNode(true);
      drawing.removeAttribute('transform'); drawing.removeAttribute('data-point');
      for (const attr of ['role','tabindex','aria-label','aria-pressed']) drawing.removeAttribute(attr);
      drawing.setAttribute('class',''); drawing.querySelector('.set-diagram__halo').remove();
      svg.append(drawing); parent.append(svg);
    }
  }
  function renderQuestion() {
    const q = question();
    root.querySelector('[data-question-title]').textContent = q.label;
    root.querySelector('[data-question-body]').textContent = q.prompt;
    const formula = root.querySelector('[data-question-formula]');
    formula.replaceChildren();
    pictureText(q.statement || q.formula || '', formula);
    formula.hidden = !q.statement && !q.formula;
    root.querySelector('[data-check]').hidden = Boolean(q.claim);
    root.querySelector('[data-clear]').hidden = Boolean(q.claim);
    feedback.textContent = '';
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    canvas.setAttribute('role', q.claim ? 'img' : 'group');
    points.forEach(node => {
      if (q.claim) {
        for (const attr of ['role','tabindex','aria-label','aria-pressed']) node.removeAttribute(attr);
      } else {
        node.setAttribute('role','button'); node.setAttribute('tabindex','0');
        node.setAttribute('aria-label',scene.points.find(p => p.id === node.dataset.point).label);
      }
    });
    options.replaceChildren();
    if (q.claim) for (const value of [true, false]) {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = value ? 'True' : 'False';
      button.dataset.truth = String(value);
      button.addEventListener('click', () => {
        selected = new Set([String(value)]); renderSelection();
        const correct = value === exerciseAnswer(scene, q);
        feedback.textContent = `${correct ? 'Correct.' : 'Not quite.'} ${q.explanation}`;
      });
      options.append(button);
    }
    renderSelection();
  }
  points.forEach(node => {
    // A transparent disc gives the complete illustration a single hit target.
    const hit = document.createElementNS('http://www.w3.org/2000/svg','circle');
    hit.setAttribute('r','32'); hit.setAttribute('fill','transparent'); node.append(hit);
    node.addEventListener('click', () => { if (!question().claim) toggle(node.dataset.point); });
    node.addEventListener('keydown', event => {
      if (!question().claim && ['Enter',' '].includes(event.key)) {
        event.preventDefault(); toggle(node.dataset.point);
      }
    });
  });
  root.querySelector('[data-check]').addEventListener('click', () => {
    const result = checkSelection(exerciseAnswer(scene, question()), selected);
    feedback.textContent = result.correct ? `Correct. ${question().explanation}`
      : `Not quite. ${result.missing} still to select; ${result.extra} selected in error. Try again.`;
  });
  root.querySelector('[data-clear]').addEventListener('click', () => { selected.clear(); feedback.textContent = ''; renderSelection(); });
  root.querySelector('[data-show-answer]').addEventListener('click', () => {
    const answer = exerciseAnswer(scene, question());
    selected = new Set(question().claim ? [String(answer)] : answer); renderSelection();
    feedback.textContent = `Answer: ${question().explanation}`;
  });
  renderQuestion(); controls.hidden = exercise.questions.length < 2;
  root.querySelector('[data-exercise-actions]').hidden = false;
}


export function mountSetLevels(root) {
  const levels = [...root.querySelectorAll('[data-set-level]')];
  const previous = root.querySelector('[data-previous-level]');
  const next = root.querySelector('[data-next-level]');
  let current = 0;
  function render() {
    levels.forEach((level, i) => { level.hidden = i !== current; });
    root.querySelector('[data-level-status]').textContent = `Level ${current + 1} of ${levels.length}`;
    previous.disabled = current === 0;
    next.disabled = current === levels.length - 1;
  }
  previous.addEventListener('click', () => { if (current > 0) { current--; render(); if (previous.disabled) next.focus(); } });
  next.addEventListener('click', () => { if (current < levels.length - 1) { current++; render(); if (next.disabled) previous.focus(); } });
  render(); root.querySelector('[data-level-controls]').hidden = false;
}
