import { databaseSQL } from '../logic/fol-database-export.js';
import { highlightSQL } from './sql-code.js';
import { mountSQLRunner } from './sql-runner.js';

export function mountSQL(root, options = {}) {
  const find = s => root.querySelector(s), input = find('[data-sql-source]'), code = find('[data-sql-code]');
  let original = code.textContent;
  const config = JSON.parse(find('[data-sql-config]').textContent);
  const setup = root.dataset.empty === 'true' ? '' : (config.setup ?? databaseSQL(config.language, config.model, config.columns));
  const views = [...root.querySelectorAll('[data-sql-view]')];
  let view = views.length ? 'initialization' : 'query';
  const sources = views.length ? { initialization: original, query: find('[data-sql-query]').content.textContent } : null;
  input.value = original;
  function freeze() {
    highlightSQL(code, input.value); input.hidden = true;
    find('[data-sql-highlight]').hidden = false; find('[data-edit-sql]').hidden = false;
  }
  const runner = mountSQLRunner(find('[data-sql-runtime]'), { source: () => input.value, setup: options.setup || (() => view === 'initialization' ? '' : setup), showResults: root.dataset.output !== 'status', assessment: options.assessment, onFailure: options.onFailure, onSuccess: verdict => { freeze(); options.onSuccess?.(verdict); } });
  for (const button of views) {
    button.disabled = false;
    button.addEventListener('click', () => {
      if (view === button.dataset.sqlView) return;
      runner.clear(); view = button.dataset.sqlView;
      original = sources[view]; input.value = original; freeze();
      for (const item of views) item.setAttribute('aria-pressed', String(item === button));
      find('.sql-run-note').textContent = view === 'initialization' ? 'Each run starts with an empty database.' : 'Each run starts with the example database.';
    });
  }
  find('[data-edit-sql]').addEventListener('click', () => {
    runner.clear(); input.hidden = false; find('[data-sql-highlight]').hidden = true;
    find('[data-edit-sql]').hidden = true; input.focus();
  });
  find('[data-reset-sql]').addEventListener('click', () => { runner.clear(); input.value = original; freeze(); });
  input.addEventListener('input', () => runner.clear());
  input.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); find('[data-run-sql]').click(); } });
  find('[data-edit-sql]').disabled = find('[data-reset-sql]').disabled = false;
  root.sqlEditor = { set: source => { runner.clear(); original = source; input.value = source; freeze(); }, clear: runner.clear };
  freeze(); find('[data-app-fallback]').remove();
  return root.sqlEditor;
}
