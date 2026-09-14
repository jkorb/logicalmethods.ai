/* Staged disclosure of tutorial solutions.
   NOTE: this is not access control. Both the password hashes and the solution markup
   are delivered to the browser; the gate exists so students attempt the
   question first. Do not present it as security. */

// SHA-256 of the exact UTF-8 password; see docs/authoring.md.
const passwords = {
  "exc-latex": "dd177139169cc19be2f28c8011ce8fc807d47765606c484349cd8bf769c973cb",
  "exc-laa": "5de21824fc1073de4a6efbc7dfac7cd05d11173dc6571a6e0fb12eca92ff7bec",
  "exc-val": "7ca3a789dec3442c3683fed1c883752ff7c367f8813065b311e265f7bdf219dc",
  "exc-for": "26ad528fbd5f7676fac05baec96bfb6f0a5a680319372fbf6214737576f55a72",
  "exc-bool": "b592f802a851443c7d8110ff7bb74a1e19f124b821995fcbf3f62ecd389b876e",
  "exc-sat": "61b886425e11db33b5585684d00815b0f5679e58e116450e3e366aec7fcdd4a6",
  "exc-if": "512977dc421600202e8b3276c8cc84f882d24909c74f201d3bcd2d4e52568f69",
  "exc-proof": "cf2419380cb22099f956f0ff741eca18602ff96f6d00ea30203b71f87e426260",
  "exc-fol": "819bd4a605be519f34478c004d4b3dd9ff5e37ba6b049575c91a195faf3fd144",
  "exc-finf": "5662594137af4ea9035a55b05fa1c143f428759667d24c3672f66714746ad080",
  "exc-mv": "7924e397b6628f7ff89d742f24c1842de41f1ff95283806c0f6cc21f939337a7",
  "exc-prob": "baad94cac98570eb975a86a67e915356e32d4f4b9607117c1b984c98c7fe30a0",
  "exc-learn": "e760210dd282f67626c5cc5b1df64a0036b4282356252f512d707a506fbc5b4f"
};

document.addEventListener("DOMContentLoaded", function () {
  const modalEl = document.getElementById("passwordModal");
  const form = document.getElementById("passwordForm");
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("passwordError");
  if (!modalEl || !form || !input) return;

  const modal = new bootstrap.Modal(modalEl);
  let attempt = 0;             // ignore checks superseded by input or dismissal
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
  modalEl.addEventListener("hide.bs.modal", function () { attempt++; });
  modalEl.addEventListener("hidden.bs.modal", function () {
    // Return focus to the control that opened the dialog. Bootstrap only does
    // this for triggers that used data-bs-toggle; this one opens imperatively.
    if (pending) { pending.focus(); pending = null; }
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!pending) return;
    const button = pending;
    const currentAttempt = ++attempt;
    const expected = passwords[button.dataset.sheet];
    let actual;
    try {
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input.value));
      actual = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
    } catch {
      if (currentAttempt === attempt) setError("Password checking is unavailable. Open the site over HTTPS or localhost and try again.");
      return;
    }
    if (currentAttempt !== attempt || pending !== button) return;
    if (actual === expected) {
      unlocked.add(pending.dataset.sheet);
      reveal(pending);
      modal.hide();   // 'hidden' then returns focus to the button and clears pending
    } else {
      setError("That password does not match this tutorial. Ask your tutor if you missed it.");
      input.select();
    }
  });

  input.addEventListener("input", function () { attempt++; if (error.textContent) setError(""); });
});
