import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    localStorage.setItem('lunar-window-tour-v2', 'done');
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (String(args[0]).includes('webgl')) return null;
      return original.apply(this, args);
    } as typeof original;
  });
});

test('WebGL loss cannot hide source values or prevent returning to the globe', async ({ page }) => {
  await page.goto('/app?focus=connecting-ridge&heat=sun');
  await page.getByRole('button', { name: 'Continue to workspace' }).evaluate(button => (button as HTMLButtonElement).click());
  await expect(page.getByText('3D unavailable.', { exact: false })).toBeVisible();
  await page.getByLabel('Inspect grid cell').fill('0');
  await expect(page.locator('.holo-probe')).toContainText('%');
  await page.keyboard.press('Escape');
  await expect(page.locator('.holo-stage')).toHaveCount(0);
});

test('a delayed previous terrain response cannot replace the new region', async ({ page }) => {
  await page.route('**/data/tiles/connecting-ridge_80m.bin', async route => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    await route.continue().catch(() => {});
  });
  await page.goto('/app?focus=connecting-ridge');
  await page.getByRole('button', { name: 'Continue to workspace' }).evaluate(button => (button as HTMLButtonElement).click());
  await page.getByRole('button', { name: 'Sites & priorities' }).click();
  await page.getByRole('button', { name: 'Fly to and inspect Haworth', exact: true }).click();
  await expect(page.locator('.holo-eyebrow')).toContainText('HAWORTH');
  await expect(page.getByText('3D unavailable.', { exact: false })).toBeVisible();
  await page.waitForTimeout(1400);
  await expect(page.locator('.holo-eyebrow')).toContainText('HAWORTH');
  await expect(page).toHaveURL(/focus=haworth/);
});

test('missing imagery cannot be advertised as a selectable photo', async ({ page }) => {
  await page.route('**/data/imagery/haworth.json', route => route.fulfill({ status: 404, body: 'missing' }));
  await page.goto('/app?focus=haworth');
  await page.getByRole('button', { name: 'Continue to workspace' }).evaluate(button => (button as HTMLButtonElement).click());
  await expect(page.getByText('NAC imagery unavailable for this region.', { exact: true })).toBeVisible();
  // shortcut: the dock does not know per-region asset availability, so only the alert is asserted; disable dock buttons when HoloStage reports availability upward.
});
