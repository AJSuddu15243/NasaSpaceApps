import { expect, test } from '@playwright/test';

test('skipping onboarding cannot mutate the shared scenario or trap focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/app');
  await page.getByRole('button', { name: 'Continue to workspace' }).click({ timeout: 15000 }).catch(() => {});
  await expect(page.locator('.boot')).toHaveCount(0);
  const tour = page.getByTestId('navigator-tour');
  await expect(tour).toBeVisible();
  const original = page.url();
  await tour.getByRole('button', { name: 'Start briefing' }).click();
  await expect(tour.getByRole('heading', { name: 'Choose a place' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(tour).toHaveCount(0);
  expect(page.url()).toBe(original);
  await expect(page.locator('#main')).toBeFocused();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Replay mission briefing' })).toBeVisible();
  await expect(tour).toHaveCount(0);
});

test('Moon and survey guides hand off, replay by view, and restore all layers', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lunar-window-tour-globe-v3', 'done'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/app');
  await page.getByRole('button', { name: 'Continue to workspace' }).click({ timeout: 15000 }).catch(() => {});
  await expect(page.locator('.boot')).toHaveCount(0);
  const tour = page.getByTestId('navigator-tour');
  await page.getByRole('button', { name: 'Replay mission briefing' }).click();
  for (const heading of ['Choose a place', 'Read the heatmaps', 'Move the date', 'Set your priorities', 'Compare and check the evidence', 'Continue into the survey']) {
    await expect(tour.getByRole('heading', { name: heading })).toBeVisible();
    if (heading !== 'Continue into the survey') await tour.getByRole('button', { name: 'Next' }).click();
  }
  const moonUrl = page.url();
  await tour.getByRole('button', { name: 'Explore on my own' }).click();
  expect(page.url()).toBe(moonUrl);
  await expect(page.getByRole('button', { name: /Survey Connecting Ridge/ })).toBeVisible();
  await page.getByRole('button', { name: /Survey Connecting Ridge/ }).click();
  await expect(tour.getByRole('heading', { name: 'Navigate the survey' })).toBeVisible();
  for (const heading of ['Inspect elevation', 'Read a cell', 'Understand this site']) {
    await tour.getByRole('button', { name: 'Next' }).click();
    await expect(tour.getByRole('heading', { name: heading })).toBeVisible();
  }
  await expect(page.getByRole('button', { name: 'Elevation' })).toBeVisible();
  await tour.getByRole('button', { name: 'Explore all layers' }).click();
  await expect(page.locator('.holo-stage')).toHaveAttribute('data-layer', 'stack');
  await page.getByRole('button', { name: 'Replay survey guide' }).click();
  await expect(tour.getByRole('heading', { name: 'Navigate the survey' })).toBeVisible();
  await tour.getByRole('button', { name: 'Next' }).click();
  await tour.getByRole('button', { name: 'Skip tour' }).click();
  await expect(page.locator('.holo-stage')).toHaveAttribute('data-layer', 'stack');
  await page.getByRole('button', { name: 'Return to globe' }).click();
  await page.getByRole('button', { name: 'Replay mission briefing' }).click();
  await expect(tour.getByRole('heading', { name: 'Choose a place' })).toBeVisible();
});

test('blocked storage and reduced motion cannot make the mobile tour undiscardable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage unavailable'); } });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/app');
  await page.getByRole('button', { name: 'Continue to workspace' }).click({ timeout: 15000 }).catch(() => {});
  await expect(page.locator('.boot')).toHaveCount(0);
  const tour = page.getByTestId('navigator-tour');
  await expect(tour).toBeVisible();
  const box = await tour.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  await tour.getByRole('button', { name: 'Skip tour' }).click();
  await expect(tour).toHaveCount(0);
});
