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

  // Remove existing check-all icon if present
  const heading = container.querySelector('h5');
  if (heading) {
    const checkAllIcon = heading.querySelector('.bi-check-all');
    if (checkAllIcon) {
      heading.removeChild(checkAllIcon);
    }
  }

  const quizzes = container.querySelectorAll('ul.quiz');
  let allCorrectChecked = true;

  quizzes.forEach(quiz => {
    const items = quiz.querySelectorAll('li');
    items.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      const existingIcon = item.querySelector('i.bi');

      // Remove existing icons
      if (existingIcon) {
        item.removeChild(existingIcon);
      }

      if (checkbox.checked && item.querySelector('.correct')) {
        item.classList.add('text-success'); // Add green color for correct answers
        item.classList.remove('text-danger');
        const checkIcon = document.createElement('i');
        checkIcon.classList.add('bi', 'bi-check', 'text-success');
        item.appendChild(checkIcon);
      } else if ((checkbox.checked && !item.querySelector('.correct')) || (!checkbox.checked && item.querySelector('.correct'))) {
        item.classList.add('text-danger'); // Add red color for incorrect answers
        item.classList.remove('text-success');
        const crossIcon = document.createElement('i');
        crossIcon.classList.add('bi', 'bi-x', 'text-danger');
        item.appendChild(crossIcon);
        allCorrectChecked = false;
      } else {
        item.classList.remove('text-success');
        item.classList.remove('text-danger');
      }
    });
  });

  if (allCorrectChecked && heading) {
    const checkAllIcon = document.createElement('i');
    checkAllIcon.classList.add('text-success');
    checkAllIcon.classList.add('bi', 'bi-check-all');
    heading.appendChild(checkAllIcon);
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
