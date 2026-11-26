import { expect, test } from '@playwright/test';

test('Share and graphics controls keep their own space on desktop and mobile', async ({ page }) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/docs');
    await expect(page.getByRole('heading', {name:'How the navigator works.'})).toBeVisible();
    const header = page.locator('.app-header');
    const share = header.getByRole('button', { name: 'Share', exact: true });
    const select = header.getByLabel('Graphics quality');
    const label = header.locator('.graphics-control span');
    const [a, b, c] = await Promise.all([share.boundingBox(), select.boundingBox(), label.boundingBox()]);
    expect(a).not.toBeNull(); expect(b).not.toBeNull(); expect(c).not.toBeNull();
    for (const box of [a!, b!, c!]) { expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(width); }
    if (width > 700) {
      expect(a!.x - (b!.x + b!.width)).toBeGreaterThanOrEqual(18);
      expect(b!.x - (c!.x + c!.width)).toBeGreaterThanOrEqual(10);
    } else {
      expect(b!.y - (a!.y + a!.height)).toBeGreaterThanOrEqual(12);
      expect(b!.y - (c!.y + c!.height)).toBeGreaterThanOrEqual(4);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await header.screenshot({path:test.info().outputPath(`header-workspace-${width}.png`)});
    await select.selectOption('lite'); await expect(select).toHaveValue('lite');
    await share.click(); await expect(page.getByRole('status')).toContainText(/Scenario link copied|Copy this scenario link/);
  }
  await page.setViewportSize({width:1440,height:900}); await page.goto('/');
  const landing = page.locator('.lw-header');
  const [learn, graphics, dropdown, open] = await Promise.all([
    landing.getByRole('link',{name:'Learn',exact:true}).boundingBox(),
    landing.locator('.graphics-control span').boundingBox(),
    landing.getByLabel('Graphics quality').boundingBox(),
    landing.getByRole('button',{name:'Open navigator'}).boundingBox(),
  ]);
  expect(graphics!.x - (learn!.x + learn!.width)).toBeGreaterThanOrEqual(28);
  expect(dropdown!.x - (graphics!.x + graphics!.width)).toBeGreaterThanOrEqual(10);
  expect(open!.x - (dropdown!.x + dropdown!.width)).toBeGreaterThanOrEqual(28);
  await landing.screenshot({path:test.info().outputPath('header-landing.png')});
});

test('the optional assistant stays absent when explicitly disabled', async ({ page }) => {
  test.skip(process.env.TEST_AI_DISABLED !== '1', 'Requires a build with VITE_AI_ENABLED=false.');
  await page.addInitScript(() => {
    localStorage.setItem('lunar-window-tour-globe-v3', 'done');
    localStorage.setItem('lunar-window-tour-layers-v3', 'done');
    localStorage.setItem('lunala-graphics', 'lite');
  });
  await page.goto('/app');
  await expect(page.locator('.mission')).toBeVisible();
  await page.getByRole('button', { name:'Continue to workspace' }).click({timeout:15000}).catch(()=>{});
  await expect(page.getByRole('button', { name:'Ask Solgaleo, the lunar copilot' })).toHaveCount(0);
  const shortcutUnclaimed = await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', {key:'k',metaKey:true,bubbles:true,cancelable:true})));
  expect(shortcutUnclaimed).toBe(true);
  await expect(page.getByRole('region', {name:'Solgaleo assistant'})).toHaveCount(0);
  await expect(page.getByRole('button', {name:'Replay mission briefing'})).toBeVisible();
});
