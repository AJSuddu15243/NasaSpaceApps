import { useShell } from './store';
import { Button } from './ui';
export function Home() {
  const { navigate } = useShell();
  return <main id="main" className="home" tabIndex={-1}>
    <section className="home-hero"><div><p className="eyebrow">LUNAR LANDING SITE NAVIGATOR</p><h1>A landing date changes the view.</h1><p className="home-lede">Compare sites. Find your window.</p><p className="muted">Explore sunlight, terrain and Earth contact across a shared mission window. Start with a transparent, clearly labelled demo workspace.</p><Button onClick={() => navigate('/app')}>Open the navigator <span aria-hidden="true">↗</span></Button><p className="hint">Synthetic interface preview · no mission recommendation</p></div>
      <div className="home-orbit" aria-hidden="true"><svg viewBox="0 0 500 500" fill="none"><circle cx="250" cy="250" r="168"/><ellipse cx="250" cy="250" rx="74" ry="168"/><ellipse cx="250" cy="250" rx="168" ry="62"/><path d="M82 250h336M250 82v336"/><circle className="pole-dot" cx="250" cy="412" r="7"/></svg><span>SOUTH POLE / CHANGING HORIZONS</span></div>
    </section>
    <section className="home-principles" aria-label="What to compare"><article><span className="eyebrow">01 / SUNLIGHT</span><h2>Power through the window.</h2><p>Track illumination and the longest stretch of darkness, not just the conditions at landing.</p></article><article><span className="eyebrow">02 / EARTH CONTACT</span><h2>Keep Earth in view.</h2><p>Terrain can interrupt a direct link to Earth. Communication windows depend on the local horizon.</p></article><article><span className="eyebrow">03 / COMPARISON</span><h2>Change the date. Share the context.</h2><p>Your selected sites, mission window, weights and view travel together in a shareable URL.</p></article></section>
    <p className="home-note">This foundation preview does not yet contain measured terrain or a connected simulation engine.</p>
  </main>;
}
