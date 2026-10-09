// Formalized exercise inputs shared by the practice components.
export const MODEL_REASONING_LEVELS = [
 {premises:['∀x (Human(x) → Mortal(x))','∃x Human(x)'],goal:'∃x Mortal(x)'},
 {premises:['∃x (Human(x) ∨ Mortal(x))'],goal:'(∃x Human(x)) ∨ (∃x Mortal(x))'},
 {premises:['∃x (Human(x) ∧ Mortal(x))'],goal:'(∃x Human(x)) ∧ (∃x Mortal(x))'},
 {premises:['∃x (Human(x) → Mortal(x))','∃x Human(x)'],goal:'∃x Mortal(x)'},
 {premises:['(∀x Human(x)) → (∀x Mortal(x))'],goal:'∀x (Human(x) → Mortal(x))'},
 {premises:['∃x Sibling(x,x)'],goal:'∀x∃y Sibling(x,y)'}
];
const library='∀x ∀y ((Member(x) ∧ Reserved(x,y)) → MayBorrow(x,y)); ∀x ∀y ((Librarian(x) ∧ Approved(x,y)) → MayBorrow(x,y)); ∀x ∀y (MayBorrow(x,y) → CanCollect(x,y)); Member(Ada); Reserved(Ada,Atlas); Librarian(Emmy); Approved(Emmy,Atlas)';
export const RESOLUTION_LEVELS = [
 ['Library: Ada',library+' ∴ CanCollect(Ada,Atlas)'],
 ['Library: Emmy',library+' ∴ CanCollect(Emmy,Atlas)'],
 ['Ancestry','∀x ∀y (Parent(x,y) → Ancestor(x,y)); ∀x ∀y ∀z ((Parent(x,y) ∧ Ancestor(y,z)) → Ancestor(x,z)); Parent(Ada,Bea); Parent(Bea,Cleo) ∴ Ancestor(Ada,Cleo)'],
 ['A shared project','∀x (Researcher(x) → ∃y (Project(y) ∧ WorksOn(x,y))); ∀x ∀y (WorksOn(x,y) → HasProject(x)); Researcher(Ada) ∴ ∃y (Project(y) ∧ WorksOn(Ada,y))'],
 ['Access by either route','∀x (Staff(x) ∨ Guest(x)); ∀x (Staff(x) → HasAccess(x)); ∀x (Guest(x) → HasAccess(x)) ∴ HasAccess(Ada)']
];
