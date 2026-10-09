import {parseFOL,printFOL} from '../logic/fol-parser.js';
import {consequenceTrace,partialInterpretation} from '../logic/fol-consequence.js';
export function consequenceWalkthrough(config){
  const selected=new Set(config.premises);
  function run(goal){
    const ast=parseFOL(goal,{language:config.language,mode:'conventional'});
    const canonical=printFOL(parseFOL(config.goal,{language:config.language,mode:'conventional'}));
    if(selected.size===config.premises.length&&printFOL(ast)===canonical&&config.walkthrough){
      const language={...config.language,constants:[...config.language.constants,...(config.arbitrary||[])]};
      return {ast,result:'true',steps:config.walkthrough.map(step=>({...step,known:(step.known||[]).map(formula=>parseFOL(formula,{language,mode:'conventional'}))}))};
    }
    return {ast,...consequenceTrace([...selected],goal,config.language)};
  }
  function modelAt(result,index,objects){
    const frame=partialInterpretation(config,[...selected],result.steps.slice(0,index+1));
    for(const object of frame.objects)if(!objects.has(object.id))objects.set(object.id,object);
    return frame.model;
  }
  return {selected,run,modelAt,toggle:p=>selected.has(p)?selected.delete(p):selected.add(p)};
}
