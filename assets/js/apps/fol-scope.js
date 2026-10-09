import { parseFOL } from '../logic/fol-parser.js';
import { bindingTokens } from '../logic/fol-binding.js';
import { svg } from './boolean-ui.js';
import { el } from './fol-views.js';
import { levels } from './fol-levels.js';
import { scopeLevels } from './fol-practice-levels.js';
export function mountFOLScope(root) {
  const canvas=root.querySelector('.scope-canvas'), free=root.querySelector('[data-free]'), check=root.querySelector('[data-check]');
  const training=root.dataset.mode==='practice';
  let data, chosen=null, bindings=new Map(), visited=new Set(), correct=false, resize;
  function render(focusId) {
    resize?.disconnect(); canvas.replaceChildren();
    const line=el('div',undefined,'scope-line');canvas.append(line);
    const wires=svg('svg',{'aria-hidden':'true',class:'scope-wires'});line.append(wires);
    const markerId=`${root.id}-arrow`,defs=svg('defs'),marker=svg('marker',{id:markerId,viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:5,markerHeight:5,orient:'auto'});marker.append(svg('path',{d:'M 0 0 L 10 5 L 0 10 z'}));defs.append(marker);wires.append(defs);
    for(const t of data.tokens) {
      const interactive=training && ['quantifier','variable'].includes(t.kind), n=el(interactive?'button':'span',t.text); n.dataset.token=t.id;
      if(interactive) {
        n.type='button'; n.dataset.kind=t.kind;
        n.setAttribute('aria-label',`${t.kind==='quantifier'?'Quantifier':'Occurrence'} ${t.text} at position ${t.id+1}`);
        n.setAttribute('aria-pressed',String(t.kind==='quantifier'?chosen===t.id:bindings.get(chosen)?.has(t.id)||false));
        if(t.kind==='quantifier')n.dataset.visited=String(visited.has(t.id));
        n.addEventListener('click',()=>{
          correct=false; practice.clear();
          if(t.kind==='quantifier') { chosen=t.id; visited.add(t.id); }
          else if(chosen===null) { practice.feedback(false,'Select a quantifier first.'); return; }
          else { const set=bindings.get(chosen); if(set.has(t.id))set.delete(t.id);else { for(const other of bindings.values())other.delete(t.id); set.add(t.id); } }
          render(t.id);
        });
      }
      if(t.kind==='variable' && (!training||correct) && t.binder===null)n.classList.add('scope-is-free');
      line.append(n);
    }
    function draw() {
      wires.querySelectorAll('.scope-wire').forEach(n=>n.remove());wires.setAttribute('width',line.scrollWidth);
      const middle=id=>{const n=line.querySelector(`[data-token="${id}"]`);return n.offsetLeft+n.offsetWidth/2;};
      const targets=q=>training?data.tokens.filter(t=>bindings.get(q.id).has(t.id)):data.tokens.filter(t=>t.binder===q.id);
      const hasArrows=data.quantifiers.some(q=>targets(q).length);
      line.style.paddingTop=hasArrows?'100px':'0'; wires.setAttribute('height',hasArrows?100:0); wires.style.display=hasArrows?'':'none';
      data.quantifiers.forEach((q,i)=>targets(q).forEach(t=>wires.append(svg('path',{d:`M ${middle(q.id)} 90 V ${18+i%4*17} H ${middle(t.id)} V 90`,class:`scope-wire scope-color-${i%3}`,opacity: training && chosen !== q.id ? .4 : 1,'marker-end':`url(#${markerId})`}))));
    }
    draw();resize=new ResizeObserver(draw);resize.observe(line);
    if(focusId!==undefined)line.querySelector(`[data-token="${focusId}"]`)?.focus({preventScroll:true});
    free.textContent=training&&!correct?'':data.free.length?`Free occurrences: ${data.free.map(t=>t.text).join(', ')}. This is an open formula.`:'No free occurrences. This is a sentence.';
  }
  function start(formula) { data=bindingTokens(parseFOL(formula)); chosen=null; correct=false; visited.clear(); bindings=new Map(data.quantifiers.map(q=>[q.id,new Set()])); render(); }
  const practice=training?levels(root,scopeLevels,start):null;
  check.addEventListener('click',()=>{
    const missing=data.quantifiers.find(q=>!visited.has(q.id));
    if(missing) { practice.feedback(false,'Visit every quantifier and mark its bindings. Leave a vacuous quantifier without arrows.');return; }
    correct=data.quantifiers.every(q=>{const expected=data.tokens.filter(t=>t.binder===q.id);return expected.length===bindings.get(q.id).size&&expected.every(t=>bindings.get(q.id).has(t.id));});
    render();practice.feedback(correct,correct?'Correct: all bindings are in place.':'Not yet. Each bound occurrence belongs to its nearest enclosing quantifier for that variable. Free occurrences have no arrow.');
  });
  if(training)practice.start();else start(root.dataset.formula);
  root.querySelector('[data-app-fallback]').remove();
}
