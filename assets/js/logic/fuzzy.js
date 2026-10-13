import { parseFOL } from './fol-parser.js';
export const fuzzyCurves = {
  IsCold: [[0,1],[10,1],[20,0],[30,0]],
  IsWarm: [[0,0],[10,0],[20,1],[30,0]],
  IsHot: [[0,0],[10,0],[20,0],[30,1]],
  HeatingOn: [[0,1],[10,.7],[20,.3],[30,0]]
};
export function membership(points, x) {
  if (x <= points[0][0]) return points[0][1];
  for (let i=1;i<points.length;i++) if (x<=points[i][0]) {
    const [a,u]=points[i-1],[b,v]=points[i]; return u+(v-u)*(x-a)/(b-a);
  }
  return points.at(-1)[1];
}
export function parseFuzzy(source, names=Object.keys(fuzzyCurves)) {
  const tree=parseFOL(source,{language:{constants:[],functions:{},predicates:Object.fromEntries(names.map(n=>[n,1]))},mode:'conventional'});
  function check(n) {
    if(n.kind==='predicate' && n.children[0].name==='x') return;
    if(n.kind==='connective' && ['¬','∧','∨'].includes(n.name)) {n.children.forEach(check);return;}
    throw Error('Use unary predicates of x with ¬, ∧, and ∨.');
  }
  check(tree);return tree;
}
// Min/max of piecewise linear functions can introduce new corners between
// their original knots. Include those intersections before checking a rule.
export function combineCurves(a,b,op) {
  const xs=[...new Set([...a,...b].map(p=>p[0]))].sort((x,y)=>x-y), extra=[];
  for(let i=1;i<xs.length;i++) {
    const l=xs[i-1],r=xs[i],dl=membership(a,l)-membership(b,l),dr=membership(a,r)-membership(b,r);
    if(dl*dr<0) extra.push(l+(r-l)*dl/(dl-dr));
  }
  return [...xs,...extra].sort((x,y)=>x-y).map(x=>[x,op(membership(a,x),membership(b,x))]);
}
export function formulaCurve(tree, curves) {
  if(tree.kind==='predicate')return curves[tree.name];
  const a=formulaCurve(tree.children[0],curves);
  if(tree.name==='¬')return a.map(([x,y])=>[x,1-y]);
  return combineCurves(a,formulaCurve(tree.children[1],curves),tree.name==='∧'?Math.min:Math.max);
}
export function parseRule(source, names) {
  const parts=source.split(/⟹|⇒|=>/).map(s=>s.trim());
  if(parts.length!==2)throw Error('Write a rule as A(x) ⇒ B(x).');
  return parts.map(s=>parseFuzzy(s,names));
}
export function checkRule(rule,curves) {
  const [a,b]=rule.map(t=>formulaCurve(t,curves));
  const xs=[...new Set([...a,...b].map(p=>p[0]))];
  const rows=xs.map(x=>({x,a:membership(a,x),b:membership(b,x)}));
  const worst=rows.reduce((p,q)=>q.a-q.b>p.a-p.b?q:p);
  return {...worst,valid:worst.a-worst.b<1e-9};
}
export function parseController(source, names=['IsCold','IsWarm','IsHot']) {
  const lines=source.trim().split('\n').filter(s=>s.trim());
  if(!lines.length||lines.length>8)throw Error('Use one to eight rules.');
  return lines.map(line=>{
    const parts=line.split(/⟹|⇒|↦|=>/).map(s=>s.trim());
    if(parts.length!==2||!parts[1])throw Error('Write each rule as A(x) ↦ a number from 0 to 1.');
    const output=Number(parts[1]);
    if(!Number.isFinite(output)||output<0||output>1)throw Error('Each heater setting must be between 0 and 1.');
    return {source:parts[0],tree:parseFuzzy(parts[0],names),output};
  });
}
export function control(rules,curves,x) {
  const rows=rules.map(r=>({...r,weight:membership(formulaCurve(r.tree,curves),x)}));
  const total=rows.reduce((s,r)=>s+r.weight,0);
  return {rows,total,output:total?rows.reduce((s,r)=>s+r.weight*r.output,0)/total:0};
}

// Each predicate interprets a real-valued measurement in its own units.
export const airconCurves={
  IsWarm:[[16,0],[18,0],[28,1],[36,1]],
  IsHot:[[16,0],[26,0],[36,1]],
  IsHumid:[[0,0],[40,0],[80,1],[100,1]]
};
export const coolingSets={
  Low:[[0,1],[.35,0],[1,0]],
  Medium:[[0,0],[.3,0],[.65,1],[1,0]],
  High:[[0,0],[.65,0],[1,1]]
};
export function centroid(points){
  let area=0,moment=0;
  for(let i=1;i<points.length;i++){
    const [a,u]=points[i-1],[b,v]=points[i],dx=b-a;
    area+=dx*(u+v)/2;moment+=dx*((2*a+b)*u+(a+2*b)*v)/6;
  }
  return {area,output:area?moment/area:0};
}
// Mamdani's last steps for one weight per output set: clip each set at its
// weight, combine the clipped sets by maximum, and find the balance point of
// the area under the result, from evenly spaced samples and exactly.
export function defuzzify(weights,step=.1){
  const clipped=Object.keys(coolingSets).map(name=>combineCurves(coolingSets[name],[[0,weights[name]??0],[1,weights[name]??0]],Math.min));
  const aggregate=clipped.reduce((a,b)=>combineCurves(a,b,Math.max));
  const count=Math.round(1/step),samples=Array.from({length:count+1},(_,i)=>{const p=i/count;return [p,membership(aggregate,p)];});
  const total=samples.reduce((sum,[,height])=>sum+height,0),moment=samples.reduce((sum,[p,height])=>sum+p*height,0);
  return {clipped,aggregate,samples,total,moment,approximate:total?moment/total:0,exact:centroid(aggregate).output};
}
export const airconDefaults={
  sugeno:'IsWarm(x) ∧ IsHumid(y) ↦ 0.7\nIsHot(x) ↦ 1\n¬IsHot(x) ∧ ¬(IsWarm(x) ∧ IsHumid(y)) ↦ 0',
  mamdani:'IsWarm(x) ∧ IsHumid(y) ↦ Medium\nIsHot(x) ↦ High\n¬IsHot(x) ∧ ¬(IsWarm(x) ∧ IsHumid(y)) ↦ Low'
};
export function parseAirconRules(source,mode='sugeno'){
  if(!['sugeno','mamdani'].includes(mode))throw Error('Choose Sugeno or Mamdani.');
  const lines=source.trim().split('\n').filter(s=>s.trim());
  if(!lines.length||lines.length>8)throw Error('Use one to eight rules.');
  const language={constants:[],functions:{},predicates:{IsWarm:1,IsHot:1,IsHumid:1}};
  function check(n){
    if(n.kind==='predicate'){
      const variable=n.name==='IsHumid'?'y':'x';
      if(n.children[0].kind==='variable'&&n.children[0].name===variable)return;
      throw Error(`Use ${n.name}(${variable}): x is temperature; y is humidity.`);
    }
    if(n.kind==='connective'&&['¬','∧','∨'].includes(n.name)){n.children.forEach(check);return;}
    throw Error('Combine IsWarm(x), IsHot(x), and IsHumid(y) with ¬, ∧, or ∨.');
  }
  return lines.map(line=>{
    const parts=line.split(/⟹|⇒|↦|=>/).map(s=>s.trim());
    if(parts.length!==2||!parts[1])throw Error('Write each rule as a condition ↦ an output.');
    const tree=parseFOL(parts[0],{language,mode:'conventional'});check(tree);
    if(mode==='mamdani'){
      const set=Object.keys(coolingSets).find(k=>k.toLowerCase()===parts[1].toLowerCase());
      if(!set)throw Error('Use Low, Medium, or High as the Mamdani output.');
      return {source:parts[0],tree,set};
    }
    const output=Number(parts[1]);
    if(!Number.isFinite(output)||output<0||output>1)throw Error('Use a Sugeno output between 0 and 1.');
    return {source:parts[0],tree,output};
  });
}
const defaultAirconRules=Object.fromEntries(Object.entries(airconDefaults).map(([mode,source])=>[mode,parseAirconRules(source,mode)]));
function airconDegree(tree,values){
  if(tree.kind==='predicate'){const weight=values[tree.name];return {weight,calculation:String(Math.round(weight*100)/100)};}
  const a=airconDegree(tree.children[0],values);
  if(tree.name==='¬')return {weight:1-a.weight,calculation:`(1 − ${a.calculation})`};
  const b=airconDegree(tree.children[1],values),op=tree.name==='∧'?'min':'max';
  return {weight:Math[op](a.weight,b.weight),calculation:`${op}(${a.calculation}, ${b.calculation})`};
}
export function aircon(temperature,humidity,rules=defaultAirconRules){
  if(!Number.isFinite(temperature)||!Number.isFinite(humidity)||temperature<16||temperature>36||humidity<0||humidity>100)throw Error('Use 16–36°C and 0–100% relative humidity.');
  const warm=membership(airconCurves.IsWarm,temperature),hot=membership(airconCurves.IsHot,temperature),humid=membership(airconCurves.IsHumid,humidity);
  const values={IsWarm:warm,IsHot:hot,IsHumid:humid};
  const evaluate=rs=>rs.map(r=>({...r,...airconDegree(r.tree,values)}));
  const rows=evaluate(rules.sugeno),mamdaniRows=evaluate(rules.mamdani);
  const total=rows.reduce((s,r)=>s+r.weight,0),sugeno=total?rows.reduce((s,r)=>s+r.weight*r.output,0)/total:0;
  const clipped=mamdaniRows.map(r=>combineCurves(coolingSets[r.set],[[0,r.weight],[1,r.weight]],Math.min));
  const aggregate=clipped.reduce((a,b)=>combineCurves(a,b,Math.max));
  return {warm,hot,humid,rows,mamdaniRows,total,sugeno,clipped,aggregate,mamdani:centroid(aggregate)};
}
