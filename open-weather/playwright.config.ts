import { defineConfig } from '@playwright/test';
import path from 'node:path';

process.loadEnvFile(path.resolve(__dirname, '.env'));

const requiredEnv = ['API_URL', 'APPID'];
for (const name of requiredEnv) {
  if (!process.env[name]) throw new Error(`${name} is missing in .env`);
}

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
