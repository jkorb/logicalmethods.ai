import { svg, activate } from './boolean-ui.js';
import { tuples, tupleKey } from '../logic/fol-model.js';
export const el = (tag, text, className) => { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (className) n.className = className; return n; };
export function modelViews({ language, objects, columns, model, editable, choose, selected, markerId, removeObject, chooseRelation, selectedRelation, removeRelation, setPredicate, highlightSymbol, symbol, beginTuple, chooseSymbol }) {
  const label = id => objects.get(id)?.label || id;
  const kindOf = name => language.constants.includes(name) ? 'constant' : Object.hasOwn(language.functions, name) ? 'function' : 'predicate';
  function interpretation(node, name) { node.dataset.interpretation = `${kindOf(name)}:${name}`; return node; }
  function symbolLabel(name, brackets = true) { const n = el(editable ? 'button' : 'span', brackets ? `⟦${name}⟧` : name, 'fol-symbol-label'); if(editable) { n.type='button'; n.setAttribute('aria-label',`Interpret ${name}`); n.addEventListener('click',()=>chooseSymbol(`${kindOf(name)}:${name}`)); } return n; }

  function picture(id, interactive = editable, transparent = false) {
    if (id === undefined) return el('span', '?');
    const object = objects.get(id); const n = el(interactive ? 'button' : 'span', undefined, 'fol-object'); n.dataset.object = id;
    if (interactive) {
      n.type = 'button'; n.dataset.object = id; n.setAttribute('aria-label', `Select ${label(id)}`); n.title = label(id);
      n.setAttribute('aria-pressed', String(selected.includes(id))); n.addEventListener('click', () => choose(id));
    }
    if (transparent && object?.symbol) { const art=svg('svg',{viewBox:'0 0 42 46',class:'fol-object-art','aria-hidden':'true'}); art.append(svg('use',{href:`#${object.symbol}`,width:42,height:46})); n.append(art); if(!interactive){n.setAttribute('role','img');n.setAttribute('aria-label',label(id));} }
    else if (object?.image) { const image = el('img'); image.src = object.image; image.alt = interactive ? '' : label(id); n.append(image); }
    else if (object?.emoji) { const icon=el('span',object.emoji,'fol-emoji'); icon.setAttribute('aria-hidden','true'); n.append(icon); if(object.badge) n.append(el('small',object.badge,'fol-emoji-badge')); if(!interactive) { n.setAttribute('role','img'); n.setAttribute('aria-label',label(id)); } n.title=label(id); }
    else n.append(label(id));
    const order = selected.flatMap((d, i) => d === id ? [i + 1] : []);
    if (interactive && order.length) n.append(el('span', order.join(','), 'fol-order'));
    if (interactive && selected.includes(id)) {
      const wrap = el('span', undefined, 'fol-object-selection'); wrap.append(n, deleteButton(() => removeObject(id), `Delete ${label(id)}`)); return wrap;
    }
    return n;
  }
  function deleteButton(action, name) { const b = el('button', '×', 'fol-delete'); b.type = 'button'; b.setAttribute('aria-label', name); b.title = name; b.addEventListener('click', e => { e.stopPropagation(); action(); }); return b; }
  const sameRelation = r => selectedRelation && JSON.stringify(r) === JSON.stringify(selectedRelation);
  function relationSelection(node, relation) {
    node.dataset.relation = JSON.stringify(relation);
    if (!editable) return;
    node.dataset.relation = JSON.stringify(relation); node.tabIndex = 0; node.classList.add('fol-selectable-tuple'); node.setAttribute('aria-label', `Select ${relation.name}: ${relation.args.map(label).join(', ')}${relation.output ? ' to ' + label(relation.output) : ''}`);
    node.addEventListener('click', e => { if (!e.target.closest('button')) chooseRelation(relation); });
    node.addEventListener('keydown', e => { if (e.target === node && ['Enter', ' '].includes(e.key)) { e.preventDefault(); chooseRelation(relation); } });
    if (sameRelation(relation)) { node.classList.add('is-selected'); node.append(deleteButton(() => removeRelation(relation), `Delete ${relation.name} tuple`)); }
  }
  function tuple(row, unary = false) {
    const n = el('span', undefined, 'fol-tuple');
    if (!unary) n.append('[');
    row.forEach((d, i) => { if (i) n.append(', '); n.append(picture(d)); });
    if (!unary) n.append(']'); return n;
  }
  function set(rows, unary = false, name = null, isFunction = false) {
    const n = el('span', undefined, 'fol-set-members'); n.append('{ ');
    rows.forEach((row, i) => { if (i) n.append(', '); const entry = tuple(row, unary); if (name) relationSelection(entry, { name, args: isFunction ? row.slice(0, -1) : row, ...(isFunction ? { output: row.at(-1) } : {}) }); n.append(entry); }); n.append(' }'); return n;
  }
  function domain() { const n = el('div', undefined, 'fol-domain'); n.dataset.domain = ''; n.append('D = ', set(model.domain.map(d => [d]), true)); return n; }
  function facts({ includeUnary = true, includeDomain = true } = {}) {
    const list = el('dl', undefined, 'fol-facts');
    const row = (name, value) => { const wrapper = el('div', undefined, 'fol-fact'); const dd = el('dd'); dd.append('= ', value); const dt=el('dt'); if(name === 'D') dt.append(name); else { const symbol=name.slice(1,-1); dt.append(symbolLabel(symbol)); interpretation(wrapper,symbol); } wrapper.append(dt, dd); list.append(wrapper); };
    if (includeDomain) row('D', set(model.domain.map(d => [d]), true));
    for (const c of language.constants) row(`⟦${c}⟧`, picture(model.constants[c]));
    for (const f of Object.keys(language.functions)) {
      const pairs = Object.entries(model.functions[f] || {}).map(([key, value]) => [...JSON.parse(key), value]); row(`⟦${f}⟧`, set(pairs, false, f, true));
    }
    for (const [r, arity] of Object.entries(language.predicates)) if (includeUnary || arity !== 1) row(`⟦${r}⟧`, set(model.predicates[r], arity === 1, r));
    return list;
  }
  function table(name, headings, rows, { operation = false, unary = false, relations = [] } = {}) {
    const wrapper = el('div', undefined, `function-table ${operation ? '' : 'fol-relation'} ${unary ? 'fol-unary' : ''}`);
    if(name.startsWith('⟦')) interpretation(wrapper,name.slice(1,-1));
    const nameKey=name.startsWith('⟦')?name.slice(1,-1):null, adding=editable && nameKey && highlightSymbol===`predicate:${nameKey}`;
    if (!rows.length && !adding) { wrapper.classList.add('fol-empty-extension'); wrapper.append(name.startsWith('⟦') ? symbolLabel(name.slice(1,-1)) : el('span',name), ' = ∅'); return wrapper; }
    const t = el('table'); t.setAttribute('aria-label', name);
    if (!operation) { const caption=el('caption'); caption.append(name.startsWith('⟦') ? symbolLabel(name.slice(1,-1)) : name); t.append(caption); }
    const head = el('thead'), tr = el('tr');
    headings.forEach((h, i) => { const th = el('th'); th.scope = 'col'; if (h) th.append(typeof h === 'string' && h.startsWith('⟦') && h !== '⟦·⟧' ? symbolLabel(h.slice(1,-1)) : h); else { const sr = el('span', `${name} value`, 'visually-hidden'); th.append(sr); } if (operation && i === 0) th.className = 'function-table__name'; tr.append(th); });
    head.append(tr); t.append(head); const body = el('tbody');
    for (const [rowIndex, values] of rows.entries()) { const r = el('tr'); values.forEach((v, i) => { const c = el(operation && i === 0 ? 'th' : 'td'); if (c.tagName === 'TH') c.scope = 'row'; c.append(v); r.append(c); }); if (relations[rowIndex]) { relationSelection(r, relations[rowIndex]); const deletion = r.querySelector(':scope > .fol-delete'); if (deletion) r.lastElementChild.previousElementSibling.append(deletion); } body.append(r); }
    if (!rows.length) { const r = el('tr'); const td = el('td', '∅'); td.colSpan = headings.length; r.append(td); body.append(r); }
    if(adding) { const r=el('tr',undefined,'fol-add-row');const active=symbol===`predicate:${nameKey}`;headings.forEach((_,i)=>{const cell=el('td');if(i===0){const plus=el('button','+','fol-tuple-plus');plus.type='button';plus.setAttribute('aria-label',`Add ${nameKey} tuple`);plus.addEventListener('click',()=>beginTuple(nameKey));cell.append(plus);}cell.append(active && selected[i] ? picture(selected[i],false) : el('span','?',active && i===selected.length ? 'fol-next-slot' : ''));r.append(cell);});body.append(r); }
    t.append(body); wrapper.append(t); return wrapper;
  }
  function tables(only = null) {
    const wrapper = el('div', undefined, 'fol-tables');
    const constants = language.constants.filter(c => !only || only.has(c));
    if (only && constants.length) {
      const names = el('div', undefined, 'fol-query-constants');
      for (const c of constants) { const row = el('span'); row.append(symbolLabel(c), ' = ', picture(model.constants[c])); interpretation(row, c); names.append(row); }
      wrapper.append(names);
    } else if (constants.length && (editable || [...objects.values()].some(o => o.image))) wrapper.append(table('Constants', ['⟦·⟧', ''], constants.map(c => [symbolLabel(c,false), interpretation(picture(model.constants[c]),c)]), { operation: true }));
    for (const [f, arity] of Object.entries(language.functions)) {
      if (only && !only.has(f)) continue;
      if (arity === 1) wrapper.append(table(`⟦${f}⟧`, [`⟦${f}⟧`, ''], model.domain.map(d => [picture(d), picture(model.functions[f]?.[tupleKey([d])])]), { operation: true, relations: model.domain.map(d => ({name:f,args:[d],output:model.functions[f]?.[tupleKey([d])]})) }));
      else if (arity === 2) wrapper.append(table(`⟦${f}⟧`, [`⟦${f}⟧`, ...model.domain.map(d => picture(d))], model.domain.map(a => [picture(a), ...model.domain.map(b => picture(model.functions[f]?.[tupleKey([a, b])]))]), { operation: true }));
      else wrapper.append(table(`⟦${f}⟧`, [`⟦${f}⟧`, ''], tuples(model.domain, arity).map(row => [tuple(row), picture(model.functions[f]?.[tupleKey(row)])]), { operation: true }));
    }
    for (const [r, arity] of Object.entries(language.predicates)) if (!only || only.has(r)) wrapper.append(table(`⟦${r}⟧`, columns[r] || ['x', 'y', 'z'].slice(0, arity), model.predicates[r].map(row => row.map(d => picture(d))), { unary: arity === 1, relations: model.predicates[r].map(args => ({ name: r, args })) }));
    return wrapper;
  }
  function objectNode(id, x, y, { annotations = true } = {}) {
    const g = svg('g', editable ? { role: 'button', tabindex: 0, 'aria-label': `Select ${label(id)}`, 'data-object': id, 'aria-pressed': selected.includes(id) } : { role: 'img', 'aria-label': label(id), 'data-object': id });
    if (editable) activate(g, () => choose(id));
    const object = objects.get(id); g.append(svg('title', {}, label(id)));
    if (object?.image) {
      g.append(svg('rect', { x: x - 23, y: y - 25, width: 46, height: 50, rx: 5, class: 'fol-image-paper' }));
      g.append(svg(object.symbol ? 'use' : 'image', { href: object.symbol ? `#${object.symbol}` : object.image, x: x - 21, y: y - 23, width: 42, height: 46 }));
    } else if (object?.emoji) {
      g.append(svg('rect',{x:x-24,y:y-25,width:48,height:50,rx:6,class:'fol-image-paper'}));
      g.append(svg('text',{x,y:y+12,'text-anchor':'middle',class:'fol-emoji'},object.emoji));
      if(annotations) g.append(svg('text',{x,y:y+42,'text-anchor':'middle'},label(id)));
    } else { g.append(svg('rect', { x: x - 66, y: y - 17, width: 132, height: 34, rx: 4 })); g.append(svg('text', { x, y: y + 5, 'text-anchor': 'middle' }, label(id))); }
    if (annotations) {
      const constants = language.constants.filter(c => model.constants[c] === id);
      if (constants.length && object?.image) g.append(svg('text', { x, y: y + 42, 'text-anchor': 'middle' }, constants.map(c=>`⟦${c}⟧`).join(' = ')));
      const unary = Object.entries(language.predicates).filter(([r, arity]) => arity === 1 && model.predicates[r].some(t => t[0] === id)).map(([r]) => `⟦${r}⟧`);
      if (unary.length) g.append(svg('text', { x, y: y - 34, 'text-anchor': 'middle' }, unary.join(', ')));
    }
    g.dataset.interpretation = [...language.constants.filter(c=>model.constants[c]===id).map(c=>`constant:${c}`), ...Object.keys(language.predicates).filter(r=>language.predicates[r]===1 && model.predicates[r].some(row=>row[0]===id)).map(r=>`predicate:${r}`)].join(' ');
    const order = selected.flatMap((d, i) => d === id ? [i + 1] : []);
    if (order.length) {
      g.append(svg('rect', { x:x-28, y:y-29, width:56, height:58, rx:6, class:'fol-selection-ring' }));
      const del = svg('g', {role:'button', tabindex:0, 'aria-label':`Delete ${label(id)}`, class:'fol-svg-delete'});
      del.append(svg('circle',{cx:x+30,cy:y-30,r:12}),svg('text',{x:x+30,y:y-25,'text-anchor':'middle'},'×'));
      activate(del, e => { e?.stopPropagation(); removeObject(id); }); const outer=svg('g'); outer.append(g,del); return outer;
    }
    return g;
  }
  function graph() {
    const n = model.domain.length, size = Math.max(680, n * 100), center = size / 2, radius = center - 115;
    const graph = svg('svg', { viewBox: `0 0 ${size} ${size}`, class: 'fol-graph', role: 'group', 'aria-label': 'Model graph; solid predicate arrows, dashed function arrows' });

    let positions = new Map(model.domain.map((d, i) => [d, { x: center + radius * Math.cos(2 * Math.PI * i / n - Math.PI / 2), y: center + radius * Math.sin(2 * Math.PI * i / n - Math.PI / 2) }]));
    const groups = [...new Set(model.domain.map(d => objects.get(d)?.group).filter(Boolean))];
    if(groups.length) {
      const height = Math.max(420, ...groups.map(group=>model.domain.filter(d=>objects.get(d)?.group===group).length*115+130));
      const width = Math.max(640,groups.length*230+100); graph.setAttribute('viewBox',`0 0 ${width} ${height}`);
      positions = new Map();
      groups.forEach((group,column) => { const x=140+column*230; graph.append(svg('text',{x,y:40,'text-anchor':'middle'},group)); model.domain.filter(d=>objects.get(d)?.group===group).forEach((d,row)=>positions.set(d,{x,y:105+row*115})); });
      model.domain.filter(d=>!positions.has(d)).forEach((d,i)=>positions.set(d,{x:70+i*95,y:height-45}));
    }
    const defs = svg('defs'), marker = svg('marker', { id: markerId, viewBox: '0 0 10 10', refX: 9, refY: 5, markerUnits: 'userSpaceOnUse', markerWidth: 12, markerHeight: 12, orient: 'auto-start-reverse' });
    marker.append(svg('path', { d: 'M 0 0 L 10 5 L 0 10 z' })); for (let i=0;i<4;i++) { const m=marker.cloneNode(true); m.id=`${markerId}-${i}`; m.setAttribute('class',`fol-edge--${i}`); defs.append(m); } graph.append(defs);
    const edges = svg('g'), nodes = svg('g'); let count = 0;
    function edge(a, b, name, dashed = false, relation = null, color = 0) {
      if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
      const start = { x: a.x + dx / len * 35, y: a.y + dy / len * 35 }, end = { x: b.x - dx / len * 35, y: b.y - dy / len * 35 };
      const bend = 20 + (count++ % 3) * 14, cx = (a.x + b.x) / 2 - dy / len * bend, cy = (a.y + b.y) / 2 + dx / len * bend;
      const d = a === b ? `M ${a.x + 20} ${a.y} C ${a.x + 85} ${a.y - 85}, ${a.x - 85} ${a.y - 85}, ${a.x - 20} ${a.y}` : `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
      const group = svg('g', { ...(relation ? {'data-relation':JSON.stringify(relation)} : {}), 'data-interpretation': relation ? `${relation.output ? 'function' : 'predicate'}:${relation.name}` : '', class: `fol-edge fol-edge--${color % 4}`, ...(editable && relation ? { role:'button', tabindex:0, 'aria-label':`Select ${relation.name}: ${relation.args.map(label).join(', ')}${relation.output ? ' to ' + label(relation.output) : ''}`, 'aria-pressed':sameRelation(relation) || false } : {}) });
      if (relation) group.append(svg('title', {}, `${relation.name}: ${relation.args.map(label).join(', ')}${relation.output ? ' to ' + label(relation.output) : ''}`));
      group.append(svg('path', { d, class:'fol-edge-hit' }), svg('path', { d, 'marker-end': `url(#${markerId}-${color % 4})`, class: dashed ? 'fol-function-edge' : '' }));
      const tx = a === b ? a.x : (start.x + 2 * cx + end.x) / 4, ty = a === b ? a.y - 62 : (start.y + 2 * cy + end.y) / 4;
      group.append(svg('text', { x:tx, y:ty, 'text-anchor':'middle', class:'fol-edge-label',
        'data-label-x':tx, 'data-label-y':ty, 'data-label-name':name,
        'data-label-pair':relation ? JSON.stringify([...relation.args, ...(relation.output ? [relation.output] : [])].sort()) : ''
      }, relation ? `⟦${name}⟧` : name));
      if (editable && relation) {
        activate(group, () => chooseRelation(relation));
        if (sameRelation(relation)) {
          const del = svg('g',{role:'button',tabindex:0,'aria-label':`Delete ${relation.name} tuple`,class:'fol-svg-delete'});
          del.append(svg('circle',{cx:tx+42,cy:ty-5,r:12}),svg('text',{x:tx+42,y:ty,'text-anchor':'middle'},'×'));
          activate(del,e=>{e?.stopPropagation();removeRelation(relation);}); nodes.append(del);
        }
      }
      edges.append(group);
    }
    function relation(name, args, output) {
      const descriptor = { name, args, ...(output ? {output} : {}) }, color = [...Object.keys(language.predicates).filter(n => language.predicates[n] > 1), ...Object.keys(language.functions)].indexOf(name);
      if (args.length === 1 && output) edge(positions.get(args[0]), positions.get(output), name, true, descriptor, color);
      else if (args.length === 2 && !output) edge(positions.get(args[0]), positions.get(args[1]), name, false, descriptor, color);
      else {
        const p = { x: center + (count % 3 - 1) * 70, y: center + Math.floor(count / 3) * 20 };
        nodes.append(svg('text', { x: p.x, y: p.y, 'text-anchor': 'middle' }, `⟦${name}⟧`));
        args.forEach((d, i) => edge(p, positions.get(d), String(i + 1))); if (output) edge(p, positions.get(output), '↦', true);
      }
    }
    for (const [f, rows] of Object.entries(model.functions)) for (const [key, output] of Object.entries(rows)) relation(f, JSON.parse(key), output);
    for (const [r, rows] of Object.entries(model.predicates)) if (language.predicates[r] > 1) for (const row of rows) relation(r, row);
    for (const [d, p] of positions) nodes.append(objectNode(d, p.x, p.y)); graph.append(edges, nodes); return graph;
  }
  function sets() {
    if(setPredicate==='@together')return together();
    const name = setPredicate, isFunction = Object.hasOwn(language.functions,name), arity = name ? (isFunction ? language.functions[name]+1 : language.predicates[name]) : 1;
    const members = !name ? model.domain.map(d=>[d]) : isFunction ? Object.entries(model.functions[name] || {}).map(([key,value])=>[...JSON.parse(key),value]) : model.predicates[name] || [];
    const outside = name && arity === 1 ? model.domain.filter(d=>!members.some(row=>row[0]===d)) : [];
    const columns = arity>2 ? 2 : 3, rows = Math.max(2,Math.ceil(members.length/columns)), innerHeight=rows*85+50;
    const height = name ? innerHeight+Math.max(80,Math.ceil(outside.length/5)*75)+65 : innerHeight+60;
    const drawing=svg('svg',{viewBox:`0 0 600 ${height}`,class:'fol-sets',role:'group','aria-label':name ? `Members and non-members of ${name}` : 'Domain D'});
    drawing.append(svg('rect',{x:5,y:5,width:590,height:height-10,rx:24,class:'fol-set-universe'}));
    drawing.append(svg('text',{x:22,y:34},arity===1?'D':`D${['','','²','³','⁴'][arity]}`));
    if(name) {
      const contour=svg('rect',{x:55,y:42,width:490,height:innerHeight,rx:24,class:'fol-set-contour'}); contour.dataset.interpretation=`${isFunction?'function':'predicate'}:${name}`; drawing.append(contour);
      drawing.append(svg('text',{x:76,y:69},`⟦${name}⟧`));
      if(editable) {const plus=svg('g',{role:'button',tabindex:0,'aria-label':`Add ${name} tuple`,class:'fol-set-add'});plus.append(svg('circle',{cx:515,cy:65,r:16}),svg('text',{x:515,y:72,'text-anchor':'middle'},'+'));activate(plus,()=>beginTuple(name));drawing.append(plus);}
    }
    if(!members.length) drawing.append(svg('text',{x:300,y:130,'text-anchor':'middle'},'∅'));
    members.forEach((row,i)=>{
      const x=columns===2 ? 185+i%2*230 : 135+i%3*165,y=115+Math.floor(i/columns)*85;
      if(arity===1)drawing.append(objectNode(row[0],x,y,{annotations:false}));
      else {
        const group=svg('g',{'aria-label':`${name} tuple`,'data-relation':JSON.stringify({name,args:isFunction?row.slice(0,-1):row,...(isFunction?{output:row.at(-1)}:{})})});
        const span=(arity-1)*48/2+30;
        group.append(svg('text',{x:x-span,y:y+5},'['),svg('text',{x:x+span,y:y+5},']'));
        row.forEach((d,j)=>group.append(objectNode(d,x+(j-(arity-1)/2)*48,y,{annotations:false})));
        drawing.append(group);
      }
    });
    outside.forEach((d,i)=>drawing.append(objectNode(d,80+i%5*110,innerHeight+87+Math.floor(i/5)*75,{annotations:false})));
    return drawing;
  }
  function together() {
    const names=Object.keys(language.predicates).filter(n=>language.predicates[n]===1);
    const groups=[[],[],[],[]];for(const d of model.domain){const mask=names.reduce((n,r,i)=>n+(model.predicates[r].some(row=>row[0]===d)?1<<i:0),0);groups[mask].push(d);}
    const h=Math.max(220,Math.max(...groups.slice(1).map(g=>g.length))*65+120),height=h+Math.max(85,Math.ceil(groups[0].length/5)*65+35);
    const drawing=svg('svg',{viewBox:`0 0 600 ${height}`,class:'fol-sets',role:'group','aria-label':`Overlapping extensions of ${names.join(' and ')}`});
    drawing.append(svg('rect',{x:5,y:5,width:590,height:height-10,rx:24,class:'fol-set-universe'}),svg('text',{x:20,y:32},'D'));
    names.forEach((name,i)=>{const region=svg('rect',{x:45+i*210,y:45,width:300,height:h-55,rx:70,class:`fol-set-contour fol-overlap-${i}`,'data-interpretation':`predicate:${name}`});drawing.append(region,svg('text',{x:80+i*310,y:77},`⟦${name}⟧`));});
    for(const mask of [1,3,2])groups[mask].forEach((d,i)=>drawing.append(objectNode(d,{1:145,3:300,2:455}[mask],120+i*65,{annotations:false})));
    groups[0].forEach((d,i)=>drawing.append(objectNode(d,75+i%5*110,h+40+Math.floor(i/5)*65,{annotations:false})));
    return drawing;
  }
  function extension(rows, variables, formula) {
    const box=el('div',undefined,'fol-query-extension'); box.dataset.queryExtension=''; box.setAttribute('role','region'); box.setAttribute('aria-label',`Extension of ${formula}`);
    box.append(el('span',`⟦A(${variables.join(', ')})⟧ = `,'fol-extension-label'));
    if(!variables.length) box.append(rows.length?'true':'false');
    else if(!rows.length)box.append('∅');
    else { box.append('{ '); rows.forEach((row,i)=>{if(i)box.append(', ');const item=el('span',undefined,'fol-tuple'); if(row.length>1)item.append('[');row.forEach((d,j)=>{if(j)item.append(', ');item.append(picture(d,false));});if(row.length>1)item.append(']');box.append(item);});box.append(' }'); }
    return box;
  }

  return { picture, tuple, set, domain, facts, tables, graph, sets, table, extension };
}
