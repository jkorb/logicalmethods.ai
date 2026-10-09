import { el } from './fol-views.js';
// Use the same Chroma classes as the book's code blocks, with inert text nodes.
export function highlightSQL(target, source) {
  target.replaceChildren();
  const keywords = new Set('SELECT DISTINCT FROM WHERE JOIN INNER CROSS ON AS AND OR NOT EXISTS TRUE FALSE CREATE TABLE INSERT INTO VALUES TEXT NULL PRIMARY KEY INTEGER REAL BLOB UPDATE SET DELETE DROP IF ORDER BY ASC DESC LIMIT OFFSET GROUP HAVING UNION ALL LEFT RIGHT OUTER FULL WITH RECURSIVE IS IN LIKE AS CASE WHEN THEN ELSE END COUNT SUM AVG MIN MAX'.split(' '));
  for (const token of source.match(/--[^\n]*|'(?:''|[^'])*'|"(?:""|[^"])*"|[A-Za-z_][A-Za-z_0-9]*|\d+|\s+|./g) || []) {
    const cls = token.startsWith('--') ? 'c1' : token.startsWith("'") ? 's' : keywords.has(token.toUpperCase()) ? 'k' : /^\d+$/.test(token) ? 'mi' : '';
    target.append(cls ? el('span', token, cls) : document.createTextNode(token));
  }
}
