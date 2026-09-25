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
  let size = base;
  // Glyph rounding, tab stops and fixed spacing need not scale proportionally.
  // Measure the result of each correction, including painted text overflow.
  // Bound the work so an unscalable image can still use the scroll fallback.
  // A lecture slide is scaled as a whole; painted sizes are divided by that
  // scale so the formula is measured in the same pixels as its column.
  const scale = block.getBoundingClientRect().width / block.offsetWidth || 1;
  for (let attempt = 0; attempt < 8; attempt++) {
    const measured = Math.max(inner.scrollWidth, inner.getBoundingClientRect().width / scale);
    if (measured <= width) break;
    size *= Math.max(1, width - 1) / measured;
    inner.style.fontSize = `${size}px`;
  }
}
const refresh = () => displays.forEach(block => fit(block, true));
refresh();
if ('ResizeObserver' in window) {
  // A frame later: refitting inside the callback resizes the observed block,
  // a loop WebKit reports as an error. It happens when a hidden block is
  // first shown, as on a lecture slide.
  const observer = new ResizeObserver(entries => requestAnimationFrame(() => entries.forEach(({target}) => fit(target))));
  displays.forEach(block => observer.observe(block));
}
window.addEventListener('resize', refresh, {passive: true});
document.fonts?.ready.then(refresh);
document.fonts?.addEventListener('loadingdone', refresh);
