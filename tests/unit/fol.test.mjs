import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { parseFOL, printFOL, freeVariables, traceFOL } from '../../assets/js/logic/fol-parser.js';
import { evaluateFOL, validateModel, queryFOL, folToSQL, tupleKey } from '../../assets/js/logic/fol-model.js';
const people = JSON.parse(readFileSync(new URL('../../data/fol/people.json', import.meta.url)));
const database = JSON.parse(readFileSync(new URL('../../data/fol/database.json', import.meta.url)));
const parse = (s, config = people) => parseFOL(s, { language: config.language });
test('FOL grammar separates terms, atoms, connectives and nested quantifiers', () => {
  const source = '∀x (Human(x) → ∃y (Human(y) ∧ motherOf(x) = y))';
  const ast = parseFOL(source); assert.equal(ast.kind, 'quantifier'); assert.deepEqual(freeVariables(ast), []);
  assert.equal(printFOL(parseFOL(printFOL(ast))), printFOL(ast));
  const t = parseFOL('distanceBetween birthplaceOf Socrates capitalOf x', { kind: 'term' });
  assert.equal(printFOL(t), 'distanceBetween(birthplaceOf(Socrates), capitalOf(x))');
  assert.equal(traceFOL(source).steps.at(-1).state, 'success');
  for (const s of ['fatherOf(Socrates)', 'Human(x, y)', 'Human()', 'R(x)', 'Unknown(x)', '∀Socrates Human(x)', 'Human(x) ∧ Mortal(x)']) assert.throws(() => parseFOL(s));
  assert.equal(printFOL(parseFOL('Human(x) ∧ Mortal(x)', { mode: 'conventional' })), '(Human(x) ∧ Mortal(x))');
  assert.deepEqual(freeVariables(parseFOL('(Human(x) ∧ ∀x Mortal(x))')), ['x']);
});
test('model truth changes with interpretations and functions must be total', () => {
  const m = structuredClone(people.model); const l = people.language;
  assert.deepEqual(validateModel(l, m), []);
  const a = parse('∀x (Human(x) → Mortal(x))');
  assert.equal(evaluateFOL(a, l, m).value, true);
  m.predicates.Mortal = m.predicates.Mortal.filter(row => row[0] !== 'jimmy');
  const result = evaluateFOL(a, l, m); assert.equal(result.value, false);
  assert.match(result.steps.at(-1).explanation, /counterexample/);
  assert.equal(evaluateFOL(parse('∃x (Human(x) ∧ ¬Mortal(x))'), l, m).value, true);
  assert.equal(evaluateFOL(parse('MrSir = fatherOf(LittleJimmy)'), l, m).value, true);
  m.constants.Socrates = 'jimmy'; assert.equal(evaluateFOL(parse('Socrates = LittleJimmy'), l, m).value, true);
  m.domain.push('rabbit'); assert.throws(() => evaluateFOL(a, l, m), /Incomplete model/);
  m.functions.fatherOf[tupleKey(['rabbit'])] = 'rabbit'; assert.equal(evaluateFOL(a, l, m).value, false);
  m.domain = []; assert.ok(validateModel(l, m).length);
});
test('quantifier shadowing restores assignments; open formulas require valid values', () => {
  const { language: l, model: m } = people;
  const ast = parse('(∃x ¬Human(x) ∧ Human(x))'); const s = { x: 'jimmy' };
  assert.equal(evaluateFOL(ast, l, m, s).value, true); assert.deepEqual(s, { x: 'jimmy' });
  assert.equal(evaluateFOL(ast, l, m, { x: 'box' }).value, false);
  assert.throws(() => evaluateFOL(ast, l, m), /Assign x/);
  assert.equal(evaluateFOL(parse('∀x ∃y x = y'), l, m).value, true);
  assert.equal(evaluateFOL(parse('∃y ∀x x = y'), l, m).value, false);
  assert.throws(() => evaluateFOL(parse('∀x ∃y x = y'), l, m, {}, { budget: 2 }), /limit reached/);
});
test('query answers and generated SQL agree including negation, binding and sentences', () => {
  const { language: l, model: m } = database;
  const sources = ['LocatedIn(x, Europe)', '∃y (CapitalOf(y, x) ∧ LocatedIn(y, Europe))', '¬LocatedIn(Japan, x)', '(LocatedIn(x, Europe) ∧ ∃x LocatedIn(x, Asia))', '∀x ∃y x = y', '∃y ∀x x = y', '(LocatedIn(x, Europe) ↔ LocatedIn(y, Europe))'];
  const cases = sources.map(source => { const a = parse(source, database); return { sql: folToSQL(a, l, m), ...queryFOL(a, l, m) }; });
  assert.deepEqual(cases[0].rows, [['Netherlands'], ['Germany'], ['Italy']]);
  assert.deepEqual(cases[1].rows, [['Amsterdam'], ['Berlin'], ['Rome']]);
  assert.equal(cases[2].rows.length, 17);
  const script = `import json,sqlite3,sys\nd=json.load(sys.stdin)\nc=sqlite3.connect(':memory:')\nc.execute('CREATE TABLE Domain(value TEXT PRIMARY KEY NOT NULL)')\nc.executemany('INSERT INTO Domain VALUES (?)', [(x,) for x in d['model']['domain']])\nfor name,rows in d['model']['predicates'].items():\n c.execute('CREATE TABLE "'+name+'" (arg1 TEXT NOT NULL, arg2 TEXT NOT NULL)')\n c.executemany('INSERT INTO "'+name+'" VALUES (?,?)',rows)\nprint(json.dumps([c.execute(q['sql']).fetchall() for q in d['cases']]))`;
  const run = spawnSync('python3', ['-c', script], { input: JSON.stringify({ model: m, cases }), encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  const actual = JSON.parse(run.stdout);
  cases.forEach((c, i) => assert.deepEqual(actual[i].map(JSON.stringify).sort(), (c.variables.length ? c.rows : [[c.rows.length ? 1 : 0]]).map(JSON.stringify).sort()));
});

test('higher arities retain tuple order and allow repeated objects', () => {
  const language = { constants: ['a'], functions: { f: 2 }, predicates: { R: 3 } };
  const model = { domain: ['d', 'e'], constants: { a: 'd' }, functions: { f: { '["d","d"]': 'd', '["d","e"]': 'e', '["e","d"]': 'd', '["e","e"]': 'e' } }, predicates: { R: [['d', 'e', 'd']] } };
  const check = source => evaluateFOL(parseFOL(source, { language }), language, model).value;
  assert.equal(check('∃x R(a, f(a, x), a)'), true);
  assert.equal(check('∀x R(a, f(a, x), a)'), false);
  assert.equal(check('∃x R(x, a, a)'), false);
  model.functions.f['["d","e"]'] = 'outside';
  assert.ok(validateModel(language, model).length);
});

test('teaching traces group complete scope checks without losing witnesses or shadowing', async () => {
  const { explainEvaluation } = await import('../../assets/js/logic/fol-trace.js');
  const ast = parse('∀x (Human(x) → Mortal(x))');
  const explain = (a, m = people.model) => explainEvaluation(a, evaluateFOL(a, people.language, m));
  const trace = explain(ast);
  assert.equal(trace.steps.length, people.model.domain.length + 1);
  assert.deepEqual(trace.steps.slice(0, -1).map(s => s.assignment.x), people.model.domain);
  assert.equal(trace.steps.at(-2).value, true); // false antecedent for the box
  assert.equal(trace.steps.at(-2).details.find(s => s.symbol === 'Human').value, false);
  const m = structuredClone(people.model); m.predicates.Mortal.shift();
  const counterexample = explain(ast, m);
  assert.equal(counterexample.steps.length, 2); assert.equal(counterexample.value, false);
  const nested = explain(parse('∀x (Human(x) → ∃x Mortal(x))'));
  assert.equal(nested.steps.length, 6); assert.equal(nested.value, true);
  assert.deepEqual(nested.steps.slice(0, -1).map(s => s.assignment.x), people.model.domain);
  assert.equal(explain(parse('fatherOf(LittleJimmy) = MrSir')).steps.length, 1);
});

test('positive-atom pruning preserves answers, including negation and shadowing', () => {
  const language = { constants: ['a'], functions: {}, predicates: { P: 1, R: 2 } };
  const formulas = ['R(x, y)', '¬R(x, y)', '(R(x, y) ∧ P(x))', '(R(x, y) ∨ P(x))', '(R(x, y) → P(x))', '∃y (R(x, y) ∧ P(y))', '(P(x) ∧ ∃x R(x, y))', '∀y R(x, y)', '∃x (R(x, x) ∧ P(x))', 'R(x, a)'];
  for (let mask = 0; mask < 64; mask++) {
    const model = { domain: ['d', 'e'], constants: { a: 'd' }, functions: {}, predicates: { P: [['d'], ['e']].filter((_, i) => mask & (1 << i)), R: [['d','d'],['d','e'],['e','d'],['e','e']].filter((_, i) => mask & (1 << (i + 2))) } };
    for (const formula of formulas) {
      const ast = parseFOL(formula, { language });
      assert.deepEqual(queryFOL(ast, language, model, { prune: true }).rows, queryFOL(ast, language, model).rows, formula);
    }
  }
  const world = JSON.parse(readFileSync(new URL('../../data/fol/world.json', import.meta.url)));
  const result = queryFOL(parseFOL('LocatedIn(x, y)', { language: world.language }), world.language, world.model, { prune: true });
  assert.equal(result.totalCandidates, 324); assert.equal(result.steps.length, 5);
});

test('conventional inequality abbreviates negated identity in every assignment', () => {
  const language = {constants:['a'],functions:{},predicates:{P:1}};
  const model = {domain:['d','e'],constants:{a:'d'},functions:{},predicates:{P:[['d'],['e']]}};
  for (const formula of ['x ≠ a', 'P(x) ∧ x ≠ a', '∀x (x ≠ a ∨ x = a)']) {
    const ast=parseFOL(formula,{language,mode:'conventional'});
    const explicit=parseFOL(formula.replaceAll('x ≠ a','¬(x = a)'),{language,mode:'conventional'});
    for (const x of model.domain) assert.equal(evaluateFOL(ast,language,model,{x}).value,evaluateFOL(explicit,language,model,{x}).value);
  }
});
