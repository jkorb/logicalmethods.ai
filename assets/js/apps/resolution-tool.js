import {el,iconButton} from './boolean-ui.js';
import {folShell,operationButton} from './fol-ui.js';
import {mountResolutionFullscreen} from './fol-resolution-fullscreen.js';
import {readProblem,rewriteTrace,printFormula} from '../logic/sat.js';
import {createResolutionSession,applyResolutionChoice,resolutionOutcome} from '../logic/sat-practice.js';

// Reuse the checked propositional session with the literal-selection canvas.
export function mountResolutionTool(root){
  const templates=[...root.querySelectorAll('template')];
  root.replaceChildren(...templates,el('div',{'data-finf-mount':''}));
  root.classList.add('fol-inference-app','nd-app');
  const ui=folShell(root,[],true);ui.input.setAttribute('aria-label','Propositional input');
  ui.board.setAttribute('aria-label','Propositional resolution');
  mountResolutionFullscreen(root,ui.board);
  let state,initial,selected=[],history=[],inference=false;
  const resolve=operationButton(root,'resolve','Resolve selected literals','Resolve');
  const undo=iconButton(root,'undo','Undo'),restart=iconButton(root,'replay','Restart');
  const saturated=operationButton(root,'saturated','Check saturation','Saturated?');
  ui.controls.append(resolve,saturated);ui.nav.append(undo,restart);
  const atom=t=>t.label==='¬'?t.children[0].label:t.label;
  function render(message){
    const list=el('ol',{class:'sat-clauses nd-math'});
    for(const clause of state.clauses){
      const row=el('li');
      if(!clause.literals.length)row.textContent='⊥';
      clause.literals.forEach((literal,index)=>{
        if(index)row.append(' ∨ ');
        const key=clause.id+':'+index,order=selected.findIndex(s=>s.key===key);
        const b=el('button',{type:'button',class:'finf-literal','data-literal':key,'aria-label':`Clause ${clause.id}: ${printFormula(literal)}`,'aria-pressed':String(order>=0),'data-order':order>=0?String(order+1):''},printFormula(literal));
        b.onclick=()=>{selected=order>=0?selected.filter(s=>s.key!==key):[...selected.slice(-1),{key,id:clause.id,literal}];render();ui.board.querySelector(`[data-literal="${key}"]`)?.focus({preventScroll:true});};row.append(b);
      });
      if(clause.parents)row.append(el('small',{},` From ${clause.parents.join(', ')} on ${clause.pivot}.`));
      list.append(row);
    }
    ui.board.replaceChildren(list);undo.disabled=!history.length;
    const outcome=resolutionOutcome(state);
    resolve.disabled=selected.length!==2||outcome==='unsatisfiable';
    ui.status.textContent=outcome==='unsatisfiable'?'Empty clause derived. '+(inference?'The inference is valid.':'The input is unsatisfiable.'):message||'Select complementary literals in two clauses, then Resolve.';
  }
  resolve.onclick=()=>ui.attempt(()=>{
    const [a,b]=selected;
    if(a.id===b.id||atom(a.literal)!==atom(b.literal)||a.literal.label===b.literal.label)throw Error('Select opposite literals of the same variable in two different clauses.');
    const next=applyResolutionChoice(state,a.id,b.id,atom(a.literal));history.push(state);state=next;selected=[];
    render(state.history.at(-1).note);
  });
  undo.onclick=()=>{state=history.pop();selected=[];render('Last resolution undone.');};
  restart.onclick=()=>{state=structuredClone(initial);selected=[];history=[];render();};
  saturated.onclick=()=>{const outcome=resolutionOutcome(state);render(outcome==='satisfiable'?(inference?'Saturated without an empty clause. The inference is invalid.':'Saturated without an empty clause. The input is satisfiable.'):'There are unchecked clause pairs and pivots.');};
  ui.run=source=>{
    const problem=readProblem(source),cnf=rewriteTrace(problem.conjunction,'CNF');
    if(!cnf.complete)throw Error(cnf.reason);
    state=createResolutionSession(printFormula(cnf.tree));initial=structuredClone(state);inference=problem.inference;
    history=[];selected=[];ui.applied(source);render();
  };
  ui.editing(false);
}
