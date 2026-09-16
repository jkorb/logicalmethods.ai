// Finite set semantics, independent of SVG and the browser. IDs, not positions,
// determine membership. A future editor can update a scene and reuse these queries.
export function members(scene, id) {
  if (!scene.sets.some(set => set.id === id)) throw new Error(`Unknown set: ${id}`);
  return scene.points.filter(point => point.sets.includes(id));
}
export function intersection(scene, ids) {
  ids.forEach(id => members(scene, id));
  return scene.points.filter(point => ids.every(id => point.sets.includes(id)));
}
export function difference(scene, left, right) {
  const excluded = new Set(members(scene, right).map(point => point.id));
  return members(scene, left).filter(point => !excluded.has(point.id));
}
export function isSubset(scene, left, right) { return difference(scene, left, right).length === 0; }
export function countermodels(scene, premises, conclusion) {
  const accepted = new Set(members(scene, conclusion).map(point => point.id));
  return intersection(scene, premises).filter(point => !accepted.has(point.id));
}
export function selectPoints(scene, view) {
  if (view.startsWith('outside:')) return scene.points.filter(point => !point.sets.includes(view.slice(8)));
  if (view === 'subset-witness') return difference(scene, 'S', 'T');
  if (view.startsWith('set:')) return members(scene, view.slice(4));
  if (view === 'intersection') return intersection(scene, scene.sets.map(set => set.id));
  if (view === 'difference') return difference(scene, scene.sets[0].id, scene.sets[1].id);
  if (view === 'premises') return intersection(scene, scene.premises);
  if (view === 'countermodels') return countermodels(scene, scene.premises, scene.conclusion);
  return scene.points;
}

// Exercise answers use the same membership data as the demonstration.
export function evaluateClaim(scene, claim) {
  switch (claim.kind) {
    case 'member': return members(scene, claim.set).some(p => p.id === claim.point);
    case 'intersection-member': return intersection(scene, claim.sets).some(p => p.id === claim.point);
    case 'empty-intersection': return intersection(scene, claim.sets).length === 0;
    case 'subset': {
      const left = Array.isArray(claim.left) ? intersection(scene, claim.left) : members(scene, claim.left);
      const right = new Set(members(scene, claim.right).map(p => p.id));
      return left.every(p => right.has(p.id));
    }
    default: throw new Error(`Unknown claim: ${claim.kind}`);
  }
}
export function exerciseAnswer(scene, question) {
  if (question.claim) return evaluateClaim(scene, question.claim);
  if (question.predicate) {
    const { all = [], any = [], none = [] } = question.predicate;
    return scene.points.filter(point => {
      const traits = point.traits || [];
      return all.every(t => traits.includes(t)) &&
        (!any.length || any.some(t => traits.includes(t))) &&
        none.every(t => !traits.includes(t));
    }).map(point => point.id);
  }
  return selectPoints(scene, question.view).map(p => p.id);
}
export function checkSelection(expected, selected) {
  const wanted = new Set(expected), chosen = new Set(selected);
  const missing = [...wanted].filter(id => !chosen.has(id)).length;
  const extra = [...chosen].filter(id => !wanted.has(id)).length;
  return { correct: missing === 0 && extra === 0, missing, extra };
}
