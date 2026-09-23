import test from 'node:test';
import assert from 'node:assert/strict';
import { BOXES, FIRST_BOX, TIMES, bookDeck, counts, draw, emptyState, fileName, matches, move, normalize, readState, timeLabel } from '../../assets/js/logic/flashcards.js';

const glossary = {
  'boolean-value': { term: 'Boolean value', definition: 'One of 1 and 0.', chapter: 'boolean' },
  'valuation': { term: 'Valuation', definition: 'A function assigning a value to every variable.', chapter: 'boolean' },
  'algorithm': { term: 'Algorithm', definition: 'A step-by-step procedure.', chapter: 'formal-languages' }
};

test('answers are compared as prose, not as strings', () => {
  assert.equal(normalize('  A  VALID, inference! '), 'a valid inference');
  assert.equal(matches('One of 1 and 0', 'One of 1 and 0.'), true);
  assert.equal(matches('one of 1 and 0!!', 'One of 1 and 0.'), true);
  // An empty answer never matches, even against an empty back.
  assert.equal(matches('   ', ''), false);
  assert.equal(matches('one of 1 or 0', 'One of 1 and 0.'), false);
});

test('the book deck is the glossary, filtered to the chosen chapters', () => {
  const deck = bookDeck(glossary, ['boolean']);
  assert.deepEqual(deck.map(c => c.front), ['Boolean value', 'Valuation']);
  assert.equal(deck[0].back, 'One of 1 and 0.');
  assert.equal(bookDeck(glossary, []).length, 0);
  assert.equal(bookDeck(glossary, ['boolean', 'formal-languages']).length, 3);
});

test('a correct answer moves the card up one box, a miss sends it back to the first', () => {
  assert.equal(move(1, true), 2);
  assert.equal(move(3, true), 3);            // the last box has nowhere higher
  assert.equal(move(3, false), FIRST_BOX);
});

test('the draw favours the lower boxes and avoids an immediate repeat', () => {
  const cards = [{ key: 'a', front: 'A', box: 1 }, { key: 'b', front: 'B', box: 3 }];
  assert.equal(draw(cards, { random: () => 0 }).key, 'a');          // first ticket, heaviest card
  assert.equal(draw(cards, { random: () => 0.99 }).key, 'b');       // last ticket
  assert.equal(draw(cards, { exclude: 'book:a', random: () => 0 }).key, 'b');
  // With one card left, excluding it would leave nothing to ask.
  assert.equal(draw([cards[0]], { exclude: 'book:a', random: () => 0 }).key, 'a');
  assert.equal(draw([], {}), null);
});

test('boxes report their contents, defaulting to the first box', () => {
  const tally = counts([{ box: 1 }, { box: 1 }, { box: 3 }, {}]);
  assert.deepEqual(tally.map(b => b.count), [3, 0, 1]);
  assert.equal(tally.length, BOXES.length);
});

test('a saved file round-trips, and a foreign one is refused with a reason', () => {
  const saved = { ...emptyState(), chapters: ['boolean'], mode: 'own',
    cards: [{ key: 'valuation', front: 'Valuation', back: 'my words', own: false, box: 3, removed: false }] };
  const read = readState(JSON.stringify(saved));
  assert.deepEqual(read.cards, [{ key: 'valuation', front: 'Valuation', back: 'my words',
    chapter: undefined, own: false, removed: false, box: 3 }]);
  assert.deepEqual(read.chapters, ['boolean']);
  assert.equal(read.mode, 'own');
  // Nonsense in, a message a reader can act on out.
  assert.throws(() => readState('not json'), /not readable as JSON/);
  assert.throws(() => readState('{"kind":"other"}'), /not saved by the flashcards app/);
  assert.throws(() => readState('{"kind":"logicalmethods-flashcards","version":99}'), /newer version/);
  assert.throws(() => readState('{"kind":"logicalmethods-flashcards","version":1}'), /no cards in it/);
  // A card with an impossible box lands in the first one rather than vanishing.
  assert.equal(readState('{"kind":"logicalmethods-flashcards","version":1,"cards":[{"front":"A","box":9}]}').cards[0].box, FIRST_BOX);
});

test('the saved file is named for the day it was saved', () => {
  assert.equal(fileName(new Date('2026-09-21T23:00:00Z')), 'logic-flashcards-2026-09-21.json');
});

test('the time limit is optional, and only the offered lengths survive a file', () => {
  assert.equal(emptyState().time, 0);
  assert.deepEqual(TIMES.map(timeLabel), ['Off', '0:30', '1:00', '2:00']);
  const file = seconds => `{"kind":"logicalmethods-flashcards","version":1,"time":${seconds},"cards":[{"front":"A"}]}`;
  assert.equal(readState(file(60)).time, 60);
  assert.equal(readState(file(7)).time, 0);
});
