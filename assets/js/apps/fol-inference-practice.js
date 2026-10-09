import {enableLatexInput} from './latex-input.js';
import {levels as exerciseLevels} from './fol-levels.js';
import {el,iconButton} from './boolean-ui.js';
import {folShell,operationButton} from './fol-ui.js';
import {celebrate} from './celebrate.js';
import {printFOL,printBindings,parseInference} from '../logic/fol-inference.js';
import {startUnification,unificationStep,startSkolemization,skolemStep,UNIFICATION_LEVELS,SKOLEM_LEVELS} from '../logic/fol-practice.js';

export function mountFOLPractice(root){
  const unify=root.dataset.kind==='unify',levels=unify?UNIFICATION_LEVELS:SKOLEM_LEVELS,ui=folShell(root,levels,true);
  ui.board.setAttribute('aria-label',unify?'Unification equations':'Skolemization formula');
  let state,source='',history=[],selected=null,pendingRule=null;
  const drafts=new Map(),solved=new Set();
  const rules=unify?[
    ['delete','Delete identical pair','', 'trash','Delete'],
    ['occurs','Occurs-check failure','x ∈ t',null,'Occurs'],
    ['eliminate','Eliminate variable','x ↦ t',null,'Eliminate'],
    ['orient','Orient','⇄',null,'Orient'],
    ['clash','Symbol clash','f ≠ g',null,'Clash'],
    ['decompose','Decompose','', 'graph','Decompose'],
    ['finish','Declare success','','check','Done']
  ]:[
    ['arrow','Eliminate conditional','→',null,'Remove'],['iff','Eliminate biconditional','↔',null,'Remove'],
    ['de-morgan','De Morgan','¬(∧/∨)',null,'De Morgan'],['double-negation','Remove double negation','¬¬',null,'Remove'],
    ['negated-quantifier','Negated quantifier','¬∀/¬∃',null,'Push ¬'],['rename','Rename binder','α',null,'Rename'],
    ['skolem','Replace existential','∃ ↦ t',null,'Witness'],['finish','Finish Skolemization','','check','Done']
  ];
  const operationButtons=rules.map(([rule,label,glyph,icon,short])=>{
    const b=operationButton(root,rule,label,glyph,icon);b.append(el('span',{class:'finf-operation-label'},short));b.onclick=()=>ui.attempt(()=>operate(rule));ui.controls.append(b);return b;
  });
  const undo=iconButton(root,'undo','Undo'),restart=iconButton(root,'replay','Restart');ui.nav.append(undo,restart);
  const editor=el('form',{class:'finf-witness',hidden:''}),field=el('input',{type:'text',class:'nd-math',spellcheck:'false',autocomplete:'off'}),fieldLabel=el('label'),apply=iconButton(root,'check','Apply replacement','submit'),cancel=iconButton(root,'undo','Cancel replacement');
  enableLatexInput(field);
  fieldLabel.append(field);editor.append(fieldLabel,apply,cancel);ui.aside.insertBefore(editor,ui.status);
  function selection(){
    ui.board.querySelectorAll('[data-select]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.select===selected)));
    ui.board.querySelectorAll('[data-scope]').forEach(s=>s.classList.toggle('is-selected',s.dataset.scope===selected));
    operationButtons.forEach(b=>b.disabled=state.done||(b.dataset.operation!=='finish'&&selected===null));
  }
  function choose(key){selected=selected===key?null:key;pendingRule=null;editor.hidden=true;selection();}
  function formula(t,path=[]){
    const key=JSON.stringify(path),wrap=el('span',{class:'finf-subformula','data-scope':key});
    const compound=['connective','quantifier'].includes(t.kind);
    const b=el('button',{type:'button',class:'finf-token','data-select':key,'aria-label':'Select '+printFOL(t),'aria-pressed':'false'},compound?t.name+(t.variable||''):printFOL(t));
    b.disabled=state.done;b.onclick=()=>choose(key);
    if(t.kind==='quantifier'){wrap.append(b,' ',formula(t.children[0],[...path,0]));}
    else if(t.kind==='connective'&&t.children.length===2){wrap.append('(',formula(t.children[0],[...path,0]),' ',b,' ',formula(t.children[1],[...path,1]),')');}
    else if(t.name==='¬'){wrap.append(b,formula(t.children[0],[...path,0]));}
    else wrap.append(b);
    return wrap;
  }
  function render(){
    selected=null;pendingRule=null;editor.hidden=true;ui.board.replaceChildren();
    if(unify){
      const list=el('ol',{class:'finf-equations nd-math'});
      state.pending.forEach(([a,b],i)=>{const row=el('li'),choice=el('button',{type:'button','data-select':String(i),'aria-pressed':'false'},printFOL(a)+' ≐ '+printFOL(b));choice.disabled=state.done;choice.onclick=()=>choose(String(i));row.append(choice);list.append(row);});
      ui.board.append(list,el('p',{class:'nd-math'},'Substitution: '+printBindings(state.bindings)));
      if(!state.pending.length)ui.board.prepend(el('p',{},'No equations remain.'));
    }else{const line=el('div',{class:'finf-formula nd-math'});line.append(formula(state.tree));ui.board.append(line);}
    undo.disabled=!history.length;ui.status.textContent=state.message;selection();
    ui.buttons.forEach((b,i)=>{b.textContent=String(i+1)+(solved.has(levels[i][1])?' ✓':'');});
    drafts.set(source,{state,history:[...history]});
  }
  function accept(next,rule){
    history.push(state);state=next;
    if(state.done&&!solved.has(source)){solved.add(source);celebrate(root);}render();ui.board.focus({preventScroll:true});
  }
  function operate(rule){
    if(rule!=='finish'&&selected===null)throw Error(unify?'Select an equation.':'Select a connective or quantifier in the formula.');
    if(unify){const i=Number(selected),replacement=rule==='eliminate'?printFOL(state.pending[i][1]):'';accept(unificationStep(state,i,rule,replacement),rule);}
    else if(['rename','skolem'].includes(rule)){
      pendingRule=rule;const label=rule==='rename'?'Fresh variable':'Witness term';fieldLabel.replaceChildren(el('span',{},label),field);field.setAttribute('aria-label',label);field.value='';field.placeholder=rule==='rename'?'x1':'sk₁ or sk₁(x)';editor.hidden=false;field.focus();
      ui.status.textContent=rule==='rename'?'Enter a fresh variable for the selected binder.':'Enter the whole witness term, including its universal arguments. The highlighted scope is the part being rewritten.';
    }else accept(skolemStep(state,selected===null?[]:JSON.parse(selected),rule),rule);
  }
  editor.onsubmit=e=>{e.preventDefault();ui.attempt(()=>{
    let name=field.value.trim(),args='';
    if(pendingRule==='skolem'){const t=parseInference(name,'term');if(!['function','constant'].includes(t.kind))throw Error('Use a fresh constant or function term.');name=t.name;args=t.children.map(printFOL).join(',');}
    accept(skolemStep(state,JSON.parse(selected),pendingRule,name,args),pendingRule);
  });};
  cancel.onclick=()=>{editor.hidden=true;pendingRule=null;ui.status.textContent=state.message;};
  ui.run=(s,reset=false)=>{const saved=!reset&&drafts.get(s),next=saved?.state||(unify?startUnification(s):startSkolemization(s));source=s;state=next;history=saved?[...saved.history]:[];ui.applied(s);render();};
  undo.onclick=()=>{state=history.pop();render();};restart.onclick=()=>ui.attempt(()=>ui.run(source,true));if(root.dataset.tool==='true')ui.editing(false);else ui.attempt(()=>ui.run(root.dataset.formula||levels[0][1]));
}
const QUIZ=[
 {pair:'LiesBetween(Munich, y, z) and LiesBetween(x, Milan, Rome)',options:['[x/Munich, y/Milan, z/Rome]','[x/Milan, y/Munich, z/Rome]','No unifier: symbol clash'],answer:0,why:'The three argument positions require x = Munich, y = Milan and z = Rome.'},
 {pair:'SitsBetween(Mary, x, x) and SitsBetween(x, Jane, y)',options:['[x/Mary, y/Jane]','[x/Jane, y/Jane]','No unifier: distinct constants'],answer:2,why:'The first two positions would force the same variable to be both Mary and Jane. Substitution cannot change either constant.'},
 {pair:'Between(x, Rome, Rome) and ¬Between(Rome, y, x)',options:['[x/Rome, y/Rome]','No unifier: opposite signs','No unifier: occurs check'],answer:1,why:'Unification makes literals identical. A substitution cannot remove the negation. Resolution instead unifies the atoms of opposite-sign literals.'},
 {pair:'¬BornIn(fatherOf(motherOf(x)), London) and ¬BornIn(fatherOf(y), x)',options:['[x/London, y/motherOf(x)]','[x/London, y/motherOf(London)]','No unifier: different nesting'],answer:1,why:'Substitutions act simultaneously. Compose the binding for x into the replacement for y to obtain motherOf(London).'},
 {pair:'¬Human(x) and ¬Human(fatherOf(x))',options:['[x/fatherOf(x)]','No unifier: occurs check','No unifier: opposite signs'],answer:1,why:'A finite term cannot contain itself as a proper part.'},
 {pair:'Related(fatherOf(y), x) and Related(x, fatherOf(y))',options:['[x/fatherOf(a), y/a]','[x/fatherOf(y)]','No unifier: occurs check'],answer:1,why:'Both substitutions unify the atoms, but only [x/fatherOf(y)] is most general. The first unnecessarily fixes y to a.'}
];
export function mountUnificationQuiz(root){
  const mount=root.querySelector('[data-finf-mount]');
  const strip=el('div',{class:'builder__levels','data-levels':'',role:'group','aria-label':'Exercise levels'});
  const form=el('form',{class:'finf-quiz'}),fieldset=el('fieldset'),status=el('p',{'data-practice-feedback':'',role:'status'});
  const check=iconButton(root,'check','Check answer','submit');form.append(fieldset,check,status);mount.append(strip,form);
  let current,chosen=null;
  const progress=exerciseLevels(root,QUIZ,q=>{
    current=q;chosen=null;fieldset.replaceChildren(el('legend',{class:'nd-math'},q.pair));
    q.options.forEach((text,i)=>{
      const b=el('button',{type:'button',class:'finf-choice nd-math','data-answer':i,'aria-pressed':'false'},text);
      b.onclick=()=>{chosen=i;progress.clear();fieldset.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));};fieldset.append(b);
    });
  });
  form.onsubmit=e=>{e.preventDefault();progress.feedback(chosen===current.answer,chosen===null?'Choose an answer.':chosen===current.answer?'Correct. '+current.why:'Try again. Apply your substitution to both expressions and compare the results.');};
  progress.start();
}
