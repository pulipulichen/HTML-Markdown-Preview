import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results',
  reporter: [['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:8080',
    video: 'retain-on-failure',
  },
});
