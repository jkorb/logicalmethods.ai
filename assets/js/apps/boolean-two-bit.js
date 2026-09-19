import { columnAddition } from './column-addition.js';
import { rippleSum } from '../logic/boolean.js';
import { routedWires } from './circuit-wires.js';
import { el, svg, lamp, inputSwitch, formula } from './boolean-ui.js';
export function mountTwoBit(root) {
  const width=Number(root.dataset.bits||2),discover=width===2;
  let X=0,Y=0,decimal=false;
  const found=new Map(),picture=root.querySelector('[data-picture]'),below=root.querySelector('[data-below]');
  const bits=n=>n.toString(2).padStart(width,'0');
  function render(focus,record=false) {
    const result=rippleSum(X,Y,width);if(record)found.set(`${X},${Y}`,result.bits);
    const canvasWidth=width===2?600:780,centers=width===2?[140,440]:[130,370,610];
    const canvas=svg('svg',{viewBox:`0 0 ${canvasWidth} 505`,class:'boolean-circuit',role:'group','aria-label':`${width} full adders connected by carry wires`});
    const wires=[],values=new Map(),parts=[],switches=[];
    function wire(points,value,source) {values.set(source,value);wires.push({source,points});}
    for(let pos=0;pos<width;pos++) {
      const bit=width-1-pos,cx=centers[pos],stage=result.stages[bit];
      for(const [operand,val]of [['X',X],['Y',Y]]) {
        const x=width===2?(operand==='X'?90:390)+pos*80:(operand==='X'?80:490)+pos*65;
        const value=(val>>bit)&1,targetX=cx+(operand==='X'?-20:20),lane=330-(pos*2+(operand==='Y'?1:0))*15;
        wire([[x,365],[x,lane],[targetX,lane],[targetX,225]],value,`${operand}${bit}`);
        const label=`${operand}${'₀₁₂'[bit]}`;
        switches.push({x,node:inputSwitch(x,390,value,label,()=>{if(operand==='X')X^=1<<bit;else Y^=1<<bit;render(label);})});
      }
      const g=svg('g');g.append(svg('rect',{x:cx-65,y:155,width:130,height:70,rx:8,class:'gate-box'}),svg('text',{x:cx,y:182,'text-anchor':'middle'},'full'),svg('text',{x:cx,y:207,'text-anchor':'middle'},'adder'));
      for(const px of [cx-20,cx+20,cx+50])g.append(svg('circle',{cx:px,cy:225,r:4,class:'gate-pin'}));
      g.append(svg('circle',{cx:cx-65,cy:175,r:4,class:'gate-pin'}),svg('circle',{cx,cy:155,r:4,class:'gate-pin'}));parts.push(g);
      wire([[cx,155],[cx,89]],stage.sum,`S${bit}`);parts.push(lamp(cx,75,stage.sum,`bit ${bit}`));
      if(pos) {
        const previous=centers[pos-1],bend=(cx+previous)/2;
        wire([[cx-65,175],[bend,175],[bend,240],[previous+50,240],[previous+50,225]],stage.carry,`C${bit+1}`);
      } else {wire([[cx-65,175],[40,175],[40,89]],stage.carry,'final');parts.push(lamp(40,75,stage.carry,'carry'));}
    }
    const last=centers.at(-1);
    wire([[canvasWidth-35,310],[canvasWidth-35,235],[last+50,235],[last+50,225]],0,'zero');parts.push(svg('text',{x:canvasWidth-35,y:340,'text-anchor':'middle'},'0'));
    parts.push(svg('text',{x:width===2?130:145,y:490,'text-anchor':'middle'},`X: ${bits(X)}`),svg('text',{x:width===2?430:555,y:490,'text-anchor':'middle'},`Y: ${bits(Y)}`));
    canvas.append(routedWires(wires,values),...parts,...switches.sort((a,b)=>a.x-b.x).map(s=>s.node));picture.replaceChildren(canvas);
    root.querySelector('[role="status"]').replaceChildren(formula(`${bits(X)} + ${bits(Y)} = ${result.bits}`),el('p',{},`${X} + ${Y} = ${X+Y} in decimal. Each carry goes to the next column on the left.`));
    const inspector=root.querySelector('[data-inspector]');inspector.replaceChildren();
    if(discover){const recordButton=el('button',{type:'button','data-record':''},'Record this sum');recordButton.addEventListener('click',()=>{render(null,true);root.querySelector('[data-record]').focus({preventScroll:true});});inspector.append(recordButton);}
    below.replaceChildren();
    const arithmetic=columnAddition({top:bits(X),bottom:bits(Y),result:result.bits,carries:result.stages.map(s=>s.carry?'1':' ').reverse().join('')+' '});
    if(discover) {
      const results=el('div',{class:'boolean-two-bit__results'}),sums=el('div'),controls=el('div',{class:'boolean-two-bit__table-controls'});
      const toggle=el('button',{type:'button','aria-pressed':String(decimal)},'Decimal table');
      toggle.addEventListener('click',()=>{decimal=!decimal;render();root.querySelector('.boolean-two-bit__table-controls button').focus({preventScroll:true});});
      controls.append(toggle);sums.append(controls);
      const wrap=el('div',{class:'function-table',role:'region','aria-label':`Discovered two-bit sums, in ${decimal?'decimal':'binary'}`,tabindex:0}),table=el('table'),head=el('thead'),headrow=el('tr');
      const inputLabel=n=>decimal?String(n):bits(n);
      headrow.append(el('th',{scope:'col',class:'function-table__name'},'+'));for(let y=0;y<4;y++)headrow.append(el('th',{scope:'col'},inputLabel(y)));head.append(headrow);table.append(head);
      const body=el('tbody');for(let x=0;x<4;x++){const row=el('tr');row.append(el('th',{scope:'row'},inputLabel(x)));for(let y=0;y<4;y++){
        const known=found.get(`${x},${y}`);row.append(el('td',{'data-sum-cell':`${x},${y}`,class:x===X&&y===Y?'is-current':''},known?(decimal?String(parseInt(known,2)):known):'·'));
      }body.append(row);}table.append(body);wrap.append(table);sums.append(wrap,el('p',{'data-discovered':''},`${found.size} / 16 sums found.`));results.append(arithmetic,sums);below.append(results);
    } else below.append(arithmetic);
    root.querySelector('[data-text]').textContent=`X: ${bits(X)}, Y: ${bits(Y)}. ${result.stages.map((s,i)=>`Column ${i}: sum ${s.sum}, incoming carry ${s.incoming}, outgoing carry ${s.carry}.`).join(' ')} Result: ${result.bits}.`;
    if(focus)root.querySelector(`[data-focus="switch-${focus}"]`)?.focus({preventScroll:true});
  }
  render();
}
