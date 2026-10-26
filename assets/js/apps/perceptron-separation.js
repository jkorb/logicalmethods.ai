import {el, svg, choices, activate} from './boolean-ui.js';
import {booleanRows, evaluateUnit} from '../logic/perceptron.js';
import {separationLevels, checkRecordedTable, separatorSection, clipHalfspace, fitSeparator, cubeView} from '../logic/perceptron-practice.js';

export function mountSeparationPractice(root) {
  const q = selector => root.querySelector(selector);
  let index = 0, rows, marks, weights, bias, ready, angle, tilt, points, selected;
  let grips = null, drag = null, controls = [], viewControls = [];
  const completed = new Set(), states = new Map(), names = ['P', 'Q', 'R'];
  const level = () => separationLevels[index];
  const valid = () => [...weights, bias].every(Number.isFinite);
  const plot = svg('svg', {viewBox: '0 0 410 350', role: 'group', 'aria-label': 'Input coordinates', class: 'separation-coordinates'});
  const backdrop = svg('rect', {x: 0, y: 0, width: 410, height: 350, 'data-orbit': '', role: 'button', tabindex: '0', 'aria-label': 'Rotate cube view', class: 'separation-orbit'});
  const regions = svg('g', {'aria-hidden': 'true'}), frame = svg('g', {'aria-hidden': 'true'}), boundary = svg('g'), dots = svg('g'), handles = svg('g');
  plot.append(backdrop, regions, frame, boundary, dots, handles); q('[data-coordinate-plot]').append(plot);
  const status = q('[role=status]');
  function feedback(message = '', correct = false) {
    status.textContent = message; root.dataset.feedback = message ? correct ? 'correct' : 'incorrect' : '';
  }
  function presets() {
    choices(q('[data-presets]'), separationLevels.map((l, i) => [String(i), l.label + (completed.has(i) ? ' ✓' : '')]), String(index), key => switchLevel(Number(key)), 'Functions to separate');
  }
  function switchLevel(next) {
    if (next === index) return;
    states.set(index, {marks, weights, bias, ready, angle, tilt, selected, grips,
      message: status.textContent, correct: root.dataset.feedback === 'correct'});
    index = next;
    const saved = states.get(index);
    if (!saved) {reset(); return;}
    ({marks, weights, bias, ready, angle, tilt, selected, grips} = saved);
    feedback(saved.message, saved.correct); mountLevel();
  }
  const basis = () => cubeView(angle, tilt);
  const wrapAngle = value => ((value % 360) + 360) % 360;
  function rotate(turn, elevation) {
    angle = wrapAngle(turn); tilt = wrapAngle(elevation);
    viewControls.forEach((sync, i) => sync(i ? tilt : angle)); draw();
  }
  function project(row) {
    if (level().arity === 2) return [112.5 + 185 * row[0], 267.5 - 185 * row[1]];
    const [u, v] = basis(), dot = axis => row.reduce((sum, x, i) => sum + (x - 0.5) * axis[i], 0);
    return [205 + 130 * dot(u), 175 + 130 * dot(v)];
  }
  function displacement(dx, dy) {
    if (level().arity === 2) return [dx / 185, -dy / 185];
    const [u, v] = basis();
    return u.map((x, i) => (x * dx + v[i] * dy) / 130);
  }
  function line(group, a, b, className) {
    const [x1, y1] = project(a), [x2, y2] = project(b);
    group.append(svg('line', {x1, y1, x2, y2, class: className}));
  }
  const pointString = points => points.map(project).map(p => p.join(',')).join(' ');
  function shade(polygon, face = '') {
    for (const value of [0, 1]) {
      const part = clipHalfspace(polygon, weights, bias, Boolean(value));
      if (part.length >= 3) regions.append(svg('polygon', {points: pointString(part), class: `separation-region separation-region--${value}`, 'data-region': value, 'data-face': face}));
    }
  }
  function drawBoundary() {
    const lower = level().arity === 2 ? [-0.55, -0.35] : -0.25;
    const upper = level().arity === 2 ? [1.55, 1.35] : 1.25;
    const section = separatorSection(weights, bias, lower, upper);
    if (level().arity === 2) shade([[-0.55, -0.35], [1.55, -0.35], [1.55, 1.35], [-0.55, 1.35]]);
    else {
      // Select the faces towards the viewer, including views from below or
      // behind. Only these faces tile the projected outline without overlap.
      const towardsViewer = basis()[2];
      for (let axis = 0; axis < 3; axis++) {
        if (Math.abs(towardsViewer[axis]) < 1e-10) continue;
        const side = towardsViewer[axis] > 0 ? 1.25 : -0.25;
        const others = [0, 1, 2].filter(i => i !== axis);
        const face = [[0,0], [1,0], [1,1], [0,1]].map(bits => {
          const point = [1.25, 1.25, 1.25];
          point[axis] = side;
          others.forEach((i, j) => {point[i] = bits[j] ? 1.25 : -0.25;}); return point;
        });
        shade(face, `${names[axis]}=${side}`);
      }
    }
    if (section.length < level().arity) {grips = null; return;}
    const center = section[0].map((_, i) => section.reduce((sum, row) => sum + row[i], 0) / section.length);
    const [cx, cy] = project(center);
    section.sort((a, b) => {
      const pa = project(a), pb = project(b);
      return Math.atan2(pa[1] - cy, pa[0] - cx) - Math.atan2(pb[1] - cy, pb[0] - cx);
    });
    const tag = level().arity === 2 ? 'polyline' : 'polygon';
    boundary.append(svg(tag, {points: pointString(section), class: 'separation-boundary', 'aria-hidden': 'true'}));
    boundary.append(svg(tag, {points: pointString(section), class: 'separation-drag-surface', 'data-drag': 'move', role: 'button', tabindex: '0', 'aria-label': 'Move separator'}));
    if (!grips) {
      const indices = level().arity === 2 ? [0, 1] : [0, Math.floor(section.length / 3), Math.floor(2 * section.length / 3)];
      grips = indices.map(i => section[i].map((x, j) => center[j] + 0.65 * (x - center[j])));
    }
    grips.forEach((point, i) => {
      const [cx, cy] = project(point);
      const handle = svg('g', {transform: `translate(${cx},${cy})`, 'data-drag': String(i), role: 'button', tabindex: '0', 'aria-label': `Turn separator: handle ${i + 1}`, class: 'separation-handle'});
      handle.append(svg('circle', {r: 18, class: 'separation-handle-hit'}), svg('circle', {r: 7, class: 'separation-handle-dot'})); handles.append(handle);
    });
  }
  function draw() {
    const focused = root.contains(document.activeElement) ? document.activeElement.dataset.drag : undefined;
    const focusedPoint = root.contains(document.activeElement) ? document.activeElement.dataset.point : undefined;
    root.dataset.dimensions = String(level().arity);
    backdrop.style.display = level().arity === 3 ? '' : 'none';
    regions.replaceChildren(); frame.replaceChildren(); boundary.replaceChildren(); handles.replaceChildren();
    if (ready && valid()) drawBoundary();
    for (const row of rows) for (let axis = 0; axis < level().arity; axis++) {
      if (row[axis]) continue;
      const end = [...row]; end[axis] = 1;
      line(frame, row, end, 'separation-grid');
    }
    const origin = Array(level().arity).fill(0);
    for (let axis = 0; axis < level().arity; axis++) {
      const start = [...origin], end = [...origin];
      start[axis] = -0.3; end[axis] = level().arity === 2 && axis === 0 ? 1.5 : 1.3;
      line(frame, start, end, 'perceptron-axis');
      const [x, y] = project(end);
      frame.append(svg('text', {x: x + (axis === 0 ? 8 : -10), y: y - 8, 'text-anchor': 'middle'}, names[axis]));
    }
    points.forEach((point, i) => {
      const [x, y] = project(rows[i]);
      point.setAttribute('transform', `translate(${x},${y})`);
      point.dataset.value = marks[i] === null ? 'unknown' : marks[i];
      point.setAttribute('aria-label', `Point (${rows[i].join(', ')}): ${marks[i] === null ? 'unmarked' : `output ${marks[i]}`}`);
      point.querySelector('[data-mark]').textContent = marks[i] ?? '?';
    });
    if (level().arity === 3) {
      const towardsViewer = basis()[2], depth = i => rows[i].reduce((sum, x, axis) => sum + x * towardsViewer[axis], 0);
      const ordered = points.map((_, i) => i).sort((a, b) => depth(a) - depth(b)).map(i => points[i]);
      if (ordered.some((point, i) => dots.children[i] !== point)) dots.append(...ordered);
    }
    q('[data-separator-controls]').hidden = !ready;
    q('[data-check-points]').hidden = ready;
    q('[data-table]').querySelectorAll('tbody tr').forEach((tr, i) => tr.classList.toggle('is-selected', i === selected));
    if (focused !== undefined) plot.querySelector(`[data-drag="${focused}"]`)?.focus({preventScroll: true});
    else if (focusedPoint !== undefined) points[Number(focusedPoint)]?.focus({preventScroll: true});
  }
  function changed({keepGrips = false} = {}) {
    if (!keepGrips) grips = null;
    completed.delete(index); presets(); feedback(valid() ? '' : 'Enter a finite number for each weight and the bias.'); draw();
  }
  function control(container, label, value, min, max, step, change, cyclic = false) {
    const holder = el('div', {class: 'separation-control'});
    const slider = el('input', {type: 'range', min, max, step, value, 'aria-label': label});
    const number = el('input', {type: 'number', step: 'any', value, 'aria-label': label, class: 'separation-number'});
    holder.append(el('span', {}, label), slider, number); container.append(holder);
    function sync(next, source) {
      if (cyclic && Number.isFinite(next)) next = wrapAngle(next);
      if (source !== number) number.value = Number.isFinite(next) ? String(Number(next.toFixed(4))) : '';
      number.setAttribute('aria-invalid', String(!Number.isFinite(next)));
      if (Number.isFinite(next)) {
        slider.min = cyclic ? min : Math.min(min, next); slider.max = cyclic ? max : Math.max(max, next); slider.value = next;
      }
    }
    slider.addEventListener('input', () => {const value = slider.valueAsNumber; sync(value, slider); change(cyclic ? wrapAngle(value) : value);});
    slider.addEventListener('keydown', event => {
      const sign = ['ArrowRight', 'ArrowUp'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowDown'].includes(event.key) ? -1 : 0;
      if (!sign) return;
      event.preventDefault();
      const incremented = slider.valueAsNumber + sign * (cyclic ? 1 : 0.05);
      const next = cyclic ? wrapAngle(incremented) : Math.max(Number(slider.min), Math.min(Number(slider.max), incremented));
      sync(next); change(next);
    });
    number.addEventListener('input', () => {
      const value = number.valueAsNumber;
      sync(value, number); change(cyclic ? wrapAngle(value) : value);
    });
    if (cyclic) number.addEventListener('blur', () => {if (Number.isFinite(number.valueAsNumber)) sync(number.valueAsNumber);});
    return sync;
  }
  function setParameters(next) {
    weights = next.weights.map(x => Number(x.toFixed(4))); bias = Number(next.bias.toFixed(4));
    controls.forEach((sync, i) => sync(i < weights.length ? weights[i] : bias));
    changed({keepGrips: true});
  }
  function localPoint(event) {
    return new DOMPoint(event.clientX, event.clientY).matrixTransform(plot.getScreenCTM().inverse());
  }
  function move(start, dx, dy) {
    const delta = displacement(dx, dy);
    const moved = start.grips.map(point => [...point]);
    if (start.key === 'move') {
      grips = moved.map(point => point.map((x, i) => x + delta[i]));
      setParameters({weights: start.weights, bias: start.bias - start.weights.reduce((sum, w, i) => sum + w * delta[i], 0)});
    } else {
      moved[Number(start.key)] = moved[Number(start.key)].map((x, i) => x + delta[i]);
      const fitted = fitSeparator(moved, weights);
      if (fitted) {grips = moved; setParameters(fitted);}
    }
  }
  function begin(key) {return {key, grips: grips.map(point => [...point]), weights: [...weights], bias};}
  plot.addEventListener('pointerdown', event => {
    const target = event.target.closest('[data-drag]');
    if (event.button !== 0 || event.target.closest('[data-point]')) return;
    if (target) {
      if (!ready || !valid() || !grips) return;
      drag = begin(target.dataset.drag);
    } else if (level().arity === 3) drag = {key: 'view', angle, tilt};
    else return;
    event.preventDefault();
    drag = {...drag, pointer: event.pointerId, start: localPoint(event)};
    plot.setPointerCapture(event.pointerId); root.dataset.dragging = 'true';
  });
  plot.addEventListener('pointermove', event => {
    if (!drag || drag.pointer !== event.pointerId) return;
    const point = localPoint(event), dx = point.x - drag.start.x, dy = point.y - drag.start.y;
    if (drag.key === 'view') rotate(drag.angle + dx * 0.6, drag.tilt + dy * 0.6);
    else move(drag, dx, dy);
  });
  function endDrag(event) {
    if (!drag || drag.pointer !== event.pointerId) return;
    if (plot.hasPointerCapture(event.pointerId)) plot.releasePointerCapture(event.pointerId);
    drag = null; delete root.dataset.dragging;
  }
  plot.addEventListener('pointerup', endDrag); plot.addEventListener('pointercancel', endDrag); plot.addEventListener('lostpointercapture', endDrag);
  plot.addEventListener('keydown', event => {
    const target = event.target.closest('[data-drag]');
    const direction = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]}[event.key];
    if (event.target.closest('[data-orbit]') && direction) {
      event.preventDefault(); const step = event.shiftKey ? 10 : 2;
      rotate(angle + direction[0] * step, tilt + direction[1] * step); return;
    }
    if (!target || !direction || !grips) return;
    event.preventDefault(); const step = event.shiftKey ? 10 : 2;
    move(begin(target.dataset.drag), direction[0] * step, direction[1] * step);
  });
  function reset() {
    states.delete(index); completed.delete(index); feedback(); selected = -1; grips = null;
    marks = booleanRows(level().arity).map(() => null);
    weights = Array(level().arity).fill(1); bias = -1; ready = false; angle = 35; tilt = 26;
    mountLevel();
  }
  function mountLevel() {
    if (drag && plot.hasPointerCapture(drag.pointer)) plot.releasePointerCapture(drag.pointer);
    drag = null; delete root.dataset.dragging; controls = []; viewControls = [];
    presets(); rows = booleanRows(level().arity);
    dots.replaceChildren();
    points = rows.map((row, i) => {
      const point = svg('g', {role: 'button', tabindex: '0', 'data-point': i, class: 'separation-point'});
      point.append(svg('circle', {r: 23, class: 'separation-hit'}), svg('circle', {r: 16, class: 'separation-dot'}),
        svg('text', {'text-anchor': 'middle', y: 6, 'data-mark': ''}, '?'),
        svg('text', {'text-anchor': 'middle', y: 34, class: 'separation-coordinate-label'}, row.join('')));
      activate(point, () => {
        marks[i] = marks[i] === null ? 0 : marks[i] === 0 ? 1 : null;
        selected = i; ready = false; grips = null; changed();
      });
      dots.append(point); return point;
    });
    const table = el('table', {class: 'perceptron-truth-table'}), head = el('thead'), header = el('tr'), body = el('tbody');
    table.append(el('caption', {}, `${level().label} truth-table`));
    [...names.slice(0, level().arity), 'f'].forEach((name, i) => header.append(el('th', {scope: 'col', class: i === level().arity ? 'perceptron-divider' : ''}, name)));
    head.append(header);
    rows.forEach((row, i) => {
      const tr = el('tr'); row.forEach(value => tr.append(el('td', {}, String(value))));
      tr.append(el('td', {class: 'perceptron-divider'}, String(level().values[i]))); body.append(tr);
    });
    table.append(head, body); q('[data-table]').replaceChildren(table);
    const rotation = q('[data-rotation]'); rotation.replaceChildren();
    if (level().arity === 3) {
      viewControls.push(control(rotation, 'Rotate cube', angle, 0, 360, 0.0001, value => {if (Number.isFinite(value)) {angle = value; draw();}}, true));
      viewControls.push(control(rotation, 'Tilt cube', tilt, 0, 360, 0.0001, value => {if (Number.isFinite(value)) {tilt = value; draw();}}, true));
    }
    const coefficients = q('[data-coefficients]'); coefficients.replaceChildren();
    weights.forEach((weight, i) => controls.push(control(coefficients, `Weight ${names[i]}`, weight, -3, 3, 0.0001, value => {weights[i] = value; changed();})));
    controls.push(control(coefficients, 'Bias', bias, -4, 4, 0.0001, value => {bias = value; changed();}));
    draw();
  }
  q('[data-check-points]').addEventListener('click', () => {
    const result = checkRecordedTable(marks, level().values);
    if (!result.complete) feedback('Give every point a value from the table.');
    else if (!result.correct) feedback(`Check point (${rows[result.mismatch].join(', ')}): the table gives ${level().values[result.mismatch]}.`);
    else {ready = true; feedback(); draw(); q('[data-coefficients] input').focus({preventScroll: true});}
  });
  q('[data-check-separator]').addEventListener('click', () => {
    if (!valid()) {feedback('Enter a finite number for each weight and the bias.'); return;}
    const mismatch = rows.findIndex((row, i) => evaluateUnit(row, weights, bias).output !== level().values[i]);
    if (mismatch === -1) {completed.add(index); presets(); feedback(`Correct: this ${level().arity === 2 ? 'line' : 'plane'} separates the two values.`, true);}
    else feedback(`Point (${rows[mismatch].join(', ')}) needs output ${level().values[mismatch]}; your separator gives ${1 - level().values[mismatch]}.`);
  });
  q('[data-not-separable]').addEventListener('click', () => {
    if (level().separable) feedback('A separator exists. Try changing its direction and position.');
    else {completed.add(index); presets(); feedback('Correct: these points are not linearly separable. Explain why in your answer.', true);}
  });
  q('[data-reset]').addEventListener('click', reset);
  reset(); q('[data-app-fallback]').remove();
}
