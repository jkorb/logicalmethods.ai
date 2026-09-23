import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const CSS = 'assets/icons/subset/bootstrap-icons-subset.css';
const WOFF2 = 'assets/icons/subset/bootstrap-icons-subset.woff2';

/* Hugo fingerprints the subset CSS but serves the font from a fixed static
   path. Without a hash on the font URL a regenerated subset shipped new rules
   to browsers still holding the previous font, and every icon added since the
   visitor's last visit drew as a tofu box with its codepoint inside. */
test('the subset font URL carries the hash of the font actually shipped', () => {
  const css = readFileSync(CSS, 'utf8');
  const src = css.match(/src:\s*url\("([^"]+)"\)/);
  assert.ok(src, 'no @font-face src in the generated subset CSS');

  const version = src[1].match(/\?v=([0-9a-f]+)$/);
  assert.ok(version, `font URL has no ?v= cache key: ${src[1]}`);

  const digest = createHash('sha256').update(readFileSync(WOFF2)).digest('hex');
  assert.equal(version[1], digest.slice(0, version[1].length),
    'font URL cache key is stale — rerun scripts/subset-icons.py');
});
