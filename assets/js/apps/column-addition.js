import { el } from './boolean-ui.js';
// Presentation only: callers supply the digits and incoming carries.
export function columnAddition({top, bottom, result, carries}) {
  const width=result.length;
  const figure=el('div',{class:'column-addition',role:'region','aria-label':`${top} plus ${bottom} equals ${result}, in binary`});
  const table=el('table'),body=el('tbody');
  const rows=[['',top,''],['+',bottom,''],['=',result,'column-addition__result']];
  for(const [label,digits,style] of rows) {
    const row=el('tr',{class:style});
    const heading=el('th',{scope:'row'},label);
    if(!label) heading.append(el('span',{class:'visually-hidden'},'First summand'));
    row.append(heading);
    [...digits.padStart(width,' ')].forEach((digit,i)=>{
      const cell=el('td'),glyph=el('span',{class:'column-addition__digit'},digit===' '? '\u00a0':digit);cell.append(glyph);
      if(label==='+' && carries.padStart(width,' ')[i]==='1')glyph.append(el('sub',{class:'column-addition__carry','aria-label':'carry 1'},'1'));
      row.append(cell);
    });
    body.append(row);
  }
  table.append(body);figure.append(table);return figure;
}
