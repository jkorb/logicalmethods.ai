export function el(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  return node;
}
export function svg(tag, attrs = {}, text) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  return node;
}
export function navigation(root, length, render) {
  let index = 0;
  const buttons = [...root.querySelectorAll('[data-action]')];
  function update() {
    for (const b of buttons) b.disabled = ['first', 'previous'].includes(b.dataset.action) ? index === 0 : index === length - 1;
    root.querySelector('[data-count]').textContent = `${index + 1} / ${length}`;
    render(index);
  }
  buttons.forEach(b => { b.onclick = () => {
    const action = b.dataset.action;
    index = action === 'first' ? 0 : action === 'last' ? length - 1 : index + (action === 'next' ? 1 : -1);
    update();
  }; });
  update();
  return { go(next) { index = Math.max(0, Math.min(length - 1, next)); update(); } };
}
export function activate(node, action) {
  node.addEventListener('click', action);
  node.addEventListener('keydown', e => { if (['Enter', ' '].includes(e.key)) { e.preventDefault(); action(e); } });
}
export function lamp(x, y, value, label) {
  const g = svg('g', { class: 'boolean-lamp' });
  g.append(svg('circle', { cx: x, cy: y, r: 14, class: 'bulb' }));
  g.append(svg('path', { d: `M${x-9},${y-9} l18,18 M${x+9},${y-9} l-18,18` }));
  if (value === 1) for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    g.append(svg('line', { x1: x + 21 * Math.cos(a), y1: y + 21 * Math.sin(a), x2: x + 31 * Math.cos(a), y2: y + 31 * Math.sin(a), class: 'ray' }));
  }
  g.append(svg('text', { x, y: y - 39, 'text-anchor': 'middle' }, label));
  g.append(svg('text', { x: x + 42, y: y + 6 }, value === null ? '?' : String(value)));
  return g;
}

export function formula(text) {
  const span = el('span', { class: 'boolean-app__formula' });
  for (const part of text.split(/\b(NOT|AND|OR|XOR|NAND|NOR|XNOR)\b/)) {
    span.append(/^(NOT|AND|OR|XOR|NAND|NOR|XNOR)$/.test(part) ? el('span', { class: 'boolean-operator' }, part) : document.createTextNode(part));
  }
  return span;
}
export function choices(container, items, value, changed, label) {
  container.setAttribute('role', 'group'); container.setAttribute('aria-label', label);
  container.classList.add('boolean-choices'); container.replaceChildren();
  for (const item of items) {
    const [id, text] = Array.isArray(item) ? item : [item, item];
    const b = el('button', { type: 'button', 'aria-pressed': String(id === value), 'data-choice': id }, text);
    b.addEventListener('click', () => {
      container.querySelectorAll('button').forEach(n => n.setAttribute('aria-pressed', String(n === b)));
      changed(id);
    });
    container.append(b);
  }
}
export function inputSwitch(x, y, value, label, action, key = label) {
  const g = svg('g', { role: 'button', tabindex: 0, 'aria-label': `Toggle ${label}`, 'aria-pressed': String(Boolean(value)), 'data-focus': `switch-${key}`, class: 'circuit-switch' });
  g.append(svg('rect', { x:x-30, y:y-28, width:65, height:85, class:'hit-area' }),
    svg('path', { d:`M${x},${y+34} V${y+7}`, class:'signal signal--1 switch-supply' }),
    svg('path', { d:`M${x},${y+7} L${x+(value?0:22)},${y-25}`, class:'signal signal--1 switch-blade' }),
    svg('circle',{cx:x,cy:y+7,r:4,class:'switch-pivot'}),
    svg('circle',{cx:x,cy:y-25,r:4,class:'switch-contact'}),
    svg('text',{x,y:y+61,'text-anchor':'middle'},`${label}: ${value}`));
  activate(g,action); return g;
}

export function iconButton(root,icon,label,type='button') {
  const button=el('button',{type,'aria-label':label,title:label});
  button.append(root.querySelector(`[data-icon="${icon}"]`).content.cloneNode(true));return button;
}
