import {aircon,airconCurves,coolingSets,membership,airconDefaults,parseAirconRules} from '../logic/fuzzy.js';
import {el,svg,choices,iconButton} from './boolean-ui.js';
import {enableLatexInput,convertInput} from './latex-input.js';
const dec=n=>String(Math.round(n*100)/100),pct=n=>String(Math.round(n*1000)/10);
const colors=['var(--mv-warm)','var(--mv-hot)','var(--mv-cold)'];
export function mountAircon(root){
 let temperature=26,humidity=70,mode='sugeno',sources={...airconDefaults};
 let ruleSets=Object.fromEntries(Object.entries(sources).map(([key,source])=>[key,parseAirconRules(source,key)]));
 const toolbar=root.querySelector('[data-toolbar]'),modes=el('div',{class:'mv-examples'});
 toolbar.append(modes);choices(modes,[['sugeno','Sugeno'],['mamdani','Mamdani']],mode,key=>{sources[mode]=input.value;mode=key;input.value=sources[mode];if(input.value===appliedSources[mode])freeze();else editRules();draw();},'Controller output');
 const reset=iconButton(root,'replay','Reset'),full=iconButton(root,'fullscreen','Fullscreen');toolbar.append(reset,full);
 const appliedSources={...sources},form=el('form',{class:'mv-form'}),wrap=el('div',{class:'logic-app__input-wrap'});
 const input=el('textarea',{class:'logic-app__input',rows:3,maxlength:1200,'aria-label':'Controller rules',readonly:'',spellcheck:'false'});
 const edit=iconButton(root,'edit','Edit'),check=iconButton(root,'check','Check','submit');edit.classList.add('logic-app__edit');check.append(el('span',{},'Check'));
 wrap.append(input,edit);form.append(wrap,check);toolbar.after(form);input.value=sources[mode];
 function freeze(){input.readOnly=true;edit.hidden=false;delete root.dataset.dirty;}
 function editRules(){input.readOnly=false;edit.hidden=true;root.dataset.dirty='true';}
 edit.onclick=()=>{editRules();draw();input.focus();};
 enableLatexInput(input,()=>{editRules();draw();});
 form.onsubmit=e=>{
  e.preventDefault();convertInput(input);
  try{const parsed=parseAirconRules(input.value,mode);ruleSets[mode]=parsed;sources[mode]=input.value;appliedSources[mode]=input.value;freeze();draw();}
  catch(error){editRules();draw();status.dataset.state='error';status.textContent=error.message;}
 };
 full.onclick=async()=>{try{if(document.fullscreenElement===root)await document.exitFullscreen();else await root.requestFullscreen();}catch{status.textContent='Fullscreen is unavailable in this browser.';}};
 document.addEventListener('fullscreenchange',()=>{const label=document.fullscreenElement===root?'Exit fullscreen':'Fullscreen';full.setAttribute('aria-label',label);full.title=label;});
 const diagram=el('div',{class:'mv-flow'}),inputs=el('div',{class:'mv-flow-stage'}),rules=el('div',{class:'mv-flow-stage'}),output=el('div',{class:'mv-flow-stage'});
 for(const [section,title] of [[inputs,'Memberships'],[rules,'Rule weights'],[output,'Output']])section.append(el('h3',{class:'nocount'},title));
 for(const [i,section] of [inputs,rules,output].entries()){if(i)diagram.append(el('span',{class:'mv-flow-arrow','aria-hidden':'true'},'→'));diagram.append(section);}
 root.querySelector('[data-aircon]').append(diagram);
 const temperaturePlot=makePlot('Temperature memberships'),humidityPlot=makePlot('Humidity membership');
 const controls=[];
 function slider(parent,label,min,max,current,changed){
  const wrap=el('label',{class:'mv-measurement'}),readout=el('output'),input=el('input',{type:'range',min,max,step:1,value:current,'aria-label':label});
  wrap.append(el('span',{},label+' '),readout,input);parent.append(wrap);input.oninput=()=>{changed(Number(input.value));draw();};controls.push({input,readout});
 }
 inputs.append(temperaturePlot);slider(inputs,'Temperature',16,36,temperature,v=>{temperature=v;});inputs.append(humidityPlot);slider(inputs,'Relative humidity',0,100,humidity,v=>{humidity=v;});
 const ruleBox=el('div',{class:'mv-flow-rules'});rules.append(ruleBox);
 const outputPlot=makePlot('Controller output calculation'),arithmetic=el('p',{class:'mv-calculation'}),status=el('div',{role:'status','aria-live':'polite','aria-atomic':'true','data-state':'success'});
 output.append(outputPlot,arithmetic,status);
 for(const stage of [inputs,rules,output]){const body=el('div',{class:'mv-flow-body'});while(stage.children.length>1)body.append(stage.children[1]);stage.append(body);}
 function makePlot(label){return svg('svg',{viewBox:'0 0 250 165',role:'img','aria-label':label,class:'mv-flow-plot'});}
 function plot(canvas,series,min,max,ticks,marker){
  canvas.replaceChildren();const x=n=>30+(n-min)/(max-min)*206,y=n=>127-n*101;
  for(const n of [0,.5,1])canvas.append(svg('line',{x1:30,y1:y(n),x2:236,y2:y(n),class:'mv-grid'}),svg('text',{x:24,y:y(n)+4,'text-anchor':'end'},dec(n)));
  for(const n of ticks)canvas.append(svg('text',{x:x(n),y:147,'text-anchor':'middle'},String(n)));
  for(const [points,color,label,fill,ghost] of series){
   const d=points.map(([a,b],i)=>`${i?'L':'M'}${x(a)},${y(b)}`).join(' ');
   if(fill)canvas.append(svg('path',{d:`${d} L${x(max)},${y(0)} L${x(min)},${y(0)} Z`,class:'mv-result-area'}));
   const path=svg('path',{d,fill:'none',stroke:color,'stroke-width':fill?3.5:2.5,'stroke-opacity':ghost?.35:1,'stroke-dasharray':ghost?'3 3':'none'});path.append(svg('title',{},label));canvas.append(path);
   if(marker!==undefined)canvas.append(svg('circle',{cx:x(marker),cy:y(membership(points,marker)),r:3.8,fill:color}));
  }
  if(marker!==undefined)canvas.append(svg('line',{x1:x(marker),x2:x(marker),y1:24,y2:129,class:'mv-temperature'}));
  return {x,y};
 }
 function legend(canvas,labels){labels.forEach(([text,color],i)=>canvas.append(svg('text',{x:30+i*105,y:13,style:`fill:${color}`},text)));}
 function draw(){
  const r=aircon(temperature,humidity,ruleSets),rows=mode==='sugeno'?r.rows:r.mamdaniRows;status.dataset.state='success';controls[0].readout.textContent=temperature+'°C';controls[1].readout.textContent=humidity+'%';
  plot(temperaturePlot,[[airconCurves.IsWarm,colors[0],'IsWarm'],[airconCurves.IsHot,colors[1],'IsHot']],16,36,[16,26,36],temperature);legend(temperaturePlot,[['Warm '+dec(r.warm),colors[0]],['Hot '+dec(r.hot),colors[1]]]);
  plot(humidityPlot,[[airconCurves.IsHumid,colors[2],'IsHumid']],0,100,[0,50,100],humidity);legend(humidityPlot,[['Humid '+dec(r.humid),colors[2]]]);
  ruleBox.replaceChildren();
  rows.forEach((row,i)=>{
   const card=el('div',{class:'mv-flow-rule','data-rule-weight':i});card.style.setProperty('--weight-color',colors[i%colors.length]);
   card.append(el('p',{class:'boolean-app__formula'},row.source),el('p',{},`${row.calculation} = ${dec(row.weight)}`),el('meter',{min:0,max:1,value:row.weight,'aria-label':'Rule '+(i+1)+' weight'}),el('p',{class:'mv-consequent'},mode==='sugeno'?`↦ ${pct(row.output)}% power`:`↦ ${row.set} power`));ruleBox.append(card);
  });
  let result;
  if(mode==='sugeno'){
   const {x,y}=plot(outputPlot,[],0,1,[0,.5,1]);
   for(const [i,row] of rows.entries())outputPlot.append(svg('line',{x1:x(row.output),x2:x(row.output),y1:y(0),y2:y(row.weight),stroke:colors[i%colors.length],'stroke-width':3}),svg('circle',{cx:x(row.output),cy:y(row.weight),r:5,fill:colors[i%colors.length]}));
   result=r.sugeno;arithmetic.textContent=r.total?`(${r.rows.map(row=>`${dec(row.weight)} × ${dec(row.output)}`).join(' + ')}) ÷ ${dec(r.total)} = ${Math.round(result*1000)/1000}`:'No rule applies. Fallback: cooling off.';
   outputPlot.setAttribute('aria-label','Rule weights at the recommended power settings, with the weighted average marked');
   outputPlot.append(svg('line',{x1:x(result),x2:x(result),y1:24,y2:129,stroke:'var(--mv-result)','stroke-width':2,'stroke-dasharray':'4 3'}));
  }else{
   const series=rows.map((row,i)=>[coolingSets[row.set],colors[i%colors.length],row.set+' membership',false,true]);series.push(...r.clipped.map((points,i)=>[points,colors[i%colors.length],rows[i].set]));series.push([r.aggregate,'var(--mv-result)','Combined output membership',true]);
   const {x}=plot(outputPlot,series,0,1,[0,.5,1]);result=r.mamdani.output;
   outputPlot.append(svg('line',{x1:x(result),x2:x(result),y1:24,y2:129,stroke:'var(--mv-result)','stroke-width':2,'stroke-dasharray':'4 3'}));
   outputPlot.setAttribute('aria-label','Clipped output memberships combined by maximum; the dashed line marks their centroid');arithmetic.textContent=r.mamdani.area?'Dashed line: balance point of the shaded area.':'No rule applies. Fallback: cooling off.';
  }
  outputPlot.append(svg('text',{x:235,y:163,'text-anchor':'end'},'Power'));
  if(root.dataset.dirty){status.dataset.state='pending';status.textContent='Check to apply the edited rules.';return;}
  status.textContent=`${mode==='sugeno'?'Weighted average':'Centroid'}: ${pct(result)}% cooling.`;
 }
 reset.onclick=()=>{temperature=26;humidity=70;mode='sugeno';sources={...airconDefaults};Object.assign(appliedSources,sources);ruleSets=Object.fromEntries(Object.entries(sources).map(([key,source])=>[key,parseAirconRules(source,key)]));input.value=sources[mode];freeze();controls[0].input.value=26;controls[1].input.value=70;modes.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.choice===mode)));draw();};
 draw();root.querySelector('[data-app-fallback]').remove();
}
