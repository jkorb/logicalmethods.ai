const LABELS = { deductive: 'Deductive guarantee', inductive: 'Inductive support', unsupported: 'Insufficient support' };
export function mountReasoningPractice(root) {
  const cases = JSON.parse(root.querySelector('[data-cases]').textContent);
  let index = 0;
  const answers = new Map();
  const status = root.querySelector('[role="status"]');
  const buttons = [...root.querySelectorAll('[data-choice]')];
  const next = root.querySelector('[data-next]'), previous = root.querySelector('[data-previous]');
  const restart = root.querySelector('[data-restart]');
  const show = () => {
    const item = cases[index], answer = answers.get(index);
    root.querySelector('[data-count]').textContent = `Case ${index + 1} of ${cases.length}`;
    const correct = [...answers].filter(([i, choice]) => choice === cases[i].category).length;
    root.querySelector('[data-score]').textContent = answers.size ? `${correct} of ${answers.size} first answers correct` : 'No answers yet';
    root.querySelector('[data-title]').textContent = item.title;
    root.querySelector('[data-premises]').replaceChildren(...item.premises.map(text => {
      const li = document.createElement('li'); li.textContent = text; return li;
    }));
    root.querySelector('[data-conclusion]').textContent = item.conclusion;
    for (const button of buttons) {
      button.disabled = Boolean(answer);
      button.setAttribute('aria-pressed', String(answer === button.dataset.choice));
      button.dataset.correct = String(Boolean(answer) && button.dataset.choice === item.category);
    }
    if (answer) {
      const correct = answer === item.category;
      status.textContent = `${correct ? 'Correct' : 'Best assessment'}: ${LABELS[item.category]}. ${item.explanation}`;
      status.dataset.state = correct ? 'success' : 'error';
    } else {
      status.textContent = 'Choose an assessment, then compare the explanation with your own reasons.';
      delete status.dataset.state;
    }
    previous.disabled = index === 0;
    next.disabled = false;
    next.textContent = index === cases.length - 1 ? 'Review cases' : 'Next case';
    restart.hidden = answers.size !== cases.length;
  };
  root.querySelector('[data-interactive]').hidden = false;
  buttons.forEach(button => button.addEventListener('click', () => {
    if (answers.has(index)) return;
    answers.set(index, button.dataset.choice); show();
    next.focus();
  }));
  previous.addEventListener('click', () => { if(index > 0) { index--; show(); root.querySelector('[data-title]').focus(); } });
  next.addEventListener('click', () => { index = (index + 1) % cases.length; show(); root.querySelector('[data-title]').focus(); });
  restart.addEventListener('click', () => { answers.clear(); index = 0; show(); buttons[0].focus(); });
  show();
}
