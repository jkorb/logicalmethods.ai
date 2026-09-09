/* Staged disclosure of tutorial solutions.
   NOTE: this is not access control. Both the passwords and the solution markup
   are delivered to the browser; the gate exists so students attempt the
   question first. Do not present it as security. */

const passwords = {
  "exc-latex": "chalk",
  "exc-laa": "apple",
  "exc-val": "robot",
  "exc-for": "quiz",
  "exc-bool": "doodle",
  "exc-sat": "puzzle",
  "exc-if": "rocket",
  "exc-proof": "story",
  "exc-fol": "magic",
  "exc-finf": "panda",
  "exc-mv": "balloon",
  "exc-prob": "rainbow",
  "exc-learn": "teacher"
};

document.addEventListener("DOMContentLoaded", function () {
  const modalEl = document.getElementById("passwordModal");
  const form = document.getElementById("passwordForm");
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("passwordError");
  if (!modalEl || !form || !input) return;

  const modal = new bootstrap.Modal(modalEl);
  let pending = null;          // the button that opened the dialog
  const unlocked = new Set();

  function setError(message) {
    error.textContent = message || "";
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function reveal(button) {
    const panel = document.getElementById(button.dataset.solution);
    if (!panel) return;
    const collapse = bootstrap.Collapse.getOrCreateInstance(panel, { toggle: false });
    const open = panel.classList.contains("show");
    collapse[open ? "hide" : "show"]();
    button.setAttribute("aria-expanded", String(!open));
    const label = button.querySelector(".btn-solution__label");
    if (label) label.textContent = open ? "Show solution" : "Hide solution";
  }

  document.querySelectorAll(".btn-solution").forEach(function (button) {
    button.addEventListener("click", function () {
      const sheet = button.dataset.sheet;
      // Once a sheet is unlocked, further solutions on it toggle freely.
      if (unlocked.has(sheet) || button.getAttribute("aria-expanded") === "true") {
        reveal(button);
        return;
      }
      pending = button;
      setError("");
      input.value = "";
      modal.show();
    });
  });

  modalEl.addEventListener("shown.bs.modal", function () { input.focus(); });
  modalEl.addEventListener("hidden.bs.modal", function () {
    // Return focus to the control that opened the dialog. Bootstrap only does
    // this for triggers that used data-bs-toggle; this one opens imperatively.
    if (pending) { pending.focus(); pending = null; }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!pending) return;
    const expected = passwords[pending.dataset.sheet];
    if (input.value === expected) {
      unlocked.add(pending.dataset.sheet);
      reveal(pending);
      modal.hide();   // 'hidden' then returns focus to the button and clears pending
    } else {
      setError("That password does not match this tutorial. Ask your tutor if you missed it.");
      input.select();
    }
  });

  input.addEventListener("input", function () { if (error.textContent) setError(""); });
});
