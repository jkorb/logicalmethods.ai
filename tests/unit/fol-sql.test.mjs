import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { sqlToFOL } from '../../assets/js/logic/fol-sql.js';
import { parseFOL, printFOL } from '../../assets/js/logic/fol-parser.js';
import { folToSQL, queryFOL } from '../../assets/js/logic/fol-model.js';
const { language, model, columns } = JSON.parse(readFileSync(new URL('../../data/fol/database.json', import.meta.url)));
const rows = sql => { const r = sqlToFOL(sql, language, model, columns); const q = queryFOL(r.ast, language, model, { variables: r.variables }); return r.variables.length ? q.rows : [[q.rows.length ? 1 : 0]]; };
const normalize = rows => rows.map(JSON.stringify).sort();
test('SQL projection indices use subscripts without capturing a projected variable', () => {
  const sql = "SELECT DISTINCT capital AS z1 FROM CapitalOf JOIN LocatedIn ON CapitalOf.country = LocatedIn.country WHERE continent = 'Europe';";
  const translated = sqlToFOL(sql, language, model, columns);
  assert.deepEqual(translated.variables, ['z₁']);
  assert.doesNotMatch(printFOL(translated.ast), /[xyzuvw][0-9]/);
  const answer = queryFOL(translated.ast, language, model, { variables: translated.variables });
  assert.deepEqual(normalize(answer.rows), normalize([['Amsterdam'], ['Berlin'], ['Rome']]));
  assert.throws(() => sqlToFOL('SELECT DISTINCT country AS z1, capital AS "z₁" FROM CapitalOf;', language, model, columns), /distinct aliases/);
});
test('SQL to FOL agrees with SQLite on joins, projection order, Boolean tests and alias shadowing', () => {
  const queries = [
    "SELECT DISTINCT country FROM LocatedIn WHERE continent = 'Europe';",
    "SELECT DISTINCT CapitalOf.capital FROM CapitalOf JOIN LocatedIn ON CapitalOf.country = LocatedIn.country WHERE LocatedIn.continent = 'Europe';",
    "SELECT DISTINCT c.capital AS y, c.country AS x FROM CapitalOf AS c WHERE c.country = 'Germany';",
    "SELECT DISTINCT c.country AS x, c.country AS y FROM CapitalOf AS c;",
    "SELECT DISTINCT d.value AS x FROM Domain d WHERE NOT d.value = 'Asia';",
    "SELECT DISTINCT c.country FROM CapitalOf c WHERE EXISTS (SELECT 1 FROM LocatedIn c WHERE c.continent = 'Europe');",
    "SELECT DISTINCT d.value FROM Domain d WHERE NOT EXISTS (SELECT 1 FROM LocatedIn r WHERE r.country = 'Japan' AND r.continent = d.value);",
    "SELECT DISTINCT d.value FROM Domain d WHERE EXISTS (SELECT 1 FROM Domain e);",
    ...['∀x ∃y x = y', '∃y ∀x x = y', '(LocatedIn(x, Europe) ↔ LocatedIn(y, Europe))', '(LocatedIn(x, Europe) → LocatedIn(x, Asia))', '(∃x LocatedIn(x, Asia) ∧ LocatedIn(x, Europe))', '¬∃x ¬∃y CapitalOf(x, y)'].map(s => folToSQL(parseFOL(s, { language }), language, model, columns))
  ];
  const script = `import json,sqlite3,sys\nd=json.load(sys.stdin)\nc=sqlite3.connect(':memory:')\nc.execute('CREATE TABLE Domain(value TEXT PRIMARY KEY NOT NULL)')\nc.executemany('INSERT INTO Domain VALUES (?)',[(x,) for x in d['model']['domain']])\nfor name,rs in d['model']['predicates'].items():\n cols=d['columns'][name]\n c.execute('CREATE TABLE "'+name+'" ('+', '.join('"'+k+'" TEXT NOT NULL' for k in cols)+')')\n c.executemany('INSERT INTO "'+name+'" VALUES (?,?)',rs)\nprint(json.dumps([c.execute(q).fetchall() for q in d['queries']]))`;
  const run = spawnSync('python3', ['-c', script], { encoding: 'utf8', input: JSON.stringify({ model, columns, queries }) }); assert.equal(run.status, 0, run.stderr);
  const expected = JSON.parse(run.stdout);
  queries.forEach((sql, i) => { try { assert.deepEqual(normalize(rows(sql)), normalize(expected[i]), sql); } catch (e) { e.message += ` SQL: ${sql}`; throw e; } });
});
test('formula to SQL to formula preserves answers over several different databases', () => {
  const formulas = ['LocatedIn(x, Europe)', '∃y (CapitalOf(y, x) ∧ LocatedIn(y, Europe))', '¬LocatedIn(Japan, x)', '∀x ∃y x = y', '∃x ∀y LocatedIn(x, y)'];
  for (const formula of formulas) {
    const original = parseFOL(formula, { language }); const sql = folToSQL(original, language, model, columns); const translated = sqlToFOL(sql, language, model, columns);
    for (const predicates of [model.predicates, { ...model.predicates, LocatedIn: [] }, { ...model.predicates, LocatedIn: [['Japan', 'Europe'], ['Europe', 'Europe']] }]) {
      const m = { ...model, predicates }; const expected = queryFOL(original, language, m); const actual = queryFOL(translated.ast, language, m, { variables: translated.variables });
      assert.deepEqual(normalize(actual.rows), normalize(expected.rows));
    }
  }
});
test('unsupported SQL and ambiguous columns are rejected without an approximate answer', () => {
  for (const sql of ['DROP TABLE LocatedIn;', "SELECT country FROM LocatedIn;", "SELECT DISTINCT country FROM LocatedIn JOIN CapitalOf ON LocatedIn.country = CapitalOf.country;", "SELECT DISTINCT country FROM LocatedIn WHERE continent IS NULL;", "SELECT DISTINCT country FROM LocatedIn ORDER BY country;", "SELECT DISTINCT country FROM LocatedIn WHERE continent = 'Atlantis';", "SELECT DISTINCT country FROM Missing;", "SELECT DISTINCT COUNT(country) FROM LocatedIn;"]) assert.throws(() => sqlToFOL(sql, language, model, columns), undefined, sql);
});
