import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptyProof,addAssumption,infer,formula,printFormula,proves,validateProof,reuseLemma,extractProof} from '../../assets/js/logic/deduction.js';
import {toLean,fromLean} from '../../assets/js/logic/deduction-lean.js';
import {EXAMPLES,exampleProof} from '../../assets/js/logic/deduction-examples.js';
const start=(...fs)=>fs.reduce((p,f)=>addAssumption(p,f),emptyProof());
test('natural deduction retains dependencies and rejects mismatched premises',()=>{
  let p=start('RAIN → WET','SUN','RAIN');
  assert.throws(()=>infer(p,'impE',[0,1]),/antecedent/);
  p=infer(p,'impE',[0,2]);assert.deepEqual(p.nodes.at(-1).open,[0,2]);
  assert.ok(proves(p,3,['RAIN → WET','RAIN'],'WET'));assert.ok(!proves(p,3,['RAIN'],'WET'));
  p=infer(p,'impI',[3],{discharge:[2]});assert.deepEqual(p.nodes.at(-1).open,[0]);
});
test('case discharge is branch-local and cannot hide circular reasoning',()=>{
  let p=start('A ∨ B','A','B');
  // The right branch uses the left case's A: that dependency must remain open.
  p=infer(p,'orE',[0,1,1],{discharge:[1,2]});assert.deepEqual(p.nodes.at(-1).open,[0,1]);
  assert.ok(!proves(p,3,['A ∨ B'],'A'));
  assert.throws(()=>infer(p,'orE',[0,1,2],{discharge:[1,2]}),/same conclusion/);
  assert.throws(()=>infer(p,'orE',[0,1,1],{discharge:[1,1]}),/distinct/);
});
test('same-formula assumptions stay distinct; vacuous discharge is permitted',()=>{
  let p=start('A','A','B');p=infer(p,'andI',[0,1]);p=infer(p,'impI',[3],{discharge:[0]});assert.deepEqual(p.nodes.at(-1).open,[1]);
  p=infer(p,'impI',[0],{discharge:[2]});assert.equal(printFormula(p.nodes.at(-1).formula),'(B → A)');assert.deepEqual(p.nodes.at(-1).open,[0]);
});
test('import replays steps rather than trusting fabricated conclusions or open sets',()=>{
  let p=start('A','B');p=infer(p,'andI',[0,1]);const bad=structuredClone(p);bad.nodes[2].formula=formula('C');assert.throws(()=>validateProof(bad),/does not follow/);
  p.nodes[2].open=[];assert.deepEqual(validateProof(p).nodes[2].open,[0,1]);
  assert.throws(()=>reuseLemma(emptyProof(),{proof:p,root:2}),/closed/);
});
test('all worked examples preserve their claims through Lean round trips',()=>{
  for(const e of EXAMPLES){const {proof,root}=exampleProof(e);assert.ok(proves(proof,root,e.premises,e.goal),e.id);const again=fromLean(toLean(proof,root));assert.ok(proves(again.proof,again.root,e.premises,e.goal),e.id);}
});
test('Lean reader checks scope, incomplete proofs and unsupported commands',()=>{
  const code='variable (A B : Prop)\nexample : A → A := by\n  intro a\n  exact a';assert.equal(fromLean(code).proof.nodes.at(-1).open.length,0);
  for(const tail of ['sorry','exact a','intro a','omega','exact True.intro'])assert.throws(()=>fromLean('variable (A B : Prop)\nexample : A → A := by\n  '+tail));
  assert.throws(()=>fromLean('variable (A B : Prop)\nexample (d : A ∨ B) : A := by\n  apply Or.elim d\n  · intro a\n    exact a\n  · intro b\n    exact a'),/Unknown proof/);
  assert.throws(()=>fromLean('variable (A : Prop)\nexample : B → B := by\n  intro b\n  exact b'),/Declare B/);
});
test('negation, truth, iff and reusable closed proofs export and import',()=>{
  let p=start('A');p=infer(p,'impI',[0],{discharge:[0]});const lemma=extractProof(p,1);const reused=reuseLemma(start('B'),lemma);assert.ok(proves(reused.proof,reused.root,[],'A → A'));
  for(const code of [
    'variable (A : Prop)\nexample (a : A) : ¬¬A := by\n intro na\n exact na a',
    'example : True := by\n exact True.intro',
    'variable (A B : Prop)\nexample (f : A → B) (g : B → A) : A ↔ B := by\n apply Iff.intro\n · exact f\n · exact g',
    'variable (A B : Prop)\nexample (h : A ↔ B) : A → B := by\n exact Iff.mp h',
    'variable (A B : Prop)\nexample : A → B → A := by\n exact (fun a => (fun b => a))'
  ]){const a=fromLean(code),b=fromLean(toLean(a.proof,a.root));assert.equal(printFormula(a.proof.nodes[a.root].formula),printFormula(b.proof.nodes[b.root].formula));}
});
test('Lean reader accepts multiline exact terms used in the chapter',()=>{
  const r=fromLean('variable (A B C : Prop)\nexample (a : A) (f : A → B) (g : B → C) : C := by\n  exact g\n    (f a)');assert.ok(proves(r.proof,r.root,['A','A → B','B → C'],'C'));
  assert.throws(()=>fromLean('variable (A : Prop)\nexample : A → A := by\n intro a\n exact a\n sorry'),/Holes/);
});
test('Lean cases can use supplied functions as branch proofs',()=>{
  const a=fromLean('variable (A B C : Prop)\nexample (d : A ∨ B) (f : A → C) (g : B → C) : C := by\n exact Or.elim d f g');
  assert.ok(proves(a.proof,a.root,['A ∨ B','A → C','B → C'],'C'));
  const b=fromLean(toLean(a.proof,a.root));assert.ok(proves(b.proof,b.root,['A ∨ B','A → C','B → C'],'C'));
});

import {deleteStep,makeLemma,lemmaMatch,applyLemma,loadWorkspace,toProofSty} from '../../assets/js/logic/deduction-tools.js';
import {EXERCISES} from '../../assets/js/logic/deduction-exercises.js';
import {STRATEGIES} from '../../assets/js/logic/deduction-examples.js';
test('all exercise and author-slide strategies prove their targets and round trip',()=>{
  for(const e of [...EXERCISES,...STRATEGIES]){const x=fromLean(e.code);assert.ok(proves(x.proof,x.root,e.premises,e.goal),e.id);const y=fromLean(toLean(x.proof,x.root));assert.ok(proves(y.proof,y.root,e.premises,e.goal),e.id);}
  assert.equal(EXERCISES.length,15);
});
test('deleting a step removes dependents but keeps independent scratch work',()=>{
  let p=start('A','B','C');p=infer(p,'andI',[0,1]);p=infer(p,'impI',[3],{discharge:[2]});
  const q=deleteStep(p,1);assert.deepEqual(q.nodes.map(n=>printFormula(n.formula)),['A','C']);
  assert.deepEqual(deleteStep(p,2).nodes.map(n=>printFormula(n.formula)),['A','B','(A ∧ B)']);
});
test('derived rules match compound substitutions and retain input dependencies',()=>{
  const x=fromLean('variable (A B : Prop)\nexample (h : A ∧ B) : B ∧ A := by\n apply And.intro\n · exact And.right h\n · exact And.left h');
  const l=makeLemma(x.proof,x.root,'Swap');let p=start('(RAIN → SNOW) ∧ ¬WIND');
  const result=applyLemma(p,l,[0]);assert.ok(proves(result.proof,result.root,['(RAIN → SNOW) ∧ ¬WIND'],'¬WIND ∧ (RAIN → SNOW)'));
  assert.deepEqual(result.proof.nodes[result.root].open,[0]);assert.throws(()=>applyLemma(start('RAIN'),l,[0]),/match/);
  const dup=fromLean('variable (A : Prop)\nexample (a : A) : A ∧ A := by\n exact And.intro a a');
  const d=makeLemma(dup.proof,dup.root,'Duplicate');assert.throws(()=>applyLemma(start('RAIN'),d,[0],{A:'SNOW'}),/same formula/);
});
test('closed schemes request missing substitutions; concrete atoms stay concrete',()=>{
  const x=fromLean('variable (A : Prop)\nexample : A → A := by\n intro a\n exact a'),l=makeLemma(x.proof,x.root,'Identity');
  assert.deepEqual(lemmaMatch(emptyProof(),l,[]).missing,['A']);const y=applyLemma(emptyProof(),l,[],{A:'RAIN ∨ WIND'});assert.ok(proves(y.proof,y.root,[],'(RAIN ∨ WIND) → (RAIN ∨ WIND)'));
  const c=fromLean('variable (RAIN : Prop)\nexample (r : RAIN) : RAIN := by\n exact r');assert.throws(()=>applyLemma(start('SUN'),makeLemma(c.proof,c.root),[0]),/match/);
});
test('a saved derived rule cannot discharge assumptions inside its supplied premise proof',()=>{
  const x=fromLean('variable (A B : Prop)\nexample (a : A) : B → A := by\n intro b\n exact a'),l=makeLemma(x.proof,x.root);
  let p=start('SUN','RAIN');p=infer(p,'andI',[0,1]);const out=applyLemma(p,l,[2],{B:'SNOW'});
  assert.deepEqual(out.proof.nodes[out.root].open,[0,1]);assert.ok(proves(out.proof,out.root,['SUN','RAIN'],'SNOW → (SUN ∧ RAIN)'));
});
test('workspace validation rechecks saved rules and proof.sty preserves discharge labels',()=>{
  const e=exampleProof(EXAMPLES[1]),l=makeLemma(e.proof,e.root);const saved={format:'logicalmethods-nd',version:1,proof:e.proof,lemmas:[l]};
  assert.equal(loadWorkspace(saved).lemmas.length,1);const bad=structuredClone(saved);bad.lemmas[0].proof.nodes.at(-1).formula=formula('SUN');assert.throws(()=>loadWorkspace(bad),/does not follow/);
  const tex=toProofSty(e.proof,e.root);assert.match(tex,/usepackage\{amsmath,amssymb,proof\}/);assert.match(tex,/\\infer\[\\to I, h_\{0\}\]/);assert.match(tex,/\[\\mathrm\{RAIN\}\]/);
});

test('multiple discharge removes every use of one assumption label',()=>{
  let p=start('RAIN');p=infer(p,'andI',[0,0]);p=infer(p,'impI',[1],{discharge:[0]});
  assert.deepEqual(p.nodes.at(-1).open,[]);
  assert.ok(proves(p,2,[],'RAIN → (RAIN ∧ RAIN)'));
  assert.deepEqual(fromLean(toLean(p)).proof.nodes.at(-1).open,[]);
});

test('disjunctive syllogism instantiates its derivation without implication detours',()=>{
  const x=fromLean('variable (A B : Prop)\nexample (h : A ∨ B) (na : ¬A) : B := by\n apply Or.elim h\n · intro a\n   exact False.elim (na a)\n · intro b\n   exact b');
  const l=makeLemma(x.proof,x.root,'Disjunctive syllogism');
  const p=start('(RAIN ∧ WIND) ∨ SNOW','¬(RAIN ∧ WIND)');
  const out=applyLemma(p,l,[0,1]);assert.equal(out.proof.nodes[out.root].rule,'orE');assert.deepEqual(out.proof.nodes[out.root].open,[0,1]);
  assert.ok(proves(out.proof,out.root,['(RAIN ∧ WIND) ∨ SNOW','¬(RAIN ∧ WIND)'],'SNOW'));
  assert.ok(!out.proof.nodes.some(n=>['impI','impE'].includes(n.rule)));assert.doesNotMatch(toProofSty(out.proof,out.root),/\\to [IE]/);
  assert.deepEqual(validateProof(out.proof),out.proof);assert.doesNotThrow(()=>fromLean(toLean(out.proof,out.root)));
});

test('substitution distinguishes an assumption open in one branch and discharged in another',()=>{
  let p=start('A');p=infer(p,'impI',[0],{discharge:[0]});p=infer(p,'andI',[0,1]);
  const out=applyLemma(start('RAIN'),makeLemma(p,2),[0]);
  assert.deepEqual(out.proof.nodes[out.root].open,[0]);assert.ok(proves(out.proof,out.root,['RAIN'],'RAIN ∧ (RAIN → RAIN)'));
  const conditional=out.proof.nodes.find(n=>n.rule==='impI');assert.notEqual(conditional.discharge[0],0);
});
