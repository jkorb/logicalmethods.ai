import {fromLean} from './deduction-lean.js';
export const EXAMPLES=[
 {id:'heating',label:'Heating',premises:['RAIN','(RAIN ∨ WIND) → COLD','COLD → HEATING'],goal:'HEATING',hint:'Work back from HEATING: we need COLD. The other conditional asks for RAIN ∨ WIND, which we can introduce from RAIN.',code:`variable (RAIN WIND COLD HEATING : Prop)
example (rain : RAIN)
    (if_rain_or_wind_then_cold : RAIN ∨ WIND → COLD)
    (if_cold_then_heating : COLD → HEATING) : HEATING := by
  apply if_cold_then_heating
  apply if_rain_or_wind_then_cold
  apply Or.inl
  exact rain`},
 {id:'conditional',label:'Temporary assumption',premises:[],goal:'RAIN → (RAIN ∨ WIND)',hint:'The goal is a conditional. Assume RAIN temporarily, derive RAIN ∨ WIND, then discharge that assumption.',code:`variable (RAIN WIND : Prop)
example : RAIN → RAIN ∨ WIND := by
  intro rain
  apply Or.inl
  exact rain`},
 {id:'cases',label:'Two cases',premises:['SUN ∨ RAIN','¬SUN'],goal:'RAIN',hint:'The disjunction gives two cases. Derive RAIN in each case; only then discharge the two case assumptions.',code:`variable (SUN RAIN : Prop)
example (weather : SUN ∨ RAIN) (not_sun : ¬SUN) : RAIN := by
  apply Or.elim weather
  · intro sun
    apply False.elim
    apply not_sun
    exact sun
  · intro rain
    exact rain`},
 {id:'vacuous',label:'Unused assumption',premises:[],goal:'RAIN → (WIND → RAIN)',hint:'RAIN already proves the inner conclusion. We can discharge WIND without using it, and then discharge RAIN.',code:`variable (RAIN WIND : Prop)
example : RAIN → WIND → RAIN := by
  intro rain
  intro wind
  exact rain`},
 {id:'swap',label:'Swap conjuncts',premises:['RAIN ∧ WIND'],goal:'WIND ∧ RAIN',hint:'The goal is a conjunction: find a derivation of each conjunct, then join them with ∧ Intro.',code:`variable (RAIN WIND : Prop)
example (weather : RAIN ∧ WIND) : WIND ∧ RAIN := by
  apply And.intro
  · exact And.right weather
  · exact And.left weather`},
 {id:'classical',label:'Double negation',premises:['¬¬RAIN'],goal:'RAIN',hint:'Assume ¬RAIN. It contradicts ¬¬RAIN. The classical rule discharges ¬RAIN and concludes RAIN.',code:`variable (RAIN : Prop)
example (not_not_rain : ¬¬RAIN) : RAIN := by
  apply Classical.byContradiction
  intro not_rain
  exact not_not_rain not_rain`}
];
export function exampleProof(example){return fromLean(example.code);}
// Schematic displays use the same tree renderer, but are never passed off as checked proofs.
const leaf=label=>({label,children:[]}),tree=(label,rule,...children)=>({label,rule,children});
const sub=(a,b)=>tree(b,'⋮',leaf('['+a+']¹'));
export const SCHEMATA=[
 tree('A ∧ B','∧ Intro',leaf('A'),leaf('B')),
 tree('A','∧ Elim',leaf('A ∧ B')),tree('B','∧ Elim',leaf('A ∧ B')),
 tree('A ∨ B','∨ Intro',leaf('A')),tree('A ∨ B','∨ Intro',leaf('B')),
 tree('C','∨ Elim · 1, 2',leaf('A ∨ B'),sub('A','C'),tree('C','⋮',leaf('[B]²'))),
 tree('A → B','→ Intro · 1',sub('A','B')),
 tree('B','→ Elim',leaf('A → B'),leaf('A')),
 tree('¬A','¬ Intro · 1',sub('A','⊥')),
 tree('⊥','¬ Elim',leaf('¬A'),leaf('A')),
 tree('B','Ex falso',leaf('⊥')),
 tree('A','¬⊥ · 1 (classical)',sub('¬A','⊥')),
 tree('⊤','⊤ Intro'),tree('A ↔ B','↔ Intro',leaf('A → B'),leaf('B → A')),
 tree('A → B','↔ Elim',leaf('A ↔ B')),tree('B → A','↔ Elim',leaf('A ↔ B'))
];

// Teaching sequence and advice adapted from the author's tmp/natural_deduction slides.
export const STRATEGIES=[
 {id:'distribution-cases',label:'Cases, then conjunction',premises:['A ∨ (B ∧ C)'],goal:'(A ∨ B) ∧ (A ∨ C)',hint:'When dealing with a disjunctive premise, try to reach the conclusion in both cases. When trying to prove a conjunction, try proving both conjuncts.',tips:{orE:'Both cases are complete. Discharge the case assumptions, including their repeated uses.',andI:'Both intermediate goals have been reached. Put the two conjuncts together.',andL:'For the first disjunction, we can get B from B ∧ C.',andR:'For the second disjunction, we can get C from B ∧ C.'},code:`variable (A B C : Prop)
example (h : A ∨ (B ∧ C)) : (A ∨ B) ∧ (A ∨ C) := by
  apply Or.elim h
  · intro a
    apply And.intro
    · exact Or.inl a
    · exact Or.inl a
  · intro bc
    apply And.intro
    · exact Or.inr (And.left bc)
    · exact Or.inr (And.right bc)`},
 {id:'distribution-parts',label:'Use the conjuncts',premises:['A ∧ (B ∨ C)'],goal:'(A ∧ B) ∨ (A ∧ C)',hint:'When your premise is a conjunction, look at its conjuncts. A by itself does not give the goal. Use B ∨ C to split into cases.',tips:{orE:'We have reached the same disjunction in both cases. Discharge B and C.',orL:'In this case we can prove the left disjunct. Introduce the disjunction from it.',orR:'In this case we can prove the right disjunct. Introduce the disjunction from it.'},code:`variable (A B C : Prop)
example (h : A ∧ (B ∨ C)) : (A ∧ B) ∨ (A ∧ C) := by
  apply Or.elim (And.right h)
  · intro b
    apply Or.inl
    exact And.intro (And.left h) b
  · intro c
    apply Or.inr
    exact And.intro (And.left h) c`},
 {id:'conditional-cases',label:'Cases and discharge',premises:['¬A ∨ B'],goal:'A → B',hint:'Handle each case separately. When trying to prove a conditional, assume its antecedent and work towards its consequent.',tips:{impI:'Once you have reached the consequent, discharge the antecedent. It need not have been used: in the B case, this is vacuous discharge.',falseE:'The first case gives a contradiction under A. Ex falso supplies the consequent B.',orE:'Both cases establish A → B. Discharge the two case assumptions.'},code:`variable (A B : Prop)
example (h : ¬A ∨ B) : A → B := by
  apply Or.elim h
  · intro not_a
    intro a
    apply False.elim
    exact not_a a
  · intro b
    intro a
    exact b`},
 {id:'indirect',label:'An indirect proof',premises:['¬(A ∧ B)'],goal:'¬A ∨ ¬B',hint:'A negated conjunction is hard to use directly. Try an indirect proof: assume the negation of the goal, then try to derive A ∧ B to contradict the premise.',tips:{raa:'This is an indirect proof: the negated goal has led to a contradiction. The classical rule lets us discharge it.',andI:'The inner indirect proofs give A and B. Together they contradict the original premise.',orL:'To contradict ¬(¬A ∨ ¬B), introduce the disjunction from ¬A.',orR:'Use the analogous idea for ¬B.'},code:`variable (A B : Prop)
example (h : ¬(A ∧ B)) : ¬A ∨ ¬B := by
  apply Classical.byContradiction
  intro neg_goal
  apply h
  apply And.intro
  · apply Classical.byContradiction
    intro not_a
    exact neg_goal (Or.inl not_a)
  · apply Classical.byContradiction
    intro not_b
    exact neg_goal (Or.inr not_b)`}
];
