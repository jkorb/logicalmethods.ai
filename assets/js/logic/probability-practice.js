import {worldsFor} from './boolean.js';
import {weatherRows,validateMasses,tableCalculation,numberInput,formatNumber,defaultBayes,classifyEmail} from './probability.js';

export const threeWeatherWorlds=worldsFor(3);
export const threeWeatherRows=threeWeatherWorlds.map(({id,...values})=>({label:id,values}));
const claim=(formula,value,condition='')=>({formula,value,condition});
export const generationLevels=[
 {prompt:'Make rain have probability 1/2.',claims:[claim('RAIN',.5)]},
 {prompt:'Make sunshine have probability 3/4 and rain probability 1/2.',claims:[claim('SUN',.75),claim('RAIN',.5)]},
 {prompt:'Make their disjunction have probability 3/4 and their conjunction probability 1/4.',claims:[claim('SUN ∨ RAIN',.75),claim('SUN ∧ RAIN',.25)]},
 {prompt:'Make the first formula twice as likely as rain, with Pr(RAIN) = 1/4.',claims:[{formula:'RAIN ∨ (¬SUN → RAIN)',times:2,other:'RAIN'},claim('RAIN',.25)]},
 {prompt:'Keep both atoms at probability 1/2, but make rain given sunshine have probability 3/4.',claims:[claim('SUN',.5),claim('RAIN',.5),claim('RAIN',.75,'SUN')]},
 {prompt:'Give each atom probability 1/2 and their equivalence probability 4/5.',claims:[claim('SUN',.5),claim('RAIN',.5),claim('SUN ↔ RAIN',.8)]}
];
const masses=[.2,.1,.15,.05,.1,.15,.05,.2];
export const calculationLevels=[
 ...['RAIN','¬WIND','SUN ∧ RAIN','RAIN ∨ WIND','¬SUN → RAIN','(SUN ∨ WIND) ∧ ¬RAIN'].map(formula=>({formula,masses})),
 {formula:'SUN ∨ RAIN',masses:[.25,0,.25,0,0,.25,0,.25]}
];
export const independenceLevels=[
 {mode:'identify',left:'SUN',right:'RAIN',masses:[.4,.1,.4,.1]},
 {mode:'identify',left:'SUN',right:'RAIN',masses:[.4,.1,.1,.4]},
 {mode:'construct',left:'SUN',right:'RAIN',independent:true,claims:[claim('SUN',.5),claim('RAIN',.5)]},
 {mode:'construct',left:'SUN',right:'RAIN',independent:false,claims:[claim('SUN',.5),claim('RAIN',.5)]},
 {mode:'construct',left:'SUN ∨ RAIN',right:'SUN ∧ RAIN',independent:true,claims:[claim('SUN ∧ RAIN',.25)]},
 {mode:'identify',left:'SUN',right:'¬SUN',masses:[.25,.25,.25,.25]}
];
export const spamLevels=[
 {prompt:'Change only Pr(SPAM) to send this email to the inbox.',editable:'prior'},
 {prompt:'Change the marker likelihoods (0.05–0.95) to send this email to the inbox. Keep Pr(SPAM) = 0.2.',editable:'likelihoods'}
];
export const initialWeights=[.4,.3,.2,.1];
const close=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<=1e-6;
export function claimLabel(c){return `Pr(${c.formula}${c.condition?' | '+c.condition:''}) = ${c.times?`${c.times} × Pr(${c.other})`:formatNumber(c.value)}`;}
export function assessWeights(masses,claims=[]){
 try{validateMasses(masses);}catch(error){return {correct:false,message:error.message};}
 for(const c of claims){
  const actual=tableCalculation(masses,weatherRows,c.formula,c.condition).result;
  const target=c.times?c.times*tableCalculation(masses,weatherRows,c.other).result:c.value;
  if(!close(actual,target))return {correct:false,message:actual===null?'The conditioning proposition has probability 0. Give it positive weight.':`Check ${claimLabel(c)}.`};
 }
 return {correct:true,message:'Correct: your weights satisfy all the conditions.'};
}
export function assessCalculation(item,selected,answer){
 const result=tableCalculation(item.masses,threeWeatherRows,item.formula);
 if(result.event.some((truth,i)=>truth!==selected.includes(i)))return {correct:false,message:'Check which models make the formula true. Include true rows even when their weight is 0.'};
 const value=numberInput(answer);
 if(!close(value,result.result))return {correct:false,message:'The selected models are right. Add their weights and enter the probability as a fraction or decimal.'};
 return {correct:true,message:`Correct: Pr(${item.formula}) = ${formatNumber(result.result)}.`};
}
export function independence(masses,left,right){
 const a=tableCalculation(masses,weatherRows,left).result,b=tableCalculation(masses,weatherRows,right).result;
 const joint=tableCalculation(masses,weatherRows,`(${left}) ∧ (${right})`).result;
 return {a,b,joint,product:a*b,independent:close(joint,a*b)};
}
export function assessIndependence(item,masses,answer){
 const valid=assessWeights(masses,item.claims);if(!valid.correct)return valid;
 const r=independence(masses,item.left,item.right),target=item.mode==='identify'?answer:item.independent;
 if(typeof target!=='boolean')return {correct:false,message:'Choose independent or dependent.'};
 const correct=r.independent===target;
 return {correct,message:correct?`Correct: the joint probability is ${formatNumber(r.joint)}; the product is ${formatNumber(r.product)}.`:'Compare the conjunction’s probability with the product of the two probabilities.'};
}
export function assessSpam(item,parameters){
 try{
  const result=classifyEmail([true,true,true,true],parameters);
  if(parameters.threshold!==defaultBayes.threshold)return {correct:false,message:'Keep the threshold at 0.5.'};
  if(item.editable==='prior'&&['spam','nonspam'].some(key=>parameters[key].some((p,i)=>p!==defaultBayes[key][i])))return {correct:false,message:'Keep the supplied marker likelihoods.'};
  if(item.editable==='likelihoods'&&(parameters.prior!==.2||[...parameters.spam,...parameters.nonspam].some(p=>p<.05||p>.95)))return {correct:false,message:'Keep the prior at 0.2 and every likelihood between 0.05 and 0.95.'};
  return {correct:result.classification==='Inbox',message:result.classification==='Inbox'?'Correct: your probability model sends this spam email to the inbox.':'The filter still classifies the email as spam. Change the permitted probabilities.'};
 }catch(error){return {correct:false,message:error.message};}
}
