import { useRef, type MutableRefObject } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import './sections.css';

const team = [
  ['DA', 'Data and ephemeris', 'Source, normalize and validate lunar terrain and sky positions.'],
  ['EN', 'Simulation engineering', 'Keep horizon, illumination and contact calculations deterministic.'],
  ['3D', 'Scene and interaction', 'Turn the same inputs into legible spatial context.'],
  ['UX', 'Product and story', 'Make assumptions, trade-offs and missing data visible.'],
] as const;

const challenges = [
  {
    index: '01',
    title: 'Sunlight',
    body: 'The Sun skims the horizon for weeks at a time. Local ridges and crater rims decide whether a site sees light at all — and for how long.',
    metric: 'Longest continuous darkness is a first-class metric, not a footnote.',
  },
  {
    index: '02',
    title: 'Temperature',
    body: 'Two-week nights drop toward 100 K while sunlit ground soars past 390 K. Thermal survival depends on where a site spends its window.',
    metric: 'Hours below the survival threshold are counted per site.',
  },
  {
    index: '03',
    title: 'Earth contact',
    body: 'Earth never rises far above the polar horizon. Terrain that blocks the Sun often blocks the planet too — power and communications pull in opposite directions.',
    metric: 'Direct-to-Earth visibility and longest blackout are scored separately.',
  },
  {
    index: '04',
    title: 'Launch window',
    body: 'A landing date is a variable, not a constant. The same site can be brilliant in November and unreachable in February.',
    metric: 'Every comparison holds date, window length and weights fixed.',
  },
] as const;

const steps = [
  {
    index: '01',
    eyebrow: 'THE POLE NEVER SEES THE SUN',
    title: 'Long shadows, permanently.',
    body: 'At 90°S the Sun circles the horizon instead of crossing the sky. Crater rims and ridge lines decide which patches ever see light.',
  },
  {
    index: '02',
    eyebrow: 'EARTH DROPS BELOW THE HORIZON',
    title: 'Contact comes and goes.',
    body: 'Earth hangs barely above the terrain. The same ridges that shade a site can silence its radio link for hours at a stretch.',
  },
  {
    index: '03',
    eyebrow: 'EVERY SITE IS A TRADE-OFF',
    title: 'Power versus communication.',
    body: 'More sunlight usually means less Earth contact, and vice versa. The question is never “is this site good” — it is “good for which window”.',
  },
  {
    index: '04',
    eyebrow: 'LUNAR WINDOW',
    title: 'We map the window, not the hope.',
    body: 'Lunar Window compares candidate sites across dates using real terrain horizons and sky geometry — then shows its work.',
    cta: true,
  },
] as const;

const walkthrough = [
  ['01', 'Pick sites', 'Curated south-pole candidates or custom coordinates down to 80°S.'],
  ['02', 'Set the window', 'A UTC start time and mission length — up to a full year.'],
  ['03', 'Read the horizon', 'Terrain decides sunlight and Earth contact; nothing is averaged away.'],
  ['04', 'Compare and share', 'Metrics, statuses and countdowns side by side, all inside the URL.'],
] as const;

const technology = [
  ['Deterministic engine', 'A Rust/WASM core evaluates every site against the same inputs — no physics hidden in components or shaders.'],
  ['Contract-checked data', 'Terrain grids, horizon masks and ephemeris tables are schema-validated with explicit units before use.'],
  ['Inspectable state', 'The entire scenario lives in the URL: sites, date, window, weights and view reproduce exactly.'],
  ['Honest fallbacks', 'Synthetic fixtures are labelled, missing masks report unavailable, and engine outputs carry their assumptions.'],
] as const;

const resources = [
  ['LROC QuickMap', 'Lunar imagery and topography', 'https://quickmap.lroc.asu.edu/'],
  ['NASA Moon Trek', 'Interactive lunar exploration', 'https://trek.nasa.gov/moon/'],
  ['JPL Horizons', 'Sun and Earth ephemerides', 'https://ssd.jpl.nasa.gov/horizons/'],
] as const;

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div
    className={className}
    initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-12% 0px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >{children}</motion.div>;
}

function SequenceStep({ progress, index, eyebrow, title, body, cta, onOpen }: {
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  index: number; eyebrow: string; title: string; body: string; cta?: boolean; onOpen: () => void;
}) {
  const start = index * 0.235;
  const end = Math.min(start + 0.3, 1.05);
  const opacity = useTransform(progress, [start, start + 0.06, end - 0.06, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, start + 0.09, end - 0.05, end], [34, 0, 0, -20]);
  const clip = useTransform(progress, [start, start + 0.13, end - 0.04, end], ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)']);
  return <motion.div className="seq-step" style={{ opacity, y, clipPath: clip }}>
    <p className="seq-index">{index + 1} / 04</p>
    <p className="seq-eyebrow">{eyebrow}</p>
    <h3>{title}</h3>
    <p className="seq-body">{body}</p>
    {cta && <button type="button" className="seq-cta" onClick={onOpen}>Explore the workspace <span aria-hidden="true">→</span></button>}
  </motion.div>;
}

export function LandingSections({ onOpen, diveRef }: { onOpen: () => void; diveRef: MutableRefObject<{ dive: number }> }) {
  const sequenceRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sequenceRef, offset: ['start 85%', 'end 20%'] });
  useMotionValueEvent(scrollYProgress, 'change', value => { diveRef.current.dive = value; });

  return <>
    <section ref={sequenceRef} id="challenge" className="landing-challenge" aria-label="Why the lunar south pole is hard">
      <div className="seq-sticky">
        {steps.map((step, index) => <SequenceStep key={step.title} progress={scrollYProgress} index={index} eyebrow={step.eyebrow} title={step.title} body={step.body} cta={'cta' in step && step.cta} onOpen={onOpen} />)}
      </div>
    </section>

    <section className="landing-editorial" aria-labelledby="editorial-title">
      <Reveal><p className="landing-eyebrow">THE PROBLEM</p><h2 id="editorial-title">Four forces decide whether a site works.</h2></Reveal>
      <div className="editorial-list">
        {challenges.map(item => <Reveal key={item.index} className="editorial-row">
          <span className="editorial-index">{item.index}</span>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
          <p className="editorial-metric">{item.metric}</p>
        </Reveal>)}
      </div>
    </section>

    <section className="landing-preview" aria-labelledby="preview-title">
      <Reveal className="preview-heading">
        <p className="landing-eyebrow">THE PRODUCT</p>
        <h2 id="preview-title">This is the actual workspace.</h2>
        <p>The navigator below is the live application with its synthetic demo dataset — terrain scene, site comparison and shareable scenario state.</p>
      </Reveal>
      <Reveal delay={0.1} className="app-frame">
        <iframe src="/app" title="Lunar Window workspace — live preview" loading="lazy" tabIndex={-1} aria-hidden="true" />
        <div className="app-frame-bar"><span><i /> LIVE PREVIEW</span><span>Synthetic demo data · no landing recommendation</span></div>
      </Reveal>
    </section>

    <section className="landing-walkthrough" aria-labelledby="walkthrough-title">
      <Reveal><p className="landing-eyebrow">MISSION WALKTHROUGH</p><h2 id="walkthrough-title">From candidate to comparison in four moves.</h2></Reveal>
      <div className="walk-grid">
        {walkthrough.map(([index, title, body]) => <Reveal key={index} className="walk-step">
          <span className="walk-index">{index}</span>
          <h3>{title}</h3>
          <p>{body}</p>
        </Reveal>)}
      </div>
    </section>

    <section className="landing-technology" aria-labelledby="tech-title">
      <Reveal><p className="landing-eyebrow">TECHNOLOGY</p><h2 id="tech-title">Built so a result can be audited.</h2></Reveal>
      <div className="tech-list">
        {technology.map(([title, body]) => <Reveal key={title} className="tech-row">
          <h3>{title}</h3>
          <p>{body}</p>
        </Reveal>)}
      </div>
    </section>

    <section className="landing-team-section" aria-labelledby="team-title">
      <Reveal><p className="landing-eyebrow">TEAM</p><h2 id="team-title">Four disciplines, one inspectable scenario.</h2><p className="team-note">Role initials are used until the team publishes its preferred names and portraits.</p></Reveal>
      <div className="team-grid">
        {team.map(([initials, role, description]) => <Reveal key={initials} className="team-card">
          <span className="team-initial">{initials}</span>
          <h3>{role}</h3>
          <p>{description}</p>
        </Reveal>)}
      </div>
    </section>

    <section className="landing-resources" aria-labelledby="resources-title">
      <Reveal><p className="landing-eyebrow">PRIMARY RESOURCES</p><h2 id="resources-title">Continue with the source tools.</h2></Reveal>
      <div className="resource-list">
        {resources.map(([name, desc, href]) => <Reveal key={href} className="resource-row">
          <a href={href} target="_blank" rel="noreferrer"><span>{name}</span><small>{desc}</small><b aria-hidden="true">↗</b></a>
        </Reveal>)}
      </div>
    </section>

    <section className="landing-final" aria-labelledby="final-title">
      <Reveal>
        <p className="final-eyebrow">THE SAME CONTEXT, READY TO SHARE</p>
        <h2 id="final-title">Choose a site. Move the date. See what changes.</h2>
        <button type="button" onClick={onOpen}>Compare landing sites <span aria-hidden="true">→</span></button>
        <small>Synthetic demonstration data is labelled throughout the workspace.</small>
      </Reveal>
    </section>
  </>;
}
