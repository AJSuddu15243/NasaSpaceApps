import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './src', testMatch: '**/*.browser.ts', workers: 1,
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:4173', viewport: { width: 1280, height: 900 }, trace: 'retain-on-failure', launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } },
  webServer: { command: 'pnpm dev', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});
