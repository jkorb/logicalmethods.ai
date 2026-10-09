import { validateModel } from './fol-model.js';

// The explicit Domain table preserves quantification over otherwise unused objects.
export function databaseSQL(language, model, columns = {}) {
  const errors = validateModel(language, model);
  if (errors.length) throw Error(errors.join(' '));
  if (Object.keys(language.functions).length) throw Error('SQL export requires a relational language without function symbols.');
  const ident = s => `"${s.replaceAll('"', '""')}"`;
  const value = s => `'${s.replaceAll("'", "''")}'`;
  function table(name, cols, rows) {
    const names = cols.map(ident);
    const create = `CREATE TABLE ${ident(name)} (\n${cols.map(c => `  ${ident(c)} TEXT NOT NULL`).join(',\n')},\n  PRIMARY KEY (${names.join(', ')})\n);`;
    return create + (rows.length ? `\nINSERT INTO ${ident(name)} (${names.join(', ')}) VALUES\n${rows.map(row => `  (${row.map(value).join(', ')})`).join(',\n')};` : '');
  }
  const parts = [table('Domain', ['value'], model.domain.map(id => [id]))];
  for (const [name, arity] of Object.entries(language.predicates)) {
    if (name.toLowerCase() === 'domain') throw Error('Domain is reserved for the domain table.');
    if (!arity) throw Error('SQL export requires predicates with at least one argument.');
    parts.push(table(name, columns[name] || Array.from({ length: arity }, (_, i) => `arg${i + 1}`), model.predicates[name]));
  }
  const constants = language.constants.map(c => `-- ${JSON.stringify(c)} denotes ${JSON.stringify(model.constants[c])}`).join('\n');
  return parts.join('\n\n') + (constants ? '\n\n' + constants : '') + '\n';
}

export function modelSpecification(config, model) {
  return JSON.stringify({ language: config.language, objects: config.objects.map(({ symbol, ...object }) => object), columns: config.columns || {}, model }, null, 2) + '\n';
}

// Read the configured schema, not arbitrary SELECT output. Constants keep their
// denotations: SQL tables encode the domain and predicate extensions only.
export function databaseModel(db, { language, constants, columns = {} }) {
  if (Object.keys(language.functions).length) throw Error('Use a language without function symbols.');
  const ident = s => `"${s.replaceAll('"', '""')}"`;
  const schema = { Domain: ['value'], ...Object.fromEntries(Object.entries(language.predicates).map(([name, arity]) => [name, columns[name] || Array.from({ length: arity }, (_, i) => `arg${i + 1}`)])) };
  const names = db.exec("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")[0]?.values.flat() || [];
  const explicitDomain = names.includes('Domain');
  if (!explicitDomain) delete schema.Domain;
  if (JSON.stringify(names.sort()) !== JSON.stringify(Object.keys(schema).sort())) throw Error(`Keep these tables: ${Object.keys(schema).join(', ')}.`);
  const rows = {};
  for (const [name, cols] of Object.entries(schema)) {
    const actual = db.exec(`PRAGMA table_info(${ident(name)})`)[0]?.values.map(row => row[1]);
    if (JSON.stringify(actual) !== JSON.stringify(cols)) throw Error(`${name} needs the columns ${cols.join(', ')} in that order.`);
    const limit = name === 'Domain' ? 32 : 1000;
    rows[name] = db.exec(`SELECT * FROM ${ident(name)} LIMIT ${limit + 1}`)[0]?.values || [];
    if (rows[name].length > limit) throw Error(`This canvas supports at most ${limit} rows in ${name}.`);
    if (rows[name].some(row => row.some(value => typeof value !== 'string'))) throw Error(`${name} must contain text identifiers, without NULLs.`);
    if (new Set(rows[name].map(JSON.stringify)).size !== rows[name].length) throw Error(`${name} contains duplicate rows; an extension is a set.`);
  }
  const domain = explicitDomain ? rows.Domain.flat() : [...new Set(Object.values(rows).flat(2))];
  if (!domain.length) throw Error('The domain is empty. Provide at least one object in Domain(value).');
  const model = { domain, constants, functions: {}, predicates: Object.fromEntries(Object.keys(language.predicates).map(name => [name, rows[name]])) };
  for (const [name, tuples] of Object.entries(model.predicates)) {
    if (tuples.some(row => row.some(value => !model.domain.includes(value)))) throw Error(`Every entry in ${name} must also occur in Domain.`);
  }
  for (const name of language.constants) if (!domain.includes(constants[name])) throw Error(`The denotation of ${name} is absent from the domain. Include it in a relation or in Domain(value).`);
  const errors = validateModel(language, model);
  if (errors.length) throw Error(errors.join(' '));
  return model;
}
