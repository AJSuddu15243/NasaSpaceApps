import { expect, test, type Page } from '@playwright/test';

async function openAssistant(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    localStorage.setItem('lunar-window-tour-globe-v3', 'done');
    localStorage.setItem('lunar-window-tour-layers-v3', 'done');
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      return String(args[0]).includes('webgl') ? null : original.apply(this, args);
    } as typeof original;
  });
  await page.goto('/app');
  await page.getByRole('button', { name: 'Continue to workspace' }).click({ timeout: 15000 }).catch(() => {});
  await page.getByRole('button', { name: 'Ask Solgaleo, the lunar copilot' }).click();
  await expect(page.getByRole('button', { name: 'Move Solgaleo assistant' })).toBeVisible();
}

test('leaving the title handle cannot drop an active drag or keep dragging after release', async ({ page }) => {
  await openAssistant(page);
  const panel = page.getByRole('region', { name: 'Solgaleo assistant' });
  const before = (await panel.boundingBox())!;
  const handle = (await page.getByRole('button', { name: 'Move Solgaleo assistant' }).boundingBox())!;
  await page.mouse.move(handle.x + 20, handle.y + 10);
  await page.mouse.down();
  await page.mouse.move(handle.x + 140, handle.y + 50, { steps: 8 });
  await page.mouse.up();
  const moved = (await panel.boundingBox())!;
  expect(moved.x).toBeCloseTo(before.x + 120, 0);
  expect(moved.y).toBeCloseTo(before.y + 40, 0);
  await page.mouse.move(900, 500);
  expect((await panel.boundingBox())!.x).toBeCloseTo(moved.x, 0);
});

test('edge dragging and a smaller viewport cannot strand the assistant off screen', async ({ page }) => {
  await openAssistant(page);
  const handle = page.getByRole('button', { name: 'Move Solgaleo assistant' });
  await handle.focus();
  for (let i = 0; i < 35; i++) await page.keyboard.press('Shift+ArrowRight');
  for (let i = 0; i < 35; i++) await page.keyboard.press('Shift+ArrowDown');
  await page.setViewportSize({ width: 390, height: 844 });
  const panel = page.getByRole('region', { name: 'Solgaleo assistant' });
  await expect.poll(async () => {
    const r = (await panel.boundingBox())!;
    return r.x >= 0 && r.y >= 0 && r.x + r.width <= 391 && r.y + r.height <= 845;
  }).toBe(true);
  await expect(page.getByRole('button', { name: 'Close assistant' })).toBeVisible();
});

test('typing and closing cannot act as drag handles', async ({ page }) => {
  await openAssistant(page);
  const panel = page.getByRole('region', { name: 'Solgaleo assistant' });
  const before = (await panel.boundingBox())!;
  await panel.getByRole('combobox').fill('Why is the Moon dark?');
  expect((await panel.boundingBox())!.x).toBeCloseTo(before.x, 0);
  await page.getByRole('button', { name: 'Close assistant' }).click();
  await expect(panel).toHaveCount(0);
});

// Gap: mouse tests do not prove that touch capture or growing answers remain usable.
test('touch capture and a growing answer cannot lose the handle or change the scenario', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/api/ask', route => route.fulfill({ json: { answer: 'Terrain can block sunlight. '.repeat(100) } }));
  await openAssistant(page);
  const scenario = page.url();
  const handle = page.getByRole('button', { name: 'Move Solgaleo assistant' });
  const before = (await page.getByRole('region', { name: 'Solgaleo assistant' }).boundingBox())!;
  const rect = (await handle.boundingBox())!;
  const touch = await page.context().newCDPSession(page);
  const x = rect.x + 30, y = rect.y + 15;
  await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - 60 }] });
  await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await touch.detach();
  expect((await page.getByRole('region', { name: 'Solgaleo assistant' }).boundingBox())!.y).toBeLessThan(before.y);
  await page.getByRole('region', { name: 'Solgaleo assistant' }).getByRole('combobox').fill('Explain lunar sunlight');
  await page.keyboard.press('Enter');
  await expect(page.locator('.ask-text')).toContainText('Terrain can block sunlight.');
  await expect.poll(async () => {
    const r = (await page.getByRole('region', { name: 'Solgaleo assistant' }).boundingBox())!;
    return r.x >= 0 && r.y >= 0 && r.x + r.width <= 391 && r.y + r.height <= 845;
  }).toBe(true);
  expect(page.url()).toBe(scenario);
});

test('keyboard reset cannot leave a previously moved panel outside the workspace', async ({ page }) => {
  await openAssistant(page);
  const panel = page.getByRole('region', { name: 'Solgaleo assistant' });
  const before = (await panel.boundingBox())!;
  await page.getByRole('button', { name: 'Move Solgaleo assistant' }).focus();
  await page.keyboard.press('ArrowRight');
  expect((await panel.boundingBox())!.x).toBeGreaterThan(before.x);
  await page.keyboard.press('Home');
  expect((await panel.boundingBox())!.x).toBeCloseTo(before.x, 0);
});

// Gap: release tests alone can miss a drag that remains active when the browser cancels a gesture.
test('a cancelled pointer cannot keep moving the assistant', async ({ page }) => {
  await openAssistant(page);
  const handle = page.getByRole('button', { name: 'Move Solgaleo assistant' });
  await handle.evaluate(node => node.addEventListener('pointerdown', event => node.setAttribute('data-pointer', String((event as PointerEvent).pointerId)), { once: true }));
  const rect = (await handle.boundingBox())!;
  await page.mouse.move(rect.x + 30, rect.y + 15);
  await page.mouse.down();
  await page.mouse.move(rect.x, rect.y - 15);
  await handle.dispatchEvent('pointercancel', { pointerId: Number(await handle.getAttribute('data-pointer')) });
  const panel = page.getByRole('region', { name: 'Solgaleo assistant' });
  const cancelled = (await panel.boundingBox())!;
  await page.mouse.move(rect.x + 100, rect.y + 100);
  await page.mouse.up();
  expect((await panel.boundingBox())!.x).toBeCloseTo(cancelled.x, 0);
  expect((await panel.boundingBox())!.y).toBeCloseTo(cancelled.y, 0);
});

// Gap: handler unit tests cannot prove that mounted UI cancels older requests or renders safely.
test('an older reply cannot overwrite the newest question', async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  let count = 0;
  await page.route('**/api/ask', async route => {
    const current = ++count;
    if (current === 1) await held;
    await route.fulfill({ json: { answer: current === 1 ? 'STALE ANSWER' : 'CURRENT ANSWER' } }).catch(() => {});
  });
  await openAssistant(page);
  const input = page.getByRole('region', { name: 'Solgaleo assistant' }).getByRole('combobox');
  await input.fill('First question'); await input.press('Enter');
  await expect.poll(() => count).toBe(1);
  await input.fill('Second question'); await input.press('Enter');
  await expect(page.locator('.ask-text')).toHaveText('CURRENT ANSWER');
  release();
  await expect(page.locator('.ask-text')).not.toContainText('STALE ANSWER');
});

test('closing the panel aborts its request and reopening cannot restore its reply', async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/api/ask', async route => {
    await held;
    await route.fulfill({ json: { answer: 'CLOSED PANEL ANSWER' } }).catch(() => {});
  });
  await openAssistant(page);
  const aborted = page.waitForEvent('requestfailed', { predicate: request => request.url().endsWith('/api/ask') });
  const sent = page.waitForRequest('**/api/ask');
  const input = page.getByRole('region', { name: 'Solgaleo assistant' }).getByRole('combobox');
  await input.fill('Explain sunlight'); await input.press('Enter'); await sent;
  await page.getByRole('button', { name: 'Close assistant' }).click();
  await aborted;
  release();
  await page.getByRole('button', { name: 'Ask Solgaleo, the lunar copilot' }).click();
  await expect(page.locator('.ask-answer')).toHaveCount(0);
});

test('model Markdown cannot inject HTML, images or external links', async ({ page }) => {
  let externalRequests = 0;
  await page.route('https://attacker.invalid/**', route => { externalRequests++; return route.abort(); });
  await page.route('**/api/ask', route => route.fulfill({ json: { answer: '**Terrain**\n\n<script>window.injected=true</script>\n\n<img src="https://attacker.invalid/html">\n\n![image](https://attacker.invalid/image) [link](https://attacker.invalid/link)' } }));
  await openAssistant(page);
  const input = page.getByRole('region', { name: 'Solgaleo assistant' }).getByRole('combobox');
  await input.fill('Explain terrain'); await input.press('Enter');
  await expect(page.locator('.ask-text strong')).toHaveText('Terrain');
  await expect(page.locator('.ask-text img, .ask-text a, .ask-text script')).toHaveCount(0);
  expect(externalRequests).toBe(0);
});
