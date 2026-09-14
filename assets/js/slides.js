/* Local, progressively enhanced slide viewer. No accounts or persistent state. */
for (const deck of document.querySelectorAll('[data-slide-deck]')) {
  const slides = [...deck.querySelectorAll('[data-slide]')];
  const previous = deck.querySelector('[data-slide-prev]');
  const next = deck.querySelector('[data-slide-next]');
  const menu = deck.querySelector('[data-slide-menu]');
  const choices = [...deck.querySelectorAll('[data-slide-choice]')];
  const fullscreen = deck.querySelector('[data-slide-fullscreen]');
  const status = deck.querySelector('[data-slide-status]');
  let index = 0;
  function show(number, updateURL = true) {
    index = Math.max(0, Math.min(slides.length - 1, number));
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    // Preload the next frame for a responsive clicker, without fetching a whole
    // image-heavy lecture just to show its title slide.
    for (const slide of slides.slice(index, index + 2)) slide.querySelector('img').loading = 'eager';
    deck.querySelector('[data-slide-current]').textContent = slides[index].querySelector('figcaption').textContent;
    choices.forEach((button, i) => { if (i === index) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current'); });
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    status.textContent = slides[index].querySelector('figcaption').textContent;
    if (updateURL) history.replaceState(null, '', `#slide-${index + 1}`);
  }
  function fromHash() {
    const match = location.hash.match(/^#slide-(\d+)$/);
    if (match) show(Number(match[1]) - 1, false);
  }
  previous.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  choices.forEach(button => button.addEventListener('click', () => { show(Number(button.dataset.slideChoice) - 1); menu.open = false; menu.querySelector('summary').focus(); }));
  document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
  menu.addEventListener('keydown', event => { if (event.key === 'Escape') { menu.open = false; menu.querySelector('summary').focus(); event.preventDefault(); } });
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await deck.requestFullscreen();
    } catch { status.textContent = 'Full screen is unavailable. You can still navigate the slides here.'; }
  }
  fullscreen.hidden = !deck.requestFullscreen || !document.fullscreenEnabled;
  fullscreen.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    fullscreen.setAttribute('aria-label', document.fullscreenElement === deck ? 'Exit full screen' : 'Full screen');
    fullscreen.title = fullscreen.getAttribute('aria-label');
    if (document.fullscreenElement === deck) deck.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => {
    if (menu.open) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
    if (event.target.closest('input, select, textarea, [contenteditable="true"], summary')) return;
    if (event.target.closest('button, a') && (event.key === ' ' || event.key === 'Enter')) return;
    const rect = deck.getBoundingClientRect();
    // Don't hijack keys while reading the transcript or another part of the page.
    if (document.fullscreenElement !== deck && (rect.bottom < 100 || rect.top > innerHeight / 2)) return;
    const actions = {
      ArrowRight: () => show(index + 1), ArrowDown: () => show(index + 1),
      PageDown: () => show(index + 1), ' ': () => show(index + (event.shiftKey ? -1 : 1)),
      ArrowLeft: () => show(index - 1), ArrowUp: () => show(index - 1), PageUp: () => show(index - 1),
      Home: () => show(0), End: () => show(slides.length - 1),
      f: toggleFullscreen, F: toggleFullscreen,
    };
    if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
  });
  window.addEventListener('hashchange', fromHash);
  let beforePrint = 0;
  window.addEventListener('beforeprint', () => { beforePrint = index; slides.forEach(slide => { slide.hidden = false; slide.querySelector('img').loading = 'eager'; }); });
  window.addEventListener('afterprint', () => show(beforePrint, false));
  deck.dataset.ready = 'true';
  deck.querySelectorAll('[data-slide-controls]').forEach(el => { el.hidden = false; });
  show(0, false); fromHash();
}
