// Fallback for browsers without native content-sized form controls.
if (!CSS.supports('field-sizing', 'content')) {
  const registered = new WeakSet();
  const widths = new WeakMap();
  function fit(field) {
    if (!field.isConnected || !field.getClientRects().length) return;
    const style = getComputedStyle(field);
    const border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    field.style.height = 'auto';
    field.style.height = (field.scrollHeight + border) + 'px';
  }
  const resize = new ResizeObserver(entries => {
    for (const {target, contentRect} of entries) {
      if (widths.get(target) !== contentRect.width) {
        widths.set(target, contentRect.width);
        fit(target);
      }
    }
  });
  let pending = false;
  function scan() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      document.querySelectorAll('textarea').forEach(field => {
        if (!registered.has(field)) {
          registered.add(field); field.rows = 1;
          field.addEventListener('input', () => fit(field));
          field.addEventListener('change', () => fit(field));
          resize.observe(field);
        }
        fit(field);
      });
    });
  }
  new MutationObserver(scan).observe(document.body, {subtree:true,childList:true,attributes:true,attributeFilter:['hidden','open','value','rows']});
  document.addEventListener('reset', scan);
  document.fonts.ready.then(scan);
  scan();
}
