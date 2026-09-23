import { BOXES, FIRST_BOX, FILE_KIND, FILE_VERSION, TIMES, bookDeck, cardKey, counts, draw, emptyState, fileName, matches, move, readState, timeLabel } from '../logic/flashcards.js';
import { el } from './boolean-ui.js';
const STORE = 'lm-flashcards-v1';
const TITLES = { menu: 'Flashcards', settings: 'Settings', boxes: 'Card boxes' };

export function mountFlashcards(root) {
  const glossary = JSON.parse(root.querySelector('[data-glossary]').textContent);
  const chapters = JSON.parse(root.querySelector('[data-chapters]').textContent);
  const open = chapters.filter(c => !c.locked).map(c => c.id);
  const $ = name => root.querySelector(`[data-${name}]`);
  const status = $('status');
  const frame = $('frame');
  let state = load(), screen = 'menu', phase = 'idle', current = null, lastKey = null, ticking = null;

  function load() {
    try {
      const saved = localStorage.getItem(STORE);
      if (saved) return readState(saved);
    } catch { /* A private window or cleared storage is normal, not an error. */ }
    return emptyState();
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); }
    catch { announce('This browser will not store the cards. Save them to a file before you leave.'); }
  }
  function announce(message) { status.textContent = message; }

  // A card's stored half: the box it sits in, and the definition the reader wrote.
  const savedFor = key => state.cards.find(c => !c.own && c.key === key);
  function deck() {
    const book = bookDeck(glossary, state.chapters).map(card => {
      const saved = savedFor(card.key);
      return { ...card, box: saved?.box ?? FIRST_BOX, removed: Boolean(saved?.removed),
               back: state.mode === 'own' ? (saved?.back ?? '') : card.back };
    });
    return [...book, ...state.cards.filter(c => c.own)].filter(c => !c.removed);
  }
  const written = () => deck().filter(c => c.back.trim());
  const unwritten = () => deck().filter(c => !c.back.trim());

  function update(card, changes) {
    const existing = card.own ? state.cards.find(c => c.own && c.front === card.front) : savedFor(card.key);
    if (existing) Object.assign(existing, changes);
    else state.cards.push({ key: card.key, front: card.front, chapter: card.chapter, own: card.own,
                            back: card.own ? card.back : '', box: FIRST_BOX, ...changes });
    save();
  }

  function show(name) {
    screen = name;
    for (const panel of root.querySelectorAll('[data-screen]')) panel.hidden = panel.dataset.screen !== name;
    $('screen-title').textContent = name === 'study'
      ? (phase === 'writing' ? 'Writing cards' : 'Round')
      : TITLES[name];
    $('back').hidden = name === 'menu';
    if (name === 'boxes') renderBoxes();
    if (name === 'settings') renderChapters();
    if (name === 'menu') { $('new').hidden = true; renderMenu(); }
  }

  function renderChapters() {
    for (const box of root.querySelectorAll('[data-chapter]')) box.checked = state.chapters.includes(box.value);
    $('all').checked = open.length > 0 && open.every(id => state.chapters.includes(id));
    for (const radio of root.querySelectorAll('[data-mode]')) radio.checked = radio.value === state.mode;
    $('time').value = String(state.time);
  }
  function renderBoxes() {
    const tally = counts(written());
    for (const box of tally) root.querySelector(`[data-box-count="${box.id}"]`).textContent = String(box.count);
  }
  function renderMenu() {
    const ready = written().length, missing = unwritten().length, picked = state.chapters.length;
    $('deck-line').textContent = picked === 0 && !state.cards.some(c => c.own)
      ? 'No chapters chosen yet'
      : `${ready} card${ready === 1 ? '' : 's'}` +
        (picked ? ` from ${picked} chapter${picked === 1 ? '' : 's'}` : '') +
        (state.mode === 'own' && missing ? `, ${missing} still to write` : '');
    $('start').disabled = ready === 0;
    $('write').hidden = !(state.mode === 'own' && missing > 0);
  }
  const renderAll = () => { renderMenu(); renderBoxes(); if (screen === 'settings') renderChapters(); };

  const chapterLabel = id => {
    const chapter = chapters.find(c => c.id === id);
    return chapter ? `Chapter ${chapter.n}. ${chapter.title}` : '';
  };
  function showCard(card, mode) {
    current = card; phase = mode;
    $('front').textContent = card.front;
    $('card-chapter').textContent = card.own ? 'My own card' : chapterLabel(card.chapter);
    $('verdict').hidden = true;
    $('answer-input').value = mode === 'writing' ? card.back : '';
    $('answer-label').textContent = mode === 'writing'
      ? 'Write the definition in your own words'
      : 'Write the definition from memory';
    $('check').hidden = mode === 'writing';
    $('save').hidden = mode !== 'writing';
    show('study');
    $('answer-input').focus();
    mode === 'asking' ? startClock() : stopClock();
  }

  function nextWriting() {
    const pending = unwritten();
    if (!pending.length) { stop(); announce('Every card has a definition now.'); return; }
    showCard(pending[0], 'writing');
    announce(`${pending.length} card${pending.length === 1 ? '' : 's'} left to write. Look the concept up if you need to.`);
  }
  function nextCard() {
    const card = draw(written(), { exclude: lastKey });
    if (!card) { stop(); announce('There are no cards in this deck yet.'); return; }
    lastKey = cardKey(card);
    showCard(card, 'asking');
  }
  function stop() { phase = 'idle'; current = null; stopClock(); show('menu'); }

  function fileInto(card, box) {
    update(card, { box });
    announce(`Filed under “${BOXES.find(b => b.id === box).label}”.`);
    renderBoxes(); nextCard();
  }
  function stopClock() { clearInterval(ticking); ticking = null; $('clock').hidden = true; }
  function startClock() {
    stopClock();
    if (!state.time) return;
    const clock = $('clock');
    let left = state.time;
    const paint = () => { clock.textContent = timeLabel(left); clock.dataset.low = String(left <= 5); };
    clock.hidden = false; paint();
    ticking = setInterval(() => {
      left -= 1;
      if (left > 0) { paint(); return; }
      stopClock();
      checkAnswer({ timedOut: true });
    }, 1000);
  }

  function checkAnswer({ timedOut = false } = {}) {
    const answer = $('answer-input').value;
    if (!answer.trim() && !timedOut) { announce('Write what you remember first.'); return; }
    stopClock();
    const same = matches(answer, current.back);
    phase = 'answered';
    $('match').textContent = same ? 'Your wording matches ours.' : 'Your wording differs from ours.';
    $('match').dataset.same = String(same);
    $('back-text').textContent = current.back;
    $('verdict').hidden = false;
    const suggested = move(current.box ?? FIRST_BOX, same);
    $('filing').replaceChildren(...BOXES.map(box => {
      const button = el('button', { type: 'button', 'data-box': String(box.id) }, box.label);
      if (box.id === suggested) button.dataset.suggested = 'true';
      button.addEventListener('click', () => fileInto(current, box.id));
      return button;
    }));
    $('filing').querySelector('[data-suggested]')?.focus();
    if (timedOut) announce('Time up. The back of the card is below.');
  }

  $('back').addEventListener('click', () => { phase = 'idle'; current = null; stopClock(); show('menu'); });
  root.querySelectorAll('[data-go]').forEach(button =>
    button.addEventListener('click', () => show(button.dataset.go)));
  $('start').addEventListener('click', () => { announce('Write the definition, then check.'); nextCard(); });
  $('write').addEventListener('click', nextWriting);

  root.querySelectorAll('[data-chapter]').forEach(box => box.addEventListener('change', () => {
    state.chapters = [...root.querySelectorAll('[data-chapter]')].filter(b => b.checked).map(b => b.value);
    save(); renderChapters(); renderMenu();
  }));
  $('all').addEventListener('change', e => {
    state.chapters = e.target.checked ? [...open] : [];
    save(); renderChapters(); renderMenu();
  });
  root.querySelectorAll('[data-mode]').forEach(radio => radio.addEventListener('change', () => {
    state.mode = radio.value; save(); renderMenu();
  }));
  $('time').addEventListener('change', e => {
    const seconds = Number(e.target.value);
    state.time = TIMES.includes(seconds) ? seconds : 0;
    save();
  });

  $('answer').addEventListener('submit', e => { e.preventDefault(); if (phase === 'asking') checkAnswer(); });
  $('save').addEventListener('click', () => {
    const back = $('answer-input').value.trim();
    if (!back) { announce('Write a definition, or skip this card for now.'); return; }
    update(current, { back });
    renderAll(); nextWriting();
  });
  $('skip').addEventListener('click', () => {
    if (phase !== 'writing') { nextCard(); return; }
    const rest = unwritten().filter(c => cardKey(c) !== cardKey(current));
    rest.length ? showCard(rest[0], 'writing') : stop();
  });
  $('remove').addEventListener('click', () => {
    update(current, { removed: true });
    announce(`“${current.front}” is out of the deck. Loading a saved file brings it back.`);
    renderAll();
    phase === 'writing' ? nextWriting() : nextCard();
  });

  $('new-open').addEventListener('click', () => { $('new').hidden = false; $('new-input').focus(); });
  $('new-cancel').addEventListener('click', () => { $('new').hidden = true; });
  $('new').addEventListener('submit', e => {
    e.preventDefault();
    const front = $('new-input').value.trim();
    if (!front) return;
    if (state.cards.some(c => c.own && c.front === front)) { announce('You already have a card for that concept.'); return; }
    state.cards.push({ front, back: '', own: true, box: FIRST_BOX, removed: false });
    save(); $('new-input').value = ''; $('new').hidden = true;
    renderAll(); showCard(deck().find(c => c.own && c.front === front), 'writing');
    announce(`Added “${front}”. Write its definition.`);
  });

  $('export').addEventListener('click', () => {
    const file = new Blob([JSON.stringify({ ...state, kind: FILE_KIND, version: FILE_VERSION, saved: new Date().toISOString().slice(0, 10) }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = el('a', { href: url, download: fileName() });
    document.body.append(link); link.click(); link.remove();
    URL.revokeObjectURL(url);
    announce(`Saved as ${fileName()}.`);
  });
  $('import').addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      state = readState(await file.text());
      save(); renderChapters(); renderAll();
      announce(`Loaded ${state.cards.length} saved card${state.cards.length === 1 ? '' : 's'}.`);
    } catch (error) { announce(error.message); }
    e.target.value = '';
  });
  $('clear').addEventListener('click', () => {
    state = emptyState(); save(); renderChapters(); renderAll();
    announce('Cleared. Nothing is left in this browser.');
  });

  const fullscreen = $('fullscreen');
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === frame) await document.exitFullscreen();
      else await frame.requestFullscreen();
    } catch { announce('This browser would not go full screen.'); }
  }
  fullscreen.hidden = !frame.requestFullscreen || !document.fullscreenEnabled;
  fullscreen.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    const on = document.fullscreenElement === frame;
    fullscreen.textContent = on ? 'Leave full screen' : 'Full screen';
    fullscreen.setAttribute('aria-label', fullscreen.textContent);
    fullscreen.title = `${fullscreen.textContent} (F)`;
    if (on) frame.focus({ preventScroll: true });
  });
  // F toggles, as it does in the slide viewer — but never while someone is
  // typing a definition, and never when the app is off screen.
  document.addEventListener('keydown', event => {
    if (event.key !== 'f' && event.key !== 'F') return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
    if (event.target.closest('input, select, textarea, [contenteditable="true"], summary')) return;
    const rect = frame.getBoundingClientRect();
    if (document.fullscreenElement !== frame && (rect.bottom < 100 || rect.top > innerHeight / 2)) return;
    event.preventDefault();
    toggleFullscreen();
  });

  // Locked chapters have no released glossary to study, and stay disabled.
  for (const control of root.querySelectorAll('button, input, textarea, select')) control.disabled = control.hasAttribute('data-locked');
  show('menu');
  announce('Open the settings to choose your chapters.');
}
