const color = (name) => `hsl(var(--${name}) / <alpha-value>)`;
module.exports = {
  darkMode: ['class'],
  theme: { extend: {
    colors: Object.fromEntries([
      'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
      'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
      'accent', 'accent-foreground', 'destructive', 'destructive-foreground', 'border', 'input', 'ring',
      'sun', 'earth', 'success', 'warning', 'danger',
    ].map(name => [name, color(name)])),
    fontFamily: { sans: ['IBM Plex Sans', 'sans-serif'], mono: ['IBM Plex Mono', 'monospace'] },
    fontSize: { xs: 'var(--type-xs)', sm: 'var(--type-sm)', base: 'var(--type-base)', lg: 'var(--type-lg)', xl: 'var(--type-xl)', '2xl': 'var(--type-2xl)', display: 'var(--type-display)' },
    spacing: Object.fromEntries([1, 2, 3, 4, 6, 8, 12].map(n => [n, `var(--space-${n})`])),
    transitionDuration: { fast: 'var(--motion-fast)', base: 'var(--motion-base)', slow: 'var(--motion-slow)' },
    transitionTimingFunction: { standard: 'var(--ease-standard)' },
    borderRadius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)' },
    boxShadow: { panel: 'var(--shadow-panel)', raised: 'var(--shadow-raised)' },
  } },
};
