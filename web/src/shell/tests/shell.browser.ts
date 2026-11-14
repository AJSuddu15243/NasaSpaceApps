import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('routes, controls, URL round trips, history and clipboard fallback', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'A landing date changes the view.' })).toBeVisible();
  await page.getByRole('button', { name: 'Open the navigator' }).click();
  await expect(page.getByRole('heading', { name: 'One window. Different horizons.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Demo ridge A', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Explorer', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Comparison weights' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Polar map', exact: true }).click();
  const shared = page.url();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Explorer', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Polar map not loaded' })).toBeVisible();
  await page.getByRole('button', { name: 'Planner', exact: true }).click();
  await page.goBack();
  await expect(page.getByRole('button', { name: 'Explorer', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.goForward();
  await expect(page.getByRole('button', { name: 'Planner', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByLabel('Mission length (h)').fill('24');
  await page.getByRole('button', { name: 'Apply window' }).click();
  await expect(page.getByText('No computed results for this scenario.', { exact: false }).first()).toBeVisible();
  await expect(page.locator('.primary-metric')).toHaveCount(0);
  await page.getByRole('button', { name: 'Restore demo scenario' }).click();
  await expect(page.locator('.primary-metric')).toHaveCount(2);
  await page.getByRole('checkbox', { name: /Demo ridge A/ }).uncheck();
  await page.getByRole('checkbox', { name: /Demo ridge B/ }).uncheck();
  await expect(page.getByRole('heading', { name: 'No sites selected' })).toBeVisible();
  await page.goto(shared);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('Denied')) } }));
  await page.getByRole('button', { name: 'Share scenario' }).click();
  await expect(page.getByRole('textbox', { name: 'Scenario link' })).toHaveValue(shared);
  expect(errors).toEqual([]);
});
test('responsive layouts, focus and automated accessibility', async ({ page }) => {
  for (const [width, height, suffix] of [[1280, 900, 'desktop'], [375, 812, 'mobile']] as const) {
    await page.setViewportSize({ width, height });
    for (const route of ['/', '/app']) {
      await page.goto(route);
      if (route === '/app') {
        await expect(page.locator('.primary-metric')).toHaveCount(2);
        const scene = page.getByRole('group', { name: 'Interactive lunar south-pole terrain scene' });
        const bounds = await scene.evaluate(node => ({ width: node.clientWidth, height: node.clientHeight }));
        await expect(scene.locator('canvas')).toHaveJSProperty('clientWidth', bounds.width);
        await expect(scene.locator('canvas')).toHaveJSProperty('clientHeight', bounds.height);
      }
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
      await page.screenshot({ path: `qa/web-1-${route === '/' ? 'landing' : 'workspace'}-${suffix}.png`, fullPage: true });
    }
  }
  await page.goto('/app');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.locator('body').evaluate(node => getComputedStyle(node).animationName)).toBe('none');
});
test('failed and corrupt downloads recover via Retry; bad URLs stay usable', async ({ page }) => {
  await page.route('**/data/mock/sites.json', route => route.fulfill({ status: 503, body: 'unavailable' }));
  await page.goto('/app');
  await expect(page.getByRole('heading', { name: 'The workspace could not load.' })).toBeVisible();
  await page.unroute('**/data/mock/sites.json');
  await page.getByRole('button', { name: 'Retry loading' }).click();
  await expect(page.locator('.primary-metric')).toHaveCount(2);
  await page.route('**/data/mock/ephem.bin', route => route.fulfill({ body: Buffer.from([1, 2, 3]) }));
  await page.reload();
  await expect(page.getByText('The ephemeris table does not match its header.')).toBeVisible();
  await page.unroute('**/data/mock/ephem.bin');
  await page.goto('/app?hours=NaN&date=2026-02-30T00:00:00Z&sites=missing');
  await expect(page.getByText('Invalid UTC date:', { exact: false })).toBeVisible();
  await expect(page.getByText('Some linked sites are unavailable', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Restore demo scenario' }).click();
  await expect(page.locator('.primary-metric')).toHaveCount(2);
  await page.goto('/does-not-exist');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});
