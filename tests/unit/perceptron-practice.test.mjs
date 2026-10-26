import test from 'node:test';
import assert from 'node:assert/strict';
import {booleanRows, evaluateUnit, evaluateNetwork} from '../../assets/js/logic/perceptron.js';
import {implementationLevels, blackBoxLevels, separationLevels, separatorSection, clipHalfspace, fitSeparator, cubeView, emptyPracticeNetwork, checkRecordedTable, checkBlackBoxFormula} from '../../assets/js/logic/perceptron-practice.js';

// Witnesses match the worked solutions; targets are separately specified in the level data.
const witnesses = [
  {weights: [-1, -1], bias: 1.5},
  {weights: [-1, -1], bias: 0.5},
  {weights: [1, -1], bias: -0.5},
  {weights: [1, 1, 1], bias: -1.5},
  {hidden: [{weights: [1, 1, 1], bias: -0.5}, {weights: [1, 1, 1], bias: -1.5}], output: {weights: [1, -1], bias: -0.5}},
];
test('every construction solution computes the target for every input', () => {
  implementationLevels.forEach((level, i) => {
    const net = witnesses[i];
    const actual = booleanRows(level.arity).map(row => net.hidden ? evaluateNetwork(row, net).output : evaluateUnit(row, net.weights, net.bias).output);
    assert.deepEqual(actual, level.values, level.id);
  });
});
test('practice starts unsolved and fresh networks do not share editable parameters', () => {
  for (const level of implementationLevels) {
    const a = emptyPracticeNetwork(level), b = emptyPracticeNetwork(level);
    const actual = booleanRows(level.arity).map(row => a.hidden ? evaluateNetwork(row, a).output : evaluateUnit(row, a.weights, a.bias).output);
    assert.notDeepEqual(actual, level.values);
    const unit = a.hidden?.[0] ?? a;
    unit.weights[0] = 3;
    assert.equal((b.hidden?.[0] ?? b).weights[0], 0);
    if (a.hidden) assert.equal(a.hidden[1].weights[0], 0);
  }
});
test('record checking requires every row and finds a wrong output', () => {
  const target = [1, 1, 1, 0];
  assert.equal(checkRecordedTable([1, 1, null, 0], target).complete, false);
  assert.equal(checkRecordedTable([1, 1], target).correct, false);
  assert.equal(checkRecordedTable(target, target).correct, true);
  assert.equal(checkRecordedTable([1, 0, 1, 0], target).mismatch, 1);
});
test('black-box solutions and alternative formulas agree with the whole domain', () => {
  const answers = ['¬P ∧ ¬Q', 'P → Q', '(P ∧ Q) ∨ (P ∧ R) ∨ (Q ∧ R)', '(P ↔ Q) ∧ R'];
  blackBoxLevels.forEach((level, i) => assert.equal(checkBlackBoxFormula(answers[i], level).correct, true));
  assert.equal(checkBlackBoxFormula('¬(P ∨ Q)', blackBoxLevels[0]).correct, true);
  assert.equal(checkBlackBoxFormula('¬P ∨ Q', blackBoxLevels[1]).correct, true);
  assert.deepEqual(checkBlackBoxFormula('P', blackBoxLevels[0]), {correct: false, valuation: {P: 0, Q: 0}, actual: 0, expected: 1});
  assert.throws(() => checkBlackBoxFormula('R', blackBoxLevels[0]), /Use only/);
  assert.throws(() => checkBlackBoxFormula('', blackBoxLevels[0]), /Enter/);
  assert.throws(() => checkBlackBoxFormula('(', blackBoxLevels[0]));
});
test('black-box network witnesses match every observed output', () => {
  const networks = [
    {weights: [-1, -1], bias: 0.5}, {weights: [-1, 1], bias: 0.5},
    {weights: [1, 1, 1], bias: -1.5},
    {hidden: [{weights: [-1, -1, 1], bias: -0.5}, {weights: [1, 1, 1], bias: -2.5}], output: {weights: [1, 1], bias: -0.5}},
  ];
  blackBoxLevels.forEach((level, i) => {
    const net = networks[i];
    assert.deepEqual(booleanRows(level.arity).map(row => net.hidden ? evaluateNetwork(row, net).output : evaluateUnit(row, net.weights, net.bias).output), level.values);
  });
});
test('separator geometry handles planes, tangencies, and a zero normal', () => {
  const normalized = points => points.map(p => p.join(',')).sort();
  assert.deepEqual(normalized(separatorSection([1, 1], -1.5)), ['0.5,1', '1,0.5']);
  assert.equal(separatorSection([1, 1, 1], -1.5).length, 6);
  assert.equal(separatorSection([0, 0, 1], 0).length, 4);
  assert.deepEqual(separatorSection([1, 1, 1], 0), [[0, 0, 0]]);
  assert.deepEqual(separatorSection([0, 0, 0], 0), []);
  assert.deepEqual(separatorSection([1, 1], 1), []);
  for (const p of separatorSection([1, -2, 3], -0.5)) assert.ok(Math.abs(p[0] - 2*p[1] + 3*p[2] - 0.5) < 1e-12);
});
test('separable examples have witnesses and nonseparable examples have intersecting segments', () => {
  const find = id => separationLevels.find(level => level.id === id);
  for (const [id, weights, bias] of [['nand', [-1, -1], 1.5], ['table-a', [1, 0], -0.5], ['table-c', [1, -1], 0.5], ['majority', [1, 1, 1], -1.5]]) {
    const level = find(id);
    assert.equal(level.separable, true);
    assert.deepEqual(booleanRows(level.arity).map(row => evaluateUnit(row, weights, bias).output), level.values);
  }
  assert.equal(find('table-b').separable, false);
  assert.deepEqual(find('table-b').values, [0, 1, 1, 0]);
  const equal = find('all-equal'), exactlyOne = find('exactly-one');
  assert.equal(equal.separable, false);
  assert.deepEqual(equal.values, [1, 0, 0, 0, 0, 0, 0, 1]);
  const corners = booleanRows(3), midpoint = (a, b) => corners[a].map((x, i) => (x + corners[b][i]) / 2);
  assert.deepEqual(midpoint(0, 7), midpoint(1, 6));
  assert.equal(equal.values[0], equal.values[7]);
  assert.equal(equal.values[1], equal.values[6]);
  assert.notEqual(equal.values[0], equal.values[1]);
  assert.equal(exactlyOne.separable, false);
  assert.deepEqual(exactlyOne.values.filter((_, i) => i % 2 === 0), [0, 1, 1, 0]);
});

test('the shaded half-spaces cover the plotting domain and include boundaries outside the Boolean square', () => {
  const square = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const area = points => Math.abs(points.reduce((sum, p, i) => {const q = points[(i + 1) % points.length]; return sum + p[0]*q[1] - q[0]*p[1];}, 0)) / 2;
  for (const positive of [true, false]) {
    const points = clipHalfspace(square, [1, 1], -1, positive);
    assert.equal(area(points), 0.5);
    points.forEach(([x, y]) => assert.ok(positive ? x+y >= 1 : x+y <= 1));
  }
  assert.deepEqual(clipHalfspace(square, [0, 0], 0, true), []);
  assert.deepEqual(clipHalfspace(square, [0, 0], 0, false), square);
  const extended = separatorSection([1, 0], 0.2, [-0.55, -0.35], [1.55, 1.35]);
  assert.equal(extended.length, 2);
  extended.forEach(([x]) => assert.ok(Math.abs(x + 0.2) < 1e-12));
});
test('drag handles determine a line or plane through the chosen points', () => {
  for (const [points, normal] of [
    [[[0, 1], [0.5, 0]], [1, 1]],
    [[[1, 0.5, 0], [0, 1, 0.5], [0.5, 0, 1]], [1, 1, 1]],
  ]) {
    const result = fitSeparator(points, normal);
    assert.ok(Math.abs(Math.hypot(...result.weights) - Math.hypot(...normal)) < 1e-12);
    points.forEach(point => assert.ok(Math.abs(point.reduce((sum, x, i) => sum + x * result.weights[i], result.bias)) < 1e-12));
  }
  assert.equal(fitSeparator([[0, 0], [0, 0]], [1, 1]), null);
  assert.equal(fitSeparator([[0, 0, 0], [1, 1, 1], [2, 2, 2]], [1, 1, 1]), null);
});

test('cube views stay orthonormal through full turns, poles, and views from below', () => {
  const dot = (a, b) => a.reduce((sum, x, i) => sum + x*b[i], 0);
  for (const turn of [-360, 0, 35, 90, 180, 225, 270, 360, 720]) for (const tilt of [-90, 0, 26, 90, 180, 270, 360]) {
    const axes = cubeView(turn, tilt), wrapped = cubeView(turn + 360, tilt + 360);
    axes.forEach((axis, i) => {
      assert.ok(Math.abs(dot(axis, axis) - 1) < 1e-12);
      axes.forEach((other, j) => {if (i !== j) assert.ok(Math.abs(dot(axis, other)) < 1e-12);});
      axis.forEach((x, j) => assert.ok(Math.abs(x - wrapped[i][j]) < 1e-12));
    });
  }
  assert.ok(cubeView(35, 26)[2].every(x => x > 0));
  assert.ok(cubeView(215, 334)[2].every(x => x < 0));
});
