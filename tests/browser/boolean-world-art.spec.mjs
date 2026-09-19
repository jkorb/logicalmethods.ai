import { mkdir, writeFile } from 'node:fs/promises';
import { test, expect } from './fixtures.mjs';

// Compare actual rendered pixels with the supplied artwork, not just selection
// classes or element counts. Hide only our intentional overlays and lift.
async function expectIntactArtwork(app) {
  const space=app.locator('.boolean-space');
  const options={animations:'disabled',style:`
    .site-header,.back-to-top {visibility:hidden!important}
    [data-world-art] {transform:none!important;filter:none!important;transition:none!important}
    .boolean-world-halo,.boolean-model-contour,.boolean-proposition-outline,.boolean-model-label,.boolean-world {visibility:hidden!important}
  `};
  const actual=await space.locator('svg.figure-svg').screenshot(options);
  await app.evaluate(root=>{
    const reference=root.querySelector('[data-world-space]').content.cloneNode(true).querySelector('svg');
    for(const n of reference.querySelector('g').querySelectorAll('[fill]'))if(n.getAttribute('fill')!=='none')n.setAttribute('fill','var(--set-universe)');
    root._artUnderTest=root.querySelector('.boolean-space svg');
    root._artUnderTest.replaceWith(reference);
  });
  const expected=await space.locator('svg.figure-svg').screenshot(options);
  await app.evaluate(root=>{root.querySelector('.boolean-space svg').replaceWith(root._artUnderTest);delete root._artUnderTest;});
  if(actual.equals(expected))return;
  // <use> and direct paths have slightly different edge antialiasing. A small
  // per-channel tolerance allows that; losing a stroke or fill does not pass.
  // Fractional positions after taller canvases produce isolated edge differences
  // up to 40/255 in Chromium; keep the tolerance below any missing-stroke contrast.
  const diff=await app.evaluate(async(_,encoded)=>{
    async function pixels(data){const img=new Image();img.src='data:image/png;base64,'+data;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);return {c,ctx,p:ctx.getImageData(0,0,c.width,c.height)};}
    const a=await pixels(encoded[0]),b=await pixels(encoded[1]);let different=0,max=0;
    for(let i=0;i<a.p.data.length;i+=4){const d=Math.max(...[0,1,2].map(j=>Math.abs(a.p.data[i+j]-b.p.data[i+j])));max=Math.max(max,d);if(d>48)different++;a.p.data[i]=d>48?255:0;a.p.data[i+1]=0;a.p.data[i+2]=0;}
    a.ctx.putImageData(a.p,0,0);return {different,max,image:a.c.toDataURL().split(',')[1]};
  },[actual.toString('base64'),expected.toString('base64')]);
  if(diff.different){const folder=test.info().outputPath('artwork');await mkdir(folder,{recursive:true});await writeFile(`${folder}/expected.png`,expected);await writeFile(`${folder}/actual.png`,actual);await writeFile(`${folder}/diff.png`,Buffer.from(diff.image,'base64'));}
  expect(diff.different,`Artwork changed beyond edge antialiasing (maximum channel difference ${diff.max})`).toBe(0);
}

for(const theme of ['light','dark'])for(const section of ['textbook','exercises']) {
  test(`${section} world artwork survives every selection in ${theme}`,async({page},info)=>{
    test.setTimeout(120000);
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    // Regressions must not depend on a successful live SVG geometry measurement.
    await page.addInitScript(()=>{SVGGraphicsElement.prototype.getBBox=function(){throw new Error('World artwork must not be assembled from bounding boxes');};});
    await page.emulateMedia({colorScheme:theme,reducedMotion:'reduce'});
    await page.goto(`/${section}/boolean/`);await page.evaluate(()=>document.fonts.ready);
    const apps=page.locator('.boolean-app').filter({has:page.locator('.boolean-space')});
    for(let i=0;i<await apps.count();i++) {
      const app=apps.nth(i);await expectIntactArtwork(app);
      if(section==='textbook') {
        const selectors=app.locator('[data-propositions] button');
        for(let j=0;j<await selectors.count();j++){await selectors.nth(j).click();await expectIntactArtwork(app);}
      }else {
        const worlds=app.locator('button[data-model]');
        for(let j=0;j<await worlds.count();j++){await worlds.nth(j).click();await expectIntactArtwork(app);}
        await app.screenshot({path:`tmp/boolean-art-review/${info.project.name}-${theme}-${i}-all-selected.png`});
        for(let j=0;j<await worlds.count();j++){await worlds.nth(j).click();await expectIntactArtwork(app);}
        const tasks=app.locator('[data-toolbar] button');
        for(let j=0;j<await tasks.count();j++){await tasks.nth(j).click();await expectIntactArtwork(app);}
      }
      await app.screenshot({path:`tmp/boolean-art-review/${info.project.name}-${theme}-${section}-${i}.png`});
    }
    expect(errors).toEqual([]);
  });
}
