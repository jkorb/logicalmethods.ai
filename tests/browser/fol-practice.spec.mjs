import {test,expect} from './fixtures.mjs';
import {budget} from './budget.mjs';
import {reviewScreenshot} from './review-screenshot.mjs';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';
import {parseFOL} from '../../assets/js/logic/fol-parser.js';
import {bindingTokens} from '../../assets/js/logic/fol-binding.js';
import {folToSQL} from '../../assets/js/logic/fol-model.js';
import {scopeLevels,builderLevels,queryLevels,initializationLevels} from '../../assets/js/apps/fol-practice-levels.js';
import {fullCoverage} from './coverage.mjs';
const path='/exercises/fol/';
const app=(page,name)=>page.getByRole('region',{name,exact:true});
const level=async(root,n)=>root.getByRole('button',{name:`Level ${n}`,exact:true}).click();
const feedback=root=>root.locator(':scope > [data-practice-feedback]');
const world=JSON.parse(readFileSync(new URL('../../data/fol/world.json',import.meta.url)));
async function editSQL(root,text) {const edit=root.getByRole('button',{name:'Edit SQL',exact:true});if(await edit.isVisible())await edit.click();await root.getByLabel('SQL',{exact:true}).fill(text);}
async function run(root) {await root.getByRole('button',{name:'Run',exact:true}).click();await expect(feedback(root)).not.toBeEmpty({timeout:budget(15000)});}

test('scope levels retain every quantifier binding and check the complete diagram',async({page},info)=>{
 await page.goto(path);const root=app(page,'Scope and binding practice');await expect(root).toHaveAttribute('data-mounted','true');await expect(root.locator('input,textarea')).toHaveCount(0);
 await root.getByRole('button',{name:'Check bindings',exact:true}).click();await expect(feedback(root)).toContainText('Visit every');
 for(const [i,formula] of scopeLevels.entries()) {
  await level(root,i+1);const data=bindingTokens(parseFOL(formula));
  for(const q of data.quantifiers) {
   await root.locator(`[data-token="${q.id}"]`).click();
   for(const token of data.tokens.filter(t=>t.binder===q.id))await root.locator(`[data-token="${token.id}"]`).click();
  }
  if(i===5) { // Switching back keeps the outer quantifier's choice.
   await root.locator(`[data-token="${data.quantifiers[0].id}"]`).click();await expect(root.locator('[data-kind="variable"][aria-pressed="true"]')).toHaveCount(1);
  }
  await root.getByRole('button',{name:'Check bindings',exact:true}).click();await expect(feedback(root)).toHaveAttribute('data-feedback','correct');
 }
 await reviewScreenshot(root,{path:`tmp/fol-review/revision-11/scope-${info.project.name}.png`});
 expect((await new AxeBuilder({page}).include('.fol-scope').analyze()).violations).toEqual([]);
});

test('FOL builder enforces term/formula types and builds nested targets',async({page},info)=>{
 await page.goto(path);const root=app(page,'Building FOL formulas');await expect(root).toHaveAttribute('data-mounted','true');
 await root.getByRole('button',{name:'∀',exact:true}).click();await expect(feedback(root)).toContainText('Select one formula');
 const tools=root.locator('[data-build-tools]'),board=root.locator('[data-builder-board]');
 async function construct(ast) {
  if(['constant','variable'].includes(ast.kind)) {await tools.getByRole('button',{name:ast.name,exact:true}).click();return;}
  for(const child of ast.children)await construct(child);
  const available=board.locator('button.builder__node');const count=await available.count();
  for(let j=count-ast.children.length;j<count;j++)await available.nth(j).click();
  if(ast.kind==='quantifier')await tools.getByRole('button',{name:`Bind ${ast.variable}`,exact:true}).click();
  await tools.getByRole('button',{name:ast.name,exact:true}).click();
 }
 for(const [i,formula] of builderLevels.entries()) {
  await level(root,i+1);await construct(parseFOL(formula,{kind:i===0?'term':'formula'}));await expect(feedback(root)).toHaveAttribute('data-feedback','correct');
 }
 await root.getByRole('button',{name:'Undo construction',exact:true}).click();await expect(board.locator('button.builder__node')).toHaveCount(2);
 await reviewScreenshot(root,{path:`tmp/fol-review/revision-11/builder-${info.project.name}.png`});
});

test('model practice checks edited interpretations and impossible targets',{ tag: '@mobile' }, async({page},info)=>{
 await page.goto(path);const root=app(page,'Building FOL models'),model=root.locator('[data-logic-app="fol-model"]');
 await expect(root).toHaveAttribute('data-mounted','true');await root.getByRole('button',{name:'Check',exact:true}).last().click();await expect(feedback(root)).toContainText('formula is false');
 await model.getByRole('button',{name:'Modify',exact:true}).click();await model.locator('[data-panel="model"]').getByRole('button',{name:'Interpret Human',exact:true}).click();
 await model.locator('[data-display]').getByRole('button',{name:'Select Socrates',exact:true}).first().click();
 await root.getByRole('button',{name:'Check',exact:true}).last().click();await expect(feedback(root)).toHaveAttribute('data-feedback','correct');
 await level(root,2);await root.getByRole('button',{name:'Impossible',exact:true}).click();await expect(feedback(root)).toHaveAttribute('data-feedback','incorrect');
 await root.getByRole('button',{name:'Check',exact:true}).last().click();await expect(feedback(root)).toHaveAttribute('data-feedback','correct');
 await level(root,11);await root.getByRole('button',{name:'Impossible',exact:true}).click();await expect(feedback(root)).toContainText('either true or false');
 await reviewScreenshot(root,{path:`tmp/fol-review/revision-11/model-practice-${info.project.name}.png`});
});

test('SQL initialization grades resulting tables and accepts every level',async({page},info)=>{
 await page.goto(path);const root=app(page,'DB initialization practice');await expect(root).toHaveAttribute('data-mounted','true');
 await editSQL(root,'CREATE TABLE wrong(x TEXT);');await run(root);await expect(feedback(root)).toHaveAttribute('data-feedback','incorrect');
 for(const [i,names] of initializationLevels.entries()) {
  await level(root,i+1);
  const script=names.map(name=>{
   const columns=name==='Domain'?['value']:world.columns[name],rows=name==='Domain'?world.model.domain.map(d=>[d]):world.model.predicates[name];
   const literal=s=>`'${s.replaceAll("'","''")}'`;
   return `CREATE TABLE ${name} (${columns.map(c=>`"${c}" TEXT`).join(', ')});\nINSERT INTO ${name} VALUES ${rows.map(r=>'('+r.map(literal).join(', ')+')').join(', ')};`;
  }).join('\n');
  await editSQL(root,script);await run(root);await expect(feedback(root)).toHaveAttribute('data-feedback','correct');
 }
 await reviewScreenshot(root,{path:`tmp/fol-review/revision-11/initialization-practice-${info.project.name}.png`});
});

test('SQL queries check recursive constructions and protect the exercise database',async({page},info)=>{
 await page.goto(path);const root=app(page,'SQL query practice');await expect(root).toHaveAttribute('data-mounted','true');
 await editSQL(root,'SELECT 1;');await run(root);await expect(feedback(root)).toHaveAttribute('data-feedback','incorrect');
 await editSQL(root,'DELETE FROM LocatedIn;');await run(root);await expect(feedback(root)).toContainText('readonly');
 for(const [i,{formula}] of queryLevels.entries()) {
  // Unit tests execute every SQL answer. Browser checks cover submission with
  // one column, two columns, and nested quantifiers, plus errors above.
  if(!fullCoverage&&![0,9,11].includes(i))continue;
  await level(root,i+1);await editSQL(root,folToSQL(parseFOL(formula,{language:world.language}),world.language,world.model,world.columns));await run(root);await expect(feedback(root)).toHaveAttribute('data-feedback','correct');
 }
 await reviewScreenshot(root,{path:`tmp/fol-review/revision-11/query-practice-${info.project.name}.png`});
 expect((await new AxeBuilder({page}).include('.fol-practice[data-exercise="query"]').analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize().width+1);
});

test('SQL code, controls, and answers fit laptop screens with course attribution',async({page},info)=>{
 for(const width of [1280,1024]) {
  await page.setViewportSize({width,height:720});await page.goto('/textbook/fol/');
  for(const title of ['Querying European countries','Formulas and SQL']) {
   const root=app(page,title);await root.getByRole('button',{name:'Run',exact:true}).click();await expect(root.locator('[data-sql-status]')).toHaveAttribute('data-state','success',{timeout:budget(15000)});
   const attribution=root.getByRole('link',{name:'Powered by sql.js'});await expect(attribution).toBeVisible();
   const license=await page.request.get(await attribution.getAttribute('href'));expect(license.ok()).toBe(true);const notices=await license.text();expect(notices).toContain('Permission is hereby granted');expect(notices).toContain('sql.js authors');expect(notices).toContain('AUTHORS');
   await expect(root.locator('.lang-badge svg')).toHaveCount(1);
   await reviewScreenshot(root,{path:`tmp/fol-review/revision-11/layout-${width}-${title.startsWith('Formulas')?'combined':'single'}-${info.project.name}.png`});
   expect((await root.boundingBox()).height).toBeLessThan(660);
   const output=root.locator('.sql-result-table');await expect(output).toHaveClass(/table-scroll/);
   const code=await root.locator('.fol-code').boundingBox(),run=await root.getByRole('button',{name:'Run',exact:true}).boundingBox();expect(run.y+run.height).toBeLessThanOrEqual(code.y+code.height);
   await reviewScreenshot(root,{path:`tmp/fol-review/revision-11/sql-${width}-${title.startsWith('Formulas')?'combined':'single'}-${info.project.name}.png`});
  }
 }
});

test('extension selection grades empty, unary, and ordered binary answers',async({page},info)=>{
 await page.goto(path);const root=app(page,'Selecting extensions');await expect(root).toHaveAttribute('data-mounted','true');
 const {extensionLevels}=await import('../../assets/js/apps/fol-semantics-practice.js');
 const {queryFOL}=await import('../../assets/js/logic/fol-model.js');
 const family=JSON.parse(readFileSync(new URL('../../data/fol/family.json',import.meta.url)));
 for(const [i,formula] of extensionLevels.entries()) {
  await level(root,i+1);const candidates=root.locator('[data-tuple]');
  await candidates.first().click();await root.getByRole('button',{name:'Check',exact:true}).click();await expect(feedback(root)).toHaveAttribute('data-feedback','incorrect');await candidates.first().click();
  const expected=queryFOL(parseFOL(formula,{language:family.language,mode:'conventional'}),family.language,family.model);
  for(const row of expected.rows)await root.locator(`[data-tuple='${JSON.stringify(row)}']`).click();
  await root.getByRole('button',{name:'Check',exact:true}).click();await expect(feedback(root)).toHaveAttribute('data-feedback','correct');
 }
 await reviewScreenshot(root,{path:`tmp/fol-review/revision-14/extensions-${info.project.name}.png`});
 expect((await new AxeBuilder({page}).include('[data-exercise="extensions"]').analyze()).violations).toEqual([]);
});

test('substitution gaps check capture prevention and accept whitespace',async({page},info)=>{
 await page.goto(path);const root=app(page,'Substitution pseudocode');
 await root.getByRole('button',{name:'Check',exact:true}).click();await expect(feedback(root)).toHaveAttribute('data-feedback','incorrect');
 const {substitutionGaps}=await import('../../assets/js/apps/fol-semantics-practice.js');
 for(const [name,answer] of substitutionGaps)await root.getByRole('textbox',{name,exact:true}).fill(` ${answer} `);
 await root.getByRole('textbox',{name:'capture test',exact:true}).fill('free_variables(B)');await root.getByRole('button',{name:'Check',exact:true}).click();await expect(root.getByRole('textbox',{name:'capture test',exact:true})).toHaveAttribute('aria-invalid','true');
 await root.getByRole('textbox',{name:'capture test',exact:true}).fill('free_variables(t)');await root.getByRole('button',{name:'Check',exact:true}).click();await expect(feedback(root)).toHaveAttribute('data-feedback','correct');
 await reviewScreenshot(root,{path:`tmp/fol-review/revision-14/substitution-${info.project.name}.png`});
 expect((await new AxeBuilder({page}).include('[data-exercise="substitution"]').analyze()).violations).toEqual([]);
});
