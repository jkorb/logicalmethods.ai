import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { reviewScreenshot } from '../browser/review-screenshot.mjs';

test('review screenshots require explicit opt-in, including in CI', async () => {
  const original = process.env.REVIEW_SCREENSHOTS;
  let calls = 0;
  const target = { screenshot: async () => { calls++; } };
  try {
    delete process.env.REVIEW_SCREENSHOTS;
    await reviewScreenshot(target, {});
    assert.equal(calls, 0);
    process.env.REVIEW_SCREENSHOTS = '1';
    await reviewScreenshot(target, {});
    assert.equal(calls, 1);
  } finally {
    if (original === undefined) delete process.env.REVIEW_SCREENSHOTS;
    else process.env.REVIEW_SCREENSHOTS = original;
  }
});

test('browser specs cannot silently add unconditional review screenshots', async () => {
  for (const name of await readdir('tests/browser')) {
    if (!name.endsWith('.spec.mjs')) continue;
    const source = await readFile(`tests/browser/${name}`, 'utf8');
    for (const line of source.split('\n').filter(line => line.includes('.screenshot('))) {
      // These two buffers are compared to detect corrupted weather artwork.
      assert.ok(name === 'boolean-world-art.spec.mjs' && /const (actual|expected)=await .*\.screenshot\(options\)/.test(line),
        `${name}: use reviewScreenshot for review artifacts; direct captures need pixel assertions`);
    }
  }
});
