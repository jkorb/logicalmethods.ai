import { parseFOL } from '../logic/fol-parser.js';
import { bindingTokens } from '../logic/fol-binding.js';
import { svg } from './boolean-ui.js';
import { el } from './fol-views.js';
import { levels } from './fol-levels.js';
import { scopeLevels } from './fol-practice-levels.js';
export function mountFOLScope(root) {
  const canvas=root.querySelector('.scope-canvas'), free=root.querySelector('[data-free]'), check=root.querySelector('[data-check]');
  const training=root.dataset.mode==='practice', explore=root.dataset.mode==='explore';
  let data, chosen=null, bindings=new Map(), visited=new Set(), correct=false, resize;
  // Explore mode is practice without levels or checking: the lecturer draws the
  // bindings, and the selected quantifier's scope is tinted.
  const clear=root.querySelector('[data-clear]');
  const summary=()=>data.free.length?`Free occurrences: ${data.free.map(t=>t.text).join(', ')}. This is an open formula.`:'No free occurrences. This is a sentence.';
  function render(focusId) {
    resize?.disconnect(); canvas.replaceChildren();
    const line=el('div',undefined,'scope-line');canvas.append(line);
    const wires=svg('svg',{'aria-hidden':'true',class:'scope-wires'});line.append(wires);
    const scope=explore&&chosen!==null?data.tokens[chosen]:null;
    for(const t of data.tokens) {
      const interactive=(training||explore) && ['quantifier','variable'].includes(t.kind), n=el(interactive?'button':'span',t.text); n.dataset.token=t.id;
      if(scope && t.id>scope.id && t.id<=scope.scopeEnd)n.classList.add('scope-in-scope');
      if(interactive) {
        n.type='button'; n.dataset.kind=t.kind;
        n.setAttribute('aria-label',`${t.kind==='quantifier'?'Quantifier':'Occurrence'} ${t.text} at position ${t.id+1}`);
        n.setAttribute('aria-pressed',String(t.kind==='quantifier'?chosen===t.id:bindings.get(chosen)?.has(t.id)||false));
        if(training && t.kind==='quantifier')n.dataset.visited=String(visited.has(t.id));
        n.addEventListener('click',()=>{
          correct=false; practice?.clear();
          if(t.kind==='quantifier') { chosen=explore&&chosen===t.id?null:t.id; visited.add(t.id); }
          else if(chosen===null) { practice?.feedback(false,'Select a quantifier first.'); return; }
          else { const set=bindings.get(chosen); if(set.has(t.id))set.delete(t.id);else { for(const other of bindings.values())other.delete(t.id); set.add(t.id); } }
          render(t.id);
        });
      }
      if(t.kind==='variable' && (!training||correct) && !explore && t.binder===null)n.classList.add('scope-is-free');
      line.append(n);
    }
    function draw() {
      wires.replaceChildren();const width=line.scrollWidth;wires.setAttribute('width',width);
      const drawn=training||explore;
      const targets=q=>data.tokens.filter(t=>drawn?bindings.get(q.id).has(t.id):t.binder===q.id);
      // Explore mode keeps the arrow lanes while arrows come and go, so the formula stays put.
      const hasArrows=explore?data.quantifiers.length>0:data.quantifiers.some(q=>targets(q).length);
      line.style.paddingTop=hasArrows?'100px':'0'; wires.setAttribute('height',hasArrows?100:0); wires.setAttribute('viewBox',`0 0 ${width} ${hasArrows?100:0}`); wires.style.display=hasArrows?'':'none';
      if(!hasArrows)return;
      // Measure on screen and divide by the drawing's own scale: on a slide the
      // app is zoomed and the deck scaled, and browsers disagree on how SVG
      // transforms and markers follow CSS zoom. Ratios of boxes do not.
      // An arrow leaves its quantifier's top edge and ends on its occurrence's.
      const box=wires.getBoundingClientRect(),kx=box.width/width||1,ky=box.height/100||1;
      const anchor=id=>{const r=line.querySelector(`[data-token="${id}"]`).getBoundingClientRect();return {x:(r.left+r.width/2-box.left)/kx,y:(r.top-box.top)/ky};};
      const faded=q=>training?chosen!==q.id:explore&&chosen!==null&&chosen!==q.id;
      // The head is drawn as its own triangle, its tip on the occurrence.
      data.quantifiers.forEach((q,i)=>targets(q).forEach(t=>{
        const a=anchor(q.id),b=anchor(t.id),color=`scope-color-${i%3}`,g=svg('g',{class:'scope-arrow',opacity:faded(q)?.4:1});
        g.append(svg('path',{d:`M ${a.x} ${a.y} V ${18+i%4*17} H ${b.x} V ${b.y-6}`,class:`scope-wire ${color}`}),svg('path',{d:`M ${b.x-4} ${b.y-8} L ${b.x} ${b.y} L ${b.x+4} ${b.y-8} Z`,class:`scope-head ${color}`}));
        wires.append(g);
      }));
    }
    draw();resize=new ResizeObserver(draw);resize.observe(line);
    if(focusId!==undefined)line.querySelector(`[data-token="${focusId}"]`)?.focus({preventScroll:true});
    free.textContent=training&&!correct||explore?'':summary();
  }
  function start(formula) { data=bindingTokens(parseFOL(formula)); chosen=null; correct=false; visited.clear(); bindings=new Map(data.quantifiers.map(q=>[q.id,new Set()])); render(); }
  const practice=training?levels(root,scopeLevels,start):null;
  check.addEventListener('click',()=>{
    const missing=data.quantifiers.find(q=>!visited.has(q.id));
    if(missing) { practice.feedback(false,'Visit every quantifier and mark its bindings. Leave a vacuous quantifier without arrows.');return; }
    correct=data.quantifiers.every(q=>{const expected=data.tokens.filter(t=>t.binder===q.id);return expected.length===bindings.get(q.id).size&&expected.every(t=>bindings.get(q.id).has(t.id));});
    render();practice.feedback(correct,correct?'Correct: all bindings are in place.':'Not yet. Each bound occurrence belongs to its nearest enclosing quantifier for that variable. Free occurrences have no arrow.');
  });
  if(training)practice.start();
  else if(explore) {
    const formulas=(root.dataset.formulas||root.dataset.formula).split('|').map(f=>f.trim()).filter(Boolean);
    const labels=(root.dataset.labels||'').split('|').map(l=>l.trim());
    const tabs=root.querySelector('[data-examples]');
    if(formulas.length>1) {
      tabs.hidden=false;
      const buttons=formulas.map((f,i)=>{const b=el('button',labels[i]||f);b.type='button';b.setAttribute('aria-pressed',String(!i));b.addEventListener('click',()=>{buttons.forEach(o=>o.setAttribute('aria-pressed',String(o===b)));start(f);});return b;});
      tabs.append(...buttons);
    }
    clear.addEventListener('click',()=>{chosen=null;bindings.forEach(set=>set.clear());render();});
    free.hidden=true;
    start(formulas[0]);
  }
  else start(root.dataset.formula);
  root.querySelector('[data-app-fallback]').remove();
}
