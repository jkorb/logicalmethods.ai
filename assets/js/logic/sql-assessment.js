// Compare complete, untruncated results; display limits must never award a pass.
function rowsEqual(actual, expected) {
  const encode = rows => rows.map(row => JSON.stringify(row)).sort();
  return JSON.stringify(encode(actual)) === JSON.stringify(encode(expected));
}
export function assessSQL(db, results, task) {
  if (!task) return null;
  if (task.kind === 'query') {
    const r = results.length === 1 ? results[0] : null;
    const correct = Boolean(r && !r.truncated && r.columns.length === task.columns && rowsEqual(r.values, task.rows));
    return { correct, message: correct ? 'Correct: these are exactly the tuples in the formula’s extension.' : 'Not yet. Check the columns, missing or extra rows, and duplicates. Quantifiers range over Domain.' };
  }
  const quote = x => '"' + x.replaceAll('"', '""') + '"';
  const names = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")[0]?.values.flat() || [];
  if (JSON.stringify([...names].sort()) !== JSON.stringify(task.tables.map(t=>t.name).sort())) return { correct:false, message:'Create exactly the displayed tables, with their displayed names.' };
  for (const table of task.tables) {
    const actualColumns = db.exec(`PRAGMA table_info(${quote(table.name)})`)[0]?.values.map(r=>r[1]) || [];
    if (JSON.stringify(actualColumns) !== JSON.stringify(table.columns)) return { correct:false, message:`Check the column names and order in ${table.name}.` };
    const count = db.exec(`SELECT COUNT(*) FROM ${quote(table.name)}`)[0].values[0][0];
    if (count !== table.rows.length) return { correct:false, message:`${table.name} has ${count} rows; the model has ${table.rows.length}. Check missing rows and duplicates.` };
    const rows = db.exec(`SELECT * FROM ${quote(table.name)}`)[0]?.values || [];
    if (!rowsEqual(rows, table.rows)) return { correct:false, message:`The rows of ${table.name} differ from its interpretation. Check each tuple and its column order.` };
  }
  return { correct:true, message:'Correct: the tables contain exactly the model’s domain and relations requested in this level.' };
}
