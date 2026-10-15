import { parseBoolean, evaluateTrace, readInference, WORLDS } from './boolean.js';

export const weatherRows = WORLDS.map(w => ({ label:w.id, values:{SUN:w.SUN,RAIN:w.RAIN} }));
export const diceRows = Array.from({length:6}, (_,i) => ({ label:String(i+1), values:Object.fromEntries(Array.from({length:6},(_,j)=>[`D${'₁₂₃₄₅₆'[j]}`,Number(i===j)])) }));
export const spamRows = [1,0].flatMap(SPAM => [1,0].map(Unknown => ({label:`${SPAM}${Unknown}`,values:{SPAM,Unknown}})));
export const distributions = {
  uniform:[.25,.25,.25,.25], sunny:[.5,.5,0,0], dependent:[.25,.5,.125,.125],
  fair:Array(6).fill(1/6), loaded:[.1,.1,.1,.1,.1,.5], certain:[1,0,0,0,0,0],
  sender:[.08,.12,.22,.58]
};
export function numberInput(text) {
  if (!String(text).trim()) return NaN;
  const parts=String(text).trim().split('/');
  if(parts.length>2 || parts.some(p=>!/^\s*(?:\d+(?:\.\d*)?|\.\d+)\s*$/.test(p))) return NaN;
  return Number(parts[0])/(parts.length===2?Number(parts[1]):1);
}
export function validateMasses(masses) {
  if(!masses.length || masses.some(p=>!Number.isFinite(p)||p<0||p>1)) throw Error('Each probability must be between 0 and 1. Fractions such as 1/6 are accepted.');
  const total=masses.reduce((a,b)=>a+b,0);
  if(Math.abs(total-1)>1e-9) throw Error(`The probabilities must sum to 1; their sum is ${formatNumber(total)}.`);
  return masses;
}
export function formatNumber(n) {
  if(n===null || Number.isNaN(n))return 'undefined';
  if(!Number.isFinite(n))return n>0?'∞':'−∞';
  if(Math.abs(n)<1e-12)return '0';
  for(let d=1;d<=60;d++)if(Math.abs(n*d-Math.round(n*d))<1e-10)return d===1?String(Math.round(n)): `${Math.round(n*d)}/${d}`;
  return String(Number(n.toFixed(4)));
}
export function eventMask(source,rows) {
  if(rows===diceRows)source=source.replace(/\b(EVEN|HIGH|TWO)\b/g,n=>({EVEN:'(D₂ ∨ D₄ ∨ D₆)',HIGH:'(D₄ ∨ D₅ ∨ D₆)',TWO:'D₂'})[n]).replace(/D([1-6])/g,(_,n)=>`D${'₁₂₃₄₅₆'[Number(n)-1]}`);
  const {tree,names}=parseBoolean(source);
  const allowed=Object.keys(rows[0].values);
  if(names.some(n=>!allowed.includes(n)))throw Error(`Use ${allowed.join(', ')} in this table.`);
  return rows.map(row=>evaluateTrace(tree,row.values).at(-1).value===1);
}
export function probability(masses,mask) { return masses.reduce((sum,p,i)=>sum+(mask[i]?p:0),0); }
export function tableCalculation(masses,rows,source,condition='') {
  validateMasses(masses);
  const event=eventMask(source,rows),given=condition.trim()?eventMask(condition,rows):rows.map(()=>true);
  const joint=event.map((v,i)=>v&&given[i]);
  const numerator=probability(masses,joint),denominator=probability(masses,given);
  return {event,given,joint,numerator,denominator,result:denominator>0?numerator/denominator:null};
}
export function supportFromJoint(p,e,joint) {
  const q=e>0?joint/e:null;
  const positive=p>0?joint/p:null,negative=p<1?(e-joint)/(1-p):null;
  return {p,e,joint,q,positive,negative,
    difference:q===null?null:q-p,
    ratio:q===null||p===0?null:q/p,
    logRatio:q===null||p===0?null:Math.log(q/p),
    logLikelihood:positive===null||negative===null||e===0?null:Math.log(positive/negative)};
}
export function inferenceSupport(masses,rows,source) {
  validateMasses(masses);
  const {premises,conclusion}=readInference(source.replace(/,/g,'\n').replace(/\s*∴/g,'\n∴'));
  const masks=premises.map(p=>eventMask(p,rows));
  const evidence=rows.map((_,i)=>masks.every(m=>m[i])),hypothesis=eventMask(conclusion,rows);
  const joint=evidence.map((v,i)=>v&&hypothesis[i]);
  return {...supportFromJoint(probability(masses,hypothesis),probability(masses,evidence),probability(masses,joint)),evidence,hypothesis,conclusion,premises};
}
// Hold two of (prior, posterior, evidence probability) fixed. Keep only joint
// distributions allowed by both probability laws and the logical table.
export function supportCurve(result,axis,key,steps=160) {
  const available=new Set(result.evidence.map((v,i)=>`${Number(result.hypothesis[i])}${Number(v)}`));
  return Array.from({length:steps+1},(_,i)=>{
    const x=i/steps,p=axis==='p'?x:result.p,q=axis==='q'?x:result.q,e=axis==='e'?x:result.e;
    if(q===null)return [x,null];
    const j=q*e,cells={'11':j,'10':p-j,'01':e-j,'00':1-p-e+j};
    if(Object.entries(cells).some(([region,mass])=>mass < -1e-10 || !available.has(region)&&mass>1e-10))return [x,null];
    return [x,supportFromJoint(p,e,j)[key]];
  });
}
export const defaultBayes = {prior:.2,threshold:.5,spam:[.4,.6,.7,.6],nonspam:[.275,.35,.575,.225]};
export const markerNames=['Unknown','Urgent','Exclamation','Money'];
export function emailMarkers(subject,body,knownSender) {
  return [!knownSender,/\burgent\b/i.test(subject),/!/.test(subject+' '+body),/\b(money|invest|investment|cash|prize)\b|[$€£]/i.test(subject+' '+body)];
}
export function classifyEmail(features,parameters=defaultBayes) {
  const {prior,threshold,spam,nonspam}=parameters;
  if(features.length!==4||spam.length!==4||nonspam.length!==4)throw Error('Provide all four marker likelihoods.');
  if([prior,threshold,...spam,...nonspam].some(p=>!Number.isFinite(p)||p<0||p>1))throw Error('All parameters must be between 0 and 1.');
  const factors=[spam,nonspam].map(likelihoods=>likelihoods.map((p,i)=>features[i]===null?1:features[i]?p:1-p));
  const scores=factors.map((ps,i)=>ps.reduce((a,b)=>a*b,i?1-prior:prior));
  const evidence=scores[0]+scores[1],posterior=evidence>0?scores[0]/evidence:null;
  return {factors,scores,evidence,posterior,classification:posterior===null?null:posterior>=threshold?'Spam':'Inbox'};
}

// Bounds keep all four regions nonnegative and any logically empty region empty.
export function supportBounds(result,axis) {
  if(result.q===null)return [0,0];
  const available=new Set(result.evidence.map((v,i)=>`${Number(result.hypothesis[i])}${Number(v)}`));
  const cells=x=>{const p=axis==='p'?x:result.p,q=axis==='q'?x:result.q,e=axis==='e'?x:result.e,j=q*e;return [j,p-j,e-j,1-p-e+j];};
  const zero=cells(0),one=cells(1);let low=0,high=1;
  ['11','10','01','00'].forEach((key,i)=>{
    const a=one[i]-zero[i],b=zero[i];
    if(Math.abs(a)<1e-12)return;
    const bound=-b/a;
    if(!available.has(key)){low=Math.max(low,bound);high=Math.min(high,bound);}
    else if(a>0)low=Math.max(low,bound);else high=Math.min(high,bound);
  });
  return [Math.max(0,low),Math.max(low,Math.min(1,high))];
}
// Marginal sliders rescale the two sets of models. At a zero-mass boundary,
// recover the lost proportions from the starting distribution (or uniformly).
export function supportSliderBounds(result,axis) {
  if(axis==='q')return supportBounds(result,axis);
  const mask=axis==='p'?result.hypothesis:result.evidence;
  return [mask.every(Boolean)?1:0,mask.some(Boolean)?1:0];
}
export function changeSupportProbability(masses,result,axis,value,baseline=masses) {
  if(axis==='p'||axis==='e'){
    const [low,high]=supportSliderBounds(result,axis);
    if(!Number.isFinite(value)||value<low||value>high)throw Error('These probabilities cannot hold together.');
    const mask=axis==='p'?result.hypothesis:result.evidence;
    return masses.map((mass,i)=>{
      const indices=mask.flatMap((v,k)=>v===mask[i]?[k]:[]);
      const total=indices.reduce((sum,k)=>sum+masses[k],0);
      const original=indices.reduce((sum,k)=>sum+baseline[k],0);
      const proportion=total>0?mass/total:original>0?baseline[i]/original:1/indices.length;
      return (mask[i]?value:1-value)*proportion;
    });
  }
  const [low,high]=supportBounds(result,axis);
  if(!Number.isFinite(value)||value<low-1e-9||value>high+1e-9)throw Error('These probabilities cannot hold together.');
  const p=axis==='p'?value:result.p,q=axis==='q'?value:result.q,e=axis==='e'?value:result.e,j=q*e;
  const targets={'11':j,'10':p-j,'01':e-j,'00':1-p-e+j};
  const regions=result.evidence.map((v,i)=>`${Number(result.hypothesis[i])}${Number(v)}`);
  return masses.map((mass,i)=>{
    const region=regions[i],indices=regions.map((r,k)=>r===region?k:-1).filter(k=>k>=0),total=indices.reduce((sum,k)=>sum+masses[k],0);
    return Math.max(0,targets[region])*(total?mass/total:1/indices.length);
  });
}
