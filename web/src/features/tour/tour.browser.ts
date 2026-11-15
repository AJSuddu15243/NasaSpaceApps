import { expect, test } from '@playwright/test';

test('skipping onboarding cannot mutate the shared scenario or trap focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/app');
  await page.getByRole('button', { name: 'Continue to workspace' }).evaluate(button => (button as HTMLButtonElement).click(), undefined, { timeout: 2000 }).catch(() => {});
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
  await expect(page.getByRole('button', { name: /replay briefing/i })).toBeVisible();
  await expect(tour).toHaveCount(0);
});

test('replayed guidance resets its step and restores focus to the replay control', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lunar-window-tour-v2', 'done'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/app');
  await page.getByRole('button', { name: 'Continue to workspace' }).evaluate(button => (button as HTMLButtonElement).click(), undefined, { timeout: 2000 }).catch(() => {});
  await expect(page.locator('.boot')).toHaveCount(0);
  const replay = page.getByRole('button', { name: /replay briefing/i });
  await replay.click();
  const tour = page.getByTestId('navigator-tour');
  await expect(tour.getByRole('heading', { name: 'Choose a place' })).toBeVisible();
  await tour.getByRole('button', { name: 'Next' }).click();
  await expect(tour.getByRole('heading', { name: 'Read the heatmaps' })).toBeVisible();
  await tour.getByRole('button', { name: 'Back' }).click();
  await expect(tour.getByRole('heading', { name: 'Choose a place' })).toBeVisible();
  for (let i = 0; i < 4; i++) await tour.getByRole('button', { name: 'Next' }).click();
  await tour.getByRole('button', { name: 'Start exploring' }).click();
  await expect(replay).toBeFocused();
  await replay.click();
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
  await page.getByRole('button', { name: 'Continue to workspace' }).evaluate(button => (button as HTMLButtonElement).click(), undefined, { timeout: 2000 }).catch(() => {});
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
