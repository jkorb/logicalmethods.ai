// Renderable occurrences with lexical binders, derived from the shared FOL tree.
export function bindingTokens(ast) {
  const tokens = [], quantifiers = [];
  const add = (text, extra = {}) => { const token = { text, id: tokens.length, ...extra }; tokens.push(token); return token; };
  function visit(n, env = new Map()) {
    if (n.kind === 'variable') { add(n.name, { kind:'variable', binder:env.get(n.name) ?? null }); return; }
    if (n.kind === 'constant') { add(n.name); return; }
    if (n.kind === 'quantifier') {
      const q=add(n.name+n.variable,{kind:'quantifier',variable:n.variable}); quantifiers.push(q);
      const local=new Map(env);local.set(n.variable,q.id);add(' ');visit(n.children[0],local);return;
    }
    if (['predicate','function'].includes(n.kind)) {
      add(n.name+'(');n.children.forEach((c,i)=>{if(i)add(', ');visit(c,env);});add(')');return;
    }
    if (n.name==='¬') { add('¬');visit(n.children[0],env);return; }
    if(n.kind!=='identity')add('(');visit(n.children[0],env);add(` ${n.name} `);visit(n.children[1],env);if(n.kind!=='identity')add(')');
  }
  visit(ast);
  return { tokens, quantifiers, free:tokens.filter(t=>t.kind==='variable' && t.binder===null) };
}
