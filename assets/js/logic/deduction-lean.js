// A deliberately bounded Lean teaching language, not a Lean evaluator.
import {ast,formula,same,printFormula,emptyProof,addAssumption,infer,validateProof,extractProof} from './deduction.js';
const leanFormula=t=>printFormula(t).replace(/⊥/g,'False').replace(/⊤/g,'True');
export function toLean(data,root=data.nodes.length-1){
  const p=validateProof(data),n=p.nodes[root];if(!n)throw Error('Select a conclusion.');
  const names=new Set();const scan=t=>{if(!t.children.length&&!['⊥','⊤'].includes(t.label))names.add(t.label);t.children.forEach(scan);};
  p.nodes.forEach(n=>scan(n.formula));
  if([...names].some(s=>!/^[A-Za-z][A-Za-z0-9_]*$/.test(s)||['Prop','False','True','fun','by','example','variable'].includes(s)||/^h\d+$/.test(s)))throw Error('For Lean export, use ordinary atom names such as RAIN, A or B, without subscripts or reserved names h0, h1, … .');
  let visits=0;
  function term(id){if(++visits>4000)throw Error('This shared proof expands into too large a Lean term. Export a smaller derivation.');const v=p.nodes[id],a=v.parents.map(term),h=v.discharge.map(i=>'h'+i);switch(v.rule){
    case 'assumption':return 'h'+id;
    case 'andI':return `(And.intro ${a[0]} ${a[1]})`;
    case 'andL':return `(And.left ${a[0]})`;case 'andR':return `(And.right ${a[0]})`;
    case 'orL':return `(Or.inl ${a[0]})`;case 'orR':return `(Or.inr ${a[0]})`;
    case 'impE':case 'notE':return `(${a[0]} ${a[1]})`;
    case 'impI':case 'notI':return `(fun ${h[0]} => ${a[0]})`;
    case 'raa':return `(Classical.byContradiction (fun ${h[0]} => ${a[0]}))`;
    case 'falseE':return `(False.elim ${a[0]})`;
    case 'trueI':return 'True.intro';
    case 'orE':return `(Or.elim ${a[0]} (fun ${h[0]} => ${a[1]}) (fun ${h[1]} => ${a[2]}))`;
    case 'iffI':return `(Iff.intro ${a[0]} ${a[1]})`;
    case 'iffL':return `(Iff.mp ${a[0]})`;case 'iffR':return `(Iff.mpr ${a[0]})`;
    default:throw Error('Unsupported rule.');
  }}
  function tactics(id,indent='  '){const v=p.nodes[id];
    if(['impI','notI'].includes(v.rule))return `${indent}intro h${v.discharge[0]}\n${tactics(v.parents[0],indent)}`;
    if(v.rule==='andI'||v.rule==='iffI')return `${indent}apply ${v.rule==='andI'?'And':'Iff'}.intro\n`+v.parents.map(i=>{const s=tactics(i,indent+'  ');return indent+'· '+s.slice(indent.length+2);}).join('\n');
    if(v.rule==='orL'||v.rule==='orR')return `${indent}apply Or.${v.rule==='orL'?'inl':'inr'}\n${tactics(v.parents[0],indent)}`;
    if(v.rule==='orE')return `${indent}apply Or.elim ${term(v.parents[0])}\n`+v.parents.slice(1).map((i,k)=>`${indent}· intro h${v.discharge[k]}\n${tactics(i,indent+'  ')}`).join('\n');
    if(v.rule==='raa')return `${indent}apply Classical.byContradiction\n${indent}intro h${v.discharge[0]}\n${tactics(v.parents[0],indent)}`;
    return indent+'exact '+term(id);
  }
  return (names.size?`variable (${[...names].join(' ')} : Prop)\n\n`:'')+`example ${n.open.map(id=>`(h${id} : ${leanFormula(p.nodes[id].formula)})`).join(' ')} : ${leanFormula(n.formula)} := by\n${tactics(root)}\n`;
}
function termTree(text){
  const tokens=text.match(/=>|[()]|[A-Za-z_][A-Za-z0-9_.]*|\S/g)||[];let pos=0;
  function expr(){if(tokens[pos]==='fun'){pos++;const name=tokens[pos++];if(tokens[pos++]!=='=>')throw Error('Use fun name => term.');return {lambda:name,body:expr()};}
    const items=[];while(pos<tokens.length&&tokens[pos]!==')'){if(tokens[pos]==='('){pos++;items.push(expr());if(tokens[pos++]!==')')throw Error('Unmatched term brackets.');}else items.push({name:tokens[pos++]});}
    if(!items.length)throw Error('Missing proof term.');return items.length===1?items[0]:{items};
  }
  const t=expr();if(pos!==tokens.length)throw Error('Unexpected term bracket.');return t;
}
export function fromLean(source){
  if(source.length>16000)throw Error('Use at most 16000 characters.');
  if(/\b(sorry|admit|axiom|unsafe)\b/.test(source))throw Error('Holes and new axioms are not proofs in this app.');
  let text=source.replace(/--[^\n]*/g,'').trim(),declared=new Set();
  text=text.replace(/^variable\s*\(([^:]+):\s*Prop\s*\)\s*/g,(_,names)=>{names.trim().split(/\s+/).forEach(n=>declared.add(n));return '';});
  const match=text.match(/^example\s*([\s\S]*?)\s*:=\s*by\s*\n([\s\S]+)$/);if(!match)throw Error('Use one example … : conclusion := by, with commands on the following lines.');
  let header=match[1].trim(),p=emptyProof(),env={};
  const parse=s=>{const t=formula(s);function check(n){if(!n.children.length&&!['⊤','⊥'].includes(n.label)&&!declared.has(n.label))throw Error(`Declare ${n.label} with variable (${n.label} : Prop).`);n.children.forEach(check);}check(t);return t;};
  const assume=t=>{p=addAssumption(p,t);return p.nodes.length-1;};
  const step=(rule,parents,options={})=>{p=infer(p,rule,parents,options);return p.nodes.length-1;};
  while(header.startsWith('(')){let depth=0,end=0;for(;end<header.length;end++){if(header[end]==='(')depth++;if(header[end]===')'&&!--depth)break;}
    const binding=header.slice(1,end).match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*([\s\S]+)$/);if(!binding)throw Error('Use named assumptions (h : A).');
    if(binding[1] in env)throw Error('Use distinct assumption names.');env[binding[1]]=assume(parse(binding[2]));header=header.slice(end+1).trim();
  }
  if(!header.startsWith(':'))throw Error('Write : before the conclusion.');const target=parse(header.slice(1));
  const ft=id=>p.nodes[id].formula;
  const expect=(id,t)=>{if(t&&!same(ft(id),t))throw Error(`Expected ${printFormula(t)}, obtained ${printFormula(ft(id))}.`);return id;};
  const arrow=t=>t.label==='¬'?[t.children[0],ast('⊥')]:t.label==='→'?t.children:null;
  function branch(id,antecedent){
    const n=p.nodes[id];if(['impI','notI'].includes(n.rule))return {body:n.parents[0],hypothesis:n.discharge[0]};
    const hypothesis=assume(antecedent);return {body:step(n.formula.label==='¬'?'notE':'impE',[id,hypothesis]),hypothesis};
  }
  function term(t,context,wanted){
    if(t.lambda){const parts=arrow(wanted||ast('?'));if(!parts)throw Error('A function term needs a conditional or negation as its expected type.');const h=assume(parts[0]),body=term(t.body,{...context,[t.lambda]:h},parts[1]);return step(wanted.label==='¬'?'notI':'impI',[body],{discharge:[h]});}
    if(t.name){if(t.name==='True.intro')return expect(step('trueI',[]),wanted);if(!Object.hasOwn(context,t.name))throw Error(`Unknown proof name: ${t.name}.`);return expect(context[t.name],wanted);}
    const [head,...args]=t.items,ctor=head.name;
    const need=n=>{if(args.length!==n)throw Error(`${ctor} needs ${n} argument(s).`);};
    if(['And.intro','Or.inl','Or.inr','Iff.intro'].includes(ctor)){
      const label=ctor.startsWith('And')?'∧':ctor.startsWith('Iff')?'↔':'∨';if(wanted?.label!==label)throw Error(`${ctor} needs an expected ${label} formula.`);
      const [a,b]=wanted.children;
      if(ctor==='And.intro'){need(2);return step('andI',[term(args[0],context,a),term(args[1],context,b)]);}
      if(ctor==='Iff.intro'){need(2);return step('iffI',[term(args[0],context,ast('→',a,b)),term(args[1],context,ast('→',b,a))]);}
      need(1);const left=ctor==='Or.inl';return step(left?'orL':'orR',[term(args[0],context,left?a:b)],{formula:printFormula(left?b:a)});
    }
    const projections={'And.left':'andL','And.right':'andR','Iff.mp':'iffL','Iff.mpr':'iffR'};
    if(projections[ctor]){need(1);return expect(step(projections[ctor],[term(args[0],context)]),wanted);}
    if(ctor==='False.elim'){need(1);if(!wanted)throw Error('False.elim needs a goal.');return step('falseE',[term(args[0],context,ast('⊥'))],{formula:printFormula(wanted)});}
    if(ctor==='Classical.byContradiction'){need(1);if(!wanted)throw Error('Classical.byContradiction needs a goal.');const b=branch(term(args[0],context,ast('¬',ast('¬',wanted))),ast('¬',wanted));return step('raa',[b.body],{discharge:[b.hypothesis]});}
    if(ctor==='Or.elim'){need(3);const d=term(args[0],context);if(ft(d).label!=='∨'||!wanted)throw Error('Or.elim needs a disjunction and a goal.');const branches=args.slice(1).map((a,i)=>branch(term(a,context,ast('→',ft(d).children[i],wanted)),ft(d).children[i]));return step('orE',[d,...branches.map(b=>b.body)],{discharge:branches.map(b=>b.hypothesis)});}
    let f=term(head,context);for(const a of args){const pair=arrow(ft(f));if(!pair)throw Error('Only a conditional or negation can be applied.');const value=term(a,context,pair[0]);f=step(ft(f).label==='¬'?'notE':'impE',[f,value]);}return expect(f,wanted);
  }
  // Each recursive call consumes exactly the commands proving one goal. Bullets mark siblings.
  const lines=[];for(const raw of match[2].split('\n')){const s=raw.trim().replace(/^·\s*/, '');if(!s)continue;if(/^(intro|apply|exact)\b/.test(s)||!lines.length)lines.push(s);else lines[lines.length-1]+=' '+s;}let index=0;
  function prove(goal,context,depth=0){if(depth>100)throw Error('Proof nesting exceeds the teaching limit.');const line=lines[index++];if(!line)throw Error(`Unfinished goal: ${printFormula(goal)}.`);
    if(line.startsWith('intro ')){const names=line.slice(6).trim().split(/\s+/);if(names.length!==1||!/^[A-Za-z_][A-Za-z0-9_]*$/.test(names[0]))throw Error('Use one name per intro line.');const parts=arrow(goal);if(!parts)throw Error('intro requires a conditional or negation.');const h=assume(parts[0]),body=prove(parts[1],{...context,[names[0]]:h},depth+1);return step(goal.label==='¬'?'notI':'impI',[body],{discharge:[h]});}
    if(line.startsWith('exact '))return term(termTree(line.slice(6)),context,goal);
    if(!line.startsWith('apply '))throw Error(`Unsupported command: ${line}. Use intro, apply or exact.`);
    const expr=line.slice(6),pair=goal.children;
    if(expr==='And.intro'||expr==='Iff.intro'){const iff=expr==='Iff.intro';if(goal.label!==(iff?'↔':'∧'))throw Error('Introduction does not match the goal.');const gs=iff?[ast('→',...pair),ast('→',pair[1],pair[0])]:pair;return step(iff?'iffI':'andI',gs.map(g=>prove(g,context,depth+1)));}
    if(expr==='Or.inl'||expr==='Or.inr'){if(goal.label!=='∨')throw Error('Or introduction requires a disjunction.');const left=expr==='Or.inl';return step(left?'orL':'orR',[prove(pair[left?0:1],context,depth+1)],{formula:printFormula(pair[left?1:0])});}
    if(expr==='False.elim')return step('falseE',[prove(ast('⊥'),context,depth+1)],{formula:printFormula(goal)});
    if(expr==='Classical.byContradiction'){const b=branch(prove(ast('¬',ast('¬',goal)),context,depth+1),ast('¬',goal));return step('raa',[b.body],{discharge:[b.hypothesis]});}
    if(expr.startsWith('Or.elim ')){const d=term(termTree(expr.slice(8)),context);if(ft(d).label!=='∨')throw Error('Or.elim requires a disjunction.');const bs=ft(d).children.map(a=>branch(prove(ast('→',a,goal),context,depth+1),a));return step('orE',[d,...bs.map(b=>b.body)],{discharge:bs.map(b=>b.hypothesis)});}
    if(/^(Or\.in[lr]|And\.intro|Iff\.intro|False\.elim)\s/.test(expr))return term(termTree(expr),context,goal);
    const fn=term(termTree(expr),context);if(same(ft(fn),goal))return fn;const parts=arrow(ft(fn));if(!parts||!same(parts[1],goal))throw Error('The applied proof must have the current goal as its conclusion.');return step(ft(fn).label==='¬'?'notE':'impE',[fn,prove(parts[0],context,depth+1)]);
  }
  const root=prove(target,env);if(index!==lines.length)throw Error('Commands remain after the goal was proved.');
  return extractProof(validateProof(p),root);
}
