import { celebrate } from './celebrate.js';
import { drawWorlds } from './boolean-worlds.js';
import { mountRGB } from './boolean-rgb.js';
import { proposition, worldsFor, inferenceScene, readInference, parseBoolean, printFormula } from '../logic/boolean.js';
import { intersection, countermodels, checkSelection } from '../set-diagram-model.js';
import { el, choices, formula, iconButton } from './boolean-ui.js';
import { enableLatexInput } from './latex-input.js';

export function mountModels(root) {
  if(root.dataset.preset==='rgb')return mountRGB(root);
  const variables=Number(root.dataset.variables), worlds=worldsFor(variables);
  const exercise=root.dataset.kind==='model-exercise';
  const picture=root.querySelector('[data-picture]'), status=root.querySelector('[role="status"]');
  const toolbar=root.querySelector('[data-toolbar]'), below=root.querySelector('[data-below]');
  let selected=new Set(), stages=[], expected=[], taskIndex=0;
  let mode=root.dataset.preset||'propositions';
  const valuationText=w=>['SUN','RAIN',...(variables===3?['WIND']:[])].map(name=>`v(${name}) = ${w[name]}`).join(', ');
  const tasks=mode==='custom' ? [{label:'Your inference',custom:true}] : variables===3 ? [
    {label:'1. A proposition',formula:'SUN ∧ WIND'},
    {label:'2. Another proposition',formula:'RAIN ∨ ¬WIND'},
    {label:'3. Countermodels',inference:'SUN ∨ RAIN\nWIND\n∴ SUN'},
    {label:'4. More countermodels',inference:'SUN ∨ WIND\nSUN\n∴ ¬WIND'}
  ] : [
    {label:'1. Countermodels',inference:'SUN ∨ RAIN\nSUN\n∴ ¬RAIN'},
    {label:'2. Countermodels',inference:'SUN ∨ RAIN\n∴ SUN'},
    {label:'3. Countermodels',inference:'¬(SUN ∧ RAIN)\n∴ ¬SUN'}
  ];
  const completed=new Set();
  let diagram;
  function draw(ids,announceWorld,f='',bad=false) {
    delete status.dataset.feedback;
    diagram=drawWorlds(root,worlds,{selected:ids,formula:f,countermodels:bad,onSelect:w=>{
      if(exercise) {
        delete status.dataset.feedback;
        selected.has(w.id)?selected.delete(w.id):selected.add(w.id);diagram.highlight([...selected],!tasks[taskIndex].formula);
        status.textContent=`Selected: ${selected.size?[...selected].join(', '):'none'}. Check your selection when ready.`;
      }else announceWorld(w);
    }});
    root.querySelector('[data-text]').replaceChildren(...worlds.map(w=>el('p',{},`${w.id}: ${valuationText(w)}.`)));
  }
  function inferenceStages(premises,conclusion) {
    const scene=inferenceScene(premises,conclusion,variables);
    const shared=intersection(scene,scene.premises).map(w=>w.id),bad=countermodels(scene,scene.premises,scene.conclusion).map(w=>w.id);
    return [
      ...premises.map((f,i)=>({label:`[${f}]`,ids:proposition(f,variables),text:`Premise ${i+1}: the worlds where ${f} is true.`,formula:f})),
      {label:premises.map(f=>`[${f}]`).join(' ∩ '),ids:shared,text:'Keep the worlds where both premises are true.',formula:premises.map(f=>`(${f})`).join(' ∧ ')},
      {label:`[${conclusion}]`,ids:proposition(conclusion,variables),text:'Now compare with the worlds where the conclusion is true.',formula:conclusion},
      {label:'Countermodels',countermodels:true,ids:bad,formula:[...premises.map(f=>`(${f})`),`¬(${conclusion})`].join(' ∧ '),text:bad.length?`${bad.join(', ')}: true premises, false conclusion. The inference is invalid.`:'No world has true premises and a false conclusion. The inference is valid.'}
    ];
  }
  function demonstrate() {
    if(root.dataset.examples === 'inferences') {
      let description=root.querySelector('[data-inference-description]');
      if(!description){description=el('p',{'data-inference-description':''});toolbar.before(description);}
      description.replaceChildren(formula(mode==='ds'?'SUN ∨ RAIN; ¬SUN ⊨ RAIN':'SUN ∨ RAIN; SUN ⊭ ¬RAIN'));
    }
    const propositionList=['SUN','RAIN','¬SUN','¬RAIN','SUN ∧ RAIN','SUN ∨ RAIN','RAIN ∧ ¬SUN','SUN ∨ (RAIN ∧ ¬SUN)'];
    stages=mode==='propositions' ? [{label:'',ids:[],initial:true,text:'Four assignments, one for each combination of truth-values. Choose a proposition to see its members.'},...propositionList.map(f=>({label:`[${f}]`,ids:proposition(f),formula:f,text:f==='SUN'?'The sunny worlds.':f==='RAIN'?'The rainy worlds.':f==='¬SUN'?'Take the complement of [SUN].':f==='¬RAIN'?'Take the complement of [RAIN].':f.includes('∨')?'Take the union of the two propositions.':'Take the intersection of the two propositions.'}))] : inferenceStages(['SUN ∨ RAIN',mode==='ds'?'¬SUN':'SUN'],mode==='ds'?'RAIN':'¬RAIN');
    const tabs=el('div');toolbar.querySelector('[data-propositions]')?.remove();tabs.dataset.propositions='';toolbar.append(tabs);
    function render(i) {
      const stage=stages[i];
      choices(tabs,stages.map((s,j)=>[j,s.label]).filter(([,label])=>label),i,j=>{render(j);tabs.querySelector(`[data-choice="${j}"]`)?.focus({preventScroll:true});},'Select a proposition or calculation');
      draw(stage.ids,w=>{status.replaceChildren(formula(`${w.id}: ${valuationText(w)}`));if(stage.formula)status.append(el('p',{},`v(${stage.formula}) = ${Number(stage.ids.includes(w.id))}.`));},stage.formula||'',stage.countermodels);
      status.replaceChildren();if(stage.label)status.append(formula(stage.label));status.append(el('p',{},stage.text));if(stage.formula){const tree=parseBoolean(stage.formula).tree,parts=tree.children.map(n=>printFormula(n).replace(/^\((.*)\)$/,'$1'));if(parts.length)status.append(formula(`[${stage.formula}] = ${parts.length===1?`W ∖ [${parts[0]}]`:parts.map(p=>`[${p}]`).join(tree.label==='∧'?' ∩ ':' ∪ ')}`));}if(!stage.initial)status.append(formula(`{${stage.ids.join(', ')}}`));
    }
    render(0);
  }
  let custom;
  function loadTask() {
    selected=new Set();const task=tasks[taskIndex];below.replaceChildren();
    if(task.custom) {
      const form=el('form'),label=el('label',{},'Write premises on separate lines; put ∴ before the conclusion.'),input=el('textarea',{'aria-label':'Inference',rows:4,maxlength:4608});input.value=custom||'SUN ∨ RAIN\nSUN\n∴ ¬RAIN';
      const use=iconButton(root,'play','Use inference','submit'),edit=iconButton(root,'edit','Edit inference');
      label.append(input);form.append(label,use,edit);below.append(form);
      function editing(value){input.readOnly=!value;use.hidden=!value;edit.hidden=value;}
      function invalidate(){delete status.dataset.feedback;expected=null;const check=root.querySelector('[data-check-selection]');if(check)check.disabled=true;status.textContent='Use inference to apply your changes.';}
      edit.addEventListener('click',()=>{editing(true);invalidate();input.focus({preventScroll:true});});
      enableLatexInput(input,()=>{custom=input.value;invalidate();});
      form.addEventListener('submit',e=>{e.preventDefault();custom=input.value;if(configure(input.value)){editing(false);edit.focus({preventScroll:true});}});
      editing(!configure(input.value));
    } else configure(task.inference,task.formula);
  }
  function configure(inference,f) {
    const controls=root.querySelector('[data-inspector]');controls.replaceChildren();
    try {
      let prompt;
      if(f) {expected=proposition(f,variables);prompt=`Select all and only the worlds in [${f}].`;}
      else {const {premises,conclusion}=readInference(inference),scene=inferenceScene(premises,conclusion,variables);expected=countermodels(scene,scene.premises,scene.conclusion).map(w=>w.id);prompt=mode==='custom'?'Select all and only the countermodels of your inference.':`Select all and only the countermodels:\n${premises.join('\n')}\n∴ ${conclusion}`;}
      selected=new Set();draw([],()=>{});controls.append(formula(prompt));status.textContent='Select worlds, then check your selection.';
      const check=iconButton(root,'check','Check selection');check.dataset.checkSelection='';check.append(el('span',{},'Check'));
      check.addEventListener('click',()=>{
        const result=checkSelection(expected,[...selected]);
        status.dataset.feedback=result.correct?'correct':'incorrect';
        if(result.correct){completed.add(taskIndex);taskButtons();celebrate(check);}
        status.textContent=result.correct?`Correct. ${expected.length?`${expected.length} world${expected.length===1?'':'s'} selected.`:'The required set is empty.'}`:`Not quite: ${result.missing} missing, ${result.extra} extra. Check the value of the formula in each world.`;
      });
      const clear=iconButton(root,'replay','Clear selection');clear.addEventListener('click',()=>{selected=new Set();draw([],()=>{});status.textContent='Selection cleared.';});
      const actions=el('div',{class:'boolean-check-controls'});actions.append(check,clear);controls.append(actions);return true;
    } catch(e) {expected=null;picture.replaceChildren();status.textContent=e.message;return false;}
  }
  function taskButtons() {
    if(tasks.length<2)return;
    choices(toolbar,tasks.map((t,i)=>[i,`${completed.has(i)?'✓ ':''}${t.formula?`[${t.formula}]`:t.inference.replace(/\n(?!∴)/g,', ').replace('\n∴',' ∴')}`]),taskIndex,i=>{taskIndex=i;loadTask();},'Model exercise');
  }
  if(exercise) {taskButtons();loadTask();}
  else {
    if (root.dataset.examples === 'inferences') {
      const examples=el('div',{class:'boolean-choices'}); toolbar.before(examples);
      const renderExamples=()=>choices(examples,[['ds','Valid inference'],['fallacy','Invalid inference']],mode,next=>{mode=next;demonstrate();renderExamples();},'Inference examples');
      renderExamples();
    }
    demonstrate();
  }
}
