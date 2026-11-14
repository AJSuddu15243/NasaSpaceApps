import { useState } from 'react';
import { Button } from './components/button';
import { Alert, Badge, Card, Input, Label, Separator, Skeleton } from './components/primitives';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/tabs';
import { TokenGallery } from './preview/TokenGallery';
import { sample } from './preview/mock';
import './preview/gallery.css';
export function DesignPage() {
  const [notice, setNotice] = useState('Ready to preview a control.');
  const [name, setName] = useState('');
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="border-b border-border"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
      <a href="/design" className="text-sm font-medium tracking-wide">LUNAR LANDING SITE NAVIGATOR</a><Badge>Design reference · v0.1</Badge>
    </div></header>
    <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-12 grid gap-6 md:grid-cols-[2fr_1fr]">
        <div><p className="mb-3 font-mono text-xs text-muted-foreground">WEB-2 / INTERFACE FOUNDATIONS</p>
          <h1 className="text-[length:var(--type-display)] font-medium leading-tight">Clarity at the lunar horizon.</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">One shared language for terrain, sunlight and Earth contact. Quiet surfaces keep the mission data in focus.</p>
        </div>
        <aside className="self-end border-l border-border pl-6 text-sm"><p className="text-sun">Amber · Sun and power</p><p className="mt-2 text-earth">Blue · Earth and communications</p><p className="mt-2 text-muted-foreground">Status always includes a text label.</p></aside>
      </div>
      <Tabs defaultValue="components">
        <TabsList aria-label="Design reference"><TabsTrigger value="components">Components</TabsTrigger><TabsTrigger value="tokens">Tokens</TabsTrigger><TabsTrigger value="principles">Usage</TabsTrigger></TabsList>
        <TabsContent value="components" className="space-y-8">
          <section aria-labelledby="actions"><h2 id="actions" className="section-title">01 / Actions</h2><Card>
            <div className="flex flex-wrap gap-3">{(['default', 'secondary', 'outline', 'ghost', 'destructive'] as const).map(variant =>
              <Button key={variant} variant={variant} onClick={() => setNotice(`${variant} action previewed.`)}>{variant === 'default' ? 'Primary action' : variant[0].toUpperCase() + variant.slice(1)}</Button>)}
              <Button disabled>Unavailable</Button><Button size="sm" onClick={() => setNotice('Small action previewed.')}>Small</Button>
              <Button size="icon" variant="outline" aria-label="Add example" onClick={() => setNotice('Example added.')}>+</Button>
              <Button asChild variant="outline"><a href="#states">View states</a></Button>
            </div><p role="status" className="mt-4 min-h-6 text-sm text-muted-foreground">{notice}</p>
          </Card></section>
          <section aria-labelledby="fields"><h2 id="fields" className="section-title">02 / Fields & typography</h2><div className="grid gap-6 md:grid-cols-2"><Card>
            <Label htmlFor="site-name">Site label</Label><Input id="site-name" value={name} onChange={event => setName(event.target.value)} placeholder="Enter a site label" aria-describedby="site-help" /><p id="site-help" className="mt-2 text-xs text-muted-foreground">Preview only. No location is saved.</p>
            <Separator /><Label htmlFor="invalid-field">Latitude (°)</Label><Input id="invalid-field" defaultValue="-95" aria-invalid="true" aria-describedby="latitude-error" className="font-mono" /><p id="latitude-error" className="mt-2 text-sm text-danger">Example error: latitude must be between −90° and 90°.</p>
            <div className="mt-5"><Label htmlFor="disabled-field">Terrain source</Label><Input id="disabled-field" disabled value="Not connected" /></div>
          </Card><Card>
            <p className="text-sm text-muted-foreground">IBM Plex Sans / UI</p><h3 className="mt-3 text-2xl font-medium">Read the conditions.</h3><p className="mt-2">Use direct language. Put units beside values, and assumptions beside results.</p>
            <Separator /><p className="text-sm text-muted-foreground">IBM Plex Mono / tabular figures</p><p className="mt-3 font-mono text-2xl">−89.50° / 336 h</p><p className="mt-2 font-mono text-lg">120 K / 1361 W/m²</p><p className="mt-3 text-xs text-muted-foreground">Typography specimens; not computed mission results.</p>
          </Card></div></section>
          <section aria-labelledby="status"><h2 id="status" className="section-title">03 / Status & data</h2><Card>
            <div className="flex flex-wrap gap-3"><Badge>Neutral</Badge><Badge tone="sun">Sunlight</Badge><Badge tone="earth">Earth contact</Badge><Badge tone="success">Pass</Badge><Badge tone="warning">Review</Badge><Badge tone="danger">Fail</Badge></div>
            <Separator /><div className="flex flex-wrap items-end justify-between gap-6"><div><h3 className="text-lg font-medium">{sample.site}</h3><p className="mt-1 text-sm text-muted-foreground">Synthetic fixture · {sample.windowHours} h window</p></div><dl className="flex flex-wrap gap-8"><div><dt className="text-sm text-sun">Sunlit fraction</dt><dd className="mt-1 font-mono text-2xl">{sample.sunlight}%</dd></div><div><dt className="text-sm text-earth">Earth contact</dt><dd className="mt-1 font-mono text-2xl">{sample.contact}%</dd></div></dl></div>
          </Card></section>
          <section id="states" aria-labelledby="states-heading"><h2 id="states-heading" className="section-title">04 / Loading, empty, error & missing data</h2><div className="grid gap-4 md:grid-cols-2">
            <Card><h3 className="mb-3 font-medium">Loading terrain</h3><Skeleton label="Loading terrain preview" /></Card>
            <Card><h3 className="font-medium">No sites selected</h3><p className="mt-2 text-sm text-muted-foreground">Choose a site to begin a comparison.</p></Card>
            <Alert title="Terrain could not load" destructive><p>Check your connection and try again.</p><Button variant="outline" className="mt-3" onClick={() => setNotice('Retry previewed. No network request was made.')}>Preview retry</Button></Alert>
            <Alert title="No rock data for this layer"><p>Rock distribution is unavailable. Its weight remains zero until a source is confirmed.</p></Alert>
          </div></section>
        </TabsContent>
        <TabsContent value="tokens"><h2 className="section-title">Token catalogue</h2><TokenGallery /></TabsContent>
        <TabsContent value="principles"><Card><h2 className="text-xl font-medium">Built for focused comparison</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-muted-foreground"><li>Dark theme only. Use amber and blue for their named physical quantities.</li><li>Reserve red, yellow and green for status. Always pair colour with words.</li><li>Use tabular mono figures with units. Never imply mock values are calculated results.</li><li>Keyboard focus stays visible. Tabs support arrow keys, Home and End.</li><li>Motion describes state changes and respects reduced-motion settings.</li><li>Use shadcn-style primitives throughout the app. Kokonut pieces belong on the landing page only.</li></ul></Card></TabsContent>
      </Tabs>
      <footer className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">Development reference. Synthetic UI fixtures only; no NASA mission assessment.</footer>
    </main>
  </>;
}
