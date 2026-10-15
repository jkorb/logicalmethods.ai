import test from 'node:test';
import assert from 'node:assert/strict';
import {diceRows,weatherRows,spamRows,distributions,tableCalculation,inferenceSupport,supportCurve,supportBounds,changeSupportProbability,numberInput,validateMasses,emailMarkers,classifyEmail,defaultBayes} from '../../assets/js/logic/probability.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} ≠ ${b}`);
test('die event and conditional probabilities match fair and loaded examples',()=>{
  close(tableCalculation(distributions.fair,diceRows,'EVEN').result,.5);
  close(tableCalculation(distributions.loaded,diceRows,'EVEN').result,.7);
  close(tableCalculation(distributions.fair,diceRows,'TWO','EVEN').result,1/3);
  close(tableCalculation(distributions.loaded,diceRows,'TWO','EVEN').result,1/7);
  assert.equal(tableCalculation(distributions.certain,diceRows,'TWO','EVEN').result,null);
});
test('mass validation accepts fractions but rejects incomplete or invalid distributions',()=>{
  close(numberInput('1/6'),1/6);assert.ok(Number.isNaN(numberInput('')));assert.ok(Number.isNaN(numberInput('1/2/3')));
  for(const ps of [[0,0],[.5,.6],[-1,2],[Infinity], [numberInput('1/0')]])assert.throws(()=>validateMasses(ps));
  assert.throws(()=>tableCalculation(distributions.uniform,weatherRows,'WIND'),/SUN, RAIN/);
});
test('weather tables distinguish dependence, logical certainty and event probability',()=>{
  close(tableCalculation(distributions.uniform,weatherRows,'SUN ∨ ¬RAIN').result,.75);
  close(tableCalculation(distributions.sunny,weatherRows,'SUN ∨ ¬RAIN').result,1);
  close(tableCalculation(distributions.dependent,weatherRows,'RAIN','SUN').result,1/3);
  close(inferenceSupport(distributions.uniform,weatherRows,'SUN ∴ RAIN').logLikelihood,0);
  assert.ok(inferenceSupport(distributions.dependent,weatherRows,'SUN ∴ RAIN').difference<0);
});
test('support measures recover the sender example and distinguish posterior ratio from likelihood ratio',()=>{
  const r=inferenceSupport(distributions.sender,spamRows,'Unknown ∴ SPAM');
  close(r.q,4/15);close(r.difference,1/15);close(r.logRatio,Math.log(4/3));close(r.logLikelihood,Math.log(.4/.275));
  const zero=inferenceSupport(distributions.sunny,weatherRows,'¬SUN ∴ RAIN');assert.equal(zero.q,null);assert.equal(zero.logLikelihood,null);
  assert.equal(inferenceSupport(distributions.uniform,weatherRows,'SUN ∴ SUN').logLikelihood,Infinity);
  assert.equal(inferenceSupport(distributions.uniform,weatherRows,'SUN ∴ ¬SUN').logRatio,-Infinity);
});
test('support graphs respect joint-probability bounds and logical relations',()=>{
  const r=inferenceSupport(distributions.dependent,weatherRows,'SUN ∴ RAIN');
  const curve=supportCurve(r,'q','difference',8);
  assert.equal(curve.at(-1)[1],null); // q=1 would require Pr(RAIN)≥Pr(SUN).
  close(curve[3][1],0);
  const entailed=inferenceSupport(distributions.uniform,weatherRows,'SUN ∧ RAIN ∴ SUN');
  const points=supportCurve(entailed,'q','difference',8);
  assert.ok(points.slice(0,-1).every(([,y])=>y===null));close(points.at(-1)[1],.5);
});
test('Bernoulli naive Bayes uses absent features, thresholds, and class normalization',()=>{
  const r=classifyEmail([true,true,true,true]);close(r.scores[0],.02016);close(r.scores[1],.009961875);close(r.posterior,.02016/.030121875);assert.equal(r.classification,'Spam');
  assert.equal(classifyEmail([true,true,true,true],{...defaultBayes,threshold:.8}).classification,'Inbox');
  close(classifyEmail([true,true,false,true]).posterior,.00864/(.00864+.007363125));
  close(classifyEmail([null,null,null,null]).posterior,.2);
  assert.equal(classifyEmail([true,true,true,true],{...defaultBayes,spam:[0,0,0,0],nonspam:[0,0,0,0]}).posterior,null);
  assert.throws(()=>classifyEmail([true,true,true,true],{...defaultBayes,prior:NaN}));
});
test('the same superficial markers detect investment spam and the birthday false positive',()=>{
  assert.deepEqual(emailMarkers('URGENT investment','Invest $2000 today!',false),[true,true,true,true]);
  assert.deepEqual(emailMarkers('Urgent message',"Happy Birthday! You were right on the money.",false),[true,true,true,true]);
  assert.deepEqual(emailMarkers('Meeting','Tomorrow at 10?',true),[false,false,false,false]);
});

test('the die language distinguishes six one-hot models and expands abbreviations',()=>{
  assert.equal(new Set(diceRows.map(r=>JSON.stringify(r.values))).size,6);
  for(const row of diceRows)assert.equal(Object.values(row.values).reduce((a,b)=>a+b,0),1);
  close(tableCalculation(distributions.loaded,diceRows,'D₂ ∨ D₄ ∨ D₆').result,.7);
  close(tableCalculation(distributions.loaded,diceRows,'D2','EVEN').result,1/7);
});
test('support sliders preserve probability laws and respect logical restrictions',()=>{
  const r=inferenceSupport(distributions.dependent,weatherRows,'SUN ∴ RAIN');
  const [lo,hi]=supportBounds(r,'q');close(lo,1/6);close(hi,.5);
  const masses=changeSupportProbability(distributions.dependent,r,'q',.4);
  validateMasses(masses);const changed=inferenceSupport(masses,weatherRows,'SUN ∴ RAIN');
  close(changed.p,r.p);close(changed.e,r.e);close(changed.q,.4);
  assert.throws(()=>changeSupportProbability(distributions.dependent,r,'q',.9));
  const same=inferenceSupport(distributions.uniform,weatherRows,'SUN ∴ SUN');
  assert.deepEqual(supportBounds(same,'q'),[1,1]);
  const withZero=[.5,0,0,.5],zero=inferenceSupport(withZero,weatherRows,'SUN ∴ RAIN');
  const filled=changeSupportProbability(withZero,zero,'q',.5);validateMasses(filled);
  filled.forEach(p=>close(p,.25));
});

test('marginal sliders leave zero and one using starting proportions without violating logic',()=>{
 for(const source of ['SUN ∴ RAIN','SUN ∴ SUN','SUN ∴ ¬SUN','SUN ∧ RAIN ∴ SUN']){
  for(const axis of ['p','e']){
   const initial=distributions.dependent;
   for(const boundary of [0,1]){
    const start=inferenceSupport(initial,weatherRows,source);
    const edge=changeSupportProbability(initial,start,axis,boundary,initial);
    validateMasses(edge);close(inferenceSupport(edge,weatherRows,source)[axis],boundary);
    const restored=changeSupportProbability(edge,inferenceSupport(edge,weatherRows,source),axis,start[axis],initial);
    validateMasses(restored);restored.forEach((p,i)=>close(p,initial[i]));
   }
  }
 }
 const r=inferenceSupport(distributions.sunny,weatherRows,'SUN ∴ RAIN');
 const masses=changeSupportProbability(distributions.sunny,r,'e',.5,distributions.sunny);
 validateMasses(masses);masses.forEach(p=>close(p,.25));
 const tautology=inferenceSupport(distributions.uniform,weatherRows,'SUN ∴ SUN ∨ ¬SUN');
 assert.throws(()=>changeSupportProbability(distributions.uniform,tautology,'p',.5));
});
