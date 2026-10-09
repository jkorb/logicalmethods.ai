import { parseFOL, freeVariables } from '../logic/fol-parser.js';
import { queryFOL, tuples } from '../logic/fol-model.js';
import { modelViews, el } from './fol-views.js';
import { levels } from './fol-levels.js';

export const extensionLevels = [
  'Loves(x, soccer) ∧ IsFrom(x, ny)',
  'IsFrom(x, y) ∧ ParentOf(x, sir)',
  '∃y (ParentOf(y, x) ∧ ∃z ParentOf(z, y))',
  'IsFrom(x, y) ∧ LivesIn(x, y)',
  '¬∃y ParentOf(y, x)',
  'x ≠ y ∧ ∃z (ParentOf(z, x) ∧ ParentOf(z, y))'
];

export function mountExtensions(root) {
  const config=JSON.parse(root.querySelector('[data-extension-config]').textContent);
  const objects=new Map(config.objects.map(o=>[o.id,o]));
  const views=modelViews({...config,objects,editable:false,selected:[]});
  const workspace=root.querySelector('[data-extension-workspace]');
  let answer, chosen=new Set();
  const progress=levels(root,extensionLevels,formula=>{
    chosen=new Set();
    const ast=parseFOL(formula,{language:config.language,mode:'conventional'}), vars=freeVariables(ast);
    answer=new Set(queryFOL(ast,config.language,config.model).rows.map(JSON.stringify));
    const task=root.querySelector('[data-task]'); task.replaceChildren(el('span',formula,'fol-formula'));
    task.append(el('small',`Select every member of the extension, in the order ${vars.join(', ')}. Leave all unselected for ∅.`));
    const names=new Set(); const visit=n=>{if(['predicate','constant'].includes(n.kind))names.add(n.name);n.children.forEach(visit);};visit(ast);
    const model=el('div',undefined,'fol-extension-model');model.append(views.tables(names));
    const candidates=el('div',undefined,'fol-extension-candidates'),grid=el('div',undefined,'fol-candidate-grid');
    grid.setAttribute('role','group');grid.setAttribute('aria-label','Select the extension');
    grid.style.setProperty('--candidate-width','3rem');
    candidates.append(el('p',vars.length===1?'D':`D × D · rows ${vars[0]}, columns ${vars[1]}`,'fol-domain-power'));
    function choice(tuple, matrix=false) {
      const key=JSON.stringify(tuple),b=el('button',undefined,'fol-domain-candidate');
      b.type='button';b.dataset.tuple=key;b.setAttribute('aria-pressed','false');
      b.setAttribute('aria-label',tuple.map(d=>objects.get(d)?.label||d).join(', '));
      if(matrix)b.textContent='○';else b.append(views.tuple(tuple,true));
      b.addEventListener('click',()=>{if(chosen.has(key))chosen.delete(key);else chosen.add(key);b.setAttribute('aria-pressed',String(chosen.has(key)));if(matrix)b.textContent=chosen.has(key)?'✓':'○';progress.clear();});
      return b;
    }
    if(vars.length===2) {
      const table=el('table',undefined,'fol-extension-matrix'),head=el('thead'),headers=el('tr'),body=el('tbody');
      table.setAttribute('aria-label',`Select ordered pairs: rows ${vars[0]}, columns ${vars[1]}`);
      headers.append(el('th','×'));
      for(const d of config.model.domain) {const h=el('th');h.scope='col';h.append(views.picture(d,false));headers.append(h);}
      head.append(headers);
      for(const d of config.model.domain) {
        const row=el('tr'),h=el('th');h.scope='row';h.append(views.picture(d,false));row.append(h);
        for(const e of config.model.domain) {const cell=el('td');cell.append(choice([d,e],true));row.append(cell);}
        body.append(row);
      }
      table.append(head,body);candidates.append(table);
    } else {for(const tuple of tuples(config.model.domain,vars.length))grid.append(choice(tuple));candidates.append(grid);}
    workspace.replaceChildren(model,candidates);
  });
  root.querySelector('[data-check]').addEventListener('click',()=>{
    const ok=chosen.size===answer.size&&[...chosen].every(t=>answer.has(t));
    progress.feedback(ok,ok?'Correct: these are exactly the satisfying objects or tuples.':'Some members are missing or some selected tuples do not satisfy the formula.');
  });
  progress.start();root.querySelector('[data-app-fallback]')?.remove();
}

// Gap answers are parsed as text, never executed as student-supplied code.
export const substitutionGaps = [
  ['replacement term', 't'],
  ['unchanged constant', 'E'],
  ['recursive call', 'substitute(child, x, t)'],
  ['bound variable', 'x'],
  ['irrelevant variable', 'x'],
  ['capture test', 'free_variables(t)'],
  ['renamed scope', 'rename_free(B, y, z)'],
  ['new binder', 'z'],
  ['substituted scope', 'substitute(B, x, t)']
];
const code = `substitute(E, x, t):
    if is_variable(E):
        return § if E == x else E
    if is_constant(E):
        return §
    if is_application(E) or is_connective(E):
        return rebuild(E, [§
                           for child in children(E)])
    # E is a quantified formula Qy B
    Q, y, B = quantifier(E), binder(E), scope(E)
    if y == § or § not in free_variables(B):
        return E
    if y in §:
        z = fresh_variable(E, t, x)
        B = §
        y = §
    return quantify(Q, y, §)`;

export function mountSubstitution(root) {
  root.querySelector('[data-levels]').hidden=true;
  const progress=levels(root,[null],()=>{});
  root.querySelector('[data-task]').textContent='Complete the recursive algorithm. Use the helper names given above.';
  const container=root.querySelector('[data-gap-code]'),parts=code.split('§'),inputs=[];
  parts.forEach((part,i)=>{
    container.append(document.createTextNode(part));
    if(i>=substitutionGaps.length)return;
    const [label,answer]=substitutionGaps[i],input=el('input');
    input.type='text';input.autocomplete='off';input.spellcheck=false;input.maxLength=80;
    input.size=Math.max(3,answer.length);input.setAttribute('aria-label',label);
    input.addEventListener('input',()=>{input.removeAttribute('aria-invalid');progress.clear();});
    container.append(input);inputs.push(input);
  });
  root.querySelector('[data-check]').addEventListener('click',()=>{
    let correct=true;
    inputs.forEach((input,i)=>{
      const normalized=input.value.replace(/\s+/g,'');
      const ok=normalized===substitutionGaps[i][1].replace(/\s+/g,'');
      input.setAttribute('aria-invalid',String(!ok));correct&&=ok;
    });
    progress.feedback(correct,correct?'Correct. The quantifier clause protects bound occurrences and renames a binder when it would capture a variable of t.':'Check the marked gaps. Follow the immediate children, and check whether the binder would capture a free variable of t.');
  });
  progress.start();root.querySelector('[data-app-fallback]')?.remove();
}
