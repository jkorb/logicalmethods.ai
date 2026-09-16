import { test, expect, routeToTestSite } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
const active = course => course.locator('[data-set-level]:visible [data-set-exercise]');

test('abstraction levels select by properties and preserve answers on return', async ({page}) => {
  await page.goto('/exercises/formal-languages/');
  const course=page.locator('[data-set-levels]');
  let app=active(course);
  await expect(app.locator('[data-point]')).toHaveCount(15);
  await expect(app.locator('[data-question-formula]')).toHaveText('{ x : x is alive }');
  await app.getByRole('button',{name:'AI robot',exact:true}).click();
  await app.getByRole('button',{name:'Check',exact:true}).click();
  await expect(app.locator('[data-feedback]')).toContainText('1 selected in error');
  await app.getByRole('button',{name:'Clear',exact:true}).click();
  for(const name of ['Little Jimmy','rabbit','Mr. Sir','mouse','Granny Smith','mushroom']) {
    await app.getByRole('button',{name,exact:true}).focus(); await page.keyboard.press('Space');
  }
  await app.getByRole('button',{name:'Check',exact:true}).click();
  await expect(app.locator('[data-feedback]')).toContainText('Correct');
  await course.getByRole('button',{name:'Next level',exact:true}).click();
  await expect(active(course).locator('[data-question-formula]')).toHaveText('{ x : x is a box }');
  await active(course).getByRole('button',{name:'Show answer',exact:true}).click();
  await expect(active(course).locator('[data-point].is-selected')).toHaveCount(2);
  await course.getByRole('button',{name:'Previous level',exact:true}).click();
  await expect(active(course).locator('[data-point].is-selected')).toHaveCount(6);
  for(let i=0;i<5;i++) await course.getByRole('button',{name:'Next level',exact:true}).click();
  await active(course).getByRole('button',{name:'Check',exact:true}).click();
  await expect(active(course).locator('[data-feedback]')).toContainText('Correct');
  await expect(course.getByRole('button',{name:'Next level',exact:true})).toBeDisabled();
});

test('true/false levels change diagrams and intersection selection stays separate', async ({page}) => {
  await page.goto('/exercises/valid-inference/');
  const course=page.locator('[data-set-levels]').nth(0);
  await expect(course.getByRole('checkbox')).toHaveCount(0);
  const expected=[false,true,true,false,false,true,true,false];
  let firstPath;
  for (let i=0;i<expected.length;i++) {
    const app=active(course);
    const misplaced = await app.evaluate(root => {
      const scene=JSON.parse(root.querySelector('[data-scene]').textContent);
      return scene.points.flatMap(point => scene.sets.filter(set => {
        const path=root.querySelector(`[id$="-shape-${set.id}"]`);
        return path.isPointInFill(new DOMPoint(point.x,point.y)) !== point.sets.includes(set.id);
      }).map(set => `${point.id} in ${set.id}`));
    });
    expect(misplaced).toEqual([]);
    const path=await app.locator('defs path').nth(1).getAttribute('d');
    if(i===0) firstPath=path;
    if(i===1) expect(path).not.toEqual(firstPath);
    await app.getByRole('button',{name:expected[i]?'True':'False',exact:true}).click();
    await expect(app.locator('[data-feedback]')).toContainText('Correct');
    if(i<expected.length-1) await course.getByRole('button',{name:'Next level',exact:true}).click();
  }
  const intersections=page.locator('[data-set-levels]').nth(1);
  const jimmy=active(intersections).getByRole('button',{name:'Little Jimmy',exact:true});
  await jimmy.click();
  await active(intersections).getByRole('button',{name:'Check',exact:true}).click();
  await expect(active(intersections).locator('[data-feedback]')).toContainText('Correct');
  for(let i=0;i<2;i++) await intersections.getByRole('button',{name:'Next level',exact:true}).click();
  await active(intersections).getByRole('button',{name:'Check',exact:true}).click();
  await expect(active(intersections).locator('[data-feedback]')).toContainText('Correct');
  // The unrelated model exercise keeps its direct task buttons.
  const models=page.locator('[data-set-exercise]').last();
  await models.getByRole('button',{name:'Countermodels',exact:true}).click();
  await models.getByRole('button',{name:'M₂',exact:true}).click();
  await models.getByRole('button',{name:'Check',exact:true}).click();
  await expect(models.locator('[data-feedback]')).toContainText('Correct');
});

for (const route of ['formal-languages','valid-inference']) {
  test(`set levels are accessible and fit small screens: ${route}`, async ({page}, testInfo) => {
    await page.goto(`/exercises/${route}/`);
    for(const theme of ['light','dark']) {
      await page.emulateMedia({colorScheme:theme});
      const result=await new AxeBuilder({page}).include('[data-set-levels]').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      expect(result.violations.map(v=>`${v.id}: ${v.help}`)).toEqual([]);
    }
    await page.setViewportSize({width:320,height:800});
    await page.evaluate(()=>document.fonts.ready);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.locator('[data-set-levels]').first().screenshot({path:testInfo.outputPath(`${route}-mobile.png`)});
  });
}

test('all levels have readable diagrams and answers without JavaScript', async ({browser}) => {
  const context=await browser.newContext({javaScriptEnabled:false});
  await routeToTestSite(context); const page=await context.newPage();
  await page.goto('http://127.0.0.1:4173/exercises/formal-languages/');
  const course=page.locator('[data-set-levels]');
  await expect(course.locator('[data-set-level]:visible')).toHaveCount(6);
  await course.getByText('Answer',{exact:true}).first().click();
  await expect(course.locator('details[open]').first()).toContainText('The three people, rabbit, mouse, and mushroom');
  await context.close();
});
