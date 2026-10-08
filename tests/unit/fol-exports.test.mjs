import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { databaseSQL, modelSpecification } from '../../assets/js/logic/fol-database-export.js';
import { treeToLatex } from '../../assets/js/logic/tree-latex.js';
import { traceFOL, parseFOL } from '../../assets/js/logic/fol-parser.js';
import { folToSQL, queryFOL } from '../../assets/js/logic/fol-model.js';

test('exported initialization and indented queries execute with the same answers in SQLite', () => {
  const config = JSON.parse(readFileSync(new URL('../../data/fol/world.json', import.meta.url)));
  const { language, model, columns } = config;
  const setup = databaseSQL(language, model, columns);
  const formulas = [...config.queries.map(q => q.formula), '∀x ∃y x = y', '(LocatedIn(x, Europe) ↔ LocatedIn(x, Europe))'];
  const queries = formulas.map(f => folToSQL(parseFOL(f, { language }), language, model, columns));
  const run = spawnSync('python3', ['-c', `import json,sqlite3,sys
d=json.load(sys.stdin)
c=sqlite3.connect(':memory:')
c.executescript(d['setup'])
print(json.dumps([c.execute(q).fetchall() for q in d['queries']]))`], { encoding: 'utf8', input: JSON.stringify({ setup, queries }) });
  assert.equal(run.status, 0, run.stderr);
  JSON.parse(run.stdout).forEach((rows, i) => {
    const q = queryFOL(parseFOL(formulas[i], { language }), language, model);
    const expected = q.variables.length ? q.rows : [[q.rows.length ? 1 : 0]];
    assert.deepEqual(rows.map(JSON.stringify).sort(), expected.map(JSON.stringify).sort());
  });
  assert.match(queries[1], /\n {4,}SELECT 1/);
  assert.deepEqual(JSON.parse(modelSpecification(config, model)).model, model);
});

test('database export escapes identifiers and values and retains empty relations and unused objects', () => {
  const language = { constants: ['a'], functions: {}, predicates: { R: 1, Empty: 1 } };
  const model = { domain: ["O'Brien", 'unused'], constants: { a: "O'Brien" }, functions: {}, predicates: { R: [["O'Brien"]], Empty: [] } };
  const setup = databaseSQL(language, model, { R: ['object"name'] });
  const run = spawnSync('python3', ['-c', `import json,sqlite3,sys
c=sqlite3.connect(':memory:')
c.executescript(sys.stdin.read())
print(json.dumps([c.execute('SELECT * FROM R').fetchall(),c.execute('SELECT * FROM Empty').fetchall(),c.execute('SELECT * FROM Domain').fetchall()]))`], { encoding: 'utf8', input: setup });
  assert.equal(run.status, 0, run.stderr);
  assert.deepEqual(JSON.parse(run.stdout), [[["O'Brien"]], [], [["O'Brien"], ['unused']]]);
});

test('tree export supports formula labels, quantifiers, subscripts and unfinished branches', () => {
  const trace = traceFOL('∀x Human(x)');
  const latex = treeToLatex(trace.steps.at(-1).tree, true);
  assert.match(latex, /\\forall x/);
  assert.match(latex, /\\mathit\{Human\}/);
  assert.match(latex, /\\begin\{forest\}/);
  assert.match(treeToLatex(trace.steps[0].tree), /\?/);
  assert.match(treeToLatex({ label: 'x₁₂', children: [] }), /x_\{12\}/);
});
