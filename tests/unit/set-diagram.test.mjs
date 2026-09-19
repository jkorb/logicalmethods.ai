import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { members, intersection, union, difference, isSubset, countermodels } from '../../assets/js/set-diagram-model.js';
const scenes = JSON.parse(readFileSync('data/set-diagrams.json', 'utf8'));
test('scene references are complete and IDs are unique', () => {
  for (const scene of Object.values(scenes)) {
    assert.equal(new Set(scene.points.map(p => p.id)).size, scene.points.length);
    assert.equal(new Set(scene.sets.map(s => s.id)).size, scene.sets.length);
    assert.equal(new Set(scene.steps.map(s => s.id)).size, scene.steps.length);
    for (const point of scene.points) for (const id of point.sets) assert.ok(scene.sets.some(s => s.id === id));
    for (const set of scene.sets) {
      assert.match(set.path, /^M .* Z$/);

    }
    for (const step of scene.steps) {
      for (const id of [...step.include, ...step.exclude, ...(step.union||[])]) assert.ok(scene.sets.some(s => s.id === id));
      for (const [, id] of step.text.matchAll(/@\{([^}]+)\}/g)) assert.ok(scene.points.some(p => p.id === id));
    }
  }
});
test('set queries handle intersection, subset, identity and empty premise lists', () => {
  assert.deepEqual(intersection(scenes.overlap, ['S', 'T']).map(p => p.id), ['b']);
  assert.deepEqual(difference(scenes.overlap, 'S', 'T').map(p => p.id), ['a']);
  assert.equal(isSubset(scenes.overlap, 'S', 'T'), false);
  assert.equal(isSubset(scenes.subset, 'S', 'T'), true);
  assert.equal(isSubset(scenes.subset, 'S', 'S'), true);
  assert.deepEqual(intersection(scenes.overlap, []), scenes.overlap.points);
  assert.throws(() => members(scenes.overlap, 'missing'));
});
test('consequence requires all premises, and semantics survives layout changes', () => {
  for (const key of ['consequence', 'single']) assert.equal(countermodels(scenes[key], scenes[key].premises, 'C').length, 0);
  assert.deepEqual(countermodels(scenes.countermodel, ['P','Q'], 'C').map(p => p.id), ['m2']);
  assert.deepEqual(countermodels(scenes['single-countermodel'], ['P'], 'C').map(p => p.id), ['m3']);
  assert.ok(countermodels(scenes.consequence, ['P'], 'C').length > 0);
  assert.ok(countermodels(scenes.consequence, ['Q'], 'C').length > 0);
  const moved = structuredClone(scenes.countermodel);
  moved.points.forEach(p => { p.x = 0; p.y = 0; });
  assert.deepEqual(countermodels(moved, ['P','Q'], 'C').map(p => p.id), ['m2']);
});

test('exercise answers include exact membership, multiple choices and an empty selection', async () => {
  const { exerciseAnswer, checkSelection } = await import('../../assets/js/set-diagram-model.js');
  const banks = JSON.parse(readFileSync('data/set-exercises.json', 'utf8'));
  const expected = {
    abstraction: [['jimmy','rabbit','sir','mouse','granny','mushroom'], ['box1','box2'], ['soda','beer'], ['rabbit','mouse','mushroom'], ['box1','soda','box2','beer'], []],
    relations: [false,true,true,false,false,true,true,false],
    intersections: [['b'],['a'],[]],
    countermodels: [['m1','m2'], ['m2']],
  };
  for (const [key, bank] of Object.entries(banks)) {
    assert.equal(new Set(bank.questions.map(q => q.id)).size, bank.questions.length);
    assert.deepEqual(bank.questions.map(q => exerciseAnswer(scenes[q.scene || bank.scene], q)), expected[key]);
    for (const q of bank.questions) {
      const scene = scenes[q.scene || bank.scene];
      assert.ok(scene);
      for (const [, id] of (q.statement || '').matchAll(/@\{([^}]+)\}/g)) assert.ok(scene.points.some(p => p.id === id));
    }
  }
  assert.deepEqual(checkSelection(['a','b'], ['b','a']), {correct:true,missing:0,extra:0});
  assert.deepEqual(checkSelection(['a','b'], ['a','c']), {correct:false,missing:1,extra:1});
  assert.equal(checkSelection([], []).correct, true);
  assert.equal(checkSelection([], ['a']).correct, false);
});


test('union keeps the overlap once and excludes points outside both sets', () => {
  assert.deepEqual(union(scenes.union,['S','T']).map(p=>p.id),['a','b','c','soda']);
  assert.deepEqual(union(scenes.union,[]),[]);
  assert.deepEqual(union(scenes.union,['S','S']),members(scenes.union,'S'));
  assert.throws(()=>union(scenes.union,['missing']));
});
