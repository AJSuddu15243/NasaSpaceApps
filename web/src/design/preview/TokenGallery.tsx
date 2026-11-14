import { useEffect, useState, type CSSProperties } from 'react';
import { tokenGroups } from '../token-catalog';
export function TokenGallery() {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const update = () => {
      const style = getComputedStyle(document.documentElement);
      setValues(Object.fromEntries(Object.values(tokenGroups).flat().map(name => [name, style.getPropertyValue(`--${name}`).trim()])));
    };
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    update(); preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  return <div className="space-y-8">{Object.entries(tokenGroups).map(([group, names]) => <section key={group} aria-label={`${group} tokens`}>
    <h3 className="mb-4 text-lg font-medium">{group}</h3>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{names.map(name => {
      const variable = `var(--${name})`;
      const style: CSSProperties = group === 'Colour' ? { background: `hsl(${variable})` }
        : name.startsWith('space') ? { width: variable, background: 'hsl(var(--muted-foreground))' }
        : name.startsWith('radius') ? { borderRadius: variable, border: '1px solid hsl(var(--input))' }
        : name.startsWith('shadow') ? { boxShadow: variable, background: 'hsl(var(--muted))' } : {};
      return <div key={name} className="min-w-0 rounded-md border border-border bg-card p-4">
        {['Colour', 'Spacing', 'Shape'].includes(group) && <div aria-hidden="true" className="mb-3 h-8" style={style} />}
        {group === 'Typography' && <p className="mb-3 break-words" style={name.startsWith('font') ? { fontFamily: variable } : { fontSize: variable }}>Aa 012</p>}
        {group === 'Motion' && <div className="motion-sample" style={name.startsWith('motion') ? { transitionDuration: variable } : { transitionTimingFunction: variable }}>Hover to inspect</div>}
        <p className="font-mono text-xs">--{name}</p><p className="mt-1 break-words text-xs text-muted-foreground">{values[name] || 'Reading token…'}</p>
      </div>;
    })}</div>
  </section>)}</div>;
}
