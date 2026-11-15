import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './src', testMatch: '**/*.browser.ts', workers: 1,
  timeout: 60000,
  expect: { timeout: 15000 },
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173', viewport: { width: 1280, height: 900 }, trace: 'retain-on-failure', launchOptions: { args: process.env.PLAYWRIGHT_SOFTWARE_GL ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] : [], executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } },
  webServer: { command: 'pnpm dev', url: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});
