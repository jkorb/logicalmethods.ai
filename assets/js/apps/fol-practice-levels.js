// Levels use the same grammar and model data as the textbook.
export const scopeLevels = [
  '∀x P(x)',
  '(P(x) ∧ ∀x Q(x))',
  '∀x P(y)',
  '∀x ∃y R(x, y)',
  '(∀x P(x) ∧ ∃x Q(x))',
  '∃x (P(x) ∧ ∀x Q(x))',
  '∀x (R(x, y) → ∃y R(y, x))',
  '∀x (P(f(x)) ∨ ∃y R(g(x, y), y))',
  '∀x (∃x R(x, y) ∧ ∀y (P(x) → R(y, x)))',
  '∃x (∀y (R(x, y) → ∃x R(y, x)) ∧ R(x, z))'
];
export const builderLevels = [
  'f(a)', 'R(x, a)', 'P(f(x))', '¬P(a)', '(P(x) ∧ Q(x))',
  '∀x P(x)', '∃y R(x, y)', '∀x (P(x) → Q(x))',
  '∀x ∃y R(x, y)', '∃y ∀x R(x, y)',
  '∀x (P(x) ↔ ¬Q(f(x)))', '∀x (P(x) → ∃y (R(x, y) ∧ Q(y)))',
  '∀x ∃y x = y', 'R(g(a, x), f(y))'
];
export const modelLevels = [
  {formula:'Human(Socrates)', value:true},
  {formula:'Human(Socrates)', value:false},
  {formula:'(Human(Socrates) ∨ Mortal(MrSir))', value:true},
  {formula:'(Human(Socrates) ∨ Mortal(MrSir))', value:false},
  {formula:'∀x Human(x)', value:true},
  {formula:'∀x Human(x)', value:false},
  {formula:'∃x (Human(x) ∧ ¬Mortal(x))', value:true},
  {formula:'∀x (Human(x) → Mortal(x))', value:false},
  {formula:'∀x ∃y BiggerThan(y, x)', value:true},
  {formula:'∃y ∀x BiggerThan(y, x)', value:false},
  {formula:'∀x (Human(x) ∨ ¬Human(x))', value:false, impossible:true, reason:'For every object, Human(x) is either true or false; the disjunction is true in either case.'},
  {formula:'(∀x Human(x) → ∃x Human(x))', value:false, impossible:true, reason:'The domain is nonempty. If every object is human, some object is human.'},
  {formula:'∃x (Human(x) ∧ ¬Human(x))', value:true, impossible:true, reason:'No object can both belong and fail to belong to the same predicate extension.'},
  {formula:'(∃x ∀y BiggerThan(x, y) → ∀y ∃x BiggerThan(x, y))', value:false, impossible:true, reason:'An object related to every object supplies a witness for each choice of y.'},
  {formula:'(∀x ∃y BiggerThan(y, x) ∧ ¬∃y ∀x BiggerThan(y, x))', value:true}
];
export const queryLevels = [
  {label:'Predicate', formula:'LocatedIn(x, Europe)'},
  {label:'Identity', formula:'x = Japan'},
  {label:'Negation', formula:'¬LocatedIn(Japan, x)'},
  {label:'Conjunction', formula:'(LocatedIn(x, Europe) ∧ LanguageOf(x, English))'},
  {label:'Disjunction', formula:'(LocatedIn(x, Europe) ∨ LanguageOf(x, English))'},
  {label:'Implication', formula:'(LocatedIn(x, Europe) → LanguageOf(x, English))'},
  {label:'Biconditional', formula:'(LocatedIn(x, Europe) ↔ LanguageOf(x, English))'},
  {label:'Existential quantifier', formula:'∃y CapitalOf(y, x)'},
  {label:'Universal quantifier', formula:'∀y (LocatedIn(x, y) → y = Europe)'},
  {label:'Two free variables', formula:'(CapitalOf(x, y) ∧ LocatedIn(x, Europe))'},
  {label:'Nested query', formula:'∃y (CapitalOf(y, x) ∧ LocatedIn(y, Europe))'},
  {label:'Quantifier order', formula:'∀y (LocatedIn(y, Europe) → ∃z (LanguageOf(y, z) ∧ LanguageOf(x, z)))'}
];
export const initializationLevels = [ ['CapitalOf'], ['LocatedIn'], ['LanguageOf'], ['CapitalOf', 'LocatedIn'], ['Domain', 'CapitalOf', 'CityIn', 'LocatedIn', 'LanguageOf'] ];
