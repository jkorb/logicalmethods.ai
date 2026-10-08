// Formula bars share freezing and content-sized textareas across chapter apps.
export function mountFormulaFields() {
  const fields = new Set();
  function resize(input) {
    input.tabIndex = input.readOnly ? -1 : 0;
    if (input.readOnly && document.activeElement === input) input.blur();
    if (input.tagName !== 'TEXTAREA' || !input.getClientRects().length) return;
    if (input.rows !== 1) input.rows = 1;
    input.style.height = '0px';
    input.style.height = `${input.scrollHeight + 2}px`;
  }
  function refresh() {
    document.querySelectorAll('.logic-app .logic-app__input, .logic-app [data-kb], .logic-app input[readonly], .logic-app textarea[readonly]').forEach(input => {
      if (!fields.has(input)) {
        fields.add(input);
        input.addEventListener('input', () => resize(input));
        input.addEventListener('keydown', event => {
          if (input.hasAttribute('data-submit-enter') && event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
            event.preventDefault(); if (!input.readOnly) input.form?.requestSubmit();
          }
        });
        input.addEventListener('pointerdown', event => { if (input.readOnly) event.preventDefault(); });
        input.addEventListener('focus', () => { if (input.readOnly) input.blur(); });
        let width;
        new ResizeObserver(entries => {
          const next = entries[0].contentRect.width;
          if (next !== width) { width = next; resize(input); }
        }).observe(input);
      }
      resize(input);
    });
  }
  let pending = false;
  const schedule = () => { if (!pending) { pending = true; queueMicrotask(() => { pending = false; refresh(); }); } };
  new MutationObserver(schedule).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['readonly', 'hidden', 'disabled'] });
  document.addEventListener('click', schedule);
  document.fonts.ready.then(refresh);
  refresh();
}
