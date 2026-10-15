import {el,iconButton,choices} from './boolean-ui.js';
import {table,modelIcon,number} from './probability-ui.js';
import {drawWorlds} from './boolean-worlds.js';
import {WORLDS} from '../logic/boolean.js';
import {weatherRows,numberInput,formatNumber as fmt} from '../logic/probability.js';
import {levels} from './fol-levels.js';
import {threeWeatherRows,threeWeatherWorlds,generationLevels,calculationLevels,independenceLevels,initialWeights,assessWeights,assessCalculation,assessIndependence} from '../logic/probability-practice.js';

export function mountProbabilityPractice(root){
 const q=s=>root.querySelector(s),kind=root.dataset.exercise;
 const items={weights:generationLevels,calculate:calculationLevels,independence:independenceLevels}[kind];
 const rows=kind==='calculate'?threeWeatherRows:weatherRows,worlds=kind==='calculate'?threeWeatherWorlds:WORLDS;
 let item,index,state,worldView,body;
 const saved=new Map(),progress=levels(root,items,load);
 const check=iconButton(root,'check','Check','submit');check.append(' Check');
 const reset=iconButton(root,'replay','Reset level'),full=iconButton(root,'fullscreen','Fullscreen');q('[data-practice-tools]').append(reset,full);
 reset.onclick=()=>{saved.delete(index);load(item,index);progress.clear();};
 full.onclick=async()=>{try{if(document.fullscreenElement===root)await document.exitFullscreen();else await root.requestFullscreen();}catch{progress.feedback(false,'Fullscreen is unavailable.');}};
 document.addEventListener('fullscreenchange',()=>{const label=document.fullscreenElement===root?'Exit fullscreen':'Fullscreen';full.title=label;full.setAttribute('aria-label',label);});
 q('[data-actions]').onsubmit=e=>{e.preventDefault();const weights=state.weights.map(numberInput);const result=kind==='weights'?assessWeights(weights,item.claims):kind==='calculate'?assessCalculation(item,[...state.selected],state.answer):assessIndependence(item,weights,state.choice);progress.feedback(result.correct,result.message);};
 function load(next,i){
  item=next;index=i;state=saved.get(i)||{weights:(item.masses||initialWeights).map(fmt),selected:new Set(),answer:'',choice:null};saved.set(i,state);draw();
 }
 function select(i){
  state.selected.has(i)?state.selected.delete(i):state.selected.add(i);progress.clear();
  worldView.highlight([...state.selected].map(i=>worlds[i].id));
  for(const [i,row]of [...body.children].entries()){row.classList.toggle('is-current',state.selected.has(i));row.querySelector('button').setAttribute('aria-pressed',String(state.selected.has(i)));}
  working();
 }
 function working(){
  const work=q('[data-working]');work.replaceChildren();
  if(kind==='calculate'){
   const sum=el('div',{class:'prob-selected-sum','aria-label':'Weights to add'});
   for(const i of [...state.selected].sort((a,b)=>a-b)){if(sum.childNodes.length)sum.append(' + ');sum.append(number(item.masses[i]));}
   if(!state.selected.size)sum.append('Select the models where the formula is true.');work.append(sum);
  }else{
   const values=state.weights.map(numberInput),sum=values.reduce((a,b)=>a+b,0),total=el('p',{class:'prob-weight-total'});total.append('Total weight: ',number(sum));work.append(total);
  }
 }
 function draw(){
  const task=q('[data-task]');task.replaceChildren(el('strong',{},'Task'));
  const prompt=kind==='calculate'?'Select every model where the formula is true. Add its weight, then enter the probability.':kind==='weights'?item.prompt:item.mode==='identify'?'Are these formulas independent under the displayed distribution?':`Make the two formulas ${item.independent?'independent':'dependent'} while satisfying the stated probabilities.`;
  task.append(el('p',{},prompt));
  if(kind==='calculate')task.append(el('p',{class:'prob-target'},`Pr(${item.formula}) = ?`));
  if(kind==='independence')task.append(el('p',{class:'prob-target'},`${item.left}   ·   ${item.right}`));
  for(const c of item.claims||[]){const line=el('p',{class:'prob-target'});line.append(`Pr(${c.formula}${c.condition?' | '+c.condition:''}) = `,c.times?`${c.times} × Pr(${c.other})`:number(c.value));task.append(line);}
  const editable=kind==='weights'||item.mode==='construct';
  const made=table(['M',...Object.keys(rows[0].values),'p(M)'],'Models and probability weights');body=made.body;made.table.classList.add('prob-truth-table');made.table.querySelector('th:last-child').classList.add('prob-weight');
  rows.forEach((row,i)=>{
   const tr=el('tr',{'data-row':i}),head=el('th',{scope:'row'}),pick=el('button',{type:'button','aria-label':`Select model ${i+1}`,'aria-pressed':String(state.selected.has(i))});pick.append(modelIcon(root,rows,i));pick.onclick=()=>select(i);head.append(pick);tr.append(head);tr.classList.toggle('is-current',state.selected.has(i));
   Object.values(row.values).forEach(v=>tr.append(el('td',{},String(v))));const weight=el('td',{class:'prob-weight'});
   if(editable){const input=el('input',{type:'text',inputmode:'decimal',value:state.weights[i],'aria-label':`Probability of model ${i+1}`});input.oninput=()=>{state.weights[i]=input.value;progress.clear();working();};input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check.click();}};weight.append(input);}
   else weight.append(number(numberInput(state.weights[i])));
   tr.append(weight);body.append(tr);
  });q('[data-table]').replaceChildren(made.table);
  worldView=drawWorlds(root,worlds,{selected:[...state.selected].map(i=>worlds[i].id),onSelect:w=>select(worlds.findIndex(x=>x.id===w.id))});
  const actions=q('[data-actions]');actions.replaceChildren();
  if(kind==='calculate'){
   const label=el('label',{},'Probability '),input=el('input',{type:'text',inputmode:'decimal','aria-label':'Your probability',placeholder:'Fraction or decimal',value:state.answer});input.oninput=()=>{state.answer=input.value;progress.clear();};label.append(input);actions.append(label);
  }else if(item.mode==='identify'){
   const bank=el('div');choices(bank,[['yes','Independent'],['no','Dependent']],state.choice===null?'':state.choice?'yes':'no',v=>{state.choice=v==='yes';progress.clear();},'Independence');actions.append(bank);
  }
  actions.append(check);if(kind==='calculate')q('[data-working]').after(actions);working();
 }
 progress.start();root.querySelector('[data-app-fallback]').remove();
}
