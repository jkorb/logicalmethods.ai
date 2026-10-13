// Presentation-only proof sizing. Chapter canvases keep their own fitting.
const fitters = new WeakMap();

export function fitSlideProofs(slide) {
  for (const board of slide.querySelectorAll('[data-proof-zoom]')) fitters.get(board)?.();
}

export function mountSlideProofZoom(root) {
  for (const board of root.querySelectorAll('.nd-app .nd-board')) {
    const controls = board.parentElement.querySelector('.nd-canvas-controls');
    if (!controls) continue;
    board.dataset.proofZoom = '1';
    const group = document.createElement('div');
    group.className = 'nd-proof-zoom';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Proof zoom');
    const button = (label, text, action) => {
      const element = document.createElement('button');
      element.type = 'button';
      element.textContent = text;
      element.title = label;
      element.setAttribute('aria-label', label);
      element.addEventListener('click', action);
      group.append(element);
      return element;
    };
    let zoom = 1, pending = 0;
    const change = value => {
      zoom = Math.max(.75, Math.min(1.5, value));
      board.dataset.proofZoom = String(zoom);
      out.disabled = zoom === .75;
      into.disabled = zoom === 1.5;
      reset.textContent = zoom === 1 ? 'Fit' : `${Math.round(zoom * 100)}%`;
      if (zoom === 1) board.scrollTo(0, 0);
      schedule();
    };
    const out = button('Zoom out proof', '−', () => change(zoom - .25));
    const reset = button('Fit proof', 'Fit', () => change(1));
    const into = button('Zoom in proof', '+', () => change(zoom + .25));
    controls.prepend(group);

    function fit() {
      if (!board.clientWidth || !board.clientHeight) return;
      // Slide fitting may have hidden a one-pixel scrollbar. Manual zoom
      // must release that clipping even though the canvas itself stays fixed.
      for (const axis of ['X', 'Y']) {
        const mark = `deckSnug${axis}`;
        if (board.dataset[mark] !== undefined) {
          board.style.removeProperty(`overflow-${axis.toLowerCase()}`);
          delete board.dataset[mark];
        }
      }
      const style = getComputedStyle(board);
      // Leave two layout pixels for rounding across nested CSS zoom levels.
      const width = board.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 2;
      const height = board.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) - 2;
      for (const tree of board.querySelectorAll(':scope > .nd-derivation, :scope > .nd-tree')) {
        tree.style.setProperty('--nd-proof-scale', '1');
        const margin = getComputedStyle(tree);
        const availableWidth = width - parseFloat(margin.marginLeft) - parseFloat(margin.marginRight);
        const availableHeight = height - parseFloat(margin.marginTop) - parseFloat(margin.marginBottom);
        const fitted = Math.min(1, availableWidth / Math.max(1, tree.scrollWidth), availableHeight / Math.max(1, tree.scrollHeight));
        tree.style.setProperty('--nd-proof-scale', String(Math.max(.1, fitted) * zoom));
      }
    }
    function schedule() {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(fit);
    }
    fitters.set(board, fit);
    new ResizeObserver(schedule).observe(board);
    new MutationObserver(schedule).observe(board, { childList: true, subtree: true });
    document.fonts?.ready.then(schedule);
    schedule();
  }
}
