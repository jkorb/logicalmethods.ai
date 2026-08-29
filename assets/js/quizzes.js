function shuffleItems() {
  const quizzes = document.querySelectorAll('ul.quiz');
  quizzes.forEach(quiz => {
    const items = Array.from(quiz.querySelectorAll('li'));

    // Shuffle the items using Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    // Remove all items and append them back in shuffled order
    items.forEach(item => {
      quiz.appendChild(item);
    });
  });
}

document.addEventListener('DOMContentLoaded', shuffleItems);

function checkQuestion(id) {
  const container = document.getElementById(id);
  if (!container) return;

  // 0) verberg eerst altijd alle uitleg-secties
  container.querySelectorAll('.solution').forEach(sol => {
    sol.style.display = 'none';
  });

  // 1) verwijder bestaand check-all icoon
  const heading = container.querySelector('h5');
  if (heading) {
    const existingAll = heading.querySelector('.bi-check-all');
    if (existingAll) heading.removeChild(existingAll);
  }

  // 2) doorloop alle quizzes en markeer items
  const quizzes = container.querySelectorAll('ul.quiz');
  let allCorrectChecked = true;

  quizzes.forEach(quiz => {
    quiz.querySelectorAll('li').forEach(item => {
      const checkbox   = item.querySelector('input[type="checkbox"]');
      const wasCorrect = !!item.querySelector('.correct');
      const oldIcon    = item.querySelector('i.bi');
      if (oldIcon) item.removeChild(oldIcon);

      if (checkbox.checked && wasCorrect) {
        item.classList.add('text-success');
        const icon = document.createElement('i');
        icon.classList.add('bi','bi-check','text-success');
        item.appendChild(icon);

      } else if ((checkbox.checked && !wasCorrect) || (!checkbox.checked && wasCorrect)) {
        item.classList.add('text-danger');
        const icon = document.createElement('i');
        icon.classList.add('bi','bi-x','text-danger');
        item.appendChild(icon);
        allCorrectChecked = false;

      } else {
        item.classList.remove('text-success','text-danger');
      }
    });
  });

  // 3) als alles goed is, toon groen check-all én de uitleg
  if (allCorrectChecked && heading) {
    const allIcon = document.createElement('i');
    allIcon.classList.add('bi','bi-check-all','text-success');
    heading.appendChild(allIcon);

    container.querySelectorAll('.solution').forEach(sol => {
      sol.style.display = '';  // herstel default display
    });
  }
}


function resetQuestion(id) {
  const container = document.getElementById(id);
  if (!container) return;

  const quizzes = container.querySelectorAll('ul.quiz');

  quizzes.forEach(quiz => {
    const items = Array.from(quiz.querySelectorAll('li'));

    items.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      checkbox.checked = false;
      item.classList.remove('text-success', 'text-danger');

      // Remove any icons
      const existingIcon = item.querySelector('i.bi');
      if (existingIcon) {
        item.removeChild(existingIcon);
      }
    });

    // Shuffle the items using Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    // Remove all items and append them back in shuffled order
    items.forEach(item => {
      quiz.appendChild(item);
    });
  });

  // Remove the check-all icon if it exists
  const heading = container.querySelector('h5');
  if (heading) {
    const checkAllIcon = heading.querySelector('.bi-check-all');
    if (checkAllIcon) {
      heading.removeChild(checkAllIcon);
    }
  }
}

function toggleSolution(id) {
  const sol = document.getElementById(id);
  if (!sol) return;
  sol.classList.toggle('hidden');
}

function showPasswordModal(solutionId, quizKey) {
  const target = document.getElementById(solutionId);

  // if already shown, hide instead
  if (target.classList.contains('show')) {
    new bootstrap.Collapse(target, { toggle: false }).hide();
    return;
  }

  // otherwise prompt via modal
  const pwdModal = new bootstrap.Modal(
    document.getElementById('passwordModal')
  );
  document.getElementById('passwordSubmitButton').onclick = () => {
    checkPassword(solutionId, quizKey);
  };
  document.getElementById('passwordInput').onkeydown = e => {
    if (e.key === 'Enter') checkPassword(solutionId, quizKey);
  };
  pwdModal.show();
}

function checkPassword(solutionId, quizKey) {
  const attempt = document.getElementById('passwordInput').value;
  const correct = passwords[quizKey];
  const collapseEl = document.getElementById(solutionId);

  if (attempt === correct) {
    // reveal the collapse
    new bootstrap.Collapse(collapseEl, { toggle: false }).show();
    // hide the modal
    bootstrap.Modal.getInstance(
      document.getElementById('passwordModal')
    ).hide();
  } else {
    alert('Incorrect password.');
  }
}

function copyContent(idSuffix) {
  const spanId = idSuffix;
  const spanElement = document.getElementById(spanId);
  if (spanElement) {
    const textToCopy = spanElement.textContent || spanElement.innerText;
    navigator.clipboard.writeText(textToCopy).then(function() {
    }, function(err) {
      });
  }
}

const passwords = {
  "exc-laa": "logicROCKS!",
  "exc-val": "AIdoestoo!",
  "exc-for": "Formal?",
  "exc-bool": "TrueOrFalse",
  "exc-sat": "Icantgetno",
  "exc-if": "Password",
  "exc-proof": "Mellon",
  "exc-fol": "Sesame",
  "exc-finf": "Schibboleth",
  "exc-mv": "MoreThanTwo",
  "exc-prob": "Probably",
  "exc-learn" : "NonScholae"
  // Add more solutionId: password pairs here
};