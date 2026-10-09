// A deliberately bounded Lean teaching language, not a Lean evaluator.
import {ast,formula,same,printFormula,emptyProof,addAssumption,infer,validateProof,extractProof} from './deduction.js';
import {leanPrint,folDeclarations,parseLeanFOL} from './fol-lean.js';
import {isFOL,freeND,substND,equalityTemplate} from './deduction-fol.js';
import {parseInference,freeVariables,printFOL} from './fol-inference.js';
import {isVariable} from './fol-parser.js';
const leanFormula=leanPrint;
export function toLean(data,root=data.nodes.length-1){return renderLean(validateProof(data),root);}
// Drafts contain explicit holes and never enter the checked-proof import path.
export function renderLeanDraft(data,root){return '-- Unfinished derivation: sorry marks an open goal.\n'+renderLean(data,root);}
function renderLean(p,root){
  const n=p.nodes[root];if(!n)throw Error('Select a conclusion.');
  const fol=p.nodes.some(n=>isFOL(printFormula(n.formula)));
  const names=new Set();const scan=t=>{if(!t.children.length&&!['⊥','⊤'].includes(t.label))names.add(t.label);t.children.forEach(scan);};
  p.nodes.forEach(n=>scan(n.formula));
  if(!fol&&[...names].some(s=>!/^[A-Za-z][A-Za-z0-9_]*$/.test(s)||['Prop','False','True','fun','by','example','variable'].includes(s)||/^h\d+$/.test(s)))throw Error('For Lean export, use ordinary atom names such as RAIN, A or B, without subscripts or reserved names h0, h1, … .');
  let visits=0,serial=0;
  function tactics(id,indent='  '){
    if(++visits>4000)throw Error('Export a smaller derivation.');
    const v=p.nodes[id],line=s=>indent+s,child=(i,extra='')=>tactics(v.parents[i],indent+extra);
    const have=i=>{const name='step'+serial++;return {name,code:line(`have ${name} : ${leanFormula(p.nodes[v.parents[i]].formula)} := by`)+'\n'+child(i,'  ')};};
    const join=(...xs)=>xs.join('\n');
    switch(v.rule){
      case 'assumption':return line('exact h'+id);
      case 'hole':return line('exact (show '+leanFormula(v.formula)+' from sorry)');
      case 'forallI':return join(line('intro '+v.variable),child(0));
      case 'impI':case 'notI':return join(line('intro h'+v.discharge[0]),child(0));
      case 'andI':case 'iffI':return join(line('apply '+(v.rule==='andI'?'And':'Iff')+'.intro'),...v.parents.map((_,i)=>line('· ')+child(i,'  ').slice(indent.length+2)));
      case 'orL':case 'orR':return join(line('apply Or.'+(v.rule==='orL'?'inl':'inr')),child(0));
      case 'raa':return join(line('apply Classical.byContradiction'),line('intro h'+v.discharge[0]),child(0));
      case 'trueI':return line('exact True.intro');
      case 'eqI':return line('rfl');
      case 'falseE':return join(line('apply False.elim'),child(0));
      case 'existsI':return join(line('apply Exists.intro '+leanPrint({label:v.term,children:[]})),child(0));
      case 'existsE':{const h=have(0);return join(h.code,line('apply Exists.elim '+h.name),line(`intro ${v.variable} h${v.discharge[0]}`),child(1));}
      case 'orE':{const h=have(0);return join(h.code,line('apply Or.elim '+h.name),...v.parents.slice(1).map((_,i)=>join(line('· intro h'+v.discharge[i]),child(i+1,'  '))));}
      case 'forallE':{const h=have(0);return join(h.code,line('exact '+h.name+' '+leanPrint({label:v.term,children:[]})));}
      case 'impE':case 'notE':{const h=have(0);return join(h.code,line('apply '+h.name),child(1));}
      case 'eqE':{const h=have(0),a=have(1),motive='property'+serial++;return join(h.code,a.code,line(`let ${motive} (${v.variable} : Domain) : Prop := ${leanFormula(formula(v.extra))}`),line(`exact Eq.subst (motive := ${motive}) ${h.name} ${a.name}`));}
      default:{const ctor={andL:'And.left',andR:'And.right',iffL:'Iff.mp',iffR:'Iff.mpr'}[v.rule];if(!ctor)throw Error('Unsupported rule.');const h=have(0);return join(h.code,line(`exact ${ctor} ${h.name}`));}
    }
  }
  return (fol?folDeclarations(p.nodes.map(n=>n.formula),printFormula,[...new Set(p.nodes.flatMap(n=>[...freeND(n.formula),...(n.term?freeVariables(parseInference(n.term,'term')):[])]))],p.nodes.flatMap(n=>n.term?[n.term]:[])):(names.size?`variable (${[...names].join(' ')} : Prop)\n\n`:''))+`example ${n.open.map(id=>`(h${id} : ${leanFormula(p.nodes[id].formula)})`).join(' ')} : ${leanFormula(n.formula)} := by\n${tactics(root)}\n`;
}
function termTree(text){
  text=text.replace(/\(default\s*:\s*Domain\)/g,'default');
  const tokens=text.match(/=>|[()]|[A-Za-z_][A-Za-z0-9_.]*|\S/g)||[];let pos=0;
  function expr(){if(tokens[pos]==='fun'){pos++;const name=tokens[pos++];if(tokens[pos++]!=='=>')throw Error('Use fun name => term.');return {lambda:name,body:expr()};}
    const items=[];while(pos<tokens.length&&tokens[pos]!==')'){if(tokens[pos]==='('){pos++;items.push(expr());if(tokens[pos++]!==')')throw Error('Unmatched term brackets.');}else items.push({name:tokens[pos++]});}
    if(!items.length)throw Error('Missing proof term.');return items.length===1?items[0]:{items};
  }
  const t=expr();if(pos!==tokens.length)throw Error('Unexpected term bracket.');return t;
}
export function fromLean(source){
  source=source.replace(/\bTerm\b/g,'Domain'); // Read older saved teaching examples too.
  if(source.length>16000)throw Error('Use at most 16000 characters.');
  if(/\b(sorry|admit|axiom|unsafe)\b/.test(source))throw Error('Holes and new axioms are not proofs in this app.');
  let text=source.replace(/--[^\n]*/g,'').trim(),declared=new Set();
  const language={constants:[],functions:{},predicates:{},props:declared};let fol=false,inhabited=false;
  text=text.replace(/^variable[^\n]*\n?/gm,line=>{if(line.includes('[Inhabited Domain]')){inhabited=true;language.constants.push('default');}if(/\[(?!Inhabited Domain\])/.test(line))throw Error('Only [Inhabited Domain] is supported.');for(const match of line.matchAll(/\(([^:()]+):\s*([^()]+)\)/g)){
    const names=match[1].trim().split(/\s+/),type=match[2].trim().replace(/\s+/g,' ');
    if(type==='Type'){if(names.join(' ')!=='Domain')throw Error('Use Domain : Type in this teaching app.');fol=true;continue;}
    if(type==='Prop'){names.forEach(n=>declared.add(n));continue;}
    const parts=type.split(/\s*→\s*/);if(parts.slice(0,-1).some(t=>t!=='Domain')||!['Domain','Prop'].includes(parts.at(-1)))throw Error('Unsupported declaration.');
    names.forEach(n=>{if(parts.length===1)language.constants.push(n);else (parts.at(-1)==='Prop'?language.predicates:language.functions)[n]=parts.length-1;});fol=true;
  }return '';});
  text=text.replace(/^variable\s*\(([^:]+):\s*Prop\s*\)\s*/g,(_,names)=>{names.trim().split(/\s+/).forEach(n=>declared.add(n));return '';});
  text=text.trim();
  const match=text.match(/^example\s*([\s\S]*?)\s*:=\s*by\s*\n([\s\S]+)$/);if(!match)throw Error('Use one example … : conclusion := by, with commands on the following lines.');
  let header=match[1].trim(),p=emptyProof(),env={};
  const parse=s=>{if(fol)return parseLeanFOL(s,language);const t=formula(s);function check(n){if(!n.children.length&&!['⊤','⊥'].includes(n.label)&&!declared.has(n.label))throw Error(`Declare ${n.label} with variable (${n.label} : Prop).`);n.children.forEach(check);}check(t);return t;};
  const assume=t=>{p=addAssumption(p,t);return p.nodes.length-1;};
  const step=(rule,parents,options={})=>{p=infer(p,rule,parents,options);return p.nodes.length-1;};
  while(header.startsWith('(')){let depth=0,end=0;for(;end<header.length;end++){if(header[end]==='(')depth++;if(header[end]===')'&&!--depth)break;}
    const binding=header.slice(1,end).match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*([\s\S]+)$/);if(!binding)throw Error('Use named assumptions (h : A).');
    if(binding[2].trim()==='Domain'){language.constants.push(binding[1]);header=header.slice(end+1).trim();continue;}
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
  function object(t,context){
    if(t.name){if(!context?.$objects?.has(t.name)&&!language.constants.includes(t.name))throw Error('Unknown object '+t.name);return t.name;}
    const [head,...args]=t.items||[];if(language.functions[head?.name]!==args.length)throw Error('Unknown function or wrong arity.');return `${head.name}(${args.map(a=>object(a,context)).join(', ')})`;
  }
  function term(t,context,wanted){
    if(t.lambda&&wanted?.label.startsWith('∀')){
      if(!isVariable(t.lambda))throw Error('Use a bound object variable x, y, z, u, v or w.');
      const bodyGoal=substND(wanted.children[0],wanted.label.slice(1),parseInference(t.lambda,'term'));
      const body=term(t.body,{...context,$objects:new Set([...(context.$objects||[]),t.lambda])},bodyGoal);return expect(step('forallI',[body],{variable:t.lambda}),wanted);
    }
    if(t.lambda){const parts=arrow(wanted||ast('?'));if(!parts)throw Error('A function term needs a conditional or negation as its expected type.');const h=assume(parts[0]),body=term(t.body,{...context,[t.lambda]:h},parts[1]);return step(wanted.label==='¬'?'notI':'impI',[body],{discharge:[h]});}
    if(t.name){if(t.name==='True.intro')return expect(step('trueI',[]),wanted);if(!Object.hasOwn(context,t.name))throw Error(`Unknown proof name: ${t.name}.`);return expect(context[t.name],wanted);}
    const [head,...args]=t.items,ctor=head.name;
    const need=n=>{if(args.length!==n)throw Error(`${ctor} needs ${n} argument(s).`);};
    if(ctor==='Eq.subst'){need(2);if(!wanted)throw Error('Equality substitution needs a goal.');const e=term(args[0],context),a=term(args[1],context),template=equalityTemplate(ft(e),ft(a),wanted);return step('eqE',[e,a],template);}
    if(ctor==='Exists.intro'){need(2);if(!wanted?.label.startsWith('∃'))throw Error('Exists.intro needs an existential goal.');const witness=object(args[0],context),instance=substND(wanted.children[0],wanted.label.slice(1),parseInference(witness,'term'));return step('existsI',[term(args[1],context,instance)],{term:witness,formula:printFormula(wanted)});}
    if(ctor==='Exists.elim'){need(2);const d=term(args[0],context),branch=args[1];if(!ft(d).label.startsWith('∃')||!wanted||!branch.lambda||!branch.body?.lambda)throw Error('Use Exists.elim h (fun z => (fun hz => proof)).');const v=branch.lambda,h=assume(substND(ft(d).children[0],ft(d).label.slice(1),parseInference(v,'term'))),body=term(branch.body.body,{...context,[branch.body.lambda]:h,$objects:new Set([...(context.$objects||[]),v])},wanted);return step('existsE',[d,body],{variable:v,discharge:[h]});}
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
    let f=term(head,context);for(const a of args){if(ft(f).label.startsWith('∀')){f=step('forallE',[f],{term:object(a,context)});continue;}const pair=arrow(ft(f));if(!pair)throw Error('Only a conditional or negation can be applied.');const value=term(a,context,pair[0]);f=step(ft(f).label==='¬'?'notE':'impE',[f,value]);}return expect(f,wanted);
  }
  // Each recursive call consumes exactly the commands proving one goal. Bullets mark siblings.
  const lines=[];for(const raw of match[2].split('\n')){const s=raw.trim().replace(/^·\s*/, '');if(!s)continue;if(/^(intro|apply|exact|have|rfl|let)\b/.test(s)||!lines.length)lines.push(s);else lines[lines.length-1]+=' '+s;}let index=0;
  function prove(goal,context,depth=0){if(depth>100)throw Error('Proof nesting exceeds the teaching limit.');const line=lines[index++];if(!line)throw Error(`Unfinished goal: ${printFormula(goal)}.`);
    if(line.startsWith('let ')){const m=line.match(/^let ([A-Za-z][A-Za-z0-9_]*) \(([xyzuvw][0-9]*) : Domain\) : Prop := (.+)$/);if(!m)throw Error('Use let property (x : Domain) : Prop := formula.');const lang={...language,constants:[...language.constants,...(context.$objects||[]),m[2]]},template=parseLeanFOL(m[3],lang);return prove(goal,{...context,$motives:{...context.$motives,[m[1]]:{variable:m[2],formula:printFormula(template)}}},depth+1);}
    const transport=line.match(/^exact Eq\.subst \(motive := ([A-Za-z][A-Za-z0-9_]*)\) ([A-Za-z][A-Za-z0-9_]*) ([A-Za-z][A-Za-z0-9_]*)$/);
    if(transport){const motive=context.$motives?.[transport[1]];if(!motive)throw Error('Declare the substitution formula before using it.');return expect(step('eqE',[term({name:transport[2]},context),term({name:transport[3]},context)],motive),goal);}
    if(line==='rfl'){if(!goal.label.includes('='))throw Error('rfl requires an identity goal.');const eq=parseInference(printFormula(goal));if(eq.kind!=='identity'||printFOL(eq.children[0])!==printFOL(eq.children[1]))throw Error('Reflexivity requires identical terms.');return step('eqI',[],{term:printFOL(eq.children[0])});}
    if(line.startsWith('have ')){const m=line.match(/^have ([A-Za-z][A-Za-z0-9_]*) : (.+) := by$/);if(!m)throw Error('Use have name : formula := by.');const lang={...language,constants:[...language.constants,...(context.$objects||[])]},type=fol?parseLeanFOL(m[2],lang):parse(m[2]);const id=prove(type,context,depth+1);return prove(goal,{...context,[m[1]]:id},depth+1);}
    if(line.startsWith('intro ')){const names=line.slice(6).trim().split(/\s+/);if(names.length!==1||!/^[A-Za-z_][A-Za-z0-9_]*$/.test(names[0]))throw Error('Use one name per intro line.');if(goal.label.startsWith('∀')){const v=names[0];if(!isVariable(v))throw Error('Use x, y, z, u, v or w as the object variable.');const body=prove(substND(goal.children[0],goal.label.slice(1),parseInference(v,'term')),{...context,$objects:new Set([...(context.$objects||[]),v])},depth+1);return expect(step('forallI',[body],{variable:v}),goal);}const parts=arrow(goal);if(!parts)throw Error('intro requires a conditional or negation.');const h=assume(parts[0]),body=prove(parts[1],{...context,[names[0]]:h},depth+1);return step(goal.label==='¬'?'notI':'impI',[body],{discharge:[h]});}
    if(line.startsWith('exact '))return term(termTree(line.slice(6)),context,goal);
    if(!line.startsWith('apply '))throw Error(`Unsupported command: ${line}. Use intro, apply or exact.`);
    const expr=line.slice(6),pair=goal.children;
    if(expr==='And.intro'||expr==='Iff.intro'){const iff=expr==='Iff.intro';if(goal.label!==(iff?'↔':'∧'))throw Error('Introduction does not match the goal.');const gs=iff?[ast('→',...pair),ast('→',pair[1],pair[0])]:pair;return step(iff?'iffI':'andI',gs.map(g=>prove(g,context,depth+1)));}
    if(expr==='Or.inl'||expr==='Or.inr'){if(goal.label!=='∨')throw Error('Or introduction requires a disjunction.');const left=expr==='Or.inl';return step(left?'orL':'orR',[prove(pair[left?0:1],context,depth+1)],{formula:printFormula(pair[left?1:0])});}
    if(expr.startsWith('Exists.intro ')){if(!goal.label.startsWith('∃'))throw Error('An existential goal is required.');const witness=object(termTree(expr.slice(13)),context),instance=substND(goal.children[0],goal.label.slice(1),parseInference(witness,'term'));return step('existsI',[prove(instance,context,depth+1)],{term:witness,formula:printFormula(goal)});}
    if(expr.startsWith('Exists.elim ')){const d=term(termTree(expr.slice(12)),context);if(!ft(d).label.startsWith('∃'))throw Error('An existential premise is required.');const line=lines[index++]||'',m=line.match(/^intro ([xyzuvw][0-9]*) ([A-Za-z_][A-Za-z0-9_]*)$/);if(!m)throw Error('Follow Exists.elim with intro z hz.');const h=assume(substND(ft(d).children[0],ft(d).label.slice(1),parseInference(m[1],'term'))),body=prove(goal,{...context,[m[2]]:h,$objects:new Set([...(context.$objects||[]),m[1]])},depth+1);return step('existsE',[d,body],{variable:m[1],discharge:[h]});}
    if(expr==='False.elim')return step('falseE',[prove(ast('⊥'),context,depth+1)],{formula:printFormula(goal)});
    if(expr==='Classical.byContradiction'){const b=branch(prove(ast('¬',ast('¬',goal)),context,depth+1),ast('¬',goal));return step('raa',[b.body],{discharge:[b.hypothesis]});}
    if(expr.startsWith('Or.elim ')){const d=term(termTree(expr.slice(8)),context);if(ft(d).label!=='∨')throw Error('Or.elim requires a disjunction.');const bs=ft(d).children.map(a=>branch(prove(ast('→',a,goal),context,depth+1),a));return step('orE',[d,...bs.map(b=>b.body)],{discharge:bs.map(b=>b.hypothesis)});}
    if(/^(Or\.in[lr]|And\.intro|Iff\.intro|False\.elim)\s/.test(expr))return term(termTree(expr),context,goal);
    const fn=term(termTree(expr),context);if(same(ft(fn),goal))return fn;const parts=arrow(ft(fn));if(!parts||!same(parts[1],goal))throw Error('The applied proof must have the current goal as its conclusion.');return step(ft(fn).label==='¬'?'notE':'impE',[fn,prove(parts[0],context,depth+1)]);
  }
  const root=prove(target,env);if(index!==lines.length)throw Error('Commands remain after the goal was proved.');
  return extractProof(validateProof(p),root);
}
