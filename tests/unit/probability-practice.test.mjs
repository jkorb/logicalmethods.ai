import test from 'node:test';
import assert from 'node:assert/strict';
import {generationLevels,calculationLevels,independenceLevels,spamLevels,threeWeatherRows,assessWeights,assessCalculation,assessIndependence,assessSpam} from '../../assets/js/logic/probability-practice.js';
import {defaultBayes} from '../../assets/js/logic/probability.js';

test('all weight challenges have witnesses and reject invalid or incorrect distributions',()=>{
 const witnesses=[[.2,.3,.3,.2],[.25,.5,.25,0],[.25,.25,.25,.25],[.125,.25,.125,.5],[.375,.125,.125,.375],[.4,.1,.1,.4]];
 generationLevels.forEach((level,i)=>assert.equal(assessWeights(witnesses[i],level.claims).correct,true,`level ${i+1}`));
 for(const weights of [[NaN,0,0,1],[.5,.5,.5,.5],[-.1,.6,.3,.2],[0,1,0,0]])assert.equal(assessWeights(weights,generationLevels[0].claims).correct,false);
 assert.equal(assessWeights([0,0,.5,.5],generationLevels[4].claims).correct,false);
 assert.equal(assessWeights([0,0,0,1],generationLevels[3].claims).correct,false);
});
test('eight-model calculations require semantic row selection independently of arithmetic',()=>{
 assert.equal(threeWeatherRows.length,8);
 const masks=[[0,1,4,5],[1,3,5,7],[0,1],[0,1,2,4,5,6],[0,1,2,3,4,5],[2,3,6],[0,1,2,3,4,5]];
 const answers=['11/20','1/2','3/10','3/4','3/4','1/4','3/4'];
 calculationLevels.forEach((level,i)=>{
  assert.equal(assessCalculation(level,masks[i],answers[i]).correct,true,`level ${i+1}`);
  assert.equal(assessCalculation(level,masks[i],'').correct,false);
  assert.equal(assessCalculation(level,[],answers[i]).correct,false);
  assert.equal(assessCalculation(level,masks[i],'0.99').correct,false);
 });
 assert.equal(assessCalculation(calculationLevels[6],[0,2,5],'3/4').correct,false,'zero-weight true rows count');
});
test('independence grading handles unequal marginals, dependence, entailment and complements',()=>{
 assert.equal(assessIndependence(independenceLevels[0],independenceLevels[0].masses,true).correct,true);
 assert.equal(assessIndependence(independenceLevels[1],independenceLevels[1].masses,false).correct,true);
 assert.equal(assessIndependence(independenceLevels[0],independenceLevels[0].masses,null).correct,false);
 assert.equal(assessIndependence(independenceLevels[2],[.25,.25,.25,.25]).correct,true);
 assert.equal(assessIndependence(independenceLevels[3],[.4,.1,.1,.4]).correct,true);
 assert.equal(assessIndependence(independenceLevels[3],[1,0,0,0]).correct,false,'must keep the stated marginals');
 assert.equal(assessIndependence(independenceLevels[4],[.25,.375,.375,0]).correct,true);
 assert.equal(assessIndependence(independenceLevels[5],independenceLevels[5].masses,false).correct,true);
});
test('spam challenges accept misleading probability models but enforce their fixed conditions',()=>{
 assert.equal(assessSpam(spamLevels[0],defaultBayes).correct,false);
 assert.equal(assessSpam(spamLevels[0],{...defaultBayes,prior:.1}).correct,true);
 const fooled={...defaultBayes,spam:[.2,.2,.2,.2],nonspam:[.8,.8,.8,.8]};
 assert.equal(assessSpam(spamLevels[1],fooled).correct,true);
 assert.equal(assessSpam(spamLevels[0],fooled).correct,false);
 assert.equal(assessSpam(spamLevels[1],{...fooled,threshold:.9}).correct,false);
 assert.equal(assessSpam(spamLevels[1],{...fooled,prior:0}).correct,false);
 assert.equal(assessSpam(spamLevels[1],{...fooled,spam:[0,.2,.2,.2]}).correct,false);
 assert.equal(assessSpam(spamLevels[1],{...fooled,nonspam:[NaN,.8,.8,.8]}).correct,false);
});
