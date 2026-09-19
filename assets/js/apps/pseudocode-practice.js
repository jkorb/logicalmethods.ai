import { el, choices } from './boolean-ui.js';
import { celebrate } from './celebrate.js';
export function mountPseudocode(root) {
  const levels=JSON.parse(root.querySelector('[data-levels]').textContent),saved=levels.map(()=>[]),done=new Set();
  const code=root.querySelector('[data-code]'),status=root.querySelector('[role="status"]'),check=root.querySelector('[type="submit"]');
  let current=0;
  check.disabled=false;
  function picker(){choices(root.querySelector('[data-level-picker]'),levels.map((l,i)=>[i,`${i+1}. ${l.title}${done.has(i)?' ✓':''}`]),current,i=>{current=i;render();},'Pseudocode example');}
  function render(){
    picker();code.replaceChildren();status.textContent='';delete status.dataset.feedback;
    const level=levels[current];root.querySelector('[data-prompt]').textContent=level.prompt;
    level.code.split('___').forEach((part,i)=>{
      if(i){const input=el('input',{type:'text','aria-label':`Missing keyword ${i}`,autocomplete:'off',autocapitalize:'off',spellcheck:'false',maxlength:12,size:6});input.value=saved[current][i-1]||'';
        input.addEventListener('input',()=>{saved[current][i-1]=input.value;input.removeAttribute('aria-invalid');status.textContent='';delete status.dataset.feedback;});code.append(input);}
      code.append(document.createTextNode(part));
    });
  }
  root.querySelector('form').addEventListener('submit',event=>{
    event.preventDefault();const inputs=[...code.querySelectorAll('input')];
    const wrong=inputs.filter((input,i)=>{const bad=input.value.trim()!==levels[current].answers[i];input.setAttribute('aria-invalid',String(bad));return bad;});
    status.dataset.feedback=wrong.length?'incorrect':'correct';
    status.textContent=wrong.length?'Not quite. Check the marked gaps and try again.':`Correct. ${levels[current].explanation}`;
    if(wrong.length){wrong[0].focus({preventScroll:true});code.classList.remove('is-shaking');void code.offsetWidth;code.classList.add('is-shaking');}
    else {done.add(current);picker();celebrate(check);}
  });
  render();
}
