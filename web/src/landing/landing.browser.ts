import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('hero is immediately useful and hands off to the workspace', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Land where the light stays.' })).toBeVisible();
  await expect(page.locator('.lw.is-ready')).toHaveCount(1, { timeout: 10_000 });
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Open the navigator' }).click();
  await expect(page).toHaveURL(/\/app/, { timeout: 20_000 });
});

test('scrolling walks the chapters and the final button enters the navigator', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.lw.is-ready')).toHaveCount(1, { timeout: 10_000 });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('.lw')).toHaveAttribute('data-chapter', '7', { timeout: 20_000 });
  const enter = page.getByRole('button', { name: 'Enter the navigator' });
  await expect(enter).toBeVisible();
  await enter.click();
  await expect(page).toHaveURL(/\/app/, { timeout: 20_000 });
});

test('reduced motion snaps chapters and never overflows on mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open the navigator' }).click();
  await expect(page).toHaveURL(/\/app/);
});
