import { expect, test } from '@playwright/test';

test('the learning story and activities remain usable without a 3D title page', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('lunala-graphics', 'lite'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Explore the Moon. Learn by doing.' })).toBeVisible();
  await expect(page.locator('.moon-stage')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => document.getElementById('team')!.scrollIntoView());
  await expect(page.getByText('Students & curious explorers', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Start a guided learning activity' }).click();
  await expect(page.getByRole('heading', { name: 'Learning activities', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Compare arrival windows' }).click();
  await expect(page).toHaveURL(/focus=haworth/);
});

test('verified science files survive reload without a second download', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    localStorage.setItem('lunala-graphics', 'lite');
    localStorage.setItem('lunar-window-tour-globe-v3', 'done');
    localStorage.setItem('lunar-window-tour-layers-v3', 'done');
  });
  let downloads = 0;
  page.on('request', request => { if (new URL(request.url()).pathname === '/data/grid/haworth.bin') downloads++; });
  await page.goto('/app?focus=haworth&heat=sun');
  await page.waitForFunction(() => {
    const button = [...document.querySelectorAll('button')].find(node => node.textContent === 'Continue to workspace');
    button?.click();
    return !!document.querySelector('.mission') && !document.querySelector('.boot');
  });
  await expect(page.locator('.holo-stage')).toBeVisible({ timeout: 30000 });
  await expect.poll(() => page.evaluate(async () => {
    const names = (await caches.keys()).filter(name => name.startsWith('lunala-public-assets-'));
    return names.length === 1 && !!await (await caches.open(names[0])).match('/data/grid/haworth.bin');
  })).toBe(true);
  expect(downloads).toBe(1);
  const started = Date.now();
  await page.reload();
  await page.waitForFunction(() => {
    const button = [...document.querySelectorAll('button')].find(node => node.textContent === 'Continue to workspace');
    button?.click();
    return !!document.querySelector('.mission') && !document.querySelector('.boot');
  });
  await expect(page.locator('.holo-stage')).toHaveAttribute('data-layer', 'sun', { timeout: 30000 });
  expect(downloads).toBe(1);
  console.info(`Warm repeat workspace: ${Date.now() - started} ms; Haworth binary downloaded once across two visits.`);
});

test('settled terrain stops drawing in Auto but still responds to orbit input', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('lunala-graphics', 'auto');
    localStorage.setItem('lunar-window-tour-globe-v3', 'done');
    localStorage.setItem('lunar-window-tour-layers-v3', 'done');
    const stats = window as unknown as { terrainDraws: number }; stats.terrainDraws = 0;
    for (const type of [WebGLRenderingContext, WebGL2RenderingContext]) {
      const original = type.prototype.drawElements;
      type.prototype.drawElements = function (...args: Parameters<typeof original>) {
        if ((this.canvas as HTMLCanvasElement).closest('.dot-field-canvas')) stats.terrainDraws++;
        return original.apply(this, args);
      };
    }
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/app?focus=haworth&heat=sun');
  await page.waitForFunction(() => {
    const button = [...document.querySelectorAll('button')].find(node => node.textContent === 'Continue to workspace');
    button?.click();
    return !!document.querySelector('.mission') && !document.querySelector('.boot');
  });
  await expect(page.locator('.holo-stage')).toBeVisible();
  const draws = () => page.evaluate(() => (window as unknown as { terrainDraws: number }).terrainDraws);
  await expect.poll(draws, { timeout: 30000 }).toBeGreaterThan(0);
  await expect.poll(async () => { const before = await draws(); await page.waitForTimeout(400); return await draws() - before; }, { timeout: 30000 }).toBeLessThan(4);
  const before = await draws(); const canvas = page.locator('.dot-field-canvas canvas');
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2 + 20, { steps: 5 }); await page.mouse.up();
  await expect.poll(draws).toBeGreaterThan(before);
  await page.getByLabel('Graphics quality').selectOption('lite');
  await expect.poll(() => canvas.evaluate(node => (node as HTMLCanvasElement).width / node.getBoundingClientRect().width)).toBeLessThan(1.02);
});
