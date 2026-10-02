import {el} from './boolean-ui.js';
import {highlightLean} from './lean-code.js';
import {EXAMPLES,exampleProof} from '../logic/deduction-examples.js';
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
  const mount=root.querySelector('[data-nd-mount]'),example=EXAMPLES.find(e=>e.id==='heating'),{proof,root:conclusion}=exampleProof(example);
  let code,sourceLink;
  if(root.dataset.code==='previous'){
    for(let sibling=root.previousElementSibling;sibling&&!code;sibling=sibling.previousElementSibling)code=sibling.querySelector('code.language-lean');
    if(code){const original=code.closest('.code-block'),copy=original.cloneNode(true);copy.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));copy.removeAttribute('id');sourceLink=original.nextElementSibling?.classList.contains('lean-playground-link')?original.nextElementSibling.cloneNode(true):null;code=copy.querySelector('code.language-lean');}
  }
  if(!code){const block=el('div',{class:'code-block has-lang-icon nd-lean'}),badge=el('span',{class:'lang-badge',role:'img','aria-label':'Lean'}),highlight=el('div',{class:'highlight'}),pre=el('pre',{class:'chroma'});badge.append(root.querySelector('[data-lean-icon]').content.cloneNode(true));code=el('code',{class:'language-lean'});pre.append(code);highlight.append(pre);block.append(badge,highlight);mount.append(block);code.textContent=example.code;}
  const block=code.closest('.code-block'),link=sourceLink||(block.nextElementSibling?.classList.contains('lean-playground-link')?block.nextElementSibling:null);const panes=el('div',{class:'nd-walk-panes'}),codePane=el('div');codePane.append(block);if(link)codePane.append(link);panes.append(codePane);
  const source=code.textContent.trimEnd(),lines=source.split('\n');code.replaceChildren(...lines.map(line=>{const span=el('span',{class:'nd-lean-line'});highlightLean(span,line+'\n');return span;}));
  const nav=el('div',{class:'nd-navigation'}),count=el('span'),goal=el('p',{class:'nd-goal'}),board=el('div',{class:'nd-board',tabindex:'0',role:'region','aria-label':'Heating derivation','data-picture':''}),status=el('p',{class:'nd-status',role:'status'});let position=0;
  const makeButton=(name,icon,move)=>{const b=el('button',{type:'button','aria-label':name});b.append(root.querySelector(`[data-${icon}-icon]`).content.cloneNode(true));b.onclick=()=>{position+=move;render();};return b;};
  const previous=makeButton('Previous step','previous',-1),next=makeButton('Next step','next',1);nav.append(previous,count,next);panes.append(board);mount.append(nav,goal,panes,status);
  function render(){const step=steps[position];goal.textContent=step.goal?'Goal: '+step.goal:'No goals remain';status.textContent=step.text;count.textContent=position+' / '+(steps.length-1);previous.disabled=position===0;next.disabled=position===steps.length-1;
    const tree=id=>{const n=proof.nodes[id];return {label:printFormula(n.formula),active:id===step.node&&!step.rule,activeRule:id===step.node&&!!step.rule,rule:n.rule==='assumption'?'':RULES[n.rule][0],children:n.parents.map(tree)};};const drawing=drawTree(tree(conclusion));board.replaceChildren(drawing);requestAnimationFrame(()=>{drawing.style.zoom='1';drawing.style.zoom=String(Math.max(.72,Math.min(1,(board.clientWidth-20)/drawing.scrollWidth)));});
    code.querySelectorAll('.nd-lean-line').forEach((line,i)=>{if(step.command&&lines[i].trim()===step.command)line.setAttribute('aria-current','step');else line.removeAttribute('aria-current');});
  }
  render();
}
