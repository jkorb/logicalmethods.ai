import { reviewScreenshot } from './review-screenshot.mjs';
import { test, expect } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
const chapter = '/textbook/fol/';
const app = (page, name) => page.locator('.fol-app').and(page.getByRole('region', { name, exact: true }));
const object = (root, name) => root.locator('[data-display]').getByRole('button', { name: `Select ${name}`, exact: true }).first();
async function menu(root, name) { const b=root.getByRole('button',{name,exact:true}); if(await b.getAttribute('aria-expanded')!=='true')await b.click(); }
async function symbol(root, name) { await menu(root,'Modify'); await root.locator('[data-panel="model"]').getByRole('button',{name:`Interpret ${name}`,exact:true}).click(); }
async function view(root,name) { await menu(root,'View'); await root.getByRole('button',{name,exact:true}).click(); }
async function last(root) { const b=root.getByRole('button',{name:'Last step',exact:true}); if(await b.isEnabled())await b.click(); }
async function check(root, formula) { if(formula){await root.getByRole('button',{name:'Edit formula',exact:true}).click();await root.getByLabel('Formula',{exact:true}).fill(formula);}await root.getByRole('button',{name:'Check',exact:true}).click();await last(root); }
async function palette(root) { await menu(root,'Modify'); const d=root.locator('[data-domain-menu]');if(!(await d.getAttribute('open')!==null))await d.locator('summary').click(); }

test('FOL trees fit without upscaling and the alphabet has eight colors', async ({page},info)=>{
  await page.goto(chapter);
  for(const parser of await page.locator('[data-logic-app="parser"]').all()) {
    await parser.getByRole('button',{name:'Last step',exact:true}).click(); await expect(parser.getByRole('status')).toContainText('Parsing finished');
    const size=await parser.locator('.logic-app__tree').evaluate(n=>({width:n.clientWidth,scroll:n.scrollWidth})); expect(size.scroll).toBeLessThanOrEqual(size.width+1);
  }
  for(const theme of ['light','dark']) {await page.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);expect(await page.locator('.annotated-math__group').evaluateAll(ns=>new Set(ns.map(n=>getComputedStyle(n).color)).size)).toBe(8);}
  await reviewScreenshot(page.locator('.annotated-math'),{path:`tmp/fol-review/revision-8/alphabet-${info.project.name}.png`});
});

test('component models have compact menus and no satisfaction UI',async({page})=>{
  await page.goto(chapter);
  const domain=app(page,'Choose a domain');await expect(domain.locator('[data-evaluate]')).toBeHidden();await expect(domain.locator('.fol-explanation')).toBeHidden();
  await palette(domain);await domain.getByRole('button',{name:'Add Rabbit',exact:true}).click();await expect(domain.locator('[data-model-health]')).toContainText('6 objects');
  await domain.getByRole('button',{name:'Modify',exact:true}).click(); await object(domain,'Rabbit').click();await domain.getByRole('button',{name:'Delete Rabbit',exact:true}).click();
  await expect(object(domain,'Rabbit')).toHaveCount(0);
  const constants=app(page,'Interpret constants');await symbol(constants,'Socrates');await expect(constants.locator('.fol-active-denotation')).not.toHaveCount(0);
  await object(constants,'Little Jimmy').click();await view(constants,'Semantic facts');
  const fact=constants.locator('[data-interpretation="constant:Socrates"]').first();await expect(fact.locator('[data-object="jimmy"]')).toHaveCount(1);
  await menu(constants,'Modify');await expect(constants.locator('[data-panel="model"]')).not.toContainText('Remove object');await expect(constants.locator('[data-panel="model"]')).not.toContainText('New model');
  await constants.getByRole('button',{name:'Reset model',exact:true}).click();await expect(fact.locator('[data-object="socrates"]')).toHaveCount(1);
  await expect(domain.locator('[data-display] [data-object]')).toHaveCount(5);
});

test('function and predicate interpretations are editable with keyboard and table selections',async({page})=>{
  await page.goto(chapter);const functions=app(page,'Interpret functions');await palette(functions);await functions.getByRole('button',{name:'Add Rabbit',exact:true}).click();await expect(functions.locator('[data-model-health]')).toContainText('Incomplete model');
  await symbol(functions,'fatherOf');await expect(functions.locator('.fol-active-interpretation')).not.toHaveCount(0);
  await object(functions,'Rabbit').focus();await page.keyboard.press('Enter');await object(functions,'Rabbit').focus();await page.keyboard.press('Enter');
  await menu(functions,'Modify');await expect(functions.locator('[data-model-health]')).toContainText('Complete model');
  const predicates=app(page,'Interpret predicates');await symbol(predicates,'Mortal');await object(predicates,'Little Jimmy').click();
  await expect(predicates.getByRole('table',{name:'⟦Mortal⟧',exact:true}).locator('[data-object="jimmy"]')).toHaveCount(0);
  await view(predicates,'Set diagram');await expect(predicates.locator('[data-set-predicates]')).toBeVisible();await expect(predicates.locator('[data-panel="view"] [data-set-predicates]')).toHaveCount(0);
  await predicates.locator('[data-set-predicates]').getByRole('button',{name:'⟦Mortal⟧',exact:true}).click();
  await object(predicates,'Little Jimmy').click({button:'right'});await predicates.locator('[data-context]').getByRole('button',{name:'Add to Mortal',exact:true}).click();
  await view(predicates,'Tables');await expect(predicates.getByRole('table',{name:'⟦Mortal⟧',exact:true}).locator('[data-object="jimmy"]')).toHaveCount(1);
});

test('fullscreen and zoom work for all presentations, including keyboard fallback',async({page})=>{
  await page.goto(chapter);const root=app(page,'A model as a knowledge base');
  await root.getByRole('button',{name:'Fullscreen',exact:true}).click();await expect(root.getByRole('button',{name:'Exit fullscreen',exact:true})).toHaveAttribute('aria-pressed','true');
  await menu(root,'Zoom');await expect(root.getByRole('button',{name:'Zoom in',exact:true})).toBeDisabled();await root.getByRole('button',{name:'Zoom out',exact:true}).click();await expect(root.locator('.fol-scene')).toHaveCSS('zoom','0.75');
  await root.getByRole('button',{name:'Exit fullscreen',exact:true}).click();await expect(root.getByRole('button',{name:'Fullscreen',exact:true})).toHaveAttribute('aria-pressed','false');
  await root.evaluate(n=>Object.defineProperty(n,'requestFullscreen',{value:undefined}));await root.focus();await page.keyboard.press('f');await expect(root).toHaveClass(/fol-fullscreen/);await page.keyboard.press('Escape');await expect(root).not.toHaveClass(/fol-fullscreen/);
  await view(root,'Tables');await menu(root,'Zoom');await root.getByRole('button',{name:'Reset zoom',exact:true}).click();await expect(root.locator('.fol-scene')).toHaveCSS('zoom','1');
});

test('satisfaction retains centered frozen fields and explains one check per object',async({page})=>{
  await page.goto(chapter);const root=app(page,'Truth in a finite model');await expect(root.locator('[data-count]')).toHaveText('1 / 6');await expect(root.getByLabel('Formula',{exact:true})).toHaveAttribute('readonly','');await expect(root.getByLabel('Formula',{exact:true})).toHaveCSS('text-align','center');
  await symbol(root,'Mortal');await object(root,'Little Jimmy').click();await check(root);await expect(root.locator('[data-answer]')).toContainText('False');
  await check(root,'Human(x)');await root.getByRole('button',{name:'v(x) = Mighty Box',exact:true}).click();await expect(root.locator('[data-calculation]')).toContainText('∉ ⟦Human⟧');await expect(root.locator('[data-answer]')).toContainText('False');
});

test('queries highlight extensions inside the unchanged model in every presentation',async({page},info)=>{
  await page.goto(chapter);const root=app(page,'Query a relational database');await root.getByRole('button',{name:'Run query',exact:true}).click();await last(root);
  for(const name of ['Tables','Knowledge graph','Set diagram','Semantic facts']) {
    await view(root,name);const extension=root.locator('[data-query-extension]');await expect(extension.locator('[data-object]')).toHaveCount(3);
    for(const country of ['France','United Kingdom','Greece'])await expect(extension.locator(`[data-object="${country}"]`)).toHaveCount(1);
    await expect(root.locator('.fol-in-extension')).not.toHaveCount(0);
  }
  await root.getByRole('button',{name:'Show query extension',exact:true}).click();await expect(root.locator('[data-query-extension]')).toHaveCount(0);await expect(root.locator('.fol-in-extension')).toHaveCount(0);
  await root.getByRole('button',{name:'Show query extension',exact:true}).click();await view(root,'Knowledge graph');
  await expect(root.locator('.fol-emoji')).not.toHaveCount(0);await expect(root.locator('[data-display]')).toContainText('New York');
  await reviewScreenshot(root,{path:`tmp/fol-review/revision-8/world-${info.project.name}.png`});
});

test('SQL translation has subscripted variables and preserves projected query answers',async({page},info)=>{
  await page.goto(chapter);const root=app(page,'Formulas and SQL'),sql=root.getByLabel('SQL',{exact:true});await root.getByRole('button',{name:'Edit SQL',exact:true}).click();
  await sql.fill("SELECT DISTINCT CapitalOf.capital FROM CapitalOf JOIN LocatedIn ON CapitalOf.country = LocatedIn.country WHERE LocatedIn.continent = 'Europe';");await root.getByRole('button',{name:'SQL → Formula',exact:true}).click();await expect(root.getByLabel('Formula',{exact:true})).toHaveValue(/∃z[₀₁₂₃₄₅₆₇₈₉]/);await last(root);
  await expect(root.locator('[data-query-extension] [data-object]')).toHaveCount(3);for(const city of ['Paris','London','Athens'])await expect(root.locator(`[data-query-extension] [data-object="${city}"]`)).toHaveCount(1);
  await root.locator('[data-calculation] summary').click();await expect(root.locator('[data-calculation] details')).toHaveAttribute('open','');await expect(root.locator('[data-query-extension] [data-object]')).toHaveCount(3);
  await root.getByRole('button',{name:'Edit formula',exact:true}).click();await root.getByLabel('Formula',{exact:true}).fill('CityIn(x, y)');await root.getByRole('button',{name:'Formula → SQL',exact:true}).click();await last(root);await expect(root.locator('[data-query-extension] .fol-tuple')).toHaveCount(6);
  await root.getByRole('button',{name:'Edit SQL',exact:true}).click();await sql.fill('DROP TABLE CapitalOf;');await root.getByRole('button',{name:'SQL → Formula',exact:true}).click();await expect(root.locator('[data-code-notice]')).toContainText('Expected SELECT');await expect(root.locator('[data-query-extension]')).toHaveCount(0);
  await root.getByRole('button',{name:'Edit formula',exact:true}).click();await root.getByLabel('Formula',{exact:true}).fill('∃y (CapitalOf(y, x) ∧ LocatedIn(y, Europe))');await root.getByRole('button',{name:'Formula → SQL',exact:true}).click();await reviewScreenshot(root,{path:`tmp/fol-review/revision-8/sql-${info.project.name}.png`});
});

test('menus, selections, and transparent set drawings are accessible in both themes',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(chapter);const root=app(page,'A model as a knowledge base');
  for(const name of ['Knowledge graph','Tables','Semantic facts','Set diagram']) {
    await view(root,name);expect((await new AxeBuilder({page}).include('.fol-app').analyze()).violations).toEqual([]);
    await reviewScreenshot(root,{path:`tmp/fol-review/revision-8/${name.replaceAll(' ','-')}-${info.project.name}.png`});
  }
  await expect(root.locator('.fol-sets .fol-image-paper').first()).toHaveCSS('fill','rgba(0, 0, 0, 0)');
  await menu(root,'Modify');expect((await new AxeBuilder({page}).include('.fol-app').analyze()).violations).toEqual([]);await reviewScreenshot(root,{path:`tmp/fol-review/revision-8/menu-${info.project.name}.png`});
  await root.getByRole('button',{name:'Modify',exact:true}).click();await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));await reviewScreenshot(root,{path:`tmp/fol-review/revision-8/dark-${info.project.name}.png`});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize().width+1);expect(errors).toEqual([]);
});

test('syntax apps share the parser layout and check binding with shadowing',async({page},info)=>{
  await page.goto(chapter);const parser=page.getByRole('region',{name:'Parsing a first-order formula',exact:true});
  await expect(parser.locator('.logic-app__help')).toHaveCount(0);await expect(parser.locator('.logic-app__details')).toBeVisible();
  if(info.project.name==='desktop'){const tree=await parser.locator('.logic-app__tree').boundingBox(),status=await parser.locator('.logic-app__status').boundingBox();expect(status.x).toBeGreaterThan(tree.x+tree.width-1);}
  await parser.getByRole('button',{name:'Next step',exact:true}).click();await reviewScreenshot(parser,{path:`tmp/fol-review/revision-8/parser-${info.project.name}.png`});
  await expect(page.locator('.fol-scope')).toHaveCount(5);await expect(page.locator('.fol-scope button:visible')).toHaveCount(0);
  await expect(page.getByRole('region',{name:'Vacuous quantification',exact:true}).locator('.scope-wire')).toHaveCount(0);
  await reviewScreenshot(page.getByRole('region',{name:'Nested binding',exact:true}),{path:`tmp/fol-review/revision-8/scope-${info.project.name}.png`});await reviewScreenshot(page.locator('.fol-worlds'),{path:`tmp/fol-review/revision-8/worlds-${info.project.name}.png`});

});

test('add rows, in-canvas prompts, and overlapping unary sets reflect model edits',async({page},info)=>{
  await page.goto(chapter);const root=app(page,'Interpret predicates');await symbol(root,'Sibling');await root.getByRole('button',{name:'Add Sibling tuple',exact:true}).click();
  await expect(root.locator('[data-display] [data-edit-help]')).toContainText('first object');await object(root,'Little Jimmy').click();await expect(root.locator('[data-edit-help]')).toContainText('second object');await object(root,'Mr Sir').click();await expect(root.getByRole('table',{name:'⟦Sibling⟧',exact:true}).locator('tbody tr:not(.fol-add-row)')).toHaveCount(1);
  await view(root,'Set diagram');await root.getByRole('button',{name:'Together',exact:true}).click();await expect(root.locator('.fol-sets [data-object]')).toHaveCount(5);await expect(root.locator('.fol-overlap-0')).toHaveCount(1);await expect(root.locator('.fol-overlap-1')).toHaveCount(1);
  await object(root,'Little Jimmy').click({button:'right'});await root.locator('[data-context]').getByRole('button',{name:'Remove from Mortal',exact:true}).click();
  await root.getByRole('button',{name:'Together',exact:true}).click();const positions=await root.locator('.fol-sets [data-object]').evaluateAll(ns=>Object.fromEntries(ns.map(n=>[n.dataset.object,n.getBBox().x])));expect(positions.jimmy).toBeLessThan(positions.sir);await reviewScreenshot(root,{path:`tmp/fol-review/revision-8/overlap-${info.project.name}.png`});
  const query=app(page,'The extension of an open formula');await expect(query.locator('[data-calculation]')).toContainText('Candidate 1 of 3');await expect(query.locator('.fol-candidate')).toContainText('Values for x, y');
  await expect(query.locator('.fol-explanation [data-query-result]')).toBeVisible();
  await expect(query.getByRole('button',{name:'Run query',exact:true})).toContainText('Query');await reviewScreenshot(query,{path:`tmp/fol-review/revision-8/query-${info.project.name}.png`});
});


test('query fields freeze after running and answers unfold over tuples without canvas scrolling',async({page},info)=>{
  await page.goto(chapter);const root=app(page,'Query a relational database'),input=root.getByLabel('Formula',{exact:true});await expect(input).toHaveAttribute('readonly','');
  await expect(root.locator('[data-query-extension] [data-object]')).toHaveCount(1);
  await root.getByRole('button',{name:'Next step',exact:true}).click();await expect(root.locator('[data-query-extension] [data-object]')).toHaveCount(2);
  await root.getByRole('button',{name:'Next step',exact:true}).click();await expect(root.locator('[data-query-extension] [data-object]')).toHaveCount(3);
  await root.getByRole('button',{name:'Previous step',exact:true}).click();await expect(root.locator('[data-query-extension] [data-object]')).toHaveCount(2);
  await last(root);await expect(root.locator('[data-query-extension] [data-object]')).toHaveCount(3);
  const size=await root.locator('[data-display]').evaluate(n=>({height:n.clientHeight,scroll:n.scrollHeight}));expect(size.scroll).toBeLessThanOrEqual(size.height+1);
  await root.getByRole('button',{name:'Edit formula',exact:true}).click();await input.fill('CapitalOf(x, y)');await expect(root.locator('[data-query-extension]')).toHaveCount(0);await root.getByRole('button',{name:'Run query',exact:true}).click();await expect(input).toHaveAttribute('readonly','');await expect(root.locator('.fol-candidate')).toContainText('Values for x, y');await last(root);await expect(root.locator('[data-query-extension] .fol-tuple')).toHaveCount(5);
  await reviewScreenshot(root,{path:`tmp/fol-review/revision-8/compact-db-${info.project.name}.png`});
});


test('formula pencils sit inside their fields across chapters',async({page},info)=>{
  for(const [path,selector,field,edit] of [
    ['/textbook/formal-languages/','[data-logic-app="parser"]','.logic-app__input','.logic-app__edit'],
    ['/textbook/sat/','[data-logic-app="sat"]','[data-input]','[data-edit]'],
    ['/textbook/conditionals/','[data-logic-app="conditionals"]','.conditional-kb-preview','[data-edit]'],
    [chapter,'.fol-app[data-kind="evaluate"]','[data-formula]','[data-edit-formula]']
  ]) {await page.goto(path);const root=page.locator(selector).first();await expect(root.locator(edit)).toBeVisible();const a=await root.locator(field).boundingBox(),b=await root.locator(edit).boundingBox();expect(b.x).toBeGreaterThanOrEqual(a.x);expect(b.x+b.width).toBeLessThanOrEqual(a.x+a.width+1);expect(b.y).toBeGreaterThanOrEqual(a.y-1);expect(b.y+b.height).toBeLessThanOrEqual(a.y+a.height+1);await reviewScreenshot(root.locator('.logic-app__input-wrap'),{path:`tmp/fol-review/revision-8/input-${path.split('/')[2]}-${selector.includes('scope')?'practice':'chapter'}-${info.project.name}.png`});}
});

test('query domains skip impossible tuples and accumulate visited answers',async({page},info)=>{
  await page.goto(chapter);const root=app(page,'The extension of an open formula');
  await expect(root.locator('.fol-domain-power')).toHaveText('Candidates ⊆ D²');await expect(root.locator('[data-query-index]')).toHaveCount(3);
  await expect(root.locator('[data-query-extension] .fol-tuple')).toHaveCount(1);
  await root.locator('[data-query-index="1"]').focus();await page.keyboard.press('Enter');await expect(root.locator('[data-query-index="1"]')).toBeFocused();
  await expect(root.locator('[data-query-extension] .fol-tuple')).toHaveCount(2);
  await root.getByRole('button',{name:'First step',exact:true}).click();await expect(root.locator('[data-query-extension] .fol-tuple')).toHaveCount(1);
  const unary=app(page,'Query a relational database');await expect(unary.locator('[data-query-index]')).toHaveCount(3);
  await reviewScreenshot(root,{path:`tmp/fol-review/revision-13/pruned-${info.project.name}.png`});
  for(const theme of ['light','dark']) {await page.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);expect((await new AxeBuilder({page}).include('.fol-app').analyze()).violations).toEqual([]);}
});

test('large product domains follow navigation without revealing future candidates',async({page},info)=>{
  await page.goto(chapter);const root=app(page,'Query a relational database'),input=root.getByLabel('Formula',{exact:true});await root.getByRole('button',{name:'Edit formula',exact:true}).click();await input.fill('¬CapitalOf(x, y)');await root.getByRole('button',{name:'Run query',exact:true}).click();
  await expect(root.locator('[data-query-index]')).toHaveCount(30);await expect(root.locator('.fol-domain-window')).toHaveText('1–30 of 324');
  await root.locator('[data-query-index="29"]').click();await root.getByRole('button',{name:'Next step',exact:true}).click();await expect(root.locator('.fol-domain-window')).toHaveText('31–60 of 324');await expect(root.locator('[data-query-index="30"]')).toHaveAttribute('aria-current','step');
  await expect(root.locator('[data-query-index="31"] .fol-candidate-mark')).toBeEmpty();await last(root);await expect(root.locator('[data-query-index]')).toHaveCount(24);await expect(root.locator('.fol-domain-window')).toHaveText('301–324 of 324');await expect(root.locator('[data-query-extension] .fol-tuple')).toHaveCount(319);
  const size=await root.locator('[data-display]').evaluate(n=>({height:n.clientHeight,scroll:n.scrollHeight,width:n.clientWidth,scrollWidth:n.scrollWidth}));expect(size.scroll).toBeLessThanOrEqual(size.height+1);expect(size.scrollWidth).toBeLessThanOrEqual(size.width+1);
  await reviewScreenshot(root,{path:`tmp/fol-review/revision-8/window-${info.project.name}.png`});await root.getByRole('button',{name:'Edit formula',exact:true}).click();await input.fill('Human(');await expect(root.locator('[data-query-index]')).toHaveCount(0);await expect(root.locator('[data-query-extension]')).toHaveCount(0);
  await input.fill('∃x CapitalOf(x, WashingtonDC)');await root.getByRole('button',{name:'Run query',exact:true}).click();await expect(root.locator('.fol-domain-power')).toHaveText('D⁰');await expect(root.locator('[data-query-index]')).toHaveCount(1);
});

test('query context, inline checking, and vacuous scopes use compact layouts',async({page},info)=>{
  await page.goto(chapter);
  const root=app(page,'The extension of an open formula');
  await expect(root.locator('.fol-query-interpretations').getByRole('table',{name:'⟦Human⟧',exact:true})).toBeVisible();
  await expect(root.locator('.fol-query-interpretations').getByRole('table',{name:'⟦BiggerThan⟧',exact:true})).toBeVisible();
  await expect(root.locator('.fol-query-interpretations').getByRole('table',{name:'⟦Mortal⟧',exact:true})).toHaveCount(0);
  const checkApp=app(page,'Truth in a finite model'),field=await checkApp.locator('[data-formula]').boundingBox(),button=await checkApp.getByRole('button',{name:'Check',exact:true}).boundingBox();
  expect(button.x).toBeGreaterThanOrEqual(field.x+field.width);expect(Math.abs(button.y+button.height/2-field.y-field.height/2)).toBeLessThan(2);
  await expect(checkApp.getByRole('button',{name:'Check',exact:true})).toContainText('Check');
  const vacuous=page.getByRole('region',{name:'Vacuous quantification',exact:true});await expect(vacuous.locator('.scope-line')).toHaveCSS('padding-top','0px');
  expect((await vacuous.locator('.scope-canvas').boundingBox()).height).toBeLessThan(100);
  await reviewScreenshot(checkApp,{path:`tmp/fol-review/revision-8/check-${info.project.name}.png`});
  await reviewScreenshot(vacuous,{path:`tmp/fol-review/revision-8/vacuous-${info.project.name}.png`});
});

test('correspondence pairs export editable SQL and open fullscreen',async({page},info)=>{
  await page.context().grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto(chapter);const init=app(page,'From a model to a database');
  await expect(init.getByLabel('Formula',{exact:true})).toBeHidden();
  await expect(init.locator('[data-display]')).toBeVisible();
  await expect(init.locator('[data-sql-code]')).toContainText('CREATE TABLE "Domain"');
  await expect(init.locator('[data-sql-code]')).toContainText("('France', 'Paris')");
  await expect(init.getByRole('button',{name:'Edit SQL',exact:true})).toBeVisible();
  await expect(init.getByRole('table',{name:'⟦CapitalOf⟧',exact:true})).toBeVisible();
  await init.getByRole('group',{name:'Model tables',exact:true}).getByRole('button',{name:'LocatedIn',exact:true}).click();await expect(init.getByRole('table',{name:'⟦LocatedIn⟧',exact:true})).toBeVisible();await expect(init.getByRole('table',{name:'⟦CapitalOf⟧',exact:true})).toHaveCount(0);
  await init.getByRole('group',{name:'Model tables',exact:true}).getByRole('button',{name:'CapitalOf',exact:true}).click();
  const headings=init.locator('.fol-code-tabs > span:not(.fol-conversions)'),arrows=await init.locator('.fol-conversions').boundingBox();
  const left=await headings.nth(0).boundingBox(),right=await headings.nth(1).boundingBox();
  expect(arrows.x).toBeGreaterThanOrEqual(left.x+left.width);expect(arrows.x+arrows.width).toBeLessThanOrEqual(right.x+1);
  const badge=await init.locator('.lang-badge').boundingBox(),tools=await init.locator('.fol-code-tools').boundingBox(),code=await init.locator('.chroma').boundingBox();
  expect(tools.x+tools.width).toBeLessThan(badge.x);expect(badge.y+badge.height).toBeLessThanOrEqual(code.y+1);expect(badge.width).toBeGreaterThan(70);
  await init.getByRole('button',{name:'Copy code',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('CREATE TABLE "Domain"');
  await init.getByRole('button',{name:'Fullscreen',exact:true}).click();await expect(init.getByRole('button',{name:'Exit fullscreen',exact:true})).toBeVisible();await init.getByRole('button',{name:'Exit fullscreen',exact:true}).click();
  await reviewScreenshot(init,{path:`tmp/fol-review/revision-12/initialization-${info.project.name}.png`});
  const root=app(page,'Formulas and SQL');
  await expect(root.locator('[data-sql-playground]')).toHaveCount(0);
  await expect(root.locator('.fol-query-model')).toBeHidden();
  await root.getByRole('button',{name:'Edit SQL',exact:true}).click();await root.getByLabel('SQL',{exact:true}).fill('SELECT DISTINCT country FROM CapitalOf;');
  await root.getByRole('button',{name:'Copy code',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('SELECT DISTINCT country FROM CapitalOf;');
  await root.getByRole('button',{name:'SQL → Formula',exact:true}).click();await last(root);await expect(root.locator('[data-query-extension] .fol-tuple')).toHaveCount(5);
  await reviewScreenshot(root,{path:`tmp/fol-review/revision-12/correspondence-${info.project.name}.png`});
});

test('laptop queries, completed trees, and model graphs fit their content',async({page},info)=>{
  for(const width of [1280,1024]) {
    await page.setViewportSize({width,height:720});await page.goto(chapter);
    for(const title of ['The extension of an open formula','Query a relational database']) {
      const root=app(page,title);await last(root);
      await reviewScreenshot(root,{path:`tmp/fol-review/revision-9/query-${width}-${title.startsWith('The')?'binary':'unary'}-${info.project.name}.png`});
      const bounds=await root.boundingBox();expect(bounds.height).toBeLessThan(660);
      const canvas=await root.locator('[data-display]').boundingBox(),answer=await root.locator('[data-query-result]').boundingBox();expect(answer.x).toBeGreaterThan(canvas.x+canvas.width);
    }
    const graph=app(page,'A model as a knowledge base').locator('[data-display]');
    const size=await graph.evaluate(n=>({h:n.clientHeight,sh:n.scrollHeight,w:n.clientWidth,sw:n.scrollWidth}));expect(size.sh).toBeLessThanOrEqual(size.h+1);expect(size.sw).toBeLessThanOrEqual(size.w+1);
    const parser=page.getByRole('region',{name:'Parsing a first-order formula',exact:true}),tree=parser.locator('.logic-app__tree');
    const initial=(await tree.boundingBox()).height;await parser.getByRole('button',{name:'Last step',exact:true}).click();expect((await tree.boundingBox()).height).toBeCloseTo(initial,0);
    for(const decorated of [false,true]) {
      if(decorated)await parser.getByRole('button',{name:'Show formulas at nodes',exact:true}).click();
      const size=await tree.evaluate(n=>({h:n.clientHeight,sh:n.scrollHeight,w:n.clientWidth,sw:n.scrollWidth}));expect(size.sh).toBeLessThanOrEqual(size.h+1);expect(size.sw).toBeLessThanOrEqual(size.w+1);
      await reviewScreenshot(parser,{path:`tmp/fol-review/revision-9/tree-${width}-${decorated}-${info.project.name}.png`});
    }
  }
});

test('term denotation follows the assignment from leaves to root',async({page},info)=>{
 await page.goto(chapter);const root=app(page,"Calculating a term's denotation");
 await expect(root.locator('[data-count]')).toHaveText('1 / 3');
 await expect(root.locator('[data-calculation] .fol-step-claim [data-object="jimmy"]')).toHaveCount(1);
 await root.getByRole('button',{name:'Next step',exact:true}).click();await expect(root.locator('[data-calculation] .fol-step-claim [data-object="sir"]')).toHaveCount(1);
 await last(root);await expect(root.locator('[data-calculation] .fol-step-claim [data-object="socrates"]')).toHaveCount(1);
 await root.getByRole('button',{name:'v(x) = Mighty Box',exact:true}).click();await last(root);await expect(root.locator('[data-calculation] .fol-step-claim [data-object="box"]')).toHaveCount(1);
 await expect(root.locator('[data-calculation]')).not.toContainText('true');
 await reviewScreenshot(root,{path:`tmp/fol-review/revision-14/denotation-${info.project.name}.png`});
});

test('query pruning retains negation and handles an empty positive relation',async({page})=>{
 await page.goto(chapter);const root=app(page,'The extension of an open formula');
 await root.getByRole('button',{name:'Edit formula',exact:true}).click();await root.getByLabel('Formula',{exact:true}).fill('Sibling(x, y)');await root.getByRole('button',{name:'Run query',exact:true}).click();
 await expect(root.locator('[data-query-index]')).toHaveCount(0);await expect(root.locator('[data-calculation]')).toContainText('extension is empty');await expect(root.getByRole('button',{name:'Next step',exact:true})).toBeDisabled();
 await root.getByRole('button',{name:'Edit formula',exact:true}).click();await root.getByLabel('Formula',{exact:true}).fill('¬Sibling(x, y)');await root.getByRole('button',{name:'Run query',exact:true}).click();await last(root);await expect(root.locator('[data-query-extension] .fol-tuple')).toHaveCount(25);
});

test('formula fields stay frozen until edited and grow and shrink with their contents',async({page},info)=>{
 for(const [path,selector] of [['/textbook/fol/','[data-kind="sql"]'],['/textbook/formal-languages/','[data-logic-app="parser"]'],['/textbook/sat/','[data-logic-app="sat"][data-kind="rewrite"]']]) {
  await page.goto(path);const root=page.locator(selector).first(),input=root.locator('.logic-app__input').first(),edit=root.locator('.logic-app__edit').first();
  await expect(input).toHaveAttribute('readonly','');await input.scrollIntoViewIfNeeded();
  const box=await input.boundingBox();await page.mouse.click(box.x+box.width/2,box.y+box.height/2);
  await expect(input).not.toBeFocused();await expect(edit).toBeVisible();await expect(input).toHaveAttribute('tabindex','-1');
  await edit.click();await expect(input).toBeFocused();await input.fill('P(x)');const short=(await input.boundingBox()).height;
  await input.fill(Array(28).fill('Human(x)').join(' ∧ '));await expect.poll(async()=>(await input.boundingBox()).height).toBeGreaterThan(short+10);
  expect(await input.evaluate(n=>n.scrollHeight<=n.clientHeight+1)).toBe(true);
  await input.fill('P(x)');await expect.poll(async()=>(await input.boundingBox()).height).toBeLessThanOrEqual(short+1);
  await reviewScreenshot(root.locator('.logic-app__input-wrap').first(),{path:`tmp/fol-review/revision-14/field-${path.split('/')[2]}-${info.project.name}.png`});
 }
});

test('correspondence resets restore edited models and formulas and keep controls separate',async({page},info)=>{
 await page.goto(chapter);const root=app(page,'From a model to a database'),original=await root.evaluate(n=>n.folModel.get());
 await root.evaluate(n=>{const m=n.folModel.get();m.predicates.CapitalOf=[];n.folModel.set(m);});
 await root.getByRole('button',{name:'Reset app',exact:true}).click();expect(await root.evaluate(n=>n.folModel.get())).toEqual(original);
 const pair=app(page,'Formulas and SQL'),input=pair.getByLabel('Formula',{exact:true}),originalFormula=await input.inputValue();
 await pair.getByRole('button',{name:'Edit formula',exact:true}).click();await input.fill('x ≠ Japan');await pair.getByRole('button',{name:'Formula → SQL',exact:true}).click();
 await pair.getByRole('button',{name:'Reset app',exact:true}).click();await expect(input).toHaveValue(originalFormula);await expect(input).toHaveAttribute('readonly','');
 const arrows=pair.locator('.fol-conversions button');const a=await arrows.nth(0).boundingBox(),b=await arrows.nth(1).boundingBox();expect(b.y).toBeGreaterThanOrEqual(a.y+a.height);
 const fullscreen=await pair.getByRole('button',{name:'Fullscreen',exact:true}).boundingBox();expect(fullscreen.y+fullscreen.height).toBeLessThanOrEqual(a.y+1);
 await pair.getByRole('button',{name:'Fullscreen',exact:true}).click();await expect(pair.getByRole('button',{name:'Exit fullscreen',exact:true})).toBeVisible();await reviewScreenshot(pair,{path:`tmp/fol-review/revision-14/fullscreen-${info.project.name}.png`});await pair.getByRole('button',{name:'Exit fullscreen',exact:true}).click();
});

test('chapter references share the chapter badge inside and outside callouts',async({page})=>{
 await page.goto(chapter);
 const content=page.locator('main');
 const links=content.locator('a[href*="/textbook/"]');
 for(const link of await links.all()) {
  const href=await link.getAttribute('href');
  if(!/\/textbook\/(?:boolean|logic-and-ai|formal-languages|proofs|fol-inference)\//.test(href))continue;
  // Navigation also links chapters, but only the authored body uses this badge.
  if(await link.evaluate(n=>Boolean(n.closest('nav,.page-nav,.chapter-rail'))))continue;
  await expect(link).toHaveClass(/chapter-reference/);await expect(link.locator('.chapter-reference__label')).toHaveCount(1);
 }
 await expect(page.locator('.callout a.chapter-reference')).toHaveCount(3);
 await expect(content).not.toContainText('<a href');
 await expect(content.locator('a[href*="webdam"],a[href*="abiteboul-vianu"]')).toHaveCount(0);
});

test('model arrows keep their size and repeated reciprocal labels do not overlap',async({page},info)=>{
 await page.goto(chapter);const root=app(page,'Interpret predicates');await view(root,'Knowledge graph');
 const before=await root.locator('.fol-edge > path:not(.fol-edge-hit)').first().evaluate(n=>getComputedStyle(n).strokeWidth);
 await symbol(root,'Sibling');await object(root,'Little Jimmy').click();await object(root,'Granny Smith').click();
 await symbol(root,'Sibling');await object(root,'Granny Smith').click();await object(root,'Little Jimmy').click();
 const siblings=root.locator('.fol-edge[data-interpretation="predicate:Sibling"]');
 await expect(siblings).toHaveCount(2);
 await expect(siblings.locator('.fol-edge-label')).toHaveText(['⟦Sibling⟧','⟦Sibling⟧']);
 for(const label of await root.locator('.fol-edge[data-interpretation^="predicate:"] .fol-edge-label').all())await expect(label).toHaveText(/^⟦.+⟧$/);
 for(const edge of await siblings.all())await expect(edge.locator(':scope > path:not(.fol-edge-hit)')).toHaveCSS('stroke-width',before);
 await expect(siblings.locator('.fol-edge-label[visibility="hidden"]')).toHaveCount(1);
 const visible=root.locator('.fol-edge-label:not([visibility="hidden"])');
 const boxes=await visible.evaluateAll(ns=>ns.map(n=>{const b=n.getBBox();return {x:b.x,y:b.y,w:b.width,h:b.height};}));
 for(let i=0;i<boxes.length;i++)for(let j=0;j<i;j++){const a=boxes[i],b=boxes[j];expect(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y).toBe(false);}
 const markers=await root.locator('.fol-graph marker').evaluateAll(ns=>ns.map(n=>[n.getAttribute('markerUnits'),n.getAttribute('markerWidth'),n.getAttribute('markerHeight')]));
 expect(new Set(markers.map(JSON.stringify)).size).toBe(1);expect(markers[0][0]).toBe('userSpaceOnUse');
 await expect(root.locator('.fol-graph [data-object="jimmy"]')).toContainText('⟦Human⟧, ⟦Mortal⟧');
 await reviewScreenshot(root,{path:`tmp/fol-review/revision-15/arrows-${info.project.name}.png`});
 // Hiding a duplicate label must not remove its arrow's keyboard access or deletion.
 const modify=root.getByRole('button',{name:'Modify',exact:true});if(await modify.getAttribute('aria-expanded')==='true')await modify.click();
 await siblings.nth(1).focus();await page.keyboard.press('Enter');
 await root.getByRole('button',{name:'Delete Sibling tuple',exact:true}).click();await expect(siblings).toHaveCount(1);
 await expect(siblings.locator('.fol-edge-label')).not.toHaveAttribute('visibility','hidden');
 await view(root,'Set diagram');await root.getByRole('button',{name:'Together',exact:true}).click();
 await expect(root.locator('.fol-sets')).toContainText('⟦Human⟧');await expect(root.locator('.fol-sets')).toContainText('⟦Mortal⟧');
});
