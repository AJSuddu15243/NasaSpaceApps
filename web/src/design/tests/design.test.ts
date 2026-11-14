import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { cn } from '../utils';
import { buttonVariants } from '../components/button';
import { tokenGroups } from '../token-catalog';
describe('class composition', () => {
  it('lets callers override conflicting utilities while preserving unrelated styles', () => {
    expect(cn('px-4 py-2', false && 'hidden', ['px-6'], { 'font-mono': true })).toBe('py-2 px-6 font-mono');
  });
  it('handles empty and conditional values', () => { expect(cn(null, undefined, false, '', { hidden: false })).toBe(''); });
});
describe('design contract', () => {
  it('catalogues every CSS token exactly once', () => {
    const css = readFileSync(new URL('../tokens.css', import.meta.url), 'utf8');
    const declared = [...new Set([...css.matchAll(/--([a-z0-9-]+)\s*:/g)].map(match => match[1]))].sort();
    const shown = Object.values(tokenGroups).flat();
    expect([...shown].sort()).toEqual(declared);
    expect(new Set(shown).size).toBe(shown.length);
  });
  it('keeps every button variant legible and all controls at least 44px tall', () => {
    for (const variant of ['default', 'secondary', 'outline', 'ghost', 'destructive'] as const) {
      expect(buttonVariants({ variant })).toContain('min-h-11');
    }
    expect(buttonVariants({ variant: 'destructive' })).toContain('text-destructive-foreground');
    expect(buttonVariants()).toContain('disabled:pointer-events-none');
  });
});
