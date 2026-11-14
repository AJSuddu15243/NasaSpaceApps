import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('components, keyboard navigation, token coverage and accessibility', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/design');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.getByRole('button', { name: 'Primary action' }).click();
  await expect(page.getByText('default action previewed.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
  await page.getByLabel('Site label').fill('Keyboard site');
  await expect(page.getByLabel('Site label')).toHaveValue('Keyboard site');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await page.screenshot({ path: 'preview/design-desktop.png', fullPage: true });
  await page.getByRole('tab', { name: 'Components', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Tokens', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('--sun', { exact: true })).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--motion-base').trim())).toBe('0ms');
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: 'Usage', exact: true })).toHaveAttribute('aria-selected', 'true');
  expect(errors).toEqual([]);
});
test('mobile fits without horizontal scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/design');
  for (const tab of ['Components', 'Tokens', 'Usage']) {
    await page.getByRole('tab', { name: tab, exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByRole('tab', { name: 'Components', exact: true }).click();
  await page.screenshot({ path: 'preview/design-mobile.png', fullPage: true });
});
