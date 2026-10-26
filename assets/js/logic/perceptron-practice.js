import {booleanRows} from './perceptron.js';
import {parseBoolean, evaluateTrace} from './boolean.js';

export const implementationLevels = [
  {id: 'nand', label: 'NAND', arity: 2, hidden: 0, values: [1, 1, 1, 0]},
  {id: 'nor', label: 'NOR', arity: 2, hidden: 0, values: [1, 0, 0, 0]},
  {id: 'and-not', label: 'ANDNOT', arity: 2, hidden: 0, values: [0, 0, 1, 0]},
  {id: 'majority', label: 'Majority', arity: 3, hidden: 0, values: [0, 0, 0, 1, 0, 1, 1, 1]},
  {id: 'exactly-one', label: 'Exactly one', arity: 3, hidden: 2, values: [0, 1, 1, 0, 1, 0, 0, 0]},
];

export const separationLevels = [
  {...implementationLevels[0], separable: true},
  {id: 'table-a', label: 'Table A', arity: 2, values: [0, 0, 1, 1], separable: true},
  {id: 'table-b', label: 'Table B', arity: 2, values: [0, 1, 1, 0], separable: false},
  {id: 'table-c', label: 'Table C', arity: 2, values: [1, 0, 1, 1], separable: true},
  {id: 'all-equal', label: 'All equal', arity: 3, values: [1, 0, 0, 0, 0, 0, 0, 1], separable: false},
  {...implementationLevels[3], separable: true},
  {...implementationLevels[4], separable: false},
];

// Orthonormal screen axes and the direction towards the viewer. Both angles
// can complete a full turn, including views from below and behind the cube.
export function cubeView(turn, tilt) {
  const theta = turn * Math.PI / 180, phi = tilt * Math.PI / 180;
  return [
    [Math.cos(theta), -Math.sin(theta), 0],
    [Math.sin(phi)*Math.sin(theta), Math.sin(phi)*Math.cos(theta), -Math.cos(phi)],
    [Math.cos(phi)*Math.sin(theta), Math.cos(phi)*Math.cos(theta), Math.sin(phi)],
  ];
}

// Intersections with a rectangular plotting domain; by default the unit cube.
export function separatorSection(weights, bias, lower = 0, upper = 1) {
  if (![...weights, bias].every(Number.isFinite) || weights.every(w => w === 0)) return [];
  const rows = booleanRows(weights.length), points = [];
  const score = point => point.reduce((sum, x, i) => sum + weights[i] * x, bias);
  const add = point => {
    if (!points.some(other => other.every((x, i) => Math.abs(x - point[i]) < 1e-9))) points.push(point);
  };
  const lo = Array.isArray(lower) ? lower : weights.map(() => lower);
  const hi = Array.isArray(upper) ? upper : weights.map(() => upper);
  for (const bits of rows) for (let axis = 0; axis < weights.length; axis++) {
    if (bits[axis]) continue;
    const start = bits.map((bit, i) => bit ? hi[i] : lo[i]);
    const end = [...start]; end[axis] = hi[axis];
    const a = score(start), b = score(end);
    if (a === 0) add(start);
    if (b === 0) add(end);
    if (a * b < 0) {const point = [...start]; point[axis] = lo[axis] + (hi[axis] - lo[axis]) * a / (a - b); add(point);}
  }
  return points;
}

export function clipHalfspace(polygon, weights, bias, positive) {
  if (!polygon.length) return [];
  if (weights.every(w => w === 0)) return (bias > 0) === positive ? polygon : [];
  const score = point => (positive ? 1 : -1) * point.reduce((sum, x, i) => sum + weights[i] * x, bias);
  const result = [];
  let a = polygon.at(-1), sa = score(a);
  for (const b of polygon) {
    const sb = score(b);
    if ((sa >= 0) !== (sb >= 0)) result.push(a.map((x, i) => x + (b[i] - x) * sa / (sa - sb)));
    if (sb >= 0) result.push(b);
    a = b; sa = sb;
  }
  return result;
}

// Fit a boundary through two (2D) or three (3D) handles, retaining its scale
// and the orientation nearest the previous normal as the handles move.
export function fitSeparator(handles, previousWeights) {
  const u = handles[1].map((x, i) => x - handles[0][i]);
  let normal = [u[1], -u[0]];
  if (u.length === 3) {
    const v = handles[2].map((x, i) => x - handles[0][i]);
    normal = [u[1]*v[2] - u[2]*v[1], u[2]*v[0] - u[0]*v[2], u[0]*v[1] - u[1]*v[0]];
  }
  const length = Math.hypot(...normal);
  if (length < 1e-8) return null;
  const sign = normal.reduce((sum, x, i) => sum + x * previousWeights[i], 0) < 0 ? -1 : 1;
  const weights = normal.map(x => sign * x * Math.hypot(...previousWeights) / length);
  return {weights, bias: -weights.reduce((sum, x, i) => sum + x * handles[0][i], 0)};
}

export const blackBoxLevels = [
  {id: 'box-1', label: '1', arity: 2, values: [1, 0, 0, 0]},
  {id: 'box-2', label: '2', arity: 2, values: [1, 1, 0, 1]},
  {id: 'box-3', label: '3', arity: 3, values: [0, 0, 0, 1, 0, 1, 1, 1]},
  {id: 'box-4', label: '4', arity: 3, values: [0, 1, 0, 0, 0, 0, 0, 1]},
];

export function emptyPracticeNetwork(level) {
  const unit = arity => ({weights: Array(arity).fill(0), bias: 0});
  return level.hidden ? {
    hidden: Array.from({length: level.hidden}, (_, i) => ({label: `h${i + 1}`, ...unit(level.arity)})),
    output: unit(level.hidden),
  } : unit(level.arity);
}

export function checkRecordedTable(observed, target) {
  if (observed.length !== target.length || observed.some(value => value !== 0 && value !== 1)) return {complete: false, correct: false};
  const mismatch = observed.findIndex((value, i) => value !== target[i]);
  return {complete: true, correct: mismatch === -1, mismatch};
}

export function checkBlackBoxFormula(source, level) {
  if (!source.trim()) throw new Error('Enter a formula.');
  const names = ['P', 'Q', 'R'].slice(0, level.arity);
  const parsed = parseBoolean(source);
  if (parsed.names.some(name => !names.includes(name))) throw new Error(`Use only ${names.join(', ')} as atoms.`);
  const rows = booleanRows(level.arity);
  for (const [i, row] of rows.entries()) {
    const valuation = Object.fromEntries(names.map((name, j) => [name, row[j]]));
    const output = evaluateTrace(parsed.tree, valuation).at(-1).value;
    if (output !== level.values[i]) return {correct: false, valuation, actual: output, expected: level.values[i]};
  }
  return {correct: true};
}
