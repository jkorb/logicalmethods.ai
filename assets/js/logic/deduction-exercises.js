// Proofs adapted from the exercise solutions by Alexander Apers.
export const EXERCISES = [
  {
    "id": "distribution_one_ltr",
    "group": "Conjunction and disjunction",
    "label": "1",
    "premises": [
      "(A ∧ (B ∨ C))"
    ],
    "goal": "((A ∧ B) ∨ (A ∧ C))",
    "code": "variable (A B C : Prop)\n\nexample (h : (A ∧ (B ∨ C))) : (A ∧ B) ∨ (A ∧ C) := by\n    apply Or.elim (And.right h)\n    · intro b\n      apply Or.inl\n      apply And.intro\n      · exact And.left h\n      · exact b\n    · intro c\n      apply Or.inr\n      apply And.intro\n      · exact And.left h\n      · exact c",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "distribution_one_rtl",
    "group": "Conjunction and disjunction",
    "label": "2",
    "premises": [
      "((A ∧ B) ∨ (A ∧ C))"
    ],
    "goal": "(A ∧ (B ∨ C))",
    "code": "variable (A B C : Prop)\n\nexample (h : (A ∧ B) ∨ (A ∧ C) ) : (A ∧ (B ∨ C)) := by\n    apply And.intro\n    apply Or.elim h\n    · intro a_and_b\n      apply And.left a_and_b\n    · intro a_and_c\n      apply And.left a_and_c\n    apply Or.elim h\n    · intro a_and_b\n      apply Or.inl\n      apply And.right a_and_b\n    · intro a_and_c\n      apply Or.inr\n      apply And.right a_and_c",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "distribution_two_ltr",
    "group": "Conjunction and disjunction",
    "label": "3",
    "premises": [
      "(A ∨ (B ∧ C))"
    ],
    "goal": "((A ∨ B) ∧ (A ∨ C))",
    "code": "variable (A B C : Prop)\n\nexample (h : (A ∨ (B ∧ C))) : (A ∨ B) ∧ (A ∨ C) := by\n    apply And.intro\n    apply Or.elim h\n    · intro a\n      apply Or.inl a\n    · intro b_and_c\n      apply Or.inr\n      · exact And.left b_and_c\n    apply Or.elim h\n    · intro a\n      apply Or.inl a\n    · intro b_and_c\n      apply Or.inr\n      · exact And.right b_and_c",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "distribution_two_rtl",
    "group": "Conjunction and disjunction",
    "label": "4",
    "premises": [
      "((A ∨ B) ∧ (A ∨ C))"
    ],
    "goal": "(A ∨ (B ∧ C))",
    "code": "variable (A B C : Prop)\n\nexample (h : (A ∨ B) ∧ (A ∨ C) ) : (A ∨ (B ∧ C)) := by\n    apply Or.elim (And.left h)\n    · intro a\n      apply Or.inl a\n    · intro b\n      apply Or.elim (And.right h)\n      · intro a\n        apply Or.inl a\n      · intro c\n        apply Or.inr\n        apply And.intro\n        · exact b\n        · exact c",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "double_negation_ltr",
    "group": "Negation",
    "label": "5",
    "premises": [
      "¬¬A"
    ],
    "goal": "A",
    "code": "variable (A B C : Prop)\n\nexample (h: ¬¬ A) : A := by\n    apply Classical.byContradiction\n    apply h",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "double_negation_rtl",
    "group": "Negation",
    "label": "6",
    "premises": [
      "A"
    ],
    "goal": "¬¬A",
    "code": "variable (A B C : Prop)\n\nexample (h : A) : ¬¬ A := by\n    intro a\n    apply a\n    exact h",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "de_morgan_one_ltr",
    "group": "Negation",
    "label": "7",
    "premises": [
      "¬(A ∧ B)"
    ],
    "goal": "(¬A ∨ ¬B)",
    "code": "variable (A B C : Prop)\n\nexample (h : ¬(A ∧ B)) : (¬ A ∨ ¬ B) := by\n    apply Classical.byContradiction\n    intro neg_goal\n    apply h\n    apply And.intro\n    apply Classical.byContradiction\n    intro neg_a\n    apply neg_goal\n    apply Or.inl neg_a\n    apply Classical.byContradiction\n    intro neg_b\n    apply neg_goal\n    apply Or.inr neg_b",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "de_morgan_one_rtl",
    "group": "Negation",
    "label": "8",
    "premises": [
      "(¬A ∨ ¬B)"
    ],
    "goal": "¬(A ∧ B)",
    "code": "variable (A B C : Prop)\n\nexample (h : (¬ A ∨ ¬ B)) : ¬(A ∧ B) := by\n    apply Or.elim h\n    · intro neg_a\n      · intro a_and_b\n        apply neg_a\n        apply And.left a_and_b\n    · intro neg_b\n      · intro a_and_b\n        apply neg_b\n        apply And.right a_and_b",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "de_morgan_two_ltr",
    "group": "Negation",
    "label": "9",
    "premises": [
      "¬(A ∨ B)"
    ],
    "goal": "(¬A ∧ ¬B)",
    "code": "variable (A B C : Prop)\n\nexample (h : ¬(A ∨ B)) : (¬ A ∧ ¬ B) := by\n    apply And.intro\n    · intro a\n      apply h\n      apply Or.inl a\n    · intro b\n      apply h\n      apply Or.inr b",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "de_morgan_two_rtl",
    "group": "Negation",
    "label": "10",
    "premises": [
      "(¬A ∧ ¬B)"
    ],
    "goal": "¬(A ∨ B)",
    "code": "variable (A B C : Prop)\n\nexample (h : (¬ A ∧ ¬ B)) :  ¬(A ∨ B) := by\n    intro a_or_b\n    apply Or.elim a_or_b\n    · intro a\n      apply And.left h\n      exact a\n    · intro b\n      apply And.right h\n      exact b",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "cond_def_ltr",
    "group": "Conditionals",
    "label": "11",
    "premises": [
      "(¬A ∨ B)"
    ],
    "goal": "(A → B)",
    "code": "variable (A B C : Prop)\n\nexample (h : ¬A ∨ B) : A → B := by\n    intro a\n    apply Or.elim h\n    · intro neg_a\n      apply False.elim\n      apply neg_a\n      exact a\n    · intro b\n      exact b",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "cond_def_rtl",
    "group": "Conditionals",
    "label": "12",
    "premises": [
      "(A → B)"
    ],
    "goal": "(¬A ∨ B)",
    "code": "variable (A B C : Prop)\n\nexample (h : A → B ) : ¬A ∨ B  := by\n    apply Classical.byContradiction\n    intro neg_goal\n    · apply neg_goal\n      apply Or.inl\n      · intro a\n        apply neg_goal\n        apply Or.inr\n        apply h\n        exact a",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "consequentia_mirabilis",
    "group": "Conditionals",
    "label": "13",
    "premises": [
      "(¬A → A)"
    ],
    "goal": "A",
    "code": "variable (A B C : Prop)\n\nexample (h : ¬ A → A) : A := by\n    apply Classical.byContradiction\n    intro neg_a\n    apply neg_a\n    apply h\n    apply neg_a",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "contrapos_ltr",
    "group": "Conditionals",
    "label": "14",
    "premises": [
      "(A → B)"
    ],
    "goal": "(¬B → ¬A)",
    "code": "variable (A B C : Prop)\n\nexample (h : A → B) : ¬B → ¬A := by\n    intro neg_b\n    · intro a\n      apply neg_b\n      apply h\n      exact a",
    "hint": "Look at the main connective of your goal, then at the premises you can use."
  },
  {
    "id": "contrapos_rtl",
    "group": "Conditionals",
    "label": "15",
    "premises": [
      "¬B → ¬A"
    ],
    "goal": "A → B",
    "hint": "Assume A. To establish B classically, try assuming ¬B.",
    "code": "variable (A B : Prop)\nexample (h : ¬B → ¬A) : A → B := by\n  intro a\n  apply Classical.byContradiction\n  intro not_b\n  exact (h not_b) a"
  }
];
