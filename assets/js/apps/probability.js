import {table,modelIcon,fraction,number} from './probability-ui.js';
import {mountProbabilityPractice} from './probability-practice.js';
import {levels} from './fol-levels.js';
import {spamLevels,assessSpam} from '../logic/probability-practice.js';
import {el,svg,choices,iconButton} from './boolean-ui.js';
import {enableLatexInput,convertInput} from './latex-input.js';
import {drawWorlds} from './boolean-worlds.js';
import {WORLDS} from '../logic/boolean.js';
import {weatherRows,diceRows,spamRows,distributions,numberInput,formatNumber as fmt,tableCalculation,inferenceSupport,supportFromJoint,supportCurve,supportBounds,supportSliderBounds,changeSupportProbability,defaultBayes,markerNames,emailMarkers,classifyEmail} from '../logic/probability.js';

const measures=[['difference','Increase of firmness','blue'],['logRatio','Log probability ratio','orange'],['logLikelihood','Log-likelihood ratio','green']];
const decimal=n=>n===null?'undefined':Number.isFinite(n)?String(Number(n.toPrecision(8))):fmt(n);
function button(label,click){const b=el('button',{type:'button'},label);b.onclick=click;return b;}
function equation(...parts){const p=el('div',{class:'prob-equation'});parts.forEach(part=>p.append(typeof part==='number'?number(part):part));return p;}
function metric(parent,label,value,attr={}){const row=el('div',{class:'prob-metric'}),out=el('output',attr);out.dataset.value=fmt(value);out.append(number(value));row.append(el('span',{},label),out);parent.append(row);}
function field(root,value,label){
 const wrap=el('div',{class:'logic-app__input-wrap'}),input=el('textarea',{class:'logic-app__input',rows:1,readonly:'',spellcheck:'false',maxlength:512,'aria-label':label,'data-submit-enter':''}),edit=iconButton(root,'edit',`Edit ${label.toLowerCase()}`);
 input.value=value;edit.classList.add('logic-app__edit');wrap.append(input,edit);edit.onclick=()=>{input.readOnly=false;edit.hidden=true;input.focus();};enableLatexInput(input);
 return {wrap,input,freeze(){input.readOnly=true;edit.hidden=false;input.dispatchEvent(new Event('logic-input-resize'));}};
}
function stepper(root,length,changed){
 const group=root.querySelector('[data-navigation]');group.replaceChildren();group.classList.add('prob-navigation');group.setAttribute('aria-label','Calculation steps');let index=0;
 const buttons=['first','previous','next','last'].map(action=>{const b=iconButton(root,action,`${action[0].toUpperCase()+action.slice(1)} step`);b.onclick=()=>go(action==='first'?0:action==='last'?length:index+(action==='next'?1:-1));group.append(b);return b;});
 const count=el('span');group.append(count);
 function go(i){index=Math.max(0,Math.min(length,i));buttons[0].disabled=buttons[1].disabled=index===0;buttons[2].disabled=buttons[3].disabled=index===length;count.textContent=`${index} / ${length}`;changed(index);}
 return {go};
}
function makeTable(root,rows,masses,support,onChange,onInspect){
 const names=Object.keys(rows[0].values),headers=['M',...names,...(support?['E','C']:['A']),'p(M)'];
 const {table:t,body}=table(headers,'Models, truth-values, and probability weights');t.classList.add('prob-truth-table');
 rows.forEach((row,i)=>{
  const tr=el('tr',{'data-row':i}),model=el('th',{scope:'row'}),b=onInspect?button('',()=>onInspect(i)):el('span',{role:'img'});b.setAttribute('aria-label',`${onInspect?'Inspect model':'Model'} ${i+1}`);b.append(modelIcon(root,rows,i));model.append(b);tr.append(model);
  names.forEach(n=>tr.append(el('td',{},String(row.values[n]))));
  for(const key of support?['evidence','hypothesis']:['event'])tr.append(el('td',{[`data-${key}`]:''}));
  const weight=el('td',{class:'prob-weight'}),input=el('input',{type:'text',inputmode:'decimal',value:fmt(masses[i]),'aria-label':`Probability of model ${i+1}`});input.oninput=()=>onChange(i,numberInput(input.value));weight.append(input);tr.append(weight);body.append(tr);
 });t.querySelector('thead th:last-child').classList.add('prob-weight');return {table:t,body};
}
export function mountProbability(root){
 if(root.dataset.kind==='practice'){mountProbabilityPractice(root);return;}
 const toolbar=root.querySelector('[data-toolbar]'),tools=el('span',{class:'prob-tools'}),reset=iconButton(root,'replay','Reset'),full=iconButton(root,'fullscreen','Fullscreen');tools.append(reset,full);toolbar.append(tools);
 full.onclick=async()=>{try{if(document.fullscreenElement===root)await document.exitFullscreen();else await root.requestFullscreen();}catch{root.querySelector('[role=status]').textContent='Fullscreen is unavailable in this browser.';}};
 document.addEventListener('fullscreenchange',()=>{const label=document.fullscreenElement===root?'Exit fullscreen':'Fullscreen';full.title=label;full.setAttribute('aria-label',label);});
 reset.onclick=root.dataset.kind==='bayes'?mountBayes(root):root.dataset.kind==='support'?mountSupport(root):mountTable(root);root.querySelector('[data-app-fallback]').remove();
}
function mountTable(root){
 const q=s=>root.querySelector(s),dice=root.dataset.kind==='dice',rows=dice?diceRows:weatherRows,initial=dice?'fair':root.dataset.preset;
 let masses=[...distributions[initial]],result,body,step=0;
 const presets=dice?[['fair','Fair'],['loaded','Loaded'],['certain','Certain']]:[['uniform','Uniform'],['sunny','Sun certain'],['dependent','Dependent']];
 const bank=el('div');q('[data-toolbar]').prepend(bank);choices(bank,presets,initial,key=>{masses=[...distributions[key]];build();calculate();},'Probability distributions');
 const form=el('form',{class:'prob-form'}),source=field(root,root.dataset.formula||'SUN ∨ ¬RAIN','Formula'),condition=field(root,root.dataset.condition||'','Condition');condition.input.placeholder='Given… (optional)';
 const run=iconButton(root,'check','Calculate','submit');run.append('Calculate');form.append(source.wrap,condition.wrap,run);q('[data-entry]').append(form);
 const nav=stepper(root,rows.length,i=>{step=i;paint();});
 form.onsubmit=e=>{e.preventDefault();convertInput(source.input);convertInput(condition.input);if(calculate()){source.freeze();condition.freeze();}};
 form.oninput=()=>{result=null;paint();q('[role=status]').textContent='Calculate to apply the edited formula.';};
 function build(){const made=makeTable(root,rows,masses,false,(i,value)=>{masses[i]=value;calculate();},i=>nav.go(i+1));body=made.body;
  const normalize=button('Normalize',()=>{const total=masses.reduce((a,b)=>a+b,0);if(!Number.isFinite(total)||total<=0||masses.some(p=>p<0)){q('[role=status]').textContent='Use nonnegative weights with a positive sum.';return;}masses=masses.map(p=>p/total);build();calculate();});normalize.classList.add('prob-normalize');q('[data-table]').replaceChildren(made.table,normalize);
 }
 function calculate(){try{result=tableCalculation(masses,rows,source.input.value,condition.input.value);q('[role=status]').textContent='';delete q('[role=status]').dataset.state;nav.go(0);return true;}catch(e){result=null;paint();q('[role=status]').textContent=e.message;q('[role=status]').dataset.state='error';return false;}}
 function paint(){
  if(!body)return;const panel=q('[data-calculation]');panel.replaceChildren();q('[data-picture]').replaceChildren();
  for(const [i,tr] of [...body.children].entries()){tr.classList.toggle('is-current',!!result&&i===step-1);tr.classList.toggle('is-counted',!!result&&i<step&&result.joint[i]);tr.classList.toggle('is-excluded',!!result&&!result.given[i]);tr.querySelector('[data-event]').textContent=result?Number(result.event[i]):'—';}
  q('[data-navigation]').hidden=!result;if(!result)return;
  if(!dice){root.classList.add('prob-worlds');drawWorlds(root,WORLDS,{selected:rows.filter((_,i)=>result.joint[i]).map(r=>r.label),formula:condition.input.value.trim()?`(${source.input.value}) ∧ (${condition.input.value})`:source.input.value,onSelect:w=>nav.go(rows.findIndex(r=>r.label===w.id)+1)});}
  const explanation=el('div',{class:'prob-step'});
  if(!step)explanation.append(el('p',{},'Check each model and add its weight when the formula is true.'));
  else{const i=step-1,model=equation(modelIcon(root,rows,i),` ${result.event[i]?'⊨':'⊭'} ${source.input.value}`);explanation.append(model);
   if(dice){const values=equation();values.append(`D${'₁₂₃₄₅₆'[i]} = 1; all other atoms = 0.`);explanation.append(values);}
   explanation.append(el('p',{},!result.given[i]?'This model fails the condition; leave its weight out.':result.event[i]?'The formula is true here, so add this model’s weight.':'The formula is false here, so add nothing.'));
  }
  panel.append(explanation);const sum=equation();rows.forEach((_,i)=>{if(i>=step||!result.joint[i])return;if(sum.childNodes.length)sum.append(' + ');const term=el('span',{class:`prob-summand${i===step-1?' is-current':''}`});term.append(modelIcon(root,rows,i),number(masses[i]));sum.append(term);});if(!sum.childNodes.length)sum.append('0');
  const subtotal=masses.reduce((s,p,i)=>s+(i<step&&result.joint[i]?p:0),0);sum.append(' = ',number(subtotal));panel.append(sum);
  if(step===rows.length){const answer=el('div',{class:'prob-answer'});if(condition.input.value.trim()){answer.append(equation('Pr(A | B) = ',fraction(fmt(result.numerator),fmt(result.denominator))));}metric(answer,condition.input.value.trim()?`Pr(${source.input.value} | ${condition.input.value})`:`Pr(${source.input.value})`,result.result,{'data-probability':''});panel.append(answer);if(result.result===null)answer.append(el('p',{},'Undefined: the condition has probability 0.'));}
 }
 build();calculate();return ()=>{masses=[...distributions[initial]];source.input.value=root.dataset.formula||'SUN ∨ ¬RAIN';condition.input.value=root.dataset.condition||'';source.freeze();condition.freeze();bank.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.choice===initial)));build();calculate();};
}
function mountSupport(root){
 const q=s=>root.querySelector(s),rows=root.dataset.preset==='sender'?spamRows:weatherRows,initial=root.dataset.preset;let masses=[...distributions[initial]],result,body;
 const original=(root.dataset.formula||'SUN ∴ RAIN').split('∴'),premises=field(root,original[0].trim(),'Premises'),conclusion=field(root,original[1].trim(),'Conclusion'),form=el('form',{class:'prob-form prob-support-form'});
 for(const [name,f] of [['Premises',premises],['Conclusion',conclusion]]){const label=el('label',{},name);label.append(f.wrap);form.append(label);}const run=iconButton(root,'check','Calculate','submit');run.append('Calculate');form.append(run,q('.prob-tools'));q('[data-toolbar]').hidden=true;q('[data-entry]').append(form);
 const cards=el('div',{class:'prob-measures',role:'group','aria-label':'Measures of inductive support'}),selected=new Set(['difference']);q('[data-calculation]').append(cards);
 const outputs=new Map();for(const [key,label,color]of measures){const card=button('',()=>{selected.has(key)?selected.delete(key):selected.add(key);render();});card.className='prob-measure';card.dataset.measure=key;card.style.setProperty('--measure-color',`var(--${color}-ink)`);card.setAttribute('aria-label',label);card.append(el('span',{},label));const out=el('output',{'data-support':key});card.append(out);cards.append(card);outputs.set(key,out);}
 const sliders=el('div',{class:'prob-sliders'});q('[data-calculation]').append(sliders);const controls=new Map();
 for(const [key,name]of [['p','Pr(C)'],['e','Pr(E)'],['q','Pr(C | E)']]){const label=el('label'),readout=el('output'),range=el('input',{type:'range',min:0,max:1,step:'any','aria-label':name});label.append(el('span',{},name),range,readout);sliders.append(label);controls.set(key,{range,readout});range.oninput=()=>{try{masses=changeSupportProbability(masses,result,key,Number(range.value),distributions[initial]);build();calculate();}catch(e){q('[role=status]').textContent=e.message;}};}
 form.onsubmit=e=>{e.preventDefault();convertInput(premises.input);convertInput(conclusion.input);if(calculate()){premises.freeze();conclusion.freeze();}};
 form.oninput=()=>{result=null;render();q('[role=status]').textContent='Calculate to apply the edited inference.';};
 function build(){const made=makeTable(root,rows,masses,true,(i,value)=>{masses[i]=value;calculate();});body=made.body;q('[data-table]').replaceChildren(made.table);}
 function calculate(){try{result=inferenceSupport(masses,rows,`${premises.input.value}\n∴ ${conclusion.input.value}`);q('[role=status]').textContent='';delete q('[role=status]').dataset.state;render();return true;}catch(e){result=null;render();q('[role=status]').textContent=e.message;q('[role=status]').dataset.state='error';return false;}}
 function render(){
  cards.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(selected.has(b.dataset.measure))));
  for(const [key,out]of outputs){out.dataset.value=result?fmt(result[key]):'undefined';out.replaceChildren(result?number(result[key]):'—');}
  for(const [key,{range,readout}]of controls){const [low,high]=result?supportSliderBounds(result,key):[0,0];range.min=String(low);range.max=String(high);range.value=String(result?.[key]??0);range.disabled=!result||high-low<1e-9;readout.dataset.value=result?fmt(result[key]):'undefined';readout.replaceChildren(result?number(result[key]):'—');}
  for(const [i,tr]of [...body.children].entries())for(const key of ['evidence','hypothesis']){const cell=tr.querySelector(`[data-${key}]`);cell.textContent=result?Number(result[key][i]):'—';cell.classList.toggle('is-true',!!result&&result[key][i]);}
  drawGraph();
 }
 function drawGraph(){
  const graph=q('[data-graph]');graph.replaceChildren();if(!result||!selected.size)return;
  const curves=measures.filter(([key])=>selected.has(key)).map(([key,label,color])=>({key,label,color,points:supportCurve(result,'q',key)}));
  const finite=curves.flatMap(c=>c.points.map(([,y])=>y)).filter(y=>y!==null&&Number.isFinite(y));
  if(!finite.length){graph.append(el('p',{class:'prob-note'},'No finite curve: a required conditional probability or logarithm is undefined. Change the weights to leave this boundary.'));return;}
  const values=[...finite,...curves.map(c=>result[c.key]).filter(v=>v!==null&&Number.isFinite(v))],low=Math.floor(Math.min(0,...values)*10)/10,high=Math.ceil(Math.max(.1,...values)*10)/10;
  const sx=x=>65+430*x,sy=y=>155-(y-low)/(high-low)*130,canvas=svg('svg',{viewBox:'0 0 540 205',class:'prob-plot',role:'img','aria-label':`Inductive support as Pr(C | E) varies; Pr(C) = ${fmt(result.p)}, Pr(E) = ${fmt(result.e)}. The dots mark the current table.`});
  const [start,end]=supportBounds(result,'q');
  for(const [a,b]of [[0,start],[end,1]])if(b>a)canvas.append(svg('rect',{x:sx(a),y:25,width:430*(b-a),height:130,class:'prob-excluded-range'}));
  for(const x of [start,end])canvas.append(svg('line',{x1:sx(x),x2:sx(x),y1:25,y2:155,class:'prob-boundary'}));
  for(const y of [low,0,high].filter((v,i,a)=>a.indexOf(v)===i))canvas.append(svg('line',{x1:65,x2:495,y1:sy(y),y2:sy(y),class:'prob-grid'}),svg('text',{x:58,y:sy(y)+4,'text-anchor':'end'},String(Number(y.toPrecision(2)))));
  for(const x of [0,.25,.5,.75,1])canvas.append(svg('text',{x:sx(x),y:178,'text-anchor':'middle'},String(x)));canvas.append(svg('text',{x:280,y:201,'text-anchor':'middle'},'Pr(C | E)'));
  for(const {key,label,color,points}of curves){let path='',open=false;for(const [x,y]of points){if(y===null||!Number.isFinite(y)){open=false;continue;}path+=`${open?'L':'M'}${sx(x)},${sy(y)} `;open=true;}
   canvas.append(svg('path',{d:path,class:'prob-curve',stroke:`var(--${color}-ink)`,'data-curve':key,'stroke-dasharray':key==='logRatio'?'7 3':key==='logLikelihood'?'2 3':'none'}));
   const finitePoints=points.filter(([,y])=>y!==null&&Number.isFinite(y));
   for(const edge of [start,end]){
    const j=edge*result.e;
    const endpoint=supportFromJoint(result.p,result.e,j)[key];
    const point=endpoint!==null&&Number.isFinite(endpoint)?[edge,endpoint]:edge===start?finitePoints[0]:finitePoints.at(-1);
    if(point){const marker=svg('circle',{cx:sx(point[0]),cy:sy(point[1]),r:3.5,stroke:`var(--${color}-ink)`,fill:endpoint!==null&&Number.isFinite(endpoint)?`var(--${color}-ink)`:'var(--paper)',class:'prob-endpoint','data-open':String(endpoint===null||!Number.isFinite(endpoint))});marker.append(svg('title',{},endpoint!==null&&Number.isFinite(endpoint)?`Feasible endpoint: ${fmt(edge)}`:'Curve continues towards an infinite limit; the endpoint is undefined.'));canvas.append(marker);}
   }
   if(result[key]!==null&&Number.isFinite(result[key]))canvas.append(svg('circle',{cx:sx(result.q),cy:sy(result[key]),r:4,fill:`var(--${color}-ink)`,class:'prob-point'}));
   const legend=el('span',{class:'prob-legend'},label);legend.style.color=`var(--${color}-ink)`;graph.append(legend);
  }graph.append(canvas,el('p',{class:'prob-note prob-graph-note'},'Shading: incompatible probabilities. Open ends: curves tend to infinity.'));
  if(curves.some(c=>result[c.key]===null))q('[role=status]').textContent='A required conditioning probability is 0; that measure is undefined.';
  else if(curves.some(c=>!Number.isFinite(result[c.key])))q('[role=status]').textContent='∞ and −∞ denote limits; they are not finite points on the graph.';
 }
 build();calculate();return ()=>{masses=[...distributions[initial]];premises.input.value=original[0].trim();conclusion.input.value=original[1].trim();premises.freeze();conclusion.freeze();selected.clear();selected.add('difference');build();calculate();};
}
function mountBayes(root){
 const q=s=>root.querySelector(s),practice=root.dataset.exercise==='trick';let parameters=structuredClone(defaultBayes),progress,level=0;
 const drafts=new Map();
 if(practice){root.classList.add('prob-spam-practice');const strip=el('div',{class:'builder__levels','data-levels':'',role:'group','aria-label':'Exercise levels'}),task=el('div',{class:'prob-task','data-task':''}),status=el('p',{'data-practice-feedback':'',role:'status','aria-live':'polite'});q('[data-toolbar]').prepend(strip);q('[data-toolbar]').after(task);root.append(status);}

 const samples=[['Investment','!!URGENT!! Investment opportunity',"Dear ∀I,\nDon't miss this opportunity! Invest $2000 today and make $10,000 tomorrow. Guaranteed.",false],['Birthday','Urgent message',"Hi ∀I,\nThis is Jim, I've got a new address. Happy Birthday! Thanks again for your input yesterday, you were right on the money.",false],['Meeting','Meeting tomorrow','Hi ∀I,\nShall we meet at 10 tomorrow?',true]];
 const bank=el('div');bank.hidden=practice;q('[data-toolbar]').prepend(bank);choices(bank,samples.map(([name],i)=>[i,name]),0,i=>{subject.value=samples[i][1];body.value=samples[i][2];known.checked=samples[i][3];edit();},'Sample emails');
 const email=el('form',{class:'prob-email'}),paper=el('div',{class:'prob-letter'}),heading=el('div',{class:'prob-letter__heading'}),editButton=iconButton(root,'edit','Edit email');heading.append(el('span',{},'To: ai@uu.nl'),editButton);paper.append(heading);
 const sender=el('label',{class:'prob-sender'}),known=el('input',{type:'checkbox','aria-label':'Known sender'});sender.append('From: ',known,' Known sender');paper.append(sender);
 const subject=el('textarea',{rows:2,'aria-label':'Email subject',maxlength:500}),body=el('textarea',{rows:7,'aria-label':'Email body',maxlength:5000}),preview=el('div',{class:'prob-letter__preview'});paper.append(el('label',{},'Subject'),subject,body,preview);email.append(paper);
 const classify=iconButton(root,'check','Classify','submit');classify.append('Classify');email.append(classify);q('[data-table]').append(email);if(practice)q('[data-table]').append(q('[data-practice-feedback]'));
 const panel=q('[data-calculation]');
 function edit(){subject.hidden=body.hidden=false;preview.hidden=true;editButton.hidden=true;if(practice)showEmail();progress?.clear();panel.replaceChildren(el('p',{class:'prob-note'},'Classify the email to calculate its probability.'));q('[role=status]').textContent='';}
 editButton.onclick=()=>{edit();subject.focus();};email.oninput=()=>{panel.replaceChildren(el('p',{class:'prob-note'},'Classify to apply your changes.'));q('[role=status]').textContent='';};
 function highlighted(text,subjectLine=false){const fragment=document.createDocumentFragment(),pattern=/\burgent\b|\b(?:money|invest|investment|cash|prize)\b|[$€£]|!+/gi;let from=0;for(const m of text.matchAll(pattern)){if(/urgent/i.test(m[0])&&!subjectLine)continue;fragment.append(text.slice(from,m.index));const mark=el('mark',{},m[0]);mark.className=/urgent/i.test(m[0])?'prob-marker--urgent':/!/.test(m[0])?'prob-marker--bang':'prob-marker--money';fragment.append(mark);from=m.index+m[0].length;}fragment.append(text.slice(from));return fragment;}
 function showEmail(){preview.replaceChildren();const subj=el('p',{class:'prob-letter__subject'});subj.append(highlighted(subject.value,true));const message=el('p');message.append(highlighted(body.value));preview.append(subj,message);subject.hidden=body.hidden=true;preview.hidden=false;editButton.hidden=practice;}
 const settings=el('details',{class:'prob-settings'});settings.open=practice;settings.append(el('summary',{},'Probabilities and threshold'));const settingsBody=el('div');settings.append(settingsBody);(practice?q('[data-aside]'):q('[data-entry]')).prepend(settings);
 function drawSettings(){settingsBody.replaceChildren();const input=(name,value,change)=>{const n=el('input',{type:'number',min:0,max:1,step:.01,value,'aria-label':name});if(practice){n.disabled=name==='Spam threshold'||(name==='Pr(SPAM)'?spamLevels[level].editable!=='prior':spamLevels[level].editable!=='likelihoods');if(name!=='Pr(SPAM)'&&name!=='Spam threshold'&&!n.disabled){n.min=.05;n.max=.95;}}
  n.oninput=()=>{change(n.value===''?NaN:n.valueAsNumber);edit();};return n;};
  const top=el('div',{class:'prob-parameters'});for(const [key,label]of [['prior','Pr(SPAM)'],['threshold','Spam threshold']]){if(practice&&key==='threshold'){top.append(el('span',{class:'prob-note'},'Threshold 0.5'));continue;}const l=el('label',{},label);l.append(input(label,parameters[key],v=>parameters[key]=v));top.append(l);}settingsBody.append(top);
  if(practice)settingsBody.append(el('p',{class:'prob-note'},'Likelihoods: Pr(X | SPAM), Pr(X | ¬SPAM)'));const made=table(practice?['X','SPAM','¬SPAM']:['X','Pr(X | SPAM)','Pr(X | ¬SPAM)'],'Marker likelihoods');markerNames.forEach((name,i)=>{const row=el('tr');row.append(el('th',{scope:'row'},name.replace(/([a-z])([A-Z])/g,'$1 $2')));for(const key of ['spam','nonspam']){const td=el('td');td.append(input(`${name} given ${key}`,parameters[key][i],v=>parameters[key][i]=v));row.append(td);}made.body.append(row);});settingsBody.append(made.table);
 }
 email.onsubmit=e=>{e.preventDefault();panel.replaceChildren();try{
  const markers=emailMarkers(subject.value,body.value,known.checked),result=classifyEmail(markers,parameters);q('[role=status]').textContent='';delete q('[role=status]').dataset.state;
  showEmail();
  const made=table(['Factor','SPAM','¬SPAM'],'Likelihood factors');const priorRow=el('tr');priorRow.append(el('th',{scope:'row'},'Prior'),el('td',{},decimal(parameters.prior)),el('td',{},decimal(1-parameters.prior)));made.body.append(priorRow);markers.forEach((present,i)=>{const tr=el('tr');tr.append(el('th',{scope:'row'},`${present?'':'¬'}${markerNames[i].replace(/([a-z])([A-Z])/g,'$1 $2')}`),el('td',{},decimal(result.factors[0][i])),el('td',{},decimal(result.factors[1][i])));made.body.append(tr);});if(!practice)panel.append(made.table);
  if(!practice)panel.append(equation(`score(SPAM) = ${decimal(result.scores[0])}`),equation(`score(¬SPAM) = ${decimal(result.scores[1])}`));const calculation=el('div',{class:'prob-answer'});if(!practice)calculation.append(equation('Pr(SPAM | E) = ',fraction('score(SPAM)','score(SPAM) + score(¬SPAM)')));metric(calculation,practice?'Pr(SPAM | E)':'Posterior',result.posterior,{'data-spam-posterior':''});panel.append(calculation);
  const verdict=el('p',{class:'prob-verdict','data-classification':'','data-state':result.classification===null?'undefined':result.classification==='Spam'?'spam':'inbox'},result.classification===null?'Undefined: both scores are 0.':`${result.classification==='Spam'?'Spam':'✓ Inbox'} · threshold ${parameters.threshold}`);if(result.classification==='Spam'){
   const icon=svg('svg',{viewBox:'0 0 24 24',class:'prob-spam-icon','aria-hidden':'true'});
   icon.append(svg('path',{d:'M7 1h10l6 6v10l-6 6H7l-6-6V7Z',fill:'currentColor'}),svg('path',{d:'M12 6v8m0 4v.1',stroke:'white','stroke-width':2.5,'stroke-linecap':'round'}));verdict.prepend(icon);
  }panel.append(verdict);if(practice){const assessment=assessSpam(spamLevels[level],parameters);progress.feedback(assessment.correct,assessment.message);}
 }catch(error){q('[role=status]').textContent=error.message;q('[role=status]').dataset.state='error';if(practice)progress.feedback(false,error.message);}};
 function restore(){parameters=structuredClone(defaultBayes);subject.value=samples[0][1];body.value=samples[0][2];known.checked=false;bank.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===0)));drawSettings();edit();}
 if(practice){
  known.disabled=true;subject.readOnly=body.readOnly=true;subject.setAttribute('tabindex','-1');body.setAttribute('tabindex','-1');
  progress=levels(root,spamLevels,(item,i)=>{if(drafts.has(level))drafts.set(level,structuredClone(parameters));level=i;parameters=structuredClone(drafts.get(i)||defaultBayes);drafts.set(i,parameters);subject.value=samples[0][1];body.value=samples[0][2];known.checked=false;q('[data-task]').replaceChildren(el('strong',{},'Task'),el('p',{},item.prompt));drawSettings();edit();});progress.start();
  return ()=>{parameters=structuredClone(defaultBayes);drafts.set(level,parameters);drawSettings();edit();};
 }
 restore();return restore;
}
