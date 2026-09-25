import { planningAtoms, timedAtom, timedState } from '../logic/planning-input.js';
import { celebrate } from './celebrate.js';
import { checkPlanningLanguage } from '../logic/conditional-practice.js';
import { plan, planningExamples, blockFrames, monkeyFrames, blockArrangements, checkPlanningStates } from '../logic/planning.js';
import { el, navigation, choices } from './boolean-ui.js';
export function mountPlanning(root) {
  const q=s=>root.querySelector(s),status=q('.conditional-aside [role=status]'),work=q('[data-work]');
  const example=root.dataset.example || 'two',domain=planningExamples[example],chapter=root.dataset.frames==='chapter',exercise=root.dataset.exercise==='true';
  let languageCorrect=false;
  const feedback=(node,message,correct)=>{node.textContent=message;node.dataset.feedback=correct?'correct':'incorrect';if(correct)celebrate(root);else {root.classList.remove('is-shaking');void root.offsetWidth;root.classList.add('is-shaking');}};
  if(exercise) {
    q('[data-check-language]').onclick=()=>{languageCorrect=checkPlanningLanguage(q('[data-language]').value,example);feedback(q('[data-language-feedback]'),languageCorrect?'Correct. Your language can describe the relevant states.':'Not yet. Check for missing atoms, repeats, or atoms outside the required language.',languageCorrect);};
    q('[data-language]').addEventListener('input',()=>{languageCorrect=false;q('[data-language-feedback]').textContent='';});
  }
  q('[data-edit]').hidden=true;q('[data-text]').hidden=true;q('[data-history]').hidden=true;
  const frames=example==='monkey'?monkeyFrames:blockFrames;
  const cases=example==='two'?[
    {label:'Green on red',initial:'On(G,R)',goal:'On(R,G)'},
    {label:'Red on green',initial:'On(R,G)',goal:'On(G,R)'},
    {label:'Both on table',initial:'',goal:'On(R,G)'}
  ]:[{label:domain.label,initial:domain.initial,goal:domain.goal}];
  function clear(message='Inputs changed. Press Plan! to find a new model.') {
    work.replaceChildren();q('[data-rules]').replaceChildren();q('[data-count]').textContent='';root.querySelectorAll('[data-action]').forEach(b=>b.disabled=true);status.textContent=message;delete status.dataset.feedback;
  }
  function load(index) {
    const c=cases[index];q('[data-initial]').value=exercise?'':timedState(c.initial,0);q('[data-goal]').value=exercise?'':timedState(c.goal,domain.horizon);q('[data-horizon]').value=domain.horizon;q('[data-complete]').checked=true;
    root.querySelectorAll('[data-frame]').forEach((n,i)=>{n.value=chapter&&!exercise?frames[i]:'';});
    clear(exercise?'Enter your language and state descriptions.':'Press Plan! to find a model. All conditions remain editable.');
    if(exercise) {
      const pictures=q('[data-task-pictures]');pictures.replaceChildren();
      for(const [label,source,description] of [['Initial state',c.initial,example==='three'?'Green on blue, blue on red.':'The monkey is on the floor beside the box; the box is away from the banana.'],['Goal',c.goal,example==='three'?'Blue on green, green on red.':'The monkey has the banana. Other facts are unrestricted.']]) {
        const figure=el('figure');figure.append(el('figcaption',{},label),scene(root,{time:0,true:stateParts(source)},domain,'',true),el('span',{class:'visually-hidden'},description));pictures.append(figure);
      }
    } else if(domain.blocks)work.append(scene(root,{time:0,true:stateParts(c.initial).filter(f=>!f.startsWith('¬'))},domain,c.goal));
  }
  if(!exercise)choices(q('[data-examples]'),cases.map((c,i)=>[i,c.label]),0,load,'Initial configurations');
  if(!exercise)q('[data-examples]').prepend(el('span',{class:'app-picker-label',title:'Examples'},'Ex.'));
  q('[data-description]').textContent=example==='monkey'?'The monkey begins beside the box, without the banana.':'R is red, G green'+(domain.blocks.length===3?' and B blue':'')+'. A block with nothing beneath it stands on the table.';
  q('[data-state-help]').textContent='Time: initial = 0, goal = horizon; omitted indices are inferred. Separate atoms with spaces, commas or semicolons. Write none if all initial atoms are false.';
  q('[data-frame-help]').textContent=example==='monkey'?'One condition per line. Use the state and action names from the exercise, with t and t+1 for consecutive times. Every line applies at each action time. Empty boxes impose no persistence.':'X and Y range over distinct blocks; t ranges over action times. Both formulas apply to every such choice. Empty boxes impose no persistence.';
  if(q('[data-frames]'))q('[data-frames]').onclick=()=>{root.querySelectorAll('[data-frame]').forEach((n,i)=>n.value=frames[i]);clear('Chapter frames restored. Press Plan! to solve again.');};
  q('[data-clear-frames]').onclick=()=>{root.querySelectorAll('[data-frame]').forEach(n=>n.value='');clear('Both frame conditions are absent. Press Plan! to investigate the resulting model.');};
  let previousHorizon=domain.horizon;
  q('[data-horizon]').addEventListener('input',()=>{
    const next=Number(q('[data-horizon]').value);
    if(Number.isInteger(next)&&next>=1&&next<=6) {
      try {q('[data-goal]').value=planningAtoms(q('[data-goal]').value,previousHorizon).map(a=>timedAtom(a,next)).join('; ');}catch { /* Leave an unfinished edit untouched. */ }
      previousHorizon=next;
    }
  });
  root.querySelectorAll('form input,form textarea').forEach(n=>n.addEventListener('input',()=>clear()));
  q('[data-form]').onsubmit=e=>{e.preventDefault();clear('Solving…');try {
    const initial=q('[data-initial]').value.trim(),goalInput=q('[data-goal]').value.trim();
    const initialSource=/^none$/iu.test(initial)?'':initial;
    if(exercise) {
      if(!languageCorrect)throw new Error('Check your language first.');
      if(!initial || !goalInput)throw new Error('Translate both pictures before planning. Write none if no initial atom is true.');
      const checks=checkPlanningStates(example,initialSource,goalInput,q('[data-complete]').checked,Number(q('[data-horizon]').value));
      if(!checks.initial)throw new Error('The initial conditions do not describe the pictured starting state.');
      if(!checks.goal)throw new Error('The goal conditions do not describe the requested goal.');
    }
    const result=plan({example,initial:initialSource,goal:q('[data-goal]').value,horizon:q('[data-horizon]').value,completeInitial:q('[data-complete]').checked,frames:[...root.querySelectorAll('[data-frame]')].map(n=>n.value)});
    if(result.status==='unsat'){status.textContent=`No model satisfies these conditions within ${result.horizon} action steps. This does not exclude a longer plan.`;return;}
    const goal=planningAtoms(q('[data-goal]').value,Number(q('[data-horizon]').value)).join('; ');
    navigation(root,result.states.length,index=>{
      const state=result.states[index],changes=result.miracles.filter(m=>m.time===index);
      work.replaceChildren(scene(root,state,domain,goal));
      status.textContent=`Time ${index}. ${state.action?'Next action: '+state.action+'.':'The goal conditions hold.'} ${changes.length?'Unexplained change: '+changes.map(c=>c.fluent).join(', ')+'. No chosen action produced it.':index===0 && result.miracles.length?'This model contains unexplained changes; step forward to inspect them.':''}`;
      q('[data-rules]').replaceChildren(el('p',{class:'conditional-formula'},state.true.map(f=>timedAtom(f,state.time)).join('; ') || 'All state atoms are false.'),el('p',{class:'conditional-help'},'Unlisted atoms are false in this model.'+(q('[data-complete]').checked?'':' The solver chose one of the permitted initial states.')));
    });
  } catch(error){if(exercise)feedback(status,error.message,false);else status.textContent=error.message;}};
  load(0);
}
const stateParts=planningAtoms;
// Isolate the top red cube's three original groups. Geometry is untouched;
// only the authored fill changes for green and blue instances.
function cube(root,color) {
  const original=root.querySelector('[data-box-art]').content.querySelector('svg');
  const copy=original.cloneNode(false);copy.removeAttribute('role');copy.setAttribute('aria-hidden','true');copy.setAttribute('viewBox','8 8 32 35');
  [...original.children].filter(n=>n.tagName.toLowerCase()==='g').slice(-3).forEach(g=>copy.append(g.cloneNode(true)));
  const fills={R:'#ffc9c9',G:'#b2f2bb',B:'#a5d8ff'};
  copy.querySelectorAll('[fill="#ffc9c9"]').forEach(p=>p.setAttribute('fill',fills[color]));
  return copy;
}
function blocks(root,truths,domain,mini=false) {
  const layer=el('div',{class:mini?'planning-stack planning-stack--mini':'planning-stack'});
  const below=new Map(truths.map(f=>{const m=f.match(/On\((.),(.)\)/u);return[m[1],m[2]];}));
  const bases=domain.blocks.filter(b=>!below.has(b));
  for(const b of domain.blocks) {
    let base=b,level=0;while(below.has(base)){base=below.get(base);level++;}
    const box=el('span',{class:'planning-cube','data-block':b});box.append(cube(root,b));
    box.style.left=`${(bases.indexOf(base)+.5)*100/bases.length}%`;box.style.bottom=`calc(${level} * var(--cube-rise))`;box.style.zIndex=String(level+1);
    layer.append(box);
  }
  return layer;
}
function goalBoard(root,domain,goal) {
  const board=el('div',{class:'planning-goal'});board.append(root.querySelector('[data-board]').content.cloneNode(true));
  const conditions=stateParts(goal),possible=blockArrangements(domain.blocks).filter(s=>conditions.every(f=>f.startsWith('¬')?!s.includes(f.slice(1)):s.includes(f)));
  const pictures=el('div',{class:'planning-goal-pictures'});
  possible.slice(0,3).forEach(s=>pictures.append(blocks(root,s,domain,true)));
  if(possible.length>3)pictures.append(el('small',{},`+ ${possible.length-3} states`));
  if(!possible.length)pictures.append(el('small',{},'No block arrangement'));
  board.append(pictures);return board;
}
function scene(root,state,domain,goal,task=false) {
  const outer=el('div',{class:'planning-scene'});
  if(!domain.blocks) {
    const stage=el('div',{class:'monkey-scene','aria-hidden':'true'}),boxX=state.true.includes('BoxUnderBanana')?20:70,monkeyX=state.true.includes('OnBox')?boxX:boxX+17;
    for(const [label,x,bottom,cls] of [['▱',boxX,4,'monkey-box'],['🐒',monkeyX,state.true.includes('OnBox')?28:8,'monkey-actor'],['🍌',state.true.includes('HasBanana')?monkeyX-9:20,state.true.includes('HasBanana')?38:75,'monkey-banana']]){const n=el('span',{class:cls},label);n.style.left=x+'%';n.style.bottom=bottom+'%';if(cls==='monkey-box'||cls==='monkey-banana') {n.textContent='';n.append(root.querySelector(`[data-monkey-art="${cls==='monkey-box'?'box_closed':'banana'}"]`).content.cloneNode(true));}stage.append(n);}outer.append(stage);if(!task)outer.append(el('p',{class:'conditional-help'},`Time ${state.time}. Goal: ${timedState(goal,Number(root.querySelector('[data-horizon]').value))}.`));return outer;
  }
  const stage=el('div',{class:'planning-stage','aria-hidden':'true'}),table=el('div',{class:'planning-table'}),ai=el('div',{class:'planning-ai'});
  table.append(root.querySelector('[data-table]').content.cloneNode(true));ai.append(root.querySelector('[data-ai]').content.cloneNode(true));
  if(!task)stage.append(goalBoard(root,domain,goal));stage.append(table,ai,blocks(root,state.true,domain));
  outer.append(stage);if(!task)outer.append(el('p',{class:'conditional-help'},`Time ${state.time}. Goal: ${timedState(goal,Number(root.querySelector('[data-horizon]').value))}.`));return outer;
}
