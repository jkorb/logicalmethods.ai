import { readRules, forwardTrace, backwardTrace, scanForwardTrace } from '../logic/conditionals.js';
import { mountPlanning } from './conditional-planning.js';
import { parseBoolean } from '../logic/boolean.js';
import { el, navigation, choices } from './boolean-ui.js';
import { inferenceTree, describeProof, fitProofs, textAlternative } from './conditional-proofs.js';
import { enableLatexInput } from './latex-input.js';
const weather='MORNING\nCLEAR\nRAIN\nMORNING → DAY\nEVENING → DAY\n(CLEAR ∧ DAY) → SUN\n(MORNING ∧ SUN) → LOW_SUN\n(EVENING ∧ SUN) → LOW_SUN\n(RAIN ∧ LOW_SUN) → RAINBOW';
const examples={
  rainbow:{label:'Rainbow',source:weather,goal:'RAINBOW',description:'Morning, clear skies and rain: can we derive RAINBOW?'},
  alternatives:{label:'Alternatives',source:'RAIN\nSNOW\nHUMID → CLOUDS\nRAIN → CLOUDS\nRAIN → PUDDLES\nPUDDLES → HUMID\nRAIN → WET_GROUND\nSNOW → COLD\nCOLD → FROST\n(CLOUDS ∧ SNOW) → STORM',goal:'STORM',description:'Two routes to CLOUDS. Compare their order in the two algorithms.'},
  cycle:{label:'Circular rules',source:'RAIN\nCLOUDS → HUMID\nHUMID → CLOUDS\nRAIN → CLOUDS',goal:'HUMID',description:'A circular attempt can fail even though another rule supplies a proof.'},
  missing:{label:'Missing fact',source:'SNOW\n(WIND ∧ SNOW) → DRIFTING',goal:'DRIFTING',description:'SNOW is known. There is no fact or rule supplying WIND.'},
  sat:{label:'Satisfiable',source:'RAIN\nRAIN → CLOUDS\n(CLOUDS ∧ SNOW) → STORM\nSTORM → ⊥',description:'The constraint forbids STORM. Does RAIN force it?'},
  unsat:{label:'Unsatisfiable',source:'RAIN\nSNOW\nRAIN → CLOUDS\n(CLOUDS ∧ SNOW) → STORM\nSTORM → ⊥',description:'Now SNOW is also a fact. Watch the counter of the constraint.'},
  refutation:{label:'Forecast refutation',source:weather+'\nRAINBOW → ⊥',description:'Add ¬RAINBOW, written RAINBOW → ⊥, to test the forecast by refutation.'}
};
export function mountConditionals(root) {
  const q=s=>root.querySelector(s),kind=root.dataset.kind,status=q('[role=status]'),work=q('[data-work]');
  root.querySelectorAll('input,textarea,select,button').forEach(n=>n.disabled=false);
  root.querySelectorAll('textarea,input:not([type=checkbox]):not([data-horizon])').forEach(input=>enableLatexInput(input));
  if(kind!=='comparison') {
    const bar=q('[data-form] > .logic-app__controls');
    bar.classList.add('conditional-runbar');bar.append(q('[data-navigation]'));
  }
  if(kind==='planning') {mountPlanning(root);return;}
  const inputs=[...root.querySelectorAll('form input,form textarea,form select')];
  const kbPreview=el('ul',{class:'conditional-kb-preview','aria-label':'Knowledge base'});
  q('[data-kb]').after(kbPreview);
  function freeze(on) {q('[data-kb]').hidden=on;kbPreview.hidden=!on;kbPreview.replaceChildren(...q('[data-kb]').value.split('\n').filter(s=>s.trim()).map(s=>el('li',{},s)));inputs.forEach(n=>{if(n.tagName!=='SELECT')n.readOnly=on;});q('[data-edit]').disabled=!on;}
  function clear() {root.querySelectorAll('[data-work],[data-rules],[data-text-tree],[data-proofs],[data-code],[data-path]').forEach(n=>n.replaceChildren());root.querySelectorAll('[data-count]').forEach(n=>n.textContent='');root.querySelectorAll('[data-action]').forEach(b=>b.disabled=true);}
  q('[data-edit]').onclick=()=>{freeze(false);clear();status.textContent='Edit the input, then start a new calculation.';inputs[0].focus();};
  let selected=root.dataset.example || (kind==='horn'?'sat':'rainbow');
  function showEvent(panel,event,kb) {
    const get=s=>panel.querySelector(s),target=get('[data-work]');
    target.classList.add('conditional-proof-panel');
    target.replaceChildren();get('[data-text-tree]').replaceChildren();
    if(event.tree) {target.append(inferenceTree(event.tree));get('[data-text-tree]').textContent=describeProof(event.tree);}
    else target.append(el('p',{},'No inference at this step.'));
    get('[role=status]').textContent=event.message;
    get('[data-code]').textContent=event.code || '';
    get('[data-path]').textContent=event.path?.length?'Current queries: '+event.path.join(' ← '):'';
    const list=el('ol',{class:'conditional-rules',tabindex:'0','aria-label':'Knowledge base rules'});
    kb.rules.forEach((r,i)=>{const item=el('li',{},r.text);if(event.rule===i)item.setAttribute('aria-current','step');if(event.remaining)item.append(el('small',{},` — ${event.remaining[i]} left`));list.append(item);});
    function facts(label,values,empty) {
      const group=el('div',{class:'conditional-facts'});group.append(el('span',{},label));
      const items=el('ul');for(const value of values.length?values:[empty])items.append(el('li',{},value));group.append(items);return group;
    }
    get('[data-rules]').replaceChildren(facts('Known facts:',event.known,'none'),list);
    if(event.agenda)get('[data-rules]').prepend(facts('Agenda:',event.agenda,'empty'));

    get('[data-proofs]').replaceChildren();
    for(const tree of event.proofs || []) {
      const detail=el('details');detail.append(el('summary',{},tree.label),inferenceTree(tree));get('[data-proofs]').append(detail);
    }
    get('[data-history]').hidden=!event.proofs;
    get('[data-history] > summary').textContent=`Derivations found (${event.proofs?.length || 0})`;
    if(kind==='comparison')get('[data-history]').open=true;
    fitProofs(target);
    get('[data-proofs]').querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)fitProofs(detail);}));
  }
  const comparisonLayout=kind==='comparison'?q('.conditional-layout'):null;
  const prototype=comparisonLayout?.cloneNode(true),nav=q('[data-navigation]');
  if(comparisonLayout) {comparisonLayout.before(status);nav.hidden=true;comparisonLayout.classList.add('conditional-comparison');}
  function showTrace(panel,events,kb) {
    if(!panel.querySelector('[data-text-toggle]')) {
      const text=panel.querySelector('[data-text]');
      if(kind!=='comparison')text.append(panel.querySelector('[data-history]'));
      textAlternative(panel,text,q('[data-icon=accessibility]').content);
    }
    navigation(panel,events.length,i=>showEvent(panel,events[i],kb));}
  const keys=kind==='horn'?['sat','unsat','refutation']:['rainbow','alternatives','cycle','missing'];
  const deck={...examples};
  if(root.dataset.kb) {
    deck.custom={label:'Exercise KB',source:root.dataset.kb,goal:root.dataset.goal || 'RAINBOW',description:'Use the given knowledge base and goal. Edit allows you to change the algorithm or try another query.'};
    keys.unshift('custom');selected='custom';
  }
  function load(key) {selected=key;const e=deck[key];q('[data-kb]').value=e.source;if(q('[data-goal]'))q('[data-goal]').value=e.goal;q('[data-description]').textContent=e.description;run();}
  function run() {clear();try {
    const kb=readRules(q('[data-kb]').value,{constraints:kind==='horn'});let goal='';
    if(kind!=='horn') {const parsed=parseBoolean(q('[data-goal]').value);if(parsed.tree.children.length)throw new Error('Use one propositional variable as the goal.');goal=parsed.tree.label;}
    freeze(true);
    if(kind==='comparison') {
      comparisonLayout.replaceChildren();status.textContent=`ASK(KB, ${goal}). Step through either search independently.`;
      for(const method of ['forward','backward']) {
        const panel=el('div',{role:'region','aria-label':method==='forward'?'Forward search':'Backward search'}),heading=el('h4',{},method==='forward'?'Forward · breadth first':'Backward · depth first');
        const controls=nav.cloneNode(true);controls.hidden=false;
        const body=prototype.cloneNode(true);body.querySelector('[data-work]').setAttribute('aria-label',`${method} search derivation`);
        panel.append(heading,controls,body);comparisonLayout.append(panel);
        const events=method==='forward'?scanForwardTrace(kb,goal,true):backwardTrace(kb,goal);
        showTrace(panel,events,kb);
      }
    } else {
      const method=q('[data-method]')?.value || root.dataset.method || 'forward';
      const events=kind==='horn'?forwardTrace(kb,'',true):method==='backward'?backwardTrace(kb,goal):scanForwardTrace(kb,goal);
      showTrace(root,events,kb);
    }
  }catch(error){freeze(false);status.textContent=error.message;}}
  choices(q('[data-examples]'),keys.map(k=>[k,deck[k].label]),selected,load,'Knowledge bases');
  q('[data-examples]').prepend(el('span',{class:'app-picker-label',title:'Examples'},'Ex.'));
  q('[data-form]').onsubmit=e=>{e.preventDefault();run();};
  if(q('[data-method]'))q('[data-method]').onchange=run;
  load(selected);
}
