import { assessSQL } from '../logic/sql-assessment.js';
import { executeSQL } from '../logic/sql-execution.js';
import { databaseModel } from '../logic/fol-database-export.js';

self.onmessage = async ({ data: { loader, wasm, setup, source, assessment, interpretation } }) => {
  let db;
  try {
    importScripts(loader);
    const SQL = await self.initSqlJs({ locateFile: () => wasm });
    self.postMessage({ ready: true });
    db = new SQL.Database();
    if (setup) db.run(setup);
    if (assessment?.kind === 'query') db.run('PRAGMA query_only=ON');
    const result = executeSQL(db, source);
    result.assessment = assessSQL(db, result.results, assessment);
    if (interpretation) result.model = databaseModel(db, interpretation);
    self.postMessage(result);
  } catch (error) {
    self.postMessage({ error: error.message || String(error) });
  } finally { db?.close(); }
};
