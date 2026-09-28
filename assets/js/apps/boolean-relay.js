import { circuitPreset, evaluateCircuit } from '../logic/boolean.js';
import { relayComponent } from './relay-component.js';
import { circuitWires } from './circuit-wires.js';
import { el, svg, lamp, inputSwitch, choices, formula } from './boolean-ui.js';
export function mountRelay(root) {
  const selectable=root.dataset.preset==='implementations';
  let kind=selectable?'not':root.dataset.preset, X=0,Y=1;
  const picture=root.querySelector('[data-picture]');
  if(selectable) choices(root.querySelector('[data-toolbar]'),[['not','NOT'],['and','AND'],['or','OR']],kind,id=>{kind=id;render();},'Truth-function');
  function render(focus) {
    const isOr=kind==='or',inverted=['not','relay-on'].includes(kind),variableSupply=['and','relay-off','relay-on'].includes(kind);
    const nodes=isOr?circuitPreset('or'):[],values=isOr?evaluateCircuit(nodes,{X,Y}):null;
    const closed=inverted?!X:!!X, output=isOr?values.get('out'):Number(closed&&(!variableSupply||Y));
    const canvas=svg('svg',{viewBox:isOr?'0 0 580 680':'0 0 480 430',role:'group','aria-label':isOr?'OR: NOT (NOT X AND NOT Y)':'Relay controlled by an electromagnet',class:'boolean-circuit'});
    const line=(d,v,extra='')=>canvas.append(svg('path',{d,class:`signal signal--${v} ${extra}`}));
    function coil(cx,cy,powered) {
      canvas.append(svg('rect',{x:cx-14,y:cy,width:28,height:90,class:'relay-coil'}));
      for(let y=cy+5;y<cy+85;y+=14)line(`M${cx-16},${y} C${cx+30},${y-4} ${cx+26},${y+17} ${cx-16},${y+12}`,powered);
      if(powered) for(let radius=35;radius<=75;radius+=20) canvas.append(svg('path',{d:`M${cx+18},${cy+45-radius} A${radius},${radius} 0 0 1 ${cx+18},${cy+45+radius}`,class:'magnetic-field'}));
    }
    function contact(x,y,isClosed,supply,opensLeft=false) {
      const tipX=isClosed?x:x+(opensLeft?-38:32);
      line(`M${x},${y+90} L${tipX},${y}`,supply,'relay-contact');
      canvas.append(svg('circle',{cx:x,cy:y+90,r:5}),svg('circle',{cx:x,cy:y,r:5}));
    }
    if(isOr) {
      canvas.append(circuitWires(nodes,values,'or'));
      for(const n of nodes) {
        const group=svg('g',{'data-node':n.id});
        if(n.type.startsWith('RELAY-'))group.append(relayComponent(n,values));
        else if(n.type==='INPUT')group.append(inputSwitch(n.x,n.y,n.id==='X'?X:Y,n.id,()=>{if(n.id==='X')X=1-X;else Y=1-Y;render(n.id);}));
        else if(n.type==='POWER')group.append(svg('text',{x:n.x,y:n.y+10,'text-anchor':'middle'},'POWER: 1'),svg('path',{d:`M${n.x},${n.y-25} V${n.y-5}`,class:'signal signal--1'}));
        else group.append(lamp(n.x,n.y,output,'output'),svg('path',{d:`M${n.x},${n.y+14} V${n.y+25}`,class:`signal signal--${output}`}));
        canvas.append(group);
      }
    } else {
      coil(165,140,X);line('M130,295 V260 H165 V230',X);
      line(variableSupply?'M300,295 V235':'M300,355 V235',variableSupply?Y:1);
      contact(300,145,closed,variableSupply?Y:1,inverted);
      line('M300,145 V74',output);canvas.append(lamp(300,60,output,'output'));
      canvas.append(inputSwitch(130,320,X,'X',()=>{X=1-X;render('X');}));
      if(variableSupply)canvas.append(inputSwitch(300,320,Y,'Y',()=>{Y=1-Y;render('Y');}));
      else canvas.append(svg('text',{x:300,y:390,'text-anchor':'middle'},'POWER: 1'));
      canvas.append(svg('text',{x:135,y:95,'text-anchor':'middle'},'magnet'),svg('text',{x:345,y:205},closed?'closed':'open'));
    }
    picture.replaceChildren(canvas);
    const message=isOr?'Two default-on relays negate X and Y. A default-off relay combines them with AND; the final default-on relay negates that result and supplies the single output.':`The magnet is ${X?'on':'off'}; the contact is ${closed?'closed':'open'}.${inverted&&X?' The magnet pulls the contact toward itself.':''}`;
    const calculation=isOr?`${X} OR ${Y} = ${output}`:variableSupply?`${inverted?`(NOT ${X})`:X} AND ${Y} = ${output}`:`NOT ${X} = ${output}`;
    root.querySelector('[role="status"]').replaceChildren(formula(calculation),el('p',{},message));
    root.querySelector('[data-text]').textContent=`X: ${X}${variableSupply||isOr?`; Y: ${Y}`:''}. Output: ${output}. ${message} The green supply below each manual switch stays powered.`;
    if(focus)root.querySelector(`[data-focus="switch-${focus}"]`)?.focus({preventScroll:true});
  }
  render();
}
