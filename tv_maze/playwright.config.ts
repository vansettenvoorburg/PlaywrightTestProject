import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  reporter: [
    [
      'list'
    ],
    [
      'html',
      {
        outputFolder: 'report'
      }
    ]
  ],
  outputDir: 'test-results'
});
