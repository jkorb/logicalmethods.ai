import test from 'node:test';
import assert from 'node:assert/strict';
import {step, booleanRows, evaluateUnit, gates, xorNetwork, compileTruthTable, evaluateNetwork, kbNetwork, kbValues, queryBlackBox, tableDNF, sigmoid, evaluateSigmoid, rainProbabilities} from '../../assets/js/logic/perceptron.js';

test('perceptrons use a strict threshold, including exact zero and negative weights', () => {
  assert.equal(step(0), 0);
  assert.equal(evaluateUnit([1, 1], [1, 1], -2).output, 0);
  assert.equal(evaluateUnit([1, 0], [-1, 0], 0.5).output, 0);
  assert.throws(() => evaluateUnit([0], [1, 2], 0));
  assert.throws(() => evaluateUnit([0], [NaN], 0));
});

test('the gate presets compute their stated functions and a hidden layer computes XOR', () => {
  const rows = booleanRows(2);
  for (const [name, gate] of Object.entries(gates)) {
    const actual = rows.map(row => evaluateUnit(row, gate.weights, gate.bias).output);
    if (name === 'xor') assert.notDeepEqual(actual, gate.values);
    else assert.deepEqual(actual, gate.values, name);
  }
  assert.deepEqual(rows.map(row => evaluateNetwork(row, xorNetwork).output), [0, 1, 1, 0]);
  assert.deepEqual(rows.map(queryBlackBox), [0, 1, 1, 0]);
});

test('row detectors represent every two- and three-input Boolean function, including constants', () => {
  for (const arity of [2, 3]) {
    const rows = booleanRows(arity);
    for (let bits = 0; bits < 2 ** rows.length; bits++) {
      const values = rows.map((_, i) => (bits >> i) & 1);
      const network = compileTruthTable(values);
      assert.deepEqual(rows.map(row => evaluateNetwork(row, network).output), values);
      assert.equal(network.hidden.length, values.every(value => value === values[0]) ? 0 : values.reduce((sum, value) => sum + value, 0));
    }
  }
  assert.throws(() => compileTruthTable([0, 1, 0]));
  assert.throws(() => compileTruthTable([0, null, 1, 0]));
});

test('the compact KB implementation equals its rules and their combined conditional on every input', () => {
  const rows = booleanRows(3);
  const actual = rows.map(row => evaluateUnit(row, kbNetwork.weights, kbNetwork.bias).output);
  assert.deepEqual(actual, kbValues);
  assert.deepEqual(actual, [1, 1, 0, 1, 0, 1, 0, 1]);
  for (const [i, [rain, sprinkler, wet]] of rows.entries()) {
    assert.equal(actual[i], Number(!(rain || sprinkler) || wet));
    assert.equal(actual[i], Number((!rain || wet) && (!sprinkler || wet)));
  }
  assert.equal(actual[0], 1); // The rules alone don't entail wet ground.
  assert.ok(rows.filter((row, i) => actual[i] && (row[0] || row[1])).every(row => row[2]));
});

test('extraction requires all rows and retains both positive and negated input literals', () => {
  assert.throws(() => tableDNF([0, 1, null, 0], ['P', 'Q']), /Complete/);
  assert.equal(tableDNF([0, 1, 1, 0], ['P', 'Q']), '(¬P ∧ Q) ∨ (P ∧ ¬Q)');
  assert.equal(tableDNF([0, 0, 0, 0], ['P', 'Q']), '⊥');
});

test('sigmoid estimates retain the weighted score and approximate the example probabilities', () => {
  assert.equal(sigmoid(0), 0.5);
  assert.equal(sigmoid(-1000), 0);
  assert.equal(sigmoid(1000), 1);
  assert.throws(() => evaluateSigmoid([0], [NaN], 0));
  for (const [input, target] of rainProbabilities) {
    const result = evaluateSigmoid([input], [5], -2.5);
    assert.equal(result.sum, 5 * input - 2.5);
    assert.ok(Math.abs(result.output - target) < 0.025);
  }
  assert.equal(evaluateSigmoid([0.75], [0], 0).output, 0.5);
  assert.ok(evaluateSigmoid([0.75], [-5], 2.5).output < 0.5);
});
