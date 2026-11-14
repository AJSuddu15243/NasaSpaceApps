import { lazy, Suspense, useEffect, useState } from 'react';
import { chooseHeroMode, type HeroCapability } from './flight';
import './landing.css';

const MoonScene = lazy(() => import('./MoonScene'));

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function readCapability(): HeroCapability {
  const hints = navigator as NavigatorWithHints;
  return {
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: Boolean(hints.connection?.saveData),
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: hints.deviceMemory,
    webgl: supportsWebGL(),
  };
}

export function LandingPage({ onOpen }: { onOpen: () => void }) {
  const [mode, setMode] = useState<'static' | 'flight'>('static');
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setSceneReady(false);
      setMode(chooseHeroMode(readCapability()));
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return <main id="main" className="landing" tabIndex={-1}>
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="landing-copy">
        <p className="landing-kicker"><span aria-hidden="true" /> LUNAR SOUTH POLE / UTC</p>
        <h1 id="landing-title">A landing date<br />changes the <em>view.</em></h1>
        <p className="landing-lede">Compare sites. Find your window.</p>
        <p className="landing-summary">Explore how sunlight, terrain horizons and direct Earth contact shape a mission window—then share the exact scenario.</p>
        <div className="landing-actions">
          <button type="button" className="landing-cta" onClick={onOpen}>Open the navigator <span aria-hidden="true">↗</span></button>
          <a href="#landing-context">Why the pole changes</a>
        </div>
        <p className="landing-disclaimer">Independent NASA Space Apps prototype · no mission recommendation</p>
      </div>
      <div role="img" className={`landing-visual ${sceneReady ? 'scene-ready' : ''}`} aria-label={mode === 'flight' ? 'Animated approach to the lunar south pole' : 'Static lunar south-pole view'}>
        <div className="static-moon" aria-hidden="true"><span /></div>
        {mode === 'flight' && <Suspense fallback={null}><MoonScene onReady={() => setSceneReady(true)} /></Suspense>}
        <div className="landing-coordinate" aria-hidden="true"><span>SOUTH POLE</span><strong>90° S</strong></div>
      </div>
      <div className="landing-readout" aria-hidden="true"><span>01 / SITE</span><span>02 / DATE</span><span>03 / WINDOW</span><span>04 / COMPARE</span></div>
    </section>
    <section id="landing-context" className="landing-context" aria-labelledby="context-title">
      <p>WHY IT CHANGES</p>
      <h2 id="context-title">At the pole, the horizon decides what the sky can reach.</h2>
      <p>Low Sun angles create long shadows. Nearby terrain can interrupt both illumination and a direct line to Earth. A small change in place or time can change the usable window.</p>
    </section>
  </main>;
}
