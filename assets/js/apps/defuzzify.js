import {coolingSets,defuzzify} from '../logic/fuzzy.js';
import {el,svg,choices,iconButton} from './boolean-ui.js';
const dec=n=>String(Math.round(n*100)/100),pct=n=>String(Math.round(n*1000)/10);
const sets=[['Low','var(--mv-cold)'],['Medium','var(--mv-warm)'],['High','var(--mv-hot)']];
const defaults={Low:.25,Medium:.75,High:0},spacings=[[.5,'Every 0.5'],[.25,'Every 0.25'],[.1,'Every 0.1'],[.05,'Every 0.05']];
// Defuzzification by the centroid: rule weights clip the output sets, the
// clipped sets combine by maximum, and evenly spaced samples of the result
// average the settings by their heights. A fulcrum marks that average, and a
// dashed line the exact balance point of the shaded area.
export function mountDefuzzify(root){
 let weights={...defaults},step=.1;
 const q=s=>root.querySelector(s),toolbar=q('[data-toolbar]'),picture=q('[data-picture]'),controls=q('[data-controls]'),inspector=q('[data-inspector]'),status=q('[role=status]');
 const spacing=el('div',{class:'mv-examples'});toolbar.append(spacing);
 choices(spacing,spacings,step,value=>{step=value;draw();},'Sample spacing');
 const reset=iconButton(root,'replay','Reset'),full=iconButton(root,'fullscreen','Fullscreen');toolbar.append(reset,full);
 full.onclick=async()=>{try{if(document.fullscreenElement===root)await document.exitFullscreen();else await root.requestFullscreen();}catch{status.textContent='Fullscreen is unavailable in this browser.';}};
 document.addEventListener('fullscreenchange',()=>{const label=document.fullscreenElement===root?'Exit fullscreen':'Fullscreen';full.setAttribute('aria-label',label);full.title=label;});
 const sliders=sets.map(([name])=>{
  const label=el('label',{class:'mv-measurement'}),readout=el('output'),input=el('input',{type:'range',min:0,max:1,step:.05,value:weights[name],'aria-label':`Weight of the ${name} rule`});
  label.append(el('span',{},`${name} rule weight `),readout,input);controls.append(label);
  input.addEventListener('input',()=>{weights[name]=Number(input.value);draw();});return {name,input,readout};
 });
 const canvas=svg('svg',{viewBox:'0 0 620 340',role:'img'});picture.append(canvas);
 const plot={x:48,y:34,w:548,h:220},sx=p=>plot.x+p*plot.w,sy=h=>plot.y+(1-h)*plot.h,base=sy(0);
 const path=points=>points.map(([p,h],i)=>`${i?'L':'M'}${sx(p)},${sy(h)}`).join(' ');
 function draw(){
  const r=defuzzify(weights,step);canvas.replaceChildren();
  for(const p of [0,.25,.5,.75,1])canvas.append(svg('line',{x1:sx(p),y1:sy(0),x2:sx(p),y2:sy(1),class:'mv-grid'}),svg('text',{x:sx(p),y:base+44,'text-anchor':'middle'},dec(p)));
  for(const h of [0,.5,1])canvas.append(svg('line',{x1:sx(0),y1:sy(h),x2:sx(1),y2:sy(h),class:'mv-grid'}),svg('text',{x:34,y:sy(h)+5,'text-anchor':'end'},dec(h)));
  canvas.append(svg('text',{x:sx(1),y:base+70,'text-anchor':'end'},'Power'));
  sets.forEach(([name,color],i)=>canvas.append(svg('text',{x:sx([0,.65,1][i]),y:plot.y-8,'text-anchor':['start','middle','end'][i],style:`fill:${color}`},name)));
  canvas.append(svg('path',{d:`${path(r.aggregate)} L${sx(1)},${base} L${sx(0)},${base} Z`,class:'mv-result-area'}));
  sets.forEach(([name,color],i)=>canvas.append(svg('path',{d:path(coolingSets[name]),fill:'none',stroke:color,'stroke-width':2,'stroke-opacity':.4,'stroke-dasharray':'5 4'}),svg('path',{d:path(r.clipped[i]),fill:'none',stroke:color,'stroke-width':3})));
  canvas.append(svg('path',{d:path(r.aggregate),fill:'none',stroke:'var(--mv-result)','stroke-width':4}));
  for(const [p,h] of r.samples)if(h>0)canvas.append(svg('line',{x1:sx(p),x2:sx(p),y1:base,y2:sy(h),class:'mv-sample'}),svg('circle',{cx:sx(p),cy:sy(h),r:5,class:'mv-result-point'}));
  if(r.total){
   const exact=sx(r.exact),fulcrum=sx(r.approximate);
   canvas.append(svg('line',{x1:exact,x2:exact,y1:sy(1)-6,y2:base,stroke:'var(--mv-result)','stroke-width':2,'stroke-dasharray':'4 3'}));
   canvas.append(svg('path',{d:`M${fulcrum},${base+2} l-11,20 h22 Z`,class:'mv-fulcrum'}),svg('text',{x:fulcrum+15,y:base+20},'p*'));
  }
  for(const s of sliders)s.readout.textContent=dec(weights[s.name]);
  const nonzero=r.samples.filter(([,h])=>h>0);
  inspector.replaceChildren(el('p',{class:'mv-calculation'},!r.total?'Every height is 0.':nonzero.length<=4
   ?`p* ≈ (${nonzero.map(([p,h])=>`${dec(p)}×${dec(h)}`).join(' + ')}) ÷ (${nonzero.map(([,h])=>dec(h)).join(' + ')}) = ${dec(r.approximate)}`
   :`p* ≈ (p₁μ(p₁) + … + pₙμ(pₙ)) ÷ (μ(p₁) + … + μ(pₙ)) = ${dec(r.moment)} ÷ ${dec(r.total)} = ${dec(r.approximate)}`));
  canvas.setAttribute('aria-label',`Output sets clipped at their rule weights and combined by maximum, sampled every ${step}; the samples balance at ${dec(r.approximate)}, the shaded area at ${dec(r.exact)}`);
  status.dataset.state='success';
  status.textContent=r.total?`${r.samples.length} samples balance at ${pct(r.approximate)}% power; the shaded area's centroid is ${pct(r.exact)}%.`:'No rule applies. Fallback: zero power.';
 }
 reset.onclick=()=>{weights={...defaults};step=.1;for(const s of sliders)s.input.value=weights[s.name];spacing.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.choice)===step)));draw();};
 draw();q('[data-app-fallback]').remove();
}
