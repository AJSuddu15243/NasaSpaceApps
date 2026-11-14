import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { chooseHeroMode, type HeroCapability } from './flight';
import { LandingSections } from './LandingSections';
import './landing.css';

const MoonGlobe = lazy(() => import('./Globe3D'));

const MOON_CONFIG = {
  radius: 1.45,
  textureUrl: '/textures/moon_color.jpg',
  bumpMapUrl: '/textures/moon_elevation.jpg',
  bumpScale: 3,
  showAtmosphere: true,
  atmosphereColor: '#7e93b8',
  atmosphereIntensity: 1.4,
  atmosphereBlur: 3,
  autoRotateSpeed: 0.3,
  ambientIntensity: 0.22,
  pointLightIntensity: 2.6,
  southPoleMarker: true,
} as const;

export function LandingPage({ onOpen }: { onOpen: () => void }) {
  const [mode, setMode] = useState<'pending' | 'flight' | 'static'>('pending');
  const diveRef = useRef({ dive: 0 });

  useEffect(() => {
    const capability: HeroCapability = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      saveData: (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
      webgl: true,
    };
    const canvas = document.createElement('canvas');
    capability.webgl = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    canvas.remove();
    setMode(chooseHeroMode(capability));
  }, []);

  return <div className={`landing scene-${mode}`}>
    <div className="moon-backdrop" aria-hidden="true">
      {mode === 'flight' ? <Suspense fallback={null}><MoonGlobe config={MOON_CONFIG} className="h-full w-full" rigRef={diveRef} /></Suspense> : null}
      {mode === 'static' ? <div className="static-moon"><span /></div> : null}
    </div>

    <main id="main" className="landing-main">
      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="landing-copy">
          <p className="landing-kicker"><span />LROC IMAGERY · LOLA ELEVATION · JPL HORIZONS</p>
          <h1 id="hero-title">Choose where <em>light, warmth</em> and contact meet.</h1>
          <p className="landing-lede">A workspace for comparing south-pole landing sites and dates — by real terrain horizon, sky geometry and comm windows.</p>
          <p className="landing-summary">Pick candidate sites, move the date, and see which places keep a lander powered, temperate and in reach of Earth — with every assumption and every synthetic dataset labelled.</p>
          <div className="landing-actions">
            <button type="button" className="landing-cta" onClick={onOpen}>Explore the Moon <span aria-hidden="true">→</span></button>
            <a href="#challenge">Why the pole is hard</a>
          </div>
          <p className="landing-disclaimer">Synthetic demonstration data unless a dataset is marked real.</p>
        </div>
        <div className="landing-readout" aria-hidden="true">
          <span>SCENARIO / DEMO-01</span>
          <span>LROC IMAGERY + LOLA ELEVATION</span>
          <span>MOON_ME FRAME</span>
        </div>
      </section>
      <LandingSections onOpen={onOpen} diveRef={diveRef} />
    </main>
  </div>;
}
