import {parseBoolean} from './boolean.js';
import {membership,parseRule,checkRule,combineCurves,centroid} from './fuzzy.js';
export const triples=[];
for(const x of [0,.5,1])for(const y of [0,.5,1])for(const z of [0,.5,1])triples.push([x,y,z]);
const sqlValue=v=>v===.5?'NULL':v;
export const practiceSQL=`CREATE TABLE Valuations (SUN INTEGER, RAIN INTEGER, WIND INTEGER);\nINSERT INTO Valuations VALUES ${triples.map(row=>'('+row.map(sqlValue).join(', ')+')').join(',\n')};\nCREATE TABLE ValueTriples (X INTEGER, Y INTEGER, Z INTEGER);\nINSERT INTO ValueTriples SELECT SUN, RAIN, WIND FROM Valuations;`;
export function expression(source){return parseBoolean(source.replace(/\b0\b/g,'ZERO').replace(/\b1\b/g,'ONE')).tree;}
export function degree(tree,v,conditional='lukasiewicz'){
 if(!tree.children.length)return tree.label==='ZERO'?0:tree.label==='ONE'?1:v[tree.label];
 const [a,b]=tree.children.map(c=>degree(c,v,conditional));
 return {'¬':()=>1-a,'∧':()=>Math.min(a,b),'∨':()=>Math.max(a,b),'→':()=>conditional==='k3'?Math.max(1-a,b):Math.min(1,1-a+b)}[tree.label]();
}
export const inferenceLevels=[
 {premises:['RAIN ∨ (RAIN ∧ SUN)'],goal:'SUN'},
 {premises:['SUN'],goal:'RAIN ∧ ¬RAIN'},
 {premises:['SUN','¬SUN'],goal:'RAIN'},
 {premises:['RAIN ∧ ¬SUN'],goal:'¬(¬RAIN ∨ SUN)'},
 {premises:['WIND'],goal:'¬(RAIN ∧ ¬RAIN)'},
 {premises:['RAIN'],goal:'RAIN ∨ ¬RAIN'}
];
const families=[
 ['Associativity','X ∧ (Y ∧ Z)','(X ∧ Y) ∧ Z'],
 ['Commutativity','X ∧ Y','Y ∧ X'],
 ['Absorption','X ∧ (X ∨ Y)','X'],
 ['Distributivity','X ∧ (Y ∨ Z)','(X ∧ Y) ∨ (X ∧ Z)'],
 ['Identity','X ∧ 1','X'],['Domination','X ∧ 0','0'],
 ['De Morgan','¬(X ∧ Y)','¬X ∨ ¬Y'],
 ['Kleene condition','(X ∧ ¬X) ∧ (Y ∨ ¬Y)','X ∧ ¬X']
];
const dual=s=>s.replace(/[∧∨01]/g,c=>({'∧':'∨','∨':'∧','0':'1','1':'0'}[c]));
export const lawLevels=families.flatMap(([label,left,right])=>[{label,left,right},{label:label+' (dual)',left:dual(left),right:dual(right)}]);
lawLevels.push({label:'Involution',left:'¬¬X',right:'X'},{label:'Test a failed identity',left:'X ∨ ¬X',right:'1'});
export function sqlAnswer(item,kind){
 return triples.filter(row=>{
  const v=Object.fromEntries((kind==='inference'?['SUN','RAIN','WIND']:['X','Y','Z']).map((k,i)=>[k,row[i]]));
  return kind==='inference'?item.premises.every(f=>degree(expression(f),v,'k3')===1)&&degree(expression(item.goal),v,'k3')!==1:degree(expression(item.left),v,'k3')!==degree(expression(item.right),v,'k3');
 }).map(row=>row.map(n=>n===.5?null:n));
}
export function sqlExpression(tree){
 if(!tree.children.length)return {ZERO:'0',ONE:'1'}[tree.label]||tree.label;
 const [a,b]=tree.children.map(sqlExpression);return tree.label==='¬'?`(NOT ${a})`:`(${a} ${tree.label==='∧'?'AND':'OR'} ${b})`;
}
export function sqlSolution(item,kind){
 const f=s=>sqlExpression(expression(s));
 return kind==='inference'?`SELECT SUN, RAIN, WIND FROM Valuations\nWHERE ${[...item.premises.map(p=>`${f(p)} IS TRUE`),`${f(item.goal)} IS NOT TRUE`].join('\n  AND ')};`:`SELECT X, Y, Z FROM ValueTriples\nWHERE ${f(item.left)} IS NOT ${f(item.right)};`;
}
export const counterLevels=[
 {label:'Modus ponens',premises:['A','A → B'],goal:'B'},
 {label:'Disjunctive syllogism',premises:['¬A','A ∨ B'],goal:'B'},
 {label:'Explosion',premises:['A','¬A'],goal:'B'},
 {label:'Affirming the consequent',premises:['A → B','B'],goal:'A'},
 {label:'Denying the antecedent',premises:['A → B','¬A'],goal:'¬B'},
 {label:'Excluded middle',premises:[],goal:'A ∨ ¬A'}
];
export function counterexample(item,v){
 if(!['A','B'].every(k=>Number.isFinite(v[k])&&v[k]>=0&&v[k]<=1))throw Error('Use degrees between 0 and 1.');
 const premises=item.premises.map(f=>degree(expression(f),v)),bound=Math.min(1,...premises),conclusion=degree(expression(item.goal),v);
 return {premises,bound,conclusion,correct:bound>conclusion+1e-9};
}
export const speeds=[0,40,80,120];
export const curveLevels=[
 {prompt:'Make Fast increase from 0 at 0 km/h to 1 at 120 km/h, and Slow decrease from 1 to 0.',kind:'endpoints'},
 {prompt:'Keep those endpoints and make Fast the exact complement of Slow at every speed.',kind:'complement'},
 {prompt:'Keep the endpoints and complement relation. Throughout the gray band (40–80 km/h), both degrees must lie between 0.25 and 0.75.',kind:'overlap'},
 {prompt:'Keep the endpoints. Throughout the gray band, make both Fast and Slow have degree 0: neither description applies.',kind:'gap'}
];
export const ruleLevels=[
 {prompt:'Make this rule hold at every speed.',rules:['Fast(x) ⇒ ¬Slow(x)']},
 {prompt:'Make this rule hold at every speed.',rules:['¬Slow(x) ⇒ Fast(x)']},
 {prompt:'Satisfy both rules at every speed.',rules:['Fast(x) ⇒ ¬Slow(x)','¬Slow(x) ⇒ Fast(x)']},
 {prompt:'Make this rule hold at every speed, with both degrees at least 0.25 throughout 40–80 km/h.',rules:['Fast(x) ⇒ ¬Slow(x)'],overlap:true}
];
export function initialCurves(value=.5){return {Fast:speeds.map(x=>[x,value]),Slow:speeds.map(x=>[x,value])};}
// Pull a line segment by adjusting its neighboring supports. No new supports
// are created. Redistribute a remaining displacement if a support reaches 0/1.
export function reshapeCurve(points,x,value){
 const result=points.map(p=>[...p]);x=Math.max(0,Math.min(120,x));value=Math.max(0,Math.min(1,value));
 let right=result.findIndex(p=>p[0]>=x);if(right===0){result[0][1]=value;return result;}
 const left=right-1,t=(x-result[left][0])/(result[right][0]-result[left][0]),weights=[1-t,t],indices=[left,right];
 for(let pass=0;pass<3;pass++){
  const delta=value-weights.reduce((sum,w,i)=>sum+w*result[indices[i]][1],0);
  const active=indices.map((i,k)=>weights[k]>0&&(delta>0?result[i][1]<1:result[i][1]>0));
  const norm=weights.reduce((sum,w,i)=>sum+(active[i]?w*w:0),0);if(!norm)break;
  indices.forEach((i,k)=>{if(active[k])result[i][1]=Math.max(0,Math.min(1,result[i][1]+delta*weights[k]/norm));});
 }
 return result;
}
export function checkCurves(curves,level){
 const values=Object.values(curves).flat();
 if(!values.every(([x,y])=>Number.isFinite(x)&&Number.isFinite(y)&&y>=0&&y<=1))return {correct:false,message:'Use membership degrees between 0 and 1.'};
 const xs=[...new Set([...values.map(([x])=>x),40,80])];
 if(!level.rules){
  const anchors=[['Fast',0,0],['Fast',120,1],['Slow',0,1],['Slow',120,0]];
  for(const [name,x,y] of anchors)if(Math.abs(membership(curves[name],x)-y)>1e-8)return {correct:false,message:`Set ${name}(${x}) to ${y}.`};
  if(!curves.Fast.every((p,i,a)=>!i||p[1]>=a[i-1][1]-1e-8)||!curves.Slow.every((p,i,a)=>!i||p[1]<=a[i-1][1]+1e-8))return {correct:false,message:'Fast must not decrease as speed rises; Slow must not increase.'};
 }
 if(level.rules)for(const rule of level.rules){const result=checkRule(parseRule(rule,['Fast','Slow']),curves);if(!result.valid)return {correct:false,message:`At ${result.x} km/h, the antecedent has degree ${result.a.toFixed(2)} but the consequent only ${result.b.toFixed(2)}.`};}
 for(const x of xs){const a=membership(curves.Fast,x),b=membership(curves.Slow,x),band=x>=40&&x<=80;
  if(['complement','overlap'].includes(level.kind)&&Math.abs(a+b-1)>1e-8)return {correct:false,message:`At ${x} km/h the degrees add to ${(a+b).toFixed(2)}. For complements they must add to 1.`};
  if(band&&(level.kind==='overlap'||level.overlap)&&(Math.min(a,b)<.25-1e-8||level.kind==='overlap'&&Math.max(a,b)>.75+1e-8))return {correct:false,message:`Check both degrees at ${x} km/h in the gray band.`};
  if(band&&level.kind==='gap'&&Math.max(a,b)>1e-8)return {correct:false,message:`At ${x} km/h, both degrees must be 0.`};
 }
 return {correct:true,message:'Correct at every speed.'};
}
// Rule weights are the supplied membership degrees, as in the chapter.
export const brakeMemberships={Slow:[[0,1],[120,0]],Moderate:[[0,0],[60,1],[120,0]],Fast:[[0,0],[120,1]]};
export function brakeOutputSets({lowEnd=.4,mediumPeak=.5,highStart=.6}){
 return [
  [[0,1],[lowEnd,0],[1,0]],
  [[0,0],[mediumPeak-.2,0],[mediumPeak,1],[mediumPeak+.2,0],[1,0]],
  [[0,0],[highStart,0],[1,1]]
 ];
}
export function braking(speed,{low=0,middle=.5,high=1,mode,lowEnd=.4,mediumPeak=.5,highStart=.6}){
 if(![speed,low,middle,high,lowEnd,mediumPeak,highStart].every(Number.isFinite)||[low,middle,high].some(v=>v<0||v>1)||lowEnd<=0||lowEnd>1||highStart<0||highStart>=1||mediumPeak<.2||mediumPeak>.8||!['sugeno','mamdani'].includes(mode))throw Error('Choose outputs from 0 to 1 and output sets within the power scale.');
 const weights=Object.values(brakeMemberships).map(curve=>membership(curve,speed));
 if(mode==='sugeno')return {weights,output:weights.reduce((sum,w,i)=>sum+w*[low,middle,high][i],0)/weights.reduce((sum,w)=>sum+w,0)};
 const clipped=brakeOutputSets({lowEnd,mediumPeak,highStart}).map((curve,i)=>combineCurves(curve,[[0,weights[i]],[1,weights[i]]],Math.min));
 const aggregate=clipped.reduce((a,b)=>combineCurves(a,b,Math.max));
 return {weights,clipped,aggregate,output:centroid(aggregate).output};
}
export const brakeLevels=[
 {mode:'sugeno',middle:[.4,.6],maxLow:.1,prompt:'Choose the three Sugeno outputs: power at most 0.1 at 0 km/h, between 0.4 and 0.6 at 60 km/h, and at least 0.8 at 120 km/h.'},
 {mode:'sugeno',middle:[.6,.7],maxLow:.1,prompt:'Now choose outputs giving power between 0.6 and 0.7 at 60 km/h. Keep at most 0.1 at 0 km/h and at least 0.8 at 120 km/h.'},
 {mode:'sugeno',smooth:true,maxLow:.1,prompt:'Choose outputs giving power at most 0.1 at 0 km/h and at least 0.8 at 120 km/h. Make the power curve join without a corner at 60 km/h.'},
 {mode:'mamdani',middle:[.6,.7],maxLow:.15,prompt:'Choose the Low, Medium, and High output sets: power at most 0.15 at 0 km/h, between 0.6 and 0.7 at 60 km/h, and at least 0.8 at 120 km/h.'}
];
// One-sided derivatives at 60 km/h, in power per km/h. The supplied
// memberships make the output continuous; only this join can have a corner.
export function brakingSlopes({low,middle,high}){
 return {left:(high+2*middle-3*low)/480,right:(3*high-low-2*middle)/480};
}
export function checkBraking(config,level){
 const outputs=[0,60,120].map(speed=>braking(speed,config).output),[low,middle,high]=outputs;
 if(level.smooth){
  const slopes=brakingSlopes(config),smooth=Math.abs(slopes.left-slopes.right)<1e-10;
  const correct=low<=level.maxLow+1e-9&&high>=.8-1e-9&&smooth;
  return {correct,outputs,slopes,message:correct?'Correct: the power targets hold and the curve joins without a corner.':low>level.maxLow+1e-9?'Reduce the power at 0 km/h.':high<.8-1e-9?'Increase the power at 120 km/h.':'The power targets hold, but there is still a corner at 60 km/h. Adjust the Moderate output.'};
 }
 const correct=low<=level.maxLow+1e-9&&high>=.8-1e-9&&middle>=level.middle[0]-1e-9&&middle<=level.middle[1]+1e-9;
 return {correct,outputs,message:correct?'Correct: all three power requirements hold.':low>level.maxLow?'Reduce the power at 0 km/h.':high<.8?'Increase the power at 120 km/h.':`Adjust the ${level.mode==='sugeno'?'recommended outputs':'output sets'} to get power between ${level.middle[0]} and ${level.middle[1]} at 60 km/h.`};
}
