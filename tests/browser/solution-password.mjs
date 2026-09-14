import { createHash } from 'node:crypto';

export const testPassword = 'test-only-solution-password';

// Exercise the real hashing and modal flow without recording course passwords.
export async function useTestPassword(page) {
  await page.route(/\/js\/exercises[^/]*\.js(?:\?.*)?$/, async route => {
    const url = new URL(route.request().url());
    const response = await route.fetch({ url: `http://127.0.0.1:4173${url.pathname}${url.search}` });
    const source = await response.text();
    const hash = createHash('sha256').update(testPassword).digest('hex');
    if (!/"[a-f0-9]{64}"/.test(source)) throw new Error('Exercise password hashes missing');
    await route.fulfill({ response, body: source.replace(/"[a-f0-9]{64}"/g, `"${hash}"`) });
  });
}
