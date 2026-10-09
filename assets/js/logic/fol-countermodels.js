import {parseFOL} from './fol-parser.js';
import {validateModel,evaluateFOL} from './fol-model.js';

export const COUNTERMODEL_LEVELS=[
 {label:'Converse',premises:['∀x (Human(x) → Mortal(x))','Mortal(Socrates)'],goal:'Human(Socrates)'},
 {label:'Quantifier order',premises:['∀x ∃y BiggerThan(x,y)'],goal:'∃y ∀x BiggerThan(x,y)'},
 {label:'Universal disjunction',premises:['∀x (Human(x) ∨ Mortal(x))'],goal:'(∀x Human(x)) ∨ (∀x Mortal(x))'},
 {label:'Separate witnesses',premises:['∃x Human(x)','∃x Mortal(x)'],goal:'∃x (Human(x) ∧ Mortal(x))'},
 {label:'Existential to universal',premises:['∃x Human(x)'],goal:'∀x Human(x)'},
 {label:'Negating a universal',premises:['¬∀x Human(x)'],goal:'∀x ¬Human(x)'}
];

export function checkCountermodel(problem,language,model){
 const errors=validateModel(language,model);
 if(errors.length)return {correct:false,message:errors[0]};
 const value=source=>evaluateFOL(parseFOL(source,{language,mode:'conventional'}),language,model,{}).value;
 const premises=problem.premises.map(value),conclusion=value(problem.goal);
 const failed=premises.findIndex(p=>!p);
 if(failed>=0)return {correct:false,premises,conclusion,message:`Premise ${failed+1} is false: ${problem.premises[failed]}. Make every premise true.`};
 if(conclusion)return {correct:false,premises,conclusion,message:'The premises are true, but the conclusion is also true. Make the conclusion false while keeping every premise true.'};
 return {correct:true,premises,conclusion,message:'Correct: every premise is true and the conclusion is false. Your model is a countermodel.'};
}
