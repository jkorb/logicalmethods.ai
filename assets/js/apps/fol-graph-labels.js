// Run after insertion so labels are measured in the graph's SVG coordinates.
export function layoutGraphLabels(graph) {
  if (!graph?.getClientRects().length) return;
  const placed = [];
  const overlaps = (a, b) => a.x < b.x + b.width + 4 && a.x + a.width + 4 > b.x &&
    a.y < b.y + b.height + 4 && a.y + a.height + 4 > b.y;
  for (const label of graph.querySelectorAll('.fol-edge-label')) {
    label.removeAttribute('visibility');
    label.setAttribute('x', label.dataset.labelX);
    label.setAttribute('y', label.dataset.labelY);
    let box = label.getBBox();
    // Opposite arrows still have separate paths, hit targets, and accessible
    // names. Only their repeated printed relation name is shared.
    if (placed.some(p => p.label.dataset.labelName === label.dataset.labelName &&
        label.dataset.labelPair && p.label.dataset.labelPair === label.dataset.labelPair &&
        overlaps(box, p.box))) {
      label.setAttribute('visibility', 'hidden');
      continue;
    }
    // Different relations must keep their names. Move these out of the way.
    const y = Number(label.dataset.labelY);
    for (let step = 1; placed.some(p => overlaps(box, p.box)) && step <= 12; step++) {
      label.setAttribute('y', y + Math.ceil(step / 2) * 22 * (step % 2 ? -1 : 1));
      box = label.getBBox();
    }
    placed.push({label, box});
  }
}
