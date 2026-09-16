import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, copyFile, readFile, rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {load} from 'cheerio';

test('Hugo separates Unicode math, literal code and reusable direct SVG exports', async t => {
  await mkdir('tmp', {recursive:true});
  const root = await mkdtemp(path.resolve('tmp/rendering-fixture-'));
  t.after(() => rm(root, {recursive:true, force:true}));
  for (const dir of ['content','layouts/_default/_markup','layouts/shortcodes','layouts/partials/figures','assets/img']) await mkdir(path.join(root,dir),{recursive:true});
  for (const file of ['layouts/_default/_markup/render-passthrough.html','layouts/shortcodes/img.html','layouts/partials/figures/image.html']) await copyFile(file,path.join(root,file));
  await writeFile(path.join(root,'layouts/index.html'),'{{ .Content }}');
  await writeFile(path.join(root,'hugo.toml'), `baseURL = 'https://example.test/'
[markup.goldmark.renderer]
unsafe = true
[markup.goldmark.extensions.passthrough]
enable = true
[markup.goldmark.extensions.passthrough.delimiters]
block = [['$$', '$$']]
inline = [['$', '$']]
`);
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50"><defs><clipPath id="clip"><rect width="100" height="50"/></clipPath></defs><g clip-path="url(#clip)"><text x="10" y="20">Tree</text></g></svg>';
  await writeFile(path.join(root,'assets/img/tree.svg'),svg);
  await writeFile(path.join(root,'content/_index.md'), `---
title: Fixture
---
Inline $p ∧ q$, literal \`$p ∧ q$\`, escaped \\$5, and $X !!AND!! Y$.

$$
(1)  A ⟹ pᵢ
(2)  A ⟹ ¬A
$$

\`\`\`text
$literal$ !!code!! <tag>
\`\`\`

{{< img src="/img/tree.svg" width="200px" class="float-end" alt="A & B" >}}
{{< img src="/img/tree.svg" >}}
`);
  execFileSync('hugo',['-D','--source',root],{stdio:'pipe'});
  const $ = load(await readFile(path.join(root,'public/index.html'),'utf8'));
  assert.equal($('.math-inline').first().text(),'p ∧ q');
  assert.equal($('.Boolean').text(),'AND');
  assert.equal($('.math-display').text(),'(1)  A ⟹ pᵢ\n(2)  A ⟹ ¬A');
  assert.equal($('p code').text(),'$p ∧ q$');
  assert.match($('pre code').text(), /\$literal\$ !!code!! <tag>/);
  assert.match($('p').text(), /escaped \$5/);
  assert.equal($('.book-figure.float-end').length,1);
  assert.equal($('svg[aria-label="A & B"]').length,1);
  assert.equal($('svg[aria-hidden="true"]').length,1);
  assert.equal($('svg[width],svg[height]').length,0);
  const ids = $('[id]').map((_,el) => $(el).attr('id')).get();
  assert.equal(new Set(ids).size,ids.length);
  for(const g of $('g').toArray()) assert.ok(ids.includes($(g).attr('clip-path').slice(5,-1)));
  assert.equal($('rect').first().attr('width'),'100');
});
