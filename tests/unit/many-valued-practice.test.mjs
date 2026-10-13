import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {practiceSQL,inferenceLevels,lawLevels,sqlAnswer,sqlSolution,counterLevels,counterexample,speeds,curveLevels,ruleLevels,initialCurves,reshapeCurve,checkCurves,brakeLevels,brakingSlopes,brakeOutputSets,braking,checkBraking} from '../../assets/js/logic/many-valued-practice.js';
import {executeSQL} from '../../assets/js/logic/sql-execution.js';
import {assessSQL} from '../../assets/js/logic/sql-assessment.js';
import {membership} from '../../assets/js/logic/fuzzy.js';
const vendor={exports:{}};
const init=new Function('module','exports','require','__dirname',readFileSync(new URL('../../assets/vendor/sql.js/sql-wasm.js',import.meta.url),'utf8')+'; return module.exports;')(vendor,vendor.exports,createRequire(import.meta.url),new URL('../../assets/vendor/sql.js/',import.meta.url).pathname);
const SQL=await init({wasmBinary:readFileSync(new URL('../../assets/vendor/sql.js/sql-wasm.wasm',import.meta.url))});
test('student SQL tasks agree with SQLite on all valuations, including NULL counterexamples',()=>{
 const db=new SQL.Database();db.run(practiceSQL);
 try{
  for(const [kind,items] of [['inference',inferenceLevels],['laws',lawLevels]])for(const item of items){
   const actual=executeSQL(db,sqlSolution(item,kind));
   assert.equal(assessSQL(db,actual.results,{kind:'query',columns:3,rows:sqlAnswer(item,kind)}).correct,true);
  }
  assert.deepEqual(inferenceLevels.map(i=>sqlAnswer(i,'inference').length===0),[false,false,true,true,false,true]);
  assert.ok(lawLevels.slice(0,-1).every(i=>sqlAnswer(i,'laws').length===0));
  assert.equal(sqlAnswer(lawLevels.at(-1),'laws').length,9);
  const missed=executeSQL(db,'SELECT X,Y,Z FROM ValueTriples WHERE (X OR NOT X) != 1;');
  assert.equal(assessSQL(db,missed.results,{kind:'query',columns:3,rows:sqlAnswer(lawLevels.at(-1),'laws')}).correct,false);
 }finally{db.close();}
});
test('all fuzzy counterexample levels have strict degree witnesses',()=>{
 const witnesses=[{A:.6,B:.3},{A:.5,B:0},{A:.5,B:0},{A:0,B:1},{A:0,B:1},{A:.5,B:0}];
 counterLevels.forEach((item,i)=>assert.equal(counterexample(item,witnesses[i]).correct,true,item.label));
 assert.equal(counterexample(counterLevels[0],{A:1,B:1}).correct,false);
 // Preservation of 1 still holds for Łukasiewicz modus ponens.
 for(const B of [0,.5,1])assert.equal(counterexample(counterLevels[0],{A:1,B}).correct,false);
 assert.throws(()=>counterexample(counterLevels[0],{A:NaN,B:0}),/between/);
});
const curves=(fast,slow)=>({Fast:speeds.map((x,i)=>[x,fast[i]]),Slow:speeds.map((x,i)=>[x,slow[i]])});
test('membership and rule tasks check endpoints, monotonicity, and entire gray intervals',()=>{
 const complement=curves([0,.5,.5,1],[1,.5,.5,0]);
 for(const level of [...curveLevels.slice(0,3),...ruleLevels])assert.equal(checkCurves(complement,level).correct,true,level.prompt);
 const gap=curves([0,0,0,1],[1,0,0,0]);
 assert.equal(checkCurves(gap,curveLevels[3]).correct,true);
 assert.equal(checkCurves(gap,curveLevels[2]).correct,false);
 assert.equal(checkCurves(gap,ruleLevels[0]).correct,true);
 assert.equal(checkCurves(gap,ruleLevels[1]).correct,false);
 assert.equal(checkCurves(initialCurves(),curveLevels[0]).correct,false);
 const bad=structuredClone(complement);bad.Fast[2][1]=.4;
 assert.equal(checkCurves(bad,curveLevels[0]).correct,false);
 const narrowBand=curves([0,.1,.9,1],[1,.9,.1,0]);
 assert.equal(checkCurves(narrowBand,curveLevels[2]).correct,false);
});
test('rule levels allow arbitrary endpoints and nonmonotone interpretations',()=>{
 const c=curves([1,0,1,0],[0,1,0,1]);
 for(const level of ruleLevels.slice(0,3))assert.equal(checkCurves(c,level).correct,true);
 assert.equal(checkCurves(c,curveLevels[0]).correct,false);
 assert.equal(checkCurves(initialCurves(.5),ruleLevels[3]).correct,true);
 assert.match(checkCurves(initialCurves(.75),ruleLevels[0]).message,/antecedent/);
});
test('pulling a segment changes its degree without adding points or exceeding bounds',()=>{
 const original=initialCurves().Fast;let points=original;
 for(let i=0;i<100;i++){
  const x=i*17%121,target=i%3/2;points=reshapeCurve(points,x,target);
  assert.deepEqual(points.map(p=>p[0]),speeds);assert.ok(points.every(p=>p[1]>=0&&p[1]<=1));
  assert.ok(Math.abs(membership(points,x)-target)<1e-10);
 }
 assert.deepEqual(original,initialCurves().Fast);
});
const config={low:0,middle:.8,high:1,mode:'sugeno'};
test('controller levels use membership degrees directly and have solutions',()=>{
 assert.equal(checkBraking({...config,middle:.5},brakeLevels[0]).correct,true);
 assert.equal(checkBraking(config,brakeLevels[1]).correct,true);
 assert.equal(checkBraking({...config,middle:.5},brakeLevels[1]).correct,false);
 assert.equal(checkBraking({...config,low:.2},brakeLevels[1]).correct,false);
 assert.equal(checkBraking({...config,high:.7},brakeLevels[1]).correct,false);
 assert.equal(checkBraking({mode:'mamdani',lowEnd:.2,mediumPeak:.75,highStart:.6},brakeLevels[3]).correct,true);
 assert.deepEqual(braking(60,config).weights,[.5,1,.5]);
 assert.equal(braking(60,config).output,.65);
 assert.equal(braking(0,config).output,0);assert.equal(braking(120,config).output,1);
 assert.deepEqual(braking(30,config).weights,[.75,.5,.25]);
 assert.ok(Math.abs(braking(30,config).output-.65/1.5)<1e-10);
 for(const bad of [{low:-.1},{middle:1.1},{high:NaN},{mediumPeak:.9},{lowEnd:0},{highStart:1}])assert.throws(()=>braking(60,{...config,...bad}));
});
test('three-rule Mamdani centroid agrees with independent numerical integration',()=>{
 for(const [lowEnd,mediumPeak,highStart] of [[.4,.5,.6],[.2,.75,.6],[.8,.2,.1]])for(const speed of [0,30,60,90,120]){
  const c={mode:'mamdani',lowEnd,mediumPeak,highStart},r=braking(speed,c),sets=brakeOutputSets(c);
  for(const x of [0,.1,.3,.5,.7,.9,1]){
   const heights=sets.map((curve,i)=>Math.min(membership(curve,x),r.weights[i]));
   r.clipped.forEach((curve,i)=>assert.ok(Math.abs(membership(curve,x)-heights[i])<1e-10));
   assert.ok(Math.abs(membership(r.aggregate,x)-Math.max(...heights))<1e-10);
  }
  // A fine midpoint sum is independent of the exact polygon integration.
  let area=0,moment=0;
  for(let j=0;j<20000;j++){
   const x=(j+.5)/20000,height=Math.max(...sets.map((curve,i)=>Math.min(membership(curve,x),r.weights[i])));
   area+=height;moment+=x*height;
  }
  assert.ok(Math.abs(moment/area-r.output)<1e-7);
 }
 const outputs=[0,60,120].map(x=>braking(x,{mode:'mamdani',lowEnd:.2,mediumPeak:.75,highStart:.6}).output);
 [1/15,.625,13/15].forEach((v,i)=>assert.ok(Math.abs(v-outputs[i])<1e-10));
});

test('smooth controller requires both power targets and equal one-sided slopes',()=>{
 const level=brakeLevels[2];
 for(const c of [{low:.1,middle:.5,high:.9},{low:0,middle:.4,high:.8}]){
  const config={...c,mode:'sugeno'};assert.equal(checkBraking(config,level).correct,true);
  const slopes=brakingSlopes(config),h=.001,f=x=>braking(x,config).output;
  assert.ok(Math.abs((f(60)-f(60-h))/h-slopes.left)<1e-7);
  assert.ok(Math.abs((f(60+h)-f(60))/h-slopes.right)<1e-7);
 }
 for(const middle of [.3,.7])assert.match(checkBraking({mode:'sugeno',low:.1,middle,high:.9},level).message,/still a corner/);
 assert.equal(checkBraking({mode:'sugeno',low:.5,middle:.5,high:.5},level).correct,false);
 assert.equal(checkBraking({mode:'sugeno',low:0,middle:.3,high:.6},level).correct,false);
});

test('overlapping memberships normalize to curved Sugeno output',()=>{
 for(const middle of [.3,.5,.7]){
  const config={mode:'sugeno',low:.1,middle,high:.9};
  for(let speed=0;speed<=120;speed++){
   const u=speed/120,r=braking(speed,config),moderate=u<=.5?2*u:2*(1-u);
   const expected=(.1*(1-u)+middle*moderate+.9*u)/(1+moderate);
   assert.ok(Math.abs(r.weights.reduce((a,b)=>a+b,0)-(1+moderate))<1e-12);
   assert.ok(Math.abs(r.output-expected)<1e-12);
  }
 }
 const config={mode:'sugeno',low:.1,middle:.5,high:.9};
 assert.ok(Math.abs(braking(30,config).output-(.1+.8*.25))>.06);
});
