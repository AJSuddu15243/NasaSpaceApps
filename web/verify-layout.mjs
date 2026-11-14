import { chromium } from '@playwright/test';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 950 } });
page.on('pageerror', e => console.log('[pageerror]', e.message));
page.on('console', m => { if (m.type() === 'error') console.log('[console.error]', m.text().slice(0, 200)); });
await page.goto('http://127.0.0.1:4173/app?view=globe', { waitUntil: 'networkidle' });
await page.waitForTimeout(7000);
const info = await page.evaluate(() => ({
  panels: document.querySelectorAll('.workspace-panel').length,
  handles: document.querySelectorAll('[data-panel-resize-handle-id], .group').length,
  collapseBtns: document.querySelectorAll('.panel-collapse-btn').length,
  compareTable: !!document.querySelector('.compare-table'),
  globeCanvas: document.querySelectorAll('.moon-globe canvas').length,
  globeMarkers: document.querySelectorAll('.globe-marker').length,
  viewTabs: [...document.querySelectorAll('.view-tab')].map(b => b.textContent),
  globeH: document.querySelector('.moon-globe')?.getBoundingClientRect().height,
}));
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: '/tmp/redesign-desktop.png' });
// collapse left panel
await page.getByLabel('Collapse sites panel').click();
await page.waitForTimeout(600);
console.log('after collapse, expand btn:', await page.locator('.panel-expand-left').count());
await page.screenshot({ path: '/tmp/redesign-collapsed.png' });
await page.getByLabel('Show sites panel').click();
await page.waitForTimeout(600);
// mobile viewport
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(800);
console.log('mobile panels:', await page.evaluate(() => ({ stack: !!document.querySelector('.workspace-stack'), panels: document.querySelectorAll('.workspace-panel').length })));
await page.screenshot({ path: '/tmp/redesign-mobile.png' });
await browser.close();
