import { IconArrowWaveRightUp, IconLink, IconMountain, IconShieldCheck, IconSun, IconTable, IconWorld } from '@tabler/icons-react';
import { Timeline } from './Timeline';
import { BentoGrid, BentoGridItem } from './BentoGrid';
import './sections.css';

const team = [
  ['DA', 'Data and ephemeris', 'Source, normalize and validate lunar terrain and sky positions.'],
  ['EN', 'Simulation engineering', 'Keep horizon, illumination and contact calculations deterministic.'],
  ['3D', 'Scene and interaction', 'Turn the same inputs into legible spatial context.'],
  ['UX', 'Product and story', 'Make assumptions, trade-offs and missing data visible.'],
] as const;

const pipeline = [
  {
    title: 'Acquire',
    content: (
      <div>
        <p className="mb-6 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Terrain and sky geometry enter the app as validated contracts, not loose files.
        </p>
        <dl className="space-y-3 text-xs md:text-sm">
          <div className="flex justify-between gap-6 border-b border-neutral-200 pb-2 dark:border-neutral-800"><dt className="text-neutral-500 dark:text-neutral-400">Terrain</dt><dd className="font-mono text-neutral-700 dark:text-neutral-300">LOLA · Moon Trek polar grids</dd></div>
          <div className="flex justify-between gap-6 border-b border-neutral-200 pb-2 dark:border-neutral-800"><dt className="text-neutral-500 dark:text-neutral-400">Sky geometry</dt><dd className="font-mono text-neutral-700 dark:text-neutral-300">JPL Horizons · hourly states</dd></div>
          <div className="flex justify-between gap-6"><dt className="text-neutral-500 dark:text-neutral-400">Boundary check</dt><dd className="font-mono text-neutral-700 dark:text-neutral-300">units · lengths · finite values</dd></div>
        </dl>
      </div>
    ),
  },
  {
    title: 'Compute',
    content: (
      <div>
        <p className="mb-6 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          A deterministic Rust/WASM engine integrates terrain horizon masks against the ephemeris table.
        </p>
        <dl className="space-y-3 text-xs md:text-sm">
          <div className="flex justify-between gap-6 border-b border-neutral-200 pb-2 dark:border-neutral-800"><dt className="text-neutral-500 dark:text-neutral-400">Outputs</dt><dd className="font-mono text-neutral-700 dark:text-neutral-300">sunlit % · darkness · Earth contact</dd></div>
          <div className="flex justify-between gap-6 border-b border-neutral-200 pb-2 dark:border-neutral-800"><dt className="text-neutral-500 dark:text-neutral-400">Window</dt><dd className="font-mono text-neutral-700 dark:text-neutral-300">336 h default · 1 h step</dd></div>
          <div className="flex justify-between gap-6"><dt className="text-neutral-500 dark:text-neutral-400">Boundary</dt><dd className="font-mono text-neutral-700 dark:text-neutral-300">no physics in React or GLSL</dd></div>
        </dl>
      </div>
    ),
  },
  {
    title: 'Compare',
    content: (
      <div>
        <p className="mb-6 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Every site is scored on the same window so trade-offs stay visible instead of collapsing into one score.
        </p>
        <dl className="space-y-3 text-xs md:text-sm">
          <div className="flex justify-between gap-6 border-b border-neutral-200 pb-2 dark:border-neutral-800"><dt className="text-neutral-500 dark:text-neutral-400">Ranking</dt><dd className="font-mono text-neutral-700 dark:text-neutral-300">best value per metric</dd></div>
          <div className="flex justify-between gap-6 border-b border-neutral-200 pb-2 dark:border-neutral-800"><dt className="text-neutral-500 dark:text-neutral-400">Thresholds</dt><dd className="font-mono text-neutral-700 dark:text-neutral-300">labelled demo constants</dd></div>
          <div className="flex justify-between gap-6"><dt className="text-neutral-500 dark:text-neutral-400">Missing data</dt><dd className="font-mono text-neutral-700 dark:text-neutral-300">shown unavailable, never estimated</dd></div>
        </dl>
      </div>
    ),
  },
  {
    title: 'Share',
    content: (
      <div>
        <p className="mb-6 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          The scenario is the URL. Sites, date, window and weights reproduce exactly on reload.
        </p>
        <dl className="space-y-3 text-xs md:text-sm">
          <div className="flex justify-between gap-6 border-b border-neutral-200 pb-2 dark:border-neutral-800"><dt className="text-neutral-500 dark:text-neutral-400">State</dt><dd className="font-mono text-neutral-700 dark:text-neutral-300">?sites · date · hours · view</dd></div>
          <div className="flex justify-between gap-6 border-b border-neutral-200 pb-2 dark:border-neutral-800"><dt className="text-neutral-500 dark:text-neutral-400">History</dt><dd className="font-mono text-neutral-700 dark:text-neutral-300">browser back/forward aware</dd></div>
          <div className="flex justify-between gap-6"><dt className="text-neutral-500 dark:text-neutral-400">Deep links</dt><dd className="font-mono text-neutral-700 dark:text-neutral-300">survive refresh and share</dd></div>
        </dl>
      </div>
    ),
  },
];

/* Compact SVG vignettes for the bento headers — schematic, not decorative stock. */
const Vignette = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className="bv" role="img" aria-label={label}>{children}</div>
);

const features = [
  {
    title: 'Solar illumination window',
    description: 'Sunlit percentage, longest continuous darkness and mean solar elevation — computed against the real horizon, not a flat map.',
    icon: <IconSun className="h-4 w-4 text-neutral-500" />,
    header: <Vignette label="Schematic solar elevation arc over a horizon"><svg viewBox="0 0 200 90" className="bv-svg"><line x1="10" y1="70" x2="190" y2="70" className="bv-horizon"/><path d="M30 70 Q100 -10 170 70" className="bv-arc"/><circle cx="62" cy="46" r="4" className="bv-sun"/><circle cx="100" cy="30" r="4" className="bv-sun"/><circle cx="138" cy="46" r="4" className="bv-sun dim"/><text x="150" y="20" className="bv-label">72% sunlit</text></svg></Vignette>,
    span: '',
  },
  {
    title: 'Direct-to-Earth contact',
    description: 'Earth visibility percentage and longest blackout, so a site is never praised for sunlight it cannot phone home from.',
    icon: <IconWorld className="h-4 w-4 text-neutral-500" />,
    header: <Vignette label="Schematic Earth above the lunar horizon"><svg viewBox="0 0 200 90" className="bv-svg"><line x1="10" y1="70" x2="190" y2="70" className="bv-horizon"/><circle cx="120" cy="34" r="14" className="bv-earth"/><circle cx="116" cy="30" r="3" className="bv-earth-core"/><text x="60" y="30" className="bv-label earth">61% Earth</text></svg></Vignette>,
    span: '',
  },
  {
    title: 'Terrain horizon masking',
    description: 'LOLA-derived ridge lines block Sun and Earth rays locally. The horizon decides what the sky can reach.',
    icon: <IconMountain className="h-4 w-4 text-neutral-500" />,
    header: <Vignette label="Schematic ridge blocking sunlight"><svg viewBox="0 0 200 90" className="bv-svg"><polygon points="0,70 50,40 90,62 140,30 200,58 200,90 0,90" className="bv-ridge"/><line x1="30" y1="8" x2="80" y2="62" className="bv-ray blocked"/><line x1="150" y1="8" x2="170" y2="40" className="bv-ray"/></svg></Vignette>,
    span: 'md:col-span-2',
  },
  {
    title: 'Side-by-side comparison',
    description: 'Best value per metric is highlighted; status badges explain whether each site sits within demo thresholds.',
    icon: <IconTable className="h-4 w-4 text-neutral-500" />,
    header: <Vignette label="Schematic comparison metric rows"><svg viewBox="0 0 200 90" className="bv-svg"><g className="bv-row"><rect x="10" y="12" width="120" height="8" rx="2" className="bv-bar"/><rect x="140" y="12" width="50" height="8" rx="2" className="bv-bar best"/></g><g className="bv-row"><rect x="10" y="32" width="90" height="8" rx="2" className="bv-bar earth"/><rect x="140" y="32" width="50" height="8" rx="2" className="bv-bar"/></g><g className="bv-row"><rect x="10" y="52" width="60" height="8" rx="2" className="bv-bar"/><rect x="140" y="52" width="50" height="8" rx="2" className="bv-bar"/></g><g className="bv-row"><rect x="10" y="72" width="105" height="8" rx="2" className="bv-bar earth"/><rect x="140" y="72" width="50" height="8" rx="2" className="bv-bar best"/></g></svg></Vignette>,
    span: '',
  },
  {
    title: 'Shareable scenario',
    description: 'Date, window, weights and site selection live in the URL — deep links reproduce the exact analysis.',
    icon: <IconLink className="h-4 w-4 text-neutral-500" />,
    header: <Vignette label="Schematic shareable scenario URL"><svg viewBox="0 0 200 90" className="bv-svg"><rect x="10" y="24" width="180" height="42" rx="8" className="bv-panel"/><circle cx="24" cy="45" r="3" className="bv-dot ok"/><circle cx="36" cy="45" r="3" className="bv-dot warn"/><circle cx="48" cy="45" r="3" className="bv-dot muted"/><text x="62" y="42" className="bv-url">lunarwindow.app/app</text><text x="62" y="57" className="bv-url dim">?sites=…&amp;date=…&amp;view=globe</text></svg></Vignette>,
    span: '',
  },
  {
    title: 'Honest data states',
    description: 'Synthetic fixtures are labelled, missing masks show unavailable, and engine outputs carry their assumptions.',
    icon: <IconShieldCheck className="h-4 w-4 text-neutral-500" />,
    header: <Vignette label="Schematic data state labels"><svg viewBox="0 0 200 90" className="bv-svg"><g className="bv-row"><rect x="10" y="14" width="86" height="20" rx="5" className="bv-pill ok"/><text x="18" y="28" className="bv-pilltext">CURRENT</text></g><g className="bv-row"><rect x="10" y="42" width="86" height="20" rx="5" className="bv-pill warn"/><text x="18" y="56" className="bv-pilltext">SYNTHETIC</text></g><g className="bv-row"><rect x="10" y="70" width="86" height="20" rx="5" className="bv-pill muted"/><text x="18" y="84" className="bv-pilltext">UNAVAILABLE</text></g></svg></Vignette>,
    span: 'md:col-span-2',
  },
];

const resources = [
  ['LROC QuickMap', 'Lunar imagery and topography', 'https://quickmap.lroc.asu.edu/'],
  ['NASA Moon Trek', 'Interactive lunar exploration', 'https://trek.nasa.gov/moon/'],
  ['JPL Horizons', 'Sun and Earth ephemerides', 'https://ssd.jpl.nasa.gov/horizons/'],
] as const;

export function LandingSections({ onOpen }: { onOpen: () => void }) {
  return <>
    <section className="landing-section landing-method" aria-labelledby="method-title">
      <div className="landing-section-heading"><p>02 / HOW IT WORKS</p><h2 id="method-title">One scenario, traced from source to screen.</h2><p>Terrain, sky geometry, deterministic compute and comparison stay separate so every result can be inspected instead of merely trusted.</p></div>
      <Timeline
        data={pipeline}
        title="How a scenario travels"
        description="Four stages between raw lunar data and a shareable comparison — each with explicit units, timestamps and validation state."
      />
    </section>

    <section className="landing-section landing-features" aria-labelledby="features-title">
      <div className="landing-section-heading"><p>03 / THE PRODUCT</p><h2 id="features-title">Compare the window, not a single instant.</h2><p>These are the same instruments the navigator exposes. Values shown in previews are visibly synthetic until the real engine and sourced datasets land.</p></div>
      <BentoGrid className="max-w-none">
        {features.map(item => <BentoGridItem key={item.title} title={item.title} description={item.description} header={item.header} icon={item.icon} className={item.span} />)}
      </BentoGrid>
      <p className="bento-note">Planned timeline view: mission-window scrubbing is structural only — no computed mission data is shown yet.</p>
    </section>

    <section className="landing-section landing-validation" aria-labelledby="validation-title">
      <div className="landing-section-heading"><p>04 / VALIDATION</p><h2 id="validation-title">Show what is known, tested and still missing.</h2></div>
      <div className="ledger">
        <div className="ledger-row"><span className="status-current">CURRENT</span><div><h3>Contract-checked inputs</h3><p>Schema, units, binary lengths and finite values are checked before mock data reaches the interface.</p></div></div>
        <div className="ledger-row"><span className="status-current">CURRENT</span><div><h3>Deterministic boundary</h3><p>The web adapter is shaped for the Rust/WASM engine; physics is not recreated in components or shaders.</p></div></div>
        <div className="ledger-row"><span className="status-next">NEXT</span><div><h3>Horizons comparison</h3><p>Real ephemeris output will be compared with JPL Horizons and reported with time and angular error.</p></div></div>
        <div className="ledger-row"><span className="status-next">NEXT</span><div><h3>Real terrain evidence</h3><p>LOLA-derived terrain, horizon masks and source manifests replace every clearly labelled synthetic fixture.</p></div></div>
      </div>
    </section>

    <section className="landing-section landing-team" aria-labelledby="team-title">
      <div className="landing-section-heading"><p>05 / TEAM</p><h2 id="team-title">Four disciplines, one inspectable scenario.</h2><p>Role initials are used until the team publishes its preferred names and portraits.</p></div>
      <div className="ledger team-ledger">
        {team.map(([initials, role, description]) => <div className="ledger-row" key={initials}><span className="team-initial">{initials}</span><div><h3>{role}</h3><p>{description}</p></div></div>)}
      </div>
    </section>

    <section className="landing-section landing-resources" aria-labelledby="resources-title">
      <div className="landing-section-heading"><p>06 / PRIMARY RESOURCES</p><h2 id="resources-title">Continue with the source tools.</h2></div>
      <div className="resource-list">
        {resources.map(([name, desc, href]) => <a key={href} href={href} target="_blank" rel="noreferrer"><span>{name}</span><small>{desc}</small><IconArrowWaveRightUp size={18} aria-hidden="true" className="resource-arrow"/></a>)}
      </div>
    </section>

    <section className="landing-final" aria-labelledby="final-title"><p>THE SAME CONTEXT, READY TO SHARE</p><h2 id="final-title">Choose a site. Move the date. See what changes.</h2><button type="button" onClick={onOpen}>Compare landing sites <span aria-hidden="true">↗</span></button><small>Synthetic demonstration data is labelled throughout.</small></section>
  </>;
}
