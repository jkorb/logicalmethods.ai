export const latexMap = {
  "\\bot": "⊥", "\\top": "⊤", "\\models": "⊨", "\\vdash": "⊢",
  "\\nvdash": "⊬", "\\therefore": "∴", "\\in": "∈", "\\notin": "∉",
  "\\subseteq": "⊆", "\\emptyset": "∅", "\\cap": "∩", "\\cup": "∪",
  "\\Gamma": "Γ", "\\Sigma": "Σ", "\\Omega": "Ω", "\\omega": "ω", "\\mu": "μ",
  "\\forall": "∀",
  "\\exists": "∃",
  "\\neg": "¬",
  "\\lnot": "¬",
  "\\lor": "∨",
  "\\or": "∨",
  "\\vee": "∨",
  "\\and": "∧",
  "\\land": "∧",
  "\\wedge": "∧",
  "\\to": "→",
  "\\rightarrow": "→",
  "\\leftrightarrow": "↔",
  "\\iff": "↔",
  "\\nvDash": "⊭",
  "\\_1": "₁",
  "\\_2": "₂",
  "\\_3": "₃",
  "\\_4": "₄",
  "\\_5": "₅",
  "\\_6": "₆",
  "\\_7": "₇",
  "\\_8": "₈",
  "\\_9": "₉",
  "\\_0": "₀",
  "\\_n": "ₙ"
};

/* \not\X is the spelling you reach for when the negated symbol has no command
   of its own, or when amssymb is not loaded. Both spellings mean one symbol. */
const negated = {
  '\\models': '⊭', '\\vdash': '⊬', '\\in': '∉',
  '\\exists': '∄', '\\subseteq': '⊈', '\\equiv': '≢'
};

// Adapted from the tools branch: opt-in fields, complete commands, paste support.
export function latexToUnicode(text) {
  text = text.replace(/\\not(\\[a-zA-Z]+)(?![a-zA-Z])/g, (whole, command) => negated[command] ?? whole);
  text = text.replace(/\\_[0-9n]/g, command => latexMap[command]);
  text = text.replace(/_(?:\{([0-9]+)\}|([0-9]+))/g, (_, braced, plain) =>
    [...(braced ?? plain)].map(digit => '₀₁₂₃₄₅₆₇₈₉'[Number(digit)]).join(''));
  text = text.replace(/([₀₁₂₃₄₅₆₇₈₉])([0-9]+)/g, (_, sub, digits) => sub + [...digits].map(d => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]).join(''));
  return text.replace(/\\(?:[a-zA-Z]+|_[0-9n])/g, command => latexMap[command] ?? command);
}
export function convertInput(input) {
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const before = input.value;
  input.value = latexToUnicode(before);
  input.setSelectionRange(latexToUnicode(before.slice(0, start)).length,
    latexToUnicode(before.slice(0, end)).length);
}
export function enableLatexInput(input, changed = () => {}) {
  let pending = null;
  const liveConvert = event => {
    if (input.readOnly || event.isComposing) return;
    // A complete short command may start a longer one: \to, then p, is \top.
    // Restore only a known continuation at the same cursor position.
    if (pending && event.inputType === 'insertText' && event.data &&
        input.value === pending.value.slice(0, pending.end) + event.data + pending.value.slice(pending.end) &&
        Object.keys(latexMap).some(command => command.startsWith(pending.raw + event.data))) {
      const caret = input.selectionStart + pending.raw.length - pending.symbol.length;
      input.value = input.value.slice(0, pending.start) + pending.raw + input.value.slice(pending.end);
      input.setSelectionRange(caret, caret);
    }
    pending = null;
    const before = input.value;
    const caret = input.selectionStart;
    const command = before.slice(0, caret).match(/\\[a-zA-Z]+$/)?.[0];
    convertInput(input);
    if (command && latexMap[command] && Object.keys(latexMap).some(key => key !== command && key.startsWith(command))) {
      pending = { raw: command, symbol: latexMap[command], end: input.selectionStart,
        start: input.selectionStart - latexMap[command].length, value: input.value };
    }
    changed();
  };
  input.addEventListener('input', liveConvert);
  input.addEventListener('compositionend', liveConvert);
}
