import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('lunar-window-tour-globe-v3', 'done'); localStorage.setItem('lunar-window-tour-layers-v3', 'done'); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
});
async function enter(page: import('@playwright/test').Page, url = '/app') {
  await page.goto(url);
  await page.getByRole('button', { name: 'Continue to workspace' }).click({ timeout: 15000 }).catch(() => {});
  await expect(page.locator('.boot')).toHaveCount(0);
}
test('history and shared links cannot silently drop the focused layer or priorities', async ({ page }) => {
  await enter(page, '/app?focus=haworth&heat=slope');
  await expect(page.locator('.holo-stage')).toHaveAttribute('data-layer', 'slope');
  await page.getByRole('button', { name: 'Planner', exact: true }).click();
  await expect(page.getByLabel('Maximum landing slope in degrees')).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('button', { name: 'Explorer', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.goForward();
  await expect(page.getByRole('button', { name: 'Planner', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.reload(); await page.getByRole('button', { name: 'Continue to workspace' }).click({ timeout: 15000 }).catch(() => {});
  await expect(page.locator('.boot')).toHaveCount(0);
  await expect(page.locator('.holo-stage')).toHaveAttribute('data-layer', 'slope');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('Denied')) } }));
  await page.getByRole('button', { name: 'Share', exact: true }).click();
  await expect(page.getByLabel('Scenario link')).toHaveValue(page.url());
});
test('mobile and desktop controls remain inside the viewport and accessible', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await enter(page, '/app?focus=connecting-ridge');
    await expect(page.locator('.holo-stage')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const box = await page.locator('.holo-stage').boundingBox();
    expect(box!.height).toBeGreaterThan(250);
    const result = await new AxeBuilder({ page }).include('.mission').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
  }
});
test('a minimized timeline can be restored and header tooltips are visible', async ({ page }) => {
  for (const [width, height] of [[1440, 900], [1280, 800], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await enter(page, '/app');
    await page.getByRole('button', { name: 'Minimize timeline' }).click();
    const fab = page.getByRole('button', { name: 'Show mission timeline' });
    const box = (await fab.boundingBox())!;
    expect(box.y).toBeGreaterThan(height / 2);
    await fab.click();
    await expect(page.getByRole('button', { name: 'Minimize timeline' })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Replay mission briefing' }).hover();
  await expect(page.getByRole('tooltip')).toContainText('Replay the mission briefing tour');
});
test('failed grids recover and malformed links never fabricate results', async ({ page }) => {
  await page.route('**/data/grid/haworth.bin', route => route.fulfill({ status: 503, body: 'unavailable' }));
  await enter(page, '/app?focus=haworth');
  await expect(page.getByText('Some science grids could not load:', { exact: false })).toBeVisible();
  await expect(page.locator('.holo-stage')).toHaveCount(0);
  await page.unroute('**/data/grid/haworth.bin');
  await page.getByRole('button', { name: 'Retry science grids' }).click();
  await expect(page.locator('.holo-stage')).toBeVisible();
  await enter(page, '/app?hours=NaN&date=2026-02-30T00:00:00Z&focus=missing');
  await expect(page.getByText('Invalid UTC date:', { exact: false })).toBeVisible();
  await expect(page.getByText('This focused location is unavailable.', { exact: false })).toBeVisible();
  await page.goto('/does-not-exist');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('Planner changes cannot leave the prioritized dock redundant or out of order', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await enter(page, '/app?focus=haworth');
  const dock = page.getByRole('group', { name: 'Heatmap layer', exact: true });
  await expect(dock.getByRole('button').first()).toHaveText('Suitability');
  await expect(dock.getByRole('button', { name: 'Terrain', exact: true })).toHaveCount(1);
  await expect(dock.getByRole('button', { name: /^(Slope|Elevation|Relief)$/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Planner', exact: true }).click();
  await expect(page.getByText('Exact numbers: tune weights, limits, export data.')).toBeVisible();
  await page.getByLabel('Sunlight weight', { exact: true }).focus();
  await page.keyboard.press('Home');
  await page.getByLabel('Earth contact weight', { exact: true }).focus();
  await page.keyboard.press('End');
  await expect(dock.getByRole('button').nth(1)).toHaveText('Radio');
  await expect(page.getByRole('button', { name: 'Export ranked areas (CSV)' })).toBeVisible();
  await dock.getByRole('button', { name: 'Terrain', exact: true }).click();
  await expect(page.locator('.terrain-switch').getByRole('button', { name: 'Slope', exact: true })).toBeVisible();
});
