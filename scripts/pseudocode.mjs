// Editorial checks for fenced textbook procedures, not a Python compiler.
export function pseudocodeIssues(markdown) {
  const issues=[];
  for(const match of markdown.matchAll(/^( *)```([^\n]*)\n([\s\S]*?)^\1```[ \t]*$/gm)) {
    const [,indent,info,rawBody]=match;
    const body=rawBody.split('\n').map(line=>line.startsWith(indent)?line.slice(indent.length):line).join('\n');
    if(!/^\s*(?:def|procedure|function|algorithm)\s+\w+\s*\(/m.test(body))continue;
    const start=markdown.slice(0,match.index).split('\n').length;
    const report=(line,message)=>issues.push({line:start+line,message});
    if(info.trim().split(/\s/)[0]!=='python')report(0,'Use a python fence for pseudocode.');
    body.split('\n').forEach((line,i)=>{
      // Quoted logical symbols and comments are not programming notation.
      const code=line.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#.*/g,'""');
      if(!code.trim())return;
      if(/^\s*\t|^ *\t/.test(line)||(line.match(/^ */)[0].length%4))report(i+1,'Indent with multiples of four spaces.');
      if(/[←⟵]|:=/.test(code))report(i+1,'Use = for assignment.');
      if(/^\s*(?:procedure|function|algorithm|let|const|var)\b/.test(code))report(i+1,'Use def and ordinary assignments.');
      if(/\b\w+\.\w+\s*\(/.test(code))report(i+1,'Use an explained helper call rather than an object method.');
      if(/^\s*\(?\w+\s*,[^=]*\)?\s*=(?!=)/.test(code))report(i+1,'Assign one name at a time; use explained helpers for pair members.');
      if(/&&|\|\||;\s*$/.test(code))report(i+1,'Use Python-like control-flow notation.');
      if(/^\s*(?:if|elif|while)\b/.test(code)&&/(?<![=!<>])=(?!=)/.test(code))report(i+1,'Use == for an equality test.');
      if(/^\s*(?:def|if|elif|else|for|while)\b/.test(code)&&!/:\s*$/.test(code))report(i+1,'End a block header with a colon.');
      if(/^\s*otherwise\s*:/.test(code))report(i+1,'Use else for the alternative branch.');
    });
  }
  return issues;
}
