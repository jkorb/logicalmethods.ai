// Prawitz-style inferences, matching the book's inference and resolution figures.
import { el } from './boolean-ui.js';
let textId=0;
export function textAlternative(root, panel, icon) {
  panel.id=`conditional-text-${++textId}`;panel.hidden=true;
  panel.setAttribute('role','region');panel.setAttribute('aria-label','Text alternative');
  const controls=el('div',{class:'conditional-text-controls'}),toggle=el('button',{type:'button','data-text-toggle':'','aria-label':'Show text alternative','aria-expanded':'false','aria-controls':panel.id,title:'Show text alternative'});
  toggle.append(icon.cloneNode(true));
  toggle.onclick=()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));toggle.setAttribute('aria-label',panel.hidden?'Show text alternative':'Hide text alternative');toggle.title=toggle.getAttribute('aria-label');};
  controls.append(toggle);root.append(controls,panel);
}
export function inferenceTree(tree, depth = 0) {
  const box=el('div',{class:'conditional-inference'+(tree.pending?' is-pending':'')});
  if(depth>3 && tree.children.length) {
    box.append(el('small',{},'proved above'),el('div',{class:'conditional-conclusion'},tree.label));return box;
  }
  if(tree.children.length) {
    const parents=el('div',{class:'conditional-premises'});
    tree.children.forEach(child=>parents.append(inferenceTree(child,depth+1)));
    // The conditional is a premise of MP, not merely an unlabelled edge.
    parents.append(el('div',{class:'conditional-rule'},tree.text || ''));
    box.append(parents);
  }
  box.append(el('div',{class:tree.children.length?'conditional-conclusion':'conditional-fact'},tree.label));
  if(tree.pending)box.append(el('small',{},'to prove'));
  return box;
}
export function describeProof(tree) {
  if(!tree.children.length)return `${tree.label}${tree.pending?' (to prove)':' (given)'}`;
  return `${tree.pending?'To prove':'Derive'} ${tree.label} using ${tree.text}. Premises: ${tree.children.map(describeProof).join('; ')}`;
}

// Reduce only to 14px; beyond that, wrap premise groups above their inference line.
const observers = new WeakMap();
export function fitProofs(container) {
  function fit() {
    const proof=container.querySelector(':scope > .conditional-inference');
    if(!proof || !container.clientWidth)return;
    proof.classList.remove('is-wrapped');
    proof.style.fontSize='';
    const base=parseFloat(getComputedStyle(proof).fontSize);
    const available=container.clientWidth;
    const natural=proof.scrollWidth;
    proof.style.fontSize=`${Math.max(14,Math.min(base,base*available/natural))}px`;
    if(proof.scrollWidth>available+1)proof.classList.add('is-wrapped');
  }
  if(!observers.has(container)) {
    const observer=new ResizeObserver(fit);observer.observe(container);observers.set(container,observer);
  }
  fit();
}
