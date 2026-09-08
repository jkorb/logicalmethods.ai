// Keep line positions so Vale diagnostics still map to the original Markdown.
const blank = text => text.replace(/[^\r\n]/g, ' ');
// Inline code placeholders prevent leading whitespace from turning retained prose
// into an indented code block in Vale's Markdown parser.
const inline = text => '`x' + blank(text.slice(2, -1)) + '`';
export function proseText(source, course = true) {
  let text = source.replace(/^---\r?\n[\s\S]*?\r?\n---/, blank)
    .replace(/<!--(?!\s*vale\b)[\s\S]*?-->/g, blank)
    .replace(/^([`~]{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, blank);
  // A nonbreaking space prevents shortcode padding from becoming indented code.
  // Unlike HTML placeholders, it cannot start a Markdown HTML block.
  text = text.replace(/\{\{[<%][\s\S]*?[%>]\}\}/g, text => blank(text).replace(/^ /gm, '\u00a0'))
    .replace(/\$\$[\s\S]*?\$\$|\$[^$]*?\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, inline)
    .replace(/```[\s\S]*?```|`[^`]*`/g, inline);
  if (course) text = text.replace(/!![\s\S]*?!!|~![\s\S]*?!~|%[^%\n]+%/g, inline);
  // Heading attributes are Hugo metadata, not prose.
  return text.replace(/\{[.#][^}\n]*\}/g, blank);
}
