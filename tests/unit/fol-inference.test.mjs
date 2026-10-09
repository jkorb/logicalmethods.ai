import test from 'node:test';
import assert from 'node:assert/strict';
import {parseInference as parse,printFOL,unify,printBindings,clausify,substitute,resolveClauses,factorClause,readFOLProblem,nextResolution,printClause} from '../../assets/js/logic/fol-inference.js';
import {emptyProof,addAssumption,infer,validateProof,printFormula,proves} from '../../assets/js/logic/deduction.js';
import {deleteStep,makeLemma,applyLemma,toProofSty} from '../../assets/js/logic/deduction-tools.js';
import {FOL_EXAMPLES,exampleProof} from '../../assets/js/logic/deduction-examples.js';
import {toLean,fromLean} from '../../assets/js/logic/deduction-lean.js';
const term=s=>parse(s,'term'),clause=ss=>ss.map(s=>parse(s));
test('Robinson composes substitutions, detects indirect occurs cycles and fixed-symbol clashes',()=>{
 const u=unify([[term('y'),term('f(x)')],[term('x'),term('a')]]);
 assert.equal(u.ok,true);assert.equal(printBindings(u.bindings),'[y/f(a), x/a]');
 assert.equal(unify([[term('x'),term('f(y)')],[term('y'),term('g(x)')]]).ok,false);
 assert.equal(unify([[term('f(x)'),term('g(x)')]]).ok,false);
 assert.equal(unify([[term('x'),term('x')]]).ok,true);
 assert.throws(()=>unify([[parse('∀x P(x)'),parse('∀x P(x)')]]),/terms or atoms/);
});
test('substitution rejects capture and leaves a shadowed binder intact',()=>{
 assert.throws(()=>substitute(parse('∃y R(x, y)'),{x:term('y')}),/capture/);
 assert.equal(printFOL(substitute(parse('∀x P(x)'),{x:term('a')})),'∀x P(x)');
});
test('Skolem dependencies follow lexical scope and symbols remain fresh across inputs',()=>{
 const a=clausify([parse('∀x ∃y R(x, y)')]);assert.match(printFOL(a.skolemized[0]),/sk₁\(x1\)/);
 const b=clausify([parse('∃y ∀x R(x, y)')]);assert.match(printFOL(b.skolemized[0]),/R\(x2, sk₁\)/);
 const c=clausify([parse('∀x ((∀y R(x, y)) ∨ ∃z R(x, z))')]);assert.match(printFOL(c.skolemized[0]),/R\(x1, sk₁\(x1\)\)/);
 const d=clausify([parse('∃x P(x)'),parse('∃x Q(x)'),parse('P(sk₁)')]);assert.match(printFOL(d.skolemized[0]),/sk₂/);assert.match(printFOL(d.skolemized[1]),/sk₃/);
 const e=clausify([parse('¬∃x P(x)')]);assert.equal(e.skolemized[0].name,'∀');assert.equal(e.skolemized[0].children[0].name,'¬');
 assert.throws(()=>clausify([parse('P(x)')]),/Close free variables/);
 assert.throws(()=>readFOLProblem('P(a) ∴'),/conclusion/);
 assert.throws(()=>readFOLProblem('a = b'),/equality-free/);
});
test('resolution renames separate uses, substitutes the entire resolvent, and checks polarity',()=>{
 assert.deepEqual(resolveClauses(clause(['P(x)']),clause(['¬P(f(x))']),0,0).clause,[]);
 assert.equal(printClause(resolveClauses(clause(['¬P(x)','Q(x)']),clause(['P(a)']),0,0).clause),'Q(a)');
 assert.throws(()=>resolveClauses(clause(['P(x)']),clause(['P(a)']),0,0),/polarity/);
 assert.equal(factorClause(clause(['P(x)','P(y)']),0,1).clause.length,1);
 assert.throws(()=>factorClause(clause(['P(x)','¬P(y)']),0,1),/same polarity/);
});
test('bounded search refutes Socrates, nested quantifier premises, and a factoring example',()=>{
 for(const source of ['∀x (Human(x) → Mortal(x)); Human(Socrates) ∴ Mortal(Socrates)','∀x ((∀y BiggerThan(x, y)) → Giant(x)); ∀z BiggerThan(PolyphemOS, z) ∴ Giant(PolyphemOS)','∀x ∀y (P(x) ∨ P(y)); ∀x ∀y (¬P(x) ∨ ¬P(y))']){
  const cs=readFOLProblem(source).clauses;for(let i=0;i<25&&!cs.some(c=>!c.length);i++){const o=nextResolution(cs);assert.ok(o,source);cs.push(o.clause);}assert.ok(cs.some(c=>!c.length),source);
 }
 const cs=readFOLProblem('∀x ((∀y BiggerThan(x, y)) → Giant(x)); BiggerThan(PolyphemOS, tinymouse) ∴ Giant(PolyphemOS)').clauses;
 for(let i=0;i<8;i++){const o=nextResolution(cs);if(!o)break;cs.push(o.clause);}assert.ok(cs.every(c=>c.length));
});
test('quantifier checker blocks capture, illicit generalization, and escaping witnesses',()=>{
 let p=addAssumption(emptyProof(),'Human(x)');assert.throws(()=>infer(p,'forallI',[0],{variable:'x'}),/open assumption/);
 p=addAssumption(emptyProof(),'∀x ∃y R(x, y)');assert.throws(()=>infer(p,'forallE',[0],{term:'y'}),/capture/);
 p=addAssumption(emptyProof(),'∃x P(x)');p=addAssumption(p,'P(z)');assert.throws(()=>infer(p,'existsE',[0,1],{variable:'z',discharge:[1]}),/fresh/);
 p=addAssumption(p,'Q(z)');assert.throws(()=>infer(p,'existsE',[0,2],{variable:'z',discharge:[1]}),/fresh/);
});
test('all FOL examples are checked, saved, exported and round-trip through bounded Lean',()=>{
 for(const e of FOL_EXAMPLES){const {proof,root}=exampleProof(e);assert.ok(proves(proof,root,e.premises,e.goal));assert.deepEqual(validateProof(proof),proof);
  const loaded=fromLean(toLean(proof));assert.ok(proves(loaded.proof,loaded.root,e.premises,e.goal));assert.doesNotMatch(toProofSty(proof),/undefined/);
  const lemma=makeLemma(proof,root,e.id);let target=e.premises.reduce((p,f)=>addAssumption(p,f),emptyProof());const selected=proof.nodes[root].open.map(h=>e.premises.findIndex(f=>printFormula(addAssumption(emptyProof(),f).nodes[0].formula)===printFormula(proof.nodes[h].formula)));
  const used=applyLemma(target,lemma,selected);assert.ok(proves(used.proof,used.root,e.premises,e.goal));
  assert.ok(deleteStep(proof,root).nodes.length<proof.nodes.length);
 }
});
test('Lean import rejects undeclared objects, holes and invalid eigenvariables',()=>{
 assert.throws(()=>fromLean('variable (Domain : Type)\nvariable (P : Domain → Prop)\nexample (h : ∀ x, P x) : ∃ x, P x := by\n  exact Exists.intro z (h z)'),/Unknown object/);
 assert.throws(()=>fromLean('variable (Domain : Type)\nvariable (P : Domain → Prop)\nexample (h : P z) : P z := by\n  exact h'),/Unknown object/);
 assert.throws(()=>fromLean(FOL_EXAMPLES[0].code.replace('exact hs','exact sorry')),/Holes/);
 let p=addAssumption(emptyProof(),'P(x)');const code=toLean(p);assert.match(code,/variable \(x : Domain\)/);assert.equal(fromLean(code).proof.nodes.length,1);
});
test('Lean export declares vacuous witnesses and internal arbitrary objects',()=>{
 let p=addAssumption(emptyProof(),'P(a)');p=infer(p,'existsI',[0],{formula:'∃x P(a)',term:'f(b)'});const s=toLean(p);assert.match(s,/variable \(f : Domain → Domain\)/);assert.match(s,/∃ x : Domain,/);assert.match(s,/variable \(a b : Domain\)/);assert.doesNotThrow(()=>fromLean(s));
 p=addAssumption(emptyProof(),'∀x P(x)');p=infer(p,'forallE',[0],{term:'z'});p=infer(p,'existsI',[1],{formula:'∃x P(x)',term:'z'});assert.match(toLean(p),/variable \(z : Domain\)/);assert.doesNotThrow(()=>fromLean(toLean(p)));
});
test('propositional letters and falsity can occur inside quantified derivations',()=>{
 const source='variable (Domain : Type)\nvariable (Human : Domain → Prop)\nvariable (A : Prop)\nexample : ∀ x, Human x → A → Human x := by\n  intro x\n  intro hx\n  intro ha\n  exact hx';
 const out=fromLean(source);assert.doesNotThrow(()=>fromLean(toLean(out.proof)));
 let p=addAssumption(emptyProof(),'¬Human(x)');p=addAssumption(p,'Human(x)');p=infer(p,'notE',[0,1]);p=infer(p,'impI',[2],{discharge:[1]});assert.doesNotThrow(()=>validateProof(p));
});

test('interactive unification checks operations, preserves rejected states, and accepts alternative orders',async()=>{
 const {startUnification,unificationStep:step}=await import('../../assets/js/logic/fol-practice.js');
 let s=startUnification('R(x, y); R(a, f(x))');assert.throws(()=>step(s,0,'eliminate','a'),/variable/);assert.equal(s.pending.length,1);
 s=step(s,0,'decompose');s=step(s,1,'eliminate','f(x)');assert.throws(()=>step(s,0,'finish'),/remain/);s=step(s,0,'eliminate','a');s=step(s,0,'finish');assert.equal(printBindings(s.bindings),'[y/f(a), x/a]');assert.ok(s.done);
 assert.throws(()=>step(startUnification('x; x'),0,'occurs'),/proper part/);assert.ok(step(startUnification('x; f(x)'),0,'occurs').done);
 assert.throws(()=>startUnification('P(x); ¬P(x)'),/different signs/);
});
test('student Skolemization checks fresh names, branches, normalization and dependency order',async()=>{
 const {startSkolemization:start,skolemStep:step}=await import('../../assets/js/logic/fol-practice.js');
 let s=start('∀x ((∀y R(x, y)) ∨ ∃z R(x, z))');
 assert.throws(()=>step(s,[0,1],'skolem','sk','x,y'),/exactly/);
 s=step(s,[0,1],'skolem','sk','x');assert.match(printFOL(s.tree),/sk\(x\)/);assert.ok(step(s,[],'finish').done);
 assert.throws(()=>step(start('∀x ∃y R(x,y)'),[0],'skolem','sk',''),/exactly/);
 assert.throws(()=>step(start('∃x P(sk)'),[],'skolem','sk',''),/fresh/);
 s=start('¬∀x P(x)');assert.throws(()=>step(s,[0],'skolem','sk',''),/negations/);s=step(s,[],'negated-quantifier');s=step(s,[],'skolem','sk','');assert.equal(printFOL(s.tree),'¬P(sk)');
 s=start('(∃x P(x)) ∧ (∀x Q(x))');assert.throws(()=>step(s,[0],'skolem','sk',''),/distinct/);s=step(s,[1],'rename','y');s=step(s,[0],'skolem','sk','');assert.ok(step(s,[],'finish').done);
 assert.throws(()=>step(start('∃x ∃y R(x,y)'),[0],'skolem','sk',''),/enclosing/);
});
test('equality rules check substitution instances and capture, and replay partial replacements',()=>{
 let p=addAssumption(emptyProof(),'a = b');p=infer(p,'eqI',[],{term:'a'});p=infer(p,'eqE',[0,1],{formula:'x = a',variable:'x'});assert.equal(printFormula(p.nodes.at(-1).formula),'b = a');
 assert.doesNotThrow(()=>fromLean(toLean(p)));assert.deepEqual(validateProof(p),p);
 let q=addAssumption(emptyProof(),'a = y');q=addAssumption(q,'∀y R(a,y)');assert.throws(()=>infer(q,'eqE',[0,1],{formula:'∀y R(x,y)',variable:'x'}),/capture/);
 assert.throws(()=>infer(p,'eqE',[0,1],{formula:'Human(x)',variable:'x'}),/second premise/);
});
test('all FOL exercise solutions and exports are checked tactic proofs',async()=>{
 const {FOL_EXERCISES}=await import('../../assets/js/logic/deduction-fol-exercises.js');
 for(const e of [...FOL_EXAMPLES,...FOL_EXERCISES]){const out=exampleProof(e),code=toLean(out.proof,out.root);assert.doesNotMatch(code,/\bfun\b/);assert.doesNotMatch(code,/\bTerm\b/);const back=fromLean(code);assert.ok(proves(back.proof,back.root,e.premises,e.goal),e.id);}
 const e=FOL_EXERCISES.find(e=>e.id==='nonempty');assert.throws(()=>fromLean(e.code.replace('[Inhabited Domain]','')),/Unknown object/);
 assert.match(toLean(exampleProof(e).proof),/\[Inhabited Domain\]/);
});
test('quantifier plans enforce witness scope and finish through the same checker',async()=>{
 const {newGoal,expandGoal,settleGoals,validateGoals}=await import('../../assets/js/logic/deduction-goals.js');
 let p=addAssumption(emptyProof(),'∀x P(x)'),plan=newGoal('∃x P(x)',[0]);let out=expandGoal(p,plan,[],'existsI','default');out=expandGoal(out.proof,out.plan,[0],'forallE','∀x P(x); default');const done=settleGoals(out.proof,[out.plan]);assert.ok(proves(done.proof,done.plans[0].solved,['∀x P(x)'],'∃x P(x)'));assert.doesNotThrow(()=>validateGoals(done.proof,done.plans));
 p=addAssumption(emptyProof(),'∃x P(x)');assert.throws(()=>expandGoal(p,newGoal('P(z)',[0]),[],'existsE','∃x P(x); z'),/fresh/);
 out=expandGoal(p,newGoal('∃x P(x)',[0]),[],'existsE','∃x P(x); z');assert.doesNotThrow(()=>validateGoals(out.proof,[out.plan]));
 p=addAssumption(emptyProof(),'P(x)');assert.throws(()=>expandGoal(p,newGoal('∀x P(x)',[0]),[],'forallI'),/arbitrary/);
});

test('unfinished quantified plans export explicit holes without treating them as assumptions',async()=>{
 const {newGoal,expandGoal,goalToLean}=await import('../../assets/js/logic/deduction-goals.js');
 const out=expandGoal(emptyProof(),newGoal('∀x P(x)'),[],'forallI');const code=goalToLean(out.proof,out.plan);
 assert.match(code,/intro x/);assert.match(code,/show \(P x\) from sorry/);assert.throws(()=>fromLean(code),/Holes/);
});

test('Skolem demonstrations show local checked rewrites and the right witness dependencies',async()=>{
 const {skolemTrace,SKOLEM_LEVELS}=await import('../../assets/js/logic/fol-practice.js');
 for(const [,source] of SKOLEM_LEVELS){const trace=skolemTrace(source);assert.equal(trace[0].formula,printFOL(parse(source)));assert.match(trace.at(-1).explanation,/equisatisfiable/);assert.doesNotMatch(trace.at(-1).formula,/∃|→|↔/);}
 const steps=skolemTrace('∀x ((∀y BiggerThan(x,y)) → Giant(x))');assert.equal(steps.length,4);assert.match(steps[1].formula,/¬∀y/);assert.match(steps[2].formula,/∃y\s*¬/);assert.match(steps[3].formula,/sk₁\(x\)/);
 assert.match(skolemTrace('∃y ∀x R(x,y)').at(-1).formula,/R\(x, sk₁\)/);
});

test('compact quantified atoms retain their variables and reject capture',()=>{
 const p=addAssumption(emptyProof(),'∀x∃yRxy');
 assert.equal(printFormula(p.nodes[0].formula),'∀x ∃y R(x, y)');
 assert.throws(()=>infer(p,'forallE',[0],{term:'y'}),/capture/);
 assert.equal(p.nodes.length,1);
 const q=infer(p,'forallE',[0],{term:'z'});
 assert.equal(q.nodes[1].term,'z');assert.equal(printFormula(q.nodes[1].formula),'∃y R(z, y)');
 assert.deepEqual(validateProof(q),q);
 assert.equal(printFormula(addAssumption(emptyProof(),'Px').nodes[0].formula),'P(x)');
 assert.throws(()=>infer(addAssumption(emptyProof(),'Px'),'forallI',[0],{variable:'x'}),/open assumption/);
});

test('subscripted Skolem terms round-trip and renaming does not consume witness indices',async()=>{
 const {skolemTrace,startSkolemization,skolemStep}=await import('../../assets/js/logic/fol-practice.js');
 for(const source of ['sk₁', 'sk₁₀(x)', 'sk1(x)'])assert.equal(printFOL(term(source)),source);
 for(const trace of [skolemTrace('(∃x P(x)) ∧ (∀x Q(x))'),skolemTrace('∀x ∃y R(x,y)')]){
  assert.match(trace.at(-1).formula,/sk₁/);
  for(const step of trace)assert.equal(printFOL(parse(step.formula)),step.formula);
 }
 const s=skolemStep(startSkolemization('∀x ∃y R(x,y)'),[0],'skolem','sk₁','x');
 assert.equal(printFOL(s.tree),'∀x R(x, sk₁(x))');
 assert.throws(()=>skolemStep(startSkolemization('∃x P(sk₁)'),[],'skolem','sk₁'),/fresh/);
 const inputs=Array.from({length:11},()=>parse('∃x P(x)'));
 const prepared=clausify(inputs.slice(0,8).concat(parse('P(sk₁) ∧ P(sk₂)')));
 assert.match(printFOL(prepared.skolemized[7]),/sk₁₀/);
 for(const t of prepared.skolemized)assert.equal(printFOL(parse(printFOL(t))),printFOL(t));
});

test('countermodel exercises check every premise and the false conclusion',async()=>{
 const {readFileSync}=await import('node:fs');
 const {COUNTERMODEL_LEVELS,checkCountermodel}=await import('../../assets/js/logic/fol-countermodels.js');
 const config=JSON.parse(readFileSync(new URL('../../data/fol/people-relations.json',import.meta.url)));
 const base={domain:['jimmy','sir','socrates'],constants:config.model.constants,functions:{},predicates:{Human:[],Mortal:[],BiggerThan:[],Sibling:[]}};
 const solutions=[{Mortal:[['socrates']]},{BiggerThan:[['jimmy','sir'],['sir','socrates'],['socrates','jimmy']]},{Human:[['jimmy']],Mortal:[['sir'],['socrates']]},{Human:[['jimmy']],Mortal:[['sir']]},{Human:[['jimmy']]},{Human:[['jimmy']]}];
 for(const [i,problem] of COUNTERMODEL_LEVELS.entries()){
  assert.equal(checkCountermodel(problem,config.language,base).correct,false,problem.label);
  const result=checkCountermodel(problem,config.language,{...base,predicates:{...base.predicates,...solutions[i]}});
  assert.equal(result.correct,true,problem.label);assert.ok(result.premises.every(Boolean));assert.equal(result.conclusion,false);
 }
 const bothTrue={...base,predicates:{...base.predicates,Human:[['socrates']],Mortal:[['socrates']]}};
 assert.match(checkCountermodel(COUNTERMODEL_LEVELS[0],config.language,bothTrue).message,/conclusion is also true/);
 assert.equal(checkCountermodel(COUNTERMODEL_LEVELS[0],config.language,{...base,domain:[]}).correct,false);
});

test('library knowledge base resolves both requested permissions',()=>{
 const kb='∀x ∀y ((Member(x) ∧ Reserved(x,y)) → MayBorrow(x,y)); ∀x ∀y ((Librarian(x) ∧ Approved(x,y)) → MayBorrow(x,y)); ∀x ∀y (MayBorrow(x,y) → CanCollect(x,y)); Member(Ada); Reserved(Ada,Atlas); Librarian(Emmy); Approved(Emmy,Atlas)';
 for(const name of ['Ada','Emmy']){
  const clauses=readFOLProblem(kb+' ∴ CanCollect('+name+',Atlas)').clauses;
  for(let i=0;i<16&&!clauses.some(c=>!c.length);i++){const next=nextResolution(clauses);assert.ok(next);clauses.push(next.clause);}
  assert.ok(clauses.some(c=>!c.length));
 }
});
