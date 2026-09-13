/* A timed drill: the box shows a piece of notation, you type the LaTeX that
   produces it. Anything the site's own replacement rules accept counts, so the
   drill can never ask for a command the book's inputs would reject. */
import { latexToUnicode } from './latex-input.js';
import { POOLS } from './latex-game-prompts.js';
export { POOLS };

const ROUND = 60;    // seconds
const TARGET = 10;   // the score the exercise asks for
const CONFETTI = ['--red-gfx', '--blue-gfx', '--green-gfx', '--orange-gfx'];
const HINTS = {
  easy: 'Easy: one symbol, one command.',
  medium: 'Medium: expressions built out of them, and the text commands.',
  hard: 'Hard: both at once, plus the awkward ones.'
};

// Storage is unavailable in some private windows; a lost best score is fine.
const readBest = key => { try { return Number(localStorage.getItem(key)) || 0; } catch { return 0; } };
const writeBest = (key, value) => { try { localStorage.setItem(key, value); } catch { /* no store */ } };
const clock = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

// What the box reads as, without the markup that styles it.
export const plain = show => show.replace(/<[^>]+>/g, '');
// LaTeX is free about spacing around commands, so marking is too.
const squash = text => text.replace(/\s+/g, '');

/* Two ways to be right: the literal command, or anything the site's converter
   turns into the same notation — \lor and \vee alike. Reproducing the prompt
   itself is not typing a command. */
export function accepts(answer, item) {
  const [show, answers] = item;
  const typed = squash(answer);
  const target = squash(plain(show));
  if (!typed || typed === target) return false;
  return answers.some(command => squash(command) === typed) ||
         squash(latexToUnicode(answer)) === target;
}

export function mountLatexGame(root) {
  const find = selector => root.querySelector(selector);
  const stage = find('.latex-game__stage');
  const symbolBox = find('[data-game-symbol]');
  const input = find('[data-game-answer]');
  const form = find('.latex-game__form');
  const startButton = find('[data-game-start]');
  const startIcon = find('[data-icon="start"]');
  const againIcon = find('[data-icon="again"]');
  const skipButton = find('[data-game-skip]');
  const endButton = find('[data-game-end]');
  const timeOut = find('[data-game-time]');
  const scoreOut = find('[data-game-score]');
  const bestOut = find('[data-game-best]');
  const status = find('[role="status"]');
  const levels = [...root.querySelectorAll('[data-game-level]')];

  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const level = () => levels.find(radio => radio.checked).value;
  const bestKey = () => `lm-latex-drill-${level()}`;
  const say = message => { status.textContent = message; };
  const showBest = () => { bestOut.textContent = readBest(bestKey()); };
  function idle(label) {
    startButton.disabled = false;
    startButton.setAttribute('aria-label', label);
    startButton.title = `${label} (Enter)`;
    startIcon.hidden = label !== 'Start';
    againIcon.hidden = !startIcon.hidden;
    input.placeholder = `Press Enter to ${label === 'Start' ? 'start' : 'replay'}`;
  }

  let current = null;
  let score = 0;
  let deadline = 0;
  let ticker = null;
  let feedbackTimer = null;

  function ask() {
    const pool = POOLS[level()];
    let pick = pool[Math.floor(Math.random() * pool.length)];
    while (pool.length > 1 && pick === current) pick = pool[Math.floor(Math.random() * pool.length)];
    current = pick;
    // one wrapper, because the centring box is a grid: without it a <sup> or
    // <em> becomes a grid item of its own and stacks instead of flowing
    symbolBox.innerHTML = `<span>${current[0]}</span>`;   // module constants, never user input
    const width = plain(current[0]).length;
    symbolBox.dataset.size = width <= 2 ? 'one' : width <= 9 ? 'few' : 'many';
    symbolBox.setAttribute('aria-label', `Type the LaTeX for: ${current[2]}`);
    input.value = '';
    input.focus();
  }

  function feedback(state) {
    clearTimeout(feedbackTimer);
    stage.dataset.feedback = state;
    feedbackTimer = setTimeout(() => { delete stage.dataset.feedback; }, 450);
  }
  function celebrate() {
    feedback('right');
    if (reduced()) return;
    const burst = document.createElement('div');
    burst.className = 'latex-game__confetti';
    burst.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 18; i++) {
      const bit = document.createElement('i');
      bit.style.setProperty('--x', `${((Math.random() * 2 - 1) * 110).toFixed(0)}px`);
      bit.style.setProperty('--y', `${(-40 - Math.random() * 110).toFixed(0)}px`);
      bit.style.setProperty('--spin', `${((Math.random() * 2 - 1) * 540).toFixed(0)}deg`);
      bit.style.setProperty('--delay', `${(Math.random() * 90).toFixed(0)}ms`);
      bit.style.setProperty('--confetti', `var(${CONFETTI[i % CONFETTI.length]})`);
      burst.append(bit);
    }
    stage.append(burst);
    setTimeout(() => burst.remove(), 1200);
  }

  function tick() {
    const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    timeOut.textContent = clock(left);
    timeOut.classList.toggle('is-low', left <= 10);
    if (left === 0) stop('Time');
  }

  function start() {
    score = 0;
    scoreOut.textContent = '0';
    deadline = Date.now() + ROUND * 1000;
    for (const radio of levels) radio.disabled = true;
    input.disabled = skipButton.disabled = endButton.disabled = false;
    startButton.disabled = true;
    input.placeholder = '';
    say('Go. Type the LaTeX and press Enter.');
    ask();
    tick();
    ticker = setInterval(tick, 200);
  }

  function stop(reason) {
    clearInterval(ticker);
    ticker = null;
    current = null;
    for (const radio of levels) radio.disabled = false;
    skipButton.disabled = endButton.disabled = true;
    input.value = '';
    idle('Play again');
    symbolBox.innerHTML = '<span>?</span>';
    symbolBox.dataset.size = 'one';
    symbolBox.setAttribute('aria-label', 'No prompt: the round is over');
    writeBest(bestKey(), Math.max(score, readBest(bestKey())));
    showBest();
    say(`${reason}. Final score ${score}. ` +
        (score >= TARGET ? `That clears the target of ${TARGET}.` : `The exercise asks for ${TARGET}.`));
    input.focus();   // Enter from here plays again
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!current) { start(); return; }   // the field is the start button too
    if (accepts(input.value, current)) {
      score += 1;
      scoreOut.textContent = score;
      celebrate();
      say(`Correct: ${current[1][0]}. Score ${score}.`);
      ask();
    } else {
      feedback('wrong');
      say('That is not the LaTeX for this one. Try again.');
      input.select();
    }
  });
  // No reveal: the same prompt comes round again, and the point is to learn it.
  const skip = () => { if (current) { say('Skipped. No point for that one.'); ask(); } };
  const end = () => { if (current) stop('Round ended'); };
  skipButton.addEventListener('click', skip);
  endButton.addEventListener('click', end);
  startButton.addEventListener('click', () => { if (!current) start(); });

  /* Shortcuts sit next to the keys already in use: Enter answers, so a modified
     Enter skips, and Escape leaves. Tab is left alone — it is how a keyboard
     user gets out of the field, and taking it would trap them here. */
  root.addEventListener('keydown', event => {
    if (event.key === 'Enter' && (event.shiftKey || event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      skip();
    } else if (event.key === 'Escape' && current) {
      event.preventDefault();
      end();
    }
  });
  for (const radio of levels) radio.addEventListener('change', () => { showBest(); say(HINTS[level()]); });

  input.disabled = false;
  for (const radio of levels) radio.disabled = false;
  idle('Start');
  timeOut.textContent = clock(ROUND);
  showBest();
  root.querySelector('[data-app-fallback]')?.remove();
}
