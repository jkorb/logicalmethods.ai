import { fileURLToPath } from 'node:url';
import base from '../../playwright.config.mjs';
export default {
  ...base, testDir: '../../tests/slides-preview', outputDir: '../../tmp/slides-preview-tests',
  reporter: 'list', use: { ...base.use, baseURL: 'http://127.0.0.1:4186' },
  projects: [base.projects[0]],
  webServer: { cwd: fileURLToPath(new URL('../../', import.meta.url)), command: 'node tools/slides/preview-test-server.mjs', url: 'http://127.0.0.1:4186', reuseExistingServer: false },
};
