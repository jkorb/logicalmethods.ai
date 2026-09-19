import { svg } from './boolean-ui.js';
// Same coil, magnetic arcs and movable contact as the chapter's relay diagrams.
// Ports: lower left = magnet, lower right = supply, top = switched output.
export function relayComponent(node, values) {
  const {x,y}=node,group=svg('g',{'aria-hidden':'true'});
  const signal=input=>{
    const sources=Array.isArray(input)?input:[input],v=sources.map(id=>values.get(id));
    return v.includes(1)?1:v.length&&v.every(n=>n===0)?0:null;
  };
  const magnet=signal(node.inputs[0]),power=signal(node.inputs[1]),output=values.get(node.id);
  const closed=magnet===null?null:node.type==='RELAY-ON'?!magnet:!!magnet;
  const path=(d,value,extra='')=>group.append(svg('path',{d,class:`signal signal--${value??'unknown'} ${extra}`}));
  path(`M${x-35},${y+55} V${y+18}`,magnet);
  group.append(svg('rect',{x:x-45,y:y-24,width:20,height:42,class:'relay-coil'}));
  for(let cy=y-22;cy<y+12;cy+=8)path(`M${x-47},${cy} C${x-18},${cy-3} ${x-18},${cy+9} ${x-47},${cy+7}`,magnet);
  if(magnet===1)for(const r of [15,25,35])group.append(svg('path',{d:`M${x-23},${y-r} A${r},${r} 0 0 1 ${x-23},${y+r}`,class:'magnetic-field'}));
  path(`M${x+35},${y+55} V${y+25}`,power);
  const tip=closed?x+35:node.type==='RELAY-ON'?x+9:x+58;
  path(`M${x+35},${y+25} L${tip},${y-27}`,power,'relay-contact');
  path(`M${x+35},${y-27} V${y-42} H${x} V${y-55}`,output);
  for(const cy of [y+25,y-27])group.append(svg('circle',{cx:x+35,cy,r:4,class:'switch-contact'}));
  group.append(svg('text',{x:x-60,y:y-48,'font-size':14},node.type==='RELAY-ON'?'on':'off'));
  return group;
}
