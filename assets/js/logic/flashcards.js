// Flashcard state and scoring, kept free of the DOM so the rules can be tested
// directly. The app layer owns rendering, storage and file handling.
export const FILE_KIND = 'logicalmethods-flashcards';
export const FILE_VERSION = 1;

// Leitner boxes: a card answered correctly moves one box up, a missed card goes
// back to the first. Lower boxes come round more often.
export const BOXES = [
  { id: 1, label: 'Keep practising', weight: 6 },
  { id: 2, label: 'Getting there', weight: 3 },
  { id: 3, label: 'Known', weight: 1 }
];

// An optional time limit per card, in seconds. Off by default: a card you have
// to think about is not a card you got wrong.
export const TIMES = [0, 30, 60, 120];
export const timeLabel = seconds =>
  seconds ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` : 'Off';
export const FIRST_BOX = BOXES[0].id;
export const LAST_BOX = BOXES.at(-1).id;

// Answers are compared as prose: case, accents, punctuation and runs of space
// carry no meaning here.
export function normalize(text) {
  return String(text ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
export function matches(answer, expected) {
  const a = normalize(answer);
  return a.length > 0 && a === normalize(expected);
}

export function cardKey(card) { return card.own ? `own:${card.front}` : `book:${card.key}`; }

// The book deck is the glossary, filtered to the chapters the reader picked.
export function bookDeck(entries, chapters) {
  const wanted = new Set(chapters);
  return Object.entries(entries)
    .filter(([, entry]) => wanted.has(entry.chapter))
    .map(([key, entry]) => ({ key, front: entry.term, back: entry.definition, chapter: entry.chapter, own: false }))
    .sort((a, b) => a.front.localeCompare(b.front));
}

export function move(box, correct) {
  return correct ? Math.min(LAST_BOX, box + 1) : FIRST_BOX;
}

// Weighted draw, avoiding an immediate repeat while another card is available.
export function draw(cards, { exclude, random = Math.random } = {}) {
  const pool = cards.length > 1 && exclude ? cards.filter(c => cardKey(c) !== exclude) : cards;
  if (!pool.length) return null;
  const weight = card => BOXES.find(b => b.id === (card.box ?? FIRST_BOX))?.weight ?? 1;
  const total = pool.reduce((sum, card) => sum + weight(card), 0);
  let ticket = random() * total;
  for (const card of pool) { ticket -= weight(card); if (ticket < 0) return card; }
  return pool.at(-1);
}

export function counts(cards) {
  return BOXES.map(box => ({ ...box, count: cards.filter(c => (c.box ?? FIRST_BOX) === box.id).length }));
}

export function emptyState() {
  return { kind: FILE_KIND, version: FILE_VERSION, chapters: [], mode: 'book', time: 0, cards: [] };
}

export function fileName(date = new Date()) {
  return `logic-flashcards-${date.toISOString().slice(0, 10)}.json`;
}

// An uploaded file is someone's saved work: say plainly what is wrong with it
// rather than starting them over on a silent reset.
export function readState(text) {
  let data;
  try { data = JSON.parse(text); }
  catch { throw new Error('That file is not readable as JSON. Upload the file this app saved.'); }
  if (!data || data.kind !== FILE_KIND) throw new Error('That file was not saved by the flashcards app.');
  if (data.version > FILE_VERSION) throw new Error('That file was saved by a newer version of the app.');
  if (!Array.isArray(data.cards)) throw new Error('That file has no cards in it.');
  const cards = data.cards.filter(c => c && typeof c.front === 'string' && c.front.trim()).map(card => ({
    key: typeof card.key === 'string' ? card.key : undefined,
    front: card.front.trim(),
    back: typeof card.back === 'string' ? card.back : '',
    chapter: typeof card.chapter === 'string' ? card.chapter : undefined,
    own: Boolean(card.own),
    removed: Boolean(card.removed),
    box: BOXES.some(b => b.id === card.box) ? card.box : FIRST_BOX
  }));
  return {
    kind: FILE_KIND, version: FILE_VERSION,
    chapters: Array.isArray(data.chapters) ? data.chapters.filter(c => typeof c === 'string') : [],
    mode: data.mode === 'own' ? 'own' : 'book',
    time: TIMES.includes(data.time) ? data.time : 0,
    cards
  };
}
