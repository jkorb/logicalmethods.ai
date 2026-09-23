import { celebrate } from './celebrate.js';
import { functionTable } from './function-table.js';
import { relayComponent } from './relay-component.js';
import { circuitWires, portPosition } from './circuit-wires.js';
import { mountRelay } from './boolean-relay.js';
import { circuitPreset, evaluateCircuit, OPERATIONS, CIRCUIT_TASKS, checkCircuit, circuitTable } from '../logic/boolean.js';
import { el, svg, activate, lamp, inputSwitch, choices, formula } from './boolean-ui.js';
export function mountCircuit(root) {
  if (['relay-off', 'relay-on', 'not', 'and', 'or', 'implementations'].includes(root.dataset.preset)) return mountRelay(root);
  const editable = root.dataset.kind === 'workbench',sandbox=editable&&root.dataset.preset==='sandbox';
  // The sandbox offers relays too, so it needs their supply node and parallel inputs.
  const relayWorkbench=editable&&['relays','sandbox'].includes(root.dataset.preset);
  const picture = root.querySelector('[data-picture]');
  const status = root.querySelector('[role="status"]');
  const inspector = root.querySelector('[data-inspector]');
  const profileNode=root.querySelector('[data-circuit-tasks]');
  const profile=profileNode?JSON.parse(profileNode.textContent):{progressive:true,gates:['NOT','AND','OR'],tasks:CIRCUIT_TASKS.map(target=>({target}))};
  const tasks=profile.tasks;let taskIndex=0;
  const solved=new Set(),earned=new Set(profile.gates||[]),savedTasks=new Map();
  const current=()=>tasks[taskIndex];
  const palette=()=>[...root.querySelectorAll('[data-add]')].map(b=>b.dataset.add);
  const allowed=()=>sandbox?new Set(palette()):new Set(profile.progressive?[...earned]:current().gates||profile.gates);
  const fresh=()=>{const initial=circuitPreset(editable?'':root.dataset.preset);const labels=(root.dataset.inputLabels||'').split(',');if(root.dataset.inputLabels)initial.filter(n=>n.type==='INPUT').forEach((n,i)=>{n.label=labels[i]||n.label;});if(editable)for(const n of initial)if(n.type==='INPUT')n.outputOffset=80;if(relayWorkbench)initial.push({id:'POWER',type:'POWER',label:'power',x:450,y:410,inputs:[]});return initial.filter(n=>!editable||sandbox||OPERATIONS[current().target].arity!==1||n.id!=='Y');};
  let nodes=fresh(),selected=null,selectedPort=null,source=null,nextId=1;
  if (!editable && root.dataset.examples === 'inputs') {
    const group=el('div',{class:'boolean-choices',role:'group','aria-label':'Input examples'});
    for (const [x,y] of [[0,0],[0,1],[1,0],[1,1]]) {
      const button=el('button',{type:'button'},x+' , '+y);
      button.addEventListener('click',()=>{nodes.find(n=>n.id==='X').value=x;nodes.find(n=>n.id==='Y').value=y;render();});
      group.append(button);
    }
    root.querySelector('[data-toolbar]').before(group);
  }
  function taskControls() {
    if(!editable)return;
    if(sandbox){root.querySelectorAll('[data-add]').forEach(b=>{b.disabled=false;});return;}
    const toolbar=root.querySelector('[data-toolbar]');toolbar.replaceChildren();
    const group=el('div');toolbar.append(group);
    choices(group,tasks.map((task,i)=>[i,`${i+1}. ${task.target}${solved.has(i)?' ✓':''}`]),taskIndex,i=>{
      if(profile.progressive&&i>solved.size)return;
      savedTasks.set(taskIndex,structuredClone(nodes));taskIndex=i;
      nodes=structuredClone(savedTasks.get(i)||fresh());selected=null;selectedPort=null;source=null;
      nextId=Math.max(0,...nodes.map(n=>Number(n.id.slice(1))||0))+1;invalidateCheck();taskControls();render();
      toolbar.querySelector(`[data-choice="${i}"]`)?.focus({preventScroll:true});
    },'Circuit task');
    group.querySelectorAll('button').forEach((b,i)=>{b.disabled=Boolean(profile.progressive&&i>solved.size);});

    const target=OPERATIONS[current().target],unary=target.arity===1;
    root.querySelector('[data-target-table]').replaceChildren(functionTable({name:current().target,rows:[0,1],columns:unary?['output']:[0,1],values:[0,1].map(x=>unary?[target.run(x)]:[0,1].map(y=>target.run(x,y)))}));
    root.querySelectorAll('[data-add]').forEach(b=>{b.disabled=!allowed().has(b.dataset.add);});
  }
  let values;
  function announce(message) { status.textContent = message; }
  function invalidateCheck() { const check = root.querySelector('[data-check-result]'); if (check){check.hidden=true;check.querySelector('[data-check-message]').textContent='';check.querySelector('[data-check-table]').replaceChildren();delete check.dataset.feedback;} }
  function connect(target, port) {
    if (!source) { announce('Select an output dot first, then an input dot.'); return; }
    const old = target.inputs[port]; target.inputs[port] = relayWorkbench?[...new Set([...(Array.isArray(old)?old:old?[old]:[]),source])]:source;
    try { evaluateCircuit(nodes); }
    catch (e) { target.inputs[port] = old; renderInspector(); announce(e.message); source = null; return; }
    source = null; invalidateCheck(); render();
  }
  function render(focusKey) {
    values = evaluateCircuit(nodes);
    const height=editable?Math.max(relayWorkbench?760:640,...nodes.filter(n=>!['INPUT','OUTPUT','POWER'].includes(n.type)).map(n=>n.y+300)):Math.max(550,...nodes.map(n=>n.y+70));
    if(editable)for(const n of nodes)if(['INPUT','POWER'].includes(n.type))n.y=height-90;
    const minY=relayWorkbench?190:160,maxY=height-300,minX=relayWorkbench?75:55,maxX=relayWorkbench?505:525;
    const canvas = svg('svg', { viewBox: editable?`0 0 580 ${height}`:root.dataset.preset === 'full' ? '0 -55 580 610' : `0 -30 580 ${height+20}`, class: 'boolean-circuit', role: 'group', 'aria-label': editable ? 'Circuit canvas' : root.dataset.preset.startsWith('nand') ? 'Relay circuit for NAND verification' : nodes.some(n=>n.type.startsWith('RELAY-')) ? 'Relay circuit' : 'Adder circuit' });
    if(editable)canvas.style.width=`min(100%, calc(60svh * 580 / ${height}))`;
    let edges = circuitWires(nodes, values, editable ? '' : root.dataset.preset);
    const blocks = svg('g');
    const portX = (node,i)=>portPosition(node,i)[0];
    nodes.forEach(n => {
      const g = svg('g', { 'data-node': n.id });
      if (n.type === 'INPUT') {
        if(editable)g.append(svg('path',{d:`M${n.x},${portPosition(n)[1]} V${n.y-25}`,class:`signal signal--${values.get(n.id)??'unknown'}`}));
        g.append(inputSwitch(n.x, n.y, n.value, n.label, () => { n.value = 1-n.value; render(`switch-${n.id}`); }, n.id));
      } else if(n.type==='POWER'){g.append(svg('text',{x:n.x,y:n.y+10,'text-anchor':'middle'},'POWER: 1'),svg('path',{d:`M${n.x},${n.y-25} V${n.y-5}`,class:'signal signal--1'}));
      } else if (n.type === 'OUTPUT') {
        g.append(svg('path', { d: `M${n.x},${n.y+14} V${n.y+25}`, class: `signal signal--${values.get(n.id) ?? 'unknown'}` }), lamp(n.x, n.y, values.get(n.id), n.label));
      } else {
        const relay=n.type.startsWith('RELAY-');
        const box = svg('g', { role: 'button', tabindex: 0, 'aria-label': `${OPERATIONS[n.type].label||n.type+' gate'} ${n.id}`, 'aria-pressed': String(selected === n.id), 'data-focus': `gate-${n.id}`, class: `circuit-gate ${selected === n.id ? 'is-current' : ''}` });
        if(relay)box.append(svg('rect',{x:n.x-65,y:n.y-60,width:130,height:120,class:'hit-area'}),relayComponent(n,values));
        else box.append(svg('path', { d: `M${n.x-42},${n.y-25} Q${n.x-48},${n.y-24} ${n.x-47},${n.y-14} L${n.x-46},${n.y+18} Q${n.x-45},${n.y+26} ${n.x-36},${n.y+25} L${n.x+39},${n.y+24} Q${n.x+47},${n.y+24} ${n.x+46},${n.y+15} L${n.x+45},${n.y-18} Q${n.x+44},${n.y-26} ${n.x+35},${n.y-25} Z`, class: 'gate-box' }), svg('text', { x: n.x, y: n.y+6, 'text-anchor': 'middle' }, n.type));
        activate(box, () => { selected = n.id; selectedPort=null; render(`gate-${n.id}`); });
        if (editable) {
          box.addEventListener('keydown', e => {
            const d = { ArrowLeft: [-15, 0], ArrowRight: [15, 0], ArrowUp: [0, -15], ArrowDown: [0, 15] }[e.key];
            if (!d) return; e.preventDefault(); n.x = Math.max(minX, Math.min(maxX, n.x+d[0])); n.y = Math.max(minY, Math.min(maxY, n.y+d[1])); render(`gate-${n.id}`);
          });
          box.addEventListener('pointerdown', e => {
            if (e.button !== 0) return;
            const rect = canvas.getBoundingClientRect();
            const start = { x: e.clientX, y: e.clientY, nx: n.x, ny: n.y };
            box.setPointerCapture(e.pointerId);
            function move(e) {
              n.x = Math.max(minX, Math.min(maxX, start.nx+(e.clientX-start.x)*580/rect.width));
              n.y = Math.max(minY, Math.min(maxY, start.ny+(e.clientY-start.y)*canvas.viewBox.baseVal.height/rect.height));
              g.setAttribute('transform', `translate(${n.x-start.nx},${n.y-start.ny})`);
              const next=circuitWires(nodes,values,'');edges.replaceWith(next);edges=next;
            }
            function up() { box.removeEventListener('pointermove', move); box.removeEventListener('pointerup', up); box.removeEventListener('pointercancel', up); selected = n.id; selectedPort=null; render(`gate-${n.id}`); }
            box.addEventListener('pointermove', move); box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
          });
        }
        g.append(box);
      }
      if (editable && n.type !== 'OUTPUT') {
        const port = svg('g', { tabindex: 0, role: 'button', 'aria-label': `Connect from ${n.id}`, 'data-focus': `from-${n.id}`, class: `circuit-port ${source === n.id ? 'is-current' : ''}` });
        port.append(svg('circle', { cx: n.x, cy: portPosition(n)[1], r: 22, class: 'hit-area' }), svg('circle', { cx: n.x, cy: portPosition(n)[1], r: 5, class: `signal signal--${values.get(n.id) ?? 'unknown'}` }));
        activate(port, () => { source = n.id; announce(`Connecting from ${n.id}. Choose a gate input dot, or Escape to cancel.`); }); g.append(port);
      }
      if (editable && !['INPUT','POWER'].includes(n.type)) {
        const arity = OPERATIONS[n.type].arity;
        for (let i = 0; i < arity; i++) {
          const port = svg('g', { tabindex: 0, role: 'button', 'aria-label': `Connect to ${n.id} input ${i+1}`, 'data-focus': `to-${n.id}-${i}`, class: 'circuit-port' });
          port.append(svg('circle', { cx: portX(n,i), cy: portPosition(n,i)[1], r: 22, class: 'hit-area' }), svg('circle', { cx: portX(n,i), cy: portPosition(n,i)[1], r: 5 }));
          activate(port, () => { if (source) connect(n,i); else { selected=n.id;selectedPort=i;render(`to-${n.id}-${i}`); } }); g.append(port);
        }
      }
      if (!editable && !['INPUT','OUTPUT'].includes(n.type) && !n.type.startsWith('RELAY-')) {
        for(let i=0;i<OPERATIONS[n.type].arity;i++)g.append(svg('circle',{cx:portX(n,i),cy:n.y+25,r:4,class:'gate-pin'}));
        g.append(svg('circle',{cx:n.x,cy:n.y-25,r:4,class:'gate-pin'}));
      }
      if(editable && selected===n.id) {
        if(selectedPort!==null && n.inputs[selectedPort]?.length) {
          const [x,y]=portPosition(n,selectedPort);
          g.append(deleteControl(x+28,y+25,`Disconnect ${n.id} input ${selectedPort+1}`,()=>{n.inputs[selectedPort]=undefined;selectedPort=null;invalidateCheck();render();}));
        } else if(selectedPort===null && !['INPUT','POWER','OUTPUT'].includes(n.type)) {
          g.append(deleteControl(n.x+(n.type.startsWith('RELAY-')?75:60),n.y-45,`Remove ${n.id}`,()=>removeNode(n.id)));
        }
      }
      blocks.append(g);
    });
    canvas.append(edges, blocks); picture.replaceChildren(canvas);
    renderInspector();
    if(sandbox)root.querySelector('[data-target-table]').replaceChildren(functionTable({name:'Circuit',rows:[0,1],columns:[0,1],values:circuitTable(nodes)}));
    const outputs = nodes.filter(n => n.type === 'OUTPUT');
    status.replaceChildren(formula(outputs.map(n => `${n.label} = ${values.get(n.id) ?? '? (connect all inputs)'}`).join('; ')));
    if (!editable) status.append(el('p', {class:'boolean-circuit__instruction'}, nodes.some(n=>n.type.startsWith('RELAY-')) ? 'Toggle the inputs to follow the signal through the relay contacts.' : 'Toggle the input switches to follow the signal through the blue boxes.'));
    root.querySelector('[data-text]').replaceChildren(...nodes.map(n => el('p', {}, `${n.label}${n.type !== 'INPUT' && n.type !== 'OUTPUT' ? ` (${n.type})` : ''}: ${n.inputs.length ? `inputs ${n.inputs.join(', ')}; ` : ''}value ${values.get(n.id) ?? 'unknown'}.`)));
    if (focusKey) root.querySelector(`[data-focus="${focusKey}"]`)?.focus({preventScroll:true});
  }
  function deleteControl(x,y,label,action) {
    const control=svg('g',{role:'button',tabindex:0,'aria-label':label,class:'circuit-delete','data-export-omit':''});
    control.append(svg('circle',{cx:x,cy:y,r:16}),svg('path',{d:`M${x-5},${y-5} l10,10 M${x+5},${y-5} l-10,10`}));
    activate(control,action);return control;
  }
  function removeNode(id) {
    const type=nodes.find(n=>n.id===id)?.type;
    nodes=nodes.filter(n=>n.id!==id);
    nodes.forEach(n=>{n.inputs=n.inputs.map(input=>Array.isArray(input)?input.filter(s=>s!==id):input===id?undefined:input);});
    selected=null;selectedPort=null;source=null;invalidateCheck();render();
    root.querySelector(`[data-add="${type}"]`)?.focus({preventScroll:true});
  }
  function renderInspector() {
    inspector.replaceChildren();
    if (!editable) return;
    const node = nodes.find(n => n.id === selected);
    if (!node || ['INPUT','POWER'].includes(node.type)) { inspector.append(el('p', {}, 'Select a gate or the output input dot to edit its connections.')); return; }
    inspector.append(el('p', {}, `${OPERATIONS[node.type].label||node.type} · ${node.id}`));
    if(relayWorkbench)inspector.append(el('p',{},'Connect several outputs to one input for parallel branches. Select a connected source again to disconnect it.'));
    for (let i = 0; i < OPERATIONS[node.type].arity; i++) {
      const group=el('div'); inspector.append(el('p',{},node.type.startsWith('RELAY-')?(i?'Signal supply':'Magnet'):`Input ${i+1}`),group);
      const options=[['','Disconnect'],...nodes.filter(n=>n.id!==node.id&&n.type!=='OUTPUT').map(n=>[n.id,`${n.id} (${OPERATIONS[n.type]?.label||n.type})`])];
      choices(group,options,node.inputs[i]||'',id=>{
        if(!id){node.inputs[i]=undefined;invalidateCheck();render();}
        else if(relayWorkbench && (Array.isArray(node.inputs[i])?node.inputs[i]:[node.inputs[i]]).includes(id)){node.inputs[i]=(Array.isArray(node.inputs[i])?node.inputs[i]:[node.inputs[i]]).filter(s=>s!==id);invalidateCheck();render();}
        else {source=id;connect(node,i);}
      },`${node.id} input ${i+1}`);
      if(relayWorkbench)for(const b of group.querySelectorAll('[data-choice]'))b.setAttribute('aria-pressed',String((Array.isArray(node.inputs[i])?node.inputs[i]:[node.inputs[i]]).includes(b.dataset.choice)));
    }
    if (node.type !== 'OUTPUT') {
      const remove = el('button', { type: 'button' }, 'Remove gate');
      remove.addEventListener('click', () => removeNode(node.id)); inspector.append(remove);
    }
  }
  root.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => {
    if (!allowed().has(b.dataset.add)) return;
    if (nodes.filter(n=>!['INPUT','OUTPUT','POWER'].includes(n.type)).length >= 20) { announce('Use at most 20 components.'); return; }
    const id = `g${nextId++}`;
    nodes.push({ id, type: b.dataset.add, x: 90+((nextId-2)%3)*185, y: 200+Math.floor((nextId-2)/3)*(relayWorkbench?155:120), inputs: [], label: id }); selected = id; selectedPort=null; invalidateCheck(); render(`gate-${id}`);
  }));
  root.querySelector('[data-reset]')?.addEventListener('click', () => { nodes = fresh(); selected = null; selectedPort=null; source = null; nextId = 1; invalidateCheck(); render(); });
  root.addEventListener('keydown', e => { if (e.key === 'Escape') { source = null; announce('Connection cancelled.'); } });
  root.querySelector('[data-check]')?.addEventListener('click', () => {
    const target=current().target, {rows,correct}=checkCircuit(nodes,target),unary=OPERATIONS[target].arity===1;
    const result=root.querySelector('[data-check-result]');
    const actual=[0,1].map(x=>(unary?[0]:[0,1]).map(y=>rows.find(r=>r.X===x&&r.Y===y)?.actual??null));
    const unknown=actual.flat().includes(null);
    const message=correct?`Correct: the circuit implements ${target}.`:unknown?'Connect every required input to calculate the missing outputs (?).':'Not quite. The red entries differ from the required function.';
    result.hidden=false;
    result.querySelector('[data-check-message]').textContent=message;
    result.querySelector('[data-check-table]').replaceChildren(functionTable({name:'Circuit',rows:[0,1],columns:unary?['output']:[0,1],values:actual,incorrect:(x,y)=>actual[x][y]!==OPERATIONS[target].run(x,y)}));
    result.dataset.feedback=correct?'correct':'incorrect';
    if(correct){solved.add(taskIndex);earned.add(target);taskControls();celebrate(root.querySelector('[data-check]'));}

  });
  root.querySelectorAll('[data-add]').forEach(button=>{
    const type=button.dataset.add,mini=svg('svg',{viewBox:'-80 -70 160 140',class:'boolean-component-preview','aria-hidden':'true'});
    if(type.startsWith('RELAY-'))mini.append(relayComponent({x:0,y:0,id:'preview',type,inputs:[]},new Map()));
    else mini.append(svg('rect',{x:-50,y:-27,width:100,height:54,rx:6,class:'gate-box'}),svg('text',{x:0,y:7,'text-anchor':'middle'},type));
    button.setAttribute('aria-label',button.textContent.trim());
    button.replaceChildren(mini);
  });
  taskControls();
  render();
}