import { el } from './fol-views.js';

export function mountSQLRunner(root, { source, setup = () => '', onSuccess = () => {}, onFailure = () => {}, assessment = () => null, interpretation = () => null, showResults = true }) {
  const run = root.querySelector('[data-run-sql]'), stop = root.querySelector('[data-stop-sql]');
  const status = root.querySelector('[data-sql-status]'), output = root.querySelector('[data-sql-results]');
  const outputBox = root.querySelector('[data-sql-output]');
  const title = root.closest('[data-logic-app]').getAttribute('aria-label');
  const codeBox = root.parentElement.querySelector('.fol-code');
  if (codeBox) codeBox.append(root.querySelector('.sql-run-controls'));
  let active = null, timer;
  function finish() {
    clearTimeout(timer); active?.terminate(); active = null;
    run.disabled = false; stop.hidden = true; root.removeAttribute('aria-busy');
  }
  function clear() { finish(); output.replaceChildren(); status.textContent = ''; delete status.dataset.state; outputBox.hidden = true; }
  function failure(message) { finish(); outputBox.hidden = false; status.textContent = message; status.dataset.state = 'error'; onFailure(message); }
  function render({ results, statements, assessment: verdict, model }) {
    finish(); output.replaceChildren(); status.dataset.state = 'success';
    status.textContent = results.length ? (results[0].schema ? 'Database initialized.' : `${results.length === 1 ? 'Query complete.' : `${results.length} results.`}`) : `${statements} statement${statements === 1 ? '' : 's'} completed.`;
    for (const [index, result] of (showResults ? results : []).entries()) {
      const wrap = el('div', undefined, 'sql-result-table table-scroll'); wrap.tabIndex = 0; wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', `${title}: SQL result ${index + 1}`);
      const table = el('table'), caption = el('caption', result.schema ? 'Database tables' : `Query result ${index + 1}`);
      if (!result.schema && results.length === 1) caption.className = 'visually-hidden';
      const head = el('thead'), row = el('tr');
      result.columns.forEach(name => { const th = el('th', name); th.scope = 'col'; row.append(th); }); head.append(row);
      const body = el('tbody');
      for (const values of result.values) { const tr = el('tr'); values.forEach(value => { const td = el('td', value === null ? 'NULL' : String(value)); if (value === null) td.className = 'sql-null'; tr.append(td); }); body.append(tr); }
      table.append(caption, head, body); wrap.append(table); output.append(wrap);
      if (!result.values.length) output.append(el('p', 'No rows.'));
      if (result.truncated) output.append(el('p', 'Showing the first 200 rows. Use LIMIT to request fewer rows.'));
    }
    onSuccess(verdict, model);
  }
  function execute() {
    clear();
    try {
      const sql = source(), seed = setup();
      if (!sql.trim()) throw Error('Enter an SQL statement.');
      outputBox.hidden = false;
      run.disabled = true; stop.hidden = false; root.setAttribute('aria-busy', 'true'); status.textContent = 'Loading SQLite…';
      const worker = new Worker(root.dataset.worker); active = worker;
      const deadline = (ms, message) => { clearTimeout(timer); timer = setTimeout(() => failure(message), ms); };
      deadline(30000, 'SQLite could not finish loading. Try Run again.');
      worker.onerror = () => { if (active === worker) failure('SQLite could not run. Try Run again.'); };
      worker.onmessage = ({ data }) => {
        if (active !== worker) return;
        if (data.ready) { status.textContent = 'Running…'; deadline(5000, 'Query stopped after five seconds. Try a smaller query.'); }
        else if (data.error) failure(data.error);
        else render(data);
      };
      worker.postMessage({ loader: new URL(root.dataset.loader, location.href).href, wasm: new URL(root.dataset.wasm, location.href).href, setup: seed, source: sql, assessment: assessment(), interpretation: interpretation() });
    } catch (error) { failure(error.message); }
  }
  run.addEventListener('click', execute);
  stop.addEventListener('click', () => { finish(); status.textContent = 'Stopped.'; });
  window.addEventListener('pagehide', finish);
  run.disabled = false;
  return { clear, run: execute };
}
