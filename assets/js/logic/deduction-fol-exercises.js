// Quantifier exercises use the same checked canvas and Lean reader as chapter 7.
const header='variable (Domain : Type) [Inhabited Domain]\nvariable (A B : Domain → Prop) (R : Domain → Domain → Prop) (C : Prop)\n';
const level=(id,group,label,premises,goal,hint,code)=>({id,group,label,premises,goal,hint,code:header+code});
export const FOL_EXERCISES=[
 level('duality-one-ltr','Duality','1',['¬∀x A(x)'],'∃x ¬A(x)','Assume there is no counterexample. For arbitrary x, derive A(x) by contradiction, then contradict the premise.',`example (h : ¬∀ x, A x) : ∃ x, ¬A x := by
  apply Classical.byContradiction
  intro hn
  apply h
  intro x
  apply Classical.byContradiction
  intro hx
  apply hn
  apply Exists.intro x
  exact hx`),
 level('duality-one-rtl','Duality','2',['∃x ¬A(x)'],'¬∀x A(x)','Open the existential premise and instantiate the assumed universal at that witness.',`example (h : ∃ x, ¬A x) : ¬∀ x, A x := by
  intro all
  apply Exists.elim h
  intro x hx
  exact hx (all x)`),
 level('duality-two-ltr','Duality','3',['¬∃x A(x)'],'∀x ¬A(x)','For arbitrary x, an assumption A(x) would provide the forbidden existential witness.',`example (h : ¬∃ x, A x) : ∀ x, ¬A x := by
  intro x
  intro hx
  apply h
  apply Exists.intro x
  exact hx`),
 level('duality-two-rtl','Duality','4',['∀x ¬A(x)'],'¬∃x A(x)','Open the assumed existential and apply the universal negation to its witness.',`example (h : ∀ x, ¬A x) : ¬∃ x, A x := by
  intro ex
  apply Exists.elim ex
  intro x hx
  exact (h x) hx`),
 level('all-and-ltr','Distribution','5',['∀x (A(x) ∧ B(x))'],'(∀x A(x)) ∧ (∀x B(x))','Prove each universal conjunct separately, instantiating the premise at an arbitrary object.',`example (h : ∀ x, A x ∧ B x) : (∀ x, A x) ∧ (∀ x, B x) := by
  apply And.intro
  · intro x
    exact And.left (h x)
  · intro x
    exact And.right (h x)`),
 level('all-and-rtl','Distribution','6',['(∀x A(x)) ∧ (∀x B(x))'],'∀x (A(x) ∧ B(x))','Introduce the arbitrary object first, then combine the two instances.',`example (h : (∀ x, A x) ∧ (∀ x, B x)) : ∀ x, A x ∧ B x := by
  intro x
  apply And.intro
  · exact (And.left h) x
  · exact (And.right h) x`),
 level('exists-or-ltr','Distribution','7',['∃x (A(x) ∨ B(x))'],'(∃x A(x)) ∨ (∃x B(x))','Open the witness subproof, then use cases on its disjunction.',`example (h : ∃ x, A x ∨ B x) : (∃ x, A x) ∨ (∃ x, B x) := by
  apply Exists.elim h
  intro x hx
  apply Or.elim hx
  · intro ha
    apply Or.inl
    apply Exists.intro x
    exact ha
  · intro hb
    apply Or.inr
    apply Exists.intro x
    exact hb`),
 level('exists-or-rtl','Distribution','8',['(∃x A(x)) ∨ (∃x B(x))'],'∃x (A(x) ∨ B(x))','Use cases first. Each case supplies its own existential witness.',`example (h : (∃ x, A x) ∨ (∃ x, B x)) : ∃ x, A x ∨ B x := by
  apply Or.elim h
  · intro ha
    apply Exists.elim ha
    intro x hx
    apply Exists.intro x
    apply Or.inl
    exact hx
  · intro hb
    apply Exists.elim hb
    intro x hx
    apply Exists.intro x
    apply Or.inr
    exact hx`),
 level('nonempty','Interaction','9',['∀x A(x)'],'∃x A(x)','Use default as an arbitrary object of our nonempty domain. Instantiate the premise there.',`example (h : ∀ x, A x) : ∃ x, A x := by
  apply Exists.intro (default : Domain)
  exact h default`),
 level('switcheroo','Interaction','10',['∃x ∀y R(x,y)'],'∀y ∃x R(x,y)','Open the existential premise. Its witness works for each arbitrary y.',`example (h : ∃ x, ∀ y, R x y) : ∀ y, ∃ x, R x y := by
  intro y
  apply Exists.elim h
  intro x hx
  apply Exists.intro x
  exact hx y`),
 level('exists-to-forall','Interaction','11',['(∃x A(x)) → C'],'∀x (A(x) → C)','Assume A(x). It supplies the existential antecedent needed for C.',`example (h : (∃ x, A x) → C) : ∀ x, A x → C := by
  intro x
  intro hx
  apply h
  apply Exists.intro x
  exact hx`),
 level('forall-to-exists','Interaction','12',['(∀x A(x)) → C'],'∃x (A(x) → C)','Use classical contradiction. If no object makes A(x) → C true, every object must satisfy A, and the premise supplies C.',`example (h : (∀ x, A x) → C) : ∃ x, A x → C := by
  apply Classical.byContradiction
  intro hn
  apply hn
  apply Exists.intro (default : Domain)
  intro hd
  apply h
  intro x
  apply Classical.byContradiction
  intro hx
  apply hn
  apply Exists.intro x
  intro ax
  apply False.elim
  exact hx ax`)
];
