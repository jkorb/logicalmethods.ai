import {isVariable} from './fol-parser.js';
import {signature} from './fol-inference.js';
export function leanPrint(t){
  if(/^[∀∃]/u.test(t.label))return `(${t.label[0]} ${t.label.slice(1)} : Domain, ${leanPrint(t.children[0])})`;
  if(!t.children.length){let s=t.label.replace(/⊥/g,'False').replace(/⊤/g,'True');while(/[A-Za-z][A-Za-z0-9_]*\([^()]*\)/.test(s))s=s.replace(/([A-Za-z][A-Za-z0-9_]*)\(([^()]*)\)/g,(_,n,args)=>`[${n} ${args.split(',').map(x=>x.trim()).join(' ')}]`);return s.replace(/\[/g,'(').replace(/\]/g,')').replace(/\bdefault\b/g,'(default : Domain)');}
  if(t.label==='¬')return '¬'+leanPrint(t.children[0]);return '('+t.children.map(leanPrint).join(' '+t.label+' ')+')';
}
export function folDeclarations(formulas,print,free=[],terms=[]){
  const props=new Set();const scan=t=>{if(!t.children.length&&/^[A-Za-z][A-Za-z0-9_]*$/.test(t.label))props.add(t.label);t.children.forEach(scan);};formulas.forEach(scan);
  const language=signature([...formulas.map(print),...terms].join('; '));language.constants=language.constants.filter(n=>!props.has(n));
  const inhabited=language.constants.includes('default');language.constants=language.constants.filter(n=>n!=='default');
  const names=[...props,...language.constants,...Object.keys(language.functions),...Object.keys(language.predicates),...free];if(names.some(n=>!/^[A-Za-z][A-Za-z0-9_]*$/.test(n)||['Domain','Prop','Type','False','True','fun','by','example','variable','default'].includes(n)||/^h\d+$/.test(n)))throw Error('Use ordinary Lean names without reserved words, subscripts or assumption names h0, h1, … .');
  const lines=['variable (Domain : Type)'+(inhabited?' [Inhabited Domain]':'')];if(props.size)lines.push(`variable (${[...props].join(' ')} : Prop)`);
  for(const [name,n] of Object.entries(language.predicates))lines.push(`variable (${name} : ${'Domain → '.repeat(n)}Prop)`);
  for(const [name,n] of Object.entries(language.functions))lines.push(`variable (${name} : ${'Domain → '.repeat(n)}Domain)`);
  language.constants.push(...free.filter(v=>!language.constants.includes(v)));
  if(language.constants.length)lines.push(`variable (${language.constants.join(' ')} : Domain)`);
  return lines.join('\n')+'\n\n';
}
export function parseLeanFOL(source,language){
  source=source.replace(/\(default\s*:\s*Domain\)/g,'default');
  const bound=new Set();
  const ts=source.match(/[A-Za-z][A-Za-z0-9_]*|[∀∃¬∧∨→↔⊥⊤=(),:]/gu)||[];let i=0;
  if(ts.join('')!==source.replace(/\s/g,''))throw Error('Unsupported Lean formula notation.');
  const need=s=>{if(ts[i++]!==s)throw Error(`Expected ${s}.`);};
  function term(){if(ts[i]==='('){i++;const t=term();need(')');return t;}const n=ts[i++];if(!bound.has(n)&&!language.constants.includes(n)&&!Object.hasOwn(language.functions,n))throw Error(`Unknown object ${n}.`);const arity=language.functions[n]||0;return arity?`${n}(${Array.from({length:arity},term).join(', ')})`:n;}
  const ops={'↔':1,'→':2,'∨':3,'∧':4};
  function expr(min=0){let left;const n=ts[i++];
    if(n==='('){const save=i;try{left=expr();need(')');}catch(error){i=save-1;const a=term();need('=');const b=term();left={label:a+' = '+b,children:[]};}}
    else if(n==='¬')left={label:'¬',children:[expr(5)]};
    else if(n==='∀'||n==='∃'){const v=ts[i++];if(!isVariable(v||''))throw Error('Use x, y, z, u, v or w for bound objects.');if(ts[i]===':'){i++;need('Domain');}need(',');const old=bound.has(v);bound.add(v);left={label:n+v,children:[expr()]};if(!old)bound.delete(v);}
    else if(Object.hasOwn(language.predicates,n))left={label:`${n}(${Array.from({length:language.predicates[n]},term).join(', ')})`,children:[]};
    else if(['False','True','⊥','⊤'].includes(n))left={label:['False','⊥'].includes(n)?'⊥':'⊤',children:[]};
    else if(language.props?.has(n))left={label:n,children:[]};
    else if(bound.has(n)||language.constants.includes(n)||Object.hasOwn(language.functions,n)){i--;const a=term();need('=');const b=term();left={label:a+' = '+b,children:[]};}
    else throw Error(`Unknown predicate ${n}.`);
    while(ops[ts[i]]&&ops[ts[i]]>=min){const op=ts[i++],right=expr(ops[op]+(op==='→'?0:1));left={label:op,children:[left,right]};}return left;
  }
  const out=expr();if(i!==ts.length)throw Error('Unexpected formula tokens.');return out;
}
