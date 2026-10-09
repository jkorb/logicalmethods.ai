import {el} from './fol-views.js';
import {mountFOLModel} from './fol-model.js';
import {levels} from './fol-levels.js';
import {MODEL_REASONING_LEVELS} from '../logic/fol-inference-exercises.js';
import {printFOL} from '../logic/fol-parser.js';
import {startModelReasoning,conflict,availableObjects,canUnfold,truthCondition,unfoldTruthCondition,picturedModel,checkModelReasoning} from '../logic/fol-model-reasoning.js';
export function mountModelReasoning(root){
 const find=s=>root.querySelector(s),modelRoot=find('[data-logic-app="fol-model"]');
 mountFOLModel(modelRoot);modelRoot.dataset.mounted='true';const api=modelRoot.folModel;
 const panel=find('[data-reasoning]'),cases=find('[data-cases]'),facts=find('[data-requirements]'),explanation=find('[data-truth-condition]'),operations=find('[data-unfold]');
 // Reuse the model canvas's explanation column, as in the Socrates example.
 const aside=modelRoot.querySelector('.fol-explanation');aside.hidden=false;for(const child of aside.children)child.hidden=true;aside.append(panel);modelRoot.classList.add('fol-reasoning-model');
 let state,active=0,selected=null,history=[],completedModel=null;
 const drafts=new Map();let current;
 const progress=levels(root,MODEL_REASONING_LEVELS,(problem,i)=>{
  if(state)drafts.set(current,{state,active,history,completedModel});current=i;
  ({state,active,history,completedModel}=drafts.get(i)||{state:startModelReasoning(problem,api.config.language),active:0,history:[],completedModel:null});selected=null;
  find('[data-task]').textContent=problem.premises.join('; ')+' ∴ '+problem.goal;render();
 });
 function render(){
  const b=state.branches[active],clash=conflict(b);cases.replaceChildren();
  state.branches.forEach((branch,i)=>{const button=el('button',`Case ${i+1}${conflict(branch)?' ×':''}`);button.type='button';button.setAttribute('aria-label',`Case ${i+1}`);button.setAttribute('aria-pressed',String(i===active));button.onclick=()=>{active=i;selected=null;render();cases.children[i].focus({preventScroll:true});};cases.append(button);});
  cases.hidden=state.branches.length===1;facts.replaceChildren();
  b.entries.forEach((entry,i)=>{
   const button=el('button',`${entry.value?'True':'False'}: ${printFOL(entry.ast)}`,'fol-requirement');button.type='button';button.dataset.requirement=String(i);button.setAttribute('aria-pressed',String(i===selected));
   if(entry.done||entry.used.length)button.dataset.expanded='true';
   button.onclick=()=>{selected=i;render();facts.children[i].focus({preventScroll:true});};facts.append(button);
  });
  explanation.textContent=clash?`${clash} would have to be both true and false. This case is impossible.`:selected===null?b.message:truthCondition(b.entries[selected]);operations.replaceChildren();
  if(selected!==null&&canUnfold(b,b.entries[selected])){
   const choices=availableObjects(b,b.entries[selected]);
   for(const object of choices.length?choices:[null]){const button=el('button',object?`At ${object}`:'Unfold');button.type='button';button.dataset.unfoldObject=object||'';button.onclick=()=>{
    try{const entryIndex=selected,next=unfoldTruthCondition(state,active,selected,object);history.push({state,active});state=next;selected=null;completedModel=null;progress.clear();render();facts.children[entryIndex].focus({preventScroll:true});}catch(e){explanation.textContent=e.message;}
   };operations.append(button);}
  }
  const negative={};for(const e of b.entries)if(!e.value&&e.ast.kind==='predicate')(negative[e.ast.name]||=[]).push(e.ast.children.map(t=>t.name));
  api.set(completedModel&&completedModel.caseIndex===active?completedModel.model:picturedModel(state,b),{partial:!(completedModel&&completedModel.caseIndex===active),negative});
  find('[data-reasoning-undo]').disabled=!history.length;
 }
 find('[data-check]').onclick=()=>{
  const result=checkModelReasoning(state);
  if(result.result==='invalid'){active=result.caseIndex;completedModel=result;selected=null;render();}
  progress.feedback(result.result!=='unfinished',result.message);
 };
 find('[data-reasoning-undo]').onclick=()=>{({state,active}=history.pop());selected=null;completedModel=null;progress.clear();render();};
 find('[data-reasoning-reset]').onclick=()=>{state=startModelReasoning(MODEL_REASONING_LEVELS[current],api.config.language);active=0;selected=null;history=[];completedModel=null;progress.clear();render();};
 progress.start();find('[data-app-fallback]')?.remove();
}
