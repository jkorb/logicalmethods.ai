// Shared visual grammar for parsing and evaluation trees.
import { svg as svgElement, activate } from './boolean-ui.js';
export function renderTree(tree, { active, nodeLabel = n => n.label, annotation, compact = false, onSelect, nodeDescription = n => n.label } = {}) {
    const gap = compact ? 10 : 28;
    const widths = new Map();
    const nodeWidths = new Map();
    const measure = node => {
      const nodeWidth = Math.max(compact ? 46 : 68, [...nodeLabel(node)].length * (compact ? 12 : 15) + (compact ? 16 : 28));
      nodeWidths.set(node.id, nodeWidth);
      const childrenWidth = node.children.reduce((sum, child) => sum + measure(child), 0) + Math.max(0, node.children.length - 1) * gap;
      const width = Math.max(nodeWidth, childrenWidth, annotation ? compact ? (node.children.length ? 90 : (nodeLabel(node).length + 5) * 10) : 155 : 0);
      widths.set(node.id, width);
      return width;
    };
    measure(tree);
    const width = Math.max(280, widths.get(tree.id) + 40);
    let maxDepth = 0;
    const positions = new Map();
    const place = (node, x, depth) => {
      maxDepth = Math.max(maxDepth, depth);
      positions.set(node.id, { x, y: 40 + depth * (annotation ? 100 : 82) });
      const childrenWidth = node.children.reduce((sum, child) => sum + widths.get(child.id), 0) + Math.max(0, node.children.length - 1) * gap;
      let left = x - childrenWidth / 2;
      for (const child of node.children) {
        place(child, left + widths.get(child.id) / 2, depth + 1);
        left += widths.get(child.id) + gap;
      }
    };
    place(tree, width / 2, 0);
    const height = (annotation ? 110 : 80) + maxDepth * (annotation ? 100 : 82);
    const svg = svgElement('svg', { viewBox: `0 0 ${width} ${height}`, width, height, ...(onSelect ? {role:'group','aria-label':'Parse tree'} : {'aria-hidden':'true',focusable:'false'}) });
    if (width <= 550) svg.style.maxInlineSize = '100%';
    const edges = svgElement('g', {});
    const nodes = svgElement('g', {});
    function draw(node) {
      const p = positions.get(node.id);
      for (const child of node.children) {
        const c = positions.get(child.id);
        edges.append(svgElement('line', { x1: p.x, y1: p.y + 19, x2: c.x, y2: c.y - 19 }));
        draw(child);
      }
      const g = svgElement('g', { class: node.id === active ? 'is-current' : '' });
      if(onSelect) { g.setAttribute('role','button'); g.setAttribute('tabindex','0'); g.setAttribute('aria-label',nodeDescription(node)); g.setAttribute('data-tree-node',node.id); activate(g,()=>onSelect(node)); }
      g.append(svgElement('title', {}, onSelect ? nodeDescription(node) : annotation ? nodeLabel(node) : `${node.label}: ${node.text}${node.complete ? ' — complete' : ' — still being parsed'}`));
      g.append(svgElement('rect', { x: p.x - nodeWidths.get(node.id) / 2, y: p.y - 20, width: nodeWidths.get(node.id), height: 40, rx: 6 }));
      g.append(svgElement('text', { x: p.x, y: p.y, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, nodeLabel(node)));
      if (annotation?.(node)) g.append(svgElement('text', { x: p.x, y: p.y + 39, 'text-anchor': 'middle', class: 'tree-valuation' }, annotation(node)));
      nodes.append(g);
    }
    draw(tree);
    svg.append(edges, nodes);
    return svg;
}
