import {el} from './boolean-ui.js';
import {diceRows,weatherRows,formatNumber as fmt} from '../logic/probability.js';

export function table(headers,label){const t=el('table',{class:'prob-table','aria-label':label}),head=el('thead'),tr=el('tr'),body=el('tbody');headers.forEach(h=>tr.append(el('th',{scope:'col'},h)));head.append(tr);t.append(head,body);return {table:t,body};}
export function modelIcon(root,rows,i){
 const wrap=el('span',{class:'prob-model-icon','aria-hidden':'true'});
 if(rows===diceRows){wrap.append(root.querySelector(`[data-outcome="${i+1}"]`).content.cloneNode(true));return wrap;}
 if(rows!==weatherRows&&rows.length!==8){wrap.textContent=`M${'₁₂₃₄'[i]}`;return wrap;}
 const art=root.querySelector('[data-world-space]').content.cloneNode(true),canvas=art.querySelector('svg');
 const cells=rows.length===8?['102 75 420 420','655 75 420 420','1210 75 420 420','1765 75 420 420','102 511 420 420','655 511 420 420','1210 511 420 420','1765 511 420 420']:['105 70 280 270','505 60 280 270','90 385 280 270','495 390 280 270'];canvas.setAttribute('viewBox',cells[i]);canvas.removeAttribute('id');canvas.removeAttribute('aria-labelledby');canvas.querySelector('g')?.remove();wrap.append(art);return wrap;
}

export function fraction(top,bottom){const f=el('span',{class:'math-frac',role:'math','aria-label':`${top} divided by ${bottom}`});for(const [part,cls]of [[top,'math-frac__top'],[bottom,'math-frac__bottom']]){const span=el('span',{class:cls});span.append(/^-?\d+\/\d+$/.test(part)?fraction(...part.split('/')):part);f.append(span);}return f;}
export function number(n){const parts=fmt(n).split('/');return parts.length===2?fraction(...parts):document.createTextNode(fmt(n));}
