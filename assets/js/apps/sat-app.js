import { readProblem, truthTable, rewriteTrace, resolutionTrace, tseytinTrace, formatFormula, printFormula } from '../logic/sat.js';
import { evaluateTrace } from '../logic/boolean.js';
import { el, formula, navigation } from './boolean-ui.js';
import { enableLatexInput, convertInput } from './latex-input.js';
import { renderTree } from './tree-renderer.js';
import { mountRewriteTrace } from './rewrite-player.js';

export function mountSAT(root) {
  const input = root.querySelector('[data-input]'), work = root.querySelector('[data-work]');
  const status = root.querySelector('[role="status"]'), use = root.querySelector('[data-use]'), edit = root.querySelector('[data-edit]');
  const treeArea = root.querySelector('[data-tree]'), alternative = root.querySelector('[data-alternative]');
  const kind = root.dataset.kind;
  let target = 'CNF';
  root.querySelectorAll('button, textarea, input').forEach(n => { n.disabled = false; });
  function clear() {
    root.querySelector('[data-columns]').replaceChildren();
    root.querySelector('[data-problem]').replaceChildren();
    root.querySelector('[data-example-description]').textContent = '';
    work.replaceChildren(); treeArea.replaceChildren(); treeArea.hidden = true; alternative.hidden = true;
    root.querySelector('[data-count]').textContent = '';
    root.querySelectorAll('[data-action]').forEach(b => { b.disabled = true; });
  }
  function editing(value) {
    input.readOnly = !value; use.hidden = !value; edit.hidden = value;
    root.querySelectorAll('[data-mode]').forEach(b => { b.disabled = value; });
  }
  function start() {
    clear();
    try {
      convertInput(input);
      const problem = readProblem(input.value);
      const chosen = [...root.querySelectorAll('[data-example]')].find(b => b.dataset.example === input.value);
      root.querySelector('[data-example-description]').textContent = chosen?.dataset.description || (problem.inference ? 'Check the inference entered below.' : 'Test the formula entered below.');
      if (['truth-table','resolution'].includes(kind)) {
        const summary = root.querySelector('[data-problem]');
        if(problem.inference) {
          const inference = el('p', {'data-inference':''});
          inference.append(formula(problem.sources.slice(0,-1).join('; ') + ' ∴ ' + problem.sources.at(-1))); summary.append(inference);
        }
        const target = el('p', {}, 'SAT formula: '), expression=el('span',{'data-sat-formula':''}); expression.append(formula(printFormula(problem.conjunction))); target.append(expression); summary.append(target);
      }
      if (kind === 'truth-table') mountTable(root, problem);
      else if (kind === 'tseytin') {
        if (problem.inference || problem.trees.length !== 1) throw new Error('Enter one formula to transform.');
        mountTseytin(root, tseytinTrace(problem.trees[0]));
      }
      else if (kind === 'rewrite') {
        if (problem.inference || problem.trees.length !== 1) throw new Error('Enter one formula to rewrite.');
        const result = rewriteTrace(problem.trees[0], target);
        mountRewriteTrace(root, result.steps, result.complete ? 'The formula is now in ' + target + '.' : result.reason);
      } else mountResolution(root, problem);
      editing(false);
      root.querySelectorAll("[data-example]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.example === input.value)));
    } catch (error) { clear(); status.textContent = error.message; editing(true); }
  }
  root.querySelector('[data-input-form]').addEventListener('submit', e => { e.preventDefault(); start(); if (input.readOnly) edit.focus({ preventScroll: true }); });
  edit.addEventListener('click', () => { editing(true); clear(); status.textContent = 'Edit the input, then use the play button to begin again.'; input.focus({ preventScroll: true }); });
  enableLatexInput(input, () => { clear(); status.textContent = 'Use input to start this calculation.'; });
  root.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
    target = b.dataset.mode;
    root.querySelectorAll('[data-mode]').forEach(n => n.setAttribute('aria-pressed', String(n === b)));
    start();
  }));
  root.querySelectorAll('[data-example]').forEach(b => b.addEventListener('click', () => {
    input.value = b.dataset.example; input.dispatchEvent(new Event('input', {bubbles:true})); start();
  }));
  if(input.value.trim())start();
  else { clear();editing(true);status.textContent='Enter a formula to begin.'; }
}
function mountTable(root, problem) {
  const model = truthTable(problem), { columns, rows } = model;
  const work = root.querySelector('[data-work]'), status = root.querySelector('[role="status"]');
  const treeArea = root.querySelector('[data-tree]'), textTree = root.querySelector('[data-text-tree]');
  treeArea.hidden = false; root.querySelector('[data-alternative]').hidden = false;
  const compound = columns.filter(c => c.tree.children.length);
  const width = Math.max(1, compound.length), total = rows.length * width;
  const targetKey = printFormula(problem.conjunction);
  const targetKeys = new Set(problem.targets.map(printFormula));
  const visible = [...columns.filter(c => !c.tree.children.length || targetKeys.has(c.key) && c.key !== targetKey), {...columns.find(c => c.key === targetKey), result:true}];
  const table = el('table', { class: 'sat-table sat-table-summary' }), head = el('thead'), header = el('tr');
  table.append(el('caption', {}, 'The final column gives the value of the whole formula. A 1 marks a satisfying valuation.'));
  header.append(el('th', { scope:'col' }, 'Row'));
  visible.forEach((c,i) => {
    const th = el('th', {scope:'col', ...(i===problem.names.length ? {class:'sat-formula-boundary'} : {})});
    th.append(formula(formatFormula(c.tree)));
    if(c.result) th.classList.add('sat-result-column');
    header.append(th);
  });
  const legend = root.querySelector('[data-columns]');
  legend.replaceChildren();
  head.append(header); table.append(head);
  const body = el('tbody'), elements = [], buttons = [];
  rows.forEach((row, i) => {
    const tr = el('tr'), th = el('th', { scope: 'row' });
    const button = el('button', { type: 'button', 'aria-label': 'Calculate row ' + i, 'aria-pressed': 'false' }, String(i));
    th.append(button); tr.append(th);
    const cells = visible.map((cell, c) => { const td = el('td', { 'data-cell': i + ':' + cell.key, ...(c === problem.names.length ? {class:'sat-formula-boundary'} : {}) }); tr.append(td); return td; });
    body.append(tr); elements.push({ tr, cells }); buttons.push(button);
  });
  table.append(body); work.replaceChildren(table);
  let selected = 0;
  const controller = navigation(root, total + 2, index => {
    const done = index === total + 1;
    if(problem.inference) root.querySelector('[data-inference]').replaceChildren(formula(problem.sources.slice(0,-1).join('; ') + ' ' + (done ? model.satisfiable ? '⊭' : '⊨' : '∴') + ' ' + problem.sources.at(-1)));
    const position = Math.max(0, index - 1);
    selected = Math.min(rows.length - 1, Math.floor(position / width));
    const currentColumn = (done ? compound.at(-1) : compound[position % width]) || columns.at(-1);
    function highlight(t) {
      const span=el('span');
      if(index && !done && printFormula(t)===currentColumn.key) span.className='sat-current-formula';
      if(!t.children.length) span.textContent=t.label;
      else if(t.label==='¬') span.append(document.createTextNode('¬'),highlight(t.children[0]));
      else span.append(document.createTextNode('('),highlight(t.children[0]),document.createTextNode(' '+t.label+' '),highlight(t.children[1]),document.createTextNode(')'));
      return span;
    }
    const expression=root.querySelector('[data-sat-formula]');
    expression.classList.add('boolean-app__formula'); expression.replaceChildren(highlight(problem.conjunction));
    rows.forEach((row, r) => {
      const active = !done && r === selected;
      elements[r].tr.classList.toggle('is-current', active);
      elements[r].tr.classList.toggle('is-witness', done && row.witness);
      buttons[r].setAttribute('aria-pressed', String(active));
      visible.forEach((column, c) => {
        const cell = row.cells.find(cell => cell.key === column.key);
        const order = compound.findIndex(x => x.key === cell.key);
        const known = order < 0 || done || r * width + order < index;
        elements[r].cells[c].textContent = known ? String(cell.value) : '·';
        elements[r].cells[c].classList.toggle('is-current', index > 0 && active && cell.key === currentColumn.key);
      });
    });
    const row = rows[selected];
    const tree = structuredClone(currentColumn.tree);
    let id = 0;
    function identify(n) { n.id = ++id; n.children.forEach(identify); }
    identify(tree);
    const trace = evaluateTrace(tree, row.valuation);
    const known = new Map(index ? trace.map(s => [s.id, s.value]) : []);
    treeArea.replaceChildren(renderTree(tree, { active: index ? tree.id : undefined, compact: true, annotation: n => known.has(n.id) ? '= ' + known.get(n.id) : '' }));
    function describe(n) {
      const li = el('li', {}, printFormula(n) + (known.has(n.id) ? ' = ' + known.get(n.id) : ': not calculated'));
      if (n.children.length) { const ul = el('ul'); n.children.forEach(c => ul.append(describe(c))); li.append(ul); } return li;
    }
    const list = el('ul'); list.append(describe(tree)); textTree.replaceChildren(list);
    if (!index) status.textContent = 'Read the assigned values in the first row. Next evaluates one subformula of the SAT formula. Its value appears here; completed premises and the SAT result also appear in the table.';
    else if (done) status.textContent = problem.inference ? model.satisfiable ? 'Invalid: the marked rows have true premises and a false conclusion.' : 'Valid: there is no row with true premises and a false conclusion.' : model.satisfiable ? 'Satisfiable: the marked rows make every input formula true.' : 'Unsatisfiable: no row makes every input formula true.';
    else {
      status.replaceChildren(document.createTextNode('Row ' + selected + ': '), formula(trace.at(-1).calculation + '.'));
    }
    legend.replaceChildren();
    if(index && !done) {
      const calculation = el('div',{class:'sat-row-calculation'});
      const list=el('dl');
      compound.slice(0,position % width + 1).forEach(c=>{const dt=el('dt'),dd=el('dd');dt.append(formula(c.key));dd.textContent=String(row.cells.find(cell=>cell.key===c.key).value);list.append(dt,dd);});
      const details=el('details');details.append(el('summary',{},'Row calculations: ' + selected),list);calculation.append(details);legend.append(calculation);
    }
    if (!done) {
      const tr = elements[selected].tr;
      if (tr.offsetTop < work.scrollTop || tr.offsetTop + tr.offsetHeight > work.scrollTop + work.clientHeight) work.scrollTop = tr.offsetTop - head.offsetHeight;
    }
  });
  buttons.forEach((b, i) => b.addEventListener('click', () => { controller.go(1 + i * width); b.focus({ preventScroll: true }); }));
}
function mountResolution(root, problem) {
  const result=resolutionTrace(problem), work=root.querySelector('[data-work]'), status=root.querySelector('[role="status"]');
  const initial=result.steps.find(s=>s.initialClauses);
  const derived=result.clauses.filter(c=>c.parents);
  const side=root.querySelector('[data-columns]');
  navigation(root, derived.length + 2, index=>{
    const final=index===derived.length+1, current=index ? derived[Math.min(index-1,derived.length-1)] : null;
    const count=current?.id || initial?.count || 0;
    const clauses=result.clauses.slice(0,count);
    const fragment=document.createDocumentFragment();
    const list=el('ol',{class:'sat-clauses','aria-label':'Clauses'});
    clauses.forEach(c=>{
      const li=el('li',c.id===current?.id?{'aria-current':'step'}:{});
      li.append(formula(c.formula),el('small',{},c.parents?' — '+c.parents.join(', ')+'; pivot '+c.pivot:' — input'));
      list.append(li);
    });
    fragment.append(list); work.replaceChildren(fragment);
    if(current) work.scrollTop=work.scrollHeight;
    side.replaceChildren();
    if(current) {
      // One resolution inference stays readable even when its parents have long proofs.
      const diagram=el('div',{class:'sat-proof sat-proof-local',role:'group','aria-label':'Current resolution inference'});
      const parents=el('div',{class:'sat-proof-parents'});
      current.parents.forEach(id=>{const p=result.clauses[id-1],box=el('div',{class:'sat-proof-node'});box.append(formula(p.formula),el('small',{},' ['+id+']'));parents.append(box);});
      const conclusion=el('div',{class:'sat-proof-formula'});conclusion.append(formula(current.formula),el('small',{},' ['+current.id+']'));
      diagram.append(parents,conclusion);side.append(diagram);
    }
    const traceEnd=final?result.steps.length:current?result.steps.findIndex(s=>s.clause?.id===current.id)+1:0;
    const checked=result.steps.slice(0,traceEnd).filter(s=>s.checkedPair);
    const history=el('details',{class:'sat-pair-checks'});history.append(el('summary',{},checked.length+' clause pairs checked'),el('p',{},checked.map(s=>'('+s.checkedPair.join(', ')+')').join(' · ')||'No pair has been fully checked yet.'));side.append(history);
    if(problem.inference) root.querySelector('[data-inference]').replaceChildren(formula(problem.sources.slice(0,-1).join('; ')+' '+(final&&result.outcome!=='unknown'?result.outcome==='unsatisfiable'?'⊨':'⊭':'∴')+' '+problem.sources.at(-1)));
    if(final) {
      const answer=result.outcome==='unknown'?'Undecided.':problem.inference?result.outcome==='unsatisfiable'?'Valid.':'Invalid.':result.outcome==='unsatisfiable'?'Unsatisfiable.':'Satisfiable.';
      status.textContent=answer+' '+result.reason;
    } else if(current) status.textContent='Resolve lines '+current.parents.join(' and ')+' on '+current.pivot+'.';
    else status.textContent=initial?'Preprocessing is complete. These are the input CNF clauses. Next applies resolution.':result.reason;
  });
}

function mountTseytin(root, result) {
  const work = root.querySelector('[data-work]'), status = root.querySelector('[role="status"]');
  navigation(root, result.steps.length, index => {
    const step = result.steps[index], fragment = document.createDocumentFragment();
    const names = el('dl', {class:'sat-bindings', 'aria-label':'Subformula names'});
    step.bindings.forEach(b => { const dt = el('dt'), dd = el('dd'); dt.append(formula(b.name)); dd.append(formula(b.formula)); names.append(dt,dd); });
    const nameArea = root.querySelector('[data-columns]');
    nameArea.replaceChildren();
    if (step.bindings.length > 4) {
      const details = el('details'); details.append(el('summary', {}, step.bindings.length + ' subformula names'), names); nameArea.append(details);
    } else nameArea.append(names);
    if (!index) fragment.append(formula(step.formula));
    const clauses = el('ol', {class:'sat-clauses', 'aria-label':'Generated CNF clauses'});
    const previous = result.steps[index - 1]?.clauses.length || 0;
    step.clauses.forEach((c,i) => { const li = el('li', i >= previous ? {'aria-current':'step'} : {}); li.append(formula(c)); clauses.append(li); });
    fragment.append(clauses); work.replaceChildren(fragment);
    work.scrollTop = work.scrollHeight;
    status.textContent = step.explanation;
  });
}
