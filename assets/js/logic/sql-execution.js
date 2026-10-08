// Keep result messages and DOM tables bounded; execution itself lives in a worker.
export function executeSQL(db, source) {
  if (!source.trim()) throw Error('Enter an SQL statement.');
  if (source.length > 100000) throw Error('Keep the SQL script under 100,000 characters.');
  const results = [];
  let statements = 0;
  for (const statement of db.iterateStatements(source)) {
    statements++;
    const columns = statement.getColumnNames();
    if (columns.length > 40) throw Error('Display at most 40 columns per result.');
    const values = [];
    let truncated = false;
    while (statement.step()) {
      if (values.length === 200) { truncated = true; break; }
      values.push(statement.get().map(value => value instanceof Uint8Array ? `[${value.length} bytes]` : typeof value === 'string' && value.length > 2000 ? value.slice(0, 2000) + '…' : value));
    }
    if (columns.length) {
      if (results.length === 8) throw Error('Display at most eight query results per run.');
      results.push({ columns, values, truncated });
    }
  }
  // Initialization scripts have no SELECT result; show the tables they created.
  if (!results.length) {
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name LIMIT 40")[0]?.values || [];
    if (tables.length) results.push({ columns: ['Table', 'Rows'], values: tables.map(([name]) => [name, db.exec(`SELECT COUNT(*) FROM "${name.replaceAll('"', '""')}"`)[0].values[0][0]]), schema: true });
  }
  return { results, statements };
}
