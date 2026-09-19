import { el, choices, formula } from './boolean-ui.js';
export function mountRGB(root) {
  const values={RED:0,GREEN:0,BLUE:0},found=new Map();
  const names=['black','blue','green','cyan','red','magenta','yellow','white'];
  const picture=root.querySelector('[data-picture]'),inspector=root.querySelector('[data-inspector]');
  for(const key of Object.keys(values)){const group=el('div'),buttons=el('span');group.append(formula(`v(${key}) = `),buttons);choices(buttons,[[0,'0'],[1,'1']],0,n=>{values[key]=n;render();},`Value of ${key}`);inspector.append(group);}
  const record=el('button',{type:'button'},'Record this valuation');record.addEventListener('click',()=>{const key=values.RED*4+values.GREEN*2+values.BLUE;found.set(key,{...values});render();});inspector.append(record);
  function render(){
    const key=values.RED*4+values.GREEN*2+values.BLUE,swatch=el('div',{class:'boolean-rgb__swatch',role:'img','aria-label':`${names[key]} pixel`});swatch.style.backgroundColor=`rgb(${values.RED*255} ${values.GREEN*255} ${values.BLUE*255})`;
    picture.replaceChildren(swatch,formula(names[key]));
    root.querySelector('[role="status"]').textContent=`${found.size} of 8 valuations recorded.`;
    const table=el('table'),head=el('tr');for(const key of ['Color','v(RED)','v(GREEN)','v(BLUE)'])head.append(el('th',{scope:'col'},key));const thead=el('thead');thead.append(head);table.append(thead);
    const body=el('tbody');for(const [key,v]of [...found].sort((a,b)=>b[0]-a[0])){const row=el('tr');row.append(el('th',{scope:'row'},names[key]));for(const n of Object.values(v))row.append(el('td',{},String(n)));body.append(row);}table.append(body);root.querySelector('[data-below]').replaceChildren(table);
    root.querySelector('[data-text]').textContent=`${Object.entries(values).map(([name,n])=>`v(${name}) = ${n}`).join(', ')}. The pixel is ${names[key]}.`;
  }
  render();
}
