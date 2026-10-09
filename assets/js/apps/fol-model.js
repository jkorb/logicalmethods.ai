import {signature} from '../logic/fol-inference.js';
import { layoutGraphLabels } from './fol-graph-labels.js';
import {consequenceWalkthrough} from './fol-consequence.js';
import { renderTree } from './tree-renderer.js';
import { svg } from './boolean-ui.js';
import { mountSQLRunner } from './sql-runner.js';
import { queryDomain } from './fol-query-domain.js';
import { parseFOL, freeVariables, printFOL } from '../logic/fol-parser.js';
import { tupleKey, validateModel, evaluateFOL, queryFOL, folToSQL } from '../logic/fol-model.js';
import { explainEvaluation } from '../logic/fol-trace.js';
import { highlightSQL } from './sql-code.js';
import { sqlToFOL } from '../logic/fol-sql.js';
import { enableLatexInput, convertInput } from './latex-input.js';
import { el, modelViews } from './fol-views.js';
import { databaseSQL } from '../logic/fol-database-export.js';
import { downloadText } from './download-text.js';
export function mountFOLModel(root) {
  if(root.dataset.tool==='true'&&root.dataset.kind==='consequence')return mountConsequenceTool(root);
  const config = JSON.parse(root.querySelector('[data-fol-config]').textContent);
  const tool=root.dataset.tool==='true';
  if(tool)config.model={domain:[],constants:{},functions:Object.fromEntries(Object.keys(config.language.functions).map(n=>[n,{}])),predicates:Object.fromEntries(Object.keys(config.language.predicates).map(n=>[n,[]]))};
  const consequenceMode=root.dataset.kind==='consequence';
  let partial=consequenceMode||!!config.partial, negative={};
  const reasoning=consequenceMode?consequenceWalkthrough(config):null;
  if(consequenceMode)root.classList.add('fol-consequence-app');
  const language = config.language, objects = new Map(config.objects.map(o => [o.id, o]));
  root.dataset.objectStyle = config.objects.every(o=>o.emoji) ? 'emoji' : 'drawing';
  const databaseMode = root.dataset.kind === 'database', termMode = root.dataset.kind === 'term';
  const structureOnly = root.dataset.kind === 'model' || databaseMode;
  const query = ['query', 'sql'].includes(root.dataset.kind), sqlMode = root.dataset.kind === 'sql', editable = !consequenceMode && root.dataset.editable !== 'false';
  const find = selector => root.querySelector(selector), input = find('[data-formula]'), sqlInput = find('[data-sql-source]');
  if(tool)input.value='';
  if(consequenceMode)input.value=config.goal;
  const initialFormula = input.value;
  const display = find('[data-display]'), status = find('[data-calculation]'), answer = find('[data-answer]');
  let model = structuredClone(config.model), view = root.dataset.view, selected = [], symbol = '', assignment = {};
  let selectedRelation = null, setPredicate = Object.keys(language.predicates).find(n => language.predicates[n] === 1) || Object.keys(language.predicates)[0] || Object.keys(language.functions)[0], zoom = 1;
  if(consequenceMode&&config.depiction==='socrates')setPredicate='@together';
  let highlightSymbol = '', showExtension = true;
  const tabs = find('[data-set-predicates]');
  let result = null, index = 0, projection = null;
  let modelDetails, databaseTable = Object.keys(language.predicates)[0] || 'Domain';
  if (sqlMode || databaseMode) {
    const toolbar = find('.fol-code-tabs'), pair = el('div', undefined, 'fol-bridge'), logic = el('div', undefined, 'fol-logic-side');
    root.insertBefore(toolbar, find('.fol-correspondence'));
    root.insertBefore(pair, find('.fol-correspondence'));
    const utilities = el('div', undefined, 'fol-bridge-utilities'); utilities.append(find('[data-reset-correspondence]'), find('[data-fullscreen]')); toolbar.append(utilities);
    logic.append(find('.fol-correspondence'));
    if (sqlMode) {
      modelDetails = el('div', undefined, 'fol-query-model');
      modelDetails.append(find('.fol-walkthrough'), find('.fol-navigation'));
      modelDetails.hidden = true;

    } else logic.append(find('.fol-walkthrough'));
    pair.append(logic, find('[data-sql]'));
    if (modelDetails) pair.after(modelDetails);
  }
  const sqlRunner = sqlMode || databaseMode ? mountSQLRunner(find('[data-sql-runtime]'), {
    source: () => codeSource(),
    setup: () => databaseMode ? '' : databaseSQL(language, model, config.columns),
    interpretation: () => databaseMode ? { language, constants: model.constants, columns: config.columns } : null,
    showResults: !databaseMode,
    onSuccess: (_, imported) => {
      if (imported) {
        model = imported; selected = []; selectedRelation = null; symbol = ''; highlightSymbol = '';
        renderModel(true);
      }
      showSQL();
    }
  }) : null;
  const views = () => modelViews({ language, objects, columns: config.columns || {}, model, partial, negative, editable, choose: chooseObject, selected, markerId: `${input.id}-arrow`, removeObject, chooseRelation, selectedRelation, removeRelation, setPredicate, highlightSymbol, symbol, beginTuple, chooseSymbol: selectSymbol });
  function menu(name, open, focus = false) {
    for (const button of root.querySelectorAll('[data-menu]')) {
      const show = open && button.dataset.menu === name;
      button.setAttribute('aria-expanded', String(show)); find(`[data-panel="${button.dataset.menu}"]`).hidden = !show;
    }
    if (focus) (open ? find(`[data-panel="${name}"] button`) : find(`[data-menu="${name}"]`)).focus();
  }
  function beginTuple(name) { symbol = ''; selectSymbol(`${Object.hasOwn(language.functions,name) ? 'function' : 'predicate'}:${name}`); }
  function renderSelection() {
    const help = find('[data-edit-help]'); help.replaceChildren(); help.hidden = !symbol;
    if (!symbol) { root.querySelectorAll('[data-symbol]').forEach(b => b.setAttribute('aria-pressed', 'false')); return; }
    const [kind, name] = symbol.split(':'); const count = kind === 'constant' || kind === 'remove' ? 1 : kind === 'function' ? language.functions[name] + 1 : language.predicates[name];
    const notation = kind === 'remove' ? 'Remove' : kind === 'constant' ? `⟦${name}⟧ =` : kind === 'function' ? `⟦${name}⟧: ` : `⟦${name}⟧: `;
    help.append(el('span', kind === 'constant' ? 'Choose the denotation: ' : `Choose ${kind === 'function' && selected.length === count-1 ? 'the value' : ['the first object','the second object','the third object'][selected.length] || 'the next object'}: `), notation, ' ');
    for (let i = 0; i < count; i++) {
      if (i) help.append(kind === 'function' && i === count - 1 ? ' ↦ ' : ', ');
      help.append(selected[i] ? views().picture(selected[i], false) : el('span', '?', i === selected.length ? 'fol-next-slot' : ''));
    }
    root.querySelectorAll('[data-symbol]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.symbol === symbol)));

  }
  function renderDisplay() {
    const v = views(), help=find('[data-edit-help]'); display.replaceChildren(tabs);
    const scene = el('div', undefined, 'fol-scene'); scene.style.zoom = String(zoom); display.append(scene);
    if (view === 'domain') renderCandidateDomain(scene);
    else if (view === 'facts') scene.append(v.facts());
    else if (view === 'tables') {
      if (databaseMode) {
        const tableTabs = el('div', undefined, 'fol-table-tabs'); tableTabs.setAttribute('role', 'group'); tableTabs.setAttribute('aria-label', 'Model tables');
        for (const name of ['Domain', 'Constants', ...Object.keys(language.predicates)]) {
          const button = el('button', name); button.type = 'button'; button.setAttribute('aria-pressed', String(name === databaseTable));
          button.addEventListener('click', () => { databaseTable = name; renderDisplay(); }); tableTabs.append(button);
        }
        scene.append(tableTabs);
        if (databaseTable === 'Domain' || symbol) scene.append(v.domain());
        if (databaseTable !== 'Domain') scene.append(v.tables(new Set(databaseTable === 'Constants' ? language.constants : [databaseTable])));
      } else if (termMode && result) {
        const names = new Set(); const collect = n => { if (['function', 'constant'].includes(n.kind)) names.add(n.name); n.children?.forEach(collect); }; collect(result.ast); scene.append(v.tables(names));
      } else { if (editable || config.objects.some(o => o.image)) scene.append(v.domain()); scene.append(v.tables()); }
    }
    else if (view === 'sets') { if(symbol && (language.functions[setPredicate] || language.predicates[setPredicate] > 1)) scene.append(v.domain()); scene.append(v.sets()); }
    else scene.append(v.graph());
    if(partial){const absent=Object.entries(negative).flatMap(([name,rows])=>rows.map(row=>`${name}(${row.join(', ')})`));if(absent.length)scene.append(el('p','Known false: '+absent.join('; '),'fol-step-claim'));}
    if (!model.domain.length) scene.prepend(el('p', partial?'No objects pictured yet.':'D = ∅'));
    if(consequenceMode) {
      const note=el('p','Only known information is shown. Missing memberships and function values remain unspecified.','fol-fragment-note');
      if(config.depiction==='successor')note.append(' Different term labels may denote the same object.');
      scene.append(note);
    }
    root.querySelectorAll('button[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    tabs.hidden = view !== 'sets' || !tabs.children.length;
    for (const b of tabs.children) b.setAttribute('aria-pressed', String(b.dataset.extension === setPredicate));
    root.querySelector('[data-zoom-change=".25"]').disabled=zoom>=1; root.querySelector('[data-zoom-change="-.25"]').disabled=zoom<=.5;
    find('[data-zoom-value]').textContent = `${Math.round(zoom * 100)}%`;
    if (highlightSymbol) {
      const [kind, name] = highlightSymbol.split(':');
      scene.querySelectorAll('[data-interpretation]').forEach(n => n.classList.toggle('fol-active-interpretation', n.dataset.interpretation.split(' ').includes(highlightSymbol)));
      const ids = kind === 'constant' ? [model.constants[name]] : kind === 'predicate' && language.predicates[name] === 1 ? model.predicates[name].flat() : [];
      scene.querySelectorAll('[data-object]').forEach(n => n.classList.toggle('fol-active-denotation', ids.includes(n.dataset.object)));
    }
    display.append(help); renderExtension(scene); renderSelection(); markCurrent();
    layoutGraphLabels(scene.querySelector('.fol-graph'));
  }
  function renderCandidateDomain(scene = find('.fol-scene')) {
    if (!scene) return;
    const v = views();
    const interpretations = el('div', undefined, 'fol-query-interpretations');
    interpretations.setAttribute('role', 'group'); interpretations.setAttribute('aria-label', 'Interpretations used by the query');
    if (result) {
      const names = new Set();
      const collect = node => { if (['constant', 'function', 'predicate'].includes(node.kind)) names.add(node.name); node.children?.forEach(collect); };
      collect(result.ast); interpretations.append(v.tables(names));
    }
    scene.replaceChildren(interpretations, queryDomain({ result, index,
      picture: id => v.picture(id, false, true),
      label: id => objects.get(id)?.label || id,
      choose: next => { index = next; renderStep(); find(`[data-query-index="${next}"]`)?.focus({ preventScroll: true }); }
    }));
  }
  function markCurrent() {
    let values = result ? Object.values(result.steps[index]?.assignment || {}) : [];
    if (termMode && result) {
      const step = result.steps[index], known = new Map(result.steps.slice(0, index + 1).map(s => [s.nodeId, s.value]));
      const node = (function lookup(n) { return n.id === step.nodeId ? n : n.children.map(lookup).find(Boolean); })(result.ast);
      if (node?.kind === 'function') values = node.children.map(n => known.get(n.id));
      display.querySelectorAll('[data-object]').forEach(n => n.classList.toggle('fol-current-object', Boolean(n.closest('tbody tr > :first-child')) && values.includes(n.dataset.object)));
      return;
    }
    display.querySelectorAll('[data-object]').forEach(n => n.classList.toggle('fol-current-object', !n.closest('.fol-candidate-domain') && values.includes(n.dataset.object)));
  }
  function renderExtension(scene = find('.fol-scene')) {
    find('[data-query-result]').replaceChildren();
    scene?.querySelectorAll('.fol-in-extension').forEach(n => n.classList.remove('fol-in-extension'));
    const q = result;
    if (!query || !q?.rows || !showExtension || !scene) return;
    const rows=q.steps.slice(0,index+1).filter(step=>step.value).map(step=>step.tuple);
    find('[data-query-result]').append(el('strong',index>=q.steps.length-1?'Query answer':'Query answer so far'), views().extension(rows, q.variables, printFOL(q.ast)));
    if (view === 'domain') {
      scene.querySelectorAll('[data-query-index]').forEach(n => { const i=Number(n.dataset.queryIndex); n.classList.toggle('fol-in-extension', i<=index && q.steps[i].value); });
    } else if (q.variables.length === 1) {
      const members = new Set(rows.map(row => row[0]));
      scene.querySelectorAll('[data-object]').forEach(n => n.classList.toggle('fol-in-extension', members.has(n.dataset.object)));
    } else {
      const rowKeys = new Set(rows.map(tupleKey));
      scene.querySelectorAll('[data-relation]').forEach(n => { const r=JSON.parse(n.dataset.relation); n.classList.toggle('fol-in-extension', rowKeys.has(tupleKey(r.output ? [...r.args,r.output] : r.args))); });
    }
  }
  function invalidate(message = 'Model changed. Check again.') {
    result = null; index = 0; delete status.dataset.result; answer.replaceChildren(); status.textContent = message; renderStep(); renderExtension();
  }
  function chooseObject(d) {
    if (!editable) return;
    if (!symbol) { selected = selected.includes(d) ? [] : [d]; selectedRelation = null; renderDisplay(); return; }
    const [kind, name] = symbol.split(':'); selected.push(d);
    const needed = ['constant', 'remove'].includes(kind) ? 1 : kind === 'function' ? language.functions[name] + 1 : language.predicates[name];
    const focusId = document.activeElement?.dataset.object;
    if (selected.length === needed) {
      if (kind === 'remove') { removeObject(d); return; } else if (kind === 'constant') model.constants[name] = d;
      else if (kind === 'function') model.functions[name][tupleKey(selected.slice(0, -1))] = d;
      else {
        const rows = model.predicates[name], i = rows.findIndex(row => tupleKey(row) === tupleKey(selected));
        if (i < 0) rows.push([...selected]); else rows.splice(i, 1);
      }
      selected = []; symbol = ''; selectedRelation = null; invalidate(); renderModel();
    } else renderDisplay();
    if (focusId) [...display.querySelectorAll('[data-object]')].find(b => b.dataset.object === focusId)?.focus({ preventScroll: true });
  }
  function removeObject(d) {
    model.domain = model.domain.filter(x => x !== d);
    for (const c of language.constants) if (model.constants[c] === d) delete model.constants[c];
    for (const rows of Object.values(model.functions)) for (const [key, value] of Object.entries(rows)) if (JSON.parse(key).includes(d) || value === d) delete rows[key];
    for (const r of Object.keys(model.predicates)) model.predicates[r] = model.predicates[r].filter(row => !row.includes(d));
    assignment = {}; selected = []; symbol = ''; selectedRelation = null; invalidate(); renderModel(); display.focus();
  }
  function chooseRelation(relation) { selectedRelation = JSON.stringify(selectedRelation) === JSON.stringify(relation) ? null : relation; selected = []; symbol = ''; renderDisplay(); }
  function removeRelation(relation) {
    if (language.constants.includes(relation.name)) delete model.constants[relation.name];
    else if (Object.hasOwn(language.functions, relation.name)) delete model.functions[relation.name][tupleKey(relation.args)];
    else model.predicates[relation.name] = model.predicates[relation.name].filter(row => tupleKey(row) !== tupleKey(relation.args));
    selectedRelation = null; invalidate(); renderModel(); display.focus();
  }
  function selectSymbol(value) {
    symbol = symbol === value ? '' : value; highlightSymbol = symbol; selectedRelation = null; selected = [];
    const [kind, name] = value.split(':'); if (databaseMode && view === 'tables') databaseTable = kind === 'constant' ? 'Constants' : name; if (kind !== 'constant' && view === 'sets') setPredicate = name;
    menu('model', false); find('[data-context]').hidden = true;
    renderDisplay();
    display.focus({ preventScroll: true });
  }
  function renderModel(keepSQL = false) {
    const palette = find('[data-palette]'); palette.replaceChildren();
    for (const object of config.objects) {
      const b = el('button'); b.type = 'button'; b.append(views().picture(object.id, false), el('span', '+', 'fol-add-mark')); b.setAttribute('aria-label', `Add ${object.label}`); b.title = `Add ${object.label}`; b.disabled = model.domain.includes(object.id);
      b.addEventListener('click', () => { model.domain.push(object.id); selected = []; symbol = ''; selectedRelation = null; invalidate(); renderModel(); }); palette.append(b);
    }
    const errors = partial ? [] : validateModel(language, model);
    find('[data-model-health]').textContent = partial ? 'Partial information about a model' : errors.length ? `Incomplete model: ${errors.slice(0, 3).join(' ')}` : `Complete model · ${model.domain.length} objects`;
    renderDisplay();
    root.dispatchEvent(new CustomEvent('fol-model-change'));
    if (!keepSQL) sqlRunner?.clear();
    if (sqlMode || databaseMode) showSQL();
  }
  function renderAssignments(ast) {
    const container = find('[data-assignments]'); container.replaceChildren();
    for (const variable of freeVariables(ast)) {
      if (!model.domain.includes(assignment[variable])) assignment[variable] = model.domain[0];
      const field = el('div', undefined, 'fol-assignment-choices'); field.setAttribute('role', 'group'); field.setAttribute('aria-label', `Value of ${variable}`); field.append(el('span', `v(${variable}) =`));
      for (const d of model.domain) {
        const b = el('button'); b.type = 'button'; b.append(views().picture(d, false)); b.setAttribute('aria-label', `v(${variable}) = ${objects.get(d)?.label || d}`); b.setAttribute('aria-pressed', String(assignment[variable] === d));
        b.addEventListener('click', () => { assignment[variable] = d; evaluate(); }); field.append(b);
      }
      container.append(field);
    }
  }
  function renderStep() {
    const queryStep = query;
    for (const b of root.querySelectorAll('[data-step]')) b.disabled = !result || !result.steps.length || (['first', 'previous'].includes(b.dataset.step) ? index === 0 : index === result.steps.length - 1);
    find('[data-count]').textContent = result?.steps.length ? `${index + 1} / ${result.steps.length}` : '';
    if (view === 'domain') renderCandidateDomain();
    if (!result) { markCurrent(); return; }
    renderExtension();
    const step = result.steps[index], v = views(); status.replaceChildren();
    if(consequenceMode){
      model=reasoning.modelAt(result,index,objects);
      status.append(el('p',step.formula,'fol-step-claim'),el('p',step.explanation));
      if(step.result)status.dataset.result=step.result;else delete status.dataset.result;
      renderDisplay();return;
    }
    if (!step) { status.append(el('p', 'No tuple can satisfy the required positive atoms. The extension is empty.')); return; }
    if (termMode) {
      const known = new Map(result.steps.slice(0, index + 1).map(s => [s.nodeId, s.value]));
      const tree = renderTree(result.ast, { active: step.nodeId, nodeLabel: n => n.label, annotation: n => known.has(n.id) ? ' ' : '', compact: true });
      const annotated = []; const visit = n => { n.children.forEach(visit); if (known.has(n.id)) annotated.push(n); }; visit(result.ast);
      tree.querySelectorAll('.tree-valuation').forEach((label, i) => {
        const id = known.get(annotated[i].id), box = svg('foreignObject', { x: Number(label.getAttribute('x')) - 28, y: Number(label.getAttribute('y')) - 17, width: 56, height: 46 });
        box.append(v.picture(id, false, true)); label.replaceWith(box);
      });
      const canvas = el('div', undefined, 'logic-app__tree fol-term-tree'); canvas.append(tree); status.append(canvas);
      const line = el('p', undefined, 'fol-step-claim'); line.append(`⟦${step.expression}⟧ᴹᵥ = `, v.picture(step.value, false));
      status.append(line, el('p', step.kind === 'variable' ? `Read v(${step.symbol}) from the assignment.` : step.kind === 'constant' ? `Read ⟦${step.symbol}⟧ from the model.` : `Apply ⟦${step.symbol}⟧ to the argument values.`));
      markCurrent(); return;
    }
    const entries = Object.entries(step.assignment);
    if(queryStep) status.append(el('strong', `Candidate ${index+1} of ${result.steps.length}`));
    if (entries.length && !queryStep) {
      const env = el('p', undefined, 'fol-assignment'); entries.forEach(([name, d], i) => { if (i) env.append('  ·  '); env.append(`v(${name}) = `, v.picture(d, false)); }); status.append(env);
    }
    if (queryStep) {
      const candidate=el('p',undefined,'fol-candidate');candidate.append(`Values for ${result.variables.join(', ')}: `, v.tuple(step.tuple,step.tuple.length===1));status.append(candidate);
      status.append(el('p', `${printFOL(result.ast)} is ${step.value ? 'true' : 'false'} at these values.`));
      const checked = explainEvaluation(result.ast, evaluateFOL(result.ast, language, model, step.assignment));
      const final = checked.steps.at(-1);
      if (result.ast.kind === 'quantifier') status.append(el('p', result.ast.name === '∃' ? (final.value ? 'A matching value exists for the quantified variable.' : 'No value of the quantified variable makes the condition true.') : (final.value ? 'Every value of the quantified variable makes the condition true.' : 'A value of the quantified variable makes the condition false.')));
      else appendDetails(final.details, status);
      status.append(el('strong', step.value ? 'Keep this tuple.' : 'Discard this tuple.'));
      if(result.ast.kind === 'quantifier') { const detail=el('details');detail.append(el('summary','Why this tuple?'));for(const part of checked.steps){const line=el('div');for(const [name,id] of Object.entries(part.assignment))line.append(`v(${name}) = `,v.picture(id,false),' ');appendDetails(part.details,line);if(part.summary)line.append(el('p',part.value?'The quantified condition holds.':'The quantified condition fails.'));detail.append(line);}status.append(detail); }
    } else {
      status.append(el('p', `${step.expression} is ${step.value ? 'true' : 'false'}${entries.length ? ' for this assignment' : ' in this model'}.`, 'fol-step-claim'));
      if (step.summary && step.node.kind !== 'quantifier') status.append(el('p', 'Evaluation complete; the detailed explanation reached its display limit.'));
      else if (step.summary) {
        const quantifier = step.node.name;
        status.append(el('p', quantifier === '∀' ? (step.value ? 'Every object satisfies the scope, so the universal claim is true.' : 'An object fails the scope, so the universal claim is false.') : (step.value ? 'An object satisfies the scope, so the existential claim is true.' : 'No object satisfies the scope, so the existential claim is false.')));
      } else appendDetails(step.details, status);
    }
    markCurrent();
    answer.replaceChildren();
    if (!queryStep && index === result.steps.length - 1) { const verdict = el('p', `${result.value ? 'True' : 'False'} in this model${freeVariables(result.ast).length ? ' under this assignment' : ''}.`, 'fol-verdict'); verdict.dataset.value = String(result.value); answer.append(verdict); }
  }
  function appendDetails(details, container) {
    const v = views();
    function term(n, env) {
      if (n.kind === 'variable') return env[n.name];
      if (n.kind === 'constant') return model.constants[n.name];
      return model.functions[n.name][tupleKey(n.children.map(c => term(c, env)))];
    }
    for (const d of (details || []).slice(-10)) {
      const n = d.node; if (!n) continue;
      const line = el('p');
      if (n.kind === 'predicate') {
        const row = n.children.map(c => term(c, d.assignment));
        if (row.length > 1) line.append('[');
        row.forEach((id,i) => { if (i) line.append(', '); line.append(v.picture(id, false)); });
        if (row.length > 1) line.append(']');
        line.append(` ${d.value ? '∈' : '∉'} ⟦${n.name}⟧. So ${d.expression} is ${d.value ? 'true' : 'false'}.`);
      } else if (n.kind === 'connective') {
        const explanations = {'→': d.value ? 'The conditional passes: its antecedent is false or its consequent is true.' : 'The conditional fails: its antecedent is true and its consequent is false.', '∧': d.value ? 'Both conjuncts are true.' : 'At least one conjunct is false.', '∨': d.value ? 'At least one disjunct is true.' : 'Both disjuncts are false.', '¬': `Negation reverses the truth-value: ${d.expression} is ${d.value ? 'true' : 'false'}.`, '↔': d.value ? 'Both sides have the same truth-value.' : 'The two sides have different truth-values.'};
        line.append(explanations[n.name]);
      } else if (n.kind === 'identity') line.append(`The terms denote ${d.value ? 'the same object' : 'different objects'}.`);
      else if (n.kind === 'function') line.append(`${d.expression} denotes `, v.picture(d.value,false), '.');
      else if (n.kind === 'quantifier') line.append(`${d.expression} is ${d.value ? 'true' : 'false'} for the enclosing assignment.`);
      container.append(line);
    }
  }
  function freezeFormula(frozen = true, focus = false) {
    input.readOnly = frozen; find('[data-edit-formula]').setAttribute('aria-pressed', String(!frozen));
    find('[data-edit-formula]').hidden = !frozen;
    if (focus) input.focus();
    input.style.height = 'auto'; input.style.height = `${input.scrollHeight + 2}px`;
  }
  function codeSource() { return sqlInput.value; }
  function showSQL(edit = false) {
    find('[data-sql]').hidden = false;
    find('[data-sql-runtime]').hidden = false;
    sqlInput.hidden = !edit; find('[data-sql-highlight]').hidden = edit;
    find('[data-edit-sql]').setAttribute('aria-label', edit ? 'View SQL' : 'Edit SQL');
    highlightSQL(find('[data-sql-code]'), codeSource());
    if (edit) sqlInput.focus();
  }
  function evaluate() {
    try {
      convertInput(input);
      if(consequenceMode){result=reasoning.run(input.value);index=0;freezeFormula();renderStep();return result.ast;}
      const ast = parseFOL(input.value, { mode: 'conventional', language, kind: termMode ? 'term' : 'formula' });
      if (query) result = { ...queryFOL(ast, language, model, { prune: true, ...(projection ? { variables: projection } : {}) }), ast };
      else {
        renderAssignments(ast);
        const evaluated = evaluateFOL(ast, language, model, assignment);
        result = termMode ? { ...evaluated, ast } : explainEvaluation(ast, evaluated);
      }
      index = 0; freezeFormula(); renderStep(); renderDisplay(); return ast;
    } catch (error) { invalidate(error.message); return null; }
  }
  for (const [kind, names] of [['constant', language.constants], ['function', Object.keys(language.functions)], ['predicate', Object.keys(language.predicates)]]) {
    if (!names.length) continue;
    const section = el('details', undefined, 'fol-component'); section.open = true; section.append(el('summary', {constant:'Constants',function:'Function terms',predicate:'Predicates'}[kind]));
    const group = el('div', undefined, 'fol-symbols'); section.append(group); group.setAttribute('role', 'group'); group.setAttribute('aria-label', `${kind} symbols`);
    for (const name of names) {
      const arity = kind === 'function' ? language.functions[name] : language.predicates[name];
      const b = el(editable ? 'button' : 'span', `⟦${name}⟧${kind === 'constant' ? '' : `(${['x', 'y', 'z'].slice(0, arity).join(', ')})`}`);
      if (editable) { b.type = 'button'; b.dataset.symbol = `${kind}:${name}`; b.setAttribute('aria-label', `Interpret ${name}`); b.addEventListener('click', () => selectSymbol(b.dataset.symbol)); }
      group.append(b);
    }
    find(editable ? '[data-symbols]' : '[data-language-summary]').append(section);
  }
  find('[data-edit-formula]').addEventListener('click', () => { freezeFormula(false, true); invalidate('Edit the formula, then run the query or check it again.'); });
  find('[data-edit-sql]').addEventListener('click', () => { sqlRunner?.clear(); showSQL(sqlInput.hidden); });
  find('[data-download-code]').addEventListener('click', () => {
    try { downloadText(databaseMode ? 'database.sql' : 'query.sql', codeSource()); }
    catch (error) { invalidate(error.message); find('[data-code-notice]').textContent = error.message; }
  });
  find('[data-copy-code]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(codeSource());
      find('[data-code-notice]').textContent = databaseMode ? 'Copied database setup.' : 'Copied query.';
    }
    catch { find('[data-code-notice]').textContent = 'Copy unavailable. Use Download code.'; }
  });
  const unaryNames=Object.keys(language.predicates).filter(n=>language.predicates[n]===1);
  for (const name of ['@domain', ...(unaryNames.length===2 ? ['@together'] : []), ...Object.keys(language.functions), ...Object.keys(language.predicates)]) {
    const b = el('button', name==='@domain' ? 'D' : name==='@together' ? 'Together' : `⟦${name}⟧`); b.type='button'; b.dataset.extension=name; b.setAttribute('aria-pressed', String(name === setPredicate));
    b.addEventListener('click', () => { setPredicate = name; for(const n of find('[data-set-predicates]').children) n.setAttribute('aria-pressed', String(n === b)); renderDisplay(); }); tabs.append(b);
  }
  root.querySelectorAll('[data-zoom-change]').forEach(b => b.addEventListener('click', () => { zoom = Math.max(.5, Math.min(1, zoom + Number(b.dataset.zoomChange))); renderDisplay(); }));
  const context = find('[data-context]');
  function openContext(event) {
    const target = event.target.closest('[data-object]'), tuple = event.target.closest('[data-relation]');
    if (!editable || (!target && !tuple)) return;
    if (tuple) {
      event.preventDefault(); const relation=JSON.parse(tuple.dataset.relation); selectedRelation=relation; selected=[]; symbol=''; renderDisplay(); context.replaceChildren();
      const remove=el('button',language.constants.includes(relation.name)?`Clear ${relation.name} denotation`:`Delete ${relation.name} tuple`); remove.type='button'; remove.addEventListener('click',()=>{context.hidden=true;removeRelation(relation);}); context.append(remove); context.hidden=false; remove.focus(); return;
    }
    event.preventDefault(); selected = [target.dataset.object]; selectedRelation = null; symbol = ''; renderDisplay(); context.replaceChildren();
    const modify = el('button','Modify'); modify.type='button'; modify.addEventListener('click', () => { context.hidden=true; menu('model',true,true); });
    const remove = el('button','Delete object'); remove.type='button'; remove.addEventListener('click', () => { context.hidden=true; removeObject(selected[0]); }); context.append(modify); if(target.dataset.domainDelete!=='false')context.append(remove);
    for(const [name,arity] of Object.entries(language.predicates)) if(arity===1) { const b=el('button',`${model.predicates[name].some(row=>row[0]===selected[0])?'Remove from':'Add to'} ${name}`); b.type='button'; b.addEventListener('click',()=>{ const id=selected[0]; selectSymbol(`predicate:${name}`); chooseObject(id); }); context.append(b); }
    context.hidden=false; modify.focus();
  }
  display.addEventListener('contextmenu',openContext);
  display.addEventListener('keydown',event=>{if(event.key==='ContextMenu'||event.shiftKey&&event.key==='F10')openContext(event);});
  root.addEventListener('keydown',event=>{if(event.key==='Escape'&&!context.hidden){context.hidden=true;display.focus();} });
  root.addEventListener('pointerdown',event=>{if(!context.contains(event.target))context.hidden=true;});
  root.querySelectorAll('[data-menu]').forEach(b => b.addEventListener('click', () => menu(b.dataset.menu, b.getAttribute('aria-expanded') !== 'true')));
  root.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => menu(b.dataset.close, false, true)));
  root.addEventListener('keydown', event => { if (event.key === 'Escape') { const open = [...root.querySelectorAll('[data-menu]')].find(b => b.getAttribute('aria-expanded') === 'true'); if (open) { event.preventDefault(); menu(open.dataset.menu, false, true); } } });
  root.querySelectorAll('button[data-view]').forEach(b => b.addEventListener('click', () => { view = b.dataset.view; menu('view', false); renderDisplay(); find('[data-menu="view"]').focus(); }));
  root.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => { index = b.dataset.step === 'first' ? 0 : b.dataset.step === 'last' ? result.steps.length - 1 : index + (b.dataset.step === 'next' ? 1 : -1); renderStep(); }));
  find('[data-reset]').addEventListener('click', () => { model = structuredClone(config.model); selected = []; selectedRelation = null; symbol = ''; highlightSymbol = ''; assignment = {}; zoom = 1; invalidate('Model reset.'); renderModel(); });
  find('[data-evaluate]').addEventListener('submit', event => { event.preventDefault(); if (modelDetails) modelDetails.hidden = false; evaluate(); });
  enableLatexInput(input, () => { assignment = {}; projection = null; find('[data-assignments]').replaceChildren(); invalidate('Formula edited. Check again.'); });
  for (const { label, formula } of query && !tool ? config.queries || [] : []) {
    const b = el('button', label); b.type = 'button'; b.addEventListener('click', () => { input.value = formula; projection = null; const ast = evaluate(); if (sqlMode && ast) { sqlRunner?.clear(); sqlInput.value = folToSQL(ast, language, model, config.columns); showSQL(); } }); find('[data-examples]').append(b);
  }
  find('[data-to-sql]').addEventListener('click', () => {
    try {
      sqlRunner?.clear();
      find('[data-code-notice]').textContent = '';
      if (databaseMode) sqlInput.value = databaseSQL(language, model, config.columns);
      else {
        const ast = parseFOL(input.value, { mode: 'conventional', language });
        sqlInput.value = folToSQL(ast, language, model, config.columns); projection = null; evaluate();
      }
      showSQL();
    } catch (error) { find('[data-code-notice]').textContent = error.message; }
  });
  find('[data-from-sql]').addEventListener('click', () => {
    find('[data-code-notice]').textContent = '';
    if (databaseMode) { sqlRunner.run(); return; }
    try {
      const translated = sqlToFOL(sqlInput.value, language, model, config.columns);
      input.value = translated.formula; projection = translated.variables;
      modelDetails.hidden = false; evaluate(); showSQL();
    } catch (error) { invalidate(error.message); find('[data-code-notice]').textContent = error.message; }
  });
  sqlInput.addEventListener('input', () => { sqlRunner?.clear(); find('[data-code-notice]').textContent = ''; if (!databaseMode) invalidate('SQL edited. Translate to calculate its answer.'); });
  find('[data-editor]').hidden = !editable; find('[data-sql]').hidden = !(sqlMode || databaseMode);
  if (databaseMode && !tool) sqlInput.value = databaseSQL(language, model, config.columns);
  if(consequenceMode){
    input.setAttribute('aria-label','Conclusion');find('[data-edit-formula]').setAttribute('aria-label','Edit conclusion');
    const check=find('[data-evaluate] button[type="submit"]');check.setAttribute('aria-label','Check consequence');check.title='Check consequence';
    const given=el('div',undefined,'fol-given');given.setAttribute('role','group');given.setAttribute('aria-label','Given information');given.append(el('span','Given:'));
    for(const premise of config.premises){const b=el('button',premise);b.type='button';b.setAttribute('aria-label','Use premise '+premise);b.setAttribute('aria-pressed','true');b.onclick=()=>{reasoning.toggle(premise);b.setAttribute('aria-pressed',String(reasoning.selected.has(premise)));evaluate();};given.append(b);}
    find('.fol-correspondence').prepend(given);
  }
  root.querySelectorAll('button, textarea').forEach(n => { n.disabled = false; }); renderModel(); const ast = structureOnly || tool ? null : evaluate();
  if(tool){freezeFormula(false);invalidate(structureOnly?'Build a model using Modify.':'Build a model and enter a '+(termMode?'term':'formula')+'.');}
  if (sqlMode && ast) { sqlRunner?.clear(); sqlInput.value = folToSQL(ast, language, model, config.columns); showSQL(); }
  find('[data-reset-correspondence]').addEventListener('click', () => {
    model = structuredClone(config.model); input.value = initialFormula; freezeFormula(!tool); assignment = {}; projection = null; selected = []; selectedRelation = null; symbol = ''; highlightSymbol = ''; zoom = 1;
    invalidate(''); renderModel(); const ast = databaseMode || tool ? null : evaluate();
    if(tool)sqlInput.value='';
    else if (databaseMode) sqlInput.value = databaseSQL(language, model, config.columns);
    else if (ast) sqlInput.value = folToSQL(ast, language, model, config.columns);
    if (modelDetails) modelDetails.hidden = true;
    find('[data-code-notice]').textContent = ''; showSQL();
  });
  find('[data-show-extension]').hidden = !query;
  find('[data-show-extension]').addEventListener('click', () => { showExtension = !showExtension; find('[data-show-extension]').setAttribute('aria-pressed', String(showExtension)); renderExtension(); });
  find('[data-menu="model"]').hidden = !editable;
  find('[data-domain-menu]').open = !language.constants.length && !Object.keys(language.functions).length && !Object.keys(language.predicates).length;
  find('[data-zoom-fit]').addEventListener('click', () => { zoom=1; renderDisplay(); });
  if (termMode) { input.setAttribute('aria-label', 'Term'); find('[data-edit-formula]').setAttribute('aria-label', 'Edit term'); }
  const fullscreenRoot = root.closest('.fol-practice') || root;
  const full = find('[data-fullscreen]'); let previousOverflow = '', fullscreenDetails = null;
  function syncFullscreen() {
    const expanded = document.fullscreenElement === fullscreenRoot || fullscreenRoot.classList.contains('fol-fullscreen');
    const paired = expanded && matchMedia('(min-width:48rem)').matches;
    if (modelDetails && paired && fullscreenDetails === null) {
      fullscreenDetails = modelDetails.hidden;
      find('.fol-logic-side').append(modelDetails); modelDetails.hidden = false;
    } else if (modelDetails && !paired && fullscreenDetails !== null) {
      find('.fol-bridge').after(modelDetails); modelDetails.hidden = fullscreenDetails; fullscreenDetails = null;
    }
    full.setAttribute('aria-pressed', String(expanded)); full.setAttribute('aria-label', expanded ? 'Exit fullscreen' : 'Fullscreen'); full.title = expanded ? 'Exit fullscreen (Esc)' : 'Fullscreen (F)'; }
  function fallbackFullscreen(on) { fullscreenRoot.classList.toggle('fol-fullscreen', on); if(on) { previousOverflow=document.body.style.overflow; document.body.style.overflow='hidden'; fullscreenRoot.focus(); } else { document.body.style.overflow=previousOverflow; full.focus(); } syncFullscreen(); }
  async function toggleFullscreen() { try { if(document.fullscreenElement === fullscreenRoot) await document.exitFullscreen(); else if(fullscreenRoot.classList.contains('fol-fullscreen')) fallbackFullscreen(false); else if(fullscreenRoot.requestFullscreen) await fullscreenRoot.requestFullscreen(); else fallbackFullscreen(true); } catch { fallbackFullscreen(!fullscreenRoot.classList.contains('fol-fullscreen')); } syncFullscreen(); }
  full.addEventListener('click', toggleFullscreen); document.addEventListener('fullscreenchange', syncFullscreen); window.addEventListener('resize', syncFullscreen); fullscreenRoot.tabIndex=0;
  fullscreenRoot.addEventListener('keydown', e => {
    if(e.key.toLowerCase()==='f'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.target.closest('input,textarea,[contenteditable]')) { e.preventDefault(); toggleFullscreen(); }
    if(e.key==='Escape') { if(fullscreenRoot.classList.contains('fol-fullscreen')) fallbackFullscreen(false); symbol=''; highlightSymbol=''; selected=[]; renderDisplay(); }
    if(e.key==='Tab'&&fullscreenRoot.classList.contains('fol-fullscreen')) { const stops=[...fullscreenRoot.querySelectorAll('button,textarea,[tabindex="0"],summary')].filter(n=>!n.disabled&&n.getClientRects().length); const first=stops[0],last=stops.at(-1); if(e.shiftKey&&(document.activeElement===first||document.activeElement===fullscreenRoot)){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();} }
  });
  root.folModel = {
    config,
    get: () => structuredClone(model),
    set: (value, options = {}) => { if(options.partial !== undefined)partial=options.partial; negative=options.negative||{}; model = structuredClone(value); selected = []; selectedRelation = null; symbol = ''; highlightSymbol = ''; invalidate(''); renderModel(); },
  };
  if (sqlMode || databaseMode) showSQL();
  document.fonts.ready.then(() => layoutGraphLabels(find('.fol-graph')));
  find('[data-app-fallback]')?.remove();
}


function mountConsequenceTool(root) {
  const template=root.cloneNode(true);
  const form=el('form'), field=el('textarea'), submit=el('button','Check consequence');
  field.className='logic-app__input';field.rows=3;field.maxLength=4608;
  field.setAttribute('aria-label','Premises and conclusion');field.spellcheck=false;
  field.placeholder='Premises separated by semicolons; ∴ before the conclusion';
  submit.type='submit';form.append(field,submit);
  const status=el('p','Enter premises and a conclusion.');status.setAttribute('role','status');
  const workspace=el('div');root.className='logic-app fol-tool';root.replaceChildren(form,status,workspace);
  enableLatexInput(field,()=>{workspace.replaceChildren();status.textContent='Check the edited inference again.';});
  form.addEventListener('submit',event=>{
    event.preventDefault();workspace.replaceChildren();
    try {
      convertInput(field);
      const parts=field.value.split(/∴|⊨|\|-|\|=/u);
      if(parts.length!==2||!parts[1].trim())throw Error('Separate premises with semicolons and put ∴ before the conclusion.');
      const premises=parts[0].split(/[;\n]/u).map(s=>s.trim()).filter(Boolean),goal=parts[1].trim();
      const language=signature(field.value);
      const config={language,objects:[],model:{domain:[],constants:{},functions:{},predicates:{}},premises,goal};
      // Validate the problem before mounting its model and walkthrough controls.
      consequenceWalkthrough(config).run(goal);
      const canvas=template.cloneNode(true);canvas.dataset.tool='false';
      canvas.querySelector('[data-fol-config]').textContent=JSON.stringify(config);
      workspace.append(canvas);mountFOLModel(canvas);canvas.dataset.mounted='true';status.textContent='';
    }catch(error){status.textContent=error.message;}
  });
}
