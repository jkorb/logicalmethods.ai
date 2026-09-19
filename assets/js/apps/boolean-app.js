import { parseBoolean, evaluateTrace, printFormula } from '../logic/boolean.js';
import { enableLatexInput, convertInput } from './latex-input.js';
import { el, navigation, formula, choices } from './boolean-ui.js';
import { renderTree } from './tree-renderer.js';
import { mountCircuit } from './boolean-circuit.js';
import { mountModels } from './boolean-models.js';
import { mountTwoBit } from './boolean-two-bit.js';
export function mountBoolean(root) {
  root.querySelectorAll('button, input').forEach(n => { n.disabled = false; });
  const textToggle = root.querySelector('[data-text-toggle]');
  textToggle.addEventListener('click', () => {
    const show = root.querySelector('[data-text]').hidden;
    root.querySelector('[data-text]').hidden = !show;
    textToggle.setAttribute('aria-expanded', String(show));
    textToggle.setAttribute('aria-label', show ? 'Hide text alternative' : 'Show text alternative');
    textToggle.title = textToggle.getAttribute('aria-label');
  });
  const motion = root.querySelector('[data-motion]');
  if (motion) {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const paused = preference.matches || root.dataset.paused === 'true';
      root.dataset.paused = String(paused);
      motion.disabled = preference.matches;
      motion.setAttribute('aria-pressed', String(paused));
      motion.setAttribute('aria-label', preference.matches ? 'Animation off: reduced motion' : paused ? 'Play animation' : 'Pause animation');
      motion.title = preference.matches ? 'Your system requests reduced motion.' : motion.getAttribute('aria-label');
      motion.querySelector('[data-motion-label]').textContent = preference.matches ? 'Motion off' : paused ? 'Play' : 'Pause';
      motion.querySelector('[data-motion-play]').hidden = !paused;
      motion.querySelector('[data-motion-pause]').hidden = paused;
    };
    motion.addEventListener('click', () => { root.dataset.paused = String(root.dataset.paused !== 'true'); update(); });
    preference.addEventListener('change', update);
    update();
  }

  if (['circuit', 'workbench'].includes(root.dataset.kind)) return mountCircuit(root);
  if (['two-bit','ripple-adder'].includes(root.dataset.kind)) return mountTwoBit(root);
  if (['models', 'model-exercise'].includes(root.dataset.kind)) return mountModels(root);
  if (root.dataset.kind === 'derivation') {
    const steps = JSON.parse(root.querySelector('[data-derivation]').textContent);
    root.querySelector('[data-toolbar]').append(root.querySelector('[data-navigation]'));
    root.querySelector('[data-text]').append(...steps.map(([f, why], i) => el('p', {}, `${i+1}. ${f}. ${why}`)));
    navigation(root, steps.length, i => {
      const list = el('ol', { class: 'boolean-derivation' });
      steps.slice(0, i+1).forEach(([f, why], j) => {
        const row = el('li', { class: j === i ? 'is-current' : '', ...(j === i ? {'aria-current':'step'} : {}) });
        row.append(formula(f), el('span', { class: 'boolean-derivation__reason' }, why)); list.append(row);
      });
      root.querySelector('[data-picture]').replaceChildren(list);
      root.querySelector('[role="status"]').textContent = `Line ${i+1}: ${steps[i][1]}`;
      root.querySelector('[role="status"]').classList.add('visually-hidden');
    });
    return;
  }
  mountEvaluation(root);
}
function mountEvaluation(root) {
  const input = root.querySelector('[data-formula]');
  const status = root.querySelector('[role="status"]');
  const picture = root.querySelector('[data-picture]');
  picture.tabIndex = 0; picture.setAttribute('role','region'); picture.setAttribute('aria-label','Evaluation tree');
  let parsed;
  const valuation = {};
  function evaluate() {
    const steps = evaluateTrace(parsed.tree, valuation);
    navigation(root, steps.length + 1, index => {
      const step = steps[index-1], known = new Map(steps.slice(0,index).map(s => [s.id,s.value]));
      status.replaceChildren();
      if (step) {
        status.append(formula(`v(${step.formula}) = ${step.value}`), el('p', {}, step.formula === parsed.tree.label ? 'Read the assigned value.' : !findNode(parsed.tree, step.id).children.length ? 'Read this leaf’s assigned value.' : 'Apply the truth-function to the values below.'), formula(step.calculation));
      } else status.append(el('p', {}, 'First the structure, then the values. Start at the leaves and work upward.'));
      const annotation = n => known.has(n.id) ? `v(${n.children.length ? '…' : n.label})=${known.get(n.id)}` : '';
      picture.replaceChildren(renderTree(parsed.tree, { active: step?.id, annotation, compact: true }));
      function describe(n) {
        const li=el('li',{},`v(${printFormula(n)}) ${known.has(n.id)?`= ${known.get(n.id)}`:'not yet calculated'}`);
        if(n.children.length) {const ul=el('ul'); n.children.forEach(c=>ul.append(describe(c)));li.append(ul);}return li;
      }
      const list=el('ul');list.append(describe(parsed.tree));root.querySelector('[data-text]').replaceChildren(list);
    });
  }
  function start() {
    try {
      convertInput(input);parsed=parseBoolean(input.value);
      const fields=root.querySelector('[data-valuation]');fields.replaceChildren();
      for(const name of parsed.names) {
        valuation[name] ??= 0;
        const group=el('div'),label=el('span',{class:'boolean-app__formula'},`v(${name}) =`),buttons=el('span');
        choices(buttons,[[0,'0'],[1,'1']],valuation[name],v=>{valuation[name]=v;evaluate();},`Value of ${name}`);
        group.append(label,buttons);fields.append(group);
      }
      evaluate();
    } catch(e) {picture.replaceChildren();root.querySelector('[data-text]').replaceChildren();status.textContent=e.message;root.querySelectorAll('[data-action]').forEach(b=>{b.disabled=true;});}
  }
  function dirty() {
    root.querySelectorAll('[data-action]').forEach(b=>{b.disabled=true;});picture.replaceChildren();root.querySelector('[data-text]').replaceChildren();root.querySelector('[data-valuation]').replaceChildren();status.textContent='Use the play button to parse the edited formula.';
  }
  enableLatexInput(input,dirty);root.querySelector('form').addEventListener('submit',e=>{e.preventDefault();start();});
  const bank=root.querySelector('[data-evaluation-examples]');
  if(bank){
    const examples=JSON.parse(bank.textContent);let custom='',selected=0;
    choices(root.querySelector('[data-toolbar]'),[...examples.map((e,i)=>[i,`Example ${i+1}`]),['custom','Your formula']],0,i=>{
      if(selected==='custom')custom=input.value;selected=i;
      input.readOnly=i!=='custom';
      if(i==='custom'){input.value=custom;dirty();input.focus({preventScroll:true});if(custom)start();}
      else {input.value=examples[i].formula;Object.assign(valuation,examples[i].valuation);start();}
    },'Evaluation example');
    input.value=examples[0].formula;input.readOnly=true;Object.assign(valuation,examples[0].valuation);
  }
  start();
}
function findNode(node,id) {return node.id===id ? node : node.children.map(c=>findNode(c,id)).find(Boolean);}
