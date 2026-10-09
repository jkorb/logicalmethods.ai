// A standalone Forest document for the currently displayed (possibly partial) tree.
export function treeToLatex(tree, formulas = false) {
  const symbols = { '¬': '\\neg ', '∧': '\\land ', '∨': '\\lor ', '→': '\\to ', '↔': '\\leftrightarrow ', '∀': '\\forall ', '∃': '\\exists ', '⊤': '\\top ', '⊥': '\\bot ' };
  function label(text) {
    return (text.match(/[A-Za-z]+|[₀₁₂₃₄₅₆₇₈₉]+|[^]/gu) || []).map(s => {
      if (symbols[s]) return symbols[s];
      if (/^[₀₁₂₃₄₅₆₇₈₉]+$/.test(s)) return `_{${[...s].map(c => '₀₁₂₃₄₅₆₇₈₉'.indexOf(c)).join('')}}`;
      if (/^[A-Za-z]{2,}$/.test(s)) return `\\mathit{${s}}`;
      if (/^[#$%&_{}]$/.test(s)) return `\\${s}`;
      if (s === '\\') return '\\backslash ';
      if (s === '^') return '\\hat{}';
      if (s === '~') return '\\sim ';
      return s;
    }).join('');
  }
  function branch(node, depth = 0) {
    const pad = '  '.repeat(depth);
    const name = label(formulas ? node.text || '?' : node.label);
    return `${pad}[{$${name}$}${node.children.length ? '\n' + node.children.map(n => branch(n, depth + 1)).join('\n') + '\n' + pad : ''}]`;
  }
  return `\\documentclass[border=6pt]{standalone}\n\\usepackage{amsmath,amssymb,forest}\n\\begin{document}\n\\begin{forest}\nfor tree={draw, rounded corners, align=center, s sep=8mm, l sep=8mm}\n${branch(tree)}\n\\end{forest}\n\\end{document}\n`;
}
