// Priest, Natural Deduction Systems for Logics in the FDE Family, §§3,6.
// https://grahampriest.net/?ddownload=3082 — K3 adds Explosion and unrestricted ∨I.
import {emptyProof,addAssumption,infer,validateProof} from './deduction.js';
import {SCHEMATA} from './deduction-examples.js';
const leaf=label=>({label,children:[]}),tree=(label,rule,...children)=>({label,rule,children});
export const K3_GROUPS=[['∧',['andI','andL','andR']],['∨',['orL','orR','orE']],['DN',['dnI','dnE']],['DeM',['dmAnd','dmAndBack','dmOr','dmOrBack']],['Explosion',['k3Explosion']]];
const extra={
 dnI:tree('¬¬A','DN',leaf('A')),dnE:tree('A','DN',leaf('¬¬A')),
 dmAnd:tree('¬A ∨ ¬B','DeM',leaf('¬(A ∧ B)')),dmAndBack:tree('¬(A ∧ B)','DeM',leaf('¬A ∨ ¬B')),
 dmOr:tree('¬A ∧ ¬B','DeM',leaf('¬(A ∨ B)')),dmOrBack:tree('¬(A ∨ B)','DeM',leaf('¬A ∧ ¬B')),
 k3Explosion:tree('C','Explosion',leaf('A'),leaf('¬A'))
};
export const k3Schema=key=>extra[key]||SCHEMATA[['andI','andL','andR','orL','orR','orE'].indexOf(key)];
export const K3_EXAMPLES=[
 {id:'k3-ds',label:'Disjunctive syllogism',group:'Cases',premises:['SUN ∨ RAIN','¬SUN'],goal:'RAIN',hint:'Use ∨ Elim. In the SUN case, apply Explosion to SUN and ¬SUN. The RAIN case already gives RAIN.',steps:[
  ['assumption','SUN'],['k3Explosion',[2,1],{formula:'RAIN'}],['assumption','RAIN'],['orE',[0,3,4],{discharge:[2,4]}]]},
 {id:'k3-negative',label:'Negated disjunction',group:'Negation',premises:['¬(SUN ∨ RAIN)'],goal:'¬SUN',hint:'De Morgan gives ¬SUN ∧ ¬RAIN. Eliminate the conjunction.',steps:[['dmOr',[0]],['andL',[1]]]},
 {id:'k3-dn',label:'Double negation',group:'Negation',premises:['SUN'],goal:'¬¬SUN',hint:'Use DN directly.',steps:[['dnI',[0]]]},
 {id:'k3-demorgan',label:'De Morgan backwards',group:'Negation',premises:['¬SUN','¬RAIN'],goal:'¬(SUN ∨ RAIN)',hint:'Join the two negations, then use De Morgan in the reverse direction.',steps:[['andI',[0,1]],['dmOrBack',[2]]]},
 {id:'k3-swap',label:'Negation inside negation',group:'Negation',premises:['¬(SUN ∨ ¬RAIN)'],goal:'¬SUN ∧ RAIN',hint:'Use De Morgan, then eliminate the double negation before joining the results.',steps:[['dmOr',[0]],['andL',[1]],['andR',[1]],['dnE',[3]],['andI',[2,4]]]},
 {id:'k3-mp',label:'Material modus ponens',group:'Cases',premises:['¬SUN ∨ RAIN','SUN'],goal:'RAIN',hint:'Take the two cases ¬SUN and RAIN. In the first, use Explosion on SUN and ¬SUN.',steps:[['assumption','¬SUN'],['k3Explosion',[2,1],{formula:'RAIN'}],['assumption','RAIN'],['orE',[0,3,4],{discharge:[2,4]}]]},
 {id:'k3-negative-cases',label:'Negated conjunction',group:'Cases',premises:['¬(SUN ∧ RAIN)','SUN'],goal:'¬RAIN',hint:'De Morgan gives a disjunction. Use cases and Explosion in the ¬SUN branch.',steps:[['dmAnd',[0]],['assumption','¬SUN'],['k3Explosion',[3,1],{formula:'¬RAIN'}],['assumption','¬RAIN'],['orE',[2,4,5],{discharge:[3,5]}]]},
 {id:'k3-contraposition',label:'Material contraposition',group:'Cases',premises:['¬SUN ∨ RAIN'],goal:'¬¬RAIN ∨ ¬SUN',hint:'Take cases. From ¬SUN introduce the right disjunct; from RAIN first introduce double negation.',steps:[['assumption','¬SUN'],['orR',[1],{formula:'¬¬RAIN'}],['assumption','RAIN'],['dnI',[3]],['orL',[4],{formula:'¬SUN'}],['orE',[0,2,5],{discharge:[1,3]}]]},
 {id:'k3-negative-disjunction',label:'Negated negative conjunction',group:'Cases',premises:['¬(¬SUN ∧ ¬RAIN)'],goal:'SUN ∨ RAIN',hint:'De Morgan gives ¬¬SUN ∨ ¬¬RAIN. Take cases and eliminate double negation in each.',steps:[['dmAnd',[0]],['assumption','¬¬SUN'],['dnE',[2]],['orL',[3],{formula:'RAIN'}],['assumption','¬¬RAIN'],['dnE',[5]],['orR',[6],{formula:'SUN'}],['orE',[1,4,7],{discharge:[2,5]}]]}
];
export function k3ExampleProof(example){
 let proof=example.premises.reduce((p,f)=>addAssumption(p,f),emptyProof('k3'));
 for(const [rule,parents,options={}] of example.steps)proof=rule==='assumption'?addAssumption(proof,parents):infer(proof,rule,parents,options);
 return {proof:validateProof(proof,'k3'),root:proof.nodes.length-1};
}
