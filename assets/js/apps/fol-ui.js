// Shared notebook furniture; demonstrations and exercises supply their own controls.
import {el,iconButton} from './boolean-ui.js';
import {enableLatexInput} from './latex-input.js';
export function folShell(root,levels,practice=false){
  if(root.dataset.tool==='true')levels=[];
  const mount=root.querySelector('[data-finf-mount]');
  const picker=el('div',{class:'sat-examples',role:'group','aria-label':practice?'Levels':'Examples'});
  picker.append(el('span',{},practice?'Level':'Ex.'));picker.hidden=root.dataset.tool==='true';
  const paired=root.dataset.kind==='unify'&&(!practice||root.dataset.tool==='true');
  const caption=el('p',{class:'sat-example-description'}),form=el('form',{'data-input-form':'',class:paired?'finf-pair-form':''});
  const input=el('textarea',{'aria-label':'First-order input',class:'logic-app__input',rows:'1',maxlength:'4608',spellcheck:'false'});
  const start=paired?el('button',{type:'submit','aria-label':'Check unifiability',title:'Check unifiability',class:'finf-question'},'?'):iconButton(root,'play','Use input','submit'),edit=iconButton(root,'edit','Edit input');
  const wrap=el('div',{class:'logic-app__input-wrap'});edit.classList.add('logic-app__edit');wrap.append(input,edit);
  const second=paired?el('textarea',{'aria-label':'Second expression',class:'logic-app__input',rows:'1',maxlength:'512',spellcheck:'false','data-submit-enter':''}):null;
  let secondEdit;
  if(paired){input.setAttribute('aria-label','First expression');input.setAttribute('data-submit-enter','');}
  const nav=el('div',{class:'nd-navigation','data-navigation':''});
  const board=el('div',{class:'nd-board sat-work','data-work':'',role:'region','aria-label':'First-order calculation',tabindex:'0'});
  const status=el('div',{role:'status',class:'nd-status'}),aside=el('div',{class:'sat-aside'}),layout=el('div',{class:'sat-layout'});
  const controls=el('div',{class:'finf-operations',role:'group','aria-label':'Operations'}),extra=el('div');
  aside.append(controls,status);layout.append(board,aside);form.append(wrap,start);
  if(paired){const other=el('div',{class:'logic-app__input-wrap'});secondEdit=iconButton(root,'edit','Edit second expression');secondEdit.classList.add('logic-app__edit');other.append(second,secondEdit);form.append(other);mount.append(picker,form,nav,layout,extra);}
  else {form.append(nav);mount.append(picker,form,layout,extra);}
  const buttons=levels.map(([name,source],i)=>{const b=el('button',{type:'button','aria-label':name,title:name,'aria-pressed':'false'},practice?String(i+1):name);b.onclick=()=>attempt(()=>api.run(source));picker.append(b);return b;});
  function attempt(fn){try{fn();}catch(e){status.textContent=e.message;layout.hidden=false;}}
  function applied(source){if(paired){[input.value,second.value]=source.split(';').map(s=>s.trim());second.readOnly=true;secondEdit.hidden=false;}else input.value=source;input.readOnly=true;start.hidden=!paired;start.disabled=paired;edit.hidden=false;layout.hidden=false;controls.hidden=false;nav.hidden=false;extra.hidden=false;buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(levels[i][1]===source)));}
  function editing(focus=true){if(paired){second.readOnly=false;secondEdit.hidden=true;}input.readOnly=false;start.hidden=false;start.disabled=false;edit.hidden=true;layout.hidden=true;board.replaceChildren();controls.hidden=true;nav.hidden=true;extra.hidden=true;if(focus)input.focus();}
  edit.onclick=editing;if(secondEdit)secondEdit.onclick=()=>{editing();second.focus();};form.onsubmit=e=>{e.preventDefault();attempt(()=>api.run(paired?input.value+'; '+second.value:input.value));};enableLatexInput(input);if(second)enableLatexInput(second);
  const api={root,mount,picker,caption,form,input,nav,board,status,aside,controls,extra,attempt,applied,buttons,editing,run:null};return api;
}
export function traceControls(ui){
  ui.nav.replaceChildren();
  for(const [action,label] of [['first','First step'],['previous','Previous step'],['next','Next step'],['last','Last step']]){
    const b=iconButton(ui.root,action,label);b.dataset.action=action;ui.nav.append(b);
    if(action==='previous')ui.nav.append(el('span',{'data-count':'',class:'finf-count'}));
  }
}
export function operationButton(root,rule,label,glyph,icon){
  const b=icon?iconButton(root,icon,label):el('button',{type:'button','aria-label':label,title:label},glyph);
  b.dataset.operation=rule;return b;
}
