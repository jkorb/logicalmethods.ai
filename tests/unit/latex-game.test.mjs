import { test } from 'node:test';
import assert from 'node:assert/strict';
import { POOLS, accepts, plain } from '../../assets/js/apps/latex-game.js';
import { latexMap, latexToUnicode } from '../../assets/js/apps/latex-input.js';

const every = () => Object.entries(POOLS).flatMap(([level, pool]) => pool.map(item => [level, item]));

/* The drill must never ask for something the site's own input rules cannot
   produce, so the answer key is checked against those rules directly. */
test('every prompt is answered by each of its own commands', () => {
  for (const [level, item] of every()) {
    const [show, answers, name] = item;
    assert.ok(answers.length, `${level}: ${show} has no answer`);
    for (const command of answers) {
      assert.ok(accepts(command, item), `${level}: ${command} is not accepted for ${show}`);
    }
    assert.match(name, /\S/, `${level}: ${show} has no name for screen readers`);
  }
});

test('prompts show only the markup the box styles, and repeat no prompt', () => {
  for (const [level, item] of every()) {
    for (const tag of item[0].match(/<\/?(\w+)/g) ?? []) {
      assert.match(tag, /^<\/?(em|strong|code|span|sup|sub)$/, `${level}: ${item[0]} uses ${tag}`);
    }
  }
  for (const [level, pool] of Object.entries(POOLS)) {
    assert.equal(new Set(pool.map(([show]) => show)).size, pool.length, `${level} repeats a prompt`);
  }
});

/* "All single commands are fair game in easy mode": easy has to keep up with
   the converter, not with whoever last edited this list. */
test('easy covers every symbol the converter produces', () => {
  const easy = new Set(POOLS.easy.map(([show]) => show));
  for (const symbol of new Set(Object.values(latexMap))) {
    if (/[₀-₉ₙ]/.test(symbol)) continue;   // drilled as p₁, pₙ — never on their own
    assert.ok(easy.has(symbol), `easy is missing ${symbol}`);
  }
  assert.ok(easy.has('⊭'), 'easy is missing ⊭, which \\not\\models produces');
  assert.equal(POOLS.hard.length > POOLS.easy.length + POOLS.medium.length, true, 'hard adds nothing');
});

/* What matters is not the size of a pool but how often a round repeats itself.
   Easy is the smallest by some way, because it is capped by the cheat sheet and
   padding it out would mean drilling symbols the book never uses — so the bar
   is stated as the thing actually wanted. */
test('a round does not keep asking the same thing', () => {
  const ANSWERS = 12;   // a good minute, at one answer every five seconds
  for (const [level, pool] of Object.entries(POOLS)) {
    const distinct = pool.length * (1 - ((pool.length - 1) / pool.length) ** ANSWERS);
    assert.ok(distinct >= ANSWERS - 2,
      `${level}: only ${distinct.toFixed(1)} distinct prompts in a ${ANSWERS}-answer round`);
  }
});

test('marking is alias-tolerant, space-tolerant, and refuses the prompt itself', () => {
  const conjunction = ['∧', ['\\land'], 'conjunction'];
  for (const answer of ['\\land', '\\wedge', '\\and', '  \\land  ']) assert.ok(accepts(answer, conjunction), answer);
  for (const answer of ['∧', '', '   ', '\\lor', 'land']) assert.ok(!accepts(answer, conjunction), answer);

  const entails = ['A ⊨ B', ['A \\models B'], 'A double turnstile B'];
  for (const answer of ['A \\models B', 'A\\models B', 'A \\models  B']) assert.ok(accepts(answer, entails), answer);
  for (const answer of ['A ⊨ B', 'A \\vdash B']) assert.ok(!accepts(answer, entails), answer);

  // commands the converter knows nothing about are matched literally
  const italics = ['<em>cursive</em>', ['\\emph{cursive}', '\\textit{cursive}'], 'cursive, in italics'];
  assert.ok(accepts('\\textit{cursive}', italics) && accepts('\\emph{cursive}', italics));
  for (const answer of ['cursive', '\\emph{italic}']) assert.ok(!accepts(answer, italics), answer);
});

test('plain text strips the styling the box adds', () => {
  assert.equal(plain('x<sup>2</sup>'), 'x2');
  assert.equal(plain('<code>code</code>'), 'code');
  assert.equal(plain('∀'), '∀');
  assert.equal(latexToUnicode('\\not\\models'), '⊭');   // the one command outside latexMap
});
