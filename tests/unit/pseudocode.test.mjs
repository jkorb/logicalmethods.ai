import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { pseudocodeIssues } from '../../scripts/pseudocode.mjs';
const fence=(code,language='python')=>'```'+language+'\n'+code+'\n```\n';
test('textbook procedure blocks follow the shared pseudocode notation',async()=>{
  const failures=[];
  for(const area of ['textbook','exercises']) {
  const root=new URL('../../content/'+area+'/',import.meta.url);
  for(const path of await readdir(root,{recursive:true})) {
    if(!path.endsWith('.md'))continue;
    const source=await readFile(new URL(path,root),'utf8');
    failures.push(...pseudocodeIssues(source).map(e=>path+':'+e.line+': '+e.message));
  }
  }
  assert.deepEqual(failures,[]);
});
test('pseudocode check catches the notation regressions without requiring executable Python',()=>{
  const good='def example(input):\n    result = unspecified_helper(input)\n    if result == "←":\n        return result\n    else:\n        return other_helper(input)';
  assert.deepEqual(pseudocodeIssues(fence(good)),[]);
  assert.deepEqual(pseudocodeIssues('In prose, x ← y is an arrow.'),[]);
  for(const bad of [
    fence(good,'text'),
    fence(good.replace('result = unspecified_helper(input)', 'first, second = pair')),
    fence(good.replace('result = unspecified_helper(input)', '(first, second) = pair')),
    fence(good.replace('def example','procedure example')),
    fence(good.replace('result = unspecified','result ← unspecified')),
    fence(good.replace('result = unspecified','result := unspecified')),
    fence(good.replace('result ==','result =')),
    fence(good.replace('unspecified_helper(input)','input.append(result)')),
    fence(good.replace('    result','  result')),
    fence(good.replace('else:','otherwise:')),
    fence(good.replace('else:','else')),
    fence(good.replace('return result','return result;'))
  ])assert.ok(pseudocodeIssues(bad).length,bad);
});

test('pseudocode exercise decks have complete answers conforming to the same notation',async()=>{
  for(const name of ['pseudocode-practice','pseudocode-sat']) {
    const levels=JSON.parse(await readFile(new URL('../../data/'+name+'.json',import.meta.url),'utf8'));
    for(const level of levels) {
      assert.equal(level.code.split('___').length-1,level.answers.length,level.title);
      let i=0;const completed=level.code.replaceAll('___',()=>level.answers[i++]);
      assert.deepEqual(pseudocodeIssues(fence(completed)),[],level.title);
      assert.ok(level.answers.every(a=>a.length<=12),level.title);
    }
  }
});
test('indented exercise code fences are checked relative to their list indentation',()=>{
  const good=fence('def example():\n    return helper()').split('\n').map(l=>'   '+l).join('\n');
  assert.deepEqual(pseudocodeIssues(good),[]);
  assert.ok(pseudocodeIssues(good.replace('def example','procedure example')).length);
});
