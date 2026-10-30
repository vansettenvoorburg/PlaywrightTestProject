import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

process.loadEnvFile(path.resolve(__dirname, '.env'));

const requiredEnv = [
  'BASE_URL', 'API_URL',
  'ADMIN_NAME', 'ADMIN_EMAIL', 'ADMIN_PASSWORD',
  'USER_NAME', 'USER_EMAIL', 'USER_PASSWORD',
];
for (const name of requiredEnv) {
  if (!process.env[name]) throw new Error(`${name} is missing in .env`);
}

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: process.env.BASE_URL,
    locale: 'nl-NL',
    headless: false,
    actionTimeout: 10000,
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        ...devices['Desktop Chrome']
      }
    }
  ],
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
