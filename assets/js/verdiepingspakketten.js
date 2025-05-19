let currentQuestion = 0;
const totalQuestions = () =>
  document.getElementsByClassName('question').length;
const answers = {};

window.addEventListener('load', () => {
  document.querySelectorAll('input').forEach(input => {
    if (input.type === 'checkbox' || input.type === 'radio') input.checked = false;
    if (input.type === 'text') input.value = '';
  });
  for (let k in answers) delete answers[k];
});

function renderProgress() {
  const container = document.getElementById('progress');
  container.innerHTML = '';

  for (let i = 0; i < totalQuestions(); i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = i + 1;
    btn.classList.add('btn-nav');

    const qKey = `question-${i}`;
    if      (i === currentQuestion)              btn.classList.add('active');
      else if (answers.hasOwnProperty(qKey))       btn.classList.add('completed');
        else                                         btn.classList.add('upcoming');

    btn.addEventListener('click', () => goToQuestion(i));
    container.appendChild(btn);
  }
}

function startTest() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('test').style.display    = 'block';
  document.getElementById('nav-buttons').style.display = 'block';
  showQuestion(0);
  renderProgress();
}

function resetTest() {
  window.location.reload();
}

function submitTest() {
  saveAnswer(currentQuestion);
  const nav = document.getElementById('nav-buttons');
  nav.innerHTML = '';       
  nav.style.display = 'flex';  

  document.getElementById('questions-wrapper').style.display = 'none';
  document.getElementById('nav-buttons').style.display      = 'none';

  const loader = document.getElementById('loading');
  loader.style.display = 'block';

  setTimeout(() => {
    loader.style.display = 'none';
    generateAdvice();
  }, 2400);  
}

function allAnswered() {
  return Array.from({ length: totalQuestions() }, (_, i) => `question-${i}`)
    .every(key => answers.hasOwnProperty(key));
}

function allExceptCurrentAnswered() {
  return Array.from({ length: totalQuestions() }, (_, i) => `question-${i}`)
    // drop the current
    .filter((key, i) => i !== currentQuestion)
    // check the rest all have answers
    .every(key => answers.hasOwnProperty(key));
}

function updateNav() {
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  const sub  = document.getElementById('submitBtn');

  // Prev only on >0
  prev.style.display = currentQuestion > 0 ? 'inline-block' : 'none';

  if (allExceptCurrentAnswered()) {
    // Hide Next, show Submit
    prev.style.display = 'none';
    next.style.display = 'none';
    sub.style.display  = 'inline-block';
  } else {
    sub.style.display  = 'none';
    next.style.display = currentQuestion < totalQuestions() - 1
      ? 'inline-block'
      : 'none';
  }        
}

function showQuestion(n) {
  const questions = document.getElementsByClassName('question');
  Array.from(questions).forEach(s => s.classList.remove('active'));
  if (n < 0 || n >= questions.length) return;
  questions[n].classList.add('active');
  document.getElementById('prevBtn').style.display = n === 0 ? 'none' : 'inline-block';
  document.getElementById('nextBtn').style.display = 'inline-block';
  renderProgress();
  updateNav();
}

function nextQuestion(n) {
  const questions = document.getElementsByClassName('question');
  const target = currentQuestion + n;
  if (target < 0) return;
  saveAnswer(currentQuestion);
  updateNav();
  if (questions[currentQuestion]) questions[currentQuestion].classList.remove('active');
  currentQuestion = target;
  if (currentQuestion >= questions.length) {
    generateAdvice();
  } else {
    showQuestion(currentQuestion);
  }
}

function goToQuestion(n) {
  saveAnswer(currentQuestion);
  document.getElementById(`question-${currentQuestion}`).classList.remove('active');
  currentQuestion = n;
  showQuestion(n);
}

function saveAnswer(step) {
  const qKey = `question-${step}`;
  const qEl  = document.getElementById(qKey);

  let entry;

  // if it’s a text question
  const textInput = qEl.querySelector('input[type="text"]');
  if (textInput) {
    entry = textInput.value.trim();        // might be ""
  }
  // otherwise it’s checkboxes
  else {
    entry = Array.from(
      qEl.querySelectorAll('input[type="checkbox"]')
    )
      .filter(cb => cb.checked)
      .map(cb => cb.id);                    // [] if none checked
  }

  // always write the key, even when entry is empty
  answers[qKey] = entry;
}


function evalLiteral(cond) {
  const resp = answers[cond.question] || [];
  if (cond.has) return resp.includes(cond.has);
  if (cond.not) return !resp.includes(cond.not);
  return false;
}

function generateAdvice() {
  document.getElementById('questions-wrapper').style.display = 'none';

  const nav = document.getElementById('nav-buttons');

  const sums       = { learning: 0, reasoning: 0, cognitive: 0 };
  const snippets   = [];
  const yourName   = answers['question-0'] || 'student';


  rules.forEach(rule => {
    const matched = rule.clauses.some(group =>
      group.every(evalLiteral)
    );
    if (matched) {
      snippets.push(rule.text);
      sums.learning  += rule.scores.learning;
      sums.reasoning += rule.scores.reasoning;
      sums.cognitive += rule.scores.cognitive;
    }
  });


  const maxScore = Math.max(sums.learning, sums.reasoning, sums.cognitive);


  const totalScore = sums.learning + sums.reasoning + sums.cognitive;
  const percents = {
    learning:  totalScore ? Math.round((sums.learning  / totalScore) * 100) : 0,
    reasoning: totalScore ? Math.round((sums.reasoning / totalScore) * 100) : 0,
    cognitive: totalScore ? Math.round((sums.cognitive / totalScore) * 100) : 0
  };

  // const chartHtml = `
  //   <div id="score-chart" class="score-chart">
  //   <h5>Scoreverdeling</h5>
  //     <div class="bar-learning"   style="width: ${percents.learning}%;"><span  ">${percents.learning}% Learning and Computation</span></div>
  //     <div class="bar-reasoning"  style="width: ${percents.reasoning}%;"><span ">${percents.reasoning}% Reasoning and Computation</span></div>
  //     <div class="bar-cognitive"  style="width: ${percents.cognitive}%;"><span ">${percents.cognitive}% Cognitive Processing</span></div>
  //   </div>
  // `;

  const chartHtml = `
      <div id="score-chart" class="score-chart">
        <h6>Score verdeling</h6>
      
        <div class="score-row">
          <div class="score-label">Learning & Computation</div>
          <div class="score-bar-bg">
            <div class="score-bar score-bar-learning" style="width: ${percents.learning}%"></div>
          </div>
          <div class="score-value">${percents.learning}%</div>
        </div>
      
        <div class="score-row">
          <div class="score-label">Reasoning & Computation</div>
          <div class="score-bar-bg">
            <div class="score-bar score-bar-reasoning" style="width: ${percents.reasoning}%"></div>
          </div>
          <div class="score-value">${percents.reasoning}%</div>
        </div>
      
        <div class="score-row">
          <div class="score-label">Cognitive Processing</div>
          <div class="score-bar-bg">
            <div class="score-bar score-bar-cognitive" style="width: ${percents.cognitive}%"></div>
          </div>
          <div class="score-value">${percents.cognitive}%</div>
        </div>
      </div>
      `;

  let overall;
  if ([sums.learning, sums.reasoning, sums.cognitive]
    .filter(s => s === maxScore).length > 1) {
    overall = `<p>Op basis van je antwoorden is er niet één verdiepingspakket dat er duidelijk uitspringt. Dat is helemaal niet erg – het betekent waarschijnlijk dat je interesses breed zijn, of dat je nog aan het ontdekken bent wat het beste bij je past. </p><p>Juist in dit geval is het extra waardevol om erover te praten met medestudenten, je peercoach, tutor of de <a href="https://students.uu.nl/gw/ki/contact/studieadviseur" target="_blank">studieadviseurs</a>. Samen kun je je gedachten scherpen en tot een keuze komen die goed bij je past.</p><p>Succes met je keuze!</p>`;
  } else if (maxScore === sums.learning) {
    overall = `<p>Op basis van je antwoorden lijkt het verdiepingspakket <strong>Learning and Computation</strong> een goede keuze voor jou. Maar natuurlijk spelen er ook andere factoren mee. Zie dit advies daarom vooral als een startpunt. Praat erover met medestudenten, je peercoach, tutor of de <a href="https://students.uu.nl/gw/ki/contact/studieadviseur" target="_blank">studieadviseurs</a>.</p><p>Succes met je keuze!</p>`;
  } else if (maxScore === sums.reasoning) {
    overall = `<p>Op basis van je antwoorden lijkt het verdiepingspakket <strong>Reasoning and Computation</strong> een goede keuze voor jou. Maar natuurlijk spelen er ook andere factoren mee. Zie dit advies daarom vooral als een startpunt. Praat erover met medestudenten, je peercoach, tutor of de <a href="https://students.uu.nl/gw/ki/contact/studieadviseur" target="_blank">studieadviseurs</a>.</p><p>Succes met je keuze!</p>`;
  } else {
    overall = `<p>Op basis van je antwoorden lijkt het verdiepingspakket <strong>Cognitive Processing</strong> een goede keuze voor jou. Maar natuurlijk spelen er ook andere factoren mee. Zie dit advies daarom vooral als een startpunt. Praat erover met medestudenten, je peercoach, tutor of de <a href="https://students.uu.nl/gw/ki/contact/studieadviseur" target="_blank">studieadviseurs</a>.</p><p>Succes met je keuze!</p>`;
  }


  const html = `
  <div class="typing">
  <p>Beste ${yourName},</p>
  ${snippets.map(t=>`<p>${t}</p>`).join('')}
  <p>${overall}</p>
  ${chartHtml}
  </div>
  `;


  const resEl = document.getElementById('result');
  resEl.innerHTML    = html;
  resEl.style.display = 'block';

  const printBtn = document.createElement('button');
  printBtn.type = 'button';
  printBtn.className = 'btn btn-primary btn-nav no-print';
  printBtn.textContent = 'Print resultaat';
  printBtn.addEventListener('click', () => window.print());
  nav.appendChild(printBtn);

  const restartBtn = document.createElement('button');
  restartBtn.type = 'button';
  restartBtn.className = 'btn btn-secondary btn-nav ms-2 no-print';
  restartBtn.textContent = 'Begin opnieuw';
  restartBtn.addEventListener('click', resetTest);
  nav.appendChild(restartBtn);
}
