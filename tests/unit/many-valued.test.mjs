import test from 'node:test';
import assert from 'node:assert/strict';
import {parseBoolean,evaluateTrace,worldsFor,proposition,inferenceScene} from '../../assets/js/logic/boolean.js';
import {fuzzyCurves,membership,parseFuzzy,formulaCurve,parseRule,checkRule,parseController,control} from '../../assets/js/logic/fuzzy.js';
const k=(s,v)=>evaluateTrace(parseBoolean(s).tree,v,'k3').at(-1).value;
test('Kleene operations preserve Boolean values and use the nine-value space',()=>{
 assert.equal(evaluateTrace(parseBoolean('¬SUN').tree,{SUN:.5},'k3').at(-1).calculation,'NOT ω = ω');
 assert.equal(worldsFor(2,'k3').length,9);assert.equal(worldsFor(3,'k3').length,27);
 for(const a of [0,.5,1])for(const b of [0,.5,1]){
  const v={A:a,B:b};assert.equal(k('A ∧ B',v),Math.min(a,b));assert.equal(k('A ∨ B',v),Math.max(a,b));assert.equal(k('¬A',v),1-a);
  assert.equal(k('¬(A ∧ (A ∨ B))',v),k('¬A',v));
  if(a!==.5&&b!==.5)for(const f of ['A ∧ B','A ∨ B','A → B','A ↔ B'])assert.equal(k(f,v),evaluateTrace(parseBoolean(f).tree,v).at(-1).value);
 }
 assert.equal(proposition('SUN ∨ ¬SUN',2,'k3').length,6);
 assert.equal(proposition('SUN ∧ ¬SUN',2,'k3').length,0);
});
test('Kleene consequence treats unknown conclusions as counterexamples',()=>{
 const bad=(ps,c)=>worldsFor(2,'k3').filter(v=>ps.every(p=>k(p,v)===1)&&k(c,v)!==1);
 assert.equal(bad(['SUN ∨ RAIN','¬SUN'],'RAIN').length,0);
 assert.equal(bad(['SUN','¬SUN'],'RAIN').length,0);
 assert.equal(bad(['SUN','SUN → RAIN'],'RAIN').length,0);
 assert.equal(bad([],'SUN ∨ ¬SUN').length,3);
 assert.equal(bad(['SUN'],'RAIN ∨ ¬RAIN').length,1);
 assert.equal(inferenceScene(['SUN'],'RAIN',2,'k3').points.length,9);
});
test('fuzzy formulas calculate intersections and complements',()=>{
 const curves=fuzzyCurves;
 assert.equal(membership(curves.IsCold,15),.5);
 const tree=parseFuzzy('IsWarm(x) ∧ ¬IsHot(x)');
 assert.equal(membership(formulaCurve(tree,curves),25),.5);
 assert.throws(()=>parseFuzzy('∀x IsWarm(x)'));
 assert.throws(()=>parseFuzzy('IsWarm(y)'));
});
test('rule checking finds violations between original curve knots',()=>{
 const curves={P:[[0,0],[30,1]],Q:[[0,1],[30,0]],R:[[0,.4],[30,.4]]};
 const rule=parseRule('(P(x) ∧ Q(x)) ⇒ R(x)',Object.keys(curves));
 const result=checkRule(rule,curves);assert.equal(result.valid,false);assert.equal(result.x,15);assert.equal(result.a,.5);
 curves.R=[[0,.5],[30,.5]];assert.equal(checkRule(rule,curves).valid,true);
});
test('controllers weight recommendations, handle zero weights, and bound output',()=>{
 const rules=parseController('IsCold(x) ⇒ 1\nIsWarm(x) ⇒ 0\nIsHot(x) ⇒ 0');
 assert.equal(control(rules,fuzzyCurves,15).output,.5);
 const zero=Object.fromEntries(Object.keys(fuzzyCurves).map(n=>[n,[[0,0],[30,0]]]));assert.equal(control(rules,zero,15).output,0);
 for(let x=0;x<=30;x+=.1){const {output}=control(rules,fuzzyCurves,x);assert.ok(output>=0&&output<=1);}
 assert.throws(()=>parseController('IsCold(x) ⇒ 2'));assert.throws(()=>parseController('IsCold(x) ⇒ '));
});

test('centroid integrates piecewise linear output areas and their moments',async()=>{
 const {centroid}=await import('../../assets/js/logic/fuzzy.js');
 assert.deepEqual(centroid([[0,0],[1,0]]),{area:0,output:0});
 assert.equal(centroid([[0,0],[1,1]]).output,2/3);
 assert.equal(centroid([[0,1],[1,0]]).output,1/3);
 assert.equal(centroid([[0,0],[.5,1],[1,0]]).output,.5);
 assert.equal(centroid([[0,1],[.3,1],[1,1]]).output,.5);
});
test('the AC combines independent inputs and covers its whole example domain',async()=>{
 const {aircon}=await import('../../assets/js/logic/fuzzy.js');
 assert.ok(Math.abs(aircon(26,70).sugeno-.525)<1e-12);assert.ok(Math.abs(aircon(34,20).sugeno-.8)<1e-12);
 assert.equal(aircon(20,20).sugeno,0);assert.ok(aircon(26,90).sugeno>aircon(26,20).sugeno);
 assert.ok(aircon(20,20).mamdani.output>0);
 for(let t=16;t<=36;t++)for(let h=0;h<=100;h+=5){const r=aircon(t,h);assert.ok(r.total>0&&r.mamdani.area>0);for(const v of [r.sugeno,r.mamdani.output])assert.ok(v>=0&&v<=1);}
 assert.throws(()=>aircon(NaN,70));assert.throws(()=>aircon(20,101));
});


test('edited AC conditions use their own measurement and outputs in each controller',async()=>{
 const {aircon,airconDefaults,parseAirconRules}=await import('../../assets/js/logic/fuzzy.js');
 const rules=Object.fromEntries(Object.entries(airconDefaults).map(([mode,source])=>[mode,parseAirconRules(source,mode)]));
 rules.sugeno=parseAirconRules('IsWarm(x) ∨ IsHumid(y) ↦ 0.5\nIsHot(x) ↦ 1');
 rules.mamdani=parseAirconRules('IsHumid(y) ↦ High','mamdani');
 const result=aircon(26,70,rules);assert.equal(result.rows[0].weight,.8);assert.equal(result.sugeno,.5);assert.ok(result.mamdani.output>.85);
 rules.sugeno=parseAirconRules('IsHot(x) ↦ 1');rules.mamdani=parseAirconRules('IsHot(x) ↦ High','mamdani');
 const none=aircon(20,20,rules);assert.equal(none.sugeno,0);assert.equal(none.mamdani.output,0);assert.equal(none.mamdani.area,0);
 for(const source of ['IsHumid(x) ↦ 1','IsWarm(y) ↦ 1','IsHot(x) → IsWarm(x) ↦ 1','IsHot(x) ↦ 2',''])assert.throws(()=>parseAirconRules(source));
 assert.throws(()=>parseAirconRules('IsHot(x) ↦ 0.7','mamdani'));
});
test('defuzzification clips, combines and balances the cooling sets',async()=>{
 const {defuzzify,aircon}=await import('../../assets/js/logic/fuzzy.js');
 const r=defuzzify({Low:.25,Medium:.75,High:0},.1);
 assert.equal(r.samples.length,11);assert.equal(r.samples[0][1],.25);assert.equal(r.samples[10][1],0);
 assert.ok(Math.abs(r.approximate-r.moment/r.total)<1e-12);
 // The exact centroid is the air conditioner's Mamdani output at 26°C and 70% humidity.
 assert.ok(Math.abs(r.exact-aircon(26,70).mamdani.output)<1e-9);
 assert.ok(Math.abs(defuzzify({Low:.25,Medium:.75,High:0},.01).approximate-r.exact)<Math.abs(r.approximate-r.exact)+1e-9);
 const none=defuzzify({Low:0,Medium:0,High:0});assert.equal(none.total,0);assert.equal(none.approximate,0);
});
