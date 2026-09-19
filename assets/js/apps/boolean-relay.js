import { el, svg, lamp, inputSwitch, choices, formula } from './boolean-ui.js';
export function mountRelay(root) {
  const selectable=root.dataset.preset==='implementations';
  let kind=selectable?'not':root.dataset.preset, X=0,Y=1;
  const picture=root.querySelector('[data-picture]');
  if(selectable) choices(root.querySelector('[data-toolbar]'),[['not','NOT'],['and','AND'],['or','OR']],kind,id=>{kind=id;render();},'Truth-function');
  function render(focus) {
    const parallel=kind==='or',inverted=['not','relay-on'].includes(kind),variableSupply=['and','relay-off','relay-on'].includes(kind);
    const closed=inverted?!X:!!X, output=parallel?X|Y:Number(closed&&(!variableSupply||Y));
    const canvas=svg('svg',{viewBox:parallel?'0 0 580 470':'0 0 480 430',role:'group','aria-label':parallel?'OR: two normally open relays in parallel':'Relay controlled by an electromagnet',class:'boolean-circuit'});
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
    if(parallel) {
      coil(105,160,X);coil(360,160,Y);
      line('M105,295 V250',X);line('M360,295 V250',Y);
      contact(210,155,Boolean(X),1);contact(465,155,Boolean(Y),1);
      line('M285,354 V280 H210 V245',1,'relay-power');
      line('M285,280 H352 A8,8 0 0 1 368,280 H465 V245',1,'relay-power');
      canvas.append(svg('circle',{cx:285,cy:280,r:3,class:'wire-junction'}));
      line('M210,155 V105 H300 V74',output);line('M465,155 V105 H300 V74',output);
      line('M300,105 V74',output);
      canvas.append(lamp(300,60,output,'output'),inputSwitch(105,320,X,'X',()=>{X=1-X;render('X');}),inputSwitch(360,320,Y,'Y',()=>{Y=1-Y;render('Y');}),svg('text',{x:270,y:381,'text-anchor':'middle'},'POWER: 1'));
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
    const message=parallel?'Either relay can connect POWER to the output. The lamp stays on when both contacts are closed.':`The magnet is ${X?'on':'off'}; the contact is ${closed?'closed':'open'}.${inverted&&X?' The magnet pulls the contact toward itself.':''}`;
    const calculation=parallel?`${X} OR ${Y} = ${output}`:variableSupply?`${inverted?`(NOT ${X})`:X} AND ${Y} = ${output}`:`NOT ${X} = ${output}`;
    root.querySelector('[role="status"]').replaceChildren(formula(calculation),el('p',{},message));
    root.querySelector('[data-text]').textContent=`X: ${X}${variableSupply||parallel?`; Y: ${Y}`:''}. Output: ${output}. ${message} The green supply below each manual switch stays powered.`;
    if(focus)root.querySelector(`[data-focus="switch-${focus}"]`)?.focus({preventScroll:true});
  }
  render();
}
