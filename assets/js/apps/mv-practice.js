import {el,svg,choices,iconButton} from './boolean-ui.js';
import {membership} from '../logic/fuzzy.js';
import {levels} from './fol-levels.js';
import {mountSQL} from './sql-app.js';
import {practiceSQL,inferenceLevels,lawLevels,sqlAnswer,counterLevels,counterexample,curveLevels,ruleLevels,initialCurves,reshapeCurve,checkCurves,brakeLevels,brakingSlopes,brakeOutputSets,braking,checkBraking} from '../logic/many-valued-practice.js';
const n=x=>String(Math.round(x*1000)/1000);
const algebra=text=>text.replace(/[∧∨¬]/g,c=>({'∧':'AND','∨':'OR','¬':'NOT '}[c]));
const formula=text=>el('span',{class:'fol-formula'},text);
export function mountMVPractice(root){
 const q=s=>root.querySelector(s),kind=root.dataset.exercise,workspace=q('[data-workspace]'),task=q('[data-task]'),actions=q('[data-actions]');
 const items={inference:inferenceLevels,laws:lawLevels,curves:curveLevels,rules:ruleLevels,counterexamples:counterLevels,braking:brakeLevels}[kind];
 const isController=kind==='braking';
 let index=-1,item,state,editor,sqlPassed=false,assessment;
 const saved=new Map(),progress=levels(root,items,load),check=iconButton(root,'check','Check');check.append(' Check');
 if(items.length===1)q('[data-levels]').hidden=true;
 const reset=iconButton(root,'replay','Reset level'),full=iconButton(root,'fullscreen','Fullscreen');q('[data-practice-tools]').append(reset,full);
 full.onclick=async()=>{try{if(document.fullscreenElement===root)await document.exitFullscreen();else await root.requestFullscreen();}catch{progress.feedback(false,'Fullscreen is unavailable.');}};
 document.addEventListener('fullscreenchange',()=>{const label=document.fullscreenElement===root?'Exit fullscreen':'Fullscreen';full.setAttribute('aria-label',label);full.title=label;});
 reset.onclick=()=>{saved.delete(index);if(editor)editor.set(startSQL());else{state=initial();saved.set(index,state);draw();}sqlPassed=false;progress.clear();};
 const formatInference=i=>i.premises.join(', ')+' ∴ '+i.goal;
 function startSQL(){return `SELECT ${kind==='inference'?'SUN, RAIN, WIND FROM Valuations':'X, Y, Z FROM ValueTriples'}\nWHERE /* your condition */;`;}
 function initial(){return kind==='counterexamples'?{A:1,B:1}:isController?{mode:item.mode,low:0,middle:.3,high:.7,lowEnd:.4,mediumPeak:.5,highStart:.6,inspectSpeed:60}:initialCurves(kind==='rules'?(index===1?.25:.75):.5);}
 if(['inference','laws'].includes(kind)){
  const sqlRoot=q('[data-logic-app="sql"]');
  editor=mountSQL(sqlRoot,{setup:()=>practiceSQL,assessment:()=>assessment,onFailure:message=>{sqlPassed=false;progress.feedback(false,message);},onSuccess:verdict=>{
   sqlPassed=Boolean(verdict?.correct);
   if(!sqlPassed)progress.feedback(false,'Not yet: return exactly the counterexample rows, with the three requested columns and no duplicates.');
   else if(kind==='laws')progress.feedback(true,assessment.rows.length?'Correct: these rows refute the proposed identity.':'Correct: no input makes the two sides differ.');
   else{progress.clear();q('[data-practice-feedback]').textContent='Your query finds exactly the countermodels. Interpret the result below.';}
  }});sqlRoot.dataset.mounted='true';
  const clear=()=>{sqlPassed=false;progress.clear();};sqlRoot.addEventListener('input',clear);for(const name of ['run','reset','edit'])sqlRoot.querySelector(`[data-${name}-sql]`).addEventListener('click',clear);
  if(kind==='inference')for(const [label,valid] of [['⊨ Valid',true],['⊭ Invalid',false]]){const b=el('button',{type:'button'},label);b.onclick=()=>{if(!sqlPassed){progress.feedback(false,'First run a query that finds all countermodels.');return;}const correct=valid===(assessment.rows.length===0);progress.feedback(correct,correct?(valid?'Correct: no countermodel exists.':'Correct: the returned rows are countermodels.'):'An empty result means valid; one or more countermodels means invalid.');};actions.append(b);}
 }else actions.append(check);
 check.onclick=()=>{
  let r;
  if(kind==='counterexamples'){r=counterexample(item,state);r.message=r.correct?`Correct: ${n(r.bound)} > ${n(r.conclusion)}.`:'The conclusion must be strictly below the least premise degree. Try different values.';}
  else if(isController)r=checkBraking(state,item);
  else r=checkCurves(state,item);
  progress.feedback(r.correct,r.message);
 };
 function load(next,i){
  if(editor&&index>=0)saved.set(index,q('[data-sql-source]').value);
  index=i;item=next;progress.clear();sqlPassed=false;
  if(editor){assessment={kind:'query',columns:3,rows:sqlAnswer(item,kind)};setTask(kind==='inference'?'Find the countermodels, then decide whether the inference is valid.':item.label+': find the inputs where the two sides differ.',formula(kind==='inference'?formatInference(item):algebra(item.left+' = '+item.right)));editor.set(saved.get(i)||startSQL());return;}
  state=saved.get(i)||initial();saved.set(i,state);draw();
 }
 function control(parent,label,min,max,value,change,step=.05){
  const wrap=el('label',{class:'mv-practice-control'}),out=el('output',{},n(value)),input=el('input',{type:'range',min,max,step,value,'aria-label':label});wrap.append(el('span',{},label),out,input);parent.append(wrap);input.oninput=()=>{change(Number(input.value));out.textContent=n(Number(input.value));progress.clear();refreshOutputs();};
 }
 function graph(maxX,label){
  const canvas=svg('svg',{viewBox:'0 0 620 320',role:'group','aria-label':label,class:'mv-practice-graph'}),sx=x=>45+x/maxX*550,sy=y=>270-y*240;
  for(const y of [0,.25,.5,.75,1])canvas.append(svg('line',{x1:45,y1:sy(y),x2:595,y2:sy(y),class:'mv-grid'}),svg('text',{x:35,y:sy(y)+5,'text-anchor':'end'},n(y)));
  for(const x of [0,maxX/4,maxX/2,3*maxX/4,maxX])canvas.append(svg('text',{x:sx(x),y:296,'text-anchor':'middle'},n(x)));
  return {canvas,sx,sy};
 }
 function path(canvas,points,sx,sy,color,dashed=false){canvas.append(svg('path',{d:points.map(([x,y],i)=>`${i?'L':'M'}${sx(x)},${sy(y)}`).join(' '),fill:'none',stroke:color,'stroke-width':3,'stroke-dasharray':dashed?'6 4':'none'}));}
 function setTask(text,...content){task.replaceChildren(el('strong',{},'Task'),el('p',{},text),...content);}
 let selected='Fast',speed=60,drag=null;
 function draw(){
  workspace.replaceChildren();task.replaceChildren();
  if(kind==='counterexamples'){
   setTask(item.label+': find a counterexample.',formula(formatInference(item)));const fields=el('div',{class:'mv-practice-values'});workspace.append(fields);
   for(const name of ['A','B'])control(fields,`v(${name})`,0,1,state[name],value=>{state[name]=value;});
   workspace.append(el('div',{'data-live':''}));refreshOutputs();return;
  }
  if(isController){drawBrake();return;}
  setTask(item.prompt,...(item.rules?[formula(item.rules.join('   ·   '))]:[]));
  const tabs=el('div',{class:'mv-examples'});choices(tabs,['Fast','Slow'],selected,key=>{selected=key;draw();},'Predicate');workspace.append(tabs);
  const {canvas,sx,sy}=graph(120,'Speed memberships: pull a curve up or down');
  if(['overlap','gap'].includes(item.kind)||item.overlap)canvas.prepend(svg('rect',{x:sx(40),y:30,width:sx(80)-sx(40),height:240,class:'mv-gray-band'}));
  for(const name of [selected==='Fast'?'Slow':'Fast',selected])path(canvas,state[name],sx,sy,name==='Fast'?'var(--red-ink)':'var(--blue-gfx)');
  const change=(x,value,source=state[selected])=>{speed=Math.max(0,Math.min(120,Math.round(x)));state[selected]=reshapeCurve(source,speed,Math.round(Math.max(0,Math.min(1,value))*100)/100);progress.clear();draw();};
  const position=e=>{const c=workspace.querySelector('.mv-practice-graph'),p=new DOMPoint(e.clientX,e.clientY).matrixTransform(c.getScreenCTM().inverse());return [(p.x-45)*120/550,(270-p.y)/240];};
  const grab=(e,x)=>{e.preventDefault();const [,y]=position(e);speed=Math.max(0,Math.min(120,Math.round(x)));drag={x:speed,dy:membership(state[selected],speed)-y,source:state[selected].map(p=>[...p])};workspace.setPointerCapture(e.pointerId);draw();};
  const hit=svg('path',{d:state[selected].map(([x,y],i)=>`${i?'L':'M'}${sx(x)},${sy(y)}`).join(' '),class:'mv-curve-hit',fill:'none',stroke:'transparent','stroke-width':22,role:'button',tabindex:0,'aria-label':`${selected} curve: left and right choose a speed; up and down change its degree`});
  hit.onpointerdown=e=>grab(e,position(e)[0]);
  hit.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();
   if(e.key==='ArrowLeft'||e.key==='ArrowRight'){speed=Math.max(0,Math.min(120,speed+(e.key==='ArrowLeft'?-10:10)));draw();}
   else change(speed,membership(state[selected],speed)+(e.key==='ArrowUp'?.05:-.05));
   workspace.querySelector('.mv-curve-hit').focus({preventScroll:true});
  };canvas.append(hit);
  const checkpoints=[...(kind==='curves'?[0,120]:[]),...(['overlap','gap'].includes(item.kind)||item.overlap?[40,80]:[])].sort((a,b)=>a-b);
  for(const x of checkpoints){
   const y=membership(state[selected],x),dot=svg('circle',{cx:sx(x),cy:sy(y),r:5,fill:selected==='Fast'?'var(--red-ink)':'var(--blue-gfx)',class:'mv-checkpoint',role:'button',tabindex:0,'aria-label':`${selected} at ${x} km/h: ${n(y)}`});
   dot.onpointerdown=e=>grab(e,x);dot.onkeydown=e=>{if(['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();change(x,y+(e.key==='ArrowUp'?.05:-.05));workspace.querySelectorAll('.mv-checkpoint')[checkpoints.indexOf(x)].focus({preventScroll:true});}};canvas.append(dot);
  }
  canvas.append(svg('text',{x:595,y:317,'text-anchor':'end'},'Speed (km/h)'));workspace.append(canvas);
  const field=el('div',{class:'mv-practice-point'}),at=el('label',{},'Speed (km/h) '),xInput=el('input',{type:'number',min:0,max:120,step:1,value:speed,'aria-label':'Selected speed'}),degreeLabel=el('label',{},`${selected} `),input=el('input',{type:'number',min:0,max:1,step:.01,value:n(membership(state[selected],speed)),'aria-label':'Selected membership degree'});
  xInput.onchange=()=>{if(xInput.value!==''&&xInput.checkValidity()){speed=xInput.valueAsNumber;draw();}};
  input.onchange=()=>{if(input.value!==''&&input.checkValidity())change(speed,input.valueAsNumber);};at.append(xInput);degreeLabel.append(input);field.append(at,degreeLabel);workspace.append(field);
  workspace.onpointermove=e=>{if(!drag)return;change(drag.x,position(e)[1]+drag.dy,drag.source);};workspace.onpointerup=workspace.onpointercancel=workspace.onlostpointercapture=()=>{drag=null;};

 }
 function numeric(parent,label,key,min,max,step,scale=1){
  const wrap=el('label',{class:'mv-practice-number'},label),input=el('input',{type:'number',min,max,step,value:n(state[key]*scale),'aria-label':label});
  input.onchange=()=>{
   if(!input.value||!Number.isFinite(input.valueAsNumber)||!input.checkValidity()){input.reportValidity();return;}
   state[key]=input.valueAsNumber/scale;progress.clear();draw();root.querySelector(`[aria-label="${label}"]`)?.focus({preventScroll:true});
  };wrap.append(input);parent.append(wrap);
 }
 function drawBrake(){
  setTask(item.prompt);
  const controls=el('div',{class:'mv-brake-settings'});
  const table=el('table',{class:'mv-practice-table mv-brake-rules'}),head=el('thead'),row=el('tr'),body=el('tbody');
  for(const label of ['Rule','Recommended output'])row.append(el('th',{scope:'col'},label));head.append(row);table.append(head,body);
  for(const [name,key,set] of [['Slow','low','Low'],['Moderate','middle','Medium'],['Fast','high','High']]){
   const tr=el('tr'),out=el('td');tr.append(el('th',{scope:'row'},name+'(x) ↦'+(item.mode==='mamdani'?' '+set:'')),out);
   if(item.mode==='sugeno')numeric(out,name+' output',key,0,1,.05);
   else if(key==='low')numeric(out,'Low ends at','lowEnd',.05,.95,.05);
   else if(key==='middle')numeric(out,'Medium peaks at','mediumPeak',.2,.8,.05);
   else numeric(out,'High starts at','highStart',.05,.95,.05);
   body.append(tr);
  }
  controls.append(table);workspace.append(controls);
  if(item.mode==='mamdani'){
   const label=el('label',{class:'mv-brake-speed'}),value=el('output',{'data-inspect-speed':''},`${state.inspectSpeed} km/h`);
   const input=el('input',{type:'range',min:0,max:120,step:1,value:state.inspectSpeed,'aria-label':'Inspect speed (km/h)','data-speed-selector':''});
   input.oninput=()=>inspectSpeed(Number(input.value));
   label.append(el('span',{},'Speed'),value,input);workspace.append(label);
  }
  workspace.append(el('div',{'data-live':''}));refreshOutputs();
 }

 function inspectSpeed(value){
  state.inspectSpeed=Math.max(0,Math.min(120,Math.round(value)));
  q('[data-speed-selector]').value=state.inspectSpeed;
  q('[data-inspect-speed]').textContent=`${state.inspectSpeed} km/h`;
  refreshOutputs();
 }
 function refreshOutputs(){
  const live=workspace.querySelector('[data-live]');live.replaceChildren();
  if(kind==='counterexamples'){
   const r=counterexample(item,state),table=el('table',{class:'mv-practice-table'}),body=el('tbody');
   [...item.premises,item.goal].forEach((f,i)=>{const row=el('tr');row.append(el('th',{scope:'row'},(i===item.premises.length?'∴ ':'')+f),el('td',{},n(i===item.premises.length?r.conclusion:r.premises[i])));body.append(row);});table.append(body);live.append(table);return;
  }
  const plots=el('div',{class:'mv-brake-plots'}),powerPlot=el('div');plots.append(powerPlot);live.append(plots);
  const {canvas,sx,sy}=graph(120,'Braking power by speed');
  const points=Array.from({length:301},(_,i)=>{const d=i*120/300;return [d,braking(d,state)];});
  path(canvas,points.map(([d,r])=>[d,r.output]),sx,sy,'var(--red-ink)');
  if(item.smooth){
   const y=braking(60,state).output,{left,right}=brakingSlopes(state);
   canvas.append(svg('line',{x1:sx(60),y1:30,x2:sx(60),y2:270,class:'mv-grid','stroke-dasharray':'3 4'}));
   path(canvas,[[40,y-20*left],[60,y]],sx,sy,'var(--blue-ink)',true);
   path(canvas,[[60,y],[80,y+20*right]],sx,sy,'var(--blue-ink)',true);
   canvas.append(svg('circle',{cx:sx(60),cy:sy(y),r:6,fill:'var(--paper)',stroke:'var(--red-ink)','stroke-width':2}));
  }
  canvas.append(svg('text',{x:45,y:17},'Power'),svg('text',{x:595,y:317,'text-anchor':'end'},'Speed (km/h)'));powerPlot.append(canvas);
  if(item.smooth)powerPlot.append(el('p',{class:'mv-practice-legend'},'The dashed guides show the direction of the curve on each side of 60 km/h. Make them line up.'));
  if(item.mode==='mamdani'){
   const at=state.inspectSpeed,result=braking(at,state),colors=['var(--blue-ink)','var(--green-ink)','var(--red-ink)'];
   canvas.append(svg('line',{x1:sx(at),y1:30,x2:sx(at),y2:270,class:'mv-inspect-guide'}),svg('circle',{cx:sx(at),cy:sy(result.output),r:6,class:'mv-inspect-point','data-selected-power':n(result.output)}));
   canvas.classList.add('mv-select-speed');
   canvas.onclick=e=>{const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(canvas.getScreenCTM().inverse());inspectSpeed((p.x-45)*120/550);};
   const sets=graph(1,`Mamdani at ${at} km/h: clipped output sets, combined area, and centroid power ${n(result.output)}`);
   sets.canvas.classList.add('mv-output-sets');
   const shape=result.aggregate.map(([x,y],i)=>`${i?'L':'M'}${sets.sx(x)},${sets.sy(y)}`).join(' ');
   sets.canvas.append(svg('path',{d:`M${sets.sx(0)},${sets.sy(0)}L${shape.slice(1)}L${sets.sx(1)},${sets.sy(0)}Z`,class:'mv-aggregate-area','data-combined-area':''}));
   brakeOutputSets(state).forEach((curve,i)=>{
    const original=svg('g',{class:'mv-original-set'});path(original,curve,sets.sx,sets.sy,colors[i],true);sets.canvas.append(original);
   });
   path(sets.canvas,result.aggregate,sets.sx,sets.sy,'var(--ink)');
   result.clipped.forEach((curve,i)=>{
    const clipped=svg('g',{'data-clipped-set':['Low','Medium','High'][i],'data-clip-height':n(result.weights[i])});
    path(clipped,curve,sets.sx,sets.sy,colors[i]);sets.canvas.append(clipped);
   });
   sets.canvas.append(svg('line',{x1:sets.sx(result.output),y1:30,x2:sets.sx(result.output),y2:270,class:'mv-centroid-line','data-centroid':n(result.output)}),svg('path',{d:`M${sets.sx(result.output)-6},277L${sets.sx(result.output)},267L${sets.sx(result.output)+6},277Z`,class:'mv-centroid-marker'}));
   sets.canvas.append(svg('text',{x:45,y:17},'Degree'),svg('text',{x:595,y:317,'text-anchor':'end'},'Power'));
   const panel=el('div'),heights=el('p',{class:'mv-clip-heights','data-clip-heights':''});
   ['Low','Medium','High'].forEach((name,i)=>heights.append(el('span',{style:`--set-color:${colors[i]}`},`${name} ≤ ${n(result.weights[i])}`)));
   panel.append(heights,sets.canvas,el('p',{class:'mv-centroid-readout','data-centroid-output':'',role:'status'},`Centroid power: ${n(result.output)}`));plots.append(panel);
   live.append(el('p',{class:'mv-practice-legend'},'Dashed: original sets · Solid: clipped sets · Shaded: combined area'));
  }
  const r=checkBraking(state,item);live.append(el('p',{'data-controller-output':''},'Power — '+r.outputs.map((v,i)=>`${[0,60,120][i]} km/h: ${n(v)}`).join(' · ')));

 }
 progress.start();q('[data-app-fallback]').remove();
}
