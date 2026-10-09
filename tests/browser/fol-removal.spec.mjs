import { test, expect } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
import { reviewScreenshot } from './review-screenshot.mjs';
const app=(page,name)=>page.getByRole('region',{name,exact:true});
const model=root=>root.evaluate(n=>n.folModel.get());
async function view(root,name) {
  await root.getByRole('button',{name:'View',exact:true}).click();
  await root.getByRole('button',{name,exact:true}).click();
}
const member=(root,name,id)=>root.locator(`[data-relation='${JSON.stringify({name,args:[id]})}'] [data-object="${id}"]`).first();

for(const presentation of ['Semantic facts','Tables','Knowledge graph','Set diagram']) {
  test(`removing a unary membership preserves the rest of the model in ${presentation}`,async({page},info)=>{
    await page.goto('/textbook/fol/');const root=app(page,'Interpret predicates'),before=await model(root);
    await view(root,presentation);
    if(presentation==='Set diagram')await root.locator('[data-set-predicates]').getByRole('button',{name:'⟦Human⟧',exact:true}).click();
    const selection=presentation==='Knowledge graph'?root.getByRole('button',{name:'Select Human: Little Jimmy',exact:true}):presentation==='Set diagram'?root.locator('.fol-sets [data-object="jimmy"]'):member(root,'Human','jimmy');
    await selection.focus();await page.keyboard.press('Enter');
    await expect(root.getByRole('button',{name:'Delete Little Jimmy',exact:true})).toHaveCount(0);
    await expect(root.getByRole('button',{name:'Delete Human tuple',exact:true})).toBeVisible();
    if(presentation==='Knowledge graph') {
      expect((await new AxeBuilder({page}).include('.fol-app[aria-label="Interpret predicates"]').analyze()).violations).toEqual([]);
      await reviewScreenshot(root,{path:`tmp/fol-removal/graph-${info.project.name}.png`});
    }
    await root.getByRole('button',{name:'Delete Human tuple',exact:true}).click();
    const expected=structuredClone(before);expected.predicates.Human=expected.predicates.Human.filter(([d])=>d!=='jimmy');
    expect(await model(root)).toEqual(expected);
    if(presentation==='Set diagram') {
      await expect(root.locator('.fol-sets [data-object="jimmy"]')).toHaveCount(1);
      await root.locator('[data-set-predicates]').getByRole('button',{name:'D',exact:true}).click();
      await root.locator('.fol-sets [data-object="jimmy"]').click();
      await root.getByRole('button',{name:'Delete Little Jimmy',exact:true}).click();
      expect((await model(root)).domain).not.toContain('jimmy');
    }
  });
}

test('constant and function denotations clear locally in facts, tables and graphs',async({page})=>{
  await page.goto('/textbook/fol/');
  for(const presentation of ['Semantic facts','Tables','Knowledge graph','Set diagram']) {
    const root=app(page,'Interpret functions'),before=await model(root);
    await view(root,presentation);
    if(presentation==='Knowledge graph')await root.getByRole('button',{name:'Select fatherOf: Little Jimmy to Mr Sir',exact:true}).locator('.fol-edge-label').click();
    else await root.locator(`[data-relation='${JSON.stringify({name:'fatherOf',args:['jimmy'],output:'sir'})}'] [data-object="jimmy"]`).first().click();
    await root.getByRole('button',{name:'Delete fatherOf tuple',exact:true}).click();
    const expected=structuredClone(before);delete expected.functions.fatherOf['["jimmy"]'];expect(await model(root)).toEqual(expected);
    await expect(root.locator('[data-model-health]')).toContainText('Incomplete model');
    await root.evaluate((n,m)=>n.folModel.set(m),before);
    if(presentation==='Set diagram')continue;
    const constants=app(page,'Interpret constants'),original=await model(constants);await view(constants,presentation);
    if(presentation==='Knowledge graph')await constants.getByRole('button',{name:'Select LittleJimmy: Little Jimmy',exact:true}).click();
    else await constants.locator('[data-object="jimmy"][data-relation]').click();
    await constants.getByRole('button',{name:'Clear LittleJimmy denotation',exact:true}).click();
    const cleared=structuredClone(original);delete cleared.constants.LittleJimmy;expect(await model(constants)).toEqual(cleared);
    await constants.evaluate((n,m)=>n.folModel.set(m),original);
  }
});

test('tuple cells and context actions delete relations rather than their objects',async({page})=>{
  await page.goto('/textbook/fol/');const root=app(page,'Interpret predicates');
  for(const presentation of ['Semantic facts','Tables','Set diagram']) {
    const before=await model(root);await view(root,presentation);
    if(presentation==='Set diagram')await root.locator('[data-set-predicates]').getByRole('button',{name:'⟦BiggerThan⟧',exact:true}).click();
    const tuple=root.locator(`[data-relation='${JSON.stringify({name:'BiggerThan',args:['sir','jimmy']})}']`).first();
    await tuple.locator('[data-object="jimmy"]').click();
    await expect(root.getByRole('button',{name:'Delete BiggerThan tuple',exact:true})).toBeVisible();
    await expect(root.getByRole('button',{name:'Delete Little Jimmy',exact:true})).toHaveCount(0);
    await tuple.locator('[data-object="jimmy"]').click({button:'right'});
    await expect(root.locator('[data-context]').getByRole('button',{name:'Delete object',exact:true})).toHaveCount(0);
    await root.locator('[data-context]').getByRole('button',{name:'Delete BiggerThan tuple',exact:true}).click();
    const expected=structuredClone(before);expected.predicates.BiggerThan=expected.predicates.BiggerThan.filter(row=>JSON.stringify(row)!=='["sir","jimmy"]');expect(await model(root)).toEqual(expected);
    await root.evaluate((n,m)=>n.folModel.set(m),before);
  }
});

test('overlapping sets let each membership be removed independently',async({page},info)=>{
  await page.goto('/textbook/fol/');const root=app(page,'Interpret predicates'),before=await model(root);
  await view(root,'Set diagram');await root.getByRole('button',{name:'Together',exact:true}).click();
  await root.locator('.fol-sets [data-object="jimmy"]').click();
  await expect(root.getByRole('button',{name:'Delete Little Jimmy',exact:true})).toHaveCount(0);
  await root.getByRole('button',{name:'Select Human: Little Jimmy',exact:true}).click();
  await reviewScreenshot(root,{path:`tmp/fol-removal/overlap-${info.project.name}.png`});
  await root.getByRole('button',{name:'Delete Human tuple',exact:true}).click();
  const expected=structuredClone(before);expected.predicates.Human=expected.predicates.Human.filter(([d])=>d!=='jimmy');expect(await model(root)).toEqual(expected);
  await root.locator('.fol-sets [data-object="jimmy"]').click();await root.getByRole('button',{name:'Select Mortal: Little Jimmy',exact:true}).click();await root.getByRole('button',{name:'Delete Mortal tuple',exact:true}).click();
  expected.predicates.Mortal=expected.predicates.Mortal.filter(([d])=>d!=='jimmy');expect(await model(root)).toEqual(expected);
});

test('function tables clear one value for functions of two or more arguments',async({page})=>{
  const initial={domain:['jimmy','sir'],constants:{a:'jimmy'},functions:{f:{},g:{}},predicates:{}};
  for(const a of initial.domain)for(const b of initial.domain){initial.functions.f[JSON.stringify([a,b])]='sir';for(const c of initial.domain)initial.functions.g[JSON.stringify([a,b,c])]='sir';}
  await page.route('**/textbook/fol/',async route=>{
    const response=await route.fetch();
    const body=(await response.text()).replace(/(<script[^>]*data-fol-config[^>]*>)([\s\S]*?)(<\/script>)/g,(whole,start,json,end)=>{
      const config=JSON.parse(json);if(!config.language.functions.fatherOf)return whole;
      return start+JSON.stringify({...config,language:{constants:['a'],functions:{f:2,g:3},predicates:{}},model:initial})+end;
    });
    await route.fulfill({response,body});
  });
  await page.goto('/textbook/fol/');const root=app(page,'Interpret functions');
  const expected=structuredClone(initial);
  for(const [name,args] of [['f',['jimmy','sir']],['g',['jimmy','sir','jimmy']]]) {
    const descriptor={name,args,output:'sir'};
    await root.getByRole('table',{name:`⟦${name}⟧`,exact:true}).locator(`[data-object="sir"][data-relation='${JSON.stringify(descriptor)}']`).last().click();
    await root.getByRole('button',{name:`Delete ${name} tuple`,exact:true}).click();
    delete expected.functions[name][JSON.stringify(args)];expect(await model(root)).toEqual(expected);
  }
});
