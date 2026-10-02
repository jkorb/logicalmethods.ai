import {el} from './boolean-ui.js';
// Same token classes as the book's Lean render hook; text nodes keep input inert.
const keywords=new Set('theorem lemma example def axiom variable variables open import namespace end section structure instance class inductive where with match do by fun let have show from calc sorry Prop Type True False Classical'.split(' '));
const tactics=new Set('intro intros apply exact refine rintro rcases cases constructor left right use simp rw rfl assumption contradiction trivial induction unfold linarith omega grind decide ring tauto exfalso specialize obtain byCases absurd'.split(' '));
export function highlightLean(target,source){
  target.replaceChildren();const tokens=source.match(/--[^\n]*|"(?:\\.|[^"\\])*"|\b[A-Za-z_][A-Za-z0-9_]*\b|[·⟨⟩←→↔∀∃∧∨¬≠≤≥⊢]|[^A-Za-z_·⟨⟩←→↔∀∃∧∨¬≠≤≥⊢-]+|./g)||[];
  for(const t of tokens){const cls=t.startsWith('--')?'c1':t.startsWith('"')?'s':keywords.has(t)?'k':tactics.has(t)?'nb':/^[·⟨⟩←→↔∀∃∧∨¬≠≤≥⊢]$/.test(t)?'o':'';target.append(cls?el('span',{class:cls},t):document.createTextNode(t));}
}
export const playgroundURL=source=>'https://live.lean-lang.org/#'+(source.includes('import Mathlib')?'project=mathlib-stable&':'')+'code='+encodeURIComponent(source);
