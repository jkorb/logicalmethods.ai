import {parseInference,printFOL,substitute,freeVariables} from './fol-inference.js';
export function fromFOL(t){
  if(t.kind==='quantifier')return {label:t.name+t.variable,children:[fromFOL(t.children[0])]};
  if(t.kind==='connective')return {label:t.name,children:t.children.map(fromFOL)};
  return {label:printFOL(t),children:[]};
}
export function printND(t){
  if(!t.children.length)return t.label;
  if(/^[∀∃]/u.test(t.label))return `${t.label} ${printND(t.children[0])}`;
  if(t.label==='¬')return '¬'+printND(t.children[0]);
  return '('+t.children.map(printND).join(' '+t.label+' ')+')';
}
export const isFOL=s=>/[∀∃=]|[A-Za-z][A-Za-z0-9_]*\s*\(|\b[A-Z](?:[xyzuvw][0-9₀₁₂₃₄₅₆₇₈₉]*)+\b/u.test(s);
export function freeND(t){
  if(/^[∀∃]/u.test(t.label))return freeND(t.children[0]).filter(v=>v!==t.label.slice(1));
  if(t.children.length)return [...new Set(t.children.flatMap(freeND))];
  return isFOL(t.label)?freeVariables(parseInference(t.label)):[];
}
export function substND(t,v,term){
  if(/^[∀∃]/u.test(t.label)){
    if(t.label.slice(1)===v)return t;
    if(freeND(t.children[0]).includes(v)&&freeVariables(term).includes(t.label.slice(1)))throw Error('Substitution would capture a variable; rename the bound variable first.');
    return {...t,children:[substND(t.children[0],v,term)]};
  }
  if(t.children.length)return {...t,children:t.children.map(c=>substND(c,v,term))};
  return isFOL(t.label)?fromFOL(substitute(parseInference(t.label),{[v]:term})):t;
}

// Recover the substitution formula from the source and target of Eq.subst.
// The kernel subsequently checks both instances and all capture conditions.
export function equalityTemplate(eq,source,target){
  const identity=parseInference(eq.label);if(identity.kind!=='identity')throw Error('Use an identity proof for equality substitution.');
  const [left,right]=identity.children;let v='w99';const occupied=printND(source)+' '+printND(target)+' '+eq.label;
  while(occupied.includes(v))v+='9';
  function terms(a,b){
    if(printFOL(a)===printFOL(left)&&printFOL(b)===printFOL(right))return {kind:'variable',name:v,label:v,children:[]};
    if(a.kind!==b.kind||a.name!==b.name||a.children.length!==b.children.length)throw Error('The equality does not justify this substitution.');
    return {...a,children:a.children.map((c,i)=>terms(c,b.children[i]))};
  }
  function formulas(a,b){
    if(a.children.length){if(a.label!==b.label||a.children.length!==b.children.length)throw Error('Equality substitution must preserve logical structure.');return {...a,children:a.children.map((c,i)=>formulas(c,b.children[i]))};}
    if(!isFOL(a.label)&&a.label===b.label)return a;
    return fromFOL(terms(parseInference(a.label),parseInference(b.label)));
  }
  return {variable:v,formula:printND(formulas(source,target))};
}

// Keep the propositional canvas grammar, using the shared FOL parser for atoms
// and terms. This also permits ⊥ and propositional letters inside FOL proofs.
export function parseNDSource(source,depth=0){
  if(depth>48||source.length>512)throw Error('Use at most 512 characters and 48 nested formulas.');
  const s=source.trim();let level=0,encloses=s.startsWith('(');const ops=[];
  for(let i=0;i<s.length;i++){
    if(s[i]==='(')level++;
    if(s[i]===')'){level--;if(!level&&i<s.length-1)encloses=false;}
    if(level<0)throw Error('Unmatched brackets.');
    if(!level&&'∧∨→↔'.includes(s[i]))ops.push(i);
  }
  if(level)throw Error('Unmatched brackets.');
  for(const op of ['↔','→','∨','∧']){const places=ops.filter(i=>s[i]===op);if(places.length){if(op==='↔'&&places.length>1)throw Error('Bracket repeated ↔ explicitly.');const i=op==='→'?places[0]:places.at(-1);return {label:op,children:[parseNDSource(s.slice(0,i),depth+1),parseNDSource(s.slice(i+1),depth+1)]};}}
  if(encloses)return parseNDSource(s.slice(1,-1),depth+1);
  if(s.startsWith('¬'))return {label:'¬',children:[parseNDSource(s.slice(1),depth+1)]};
  const q=s.match(/^([∀∃])\s*([xyzuvw][0-9₀₁₂₃₄₅₆₇₈₉]*)\s*([\s\S]+)$/u);
  if(q)return {label:q[1]+q[2],children:[parseNDSource(q[3],depth+1)]};
  // Compact teaching notation: Rxy means R(x, y), never a nullary atom.
  const compact=s.match(/^([A-Z])((?:[xyzuvw][0-9₀₁₂₃₄₅₆₇₈₉]*)+)$/u);
  if(compact)return fromFOL(parseInference(compact[1]+'('+compact[2].match(/[xyzuvw][0-9₀₁₂₃₄₅₆₇₈₉]*/gu).join(', ')+')'));
  if(/^[A-Za-z][A-Za-z0-9_₀₁₂₃₄₅₆₇₈₉]*$/u.test(s))return {label:s==='BOTTOM'?'⊥':s==='TOP'?'⊤':s,children:[]};
  return fromFOL(parseInference(s));
}
