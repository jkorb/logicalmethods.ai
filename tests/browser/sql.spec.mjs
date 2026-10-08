import {test,expect} from './fixtures.mjs';
import {budget} from './budget.mjs';
import {reviewScreenshot} from './review-screenshot.mjs';
import AxeBuilder from '@axe-core/playwright';
const chapter='/textbook/fol/';
const app=(page,name)=>page.getByRole('region',{name,exact:true});
const run=async root=>{await root.getByRole('button',{name:'Run',exact:true}).click();await expect(root.locator('[data-sql-status]')).toHaveAttribute('data-state','success',{timeout:budget(15000)});};
const edit=async(root,sql)=>{await root.getByRole('button',{name:'Edit SQL',exact:true}).click();await root.getByLabel('SQL',{exact:true}).fill(sql);};

test('SQL loads locally on demand and runs the chapter examples',async({page},info)=>{
 const requests=[];page.on('request',r=>requests.push(r.url()));await page.goto(chapter);
 const root=app(page,'Querying European countries');await expect(root).toHaveAttribute('data-mounted','true');
 expect(requests.filter(u=>/sql-wasm|sql-worker/.test(u))).toEqual([]);
 await run(root);await expect(root.locator('[data-sql-results]')).toContainText('France');await expect(root.locator('[data-sql-results]')).toContainText('United Kingdom');await expect(root.locator('[data-sql-results]')).toContainText('Greece');
 expect(requests.some(u=>u.includes('sql-wasm'))).toBe(true);expect(requests.every(u=>['127.0.0.1','logicalmethods.ai'].includes(new URL(u).hostname))).toBe(true);

 const init=app(page,'From a model to a database');await run(init);await expect(init.locator('[data-sql-status]')).toHaveText('Database initialized.');await expect(init.getByRole('table',{name:'⟦CapitalOf⟧',exact:true}).locator('tbody tr')).toHaveCount(5);await run(init);
 await reviewScreenshot(root,{path:`tmp/fol-review/revision-11/sql-${info.project.name}.png`});
 expect((await new AxeBuilder({page}).include('.sql-app').analyze()).violations).toEqual([]);
});

test('SQL editors handle general SQLite, empty results, errors, and independent runs',async({page})=>{
 await page.goto(chapter);const root=app(page,'Querying European countries');
 await edit(root,"DELETE FROM LocatedIn WHERE country = 'France'; SELECT COUNT(*) AS remaining FROM LocatedIn; SELECT NULL AS missing, '<img src=x>' AS literal;");await run(root);
 await expect(root.locator('[data-sql-results] table')).toHaveCount(2);await expect(root.locator('tbody').first()).toHaveText('4');await expect(root.locator('tbody').last()).toContainText('NULL<img src=x>');await expect(root.locator('[data-sql-results] img')).toHaveCount(0);
 await expect(root.getByLabel('SQL',{exact:true})).toBeHidden();
 await edit(root,'SELECT * FROM LocatedIn WHERE 1 = 0;');await run(root);await expect(root.locator('[data-sql-results]')).toContainText('No rows.');await expect(root.locator('thead')).toContainText('country');
 await edit(root,'SELECT * FROM missing_table;');await root.getByRole('button',{name:'Run',exact:true}).click();await expect(root.locator('[data-sql-status]')).toContainText('no such table');await expect(root.locator('[data-sql-results] table')).toHaveCount(0);
 await root.getByLabel('SQL',{exact:true}).fill('SELECT COUNT(*) AS total FROM LocatedIn;');await run(root);await expect(root.locator('tbody')).toHaveText('5');
 await root.getByRole('button',{name:'Reset SQL',exact:true}).click();await expect(root.locator('[data-sql-code]')).toContainText("WHERE continent = 'Europe'");await expect(root.locator('[data-sql-results]')).toBeEmpty();
});

test('database initialization updates the model atomically in both directions',async({page})=>{
 await page.goto(chapter);const init=app(page,'From a model to a database');
 const original=await init.evaluate(n=>n.folModel.get());
 await edit(init,await init.locator('[data-sql-code]').textContent()+"\nDELETE FROM CapitalOf WHERE country = 'France';");
 await init.getByRole('button',{name:'Database → Model',exact:true}).click();
 await expect(init.locator('[data-sql-status]')).toHaveAttribute('data-state','success');
 expect((await init.evaluate(n=>n.folModel.get())).predicates.CapitalOf).toHaveLength(4);
 await expect(init.getByRole('table',{name:'⟦CapitalOf⟧',exact:true}).locator('tbody tr')).toHaveCount(4);
 await init.getByRole('button',{name:'Model → Database',exact:true}).click();
 await expect(init.locator('[data-sql-code]')).not.toContainText("('France', 'Paris')");
 const valid=await init.locator('[data-sql-code]').textContent();
 await edit(init,valid+"\nDELETE FROM Domain WHERE value = 'Paris';");await init.getByRole('button',{name:'Database → Model',exact:true}).click();
 await expect(init.locator('[data-sql-status]')).toHaveAttribute('data-state','error');
 expect((await init.evaluate(n=>n.folModel.get())).domain).toEqual(original.domain);
 await init.getByLabel('SQL',{exact:true}).fill(valid);await run(init);
 await init.getByRole('button',{name:'Modify',exact:true}).click();await init.getByRole('button',{name:'Reset model',exact:true}).click();await init.getByRole('button',{name:'Close modify menu',exact:true}).click();await init.getByRole('button',{name:'Model → Database',exact:true}).click();await expect(init.locator('[data-sql-code]')).toContainText("('France', 'Paris')");
 await edit(init,(await init.locator('[data-sql-code]').textContent())+'\nDROP TABLE Domain;');await run(init);expect(new Set((await init.evaluate(n=>n.folModel.get())).domain)).toEqual(new Set(original.domain));
 const root=app(page,'Formulas and SQL');await run(root);await expect(root.locator('[data-sql-results] tbody tr')).toHaveCount(3);await expect(root.locator('[data-sql-results]')).toContainText('Paris');
 await edit(root,"SELECT COUNT(*) AS capitals FROM CapitalOf;");await run(root);await expect(root.locator('[data-sql-results] tbody')).toHaveText('5');
 await root.getByRole('button',{name:'SQL → Formula',exact:true}).click();await expect(root.locator('[data-code-notice]')).toContainText('Unsupported');
});

test('SQL result limits, cancellation and recovery keep the page responsive',async({page})=>{
 await page.goto(chapter);const root=app(page,'Querying European countries');
 await edit(root,'WITH RECURSIVE n(x) AS (VALUES(1) UNION ALL SELECT x+1 FROM n WHERE x < 1000) SELECT x FROM n;');await run(root);await expect(root.locator('tbody tr')).toHaveCount(200);await expect(root.locator('[data-sql-results]')).toContainText('first 200 rows');
 const slow='WITH RECURSIVE n(x) AS (VALUES(1) UNION ALL SELECT x+1 FROM n) SELECT sum(x) FROM n;';
 await edit(root,slow);await root.getByRole('button',{name:'Run',exact:true}).click();await root.getByRole('button',{name:'Stop',exact:true}).click();await expect(root.locator('[data-sql-status]')).toHaveText('Stopped.');
 await root.getByLabel('SQL',{exact:true}).fill('SELECT 42 AS answer;');await run(root);await expect(root.locator('tbody')).toHaveText('42');
 await edit(root,slow);await root.getByRole('button',{name:'Run',exact:true}).click();await expect(root.locator('[data-sql-status]')).toContainText('stopped after five seconds',{timeout:budget(15000)});
 await root.getByLabel('SQL',{exact:true}).fill('SELECT 7 AS answer;');await run(root);await expect(root.locator('tbody')).toHaveText('7');
});

test('SQLite loading failures can be retried without reloading the chapter',async({page})=>{
 await page.goto(chapter);const root=app(page,'Querying European countries');
 await page.route('**/*sql-wasm*.wasm',route=>route.abort());
 await root.getByRole('button',{name:'Run',exact:true}).click();await expect(root.locator('[data-sql-status]')).toHaveAttribute('data-state','error');
 await page.unroute('**/*sql-wasm*.wasm');await run(root);await expect(root.locator('tbody tr')).toHaveCount(3);
});
