import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

type RGB = [number, number, number];
// Test-only WCAG relative luminance reference. Production UI performs no colour math.
function luminance(rgb: RGB): number {
  const linear = rgb.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
function contrast(a: RGB, b: RGB): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}
function fromHsl(hue: number, saturation: number, lightness: number): RGB {
  const s = saturation / 100;
  const l = lightness / 100;
  const a = s * Math.min(l, 1 - l);
  const channel = (offset: number) => {
    const k = (offset + hue / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [channel(0), channel(8), channel(4)];
}
it('checks the reference calculation against known colours', () => {
  expect(fromHsl(0, 100, 50)).toEqual([1, 0, 0]);
  expect(fromHsl(120, 100, 50)).toEqual([0, 1, 0]);
  expect(fromHsl(240, 100, 50)).toEqual([0, 0, 1]);
  expect(contrast([0, 0, 0], [1, 1, 1])).toBe(21);
  expect(contrast([1, 1, 1], [1, 1, 1])).toBe(1);
  expect(contrast([119 / 255, 119 / 255, 119 / 255], [1, 1, 1])).toBeCloseTo(4.478, 3);
});
it('keeps designed text pairs at AA and input boundaries at 3:1', () => {
  const css = readFileSync(new URL('../tokens.css', import.meta.url), 'utf8');
  const tokens = Object.fromEntries([...css.matchAll(/--([a-z-]+): ([\d.]+) ([\d.]+)% ([\d.]+)%;/g)]
    .map(([, name, h, s, l]) => [name, fromHsl(Number(h), Number(s), Number(l))]));
  const pairs = [
    ['foreground', 'background'], ['card-foreground', 'card'], ['popover-foreground', 'popover'],
    ['muted-foreground', 'background'], ['muted-foreground', 'card'], ['muted-foreground', 'muted'],
    ['primary-foreground', 'primary'], ['secondary-foreground', 'secondary'],
    ['accent-foreground', 'accent'], ['destructive-foreground', 'destructive'],
  ];
  for (const tone of ['sun', 'earth', 'success', 'warning', 'danger']) {
    for (const surface of ['background', 'card']) pairs.push([tone, surface]);
  }
  for (const [text, background] of pairs) {
    expect(contrast(tokens[text], tokens[background]), `${text} on ${background}`).toBeGreaterThanOrEqual(4.5);
  }
  for (const surface of ['background', 'card']) {
    expect(contrast(tokens.input, tokens[surface]), `input on ${surface}`).toBeGreaterThanOrEqual(3);
    expect(contrast(tokens.ring, tokens[surface]), `focus ring on ${surface}`).toBeGreaterThanOrEqual(3);
  }
});
