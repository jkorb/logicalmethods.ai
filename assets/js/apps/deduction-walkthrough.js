import {el} from './boolean-ui.js';
import {highlightLean} from './lean-code.js';
import {EXAMPLES,FOL_EXAMPLES,exampleProof} from '../logic/deduction-examples.js';
import {printFormula,RULES} from '../logic/deduction.js';

// Follow the tactic commands backwards through the checked heating derivation.
const steps=[
  {command:null,goal:'HEATING',node:5,text:'We need a proof of HEATING. The three assumptions are already available.'},
  {command:'apply if_cold_then_heating',goal:'HEATING',node:5,rule:true,text:'apply if_cold_then_heating chooses → Elim as the last inference. COLD → HEATING supplies its conditional premise.'},
  {command:'apply if_cold_then_heating',goal:'COLD',node:4,text:'The other premise of that inference is COLD. This is now the goal.'},
  {command:'apply if_rain_or_wind_then_cold',goal:'COLD',node:4,rule:true,text:'apply if_rain_or_wind_then_cold chooses another → Elim. This time the conditional premise is RAIN ∨ WIND → COLD.'},
  {command:'apply if_rain_or_wind_then_cold',goal:'RAIN ∨ WIND',node:3,text:'To complete this inference, we still need its other premise, RAIN ∨ WIND.'},
  {command:'apply Or.inl',goal:'RAIN ∨ WIND',node:3,rule:true,text:'apply Or.inl chooses ∨ Intro · left. This rule will give us RAIN ∨ WIND from a proof of RAIN.'},
  {command:'apply Or.inl',goal:'RAIN',node:0,text:'RAIN is the premise still needed for ∨ Intro · left. It becomes the new goal.'},
  {command:'exact rain',goal:null,node:0,text:'exact rain supplies the assumption RAIN. The last open goal is closed.'},
  {command:null,goal:null,node:5,text:'Starting from RAIN, the three inferences now give RAIN ∨ WIND, then COLD, then HEATING. The derivation is complete.'}
];
export function mountLeanWalkthrough(root,drawTree){
  const mount=root.querySelector('[data-nd-mount]'),example=root.dataset.language==='fol'?(FOL_EXAMPLES.find(e=>e.id===root.dataset.example)||FOL_EXAMPLES[0]):EXAMPLES.find(e=>e.id==='heating'),{proof,root:conclusion}=exampleProof(example);
  const folFrames={
    socrates:[
      {node:3,goal:'Mortal(Socrates)',text:'The goal is Mortal(Socrates). The universal rule and Human(Socrates) are assumptions.'},
      {node:2,rule:true,command:'apply h Socrates',goal:'Mortal(Socrates)',text:'h Socrates instantiates the universal proof at Socrates, using ∀ Elim.'},
      {node:3,rule:true,command:'apply h Socrates',goal:'Human(Socrates)',text:'apply uses Human(Socrates) → Mortal(Socrates) by → Elim. Human(Socrates) remains to be proved.'},
      {node:1,command:'exact hs',goal:null,text:'exact hs supplies Human(Socrates), closing the remaining goal.'},
      {node:3,goal:null,text:'Universal elimination and conditional elimination give Mortal(Socrates).'}
    ],
    witness:[
      {node:4,goal:example.goal,text:'Use the existential premise to prove the existential conclusion.'},
      {node:4,rule:true,command:'apply Exists.elim h',goal:example.goal,text:'Exists.elim starts a subproof that must establish the conclusion for an arbitrary witness.'},
      {node:1,command:'intro z hz',goal:example.goal,text:'Introduce the object z and the assumption hz : Black z. The final conclusion must not contain z freely.'},
      {node:3,rule:true,command:'apply Exists.intro z',goal:'Black(z) ∨ White(z)',text:'Exists.intro z chooses z as a witness. We must prove Black(z) ∨ White(z).'},
      {node:2,rule:true,command:'apply Or.inl',goal:'Black(z)',text:'Or.inl reduces the disjunction to its left disjunct, Black(z).'},
      {node:1,command:'exact hz',goal:null,text:'exact hz proves Black(z). The subproof is complete.'},
      {node:4,goal:null,text:'Existential elimination discharges Black(z). The conclusion is independent of which witness was chosen.'}
    ]
  };
  folFrames.nonempty=[
    {node:2,goal:'∃x A(x)',text:'The declaration [Inhabited Domain] supplies default : Domain. The goal needs a witness.'},
    {node:2,rule:true,command:'apply Exists.intro (default : Domain)',goal:'A(default)',text:'Choose the supplied object default. The remaining goal is A(default).'},
    {node:1,command:'exact h default',goal:null,text:'The universal premise h applies to every object, including default. This closes the goal.'}
  ];
  folFrames.equality=[
    {node:2,goal:'Human(b)',text:'The identity heq says that a and b denote the same object. ha proves Human(a).'},
    {node:2,rule:true,command:'exact Eq.subst heq ha',goal:null,text:'Eq.subst transports the proof of Human(a) along a = b to obtain Human(b).'}
  ];
  folFrames['duality-one-ltr']=[
    {node:8,goal:example.goal,text:'The premise denies that every object has A. We seek an object without A.'},
    {node:8,rule:true,occurrence:0,command:'apply Classical.byContradiction',goal:'⊥',text:'Assume there is no counterexample and seek a contradiction. This uses the classical rule.'},
    {node:1,command:'intro hn',goal:'⊥',text:'hn is the temporary assumption ¬∃x ¬A(x).'},
    {node:7,rule:true,command:'apply h',goal:'∀x A(x)',text:'To contradict h, prove that every object has A.'},
    {node:6,rule:true,command:'intro x',goal:'A(x)',text:'Take an arbitrary object x. It occurs freely in neither remaining assumption.'},
    {node:5,rule:true,occurrence:1,command:'apply Classical.byContradiction',goal:'⊥',text:'To prove A(x), assume its negation and seek a contradiction. This is the inner classical step.'},
    {node:2,command:'intro hx',goal:'⊥',text:'The inner classical argument assumes ¬A(x). This would supply a counterexample.'},
    {node:3,rule:true,command:'apply Exists.intro x',goal:'¬A(x)',text:'Use x as the existential witness.'},
    {node:2,command:'exact hx',goal:null,text:'hx contradicts hn through existential introduction. The inner classical step gives A(x), and the outer argument concludes ∃x ¬A(x).'}
  ];
  const frames=root.dataset.language==='fol'?(folFrames[example.id]||[{node:conclusion,goal:example.goal,text:example.hint},...proof.nodes.map(n=>({node:n.id,rule:n.rule!=='assumption',goal:printFormula(n.formula),text:n.rule==='assumption'?`Available assumption: ${printFormula(n.formula)}.`:`${RULES[n.rule][0]} gives ${printFormula(n.formula)}. ${n.term?'Witness term: '+n.term+'. ':''}${n.variable?'Object variable: '+n.variable+'. ':''}${n.discharge.length?'Discharge the temporary witness assumption.':''}`})),{node:conclusion,goal:null,text:'The checked derivation establishes the conclusion from the stated premises.'}]):steps;
  let code,sourceLink;
  if(root.dataset.code==='previous'){
    for(let sibling=root.previousElementSibling;sibling&&!code;sibling=sibling.previousElementSibling)code=sibling.querySelector('code.language-lean');
    if(code){const original=code.closest('.code-block'),copy=original.cloneNode(true);copy.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));copy.removeAttribute('id');sourceLink=original.nextElementSibling?.classList.contains('lean-playground-link')?original.nextElementSibling.cloneNode(true):null;code=copy.querySelector('code.language-lean');}
  }
  if(!code){const block=el('div',{class:'code-block has-lang-icon nd-lean'}),badge=el('span',{class:'lang-badge',role:'img','aria-label':'Lean'}),highlight=el('div',{class:'highlight'}),pre=el('pre',{class:'chroma'});badge.append(root.querySelector('[data-lean-icon]').content.cloneNode(true));code=el('code',{class:'language-lean'});pre.append(code);highlight.append(pre);block.append(badge,highlight);mount.append(block);code.textContent=example.code;}
  const block=code.closest('.code-block'),link=sourceLink||(block.nextElementSibling?.classList.contains('lean-playground-link')?block.nextElementSibling:null);const panes=el('div',{class:'nd-walk-panes'}),codePane=el('div');codePane.append(block);if(link)codePane.append(link);panes.append(codePane);
  // Walkthrough panes are created after the static code-block accessibility pass.
  const scroller=code.closest('.highlight');
  scroller.setAttribute('tabindex','0');scroller.setAttribute('role','group');scroller.setAttribute('aria-label','Lean proof');
  const source=code.textContent.trimEnd(),lines=source.split('\n');code.replaceChildren(...lines.map(line=>{const span=el('span',{class:'nd-lean-line'});highlightLean(span,line+'\n');return span;}));
  const nav=el('div',{class:'nd-navigation'}),count=el('span'),goal=el('p',{class:'nd-goal'}),board=el('div',{class:'nd-board',tabindex:'0',role:'region','aria-label':example.label+' derivation','data-picture':''}),status=el('p',{class:'nd-status',role:'status'});let position=0;
  const makeButton=(name,icon,move)=>{const b=el('button',{type:'button','aria-label':name});b.append(root.querySelector(`[data-${icon}-icon]`).content.cloneNode(true));b.onclick=()=>{position+=move;render();};return b;};
  const previous=makeButton('Previous step','previous',-1),next=makeButton('Next step','next',1);const reset=makeButton('Reset walkthrough','reset',0);reset.title='Reset walkthrough';reset.onclick=()=>{position=0;render();};nav.append(previous,count,next,reset);const drawing=el('div',{class:'nd-layout'}),tools=el('div',{class:'nd-canvas-controls','data-export-controls':''});drawing.append(tools,board);panes.append(drawing);mount.append(nav,goal,panes,status);
  function render(){const step=frames[position];goal.textContent=step.goal?'Goal: '+step.goal:'No goals remain';status.textContent=step.text;count.textContent=position+' / '+(frames.length-1);previous.disabled=position===0;next.disabled=position===frames.length-1;
    const tree=id=>{const n=proof.nodes[id];return {label:printFormula(n.formula),active:id===step.node&&!step.rule,activeRule:id===step.node&&!!step.rule,rule:n.rule==='assumption'?'':RULES[n.rule][0],children:n.parents.map(tree)};};const drawing=drawTree(tree(conclusion));board.replaceChildren(drawing);requestAnimationFrame(()=>{drawing.style.zoom='1';drawing.style.zoom=String(Math.max(.72,Math.min(1,(board.clientWidth-20)/drawing.scrollWidth)));});
    code.querySelectorAll('.nd-lean-line').forEach((line,i)=>{if(step.command&&lines[i].trim()===step.command&&(step.occurrence===undefined||lines.slice(0,i).filter(s=>s.trim()===step.command).length===step.occurrence))line.setAttribute('aria-current','step');else line.removeAttribute('aria-current');});
  }
  render();
}
