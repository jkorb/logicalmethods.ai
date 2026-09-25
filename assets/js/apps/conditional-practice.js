import { el, choices } from './boolean-ui.js';
import { celebrate } from './celebrate.js';
import { enableLatexInput } from './latex-input.js';
import { conditionalNotation, readRules } from '../logic/conditionals.js';
import { hornWitness, startChaining, chainStep, studentProof } from '../logic/conditional-practice.js';
import { parseBoolean, evaluateTrace } from '../logic/boolean.js';
import { flatten, valuations } from '../logic/sat.js';
import { inferenceTree, describeProof, fitProofs, textAlternative } from './conditional-proofs.js';
const weather='RAIN; SNOW; HUMID → CLOUDS; RAIN → CLOUDS; RAIN → PUDDLES; PUDDLES → HUMID; CLOUDS → HUMID; (CLOUDS ∧ SNOW) → STORM; (STORM ∧ WIND) → BLIZZARD; SUN → DRY';
const defaultCases=[{label:'Storm',kb:weather,goal:'STORM'},{label:'Blizzard',kb:weather,goal:'BLIZZARD'},{label:'Circular rules',kb:'CLOUDS → HUMID; HUMID → CLOUDS',goal:'CLOUDS'}];
const hornItems=[
 ['(RAIN ∧ SUN) → SNOW',true,'¬RAIN ∨ ¬SUN ∨ SNOW has one positive literal.'],
 ['RAIN → (SUN ∧ SNOW)',true,'This is (¬RAIN ∨ SUN) ∧ (¬RAIN ∨ SNOW), two Horn clauses.'],
 ['(RAIN ∧ ¬SUN) → SNOW',false,'RAIN true with exactly one of SUN and SNOW true gives two models; their intersection is not a model.'],
 ['¬(RAIN ∧ SUN ∧ SNOW)',true,'¬RAIN ∨ ¬SUN ∨ ¬SNOW has no positive literals.'],
 ['RAIN ↔ SUN',true,'(¬RAIN ∨ SUN) ∧ (¬SUN ∨ RAIN) is Horn.'],
 ['RAIN ∨ SUN',false,'RAIN alone and SUN alone satisfy it; making both false does not.'],
 ['(RAIN → SUN) ∧ (SUN → SNOW) ∧ ¬SNOW',true,'Each of the three conjuncts is a Horn clause after eliminating →.'],
 ['(RAIN ∨ SUN) ∧ ¬RAIN',true,'This is equivalent to SUN ∧ ¬RAIN. A non-Horn-looking clause can be redundant.']
];
export function mountConditionalPractice(root) {
  const q=s=>root.querySelector(s),work=q('[data-work]'),setup=q('[data-setup]'),controls=q('[data-controls]'),status=q('[role=status]');
  const say=(text,correct)=>{status.textContent=text;status.dataset.feedback=correct===undefined?'':correct?'correct':'incorrect';if(correct)celebrate(root);else if(correct===false){root.classList.remove('is-shaking');void root.offsetWidth;root.classList.add('is-shaking');}};
  function button(label,action,icon) {const b=el('button',{type:'button'},label);if(icon)b.prepend(q(`[data-icon="${icon}"]`).content.cloneNode(true));b.onclick=action;return b;}
  if(root.dataset.kind==='equivalence') {
    const form=el('form'),input=el('input',{'aria-label':'DNF rewrite',maxlength:512}),label=el('label',{},'DNF rewrite');label.append(input);enableLatexInput(input);const submit=button('Check',()=>{},'check');submit.type='submit';form.append(label,submit);work.append(form);
    form.onsubmit=e=>{e.preventDefault();try {const {tree,names}=parseBoolean(conditionalNotation(input.value));
      if(names.some(n=>!['RAIN','SUN'].includes(n)))throw new Error('Use RAIN and SUN.');
      const literal=t=>!t.children.length || t.label==='¬'&&!t.children[0].children.length;
      if(!flatten(tree,'∨').every(t=>flatten(t,'∧').every(literal)))throw new Error('Write a DNF using only literals, ∧ and ∨.');
      const correct=valuations(['RAIN','SUN']).every(v=>evaluateTrace(tree,v).at(-1).value===Number(v.RAIN===v.SUN));say(correct?'Correct: this DNF describes exactly the cases where RAIN and SUN agree.':'This DNF has different truth-values. Check the cases where the inputs differ.',correct);
    }catch(error){say(error.message,false);}};return;
  }
  if(root.dataset.kind==='wason') {
    const levels=[{label:'Numbers and colours',art:'wason',cards:['3','8','Blue','Red'],correct:[1,3],prompt:'Each card has a number on one side and a colour on the other. Rule: if the number is even, the other side is blue. Select only the cards you must turn over to test this rule.'},
      {label:'A social rule',art:'wason_domain',cards:['Soda','Beer','16','25'],correct:[1,2],prompt:'Each card has a drink on one side and an age on the other. The rule at this event is: if a person drinks beer, they must be at least 18. Select only the cards you must turn over to check for violations.'}];
    function load(i) {
      const item=levels[i],selected=new Set();work.replaceChildren();controls.replaceChildren();say('Select cards, then Check.');q('[data-prompt]').textContent=item.prompt;
      const art=el('div',{class:'wason-art','aria-hidden':'true'});art.append(q(`[data-art="${item.art}"]`).content.cloneNode(true));
      const cards=el('div',{class:'wason-cards',role:'group','aria-label':'Cards'});
      item.cards.forEach((name,j)=>{const b=button(name,()=>{if(selected.has(j))selected.delete(j);else selected.add(j);b.setAttribute('aria-pressed',String(selected.has(j)));say('Selection changed. Check when ready.');});b.replaceChildren(el('span',{},name));b.setAttribute('aria-pressed','false');cards.append(b);});
      // Four transparent card buttons sit over the drawing; their captions remain visible below it.
      const board=el('div',{class:'wason-board'});board.append(art,cards);work.append(board);
      controls.append(button('Check',()=>say(selected.size===2&&item.correct.every(n=>selected.has(n))?'Correct. Both selected cards could hide a violation of the rule.':'Not yet. Look for a true antecedent with a false consequent. Select every card that could hide that combination, and no others.',selected.size===2&&item.correct.every(n=>selected.has(n))),'check'),button('Restart',()=>load(i),'replay'));
    }
    choices(q('[data-levels]'),levels.map((x,i)=>[i,x.label]),0,load,'Card tasks');load(0);return;
  }
  if(root.dataset.kind==='horn') {
    q('[data-prompt]').textContent='';
    const list=el('div',{class:'horn-options'}),checks=[];
    hornItems.forEach(([formula])=>{const label=el('label'),input=el('input',{type:'checkbox'});label.append(input,el('span',{class:'conditional-formula'},formula));list.append(label);checks.push(input);});if(root.dataset.part!=='examples')work.append(list);
    if(root.dataset.part!=='examples')controls.append(button('Check selection',()=>{const correct=checks.every((n,i)=>n.checked===hornItems[i][1]);say(correct?'Correct. Now write the Horn forms and try the second task.':'Not quite. Eliminate arrows, but also look for conjuncts that force one of the alternatives.',correct);},'check'));
    if(root.dataset.part==='selection')return;
    const form=el('form'),fields=[];
    for(let i=1;i<=3;i++) {
      const label=el('label',{},'Formula '+i),input=el('input',{maxlength:512,'aria-label':'Formula '+i});
      enableLatexInput(input);label.append(input);form.append(label);fields.push(input);
    }
    const submit=button('Check',()=>{},'check');submit.type='submit';form.append(submit);work.append(form);
    form.onsubmit=e=>{e.preventDefault();try {
      const signatures=new Set();let correct=true;
      fields.forEach(input=>{
        const result=hornWitness(input.value),bad=result.horn||signatures.has(result.signature);
        input.setAttribute('aria-invalid',String(bad));if(bad)correct=false;signatures.add(result.signature);
      });
      say(correct?'Correct: three different answers.':'Check the marked formulas: each must rule out an equivalent Horn formula and differ from your other answers.',correct);
    }catch(error){say(error.message,false);}};
    controls.append(button('Restart',()=>{fields.forEach(input=>{input.value='';input.removeAttribute('aria-invalid');});say('');},'replay'));return;
  }
  const textPanel=el('div');textAlternative(root,textPanel,q('[data-icon=accessibility]').content);
  const cases=root.dataset.kb?[{label:'Exercise KB',kb:root.dataset.kb,goal:root.dataset.goal||'STORM'}]:defaultCases;
  let current=0,method='forward',kb,state,selectedRule=-1,selectedGoal=0,history=[],selectedFacts=new Set();
  const algorithms=el('div',{class:'practice-algorithms'});setup.append(el('span',{class:'practice-label'},'Algorithm'),algorithms);
  choices(algorithms,[['forward','Forward'],['backward','Backward']],method,value=>{method=value;load(current);},'Chaining direction');
  function act(action) {try {const next=chainStep(kb,state,action);history.push(state);state=next;selectedFacts.clear();selectedRule=-1;draw();const success=method==='forward'?state.known.includes(state.goal):state.nodes[0].status==='proved';say(success?`${state.goal} has been proved.`:state.finished||state.nodes[0].status==='failed'?`${state.goal} has no derivation from this KB. This does not prove its negation.`:state.log.at(-1),success?true:undefined);}catch(error){say(error.message,false);}}
  function load(i) {current=i;kb=readRules(cases[i].kb);state=startChaining(kb,cases[i].goal,method);history=[];selectedRule=-1;selectedFacts.clear();draw();say('');}
  function draw() {
    work.replaceChildren();controls.replaceChildren();textPanel.replaceChildren();q('[data-prompt]').textContent=`ASK(KB, ${state.goal})`;
    const rules=el('div',{class:'practice-rule-grid',role:'group','aria-label':'Knowledge base'});
    kb.rules.forEach((r,i)=>{if(!r.body.length)return;const b=button(r.text,()=>{selectedRule=i;rules.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.rule===String(i))));});b.dataset.rule=String(i);b.setAttribute('aria-pressed',String(i===selectedRule));rules.append(b);});work.append(el('p',{class:'practice-label'},'Conditionals'),rules);
    let tree;
    if(method==='forward') {
      const known=el('div',{class:'practice-facts',role:'group','aria-label':'Known facts'});
      state.known.forEach(f=>{const b=button(f,()=>{if(selectedFacts.has(f))selectedFacts.delete(f);else selectedFacts.add(f);b.setAttribute('aria-pressed',String(selectedFacts.has(f)));});b.setAttribute('aria-pressed',String(selectedFacts.has(f)));known.append(b);});work.prepend(el('p',{class:'practice-label'},'Known facts'),known);
      tree=state.proofs[state.known.at(-1)];controls.append(button('Apply MP',()=>act({rule:selectedRule,premises:[...selectedFacts]}),'play'),button('No new facts',()=>act({type:'finish'}),'check'));
    }
    else {
      const facts=el('div',{class:'practice-facts','aria-label':'Known facts',role:'group'});state.known.forEach(f=>facts.append(el('span',{class:'practice-fact'},f)));if(!state.known.length)facts.append(el('span',{},'None'));work.prepend(el('p',{class:'practice-label'},'Known facts'),facts);
      const goals=state.nodes.filter(n=>n.status==='open');if(!goals.some(n=>n.id===selectedGoal))selectedGoal=goals[0]?.id;
      const picker=el('div',{class:'practice-rule-grid',role:'group','aria-label':'Open goals'});
      goals.forEach(n=>{const b=button(n.label,()=>{selectedGoal=n.id;draw();});b.setAttribute('aria-pressed',String(n.id===selectedGoal));picker.append(b);});work.append(el('p',{class:'practice-label'},'Open goals'),picker);tree=studentProof(kb,state);
      controls.append(button('Reason backwards',()=>act({node:selectedGoal,rule:selectedRule}),'play'),button('Given fact',()=>act({node:selectedGoal,type:'fact'}),'check'),button('Failed attempt',()=>act({node:selectedGoal,type:'fail'}),'undo'));
    }
    if(tree){const display=el('div',{class:'conditional-work conditional-proof-panel'});display.append(inferenceTree(tree));work.append(display);fitProofs(display);textPanel.append(el('p',{},describeProof(tree)));}
    const log=el('div');log.append(el('p',{},'Your steps'));const entries=el('ol');state.log.forEach(message=>entries.append(el('li',{},message)));log.append(entries);textPanel.append(log);
    const undo=button('Undo',()=>{state=history.pop();selectedFacts.clear();selectedRule=-1;draw();say('Last step undone.');},'undo');undo.disabled=!history.length;controls.append(undo,button('Restart',()=>load(current),'replay'));
  }
  choices(q('[data-levels]'),cases.map((c,i)=>[i,c.label]),0,load,'Queries');
  q('[data-levels]').prepend(el('span',{class:'practice-label'},'Levels'));load(0);
}
