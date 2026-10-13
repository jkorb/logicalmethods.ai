import {mountAircon} from './aircon-controller.js';
import {mountDefuzzify} from './defuzzify.js';
import { parseBoolean, evaluateTrace, worldsFor, readInference } from '../logic/boolean.js';
import { fuzzyCurves, membership, parseFuzzy, formulaCurve, parseRule, checkRule, parseController, control } from '../logic/fuzzy.js';
import { el, svg, choices, iconButton } from './boolean-ui.js';
import { drawWorlds } from './boolean-worlds.js';
import { enableLatexInput, convertInput } from './latex-input.js';
const value = n => n === .5 ? 'ω' : String(n);
const decimal = n => String(Math.round(n*100)/100);
const colors = {IsCold:'var(--mv-cold)',IsWarm:'var(--mv-warm)',IsHot:'var(--mv-hot)',HeatingOn:'var(--mv-heater)'};
export function mountManyValued(root) {
  if(root.dataset.kind==='aircon'){mountAircon(root);return;}
  if(root.dataset.kind==='defuzzify'){mountDefuzzify(root);return;}
  const q = s => root.querySelector(s), form=q('form'), input=q('[data-formula]'), toolbar=q('[data-toolbar]'), status=q('[role=status]');
  const edit=iconButton(root,'edit','Edit'),check=iconButton(root,'check','Check','submit'),reset=iconButton(root,'replay','Reset');
  check.append(el('span',{},'Check'));
  const inputWrap=el('div',{class:'logic-app__input-wrap'});input.before(inputWrap);inputWrap.append(input,edit);edit.classList.add('logic-app__edit');form.append(check);toolbar.append(reset);
  if(['memberships','policy'].includes(root.dataset.kind))form.hidden=true;
  const fullscreen=iconButton(root,'fullscreen','Fullscreen');toolbar.append(fullscreen);
  fullscreen.addEventListener('click',async()=>{
    try {if(document.fullscreenElement===root)await document.exitFullscreen();else await root.requestFullscreen();}
    catch {status.textContent='Fullscreen is unavailable in this browser.';}
  });
  document.addEventListener('fullscreenchange',()=>{const label=document.fullscreenElement===root?'Exit fullscreen':'Fullscreen';fullscreen.setAttribute('aria-label',label);fullscreen.title=label;});
  const freeze=()=>{input.readOnly=true;edit.hidden=false;delete root.dataset.dirty;};
  let run,restore;
  const invalidate=()=>{root.dataset.dirty='true';status.textContent='';status.removeAttribute('data-state');};
  edit.addEventListener('click',()=>{input.readOnly=false;edit.hidden=true;invalidate();input.focus();});
  enableLatexInput(input,invalidate);
  form.addEventListener('submit',e=>{e.preventDefault();convertInput(input);if(run())freeze();});
  if(root.dataset.kind==='models')({run,restore}=mountModels(root,input,freeze));
  else ({run,restore}=mountFuzzy(root,input,freeze));
  reset.addEventListener('click',()=>{restore();freeze();});
  q('[data-app-fallback]').remove();
}
function mountModels(root,input,freeze) {
  const q=s=>root.querySelector(s), status=q('[role=status]'), inspector=q('[data-inspector]'), controls=q('[data-controls]');
  const worlds=worldsFor(2,'k3');let selected=worlds[8], parsed;
  const examples=[['Disjunctive syllogism','SUN ∨ RAIN\n¬SUN\n∴ RAIN'],['Excluded middle','∴ SUN ∨ ¬SUN'],['Explosion','SUN\n¬SUN\n∴ RAIN'],['Modus ponens','SUN\nSUN → RAIN\n∴ RAIN'],['Converse error','SUN → RAIN\nRAIN\n∴ SUN']];
  const bank=el('div',{class:'mv-examples'});q('[data-toolbar]').prepend(bank);
  choices(bank,examples.map(([label],i)=>[i,label]),0,i=>{input.value=examples[i][1];freeze();run();},'Inference examples');
  function inspect() {
    inspector.replaceChildren();
    const values=el('div',{class:'mv-assignments'});
    for(const name of ['SUN','RAIN']) {
      const row=el('div'),buttons=el('span');row.append(el('span',{class:'boolean-app__formula'},`v(${name}) = `),buttons);
      choices(buttons,[[0,'0'],[.5,'ω'],[1,'1']],selected[name],v=>{selected=worlds.find(w=>w[name]===v&&w[name==='SUN'?'RAIN':'SUN']===selected[name==='SUN'?'RAIN':'SUN']);inspect();},`Value of ${name}`);values.append(row);
    }
    controls.replaceChildren(values);
    inspector.append(el('p',{},selected.id));
    if(parsed) {
      const table=el('table'),head=el('thead'),hr=el('tr');
      for(const label of ['Formula','Value'])hr.append(el('th',{scope:'col'},label));head.append(hr);table.append(head);
      const body=el('tbody');
      parsed.forEach(({source,tree},i)=>{const row=el('tr');row.append(el('th',{scope:'row'},`${i===parsed.length-1?'∴ ':''}${source}`),el('td',{},value(evaluateTrace(tree,selected,'k3').at(-1).value)));body.append(row);});table.append(body);inspector.append(table);
    }
    root.querySelectorAll('[data-model]').forEach(b=>b.classList.toggle('is-inspected',b.dataset.model===selected.id));
  }
  function run() {
    try {
      const {premises,conclusion}=readInference(input.value);
      const candidate=[...premises,conclusion].map(source=>({source,...parseBoolean(source)}));
      if(candidate.some(p=>p.names.some(n=>!['SUN','RAIN'].includes(n))))throw Error('Use SUN and RAIN in this model space.');
      parsed=candidate;
      const rows=worlds.map(w=>({world:w,values:parsed.map(p=>evaluateTrace(p.tree,w,'k3').at(-1).value)}));
      const live=rows.filter(r=>r.values.slice(0,-1).every(v=>v===1));
      const bad=live.filter(r=>r.values.at(-1)!==1);
      drawWorlds(root,worlds,{selected:bad.map(r=>r.world.id),countermodels:true,onSelect:w=>{selected=w;inspect();}});
      for(const r of live)root.querySelector(`[data-world-art="${r.world.id}"]`).classList.add('mv-premises');
      status.dataset.state=bad.length?'counterexample':'success';
      status.textContent=bad.length?`Invalid: ${bad.map(r=>r.world.id).join(', ')} ${bad.length===1?'is a countermodel':'are countermodels'}. The premises are 1; the conclusion is 0 or ω.`:live.length?'Valid: every world with premises valued 1 also gives the conclusion 1.':'Valid: no world gives all premises 1.';
      inspect();return true;
    }catch(e){parsed=null;q('[data-picture]').replaceChildren();inspector.replaceChildren();controls.replaceChildren();status.dataset.state='error';status.textContent=e.message;return false;}
  }
  function restore(){input.value=examples[0][1];selected=worlds[8];bank.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===0)));run();}
  restore();return {run,restore};
}
function mountFuzzy(root,input,freeze) {
  const q=s=>root.querySelector(s),kind=root.dataset.kind,status=q('[role=status]'),picture=q('[data-picture]'),inspector=q('[data-inspector]'),controls=q('[data-controls]');
  const diagramOnly=['memberships','policy'].includes(kind);
  const names=kind==='policy'?['IsCold']:kind==='rules'?Object.keys(fuzzyCurves):Object.keys(fuzzyCurves).slice(0,3);
  const original=diagramOnly?'':kind==='predicates'?'IsCold(x) ∨ IsWarm(x)':kind==='rules'?'IsCold(x) ⇒ HeatingOn(x)':'IsCold(x) ↦ 1\nIsWarm(x) ↦ 0\nIsHot(x) ↦ 0';
  let curves=structuredClone(fuzzyCurves),temperature=15,active='IsCold',point=1,compiled,drag=null;
  let operation='or',other='IsWarm',operationButtons,otherButtons;
  const combinations=()=>({not:`¬${active}(x)`,and:`${active}(x) ∧ ${other}(x)`,or:`${active}(x) ∨ ${other}(x)`});
  function syncOperations(){
    if(!operationButtons)return;
    for(const b of operationButtons.querySelectorAll('button')){const formula=combinations()[b.dataset.choice];b.title=formula;b.setAttribute('aria-label',formula);b.setAttribute('aria-pressed',String(operation===b.dataset.choice));}
    otherButtons.hidden=operation==='not'||operation===null;
    for(const b of otherButtons.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.choice===other));
  }
  const palette=el('div',{class:'mv-examples'});q('[data-toolbar]').prepend(palette);
  choices(palette,names.map(n=>[n,`⟦${n}⟧`]),active,n=>{const previous=active;active=n;if(other===n)other=previous;if(kind==='predicates'&&operation){input.value=combinations()[operation];run();}else draw();},'Predicate interpretation');
  if(kind==='policy')palette.replaceChildren(el('span',{class:'boolean-app__formula'},'h = ⟦IsCold⟧(T)'));
  // The controller is about its rules, so its examples are rule sets with
  // different recommendations; the memberships stay as the chapter set them.
  const ruleSets=[['Off when warm',original],['Low when warm','IsCold(x) ↦ 1\nIsWarm(x) ↦ 0.2\nIsHot(x) ↦ 0'],['Cold only','IsCold(x) ↦ 1']];
  if(kind==='controller')choices(palette,ruleSets.map(([label],i)=>[i,label]),0,i=>{input.value=ruleSets[i][1];run();},'Rule sets');
  if(kind==='predicates'){
    const tools=el('div',{class:'mv-operation-tools'});operationButtons=el('div',{class:'mv-operations'});otherButtons=el('div',{class:'mv-other-predicate'});tools.append(operationButtons,otherButtons);root.querySelector('form').after(tools);
    choices(operationButtons,[['not','¬'],['and','∧'],['or','∨']],'or',key=>{operation=key;input.value=combinations()[key];run();},'Combine predicates');
    choices(otherButtons,names.map(n=>[n,n]),other,n=>{other=n;input.value=combinations()[operation];run();},'Second predicate');
    otherButtons.prepend(el('span',{},'with'));syncOperations();
  }
  const canvas=svg('svg',{viewBox:'0 0 620 340',role:'group','aria-label':kind==='controller'?'Fuzzy interpretations and the controller output':'Fuzzy interpretations; select a point and use arrow keys or drag to change it'});picture.append(canvas);
  const label=el('label'),slider=el('input',{type:'range',min:0,max:30,step:.1,value:temperature,'aria-label':'Temperature'}),readout=el('output');label.append('Temperature ',readout,slider);controls.append(label);
  slider.addEventListener('input',()=>{temperature=Number(slider.value);draw();});
  const plot={x:48,y:28,w:548,h:254},sx=x=>plot.x+x/30*plot.w,sy=y=>plot.y+(1-y)*plot.h;
  function updatePoint(x,y){const ps=curves[active];ps[point]=[point===0||point===ps.length-1?ps[point][0]:Math.max(ps[point-1][0]+.1,Math.min(ps[point+1][0]-.1,x)),Math.max(0,Math.min(1,y))];draw();}
  canvas.addEventListener('pointermove',e=>{if(!drag)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(canvas.getScreenCTM().inverse());updatePoint((p.x-plot.x)/plot.w*30,1-(p.y-plot.y)/plot.h);});
  const release=()=>{drag=null;};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  function curve(points,color,result=false,selected=false){
    const d=points.map(([x,y],i)=>`${i?'L':'M'}${sx(x)},${sy(y)}`).join(' ');
    if(result){
      canvas.append(svg('path',{d:`${d} L${sx(points.at(-1)[0])},${sy(0)} L${sx(points[0][0])},${sy(0)} Z`,class:'mv-result-area'}));
      canvas.append(svg('path',{d,fill:'none',stroke:'var(--paper)','stroke-width':10}));
    }
    canvas.append(svg('path',{d,fill:'none',stroke:result?'var(--mv-result)':color,'stroke-width':result||selected?5:3,class:result?'mv-result-curve':selected?'mv-base-curve is-active':'mv-base-curve'}));
    if(result)canvas.append(svg('circle',{cx:sx(temperature),cy:sy(membership(points,temperature)),r:6,class:'mv-result-point'}));
  }
  function draw() {
    const focused=document.activeElement?.getAttribute('data-point');canvas.replaceChildren();
    canvas.append(svg('title',{},'Degrees of membership by temperature'));
    for(const x of [0,10,20,30]) {canvas.append(svg('line',{x1:sx(x),y1:sy(0),x2:sx(x),y2:sy(1),class:'mv-grid'}),svg('text',{x:sx(x),y:306,'text-anchor':'middle'},String(x)));}
    for(const y of [0,.5,1])canvas.append(svg('line',{x1:sx(0),y1:sy(y),x2:sx(30),y2:sy(y),class:'mv-grid'}),svg('text',{x:34,y:sy(y)+5,'text-anchor':'end'},decimal(y)));
    canvas.append(svg('text',{x:595,y:332,'text-anchor':'end'},'°C'));
    canvas.classList.toggle('has-result',!!compiled&&input.readOnly&&['predicates','controller'].includes(kind));
    for(const name of names)curve(curves[name],colors[name],false,kind==='memberships'&&name===active);
    if(compiled&&input.readOnly){if(kind==='predicates')curve(formulaCurve(compiled,curves),'var(--ink)',true);else if(kind==='controller')curve(Array.from({length:121},(_,i)=>{const x=i/4;return [x,control(compiled,curves,x).output];}),'var(--ink)',true);}
    canvas.append(svg('line',{x1:sx(temperature),y1:sy(0),x2:sx(temperature),y2:sy(1),class:'mv-temperature'}));
    if(kind==='policy'){
      const degree=membership(curves.IsCold,temperature),x=sx(temperature),y=sy(degree),d=`M${x},${sy(0)} V${y} H607`;
      canvas.append(svg('path',{d,fill:'none',stroke:'var(--paper)','stroke-width':7}),svg('path',{d,class:'mv-policy-flow'}),svg('circle',{cx:x,cy:y,r:6,class:'mv-policy-point'}),svg('path',{d:`M600,${y-6} L610,${y} L600,${y+6}`,class:'mv-policy-arrow'}));
    }
    if(kind!=='controller')curves[active].forEach(([x,y],i)=>{
      const dot=svg('circle',{cx:sx(x),cy:sy(y),r:7,fill:colors[active],class:'mv-knot',role:'button',tabindex:0,'aria-label':`${active} point ${i+1}: ${decimal(x)}°C, ${decimal(y)}`,'data-point':i,'aria-pressed':String(i===point)});
      dot.addEventListener('pointerdown',e=>{e.preventDefault();point=i;drag=true;canvas.setPointerCapture(e.pointerId);dot.focus();});
      dot.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();point=i;updatePoint(x+(e.key==='ArrowRight'?.5:e.key==='ArrowLeft'?-.5:0),y+(e.key==='ArrowUp'?.05:e.key==='ArrowDown'?-.05:0));}});canvas.append(dot);
    });
    if(focused!==null&&focused!==undefined)canvas.querySelector(`[data-point="${focused}"]`)?.focus({preventScroll:true});
    readout.textContent=`${decimal(temperature)}°C`;inspector.replaceChildren();
    const legend=el('div',{class:'mv-legend'});
    for(const name of names){const item=el('span',{},`${name}: ${decimal(membership(curves[name],temperature))}`);item.style.setProperty('--swatch',colors[name]);legend.append(item);}inspector.append(legend);
    const p=curves[active][point],edit=el('div',{class:'mv-point-editor'});
    for(const [axis,title,min,max,step] of [[0,'Temperature of selected point',0,30,.5],[1,'Membership of selected point',0,1,.05]]){
      const l=el('label',{},axis?'Degree ':'Point °C '),f=el('input',{type:'number',min,max,step,value:decimal(p[axis]),'aria-label':title});l.append(f);edit.append(l);
      f.addEventListener('change',()=>{if(f.value!==''&&Number.isFinite(f.valueAsNumber))updatePoint(axis?p[0]:f.valueAsNumber,axis?f.valueAsNumber:p[1]);});
    }
    if(kind!=='controller')inspector.append(edit);
    if(kind==='memberships'){status.textContent='';status.removeAttribute('data-state');return;}
    if(kind==='policy'){
      const degree=membership(curves.IsCold,temperature),power=decimal(degree*100),panel=el('div',{class:'mv-policy-output'});
      const meter=el('meter',{min:0,max:1,value:degree,'aria-label':'Heating power'});
      panel.append(el('span',{},'Heating power'),el('output',{'data-heating-power':''},`${power}%`),meter);inspector.prepend(panel);
      status.dataset.state='success';status.textContent=`${decimal(temperature)}°C → coldness ${decimal(degree)} → ${power}% power.`;return;
    }
    if(!compiled||!input.readOnly){status.textContent='';status.removeAttribute('data-state');return;}
    if(kind==='predicates'){status.dataset.state='success';status.textContent=`At ${decimal(temperature)}°C the formula has degree ${decimal(membership(formulaCurve(compiled,curves),temperature))}. The purple curve shows its interpretation.`;}
    else if(kind==='rules'){
      const results=compiled.map(rule=>checkRule(rule,curves)),bad=results.findIndex(r=>!r.valid),result=results[bad];status.dataset.state=bad<0?'success':'counterexample';status.textContent=bad<0?`${results.length===1?'The rule holds':'All rules hold'} throughout 0–30°C: antecedents never exceed their consequents.`:`Rule ${bad+1} fails at ${decimal(result.x)}°C: ${decimal(result.a)} > ${decimal(result.b)}. The consequent needs at least the antecedent’s degree.`;
    }else{
      const result=control(compiled,curves,temperature),table=el('table'),head=el('thead'),tr=el('tr');
      for(const t of ['If…','Weight','Power'])tr.append(el('th',{scope:'col'},t));head.append(tr);table.append(head);const body=el('tbody');
      for(const r of result.rows){const row=el('tr');row.append(el('th',{scope:'row'},r.source),el('td',{},decimal(r.weight)),el('td',{},decimal(r.output)));body.append(row);}table.append(body);inspector.append(table);
      status.dataset.state='success';status.textContent=result.total?`Heating: ${decimal(result.output*100)}%. (${result.rows.map(r=>`${decimal(r.weight)} × ${decimal(r.output)}`).join(' + ')}) ÷ ${decimal(result.total)}.`:'No rule applies. Fallback: heating off (0%).';
    }
  }
  function run(){if(diagramOnly){freeze();draw();return true;}try{convertInput(input);compiled=kind==='predicates'?parseFuzzy(input.value,names):kind==='rules'?input.value.trim().split('\n').filter(s=>s.trim()).map(s=>parseRule(s,names)):parseController(input.value,names);if(kind==='rules'&&(!compiled.length||compiled.length>8))throw Error('Use one to eight rules, one per line.');freeze();if(operationButtons){operation=Object.keys(combinations()).find(k=>input.value===combinations()[k])||null;syncOperations();}draw();return true;}catch(e){compiled=null;draw();status.dataset.state='error';status.textContent=e.message;return false;}}
  input.addEventListener('input',()=>{compiled=null;draw();});root.querySelector('button[aria-label="Edit"]').addEventListener('click',draw);
  function restore(){active='IsCold';other='IsWarm';operation='or';palette.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.choice===(kind==='controller'?'0':active))));curves=structuredClone(fuzzyCurves);temperature=15;slider.value=15;input.value=original;point=1;run();}
  restore();return {run,restore};
}
