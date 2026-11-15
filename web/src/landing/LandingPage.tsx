import Lenis from 'lenis';
import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import mark from '../brand/assets/mark.svg';
import { loadMoonTextures, type MoonTextures, type StageState } from './textures';
import { copyOpacity, formatLat, formatLon, sampleStage, stageDate, SITES } from './story';
import { awaitNavigatorEntry, preloadNavigator } from '../shell/preload';
import './landing.css';

const MoonStage = lazy(() => import('./MoonStage'));

const CHAPTERS = [
  { id: 'top', label: 'Lunar Window', hint: 'Scroll to descend' },
  { id: 'pole', label: 'The pole', hint: 'Keep scrolling' },
  { id: 'time', label: 'Time', hint: 'Scroll moves the Sun' },
  { id: 'sites', label: 'Sites', hint: 'Hover a site to illuminate it' },
  { id: 'earth', label: 'Earth', hint: 'Earth sits on the horizon' },
  { id: 'method', label: 'Method', hint: 'Data in, one answer out' },
  { id: 'team', label: 'Team', hint: 'Five people, one scenario' },
  { id: 'enter', label: 'Enter', hint: 'Select to enter the navigator' },
] as const;

const NAV = [['pole', 'Story'], ['sites', 'Sites'], ['method', 'Method'], ['team', 'Team']] as const;

const TEAM = [
  ['Anirvin Potaraju', 'Data pipeline', 'LOLA terrain and JPL Horizons ephemeris, checked against physics.'],
  ['Ananth Nambiar', 'Simulation engine', 'Rust compiled to WebAssembly. Same inputs, same hash.'],
  ['Shivang Patel', 'Navigator interface', 'Scenario state, comparison and the launch-delay control.'],
  ['Advait Chandrakar', '3D & terrain', 'Globe, polar terrain and shading driven by real elevation.'],
  ['Aniketh Bommareddy', 'Design & story', 'Brand, motion and this page.'],
] as const;

const LEDGER = [
  ['Terrain', 'LOLA LDEM, 80 m per pixel, 80° S to the pole', 'NASA PGDA · SHA-256 pinned', 'Verified'],
  ['Ephemeris', 'JPL Horizons DE441 in the MOON_ME frame, 43,824 hourly rows, 2026–2030', 'JPL SSD', 'Verified'],
  ['Horizon masks', '360 azimuth bins per site, terrain out to 150 km', 'Built from LOLA', 'Verified'],
  ['Engine', 'Sunlight, Earth contact and thermal estimate per hour, scored and hashed', 'Rust → WASM', 'Verified'],
] as const;

interface NavigatorHints extends Navigator { deviceMemory?: number; connection?: { saveData?: boolean } }

function canRender3D(): boolean {
  try {
    const hints = navigator as NavigatorHints;
    if (hints.connection?.saveData) return false;
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
}

/** Per-digit rolling numerals (only the digits that change move). */
function Odometer({ value, label }: { value: string; label: string }) {
  return <span className="odo" role="img" aria-label={label}>
    {value.split('').map((ch, i) => /\d/.test(ch)
      ? <span className="odo-digit" key={i} aria-hidden="true"><span style={{ transform: `translateY(${-Number(ch) * 10}%)` }}>{'0123456789'.split('').map(d => <i key={d}>{d}</i>)}</span></span>
      : <span className="odo-sep" key={i} aria-hidden="true">{ch}</span>)}
  </span>;
}

function Chapter({ index, id, className = '', children, copyRefs }: { index: number; id: string; className?: string; children: ReactNode; copyRefs: React.MutableRefObject<(HTMLElement | null)[]> }) {
  return <section id={id} className={`chapter chapter-${id} ${className}`} aria-labelledby={`${id}-title`} data-chapter={index}>
    <div className="chapter-copy" ref={el => { copyRefs.current[index] = el; }}>{children}</div>
  </section>;
}

export function LandingPage({ onOpen }: { onOpen: () => void }) {
  const state = useRef<StageState>({ chapter: 0, stepped: false, diveStart: null, hovered: null });
  const copyRefs = useRef<(HTMLElement | null)[]>([]);
  const labelRefs = useRef<(HTMLElement | null)[]>([]);
  const lenisRef = useRef<Lenis | null>(null);
  const [textures, setTextures] = useState<MoonTextures | null>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [credit, setCredit] = useState('');
  const [active, setActive] = useState(0);
  const [date, setDate] = useState('2027.01.15');
  const [hovered, setHovered] = useState<string | null>(null);
  const [diving, setDiving] = useState(false);
  const [entryError, setEntryError] = useState('');
  const entryRef = useRef<AbortController | null>(null);
  const entryStatusRef = useRef<HTMLDivElement>(null);
  const entryTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => () => entryRef.current?.abort(), []);
  useEffect(() => {
    if (diving) entryStatusRef.current?.focus();
    else entryTriggerRef.current?.focus();
  }, [diving]);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    state.current.stepped = reduced;
    if (!canRender3D()) { setWebgl(false); setLoaded(true); return; }
    const controller = new AbortController();
    loadMoonTextures(setProgress, controller.signal)
      .then(result => { setTextures(result); setCredit(result.credit); })
      .catch(() => { if (!controller.signal.aborted) { setWebgl(false); setLoaded(true); } });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = reduced ? null : new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    let frame = 0;
    let lastActive = -1;
    let lastDate = '';
    const tick = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>('.chapter'));
      const y = window.scrollY;
      let chapter = 0;
      sections.forEach((el, i) => {
        const top = el.offsetTop;
        const next = sections[i + 1]?.offsetTop ?? top + el.offsetHeight;
        if (y >= top) chapter = i + Math.min(1, (y - top) / Math.max(1, next - top));
      });
      chapter = Math.min(chapter, CHAPTERS.length - 1);
      state.current.chapter = chapter;
      copyRefs.current.forEach((el, i) => {
        if (!el) return;
        const o = copyOpacity(i, chapter);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${((1 - o) * (i < chapter ? -28 : 28)).toFixed(1)}px, 0)`;
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      });
      const nearest = Math.round(chapter);
      if (nearest !== lastActive) { lastActive = nearest; setActive(nearest); }
      const d = stageDate(sampleStage(chapter).sunLon).toISOString().slice(0, 10).replaceAll('-', '.');
      if (d !== lastDate) { lastDate = d; setDate(d); }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); lenis?.destroy() };
  }, []);

  const onSiteHover = useCallback((id: string | null) => { state.current.hovered = id; setHovered(id); }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView();
  };

  const warmNavigator = () => { void preloadNavigator().catch(() => { /* Entry reports download failures with a retry action. */ }); };

  const cancelEntry = () => {
    entryRef.current?.abort();
    entryRef.current = null;
    state.current.diveStart = null;
    setDiving(false);
    lenisRef.current?.start();
  };

  const enter = async () => {
    if (entryRef.current) return;
    entryTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const controller = new AbortController();
    entryRef.current = controller;
    setEntryError('');
    setDiving(true);
    const animate = !matchMedia('(prefers-reduced-motion: reduce)').matches && webgl;
    state.current.diveStart = animate ? performance.now() : null;
    lenisRef.current?.stop();
    try {
      await awaitNavigatorEntry(preloadNavigator(), controller.signal, animate ? 1250 : 0);
      if (controller.signal.aborted) return;
      window.scrollTo(0, 0);
      onOpen();
    } catch (error) {
      if (controller.signal.aborted) return;
      cancelEntry();
      setEntryError(error instanceof Error ? error.message : 'The navigator could not load. Try again.');
    }
  };

  const ready = loaded || (textures !== null && progress >= 1);

  return <div className={`lw ${ready ? 'is-ready' : ''} ${diving ? 'is-diving' : ''} ${webgl ? '' : 'no-webgl'}`} data-chapter={active}>
    <div className="lw-loader" aria-hidden={ready} role="status">
      <span>{ready ? 'READY' : 'LOADING'}</span>
      <i><b style={{ transform: `scaleX(${webgl ? progress : 1})` }} /></i>
      <small>LROC / LOLA · MOON_ME</small>
    </div>

    {webgl && textures && <Suspense fallback={null}><MoonStage state={state} textures={textures} onSiteHover={onSiteHover} labels={labelRefs} /></Suspense>}
    {!webgl && <div className="lw-static-moon" aria-hidden="true" />}
    <div className="lw-scrim" aria-hidden="true" />

    <div className="lw-site-labels" aria-hidden="true">
      {SITES.map((site, i) => <span key={site.id} ref={el => { labelRefs.current[i] = el; }} className={hovered === site.id ? 'is-hot' : ''}>
        <em>{String(i + 1).padStart(2, '0')}</em> {site.name}
      </span>)}
    </div>

    <header className="lw-header" inert={diving}>
      <a className="lw-brand" href="/" onClick={e => { e.preventDefault(); scrollTo('top'); }}>
        <img src={mark} alt="" /><span>Lunar Window</span>
      </a>
      <nav className="lw-pill" aria-label="Story chapters">
        {NAV.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={CHAPTERS[active].id === id ? 'true' : undefined} onClick={e => { e.preventDefault(); scrollTo(id); }}>{label}</a>)}
      </nav>
      <button type="button" className="lw-cta" onPointerEnter={warmNavigator} onFocus={warmNavigator} onClick={enter}>Open navigator <span aria-hidden="true">↗</span></button>
    </header>

    <main id="main" className="lw-story" tabIndex={-1} inert={diving}>
      <Chapter index={0} id="top" copyRefs={copyRefs}>
        <p className="micro">Lunar south pole · landing window planner</p>
        <h1 id="top-title">Land where<br />the <em>light</em> stays.</h1>
        <div className="hero-foot">
          <p>Compare Artemis south-pole sites by sunlight, Earth contact and terrain. Then move the arrival date and watch the window change.</p>
          <div className="hero-actions">
            <button type="button" className="btn-solid" onPointerEnter={warmNavigator} onFocus={warmNavigator} onClick={enter}>Open the navigator <span aria-hidden="true">↗</span></button>
            <button type="button" className="btn-text" onClick={() => scrollTo('pole')}>Scroll to descend <span aria-hidden="true">↓</span></button>
          </div>
        </div>
      </Chapter>

      <Chapter index={1} id="pole" copyRefs={copyRefs}>
        <h2 id="pole-title">At the pole, the Sun <em>skims</em> the horizon.</h2>
        <p className="body">From 2026 to 2030 the Sun never strays more than 1.59° from the lunar equator. Stand at the pole and it circles just above the ground, so a 1 km ridge 30 km away is enough to put a lander in shadow.</p>
        <dl className="stats">
          <div><dt>Sun latitude range</dt><dd>±1.59°</dd></div>
          <div><dt>Hourly Sun/Earth rows</dt><dd>43,824</dd></div>
          <div><dt>Terrain grid</dt><dd>80 m</dd></div>
        </dl>
      </Chapter>

      <Chapter index={2} id="time" copyRefs={copyRefs}>
        <h2 id="time-title">The same crater, two weeks later, is a <em>different</em> site.</h2>
        <p className="body">Light sweeps once around the pole every 29.5 days. A launch slip moves arrival into a different part of that cycle, so power and darkness change even when the coordinates don’t.</p>
        <div className="readout">
          <span className="micro">Arrival · UTC</span>
          <Odometer value={date} label={`Arrival date ${date}`} />
          <small>Sun and Earth on this globe are placed for this date by Astronomy Engine. The navigator uses the JPL Horizons table.</small>
        </div>
      </Chapter>

      <Chapter index={3} id="sites" className="align-right" copyRefs={copyRefs}>
        <h2 id="sites-title">Three Artemis regions. <em>One</em> comparison.</h2>
        <ol className="site-list">
          {SITES.map((site, i) => <li key={site.id} className={hovered === site.id ? 'is-hot' : ''} onMouseEnter={() => onSiteHover(site.id)} onMouseLeave={() => onSiteHover(null)}>
            <span className="micro">{String(i + 1).padStart(2, '0')}</span>
            <strong>{site.name}</strong>
            <span className="coords">{formatLat(site.lat)} · {formatLon(site.lon)}</span>
            <span className="elev">{site.elevation_m.toLocaleString('en-US')} m</span>
          </li>)}
        </ol>
        <p className="source">Region centres from NASA’s M2M Lunar Surface Data Book. Heights read from the LOLA 80 m grid.</p>
      </Chapter>

      <Chapter index={4} id="earth" copyRefs={copyRefs}>
        <h2 id="earth-title">Earth hangs on the <em>horizon</em>.</h2>
        <p className="body">Libration swings Earth up to 6.86° north or south over a month. From a polar site that can lift it clear of a ridge, or drop it behind one and cut direct-to-Earth contact.</p>
        <dl className="stats">
          <div><dt>Earth latitude swing</dt><dd>±6.86°</dd></div>
          <div><dt>Earth distance</dt><dd>357–407k km</dd></div>
        </dl>
      </Chapter>

      <Chapter index={5} id="method" copyRefs={copyRefs}>
        <h2 id="method-title">Real data in. One <em>repeatable</em> answer out.</h2>
        <ul className="ledger">
          {LEDGER.map(([name, what, source, status]) => <li key={name}>
            <span className="micro">{name}</span>
            <span>{what}</span>
            <small>{source}</small>
            <b className={status === 'Verified' ? 'ok' : 'wip'}>{status}</b>
          </li>)}
        </ul>
      </Chapter>

      <Chapter index={6} id="team" className="align-right" copyRefs={copyRefs}>
        <h2 id="team-title">Five people. <em>One</em> scenario.</h2>
        <ul className="team">
          {TEAM.map(([name, role, line]) => <li key={name}><strong>{name}</strong><span className="micro">{role}</span><p>{line}</p></li>)}
        </ul>
      </Chapter>

      <Chapter index={7} id="enter" className="align-center" copyRefs={copyRefs}>
        <h2 id="enter-title">Pick a site. Move the date.<br /><em>Read the horizon.</em></h2>
        <button type="button" className="btn-solid btn-large" onPointerEnter={warmNavigator} onFocus={warmNavigator} onClick={enter}>Enter the navigator <span aria-hidden="true">↗</span></button>
        <p className="fine">NASA Space Apps 2026 · independent team prototype, not a mission recommendation.</p>
        <nav className="source-links" aria-label="Data sources">
          <a href="https://quickmap.lroc.asu.edu/" target="_blank" rel="noreferrer">LROC QuickMap ↗</a>
          <a href="https://trek.nasa.gov/moon/" target="_blank" rel="noreferrer">NASA Moon Trek ↗</a>
          <a href="https://ssd.jpl.nasa.gov/horizons/" target="_blank" rel="noreferrer">JPL Horizons ↗</a>
          <a href="https://pgda.gsfc.nasa.gov/products/90" target="_blank" rel="noreferrer">PGDA LOLA ↗</a>
        </nav>
        {credit && <p className="fine credit">{credit.replace(/ Run scripts\S* [^.]*\./, '')}</p>}
      </Chapter>
    </main>
    <div className="lw-dive-veil" aria-hidden="true" />
    {(diving || entryError) && <div className="lw-entry-status" ref={entryStatusRef} tabIndex={-1} onKeyDown={event => { if (event.key === 'Escape') cancelEntry(); }}>
      <p role={entryError ? 'alert' : 'status'}>{entryError || 'Approaching mission control…'}</p>
      {entryError ? <button type="button" className="btn-text" onClick={enter}>Try again</button> : <button type="button" className="btn-text" onClick={cancelEntry}>Cancel entrance</button>}
    </div>}
  </div>;
}
