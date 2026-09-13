// One shared preview keeps long definitions inside the viewport.
const terms = [...document.querySelectorAll('[data-glossary-definition]')];
if (terms.length) {
  const preview = document.createElement('div');
  preview.id = 'glossary-preview';
  preview.className = 'glossary-preview';
  preview.role = 'tooltip';
  preview.hidden = true;
  document.body.append(preview);
  let active;
  let closeTimer;
  const close = () => {
    clearTimeout(closeTimer);
    active?.removeAttribute('aria-describedby');
    active = undefined;
    preview.hidden = true;
  };
  const show = term => {
    close();
    active = term;
    preview.textContent = term.dataset.glossaryDefinition;
    term.setAttribute('aria-describedby', preview.id);
    preview.hidden = false;
    const box = term.getBoundingClientRect();
    const width = preview.offsetWidth;
    const gap = 8;
    preview.style.left = `${Math.max(gap, Math.min(box.left, innerWidth - width - gap))}px`;
    const below = box.bottom + gap;
    preview.style.top = `${below + preview.offsetHeight <= innerHeight ? below : Math.max(gap, box.top - preview.offsetHeight - gap)}px`;
  };
  const later = () => { closeTimer = setTimeout(close, 180); };
  for (const term of terms) {
    term.removeAttribute('title'); // Native title remains the no-script fallback.
    term.addEventListener('mouseenter', () => show(term));
    term.addEventListener('mouseleave', later);
    term.addEventListener('focus', () => show(term));
    term.addEventListener('blur', close);
  }
  preview.addEventListener('mouseenter', () => clearTimeout(closeTimer));
  preview.addEventListener('mouseleave', later);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  window.addEventListener('scroll', () => {
    if (!active) return;
    const box = active.getBoundingClientRect();
    // Focus and hover can themselves scroll a term into view. Keep its
    // preview attached instead of dismissing it on the resulting scroll.
    if (box.bottom > 0 && box.top < innerHeight) show(active);
    else close();
  }, { passive: true });
  window.addEventListener('resize', close);
}

const glossary = document.querySelector('[data-glossary]');
if (glossary) {
  const input = glossary.querySelector('input');
  const entries = [...glossary.querySelectorAll('.glossary-entry')];
  const count = glossary.querySelector('[role=status]');
  const normalize = text => text.normalize('NFKD').replace(/\p{Mark}/gu, '').toLowerCase();
  const filter = () => {
    const words = normalize(input.value).trim().split(/\s+/).filter(Boolean);
    for (const entry of entries) {
      const haystack = normalize(entry.dataset.search);
      entry.hidden = !words.every(word => haystack.includes(word));
    }
    const found = entries.filter(entry => !entry.hidden).length;
    count.textContent = `${found} of ${entries.length} terms${found ? '' : '. Try another word.'}`;
  };
  const revealHash = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const entry = document.getElementById(id);
    if (entry?.classList.contains('glossary-entry')) {
      input.value = '';
      filter();
      entry.scrollIntoView();
    }
  };
  glossary.querySelector('.glossary-search').hidden = false;
  input.addEventListener('input', filter);
  window.addEventListener('hashchange', revealHash);
  filter();
  revealHash();
}
