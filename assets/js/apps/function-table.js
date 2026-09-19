import { el } from './boolean-ui.js';
export function functionTable({name,rows,columns,values,incorrect=()=>false}) {
  const wrap=el('div',{class:'function-table',role:'region','aria-label':`${name} function table`,tabindex:0}),table=el('table'),head=el('thead'),tr=el('tr');
  tr.append(el('th',{scope:'col',class:'function-table__name'},name));columns.forEach(c=>tr.append(el('th',{scope:'col'},String(c))));head.append(tr);table.append(head);
  const body=el('tbody');rows.forEach((r,i)=>{const line=el('tr');line.append(el('th',{scope:'row'},String(r)));values[i].forEach((v,j)=>{const cell=el('td',{class:incorrect(i,j)?'is-incorrect':''},v===null?'?':String(v));if(incorrect(i,j))cell.append(el('span',{class:'visually-hidden'},' – incorrect'));line.append(cell);});body.append(line);});table.append(body);wrap.append(table);return wrap;
}
