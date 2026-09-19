import { parseBoolean, printFormula, proposition } from '../logic/boolean.js';
import { el, svg } from './boolean-ui.js';
let drawingId=0;
// The artwork supplies the worlds; membership and highlighting remain semantic.
export function drawWorlds(root,worlds,{selected=[],onSelect,formula='',countermodels=false}={}) {
  const picture=root.querySelector('[data-picture]'),three=worlds.length===8;
  const space=el('div',{class:`boolean-space${three?' boolean-space--eight':''}`});
  const drawing=root.querySelector('[data-world-space]').content.cloneNode(true),canvas=drawing.querySelector('svg');
  space.append(drawing);picture.replaceChildren(space);
  const background=canvas.querySelector('g');
  for(const n of background.querySelectorAll('[fill]'))if(n.getAttribute('fill')!=='none')n.setAttribute('fill','var(--set-universe)');
  const positions=three ? [
    {SUN:1,RAIN:1,WIND:1,x:312,y:286},{SUN:1,RAIN:1,WIND:0,x:865,y:286},
    {SUN:1,RAIN:0,WIND:1,x:1420,y:286},{SUN:1,RAIN:0,WIND:0,x:1975,y:286},
    {SUN:0,RAIN:1,WIND:1,x:312,y:722},{SUN:0,RAIN:1,WIND:0,x:865,y:722},
    {SUN:0,RAIN:0,WIND:1,x:1420,y:722},{SUN:0,RAIN:0,WIND:0,x:1975,y:722}
  ] : [{SUN:1,RAIN:1,x:248,y:195},{SUN:1,RAIN:0,x:645,y:188},{SUN:0,RAIN:1,x:230,y:512},{SUN:0,RAIN:0,x:636,y:525}];
  const W=three?2301:902.7,H=three?1042.4:711.3,radius=three?178:111;
  // Keep the source drawing intact. Each world shows a fixed cell of the same
  // artwork, rather than guessing which individual strokes belong to it using
  // live SVG bounding boxes. This also works before layout or inside disclosures.
  const id=`boolean-world-drawing-${++drawingId}`;
  const definitions=svg('defs'),original=svg('g',{id});
  for(const node of [...canvas.children]) {
    if(node!==background && !['title','defs'].includes(node.tagName.toLowerCase()))original.append(node);
  }
  definitions.append(original);canvas.append(definitions);
  const art=new Map(),columns=three?4:2;
  const xs=three?[0,588,1142,1698,W]:[0,445,W],ys=three?[0,504,H]:[0,355,H];
  for(const [index,position] of positions.entries()) {
    const world=worlds.find(w=>['SUN','RAIN',...(three?['WIND']:[])].every(k=>w[k]===position[k]));
    const group=svg('g',{'data-world-art':world.id});
    group.append(svg('ellipse',{cx:position.x,cy:position.y,rx:radius+9,ry:radius+8,class:'boolean-world-halo'}));
    const col=index%columns,row=Math.floor(index/columns),clipId=`${id}-cell-${index}`;
    const clip=svg('clipPath',{id:clipId,clipPathUnits:'userSpaceOnUse'});
    clip.append(svg('rect',{x:xs[col],y:ys[row],width:xs[col+1]-xs[col],height:ys[row+1]-ys[row]}));
    definitions.append(clip);
    const cell=svg('g',{'clip-path':`url(#${clipId})`});
    cell.append(svg('use',{href:`#${id}`}));group.append(cell);
    if(three)group.append(svg('text',{x:position.x,y:position.y+220,'text-anchor':'middle',class:'boolean-model-label'},world.id));
    canvas.append(group);art.set(world.id,group);
    const label=['SUN','RAIN',...(three?['WIND']:[])].map(n=>`v(${n}) = ${world[n]}`).join(', ');
    const button=el('button',{type:'button',class:'boolean-world','data-model':world.id,'aria-label':`${world.id}: ${label}`,'aria-pressed':String(selected.includes(world.id))});
    button.style.cssText=`left:${(position.x-radius)/W*100}%;top:${(position.y-radius)/H*100}%;width:${radius*2/W*100}%;height:${radius*2/H*100}%;`;
    button.addEventListener('click',()=>onSelect?.(world));space.append(button);
  }
  if(!three) {
    const contours=svg('g',{'aria-hidden':'true'});
    for(const [name,x,y,w,h,lx,ly]of [['SUN',80,40,735,315,750,65],['RAIN',80,40,365,635,120,655],['¬SUN',80,355,735,320,735,655],['¬RAIN',445,40,370,635,745,65]]) {
      const negative=name.startsWith('¬'),active=formula===name;
      if(!active)continue;
      const g=svg('g',{'data-model-set':name,class:`boolean-model-contour${active?' is-active':''}`});
      g.append(svg('rect',{x,y,width:w,height:h,rx:18,fill:negative?'none':name==='SUN'?'var(--set-green)':'var(--set-rose)','fill-opacity':'.25'}),svg('text',{x:lx,y:ly,'text-anchor':'middle'},`[${name}]`));contours.append(g);
    }
    if(formula) {
      const tree=parseBoolean(formula).tree;
      const parts=tree.children.map(printFormula);
      for(const part of parts) contours.append(svg('path',{d:setOutline(proposition(part)),class:'boolean-proposition-outline is-component','data-component-set':part}));
      if(!['SUN','RAIN','¬SUN','¬RAIN'].includes(formula))contours.append(svg('path',{d:setOutline(selected),class:`boolean-proposition-outline${countermodels?' is-countermodel':''}`}));
    }
    function setOutline(ids) {
      const edges=new Map(),xs=[80,445,815],ys=[40,355,675];
      for(const w of worlds.filter(w=>ids.includes(w.id))) {
        const col=w.RAIN?0:1,row=w.SUN?0:1;
        const points=[[xs[col],ys[row]],[xs[col+1],ys[row]],[xs[col+1],ys[row+1]],[xs[col],ys[row+1]]];
        for(let i=0;i<4;i++){const a=points[i],b=points[(i+1)%4],key=`${a}:${b}`,reverse=`${b}:${a}`;if(edges.has(reverse))edges.delete(reverse);else edges.set(key,[a,b]);}
      }
      let path='';
      while(edges.size) {
        const [key,[start,next]]=edges.entries().next().value;edges.delete(key);
        const points=[start];let end=next;
        while(String(end)!==String(start)) {
          points.push(end);const entry=[...edges].find(([, [a]])=>String(a)===String(end));if(!entry)break;
          const [key,[,b]]=entry;edges.delete(key);end=b;
        }
        const toward=(a,b)=>{const length=Math.hypot(b[0]-a[0],b[1]-a[1]);return a.map((v,i)=>v+(b[i]-v)*Math.min(18,length/2)/length);};
        points.forEach((p,i)=>{const before=toward(p,points[(i+points.length-1)%points.length]),after=toward(p,points[(i+1)%points.length]);path+=`${i?'L':'M'}${before} Q${p} ${after} `;});path+='Z ';
      }
      return path;
    }
    background.after(contours);
  }
  function highlight(ids,bad=countermodels) {
    for(const [id,group]of art){group.classList.toggle('is-selected',ids.includes(id));group.classList.toggle('is-countermodel',bad&&ids.includes(id));}
    for(const b of space.querySelectorAll('button[data-model]')){b.classList.toggle('is-selected',ids.includes(b.dataset.model));b.setAttribute('aria-pressed',String(ids.includes(b.dataset.model)));}
  }
  highlight(selected);
  return {highlight};
}
