import { parseFOL, printFOL, freeVariables } from '../logic/fol-parser.js';
import { queryFOL, evaluateFOL, validateModel } from '../logic/fol-model.js';
import { databaseSQL } from '../logic/fol-database-export.js';
import { mountFOLModel } from './fol-model.js';
import { mountSQL } from './sql-app.js';
import { modelViews, el } from './fol-views.js';
import { mountExtensions, mountSubstitution } from './fol-semantics-practice.js';
import { levels } from './fol-levels.js';
import { builderLevels, modelLevels, queryLevels, initializationLevels } from './fol-practice-levels.js';

export function mountFOLPractice(root) {
  const kind=root.dataset.exercise;
  if (kind === 'extensions') { mountExtensions(root); return; }
  if (kind === 'substitution') { mountSubstitution(root); return; }
  const find=s=>root.querySelector(s), task=find('[data-task]');
  let active, assessment, editor;
  const items={builder:builderLevels,model:modelLevels,query:queryLevels,initialize:initializationLevels}[kind];
  const progress=levels(root,items,load);
  let modelRoot, modelAPI, sqlRoot, config;
  if(kind==='model') {
    modelRoot=find('[data-logic-app="fol-model"]');mountFOLModel(modelRoot);modelRoot.dataset.mounted='true'; modelAPI=modelRoot.folModel;
    modelRoot.addEventListener('fol-model-change', progress.clear);
    find('[data-check]').addEventListener('click',()=>{
      const model=modelAPI.get(), errors=validateModel(modelAPI.config.language,model);
      if(errors.length) { progress.feedback(false,errors[0]);return; }
      const value=evaluateFOL(parseFOL(active.formula,{language:modelAPI.config.language}),modelAPI.config.language,model,{}).value;
      progress.feedback(value===active.value, value===active.value?`Correct: the formula is ${value} in your model.`:`The formula is ${value} in this model. Change its interpretation or choose Impossible.`);
    });
    find('[data-impossible]').addEventListener('click',()=>progress.feedback(Boolean(active.impossible),active.impossible?`Correct. ${active.reason}`:'There is a model with the requested truth value. Try changing the predicate extensions.'));
  } else if(kind==='query'||kind==='initialize') {
    sqlRoot=find('[data-logic-app="sql"]');config=JSON.parse(sqlRoot.querySelector('[data-sql-config]').textContent);
    editor=mountSQL(sqlRoot,{
      setup:()=>kind==='query'?databaseSQL(config.language,config.model,config.columns):'',
      assessment:()=>assessment,
      onFailure:message=>progress.feedback(false,message),
      onSuccess:verdict=>progress.feedback(verdict.correct,verdict.message)
    });sqlRoot.dataset.mounted='true';
    sqlRoot.addEventListener('input', progress.clear);
    sqlRoot.querySelector('[data-run-sql]').addEventListener('click', progress.clear);
    sqlRoot.querySelector('[data-reset-sql]').addEventListener('click', progress.clear);
  }
  const builder=kind==='builder'?makeBuilder(root,progress):null;
  function load(item) {
    active=item;task.replaceChildren();
    if(kind==='builder') { task.append('Build ',el('span',item,'fol-formula'));builder.reset(item); }
    else if(kind==='model') {
      task.append('Make ',el('span',item.formula,'fol-formula'),` ${item.value?'true':'false'}.`);
      const start=structuredClone(modelAPI.config.model);
      start.domain=['jimmy','sir','socrates'];for(const name of Object.keys(start.predicates))start.predicates[name]=[];
      modelAPI.set(start);
    } else {
      const target=find('[data-target]');target.replaceChildren();
      const names=kind==='initialize'?item:Object.keys(config.language.predicates);
      const objects=new Map(config.objects.map(o=>[o.id,o]));
      const views=modelViews({language:config.language,model:config.model,objects,columns:config.columns,editable:false,selected:[],markerId:'practice',choose:()=>{}});
      if(kind==='query') {
        const ast=parseFOL(item.formula,{language:config.language});const variables=freeVariables(ast);
        const answer=queryFOL(ast,config.language,config.model,{variables});
        task.append(`${item.label}: `,el('span',printFOL(ast),'fol-formula'),el('small',`Return columns ${variables.join(', ')} in this order, with no duplicate rows.`));
        assessment={kind:'query',columns:variables.length,rows:answer.rows};
        const details=el('details');details.append(el('summary','Database tables'),views.tables(new Set(names)),views.domain());target.append(details);
        editor.set(`SELECT DISTINCT d.value AS x\nFROM Domain AS d\nWHERE /* condition */;`);
      } else {
        task.append('Create and populate the displayed tables. Use the object names as text values.');
        assessment={kind:'initialize',tables:names.map(name=>name==='Domain'?{name,columns:['value'],rows:config.model.domain.map(d=>[d])}:{name,columns:config.columns[name],rows:config.model.predicates[name]})};
        const tabs=el('div',undefined,'fol-tabs'),panel=el('div',undefined,'fol-practice-table');
        tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Model tables');
        const show=name=>{
          panel.replaceChildren(name==='Domain'?views.table('Domain',['value'],config.model.domain.map(d=>[d])):views.tables(new Set([name])));
          panel.querySelectorAll('.fol-object').forEach(n=>n.append(el('small',n.dataset.object,'fol-sql-object-name')));
          [...tabs.children].forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===name)));
        };
        for(const name of names) { const b=el('button',name);b.type='button';b.addEventListener('click',()=>show(name));tabs.append(b); }
        target.append(tabs,panel);show(names[0]);
        editor.set('-- Write CREATE TABLE and INSERT INTO statements here.');
      }
      if(kind==='query')target.querySelectorAll('.fol-object').forEach(n => n.append(el('small', n.dataset.object, 'fol-sql-object-name')));
    }
  }
  progress.start(); find('[data-app-fallback]')?.remove();
}

function makeBuilder(root,progress) {
  const board=root.querySelector('[data-builder-board]'),tools=root.querySelector('[data-build-tools]');
  let nodes=[],selected=[],target='',variable='x';
  const button=(label,fn,group)=>{const b=el('button',label);b.type='button';b.addEventListener('click',fn);group.append(b);return b;};
  function group(label) {const g=el('fieldset'),l=el('legend',label);g.append(l);tools.append(g);return g;}
  const leaves=group('Terms');for(const label of ['x','y','z','a','b'])button(label,()=>add(label,'term',[]),leaves);
  const constructors=group('Functions and predicates');
  for(const [label,type,count] of [['f','term',1],['g','term',2],['P','formula',1],['Q','formula',1],['R','formula',2],['=','formula',2]])button(label,()=>{
    if(!requireSelection('term',count))return;
    const args=selected.map(i=>nodes[i].label);add(label==='='?`${args[0]} = ${args[1]}`:`${label}(${args.join(', ')})`,type,[...selected]);
  },constructors);
  const connectives=group('Connectives');for(const op of ['¬','∧','∨','→','↔'])button(op,()=>{
    if(!requireSelection('formula',op==='¬'?1:2))return;
    const args=selected.map(i=>nodes[i].label);add(op==='¬'?`¬${args[0]}`:`(${args[0]} ${op} ${args[1]})`,'formula',[...selected]);
  },connectives);
  const quantifiers=group('Quantifiers'),variables=[];
  for(const v of ['x','y','z']) {const b=button(v,()=>{variable=v;variables.forEach(n=>n.setAttribute('aria-pressed',String(n===b)));},quantifiers);b.setAttribute('aria-label',`Bind ${v}`);b.setAttribute('aria-pressed',String(v===variable));variables.push(b);}
  for(const q of ['∀','∃'])button(q,()=>{if(requireSelection('formula',1))add(`${q}${variable} ${nodes[selected[0]].label}`,'formula',[...selected]);},quantifiers);
  function requireSelection(type,count) {if(selected.length===count&&selected.every(i=>nodes[i].type===type))return true;progress.feedback(false,`Select ${count===1?'one':count} ${type}${count===1?'':'s'}${count>1?' in argument order':''}.`);return false;}
  function add(label,type,children) {
    for(const i of children)nodes[i].used=true;
    nodes.push({label,type,children,used:false});selected=[];draw();
    if(nodes.at(-1).label===target)progress.feedback(true,'Correct: built according to the grammar.');else progress.clear();
  }
  function tree(i) {
    const n=nodes[i],wrap=el('div',undefined,'builder__tree'),b=el(n.used?'span':'button',n.label,'builder__node');
    if(!n.used) { b.type='button';b.setAttribute('aria-pressed',String(selected.includes(i)));b.addEventListener('click',()=>{selected=selected.includes(i)?selected.filter(j=>j!==i):[...selected,i];draw();}); }
    else b.classList.add('is-used');
    wrap.append(b);if(n.children.length){const c=el('div',undefined,'builder__children');c.append(...n.children.map(tree));wrap.append(c);}return wrap;
  }
  function draw() { board.replaceChildren(...nodes.flatMap((n,i)=>n.used?[]:[tree(i)]));root.querySelector('[data-undo]').disabled=!nodes.length; }
  function reset(value=target) {target=printFOL(parseFOL(value,{kind:value==='f(a)'?'term':'formula'}));nodes=[];selected=[];draw();}
  root.querySelector('[data-undo]').addEventListener('click',()=>{const last=nodes.pop();if(last)for(const i of last.children)nodes[i].used=false;selected=[];progress.clear();draw();});
  root.querySelector('[data-reset-builder]').addEventListener('click',()=>{reset();progress.clear();});
  return {reset};
}
