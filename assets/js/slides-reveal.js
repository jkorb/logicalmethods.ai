/* Reveal.js lecture decks; see docs/slides/reveal/README.md.

   Hugo has already rendered every slide, with the book's shortcodes and apps,
   and the app scripts have mounted them. This only starts Reveal.js on that
   markup and adds the navigation of the Excalidraw viewer: the toolbar, keys
   that act while the deck is in view, and a #slide-N address per slide.
   Without JavaScript the slides stay a readable sequence. */
import Reveal from 'reveal.js';

// Focus inside these belongs to the app: its arrows, Space and letters are its
// own. Page Up / Page Down, which is all a presentation clicker sends, still
// changes the slide.
const INTERACTIVE = '.logic-app, .set-figure, .tree-guide, [data-deck-interactive]';
const TYPING = 'input, select, textarea, [contenteditable="true"], summary';

// A slide is zoomed to fit its canvas, but not below this; an app may grow to
// this, so it fills the room its slide gives it.
const MIN_ZOOM = 0.4;
const MAX_APP_ZOOM = 1.5;
// An app that unfolds is not shrunk below this; the slide scrolls instead.
const UNFOLD_MIN_ZOOM = 0.6;

for (const deck of document.querySelectorAll('[data-reveal-deck]')) mount(deck);

const overflows = element => element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
const floor = zoom => Math.floor(zoom * 100) / 100;

function setFit(slide, mode, zoom) {
  if (mode) {
    slide.dataset.fit = mode;
    slide.style.setProperty('--deck-zoom', String(zoom));
  } else {
    delete slide.dataset.fit;
    slide.style.removeProperty('--deck-zoom');
  }
}

// The largest zoom in [low, high] at which the slide fits, or 0 if none does.
function largest(slide, mode, low, high) {
  setFit(slide, mode, low);
  if (overflows(slide)) return 0;
  setFit(slide, mode, high);
  if (!overflows(slide)) return high;
  for (let step = 0; step < 7; step++) {
    const middle = (low + high) / 2;
    setFit(slide, mode, middle);
    if (overflows(slide)) high = middle; else low = middle;
  }
  return low;
}

/* The best zoom for the slide's current scope, as [mode, zoom], or null if
   none fits: "reflow" keeps the full width and lets text and tables re-lay
   out, "shrink" narrows too, for a circuit whose height follows its width.
   Whichever allows the larger zoom wins, reflow on a near tie. */
function attempt(slide, ceiling) {
  const reflow = largest(slide, 'reflow', MIN_ZOOM, ceiling);
  const shrink = reflow >= ceiling - 0.01 ? 0 : largest(slide, 'shrink', MIN_ZOOM, Math.min(ceiling, 1));
  if (!reflow && !shrink) return null;
  return shrink > reflow + 0.05 ? ['shrink', floor(shrink)] : ['reflow', floor(reflow)];
}

/* Zoom rounds sizes to whole pixels, and a scrolling region inside an app can
   end up a pixel or two short of its content: a scrollbar with nothing to
   scroll. Such a region is clipped until its content really grows. */
function settle(slide) {
  for (const element of [slide, ...slide.querySelectorAll('*')]) {
    const excess = { x: element.scrollWidth - element.clientWidth, y: element.scrollHeight - element.clientHeight };
    for (const axis of ['x', 'y']) {
      const mark = `deckSnug${axis.toUpperCase()}`;
      if (element.dataset[mark] !== undefined) {
        // Clipped before: released only once the content has really grown.
        if (excess[axis] > 2) { element.style.removeProperty(`overflow-${axis}`); delete element.dataset[mark]; }
      } else if (excess[axis] > 0 && excess[axis] <= 2 && /auto|scroll/.test(getComputedStyle(element)[`overflow${axis.toUpperCase()}`])) {
        element.style.setProperty(`overflow-${axis}`, 'hidden');
        element.dataset[mark] = '';
      }
    }
  }
}

/* Fits a slide to its canvas (see slides-reveal.css). On a slide with an app
   only the apps are zoomed, so the text keeps the deck's size; if that cannot
   make it fit, because the text itself is what overflows, everything after
   the title is zoomed instead. Apps follow the browser's width and fonts, so
   this runs whenever a slide is shown, the window changes size, or fonts
   arrive. */
function fit(slide, ceiling) {
  slide.dataset.fitScope = slide.dataset.hasApp === undefined ? 'all' : 'apps';
  setFit(slide, null);
  if (ceiling <= 1 && !overflows(slide)) { settle(slide); return; }
  let best = attempt(slide, ceiling);
  if (!best && slide.dataset.fitScope === 'apps') {
    slide.dataset.fitScope = 'all';
    best = attempt(slide, 1);
  }
  if (!best) setFit(slide, 'shrink', MIN_ZOOM); // Still too tall: the slide scrolls.
  else if (best[0] === 'reflow' && best[1] === 1) setFit(slide, null);
  else setFit(slide, ...best);
  settle(slide);
}

/* An app that grows as you step through it is shrunk to fit again, but only
   the app, and not below a readable 60% (or the zoom it was shown at, if that
   was smaller already): past that, the slide scrolls, which is better than
   text too small to read. */
function refitGrowing(slide) {
  const shown = { mode: slide.dataset.fit, zoom: Number(slide.style.getPropertyValue('--deck-zoom')) || 1, scope: slide.dataset.fitScope };
  if (slide.dataset.hasApp === undefined || shown.scope !== 'apps') { settle(slide); return; }
  slide.dataset.shownZoom ??= String(shown.zoom);
  const floor = Math.max(MIN_ZOOM, Math.min(UNFOLD_MIN_ZOOM, Number(slide.dataset.shownZoom)));
  const reflow = largest(slide, 'reflow', floor, shown.zoom);
  const shrink = largest(slide, 'shrink', floor, Math.min(shown.zoom, 1));
  const best = shrink > reflow + 0.05 ? ['shrink', shrink] : reflow ? ['reflow', reflow] : null;
  if (best) setFit(slide, best[0], Math.floor(best[1] * 100) / 100);
  else setFit(slide, shown.mode || 'reflow', shown.zoom); // It scrolls from here.
  settle(slide);
}

const ceiling = slide => (slide.dataset.hasApp === undefined ? 1 : MAX_APP_ZOOM);

/* The slides as one text, for reading them in order: in the deck only the
   current slide can be read. Drawings become their descriptions and apps
   their names, and every id stays with the slide it belongs to. */
function buildText(deck, slides, titles) {
  const text = deck.parentElement.querySelector('[data-deck-text]');
  if (!text) return;
  const note = (className, content) => {
    const paragraph = document.createElement('p');
    paragraph.className = className;
    paragraph.textContent = content;
    return paragraph;
  };
  const entries = slides.map((slide, i) => {
    const section = document.createElement('section');
    const heading = document.createElement('h2');
    const link = document.createElement('a');
    heading.id = `deck-text-${i + 1}`;
    link.href = `#slide-${i + 1}`;
    link.textContent = `${i + 1}. ${titles[i]}`;
    heading.append(link);
    section.setAttribute('aria-labelledby', heading.id);
    const body = slide.querySelector('.slide__body').cloneNode(true);
    body.querySelector('h2')?.remove(); // The entry's heading replaces the slide title.
    for (const app of body.querySelectorAll('[data-logic-app]')) {
      app.replaceWith(note('deck-text__app', `Interactive app: ${app.getAttribute('aria-label') || 'see the chapter'}.`));
    }
    for (const svg of body.querySelectorAll('svg')) {
      if (!body.contains(svg)) continue; // Inside a figure already replaced.
      const label = svg.getAttribute('aria-hidden') === 'true' ? '' : svg.getAttribute('aria-label');
      const figure = svg.closest('.book-figure') || svg;
      if (label) figure.replaceWith(note('deck-text__figure', `Figure: ${label}`));
      else figure.remove();
    }
    for (const element of [body, ...body.querySelectorAll('*')]) {
      for (const name of ['id', 'for', 'aria-labelledby', 'aria-describedby', 'aria-controls', 'tabindex', 'data-prevent-swipe', 'data-fragment-index']) element.removeAttribute(name);
      if (element.getAttribute('role') === 'region') element.removeAttribute('role');
      element.classList.remove('fragment', 'visible', 'current-fragment');
    }
    section.append(heading, ...body.childNodes);
    return section;
  });
  text.querySelector('[data-deck-text-slides]').append(...entries);
  text.hidden = false;
}

async function mount(deck) {
  const root = deck.querySelector('[data-reveal-root]');
  const slides = [...root.querySelectorAll(':scope > .slides > section')];
  const previous = deck.querySelector('[data-deck-prev]');
  const next = deck.querySelector('[data-deck-next]');
  const menu = deck.querySelector('[data-deck-menu]');
  const current = deck.querySelector('[data-deck-current]');
  const fullscreen = deck.querySelector('[data-deck-fullscreen]');
  const status = deck.querySelector('[data-deck-status]');
  const titles = slides.map((slide, i) => slide.dataset.title || slide.querySelector('h2, h3')?.textContent.trim() || `Slide ${i + 1}`);
  const label = i => `${i + 1} / ${slides.length} · ${titles[i]}`;

  const choices = titles.map((title, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.deckChoice = String(i + 1);
    const number = document.createElement('span');
    number.textContent = String(i + 1);
    button.append(number, title);
    return button;
  });
  deck.querySelector('[data-deck-choices]').append(...choices);

  // Tree nodes with a step light up in that order, with the deck's Next: a
  // search order walked through node by node. Equal steps light up together.
  for (const node of root.querySelectorAll('.syntax-tree [data-step]')) {
    node.classList.add('fragment', 'custom', 'tree-step');
    node.dataset.fragmentIndex = String(Number(node.dataset.step) - 1);
  }

  // A drag on a circuit or a swipe along a text field is not a slide change.
  for (const element of root.querySelectorAll(`${INTERACTIVE}, ${TYPING}`)) element.setAttribute('data-prevent-swipe', '');
  // Fitting zooms a slide's apps where it has any; see fit().
  for (const slide of slides) if (slide.querySelector('.logic-app')) slide.dataset.hasApp = '';

  root.classList.add('reveal');
  const reveal = new Reveal(root, {
    embedded: true,
    width: 960,
    height: 540,
    margin: 0.04,
    minScale: 0.2,
    maxScale: 3,
    center: false,
    // The deck's own handler below decides when keys belong to the deck.
    keyboard: false,
    controls: false,
    progress: true,
    slideNumber: false,
    // #slide-N is written below; Reveal.js still reads it on load and on a
    // hash change, since each slide's id is slide-N.
    hash: false,
    history: false,
    respondToHashChanges: true,
    navigationMode: 'linear',
    // Reveal.js would switch a narrow deck (every phone) to a scrolling view
    // that rebuilds the slides; the deck scales instead, as on a laptop.
    scrollActivationWidth: null,
    loop: false,
    overview: false,
    help: false,
    pause: false,
    jumpToSlide: false,
    mouseWheel: false,
    previewLinks: false,
    postMessage: false,
    postMessageEvents: false,
    focusBodyOnPageVisibilityChange: false,
    // No animation, as in the Excalidraw viewer. Reveal.js would also put the
    // transition's name on the deck as a class, and Bootstrap's .fade hides it.
    transition: 'none',
    backgroundTransition: 'none',
  });
  await reveal.initialize();
  // role="application" would switch a screen reader out of reading mode for
  // the whole deck, text slides included; the apps carry their own roles.
  root.removeAttribute('role');
  buildText(deck, slides, titles);

  const fitCurrent = () => { const slide = reveal.getCurrentSlide(); if (slide) fit(slide, ceiling(slide)); };
  let pending = 0;
  const refit = () => { cancelAnimationFrame(pending); pending = requestAnimationFrame(fitCurrent); };
  window.addEventListener('resize', refit);
  document.fonts?.ready.then(refit);
  // An app that grows while you step through it is shrunk to fit again, but
  // never grown back mid-demonstration.
  // The work waits for the next frame: resizing what is observed inside the
  // callback is a ResizeObserver loop, which WebKit reports as an error.
  let growing = 0;
  const apps = new ResizeObserver(entries => {
    const slide = reveal.getCurrentSlide();
    if (!slide || !entries.some(entry => slide.contains(entry.target))) return;
    cancelAnimationFrame(growing);
    growing = requestAnimationFrame(() => {
      if (overflows(slide)) refitGrowing(slide);
      else settle(slide);
    });
  });
  // Display formulas are refitted by display-math.js a frame after they
  // appear, which can leave a rounding pixel to clip again.
  for (const element of root.querySelectorAll('.logic-app, .math-display > *')) apps.observe(element);

  const index = () => reveal.getIndices().h;
  function update(writeURL) {
    const i = index();
    current.textContent = label(i);
    choices.forEach((button, n) => { if (n === i) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current'); });
    const fragments = reveal.availableFragments();
    previous.disabled = reveal.isFirstSlide() && !fragments.prev;
    next.disabled = reveal.isLastSlide() && !fragments.next;
    if (writeURL) history.replaceState(null, '', `#slide-${i + 1}`);
  }
  reveal.on('slidechanged', event => {
    delete event.currentSlide.dataset.shownZoom;
    fit(event.currentSlide, ceiling(event.currentSlide));
    update(true);
  });
  reveal.on('fragmentshown', () => update(false));
  reveal.on('fragmenthidden', () => update(false));

  previous.addEventListener('click', () => reveal.prev());
  next.addEventListener('click', () => reveal.next());
  choices.forEach((button, i) => button.addEventListener('click', () => {
    reveal.slide(i);
    menu.open = false;
    menu.querySelector('summary').focus();
  }));
  document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape') { menu.open = false; menu.querySelector('summary').focus(); event.preventDefault(); }
  });

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await deck.requestFullscreen();
    } catch { status.textContent = 'Full screen is unavailable. You can still navigate the slides here.'; }
  }
  fullscreen.hidden = !deck.requestFullscreen || !document.fullscreenEnabled;
  fullscreen.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    const on = document.fullscreenElement === deck;
    fullscreen.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen');
    fullscreen.title = on ? 'Exit full screen (F)' : 'Full screen (F)';
    if (on) deck.focus({ preventScroll: true });
    refit();
  });
  // Reveal.js only follows window resizes; the stage also changes size when
  // the deck enters full screen or the page reflows.
  new ResizeObserver(() => reveal.layout()).observe(root);

  document.addEventListener('keydown', event => {
    if (menu.open) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
    if (event.target.closest(TYPING)) return;
    if (event.target.closest('button, a') && (event.key === ' ' || event.key === 'Enter')) return;
    if (event.target.closest(INTERACTIVE) && event.key !== 'PageUp' && event.key !== 'PageDown') return;
    const rect = deck.getBoundingClientRect();
    // Don't take keys while someone reads the key points or another part of the page.
    if (document.fullscreenElement !== deck && (rect.bottom < 100 || rect.top > innerHeight / 2)) return;
    const actions = {
      ArrowRight: () => reveal.next(), ArrowDown: () => reveal.next(), PageDown: () => reveal.next(),
      ArrowLeft: () => reveal.prev(), ArrowUp: () => reveal.prev(), PageUp: () => reveal.prev(),
      ' ': () => (event.shiftKey ? reveal.prev() : reveal.next()),
      Home: () => reveal.slide(0), End: () => reveal.slide(slides.length - 1),
      f: toggleFullscreen, F: toggleFullscreen,
    };
    if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
  });

  fitCurrent();
  update(false);
  deck.querySelectorAll('[data-deck-controls]').forEach(element => { element.hidden = false; });
  deck.dataset.deckReady = 'true';
  reveal.layout();
}
