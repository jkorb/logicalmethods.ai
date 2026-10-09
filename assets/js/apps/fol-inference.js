import {mountResolutionFullscreen} from './fol-resolution-fullscreen.js';
import {RESOLUTION_LEVELS} from '../logic/fol-inference-exercises.js';
import {el,iconButton,navigation} from './boolean-ui.js';
import {drawTree} from './deduction.js';
import {mountRewriteTrace} from './rewrite-player.js';
import {folShell,traceControls,operationButton} from './fol-ui.js';
import {celebrate} from './celebrate.js';
import {mountFOLPractice,mountUnificationQuiz} from './fol-inference-practice.js';
import {startUnification,skolemTrace,UNIFICATION_LEVELS,SKOLEM_LEVELS} from '../logic/fol-practice.js';
import {unify,printFOL,printBindings,readFOLProblem,printClause,nextResolution,resolveClauses,factorClause} from '../logic/fol-inference.js';
const RESOLUTION_EXAMPLES=[
 ['Socrates','∀x (Human(x) → Mortal(x)); Human(Socrates) ∴ Mortal(Socrates)'],
 ['PolyphemOS','∀x ((∀y BiggerThan(x, y)) → Giant(x)); ∀z BiggerThan(PolyphemOS, z) ∴ Giant(PolyphemOS)'],
 ['Factoring','∀x ∀y (P(x) ∨ P(y)); ∀x ∀y (¬P(x) ∨ ¬P(y))'],
 ['Growing terms','P(a); ∀x (P(x) → P(f(x)))']
];
export function mountFOLInference(root){
  const kind=root.dataset.kind;
  if(kind==='resolution-rule'){
    const leaf=label=>({label,children:[]});
    const rules=el('div',{class:'finf-rules'}),rule=(...parts)=>{const box=el('div');box.append(...parts);rules.append(box);};
    rule(drawTree({label:'(C ∨ E)σ',rule:'Resolution',children:[leaf('C ∨ B'),leaf('¬D ∨ E')]}),el('p',{class:'nd-math'},'where Bσ = Dσ'));
    rule(drawTree({label:'(C ∨ B)σ',rule:'Factoring',children:[leaf('C ∨ B ∨ D')]}),el('p',{class:'nd-math'},'where Bσ = Dσ · B and D have the same sign'));
    root.querySelector('[data-finf-mount]').append(rules);return;
  }
  if(kind==='unify-quiz')return mountUnificationQuiz(root);
  if(['unify','skolem'].includes(kind)){
    if(root.dataset.mode==='practice')return mountFOLPractice(root);
    const ui=folShell(root,kind==='unify'?UNIFICATION_LEVELS:SKOLEM_LEVELS);traceControls(ui);
    ui.run=source=>{
      let steps,finish='';
      if(kind==='unify'){
        const result=unify(startUnification(source).pending);
        steps=result.steps;
        finish=result.ok?'Most general unifier: '+printBindings(result.bindings):'No unifier exists.';
        ui.applied(source);
        navigation(root,steps.length,index=>{
          const step=steps[index],list=el('ol',{class:'finf-equations nd-math'});
          step.pending.forEach(([a,b],i)=>list.append(el('li',i===0?{'aria-current':'step'}:{},printFOL(a)+' ≐ '+printFOL(b))));
          ui.board.replaceChildren(el('p',{class:'nd-math'},'Eq ='),step.pending.length?list:el('p',{class:'nd-math'},'[]'),el('p',{class:'nd-math'},'σ = '+printBindings(step.bindings)));
          const details=el('dl',{class:'logic-app__details'});
          for(const [label,value] of [['Current step',step.explanation],['Next step',steps[index+1]?.explanation||finish]])details.append(el('dt',{},label),el('dd',{},value));
          ui.status.replaceChildren(details);
        });return;
      }else steps=skolemTrace(source);
      ui.applied(source);mountRewriteTrace(root,steps,finish);
    };
    if(root.dataset.tool==='true'){ui.editing(false);return;}
    ui.attempt(()=>ui.run(root.dataset.formula||(kind==='unify'?UNIFICATION_LEVELS:SKOLEM_LEVELS)[0][1]));return;
  }
  mountResolution(root,kind==='practice');
}
function mountResolution(root,practice){
  const examples=root.dataset.deck==='exercises'?RESOLUTION_LEVELS:root.dataset.formula?[['Given inference',root.dataset.formula]]:RESOLUTION_EXAMPLES;
  const ui=folShell(root,examples,practice);ui.picker.hidden=root.dataset.tool==='true'||examples.length===1;
  mountResolutionFullscreen(root,ui.board);
  let clauses=[],history=[],selected=[],source='',initial=0,solved=false;

  const undo=iconButton(root,'undo','Undo'),restart=iconButton(root,'replay','Restart');
  const resolve=operationButton(root,'resolve','Resolve selected literals','Resolve'),factor=operationButton(root,'factor','Factor selected literals','Factor');
  if(practice){ui.controls.append(resolve,factor);ui.nav.append(undo,restart);}else traceControls(ui);
  function selection(){
    ui.board.querySelectorAll('[data-literal]').forEach(b=>{
      const order=selected.findIndex(s=>s.join(':')===b.dataset.literal);b.setAttribute('aria-pressed',String(order>=0));
      b.dataset.order=order>=0?String(order+1):'';
    });
    resolve.disabled=factor.disabled=clauses.some(c=>!c.length)||selected.length!==2;
  }
  function render(message){
    const latest=history.at(-1),list=el('ol',{class:'sat-clauses nd-math'});
    clauses.forEach((c,a)=>{
      const row=el('li',latest?.id===a?{'aria-current':'step'}:{});
      if(!c.length)row.textContent='⊥';
      c.forEach((literal,i)=>{
        if(i)row.append(' ∨ ');
        if(practice){const b=el('button',{type:'button',class:'finf-literal','data-literal':`${a}:${i}`,'aria-label':`Clause ${a+1}: ${printClause([literal])}`,'aria-pressed':'false'},printClause([literal]));b.onclick=()=>{
          const key=selected.findIndex(s=>s[0]===a&&s[1]===i);
          if(key>=0)selected.splice(key,1);else if(selected.length<2)selected.push([a,i]);else selected=[[a,i]];
          selection();
        };row.append(b);}
        else {const pivot=latest&&(latest.a===a&&latest.i===i||(latest.kind==='factor'?latest.a:latest.b)===a&&latest.j===i);row.append(el(pivot?'mark':'span',pivot?{class:'finf-pivot'}:{},printClause([literal])));}
      });list.append(row);
    });
    ui.board.replaceChildren(list);
    if(latest){
      const tree=(id,depth=0)=>{const h=history.find(h=>h.id===id);return {label:printClause(clauses[id]),rule:h?`${h.kind==='factor'?'Factoring':'Resolution'} ${printBindings(h.bindings)}`:'',children:h&&depth<8?[h.a,...(h.kind==='resolve'?[h.b]:[])].map(i=>tree(i,depth+1)):[]};};
      ui.board.append(drawTree(tree(latest.id)),el('p',{class:'nd-math finf-parents'},'Parents used: '+latest.parents.map(printClause).join('; ')));
    }
    const empty=clauses.some(c=>!c.length);
    ui.status.textContent=empty?'Empty clause derived. The input is unsatisfiable; if you supplied a conclusion, the inference is valid.':message||(practice?'Select two literals in the clauses, then resolve them. To factor, select two literals in one clause.':'The initial clauses are ready. Advance to see a resolution or factoring step.');
    if(practice){undo.disabled=!history.length;selection();}

  }
  function apply(kind){
    if(selected.length!==2)throw Error('Select two literals in the clauses.');
    if(clauses.length>=80)throw Error('Stopped at 80 clauses; the result is undecided.');
    const [[a,i],[b,j]]=selected;
    if(kind==='factor'&&a!==b)throw Error('Factoring uses two literals in the same clause.');
    const result=kind==='factor'?factorClause(clauses[a],i,j):resolveClauses(clauses[a],clauses[b],i,j);
    history.push({kind,a,...(kind==='resolve'?{b}:{}),i,j,...result,id:clauses.length});clauses=[...clauses,result.clause];selected=[];render();
    if(!result.clause.length&&!solved){solved=true;celebrate(root);}ui.board.focus({preventScroll:true});
  }
  resolve.onclick=()=>ui.attempt(()=>apply('resolve'));factor.onclick=()=>ui.attempt(()=>apply('factor'));
  undo.onclick=()=>{history.pop();clauses=clauses.slice(0,initial+history.length);selected=[];render();};restart.onclick=()=>ui.attempt(()=>ui.run(source));
  ui.run=s=>{
    const p=readFOLProblem(s);source=s;clauses=p.clauses;initial=clauses.length;history=[];selected=[];solved=false;

    ui.applied(s);
    if(practice){render();return;}
    const frames=[{clauses:[...clauses],history:[]}];let end='';
    const limit=s===RESOLUTION_EXAMPLES[3][1]?4:16;
    for(let i=0;i<limit&&!clauses.some(c=>!c.length);i++){
      let next;try{next=nextResolution(clauses);}catch(e){end=e.message;break;}
      if(!next){end='No new clause was found by this bounded search. No countermodel is displayed.';break;}
      history=[...history,{...next,id:clauses.length}];clauses=[...clauses,next.clause];frames.push({clauses,history});
    }
    if(frames.length===limit+1&&!clauses.some(c=>!c.length))end=`The demonstration stops after ${limit} inferences. The result remains undecided.`;
    navigation(root,frames.length,index=>{
      ({clauses,history}=frames[index]);const h=history.at(-1);
      render((h?`${h.kind==='factor'?'Factor clause '+(h.a+1):'Resolve clauses '+(h.a+1)+' and '+(h.b+1)} using ${printBindings(h.bindings)}. The unifier applies to the whole result. `:'')+(index===frames.length-1?end:''));
    });
  };
  if(root.dataset.tool==='true')ui.editing(false);
  else ui.attempt(()=>ui.run(root.dataset.formula||examples[0][1]));
}
