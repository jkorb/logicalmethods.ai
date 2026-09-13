// Fit formal displays to their actual column. Source-code blocks are excluded.
const displays = [...document.querySelectorAll('.math-display, .set-figure')];
const previous = new WeakMap();
function fit(block, force = false) {
  const inner = block.firstElementChild;
  const width = block.clientWidth;
  if (!inner || !width) return; // An exercise solution may still be hidden.
  const base = parseFloat(getComputedStyle(block).fontSize);
  const last = previous.get(block);
  if (!force && last?.width === width && last?.base === base) return;
  previous.set(block, { width, base });
  inner.style.fontSize = `${base}px`;
  const naturalWidth = inner.getBoundingClientRect().width;
  if (naturalWidth > width) inner.style.fontSize = `${base * (width - 1) / naturalWidth}px`;
}
const refresh = () => displays.forEach(block => fit(block, true));
refresh();
if ('ResizeObserver' in window) {
  const observer = new ResizeObserver(entries => entries.forEach(({target}) => fit(target)));
  displays.forEach(block => observer.observe(block));
}
window.addEventListener('resize', refresh, {passive: true});
document.fonts?.ready.then(refresh);
document.fonts?.addEventListener('loadingdone', refresh);
