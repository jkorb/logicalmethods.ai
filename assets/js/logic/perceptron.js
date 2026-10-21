// The chapter uses the strict convention step(0) = 0 throughout.
export const step = value => Number(value > 0);

export function evaluateUnit(inputs, weights, bias) {
  if (inputs.length !== weights.length || ![...inputs, ...weights, bias].every(Number.isFinite)) {
    throw new Error('Use one finite weight per input and a finite bias.');
  }
  const terms = inputs.map((value, i) => value * weights[i]);
  const sum = terms.reduce((total, value) => total + value, bias);
  return { terms, sum, output: step(sum) };
}

export function booleanRows(arity) {
  if (!Number.isInteger(arity) || arity < 1 || arity > 10) throw new Error('Use between 1 and 10 Boolean inputs.');
  return Array.from({length: 2 ** arity}, (_, row) =>
    Array.from({length: arity}, (_, i) => (row >> (arity - i - 1)) & 1));
}

export const gates = {
  and: {label: 'AND', weights: [1, 1], bias: -1.5, values: [0, 0, 0, 1]},
  or: {label: 'OR', weights: [1, 1], bias: -0.5, values: [0, 1, 1, 1]},
  not: {label: 'NOT', weights: [-1, 0], bias: 0.5, values: [1, 1, 0, 0]},
  implies: {label: 'IF', weights: [-1, 1], bias: 0.5, values: [1, 1, 0, 1]},
  xor: {label: 'XOR', weights: [1, 1], bias: -0.5, values: [0, 1, 1, 0]},
};

export const xorNetwork = {
  hidden: [
    {label: 'h₁: OR', weights: [1, 1], bias: -0.5},
    {label: 'h₂: AND', weights: [1, 1], bias: -1.5},
  ],
  output: {weights: [1, -1], bias: -0.5},
};

// Each hidden unit detects one positive row. Its score is 0.5 on that row
// and falls by 1 for each mismatched bit; the output takes their disjunction.
export function compileTruthTable(values) {
  const arity = Math.log2(values.length);
  const rows = booleanRows(arity);
  if (!values.every(value => value === 0 || value === 1)) throw new Error('Truth-table values must be 0 or 1.');
  if (values.every(value => value === values[0])) return {hidden: [], output: {weights: [], bias: values[0] ? 0.5 : -0.5}};
  const hidden = rows.flatMap((row, i) => values[i] ? [{
    label: row.join(''),
    row,
    weights: row.map(value => value ? 1 : -1),
    bias: 0.5 - row.reduce((sum, value) => sum + value, 0),
  }] : []);
  hidden.forEach((unit, i) => {unit.label = `h${i + 1}: ${unit.label}`;});
  return {hidden, output: {weights: hidden.map(() => 1), bias: -0.5}};
}

export function evaluateNetwork(inputs, network) {
  const hidden = network.hidden.map(unit => evaluateUnit(inputs, unit.weights, unit.bias));
  return {hidden, ...evaluateUnit(hidden.map(unit => unit.output), network.output.weights, network.output.bias)};
}

export function rowFormula(row, names) {
  return row.map((value, i) => `${value ? '' : '¬'}${names[i]}`).join(' ∧ ');
}

export function tableDNF(values, names) {
  const rows = booleanRows(names.length);
  if (values.length !== rows.length || !values.every(value => value === 0 || value === 1)) {
    throw new Error('Complete the truth-table before extracting an equivalent formula.');
  }
  if (values.every(value => value === 1)) return '⊤';
  return rows.flatMap((row, i) => values[i] ? [`(${rowFormula(row, names)})`] : []).join(' ∨ ') || '⊥';
}

// Independent sufficient conditions for wet ground: (R → W) ∧ (S → W).
export const kbNames = ['R', 'S', 'W'];
export const kbNetwork = {weights: [-1, -1, 2], bias: 0.5};
export const kbValues = booleanRows(3).map(([rain, sprinkler, wet]) =>
  Number((!rain || wet) && (!sprinkler || wet)));

// Querying uses a fixed network; the extraction UI sees only its outputs.
export function queryBlackBox(inputs) {
  return evaluateNetwork(inputs, xorNetwork).output;
}

// Stable on either side of zero, including large scores.
export function sigmoid(value) {
  if (Number.isNaN(value)) throw new Error('Use a numerical score.');
  const exponential = Math.exp(-Math.abs(value));
  return value >= 0 ? 1 / (1 + exponential) : exponential / (1 + exponential);
}

export function evaluateSigmoid(inputs, weights, bias) {
  const result = evaluateUnit(inputs, weights, bias);
  return {...result, output: sigmoid(result.sum)};
}

// Invented reference probabilities, not weather observations or training data.
export const rainProbabilities = [[0, 0.1], [0.25, 0.225], [0.5, 0.5], [0.75, 0.775], [1, 0.9]];
