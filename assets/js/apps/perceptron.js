import {implementationLevels, blackBoxLevels, emptyPracticeNetwork, checkRecordedTable, checkBlackBoxFormula} from '../logic/perceptron-practice.js';
import {enableLatexInput, convertInput} from './latex-input.js';
import {mountSeparationPractice} from './perceptron-separation.js';
import {el, svg, choices} from './boolean-ui.js';
import {booleanRows, evaluateUnit, gates, xorNetwork, compileTruthTable, evaluateNetwork, rowFormula, tableDNF, kbNames, kbNetwork, kbValues, queryBlackBox, sigmoid, evaluateSigmoid, rainProbabilities} from '../logic/perceptron.js';

const subs = ['₁', '₂', '₃'];
const tablePresets = {
  and: {label: 'AND', values: gates.and.values},
  or: {label: 'OR', values: gates.or.values},
  xor: {label: 'XOR', values: gates.xor.values},
  xnor: {label: 'XNOR', values: [1, 0, 0, 1]},
  implies: {label: 'IF', values: gates.implies.values},
  zero: {label: 'All 0', values: [0, 0, 0, 0]},
  one: {label: 'All 1', values: [1, 1, 1, 1]},
};
const fmt = value => String(Number(value.toFixed(4))).replace('-', '−');
const button = (label, action, attrs = {}) => {
  const node = el('button', {type: 'button', ...attrs}, label);
  node.addEventListener('click', action);
  return node;
};
function table(headers, caption) {
  const node = el('table'), head = el('thead'), row = el('tr'), body = el('tbody');
  node.append(el('caption', {}, caption));
  headers.forEach(text => row.append(el('th', {scope: 'col'}, text)));
  head.append(row); node.append(head, body);
  return {node, body};
}
function scrollTable(node) {
  const wrap = el('div', {class: 'perceptron-scroll', tabindex: '0', role: 'region', 'aria-label': node.caption.textContent});
  wrap.append(node); return wrap;
}
// Keep the diagram controls mounted while calculations update, including incomplete
// number edits. Native controls share a coordinate space with the SVG connections.
function networkDiagram(host, names, network, {toggle, change, blackbox, probability = false}) {
  const single = !network?.hidden, count = network?.hidden?.length ?? 0;
  const dense = count > 2;
  const width = single || count === 0 ? 440 : 580;
  const height = single ? (names.length > 2 ? 320 : 280) : count === 0 ? 240 : Math.max(300, count * 110 + 60);
  const inputX = 45, hiddenX = 210, outputX = single || count === 0 ? 215 : 355;
  const activationX = single || count === 0 ? 305 : 445, arrowX = width - 65, valueX = width - 30;
  const stage = el('div', {class: 'perceptron-stage', style: `width:${width}px;height:${height}px`});
  const drawing = svg('svg', {viewBox: `0 0 ${width} ${height}`, 'aria-hidden': 'true'});
  stage.append(drawing);
  const wrap = el('div', {class: 'perceptron-scroll', tabindex: '0', role: 'region', 'aria-label': 'Network diagram'});
  wrap.append(stage); host.replaceChildren(wrap);
  const spaced = (i, n) => n === 1 ? height / 2 : 70 + i * (height - 140) / (n - 1);
  const inputY = names.map((_, i) => spaced(i, names.length));
  const hiddenY = network?.hidden?.map((_, i) => spaced(i, count)) ?? [];
  const outY = height / 2;
  function place(node, x, y) {
    node.classList.add('perceptron-position');
    node.style.left = `${x / width * 100}%`; node.style.top = `${y / height * 100}%`;
    stage.append(node); return node;
  }
  function label(text, x, y) { return place(el('span', {class: 'perceptron-label'}, text), x, y); }
  const edges = [];
  function edge(x1, y1, x2, y2, source, hiddenIndex, startInset = 23, endInset = 23) {
    const line = svg('line', {x1, y1, x2, y2, class: 'perceptron-edge', 'data-signal-source': source});
    const head = svg('path', {class: 'perceptron-arrowhead'});
    drawing.append(line, head);
    const connection = {line, head, source, hiddenIndex, x1, y1, x2, y2, startInset, endInset};
    edges.push(connection); return connection;
  }
  const incomingFields = [], weightFields = [];
  function field(unit, index, x, y, name, hiddenIndex, connection) {
    const isBias = index === null;
    const holder = el('label', {class: `perceptron-parameter ${isBias ? 'perceptron-bias' : 'perceptron-weight'}`});
    const input = el('input', {type: 'number', step: '0.5', 'aria-label': name, title: name});
    input.value = isBias ? unit.bias : unit.weights[index];
    if (isBias) holder.append(el('span', {}, 'b ='));
    holder.append(input); place(holder, x, y);
    if (connection) weightFields.push({holder, connection});
    input.addEventListener('input', () => {
      if (isBias) unit.bias = input.valueAsNumber;
      else unit.weights[index] = input.valueAsNumber;
      input.setAttribute('aria-invalid', String(!Number.isFinite(input.valueAsNumber)));
      change();
    });
    if (hiddenIndex !== undefined) incomingFields.push({holder, hiddenIndex});
  }
  function neuron(x, y, text, action, attrs = {}) {
    const node = action ? button(text, action, attrs) : el('span', attrs, text);
    node.classList.add('perceptron-neuron'); return place(node, x, y);
  }
  const inputNodes = names.map((name, i) => {
    label(name, inputX, inputY[i]);
    if (probability) return neuron(inputX, inputY[i], '0');
    return neuron(inputX, inputY[i], '0', () => toggle(i), {'aria-label': `Toggle ${name}`, 'aria-pressed': 'false'});
  });
  const hiddenNodes = [];
  let selected = 0;
  function select(index) {
    selected = index;
    incomingFields.forEach(({holder, hiddenIndex}) => {holder.hidden = dense && hiddenIndex !== selected;});
    hiddenNodes.forEach((node, i) => {
      if (dense) node.setAttribute('aria-pressed', String(i === selected));
    });
    edges.forEach(({line, head, hiddenIndex}) => {
      for (const part of [line, head]) part.classList.toggle('is-muted', dense && hiddenIndex !== undefined && hiddenIndex !== selected);
    });
    positionWeights();
  }
  if (blackbox) {
    inputY.forEach((y, i) => edge(inputX, y, outputX, outY, i, undefined, 23, 55));
    edge(outputX, outY, arrowX, outY, 'output', undefined, 55, 0);
    place(el('span', {class: 'perceptron-box'}, 'Black box'), outputX, outY);
  } else if (single) {
    inputY.forEach((y, i) => {
      const connection = edge(inputX, y, outputX, outY, i);
      field(network, i, 160, y, names.length === 2 ? `Weight w${subs[i]}` : `Weight ${names[i]}`, undefined, connection);
    });
    field(network, null, outputX, outY + 55, 'Bias b');
  } else {
    hiddenY.forEach((y, j) => {
      const unit = network.hidden[j];
      inputY.forEach((from, i) => {
        const connection = edge(inputX, from, hiddenX, y, i, j);
        field(unit, i, 160, from, `Weight from ${names[i]} to h${j + 1}`, j, connection);
      });
      const connection = edge(hiddenX, y, outputX, outY, j + names.length);
      field(network.output, j, 360, y, `Weight from h${j + 1} to y`, undefined, connection);
      label(`h${j + 1}`, hiddenX, y);
      hiddenNodes.push(neuron(hiddenX, y, '0', dense ? () => select(j) : null,
        dense ? {'aria-label': `Inspect hidden unit h${j + 1}`, 'aria-pressed': 'false', title: 'Edit incoming weights'} : {}));
      field(unit, null, hiddenX, y + 53, `Bias of h${j + 1}`);
    });
    field(network.output, null, outputX, outY + 55, 'Bias of y');
  }
  let sumNode, scoreLabel;
  if (!blackbox) {
    sumNode = neuron(outputX, outY, 'Σ');
    sumNode.classList.add('perceptron-sum');
    scoreLabel = label('z = ?', outputX, outY);
    scoreLabel.dataset.networkScore = '';
    const activation = el('span', {class: 'perceptron-activation', role: 'img', 'aria-label': probability ? 'Sigmoid activation' : 'Step activation'});
    const icon = svg('svg', {viewBox: '0 0 64 52', 'aria-hidden': 'true'});
    icon.append(svg('path', {d: 'M4 40H60 M32 48V4', class: 'perceptron-axis'}),
      svg('path', {d: 'M6 40H32 M32 14H58', class: 'perceptron-step-line'}),
      svg('circle', {cx: 32, cy: 40, r: 2.5, class: 'perceptron-step-closed'}),
      svg('circle', {cx: 32, cy: 14, r: 2.5, class: 'perceptron-step-open'}));
    if (probability) {
      icon.replaceChildren(svg('path', {d: 'M4 40H60 M32 48V4', class: 'perceptron-axis'}),
        svg('path', {d: 'M6 40C32 40 32 14 58 14', class: 'perceptron-step-line'}));
    }
    activation.append(icon); place(activation, activationX, outY);
    edge(outputX, outY, activationX, outY, 'score', undefined, 23, 28);
    edge(activationX, outY, arrowX, outY, 'output', undefined, 28, 0);
  }
  label('y', valueX, outY);
  const outputNode = place(el('span', {class: 'perceptron-output', 'data-network-output': ''}, '?'), valueX, outY);

  // Place each number beside its connection, clear of wires and other controls.
  // Measure in pixels so the gap survives resizing without shrinking the fields.
  function positionWeights() {
    const rect = stage.getBoundingClientRect();
    if (!rect.width) return;
    const scale = rect.width / stage.offsetWidth;
    const bounds = {width: stage.offsetWidth, height: stage.offsetHeight};
    const sx = bounds.width / width, sy = bounds.height / height;
    const connections = edges.map(e => {
      const dx = (e.x2 - e.x1) * sx, dy = (e.y2 - e.y1) * sy, length = Math.hypot(dx, dy);
      const ux = dx / length, uy = dy / length;
      const a = [e.x1 * sx + ux * e.startInset, e.y1 * sy + uy * e.startInset];
      const b = [e.x2 * sx - ux * e.endInset, e.y2 * sy - uy * e.endInset];
      e.line.setAttribute('x1', a[0] / sx); e.line.setAttribute('y1', a[1] / sy);
      e.line.setAttribute('x2', b[0] / sx); e.line.setAttribute('y2', b[1] / sy);
      e.head.setAttribute('d', `M${b[0] / sx},${b[1] / sy} L${(b[0] - 6 * ux + 3 * uy) / sx},${(b[1] - 6 * uy - 3 * ux) / sy} L${(b[0] - 6 * ux - 3 * uy) / sx},${(b[1] - 6 * uy + 3 * ux) / sy} Z`);
      return {a, b};
    });
    const obstacles = [...stage.querySelectorAll('.perceptron-neuron, .perceptron-label, .perceptron-bias, .perceptron-box, .perceptron-activation, .perceptron-output')].map(node => {
      const r = node.getBoundingClientRect();
      return {left: (r.left - rect.left) / scale - 5, right: (r.right - rect.left) / scale + 5, top: (r.top - rect.top) / scale - 5, bottom: (r.bottom - rect.top) / scale + 5};
    });
    const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    function crosses({a, b}, box) {
      let low = 0, high = 1;
      for (let axis = 0; axis < 2; axis++) {
        const delta = b[axis] - a[axis], min = axis ? box.top : box.left, max = axis ? box.bottom : box.right;
        if (!delta) { if (a[axis] < min || a[axis] > max) return false; }
        else {
          const t1 = (min - a[axis]) / delta, t2 = (max - a[axis]) / delta;
          low = Math.max(low, Math.min(t1, t2)); high = Math.min(high, Math.max(t1, t2));
          if (low > high) return false;
        }
      }
      return true;
    }
    weightFields.filter(({holder}) => !holder.hidden).forEach(({holder, connection}) => {
      const {x1, y1, x2, y2} = connection, dx = (x2 - x1) * sx, dy = (y2 - y1) * sy;
      const length = Math.hypot(dx, dy), nx = -dy / length, ny = dx / length;
      const hw = holder.offsetWidth / 2, hh = holder.offsetHeight / 2;
      const clearance = Math.abs(nx) * hw + Math.abs(ny) * hh;
      const candidates = [];
      for (const gap of [8, 16, 28, 42]) for (const t of [.55, .7, .4, .8, .3, .2]) for (const side of [-1, 1]) {
        const x = x1 * sx + dx * t + nx * (clearance + gap) * side;
        const y = y1 * sy + dy * t + ny * (clearance + gap) * side;
        const box = {left: x - hw - 3, right: x + hw + 3, top: y - hh - 3, bottom: y + hh + 3};
        if (box.left < 0 || box.right > bounds.width || box.top < 0 || box.bottom > bounds.height) continue;
        const collisions = connections.filter(line => crosses(line, box)).length + obstacles.filter(other => overlaps(box, other)).length;
        candidates.push({x, y, box, collisions});
      }
      const best = candidates.find(candidate => !candidate.collisions) ?? candidates.sort((a, b) => a.collisions - b.collisions)[0];
      if (best) {
        holder.style.left = `${best.x}px`; holder.style.top = `${best.y}px`;
        obstacles.push(best.box);
      }
    });
  }
  function resize() {
    const zoom = Number(host.closest('.perceptron-app').dataset.zoom || 1);
    stage.style.zoom = String(Math.min(1, host.clientWidth / width) * zoom);
    positionWeights();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  select(0); resize();
  return {
    destroy() {observer.disconnect();},
    resize,
    update(inputs, result) {
      inputNodes.forEach((node, i) => {
        node.textContent = inputs[i];
        if (!probability) node.setAttribute('aria-pressed', String(Boolean(inputs[i])));
        node.classList.toggle('is-active', Boolean(inputs[i]));
      });
      hiddenNodes.forEach((node, i) => {
        const value = result?.hidden?.[i].output;
        node.textContent = value ?? '?'; node.classList.toggle('is-active', value === 1);
      });
      outputNode.textContent = result ? (probability ? fmt(result.output) : result.output ?? '?') : '?';
      outputNode.classList.toggle('is-active', result?.output === 1);
      if (scoreLabel) scoreLabel.textContent = `z = ${result ? fmt(result.sum) : '?'}`;
      edges.forEach(({line, head, source}) => {
        const value = source === 'output' ? result?.output : source === 'score' ? undefined : source < names.length ? inputs[source] : result?.hidden?.[source - names.length].output;
        for (const part of [line, head]) {
          part.classList.toggle('is-active', value === 1);
          part.classList.toggle('is-off', value === 0);
          part.classList.toggle('is-unknown', source !== 'score' && value == null);
        }
      });
      positionWeights();
    }
  };
}

function separationPlot(weights, bias, values) {
  const drawing = svg('svg', {viewBox: '0 0 280 260', class: 'perceptron-plot', role: 'img', 'aria-label': 'Boolean inputs in the plane. Each point shows target and network output; the line is the zero score boundary.'});
  const x = value => 65 + value * 150, y = value => 200 - value * 150;
  const line = (x1, y1, x2, y2, cls) => drawing.append(svg('line', {x1, y1, x2, y2, class: cls}));
  line(35, 200, 250, 200, 'perceptron-axis'); line(65, 230, 65, 25, 'perceptron-axis');
  const label = (px, py, text) => drawing.append(svg('text', {x: px, y: py, 'text-anchor': 'middle'}, text));
  label(252, 219, 'x₁'); label(38, 25, 'x₂');
  // Clip the boundary to the plotted square in data coordinates.
  const low = -0.15, high = 1.15, points = [];
  if (weights[1] !== 0) for (const px of [low, high]) {
    const py = -(weights[0] * px + bias) / weights[1];
    if (py >= low && py <= high) points.push([x(px), y(py)]);
  }
  if (weights[0] !== 0) for (const py of [low, high]) {
    const px = -(weights[1] * py + bias) / weights[0];
    if (px >= low && px <= high) points.push([x(px), y(py)]);
  }
  if (points.length >= 2) line(...points[0], ...points[points.length - 1], 'perceptron-boundary');
  booleanRows(2).forEach((row, i) => {
    const output = evaluateUnit(row, weights, bias).output;
    drawing.append(svg('circle', {cx: x(row[0]), cy: y(row[1]), r: 16, class: `perceptron-node${values[i] ? ' is-active' : ''}`}));
    label(x(row[0]), y(row[1]) + 6, String(values[i]));
    label(x(row[0]), y(row[1]) + 35, `y=${output}${output === values[i] ? '' : ' ×'}`);
  });
  return drawing;
}

function probabilityPlot(network, input) {
  const drawing = svg('svg', {viewBox: '0 0 300 275', class: 'perceptron-probability-plot', role: 'img',
    'aria-label': 'Rain probability against cloud cover. Blue curve: network estimate. Open circles: five invented example probabilities.'});
  const x = value => 45 + 225 * value, y = value => 220 - 175 * value;
  drawing.append(svg('path', {d: 'M45 35V220H280', class: 'perceptron-axis'}));
  const label = (px, py, text, anchor = 'middle') => drawing.append(svg('text', {x: px, y: py, 'text-anchor': anchor}, text));
  label(45, 23, 'Pr(RAIN | x)', 'start'); label(160, 270, 'Cloud cover x');
  for (const value of [0, 0.5, 1]) {
    label(x(value), 242, String(value)); label(32, y(value) + 6, String(value), 'end');
  }
  const points = Array.from({length: 101}, (_, i) => `${x(i / 100)},${y(sigmoid(network.weights[0] * i / 100 + network.bias))}`);
  drawing.append(svg('polyline', {points: points.join(' '), class: 'perceptron-probability-curve'}));
  rainProbabilities.forEach(([cover, probability]) => {
    const point = svg('circle', {cx: x(cover), cy: y(probability), r: 5, class: 'perceptron-reference-point'});
    point.append(svg('title', {}, `Cloud cover ${cover}: probability ${probability}`)); drawing.append(point);
  });
  const estimate = evaluateSigmoid([input], network.weights, network.bias).output;
  drawing.append(svg('path', {d: `M${x(input)} 220V${y(estimate)}`, class: 'perceptron-probability-guide'}),
    svg('circle', {cx: x(input), cy: y(estimate), r: 5, class: 'perceptron-current-estimate'}));
  return drawing;
}

export function mountPerceptron(root) {
  if (root.dataset.kind === 'practice' && root.dataset.exercise === 'separate') {mountSeparationPractice(root); return;}
  const q = selector => root.querySelector(selector), kind = root.dataset.kind;
  const practice = kind === 'practice';
  const basic = ['unit', 'gates', 'separation'].includes(kind), blackbox = kind === 'blackbox' || practice && root.dataset.exercise === 'blackbox';
  const levels = practice ? (blackbox ? blackBoxLevels : implementationLevels) : [];
  let levelIndex = 0, completed = new Set(), feedback = '', feedbackKind = '';
  let rebuilding = false, identified = false, builtObserved = [], constructionHidden = 0;
  const practiceStates = new Map();
  let architectures = new Map();
  const viewingBox = () => blackbox && !rebuilding;
  const currentLevel = () => levels[levelIndex];
  const probability = kind === 'probability';
  let names = probability ? ['x'] : kind === 'kb' ? kbNames : ['x₁', 'x₂'];
  let rows = booleanRows(names.length);
  let inputs, network, diagram, target, values, observed, preset;
  const toolbar = q('[data-toolbar]');
  const tools = q('[data-tools]');
  const full = q('[data-fullscreen]'), zoom = q('[data-zoom]');
  let expandedDialog = null, placeholder = null;
  function syncFullscreen() {
    const expanded = document.fullscreenElement === root || Boolean(expandedDialog);
    full.setAttribute('aria-pressed', String(expanded));
    full.setAttribute('aria-label', expanded ? 'Exit fullscreen' : 'Fullscreen');
    full.title = expanded ? 'Exit fullscreen' : 'Fullscreen';
    diagram?.resize();
  }
  function closeDialog() {
    placeholder.replaceWith(root); root.classList.remove('is-expanded');
    expandedDialog.close(); expandedDialog.remove(); expandedDialog = null;
    syncFullscreen(); full.focus();
  }
  async function toggleFullscreen() {
    if (expandedDialog) { closeDialog(); return; }
    if (document.fullscreenElement === root) { await document.exitFullscreen(); return; }
    try { await root.requestFullscreen(); }
    catch {
      placeholder = document.createComment('Expanded perceptron app'); root.before(placeholder);
      expandedDialog = el('dialog', {class: 'perceptron-dialog prose', 'aria-label': root.getAttribute('aria-label')});
      document.body.append(expandedDialog); expandedDialog.append(root); root.classList.add('is-expanded');
      expandedDialog.addEventListener('cancel', event => {event.preventDefault(); closeDialog();});
      expandedDialog.showModal(); full.focus();
    }
    syncFullscreen();
  }
  full.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', syncFullscreen);
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.fullscreenElement === root) {event.preventDefault(); document.exitFullscreen();}
  });
  function setZoom(enlarged) {
    root.dataset.zoom = enlarged ? '1.5' : '1';
    zoom.setAttribute('aria-pressed', String(enlarged));
    zoom.setAttribute('aria-label', enlarged ? 'Fit network' : 'Enlarge network');
    zoom.title = enlarged ? 'Fit network' : 'Enlarge network';
  }
  zoom.addEventListener('click', () => {
    setZoom(root.dataset.zoom !== '1.5'); diagram.resize();
  });
  const motion = q('[data-motion]'), preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  function updateMotion() {
    const stopped = preference.matches || paused;
    root.dataset.paused = String(stopped);
    motion.disabled = preference.matches;
    motion.setAttribute('aria-pressed', String(stopped));
    motion.setAttribute('aria-label', preference.matches ? 'Animation off: reduced motion' : stopped ? 'Play animation' : 'Pause animation');
    motion.title = motion.getAttribute('aria-label');
    q('[data-motion-play]').hidden = !stopped;
    q('[data-motion-pause]').hidden = stopped;
  }
  motion.addEventListener('click', () => {paused = !paused; updateMotion();});
  preference.addEventListener('change', updateMotion);
  updateMotion();
  function rebuildDiagram() {
    diagram?.destroy();
    diagram = networkDiagram(q('[data-network]'), names, network, {
      blackbox: viewingBox(), probability, change() {
        if (practice) {
          if (rebuilding) builtObserved = rows.map(() => null);
          else observed = rows.map(() => null);
          invalidatePractice();
        }
        render();
      },
      toggle(i) {inputs[i] = 1 - inputs[i]; render();}
    });
    const region = q('[data-network] [role=region]');
    region.setAttribute('aria-label', `${root.getAttribute('aria-label')}: Network diagram`);
  }
  function compile() { network = compileTruthTable(values); rebuildDiagram(); }
  function presetControls() {
    if (practice) {
      choices(q('[data-presets]'), levels.map((level, i) => [String(i), level.label]), String(levelIndex), key => switchLevel(Number(key)), blackbox ? 'Black-box levels' : 'Functions to implement');
      markCompleted(); return;
    }
    if (kind === 'table') {
      choices(q('[data-presets]'), Object.entries(tablePresets).map(([key, gate]) => [key, gate.label]), 'xor', key => {
        values = [...tablePresets[key].values]; compile(); render();
      }, 'Truth-function to implement');
      return;
    }
    if (kind !== 'gates') return;
    choices(q('[data-presets]'), Object.entries(gates).filter(([key]) => key !== 'xor').map(([key, gate]) => [key, gate.label]), preset, key => {
      preset = key; network = {weights: [...gates[key].weights], bias: gates[key].bias}; target = gates[key].values;
      rebuildDiagram(); render();
    }, 'Truth-function to implement');
  }
  if (kind === 'gates' || kind === 'table' || practice) toolbar.append(el('div', {'data-presets': ''}));
  if (blackbox || practice) {
    const testInput = button('Test input', () => {
      if (practice && !viewingBox() && !validParameters()) {render(); return;}
      const record = rebuilding ? builtObserved : observed;
      record[rowIndex()] = viewingBox() ? (practice ? evaluateNetwork(inputs, oracle).output : queryBlackBox(inputs)) : evaluate(inputs).output;
      if (practice) {feedback = ''; feedbackKind = '';}
      render();
    });
    if (practice && blackbox) {
      const actions = el('div', {class: 'perceptron-network-actions'});
      actions.append(testInput); q('[data-network]').after(actions);
    } else toolbar.append(testInput);
    if (!practice) toolbar.append(button('Test all inputs', () => {observed = rows.map(queryBlackBox); render();}));
  }
  let formulaInput, oracle;
  function markCompleted() {
    if (!practice) return;
    q('[data-presets]').querySelectorAll('[data-choice]').forEach(control => {
      const i = Number(control.dataset.choice);
      control.textContent = `${levels[i].label}${completed.has(i) ? ' ✓' : ''}`;
    });
  }
  function invalidatePractice() {
    feedback = ''; feedbackKind = ''; completed.delete(levelIndex); markCompleted();
  }
  function validParameters() {
    const units = network.hidden ? [...network.hidden, network.output] : [network];
    return units.every(unit => [...unit.weights, unit.bias].every(Number.isFinite));
  }
  function checkPractice() {
    const recorded = checkRecordedTable(rebuilding ? builtObserved : observed, currentLevel().values);
    feedbackKind = 'incorrect';
    if (!recorded.complete) feedback = `Test all ${rows.length} inputs first.`;
    else if (blackbox && !rebuilding) {
      try {
        convertInput(formulaInput);
        const result = checkBlackBoxFormula(formulaInput.value, currentLevel());
        if (result.correct) {identified = true; feedback = 'Correct: your formula agrees with every input.'; feedbackKind = 'correct'; updateTaskViews();}
        else feedback = `For ${Object.entries(result.valuation).map(([name, value]) => `${name} = ${value}`).join(', ')}, your formula gives ${result.actual}; the network gives ${result.expected}.`;
      } catch (error) {feedback = error.message;}
    } else if (recorded.correct) {feedback = 'Correct: every output matches.'; feedbackKind = 'correct';}
    else feedback = `For ${names.map((name, i) => `${name} = ${rows[recorded.mismatch][i]}`).join(', ')}, the network gives ${(rebuilding ? builtObserved : observed)[recorded.mismatch]}; ${rebuilding ? 'the black box' : 'f'} requires ${currentLevel().values[recorded.mismatch]}.`;
    if (feedbackKind === 'correct') {if (!blackbox || rebuilding) completed.add(levelIndex);}
    else completed.delete(levelIndex);
    markCompleted(); render();
  }
  if (practice) {
    const form = el('form', {class: 'perceptron-answer'});
    if (blackbox) {
      formulaInput = el('textarea', {class: 'logic-app__input', rows: '1', 'data-submit-enter': '', maxlength: '512', spellcheck: 'false', 'aria-label': 'Your formula', placeholder: 'Your formula'});
      form.append(formulaInput);
      const changed = () => {identified = false; invalidatePractice(); updateTaskViews(); render();};
      enableLatexInput(formulaInput, changed);
      formulaInput.addEventListener('input', changed);
    }
    form.append(el('button', {type: 'submit'}, 'Check'));
    form.addEventListener('submit', event => {event.preventDefault(); checkPractice();});
    root.querySelector('.perceptron-canvas').after(form);
  }
  let taskViews, architecture;
  function switchLevel(next) {
    if (next === levelIndex) return;
    practiceStates.set(levelIndex, {inputs, network, observed, builtObserved, rebuilding, identified,
      constructionHidden, architectures, feedback, feedbackKind, formula: formulaInput?.value,
      enlarged: root.dataset.zoom === '1.5'});
    levelIndex = next;
    const saved = practiceStates.get(levelIndex);
    if (!saved) {reset(); return;}
    ({inputs, network, observed, builtObserved, rebuilding, identified, constructionHidden,
      architectures, feedback, feedbackKind} = saved);
    names = ['P', 'Q', 'R'].slice(0, currentLevel().arity); rows = booleanRows(names.length);
    values = [...currentLevel().values];
    if (blackbox) {oracle = compileTruthTable(values); formulaInput.value = saved.formula;}
    setZoom(saved.enlarged);
    presetControls(); updateTaskViews(); rebuildDiagram(); render();
  }
  function updateTaskViews() {
    if (!taskViews) return;
    choices(taskViews, [['box', 'Black box'], ['build', 'Your network']], rebuilding ? 'build' : 'box', key => {
      if ((key === 'build') === rebuilding) return;
      rebuilding = key === 'build'; feedback = ''; feedbackKind = '';
      updateTaskViews(); rebuildDiagram(); render();
    }, 'Black-box task');
    taskViews.querySelector('[data-choice="build"]').disabled = !identified;
    formulaInput.hidden = rebuilding;
    architecture.hidden = !rebuilding;
    choices(architecture, [['0', 'One perceptron'], ['2', 'Hidden layer']], String(constructionHidden), key => {
      if (Number(key) === constructionHidden) return;
      architectures.set(constructionHidden, {network, builtObserved, complete: completed.has(levelIndex)});
      constructionHidden = Number(key);
      const saved = architectures.get(constructionHidden);
      network = saved?.network ?? emptyPracticeNetwork({...currentLevel(), hidden: constructionHidden});
      builtObserved = saved?.builtObserved ?? rows.map(() => null);
      invalidatePractice();
      if (saved?.complete) {completed.add(levelIndex); markCompleted();}
      updateTaskViews(); rebuildDiagram(); render();
    }, 'Network structure');
  }
  if (practice && blackbox) {
    const modes = el('div', {class: 'perceptron-task-views'});
    taskViews = el('div', {class: 'perceptron-task-tabs'}); architecture = el('div', {class: 'perceptron-architecture'}); modes.append(taskViews, architecture);
    toolbar.parentElement.after(modes);
  }
  let cloudInput, cloudValue;
  if (probability) {
    const label = el('label', {class: 'perceptron-cloud'});
    cloudValue = el('span');
    cloudInput = el('input', {type: 'range', min: '0', max: '1', step: '0.01', 'aria-label': 'Cloud cover x'});
    label.append(cloudValue, cloudInput); toolbar.append(label);
    cloudInput.addEventListener('input', () => {inputs[0] = cloudInput.valueAsNumber; render();});
  }
  tools.prepend(button('Reset', reset));
  function reset() {
    if (practice) {
      names = ['P', 'Q', 'R'].slice(0, currentLevel().arity); rows = booleanRows(names.length);
      rebuilding = false; identified = false; constructionHidden = 0; builtObserved = rows.map(() => null);
      practiceStates.delete(levelIndex); architectures = new Map();
    }
    inputs = names.map(() => 0); preset = 'and';
    setZoom(false);
    const gate = gates[kind === 'separation' ? 'xor' : 'and'];
    target = gate.values;
    values = kind === 'kb' ? [...kbValues] : [...gates.xor.values];
    observed = rows.map(() => null);
    network = blackbox ? null : basic ? {weights: [...gate.weights], bias: gate.bias} : kind === 'layers' ? structuredClone(xorNetwork) : kind === 'kb' ? structuredClone(kbNetwork) : compileTruthTable(values);
    if (practice) {
      values = [...currentLevel().values];
      network = emptyPracticeNetwork(blackbox ? {...currentLevel(), hidden: constructionHidden} : currentLevel());
      if (blackbox) oracle = compileTruthTable(values);
      if (formulaInput) formulaInput.value = '';
      invalidatePractice();
    }
    if (probability) {inputs = [0.75]; network = {weights: [5], bias: -2.5}; cloudInput.value = '0.75';}
    presetControls(); updateTaskViews(); rebuildDiagram(); render();
  }
  function rowIndex() { return rows.findIndex(row => row.every((value, i) => value === inputs[i])); }
  function evaluate(row) { if (probability) return evaluateSigmoid(row, network.weights, network.bias); return network.hidden ? evaluateNetwork(row, network) : evaluateUnit(row, network.weights, network.bias); }
  function desired() { return basic ? target : values; }
  function drawTable() {
    const boxed = viewingBox();
    const headers = [...names, ...(!boxed ? [rebuilding ? 'Box' : kind === 'kb' ? 'KB' : 'f'] : []), ...(kind === 'layers' ? ['h₁', 'h₂'] : []), 'y'];
    const {node, body} = table(headers, boxed ? 'Observed truth-table' : kind === 'kb' ? 'Models of the knowledge base' : 'Truth-table');
    node.classList.add('perceptron-truth-table');
    node.tHead.rows[0].cells[names.length].classList.add('perceptron-divider');
    rows.forEach((row, i) => {
      const selected = row.every((value, j) => value === inputs[j]);
      const tr = el('tr', {'data-row': i, class: selected ? 'is-selected' : ''});
      row.forEach(value => tr.append(el('td', {}, String(value))));
      if (!boxed) {
        const td = el('td', {class: 'perceptron-divider'});
        if (kind === 'table') td.append(button(String(values[i]), () => {
          values[i] = 1 - values[i]; compile(); render();
        }, {class: 'perceptron-target', 'aria-label': `Toggle target for ${row.join('')}`, 'aria-pressed': String(Boolean(values[i])), 'data-focus': `target-${i}`}));
        else td.textContent = rebuilding ? observed[i] ?? '?' : desired()[i];
        tr.append(td);
      }
      const result = boxed ? null : evaluate(row);
      if (kind === 'layers') result.hidden.forEach(unit => tr.append(el('td', {}, String(unit.output))));
      const output = rebuilding ? builtObserved[i] : boxed || practice ? observed[i] : result.output;
      const mismatch = !boxed && output !== null && output !== desired()[i];
      tr.append(el('td', {'data-output': '', class: `${boxed ? 'perceptron-divider ' : ''}${mismatch ? 'is-mismatch' : ''}`, ...(mismatch ? {'aria-label': `${output}, differs from target ${desired()[i]}`} : {})}, output === null ? '?' : String(output)));
      body.append(tr);
    });
    q('[data-table]').replaceChildren(scrollTable(node));
  }
  function renderBlackBox() {
    const known = observed.filter(value => value !== null).length;
    diagram.update(inputs, {output: observed[rowIndex()]});
    drawTable();
    if (practice) return;
    const rules = el('ul', {class: 'perceptron-formula', 'data-rules': ''});
    observed.forEach((value, i) => {
      if (value !== null) rules.append(el('li', {}, `(${rowFormula(rows[i], ['P', 'Q'])}) → ${value ? 'Y' : '¬Y'}`));
    });
    q('[data-detail]').append(rules);
    if (known === rows.length) {
      q('[data-detail]').append(el('p', {class: 'perceptron-formula', 'data-equivalence': ''}, `Y ↔ ${tableDNF(observed, ['P', 'Q'])}`));
    }
  }
  function render() {
    const focused = root.contains(document.activeElement) ? document.activeElement.dataset.focus : null;
    for (const name of ['calculation', 'table', 'detail']) q(`[data-${name}]`).replaceChildren();
    q('[role=status]').textContent = '';
    if (practice) root.dataset.feedback = feedbackKind;
    if (probability) cloudValue.textContent = `Cloud cover x = ${fmt(inputs[0])}`;
    if (kind === 'table') q('[data-presets]').querySelectorAll('[data-choice]').forEach(control => {
      control.setAttribute('aria-pressed', String(tablePresets[control.dataset.choice].values.every((value, i) => value === values[i])));
    });
    const units = viewingBox() ? [] : network.hidden ? [...network.hidden, network.output] : [network];
    if (viewingBox()) renderBlackBox();
    else if (!units.every(unit => [...unit.weights, unit.bias].every(Number.isFinite))) {
      diagram.update(inputs, null);
      q('[role=status]').textContent = 'Enter a finite number for each weight and the bias.';
    } else {
      const result = evaluate(inputs);
      diagram.update(inputs, result);
      if (probability) {
        q('[data-calculation]').append(
          el('p', {class: 'perceptron-formula', 'data-score': ''}, `z = ${fmt(network.weights[0])} × ${fmt(inputs[0])} + (${fmt(network.bias)}) = ${fmt(result.sum)}`),
          el('p', {class: 'perceptron-formula perceptron-estimate', 'data-verdict': ''}, `Pr(RAIN | x) ≈ sigmoid(${fmt(result.sum)}) = ${fmt(result.output)}`));
        q('[data-detail]').append(probabilityPlot(network, inputs[0]));
        const legend = el('div', {class: 'perceptron-legend'});
        legend.append(el('span', {class: 'perceptron-estimate-key'}, '— Network estimate'), el('span', {class: 'perceptron-reference-key'}, '○ Example probabilities'));
        q('[data-detail]').append(legend);
      } else if (basic) {
        const {weights, bias} = network;
        const terms = inputs.map((value, i) => `(${fmt(weights[i])}) × ${value}`).join(' + ');
        q('[data-calculation]').append(el('p', {class: 'perceptron-formula', 'data-score': ''}, `z = ${terms} + (${fmt(bias)}) = ${fmt(result.sum)}`));
        q('[data-calculation]').append(el('p', {class: 'perceptron-formula', 'data-verdict': ''}, `y = step(${fmt(result.sum)}) = ${result.output}`));
        q('[data-detail]').append(separationPlot(weights, bias, target));
      } else if (kind === 'kb') {
        q('[data-calculation]').append(el('p', {class: 'perceptron-formula'}, '(R ∨ S) → W'));
      } else if (kind === 'table') {
        q('[data-calculation]').append(el('p', {class: 'perceptron-formula', 'data-dnf': ''}, `f = ${tableDNF(values, names)}`));
      }
      if (!probability) drawTable();
    }
    root.querySelectorAll('[data-table] .perceptron-scroll, [data-detail] .perceptron-scroll').forEach(region => {
      region.setAttribute('aria-label', `${root.getAttribute('aria-label')}: ${region.getAttribute('aria-label')}`);
    });
    if (practice && feedback) q('[role=status]').textContent = feedback;
    if (focused) root.querySelector(`[data-focus="${focused}"]`)?.focus({preventScroll: true});
  }
  reset(); q('[data-app-fallback]').remove();
}
