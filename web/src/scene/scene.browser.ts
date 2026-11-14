import { expect, test } from '@playwright/test';

test('terrain and polar views render without crossing the React/R3F error boundaries', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/app?view=map&sites=custom-m85d994800-m0d235780');
  await expect(page.getByLabel('Interactive lunar terrain')).toBeVisible();
  await expect(page.getByText('Real LOLA terrain · 80 m')).toBeVisible();

  await page.getByLabel('Terrain layer').selectOption('slope');
  await expect(page.getByText('10° limit')).toBeVisible();
  await page.getByRole('button', { name: '3D terrain' }).click();
  await expect(page.getByLabel('Interactive Moon overview')).toBeVisible();
  await page.getByRole('button', { name: 'Explore local terrain' }).click();
  await expect(page.getByLabel('Interactive lunar terrain')).toBeVisible();

  await expect(page.getByText('The interface could not load.')).toHaveCount(0);
  await expect(page.getByText('The terrain view could not start.')).toHaveCount(0);
  expect(errors).toEqual([]);
});
