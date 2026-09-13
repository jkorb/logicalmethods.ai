// Each definition remains ordinary prose until the interaction is ready.
for (const guide of document.querySelectorAll('[data-tree-guide]')) {
  const header = document.querySelector('.site-header');
  if (header) {
    const positionDiagram = () => guide.style.setProperty('--tree-guide-top', `${header.getBoundingClientRect().height + 8}px`);
    positionDiagram();
    new ResizeObserver(positionDiagram).observe(header);
  }
  const definitions = [...guide.querySelectorAll('[data-concept]')];
  let selected = null;
  let hovered = null;
  let focused = null;
  function render() {
    const active = hovered || focused || selected;
    const nodes = (active?.dataset.nodes || '').split(' ');
    const edges = (active?.dataset.edges || '').split(' ');
    for (const node of guide.querySelectorAll('[data-node]')) {
      node.classList.toggle('is-highlighted', nodes.includes(node.dataset.node));
    }
    for (const edge of guide.querySelectorAll('[data-edge]')) {
      edge.classList.toggle('is-highlighted', edges.includes(edge.dataset.edge));
    }
    for (const definition of definitions) {
      definition.classList.toggle('is-active', definition === active);
      definition.querySelector('button').setAttribute('aria-expanded', String(definition === selected));
      definition.querySelector('dd').hidden = definition !== selected;
    }
  }
  for (const definition of definitions) {
    const term = definition.querySelector('dt');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = term.textContent;
    button.setAttribute('aria-label', term.textContent);
    button.setAttribute('aria-expanded', 'false');
    const description = definition.querySelector('dd');
    description.id = `${guide.id}-${definition.dataset.concept}`;
    button.setAttribute('aria-controls', description.id);
    term.replaceChildren(button);
    button.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') { hovered = definition; render(); }
    });
    button.addEventListener('pointerleave', () => { hovered = null; render(); });
    button.addEventListener('focus', () => { focused = definition; render(); });
    button.addEventListener('blur', () => { focused = null; render(); });
    button.addEventListener('click', () => {
      selected = selected === definition ? null : definition;
      hovered = null;
      focused = null;
      render();
    });
    button.addEventListener('keydown', event => {
      if (event.key === 'Escape') { selected = hovered = focused = null; render(); }
    });
  }
  render();
  guide.querySelector('.tree-guide__hint').hidden = false;
}
