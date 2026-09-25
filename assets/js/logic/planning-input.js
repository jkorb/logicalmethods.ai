// One input convention for planning language, states, and their displayed time indices.
export function planningAtoms(source, time) {
  if(source.length>1000)throw new Error('Use a shorter list of propositions.');
  const text=source.trim().replace(/~|!/gu,'¬');
  if(!text || /^none$/iu.test(text))return [];
  const token=/\s*(?:[,;∧]|&&?)?\s*(¬\s*)?([A-Za-z][A-Za-z_]*)(?:\s*\(([^()]*)\))?/gy;
  const atoms=[];let pos=0;
  while(pos<text.length) {
    token.lastIndex=pos;const m=token.exec(text);
    if(!m)throw new Error('Separate propositions with spaces, commas or semicolons; use parentheses around arguments.');
    pos=token.lastIndex;let name=m[2],index;
    if(name==='On') {
      const args=(m[3]||'').match(/^\s*([RGB])\s*,?\s*([RGB])(?:\s*,?\s*(t|\d+))?\s*$/u);
      if(!args)throw new Error('Write On(R,G,t), with two block names and an optional time index.');
      name=`On(${args[1]},${args[2]})`;index=args[3];
    } else if(m[3]!==undefined) {
      index=m[3].trim();if(!/^(t|\d+)$/u.test(index))throw new Error('Use one time index for a monkey state atom.');
    }
    if(index!==undefined && index!=='t' && time!==undefined && Number(index)!==Number(time))throw new Error(`This field describes time ${time}; use that index or omit it.`);
    atoms.push((m[1]?'¬':'')+name);
    if(/^[\s,;]*$/u.test(text.slice(pos)))break;
  }
  return atoms;
}
export function timedAtom(atom,time) {
  return atom.endsWith(')')?atom.slice(0,-1)+','+time+')':atom+'('+time+')';
}
export const timedState=(source,time)=>planningAtoms(source).map(a=>timedAtom(a,time)).join('; ');
