import { celebrate } from './celebrate.js';
import { renderTree } from './tree-renderer.js';
import { mountBoolean } from './boolean-app.js';
import { el, formula } from './boolean-ui.js';
import { enableLatexInput, convertInput } from './latex-input.js';
import { parseBoolean, evaluateTrace, circuitPreset, evaluateCircuit } from '../logic/boolean.js';
import { printFormula, formatFormula, valuations, readProblem } from '../logic/sat.js';
import { tableExercise, checkVariables, checkMystery, checkNormalForm, createResolutionSession, resolutionChoices, resolutionOutcome, applyResolutionChoice } from '../logic/sat-practice.js';

export function mountSATPractice(root) {
  const kind=root.dataset.kind;
  const levels=root.dataset.formula&&kind!=='mystery'?[{formula:root.dataset.formula}]:JSON.parse(root.querySelector('[data-levels]').textContent);
  const work=root.querySelector('[data-work]'), controls=root.querySelector('[data-controls]'), setup=root.querySelector('[data-setup]'), extra=root.querySelector('[data-extra]'), question=root.querySelector('[data-question]'), status=root.querySelector('[role="status"]');
  const nav=root.querySelector('[data-level-controls]'), solved=new Set();
  let level=0;
  const say=text=>{status.textContent=text;};
  function buzz(text) { say(text);root.classList.remove('is-shaking');void root.offsetWidth;root.classList.add('is-shaking'); }
  function iconButton(label,action,icon='check') {const b=el('button',{type:'button','aria-label':label});const art=root.querySelector('[data-icon="'+icon+'"]');if(art)b.append(art.content.cloneNode(true));b.append(el('span',{},label));b.addEventListener('click',action);return b;}
  const button=(label,action)=>{const b=el('button',{type:'button'},label);b.addEventListener('click',action);return b;};
  function field(label,attrs={}) {const wrap=el('label',{},label+' '), input=el('input',{...attrs,'aria-label':label});wrap.append(input);return {wrap,input};}
  function finish(text) {
    if(!solved.has(level))celebrate(root);
    solved.add(level);const b=nav.querySelector('[data-level="'+level+'"]');
    if(!b.querySelector('.practice-solved'))b.append(el('span',{class:'practice-solved','aria-label':'completed'},' ✓'));
    say(text);
  }
  function start(index) {
    level=index;[work,controls,setup,extra,question].forEach(n=>n.replaceChildren());
    nav.querySelectorAll('[data-level]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===level)));
    controls.append(iconButton('Restart',()=>start(level),'replay'));
    if(kind==='normal-form') mountNormalForm();
    else if(kind==='circuit') mountCircuitExercise();
    else if(kind==='resolution' && levels[level].inference) mountInference();
    else if(kind==='resolution') mountResolution();
    else if(kind==='mystery') mountMystery();
    else mountTable();
  }
  if(['table','gaps'].includes(kind))nav.classList.add('practice-targets');
  levels.forEach((item,i)=>{const b=button(item.label||String(i+1),()=>start(i));if(['table','gaps'].includes(kind))b.append(formula(item.formula));b.dataset.level=String(i);b.setAttribute('aria-label','Level '+(i+1));nav.append(b);});
  function tableHead(labels) {
    const table=el('table',{class:'sat-table practice-table'}), head=el('thead'), row=el('tr');
    labels.forEach(label=>{const th=el('th',{scope:'col'});th.append(formula(label));row.append(th);});head.append(row);table.append(head);return table;
  }
  function mountTable() {
    const model=tableExercise(levels[level].formula);
    if(kind==='gaps') {drawValues(model);say('Fill the gaps with 0 or 1. Select a cell to locate its subformula in the tree.');return;}
    say('Identify the variables and the number of rows.');
    const form=el('form'), names=field('Variables (comma-separated)',{maxlength:100}), rows=field('Number of rows',{type:'text',inputmode:'numeric',pattern:'[0-9]+',maxlength:2});
    const submit=iconButton('Start',()=>{},'play');submit.type='submit';
    const actions=el('div',{class:'practice-actions'});actions.append(submit,iconButton('Restart',()=>start(level),'replay'));
    controls.replaceChildren();form.append(names.wrap,rows.wrap,actions);setup.append(form);
    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(!checkVariables(model,names.input.value,rows.input.value)) {buzz('List each variable once, separated by commas. With n variables there are 2ⁿ rows.');return;}
      setup.replaceChildren();controls.append(iconButton('Restart',()=>start(level),'replay'));drawValues(model);say('Match each column to a compound node in the tree, starting with the smallest subformulas.');
    });
  }
  function drawValues(model) {
    work.replaceChildren();extra.replaceChildren();
    const table=tableHead(model.columns.map(c=>formatFormula(c.tree))), body=el('tbody'), fields=[];
    const tree=structuredClone(model.problem.conjunction), nodes=[];
    function identify(n) {n.id=nodes.length+1;nodes.push(n);n.children.forEach(identify);}identify(tree);
    const firstCompound=model.problem.names.length, matched=new Set(), headers=[...table.querySelectorAll('th')];
    let activeColumn=firstCompound, activeRow=0;
    const treeArea=el('div',{class:'logic-app__tree practice-tree'});extra.append(treeArea);
    function drawTree() {
      const active=nodes.find(n=>printFormula(n)===model.columns[activeColumn]?.key);
      treeArea.replaceChildren(renderTree(tree,{compact:true,active:kind==='gaps'||matched.has(activeColumn)?active?.id:undefined,
        annotation:n=>!n.children.length?String(model.rows[activeRow].valuation[n.label]):'',
        nodeDescription:n=>'Node '+n.id+': '+n.label,
        onSelect:n=>{
          if(kind==='table'&&matched.size<model.columns.length-firstCompound) {
            const chosen=model.columns.findIndex(c=>c.key===printFormula(n));
            const ready=n.children.length&&n.children.every(child=>{
              const c=model.columns.findIndex(c=>c.key===printFormula(child));
              return c<firstCompound||matched.has(c);
            });
            if(!ready||matched.has(chosen)) {buzz('Choose an unused compound node whose children already have columns. Work upward from the leaves.');return;}
            // Independent subformulas may be entered in either order.
            [model.columns[activeColumn],model.columns[chosen]]=[model.columns[chosen],model.columns[activeColumn]];
            model.rows.forEach(row=>{[row.cells[activeColumn],row.cells[chosen]]=[row.cells[chosen],row.cells[activeColumn]];});
            fields.forEach(f=>{f.answer=String(model.rows[f.row].cells[f.column].value);f.input.setAttribute('aria-label','Row '+(f.row+1)+': '+formatFormula(model.columns[f.column].tree));});
            matched.add(activeColumn);headers[activeColumn].replaceChildren(formula(formatFormula(n)));
            activeColumn=model.columns.findIndex((c,i)=>i>=firstCompound&&!matched.has(i));
            if(activeColumn<0) {fields.forEach(f=>f.input.disabled=false);activeColumn=firstCompound;say('Columns matched. Calculate the entries from the leaves upward.');}
            else say('Matched. Now select the subtree for column '+(activeColumn+1)+'.');
          } else {const c=model.columns.findIndex(c=>c.key===printFormula(n));if(c>=0)activeColumn=c;}
          highlight();drawTree();
          treeArea.querySelector('[data-tree-node="'+n.id+'"]')?.focus({preventScroll:true});
        }}));
    }
    function highlight() { headers.forEach((h,i)=>h.classList.toggle('is-current',i===activeColumn)); }
    headers[firstCompound]?.classList.add('sat-formula-boundary');
    if(kind==='table')headers.forEach((h,c)=>{if(c>=firstCompound)h.replaceChildren(button('Column '+(c+1),()=>{activeColumn=c;highlight();drawTree();say('Select the subtree for this column.');}));});
    model.rows.forEach((row,r)=>{
      const tr=el('tr');row.cells.forEach((cell,c)=>{
        const td=el('td'), compound=model.columns[c].tree.children.length>0;
        const editable=compound&&(kind==='table'||(r+c)%3!==0);
        if(editable) {
          const input=el('input',{type:'text',inputmode:'numeric',maxlength:1,size:1,'aria-label':'Row '+(r+1)+': '+formatFormula(model.columns[c].tree),'data-cell':r+':'+c});
          input.disabled=kind==='table';
          input.addEventListener('focus',()=>{activeColumn=c;activeRow=r;highlight();drawTree();});
          input.addEventListener('input',()=>{input.removeAttribute('aria-invalid');say('Row '+(r+1)+'. Check when you have finished.');});
          td.append(input);fields.push({input,answer:String(cell.value),column:c,row:r});
        } else td.textContent=String(cell.value);
        if(c===firstCompound)td.classList.add('sat-formula-boundary');tr.append(td);
      });body.append(tr);
    });table.append(body);work.append(table);highlight();drawTree();
    controls.append(iconButton('Check',()=>{
      if(kind==='table'&&matched.size<model.columns.length-firstCompound) {buzz('Match the remaining columns to their tree nodes first.');return;}
      let wrong=0;fields.forEach(({input,answer})=>{const bad=input.value!==answer;input.setAttribute('aria-invalid',String(bad));if(bad)wrong++;});
      if(wrong) {fields.find(f=>f.input.value!==f.answer).input.focus();buzz(wrong+' entries need attention. Marked fields are empty or incorrect.');}
      else finish('Correct table. The formula is '+(model.satisfiable?'satisfiable.':'unsatisfiable.'));
    }));
  }
  function mountMystery() {
    const item=levels[level], target=parseBoolean(item.formula).tree;
    if(item.prompt)question.append(el('p',{},item.prompt));
    const table=tableHead([...item.names,'']), body=el('tbody');
    valuations(item.names).forEach(v=>{const row=el('tr');item.names.forEach(name=>row.append(el('td',{},String(v[name]))));row.append(el('td',{},String(evaluateTrace(target,v).at(-1).value)));body.append(row);});table.append(body);work.append(table);
    const form=el('form'), answer=field('Your formula',{maxlength:512,spellcheck:'false',placeholder:'Your formula'});
    answer.wrap.firstChild.remove();form.append(answer.wrap);table.querySelector('th:last-child').append(form);
    function check(animate=false) {
      if(!answer.input.value.trim()) {say('Enter a formula in the table heading.');return;}
      try {
        const parsed=parseBoolean(answer.input.value);
        function allowed(n) {return !n.children.length || (!item.allowed||item.allowed.includes(n.label))&&n.children.every(allowed);}
        if(!allowed(parsed.tree))throw new Error('Use only '+item.allowed.join(', ')+'.');
        const result=checkMystery(answer.input.value,target,item.names);
        if(result.correct)finish('Correct: your formula agrees with every row.');
        else (animate?buzz:say)('Different value when '+Object.entries(result.counterexample).map(([n,v])=>n+' = '+v).join(', ')+'.');
      }catch(e){(animate?buzz:say)(e.message);}
    }
    controls.append(iconButton('Check',()=>{convertInput(answer.input);check(true);}));
    enableLatexInput(answer.input,()=>check());answer.input.addEventListener('input',()=>check());
    form.addEventListener('submit',e=>{e.preventDefault();convertInput(answer.input);check(true);});say('Enter a formula in the heading. Any equivalent answer counts.');
  }
  function mountNormalForm() {
    const item=levels[level], target=parseBoolean(item.formula).tree, form=el('form');
    const answers=['DNF','CNF'].map(name=>({name,...field(name,{maxlength:512,spellcheck:'false'})}));
    answers.forEach(a=>{form.append(a.wrap);enableLatexInput(a.input,()=>a.input.removeAttribute('aria-invalid'));});work.append(form);
    const check=()=>{let correct=true;const messages=[];
      for(const answer of answers) {
        try {
          convertInput(answer.input);const result=checkNormalForm(answer.input.value,target,answer.name);
          answer.input.setAttribute('aria-invalid',String(!result.correct||!result.normal));
          if(!result.correct){correct=false;messages.push(answer.name+': different value when '+Object.entries(result.counterexample).map(([n,v])=>n+' = '+v).join(', ')+'.');}
          else if(!result.normal){correct=false;messages.push('Equivalent, but not in '+answer.name+' yet.');}
        } catch(error){correct=false;answer.input.setAttribute('aria-invalid','true');messages.push(answer.name+': '+error.message);}
      }
      if(correct)finish('Correct: both descriptions give '+item.label+' in the requested normal form.');else buzz(messages.join(' '));
    };
    controls.prepend(iconButton('Check',check));form.addEventListener('submit',e=>{e.preventDefault();check();});say('Describe '+item.label+' using INPUT₁ and INPUT₂.');
  }
  function mountCircuitExercise() {
    const item=levels[level], fragment=root.querySelector('[data-circuit]').content.cloneNode(true), circuit=fragment.querySelector('[data-logic-app="boolean"]');
    circuit.dataset.preset=item.preset;circuit.dataset.inputLabels='INPUT₁,INPUT₂,INPUT₃';circuit.setAttribute('aria-label','Circuit '+(level+1));work.append(fragment);mountBoolean(circuit);circuit.dataset.mounted='true';
    const nodes=circuitPreset(item.preset), inputs=nodes.filter(n=>n.type==='INPUT'), names=inputs.map((n,i)=>'INPUT'+'₁₂₃'[i]);
    const answer=field('Circuit formula',{maxlength:512,spellcheck:'false',placeholder:'Use ¬ and ∧'}), form=el('form');form.append(answer.wrap);
    setup.append(form);enableLatexInput(answer.input,()=>say('Check your circuit description.'));
    function check() {try {
      convertInput(answer.input);const parsed=parseBoolean(answer.input.value);
      function allowed(n) {return !n.children.length||['¬','∧'].includes(n.label)&&n.children.every(allowed);}
      if(!allowed(parsed.tree)||parsed.names.some(n=>!names.includes(n)))throw new Error('Use only '+names.join(', ')+', ¬ and ∧.');
      const bad=valuations(names).find(v=>evaluateTrace(parsed.tree,v).at(-1).value!==evaluateCircuit(nodes,Object.fromEntries(inputs.map((n,i)=>[n.id,v[names[i]]]))).get('out'));
      if(bad)buzz('The lamp and formula disagree when '+Object.entries(bad).map(([n,v])=>n+' = '+v).join(', ')+'.');
      else finish('Correct: your description agrees with the circuit on every input.');
    }catch(e){buzz(e.message);}}
    controls.append(iconButton('Check',check));form.addEventListener('submit',e=>{e.preventDefault();check();});say('Describe the lamp using '+names.join(', ')+' with ¬ and ∧.');
  }
  function mountInference() {
    const item=levels[level];question.append(formula(item.inference));
    const form=el('form'), input=el('textarea',{'aria-label':'CNF clauses',rows:1,maxlength:4608});
    form.append(input);const use=iconButton('Start',()=>{},'play');use.type='submit';const edit=iconButton('Edit',()=>{input.readOnly=false;use.hidden=false;edit.hidden=true;work.replaceChildren();extra.replaceChildren();controls.replaceChildren();say('Edit the CNF clauses, then start again.');input.focus();},'edit');edit.hidden=true;form.append(use,edit);setup.append(form);
    enableLatexInput(input,()=>{});say('Enter the clauses for your SAT problem. Separate them with commas, or join them with ∧.');
    form.addEventListener('submit',e=>{e.preventDefault();try {
      convertInput(input);createResolutionSession(input.value);
      const problem=readProblem(item.inference), result=checkMystery(printFormula(readProblem(input.value).conjunction),problem.conjunction,problem.names);
      if(!result.correct)throw new Error('These clauses do not express the right SAT problem. Recheck your formula and its conversion.');
      input.readOnly=true;use.hidden=true;edit.hidden=false;mountResolution(input.value,true);
    }catch(error){buzz(error.message);}});
  }
  function mountResolution(source=levels[level].formula,inference=false) {
    if(!inference)question.append(formula(source));
    let state=createResolutionSession(source), selected=[], undo=[];
    function render(message) {
      work.replaceChildren();extra.replaceChildren();controls.replaceChildren();
      const list=el('ol',{class:'sat-clauses'});
      state.clauses.forEach(c=>{const li=el('li'), b=button(c.formula,()=>{
        selected=selected.includes(c.id)?selected.filter(id=>id!==c.id):[...selected.slice(-1),c.id];render('Choose a pivot shared with opposite signs.');
        work.querySelector('[data-clause="'+c.id+'"]')?.focus({preventScroll:true});
      });b.dataset.clause=String(c.id);b.setAttribute('aria-label','Clause '+c.id+': '+c.formula);b.setAttribute('aria-pressed',String(selected.includes(c.id)));li.append(b);
      if(c.parents)li.append(el('small',{},' From '+c.parents.join(', ')+' on '+c.pivot+'.'));list.append(li);});
      state.history.filter(h=>h.discarded).forEach(h=>{
        const li=el('li',{class:'practice-discarded'}), label=el('small');
        label.append(root.querySelector('[data-icon="trash"]').content.cloneNode(true),document.createTextNode(' Discarded: tautology'));
        li.append(formula(h.result),label,el('small',{},'From '+h.first+', '+h.second+' on '+h.pivot+'.'));
        list.append(li);
      });work.append(list);
      const actions=resolutionChoices(state), applicable=selected.length===2?actions.filter(a=>[a.first,a.second].every(id=>selected.includes(id))):[];
      const pivot=el('select',{'aria-label':'Pivot'});applicable.forEach(a=>pivot.append(el('option',{value:a.pivot},a.pivot+(a.checked?' (checked)':''))));
      const main=el('div',{class:'practice-actions'}), secondary=el('div',{class:'practice-actions'}), pivotLabel=el('label',{},'Pivot');pivotLabel.append(pivot);
      main.append(pivotLabel);controls.append(el('p',{},selected.length===2?'Selected lines '+selected.join(' and ')+'.':'Select two clauses.'),main,secondary);
      const resolve=iconButton('Resolve',()=>{try {
        const next=applyResolutionChoice(state,selected[0],selected[1],pivot.value);undo.push(state);state=next;selected=[];
        const last=state.history.at(-1);render(last.result+'. '+last.note);
        if(resolutionOutcome(state)==='unsatisfiable') finish(inference?'Empty clause derived. The inference is valid.':'Empty clause derived. The input is unsatisfiable.');
      }catch(e){buzz(e.message);}});resolve.disabled=!applicable.length||resolutionOutcome(state)==='unsatisfiable';main.append(resolve);
      const back=iconButton('Undo',()=>{state=undo.pop();selected=[];render('Last resolution undone.');},'undo');back.disabled=!undo.length;secondary.append(back,iconButton('Restart',()=>{state=createResolutionSession(source);selected=[];undo=[];render();},'replay'));main.append(iconButton('Saturated?',()=>{
        const outcome=resolutionOutcome(state);
        if(outcome==='satisfiable')finish(inference?'Saturated without an empty clause. The inference is invalid.':'All possible resolutions have been checked. No empty clause: the input is satisfiable.');
        else buzz(outcome==='unsatisfiable'?'The empty clause already shows unsatisfiability.':actions.filter(a=>!a.checked).length+' pair-and-pivot choices remain unchecked.');
      }));
      const details=el('details'), history=el('ol');state.history.forEach(h=>history.append(el('li',{},h.first+', '+h.second+' on '+h.pivot+': '+h.result+'. '+h.note)));details.append(el('summary',{},state.history.length+' resolutions checked'),history);extra.append(details);
      if(selected.length===2&&!applicable.length) say('These clauses have no complementary literals. Choose another pair.');else say(message||'Select two clauses, then their pivot. Keep the parent clauses for later steps.');
    }
    render();
  }
  start(0);
}
