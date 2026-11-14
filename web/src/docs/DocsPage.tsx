import { useMemo, useState } from 'react';
import { Badge } from '../design/components/primitives';
import { Input } from '../design/components/primitives';
import glossary from '../content/glossary.json';
import { earthMoonComparison, explainers } from '../content/explainers';
import './docs.css';

const nav = [
  { id: 'start', label: 'Getting started' },
  { id: 'concepts', label: 'Core concepts' },
  { id: 'workflow', label: 'Mission workflow' },
  { id: 'views', label: 'Views & sharing' },
  { id: 'data', label: 'Data & sources' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'architecture', label: 'Architecture' },
] as const;

const commands = [
  { area: 'Web app', cmd: 'cd web && pnpm install && pnpm dev', note: 'Landing at /, workspace at /app' },
  { area: 'Checks', cmd: 'pnpm typecheck && pnpm lint && pnpm test && pnpm build', note: 'Run inside web/' },
  { area: 'Engine', cmd: 'cd engine && cargo test && ./build.sh', note: 'Rust → WASM into web/src/engine/pkg' },
  { area: 'Pipeline', cmd: 'cd pipeline && make setup && make all', note: 'NASA sources → web/public/data' },
];

const views = [
  ['3d', 'Interactive terrain scene — orbit, fly to the south pole, shading controls.'],
  ['panorama', 'Horizon panorama from the selected site.'],
  ['map', '2D polar map of the south-polar region.'],
  ['globe', 'Live Moon globe with LROC imagery, LOLA elevation, site pins and Sun/Earth markers.'],
] as const;

const urlParams = [
  ['sites', 'Comma-separated site ids (max 4, deduplicated)'],
  ['date', 'UTC ISO 8601 start of the window'],
  ['hours', 'Mission length, 1–8760 whole hours'],
  ['weights', 'Four decimal weights for the scoring mix'],
  ['mode', 'planner | explorer'],
  ['view', '3d | panorama | map | globe'],
] as const;

const sources = [
  ['NASA Moon Trek / LROC QuickMap', 'Terrain imagery and elevation services'],
  ['PGDA LOLA GeoTIFF', 'LOLA elevation fallback'],
  ['JPL Horizons', 'Sun/Earth ephemerides and validation samples'],
  ['NASA SVS / LROC WAC', 'Global imagery mosaic (landing page)'],
];

const architecture = [
  ['pipeline/', 'Python 3.12 (uv). Turns NASA sources into versioned binary + JSON contracts under web/public/data/. Stages: ephem → terrain → layers → masks → validate → imagery → package.'],
  ['engine/', 'One Rust crate, two outputs: a WASM library for the app and a native masks binary for the pipeline. Deterministic: fixed loop order, f64, no fast-math.'],
  ['contracts/', 'JSON schemas every data file is validated against; the engine boundary rejects unknown or missing fields.'],
  ['web/', 'React 19 + TypeScript + Vite. Landing page, mission workspace, design system, and the lazy-loaded WASM/3D chunks.'],
];

export function DocsPage() {
  const [query, setQuery] = useState('');
  const filteredTerms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return glossary.terms;
    return glossary.terms.filter(term =>
      term.term.toLowerCase().includes(q) || term.short.toLowerCase().includes(q) || term.long.toLowerCase().includes(q));
  }, [query]);

  return <div className="docs-page">
    <div className="docs-layout">
      <aside className="docs-sidebar" aria-label="Documentation sections">
        <nav className="docs-nav">
          {nav.map(item => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
        </nav>
        <details className="docs-mobile-nav">
          <summary>On this page</summary>
          <nav>{nav.map(item => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}</nav>
        </details>
      </aside>
      <main id="main" className="docs-main">
        <div className="docs-hero">
          <h1>How the navigator works.</h1>
          <p>Concepts, mission workflow, data sources and the glossary — written for teammates, judges and students. Everything here describes the real system; synthetic demo data is labelled wherever it appears.</p>
        </div>

        <section id="start" className="docs-section">
          <h2>Getting started</h2>
          <p>Three workstreams, three toolchains. The web app consumes the data contracts the pipeline writes and the engine scores.</p>
          <div className="docs-cmd-list">
            {commands.map(item => <div key={item.area} className="docs-cmd">
              <span className="docs-cmd-area">{item.area}</span>
              <code>{item.cmd}</code>
              <span className="docs-cmd-note">{item.note}</span>
            </div>)}
          </div>
        </section>

        <section id="concepts" className="docs-section">
          <h2>Core concepts</h2>
          <p>Short explainers written for a grade-8 reading level. Each one connects an Earth intuition to the lunar consequence.</p>
          <div className="docs-cards">
            {explainers.map(item => <article key={item.id} className="docs-card">
              <h3>{item.title}</h3>
              <p className="docs-deck">{item.deck}</p>
              {item.body.map(paragraph => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
            </article>)}
          </div>
          <article className="docs-card docs-compare">
            <h3>{earthMoonComparison.title}</h3>
            <table>
              <thead><tr><th scope="col">Aspect</th><th scope="col">Earth</th><th scope="col">Moon (south pole)</th></tr></thead>
              <tbody>
                {earthMoonComparison.rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.earth}</td><td>{row.moon}</td></tr>)}
              </tbody>
            </table>
          </article>
        </section>

        <section id="workflow" className="docs-section">
          <h2>Mission workflow</h2>
          <p>The workspace compares candidate sites over a shared time window. Every scenario — sites, date, window length, weights and view — is encoded in the URL, so a link reproduces the exact state.</p>
          <ol className="docs-steps">
            <li><strong>Pick sites.</strong> Curated south-pole candidates or custom coordinates down to 80°S, up to four at a time.</li>
            <li><strong>Set the window.</strong> A UTC start time and mission length from 1 to 8,760 hours.</li>
            <li><strong>Read the horizon.</strong> Terrain decides sunlight and Earth contact; nothing is averaged away.</li>
            <li><strong>Compare and share.</strong> Metrics, statuses and countdowns side by side — the whole scenario lives in the link.</li>
          </ol>
        </section>

        <section id="views" className="docs-section">
          <h2>Views &amp; sharing</h2>
          <div className="docs-table-wrap"><table>
            <thead><tr><th scope="col">View</th><th scope="col">What it shows</th></tr></thead>
            <tbody>{views.map(([name, desc]) => <tr key={name}><th scope="row"><code>{name}</code></th><td>{desc}</td></tr>)}</tbody>
          </table></div>
          <h3>Scenario URL parameters</h3>
          <div className="docs-table-wrap"><table>
            <thead><tr><th scope="col">Param</th><th scope="col">Meaning</th></tr></thead>
            <tbody>{urlParams.map(([param, desc]) => <tr key={param}><th scope="row"><code>{param}</code></th><td>{desc}</td></tr>)}</tbody>
          </table></div>
          <p className="docs-note">Malformed links never throw: invalid values fall back to defaults and the UI surfaces a warning.</p>
        </section>

        <section id="data" className="docs-section">
          <h2>Data &amp; sources</h2>
          <p>The pipeline turns NASA sources into versioned, schema-checked files under <code>web/public/data/</code>. Every file carries a JSON header with units, shape, generation time and source URLs; <code>manifest.json</code> aggregates SHA-256 hashes and citations.</p>
          <div className="docs-table-wrap"><table>
            <thead><tr><th scope="col">Source</th><th scope="col">Used for</th></tr></thead>
            <tbody>{sources.map(([name, use]) => <tr key={name}><th scope="row">{name}</th><td>{use}</td></tr>)}</tbody>
          </table></div>
          <div className="docs-callout">
            <strong>Synthetic demonstration data.</strong> Until the pipeline's real outputs are packaged, the app runs on labelled stand-ins under <code>web/public/data/mock/</code>. Synthetic values are never presented as measurements — see the badge in the workspace header.
          </div>
          <p>Full methods, assumptions and validation status: <a href="https://github.com/AJSuddu15243/NasaSpaceApps/blob/main/docs/METHODS.md" target="_blank" rel="noreferrer">docs/METHODS.md</a>.</p>
        </section>

        <section id="glossary" className="docs-section">
          <h2>Glossary</h2>
          <p>Every term the tooltips and panels use, in plain language.</p>
          <Input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Filter terms — try “horizon” or “blackout”"
            aria-label="Filter glossary terms"
            className="docs-search"
          />
          {filteredTerms.length === 0
            ? <p className="docs-note">No terms match “{query}”.</p>
            : <dl className="docs-glossary">
              {filteredTerms.map(term => <div key={term.id} className="docs-term">
                <dt>{term.term} <Badge>{term.category}</Badge></dt>
                <dd>{term.long}</dd>
              </div>)}
            </dl>}
        </section>

        <section id="architecture" className="docs-section">
          <h2>Architecture</h2>
          <div className="docs-arch">
            {architecture.map(([name, desc]) => <div key={name} className="docs-arch-item">
              <code>{name}</code>
              <p>{desc}</p>
            </div>)}
          </div>
          <p className="docs-note">The same Rust crate produces the offline horizon masks (native bin, run by the pipeline) and the in-browser scoring WASM — the numbers in the UI come from the same deterministic code that built the masks.</p>
        </section>
      </main>
    </div>
  </div>;
}
