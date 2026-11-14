import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('hero is immediately useful and hands off to the workspace', async ({ page }) => {
  const started = Date.now();
  await page.goto('/');
  const hero = page.locator('.landing-hero');
  await expect(hero.getByRole('heading', { name: 'A landing date changes the view.' })).toBeVisible();
  const heroCta = hero.getByRole('button', { name: 'Open the navigator' });
  await expect(heroCta).toBeVisible();
  expect(Date.now() - started).toBeLessThan(2500);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await heroCta.click();
  await expect(page).toHaveURL(/\/app/);
});

test('final section hands off to the workspace', async ({ page }) => {
  await page.goto('/');
  const finalCta = page.locator('.landing-final').getByRole('button', { name: 'Open the navigator' });
  await finalCta.scrollIntoViewIfNeeded();
  await expect(finalCta).toBeVisible();
  await finalCta.click();
  await expect(page).toHaveURL(/\/app/);
});

test('reduced motion gets the static Moon without horizontal overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('.static-moon')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
