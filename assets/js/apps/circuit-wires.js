import { OPERATIONS } from '../logic/boolean.js';
import { svg } from './boolean-ui.js';
// Fixed examples route fan-out below the receiving gates. A crossing without
// a connection gets a small bridge; dots mark same-signal branch points.
export function portPosition(node, input) {
  const relay=node.type.startsWith('RELAY-'),offset=relay?55:node.outputOffset||25;
  return input===undefined ? [node.x,node.y-offset] : [node.x+(OPERATIONS[node.type]?.arity===2?(input?1:-1)*(relay?35:20):0),node.y+offset];
}
export function circuitWires(nodes, values, preset) {
  const routes = preset === 'full' ? {
    'xor1:0': [[80,415],[80,385],[140,385],[140,350]],
    'xor1:1': [[250,415],[250,370],[180,370],[180,350]],
    'and1:0': [[80,415],[80,398],[350,398],[350,350]],
    'and1:1': [[250,415],[250,370],[390,370],[390,350]],
    'xor2:0': [[160,300],[160,260],[90,260],[90,220]],
    'xor2:1': [[500,415],[500,245],[130,245],[130,220]],
    'and2:0': [[160,300],[160,260],[280,260],[280,220]],
    'and2:1': [[500,415],[500,245],[320,245],[320,220]],
    'or:0': [[370,300],[370,145],[400,145],[400,120]],
    'or:1': [[300,170],[300,145],[440,145],[440,120]]
  } : preset === 'half' ? {
    'xor:0': [[100,385],[100,300],[80,300],[80,250]],
    'xor:1': [[270,385],[270,280],[120,280],[120,250]],
    'and:0': [[100,385],[100,320],[320,320],[320,250]],
    'and:1': [[270,385],[270,280],[360,280],[360,250]]
  } : {};
  const wires=[];
  for(const n of nodes) (n.inputs||[]).forEach((input,i)=>{for(const source of (Array.isArray(input)?input:[input])) {
    const from=nodes.find(n=>n.id===source);if(!from)continue;
    const [x,y]=portPosition(n,i),[sx,start]=portPosition(from),lane=start+(y-start)*(i?.62:.42);
    wires.push({source,target:n.id,port:i,points:routes[`${n.id}:${i}`]||[[sx,start],[sx,lane],[x,lane],[x,y]]});
  }});
  return routedWires(wires, values);
}
export function routedWires(wires, values) {
  const group=svg('g',{class:'circuit-wires','aria-hidden':'true'});
  for(const wire of wires) {
    let d=`M${wire.points[0].join(',')}`;
    for(let i=1;i<wire.points.length;i++) {
      const [x,y]=wire.points[i],[px,py]=wire.points[i-1];
      if(y===py&&x!==px) {
        const crossings=new Set();
        for(const other of wires) if(other.source!==wire.source) for(let k=1;k<other.points.length;k++) {
          const [ax,ay]=other.points[k-1],[bx,by]=other.points[k];
          if(ax===bx&&ax>Math.min(x,px)+7&&ax<Math.max(x,px)-7&&y>Math.min(ay,by)+4&&y<Math.max(ay,by)-4)crossings.add(ax);
        }
        const dir=x>px?1:-1;
        for(const cx of [...crossings].sort((a,b)=>(a-b)*dir))d+=` L${cx-6*dir},${y} Q${cx},${y-10} ${cx+6*dir},${y}`;
      }
      d+=` L${x},${y}`;
    }
    group.append(svg('path',{d,class:`signal signal--${values.get(wire.source)??'unknown'}`,'data-source':wire.source,'data-target':wire.target,'data-port':wire.port}));
  }
  // Sources already join at their output dot; route junctions get their own dot.
  const drawn=new Set();
  for(const w of wires)for(const [x,y] of w.points.slice(1,-1))for(const o of wires)if(o!==w&&o.source===w.source)for(let k=1;k<o.points.length;k++) {
    const [a,b]=o.points[k-1],[c,d]=o.points[k];
    if(((a===c&&x===a&&y>=Math.min(b,d)&&y<=Math.max(b,d))||(b===d&&y===b&&x>=Math.min(a,c)&&x<=Math.max(a,c)))&&!drawn.has(`${x},${y}`)) {
      group.append(svg('circle',{cx:x,cy:y,r:3,class:'wire-junction'}));drawn.add(`${x},${y}`);
    }
  }
  return group;
}
